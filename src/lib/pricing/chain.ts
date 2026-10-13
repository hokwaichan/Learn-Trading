import type { OptionContract, OptionQuote } from '@/types';
import { bsGreeks, bsPrice, DAYS_PER_YEAR } from './blackScholes';
import { roundStrike, strikeStepFor } from './templates';

const DAY_MS = 86_400_000;
/** Expiries are Fridays at 08:00 UTC, the convention on the large crypto options venues. */
const EXPIRY_HOUR_UTC = 8;
/** Earliest each simulated expiry can be, in days from now. Each is then moved to the next Friday. */
const EXPIRY_OFFSETS = [1, 10, 26, 56, 86];

export interface ChainRow {
  strike: number;
  call: OptionQuote;
  put: OptionQuote;
  /** The strike nearest the current price. */
  atm: boolean;
}

export interface ChainExpiry {
  expiry: number;
  /** Days until expiry, as a fraction. */
  days: number;
  rows: ChainRow[];
}

export interface ChainInput {
  underlying: string;
  spot: number;
  /** Annual volatility as a fraction, usually the historical volatility. */
  volatility: number;
  now: number;
  rate: number;
  /** Units of the underlying per contract. */
  multiplier: number;
  /** Smallest price step of the underlying, for rounding premiums. */
  tickSize?: number;
  /** Strikes on each side of the money. */
  width?: number;
}

/** The first Friday 08:00 UTC at or after a time. */
export function nextFriday(fromMs: number): number {
  const d = new Date(fromMs);
  const day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), EXPIRY_HOUR_UTC);
  const ahead = (5 - d.getUTCDay() + 7) % 7;
  const friday = day + ahead * DAY_MS;
  return friday >= fromMs ? friday : friday + 7 * DAY_MS;
}

/** Five expiries from this week to about three months out, each on a Friday at least a day away, none repeated. */
export function chainExpiries(now: number): number[] {
  const out: number[] = [];
  for (const offset of EXPIRY_OFFSETS) {
    let expiry = nextFriday(now + offset * DAY_MS);
    while (out.includes(expiry) || (out.length && expiry <= out[out.length - 1])) expiry += 7 * DAY_MS;
    out.push(expiry);
  }
  return out;
}

export function contractId(underlying: string, expiry: number, strike: number, type: 'call' | 'put'): string {
  const date = new Date(expiry).toISOString().slice(0, 10).replaceAll('-', '');
  return `${underlying}-${date}-${strike}-${type === 'call' ? 'C' : 'P'}`;
}

/**
 * Implied volatility for a strike in the simulated chain: the base
 * volatility with a mild smile, higher away from the money and a little
 * higher for lower strikes, as real chains usually show.
 */
export function smileVolatility(base: number, spot: number, strike: number, years: number): number {
  if (!(base > 0) || !(years > 0)) return base;
  // Distance from the money in standard deviations.
  const m = Math.log(strike / spot) / (base * Math.sqrt(years));
  const factor = 1 + 0.03 * m * m - 0.02 * m;
  return base * Math.min(2, Math.max(0.6, factor));
}

/** The gap between bid and ask in the simulated chain: 2% of the price, never less than one price step. */
export function simulatedSpread(mid: number, tickSize: number): number {
  return Math.max(tickSize, mid * 0.02);
}

const roundTo = (value: number, step: number) => Number((Math.round(value / step) * step).toFixed(10));

/** A simulated quote for one contract at a given price and time. */
export function quoteContract(contract: OptionContract, spot: number, baseVolatility: number, now: number, rate: number, tickSize = 0.01, iv?: number): OptionQuote {
  const years = Math.max(0, contract.expiry - now) / DAY_MS / DAYS_PER_YEAR;
  const volatility = iv ?? smileVolatility(baseVolatility, spot, contract.strike, years);
  const input = { type: contract.type, spot, strike: contract.strike, years, volatility, rate };
  const mid = bsPrice(input);
  const half = simulatedSpread(mid, tickSize) / 2;
  const itm = contract.type === 'call' ? spot > contract.strike : spot < contract.strike;
  return {
    contract,
    bid: Math.max(0, roundTo(mid - half, tickSize)),
    ask: Math.max(tickSize, roundTo(mid + half, tickSize)),
    mid,
    iv: volatility,
    greeks: bsGreeks(input),
    moneyness: Math.abs(spot - contract.strike) / spot < 0.005 ? 'ATM' : itm ? 'ITM' : 'OTM',
    simulated: true,
  };
}

/**
 * Builds a simulated option chain: strikes around the current price for five
 * expiries, each priced with Black-Scholes. These are model prices, not
 * market quotes.
 */
export function buildChain(input: ChainInput): ChainExpiry[] {
  const { underlying, spot, volatility, now, rate, multiplier, tickSize = 0.01, width = 12 } = input;
  if (!(spot > 0) || !(volatility > 0)) return [];
  const step = strikeStepFor(spot);
  const centre = roundStrike(spot, step);
  const strikes: number[] = [];
  for (let i = -width; i <= width; i++) {
    const strike = roundStrike(centre + i * step, step);
    if (strike > 0) strikes.push(strike);
  }
  return chainExpiries(now).map((expiry) => ({
    expiry,
    days: (expiry - now) / DAY_MS,
    rows: strikes.map((strike) => {
      const make = (type: 'call' | 'put'): OptionContract => ({ id: contractId(underlying, expiry, strike, type), underlying, type, strike, expiry, style: 'european', multiplier });
      return {
        strike,
        call: quoteContract(make('call'), spot, volatility, now, rate, tickSize),
        put: quoteContract(make('put'), spot, volatility, now, rate, tickSize),
        atm: strike === centre,
      };
    }),
  }));
}

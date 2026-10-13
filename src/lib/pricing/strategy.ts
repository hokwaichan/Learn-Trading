import type { Greeks, OptionLeg, PayoffPoint, Strategy } from '@/types';
import { bsGreeks, bsPrice, DAYS_PER_YEAR, normPdf } from './blackScholes';
import { breakEvens as expiryBreakEvens, payoffExtremes, type PayoffLeg } from './payoff';

const DAY_MS = 86_400_000;
const sign = (side: 'buy' | 'sell') => (side === 'buy' ? 1 : -1);
const yearsBetween = (from: number, to: number) => Math.max(0, to - from) / DAY_MS / DAYS_PER_YEAR;

/** The most legs a strategy can have, not counting the stock leg. */
export const MAX_LEGS = 4;

/** How a leg's volatility is chosen when valuing a strategy. Defaults to the volatility it was opened at. */
export type IvOf = (leg: OptionLeg) => number;
const entryIv: IvOf = (leg) => leg.entryIv;

/** The strategy as the simple legs the expiry-payoff maths works on. */
export function toPayoffLegs(strategy: Pick<Strategy, 'legs' | 'stock'>): PayoffLeg[] {
  const legs: PayoffLeg[] = strategy.legs.map((leg) => ({
    kind: 'option',
    direction: sign(leg.side),
    quantity: leg.quantity,
    type: leg.contract.type,
    strike: leg.contract.strike,
    entryPrice: leg.entryPrice,
    multiplier: leg.contract.multiplier,
  }));
  if (strategy.stock) legs.push({ kind: 'stock', direction: sign(strategy.stock.side), quantity: strategy.stock.quantity, entryPrice: strategy.stock.entryPrice });
  return legs;
}

/** Premium received minus premium paid. Positive is a credit, negative a debit. */
export function netPremium(strategy: Pick<Strategy, 'legs'>): number {
  return strategy.legs.reduce((sum, leg) => sum - sign(leg.side) * leg.quantity * leg.contract.multiplier * leg.entryPrice, 0);
}

/** What was paid to put the whole strategy on, stock included. Negative when it brought money in. */
export function entryValue(strategy: Pick<Strategy, 'legs' | 'stock'>): number {
  const stock = strategy.stock ? sign(strategy.stock.side) * strategy.stock.quantity * strategy.stock.entryPrice : 0;
  return stock - netPremium(strategy);
}

/** The first expiry among the legs, or null with no option legs. */
export function nearestExpiry(strategy: Pick<Strategy, 'legs'>): number | null {
  return strategy.legs.length ? Math.min(...strategy.legs.map((l) => l.contract.expiry)) : null;
}

export function hasSingleExpiry(strategy: Pick<Strategy, 'legs'>): boolean {
  return new Set(strategy.legs.map((l) => l.contract.expiry)).size <= 1;
}

/**
 * What the strategy is worth at a given underlying price and time, by the
 * model: each option at its Black-Scholes price (its exercise value once
 * expired) plus the stock leg at the underlying price.
 */
export function strategyValue(strategy: Pick<Strategy, 'legs' | 'stock'>, spot: number, at: number, rate: number, ivOf: IvOf = entryIv): number {
  const options = strategy.legs.reduce((sum, leg) => {
    const price = bsPrice({ type: leg.contract.type, spot, strike: leg.contract.strike, years: yearsBetween(at, leg.contract.expiry), volatility: ivOf(leg), rate });
    return sum + sign(leg.side) * leg.quantity * leg.contract.multiplier * price;
  }, 0);
  const stock = strategy.stock ? sign(strategy.stock.side) * strategy.stock.quantity * spot : 0;
  return options + stock;
}

/** Profit or loss against the entry cost, at a given underlying price and time. */
export function strategyPnl(strategy: Pick<Strategy, 'legs' | 'stock'>, spot: number, at: number, rate: number, ivOf: IvOf = entryIv): number {
  return strategyValue(strategy, spot, at, rate, ivOf) - entryValue(strategy);
}

/**
 * Greeks of the whole position, in dollars per unit of change:
 *   delta  per 1.00 move in the underlying
 *   gamma  change in delta per 1.00 move
 *   theta  per calendar day
 *   vega   per 1 percentage point of volatility
 */
export function strategyGreeks(strategy: Pick<Strategy, 'legs' | 'stock'>, spot: number, at: number, rate: number, ivOf: IvOf = entryIv): Greeks {
  const total: Greeks = { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  for (const leg of strategy.legs) {
    const g = bsGreeks({ type: leg.contract.type, spot, strike: leg.contract.strike, years: yearsBetween(at, leg.contract.expiry), volatility: ivOf(leg), rate });
    const size = sign(leg.side) * leg.quantity * leg.contract.multiplier;
    total.delta += g.delta * size;
    total.gamma += g.gamma * size;
    total.theta += g.theta * size;
    total.vega += g.vega * size;
    total.rho += g.rho * size;
  }
  if (strategy.stock) total.delta += sign(strategy.stock.side) * strategy.stock.quantity;
  return total;
}

/** The price range worth drawing: wide enough to show every strike and a fair move either side. */
export function payoffRange(strategy: Pick<Strategy, 'legs'>, spot: number): { from: number; to: number } {
  const strikes = strategy.legs.map((l) => l.contract.strike);
  const low = Math.min(spot, ...strikes);
  const high = Math.max(spot, ...strikes);
  const pad = Math.max((high - low) * 0.6, spot * 0.2);
  return { from: Math.max(spot * 0.01, low - pad), to: high + pad };
}

function curve(from: number, to: number, strikes: number[], pnl: (price: number) => number, steps = 120): PayoffPoint[] {
  const prices = new Set<number>();
  for (let i = 0; i <= steps; i++) prices.add(from + ((to - from) * i) / steps);
  for (const k of strikes) if (k >= from && k <= to) prices.add(k);
  return [...prices].sort((a, b) => a - b).map((price) => ({ price, pnl: pnl(price) }));
}

export interface AnalysisInput {
  spot: number;
  now: number;
  rate: number;
  /** The date for the second curve. Defaults to now. */
  at?: number;
  /** Volatility per leg for the second curve and the Greeks. Defaults to each leg's entry volatility. */
  ivOf?: IvOf;
}

export interface Analysis {
  /** Positive = credit received, negative = debit paid. */
  netPremium: number;
  maxProfit: number | 'unlimited';
  maxLoss: number | 'unlimited';
  breakEvens: number[];
  greeks: Greeks;
  /** Profit or loss at the first expiry. */
  payoffAtExpiry: PayoffPoint[];
  /** Profit or loss on the chosen date, by the model. */
  payoffAtDate: PayoffPoint[];
  range: { from: number; to: number };
  /**
   * True when legs expire on different dates. The "at expiry" figures are
   * then taken at the first expiry with later legs valued by the model, and
   * the maximum profit and loss are read off the drawn range.
   */
  mixedExpiries: boolean;
}

/** Everything the builder shows about a strategy. Null when it has no legs at all. */
export function analyzeStrategy(strategy: Pick<Strategy, 'legs' | 'stock'>, input: AnalysisInput): Analysis | null {
  if (strategy.legs.length === 0 && !strategy.stock) return null;
  const { spot, now, rate, at = now, ivOf = entryIv } = input;
  const range = payoffRange(strategy, spot);
  const strikes = strategy.legs.map((l) => l.contract.strike);
  const expiry = nearestExpiry(strategy) ?? now;
  const mixed = !hasSingleExpiry(strategy);
  const atExpiry = (price: number) => strategyPnl(strategy, price, expiry, rate, ivOf);
  const payoffAtExpiry = curve(range.from, range.to, strikes, atExpiry);
  const payoffAtDate = curve(range.from, range.to, strikes, (price) => strategyPnl(strategy, price, Math.min(at, expiry), rate, ivOf));

  let extremes: { maxProfit: number | 'unlimited'; maxLoss: number | 'unlimited' };
  let evens: number[];
  if (mixed) {
    const wide = curve(spot * 0.05, spot * 4, strikes, atExpiry, 400);
    extremes = { maxProfit: Math.max(...wide.map((p) => p.pnl)), maxLoss: -Math.min(...wide.map((p) => p.pnl)) };
    evens = [];
    for (let i = 1; i < wide.length; i++) {
      const a = wide[i - 1];
      const b = wide[i];
      if (a.pnl * b.pnl < 0) evens.push(a.price + ((b.price - a.price) * -a.pnl) / (b.pnl - a.pnl));
    }
  } else {
    const legs = toPayoffLegs(strategy);
    extremes = payoffExtremes(legs);
    evens = expiryBreakEvens(legs, 0, Math.max(range.to, spot * 4));
  }

  return {
    netPremium: netPremium(strategy),
    maxProfit: extremes.maxProfit,
    maxLoss: extremes.maxLoss,
    breakEvens: evens,
    greeks: strategyGreeks(strategy, spot, Math.min(at, expiry), rate, ivOf),
    payoffAtExpiry,
    payoffAtDate,
    range,
    mixedExpiries: mixed,
  };
}

/**
 * The chance the strategy shows a profit at its first expiry, if the
 * underlying follows the model's assumption: log-normal moves at the given
 * volatility, drifting at the risk-free rate. A model figure, not a forecast.
 */
export function probabilityOfProfit(strategy: Pick<Strategy, 'legs' | 'stock'>, spot: number, now: number, rate: number, volatility: number, ivOf: IvOf = entryIv): number | null {
  const expiry = nearestExpiry(strategy);
  if (expiry == null || !(volatility > 0) || !(spot > 0)) return null;
  const years = yearsBetween(now, expiry);
  if (!(years > 0)) return strategyPnl(strategy, spot, expiry, rate, ivOf) > 0 ? 1 : 0;
  const drift = (rate - (volatility * volatility) / 2) * years;
  const spread = volatility * Math.sqrt(years);
  const dz = 0.01;
  let probability = 0;
  for (let z = -6; z <= 6; z += dz) {
    const price = spot * Math.exp(drift + spread * z);
    if (strategyPnl(strategy, price, expiry, rate, ivOf) > 0) probability += normPdf(z) * dz;
  }
  return Math.min(1, Math.max(0, probability));
}

/**
 * Money that must be free in the account to hold the strategy.
 *
 * - Limited risk: the most it can lose at expiry.
 * - Unlimited risk (uncovered short calls): 20% of the value of the
 *   underlying those calls cover, plus the premium received. A rough
 *   stand-in for a broker's margin rules.
 */
export function marginRequirement(strategy: Pick<Strategy, 'legs' | 'stock'>, spot: number): number {
  const legs = toPayoffLegs(strategy);
  const { maxLoss } = payoffExtremes(legs);
  if (maxLoss !== 'unlimited' && hasSingleExpiry(strategy)) return Math.max(0, maxLoss);
  // Units of the underlying left exposed above the highest strike.
  const exposed = -legs.reduce((sum, leg) => sum + (leg.kind === 'stock' || leg.type === 'call' ? leg.quantity * (leg.multiplier ?? 1) * leg.direction : 0), 0);
  const debit = Math.max(0, entryValue(strategy));
  return Math.max(debit, 0.2 * spot * Math.max(0, exposed) + Math.max(0, netPremium(strategy)));
}

import { bsPrice, DAYS_PER_YEAR, intrinsicValue, normCdf, type OptionType } from '@/lib/pricing/blackScholes';

// The arithmetic behind the Calculators page that is not already part of
// the trading or pricing code. Position size, risk/reward, break-even win
// rate and liquidation price live in lib/trading.

export interface CompoundInput {
  start: number;
  /** Growth per period as a percentage: 5 means 5%. May be negative. */
  ratePct: number;
  periods: number;
  /** Added at the end of every period. May be negative for withdrawals. */
  contribution?: number;
}

export interface CompoundResult {
  final: number;
  /** Starting amount plus everything added. */
  paidIn: number;
  /** What growth alone produced: final minus paid in. */
  growth: number;
  /** Balance at the start and after each period. */
  series: number[];
}

/** Compound growth: each period's gain is added to the balance and earns in the next. */
export function compound({ start, ratePct, periods, contribution = 0 }: CompoundInput): CompoundResult {
  const count = Math.max(0, Math.floor(periods));
  const series = [start];
  let balance = start;
  for (let i = 0; i < count; i++) {
    balance = balance * (1 + ratePct / 100) + contribution;
    series.push(balance);
  }
  const paidIn = start + contribution * count;
  return { final: balance, paidIn, growth: balance - paidIn, series };
}

/** Periods needed to double at a steady rate. Infinity when the rate is not positive. */
export function periodsToDouble(ratePct: number): number {
  return ratePct > 0 ? Math.log(2) / Math.log(1 + ratePct / 100) : Infinity;
}

export interface PriceProbability {
  /** Chance of finishing above the target. */
  above: number;
  below: number;
  /** The range the price finishes inside about two times in three (one standard deviation). */
  oneSigma: { low: number; high: number };
}

/**
 * The chance a price finishes above or below a target after some days, if
 * it moves log-normally at the given volatility and drifts at the risk-free
 * rate. This is the assumption inside option prices, not a forecast.
 */
export function priceProbability(spot: number, target: number, days: number, volatility: number, rate = 0): PriceProbability | null {
  if (!(spot > 0) || !(target > 0) || !(days > 0) || !(volatility > 0)) return null;
  const years = days / DAYS_PER_YEAR;
  const spread = volatility * Math.sqrt(years);
  const drift = (rate - (volatility * volatility) / 2) * years;
  const d2 = (Math.log(spot / target) + drift) / spread;
  const above = normCdf(d2);
  return { above, below: 1 - above, oneSigma: { low: spot * Math.exp(drift - spread), high: spot * Math.exp(drift + spread) } };
}

export interface OptionOutcomeInput {
  type: OptionType;
  side: 'buy' | 'sell';
  spot: number;
  strike: number;
  /** Days until expiry today. */
  days: number;
  /** Annual volatility as a fraction. */
  volatility: number;
  rate: number;
  /** Premium per unit. Leave out to use the model price. */
  premium?: number;
  contracts: number;
  /** Units of the underlying per contract. */
  multiplier: number;
  /** The price to test. */
  targetPrice: number;
  /** Days from now to test it at. At or beyond `days` means at expiry. */
  targetDays: number;
}

export interface OptionOutcome {
  /** Premium per unit used. */
  premium: number;
  /** Paid (buyer) or received (seller), for the whole position. */
  premiumTotal: number;
  /** Model value per unit at the target price and date. */
  valueThen: number;
  pnl: number;
  /** Profit or loss if the target price is where it finishes at expiry. */
  pnlAtExpiry: number;
  breakEven: number;
  /** Largest possible loss, or 'unlimited' for a sold call. */
  maxLoss: number | 'unlimited';
  maxProfit: number | 'unlimited';
}

/** What one option position is worth at a chosen price and date, and at expiry. */
export function optionOutcome(input: OptionOutcomeInput): OptionOutcome | null {
  const { type, side, spot, strike, days, volatility, rate, contracts, multiplier, targetPrice, targetDays } = input;
  if (!(spot > 0) || !(strike > 0) || !(days > 0) || !(volatility > 0) || !(contracts > 0) || !(multiplier > 0) || !(targetPrice > 0)) return null;
  const premium = input.premium != null && input.premium >= 0 ? input.premium : bsPrice({ type, spot, strike, years: days / DAYS_PER_YEAR, volatility, rate });
  const size = contracts * multiplier;
  const direction = side === 'buy' ? 1 : -1;
  const remaining = Math.max(0, days - Math.max(0, targetDays));
  const valueThen = bsPrice({ type, spot: targetPrice, strike, years: remaining / DAYS_PER_YEAR, volatility, rate });
  const call = type === 'call';
  const buyer = side === 'buy';
  return {
    premium,
    premiumTotal: premium * size,
    valueThen,
    pnl: (valueThen - premium) * size * direction,
    pnlAtExpiry: (intrinsicValue(type, targetPrice, strike) - premium) * size * direction,
    breakEven: call ? strike + premium : strike - premium,
    maxLoss: buyer ? premium * size : call ? 'unlimited' : Math.max(0, strike - premium) * size,
    maxProfit: buyer ? (call ? 'unlimited' : Math.max(0, strike - premium) * size) : premium * size,
  };
}

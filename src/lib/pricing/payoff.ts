import type { PayoffPoint } from '@/types';
import { intrinsicValue, type OptionType } from './blackScholes';

/** One leg of a strategy, reduced to what the payoff at expiry needs. */
export interface PayoffLeg {
  kind: 'option' | 'stock';
  /** +1 for bought (long), -1 for sold (short). */
  direction: 1 | -1;
  quantity: number;
  /** Options only. */
  type?: OptionType;
  strike?: number;
  /** Premium paid or received per unit (options), or the stock entry price. */
  entryPrice: number;
  /** Units of the underlying per contract. Defaults to 1. */
  multiplier?: number;
}

/** Profit or loss of one leg if the underlying finishes at `price` on expiry day. */
export function legPnlAtExpiry(leg: PayoffLeg, price: number): number {
  const size = leg.quantity * (leg.multiplier ?? 1) * leg.direction;
  if (leg.kind === 'stock') return (price - leg.entryPrice) * size;
  return (intrinsicValue(leg.type!, price, leg.strike!) - leg.entryPrice) * size;
}

export function strategyPnlAtExpiry(legs: PayoffLeg[], price: number): number {
  return legs.reduce((sum, leg) => sum + legPnlAtExpiry(leg, price), 0);
}

/** Evenly spaced payoff curve between two prices, with every strike included exactly. */
export function payoffCurve(legs: PayoffLeg[], from: number, to: number, steps = 120): PayoffPoint[] {
  const prices = new Set<number>();
  for (let i = 0; i <= steps; i++) prices.add(from + ((to - from) * i) / steps);
  for (const leg of legs) if (leg.strike != null && leg.strike >= from && leg.strike <= to) prices.add(leg.strike);
  return [...prices].sort((a, b) => a - b).map((price) => ({ price, pnl: strategyPnlAtExpiry(legs, price) }));
}

/** Prices at which the strategy neither makes nor loses money at expiry. */
export function breakEvens(legs: PayoffLeg[], from: number, to: number): number[] {
  const curve = payoffCurve(legs, from, to, 400);
  const out: number[] = [];
  for (let i = 1; i < curve.length; i++) {
    const a = curve[i - 1];
    const b = curve[i];
    if (a.pnl === 0) out.push(a.price);
    else if (a.pnl * b.pnl < 0) out.push(a.price + ((b.price - a.price) * -a.pnl) / (b.pnl - a.pnl));
  }
  const last = curve[curve.length - 1];
  if (last.pnl === 0) out.push(last.price);
  // Merge points that are the same break-even found twice.
  return out.filter((p, i) => i === 0 || Math.abs(p - out[i - 1]) > 1e-6);
}

/**
 * Largest gain and loss at expiry. A side is 'unlimited' when the payoff is
 * still growing in that direction as price runs to zero or upwards without
 * bound, which is decided from the slope beyond the outermost strike.
 */
export function payoffExtremes(legs: PayoffLeg[]): { maxProfit: number | 'unlimited'; maxLoss: number | 'unlimited' } {
  const strikes = legs.filter((l) => l.strike != null).map((l) => l.strike!);
  const reference = strikes.length ? Math.max(...strikes) : Math.max(1, ...legs.map((l) => l.entryPrice));
  const candidates = [0, ...strikes].map((p) => strategyPnlAtExpiry(legs, p));
  // Slope above every strike: stock and calls move one-for-one, puts are worthless.
  const upSlope = legs.reduce((sum, leg) => {
    const size = leg.quantity * (leg.multiplier ?? 1) * leg.direction;
    return sum + (leg.kind === 'stock' || leg.type === 'call' ? size : 0);
  }, 0);
  const far = strategyPnlAtExpiry(legs, reference * 2 + 1);
  const best = Math.max(...candidates, far);
  const worst = Math.min(...candidates, far);
  const round = (n: number) => (Math.abs(n) < 1e-9 ? 0 : n);
  return {
    maxProfit: upSlope > 1e-12 ? 'unlimited' : round(best),
    maxLoss: upSlope < -1e-12 ? 'unlimited' : round(-worst),
  };
}

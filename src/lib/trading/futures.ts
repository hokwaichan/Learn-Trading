import type { Direction } from '@/types';

/** Perpetual futures charge funding every eight hours, at 00:00, 08:00 and 16:00 UTC. */
export const FUNDING_INTERVAL_MS = 8 * 3_600_000;
/** Used when the real funding rate is not available: 0.01% per eight hours, paid by longs. */
export const DEFAULT_FUNDING_RATE = 0.0001;
/** Share of the position's value that must stay as margin. One flat rate, where real exchanges use tiers. */
export const DEFAULT_MAINTENANCE_MARGIN_RATE = 0.005;

/**
 * The price at which an isolated position is liquidated: the loss has eaten
 * the margin down to the maintenance margin.
 *
 * At 10x a long puts up 10% of the position's value. With a 0.5% maintenance
 * rate it is liquidated after a 9.5% fall, at entry x (1 - 1/10 + 0.005).
 */
export function liquidationPrice(direction: Direction, entryPrice: number, leverage: number, maintenanceMarginRate: number): number {
  const distance = 1 / leverage - maintenanceMarginRate;
  return direction === 'long' ? Math.max(0, entryPrice * (1 - distance)) : entryPrice * (1 + distance);
}

/** How many funding times fall after `fromMs` and at or before `toMs`. */
export function fundingPeriods(fromMs: number, toMs: number, intervalMs = FUNDING_INTERVAL_MS): number {
  if (toMs <= fromMs) return 0;
  return Math.floor(toMs / intervalMs) - Math.floor(fromMs / intervalMs);
}

/**
 * One funding payment. Positive means the position pays, negative means it
 * receives. With a positive rate longs pay shorts; with a negative rate
 * shorts pay longs.
 */
export function fundingPayment(direction: Direction, notional: number, rate: number): number {
  return (direction === 'long' ? 1 : -1) * Math.abs(notional) * rate;
}

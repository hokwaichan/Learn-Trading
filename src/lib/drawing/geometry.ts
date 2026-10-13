import type { Candle, DrawingPoint } from '@/types';

/**
 * Drawings are stored as (time, price) points so they survive a timeframe
 * change. The chart positions things by "logical index" (0 = first candle,
 * fractional and out-of-range values allowed), so these two functions convert
 * between a time and a logical index for a given candle list.
 *
 * Markets have gaps (weekends, holidays), so inside the data the nearest
 * candle is found by search; outside it, time is extrapolated one candle
 * width per index.
 */
export function timeToLogical(candles: Candle[], time: number, stepSeconds: number): number {
  const n = candles.length;
  if (n === 0) return 0;
  const first = candles[0].time;
  const last = candles[n - 1].time;
  if (time <= first) return (time - first) / stepSeconds;
  if (time >= last) return n - 1 + (time - last) / stepSeconds;

  // Binary search for the last candle at or before `time`.
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (candles[mid].time <= time) lo = mid;
    else hi = mid - 1;
  }
  const span = candles[lo + 1].time - candles[lo].time;
  return lo + (span > 0 ? (time - candles[lo].time) / span : 0);
}

export function logicalToTime(candles: Candle[], logical: number, stepSeconds: number): number {
  const n = candles.length;
  if (n === 0) return 0;
  if (logical <= 0) return Math.round(candles[0].time + logical * stepSeconds);
  if (logical >= n - 1) return Math.round(candles[n - 1].time + (logical - (n - 1)) * stepSeconds);
  const i = Math.floor(logical);
  const span = candles[i + 1].time - candles[i].time;
  return Math.round(candles[i].time + (logical - i) * span);
}

export const FIB_RATIOS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1] as const;

export interface FibLevel {
  ratio: number;
  price: number;
}

/**
 * Fibonacci retracement levels for a move from `start` to `end`.
 * Ratio 0 sits at the end of the move and 1 at its start, so the 0.618 level
 * is where price has given back 61.8% of the move.
 */
export function fibLevels(start: number, end: number): FibLevel[] {
  return FIB_RATIOS.map((ratio) => ({ ratio, price: end - (end - start) * ratio }));
}

/** Shortest distance from point p to the segment a-b, in the same units. */
export function distanceToSegment(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** How many points each tool needs before the drawing is complete. */
export const POINTS_NEEDED = { trendline: 2, hline: 1, rect: 2, fib: 2, text: 1 } as const;

export function describePoint(point: DrawingPoint, format: (price: number) => string): string {
  return `${new Date(point.time * 1000).toISOString().slice(0, 10)} at ${format(point.price)}`;
}

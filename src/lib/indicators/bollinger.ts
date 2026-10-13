import type { Candle } from '@/types';
import { emptySeries, type Series } from './series';

export interface BollingerResult {
  middle: Series;
  upper: Series;
  lower: Series;
}

/**
 * Bollinger Bands.
 *
 *   middle = simple moving average of the last `period` closes
 *   upper  = middle + multiplier * standard deviation of those closes
 *   lower  = middle - multiplier * standard deviation
 *
 * Uses the population standard deviation (divide by N), as John Bollinger
 * defines it.
 */
export function bollinger(candles: Candle[], period: number, multiplier: number): BollingerResult {
  const n = candles.length;
  const middle = emptySeries(n);
  const upper = emptySeries(n);
  const lower = emptySeries(n);
  if (period < 1) return { middle, upper, lower };
  for (let i = period - 1; i < n; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    const mean = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) variance += (candles[j].close - mean) ** 2;
    const sd = Math.sqrt(variance / period);
    middle[i] = mean;
    upper[i] = mean + multiplier * sd;
    lower[i] = mean - multiplier * sd;
  }
  return { middle, upper, lower };
}

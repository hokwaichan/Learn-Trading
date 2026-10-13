import type { Candle } from '@/types';
import { emptySeries, smaOf, type Series } from './series';

export interface StochasticResult {
  k: Series;
  d: Series;
}

/**
 * Stochastic oscillator, from 0 to 100: where the close sits inside the
 * high-low range of the last `period` candles.
 *
 *   raw %K = 100 * (close - lowest low) / (highest high - lowest low)
 *   %K     = simple average of raw %K over `smooth` candles (1 = no smoothing)
 *   %D     = simple average of %K over `dPeriod` candles
 */
export function stochastic(candles: Candle[], period: number, smooth: number, dPeriod: number): StochasticResult {
  const n = candles.length;
  const raw = emptySeries(n);
  if (period >= 1) {
    for (let i = period - 1; i < n; i++) {
      let high = -Infinity;
      let low = Infinity;
      for (let j = i - period + 1; j <= i; j++) {
        if (candles[j].high > high) high = candles[j].high;
        if (candles[j].low < low) low = candles[j].low;
      }
      // A completely flat window has no range; call that the midpoint.
      raw[i] = high === low ? 50 : (100 * (candles[i].close - low)) / (high - low);
    }
  }
  const k = smooth > 1 ? smaOf(raw, smooth) : raw;
  return { k, d: smaOf(k, dPeriod) };
}

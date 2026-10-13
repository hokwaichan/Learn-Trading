import type { Candle } from '@/types';
import { emaOf, type Series } from './series';

/**
 * Exponential moving average of the close. Recent closes count more than old
 * ones, so it reacts to a change in price sooner than a simple average.
 */
export function ema(candles: Candle[], period: number): Series {
  return emaOf(
    candles.map((c) => c.close),
    period,
  );
}

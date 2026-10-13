import type { Candle } from '@/types';
import { smaOf, type Series } from './series';

/**
 * Simple moving average: the plain average of the last `period` closes.
 * Every close in the window counts equally.
 */
export function sma(candles: Candle[], period: number): Series {
  return smaOf(
    candles.map((c) => c.close),
    period,
  );
}

import type { Candle } from '@/types';
import { smaOf, type Series } from './series';

/** Simple moving average of volume: what a normal amount of trading looks like. */
export function volumeMa(candles: Candle[], period: number): Series {
  return smaOf(
    candles.map((c) => c.volume),
    period,
  );
}

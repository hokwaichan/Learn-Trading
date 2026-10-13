import type { Candle } from '@/types';

/**
 * Heikin-Ashi ("average bar") candles: a smoothed view of the same prices.
 *
 *   HA close = (open + high + low + close) / 4
 *   HA open  = (previous HA open + previous HA close) / 2
 *   HA high  = max(high, HA open, HA close)
 *   HA low   = min(low, HA open, HA close)
 *
 * The first HA open is (open + close) / 2. These are not real traded prices.
 */
export function heikinAshi(candles: Candle[]): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const close = (c.open + c.high + c.low + c.close) / 4;
    const open = i === 0 ? (c.open + c.close) / 2 : (out[i - 1].open + out[i - 1].close) / 2;
    out.push({
      time: c.time,
      open,
      high: Math.max(c.high, open, close),
      low: Math.min(c.low, open, close),
      close,
      volume: c.volume,
    });
  }
  return out;
}

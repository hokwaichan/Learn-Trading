import type { Candle } from '@/types';
import { emptySeries, type Series } from './series';

/**
 * True range: the largest of the high-low range, |high - previous close| and
 * |low - previous close|, so that gaps between candles are counted.
 */
export function trueRange(candles: Candle[]): number[] {
  return candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prev = candles[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prev), Math.abs(c.low - prev));
  });
}

/**
 * Average True Range (J. Welles Wilder): how far price typically moves per
 * candle, in price units.
 *
 *   first ATR = simple average of the first `period` true ranges
 *   then      = (previous ATR * (period - 1) + current true range) / period
 */
export function atr(candles: Candle[], period: number): Series {
  const n = candles.length;
  const out = emptySeries(n);
  if (period < 1 || n < period) return out;
  const tr = trueRange(candles);
  let value = 0;
  for (let i = 0; i < period; i++) value += tr[i];
  value /= period;
  out[period - 1] = value;
  for (let i = period; i < n; i++) {
    value = (value * (period - 1) + tr[i]) / period;
    out[i] = value;
  }
  return out;
}

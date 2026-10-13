import type { Candle } from '@/types';
import { emptySeries, type Series } from './series';

export type VwapAnchor = 'day' | 'month';

function sessionOf(time: number, anchor: VwapAnchor): number {
  const d = new Date(time * 1000);
  return anchor === 'day'
    ? Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    : Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

/**
 * Volume-weighted average price: the average price paid, counting each
 * candle by how much was traded in it.
 *
 *   typical price = (high + low + close) / 3
 *   VWAP = sum(typical price * volume) / sum(volume)
 *
 * The sums restart at the beginning of each session: each UTC day on
 * intraday charts, each calendar month on daily charts. Null where no
 * volume has traded yet in the session (or the data has no volume).
 */
export function vwap(candles: Candle[], anchor: VwapAnchor): Series {
  const out = emptySeries(candles.length);
  let session = NaN;
  let pv = 0;
  let volume = 0;
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const current = sessionOf(c.time, anchor);
    if (current !== session) {
      session = current;
      pv = 0;
      volume = 0;
    }
    pv += ((c.high + c.low + c.close) / 3) * c.volume;
    volume += c.volume;
    if (volume > 0) out[i] = pv / volume;
  }
  return out;
}

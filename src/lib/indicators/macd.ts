import type { Candle } from '@/types';
import { emaOf, type Series } from './series';

export interface MacdResult {
  macd: Series;
  signal: Series;
  histogram: Series;
}

/**
 * Moving Average Convergence Divergence.
 *
 *   MACD line = EMA(close, fast) - EMA(close, slow)
 *   signal    = EMA(MACD line, signalPeriod)
 *   histogram = MACD line - signal
 */
export function macd(candles: Candle[], fast: number, slow: number, signalPeriod: number): MacdResult {
  const closes = candles.map((c) => c.close);
  const fastEma = emaOf(closes, fast);
  const slowEma = emaOf(closes, slow);
  const line: Series = closes.map((_, i) => {
    const f = fastEma[i];
    const s = slowEma[i];
    return f == null || s == null ? null : f - s;
  });
  const signal = emaOf(line, signalPeriod);
  const histogram: Series = line.map((m, i) => {
    const s = signal[i];
    return m == null || s == null ? null : m - s;
  });
  return { macd: line, signal, histogram };
}

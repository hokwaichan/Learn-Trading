import type { Candle } from '@/types';
import { emptySeries, type Series } from './series';

/**
 * Relative Strength Index (J. Welles Wilder), from 0 to 100.
 *
 *   gain / loss   = the rise or fall from the previous close
 *   first average = simple average of the first `period` gains (and losses)
 *   then          = (previous average * (period - 1) + current) / period
 *   RSI           = 100 - 100 / (1 + average gain / average loss)
 */
export function rsi(candles: Candle[], period: number): Series {
  const n = candles.length;
  const out = emptySeries(n);
  if (period < 1 || n <= period) return out;
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const change = candles[i].close - candles[i - 1].close;
    if (change > 0) avgGain += change;
    else avgLoss -= change;
  }
  avgGain /= period;
  avgLoss /= period;
  const value = () => (avgLoss === 0 ? (avgGain === 0 ? 50 : 100) : 100 - 100 / (1 + avgGain / avgLoss));
  out[period] = value();
  for (let i = period + 1; i < n; i++) {
    const change = candles[i].close - candles[i - 1].close;
    avgGain = (avgGain * (period - 1) + Math.max(change, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-change, 0)) / period;
    out[i] = value();
  }
  return out;
}

import type { Candle } from '@/types';
import { bsPrice, type BsInput } from './blackScholes';

const MIN_VOL = 1e-4;
const MAX_VOL = 10;

/**
 * Implied volatility: the volatility that makes the Black-Scholes price
 * equal a given option price. There is no formula for it, so this searches:
 * Newton's method while it behaves, bisection otherwise.
 *
 * Returns null when no volatility can produce the price: it is below what
 * the option is worth with no volatility at all, or above its upper bound.
 */
export function impliedVolatility(input: Omit<BsInput, 'volatility'>, price: number): number | null {
  if (!(price > 0) || !(input.years > 0) || !(input.spot > 0) || !(input.strike > 0)) return null;
  const at = (volatility: number) => bsPrice({ ...input, volatility });
  let low = MIN_VOL;
  let high = MAX_VOL;
  if (price < at(low) - 1e-10 || price > at(high) + 1e-10) return null;

  let vol = 0.5;
  for (let i = 0; i < 100; i++) {
    const diff = at(vol) - price;
    if (Math.abs(diff) < 1e-10) return vol;
    if (diff > 0) high = vol;
    else low = vol;
    // Vega per unit of volatility, by a small central difference.
    const h = 1e-5;
    const vega = (at(vol + h) - at(vol - h)) / (2 * h);
    const next = vega > 1e-10 ? vol - diff / vega : NaN;
    vol = Number.isFinite(next) && next > low && next < high ? next : (low + high) / 2;
    if (high - low < 1e-12) break;
  }
  return vol;
}

/**
 * Historical (realised) volatility: the standard deviation of daily log
 * returns over the last `lookback` candles, scaled to a year.
 *
 * Returns null with too little data.
 */
export function historicalVolatility(candles: Pick<Candle, 'close'>[], periodsPerYear: number, lookback = 30): number | null {
  const closes = candles.slice(-(lookback + 1)).map((c) => c.close);
  if (closes.length < 3) return null;
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0 && closes[i] > 0) returns.push(Math.log(closes[i] / closes[i - 1]));
  }
  if (returns.length < 2) return null;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance * periodsPerYear);
}

import type { Candle } from '@/types';

/** The measurable parts of one candle. Fractions are of the full high-low range. */
export interface CandleAnatomy {
  direction: 'up' | 'down' | 'flat';
  range: number;
  body: number;
  upperWick: number;
  lowerWick: number;
  bodyPct: number;
  upperWickPct: number;
  lowerWickPct: number;
}

export function anatomy(c: Candle): CandleAnatomy {
  const range = c.high - c.low;
  const body = Math.abs(c.close - c.open);
  const upperWick = c.high - Math.max(c.open, c.close);
  const lowerWick = Math.min(c.open, c.close) - c.low;
  const pct = (v: number) => (range > 0 ? v / range : 0);
  return {
    direction: c.close > c.open ? 'up' : c.close < c.open ? 'down' : 'flat',
    range,
    body,
    upperWick,
    lowerWick,
    bodyPct: pct(body),
    upperWickPct: pct(upperWick),
    lowerWickPct: pct(lowerWick),
  };
}

export type SingleCandleShape = 'doji' | 'hammer' | 'shooting-star' | 'marubozu' | 'spinning-top';

/**
 * Names the shape of one candle from its proportions alone. Whether a
 * hammer or shooting star *means* anything depends on the trend before it,
 * which the pattern detectors check separately.
 *
 *   doji           body is at most 10% of the range
 *   marubozu       body is at least 90% of the range (almost no wicks)
 *   hammer         small body in the top third, lower wick at least twice the body
 *   shooting star  small body in the bottom third, upper wick at least twice the body
 *   spinning top   small body with a wick of at least 25% on each side
 */
export function classifyShape(c: Candle): SingleCandleShape | null {
  const a = anatomy(c);
  if (a.range <= 0) return null;
  if (a.bodyPct <= 0.1) return 'doji';
  if (a.bodyPct >= 0.9) return 'marubozu';
  if (a.bodyPct <= 0.35 && a.lowerWick >= 2 * a.body && a.upperWickPct <= 0.15) return 'hammer';
  if (a.bodyPct <= 0.35 && a.upperWick >= 2 * a.body && a.lowerWickPct <= 0.15) return 'shooting-star';
  if (a.bodyPct <= 0.35 && a.upperWickPct >= 0.25 && a.lowerWickPct >= 0.25) return 'spinning-top';
  return null;
}

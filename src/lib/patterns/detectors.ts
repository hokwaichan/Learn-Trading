import type { Candle } from '@/types';
import { anatomy, classifyShape } from './anatomy';

export type CandlePatternId =
  | 'doji'
  | 'hammer'
  | 'shooting-star'
  | 'marubozu'
  | 'bullish-engulfing'
  | 'bearish-engulfing'
  | 'bullish-harami'
  | 'bearish-harami'
  | 'morning-star'
  | 'evening-star'
  | 'three-white-soldiers'
  | 'three-black-crows';

export interface PatternMatch {
  id: CandlePatternId;
  /** Index of the last candle of the pattern. */
  end: number;
  /** How many candles the pattern spans. */
  length: number;
}

/** Candles looked at to judge what came before a pattern. */
export const TREND_LOOKBACK = 8;

/** Average high-low range of the `count` candles ending just before `index`. */
export function averageRange(candles: Candle[], index: number, count = TREND_LOOKBACK): number {
  const from = Math.max(0, index - count);
  if (from >= index) return 0;
  let sum = 0;
  for (let i = from; i < index; i++) sum += candles[i].high - candles[i].low;
  return sum / (index - from);
}

/**
 * Direction of price over the candles just before `index`: 'up' or 'down'
 * when the close moved by more than 1.5 average candle ranges, else 'flat'.
 * A hammer only means something after a decline, so most detectors need this.
 */
export function priorTrend(candles: Candle[], index: number, lookback = TREND_LOOKBACK): 'up' | 'down' | 'flat' {
  if (index - lookback < 0) return 'flat';
  const change = candles[index - 1].close - candles[index - 1 - lookback + 1].open;
  const unit = averageRange(candles, index, lookback);
  if (unit <= 0) return 'flat';
  if (change > 1.5 * unit) return 'up';
  if (change < -1.5 * unit) return 'down';
  return 'flat';
}

const isUp = (c: Candle) => c.close > c.open;
const isDown = (c: Candle) => c.close < c.open;
const body = (c: Candle) => Math.abs(c.close - c.open);
const top = (c: Candle) => Math.max(c.open, c.close);
const bottom = (c: Candle) => Math.min(c.open, c.close);
const mid = (c: Candle) => (c.open + c.close) / 2;

/**
 * True when `next` opens inside the body of `prev`, or just beyond its close.
 * The textbook rule is "inside the body", but stocks routinely open a little
 * past the previous close, so a gap of up to 30% of that body is allowed.
 */
function opensNear(prev: Candle, next: Candle): boolean {
  const slack = 0.3 * body(prev);
  return next.open >= bottom(prev) - (isDown(prev) ? slack : 0) && next.open <= top(prev) + (isUp(prev) ? slack : 0);
}

type Detector = (candles: Candle[], i: number, unit: number) => boolean;

/**
 * One rule per pattern. `i` is the last candle of the pattern and `unit` is
 * the average range of the candles before the pattern, used so that "long"
 * and "small" mean the same thing on a $2 stock and a $60,000 coin.
 */
const DETECTORS: Record<CandlePatternId, { length: number; test: Detector }> = {
  doji: {
    length: 1,
    // A real candle with almost no body, not just a dead period.
    test: (c, i, unit) => classifyShape(c[i]) === 'doji' && c[i].high - c[i].low >= 0.6 * unit,
  },
  hammer: {
    length: 1,
    test: (c, i, unit) => classifyShape(c[i]) === 'hammer' && c[i].high - c[i].low >= 0.8 * unit && priorTrend(c, i) === 'down',
  },
  'shooting-star': {
    length: 1,
    test: (c, i, unit) => classifyShape(c[i]) === 'shooting-star' && c[i].high - c[i].low >= 0.8 * unit && priorTrend(c, i) === 'up',
  },
  marubozu: {
    length: 1,
    test: (c, i, unit) => classifyShape(c[i]) === 'marubozu' && c[i].high - c[i].low >= 1.3 * unit,
  },
  'bullish-engulfing': {
    length: 2,
    test: (c, i, unit) => {
      const [a, b] = [c[i - 1], c[i]];
      return (
        isDown(a) && isUp(b) && body(a) >= 0.25 * unit && body(b) >= 1.15 * body(a) &&
        b.open <= a.close && b.close >= a.open && priorTrend(c, i - 1) === 'down'
      );
    },
  },
  'bearish-engulfing': {
    length: 2,
    test: (c, i, unit) => {
      const [a, b] = [c[i - 1], c[i]];
      return (
        isUp(a) && isDown(b) && body(a) >= 0.25 * unit && body(b) >= 1.15 * body(a) &&
        b.open >= a.close && b.close <= a.open && priorTrend(c, i - 1) === 'up'
      );
    },
  },
  'bullish-harami': {
    length: 2,
    test: (c, i, unit) => {
      const [a, b] = [c[i - 1], c[i]];
      return (
        isDown(a) && isUp(b) && body(a) >= 0.8 * unit && body(b) <= 0.5 * body(a) && body(b) >= 0.05 * unit &&
        top(b) <= top(a) && bottom(b) >= bottom(a) && priorTrend(c, i - 1) === 'down'
      );
    },
  },
  'bearish-harami': {
    length: 2,
    test: (c, i, unit) => {
      const [a, b] = [c[i - 1], c[i]];
      return (
        isUp(a) && isDown(b) && body(a) >= 0.8 * unit && body(b) <= 0.5 * body(a) && body(b) >= 0.05 * unit &&
        top(b) <= top(a) && bottom(b) >= bottom(a) && priorTrend(c, i - 1) === 'up'
      );
    },
  },
  'morning-star': {
    length: 3,
    test: (c, i, unit) => {
      const [a, b, d] = [c[i - 2], c[i - 1], c[i]];
      return (
        isDown(a) && body(a) >= 0.7 * unit &&
        body(b) <= 0.4 * body(a) && top(b) < mid(a) &&
        isUp(d) && body(d) >= 0.5 * body(a) && d.close > mid(a) &&
        priorTrend(c, i - 2) === 'down'
      );
    },
  },
  'evening-star': {
    length: 3,
    test: (c, i, unit) => {
      const [a, b, d] = [c[i - 2], c[i - 1], c[i]];
      return (
        isUp(a) && body(a) >= 0.7 * unit &&
        body(b) <= 0.4 * body(a) && bottom(b) > mid(a) &&
        isDown(d) && body(d) >= 0.5 * body(a) && d.close < mid(a) &&
        priorTrend(c, i - 2) === 'up'
      );
    },
  },
  'three-white-soldiers': {
    length: 3,
    test: (c, i, unit) => {
      const three = [c[i - 2], c[i - 1], c[i]];
      return (
        three.every((k) => isUp(k) && body(k) >= 0.5 * unit && anatomy(k).upperWickPct <= 0.35) &&
        three[1].close > three[0].close && three[2].close > three[1].close &&
        opensNear(three[0], three[1]) && opensNear(three[1], three[2])
      );
    },
  },
  'three-black-crows': {
    length: 3,
    test: (c, i, unit) => {
      const three = [c[i - 2], c[i - 1], c[i]];
      return (
        three.every((k) => isDown(k) && body(k) >= 0.5 * unit && anatomy(k).lowerWickPct <= 0.35) &&
        three[1].close < three[0].close && three[2].close < three[1].close &&
        opensNear(three[0], three[1]) && opensNear(three[1], three[2])
      );
    },
  },
};

export const CANDLE_PATTERN_IDS = Object.keys(DETECTORS) as CandlePatternId[];

/** Every pattern whose last candle is `index`. */
export function patternsAt(candles: Candle[], index: number): PatternMatch[] {
  const out: PatternMatch[] = [];
  for (const id of CANDLE_PATTERN_IDS) {
    const { length, test } = DETECTORS[id];
    const start = index - length + 1;
    // Each rule needs the trend before the pattern, so leave room for it.
    if (start - TREND_LOOKBACK < 0) continue;
    const unit = averageRange(candles, start);
    if (unit > 0 && test(candles, index, unit)) out.push({ id, end: index, length });
  }
  return out;
}

/** Every candlestick pattern in a series. */
export function detectPatterns(candles: Candle[]): PatternMatch[] {
  const out: PatternMatch[] = [];
  for (let i = 0; i < candles.length; i++) out.push(...patternsAt(candles, i));
  return out;
}

/**
 * Matches that are unambiguous: no other pattern ends on the same candle.
 * Used by the trainer, where a question must have exactly one right answer.
 *
 * A shorter pattern that ends earlier inside a longer one does not count
 * against it: the middle candle of a morning star is very often a doji, and
 * the trainer marks the whole span it is asking about.
 */
export function unambiguousPatterns(candles: Candle[]): PatternMatch[] {
  const byEnd = new Map<number, PatternMatch[]>();
  for (const match of detectPatterns(candles)) byEnd.set(match.end, [...(byEnd.get(match.end) ?? []), match]);
  return [...byEnd.values()].filter((matches) => matches.length === 1).map((matches) => matches[0]);
}

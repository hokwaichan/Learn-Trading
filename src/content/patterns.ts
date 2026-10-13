import { seededRandom } from '@/lib/random';
import type { Candle, PatternDefinition } from '@/types';
import { walk } from './lessons/helpers';

/**
 * Pattern definitions used by the trainer (and available to lessons).
 *
 * Candlestick patterns name a detector in lib/patterns/detectors.ts, which
 * finds real examples in price history.
 *
 * Chart patterns carry a `build(seed)` function that draws a constructed
 * example. They are not found automatically in real data: detectors for
 * shapes like head and shoulders pick up too many doubtful cases to teach
 * from. Each seed gives a different variation of the same shape.
 */

interface Shape {
  /** Waypoints in abstract units; the first `lead` segments are the run-up before the pattern. */
  points: number[];
  lead: number;
}

/** Builds a constructed example from waypoints, varying level, size, pace and wobble with the seed. */
function shape({ points, lead }: Shape, flip = false) {
  return (seed: number): { candles: Candle[]; from: number; to: number } => {
    const rand = seededRandom(seed * 7919 + 13);
    const base = 60 + rand() * 140;
    const unit = base * (0.008 + rand() * 0.006);
    const per = 4 + Math.floor(rand() * 3);
    const jitter = () => (rand() - 0.5) * 0.5;
    const waypoints = points.map((p, i) => base + (flip ? -1 : 1) * (p + (i === 0 ? 0 : jitter())) * unit);
    const candles = walk(waypoints, { per, seed: seed + 1, noise: 0.0035 + rand() * 0.002 });
    return { candles, from: lead * per, to: candles.length - 1 };
  };
}

const SHAPES = {
  headAndShoulders: { points: [0, 7, 5, 14, 9, 18.5, 9.3, 13.6, 9, 4.5], lead: 2 },
  doubleTop: { points: [0, 6, 3.5, 14, 8, 14.2, 8, 3.5], lead: 2 },
  ascendingTriangle: { points: [-8, -2, -4, 10, 2, 10.2, 4.6, 10.1, 7, 10.3, 14.5], lead: 2 },
  symmetricalTriangle: { points: [-10, -4, -6, 12, 0, 10, 2.5, 8.4, 4, 7.2, 12.5], lead: 2 },
  flag: { points: [0, 1.5, 0.5, 14, 12, 13.3, 11, 12.4, 10.2, 17.5], lead: 2 },
  wedge: { points: [-6, -2, 0, 12, 6.5, 15, 10.6, 17, 13.6, 18, 11], lead: 2 },
  cupAndHandle: { points: [0, 5, 3, 12, 7, 3.6, 2.5, 3.6, 7, 12, 9.2, 9.9, 15.5], lead: 2 },
} satisfies Record<string, Shape>;

export const PATTERNS: PatternDefinition[] = [
  // ── Candlestick patterns (found in real data) ────────────────────────
  {
    id: 'doji',
    name: 'Doji',
    family: 'candlestick',
    bias: 'neutral',
    detectorId: 'doji',
    description: 'A candle that opens and closes at almost the same price, so its body is a thin line.',
    howToRead: 'Buyers and sellers ended the period in a draw. After a strong move it suggests the move is tiring.',
    weaknesses: 'It is very common and says nothing about direction. On its own it is not a signal.',
  },
  {
    id: 'hammer',
    name: 'Hammer',
    family: 'candlestick',
    bias: 'bullish',
    detectorId: 'hammer',
    description: 'A small body at the top with a lower wick at least twice as long, appearing after a decline.',
    howToRead: 'Price was pushed down hard and buyers brought it all the way back. It can mark buyers stepping in.',
    weaknesses: 'Needs a decline before it and ideally a higher close on the next candle. In a strong downtrend hammers fail often.',
  },
  {
    id: 'shooting-star',
    name: 'Shooting star',
    family: 'candlestick',
    bias: 'bearish',
    detectorId: 'shooting-star',
    description: 'A small body at the bottom with an upper wick at least twice as long, appearing after a rise.',
    howToRead: 'Price was pushed up hard and sellers brought it all the way back. It can mark sellers taking control.',
    weaknesses: 'Needs a rise before it and ideally a lower close on the next candle. In a strong uptrend it often fails.',
  },
  {
    id: 'marubozu',
    name: 'Marubozu',
    family: 'candlestick',
    bias: 'neutral',
    detectorId: 'marubozu',
    description: 'A large candle that is almost all body, with little or no wick at either end.',
    howToRead: 'One side was in control from the open to the close. It suggests the move may continue in the direction of the candle.',
    weaknesses: 'After a long run, one more huge candle can be the last burst of a move rather than the start of one.',
  },
  {
    id: 'bullish-engulfing',
    name: 'Bullish engulfing',
    family: 'candlestick',
    bias: 'bullish',
    detectorId: 'bullish-engulfing',
    description: 'After a decline, a down candle followed by a larger up candle whose body completely covers it.',
    howToRead: 'Sellers were in charge, then buyers overwhelmed them within one period.',
    weaknesses: 'Common inside ranges, where it means little. Stronger at support and on higher volume.',
  },
  {
    id: 'bearish-engulfing',
    name: 'Bearish engulfing',
    family: 'candlestick',
    bias: 'bearish',
    detectorId: 'bearish-engulfing',
    description: 'After a rise, an up candle followed by a larger down candle whose body completely covers it.',
    howToRead: 'Buyers were in charge, then sellers overwhelmed them within one period.',
    weaknesses: 'Common inside ranges, where it means little. Stronger at resistance and on higher volume.',
  },
  {
    id: 'bullish-harami',
    name: 'Bullish harami',
    family: 'candlestick',
    bias: 'bullish',
    detectorId: 'bullish-harami',
    description: 'After a decline, a long down candle followed by a small up candle whose body sits inside the first.',
    howToRead: 'The selling has stalled. It shows hesitation rather than a takeover by buyers.',
    weaknesses: 'A weak signal. It says the move paused, not that it reversed; wait for confirmation.',
  },
  {
    id: 'bearish-harami',
    name: 'Bearish harami',
    family: 'candlestick',
    bias: 'bearish',
    detectorId: 'bearish-harami',
    description: 'After a rise, a long up candle followed by a small down candle whose body sits inside the first.',
    howToRead: 'The buying has stalled. It shows hesitation rather than a takeover by sellers.',
    weaknesses: 'A weak signal. It says the move paused, not that it reversed; wait for confirmation.',
  },
  {
    id: 'morning-star',
    name: 'Morning star',
    family: 'candlestick',
    bias: 'bullish',
    detectorId: 'morning-star',
    description: 'After a decline: a long down candle, a small-bodied candle, then a long up candle closing well into the first.',
    howToRead: 'Selling, a pause, then buying. One of the more reliable candle reversals.',
    weaknesses: 'Rare, and by the time the third candle closes much of the bounce has already happened.',
  },
  {
    id: 'evening-star',
    name: 'Evening star',
    family: 'candlestick',
    bias: 'bearish',
    detectorId: 'evening-star',
    description: 'After a rise: a long up candle, a small-bodied candle, then a long down candle closing well into the first.',
    howToRead: 'Buying, a pause, then selling. One of the more reliable candle reversals.',
    weaknesses: 'Rare, and by the time the third candle closes much of the drop has already happened.',
  },
  {
    id: 'three-white-soldiers',
    name: 'Three white soldiers',
    family: 'candlestick',
    bias: 'bullish',
    detectorId: 'three-white-soldiers',
    description: 'Three long up candles in a row, each opening near the previous body and closing higher.',
    howToRead: 'Buyers are firmly in control across three periods.',
    weaknesses: 'After three big candles the move may already be stretched, so entries are late and stops are far away.',
  },
  {
    id: 'three-black-crows',
    name: 'Three black crows',
    family: 'candlestick',
    bias: 'bearish',
    detectorId: 'three-black-crows',
    description: 'Three long down candles in a row, each opening near the previous body and closing lower.',
    howToRead: 'Sellers are firmly in control across three periods.',
    weaknesses: 'After three big candles the move may already be stretched, and a bounce is common.',
  },

  // ── Chart patterns (constructed examples) ────────────────────────────
  {
    id: 'head-and-shoulders',
    name: 'Head and shoulders',
    family: 'chart',
    bias: 'bearish',
    build: shape(SHAPES.headAndShoulders),
    description: 'Three peaks after an uptrend, the middle one highest, completed by a break below the neckline joining the two lows.',
    howToRead: 'The right shoulder is a lower high: buyers could not reach the previous peak. The neckline break confirms the reversal.',
    weaknesses: 'Many never complete: price bounces off the neckline and the uptrend continues. Wait for the break.',
  },
  {
    id: 'inverse-head-and-shoulders',
    name: 'Inverse head and shoulders',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.headAndShoulders, true),
    description: 'Three troughs after a downtrend, the middle one lowest, completed by a break above the neckline joining the two highs.',
    howToRead: 'The right shoulder is a higher low: sellers could not reach the previous trough. The neckline break confirms the reversal.',
    weaknesses: 'Many never complete. Wait for a close above the neckline.',
  },
  {
    id: 'double-top',
    name: 'Double top',
    family: 'chart',
    bias: 'bearish',
    build: shape(SHAPES.doubleTop),
    description: 'Two peaks at about the same level with a dip between them, shaped like an M, completed by a break below that dip.',
    howToRead: 'Buyers failed twice at the same resistance. The break of the middle low confirms sellers have taken over.',
    weaknesses: 'Two tests of a high are very common in healthy uptrends just before a breakout. It is only a range until the middle low breaks.',
  },
  {
    id: 'double-bottom',
    name: 'Double bottom',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.doubleTop, true),
    description: 'Two troughs at about the same level with a bounce between them, shaped like a W, completed by a break above that bounce.',
    howToRead: 'Sellers failed twice at the same support. The break of the middle high confirms buyers have taken over.',
    weaknesses: 'It is only a range until the middle high breaks.',
  },
  {
    id: 'ascending-triangle',
    name: 'Ascending triangle',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.ascendingTriangle),
    description: 'A flat top with rising lows: resistance at one level while each dip is shallower than the last.',
    howToRead: 'Buyers are stepping in sooner each time while sellers defend one price. It usually breaks upwards.',
    weaknesses: 'It can break down instead. Breakouts late in the triangle, near the point, tend to be weak.',
  },
  {
    id: 'descending-triangle',
    name: 'Descending triangle',
    family: 'chart',
    bias: 'bearish',
    build: shape(SHAPES.ascendingTriangle, true),
    description: 'A flat bottom with falling highs: support at one level while each bounce is weaker than the last.',
    howToRead: 'Sellers are getting more aggressive while buyers defend one price. It usually breaks downwards.',
    weaknesses: 'It can break up instead. Wait for the break.',
  },
  {
    id: 'symmetrical-triangle',
    name: 'Symmetrical triangle',
    family: 'chart',
    bias: 'neutral',
    build: shape(SHAPES.symmetricalTriangle),
    description: 'Falling highs and rising lows converging evenly towards a point.',
    howToRead: 'Neither side is winning. It tends to break in the direction of the trend that came before.',
    weaknesses: 'It can break either way, and false breaks are common.',
  },
  {
    id: 'bull-flag',
    name: 'Bull flag',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.flag),
    description: 'A sharp rise (the flagpole) followed by a short, tight drift downwards or sideways.',
    howToRead: 'The drift is profit-taking, not a change of mind. A break above the flag usually resumes the rise.',
    weaknesses: 'Needs a real flagpole. A long or deep flag is no longer a pause but a reversal forming.',
  },
  {
    id: 'bear-flag',
    name: 'Bear flag',
    family: 'chart',
    bias: 'bearish',
    build: shape(SHAPES.flag, true),
    description: 'A sharp fall (the flagpole) followed by a short, tight drift upwards or sideways.',
    howToRead: 'The drift is short-covering, not a change of mind. A break below the flag usually resumes the fall.',
    weaknesses: 'Needs a real flagpole. A long or steep flag may be a reversal forming.',
  },
  {
    id: 'rising-wedge',
    name: 'Rising wedge',
    family: 'chart',
    bias: 'bearish',
    build: shape(SHAPES.wedge),
    description: 'Higher highs and higher lows squeezed between two rising, converging lines.',
    howToRead: 'Each push up gains less than the last, so the advance is tiring. It usually breaks down.',
    weaknesses: 'Price can grind higher inside a wedge for a long time before it breaks.',
  },
  {
    id: 'falling-wedge',
    name: 'Falling wedge',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.wedge, true),
    description: 'Lower highs and lower lows squeezed between two falling, converging lines.',
    howToRead: 'Each drop is smaller than the last, so the decline is tiring. It usually breaks up.',
    weaknesses: 'Price can grind lower inside a wedge for a long time before it breaks.',
  },
  {
    id: 'cup-and-handle',
    name: 'Cup and handle',
    family: 'chart',
    bias: 'bullish',
    build: shape(SHAPES.cupAndHandle),
    description: 'A rounded pullback that recovers to its old high (the cup), a small dip (the handle), then a breakout.',
    howToRead: 'Selling dried up gradually and buyers returned. The handle is earlier buyers getting out even.',
    weaknesses: 'Slow to form and easy to imagine. A deep or V-shaped cup is much less reliable.',
  },
];

const BY_ID = new Map(PATTERNS.map((p) => [p.id, p]));

export function getPattern(id: string): PatternDefinition | undefined {
  return BY_ID.get(id);
}

export const CANDLESTICK_PATTERNS = PATTERNS.filter((p) => p.family === 'candlestick');
export const CHART_PATTERNS = PATTERNS.filter((p) => p.family === 'chart');

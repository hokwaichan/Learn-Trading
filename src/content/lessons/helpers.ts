import type { Candle, ChartAnnotation, ChartExample, IndicatorId, Lesson, LessonBlock, LessonWidget, Module } from '@/types';

/**
 * Small builders that keep lesson files readable. A lesson is a list of
 * blocks: h() heading, p() paragraph, ul()/ol() lists, note()/warn()/danger()
 * callouts, formula(), worked() examples, chart() and widget().
 *
 * In paragraph, list and callout text, **double asterisks** make bold text
 * and glossary terms are linked automatically the first time they appear.
 */
export const h = (text: string): LessonBlock => ({ type: 'heading', text });
export const p = (text: string): LessonBlock => ({ type: 'paragraph', text });
export const ul = (...items: string[]): LessonBlock => ({ type: 'list', ordered: false, items });
export const ol = (...items: string[]): LessonBlock => ({ type: 'list', ordered: true, items });
export const note = (title: string, text: string): LessonBlock => ({ type: 'callout', tone: 'info', title, text });
export const warn = (title: string, text: string): LessonBlock => ({ type: 'callout', tone: 'warning', title, text });
export const danger = (title: string, text: string): LessonBlock => ({ type: 'callout', tone: 'danger', title, text });
export const formula = (expression: string, explanation: string): LessonBlock => ({ type: 'formula', expression, explanation });
export const worked = (title: string, ...steps: string[]): LessonBlock => ({ type: 'worked-example', title, steps });
export const chart = (example: ChartExample): LessonBlock => ({ type: 'chart', example });
export const widget = (name: LessonWidget, props?: Record<string, unknown>): LessonBlock => ({ type: 'widget', widget: name, props });

export interface LessonInput {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: LessonBlock[];
}

/** Builds a module; lesson order follows the order of the array. */
export function defineModule(
  order: number,
  id: string,
  title: string,
  description: string,
  lessons: LessonInput[],
): Module {
  return {
    id,
    order,
    title,
    description,
    lessons: lessons.map(
      (l, i): Lesson => ({ ...l, moduleId: id, order: i + 1, quizId: `${id}/${l.id}` }),
    ),
  };
}

// ── Chart examples ─────────────────────────────────────────────────────

const DAY = 86_400;
/** Hand-made examples start on this date and have one candle per day. */
const START = Date.UTC(2024, 0, 1) / 1000;

/** Time of the candle at position `index` in a hand-made example. */
export const T = (index: number): number => START + index * DAY;

/** Small deterministic random generator, so examples look the same every time. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Candles from explicit [open, high, low, close] (and optional volume) rows. */
export function ohlc(rows: (readonly [number, number, number, number, number?])[], startIndex = 0): Candle[] {
  return rows.map(([open, high, low, close, volume], i) => ({
    time: T(startIndex + i),
    open,
    high,
    low,
    close,
    volume: volume ?? 1000,
  }));
}

export interface WalkOptions {
  /** Candles drawn between each pair of waypoints. */
  per?: number;
  seed?: number;
  /** Size of the random wiggle, as a fraction of price. */
  noise?: number;
  startIndex?: number;
  /** Candle positions (within this walk) that get unusually heavy volume. */
  volumeSpikes?: number[];
}

/**
 * A realistic-looking price path through a list of waypoint prices. Used to
 * draw trends, ranges and chart patterns whose shape is known in advance.
 */
export function walk(waypoints: number[], options: WalkOptions = {}): Candle[] {
  const { per = 6, seed = 7, noise = 0.006, startIndex = 0, volumeSpikes = [] } = options;
  const rand = random(seed);
  const out: Candle[] = [];
  let prevClose = waypoints[0];
  for (let s = 1; s < waypoints.length; s++) {
    for (let k = 1; k <= per; k++) {
      const target = waypoints[s - 1] + ((waypoints[s] - waypoints[s - 1]) * k) / per;
      const wiggle = k === per ? 0 : (rand() - 0.5) * 2 * noise * target;
      const open = prevClose;
      const close = round(target + wiggle);
      const high = round(Math.max(open, close) + rand() * noise * target);
      const low = round(Math.min(open, close) - rand() * noise * target);
      const i = out.length;
      const volume = Math.round((800 + rand() * 500) * (volumeSpikes.includes(i) ? 2.8 : 1));
      out.push({ time: T(startIndex + i), open: round(open), high, low, close, volume });
      prevClose = close;
    }
  }
  return out;
}

/** Joins hand-made pieces into one series, re-numbering the days. */
export function join(...parts: Candle[][]): Candle[] {
  return parts.flat().map((c, i) => ({ ...c, time: T(i) }));
}

/** A label pinned to one candle. Sits above the candle unless a price is given. */
export const mark = (index: number, label: string, price?: number): ChartAnnotation => ({
  kind: 'marker',
  time: T(index),
  price,
  label,
});

/** A horizontal line across the whole chart at a price. */
export const level = (price: number, label: string): ChartAnnotation => ({ kind: 'line', time: T(0), price, label });

/** A straight line from one (candle, price) point to another. */
export const seg = (i1: number, p1: number, i2: number, p2: number, label = ''): ChartAnnotation => ({
  kind: 'line',
  time: T(i1),
  price: p1,
  toTime: T(i2),
  toPrice: p2,
  label,
});

/** A shaded box between two (candle, price) corners. */
export const zone = (i1: number, p1: number, i2: number, p2: number, label = ''): ChartAnnotation => ({
  kind: 'zone',
  time: T(i1),
  price: p1,
  toTime: T(i2),
  toPrice: p2,
  label,
});

/** A hand-made example chart. */
export function made(
  candles: Candle[],
  caption: string,
  annotations: ChartAnnotation[] = [],
  indicators: { id: IndicatorId; params: Record<string, number> }[] = [],
): ChartExample {
  return { source: { candles }, caption, annotations, indicators };
}

/** A stretch of real bundled daily history (AAPL, TSLA, SPY or EURUSD), dates as YYYY-MM-DD. */
export function real(
  symbol: string,
  from: string,
  to: string,
  caption: string,
  indicators: { id: IndicatorId; params: Record<string, number> }[] = [],
): ChartExample {
  const seconds = (d: string) => Date.parse(`${d}T00:00:00Z`) / 1000;
  return { source: { symbol, timeframe: '1d', from: seconds(from), to: seconds(to) }, caption, indicators };
}

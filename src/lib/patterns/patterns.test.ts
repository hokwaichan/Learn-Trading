import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseStaticFile } from '@/lib/data/static';
import { seededRandom } from '@/lib/random';
import { accuracy, newCard, pickWeighted, reviewCard, selectionWeight, weakestCards } from '@/lib/srs/sm2';
import type { Candle, ReviewCard } from '@/types';
import {
  averageRange,
  CANDLE_PATTERN_IDS,
  detectPatterns,
  patternsAt,
  priorTrend,
  unambiguousPatterns,
  type CandlePatternId,
} from './detectors';
import { classifyOutcome, sidewaysThreshold } from './outcome';

type Row = [open: number, high: number, low: number, close: number];
const build = (rows: Row[]): Candle[] => rows.map(([open, high, low, close], i) => ({ time: i * 86_400, open, high, low, close, volume: 1000 }));

/** Ten steady candles moving `step` per candle, each with a range of about 1.4. */
function trend(from: number, step: number, count = 10): Row[] {
  return Array.from({ length: count }, (_, i): Row => {
    const open = from + i * step;
    const close = open + step;
    return [open, Math.max(open, close) + 0.2, Math.min(open, close) - 0.2, close];
  });
}
const down = trend(120, -1); // ends with a close of 110
const up = trend(100, 1); // ends with a close of 110
const flat: Row[] = Array.from({ length: 10 }, (_, i): Row => (i % 2 ? [110, 110.7, 109.3, 110.5] : [110.5, 110.7, 109.3, 110]));

const idsAtEnd = (rows: Row[]) => {
  const candles = build(rows);
  return patternsAt(candles, candles.length - 1).map((m) => m.id);
};

describe('trend context', () => {
  it('measures the average range before a candle', () => {
    expect(averageRange(build(down), 10)).toBeCloseTo(1.4, 10);
  });

  it('reads the direction of the candles before a point', () => {
    expect(priorTrend(build(down), 10)).toBe('down');
    expect(priorTrend(build(up), 10)).toBe('up');
    expect(priorTrend(build(flat), 10)).toBe('flat');
    expect(priorTrend(build(down), 3)).toBe('flat'); // not enough history
  });
});

describe('single-candle detectors', () => {
  const hammer: Row = [109.9, 110.25, 108.5, 110.2];
  const star: Row = [110.1, 111.5, 109.75, 109.8];

  it('finds a hammer only after a decline', () => {
    expect(idsAtEnd([...down, hammer])).toEqual(['hammer']);
    expect(idsAtEnd([...up, hammer])).toEqual([]);
    expect(idsAtEnd([...flat, hammer])).toEqual([]);
  });

  it('finds a shooting star only after a rise', () => {
    expect(idsAtEnd([...up, star])).toEqual(['shooting-star']);
    expect(idsAtEnd([...down, star])).toEqual([]);
  });

  it('finds a doji in any context, but not a tiny dead candle', () => {
    expect(idsAtEnd([...flat, [110, 111, 109, 110.05]])).toEqual(['doji']);
    expect(idsAtEnd([...up, [110, 111, 109, 110.05]])).toEqual(['doji']);
    expect(idsAtEnd([...flat, [110, 110.1, 109.9, 110.01]])).toEqual([]);
  });

  it('finds a marubozu only when it is a large candle', () => {
    expect(idsAtEnd([...flat, [110, 112.55, 109.95, 112.5]])).toEqual(['marubozu']);
    expect(idsAtEnd([...flat, [110, 110.52, 109.99, 110.5]])).toEqual([]);
  });
});

describe('two-candle detectors', () => {
  it('finds a bullish engulfing after a decline', () => {
    const rows: Row[] = [...down, [110, 110.2, 109.3, 109.5], [109.4, 111.2, 109.2, 111]];
    expect(idsAtEnd(rows)).toEqual(['bullish-engulfing']);
    // The second body must cover the first.
    expect(idsAtEnd([...down, [110, 110.2, 109.3, 109.5], [109.6, 110.1, 109.4, 109.9]])).toEqual([]);
  });

  it('finds a bearish engulfing after a rise', () => {
    expect(idsAtEnd([...up, [110, 110.7, 109.8, 110.5], [110.6, 110.8, 108.8, 109]])).toEqual(['bearish-engulfing']);
  });

  it('finds a bullish harami: a small up candle inside a long down candle', () => {
    expect(idsAtEnd([...down, [110, 110.2, 107.8, 108], [108.6, 109.3, 108.4, 109.1]])).toEqual(['bullish-harami']);
  });

  it('finds a bearish harami after a rise', () => {
    expect(idsAtEnd([...up, [110, 112.2, 109.8, 112], [111.4, 111.6, 110.7, 110.9]])).toEqual(['bearish-harami']);
  });
});

describe('three-candle detectors', () => {
  it('finds a morning star after a decline', () => {
    const rows: Row[] = [...down, [110, 110.2, 107.8, 108], [107.6, 107.9, 107.1, 107.4], [107.8, 110, 107.6, 109.8]];
    expect(idsAtEnd(rows)).toEqual(['morning-star']);
  });

  it('finds an evening star after a rise', () => {
    const rows: Row[] = [...up, [110, 112.2, 109.8, 112], [112.4, 112.9, 112.1, 112.6], [112.2, 112.4, 110, 110.2]];
    expect(idsAtEnd(rows)).toEqual(['evening-star']);
  });

  it('finds three white soldiers and three black crows', () => {
    const soldiers: Row[] = [...flat, [110, 111.6, 109.9, 111.5], [111, 112.9, 110.9, 112.8], [112.2, 114.1, 112.1, 114]];
    expect(idsAtEnd(soldiers)).toEqual(['three-white-soldiers']);
    const crows: Row[] = [...flat, [110.5, 110.6, 108.9, 109], [109.5, 109.6, 107.6, 107.7], [108.2, 108.3, 106.4, 106.5]];
    expect(idsAtEnd(crows)).toEqual(['three-black-crows']);
  });

  it('rejects soldiers that open outside the previous body', () => {
    expect(idsAtEnd([...flat, [110, 111.6, 109.9, 111.5], [112, 113.9, 111.9, 113.8], [114.2, 116.1, 114.1, 116]])).toEqual([]);
  });
});

describe('scanning a series', () => {
  it('reports where each pattern ends and how long it is', () => {
    const candles = build([...down, [110, 110.2, 107.8, 108], [107.6, 107.9, 107.1, 107.4], [107.8, 110, 107.6, 109.8]]);
    expect(detectPatterns(candles).filter((m) => m.id === 'morning-star')).toEqual([{ id: 'morning-star', end: 12, length: 3 }]);
  });

  it('never looks at candles after the pattern (no look-ahead)', () => {
    const candles = build([...down, [109.9, 110.25, 108.5, 110.2], ...trend(110.2, 1, 5)]);
    const short = candles.slice(0, 11);
    expect(patternsAt(candles, 10)).toEqual(patternsAt(short, 10));
  });
});

describe('detectors on the bundled history', () => {
  const symbols = ['AAPL', 'TSLA', 'SPY', 'EURUSD'];
  const data = symbols.map((s) => parseStaticFile(JSON.parse(readFileSync(`public/data/${s}.json`, 'utf8'))));
  const counts = Object.fromEntries(CANDLE_PATTERN_IDS.map((id) => [id, 0])) as Record<CandlePatternId, number>;
  for (const candles of data) for (const match of unambiguousPatterns(candles)) counts[match.id]++;

  it.each(CANDLE_PATTERN_IDS)('%s has enough clear real examples for the trainer', (id) => {
    expect(counts[id], JSON.stringify(counts)).toBeGreaterThanOrEqual(8);
  });

  it('gives every unambiguous match exactly one pattern ending on its candle', () => {
    for (const candles of data) {
      for (const match of unambiguousPatterns(candles).slice(0, 200)) expect(patternsAt(candles, match.end)).toEqual([match]);
    }
  });
});

describe('what happened next', () => {
  const quiet: Row[] = Array.from({ length: 20 }, (): Row => [100, 101, 99, 100]); // ATR 2
  const then = (close: number): Row[] => Array.from({ length: 10 }, (_, i): Row => (i === 9 ? [100, Math.max(101, close), Math.min(99, close), close] : [100, 101, 99, 100]));

  it('uses a threshold of about 0.95 ATR for a 10-candle horizon', () => {
    expect(sidewaysThreshold(10)).toBeCloseTo(0.952, 3);
    expect(sidewaysThreshold(15)).toBeGreaterThan(sidewaysThreshold(10));
  });

  it('classifies moves relative to the ATR at the cut', () => {
    // ATR is 2, so the threshold is about 1.9 points.
    expect(classifyOutcome(build([...quiet, ...then(104)]), 19, 10)).toMatchObject({ outcome: 'up', change: 0.04, changeInAtr: 2 });
    expect(classifyOutcome(build([...quiet, ...then(95)]), 19, 10)!.outcome).toBe('down');
    expect(classifyOutcome(build([...quiet, ...then(101)]), 19, 10)!.outcome).toBe('sideways');
    expect(classifyOutcome(build([...quiet, ...then(99)]), 19, 10)!.outcome).toBe('sideways');
  });

  it('measures the ATR from candles before the cut only', () => {
    const calm = build([...quiet, ...then(104)]);
    const wildAfter = build([...quiet, ...Array.from({ length: 9 }, (): Row => [100, 130, 70, 100]), [100, 104, 99, 104]]);
    expect(classifyOutcome(wildAfter, 19, 10)!.changeInAtr).toBe(classifyOutcome(calm, 19, 10)!.changeInAtr);
  });

  it('returns null without enough candles before or after', () => {
    const candles = build([...quiet, ...then(104)]);
    expect(classifyOutcome(candles, 5, 10)).toBeNull();
    expect(classifyOutcome(candles, 25, 10)).toBeNull();
  });

  it('splits real history into three buckets of comparable size', () => {
    const spy = parseStaticFile(JSON.parse(readFileSync('public/data/SPY.json', 'utf8')));
    const tally = { up: 0, down: 0, sideways: 0 };
    for (let cut = 100; cut < spy.length - 20; cut += 3) tally[classifyOutcome(spy, cut, 15)!.outcome]++;
    const total = tally.up + tally.down + tally.sideways;
    // Not exactly thirds (stocks drift upwards), but no bucket should be rare.
    for (const n of Object.values(tally)) expect(n / total, JSON.stringify(tally)).toBeGreaterThan(0.15);
  });
});

describe('spaced repetition (SM-2)', () => {
  const NOW = 1_700_000_000_000;
  const DAY = 86_400_000;

  it('starts a card due immediately with the standard ease', () => {
    expect(newCard('pattern', 'hammer', NOW)).toMatchObject({ id: 'pattern:hammer', ease: 2.5, intervalDays: 0, dueAt: NOW, attempts: 0 });
  });

  it('spaces right answers at 1 day, 6 days, then interval times ease', () => {
    let card = newCard('pattern', 'hammer', NOW);
    card = reviewCard(card, true, NOW);
    expect(card).toMatchObject({ repetitions: 1, intervalDays: 1, dueAt: NOW + DAY, ease: 2.5 });
    card = reviewCard(card, true, NOW);
    expect(card).toMatchObject({ repetitions: 2, intervalDays: 6 });
    card = reviewCard(card, true, NOW);
    expect(card).toMatchObject({ repetitions: 3, intervalDays: 15 }); // 6 * 2.5
    expect(card).toMatchObject({ attempts: 3, correct: 3, lapses: 0 });
  });

  it('brings a missed card back tomorrow and lowers its ease', () => {
    let card = reviewCard(reviewCard(newCard('pattern', 'doji', NOW), true, NOW), true, NOW);
    card = reviewCard(card, false, NOW);
    expect(card).toMatchObject({ repetitions: 0, intervalDays: 1, lapses: 1, attempts: 3, correct: 2 });
    expect(card.ease).toBeCloseTo(2.18, 10); // 2.5 - 0.32
    expect(card.lastReviewedAt).toBe(NOW);
  });

  it('never lets ease fall below 1.3', () => {
    let card = newCard('pattern', 'doji', NOW);
    for (let i = 0; i < 20; i++) card = reviewCard(card, false, NOW);
    expect(card.ease).toBe(1.3);
  });

  it('reports accuracy, or null before any answer', () => {
    expect(accuracy(undefined)).toBeNull();
    expect(accuracy(newCard('pattern', 'x', NOW))).toBeNull();
    expect(accuracy({ attempts: 4, correct: 3 })).toBe(0.75);
  });

  const card = (refId: string, attempts: number, correct: number, dueAt: number): ReviewCard => ({
    ...newCard('pattern', refId, NOW), attempts, correct, dueAt,
  });

  it('weights unseen, weak and overdue items more heavily', () => {
    const strongNotDue = selectionWeight(card('a', 10, 10, NOW + DAY), NOW);
    const strongDue = selectionWeight(card('a', 10, 10, NOW - DAY), NOW);
    const weakNotDue = selectionWeight(card('a', 10, 2, NOW + DAY), NOW);
    expect(strongNotDue).toBe(1);
    expect(strongDue).toBe(3);
    expect(weakNotDue).toBeCloseTo(4.2, 10);
    expect(selectionWeight(undefined, NOW)).toBe(3);
  });

  it('shows weak items more often than strong ones', () => {
    const cards = { 'pattern:weak': card('weak', 10, 1, NOW + DAY), 'pattern:strong': card('strong', 10, 10, NOW + DAY) };
    const random = seededRandom(5);
    const picks = { weak: 0, strong: 0 };
    for (let i = 0; i < 4000; i++) picks[pickWeighted(['weak', 'strong'] as const, cards, (id) => `pattern:${id}`, NOW, random)]++;
    // Weights are 4.6 and 1, so the weak item should come up about 82% of the time.
    expect(picks.weak / 4000).toBeGreaterThan(0.78);
    expect(picks.weak / 4000).toBeLessThan(0.86);
    expect(picks.strong).toBeGreaterThan(0);
  });

  it('does not ask the same item twice in a row when there is a choice', () => {
    const random = seededRandom(9);
    for (let i = 0; i < 200; i++) expect(pickWeighted(['a', 'b', 'c'] as const, {}, (id) => id, NOW, random, 'b')).not.toBe('b');
    expect(pickWeighted(['a'] as const, {}, (id) => id, NOW, random, 'a')).toBe('a');
  });

  it('lists the weakest cards first, ignoring ones barely attempted', () => {
    const cards = {
      a: card('a', 10, 9, NOW),
      b: card('b', 10, 3, NOW),
      c: card('c', 1, 0, NOW),
      d: card('d', 4, 2, NOW),
    };
    expect(weakestCards(cards).map((c) => c.refId)).toEqual(['b', 'd', 'a']);
  });
});

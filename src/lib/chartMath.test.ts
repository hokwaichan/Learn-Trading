import { describe, expect, it } from 'vitest';
import type { Candle } from '@/types';
import { distanceToSegment, fibLevels, logicalToTime, timeToLogical } from './drawing/geometry';
import { explainCandle } from './explain/candle';
import { heikinAshi } from './indicators/heikinAshi';
import { anatomy, classifyShape } from './patterns/anatomy';

const k = (time: number, open: number, high: number, low: number, close: number, volume = 100): Candle => ({
  time, open, high, low, close, volume,
});

describe('heikinAshi', () => {
  // Hand-computed from the definition.
  const src = [k(1, 10, 12, 9, 11), k(2, 11, 13, 10, 12), k(3, 12, 12.5, 8, 9)];
  const ha = heikinAshi(src);

  it('seeds the first candle from its own open and close', () => {
    expect(ha[0]).toMatchObject({ open: 10.5, close: 10.5, high: 12, low: 9 });
  });

  it('averages the previous HA open and close for the next open', () => {
    expect(ha[1].open).toBe(10.5);
    expect(ha[1].close).toBe(11.5);
    expect(ha[2].open).toBe(11);
    expect(ha[2].close).toBe(10.375);
  });

  it('stretches high and low to include the HA open and close', () => {
    expect(ha[2].high).toBe(12.5);
    expect(ha[2].low).toBe(8);
    const gap = heikinAshi([k(1, 10, 10, 10, 10), k(2, 20, 21, 19, 20)]);
    expect(gap[1].open).toBe(10);
    expect(gap[1].low).toBe(10);
  });

  it('keeps time and volume, and handles an empty list', () => {
    expect(ha.map((c) => c.time)).toEqual([1, 2, 3]);
    expect(ha[0].volume).toBe(100);
    expect(heikinAshi([])).toEqual([]);
  });
});

describe('candle anatomy', () => {
  it('measures body and wicks as fractions of the range', () => {
    const a = anatomy(k(1, 10, 20, 0, 15));
    expect(a).toMatchObject({ direction: 'up', range: 20, body: 5, upperWick: 5, lowerWick: 10 });
    expect(a.bodyPct).toBe(0.25);
    expect(a.upperWickPct).toBe(0.25);
    expect(a.lowerWickPct).toBe(0.5);
  });

  it('does not divide by zero on a flat candle', () => {
    expect(anatomy(k(1, 5, 5, 5, 5))).toMatchObject({ direction: 'flat', bodyPct: 0 });
    expect(classifyShape(k(1, 5, 5, 5, 5))).toBeNull();
  });

  it.each([
    ['doji', k(1, 100, 105, 95, 100.5)],
    ['marubozu', k(1, 100, 110, 99.8, 109.9)],
    ['hammer', k(1, 108, 110, 100, 109.5)],
    ['shooting-star', k(1, 102, 110, 100, 100.5)],
    ['spinning-top', k(1, 104, 110, 100, 106)],
  ] as const)('recognises a %s', (shape, candle) => {
    expect(classifyShape(candle)).toBe(shape);
  });

  it('gives an ordinary candle no name', () => {
    expect(classifyShape(k(1, 100, 110, 98, 107))).toBeNull();
  });
});

describe('explainCandle', () => {
  const history = Array.from({ length: 20 }, (_, i) => k(i, 100, 101, 99, 100.5, 100));

  it('states the four prices and direction', () => {
    const e = explainCandle([...history, k(20, 100, 103, 99, 102)], 20)!;
    expect(e.facts.slice(0, 4).map((f) => f.value)).toEqual(['100.00', '103.00', '99.00', '102.00']);
    expect(e.facts[4]).toMatchObject({ value: '+2.00%', tone: 'up' });
    expect(e.paragraphs[0].text).toContain('rising (bullish)');
  });

  it('names a recognised shape', () => {
    const e = explainCandle([...history, k(20, 108, 110, 100, 109.5)], 20)!;
    expect(e.paragraphs[1].heading).toBe('Shape: Hammer shape');
  });

  it('flags an unusually large range and heavy volume', () => {
    const e = explainCandle([...history, k(20, 100, 108, 99, 107, 500)], 20)!;
    const context = e.paragraphs.find((p) => p.heading === 'Compared with recent candles')!.text;
    expect(context).toContain('unusually big move');
    expect(context).toContain('5.0 times the recent average');
  });

  it('does not compare a candle that is still forming with finished ones', () => {
    const e = explainCandle([...history, k(20, 100, 100.2, 99.9, 100.1, 5)], 20, { forming: true })!;
    expect(e.paragraphs[0].heading).toBe('Still forming');
    const context = e.paragraphs.find((p) => p.heading === 'Compared with recent candles')!.text;
    expect(context).toContain('lower than the previous');
    expect(context).not.toContain('average');
  });

  it('works for the first candle and returns null out of range', () => {
    expect(explainCandle(history, 0)).not.toBeNull();
    expect(explainCandle(history, 99)).toBeNull();
  });

  it('formats daily and intraday times', () => {
    const t = Date.UTC(2026, 2, 5, 14, 30) / 1000;
    expect(explainCandle([k(t, 1, 2, 1, 2)], 0, { daily: true })!.title).toBe('Candle of 2026-03-05');
    expect(explainCandle([k(t, 1, 2, 1, 2)], 0)!.title).toBe('Candle of 2026-03-05 14:30 UTC');
  });
});

describe('drawing geometry', () => {
  // Daily candles with a weekend gap between index 1 and 2.
  const DAY = 86_400;
  const candles = [k(0, 1, 1, 1, 1), k(DAY, 1, 1, 1, 1), k(4 * DAY, 1, 1, 1, 1), k(5 * DAY, 1, 1, 1, 1)];

  it('maps candle times to their index', () => {
    expect(timeToLogical(candles, 0, DAY)).toBe(0);
    expect(timeToLogical(candles, 4 * DAY, DAY)).toBe(2);
    expect(timeToLogical(candles, 5 * DAY, DAY)).toBe(3);
  });

  it('interpolates inside a gap and extrapolates outside the data', () => {
    expect(timeToLogical(candles, 2.5 * DAY, DAY)).toBe(1.5);
    expect(timeToLogical(candles, 7 * DAY, DAY)).toBe(5);
    expect(timeToLogical(candles, -2 * DAY, DAY)).toBe(-2);
  });

  it('round-trips through logicalToTime', () => {
    for (const logical of [-3, 0, 0.25, 1.5, 2, 3, 6.5]) {
      expect(timeToLogical(candles, logicalToTime(candles, logical, DAY), DAY)).toBeCloseTo(logical, 6);
    }
  });

  it('computes Fibonacci retracement levels of an up move', () => {
    const levels = fibLevels(100, 200);
    expect(levels.map((l) => l.ratio)).toEqual([0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]);
    expect(levels.map((l) => Number(l.price.toFixed(1)))).toEqual([200, 176.4, 161.8, 150, 138.2, 121.4, 100]);
  });

  it('computes Fibonacci levels of a down move', () => {
    expect(fibLevels(200, 100).find((l) => l.ratio === 0.618)!.price).toBeCloseTo(161.8);
  });

  it('measures distance to a segment, including past its ends', () => {
    expect(distanceToSegment({ x: 5, y: 3 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(3);
    expect(distanceToSegment({ x: 13, y: 4 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(5);
    expect(distanceToSegment({ x: 1, y: 1 }, { x: 0, y: 0 }, { x: 0, y: 0 })).toBeCloseTo(Math.SQRT2);
  });
});

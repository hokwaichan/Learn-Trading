import { describe, expect, it } from 'vitest';
import type { Candle } from '@/types';
import { dailyLevels, donchian, inSession, KILL_ZONES, newYorkTime, openingRange, previousDayLevels, sessionRanges, SESSIONS, sessionsAt } from './sessions';
import {
  dealingRange,
  extension,
  findFairValueGaps,
  findLiquidityPools,
  findOrderBlocks,
  findStructureBreaks,
  findSweeps,
  findSwings,
  oteZone,
  rangePosition,
  retracement,
  type Swing,
} from './structure';

const HOUR = 3600;
const DAY = 86_400;

/** Candles from [open, high, low, close] rows. */
const bars = (rows: number[][], step = DAY, start = 0): Candle[] => rows.map(([open, high, low, close], i) => ({ time: start + i * step, open, high, low, close, volume: 100 }));

/** Candles that walk through a list of closes, each with a half-point wick either side. */
function path(closes: number[], step = DAY): Candle[] {
  return closes.map((close, i) => {
    const open = i === 0 ? close : closes[i - 1];
    return { time: i * step, open, high: Math.max(open, close) + 0.5, low: Math.min(open, close) - 0.5, close, volume: 100 };
  });
}

// Up to 110, back to 102, up through 110 to 115, back to 111, a lower high at
// 114, down through 110.5, a bounce, then down through the next low.
const ZIGZAG = path([100, 104, 108, 110, 107, 104, 102, 105, 109, 112, 115, 113, 111, 112, 114, 109, 106, 103, 100, 98, 101, 103, 100, 96, 94]);

describe('swing points', () => {
  it('finds highs and lows that stand out from the candles either side', () => {
    const swings = findSwings(ZIGZAG, 2);
    const brief = swings.map((s) => `${s.kind}@${s.index}=${s.price}`);
    expect(brief).toEqual(['high@3=110.5', 'low@6=101.5', 'high@10=115.5', 'low@12=110.5', 'high@14=114.5', 'low@19=97.5', 'high@21=103.5']);
  });

  it('records when each swing became known, never earlier than its strength', () => {
    for (const s of findSwings(ZIGZAG, 2)) expect(s.confirmedAt).toBe(s.index + 2);
    // A stronger setting finds fewer, more important swings.
    expect(findSwings(ZIGZAG, 4).length).toBeLessThan(findSwings(ZIGZAG, 2).length);
  });

  it('marks a flat top once, at its first candle', () => {
    const flat = bars([
      [1, 2, 1, 2],
      [2, 5, 2, 4],
      [4, 5, 3, 4],
      [4, 4, 2, 3],
      [3, 3, 1, 2],
    ]);
    expect(findSwings(flat, 1).filter((s) => s.kind === 'high').map((s) => s.index)).toEqual([1]);
  });

  it('finds nothing in too few candles', () => {
    expect(findSwings(ZIGZAG.slice(0, 4), 2)).toEqual([]);
    expect(findSwings([], 3)).toEqual([]);
  });
});

describe('breaks of structure', () => {
  const swings = findSwings(ZIGZAG, 2);
  const breaks = findStructureBreaks(ZIGZAG, swings);

  it('labels a break with the trend as a break of structure and the first against it as a change of character', () => {
    expect(breaks.map((b) => [b.index, b.kind, b.direction, b.level])).toEqual([
      [9, 'bos', 'bullish', 110.5],
      [15, 'choch', 'bearish', 110.5],
      [23, 'bos', 'bearish', 97.5],
    ]);
    expect(breaks[0].swingIndex).toBe(3);
  });

  it('needs a close beyond the level: a wick through it is not a break', () => {
    // Same shape, but candle 9 only wicks above 110.5 and closes at 110.
    const wick = ZIGZAG.slice(0, 10).map((c, i) => (i === 9 ? { ...c, high: 113, close: 110 } : c));
    expect(findStructureBreaks(wick, findSwings(wick, 2))).toEqual([]);
  });

  it('does not use a swing before it is confirmed', () => {
    // The swing high at candle 3 is confirmed on candle 5; nothing can break it earlier.
    for (const b of breaks) {
      const swing = swings.find((s) => s.index === b.swingIndex)!;
      expect(b.index).toBeGreaterThanOrEqual(swing.confirmedAt);
    }
  });

  it('breaks each swing once', () => {
    expect(new Set(breaks.map((b) => `${b.direction}:${b.swingIndex}`)).size).toBe(breaks.length);
  });
});

describe('fair value gaps', () => {
  const candles = bars([
    [100, 101, 99, 100.5],
    [100.5, 106, 100.4, 105.8],
    [105.8, 107, 103, 106.5],
    [106.5, 107, 104, 104.5],
    [104.5, 105, 102.5, 103],
    [103, 103.5, 100.5, 101],
  ]);

  it('finds a bullish gap between the first candle high and the third candle low', () => {
    const [gap] = findFairValueGaps(candles);
    expect(gap).toMatchObject({ index: 1, direction: 'bullish', bottom: 101, top: 103 });
  });

  it('records when price comes back into the gap and when it fills it', () => {
    const [gap] = findFairValueGaps(candles);
    expect(gap.touchedAt).toBe(4);
    expect(gap.filledAt).toBe(5);
    const open = findFairValueGaps(candles.slice(0, 4))[0];
    expect(open.touchedAt).toBeUndefined();
    expect(open.filledAt).toBeUndefined();
  });

  it('finds bearish gaps as the mirror image', () => {
    const down = bars([
      [100, 101, 99, 99.5],
      [99.5, 99.6, 94, 94.2],
      [94.2, 97, 93, 93.5],
      [93.5, 99.5, 93, 99],
    ]);
    const [gap] = findFairValueGaps(down);
    expect(gap).toMatchObject({ index: 1, direction: 'bearish', top: 99, bottom: 97, touchedAt: 3, filledAt: 3 });
  });

  it('ignores overlapping candles and gaps too small to matter', () => {
    const overlap = bars([
      [100, 102, 99, 101],
      [101, 104, 100, 103],
      [103, 105, 101.5, 104],
    ]);
    expect(findFairValueGaps(overlap)).toEqual([]);
    const tiny = bars([
      [100, 101, 99, 100.5],
      [100.5, 102, 100.4, 101.8],
      [101.8, 103, 101.05, 102.5],
    ]);
    expect(findFairValueGaps(tiny)).toEqual([]);
    expect(findFairValueGaps(tiny, 0)).toHaveLength(1);
  });
});

describe('order blocks', () => {
  const breaks = findStructureBreaks(ZIGZAG, findSwings(ZIGZAG, 2));
  const blocks = findOrderBlocks(ZIGZAG, breaks);

  it('is the last candle against the move before it broke structure', () => {
    expect(blocks.map((b) => [b.index, b.direction, b.bottom, b.top, b.breakIndex])).toEqual([
      // The last down candle at the low the rally started from.
      [6, 'bullish', 101.5, 104.5, 9],
      // The last up candles at the highs the falls started from.
      [14, 'bearish', 111.5, 114.5, 15],
      [21, 'bearish', 100.5, 103.5, 23],
    ]);
    expect(ZIGZAG[6].close).toBeLessThan(ZIGZAG[6].open);
    expect(ZIGZAG[14].close).toBeGreaterThan(ZIGZAG[14].open);
  });

  it('records the first return to the block after the break', () => {
    expect(blocks[0].touchedAt).toBe(17);
    expect(blocks[2].touchedAt).toBeUndefined();
  });

  it('always sits before the break that created it', () => {
    for (const b of blocks) expect(b.index).toBeLessThan(b.breakIndex);
  });
});

describe('liquidity', () => {
  const swing = (index: number, kind: 'high' | 'low', price: number): Swing => ({ index, time: index, kind, price, confirmedAt: index + 2 });

  it('groups equal highs and equal lows into pools', () => {
    const pools = findLiquidityPools([swing(1, 'high', 110), swing(3, 'low', 100), swing(5, 'high', 110.1), swing(7, 'low', 100.05), swing(9, 'high', 115), swing(11, 'low', 99.95)]);
    expect(pools).toHaveLength(2);
    expect(pools[0]).toMatchObject({ kind: 'equal-highs', price: 110.1 });
    expect(pools[0].swings.map((s) => s.index)).toEqual([1, 5]);
    expect(pools[1]).toMatchObject({ kind: 'equal-lows', price: 99.95 });
    expect(pools[1].swings).toHaveLength(3);
  });

  it('needs the swings to be close and next to each other', () => {
    expect(findLiquidityPools([swing(1, 'high', 110), swing(5, 'high', 112)])).toEqual([]);
    expect(findLiquidityPools([swing(1, 'high', 110), swing(5, 'high', 120), swing(9, 'high', 110)])).toEqual([]);
    expect(findLiquidityPools([swing(1, 'high', 110), swing(5, 'high', 111)], 0.01)).toHaveLength(1);
  });

  it('finds a sweep: a wick beyond the level that closes back inside', () => {
    const candles = bars([
      [100, 101, 99, 100],
      [100, 105, 100, 104],
      [104, 104.5, 102, 103],
      [103, 106, 102.5, 104],
      [104, 107, 103.9, 106.5],
    ]);
    const sweeps = findSweeps(candles, findSwings(candles, 1));
    expect(sweeps).toEqual([{ index: 3, time: 3 * DAY, side: 'high', level: 105, swingIndex: 1 }]);
  });

  it('does not call a close beyond the level a sweep, and retires the level', () => {
    const candles = bars([
      [100, 101, 99, 100],
      [100, 105, 100, 104],
      [104, 104.5, 102, 103],
      [103, 106, 102.5, 105.5],
      [105.5, 106, 103, 104],
    ]);
    expect(findSweeps(candles, findSwings(candles, 1))).toEqual([]);
  });

  it('finds sweeps of lows too', () => {
    const candles = bars([
      [100, 101, 99, 100],
      [100, 100.5, 95, 96],
      [96, 98, 95.5, 97],
      [97, 97.5, 94, 96.5],
    ]);
    expect(findSweeps(candles, findSwings(candles, 1)).map((s) => [s.index, s.side, s.level])).toEqual([[3, 'low', 95]]);
  });
});

describe('ranges and Fibonacci', () => {
  it('builds the dealing range from the latest swings known at a candle', () => {
    const swings = findSwings(ZIGZAG, 2);
    expect(dealingRange(swings, 8)).toEqual({ high: 110.5, low: 101.5, equilibrium: 106 });
    expect(dealingRange(swings, 14)).toEqual({ high: 115.5, low: 110.5, equilibrium: 113 });
    // Before a high and a low are both known there is no range.
    expect(dealingRange(swings, 5)).toBeNull();
  });

  it('places a price in premium or discount', () => {
    const range = { high: 120, low: 100 };
    expect(rangePosition(range, 105)).toEqual({ position: 0.25, zone: 'discount' });
    expect(rangePosition(range, 118)).toMatchObject({ zone: 'premium' });
    expect(rangePosition(range, 110).zone).toBe('equilibrium');
  });

  it('measures retracements back from the end of a move', () => {
    // An up-move from 100 to 200.
    expect(retracement(100, 200, 0.5)).toBe(150);
    expect(retracement(100, 200, 0.618)).toBeCloseTo(138.2, 10);
    // A down-move from 200 to 100 retraces upwards.
    expect(retracement(200, 100, 0.382)).toBeCloseTo(138.2, 10);
  });

  it('projects extensions beyond the end of a move', () => {
    expect(extension(100, 200, 1.618)).toBeCloseTo(261.8, 10);
    expect(extension(200, 100, 1.272)).toBeCloseTo(72.8, 10);
  });

  it('gives the optimal trade entry zone as a 62% to 79% pullback', () => {
    const up = oteZone(100, 200);
    expect(up.from).toBeCloseTo(138.2, 10);
    expect(up.to).toBeCloseTo(121.4, 10);
    expect(up.sweetSpot).toBeCloseTo(129.5, 10);
    // In an up-move the zone is in the discount half of the range.
    expect(rangePosition({ high: 200, low: 100 }, up.sweetSpot).zone).toBe('discount');
    expect(rangePosition({ high: 200, low: 100 }, oteZone(200, 100).sweetSpot).zone).toBe('premium');
  });
});

describe('sessions', () => {
  const utc = (iso: string) => Date.parse(iso);

  it('converts to New York time, following daylight saving', () => {
    // Winter: New York is five hours behind UTC.
    expect(newYorkTime(utc('2026-01-15T14:30:00Z'))).toEqual({ minutes: 9 * 60 + 30, date: '2026-01-15' });
    // Summer: four hours behind.
    expect(newYorkTime(utc('2026-07-15T13:30:00Z'))).toEqual({ minutes: 9 * 60 + 30, date: '2026-07-15' });
    // Just after midnight UTC is still the evening before in New York.
    expect(newYorkTime(utc('2026-01-15T00:30:00Z'))).toEqual({ minutes: 19 * 60 + 30, date: '2026-01-14' });
  });

  it('handles sessions that run past midnight', () => {
    const asia = SESSIONS[0];
    expect(inSession(asia, 20 * 60)).toBe(true);
    expect(inSession(asia, 3 * 60 + 59)).toBe(true);
    expect(inSession(asia, 4 * 60)).toBe(false);
    expect(inSession(asia, 12 * 60)).toBe(false);
  });

  it('says which sessions and kill zones are open', () => {
    const ids = (iso: string, defs = SESSIONS) => sessionsAt(utc(iso), defs).map((s) => s.id);
    // 04:00 in New York: Asia has just closed, London is open.
    expect(ids('2026-01-15T09:00:00Z')).toEqual(['london']);
    // 08:30: the London and New York overlap.
    expect(ids('2026-01-15T13:30:00Z')).toEqual(['london', 'new-york']);
    // 18:00: between New York and Asia.
    expect(ids('2026-01-15T23:00:00Z')).toEqual([]);
    expect(ids('2026-01-15T08:00:00Z', KILL_ZONES)).toEqual(['london-kz']);
    expect(ids('2026-01-15T13:30:00Z', KILL_ZONES)).toEqual(['ny-kz']);
    expect(ids('2026-01-15T16:30:00Z', KILL_ZONES)).toEqual(['london-close-kz']);
    // 21:00 New York: the Asian kill zone, which ends at midnight.
    expect(ids('2026-01-16T02:00:00Z', KILL_ZONES)).toEqual(['asia-kz']);
    expect(ids('2026-01-16T05:00:00Z', KILL_ZONES)).toEqual([]);
  });

  it('finds each session in a run of candles, with its high and low', () => {
    // Hourly candles for 15 January 2026 UTC. Each candle's high is its hour + 100.
    const start = utc('2026-01-15T00:00:00Z') / 1000;
    const candles = bars(Array.from({ length: 24 }, (_, h) => [100 + h, 100 + h + 0.5, 100 + h - 0.5, 100 + h]), HOUR, start);
    const ranges = sessionRanges(candles);
    const london = ranges.find((r) => r.session.id === 'london')!;
    // London is 03:00 to 12:00 New York, which is 08:00 to 17:00 UTC in winter.
    expect((london.from - start) / HOUR).toBe(8);
    expect((london.to - start) / HOUR).toBe(16);
    expect(london.high).toBe(116.5);
    expect(london.low).toBe(107.5);
    // Asia is 19:00 to 04:00 New York: exactly 00:00 to 09:00 UTC in winter.
    const asia = ranges.filter((r) => r.session.id === 'asia');
    expect(asia).toHaveLength(1);
    expect([(asia[0].from - start) / HOUR, (asia[0].to - start) / HOUR]).toEqual([0, 8]);
    expect(ranges.filter((r) => r.session.id === 'new-york')).toHaveLength(1);
  });
});

describe('daily levels', () => {
  // Three days of 6-hour candles. Day d has highs up to 10d + 4 and lows down to 10d - 1.
  const candles = bars(
    [0, 1, 2].flatMap((d) => [
      [10 * d, 10 * d + 1, 10 * d - 1, 10 * d + 0.5],
      [10 * d + 0.5, 10 * d + 4, 10 * d, 10 * d + 3],
      [10 * d + 3, 10 * d + 3.5, 10 * d + 1, 10 * d + 2],
      [10 * d + 2, 10 * d + 2.5, 10 * d + 1.5, 10 * d + 2.2],
    ]),
    6 * HOUR,
  );

  it('summarises each UTC day', () => {
    expect(dailyLevels(candles)).toEqual([
      { day: 0, from: 0, open: 0, high: 4, low: -1, close: 2.2 },
      { day: 1, from: DAY, open: 10, high: 14, low: 9, close: 12.2 },
      { day: 2, from: 2 * DAY, open: 20, high: 24, low: 19, close: 22.2 },
    ]);
  });

  it('gives every candle the day before, and nothing on the first day', () => {
    const { high, low, close } = previousDayLevels(candles);
    expect(high.slice(0, 4)).toEqual([null, null, null, null]);
    expect(high.slice(4, 8)).toEqual([4, 4, 4, 4]);
    expect(low.slice(8)).toEqual([9, 9, 9, 9]);
    expect(close[11]).toBe(12.2);
  });

  it('on daily candles is simply the previous candle', () => {
    const daily = bars([
      [1, 5, 0, 4],
      [4, 8, 3, 7],
      [7, 9, 6, 8],
    ]);
    expect(previousDayLevels(daily).high).toEqual([null, 5, 8]);
  });
});

describe('opening range', () => {
  const QUARTER = 900;
  // Two days of 15-minute candles. The first hour of day one spans 98 to 103; of day two, 108 to 113.
  const day = (base: number) => [
    [base, base + 2, base - 2, base + 1],
    [base + 1, base + 3, base, base + 2],
    [base + 2, base + 2.5, base - 1, base],
    [base, base + 1, base - 1.5, base + 0.5],
    ...Array.from({ length: 92 }, () => [base, base + 10, base - 10, base]),
  ];
  const candles = bars([...day(100), ...day(110)], QUARTER);

  it('is hidden while it forms, then holds for the rest of the day', () => {
    const { high, low } = openingRange(candles, QUARTER, 60);
    expect(high.slice(0, 4)).toEqual([null, null, null, null]);
    expect(high[4]).toBe(103);
    expect(low[4]).toBe(98);
    // Later candles going far outside do not change it.
    expect(high[95]).toBe(103);
    expect(low[95]).toBe(98);
  });

  it('starts again each day', () => {
    const { high, low } = openingRange(candles, QUARTER, 60);
    expect(high.slice(96, 100)).toEqual([null, null, null, null]);
    expect(high[100]).toBe(113);
    expect(low[191]).toBe(108);
  });

  it('can use a shorter range or a later start', () => {
    expect(openingRange(candles, QUARTER, 30).high[2]).toBe(103);
    expect(openingRange(candles, QUARTER, 15).high[1]).toBe(102);
    // Starting at 01:00 UTC, the first hour is candles 4 to 7, which span 90 to 110.
    const late = openingRange(candles, QUARTER, 60, 1);
    expect(late.high[8]).toBe(110);
    expect(late.low[8]).toBe(90);
  });

  it('is empty when the candles are too long to form the range', () => {
    expect(openingRange(candles, 2 * HOUR, 60).high.every((v) => v == null)).toBe(true);
    expect(openingRange(candles, DAY, 60).high.every((v) => v == null)).toBe(true);
  });
});

describe('Donchian channel', () => {
  const candles = bars([
    [10, 12, 9, 11],
    [11, 15, 10, 14],
    [14, 14.5, 11, 12],
    [12, 13, 8, 9],
    [9, 16, 9, 15.5],
  ]);

  it('is the highest high and lowest low of the candles before, not counting the current one', () => {
    const { upper, lower, middle } = donchian(candles, 3);
    expect(upper).toEqual([null, null, null, 15, 15]);
    expect(lower).toEqual([null, null, null, 9, 8]);
    expect(middle[4]).toBe(11.5);
    // So the last candle, closing at 15.5, is a close above the channel: a breakout.
    expect(candles[4].close).toBeGreaterThan(upper[4]!);
  });

  it('is empty for a period that does not fit', () => {
    expect(donchian(candles, 10).upper.every((v) => v == null)).toBe(true);
    expect(donchian(candles, 0).upper.every((v) => v == null)).toBe(true);
  });
});

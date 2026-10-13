import { describe, expect, it } from 'vitest';
import type { Candle } from '@/types';
import { atr, trueRange } from './atr';
import { bollinger } from './bollinger';
import { ema } from './ema';
import { computeIndicator, defaultParams, getIndicator, indicatorLabel, INDICATORS, normalizeParams } from './index';
import { macd } from './macd';
import { rsi } from './rsi';
import { emaOf, smaOf } from './series';
import { sma } from './sma';
import { stochastic } from './stochastic';
import { volumeMa } from './volumeMa';
import { vwap } from './vwap';

const DAY = 86_400;
const fromCloses = (closes: number[]): Candle[] =>
  closes.map((close, i) => ({ time: i * DAY, open: close, high: close, low: close, close, volume: 1000 }));
const hlc = (rows: [number, number, number, number?][], step = DAY): Candle[] =>
  rows.map(([high, low, close, volume = 1000], i) => ({ time: i * step, open: close, high, low, close, volume }));
const round = (values: (number | null)[], dp = 2) => values.map((v) => (v == null ? null : Number(v.toFixed(dp))));
const defined = (values: (number | null)[]) => values.filter((v): v is number => v != null);

/**
 * Published reference: StockCharts ChartSchool, "Moving Averages" worked
 * example (cs-movavg.xls, Intel closes). 10-period SMA and EMA.
 */
const MA_CLOSES = [
  22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15, 22.39, 22.38, 22.61, 23.36, 24.05,
  23.75, 23.83, 23.95, 23.63, 23.82, 23.87, 23.65, 23.19, 23.1, 23.33, 22.68, 23.1, 22.4, 22.17,
];
const SMA10 = [
  22.22, 22.21, 22.23, 22.26, 22.31, 22.42, 22.61, 22.77, 22.91, 23.08, 23.21, 23.38, 23.53, 23.65, 23.71, 23.69,
  23.61, 23.51, 23.43, 23.28, 23.13,
];
const EMA10 = [
  22.22, 22.21, 22.24, 22.27, 22.33, 22.52, 22.8, 22.97, 23.13, 23.28, 23.34, 23.43, 23.51, 23.54, 23.47, 23.4,
  23.39, 23.26, 23.23, 23.08, 22.92,
];

/**
 * Published reference: StockCharts ChartSchool, "Relative Strength Index"
 * worked example (cs-rsi.xls, QQQQ closes). 14-period Wilder RSI.
 */
const RSI_CLOSES = [
  44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28, 46.0,
  46.03, 46.41, 46.22, 45.64, 46.21, 46.25, 45.71, 46.45, 45.78, 45.35, 44.03, 44.18, 44.22, 44.57, 43.42, 42.66,
  43.13,
];
const RSI14 = [
  70.53, 66.32, 66.55, 69.41, 66.36, 57.97, 62.93, 63.26, 56.06, 62.38, 54.71, 50.42, 39.99, 41.46, 41.87, 45.46,
  37.3, 33.08, 37.77,
];

describe('SMA', () => {
  it('matches the StockCharts 10-period reference table', () => {
    const out = sma(fromCloses(MA_CLOSES), 10);
    expect(out.slice(0, 9).every((v) => v === null)).toBe(true);
    const values = defined(out);
    expect(values).toHaveLength(SMA10.length);
    // Within one cent: both the published closes and the published averages
    // are rounded to cents.
    values.forEach((v, i) => expect(Math.abs(v - SMA10[i])).toBeLessThanOrEqual(0.011));
  });

  it('is the plain average of the window', () => {
    expect(sma(fromCloses([1, 2, 3, 4, 5]), 3)).toEqual([null, null, 2, 3, 4]);
  });

  it('returns only nulls when there is not enough data', () => {
    expect(sma(fromCloses([1, 2]), 3)).toEqual([null, null]);
    expect(sma([], 3)).toEqual([]);
  });
});

describe('EMA', () => {
  it('matches the StockCharts 10-period reference table', () => {
    const out = round(defined(ema(fromCloses(MA_CLOSES), 10)));
    expect(out).toHaveLength(EMA10.length);
    // The published table chains values rounded to cents, so allow one cent.
    out.forEach((v, i) => expect(Math.abs((v as number) - EMA10[i])).toBeLessThanOrEqual(0.011));
  });

  it('is seeded with the simple average, then weights new closes by 2 / (period + 1)', () => {
    // period 3: k = 0.5. Seed (1+2+3)/3 = 2, then 2 + 0.5*(4-2) = 3, then 3 + 0.5*(5-3) = 4.
    expect(ema(fromCloses([1, 2, 3, 4, 5]), 3)).toEqual([null, null, 2, 3, 4]);
  });

  it('reacts faster than the SMA to a jump in price', () => {
    const candles = fromCloses([...Array(20).fill(100), 120]);
    expect(ema(candles, 10)[20]!).toBeGreaterThan(sma(candles, 10)[20]!);
  });
});

describe('Bollinger Bands', () => {
  it('uses the population standard deviation (textbook set with mean 5 and deviation 2)', () => {
    const out = bollinger(fromCloses([2, 4, 4, 4, 5, 5, 7, 9]), 8, 2);
    expect(out.middle[7]).toBe(5);
    expect(out.upper[7]).toBe(9);
    expect(out.lower[7]).toBe(1);
    expect(out.middle.slice(0, 7).every((v) => v === null)).toBe(true);
  });

  it('has a middle band equal to the SMA and bands that are symmetric around it', () => {
    const candles = fromCloses(MA_CLOSES);
    const out = bollinger(candles, 10, 2);
    const average = sma(candles, 10);
    for (let i = 9; i < candles.length; i++) {
      expect(out.middle[i]).toBeCloseTo(average[i]!, 10);
      expect(out.upper[i]! - out.middle[i]!).toBeCloseTo(out.middle[i]! - out.lower[i]!, 10);
    }
  });

  it('collapses onto the average when price does not move', () => {
    const out = bollinger(fromCloses(Array(25).fill(50)), 20, 2);
    expect(out.upper[24]).toBe(50);
    expect(out.lower[24]).toBe(50);
  });
});

describe('RSI', () => {
  it('matches the StockCharts 14-period reference table', () => {
    const out = rsi(fromCloses(RSI_CLOSES), 14);
    expect(out.slice(0, 14).every((v) => v === null)).toBe(true);
    const values = defined(out);
    expect(values).toHaveLength(RSI14.length);
    // The published closes are rounded to cents but the table was computed
    // from unrounded prices, which shifts every value by up to 0.07
    // (the first is 70.46 from these inputs, 70.53 as published).
    values.forEach((v, i) => expect(Math.abs(v - RSI14[i])).toBeLessThan(0.1));
    expect(values[0]).toBeCloseTo(70.46, 2);
  });

  it('is 100 when price only rises, 0 when it only falls, 50 when it is flat', () => {
    expect(rsi(fromCloses([1, 2, 3, 4, 5, 6]), 3)[5]).toBe(100);
    expect(rsi(fromCloses([6, 5, 4, 3, 2, 1]), 3)[5]).toBe(0);
    expect(rsi(fromCloses([3, 3, 3, 3, 3]), 3)[4]).toBe(50);
  });
});

describe('MACD', () => {
  const candles = fromCloses(RSI_CLOSES);
  const out = macd(candles, 5, 10, 4);

  it('is the fast EMA minus the slow EMA', () => {
    const fast = ema(candles, 5);
    const slow = ema(candles, 10);
    for (let i = 0; i < candles.length; i++) {
      if (i < 9) expect(out.macd[i]).toBeNull();
      else expect(out.macd[i]).toBeCloseTo(fast[i]! - slow[i]!, 12);
    }
  });

  it('has a signal line that is the EMA of the MACD line, starting once enough values exist', () => {
    expect(out.signal.findIndex((v) => v != null)).toBe(9 + 4 - 1);
    const expected = emaOf(out.macd, 4);
    expect(round(out.signal, 8)).toEqual(round(expected, 8));
  });

  it('has a histogram equal to MACD minus signal', () => {
    for (let i = 12; i < candles.length; i++) expect(out.histogram[i]).toBeCloseTo(out.macd[i]! - out.signal[i]!, 12);
  });

  it('hand-computed: 12/26/9 MACD of a steady +1 trend settles at 7', () => {
    // For a line rising 1 per candle, an EMA lags by (period - 1) / 2, so the
    // gap between the 12 and 26 EMAs is (25 - 11) / 2 = 7 and the histogram is 0.
    const line = macd(fromCloses(Array.from({ length: 400 }, (_, i) => 100 + i)), 12, 26, 9);
    expect(line.macd[399]).toBeCloseTo(7, 6);
    expect(line.histogram[399]).toBeCloseTo(0, 6);
  });
});

describe('Stochastic', () => {
  // Hand-computed. Columns: high, low, close.
  const candles = hlc([
    [10, 8, 9],
    [11, 9, 10],
    [12, 10, 11],
    [12, 9, 9.5],
    [13, 10, 12.5],
    [14, 11, 11.5],
  ]);

  it('raw %K is the position of the close in the high-low range of the window', () => {
    const { k } = stochastic(candles, 3, 1, 2);
    // i=2: range 8..12, close 11 -> 75. i=3: 9..12, 9.5 -> 16.67. i=4: 9..13, 12.5 -> 87.5. i=5: 9..14, 11.5 -> 50.
    expect(round(k)).toEqual([null, null, 75, 16.67, 87.5, 50]);
  });

  it('%D is the simple average of %K', () => {
    const { d } = stochastic(candles, 3, 1, 2);
    expect(round(d)).toEqual([null, null, null, 45.83, 52.08, 68.75]);
  });

  it('smoothing averages raw %K before %D is taken', () => {
    const { k, d } = stochastic(candles, 3, 2, 2);
    expect(round(k)).toEqual([null, null, null, 45.83, 52.08, 68.75]);
    expect(round(d)).toEqual([null, null, null, null, 48.96, 60.42]);
  });

  it('stays within 0 to 100 and handles a flat window', () => {
    const { k } = stochastic(hlc(RSI_CLOSES.map((c) => [c + 0.3, c - 0.3, c])), 14, 3, 3);
    defined(k).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    });
    expect(stochastic(hlc([[5, 5, 5], [5, 5, 5], [5, 5, 5]]), 3, 1, 1).k[2]).toBe(50);
  });
});

describe('ATR', () => {
  // Hand-computed. Columns: high, low, close.
  const candles = hlc([
    [10, 8, 9],
    [11, 9.5, 10.5],
    [15, 13, 14], // gap up: true range reaches back to the previous close
    [14, 12, 12.5],
    [12, 9, 9.5], // gap down
  ]);

  it('true range includes gaps from the previous close', () => {
    expect(trueRange(candles)).toEqual([2, 2, 4.5, 2, 3.5]);
  });

  it('seeds with a simple average, then uses Wilder smoothing', () => {
    // period 3: first = (2 + 2 + 4.5) / 3 = 2.8333; next = (2.8333*2 + 2) / 3 = 2.5556; next = (2.5556*2 + 3.5) / 3 = 2.8704
    expect(round(atr(candles, 3), 4)).toEqual([null, null, 2.8333, 2.5556, 2.8704]);
  });

  it('equals the candle range when every candle is the same size with no gaps', () => {
    const steady = hlc(Array.from({ length: 30 }, () => [102, 98, 100] as [number, number, number]));
    expect(atr(steady, 14)[29]).toBeCloseTo(4, 10);
  });
});

describe('VWAP', () => {
  const HOUR = 3600;

  it('is the volume-weighted typical price, hand-computed', () => {
    // typical prices 10, 20, 30 with volumes 1, 1, 2
    const candles = hlc([[11, 9, 10, 1], [21, 19, 20, 1], [31, 29, 30, 2]], HOUR);
    // 10; (10 + 20) / 2 = 15; (10 + 20 + 60) / 4 = 22.5
    expect(vwap(candles, 'day')).toEqual([10, 15, 22.5]);
  });

  it('restarts at the start of each UTC day on intraday charts', () => {
    const candles = hlc([[11, 9, 10, 5], [21, 19, 20, 5], [31, 29, 30, 5]], 12 * HOUR);
    // candle 2 opens at 24:00, a new day
    expect(vwap(candles, 'day')).toEqual([10, 15, 30]);
  });

  it('restarts each calendar month on daily charts', () => {
    const jan30 = Date.UTC(2026, 0, 30) / 1000;
    const candles = [0, 1, 2, 3].map((i) => ({
      time: jan30 + i * DAY, open: 10 * (i + 1), high: 10 * (i + 1), low: 10 * (i + 1), close: 10 * (i + 1), volume: 1,
    }));
    // Jan 30, Jan 31 | Feb 1, Feb 2
    expect(vwap(candles, 'month')).toEqual([10, 15, 30, 35]);
  });

  it('is null when there is no volume (for example forex data)', () => {
    expect(vwap(hlc([[2, 1, 1.5, 0], [2, 1, 1.5, 0]]), 'day')).toEqual([null, null]);
  });
});

describe('Volume MA', () => {
  it('averages volume, not price', () => {
    const candles = hlc([[2, 1, 1, 100], [2, 1, 1, 200], [2, 1, 1, 300], [2, 1, 1, 600]]);
    expect(volumeMa(candles, 3)).toEqual([null, null, 200, 1100 / 3]);
  });
});

describe('series helpers', () => {
  it('skip leading nulls and start once a full window of real values exists', () => {
    expect(smaOf([null, null, 2, 4, 6], 2)).toEqual([null, null, null, 3, 5]);
    expect(emaOf([null, 2, 4, 6], 2)).toEqual([null, null, 3, 5]);
  });
});

describe('indicator registry', () => {
  const candles = hlc(RSI_CLOSES.map((c, i) => [c + 0.4, c - 0.4, c, 1000 + i * 10]));

  it('lists the nine indicators', () => {
    expect(INDICATORS.map((d) => d.id).sort()).toEqual(
      ['atr', 'bollinger', 'ema', 'macd', 'rsi', 'sma', 'stochastic', 'volumeMa', 'vwap'].sort(),
    );
  });

  it.each(INDICATORS.map((d) => d.id))('%s computes every declared output, one value per candle', (id) => {
    const def = getIndicator(id);
    const out = computeIndicator({ id, params: defaultParams(id) }, candles, DAY);
    expect(Object.keys(out).sort()).toEqual(def.outputs.map((o) => o.key).sort());
    for (const key of Object.keys(out)) {
      expect(out[key]).toHaveLength(candles.length);
      out[key].forEach((v) => expect(v === null || Number.isFinite(v)).toBe(true));
    }
  });

  it('builds legend labels from parameters', () => {
    expect(indicatorLabel({ id: 'sma', params: { period: 50 } })).toBe('SMA 50');
    expect(indicatorLabel({ id: 'bollinger', params: { period: 20, multiplier: 2 } })).toBe('BB 20, 2');
    expect(indicatorLabel({ id: 'vwap', params: {} })).toBe('VWAP');
  });

  it('fills in and clamps parameters', () => {
    expect(normalizeParams('sma', {})).toEqual({ period: 20 });
    expect(normalizeParams('sma', { period: 100000 })).toEqual({ period: 400 });
    expect(normalizeParams('sma', { period: 7.6 })).toEqual({ period: 8 });
    expect(normalizeParams('bollinger', { period: NaN, multiplier: 2.5 })).toEqual({ period: 20, multiplier: 2.5 });
  });
});

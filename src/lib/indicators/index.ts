import { t } from '@/i18n';
import type { Candle, IndicatorConfig, IndicatorId } from '@/types';
import { atr } from './atr';
import { bollinger } from './bollinger';
import { ema } from './ema';
import { macd } from './macd';
import { donchian, openingRange, previousDayLevels } from '@/lib/structure/sessions';
import { rsi } from './rsi';
import type { Series } from './series';
import { sma } from './sma';
import { stochastic } from './stochastic';
import { volumeMa } from './volumeMa';
import { vwap } from './vwap';

export type { Series } from './series';
export { atr, bollinger, ema, macd, rsi, sma, stochastic, volumeMa, vwap };
export { heikinAshi } from './heikinAshi';

export interface IndicatorParam {
  key: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface IndicatorOutput {
  key: string;
  label: string;
  /** How the chart draws it. */
  style: 'line' | 'dashed' | 'histogram';
}

export interface IndicatorDefinition {
  id: IndicatorId;
  name: string;
  /** Short label used in legends, e.g. 'RSI'. */
  short: string;
  /**
   * Where it is drawn: on top of price, on top of the volume bars, or in a
   * pane of its own under the chart.
   */
  placement: 'overlay' | 'volume' | 'pane';
  params: IndicatorParam[];
  outputs: IndicatorOutput[];
  /** Horizontal reference levels, e.g. 30 and 70 for RSI. */
  guides?: number[];
  /** Fixed scale for the pane, e.g. 0 to 100. */
  range?: { min: number; max: number };
  /** Decimals for values, when not the price precision. */
  decimals?: number;
  compute: (candles: Candle[], params: Record<string, number>, context: { stepSeconds: number }) => Record<string, Series>;
}

const period = (def: number, label = t('Period')): IndicatorParam => ({
  key: 'period',
  label,
  default: def,
  min: 2,
  max: 400,
  step: 1,
});

/**
 * Every indicator the chart and the backtester can use.
 *
 * To add one: write a pure function (in this folder, or lib/structure for
 * session and structure levels), test it
 * against known values in indicators.test.ts, add its id to IndicatorId in
 * types/backtest.ts, add an entry here, and add its explanation to
 * content/indicators.ts. The chart, the Indicators dialog, the legend, the
 * Explain tab and the backtester rule builder all read from this list.
 */
export const INDICATORS: IndicatorDefinition[] = [
  {
    id: 'sma',
    name: t('Simple Moving Average'),
    short: 'SMA',
    placement: 'overlay',
    params: [period(20)],
    outputs: [{ key: 'value', label: 'SMA', style: 'line' }],
    compute: (c, p) => ({ value: sma(c, p.period) }),
  },
  {
    id: 'ema',
    name: t('Exponential Moving Average'),
    short: 'EMA',
    placement: 'overlay',
    params: [period(20)],
    outputs: [{ key: 'value', label: 'EMA', style: 'line' }],
    compute: (c, p) => ({ value: ema(c, p.period) }),
  },
  {
    id: 'bollinger',
    name: t('Bollinger Bands'),
    short: 'BB',
    placement: 'overlay',
    params: [period(20), { key: 'multiplier', label: t('Std. deviations'), default: 2, min: 0.5, max: 5, step: 0.1 }],
    outputs: [
      { key: 'upper', label: t('Upper'), style: 'line' },
      { key: 'middle', label: t('Middle'), style: 'dashed' },
      { key: 'lower', label: t('Lower'), style: 'line' },
    ],
    compute: (c, p) => ({ ...bollinger(c, p.period, p.multiplier) }),
  },
  {
    id: 'vwap',
    name: t('Volume-Weighted Average Price'),
    short: 'VWAP',
    placement: 'overlay',
    params: [],
    outputs: [{ key: 'value', label: 'VWAP', style: 'line' }],
    compute: (c, _p, ctx) => ({ value: vwap(c, ctx.stepSeconds >= 86_400 ? 'month' : 'day') }),
  },
  {
    id: 'volumeMa',
    name: t('Volume Moving Average'),
    short: t('Vol MA'),
    placement: 'volume',
    params: [period(20)],
    outputs: [{ key: 'value', label: t('Vol MA'), style: 'line' }],
    decimals: 0,
    compute: (c, p) => ({ value: volumeMa(c, p.period) }),
  },
  {
    id: 'rsi',
    name: t('Relative Strength Index'),
    short: 'RSI',
    placement: 'pane',
    params: [period(14)],
    outputs: [{ key: 'value', label: 'RSI', style: 'line' }],
    guides: [30, 70],
    range: { min: 0, max: 100 },
    decimals: 2,
    compute: (c, p) => ({ value: rsi(c, p.period) }),
  },
  {
    id: 'macd',
    name: t('MACD'),
    short: 'MACD',
    placement: 'pane',
    params: [
      { key: 'fast', label: t('Fast EMA'), default: 12, min: 2, max: 200, step: 1 },
      { key: 'slow', label: t('Slow EMA'), default: 26, min: 3, max: 400, step: 1 },
      { key: 'signal', label: t('Signal EMA'), default: 9, min: 2, max: 100, step: 1 },
    ],
    outputs: [
      { key: 'histogram', label: t('Histogram'), style: 'histogram' },
      { key: 'macd', label: 'MACD', style: 'line' },
      { key: 'signal', label: t('Signal'), style: 'line' },
    ],
    guides: [0],
    compute: (c, p) => ({ ...macd(c, p.fast, p.slow, p.signal) }),
  },
  {
    id: 'stochastic',
    name: t('Stochastic Oscillator'),
    short: 'Stoch',
    placement: 'pane',
    params: [
      period(14, t('%K period')),
      { key: 'smooth', label: t('%K smoothing'), default: 3, min: 1, max: 20, step: 1 },
      { key: 'd', label: t('%D period'), default: 3, min: 1, max: 20, step: 1 },
    ],
    outputs: [
      { key: 'k', label: '%K', style: 'line' },
      { key: 'd', label: '%D', style: 'dashed' },
    ],
    guides: [20, 80],
    range: { min: 0, max: 100 },
    decimals: 2,
    compute: (c, p) => ({ ...stochastic(c, p.period, p.smooth, p.d) }),
  },
  {
    id: 'atr',
    name: t('Average True Range'),
    short: 'ATR',
    placement: 'pane',
    params: [period(14)],
    outputs: [{ key: 'value', label: 'ATR', style: 'line' }],
    compute: (c, p) => ({ value: atr(c, p.period) }),
  },
  {
    id: 'donchian',
    name: t('Donchian Channel'),
    short: 'DC',
    placement: 'overlay',
    params: [period(20)],
    outputs: [
      { key: 'upper', label: t('Upper'), style: 'line' },
      { key: 'middle', label: t('Middle'), style: 'dashed' },
      { key: 'lower', label: t('Lower'), style: 'line' },
    ],
    compute: (c, p) => ({ ...donchian(c, p.period) }),
  },
  {
    id: 'prevDay',
    name: t('Previous Day Levels'),
    short: t('Prev day'),
    placement: 'overlay',
    params: [],
    outputs: [
      { key: 'high', label: t('High'), style: 'line' },
      { key: 'close', label: t('Close'), style: 'dashed' },
      { key: 'low', label: t('Low'), style: 'line' },
    ],
    compute: (c) => ({ ...previousDayLevels(c) }),
  },
  {
    id: 'openingRange',
    name: t('Opening Range'),
    short: 'OR',
    placement: 'overlay',
    params: [
      { key: 'minutes', label: t('Minutes'), default: 60, min: 5, max: 240, step: 5 },
      { key: 'startHour', label: t('Start hour (UTC)'), default: 0, min: 0, max: 23, step: 1 },
    ],
    outputs: [
      { key: 'high', label: t('High'), style: 'line' },
      { key: 'low', label: t('Low'), style: 'line' },
    ],
    compute: (c, p, ctx) => ({ ...openingRange(c, ctx.stepSeconds, p.minutes, p.startHour) }),
  },
];

const BY_ID = new Map(INDICATORS.map((d) => [d.id, d]));

export function getIndicator(id: IndicatorId): IndicatorDefinition {
  const def = BY_ID.get(id);
  if (!def) throw new Error(`Unknown indicator: ${id}`);
  return def;
}

export function defaultParams(id: IndicatorId): Record<string, number> {
  return Object.fromEntries(getIndicator(id).params.map((p) => [p.key, p.default]));
}

/** Fills in missing parameters and clamps the rest to their allowed range. */
export function normalizeParams(id: IndicatorId, params: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    getIndicator(id).params.map((p) => {
      const raw = Number(params[p.key]);
      const value = Number.isFinite(raw) ? Math.max(p.min, Math.min(p.max, raw)) : p.default;
      return [p.key, p.step >= 1 ? Math.round(value) : value];
    }),
  );
}

/** 'SMA 20', 'BB 20, 2', 'VWAP' */
export function indicatorLabel(config: Pick<IndicatorConfig, 'id' | 'params'>): string {
  const def = getIndicator(config.id);
  const values = def.params.map((p) => config.params[p.key] ?? p.default);
  return values.length ? `${def.short} ${values.join(', ')}` : def.short;
}

export function computeIndicator(
  config: Pick<IndicatorConfig, 'id' | 'params'>,
  candles: Candle[],
  stepSeconds: number,
): Record<string, Series> {
  return getIndicator(config.id).compute(candles, normalizeParams(config.id, config.params), { stepSeconds });
}

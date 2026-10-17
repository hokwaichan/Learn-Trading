import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BACKTEST_PRESETS } from '@/content/strategies';
import { t } from '@/i18n';
import { runBacktest, validateStrategy, warmupBars } from '@/lib/backtest';
import { describeDataError, findInstrument, mergeCandles, TIMEFRAME_SECONDS } from '@/lib/data';
import { createMigrate } from '@/lib/migrate';
import { finishedCandles } from '@/lib/replay/session';
import { DEFAULT_MAINTENANCE_MARGIN_RATE } from '@/lib/trading/futures';
import type { BacktestConfig, BacktestResult, BacktestStrategy, Candle, Instrument, Timeframe } from '@/types';
import { fetchCandleRange } from './market';
import { useSettings } from './settings';

export const BACKTEST_VERSION = 1;
/** The most candles one test will load. */
export const MAX_BACKTEST_CANDLES = 20_000;
const PAGE = 1000;
const HISTORY_LIMIT = 12;

export interface BacktestSetup {
  symbol: string;
  timeframe: Timeframe;
  /** Test period as YYYY-MM-DD dates, both included. */
  from: string;
  to: string;
  initialCapital: number;
  /** Trade as a futures position: leverage, funding and liquidation. */
  futures: boolean;
  leverage: number;
  applyFunding: boolean;
}

/** The headline numbers of a past run, kept so runs can be compared. */
export interface BacktestRunSummary {
  id: string;
  ranAt: number;
  strategyName: string;
  symbol: string;
  timeframe: Timeframe;
  from: string;
  to: string;
  /** 1 when not a futures test. */
  leverage: number;
  totalReturnPct: number;
  buyHoldReturnPct: number;
  maxDrawdownPct: number;
  tradeCount: number;
}

interface BacktestData {
  /** The strategy being edited. */
  strategy: BacktestStrategy;
  /** Strategies the user has saved. */
  saved: BacktestStrategy[];
  setup: BacktestSetup;
  history: BacktestRunSummary[];
}

interface BacktestStore extends BacktestData {
  status: 'idle' | 'running' | 'done' | 'error';
  error?: string;
  /** How far the candle download has got, 0 to 1. */
  progress: number;
  result: BacktestResult | null;
  /** The candles of the test period, for the chart. */
  candles: Candle[];
  edit: (patch: Partial<BacktestStrategy>) => void;
  /** Loads a preset or saved strategy into the editor as a copy. */
  load: (id: string) => void;
  /** Saves the strategy being edited under its name. Returns false if the name is empty. */
  save: () => boolean;
  remove: (id: string) => void;
  configure: (patch: Partial<BacktestSetup>) => void;
  run: () => Promise<void>;
  clearHistory: () => void;
}

const day = (offsetDays: number) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const DEFAULTS: BacktestData = {
  strategy: clone(BACKTEST_PRESETS[0]),
  saved: [],
  setup: { symbol: 'BTCUSDT', timeframe: '1d', from: day(-730), to: day(0), initialCapital: 10_000, futures: false, leverage: 3, applyFunding: true },
  history: [],
};

const startOf = (date: string) => Date.parse(`${date}T00:00:00Z`);
const endOf = (date: string) => Date.parse(`${date}T23:59:59.999Z`);

/** Candles in a year, for annualising. Crypto trades every day; the bundled markets about 252 days. */
export function periodsPerYear(instrument: Instrument, timeframe: Timeframe): number {
  return instrument.assetClass === 'crypto' ? (365 * 86_400) / TIMEFRAME_SECONDS[timeframe] : 252;
}

/** Loads the test period plus enough earlier candles for indicators to settle. */
async function loadCandles(instrument: Instrument, timeframe: Timeframe, fromMs: number, toMs: number, warmup: number, onProgress: (done: number) => void): Promise<Candle[]> {
  const step = TIMEFRAME_SECONDS[timeframe];
  let candles = await fetchCandleRange(instrument, timeframe, { to: fromMs - 1, limit: warmup });
  let cursor = fromMs;
  for (let page = 0; page < MAX_BACKTEST_CANDLES / PAGE; page++) {
    const next = await fetchCandleRange(instrument, timeframe, { from: cursor, limit: PAGE });
    candles = mergeCandles(candles, next.filter((c) => c.time * 1000 <= toMs));
    if (next.length === 0) break;
    const last = next[next.length - 1].time;
    onProgress(Math.min(1, (last * 1000 - fromMs) / Math.max(1, toMs - fromMs)));
    if (next.length < PAGE || last * 1000 >= toMs) break;
    cursor = (last + step) * 1000;
  }
  return finishedCandles(candles, step, Date.now());
}

export const useBacktest = create<BacktestStore>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      status: 'idle',
      progress: 0,
      result: null,
      candles: [],

      edit: (patch) => set((s) => ({ strategy: { ...s.strategy, ...patch } })),

      load(id) {
        const found = [...BACKTEST_PRESETS, ...get().saved].find((s) => s.id === id);
        if (found) set({ strategy: clone(found) });
      },

      save() {
        const { strategy, saved } = get();
        const name = strategy.name.trim();
        if (!name) return false;
        // A preset is never overwritten: saving one makes a copy.
        const id = strategy.preset ? `custom-${Date.now()}` : strategy.id;
        const entry: BacktestStrategy = { ...clone(strategy), id, name, preset: false };
        set({ strategy: entry, saved: saved.some((s) => s.id === id) ? saved.map((s) => (s.id === id ? entry : s)) : [...saved, entry] });
        return true;
      },

      remove: (id) => set((s) => ({ saved: s.saved.filter((x) => x.id !== id) })),

      configure: (patch) => set((s) => ({ setup: { ...s.setup, ...patch } })),

      async run() {
        const { strategy, setup, status } = get();
        if (status === 'running') return;
        const fail = (error: string): void => {
          set({ status: 'error', error, result: null, candles: [] });
        };

        const instrument = findInstrument(setup.symbol);
        if (!instrument) return fail(t('Unknown symbol {symbol}.', { symbol: setup.symbol }));
        const timeframe = instrument.timeframes.includes(setup.timeframe) ? setup.timeframe : instrument.timeframes[instrument.timeframes.length - 1];
        const problems = validateStrategy(strategy);
        if (problems.length) return fail(problems[0]);
        const from = startOf(setup.from);
        const to = Math.min(endOf(setup.to), Date.now());
        if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) return fail(t('The start date must be before the end date.'));
        if (!(setup.initialCapital > 0)) return fail(t('Starting capital must be above zero.'));
        const step = TIMEFRAME_SECONDS[timeframe];
        const expected = Math.ceil((to - from) / 1000 / step);
        if (expected > MAX_BACKTEST_CANDLES) {
          return fail(
            t('That period is about {n} candles. Choose a larger candle size or a shorter period (the limit is {max}).', {
              n: expected.toLocaleString('en-US'),
              max: MAX_BACKTEST_CANDLES.toLocaleString('en-US'),
            }),
          );
        }

        set({ status: 'running', error: undefined, progress: 0 });
        try {
          const all = await loadCandles(instrument, timeframe, from, to, warmupBars(strategy), (progress) => set({ progress }));
          const inPeriod = all.filter((c) => c.time * 1000 >= from && c.time * 1000 <= to);
          if (inPeriod.length < 2) return fail(t('There is no {symbol} price history in that period. Try later dates.', { symbol: instrument.symbol }));

          const settings = useSettings.getState();
          const futures = setup.futures && instrument.assetClass === 'crypto';
          const config: BacktestConfig = {
            symbol: instrument.symbol,
            timeframe,
            from,
            to,
            initialCapital: setup.initialCapital,
            feeRate: settings.feeRate,
            slippagePct: settings.slippagePct,
            futures: futures ? { leverage: setup.leverage, maintenanceMarginRate: DEFAULT_MAINTENANCE_MARGIN_RATE, applyFunding: setup.applyFunding } : undefined,
          };
          const output = runBacktest(strategy, config, all, { stepSeconds: step, periodsPerYear: periodsPerYear(instrument, timeframe) });
          const result: BacktestResult = { id: `bt-${Date.now()}`, ranAt: Date.now(), strategy: clone(strategy), config, ...output };
          const summary: BacktestRunSummary = {
            id: result.id,
            ranAt: result.ranAt,
            strategyName: strategy.name.trim() || t('Untitled strategy'),
            symbol: instrument.symbol,
            timeframe,
            from: setup.from,
            to: setup.to,
            leverage: futures ? setup.leverage : 1,
            totalReturnPct: output.stats.totalReturnPct,
            buyHoldReturnPct: output.stats.buyHoldReturnPct,
            maxDrawdownPct: output.stats.maxDrawdownPct,
            tradeCount: output.stats.tradeCount,
          };
          set((s) => ({ status: 'done', progress: 1, result, candles: inPeriod, history: [summary, ...s.history].slice(0, HISTORY_LIMIT) }));
        } catch (error) {
          fail(describeDataError(error));
        }
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'tradeschool.backtest',
      version: BACKTEST_VERSION,
      migrate: createMigrate<BacktestData>(BACKTEST_VERSION, DEFAULTS) as (p: unknown, v: number) => BacktestStore,
      partialize: ({ strategy, saved, setup, history }) => ({ strategy, saved, setup, history }),
    },
  ),
);

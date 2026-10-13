import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createCandleCache,
  createMarketData,
  describeDataError,
  findInstrument,
  indexedDbStore,
  mergeCandles,
  TIMEFRAME_SECONDS,
} from '@/lib/data';
import { createMigrate } from '@/lib/migrate';
import type { Candle, ChartLayout, Instrument, InstrumentKind, Quote, Timeframe } from '@/types';

export const MARKET_VERSION = 1;
const PAGE = 1000;

const marketData = createMarketData();
const cache = createCandleCache(indexedDbStore);

export interface SeriesState {
  candles: Candle[];
  /** 'loading' only while there is nothing to show yet. */
  status: 'loading' | 'ready' | 'error';
  /** Plain-language problem, shown as the error or as a "showing saved data" notice. */
  error?: string;
  /** True when candles came from the cache and the refresh failed. */
  stale: boolean;
  /** True when a substitute source answered (e.g. spot prices for a perpetual). */
  fallback: boolean;
  providerId?: string;
  loadingOlder: boolean;
  noMoreHistory: boolean;
}

export type WorkspaceMode = 'spot' | 'futures';

export interface WatchlistItem {
  symbol: string;
  kind: InstrumentKind;
}

interface MarketData {
  layouts: Record<WorkspaceMode, ChartLayout>;
  watchlist: WatchlistItem[];
}

interface MarketStore extends MarketData {
  /** Keyed by seriesKey(). Not persisted here; candles are cached in IndexedDB. */
  series: Record<string, SeriesState>;
  /** Keyed by quoteKey(). */
  quotes: Record<string, Quote>;
  load: (instrument: Instrument, timeframe: Timeframe) => Promise<void>;
  loadOlder: (instrument: Instrument, timeframe: Timeframe) => Promise<void>;
  applyLiveCandle: (key: string, candle: Candle) => void;
  refreshQuotes: () => Promise<void>;
  setLayout: (mode: WorkspaceMode, patch: Partial<ChartLayout>) => void;
  toggleWatch: (item: WatchlistItem) => void;
}

const DEFAULT_LAYOUT: ChartLayout = { timeframe: '1h', chartType: 'candles', indicators: [] };

const DEFAULTS: MarketData = {
  layouts: { spot: DEFAULT_LAYOUT, futures: DEFAULT_LAYOUT },
  watchlist: [
    { symbol: 'BTCUSDT', kind: 'spot' },
    { symbol: 'ETHUSDT', kind: 'spot' },
    { symbol: 'SOLUSDT', kind: 'spot' },
    { symbol: 'AAPL', kind: 'spot' },
    { symbol: 'SPY', kind: 'spot' },
    { symbol: 'EURUSD', kind: 'spot' },
  ],
};

export function seriesKey(instrument: Instrument, timeframe: Timeframe): string {
  return `${instrument.kind}:${instrument.symbol}:${timeframe}`;
}

export function quoteKey(item: WatchlistItem): string {
  return `${item.kind}:${item.symbol}`;
}

const EMPTY: SeriesState = {
  candles: [],
  status: 'loading',
  stale: false,
  fallback: false,
  loadingOlder: false,
  noMoreHistory: false,
};

const inflight = new Map<string, Promise<void>>();

export const useMarket = create<MarketStore>()(
  persist(
    (set, get) => {
      const patch = (key: string, changes: Partial<SeriesState>) =>
        set((s) => ({ series: { ...s.series, [key]: { ...(s.series[key] ?? EMPTY), ...changes } } }));

      return {
        ...DEFAULTS,
        series: {},
        quotes: {},

        load(instrument, timeframe) {
          const key = seriesKey(instrument, timeframe);
          const running = inflight.get(key);
          if (running) return running;

          const run = (async () => {
            const step = TIMEFRAME_SECONDS[timeframe];
            if (!get().series[key]?.candles.length) {
              patch(key, { status: 'loading', error: undefined });
              // Show saved candles straight away, then refresh them below.
              const saved = await cache.read(key);
              if (saved) patch(key, { candles: saved.candles, status: 'ready' });
            }
            try {
              const fresh = await marketData.fetchCandles(instrument, timeframe, { limit: PAGE });
              const existing = get().series[key]?.candles ?? [];
              // If the saved data ends long before the fresh data starts,
              // joining them would leave a hole in the chart: drop the old part.
              const joins =
                existing.length > 0 &&
                fresh.candles.length > 0 &&
                fresh.candles[0].time <= existing[existing.length - 1].time + step;
              const candles = joins ? mergeCandles(existing, fresh.candles) : fresh.candles;
              patch(key, {
                candles,
                status: 'ready',
                error: undefined,
                stale: false,
                fallback: fresh.fallback,
                providerId: fresh.providerId,
                noMoreHistory: instrument.source === 'static' || fresh.candles.length < PAGE,
              });
              void cache.write(key, candles);
            } catch (error) {
              const message = describeDataError(error);
              const hasData = (get().series[key]?.candles.length ?? 0) > 0;
              patch(key, hasData ? { status: 'ready', stale: true, error: message } : { status: 'error', error: message });
            }
          })().finally(() => inflight.delete(key));

          inflight.set(key, run);
          return run;
        },

        async loadOlder(instrument, timeframe) {
          const key = seriesKey(instrument, timeframe);
          const current = get().series[key];
          if (!current || current.status !== 'ready' || current.loadingOlder || current.noMoreHistory) return;
          if (current.candles.length === 0) return;
          patch(key, { loadingOlder: true });
          try {
            const older = await marketData.fetchCandles(instrument, timeframe, {
              limit: PAGE,
              to: current.candles[0].time * 1000 - 1,
            });
            const candles = mergeCandles(get().series[key].candles, older.candles);
            patch(key, { candles, loadingOlder: false, noMoreHistory: older.candles.length < PAGE });
            void cache.write(key, candles);
          } catch {
            // Scrolling back further is optional; leave what is on screen alone.
            patch(key, { loadingOlder: false });
          }
        },

        applyLiveCandle(key, candle) {
          const current = get().series[key];
          if (!current || current.candles.length === 0) return;
          const last = current.candles[current.candles.length - 1];
          if (candle.time < last.time) return;
          const candles =
            candle.time === last.time ? [...current.candles.slice(0, -1), candle] : [...current.candles, candle];
          patch(key, { candles });
        },

        async refreshQuotes() {
          const instruments = get()
            .watchlist.map((w) => findInstrument(w.symbol, w.kind))
            .filter((i): i is Instrument => Boolean(i));
          const quotes = await marketData.fetchQuotes(instruments);
          if (quotes.length === 0) return;
          set((s) => ({ quotes: { ...s.quotes, ...Object.fromEntries(quotes.map((q) => [quoteKey(q), q])) } }));
        },

        setLayout: (mode, changes) =>
          set((s) => ({ layouts: { ...s.layouts, [mode]: { ...s.layouts[mode], ...changes } } })),

        toggleWatch: (item) =>
          set((s) => {
            const key = quoteKey(item);
            const present = s.watchlist.some((w) => quoteKey(w) === key);
            return { watchlist: present ? s.watchlist.filter((w) => quoteKey(w) !== key) : [...s.watchlist, item] };
          }),
      };
    },
    {
      name: 'tradeschool.market',
      version: MARKET_VERSION,
      migrate: createMigrate<MarketData>(MARKET_VERSION, DEFAULTS) as (p: unknown, v: number) => MarketStore,
      partialize: ({ layouts, watchlist }) => ({ layouts, watchlist }),
    },
  ),
);

/**
 * Loads candles for an instrument and keeps the newest one live.
 * Returns the loading state until the first candles arrive.
 */
export function useCandleSeries(instrument: Instrument | undefined, timeframe: Timeframe): SeriesState {
  const key = instrument ? seriesKey(instrument, timeframe) : '';
  const state = useMarket((s) => s.series[key]) ?? EMPTY;
  const load = useMarket((s) => s.load);
  const applyLiveCandle = useMarket((s) => s.applyLiveCandle);

  useEffect(() => {
    if (instrument) void load(instrument, timeframe);
  }, [instrument, timeframe, load]);

  // Start the live stream once the first load has settled on a source.
  const ready = state.status === 'ready';
  const providerId = state.providerId;
  useEffect(() => {
    if (!instrument || !ready || !instrument.live) return;
    return marketData.subscribeCandles(instrument, timeframe, (c) => applyLiveCandle(key, c), providerId);
  }, [instrument, timeframe, ready, providerId, key, applyLiveCandle]);

  return state;
}

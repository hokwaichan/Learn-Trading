import type { Candle, CandleRange, Instrument, MarketDataProvider, Quote, Timeframe } from '@/types';
import { createBinanceProvider } from './binance';
import { isUnreachable } from './errors';
import { INSTRUMENTS, instrumentsOfKind } from './instruments';
import { createStaticProvider } from './static';
import { TIMEFRAME_SECONDS } from './timeframes';

export * from './errors';
export * from './instruments';
export * from './timeframes';
export { createCandleCache, indexedDbStore, memoryStore, mergeCandles } from './cache';
export type { CandleCache, KeyValueStore } from './cache';

/**
 * Data sources.
 *
 * To add one: write a file in this folder that returns a MarketDataProvider
 * (binance.ts and static.ts are the two examples), create it here, and return
 * it from providersFor() for the instruments it serves. Nothing outside
 * lib/data needs to change.
 */
export interface Providers {
  spot: MarketDataProvider;
  futures: MarketDataProvider;
  bundled: MarketDataProvider;
}

export function createProviders(): Providers {
  return {
    spot: createBinanceProvider({
      id: 'binance-spot',
      kind: 'spot',
      // The market-data mirror works in regions where api.binance.com is blocked.
      hosts: ['https://data-api.binance.vision', 'https://api.binance.com'],
      apiPath: '/api/v3',
      wsBase: 'wss://data-stream.binance.vision/ws',
      instruments: INSTRUMENTS.filter((i) => i.source === 'binance-spot'),
    }),
    futures: createBinanceProvider({
      id: 'binance-futures',
      kind: 'perpetual',
      hosts: ['https://fapi.binance.com'],
      apiPath: '/fapi/v1',
      wsBase: 'wss://fstream.binance.com/ws',
      instruments: instrumentsOfKind('perpetual'),
    }),
    // The data files sit under the site's base path, which is not the root on GitHub Pages.
    bundled: createStaticProvider({ instruments: INSTRUMENTS.filter((i) => i.source === 'static'), basePath: `${import.meta.env.BASE_URL ?? '/'}data` }),
  };
}

/**
 * Providers for an instrument, best first. Perpetuals fall back to spot
 * prices where the futures API is unreachable (it is blocked in some regions).
 */
export function providersFor(instrument: Instrument, providers: Providers): MarketDataProvider[] {
  if (instrument.source === 'static') return [providers.bundled];
  if (instrument.kind === 'perpetual') return [providers.futures, providers.spot];
  return [providers.spot];
}

export interface CandleResult {
  candles: Candle[];
  providerId: string;
  /** True when the preferred source was unreachable and a substitute answered. */
  fallback: boolean;
}

/**
 * Remembers, per instrument kind, that the preferred source is unreachable,
 * so later requests go straight to the fallback instead of failing first.
 */
export function createMarketData(providers: Providers = createProviders()) {
  const skip = new Set<string>();

  async function fetchCandles(instrument: Instrument, timeframe: Timeframe, range?: CandleRange): Promise<CandleResult> {
    const chain = providersFor(instrument, providers);
    let lastError: unknown;
    for (let i = 0; i < chain.length; i++) {
      const provider = chain[i];
      const isLast = i === chain.length - 1;
      if (!isLast && skip.has(provider.id)) continue;
      try {
        const candles = await provider.getCandles(instrument.symbol, timeframe, range);
        return { candles, providerId: provider.id, fallback: i > 0 };
      } catch (error) {
        lastError = error;
        if (isLast || !isUnreachable(error)) throw error;
        skip.add(provider.id);
      }
    }
    throw lastError;
  }

  /**
   * Live updates to the newest candle. Uses the source's stream when it has
   * one; otherwise (or if `providerId` has no stream) polls every 15 seconds.
   */
  function subscribeCandles(
    instrument: Instrument,
    timeframe: Timeframe,
    onCandle: (candle: Candle) => void,
    providerId?: string,
  ): () => void {
    if (!instrument.live) return () => {};
    const chain = providersFor(instrument, providers);
    const provider = chain.find((p) => p.id === providerId) ?? chain.find((p) => !skip.has(p.id)) ?? chain[chain.length - 1];
    if (provider.subscribeCandles) return provider.subscribeCandles(instrument.symbol, timeframe, onCandle);
    const poll = setInterval(async () => {
      try {
        const latest = await provider.getCandles(instrument.symbol, timeframe, { limit: 2 });
        latest.forEach(onCandle);
      } catch {
        // Keep the last known candle; the next poll may succeed.
      }
    }, 15_000);
    return () => clearInterval(poll);
  }

  /** Latest price and daily change for a set of instruments. Failures yield no quote. */
  async function fetchQuotes(instruments: Instrument[]): Promise<Quote[]> {
    const groups = new Map<MarketDataProvider, Instrument[]>();
    for (const instrument of instruments) {
      const chain = providersFor(instrument, providers);
      const provider = chain.find((p) => !skip.has(p.id)) ?? chain[chain.length - 1];
      groups.set(provider, [...(groups.get(provider) ?? []), instrument]);
    }
    const results = await Promise.all(
      [...groups].map(async ([provider, group]) => {
        try {
          const quotes = (await provider.getQuotes?.(group.map((i) => i.symbol))) ?? [];
          // A fallback source reports its own kind; relabel to what was asked for.
          return quotes.flatMap((q) => {
            const instrument = group.find((i) => i.symbol === q.symbol);
            return instrument ? [{ ...q, kind: instrument.kind }] : [];
          });
        } catch {
          return [];
        }
      }),
    );
    return results.flat();
  }

  return { fetchCandles, subscribeCandles, fetchQuotes };
}

export type MarketData = ReturnType<typeof createMarketData>;

/** Start time (Unix seconds) of the candle that contains `timeMs`. */
export function candleOpenTime(timeMs: number, timeframe: Timeframe): number {
  const step = TIMEFRAME_SECONDS[timeframe];
  return Math.floor(timeMs / 1000 / step) * step;
}

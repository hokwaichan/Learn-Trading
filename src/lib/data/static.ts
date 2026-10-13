import type { Candle, Instrument, MarketDataProvider, Quote } from '@/types';
import { DataError } from './errors';

type FetchLike = (url: string) => Promise<Response>;

export interface StaticProviderOptions {
  /** Folder the JSON files are served from. */
  basePath?: string;
  instruments: Instrument[];
  fetch?: FetchLike;
}

/** Shape of public/data/<SYMBOL>.json (written by scripts/fetch-static-data.mjs). */
export interface StaticDataFile {
  symbol: string;
  timeframe: '1d';
  source: string;
  fetchedAt: string;
  /** Rows of [time, open, high, low, close, volume]; time is Unix seconds. */
  candles: number[][];
}

export function parseStaticFile(body: unknown): Candle[] {
  const rows = (body as StaticDataFile | null)?.candles;
  if (!Array.isArray(rows)) throw new DataError('bad-data', 'Data file has no candles');
  return rows.map((r) => {
    if (!Array.isArray(r) || r.length < 6 || r.some((v) => typeof v !== 'number' || !Number.isFinite(v))) {
      throw new DataError('bad-data', 'Malformed row in data file');
    }
    return { time: r[0], open: r[1], high: r[2], low: r[3], close: r[4], volume: r[5] };
  });
}

/**
 * Daily history bundled with the app, so stocks and forex work offline.
 * To add a symbol: add it to scripts/fetch-static-data.mjs, run
 * `npm run fetch-data`, and list it in lib/data/instruments.ts.
 */
export function createStaticProvider(options: StaticProviderOptions): MarketDataProvider {
  const doFetch: FetchLike = options.fetch ?? ((url) => fetch(url));
  const basePath = options.basePath ?? '/data';
  const files = new Map<string, Promise<Candle[]>>();

  function load(symbol: string): Promise<Candle[]> {
    let pending = files.get(symbol);
    if (!pending) {
      pending = (async () => {
        let res: Response;
        try {
          res = await doFetch(`${basePath}/${symbol}.json`);
        } catch {
          throw new DataError('network', `Could not load ${symbol}.json`);
        }
        if (!res.ok) throw new DataError(res.status === 404 ? 'not-found' : 'network', `HTTP ${res.status}`);
        let body: unknown;
        try {
          body = await res.json();
        } catch {
          throw new DataError('bad-data', `${symbol}.json is not valid JSON`);
        }
        return parseStaticFile(body);
      })();
      files.set(symbol, pending);
      // Do not remember a failure: the next call should try again.
      pending.catch(() => files.delete(symbol));
    }
    return pending;
  }

  return {
    id: 'static',

    async listInstruments() {
      return options.instruments;
    },

    async getCandles(symbol, timeframe, range = {}) {
      if (timeframe !== '1d') throw new DataError('not-found', 'Bundled data is daily only');
      let candles = await load(symbol);
      if (range.from != null) candles = candles.filter((c) => c.time * 1000 >= range.from!);
      if (range.to != null) candles = candles.filter((c) => c.time * 1000 <= range.to!);
      return range.limit != null ? candles.slice(-range.limit) : candles;
    },

    async getLastPrice(symbol) {
      const candles = await load(symbol);
      return candles[candles.length - 1].close;
    },

    async getQuotes(symbols) {
      return Promise.all(
        symbols.map(async (symbol): Promise<Quote> => {
          const candles = await load(symbol);
          const last = candles[candles.length - 1].close;
          const prev = candles[candles.length - 2]?.close ?? last;
          return { symbol, kind: 'spot', last, changePct: prev ? last / prev - 1 : 0 };
        }),
      );
    },
  };
}

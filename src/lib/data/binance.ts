import type { Candle, CandleRange, Instrument, InstrumentKind, MarketDataProvider, Quote, Timeframe } from '@/types';
import { DataError, isUnreachable } from './errors';

type FetchLike = (url: string) => Promise<Response>;

export interface BinanceProviderOptions {
  id: string;
  kind: InstrumentKind;
  /** REST hosts, tried in order. The first one that answers is remembered. */
  hosts: string[];
  /** '/api/v3' for spot, '/fapi/v1' for USDT-M futures. */
  apiPath: string;
  /** WebSocket base, e.g. 'wss://data-stream.binance.vision/ws'. */
  wsBase: string;
  instruments: Instrument[];
  fetch?: FetchLike;
  /** Injected in tests; defaults to the browser's WebSocket. */
  WebSocketImpl?: typeof WebSocket;
}

export const MAX_KLINES = 1000;

/** One row of Binance's klines response -> Candle. */
export function parseKline(row: unknown): Candle {
  if (!Array.isArray(row) || row.length < 6) throw new DataError('bad-data', 'Malformed kline row');
  const candle: Candle = {
    time: Math.floor(Number(row[0]) / 1000),
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  };
  if (Object.values(candle).some((v) => !Number.isFinite(v))) throw new DataError('bad-data', 'Non-numeric kline value');
  return candle;
}

/** A kline WebSocket message -> Candle, or null if it is some other message. */
export function parseKlineEvent(message: unknown): Candle | null {
  const k = (message as { k?: Record<string, unknown> } | null)?.k;
  if (!k) return null;
  return parseKline([k.t, k.o, k.h, k.l, k.c, k.v]);
}

export function klinesQuery(symbol: string, timeframe: Timeframe, range: CandleRange = {}): string {
  const params = new URLSearchParams({
    symbol,
    interval: timeframe,
    limit: String(Math.max(1, Math.min(range.limit ?? 500, MAX_KLINES))),
  });
  if (range.from != null) params.set('startTime', String(Math.floor(range.from)));
  if (range.to != null) params.set('endTime', String(Math.floor(range.to)));
  return `klines?${params}`;
}

async function toError(res: Response): Promise<DataError> {
  if (res.status === 429 || res.status === 418) {
    const retryAfter = Number(res.headers.get('Retry-After'));
    return new DataError('rate-limit', 'Rate limited', Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 60_000);
  }
  if (res.status === 451 || res.status === 403) return new DataError('blocked', `Blocked (HTTP ${res.status})`);
  if (res.status === 400 || res.status === 404) return new DataError('not-found', `Not found (HTTP ${res.status})`);
  return new DataError('network', `HTTP ${res.status}`);
}

/**
 * Binance public market data (no API key). Used for both spot and USDT-M
 * futures, which share the klines format.
 */
export function createBinanceProvider(options: BinanceProviderOptions): MarketDataProvider {
  const doFetch: FetchLike = options.fetch ?? ((url) => fetch(url));
  let hosts = [...options.hosts];

  /** GET a path, moving on to the next host when one is unreachable or blocked. */
  async function get(path: string): Promise<unknown> {
    let lastError: unknown = new DataError('network', 'No hosts configured');
    for (const host of [...hosts]) {
      try {
        let res: Response;
        try {
          res = await doFetch(`${host}${options.apiPath}/${path}`);
        } catch {
          throw new DataError('network', `Could not reach ${host}`);
        }
        if (!res.ok) throw await toError(res);
        // Prefer this host from now on.
        hosts = [host, ...hosts.filter((h) => h !== host)];
        try {
          return await res.json();
        } catch {
          throw new DataError('bad-data', 'Response was not JSON');
        }
      } catch (error) {
        lastError = error;
        if (!isUnreachable(error)) throw error;
      }
    }
    throw lastError;
  }

  return {
    id: options.id,

    async listInstruments() {
      return options.instruments;
    },

    async getCandles(symbol, timeframe, range) {
      const rows = await get(klinesQuery(symbol, timeframe, range));
      if (!Array.isArray(rows)) throw new DataError('bad-data', 'Klines response was not a list');
      return rows.map(parseKline);
    },

    async getLastPrice(symbol) {
      const body = (await get(`ticker/price?symbol=${symbol}`)) as { price?: string };
      const price = Number(body.price);
      if (!Number.isFinite(price)) throw new DataError('bad-data', 'Missing price');
      return price;
    },

    async getQuotes(symbols) {
      if (symbols.length === 0) return [];
      // Spot accepts a list; futures takes one symbol per request.
      const rows =
        options.kind === 'spot'
          ? ((await get(`ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`)) as unknown[])
          : await Promise.all(symbols.map((s) => get(`ticker/24hr?symbol=${s}`)));
      return (rows as Record<string, string>[]).map(
        (r): Quote => ({
          symbol: r.symbol,
          kind: options.kind,
          last: Number(r.lastPrice),
          changePct: Number(r.priceChangePercent) / 100,
        }),
      );
    },

    subscribeCandles(symbol, timeframe, onCandle) {
      const Socket = options.WebSocketImpl ?? globalThis.WebSocket;
      if (!Socket) return () => {};
      const url = `${options.wsBase}/${symbol.toLowerCase()}@kline_${timeframe}`;
      let socket: WebSocket | null = null;
      let closed = false;
      let attempt = 0;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const connect = () => {
        if (closed) return;
        socket = new Socket(url);
        socket.onmessage = (event) => {
          attempt = 0;
          try {
            const candle = parseKlineEvent(JSON.parse(String(event.data)));
            if (candle) onCandle(candle);
          } catch {
            // Ignore a message we cannot read; the next one replaces it.
          }
        };
        socket.onclose = () => {
          if (closed) return;
          // Reconnect with a growing delay, capped at 30 seconds.
          timer = setTimeout(connect, Math.min(30_000, 1000 * 2 ** attempt++));
        };
        socket.onerror = () => socket?.close();
      };
      connect();

      return () => {
        closed = true;
        clearTimeout(timer);
        socket?.close();
      };
    },
  };
}

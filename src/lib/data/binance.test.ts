import { describe, expect, it, vi } from 'vitest';
import { createBinanceProvider, klinesQuery, parseKline, parseKlineEvent } from './binance';
import { DataError } from './errors';

// A real row from GET /api/v3/klines?symbol=BTCUSDT&interval=1d
const ROW = [
  1791763200000, '83773.12000000', '84352.00000000', '81750.09000000', '81850.00000000', '13529.90112000',
  1791849599999, '1125794983.91458320', 2484237, '6801.17717000', '565895951.92918480', '0',
];

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers });
}

function provider(fetchImpl: (url: string) => Promise<Response>, hosts = ['https://a.test', 'https://b.test']) {
  return createBinanceProvider({
    id: 'test',
    kind: 'spot',
    hosts,
    apiPath: '/api/v3',
    wsBase: 'wss://ws.test/ws',
    instruments: [],
    fetch: fetchImpl,
  });
}

describe('parseKline', () => {
  it('converts a Binance row to a candle with time in seconds', () => {
    expect(parseKline(ROW)).toEqual({
      time: 1791763200,
      open: 83773.12,
      high: 84352,
      low: 81750.09,
      close: 81850,
      volume: 13529.90112,
    });
  });

  it('rejects malformed rows', () => {
    expect(() => parseKline([1, 2])).toThrow(DataError);
    expect(() => parseKline([1791763200000, 'x', '1', '1', '1', '1'])).toThrow(DataError);
    expect(() => parseKline(null)).toThrow(DataError);
  });
});

describe('parseKlineEvent', () => {
  it('reads a kline stream message', () => {
    const event = { e: 'kline', k: { t: 1791763200000, o: '1.0', h: '2.0', l: '0.5', c: '1.5', v: '100' } };
    expect(parseKlineEvent(event)).toEqual({ time: 1791763200, open: 1, high: 2, low: 0.5, close: 1.5, volume: 100 });
  });

  it('ignores other messages', () => {
    expect(parseKlineEvent({ result: null, id: 1 })).toBeNull();
  });
});

describe('klinesQuery', () => {
  it('builds the query and clamps the limit to 1000', () => {
    expect(klinesQuery('BTCUSDT', '1h')).toBe('klines?symbol=BTCUSDT&interval=1h&limit=500');
    expect(klinesQuery('BTCUSDT', '1d', { limit: 5000, to: 1700000000000 })).toBe(
      'klines?symbol=BTCUSDT&interval=1d&limit=1000&endTime=1700000000000',
    );
    expect(klinesQuery('ETHUSDT', '5m', { from: 1, limit: 10 })).toBe('klines?symbol=ETHUSDT&interval=5m&limit=10&startTime=1');
  });
});

describe('createBinanceProvider', () => {
  it('fetches and parses candles', async () => {
    const fetchImpl = vi.fn(async () => json([ROW]));
    const candles = await provider(fetchImpl).getCandles('BTCUSDT', '1d', { limit: 1 });
    expect(candles).toHaveLength(1);
    expect(candles[0].close).toBe(81850);
    expect(fetchImpl).toHaveBeenCalledWith('https://a.test/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1');
  });

  it('falls back to the next host when one is blocked, and then prefers it', async () => {
    const fetchImpl = vi.fn(async (url: string) => (url.startsWith('https://a.test') ? json({}, 451) : json([ROW])));
    const p = provider(fetchImpl);
    await p.getCandles('BTCUSDT', '1d');
    await p.getCandles('BTCUSDT', '1d');
    const urls = fetchImpl.mock.calls.map((c) => new URL(c[0]).host);
    expect(urls).toEqual(['a.test', 'b.test', 'b.test']);
  });

  it('falls back when a host cannot be reached at all', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.startsWith('https://a.test')) throw new TypeError('Failed to fetch');
      return json([ROW]);
    });
    await expect(provider(fetchImpl).getCandles('BTCUSDT', '1d')).resolves.toHaveLength(1);
  });

  it('reports "blocked" when every host refuses', async () => {
    const p = provider(async () => json({}, 451));
    await expect(p.getCandles('BTCUSDT', '1d')).rejects.toMatchObject({ kind: 'blocked' });
  });

  it('reports a rate limit with the wait the server asked for, without trying other hosts', async () => {
    const fetchImpl = vi.fn(async () => json({}, 429, { 'Retry-After': '12' }));
    await expect(provider(fetchImpl).getCandles('BTCUSDT', '1d')).rejects.toMatchObject({
      kind: 'rate-limit',
      retryAfterMs: 12_000,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('reports an unknown symbol as not found', async () => {
    const p = provider(async () => json({ code: -1121, msg: 'Invalid symbol.' }, 400));
    await expect(p.getCandles('NOPE', '1d')).rejects.toMatchObject({ kind: 'not-found' });
  });

  it('reports unreadable responses as bad data', async () => {
    await expect(provider(async () => json({ oops: true })).getCandles('BTCUSDT', '1d')).rejects.toMatchObject({ kind: 'bad-data' });
    await expect(provider(async () => new Response('<html>')).getCandles('BTCUSDT', '1d')).rejects.toMatchObject({ kind: 'bad-data' });
  });

  it('turns 24h tickers into quotes with the change as a fraction', async () => {
    const p = provider(async () => json([{ symbol: 'BTCUSDT', lastPrice: '83628.41', priceChangePercent: '2.173' }]));
    expect(await p.getQuotes!(['BTCUSDT'])).toEqual([{ symbol: 'BTCUSDT', kind: 'spot', last: 83628.41, changePct: 0.02173 }]);
  });
});

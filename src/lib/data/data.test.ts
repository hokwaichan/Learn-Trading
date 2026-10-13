import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import type { Candle, MarketDataProvider } from '@/types';
import { createCandleCache, memoryStore, mergeCandles } from './cache';
import { DataError, describeDataError } from './errors';
import { candleOpenTime, createMarketData, findInstrument, type Providers } from './index';
import { INSTRUMENTS, searchInstruments } from './instruments';
import { createStaticProvider, parseStaticFile } from './static';

const c = (time: number, close = time): Candle => ({ time, open: close, high: close, low: close, close, volume: 1 });

describe('mergeCandles', () => {
  it('appends newer candles', () => {
    expect(mergeCandles([c(1), c(2)], [c(3)]).map((x) => x.time)).toEqual([1, 2, 3]);
  });

  it('prepends older candles', () => {
    expect(mergeCandles([c(3), c(4)], [c(1), c(2)]).map((x) => x.time)).toEqual([1, 2, 3, 4]);
  });

  it('replaces overlapping candles with the incoming ones and stays sorted', () => {
    const merged = mergeCandles([c(1), c(2, 20), c(3, 30)], [c(3, 31), c(2, 21), c(4)]);
    expect(merged.map((x) => x.time)).toEqual([1, 2, 3, 4]);
    expect(merged[1].close).toBe(21);
    expect(merged[2].close).toBe(31);
  });

  it('handles empty lists', () => {
    expect(mergeCandles([], [c(1)])).toEqual([c(1)]);
    expect(mergeCandles([c(1)], [])).toEqual([c(1)]);
  });
});

describe('candle cache', () => {
  it('round-trips candles with the time they were saved', async () => {
    const cache = createCandleCache(memoryStore(), () => 1234);
    await cache.write('spot:BTCUSDT:1d', [c(1), c(2)]);
    expect(await cache.read('spot:BTCUSDT:1d')).toEqual({ candles: [c(1), c(2)], savedAt: 1234 });
  });

  it('returns null for a miss, an empty entry, or after clear', async () => {
    const cache = createCandleCache(memoryStore());
    expect(await cache.read('nope')).toBeNull();
    await cache.write('k', []);
    expect(await cache.read('k')).toBeNull();
    await cache.write('k', [c(1)]);
    await cache.clear('k');
    expect(await cache.read('k')).toBeNull();
  });
});

describe('static provider', () => {
  const file = { symbol: 'AAPL', candles: [[100, 1, 2, 0.5, 1.5, 10], [200, 1.5, 3, 1, 2, 20], [300, 2, 4, 2, 3, 30]] };
  const make = (fetchImpl = vi.fn(async () => new Response(JSON.stringify(file)))) => ({
    fetchImpl,
    provider: createStaticProvider({ instruments: [], fetch: fetchImpl }),
  });

  it('parses rows into candles', () => {
    expect(parseStaticFile(file)[0]).toEqual({ time: 100, open: 1, high: 2, low: 0.5, close: 1.5, volume: 10 });
    expect(() => parseStaticFile({ candles: [[1, 2]] })).toThrow(DataError);
    expect(() => parseStaticFile({})).toThrow(DataError);
  });

  it('loads a file once and serves ranges from memory', async () => {
    const { provider, fetchImpl } = make();
    expect(await provider.getCandles('AAPL', '1d')).toHaveLength(3);
    expect((await provider.getCandles('AAPL', '1d', { limit: 2 })).map((x) => x.time)).toEqual([200, 300]);
    expect((await provider.getCandles('AAPL', '1d', { to: 200_000 })).map((x) => x.time)).toEqual([100, 200]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledWith('/data/AAPL.json');
  });

  it('only has daily data', async () => {
    await expect(make().provider.getCandles('AAPL', '1h')).rejects.toMatchObject({ kind: 'not-found' });
  });

  it('quotes the last close against the one before', async () => {
    expect(await make().provider.getQuotes!(['AAPL'])).toEqual([{ symbol: 'AAPL', kind: 'spot', last: 3, changePct: 0.5 }]);
  });

  it('retries after a failed load', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(file)));
    fetchImpl.mockImplementationOnce(async () => new Response('', { status: 404 }));
    const provider = createStaticProvider({ instruments: [], fetch: fetchImpl });
    await expect(provider.getCandles('AAPL', '1d')).rejects.toMatchObject({ kind: 'not-found' });
    await expect(provider.getCandles('AAPL', '1d')).resolves.toHaveLength(3);
  });
});

describe('bundled data files', () => {
  it.each(INSTRUMENTS.filter((i) => i.source === 'static').map((i) => i.symbol))(
    '%s.json is valid, sorted, and has sane candles',
    (symbol) => {
      const candles = parseStaticFile(JSON.parse(readFileSync(`public/data/${symbol}.json`, 'utf8')));
      expect(candles.length).toBeGreaterThan(1000);
      for (let i = 0; i < candles.length; i++) {
        const k = candles[i];
        expect(k.high).toBeGreaterThanOrEqual(Math.max(k.open, k.close));
        expect(k.low).toBeLessThanOrEqual(Math.min(k.open, k.close));
        expect(k.low).toBeGreaterThan(0);
        if (i > 0) expect(k.time).toBeGreaterThan(candles[i - 1].time);
      }
    },
  );
});

describe('createMarketData', () => {
  const stub = (id: string, getCandles: MarketDataProvider['getCandles']): MarketDataProvider => ({
    id,
    listInstruments: async () => [],
    getCandles,
  });
  const btcPerp = findInstrument('BTCUSDT', 'perpetual')!;
  const btcSpot = findInstrument('BTCUSDT', 'spot')!;
  const aapl = findInstrument('AAPL')!;

  function setup(futuresFails: DataError | null) {
    const futures = vi.fn(async () => {
      if (futuresFails) throw futuresFails;
      return [c(1)];
    });
    const spot = vi.fn(async () => [c(2)]);
    const bundled = vi.fn(async () => [c(3)]);
    const providers: Providers = { futures: stub('fut', futures), spot: stub('spot', spot), bundled: stub('static', bundled) };
    return { data: createMarketData(providers), futures, spot, bundled };
  }

  it('routes each instrument to its own source', async () => {
    const { data } = setup(null);
    expect(await data.fetchCandles(btcPerp, '1h')).toEqual({ candles: [c(1)], providerId: 'fut', fallback: false });
    expect(await data.fetchCandles(btcSpot, '1h')).toMatchObject({ providerId: 'spot', fallback: false });
    expect(await data.fetchCandles(aapl, '1d')).toMatchObject({ providerId: 'static', fallback: false });
  });

  it('falls back to spot prices when futures is blocked, and stops retrying futures', async () => {
    const { data, futures, spot } = setup(new DataError('blocked', 'HTTP 451'));
    expect(await data.fetchCandles(btcPerp, '1h')).toEqual({ candles: [c(2)], providerId: 'spot', fallback: true });
    await data.fetchCandles(btcPerp, '1h');
    expect(futures).toHaveBeenCalledTimes(1);
    expect(spot).toHaveBeenCalledTimes(2);
  });

  it('does not fall back on a rate limit', async () => {
    const { data, spot } = setup(new DataError('rate-limit', 'slow down', 5000));
    await expect(data.fetchCandles(btcPerp, '1h')).rejects.toMatchObject({ kind: 'rate-limit' });
    expect(spot).not.toHaveBeenCalled();
  });
});

describe('helpers', () => {
  it('finds the candle that contains a moment', () => {
    expect(candleOpenTime(Date.UTC(2026, 0, 1, 13, 47, 12), '1h')).toBe(Date.UTC(2026, 0, 1, 13) / 1000);
    expect(candleOpenTime(Date.UTC(2026, 0, 1, 13, 47, 12), '1d')).toBe(Date.UTC(2026, 0, 1) / 1000);
  });

  it('searches instruments by ticker, base and name', () => {
    expect(searchInstruments('btc')[0].symbol).toBe('BTCUSDT');
    expect(searchInstruments('eth/usdt')[0].symbol).toBe('ETHUSDT');
    expect(searchInstruments('apple')[0].symbol).toBe('AAPL');
    expect(searchInstruments('zzz')).toEqual([]);
  });

  it('distinguishes spot from perpetual with the same ticker', () => {
    expect(findInstrument('btcusdt')?.kind).toBe('spot');
    expect(findInstrument('BTCUSDT', 'perpetual')?.kind).toBe('perpetual');
    expect(findInstrument('AAPL', 'perpetual')).toBeUndefined();
  });

  it('describes errors in plain language', () => {
    expect(describeDataError(new DataError('rate-limit', '', 12_000))).toContain('12 seconds');
    expect(describeDataError(new DataError('blocked', ''))).toContain('region');
    expect(describeDataError(new Error('x'))).toContain('unexpected');
  });
});

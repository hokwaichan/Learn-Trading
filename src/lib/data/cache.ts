import { del, get, set } from 'idb-keyval';
import type { Candle } from '@/types';

/** Minimal async key-value store, so the cache can be tested without IndexedDB. */
export interface KeyValueStore {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
}

/** IndexedDB, failing soft: private browsing or a full disk must not break the app. */
export const indexedDbStore: KeyValueStore = {
  async get(key) {
    try {
      return await get(key);
    } catch {
      return undefined;
    }
  },
  async set(key, value) {
    try {
      await set(key, value);
    } catch {
      // Not cached; the data is simply fetched again next time.
    }
  },
  async del(key) {
    try {
      await del(key);
    } catch {
      // Nothing to do.
    }
  },
};

export function memoryStore(): KeyValueStore {
  const map = new Map<string, unknown>();
  return {
    get: async (key) => map.get(key),
    set: async (key, value) => void map.set(key, value),
    del: async (key) => void map.delete(key),
  };
}

export interface CachedCandles {
  candles: Candle[];
  savedAt: number;
}

/** Most candles kept per series. Older ones are fetched again if scrolled to. */
export const MAX_CACHED_CANDLES = 6000;

/**
 * Joins two candle lists into one sorted by time with no duplicates.
 * Where both have a candle for the same time, `incoming` wins (it is newer).
 */
export function mergeCandles(existing: Candle[], incoming: Candle[]): Candle[] {
  if (existing.length === 0) return incoming;
  if (incoming.length === 0) return existing;
  // Fast paths for the two common cases: appending newer or prepending older.
  if (incoming[0].time > existing[existing.length - 1].time) return [...existing, ...incoming];
  if (incoming[incoming.length - 1].time < existing[0].time) return [...incoming, ...existing];
  const byTime = new Map<number, Candle>();
  for (const c of existing) byTime.set(c.time, c);
  for (const c of incoming) byTime.set(c.time, c);
  return [...byTime.values()].sort((a, b) => a.time - b.time);
}

export function createCandleCache(store: KeyValueStore, now: () => number = Date.now) {
  const prefix = 'candles:';
  return {
    async read(key: string): Promise<CachedCandles | null> {
      const value = (await store.get(prefix + key)) as CachedCandles | undefined;
      if (!value || !Array.isArray(value.candles) || value.candles.length === 0) return null;
      return value;
    },
    async write(key: string, candles: Candle[]): Promise<void> {
      if (candles.length === 0) return;
      await store.set(prefix + key, { candles: candles.slice(-MAX_CACHED_CANDLES), savedAt: now() } satisfies CachedCandles);
    },
    async clear(key: string): Promise<void> {
      await store.del(prefix + key);
    },
  };
}

export type CandleCache = ReturnType<typeof createCandleCache>;

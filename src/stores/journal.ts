import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { findInstrument } from '@/lib/data';
import { indexedDbStore } from '@/lib/data/cache';
import { snapshotPlan, type JournalRow } from '@/lib/journal/journal';
import { createMigrate } from '@/lib/migrate';
import type { ChartSnapshot, JournalNote } from '@/types';
import { useAccount } from './account';
import { fetchCandleRange } from './market';

export const JOURNAL_VERSION = 1;

interface JournalData {
  /** Notes by position id. */
  notes: Record<string, JournalNote>;
}

interface JournalStore extends JournalData {
  /** Changes some fields of a trade's notes, creating them if needed. */
  annotate: (positionId: string, patch: Partial<Omit<JournalNote, 'updatedAt'>>) => void;
}

const DEFAULTS: JournalData = { notes: {} };
const BLANK: Omit<JournalNote, 'updatedAt'> = { reasoning: '', review: '' };

export const useJournal = create<JournalStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      annotate: (positionId, patch) => set((s) => ({ notes: { ...s.notes, [positionId]: { ...BLANK, ...s.notes[positionId], ...patch, updatedAt: Date.now() } } })),
    }),
    {
      name: 'tradeschool.journal',
      version: JOURNAL_VERSION,
      migrate: createMigrate<JournalData>(JOURNAL_VERSION, DEFAULTS) as (p: unknown, v: number) => JournalStore,
      partialize: ({ notes }) => ({ notes }),
    },
  ),
);

// ── Chart snapshots ────────────────────────────────────────────────────
// The candles around each trade are kept in IndexedDB: they are too large
// for localStorage, and losing them only means fetching them again.

const snapshotKey = (positionId: string) => `tradeschool.snapshot:${positionId}`;
const pending = new Map<string, Promise<ChartSnapshot | null>>();

type SnapshotSource = Pick<JournalRow, 'id' | 'symbol' | 'kind' | 'entryPrice' | 'exitPrice' | 'openedAt' | 'closedAt' | 'trade' | 'position'>;

async function buildSnapshot(row: SnapshotSource): Promise<ChartSnapshot | null> {
  // An option strategy is charted on its underlying.
  const instrument = findInstrument(row.symbol, row.kind === 'perpetual' ? 'perpetual' : 'spot') ?? findInstrument(row.symbol, 'spot');
  if (!instrument) return null;
  const closedAt = row.closedAt ?? Date.now();
  const plan = snapshotPlan(row.openedAt, closedAt, instrument.timeframes);
  const candles = await fetchCandleRange(instrument, plan.timeframe, { from: plan.from, to: Math.min(plan.to, Date.now()), limit: 500 });
  if (candles.length === 0) return null;

  const markers: ChartSnapshot['markers'] = [];
  // An option position's entry "price" is the cost of the strategy, not a price on this chart.
  const onChart = row.kind !== 'option';
  const priceAt = (time: number) => {
    let found = candles[0];
    for (const c of candles) if (c.time * 1000 <= time) found = c;
    return found.close;
  };
  markers.push({ time: row.openedAt, price: onChart ? row.entryPrice : priceAt(row.openedAt), kind: 'entry' });
  if (row.closedAt != null) {
    markers.push({ time: row.closedAt, price: onChart && row.exitPrice != null ? row.exitPrice : priceAt(row.closedAt), kind: row.trade?.exitReason === 'liquidation' ? 'liquidation' : 'exit' });
  }
  const stop = row.trade?.stopLoss ?? row.position?.stopLoss;
  const target = row.trade?.takeProfit ?? row.position?.takeProfit;
  if (stop != null) markers.push({ time: row.openedAt, price: stop, kind: 'stop' });
  if (target != null) markers.push({ time: row.openedAt, price: target, kind: 'target' });
  return { symbol: instrument.symbol, timeframe: plan.timeframe, candles, markers };
}

/**
 * The chart around a trade. A closed trade's chart is saved the first time
 * it is built and read back afterwards; an open position's is built fresh.
 * Null when the history cannot be loaded.
 */
export function loadSnapshot(row: SnapshotSource): Promise<ChartSnapshot | null> {
  const key = snapshotKey(row.id);
  const closed = row.closedAt != null;
  const running = pending.get(key);
  if (running && closed) return running;
  const task = (async () => {
    if (closed) {
      const saved = (await indexedDbStore.get(key)) as ChartSnapshot | undefined;
      if (saved?.candles?.length) return saved;
    }
    try {
      const snapshot = await buildSnapshot(row);
      if (snapshot && closed) await indexedDbStore.set(key, snapshot);
      return snapshot;
    } catch {
      return null;
    }
  })();
  if (closed) {
    pending.set(key, task);
    void task.finally(() => pending.delete(key));
  }
  return task;
}

/**
 * Saves a chart for each trade as it closes, so the journal shows the market
 * as it was. Call once; returns a function that stops it.
 */
export function captureSnapshotsOnClose(): () => void {
  const seen = new Set<string>();
  for (const account of Object.values(useAccount.getState().accounts)) for (const trade of account.trades) seen.add(trade.id);
  return useAccount.subscribe((state) => {
    for (const account of Object.values(state.accounts)) {
      for (const trade of account.trades) {
        if (seen.has(trade.id)) continue;
        seen.add(trade.id);
        void loadSnapshot({ id: trade.positionId, symbol: trade.symbol, kind: trade.kind, entryPrice: trade.entryPrice, exitPrice: trade.exitPrice, openedAt: trade.openedAt, closedAt: trade.closedAt, trade });
      }
    }
  });
}

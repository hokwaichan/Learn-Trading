import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMigrate } from '@/lib/migrate';
import type { Drawing } from '@/types';

export const DRAWINGS_VERSION = 1;

interface DrawingsData {
  /** Drawings are saved per symbol and shown on every timeframe. */
  bySymbol: Record<string, Drawing[]>;
}

interface DrawingsStore extends DrawingsData {
  add: (drawing: Omit<Drawing, 'id' | 'createdAt'>) => Drawing;
  remove: (symbol: string, id: string) => void;
  clear: (symbol: string) => void;
}

const DEFAULTS: DrawingsData = { bySymbol: {} };
const NONE: Drawing[] = [];

export const useDrawings = create<DrawingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      add: (input) => {
        const drawing: Drawing = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
        set((s) => ({
          bySymbol: { ...s.bySymbol, [drawing.symbol]: [...(s.bySymbol[drawing.symbol] ?? []), drawing] },
        }));
        return drawing;
      },
      remove: (symbol, id) =>
        set((s) => ({
          bySymbol: { ...s.bySymbol, [symbol]: (s.bySymbol[symbol] ?? []).filter((d) => d.id !== id) },
        })),
      clear: (symbol) => set((s) => ({ bySymbol: { ...s.bySymbol, [symbol]: [] } })),
    }),
    {
      name: 'tradeschool.drawings',
      version: DRAWINGS_VERSION,
      migrate: createMigrate<DrawingsData>(DRAWINGS_VERSION, DEFAULTS) as (p: unknown, v: number) => DrawingsStore,
      partialize: ({ bySymbol }) => ({ bySymbol }),
    },
  ),
);

export function useSymbolDrawings(symbol: string): Drawing[] {
  return useDrawings((s) => s.bySymbol[symbol]) ?? NONE;
}

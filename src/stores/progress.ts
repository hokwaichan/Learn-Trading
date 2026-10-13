import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentStreak, dayKey } from '@/lib/dates';
import { createMigrate } from '@/lib/migrate';
import type { ProgressState } from '@/types';

export const PROGRESS_VERSION = 1;

const DEFAULT_PROGRESS: ProgressState = {
  lessons: {},
  lastLesson: undefined,
  activeDays: [],
  challengeDays: [],
};

interface ProgressStore extends ProgressState {
  /** Records that something was studied today (keeps the streak alive). */
  markActiveToday: () => void;
  reset: () => void;
}

export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...DEFAULT_PROGRESS,
      markActiveToday: () =>
        set((s) => {
          const today = dayKey();
          return s.activeDays.includes(today) ? s : { activeDays: [...s.activeDays, today] };
        }),
      reset: () => set(DEFAULT_PROGRESS),
    }),
    {
      name: 'tradeschool.progress',
      version: PROGRESS_VERSION,
      migrate: createMigrate<ProgressState>(PROGRESS_VERSION, DEFAULT_PROGRESS) as (p: unknown, v: number) => ProgressStore,
      partialize: ({ markActiveToday: _m, reset: _r, ...data }) => data,
    },
  ),
);

export function useStreak(): number {
  return useProgress((s) => currentStreak(s.activeDays));
}

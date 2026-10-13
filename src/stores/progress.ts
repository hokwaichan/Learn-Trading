import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentStreak, dayKey } from '@/lib/dates';
import { createMigrate } from '@/lib/migrate';
import { newCard, reviewCard } from '@/lib/srs/sm2';
import type { ProgressState, ReviewCard } from '@/types';

export const PROGRESS_VERSION = 2;

const DEFAULT_PROGRESS: ProgressState = {
  lessons: {},
  lastLesson: undefined,
  activeDays: [],
  challengeDays: [],
  cards: {},
};

interface ProgressStore extends ProgressState {
  /** Records that something was studied today (keeps the streak alive). */
  markActiveToday: () => void;
  /** Remembers the lesson being read, for "continue learning". */
  visitLesson: (moduleId: string, lessonId: string) => void;
  /** Records a finished quiz. `score` is the fraction answered correctly. */
  completeLesson: (key: string, score: number) => void;
  /** Records one trainer answer and reschedules that item. */
  recordReview: (kind: ReviewCard['kind'], refId: string, wasCorrect: boolean) => void;
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
      visitLesson: (moduleId, lessonId) =>
        set((s) =>
          s.lastLesson?.moduleId === moduleId && s.lastLesson.lessonId === lessonId ? s : { lastLesson: { moduleId, lessonId } },
        ),
      completeLesson: (key, score) =>
        set((s) => {
          const previous = s.lessons[key];
          const today = dayKey();
          return {
            lessons: {
              ...s.lessons,
              [key]: {
                completedAt: previous?.completedAt ?? Date.now(),
                bestScore: Math.max(previous?.bestScore ?? 0, score),
                attempts: (previous?.attempts ?? 0) + 1,
              },
            },
            activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays, today],
          };
        }),
      recordReview: (kind, refId, wasCorrect) =>
        set((s) => {
          const now = Date.now();
          const today = dayKey();
          const id = `${kind}:${refId}`;
          return {
            cards: { ...s.cards, [id]: reviewCard(s.cards[id] ?? newCard(kind, refId, now), wasCorrect, now) },
            activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays, today],
          };
        }),
      reset: () => set(DEFAULT_PROGRESS),
    }),
    {
      name: 'tradeschool.progress',
      version: PROGRESS_VERSION,
      migrate: createMigrate<ProgressState>(PROGRESS_VERSION, DEFAULT_PROGRESS, {
        // v1 -> v2: the trainer added spaced-repetition cards.
        1: (old) => ({ ...old, cards: {} }),
      }) as (p: unknown, v: number) => ProgressStore,
      partialize: ({ markActiveToday: _m, visitLesson: _v, completeLesson: _c, recordReview: _rr, reset: _r, ...data }) => data,
    },
  ),
);

export function useStreak(): number {
  return useProgress((s) => currentStreak(s.activeDays));
}

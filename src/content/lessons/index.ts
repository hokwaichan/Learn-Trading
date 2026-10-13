import type { Lesson, Module } from '@/types';
import { basics } from './01-basics';
import { candlesticks } from './02-candlesticks';
import { marketStructure } from './03-market-structure';
import { chartPatterns } from './04-chart-patterns';
import { indicators } from './05-indicators';
import { strategies } from './06-strategies';
import { riskManagement } from './07-risk-management';
import { futures } from './08-futures';
import { options } from './09-options';
import { psychology } from './10-psychology';
import { fundamentals } from './11-fundamentals';

/**
 * The curriculum, in recommended order. Nothing is locked: the order is only
 * a suggestion.
 *
 * To add a lesson, add an object to the `lessons` array of a module file and
 * a matching entry (same lesson id) to that module's file in content/quizzes.
 * To add a module, create both files and list the module here and its quizzes
 * in content/quizzes/index.ts. See the README for the building blocks.
 */
export const MODULES: Module[] = [
  basics,
  candlesticks,
  marketStructure,
  chartPatterns,
  indicators,
  strategies,
  riskManagement,
  futures,
  options,
  psychology,
  fundamentals,
];

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId);
}

const ALL: Lesson[] = MODULES.flatMap((m) => m.lessons);

/** Every lesson in curriculum order. */
export function allLessons(): Lesson[] {
  return ALL;
}

/** Key used to store progress for a lesson. */
export function lessonKey(lesson: Pick<Lesson, 'moduleId' | 'id'>): string {
  return `${lesson.moduleId}/${lesson.id}`;
}

/** The lessons before and after this one in curriculum order. */
export function neighbours(lesson: Lesson): { previous?: Lesson; next?: Lesson } {
  const i = ALL.findIndex((l) => l.moduleId === lesson.moduleId && l.id === lesson.id);
  return { previous: ALL[i - 1], next: ALL[i + 1] };
}

/** The first lesson, in curriculum order, that is not in `completed`. */
export function nextLesson(completed: (key: string) => boolean): Lesson | undefined {
  return ALL.find((l) => !completed(lessonKey(l)));
}

import type { Lesson, Module } from '@/types';

/**
 * The curriculum, in recommended order. Each module lives in its own file in
 * this folder and is added to this list.
 */
export const MODULES: Module[] = [];

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId);
}

export function allLessons(): Lesson[] {
  return MODULES.flatMap((m) => m.lessons);
}

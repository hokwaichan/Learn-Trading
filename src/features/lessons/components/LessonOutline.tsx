import { Check, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/components/ui';
import { lessonKey, MODULES } from '@/content/lessons';
import { useProgress } from '@/stores';

export interface LessonOutlineProps {
  currentModuleId?: string;
  currentLessonId?: string;
  onNavigate?: () => void;
}

/** The whole curriculum as a list, with what is done ticked off. */
export function LessonOutline({ currentModuleId, currentLessonId, onNavigate }: LessonOutlineProps) {
  const progress = useProgress((s) => s.lessons);

  return (
    <nav aria-label="Curriculum" className="flex flex-col gap-1 p-3">
      {MODULES.map((module) => {
        const done = module.lessons.filter((l) => progress[lessonKey(l)]?.completedAt).length;
        return (
          <details key={module.id} open={module.id === currentModuleId} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-control px-2 py-1.5 text-sm font-medium text-fg hover:bg-raised">
              <span className="num w-5 shrink-0 text-xs text-muted">{module.order}</span>
              <span className="min-w-0 flex-1 truncate">{module.title}</span>
              <span className="num shrink-0 text-xs text-muted">
                {done}/{module.lessons.length}
              </span>
            </summary>
            <ul className="mt-0.5 mb-1.5 flex flex-col">
              {module.lessons.map((lesson) => {
                const active = module.id === currentModuleId && lesson.id === currentLessonId;
                const complete = Boolean(progress[lessonKey(lesson)]?.completedAt);
                return (
                  <li key={lesson.id}>
                    <Link
                      to={`/learn/${module.id}/${lesson.id}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-start gap-2 rounded-control py-1.5 pr-2 pl-7 text-[13px] leading-snug',
                        active ? 'bg-accent/15 text-accent-text' : 'text-muted hover:bg-raised hover:text-fg',
                      )}
                    >
                      {complete ? (
                        <Check aria-label="Completed" className="mt-0.5 size-3.5 shrink-0 text-up-text" />
                      ) : (
                        <Circle aria-label="Not completed" className="mt-0.5 size-3.5 shrink-0 opacity-50" />
                      )}
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </nav>
  );
}

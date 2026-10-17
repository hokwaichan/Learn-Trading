import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, BottomSheet, Button, cn } from '@/components/ui';
import { lessonKey, neighbours } from '@/content/lessons';
import { getQuiz } from '@/content/quizzes';
import { t } from '@/i18n';
import { useProgress } from '@/stores';
import type { Lesson, Module } from '@/types';
import { LessonBlocks } from './LessonBlocks';
import { LessonOutline } from './LessonOutline';
import { QuizView } from './QuizView';

const NAV_LINK =
  'flex min-w-0 flex-1 flex-col gap-0.5 rounded-card border border-border px-4 py-3 text-sm transition-colors duration-150 hover:border-accent hover:bg-raised';

/** One lesson: outline on the left, reading column in the centre, quiz at the end. */
export function LessonView({ module, lesson }: { module: Module; lesson: Lesson }) {
  const key = lessonKey(lesson);
  const record = useProgress((s) => s.lessons[key]);
  const visitLesson = useProgress((s) => s.visitLesson);
  const completeLesson = useProgress((s) => s.completeLesson);
  const quiz = getQuiz(lesson.quizId);
  const { previous, next } = neighbours(lesson);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    visitLesson(module.id, lesson.id);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [module.id, lesson.id, visitLesson]);

  return (
    <div className="flex h-full">
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-surface lg:block">
        <LessonOutline currentModuleId={module.id} currentLessonId={lesson.id} />
      </aside>

      <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto">
        <article className="prose-lesson mx-auto px-4 py-6 md:px-8 md:py-10">
          <div className="not-prose mb-5 flex flex-wrap items-center gap-2 text-sm">
            <Button size="sm" className="lg:hidden" icon={<List aria-hidden className="size-4" />} onClick={() => setOutlineOpen(true)}>
              {t('Contents')}
            </Button>
            <Link to="/learn" className="text-muted underline-offset-4 hover:text-fg hover:underline">
              {t('Lessons')}
            </Link>
            <span aria-hidden className="text-muted">
              /
            </span>
            <span className="text-muted">
              {module.order}. {module.title}
            </span>
          </div>

          <header className="not-prose">
            <h1 className="text-[28px] leading-tight font-semibold text-fg">{lesson.title}</h1>
            <p className="mt-2 text-lg leading-snug text-muted">{lesson.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-4" />
                {t('About {n} minutes', { n: lesson.minutes })}
              </span>
              <span aria-hidden>·</span>
              <span>{t('Lesson {n} of {total}', { n: lesson.order, total: module.lessons.length })}</span>
              {record?.completedAt && (
                <Badge tone="up">
                  <CheckCircle2 aria-hidden className="size-3" />
                  {t('Completed')}
                </Badge>
              )}
            </div>
          </header>

          <LessonBlocks lesson={lesson} />

          {quiz && <QuizView key={quiz.id} quiz={quiz} bestScore={record?.bestScore} onFinish={(score) => completeLesson(key, score)} />}

          <nav aria-label={t('Lesson navigation')} className="not-prose mt-10 flex flex-col gap-3 sm:flex-row">
            {previous ? (
              <Link to={`/learn/${previous.moduleId}/${previous.id}`} className={NAV_LINK}>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <ArrowLeft aria-hidden className="size-3.5" />
                  {t('Previous')}
                </span>
                <span className="truncate font-medium text-fg">{previous.title}</span>
              </Link>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
            {next ? (
              <Link to={`/learn/${next.moduleId}/${next.id}`} className={cn(NAV_LINK, 'sm:items-end sm:text-right')}>
                <span className="flex items-center gap-1 text-xs text-muted">
                  {t('Next')}
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
                <span className="truncate font-medium text-fg">{next.title}</span>
              </Link>
            ) : (
              <Link to="/learn" className={cn(NAV_LINK, 'sm:items-end sm:text-right')}>
                <span className="text-xs text-muted">{t('End of the curriculum')}</span>
                <span className="font-medium text-fg">{t('Back to all lessons')}</span>
              </Link>
            )}
          </nav>
        </article>
      </div>

      <BottomSheet open={outlineOpen} onClose={() => setOutlineOpen(false)} title={t('Contents')} tall>
        <LessonOutline currentModuleId={module.id} currentLessonId={lesson.id} onNavigate={() => setOutlineOpen(false)} />
      </BottomSheet>
    </div>
  );
}

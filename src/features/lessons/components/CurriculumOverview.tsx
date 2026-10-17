import { ArrowRight, Check, Circle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card, cn, Page, PageHeader, ProgressBar } from '@/components/ui';
import { allLessons, getLesson, lessonKey, MODULES, nextLesson } from '@/content/lessons';
import { t } from '@/i18n';
import { useProgress } from '@/stores';

/** The whole curriculum on one page, with progress and a suggested next lesson. */
export function CurriculumOverview() {
  const progress = useProgress((s) => s.lessons);
  const last = useProgress((s) => s.lastLesson);

  const lessons = allLessons();
  const isDone = (key: string) => Boolean(progress[key]?.completedAt);
  const doneCount = lessons.filter((l) => isDone(lessonKey(l))).length;
  const suggested = nextLesson(isDone);
  const lastLesson = last && getLesson(last.moduleId, last.lessonId);
  // Resume an unfinished lesson you were reading; otherwise the next in order.
  const resume = lastLesson && !isDone(lessonKey(lastLesson)) ? lastLesson : suggested;
  const started = doneCount > 0 || Boolean(last);

  return (
    <Page className="max-w-4xl">
      <PageHeader
        title={t('Lessons')}
        description={t('{n} modules that take you from what a market is to option strategies, smart money concepts and day trading. Nothing is locked: the order is a recommendation.', { n: MODULES.length })}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {resume ? (started ? t('Continue learning') : t('Start here')) : t('Curriculum complete')}
            </p>
            {resume ? (
              <>
                <p className="mt-1 text-lg font-semibold text-fg">{resume.title}</p>
                <p className="mt-0.5 text-sm text-muted">{resume.summary}</p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">{t('You have finished every lesson. Revisit any of them below, or practise in the Trainer.')}</p>
            )}
          </div>
          {resume && (
            <Link
              to={`/learn/${resume.moduleId}/${resume.id}`}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-control bg-accent px-4 text-sm font-semibold text-on-solid hover:brightness-110"
            >
              {started ? t('Continue') : t('Start')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar className="flex-1" label={t('Lessons completed')} value={doneCount / lessons.length} />
          <span className="num shrink-0 text-xs text-muted">
            {t('{done} of {total} lessons', { done: doneCount, total: lessons.length })}
          </span>
        </div>
      </Card>

      {MODULES.map((module) => {
        const done = module.lessons.filter((l) => isDone(lessonKey(l))).length;
        const minutes = module.lessons.reduce((sum, l) => sum + l.minutes, 0);
        return (
          <Card
            key={module.id}
            flush
            aria-labelledby={`module-${module.id}`}
            title={
              <span id={`module-${module.id}`} className="flex items-baseline gap-2">
                <span className="num text-muted">{module.order}</span>
                {module.title}
              </span>
            }
            actions={
              <span className="flex items-center gap-2 text-xs text-muted">
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <Clock aria-hidden className="size-3.5" />
                  {t('{n} min', { n: minutes })}
                </span>
                <Badge tone={done === module.lessons.length ? 'up' : 'neutral'}>
                  {t('{done}/{total} done', { done, total: module.lessons.length })}
                </Badge>
              </span>
            }
          >
            <p className="border-b border-border px-4 py-2.5 text-sm text-muted">{module.description}</p>
            <ol>
              {module.lessons.map((lesson) => {
                const record = progress[lessonKey(lesson)];
                const complete = Boolean(record?.completedAt);
                return (
                  <li key={lesson.id} className="border-b border-border last:border-b-0">
                    <Link to={`/learn/${module.id}/${lesson.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-raised">
                      {complete ? (
                        <Check aria-label={t('Completed')} className="mt-0.5 size-4 shrink-0 text-up-text" />
                      ) : (
                        <Circle aria-label={t('Not completed')} className="mt-0.5 size-4 shrink-0 text-muted opacity-60" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={cn('block text-sm font-medium', lesson === resume ? 'text-accent-text' : 'text-fg')}>
                          {lesson.title}
                          {lesson === resume && <span className="ml-2 text-xs font-normal">{t('Up next')}</span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">{lesson.summary}</span>
                      </span>
                      <span className="num shrink-0 text-xs whitespace-nowrap text-muted">
                        {record?.bestScore != null ? t('Quiz {pct}%', { pct: Math.round(record.bestScore * 100) }) : t('{n} min', { n: lesson.minutes })}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Card>
        );
      })}
    </Page>
  );
}

import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, ClipboardX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Card, cn, EmptyState, Page, PageHeader, ProgressBar } from '@/components/ui';
import { allLessons, getLesson, getModule, lessonKey, MODULES, neighbours } from '@/content/lessons';
import { getQuiz } from '@/content/quizzes';
import { t } from '@/i18n';
import { useProgress } from '@/stores';
import type { Lesson, Module, Quiz } from '@/types';
import { QuizView } from './QuizView';

const PRIMARY_LINK =
  'inline-flex h-10 shrink-0 items-center gap-2 rounded-control bg-accent px-4 text-sm font-semibold text-on-solid hover:brightness-110';
const NAV_LINK =
  'flex min-w-0 flex-1 flex-col gap-0.5 rounded-card border border-border px-4 py-3 text-sm transition-colors duration-150 hover:border-accent hover:bg-raised';

const quizPath = (lesson: Pick<Lesson, 'moduleId' | 'id'>) => `/quiz/${lesson.moduleId}/${lesson.id}`;

/** /quiz lists every lesson's quiz; /quiz/:moduleId/:lessonId runs one. Lessons themselves only teach. */
export function QuizzesPage() {
  const { moduleId, lessonId } = useParams();
  if (!moduleId || !lessonId) return <QuizOverview />;

  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const quiz = lesson && getQuiz(lesson.quizId);
  if (!module || !lesson || !quiz) {
    return (
      <EmptyState
        className="h-full"
        icon={<ClipboardX />}
        title={t('Quiz not found')}
        description={t('That address does not match any quiz. It may have been renamed.')}
        action={
          <Link to="/quiz" className="text-sm text-accent-text underline underline-offset-4">
            {t('See all quizzes')}
          </Link>
        }
      />
    );
  }
  // The key gives each quiz fresh answers.
  return <QuizRun key={lessonKey(lesson)} module={module} lesson={lesson} quiz={quiz} />;
}

function QuizOverview() {
  const progress = useProgress((s) => s.lessons);
  const lessons = allLessons();
  const taken = (l: Lesson) => progress[lessonKey(l)]?.bestScore != null;
  const takenCount = lessons.filter(taken).length;
  const scores = lessons.map((l) => progress[lessonKey(l)]?.bestScore).filter((s): s is number => s != null);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  // Suggest a lesson you have read but not tested; otherwise the first untested one.
  const suggested = lessons.find((l) => progress[lessonKey(l)]?.completedAt && !taken(l)) ?? lessons.find((l) => !taken(l));

  return (
    <Page className="max-w-4xl">
      <PageHeader
        title={t('Quizzes')}
        description={t('Test what you learned. Every lesson has a short quiz, and each answer comes with an explanation. Read the lesson first, then come back here.')}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">{suggested ? t('Ready to test') : t('Every quiz taken')}</p>
            {suggested ? (
              <>
                <p className="mt-1 text-lg font-semibold text-fg">{suggested.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {progress[lessonKey(suggested)]?.completedAt ? t('You have read this lesson.') : t('You have not read this lesson yet.')}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted">{t('Retake any quiz below to raise your best score.')}</p>
            )}
          </div>
          {suggested && (
            <Link to={quizPath(suggested)} className={PRIMARY_LINK}>
              {t('Start')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ProgressBar className="min-w-40 flex-1" label={t('Quizzes taken')} value={takenCount / lessons.length} />
          <span className="num shrink-0 text-xs text-muted">{t('{done} of {total} quizzes', { done: takenCount, total: lessons.length })}</span>
          {average != null && <Badge tone="accent">{t('Average best score {pct}%', { pct: Math.round(average * 100) })}</Badge>}
        </div>
      </Card>

      {MODULES.map((module) => {
        const done = module.lessons.filter(taken).length;
        return (
          <Card
            key={module.id}
            flush
            aria-labelledby={`quiz-module-${module.id}`}
            title={
              <span id={`quiz-module-${module.id}`} className="flex items-baseline gap-2">
                <span className="num text-muted">{module.order}</span>
                {module.title}
              </span>
            }
            actions={<Badge tone={done === module.lessons.length ? 'up' : 'neutral'}>{t('{done}/{total} taken', { done, total: module.lessons.length })}</Badge>}
          >
            <ol>
              {module.lessons.map((lesson) => {
                const record = progress[lessonKey(lesson)];
                const quiz = getQuiz(lesson.quizId);
                return (
                  <li key={lesson.id} className="border-b border-border last:border-b-0">
                    <Link to={quizPath(lesson)} className="flex items-start gap-3 px-4 py-3 hover:bg-raised">
                      {record?.bestScore != null ? (
                        <Check aria-label={t('Taken')} className="mt-0.5 size-4 shrink-0 text-up-text" />
                      ) : (
                        <Circle aria-label={t('Not taken')} className="mt-0.5 size-4 shrink-0 text-muted opacity-60" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className={cn('block text-sm font-medium', lesson === suggested ? 'text-accent-text' : 'text-fg')}>{lesson.title}</span>
                        {!record?.completedAt && <span className="mt-0.5 block text-xs text-muted">{t('Lesson not read yet')}</span>}
                      </span>
                      <span className="num shrink-0 text-xs whitespace-nowrap text-muted">
                        {record?.bestScore != null
                          ? t('Best {pct}%', { pct: Math.round(record.bestScore * 100) })
                          : t('{n} questions', { n: quiz?.questions.length ?? 0 })}
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

function QuizRun({ module, lesson, quiz }: { module: Module; lesson: Lesson; quiz: Quiz }) {
  const key = lessonKey(lesson);
  const record = useProgress((s) => s.lessons[key]);
  const completeLesson = useProgress((s) => s.completeLesson);
  const { next } = neighbours(lesson);

  return (
    <Page className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link to="/quiz" className="text-muted underline-offset-4 hover:text-fg hover:underline">
          {t('Quizzes')}
        </Link>
        <span aria-hidden className="text-muted">
          /
        </span>
        <span className="text-muted">
          {module.order}. {module.title}
        </span>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{t('Quiz')}</p>
          <h1 className="text-[26px] leading-tight font-semibold text-fg">{lesson.title}</h1>
        </div>
        <Link
          to={`/learn/${module.id}/${lesson.id}`}
          className="inline-flex h-9 items-center gap-2 rounded-control border border-border px-3 text-sm text-fg hover:border-accent hover:bg-raised"
        >
          <BookOpen aria-hidden className="size-4" />
          {record?.completedAt ? t('Review the lesson') : t('Read the lesson first')}
        </Link>
      </header>

      <QuizView quiz={quiz} bestScore={record?.bestScore} onFinish={(score) => completeLesson(key, score)} />

      <nav aria-label={t('Quiz navigation')} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link to="/quiz" className={NAV_LINK}>
          <span className="flex items-center gap-1 text-xs text-muted">
            <ArrowLeft aria-hidden className="size-3.5" />
            {t('All quizzes')}
          </span>
          <span className="font-medium text-fg">{t('Quizzes')}</span>
        </Link>
        {next && getQuiz(next.quizId) && (
          <Link to={quizPath(next)} className={cn(NAV_LINK, 'sm:items-end sm:text-right')}>
            <span className="flex items-center gap-1 text-xs text-muted">
              {t('Next quiz')}
              <ArrowRight aria-hidden className="size-3.5" />
            </span>
            <span className="truncate font-medium text-fg">{next.title}</span>
          </Link>
        )}
      </nav>
    </Page>
  );
}

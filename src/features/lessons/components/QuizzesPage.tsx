import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, ClipboardX, RotateCcw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Card, cn, EmptyState, Page, PageHeader, ProgressBar } from '@/components/ui';
import { allLessons, getLesson, getModule, lessonKey, MODULES, neighbours } from '@/content/lessons';
import { getQuiz } from '@/content/quizzes';
import { t } from '@/i18n';
import { shuffled } from '@/lib/random';
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
  if (!moduleId) return <QuizOverview />;
  if (!lessonId) {
    const testModule = getModule(moduleId);
    if (testModule) return <ModuleTest key={testModule.id} module={testModule} />;
  }

  const module = getModule(moduleId);
  const lesson = lessonId ? getLesson(moduleId, lessonId) : undefined;
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
  const moduleTests = useProgress((s) => s.moduleTests) ?? {};
  const cards = useProgress((s) => s.cards);
  // Missed quiz questions that spaced repetition says are due again (asked in the Trainer).
  const now = Date.now();
  const dueReviews = Object.values(cards).filter((c) => c.kind === 'quiz' && c.lapses > 0 && c.dueAt <= now).length;
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

      {dueReviews > 0 && (
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <RotateCcw aria-hidden className="size-5 shrink-0 text-accent-text" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-fg">{t('{n} missed questions to review', { n: dueReviews })}</p>
              <p className="text-sm text-muted">{t('Questions you got wrong come back after a day. Answering them again is what makes them stick.')}</p>
            </div>
            <Link to="/trainer?mode=review" className={PRIMARY_LINK}>
              {t('Review them')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Card>
      )}

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
            actions={
              <span className="flex flex-wrap items-center justify-end gap-2">
                <Badge tone={done === module.lessons.length ? 'up' : 'neutral'}>{t('{done}/{total} taken', { done, total: module.lessons.length })}</Badge>
                <Link
                  to={`/quiz/${module.id}`}
                  className="inline-flex h-7 items-center gap-1 rounded-control border border-border px-2 text-xs font-medium text-fg hover:border-accent hover:bg-raised"
                >
                  {moduleTests[module.id]
                    ? t('Module test: best {pct}%', { pct: Math.round(moduleTests[module.id].bestScore * 100) })
                    : t('Module test')}
                </Link>
              </span>
            }
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

/** How many questions an end-of-module test asks. */
const MODULE_TEST_SIZE = 10;

/** Up to MODULE_TEST_SIZE questions, taken in turn from each lesson so every lesson is covered. */
function moduleQuestions(module: Module, seed: number): Quiz['questions'] {
  const perLesson = module.lessons.map((lesson, i) => shuffled(getQuiz(lesson.quizId)?.questions ?? [], seed + i));
  const picked: Quiz['questions'] = [];
  for (let round = 0; picked.length < MODULE_TEST_SIZE && perLesson.some((qs) => qs.length > round); round++) {
    for (const qs of perLesson) if (qs[round] && picked.length < MODULE_TEST_SIZE) picked.push(qs[round]);
  }
  return shuffled(picked, seed - 1);
}

function ModuleTest({ module }: { module: Module }) {
  const record = useProgress((s) => s.moduleTests?.[module.id]);
  const completeModuleTest = useProgress((s) => s.completeModuleTest);
  // A different selection of questions on each visit.
  const [seed] = useState(() => Math.floor(Math.random() * 1e9));
  const quiz = useMemo<Quiz>(() => ({ id: `module/${module.id}`, lessonId: '', questions: moduleQuestions(module, seed) }), [module, seed]);
  const nextModule = MODULES[MODULES.indexOf(module) + 1];

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

      <header>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{t('Module test')}</p>
        <h1 className="text-[26px] leading-tight font-semibold text-fg">{module.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {t('{n} questions mixed from all {lessons} lessons in this module. Come back for a different set.', { n: quiz.questions.length, lessons: module.lessons.length })}
        </p>
      </header>

      <QuizView quiz={quiz} bestScore={record?.bestScore} onFinish={(score) => completeModuleTest(module.id, score)} />

      <nav aria-label={t('Quiz navigation')} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link to="/quiz" className={NAV_LINK}>
          <span className="flex items-center gap-1 text-xs text-muted">
            <ArrowLeft aria-hidden className="size-3.5" />
            {t('All quizzes')}
          </span>
          <span className="font-medium text-fg">{t('Quizzes')}</span>
        </Link>
        {nextModule && (
          <Link to={`/quiz/${nextModule.id}`} className={cn(NAV_LINK, 'sm:items-end sm:text-right')}>
            <span className="flex items-center gap-1 text-xs text-muted">
              {t('Next module test')}
              <ArrowRight aria-hidden className="size-3.5" />
            </span>
            <span className="truncate font-medium text-fg">{nextModule.title}</span>
          </Link>
        )}
      </nav>
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

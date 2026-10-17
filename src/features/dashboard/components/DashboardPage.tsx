import { useMemo } from 'react';
import { ArrowRight, BookOpen, Dumbbell, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card, Page, Pnl, ProgressBar, StatTile, toneOf, Trans } from '@/components/ui';
import { allLessons, getLesson, getModule, lessonKey, MODULES, nextLesson } from '@/content/lessons';
import { getPattern } from '@/content/patterns';
import { DailyChallengeCard } from '@/features/trainer';
import { intlLocale, t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { formatMoney, formatSignedMoney } from '@/lib/format';
import { useAccount, useAccountSnapshot, useProgress, useStreak } from '@/stores';
import type { EquityPoint, Lesson, Trade } from '@/types';

const linkButton = 'inline-flex h-9 items-center gap-1.5 rounded-control px-3 text-sm font-medium transition-colors duration-150';
const primaryLink = `${linkButton} bg-accent text-on-solid hover:brightness-110`;
const quietLink = 'text-sm text-accent-text underline underline-offset-4';

/** A small line of the account's equity over time. The figures beside it carry the meaning. */
function Sparkline({ points }: { points: EquityPoint[] }) {
  const stride = Math.max(1, Math.ceil(points.length / 80));
  const shown = points.filter((_, i) => i % stride === 0 || i === points.length - 1);
  if (shown.length < 2) return <p className="text-xs text-muted">{t('The line appears after your first trade.')}</p>;
  const values = shown.map((p) => p.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const W = 240;
  const H = 48;
  const path = shown.map((p, i) => `${i ? 'L' : 'M'}${((i / (shown.length - 1)) * W).toFixed(1)},${(H - 4 - ((p.equity - min) / span) * (H - 8)).toFixed(1)}`).join(' ');
  const up = values[values.length - 1] >= values[0];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-12 w-full" role="img" aria-label={t('Equity from {start} to {end}', { start: formatMoney(values[0]), end: formatMoney(values[values.length - 1]) })} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={up ? 'var(--c-up)' : 'var(--c-down)'} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ContinueCard({ lesson, started, done, total, weakest }: { lesson: Lesson | undefined; started: boolean; done: number; total: number; weakest?: { name: string; accuracy: number } }) {
  const module = lesson ? getModule(lesson.moduleId) : undefined;
  return (
    <Card title={started ? t('Continue learning') : t('Start here')} className="lg:col-span-2">
      {lesson && module ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted">{t('Module {n}: {title}', { n: module.order, title: module.title })}</p>
            <h2 className="mt-0.5 text-lg font-semibold text-fg">{lesson.title}</h2>
            <p className="mt-1 max-w-prose text-sm text-muted">{lesson.summary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to={`/learn/${lesson.moduleId}/${lesson.id}`} className={primaryLink}>
              {started ? t('Continue') : t('Start the first lesson')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <span className="text-xs text-muted">
              <Trans
                text="About {minutes} minutes · lesson {n} of {total}"
                values={{
                  minutes: <span className="num">{lesson.minutes}</span>,
                  n: <span className="num">{Math.min(done + 1, total)}</span>,
                  total: <span className="num">{total}</span>,
                }}
              />
            </span>
          </div>
          {weakest && weakest.accuracy < 0.6 && (
            <p className="border-t border-border pt-3 text-sm text-muted">
              <Trans
                text="Also worth doing next: you are getting {pattern} right {pct} of the time."
                values={{
                  pattern: <span className="text-fg">{weakest.name}</span>,
                  pct: <span className="num text-fg">{Math.round(weakest.accuracy * 100)}%</span>,
                }}
              />{' '}
              <Link to="/trainer" className={quietLink}>
                {t('Practise it in the Trainer')}
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <GraduationCap aria-hidden className="mt-0.5 size-6 shrink-0 text-up-text" />
            <div>
              <h2 className="text-lg font-semibold text-fg">{t('Every lesson is complete')}</h2>
              <p className="mt-1 max-w-prose text-sm text-muted">{t('Keep the knowledge fresh with the Trainer, and keep practising on paper. Your Analytics page shows what to work on.')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/trainer" className={primaryLink}>
              {t('Open the Trainer')}
            </Link>
            <Link to="/learn" className={`${linkButton} border border-border text-fg hover:bg-raised`}>
              {t('Review the lessons')}
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

function tradeName(trade: Trade): string {
  const instrument = findInstrument(trade.symbol, trade.kind === 'perpetual' ? 'perpetual' : 'spot') ?? findInstrument(trade.symbol, 'spot');
  const name = instrument ? displaySymbol(instrument) : trade.symbol;
  return trade.label ? `${trade.label} · ${name}` : `${name} ${trade.direction === 'long' ? t('long') : t('short')}`;
}

/** Home: where you left off, today's challenge, your account, and what to practise. */
export function DashboardPage() {
  const lessons = useProgress((s) => s.lessons);
  const lastLesson = useProgress((s) => s.lastLesson);
  const cards = useProgress((s) => s.cards);
  const streak = useStreak();
  const account = useAccount((s) => s.accounts.main);
  const snapshot = useAccountSnapshot('main');

  const all = useMemo(() => allLessons(), []);
  const isDone = (key: string) => lessons[key]?.completedAt != null;
  const doneCount = all.filter((l) => isDone(lessonKey(l))).length;
  const scores = Object.values(lessons).filter((l) => l.bestScore != null);
  const averageScore = scores.length ? scores.reduce((sum, l) => sum + (l.bestScore ?? 0), 0) / scores.length : null;

  // Carry on with the lesson last opened if it is unfinished; otherwise the first unfinished one.
  const last = lastLesson ? getLesson(lastLesson.moduleId, lastLesson.lessonId) : undefined;
  const upNext = last && !isDone(lessonKey(last)) ? last : nextLesson(isDone);
  const started = doneCount > 0 || lastLesson != null;

  const weakest = useMemo(
    () =>
      Object.values(cards)
        .filter((c) => c.kind === 'pattern' && c.attempts >= 2)
        .map((c) => ({ id: c.refId, name: getPattern(c.refId)?.name ?? c.refId, accuracy: c.correct / c.attempts, attempts: c.attempts }))
        .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
        .slice(0, 4),
    [cards],
  );
  const practised = Object.values(cards).reduce((sum, c) => sum + c.attempts, 0);
  const correct = Object.values(cards).reduce((sum, c) => sum + c.correct, 0);

  const recent = useMemo(() => [...account.trades].sort((a, b) => b.closedAt - a.closedAt).slice(0, 5), [account.trades]);
  const openPositions = account.positions.length;
  const total = snapshot.equity - account.startingBalance;

  return (
    <Page>
      <header>
        <h1 className="text-xl font-semibold text-fg">{started ? t('Welcome back') : t('Welcome to TradeSchool')}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {started
            ? t('Pick up where you left off, do today’s challenge, or practise on paper.')
            : t('Learn trading from the ground up: short lessons in plain language, real charts, and practice with simulated money. Nothing here uses real money.')}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <ContinueCard lesson={upNext} started={started} done={doneCount} total={all.length} weakest={weakest[0]} />
        <DailyChallengeCard />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label={t('Lessons completed')} value={t('{done} of {total}', { done: doneCount, total: all.length })} sub={t('{pct}% of the course', { pct: Math.round((doneCount / all.length) * 100) })} />
        <StatTile label={t('Average quiz score')} value={averageScore != null ? `${Math.round(averageScore * 100)}%` : '–'} sub={scores.length ? (scores.length === 1 ? t('Best score across 1 quiz') : t('Best score across {n} quizzes', { n: scores.length })) : t('No quizzes taken yet')} />
        <StatTile label={t('Daily streak')} value={streak === 1 ? t('1 day') : t('{n} days', { n: streak })} sub={streak > 0 ? t('Study something today to keep it') : t('Finish a lesson or a drill to start one')} />
        <StatTile label={t('Trainer accuracy')} value={practised ? `${Math.round((correct / practised) * 100)}%` : '–'} sub={practised ? t('{n} answers so far', { n: practised }) : t('No drills answered yet')} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title={t('Paper account')}
          actions={
            <Link to="/analytics" className={quietLink}>
              {t('Analytics')}
            </Link>
          }
        >
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <div className="text-xs text-muted">{t('Equity (simulated money)')}</div>
              <div className="num text-2xl font-medium text-fg">{formatMoney(snapshot.equity)}</div>
            </div>
            <dl className="flex gap-6 text-sm">
              <div>
                <dt className="text-xs text-muted">{t('Today')}</dt>
                <dd>
                  <Pnl value={snapshot.todayPnl} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t('Since you started')}</dt>
                <dd>
                  <Pnl value={total} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t('Open positions')}</dt>
                <dd className="num text-fg">{openPositions}</dd>
              </div>
            </dl>
          </div>
          <div className="mt-3">
            <Sparkline points={account.equityHistory} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/charts/BTCUSDT" className={quietLink}>
              {t('Trade on the charts')}
            </Link>
            <Link to="/replay" className={quietLink}>
              {t('Practise on past prices')}
            </Link>
          </div>
        </Card>

        <Card
          title={t('Recent trades')}
          flush
          actions={
            <Link to="/journal" className={quietLink}>
              {t('Journal')}
            </Link>
          }
        >
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">{t('No closed trades yet. Your paper trades are logged automatically, with a chart of each one.')}</p>
          ) : (
            <ul>
              {recent.map((trade) => (
                <li key={trade.id} className="border-b border-border/60 last:border-0">
                  <Link to={`/journal/${trade.positionId}`} className="flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-raised">
                    <span className="min-w-0">
                      <span className="block truncate text-fg">{tradeName(trade)}</span>
                      <span className="num text-xs text-muted">{new Date(trade.closedAt).toLocaleDateString(intlLocale(), { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <Pnl value={trade.netPnl} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={t('Progress by module')}
          actions={
            <Link to="/learn" className={quietLink}>
              {t('All lessons')}
            </Link>
          }
        >
          <ul className="flex flex-col gap-3">
            {MODULES.map((module) => {
              const done = module.lessons.filter((l) => isDone(lessonKey(l))).length;
              const complete = done === module.lessons.length;
              const first = module.lessons.find((l) => !isDone(lessonKey(l))) ?? module.lessons[0];
              return (
                <li key={module.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <Link to={`/learn/${module.id}/${first.id}`} className="min-w-0 truncate text-fg underline-offset-4 hover:underline">
                      <span className="num text-muted">{module.order}.</span> {module.title}
                    </Link>
                    <span className="num shrink-0 text-xs text-muted">
                      {t('{done} of {total}', { done, total: module.lessons.length })}
                      {complete && <span className="ml-1.5 text-up-text">{t('Done')}</span>}
                    </span>
                  </div>
                  <ProgressBar value={done / module.lessons.length} label={t('{module}: {done} of {total} lessons complete', { module: module.title, done, total: module.lessons.length })} tone={complete ? 'up' : 'accent'} />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          title={t('Weakest patterns to practise')}
          actions={
            <Link to="/trainer" className={quietLink}>
              {t('Trainer')}
            </Link>
          }
        >
          {weakest.length === 0 ? (
            <div className="flex items-start gap-3">
              <Dumbbell aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
              <p className="text-sm text-muted">
                <Trans
                  text="Nothing to show yet. Answer a few pattern drills in the {trainer} and the ones you miss most will be listed here."
                  values={{
                    trainer: (
                      <Link to="/trainer" className={quietLink}>
                        {t('Trainer')}
                      </Link>
                    ),
                  }}
                />
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {weakest.map((w) => (
                <li key={w.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-fg">{w.name}</span>
                    <span className="num text-xs text-muted">
                      {t('{pct}% right over {n} tries', { pct: Math.round(w.accuracy * 100), n: w.attempts })}
                    </span>
                  </div>
                  <ProgressBar value={w.accuracy} label={t('{pattern}: {pct}% correct', { pattern: w.name, pct: Math.round(w.accuracy * 100) })} tone={w.accuracy < 0.5 ? 'down' : w.accuracy < 0.8 ? 'warning' : 'up'} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted">
            <BookOpen aria-hidden className="size-3.5 shrink-0" />
            {t('The Trainer brings back what you get wrong more often, so a few minutes a day is enough.')}
          </p>
        </Card>
      </div>

      {total !== 0 && openPositions === 0 && recent.length > 0 && (
        <p className="text-xs text-muted">
          <Trans
            text="Net result so far: {amount} on simulated money."
            values={{ amount: <span className={toneOf(total) === 'up' ? 'text-up-text' : 'text-down-text'}>{formatSignedMoney(total)}</span> }}
          />{' '}
          <Badge>{t('Paper')}</Badge>
        </p>
      )}
    </Page>
  );
}

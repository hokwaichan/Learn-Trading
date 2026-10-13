import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Button, cn, ErrorState, LoadingState, Tabs } from '@/components/ui';
import { useProgress } from '@/stores';
import { useTrainerData } from '../hooks/useTrainerData';
import { accuracyText, availableKinds, buildQuestion, type DrillMode, type TrainerQuestion } from '../questions';
import { AccuracyTable } from './AccuracyTable';
import { QuestionVisual } from './QuestionVisual';

const MODES: { id: DrillMode; label: string }[] = [
  { id: 'mixed', label: 'Mixed' },
  { id: 'candlestick', label: 'Candlesticks' },
  { id: 'chart', label: 'Chart patterns' },
  { id: 'next', label: 'What next?' },
  { id: 'options', label: 'Options' },
];

const MODE_KEY = 'tradeschool.ui.trainerMode';

function savedMode(): DrillMode {
  try {
    const value = localStorage.getItem(MODE_KEY);
    return MODES.some((m) => m.id === value) ? (value as DrillMode) : 'mixed';
  } catch {
    return 'mixed';
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center px-3 sm:px-5">
      <span className="num text-base font-medium text-fg">{value}</span>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

/** One question at a time: a large chart, answer buttons below, progress and accuracy on top. */
export function TrainerPage() {
  const data = useTrainerData();
  const cards = useProgress((s) => s.cards);
  const recordReview = useProgress((s) => s.recordReview);

  const [mode, setMode] = useState<DrillMode>(savedMode);
  const [question, setQuestion] = useState<TrainerQuestion | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [session, setSession] = useState({ answered: 0, correct: 0, run: 0 });
  const nextRef = useRef<HTMLButtonElement>(null);
  const answeredKey = useRef<string | null>(null);

  // Latest values for the question builder without re-creating it on every answer.
  const latest = useRef({ data, cards, question });
  useEffect(() => {
    latest.current = { data, cards, question };
  });

  const ask = useCallback((forMode: DrillMode) => {
    const { data: d, cards: c, question: previous } = latest.current;
    setPicked(null);
    setQuestion(
      buildQuestion(forMode, {
        datasets: d.datasets,
        index: d.index,
        cards: c,
        now: Date.now(),
        rand: Math.random,
        previous: previous ? { drill: previous.drill, refId: previous.refId } : undefined,
      }),
    );
  }, []);

  // Ask the first question, and a fresh one when the mode changes or the
  // price history a mode needs has just finished loading.
  const canAsk = availableKinds(mode, data).length > 0;
  const [asked, setAsked] = useState<{ mode: DrillMode; canAsk: boolean } | null>(null);
  useEffect(() => {
    if (asked?.mode === mode && (asked.canAsk || !canAsk)) return;
    setAsked({ mode, canAsk });
    if (canAsk) ask(mode);
    else setQuestion(null);
  }, [mode, canAsk, asked, ask]);

  const changeMode = (next: DrillMode) => {
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      // The choice still applies for this visit.
    }
  };

  const answer = useCallback(
    (choiceId: string) => {
      const q = latest.current.question;
      // Each question takes one answer: a second click or key press is ignored.
      if (!q || answeredKey.current === q.key) return;
      answeredKey.current = q.key;
      const right = choiceId === q.correctId;
      setPicked(choiceId);
      recordReview(q.kind, q.refId, right);
      setSession((s) => ({ answered: s.answered + 1, correct: s.correct + (right ? 1 : 0), run: right ? s.run + 1 : 0 }));
    },
    [recordReview],
  );

  // Keyboard: 1 to 4 choose an answer, Enter moves on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey || target?.closest('input, select, textarea, dialog')) return;
      const q = latest.current.question;
      if (!q) return;
      if (!picked && /^[1-9]$/.test(e.key)) {
        const choice = q.choices[Number(e.key) - 1];
        if (choice) {
          e.preventDefault();
          answer(choice.id);
        }
      } else if (picked && e.key === 'Enter' && target?.tagName !== 'BUTTON' && target?.tagName !== 'A') {
        e.preventDefault();
        ask(mode);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [picked, mode, answer, ask]);

  // Once answered, put focus on Next so Enter or Space carries on.
  useEffect(() => {
    if (picked) nextRef.current?.focus({ preventScroll: true });
  }, [picked]);

  const right = picked != null && picked === question?.correctId;
  const itemCard = question ? cards[`${question.kind}:${question.refId}`] : undefined;
  const correctLabel = question?.choices.find((c) => c.id === question.correctId)?.label ?? '';

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:p-6">
        <header className="flex flex-col gap-3">
          <div>
            <h1 className="text-xl font-semibold text-fg">Trainer</h1>
            <p className="mt-1 text-sm text-muted">Short drills on real charts. Items you get wrong come back more often.</p>
          </div>
          <Tabs
            variant="pill"
            label="Drill"
            idBase="trainer-mode"
            choice
            className="rounded-control border border-border p-0.5"
            items={MODES}
            value={mode}
            onChange={changeMode}
          />
          <div aria-label="This session" role="group" className="flex items-center justify-center divide-x divide-border rounded-card border border-border bg-surface py-2">
            <Stat label="Answered" value={String(session.answered)} />
            <Stat label="Right" value={session.answered ? `${session.correct} of ${session.answered}` : '–'} />
            <Stat label="Accuracy" value={session.answered ? `${Math.round((session.correct / session.answered) * 100)}%` : '–'} />
            <Stat label="In a row" value={String(session.run)} />
          </div>
        </header>

        {!question && data.status === 'loading' && <LoadingState className="h-80 rounded-card border border-border" label="Loading price history" />}
        {!question && data.status === 'error' && (
          <ErrorState
            className="h-80 rounded-card border border-border"
            title="Could not load price history"
            message={`${data.error ?? ''} This drill needs it. The chart pattern and options drills work without it.`}
            onRetry={data.retry}
          />
        )}

        {question && (
          <section aria-labelledby="trainer-prompt" className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">{question.topic}</Badge>
                {question.chart && (
                  <Badge tone={question.chart.real ? 'neutral' : 'warning'}>{question.chart.real ? 'Real history' : 'Constructed example'}</Badge>
                )}
              </span>
              <span className="text-xs text-muted">
                {itemCard?.attempts ? `You have got this one right ${accuracyText(itemCard)} of the time (${itemCard.attempts} answered)` : 'First time you have seen this one'}
              </span>
            </div>

            <QuestionVisual question={question} revealed={picked != null} answerLabel={correctLabel} />

            <h2 id="trainer-prompt" className={cn('font-medium text-fg', question.chart || question.payoff ? 'text-base' : 'text-lg leading-snug')}>
              {question.prompt}
            </h2>

            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Answers">
              {question.choices.map((choice, i) => {
                const chosen = picked === choice.id;
                const correct = choice.id === question.correctId;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={picked != null}
                    aria-pressed={chosen}
                    onClick={() => answer(choice.id)}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-control border px-3 py-2 text-left text-[15px] transition-colors duration-150',
                      !picked && 'border-border text-fg hover:border-accent hover:bg-raised',
                      picked && correct && 'border-up bg-up/10 text-fg',
                      picked && chosen && !correct && 'border-down bg-down/10 text-fg',
                      picked && !chosen && !correct && 'border-border text-muted',
                    )}
                  >
                    <kbd aria-hidden className="num grid size-5 shrink-0 place-items-center rounded-sm border border-border text-[11px] text-muted">
                      {i + 1}
                    </kbd>
                    <span className="flex-1">{choice.label}</span>
                    {picked && correct && (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-up-text">
                        <Check aria-hidden className="size-4" />
                        Correct answer
                      </span>
                    )}
                    {picked && chosen && !correct && (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-down-text">
                        <X aria-hidden className="size-4" />
                        Your answer
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {picked && (
              <div role="status" className="rounded-card border border-border bg-surface p-4">
                <p className="text-base font-semibold">
                  <span className={right ? 'text-up-text' : 'text-down-text'}>{right ? 'Right. ' : 'Not quite. '}</span>
                  <span className="text-fg">{question.explanation.heading}</span>
                </p>
                {question.explanation.paragraphs.map((text) => (
                  <p key={text} className="mt-2 text-[15px] leading-relaxed text-fg">
                    {text}
                  </p>
                ))}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {question.explanation.lesson ? (
                    <Link to={`/learn/${question.explanation.lesson}`} className="text-sm text-accent-text underline underline-offset-4">
                      Read the lesson
                    </Link>
                  ) : (
                    <span />
                  )}
                  <Button ref={nextRef} variant="primary" size="lg" onClick={() => ask(mode)}>
                    Next question
                    <ArrowRight aria-hidden className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}

        <AccuracyTable />
      </div>
    </div>
  );
}

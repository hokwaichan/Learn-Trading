import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, CircleCheck, Target, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, cn, LoadingState, Modal } from '@/components/ui';
import { currentStreak, dayKey } from '@/lib/dates';
import { useProgress } from '@/stores';
import { conceptQuestion, patternQuestion } from '../challenge';
import { useTrainerData } from '../hooks/useTrainerData';
import type { TrainerQuestion } from '../questions';
import { QuestionVisual } from './QuestionVisual';

/** One challenge question: the visual, the answers, and the explanation once answered. */
function Step({ question, picked, onPick }: { question: TrainerQuestion; picked: string | null; onPick: (id: string) => void }) {
  const right = picked === question.correctId;
  const correctLabel = question.choices.find((c) => c.id === question.correctId)?.label ?? '';
  return (
    <div className="flex flex-col gap-3">
      <QuestionVisual question={question} revealed={picked != null} answerLabel={correctLabel} />
      <p className="text-base font-medium text-fg">{question.prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Answers">
        {question.choices.map((choice) => {
          const chosen = picked === choice.id;
          const correct = choice.id === question.correctId;
          return (
            <button
              key={choice.id}
              type="button"
              disabled={picked != null}
              aria-pressed={chosen}
              onClick={() => onPick(choice.id)}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-control border px-3 py-2 text-left text-sm transition-colors duration-150',
                !picked && 'border-border text-fg hover:border-accent hover:bg-raised',
                picked && correct && 'border-up bg-up/10 text-fg',
                picked && chosen && !correct && 'border-down bg-down/10 text-fg',
                picked && !chosen && !correct && 'border-border text-muted',
              )}
            >
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
        <div role="status" className="rounded-card border border-border bg-bg p-3">
          <p className="text-sm font-semibold">
            <span className={right ? 'text-up-text' : 'text-down-text'}>{right ? 'Right. ' : 'Not quite. '}</span>
            <span className="text-fg">{question.explanation.heading}</span>
          </p>
          {question.explanation.paragraphs.map((text) => (
            <p key={text} className="mt-1.5 text-sm leading-relaxed text-fg">
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/** Runs the two questions in order, then shows the score. */
function Runner({ day, onClose }: { day: string; onClose: () => void }) {
  const data = useTrainerData();
  const lessons = useProgress((s) => s.lessons);
  const recordReview = useProgress((s) => s.recordReview);
  const completeChallenge = useProgress((s) => s.completeChallenge);
  // Fixed when the challenge opens: finishing a lesson mid-challenge must not swap the question.
  const completed = useRef(Object.keys(lessons).filter((key) => lessons[key].completedAt != null));

  const questions = useMemo(() => {
    if (data.status === 'loading') return null;
    const pattern = patternQuestion(day, data.datasets, data.index);
    return [...(pattern ? [pattern] : []), conceptQuestion(day, completed.current)];
  }, [data.status, data.datasets, data.index, day]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);

  if (!questions) return <LoadingState className="py-12" label="Preparing today's challenge" />;

  const finished = step >= questions.length;
  const score = questions.filter((q, i) => answers[i] === q.correctId).length;
  if (finished) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CircleCheck aria-hidden className="size-10 text-up-text" />
        <p className="text-lg font-semibold text-fg">
          {score} of {questions.length} right
        </p>
        <p className="max-w-sm text-sm text-muted">
          {score === questions.length ? "Today's challenge is done. A new one arrives tomorrow." : "Today's challenge is done. What you missed will come up again in the Trainer."}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link to="/trainer" onClick={onClose} className="inline-flex h-8 items-center rounded-control border border-border px-3 text-sm text-fg hover:bg-raised">
            Practise more in the Trainer
          </Link>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[step];
  const picked = answers[step] ?? null;
  const pick = (id: string) => {
    if (picked) return;
    setAnswers((a) => {
      const next = [...a];
      next[step] = id;
      return next;
    });
    recordReview(question.kind, question.refId, id === question.correctId);
  };
  const last = step === questions.length - 1;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">
        Question <span className="num">{step + 1}</span> of <span className="num">{questions.length}</span> · {question.topic}
      </p>
      <Step key={question.key} question={question} picked={picked} onPick={pick} />
      <div className="flex justify-end">
        <Button
          variant="primary"
          disabled={!picked}
          onClick={() => {
            if (last) completeChallenge();
            setStep(step + 1);
          }}
        >
          {last ? 'Finish' : 'Next question'}
          <ArrowRight aria-hidden className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/** The daily challenge card for the Home page: one pattern question and one concept question. */
export function DailyChallengeCard() {
  const challengeDays = useProgress((s) => s.challengeDays);
  const [open, setOpen] = useState(false);
  const today = dayKey();
  const done = challengeDays.includes(today);
  const run = currentStreak(challengeDays, today);

  return (
    <Card title="Daily challenge" className="flex flex-col">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start gap-3">
          {done ? <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-up-text" /> : <Target aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />}
          <div>
            <p className="text-sm font-medium text-fg">{done ? 'Done for today' : 'One pattern to spot, one concept question'}</p>
            <p className="mt-0.5 text-sm text-muted">
              {done ? 'A new challenge arrives tomorrow.' : 'About a minute. It is the same all day, so there is no rush.'}
              {run > 1 && (
                <>
                  {' '}
                  <span className="num text-fg">{run}</span> days in a row.
                </>
              )}
            </p>
          </div>
        </div>
        <div className="mt-auto">
          <Button variant={done ? 'secondary' : 'primary'} onClick={() => setOpen(true)}>
            {done ? 'Do it again' : "Start today's challenge"}
          </Button>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Daily challenge" size="lg">
        {open && <Runner day={today} onClose={() => setOpen(false)} />}
      </Modal>
    </Card>
  );
}

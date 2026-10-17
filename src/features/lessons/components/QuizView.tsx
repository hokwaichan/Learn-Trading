import { useMemo, useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { Badge, Button, cn, ProgressBar, Trans } from '@/components/ui';
import { t } from '@/i18n';
import { hashString, shuffled } from '@/lib/random';
import type { Quiz } from '@/types';
import { LessonChart } from './LessonChart';

export interface QuizViewProps {
  quiz: Quiz;
  /** Best score so far, as a fraction, if the quiz has been taken before. */
  bestScore?: number;
  /** Called once when the last question is answered. */
  onFinish: (score: number) => void;
}

/**
 * The end-of-lesson quiz. Each question gives feedback as soon as it is
 * answered. Answers are shown in a different order on every attempt, so the
 * position of the right one cannot be learned.
 */
export function QuizView({ quiz, bestScore, onFinish }: QuizViewProps) {
  const [attempt, setAttempt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = useMemo(
    () => quiz.questions.map((question) => ({ ...question, choices: shuffled(question.choices, hashString(`${question.id}#${attempt}`)) })),
    [quiz, attempt],
  );

  const answered = Object.keys(answers).length;
  const correct = questions.filter((question) => answers[question.id] === question.correctChoiceId).length;
  const finished = answered === questions.length;

  const choose = (questionId: string, choiceId: string) => {
    if (answers[questionId]) return;
    const next = { ...answers, [questionId]: choiceId };
    setAnswers(next);
    if (Object.keys(next).length === questions.length) {
      onFinish(questions.filter((question) => next[question.id] === question.correctChoiceId).length / questions.length);
    }
  };

  return (
    <section aria-labelledby="quiz-title" className="not-prose mt-10 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="quiz-title" className="text-xl font-semibold text-fg">
          {t('Check your understanding')}
        </h2>
        {bestScore != null && <Badge tone="accent">{t('Best score {pct}%', { pct: Math.round(bestScore * 100) })}</Badge>}
      </div>
      <p className="mt-1 text-sm text-muted">
        {t('{n} questions. You get the explanation as soon as you answer, right or wrong.', { n: questions.length })}
      </p>
      <ProgressBar className="mt-3" label={t('Questions answered')} value={answered / questions.length} />

      <ol className="mt-5 flex flex-col gap-6">
        {questions.map((question, index) => {
          const picked = answers[question.id];
          const isRight = picked === question.correctChoiceId;
          return (
            <li key={question.id}>
              <fieldset disabled={Boolean(picked)} className="min-w-0">
                <legend className="text-base font-medium text-fg">
                  <span className="num mr-2 text-muted">{index + 1}.</span>
                  {question.prompt}
                </legend>
                {question.chart && <LessonChart example={question.chart} id={`quiz-${question.id}`} />}
                <div className="mt-3 flex flex-col gap-2">
                  {question.choices.map((choice) => {
                    const chosen = picked === choice.id;
                    const right = choice.id === question.correctChoiceId;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        aria-pressed={chosen}
                        onClick={() => choose(question.id, choice.id)}
                        className={cn(
                          'flex items-center gap-3 rounded-control border px-3 py-2.5 text-left text-[15px] leading-snug transition-colors duration-150',
                          !picked && 'border-border text-fg hover:border-accent hover:bg-raised',
                          picked && right && 'border-up bg-up/10 text-fg',
                          picked && chosen && !right && 'border-down bg-down/10 text-fg',
                          picked && !chosen && !right && 'border-border text-muted',
                        )}
                      >
                        <span className="flex-1">{choice.text}</span>
                        {/* The icon and words carry the result, not colour alone. */}
                        {picked && right && (
                          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-up-text">
                            <Check aria-hidden className="size-4" />
                            {t('Correct answer')}
                          </span>
                        )}
                        {picked && chosen && !right && (
                          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-down-text">
                            <X aria-hidden className="size-4" />
                            {t('Your answer')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              {picked && (
                <p role="status" className="mt-3 rounded-control border border-border bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-fg">
                  <strong className={isRight ? 'text-up-text' : 'text-down-text'}>{isRight ? t('Right.') : t('Not quite.')} </strong>
                  {question.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {finished && (
        <div role="status" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-base font-semibold text-fg">
              <Trans
                text="You got {correct} of {total}."
                values={{ correct: <span className="num">{correct}</span>, total: <span className="num">{questions.length}</span> }}
              />
            </p>
            <p className="text-sm text-muted">
              {correct === questions.length
                ? t('Lesson complete. On to the next one.')
                : t('Lesson complete. Read the explanations above, or try again with the answers in a new order.')}
            </p>
          </div>
          <Button
            icon={<RotateCcw aria-hidden className="size-4" />}
            onClick={() => {
              setAnswers({});
              setAttempt((a) => a + 1);
            }}
          >
            {t('Try again')}
          </Button>
        </div>
      )}
    </section>
  );
}

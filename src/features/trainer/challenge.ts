import { MODULES } from '@/content/lessons';
import { QUIZZES } from '@/content/quizzes';
import { hashString, seededRandom, shuffled } from '@/lib/random';
import { buildQuestion, type Dataset, type PatternIndex, type TrainerQuestion } from './questions';

/**
 * The daily challenge: one pattern to spot and one concept question. Both
 * are chosen from the date, so the challenge is the same all day and
 * different tomorrow.
 */

/**
 * Today's concept question, taken from the quizzes of lessons already
 * completed so it revises something that has been taught. Before any lesson
 * is finished it comes from the first module.
 */
export function conceptQuestion(day: string, completedLessons: string[]): TrainerQuestion {
  const done = new Set(completedLessons);
  const usable = (ids: (id: string) => boolean) => QUIZZES.filter((quiz) => ids(quiz.id)).flatMap((quiz) => quiz.questions.filter((q) => !q.chart).map((q) => ({ quiz, q })));
  let pool = usable((id) => done.has(id));
  if (pool.length === 0) pool = usable((id) => id.startsWith(`${MODULES[0].id}/`));
  const seed = hashString(`concept:${day}`);
  const { quiz, q } = pool[seed % pool.length];
  const correct = q.choices.find((c) => c.id === q.correctChoiceId)!;
  return {
    key: `concept:${day}`,
    drill: 'outlook',
    kind: 'concept',
    refId: q.id,
    topic: 'Concept',
    prompt: q.prompt,
    choices: shuffled(q.choices, seed).map((c) => ({ id: c.id, label: c.text })),
    correctId: q.correctChoiceId,
    explanation: { heading: correct.text, paragraphs: [q.explanation], lesson: quiz.id },
  };
}

/**
 * Today's pattern question: a candlestick pattern on real history when the
 * bundled data has loaded, otherwise a chart pattern, which needs none.
 */
export function patternQuestion(day: string, datasets: Dataset[], index: PatternIndex): TrainerQuestion | null {
  const seed = hashString(`pattern:${day}`);
  const candlesticks = Object.keys(index).length > 0;
  const mode = candlesticks && seed % 2 === 0 ? 'candlestick' : 'chart';
  // No history is passed in, so the pick depends on the date alone.
  const question = buildQuestion(mode, { datasets, index, cards: {}, now: 0, rand: seededRandom(seed) });
  return question ? { ...question, key: `pattern:${day}` } : null;
}

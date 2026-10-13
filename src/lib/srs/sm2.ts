import type { ReviewCard } from '@/types';

const DAY_MS = 86_400_000;
const MIN_EASE = 1.3;
const START_EASE = 2.5;

export function newCard(kind: ReviewCard['kind'], refId: string, now: number): ReviewCard {
  return {
    id: `${kind}:${refId}`,
    kind,
    refId,
    ease: START_EASE,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    dueAt: now,
    attempts: 0,
    correct: 0,
  };
}

/**
 * Updates a card after one answer, using the SM-2 spaced-repetition rule.
 *
 * A right answer pushes the next review further away: 1 day, then 6 days,
 * then the previous interval times the card's ease. A wrong answer brings the
 * card back tomorrow and lowers its ease, so it keeps coming up more often.
 *
 * SM-2 grades answers 0 to 5. A multiple-choice answer is only right or
 * wrong, so right counts as 4 ("correct after some thought") and wrong as 2.
 */
export function reviewCard(card: ReviewCard, wasCorrect: boolean, now: number): ReviewCard {
  const quality = wasCorrect ? 4 : 2;
  const ease = Math.max(MIN_EASE, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  let repetitions: number;
  let intervalDays: number;
  if (!wasCorrect) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions = card.repetitions + 1;
    intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(card.intervalDays * ease);
  }

  return {
    ...card,
    ease,
    repetitions,
    intervalDays,
    lapses: card.lapses + (wasCorrect ? 0 : 1),
    dueAt: now + intervalDays * DAY_MS,
    lastReviewedAt: now,
    attempts: card.attempts + 1,
    correct: card.correct + (wasCorrect ? 1 : 0),
  };
}

/** Share of answers that were right, or null if the card has never been answered. */
export function accuracy(card: Pick<ReviewCard, 'attempts' | 'correct'> | undefined): number | null {
  return card && card.attempts > 0 ? card.correct / card.attempts : null;
}

/**
 * How strongly an item should be favoured when choosing the next question.
 * The trainer is open-ended practice, not a fixed review queue, so every item
 * can always come up; weak, overdue and never-seen ones just come up more.
 *
 *   base 1
 *   + up to 4 for low accuracy (0% right = +4, 100% right = +0)
 *   + 2 if the card is due for review
 *   + 2 if it has never been seen
 */
export function selectionWeight(card: ReviewCard | undefined, now: number): number {
  if (!card || card.attempts === 0) return 3;
  const weakness = 1 - card.correct / card.attempts;
  return 1 + 4 * weakness + (card.dueAt <= now ? 2 : 0);
}

/** Picks one id at random, in proportion to each item's weight. `random` returns 0 to 1. */
export function pickWeighted<T extends string>(
  ids: readonly T[],
  cards: Record<string, ReviewCard>,
  cardId: (id: T) => string,
  now: number,
  random: () => number,
  /** An id to avoid, so the same item is not asked twice in a row. */
  avoid?: T,
): T {
  const pool = ids.length > 1 && avoid != null ? ids.filter((id) => id !== avoid) : [...ids];
  const weights = pool.map((id) => selectionWeight(cards[cardId(id)], now));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r < 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/** Cards answered at least `minAttempts` times, weakest first. */
export function weakestCards(cards: Record<string, ReviewCard>, minAttempts = 2): ReviewCard[] {
  return Object.values(cards)
    .filter((c) => c.attempts >= minAttempts)
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts || b.attempts - a.attempts);
}

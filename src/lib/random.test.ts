import { describe, expect, it } from 'vitest';
import { QUIZZES } from '@/content/quizzes';
import { hashString, seededRandom, shuffled, simulateTrades } from './random';

describe('seeded random', () => {
  it('repeats for the same seed and differs for another', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const c = seededRandom(43);
    const run = (r: () => number) => [r(), r(), r()];
    const first = run(a);
    expect(run(b)).toEqual(first);
    expect(run(c)).not.toEqual(first);
    first.forEach((v) => expect(v >= 0 && v < 1).toBe(true));
  });

  it('hashes strings to stable, distinct seeds', () => {
    expect(hashString('basics/leverage/1')).toBe(hashString('basics/leverage/1'));
    expect(hashString('basics/leverage/1')).not.toBe(hashString('basics/leverage/2'));
  });
});

describe('shuffled', () => {
  it('keeps every item, does not change the input, and is repeatable', () => {
    const input = ['a', 'b', 'c', 'd'];
    const out = shuffled(input, 7);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual(['a', 'b', 'c', 'd']);
    expect(shuffled(input, 7)).toEqual(out);
  });

  it('spreads the right answer evenly across positions for the real quizzes', () => {
    // As written, the right answer sits in the second position most of the
    // time. Shown shuffled, each position should hold it about a quarter of the time.
    const positions = [0, 0, 0, 0];
    let total = 0;
    for (const quiz of QUIZZES) {
      for (const question of quiz.questions) {
        if (question.choices.length !== 4) continue;
        for (let attempt = 0; attempt < 5; attempt++) {
          const order = shuffled(question.choices, hashString(`${question.id}#${attempt}`));
          positions[order.findIndex((c) => c.id === question.correctChoiceId)]++;
          total++;
        }
      }
    }
    for (const count of positions) {
      expect(count / total).toBeGreaterThan(0.2);
      expect(count / total).toBeLessThan(0.3);
    }
  });

  it('gives a different order on a second attempt for most questions', () => {
    const questions = QUIZZES.flatMap((quiz) => quiz.questions);
    const changed = questions.filter(
      (question) =>
        shuffled(question.choices, hashString(`${question.id}#0`)).map((c) => c.id).join() !==
        shuffled(question.choices, hashString(`${question.id}#1`)).map((c) => c.id).join(),
    );
    expect(changed.length / questions.length).toBeGreaterThan(0.8);
  });
});

describe('simulateTrades', () => {
  it('always wins or always loses at the extremes', () => {
    const allWins = simulateTrades(1, 2, 10, 1);
    expect(allWins.finalR).toBe(20);
    expect(allWins.maxDrawdownR).toBe(0);
    expect(allWins.longestLosingStreak).toBe(0);
    const allLosses = simulateTrades(0, 2, 10, 1);
    expect(allLosses.finalR).toBe(-10);
    expect(allLosses.maxDrawdownR).toBe(10);
    expect(allLosses.longestLosingStreak).toBe(10);
  });

  it('records the equity after every trade', () => {
    const run = simulateTrades(0.5, 1.5, 25, 3);
    expect(run.equity).toHaveLength(26);
    expect(run.equity[0]).toBe(0);
    expect(run.equity[25]).toBe(run.finalR);
    for (let i = 1; i < run.equity.length; i++) expect([1.5, -1]).toContain(run.equity[i] - run.equity[i - 1]);
  });

  it('averages out to the expectancy over many trades', () => {
    // 40% winners of 2R: expectancy 0.4 * 2 - 0.6 = +0.2R per trade.
    const run = simulateTrades(0.4, 2, 200_000, 11);
    expect(run.finalR / 200_000).toBeCloseTo(0.2, 1);
  });

  it('shows that short runs vary widely around the same average', () => {
    const finals = Array.from({ length: 200 }, (_, seed) => simulateTrades(0.4, 2, 30, seed).finalR);
    expect(Math.min(...finals)).toBeLessThan(0);
    expect(Math.max(...finals)).toBeGreaterThan(12);
  });
});

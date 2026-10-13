import { describe, expect, it } from 'vitest';
import { currentStreak, dayKey, daysBetween } from './dates';

describe('dates', () => {
  it('builds a local day key', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('counts days across month and year boundaries', () => {
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1);
    expect(daysBetween('2026-02-28', '2026-03-01')).toBe(1);
  });
});

describe('currentStreak', () => {
  it('is zero with no activity', () => {
    expect(currentStreak([], '2026-01-10')).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(currentStreak(['2026-01-08', '2026-01-09', '2026-01-10'], '2026-01-10')).toBe(3);
  });

  it('still counts when the last active day was yesterday', () => {
    expect(currentStreak(['2026-01-08', '2026-01-09'], '2026-01-10')).toBe(2);
  });

  it('resets after a missed day', () => {
    expect(currentStreak(['2026-01-07', '2026-01-08'], '2026-01-10')).toBe(0);
  });

  it('stops at a gap and ignores duplicates and order', () => {
    expect(currentStreak(['2026-01-10', '2026-01-05', '2026-01-09', '2026-01-10'], '2026-01-10')).toBe(2);
  });
});

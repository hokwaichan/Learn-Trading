import { describe, expect, it } from 'vitest';
import type { ProgressState } from '@/types';
import { fingerprint, mergeJournal, mergeProgress, planSync, type Snapshot } from './merge';

const progress = (state: Partial<ProgressState>, version = 2) => ({
  state: { lessons: {}, activeDays: [], challengeDays: [], cards: {}, ...state },
  version,
});
const settings = (theme: string) => ({ state: { theme }, version: 1 });

describe('fingerprint', () => {
  it('ignores key order and undefined fields', () => {
    expect(fingerprint({ state: { a: 1, b: { c: 2, d: undefined } }, version: 1 })).toBe(fingerprint({ version: 1, state: { b: { c: 2 }, a: 1 } }));
  });
  it('changes when the data changes, and is empty for a missing store', () => {
    expect(fingerprint(settings('dark'))).not.toBe(fingerprint(settings('light')));
    expect(fingerprint(undefined)).toBe('');
  });
});

describe('mergeProgress', () => {
  it('keeps the best of both devices', () => {
    const merged = mergeProgress(
      progress({
        lessons: { 'a/1': { completedAt: 200, bestScore: 0.6, attempts: 1 }, 'a/2': { completedAt: 300, attempts: 0 } },
        activeDays: ['2026-11-01', '2026-11-03'],
        moduleTests: { a: { bestScore: 0.5, attempts: 1 } },
      }).state,
      progress({
        lessons: { 'a/1': { completedAt: 100, bestScore: 0.9, attempts: 2 }, 'b/1': { completedAt: 400, attempts: 0 } },
        activeDays: ['2026-11-02', '2026-11-03'],
        challengeDays: ['2026-11-02'],
        moduleTests: { a: { bestScore: 0.8, attempts: 1 }, b: { bestScore: 1, attempts: 1 } },
      }).state,
    );
    expect(merged.lessons['a/1']).toEqual({ completedAt: 100, bestScore: 0.9, attempts: 2 });
    expect(Object.keys(merged.lessons).sort()).toEqual(['a/1', 'a/2', 'b/1']);
    expect(merged.activeDays).toEqual(['2026-11-01', '2026-11-02', '2026-11-03']);
    expect(merged.challengeDays).toEqual(['2026-11-02']);
    expect(merged.moduleTests).toEqual({ a: { bestScore: 0.8, attempts: 1 }, b: { bestScore: 1, attempts: 1 } });
  });

  it('keeps the trainer card reviewed most recently', () => {
    const card = (lastReviewedAt: number, intervalDays: number) => ({
      id: 'quiz:x', kind: 'quiz' as const, refId: 'x', ease: 2.5, intervalDays, repetitions: 1, lapses: 0, dueAt: 0, lastReviewedAt, attempts: 1, correct: 1,
    });
    const merged = mergeProgress(progress({ cards: { 'quiz:x': card(10, 1) } }).state, progress({ cards: { 'quiz:x': card(20, 6) } }).state);
    expect(merged.cards['quiz:x'].intervalDays).toBe(6);
  });
});

describe('mergeJournal', () => {
  it('keeps the most recently edited note for each trade', () => {
    const note = (review: string, updatedAt: number) => ({ reasoning: '', review, updatedAt });
    const merged = mergeJournal({ notes: { t1: note('old', 1), t2: note('only here', 5) } }, { notes: { t1: note('new', 2), t3: note('only there', 3) } });
    expect(merged.notes.t1.review).toBe('new');
    expect(Object.keys(merged.notes).sort()).toEqual(['t1', 't2', 't3']);
  });
});

describe('planSync', () => {
  it('uploads everything the first time the cloud is empty', () => {
    const local: Snapshot = { 'tradeschool.settings': settings('dark') };
    const plan = planSync(local, null, {}, true);
    expect(plan.upload).toBe(true);
    expect(plan.applyLocally).toEqual([]);
    expect(plan.merged).toEqual(local);
  });

  it('adopts the cloud copy on a new device, but still merges progress', () => {
    const local: Snapshot = { 'tradeschool.settings': settings('light'), 'tradeschool.progress': progress({ activeDays: ['2026-11-04'] }) };
    const remote: Snapshot = { 'tradeschool.settings': settings('dark'), 'tradeschool.progress': progress({ activeDays: ['2026-11-01'] }) };
    const plan = planSync(local, remote, {}, true);
    expect(plan.merged['tradeschool.settings']).toEqual(settings('dark'));
    expect((plan.merged['tradeschool.progress'].state as ProgressState).activeDays).toEqual(['2026-11-01', '2026-11-04']);
    expect(plan.applyLocally.sort()).toEqual(['tradeschool.progress', 'tradeschool.settings']);
    expect(plan.combined).toEqual(['tradeschool.progress']);
    expect(plan.upload).toBe(true);
  });

  it('takes whichever side changed since the last sync', () => {
    const base = { 'tradeschool.settings': fingerprint(settings('dark')), 'tradeschool.account': fingerprint({ state: { cash: 1 }, version: 1 }) };
    const local: Snapshot = { 'tradeschool.settings': settings('light'), 'tradeschool.account': { state: { cash: 1 }, version: 1 } };
    const remote: Snapshot = { 'tradeschool.settings': settings('dark'), 'tradeschool.account': { state: { cash: 2 }, version: 1 } };
    const plan = planSync(local, remote, base, false);
    expect(plan.merged['tradeschool.settings']).toEqual(settings('light'));
    expect(plan.merged['tradeschool.account']).toEqual({ state: { cash: 2 }, version: 1 });
    expect(plan.applyLocally).toEqual(['tradeschool.account']);
    expect(plan.upload).toBe(true);
  });

  it('keeps this device when both changed a store that cannot be merged', () => {
    const base = { 'tradeschool.settings': fingerprint(settings('dark')) };
    const plan = planSync({ 'tradeschool.settings': settings('light') }, { 'tradeschool.settings': { state: { theme: 'sepia' }, version: 1 } }, base, false);
    expect(plan.merged['tradeschool.settings']).toEqual(settings('light'));
    expect(plan.applyLocally).toEqual([]);
  });

  it('prefers the newer format when the two devices run different versions', () => {
    const plan = planSync({ 'tradeschool.progress': progress({}, 1) }, { 'tradeschool.progress': progress({ activeDays: ['x'] }, 2) }, { 'tradeschool.progress': 'old' }, false);
    expect(plan.merged['tradeschool.progress'].version).toBe(2);
    expect(plan.combined).toEqual([]);
  });

  it('does nothing when both sides already agree', () => {
    const same: Snapshot = { 'tradeschool.settings': settings('dark') };
    const plan = planSync(same, { ...same }, { 'tradeschool.settings': fingerprint(same['tradeschool.settings']) }, false);
    expect(plan.upload).toBe(false);
    expect(plan.applyLocally).toEqual([]);
  });

  it('ignores stores it does not know', () => {
    const plan = planSync({ 'something.else': settings('dark') }, null, {}, true);
    expect(plan.merged).toEqual({});
    expect(plan.upload).toBe(false);
  });
});

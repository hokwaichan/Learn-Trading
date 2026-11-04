/**
 * Three-way merge of the saved stores between this browser and the cloud copy.
 *
 * Each sync remembers a fingerprint of every store as it was agreed at the end
 * of the last sync (the base). Comparing both sides with the base tells which
 * side changed a store since then:
 *
 * - neither, or both the same way: nothing to do;
 * - only one side: that side's copy wins;
 * - both: lesson progress and journal notes are merged entry by entry. For the
 *   other stores (balances, layouts, settings) a merge would not make sense, so
 *   this device's copy wins, except on the very first sync of a device, when
 *   the cloud copy is adopted.
 *
 * Pure: no storage, no network, so it is tested directly.
 */
import { BACKUP_KEYS } from '@/lib/backup';
import type { JournalNote, LessonProgress, ProgressState, ReviewCard } from '@/types';

export interface StoreEntry {
  state: unknown;
  version: number;
}

/** What zustand persists for each store, keyed by its storage key. */
export type Snapshot = Record<string, StoreEntry>;

/** Fingerprints of each store at the end of the last sync. */
export type Base = Record<string, string>;

export interface SyncPlan {
  /** The agreed copy of every store after this sync. */
  merged: Snapshot;
  /** Stores whose saved copy in this browser must be replaced by `merged`. */
  applyLocally: string[];
  /** Whether the cloud copy differs from `merged` and must be uploaded. */
  upload: boolean;
  /** Stores changed on both sides and combined entry by entry. */
  combined: string[];
  /** The base to remember for the next sync. */
  base: Base;
}

/** JSON with object keys sorted, so equal data always gives equal text. */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value as Record<string, unknown>)
    .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
}

/** A short, stable fingerprint of a store entry. Missing entries give ''. */
export function fingerprint(entry: StoreEntry | undefined): string {
  if (!entry) return '';
  const text = stableStringify(entry);
  // FNV-1a, 32-bit, plus the length: collisions are not a security concern here.
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `${(hash >>> 0).toString(36)}.${text.length.toString(36)}`;
}

const earliest = (a?: number, b?: number) => (a == null ? b : b == null ? a : Math.min(a, b));
const highest = (a?: number, b?: number) => (a == null ? b : b == null ? a : Math.max(a, b));
const union = (a: string[] = [], b: string[] = []) => [...new Set([...a, ...b])].sort();

function mergeLesson(a: LessonProgress | undefined, b: LessonProgress | undefined): LessonProgress {
  if (!a) return b!;
  if (!b) return a;
  const merged: LessonProgress = { attempts: Math.max(a.attempts ?? 0, b.attempts ?? 0) };
  const completedAt = earliest(a.completedAt, b.completedAt);
  const bestScore = highest(a.bestScore, b.bestScore);
  if (completedAt != null) merged.completedAt = completedAt;
  if (bestScore != null) merged.bestScore = bestScore;
  return merged;
}

/** The card reviewed most recently is the one whose schedule is current. */
function newerCard(a: ReviewCard | undefined, b: ReviewCard | undefined): ReviewCard {
  if (!a) return b!;
  if (!b) return a;
  const at = a.lastReviewedAt ?? 0;
  const bt = b.lastReviewedAt ?? 0;
  if (at !== bt) return at > bt ? a : b;
  return b.attempts > a.attempts ? b : a;
}

function mergeRecords<T>(a: Record<string, T> = {}, b: Record<string, T> = {}, pick: (x: T | undefined, y: T | undefined) => T): Record<string, T> {
  const out: Record<string, T> = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) out[key] = pick(a[key], b[key]);
  return out;
}

/** Combines lesson progress, trainer cards and study days from two devices. */
export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  const merged: ProgressState = {
    lessons: mergeRecords(local.lessons, remote.lessons, mergeLesson),
    activeDays: union(local.activeDays, remote.activeDays),
    challengeDays: union(local.challengeDays, remote.challengeDays),
    cards: mergeRecords(local.cards, remote.cards, newerCard),
  };
  const lastLesson = local.lastLesson ?? remote.lastLesson;
  if (lastLesson) merged.lastLesson = lastLesson;
  if (local.moduleTests || remote.moduleTests) {
    merged.moduleTests = mergeRecords(local.moduleTests, remote.moduleTests, (a, b) =>
      !a ? b! : !b ? a : { bestScore: Math.max(a.bestScore, b.bestScore), attempts: Math.max(a.attempts, b.attempts) },
    );
  }
  return merged;
}

/** Keeps the most recently edited note for each trade. */
export function mergeJournal(local: { notes: Record<string, JournalNote> }, remote: { notes: Record<string, JournalNote> }) {
  return { notes: mergeRecords(local.notes, remote.notes, (a, b) => (!a ? b! : !b ? a : b.updatedAt > a.updatedAt ? b : a)) };
}

const MERGERS: Record<string, (local: never, remote: never) => unknown> = {
  'tradeschool.progress': mergeProgress,
  'tradeschool.journal': mergeJournal,
};

/**
 * Decides the agreed copy of every store. `remote` is null when the cloud has
 * nothing yet. `firstSync` is true when this browser has never synced.
 */
export function planSync(local: Snapshot, remote: Snapshot | null, base: Base, firstSync: boolean): SyncPlan {
  const merged: Snapshot = {};
  const applyLocally: string[] = [];
  const combined: string[] = [];
  const nextBase: Base = {};
  let upload = false;

  for (const key of BACKUP_KEYS) {
    const l = local[key];
    const r = remote?.[key];
    const lf = fingerprint(l);
    const rf = fingerprint(r);
    const bf = firstSync ? undefined : base[key];
    let result: StoreEntry | undefined;

    if (lf === rf) result = l ?? r;
    else if (!r) result = l;
    else if (!l) result = r;
    else if (rf === bf) result = l;
    else if (lf === bf) result = r;
    else if (l.version !== r.version) result = r.version > l.version ? r : l;
    else if (MERGERS[key]) {
      result = { state: MERGERS[key](l.state as never, r.state as never), version: l.version };
      combined.push(key);
    } else result = firstSync ? r : l;

    if (!result) continue;
    merged[key] = result;
    const mf = fingerprint(result);
    nextBase[key] = mf;
    if (mf !== lf) applyLocally.push(key);
    if (mf !== rf) upload = true;
  }
  return { merged, applyLocally, upload, combined, base: nextBase };
}

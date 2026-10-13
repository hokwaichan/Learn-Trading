/**
 * Export and import of everything the app keeps in this browser, as one
 * JSON file. Each store persists itself under a `tradeschool.` key with its
 * own schema version, so a backup is simply those entries, and an imported
 * one is upgraded by the stores' usual migrations when the app reloads.
 */

export const BACKUP_APP = 'TradeSchool';
export const BACKUP_FORMAT = 1;

/** Stores included in a backup. Small view preferences (which tab was open) are left out. */
export const BACKUP_KEYS = [
  'tradeschool.settings',
  'tradeschool.account',
  'tradeschool.progress',
  'tradeschool.journal',
  'tradeschool.market',
  'tradeschool.drawings',
  'tradeschool.replay',
  'tradeschool.backtest',
] as const;

export interface BackupFile {
  app: typeof BACKUP_APP;
  format: number;
  exportedAt: string;
  /** One entry per store: what zustand persists, { state, version }. */
  data: Record<string, { state: unknown; version: number }>;
}

/** The subset of Storage the backup code needs, so it can be tested without a browser. */
export interface KeyValue {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Collects the saved stores into a backup. Stores that have never been saved are left out. */
export function createBackup(storage: KeyValue, now: Date = new Date()): BackupFile {
  const data: BackupFile['data'] = {};
  for (const key of BACKUP_KEYS) {
    const raw = storage.getItem(key);
    if (raw == null) continue;
    try {
      const parsed = JSON.parse(raw) as { state?: unknown; version?: unknown };
      if (parsed && typeof parsed === 'object' && parsed.state != null && typeof parsed.version === 'number') data[key] = { state: parsed.state, version: parsed.version };
    } catch {
      // A store that cannot be read is left out rather than failing the export.
    }
  }
  return { app: BACKUP_APP, format: BACKUP_FORMAT, exportedAt: now.toISOString(), data };
}

export type ParsedBackup = { ok: true; backup: BackupFile; stores: string[] } | { ok: false; error: string };

/** Checks that text is a backup this version can read. Unknown stores are dropped. */
export function parseBackup(text: string): ParsedBackup {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON. Choose a file exported from TradeSchool.' };
  }
  const file = value as Partial<BackupFile> | null;
  if (!file || typeof file !== 'object' || file.app !== BACKUP_APP || typeof file.data !== 'object' || file.data == null) {
    return { ok: false, error: 'That file is not a TradeSchool backup.' };
  }
  if (typeof file.format !== 'number' || file.format > BACKUP_FORMAT) {
    return { ok: false, error: 'That backup was made by a newer version of TradeSchool and cannot be read by this one.' };
  }
  const data: BackupFile['data'] = {};
  for (const key of BACKUP_KEYS) {
    const entry = (file.data as Record<string, unknown>)[key] as { state?: unknown; version?: unknown } | undefined;
    if (entry && typeof entry === 'object' && entry.state != null && typeof entry.state === 'object' && typeof entry.version === 'number') {
      data[key] = { state: entry.state, version: entry.version };
    }
  }
  const stores = Object.keys(data);
  if (stores.length === 0) return { ok: false, error: 'That backup is empty.' };
  return { ok: true, backup: { app: BACKUP_APP, format: file.format, exportedAt: typeof file.exportedAt === 'string' ? file.exportedAt : '', data }, stores };
}

/**
 * Replaces the saved stores with a backup's. Stores the backup does not
 * contain are cleared, so the result is exactly the backed-up state. The
 * app must be reloaded afterwards to pick it up.
 */
export function restoreBackup(storage: KeyValue, backup: BackupFile): void {
  for (const key of BACKUP_KEYS) {
    const entry = backup.data[key];
    if (entry) storage.setItem(key, JSON.stringify(entry));
    else storage.removeItem(key);
  }
}

/** Removes every saved store: a factory reset. */
export function clearAll(storage: KeyValue): void {
  for (const key of BACKUP_KEYS) storage.removeItem(key);
}

/** Plain names for the stores, for the import confirmation. */
export const STORE_NAMES: Record<(typeof BACKUP_KEYS)[number], string> = {
  'tradeschool.settings': 'Settings',
  'tradeschool.account': 'Paper and replay accounts',
  'tradeschool.progress': 'Lesson and trainer progress',
  'tradeschool.journal': 'Journal notes',
  'tradeschool.market': 'Chart layouts and watchlist',
  'tradeschool.drawings': 'Chart drawings',
  'tradeschool.replay': 'Replay set-up',
  'tradeschool.backtest': 'Backtester strategies',
};

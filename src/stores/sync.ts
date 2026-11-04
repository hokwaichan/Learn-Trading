import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { t } from '@/i18n';
import { BACKUP_APP, BACKUP_FORMAT, createBackup, parseBackup, type BackupFile } from '@/lib/backup';
import { planSync, type Base } from '@/lib/sync/merge';
import { useAccount } from './account';
import { useBacktest } from './backtest';
import { useDrawings } from './drawings';
import { useJournal } from './journal';
import { useMarket } from './market';
import { useProgress } from './progress';
import { useReplay } from './replay';
import { useSettings } from './settings';

/**
 * Optional cloud sync through Neon: Neon Auth signs the user in, and the Neon
 * Data API stores one row per user in the `progress` table, which row-level
 * security limits to its owner. The row holds a backup file (see lib/backup),
 * and lib/sync/merge decides how to combine it with this browser's copy.
 *
 * Nothing here touches the network until the user signs in, and the SDK is
 * loaded only then.
 */

/** The Neon database URL without credentials. Empty turns sync off. */
export const SYNC_URL: string = import.meta.env.VITE_NEON_URL ?? 'https://ep-dawn-rice-azxeoa3i.c-3.ap-southeast-1.aws.neon.tech/neondb';

/**
 * Neon Auth keeps the session in a cookie. Served from another site (GitHub
 * Pages), browsers that block third-party cookies drop it, so where the host
 * can proxy (Vercel, see vercel.json) the app reaches Neon Auth through its
 * own origin at `api/auth` and the cookie becomes first-party.
 */
const AUTH_PROXY = import.meta.env.VITE_NEON_AUTH_PROXY === '1';

/** Turns the database URL into the Neon Auth and Data API URLs, as the SDK does. */
function endpoints() {
  const url = new URL(SYNC_URL);
  const [endpoint, ...rest] = url.hostname.split('.');
  const host = (label: string) => [endpoint, label, ...rest].join('.');
  return {
    auth: AUTH_PROXY ? new URL(`${import.meta.env.BASE_URL}api/auth`, window.location.origin).href : `${url.protocol}//${host('neonauth')}${url.pathname}/auth`,
    dataApi: `${url.protocol}//${host('apirest')}${url.pathname}/rest/v1`,
  };
}

/** How often a signed-in, visible app syncs on its own. */
const AUTO_SYNC_MS = 5 * 60_000;

const STORES = {
  'tradeschool.settings': useSettings,
  'tradeschool.account': useAccount,
  'tradeschool.progress': useProgress,
  'tradeschool.journal': useJournal,
  'tradeschool.market': useMarket,
  'tradeschool.drawings': useDrawings,
  'tradeschool.replay': useReplay,
  'tradeschool.backtest': useBacktest,
} as const;

type Client = ReturnType<typeof import('@neon/neon-js').createClient>;
let clientPromise: Promise<Client> | null = null;

function client(): Promise<Client> {
  clientPromise ??= import('@neon/neon-js').then(({ createClient }) => {
    const { auth, dataApi } = endpoints();
    return createClient({ auth: { url: auth }, dataApi: { url: dataApi } });
  });
  return clientPromise;
}

export type SyncStatus = 'idle' | 'syncing' | 'error';

interface SyncData {
  /** The signed-in account, or undefined when signed out. */
  email?: string;
  lastSyncedAt?: number;
  /** Fingerprints of every store at the last sync; undefined before the first. */
  base?: Base;
}

interface SyncStore extends SyncData {
  status: SyncStatus;
  error?: string;
  signIn: (email: string, password: string, create: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Syncs now. Returns an error message, or null on success. */
  sync: () => Promise<string | null>;
  /** Deletes the cloud copy. This browser keeps its data. */
  deleteCloudCopy: () => Promise<string | null>;
}

const message = (error: unknown) => (error instanceof Error ? error.message : typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : String(error));

let running: Promise<string | null> | null = null;

export const useSync = create<SyncStore>()(
  persist(
    (set, get) => ({
      status: 'idle',

      signIn: async (email, password, createAccount) => {
        if (!SYNC_URL) return t('Sync is not set up in this copy of TradeSchool.');
        set({ status: 'syncing', error: undefined });
        try {
          const c = await client();
          const result = createAccount
            ? await c.auth.signUp.email({ email, password, name: email.split('@')[0] || email })
            : await c.auth.signIn.email({ email, password });
          if (result.error) {
            set({ status: 'idle' });
            return result.error.message || t('Could not sign in.');
          }
          // The session lives in a cookie on Neon's domain. Browsers that block cookies from other
          // sites (Safari, and every browser on iPhone and iPad) drop it straight away.
          if (!(await c.auth.getSession()).data?.session) {
            set({ status: 'idle' });
            return t('This browser blocked the sign-in, so it cannot sync. Safari and every browser on iPhone and iPad block it on this site. Use Chrome, Edge or Firefox on a computer or Android, or move your data with Export and Import below.');
          }
          // A different account starts from a clean slate: its cloud copy is unrelated to the last one.
          if (get().email !== email) set({ base: undefined, lastSyncedAt: undefined });
          set({ email, status: 'idle' });
        } catch (error) {
          set({ status: 'idle' });
          return message(error);
        }
        return get().sync();
      },

      signOut: async () => {
        try {
          await (await client()).auth.signOut();
        } catch {
          // Signing out locally is enough; the session expires on its own.
        }
        set({ email: undefined, base: undefined, lastSyncedAt: undefined, status: 'idle', error: undefined });
      },

      sync: () => {
        running ??= runSync().finally(() => {
          running = null;
        });
        return running;
      },

      deleteCloudCopy: async () => {
        try {
          const c = await client();
          const { error } = await c.from('progress').delete().not('user_id', 'is', null);
          if (error) return message(error);
          set({ base: undefined, lastSyncedAt: undefined });
          return null;
        } catch (error) {
          return message(error);
        }
      },
    }),
    {
      name: 'tradeschool.sync',
      version: 1,
      partialize: ({ email, lastSyncedAt, base }) => ({ email, lastSyncedAt, base }),
    },
  ),
);

async function runSync(attempt = 0): Promise<string | null> {
  const { email, base } = useSync.getState();
  if (!email || !SYNC_URL) return null;
  useSync.setState({ status: 'syncing', error: undefined });
  const fail = (error: string) => {
    useSync.setState({ status: 'error', error });
    return error;
  };
  try {
    const c = await client();
    const session = await c.auth.getSession();
    if (!session.data?.session) {
      useSync.setState({ email: undefined, base: undefined, status: 'idle' });
      return fail(t('You were signed out. Sign in again to keep syncing.'));
    }

    const { data: row, error: readError } = await c.from('progress').select('data, updated_at').maybeSingle();
    if (readError) return fail(message(readError));
    let remote: BackupFile['data'] | null = null;
    if (row) {
      const parsed = parseBackup(JSON.stringify(row.data));
      if (parsed.ok) remote = parsed.backup.data;
    }

    const plan = planSync(createBackup(localStorage).data, remote, base ?? {}, base == null);

    if (plan.upload) {
      const file: BackupFile = { app: BACKUP_APP, format: BACKUP_FORMAT, exportedAt: new Date().toISOString(), data: plan.merged };
      const updatedAt = new Date().toISOString();
      if (row) {
        // Only replace the copy that was read, so two devices syncing at once cannot overwrite each other.
        const { data: written, error } = await c.from('progress').update({ data: file, updated_at: updatedAt }).eq('updated_at', row.updated_at).select('updated_at');
        if (error) return fail(message(error));
        if (!written?.length) {
          if (attempt < 2) return runSync(attempt + 1);
          return fail(t('Another device was syncing at the same moment. Try again.'));
        }
      } else {
        const { error } = await c.from('progress').insert({ data: file, updated_at: updatedAt });
        if (error) return fail(message(error));
      }
    }

    for (const key of plan.applyLocally) {
      localStorage.setItem(key, JSON.stringify(plan.merged[key]));
      await STORES[key as keyof typeof STORES]?.persist.rehydrate();
    }
    useSync.setState({ base: plan.base, lastSyncedAt: Date.now(), status: 'idle', error: undefined });
    return null;
  } catch (error) {
    return fail(message(error));
  }
}

/** Starts syncing on its own while signed in: soon after opening, every few minutes, and when the app is put away. */
export function startAutoSync(): () => void {
  const maybe = () => {
    if (useSync.getState().email && navigator.onLine !== false) void useSync.getState().sync();
  };
  const first = window.setTimeout(maybe, 2000);
  const every = window.setInterval(() => {
    if (document.visibilityState === 'visible') maybe();
  }, AUTO_SYNC_MS);
  const onHide = () => {
    if (document.visibilityState === 'hidden') maybe();
  };
  document.addEventListener('visibilitychange', onHide);
  return () => {
    window.clearTimeout(first);
    window.clearInterval(every);
    document.removeEventListener('visibilitychange', onHide);
  };
}

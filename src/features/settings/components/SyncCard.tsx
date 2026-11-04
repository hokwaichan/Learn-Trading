import { useState, type FormEvent, type MouseEvent } from 'react';
import { CloudOff, LogOut, RefreshCw } from 'lucide-react';
import { Button, Card, ConfirmDialog, Input, toast } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { SYNC_URL, useSync } from '@/stores/sync';

/** Optional sign-in that keeps progress, journal and accounts the same on every device. */
export function SyncCard() {
  const { email, lastSyncedAt, status, error, signIn, signOut, sync, deleteCloudCopy } = useSync();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const busy = status === 'syncing';

  if (!SYNC_URL) return null;

  const submit = async (event: FormEvent | MouseEvent, create: boolean) => {
    event.preventDefault();
    const address = form.email.trim();
    if (!/^\S+@\S+\.\S+$/.test(address)) return setFormError(t('Enter an email address.'));
    if (form.password.length < 8) return setFormError(t('Use a password of at least 8 characters.'));
    setFormError(null);
    const problem = await signIn(address, form.password, create);
    if (problem) return setFormError(problem);
    setForm({ email: '', password: '' });
    toast.success(create ? t('Account created') : t('Signed in'), t('This device is now synced.'));
  };

  const syncNow = async () => {
    const problem = await sync();
    if (problem) toast.error(t('Could not sync'), problem);
    else toast.success(t('Synced'));
  };

  const removeCloudCopy = async () => {
    setDeleting(false);
    const problem = await deleteCloudCopy();
    if (problem) return toast.error(t('Could not delete'), problem);
    await signOut();
    toast.success(t('Cloud copy deleted'), t('Everything is still saved in this browser.'));
  };

  if (!email) {
    return (
      <Card title={t('Sync between devices')}>
        <p className="text-sm text-muted">
          {t('Optional. Sign in to keep your lesson progress, quiz scores, trainer history, journal notes, paper accounts and settings the same on your phone, tablet and computer. Your copy is stored with Neon, and only your account can read it.')}
        </p>
        <form className="mt-4 grid max-w-md gap-3" onSubmit={(e) => void submit(e, false)} noValidate>
          <Input label={t('Email')} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input
            label={t('Password')}
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={formError ?? undefined}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? t('Signing in…') : t('Sign in')}
            </Button>
            <Button type="button" disabled={busy} onClick={(e) => void submit(e, true)}>
              {t('Create an account')}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-muted">{t('Without an account nothing leaves this browser. You can also move your data by hand with Export below.')}</p>
      </Card>
    );
  }

  return (
    <Card title={t('Sync between devices')}>
      <p className="text-sm">
        {t('Signed in as {email}.', { email })}{' '}
        <span className="text-muted">
          {status === 'syncing'
            ? t('Syncing…')
            : lastSyncedAt
              ? t('Last synced {time}.', { time: new Date(lastSyncedAt).toLocaleString(intlLocale()) })
              : t('Not synced yet.')}
        </span>
      </p>
      {status === 'error' && error && (
        <p role="alert" className="mt-2 text-sm text-down-text">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-muted">
        {t('This device syncs on its own when you open the app, every few minutes, and when you leave it. Progress and journal notes from both devices are combined; for other things the most recent change is kept.')}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" icon={<RefreshCw aria-hidden className="size-4" />} disabled={busy} onClick={() => void syncNow()}>
          {t('Sync now')}
        </Button>
        <Button icon={<LogOut aria-hidden className="size-4" />} disabled={busy} onClick={() => void signOut()}>
          {t('Sign out')}
        </Button>
        <Button variant="danger" icon={<CloudOff aria-hidden className="size-4" />} disabled={busy} onClick={() => setDeleting(true)}>
          {t('Delete cloud copy')}
        </Button>
      </div>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => void removeCloudCopy()}
        title={t('Delete your cloud copy?')}
        confirmLabel={t('Delete cloud copy')}
      >
        <p>{t('This removes your synced data from Neon and signs this device out. Data saved in this browser and on your other devices stays where it is.')}</p>
      </ConfirmDialog>
    </Card>
  );
}

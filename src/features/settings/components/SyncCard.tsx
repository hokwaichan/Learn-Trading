import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';
import { CloudOff, LogOut, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button, Card, ConfirmDialog, Input, toast } from '@/components/ui';
import { intlLocale, t } from '@/i18n';
import { blockedMessage, SYNC_EVERYWHERE_URL, SYNC_URL, useSync } from '@/stores/sync';

type Mode = 'account' | 'reset-email' | 'reset-code';

const validEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

/** Optional account that keeps progress, journal and accounts the same on every device. */
export function SyncCard() {
  const { email, lastSyncedAt, status, error, signIn, signOut, sync, deleteCloudCopy, requestPasswordReset, resetPassword } = useSync();
  const [mode, setMode] = useState<Mode>('account');
  const [form, setForm] = useState({ email: '', password: '', code: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { hash } = useLocation();
  const busy = working || status === 'syncing';

  // The Home page links here with #sync. The layout moves focus to the page after each
  // navigation, so wait for that before putting it in the email field.
  useEffect(() => {
    if (hash !== '#sync') return;
    const timer = window.setTimeout(() => {
      document.getElementById('sync')?.scrollIntoView({ block: 'start' });
      document.getElementById('sync-email')?.focus({ preventScroll: true });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [hash]);

  if (!SYNC_URL) return null;

  const run = async (task: () => Promise<string | null>) => {
    setWorking(true);
    const problem = await task();
    setWorking(false);
    setFormError(problem);
    return problem;
  };

  const submit = async (event: FormEvent | MouseEvent, create: boolean) => {
    event.preventDefault();
    if (!validEmail(form.email)) return setFormError(t('Enter an email address.'));
    if (form.password.length < 8) return setFormError(t('Use a password of at least 8 characters.'));
    if (await run(() => signIn(form.email.trim(), form.password, create))) return;
    setForm({ email: '', password: '', code: '' });
    toast.success(create ? t('Account created') : t('Signed in'), t('Your progress is saved to your account.'));
  };

  const sendCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!validEmail(form.email)) return setFormError(t('Enter an email address.'));
    if (await run(() => requestPasswordReset(form.email.trim()))) return;
    setMode('reset-code');
    toast.info(t('Check your email'), t('If there is an account for {email}, a 6-digit code is on its way. It can take a minute; check spam too.', { email: form.email.trim() }));
  };

  const setNewPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(form.code.trim())) return setFormError(t('Enter the 6-digit code from the email.'));
    if (form.password.length < 8) return setFormError(t('Use a password of at least 8 characters.'));
    if (await run(() => resetPassword(form.email.trim(), form.code.trim(), form.password))) return;
    setForm({ email: '', password: '', code: '' });
    setMode('account');
    toast.success(t('Password changed'), t('You are signed in with your new password.'));
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormError(null);
    setForm((f) => ({ ...f, password: '', code: '' }));
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

  const emailField = (
    <Input
      id="sync-email"
      label={t('Email')}
      type="email"
      autoComplete="email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      error={mode === 'reset-email' ? (formError ?? undefined) : undefined}
    />
  );
  const blocked = formError === blockedMessage();

  if (!email) {
    return (
      <Card id="sync" title={t('Save your progress')} className="scroll-mt-4">
        <p className="text-sm text-muted">
          {t('Create a free account to keep your lesson progress, quiz scores, trainer history, journal notes, paper accounts and settings safe, and the same on your phone, tablet and computer. Your copy is stored with Neon, and only your account can read it.')}
        </p>

        {mode === 'account' && (
          <form className="mt-4 grid max-w-md gap-3" onSubmit={(e) => void submit(e, true)} noValidate>
            {emailField}
            <Input
              label={t('Password')}
              type="password"
              autoComplete="new-password"
              hint={t('At least 8 characters.')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={formError ?? undefined}
            />
            {blocked && SYNC_EVERYWHERE_URL && (
              <p className="text-sm">
                {t('Open TradeSchool at')}{' '}
                <a className="text-accent-text underline underline-offset-4" href={`${SYNC_EVERYWHERE_URL}/settings#sync`}>
                  {SYNC_EVERYWHERE_URL.replace('https://', '')}
                </a>{' '}
                {t('instead: accounts work there in every browser. To bring this browser’s progress along, use Export below and Import there.')}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? t('Please wait…') : t('Create an account')}
              </Button>
              <Button type="button" disabled={busy} onClick={(e) => void submit(e, false)}>
                {t('Sign in')}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={() => switchMode('reset-email')}>
                {t('Forgot password?')}
              </Button>
            </div>
          </form>
        )}

        {mode === 'reset-email' && (
          <form className="mt-4 grid max-w-md gap-3" onSubmit={(e) => void sendCode(e)} noValidate>
            <p className="text-sm">{t('Enter the email you signed up with, and we will send you a code to set a new password.')}</p>
            {emailField}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? t('Please wait…') : t('Send code')}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={() => switchMode('account')}>
                {t('Back')}
              </Button>
            </div>
          </form>
        )}

        {mode === 'reset-code' && (
          <form className="mt-4 grid max-w-md gap-3" onSubmit={(e) => void setNewPassword(e)} noValidate>
            <p className="text-sm">{t('We sent a 6-digit code to {email}. Enter it with your new password.', { email: form.email.trim() })}</p>
            <Input
              label={t('Code from the email')}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, '') })}
            />
            <Input
              label={t('New password')}
              type="password"
              autoComplete="new-password"
              hint={t('At least 8 characters.')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={formError ?? undefined}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? t('Please wait…') : t('Set new password')}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={(e) => void sendCode(e)}>
                {t('Send a new code')}
              </Button>
              <Button type="button" variant="ghost" disabled={busy} onClick={() => switchMode('account')}>
                {t('Back')}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-3 text-xs text-muted">{t('Without an account nothing leaves this browser. You can also move your data by hand with Export below.')}</p>
      </Card>
    );
  }

  return (
    <Card id="sync" title={t('Save your progress')} className="scroll-mt-4">
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

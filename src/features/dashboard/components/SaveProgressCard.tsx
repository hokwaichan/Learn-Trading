import { CloudUpload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IconButton } from '@/components/ui';
import { t } from '@/i18n';
import { SYNC_URL, useSync } from '@/stores/sync';

/** Suggests an account once there is progress worth keeping. Hidden after signing in or "Not now". */
export function SaveProgressCard({ hasProgress }: { hasProgress: boolean }) {
  const email = useSync((s) => s.email);
  const dismissed = useSync((s) => s.promptDismissed);
  const dismiss = useSync((s) => s.dismissPrompt);
  if (!SYNC_URL || email || dismissed || !hasProgress) return null;

  return (
    <section aria-labelledby="save-progress-title" className="flex flex-wrap items-center gap-3 rounded-card border border-accent/40 bg-accent/10 p-4">
      <CloudUpload aria-hidden className="size-5 shrink-0 text-accent-text" />
      <div className="min-w-0 flex-1">
        <h2 id="save-progress-title" className="text-sm font-semibold text-fg">
          {t('Save your progress')}
        </h2>
        <p className="text-sm text-muted">{t('Right now it is only in this browser. Create a free account to keep it safe and carry on from any device.')}</p>
      </div>
      <div className="flex items-center gap-1">
        <Link
          to="/settings#sync"
          className="inline-flex h-8 items-center rounded-control bg-accent px-3 text-sm font-semibold text-on-solid transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('Create an account')}
        </Link>
        <IconButton label={t('Not now')} icon={<X aria-hidden className="size-4" />} onClick={dismiss} />
      </div>
    </section>
  );
}

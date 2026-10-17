import { Compass } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';
import { Button, EmptyState, ErrorState } from '@/components/ui';
import { t } from '@/i18n';

export function NotFound() {
  return (
    <EmptyState
      className="h-full"
      icon={<Compass />}
      title={t('Page not found')}
      description={t('That address does not match any screen in TradeSchool.')}
      action={
        <Link to="/" className="text-sm text-accent-text underline underline-offset-4">
          {t('Back to Home')}
        </Link>
      }
    />
  );
}

/** Shown in place of a page that threw while rendering or loading. */
export function RouteError() {
  const error = useRouteError();
  const detail = error instanceof Error ? error.message : t('An unexpected error occurred.');
  return (
    <div className="grid h-full place-items-center">
      <div>
        <ErrorState title={t('This screen hit a problem')} message={detail} onRetry={() => window.location.reload()} />
        <div className="text-center">
          <Button variant="ghost" onClick={() => window.location.assign(import.meta.env.BASE_URL)}>
            {t('Go to Home')}
          </Button>
        </div>
      </div>
    </div>
  );
}

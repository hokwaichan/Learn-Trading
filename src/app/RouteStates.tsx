import { Compass } from 'lucide-react';
import { Link, useRouteError } from 'react-router-dom';
import { Button, EmptyState, ErrorState } from '@/components/ui';

export function NotFound() {
  return (
    <EmptyState
      className="h-full"
      icon={<Compass />}
      title="Page not found"
      description="That address does not match any screen in TradeSchool."
      action={
        <Link to="/" className="text-sm text-accent-text underline underline-offset-4">
          Back to Home
        </Link>
      }
    />
  );
}

/** Shown in place of a page that threw while rendering or loading. */
export function RouteError() {
  const error = useRouteError();
  const detail = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return (
    <div className="grid h-full place-items-center">
      <div>
        <ErrorState title="This screen hit a problem" message={detail} onRetry={() => window.location.reload()} />
        <div className="text-center">
          <Button variant="ghost" onClick={() => window.location.assign('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

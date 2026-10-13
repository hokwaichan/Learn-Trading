import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LoadingState, Toaster } from '@/components/ui';
import { CommandPalette } from './CommandPalette';
import { MobileTabBar } from './MobileTabBar';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

function Disclaimer() {
  return (
    <footer className="shrink-0 border-t border-border bg-surface px-3 py-1 text-center text-[11px] leading-tight text-muted">
      Educational only. Not financial advice. All trading here uses simulated money.
    </footer>
  );
}

/** App shell: sidebar, top bar, the routed page, disclaimer, and phone tab bar. */
export function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Move focus to the page on navigation so keyboard and screen-reader users
  // land in the new content rather than staying on the link they activated.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex h-full">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:rounded-control focus:bg-accent focus:px-3 focus:py-1.5 focus:text-sm focus:text-on-solid"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main" ref={mainRef} tabIndex={-1} className="min-h-0 flex-1 overflow-hidden focus-visible:outline-0">
          <Suspense fallback={<LoadingState className="h-full" />}>
            <Outlet />
          </Suspense>
        </main>
        <Disclaimer />
        <MobileTabBar />
      </div>
      <CommandPalette />
      <Toaster />
    </div>
  );
}

import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { DEFAULT_PERP_SYMBOL, DEFAULT_SPOT_SYMBOL } from '@/lib/data/instruments';
import { LoadingState } from '@/components/ui';
import { AppLayout } from './AppLayout';
import { NotFound, RouteError } from './RouteStates';

/** Each feature loads on first visit, through its index.ts only. */
function page<M>(load: () => Promise<M>, pick: (m: M) => ComponentType): RouteObject['lazy'] {
  return async () => ({ Component: pick(await load()) });
}

const routes: RouteObject[] = [
  { index: true, lazy: page(() => import('@/features/dashboard'), (m) => m.DashboardPage) },

  { path: 'learn', lazy: page(() => import('@/features/lessons'), (m) => m.LessonsPage) },
  { path: 'learn/:moduleId/:lessonId', lazy: page(() => import('@/features/lessons'), (m) => m.LessonsPage) },
  { path: 'trainer', lazy: page(() => import('@/features/trainer'), (m) => m.TrainerPage) },
  { path: 'glossary', lazy: page(() => import('@/features/glossary'), (m) => m.GlossaryPage) },

  { path: 'charts', element: <Navigate to={`/charts/${DEFAULT_SPOT_SYMBOL}`} replace /> },
  { path: 'charts/:symbol', lazy: page(() => import('@/features/workspace'), (m) => m.ChartsPage) },
  { path: 'futures', element: <Navigate to={`/futures/${DEFAULT_PERP_SYMBOL}`} replace /> },
  { path: 'futures/:symbol', lazy: page(() => import('@/features/workspace'), (m) => m.FuturesPage) },
  { path: 'options', element: <Navigate to={`/options/${DEFAULT_SPOT_SYMBOL}`} replace /> },
  { path: 'options/:symbol', lazy: page(() => import('@/features/options'), (m) => m.OptionsPage) },
  { path: 'replay', lazy: page(() => import('@/features/replay'), (m) => m.ReplayPage) },

  { path: 'backtest', lazy: page(() => import('@/features/backtester'), (m) => m.BacktesterPage) },
  { path: 'journal', lazy: page(() => import('@/features/journal'), (m) => m.JournalPage) },
  { path: 'journal/:tradeId', lazy: page(() => import('@/features/journal'), (m) => m.JournalPage) },
  { path: 'analytics', lazy: page(() => import('@/features/analytics'), (m) => m.AnalyticsPage) },

  { path: 'tools', lazy: page(() => import('@/features/tools'), (m) => m.ToolsPage) },
  { path: 'settings', lazy: page(() => import('@/features/settings'), (m) => m.SettingsPage) },

  { path: 'dev/components', lazy: page(() => import('./ComponentGallery'), (m) => m.ComponentGallery) },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    // Shown for the instant before the first lazy-loaded page arrives.
    hydrateFallbackElement: <LoadingState className="h-dvh" />,
    children: [{ errorElement: <RouteError />, children: routes }],
  },
]);

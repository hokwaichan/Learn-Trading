import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMigrate } from '@/lib/migrate';
import type { Settings } from '@/types';

export const SETTINGS_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  colorBlind: false,
  feeRate: 0.001,
  slippagePct: 0.0005,
  riskFreeRate: 0.04,
  sidebarCollapsed: false,
};

interface SettingsStore extends Settings {
  update: (patch: Partial<Settings>) => void;
  toggleTheme: () => void;
  reset: () => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => set(patch),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      // index.html reads this key before first paint to avoid a theme flash.
      name: 'tradeschool.settings',
      version: SETTINGS_VERSION,
      migrate: createMigrate<Settings>(SETTINGS_VERSION, DEFAULT_SETTINGS) as (p: unknown, v: number) => SettingsStore,
      partialize: ({ update: _u, toggleTheme: _t, reset: _r, ...data }) => data,
    },
  ),
);

function applyToDocument(s: Settings) {
  const root = document.documentElement;
  root.dataset.theme = s.theme;
  if (s.colorBlind) root.dataset.cb = 'true';
  else delete root.dataset.cb;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', s.theme === 'dark' ? '#0B0E14' : '#F7F8FA');
}

if (typeof document !== 'undefined') {
  applyToDocument(useSettings.getState());
  useSettings.subscribe(applyToDocument);
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectLocale, htmlLang, type Locale } from '@/i18n';
import { createMigrate } from '@/lib/migrate';
import type { Settings } from '@/types';

export const SETTINGS_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  locale: detectLocale(),
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
  /** Switches language. The page reloads so every screen and lesson is drawn in it. */
  setLocale: (locale: Locale) => void;
  reset: () => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => set(patch),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setLocale: (locale) => {
        set({ locale });
        // The store has already been written to localStorage; the reload picks it up.
        window.location.reload();
      },
      // Resetting settings keeps the language: a reader should not lose a language they can read.
      reset: () => set((s) => ({ ...DEFAULT_SETTINGS, locale: s.locale })),
    }),
    {
      // index.html reads this key before first paint to avoid a theme flash.
      name: 'tradeschool.settings',
      version: SETTINGS_VERSION,
      migrate: createMigrate<Settings>(SETTINGS_VERSION, DEFAULT_SETTINGS) as (p: unknown, v: number) => SettingsStore,
      partialize: ({ update: _u, toggleTheme: _t, setLocale: _l, reset: _r, ...data }) => data,
    },
  ),
);

function applyToDocument(s: Settings) {
  const root = document.documentElement;
  root.lang = htmlLang(s.locale);
  root.dataset.theme = s.theme;
  if (s.colorBlind) root.dataset.cb = 'true';
  else delete root.dataset.cb;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', s.theme === 'dark' ? '#0B0E14' : '#F7F8FA');
}

if (typeof document !== 'undefined') {
  applyToDocument(useSettings.getState());
  useSettings.subscribe(applyToDocument);
}

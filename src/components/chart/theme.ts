import { useMemo } from 'react';
import { useSettings } from '@/stores/settings';

export interface ChartTheme {
  background: string;
  text: string;
  grid: string;
  border: string;
  crosshair: string;
  up: string;
  down: string;
  accent: string;
  warning: string;
  /** Fixed six-colour palette for indicator lines. */
  series: string[];
}

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Reads the current theme's colours from the CSS variables in theme.css. */
export function readChartTheme(): ChartTheme {
  return {
    background: cssVar('--c-surface'),
    text: cssVar('--c-muted'),
    grid: cssVar('--c-grid'),
    border: cssVar('--c-border'),
    crosshair: cssVar('--c-muted'),
    up: cssVar('--c-up'),
    down: cssVar('--c-down'),
    accent: cssVar('--c-accent'),
    warning: cssVar('--c-warning'),
    series: [1, 2, 3, 4, 5, 6].map((i) => cssVar(`--c-series-${i}`)),
  };
}

/** Chart colours that update when the theme or colour-blind mode changes. */
export function useChartTheme(): ChartTheme {
  const theme = useSettings((s) => s.theme);
  const colorBlind = useSettings((s) => s.colorBlind);
  // The settings store applies the data-theme attribute before React re-renders,
  // so the variables already hold the new values when this runs.
  return useMemo(readChartTheme, [theme, colorBlind]);
}

/** '#rrggbb' plus an alpha from 0 to 1 -> '#rrggbbaa'. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}${a}` : hex;
}

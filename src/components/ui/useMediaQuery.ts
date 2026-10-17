import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True below Tailwind's md breakpoint, where panels become bottom sheets. */
export function useIsPhone(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * True below Tailwind's lg breakpoint: phones and tablets held upright. The
 * chart workspace moves its panels into bottom sheets here, because a side
 * panel would leave the chart too narrow to read.
 */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

/** True when the main pointer cannot hover (a finger), so hover-only hints need a tap instead. */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none)');
}

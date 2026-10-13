import { useCallback, useState } from 'react';

/** useState that remembers its value in localStorage under `tradeschool.ui.<key>`. */
export function usePersistentState<T>(key: string, initial: T): [T, (value: T) => void] {
  const storageKey = `tradeschool.ui.${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw == null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });
  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Storage unavailable: the value still applies for this visit.
      }
    },
    [storageKey],
  );
  return [value, update];
}

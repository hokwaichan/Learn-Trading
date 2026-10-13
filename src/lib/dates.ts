const DAY_MS = 86_400_000;

/** Local calendar date as YYYY-MM-DD. */
export function dayKey(date: Date | number = new Date()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function parseDayKey(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole days from one YYYY-MM-DD key to another. */
export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round((parseDayKey(toKey) - parseDayKey(fromKey)) / DAY_MS);
}

/**
 * Consecutive active days ending today. A streak survives until the end of
 * the next day: if the last active day was yesterday it still counts.
 */
export function currentStreak(activeDays: string[], today: string = dayKey()): number {
  if (activeDays.length === 0) return 0;
  const days = [...new Set(activeDays)].sort();
  const last = days[days.length - 1];
  if (daysBetween(last, today) > 1 || daysBetween(last, today) < 0) return 0;
  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    if (daysBetween(days[i - 1], days[i]) !== 1) break;
    streak++;
  }
  return streak;
}

/** Start of the local day containing `time`, in ms. */
export function startOfLocalDay(time: number = Date.now()): number {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

import type { Candle } from '@/types';

/**
 * Trading sessions and intraday reference levels.
 *
 * Session times are defined in New York time, because that is how day
 * traders quote them, and converted properly, so they shift by an hour
 * against UTC when US daylight saving starts and ends.
 */

export interface SessionDefinition {
  id: string;
  name: string;
  /** Start and end as minutes after midnight, New York time. An end before the start runs past midnight. */
  start: number;
  end: number;
}

const hm = (hours: number, minutes = 0) => hours * 60 + minutes;

/** The three main sessions of the trading day. They overlap on purpose. */
export const SESSIONS: SessionDefinition[] = [
  { id: 'asia', name: 'Asia', start: hm(19), end: hm(4) },
  { id: 'london', name: 'London', start: hm(3), end: hm(12) },
  { id: 'new-york', name: 'New York', start: hm(8), end: hm(17) },
];

/**
 * ICT "kill zones": the windows inside each session when the largest moves
 * of the day tend to start. Times are the commonly taught ones; teachers
 * differ by half an hour either way.
 */
export const KILL_ZONES: SessionDefinition[] = [
  { id: 'asia-kz', name: 'Asian kill zone', start: hm(20), end: hm(0) },
  { id: 'london-kz', name: 'London kill zone', start: hm(2), end: hm(5) },
  { id: 'ny-kz', name: 'New York kill zone', start: hm(7), end: hm(10) },
  { id: 'london-close-kz', name: 'London close', start: hm(10), end: hm(12) },
];

const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' });

/** Minutes after midnight and the calendar date in New York for a time. */
export function newYorkTime(timeMs: number): { minutes: number; date: string } {
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(timeMs)) parts[part.type] = part.value;
  // Some engines print midnight as hour 24.
  const hour = Number(parts.hour) % 24;
  return { minutes: hour * 60 + Number(parts.minute), date: `${parts.year}-${parts.month}-${parts.day}` };
}

/** Whether a New York time of day falls inside a session. */
export function inSession(session: SessionDefinition, minutes: number): boolean {
  return session.start <= session.end ? minutes >= session.start && minutes < session.end : minutes >= session.start || minutes < session.end;
}

/** The sessions (or kill zones) open at a time. */
export function sessionsAt(timeMs: number, definitions: SessionDefinition[] = SESSIONS): SessionDefinition[] {
  const { minutes } = newYorkTime(timeMs);
  return definitions.filter((s) => inSession(s, minutes));
}

export interface SessionRange {
  session: SessionDefinition;
  /** Open time of the first and last candle in it, in seconds. */
  from: number;
  to: number;
  high: number;
  low: number;
}

/**
 * Each occurrence of each session in a list of intraday candles, with its
 * high and low. A session is a run of consecutive candles inside its hours.
 */
export function sessionRanges(candles: Candle[], definitions: SessionDefinition[] = SESSIONS): SessionRange[] {
  const ranges: SessionRange[] = [];
  const open = new Map<string, SessionRange>();
  for (const candle of candles) {
    const { minutes } = newYorkTime(candle.time * 1000);
    for (const session of definitions) {
      const current = open.get(session.id);
      if (inSession(session, minutes)) {
        if (current) {
          current.to = candle.time;
          current.high = Math.max(current.high, candle.high);
          current.low = Math.min(current.low, candle.low);
        } else {
          const range = { session, from: candle.time, to: candle.time, high: candle.high, low: candle.low };
          open.set(session.id, range);
          ranges.push(range);
        }
      } else if (current) {
        open.delete(session.id);
      }
    }
  }
  return ranges;
}

const DAY = 86_400;
const dayOf = (time: number) => Math.floor(time / DAY);

export interface DayLevels {
  /** UTC day number of the day these levels belong to. */
  day: number;
  /** Open time of the first candle of the day, in seconds. */
  from: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Open, high, low and close of each UTC day in a list of candles. */
export function dailyLevels(candles: Candle[]): DayLevels[] {
  const days: DayLevels[] = [];
  for (const c of candles) {
    const day = dayOf(c.time);
    const last = days[days.length - 1];
    if (last && last.day === day) {
      last.high = Math.max(last.high, c.high);
      last.low = Math.min(last.low, c.low);
      last.close = c.close;
    } else {
      days.push({ day, from: c.time, open: c.open, high: c.high, low: c.low, close: c.close });
    }
  }
  return days;
}

type Line = (number | null)[];

/**
 * For every candle, the high, low and close of the day before it (UTC
 * days). On daily candles that is simply the previous candle. Null on the
 * first day, which has no day before it.
 */
export function previousDayLevels(candles: Candle[]): { high: Line; low: Line; close: Line } {
  const days = dailyLevels(candles);
  const before = new Map<number, DayLevels>();
  for (let i = 1; i < days.length; i++) before.set(days[i].day, days[i - 1]);
  const pick = (key: 'high' | 'low' | 'close'): Line => candles.map((c) => before.get(dayOf(c.time))?.[key] ?? null);
  return { high: pick('high'), low: pick('low'), close: pick('close') };
}

/**
 * The opening range: the high and low of the first `minutes` of each day,
 * counted from `startHour` (UTC). The lines appear once the range is
 * complete and last until the next day's range begins; before that they are
 * null, so a rule cannot use a range that has not finished forming.
 *
 * Needs candles shorter than the range itself; returns nulls otherwise.
 */
export function openingRange(candles: Candle[], stepSeconds: number, minutes = 60, startHour = 0): { high: Line; low: Line } {
  const high: Line = candles.map(() => null);
  const low: Line = candles.map(() => null);
  const length = minutes * 60;
  if (!(stepSeconds > 0) || stepSeconds > length || stepSeconds >= DAY) return { high, low };
  const offset = startHour * 3600;
  let session = -1;
  let rangeHigh = -Infinity;
  let rangeLow = Infinity;
  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const day = Math.floor((c.time - offset) / DAY);
    const into = c.time - offset - day * DAY;
    if (day !== session) {
      session = day;
      rangeHigh = -Infinity;
      rangeLow = Infinity;
    }
    if (into < length) {
      rangeHigh = Math.max(rangeHigh, c.high);
      rangeLow = Math.min(rangeLow, c.low);
    } else if (Number.isFinite(rangeHigh)) {
      high[i] = rangeHigh;
      low[i] = rangeLow;
    }
  }
  return { high, low };
}

/**
 * Donchian channel: the highest high and lowest low of the `period` candles
 * before each candle. The current candle is left out, so a close above the
 * upper line is a genuine new high.
 */
export function donchian(candles: Candle[], period: number): { upper: Line; lower: Line; middle: Line } {
  const upper: Line = candles.map(() => null);
  const lower: Line = candles.map(() => null);
  const middle: Line = candles.map(() => null);
  if (period < 1) return { upper, lower, middle };
  for (let i = period; i < candles.length; i++) {
    let hi = -Infinity;
    let lo = Infinity;
    for (let k = i - period; k < i; k++) {
      hi = Math.max(hi, candles[k].high);
      lo = Math.min(lo, candles[k].low);
    }
    upper[i] = hi;
    lower[i] = lo;
    middle[i] = (hi + lo) / 2;
  }
  return { upper, lower, middle };
}

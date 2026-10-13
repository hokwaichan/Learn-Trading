import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { describeDataError, findInstrument, mergeCandles, TIMEFRAME_SECONDS } from '@/lib/data';
import { createMigrate } from '@/lib/migrate';
import { closeTimeMs, CONTEXT_CANDLES, finishedCandles, indexAtOrAfter, indexAtOrBefore, replayPrices } from '@/lib/replay/session';
import type { EngineEvent, Prices } from '@/lib/trading/engine';
import type { Candle, Instrument, Timeframe } from '@/types';
import { useAccount } from './account';
import { fetchCandleRange } from './market';

export const REPLAY_VERSION = 1;
const PAGE = 1000;
/** Fetch more history when this few candles are left ahead of the cursor. */
const REFILL_AT = 150;

export const REPLAY_SPEEDS = [1, 2, 5, 10, 20] as const;

interface Session {
  symbol: string;
  timeframe: Timeframe;
  /** Open time (seconds) of the newest candle shown. Saved so a reload carries on from here. */
  cursorTime: number;
}

interface ReplayData {
  symbol: string;
  timeframe: Timeframe;
  /** Start date as YYYY-MM-DD. */
  startDate: string;
  /** Candles per second while playing. */
  speed: number;
  session: Session | null;
}

interface ReplayStore extends ReplayData {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string;
  /** Every candle loaded so far, including ones not yet revealed. Read through visibleCandles() only. */
  candles: Candle[];
  /** Position in `candles` of the newest candle shown. */
  cursor: number;
  playing: boolean;
  /** True when there is no more history to reveal. */
  atEnd: boolean;
  /** Counts sessions opened, so the chart can reset its view for each one. */
  runId: number;
  configure: (patch: Partial<Pick<ReplayData, 'symbol' | 'timeframe' | 'startDate' | 'speed'>>) => void;
  /** Starts a new session at the configured symbol, timeframe and date. */
  start: () => Promise<void>;
  /** After a reload, carries on the saved session. */
  resume: () => Promise<void>;
  /** Reveals `count` more candles. Returns what happened to orders and positions. */
  step: (count?: number) => EngineEvent[];
  /** Moves forward to a date inside the loaded history. Returns false if the date is not ahead and loaded. */
  jumpTo: (date: string) => boolean;
  setPlaying: (playing: boolean) => void;
  end: () => void;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

const DEFAULTS: ReplayData = { symbol: 'BTCUSDT', timeframe: '1h', startDate: daysAgo(90), speed: 2, session: null };

const dateSeconds = (date: string) => Date.parse(`${date}T00:00:00Z`) / 1000;

/** Loads the candles before a point (for context) and after it (to replay). */
async function loadAround(instrument: Instrument, timeframe: Timeframe, fromSeconds: number) {
  const step = TIMEFRAME_SECONDS[timeframe];
  const [before, after] = await Promise.all([
    fetchCandleRange(instrument, timeframe, { to: fromSeconds * 1000 - 1, limit: CONTEXT_CANDLES }),
    fetchCandleRange(instrument, timeframe, { from: fromSeconds * 1000, limit: PAGE }),
  ]);
  const candles = finishedCandles(mergeCandles(before, after), step, Date.now());
  return { candles, more: after.length >= PAGE };
}

let refilling = false;

export const useReplay = create<ReplayStore>()(
  persist(
    (set, get) => {
      const market = () => {
        const { session } = get();
        const instrument = session && findInstrument(session.symbol);
        return session && instrument ? { symbol: instrument.symbol, kind: instrument.kind, stepSeconds: TIMEFRAME_SECONDS[session.timeframe], instrument } : null;
      };

      /** Loads the next page of history when the cursor is getting close to the end of what is loaded. */
      const refill = async () => {
        const m = market();
        const { candles, cursor, atEnd, session } = get();
        if (!m || !session || atEnd || refilling || candles.length - cursor > REFILL_AT) return;
        refilling = true;
        try {
          const last = candles[candles.length - 1];
          const next = finishedCandles(
            await fetchCandleRange(m.instrument, session.timeframe, { from: (last.time + m.stepSeconds) * 1000, limit: PAGE }),
            m.stepSeconds,
            Date.now(),
          );
          // The session may have changed while this was loading.
          if (get().session !== session) return;
          set((s) => ({ candles: mergeCandles(s.candles, next), atEnd: next.length === 0 }));
        } catch {
          // Try again on a later step.
        } finally {
          refilling = false;
        }
      };

      const open = async (session: Session, fromSeconds: number, place: (candles: Candle[]) => number) => {
        const instrument = findInstrument(session.symbol);
        if (!instrument) return set({ status: 'error', error: `Unknown symbol ${session.symbol}.` });
        set({ status: 'loading', error: undefined, playing: false, candles: [], cursor: -1, atEnd: false });
        try {
          const { candles, more } = await loadAround(instrument, session.timeframe, fromSeconds);
          const cursor = place(candles);
          if (candles.length === 0 || cursor < 0) {
            return set({ status: 'error', error: 'There is no price history at that date. Try a later one.', session: null });
          }
          set({ status: 'ready', runId: get().runId + 1, candles, cursor, atEnd: !more && cursor >= candles.length - 1, session: { ...session, cursorTime: candles[cursor].time } });
        } catch (error) {
          set({ status: 'error', error: describeDataError(error) });
        }
      };

      return {
        ...DEFAULTS,
        status: 'idle',
        candles: [],
        cursor: -1,
        playing: false,
        atEnd: false,
        runId: 0,

        configure: (patch) => set(patch),

        async start() {
          const { symbol, timeframe, startDate, candles, cursor } = get();
          // Anything left open from the last session is closed at its last
          // replay price first: a new date is a new market.
          const previous = market();
          useAccount.getState().flatten('replay', previous ? replayPrices(previous, candles[cursor]) : {}, candles[cursor] && previous ? closeTimeMs(candles[cursor], previous.stepSeconds) : Date.now());
          const from = dateSeconds(startDate);
          // Begin on the last candle before the chosen date, so the first step reveals the first candle of that date.
          await open({ symbol, timeframe, cursorTime: from }, from, (loaded) => {
            const first = indexAtOrAfter(loaded, from);
            return first === -1 ? -1 : Math.max(0, first - 1);
          });
        },

        async resume() {
          const { session, status } = get();
          if (!session || status !== 'idle') return;
          await open(session, session.cursorTime, (loaded) => indexAtOrBefore(loaded, session.cursorTime));
        },

        step(count = 1) {
          const m = market();
          const { candles, cursor, session, status } = get();
          if (!m || !session || status !== 'ready') return [];
          const target = Math.min(cursor + count, candles.length - 1);
          if (target <= cursor) {
            if (get().atEnd) set({ playing: false });
            void refill();
            return [];
          }
          const result = useAccount.getState().replayAdvance(candles, cursor, target, m);
          set({
            cursor: result.cursor,
            session: { ...session, cursorTime: candles[result.cursor].time },
            playing: get().playing && !(get().atEnd && result.cursor >= candles.length - 1),
          });
          void refill();
          return result.events;
        },

        jumpTo(date) {
          const { candles, cursor } = get();
          const target = indexAtOrAfter(candles, dateSeconds(date));
          if (target === -1 || target - 1 <= cursor) return false;
          get().step(target - 1 - cursor);
          return true;
        },

        setPlaying: (playing) => set((s) => ({ playing: playing && s.status === 'ready' && !(s.atEnd && s.cursor >= s.candles.length - 1) })),

        end() {
          const m = market();
          const { candles, cursor } = get();
          useAccount.getState().flatten('replay', m ? replayPrices(m, candles[cursor]) : {}, candles[cursor] && m ? closeTimeMs(candles[cursor], m.stepSeconds) : Date.now());
          set({ status: 'idle', session: null, candles: [], cursor: -1, playing: false, atEnd: false, error: undefined });
        },
      };
    },
    {
      name: 'tradeschool.replay',
      version: REPLAY_VERSION,
      migrate: createMigrate<ReplayData>(REPLAY_VERSION, DEFAULTS) as (p: unknown, v: number) => ReplayStore,
      partialize: ({ symbol, timeframe, startDate, speed, session }) => ({ symbol, timeframe, startDate, speed, session }),
    },
  ),
);

// Lets the browser smoke test read the session. Development builds only.
if (import.meta.env.DEV && typeof window !== 'undefined') (window as unknown as { __replay?: typeof useReplay }).__replay = useReplay;

/** The price of the instrument being replayed: the close of the newest candle shown. */
export function replayPricesNow(state: Pick<ReplayStore, 'session' | 'candles' | 'cursor'>): Prices {
  const instrument = state.session && findInstrument(state.session.symbol);
  return instrument ? replayPrices(instrument, state.candles[state.cursor]) : {};
}

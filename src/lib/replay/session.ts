import { priceKey, processBar, type Bar, type EngineContext, type EngineEvent, type Prices } from '@/lib/trading/engine';
import type { Account, Candle, InstrumentKind } from '@/types';

/** Candles shown before the chosen start date, so indicators and context are there from the first step. */
export const CONTEXT_CANDLES = 300;

/** Position of the first candle that opens at or after `timeSeconds`, or -1 if there is none. */
export function indexAtOrAfter(candles: Candle[], timeSeconds: number): number {
  let lo = 0;
  let hi = candles.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (candles[mid].time < timeSeconds) lo = mid + 1;
    else hi = mid;
  }
  return lo < candles.length ? lo : -1;
}

/** Position of the last candle that opens at or before `timeSeconds`, or -1 if there is none. */
export function indexAtOrBefore(candles: Candle[], timeSeconds: number): number {
  const after = indexAtOrAfter(candles, timeSeconds);
  if (after === -1) return candles.length - 1;
  return candles[after].time === timeSeconds ? after : after - 1;
}

/** The moment a candle finishes, in milliseconds. Replay time is always the close of the newest visible candle. */
export function closeTimeMs(candle: Candle, stepSeconds: number): number {
  return (candle.time + stepSeconds) * 1000;
}

export function toBar(candle: Candle, stepSeconds: number): Bar {
  return { time: closeTimeMs(candle, stepSeconds), open: candle.open, high: candle.high, low: candle.low, close: candle.close };
}

/**
 * The candles a replay is allowed to show: everything up to and including
 * the cursor, and nothing after it. Every screen in Replay reads candles
 * through this, which is what keeps the future hidden.
 */
export function visibleCandles(candles: Candle[], cursor: number): Candle[] {
  return candles.slice(0, Math.max(0, cursor + 1));
}

/** Removes candles that have not finished yet, so a replay never shows a half-formed candle from the live market. */
export function finishedCandles(candles: Candle[], stepSeconds: number, nowMs: number): Candle[] {
  let end = candles.length;
  while (end > 0 && closeTimeMs(candles[end - 1], stepSeconds) > nowMs) end--;
  return end === candles.length ? candles : candles.slice(0, end);
}

export interface AdvanceResult {
  account: Account;
  cursor: number;
  events: EngineEvent[];
}

/**
 * Moves a replay forward from `cursor` to `target`, passing each newly
 * revealed candle to the trading engine in order. Orders placed while candle
 * N was the newest can therefore only fill on candle N + 1 or later.
 *
 * `contextAt` supplies fees, slippage and ids, with the clock set to the
 * close of the candle being processed.
 */
export function advance(
  account: Account,
  candles: Candle[],
  cursor: number,
  target: number,
  market: { symbol: string; kind: InstrumentKind; stepSeconds: number },
  contextAt: (nowMs: number) => EngineContext,
): AdvanceResult {
  const end = Math.min(target, candles.length - 1);
  const events: EngineEvent[] = [];
  let next = account;
  let at = cursor;
  while (at < end) {
    at++;
    const bar = toBar(candles[at], market.stepSeconds);
    const result = processBar(next, market.symbol, market.kind, bar, replayPrices(market, candles[at]), contextAt(bar.time));
    next = result.account;
    events.push(...result.events);
  }
  return { account: next, cursor: at, events };
}

/** In a replay the only price that exists is the close of the newest visible candle. */
export function replayPrices(market: { symbol: string; kind: InstrumentKind }, candle: Candle | undefined): Prices {
  return candle ? { [priceKey(market.kind, market.symbol)]: candle.close } : {};
}

import { describe, expect, it } from 'vitest';
import { createAccount } from '@/lib/trading/account';
import { placeOrder, type EngineContext } from '@/lib/trading/engine';
import type { Account, Candle } from '@/types';
import { advance, closeTimeMs, finishedCandles, indexAtOrAfter, indexAtOrBefore, replayPrices, toBar, visibleCandles } from './session';

const DAY = 86_400;
const k = (i: number, open: number, high: number, low: number, close: number): Candle => ({ time: i * DAY, open, high, low, close, volume: 1 });
const market = { symbol: 'TEST', kind: 'spot' as const, stepSeconds: DAY };

function contextAt(): (now: number) => EngineContext {
  let n = 0;
  return (now) => ({ now, feeRate: 0, slippagePct: 0, newId: () => `id${++n}` });
}

// Day:        0     1     2     3     4     5
const candles = [
  k(0, 100, 101, 99, 100),
  k(1, 100, 102, 99, 101),
  k(2, 101, 103, 100, 102),
  k(3, 102, 103, 94, 95), // drops through 96
  k(4, 95, 97, 93, 96),
  k(5, 96, 108, 95, 107), // rallies through 105
];

describe('finding a date', () => {
  it('finds the first candle at or after a time', () => {
    expect(indexAtOrAfter(candles, 2 * DAY)).toBe(2);
    expect(indexAtOrAfter(candles, 2 * DAY + 1)).toBe(3);
    expect(indexAtOrAfter(candles, -5)).toBe(0);
    expect(indexAtOrAfter(candles, 99 * DAY)).toBe(-1);
    expect(indexAtOrAfter([], 0)).toBe(-1);
  });

  it('finds the last candle at or before a time, skipping gaps such as weekends', () => {
    const gappy = [k(0, 1, 1, 1, 1), k(1, 1, 1, 1, 1), k(4, 1, 1, 1, 1)];
    expect(indexAtOrBefore(gappy, 3 * DAY)).toBe(1);
    expect(indexAtOrBefore(gappy, 4 * DAY)).toBe(2);
    expect(indexAtOrBefore(gappy, 99 * DAY)).toBe(2);
    expect(indexAtOrBefore(gappy, -1)).toBe(-1);
  });
});

describe('hiding the future', () => {
  it('shows candles up to the cursor and none after it', () => {
    expect(visibleCandles(candles, 2).map((c) => c.time)).toEqual([0, DAY, 2 * DAY]);
    expect(visibleCandles(candles, 0)).toHaveLength(1);
    expect(visibleCandles(candles, -1)).toEqual([]);
    expect(visibleCandles(candles, 99)).toHaveLength(6);
  });

  it('prices everything at the close of the newest visible candle', () => {
    expect(replayPrices(market, candles[2])).toEqual({ 'spot:TEST': 102 });
    expect(replayPrices(market, undefined)).toEqual({});
  });

  it('puts replay time at the close of a candle', () => {
    expect(closeTimeMs(candles[2], DAY)).toBe(3 * DAY * 1000);
    expect(toBar(candles[3], DAY)).toEqual({ time: 4 * DAY * 1000, open: 102, high: 103, low: 94, close: 95 });
  });

  it('drops a candle from the live market that has not finished', () => {
    const now = 5.5 * DAY * 1000; // half way through day 5
    expect(finishedCandles(candles, DAY, now)).toHaveLength(5);
    expect(finishedCandles(candles, DAY, 6 * DAY * 1000)).toBe(candles);
    expect(finishedCandles(candles, DAY, 0)).toEqual([]);
  });
});

describe('advancing a replay', () => {
  const ctx = contextAt();
  /** A long of 10 opened at the close of day 2 (102), with a stop at 96 and a target at 105. */
  const withLong = (c = ctx): Account =>
    placeOrder(createAccount('replay', 0), { symbol: 'TEST', kind: 'spot', side: 'buy', type: 'market', quantity: 10, stopLoss: 96, takeProfit: 105 }, 102, replayPrices(market, candles[2]), c(closeTimeMs(candles[2], DAY))).account;

  it('does nothing when there is nowhere to go', () => {
    const account = withLong();
    expect(advance(account, candles, 2, 2, market, ctx)).toEqual({ account, cursor: 2, events: [] });
    expect(advance(account, candles, 5, 9, market, ctx).cursor).toBe(5);
  });

  it('a stop placed at the close of one candle is checked from the next candle', () => {
    const result = advance(withLong(), candles, 2, 3, market, ctx);
    expect(result.cursor).toBe(3);
    expect(result.account.positions).toHaveLength(0);
    expect(result.account.trades[0]).toMatchObject({ exitPrice: 96, exitReason: 'stop_loss', netPnl: -60 });
    // The trade is stamped with replay time, not the real clock.
    expect(result.account.trades[0].closedAt).toBe(4 * DAY * 1000);
    expect(result.account.trades[0].openedAt).toBe(3 * DAY * 1000);
  });

  it('gives the same result stepping one candle at a time as jumping ahead', () => {
    const jumped = advance(withLong(), candles, 2, 5, market, contextAt());
    let stepped = { account: withLong(), cursor: 2, events: [] as unknown[] };
    const stepCtx = contextAt();
    while (stepped.cursor < 5) stepped = advance(stepped.account, candles, stepped.cursor, stepped.cursor + 1, market, stepCtx);
    expect(stepped.account.trades.map((t) => [t.exitPrice, t.netPnl, t.closedAt])).toEqual(jumped.account.trades.map((t) => [t.exitPrice, t.netPnl, t.closedAt]));
    expect(stepped.account.cash).toBe(jumped.account.cash);
  });

  it('a limit order cannot fill on the candle it was placed on, even if that candle traded there', () => {
    // At the close of day 3 (price 95) place a buy limit at 94. Day 3 itself
    // traded down to 94, but that is in the past: only later candles count.
    const placed = placeOrder(createAccount('replay', 0), { symbol: 'TEST', kind: 'spot', side: 'buy', type: 'limit', quantity: 5, limitPrice: 94 }, 95, {}, ctx(closeTimeMs(candles[3], DAY))).account;
    expect(placed.positions).toHaveLength(0);
    const day4 = advance(placed, candles, 3, 4, market, ctx);
    expect(day4.account.positions[0]).toMatchObject({ entryPrice: 94, quantity: 5 });
    expect(day4.account.positions[0].openedAt).toBe(5 * DAY * 1000);
  });

  it('uses only candles up to the target, whatever comes after', () => {
    const changedFuture = [...candles.slice(0, 4), k(4, 95, 200, 1, 150), k(5, 150, 300, 1, 2)];
    // Fresh id counters for each run, so the two accounts can be compared whole.
    const [ca, cb] = [contextAt(), contextAt()];
    const a = advance(withLong(ca), candles, 2, 3, market, ca);
    const b = advance(withLong(cb), changedFuture, 2, 3, market, cb);
    expect(b.account).toEqual(a.account);
  });

  it('reports the fills that happened along the way, in order', () => {
    const result = advance(withLong(), candles, 2, 5, market, contextAt());
    expect(result.events.map((e) => e.type)).toEqual(['order_filled', 'trade_closed']);
  });
});

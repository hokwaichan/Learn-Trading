import { describe, expect, it } from 'vitest';
import type { Account, Trade } from '@/types';
import { createAccount } from './account';
import {
  cancelOrder,
  closePosition,
  equityOf,
  feeFor,
  marginUsed,
  placeOrder,
  priceKey,
  processBar,
  setStops,
  tick,
  unrealizedPnl,
  validateStops,
  withSlippage,
  type Bar,
  type EngineContext,
  type OrderRequest,
} from './engine';
import { accountSnapshot, equityAtDayStart, tradeStats } from './snapshot';

const T0 = Date.UTC(2026, 0, 5, 12);
const KEY = priceKey('spot', 'BTCUSDT');

function context(overrides: Partial<EngineContext> = {}): EngineContext {
  let n = 0;
  return { now: T0, feeRate: 0, slippagePct: 0, newId: () => `id${++n}`, ...overrides };
}
const fresh = () => createAccount('main', T0);
const req = (r: Partial<OrderRequest>): OrderRequest => ({ symbol: 'BTCUSDT', kind: 'spot', side: 'buy', type: 'market', quantity: 1, ...r });
const bar = (open: number, high: number, low: number, close: number): Bar => ({ time: T0, open, high, low, close });
const lastTrade = (a: Account): Trade => a.trades[a.trades.length - 1];

describe('fees and slippage', () => {
  it('charges the fee on the value of the fill', () => {
    expect(feeFor(100, 5, 0.001)).toBeCloseTo(0.5, 12);
    expect(feeFor(100, -5, 0.001)).toBeCloseTo(0.5, 12);
  });

  it('fills buys higher and sells lower', () => {
    expect(withSlippage(100, 'buy', 0.001)).toBeCloseTo(100.1, 12);
    expect(withSlippage(100, 'sell', 0.001)).toBeCloseTo(99.9, 12);
  });
});

describe('market orders', () => {
  it('opens a long at the market price without moving cash', () => {
    const { account, events } = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, context());
    expect(account.positions).toHaveLength(1);
    expect(account.positions[0]).toMatchObject({ direction: 'long', quantity: 10, entryPrice: 100, realizedPnl: 0 });
    expect(account.cash).toBe(10_000);
    expect(events.map((e) => e.type)).toEqual(['order_filled', 'position_opened']);
    expect(account.orders[0]).toMatchObject({ status: 'filled', avgFillPrice: 100, fee: 0 });
  });

  it('applies slippage against you and deducts the fee from cash', () => {
    const ctx = context({ feeRate: 0.001, slippagePct: 0.0005 });
    const { account } = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, ctx);
    expect(account.positions[0].entryPrice).toBeCloseTo(100.05, 10);
    expect(account.cash).toBeCloseTo(10_000 - 100.05 * 10 * 0.001, 10);
    expect(account.ledger[0]).toMatchObject({ type: 'fee' });
    expect(account.positions[0].feesPaid).toBeCloseTo(1.0005, 10);
  });

  it('opens a short with a sell', () => {
    const { account } = placeOrder(fresh(), req({ side: 'sell', quantity: 4 }), 250, {}, context());
    expect(account.positions[0]).toMatchObject({ direction: 'short', quantity: 4, entryPrice: 250 });
  });

  it('rejects an order larger than the account can pay for', () => {
    const { account, events } = placeOrder(fresh(), req({ quantity: 101 }), 100, {}, context());
    expect(account.positions).toHaveLength(0);
    expect(events).toMatchObject([{ type: 'order_rejected', reason: 'Not enough free funds for this order.' }]);
    expect(account.orders[0].status).toBe('rejected');
  });

  it('allows using the whole account, and counts the fee against it', () => {
    expect(placeOrder(fresh(), req({ quantity: 100 }), 100, {}, context()).account.positions).toHaveLength(1);
    expect(placeOrder(fresh(), req({ quantity: 100 }), 100, {}, context({ feeRate: 0.001 })).account.positions).toHaveLength(0);
  });

  it('rejects nonsense', () => {
    expect(placeOrder(fresh(), req({ quantity: 0 }), 100, {}, context()).events[0]).toMatchObject({ type: 'order_rejected' });
    expect(placeOrder(fresh(), req({}), 0, {}, context()).events[0]).toMatchObject({ reason: 'There is no current price for this symbol.' });
  });
});

describe('P&L', () => {
  const ctx = context();
  const long = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, ctx).account;
  const short = placeOrder(fresh(), req({ side: 'sell', quantity: 10 }), 100, {}, ctx).account;

  it('marks a long and a short to market', () => {
    expect(unrealizedPnl(long.positions[0], 110)).toBe(100);
    expect(unrealizedPnl(long.positions[0], 95)).toBe(-50);
    expect(unrealizedPnl(short.positions[0], 110)).toBe(-100);
    expect(unrealizedPnl(short.positions[0], 95)).toBe(50);
  });

  it('includes unrealised P&L in equity but not in cash', () => {
    expect(equityOf(long, { [KEY]: 110 })).toBe(10_100);
    expect(long.cash).toBe(10_000);
    expect(marginUsed(long, { [KEY]: 110 })).toBe(1100);
  });

  it('realises the profit when a long is closed', () => {
    const { account, events } = closePosition(long, long.positions[0].id, 110, { [KEY]: 110 }, ctx);
    expect(account.positions).toHaveLength(0);
    expect(account.cash).toBe(10_100);
    expect(lastTrade(account)).toMatchObject({
      direction: 'long', quantity: 10, entryPrice: 100, exitPrice: 110, grossPnl: 100, fees: 0, netPnl: 100, exitReason: 'manual',
    });
    expect(lastTrade(account).returnPct).toBeCloseTo(0.1, 12);
    expect(events.map((e) => e.type)).toEqual(['order_filled', 'trade_closed']);
  });

  it('realises the loss when a short is bought back higher', () => {
    const { account } = closePosition(short, short.positions[0].id, 108, { [KEY]: 108 }, ctx);
    expect(account.cash).toBe(9_920);
    expect(lastTrade(account)).toMatchObject({ direction: 'short', netPnl: -80, exitPrice: 108 });
  });

  it('subtracts both entry and exit fees from the net result', () => {
    const fees = context({ feeRate: 0.001 });
    const opened = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, fees).account;
    const { account } = closePosition(opened, opened.positions[0].id, 110, { [KEY]: 110 }, fees);
    // Entry fee 1.00, exit fee 1.10.
    expect(lastTrade(account).grossPnl).toBeCloseTo(100, 10);
    expect(lastTrade(account).fees).toBeCloseTo(2.1, 10);
    expect(lastTrade(account).netPnl).toBeCloseTo(97.9, 10);
    expect(account.cash).toBeCloseTo(10_097.9, 10);
  });

  it('slippage costs money on a round trip even if price does not move', () => {
    const slip = context({ slippagePct: 0.001 });
    const opened = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, slip).account;
    const { account } = closePosition(opened, opened.positions[0].id, 100, { [KEY]: 100 }, slip);
    expect(account.cash).toBeCloseTo(10_000 - 2, 10); // bought at 100.10, sold at 99.90
  });
});

describe('adding to, reducing and flipping a position', () => {
  const ctx = context();
  const base = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, ctx).account;

  it('averages the entry price when adding', () => {
    const { account } = placeOrder(base, req({ quantity: 30 }), 120, { [KEY]: 120 }, ctx);
    expect(account.positions).toHaveLength(1);
    expect(account.positions[0]).toMatchObject({ quantity: 40, entryPrice: 115, peakQuantity: 40 });
  });

  it('realises P&L on the part closed and keeps the rest open', () => {
    const { account } = placeOrder(base, req({ side: 'sell', quantity: 4 }), 110, { [KEY]: 110 }, ctx);
    expect(account.positions[0]).toMatchObject({ quantity: 6, entryPrice: 100, realizedPnl: 40, closedQuantity: 4 });
    expect(account.cash).toBe(10_040);
    expect(account.trades).toHaveLength(0);
  });

  it('records one trade for a position closed in two parts, with the average exit', () => {
    const half = placeOrder(base, req({ side: 'sell', quantity: 4 }), 110, { [KEY]: 110 }, ctx).account;
    const { account } = placeOrder(half, req({ side: 'sell', quantity: 6 }), 120, { [KEY]: 120 }, ctx);
    expect(account.trades).toHaveLength(1);
    expect(lastTrade(account)).toMatchObject({ quantity: 10, grossPnl: 160, netPnl: 160 });
    expect(lastTrade(account).exitPrice).toBeCloseTo(116, 10); // (4*110 + 6*120) / 10
  });

  it('closes and opens the other way when the order is bigger than the position', () => {
    const { account, events } = placeOrder(base, req({ side: 'sell', quantity: 25 }), 110, { [KEY]: 110 }, ctx);
    expect(account.trades).toHaveLength(1);
    expect(lastTrade(account).netPnl).toBe(100);
    expect(account.positions).toHaveLength(1);
    expect(account.positions[0]).toMatchObject({ direction: 'short', quantity: 15, entryPrice: 110 });
    expect(events.map((e) => e.type)).toEqual(['order_filled', 'position_opened', 'trade_closed']);
  });

  it('a reduce-only order never flips', () => {
    const { account } = placeOrder(base, req({ side: 'sell', quantity: 25, reduceOnly: true }), 110, { [KEY]: 110 }, ctx);
    expect(account.positions).toHaveLength(0);
    expect(lastTrade(account).quantity).toBe(10);
  });

  it('rejects a reduce-only order with nothing to reduce', () => {
    expect(placeOrder(fresh(), req({ side: 'sell', reduceOnly: true }), 100, {}, ctx).events[0]).toMatchObject({ type: 'order_rejected' });
    expect(placeOrder(base, req({ side: 'buy', reduceOnly: true }), 100, {}, ctx).events[0]).toMatchObject({ type: 'order_rejected' });
  });

  it('needs funds only for the part that adds exposure', () => {
    const full = placeOrder(fresh(), req({ quantity: 100 }), 100, {}, ctx).account;
    // Fully invested, but selling 150 closes 100 and opens a 50 short, which the account can afford.
    const { account } = placeOrder(full, req({ side: 'sell', quantity: 150 }), 100, { [KEY]: 100 }, ctx);
    expect(account.positions[0]).toMatchObject({ direction: 'short', quantity: 50 });
  });

  it('keeps positions in different symbols separate', () => {
    const { account } = placeOrder(base, req({ symbol: 'ETHUSDT', quantity: 2 }), 2000, { [KEY]: 100 }, ctx);
    expect(account.positions.map((p) => p.symbol).sort()).toEqual(['BTCUSDT', 'ETHUSDT']);
    expect(marginUsed(account, { [KEY]: 100, [priceKey('spot', 'ETHUSDT')]: 2000 })).toBe(5000);
  });
});

describe('limit orders', () => {
  const ctx = context({ slippagePct: 0.001 });

  it('waits when the price is not there yet', () => {
    const { account, events } = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 10 }), 100, {}, ctx);
    expect(account.positions).toHaveLength(0);
    expect(account.orders[0]).toMatchObject({ status: 'open', limitPrice: 95 });
    expect(events[0].type).toBe('order_placed');
  });

  it('fills at the limit price, with no slippage, when the bar reaches it', () => {
    const placed = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 10 }), 100, {}, ctx).account;
    expect(processBar(placed, 'BTCUSDT', 'spot', bar(99, 100, 96, 97), {}, ctx).account.positions).toHaveLength(0);
    const { account } = processBar(placed, 'BTCUSDT', 'spot', bar(97, 98, 94, 96), {}, ctx);
    expect(account.positions[0]).toMatchObject({ entryPrice: 95, quantity: 10 });
    expect(account.orders[0].status).toBe('filled');
  });

  it('fills at the open when the bar gaps through the limit in your favour', () => {
    const placed = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 10 }), 100, {}, ctx).account;
    expect(processBar(placed, 'BTCUSDT', 'spot', bar(92, 93, 90, 91), {}, ctx).account.positions[0].entryPrice).toBe(92);
  });

  it('fills immediately at the market when placed through it', () => {
    const { account } = placeOrder(fresh(), req({ type: 'limit', limitPrice: 105, quantity: 10 }), 100, {}, ctx);
    expect(account.positions[0].entryPrice).toBe(100);
  });

  it('a sell limit waits above the market and fills when price rises to it', () => {
    const placed = placeOrder(fresh(), req({ side: 'sell', type: 'limit', limitPrice: 105, quantity: 10 }), 100, {}, ctx).account;
    const { account } = processBar(placed, 'BTCUSDT', 'spot', bar(101, 106, 100, 104), {}, ctx);
    expect(account.positions[0]).toMatchObject({ direction: 'short', entryPrice: 105 });
  });

  it('can be cancelled', () => {
    const placed = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95 }), 100, {}, ctx).account;
    const { account, events } = cancelOrder(placed, placed.orders[0].id);
    expect(account.orders[0].status).toBe('cancelled');
    expect(events[0].type).toBe('order_cancelled');
    expect(processBar(account, 'BTCUSDT', 'spot', bar(95, 95, 90, 91), {}, ctx).account.positions).toHaveLength(0);
    expect(cancelOrder(account, 'nope').events).toEqual([]);
  });

  it('is rejected at fill time if the money is no longer there', () => {
    let account = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 100 }), 100, {}, ctx).account;
    account = placeOrder(account, req({ symbol: 'ETHUSDT', quantity: 4 }), 2000, {}, ctx).account;
    const result = processBar(account, 'BTCUSDT', 'spot', bar(96, 96, 94, 95), {}, ctx);
    expect(result.account.positions.map((p) => p.symbol)).toEqual(['ETHUSDT']);
    expect(result.events[0]).toMatchObject({ type: 'order_rejected' });
  });
});

describe('stop (entry) orders', () => {
  const ctx = context({ slippagePct: 0.001 });

  it('must be on the far side of the market', () => {
    expect(placeOrder(fresh(), req({ type: 'stop', stopPrice: 95 }), 100, {}, ctx).events[0]).toMatchObject({ type: 'order_rejected' });
    expect(placeOrder(fresh(), req({ side: 'sell', type: 'stop', stopPrice: 105 }), 100, {}, ctx).events[0]).toMatchObject({ type: 'order_rejected' });
  });

  it('triggers when price reaches it and fills with slippage', () => {
    const placed = placeOrder(fresh(), req({ type: 'stop', stopPrice: 105, quantity: 10 }), 100, {}, ctx).account;
    expect(processBar(placed, 'BTCUSDT', 'spot', bar(100, 104, 99, 103), {}, ctx).account.positions).toHaveLength(0);
    const { account } = processBar(placed, 'BTCUSDT', 'spot', bar(103, 106, 102, 105.5), {}, ctx);
    expect(account.positions[0].entryPrice).toBeCloseTo(105 * 1.001, 10);
  });

  it('fills at the open, worse than the stop, when the bar gaps past it', () => {
    const placed = placeOrder(fresh(), req({ type: 'stop', stopPrice: 105, quantity: 10 }), 100, {}, ctx).account;
    const { account } = processBar(placed, 'BTCUSDT', 'spot', bar(109, 110, 108, 109), {}, ctx);
    expect(account.positions[0].entryPrice).toBeCloseTo(109 * 1.001, 10);
  });
});

describe('stop-loss and take-profit', () => {
  const ctx = context();
  const open = (extra: Partial<OrderRequest>) => placeOrder(fresh(), req({ quantity: 10, ...extra }), 100, {}, ctx).account;

  it('records the dollars at risk when the trade opens', () => {
    expect(open({ stopLoss: 95 }).positions[0]).toMatchObject({ stopLoss: 95, initialRisk: 50 });
    expect(open({}).positions[0].initialRisk).toBeUndefined();
  });

  it('checks which side of the entry each must be on', () => {
    expect(validateStops('long', 100, 95, 110)).toBeNull();
    expect(validateStops('long', 100, 105)).toMatch(/below the entry/);
    expect(validateStops('long', 100, undefined, 99)).toMatch(/above the entry/);
    expect(validateStops('short', 100, 105, 90)).toBeNull();
    expect(validateStops('short', 100, 95)).toMatch(/above the entry/);
    expect(placeOrder(fresh(), req({ stopLoss: 101 }), 100, {}, ctx).events[0]).toMatchObject({ type: 'order_rejected' });
  });

  it('closes a long at the stop-loss for a loss of exactly 1R', () => {
    const { account, events } = processBar(open({ stopLoss: 95, takeProfit: 110 }), 'BTCUSDT', 'spot', bar(98, 99, 94, 96), {}, ctx);
    expect(account.positions).toHaveLength(0);
    expect(lastTrade(account)).toMatchObject({ exitPrice: 95, netPnl: -50, exitReason: 'stop_loss', initialRisk: 50 });
    expect(lastTrade(account).rMultiple).toBeCloseTo(-1, 12);
    expect(events.map((e) => e.type)).toEqual(['order_filled', 'trade_closed']);
    expect(account.orders.at(-1)).toMatchObject({ type: 'stop', status: 'filled', reduceOnly: true });
  });

  it('closes a long at the take-profit for +2R', () => {
    const { account } = processBar(open({ stopLoss: 95, takeProfit: 110 }), 'BTCUSDT', 'spot', bar(104, 111, 103, 109), {}, ctx);
    expect(lastTrade(account)).toMatchObject({ exitPrice: 110, netPnl: 100, exitReason: 'take_profit' });
    expect(lastTrade(account).rMultiple).toBeCloseTo(2, 12);
  });

  it('assumes the stop-loss came first when one bar reaches both', () => {
    const { account } = processBar(open({ stopLoss: 95, takeProfit: 110 }), 'BTCUSDT', 'spot', bar(100, 112, 94, 105), {}, ctx);
    expect(lastTrade(account).exitReason).toBe('stop_loss');
  });

  it('fills a stop-loss at the open, worse than the stop, when price gaps past it', () => {
    const { account } = processBar(open({ stopLoss: 95 }), 'BTCUSDT', 'spot', bar(90, 91, 88, 89), {}, ctx);
    expect(lastTrade(account)).toMatchObject({ exitPrice: 90, netPnl: -100 });
    expect(lastTrade(account).rMultiple).toBeCloseTo(-2, 12);
  });

  it('adds slippage to a stop-loss but not to a take-profit', () => {
    const slip = context({ slippagePct: 0.001 });
    const account = placeOrder(fresh(), req({ quantity: 10, stopLoss: 95, takeProfit: 110 }), 100, {}, slip).account;
    expect(lastTrade(processBar(account, 'BTCUSDT', 'spot', bar(98, 99, 94, 96), {}, slip).account).exitPrice).toBeCloseTo(95 * 0.999, 10);
    expect(lastTrade(processBar(account, 'BTCUSDT', 'spot', bar(104, 111, 103, 109), {}, slip).account).exitPrice).toBe(110);
  });

  it('works the other way round for a short', () => {
    const short = open({ side: 'sell', stopLoss: 104, takeProfit: 90 });
    expect(lastTrade(processBar(short, 'BTCUSDT', 'spot', bar(101, 105, 100, 103), {}, ctx).account)).toMatchObject({ exitPrice: 104, netPnl: -40, exitReason: 'stop_loss' });
    expect(lastTrade(processBar(short, 'BTCUSDT', 'spot', bar(95, 96, 89, 91), {}, ctx).account)).toMatchObject({ exitPrice: 90, netPnl: 100, exitReason: 'take_profit' });
  });

  it('does nothing while price stays between them', () => {
    const account = open({ stopLoss: 95, takeProfit: 110 });
    expect(processBar(account, 'BTCUSDT', 'spot', bar(100, 109, 96, 104), {}, ctx)).toEqual({ account, events: [] });
  });

  it('ignores bars for other symbols', () => {
    const account = open({ stopLoss: 95 });
    expect(processBar(account, 'ETHUSDT', 'spot', bar(50, 60, 40, 50), {}, ctx).events).toEqual([]);
  });

  it('a live tick through the stop closes the position', () => {
    const { account } = processBar(open({ stopLoss: 95 }), 'BTCUSDT', 'spot', tick(94.5, T0), {}, ctx);
    expect(lastTrade(account).exitPrice).toBe(94.5);
  });

  it('carries the stop from a waiting order onto the position it opens', () => {
    const placed = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 10, stopLoss: 90, takeProfit: 105 }), 100, {}, ctx).account;
    const filled = processBar(placed, 'BTCUSDT', 'spot', bar(97, 98, 94, 96), {}, ctx).account;
    expect(filled.positions[0]).toMatchObject({ entryPrice: 95, stopLoss: 90, takeProfit: 105, initialRisk: 50 });
  });

  it('does not stop out a position in the same bar that opened it', () => {
    // The bar reaches the limit at 95 and also trades down to 89, below the stop at 90.
    // The order of those two events inside the bar is unknown, so the exit waits a bar.
    const placed = placeOrder(fresh(), req({ type: 'limit', limitPrice: 95, quantity: 10, stopLoss: 90 }), 100, {}, ctx).account;
    const sameBar = processBar(placed, 'BTCUSDT', 'spot', bar(97, 98, 89, 93), {}, ctx).account;
    expect(sameBar.positions).toHaveLength(1);
    const nextBar = processBar(sameBar, 'BTCUSDT', 'spot', bar(93, 94, 89, 91), {}, ctx).account;
    expect(nextBar.positions).toHaveLength(0);
  });
});

describe('editing stops on an open position', () => {
  const ctx = context();
  const account = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, ctx).account;
  const id = account.positions[0].id;

  it('sets, changes and removes them', () => {
    const set = setStops(account, id, { stopLoss: 96, takeProfit: 112 }, 102);
    expect(set.error).toBeNull();
    expect(set.account.positions[0]).toMatchObject({ stopLoss: 96, takeProfit: 112, initialRisk: 40 });
    const cleared = setStops(set.account, id, {}, 102);
    expect(cleared.account.positions[0].stopLoss).toBeUndefined();
    // The original risk is kept for the R-multiple even after the stop is removed.
    expect(cleared.account.positions[0].initialRisk).toBe(40);
  });

  it('refuses a stop that would trigger immediately', () => {
    expect(setStops(account, id, { stopLoss: 103 }, 102).error).toMatch(/below the current price/);
    expect(setStops(account, id, { takeProfit: 101 }, 102).error).toMatch(/above the current price/);
    expect(setStops(account, 'gone', { stopLoss: 90 }, 102).error).toMatch(/no longer open/);
  });

  it('lets a stop be moved above the entry to lock in profit', () => {
    expect(setStops(account, id, { stopLoss: 105 }, 110).error).toBeNull();
  });
});

describe('equity history and the daily figure', () => {
  it('adds a point on every fill', () => {
    const ctx = context();
    const opened = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, ctx).account;
    const closed = closePosition(opened, opened.positions[0].id, 110, { [KEY]: 110 }, ctx).account;
    expect(closed.equityHistory.map((p) => p.equity)).toEqual([10_000, 10_000, 10_100]);
  });

  it("measures today's P&L from the last equity recorded before today", () => {
    const yesterday = new Date(2026, 0, 4, 15).getTime();
    const today = new Date(2026, 0, 5, 10).getTime();
    const account: Account = {
      ...fresh(),
      cash: 10_500,
      equityHistory: [
        { time: yesterday - 86_400_000, equity: 10_000 },
        { time: yesterday, equity: 10_300 },
        { time: today, equity: 10_500 },
      ],
    };
    expect(equityAtDayStart(account, today + 1000)).toBe(10_300);
    expect(accountSnapshot(account, {}, today + 1000)).toMatchObject({ equity: 10_500, todayPnl: 200, unrealizedPnl: 0, marginUsed: 0, freeMargin: 10_500 });
  });

  it('snapshot splits equity into used and free', () => {
    const account = placeOrder(fresh(), req({ quantity: 10 }), 100, {}, context()).account;
    const snap = accountSnapshot(account, { [KEY]: 105 }, T0);
    expect(snap).toMatchObject({ equity: 10_050, unrealizedPnl: 50, marginUsed: 1050, freeMargin: 9000 });
  });
});

describe('tradeStats', () => {
  const t = (netPnl: number, rMultiple?: number) => ({ netPnl, rMultiple }) as Trade;

  it('summarises wins and losses', () => {
    const stats = tradeStats([t(200, 2), t(-100, -1), t(300, 3), t(-100, -1), t(0)]);
    expect(stats).toMatchObject({ count: 5, wins: 2, losses: 2, netPnl: 300, avgWin: 250, avgLoss: 100, profitFactor: 2.5, expectancy: 60 });
    expect(stats.winRate).toBeCloseTo(0.4, 12);
    expect(stats.avgR).toBeCloseTo(0.75, 12);
  });

  it('handles no trades and no losses', () => {
    expect(tradeStats([])).toMatchObject({ count: 0, winRate: 0, profitFactor: 0, expectancy: 0, avgR: null });
    expect(tradeStats([t(50)]).profitFactor).toBe(Infinity);
  });
});

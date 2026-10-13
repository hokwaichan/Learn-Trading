import { describe, expect, it } from 'vitest';
import type { Account, Trade } from '@/types';
import { createAccount } from './account';
import { applyFunding, closePosition, equityOf, liquidationPriceOf, marginUsed, placeOrder, priceKey, processBar, tick, type Bar, type EngineContext, type OrderRequest } from './engine';
import { accountSnapshot } from './snapshot';

// 12:00 UTC, between the 08:00 and 16:00 funding times.
const T0 = Date.UTC(2026, 0, 5, 12);
const HOUR = 3_600_000;
const KEY = priceKey('perpetual', 'BTCUSDT');

function context(overrides: Partial<EngineContext> = {}): EngineContext {
  let n = 0;
  return { now: T0, feeRate: 0, slippagePct: 0, newId: () => `id${++n}`, ...overrides };
}
const fresh = () => createAccount('main', T0);
const req = (r: Partial<OrderRequest>): OrderRequest => ({ symbol: 'BTCUSDT', kind: 'perpetual', side: 'buy', type: 'market', quantity: 10, leverage: 10, marginMode: 'isolated', ...r });
const bar = (open: number, high: number, low: number, close: number): Bar => ({ time: T0, open, high, low, close });
const lastTrade = (a: Account): Trade => a.trades[a.trades.length - 1];
/** Opens a position at 100 and returns the account. */
const opened = (r: Partial<OrderRequest> = {}, ctx = context()) => placeOrder(fresh(), req(r), 100, { [KEY]: 100 }, ctx).account;
const move = (account: Account, b: Bar, ctx = context()) => processBar(account, 'BTCUSDT', 'perpetual', b, { [KEY]: b.close }, ctx);

describe('opening a futures position', () => {
  it('records leverage, margin and the liquidation price', () => {
    const account = opened();
    const [p] = account.positions;
    // 10 units at 100 is $1,000 of position on $100 of margin.
    expect(p.futures).toMatchObject({ leverage: 10, marginMode: 'isolated', margin: 100, maintenanceMargin: 5, fundingPaid: 0, lastFundingAt: T0 });
    expect(p.futures!.liquidationPrice).toBeCloseTo(90.5, 10);
    expect(marginUsed(account, { [KEY]: 100 })).toBe(100);
    expect(accountSnapshot(account, { [KEY]: 100 }, T0).freeMargin).toBe(9900);
  });

  it('lets leverage control more than the account holds, up to the margin available', () => {
    // $90,000 of position needs $9,000 at 10x.
    expect(opened({ quantity: 900 }).positions).toHaveLength(1);
    const tooBig = placeOrder(fresh(), req({ quantity: 1100 }), 100, { [KEY]: 100 }, context());
    expect(tooBig.events[0]).toMatchObject({ type: 'order_rejected', reason: 'Not enough free funds for this order.' });
  });

  it('refuses leverage outside 1x to 20x', () => {
    for (const leverage of [0.5, 21, 100]) {
      const result = placeOrder(fresh(), req({ leverage }), 100, { [KEY]: 100 }, context());
      expect(result.events[0]).toMatchObject({ type: 'order_rejected', reason: 'Leverage must be between 1x and 20x.' });
    }
    expect(opened({ leverage: 20 }).positions[0].futures!.liquidationPrice).toBeCloseTo(95.5, 10);
    expect(opened({ leverage: 1 }).positions[0].futures!.liquidationPrice).toBeCloseTo(0.5, 10);
  });

  it('ignores leverage on spot', () => {
    const big = placeOrder(fresh(), req({ kind: 'spot', quantity: 200, leverage: 10 }), 100, { [priceKey('spot', 'BTCUSDT')]: 100 }, context());
    expect(big.events[0]).toMatchObject({ type: 'order_rejected' });
    const ok = placeOrder(fresh(), req({ kind: 'spot', quantity: 10, leverage: 10 }), 100, { [priceKey('spot', 'BTCUSDT')]: 100 }, context());
    expect(ok.account.positions[0].futures).toBeUndefined();
    expect(ok.account.orders[0].leverage).toBeUndefined();
    expect(liquidationPriceOf(ok.account, ok.account.positions[0], {})).toBeNull();
  });

  it('recalculates when the position is added to or reduced', () => {
    let account = opened();
    account = placeOrder(account, req({ quantity: 10 }), 110, { [KEY]: 110 }, context()).account;
    let [p] = account.positions;
    // 20 units at an average of 105.
    expect(p.entryPrice).toBe(105);
    expect(p.futures!.margin).toBeCloseTo(210, 10);
    expect(p.futures!.liquidationPrice).toBeCloseTo(105 * 0.905, 10);
    account = placeOrder(account, req({ side: 'sell', quantity: 15, reduceOnly: true }), 105, { [KEY]: 105 }, context()).account;
    [p] = account.positions;
    expect(p.quantity).toBe(5);
    expect(p.futures!.margin).toBeCloseTo(52.5, 10);
    expect(p.futures!.liquidationPrice).toBeCloseTo(105 * 0.905, 10);
  });
});

describe('liquidation, isolated margin', () => {
  it('closes the position at the liquidation price and loses exactly its margin', () => {
    const { account, events } = move(opened(), bar(95, 96, 90, 91));
    expect(account.positions).toHaveLength(0);
    const trade = lastTrade(account);
    expect(trade.exitReason).toBe('liquidation');
    expect(trade.exitPrice).toBeCloseTo(90.5, 10);
    expect(trade.leverage).toBe(10);
    expect(trade.netPnl).toBeCloseTo(-100, 10);
    expect(trade.returnPct).toBeCloseTo(-1, 10);
    expect(account.cash).toBeCloseTo(9900, 10);
    // The price move took 95; the last 5 of margin went as the liquidation fee.
    expect(trade.grossPnl).toBeCloseTo(-95, 10);
    expect(account.ledger.find((l) => l.type === 'liquidation')?.amount).toBeCloseTo(-5, 10);
    expect(events.some((e) => e.type === 'trade_closed')).toBe(true);
  });

  it('still loses only the margin when fees are charged', () => {
    const ctx = context({ feeRate: 0.001 });
    const start = opened({}, ctx);
    expect(start.cash).toBeCloseTo(9999, 10);
    const { account } = move(start, bar(95, 96, 90, 91), ctx);
    expect(account.cash).toBeCloseTo(9899, 10);
    expect(lastTrade(account).netPnl).toBeCloseTo(-101, 10);
  });

  it('does not liquidate above the liquidation price', () => {
    const { account } = move(opened(), bar(95, 96, 90.6, 91));
    expect(account.positions).toHaveLength(1);
    expect(equityOf(account, { [KEY]: 91 })).toBeCloseTo(9910, 10);
  });

  it('liquidates on a live tick', () => {
    const { account } = move(opened(), tick(90.4, T0));
    expect(lastTrade(account).exitReason).toBe('liquidation');
    expect(account.cash).toBeCloseTo(9900, 10);
  });

  it('liquidates a short when price rises', () => {
    const start = opened({ side: 'sell' });
    expect(start.positions[0].futures!.liquidationPrice).toBeCloseTo(109.5, 10);
    const { account } = move(start, bar(105, 110, 104, 109));
    expect(lastTrade(account)).toMatchObject({ exitReason: 'liquidation', direction: 'short' });
    expect(account.cash).toBeCloseTo(9900, 10);
  });

  it('uses the stop-loss when it is nearer than the liquidation price', () => {
    const { account } = move(opened({ stopLoss: 95 }), bar(98, 99, 90, 91));
    expect(lastTrade(account).exitReason).toBe('stop_loss');
    expect(lastTrade(account).netPnl).toBeCloseTo(-50, 10);
  });

  it('liquidates when price opens past both the stop-loss and the liquidation price', () => {
    const { account } = move(opened({ stopLoss: 95 }), bar(88, 89, 85, 86));
    expect(lastTrade(account).exitReason).toBe('liquidation');
    expect(lastTrade(account).netPnl).toBeCloseTo(-100, 10);
  });

  it('liquidates before a stop-loss placed beyond the liquidation price', () => {
    const { account } = move(opened({ stopLoss: 89 }), bar(95, 96, 88, 90));
    expect(lastTrade(account).exitReason).toBe('liquidation');
  });
});

describe('liquidation, cross margin', () => {
  // 500 units at 100 is $50,000 of position against a $10,000 account.
  const cross = () => opened({ quantity: 500, marginMode: 'cross' });

  it('puts the liquidation price where account equity meets the maintenance margin', () => {
    const account = cross();
    const price = liquidationPriceOf(account, account.positions[0], { [KEY]: 100 })!;
    // 10,000 + (P - 100) * 500 = 0.005 * P * 500
    expect(price).toBeCloseTo(40_000 / 497.5, 8);
    expect(10_000 + (price - 100) * 500).toBeCloseTo(0.005 * price * 500, 8);
    // Further away than the same position on isolated margin (90.5), because the whole account backs it.
    expect(price).toBeLessThan(90.5);
  });

  it('cannot be liquidated when the account covers the whole position', () => {
    const account = opened({ quantity: 50, marginMode: 'cross' });
    expect(liquidationPriceOf(account, account.positions[0], { [KEY]: 100 })).toBe(0);
    expect(move(account, bar(50, 50, 1, 2)).account.positions).toHaveLength(1);
  });

  it('survives a fall that would liquidate the isolated position, then is liquidated lower down', () => {
    const held = move(cross(), bar(95, 96, 85, 86)).account;
    expect(held.positions).toHaveLength(1);
    const { account } = move(held, bar(86, 86, 80, 81));
    expect(lastTrade(account).exitReason).toBe('liquidation');
    // Liquidation in cross mode takes the account with it.
    expect(account.cash).toBeCloseTo(0, 6);
  });

  it('moves with the rest of the account', () => {
    const ETH = priceKey('perpetual', 'ETHUSDT');
    let account = cross();
    const alone = liquidationPriceOf(account, account.positions[0], { [KEY]: 100 })!;
    account = placeOrder(account, req({ symbol: 'ETHUSDT', quantity: 10, marginMode: 'cross' }), 100, { [KEY]: 100, [ETH]: 100 }, context({ newId: () => `e${Math.random()}` })).account;
    const btc = account.positions.find((p) => p.symbol === 'BTCUSDT')!;
    // A profit elsewhere pushes the liquidation price further away; a loss pulls it nearer.
    expect(liquidationPriceOf(account, btc, { [KEY]: 100, [ETH]: 150 })!).toBeLessThan(alone);
    expect(liquidationPriceOf(account, btc, { [KEY]: 100, [ETH]: 50 })!).toBeGreaterThan(alone);
  });
});

describe('funding', () => {
  const rate = () => 0.0001;
  const at = (hours: number) => context({ now: T0 + hours * HOUR });

  it('charges nothing before a funding time', () => {
    const start = opened();
    const { account, events } = applyFunding(start, { [KEY]: 100 }, at(3.9), rate);
    expect(events).toEqual([]);
    expect(account).toBe(start);
  });

  it('charges a long once the funding time passes', () => {
    const { account, events } = applyFunding(opened(), { [KEY]: 110 }, at(4), rate);
    // 10 units at 110 = $1,100 of position; 0.01% of that is $0.11.
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'funding' });
    expect(account.cash).toBeCloseTo(10_000 - 0.11, 10);
    expect(account.positions[0].futures).toMatchObject({ lastFundingAt: T0 + 4 * HOUR });
    expect(account.positions[0].futures!.fundingPaid).toBeCloseTo(0.11, 10);
    expect(account.ledger.find((l) => l.type === 'funding')?.amount).toBeCloseTo(-0.11, 10);
    // Not charged twice for the same time.
    expect(applyFunding(account, { [KEY]: 110 }, at(5), rate).events).toEqual([]);
  });

  it('pays a short, and charges it when the rate is negative', () => {
    const short = opened({ side: 'sell' });
    expect(applyFunding(short, { [KEY]: 100 }, at(4), rate).account.cash).toBeCloseTo(10_000.1, 10);
    expect(applyFunding(short, { [KEY]: 100 }, at(4), () => -0.0001).account.cash).toBeCloseTo(9999.9, 10);
  });

  it('charges every funding time missed while away', () => {
    // From 12:00 on day one to 12:00 three days later: nine funding times.
    const { account } = applyFunding(opened(), { [KEY]: 100 }, at(72), rate);
    expect(account.positions[0].futures!.fundingPaid).toBeCloseTo(0.9, 10);
    expect(account.ledger.find((l) => l.type === 'funding')?.note).toBe('9 funding payments');
  });

  it('counts funding in the result of the trade', () => {
    let account = applyFunding(opened(), { [KEY]: 100 }, at(4), rate).account;
    account = closePosition(account, account.positions[0].id, 105, { [KEY]: 105 }, at(5)).account;
    const trade = lastTrade(account);
    expect(trade.funding).toBeCloseTo(0.1, 10);
    expect(trade.grossPnl).toBeCloseTo(50, 10);
    expect(trade.netPnl).toBeCloseTo(49.9, 10);
    expect(account.cash).toBeCloseTo(10_049.9, 10);
  });

  it('leaves spot positions alone', () => {
    const spot = placeOrder(fresh(), req({ kind: 'spot' }), 100, {}, context()).account;
    expect(applyFunding(spot, {}, at(72), rate).events).toEqual([]);
  });
});

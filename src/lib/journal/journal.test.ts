import { describe, expect, it } from 'vitest';
import { createAccount } from '@/lib/trading/account';
import { applyFunding, placeOrder, processBar, type EngineContext } from '@/lib/trading/engine';
import { tradeStats } from '@/lib/trading/snapshot';
import type { Account, JournalNote, Trade } from '@/types';
import {
  breakdown,
  CSV_COLUMNS,
  csvCell,
  cumulativePnl,
  filterRows,
  journalRows,
  longestLosingStreak,
  maxDrawdown,
  realisedRewardRisk,
  setupOptions,
  snapshotPlan,
  toCsv,
  tradeEvents,
  weekdayOf,
} from './journal';

const T0 = Date.UTC(2026, 0, 5, 12);
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

let seq = 0;
function trade(patch: Partial<Trade> = {}): Trade {
  seq++;
  return {
    id: `t${seq}`,
    accountId: 'main',
    positionId: `p${seq}`,
    symbol: 'BTCUSDT',
    kind: 'spot',
    direction: 'long',
    quantity: 1,
    entryPrice: 100,
    exitPrice: 110,
    openedAt: T0 + seq * HOUR,
    closedAt: T0 + seq * HOUR + 30 * 60_000,
    grossPnl: 10,
    fees: 0.2,
    funding: 0,
    netPnl: 9.8,
    returnPct: 0.098,
    exitReason: 'manual',
    ...patch,
  };
}
const note = (patch: Partial<JournalNote> = {}): JournalNote => ({ reasoning: '', review: '', updatedAt: T0, ...patch });
const account = (trades: Trade[], id: Account['id'] = 'main'): Account => ({ ...createAccount(id, T0), trades });

describe('journal rows', () => {
  it('lists closed trades newest first with their notes attached', () => {
    const a = trade({ positionId: 'pa' });
    const b = trade({ positionId: 'pb' });
    const rows = journalRows([account([a, b])], { pa: note({ setup: 'Breakout' }) });
    expect(rows.map((r) => r.id)).toEqual(['pb', 'pa']);
    expect(rows[1]).toMatchObject({ status: 'closed', netPnl: 9.8, symbol: 'BTCUSDT', accountId: 'main' });
    expect(rows[1].note?.setup).toBe('Breakout');
    expect(rows[0].note).toBeUndefined();
  });

  it('puts open positions first, and names an option strategy by its underlying', () => {
    let n = 0;
    const ctx: EngineContext = { now: T0, feeRate: 0, slippagePct: 0, newId: () => `id${++n}` };
    const opened = placeOrder(createAccount('main', T0), { symbol: 'ETHUSDT', kind: 'perpetual', side: 'sell', type: 'market', quantity: 2, leverage: 5 }, 100, {}, ctx).account;
    const rows = journalRows([{ ...opened, trades: [trade()] }], { [opened.positions[0].id]: note({ reasoning: 'Planned' }) });
    expect(rows[0]).toMatchObject({ status: 'open', symbol: 'ETHUSDT', kind: 'perpetual', direction: 'short', quantity: 2 });
    expect(rows[0].note?.reasoning).toBe('Planned');
    expect(rows[0].netPnl).toBeUndefined();
    expect(rows[1].status).toBe('closed');
  });

  it('merges accounts and keeps which one each trade came from', () => {
    const rows = journalRows([account([trade()]), account([trade({ accountId: 'replay' })], 'replay')], {});
    expect(rows.map((r) => r.accountId).sort()).toEqual(['main', 'replay']);
  });
});

describe('filtering the journal', () => {
  const win = trade({ positionId: 'w', netPnl: 5 });
  const loss = trade({ positionId: 'l', netPnl: -5, kind: 'perpetual', symbol: 'ETHUSDT' });
  const option = trade({ positionId: 'o', netPnl: 1, kind: 'option', symbol: 'ETHUSDT', label: 'Iron condor' });
  const rows = journalRows([account([win, loss, option])], { w: note({ setup: 'Breakout', emotion: 'calm' }), l: note({ setup: 'Pullback', emotion: 'fomo' }) });
  const ids = (list: typeof rows) => list.map((r) => r.id).sort();

  it('filters by type, result, setup and emotion', () => {
    expect(ids(filterRows(rows, {}))).toEqual(['l', 'o', 'w']);
    expect(ids(filterRows(rows, { kind: 'perpetual' }))).toEqual(['l']);
    expect(ids(filterRows(rows, { kind: 'all', result: 'wins' }))).toEqual(['o', 'w']);
    expect(ids(filterRows(rows, { result: 'losses' }))).toEqual(['l']);
    expect(ids(filterRows(rows, { result: 'open' }))).toEqual([]);
    expect(ids(filterRows(rows, { setup: 'Breakout' }))).toEqual(['w']);
    expect(ids(filterRows(rows, { emotion: 'fomo' }))).toEqual(['l']);
    expect(ids(filterRows(rows, { emotion: 'none' }))).toEqual(['o']);
    expect(ids(filterRows(rows, { emotion: 'all' }))).toEqual(['l', 'o', 'w']);
  });

  it('searches the symbol and the strategy name', () => {
    expect(ids(filterRows(rows, { search: 'eth' }))).toEqual(['l', 'o']);
    expect(ids(filterRows(rows, { search: ' Condor ' }))).toEqual(['o']);
    expect(ids(filterRows(rows, { search: 'zzz' }))).toEqual([]);
  });

  it('offers setups in use first, most used first, then the suggestions', () => {
    const options = setupOptions({ a: note({ setup: 'Gap fill' }), b: note({ setup: 'Pullback' }), c: note({ setup: 'Pullback' }), d: note() });
    expect(options.slice(0, 2)).toEqual(['Pullback', 'Gap fill']);
    expect(options).toContain('Breakout');
    expect(options.filter((o) => o === 'Pullback')).toHaveLength(1);
  });
});

describe('events on a trade', () => {
  it('collects funding and the liquidation fee from the ledger', () => {
    let n = 0;
    const ctx = (now: number): EngineContext => ({ now, feeRate: 0, slippagePct: 0, newId: () => `id${++n}` });
    let acc = placeOrder(createAccount('main', T0), { symbol: 'BTCUSDT', kind: 'perpetual', side: 'buy', type: 'market', quantity: 10, leverage: 10 }, 100, {}, ctx(T0)).account;
    const positionId = acc.positions[0].id;
    acc = applyFunding(acc, { 'perpetual:BTCUSDT': 100 }, ctx(T0 + 5 * HOUR), () => 0.0001).account;
    acc = processBar(acc, 'BTCUSDT', 'perpetual', { time: T0 + 6 * HOUR, open: 95, high: 95, low: 90, close: 91 }, {}, ctx(T0 + 6 * HOUR)).account;
    const events = tradeEvents(acc, positionId, acc.trades[0]);
    expect(events.map((e) => e.type)).toEqual(['funding', 'liquidation']);
    expect(events[0].amount).toBeCloseTo(-0.1, 10);
    expect(events[0].note).toBe('Funding paid');
    expect(events[1].amount).toBeCloseTo(-5, 10);
    // The trade carries its stop-loss and take-profit for the chart; this one had neither.
    expect(acc.trades[0].stopLoss).toBeUndefined();
    expect(tradeEvents(acc, 'someone-else')).toEqual([]);
  });

  it('adds expiry and assignment for options', () => {
    const expired = trade({ exitReason: 'expiry', kind: 'option', exitPrice: 0 });
    const assigned = trade({ exitReason: 'assignment', kind: 'option' });
    expect(tradeEvents(account([expired]), expired.positionId, expired)[0]).toMatchObject({ type: 'expiry', time: expired.closedAt });
    expect(tradeEvents(account([assigned]), assigned.positionId, assigned)[0].type).toBe('assignment');
  });

  it('keeps the stop-loss and take-profit a position closed with', () => {
    let n = 0;
    const ctx: EngineContext = { now: T0, feeRate: 0, slippagePct: 0, newId: () => `id${++n}` };
    let acc = placeOrder(createAccount('main', T0), { symbol: 'BTCUSDT', kind: 'spot', side: 'buy', type: 'market', quantity: 1, stopLoss: 95, takeProfit: 110 }, 100, {}, ctx).account;
    acc = processBar(acc, 'BTCUSDT', 'spot', { time: T0 + HOUR, open: 100, high: 111, low: 99, close: 110 }, {}, { ...ctx, now: T0 + HOUR }).account;
    expect(acc.trades[0]).toMatchObject({ stopLoss: 95, takeProfit: 110, exitReason: 'take_profit' });
  });
});

describe('CSV export', () => {
  it('quotes commas, quotes and line breaks', () => {
    expect(csvCell('plain')).toBe('plain');
    expect(csvCell('a, b')).toBe('"a, b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('line one\nline two')).toBe('"line one\nline two"');
    expect(csvCell(12.5)).toBe('12.5');
    expect(csvCell(undefined)).toBe('');
    expect(csvCell(NaN)).toBe('');
  });

  it('stops text being run as a spreadsheet formula', () => {
    expect(csvCell('=SUM(A1:A9)')).toBe("'=SUM(A1:A9)");
    expect(csvCell('+1 on the breakout')).toBe("'+1 on the breakout");
    expect(csvCell('-not a number')).toBe("'-not a number");
    expect(csvCell('@handle')).toBe("'@handle");
    // Numbers are numbers: a loss keeps its minus sign.
    expect(csvCell(-42.5)).toBe('-42.5');
  });

  it('writes a header and one line per trade', () => {
    const t = trade({ positionId: 'x', netPnl: -12.345, grossPnl: -12, fees: 0.35, returnPct: -0.12345, rMultiple: -0.5, exitReason: 'stop_loss', leverage: 5, kind: 'perpetual' });
    const csv = toCsv(journalRows([account([t])], { x: note({ setup: 'Breakout', emotion: 'fomo', rating: 2, reasoning: 'Chased it, badly', review: 'Wait for the "retest"' }) }));
    const lines = csv.trimEnd().split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(CSV_COLUMNS.join(','));
    expect(lines[0].split(',')).toHaveLength(24);
    expect(lines[1]).toBe(
      `Paper,Closed,${new Date(t.openedAt).toISOString()},${new Date(t.closedAt).toISOString()},BTCUSDT,Futures,,Long,1,5,100,110,-12,0.35,0,-12.35,-12.35,-0.5,Stop-loss,Breakout,FOMO,2,"Chased it, badly","Wait for the ""retest"""`,
    );
    expect(csv.endsWith('\r\n')).toBe(true);
  });

  it('leaves side and quantity blank for option strategies and marks replay trades', () => {
    const t = trade({ kind: 'option', label: 'Iron condor', accountId: 'replay' });
    const [, line] = toCsv(journalRows([account([t], 'replay')], {})).split('\r\n');
    const cells = line.split(',');
    expect(cells[0]).toBe('Replay');
    expect(cells.slice(5, 9)).toEqual(['Options', 'Iron condor', '', '']);
  });

  it('is just the header with no trades', () => {
    expect(toCsv([])).toBe(`${CSV_COLUMNS.join(',')}\r\n`);
  });
});

describe('chart snapshot plan', () => {
  const all = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

  it('uses the smallest candle that fits the trade in about 150 candles', () => {
    expect(snapshotPlan(T0, T0 + 20 * 60_000, [...all]).timeframe).toBe('1m');
    expect(snapshotPlan(T0, T0 + 6 * HOUR, [...all]).timeframe).toBe('5m');
    expect(snapshotPlan(T0, T0 + 3 * DAY, [...all]).timeframe).toBe('1h');
    expect(snapshotPlan(T0, T0 + 60 * DAY, [...all]).timeframe).toBe('1d');
    expect(snapshotPlan(T0, T0 + 5000 * DAY, [...all]).timeframe).toBe('1d');
  });

  it('uses what the symbol has', () => {
    expect(snapshotPlan(T0, T0 + HOUR, ['1d']).timeframe).toBe('1d');
  });

  it('leaves room before the entry and after the exit', () => {
    const quick = snapshotPlan(T0, T0 + 60_000, [...all]);
    expect(quick.from).toBe(T0 - 50 * 60_000);
    expect(quick.to).toBe(T0 + 60_000 + 20 * 60_000);
    const long = snapshotPlan(T0, T0 + 100 * DAY, [...all]);
    expect(long.from).toBe(T0 - 50 * DAY);
    expect(long.to).toBe(T0 + 125 * DAY);
  });
});

describe('analytics', () => {
  it('groups trades and summarises each group', () => {
    const trades = [trade({ kind: 'spot', netPnl: 10 }), trade({ kind: 'spot', netPnl: -4 }), trade({ kind: 'perpetual', netPnl: -6 }), trade({ kind: 'option', netPnl: 3 })];
    const groups = breakdown(trades, (t) => t.kind, (k) => k.toUpperCase(), ['option', 'spot']);
    expect(groups.map((g) => g.key)).toEqual(['option', 'spot', 'perpetual']);
    expect(groups[1].label).toBe('SPOT');
    expect(groups[1].stats).toMatchObject({ count: 2, wins: 1, losses: 1, winRate: 0.5, netPnl: 6 });
    expect(groups[2].stats.netPnl).toBe(-6);
    expect(breakdown([], (t) => t.kind)).toEqual([]);
  });

  it('orders unranked groups by size', () => {
    const trades = [trade({ symbol: 'A' }), trade({ symbol: 'B' }), trade({ symbol: 'B' })];
    expect(breakdown(trades, (t) => t.symbol).map((g) => g.key)).toEqual(['B', 'A']);
  });

  it('names the weekday in local time, Monday first', () => {
    // Local noon avoids any timezone pushing the date over.
    expect(weekdayOf(new Date(2026, 0, 5, 12).getTime())).toBe('Monday');
    expect(weekdayOf(new Date(2026, 0, 11, 12).getTime())).toBe('Sunday');
  });

  it('builds the running total in closing order', () => {
    const a = trade({ openedAt: 1000, closedAt: 5000, netPnl: 10 });
    const b = trade({ openedAt: 2000, closedAt: 3000, netPnl: -4 });
    const c = trade({ openedAt: 6000, closedAt: 7000, netPnl: -9 });
    expect(cumulativePnl([a, b, c])).toEqual([
      { time: 1000, value: 0 },
      { time: 3000, value: -4 },
      { time: 5000, value: 6 },
      { time: 7000, value: -3 },
    ]);
    expect(cumulativePnl([])).toEqual([]);
    expect(maxDrawdown(cumulativePnl([a, b, c]))).toBe(9);
    expect(maxDrawdown([{ value: 0 }, { value: 5 }, { value: 8 }])).toBe(0);
  });

  it('gives the reward-to-risk actually achieved', () => {
    expect(realisedRewardRisk(tradeStats([trade({ netPnl: 30 }), trade({ netPnl: 10 }), trade({ netPnl: -10 })]))).toBe(2);
    expect(realisedRewardRisk(tradeStats([trade({ netPnl: 30 })]))).toBeNull();
    expect(realisedRewardRisk(tradeStats([]))).toBeNull();
  });

  it('finds the longest losing streak', () => {
    const results = [5, -1, -1, 3, -1, -1, -1, 0, -1];
    const trades = results.map((netPnl, i) => trade({ netPnl, closedAt: T0 + i * HOUR }));
    expect(longestLosingStreak(trades)).toBe(3);
    expect(longestLosingStreak([])).toBe(0);
  });
});

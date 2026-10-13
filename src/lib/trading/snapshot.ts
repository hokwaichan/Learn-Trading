import { startOfLocalDay } from '@/lib/dates';
import type { Account, AccountSnapshot, Trade } from '@/types';
import { equityOf, marginUsed, type Prices } from './engine';

/** Equity at the start of the local day containing `now`: the last recorded point before it. */
export function equityAtDayStart(account: Account, now: number): number {
  const dayStart = startOfLocalDay(now);
  let equity = account.startingBalance;
  for (const point of account.equityHistory) {
    if (point.time >= dayStart) break;
    equity = point.equity;
  }
  return equity;
}

/** Live figures for an account at the given prices. */
export function accountSnapshot(account: Account, prices: Prices, now: number): AccountSnapshot {
  const equity = equityOf(account, prices);
  const used = marginUsed(account, prices);
  return {
    equity,
    unrealizedPnl: equity - account.cash,
    todayPnl: equity - equityAtDayStart(account, now),
    marginUsed: used,
    freeMargin: equity - used,
  };
}

export interface TradeStats {
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  netPnl: number;
  avgWin: number;
  /** A positive number. */
  avgLoss: number;
  /** Total won divided by total lost; Infinity with no losing trades. */
  profitFactor: number;
  /** Average net P&L per trade. */
  expectancy: number;
  /** Average result in R, over trades that had a stop-loss. */
  avgR: number | null;
}

/** Summary statistics for a list of closed trades. A trade with exactly zero P&L counts as neither. */
export function tradeStats(trades: Trade[]): TradeStats {
  const wins = trades.filter((t) => t.netPnl > 0);
  const losses = trades.filter((t) => t.netPnl < 0);
  const won = wins.reduce((sum, t) => sum + t.netPnl, 0);
  const lost = -losses.reduce((sum, t) => sum + t.netPnl, 0);
  const withR = trades.filter((t) => t.rMultiple != null);
  return {
    count: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length ? wins.length / trades.length : 0,
    netPnl: won - lost,
    avgWin: wins.length ? won / wins.length : 0,
    avgLoss: losses.length ? lost / losses.length : 0,
    profitFactor: lost > 0 ? won / lost : won > 0 ? Infinity : 0,
    expectancy: trades.length ? (won - lost) / trades.length : 0,
    avgR: withR.length ? withR.reduce((sum, t) => sum + t.rMultiple!, 0) / withR.length : null,
  };
}

import type { BacktestStats, BacktestTrade, EquityPoint } from '@/types';

/** The largest fall from a peak to a later low, as a percentage of the peak. */
export function maxDrawdownPct(curve: EquityPoint[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const point of curve) {
    if (point.equity > peak) peak = point.equity;
    if (peak > 0) worst = Math.max(worst, (peak - point.equity) / peak);
  }
  return worst * 100;
}

/** The fall from the running peak at each point, as a negative percentage. */
export function drawdownSeries(curve: EquityPoint[]): { time: number; value: number }[] {
  let peak = -Infinity;
  return curve.map((point) => {
    if (point.equity > peak) peak = point.equity;
    return { time: point.time, value: peak > 0 ? ((point.equity - peak) / peak) * 100 : 0 };
  });
}

/**
 * Annualised Sharpe ratio: the average return per candle divided by how much
 * those returns vary, scaled to a year. The risk-free rate is taken as zero.
 * Uses the sample standard deviation.
 */
export function sharpeRatio(curve: EquityPoint[], periodsPerYear: number): number {
  const returns: number[] = [];
  for (let i = 1; i < curve.length; i++) {
    if (curve[i - 1].equity > 0) returns.push(curve[i].equity / curve[i - 1].equity - 1);
  }
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
  const sd = Math.sqrt(variance);
  return sd > 1e-12 ? (mean / sd) * Math.sqrt(periodsPerYear) : 0;
}

const pctChange = (curve: EquityPoint[], start: number) => (curve.length && start > 0 ? (curve[curve.length - 1].equity / start - 1) * 100 : 0);

export function computeStats(
  trades: BacktestTrade[],
  equityCurve: EquityPoint[],
  buyHoldCurve: EquityPoint[],
  initialCapital: number,
  periodsPerYear: number,
): BacktestStats {
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const sum = (list: BacktestTrade[], pick: (t: BacktestTrade) => number) => list.reduce((a, t) => a + pick(t), 0);
  const grossWin = sum(wins, (t) => t.pnl);
  const grossLoss = -sum(losses, (t) => t.pnl);
  return {
    totalReturnPct: pctChange(equityCurve, initialCapital),
    buyHoldReturnPct: pctChange(buyHoldCurve, initialCapital),
    tradeCount: trades.length,
    winRate: trades.length ? wins.length / trades.length : 0,
    avgWin: wins.length ? grossWin / wins.length : 0,
    avgLoss: losses.length ? -grossLoss / losses.length : 0,
    // No losing trades: infinite when there were wins, zero when there were no trades at all.
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0,
    expectancy: trades.length ? sum(trades, (t) => t.pnl) / trades.length : 0,
    maxDrawdownPct: maxDrawdownPct(equityCurve),
    sharpe: sharpeRatio(equityCurve, periodsPerYear),
    liquidations: trades.filter((t) => t.exitReason === 'liquidation').length,
    totalFees: sum(trades, (t) => t.fees),
    totalFunding: sum(trades, (t) => t.funding),
  };
}

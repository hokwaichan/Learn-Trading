import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { IndicatorLayer, LineDiagram, PriceChart, TradeMarkerLayer, type TradeMarker } from '@/components/chart';
import { Badge, Card, DataTable, GlossaryTerm, Pnl, StatTile, toneOf, useIsPhone, type Column } from '@/components/ui';
import { ruleLabel, strategyIndicators } from '@/lib/backtest';
import { displaySymbol, findInstrument, TIMEFRAME_NAMES, TIMEFRAME_SECONDS } from '@/lib/data';
import { formatMoney, formatPrice, formatSignedMoney, formatSignedPct } from '@/lib/format';
import type { BacktestResult, BacktestTrade, Candle, EquityPoint, IndicatorConfig } from '@/types';

const EXIT_LABELS: Record<BacktestTrade['exitReason'], string> = {
  rule: 'Exit rule',
  stop_loss: 'Stop-loss',
  take_profit: 'Take-profit',
  liquidation: 'Liquidated',
  end_of_data: 'End of test',
};

/** Keeps at most `limit` points, always including the last, so a long test still draws quickly. */
function thin<T>(points: T[], limit = 600): T[] {
  if (points.length <= limit) return points;
  const stride = Math.ceil(points.length / limit);
  const out = points.filter((_, i) => i % stride === 0);
  if (out[out.length - 1] !== points[points.length - 1]) out.push(points[points.length - 1]);
  return out;
}

const asReturns = (curve: EquityPoint[], start: number) => thin(curve).map((p) => ({ x: p.time, y: (p.equity / start - 1) * 100 }));
const pct = (value: number, decimals = 2) => formatSignedPct(value / 100, decimals);
const dateOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const stamp = (ms: number, intraday: boolean) => (intraday ? new Date(ms).toISOString().slice(0, 16).replace('T', ' ') : dateOf(ms));

/** One plain sentence on how the strategy did against simply holding. */
function verdict(result: BacktestResult): string {
  const { stats } = result;
  if (stats.tradeCount === 0) return 'The entry rule was never true in this period, so the strategy made no trades. Try a longer period or a looser rule.';
  const gap = stats.totalReturnPct - stats.buyHoldReturnPct;
  const versus = Math.abs(gap) < 0.5 ? 'about the same as' : gap > 0 ? `${Math.abs(gap).toFixed(1)} percentage points better than` : `${Math.abs(gap).toFixed(1)} percentage points worse than`;
  return `The strategy ${stats.totalReturnPct >= 0 ? 'made' : 'lost'} ${Math.abs(stats.totalReturnPct).toFixed(1)}%, ${versus} buying at the start and holding (${pct(stats.buyHoldReturnPct, 1)}).`;
}

export function Results({ result, candles }: { result: BacktestResult; candles: Candle[] }) {
  const { stats, trades, config, strategy } = result;
  const instrument = findInstrument(config.symbol);
  const name = instrument ? displaySymbol(instrument) : config.symbol;
  const tickSize = instrument?.tickSize ?? 0.01;
  const intraday = TIMEFRAME_SECONDS[config.timeframe] < 86_400;
  const finalEquity = result.equityCurve.length ? result.equityCurve[result.equityCurve.length - 1].equity : config.initialCapital;
  const long = strategy.direction === 'long';
  const wins = trades.filter((t) => t.pnl > 0).length;
  // On a phone the chart leaves vertical swipes to the page, so the results stay scrollable.
  const phone = useIsPhone();

  const markers = useMemo<TradeMarker[]>(() => {
    const step = TIMEFRAME_SECONDS[config.timeframe];
    const times = new Set(candles.map((c) => c.time));
    // An exit is stamped with the close of its candle; the marker goes on that candle.
    const candleOf = (ms: number, closes: boolean) => {
      const t = ms / 1000 - (closes ? step : 0);
      return times.has(t) ? t : ms / 1000;
    };
    return trades.flatMap((t) => [
      { time: candleOf(t.entryTime, false), side: long ? ('buy' as const) : ('sell' as const), text: long ? 'Buy' : 'Short' },
      {
        time: candleOf(t.exitTime, t.exitReason !== 'rule'),
        side: long ? ('sell' as const) : ('buy' as const),
        text: t.exitReason === 'stop_loss' ? 'Stop' : t.exitReason === 'take_profit' ? 'Target' : t.exitReason === 'liquidation' ? 'Liq.' : long ? 'Sell' : 'Cover',
      },
    ]).filter((m) => times.has(m.time));
  }, [trades, candles, config.timeframe, long]);

  const indicators = useMemo<IndicatorConfig[]>(() => strategyIndicators(strategy).map((i, n) => ({ key: `bt-${n}`, id: i.id, params: i.params, visible: true })), [strategy]);

  const columns: Column<BacktestTrade & { n: number }>[] = [
    { id: 'n', header: '#', cell: (t) => t.n, sortValue: (t) => t.n, numeric: true },
    { id: 'entry', header: 'Entered', cell: (t) => stamp(t.entryTime, intraday), sortValue: (t) => t.entryTime, numeric: true },
    { id: 'exit', header: 'Exited', cell: (t) => stamp(t.exitTime, intraday), sortValue: (t) => t.exitTime, numeric: true, hideOnPhone: true },
    { id: 'entryPrice', header: 'Entry', cell: (t) => formatPrice(t.entryPrice, tickSize), align: 'right', numeric: true, hideOnPhone: true },
    { id: 'exitPrice', header: 'Exit', cell: (t) => formatPrice(t.exitPrice, tickSize), align: 'right', numeric: true, hideOnPhone: true },
    { id: 'pnl', header: 'Profit / loss', cell: (t) => <Pnl value={t.pnl} />, sortValue: (t) => t.pnl, align: 'right', numeric: true },
    { id: 'return', header: 'Return', cell: (t) => <Pnl value={t.returnPct / 100} format="pct" />, sortValue: (t) => t.returnPct, align: 'right', numeric: true },
    {
      id: 'reason',
      header: 'Closed by',
      cell: (t) => <Badge tone={t.exitReason === 'liquidation' ? 'warning' : t.exitReason === 'take_profit' ? 'up' : t.exitReason === 'stop_loss' ? 'down' : 'neutral'}>{EXIT_LABELS[t.exitReason]}</Badge>,
      sortValue: (t) => t.exitReason,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-fg">
          {strategy.name || 'Untitled strategy'} on {name}
        </h2>
        <p className="num mt-0.5 text-xs text-muted">
          {TIMEFRAME_NAMES[config.timeframe]} candles · {dateOf(config.from)} to {dateOf(Math.min(config.to, result.ranAt))} · {long ? 'Long' : 'Short'}
          {config.futures ? ` · ${config.futures.leverage}x futures` : ''}
        </p>
        <p className="mt-2 text-sm text-fg">{verdict(result)}</p>
        <p className="mt-1 text-xs text-muted">
          Enter when {ruleLabel(strategy.entry)}. Exit when {ruleLabel(strategy.exit)}
          {strategy.stopLossPct != null ? `, or at a ${strategy.stopLossPct}% stop-loss` : ''}
          {strategy.takeProfitPct != null ? `, or at a ${strategy.takeProfitPct}% take-profit` : ''}.
        </p>
      </header>

      <div role="note" className="flex items-start gap-2.5 rounded-card border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
        <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-text" />
        <div>
          <p className="font-medium text-warning-text">Past results do not predict future returns</p>
          <p className="mt-1 text-fg">
            A backtest shows how a rule would have done on one stretch of history. Change the numbers until that stretch looks good and you have fitted the rule to
            the past, not found something that works. That is <GlossaryTerm id="overfitting">overfitting</GlossaryTerm>. Before believing a result, run the same
            rule on other symbols and other periods, and distrust anything that only works with one exact setting.
          </p>
          {stats.tradeCount > 0 && stats.tradeCount < 30 && (
            <p className="mt-1 text-fg">
              This test has only <span className="num">{stats.tradeCount}</span> {stats.tradeCount === 1 ? 'trade' : 'trades'}. That is too few to tell a good rule from a
              lucky one.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total return" value={pct(stats.totalReturnPct)} tone={toneOf(stats.totalReturnPct)} sub={`${formatMoney(config.initialCapital)} became ${formatMoney(finalEquity)}`} />
        <StatTile
          label="Buy and hold"
          value={pct(stats.buyHoldReturnPct)}
          tone={toneOf(stats.buyHoldReturnPct)}
          sub={`Strategy ${stats.totalReturnPct >= stats.buyHoldReturnPct ? 'ahead' : 'behind'} by ${Math.abs(stats.totalReturnPct - stats.buyHoldReturnPct).toFixed(2)} pts`}
        />
        <StatTile label={<GlossaryTerm id="win-rate">Win rate</GlossaryTerm>} value={stats.tradeCount ? `${(stats.winRate * 100).toFixed(1)}%` : '–'} sub={`${wins} of ${stats.tradeCount} trades won`} />
        <StatTile
          label="Average win / loss"
          value={
            stats.tradeCount ? (
              <>
                <span className="text-up-text">{formatSignedMoney(stats.avgWin, 0)}</span> <span className="text-muted">/</span> <span className="text-down-text">{formatSignedMoney(stats.avgLoss, 0)}</span>
              </>
            ) : (
              '–'
            )
          }
          sub={
            <>
              <GlossaryTerm id="expectancy">Expectancy</GlossaryTerm> {formatSignedMoney(stats.expectancy)} per trade
            </>
          }
        />
        <StatTile
          label={<GlossaryTerm id="profit-factor">Profit factor</GlossaryTerm>}
          value={stats.tradeCount === 0 ? '–' : Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : 'No losses'}
          tone={stats.tradeCount === 0 ? 'neutral' : stats.profitFactor >= 1 ? 'up' : 'down'}
          sub="Money won ÷ money lost. Above 1 is profitable."
        />
        <StatTile
          label={<GlossaryTerm id="drawdown">Max drawdown</GlossaryTerm>}
          value={stats.maxDrawdownPct > 0 ? `-${stats.maxDrawdownPct.toFixed(2)}%` : '0.00%'}
          tone={stats.maxDrawdownPct > 0 ? 'down' : 'neutral'}
          sub="Worst fall from a peak"
        />
        <StatTile label={<GlossaryTerm id="sharpe-ratio">Sharpe ratio</GlossaryTerm>} value={stats.sharpe.toFixed(2)} tone={toneOf(stats.sharpe)} sub="Return per unit of bumpiness, per year" />
        <StatTile
          label="Costs"
          value={formatMoney(stats.totalFees + Math.max(0, stats.totalFunding))}
          sub={
            config.futures
              ? `Fees ${formatMoney(stats.totalFees)} · funding ${stats.totalFunding >= 0 ? 'paid' : 'received'} ${formatMoney(Math.abs(stats.totalFunding))}`
              : 'Fees on every fill'
          }
        />
      </div>

      {config.futures && (
        <div
          role="note"
          className={`rounded-card border px-4 py-3 text-sm ${stats.liquidations > 0 ? 'border-warning/40 bg-warning/10 text-fg' : 'border-border bg-surface text-muted'}`}
        >
          {stats.liquidations > 0 ? (
            <>
              <span className="font-medium text-warning-text">
                {stats.liquidations} {stats.liquidations === 1 ? 'trade was' : 'trades were'} <GlossaryTerm id="liquidation">liquidated</GlossaryTerm>.
              </span>{' '}
              Each one lost all the money put into that trade. At {config.futures.leverage}x that takes a move of only about{' '}
              <span className="num">{((1 / config.futures.leverage - config.futures.maintenanceMarginRate) * 100).toFixed(1)}%</span> against you. A stop-loss
              nearer than that would have closed the trade first for a smaller loss.
              {finalEquity <= config.initialCapital * 0.001 && ' The account was emptied, so no more trades were taken.'}
            </>
          ) : (
            <>No trades were liquidated at {config.futures.leverage}x in this period.</>
          )}
        </div>
      )}

      <Card title="Account growth: strategy against buy and hold">
        {result.equityCurve.length > 1 ? (
          <LineDiagram
            ariaLabel={`Account growth over the test. Strategy ended at ${pct(stats.totalReturnPct)}, buy and hold at ${pct(stats.buyHoldReturnPct)}.`}
            series={[
              { points: asReturns(result.equityCurve, config.initialCapital), label: `Strategy ${pct(stats.totalReturnPct, 1)}` },
              { points: asReturns(result.buyHoldCurve, config.initialCapital), color: 'var(--c-muted)', dashed: true, label: `Buy and hold ${pct(stats.buyHoldReturnPct, 1)}` },
            ]}
            formatX={(x) => dateOf(x).slice(0, 7)}
            formatY={(y) => `${y > 0 ? '+' : ''}${Math.round(y)}%`}
            height={240}
          />
        ) : (
          <p className="text-sm text-muted">Not enough candles to draw a curve.</p>
        )}
      </Card>

      <Card title="Trades on the chart" flush>
        <div className="h-[420px]">
          <PriceChart candles={candles} chartType="candles" timeframe={config.timeframe} tickSize={tickSize} title={name} viewKey={`${result.id}:${phone}`} showVolume={false} embedded={phone}>
            <IndicatorLayer indicators={indicators} />
            <TradeMarkerLayer markers={markers} />
          </PriceChart>
        </div>
        <p className="border-t border-border px-4 py-2 text-xs text-muted">
          Arrows mark each entry and exit. Signals are read at a candle&apos;s close and filled at the next candle&apos;s open, so the strategy never acts on a price
          it could not have known. {phone ? 'Drag sideways to move, pinch to zoom.' : 'Drag to move, scroll to zoom.'}
        </p>
      </Card>

      <Card title={`Trades (${trades.length})`} flush>
        <DataTable
          label="Backtest trades"
          dense
          className="max-h-96"
          columns={columns}
          rows={trades.map((t, i) => ({ ...t, n: i + 1 }))}
          rowKey={(t) => String(t.n)}
          initialSort={{ id: 'n', dir: 'asc' }}
          empty={<p className="px-4 py-6 text-center text-sm text-muted">No trades in this period.</p>}
        />
      </Card>
    </div>
  );
}

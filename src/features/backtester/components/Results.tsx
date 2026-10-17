import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { IndicatorLayer, LineDiagram, PriceChart, TradeMarkerLayer, type TradeMarker } from '@/components/chart';
import { Badge, Card, DataTable, GlossaryTerm, Pnl, StatTile, toneOf, Trans, useIsPhone, useIsTouch, type Column } from '@/components/ui';
import { t } from '@/i18n';
import { ruleLabel, strategyIndicators } from '@/lib/backtest';
import { displaySymbol, findInstrument, TIMEFRAME_NAMES, TIMEFRAME_SECONDS } from '@/lib/data';
import { formatMoney, formatPrice, formatSignedMoney, formatSignedPct } from '@/lib/format';
import type { BacktestResult, BacktestTrade, Candle, EquityPoint, IndicatorConfig } from '@/types';

const EXIT_LABELS: Record<BacktestTrade['exitReason'], string> = {
  rule: t('Exit rule'),
  stop_loss: t('Stop-loss'),
  take_profit: t('Take-profit'),
  liquidation: t('Liquidated'),
  end_of_data: t('End of test'),
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
  if (stats.tradeCount === 0) return t('The entry rule was never true in this period, so the strategy made no trades. Try a longer period or a looser rule.');
  const gap = stats.totalReturnPct - stats.buyHoldReturnPct;
  const values = { pct: Math.abs(stats.totalReturnPct).toFixed(1), gap: Math.abs(gap).toFixed(1), hold: pct(stats.buyHoldReturnPct, 1) };
  const made = stats.totalReturnPct >= 0;
  if (Math.abs(gap) < 0.5) {
    return made
      ? t('The strategy made {pct}%, about the same as buying at the start and holding ({hold}).', values)
      : t('The strategy lost {pct}%, about the same as buying at the start and holding ({hold}).', values);
  }
  if (gap > 0) {
    return made
      ? t('The strategy made {pct}%, {gap} percentage points better than buying at the start and holding ({hold}).', values)
      : t('The strategy lost {pct}%, {gap} percentage points better than buying at the start and holding ({hold}).', values);
  }
  return made
    ? t('The strategy made {pct}%, {gap} percentage points worse than buying at the start and holding ({hold}).', values)
    : t('The strategy lost {pct}%, {gap} percentage points worse than buying at the start and holding ({hold}).', values);
}

export function Results({ result, candles }: { result: BacktestResult; candles: Candle[] }) {
  const { stats, trades, config, strategy } = result;
  const instrument = findInstrument(config.symbol);
  const name = instrument ? displaySymbol(instrument) : config.symbol;
  const tickSize = instrument?.tickSize ?? 0.01;
  const intraday = TIMEFRAME_SECONDS[config.timeframe] < 86_400;
  const finalEquity = result.equityCurve.length ? result.equityCurve[result.equityCurve.length - 1].equity : config.initialCapital;
  const long = strategy.direction === 'long';
  const wins = trades.filter((trade) => trade.pnl > 0).length;
  // On a phone the chart leaves vertical swipes to the page, so the results stay scrollable.
  const phone = useIsPhone();
  const touch = useIsTouch();

  const markers = useMemo<TradeMarker[]>(() => {
    const step = TIMEFRAME_SECONDS[config.timeframe];
    const times = new Set(candles.map((c) => c.time));
    // An exit is stamped with the close of its candle; the marker goes on that candle.
    const candleOf = (ms: number, closes: boolean) => {
      const time = ms / 1000 - (closes ? step : 0);
      return times.has(time) ? time : ms / 1000;
    };
    return trades
      .flatMap((trade) => [
        { time: candleOf(trade.entryTime, false), side: long ? ('buy' as const) : ('sell' as const), text: long ? t('Buy') : t('Short') },
        {
          time: candleOf(trade.exitTime, trade.exitReason !== 'rule'),
          side: long ? ('sell' as const) : ('buy' as const),
          text:
            trade.exitReason === 'stop_loss'
              ? t('Stop')
              : trade.exitReason === 'take_profit'
                ? t('Target')
                : trade.exitReason === 'liquidation'
                  ? t('Liq.')
                  : long
                    ? t('Sell')
                    : t('Cover'),
        },
      ])
      .filter((m) => times.has(m.time));
  }, [trades, candles, config.timeframe, long]);

  const indicators = useMemo<IndicatorConfig[]>(() => strategyIndicators(strategy).map((i, n) => ({ key: `bt-${n}`, id: i.id, params: i.params, visible: true })), [strategy]);

  const columns: Column<BacktestTrade & { n: number }>[] = [
    { id: 'n', header: '#', cell: (trade) => trade.n, sortValue: (trade) => trade.n, numeric: true },
    { id: 'entry', header: t('Entered'), cell: (trade) => stamp(trade.entryTime, intraday), sortValue: (trade) => trade.entryTime, numeric: true },
    { id: 'exit', header: t('Exited'), cell: (trade) => stamp(trade.exitTime, intraday), sortValue: (trade) => trade.exitTime, numeric: true, hideOnPhone: true },
    { id: 'entryPrice', header: t('Entry'), cell: (trade) => formatPrice(trade.entryPrice, tickSize), align: 'right', numeric: true, hideOnPhone: true },
    { id: 'exitPrice', header: t('Exit'), cell: (trade) => formatPrice(trade.exitPrice, tickSize), align: 'right', numeric: true, hideOnPhone: true },
    { id: 'pnl', header: t('Profit / loss'), cell: (trade) => <Pnl value={trade.pnl} />, sortValue: (trade) => trade.pnl, align: 'right', numeric: true },
    { id: 'return', header: t('Return'), cell: (trade) => <Pnl value={trade.returnPct / 100} format="pct" />, sortValue: (trade) => trade.returnPct, align: 'right', numeric: true },
    {
      id: 'reason',
      header: t('Closed by'),
      cell: (trade) => (
        <Badge tone={trade.exitReason === 'liquidation' ? 'warning' : trade.exitReason === 'take_profit' ? 'up' : trade.exitReason === 'stop_loss' ? 'down' : 'neutral'}>
          {EXIT_LABELS[trade.exitReason]}
        </Badge>
      ),
      sortValue: (trade) => trade.exitReason,
    },
  ];

  const exitExtras = [
    strategy.stopLossPct != null ? t(', or at a {pct}% stop-loss', { pct: strategy.stopLossPct }) : '',
    strategy.takeProfitPct != null ? t(', or at a {pct}% take-profit', { pct: strategy.takeProfitPct }) : '',
  ].join('');

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-fg">{t('{strategy} on {symbol}', { strategy: strategy.name || t('Untitled strategy'), symbol: name })}</h2>
        <p className="num mt-0.5 text-xs text-muted">
          {t('{timeframe} candles', { timeframe: TIMEFRAME_NAMES[config.timeframe] })} ·{' '}
          {t('{from} to {to}', { from: dateOf(config.from), to: dateOf(Math.min(config.to, result.ranAt)) })} · {long ? t('Long') : t('Short')}
          {config.futures ? ` · ${t('{n}x futures', { n: config.futures.leverage })}` : ''}
        </p>
        <p className="mt-2 text-sm text-fg">{verdict(result)}</p>
        <p className="mt-1 text-xs text-muted">
          {t('Enter when {entry}. Exit when {exit}{extras}.', { entry: ruleLabel(strategy.entry), exit: ruleLabel(strategy.exit), extras: exitExtras })}
        </p>
      </header>

      <div role="note" className="flex items-start gap-2.5 rounded-card border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
        <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-text" />
        <div>
          <p className="font-medium text-warning-text">{t('Past results do not predict future returns')}</p>
          <p className="mt-1 text-fg">
            <Trans
              text="A backtest shows how a rule would have done on one stretch of history. Change the numbers until that stretch looks good and you have fitted the rule to the past, not found something that works. That is {overfitting}. Before believing a result, run the same rule on other symbols and other periods, and distrust anything that only works with one exact setting."
              values={{ overfitting: <GlossaryTerm id="overfitting">{t('overfitting')}</GlossaryTerm> }}
            />
          </p>
          {stats.tradeCount > 0 && stats.tradeCount < 30 && (
            <p className="mt-1 text-fg">
              {stats.tradeCount === 1 ? (
                t('This test has only 1 trade. That is too few to tell a good rule from a lucky one.')
              ) : (
                <Trans
                  text="This test has only {n} trades. That is too few to tell a good rule from a lucky one."
                  values={{ n: <span className="num">{stats.tradeCount}</span> }}
                />
              )}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label={t('Total return')}
          value={pct(stats.totalReturnPct)}
          tone={toneOf(stats.totalReturnPct)}
          sub={t('{start} became {end}', { start: formatMoney(config.initialCapital), end: formatMoney(finalEquity) })}
        />
        <StatTile
          label={t('Buy and hold')}
          value={pct(stats.buyHoldReturnPct)}
          tone={toneOf(stats.buyHoldReturnPct)}
          sub={
            stats.totalReturnPct >= stats.buyHoldReturnPct
              ? t('Strategy ahead by {n} pts', { n: Math.abs(stats.totalReturnPct - stats.buyHoldReturnPct).toFixed(2) })
              : t('Strategy behind by {n} pts', { n: Math.abs(stats.totalReturnPct - stats.buyHoldReturnPct).toFixed(2) })
          }
        />
        <StatTile
          label={<GlossaryTerm id="win-rate">{t('Win rate')}</GlossaryTerm>}
          value={stats.tradeCount ? `${(stats.winRate * 100).toFixed(1)}%` : '–'}
          sub={t('{wins} of {n} trades won', { wins, n: stats.tradeCount })}
        />
        <StatTile
          label={t('Average win / loss')}
          value={
            stats.tradeCount ? (
              <>
                <span className="text-up-text">{formatSignedMoney(stats.avgWin, 0)}</span> <span className="text-muted">/</span>{' '}
                <span className="text-down-text">{formatSignedMoney(stats.avgLoss, 0)}</span>
              </>
            ) : (
              '–'
            )
          }
          sub={
            <Trans
              text="{expectancy} {amount} per trade"
              values={{ expectancy: <GlossaryTerm id="expectancy">{t('Expectancy')}</GlossaryTerm>, amount: formatSignedMoney(stats.expectancy) }}
            />
          }
        />
        <StatTile
          label={<GlossaryTerm id="profit-factor">{t('Profit factor')}</GlossaryTerm>}
          value={stats.tradeCount === 0 ? '–' : Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : t('No losses')}
          tone={stats.tradeCount === 0 ? 'neutral' : stats.profitFactor >= 1 ? 'up' : 'down'}
          sub={t('Money won ÷ money lost. Above 1 is profitable.')}
        />
        <StatTile
          label={<GlossaryTerm id="drawdown">{t('Max drawdown')}</GlossaryTerm>}
          value={stats.maxDrawdownPct > 0 ? `-${stats.maxDrawdownPct.toFixed(2)}%` : '0.00%'}
          tone={stats.maxDrawdownPct > 0 ? 'down' : 'neutral'}
          sub={t('Worst fall from a peak')}
        />
        <StatTile
          label={<GlossaryTerm id="sharpe-ratio">{t('Sharpe ratio')}</GlossaryTerm>}
          value={stats.sharpe.toFixed(2)}
          tone={toneOf(stats.sharpe)}
          sub={t('Return per unit of bumpiness, per year')}
        />
        <StatTile
          label={t('Costs')}
          value={formatMoney(stats.totalFees + Math.max(0, stats.totalFunding))}
          sub={
            config.futures
              ? stats.totalFunding >= 0
                ? t('Fees {fees} · funding paid {funding}', { fees: formatMoney(stats.totalFees), funding: formatMoney(stats.totalFunding) })
                : t('Fees {fees} · funding received {funding}', { fees: formatMoney(stats.totalFees), funding: formatMoney(-stats.totalFunding) })
              : t('Fees on every fill')
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
                {stats.liquidations === 1 ? (
                  <Trans text="1 trade was {liquidated}." values={{ liquidated: <GlossaryTerm id="liquidation">{t('liquidated')}</GlossaryTerm> }} />
                ) : (
                  <Trans
                    text="{n} trades were {liquidated}."
                    values={{ n: stats.liquidations, liquidated: <GlossaryTerm id="liquidation">{t('liquidated')}</GlossaryTerm> }}
                  />
                )}
              </span>{' '}
              <Trans
                text="Each one lost all the money put into that trade. At {leverage}x that takes a move of only about {move} against you. A stop-loss nearer than that would have closed the trade first for a smaller loss."
                values={{
                  leverage: config.futures.leverage,
                  move: <span className="num">{((1 / config.futures.leverage - config.futures.maintenanceMarginRate) * 100).toFixed(1)}%</span>,
                }}
              />
              {finalEquity <= config.initialCapital * 0.001 && ` ${t('The account was emptied, so no more trades were taken.')}`}
            </>
          ) : (
            t('No trades were liquidated at {n}x in this period.', { n: config.futures.leverage })
          )}
        </div>
      )}

      <Card title={t('Account growth: strategy against buy and hold')}>
        {result.equityCurve.length > 1 ? (
          <LineDiagram
            ariaLabel={t('Account growth over the test. Strategy ended at {strategy}, buy and hold at {hold}.', {
              strategy: pct(stats.totalReturnPct),
              hold: pct(stats.buyHoldReturnPct),
            })}
            series={[
              { points: asReturns(result.equityCurve, config.initialCapital), label: t('Strategy {pct}', { pct: pct(stats.totalReturnPct, 1) }) },
              {
                points: asReturns(result.buyHoldCurve, config.initialCapital),
                color: 'var(--c-muted)',
                dashed: true,
                label: t('Buy and hold {pct}', { pct: pct(stats.buyHoldReturnPct, 1) }),
              },
            ]}
            formatX={(x) => dateOf(x).slice(0, 7)}
            formatY={(y) => `${y > 0 ? '+' : ''}${Math.round(y)}%`}
            height={240}
          />
        ) : (
          <p className="text-sm text-muted">{t('Not enough candles to draw a curve.')}</p>
        )}
      </Card>

      <Card title={t('Trades on the chart')} flush>
        <div className="h-[420px]">
          <PriceChart candles={candles} chartType="candles" timeframe={config.timeframe} tickSize={tickSize} title={name} viewKey={`${result.id}:${phone}`} showVolume={false} embedded={phone}>
            <IndicatorLayer indicators={indicators} />
            <TradeMarkerLayer markers={markers} />
          </PriceChart>
        </div>
        <p className="border-t border-border px-4 py-2 text-xs text-muted">
          {t(
            "Arrows mark each entry and exit. Signals are read at a candle's close and filled at the next candle's open, so the strategy never acts on a price it could not have known.",
          )}{' '}
          {touch ? t('Drag sideways to move, pinch to zoom.') : t('Drag to move, scroll to zoom.')}
        </p>
      </Card>

      <Card title={t('Trades ({n})', { n: trades.length })} flush>
        <DataTable
          label={t('Backtest trades')}
          dense
          className="max-h-96"
          columns={columns}
          rows={trades.map((trade, i) => ({ ...trade, n: i + 1 }))}
          rowKey={(trade) => String(trade.n)}
          initialSort={{ id: 'n', dir: 'asc' }}
          empty={<p className="px-4 py-6 text-center text-sm text-muted">{t('No trades in this period.')}</p>}
        />
      </Card>
    </div>
  );
}

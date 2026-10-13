import { useEffect, useRef, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Button, Card, DataTable, EmptyState, ErrorState, LoadingState, Pnl, Tabs, useMediaQuery, type Column } from '@/components/ui';
import { displaySymbol, findInstrument } from '@/lib/data';
import { useBacktest, type BacktestRunSummary } from '@/stores';
import { Results } from './Results';
import { StrategyBuilder } from './StrategyBuilder';

const HISTORY_COLUMNS: Column<BacktestRunSummary>[] = [
  { id: 'when', header: 'Run', cell: (r) => new Date(r.ranAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), sortValue: (r) => r.ranAt, hideOnPhone: true },
  { id: 'strategy', header: 'Strategy', cell: (r) => r.strategyName, sortValue: (r) => r.strategyName },
  {
    id: 'market',
    header: 'Tested on',
    cell: (r) => {
      const instrument = findInstrument(r.symbol);
      return `${instrument ? displaySymbol(instrument) : r.symbol} ${r.timeframe}${r.leverage > 1 ? ` ${r.leverage}x` : ''}`;
    },
    numeric: true,
  },
  { id: 'period', header: 'Period', cell: (r) => `${r.from} to ${r.to}`, numeric: true, hideOnPhone: true },
  { id: 'return', header: 'Return', cell: (r) => <Pnl value={r.totalReturnPct / 100} format="pct" />, sortValue: (r) => r.totalReturnPct, align: 'right', numeric: true },
  { id: 'hold', header: 'Buy and hold', cell: (r) => <Pnl value={r.buyHoldReturnPct / 100} format="pct" />, sortValue: (r) => r.buyHoldReturnPct, align: 'right', numeric: true },
  { id: 'dd', header: 'Max drawdown', cell: (r) => `-${r.maxDrawdownPct.toFixed(1)}%`, sortValue: (r) => r.maxDrawdownPct, align: 'right', numeric: true, hideOnPhone: true },
  { id: 'trades', header: 'Trades', cell: (r) => r.tradeCount, sortValue: (r) => r.tradeCount, align: 'right', numeric: true },
];

/** Past runs side by side, to see how much a result moves when the symbol, period or a number changes. */
function RunHistory() {
  const history = useBacktest((s) => s.history);
  const clearHistory = useBacktest((s) => s.clearHistory);
  if (history.length === 0) return null;
  return (
    <Card
      title="Your recent runs"
      flush
      actions={
        <Button size="sm" variant="ghost" onClick={clearHistory}>
          Clear
        </Button>
      }
    >
      <DataTable label="Recent backtest runs" dense columns={HISTORY_COLUMNS} rows={history} rowKey={(r) => r.id} initialSort={{ id: 'when', dir: 'desc' }} />
      <p className="border-t border-border px-4 py-2 text-xs text-muted">
        Compare runs of the same rule on different symbols and periods. A rule that only works in one row is probably fitted to that row.
      </p>
    </Card>
  );
}

function ResultsPane() {
  const { status, error, result, candles, progress, run } = useBacktest();
  return (
    <div className="flex flex-col gap-4">
      {status === 'running' && <LoadingState className="rounded-card border border-border" label={`Loading price history ${Math.round(progress * 100)}%`} />}
      {status === 'error' && <ErrorState className="rounded-card border border-border" title="The backtest could not run" message={error} onRetry={() => void run()} />}
      {status !== 'running' && status !== 'error' && result && <Results result={result} candles={candles} />}
      {status === 'idle' && !result && (
        <EmptyState
          className="rounded-card border border-border py-16"
          icon={<FlaskConical aria-hidden />}
          title="No results yet"
          description="Pick a preset or build your own rules, choose what to test them on, then press Run backtest. The results appear here: return, win rate, drawdown, an account curve against buy and hold, and every trade marked on the chart."
        />
      )}
      <RunHistory />
    </div>
  );
}

type Pane = 'strategy' | 'results';

/** Rule builder on the left, results on the right. On narrow screens the two are tabs. */
export function BacktesterPage() {
  const wide = useMediaQuery('(min-width: 1024px)');
  const status = useBacktest((s) => s.status);
  const [pane, setPane] = useState<Pane>('strategy');

  // On a narrow screen, show the results as soon as a run starts.
  const previous = useRef(status);
  useEffect(() => {
    if (status === 'running' && previous.current !== 'running') setPane('results');
    previous.current = status;
  }, [status]);

  // Each tab starts at its top.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [pane]);

  const intro = (
    <header>
      <h1 className="text-xl font-semibold text-fg">Backtester</h1>
      <p className="mt-1 text-sm text-muted">Test a trading rule on past prices, with no code. See what it would have done, and how fragile that result is.</p>
    </header>
  );

  if (wide) {
    return (
      <div className="grid h-full grid-cols-[25rem_minmax(0,1fr)]">
        <aside aria-label="Strategy builder" className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto border-r border-border p-4 pb-0">
          {intro}
          <StrategyBuilder />
        </aside>
        <section aria-label="Results" className="h-full min-h-0 overflow-y-auto p-4 md:p-6">
          <ResultsPane />
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-4 pt-3">
        {intro}
        <Tabs<Pane>
          className="mt-2"
          label="Backtester sections"
          idBase="backtester"
          value={pane}
          onChange={setPane}
          items={[
            { id: 'strategy', label: 'Strategy' },
            { id: 'results', label: 'Results' },
          ]}
        />
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto p-4 pb-0" role="tabpanel" id={`backtester-panel-${pane}`} aria-labelledby={`backtester-tab-${pane}`}>
        {pane === 'strategy' ? <StrategyBuilder /> : <div className="pb-4"><ResultsPane /></div>}
      </div>
    </div>
  );
}

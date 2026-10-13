import { AlertTriangle, Play, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Select, Slider, Spinner, Switch, Tabs, toast } from '@/components/ui';
import { BACKTEST_PRESETS } from '@/content/strategies';
import { validateStrategy } from '@/lib/backtest';
import { displaySymbol, findInstrument, instrumentsOfKind, TIMEFRAME_NAMES } from '@/lib/data';
import { DEFAULT_FUNDING_RATE, DEFAULT_MAINTENANCE_MARGIN_RATE, liquidationPrice } from '@/lib/trading/futures';
import { useBacktest, useSettings } from '@/stores';
import type { Direction, Timeframe } from '@/types';
import { RuleEditor } from './RuleEditor';

const RANGES = [
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
  { label: '2 years', days: 730 },
  { label: '5 years', days: 1826 },
];
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const percent = (fraction: number) => `${Number((fraction * 100).toFixed(3))}%`;

/** An optional percentage: blank means not used. */
function PercentInput({ label, hint, value, onChange }: { label: string; hint: string; value: number | undefined; onChange: (value: number | undefined) => void }) {
  return (
    <Input
      label={label}
      hint={hint}
      type="number"
      numeric
      min={0}
      step="any"
      suffix="%"
      placeholder="None"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    />
  );
}

/** The left column: the strategy's rules, what to test it on, and the Run button. */
export function StrategyBuilder() {
  const { strategy, saved, setup, status, progress, edit, load, save, remove, configure, run } = useBacktest();
  const feeRate = useSettings((s) => s.feeRate);
  const slippagePct = useSettings((s) => s.slippagePct);

  const instrument = findInstrument(setup.symbol) ?? instrumentsOfKind('spot')[0];
  const timeframe = instrument.timeframes.includes(setup.timeframe) ? setup.timeframe : instrument.timeframes[instrument.timeframes.length - 1];
  const canLeverage = instrument.assetClass === 'crypto';
  const futures = setup.futures && canLeverage;
  const problems = validateStrategy(strategy);
  const running = status === 'running';
  const isSaved = saved.some((s) => s.id === strategy.id);
  const listed = strategy.preset || isSaved;
  const long = strategy.direction === 'long';

  // How far price must move against a trade to liquidate it, as a fraction.
  const liquidationMove = Math.abs(liquidationPrice(strategy.direction, 1, setup.leverage, DEFAULT_MAINTENANCE_MARGIN_RATE) - 1);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void run();
      }}
    >
      <Card title="Strategy">
        <div className="flex flex-col gap-3">
          <Select
            label="Start from"
            value={listed ? strategy.id : ''}
            onChange={(id) => id && load(id)}
            options={[
              ...(listed ? [] : [{ value: '', label: 'Your unsaved strategy' }]),
              ...BACKTEST_PRESETS.map((p) => ({ value: p.id, label: `Preset · ${p.name}` })),
              ...saved.map((s) => ({ value: s.id, label: `Saved · ${s.name}` })),
            ]}
          />
          {strategy.preset && strategy.description && <p className="text-xs leading-relaxed text-muted">{strategy.description}</p>}
          <Input label="Name" value={strategy.name} maxLength={60} onChange={(e) => edit({ name: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              icon={<Save aria-hidden className="size-3.5" />}
              onClick={() => {
                if (save()) toast.success('Strategy saved', strategy.preset ? 'Saved as your own copy of the preset.' : undefined);
                else toast.error('Give the strategy a name first');
              }}
            >
              {strategy.preset ? 'Save as my own' : 'Save'}
            </Button>
            {isSaved && (
              <Button
                size="sm"
                variant="ghost"
                icon={<Trash2 aria-hidden className="size-3.5" />}
                onClick={() => {
                  remove(strategy.id);
                  toast.info('Removed from saved strategies', 'It stays in the editor until you load another.');
                }}
              >
                Delete saved
              </Button>
            )}
          </div>
          <div>
            <p className="mb-1 text-xs text-muted">Direction</p>
            <Tabs<Direction>
              label="Direction"
              idBase="bt-direction"
            choice
              variant="pill"
              value={strategy.direction}
              onChange={(direction) => edit({ direction })}
              items={[
                { id: 'long', label: 'Long (buy first)' },
                { id: 'short', label: 'Short (sell first)' },
              ]}
            />
            <p className="mt-1 text-xs text-muted">{long ? 'Profits when price rises after entry.' : 'Profits when price falls after entry.'}</p>
          </div>
        </div>
      </Card>

      <Card title={long ? 'Enter (buy) when' : 'Enter (sell short) when'}>
        <RuleEditor name="Entry" rule={strategy.entry} onChange={(entry) => edit({ entry })} emptyText="No entry condition yet. Without one the strategy never trades." />
      </Card>

      <Card title={long ? 'Exit (sell) when' : 'Exit (buy back) when'}>
        <div className="flex flex-col gap-3">
          <RuleEditor name="Exit" rule={strategy.exit} onChange={(exit) => edit({ exit })} emptyText="No exit condition. Trades close only at the stop-loss or take-profit below." />
          <div className="grid grid-cols-2 gap-3">
            <PercentInput label="Stop-loss" hint={long ? 'Below entry' : 'Above entry'} value={strategy.stopLossPct} onChange={(stopLossPct) => edit({ stopLossPct })} />
            <PercentInput label="Take-profit" hint={long ? 'Above entry' : 'Below entry'} value={strategy.takeProfitPct} onChange={(takeProfitPct) => edit({ takeProfitPct })} />
          </div>
          <p className="text-xs text-muted">Whichever comes first closes the trade: the exit condition, the stop-loss or the take-profit.</p>
        </div>
      </Card>

      <Card title="Test it on">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Symbol" value={instrument.symbol} onChange={(symbol) => configure({ symbol })} options={instrumentsOfKind('spot').map((i) => ({ value: i.symbol, label: displaySymbol(i) }))} />
            <Select<Timeframe> label="Candle size" value={timeframe} onChange={(next) => configure({ timeframe: next })} options={instrument.timeframes.map((tf) => ({ value: tf, label: TIMEFRAME_NAMES[tf] }))} />
            <Input label="From" type="date" className="num" max={setup.to} value={setup.from} onChange={(e) => configure({ from: e.target.value })} />
            <Input label="To" type="date" className="num" min={setup.from} max={isoDay(Date.now())} value={setup.to} onChange={(e) => configure({ to: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick periods, ending today">
            {RANGES.map((r) => (
              <Button key={r.label} size="sm" variant="ghost" className="border border-border" onClick={() => configure({ from: isoDay(Date.now() - r.days * 86_400_000), to: isoDay(Date.now()) })}>
                Last {r.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Starting capital"
              type="number"
              numeric
              min={1}
              step="any"
              prefix="$"
              value={Number.isFinite(setup.initialCapital) ? setup.initialCapital : ''}
              onChange={(e) => configure({ initialCapital: e.target.value === '' ? NaN : Number(e.target.value) })}
            />
            <Input
              label="Size per trade"
              hint="Share of the account"
              type="number"
              numeric
              min={1}
              max={100}
              step="any"
              suffix="%"
              value={Number.isFinite(strategy.positionSizePct) ? strategy.positionSizePct : ''}
              onChange={(e) => edit({ positionSizePct: e.target.value === '' ? NaN : Number(e.target.value) })}
            />
          </div>

          {canLeverage ? (
            <Switch
              label="Trade it as futures"
              description="Adds leverage, funding costs and liquidation, so a leveraged idea is tested with its real risks."
              checked={setup.futures}
              onChange={(on) => configure({ futures: on })}
            />
          ) : (
            <p className="text-xs text-muted">Leverage is available on the crypto symbols only.</p>
          )}
          {futures && (
            <>
              <Slider label="Leverage" min={1} max={20} step={1} value={setup.leverage} onChange={(leverage) => configure({ leverage })} format={(v) => `${v}x`} />
              <p className="text-xs text-muted">
                At {setup.leverage}x each trade is liquidated, losing all the money put into it, if price moves about{' '}
                <span className="num text-fg">{(liquidationMove * 100).toFixed(1)}%</span> {long ? 'down' : 'up'} from entry.
              </p>
              {setup.leverage > 5 && (
                <p className="flex items-start gap-2 rounded-control border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-text">
                  <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  Above 5x, ordinary daily swings are enough to liquidate a trade. Watch the liquidation count in the results.
                </p>
              )}
              <Switch
                label="Charge funding"
                description={`${percent(DEFAULT_FUNDING_RATE)} of the position every 8 hours, paid by longs and received by shorts. A fixed, typical rate; real funding changes.`}
                checked={setup.applyFunding}
                onChange={(on) => configure({ applyFunding: on })}
              />
            </>
          )}
          <p className="text-xs text-muted">
            Every fill pays a {percent(feeRate)} fee and {percent(slippagePct)} slippage. Change these in{' '}
            <Link to="/settings" className="text-accent-text underline underline-offset-2">
              Settings
            </Link>
            .
          </p>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-1 flex flex-col gap-2 bg-bg px-1 pt-1 pb-2">
        {problems.length > 0 && (
          <ul className="rounded-control border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-text" aria-label="Problems to fix before running">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <Button type="submit" variant="primary" size="lg" disabled={running || problems.length > 0} icon={running ? undefined : <Play aria-hidden className="size-4" />}>
          {running ? <Spinner label={`Loading history ${Math.round(progress * 100)}%`} className="text-current" /> : 'Run backtest'}
        </Button>
      </div>
    </form>
  );
}

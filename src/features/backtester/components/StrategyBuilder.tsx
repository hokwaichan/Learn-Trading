import { AlertTriangle, Play, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Select, Slider, Spinner, Switch, Tabs, toast, Trans } from '@/components/ui';
import { BACKTEST_PRESETS } from '@/content/strategies';
import { t } from '@/i18n';
import { validateStrategy } from '@/lib/backtest';
import { displaySymbol, findInstrument, instrumentsOfKind, TIMEFRAME_NAMES } from '@/lib/data';
import { DEFAULT_FUNDING_RATE, DEFAULT_MAINTENANCE_MARGIN_RATE, liquidationPrice } from '@/lib/trading/futures';
import { useBacktest, useSettings } from '@/stores';
import type { Direction, Timeframe } from '@/types';
import { RuleEditor } from './RuleEditor';

const RANGES = [
  { label: t('Last 6 months'), days: 182 },
  { label: t('Last 1 year'), days: 365 },
  { label: t('Last 2 years'), days: 730 },
  { label: t('Last 5 years'), days: 1826 },
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
      placeholder={t('None')}
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
      <Card title={t('Strategy')}>
        <div className="flex flex-col gap-3">
          <Select
            label={t('Start from')}
            value={listed ? strategy.id : ''}
            onChange={(id) => id && load(id)}
            options={[
              ...(listed ? [] : [{ value: '', label: t('Your unsaved strategy') }]),
              ...BACKTEST_PRESETS.map((p) => ({ value: p.id, label: t('Preset · {name}', { name: p.name }) })),
              ...saved.map((s) => ({ value: s.id, label: t('Saved · {name}', { name: s.name }) })),
            ]}
          />
          {strategy.preset && strategy.description && <p className="text-xs leading-relaxed text-muted">{strategy.description}</p>}
          <Input label={t('Name')} value={strategy.name} maxLength={60} onChange={(e) => edit({ name: e.target.value })} />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              icon={<Save aria-hidden className="size-3.5" />}
              onClick={() => {
                if (save()) toast.success(t('Strategy saved'), strategy.preset ? t('Saved as your own copy of the preset.') : undefined);
                else toast.error(t('Give the strategy a name first'));
              }}
            >
              {strategy.preset ? t('Save as my own') : t('Save')}
            </Button>
            {isSaved && (
              <Button
                size="sm"
                variant="ghost"
                icon={<Trash2 aria-hidden className="size-3.5" />}
                onClick={() => {
                  remove(strategy.id);
                  toast.info(t('Removed from saved strategies'), t('It stays in the editor until you load another.'));
                }}
              >
                {t('Delete saved')}
              </Button>
            )}
          </div>
          <div>
            <p className="mb-1 text-xs text-muted">{t('Direction')}</p>
            <Tabs<Direction>
              label={t('Direction')}
              idBase="bt-direction"
            choice
              variant="pill"
              value={strategy.direction}
              onChange={(direction) => edit({ direction })}
              items={[
                { id: 'long', label: t('Long (buy first)') },
                { id: 'short', label: t('Short (sell first)') },
              ]}
            />
            <p className="mt-1 text-xs text-muted">{long ? t('Profits when price rises after entry.') : t('Profits when price falls after entry.')}</p>
          </div>
        </div>
      </Card>

      <Card title={long ? t('Enter (buy) when') : t('Enter (sell short) when')}>
        <RuleEditor name={t('Entry')} rule={strategy.entry} onChange={(entry) => edit({ entry })} emptyText={t('No entry condition yet. Without one the strategy never trades.')} />
      </Card>

      <Card title={long ? t('Exit (sell) when') : t('Exit (buy back) when')}>
        <div className="flex flex-col gap-3">
          <RuleEditor name={t('Exit')} rule={strategy.exit} onChange={(exit) => edit({ exit })} emptyText={t('No exit condition. Trades close only at the stop-loss or take-profit below.')} />
          <div className="grid grid-cols-2 gap-3">
            <PercentInput label={t('Stop-loss')} hint={long ? t('Below entry') : t('Above entry')} value={strategy.stopLossPct} onChange={(stopLossPct) => edit({ stopLossPct })} />
            <PercentInput label={t('Take-profit')} hint={long ? t('Above entry') : t('Below entry')} value={strategy.takeProfitPct} onChange={(takeProfitPct) => edit({ takeProfitPct })} />
          </div>
          <p className="text-xs text-muted">{t('Whichever comes first closes the trade: the exit condition, the stop-loss or the take-profit.')}</p>
        </div>
      </Card>

      <Card title={t('Test it on')}>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Select label={t('Symbol')} value={instrument.symbol} onChange={(symbol) => configure({ symbol })} options={instrumentsOfKind('spot').map((i) => ({ value: i.symbol, label: displaySymbol(i) }))} />
            <Select<Timeframe> label={t('Candle size')} value={timeframe} onChange={(next) => configure({ timeframe: next })} options={instrument.timeframes.map((tf) => ({ value: tf, label: TIMEFRAME_NAMES[tf] }))} />
            <Input label={t('From')} type="date" className="num" max={setup.to} value={setup.from} onChange={(e) => configure({ from: e.target.value })} />
            <Input label={t('To')} type="date" className="num" min={setup.from} max={isoDay(Date.now())} value={setup.to} onChange={(e) => configure({ to: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Quick periods, ending today')}>
            {RANGES.map((r) => (
              <Button key={r.label} size="sm" variant="ghost" className="border border-border" onClick={() => configure({ from: isoDay(Date.now() - r.days * 86_400_000), to: isoDay(Date.now()) })}>
                {r.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('Starting capital')}
              type="number"
              numeric
              min={1}
              step="any"
              prefix="$"
              value={Number.isFinite(setup.initialCapital) ? setup.initialCapital : ''}
              onChange={(e) => configure({ initialCapital: e.target.value === '' ? NaN : Number(e.target.value) })}
            />
            <Input
              label={t('Size per trade')}
              hint={t('Share of the account')}
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
              label={t('Trade it as futures')}
              description={t('Adds leverage, funding costs and liquidation, so a leveraged idea is tested with its real risks.')}
              checked={setup.futures}
              onChange={(on) => configure({ futures: on })}
            />
          ) : (
            <p className="text-xs text-muted">{t('Leverage is available on the crypto symbols only.')}</p>
          )}
          {futures && (
            <>
              <Slider label={t('Leverage')} min={1} max={20} step={1} value={setup.leverage} onChange={(leverage) => configure({ leverage })} format={(v) => `${v}x`} />
              <p className="text-xs text-muted">
                {long ? (
                  <Trans
                    text="At {leverage}x each trade is liquidated, losing all the money put into it, if price moves about {move} down from entry."
                    values={{ leverage: setup.leverage, move: <span className="num text-fg">{(liquidationMove * 100).toFixed(1)}%</span> }}
                  />
                ) : (
                  <Trans
                    text="At {leverage}x each trade is liquidated, losing all the money put into it, if price moves about {move} up from entry."
                    values={{ leverage: setup.leverage, move: <span className="num text-fg">{(liquidationMove * 100).toFixed(1)}%</span> }}
                  />
                )}
              </p>
              {setup.leverage > 5 && (
                <p className="flex items-start gap-2 rounded-control border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-text">
                  <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  {t('Above 5x, ordinary daily swings are enough to liquidate a trade. Watch the liquidation count in the results.')}
                </p>
              )}
              <Switch
                label={t('Charge funding')}
                description={t('{rate} of the position every 8 hours, paid by longs and received by shorts. A fixed, typical rate; real funding changes.', {
                  rate: percent(DEFAULT_FUNDING_RATE),
                })}
                checked={setup.applyFunding}
                onChange={(on) => configure({ applyFunding: on })}
              />
            </>
          )}
          <p className="text-xs text-muted">
            <Trans
              text="Every fill pays a {fee} fee and {slippage} slippage. Change these in {settings}."
              values={{
                fee: percent(feeRate),
                slippage: percent(slippagePct),
                settings: (
                  <Link to="/settings" className="text-accent-text underline underline-offset-2">
                    {t('Settings')}
                  </Link>
                ),
              }}
            />
          </p>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-1 flex flex-col gap-2 bg-bg px-1 pt-1 pb-2">
        {problems.length > 0 && (
          <ul className="rounded-control border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-text" aria-label={t('Problems to fix before running')}>
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <Button type="submit" variant="primary" size="lg" disabled={running || problems.length > 0} icon={running ? undefined : <Play aria-hidden className="size-4" />}>
          {running ? <Spinner label={t('Loading history {pct}%', { pct: Math.round(progress * 100) })} className="text-current" /> : t('Run backtest')}
        </Button>
      </div>
    </form>
  );
}

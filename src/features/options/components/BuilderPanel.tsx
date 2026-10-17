import { useMemo, useState } from 'react';
import { AlertTriangle, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { LineDiagram } from '@/components/chart';
import { Button, ConfirmDialog, GlossaryTerm, IconButton, Input, Select, Slider, Switch, toast, Trans } from '@/components/ui';
import { OPTION_STRATEGIES } from '@/content/strategies';
import { intlLocale, t } from '@/i18n';
import { formatMoney, formatPct, formatPrice, formatSignedMoney } from '@/lib/format';
import { draftToStrategy, nearestStrike, quoteFor, type DraftLeg, type DraftStock } from '@/lib/pricing/draft';
import { analyzeStrategy, marginRequirement, MAX_LEGS, nearestExpiry, probabilityOfProfit, strategyPnl } from '@/lib/pricing/strategy';
import { useAccount, useAccountSnapshot } from '@/stores';
import type { Instrument } from '@/types';
import type { OptionMarket } from '../hooks/useOptionMarket';

const DAY_MS = 86_400_000;
const OUTLOOK = { bullish: t('Bullish'), bearish: t('Bearish'), neutral: t('Neutral'), volatile: t('Big move') };
/** Above this share of the account at risk, opening asks for confirmation. Same guideline as the order ticket. */
const RISK_WARNING = 0.02;

export interface BuilderState {
  legs: DraftLeg[];
  stock: DraftStock | null;
  templateId: string | null;
  name: string;
}

export interface BuilderPanelProps {
  instrument: Instrument;
  market: OptionMarket;
  state: BuilderState;
  onChange: (patch: Partial<BuilderState>) => void;
  /** Loads a template at the expiry the chain is showing. */
  onTemplate: (id: string) => void;
  /** The expiry the chain is showing; new legs default to it. */
  expiryIndex: number;
}

let counter = 0;
export const newLegId = () => `leg-${Date.now().toString(36)}-${counter++}`;

function Fact({ label, children, tone }: { label: React.ReactNode; children: React.ReactNode; tone?: 'up' | 'down' | 'warning' }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`num text-right text-xs ${tone === 'up' ? 'text-up-text' : tone === 'down' ? 'text-down-text' : tone === 'warning' ? 'text-warning-text' : 'text-fg'}`}>{children}</dd>
    </div>
  );
}

/** The strategy builder: legs, payoff diagram, what-if sliders, the numbers, and the button to open it on paper. */
export function BuilderPanel({ instrument, market, state, onChange, onTemplate, expiryIndex }: BuilderPanelProps) {
  const { chain, now, rate, multiplier, volatility } = market;
  const spot = market.spot!;
  const openStrategy = useAccount((s) => s.openStrategy);
  const snapshot = useAccountSnapshot('main');
  const [whatPrice, setWhatPrice] = useState<number | null>(null);
  const [daysForward, setDaysForward] = useState(0);
  const [ivShift, setIvShift] = useState(0);
  const [confirming, setConfirming] = useState(false);

  const fmt = (v: number) => formatPrice(v, instrument.tickSize);
  const expiryName = (ms: number) => new Date(ms).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const unit = multiplier === 1 ? instrument.base : `${multiplier} ${instrument.base}`;

  const strategy = useMemo(
    () => draftToStrategy(state.legs, state.stock, chain, { id: 'draft', name: state.name || t('Custom strategy'), underlying: instrument.symbol, spot, now, templateId: state.templateId ?? undefined }),
    [state, chain, instrument.symbol, spot, now],
  );
  const base = useMemo(() => analyzeStrategy(strategy, { spot, now, rate }), [strategy, spot, now, rate]);
  const expiry = nearestExpiry(strategy);
  const daysLeft = expiry != null ? Math.max(0, (expiry - now) / DAY_MS) : 0;
  // The last stop of the time slider is the expiry itself.
  const maxDays = Math.max(1, Math.floor(daysLeft));
  const days = Math.min(daysForward, maxDays);
  const atExpiry = expiry != null && days >= maxDays;
  const at = atExpiry ? expiry : now + days * DAY_MS;
  const ivOf = useMemo(() => (leg: { entryIv: number }) => leg.entryIv * (1 + ivShift / 100), [ivShift]);
  const price = whatPrice != null && base ? Math.min(base.range.to, Math.max(base.range.from, whatPrice)) : spot;
  const scenario = useMemo(() => analyzeStrategy(strategy, { spot: price, now, rate, at, ivOf }), [strategy, price, now, rate, at, ivOf]);
  const scenarioPnl = strategy.legs.length ? strategyPnl(strategy, price, at, rate, ivOf) : 0;
  const changed = whatPrice != null || daysForward !== 0 || ivShift !== 0;

  const chance = useMemo(() => probabilityOfProfit(strategy, spot, now, rate, volatility), [strategy, spot, now, rate, volatility]);
  const margin = strategy.legs.length ? marginRequirement(strategy, spot) : 0;
  const averageIv = strategy.legs.length ? strategy.legs.reduce((sum, l) => sum + l.entryIv, 0) / strategy.legs.length : volatility;

  const setLeg = (id: string, patch: Partial<DraftLeg>) => onChange({ legs: state.legs.map((l) => (l.id === id ? { ...l, ...patch } : l)), templateId: null });
  const addLeg = () => {
    const e = chain[Math.min(expiryIndex, chain.length - 1)];
    if (!e) return;
    onChange({ legs: [...state.legs, { id: newLegId(), side: 'buy', type: 'call', strike: nearestStrike(e, spot), expiry: e.expiry, quantity: 1 }], templateId: null });
  };

  const unlimited = base?.maxLoss === 'unlimited';
  const maxLoss = base && base.maxLoss !== 'unlimited' ? base.maxLoss : null;
  const warnings: string[] = [];
  if (unlimited) warnings.push(t('This strategy has no limit on its loss. A sharp move against it can lose far more than the premium received.'));
  if (maxLoss != null && snapshot.equity > 0 && maxLoss / snapshot.equity > RISK_WARNING) {
    warnings.push(
      t('The most it can lose is {loss}, which is {share} of your account. The usual guideline is 2% on one trade.', {
        loss: formatMoney(maxLoss),
        share: formatPct(maxLoss / snapshot.equity, 1),
      }),
    );
  }
  const missing = state.legs.some((l) => !quoteFor(chain, l));
  const blocked = !instrument.live
    ? t('This symbol has bundled daily history only, so its price never updates and paper trading is off. You can still build and analyse strategies.')
    : strategy.legs.length === 0
      ? t('Add at least one option leg.')
      : missing
        ? t('One of the legs is no longer listed in the chain. Pick another strike.')
        : state.legs.some((l) => !(l.quantity > 0)) || (state.stock != null && !(state.stock.quantity > 0))
          ? t('Every leg needs a quantity above zero.')
          : margin > snapshot.freeMargin
            ? t('Not enough free funds. This needs {needed} and {free} is free.', { needed: formatMoney(margin), free: formatMoney(Math.max(0, snapshot.freeMargin)) })
            : null;

  // An unnamed single option is named after what it is.
  const only = strategy.legs.length === 1 && !strategy.stock ? strategy.legs[0] : null;
  const name =
    state.name.trim() ||
    (only
      ? `${only.side === 'buy' ? t('Long') : t('Short')} ${only.contract.strike} ${only.contract.type === 'call' ? t('call') : t('put')}`
      : t('Custom strategy'));

  const open = () => {
    const events = openStrategy('main', { ...strategy, id: `opt-${Date.now().toString(36)}`, name, createdAt: Date.now() }, spot);
    const rejected = events.find((e) => e.type === 'order_rejected');
    if (rejected?.type === 'order_rejected') toast.error(t('Not opened'), rejected.reason);
    else toast.success(t('Paper position opened'), t('{name} on {asset}. It is listed under Open positions.', { name, asset: instrument.base }));
  };

  const g = scenario?.greeks;
  const perDay = (v: number) => t('{amount} a day', { amount: formatSignedMoney(v) });

  return (
    <div className="flex flex-col gap-3 p-3">
      <Select
        label={t('Start from a strategy')}
        value={state.templateId ?? ''}
        onChange={(id) => id && onTemplate(id)}
        options={[
          { value: '', label: state.legs.length ? t('Custom (your own legs)') : t('Choose a strategy…') },
          ...OPTION_STRATEGIES.map((s) => ({ value: s.id, label: `${OUTLOOK[s.outlook]} · ${s.name}` })),
        ]}
      />
      {state.templateId && (
        <p className="-mt-1 text-xs leading-relaxed text-muted">
          {OPTION_STRATEGIES.find((s) => s.id === state.templateId)?.summary} {OPTION_STRATEGIES.find((s) => s.id === state.templateId)?.when}
        </p>
      )}

      <section aria-label={t('Legs')} className="flex flex-col gap-2">
        {state.legs.length === 0 && !state.stock && (
          <p className="rounded-control border border-dashed border-border px-3 py-3 text-xs text-muted">
            <Trans
              text="No legs yet. Choose a strategy above, or click a price in the chain: an {ask} to buy that option, a {bid} to sell it."
              values={{ ask: <span className="text-fg">{t('Ask')}</span>, bid: <span className="text-fg">{t('Bid')}</span> }}
            />
          </p>
        )}
        {state.legs.map((leg, i) => {
          const quote = quoteFor(chain, leg);
          const rows = chain.find((e) => e.expiry === leg.expiry)?.rows ?? [];
          const label = t('Leg {n}', { n: i + 1 });
          const legPrice = quote ? (leg.side === 'buy' ? quote.ask : quote.bid) : undefined;
          return (
            <div key={leg.id} className="rounded-control border border-border bg-bg p-2" role="group" aria-label={`${label}: ${leg.side === 'buy' ? t('buy') : t('sell')} ${leg.quantity} ${leg.strike} ${leg.type === 'call' ? t('call') : t('put')}`}>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant={leg.side === 'buy' ? 'buy' : 'sell'}
                  className="w-14 shrink-0"
                  aria-label={leg.side === 'buy' ? t('{leg}: buying. Switch to sell', { leg: label }) : t('{leg}: selling. Switch to buy', { leg: label })}
                  onClick={() => setLeg(leg.id, { side: leg.side === 'buy' ? 'sell' : 'buy' })}
                >
                  {leg.side === 'buy' ? t('Buy') : t('Sell')}
                </Button>
                <Input
                  aria-label={t('{leg} quantity', { leg: label })}
                  type="number"
                  numeric
                  min={0}
                  step={multiplier === 1 ? 0.01 : 1}
                  wrapperClassName="w-16 shrink-0"
                  value={Number.isFinite(leg.quantity) ? leg.quantity : ''}
                  onChange={(e) => setLeg(leg.id, { quantity: e.target.value === '' ? NaN : Number(e.target.value) })}
                />
                <Select
                  aria-label={t('{leg} type', { leg: label })}
                  wrapperClassName="min-w-0 flex-1"
                  value={leg.type}
                  onChange={(type) => setLeg(leg.id, { type })}
                  options={[
                    { value: 'call', label: t('Call') },
                    { value: 'put', label: t('Put') },
                  ]}
                />
                <IconButton size="sm" label={t('Remove {leg}', { leg: label.toLowerCase() })} icon={<Trash2 className="size-3.5" />} onClick={() => onChange({ legs: state.legs.filter((l) => l.id !== leg.id), templateId: null })} />
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Select
                  aria-label={t('{leg} strike', { leg: label })}
                  className="num"
                  wrapperClassName="min-w-0 flex-1"
                  value={String(leg.strike)}
                  onChange={(strike) => setLeg(leg.id, { strike: Number(strike) })}
                  options={[
                    ...(rows.some((r) => r.strike === leg.strike) ? [] : [{ value: String(leg.strike), label: t('{strike} (not listed)', { strike: leg.strike }) }]),
                    ...rows.map((r) => ({ value: String(r.strike), label: `${t('Strike {strike}', { strike: fmt(r.strike).replace(/\.0+$/, '') })}${r.atm ? ' · ATM' : ''}` })),
                  ]}
                />
                <Select
                  aria-label={t('{leg} expiry', { leg: label })}
                  wrapperClassName="w-28 shrink-0"
                  value={String(leg.expiry)}
                  onChange={(e) => setLeg(leg.id, { expiry: Number(e) })}
                  options={chain.map((e) => ({ value: String(e.expiry), label: `${expiryName(e.expiry)} · ${t('{n}d', { n: Math.round(e.days) })}` }))}
                />
              </div>
              <p className="num mt-1.5 text-xs text-muted">
                {legPrice != null && quote ? (
                  <>
                    {leg.side === 'buy' ? (
                      <Trans text="Pays {price} per {asset}" values={{ price: <span className="text-fg">{fmt(legPrice)}</span>, asset: instrument.base }} />
                    ) : (
                      <Trans text="Receives {price} per {asset}" values={{ price: <span className="text-fg">{fmt(legPrice)}</span>, asset: instrument.base }} />
                    )}
                    {Number.isFinite(leg.quantity) && (
                      <>
                        {' '}
                        = <span className="text-fg">{formatMoney(legPrice * leg.quantity * multiplier)}</span>
                      </>
                    )}{' '}
                    · IV {(quote.iv * 100).toFixed(1)}%
                  </>
                ) : (
                  t('Not in the chain')
                )}
              </p>
            </div>
          );
        })}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" disabled={state.legs.length >= MAX_LEGS} icon={<Plus aria-hidden className="size-3.5" />} onClick={addLeg}>
            {t('Add option leg')}
          </Button>
          <span className="text-xs text-muted">{t('{n} of {max} legs. One contract covers {unit}.', { n: state.legs.length, max: MAX_LEGS, unit })}</span>
        </div>
        <Switch
          label={t('Include {asset} itself', { asset: instrument.base })}
          description={t('For strategies that hold the underlying, such as a covered call or a protective put.')}
          checked={state.stock != null}
          onChange={(on) => onChange({ stock: on ? { side: 'buy', quantity: multiplier } : null, templateId: null })}
        />
        {state.stock && (
          <div className="flex items-center gap-1.5 rounded-control border border-border bg-bg p-2" role="group" aria-label={t('Underlying leg')}>
            <Button
              size="sm"
              variant={state.stock.side === 'buy' ? 'buy' : 'sell'}
              className="w-14 shrink-0"
              aria-label={state.stock.side === 'buy' ? t('Underlying: buying. Switch') : t('Underlying: selling short. Switch')}
              onClick={() => onChange({ stock: { ...state.stock!, side: state.stock!.side === 'buy' ? 'sell' : 'buy' }, templateId: null })}
            >
              {state.stock.side === 'buy' ? t('Buy') : t('Sell')}
            </Button>
            <Input
              aria-label={t('Underlying quantity')}
              type="number"
              numeric
              min={0}
              step="any"
              suffix={instrument.base}
              wrapperClassName="min-w-0 flex-1"
              value={Number.isFinite(state.stock.quantity) ? state.stock.quantity : ''}
              onChange={(e) => onChange({ stock: { ...state.stock!, quantity: e.target.value === '' ? NaN : Number(e.target.value) }, templateId: null })}
            />
            <span className="num shrink-0 text-xs text-muted">{t('at {price}', { price: fmt(spot) })}</span>
          </div>
        )}
      </section>

      {base && scenario && strategy.legs.length > 0 && (
        <>
          <section aria-label={t('Payoff diagram')} className="rounded-control border border-border p-2">
            <LineDiagram
              ariaLabel={t('Payoff diagram. At expiry the most it can make is {profit} and the most it can lose is {loss}.', {
                profit: base.maxProfit === 'unlimited' ? t('unlimited') : formatMoney(base.maxProfit),
                loss: base.maxLoss === 'unlimited' ? t('unlimited') : formatMoney(base.maxLoss),
              })}
              series={[
                { points: base.payoffAtExpiry.map((p) => ({ x: p.price, y: p.pnl })), label: base.mixedExpiries ? t('At first expiry') : t('At expiry') },
                { points: scenario.payoffAtDate.map((p) => ({ x: p.price, y: p.pnl })), color: 'var(--c-series-2)', dashed: true, label: atExpiry ? t('On the chosen date (expiry)') : days === 0 ? t('Today') : t('In {n} days', { n: days }) },
              ]}
              shadeProfit
              markerX={price}
              guidesX={[...new Set(strategy.legs.map((l) => l.contract.strike))].map((x) => ({ x }))}
              formatX={(x) => fmt(x).replace(/\.\d+$/, (d) => (x >= 1000 ? '' : d))}
              formatY={(y) => (Math.abs(y) >= 1000 ? `${(y / 1000).toFixed(1)}k` : y.toFixed(Math.abs(y) < 10 ? 2 : 0))}
              xLabel={t('{asset} price', { asset: instrument.base })}
              height={230}
              width={390}
            />
            <p className="mt-1 text-xs text-fg" aria-live="polite">
              <Trans
                text="With {asset} at {price} {when}: {pnl}"
                values={{
                  asset: instrument.base,
                  price: <span className="num font-medium">{fmt(price)}</span>,
                  when: atExpiry ? t('at expiry') : days === 0 ? t('today') : t('in {n} days', { n: days }),
                  pnl: (
                    <span className={`num font-medium ${scenarioPnl > 0 ? 'text-up-text' : scenarioPnl < 0 ? 'text-down-text' : ''}`}>{formatSignedMoney(scenarioPnl)}</span>
                  ),
                }}
              />
            </p>
          </section>

          <section aria-label={t('What if')} className="flex flex-col gap-3 rounded-control border border-border bg-bg p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-fg">{t('What if…')}</h3>
              <Button
                size="sm"
                variant="ghost"
                disabled={!changed}
                icon={<RotateCcw aria-hidden className="size-3.5" />}
                onClick={() => {
                  setWhatPrice(null);
                  setDaysForward(0);
                  setIvShift(0);
                }}
              >
                {t('Reset')}
              </Button>
            </div>
            <Slider
              label={t('{asset} price', { asset: instrument.base })}
              min={base.range.from}
              max={base.range.to}
              step={Number(((base.range.to - base.range.from) / 200).toPrecision(2))}
              value={price}
              onChange={setWhatPrice}
              format={(v) => `${fmt(v)} (${v >= spot ? '+' : ''}${((v / spot - 1) * 100).toFixed(1)}%)`}
            />
            <Slider
              label={t('Time passing')}
              min={0}
              max={maxDays}
              step={1}
              value={days}
              onChange={setDaysForward}
              format={(v) =>
                v === 0
                  ? t('Today')
                  : v >= maxDays
                    ? v === 1
                      ? t('At expiry (1 day)')
                      : t('At expiry ({n} days)', { n: v })
                    : v === 1
                      ? t('In 1 day')
                      : t('In {n} days', { n: v })
              }
            />
            <Slider
              label={t('Implied volatility')}
              min={-50}
              max={100}
              step={5}
              value={ivShift}
              onChange={setIvShift}
              format={(v) => `${(averageIv * (1 + v / 100) * 100).toFixed(1)}%${v === 0 ? '' : ` (${v > 0 ? '+' : ''}${v}%)`}`}
            />
            <p className="text-xs text-muted">
              <Trans
                text="Move one slider at a time. Time passing shows {decay}; volatility shows {vega}. The dashed line and the Greeks below follow the sliders."
                values={{
                  decay: <GlossaryTerm id="theta">{t('time decay')}</GlossaryTerm>,
                  vega: <GlossaryTerm id="vega">{t('vega')}</GlossaryTerm>,
                }}
              />
            </p>
          </section>

          <dl className="rounded-control border border-border px-3 py-1.5">
            <Fact label={t('Net premium')} tone={base.netPremium >= 0 ? 'up' : undefined}>
              {base.netPremium >= 0
                ? t('Credit {amount} (you receive)', { amount: formatMoney(base.netPremium) })
                : t('Debit {amount} (you pay)', { amount: formatMoney(-base.netPremium) })}
            </Fact>
            <Fact label={t('Max profit')} tone="up">
              {base.maxProfit === 'unlimited' ? t('Unlimited') : formatMoney(base.maxProfit)}
            </Fact>
            <Fact label={t('Max loss')} tone={unlimited ? 'warning' : 'down'}>
              {base.maxLoss === 'unlimited' ? t('Unlimited') : formatMoney(base.maxLoss)}
            </Fact>
            <Fact label={base.breakEvens.length > 1 ? t('Break-evens') : t('Break-even')}>
              {base.breakEvens.length ? base.breakEvens.map((b) => fmt(b)).join(t(' and ')) : t('None')}
            </Fact>
            <Fact label={t('Chance of profit (model)')}>{chance != null ? formatPct(chance, 0) : '–'}</Fact>
            <Fact label={t('Funds it ties up')}>{formatMoney(margin)}</Fact>
            {base.mixedExpiries && (
              <p className="py-1 text-[11px] text-muted">{t('Legs expire on different dates, so these figures are taken at the first expiry and read off the chart range.')}</p>
            )}
          </dl>

          {g && (
            <dl className="rounded-control border border-border px-3 py-1.5" aria-label={t('Combined Greeks')}>
              <Fact label={<GlossaryTerm id="delta">Delta</GlossaryTerm>}>
                {t('{amount} per $1 rise in {asset}', { amount: formatSignedMoney(g.delta), asset: instrument.base })}
              </Fact>
              <Fact label={<GlossaryTerm id="gamma">Gamma</GlossaryTerm>}>
                {t('{gamma} delta per $1', { gamma: `${g.gamma >= 0 ? '+' : ''}${g.gamma.toPrecision(3)}` })}
              </Fact>
              <Fact label={<GlossaryTerm id="theta">Theta</GlossaryTerm>} tone={g.theta < 0 ? 'down' : g.theta > 0 ? 'up' : undefined}>
                {perDay(g.theta)}
              </Fact>
              <Fact label={<GlossaryTerm id="vega">Vega</GlossaryTerm>}>{t('{amount} per 1 point of IV', { amount: formatSignedMoney(g.vega) })}</Fact>
            </dl>
          )}
        </>
      )}

      <Input label={t('Name')} value={state.name} maxLength={50} placeholder={name} onChange={(e) => onChange({ name: e.target.value })} />
      {warnings.length > 0 && strategy.legs.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-2 rounded-control border border-warning/40 bg-warning/10 px-2.5 py-1.5 text-xs text-fg">
              <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0 text-warning-text" />
              {w}
            </li>
          ))}
        </ul>
      )}
      {blocked && state.legs.length + (state.stock ? 1 : 0) > 0 && <p className="text-xs text-muted">{blocked}</p>}
      <Button variant="primary" size="lg" block disabled={blocked != null} onClick={() => (warnings.length ? setConfirming(true) : open())}>
        {t('Open paper position')}
      </Button>
      <p className="text-center text-[11px] text-muted">{t('Simulated money and simulated prices. No real order is sent anywhere.')}</p>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={open}
        title={t('Open this strategy anyway?')}
        confirmLabel={t('Open paper position')}
      >
        <ul className="list-disc space-y-1.5 pl-4">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">{t('You can go back and reduce the quantity or add a leg that limits the loss.')}</p>
      </ConfirmDialog>
    </div>
  );
}

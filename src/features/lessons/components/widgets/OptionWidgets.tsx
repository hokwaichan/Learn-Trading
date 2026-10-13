import { useMemo, useState } from 'react';
import { LineDiagram } from '@/components/chart';
import { cn, Pnl, Slider } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { bsGreeks, bsPrice, intrinsicValue, type BsInput, type OptionType } from '@/lib/pricing/blackScholes';
import { breakEvens, payoffCurve, payoffExtremes, strategyPnlAtExpiry, type PayoffLeg } from '@/lib/pricing/payoff';
import { WidgetFrame } from './TradingWidgets';

// ── Payoff diagram ─────────────────────────────────────────────────────

export interface PayoffWidgetProps {
  title: string;
  legs: PayoffLeg[];
  /** Current price of the underlying. */
  spot?: number;
}

const money = (v: number | 'unlimited') => (v === 'unlimited' ? 'Unlimited' : formatPrice(v));

export function PayoffWidget({ title, legs, spot = 100 }: PayoffWidgetProps) {
  const strikes = legs.filter((l) => l.strike != null).map((l) => l.strike!);
  const from = Math.round(Math.min(spot, ...strikes) * 0.75);
  const to = Math.round(Math.max(spot, ...strikes) * 1.25);
  const [price, setPrice] = useState(spot);

  const curve = useMemo(() => payoffCurve(legs, from, to, 100), [legs, from, to]);
  const extremes = useMemo(() => payoffExtremes(legs), [legs]);
  const evens = useMemo(() => breakEvens(legs, from, to), [legs, from, to]);
  const pnl = strategyPnlAtExpiry(legs, price);

  return (
    <WidgetFrame title={title}>
      <LineDiagram
        ariaLabel={`Payoff at expiry for ${title}. Maximum profit ${money(extremes.maxProfit)}, maximum loss ${money(extremes.maxLoss)}, break-even at ${evens.map((b) => formatPrice(b)).join(' and ') || 'none in range'}.`}
        series={[{ points: curve.map((p) => ({ x: p.price, y: p.pnl })) }]}
        shadeProfit
        markerX={price}
        guidesX={[...new Set(strikes)].map((x) => ({ x, label: String(x) }))}
        xLabel="Price of the underlying at expiry"
        yLabel="Profit or loss"
      />
      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <Slider label="Price at expiry" min={from} max={to} step={0.5} value={price} onChange={setPrice} format={(v) => formatPrice(v)} />
        <p className="text-sm" aria-live="polite">
          <span className="text-muted">Profit or loss per share: </span>
          <Pnl value={pnl} className="text-base font-medium" />
        </p>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-border pt-3 text-center">
        <div>
          <dt className="text-xs text-muted">Max profit</dt>
          <dd className="num text-sm text-up-text">{money(extremes.maxProfit)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Max loss</dt>
          <dd className="num text-sm text-down-text">{money(extremes.maxLoss)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Break-even</dt>
          <dd className="num text-sm text-fg">{evens.length ? evens.map((b) => formatPrice(b)).join(' / ') : 'None'}</dd>
        </div>
      </dl>
    </WidgetFrame>
  );
}

// ── Greeks sliders ─────────────────────────────────────────────────────

export type GreekFocus = 'value' | 'delta' | 'gamma' | 'theta' | 'vega' | 'rho';

export interface GreekSliderProps {
  focus: GreekFocus;
  type?: OptionType;
}

const STRIKE = 100;

const TITLES: Record<GreekFocus, string> = {
  value: 'Intrinsic value and time value',
  delta: 'Delta: sensitivity to the price',
  gamma: 'Gamma: how fast delta changes',
  theta: 'Theta: time decay',
  vega: 'Vega: sensitivity to volatility',
  rho: 'Rho: sensitivity to interest rates',
};

const HINTS: Record<GreekFocus, string> = {
  value: 'Lower the days to expiry and watch time value shrink until only intrinsic value is left.',
  delta: 'Delta is the slope of the solid curve. Move the price: it is near 0 far below the strike, about 0.5 at the strike and near 1 far above.',
  gamma: 'Gamma is how sharply the curve bends. Set the price at the strike and reduce the days to expiry to see it grow.',
  theta: 'The curve shows the option value as expiry approaches, with the price held still. It falls slowly at first, then steeply.',
  vega: 'The curve shows the option value at each level of volatility. More volatility always means a higher price.',
  rho: 'The curve shows the option value at each interest rate. It barely moves, which is why rho is watched least.',
};

export function GreekSlider({ focus, type = 'call' }: GreekSliderProps) {
  const [spot, setSpot] = useState(100);
  const [days, setDays] = useState(30);
  const [iv, setIv] = useState(30);
  const [rate, setRate] = useState(4);

  const input: BsInput = { type, spot, strike: STRIKE, years: days / 365, volatility: iv / 100, rate: rate / 100 };
  const price = bsPrice(input);
  const greeks = bsGreeks(input);
  const intrinsic = intrinsicValue(type, spot, STRIKE);
  const timeValue = Math.max(0, price - intrinsic);

  const diagram = useMemo(() => {
    const base: BsInput = { type, spot, strike: STRIKE, years: days / 365, volatility: iv / 100, rate: rate / 100 };
    const sweep = (from: number, to: number, steps: number, make: (x: number) => BsInput) =>
      Array.from({ length: steps + 1 }, (_, i) => {
        const x = from + ((to - from) * i) / steps;
        return { x, y: bsPrice(make(x)) };
      });
    if (focus === 'theta') {
      return { x: days, xLabel: 'Days to expiry', series: [{ points: sweep(120, 0, 80, (d) => ({ ...base, years: d / 365 })).reverse(), label: 'Option value' }] };
    }
    if (focus === 'vega') {
      return { x: iv, xLabel: 'Implied volatility (%)', series: [{ points: sweep(5, 120, 60, (v) => ({ ...base, volatility: v / 100 })), label: 'Option value' }] };
    }
    if (focus === 'rho') {
      return { x: rate, xLabel: 'Interest rate (%)', series: [{ points: sweep(0, 10, 40, (r) => ({ ...base, rate: r / 100 })), label: 'Option value' }] };
    }
    return {
      x: spot,
      xLabel: 'Price of the underlying',
      series: [
        { points: sweep(60, 140, 80, (s) => ({ ...base, spot: s })), label: 'Value now' },
        { points: sweep(60, 140, 80, (s) => ({ ...base, spot: s, years: 0 })), label: 'Value at expiry (intrinsic)', dashed: true, color: 'var(--c-muted)' },
      ],
    };
  }, [focus, type, spot, days, iv, rate]);

  const cells: { key: GreekFocus | 'price'; label: string; value: string }[] = [
    { key: 'price', label: 'Option price', value: formatPrice(price) },
    { key: 'delta', label: 'Delta', value: greeks.delta.toFixed(3) },
    { key: 'gamma', label: 'Gamma', value: greeks.gamma.toFixed(4) },
    { key: 'theta', label: 'Theta / day', value: greeks.theta.toFixed(3) },
    { key: 'vega', label: 'Vega / 1%', value: greeks.vega.toFixed(3) },
    { key: 'rho', label: 'Rho / 1%', value: greeks.rho.toFixed(3) },
  ];

  return (
    <WidgetFrame title={`${TITLES[focus]} (${type}, strike ${STRIKE})`}>
      <div className="grid gap-5 sm:grid-cols-[230px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <Slider label="Price of the underlying" min={60} max={140} step={0.5} value={spot} onChange={setSpot} format={(v) => formatPrice(v)} />
          <Slider label="Days to expiry" min={0} max={120} value={days} onChange={setDays} format={(v) => `${v} days`} />
          <Slider label="Implied volatility" min={5} max={120} value={iv} onChange={setIv} format={(v) => `${v}%`} />
          {focus === 'rho' && <Slider label="Interest rate" min={0} max={10} step={0.25} value={rate} onChange={setRate} format={(v) => `${v}%`} />}
          <p className="text-xs leading-relaxed text-muted">{HINTS[focus]}</p>
        </div>
        <div>
          <LineDiagram
            ariaLabel={`${TITLES[focus]}. Option price ${formatPrice(price)}, delta ${greeks.delta.toFixed(2)}, theta ${greeks.theta.toFixed(3)} per day, vega ${greeks.vega.toFixed(3)}.`}
            series={diagram.series}
            markerX={diagram.x}
            guidesX={focus === 'theta' || focus === 'vega' || focus === 'rho' ? [] : [{ x: STRIKE, label: 'Strike' }]}
            xLabel={diagram.xLabel}
            yLabel="Option value"
            height={200}
          />
          {focus === 'value' && (
            <div className="mt-3" aria-live="polite">
              <div className="flex h-5 overflow-hidden rounded-control border border-border" aria-hidden>
                <div className="bg-accent" style={{ width: `${price > 0 ? (intrinsic / price) * 100 : 0}%` }} />
                <div className="bg-warning" style={{ width: `${price > 0 ? (timeValue / price) * 100 : 0}%` }} />
              </div>
              <p className="mt-1.5 text-sm">
                Premium <span className="num font-medium">{formatPrice(price)}</span> = intrinsic{' '}
                <span className="num text-accent-text">{formatPrice(intrinsic)}</span> + time value{' '}
                <span className="num text-warning-text">{formatPrice(timeValue)}</span>
                <span className="text-muted">
                  {' '}
                  · {intrinsic > 0 ? 'in the money' : Math.abs(spot - STRIKE) < 0.5 ? 'at the money' : 'out of the money'}
                </span>
              </p>
            </div>
          )}
          <dl className="mt-3 grid grid-cols-3 gap-2" aria-live="polite">
            {cells.map((c) => (
              <div
                key={c.key}
                className={cn('rounded-control border px-2 py-1.5', c.key === focus ? 'border-accent bg-accent/10' : 'border-border')}
              >
                <dt className="text-[11px] text-muted">{c.label}</dt>
                <dd className="num text-sm text-fg">{c.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </WidgetFrame>
  );
}

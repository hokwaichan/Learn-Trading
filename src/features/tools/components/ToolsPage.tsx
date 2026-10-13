import { useState, type ReactNode } from 'react';
import { LineDiagram } from '@/components/chart';
import { Card, GlossaryTerm, Input, Page, PageHeader, Select, Slider, TabPanel, Tabs } from '@/components/ui';
import { compound, optionOutcome, periodsToDouble, priceProbability } from '@/lib/calculators';
import { formatMoney, formatPct, formatSignedMoney } from '@/lib/format';
import { DEFAULT_MAINTENANCE_MARGIN_RATE, liquidationPrice, MAX_LEVERAGE } from '@/lib/trading/futures';
import { breakEvenWinRate, expectancy, positionSize, riskReward } from '@/lib/trading/sizing';
import { useAccountSnapshot } from '@/stores';

type ToolId = 'size' | 'rr' | 'compound' | 'breakeven' | 'leverage' | 'option' | 'probability';

const TOOLS: { id: ToolId; label: string }[] = [
  { id: 'size', label: 'Position size' },
  { id: 'rr', label: 'Risk/reward' },
  { id: 'compound', label: 'Compounding' },
  { id: 'breakeven', label: 'Break-even win rate' },
  { id: 'leverage', label: 'Leverage and liquidation' },
  { id: 'option', label: 'Option profit' },
  { id: 'probability', label: 'Probability' },
];

/** A number typed as text: the text is kept as typed, the value is undefined until it is a number. */
function useNumber(initial: number | '') {
  const [text, setText] = useState(String(initial));
  const n = Number(text);
  return { text, set: setText, value: text.trim() !== '' && Number.isFinite(n) ? n : undefined };
}
type Num = ReturnType<typeof useNumber>;

function Field({ label, field, prefix, suffix, hint }: { label: string; field: Num; prefix?: string; suffix?: string; hint?: string }) {
  return <Input label={label} numeric inputMode="decimal" prefix={prefix} suffix={suffix} hint={hint} value={field.text} onChange={(e) => field.set(e.target.value)} />;
}

function Calculator({ title, intro, inputs, children }: { title: string; intro: ReactNode; inputs: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={title}>
        <p className="mb-4 text-sm leading-relaxed text-muted">{intro}</p>
        <div className="grid grid-cols-2 gap-3">{inputs}</div>
      </Card>
      <Card title="Result">
        <div aria-live="polite">{children}</div>
      </Card>
    </div>
  );
}

function Big({ label, children, tone }: { label: string; children: ReactNode; tone?: 'up' | 'down' | 'warning' }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className={`num mt-0.5 text-2xl font-medium ${tone === 'up' ? 'text-up-text' : tone === 'down' ? 'text-down-text' : tone === 'warning' ? 'text-warning-text' : 'text-fg'}`}>{children}</div>
    </div>
  );
}

function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="mt-4">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="num text-right text-sm text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const Note = ({ children }: { children: ReactNode }) => <p className="mt-4 text-sm leading-relaxed text-muted">{children}</p>;
const Missing = ({ children = 'Fill in the fields to see the result.' }: { children?: ReactNode }) => <p className="text-sm text-muted">{children}</p>;
const price = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: v < 10 ? 4 : 2 });

function PositionSize() {
  const snapshot = useAccountSnapshot('main');
  const equity = useNumber(Math.round(snapshot.equity));
  const risk = useNumber(1);
  const entry = useNumber(100);
  const stop = useNumber(95);
  const r = equity.value != null && risk.value != null && entry.value != null && stop.value != null ? positionSize({ equity: equity.value, riskFraction: risk.value / 100, entry: entry.value, stop: stop.value }) : null;
  return (
    <Calculator
      title="Position size"
      intro={
        <>
          Decide how much you are willing to lose first, then let the distance to your <GlossaryTerm id="stop-loss">stop-loss</GlossaryTerm> set the size. A wider stop means a smaller position,
          so every trade risks the same amount.
        </>
      }
      inputs={
        <>
          <Field label="Account size" field={equity} prefix="$" />
          <Field label="Risk per trade" field={risk} suffix="%" hint="1% to 2% is the usual guideline" />
          <Field label="Entry price" field={entry} />
          <Field label="Stop-loss price" field={stop} />
        </>
      }
    >
      {r ? (
        <>
          <Big label={`Size to trade (${r.direction})`}>{r.quantity.toLocaleString('en-US', { maximumFractionDigits: 4 })} units</Big>
          <Rows
            rows={[
              ['You lose if stopped out', formatMoney(r.riskAmount)],
              ['Stop distance', `${price(r.stopDistance)} (${formatPct(r.stopFraction, 2)})`],
              ['Position value', formatMoney(r.positionValue)],
              ['Position as a share of the account', formatPct(r.leverageNeeded, 0)],
            ]}
          />
          {r.leverageNeeded > 1 && (
            <Note>
              <span className="text-warning-text">This position is larger than the account.</span> It needs {r.leverageNeeded.toFixed(1)}x leverage. The loss at the stop is still{' '}
              {formatMoney(r.riskAmount)}, but a gap past the stop would cost more.
            </Note>
          )}
          {risk.value != null && risk.value > 2 && <Note>Risking more than 2% a trade means a normal losing streak takes a large bite out of the account.</Note>}
        </>
      ) : (
        <Missing>Enter an account size, a risk above zero, and an entry and stop that differ.</Missing>
      )}
    </Calculator>
  );
}

function RiskReward() {
  const entry = useNumber(100);
  const stop = useNumber(95);
  const target = useNumber(110);
  const win = useNumber(40);
  const ratio = entry.value != null && stop.value != null && target.value != null ? riskReward(entry.value, stop.value, target.value) : null;
  const edge = ratio != null && win.value != null ? expectancy(win.value / 100, ratio) : null;
  return (
    <Calculator
      title="Risk/reward"
      intro="How much a trade can make compared with what it can lose. Together with how often you win, it decides whether a way of trading makes money."
      inputs={
        <>
          <Field label="Entry price" field={entry} />
          <Field label="Stop-loss price" field={stop} />
          <Field label="Take-profit price" field={target} />
          <Field label="Your win rate" field={win} suffix="%" hint="Optional" />
        </>
      }
    >
      {ratio != null ? (
        <>
          <Big label="Reward to risk">{ratio.toFixed(2)} : 1</Big>
          <Rows
            rows={[
              ['Risk per unit', price(Math.abs(entry.value! - stop.value!))],
              ['Reward per unit', price(Math.abs(target.value! - entry.value!))],
              ['Win rate needed to break even', formatPct(breakEvenWinRate(ratio), 1)],
              ...(edge != null ? ([['Expectancy at your win rate', <span key="e" className={edge >= 0 ? 'text-up-text' : 'text-down-text'}>{`${edge >= 0 ? '+' : ''}${edge.toFixed(2)}R per trade`}</span>]] as [string, ReactNode][]) : []),
            ]}
          />
          <Note>
            At {ratio.toFixed(2)} : 1 you can be wrong {formatPct(1 - breakEvenWinRate(ratio), 0)} of the time and still not lose money, before fees.
            {edge != null && (edge >= 0 ? ` Winning ${win.value}% of the time, each trade is worth ${edge.toFixed(2)} times what you risk, on average.` : ` Winning ${win.value}% of the time is not enough: on average each trade loses ${Math.abs(edge).toFixed(2)} times what you risk.`)}
          </Note>
        </>
      ) : (
        <Missing>The stop-loss and the take-profit must be on opposite sides of the entry.</Missing>
      )}
    </Calculator>
  );
}

function Compounding() {
  const start = useNumber(10000);
  const rate = useNumber(2);
  const periods = useNumber(24);
  const add = useNumber(0);
  const [unit, setUnit] = useState<'month' | 'week' | 'year'>('month');
  const ok = start.value != null && rate.value != null && periods.value != null && periods.value >= 1 && periods.value <= 600;
  const r = ok ? compound({ start: start.value!, ratePct: rate.value!, periods: periods.value!, contribution: add.value ?? 0 }) : null;
  const double = rate.value != null ? periodsToDouble(rate.value) : Infinity;
  return (
    <Calculator
      title="Compounding"
      intro="What steady growth adds up to when each period's gain is left in to grow too. Useful for seeing why small, repeatable gains matter more than big wins, and why losses hurt more than they look."
      inputs={
        <>
          <Field label="Starting amount" field={start} prefix="$" />
          <Field label={`Return per ${unit}`} field={rate} suffix="%" />
          <Field label={`Number of ${unit}s`} field={periods} />
          <Select label="Period" value={unit} onChange={setUnit} options={[{ value: 'week', label: 'Weeks' }, { value: 'month', label: 'Months' }, { value: 'year', label: 'Years' }]} />
          <Field label={`Added each ${unit}`} field={add} prefix="$" hint="Optional" />
        </>
      }
    >
      {r ? (
        <>
          <Big label={`After ${periods.value} ${unit}s`} tone={r.final >= r.paidIn ? 'up' : 'down'}>
            {formatMoney(r.final)}
          </Big>
          <Rows
            rows={[
              ['Paid in', formatMoney(r.paidIn)],
              ['From growth', formatSignedMoney(r.growth)],
              ['Time to double at this rate', Number.isFinite(double) ? `${double.toFixed(1)} ${unit}s` : 'Never'],
            ]}
          />
          <LineDiagram
            className="mt-4"
            ariaLabel={`Balance over ${periods.value} ${unit}s, from ${formatMoney(r.series[0])} to ${formatMoney(r.final)}.`}
            series={[{ points: r.series.map((y, x) => ({ x, y })) }]}
            formatX={(x) => String(Math.round(x))}
            formatY={(y) => (Math.abs(y) >= 1000 ? `$${(y / 1000).toFixed(Math.abs(y) >= 100_000 ? 0 : 1)}k` : `$${y.toFixed(0)}`)}
            xLabel={`${unit}s`}
            height={200}
          />
          <Note>No one earns the same return every {unit}. Real results arrive unevenly, with losing stretches, so treat this as arithmetic, not a forecast.</Note>
        </>
      ) : (
        <Missing>Enter a starting amount, a return, and between 1 and 600 periods.</Missing>
      )}
    </Calculator>
  );
}

function BreakEven() {
  const win = useNumber(150);
  const loss = useNumber(100);
  const rate = useNumber(45);
  const ok = win.value != null && loss.value != null && win.value > 0 && loss.value > 0;
  const needed = ok ? loss.value! / (win.value! + loss.value!) : null;
  const perTrade = ok && rate.value != null ? (rate.value / 100) * win.value! - (1 - rate.value / 100) * loss.value! : null;
  return (
    <Calculator
      title="Break-even win rate"
      intro={
        <>
          How often you need to win, given the size of your average win and loss. Your own figures are on the <span className="text-fg">Analytics</span> page once you have closed some trades.
        </>
      }
      inputs={
        <>
          <Field label="Average win" field={win} prefix="$" />
          <Field label="Average loss" field={loss} prefix="$" hint="As a positive number" />
          <Field label="Your win rate" field={rate} suffix="%" hint="Optional" />
        </>
      }
    >
      {needed != null ? (
        <>
          <Big label="Win rate needed to break even">{formatPct(needed, 1)}</Big>
          <Rows
            rows={[
              ['Average win ÷ average loss', `${(win.value! / loss.value!).toFixed(2)} : 1`],
              ...(perTrade != null ? ([['Expectancy at your win rate', <span key="e" className={perTrade >= 0 ? 'text-up-text' : 'text-down-text'}>{`${formatSignedMoney(perTrade)} per trade`}</span>]] as [string, ReactNode][]) : []),
              ...(perTrade != null ? ([['Over 100 trades', formatSignedMoney(perTrade * 100)]] as [string, ReactNode][]) : []),
            ]}
          />
          <Note>
            Bigger wins than losses let you be wrong more often. Small wins and big losses need a very high win rate, which is the trap in taking profits early and letting losers run.
          </Note>
        </>
      ) : (
        <Missing>Enter an average win and an average loss above zero.</Missing>
      )}
    </Calculator>
  );
}

function Leverage() {
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState(5);
  const margin = useNumber(1000);
  const entry = useNumber(50000);
  const exit = useNumber(52000);
  const ok = margin.value != null && entry.value != null && margin.value > 0 && entry.value > 0;
  const value = ok ? margin.value! * leverage : 0;
  const quantity = ok ? value / entry.value! : 0;
  const liq = ok ? liquidationPrice(direction, entry.value!, leverage, DEFAULT_MAINTENANCE_MARGIN_RATE) : 0;
  const move = ok ? Math.abs(entry.value! - liq) / entry.value! : 0;
  const sign = direction === 'long' ? 1 : -1;
  const raw = ok && exit.value != null ? (exit.value - entry.value!) * quantity * sign : null;
  const liquidated = ok && exit.value != null && (direction === 'long' ? exit.value <= liq : exit.value >= liq);
  const pnl = raw == null ? null : liquidated ? -margin.value! : raw;
  return (
    <Calculator
      title="Leverage and liquidation"
      intro={
        <>
          <GlossaryTerm id="leverage">Leverage</GlossaryTerm> lets a small amount of your money control a larger position. It multiplies gains and losses alike, and sets the price at which the
          exchange closes the position and keeps your margin: the <GlossaryTerm id="liquidation">liquidation</GlossaryTerm> price.
        </>
      }
      inputs={
        <>
          <Select label="Direction" value={direction} onChange={setDirection} options={[{ value: 'long', label: 'Long (buy first)' }, { value: 'short', label: 'Short (sell first)' }]} />
          <Field label="Your margin" field={margin} prefix="$" />
          <Field label="Entry price" field={entry} />
          <Field label="Exit price to test" field={exit} hint="Optional" />
          <Slider wrapperClassName="col-span-2" label="Leverage" min={1} max={MAX_LEVERAGE} step={1} value={leverage} onChange={setLeverage} format={(v) => `${v}x`} />
        </>
      }
    >
      {ok ? (
        <>
          <Big label="Liquidation price" tone="warning">
            {liq > 0 ? price(liq) : 'None'}
          </Big>
          <Rows
            rows={[
              ['Move against you that liquidates', `${formatPct(move, 1)} ${direction === 'long' ? 'down' : 'up'}`],
              ['Position value', formatMoney(value)],
              ['Quantity', quantity.toLocaleString('en-US', { maximumFractionDigits: 6 })],
              ['Lost at liquidation', formatMoney(margin.value!)],
              ...(pnl != null
                ? ([
                    [`Result at ${price(exit.value!)}`, <span key="p" className={pnl >= 0 ? 'text-up-text' : 'text-down-text'}>{`${formatSignedMoney(pnl)} (${pnl >= 0 ? '+' : ''}${((pnl / margin.value!) * 100).toFixed(1)}% of margin)${liquidated ? ', liquidated' : ''}`}</span>],
                  ] as [string, ReactNode][])
                : []),
            ]}
          />
          <Note>
            At {leverage}x, a {formatPct(1 / leverage, 1)} move is a 100% gain or loss on your margin.{' '}
            {leverage > 5 ? <span className="text-warning-text">Above 5x, ordinary daily swings can reach the liquidation price.</span> : 'Lower leverage keeps the liquidation price further away.'} Uses
            isolated margin with a {formatPct(DEFAULT_MAINTENANCE_MARGIN_RATE, 1)} maintenance rate; funding is not included.
          </Note>
        </>
      ) : (
        <Missing>Enter your margin and an entry price.</Missing>
      )}
    </Calculator>
  );
}

function OptionProfit() {
  const [type, setType] = useState<'call' | 'put'>('call');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const spot = useNumber(100);
  const strike = useNumber(105);
  const days = useNumber(30);
  const iv = useNumber(40);
  const premium = useNumber('');
  const contracts = useNumber(1);
  const multiplier = useNumber(100);
  const target = useNumber(112);
  const targetDays = useNumber(15);
  const r =
    spot.value != null && strike.value != null && days.value != null && iv.value != null && contracts.value != null && multiplier.value != null && target.value != null
      ? optionOutcome({
          type,
          side,
          spot: spot.value,
          strike: strike.value,
          days: days.value,
          volatility: iv.value / 100,
          rate: 0.04,
          premium: premium.value,
          contracts: contracts.value,
          multiplier: multiplier.value,
          targetPrice: target.value,
          targetDays: targetDays.value ?? 0,
        })
      : null;
  const limit = (v: number | 'unlimited') => (v === 'unlimited' ? 'Unlimited' : formatMoney(v));
  return (
    <Calculator
      title="Option profit"
      intro={
        <>
          What one option is worth if the underlying reaches a price by a date, and at expiry. Prices come from the <GlossaryTerm id="black-scholes">Black-Scholes</GlossaryTerm> model, so they
          are estimates. For several legs, use the builder on the Options page.
        </>
      }
      inputs={
        <>
          <Select label="Option" value={type} onChange={setType} options={[{ value: 'call', label: 'Call' }, { value: 'put', label: 'Put' }]} />
          <Select label="You" value={side} onChange={setSide} options={[{ value: 'buy', label: 'Buy it' }, { value: 'sell', label: 'Sell it' }]} />
          <Field label="Underlying price" field={spot} />
          <Field label="Strike" field={strike} />
          <Field label="Days to expiry" field={days} />
          <Field label="Implied volatility" field={iv} suffix="%" />
          <Field label="Premium per unit" field={premium} hint="Blank uses the model price" />
          <Field label="Contracts" field={contracts} />
          <Field label="Units per contract" field={multiplier} hint="100 for stocks" />
          <Field label="Price to test" field={target} />
          <Field label="Days from now" field={targetDays} hint="At or past expiry = at expiry" />
        </>
      }
    >
      {r ? (
        <>
          <Big label={`Result if price is ${price(target.value!)} ${(targetDays.value ?? 0) >= days.value! ? 'at expiry' : `in ${targetDays.value ?? 0} days`}`} tone={r.pnl >= 0 ? 'up' : 'down'}>
            {formatSignedMoney(r.pnl)}
          </Big>
          <Rows
            rows={[
              ['Premium per unit', price(r.premium)],
              [side === 'buy' ? 'You pay' : 'You receive', formatMoney(r.premiumTotal)],
              ['Option value then, per unit', price(r.valueThen)],
              ['Result at that price at expiry', formatSignedMoney(r.pnlAtExpiry)],
              ['Break-even at expiry', price(r.breakEven)],
              ['Most you can make', limit(r.maxProfit)],
              ['Most you can lose', <span key="l" className={r.maxLoss === 'unlimited' ? 'text-warning-text' : undefined}>{limit(r.maxLoss)}</span>],
            ]}
          />
          <Note>
            {side === 'buy'
              ? 'A bought option loses value every day the price does not move enough. Compare the result before expiry with the result at expiry to see that time value.'
              : 'A sold option earns the premium if it expires worthless, but the loss can be many times the premium.'}
          </Note>
        </>
      ) : (
        <Missing>Enter the price, strike, days, volatility, contracts and a price to test, all above zero.</Missing>
      )}
    </Calculator>
  );
}

function Probability() {
  const spot = useNumber(100);
  const target = useNumber(110);
  const days = useNumber(30);
  const vol = useNumber(40);
  const r = spot.value != null && target.value != null && days.value != null && vol.value != null ? priceProbability(spot.value, target.value, days.value, vol.value / 100, 0.04) : null;
  return (
    <Calculator
      title="Probability"
      intro={
        <>
          The chance a price finishes above or below a level by a date, under the assumption built into option prices: random moves sized by <GlossaryTerm id="implied-volatility">volatility</GlossaryTerm>.
          It is the model's chance, not a prediction. Use it for the chance an option finishes in the money, or a trade reaches its break-even.
        </>
      }
      inputs={
        <>
          <Field label="Price now" field={spot} />
          <Field label="Target price" field={target} hint="e.g. a strike or a break-even" />
          <Field label="Days" field={days} />
          <Field label="Volatility (annual)" field={vol} suffix="%" />
        </>
      }
    >
      {r ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Big label={`Finishes above ${price(target.value!)}`}>{formatPct(r.above, 1)}</Big>
            <Big label={`Finishes below ${price(target.value!)}`}>{formatPct(r.below, 1)}</Big>
          </div>
          <Rows rows={[['Likely range (about 2 times in 3)', `${price(r.oneSigma.low)} to ${price(r.oneSigma.high)}`]]} />
          <Note>
            The model treats up and down moves as equally likely once sized by volatility. Markets trend, gap and panic, so real odds differ, most of all for moves far from the current price.
          </Note>
        </>
      ) : (
        <Missing>Enter a price, a target, days and a volatility, all above zero.</Missing>
      )}
    </Calculator>
  );
}

const PANELS: Record<ToolId, () => ReactNode> = {
  size: () => <PositionSize />,
  rr: () => <RiskReward />,
  compound: () => <Compounding />,
  breakeven: () => <BreakEven />,
  leverage: () => <Leverage />,
  option: () => <OptionProfit />,
  probability: () => <Probability />,
};

/** Seven small calculators. Each one keeps what you typed while you switch between them. */
export function ToolsPage() {
  const [tool, setTool] = useState<ToolId>('size');
  return (
    <Page>
      <PageHeader title="Calculators" description="Quick arithmetic for planning a trade. Nothing here places an order." />
      <Tabs<ToolId> label="Calculators" idBase="tools" variant="pill" value={tool} onChange={setTool} items={TOOLS} />
      {TOOLS.map((t) => (
        <div key={t.id} hidden={tool !== t.id}>
          <TabPanel idBase="tools" id={t.id} active>
            {PANELS[t.id]()}
          </TabPanel>
        </div>
      ))}
    </Page>
  );
}

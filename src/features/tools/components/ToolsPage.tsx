import { useState, type ReactNode } from 'react';
import { LineDiagram } from '@/components/chart';
import { Card, GlossaryTerm, Input, Page, PageHeader, Select, Slider, TabPanel, Tabs, Trans } from '@/components/ui';
import { t } from '@/i18n';
import { compound, optionOutcome, periodsToDouble, priceProbability } from '@/lib/calculators';
import { formatMoney, formatPct, formatSignedMoney } from '@/lib/format';
import { DEFAULT_MAINTENANCE_MARGIN_RATE, liquidationPrice, MAX_LEVERAGE } from '@/lib/trading/futures';
import { breakEvenWinRate, expectancy, positionSize, riskReward } from '@/lib/trading/sizing';
import { useAccountSnapshot } from '@/stores';

type ToolId = 'size' | 'rr' | 'compound' | 'breakeven' | 'leverage' | 'option' | 'probability';

const TOOLS: { id: ToolId; label: string }[] = [
  { id: 'size', label: t('Position size') },
  { id: 'rr', label: t('Risk/reward') },
  { id: 'compound', label: t('Compounding') },
  { id: 'breakeven', label: t('Break-even win rate') },
  { id: 'leverage', label: t('Leverage and liquidation') },
  { id: 'option', label: t('Option profit') },
  { id: 'probability', label: t('Probability') },
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
      <Card title={t('Result')}>
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
const Missing = ({ children = t('Fill in the fields to see the result.') }: { children?: ReactNode }) => <p className="text-sm text-muted">{children}</p>;
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
      title={t('Position size')}
      intro={
        <Trans
          text="Decide how much you are willing to lose first, then let the distance to your {stopLoss} set the size. A wider stop means a smaller position, so every trade risks the same amount."
          values={{ stopLoss: <GlossaryTerm id="stop-loss">{t('stop-loss')}</GlossaryTerm> }}
        />
      }
      inputs={
        <>
          <Field label={t('Account size')} field={equity} prefix="$" />
          <Field label={t('Risk per trade')} field={risk} suffix="%" hint={t('1% to 2% is the usual guideline')} />
          <Field label={t('Entry price')} field={entry} />
          <Field label={t('Stop-loss price')} field={stop} />
        </>
      }
    >
      {r ? (
        <>
          <Big label={r.direction === 'long' ? t('Size to trade (long)') : t('Size to trade (short)')}>
            {t('{n} units', { n: r.quantity.toLocaleString('en-US', { maximumFractionDigits: 4 }) })}
          </Big>
          <Rows
            rows={[
              [t('You lose if stopped out'), formatMoney(r.riskAmount)],
              [t('Stop distance'), `${price(r.stopDistance)} (${formatPct(r.stopFraction, 2)})`],
              [t('Position value'), formatMoney(r.positionValue)],
              [t('Position as a share of the account'), formatPct(r.leverageNeeded, 0)],
            ]}
          />
          {r.leverageNeeded > 1 && (
            <Note>
              <span className="text-warning-text">{t('This position is larger than the account.')}</span>{' '}
              {t('It needs {n}x leverage. The loss at the stop is still {loss}, but a gap past the stop would cost more.', {
                n: r.leverageNeeded.toFixed(1),
                loss: formatMoney(r.riskAmount),
              })}
            </Note>
          )}
          {risk.value != null && risk.value > 2 && <Note>{t('Risking more than 2% a trade means a normal losing streak takes a large bite out of the account.')}</Note>}
        </>
      ) : (
        <Missing>{t('Enter an account size, a risk above zero, and an entry and stop that differ.')}</Missing>
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
      title={t('Risk/reward')}
      intro={t('How much a trade can make compared with what it can lose. Together with how often you win, it decides whether a way of trading makes money.')}
      inputs={
        <>
          <Field label={t('Entry price')} field={entry} />
          <Field label={t('Stop-loss price')} field={stop} />
          <Field label={t('Take-profit price')} field={target} />
          <Field label={t('Your win rate')} field={win} suffix="%" hint={t('Optional')} />
        </>
      }
    >
      {ratio != null ? (
        <>
          <Big label={t('Reward to risk')}>{ratio.toFixed(2)} : 1</Big>
          <Rows
            rows={[
              [t('Risk per unit'), price(Math.abs(entry.value! - stop.value!))],
              [t('Reward per unit'), price(Math.abs(target.value! - entry.value!))],
              [t('Win rate needed to break even'), formatPct(breakEvenWinRate(ratio), 1)],
              ...(edge != null
                ? ([
                    [
                      t('Expectancy at your win rate'),
                      <span key="e" className={edge >= 0 ? 'text-up-text' : 'text-down-text'}>
                        {t('{r}R per trade', { r: `${edge >= 0 ? '+' : ''}${edge.toFixed(2)}` })}
                      </span>,
                    ],
                  ] as [string, ReactNode][])
                : []),
            ]}
          />
          <Note>
            {t('At {ratio} : 1 you can be wrong {share} of the time and still not lose money, before fees.', {
              ratio: ratio.toFixed(2),
              share: formatPct(1 - breakEvenWinRate(ratio), 0),
            })}
            {edge != null &&
              ` ${
                edge >= 0
                  ? t('Winning {pct}% of the time, each trade is worth {r} times what you risk, on average.', { pct: win.value!, r: edge.toFixed(2) })
                  : t('Winning {pct}% of the time is not enough: on average each trade loses {r} times what you risk.', { pct: win.value!, r: Math.abs(edge).toFixed(2) })
              }`}
          </Note>
        </>
      ) : (
        <Missing>{t('The stop-loss and the take-profit must be on opposite sides of the entry.')}</Missing>
      )}
    </Calculator>
  );
}

type Unit = 'week' | 'month' | 'year';

/** Every phrase that names the period, written out per unit so each language can word it its own way. */
const UNIT_TEXT: Record<Unit, { per: string; count: string; added: string; axis: string; after: string; amount: string; balance: string; note: string }> = {
  week: {
    per: t('Return per week'),
    count: t('Number of weeks'),
    added: t('Added each week'),
    axis: t('weeks'),
    after: t('After {n} weeks'),
    amount: t('{n} weeks'),
    balance: t('Balance over {n} weeks, from {start} to {end}.'),
    note: t('No one earns the same return every week. Real results arrive unevenly, with losing stretches, so treat this as arithmetic, not a forecast.'),
  },
  month: {
    per: t('Return per month'),
    count: t('Number of months'),
    added: t('Added each month'),
    axis: t('months'),
    after: t('After {n} months'),
    amount: t('{n} months'),
    balance: t('Balance over {n} months, from {start} to {end}.'),
    note: t('No one earns the same return every month. Real results arrive unevenly, with losing stretches, so treat this as arithmetic, not a forecast.'),
  },
  year: {
    per: t('Return per year'),
    count: t('Number of years'),
    added: t('Added each year'),
    axis: t('years'),
    after: t('After {n} years'),
    amount: t('{n} years'),
    balance: t('Balance over {n} years, from {start} to {end}.'),
    note: t('No one earns the same return every year. Real results arrive unevenly, with losing stretches, so treat this as arithmetic, not a forecast.'),
  },
};

function Compounding() {
  const start = useNumber(10000);
  const rate = useNumber(2);
  const periods = useNumber(24);
  const add = useNumber(0);
  const [unit, setUnit] = useState<Unit>('month');
  const text = UNIT_TEXT[unit];
  const fill = (template: string, vars: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name]));
  const ok = start.value != null && rate.value != null && periods.value != null && periods.value >= 1 && periods.value <= 600;
  const r = ok ? compound({ start: start.value!, ratePct: rate.value!, periods: periods.value!, contribution: add.value ?? 0 }) : null;
  const double = rate.value != null ? periodsToDouble(rate.value) : Infinity;
  return (
    <Calculator
      title={t('Compounding')}
      intro={t(
        "What steady growth adds up to when each period's gain is left in to grow too. Useful for seeing why small, repeatable gains matter more than big wins, and why losses hurt more than they look.",
      )}
      inputs={
        <>
          <Field label={t('Starting amount')} field={start} prefix="$" />
          <Field label={text.per} field={rate} suffix="%" />
          <Field label={text.count} field={periods} />
          <Select
            label={t('Period')}
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'week', label: t('Weeks') },
              { value: 'month', label: t('Months') },
              { value: 'year', label: t('Years') },
            ]}
          />
          <Field label={text.added} field={add} prefix="$" hint={t('Optional')} />
        </>
      }
    >
      {r ? (
        <>
          <Big label={fill(text.after, { n: periods.value! })} tone={r.final >= r.paidIn ? 'up' : 'down'}>
            {formatMoney(r.final)}
          </Big>
          <Rows
            rows={[
              [t('Paid in'), formatMoney(r.paidIn)],
              [t('From growth'), formatSignedMoney(r.growth)],
              [t('Time to double at this rate'), Number.isFinite(double) ? fill(text.amount, { n: double.toFixed(1) }) : t('Never')],
            ]}
          />
          <LineDiagram
            className="mt-4"
            ariaLabel={fill(text.balance, { n: periods.value!, start: formatMoney(r.series[0]), end: formatMoney(r.final) })}
            series={[{ points: r.series.map((y, x) => ({ x, y })) }]}
            formatX={(x) => String(Math.round(x))}
            formatY={(y) => (Math.abs(y) >= 1000 ? `$${(y / 1000).toFixed(Math.abs(y) >= 100_000 ? 0 : 1)}k` : `$${y.toFixed(0)}`)}
            xLabel={text.axis}
            height={200}
          />
          <Note>{text.note}</Note>
        </>
      ) : (
        <Missing>{t('Enter a starting amount, a return, and between 1 and 600 periods.')}</Missing>
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
      title={t('Break-even win rate')}
      intro={
        <Trans
          text="How often you need to win, given the size of your average win and loss. Your own figures are on the {analytics} page once you have closed some trades."
          values={{ analytics: <span className="text-fg">{t('Analytics')}</span> }}
        />
      }
      inputs={
        <>
          <Field label={t('Average win')} field={win} prefix="$" />
          <Field label={t('Average loss')} field={loss} prefix="$" hint={t('As a positive number')} />
          <Field label={t('Your win rate')} field={rate} suffix="%" hint={t('Optional')} />
        </>
      }
    >
      {needed != null ? (
        <>
          <Big label={t('Win rate needed to break even')}>{formatPct(needed, 1)}</Big>
          <Rows
            rows={[
              [t('Average win ÷ average loss'), `${(win.value! / loss.value!).toFixed(2)} : 1`],
              ...(perTrade != null
                ? ([
                    [
                      t('Expectancy at your win rate'),
                      <span key="e" className={perTrade >= 0 ? 'text-up-text' : 'text-down-text'}>
                        {t('{amount} per trade', { amount: formatSignedMoney(perTrade) })}
                      </span>,
                    ],
                  ] as [string, ReactNode][])
                : []),
              ...(perTrade != null ? ([[t('Over 100 trades'), formatSignedMoney(perTrade * 100)]] as [string, ReactNode][]) : []),
            ]}
          />
          <Note>
            {t(
              'Bigger wins than losses let you be wrong more often. Small wins and big losses need a very high win rate, which is the trap in taking profits early and letting losers run.',
            )}
          </Note>
        </>
      ) : (
        <Missing>{t('Enter an average win and an average loss above zero.')}</Missing>
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
  const ofMargin = pnl == null ? '' : `${pnl >= 0 ? '+' : ''}${((pnl / margin.value!) * 100).toFixed(1)}`;
  return (
    <Calculator
      title={t('Leverage and liquidation')}
      intro={
        <Trans
          text="{leverage} lets a small amount of your money control a larger position. It multiplies gains and losses alike, and sets the price at which the exchange closes the position and keeps your margin: the {liquidation} price."
          values={{
            leverage: <GlossaryTerm id="leverage">{t('Leverage')}</GlossaryTerm>,
            liquidation: <GlossaryTerm id="liquidation">{t('liquidation')}</GlossaryTerm>,
          }}
        />
      }
      inputs={
        <>
          <Select
            label={t('Direction')}
            value={direction}
            onChange={setDirection}
            options={[
              { value: 'long', label: t('Long (buy first)') },
              { value: 'short', label: t('Short (sell first)') },
            ]}
          />
          <Field label={t('Your margin')} field={margin} prefix="$" />
          <Field label={t('Entry price')} field={entry} />
          <Field label={t('Exit price to test')} field={exit} hint={t('Optional')} />
          <Slider wrapperClassName="col-span-2" label={t('Leverage')} min={1} max={MAX_LEVERAGE} step={1} value={leverage} onChange={setLeverage} format={(v) => `${v}x`} />
        </>
      }
    >
      {ok ? (
        <>
          <Big label={t('Liquidation price')} tone="warning">
            {liq > 0 ? price(liq) : t('None')}
          </Big>
          <Rows
            rows={[
              [t('Move against you that liquidates'), direction === 'long' ? t('{pct} down', { pct: formatPct(move, 1) }) : t('{pct} up', { pct: formatPct(move, 1) })],
              [t('Position value'), formatMoney(value)],
              [t('Quantity'), quantity.toLocaleString('en-US', { maximumFractionDigits: 6 })],
              [t('Lost at liquidation'), formatMoney(margin.value!)],
              ...(pnl != null
                ? ([
                    [
                      t('Result at {price}', { price: price(exit.value!) }),
                      <span key="p" className={pnl >= 0 ? 'text-up-text' : 'text-down-text'}>
                        {liquidated
                          ? t('{pnl} ({pct}% of margin), liquidated', { pnl: formatSignedMoney(pnl), pct: ofMargin })
                          : t('{pnl} ({pct}% of margin)', { pnl: formatSignedMoney(pnl), pct: ofMargin })}
                      </span>,
                    ],
                  ] as [string, ReactNode][])
                : []),
            ]}
          />
          <Note>
            {t('At {n}x, a {move} move is a 100% gain or loss on your margin.', { n: leverage, move: formatPct(1 / leverage, 1) })}{' '}
            {leverage > 5 ? (
              <span className="text-warning-text">{t('Above 5x, ordinary daily swings can reach the liquidation price.')}</span>
            ) : (
              t('Lower leverage keeps the liquidation price further away.')
            )}{' '}
            {t('Uses isolated margin with a {rate} maintenance rate; funding is not included.', { rate: formatPct(DEFAULT_MAINTENANCE_MARGIN_RATE, 1) })}
          </Note>
        </>
      ) : (
        <Missing>{t('Enter your margin and an entry price.')}</Missing>
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
  const limit = (v: number | 'unlimited') => (v === 'unlimited' ? t('Unlimited') : formatMoney(v));
  return (
    <Calculator
      title={t('Option profit')}
      intro={
        <Trans
          text="What one option is worth if the underlying reaches a price by a date, and at expiry. Prices come from the {model} model, so they are estimates. For several legs, use the builder on the Options page."
          values={{ model: <GlossaryTerm id="black-scholes">Black-Scholes</GlossaryTerm> }}
        />
      }
      inputs={
        <>
          <Select
            label={t('Option')}
            value={type}
            onChange={setType}
            options={[
              { value: 'call', label: t('Call') },
              { value: 'put', label: t('Put') },
            ]}
          />
          <Select
            label={t('You')}
            value={side}
            onChange={setSide}
            options={[
              { value: 'buy', label: t('Buy it') },
              { value: 'sell', label: t('Sell it') },
            ]}
          />
          <Field label={t('Underlying price')} field={spot} />
          <Field label={t('Strike')} field={strike} />
          <Field label={t('Days to expiry')} field={days} />
          <Field label={t('Implied volatility')} field={iv} suffix="%" />
          <Field label={t('Premium per unit')} field={premium} hint={t('Blank uses the model price')} />
          <Field label={t('Contracts')} field={contracts} />
          <Field label={t('Units per contract')} field={multiplier} hint={t('100 for stocks')} />
          <Field label={t('Price to test')} field={target} />
          <Field label={t('Days from now')} field={targetDays} hint={t('At or past expiry = at expiry')} />
        </>
      }
    >
      {r ? (
        <>
          <Big
            label={
              (targetDays.value ?? 0) >= days.value!
                ? t('Result if price is {price} at expiry', { price: price(target.value!) })
                : t('Result if price is {price} in {n} days', { price: price(target.value!), n: targetDays.value ?? 0 })
            }
            tone={r.pnl >= 0 ? 'up' : 'down'}
          >
            {formatSignedMoney(r.pnl)}
          </Big>
          <Rows
            rows={[
              [t('Premium per unit'), price(r.premium)],
              [side === 'buy' ? t('You pay') : t('You receive'), formatMoney(r.premiumTotal)],
              [t('Option value then, per unit'), price(r.valueThen)],
              [t('Result at that price at expiry'), formatSignedMoney(r.pnlAtExpiry)],
              [t('Break-even at expiry'), price(r.breakEven)],
              [t('Most you can make'), limit(r.maxProfit)],
              [
                t('Most you can lose'),
                <span key="l" className={r.maxLoss === 'unlimited' ? 'text-warning-text' : undefined}>
                  {limit(r.maxLoss)}
                </span>,
              ],
            ]}
          />
          <Note>
            {side === 'buy'
              ? t('A bought option loses value every day the price does not move enough. Compare the result before expiry with the result at expiry to see that time value.')
              : t('A sold option earns the premium if it expires worthless, but the loss can be many times the premium.')}
          </Note>
        </>
      ) : (
        <Missing>{t('Enter the price, strike, days, volatility, contracts and a price to test, all above zero.')}</Missing>
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
      title={t('Probability')}
      intro={
        <Trans
          text="The chance a price finishes above or below a level by a date, under the assumption built into option prices: random moves sized by {volatility}. It is the model's chance, not a prediction. Use it for the chance an option finishes in the money, or a trade reaches its break-even."
          values={{ volatility: <GlossaryTerm id="implied-volatility">{t('volatility')}</GlossaryTerm> }}
        />
      }
      inputs={
        <>
          <Field label={t('Price now')} field={spot} />
          <Field label={t('Target price')} field={target} hint={t('e.g. a strike or a break-even')} />
          <Field label={t('Days')} field={days} />
          <Field label={t('Volatility (annual)')} field={vol} suffix="%" />
        </>
      }
    >
      {r ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Big label={t('Finishes above {price}', { price: price(target.value!) })}>{formatPct(r.above, 1)}</Big>
            <Big label={t('Finishes below {price}', { price: price(target.value!) })}>{formatPct(r.below, 1)}</Big>
          </div>
          <Rows rows={[[t('Likely range (about 2 times in 3)'), t('{from} to {to}', { from: price(r.oneSigma.low), to: price(r.oneSigma.high) })]]} />
          <Note>
            {t(
              'The model treats up and down moves as equally likely once sized by volatility. Markets trend, gap and panic, so real odds differ, most of all for moves far from the current price.',
            )}
          </Note>
        </>
      ) : (
        <Missing>{t('Enter a price, a target, days and a volatility, all above zero.')}</Missing>
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
      <PageHeader title={t('Calculators')} description={t('Quick arithmetic for planning a trade. Nothing here places an order.')} />
      <Tabs<ToolId> label={t('Calculators')} idBase="tools" variant="pill" value={tool} onChange={setTool} items={TOOLS} />
      {TOOLS.map((item) => (
        <div key={item.id} hidden={tool !== item.id}>
          <TabPanel idBase="tools" id={item.id} active>
            {PANELS[item.id]()}
          </TabPanel>
        </div>
      ))}
    </Page>
  );
}

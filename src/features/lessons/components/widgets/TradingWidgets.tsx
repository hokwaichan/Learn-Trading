import { useMemo, useState, type ReactNode } from 'react';
import { LineDiagram } from '@/components/chart';
import { Badge, Button, cn, Input, Pnl, ProgressBar, Slider, Trans } from '@/components/ui';
import { t } from '@/i18n';
import { formatMoney, formatPct, formatPrice, formatQty, formatSignedPct } from '@/lib/format';
import { anatomy, classifyShape } from '@/lib/patterns/anatomy';
import { simulateTrades } from '@/lib/random';
import { fillMarketOrder } from '@/lib/trading/book';
import { breakEvenWinRate, expectancy, leveragedOutcome, positionSize } from '@/lib/trading/sizing';

/** The bordered box every lesson widget sits in. */
export function WidgetFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="not-prose my-5 rounded-card border border-border bg-surface text-sm">
      <header className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Badge tone="accent">{t('Try it')}</Badge>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Readout({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 border-b border-border py-1.5 last:border-b-0', className)}>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="num text-sm text-fg">{children}</dd>
    </div>
  );
}

// ── Candle anatomy ─────────────────────────────────────────────────────

const SHAPE_NAMES = {
  doji: t('This shape is called a doji.'),
  hammer: t('This shape is called a hammer shape.'),
  'shooting-star': t('This shape is called a shooting star shape.'),
  marubozu: t('This shape is called a marubozu.'),
  'spinning-top': t('This shape is called a spinning top.'),
};

export function CandleAnatomy() {
  const [open, setOpen] = useState(100);
  const [close, setClose] = useState(106);
  const [upper, setUpper] = useState(3);
  const [lower, setLower] = useState(4);

  const high = Math.max(open, close) + upper;
  const low = Math.min(open, close) - lower;
  const candle = { time: 0, open, high, low, close, volume: 0 };
  const a = anatomy(candle);
  const shape = classifyShape(candle);
  const up = close >= open;
  const color = close === open ? 'var(--c-muted)' : up ? 'var(--c-up)' : 'var(--c-down)';

  // Fixed scale so the candle visibly grows and shrinks.
  const y = (price: number) => 16 + ((122 - price) / 44) * 208;
  const bodyTop = y(Math.max(open, close));
  const bodyHeight = Math.max(2, y(Math.min(open, close)) - bodyTop);
  const label = (price: number, text: string, side: 'left' | 'right') => (
    <g>
      <line x1={side === 'left' ? 70 : 130} x2={side === 'left' ? 84 : 116} y1={y(price)} y2={y(price)} stroke="var(--c-muted)" strokeDasharray="2 2" />
      <text x={side === 'left' ? 66 : 134} y={y(price) + 4} textAnchor={side === 'left' ? 'end' : 'start'} fontSize={11} fill="var(--c-fg)">
        {text} <tspan className="num" fill="var(--c-muted)">{formatPrice(price)}</tspan>
      </text>
    </g>
  );

  return (
    <WidgetFrame title={t('Build a candle')}>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="flex flex-col gap-3">
          <Slider label={t('Open')} min={84} max={116} step={0.5} value={open} onChange={setOpen} format={(v) => formatPrice(v)} />
          <Slider label={t('Close')} min={84} max={116} step={0.5} value={close} onChange={setClose} format={(v) => formatPrice(v)} />
          <Slider label={t('Upper wick length')} min={0} max={6} step={0.5} value={upper} onChange={setUpper} format={(v) => formatPrice(v)} />
          <Slider label={t('Lower wick length')} min={0} max={6} step={0.5} value={lower} onChange={setLower} format={(v) => formatPrice(v)} />
          <p className="text-[13px] leading-relaxed text-fg" aria-live="polite">
            {close === open
              ? t('Open and close are equal.')
              : up
                ? t('It closed above its open: an up (bullish) candle.')
                : t('It closed below its open: a down (bearish) candle.')}{' '}
            {t('The body is {body} of the candle, the upper wick {upper} and the lower wick {lower}.', {
              body: formatPct(a.bodyPct, 0),
              upper: formatPct(a.upperWickPct, 0),
              lower: formatPct(a.lowerWickPct, 0),
            })}{' '}
            {shape ? <strong>{SHAPE_NAMES[shape]}</strong> : t('This shape has no special name.')}
          </p>
        </div>
        <svg viewBox="0 0 200 240" role="img" aria-label={t('A candle with open {open}, high {high}, low {low}, close {close}', { open, high, low, close })} className="mx-auto h-60 w-full max-w-[220px]">
          <line x1={100} x2={100} y1={y(high)} y2={y(low)} stroke={color} strokeWidth={2} />
          <rect x={84} y={bodyTop} width={32} height={bodyHeight} fill={color} rx={1} />
          {label(high, t('High'), 'right')}
          {label(low, t('Low'), 'right')}
          {label(open, t('Open'), 'left')}
          {label(close, t('Close'), 'left')}
        </svg>
      </div>
    </WidgetFrame>
  );
}

// ── Order book ─────────────────────────────────────────────────────────

const ASKS = [
  { price: 100.02, size: 300 },
  { price: 100.03, size: 500 },
  { price: 100.05, size: 800 },
  { price: 100.08, size: 1200 },
  { price: 100.12, size: 2000 },
];
const BIDS = [
  { price: 99.98, size: 400 },
  { price: 99.97, size: 600 },
  { price: 99.95, size: 900 },
  { price: 99.92, size: 1100 },
  { price: 99.88, size: 1800 },
];

export function OrderBook() {
  const [quantity, setQuantity] = useState(200);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const levels = side === 'buy' ? ASKS : BIDS;
  const fill = fillMarketOrder(levels, quantity);
  const takenAt = new Map(fill?.taken.map((level) => [level.price, level.size]));
  const maxSize = 2000;
  const spread = ASKS[0].price - BIDS[0].price;

  const row = (level: { price: number; size: number }, kind: 'ask' | 'bid') => {
    const active = (kind === 'ask') === (side === 'buy');
    const taken = active ? (takenAt.get(level.price) ?? 0) : 0;
    return (
      <tr key={level.price}>
        <td className={cn('num py-0.5 pr-3 text-right', kind === 'ask' ? 'text-down-text' : 'text-up-text')}>{formatPrice(level.price)}</td>
        <td className="num py-0.5 pr-3 text-right text-fg">{level.size}</td>
        <td className="w-full py-0.5">
          <div className="relative h-3 rounded-sm bg-border/50" style={{ width: `${(level.size / maxSize) * 100}%` }}>
            <div className="absolute inset-y-0 left-0 rounded-sm bg-accent" style={{ width: `${(taken / level.size) * 100}%` }} />
          </div>
        </td>
        <td className="num py-0.5 pl-2 text-right text-xs text-accent-text">{taken > 0 ? `-${taken}` : ''}</td>
      </tr>
    );
  };

  return (
    <WidgetFrame title={t('An order book')}>
      <div className="grid gap-5 sm:grid-cols-2">
        <table className="w-full text-sm" aria-label={t('Order book')}>
          <thead>
            <tr className="text-xs text-muted">
              <th scope="col" className="pr-3 text-right font-medium">{t('Price')}</th>
              <th scope="col" className="pr-3 text-right font-medium">{t('Size')}</th>
              <th scope="col" colSpan={2} className="text-left font-medium">{t('Waiting orders')}</th>
            </tr>
          </thead>
          <tbody>
            {[...ASKS].reverse().map((l) => row(l, 'ask'))}
            <tr>
              <td colSpan={4} className="py-1.5 text-center text-xs text-muted">
                <Trans
                  text="Ask {ask} · spread {spread} · bid {bid}"
                  values={{
                    ask: <span className="num text-fg">{formatPrice(ASKS[0].price)}</span>,
                    spread: <span className="num text-fg">{formatPrice(spread)}</span>,
                    bid: <span className="num text-fg">{formatPrice(BIDS[0].price)}</span>,
                  }}
                />
              </td>
            </tr>
            {BIDS.map((l) => row(l, 'bid'))}
          </tbody>
        </table>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2" role="group" aria-label={t('Order side')}>
            <Button variant={side === 'buy' ? 'buy' : 'secondary'} aria-pressed={side === 'buy'} onClick={() => setSide('buy')} block>
              {t('Market buy')}
            </Button>
            <Button variant={side === 'sell' ? 'sell' : 'secondary'} aria-pressed={side === 'sell'} onClick={() => setSide('sell')} block>
              {t('Market sell')}
            </Button>
          </div>
          <Slider label={t('Order size')} min={100} max={4000} step={100} value={quantity} onChange={setQuantity} format={(v) => t('{n} units', { n: v })} />
          {fill && (
            <dl aria-live="polite">
              <Readout label={side === 'buy' ? t('Best ask') : t('Best bid')}>{formatPrice(levels[0].price)}</Readout>
              <Readout label={t('Your average fill')}>{formatPrice(fill.averagePrice, 0.0001)}</Readout>
              <Readout label={t('Worst price reached')}>{formatPrice(fill.lastPrice)}</Readout>
              <Readout label={t('Slippage')}>{formatPct(fill.slippage, 3)}</Readout>
            </dl>
          )}
          <p className="text-xs text-muted">
            {t('A small order fills at the best price. A large one uses up that level and moves on to worse prices: that is slippage.')}
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Leverage ───────────────────────────────────────────────────────────

export function LeverageDemo() {
  const [leverage, setLeverage] = useState(10);
  const [move, setMove] = useState(-4);
  const margin = 1000;
  const result = leveragedOutcome(margin, leverage, move / 100, 'long');
  const used = Math.min(1, Math.max(0, -result.pnl / margin));

  return (
    <WidgetFrame title={t('Leverage on a $1,000 long')}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Slider label={t('Leverage')} min={1} max={50} value={leverage} onChange={setLeverage} format={(v) => `${v}x`} />
          <Slider label={t('Price move')} min={-30} max={30} step={0.5} value={move} onChange={setMove} format={(v) => formatSignedPct(v / 100, 1)} />
          <div>
            <p className="mb-1 text-xs text-muted">{t('Margin used up by the loss')}</p>
            <ProgressBar label={t('Share of margin lost')} value={used} tone={used >= 1 ? 'down' : used > 0.5 ? 'warning' : 'accent'} showValue />
          </div>
        </div>
        {/* A <dl> may only hold term and description pairs, so the status badge sits beside it and the live region wraps both. */}
        <div aria-live="polite">
          <dl>
          <Readout label={t('Your margin')}>{formatMoney(margin)}</Readout>
          <Readout label={t('Position value')}>{formatMoney(result.positionValue)}</Readout>
          <Readout label={t('Profit or loss')}>
            <Pnl value={result.pnl} />
          </Readout>
          <Readout label={t('Return on your margin')}>
            <Pnl value={result.returnOnMargin} format="pct" decimals={1} />
          </Readout>
          <Readout label={t('Move that wipes you out')}>{t('{pct} against you', { pct: formatPct(result.wipeoutMove, 1) })}</Readout>
          </dl>
          <div className="pt-2">
            {result.liquidated ? (
              <Badge tone="down">{t('Liquidated: the whole $1,000 is gone')}</Badge>
            ) : leverage > 5 ? (
              <Badge tone="warning">{t('Above 5x: an ordinary day can do this')}</Badge>
            ) : (
              <Badge tone="up">{t('Position still open')}</Badge>
            )}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

// ── Position size ──────────────────────────────────────────────────────

export function PositionSizeWidget() {
  const [equity, setEquity] = useState('10000');
  const [risk, setRisk] = useState(1);
  const [entry, setEntry] = useState('50');
  const [stop, setStop] = useState('48');
  const result = positionSize({ equity: Number(equity), riskFraction: risk / 100, entry: Number(entry), stop: Number(stop) });

  return (
    <WidgetFrame title={t('Position size calculator')}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Input label={t('Account size')} numeric prefix="$" value={equity} onChange={(e) => setEquity(e.target.value)} />
          <Slider label={t('Risk per trade')} min={0.25} max={10} step={0.25} value={risk} onChange={setRisk} format={(v) => `${v}%`} />
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('Entry price')} numeric value={entry} onChange={(e) => setEntry(e.target.value)} />
            <Input label={t('Stop-loss price')} numeric value={stop} onChange={(e) => setStop(e.target.value)} />
          </div>
        </div>
        {result ? (
          <div aria-live="polite">
            <dl>
            <Readout label={t('Direction')}>{result.direction === 'long' ? t('Long (stop below entry)') : t('Short (stop above entry)')}</Readout>
            <Readout label={t('Dollars at risk')}>{formatMoney(result.riskAmount)}</Readout>
            <Readout label={t('Risk per unit')}>
              {formatPrice(result.stopDistance)} ({formatPct(result.stopFraction, 2)})
            </Readout>
            <Readout label={t('Position size')} className="font-semibold">
              {t('{n} units', { n: formatQty(result.quantity, 0.01) })}
            </Readout>
            <Readout label={t('Position value')}>{formatMoney(result.positionValue)}</Readout>
            </dl>
            <div className="flex flex-col items-start gap-1.5 pt-2">
              {risk > 2 && <Badge tone="warning">{t('Risking more than 2% per trade')}</Badge>}
              {result.leverageNeeded > 1 && (
                <Badge tone="warning">{t('Needs {n}x leverage: the position is bigger than the account', { n: result.leverageNeeded.toFixed(1) })}</Badge>
              )}
              {risk <= 2 && result.leverageNeeded <= 1 && <Badge tone="up">{t('Within the 1% to 2% guideline, no leverage needed')}</Badge>}
            </div>
          </div>
        ) : (
          <p role="status" className="self-center text-sm text-muted">
            {t('Enter an account size, an entry price and a different stop price to see the size.')}
          </p>
        )}
      </div>
    </WidgetFrame>
  );
}

// ── Expectancy simulator ───────────────────────────────────────────────

const RUN_COLORS = ['var(--c-series-1)', 'var(--c-series-2)', 'var(--c-series-3)', 'var(--c-series-4)', 'var(--c-series-5)'];
const TRADES = 50;

export function ExpectancySim() {
  const [winRate, setWinRate] = useState(40);
  const [avgWin, setAvgWin] = useState(2);
  const [batch, setBatch] = useState(1);

  const runs = useMemo(
    () => RUN_COLORS.map((_, i) => simulateTrades(winRate / 100, avgWin, TRADES, batch * 100 + i)),
    [winRate, avgWin, batch],
  );
  const e = expectancy(winRate / 100, avgWin);
  const finals = runs.map((r) => r.finalR);
  const worstStreak = Math.max(...runs.map((r) => r.longestLosingStreak));
  const r = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}R`;

  return (
    <WidgetFrame title={t('Same odds, five different outcomes')}>
      <div className="grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <Slider label={t('Win rate')} min={10} max={90} step={5} value={winRate} onChange={setWinRate} format={(v) => `${v}%`} />
          <Slider label={t('Average win (losses are 1R)')} min={0.5} max={5} step={0.25} value={avgWin} onChange={setAvgWin} format={(v) => `${v}R`} />
          <dl aria-live="polite">
            <Readout label={t('Expectancy per trade')}>
              <span className={e > 0 ? 'text-up-text' : e < 0 ? 'text-down-text' : undefined}>{r(e)}</span>
            </Readout>
            <Readout label={t('Break-even win rate')}>{formatPct(breakEvenWinRate(avgWin), 1)}</Readout>
            <Readout label={t('Expected after {n} trades', { n: TRADES })}>{r(e * TRADES)}</Readout>
            <Readout label={t('Best and worst run')}>
              {r(Math.max(...finals))} / {r(Math.min(...finals))}
            </Readout>
            <Readout label={t('Longest losing streak')}>{t('{n} in a row', { n: worstStreak })}</Readout>
          </dl>
          <Button onClick={() => setBatch((b) => b + 1)}>{t('Draw five new runs')}</Button>
        </div>
        <LineDiagram
          ariaLabel={t('Five simulated runs of {n} trades at a {winRate}% win rate and {avgWin}R average win. Results range from {worst} to {best}.', {
            n: TRADES,
            winRate,
            avgWin,
            worst: r(Math.min(...finals)),
            best: r(Math.max(...finals)),
          })}
          series={runs.map((run, i) => ({ points: run.equity.map((y, x) => ({ x, y })), color: RUN_COLORS[i] }))}
          xLabel={t('Trade number')}
          yLabel={t('Result in R')}
          formatY={(v) => `${v}R`}
          height={250}
        />
      </div>
    </WidgetFrame>
  );
}

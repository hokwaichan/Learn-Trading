import { useMemo, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, cn, ConfirmDialog, EmptyState, Input, Pnl, Slider, Tabs, toast } from '@/components/ui';
import { displaySymbol } from '@/lib/data';
import { floorToStep, formatMoney, formatPct, formatPrice, formatQty, roundToTick } from '@/lib/format';
import { feeFor, findPosition, referencePrice, unrealizedPnl, validateStops, withSlippage, type OrderRequest } from '@/lib/trading/engine';
import { positionSize, riskReward } from '@/lib/trading/sizing';
import { useAccount, useAccountSnapshot, useLastPrice, useSettings } from '@/stores';
import type { AccountId, Instrument, Side } from '@/types';

export interface OrderTicketProps {
  instrument: Instrument;
  accountId?: AccountId;
  /** Overrides the live price, for Replay. */
  price?: number;
}

type OrderKind = 'market' | 'limit' | 'stop';
type SizeMode = 'quantity' | 'risk';

/** Above this share of the account at risk on one trade, the ticket asks for confirmation. */
export const RISK_WARNING = 0.02;

const num = (text: string): number | undefined => {
  const n = Number(text);
  return text.trim() !== '' && Number.isFinite(n) && n > 0 ? n : undefined;
};

function Row({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={cn('num text-xs text-fg', strong && 'text-sm font-medium')}>{children}</dd>
    </div>
  );
}

/** Buy or sell with a market, limit or stop order, an optional stop-loss and take-profit, and a size calculator. */
export function OrderTicket({ instrument, accountId = 'main', price: priceOverride }: OrderTicketProps) {
  const account = useAccount((s) => s.accounts[accountId]);
  const place = useAccount((s) => s.place);
  const close = useAccount((s) => s.close);
  const snapshot = useAccountSnapshot(accountId);
  const live = useLastPrice(instrument);
  const feeRate = useSettings((s) => s.feeRate);
  const slippagePct = useSettings((s) => s.slippagePct);
  const market = priceOverride ?? live;

  const [side, setSide] = useState<Side>('buy');
  const [kind, setKind] = useState<OrderKind>('market');
  const [sizeMode, setSizeMode] = useState<SizeMode>('quantity');
  const [quantityText, setQuantityText] = useState('');
  const [riskPct, setRiskPct] = useState(1);
  const [priceText, setPriceText] = useState('');
  const [stopText, setStopText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const position = findPosition(account, instrument.symbol, instrument.kind);
  const direction = side === 'buy' ? 'long' : 'short';
  const base = instrument.base;
  const fmtPrice = (v: number) => formatPrice(v, instrument.tickSize);

  const trigger = num(priceText);
  const stopLoss = num(stopText);
  const takeProfit = num(targetText);
  const request = { type: kind, limitPrice: kind === 'limit' ? trigger : undefined, stopPrice: kind === 'stop' ? trigger : undefined };
  const reference = market != null ? referencePrice(request, market) : undefined;
  const entry = reference != null && kind !== 'limit' ? withSlippage(reference, side, slippagePct) : reference;

  // Size: typed directly, or worked out from the risk and the stop distance.
  const sized = useMemo(
    () => (sizeMode === 'risk' && entry != null && stopLoss != null ? positionSize({ equity: snapshot.equity, riskFraction: riskPct / 100, entry, stop: stopLoss }) : null),
    [sizeMode, entry, stopLoss, snapshot.equity, riskPct],
  );
  const quantity = sizeMode === 'risk' ? (sized ? floorToStep(sized.quantity, instrument.stepSize) : undefined) : num(quantityText);

  const value = entry != null && quantity != null ? entry * quantity : undefined;
  const fee = entry != null && quantity != null ? feeFor(entry, quantity, feeRate) : undefined;
  const riskAmount = entry != null && quantity != null && stopLoss != null ? Math.abs(entry - stopLoss) * quantity : undefined;
  const riskShare = riskAmount != null && snapshot.equity > 0 ? riskAmount / snapshot.equity : undefined;
  const ratio = entry != null && stopLoss != null && takeProfit != null ? riskReward(entry, stopLoss, takeProfit) : null;

  // Does this order add exposure, or only reduce an existing position?
  const reducing = position != null && position.direction !== direction;
  const opens = !reducing || (quantity ?? 0) > position.quantity;

  const errors: Record<string, string | undefined> = {};
  if (kind !== 'market' && trigger == null) errors.price = `Enter the ${kind} price.`;
  if (kind === 'stop' && trigger != null && market != null && (side === 'buy' ? trigger <= market : trigger >= market)) {
    errors.price = side === 'buy' ? 'A buy stop must be above the current price.' : 'A sell stop must be below the current price.';
  }
  if (sizeMode === 'quantity' && quantity == null) errors.quantity = 'Enter a quantity.';
  if (sizeMode === 'risk' && stopLoss == null) errors.stop = 'The calculator needs a stop-loss price.';
  if (quantity != null && quantity < instrument.minQty) errors.quantity = `The smallest order is ${formatQty(instrument.minQty, instrument.stepSize)} ${base}.`;
  if (reference != null && opens) {
    const problem = validateStops(direction, reference, stopLoss, takeProfit);
    if (problem) errors[problem.includes('stop-loss') ? 'stop' : 'target'] = problem;
  }
  const needed = opens && value != null ? (reducing ? (value / quantity!) * (quantity! - position!.quantity) : value) + (fee ?? 0) : 0;
  const freeAfterClose = snapshot.freeMargin + (reducing && market != null ? market * position!.quantity : 0);
  if (!errors.quantity && needed > freeAfterClose * (1 + 1e-9)) {
    errors.quantity = `Not enough free funds. This needs ${formatMoney(needed)} and ${formatMoney(Math.max(0, freeAfterClose))} is available.`;
  }
  const hasErrors = Object.values(errors).some(Boolean);

  const warnings: string[] = [];
  if (opens && stopLoss == null) warnings.push('No stop-loss. Nothing limits the loss on this trade.');
  if (opens && riskShare != null && riskShare > RISK_WARNING) {
    warnings.push(`This risks ${formatPct(riskShare, 1)} of your account (${formatMoney(riskAmount!)}), above the 2% guideline.`);
  }

  if (!instrument.live && priceOverride == null) {
    return (
      <EmptyState
        icon={<Info />}
        title={`${displaySymbol(instrument)} has no live price`}
        description="It comes from bundled daily history, so there is nothing to trade against right now."
        action={
          <Link to="/replay" className="text-sm text-accent-text underline underline-offset-4">
            Practise it in Replay
          </Link>
        }
      />
    );
  }
  if (market == null) return <EmptyState title="Waiting for a price" description="The order ticket appears as soon as a price arrives." />;

  const send = () => {
    if (quantity == null) return;
    const order: OrderRequest = {
      symbol: instrument.symbol,
      kind: instrument.kind,
      side,
      type: kind,
      quantity,
      limitPrice: request.limitPrice != null ? roundToTick(request.limitPrice, instrument.tickSize) : undefined,
      stopPrice: request.stopPrice != null ? roundToTick(request.stopPrice, instrument.tickSize) : undefined,
      stopLoss: opens ? stopLoss : undefined,
      takeProfit: opens ? takeProfit : undefined,
    };
    const events = place(accountId, order, market);
    const rejected = events.find((e) => e.type === 'order_rejected');
    const filled = events.find((e) => e.type === 'order_filled');
    const closed = events.find((e) => e.type === 'trade_closed');
    const verb = side === 'buy' ? 'Bought' : 'Sold';
    if (rejected?.type === 'order_rejected') toast.error('Order rejected', rejected.reason);
    else if (filled?.type === 'order_filled') {
      toast.success(
        `${verb} ${formatQty(quantity, instrument.stepSize)} ${base}`,
        `Filled at ${fmtPrice(filled.price)}${closed?.type === 'trade_closed' ? `. Position closed.` : ''}`,
      );
    } else toast.info(`${kind === 'limit' ? 'Limit' : 'Stop'} order placed`, `Waiting for ${displaySymbol(instrument)} to reach ${fmtPrice(trigger!)}.`);
    if (!rejected) {
      setSubmitted(false);
      setQuantityText('');
    }
  };

  const submit = () => {
    setSubmitted(true);
    if (hasErrors) return;
    if (warnings.length) setConfirming(true);
    else send();
  };

  const show = (key: string) => (submitted ? errors[key] : undefined);
  const setShare = (share: number) => {
    if (entry == null) return;
    // Leave room for the fee so "100%" is not rejected.
    const budget = (Math.max(0, snapshot.freeMargin) * share) / (1 + feeRate);
    setQuantityText(formatQty(floorToStep(budget / entry, instrument.stepSize), instrument.stepSize));
  };
  const actionLabel = `${side === 'buy' ? 'Buy' : 'Sell'}${reducing ? '' : side === 'buy' ? ' / Long' : ' / Short'}${quantity != null ? ` ${formatQty(quantity, instrument.stepSize)} ${base}` : ''}`;

  return (
    <form
      className="flex flex-col gap-3 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      noValidate
    >
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted">{displaySymbol(instrument)} price</span>
        <span className="num text-base font-medium text-fg">{fmtPrice(market)}</span>
      </div>

      {position && (
        <div className="rounded-control border border-border bg-bg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-fg">
              Open: <span className={position.direction === 'long' ? 'text-up-text' : 'text-down-text'}>{position.direction === 'long' ? 'Long' : 'Short'}</span>{' '}
              <span className="num">{formatQty(position.quantity, instrument.stepSize)}</span> at <span className="num">{fmtPrice(position.entryPrice)}</span>
            </span>
            <Pnl value={unrealizedPnl(position, market)} className="text-xs" />
          </div>
          <Button
            size="sm"
            block
            className="mt-2"
            onClick={() => {
              const events = close(accountId, position.id, market);
              const trade = events.find((e) => e.type === 'trade_closed');
              if (trade?.type === 'trade_closed') toast.info('Position closed', `Result: ${trade.trade.netPnl >= 0 ? '+' : '-'}${formatMoney(Math.abs(trade.trade.netPnl))}`);
            }}
          >
            Close position at market
          </Button>
        </div>
      )}

      <div role="group" aria-label="Direction" className="grid grid-cols-2 gap-2">
        <Button variant={side === 'buy' ? 'buy' : 'secondary'} aria-pressed={side === 'buy'} onClick={() => setSide('buy')}>
          Buy / Long
        </Button>
        <Button variant={side === 'sell' ? 'sell' : 'secondary'} aria-pressed={side === 'sell'} onClick={() => setSide('sell')}>
          Sell / Short
        </Button>
      </div>

      <Tabs<OrderKind>
        variant="pill"
        label="Order type"
        idBase="ticket-type"
        className="rounded-control border border-border p-0.5"
        value={kind}
        onChange={setKind}
        items={[
          { id: 'market', label: 'Market' },
          { id: 'limit', label: 'Limit' },
          { id: 'stop', label: 'Stop' },
        ]}
      />
      <p className="-mt-1 text-xs text-muted">
        {kind === 'market' && 'Fills now at the current price, plus a little slippage.'}
        {kind === 'limit' && (side === 'buy' ? 'Waits to buy at your price or lower.' : 'Waits to sell at your price or higher.')}
        {kind === 'stop' && (side === 'buy' ? 'Buys if price rises to your trigger.' : 'Sells if price falls to your trigger.')}
      </p>

      {kind !== 'market' && (
        <Input
          label={kind === 'limit' ? 'Limit price' : 'Trigger price'}
          numeric
          suffix={instrument.quote}
          value={priceText}
          placeholder={fmtPrice(market).replace(/,/g, '')}
          onChange={(e) => setPriceText(e.target.value)}
          error={show('price')}
        />
      )}

      <Tabs<SizeMode>
        variant="pill"
        label="How to size the trade"
        idBase="ticket-size"
        className="rounded-control border border-border p-0.5"
        value={sizeMode}
        onChange={setSizeMode}
        items={[
          { id: 'quantity', label: 'Set quantity' },
          { id: 'risk', label: 'Size from risk' },
        ]}
      />

      {sizeMode === 'quantity' ? (
        <div>
          <Input
            label="Quantity"
            numeric
            suffix={base}
            value={quantityText}
            onChange={(e) => setQuantityText(e.target.value)}
            error={show('quantity')}
          />
          <div className="mt-1.5 grid grid-cols-4 gap-1" role="group" aria-label="Share of free funds">
            {[0.1, 0.25, 0.5, 1].map((share) => (
              <Button key={share} size="sm" variant="ghost" className="border border-border" onClick={() => setShare(share)}>
                {share * 100}%
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-control border border-border bg-bg p-3">
          <Slider label="Risk on this trade" min={0.25} max={5} step={0.25} value={riskPct} onChange={setRiskPct} format={(v) => `${v}% of account`} />
          <p className="mt-2 text-xs text-muted" aria-live="polite">
            {sized && quantity != null ? (
              <>
                Risking <span className="num text-fg">{formatMoney(sized.riskAmount)}</span> with a stop{' '}
                <span className="num text-fg">{formatPct(sized.stopFraction, 2)}</span> away gives a size of{' '}
                <span className="num font-medium text-fg">
                  {formatQty(quantity, instrument.stepSize)} {base}
                </span>
                .
              </>
            ) : (
              'Enter a stop-loss price below. The size is worked out so that hitting it loses this share of your account.'
            )}
          </p>
          {submitted && errors.quantity && (
            <p role="alert" className="mt-1 text-xs text-down-text">
              {errors.quantity}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Stop-loss"
          numeric
          value={stopText}
          onChange={(e) => setStopText(e.target.value)}
          error={show('stop')}
          hint={direction === 'long' ? 'Below entry' : 'Above entry'}
        />
        <Input
          label="Take-profit"
          numeric
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          error={show('target')}
          hint={direction === 'long' ? 'Above entry' : 'Below entry'}
        />
      </div>

      <dl className="rounded-control border border-border px-3 py-1.5">
        <Row label="Estimated entry">{entry != null ? fmtPrice(entry) : '–'}</Row>
        <Row label="Position value">{value != null ? formatMoney(value) : '–'}</Row>
        <Row label={`Fee (${formatPct(feeRate, 2)})`}>{fee != null ? formatMoney(fee) : '–'}</Row>
        <Row label="Risk if stopped out" strong>
          {riskAmount != null ? `${formatMoney(riskAmount)} (${formatPct(riskShare ?? 0, 2)})` : stopLoss != null ? '–' : 'No stop-loss'}
        </Row>
        <Row label="Reward to risk">{ratio != null ? `${ratio.toFixed(2)} : 1` : '–'}</Row>
        <Row label="Free funds">{formatMoney(snapshot.freeMargin)}</Row>
      </dl>

      {warnings.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2 rounded-control border border-warning/40 bg-warning/10 px-2.5 py-1.5 text-xs text-fg">
              <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0 text-warning-text" />
              {warning}
            </li>
          ))}
        </ul>
      )}

      <Button type="submit" size="lg" variant={side === 'buy' ? 'buy' : 'sell'} block>
        {actionLabel}
      </Button>
      <p className="text-center text-[11px] text-muted">Simulated money. No real order is sent anywhere.</p>

      <ConfirmDialog open={confirming} onClose={() => setConfirming(false)} onConfirm={send} title="Place this trade anyway?" confirmLabel={actionLabel}>
        <ul className="list-disc space-y-1.5 pl-4">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">You can go back and add a stop-loss or reduce the size.</p>
      </ConfirmDialog>
    </form>
  );
}

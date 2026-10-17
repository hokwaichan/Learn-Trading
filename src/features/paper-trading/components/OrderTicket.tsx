import { useMemo, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, cn, ConfirmDialog, EmptyState, Input, Pnl, Slider, Tabs, toast, Trans } from '@/components/ui';
import { t } from '@/i18n';
import { displaySymbol } from '@/lib/data';
import { floorToStep, formatMoney, formatPct, formatPrice, formatQty, roundToTick } from '@/lib/format';
import { feeFor, findPosition, liquidationPriceOf, marginOf, referencePrice, unrealizedPnl, validateStops, withSlippage, type OrderRequest, type Prices } from '@/lib/trading/engine';
import { DEFAULT_MAINTENANCE_MARGIN_RATE, MAX_LEVERAGE } from '@/lib/trading/futures';
import { positionSize, riskReward } from '@/lib/trading/sizing';
import { useAccount, useAccountSnapshot, useLastPrice, useMarket, useSettings } from '@/stores';
import type { AccountId, Instrument, MarginMode, Position, Side } from '@/types';
import { FuturesPositionCard } from './FuturesPositionCard';

export interface OrderTicketProps {
  instrument: Instrument;
  accountId?: AccountId;
  /** Overrides the live price, for Replay. */
  price?: number;
  /** Overrides live prices when valuing the account, for Replay. */
  prices?: Prices;
  /** The time to stamp on orders, for Replay. Defaults to now. */
  now?: number;
}

type OrderKind = 'market' | 'limit' | 'stop';
type SizeMode = 'quantity' | 'risk';

/** Above this share of the account at risk on one trade, the ticket asks for confirmation. */
export const RISK_WARNING = 0.02;
/** Above this leverage the ticket warns and asks for confirmation. */
export const LEVERAGE_WARNING = 5;

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
export function OrderTicket({ instrument, accountId = 'main', price: priceOverride, prices, now }: OrderTicketProps) {
  const account = useAccount((s) => s.accounts[accountId]);
  const place = useAccount((s) => s.place);
  const close = useAccount((s) => s.close);
  const snapshot = useAccountSnapshot(accountId, prices);
  const live = useLastPrice(instrument);
  const feeRate = useSettings((s) => s.feeRate);
  const slippagePct = useSettings((s) => s.slippagePct);
  const market = priceOverride ?? live;
  const livePrices = useMarket((s) => s.lastPrices);
  const allPrices = prices ?? livePrices;
  const isFutures = instrument.kind === 'perpetual';

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
  // Start from the open position's settings, so adding to it does not silently change them.
  const [leverageChoice, setLeverage] = useState(position?.futures?.leverage ?? 3);
  const [marginChoice, setMarginMode] = useState<MarginMode>(position?.futures?.marginMode ?? 'isolated');
  const leverage = isFutures ? leverageChoice : 1;
  const marginMode = marginChoice;
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
  const margin = value != null ? value / leverage : undefined;
  const riskAmount = entry != null && quantity != null && stopLoss != null ? Math.abs(entry - stopLoss) * quantity : undefined;

  // Where this order would be liquidated, estimated as if it filled at the entry price.
  const direction0 = side === 'buy' ? 'long' : 'short';
  const liquidation = useMemo(() => {
    if (!isFutures || entry == null || quantity == null) return undefined;
    const adding = position != null && position.direction === direction0;
    const total = quantity + (adding ? position.quantity : 0);
    const average = adding ? (position.entryPrice * position.quantity + entry * quantity) / total : entry;
    const planned = {
      id: 'planned',
      symbol: instrument.symbol,
      kind: instrument.kind,
      direction: direction0,
      quantity: total,
      entryPrice: average,
      futures: { leverage, marginMode, margin: (average * total) / leverage, maintenanceMargin: 0, liquidationPrice: 0, fundingPaid: 0, lastFundingAt: 0 },
    } as Position;
    if (marginMode === 'isolated') {
      const distance = 1 / leverage - DEFAULT_MAINTENANCE_MARGIN_RATE;
      return direction0 === 'long' ? Math.max(0, average * (1 - distance)) : average * (1 + distance);
    }
    const others = account.positions.filter((p) => !(p.symbol === instrument.symbol && p.kind === instrument.kind));
    return liquidationPriceOf({ ...account, positions: [...others, planned] }, planned, allPrices) ?? undefined;
  }, [isFutures, entry, quantity, position, direction0, instrument, leverage, marginMode, account, allPrices]);
  const liquidationMove = liquidation != null && liquidation > 0 && entry != null ? Math.abs(entry - liquidation) / entry : undefined;
  const riskShare = riskAmount != null && snapshot.equity > 0 ? riskAmount / snapshot.equity : undefined;
  const ratio = entry != null && stopLoss != null && takeProfit != null ? riskReward(entry, stopLoss, takeProfit) : null;

  // Does this order add exposure, or only reduce an existing position?
  const reducing = position != null && position.direction !== direction;
  const opens = !reducing || (quantity ?? 0) > position.quantity;

  const errors: Record<string, string | undefined> = {};
  if (kind !== 'market' && trigger == null) errors.price = kind === 'limit' ? t('Enter the limit price.') : t('Enter the stop price.');
  if (kind === 'stop' && trigger != null && market != null && (side === 'buy' ? trigger <= market : trigger >= market)) {
    errors.price = side === 'buy' ? t('A buy stop must be above the current price.') : t('A sell stop must be below the current price.');
  }
  if (sizeMode === 'quantity' && quantity == null) errors.quantity = t('Enter a quantity.');
  if (sizeMode === 'risk' && stopLoss == null) errors.stop = t('The calculator needs a stop-loss price.');
  if (quantity != null && quantity < instrument.minQty) {
    errors.quantity = t('The smallest order is {qty} {asset}.', { qty: formatQty(instrument.minQty, instrument.stepSize), asset: base });
  }
  if (reference != null && opens) {
    // Checked one at a time so each message lands under its own field.
    errors.stop ??= validateStops(direction, reference, stopLoss) ?? undefined;
    errors.target = validateStops(direction, reference, undefined, takeProfit) ?? undefined;
  }
  const needed = opens && value != null ? (reducing ? (value / quantity!) * (quantity! - position!.quantity) : value) / leverage + (fee ?? 0) : 0;
  const freeAfterClose = snapshot.freeMargin + (reducing && market != null ? marginOf(position!, market) : 0);
  if (!errors.quantity && needed > freeAfterClose * (1 + 1e-9)) {
    errors.quantity = t('Not enough free funds. This needs {needed} and {free} is available.', {
      needed: formatMoney(needed),
      free: formatMoney(Math.max(0, freeAfterClose)),
    });
  }
  const hasErrors = Object.values(errors).some(Boolean);

  const warnings: string[] = [];
  if (opens && stopLoss == null) {
    warnings.push(
      isFutures && leverage > 1 ? t('No stop-loss. The only thing limiting the loss on this trade is liquidation.') : t('No stop-loss. Nothing limits the loss on this trade.'),
    );
  }
  if (opens && isFutures && leverage > LEVERAGE_WARNING) {
    warnings.push(
      liquidationMove == null
        ? t('{n}x leverage. Small moves against you become large losses.', { n: leverage })
        : marginMode === 'isolated' && margin != null
          ? t('{n}x leverage. A move of only {move} against you liquidates this position and loses its {margin} margin.', {
              n: leverage,
              move: formatPct(liquidationMove, 1),
              margin: formatMoney(margin),
            })
          : t('{n}x leverage. A move of only {move} against you liquidates this position.', { n: leverage, move: formatPct(liquidationMove, 1) }),
    );
  }
  if (opens && isFutures && stopLoss != null && liquidation != null && liquidation > 0 && (direction === 'long' ? stopLoss <= liquidation : stopLoss >= liquidation)) {
    warnings.push(t('Your stop-loss is beyond the liquidation price, so the position would be liquidated before the stop is reached.'));
  }
  if (opens && riskShare != null && riskShare > RISK_WARNING) {
    warnings.push(t('This risks {share} of your account ({amount}), above the 2% guideline.', { share: formatPct(riskShare, 1), amount: formatMoney(riskAmount!) }));
  }

  if (!instrument.live && priceOverride == null) {
    return (
      <EmptyState
        icon={<Info />}
        title={t('{symbol} has no live price', { symbol: displaySymbol(instrument) })}
        description={t('It comes from bundled daily history, so there is nothing to trade against right now.')}
        action={
          <Link to="/replay" className="text-sm text-accent-text underline underline-offset-4">
            {t('Practise it in Replay')}
          </Link>
        }
      />
    );
  }
  if (market == null) return <EmptyState title={t('Waiting for a price')} description={t('The order ticket appears as soon as a price arrives.')} />;

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
      leverage: isFutures ? leverage : undefined,
      marginMode: isFutures ? marginMode : undefined,
    };
    const events = place(accountId, order, market, prices, now);
    const rejected = events.find((e) => e.type === 'order_rejected');
    const filled = events.find((e) => e.type === 'order_filled');
    const closed = events.find((e) => e.type === 'trade_closed');
    const amount = { qty: formatQty(quantity, instrument.stepSize), asset: base };
    if (rejected?.type === 'order_rejected') toast.error(t('Order rejected'), rejected.reason);
    else if (filled?.type === 'order_filled') {
      toast.success(
        side === 'buy' ? t('Bought {qty} {asset}', amount) : t('Sold {qty} {asset}', amount),
        closed?.type === 'trade_closed'
          ? t('Filled at {price}. Position closed.', { price: fmtPrice(filled.price) })
          : t('Filled at {price}', { price: fmtPrice(filled.price) }),
      );
    } else if (events.some((e) => e.type === 'order_placed')) {
      toast.info(
        kind === 'limit' ? t('Limit order placed') : t('Stop order placed'),
        t('Waiting for {symbol} to reach {price}.', { symbol: displaySymbol(instrument), price: fmtPrice(trigger!) }),
      );
    }
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
    const budget = (Math.max(0, snapshot.freeMargin) * share) / (1 + feeRate * leverage);
    setQuantityText(formatQty(floorToStep((budget * leverage) / entry, instrument.stepSize), instrument.stepSize).replace(/,/g, ''));
  };
  const actionLabel = `${side === 'buy' ? (reducing ? t('Buy') : t('Buy / Long')) : reducing ? t('Sell') : t('Sell / Short')}${
    quantity != null ? ` ${formatQty(quantity, instrument.stepSize)} ${base}` : ''
  }`;

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
        <span className="text-xs text-muted">{t('{symbol} price', { symbol: displaySymbol(instrument) })}</span>
        <span className="num text-base font-medium text-fg">{fmtPrice(market)}</span>
      </div>

      {position && (
        <div className="rounded-control border border-border bg-bg px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-fg">
              <Trans
                text="Open: {side} {qty} at {price}"
                values={{
                  side: <span className={position.direction === 'long' ? 'text-up-text' : 'text-down-text'}>{position.direction === 'long' ? t('Long') : t('Short')}</span>,
                  qty: <span className="num">{formatQty(position.quantity, instrument.stepSize)}</span>,
                  price: <span className="num">{fmtPrice(position.entryPrice)}</span>,
                }}
              />
            </span>
            <Pnl value={unrealizedPnl(position, market)} className="text-xs" />
          </div>
          <Button
            size="sm"
            block
            className="mt-2"
            onClick={() => {
              const events = close(accountId, position.id, market, prices, now);
              const trade = events.find((e) => e.type === 'trade_closed');
              if (trade?.type === 'trade_closed') {
                toast.info(t('Position closed'), t('Result: {pnl}', { pnl: `${trade.trade.netPnl >= 0 ? '+' : '-'}${formatMoney(Math.abs(trade.trade.netPnl))}` }));
              }
            }}
          >
            {t('Close position at market')}
          </Button>
          <FuturesPositionCard account={account} position={position} instrument={instrument} mark={market} prices={allPrices} />
        </div>
      )}

      <div role="group" aria-label={t('Direction')} className="grid grid-cols-2 gap-2">
        <Button variant={side === 'buy' ? 'buy' : 'secondary'} aria-pressed={side === 'buy'} onClick={() => setSide('buy')}>
          {t('Buy / Long')}
        </Button>
        <Button variant={side === 'sell' ? 'sell' : 'secondary'} aria-pressed={side === 'sell'} onClick={() => setSide('sell')}>
          {t('Sell / Short')}
        </Button>
      </div>

      {isFutures && (
        <div className="rounded-control border border-border bg-bg p-3">
          <Slider label={t('Leverage')} min={1} max={MAX_LEVERAGE} step={1} value={leverageChoice} onChange={setLeverage} format={(v) => `${v}x`} />
          <p className="mt-1.5 text-xs text-muted">
            {leverage === 1
              ? t('No leverage: the position is worth what you put in.')
              : t('Every $1 of your money controls ${n} of {asset}. Gains and losses are {n} times larger.', { n: leverage, asset: base })}
          </p>
          <Tabs<MarginMode>
            variant="pill"
            label={t('Margin mode')}
            idBase="ticket-margin"
            choice
            className="mt-2 rounded-control border border-border p-0.5"
            value={marginChoice}
            onChange={setMarginMode}
            items={[
              { id: 'isolated', label: t('Isolated') },
              { id: 'cross', label: t('Cross') },
            ]}
          />
          <p className="mt-1.5 text-xs text-muted">
            {marginMode === 'isolated'
              ? t('Isolated: this trade can lose only the margin put into it. It is liquidated sooner, but the rest of the account is safe.')
              : t('Cross: the whole account backs this trade. It is liquidated later, but a liquidation can empty the account.')}
          </p>
          {position && position.direction === direction && position.futures && (position.futures.leverage !== leverage || position.futures.marginMode !== marginMode) && (
            <p className="mt-1.5 text-xs text-warning-text">{t('Adding to the open position applies these settings to all of it.')}</p>
          )}
        </div>
      )}

      <Tabs<OrderKind>
        variant="pill"
        label={t('Order type')}
        idBase="ticket-type"
            choice
        className="rounded-control border border-border p-0.5"
        value={kind}
        onChange={setKind}
        items={[
          { id: 'market', label: t('Market') },
          { id: 'limit', label: t('Limit') },
          { id: 'stop', label: t('order::Stop') },
        ]}
      />
      <p className="-mt-1 text-xs text-muted">
        {kind === 'market' && t('Fills now at the current price, plus a little slippage.')}
        {kind === 'limit' && (side === 'buy' ? t('Waits to buy at your price or lower.') : t('Waits to sell at your price or higher.'))}
        {kind === 'stop' && (side === 'buy' ? t('Buys if price rises to your trigger.') : t('Sells if price falls to your trigger.'))}
      </p>

      {kind !== 'market' && (
        <Input
          label={kind === 'limit' ? t('Limit price') : t('Trigger price')}
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
        label={t('How to size the trade')}
        idBase="ticket-size"
            choice
        className="rounded-control border border-border p-0.5"
        value={sizeMode}
        onChange={setSizeMode}
        items={[
          { id: 'quantity', label: t('Set quantity') },
          { id: 'risk', label: t('Size from risk') },
        ]}
      />

      {sizeMode === 'quantity' ? (
        <div>
          <Input
            label={t('Quantity')}
            numeric
            suffix={base}
            value={quantityText}
            onChange={(e) => setQuantityText(e.target.value)}
            error={show('quantity')}
          />
          <div className="mt-1.5 grid grid-cols-4 gap-1" role="group" aria-label={t('Share of free funds')}>
            {[0.1, 0.25, 0.5, 1].map((share) => (
              <Button key={share} size="sm" variant="ghost" className="border border-border" onClick={() => setShare(share)}>
                {share * 100}%
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-control border border-border bg-bg p-3">
          <Slider label={t('Risk on this trade')} min={0.25} max={5} step={0.25} value={riskPct} onChange={setRiskPct} format={(v) => t('{pct}% of account', { pct: v })} />
          <p className="mt-2 text-xs text-muted" aria-live="polite">
            {sized && quantity != null ? (
              <Trans
                text="Risking {amount} with a stop {distance} away gives a size of {size}."
                values={{
                  amount: <span className="num text-fg">{formatMoney(sized.riskAmount)}</span>,
                  distance: <span className="num text-fg">{formatPct(sized.stopFraction, 2)}</span>,
                  size: (
                    <span className="num font-medium text-fg">
                      {formatQty(quantity, instrument.stepSize)} {base}
                    </span>
                  ),
                }}
              />
            ) : (
              t('Enter a stop-loss price below. The size is worked out so that hitting it loses this share of your account.')
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
          label={t('Stop-loss')}
          numeric
          value={stopText}
          onChange={(e) => setStopText(e.target.value)}
          error={show('stop')}
          hint={direction === 'long' ? t('Below entry') : t('Above entry')}
        />
        <Input
          label={t('Take-profit')}
          numeric
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          error={show('target')}
          hint={direction === 'long' ? t('Above entry') : t('Below entry')}
        />
      </div>

      <dl className="rounded-control border border-border px-3 py-1.5">
        <Row label={t('Estimated entry')}>{entry != null ? fmtPrice(entry) : '–'}</Row>
        <Row label={t('Position value')}>{value != null ? formatMoney(value) : '–'}</Row>
        {isFutures && <Row label={t('Margin needed ({n}x)', { n: leverage })}>{margin != null ? formatMoney(margin) : '–'}</Row>}
        {isFutures && (
          <Row label={t('Liquidation price (est.)')}>
            {!opens || liquidation == null
              ? '–'
              : liquidation > 0
                ? t('{price} ({move} away)', { price: fmtPrice(liquidation), move: formatPct(liquidationMove ?? 0, 1) })
                : t('None')}
          </Row>
        )}
        <Row label={t('Fee ({rate})', { rate: formatPct(feeRate, 2) })}>{fee != null ? formatMoney(fee) : '–'}</Row>
        <Row label={t('Risk if stopped out')} strong>
          {riskAmount != null ? `${formatMoney(riskAmount)} (${formatPct(riskShare ?? 0, 2)})` : stopLoss != null ? '–' : t('No stop-loss')}
        </Row>
        <Row label={t('Reward to risk')}>{ratio != null ? `${ratio.toFixed(2)} : 1` : '–'}</Row>
        {isFutures && <Row label={t('Margin in use')}>{formatMoney(snapshot.marginUsed)}</Row>}
        <Row label={isFutures ? t('Free margin') : t('Free funds')}>{formatMoney(snapshot.freeMargin)}</Row>
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
      <p className="text-center text-[11px] text-muted">{t('Simulated money. No real order is sent anywhere.')}</p>

      <ConfirmDialog open={confirming} onClose={() => setConfirming(false)} onConfirm={send} title={t('Place this trade anyway?')} confirmLabel={actionLabel}>
        <ul className="list-disc space-y-1.5 pl-4">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">{t('You can go back and add a stop-loss or reduce the size.')}</p>
      </ConfirmDialog>
    </form>
  );
}

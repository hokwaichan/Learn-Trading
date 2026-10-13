import type { Account, Direction, ExitReason, FuturesPositionState, InstrumentKind, LedgerEntry, MarginMode, Order, Position, Side, Trade } from '@/types';
import { DEFAULT_MAINTENANCE_MARGIN_RATE, fundingPayment, fundingPeriods, liquidationPrice, MAX_LEVERAGE } from './futures';

/**
 * The paper-trading engine: order validation, fills, fees, slippage and
 * position accounting. Pure functions: each takes an account and returns a
 * new one plus a list of events, so the same code serves live trading,
 * replay and tests.
 *
 * Accounting model
 * ----------------
 * `cash` is the realised balance. Opening a position does not move cash
 * (apart from the fee); profit or loss moves into cash when the position is
 * reduced or closed.
 *
 *   equity      = cash + unrealised P&L of open positions
 *   margin used = sum of position value / leverage   (leverage is 1 for spot)
 *   free margin = equity - margin used
 *
 * There is one position per instrument. An order in the opposite direction
 * reduces it, closes it, or closes it and opens the other way with whatever
 * is left over.
 *
 * Futures
 * -------
 * A perpetual position carries leverage and a margin mode.
 *
 * - Isolated: the position can lose at most its own margin (entry value /
 *   leverage). Its liquidation price depends only on its entry and leverage.
 * - Cross: the whole account backs the position. It is liquidated when
 *   account equity falls to the maintenance margin of the open futures
 *   positions, so its liquidation price moves with the rest of the account.
 *
 * A liquidation closes the position at the liquidation price and takes
 * what is left of its maintenance margin as a fee. Funding is charged by
 * applyFunding() for every funding time that has passed.
 */

export interface EngineContext {
  /** Milliseconds since the epoch. */
  now: number;
  /** Fee as a fraction of the value of each fill. */
  feeRate: number;
  /** How much worse than the quoted price market and stop orders fill, as a fraction. */
  slippagePct: number;
  /** Share of a futures position's value that must remain as margin. Defaults to 0.5%. */
  maintenanceMarginRate?: number;
  newId: () => string;
}

/** A price update. For a live tick, open, high, low and close are all the last price. */
export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const tick = (price: number, time: number): Bar => ({ time, open: price, high: price, low: price, close: price });

export interface OrderRequest {
  symbol: string;
  kind: InstrumentKind;
  side: Side;
  type: 'market' | 'limit' | 'stop';
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  reduceOnly?: boolean;
  /** 1 for spot. */
  leverage?: number;
  marginMode?: MarginMode;
}

export type EngineEvent =
  | { type: 'order_placed'; order: Order }
  | { type: 'order_filled'; order: Order; price: number; fee: number }
  | { type: 'order_rejected'; order: Order; reason: string }
  | { type: 'order_cancelled'; order: Order }
  | { type: 'position_opened'; position: Position }
  | { type: 'trade_closed'; trade: Trade; position: Position }
  /** Positive amount: the position paid. Negative: it received. */
  | { type: 'funding'; position: Position; amount: number };

export interface EngineResult {
  account: Account;
  events: EngineEvent[];
}

/** Latest price per instrument, keyed by priceKey(). */
export type Prices = Record<string, number>;

export const priceKey = (kind: InstrumentKind, symbol: string) => `${kind}:${symbol}`;

const sign = (direction: Direction) => (direction === 'long' ? 1 : -1);
const directionOf = (side: Side): Direction => (side === 'buy' ? 'long' : 'short');
const closingSide = (direction: Direction): Side => (direction === 'long' ? 'sell' : 'buy');

/** A buy fills higher and a sell fills lower than the quoted price. */
export function withSlippage(price: number, side: Side, slippagePct: number): number {
  return side === 'buy' ? price * (1 + slippagePct) : price * (1 - slippagePct);
}

export function feeFor(price: number, quantity: number, feeRate: number): number {
  return Math.abs(price * quantity) * feeRate;
}

export function unrealizedPnl(position: Position, price: number): number {
  return (price - position.entryPrice) * position.quantity * sign(position.direction);
}

/** Money tied up by a position: its full value for spot, its margin for futures and option strategies. */
export function marginOf(position: Position, price: number): number {
  if (position.option) return position.option.margin;
  return position.futures ? position.futures.margin : price * position.quantity;
}

const mmrOf = (ctx: Pick<EngineContext, 'maintenanceMarginRate'>) => ctx.maintenanceMarginRate ?? DEFAULT_MAINTENANCE_MARGIN_RATE;

function futuresState(direction: Direction, entryPrice: number, quantity: number, leverage: number, marginMode: MarginMode, mmr: number, previous: FuturesPositionState | undefined, now: number): FuturesPositionState {
  const value = entryPrice * quantity;
  return {
    leverage,
    marginMode,
    margin: value / leverage,
    maintenanceMargin: value * mmr,
    liquidationPrice: liquidationPrice(direction, entryPrice, leverage, mmr),
    fundingPaid: previous?.fundingPaid ?? 0,
    lastFundingAt: previous?.lastFundingAt ?? now,
  };
}

/**
 * The price at which a futures position would be liquidated right now, or
 * null for a spot position. For an isolated position this is fixed by its
 * entry and leverage. For a cross position it is the price at which account
 * equity equals the maintenance margin of all futures positions, holding
 * every other price still; zero means it cannot be reached.
 */
export function liquidationPriceOf(account: Account, position: Position, prices: Prices, maintenanceMarginRate = DEFAULT_MAINTENANCE_MARGIN_RATE): number | null {
  if (!position.futures) return null;
  if (position.futures.marginMode === 'isolated') return position.futures.liquidationPrice;
  const s = sign(position.direction);
  let otherPnl = 0;
  let otherMaintenance = 0;
  for (const p of account.positions) {
    if (p.id === position.id) continue;
    const mark = markOf(p, prices);
    otherPnl += unrealizedPnl(p, mark);
    if (p.futures) otherMaintenance += mark * p.quantity * maintenanceMarginRate;
  }
  // cash + otherPnl + (P - entry) * q * s = mmr * P * q + otherMaintenance, solved for P.
  const q = position.quantity;
  const price = (position.entryPrice * q * s - account.cash - otherPnl + otherMaintenance) / (q * (s - maintenanceMarginRate));
  return Number.isFinite(price) && price > 0 ? price : 0;
}

function markOf(position: Position, prices: Prices): number {
  // An option strategy carries its own model value.
  if (position.option) return position.option.markValue;
  return prices[priceKey(position.kind, position.symbol)] ?? position.entryPrice;
}

export function equityOf(account: Account, prices: Prices): number {
  return account.cash + account.positions.reduce((sum, p) => sum + unrealizedPnl(p, markOf(p, prices)), 0);
}

export function marginUsed(account: Account, prices: Prices): number {
  return account.positions.reduce((sum, p) => sum + marginOf(p, markOf(p, prices)), 0);
}

export function findPosition(account: Account, symbol: string, kind: InstrumentKind): Position | undefined {
  return account.positions.find((p) => p.symbol === symbol && p.kind === kind);
}

/**
 * Checks a stop-loss and take-profit against a reference price. For a long
 * the stop must be below and the target above; for a short the reverse.
 * Returns a message when something is wrong.
 */
export function validateStops(direction: Direction, reference: number, stopLoss?: number, takeProfit?: number): string | null {
  const long = direction === 'long';
  if (stopLoss != null) {
    if (!(stopLoss > 0)) return 'The stop-loss must be a price above zero.';
    if (long ? stopLoss >= reference : stopLoss <= reference) {
      return long ? 'For a long, the stop-loss must be below the entry price.' : 'For a short, the stop-loss must be above the entry price.';
    }
  }
  if (takeProfit != null) {
    if (!(takeProfit > 0)) return 'The take-profit must be a price above zero.';
    if (long ? takeProfit <= reference : takeProfit >= reference) {
      return long ? 'For a long, the take-profit must be above the entry price.' : 'For a short, the take-profit must be below the entry price.';
    }
  }
  return null;
}

/** The price an order is expected to fill at, before slippage. */
export function referencePrice(request: Pick<OrderRequest, 'type' | 'limitPrice' | 'stopPrice'>, marketPrice: number): number {
  if (request.type === 'limit') return request.limitPrice ?? marketPrice;
  if (request.type === 'stop') return request.stopPrice ?? marketPrice;
  return marketPrice;
}

/**
 * How much of an order adds exposure, as opposed to reducing a position in
 * the other direction. Only the adding part needs free margin.
 */
function openingQuantity(account: Account, request: Pick<OrderRequest, 'symbol' | 'kind' | 'side' | 'quantity'>): number {
  const position = findPosition(account, request.symbol, request.kind);
  if (!position || position.direction === directionOf(request.side)) return request.quantity;
  return Math.max(0, request.quantity - position.quantity);
}

function affordable(account: Account, request: OrderRequest, price: number, prices: Prices, ctx: EngineContext): string | null {
  const opening = openingQuantity(account, request);
  if (opening <= 0) return null;
  const leverage = request.kind === 'perpetual' ? (request.leverage ?? 1) : 1;
  const needed = (opening * price) / leverage + feeFor(price, request.quantity, ctx.feeRate);
  // Margin freed by the part of the order that closes an existing position.
  const position = findPosition(account, request.symbol, request.kind);
  const freed = position && position.direction !== directionOf(request.side) ? marginOf(position, markOf(position, prices)) : 0;
  const free = equityOf(account, prices) - marginUsed(account, prices) + freed;
  // A hair of tolerance so "use everything" sizes are not rejected by rounding.
  return needed > free * (1 + 1e-9) ? 'Not enough free funds for this order.' : null;
}

function ledger(account: Account, entry: Omit<LedgerEntry, 'id'>, ctx: EngineContext): Account {
  return { ...account, ledger: [...account.ledger, { ...entry, id: ctx.newId() }] };
}

function recordEquity(account: Account, prices: Prices, ctx: EngineContext): Account {
  return { ...account, equityHistory: [...account.equityHistory, { time: ctx.now, equity: equityOf(account, prices) }] };
}

interface FillOptions {
  exitReason?: ExitReason;
  /** Charged on top of the normal fee and recorded as a liquidation fee. */
  liquidationFee?: number;
}

function exitReasonOf(order: Order): ExitReason {
  if (order.positionId && order.type === 'stop') return 'stop_loss';
  if (order.positionId && order.type === 'take_profit') return 'take_profit';
  return 'manual';
}

/**
 * Applies one fill to the account: opens, adds to, reduces, closes or flips
 * the position for that instrument, charges the fee, and records the result.
 */
function applyFill(account: Account, order: Order, price: number, prices: Prices, ctx: EngineContext, events: EngineEvent[], options: FillOptions = {}): Account {
  const tradingFee = feeFor(price, order.quantity, ctx.feeRate);
  const liquidationFee = options.liquidationFee ?? 0;
  const fee = tradingFee + liquidationFee;
  const filled: Order = { ...order, status: 'filled', filledAt: ctx.now, avgFillPrice: price, fee };
  let next: Account = { ...account, cash: account.cash - fee };
  next = ledger(next, { time: ctx.now, type: 'fee', amount: -tradingFee, refId: order.id }, ctx);
  if (liquidationFee > 0) next = ledger(next, { time: ctx.now, type: 'liquidation', amount: -liquidationFee, refId: order.positionId, note: 'Remaining margin taken on liquidation' }, ctx);
  const leverage = order.kind === 'perpetual' ? (order.leverage ?? 1) : 1;
  const marginMode: MarginMode = order.marginMode ?? 'isolated';
  const mmr = mmrOf(ctx);
  events.push({ type: 'order_filled', order: filled, price, fee });

  const direction = directionOf(order.side);
  const existing = findPosition(next, order.symbol, order.kind);
  const others = next.positions.filter((p) => p !== existing);

  const open = (quantity: number, feeShare: number): Position => {
    const position: Position = {
      id: ctx.newId(),
      accountId: next.id,
      symbol: order.symbol,
      kind: order.kind,
      direction,
      quantity,
      entryPrice: price,
      openedAt: ctx.now,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      initialRisk: order.stopLoss != null ? Math.abs(price - order.stopLoss) * quantity : undefined,
      realizedPnl: 0,
      feesPaid: feeShare,
      peakQuantity: quantity,
      closedQuantity: 0,
      exitNotional: 0,
      futures: order.kind === 'perpetual' ? futuresState(direction, price, quantity, leverage, marginMode, mmr, undefined, ctx.now) : undefined,
    };
    events.push({ type: 'position_opened', position });
    return position;
  };

  if (!existing) {
    next = { ...next, positions: [...others, open(order.quantity, fee)] };
  } else if (existing.direction === direction) {
    const quantity = existing.quantity + order.quantity;
    const entryPrice = (existing.entryPrice * existing.quantity + price * order.quantity) / quantity;
    const stopLoss = order.stopLoss ?? existing.stopLoss;
    const added: Position = {
      ...existing,
      quantity,
      entryPrice,
      stopLoss,
      takeProfit: order.takeProfit ?? existing.takeProfit,
      initialRisk: stopLoss != null ? Math.abs(entryPrice - stopLoss) * quantity : existing.initialRisk,
      feesPaid: existing.feesPaid + fee,
      peakQuantity: Math.max(existing.peakQuantity, quantity),
      // Adding to a futures position applies the order's leverage and margin mode to all of it.
      futures: existing.futures ? futuresState(direction, entryPrice, quantity, order.leverage ?? existing.futures.leverage, order.marginMode ?? existing.futures.marginMode, mmr, existing.futures, ctx.now) : undefined,
    };
    next = { ...next, positions: [...others, added] };
  } else {
    const closing = Math.min(order.quantity, existing.quantity);
    const closingFee = fee * (closing / order.quantity);
    const pnl = (price - existing.entryPrice) * closing * sign(existing.direction);
    next = { ...next, cash: next.cash + pnl };
    next = ledger(next, { time: ctx.now, type: 'realized_pnl', amount: pnl, refId: existing.id }, ctx);

    const reduced: Position = {
      ...existing,
      quantity: existing.quantity - closing,
      realizedPnl: existing.realizedPnl + pnl,
      feesPaid: existing.feesPaid + closingFee,
      closedQuantity: existing.closedQuantity + closing,
      exitNotional: existing.exitNotional + price * closing,
      futures: existing.futures
        ? futuresState(existing.direction, existing.entryPrice, existing.quantity - closing, existing.futures.leverage, existing.futures.marginMode, mmr, existing.futures, ctx.now)
        : undefined,
    };

    if (reduced.quantity > 1e-12) {
      next = { ...next, positions: [...others, reduced] };
    } else {
      const fees = reduced.feesPaid;
      const funding = existing.futures?.fundingPaid ?? 0;
      const netPnl = reduced.realizedPnl - fees - funding;
      const cost = (existing.entryPrice * reduced.peakQuantity) / (existing.futures?.leverage ?? 1);
      const trade: Trade = {
        id: ctx.newId(),
        accountId: next.id,
        positionId: existing.id,
        symbol: existing.symbol,
        kind: existing.kind,
        direction: existing.direction,
        quantity: reduced.peakQuantity,
        entryPrice: existing.entryPrice,
        exitPrice: reduced.exitNotional / reduced.closedQuantity,
        openedAt: existing.openedAt,
        closedAt: ctx.now,
        grossPnl: reduced.realizedPnl,
        fees,
        funding,
        netPnl,
        returnPct: cost > 0 ? netPnl / cost : 0,
        initialRisk: existing.initialRisk,
        stopLoss: existing.stopLoss,
        takeProfit: existing.takeProfit,
        rMultiple: existing.initialRisk ? netPnl / existing.initialRisk : undefined,
        leverage: existing.futures?.leverage,
        exitReason: options.exitReason ?? exitReasonOf(order),
      };
      const remainder = order.quantity - closing;
      const positions = remainder > 1e-12 && !order.reduceOnly ? [...others, open(remainder, fee - closingFee)] : others;
      next = { ...next, positions, trades: [...next.trades, trade] };
      events.push({ type: 'trade_closed', trade, position: reduced });
    }
  }

  next = { ...next, orders: [...next.orders.filter((o) => o.id !== order.id), filled] };
  return recordEquity(next, { ...prices, [priceKey(order.kind, order.symbol)]: price }, ctx);
}

function reject(account: Account, order: Order, reason: string, events: EngineEvent[]): Account {
  const rejected: Order = { ...order, status: 'rejected', rejectReason: reason };
  events.push({ type: 'order_rejected', order: rejected, reason });
  return { ...account, orders: [...account.orders.filter((o) => o.id !== order.id), rejected] };
}

/**
 * Places an order. Market orders, and limit orders already at or through the
 * market, fill at once; other limit and stop orders wait for processBar().
 */
export function placeOrder(account: Account, input: OrderRequest, marketPrice: number, prices: Prices, ctx: EngineContext): EngineResult {
  const events: EngineEvent[] = [];
  // Spot is never leveraged.
  const request: OrderRequest = input.kind === 'perpetual' ? { ...input, leverage: input.leverage ?? 1, marginMode: input.marginMode ?? 'isolated' } : { ...input, leverage: undefined, marginMode: undefined };
  const order: Order = {
    id: ctx.newId(),
    accountId: account.id,
    symbol: request.symbol,
    kind: request.kind,
    side: request.side,
    type: request.type,
    quantity: request.quantity,
    limitPrice: request.type === 'limit' ? request.limitPrice : undefined,
    stopPrice: request.type === 'stop' ? request.stopPrice : undefined,
    reduceOnly: request.reduceOnly ?? false,
    leverage: request.leverage,
    marginMode: request.marginMode,
    stopLoss: request.stopLoss,
    takeProfit: request.takeProfit,
    status: 'open',
    createdAt: ctx.now,
  };
  const fail = (reason: string): EngineResult => ({ account: reject(account, order, reason, events), events });

  if (!(marketPrice > 0)) return fail('There is no current price for this symbol.');
  if (!(request.quantity > 0)) return fail('Enter a quantity above zero.');
  if (request.type === 'limit' && !(request.limitPrice! > 0)) return fail('Enter a limit price.');
  if (request.type === 'stop' && !(request.stopPrice! > 0)) return fail('Enter a stop price.');
  if (request.leverage != null && !(request.leverage >= 1 && request.leverage <= MAX_LEVERAGE)) return fail(`Leverage must be between 1x and ${MAX_LEVERAGE}x.`);

  const buy = request.side === 'buy';
  if (request.type === 'stop' && (buy ? request.stopPrice! <= marketPrice : request.stopPrice! >= marketPrice)) {
    return fail(
      buy
        ? 'A buy stop must be above the current price. To buy now, use a market order.'
        : 'A sell stop must be below the current price. To sell now, use a market order.',
    );
  }

  const position = findPosition(account, request.symbol, request.kind);
  if (request.reduceOnly && (!position || position.direction === directionOf(request.side))) {
    return fail('There is no position for this order to reduce.');
  }

  const reference = referencePrice(request, marketPrice);
  // Stops only attach to the part of the order that opens a position.
  if (openingQuantity(account, request) > 0) {
    const problem = validateStops(directionOf(request.side), reference, request.stopLoss, request.takeProfit);
    if (problem) return fail(problem);
  }
  const short = affordable(account, request, reference, prices, ctx);
  if (short) return fail(short);

  const marketable = request.type === 'limit' && (buy ? request.limitPrice! >= marketPrice : request.limitPrice! <= marketPrice);
  if (request.type === 'market') {
    return { account: applyFill(account, order, withSlippage(marketPrice, request.side, ctx.slippagePct), prices, ctx, events), events };
  }
  if (marketable) {
    // A limit order through the market fills at the market price, which is better than the limit.
    return { account: applyFill(account, order, marketPrice, prices, ctx, events), events };
  }
  events.push({ type: 'order_placed', order });
  return { account: { ...account, orders: [...account.orders, order] }, events };
}

export function cancelOrder(account: Account, orderId: string): EngineResult {
  const order = account.orders.find((o) => o.id === orderId && o.status === 'open');
  if (!order) return { account, events: [] };
  const cancelled: Order = { ...order, status: 'cancelled' };
  return {
    account: { ...account, orders: account.orders.map((o) => (o.id === orderId ? cancelled : o)) },
    events: [{ type: 'order_cancelled', order: cancelled }],
  };
}

/** Closes all or part of a position at the market. */
export function closePosition(account: Account, positionId: string, marketPrice: number, prices: Prices, ctx: EngineContext, quantity?: number): EngineResult {
  const position = account.positions.find((p) => p.id === positionId);
  if (!position || !(marketPrice > 0)) return { account, events: [] };
  return placeOrder(
    account,
    {
      symbol: position.symbol,
      kind: position.kind,
      side: closingSide(position.direction),
      type: 'market',
      quantity: Math.min(quantity ?? position.quantity, position.quantity),
      reduceOnly: true,
    },
    marketPrice,
    prices,
    ctx,
  );
}

/**
 * Changes the stop-loss and take-profit on an open position. Pass undefined
 * to remove one. Each must be on the correct side of the current price,
 * otherwise it would trigger at once.
 */
export function setStops(
  account: Account,
  positionId: string,
  stops: { stopLoss?: number; takeProfit?: number },
  marketPrice: number,
): { account: Account; error: string | null } {
  const position = account.positions.find((p) => p.id === positionId);
  if (!position) return { account, error: 'That position is no longer open.' };
  const problem = validateStops(position.direction, marketPrice, stops.stopLoss, stops.takeProfit);
  if (problem) return { account, error: problem.replace('entry price', 'current price') };
  const updated: Position = {
    ...position,
    stopLoss: stops.stopLoss,
    takeProfit: stops.takeProfit,
    // Risk is fixed when the trade is opened; adding a stop later sets it if there was none.
    initialRisk: position.initialRisk ?? (stops.stopLoss != null ? Math.abs(position.entryPrice - stops.stopLoss) * position.quantity : undefined),
  };
  return { account: { ...account, positions: account.positions.map((p) => (p.id === positionId ? updated : p)) }, error: null };
}

/**
 * Moves the market for one instrument: fills waiting limit and stop orders
 * the bar reached, then checks stop-losses and take-profits.
 *
 * Rules, chosen to be conservative rather than flattering:
 * - A limit order fills at its price, or at the open if the bar opened
 *   beyond it (a gap in your favour).
 * - A stop fills at its price plus slippage, or at the open if the bar
 *   gapped past it, which is worse than the stop.
 * - If one bar reaches both the stop-loss and the take-profit, the stop-loss
 *   is assumed to have been hit first.
 * - A futures position is checked for liquidation before its stop-loss. The
 *   stop-loss comes first only when it is nearer than the liquidation price
 *   and the bar did not open beyond the liquidation price.
 * - A position opened during a bar is not checked for exits until the next
 *   bar, because the order of events inside a bar is unknown. (Live ticks
 *   are single prices, so this does not apply to them.)
 */
export function processBar(account: Account, symbol: string, kind: InstrumentKind, bar: Bar, prices: Prices, ctx: EngineContext): EngineResult {
  const events: EngineEvent[] = [];
  const isTick = bar.high === bar.low;
  const here: Prices = { ...prices, [priceKey(kind, symbol)]: bar.close };
  let next = account;
  const before = findPosition(account, symbol, kind)?.id;

  const waiting = account.orders
    .filter((o) => o.status === 'open' && o.symbol === symbol && o.kind === kind)
    .sort((a, b) => a.createdAt - b.createdAt);

  for (const order of waiting) {
    const buy = order.side === 'buy';
    let price: number | null = null;
    if (order.type === 'limit' && order.limitPrice != null) {
      if (buy ? bar.low <= order.limitPrice : bar.high >= order.limitPrice) {
        price = buy ? Math.min(order.limitPrice, bar.open) : Math.max(order.limitPrice, bar.open);
      }
    } else if (order.type === 'stop' && order.stopPrice != null) {
      if (buy ? bar.high >= order.stopPrice : bar.low <= order.stopPrice) {
        const trigger = buy ? Math.max(order.stopPrice, bar.open) : Math.min(order.stopPrice, bar.open);
        price = withSlippage(trigger, order.side, ctx.slippagePct);
      }
    }
    if (price == null) continue;

    const position = findPosition(next, symbol, kind);
    if (order.reduceOnly && (!position || position.direction === directionOf(order.side))) {
      next = reject(next, order, 'There was no position left for this order to reduce.', events);
      continue;
    }
    const short = affordable(next, { ...order, type: order.type as 'limit' | 'stop' }, price, here, ctx);
    if (short) {
      next = reject(next, order, short, events);
      continue;
    }
    next = applyFill(next, order, price, here, ctx, events);
  }

  const position = findPosition(next, symbol, kind);
  if (position && (isTick || position.id === before)) {
    const long = position.direction === 'long';
    const side = closingSide(position.direction);
    const reached = (level: number, price: number) => (long ? price <= level : price >= level);
    const adverse = long ? bar.low : bar.high;
    const liquidation = liquidationPriceOf(next, position, here, mmrOf(ctx));
    const liquidated = liquidation != null && liquidation > 0 && reached(liquidation, adverse);
    const stopBeforeLiquidation =
      position.stopLoss != null && reached(position.stopLoss, adverse) && (long ? position.stopLoss > liquidation! : position.stopLoss < liquidation!) && !reached(liquidation!, bar.open);
    if (liquidated && !stopBeforeLiquidation) {
      const exit: Order = {
        id: ctx.newId(),
        accountId: next.id,
        symbol,
        kind,
        side,
        type: 'market',
        quantity: position.quantity,
        reduceOnly: true,
        positionId: position.id,
        status: 'open',
        createdAt: ctx.now,
      };
      const tradingFee = feeFor(liquidation, position.quantity, ctx.feeRate);
      const loss = -unrealizedPnl(position, liquidation);
      // Isolated: the position loses exactly its margin. Cross: its maintenance margin is forfeited.
      const remaining = position.futures!.marginMode === 'isolated' ? position.futures!.margin - loss : liquidation * position.quantity * mmrOf(ctx);
      next = applyFill(next, exit, liquidation, here, ctx, events, { exitReason: 'liquidation', liquidationFee: Math.max(0, remaining - tradingFee) });
      return { account: next, events };
    }
    const stopHit = position.stopLoss != null && (long ? bar.low <= position.stopLoss : bar.high >= position.stopLoss);
    const targetHit = position.takeProfit != null && (long ? bar.high >= position.takeProfit : bar.low <= position.takeProfit);

    if (stopHit || targetHit) {
      const exit: Order = {
        id: ctx.newId(),
        accountId: next.id,
        symbol,
        kind,
        side,
        type: stopHit ? 'stop' : 'take_profit',
        quantity: position.quantity,
        stopPrice: stopHit ? position.stopLoss : undefined,
        limitPrice: stopHit ? undefined : position.takeProfit,
        reduceOnly: true,
        positionId: position.id,
        status: 'open',
        createdAt: ctx.now,
      };
      const price = stopHit
        ? withSlippage(long ? Math.min(position.stopLoss!, bar.open) : Math.max(position.stopLoss!, bar.open), side, ctx.slippagePct)
        : long
          ? Math.max(position.takeProfit!, bar.open)
          : Math.min(position.takeProfit!, bar.open);
      next = applyFill(next, exit, price, here, ctx, events);
    }
  }

  return { account: next, events };
}

/**
 * Charges funding on every futures position for each funding time that has
 * passed since it was last charged, at the current price. With a positive
 * rate longs pay and shorts receive.
 *
 * If the app was closed over several funding times they are all charged at
 * once, at today's price.
 */
export function applyFunding(account: Account, prices: Prices, ctx: EngineContext, rateFor: (symbol: string) => number): EngineResult {
  const events: EngineEvent[] = [];
  let next = account;
  for (const position of account.positions) {
    if (!position.futures) continue;
    const periods = fundingPeriods(position.futures.lastFundingAt, ctx.now);
    if (periods <= 0) continue;
    const amount = periods * fundingPayment(position.direction, markOf(position, prices) * position.quantity, rateFor(position.symbol));
    const updated: Position = { ...position, futures: { ...position.futures, fundingPaid: position.futures.fundingPaid + amount, lastFundingAt: ctx.now } };
    next = { ...next, cash: next.cash - amount, positions: next.positions.map((p) => (p.id === position.id ? updated : p)) };
    next = ledger(next, { time: ctx.now, type: 'funding', amount: -amount, refId: position.id, note: periods > 1 ? `${periods} funding payments` : undefined }, ctx);
    events.push({ type: 'funding', position: updated, amount });
  }
  if (events.length) next = recordEquity(next, prices, ctx);
  return { account: next, events };
}

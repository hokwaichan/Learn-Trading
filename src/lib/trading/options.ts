import { t } from '@/i18n';
import { bsPrice, DAYS_PER_YEAR } from '@/lib/pricing/blackScholes';
import { simulatedSpread } from '@/lib/pricing/chain';
import { payoffExtremes } from '@/lib/pricing/payoff';
import { entryValue, hasSingleExpiry, marginRequirement, MAX_LEGS, nearestExpiry, strategyValue, toPayoffLegs } from '@/lib/pricing/strategy';
import type { Account, ExitReason, Order, Position, Strategy, Trade } from '@/types';
import { equityOf, marginUsed, type EngineContext, type EngineEvent, type EngineResult, type Prices } from './engine';

/**
 * Paper trading for option strategies.
 *
 * A strategy (one to four option legs, plus an optional stock leg) is held
 * as a single position. Its entry price is what the whole strategy cost
 * (negative if it brought in a credit) and its value is marked to the model
 * price. As with every other position, cash only moves when it is closed.
 *
 * Simplifications, on purpose:
 * - Options are European and cash-settled: nothing is exercised early, and
 *   at expiry each leg is paid or charged its exercise value in cash. A
 *   short leg that finishes in the money is reported as an assignment.
 * - Each leg keeps the volatility it was opened at. Real implied volatility
 *   moves; the what-if sliders show what that would do.
 * - A strategy whose legs expire on different dates is settled whole at the
 *   first expiry, with the later legs sold at their model price.
 */

const DAY_MS = 86_400_000;
const sign = (side: 'buy' | 'sell') => (side === 'buy' ? 1 : -1);

/** Premium and stock value changing hands, used as the base for the fee. */
function turnover(strategy: Strategy, optionPrice: (leg: Strategy['legs'][number]) => number, stockPrice: number): number {
  const options = strategy.legs.reduce((sum, leg) => sum + leg.quantity * leg.contract.multiplier * optionPrice(leg), 0);
  return options + (strategy.stock ? strategy.stock.quantity * stockPrice : 0);
}

export function validateStrategy(strategy: Strategy, now: number): string | null {
  if (strategy.legs.length === 0) return t('Add at least one option leg.');
  if (strategy.legs.length > MAX_LEGS) return t('A strategy can have at most {n} option legs.', { n: MAX_LEGS });
  if (strategy.legs.some((l) => !(l.quantity > 0)) || (strategy.stock && !(strategy.stock.quantity > 0))) return t('Every leg needs a quantity above zero.');
  if (strategy.legs.some((l) => l.contract.expiry <= now)) return t('One of the legs has already expired.');
  if (strategy.legs.some((l) => !(l.entryPrice >= 0))) return t('One of the legs has no price.');
  return null;
}

/** Opens a strategy as one position. `spot` is the underlying price now. */
export function openOptionPosition(account: Account, strategy: Strategy, spot: number, prices: Prices, ctx: EngineContext, rate: number): EngineResult {
  const events: EngineEvent[] = [];
  const cost = entryValue(strategy);
  const order: Order = {
    id: ctx.newId(),
    accountId: account.id,
    symbol: strategy.underlying,
    kind: 'option',
    side: cost >= 0 ? 'buy' : 'sell',
    type: 'market',
    quantity: 1,
    reduceOnly: false,
    strategyId: strategy.id,
    status: 'open',
    createdAt: ctx.now,
  };
  const fail = (reason: string): EngineResult => {
    const rejected: Order = { ...order, status: 'rejected', rejectReason: reason };
    return { account: { ...account, orders: [...account.orders, rejected] }, events: [{ type: 'order_rejected', order: rejected, reason }] };
  };

  const problem = validateStrategy(strategy, ctx.now);
  if (problem) return fail(problem);
  if (!(spot > 0)) return fail(t('There is no current price for this symbol.'));

  const margin = marginRequirement(strategy, spot);
  const fee = turnover(strategy, (leg) => leg.entryPrice, strategy.stock?.entryPrice ?? spot) * ctx.feeRate;
  const free = equityOf(account, prices) - marginUsed(account, prices);
  if (margin + fee > free * (1 + 1e-9)) return fail(t('Not enough free funds for this strategy.'));

  const { maxLoss } = payoffExtremes(toPayoffLegs(strategy));
  const filled: Order = { ...order, status: 'filled', filledAt: ctx.now, avgFillPrice: cost, fee };
  const position: Position = {
    id: ctx.newId(),
    accountId: account.id,
    // Unique per strategy, so several can be open on one underlying.
    symbol: strategy.id,
    kind: 'option',
    direction: 'long',
    quantity: 1,
    entryPrice: cost,
    openedAt: ctx.now,
    initialRisk: maxLoss !== 'unlimited' && hasSingleExpiry(strategy) && maxLoss > 0 ? maxLoss : undefined,
    realizedPnl: 0,
    feesPaid: fee,
    peakQuantity: 1,
    closedQuantity: 0,
    exitNotional: 0,
    option: { strategy, lastMarkedAt: ctx.now, markValue: strategyValue(strategy, spot, ctx.now, rate), margin },
  };
  events.push({ type: 'order_filled', order: filled, price: cost, fee }, { type: 'position_opened', position });
  let next: Account = {
    ...account,
    cash: account.cash - fee,
    orders: [...account.orders, filled],
    positions: [...account.positions, position],
    ledger: [...account.ledger, { id: ctx.newId(), time: ctx.now, type: 'fee', amount: -fee, refId: order.id }],
  };
  next = { ...next, equityHistory: [...next.equityHistory, { time: ctx.now, equity: equityOf(next, prices) }] };
  return { account: next, events };
}

/**
 * Revalues open option positions at the current underlying prices.
 * `spotOf` returns undefined for an underlying with no price yet; those
 * positions are left as they were.
 */
export function markOptionPositions(account: Account, spotOf: (underlying: string) => number | undefined, now: number, rate: number): Account {
  let changed = false;
  const positions = account.positions.map((p) => {
    if (!p.option) return p;
    const spot = spotOf(p.option.strategy.underlying);
    if (spot == null || !(spot > 0)) return p;
    const markValue = strategyValue(p.option.strategy, spot, now, rate);
    if (markValue === p.option.markValue) return p;
    changed = true;
    return { ...p, option: { ...p.option, markValue, lastMarkedAt: now } };
  });
  return changed ? { ...account, positions } : account;
}

function finish(account: Account, position: Position, exitValue: number, fee: number, reason: ExitReason, prices: Prices, ctx: EngineContext, events: EngineEvent[]): Account {
  const option = position.option!;
  const grossPnl = exitValue - position.entryPrice;
  const fees = position.feesPaid + fee;
  const netPnl = grossPnl - fees;
  const base = option.margin > 0 ? option.margin : Math.abs(position.entryPrice);
  const trade: Trade = {
    id: ctx.newId(),
    accountId: account.id,
    positionId: position.id,
    symbol: option.strategy.underlying,
    kind: 'option',
    direction: 'long',
    quantity: 1,
    entryPrice: position.entryPrice,
    exitPrice: exitValue,
    openedAt: position.openedAt,
    closedAt: ctx.now,
    grossPnl,
    fees,
    funding: 0,
    netPnl,
    returnPct: base > 0 ? netPnl / base : 0,
    initialRisk: position.initialRisk,
    rMultiple: position.initialRisk ? netPnl / position.initialRisk : undefined,
    exitReason: reason,
    strategyTemplateId: option.strategy.templateId,
    label: option.strategy.name,
  };
  let next: Account = {
    ...account,
    cash: account.cash + grossPnl - fee,
    positions: account.positions.filter((p) => p.id !== position.id),
    trades: [...account.trades, trade],
    ledger: [
      ...account.ledger,
      { id: ctx.newId(), time: ctx.now, type: 'realized_pnl', amount: grossPnl, refId: position.id },
      ...(fee > 0 ? [{ id: ctx.newId(), time: ctx.now, type: 'fee' as const, amount: -fee, refId: position.id }] : []),
    ],
  };
  next = { ...next, equityHistory: [...next.equityHistory, { time: ctx.now, equity: equityOf(next, prices) }] };
  events.push({ type: 'trade_closed', trade, position });
  return next;
}

/**
 * Closes a strategy before expiry at the model price, giving up half the
 * simulated bid-ask spread on every leg, as selling at the bid and buying
 * back at the ask would.
 */
export function closeOptionPosition(account: Account, positionId: string, spot: number, prices: Prices, ctx: EngineContext, rate: number, tickSize = 0.01): EngineResult {
  const position = account.positions.find((p) => p.id === positionId && p.option);
  if (!position || !(spot > 0)) return { account, events: [] };
  const { strategy } = position.option!;
  const events: EngineEvent[] = [];
  const mid = (leg: Strategy['legs'][number]) =>
    bsPrice({ type: leg.contract.type, spot, strike: leg.contract.strike, years: Math.max(0, leg.contract.expiry - ctx.now) / DAY_MS / DAYS_PER_YEAR, volatility: leg.entryIv, rate });
  const spreadCost = strategy.legs.reduce((sum, leg) => {
    const price = mid(leg);
    // A long leg worth nothing has nothing to give up.
    const half = Math.min(simulatedSpread(price, tickSize) / 2, leg.side === 'buy' ? price : Infinity);
    return sum + leg.quantity * leg.contract.multiplier * half;
  }, 0);
  const exitValue = strategyValue(strategy, spot, ctx.now, rate) - spreadCost;
  const fee = turnover(strategy, mid, spot) * ctx.feeRate;
  return { account: finish(account, position, exitValue, fee, 'manual', prices, ctx, events), events };
}

/**
 * Settles every strategy whose first expiry has passed. `spotAtExpiry`
 * gives the underlying price at that moment; positions with no price
 * available are left for a later call.
 */
export function settleExpiredOptions(account: Account, spotAtExpiry: (underlying: string, expiry: number) => number | undefined, prices: Prices, ctx: EngineContext, rate: number): EngineResult {
  const events: EngineEvent[] = [];
  let next = account;
  for (const position of account.positions) {
    if (!position.option) continue;
    const { strategy } = position.option;
    const expiry = nearestExpiry(strategy);
    if (expiry == null || expiry > ctx.now) continue;
    const spot = spotAtExpiry(strategy.underlying, expiry);
    if (spot == null || !(spot > 0)) continue;
    const exitValue = strategyValue(strategy, spot, expiry, rate);
    const assigned = strategy.legs.some((leg) => leg.side === 'sell' && leg.contract.expiry <= expiry && (leg.contract.type === 'call' ? spot > leg.contract.strike : spot < leg.contract.strike));
    next = finish(next, position, exitValue, 0, assigned ? 'assignment' : 'expiry', prices, { ...ctx, now: Math.max(expiry, position.openedAt) }, events);
  }
  return { account: next, events };
}

/** Whether a short leg of the strategy sits in the money at a price: the legs that would be assigned. */
export function shortLegsInTheMoney(strategy: Strategy, spot: number): number {
  return strategy.legs.filter((leg) => leg.side === 'sell' && sign(leg.side) < 0 && (leg.contract.type === 'call' ? spot > leg.contract.strike : spot < leg.contract.strike)).length;
}

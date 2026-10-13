import { feeFor, withSlippage } from '@/lib/trading/engine';
import { DEFAULT_FUNDING_RATE, fundingPayment, fundingPeriods, liquidationPrice } from '@/lib/trading/futures';
import type { BacktestConfig, BacktestResult, BacktestStrategy, BacktestTrade, Candle, EquityPoint } from '@/types';
import { createResolver, resolveRule, ruleTrueAt } from './rules';
import { computeStats } from './stats';

export interface BacktestOptions {
  /** Length of one candle. */
  stepSeconds: number;
  /** Candles in a year, for the Sharpe ratio. Markets that close at weekends have fewer. */
  periodsPerYear: number;
}

export type BacktestOutput = Pick<BacktestResult, 'trades' | 'equityCurve' | 'buyHoldCurve' | 'stats'>;

interface OpenPosition {
  entryTime: number;
  entryPrice: number;
  quantity: number;
  /** Money set aside for the position. The most it can lose. */
  margin: number;
  entryFee: number;
  funding: number;
  stop?: number;
  target?: number;
  liquidation: number;
}

/**
 * Runs a rule-based strategy over candles.
 *
 * How it trades, in order, on each candle inside the test period:
 *
 *  1. A signal from the previous candle's close is filled at this candle's
 *     open. Rules never act on a price they could not have known yet.
 *  2. The candle's high and low are checked against the liquidation price,
 *     the stop-loss and the take-profit. If one candle reaches both a losing
 *     and a winning exit, the losing one is assumed to have come first. A
 *     price that gaps past a stop fills at the open, which is worse than the
 *     stop.
 *  3. Funding is charged for each funding time the candle covers.
 *  4. The rules are evaluated on the close. One position at a time: the entry
 *     rule is only checked while flat, the exit rule only while in a trade.
 *
 * Every fill pays the fee. Market and stop fills also pay slippage;
 * take-profit fills get their price exactly. A liquidation loses the whole
 * margin of the trade. Anything open at the end is closed at the last close.
 * If the account is emptied, trading stops and the account stays at zero.
 *
 * `candles` should start before `config.from` so indicators have warmed up;
 * candles outside the period are used for indicator values only.
 */
export function runBacktest(strategy: BacktestStrategy, config: BacktestConfig, candles: Candle[], options: BacktestOptions): BacktestOutput {
  const { feeRate, slippagePct, initialCapital } = config;
  const leverage = Math.max(1, config.futures?.leverage ?? 1);
  const maintenance = config.futures?.maintenanceMarginRate ?? 0;
  const fundingRate = config.futures?.applyFunding ? (config.futures.fundingRate ?? DEFAULT_FUNDING_RATE) : 0;
  const long = strategy.direction === 'long';
  const sign = long ? 1 : -1;
  const entrySide = long ? 'buy' : 'sell';
  const exitSide = long ? 'sell' : 'buy';
  const stepMs = options.stepSeconds * 1000;

  const trades: BacktestTrade[] = [];
  const equityCurve: EquityPoint[] = [];
  const buyHoldCurve: EquityPoint[] = [];

  const start = candles.findIndex((c) => c.time * 1000 >= config.from);
  let end = -1;
  for (let i = candles.length - 1; i >= 0; i--) {
    if (candles[i].time * 1000 <= config.to) {
      end = i;
      break;
    }
  }
  if (start === -1 || end < start) return { trades, equityCurve, buyHoldCurve, stats: computeStats(trades, equityCurve, buyHoldCurve, initialCapital, options.periodsPerYear) };

  const resolve = createResolver(candles, options.stepSeconds);
  const entryRule = resolveRule(strategy.entry, resolve);
  const exitRule = resolveRule(strategy.exit, resolve);

  // Buy and hold: everything in at the first open, paying the fee once, never sold.
  const holdQuantity = initialCapital / (candles[start].open * (1 + feeRate));

  let cash = initialCapital;
  let position: OpenPosition | null = null;
  let enterNext = false;
  let exitNext = false;
  let broke = false;

  const open = (price: number, time: number) => {
    const fill = withSlippage(price, entrySide, slippagePct);
    // Leave room for the entry fee, so a 100% position is affordable.
    const margin = Math.min((cash * strategy.positionSizePct) / 100, cash / (1 + leverage * feeRate));
    if (!(margin > 0) || !(fill > 0)) return;
    const quantity = (margin * leverage) / fill;
    const entryFee = feeFor(fill, quantity, feeRate);
    cash -= entryFee;
    position = {
      entryTime: time,
      entryPrice: fill,
      quantity,
      margin,
      entryFee,
      funding: 0,
      stop: strategy.stopLossPct != null ? fill * (1 - (sign * strategy.stopLossPct) / 100) : undefined,
      target: strategy.takeProfitPct != null ? fill * (1 + (sign * strategy.takeProfitPct) / 100) : undefined,
      liquidation: liquidationPrice(strategy.direction, fill, leverage, maintenance),
    };
  };

  const close = (p: OpenPosition, price: number, time: number, reason: BacktestTrade['exitReason'], slipped: boolean) => {
    const fill = slipped ? withSlippage(price, exitSide, slippagePct) : price;
    const gross = (fill - p.entryPrice) * p.quantity * sign;
    let exitFee = feeFor(fill, p.quantity, feeRate);
    // The position can never lose more than its margin. On a liquidation it
    // loses exactly that: whatever the price move left is taken as a fee.
    let change = gross - exitFee;
    if (reason === 'liquidation' || change < -p.margin) {
      change = -p.margin;
      exitFee = p.margin + gross;
    }
    cash += change;
    const pnl = change - p.entryFee - p.funding;
    trades.push({
      entryTime: p.entryTime,
      exitTime: time,
      direction: strategy.direction,
      entryPrice: p.entryPrice,
      exitPrice: fill,
      quantity: p.quantity,
      pnl,
      returnPct: (pnl / p.margin) * 100,
      fees: p.entryFee + exitFee,
      funding: p.funding,
      exitReason: reason,
    });
    position = null;
  };

  for (let i = start; i <= end; i++) {
    const c = candles[i];
    const openMs = c.time * 1000;
    const closeMs = openMs + stepMs;

    // 1. Fill what the previous close decided.
    if (exitNext && position) close(position, c.open, openMs, 'rule', true);
    if (enterNext && !position) open(c.open, openMs);
    enterNext = false;
    exitNext = false;

    // 2. Liquidation, stop-loss and take-profit inside the candle.
    if (position) {
      const p: OpenPosition = position;
      const adverse = long ? c.low : c.high;
      const favourable = long ? c.high : c.low;
      const reaches = (level: number, extreme: number, losing: boolean) => (long === losing ? extreme <= level : extreme >= level);
      const worse = (a: number, b: number) => (long ? Math.min(a, b) : Math.max(a, b));
      const better = (a: number, b: number) => (long ? Math.max(a, b) : Math.min(a, b));
      const liquidated = reaches(p.liquidation, adverse, true);
      // The stop comes first only if it sits nearer the entry and price did not open past the liquidation price.
      const stopFirst = p.stop != null && reaches(p.stop, adverse, true) && worse(p.stop, p.liquidation) === p.liquidation && !reaches(p.liquidation, c.open, true);
      if (stopFirst) close(p, worse(p.stop as number, c.open), closeMs, 'stop_loss', true);
      else if (liquidated) close(p, p.liquidation, closeMs, 'liquidation', false);
      else if (p.target != null && reaches(p.target, favourable, false)) close(p, better(p.target, c.open), closeMs, 'take_profit', false);
    }

    // 3. Funding on what is still open.
    if (position && fundingRate !== 0) {
      const p: OpenPosition = position;
      const periods = fundingPeriods(Math.max(p.entryTime, openMs), closeMs);
      if (periods > 0) {
        const paid = periods * fundingPayment(strategy.direction, p.quantity * c.close, fundingRate);
        cash -= paid;
        p.funding += paid;
      }
    }

    // 4. Decide on the close, to act at the next open.
    if (i < end) {
      const exit = ruleTrueAt(exitRule, i);
      if (position) exitNext = exit;
      else enterNext = !broke && !exit && ruleTrueAt(entryRule, i);
    } else if (position) {
      close(position, c.close, closeMs, 'end_of_data', true);
    }

    const p = position as OpenPosition | null;
    const unrealized = p ? Math.max(-p.margin, (c.close - p.entryPrice) * p.quantity * sign) : 0;
    equityCurve.push({ time: closeMs, equity: Math.max(0, cash + unrealized) });
    buyHoldCurve.push({ time: closeMs, equity: holdQuantity * c.close });

    // Nothing left to trade with: no more entries, but the curves run on to the end of the period.
    if (!p && cash <= initialCapital * 1e-6) broke = true;
  }

  return { trades, equityCurve, buyHoldCurve, stats: computeStats(trades, equityCurve, buyHoldCurve, initialCapital, options.periodsPerYear) };
}

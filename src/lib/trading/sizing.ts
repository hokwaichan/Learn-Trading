import type { Direction } from '@/types';

export interface PositionSizeInput {
  /** Account equity in dollars. */
  equity: number;
  /** Share of the account to risk, as a fraction: 0.01 = 1%. */
  riskFraction: number;
  entry: number;
  stop: number;
}

export interface PositionSizeResult {
  /** Dollars lost if the stop is hit. */
  riskAmount: number;
  /** Price distance from entry to stop. */
  stopDistance: number;
  /** Stop distance as a fraction of the entry price. */
  stopFraction: number;
  /** Units to trade. */
  quantity: number;
  /** quantity * entry: what the position is worth. */
  positionValue: number;
  /** Position value as a multiple of equity. Above 1 needs leverage. */
  leverageNeeded: number;
  /** Long if the stop is below the entry, short if above. */
  direction: Direction;
}

/**
 * Sizes a position so that hitting the stop loses a chosen share of the
 * account, however far away the stop is:
 *
 *   quantity = (equity * risk fraction) / |entry - stop|
 *
 * Returns null when the inputs do not describe a real trade.
 */
export function positionSize({ equity, riskFraction, entry, stop }: PositionSizeInput): PositionSizeResult | null {
  if (!(equity > 0) || !(riskFraction > 0) || !(entry > 0) || !(stop > 0) || entry === stop) return null;
  const riskAmount = equity * riskFraction;
  const stopDistance = Math.abs(entry - stop);
  const quantity = riskAmount / stopDistance;
  const positionValue = quantity * entry;
  return {
    riskAmount,
    stopDistance,
    stopFraction: stopDistance / entry,
    quantity,
    positionValue,
    leverageNeeded: positionValue / equity,
    direction: stop < entry ? 'long' : 'short',
  };
}

/** Reward divided by risk for a planned trade: 2 means risking $1 to make $2. */
export function riskReward(entry: number, stop: number, target: number): number | null {
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  if (!(risk > 0)) return null;
  // The target must be on the opposite side of the entry from the stop.
  if ((target - entry) * (entry - stop) <= 0) return null;
  return reward / risk;
}

/** Average profit per trade, in units of risk (R): winRate * avgWin - lossRate * avgLoss. */
export function expectancy(winRate: number, avgWinR: number, avgLossR = 1): number {
  return winRate * avgWinR - (1 - winRate) * avgLossR;
}

/** The win rate at which a given reward-to-risk ratio breaks even: 1 / (1 + R). */
export function breakEvenWinRate(rewardToRisk: number): number {
  return 1 / (1 + rewardToRisk);
}

/** The gain needed to get back to where you started after a loss: 50% down needs 100% up. */
export function recoveryGain(lossFraction: number): number {
  return lossFraction >= 1 ? Infinity : lossFraction / (1 - lossFraction);
}

/**
 * Simple leverage arithmetic for one isolated position, ignoring fees.
 * The full futures model (maintenance margin tiers, funding) lives in
 * lib/trading/futures and is used by the simulator.
 */
export function leveragedOutcome(margin: number, leverage: number, priceMoveFraction: number, direction: Direction = 'long') {
  const positionValue = margin * leverage;
  const signed = direction === 'long' ? priceMoveFraction : -priceMoveFraction;
  const pnl = Math.max(-margin, positionValue * signed);
  return {
    positionValue,
    pnl,
    /** Return on the margin you put up. */
    returnOnMargin: pnl / margin,
    /** The adverse move that loses the whole margin: 1 / leverage. */
    wipeoutMove: 1 / leverage,
    liquidated: positionValue * signed <= -margin,
  };
}

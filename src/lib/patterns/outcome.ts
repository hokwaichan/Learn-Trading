import { atr } from '@/lib/indicators/atr';
import type { Candle } from '@/types';

export type Outcome = 'up' | 'down' | 'sideways';

export interface OutcomeResult {
  outcome: Outcome;
  /** Close at the end of the horizon divided by the close at the cut, minus 1. */
  change: number;
  /** The move measured in ATRs, signed. */
  changeInAtr: number;
  /** Moves smaller than this many ATRs count as sideways. */
  thresholdAtr: number;
}

/**
 * How far price has to travel, in ATRs, before a move over `horizon` candles
 * counts as up or down rather than sideways.
 *
 * Chosen so that, if price moved at random, roughly a third of outcomes would
 * fall in each bucket: a random walk drifts about 0.7 ATR per candle (the
 * close-to-close move is smaller than the high-low range), so over N candles
 * the spread is about 0.7 * sqrt(N) ATR, and the middle third of a normal
 * distribution lies within 0.43 of that spread.
 */
export function sidewaysThreshold(horizon: number): number {
  return 0.43 * 0.7 * Math.sqrt(horizon);
}

/**
 * Classifies what happened over the `horizon` candles after index `cut`.
 * Returns null when there is not enough data on either side.
 */
export function classifyOutcome(candles: Candle[], cut: number, horizon: number, atrPeriod = 14): OutcomeResult | null {
  const end = cut + horizon;
  if (cut < atrPeriod || end >= candles.length) return null;
  const unit = atr(candles.slice(0, cut + 1), atrPeriod)[cut];
  const start = candles[cut].close;
  if (!unit || !(start > 0)) return null;
  const move = candles[end].close - start;
  const changeInAtr = move / unit;
  const thresholdAtr = sidewaysThreshold(horizon);
  return {
    outcome: changeInAtr > thresholdAtr ? 'up' : changeInAtr < -thresholdAtr ? 'down' : 'sideways',
    change: move / start,
    changeInAtr,
    thresholdAtr,
  };
}

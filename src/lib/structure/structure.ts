import type { Candle } from '@/types';

/**
 * Price-structure detection in the vocabulary of "smart money concepts"
 * (SMC) and ICT: swing points, breaks of structure, fair value gaps, order
 * blocks, liquidity pools and sweeps.
 *
 * These ideas have no single agreed definition; different teachers draw
 * them differently. Each function below states the exact rule it uses, so
 * what the chart marks can always be checked by eye.
 */

export interface Swing {
  /** Position in the candle list. */
  index: number;
  time: number;
  price: number;
  kind: 'high' | 'low';
  /** The candle on which the swing became known: `strength` candles later. */
  confirmedAt: number;
}

/**
 * Swing highs and lows. A swing high is a candle whose high is above the
 * highs of the `strength` candles before it and at least as high as those of
 * the `strength` candles after it; a swing low is the mirror image.
 *
 * A swing cannot be known until the candles after it have printed, so each
 * carries the index at which it was confirmed. Nothing here looks ahead of
 * that.
 */
export function findSwings(candles: Candle[], strength = 3): Swing[] {
  const swings: Swing[] = [];
  for (let i = strength; i < candles.length - strength; i++) {
    let high = true;
    let low = true;
    for (let k = 1; k <= strength && (high || low); k++) {
      if (!(candles[i].high > candles[i - k].high) || !(candles[i].high >= candles[i + k].high)) high = false;
      if (!(candles[i].low < candles[i - k].low) || !(candles[i].low <= candles[i + k].low)) low = false;
    }
    if (high) swings.push({ index: i, time: candles[i].time, price: candles[i].high, kind: 'high', confirmedAt: i + strength });
    if (low) swings.push({ index: i, time: candles[i].time, price: candles[i].low, kind: 'low', confirmedAt: i + strength });
  }
  return swings;
}

export interface StructureBreak {
  /** The candle that closed beyond the swing. */
  index: number;
  time: number;
  /**
   * 'bos' (break of structure): a break in the direction of the existing
   * trend. 'choch' (change of character): the first break against it.
   */
  kind: 'bos' | 'choch';
  direction: 'bullish' | 'bearish';
  /** The swing price that was broken. */
  level: number;
  swingIndex: number;
}

/**
 * Breaks of structure and changes of character.
 *
 * A break happens when a candle closes beyond the most recent confirmed
 * swing high (bullish) or swing low (bearish); a wick through it does not
 * count. The first break sets the trend. After that, a break the same way is
 * a break of structure and a break the other way is a change of character,
 * which flips the trend.
 */
export function findStructureBreaks(candles: Candle[], swings: Swing[]): StructureBreak[] {
  const breaks: StructureBreak[] = [];
  const byConfirmation = [...swings].sort((a, b) => a.confirmedAt - b.confirmedAt);
  let next = 0;
  let lastHigh: Swing | null = null;
  let lastLow: Swing | null = null;
  let trend: 'bullish' | 'bearish' | null = null;

  for (let i = 0; i < candles.length; i++) {
    while (next < byConfirmation.length && byConfirmation[next].confirmedAt <= i) {
      const swing = byConfirmation[next++];
      if (swing.kind === 'high') lastHigh = swing;
      else lastLow = swing;
    }
    const close = candles[i].close;
    if (lastHigh && close > lastHigh.price) {
      breaks.push({ index: i, time: candles[i].time, kind: trend === 'bearish' ? 'choch' : 'bos', direction: 'bullish', level: lastHigh.price, swingIndex: lastHigh.index });
      trend = 'bullish';
      lastHigh = null;
    } else if (lastLow && close < lastLow.price) {
      breaks.push({ index: i, time: candles[i].time, kind: trend === 'bullish' ? 'choch' : 'bos', direction: 'bearish', level: lastLow.price, swingIndex: lastLow.index });
      trend = 'bearish';
      lastLow = null;
    }
  }
  return breaks;
}

export interface FairValueGap {
  /** The middle candle of the three. */
  index: number;
  time: number;
  direction: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  /** The first later candle that traded back into the gap, if any. */
  touchedAt?: number;
  /** The first later candle that traded all the way through it, if any. */
  filledAt?: number;
}

/**
 * Fair value gaps (also called imbalances): three candles where the first
 * and third do not overlap, leaving a price range that only the middle
 * candle traded through.
 *
 *   bullish: low of candle 3 is above the high of candle 1
 *   bearish: high of candle 3 is below the low of candle 1
 *
 * Gaps smaller than `minFraction` of the price are ignored as noise.
 */
export function findFairValueGaps(candles: Candle[], minFraction = 0.001): FairValueGap[] {
  const gaps: FairValueGap[] = [];
  for (let i = 1; i < candles.length - 1; i++) {
    const before = candles[i - 1];
    const after = candles[i + 1];
    let gap: FairValueGap | null = null;
    if (after.low > before.high) gap = { index: i, time: candles[i].time, direction: 'bullish', top: after.low, bottom: before.high };
    else if (after.high < before.low) gap = { index: i, time: candles[i].time, direction: 'bearish', top: before.low, bottom: after.high };
    if (!gap || (gap.top - gap.bottom) / candles[i].close < minFraction) continue;
    for (let j = i + 2; j < candles.length; j++) {
      const c = candles[j];
      const into = gap.direction === 'bullish' ? c.low <= gap.top : c.high >= gap.bottom;
      const through = gap.direction === 'bullish' ? c.low <= gap.bottom : c.high >= gap.top;
      if (into && gap.touchedAt == null) gap.touchedAt = j;
      if (through) {
        gap.filledAt = j;
        break;
      }
    }
    gaps.push(gap);
  }
  return gaps;
}

export interface OrderBlock {
  /** The candle that forms the block. */
  index: number;
  time: number;
  direction: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  /** The structure break that made it an order block. */
  breakIndex: number;
  /** The first candle after the break that traded back into the block, if any. */
  touchedAt?: number;
}

/**
 * Order blocks: the last candle against the move before price ran and broke
 * structure.
 *
 * For a bullish break, find where the move began (the lowest low between
 * the broken swing high and the breaking candle), then take the last down
 * candle at or just before that low. The block is that candle's full range,
 * high to low. Bearish blocks are the mirror image.
 */
export function findOrderBlocks(candles: Candle[], breaks: StructureBreak[], lookback = 5): OrderBlock[] {
  const blocks: OrderBlock[] = [];
  const seen = new Set<number>();
  for (const b of breaks) {
    const bullish = b.direction === 'bullish';
    let origin = b.swingIndex;
    for (let i = b.swingIndex; i <= b.index; i++) {
      if (bullish ? candles[i].low < candles[origin].low : candles[i].high > candles[origin].high) origin = i;
    }
    let found = -1;
    for (let i = origin; i >= Math.max(0, origin - lookback); i--) {
      const against = bullish ? candles[i].close < candles[i].open : candles[i].close > candles[i].open;
      if (against) {
        found = i;
        break;
      }
    }
    if (found === -1 || seen.has(found)) continue;
    seen.add(found);
    const block: OrderBlock = { index: found, time: candles[found].time, direction: b.direction, top: candles[found].high, bottom: candles[found].low, breakIndex: b.index };
    for (let j = b.index + 1; j < candles.length; j++) {
      if (bullish ? candles[j].low <= block.top : candles[j].high >= block.bottom) {
        block.touchedAt = j;
        break;
      }
    }
    blocks.push(block);
  }
  return blocks;
}

export interface LiquidityPool {
  kind: 'equal-highs' | 'equal-lows';
  /** The outermost price of the group: the level stops are assumed to sit beyond. */
  price: number;
  /** The swings that form it. */
  swings: Swing[];
}

/**
 * Equal highs and equal lows: two or more consecutive swings of the same
 * kind within `tolerance` (a fraction of price) of each other. Stop orders
 * tend to gather just beyond such levels, which is why they are called
 * liquidity pools.
 */
export function findLiquidityPools(swings: Swing[], tolerance = 0.002): LiquidityPool[] {
  const pools: LiquidityPool[] = [];
  for (const kind of ['high', 'low'] as const) {
    const list = swings.filter((s) => s.kind === kind);
    let group: Swing[] = [];
    const flush = () => {
      if (group.length >= 2) {
        const prices = group.map((s) => s.price);
        pools.push({ kind: kind === 'high' ? 'equal-highs' : 'equal-lows', price: kind === 'high' ? Math.max(...prices) : Math.min(...prices), swings: group });
      }
      group = [];
    };
    for (const swing of list) {
      if (group.length && Math.abs(swing.price - group[0].price) / group[0].price > tolerance) flush();
      group.push(swing);
    }
    flush();
  }
  return pools.sort((a, b) => a.swings[0].index - b.swings[0].index);
}

export interface Sweep {
  /** The candle that pierced the level and closed back inside. */
  index: number;
  time: number;
  /** 'high': traded above a swing high and closed back below it. 'low': the mirror image. */
  side: 'high' | 'low';
  level: number;
  swingIndex: number;
}

/**
 * Liquidity sweeps (stop hunts): a candle trades beyond a confirmed swing
 * high or low but closes back on the original side. Each swing is swept at
 * most once, and a swing that price has closed beyond is no longer a level.
 */
export function findSweeps(candles: Candle[], swings: Swing[]): Sweep[] {
  const sweeps: Sweep[] = [];
  const byConfirmation = [...swings].sort((a, b) => a.confirmedAt - b.confirmedAt);
  let next = 0;
  let live: Swing[] = [];
  for (let i = 0; i < candles.length; i++) {
    while (next < byConfirmation.length && byConfirmation[next].confirmedAt <= i) live.push(byConfirmation[next++]);
    const c = candles[i];
    const remaining: Swing[] = [];
    for (const swing of live) {
      const high = swing.kind === 'high';
      const pierced = high ? c.high > swing.price : c.low < swing.price;
      const closedBeyond = high ? c.close > swing.price : c.close < swing.price;
      if (!pierced) remaining.push(swing);
      else if (!closedBeyond) sweeps.push({ index: i, time: c.time, side: swing.kind, level: swing.price, swingIndex: swing.index });
    }
    live = remaining;
  }
  return sweeps;
}

export interface DealingRange {
  high: number;
  low: number;
  /** The midpoint: above it is "premium", below it "discount". */
  equilibrium: number;
}

/** The range between the most recent confirmed swing high and swing low, as known at candle `at`. */
export function dealingRange(swings: Swing[], at = Infinity): DealingRange | null {
  let high: Swing | undefined;
  let low: Swing | undefined;
  for (const swing of swings) {
    if (swing.confirmedAt > at) continue;
    if (swing.kind === 'high' && (!high || swing.index > high.index)) high = swing;
    if (swing.kind === 'low' && (!low || swing.index > low.index)) low = swing;
  }
  if (!high || !low || !(high.price > low.price)) return null;
  return { high: high.price, low: low.price, equilibrium: (high.price + low.price) / 2 };
}

/**
 * Where a price sits in a range: 0 at the low, 1 at the high. Below half is
 * "discount" (cheap relative to the range), above half is "premium".
 */
export function rangePosition(range: Pick<DealingRange, 'high' | 'low'>, price: number): { position: number; zone: 'premium' | 'discount' | 'equilibrium' } {
  const position = (price - range.low) / (range.high - range.low);
  return { position, zone: Math.abs(position - 0.5) < 1e-9 ? 'equilibrium' : position > 0.5 ? 'premium' : 'discount' };
}

/** Fibonacci retracement levels of a move from `start` to `end`: 0 is the end, 1 is the start. */
export const FIB_LEVELS = [0.236, 0.382, 0.5, 0.618, 0.786] as const;

export function retracement(start: number, end: number, fraction: number): number {
  return end - (end - start) * fraction;
}

/** Fibonacci extension targets beyond the end of a move: 1.272 and 1.618 times its length, measured from the start. */
export function extension(start: number, end: number, multiple: number): number {
  return start + (end - start) * multiple;
}

/**
 * The "optimal trade entry" zone of ICT: a pullback of 62% to 79% of the
 * move, deep enough to be a discount in an up-move (or a premium in a
 * down-move) without undoing it.
 */
export function oteZone(start: number, end: number): { from: number; to: number; sweetSpot: number } {
  return { from: retracement(start, end, 0.618), to: retracement(start, end, 0.786), sweetSpot: retracement(start, end, 0.705) };
}

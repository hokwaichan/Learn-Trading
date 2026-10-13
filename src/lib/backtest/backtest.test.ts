import { describe, expect, it } from 'vitest';
import { fundingPayment, fundingPeriods, liquidationPrice } from '@/lib/trading/futures';
import type { BacktestConfig, BacktestStrategy, Candle, Condition, Operand } from '@/types';
import { runBacktest } from './engine';
import { compare, conditionLabel, createResolver, operandLabel, resolveRule, ruleLabel, ruleTrueAt, strategyIndicators, validateStrategy, warmupBars } from './rules';
import { computeStats, drawdownSeries, maxDrawdownPct, sharpeRatio } from './stats';

const DAY = 86_400;
const HOUR = 3600;

/** Candles from [open, high, low, close] rows, one per `step` seconds. */
function bars(rows: number[][], step = DAY): Candle[] {
  return rows.map(([open, high, low, close], i) => ({ time: i * step, open, high, low, close, volume: 1000 }));
}

const close: Operand = { kind: 'price', field: 'close' };
const num = (value: number): Operand => ({ kind: 'constant', value });
const cond = (left: Operand, op: Condition['op'], right: Operand): Condition => ({ id: `${Math.random()}`, left, op, right });

/** Enter when the close crosses above 100, leave when it crosses back below. */
function levelStrategy(patch: Partial<BacktestStrategy> = {}): BacktestStrategy {
  return {
    id: 'test',
    name: 'Level',
    description: '',
    direction: 'long',
    entry: { combine: 'all', conditions: [cond(close, 'crosses_above', num(100))] },
    exit: { combine: 'all', conditions: [cond(close, 'crosses_below', num(100))] },
    positionSizePct: 100,
    preset: false,
    ...patch,
  };
}

function config(patch: Partial<BacktestConfig> = {}): BacktestConfig {
  return { symbol: 'TEST', timeframe: '1d', from: 0, to: Number.MAX_SAFE_INTEGER, initialCapital: 10_000, feeRate: 0, slippagePct: 0, ...patch };
}

const DAILY = { stepSeconds: DAY, periodsPerYear: 365 };

// Signal on candle 1 (close 101), filled at candle 2's open of 102.
// Exit signal on candle 4 (close 98), filled at candle 5's open of 97.
const ROUND_TRIP = bars([
  [95, 96, 94, 95],
  [96, 102, 96, 101],
  [102, 110, 101, 108],
  [108, 112, 107, 110],
  [109, 109, 97, 98],
  [97, 99, 96, 98],
]);

describe('rules', () => {
  it('compares values and detects crosses', () => {
    const a = [1, 2, 3, 2, null];
    const b = [2, 2, 2, 2, 2];
    expect(compare('gt', a, b, 2)).toBe(true);
    expect(compare('gt', a, b, 1)).toBe(false);
    expect(compare('gte', a, b, 1)).toBe(true);
    expect(compare('lt', a, b, 0)).toBe(true);
    expect(compare('lte', a, b, 1)).toBe(true);
    // 2 -> 3 against 2: was at, now above.
    expect(compare('crosses_above', a, b, 2)).toBe(true);
    // 1 -> 2 against 2: reaches the line but is not above it.
    expect(compare('crosses_above', a, b, 1)).toBe(false);
    // Already above on both candles is not a cross.
    expect(compare('crosses_above', [3, 4], [2, 2], 1)).toBe(false);
    expect(compare('crosses_below', [3, 1], [2, 2], 1)).toBe(true);
    expect(compare('crosses_below', a, b, 3)).toBe(false);
  });

  it('is false while a value is missing or there is no previous candle', () => {
    expect(compare('gt', [null], [1], 0)).toBe(false);
    expect(compare('crosses_above', [3], [2], 0)).toBe(false);
    expect(compare('crosses_above', [null, 3], [2, 2], 1)).toBe(false);
  });

  it('combines conditions with all or any', () => {
    const resolve = createResolver(ROUND_TRIP, DAY);
    const above = cond(close, 'gt', num(100));
    const high = cond({ kind: 'price', field: 'high' }, 'gt', num(111));
    const all = resolveRule({ combine: 'all', conditions: [above, high] }, resolve);
    const any = resolveRule({ combine: 'any', conditions: [above, high] }, resolve);
    expect(ruleTrueAt(all, 2)).toBe(false);
    expect(ruleTrueAt(any, 2)).toBe(true);
    expect(ruleTrueAt(all, 3)).toBe(true);
    expect(ruleTrueAt(resolveRule({ combine: 'all', conditions: [] }, resolve), 3)).toBe(false);
  });

  it('resolves indicator operands, including a chosen line', () => {
    const candles = bars(Array.from({ length: 30 }, (_, i) => [100 + i, 101 + i, 99 + i, 100 + i]));
    const resolve = createResolver(candles, DAY);
    const sma = resolve({ kind: 'indicator', indicator: 'sma', params: { period: 3 } });
    expect(sma[1]).toBeNull();
    expect(sma[2]).toBeCloseTo(101, 10);
    const upper = resolve({ kind: 'indicator', indicator: 'bollinger', params: { period: 20, multiplier: 2 }, output: 'upper' });
    const lower = resolve({ kind: 'indicator', indicator: 'bollinger', params: { period: 20, multiplier: 2 }, output: 'lower' });
    expect(upper[25]! > lower[25]!).toBe(true);
    // With no line chosen MACD uses its main line, not the histogram.
    const macd = resolve({ kind: 'indicator', indicator: 'macd', params: {} });
    expect(macd).toBe(resolve({ kind: 'indicator', indicator: 'macd', params: {}, output: 'macd' }));
  });

  it('describes rules in words', () => {
    const ema: Operand = { kind: 'indicator', indicator: 'ema', params: { period: 20 } };
    const band: Operand = { kind: 'indicator', indicator: 'bollinger', params: { period: 20, multiplier: 2 }, output: 'upper' };
    expect(operandLabel(ema)).toBe('EMA 20');
    expect(operandLabel(band)).toBe('BB 20, 2 upper');
    expect(conditionLabel(cond(close, 'crosses_above', ema))).toBe('Close crosses above EMA 20');
    expect(ruleLabel({ combine: 'any', conditions: [cond(close, 'lt', num(30)), cond(close, 'gt', band)] })).toBe('Close is below 30 or Close is above BB 20, 2 upper');
    expect(ruleLabel({ combine: 'all', conditions: [] })).toBe('never');
  });

  it('sizes the warm-up from the longest indicator period', () => {
    const ema200: Operand = { kind: 'indicator', indicator: 'ema', params: { period: 200 } };
    expect(warmupBars({ entry: { combine: 'all', conditions: [cond(close, 'gt', ema200)] }, exit: { combine: 'all', conditions: [] } })).toBe(600);
    expect(warmupBars(levelStrategy())).toBe(50);
  });

  it('lists the indicators a strategy uses, once each', () => {
    const ema20: Operand = { kind: 'indicator', indicator: 'ema', params: { period: 20 } };
    const ema50: Operand = { kind: 'indicator', indicator: 'ema', params: { period: 50 } };
    const list = strategyIndicators({ entry: { combine: 'all', conditions: [cond(ema20, 'crosses_above', ema50)] }, exit: { combine: 'all', conditions: [cond(ema20, 'crosses_below', ema50)] } });
    expect(list).toEqual([
      { id: 'ema', params: { period: 20 } },
      { id: 'ema', params: { period: 50 } },
    ]);
    expect(strategyIndicators(levelStrategy())).toEqual([]);
  });

  it('explains what stops a strategy from running', () => {
    expect(validateStrategy(levelStrategy({ entry: { combine: 'all', conditions: [cond(close, 'gt', num(NaN))] } }))[0]).toMatch(/missing its number/);
    expect(validateStrategy(levelStrategy())).toEqual([]);
    expect(validateStrategy(levelStrategy({ entry: { combine: 'all', conditions: [] } }))[0]).toMatch(/entry condition/);
    expect(validateStrategy(levelStrategy({ exit: { combine: 'all', conditions: [] } }))[0]).toMatch(/never closes/);
    expect(validateStrategy(levelStrategy({ exit: { combine: 'all', conditions: [] }, stopLossPct: 5 }))).toEqual([]);
    expect(validateStrategy(levelStrategy({ positionSizePct: 0 }))[0]).toMatch(/Position size/);
    expect(validateStrategy(levelStrategy({ stopLossPct: 150 }))[0]).toMatch(/Stop-loss/);
    expect(validateStrategy(levelStrategy({ entry: { combine: 'all', conditions: [cond(close, 'gt', close)] } }))[0]).toMatch(/with itself/);
    expect(validateStrategy(levelStrategy({ entry: { combine: 'all', conditions: [cond(num(1), 'gt', num(2))] } }))[0]).toMatch(/two fixed numbers/);
  });
});

describe('futures maths', () => {
  it('finds the liquidation price', () => {
    expect(liquidationPrice('long', 100, 10, 0.005)).toBeCloseTo(90.5, 10);
    expect(liquidationPrice('short', 100, 10, 0.005)).toBeCloseTo(109.5, 10);
    expect(liquidationPrice('long', 100, 20, 0.005)).toBeCloseTo(95.5, 10);
    // Unleveraged: a long cannot be liquidated, a short is when price doubles.
    expect(liquidationPrice('long', 100, 1, 0)).toBe(0);
    expect(liquidationPrice('short', 100, 1, 0)).toBe(200);
  });

  it('counts funding times in a span', () => {
    const h = 3_600_000;
    expect(fundingPeriods(0, 8 * h)).toBe(1);
    expect(fundingPeriods(h, 7 * h)).toBe(0);
    expect(fundingPeriods(7 * h, 9 * h)).toBe(1);
    expect(fundingPeriods(0, 24 * h)).toBe(3);
    // A position opened exactly at a funding time does not pay that one.
    expect(fundingPeriods(8 * h, 8 * h)).toBe(0);
    expect(fundingPeriods(8 * h, 16 * h)).toBe(1);
  });

  it('charges longs and pays shorts when the rate is positive', () => {
    expect(fundingPayment('long', 10_000, 0.0001)).toBeCloseTo(1, 10);
    expect(fundingPayment('short', 10_000, 0.0001)).toBeCloseTo(-1, 10);
    expect(fundingPayment('short', 10_000, -0.0001)).toBeCloseTo(1, 10);
  });
});

describe('backtest engine', () => {
  it('fills a signal at the next open and tracks equity candle by candle', () => {
    const { trades, equityCurve, buyHoldCurve, stats } = runBacktest(levelStrategy(), config(), ROUND_TRIP, DAILY);
    expect(trades).toHaveLength(1);
    const [t] = trades;
    expect(t.entryPrice).toBe(102);
    expect(t.exitPrice).toBe(97);
    expect(t.entryTime).toBe(2 * DAY * 1000);
    expect(t.exitTime).toBe(5 * DAY * 1000);
    expect(t.exitReason).toBe('rule');
    const quantity = 10_000 / 102;
    expect(t.quantity).toBeCloseTo(quantity, 8);
    expect(t.pnl).toBeCloseTo(-5 * quantity, 8);
    expect(t.returnPct).toBeCloseTo((-5 / 102) * 100, 8);
    expect(equityCurve.map((p) => p.equity)).toEqual([10_000, 10_000, expect.closeTo(10_000 + 6 * quantity, 6), expect.closeTo(10_000 + 8 * quantity, 6), expect.closeTo(10_000 - 4 * quantity, 6), expect.closeTo(10_000 - 5 * quantity, 6)]);
    // Each point is stamped with the candle's close.
    expect(equityCurve[0].time).toBe(DAY * 1000);
    expect(buyHoldCurve[5].equity).toBeCloseTo((10_000 / 95) * 98, 8);
    expect(stats.totalReturnPct).toBeCloseTo((-5 / 102) * 100, 8);
    expect(stats.buyHoldReturnPct).toBeCloseTo((98 / 95 - 1) * 100, 8);
  });

  it('charges the fee on both fills', () => {
    const { trades, equityCurve } = runBacktest(levelStrategy(), config({ feeRate: 0.001 }), ROUND_TRIP, DAILY);
    const margin = 10_000 / 1.001;
    const quantity = margin / 102;
    const entryFee = 102 * quantity * 0.001;
    const exitFee = 97 * quantity * 0.001;
    expect(entryFee).toBeCloseTo(10_000 - margin, 8);
    expect(trades[0].fees).toBeCloseTo(entryFee + exitFee, 8);
    expect(trades[0].pnl).toBeCloseTo(-5 * quantity - entryFee - exitFee, 8);
    expect(equityCurve[5].equity).toBeCloseTo(10_000 + trades[0].pnl, 8);
  });

  it('applies slippage against the trade on market fills', () => {
    const { trades } = runBacktest(levelStrategy(), config({ slippagePct: 0.001 }), ROUND_TRIP, DAILY);
    expect(trades[0].entryPrice).toBeCloseTo(102.102, 10);
    expect(trades[0].exitPrice).toBeCloseTo(96.903, 10);
  });

  it('commits only the chosen share of the account', () => {
    const { trades } = runBacktest(levelStrategy({ positionSizePct: 25 }), config(), ROUND_TRIP, DAILY);
    expect(trades[0].quantity).toBeCloseTo(2500 / 102, 8);
    expect(trades[0].returnPct).toBeCloseTo((-5 / 102) * 100, 8);
  });

  it('stops out at the stop price, with slippage', () => {
    // Entry 102, stop 5% below at 96.9. Candle 4 falls to 97... not enough; candle 5 to 96.
    const { trades } = runBacktest(levelStrategy({ stopLossPct: 5, exit: { combine: 'all', conditions: [] } }), config({ slippagePct: 0.001 }), ROUND_TRIP, DAILY);
    expect(trades[0].exitReason).toBe('stop_loss');
    expect(trades[0].exitPrice).toBeCloseTo(102.102 * 0.95 * 0.999, 8);
    expect(trades[0].exitTime).toBe(6 * DAY * 1000);
  });

  it('fills a gapped stop at the open, which is worse', () => {
    const candles = bars([
      [95, 96, 94, 95],
      [96, 102, 96, 101],
      [102, 104, 101, 103],
      [90, 92, 88, 91],
    ]);
    const { trades } = runBacktest(levelStrategy({ stopLossPct: 5 }), config(), candles, DAILY);
    expect(trades[0].exitReason).toBe('stop_loss');
    expect(trades[0].exitPrice).toBe(90);
  });

  it('can stop out on the candle it entered, because entry is at the open', () => {
    const candles = bars([
      [95, 96, 94, 95],
      [96, 102, 96, 101],
      [102, 103, 96, 97],
      [97, 98, 96, 97],
    ]);
    const { trades } = runBacktest(levelStrategy({ stopLossPct: 5 }), config(), candles, DAILY);
    expect(trades[0].entryTime).toBe(2 * DAY * 1000);
    expect(trades[0].exitTime).toBe(3 * DAY * 1000);
    expect(trades[0].exitPrice).toBeCloseTo(96.9, 10);
  });

  it('takes profit at the target exactly, even with slippage on', () => {
    // Entry 102.102, target 5% above.
    const { trades } = runBacktest(levelStrategy({ takeProfitPct: 5 }), config({ slippagePct: 0.001 }), ROUND_TRIP, DAILY);
    expect(trades[0].exitReason).toBe('take_profit');
    expect(trades[0].exitPrice).toBeCloseTo(102.102 * 1.05, 10);
    expect(trades[0].pnl).toBeGreaterThan(0);
  });

  it('assumes the stop came first when one candle reaches both', () => {
    const candles = bars([
      [95, 96, 94, 95],
      [96, 102, 96, 101],
      [102, 103, 101, 102],
      [102, 110, 95, 104],
    ]);
    const { trades } = runBacktest(levelStrategy({ stopLossPct: 5, takeProfitPct: 5 }), config(), candles, DAILY);
    expect(trades[0].exitReason).toBe('stop_loss');
  });

  it('closes what is still open at the last close', () => {
    const { trades, equityCurve } = runBacktest(levelStrategy(), config(), ROUND_TRIP.slice(0, 4), DAILY);
    expect(trades[0].exitReason).toBe('end_of_data');
    expect(trades[0].exitPrice).toBe(110);
    expect(equityCurve[3].equity).toBeCloseTo(10_000 + (8 * 10_000) / 102, 6);
  });

  it('only trades inside the test period', () => {
    // The entry signal is on candle 1, before the period starts on candle 3.
    const { trades, equityCurve } = runBacktest(levelStrategy(), config({ from: 3 * DAY * 1000 }), ROUND_TRIP, DAILY);
    expect(trades).toHaveLength(0);
    expect(equityCurve).toHaveLength(3);
    // A period that ends early stops there.
    const early = runBacktest(levelStrategy(), config({ to: 3 * DAY * 1000 }), ROUND_TRIP, DAILY);
    expect(early.equityCurve).toHaveLength(4);
    expect(early.trades[0].exitReason).toBe('end_of_data');
    expect(runBacktest(levelStrategy(), config({ from: 99 * DAY * 1000 }), ROUND_TRIP, DAILY).equityCurve).toEqual([]);
  });

  it('does not look ahead: later candles cannot change earlier trades', () => {
    const changed = ROUND_TRIP.map((c, i) => (i === 5 ? { ...c, open: 50, high: 50, low: 40, close: 45 } : c));
    const a = runBacktest(levelStrategy({ takeProfitPct: 5 }), config(), ROUND_TRIP, DAILY);
    const b = runBacktest(levelStrategy({ takeProfitPct: 5 }), config(), changed, DAILY);
    expect(b.trades[0]).toEqual(a.trades[0]);
    expect(b.equityCurve.slice(0, 5)).toEqual(a.equityCurve.slice(0, 5));
  });

  it('profits from a fall when short', () => {
    const candles = bars([
      [105, 106, 104, 105],
      [104, 104, 98, 99],
      [98, 99, 90, 91],
      [90, 103, 90, 102],
      [103, 104, 102, 103],
    ]);
    const strategy = levelStrategy({
      direction: 'short',
      entry: { combine: 'all', conditions: [cond(close, 'crosses_below', num(100))] },
      exit: { combine: 'all', conditions: [cond(close, 'crosses_above', num(100))] },
    });
    const { trades } = runBacktest(strategy, config(), candles, DAILY);
    expect(trades[0].direction).toBe('short');
    expect(trades[0].entryPrice).toBe(98);
    expect(trades[0].exitPrice).toBe(103);
    expect(trades[0].pnl).toBeCloseTo((-5 * 10_000) / 98, 8);
    // With slippage a short sells lower and buys back higher.
    const slipped = runBacktest(strategy, config({ slippagePct: 0.001 }), candles, DAILY).trades[0];
    expect(slipped.entryPrice).toBeCloseTo(98 * 0.999, 10);
    expect(slipped.exitPrice).toBeCloseTo(103 * 1.001, 10);
  });

  describe('with leverage', () => {
    const futures = { leverage: 10, maintenanceMarginRate: 0.005, applyFunding: false };
    // Entry at 100. At 10x the liquidation price is 90.5.
    const crash = bars([
      [95, 96, 94, 95],
      [96, 102, 96, 101],
      [100, 101, 99, 100],
      [100, 100, 90, 92],
      [92, 93, 91, 92],
    ]);

    it('multiplies the position and the result', () => {
      const candles = bars([
        [95, 96, 94, 95],
        [96, 102, 96, 101],
        [100, 104, 99, 103],
        [103, 106, 102, 105],
      ]);
      const { trades, stats } = runBacktest(levelStrategy({ positionSizePct: 50 }), config({ futures }), candles, DAILY);
      // $5,000 of margin controls $50,000: 500 units. Up 5 each.
      expect(trades[0].quantity).toBeCloseTo(500, 8);
      expect(trades[0].pnl).toBeCloseTo(2500, 8);
      expect(trades[0].returnPct).toBeCloseTo(50, 8);
      expect(stats.totalReturnPct).toBeCloseTo(25, 8);
    });

    it('liquidates, losing the whole margin of the trade', () => {
      const { trades, equityCurve, stats } = runBacktest(levelStrategy({ positionSizePct: 50 }), config({ futures }), crash, DAILY);
      expect(trades[0].exitReason).toBe('liquidation');
      expect(trades[0].exitPrice).toBeCloseTo(90.5, 10);
      expect(trades[0].pnl).toBeCloseTo(-5000, 8);
      expect(trades[0].returnPct).toBeCloseTo(-100, 8);
      // The price move took 9.5 x 500 = 4,750; the remaining 250 goes as the liquidation fee.
      expect(trades[0].fees).toBeCloseTo(250, 8);
      expect(equityCurve[3].equity).toBeCloseTo(5000, 8);
      expect(stats.liquidations).toBe(1);
    });

    it('uses the stop instead when it is nearer than the liquidation price', () => {
      const { trades } = runBacktest(levelStrategy({ positionSizePct: 50, stopLossPct: 5 }), config({ futures }), crash, DAILY);
      expect(trades[0].exitReason).toBe('stop_loss');
      expect(trades[0].pnl).toBeCloseTo(-2500, 8);
    });

    it('liquidates before a stop that sits beyond the liquidation price', () => {
      const { trades } = runBacktest(levelStrategy({ positionSizePct: 50, stopLossPct: 9.8 }), config({ futures }), crash, DAILY);
      expect(trades[0].exitReason).toBe('liquidation');
    });

    it('liquidates when price opens past both the stop and the liquidation price', () => {
      const gap = crash.map((c, i) => (i === 3 ? { ...c, open: 88, high: 89, low: 85, close: 86 } : c));
      const { trades } = runBacktest(levelStrategy({ positionSizePct: 50, stopLossPct: 5 }), config({ futures }), gap, DAILY);
      expect(trades[0].exitReason).toBe('liquidation');
      expect(trades[0].pnl).toBeCloseTo(-5000, 8);
    });

    it('liquidates a short when price rises', () => {
      const candles = bars([
        [105, 106, 104, 105],
        [104, 104, 98, 99],
        [100, 101, 99, 100],
        [100, 110, 100, 109],
      ]);
      const strategy = levelStrategy({ direction: 'short', positionSizePct: 50, entry: { combine: 'all', conditions: [cond(close, 'crosses_below', num(100))] }, exit: { combine: 'all', conditions: [] }, stopLossPct: 50 });
      const { trades } = runBacktest(strategy, config({ futures }), candles, DAILY);
      expect(trades[0].exitReason).toBe('liquidation');
      expect(trades[0].exitPrice).toBeCloseTo(109.5, 10);
    });

    it('never lets one trade lose more than its margin, and stops when the account is empty', () => {
      const { trades, equityCurve } = runBacktest(levelStrategy({ positionSizePct: 100 }), config({ futures }), crash, DAILY);
      expect(trades[0].pnl).toBeCloseTo(-10_000, 6);
      // The curve runs to the end of the period at zero, with no further trades.
      expect(equityCurve.map((p) => p.equity)).toEqual([10_000, 10_000, 10_000, 0, 0]);
      expect(trades).toHaveLength(1);
    });

    it('charges funding three times a day on daily candles', () => {
      const flat = bars([
        [95, 96, 94, 95],
        [96, 102, 96, 101],
        [100, 101, 99, 100],
        [100, 101, 99, 100],
        [100, 101, 98, 99],
        [100, 101, 99, 100],
      ]);
      const funded = { leverage: 2, maintenanceMarginRate: 0.005, applyFunding: true, fundingRate: 0.0001 };
      const { trades, stats } = runBacktest(levelStrategy(), config({ futures: funded }), flat, DAILY);
      // 200 units. Candles 2, 3 and 4 each cover three funding times, priced at closes of 100, 100 and 99.
      const expected = 3 * 200 * 0.0001 * (100 + 100 + 99);
      expect(trades[0].quantity).toBeCloseTo(200, 8);
      expect(trades[0].funding).toBeCloseTo(expected, 8);
      expect(trades[0].pnl).toBeCloseTo(-expected, 8);
      expect(stats.totalFunding).toBeCloseTo(expected, 8);
      // Switched off, it costs nothing.
      expect(runBacktest(levelStrategy(), config({ futures: { ...funded, applyFunding: false } }), flat, DAILY).trades[0].funding).toBe(0);
    });

    it('pays funding to shorts, and only at funding times on short candles', () => {
      // Hourly candles from 00:00. Entry at the open of candle 2 (02:00), exit at the open of candle 10 (10:00): one funding time, 08:00.
      const rows = [
        [105, 106, 104, 105],
        [104, 104, 98, 99],
        ...Array.from({ length: 7 }, () => [98, 99, 97, 98]),
        [98, 103, 98, 102],
        [102, 103, 101, 102],
      ];
      const strategy = levelStrategy({ direction: 'short', entry: { combine: 'all', conditions: [cond(close, 'crosses_below', num(100))] }, exit: { combine: 'all', conditions: [cond(close, 'crosses_above', num(100))] } });
      const funded = { leverage: 1, maintenanceMarginRate: 0, applyFunding: true, fundingRate: 0.0001 };
      const { trades } = runBacktest(strategy, config({ timeframe: '1h', futures: funded }), bars(rows, HOUR), { stepSeconds: HOUR, periodsPerYear: 8760 });
      expect(trades[0].exitTime).toBe(10 * HOUR * 1000);
      expect(trades[0].funding).toBeCloseTo(-(10_000 / 98) * 98 * 0.0001, 8);
    });
  });

  it('re-enters after an exit and takes several trades', () => {
    const wave = bars([
      [95, 96, 94, 95],
      [96, 102, 96, 101],
      [102, 103, 101, 102],
      [101, 101, 97, 98],
      [98, 99, 97, 98],
      [99, 104, 99, 103],
      [104, 105, 103, 104],
      [103, 103, 96, 97],
      [97, 98, 96, 97],
    ]);
    const { trades, stats } = runBacktest(levelStrategy(), config(), wave, DAILY);
    expect(trades.map((t) => [t.entryPrice, t.exitPrice])).toEqual([
      [102, 98],
      [104, 97],
    ]);
    expect(stats.tradeCount).toBe(2);
    expect(stats.winRate).toBe(0);
  });
});

describe('backtest statistics', () => {
  const curve = (values: number[]) => values.map((equity, i) => ({ time: i, equity }));

  it('finds the largest fall from a peak', () => {
    expect(maxDrawdownPct(curve([100, 120, 90, 130, 117]))).toBeCloseTo(25, 10);
    expect(maxDrawdownPct(curve([100, 110, 120]))).toBe(0);
    expect(maxDrawdownPct([])).toBe(0);
    expect(drawdownSeries(curve([100, 120, 90, 130])).map((p) => p.value)).toEqual([0, 0, -25, 0]);
  });

  it('annualises the Sharpe ratio', () => {
    // Returns of +10%, -10%, +10%: mean 1/30, sample standard deviation 0.11547.
    expect(sharpeRatio(curve([100, 110, 99, 108.9]), 252)).toBeCloseTo((1 / 30 / Math.sqrt(0.04 / 3)) * Math.sqrt(252), 6);
    expect(sharpeRatio(curve([100, 110, 99, 108.9]), 252)).toBeCloseTo(4.5826, 3);
    // No variation, or too little data, gives zero instead of dividing by zero.
    expect(sharpeRatio(curve([100, 100, 100]), 252)).toBe(0);
    expect(sharpeRatio(curve([100, 110]), 252)).toBe(0);
  });

  it('summarises trades', () => {
    const trade = (pnl: number, exitReason: 'rule' | 'liquidation' = 'rule') => ({ entryTime: 0, exitTime: 1, direction: 'long' as const, entryPrice: 1, exitPrice: 1, quantity: 1, pnl, returnPct: 0, fees: 2, funding: 1, exitReason });
    const stats = computeStats([trade(200), trade(100), trade(-60), trade(-40, 'liquidation')], curve([1000, 1200]), curve([1000, 900]), 1000, 252);
    expect(stats.tradeCount).toBe(4);
    expect(stats.winRate).toBe(0.5);
    expect(stats.avgWin).toBe(150);
    expect(stats.avgLoss).toBe(-50);
    expect(stats.profitFactor).toBe(3);
    expect(stats.expectancy).toBe(50);
    expect(stats.totalReturnPct).toBeCloseTo(20, 10);
    expect(stats.buyHoldReturnPct).toBeCloseTo(-10, 10);
    expect(stats.liquidations).toBe(1);
    expect(stats.totalFees).toBe(8);
    expect(stats.totalFunding).toBe(4);
  });

  it('handles no trades and no losses', () => {
    const none = computeStats([], [], [], 1000, 252);
    expect(none).toMatchObject({ tradeCount: 0, winRate: 0, avgWin: 0, avgLoss: 0, profitFactor: 0, expectancy: 0, totalReturnPct: 0 });
    const trade = { entryTime: 0, exitTime: 1, direction: 'long' as const, entryPrice: 1, exitPrice: 1, quantity: 1, pnl: 5, returnPct: 0, fees: 0, funding: 0, exitReason: 'rule' as const };
    expect(computeStats([trade], [], [], 1000, 252).profitFactor).toBe(Infinity);
  });
});

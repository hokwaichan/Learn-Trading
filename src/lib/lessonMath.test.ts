import { describe, expect, it } from 'vitest';
import type { GlossaryEntry } from '@/types';
import { buildMatcher, linkGlossary } from './glossaryLinker';
import { bsGreeks, bsPrice, intrinsicValue, normCdf, type BsInput } from './pricing/blackScholes';
import { breakEvens, payoffCurve, payoffExtremes, strategyPnlAtExpiry, type PayoffLeg } from './pricing/payoff';
import { breakEvenWinRate, expectancy, leveragedOutcome, positionSize, recoveryGain, riskReward } from './trading/sizing';

describe('normCdf', () => {
  it('matches standard normal table values', () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 15);
    expect(normCdf(1)).toBeCloseTo(0.8413447460685429, 12);
    expect(normCdf(-1)).toBeCloseTo(0.15865525393145707, 12);
    expect(normCdf(1.96)).toBeCloseTo(0.9750021048517795, 12);
    expect(normCdf(-3)).toBeCloseTo(0.0013498980316301, 12);
    expect(normCdf(8)).toBeCloseTo(1, 14);
    expect(normCdf(-40)).toBe(0);
  });
});

describe('Black-Scholes', () => {
  // Hull, "Options, Futures, and Other Derivatives", Example 15.6:
  // S = 42, K = 40, r = 10%, sigma = 20%, T = 0.5 -> call 4.76, put 0.81.
  const hull = { spot: 42, strike: 40, years: 0.5, volatility: 0.2, rate: 0.1 };
  // The standard at-the-money textbook case.
  const atm = { spot: 100, strike: 100, years: 1, volatility: 0.2, rate: 0.05 };

  it('prices the Hull textbook example', () => {
    expect(bsPrice({ type: 'call', ...hull })).toBeCloseTo(4.76, 2);
    expect(bsPrice({ type: 'put', ...hull })).toBeCloseTo(0.81, 2);
  });

  it('prices the at-the-money reference case', () => {
    expect(bsPrice({ type: 'call', ...atm })).toBeCloseTo(10.4506, 4);
    expect(bsPrice({ type: 'put', ...atm })).toBeCloseTo(5.5735, 4);
  });

  it('gives the reference Greeks for the at-the-money case', () => {
    const call = bsGreeks({ type: 'call', ...atm });
    expect(call.delta).toBeCloseTo(0.6368, 4);
    expect(call.gamma).toBeCloseTo(0.018762, 5);
    expect(call.vega).toBeCloseTo(0.37524, 4);
    expect(call.theta).toBeCloseTo(-6.414 / 365, 4);
    expect(call.rho).toBeCloseTo(0.53232, 4);
    const put = bsGreeks({ type: 'put', ...atm });
    expect(put.delta).toBeCloseTo(-0.3632, 4);
    expect(put.gamma).toBeCloseTo(call.gamma, 12);
    expect(put.vega).toBeCloseTo(call.vega, 12);
    expect(put.theta).toBeCloseTo(-1.658 / 365, 4);
    expect(put.rho).toBeCloseTo(-0.41890, 4);
  });

  it.each([
    [{ spot: 100, strike: 90, years: 0.25, volatility: 0.35, rate: 0.03 }],
    [{ spot: 50, strike: 65, years: 2, volatility: 0.6, rate: 0.01 }],
    [{ spot: 67000, strike: 70000, years: 30 / 365, volatility: 0.55, rate: 0.04 }],
    [{ spot: 100, strike: 100, years: 1, volatility: 0.2, rate: 0.05, dividendYield: 0.02 }],
  ])('satisfies put-call parity: C - P = S e^(-qT) - K e^(-rT)', (params) => {
    const call = bsPrice({ type: 'call', ...params });
    const put = bsPrice({ type: 'put', ...params });
    const q = (params as BsInput).dividendYield ?? 0;
    const forward = params.spot * Math.exp(-q * params.years) - params.strike * Math.exp(-params.rate * params.years);
    expect(call - put).toBeCloseTo(forward, 8);
  });

  it('Greeks agree with finite differences of the price', () => {
    const base: BsInput = { type: 'put', spot: 105, strike: 100, years: 0.4, volatility: 0.3, rate: 0.04 };
    const g = bsGreeks(base);
    const bump = (patch: Partial<BsInput>) => bsPrice({ ...base, ...patch });
    const h = 0.01;
    expect(g.delta).toBeCloseTo((bump({ spot: 105 + h }) - bump({ spot: 105 - h })) / (2 * h), 5);
    expect(g.gamma).toBeCloseTo((bump({ spot: 105 + h }) - 2 * bump({}) + bump({ spot: 105 - h })) / (h * h), 4);
    expect(g.vega).toBeCloseTo((bump({ volatility: 0.3001 }) - bump({ volatility: 0.2999 })) / 0.0002 / 100, 5);
    expect(g.rho).toBeCloseTo((bump({ rate: 0.0401 }) - bump({ rate: 0.0399 })) / 0.0002 / 100, 5);
    const day = 1 / 365;
    expect(g.theta).toBeCloseTo(bump({ years: 0.4 - day }) - bump({}), 3);
  });

  it('is worth intrinsic value at expiry or with no volatility', () => {
    expect(bsPrice({ type: 'call', spot: 110, strike: 100, years: 0, volatility: 0.2, rate: 0.05 })).toBe(10);
    expect(bsPrice({ type: 'put', spot: 110, strike: 100, years: 0, volatility: 0.2, rate: 0.05 })).toBe(0);
    expect(bsGreeks({ type: 'call', spot: 110, strike: 100, years: 0, volatility: 0.2, rate: 0.05 }).delta).toBe(1);
    expect(intrinsicValue('put', 90, 100)).toBe(10);
  });

  it('is worth more with more time and more volatility', () => {
    const base: BsInput = { type: 'call', ...atm };
    expect(bsPrice({ ...base, years: 2 })).toBeGreaterThan(bsPrice(base));
    expect(bsPrice({ ...base, volatility: 0.4 })).toBeGreaterThan(bsPrice(base));
  });
});

describe('payoff at expiry', () => {
  const longCall: PayoffLeg = { kind: 'option', direction: 1, quantity: 1, type: 'call', strike: 100, entryPrice: 5 };
  const shortCall: PayoffLeg = { ...longCall, direction: -1 };
  const longPut: PayoffLeg = { kind: 'option', direction: 1, quantity: 1, type: 'put', strike: 100, entryPrice: 4 };
  const stock: PayoffLeg = { kind: 'stock', direction: 1, quantity: 1, entryPrice: 100 };

  it('long call: loses the premium below the strike, breaks even at strike + premium', () => {
    expect(strategyPnlAtExpiry([longCall], 90)).toBe(-5);
    expect(strategyPnlAtExpiry([longCall], 105)).toBe(0);
    expect(strategyPnlAtExpiry([longCall], 120)).toBe(15);
    expect(breakEvens([longCall], 50, 150)).toEqual([105]);
    expect(payoffExtremes([longCall])).toEqual({ maxProfit: 'unlimited', maxLoss: 5 });
  });

  it('short (uncovered) call: keeps the premium at best, unlimited loss', () => {
    expect(payoffExtremes([shortCall])).toEqual({ maxProfit: 5, maxLoss: 'unlimited' });
  });

  it('long put: profit capped by price reaching zero', () => {
    expect(payoffExtremes([longPut])).toEqual({ maxProfit: 96, maxLoss: 4 });
    expect(breakEvens([longPut], 50, 150)[0]).toBeCloseTo(96, 6);
  });

  it('covered call: stock plus a sold call caps the upside', () => {
    const covered = [stock, { ...shortCall, strike: 110, entryPrice: 3 }];
    expect(strategyPnlAtExpiry(covered, 130)).toBe(13);
    expect(payoffExtremes(covered)).toEqual({ maxProfit: 13, maxLoss: 97 });
    expect(breakEvens(covered, 50, 150)[0]).toBeCloseTo(97, 6);
  });

  it('bull call spread: both sides limited', () => {
    const spread = [longCall, { ...shortCall, strike: 110, entryPrice: 2 }];
    expect(payoffExtremes(spread)).toEqual({ maxProfit: 7, maxLoss: 3 });
    expect(breakEvens(spread, 50, 150)[0]).toBeCloseTo(103, 6);
  });

  it('long straddle: two break-evens, strike plus and minus the total premium', () => {
    const straddle = [longCall, longPut];
    const [low, high] = breakEvens(straddle, 50, 150);
    expect(low).toBeCloseTo(91, 6);
    expect(high).toBeCloseTo(109, 6);
    expect(payoffExtremes(straddle)).toEqual({ maxProfit: 'unlimited', maxLoss: 9 });
  });

  it('iron condor: profit is the net credit, loss is the wing width minus the credit', () => {
    const condor: PayoffLeg[] = [
      { kind: 'option', direction: 1, quantity: 1, type: 'put', strike: 85, entryPrice: 1 },
      { kind: 'option', direction: -1, quantity: 1, type: 'put', strike: 90, entryPrice: 2.5 },
      { kind: 'option', direction: -1, quantity: 1, type: 'call', strike: 110, entryPrice: 2.5 },
      { kind: 'option', direction: 1, quantity: 1, type: 'call', strike: 115, entryPrice: 1 },
    ];
    expect(payoffExtremes(condor)).toEqual({ maxProfit: 3, maxLoss: 2 });
    const [low, high] = breakEvens(condor, 50, 150);
    expect(low).toBeCloseTo(87, 6);
    expect(high).toBeCloseTo(113, 6);
  });

  it('respects quantity and contract multiplier, and includes strikes in the curve', () => {
    expect(strategyPnlAtExpiry([{ ...longCall, quantity: 2, multiplier: 100 }], 120)).toBe(3000);
    expect(payoffCurve([longCall], 50, 150, 7).some((p) => p.price === 100)).toBe(true);
  });
});

describe('position sizing and risk maths', () => {
  it('sizes a long so the stop loses exactly the chosen share of the account', () => {
    const r = positionSize({ equity: 10_000, riskFraction: 0.01, entry: 50, stop: 48 })!;
    expect(r.riskAmount).toBe(100);
    expect(r.stopDistance).toBe(2);
    expect(r.quantity).toBe(50);
    expect(r.positionValue).toBe(2500);
    expect(r.leverageNeeded).toBe(0.25);
    expect(r.direction).toBe('long');
    expect(r.quantity * r.stopDistance).toBe(r.riskAmount);
  });

  it('detects a short from a stop above the entry, and flags when leverage is needed', () => {
    const r = positionSize({ equity: 10_000, riskFraction: 0.02, entry: 100, stop: 100.5 })!;
    expect(r.direction).toBe('short');
    expect(r.quantity).toBe(400);
    expect(r.leverageNeeded).toBe(4);
  });

  it('rejects inputs that are not a real trade', () => {
    expect(positionSize({ equity: 10_000, riskFraction: 0.01, entry: 50, stop: 50 })).toBeNull();
    expect(positionSize({ equity: 0, riskFraction: 0.01, entry: 50, stop: 48 })).toBeNull();
    expect(positionSize({ equity: 10_000, riskFraction: 0, entry: 50, stop: 48 })).toBeNull();
  });

  it('computes risk/reward only when the target is on the right side', () => {
    expect(riskReward(100, 95, 115)).toBe(3);
    expect(riskReward(100, 105, 90)).toBe(2);
    expect(riskReward(100, 95, 90)).toBeNull();
    expect(riskReward(100, 100, 110)).toBeNull();
  });

  it('computes expectancy and the break-even win rate', () => {
    expect(expectancy(0.4, 2)).toBeCloseTo(0.2, 12);
    expect(expectancy(0.6, 0.5)).toBeCloseTo(-0.1, 12);
    expect(breakEvenWinRate(2)).toBeCloseTo(1 / 3, 12);
    expect(breakEvenWinRate(1)).toBe(0.5);
    expect(expectancy(breakEvenWinRate(3), 3)).toBeCloseTo(0, 12);
  });

  it('shows why drawdowns are hard to recover from', () => {
    expect(recoveryGain(0.1)).toBeCloseTo(0.1111, 4);
    expect(recoveryGain(0.5)).toBe(1);
    expect(recoveryGain(0.9)).toBeCloseTo(9, 10);
    expect(recoveryGain(1)).toBe(Infinity);
  });

  it('magnifies gains and losses by the leverage, and wipes out at 1 / leverage', () => {
    expect(leveragedOutcome(1000, 10, 0.05)).toMatchObject({ positionValue: 10_000, pnl: 500, returnOnMargin: 0.5, liquidated: false });
    expect(leveragedOutcome(1000, 10, -0.05).returnOnMargin).toBe(-0.5);
    expect(leveragedOutcome(1000, 10, -0.1)).toMatchObject({ pnl: -1000, liquidated: true, wipeoutMove: 0.1 });
    expect(leveragedOutcome(1000, 10, -0.3).pnl).toBe(-1000);
    expect(leveragedOutcome(1000, 5, 0.04, 'short').pnl).toBe(-200);
  });
});

describe('glossary auto-linking', () => {
  const entries: GlossaryEntry[] = [
    { id: 'stop-loss', term: 'Stop-loss', aliases: ['stop loss'], definition: '', seeAlso: [] },
    { id: 'short', term: 'Short', aliases: ['shorting'], definition: '', seeAlso: [] },
    { id: 'stop-order', term: 'Stop order', aliases: [], definition: '', seeAlso: [] },
    { id: 'pnl', term: 'P&L', aliases: [], definition: '', seeAlso: [] },
  ];
  const matcher = buildMatcher(entries);
  const link = (text: string, seen?: Set<string>) => linkGlossary(text, matcher, seen);

  it('links a term and keeps the original capitalisation', () => {
    expect(link('Place a Stop-Loss first.')).toEqual([
      { type: 'text', text: 'Place a ' },
      { type: 'term', text: 'Stop-Loss', id: 'stop-loss' },
      { type: 'text', text: ' first.' },
    ]);
  });

  it('matches aliases and terms with punctuation', () => {
    expect(link('your stop loss and your P&L').filter((s) => s.type === 'term')).toEqual([
      { type: 'term', text: 'stop loss', id: 'stop-loss' },
      { type: 'term', text: 'P&L', id: 'pnl' },
    ]);
  });

  it('does not match inside longer words', () => {
    expect(link('Shortly after, a shortfall.')).toEqual([{ type: 'text', text: 'Shortly after, a shortfall.' }]);
    expect(link('a non-stop-loss thing').some((s) => s.type === 'term')).toBe(false);
  });

  it('prefers the longest phrase', () => {
    expect(link('use a stop order here').find((s) => s.type === 'term')).toEqual({ type: 'term', text: 'stop order', id: 'stop-order' });
  });

  it('links each term only the first time, across calls that share `seen`', () => {
    const seen = new Set<string>();
    expect(link('Go short, then short again.', seen).filter((s) => s.type === 'term')).toHaveLength(1);
    expect(link('Still short.', seen).filter((s) => s.type === 'term')).toHaveLength(0);
  });

  it('marks bold text and does not link inside it', () => {
    expect(link('This is **short and important** text.')).toEqual([
      { type: 'text', text: 'This is ' },
      { type: 'bold', text: 'short and important' },
      { type: 'text', text: ' text.' },
    ]);
  });

  it('links terms in Chinese text, which has no spaces between words', () => {
    const zh = buildMatcher([
      { id: 'stop-loss', term: '止蝕', aliases: ['Stop-loss'], definition: '', seeAlso: [] },
      { id: 'rsi', term: '相對強弱指數', aliases: ['RSI'], definition: '', seeAlso: [] },
    ]);
    expect(linkGlossary('先設好止蝕，再看RSI是否升穿70。', zh).filter((s) => s.type === 'term')).toEqual([
      { type: 'term', text: '止蝕', id: 'stop-loss' },
      { type: 'term', text: 'RSI', id: 'rsi' },
    ]);
    // An English phrase still needs a boundary on its English side.
    expect(linkGlossary('RSIX 指標', zh).some((s) => s.type === 'term')).toBe(false);
  });

  it('handles an empty glossary', () => {
    expect(linkGlossary('nothing to link', buildMatcher([]))).toEqual([{ type: 'text', text: 'nothing to link' }]);
  });
});

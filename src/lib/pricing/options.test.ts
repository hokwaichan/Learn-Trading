import { describe, expect, it } from 'vitest';
import { createAccount } from '@/lib/trading/account';
import { equityOf, marginUsed, type EngineContext } from '@/lib/trading/engine';
import { closeOptionPosition, markOptionPositions, openOptionPosition, settleExpiredOptions, validateStrategy } from '@/lib/trading/options';
import type { OptionLeg, Strategy } from '@/types';
import { bsPrice, normCdf } from './blackScholes';
import { buildChain, chainExpiries, contractId, nextFriday, quoteContract, simulatedSpread, smileVolatility } from './chain';
import { draftToStrategy, nearestStrike, quoteFor, templateToDrafts } from './draft';
import { historicalVolatility, impliedVolatility } from './impliedVol';
import { analyzeStrategy, entryValue, hasSingleExpiry, marginRequirement, netPremium, probabilityOfProfit, strategyGreeks, strategyPnl, strategyValue } from './strategy';

const DAY = 86_400_000;
// Monday 5 January 2026, 12:00 UTC.
const NOW = Date.UTC(2026, 0, 5, 12);
const RATE = 0.04;
const IN_30_DAYS = NOW + 30 * DAY;

/** A leg priced by the model at a spot of 100 and 30% volatility. */
function leg(type: 'call' | 'put', side: 'buy' | 'sell', strike: number, opts: { quantity?: number; expiry?: number; multiplier?: number; iv?: number; price?: number } = {}): OptionLeg {
  const { quantity = 1, expiry = IN_30_DAYS, multiplier = 1, iv = 0.3 } = opts;
  const price = opts.price ?? bsPrice({ type, spot: 100, strike, years: (expiry - NOW) / DAY / 365, volatility: iv, rate: RATE });
  return {
    id: `${side}-${type}-${strike}-${expiry}`,
    contract: { id: contractId('TEST', expiry, strike, type), underlying: 'TEST', type, strike, expiry, style: 'european', multiplier },
    side,
    quantity,
    entryPrice: price,
    entryIv: iv,
  };
}
const strategy = (legs: OptionLeg[], stock?: Strategy['stock'], name = 'Test'): Strategy => ({ id: `s-${legs.map((l) => l.id).join('|')}`, name, underlying: 'TEST', legs, stock, createdAt: NOW });

describe('put-call parity', () => {
  it('holds for every strike, time and volatility: C - P = S - K e^(-rT)', () => {
    for (const strike of [60, 90, 100, 110, 150]) {
      for (const years of [1 / 365, 0.1, 0.5, 2]) {
        for (const volatility of [0.05, 0.3, 1.2]) {
          const input = { spot: 100, strike, years, volatility, rate: 0.05 };
          const call = bsPrice({ ...input, type: 'call' });
          const put = bsPrice({ ...input, type: 'put' });
          expect(call - put).toBeCloseTo(100 - strike * Math.exp(-0.05 * years), 9);
        }
      }
    }
  });

  it('holds with a dividend yield: C - P = S e^(-qT) - K e^(-rT)', () => {
    const input = { spot: 100, strike: 105, years: 0.75, volatility: 0.25, rate: 0.05, dividendYield: 0.02 };
    const diff = bsPrice({ ...input, type: 'call' }) - bsPrice({ ...input, type: 'put' });
    expect(diff).toBeCloseTo(100 * Math.exp(-0.02 * 0.75) - 105 * Math.exp(-0.05 * 0.75), 10);
  });
});

describe('implied volatility', () => {
  it('recovers the volatility a price was made with', () => {
    for (const type of ['call', 'put'] as const) {
      for (const strike of [70, 95, 100, 105, 140]) {
        for (const volatility of [0.08, 0.2, 0.65, 1.5]) {
          const input = { type, spot: 100, strike, years: 0.25, rate: 0.03 };
          const price = bsPrice({ ...input, volatility });
          // Where volatility barely affects the price (far in or out of the money at low volatility) it cannot be read back.
          if (price - bsPrice({ ...input, volatility: 1e-4 }) < 1e-4) continue;
          expect(impliedVolatility(input, price)).toBeCloseTo(volatility, 5);
        }
      }
    }
  });

  it('matches the Hull example: a call at 4.76 implies 20%', () => {
    // Hull, Options, Futures and Other Derivatives: S=42, K=40, r=10%, T=0.5, sigma=20% gives c = 4.76.
    const iv = impliedVolatility({ type: 'call', spot: 42, strike: 40, years: 0.5, rate: 0.1 }, 4.76)!;
    expect(iv).toBeCloseTo(0.2, 2);
  });

  it('returns null when no volatility fits', () => {
    const input = { type: 'call' as const, spot: 100, strike: 90, years: 0.5, rate: 0.05 };
    // Below the value with no volatility at all (100 - 90 e^(-rT) = 12.22).
    expect(impliedVolatility(input, 11)).toBeNull();
    // A call can never be worth more than the underlying.
    expect(impliedVolatility(input, 101)).toBeNull();
    expect(impliedVolatility(input, 0)).toBeNull();
    expect(impliedVolatility({ ...input, years: 0 }, 12)).toBeNull();
  });
});

describe('historical volatility', () => {
  it('annualises the standard deviation of log returns', () => {
    // Alternating +1% and -1% log returns: sample standard deviation about 1.0541%.
    const closes = [100];
    for (let i = 0; i < 10; i++) closes.push(closes[i] * Math.exp(i % 2 === 0 ? 0.01 : -0.01));
    const hv = historicalVolatility(closes.map((close) => ({ close })), 365)!;
    expect(hv).toBeCloseTo(Math.sqrt((10 * 0.01 ** 2) / 9) * Math.sqrt(365), 10);
  });

  it('is zero for a price that never moves and null with too little data', () => {
    expect(historicalVolatility(Array.from({ length: 20 }, () => ({ close: 50 })), 252)).toBe(0);
    expect(historicalVolatility([{ close: 1 }, { close: 2 }], 252)).toBeNull();
  });

  it('uses only the most recent candles', () => {
    const quiet = Array.from({ length: 50 }, () => ({ close: 100 }));
    const wild = Array.from({ length: 31 }, (_, i) => ({ close: i % 2 ? 110 : 100 }));
    expect(historicalVolatility([...wild, ...quiet], 365, 30)).toBe(0);
    expect(historicalVolatility([...quiet, ...wild], 365, 30)!).toBeGreaterThan(1);
  });
});

describe('simulated chain', () => {
  it('puts expiries on Fridays at 08:00 UTC, in order, none repeated', () => {
    const expiries = chainExpiries(NOW);
    expect(expiries).toHaveLength(5);
    for (const e of expiries) {
      expect(new Date(e).getUTCDay()).toBe(5);
      expect(new Date(e).getUTCHours()).toBe(8);
      expect(e).toBeGreaterThan(NOW + DAY);
    }
    expect([...expiries].sort((a, b) => a - b)).toEqual(expiries);
    expect(new Set(expiries).size).toBe(5);
    // The first Friday after Monday 5 January is the 9th.
    expect(new Date(expiries[0]).toISOString()).toBe('2026-01-09T08:00:00.000Z');
    expect(expiries[4] - NOW).toBeGreaterThan(80 * DAY);
  });

  it('finds the next Friday, including later the same day', () => {
    const friday = Date.UTC(2026, 0, 9, 8);
    expect(nextFriday(Date.UTC(2026, 0, 9, 7))).toBe(friday);
    expect(nextFriday(friday)).toBe(friday);
    expect(nextFriday(Date.UTC(2026, 0, 9, 9))).toBe(friday + 7 * DAY);
  });

  it('builds strikes around the price with the nearest one marked', () => {
    const chain = buildChain({ underlying: 'TEST', spot: 103.2, volatility: 0.4, now: NOW, rate: RATE, multiplier: 100 });
    expect(chain).toHaveLength(5);
    const rows = chain[2].rows;
    expect(rows).toHaveLength(25);
    // Strikes are 2.50 apart at this price.
    expect(rows.filter((r) => r.atm).map((r) => r.strike)).toEqual([102.5]);
    expect(rows[13].strike - rows[12].strike).toBe(2.5);
    expect(rows[0].strike).toBeLessThan(rows[24].strike);
    expect(rows[12].call.contract).toMatchObject({ underlying: 'TEST', type: 'call', strike: 102.5, multiplier: 100, style: 'european' });
    expect(rows[12].call.contract.id).toMatch(/^TEST-\d{8}-102\.5-C$/);
  });

  it('prices each quote by Black-Scholes at its own volatility, with a spread around it', () => {
    const [{ rows, days }] = buildChain({ underlying: 'TEST', spot: 100, volatility: 0.4, now: NOW, rate: RATE, multiplier: 1 }).slice(2);
    for (const row of rows) {
      for (const quote of [row.call, row.put]) {
        const model = bsPrice({ type: quote.contract.type, spot: 100, strike: row.strike, years: days / 365, volatility: quote.iv, rate: RATE });
        expect(quote.mid).toBeCloseTo(model, 10);
        expect(quote.bid).toBeLessThanOrEqual(quote.mid + 0.005);
        expect(quote.ask).toBeGreaterThanOrEqual(quote.mid - 0.005);
        expect(quote.ask).toBeGreaterThan(quote.bid);
        expect(quote.simulated).toBe(true);
        // The solver gets the same volatility back from the mid price.
        if (quote.mid > 0.01) expect(impliedVolatility({ type: quote.contract.type, spot: 100, strike: row.strike, years: days / 365, rate: RATE }, quote.mid)).toBeCloseTo(quote.iv, 4);
      }
      // Calls gain and puts lose as the strike falls.
      expect(row.call.greeks.delta).toBeGreaterThan(0);
      expect(row.put.greeks.delta).toBeLessThan(0);
    }
    expect(rows[0].call.moneyness).toBe('ITM');
    expect(rows[0].put.moneyness).toBe('OTM');
    expect(rows[12].call.moneyness).toBe('ATM');
  });

  it('gives a smile: volatility is lowest near the money and higher for low strikes', () => {
    const at = smileVolatility(0.4, 100, 100, 0.1);
    expect(at).toBeCloseTo(0.4, 10);
    expect(smileVolatility(0.4, 100, 80, 0.1)).toBeGreaterThan(smileVolatility(0.4, 100, 120, 0.1));
    expect(smileVolatility(0.4, 100, 120, 0.1)).toBeGreaterThan(at);
    // Never more than double or less than 60% of the base.
    expect(smileVolatility(0.4, 100, 10, 0.01)).toBeCloseTo(0.8, 10);
  });

  it('never quotes below zero and widens the spread with price', () => {
    expect(simulatedSpread(0.001, 0.01)).toBe(0.01);
    expect(simulatedSpread(50, 0.01)).toBeCloseTo(1, 10);
    const far = quoteContract({ id: 'x', underlying: 'TEST', type: 'call', strike: 500, expiry: NOW + 7 * DAY, style: 'european', multiplier: 1 }, 100, 0.2, NOW, RATE);
    expect(far.bid).toBe(0);
    expect(far.ask).toBeGreaterThan(0);
  });

  it('returns nothing without a price or a volatility', () => {
    expect(buildChain({ underlying: 'TEST', spot: 0, volatility: 0.4, now: NOW, rate: RATE, multiplier: 1 })).toEqual([]);
    expect(buildChain({ underlying: 'TEST', spot: 100, volatility: 0, now: NOW, rate: RATE, multiplier: 1 })).toEqual([]);
  });
});

describe('strategy analysis', () => {
  it('long call: debit, limited loss, unlimited profit, break-even at strike + premium', () => {
    const call = leg('call', 'buy', 100, { price: 4 });
    const a = analyzeStrategy(strategy([call]), { spot: 100, now: NOW, rate: RATE })!;
    expect(a.netPremium).toBe(-4);
    expect(a.maxLoss).toBe(4);
    expect(a.maxProfit).toBe('unlimited');
    expect(a.breakEvens).toHaveLength(1);
    expect(a.breakEvens[0]).toBeCloseTo(104, 6);
    expect(a.mixedExpiries).toBe(false);
    expect(a.payoffAtExpiry.find((p) => p.price === 100)?.pnl).toBeCloseTo(-4, 10);
  });

  it('respects the contract multiplier and quantity', () => {
    const s = strategy([leg('call', 'buy', 100, { price: 4, quantity: 2, multiplier: 100 })]);
    expect(netPremium(s)).toBe(-800);
    expect(entryValue(s)).toBe(800);
    expect(analyzeStrategy(s, { spot: 100, now: NOW, rate: RATE })!.maxLoss).toBe(800);
  });

  it('bull call spread: both sides limited', () => {
    const s = strategy([leg('call', 'buy', 100, { price: 5 }), leg('call', 'sell', 110, { price: 2 })]);
    const a = analyzeStrategy(s, { spot: 100, now: NOW, rate: RATE })!;
    expect(a.netPremium).toBe(-3);
    expect(a.maxLoss).toBe(3);
    expect(a.maxProfit).toBe(7);
    expect(a.breakEvens[0]).toBeCloseTo(103, 6);
  });

  it('iron condor: a credit, with the loss capped by the wings', () => {
    const s = strategy([leg('put', 'buy', 85, { price: 0.5 }), leg('put', 'sell', 90, { price: 1.5 }), leg('call', 'sell', 110, { price: 1.5 }), leg('call', 'buy', 115, { price: 0.5 })]);
    const a = analyzeStrategy(s, { spot: 100, now: NOW, rate: RATE })!;
    expect(a.netPremium).toBe(2);
    expect(a.maxProfit).toBe(2);
    expect(a.maxLoss).toBe(3);
    expect(a.breakEvens.map((b) => Math.round(b))).toEqual([88, 112]);
  });

  it('covered call: the stock leg caps the upside and adds one delta per share', () => {
    const s = strategy([leg('call', 'sell', 105, { price: 2, multiplier: 100 })], { side: 'buy', quantity: 100, entryPrice: 100 });
    const a = analyzeStrategy(s, { spot: 100, now: NOW, rate: RATE })!;
    expect(a.maxProfit).toBe(700);
    expect(a.maxLoss).toBe(9800);
    expect(entryValue(s)).toBe(9800);
    expect(a.greeks.delta).toBeGreaterThan(0);
    expect(a.greeks.delta).toBeLessThan(100);
  });

  it('uncovered short call: unlimited loss', () => {
    const a = analyzeStrategy(strategy([leg('call', 'sell', 100, { price: 4 })]), { spot: 100, now: NOW, rate: RATE })!;
    expect(a.maxLoss).toBe('unlimited');
    expect(a.maxProfit).toBe(4);
  });

  it('values a strategy at its entry cost on the day it is opened, and at exercise value at expiry', () => {
    const s = strategy([leg('call', 'buy', 100), leg('put', 'buy', 100)]);
    expect(strategyValue(s, 100, NOW, RATE)).toBeCloseTo(entryValue(s), 10);
    expect(strategyPnl(s, 100, NOW, RATE)).toBeCloseTo(0, 10);
    expect(strategyValue(s, 112, IN_30_DAYS, RATE)).toBeCloseTo(12, 10);
    expect(strategyValue(s, 91, IN_30_DAYS, RATE)).toBeCloseTo(9, 10);
  });

  it('shows time decay: a long straddle is worth less each day at the same price', () => {
    const s = strategy([leg('call', 'buy', 100), leg('put', 'buy', 100)]);
    const today = strategyPnl(s, 100, NOW, RATE);
    const later = strategyPnl(s, 100, NOW + 15 * DAY, RATE);
    const atExpiry = strategyPnl(s, 100, IN_30_DAYS, RATE);
    expect(later).toBeLessThan(today);
    expect(atExpiry).toBeLessThan(later);
    expect(atExpiry).toBeCloseTo(-entryValue(s), 10);
    // Theta says the same thing: negative for an option buyer.
    expect(strategyGreeks(s, 100, NOW, RATE).theta).toBeLessThan(0);
  });

  it('shows vega: more volatility makes a long straddle worth more', () => {
    const s = strategy([leg('call', 'buy', 100), leg('put', 'buy', 100)]);
    const up = strategyPnl(s, 100, NOW, RATE, () => 0.4);
    expect(up).toBeGreaterThan(0);
    // Close to vega times the ten-point change.
    expect(up).toBeCloseTo(strategyGreeks(s, 100, NOW, RATE).vega * 10, 0);
    expect(strategyPnl(s, 100, NOW, RATE, () => 0.2)).toBeLessThan(0);
  });

  it('adds Greeks across legs with their signs', () => {
    const long = strategyGreeks(strategy([leg('call', 'buy', 100)]), 100, NOW, RATE);
    const short = strategyGreeks(strategy([leg('call', 'sell', 100)]), 100, NOW, RATE);
    expect(short.delta).toBeCloseTo(-long.delta, 12);
    expect(short.theta).toBeCloseTo(-long.theta, 12);
    // Buying and selling the same contract cancels out.
    const flat = strategyGreeks(strategy([leg('call', 'buy', 100), { ...leg('call', 'sell', 100), id: 'other' }]), 100, NOW, RATE);
    expect(flat.delta).toBeCloseTo(0, 12);
    expect(flat.vega).toBeCloseTo(0, 12);
    // The curve on a later date uses the chosen date.
    const a = analyzeStrategy(strategy([leg('call', 'buy', 100)]), { spot: 100, now: NOW, rate: RATE, at: NOW + 20 * DAY })!;
    const b = analyzeStrategy(strategy([leg('call', 'buy', 100)]), { spot: 100, now: NOW, rate: RATE })!;
    const mid = (x: typeof a) => x.payoffAtDate.find((p) => p.price === 100)!.pnl;
    expect(mid(a)).toBeLessThan(mid(b));
  });

  it('handles legs with different expiries: a calendar spread peaks at the strike', () => {
    const s = strategy([leg('call', 'sell', 100), leg('call', 'buy', 100, { expiry: NOW + 90 * DAY })]);
    expect(hasSingleExpiry(s)).toBe(false);
    const a = analyzeStrategy(s, { spot: 100, now: NOW, rate: RATE })!;
    expect(a.mixedExpiries).toBe(true);
    const best = a.payoffAtExpiry.reduce((x, y) => (y.pnl > x.pnl ? y : x));
    expect(best.price).toBeCloseTo(100, 0);
    expect(a.maxProfit).toBeGreaterThan(0);
    // The most it can lose is about what it cost.
    expect(a.maxLoss as number).toBeLessThanOrEqual(entryValue(s) + 1e-9);
    expect(a.breakEvens).toHaveLength(2);
  });

  it('returns null for an empty strategy', () => {
    expect(analyzeStrategy(strategy([]), { spot: 100, now: NOW, rate: RATE })).toBeNull();
  });
});

describe('probability of profit', () => {
  const years = 30 / 365;
  const d2 = (strike: number) => (Math.log(100 / strike) + (RATE - 0.3 ** 2 / 2) * years) / (0.3 * Math.sqrt(years));

  it('for a long call is the chance of finishing above the break-even', () => {
    const call = leg('call', 'buy', 100, { price: 4 });
    expect(probabilityOfProfit(strategy([call]), 100, NOW, RATE, 0.3)).toBeCloseTo(normCdf(d2(104)), 2);
  });

  it('for a short put is the chance of finishing above strike minus premium', () => {
    const put = leg('put', 'sell', 95, { price: 1.5 });
    expect(probabilityOfProfit(strategy([put]), 100, NOW, RATE, 0.3)).toBeCloseTo(normCdf(d2(93.5)), 2);
  });

  it('for an iron condor is the chance of finishing between the break-evens', () => {
    const s = strategy([leg('put', 'buy', 85, { price: 0.5 }), leg('put', 'sell', 90, { price: 1.5 }), leg('call', 'sell', 110, { price: 1.5 }), leg('call', 'buy', 115, { price: 0.5 })]);
    expect(probabilityOfProfit(s, 100, NOW, RATE, 0.3)).toBeCloseTo(normCdf(d2(88)) - normCdf(d2(112)), 2);
  });

  it('selling and buying the same option are complements', () => {
    const long = probabilityOfProfit(strategy([leg('call', 'buy', 100, { price: 4 })]), 100, NOW, RATE, 0.3)!;
    const short = probabilityOfProfit(strategy([leg('call', 'sell', 100, { price: 4 })]), 100, NOW, RATE, 0.3)!;
    expect(long + short).toBeCloseTo(1, 2);
  });

  it('is null without option legs or a volatility', () => {
    expect(probabilityOfProfit(strategy([]), 100, NOW, RATE, 0.3)).toBeNull();
    expect(probabilityOfProfit(strategy([leg('call', 'buy', 100)]), 100, NOW, RATE, 0)).toBeNull();
  });
});

describe('margin for a strategy', () => {
  it('is the most a limited-risk strategy can lose', () => {
    expect(marginRequirement(strategy([leg('call', 'buy', 100, { price: 4, multiplier: 100 })]), 100)).toBe(400);
    expect(marginRequirement(strategy([leg('call', 'sell', 100, { price: 5 }), leg('call', 'buy', 110, { price: 2 })]), 100)).toBe(7);
    // A cash-secured put: the strike less the premium.
    expect(marginRequirement(strategy([leg('put', 'sell', 95, { price: 1.5, multiplier: 100 })]), 100)).toBe(9350);
  });

  it('for an uncovered short call is 20% of the underlying plus the premium', () => {
    expect(marginRequirement(strategy([leg('call', 'sell', 100, { price: 4, multiplier: 100 })]), 100)).toBeCloseTo(0.2 * 100 * 100 + 400, 10);
  });

  it('for a calendar spread is what it cost', () => {
    const s = strategy([leg('call', 'sell', 100), leg('call', 'buy', 100, { expiry: NOW + 90 * DAY })]);
    expect(marginRequirement(s, 100)).toBeCloseTo(entryValue(s), 10);
  });
});

describe('options paper trading', () => {
  function context(overrides: Partial<EngineContext> = {}): EngineContext {
    let n = 0;
    return { now: NOW, feeRate: 0, slippagePct: 0, newId: () => `id${++n}`, ...overrides };
  }
  const fresh = () => createAccount('main', NOW);
  const longCall = () => strategy([leg('call', 'buy', 100, { price: 4, multiplier: 100 })], undefined, 'Long call');
  const open = (s: Strategy, ctx = context()) => openOptionPosition(fresh(), s, 100, {}, ctx, RATE);

  it('opens a strategy as one position without moving cash, and ties up its margin', () => {
    const { account, events } = open(longCall());
    expect(events.map((e) => e.type)).toEqual(['order_filled', 'position_opened']);
    expect(account.cash).toBe(10_000);
    const [p] = account.positions;
    expect(p).toMatchObject({ kind: 'option', quantity: 1, entryPrice: 400, initialRisk: 400 });
    expect(p.option!.margin).toBe(400);
    expect(marginUsed(account, {})).toBe(400);
    // Valued at the model price: 4.00 was above the model, so it starts a little under water.
    const model = bsPrice({ type: 'call', spot: 100, strike: 100, years: 30 / 365 - 4 / 24 / 365, volatility: 0.3, rate: RATE }) * 100;
    expect(p.option!.markValue).toBeCloseTo(strategyValue(longCall(), 100, NOW, RATE), 10);
    expect(equityOf(account, {})).toBeCloseTo(10_000 + p.option!.markValue - 400, 10);
    expect(Math.abs(p.option!.markValue - model)).toBeLessThan(5);
  });

  it('charges the fee on the premium', () => {
    const { account } = open(longCall(), context({ feeRate: 0.001 }));
    expect(account.cash).toBeCloseTo(10_000 - 0.4, 10);
    expect(account.positions[0].feesPaid).toBeCloseTo(0.4, 10);
  });

  it('refuses a strategy the account cannot cover', () => {
    const big = strategy([leg('put', 'sell', 95, { price: 1.5, multiplier: 100, quantity: 2 })]);
    const { account, events } = open(big);
    expect(events[0]).toMatchObject({ type: 'order_rejected', reason: 'Not enough free funds for this strategy.' });
    expect(account.positions).toHaveLength(0);
  });

  it('refuses a strategy that is empty, too large or already expired', () => {
    expect(validateStrategy(strategy([]), NOW)).toMatch(/at least one/);
    expect(validateStrategy(strategy([85, 90, 95, 100, 105].map((k) => leg('call', 'buy', k))), NOW)).toMatch(/at most 4/);
    expect(validateStrategy(strategy([leg('call', 'buy', 100, { quantity: 0 })]), NOW)).toMatch(/quantity/);
    expect(validateStrategy(longCall(), IN_30_DAYS)).toMatch(/expired/);
    expect(validateStrategy(longCall(), NOW)).toBeNull();
    expect(open(longCall(), context({ now: IN_30_DAYS + 1 })).events[0].type).toBe('order_rejected');
  });

  it('holds several strategies on the same underlying', () => {
    let account = open(longCall()).account;
    account = openOptionPosition(account, strategy([leg('put', 'buy', 95, { price: 2, multiplier: 100 })]), 100, {}, context({ newId: () => `b${Math.random()}` }), RATE).account;
    expect(account.positions).toHaveLength(2);
    expect(marginUsed(account, {})).toBe(600);
  });

  it('marks to the model as price and time move', () => {
    const start = open(longCall()).account;
    const up = markOptionPositions(start, () => 110, NOW + DAY, RATE);
    expect(up.positions[0].option!.markValue).toBeGreaterThan(start.positions[0].option!.markValue);
    expect(up.positions[0].option!.lastMarkedAt).toBe(NOW + DAY);
    expect(equityOf(up, {})).toBeGreaterThan(10_000);
    // Time alone costs a long option money.
    const later = markOptionPositions(start, () => 100, NOW + 20 * DAY, RATE);
    expect(later.positions[0].option!.markValue).toBeLessThan(start.positions[0].option!.markValue);
    // No price for the underlying: left as it was.
    expect(markOptionPositions(start, () => undefined, NOW + DAY, RATE)).toBe(start);
  });

  it('closes early at the model price less half the spread on each leg', () => {
    const start = open(longCall()).account;
    const ctx = context({ now: NOW + DAY });
    const { account } = closeOptionPosition(start, start.positions[0].id, 110, {}, ctx, RATE, 0.01);
    const mid = bsPrice({ type: 'call', spot: 110, strike: 100, years: 29 / 365, volatility: 0.3, rate: RATE });
    const trade = account.trades[0];
    expect(trade.exitPrice).toBeCloseTo((mid - (mid * 0.02) / 2) * 100, 8);
    expect(trade).toMatchObject({ kind: 'option', symbol: 'TEST', label: 'Long call', exitReason: 'manual', entryPrice: 400 });
    expect(trade.netPnl).toBeCloseTo(trade.exitPrice - 400, 8);
    expect(trade.rMultiple).toBeCloseTo(trade.netPnl / 400, 10);
    expect(account.cash).toBeCloseTo(10_000 + trade.netPnl, 8);
    expect(account.positions).toHaveLength(0);
  });

  it('settles at expiry for the exercise value', () => {
    const start = open(longCall()).account;
    const after = context({ now: IN_30_DAYS + 5 * DAY });
    const { account, events } = settleExpiredOptions(start, () => 107, {}, after, RATE);
    const trade = account.trades[0];
    expect(trade.exitReason).toBe('expiry');
    expect(trade.exitPrice).toBeCloseTo(700, 10);
    expect(trade.netPnl).toBeCloseTo(300, 10);
    // Stamped with the expiry, not the day the app noticed.
    expect(trade.closedAt).toBe(IN_30_DAYS);
    expect(account.cash).toBeCloseTo(10_300, 10);
    expect(events[0].type).toBe('trade_closed');
  });

  it('expires worthless for the full premium when out of the money', () => {
    const { account } = settleExpiredOptions(open(longCall()).account, () => 96, {}, context({ now: IN_30_DAYS }), RATE);
    expect(account.trades[0]).toMatchObject({ exitReason: 'expiry', exitPrice: 0, netPnl: -400, rMultiple: -1 });
  });

  it('reports a short leg that finishes in the money as an assignment', () => {
    const spread = strategy([leg('put', 'sell', 95, { price: 2 }), leg('put', 'buy', 90, { price: 0.8 })], undefined, 'Bull put spread');
    const start = open(spread).account;
    expect(start.positions[0].entryPrice).toBeCloseTo(-1.2, 10);
    const kept = settleExpiredOptions(start, () => 97, {}, context({ now: IN_30_DAYS }), RATE).account.trades[0];
    expect(kept).toMatchObject({ exitReason: 'expiry' });
    expect(kept.netPnl).toBeCloseTo(1.2, 10);
    const assigned = settleExpiredOptions(start, () => 92, {}, context({ now: IN_30_DAYS }), RATE).account.trades[0];
    expect(assigned.exitReason).toBe('assignment');
    // Pays 3 on the short put, having collected 1.20.
    expect(assigned.netPnl).toBeCloseTo(-1.8, 10);
    const worst = settleExpiredOptions(start, () => 50, {}, context({ now: IN_30_DAYS }), RATE).account.trades[0];
    expect(worst.netPnl).toBeCloseTo(-3.8, 10);
    expect(worst.rMultiple).toBeCloseTo(-1, 10);
  });

  it('leaves positions alone before expiry or without a price', () => {
    const start = open(longCall()).account;
    expect(settleExpiredOptions(start, () => 107, {}, context({ now: IN_30_DAYS - 1 }), RATE).account).toBe(start);
    expect(settleExpiredOptions(start, () => undefined, {}, context({ now: IN_30_DAYS }), RATE).account).toBe(start);
  });

  it('settles a covered call with its stock leg', () => {
    const covered = strategy([leg('call', 'sell', 105, { price: 2, multiplier: 10 })], { side: 'buy', quantity: 10, entryPrice: 100 });
    const start = open(covered).account;
    expect(start.positions[0].option!.margin).toBe(980);
    const called = settleExpiredOptions(start, () => 120, {}, context({ now: IN_30_DAYS }), RATE).account.trades[0];
    expect(called.exitReason).toBe('assignment');
    // Capped at the strike: (105 - 100 + 2) x 10.
    expect(called.netPnl).toBeCloseTo(70, 10);
  });
});

describe('building a strategy from the chain', () => {
  const chain = buildChain({ underlying: 'TEST', spot: 100, volatility: 0.4, now: NOW, rate: RATE, multiplier: 100 });
  let n = 0;
  const newId = () => `d${++n}`;

  it('pays the ask on bought legs and receives the bid on sold legs', () => {
    const expiry = chain[2].expiry;
    const drafts = [
      { id: 'a', side: 'buy' as const, type: 'call' as const, strike: 100, expiry, quantity: 1 },
      { id: 'b', side: 'sell' as const, type: 'call' as const, strike: 110, expiry, quantity: 1 },
    ];
    const s = draftToStrategy(drafts, null, chain, { id: 's', name: 'Spread', underlying: 'TEST', spot: 100, now: NOW });
    expect(s.legs[0].entryPrice).toBe(quoteFor(chain, drafts[0])!.ask);
    expect(s.legs[1].entryPrice).toBe(quoteFor(chain, drafts[1])!.bid);
    expect(s.legs[0].entryIv).toBe(quoteFor(chain, drafts[0])!.iv);
    expect(s.legs[0].contract.multiplier).toBe(100);
    expect(s.stock).toBeUndefined();
    // Opened and closed at once, the spread is a small loss.
    expect(strategyPnl(s, 100, NOW, RATE)).toBeLessThan(0);
  });

  it('adds a stock leg at the underlying price and drops legs the chain does not list', () => {
    const s = draftToStrategy([{ id: 'a', side: 'sell', type: 'call', strike: 12345, expiry: chain[0].expiry, quantity: 1 }], { side: 'buy', quantity: 100 }, chain, { id: 's', name: 'x', underlying: 'TEST', spot: 100, now: NOW });
    expect(s.legs).toEqual([]);
    expect(s.stock).toEqual({ side: 'buy', quantity: 100, entryPrice: 100 });
  });

  it('snaps template strikes to listed strikes without collapsing them', () => {
    // An iron condor at -10%, -5%, +5%, +10%.
    const specs = [
      { kind: 'option' as const, type: 'put' as const, direction: 1 as const, quantity: 1, strikeOffset: -0.1 },
      { kind: 'option' as const, type: 'put' as const, direction: -1 as const, quantity: 1, strikeOffset: -0.05 },
      { kind: 'option' as const, type: 'call' as const, direction: -1 as const, quantity: 1, strikeOffset: 0.05 },
      { kind: 'option' as const, type: 'call' as const, direction: 1 as const, quantity: 1, strikeOffset: 0.1 },
    ];
    const { legs, stock } = templateToDrafts(specs, chain, 2, 100, 100, newId);
    expect(legs.map((l) => l.strike)).toEqual([90, 95, 105, 110]);
    expect(legs.map((l) => l.side)).toEqual(['buy', 'sell', 'sell', 'buy']);
    expect(new Set(legs.map((l) => l.expiry))).toEqual(new Set([chain[2].expiry]));
    expect(stock).toBeNull();
    // Offsets too close together for the strike spacing still get separate strikes.
    const tight = templateToDrafts([{ ...specs[2], strikeOffset: 0 }, { ...specs[3], strikeOffset: 0.001 }], chain, 2, 100, 100, newId);
    expect(tight.legs[1].strike).toBeGreaterThan(tight.legs[0].strike);
  });

  it('uses a later expiry for far legs and sizes the stock leg to one contract', () => {
    const calendar = templateToDrafts(
      [
        { kind: 'option', type: 'call', direction: -1, quantity: 1, strikeOffset: 0, expiry: 'near' },
        { kind: 'option', type: 'call', direction: 1, quantity: 1, strikeOffset: 0, expiry: 'far' },
      ],
      chain,
      1,
      100,
      100,
      newId,
    );
    expect(calendar.legs[1].expiry).toBeGreaterThan(calendar.legs[0].expiry);
    const covered = templateToDrafts([{ kind: 'stock', direction: 1, quantity: 1 }, { kind: 'option', type: 'call', direction: -1, quantity: 1, strikeOffset: 0.05 }], chain, 2, 100, 100, newId);
    expect(covered.stock).toEqual({ side: 'buy', quantity: 100 });
    expect(nearestStrike(chain[2], 103.9)).toBe(104);
  });
});

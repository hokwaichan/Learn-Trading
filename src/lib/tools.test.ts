import { describe, expect, it } from 'vitest';
import { BACKUP_KEYS, clearAll, createBackup, parseBackup, restoreBackup, type KeyValue } from './backup';
import { compound, optionOutcome, periodsToDouble, priceProbability } from './calculators';
import { bsPrice, normCdf } from './pricing/blackScholes';

describe('compound growth', () => {
  it('grows by the rate each period', () => {
    const r = compound({ start: 1000, ratePct: 10, periods: 3 });
    expect(r.series).toEqual([1000, expect.closeTo(1100, 9), expect.closeTo(1210, 9), expect.closeTo(1331, 9)]);
    expect(r.final).toBeCloseTo(1331, 9);
    expect(r.paidIn).toBe(1000);
    expect(r.growth).toBeCloseTo(331, 9);
  });

  it('adds a contribution at the end of each period', () => {
    // 1000 -> 1100 + 100 -> 1320 + 100
    const r = compound({ start: 1000, ratePct: 10, periods: 2, contribution: 100 });
    expect(r.final).toBeCloseTo(1420, 9);
    expect(r.paidIn).toBe(1200);
    expect(r.growth).toBeCloseTo(220, 9);
  });

  it('shrinks with a negative rate and does nothing over zero periods', () => {
    expect(compound({ start: 1000, ratePct: -50, periods: 2 }).final).toBe(250);
    expect(compound({ start: 1000, ratePct: 10, periods: 0 })).toMatchObject({ final: 1000, growth: 0, series: [1000] });
    expect(compound({ start: 1000, ratePct: 10, periods: 2.9 }).series).toHaveLength(3);
  });

  it('shows why a small monthly edge adds up: 2% a month is about 27% a year', () => {
    expect(compound({ start: 100, ratePct: 2, periods: 12 }).final).toBeCloseTo(126.82, 2);
  });

  it('gives the doubling time', () => {
    expect(periodsToDouble(100)).toBeCloseTo(1, 12);
    // The rule of 72: about 10 periods at 7%.
    expect(periodsToDouble(7)).toBeCloseTo(10.24, 2);
    expect(periodsToDouble(0)).toBe(Infinity);
    expect(periodsToDouble(-5)).toBe(Infinity);
  });
});

describe('probability of a price level', () => {
  it('is the N(d2) of an option struck at the target', () => {
    const p = priceProbability(100, 110, 30, 0.4, 0.04)!;
    const years = 30 / 365;
    const d2 = (Math.log(100 / 110) + (0.04 - 0.4 ** 2 / 2) * years) / (0.4 * Math.sqrt(years));
    expect(p.above).toBeCloseTo(normCdf(d2), 12);
    expect(p.above + p.below).toBeCloseTo(1, 12);
    expect(p.above).toBeLessThan(0.5);
  });

  it('is a little under half for the current price, because of volatility drag', () => {
    const p = priceProbability(100, 100, 365, 0.5, 0)!;
    expect(p.above).toBeCloseTo(normCdf(-0.25), 12);
  });

  it('gives a wider range for more time and more volatility', () => {
    const short = priceProbability(100, 100, 7, 0.3)!.oneSigma;
    const long = priceProbability(100, 100, 90, 0.3)!.oneSigma;
    const wild = priceProbability(100, 100, 7, 0.9)!.oneSigma;
    expect(long.high - long.low).toBeGreaterThan(short.high - short.low);
    expect(wild.high - wild.low).toBeGreaterThan(short.high - short.low);
    expect(short.low).toBeLessThan(100);
    expect(short.high).toBeGreaterThan(100);
    // One standard deviation holds about 68% of outcomes.
    const inside = priceProbability(100, short.low, 7, 0.3)!.above - priceProbability(100, short.high, 7, 0.3)!.above;
    expect(inside).toBeCloseTo(0.6827, 3);
  });

  it('is null without real inputs', () => {
    expect(priceProbability(0, 100, 30, 0.4)).toBeNull();
    expect(priceProbability(100, 100, 0, 0.4)).toBeNull();
    expect(priceProbability(100, 100, 30, 0)).toBeNull();
  });
});

describe('option profit', () => {
  const base = { type: 'call' as const, side: 'buy' as const, spot: 100, strike: 105, days: 30, volatility: 0.3, rate: 0.04, premium: 2, contracts: 1, multiplier: 100, targetPrice: 115, targetDays: 30 };

  it('values a bought call at expiry', () => {
    const o = optionOutcome(base)!;
    expect(o.premiumTotal).toBe(200);
    expect(o.pnlAtExpiry).toBe(800);
    expect(o.pnl).toBeCloseTo(800, 9);
    expect(o.breakEven).toBe(107);
    expect(o.maxLoss).toBe(200);
    expect(o.maxProfit).toBe('unlimited');
  });

  it('loses the whole premium when it finishes out of the money', () => {
    expect(optionOutcome({ ...base, targetPrice: 100 })!.pnlAtExpiry).toBe(-200);
  });

  it('values it before expiry with time value left', () => {
    const o = optionOutcome({ ...base, targetPrice: 110, targetDays: 10 })!;
    const model = bsPrice({ type: 'call', spot: 110, strike: 105, years: 20 / 365, volatility: 0.3, rate: 0.04 });
    expect(o.valueThen).toBeCloseTo(model, 12);
    expect(o.pnl).toBeCloseTo((model - 2) * 100, 9);
    // More than its exercise value alone.
    expect(o.pnl).toBeGreaterThan(o.pnlAtExpiry);
  });

  it('mirrors for the seller', () => {
    const buy = optionOutcome(base)!;
    const sell = optionOutcome({ ...base, side: 'sell' })!;
    expect(sell.pnlAtExpiry).toBe(-buy.pnlAtExpiry);
    expect(sell.maxLoss).toBe('unlimited');
    expect(sell.maxProfit).toBe(200);
  });

  it('handles puts: break-even below the strike, both sides limited', () => {
    const put = optionOutcome({ ...base, type: 'put', strike: 95, targetPrice: 85 })!;
    expect(put.breakEven).toBe(93);
    expect(put.pnlAtExpiry).toBe(800);
    expect(put.maxProfit).toBe(9300);
    const sold = optionOutcome({ ...base, type: 'put', side: 'sell', strike: 95, targetPrice: 85 })!;
    expect(sold.maxLoss).toBe(9300);
    expect(sold.pnlAtExpiry).toBe(-800);
  });

  it('uses the model price when no premium is given', () => {
    const o = optionOutcome({ ...base, premium: undefined })!;
    expect(o.premium).toBeCloseTo(bsPrice({ type: 'call', spot: 100, strike: 105, years: 30 / 365, volatility: 0.3, rate: 0.04 }), 12);
  });

  it('is null without real inputs', () => {
    expect(optionOutcome({ ...base, contracts: 0 })).toBeNull();
    expect(optionOutcome({ ...base, days: 0 })).toBeNull();
  });
});

describe('backup', () => {
  function storage(initial: Record<string, string> = {}): KeyValue & { map: Map<string, string> } {
    const map = new Map(Object.entries(initial));
    return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k) };
  }
  const saved = (state: unknown, version = 1) => JSON.stringify({ state, version });

  it('exports every saved store and nothing else', () => {
    const s = storage({
      'tradeschool.settings': saved({ theme: 'light' }),
      'tradeschool.progress': saved({ lessons: { 'a/b': { attempts: 1 } } }, 2),
      'tradeschool.ui.trainerMode': '"mixed"',
      'someone.else': 'x',
    });
    const backup = createBackup(s, new Date('2026-01-05T12:00:00Z'));
    expect(backup).toMatchObject({ app: 'TradeSchool', format: 1, exportedAt: '2026-01-05T12:00:00.000Z' });
    expect(Object.keys(backup.data).sort()).toEqual(['tradeschool.progress', 'tradeschool.settings']);
    expect(backup.data['tradeschool.progress']).toEqual({ state: { lessons: { 'a/b': { attempts: 1 } } }, version: 2 });
  });

  it('skips a store that cannot be read', () => {
    const s = storage({ 'tradeschool.settings': '{not json', 'tradeschool.account': saved({ accounts: {} }) });
    expect(Object.keys(createBackup(s).data)).toEqual(['tradeschool.account']);
  });

  it('round-trips: export, wipe, import gives the same storage', () => {
    const original = storage({
      'tradeschool.settings': saved({ theme: 'light', feeRate: 0.002 }),
      'tradeschool.account': saved({ accounts: { main: { cash: 9000 } } }),
      'tradeschool.journal': saved({ notes: { p1: { reasoning: 'Why "this"?', review: '' } } }),
    });
    const text = JSON.stringify(createBackup(original));
    const target = storage({ 'tradeschool.settings': saved({ theme: 'dark' }), 'tradeschool.replay': saved({ symbol: 'ETHUSDT' }) });
    const parsed = parseBackup(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.stores.sort()).toEqual(['tradeschool.account', 'tradeschool.journal', 'tradeschool.settings']);
    restoreBackup(target, parsed.backup);
    for (const key of BACKUP_KEYS) expect(target.getItem(key)).toBe(original.getItem(key));
    // A store the backup did not have is cleared, not left behind.
    expect(target.getItem('tradeschool.replay')).toBeNull();
  });

  it('refuses files that are not a backup', () => {
    const error = (text: string) => {
      const r = parseBackup(text);
      return r.ok ? null : r.error;
    };
    expect(error('not json at all')).toMatch(/not valid JSON/);
    expect(error('[]')).toMatch(/not a TradeSchool backup/);
    expect(error('null')).toMatch(/not a TradeSchool backup/);
    expect(error(JSON.stringify({ app: 'Other', format: 1, data: {} }))).toMatch(/not a TradeSchool backup/);
    expect(error(JSON.stringify({ app: 'TradeSchool', format: 99, data: {} }))).toMatch(/newer version/);
    expect(error(JSON.stringify({ app: 'TradeSchool', format: 1, data: {} }))).toMatch(/empty/);
  });

  it('drops unknown or malformed entries from an imported file', () => {
    const r = parseBackup(
      JSON.stringify({
        app: 'TradeSchool',
        format: 1,
        data: {
          'tradeschool.settings': { state: { theme: 'light' }, version: 1 },
          'tradeschool.account': { state: 'not an object', version: 1 },
          'tradeschool.progress': { state: {} },
          'evil.key': { state: { x: 1 }, version: 1 },
        },
      }),
    );
    expect(r.ok && r.stores).toEqual(['tradeschool.settings']);
    const s = storage();
    if (r.ok) restoreBackup(s, r.backup);
    expect([...s.map.keys()]).toEqual(['tradeschool.settings']);
  });

  it('clears everything for a factory reset, leaving other keys alone', () => {
    const s = storage({ 'tradeschool.settings': saved({}), 'tradeschool.account': saved({}), 'someone.else': 'x' });
    clearAll(s);
    expect([...s.map.keys()]).toEqual(['someone.else']);
  });
});

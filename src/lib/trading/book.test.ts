import { describe, expect, it } from 'vitest';
import { fillMarketOrder } from './book';

const asks = [
  { price: 100, size: 100 },
  { price: 101, size: 200 },
  { price: 103, size: 500 },
];

describe('fillMarketOrder', () => {
  it('fills a small order entirely at the best price with no slippage', () => {
    expect(fillMarketOrder(asks, 60)).toEqual({
      filled: 60,
      averagePrice: 100,
      lastPrice: 100,
      slippage: 0,
      taken: [{ price: 100, size: 60 }],
    });
  });

  it('walks up the book for a large order and reports the average price', () => {
    const fill = fillMarketOrder(asks, 400)!;
    // 100 at 100, 200 at 101, 100 at 103 = 10,000 + 20,200 + 10,300 = 40,500
    expect(fill.taken).toEqual([
      { price: 100, size: 100 },
      { price: 101, size: 200 },
      { price: 103, size: 100 },
    ]);
    expect(fill.averagePrice).toBe(101.25);
    expect(fill.lastPrice).toBe(103);
    expect(fill.slippage).toBeCloseTo(0.0125, 10);
  });

  it('fills only what the book holds', () => {
    expect(fillMarketOrder(asks, 5000)!.filled).toBe(800);
  });

  it('works for sells against bids sorted from the highest', () => {
    const bids = [
      { price: 99, size: 100 },
      { price: 98, size: 100 },
    ];
    const fill = fillMarketOrder(bids, 150)!;
    expect(fill.averagePrice).toBeCloseTo((9900 + 4900) / 150, 10);
    expect(fill.slippage).toBeGreaterThan(0);
  });

  it('returns null for nothing to do', () => {
    expect(fillMarketOrder(asks, 0)).toBeNull();
    expect(fillMarketOrder([], 10)).toBeNull();
  });
});

export interface BookLevel {
  price: number;
  size: number;
}

export interface BookFill {
  /** Quantity actually filled (less than asked if the book ran out). */
  filled: number;
  averagePrice: number;
  /** The worst price reached. */
  lastPrice: number;
  /** Average price minus the best price, as a fraction of the best price. */
  slippage: number;
  /** How much was taken from each level. */
  taken: { price: number; size: number }[];
}

/**
 * Fills a market order against one side of an order book, best price first.
 * `levels` must already be sorted best-first (asks ascending for a buy, bids
 * descending for a sell).
 */
export function fillMarketOrder(levels: BookLevel[], quantity: number): BookFill | null {
  if (!(quantity > 0) || levels.length === 0) return null;
  let remaining = quantity;
  let cost = 0;
  const taken: BookFill['taken'] = [];
  for (const level of levels) {
    if (remaining <= 0) break;
    const size = Math.min(remaining, level.size);
    if (size <= 0) continue;
    taken.push({ price: level.price, size });
    cost += size * level.price;
    remaining -= size;
  }
  const filled = quantity - remaining;
  if (filled <= 0) return null;
  const averagePrice = cost / filled;
  const best = levels[0].price;
  return {
    filled,
    averagePrice,
    lastPrice: taken[taken.length - 1].price,
    slippage: Math.abs(averagePrice - best) / best,
    taken,
  };
}

import type { OptionLeg, OptionQuote, Side, Strategy } from '@/types';
import type { ChainExpiry } from './chain';
import type { LegSpec } from './templates';

/** One option leg as the builder edits it: a choice from the chain, not yet priced. */
export interface DraftLeg {
  id: string;
  side: Side;
  type: 'call' | 'put';
  strike: number;
  expiry: number;
  /** Contracts. */
  quantity: number;
}

export interface DraftStock {
  side: Side;
  /** Units of the underlying. */
  quantity: number;
}

/** The quote for a draft leg, or undefined if the chain no longer lists it. */
export function quoteFor(chain: ChainExpiry[], leg: Pick<DraftLeg, 'type' | 'strike' | 'expiry'>): OptionQuote | undefined {
  const row = chain.find((e) => e.expiry === leg.expiry)?.rows.find((r) => r.strike === leg.strike);
  return row?.[leg.type];
}

/** The strike in an expiry nearest a price. */
export function nearestStrike(expiry: ChainExpiry, price: number): number {
  return expiry.rows.reduce((best, row) => (Math.abs(row.strike - price) < Math.abs(best - price) ? row.strike : best), expiry.rows[0].strike);
}

/**
 * Prices draft legs from the chain to make a strategy: a bought leg pays the
 * ask, a sold leg receives the bid, and the stock leg trades at the
 * underlying price. Legs the chain does not list are dropped.
 */
export function draftToStrategy(
  drafts: DraftLeg[],
  stock: DraftStock | null,
  chain: ChainExpiry[],
  meta: { id: string; name: string; underlying: string; spot: number; now: number; templateId?: string },
): Strategy {
  const legs: OptionLeg[] = [];
  for (const draft of drafts) {
    const quote = quoteFor(chain, draft);
    if (!quote) continue;
    legs.push({ id: draft.id, contract: quote.contract, side: draft.side, quantity: draft.quantity, entryPrice: draft.side === 'buy' ? quote.ask : quote.bid, entryIv: quote.iv });
  }
  return {
    id: meta.id,
    name: meta.name,
    templateId: meta.templateId,
    underlying: meta.underlying,
    legs,
    stock: stock && stock.quantity > 0 ? { side: stock.side, quantity: stock.quantity, entryPrice: meta.spot } : undefined,
    createdAt: meta.now,
  };
}

/**
 * Turns a strategy template into draft legs on a chain. Strikes given as a
 * distance from the current price snap to the nearest listed strike, moving
 * outwards if two legs would otherwise land on the same one. Legs marked
 * 'far' use a later expiry.
 */
export function templateToDrafts(
  specs: LegSpec[],
  chain: ChainExpiry[],
  expiryIndex: number,
  spot: number,
  multiplier: number,
  newId: () => string,
): { legs: DraftLeg[]; stock: DraftStock | null } {
  const near = chain[Math.min(expiryIndex, chain.length - 1)];
  const far = chain[Math.min(expiryIndex + 2, chain.length - 1)];
  if (!near) return { legs: [], stock: null };
  const strikes = near.rows.map((r) => r.strike);
  const options = specs.filter((s) => s.kind === 'option');
  // Distinct offsets must map to distinct strikes, in the same order.
  const offsets = [...new Set(options.map((s) => s.strikeOffset ?? 0))].sort((a, b) => a - b);
  const indexOf = (offset: number) => strikes.indexOf(nearestStrike(near, spot * (1 + offset)));
  const mapped = new Map<number, number>();
  const centre = offsets.reduce((best, o) => (Math.abs(o) < Math.abs(best) ? o : best), offsets[0] ?? 0);
  mapped.set(centre, indexOf(centre));
  let last = mapped.get(centre)!;
  for (const o of offsets.filter((x) => x > centre)) {
    last = Math.min(strikes.length - 1, Math.max(indexOf(o), last + 1));
    mapped.set(o, last);
  }
  last = mapped.get(centre)!;
  for (const o of offsets.filter((x) => x < centre).reverse()) {
    last = Math.max(0, Math.min(indexOf(o), last - 1));
    mapped.set(o, last);
  }

  const legs = options.map(
    (spec): DraftLeg => ({
      id: newId(),
      side: spec.direction === 1 ? 'buy' : 'sell',
      type: spec.type!,
      strike: strikes[mapped.get(spec.strikeOffset ?? 0)!],
      expiry: (spec.expiry === 'far' ? far : near).expiry,
      quantity: spec.quantity,
    }),
  );
  const stockSpec = specs.find((s) => s.kind === 'stock');
  // One stock leg covers one contract per unit of template quantity.
  const stock: DraftStock | null = stockSpec ? { side: stockSpec.direction === 1 ? 'buy' : 'sell', quantity: stockSpec.quantity * multiplier } : null;
  return { legs, stock };
}

import { bsPrice } from './blackScholes';
import type { PayoffLeg } from './payoff';

/** One leg of a strategy template, with its strike given relative to the current price. */
export interface LegSpec {
  kind: 'option' | 'stock';
  /** +1 bought, -1 sold. */
  direction: 1 | -1;
  quantity: number;
  type?: 'call' | 'put';
  /** Strike as a fraction away from the current price: 0.05 = 5% above, -0.05 = 5% below, 0 = at the money. */
  strikeOffset?: number;
  /** 'far' marks the longer-dated leg of a calendar spread. */
  expiry?: 'near' | 'far';
}

export interface TemplatePricing {
  spot: number;
  /** Days to the (near) expiry. */
  days: number;
  /** Annual volatility as a fraction. */
  volatility: number;
  rate: number;
  /** Strikes are rounded to a multiple of this. */
  strikeStep?: number;
  /** Days to expiry for legs marked 'far'. */
  farDays?: number;
}

export function roundStrike(value: number, step: number): number {
  return Number((Math.round(value / step) * step).toFixed(8));
}

/** A sensible strike spacing for a price: about 1% of it, snapped to 1, 2.5 or 5 times a power of ten. */
export function strikeStepFor(spot: number): number {
  const raw = spot * 0.01;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  return [1, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
}

/**
 * Turns a template into concrete legs at the given price, with each option
 * priced by Black-Scholes. Used for payoff diagrams in lessons and drills and
 * as the starting point in the strategy builder.
 */
export function buildLegs(specs: LegSpec[], pricing: TemplatePricing): PayoffLeg[] {
  const step = pricing.strikeStep ?? strikeStepFor(pricing.spot);
  return specs.map((spec): PayoffLeg => {
    if (spec.kind === 'stock') {
      return { kind: 'stock', direction: spec.direction, quantity: spec.quantity, entryPrice: pricing.spot };
    }
    const strike = roundStrike(pricing.spot * (1 + (spec.strikeOffset ?? 0)), step);
    const days = spec.expiry === 'far' ? (pricing.farDays ?? pricing.days * 3) : pricing.days;
    const premium = bsPrice({
      type: spec.type!,
      spot: pricing.spot,
      strike,
      years: days / 365,
      volatility: pricing.volatility,
      rate: pricing.rate,
    });
    return { kind: 'option', type: spec.type, direction: spec.direction, quantity: spec.quantity, strike, entryPrice: premium };
  });
}

import type { Greeks } from '@/types';

export type OptionType = 'call' | 'put';

export interface BsInput {
  type: OptionType;
  /** Price of the underlying now. */
  spot: number;
  strike: number;
  /** Time to expiry in years. */
  years: number;
  /** Annual volatility as a fraction: 0.2 = 20%. */
  volatility: number;
  /** Annual risk-free interest rate as a fraction. */
  rate: number;
  /** Annual dividend yield as a fraction. Zero unless stated. */
  dividendYield?: number;
}

export const DAYS_PER_YEAR = 365;

/** Standard normal density. */
export function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Standard normal cumulative distribution, accurate to about 1e-15
 * (Graeme West, "Better approximations to cumulative normal functions", 2005).
 */
export function normCdf(x: number): number {
  const ax = Math.abs(x);
  let c: number;
  if (ax > 37) {
    c = 0;
  } else {
    const e = Math.exp((-ax * ax) / 2);
    if (ax < 7.07106781186547) {
      let b = 3.52624965998911e-2 * ax + 0.700383064443688;
      b = b * ax + 6.37396220353165;
      b = b * ax + 33.912866078383;
      b = b * ax + 112.079291497871;
      b = b * ax + 221.213596169931;
      b = b * ax + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * ax + 1.75566716318264;
      b = b * ax + 16.064177579207;
      b = b * ax + 86.7807322029461;
      b = b * ax + 296.564248779674;
      b = b * ax + 637.333633378831;
      b = b * ax + 793.826512519948;
      b = b * ax + 440.413735824752;
      c = c / b;
    } else {
      let b = ax + 0.65;
      b = ax + 4 / b;
      b = ax + 3 / b;
      b = ax + 2 / b;
      b = ax + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return x > 0 ? 1 - c : c;
}

/** What the option is worth if exercised right now; never negative. */
export function intrinsicValue(type: OptionType, spot: number, strike: number): number {
  return Math.max(0, type === 'call' ? spot - strike : strike - spot);
}

function d1d2({ spot, strike, years, volatility, rate, dividendYield = 0 }: BsInput) {
  const vt = volatility * Math.sqrt(years);
  const d1 = (Math.log(spot / strike) + (rate - dividendYield + (volatility * volatility) / 2) * years) / vt;
  return { d1, d2: d1 - vt };
}

/** True when the model cannot be applied and the option is simply worth its intrinsic value. */
function degenerate(i: BsInput): boolean {
  return !(i.years > 0) || !(i.volatility > 0) || !(i.spot > 0) || !(i.strike > 0);
}

/**
 * Black-Scholes price of a European option, per one unit of the underlying.
 *
 *   call = S e^(-qT) N(d1) - K e^(-rT) N(d2)
 *   put  = K e^(-rT) N(-d2) - S e^(-qT) N(-d1)
 *   d1   = [ln(S/K) + (r - q + sigma^2 / 2) T] / (sigma sqrt(T)),  d2 = d1 - sigma sqrt(T)
 */
export function bsPrice(input: BsInput): number {
  const { type, spot, strike, years, rate, dividendYield = 0 } = input;
  if (degenerate(input)) return intrinsicValue(type, spot, strike);
  const { d1, d2 } = d1d2(input);
  const discountedSpot = spot * Math.exp(-dividendYield * years);
  const discountedStrike = strike * Math.exp(-rate * years);
  return type === 'call'
    ? discountedSpot * normCdf(d1) - discountedStrike * normCdf(d2)
    : discountedStrike * normCdf(-d2) - discountedSpot * normCdf(-d1);
}

/**
 * The Greeks, in the units traders quote:
 *   delta  change in price per 1.00 move in the underlying
 *   gamma  change in delta per 1.00 move in the underlying
 *   theta  change in price per calendar day passing (usually negative)
 *   vega   change in price per 1 percentage point of volatility
 *   rho    change in price per 1 percentage point of interest rate
 */
export function bsGreeks(input: BsInput): Greeks {
  const { type, spot, strike, years, volatility, rate, dividendYield = 0 } = input;
  if (degenerate(input)) {
    const itm = type === 'call' ? spot > strike : spot < strike;
    return { delta: itm ? (type === 'call' ? 1 : -1) : 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
  }
  const { d1, d2 } = d1d2(input);
  const sqrtT = Math.sqrt(years);
  const eq = Math.exp(-dividendYield * years);
  const er = Math.exp(-rate * years);
  const pdf = normPdf(d1);
  const call = type === 'call';

  const delta = call ? eq * normCdf(d1) : eq * (normCdf(d1) - 1);
  const gamma = (eq * pdf) / (spot * volatility * sqrtT);
  const vegaPerUnit = spot * eq * pdf * sqrtT;
  const decay = -(spot * eq * pdf * volatility) / (2 * sqrtT);
  const thetaPerYear = call
    ? decay - rate * strike * er * normCdf(d2) + dividendYield * spot * eq * normCdf(d1)
    : decay + rate * strike * er * normCdf(-d2) - dividendYield * spot * eq * normCdf(-d1);
  const rhoPerUnit = call ? strike * years * er * normCdf(d2) : -strike * years * er * normCdf(-d2);

  return {
    delta,
    gamma,
    theta: thetaPerYear / DAYS_PER_YEAR,
    vega: vegaPerUnit / 100,
    rho: rhoPerUnit / 100,
  };
}

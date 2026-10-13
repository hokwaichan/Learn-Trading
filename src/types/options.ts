import type { Side, UnixMs } from './market';

export interface OptionContract {
  /** e.g. 'BTCUSDT-20261225-70000-C' */
  id: string;
  underlying: string;
  type: 'call' | 'put';
  strike: number;
  expiry: UnixMs;
  /** Priced as European: exercise only at expiry. */
  style: 'european';
  /** Units of the underlying per contract: 100 for stocks, 1 for crypto. */
  multiplier: number;
}

export interface Greeks {
  delta: number;
  gamma: number;
  /** Per calendar day. */
  theta: number;
  /** Per 1 percentage point of implied volatility. */
  vega: number;
  /** Per 1 percentage point of interest rate. */
  rho: number;
}

export interface OptionQuote {
  contract: OptionContract;
  bid: number;
  ask: number;
  mid: number;
  iv: number;
  greeks: Greeks;
  moneyness: 'ITM' | 'ATM' | 'OTM';
  /** Always true: chain prices come from a model, not a market. */
  simulated: true;
}

export interface OptionLeg {
  id: string;
  contract: OptionContract;
  side: Side;
  /** Number of contracts. */
  quantity: number;
  /** Premium per unit of the underlying. */
  entryPrice: number;
  entryIv: number;
}

export interface StockLeg {
  side: Side;
  quantity: number;
  entryPrice: number;
}

/** An option strategy: what the builder edits and what an options position holds. */
export interface Strategy {
  id: string;
  name: string;
  templateId?: string;
  underlying: string;
  /** One to four legs. */
  legs: OptionLeg[];
  stock?: StockLeg;
  createdAt: UnixMs;
}

export interface PayoffPoint {
  price: number;
  pnl: number;
}

export interface StrategyAnalysis {
  /** Positive = credit received, negative = debit paid. */
  netPremium: number;
  maxProfit: number | 'unlimited';
  maxLoss: number | 'unlimited';
  breakEvens: number[];
  greeks: Greeks;
  payoffAtExpiry: PayoffPoint[];
  payoffAtDate: PayoffPoint[];
}

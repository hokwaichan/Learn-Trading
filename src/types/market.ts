import type { OptionContract } from './options';

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export type Side = 'buy' | 'sell';
export type Direction = 'long' | 'short';
export type MarginMode = 'isolated' | 'cross';
export type InstrumentKind = 'spot' | 'perpetual' | 'option';
export type AccountId = 'main' | 'replay';
/** Milliseconds since the Unix epoch, UTC. */
export type UnixMs = number;

export interface Candle {
  /** Open time in Unix seconds, UTC. */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InstrumentBase {
  symbol: string;
  name: string;
  base: string;
  quote: string;
  assetClass: 'crypto' | 'stock' | 'etf' | 'forex';
  source: 'binance-spot' | 'binance-futures' | 'static';
  /** Smallest price step. */
  tickSize: number;
  /** Smallest quantity step. */
  stepSize: number;
  minQty: number;
  timeframes: Timeframe[];
  /** False when only bundled history exists (no live price). */
  live: boolean;
}

export interface SpotInstrument extends InstrumentBase {
  kind: 'spot';
}

export interface PerpetualInstrument extends InstrumentBase {
  kind: 'perpetual';
  contractMultiplier: number;
  maxLeverage: number;
  maintenanceMarginRate: number;
  fundingIntervalHours: number;
}

export interface OptionInstrument extends InstrumentBase {
  kind: 'option';
  contract: OptionContract;
}

export type Instrument = SpotInstrument | PerpetualInstrument | OptionInstrument;

export interface FundingRate {
  time: UnixMs;
  rate: number;
}

export interface CandleRange {
  from?: UnixMs;
  to?: UnixMs;
  limit?: number;
}

/** Latest price and its change over the last day (or last bar for bundled data). */
export interface Quote {
  symbol: string;
  kind: InstrumentKind;
  last: number;
  /** Fraction: 0.012 = +1.2%. */
  changePct: number;
}

/** Every data source implements this; see lib/data. */
export interface MarketDataProvider {
  id: string;
  listInstruments(): Promise<Instrument[]>;
  getCandles(symbol: string, timeframe: Timeframe, range?: CandleRange): Promise<Candle[]>;
  getLastPrice?(symbol: string): Promise<number>;
  getMarkPrice?(symbol: string): Promise<number>;
  getFundingHistory?(symbol: string, range?: CandleRange): Promise<FundingRate[]>;
  getQuotes?(symbols: string[]): Promise<Quote[]>;
  /** Live updates to the newest candle. Returns an unsubscribe function. */
  subscribeCandles?(symbol: string, timeframe: Timeframe, onCandle: (candle: Candle) => void): () => void;
  /** Live price stream. Returns an unsubscribe function. */
  subscribe?(symbol: string, onPrice: (price: number) => void): () => void;
}

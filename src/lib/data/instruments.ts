import { t } from '@/i18n';
import type { Instrument, InstrumentKind, PerpetualInstrument, SpotInstrument, Timeframe } from '@/types';

const INTRADAY: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
const DAILY: Timeframe[] = ['1d'];

function crypto(base: string, name: string, tickSize: number, stepSize: number): SpotInstrument {
  return {
    kind: 'spot',
    symbol: `${base}USDT`,
    name,
    base,
    quote: 'USDT',
    assetClass: 'crypto',
    source: 'binance-spot',
    tickSize,
    stepSize,
    minQty: stepSize,
    timeframes: INTRADAY,
    live: true,
  };
}

function perp(spot: SpotInstrument, maintenanceMarginRate: number): PerpetualInstrument {
  return {
    ...spot,
    kind: 'perpetual',
    name: t('{name} perpetual', { name: spot.name }),
    source: 'binance-futures',
    contractMultiplier: 1,
    maxLeverage: 20,
    maintenanceMarginRate,
    fundingIntervalHours: 8,
  };
}

function bundled(
  symbol: string,
  name: string,
  assetClass: 'stock' | 'etf' | 'forex',
  base: string,
  quote: string,
  tickSize: number,
  stepSize: number,
): SpotInstrument {
  return {
    kind: 'spot',
    symbol,
    name,
    base,
    quote,
    assetClass,
    source: 'static',
    tickSize,
    stepSize,
    minQty: stepSize,
    timeframes: DAILY,
    live: false,
  };
}

const BTC = crypto('BTC', t('Bitcoin'), 0.01, 0.00001);
const ETH = crypto('ETH', t('Ethereum'), 0.01, 0.0001);
const SOL = crypto('SOL', t('Solana'), 0.01, 0.001);

/**
 * Every instrument the app knows about. To add one, append it here; a new
 * data source also needs a provider in this folder (see the README).
 */
export const INSTRUMENTS: Instrument[] = [
  BTC,
  ETH,
  SOL,
  crypto('BNB', 'BNB', 0.01, 0.001),
  crypto('XRP', 'XRP', 0.0001, 0.1),
  crypto('ADA', t('Cardano'), 0.0001, 0.1),
  crypto('DOGE', t('Dogecoin'), 0.00001, 1),
  perp(BTC, 0.004),
  perp(ETH, 0.005),
  perp(SOL, 0.01),
  bundled('AAPL', t('Apple'), 'stock', 'AAPL', 'USD', 0.01, 1),
  bundled('TSLA', t('Tesla'), 'stock', 'TSLA', 'USD', 0.01, 1),
  bundled('SPY', t('S&P 500 ETF'), 'etf', 'SPY', 'USD', 0.01, 1),
  bundled('EURUSD', t('Euro / US dollar'), 'forex', 'EUR', 'USD', 0.0001, 1000),
];

export const DEFAULT_SPOT_SYMBOL = 'BTCUSDT';
export const DEFAULT_PERP_SYMBOL = 'BTCUSDT';

export function findInstrument(symbol: string, kind: InstrumentKind = 'spot'): Instrument | undefined {
  const upper = symbol.toUpperCase();
  return INSTRUMENTS.find((i) => i.symbol === upper && i.kind === kind);
}

export function instrumentsOfKind(kind: InstrumentKind): Instrument[] {
  return INSTRUMENTS.filter((i) => i.kind === kind);
}

/** 'BTC/USDT' for crypto and forex, the plain ticker for stocks. */
export function displaySymbol(instrument: Instrument): string {
  return instrument.assetClass === 'crypto' || instrument.assetClass === 'forex'
    ? `${instrument.base}/${instrument.quote}`
    : instrument.symbol;
}

/** Case-insensitive match on ticker, name or base asset; best matches first. */
export function searchInstruments(query: string, list: Instrument[] = INSTRUMENTS): Instrument[] {
  const q = query.trim().toUpperCase().replace('/', '');
  if (!q) return list;
  const score = (i: Instrument): number => {
    if (i.symbol === q || i.base === q) return 0;
    if (i.symbol.startsWith(q) || i.base.startsWith(q)) return 1;
    if (i.name.toUpperCase().startsWith(q)) return 2;
    if (i.symbol.includes(q) || i.name.toUpperCase().includes(q)) return 3;
    return -1;
  };
  return list
    .map((i) => ({ i, s: score(i) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s)
    .map((x) => x.i);
}

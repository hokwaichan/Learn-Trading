import { useEffect, useMemo, useState } from 'react';
import { buildChain, type ChainExpiry } from '@/lib/pricing/chain';
import { historicalVolatility } from '@/lib/pricing/impliedVol';
import { useCandleSeries, useLastPrice, useSettings, type SeriesState } from '@/stores';
import type { Instrument } from '@/types';

/** Used until there is enough history to measure volatility. */
const FALLBACK_VOLATILITY = 0.5;
/** A market that barely moved still gets a usable chain. */
const MIN_VOLATILITY = 0.05;
export const VOLATILITY_LOOKBACK = 30;

/** Units of the underlying per contract: 100 for stocks, ETFs and currencies, 1 for crypto. */
export function contractMultiplier(instrument: Instrument): number {
  return instrument.assetClass === 'crypto' ? 1 : 100;
}

export interface OptionMarket {
  series: SeriesState;
  /** The underlying price: live when there is one, otherwise the last daily close. */
  spot: number | undefined;
  /** Annualised volatility of the last 30 daily closes, as a fraction. */
  volatility: number;
  /** False while there is too little history and a stand-in volatility is used. */
  measured: boolean;
  chain: ChainExpiry[];
  now: number;
  rate: number;
  multiplier: number;
}

/** Everything the Options page derives from the underlying: price, volatility and the simulated chain. */
export function useOptionMarket(instrument: Instrument): OptionMarket {
  const series = useCandleSeries(instrument, '1d');
  const live = useLastPrice(instrument);
  const rate = useSettings((s) => s.riskFreeRate);
  const { candles } = series;
  const spot = live ?? (candles.length ? candles[candles.length - 1].close : undefined);

  // The chain ages with the clock; a minute is fine-grained enough.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const measuredVolatility = useMemo(() => historicalVolatility(candles, instrument.assetClass === 'crypto' ? 365 : 252, VOLATILITY_LOOKBACK), [candles, instrument.assetClass]);
  const volatility = Math.max(MIN_VOLATILITY, measuredVolatility ?? FALLBACK_VOLATILITY);
  const multiplier = contractMultiplier(instrument);

  const chain = useMemo(
    () => (spot != null ? buildChain({ underlying: instrument.symbol, spot, volatility, now, rate, multiplier, tickSize: instrument.tickSize }) : []),
    [instrument.symbol, instrument.tickSize, spot, volatility, now, rate, multiplier],
  );

  return { series, spot, volatility, measured: measuredVolatility != null, chain, now, rate, multiplier };
}

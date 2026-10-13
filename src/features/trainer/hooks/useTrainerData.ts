import { useMemo } from 'react';
import { displaySymbol, findInstrument } from '@/lib/data';
import { useCandleSeries, useMarket } from '@/stores';
import { indexPatterns, type Dataset, type PatternIndex } from '../questions';

/** Bundled daily history: always available, so the trainer works offline. */
const SYMBOLS = ['SPY', 'AAPL', 'TSLA', 'EURUSD'] as const;
const INSTRUMENTS = SYMBOLS.map((symbol) => findInstrument(symbol)!);

export interface TrainerData {
  status: 'loading' | 'ready' | 'error';
  error?: string;
  datasets: Dataset[];
  index: PatternIndex;
  retry: () => void;
}

/** Loads the price history the real-chart drills cut their questions from. */
export function useTrainerData(): TrainerData {
  // A fixed list, so calling the hook once per symbol is safe.
  const a = useCandleSeries(INSTRUMENTS[0], '1d');
  const b = useCandleSeries(INSTRUMENTS[1], '1d');
  const c = useCandleSeries(INSTRUMENTS[2], '1d');
  const d = useCandleSeries(INSTRUMENTS[3], '1d');
  const load = useMarket((s) => s.load);

  const ready = [a, b, c, d].every((s) => s.status === 'ready' && s.candles.length > 0);
  const failed = [a, b, c, d].find((s) => s.status === 'error');

  const datasets = useMemo<Dataset[]>(
    () =>
      ready
        ? [a, b, c, d].map((series, i) => ({
            symbol: INSTRUMENTS[i].symbol,
            title: displaySymbol(INSTRUMENTS[i]),
            tickSize: INSTRUMENTS[i].tickSize,
            candles: series.candles,
          }))
        : [],
    // The candle arrays only change when a file finishes loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, a.candles, b.candles, c.candles, d.candles],
  );
  const index = useMemo(() => indexPatterns(datasets), [datasets]);

  return {
    status: ready ? 'ready' : failed ? 'error' : 'loading',
    error: failed?.error,
    datasets,
    index,
    retry: () => INSTRUMENTS.forEach((instrument) => void load(instrument, '1d')),
  };
}

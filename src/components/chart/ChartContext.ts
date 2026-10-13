import { createContext, useContext } from 'react';
import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import type { Candle } from '@/types';
import type { ChartTheme } from './theme';

/** What overlays and extra series (drawings, indicators) need from the chart. */
export interface ChartApi {
  chart: IChartApi;
  /** The main price series. */
  series: ISeriesApi<SeriesType>;
  /** The real candles, even when the chart displays Heikin-Ashi. */
  candles: Candle[];
  /** Seconds per candle. */
  stepSeconds: number;
  tickSize: number;
  theme: ChartTheme;
}

export const ChartContext = createContext<ChartApi | null>(null);

/** Null until the chart has been created. */
export function useChartApi(): ChartApi | null {
  return useContext(ChartContext);
}

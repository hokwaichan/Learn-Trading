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
  /** Where overlay indicators put their legend rows (under the price readout). */
  legendSlot: HTMLElement | null;
  /** True for the main price series and the volume bars, false for anything added on top. */
  isBaseSeries: (series: unknown) => boolean;
  /**
   * False once the chart has been destroyed. Cleanup code must check this
   * before touching the chart: calls on a destroyed chart schedule a redraw
   * that then throws.
   */
  isAlive: () => boolean;
}

export const ChartContext = createContext<ChartApi | null>(null);

/** Null until the chart has been created. */
export function useChartApi(): ChartApi | null {
  return useContext(ChartContext);
}

/** Index of the candle under the crosshair, or null. Separate so it can change often. */
export const ChartCursorContext = createContext<number | null>(null);

export function useChartCursor(): number | null {
  return useContext(ChartCursorContext);
}

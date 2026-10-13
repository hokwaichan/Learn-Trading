import { useEffect, useRef } from 'react';
import { createSeriesMarkers, type ISeriesMarkersPluginApi, type SeriesMarker, type Time, type UTCTimestamp } from 'lightweight-charts';
import { useChartApi } from './ChartContext';

export interface TradeMarker {
  /** Open time of the candle, in seconds. */
  time: number;
  side: 'buy' | 'sell';
  /** Short text beside the arrow, e.g. 'Buy' or 'Stop'. The arrow is never the only cue. */
  text: string;
}

/** Arrows on the price chart where trades were made: below the candle for a buy, above for a sell. */
export function TradeMarkerLayer({ markers }: { markers: TradeMarker[] }) {
  const api = useChartApi();
  const series = api?.series;
  const theme = api?.theme;
  const isAlive = api?.isAlive;
  const plugin = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  useEffect(() => {
    if (!series) return;
    const created = createSeriesMarkers(series, []);
    plugin.current = created;
    return () => {
      plugin.current = null;
      if (isAlive && !isAlive()) return;
      try {
        created.detach();
      } catch {
        // The series it was attached to has already been swapped out.
      }
    };
  }, [series, isAlive]);

  useEffect(() => {
    if (!theme) return;
    const list: SeriesMarker<Time>[] = [...markers]
      .sort((a, b) => a.time - b.time)
      .map((m) => ({
        time: m.time as UTCTimestamp,
        position: m.side === 'buy' ? 'belowBar' : 'aboveBar',
        shape: m.side === 'buy' ? 'arrowUp' : 'arrowDown',
        color: m.side === 'buy' ? theme.up : theme.down,
        text: m.text,
        size: 1,
      }));
    plugin.current?.setMarkers(list);
  }, [series, markers, theme]);

  return null;
}

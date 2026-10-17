import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HistogramSeries,
  LineSeries,
  LineStyle,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { cn } from '@/components/ui';
import { t } from '@/i18n';
import { formatCompact, formatPrice } from '@/lib/format';
import {
  computeIndicator,
  getIndicator,
  indicatorLabel,
  type IndicatorDefinition,
  type Series,
} from '@/lib/indicators';
import type { Candle, IndicatorConfig } from '@/types';
import { useChartApi, useChartCursor, type ChartApi } from './ChartContext';
import { withAlpha, type ChartTheme } from './theme';

export interface IndicatorLayerProps {
  indicators: IndicatorConfig[];
  /** Called when an indicator's line or legend entry is clicked. */
  onSelect?: (key: string) => void;
  selectedKey?: string | null;
}

/** Pane 0 is price and pane 1 is volume; indicator panes start after those. */
const FIRST_INDICATOR_PANE = 2;

interface Built {
  config: IndicatorConfig;
  def: IndicatorDefinition;
  pane: number;
  /** Position in the full indicator list; decides the colour. */
  slot: number;
  /** Output key -> the chart series drawing it. */
  series: Record<string, ISeriesApi<SeriesType>>;
  guides: IPriceLine[];
}

/** Colours for each output of an indicator, from the fixed six-colour palette. */
function outputColors(def: IndicatorDefinition, slot: number, theme: ChartTheme): Record<string, string> {
  const base = theme.series[slot % theme.series.length];
  const second = theme.series[(slot + 1) % theme.series.length];
  if (def.id === 'macd') return { macd: base, signal: second, histogram: base };
  if (def.id === 'stochastic') return { k: base, d: second };
  return Object.fromEntries(def.outputs.map((o) => [o.key, base]));
}

function toPoints(candles: Candle[], values: Series) {
  const points: { time: UTCTimestamp; value: number }[] = [];
  for (let i = 0; i < candles.length; i++) {
    const v = values[i];
    if (v != null) points.push({ time: candles[i].time as UTCTimestamp, value: v });
  }
  return points;
}

function histogramPoints(candles: Candle[], values: Series, theme: ChartTheme) {
  const points: { time: UTCTimestamp; value: number; color: string }[] = [];
  for (let i = 0; i < candles.length; i++) {
    const v = values[i];
    if (v != null) {
      points.push({ time: candles[i].time as UTCTimestamp, value: v, color: withAlpha(v >= 0 ? theme.up : theme.down, 0.6) });
    }
  }
  return points;
}

/** Tracks the top edge of each pane so legends can sit in their top-left corners. */
function usePaneTops(api: ChartApi | null, version: number): number[] {
  const [tops, setTops] = useState<number[]>([]);
  useEffect(() => {
    if (!api) return;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      try {
        let y = 0;
        const next = api.chart.panes().map((pane) => {
          const top = y;
          y += pane.getHeight() + 1; // 1px separator
          return top;
        });
        setTops((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
      } catch {
        // The chart was removed between frames.
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [api, version]);
  return tops;
}

function LegendEntry({
  item,
  colors,
  values,
  tickSize,
  selected,
  onSelect,
}: {
  item: Built;
  colors: Record<string, string>;
  values: Record<string, number | null>;
  tickSize: number;
  selected: boolean;
  onSelect?: (key: string) => void;
}) {
  const { def, config } = item;
  const show = (v: number | null) =>
    v == null ? '–' : def.id === 'volumeMa' ? formatCompact(v) : def.decimals != null ? v.toFixed(def.decimals) : formatPrice(v, tickSize);
  return (
    <button
      type="button"
      onClick={() => onSelect?.(config.key)}
      aria-pressed={selected}
      aria-label={t('Explain {indicator}', { indicator: indicatorLabel(config) })}
      className={cn(
        'pointer-events-auto flex items-baseline gap-x-2 rounded-sm px-1 -mx-1 text-xs hover:bg-raised',
        selected && 'bg-raised',
      )}
    >
      <span className="font-medium text-fg">{indicatorLabel(config)}</span>
      {def.outputs.map((o) => (
        <span key={o.key} className="whitespace-nowrap">
          {def.outputs.length > 1 && <span className="text-muted">{o.label} </span>}
          <span className="num" style={{ color: colors[o.key] }}>
            {show(values[o.key] ?? null)}
          </span>
        </span>
      ))}
    </button>
  );
}

/**
 * Draws indicators on a PriceChart: overlays on the price pane, the volume
 * average on the volume pane, and oscillators in panes of their own, each
 * with a legend in its top-left corner. Render it as a child of PriceChart.
 */
export function IndicatorLayer({ indicators, onSelect, selectedKey }: IndicatorLayerProps) {
  const api = useChartApi();
  const cursor = useChartCursor();
  const chart = api?.chart ?? null;
  const theme = api?.theme;
  const candles = api?.candles;
  const stepSeconds = api?.stepSeconds ?? 0;
  const tickSize = api?.tickSize ?? 0.01;

  // Colours follow an indicator's position in the full list, so hiding one
  // does not recolour the others.
  const visible = useMemo(
    () => indicators.map((config, slot) => ({ config, slot })).filter((x) => x.config.visible),
    [indicators],
  );
  const structure = visible.map((x) => `${x.config.key}:${x.config.id}:${x.slot}`).join('|');

  const [built, setBuilt] = useState<Built[]>([]);
  const isAlive = api?.isAlive;
  const latest = useRef({ visible, onSelect, theme, isAlive });
  useEffect(() => {
    latest.current = { visible, onSelect, theme, isAlive };
  });

  // Create the chart series. Rebuilt only when the set of indicators changes.
  useEffect(() => {
    const theme = latest.current.theme;
    if (!chart || !theme) return;
    let nextPane = FIRST_INDICATOR_PANE;
    const created: Built[] = latest.current.visible.map(({ config, slot }) => {
      const def = getIndicator(config.id);
      const pane = def.placement === 'overlay' ? 0 : def.placement === 'volume' ? 1 : nextPane++;
      const colors = outputColors(def, slot, theme);
      const series: Built['series'] = {};
      for (const output of def.outputs) {
        const color = colors[output.key];
        const common = {
          priceLineVisible: false,
          lastValueVisible: def.placement === 'pane' && output.style !== 'histogram',
          crosshairMarkerVisible: false,
          ...(def.range
            ? { autoscaleInfoProvider: () => ({ priceRange: { minValue: def.range!.min, maxValue: def.range!.max } }) }
            : {}),
          ...(def.decimals != null
            ? { priceFormat: { type: 'price' as const, precision: def.decimals, minMove: 1 / 10 ** def.decimals } }
            : {}),
        };
        const seriesApi =
          output.style === 'histogram'
            ? chart.addSeries(HistogramSeries, { ...common, color }, pane)
            : chart.addSeries(
                LineSeries,
                {
                  ...common,
                  color,
                  lineWidth: output.style === 'dashed' ? 1 : 2,
                  lineStyle: output.style === 'dashed' ? LineStyle.Dashed : LineStyle.Solid,
                },
                pane,
              );
        series[output.key] = seriesApi;
      }
      const first = series[def.outputs[def.outputs.length - 1].key];
      const guides = (def.guides ?? []).map((level) =>
        first.createPriceLine({
          price: level,
          color: theme.text,
          lineWidth: 1,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: false,
          title: '',
        }),
      );
      return { config, def, pane, slot, series, guides };
    });

    const panes = chart.panes();
    for (let i = FIRST_INDICATOR_PANE; i < panes.length; i++) panes[i].setStretchFactor(0.28);
    setBuilt(created);

    const onClick = (param: MouseEventParams<Time>) => {
      if (!param.hoveredSeries) return;
      const hit = created.find((b) => Object.values(b.series).some((s) => s === param.hoveredSeries));
      if (hit) latest.current.onSelect?.(hit.config.key);
    };
    chart.subscribeClick(onClick);

    return () => {
      setBuilt([]);
      // When the whole chart is going away it cleans up its own series.
      if (!latest.current.isAlive?.()) return;
      try {
        chart.unsubscribeClick(onClick);
        for (const b of created) for (const s of Object.values(b.series)) chart.removeSeries(s);
      } catch {
        // The chart itself was already removed.
      }
    };
  }, [chart, structure]);

  // A theme change recolours the existing series in place.
  useEffect(() => {
    if (!theme) return;
    for (const b of built) {
      const colors = outputColors(b.def, b.slot, theme);
      try {
        for (const o of b.def.outputs) b.series[o.key]?.applyOptions({ color: colors[o.key] });
        for (const line of b.guides) line.applyOptions({ color: theme.text });
      } catch {
        // Series removed while a rebuild is in flight.
      }
    }
  }, [built, theme]);

  // Values. Recomputed when candles or parameters change.
  const computed = useMemo(() => {
    if (!candles) return new Map<string, Record<string, Series>>();
    return new Map(visible.map(({ config }) => [config.key, computeIndicator(config, candles, stepSeconds)]));
  }, [visible, candles, stepSeconds]);

  useEffect(() => {
    if (!candles || !theme) return;
    for (const b of built) {
      const output = computed.get(b.config.key);
      if (!output) continue;
      for (const o of b.def.outputs) {
        const target = b.series[o.key];
        const values = output[o.key];
        if (!target || !values) continue;
        try {
          if (o.style === 'histogram') target.setData(histogramPoints(candles, values, theme));
          else target.setData(toPoints(candles, values));
        } catch {
          // Series removed while a rebuild is in flight; the next pass fills it.
        }
      }
    }
  }, [built, computed, candles, theme]);

  const tops = usePaneTops(api, built.length);
  if (!api || !candles || built.length === 0) return null;

  const index = cursor ?? candles.length - 1;
  const valuesOf = (b: Built): Record<string, number | null> => {
    const output = computed.get(b.config.key);
    return Object.fromEntries(b.def.outputs.map((o) => [o.key, output?.[o.key]?.[index] ?? null]));
  };
  const entry = (b: Built) => (
    <LegendEntry
      key={b.config.key}
      item={b}
      colors={outputColors(b.def, b.slot, api.theme)}
      values={valuesOf(b)}
      tickSize={tickSize}
      selected={selectedKey === b.config.key}
      onSelect={onSelect}
    />
  );

  const overlays = built.filter((b) => b.pane === 0);
  const lowerPanes = [...new Set(built.filter((b) => b.pane > 0).map((b) => b.pane))];

  return (
    <>
      {api.legendSlot && createPortal(overlays.map(entry), api.legendSlot)}
      {lowerPanes.map((pane) =>
        tops[pane] == null ? null : (
          <div
            key={pane}
            style={{ top: tops[pane] + 3 }}
            className="pointer-events-none absolute left-2 z-[3] flex flex-col items-start gap-0.5"
          >
            {built.filter((b) => b.pane === pane).map(entry)}
          </div>
        ),
      )}
    </>
  );
}

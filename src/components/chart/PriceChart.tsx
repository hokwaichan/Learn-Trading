import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  createSeriesMarkers,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type MouseEventParams,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { TIMEFRAME_NAMES, TIMEFRAME_SECONDS } from '@/lib/data/timeframes';
import { decimalsFor, formatPrice } from '@/lib/format';
import { heikinAshi } from '@/lib/indicators/heikinAshi';
import type { Candle, ChartType, Timeframe } from '@/types';
import { ChartContext, ChartCursorContext, type ChartApi } from './ChartContext';
import { Legend } from './Legend';
import { useChartTheme, withAlpha, type ChartTheme } from './theme';

export interface PriceChartProps {
  candles: Candle[];
  chartType: ChartType;
  timeframe: Timeframe;
  tickSize: number;
  /** Shown in the legend, e.g. 'BTC/USDT'. */
  title: string;
  /** Changes when a different symbol or timeframe is shown; resets the view. */
  viewKey: string;
  showVolume?: boolean;
  /** Called with the index of a clicked (or keyboard-selected) candle. */
  onSelectCandle?: (index: number) => void;
  selectedIndex?: number | null;
  /** Called when the user scrolls near the oldest loaded candle. */
  onNeedOlder?: () => void;
  /**
   * For charts inside a scrolling page (lessons): shows every candle, and
   * leaves the mouse wheel and vertical touch drags to the page so the chart
   * does not trap scrolling. Drag sideways to pan; pinch to zoom.
   */
  embedded?: boolean;
  /** Hide the date axis, for hand-made examples whose dates mean nothing. */
  hideTimeAxis?: boolean;
  /** Extra prices the scale must keep in view, such as an annotated stop level. */
  includePrices?: number[];
  /** Indicator rows for the legend. */
  legendExtra?: ReactNode;
  /** Overlays and extra series; they read the chart through useChartApi(). */
  children?: ReactNode;
}

const CHART_TYPE_NAMES: Record<ChartType, string> = {
  candles: 'Candlestick',
  'heikin-ashi': 'Heikin-Ashi',
  line: 'Line',
  area: 'Area',
};

const INITIAL_BARS = 140;
const RIGHT_GAP = 6;

function findIndex(candles: Candle[], time: number): number {
  let lo = 0;
  let hi = candles.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (candles[mid].time === time) return mid;
    if (candles[mid].time < time) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

function chartOptions(theme: ChartTheme) {
  return {
    layout: {
      background: { type: ColorType.Solid, color: theme.background },
      textColor: theme.text,
      fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
      fontSize: 11,
      panes: { separatorColor: theme.border, separatorHoverColor: withAlpha(theme.accent, 0.3) },
    },
    grid: { vertLines: { color: theme.grid }, horzLines: { color: theme.grid } },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: { color: theme.crosshair, style: LineStyle.Dashed, width: 1 as const, labelBackgroundColor: theme.border },
      horzLine: { color: theme.crosshair, style: LineStyle.Dashed, width: 1 as const, labelBackgroundColor: theme.border },
    },
    rightPriceScale: { borderColor: theme.border },
    timeScale: { borderColor: theme.border },
  };
}

function mainSeriesOptions(type: ChartType, theme: ChartTheme) {
  if (type === 'line') return { color: theme.accent, lineWidth: 2 as const, priceLineColor: theme.accent };
  if (type === 'area') {
    return {
      lineColor: theme.accent,
      lineWidth: 2 as const,
      // A flat tint, not a gradient.
      topColor: withAlpha(theme.accent, 0.12),
      bottomColor: withAlpha(theme.accent, 0.12),
      priceLineColor: theme.accent,
    };
  }
  return {
    upColor: theme.up,
    downColor: theme.down,
    borderUpColor: theme.up,
    borderDownColor: theme.down,
    wickUpColor: theme.up,
    wickDownColor: theme.down,
  };
}

function addMainSeries(chart: IChartApi, type: ChartType, theme: ChartTheme): ISeriesApi<SeriesType> {
  const options = mainSeriesOptions(type, theme);
  if (type === 'line') return chart.addSeries(LineSeries, options, 0);
  if (type === 'area') return chart.addSeries(AreaSeries, options, 0);
  return chart.addSeries(CandlestickSeries, options, 0);
}

/**
 * The chart used everywhere prices are plotted. Wraps lightweight-charts and
 * adds a legend, a volume pane, candle selection and keyboard support.
 */
export function PriceChart({
  candles,
  chartType,
  timeframe,
  tickSize,
  title,
  viewKey,
  showVolume = true,
  onSelectCandle,
  selectedIndex = null,
  onNeedOlder,
  embedded = false,
  hideTimeAxis = false,
  includePrices,
  legendExtra,
  children,
}: PriceChartProps) {
  const theme = useChartTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const helpId = useId();
  const [chart, setChart] = useState<IChartApi | null>(null);
  // The series is kept with the chart type it was built for: for one render
  // after the type changes, the old series is still here and must not be fed
  // data shaped for the new one.
  const [main, setMain] = useState<{ series: ISeriesApi<SeriesType>; type: ChartType } | null>(null);
  const series = main && main.type === chartType ? main.series : null;
  const [volume, setVolume] = useState<ISeriesApi<'Histogram'> | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [legendSlot, setLegendSlot] = useState<HTMLElement | null>(null);

  // Latest values for the chart's event handlers, which are subscribed once.
  const live = useRef({ candles, onSelectCandle, onNeedOlder, base: [] as unknown[] });
  useEffect(() => {
    live.current = { candles, onSelectCandle, onNeedOlder, base: [main?.series, volume] };
  });

  const display = useMemo(() => (chartType === 'heikin-ashi' ? heikinAshi(candles) : candles), [candles, chartType]);

  // Create the chart once, with whatever theme is current at that moment.
  const readInitialTheme = useRef(theme);
  // On unmount the chart is destroyed first; later cleanups must not touch it.
  const disposed = useRef(false);
  // Layout cleanups run before every effect cleanup in the tree, so this
  // marks the chart as going away before any child tries to tidy up after
  // itself. A child removing its series at that point would leave a redraw
  // queued for a chart that no longer exists.
  useLayoutEffect(
    () => () => {
      disposed.current = true;
    },
    [],
  );
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const instance = createChart(el, { autoSize: true, ...chartOptions(readInitialTheme.current) });
    disposed.current = false;
    setChart(instance);

    const onMove = (param: MouseEventParams<Time>) => {
      const index = typeof param.time === 'number' ? findIndex(live.current.candles, param.time) : -1;
      setHover(index >= 0 ? index : null);
    };
    const onClick = (param: MouseEventParams<Time>) => {
      // A click on an indicator line belongs to the indicator, not the candle under it.
      if (param.hoveredSeries && !live.current.base.includes(param.hoveredSeries)) return;
      const index = typeof param.time === 'number' ? findIndex(live.current.candles, param.time) : -1;
      if (index >= 0) live.current.onSelectCandle?.(index);
    };
    const onRange = (range: { from: number; to: number } | null) => {
      if (range && range.from < 20) live.current.onNeedOlder?.();
    };
    instance.subscribeCrosshairMove(onMove);
    instance.subscribeClick(onClick);
    instance.timeScale().subscribeVisibleLogicalRangeChange(onRange);

    return () => {
      disposed.current = true;
      mainRef.current = null;
      instance.remove();
      setChart(null);
      setMain(null);
      setVolume(null);
    };
  }, []);

  useEffect(() => {
    chart?.applyOptions({
      handleScroll: { mouseWheel: !embedded, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: !embedded },
      handleScale: { mouseWheel: !embedded, pinch: true, axisPressedMouseMove: true },
    });
  }, [chart, embedded]);

  // Keep annotated prices inside the visible scale.
  const includeKey = (includePrices ?? []).join(',');
  useEffect(() => {
    if (!series) return;
    const extra = includeKey ? includeKey.split(',').map(Number) : [];
    series.applyOptions({
      autoscaleInfoProvider: (original: () => { priceRange: { minValue: number; maxValue: number } | null } | null) => {
        const info = original();
        if (!info?.priceRange || extra.length === 0) return info;
        return {
          ...info,
          priceRange: {
            minValue: Math.min(info.priceRange.minValue, ...extra),
            maxValue: Math.max(info.priceRange.maxValue, ...extra),
          },
        };
      },
    });
  }, [series, includeKey]);

  // Theme changes restyle the existing chart.
  useEffect(() => {
    chart?.applyOptions(chartOptions(theme));
  }, [chart, theme]);

  // The main series is swapped when the chart type changes. The new one is
  // added before the old one is removed: a pane left empty, even for a
  // moment, is deleted by the library and every pane below shifts up.
  const mainRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const themeRef = useRef(theme);
  useEffect(() => {
    if (!chart) return;
    const old = mainRef.current;
    const created = addMainSeries(chart, chartType, themeRef.current);
    mainRef.current = created;
    if (old) chart.removeSeries(old);
    setMain({ series: created, type: chartType });
  }, [chart, chartType]);

  // A theme change restyles the series in place.
  useEffect(() => {
    themeRef.current = theme;
    main?.series.applyOptions(mainSeriesOptions(main.type, theme));
  }, [main, theme]);

  useEffect(() => {
    if (!chart || !showVolume) return;
    const histogram = chart.addSeries(
      HistogramSeries,
      { priceFormat: { type: 'volume' }, priceLineVisible: false, lastValueVisible: false },
      1,
    );
    chart.panes()[1]?.setStretchFactor(0.22);
    chart.panes()[0]?.setStretchFactor(1);
    setVolume(histogram);
    return () => {
      if (!disposed.current) chart.removeSeries(histogram);
      setVolume(null);
    };
  }, [chart, showVolume]);

  useEffect(() => {
    series?.applyOptions({
      priceFormat: { type: 'price', precision: decimalsFor(tickSize), minMove: tickSize },
    });
    chart?.applyOptions({
      timeScale: {
        visible: !hideTimeAxis,
        timeVisible: timeframe !== '1d',
        secondsVisible: false,
        rightOffset: embedded ? 1 : RIGHT_GAP,
      },
      // With no date axis there is nothing for the vertical crosshair label to sit on.
      crosshair: { vertLine: { labelVisible: !hideTimeAxis } },
    });
  }, [chart, series, tickSize, timeframe, embedded, hideTimeAxis]);

  // Push data. A new last candle uses update(); anything else replaces the set.
  const shown = useRef<{
    series: unknown;
    volume: unknown;
    theme: unknown;
    viewKey: string;
    first: number;
    length: number;
  } | null>(null);
  useEffect(() => {
    if (!chart || !series) return;
    const prev = shown.current;
    const n = display.length;
    const first = n ? display[0].time : 0;
    const closeOnly = chartType === 'line' || chartType === 'area';
    const point = (c: Candle) =>
      closeOnly
        ? { time: c.time as UTCTimestamp, value: c.close }
        : { time: c.time as UTCTimestamp, open: c.open, high: c.high, low: c.low, close: c.close };
    const bar = (c: Candle) => ({
      time: c.time as UTCTimestamp,
      value: c.volume,
      color: withAlpha(c.close >= c.open ? theme.up : theme.down, 0.45),
    });

    const sameTarget = prev && prev.series === series && prev.volume === volume && prev.viewKey === viewKey;
    // Volume bars carry their own colours, so a theme change redraws them all.
    const tail =
      sameTarget && prev.theme === theme && n > 0 && prev.first === first && (n === prev.length || n === prev.length + 1);

    if (tail) {
      series.update(point(display[n - 1]));
      volume?.update(bar(display[n - 1]));
    } else {
      const range = chart.timeScale().getVisibleLogicalRange();
      series.setData(display.map(point));
      volume?.setData(display.map(bar));
      if (!prev || prev.viewKey !== viewKey || prev.length === 0) {
        if (n > 0) {
          chart.timeScale().setVisibleLogicalRange(
            embedded ? { from: -1.5, to: n + 0.5 } : { from: n - INITIAL_BARS, to: n + RIGHT_GAP },
          );
        }
      } else if (sameTarget && range && prev.first !== first) {
        // Older candles were added on the left: keep the same candles in view.
        const added = n - prev.length;
        chart.timeScale().setVisibleLogicalRange({ from: range.from + added, to: range.to + added });
      } else if (range) {
        chart.timeScale().setVisibleLogicalRange(range);
      }
    }
    shown.current = { series, volume, theme, viewKey, first, length: n };
  }, [chart, series, volume, display, chartType, viewKey, theme, embedded]);

  // Mark the selected candle.
  const markers = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  useEffect(() => {
    if (!series) return;
    const plugin = createSeriesMarkers(series, []);
    markers.current = plugin;
    return () => {
      markers.current = null;
      if (disposed.current) return;
      try {
        plugin.detach();
      } catch {
        // The series it was attached to has already been swapped out.
      }
    };
  }, [series]);
  const selectedTime = selectedIndex != null ? candles[selectedIndex]?.time : undefined;
  useEffect(() => {
    markers.current?.setMarkers(
      selectedTime != null
        ? [{ time: selectedTime as UTCTimestamp, position: 'aboveBar', shape: 'arrowDown', color: theme.accent, size: 1 }]
        : [],
    );
  }, [series, selectedTime, theme]);

  const api = useMemo<ChartApi | null>(
    () =>
      chart && series
        ? {
            chart,
            series,
            candles,
            stepSeconds: TIMEFRAME_SECONDS[timeframe],
            tickSize,
            theme,
            legendSlot,
            isBaseSeries: (s: unknown) => s === series || s === volume,
            isAlive: () => !disposed.current,
          }
        : null,
    [chart, series, volume, candles, timeframe, tickSize, theme, legendSlot],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !chart || candles.length === 0) return;
    const last = candles.length - 1;
    const current = selectedIndex ?? last;
    let next: number;
    if (e.key === 'ArrowLeft') next = Math.max(0, selectedIndex == null ? last : current - (e.shiftKey ? 10 : 1));
    else if (e.key === 'ArrowRight') next = Math.min(last, current + (e.shiftKey ? 10 : 1));
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else if (e.key === '+' || e.key === '=' || e.key === '-') {
      const range = chart.timeScale().getVisibleLogicalRange();
      if (range) {
        const shrink = e.key === '-' ? -0.25 : 0.2;
        const delta = (range.to - range.from) * shrink;
        chart.timeScale().setVisibleLogicalRange({ from: range.from + delta, to: range.to });
      }
      e.preventDefault();
      return;
    } else return;

    e.preventDefault();
    onSelectCandle?.(next);
    const range = chart.timeScale().getVisibleLogicalRange();
    if (range && (next < range.from + 2 || next > range.to - 2)) {
      const width = range.to - range.from;
      chart.timeScale().setVisibleLogicalRange({ from: next - width / 2, to: next + width / 2 });
    }
  };

  const legendIndex = hover ?? selectedIndex ?? display.length - 1;
  const legendCandle = display[legendIndex];
  const selected = selectedIndex != null ? candles[selectedIndex] : undefined;
  const subtitle = chartType === 'candles' ? timeframe : `${timeframe} · ${CHART_TYPE_NAMES[chartType]}`;

  return (
    <div className="relative size-full min-h-0 overflow-hidden bg-surface">
      <div
        ref={containerRef}
        tabIndex={0}
        role="group"
        aria-label={`${title} ${CHART_TYPE_NAMES[chartType].toLowerCase()} chart, ${TIMEFRAME_NAMES[timeframe]} per candle`}
        aria-describedby={helpId}
        onKeyDown={onKeyDown}
        className="peer absolute inset-0 focus-visible:outline-0"
      />
      {/* The canvas covers an outline on the container, so the focus ring is drawn on top. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden border-2 border-accent peer-focus-visible:block" />
      <p id={helpId} className="sr-only">
        Use the left and right arrow keys to select a candle, Shift with the arrows to move ten at a time, Home and End
        for the first and last candle, and plus and minus to zoom.
      </p>
      <p className="sr-only" aria-live="polite">
        {selected &&
          `Selected candle ${new Date(selected.time * 1000).toISOString().slice(0, timeframe === '1d' ? 10 : 16).replace('T', ' ')}. ` +
            `Open ${formatPrice(selected.open, tickSize)}, high ${formatPrice(selected.high, tickSize)}, ` +
            `low ${formatPrice(selected.low, tickSize)}, close ${formatPrice(selected.close, tickSize)}.`}
      </p>
      <Legend
        title={title}
        subtitle={subtitle}
        candle={legendCandle}
        previousClose={display[legendIndex - 1]?.close}
        tickSize={tickSize}
        closeOnly={chartType === 'line' || chartType === 'area'}
        slotRef={setLegendSlot}
      >
        {legendExtra}
      </Legend>
      <ChartContext.Provider value={api}>
        <ChartCursorContext.Provider value={hover}>{children}</ChartCursorContext.Provider>
      </ChartContext.Provider>
    </div>
  );
}

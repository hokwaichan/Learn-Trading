import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import type { Logical } from 'lightweight-charts';
import { fibLevels, logicalToTime, POINTS_NEEDED, timeToLogical } from '@/lib/drawing/geometry';
import { formatPrice } from '@/lib/format';
import type { Drawing, DrawingPoint, DrawingTool } from '@/types';
import { useChartApi, type ChartApi } from './ChartContext';

export interface DrawingLayerProps {
  drawings: Drawing[];
  /** The tool being drawn with, or null when the chart is in normal mode. */
  activeTool: DrawingTool | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Called when the points for a new drawing have all been placed. */
  onCreate: (tool: DrawingTool, points: DrawingPoint[]) => void;
  onDelete: (id: string) => void;
  /** Called when a draw is abandoned with Escape or a right-click. */
  onCancel: () => void;
}

interface XY {
  x: number;
  y: number;
}

const TOOL_NAMES: Record<DrawingTool, string> = {
  trendline: 'Trend line',
  hline: 'Horizontal line',
  rect: 'Rectangle',
  fib: 'Fibonacci retracement',
  text: 'Note',
};

/** Chart (time, price) -> pixel position inside the price pane. */
export function project(api: ChartApi, point: DrawingPoint): XY | null {
  const logical = timeToLogical(api.candles, point.time, api.stepSeconds) as Logical;
  const x = api.chart.timeScale().logicalToCoordinate(logical);
  const y = api.series.priceToCoordinate(point.price);
  return x == null || y == null ? null : { x, y };
}

function unproject(api: ChartApi, xy: XY): DrawingPoint | null {
  const logical = api.chart.timeScale().coordinateToLogical(xy.x);
  const price = api.series.coordinateToPrice(xy.y);
  if (logical == null || price == null) return null;
  return { time: logicalToTime(api.candles, logical, api.stepSeconds), price };
}

/**
 * Re-renders whenever the chart's view moves. The chart reports time-axis
 * changes but not price-axis ones, so this samples a few projected
 * coordinates each frame and updates only when they differ.
 */
export function useViewVersion(api: ChartApi | null): { width: number; height: number } {
  const [view, setView] = useState({ width: 0, height: 0, signature: '' });
  useEffect(() => {
    if (!api) return;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      try {
        const size = api.chart.paneSize(0);
        const ts = api.chart.timeScale();
        const last = api.candles[api.candles.length - 1]?.close ?? 1;
        const signature = [
          size.width,
          size.height,
          ts.logicalToCoordinate(0 as Logical),
          ts.logicalToCoordinate(100 as Logical),
          api.series.priceToCoordinate(last),
          api.series.priceToCoordinate(last * 1.01),
        ].join('|');
        setView((v) => (v.signature === signature ? v : { width: size.width, height: size.height, signature }));
      } catch {
        // The chart or its series was removed between frames.
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [api]);
  return view;
}

interface ShapeProps {
  api: ChartApi;
  tool: DrawingTool;
  points: DrawingPoint[];
  text?: string;
  width: number;
  selected: boolean;
  preview?: boolean;
}

/** The visible geometry of one drawing. */
function Shape({ api, tool, points, text, width, selected, preview }: ShapeProps): ReactNode {
  const stroke = 'var(--c-accent)';
  const strokeWidth = selected ? 2 : 1.5;
  const dash = preview ? '4 3' : undefined;
  const a = points[0] && project(api, points[0]);
  const b = points[1] && project(api, points[1]);
  const price = (v: number) => formatPrice(v, api.tickSize);
  const handle = (p: XY) => <circle cx={p.x} cy={p.y} r={4} fill="var(--c-surface)" stroke={stroke} strokeWidth={1.5} />;

  if (tool === 'hline') {
    if (!a) return null;
    return (
      <>
        <line x1={0} x2={width} y1={a.y} y2={a.y} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />
        <text x={6} y={a.y - 5} className="num" fontSize={11} fill="var(--c-accent-text)">
          {price(points[0].price)}
        </text>
      </>
    );
  }

  if (tool === 'text') {
    if (!a) return null;
    const label = text || 'Note';
    const w = Math.min(240, label.length * 6.6 + 14);
    return (
      <>
        <circle cx={a.x} cy={a.y} r={3} fill={stroke} />
        <rect
          x={a.x + 8}
          y={a.y - 11}
          width={w}
          height={22}
          rx={4}
          fill="var(--c-raised)"
          stroke={selected ? stroke : 'var(--c-border)'}
          strokeWidth={selected ? 1.5 : 1}
        />
        <text x={a.x + 15} y={a.y + 4} fontSize={12} fill="var(--c-fg)">
          {label.length > 34 ? `${label.slice(0, 33)}…` : label}
        </text>
      </>
    );
  }

  if (!a || !b) return a && preview ? handle(a) : null;

  if (tool === 'trendline') {
    return (
      <>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />
        {(selected || preview) && (
          <>
            {handle(a)}
            {handle(b)}
          </>
        )}
      </>
    );
  }

  if (tool === 'rect') {
    return (
      <rect
        x={Math.min(a.x, b.x)}
        y={Math.min(a.y, b.y)}
        width={Math.abs(b.x - a.x)}
        height={Math.abs(b.y - a.y)}
        fill="color-mix(in srgb, var(--c-accent) 12%, transparent)"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
      />
    );
  }

  // Fibonacci retracement: a level line at each ratio between the two prices.
  const left = Math.min(a.x, b.x);
  const right = Math.max(a.x, b.x);
  return (
    <>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--c-muted)" strokeWidth={1} strokeDasharray="3 3" />
      {fibLevels(points[0].price, points[1].price).map((level) => {
        const y = api.series.priceToCoordinate(level.price);
        if (y == null) return null;
        const edge = level.ratio === 0 || level.ratio === 1;
        return (
          <g key={level.ratio}>
            <line x1={left} x2={right} y1={y} y2={y} stroke={stroke} strokeWidth={edge ? strokeWidth : 1} opacity={edge ? 1 : 0.75} />
            <text x={right + 5} y={y + 4} className="num" fontSize={10.5} fill="var(--c-muted)">
              {level.ratio.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')} · {price(level.price)}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** A wide invisible outline so thin drawings are easy to click. */
function HitArea({ api, drawing, width }: { api: ChartApi; drawing: Drawing; width: number }): ReactNode {
  const a = drawing.points[0] && project(api, drawing.points[0]);
  const b = drawing.points[1] && project(api, drawing.points[1]);
  const common = { stroke: 'transparent', strokeWidth: 12, fill: 'transparent' };
  if (!a) return null;
  if (drawing.tool === 'hline') return <line x1={0} x2={width} y1={a.y} y2={a.y} {...common} />;
  if (drawing.tool === 'text') return <rect x={a.x - 6} y={a.y - 13} width={260} height={26} {...common} pointerEvents="all" />;
  if (!b) return null;
  if (drawing.tool === 'trendline') return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...common} />;
  return (
    <rect
      x={Math.min(a.x, b.x)}
      y={Math.min(a.y, b.y)}
      width={Math.abs(b.x - a.x)}
      height={Math.abs(b.y - a.y)}
      {...common}
      pointerEvents="all"
    />
  );
}

function describe(drawing: Drawing, api: ChartApi): string {
  const price = (v: number) => formatPrice(v, api.tickSize);
  const day = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);
  const [p, q] = drawing.points;
  const body =
    drawing.tool === 'hline'
      ? `at ${price(p.price)}`
      : drawing.tool === 'text'
        ? `"${drawing.text ?? ''}" on ${day(p.time)}`
        : `from ${day(p.time)} at ${price(p.price)} to ${day(q.time)} at ${price(q.price)}`;
  return `${TOOL_NAMES[drawing.tool]} ${body}. Press Delete to remove.`;
}

/**
 * SVG overlay for drawings. Render it as a child of PriceChart.
 *
 * Drawing is click-then-click (tap-then-tap on touch): the first click sets
 * the start, the second sets the end. Escape or a right-click cancels.
 */
export function DrawingLayer({ drawings, activeTool, selectedId, onSelect, onCreate, onDelete, onCancel }: DrawingLayerProps) {
  const api = useChartApi();
  const { width, height } = useViewVersion(api);
  const svgRef = useRef<SVGSVGElement>(null);
  const [placed, setPlaced] = useState<DrawingPoint[]>([]);
  const [cursor, setCursor] = useState<DrawingPoint | null>(null);

  // Starting or switching tools discards a half-finished drawing.
  const [toolSeen, setToolSeen] = useState(activeTool);
  if (toolSeen !== activeTool) {
    setToolSeen(activeTool);
    setPlaced([]);
    setCursor(null);
  }

  useEffect(() => {
    if (!activeTool) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTool, onCancel]);

  if (!api || width === 0) return null;

  const pointAt = (e: MouseEvent): DrawingPoint | null => {
    const box = svgRef.current!.getBoundingClientRect();
    return unproject(api, { x: e.clientX - box.left, y: e.clientY - box.top });
  };

  const onClick = (e: MouseEvent) => {
    if (!activeTool) return;
    const point = pointAt(e);
    if (!point) return;
    const next = [...placed, point];
    if (next.length >= POINTS_NEEDED[activeTool]) {
      setPlaced([]);
      setCursor(null);
      onCreate(activeTool, next);
    } else {
      setPlaced(next);
    }
  };

  const onShapeKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDelete(id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  const previewPoints = activeTool ? [...placed, ...(cursor ? [cursor] : [])] : [];

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 z-[2] overflow-hidden"
      style={{ pointerEvents: activeTool ? 'all' : 'none', cursor: activeTool ? 'crosshair' : undefined, touchAction: 'none' }}
      onClick={onClick}
      onMouseMove={activeTool ? (e) => setCursor(pointAt(e)) : undefined}
      onMouseLeave={() => setCursor(null)}
      onContextMenu={
        activeTool
          ? (e) => {
              e.preventDefault();
              onCancel();
            }
          : undefined
      }
    >
      {drawings.map((drawing) => (
        <g
          key={drawing.id}
          role="button"
          tabIndex={0}
          aria-label={describe(drawing, api)}
          aria-pressed={drawing.id === selectedId}
          style={{ pointerEvents: activeTool ? 'none' : 'stroke', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(drawing.id === selectedId ? null : drawing.id);
          }}
          onKeyDown={(e) => onShapeKey(e, drawing.id)}
        >
          <HitArea api={api} drawing={drawing} width={width} />
          <Shape
            api={api}
            tool={drawing.tool}
            points={drawing.points}
            text={drawing.text}
            width={width}
            selected={drawing.id === selectedId}
          />
        </g>
      ))}
      {activeTool && previewPoints.length > 0 && (
        <g style={{ pointerEvents: 'none' }}>
          <Shape api={api} tool={activeTool} points={previewPoints} width={width} selected={false} preview />
        </g>
      )}
    </svg>
  );
}

export { TOOL_NAMES as DRAWING_TOOL_NAMES };

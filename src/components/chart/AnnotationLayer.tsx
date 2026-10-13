import type { ReactNode } from 'react';
import type { ChartAnnotation } from '@/types';
import { useChartApi } from './ChartContext';
import { project, useViewVersion } from './DrawingLayer';

export interface AnnotationLayerProps {
  annotations: ChartAnnotation[];
}

const CHAR = 6.3;
const BOX_H = 19;
const GAP = 4;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w + GAP && b.x < a.x + a.w + GAP && a.y < b.y + b.h + GAP && b.y < a.y + a.h + GAP;

/**
 * Finds a spot for a label that does not cover one already placed, by
 * stepping it in `direction` (pixels per step) until it is clear.
 */
function place(wanted: Box, placed: Box[], direction: { dx: number; dy: number }, pane: { width: number; height: number }): Box {
  const clamp = (b: Box): Box => ({
    ...b,
    x: Math.max(2, Math.min(b.x, pane.width - b.w - 2)),
    y: Math.max(2, Math.min(b.y, pane.height - b.h - 2)),
  });
  let box = clamp(wanted);
  for (let step = 0; step < 12; step++) {
    const hit = placed.find((p) => overlaps(box, p));
    if (!hit) break;
    const next = clamp({
      ...box,
      x: direction.dx < 0 ? hit.x - box.w - GAP - 2 : direction.dx > 0 ? hit.x + hit.w + GAP + 2 : box.x,
      y: direction.dy < 0 ? hit.y - box.h - GAP - 1 : direction.dy > 0 ? hit.y + hit.h + GAP + 1 : box.y,
    });
    // Pinned against the edge of the pane: accept the overlap rather than loop.
    if (next.x === box.x && next.y === box.y) break;
    box = next;
  }
  placed.push(box);
  return box;
}

function LabelBox({ box, text }: { box: Box; text: string }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={4} fill="var(--c-raised)" stroke="var(--c-border)" />
      <text x={box.x + 6} y={box.y + 13.5} fontSize={11.5} fill="var(--c-fg)">
        {text}
      </text>
    </g>
  );
}

/**
 * Draws a lesson's annotations over a chart: labelled candles, horizontal
 * levels, sloping lines and shaded zones. Read-only. Render it as a child of
 * PriceChart.
 */
export function AnnotationLayer({ annotations }: AnnotationLayerProps) {
  const api = useChartApi();
  const pane = useViewVersion(api);
  if (!api || pane.width === 0) return null;

  const stroke = 'var(--c-accent)';
  const placed: Box[] = [];
  const boxFor = (text: string, x: number, y: number, anchor: 'start' | 'middle' | 'end'): Box => {
    const w = text.length * CHAR + 12;
    return { x: anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2, y, w, h: BOX_H };
  };

  const shapes: ReactNode[] = [];
  const labels: ReactNode[] = [];

  // Levels first: their labels sit at the right edge and step left to make room.
  const ordered = [...annotations.keys()].sort((i, j) => {
    const rank = (a: ChartAnnotation) => (a.kind === 'line' && a.toTime == null ? 0 : a.kind === 'marker' ? 2 : 1);
    return rank(annotations[i]) - rank(annotations[j]);
  });

  for (const i of ordered) {
    const a = annotations[i];

    if (a.kind === 'marker') {
      const candle = api.candles.find((c) => c.time === a.time);
      if (!candle) continue;
      // Above the candle by default; below when the lesson gives a price under its low.
      const below = a.price != null && a.price < candle.low;
      const tip = project(api, { time: a.time, price: below ? candle.low : candle.high });
      if (!tip) continue;
      const edge = below ? tip.y + 3 : tip.y - 3;
      const box = place(
        boxFor(a.label, tip.x, below ? edge + 12 : edge - 12 - BOX_H, 'middle'),
        placed,
        { dx: 0, dy: below ? 1 : -1 },
        pane,
      );
      shapes.push(<line key={`s${i}`} x1={tip.x} x2={tip.x} y1={edge} y2={below ? box.y : box.y + box.h} stroke={stroke} strokeWidth={1.5} />);
      labels.push(<LabelBox key={`l${i}`} box={box} text={a.label} />);
      continue;
    }

    const start = project(api, { time: a.time, price: a.price ?? 0 });
    if (!start) continue;

    if (a.kind === 'line' && a.toTime == null) {
      shapes.push(<line key={`s${i}`} x1={0} x2={pane.width} y1={start.y} y2={start.y} stroke={stroke} strokeWidth={1.5} strokeDasharray="6 3" />);
      if (a.label) {
        const box = place(boxFor(a.label, pane.width - 4, start.y - BOX_H - 2, 'end'), placed, { dx: -1, dy: 0 }, pane);
        labels.push(<LabelBox key={`l${i}`} box={box} text={a.label} />);
      }
      continue;
    }

    const end = project(api, { time: a.toTime ?? a.time, price: a.toPrice ?? a.price ?? 0 });
    if (!end) continue;

    if (a.kind === 'zone') {
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      shapes.push(
        <rect
          key={`s${i}`}
          x={x}
          y={y}
          width={Math.abs(end.x - start.x)}
          height={Math.abs(end.y - start.y)}
          fill="color-mix(in srgb, var(--c-accent) 10%, transparent)"
          stroke={stroke}
          strokeDasharray="4 3"
        />,
      );
      if (a.label) labels.push(<LabelBox key={`l${i}`} box={place(boxFor(a.label, x + 4, y + 4, 'start'), placed, { dx: 0, dy: 1 }, pane)} text={a.label} />);
      continue;
    }

    shapes.push(<line key={`s${i}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={stroke} strokeWidth={2} />);
    if (a.label) {
      const mid = boxFor(a.label, (start.x + end.x) / 2, (start.y + end.y) / 2 - BOX_H - 6, 'middle');
      labels.push(<LabelBox key={`l${i}`} box={place(mid, placed, { dx: 0, dy: -1 }, pane)} text={a.label} />);
    }
  }

  // Labels are drawn last so no line runs across one.
  return (
    <svg width={pane.width} height={pane.height} aria-hidden className="pointer-events-none absolute top-0 left-0 z-[2] overflow-hidden">
      {shapes}
      {labels}
    </svg>
  );
}

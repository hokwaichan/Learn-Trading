import { useId } from 'react';
import { cn } from '@/components/ui';

export interface DiagramSeries {
  points: { x: number; y: number }[];
  /** A CSS colour. Defaults to the accent colour. */
  color?: string;
  dashed?: boolean;
  /** Shown in the key under the diagram. */
  label?: string;
}

export interface LineDiagramProps {
  series: DiagramSeries[];
  /** Describes the diagram for screen readers. */
  ariaLabel: string;
  xLabel?: string;
  yLabel?: string;
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
  /** A vertical marker line, such as the price chosen on a slider. */
  markerX?: number;
  /** Extra vertical reference lines, such as strikes. */
  guidesX?: { x: number; label?: string }[];
  /** Shade the area between the first series and zero in the up and down colours. */
  shadeProfit?: boolean;
  height?: number;
  className?: string;
}

const W = 560;
const PAD = { top: 12, right: 14, bottom: 30, left: 50 };

function niceTicks(min: number, max: number, count: number): number[] {
  if (!(max > min)) return [min];
  const raw = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) ticks.push(Number(v.toPrecision(12)));
  return ticks;
}

/**
 * A plain SVG line plot for payoff diagrams, option value curves and similar
 * teaching diagrams. Scales to the width of its container.
 */
export function LineDiagram({
  series,
  ariaLabel,
  xLabel,
  yLabel,
  formatX = (x) => String(Math.round(x * 100) / 100),
  formatY = (y) => String(Math.round(y * 100) / 100),
  markerX,
  guidesX = [],
  shadeProfit,
  height = 220,
  className,
}: LineDiagramProps) {
  const clipId = useId();
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;

  const xMin = Math.min(...all.map((p) => p.x));
  const xMax = Math.max(...all.map((p) => p.x));
  let yMin = Math.min(0, ...all.map((p) => p.y));
  let yMax = Math.max(0, ...all.map((p) => p.y));
  const span = yMax - yMin || 1;
  yMin -= span * 0.08;
  yMax += span * 0.08;

  const innerW = W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const sx = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const sy = (y: number) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * innerH;
  const path = (points: { x: number; y: number }[]) => points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  const zeroY = sy(0);

  const first = series[0].points;
  const area = `${path(first)} L${sx(first[first.length - 1].x).toFixed(1)},${zeroY.toFixed(1)} L${sx(first[0].x).toFixed(1)},${zeroY.toFixed(1)} Z`;
  const labelled = series.filter((s) => s.label);

  return (
    <figure className={cn('m-0', className)}>
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={ariaLabel} className="block h-auto w-full">
        <defs>
          <clipPath id={`${clipId}-up`}>
            <rect x={PAD.left} y={PAD.top} width={innerW} height={Math.max(0, zeroY - PAD.top)} />
          </clipPath>
          <clipPath id={`${clipId}-down`}>
            <rect x={PAD.left} y={zeroY} width={innerW} height={Math.max(0, PAD.top + innerH - zeroY)} />
          </clipPath>
        </defs>

        {niceTicks(yMin, yMax, 4).map((t) => (
          <g key={`y${t}`}>
            <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} stroke="var(--c-grid)" />
            <text x={PAD.left - 6} y={sy(t) + 3.5} textAnchor="end" fontSize={10.5} className="num" fill="var(--c-muted)">
              {formatY(t)}
            </text>
          </g>
        ))}
        {niceTicks(xMin, xMax, 5).map((t) => (
          <text key={`x${t}`} x={sx(t)} y={height - PAD.bottom + 14} textAnchor="middle" fontSize={10.5} className="num" fill="var(--c-muted)">
            {formatX(t)}
          </text>
        ))}

        {shadeProfit && (
          <>
            <path d={area} fill="var(--c-up)" opacity={0.16} clipPath={`url(#${clipId}-up)`} />
            <path d={area} fill="var(--c-down)" opacity={0.16} clipPath={`url(#${clipId}-down)`} />
          </>
        )}

        <line x1={PAD.left} x2={W - PAD.right} y1={zeroY} y2={zeroY} stroke="var(--c-muted)" strokeWidth={1} />

        {guidesX.map((g) => (
          <g key={`g${g.x}`}>
            <line x1={sx(g.x)} x2={sx(g.x)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--c-border)" strokeDasharray="3 3" />
            {g.label && (
              <text x={sx(g.x)} y={PAD.top + 9} textAnchor="middle" fontSize={10} fill="var(--c-muted)">
                {g.label}
              </text>
            )}
          </g>
        ))}

        {series.map((s, i) => (
          <path
            key={i}
            d={path(s.points)}
            fill="none"
            stroke={s.color ?? 'var(--c-accent)'}
            strokeWidth={i === 0 ? 2 : 1.5}
            strokeDasharray={s.dashed ? '5 4' : undefined}
            strokeLinejoin="round"
          />
        ))}

        {markerX != null && markerX >= xMin && markerX <= xMax && (
          <line x1={sx(markerX)} x2={sx(markerX)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--c-fg)" strokeWidth={1} />
        )}

        {xLabel && (
          <text x={PAD.left + innerW / 2} y={height - 3} textAnchor="middle" fontSize={10.5} fill="var(--c-muted)">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text x={11} y={PAD.top + innerH / 2} textAnchor="middle" fontSize={10.5} fill="var(--c-muted)" transform={`rotate(-90 11 ${PAD.top + innerH / 2})`}>
            {yLabel}
          </text>
        )}
      </svg>
      {labelled.length > 0 && (
        <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {labelled.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <svg width="18" height="6" aria-hidden>
                <line x1="0" x2="18" y1="3" y2="3" stroke={s.color ?? 'var(--c-accent)'} strokeWidth="2" strokeDasharray={s.dashed ? '5 4' : undefined} />
              </svg>
              {s.label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

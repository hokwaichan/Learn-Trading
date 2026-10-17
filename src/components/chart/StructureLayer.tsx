import { useMemo, type ReactNode } from 'react';
import { t } from '@/i18n';
import { KILL_ZONES, sessionRanges, SESSIONS } from '@/lib/structure/sessions';
import { findFairValueGaps, findLiquidityPools, findOrderBlocks, findStructureBreaks, findSweeps, findSwings } from '@/lib/structure/structure';
import { useChartApi } from './ChartContext';
import { project, useViewVersion } from './DrawingLayer';

export interface StructureOverlays {
  /** Swing highs and lows, with breaks of structure and changes of character. */
  structure: boolean;
  fairValueGaps: boolean;
  orderBlocks: boolean;
  /** Equal highs and lows, and sweeps of swing points. */
  liquidity: boolean;
  /** Asia, London and New York session boxes. Intraday charts only. */
  sessions: boolean;
  /** ICT kill zones. Intraday charts only. */
  killZones: boolean;
}

export const NO_OVERLAYS: StructureOverlays = { structure: false, fairValueGaps: false, orderBlocks: false, liquidity: false, sessions: false, killZones: false };

export const OVERLAY_OPTIONS: { key: keyof StructureOverlays; label: string; description: string; intraday?: boolean }[] = [
  { key: 'structure', label: t('Market structure'), description: t('Swing highs and lows, breaks of structure (BOS) and changes of character (CHoCH).') },
  { key: 'fairValueGaps', label: t('Fair value gaps'), description: t('Three-candle gaps price has not traded back through yet. Filled gaps are removed.') },
  { key: 'orderBlocks', label: t('Order blocks'), description: t('The last candle against the move before each structure break, until price returns to it.') },
  { key: 'liquidity', label: t('Liquidity'), description: t('Equal highs and lows where stops gather, and sweeps: wicks beyond a swing that close back inside.') },
  { key: 'sessions', label: t('Sessions'), description: t('Asia, London and New York trading hours, with each session’s range.'), intraday: true },
  { key: 'killZones', label: t('Kill zones'), description: t('The windows ICT traders watch for the day’s main moves.'), intraday: true },
];

/** How many of the most recent candles are analysed. Older ones are off screen in normal use. */
const WINDOW = 500;
const SWING_STRENGTH = 3;
const MAX_SWEEPS = 10;
const SESSION_COLORS: Record<string, string> = {
  asia: 'var(--c-series-3)',
  london: 'var(--c-series-1)',
  'new-york': 'var(--c-series-2)',
  'asia-kz': 'var(--c-series-3)',
  'london-kz': 'var(--c-series-1)',
  'ny-kz': 'var(--c-series-2)',
  'london-close-kz': 'var(--c-series-4)',
};

function Tag({ x, y, text, color, anchor = 'start' }: { x: number; y: number; text: string; color: string; anchor?: 'start' | 'end' | 'middle' }) {
  return (
    <text x={x} y={y} fontSize={10.5} fontWeight={600} fill={color} textAnchor={anchor} paintOrder="stroke" stroke="var(--c-bg)" strokeWidth={3}>
      {text}
    </text>
  );
}

/**
 * Marks price structure and sessions on a PriceChart. Everything is found by
 * the rules in lib/structure; nothing is drawn that a later candle could
 * change, apart from removing a zone once price has dealt with it. Render it
 * as a child of PriceChart.
 */
export function StructureLayer({ overlays }: { overlays: StructureOverlays }) {
  const api = useChartApi();
  const pane = useViewVersion(api);
  const candles = api?.candles;
  const stepSeconds = api?.stepSeconds ?? 0;
  const any = Object.values(overlays).some(Boolean);

  const found = useMemo(() => {
    if (!candles || !any) return null;
    const recent = candles.slice(-WINDOW);
    const swings = findSwings(recent, SWING_STRENGTH);
    const breaks = findStructureBreaks(recent, swings);
    const intraday = stepSeconds > 0 && stepSeconds <= 3600;
    return {
      candles: recent,
      swings,
      breaks,
      gaps: overlays.fairValueGaps ? findFairValueGaps(recent).filter((g) => g.filledAt == null) : [],
      blocks: overlays.orderBlocks ? findOrderBlocks(recent, breaks).filter((b) => b.touchedAt == null) : [],
      pools: overlays.liquidity ? findLiquidityPools(swings) : [],
      // Only the latest few: every swing gets swept sooner or later.
      sweeps: overlays.liquidity ? findSweeps(recent, swings).slice(-MAX_SWEEPS) : [],
      sessions: intraday && overlays.sessions ? sessionRanges(recent, SESSIONS) : [],
      zones: intraday && overlays.killZones ? sessionRanges(recent, KILL_ZONES) : [],
    };
  }, [candles, stepSeconds, any, overlays.fairValueGaps, overlays.orderBlocks, overlays.liquidity, overlays.sessions, overlays.killZones]);

  if (!api || !found || pane.width === 0 || found.candles.length === 0) return null;

  const list = found.candles;
  const last = list[list.length - 1];
  const at = (time: number, price: number) => project(api, { time, price });
  // Half a candle, so boxes cover whole candles rather than running centre to centre.
  const first = at(list[0].time, last.close);
  const second = list.length > 1 ? at(list[1].time, last.close) : null;
  const half = first && second ? Math.abs(second.x - first.x) / 2 : 3;
  const up = 'var(--c-up)';
  const down = 'var(--c-down)';
  const upText = 'var(--c-up-text)';
  const downText = 'var(--c-down-text)';
  const muted = 'var(--c-muted)';
  const shapes: ReactNode[] = [];
  const tags: ReactNode[] = [];

  // Sessions and kill zones sit at the back.
  for (const [group, opacity] of [
    [found.sessions, 0.07],
    [found.zones, 0.14],
  ] as const) {
    group.forEach((range, i) => {
      const a = at(range.from, range.high);
      const b = at(range.to, range.low);
      if (!a || !b) return;
      const color = SESSION_COLORS[range.session.id] ?? muted;
      const key = `${range.session.id}-${i}`;
      const zone = group === found.zones;
      // Kill zones span the full height: they are about time, not price.
      const y = zone ? 0 : a.y;
      const height = zone ? pane.height : Math.max(1, b.y - a.y);
      shapes.push(<rect key={`s-${key}`} x={a.x - half} y={y} width={b.x - a.x + half * 2} height={height} fill={color} fillOpacity={opacity} stroke={zone ? 'none' : color} strokeOpacity={0.5} />);
      tags.push(<Tag key={`t-${key}`} x={a.x - half + 3} y={zone ? pane.height - 8 : Math.max(11, y - 3)} text={range.session.name} color={color} />);
    });
  }

  found.gaps.forEach((gap, i) => {
    const a = at(gap.time, gap.top);
    const b = at(last.time, gap.bottom);
    if (!a || !b) return;
    const bullish = gap.direction === 'bullish';
    shapes.push(<rect key={`g${i}`} x={a.x - half} y={a.y} width={Math.max(2, b.x - a.x + half * 2)} height={Math.max(1, b.y - a.y)} fill={bullish ? up : down} fillOpacity={0.13} stroke={bullish ? up : down} strokeOpacity={0.45} strokeDasharray="3 3" />);
    tags.push(<Tag key={`gt${i}`} x={a.x + half + 3} y={(a.y + b.y) / 2 + 3.5} text={bullish ? t('FVG (bullish)') : t('FVG (bearish)')} color={bullish ? upText : downText} />);
  });

  found.blocks.forEach((block, i) => {
    const a = at(block.time, block.top);
    const b = at(last.time, block.bottom);
    if (!a || !b) return;
    const bullish = block.direction === 'bullish';
    shapes.push(<rect key={`b${i}`} x={a.x - half} y={a.y} width={Math.max(2, b.x - a.x + half * 2)} height={Math.max(1, b.y - a.y)} fill={bullish ? up : down} fillOpacity={0.2} stroke={bullish ? up : down} strokeOpacity={0.8} />);
    tags.push(<Tag key={`bt${i}`} x={a.x + half + 3} y={(a.y + b.y) / 2 + 3.5} text={bullish ? t('Order block (bullish)') : t('Order block (bearish)')} color={bullish ? upText : downText} />);
  });

  if (overlays.structure) {
    for (const swing of found.swings) {
      const p = at(swing.time, swing.price);
      if (!p) continue;
      const high = swing.kind === 'high';
      const y = high ? p.y - 5 : p.y + 5;
      shapes.push(<path key={`sw${swing.index}${swing.kind}`} d={`M${p.x - 4},${high ? y - 5 : y + 5} L${p.x + 4},${high ? y - 5 : y + 5} L${p.x},${y} Z`} fill={muted} />);
    }
    found.breaks.forEach((b, i) => {
      const from = at(list[b.swingIndex].time, b.level);
      const to = at(b.time, b.level);
      if (!from || !to) return;
      const bullish = b.direction === 'bullish';
      const color = bullish ? upText : downText;
      shapes.push(<line key={`br${i}`} x1={from.x} x2={to.x} y1={from.y} y2={to.y} stroke={color} strokeWidth={1.25} strokeDasharray={b.kind === 'choch' ? '5 3' : undefined} />);
      tags.push(<Tag key={`brt${i}`} x={(from.x + to.x) / 2} y={bullish ? from.y - 4 : from.y + 12} text={b.kind === 'choch' ? 'CHoCH' : 'BOS'} color={color} anchor="middle" />);
    });
  }

  found.pools.forEach((pool, i) => {
    const a = at(pool.swings[0].time, pool.price);
    const b = at(pool.swings[pool.swings.length - 1].time, pool.price);
    if (!a || !b) return;
    const highs = pool.kind === 'equal-highs';
    shapes.push(<line key={`p${i}`} x1={a.x} x2={b.x} y1={a.y} y2={b.y} stroke="var(--c-warning)" strokeWidth={1.25} strokeDasharray="2 3" />);
    tags.push(<Tag key={`pt${i}`} x={b.x + 4} y={highs ? a.y - 3 : a.y + 11} text={highs ? t('Equal highs: stops above') : t('Equal lows: stops below')} color="var(--c-warning-text)" />);
  });
  found.sweeps.forEach((sweep, i) => {
    const p = at(sweep.time, sweep.side === 'high' ? list[sweep.index].high : list[sweep.index].low);
    const origin = at(list[sweep.swingIndex].time, sweep.level);
    if (!p || !origin) return;
    const high = sweep.side === 'high';
    shapes.push(<line key={`sv${i}`} x1={origin.x} x2={p.x} y1={origin.y} y2={origin.y} stroke="var(--c-warning)" strokeWidth={1} strokeDasharray="1 3" />);
    tags.push(<Tag key={`svt${i}`} x={p.x} y={high ? p.y - 6 : p.y + 14} text={t('Sweep')} color="var(--c-warning-text)" anchor="middle" />);
  });

  return (
    <svg width={pane.width} height={pane.height} aria-hidden className="pointer-events-none absolute top-0 left-0 z-[1] overflow-hidden">
      {shapes}
      {tags}
    </svg>
  );
}

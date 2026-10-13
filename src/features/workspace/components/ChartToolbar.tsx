import {
  ChartSpline,
  CircleHelp,
  Minus,
  MousePointer2,
  Rows3,
  Slash,
  Square,
  Star,
  Trash2,
  Type,
} from 'lucide-react';
import { DRAWING_TOOL_NAMES } from '@/components/chart';
import { Button, cn, IconButton, Select, Tooltip } from '@/components/ui';
import { displaySymbol, TIMEFRAME_NAMES, TIMEFRAMES } from '@/lib/data';
import type { ChartType, DrawingTool, Instrument, Timeframe } from '@/types';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'candles', label: 'Candles' },
  { value: 'heikin-ashi', label: 'Heikin-Ashi' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
];

const TOOLS: { tool: DrawingTool; icon: React.ReactNode; hint: string }[] = [
  { tool: 'trendline', icon: <Slash className="size-4" />, hint: 'click two points' },
  { tool: 'hline', icon: <Minus className="size-4" />, hint: 'click a price' },
  { tool: 'rect', icon: <Square className="size-4" />, hint: 'click two corners' },
  { tool: 'fib', icon: <Rows3 className="size-4" />, hint: 'click the start and end of a move' },
  { tool: 'text', icon: <Type className="size-4" />, hint: 'click where the note goes' },
];

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

export interface ChartToolbarProps {
  instrument: Instrument;
  /** Choices in the symbol menu. */
  symbols: Instrument[];
  onSymbol: (symbol: string) => void;
  timeframe: Timeframe;
  onTimeframe: (timeframe: Timeframe) => void;
  chartType: ChartType;
  onChartType: (type: ChartType) => void;
  indicatorCount: number;
  onOpenIndicators: () => void;
  tool: DrawingTool | null;
  onTool: (tool: DrawingTool | null) => void;
  drawingCount: number;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onClearDrawings: () => void;
  explainMode: boolean;
  onExplainMode: (on: boolean) => void;
  watched: boolean;
  /** Omit to hide the watchlist star. */
  onToggleWatch?: () => void;
}

/** Symbol, timeframe, chart type and drawing tools. Scrolls sideways on phones. */
export function ChartToolbar(props: ChartToolbarProps) {
  const { instrument, timeframe, chartType, tool } = props;

  return (
    <div
      role="toolbar"
      aria-label="Chart"
      className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-surface px-2"
    >
      <Select
        aria-label="Symbol"
        className="num w-36 font-medium"
        wrapperClassName="shrink-0"
        value={instrument.symbol}
        onChange={props.onSymbol}
        options={props.symbols.map((i) => ({ value: i.symbol, label: displaySymbol(i) }))}
      />
      {props.onToggleWatch && (
        <IconButton
          label={props.watched ? 'Remove from watchlist' : 'Add to watchlist'}
          active={props.watched}
          icon={<Star className="size-4" fill={props.watched ? 'currentColor' : 'none'} />}
          onClick={props.onToggleWatch}
        />
      )}

      <Divider />

      <div role="group" aria-label="Timeframe" className="flex shrink-0 items-center gap-0.5">
        {TIMEFRAMES.map((tf) => {
          const available = instrument.timeframes.includes(tf);
          const button = (
            <button
              key={tf}
              type="button"
              aria-pressed={tf === timeframe}
              aria-label={TIMEFRAME_NAMES[tf]}
              aria-disabled={!available}
              onClick={() => available && props.onTimeframe(tf)}
              className={cn(
                'num h-7 rounded-control px-2 text-xs transition-colors duration-150',
                tf === timeframe ? 'bg-accent/15 font-medium text-accent-text' : 'text-muted hover:bg-raised hover:text-fg',
                !available && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted',
              )}
            >
              {tf}
            </button>
          );
          return available ? (
            button
          ) : (
            <Tooltip key={tf} content={`${displaySymbol(instrument)} has daily data only`}>
              {button}
            </Tooltip>
          );
        })}
      </div>

      <Divider />

      <Select
        aria-label="Chart type"
        className="w-32"
        wrapperClassName="shrink-0"
        value={chartType}
        onChange={props.onChartType}
        options={CHART_TYPES}
      />
      <Button
        variant="ghost"
        className="shrink-0"
        icon={<ChartSpline aria-hidden className="size-4" />}
        onClick={props.onOpenIndicators}
      >
        Indicators
        {props.indicatorCount > 0 && <span className="num text-xs text-accent-text">{props.indicatorCount}</span>}
      </Button>

      <Divider />

      <div role="group" aria-label="Drawing tools" className="flex shrink-0 items-center gap-0.5">
        <IconButton
          label="Pointer (stop drawing)"
          active={tool === null}
          icon={<MousePointer2 className="size-4" />}
          onClick={() => props.onTool(null)}
        />
        {TOOLS.map((t) => (
          <IconButton
            key={t.tool}
            label={`${DRAWING_TOOL_NAMES[t.tool]}: ${t.hint}`}
            active={tool === t.tool}
            icon={t.icon}
            onClick={() => props.onTool(tool === t.tool ? null : t.tool)}
          />
        ))}
        <IconButton
          label={props.hasSelection ? 'Delete selected drawing' : 'Clear all drawings on this symbol'}
          icon={<Trash2 className="size-4" />}
          disabled={!props.hasSelection && props.drawingCount === 0}
          onClick={props.hasSelection ? props.onDeleteSelected : props.onClearDrawings}
        />
      </div>

      <div className="min-w-2 flex-1" />

      <IconButton
        label={
          props.explainMode
            ? 'Explain mode is on: clicking a candle opens its explanation'
            : 'Explain mode is off: turn on to explain a candle when you click it'
        }
        active={props.explainMode}
        icon={<CircleHelp className="size-4" />}
        onClick={() => props.onExplainMode(!props.explainMode)}
      />
    </div>
  );
}

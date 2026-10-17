import {
  ChartSpline,
  Layers,
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
import { t } from '@/i18n';
import { displaySymbol, TIMEFRAME_NAMES, TIMEFRAMES } from '@/lib/data';
import type { ChartType, DrawingTool, Instrument, Timeframe } from '@/types';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'candles', label: t('Candles') },
  { value: 'heikin-ashi', label: t('Heikin-Ashi') },
  { value: 'line', label: t('Line') },
  { value: 'area', label: t('Area') },
];

const TOOLS: { tool: DrawingTool; icon: React.ReactNode; hint: string }[] = [
  { tool: 'trendline', icon: <Slash className="size-4" />, hint: t('pick two points') },
  { tool: 'hline', icon: <Minus className="size-4" />, hint: t('pick a price') },
  { tool: 'rect', icon: <Square className="size-4" />, hint: t('pick two corners') },
  { tool: 'fib', icon: <Rows3 className="size-4" />, hint: t('pick the start and end of a move') },
  { tool: 'text', icon: <Type className="size-4" />, hint: t('pick where the note goes') },
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
  overlayCount: number;
  onOpenOverlays: () => void;
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
      aria-label={t('Chart')}
      className="flex h-11 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-surface px-2"
    >
      <Select
        aria-label={t('Symbol')}
        className="num w-36 font-medium"
        wrapperClassName="shrink-0"
        value={instrument.symbol}
        onChange={props.onSymbol}
        options={props.symbols.map((i) => ({ value: i.symbol, label: displaySymbol(i) }))}
      />
      {props.onToggleWatch && (
        <IconButton
          label={props.watched ? t('Remove from watchlist') : t('Add to watchlist')}
          active={props.watched}
          icon={<Star className="size-4" fill={props.watched ? 'currentColor' : 'none'} />}
          onClick={props.onToggleWatch}
        />
      )}

      <Divider />

      <div role="group" aria-label={t('Timeframe')} className="flex shrink-0 items-center gap-0.5">
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
            <Tooltip key={tf} content={t('{symbol} has daily data only', { symbol: displaySymbol(instrument) })}>
              {button}
            </Tooltip>
          );
        })}
      </div>

      <Divider />

      <Select
        aria-label={t('Chart type')}
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
        {t('Indicators')}
        {props.indicatorCount > 0 && <span className="num text-xs text-accent-text">{props.indicatorCount}</span>}
      </Button>
      <Button variant="ghost" className="shrink-0" icon={<Layers aria-hidden className="size-4" />} onClick={props.onOpenOverlays}>
        {t('Overlays')}
        {props.overlayCount > 0 && <span className="num text-xs text-accent-text">{props.overlayCount}</span>}
      </Button>

      <Divider />

      <div role="group" aria-label={t('Drawing tools')} className="flex shrink-0 items-center gap-0.5">
        <IconButton
          label={t('Pointer (stop drawing)')}
          active={tool === null}
          icon={<MousePointer2 className="size-4" />}
          onClick={() => props.onTool(null)}
        />
        {TOOLS.map((item) => (
          <IconButton
            key={item.tool}
            label={t('{tool}: {hint}', { tool: DRAWING_TOOL_NAMES[item.tool], hint: item.hint })}
            active={tool === item.tool}
            icon={item.icon}
            onClick={() => props.onTool(tool === item.tool ? null : item.tool)}
          />
        ))}
        <IconButton
          label={props.hasSelection ? t('Delete selected drawing') : t('Clear all drawings on this symbol')}
          icon={<Trash2 className="size-4" />}
          disabled={!props.hasSelection && props.drawingCount === 0}
          onClick={props.hasSelection ? props.onDeleteSelected : props.onClearDrawings}
        />
      </div>

      <div className="min-w-2 flex-1" />

      <IconButton
        label={
          props.explainMode
            ? t('Explain mode is on: clicking a candle opens its explanation')
            : t('Explain mode is off: turn on to explain a candle when you click it')
        }
        active={props.explainMode}
        icon={<CircleHelp className="size-4" />}
        onClick={() => props.onExplainMode(!props.explainMode)}
      />
    </div>
  );
}

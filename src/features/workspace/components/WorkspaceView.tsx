import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { PanelRightOpen } from 'lucide-react';
import { DrawingLayer, IndicatorLayer, NO_OVERLAYS, OVERLAY_OPTIONS, PriceChart, StructureLayer, type StructureOverlays } from '@/components/chart';
import {
  BottomSheet,
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  LoadingState,
  Modal,
  ResizablePanel,
  Spinner,
  toast,
  useIsCompact,
  useIsTouch,
} from '@/components/ui';
import { useTradeLines } from '@/features/paper-trading';
import { t } from '@/i18n';
import { displaySymbol, TIMEFRAME_SECONDS } from '@/lib/data';
import { quoteKey, useDrawings, useMarket, useSymbolDrawings, type WorkspaceMode } from '@/stores';
import type { Candle, DrawingPoint, DrawingTool, Instrument, Timeframe } from '@/types';
import { usePersistentState } from '../hooks/usePersistentState';
import { ChartToolbar } from './ChartToolbar';
import { ExplainPanel } from './ExplainPanel';
import { IndicatorsDialog } from './IndicatorsDialog';
import { OverlaysDialog } from './OverlaysDialog';
import { BOTTOM_TABS, BottomPanel, BottomTabContent, RIGHT_TABS, RightPanel, type AccountView, type BottomTab, type RightTab } from './Panels';
import { WatchlistPanel } from './WatchlistPanel';

export interface WorkspaceViewProps {
  /** Which saved layout (chart type, indicators) and panel preferences to use. */
  mode: WorkspaceMode;
  instrument: Instrument;
  /** Choices in the symbol menu. */
  symbols: Instrument[];
  onSymbol: (symbol: string) => void;
  timeframe: Timeframe;
  onTimeframe: (timeframe: Timeframe) => void;
  candles: Candle[];
  status: 'loading' | 'ready' | 'error';
  error?: string;
  onRetry: () => void;
  /** Called when the user scrolls near the oldest candle. */
  onNeedOlder?: () => void;
  loadingOlder?: boolean;
  /** True when the newest candle is still forming. False in Replay, where every candle shown is finished. */
  live: boolean;
  /** Changes when a different chart is shown; resets the view and selections. */
  viewKey: string;
  /** Strips of information between the toolbar and the chart. */
  notices?: ReactNode;
  /** The Order tab. */
  order: ReactNode;
  /** Which account the position lines and tables show. */
  account: AccountView;
  /** Shown instead of the chart, for example a set-up form before a replay starts. */
  placeholder?: ReactNode;
  /** A bar docked under the chart, such as the replay controls. */
  belowChart?: ReactNode;
  showWatchlist?: boolean;
}

/**
 * The chart workspace: toolbar, chart with drawings and indicators, a side
 * panel (Order, Explain, Watchlist) and an account panel (Positions, Orders,
 * History). On phones and upright tablets the panels become bottom sheets. Used by Charts,
 * Futures and Replay, which differ only in where candles and prices come from.
 */
export function WorkspaceView(props: WorkspaceViewProps) {
  const { mode, instrument, timeframe, candles, account, showWatchlist = true } = props;
  // Phones and upright tablets: panels open as bottom sheets so the chart keeps the full width.
  const compact = useIsCompact();
  const touch = useIsTouch();
  const layout = useMarket((s) => s.layouts[mode]);
  const setLayout = useMarket((s) => s.setLayout);
  const toggleWatch = useMarket((s) => s.toggleWatch);
  const watched = useMarket((s) => s.watchlist.some((w) => quoteKey(w) === quoteKey(instrument)));

  const tradeLines = useTradeLines(instrument, account.accountId);
  const drawings = useSymbolDrawings(instrument.symbol);
  const addDrawing = useDrawings((s) => s.add);
  const removeDrawing = useDrawings((s) => s.remove);
  const clearDrawings = useDrawings((s) => s.clear);

  const [tool, setTool] = useState<DrawingTool | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [note, setNote] = useState<{ point: DrawingPoint; text: string } | null>(null);

  // The selection is kept as a time: indices shift when older candles load.
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const selectedIndex = useMemo(() => {
    if (selectedTime == null) return null;
    const i = candles.findIndex((c) => c.time === selectedTime);
    return i >= 0 ? i : null;
  }, [candles, selectedTime]);

  // What the Explain tab is about: the selected candle, or an indicator.
  const [explainKey, setExplainKey] = useState<string | null>(null);
  const [indicatorsOpen, setIndicatorsOpen] = useState(false);
  const explainIndicator = layout.indicators.find((i) => i.key === explainKey && i.visible);

  const tabs = useMemo(() => (showWatchlist ? RIGHT_TABS : RIGHT_TABS.filter((t) => t.id !== 'watchlist')), [showWatchlist]);
  const [explainMode, setExplainMode] = usePersistentState('explainMode', true);
  const [savedOverlays, setOverlays] = usePersistentState<StructureOverlays>('overlays', NO_OVERLAYS);
  // Saved choices from an older build may lack newer overlays.
  const overlays = useMemo(() => ({ ...NO_OVERLAYS, ...savedOverlays }), [savedOverlays]);
  const [overlaysOpen, setOverlaysOpen] = useState(false);
  const intraday = TIMEFRAME_SECONDS[timeframe] <= 3600;
  const overlayCount = OVERLAY_OPTIONS.filter((o) => overlays[o.key] && (intraday || !o.intraday)).length;
  const [savedRightTab, setRightTab] = usePersistentState<RightTab>(`${mode}.rightTab`, 'order');
  const rightTab = tabs.some((t) => t.id === savedRightTab) ? savedRightTab : 'order';
  const [bottomTab, setBottomTab] = usePersistentState<BottomTab>(`${mode}.bottomTab`, 'positions');
  const [rightCollapsed, setRightCollapsed] = usePersistentState('rightCollapsed', false);
  const [bottomCollapsed, setBottomCollapsed] = usePersistentState('bottomCollapsed', false);
  const [sheet, setSheet] = useState<RightTab | BottomTab | null>(null);

  // Reset per-chart selections when a different chart is shown.
  const [seenKey, setSeenKey] = useState(props.viewKey);
  if (seenKey !== props.viewKey) {
    setSeenKey(props.viewKey);
    setSelectedTime(null);
    setSelectedDrawing(null);
    setTool(null);
  }

  const showExplain = useCallback(() => {
    if (compact) setSheet('explain');
    else {
      setRightTab('explain');
      setRightCollapsed(false);
    }
  }, [compact, setRightTab, setRightCollapsed]);

  const onSelectIndicator = useCallback(
    (key: string) => {
      setExplainKey(key);
      setSelectedDrawing(null);
      showExplain();
    },
    [showExplain],
  );

  const onSelectCandle = useCallback(
    (index: number) => {
      const candle = candles[index];
      if (!candle) return;
      setSelectedTime(candle.time);
      setSelectedDrawing(null);
      setExplainKey(null);
      if (explainMode) showExplain();
    },
    [candles, explainMode, showExplain],
  );

  const onCreateDrawing = useCallback(
    (created: DrawingTool, points: DrawingPoint[]) => {
      setTool(null);
      if (created === 'text') {
        setNote({ point: points[0], text: '' });
        return;
      }
      const drawing = addDrawing({ symbol: instrument.symbol, tool: created, points });
      setSelectedDrawing(drawing.id);
    },
    [addDrawing, instrument.symbol],
  );

  const onDeleteDrawing = useCallback(
    (id: string) => {
      removeDrawing(instrument.symbol, id);
      setSelectedDrawing(null);
    },
    [removeDrawing, instrument.symbol],
  );

  const cancelTool = useCallback(() => setTool(null), []);

  const saveNote = () => {
    if (!note || !note.text.trim()) return;
    addDrawing({ symbol: instrument.symbol, tool: 'text', points: [note.point], text: note.text.trim() });
    setNote(null);
  };

  const content: Record<RightTab, ReactNode> = {
    order: props.order,
    explain: (
      <ExplainPanel
        instrument={instrument}
        timeframe={timeframe}
        candles={candles}
        selectedIndex={selectedIndex}
        indicator={explainIndicator}
        live={props.live}
      />
    ),
    watchlist: <WatchlistPanel current={instrument} />,
  };

  const chartArea = (
    <div className="relative min-h-0 flex-1">
      {props.placeholder ?? (
        <>
          {props.status === 'loading' && <LoadingState className="h-full" label={t('Loading {symbol} prices', { symbol: displaySymbol(instrument) })} />}
          {props.status === 'error' && <ErrorState className="h-full" title={t('Could not load prices')} message={props.error} onRetry={props.onRetry} />}
          {props.status === 'ready' && candles.length === 0 && (
            <EmptyState className="h-full" title={t('No candles for this timeframe')} description={t('Try a longer timeframe.')} />
          )}
          {props.status === 'ready' && candles.length > 0 && (
            <PriceChart
              candles={candles}
              chartType={layout.chartType}
              timeframe={timeframe}
              tickSize={instrument.tickSize}
              title={displaySymbol(instrument)}
              viewKey={props.viewKey}
              selectedIndex={selectedIndex}
              onSelectCandle={onSelectCandle}
              onNeedOlder={props.onNeedOlder}
              priceLines={tradeLines}
            >
              <StructureLayer overlays={overlays} />
              <IndicatorLayer indicators={layout.indicators} onSelect={onSelectIndicator} selectedKey={explainIndicator?.key} />
              <DrawingLayer
                drawings={drawings}
                activeTool={tool}
                selectedId={selectedDrawing}
                onSelect={setSelectedDrawing}
                onCreate={onCreateDrawing}
                onDelete={onDeleteDrawing}
                onCancel={cancelTool}
              />
            </PriceChart>
          )}
          {props.loadingOlder && (
            <div className="pointer-events-none absolute bottom-8 left-2 z-[4] rounded-control bg-raised px-2 py-1 shadow-raised">
              <Spinner label={t('Loading older candles')} className="text-xs" />
            </div>
          )}
          {tool && (
            <div className="pointer-events-none absolute top-8 left-1/2 z-[4] -translate-x-1/2 rounded-control bg-raised px-2.5 py-1 text-xs text-fg shadow-raised">
              {touch ? t('Tap the chart to place a point. Tap the tool again to cancel.') : t('Click on the chart to place a point. Press Esc to cancel.')}
            </div>
          )}
        </>
      )}
    </div>
  );

  const sheetTabs = [...tabs, ...BOTTOM_TABS];

  return (
    <div className="flex h-full flex-col">
      <ChartToolbar
        instrument={instrument}
        symbols={props.symbols}
        onSymbol={props.onSymbol}
        timeframe={timeframe}
        onTimeframe={props.onTimeframe}
        chartType={layout.chartType}
        onChartType={(chartType) => setLayout(mode, { chartType })}
        indicatorCount={layout.indicators.length}
        onOpenIndicators={() => setIndicatorsOpen(true)}
        overlayCount={overlayCount}
        onOpenOverlays={() => setOverlaysOpen(true)}
        tool={tool}
        onTool={(next) => {
          setTool(next);
          setSelectedDrawing(null);
        }}
        drawingCount={drawings.length}
        hasSelection={selectedDrawing != null}
        onDeleteSelected={() => selectedDrawing && onDeleteDrawing(selectedDrawing)}
        onClearDrawings={() => setConfirmClear(true)}
        explainMode={explainMode}
        onExplainMode={setExplainMode}
        watched={watched}
        onToggleWatch={showWatchlist ? () => toggleWatch({ symbol: instrument.symbol, kind: instrument.kind }) : undefined}
      />

      {props.notices}

      {compact ? (
        <>
          {chartArea}
          {props.belowChart}
          <div role="group" aria-label={t('Panels')} className="flex shrink-0 gap-1 overflow-x-auto border-t border-border bg-surface p-1.5">
            {sheetTabs.map((t) => (
              <Button key={t.id} size="sm" variant="ghost" icon={t.icon} className="shrink-0" onClick={() => setSheet(t.id)}>
                {t.label}
              </Button>
            ))}
          </div>
          <BottomSheet
            open={sheet != null}
            onClose={() => setSheet(null)}
            title={sheetTabs.find((t) => t.id === sheet)?.label ?? ''}
            tall={sheet === 'explain' || sheet === 'watchlist' || sheet === 'order'}
          >
            {(sheet === 'order' || sheet === 'explain' || sheet === 'watchlist') && content[sheet]}
            {(sheet === 'positions' || sheet === 'orders' || sheet === 'history') && <BottomTabContent tab={sheet} {...account} />}
          </BottomSheet>
        </>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            {chartArea}
            {props.belowChart}
            <ResizablePanel
              dock="bottom"
              label={t('Account panel')}
              storageKey="ws-bottom"
              defaultSize={200}
              minSize={120}
              maxSize={480}
              collapsed={bottomCollapsed}
              onCollapsedChange={setBottomCollapsed}
              collapsedContent={<BottomPanel tab={bottomTab} onTab={setBottomTab} collapsed onToggle={() => setBottomCollapsed(false)} {...account} />}
            >
              <BottomPanel tab={bottomTab} onTab={setBottomTab} collapsed={false} onToggle={() => setBottomCollapsed(true)} {...account} />
            </ResizablePanel>
          </div>
          <ResizablePanel
            dock="right"
            label={t('Side panel')}
            storageKey="ws-right"
            defaultSize={320}
            minSize={260}
            maxSize={520}
            collapsed={rightCollapsed}
            onCollapsedChange={setRightCollapsed}
            collapsedContent={
              <div className="flex h-full flex-col items-center gap-1 p-1">
                <IconButton
                  label={t('Expand side panel')}
                  aria-expanded={false}
                  tooltipSide="left"
                  icon={<PanelRightOpen className="size-4" />}
                  onClick={() => setRightCollapsed(false)}
                />
                {tabs.map((t) => (
                  <IconButton
                    key={t.id}
                    label={t.label}
                    tooltipSide="left"
                    icon={t.icon}
                    onClick={() => {
                      setRightTab(t.id);
                      setRightCollapsed(false);
                    }}
                  />
                ))}
              </div>
            }
          >
            <RightPanel tabs={tabs} tab={rightTab} onTab={setRightTab} onCollapse={() => setRightCollapsed(true)} content={content} />
          </ResizablePanel>
        </div>
      )}

      <OverlaysDialog open={overlaysOpen} onClose={() => setOverlaysOpen(false)} overlays={overlays} onChange={setOverlays} intraday={intraday} />
      <IndicatorsDialog
        open={indicatorsOpen}
        onClose={() => setIndicatorsOpen(false)}
        indicators={layout.indicators}
        onChange={(indicators) => setLayout(mode, { indicators })}
        onExplain={onSelectIndicator}
      />

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          clearDrawings(instrument.symbol);
          setSelectedDrawing(null);
          toast.info(t('Drawings cleared'));
        }}
        title={t('Clear all drawings?')}
        confirmLabel={t('Clear drawings')}
      >
        {drawings.length === 1
          ? t('This removes the 1 drawing on {symbol}. This cannot be undone.', { symbol: displaySymbol(instrument) })
          : t('This removes all {n} drawings on {symbol}. This cannot be undone.', { n: drawings.length, symbol: displaySymbol(instrument) })}
      </ConfirmDialog>

      <Modal
        open={note != null}
        onClose={() => setNote(null)}
        title={t('Add a note')}
        size="sm"
        footer={
          <>
            <Button onClick={() => setNote(null)}>{t('Cancel')}</Button>
            <Button variant="primary" disabled={!note?.text.trim()} onClick={saveNote}>
              {t('Add note')}
            </Button>
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveNote();
          }}
        >
          <Input
            label={t('Note text')}
            data-autofocus
            maxLength={80}
            value={note?.text ?? ''}
            onChange={(e) => setNote((n) => (n ? { ...n, text: e.target.value } : n))}
            hint={t('Shown on the chart at the point you clicked.')}
          />
        </form>
      </Modal>
    </div>
  );
}

/** A strip of information between the toolbar and the chart. */
export function WorkspaceNotice({ icon, children, action }: { icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" className="flex shrink-0 items-center gap-2 border-b border-border bg-bg px-3 py-1.5 text-xs text-muted">
      <span className="shrink-0 text-warning-text">{icon}</span>
      <span className="min-w-0 flex-1">{children}</span>
      {action}
    </div>
  );
}

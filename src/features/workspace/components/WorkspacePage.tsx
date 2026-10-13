import { useCallback, useMemo, useState } from 'react';
import { Info, PanelRightOpen, SearchX, WifiOff } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { DrawingLayer, PriceChart } from '@/components/chart';
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
  useIsPhone,
} from '@/components/ui';
import { displaySymbol, findInstrument, instrumentsOfKind } from '@/lib/data';
import { quoteKey, useCandleSeries, useDrawings, useMarket, useSymbolDrawings, type WorkspaceMode } from '@/stores';
import type { DrawingPoint, DrawingTool, Instrument } from '@/types';
import { usePersistentState } from '../hooks/usePersistentState';
import { ChartToolbar } from './ChartToolbar';
import { ExplainPanel } from './ExplainPanel';
import {
  BOTTOM_TABS,
  BottomPanel,
  BottomTabContent,
  OrderPlaceholder,
  RIGHT_TABS,
  RightPanel,
  type BottomTab,
  type RightTab,
} from './Panels';
import { WatchlistPanel } from './WatchlistPanel';

function Notice({ icon, children, action }: { icon: React.ReactNode; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div role="status" className="flex shrink-0 items-center gap-2 border-b border-border bg-bg px-3 py-1.5 text-xs text-muted">
      <span className="shrink-0 text-warning-text">{icon}</span>
      <span className="min-w-0 flex-1">{children}</span>
      {action}
    </div>
  );
}

function UnknownSymbol({ symbol, mode }: { symbol: string; mode: WorkspaceMode }) {
  const kind = mode === 'futures' ? 'perpetual' : 'spot';
  const base = mode === 'futures' ? '/futures' : '/charts';
  return (
    <EmptyState
      className="h-full"
      icon={<SearchX />}
      title={`No ${mode === 'futures' ? 'futures contract' : 'chart'} for "${symbol}"`}
      description="Pick one of the available symbols:"
      action={
        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {instrumentsOfKind(kind).map((i) => (
            <Link key={i.symbol} to={`${base}/${i.symbol}`} className="num text-sm text-accent-text underline underline-offset-4">
              {displaySymbol(i)}
            </Link>
          ))}
        </div>
      }
    />
  );
}

function Workspace({ instrument, mode }: { instrument: Instrument; mode: WorkspaceMode }) {
  const isPhone = useIsPhone();
  const layout = useMarket((s) => s.layouts[mode]);
  const setLayout = useMarket((s) => s.setLayout);
  const load = useMarket((s) => s.load);
  const loadOlder = useMarket((s) => s.loadOlder);
  const toggleWatch = useMarket((s) => s.toggleWatch);
  const watched = useMarket((s) => s.watchlist.some((w) => quoteKey(w) === quoteKey(instrument)));

  // Bundled symbols only have daily data, whatever the saved timeframe is.
  const timeframe = instrument.timeframes.includes(layout.timeframe) ? layout.timeframe : '1d';
  const series = useCandleSeries(instrument, timeframe);
  const { candles } = series;

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

  const [explainMode, setExplainMode] = usePersistentState('explainMode', true);
  const [rightTab, setRightTab] = usePersistentState<RightTab>(`${mode}.rightTab`, 'explain');
  const [bottomTab, setBottomTab] = usePersistentState<BottomTab>(`${mode}.bottomTab`, 'positions');
  const [rightCollapsed, setRightCollapsed] = usePersistentState('rightCollapsed', false);
  const [bottomCollapsed, setBottomCollapsed] = usePersistentState('bottomCollapsed', false);
  const [sheet, setSheet] = useState<RightTab | BottomTab | null>(null);

  // Reset per-chart selections when the symbol or timeframe changes.
  const viewKey = `${instrument.kind}:${instrument.symbol}:${timeframe}`;
  const [seenKey, setSeenKey] = useState(viewKey);
  if (seenKey !== viewKey) {
    setSeenKey(viewKey);
    setSelectedTime(null);
    setSelectedDrawing(null);
    setTool(null);
  }

  const onSelectCandle = useCallback(
    (index: number) => {
      const candle = candles[index];
      if (!candle) return;
      setSelectedTime(candle.time);
      setSelectedDrawing(null);
      if (!explainMode) return;
      if (isPhone) setSheet('explain');
      else {
        setRightTab('explain');
        setRightCollapsed(false);
      }
    },
    [candles, explainMode, isPhone, setRightTab, setRightCollapsed],
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
  const needOlder = useCallback(() => void loadOlder(instrument, timeframe), [loadOlder, instrument, timeframe]);

  const saveNote = () => {
    if (!note || !note.text.trim()) return;
    addDrawing({ symbol: instrument.symbol, tool: 'text', points: [note.point], text: note.text.trim() });
    setNote(null);
  };

  const explain = (
    <ExplainPanel instrument={instrument} timeframe={timeframe} candles={candles} selectedIndex={selectedIndex} />
  );
  const order = <OrderPlaceholder mode={mode} />;
  const watchlist = <WatchlistPanel current={instrument} />;
  const lastDay = candles.length ? new Date(candles[candles.length - 1].time * 1000).toISOString().slice(0, 10) : '';

  const chartArea = (
    <div className="relative min-h-0 flex-1">
      {series.status === 'loading' && <LoadingState className="h-full" label={`Loading ${displaySymbol(instrument)} prices`} />}
      {series.status === 'error' && (
        <ErrorState
          className="h-full"
          title="Could not load prices"
          message={series.error}
          onRetry={() => void load(instrument, timeframe)}
        />
      )}
      {series.status === 'ready' && candles.length === 0 && (
        <EmptyState className="h-full" title="No candles for this timeframe" description="Try a longer timeframe." />
      )}
      {series.status === 'ready' && candles.length > 0 && (
        <PriceChart
          candles={candles}
          chartType={layout.chartType}
          timeframe={timeframe}
          tickSize={instrument.tickSize}
          title={displaySymbol(instrument)}
          viewKey={viewKey}
          selectedIndex={selectedIndex}
          onSelectCandle={onSelectCandle}
          onNeedOlder={needOlder}
        >
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
      {series.loadingOlder && (
        <div className="pointer-events-none absolute bottom-8 left-2 z-[4] rounded-control bg-raised px-2 py-1 shadow-raised">
          <Spinner label="Loading older candles" className="text-xs" />
        </div>
      )}
      {tool && (
        <div className="pointer-events-none absolute top-8 left-1/2 z-[4] -translate-x-1/2 rounded-control bg-raised px-2.5 py-1 text-xs text-fg shadow-raised">
          Click on the chart to place a point. Press Esc to cancel.
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <ChartToolbar
        mode={mode}
        instrument={instrument}
        timeframe={timeframe}
        onTimeframe={(tf) => setLayout(mode, { timeframe: tf })}
        chartType={layout.chartType}
        onChartType={(chartType) => setLayout(mode, { chartType })}
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
        onToggleWatch={() => toggleWatch({ symbol: instrument.symbol, kind: instrument.kind })}
      />

      {series.fallback && (
        <Notice icon={<Info aria-hidden className="size-3.5" />}>
          Binance futures data is not available from your region, so this chart shows the spot price of the same coin.
          The two stay very close.
        </Notice>
      )}
      {series.stale && (
        <Notice
          icon={<WifiOff aria-hidden className="size-3.5" />}
          action={
            <Button size="sm" variant="ghost" onClick={() => void load(instrument, timeframe)}>
              Retry
            </Button>
          }
        >
          Showing saved prices. {series.error}
        </Notice>
      )}
      {!instrument.live && series.status === 'ready' && (
        <Notice icon={<Info aria-hidden className="size-3.5" />}>
          Bundled daily history up to <span className="num">{lastDay}</span>, with no live price. You can practise
          trading this symbol in{' '}
          <Link to="/replay" className="text-accent-text underline underline-offset-2">
            Replay
          </Link>
          .
        </Notice>
      )}

      {isPhone ? (
        <>
          {chartArea}
          <div role="group" aria-label="Panels" className="flex shrink-0 gap-1 overflow-x-auto border-t border-border bg-surface p-1.5">
            {[...RIGHT_TABS, ...BOTTOM_TABS].map((t) => (
              <Button key={t.id} size="sm" variant="ghost" icon={t.icon} className="shrink-0" onClick={() => setSheet(t.id)}>
                {t.label}
              </Button>
            ))}
          </div>
          <BottomSheet
            open={sheet != null}
            onClose={() => setSheet(null)}
            title={[...RIGHT_TABS, ...BOTTOM_TABS].find((t) => t.id === sheet)?.label ?? ''}
            tall={sheet === 'explain' || sheet === 'watchlist'}
          >
            {sheet === 'order' && order}
            {sheet === 'explain' && explain}
            {sheet === 'watchlist' && watchlist}
            {(sheet === 'positions' || sheet === 'orders' || sheet === 'history') && <BottomTabContent tab={sheet} />}
          </BottomSheet>
        </>
      ) : (
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            {chartArea}
            <ResizablePanel
              dock="bottom"
              label="Account panel"
              storageKey="ws-bottom"
              defaultSize={200}
              minSize={120}
              maxSize={480}
              collapsed={bottomCollapsed}
              onCollapsedChange={setBottomCollapsed}
              collapsedContent={
                <BottomPanel tab={bottomTab} onTab={setBottomTab} collapsed onToggle={() => setBottomCollapsed(false)} />
              }
            >
              <BottomPanel
                tab={bottomTab}
                onTab={setBottomTab}
                collapsed={false}
                onToggle={() => setBottomCollapsed(true)}
              />
            </ResizablePanel>
          </div>
          <ResizablePanel
            dock="right"
            label="Side panel"
            storageKey="ws-right"
            defaultSize={320}
            minSize={260}
            maxSize={520}
            collapsed={rightCollapsed}
            onCollapsedChange={setRightCollapsed}
            collapsedContent={
              <div className="flex h-full flex-col items-center gap-1 p-1">
                <IconButton
                  label="Expand side panel"
                  aria-expanded={false}
                  tooltipSide="left"
                  icon={<PanelRightOpen className="size-4" />}
                  onClick={() => setRightCollapsed(false)}
                />
                {RIGHT_TABS.map((t) => (
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
            <RightPanel
              tab={rightTab}
              onTab={setRightTab}
              onCollapse={() => setRightCollapsed(true)}
              order={order}
              explain={explain}
              watchlist={watchlist}
            />
          </ResizablePanel>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          clearDrawings(instrument.symbol);
          setSelectedDrawing(null);
          toast.info('Drawings cleared');
        }}
        title="Clear all drawings?"
        confirmLabel="Clear drawings"
      >
        This removes all {drawings.length} {drawings.length === 1 ? 'drawing' : 'drawings'} on{' '}
        {displaySymbol(instrument)}. This cannot be undone.
      </ConfirmDialog>

      <Modal
        open={note != null}
        onClose={() => setNote(null)}
        title="Add a note"
        size="sm"
        footer={
          <>
            <Button onClick={() => setNote(null)}>Cancel</Button>
            <Button variant="primary" disabled={!note?.text.trim()} onClick={saveNote}>
              Add note
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
            label="Note text"
            data-autofocus
            maxLength={80}
            value={note?.text ?? ''}
            onChange={(e) => setNote((n) => (n ? { ...n, text: e.target.value } : n))}
            hint="Shown on the chart at the point you clicked."
          />
        </form>
      </Modal>
    </div>
  );
}

export function WorkspacePage({ mode }: { mode: WorkspaceMode }) {
  const { symbol = '' } = useParams();
  const instrument = findInstrument(symbol, mode === 'futures' ? 'perpetual' : 'spot');
  if (!instrument) return <UnknownSymbol symbol={symbol} mode={mode} />;
  // The key gives each symbol and mode a fresh workspace state.
  return <Workspace key={`${mode}:${instrument.symbol}`} instrument={instrument} mode={mode} />;
}

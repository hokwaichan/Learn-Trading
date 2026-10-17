import { useMemo } from 'react';
import { AnnotationLayer, IndicatorLayer, PriceChart } from '@/components/chart';
import { ErrorState, LoadingState } from '@/components/ui';
import { t } from '@/i18n';
import { displaySymbol, findInstrument } from '@/lib/data';
import { useCandleSeries, useMarket } from '@/stores';
import type { Candle, ChartExample, IndicatorConfig } from '@/types';

function Figure({
  example,
  candles,
  title,
  tickSize,
  id,
}: {
  example: ChartExample;
  candles: Candle[];
  title: string;
  tickSize: number;
  id: string;
}) {
  const indicators = useMemo<IndicatorConfig[]>(
    () => (example.indicators ?? []).map((ind, i) => ({ key: `${id}-${i}`, id: ind.id, params: ind.params, visible: true })),
    [example.indicators, id],
  );
  const includePrices = useMemo(
    () => (example.annotations ?? []).flatMap((a) => [a.price, a.toPrice]).filter((v): v is number => v != null),
    [example.annotations],
  );
  // Each indicator pane needs room; keep the price pane a readable height.
  const panes = indicators.filter((i) => ['rsi', 'macd', 'stochastic', 'atr'].includes(i.id)).length;

  return (
    <div style={{ height: 320 + panes * 90 }} className="overflow-hidden rounded-card border border-border">
      <PriceChart
        candles={candles}
        chartType="candles"
        timeframe="1d"
        tickSize={tickSize}
        title={title}
        viewKey={id}
        embedded
        hideTimeAxis={'candles' in example.source}
        includePrices={includePrices}
      >
        <IndicatorLayer indicators={indicators} />
        <AnnotationLayer annotations={example.annotations ?? []} />
      </PriceChart>
    </div>
  );
}

function RealFigure({ example, id }: { example: ChartExample & { source: { symbol: string; from: number; to: number } }; id: string }) {
  const instrument = findInstrument(example.source.symbol);
  const series = useCandleSeries(instrument, '1d');
  const load = useMarket((s) => s.load);
  const { from, to } = example.source;
  const candles = useMemo(() => series.candles.filter((c) => c.time >= from && c.time <= to), [series.candles, from, to]);

  if (!instrument) return <ErrorState message={t('Unknown symbol {symbol}.', { symbol: example.source.symbol })} />;
  if (series.status === 'loading') return <LoadingState className="h-80 rounded-card border border-border" label={t('Loading chart')} />;
  if (series.status === 'error' || candles.length === 0) {
    return (
      <ErrorState
        className="h-80 rounded-card border border-border"
        title={t('Could not load this chart')}
        message={series.error ?? t('No price data for these dates.')}
        onRetry={() => void load(instrument, '1d')}
      />
    );
  }
  return <Figure example={example} candles={candles} title={displaySymbol(instrument)} tickSize={instrument.tickSize} id={id} />;
}

/** An interactive chart inside a lesson or quiz question. */
export function LessonChart({ example, id }: { example: ChartExample; id: string }) {
  return (
    <figure className="not-prose my-5">
      {'candles' in example.source ? (
        <Figure example={example} candles={example.source.candles} title={t('Example')} tickSize={0.01} id={id} />
      ) : (
        <RealFigure example={example as ChartExample & { source: { symbol: string; from: number; to: number } }} id={id} />
      )}
      <figcaption className="mt-2 text-sm leading-relaxed text-muted">{example.caption}</figcaption>
    </figure>
  );
}

import { useMemo } from 'react';
import { AnnotationLayer, LineDiagram, PriceChart } from '@/components/chart';
import { t } from '@/i18n';
import { payoffCurve } from '@/lib/pricing/payoff';
import type { ChartAnnotation } from '@/types';
import type { TrainerQuestion } from '../questions';

export interface QuestionVisualProps {
  question: TrainerQuestion;
  /** True once the question has been answered: the pattern is named and hidden candles appear. */
  revealed: boolean;
  /** Label for the marked candles after answering. */
  answerLabel: string;
}

function QuestionChart({ question, revealed, answerLabel }: QuestionVisualProps) {
  const chart = question.chart!;
  const candles = useMemo(() => (revealed ? [...chart.candles, ...chart.reveal] : chart.candles), [chart, revealed]);

  const annotations = useMemo<ChartAnnotation[]>(() => {
    const out: ChartAnnotation[] = [];
    const box = (from: number, to: number, label: string, source = chart.candles): ChartAnnotation => {
      const span = source.slice(from, to + 1);
      const high = Math.max(...span.map((c) => c.high));
      const low = Math.min(...span.map((c) => c.low));
      const pad = (high - low) * 0.12 || high * 0.002;
      return { kind: 'zone', time: source[from].time, price: high + pad, toTime: source[to].time, toPrice: low - pad, label };
    };
    if (chart.mark) {
      // A one-candle box has no width, so widen single candles by a neighbour either side.
      const single = chart.mark.from === chart.mark.to;
      const from = single ? Math.max(0, chart.mark.from - 1) : chart.mark.from;
      const to = single && !revealed ? chart.mark.to : Math.min(candles.length - 1, single ? chart.mark.to + 1 : chart.mark.to);
      const zone = box(chart.mark.from, chart.mark.to, revealed ? answerLabel : t('Which pattern?'));
      out.push({ ...zone, time: candles[from].time, toTime: candles[to].time });
    }
    if (question.drill === 'next' && revealed && chart.reveal.length) {
      out.push(box(0, chart.reveal.length - 1, t('What happened next'), chart.reveal));
    }
    return out;
  }, [chart, candles, question.drill, revealed, answerLabel]);

  return (
    <div className="relative h-[300px] overflow-hidden rounded-card border border-border sm:h-[420px]">
      <PriceChart
        candles={candles}
        chartType="candles"
        timeframe="1d"
        tickSize={chart.tickSize}
        title={chart.title}
        // A new key once revealed, so the view re-fits to include the new candles.
        viewKey={`${question.key}-${revealed}`}
        embedded
        hideTimeAxis={!chart.real}
        includePrices={annotations.flatMap((a) => [a.price, a.toPrice]).filter((v): v is number => v != null)}
      >
        <AnnotationLayer annotations={annotations} />
      </PriceChart>
    </div>
  );
}

function QuestionPayoff({ question }: { question: TrainerQuestion }) {
  const { legs, spot } = question.payoff!;
  const strikes = [...new Set(legs.filter((l) => l.strike != null).map((l) => l.strike!))];
  const curve = useMemo(() => payoffCurve(legs, spot * 0.7, spot * 1.3, 120), [legs, spot]);
  return (
    <div className="rounded-card border border-border bg-surface p-3 sm:p-5">
      <LineDiagram
        ariaLabel={t('Payoff at expiry of an unnamed option strategy. Identify it from its shape.')}
        series={[{ points: curve.map((p) => ({ x: p.price, y: p.pnl })) }]}
        shadeProfit
        guidesX={[{ x: spot, label: t('Now') }, ...strikes.filter((s) => s !== spot).map((x) => ({ x }))]}
        xLabel={t('Price of the underlying at expiry')}
        yLabel={t('Profit or loss')}
        height={280}
      />
    </div>
  );
}

/** The large visual for a question: a price chart, a payoff diagram, or nothing for text-only drills. */
export function QuestionVisual(props: QuestionVisualProps) {
  if (props.question.chart) return <QuestionChart {...props} />;
  if (props.question.payoff) return <QuestionPayoff question={props.question} />;
  return null;
}

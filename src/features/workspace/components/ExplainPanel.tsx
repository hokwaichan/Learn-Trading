import { useMemo } from 'react';
import { MousePointerClick } from 'lucide-react';
import { cn, EmptyState, GlossaryTerm } from '@/components/ui';
import { explainCandle } from '@/lib/explain/candle';
import type { Candle, Instrument, Timeframe } from '@/types';

export interface ExplainPanelProps {
  instrument: Instrument;
  timeframe: Timeframe;
  candles: Candle[];
  selectedIndex: number | null;
}

/** Explains whatever was last clicked on the chart, in plain language. */
export function ExplainPanel({ instrument, timeframe, candles, selectedIndex }: ExplainPanelProps) {
  const explanation = useMemo(
    () =>
      selectedIndex == null
        ? null
        : explainCandle(candles, selectedIndex, {
            tickSize: instrument.tickSize,
            daily: timeframe === '1d',
            forming: instrument.live && selectedIndex === candles.length - 1,
          }),
    [candles, selectedIndex, instrument.tickSize, instrument.live, timeframe],
  );

  if (!explanation) {
    return (
      <EmptyState
        icon={<MousePointerClick />}
        title="Click any candle"
        description="You will get a plain-language explanation of what it shows and how traders read it. With the keyboard, focus the chart and use the arrow keys."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3">
      <h3 className="text-sm font-semibold text-fg">{explanation.title}</h3>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-control border border-border bg-bg px-3 py-2">
        {explanation.facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline justify-between gap-2">
            <dt className="text-xs text-muted">{fact.label}</dt>
            <dd
              className={cn(
                'num text-xs',
                fact.tone === 'up' ? 'text-up-text' : fact.tone === 'down' ? 'text-down-text' : 'text-fg',
              )}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {explanation.paragraphs.map((p) => (
        <section key={p.heading}>
          <h4 className="text-xs font-semibold tracking-wide text-muted uppercase">{p.heading}</h4>
          <p className="mt-1 text-[13px] leading-relaxed text-fg">{p.text}</p>
        </section>
      ))}

      <p className="text-xs text-muted">
        Related terms:{' '}
        {explanation.related.map((id, i) => (
          <span key={id}>
            {i > 0 && ', '}
            <GlossaryTerm id={id} />
          </span>
        ))}
      </p>
    </div>
  );
}

import { useMemo } from 'react';
import { MousePointerClick } from 'lucide-react';
import { cn, EmptyState, GlossaryTerm } from '@/components/ui';
import { INDICATOR_INFO } from '@/content/indicators';
import { TIMEFRAME_SECONDS } from '@/lib/data';
import { explainCandle } from '@/lib/explain/candle';
import { explainIndicator } from '@/lib/explain/indicator';
import type { Candle, IndicatorConfig, Instrument, Timeframe } from '@/types';

export interface ExplainPanelProps {
  instrument: Instrument;
  timeframe: Timeframe;
  candles: Candle[];
  selectedIndex: number | null;
  /** When set, the panel explains this indicator instead of the candle. */
  indicator?: IndicatorConfig;
}

/** Explains whatever was last clicked on the chart, in plain language. */
export function ExplainPanel({ instrument, timeframe, candles, selectedIndex, indicator }: ExplainPanelProps) {
  const explanation = useMemo(
    () =>
      indicator
        ? explainIndicator(indicator, INDICATOR_INFO[indicator.id], candles, selectedIndex ?? candles.length - 1, {
            stepSeconds: TIMEFRAME_SECONDS[timeframe],
            tickSize: instrument.tickSize,
          })
        : selectedIndex == null
          ? null
          : explainCandle(candles, selectedIndex, {
            tickSize: instrument.tickSize,
            daily: timeframe === '1d',
            forming: instrument.live && selectedIndex === candles.length - 1,
          }),
    [candles, selectedIndex, instrument.tickSize, instrument.live, timeframe, indicator],
  );

  if (!explanation) {
    return (
      <EmptyState
        icon={<MousePointerClick />}
        title="Click any candle or indicator"
        description="You will get a plain-language explanation of what it shows and how traders read it. With the keyboard, focus the chart and use the arrow keys, or Tab to an indicator name in the legend."
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
          {p.text && <p className="mt-1 text-[13px] leading-relaxed text-fg">{p.text}</p>}
          {p.items && (
            <ul className="mt-1 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-fg">
              {p.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
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

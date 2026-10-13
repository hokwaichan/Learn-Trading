import { useMemo, type ReactNode } from 'react';
import { AlertTriangle, Info, OctagonAlert } from 'lucide-react';
import { cn, GlossaryTerm } from '@/components/ui';
import { GLOSSARY } from '@/content/glossary';
import { buildMatcher, linkLessonBlocks, type TextSegment } from '@/lib/glossaryLinker';
import type { PayoffLeg } from '@/lib/pricing/payoff';
import type { Lesson, LessonBlock } from '@/types';
import { LessonChart } from './LessonChart';
import { GreekSlider, PayoffWidget, type GreekFocus } from './widgets/OptionWidgets';
import { CandleAnatomy, ExpectancySim, LeverageDemo, OrderBook, PositionSizeWidget } from './widgets/TradingWidgets';

const MATCHER = buildMatcher(GLOSSARY);

/** Running text with bold spans and glossary links. */
function Rich({ segments }: { segments: TextSegment[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.type === 'term' ? (
          <GlossaryTerm key={i} id={s.id}>
            {s.text}
          </GlossaryTerm>
        ) : s.type === 'bold' ? (
          <strong key={i} className="font-semibold text-fg">
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

const CALLOUT = {
  info: { icon: <Info aria-hidden className="size-4" />, box: 'border-accent/40 bg-accent/10', title: 'text-accent-text' },
  warning: { icon: <AlertTriangle aria-hidden className="size-4" />, box: 'border-warning/40 bg-warning/10', title: 'text-warning-text' },
  danger: { icon: <OctagonAlert aria-hidden className="size-4" />, box: 'border-down/40 bg-down/10', title: 'text-down-text' },
};

function Widget({ block }: { block: Extract<LessonBlock, { type: 'widget' }> }): ReactNode {
  const props = block.props ?? {};
  switch (block.widget) {
    case 'candle-anatomy':
      return <CandleAnatomy />;
    case 'order-book':
      return <OrderBook />;
    case 'leverage-demo':
      return <LeverageDemo />;
    case 'position-size':
      return <PositionSizeWidget />;
    case 'expectancy-sim':
      return <ExpectancySim />;
    case 'payoff':
      return <PayoffWidget title={String(props.title ?? 'Payoff at expiry')} legs={props.legs as PayoffLeg[]} spot={props.spot as number | undefined} />;
    case 'greek-slider':
      return <GreekSlider focus={(props.focus as GreekFocus) ?? 'delta'} type={(props.type as 'call' | 'put') ?? 'call'} />;
  }
}

/** Renders the blocks of a lesson. Glossary terms are linked once per lesson. */
export function LessonBlocks({ lesson }: { lesson: Lesson }) {
  const linked = useMemo(() => linkLessonBlocks(lesson.blocks, MATCHER), [lesson]);

  return (
    <>
      {lesson.blocks.map((block, i) => {
        const text = linked[i];
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={i} className="mt-8 mb-2 text-xl font-semibold text-fg">
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={i} className="my-4 text-fg">
                <Rich segments={text[0]} />
              </p>
            );
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul';
            return (
              <List key={i} className={cn('my-4 space-y-2 pl-6 text-fg', block.ordered ? 'list-decimal' : 'list-disc')}>
                {block.items.map((_, j) => (
                  <li key={j} className="pl-1">
                    <Rich segments={text[j]} />
                  </li>
                ))}
              </List>
            );
          }
          case 'callout': {
            const style = CALLOUT[block.tone];
            return (
              <aside key={i} className={cn('my-5 rounded-card border px-4 py-3', style.box)}>
                <p className={cn('flex items-center gap-2 text-sm font-semibold', style.title)}>
                  {style.icon}
                  {block.title}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-fg">
                  <Rich segments={text[0]} />
                </p>
              </aside>
            );
          }
          case 'formula':
            return (
              <div key={i} className="my-5 rounded-card border border-border bg-surface px-4 py-3">
                <pre className="num overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap text-fg">{block.expression}</pre>
                <p className="mt-2 text-sm leading-relaxed text-muted">{block.explanation}</p>
              </div>
            );
          case 'worked-example':
            return (
              <div key={i} className="my-5 rounded-card border border-border bg-surface px-4 py-3">
                <p className="text-sm font-semibold text-fg">
                  <span className="text-muted">Worked example: </span>
                  {block.title}
                </p>
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-fg">
                  {block.steps.map((_, j) => (
                    <li key={j} className="pl-1">
                      <Rich segments={text[j]} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          case 'chart':
            return <LessonChart key={i} example={block.example} id={`${lesson.moduleId}-${lesson.id}-${i}`} />;
          case 'widget':
            return <Widget key={i} block={block} />;
        }
      })}
    </>
  );
}

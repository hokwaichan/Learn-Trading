import { useMemo, useState, type ReactNode } from 'react';
import { AlertTriangle, Info, OctagonAlert } from 'lucide-react';
import { cn, GlossaryTerm, Modal } from '@/components/ui';
import { GLOSSARY } from '@/content/glossary';
import { IMAGES } from '@/content/images';
import { getLocale, t } from '@/i18n';
import { buildMatcher, linkLessonBlocks, type TextSegment } from '@/lib/glossaryLinker';
import type { PayoffLeg } from '@/lib/pricing/payoff';
import type { Lesson, LessonBlock, LessonImage } from '@/types';
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
      return <PayoffWidget title={String(props.title ?? t('Payoff at expiry'))} legs={props.legs as PayoffLeg[]} spot={props.spot as number | undefined} />;
    case 'greek-slider':
      return <GreekSlider focus={(props.focus as GreekFocus) ?? 'delta'} type={(props.type as 'call' | 'put') ?? 'call'} />;
  }
}

/** The version to show: one with its drawn-in labels translated, when there is one for this language. */
const version = (image: LessonImage) => image.localized?.[getLocale()] ?? image;
const imageUrl = (image: LessonImage) => `${import.meta.env.BASE_URL}images/lessons/${version(image).file}`;

/** Who made the pictures and under which licence, each linked to its source. */
function Credits({ images }: { images: LessonImage[] }) {
  const unique = [...new Map(images.map((im) => [`${im.author}|${im.license}`, im])).values()];
  const link = 'underline decoration-border underline-offset-2 hover:text-fg';
  return (
    <span className="block text-xs text-muted">
      {t('Picture')}:{' '}
      {unique.map((im, i) => (
        <span key={im.source}>
          {i > 0 && '; '}
          <a href={im.source} target="_blank" rel="noreferrer" className={link}>
            {im.author}
          </a>
          {', '}
          {im.licenseUrl ? (
            <a href={im.licenseUrl} target="_blank" rel="noreferrer" className={link}>
              {im.license}
            </a>
          ) : (
            im.license
          )}
        </span>
      ))}
      {' · Wikimedia Commons'}
      {images.some((im) => version(im) !== im) && ` · ${t('labels translated by TradeSchool')}`}
    </span>
  );
}

/**
 * A picture on a white panel, so dark-on-transparent diagrams read in both themes. Tap to enlarge.
 * `fill` stretches the panel to the full width (gallery tiles); otherwise it hugs the picture.
 */
function Picture({ image, alt, className, fill }: { image: LessonImage; alt: string; className?: string; fill?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('Enlarge picture: {alt}', { alt })}
        className={cn(
          'block max-w-full cursor-zoom-in overflow-hidden rounded-card border border-border bg-white p-2',
          fill ? 'w-full' : 'mx-auto w-fit',
        )}
      >
        <img
          src={imageUrl(image)}
          alt={alt}
          width={version(image).width}
          height={version(image).height}
          loading="lazy"
          decoding="async"
          className={cn('mx-auto max-w-full object-contain', className)}
        />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={alt} size="lg">
        <div className="rounded-card bg-white p-2">
          <img src={imageUrl(image)} alt={alt} className="mx-auto max-h-[65dvh] w-auto max-w-full object-contain" />
        </div>
        <div className="mt-2">
          <Credits images={[image]} />
        </div>
      </Modal>
    </>
  );
}

function ImageBlock({ block }: { block: Extract<LessonBlock, { type: 'image' }> }) {
  const image = IMAGES[block.image];
  if (!image) return null;
  return (
    <figure className="my-6">
      <Picture image={image} alt={block.alt} className="h-auto max-h-[420px] w-auto" />
      <figcaption className="mt-2 space-y-1">
        {block.caption && <span className="block text-sm text-muted">{block.caption}</span>}
        <Credits images={[image]} />
      </figcaption>
    </figure>
  );
}

function GalleryBlock({ block }: { block: Extract<LessonBlock, { type: 'gallery' }> }) {
  const items = block.items.filter((item) => IMAGES[item.image]);
  return (
    <figure className="my-6">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <li key={item.image} className="flex flex-col gap-1.5">
            <Picture image={IMAGES[item.image]} alt={item.label} className="h-32 w-full" fill />
            <span className="text-center text-sm font-medium text-fg">{item.label}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 space-y-1">
        {block.caption && <span className="block text-sm text-muted">{block.caption}</span>}
        <Credits images={items.map((item) => IMAGES[item.image])} />
      </figcaption>
    </figure>
  );
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
                  <span className="text-muted">{t('Worked example:')} </span>
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
          case 'image':
            return <ImageBlock key={i} block={block} />;
          case 'gallery':
            return <GalleryBlock key={i} block={block} />;
        }
      })}
    </>
  );
}

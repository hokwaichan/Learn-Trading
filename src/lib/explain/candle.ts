import { t } from '@/i18n';
import { formatCompact, formatPct, formatPrice, formatSignedPct } from '@/lib/format';
import { anatomy, classifyShape, type SingleCandleShape } from '@/lib/patterns/anatomy';
import type { Candle } from '@/types';

export interface Explanation {
  title: string;
  /** Label and value pairs shown as a small table. */
  facts: { label: string; value: string; tone?: 'up' | 'down' }[];
  /** Plain-language paragraphs: what it shows, then how traders read it. */
  paragraphs: { heading: string; text: string; /** Shown as a bulleted list under the text. */ items?: string[] }[];
  /** Glossary ids worth linking under the explanation. */
  related: string[];
}

const SHAPES: Record<SingleCandleShape, { name: string; shows: string; read: string }> = {
  doji: {
    name: t('Doji'),
    shows: t('It opened and closed at almost the same price, so the body is a thin line.'),
    read: t(
      'Buyers and sellers ended the period in a draw. After a strong move, traders treat a doji as a sign the move is losing energy, but on its own it does not say which way price goes next.',
    ),
  },
  hammer: {
    name: t('Hammer shape'),
    shows: t('Price fell a long way during the period, then climbed back to close near the top, leaving a long lower wick.'),
    read: t(
      'Sellers pushed price down and buyers pushed it all the way back. After a decline this can mark buyers stepping in. After a rise the same shape is called a hanging man and is a warning instead.',
    ),
  },
  'shooting-star': {
    name: t('Shooting star shape'),
    shows: t('Price rose a long way during the period, then fell back to close near the bottom, leaving a long upper wick.'),
    read: t(
      'Buyers pushed price up and sellers pushed it all the way back. After a rise this can mark sellers taking control. After a decline the same shape is called an inverted hammer and can hint at a bounce.',
    ),
  },
  marubozu: {
    name: t('Marubozu'),
    shows: t('The body fills almost the whole candle, with little or no wick at either end.'),
    read: t('One side was in control from the open to the close. Traders read it as strong conviction in the direction of the candle.'),
  },
  'spinning-top': {
    name: t('Spinning top'),
    shows: t('A small body with wicks on both sides: price moved up and down but finished close to where it started.'),
    read: t('Neither buyers nor sellers won. Traders read it as indecision, much like a doji but less extreme.'),
  },
};

function formatTime(time: number, daily: boolean): string {
  const iso = new Date(time * 1000).toISOString();
  return daily ? iso.slice(0, 10) : `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function average(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

/**
 * Explains one candle in plain language: its four prices, its shape, and how
 * it compares with the candles just before it.
 */
export function explainCandle(
  candles: Candle[],
  index: number,
  opts: { tickSize?: number; daily?: boolean; /** True for the newest candle of a live market. */ forming?: boolean } = {},
): Explanation | null {
  const c = candles[index];
  if (!c) return null;
  const tick = opts.tickSize ?? 0.01;
  const a = anatomy(c);
  const prev = candles[index - 1];
  const price = (v: number) => formatPrice(v, tick);
  const move = c.open ? c.close / c.open - 1 : 0;

  const facts: Explanation['facts'] = [
    { label: t('Open'), value: price(c.open) },
    { label: t('High'), value: price(c.high) },
    { label: t('Low'), value: price(c.low) },
    { label: t('Close'), value: price(c.close) },
    {
      label: t('Open to close'),
      value: formatSignedPct(move),
      tone: a.direction === 'up' ? 'up' : a.direction === 'down' ? 'down' : undefined,
    },
    { label: t('High to low range'), value: formatPct(c.low ? c.high / c.low - 1 : 0, 2) },
  ];
  if (c.volume > 0) facts.push({ label: t('Volume'), value: formatCompact(c.volume) });

  const paragraphs: Explanation['paragraphs'] = [];

  const directionText =
    a.direction === 'up'
      ? t('It closed higher than it opened, so it is a rising (bullish) candle.')
      : a.direction === 'down'
        ? t('It closed lower than it opened, so it is a falling (bearish) candle.')
        : t('It closed exactly where it opened.');
  paragraphs.push({
    heading: t('What this candle shows'),
    text: [
      t('During this period price opened at {open}, went as high as {high}, as low as {low}, and closed at {close}.', {
        open: price(c.open),
        high: price(c.high),
        low: price(c.low),
        close: price(c.close),
      }),
      directionText,
      t('The thick part (the body) spans the open and the close and makes up {body} of the candle.', { body: formatPct(a.bodyPct, 0) }),
      t('The thin lines (the wicks) show how far price travelled beyond them: {upper} above the body and {lower} below it.', {
        upper: formatPct(a.upperWickPct, 0),
        lower: formatPct(a.lowerWickPct, 0),
      }),
    ].join(' '),
  });

  const shape = classifyShape(c);
  if (shape) {
    paragraphs.push({ heading: t('Shape: {name}', { name: SHAPES[shape].name }), text: `${SHAPES[shape].shows} ${SHAPES[shape].read}` });
  } else {
    const strong = a.bodyPct >= 0.6;
    paragraphs.push({
      heading: t('How traders read it'),
      text: strong
        ? `${t('Most of the candle is body, which means price moved steadily one way with little pushback.')} ${
            a.direction === 'up'
              ? t('Traders read a large body as buyers being in control for this period.')
              : t('Traders read a large body as sellers being in control for this period.')
          }`
        : `${t('The body and wicks are of ordinary size, so this candle has no special name.')} ${t(
            'Long wicks mean price was pushed back from an extreme; a long body means one side stayed in control.',
          )}`,
    });
  }

  const context: string[] = [];
  if (prev) {
    const gap = prev.close ? c.close / prev.close - 1 : 0;
    const size = formatPct(Math.abs(gap), 2);
    context.push(
      // Below half a hundredth of a percent the figure would print as 0.00%.
      Math.abs(gap) < 0.00005
        ? t("It closed at almost exactly the previous candle's close.")
        : gap > 0
          ? t("It closed {size} higher than the previous candle's close.", { size })
          : t("It closed {size} lower than the previous candle's close.", { size }),
    );
  }
  const window = candles.slice(Math.max(0, index - 20), index);
  // A candle that is still forming has only part of its range and volume,
  // so comparing it with finished candles would mislead.
  if (window.length >= 5 && !opts.forming) {
    const avgRange = average(window.map((w) => w.high - w.low));
    if (avgRange > 0) {
      const ratio = a.range / avgRange;
      const values = { ratio: ratio.toFixed(1), n: window.length };
      context.push(
        ratio >= 1.5
          ? t('Its range is {ratio} times the average of the last {n} candles, so this was an unusually big move.', values)
          : ratio <= 0.6
            ? t('Its range is only {ratio} times the average of the last {n} candles, so the market was quiet.', values)
            : t('Its range is close to the average of the last {n} candles.', values),
      );
    }
    const avgVolume = average(window.map((w) => w.volume));
    if (avgVolume > 0 && c.volume > 0) {
      const ratio = (c.volume / avgVolume).toFixed(1);
      context.push(
        c.volume / avgVolume >= 1.5
          ? t('Volume was {ratio} times the recent average. Heavy volume means many traders took part, which gives the move more weight.', { ratio })
          : c.volume / avgVolume <= 0.6
            ? t('Volume was only {ratio} times the recent average. A move on light volume is easier to reverse.', { ratio })
            : t('Volume was about average.'),
      );
    }
  }
  if (context.length) paragraphs.push({ heading: t('Compared with recent candles'), text: context.join(' ') });

  if (opts.forming) {
    paragraphs.unshift({
      heading: t('Still forming'),
      text: t(
        'This is the newest candle and its period has not ended yet. Its close, high, low and volume keep changing until the period ends, so wait for it to finish before reading much into its shape.',
      ),
    });
  }

  paragraphs.push({
    heading: t('Keep in mind'),
    text: t('One candle is a small piece of evidence. Traders look at where it appears: the trend before it, nearby support and resistance, and what the next candle does.'),
  });

  return {
    title: t('Candle of {time}', { time: formatTime(c.time, opts.daily ?? false) }),
    facts,
    paragraphs,
    related: ['candle', 'ohlc', 'timeframe'],
  };
}

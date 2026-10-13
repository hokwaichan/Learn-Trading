import { formatCompact, formatPct, formatPrice } from '@/lib/format';
import { computeIndicator, getIndicator, indicatorLabel } from '@/lib/indicators';
import type { Candle, IndicatorConfig, IndicatorInfo } from '@/types';
import type { Explanation } from './candle';

type Values = Record<string, number | null>;

interface ReadingContext {
  candle: Candle;
  label: string;
  price: (v: number) => string;
}

const num = (v: number, dp = 1) => v.toFixed(dp);

/** One or two sentences on what the current value means. Null when there is no value yet. */
function reading(config: IndicatorConfig, values: Values, ctx: ReadingContext): string | null {
  const { candle, label, price } = ctx;
  const close = candle.close;
  const side = (level: number) => {
    const gap = level ? close / level - 1 : 0;
    return `${formatPct(Math.abs(gap), 2)} ${gap >= 0 ? 'above' : 'below'}`;
  };

  switch (config.id) {
    case 'sma':
    case 'ema': {
      const v = values.value;
      if (v == null) return null;
      return (
        `The close of ${price(close)} is ${side(v)} the ${label} at ${price(v)}. ` +
        (close >= v
          ? 'Price above its average leans bullish, more so if the average itself is rising.'
          : 'Price below its average leans bearish, more so if the average itself is falling.')
      );
    }
    case 'vwap': {
      const v = values.value;
      if (v == null) return null;
      return (
        `The close of ${price(close)} is ${side(v)} VWAP at ${price(v)}. ` +
        (close >= v
          ? 'The average buyer this session is sitting on a profit, which traders read as buyers in control.'
          : 'The average buyer this session is sitting on a loss, which traders read as sellers in control.')
      );
    }
    case 'bollinger': {
      const { upper, middle, lower } = values;
      if (upper == null || middle == null || lower == null) return null;
      const width = middle ? (upper - lower) / middle : 0;
      const where =
        close > upper
          ? `The close of ${price(close)} is above the upper band at ${price(upper)}: unusually high compared with recent prices. In a range that often precedes a pullback; in a strong trend price can stay here.`
          : close < lower
            ? `The close of ${price(close)} is below the lower band at ${price(lower)}: unusually low compared with recent prices. In a range that often precedes a bounce; in a strong downtrend price can stay here.`
            : `The close of ${price(close)} is inside the bands (${price(lower)} to ${price(upper)}), ${close >= middle ? 'in the upper half' : 'in the lower half'}. Nothing unusual.`;
      return `${where} The bands are ${formatPct(width, 1)} of the price apart; narrower bands mean a calmer market.`;
    }
    case 'rsi': {
      const v = values.value;
      if (v == null) return null;
      const zone =
        v >= 70
          ? 'That is above 70, the level called overbought: price has risen quickly. It can keep rising, so this is a caution, not a sell signal.'
          : v <= 30
            ? 'That is below 30, the level called oversold: price has fallen quickly. It can keep falling, so this is a caution, not a buy signal.'
            : v >= 50
              ? 'That is in the neutral zone, on the bullish side of 50: recent gains have been larger than recent losses.'
              : 'That is in the neutral zone, on the bearish side of 50: recent losses have been larger than recent gains.';
      return `RSI is ${num(v)}. ${zone}`;
    }
    case 'macd': {
      const { macd, signal, histogram } = values;
      if (macd == null) return null;
      const trend =
        macd >= 0
          ? 'MACD is above zero, so the fast average is above the slow one (an uptrend).'
          : 'MACD is below zero, so the fast average is below the slow one (a downtrend).';
      if (signal == null || histogram == null) return `MACD is ${price(macd)}. ${trend}`;
      return (
        `MACD is ${price(macd)} and its signal line is ${price(signal)}. ${trend} ` +
        (histogram >= 0
          ? 'MACD is above its signal line (positive histogram), which is read as upward momentum.'
          : 'MACD is below its signal line (negative histogram), which is read as downward momentum.')
      );
    }
    case 'stochastic': {
      const { k, d } = values;
      if (k == null) return null;
      const zone =
        k >= 80
          ? 'That is above 80 (overbought): price is closing near the top of its recent range.'
          : k <= 20
            ? 'That is below 20 (oversold): price is closing near the bottom of its recent range.'
            : 'That is between 20 and 80, the neutral zone.';
      const cross = d == null ? '' : k >= d ? ' %K is above %D, which leans upward.' : ' %K is below %D, which leans downward.';
      return `%K is ${num(k)}${d == null ? '' : ` and %D is ${num(d)}`}. ${zone}${cross}`;
    }
    case 'atr': {
      const v = values.value;
      if (v == null) return null;
      const pct = close ? v / close : 0;
      return (
        `ATR is ${price(v)}, which is ${formatPct(pct, 2)} of the price. A typical candle on this timeframe covers about that much. ` +
        `A stop-loss closer than ${price(v)} to your entry would sit inside normal noise.`
      );
    }
    case 'volumeMa': {
      const v = values.value;
      if (v == null || v === 0) return null;
      const ratio = candle.volume / v;
      return (
        `This candle traded ${formatCompact(candle.volume)}, against an average of ${formatCompact(v)}: ${num(ratio)} times normal. ` +
        (ratio >= 1.5
          ? 'Heavy volume gives this candle more weight.'
          : ratio <= 0.6
            ? 'Light volume means fewer traders were behind this move.'
            : 'That is an ordinary amount.')
      );
    }
    case 'donchian': {
      const { upper, lower } = values;
      if (upper == null || lower == null) return null;
      if (close > upper) return `The close of ${price(close)} is above the channel top at ${price(upper)}: the highest close in the look-back period. Breakout traders read that as the start of a move; many such breaks fail and fall back inside.`;
      if (close < lower) return `The close of ${price(close)} is below the channel bottom at ${price(lower)}: the lowest close in the look-back period. Breakout traders read that as the start of a fall; many such breaks fail and recover.`;
      const position = upper > lower ? (close - lower) / (upper - lower) : 0.5;
      return `The close of ${price(close)} is inside the channel (${price(lower)} to ${price(upper)}), ${formatPct(position, 0)} of the way up. No new high or low for the period.`;
    }
    case 'prevDay': {
      const { high, low } = values;
      if (high == null || low == null) return null;
      if (close > high) return `The close of ${price(close)} is above yesterday's high of ${price(high)}. Buyers have taken out the previous day's range; day traders watch whether price holds above it or slips back.`;
      if (close < low) return `The close of ${price(close)} is below yesterday's low of ${price(low)}. Sellers have taken out the previous day's range; day traders watch whether price stays below it or recovers.`;
      return `The close of ${price(close)} is inside yesterday's range (${price(low)} to ${price(high)}). Those two prices are where many stop and breakout orders sit.`;
    }
    case 'openingRange': {
      const { high, low } = values;
      if (high == null || low == null) return null;
      if (close > high) return `The close of ${price(close)} is above the opening range high of ${price(high)}. An opening-range breakout to the upside; the range low is the usual place for the stop.`;
      if (close < low) return `The close of ${price(close)} is below the opening range low of ${price(low)}. An opening-range breakout to the downside; the range high is the usual place for the stop.`;
      return `The close of ${price(close)} is inside the opening range (${price(low)} to ${price(high)}). No breakout yet.`;
    }
  }
}

/**
 * Explains an indicator on the chart: its reading at the given candle, then
 * what it measures, how it is calculated, typical signals and weaknesses.
 */
export function explainIndicator(
  config: IndicatorConfig,
  info: IndicatorInfo,
  candles: Candle[],
  index: number,
  opts: { stepSeconds: number; tickSize?: number },
): Explanation | null {
  const candle = candles[index];
  if (!candle) return null;
  const def = getIndicator(config.id);
  const tick = opts.tickSize ?? 0.01;
  const price = (v: number) => formatPrice(v, tick);
  const label = indicatorLabel(config);
  const output = computeIndicator(config, candles, opts.stepSeconds);
  const values: Values = Object.fromEntries(Object.entries(output).map(([key, series]) => [key, series[index] ?? null]));

  const show = (v: number | null) =>
    v == null ? 'not enough data yet' : config.id === 'volumeMa' ? formatCompact(v) : def.decimals != null ? v.toFixed(def.decimals) : price(v);

  const facts: Explanation['facts'] = def.outputs.map((o) => ({ label: o.label, value: show(values[o.key]) }));
  facts.push({ label: 'Close', value: price(candle.close) });

  const now = reading(config, values, { candle, label, price });
  const paragraphs: Explanation['paragraphs'] = [
    {
      heading: 'Reading at this candle',
      text:
        now ??
        `There is no value here yet. ${def.name} needs a number of earlier candles before it can be worked out, so the line starts a little way into the chart.`,
    },
    { heading: 'What it measures', text: info.measures },
    { heading: 'How it is calculated', text: info.calculation },
    { heading: 'Typical signals', text: '', items: info.signals },
    { heading: 'Weaknesses', text: '', items: info.weaknesses },
  ];

  return { title: `${def.name} (${label})`, facts, paragraphs, related: info.related };
}

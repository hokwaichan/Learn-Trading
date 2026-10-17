import { t } from '@/i18n';
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
  /** 'The close of 105 is 2.00% above the EMA 20 at 103.' */
  const versus = (name: string, level: number) => {
    const gap = level ? close / level - 1 : 0;
    const vars = { close: price(close), gap: formatPct(Math.abs(gap), 2), name, level: price(level) };
    return gap >= 0 ? t('The close of {close} is {gap} above the {name} at {level}.', vars) : t('The close of {close} is {gap} below the {name} at {level}.', vars);
  };

  switch (config.id) {
    case 'sma':
    case 'ema': {
      const v = values.value;
      if (v == null) return null;
      return `${versus(label, v)} ${
        close >= v
          ? t('Price above its average leans bullish, more so if the average itself is rising.')
          : t('Price below its average leans bearish, more so if the average itself is falling.')
      }`;
    }
    case 'vwap': {
      const v = values.value;
      if (v == null) return null;
      return `${versus('VWAP', v)} ${
        close >= v
          ? t('The average buyer this session is sitting on a profit, which traders read as buyers in control.')
          : t('The average buyer this session is sitting on a loss, which traders read as sellers in control.')
      }`;
    }
    case 'bollinger': {
      const { upper, middle, lower } = values;
      if (upper == null || middle == null || lower == null) return null;
      const width = middle ? (upper - lower) / middle : 0;
      const vars = { close: price(close), upper: price(upper), lower: price(lower) };
      const where =
        close > upper
          ? t(
              'The close of {close} is above the upper band at {upper}: unusually high compared with recent prices. In a range that often precedes a pullback; in a strong trend price can stay here.',
              vars,
            )
          : close < lower
            ? t(
                'The close of {close} is below the lower band at {lower}: unusually low compared with recent prices. In a range that often precedes a bounce; in a strong downtrend price can stay here.',
                vars,
              )
            : close >= middle
              ? t('The close of {close} is inside the bands ({lower} to {upper}), in the upper half. Nothing unusual.', vars)
              : t('The close of {close} is inside the bands ({lower} to {upper}), in the lower half. Nothing unusual.', vars);
      return `${where} ${t('The bands are {width} of the price apart; narrower bands mean a calmer market.', { width: formatPct(width, 1) })}`;
    }
    case 'rsi': {
      const v = values.value;
      if (v == null) return null;
      const zone =
        v >= 70
          ? t('That is above 70, the level called overbought: price has risen quickly. It can keep rising, so this is a caution, not a sell signal.')
          : v <= 30
            ? t('That is below 30, the level called oversold: price has fallen quickly. It can keep falling, so this is a caution, not a buy signal.')
            : v >= 50
              ? t('That is in the neutral zone, on the bullish side of 50: recent gains have been larger than recent losses.')
              : t('That is in the neutral zone, on the bearish side of 50: recent losses have been larger than recent gains.');
      return `${t('RSI is {value}.', { value: num(v) })} ${zone}`;
    }
    case 'macd': {
      const { macd, signal, histogram } = values;
      if (macd == null) return null;
      const trend =
        macd >= 0
          ? t('MACD is above zero, so the fast average is above the slow one (an uptrend).')
          : t('MACD is below zero, so the fast average is below the slow one (a downtrend).');
      if (signal == null || histogram == null) return `${t('MACD is {value}.', { value: price(macd) })} ${trend}`;
      return `${t('MACD is {value} and its signal line is {signal}.', { value: price(macd), signal: price(signal) })} ${trend} ${
        histogram >= 0
          ? t('MACD is above its signal line (positive histogram), which is read as upward momentum.')
          : t('MACD is below its signal line (negative histogram), which is read as downward momentum.')
      }`;
    }
    case 'stochastic': {
      const { k, d } = values;
      if (k == null) return null;
      const zone =
        k >= 80
          ? t('That is above 80 (overbought): price is closing near the top of its recent range.')
          : k <= 20
            ? t('That is below 20 (oversold): price is closing near the bottom of its recent range.')
            : t('That is between 20 and 80, the neutral zone.');
      const cross = d == null ? '' : ` ${k >= d ? t('%K is above %D, which leans upward.') : t('%K is below %D, which leans downward.')}`;
      const value = d == null ? t('%K is {k}.', { k: num(k) }) : t('%K is {k} and %D is {d}.', { k: num(k), d: num(d) });
      return `${value} ${zone}${cross}`;
    }
    case 'atr': {
      const v = values.value;
      if (v == null) return null;
      const pct = close ? v / close : 0;
      return `${t('ATR is {value}, which is {pct} of the price. A typical candle on this timeframe covers about that much.', { value: price(v), pct: formatPct(pct, 2) })} ${t(
        'A stop-loss closer than {value} to your entry would sit inside normal noise.',
        { value: price(v) },
      )}`;
    }
    case 'volumeMa': {
      const v = values.value;
      if (v == null || v === 0) return null;
      const ratio = candle.volume / v;
      return `${t('This candle traded {volume}, against an average of {average}: {ratio} times normal.', {
        volume: formatCompact(candle.volume),
        average: formatCompact(v),
        ratio: num(ratio),
      })} ${
        ratio >= 1.5
          ? t('Heavy volume gives this candle more weight.')
          : ratio <= 0.6
            ? t('Light volume means fewer traders were behind this move.')
            : t('That is an ordinary amount.')
      }`;
    }
    case 'donchian': {
      const { upper, lower } = values;
      if (upper == null || lower == null) return null;
      const vars = { close: price(close), upper: price(upper), lower: price(lower) };
      if (close > upper) {
        return t(
          'The close of {close} is above the channel top at {upper}: the highest close in the look-back period. Breakout traders read that as the start of a move; many such breaks fail and fall back inside.',
          vars,
        );
      }
      if (close < lower) {
        return t(
          'The close of {close} is below the channel bottom at {lower}: the lowest close in the look-back period. Breakout traders read that as the start of a fall; many such breaks fail and recover.',
          vars,
        );
      }
      const position = upper > lower ? (close - lower) / (upper - lower) : 0.5;
      return t('The close of {close} is inside the channel ({lower} to {upper}), {position} of the way up. No new high or low for the period.', {
        ...vars,
        position: formatPct(position, 0),
      });
    }
    case 'prevDay': {
      const { high, low } = values;
      if (high == null || low == null) return null;
      const vars = { close: price(close), high: price(high), low: price(low) };
      if (close > high) {
        return t(
          "The close of {close} is above yesterday's high of {high}. Buyers have taken out the previous day's range; day traders watch whether price holds above it or slips back.",
          vars,
        );
      }
      if (close < low) {
        return t(
          "The close of {close} is below yesterday's low of {low}. Sellers have taken out the previous day's range; day traders watch whether price stays below it or recovers.",
          vars,
        );
      }
      return t("The close of {close} is inside yesterday's range ({low} to {high}). Those two prices are where many stop and breakout orders sit.", vars);
    }
    case 'openingRange': {
      const { high, low } = values;
      if (high == null || low == null) return null;
      const vars = { close: price(close), high: price(high), low: price(low) };
      if (close > high) {
        return t('The close of {close} is above the opening range high of {high}. An opening-range breakout to the upside; the range low is the usual place for the stop.', vars);
      }
      if (close < low) {
        return t('The close of {close} is below the opening range low of {low}. An opening-range breakout to the downside; the range high is the usual place for the stop.', vars);
      }
      return t('The close of {close} is inside the opening range ({low} to {high}). No breakout yet.', vars);
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
    v == null ? t('not enough data yet') : config.id === 'volumeMa' ? formatCompact(v) : def.decimals != null ? v.toFixed(def.decimals) : price(v);

  const facts: Explanation['facts'] = def.outputs.map((o) => ({ label: o.label, value: show(values[o.key]) }));
  facts.push({ label: t('Close'), value: price(candle.close) });

  const now = reading(config, values, { candle, label, price });
  const paragraphs: Explanation['paragraphs'] = [
    {
      heading: t('Reading at this candle'),
      text:
        now ??
        t('There is no value here yet. {name} needs a number of earlier candles before it can be worked out, so the line starts a little way into the chart.', {
          name: def.name,
        }),
    },
    { heading: t('What it measures'), text: info.measures },
    { heading: t('How it is calculated'), text: info.calculation },
    { heading: t('Typical signals'), text: '', items: info.signals },
    { heading: t('Weaknesses'), text: '', items: info.weaknesses },
  ];

  return { title: `${def.name} (${label})`, facts, paragraphs, related: info.related };
}

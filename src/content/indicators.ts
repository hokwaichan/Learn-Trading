import type { IndicatorId, IndicatorInfo } from '@/types';

/**
 * What each indicator measures, how it is worked out, how traders use it and
 * where it goes wrong. Shown in the Explain tab and the Indicators dialog,
 * and reused by the Indicators lessons.
 */
export const INDICATOR_INFO: Record<IndicatorId, IndicatorInfo> = {
  sma: {
    id: 'sma',
    summary: 'The average closing price over the last N candles. Smooths out noise so the trend is easier to see.',
    measures:
      'The average price over a recent stretch of time. Because it averages many candles, it moves slowly and shows the general direction of price rather than every wiggle.',
    calculation:
      'Add up the closing prices of the last N candles and divide by N. With a period of 20, each point on the line is the average of the 20 most recent closes. Every close in the window counts equally.',
    signals: [
      'Price above a rising average suggests an uptrend; price below a falling average suggests a downtrend.',
      'Price crossing the average is read as a possible change of direction.',
      'A shorter average crossing above a longer one (for example 50 over 200) is called a golden cross; crossing below is a death cross.',
      'In a trend, price often pulls back to the average and then continues, so some traders treat it as a moving support or resistance level.',
    ],
    weaknesses: [
      'It lags. The average only turns after price has already turned, so signals come late.',
      'In a sideways market price crosses the average again and again, giving one false signal after another. This is called getting whipsawed.',
      'The period is a choice, not a law. A 20-period and a 50-period average can disagree.',
    ],
    related: ['candle', 'timeframe'],
  },
  ema: {
    id: 'ema',
    summary: 'A moving average that gives recent candles more weight, so it reacts faster than the simple one.',
    measures:
      'The average price over a recent stretch of time, like a simple moving average, but weighted so that the newest candles matter most. It follows price more closely.',
    calculation:
      'Start from a simple average of the first N closes. From then on, each new value moves the previous one part of the way towards the latest close: new EMA = old EMA + k x (close - old EMA), where k = 2 / (N + 1). With N = 20, k is about 0.095, so each new close pulls the line about 9.5% of the way towards itself.',
    signals: [
      'Used like a simple moving average: price above a rising EMA suggests an uptrend, below a falling EMA a downtrend.',
      'A fast EMA crossing a slow EMA (for example 12 and 26) is a common entry and exit rule.',
      'Because it reacts sooner, traders on short timeframes often prefer it.',
    ],
    weaknesses: [
      'Still lags, only less than a simple average.',
      'Reacting faster also means reacting to noise: more signals, and more of them false.',
      'Whipsaws in sideways markets, just like the simple average.',
    ],
    related: ['candle', 'timeframe'],
  },
  bollinger: {
    id: 'bollinger',
    summary: 'A band around a moving average that widens when price is jumpy and narrows when it is calm.',
    measures:
      'How far price is from its recent average, measured against how much it has been moving lately. The bands show what counts as an unusually high or low price right now.',
    calculation:
      'The middle band is a simple moving average, normally of 20 closes. Work out the standard deviation of those same closes (a measure of how spread out they are). The upper band is the average plus 2 standard deviations and the lower band is the average minus 2.',
    signals: [
      'Price touching the upper band is high relative to recent prices; touching the lower band is low. In a sideways market traders look for a move back towards the middle.',
      'Very narrow bands (a squeeze) mean volatility is unusually low. A sharp move often follows, though the bands do not say in which direction.',
      'In a strong trend price can ride along one band for a long time. That is a sign of strength, not a reversal signal.',
    ],
    weaknesses: [
      'Touching a band is not a signal to trade on its own. Prices outside the bands can keep going.',
      'The bands widen after a big move, so they describe what has happened rather than predict it.',
      'It says nothing about direction.',
    ],
    related: ['candle'],
  },
  vwap: {
    id: 'vwap',
    summary: 'The average price actually paid this session, counting busy candles more than quiet ones.',
    measures:
      'The average price at which trading has taken place during the session, weighted by volume. It answers: across everything traded so far, what was the typical price paid?',
    calculation:
      'For each candle take the typical price (high + low + close) / 3 and multiply it by that candle volume. Keep a running total of those, and a running total of volume, and divide one by the other. Here the totals restart every day (UTC) on intraday charts and every calendar month on daily charts.',
    signals: [
      'Price above VWAP means the average buyer this session is in profit, which traders read as buyers in control; below means sellers are.',
      'Day traders often treat VWAP as a fair price: buying below it or selling above it is getting a better-than-average deal.',
      'Price returning to VWAP after moving away is a common intraday support or resistance level.',
    ],
    weaknesses: [
      'It needs volume data. For instruments without it, such as the bundled EUR/USD history, it cannot be drawn.',
      'It restarts each session, so it jumps at the session boundary and means little in the first few candles.',
      'Late in a session it barely moves, because one new candle is small next to everything already counted.',
    ],
    related: ['candle'],
  },
  donchian: {
    id: 'donchian',
    summary: 'The highest high and lowest low of the last N candles. Shows when price makes a genuine new high or low.',
    measures: 'The top and bottom of the recent trading range. Price closing outside it has gone somewhere it has not been for N candles.',
    calculation:
      'The upper line is the highest high of the N candles before the current one; the lower line is the lowest low. The middle line is halfway between. The current candle is left out, so a close above the upper line is a new high for the period.',
    signals: [
      'A close above the upper line is a breakout: the classic "turtle" trend-following entry was a 20-day high.',
      'A close below the lower line is a breakdown, used the same way for shorts or as an exit for longs.',
      'The lines mark where stop orders gather, which is where liquidity sweeps happen.',
      'A narrow channel means a quiet market; breakouts from narrow channels tend to travel further.',
    ],
    weaknesses: [
      'Most breakouts fail. Trend followers using it lose more often than they win and rely on a few large winners.',
      'In a range price touches both lines repeatedly, giving one false signal after another.',
      'It only looks at extremes, so one freak wick can hold a line in place for the whole period.',
    ],
    related: ['breakout', 'resistance', 'support'],
  },
  prevDay: {
    id: 'prevDay',
    summary: "Yesterday's high, low and close as lines on today's chart. The levels day traders watch first.",
    measures: "Where the previous day's trading began to fail in each direction, and where it settled. Many traders place stops and breakout orders just beyond these prices.",
    calculation: "The highest price, lowest price and final price of the previous UTC day, drawn across every candle of the current day. On a daily chart this is simply the previous candle.",
    signals: [
      "Price holding above yesterday's high suggests buyers are in control today; holding below yesterday's low suggests sellers are.",
      'A poke beyond the level that quickly reverses is a liquidity sweep, often followed by a move the other way.',
      "Yesterday's close marks whether today is up or down; price often returns to it in a quiet session.",
    ],
    weaknesses: [
      'Crypto never closes, so the day boundary (midnight UTC) is a convention, not a real open and close.',
      'The levels are widely known, which is exactly why price often runs through them briefly to trigger orders.',
      'They say nothing about direction on their own; they are places to watch, not signals.',
    ],
    related: ['support', 'resistance'],
  },
  openingRange: {
    id: 'openingRange',
    summary: 'The high and low of the first minutes of the day. A break of either is a classic day-trading entry.',
    measures: 'The range set while the day finds its footing. Early trading is busy and two-sided; once it settles, the side that breaks out often sets the tone.',
    calculation:
      'The highest and lowest price during the first N minutes after the start hour, then held as two lines for the rest of the day. The lines only appear once the opening period is over. Needs candles shorter than the range.',
    signals: [
      'A close above the range high is an opening-range breakout to the upside; below the range low, to the downside.',
      'The opposite side of the range is the natural stop-loss, which fixes the risk before entry.',
      'A break that fails and comes back through the range often runs to the other side.',
    ],
    weaknesses: [
      'On quiet days price chops across both lines and stops out breakouts in both directions.',
      'A wide opening range means a wide stop, so the position must be smaller.',
      'For crypto the start of the day is a convention. Set the start hour to the session you actually trade.',
    ],
    related: ['breakout', 'stop-loss'],
  },
  volumeMa: {
    id: 'volumeMa',
    summary: 'The average volume over the last N candles, drawn over the volume bars. Shows what normal trading looks like.',
    measures: 'The typical amount traded per candle recently, so you can tell whether the current candle is unusually busy or quiet.',
    calculation: 'Add up the volume of the last N candles and divide by N.',
    signals: [
      'A price move on volume well above the average has many traders behind it and is taken more seriously.',
      'A breakout on volume below the average is more likely to fail.',
      'Volume drying up during a pullback, then expanding as the trend resumes, is a healthy sign for the trend.',
    ],
    weaknesses: [
      'Volume shows how much traded, not who was more eager, buyers or sellers.',
      'Crypto volume differs between exchanges; this shows one exchange only.',
      'Volume has a daily rhythm (quiet at some hours), so a bar can be above average simply because of the time of day.',
    ],
    related: ['candle'],
  },
  rsi: {
    id: 'rsi',
    summary: 'A 0 to 100 gauge of how strongly price has been rising compared with falling. Above 70 is called overbought, below 30 oversold.',
    measures:
      'Momentum: how large recent gains have been compared with recent losses. A high reading means the up moves have dominated; a low reading means the down moves have.',
    calculation:
      'Look at the change from each close to the next over the last 14 candles. Average the gains, and separately average the losses. RSI = 100 - 100 / (1 + average gain / average loss). If gains and losses are equal the result is 50. After the first value the averages are smoothed, so one candle changes them only a little.',
    signals: [
      'Above 70 is called overbought: price has risen fast and may be due a pause. Below 30 is oversold.',
      'Above 50 leans bullish and below 50 leans bearish; some traders use the 50 line as a trend filter.',
      'Divergence: price makes a new high but RSI makes a lower high. This suggests the move is running out of energy.',
    ],
    weaknesses: [
      'Overbought does not mean about to fall. In a strong uptrend RSI can stay above 70 for weeks while price keeps climbing.',
      'The 70 and 30 levels are conventions, not thresholds with any special property.',
      'Divergences are easy to see afterwards and often fail in real time.',
    ],
    related: ['candle'],
  },
  macd: {
    id: 'macd',
    summary: 'The gap between a fast and a slow moving average. Shows whether momentum is building or fading.',
    measures:
      'The distance between a fast and a slow exponential moving average. When the fast one pulls away from the slow one, momentum is building; when they converge, it is fading.',
    calculation:
      'MACD line = 12-period EMA minus 26-period EMA. Signal line = 9-period EMA of the MACD line. Histogram = MACD line minus signal line. The bars are positive when MACD is above its signal and negative when below.',
    signals: [
      'MACD crossing above its signal line is read as momentum turning up; crossing below as turning down.',
      'MACD above zero means the fast average is above the slow one (an uptrend); below zero the opposite.',
      'Histogram bars shrinking towards zero show a move losing momentum before the lines actually cross.',
    ],
    weaknesses: [
      'It is built from moving averages, so it lags twice over. Crossovers often come after much of the move.',
      'Many false crossovers in sideways markets.',
      'Its values are in price units, so readings cannot be compared between a $100 stock and a $60,000 coin.',
    ],
    related: ['candle'],
  },
  stochastic: {
    id: 'stochastic',
    summary: 'A 0 to 100 gauge of where the close sits in the recent high-low range. Above 80 is overbought, below 20 oversold.',
    measures:
      'Where the latest close sits between the lowest low and the highest high of the last 14 candles. Near 100 means price is closing at the top of its recent range; near 0, at the bottom.',
    calculation:
      '%K = 100 x (close - lowest low) / (highest high - lowest low) over the last 14 candles, then smoothed with a 3-candle average. %D is a 3-candle average of %K and acts as its signal line.',
    signals: [
      'Above 80 is called overbought and below 20 oversold.',
      '%K crossing above %D while both are below 20 is read as a buy signal; crossing below while above 80 as a sell signal.',
      'Works best when price is moving sideways in a range.',
    ],
    weaknesses: [
      'In a strong trend it pins near 100 or 0 and stays there, so overbought and oversold readings keep failing.',
      'It is very quick and jumpy, which means frequent false signals.',
      'It only knows about the last 14 candles; a wider view can look completely different.',
    ],
    related: ['candle'],
  },
  atr: {
    id: 'atr',
    summary: 'How far price typically moves in one candle, in price units. Used for placing stops and sizing positions.',
    measures:
      'Volatility: the typical size of one candle, including any gap from the previous close. It says how much price moves, not which way.',
    calculation:
      'For each candle take the true range: the largest of (high - low), (high - previous close) and (previous close - low). ATR is a smoothed average of the true range over 14 candles.',
    signals: [
      'Stop placement: a stop-loss closer than about one ATR from your entry sits inside normal noise and is likely to be hit by chance. Many traders use 1.5 to 3 ATR.',
      'Position sizing: when ATR is high, trade smaller so the same dollar risk covers the wider stop.',
      'A rising ATR means the market is getting more volatile; a falling ATR means it is calming down.',
    ],
    weaknesses: [
      'It has no direction. A high ATR can come with a rally or a crash.',
      'It describes recent candles; volatility can change abruptly on news.',
      'It is in price units, so compare it with the price (ATR as a percentage) rather than between instruments.',
    ],
    related: ['stop-loss', 'candle'],
  },
};

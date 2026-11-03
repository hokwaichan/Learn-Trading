import { chart, defineModule, formula, img, note, ol, p, real, ul, warn, worked } from './helpers';

export const indicators = defineModule(5, 'indicators', 'Indicators', 'What each indicator measures, how it is calculated, how traders use it, and where it misleads.', [
  {
    id: 'moving-averages',
    title: 'Moving averages (SMA and EMA)',
    summary: 'The simplest indicator: an average of recent prices that smooths out noise and shows the trend.',
    minutes: 6,
    blocks: [
      p('An **indicator** is a calculation drawn from price or volume. It adds no new information, but makes one thing, like trend or momentum, easier to see. Every indicator **lags**, because it is built from past prices.'),
      p('A **moving average** is the average close of the last N candles, the **period**, recalculated on every candle.'),
      formula('SMA = (sum of the last N closes) / N', 'A 20-period SMA on a daily chart is the average close of the last 20 days.'),
      worked('A 5-period SMA by hand', 'The last five closes are 10, 11, 12, 11 and 13.', 'Sum: 10 + 11 + 12 + 11 + 13 = 57.', 'SMA = 57 / 5 = 11.4.', 'Tomorrow the oldest close (10) drops out and the new one comes in.'),
      p('The **EMA** gives recent closes more weight, so it turns sooner than the SMA.'),
      img(
        'sma-vs-ema',
        'A price chart with a simple and an exponential moving average, both 14 periods, the exponential one turning sooner after a sharp fall',
        'A 14-period SMA and EMA on the same chart. After the sharp drop, the EMA (orange) turns down first.',
      ),
      formula('EMA today = EMA yesterday + k x (close - EMA yesterday),   k = 2 / (N + 1)', 'With N = 20, k is about 0.095: each new close pulls the line about 9.5% of the way towards itself.'),
      chart(real('SPY', '2024-06-03', '2025-06-30', 'SPY with a 20-day SMA and a 50-day EMA. The shorter average hugs price; the longer one shows the bigger trend. Click an average in the legend to see its current reading.', [
        { id: 'sma', params: { period: 20 } },
        { id: 'ema', params: { period: 50 } },
      ])),
      ul(
        '**Trend**: price above a rising average leans up; below a falling one, down.',
        '**Crossovers**: the 50-day crossing above the 200-day is a **golden cross**; below, a **death cross**.',
        '**Dynamic support**: pullbacks in a trend often end near the 20 or 50.',
      ),
      warn('Weaknesses', 'Signals come late, sideways markets cause whipsaws, and the period is arbitrary: short reacts fast but misleads more, long is steady but slow.'),
      note('Common periods', '9 and 20 for short-term trend, 50 for medium, 200 for long-term. They work partly because so many people watch them.'),
    ],
  },
  {
    id: 'volatility-indicators',
    title: 'Volatility: Bollinger Bands and ATR',
    summary: 'Two ways to measure how much price is moving, which is what stop distances and position sizes should depend on.',
    minutes: 6,
    blocks: [
      p('**Volatility** is how much price moves, whichever way. The same stop distance is generous in a calm market and hopeless in a wild one.'),
      p('**Bollinger Bands** put an envelope around a 20-period SMA, 2 **standard deviations** above and below. The bands widen when price is jumpy and narrow when it is calm.'),
      img(
        'bollinger-spx',
        'The S&P 500 index with Bollinger Bands around price, and two indicator panes below',
        'The S&P 500 with Bollinger Bands. The bands balloon in the sell-off and tighten as it calms.',
      ),
      formula('Upper = SMA(20) + 2 x standard deviation\nLower = SMA(20) - 2 x standard deviation', 'Roughly 90% to 95% of closes fall inside bands set this way.'),
      ul(
        'A close outside a band is unusually stretched. In a range, look for a return to the middle.',
        'A **squeeze**, very narrow bands, often comes before a sharp move, direction unknown.',
        'In a strong trend price can "walk the band". That is strength, not a reversal.',
      ),
      p('**ATR**, the average true range, is how far price typically moves in one candle, averaged over 14 candles and including gaps.'),
      img(
        'atr-chart',
        'The S&P 500 index above its 14-day average true range, which rises sharply when the index falls',
        'The S&P 500 and its ATR below. ATR jumps when markets fall fast, so stops need room then.',
      ),
      formula('True range = the largest of: high - low,  |high - previous close|,  |low - previous close|\nATR = smoothed average of the true range over 14 candles', 'ATR is in price units. An ATR of 3.50 on a $200 stock means a typical day covers about $3.50.'),
      chart(real('TSLA', '2024-09-03', '2025-06-30', 'Tesla with Bollinger Bands and, below, the ATR. Notice the bands squeeze together in quiet periods and balloon during big moves.', [
        { id: 'bollinger', params: { period: 20, multiplier: 2 } },
        { id: 'atr', params: { period: 14 } },
      ])),
      ul(
        '**Stops**: closer than about 1 ATR sits inside normal noise. Many use 1.5 to 3 ATR.',
        '**Size**: a higher ATR needs a wider stop, so a smaller position for the same risk.',
        '**Compare markets**: divide ATR by price. A 2% ATR is twice as volatile as 1%.',
      ),
      warn('Volatility clusters', 'Neither tool shows direction, and calm periods end suddenly. Do not assume a quiet market will stay quiet.'),
    ],
  },
  {
    id: 'momentum-oscillators',
    title: 'Momentum: RSI and Stochastic',
    summary: 'Two gauges that run from 0 to 100 and show how stretched a move is.',
    minutes: 6,
    blocks: [
      p('An **oscillator** swings within a fixed range, usually 0 to 100, in its own pane. It measures **momentum**: how strongly price has been moving.'),
      p('**RSI** compares recent gains with recent losses over 14 candles:'),
      ol(
        'Note each candle\'s change from the previous close.',
        'Average the gains, and separately the losses.',
        'RSI = 100 - 100 / (1 + average gain / average loss).',
      ),
      ul(
        'Above **70**: **overbought**, a fast rise. Below **30**: **oversold**, a fast fall.',
        'Above 50 leans bullish; below 50 bearish.',
      ),
      chart(real('AAPL', '2024-09-03', '2025-06-30', 'Apple with RSI and the Stochastic oscillator. Compare where each reaches its extremes with what price did next: sometimes a turn, sometimes nothing.', [
        { id: 'rsi', params: { period: 14 } },
        { id: 'stochastic', params: { period: 14, smooth: 3, d: 3 } },
      ])),
      p('The **Stochastic** shows where the close sits in the last 14 candles\' range.'),
      formula('%K = 100 x (close - lowest low) / (highest high - lowest low)', 'Near 100 means closing at the top of the recent range; near 0, at the bottom. %K is smoothed, and %D is a 3-period average of %K that acts as a signal line.'),
      p('Above **80** is overbought, below **20** oversold. %K crossing %D at an extreme is read as a signal.'),
      p('**Divergence** is price and oscillator disagreeing: a higher price high on a lower RSI high warns the move is tiring.'),
      warn('Overbought does not mean about to fall', 'In a strong uptrend RSI can stay above 70 for weeks. Oscillators work best in ranges, worst in trends, and divergences are clearer afterwards than in real time.'),
      note('Match the tool to the market', 'In a range, use the extremes. In a trend, only trade with it: for example, buy when RSI dips towards 40 in an uptrend.'),
    ],
  },
  {
    id: 'macd',
    title: 'MACD',
    summary: 'The gap between two moving averages, used to see momentum building or fading.',
    minutes: 5,
    blocks: [
      p('**MACD** measures the gap between a fast and a slow EMA. A speeding trend pulls them apart; a tiring one brings them together.'),
      ul(
        '**MACD line** = 12-period EMA minus 26-period EMA.',
        '**Signal line** = 9-period EMA of the MACD line.',
        '**Histogram** = MACD line minus signal line, drawn as bars.',
      ),
      chart(real('SPY', '2024-06-03', '2025-06-30', 'SPY with MACD in the lower pane. The bars are the histogram: positive when the MACD line is above its signal line.', [
        { id: 'macd', params: { fast: 12, slow: 26, signal: 9 } },
      ])),
      ul(
        '**Signal crossover**: MACD above its signal line, momentum turning up.',
        '**Zero line**: above zero, the 12 EMA is above the 26, an uptrend.',
        '**Histogram shrinking**: momentum fading, the earliest of the three.',
        '**Divergence**: a new price high on a lower MACD high.',
      ),
      worked('Reading one moment', 'MACD line is +1.8 and the signal line is +1.2.', 'MACD is above zero: the fast average is above the slow one, so the trend is up.', 'The histogram is +0.6: MACD is above its signal, so momentum is positive.', 'If the histogram was +1.1 a few candles ago, momentum is fading even though both readings are still bullish.'),
      warn('Weaknesses', 'An average of averages lags twice, tangles in ranges, and is in price units, so readings cannot be compared between markets.'),
      warn('Do not stack indicators', 'Indicators built from price mostly agree with each other. One trend tool, one momentum tool and volume is plenty.'),
    ],
  },
  {
    id: 'volume-and-vwap',
    title: 'Volume and VWAP',
    summary: 'Volume shows how much conviction is behind a move. VWAP shows the average price actually paid.',
    minutes: 5,
    blocks: [
      p('**Volume** is how much traded in a candle. Price shows what happened; volume shows how many were behind it. It is the one common indicator not made from price.'),
      img(
        'djia-volume',
        'A long-term chart of Dow Jones Industrial Average trading volume rising over many years',
        'Dow Jones trading volume over decades. "High" only means something compared with normal for the time.',
      ),
      ul(
        'Moves on **high volume** have broad support and tend to continue.',
        'Moves on **low volume** are easier to reverse.',
        'A **breakout** with a jump in volume is more trustworthy.',
        'A huge spike after a long move, a **climax**, can mark exhaustion.',
      ),
      p('A 20-period **volume moving average** shows what is normal. Bars well above it are unusual.'),
      chart(real('AAPL', '2024-09-03', '2025-06-30', 'Apple with a 20-day volume average on the volume bars and monthly VWAP on price. Look for the tallest volume bars and what price did on those days.', [
        { id: 'volumeMa', params: { period: 20 } },
        { id: 'vwap', params: {} },
      ])),
      p('**VWAP** is the volume-weighted average price paid this session. Above it, the average buyer is in profit; price often returns to it during the day.'),
      formula('VWAP = sum(typical price x volume) / sum(volume),   typical price = (high + low + close) / 3', 'The sums restart each session. In this app that is each day on intraday charts and each month on daily charts.'),
      warn('Weaknesses', 'Volume does not say which side was more eager, crypto and forex volume is from one venue only (EUR/USD here has none), and VWAP means little just after it resets.'),
      note('One tool per job', 'Trend: moving averages. Volatility: Bollinger, ATR. Momentum: RSI, Stochastic, MACD. Participation: volume, VWAP. Add any of them from the Indicators button.'),
    ],
  },
]);

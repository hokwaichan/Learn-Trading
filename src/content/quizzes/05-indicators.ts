import { defineQuizzes, q } from './helpers';

export const indicatorsQuizzes = defineQuizzes('indicators', {
  'moving-averages': [
    q('The last four closes are 20, 22, 24 and 26. What is the 4-period SMA?', ['22', '23', '24', '26'], 1, '(20 + 22 + 24 + 26) / 4 = 92 / 4 = 23.'),
    q('How does an EMA differ from an SMA of the same period?', ['It uses the high instead of the close', 'It gives recent closes more weight, so it reacts sooner', 'It never lags', 'It is always above the SMA'], 1, 'The EMA weights recent prices more heavily. It still lags, only less.'),
    q('Why do moving averages lag?', ['Exchanges delay the data', 'They are built from prices that have already happened', 'They use the wrong formula', 'They only update once a day'], 1, 'An average of past closes can only turn after price has already turned.'),
    q('In which market do moving average crossovers give the most false signals?', ['A strong uptrend', 'A strong downtrend', 'A sideways range', 'They never give false signals'], 2, 'In a range price crosses back and forth over the average, producing a string of whipsaws.'),
    q('What is a golden cross?', ['Price touching a round number', 'The 50-period average crossing above the 200-period average', 'RSI crossing 50', 'Two dojis in a row'], 1, 'A shorter average crossing above a longer one. The opposite is a death cross.'),
  ],
  'volatility-indicators': [
    q('What do Bollinger Bands do when the market becomes more volatile?', ['Narrow', 'Widen', 'Disappear', 'Turn flat'], 1, 'The bands are set by standard deviation, which grows when closes are more spread out.'),
    q('A Bollinger "squeeze" (very narrow bands) suggests:', ['Price will rise', 'Price will fall', 'Volatility is unusually low and a larger move may follow, direction unknown', 'The trend has ended'], 2, 'A squeeze says a move is likely, not which way.'),
    q('A stock trades at $100 with an ATR of $2. A stop-loss $0.50 from your entry is:', ['Safely wide', 'Inside normal noise and likely to be hit by chance', 'Exactly right', 'Impossible to place'], 1, 'A typical candle covers about $2. A $0.50 stop will be triggered by ordinary movement.'),
    q('What does ATR tell you about direction?', ['Rising ATR means price is rising', 'Falling ATR means price is falling', 'Nothing: it measures the size of moves only', 'It always points to the trend'], 2, 'ATR is volatility. A high ATR can accompany a rally or a crash.'),
    q('ATR doubles. To risk the same dollars with a stop the same number of ATRs away, your position should be:', ['Twice as large', 'The same size', 'Half the size', 'Closed'], 2, 'A wider stop needs a smaller position to keep the dollar risk constant.'),
  ],
  'momentum-oscillators': [
    q('RSI is 78. This is called:', ['Oversold', 'Overbought', 'Neutral', 'Divergent'], 1, 'Above 70 is overbought: price has risen quickly. It is a caution, not a sell signal.'),
    q('In a strong uptrend, RSI above 70 most often means:', ['Sell immediately', 'The trend is strong, and RSI can stay high for a long time', 'The data is wrong', 'A crash is certain'], 1, 'Strong trends keep oscillators pinned at their extremes. Selling just because RSI is high is a classic mistake.'),
    q('What does the Stochastic oscillator measure?', ['The average gain versus average loss', 'Where the close sits within the recent high-low range', 'The gap between two moving averages', 'Volume'], 1, '%K shows the close as a percentage of the way from the lowest low to the highest high.'),
    q('Price makes a higher high while RSI makes a lower high. This is:', ['Bullish divergence', 'Bearish divergence', 'A golden cross', 'A squeeze'], 1, 'The new high came with less momentum. It warns the move may be tiring.'),
    q('Oscillators such as RSI and Stochastic are most useful in:', ['Strong trends', 'Sideways ranges', 'Markets with no volume', 'Every market equally'], 1, 'In a range, extremes tend to mark turning points. In a trend they stay extreme and mislead.'),
  ],
  macd: [
    q('How is the MACD line calculated?', ['12-period EMA minus 26-period EMA', '26-period SMA minus 12-period SMA', 'Close minus open', 'RSI minus 50'], 0, 'The MACD line is the fast EMA minus the slow EMA.'),
    q('The MACD line is above zero. That means:', ['The 12 EMA is above the 26 EMA', 'RSI is above 50', 'Price is above 100', 'Volume is rising'], 0, 'Positive MACD means the fast average is above the slow one, which describes an uptrend.'),
    q('What does the MACD histogram show?', ['Volume', 'The MACD line minus its signal line', 'The 26 EMA', 'The spread'], 1, 'The bars are the gap between MACD and its signal. They shrink before the lines cross.'),
    q('Why is MACD said to lag twice?', ['It is published a day late', 'It is an average of moving averages', 'It uses two timeframes', 'It ignores the close'], 1, 'The signal line is an EMA of a difference of EMAs. Crossovers arrive well after price turns.'),
    q('Adding five indicators that all derive from price will mostly give you:', ['Five independent confirmations', 'Signals that agree with each other because they share the same input', 'Guaranteed profits', 'Less lag'], 1, 'Indicators built from the same closes are not independent evidence.'),
  ],
  'volume-and-vwap': [
    q('A breakout happens on volume far above average. Compared with one on light volume it is:', ['Less trustworthy', 'More trustworthy', 'Exactly the same', 'A fakeout by definition'], 1, 'High volume shows many traders took part, so the move has more behind it.'),
    q('What does volume NOT tell you?', ['How much was traded', 'Whether buyers or sellers were the more eager side', 'Whether the candle was unusually busy', 'How participation compares with normal'], 1, 'Every trade has a buyer and a seller. Volume counts the trades, not who pushed.'),
    q('VWAP is best described as:', ['The highest price of the session', 'The average price paid this session, weighted by volume', 'A 20-period moving average', 'The opening price'], 1, 'Each candle counts according to how much traded in it.'),
    q('Price is trading above VWAP. Traders read this as:', ['Sellers in control', 'Buyers in control: the average buyer this session is in profit', 'A guaranteed breakout', 'Nothing at all'], 1, 'Above VWAP means recent buyers are, on average, sitting on gains.'),
    q('Why can VWAP not be drawn on the bundled EUR/USD chart?', ['Forex has no prices', 'That data has no volume', 'VWAP only works on stocks', 'It can, it is just hidden'], 1, 'VWAP needs volume to weight prices. Without it there is nothing to calculate.'),
  ],
});

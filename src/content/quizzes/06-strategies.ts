import { defineQuizzes, q } from './helpers';

export const strategiesQuizzes = defineQuizzes('strategies', {
  'trend-following': [
    q('What does trend following assume?', ['Prices always return to their average', 'A market already moving one way is more likely to continue than reverse', 'Tops and bottoms can be predicted', 'Volume does not matter'], 1, 'You do not predict the trend. You wait for one, join it and stay until it ends.'),
    q('In a moving-average crossover system, when do you enter long?', ['When the fast average crosses above the slow average', 'When RSI is below 30', 'When price touches support', 'At the market open'], 0, 'The fast average crossing above the slow one is the entry; the cross back is the exit.'),
    q('A trend-following system wins 35% of its trades and is still profitable. How?', ['It cannot be', 'The few winners are much larger than the many small losses', 'It hides its losses', 'It uses no stop-loss'], 1, 'Trend systems rely on occasional large trends paying for many small losing trades.'),
    q('Where does a crossover system perform worst?', ['In long steady trends', 'In sideways ranges', 'In high-volume markets', 'On daily charts'], 1, 'In a range the averages tangle and every cross is a whipsaw.'),
  ],
  'breakout-trading': [
    q('In a range breakout trade above resistance, where does the stop-loss usually go?', ['Far above the entry', 'Just back inside the range', 'At the bottom of the range', 'Nowhere'], 1, 'If price returns inside the range the breakout has failed, so you want to be out with a small loss.'),
    q('What is a simple mechanical breakout rule?', ['Buy when RSI is below 30', 'Buy a new 20-day high, sell a new 10-day low', 'Buy every Monday', 'Buy when price touches the lower Bollinger Band'], 1, 'A channel breakout needs no judgement, which makes it easy to backtest.'),
    q('Which filter makes a breakout more trustworthy?', ['Below-average volume', 'Clearly above-average volume on the breakout candle', 'A wick above the level', 'Trading against the larger trend'], 1, 'Volume shows real participation behind the move.'),
    q('The breakout candle has already run far above the level. The best response is usually to:', ['Buy immediately with a wide stop', 'Skip it or wait for a retest', 'Short it', 'Double your size'], 1, 'Buying far from the level means a distant stop and a poor risk/reward.'),
  ],
  'mean-reversion': [
    q('What does mean reversion bet on?', ['Trends continuing', 'A price stretched far from its average returning towards it', 'Breakouts succeeding', 'Volume rising'], 1, '"Mean" is another word for average. The bet is on a snap back.'),
    q('What is the typical profile of a mean-reversion strategy?', ['Low win rate, large winners', 'High win rate, small winners, rare large losers', 'It never loses', 'Equal wins and losses'], 1, 'Most stretches snap back a little. The danger is the one that keeps going.'),
    q('In which market is mean reversion most dangerous?', ['A quiet range', 'A strong trend', 'A market with tight spreads', 'A weekend'], 1, 'In a strong trend, oversold keeps getting more oversold.'),
    q('What is "averaging down"?', ['Lowering your leverage', 'Buying more of a position as it falls', 'Using a longer moving average', 'Taking partial profit'], 1, 'Adding to a loser multiplies the damage if price keeps falling. Avoid it.'),
  ],
  'support-resistance-bounce': [
    q('Where does the bounce strategy enter long?', ['In the middle of the range', 'Near support, after price shows a reaction', 'Above resistance', 'At a new all-time high'], 1, 'You want price at the edge of the range and evidence that buyers are responding.'),
    q('Why wait for a reaction candle before entering at support?', ['It lowers fees', 'Without it you are buying into falling prices with no sign the level is holding', 'It is required by the exchange', 'It guarantees a profit'], 1, 'Buying a level blindly is called catching a falling knife.'),
    q('Why can the bounce offer a good risk/reward?', ['The stop is close (just beyond the level) while the target is the far side of the range', 'It never loses', 'It uses leverage', 'Fees are lower'], 0, 'A small defined risk against a larger possible reward is the appeal.'),
    q('A steep, high-volume move is pressing on support. The level is:', ['More likely to hold', 'More likely to break; better to stand aside', 'Certain to hold', 'Irrelevant'], 1, 'Strong momentum into a level favours a break rather than a bounce.'),
  ],
  'trading-styles': [
    q('Which style holds trades for days to a few weeks?', ['Scalping', 'Day trading', 'Swing trading', 'Position trading'], 2, 'Swing trading aims to catch one swing of a trend on the 4-hour and daily charts.'),
    q('Why are fees and spread a bigger problem for scalpers?', ['Scalpers pay higher rates', 'Each profit is tiny, so costs take a large share of it', 'Scalpers trade larger instruments', 'They are not a problem'], 1, 'When you aim for very small moves, a fixed cost per trade is a large fraction of the gain.'),
    q('What risk does a day trader avoid that a swing trader accepts?', ['Slippage', 'Overnight risk: price gapping while the position is held', 'Fees', 'Liquidation'], 1, 'Day traders close everything before the end of the day, so overnight news cannot gap against them.'),
    q('Which style is usually recommended for a beginner with a job?', ['Scalping on the 1-minute chart', 'Swing trading on the daily or 4-hour chart', 'Day trading on the 5-minute chart', 'Whatever is most exciting'], 1, 'Slower decisions, less noise, lower costs, and it fits around other commitments.'),
  ],
});

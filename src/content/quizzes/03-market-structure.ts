import { defineQuizzes, q } from './helpers';

export const marketStructureQuizzes = defineQuizzes('market-structure', {
  trends: [
    q('What defines an uptrend?', ['Three up candles in a row', 'Higher highs and higher lows', 'Price above 100', 'Rising volume'], 1, 'An uptrend is a series of swing highs and swing lows that each sit above the previous one.'),
    q('Swing highs: 50, 48, 45. Swing lows: 44, 42, 39. The market is in:', ['An uptrend', 'A downtrend', 'A range', 'A breakout'], 1, 'Lower highs and lower lows define a downtrend.'),
    q('In an uptrend, what is the first warning that it may be ending?', ['A doji', 'A bounce that fails to reach the previous high (a lower high)', 'A higher low', 'A day of low volume'], 1, 'A lower high shows buyers could not push as far as before. The trend is broken if price then falls below the last higher low.'),
    q('Highs and lows are roughly level, with no clear direction. This is called:', ['A trend', 'A range', 'A liquidation', 'A spread'], 1, 'Sideways movement between similar highs and lows is a range, or consolidation.'),
  ],
  'support-and-resistance': [
    q('Support is a price level where:', ['Sellers have repeatedly stopped a rise', 'Buyers have repeatedly stopped a fall', 'The exchange halts trading', 'Volume is always highest'], 1, 'Support is where falling prices have turned up before because buyers appeared.'),
    q('Price breaks clearly above resistance at 80 and later falls back to 80. What often happens there?', ['80 acts as support', '80 acts as resistance again', 'Nothing: broken levels stop mattering', 'Trading is suspended'], 0, 'Role reversal: broken resistance often becomes support. The return to the level is called a retest.'),
    q('Why is it better to think of support as a zone than a line?', ['Charts are imprecise drawings', 'Price rarely turns at exactly the same number each time', 'Zones are easier to draw', 'Exchanges round prices'], 1, 'Turning points cluster around a level rather than hitting it exactly. A wick through the level is not a break.'),
    q('Which level is likely to be strongest?', ['One touched once on the 1-minute chart', 'One that turned price three times on the daily chart', 'One you drew at a random price', 'One from this morning\'s first candle'], 1, 'More touches and longer timeframes make a level matter more.'),
  ],
  'trend-lines': [
    q('To draw an uptrend line you connect:', ['Two swing highs', 'Two swing lows', 'The first and last candle', 'The highest and lowest price'], 1, 'An uptrend line joins the swing lows. A downtrend line joins the swing highs.'),
    q('How many touches confirm a trend line?', ['One', 'Two', 'Three', 'Ten'], 2, 'Any two points make a line. A third touch that holds shows other traders are respecting it.'),
    q('Price closes below an uptrend line. What does that tell you for certain?', ['The trend has reversed to a downtrend', 'The trend has at least slowed; a reversal needs a lower high and lower low', 'You must go short', 'The line was drawn wrongly'], 1, 'A trend line break means the pace has changed. Price may go sideways or rise more gently. Look to swing structure for a reversal.'),
    q('What is a channel?', ['A trend line plus a parallel line on the other side of price', 'A type of order', 'A very narrow range', 'A news feed'], 0, 'A second parallel line through the opposite swings gives a band that price travels inside.'),
  ],
  'breakouts-and-fakeouts': [
    q('What is a fakeout?', ['A breakout on very high volume', 'Price poking beyond a level and then reversing back inside the range', 'A candle with no wicks', 'An order that fails to fill'], 1, 'A fakeout traps traders who bought the break when price cannot hold beyond the level.'),
    q('Which is the strongest evidence of a real breakout above resistance?', ['A wick above the level on light volume', 'A candle closing above the level on clearly higher volume', 'Price touching the level', 'A doji just below the level'], 1, 'A close beyond the level with heavy volume shows real buying, not a brief poke.'),
    q('After a breakout above 110, price returns to 110, holds, and turns up. This is called:', ['A fakeout', 'A retest that confirms the breakout', 'A liquidation', 'A lower high'], 1, 'Old resistance acting as support on the retest is confirmation that the breakout is real.'),
    q('You buy a breakout above 110. Where does a sensible stop-loss go?', ['At 130', 'Just back inside the range, below 110', 'Exactly at your entry price', 'You do not need one'], 1, 'If price returns inside the range the breakout has failed. A stop just below the broken level gets you out.'),
    q('What is the trade-off in waiting for the retest before entering?', ['Fewer fakeouts, but sometimes price never comes back and you miss the move', 'More fakeouts but a better price', 'Higher fees', 'There is no trade-off'], 0, 'Waiting filters out many false breaks and gives a close stop, at the cost of missing breakouts that never retest.'),
  ],
});

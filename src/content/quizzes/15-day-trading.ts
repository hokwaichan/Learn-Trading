import { defineQuizzes, q } from './helpers';

export const dayTradingQuizzes = defineQuizzes('day-trading', {
  'the-trading-day': [
    q('How is volume usually spread across a trading day?', ['Evenly', 'High at the open and close, low in the middle', 'Highest at midday', 'Rising steadily all day'], 1, 'Volume by hour forms a U: busy at the open, quiet at midday, busy again into the close.'),
    q('Why do many day traders avoid the middle of the day?', ['Exchanges are closed', 'Low volume makes ranges narrow and breakouts unreliable', 'Fees are higher', 'Price cannot move'], 1, 'Thin midday trading produces choppy, directionless price action where setups fail more often.'),
    q('You aim for a 0.5% gain. Fees are 0.1% each way and the spread costs 0.05%. Roughly how much of the target goes on costs?', ['About 5%', 'About half', 'None', 'All of it'], 1, 'Costs are about 0.25% on a 0.5% target: half. This is why costs dominate day trading.'),
    q('When is crypto most active, even though it never closes?', ['At weekends', 'During the London and New York sessions', 'At midnight UTC only', 'Activity is constant'], 1, 'Crypto follows the traditional business day. Weekends and the gap between sessions are thin.'),
  ],
  'opening-range': [
    q('What is the opening range?', ['The first trade of the day', 'The high and low of the first minutes of the session', 'Yesterday’s range', 'The widest candle of the day'], 1, 'It is the range set in a fixed opening period, commonly 15, 30 or 60 minutes.'),
    q('When may you mark the opening range?', ['As soon as the session opens', 'Only when the chosen opening period has finished', 'At the close', 'The day before'], 1, 'Until the period ends the range is still forming. Using it early means trading a level that does not exist yet.'),
    q('What triggers an opening range breakout entry?', ['A wick outside the range', 'A candle closing outside the range', 'Price touching the range high', 'The clock reaching 10am'], 1, 'A close outside the range is the signal. A wick that returns inside is a false break.'),
    q('The opening range is 50 to 52 and you buy a break at 52.4 with a stop at the midpoint. What is your risk per unit?', ['0.4', '1.4', '2.4', '52.4'], 1, 'The midpoint is 51. 52.4 - 51 = 1.4.'),
    q('Why is a narrow opening range often better than a wide one?', ['It guarantees a breakout', 'The stop is smaller and the day’s move has not been used up', 'Fees are lower', 'It lasts longer'], 1, 'A tight range means a close stop and energy still to be released. A very wide range has already done much of the day’s travelling.'),
  ],
  'vwap-intraday': [
    q('Price is trading above VWAP. What does that say about the average buyer today?', ['They are losing money', 'They are in profit', 'They have all sold', 'Nothing'], 1, 'VWAP is the average price paid today. Above it, the average buyer is sitting on a gain.'),
    q('What is a VWAP reclaim?', ['Price falling below VWAP', 'Price starting below VWAP, closing back above it and holding on a retest', 'VWAP restarting at midnight', 'A fee refund'], 1, 'A reclaim signals that control has passed from sellers to buyers. The entry is the retest that holds.'),
    q('Why is VWAP unreliable in the first minutes of a session?', ['It has not been invented yet', 'It is built from very little data at that point', 'Exchanges hide it', 'It only updates hourly'], 1, 'Early in the session a few trades make up the whole average, so the line jumps around.'),
    q('On a strong trend day, what happens to a trader who waits for a pullback to VWAP?', ['They get the best entry', 'They may miss the whole move, because price never returns', 'They are stopped out', 'Nothing changes'], 1, 'Strong trend days leave VWAP early and do not come back. No single entry rule fits every day.'),
    q('Why do large funds buying over a day give VWAP real influence?', ['They are judged against it, so they buy more below it and less above', 'They set it by law', 'They only trade at the close', 'They do not use it'], 0, 'Execution quality is measured against VWAP, which creates genuine buying interest below the line.'),
  ],
  'key-levels': [
    q('Which of these is a key intraday level?', ['The 3-candle average', 'The previous day’s high', 'A random price', 'The fee rate'], 1, 'Yesterday’s high, low and close are the first levels a day trader marks.'),
    q('Price closes above yesterday’s high and holds it on a retest. This suggests:', ['A sweep and reversal', 'A break and hold: a possible trend day', 'Nothing', 'The market is closing'], 1, 'Old resistance acting as support after a clean break is the start of a trend day.'),
    q('Price spikes above yesterday’s high and closes back below it. This is:', ['A break and hold', 'A liquidity sweep', 'A gap', 'An opening range'], 1, 'A poke through a known level that fails to hold is a sweep, and often leads back across the range.'),
    q('How do you decide between "break and hold" and "sweep and reverse"?', ['Guess before price arrives', 'Wait for the candle to close and trade what actually happened', 'Always assume a breakout', 'Always assume a reversal'], 1, 'You do not need to predict. The close tells you which occurred.'),
    q('Why keep the number of marked levels small?', ['Charts cannot hold more', 'With many lines there is always one nearby to justify any trade', 'Lines cost money', 'Fewer lines load faster'], 1, 'Too many levels remove the discipline of waiting for price to reach a place that matters.'),
  ],
  'momentum-and-scalping': [
    q('What are the three parts of a basic momentum setup?', ['Sweep, shift, return', 'Impulse, pause, trigger', 'Open, high, close', 'Bid, ask, spread'], 1, 'A sharp move, a quiet pause, then a close beyond the pause in the direction of the move.'),
    q('What should volume do during the pause?', ['Rise sharply', 'Fall', 'Stay at the day’s high', 'It does not matter'], 1, 'Falling volume in the pause shows there is little interest in pushing against the move.'),
    q('Target 0.2%, round-trip costs 0.25%. What does a winning trade make?', ['+0.2%', '+0.45%', 'A small loss', 'Break-even'], 2, '0.2% - 0.25% = -0.05%. Costs larger than the target turn every winner into a loss.'),
    q('Why can professional scalpers succeed where retail traders cannot?', ['They know the future', 'Far lower fees, rebates and faster execution', 'They trade at night', 'They never use stops'], 1, 'Their costs are a fraction of a retail trader’s, and their systems react in microseconds.'),
    q('A sensible rule for short-term trades is that the target should be:', ['Equal to the fee', 'At least about ten times the round-trip cost', 'Smaller than the spread', 'Unlimited'], 1, 'Costs must be a small fraction of the target for an edge to survive them.'),
  ],
  'daily-routine': [
    q('What is a daily loss limit?', ['The largest position allowed', 'A preset loss at which you stop trading for the day', 'The exchange’s maximum fee', 'The lowest price of the day'], 1, 'It is a hard stop on the session, decided in advance while calm.'),
    q('You risk 1% a trade and use the common rule for a daily limit. Where do you stop?', ['Minus 1%', 'Minus 3%', 'Minus 10%', 'There is no limit'], 1, 'Three times the per-trade risk is the usual choice: three full losses ends the day.'),
    q('Why does the limit matter most after losses?', ['Fees rise', 'The urge to get back to even leads to larger sizes and worse entries', 'Markets close early', 'Stops stop working'], 1, 'Revenge trading turns an ordinary losing day into a large one. The limit removes the decision.'),
    q('How should you grade a trading day?', ['By profit alone', 'By whether you followed your rules', 'By the number of trades', 'By hours at the screen'], 1, 'Process over outcome. A rule-following losing day is good; a rule-breaking winning day teaches a harmful habit.'),
    q('A trade idea appears that was not in your written plan. The routine says:', ['Take it if it looks good', 'It is not a trade today', 'Take it at double size', 'Take it without a stop'], 1, 'Plans are written when calm. Ideas that appear mid-session are usually impulses.'),
  ],
});

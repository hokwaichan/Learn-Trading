import { defineQuizzes, q } from './helpers';

export const smartMoneyQuizzes = defineQuizzes('smart-money', {
  'structure-bos-choch': [
    q('In an uptrend, price closes above the most recent swing high. In SMC this is called:', ['A change of character', 'A break of structure', 'A liquidity sweep', 'An order block'], 1, 'A close beyond the last swing point in the direction of the trend is a break of structure: the trend continues.'),
    q('In an uptrend, price closes below the most recent higher low for the first time. This is:', ['A break of structure', 'A change of character', 'A fair value gap', 'A retest'], 1, 'The first break against the trend is a change of character. It warns that the trend may be turning.'),
    q('A candle has a wick above the last swing high but closes below it. Has structure broken?', ['Yes, any trade above the level counts', 'No, only a close beyond the level counts', 'Only on the daily chart', 'Only if volume is high'], 1, 'A break needs a close beyond the level. A wick that returns is more likely a sweep.'),
    q('What is the most reasonable response to a change of character?', ['Immediately trade the new direction with full size', 'Stop looking for trades in the old direction and wait for more evidence', 'Ignore it', 'Double the existing position'], 1, 'Many changes of character lead only to a deeper pullback. It is a reason for caution, not yet a reason to reverse.'),
    q('Which statement about SMC is most accurate?', ['It is proven to outperform other methods', 'It gives precise names to price behaviour, but its claims about institutions cannot be checked from a chart', 'It only works on crypto', 'It replaces the need for a stop-loss'], 1, 'The vocabulary is useful. The story about institutional intent is unverifiable, and no evidence shows SMC beats simpler approaches.'),
  ],
  liquidity: [
    q('In SMC, what is a liquidity pool?', ['A savings account', 'A price where many stop and breakout orders are clustered', 'A type of exchange', 'A very wide spread'], 1, 'Liquidity here means resting orders. They gather just beyond obvious highs and lows.'),
    q('Where does buy-side liquidity sit?', ['Below an obvious low', 'Above an obvious high', 'At the current price', 'Only at round numbers'], 1, 'Above a high are the buy stops of short sellers and the buy orders of breakout traders.'),
    q('Price spikes above three equal highs and closes back below them. This is:', ['A break of structure', 'A liquidity sweep', 'A fair value gap', 'A golden cross'], 1, 'A wick beyond the level with a close back inside is a sweep. A close held beyond it would be a break.'),
    q('You are long. How can a liquidity pool above the market help you?', ['It is a natural target for taking profit', 'It guarantees the trade wins', 'It lowers your fees', 'It moves your stop-loss automatically'], 0, 'Price tends to reach for clusters of orders, so the pool above a high is a sensible profit target.'),
    q('At the moment price first pokes above a high, can you tell a sweep from a real breakout?', ['Yes, sweeps are always faster', 'No, only the close tells you', 'Yes, by the colour of the candle', 'Yes, breakouts never have wicks'], 1, 'They begin identically. Wait for the candle to close before deciding which it was.'),
  ],
  'order-blocks': [
    q('A bullish order block is:', ['Any green candle', 'The last down candle before a strong move up that breaks structure', 'The highest candle of the day', 'A limit order placed by a bank'], 1, 'It is the last candle against the move, and the move must go on to break structure.'),
    q('Which order block is considered most reliable?', ['One that price has returned to several times', 'A fresh one, on its first return, that led to a break of structure', 'One in the middle of a range', 'One on the 1-minute chart'], 1, 'The first return to a block that produced a structure break is the one that counts. Later visits find fewer orders.'),
    q('You buy at a bullish order block spanning 50 to 52. Where does the stop-loss belong?', ['At 51, the middle', 'Just below 50', 'At 60', 'No stop is needed'], 1, 'If price trades through the whole block, the idea has failed. The stop goes just beyond its far edge.'),
    q('What does "mitigated" mean for an order block?', ['It has never been touched', 'Price has already returned to it', 'It is on a higher timeframe', 'It has no wicks'], 1, 'A mitigated block has been revisited, so the orders assumed to be waiting there are considered used up.'),
    q('What is the danger of marking every opposite-coloured candle as an order block?', ['The chart fills with zones, so price always seems to react to one', 'The platform crashes', 'It is against exchange rules', 'There is none'], 0, 'With enough zones, something will always look like it worked. A strict definition keeps the idea testable.'),
  ],
  'fair-value-gaps': [
    q('Three candles: the first has a high of 100, the third has a low of 103. What is this?', ['A bearish fair value gap from 100 to 103', 'A bullish fair value gap from 100 to 103', 'No gap', 'An order block'], 1, 'The third candle low is above the first candle high, so the range between was traded only by the middle candle: a bullish gap.'),
    q('When is a fair value gap "filled"?', ['When price touches its edge', 'When price trades all the way through it', 'After three candles', 'When volume doubles'], 1, 'A gap is filled once price has traded through the whole range. Dipping in and leaving is a partial return.'),
    q('In an uptrend, how do traders most often use a bullish fair value gap?', ['As a place to look for a long when price pulls back into it', 'As a reason to short', 'As a signal to close everything', 'They ignore it'], 0, 'The gap is treated as a zone where buyers who missed the move may step in.'),
    q('Why are fair value gaps on the 1-minute chart less useful?', ['They cannot form there', 'There are dozens a day and most mean nothing', 'They are always filled instantly', 'Exchanges hide them'], 1, 'Low timeframes are noisy. Gaps made by clearly large candles on higher timeframes carry more weight.'),
  ],
  'premium-and-discount': [
    q('A range runs from 200 to 240. Where is equilibrium?', ['210', '220', '230', '240'], 1, 'Equilibrium is the midpoint: (200 + 240) / 2 = 220.'),
    q('In that range, price is at 208. It is in:', ['Premium', 'Discount', 'Equilibrium', 'Neither'], 1, 'Below the midpoint is discount: cheap relative to the range.'),
    q('In an uptrend, where does SMC say to look for longs?', ['In premium', 'In discount', 'Only at the range high', 'Anywhere'], 1, 'Buying in the lower half keeps the stop close and the target far, which gives a better risk/reward.'),
    q('Why is buying in premium a poor trade even if the trend is up?', ['It is not allowed', 'The stop has to be far away while the target is close', 'Fees are higher', 'Volume is always low there'], 1, 'Near the top of the range, the logical stop is distant and the logical target is near. The risk/reward is bad from the start.'),
  ],
  'smc-setup': [
    q('What is the correct order of the standard SMC reversal setup?', ['Return, shift, sweep', 'Sweep, shift, return', 'Shift, sweep, return', 'Sweep, return, shift'], 1, 'Liquidity is taken first, then price shifts structure the other way, then it returns to the gap or block for the entry.'),
    q('In that setup, where is the stop-loss normally placed?', ['At the entry price', 'Beyond the extreme of the sweep', 'At the first target', 'In the middle of the fair value gap'], 1, 'If price goes back past the low (or high) made by the sweep, the reversal idea is wrong.'),
    q('A setup has a risk of 5 and the first realistic target gives a reward of 6. What should you conclude?', ['It is a great trade', 'The risk/reward is too low unless a further target is realistic', 'Double the size', 'Remove the stop'], 1, 'About 1.2 to 1 leaves little room for losses. Look for at least 2 to 1 to a target price can reasonably reach.'),
    q('Why is SMC hard to test objectively?', ['It uses secret data', 'Each element needs judgement, so two traders mark the same chart differently', 'It only works at night', 'Charts are not accurate enough'], 1, 'Discretion makes the method flexible and also makes it easy to explain any outcome afterwards. Fixed written rules are the cure.'),
    q('What is the best evidence that the setup works for you?', ['A popular video', 'Your own logged results over dozens of trades taken by fixed rules', 'One large winning trade', 'How confident you feel'], 1, 'Only a record of your own trades, taken by a checklist and reviewed in numbers, tells you whether you have an edge.'),
  ],
});

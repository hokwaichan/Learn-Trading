import { defineQuizzes, q } from './helpers';

export const ictQuizzes = defineQuizzes('ict', {
  'sessions-and-kill-zones': [
    q('Which session is usually the quietest?', ['London', 'New York', 'Asia', 'The London and New York overlap'], 2, 'Asia is typically the lowest-volume session, and price often stays in a narrow range.'),
    q('What is a kill zone?', ['A price where stops are hit', 'A window of time when the main move of the day is expected to begin', 'A type of order block', 'The last hour of trading'], 1, 'Kill zones are time windows inside the sessions, such as 2am to 5am New York time for London.'),
    q('Why do ICT traders pay attention to the Asian range?', ['It sets the daily closing price', 'Its high and low are liquidity that the London open often sweeps', 'It has the highest volume', 'Fees are lower then'], 1, 'Stops gather outside the quiet overnight range, making its edges a common target when London opens.'),
    q('A perfect-looking setup appears at 6pm New York time, between sessions. What is the concern?', ['None', 'Little is trading, so the move is less likely to follow through', 'The exchange is closed for all markets', 'Setups cannot form then'], 1, 'Patterns on thin volume are less reliable. Time of day is part of the setup.'),
    q('How does restricting yourself to one kill zone help a day trader?', ['It guarantees profits', 'It limits screen time and keeps trading to active hours', 'It removes the need for a stop-loss', 'It lowers the spread to zero'], 1, 'Fewer hours means fewer impulsive trades, taken only when the market is moving.'),
  ],
  'power-of-three': [
    q('What are the three phases of the power of three?', ['Open, high, close', 'Accumulation, manipulation, distribution', 'Sweep, shift, return', 'Asia, London, New York'], 1, 'AMD: a quiet range, a false move, then the real move.'),
    q('On a day that ends higher, when is the low usually made?', ['Near the close', 'Early, during the manipulation phase', 'Exactly at midday', 'It is random'], 1, 'An up day typically dips first to make its low, then travels up toward the close.'),
    q('What is the "Judas swing"?', ['The real move of the day', 'The false move that breaks the opening range the wrong way', 'A swing high on the weekly chart', 'A kind of moving average'], 1, 'It is the manipulation leg: a move that triggers stops and draws traders in on the wrong side.'),
    q('You expect an up day. Price drops below the opening range early in London. The model suggests:', ['Sell the breakdown', 'Wait for the drop to fail, then look to buy', 'Close the platform', 'Buy immediately with no stop'], 1, 'If the bias is right, that drop is the manipulation. The entry comes after it fails, with a stop below its low.'),
    q('What is the main weakness of the power of three?', ['It needs paid data', 'It depends on already knowing the direction of the day', 'It only works on Mondays', 'It cannot be drawn'], 1, 'If the bias is wrong, the supposed false move is the real one. The model does not supply the bias.'),
  ],
  'optimal-trade-entry': [
    q('Which retracement zone is the optimal trade entry?', ['23.6% to 38.2%', '38.2% to 50%', '62% to 79%', '100% to 127%'], 2, 'The OTE is the deep pullback between the 62% and 79% retracements, ideally about 70.5%.'),
    q('A move runs from 200 to 300. Roughly where is the 70.5% retracement?', ['270.5', '250', '229.5', '205'], 2, 'The move is 100. 70.5% of it is 70.5, measured back from the end: 300 - 70.5 = 229.5.'),
    q('Why does the OTE give a good risk/reward?', ['The stop is close to the entry and the target is far', 'Fees are waived', 'It always wins', 'Leverage is higher'], 0, 'Entering near the start of the move means a short distance to the stop and a long one to the old high and beyond.'),
    q('What is the cost of insisting on the OTE zone?', ['Higher fees', 'You miss strong trends that only pull back a little', 'Larger stops', 'None'], 1, 'The strongest moves often turn at 38% or 50%. Waiting for a deep pullback means missing them.'),
    q('Price has pulled back 70% and is still falling fast. What should you do before buying?', ['Buy at once, the zone has been reached', 'Wait for a lower-timeframe change of character upward', 'Remove the stop to give it room', 'Double the size'], 1, 'A deep pullback is also how a reversal begins. Wait for evidence that buyers have returned.'),
  ],
  'breakers-and-mitigation': [
    q('What is a breaker block?', ['An order block that held', 'An order block that failed after price had first swept liquidity', 'A very large candle', 'A circuit breaker on an exchange'], 1, 'A failed block becomes a breaker when the failure followed a sweep of liquidity.'),
    q('How does a mitigation block differ from a breaker?', ['It is on a higher timeframe', 'It failed without a sweep of liquidity first', 'It is always bullish', 'There is no difference'], 1, 'Same failure, but no liquidity was taken beforehand, so it is regarded as weaker.'),
    q('Price breaks down through a bullish order block and later rises back to it. What do ICT traders expect?', ['Support', 'Resistance: trapped buyers selling to get out', 'A gap', 'Nothing'], 1, 'Buyers from the block are losing. On the return they sell near break-even, which caps price.'),
    q('Which earlier idea is the breaker block closest to?', ['The golden cross', 'Role reversal: broken support becomes resistance', 'The doji', 'Funding rates'], 1, 'It is role reversal applied to a zone, with the added condition of a sweep.'),
    q('ICT has one name for a zone that holds and another for one that fails. Why is that a caution?', ['It means the framework can describe any outcome afterwards', 'It makes charts slower', 'It is illegal', 'It proves the method works'], 0, 'A framework that explains everything after the fact predicts nothing unless you commit to one outcome beforehand.'),
  ],
  'ict-trade-plan': [
    q('What comes first in an ICT-style routine?', ['Placing the limit order', 'Deciding the higher-timeframe bias', 'Calculating fees', 'Waiting for a sweep'], 1, 'Without a bias from the daily and 4-hour charts, the later steps have no direction.'),
    q('You have a bias but it is outside any kill zone. The plan says:', ['Trade anyway', 'Do nothing and wait', 'Trade half size', 'Switch to a lower timeframe'], 1, 'Time is one of the conditions. Outside the window, there is no trade.'),
    q('Account $10,000, risk 1%, entry 50, stop 48. How many units?', ['25', '50', '100', '200'], 1, 'Risk is $100. The stop distance is 2. 100 / 2 = 50 units.'),
    q('Which claim should you be most sceptical of?', ['Waiting for price to come to you helps risk/reward', 'An algorithm deliberately hunts retail stop-losses', 'Volume is higher in the London and New York overlap', 'A stop-loss limits the loss'], 1, 'That is a story about intent which a chart cannot verify. The behaviour it describes has simpler explanations.'),
    q('What do studies of real accounts say about day traders?', ['Most are profitable', 'The large majority lose money over time', 'Results are evenly split', 'Only crypto traders lose'], 1, 'Whatever the method, most day traders lose. Prove a system on paper, with your own records, before risking money.'),
  ],
});

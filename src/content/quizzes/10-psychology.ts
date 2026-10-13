import { defineQuizzes, q } from './helpers';

export const psychologyQuizzes = defineQuizzes('psychology', {
  'fomo-revenge-overtrading': [
    q('What is FOMO in trading?', ['A type of order', 'Jumping into a move already under way for fear of missing out', 'A fee on futures', 'A chart pattern'], 1, 'FOMO entries are late, unplanned and usually near the end of the move.'),
    q('You just took a loss and immediately open a larger trade to win it back. This is:', ['Sound risk management', 'Revenge trading', 'Hedging', 'Mean reversion'], 1, 'Trading to erase a loss, with more size and less thought, is revenge trading.'),
    q('A good question to test for FOMO before entering is:', ['"How much could I make?"', '"Where would my stop-loss be, and is it sensible?"', '"What is everyone else doing?"', '"How fast is it moving?"'], 1, 'If the only sensible stop is far away, you are late. Wait for a pullback or skip it.'),
    q('What is a practical defence against revenge trading?', ['Trading bigger after losses', 'A rule set in advance, such as stopping for the day after two losses', 'Removing stop-losses', 'Switching timeframes'], 1, 'Decide the rule while calm so you do not have to decide while angry.'),
    q('What do FOMO, revenge trading and overtrading have in common?', ['They all use leverage', 'The trade is taken to change how you feel, not because the rules were met', 'They only happen in crypto', 'They are all profitable long term'], 1, 'If the reason for a trade is an emotion, the answer is no.'),
  ],
  'loss-aversion': [
    q('Loss aversion means:', ['Traders avoid all losses', 'A loss hurts roughly twice as much as an equal gain feels good', 'Stops always work', 'Losses are taxed more'], 1, 'The asymmetry in how gains and losses feel drives much bad trading behaviour.'),
    q('What does loss aversion typically make traders do?', ['Hold winners and cut losers', 'Cut winners early and hold losers too long', 'Trade less', 'Use smaller positions'], 1, 'Profits get grabbed quickly; losses are left to run in the hope they recover.'),
    q('"I will sell when I get back to even." What is wrong with this?', ['Nothing', 'Your entry price has no effect on where the market goes next', 'It is illegal', 'It guarantees a loss'], 1, 'The market does not know what you paid. Ask whether you would open the position now at this price.'),
    q('Which habit most directly counters loss aversion?', ['Checking the trade every minute', 'Setting the stop-loss and target before entering, as real orders', 'Averaging down', 'Increasing size after wins'], 1, 'Deciding the exit while calm removes the in-the-moment decision.'),
    q('Why does paper trading understate these problems?', ['Paper prices are wrong', 'With pretend money, losses do not hurt, so rules are easy to follow', 'Paper trading has no stops', 'It does not'], 1, 'The emotions only appear with real money at stake.'),
  ],
  'trading-plan': [
    q('What is the main purpose of a trading plan?', ['To predict prices', 'To make decisions while calm so you do not improvise under stress', 'To avoid fees', 'To impress other traders'], 1, 'Rules written in advance replace decisions made in the heat of the moment.'),
    q('A trade followed every rule in your plan and lost money. It was:', ['A bad trade', 'A good trade', 'A reason to change the plan immediately', 'Revenge trading'], 1, 'Losses are part of any method. Following the plan is what you control.'),
    q('A trade broke your rules and made money. It was:', ['A good trade', 'A bad trade that reinforces a costly habit', 'Proof the rules are wrong', 'Irrelevant'], 1, 'Being rewarded for breaking rules teaches you to do it again, and next time it may cost far more.'),
    q('When should you change your trading rules?', ['In the middle of a losing trade', 'During a review, away from the screen, based on a meaningful number of trades', 'After every loss', 'Never'], 1, 'Changing rules mid-trade is abandoning the plan, not improving it.'),
    q('Which of these belongs in a trading plan?', ['A prediction of next month\'s prices', 'A rule for when to stop trading for the day', 'A list of other traders to copy', 'Tomorrow\'s news'], 1, 'Stop-trading rules, risk per trade, setups, entries and exits all belong in the plan.'),
  ],
});

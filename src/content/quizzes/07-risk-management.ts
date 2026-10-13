import { defineQuizzes, q } from './helpers';

export const riskManagementQuizzes = defineQuizzes('risk-management', {
  'position-sizing': [
    q('Under the 1% rule, "risk" means:', ['The size of the position', 'The amount you lose if your stop-loss is hit', 'The fee on the trade', 'Your total account'], 1, 'Risk is the loss at the stop, not the value of the position.'),
    q('Account $20,000, risking 1%. Entry $40, stop $38. How many shares?', ['50', '100', '200', '500'], 1, 'Risk is $200. Risk per share is $2. 200 / 2 = 100 shares.'),
    q('You widen your stop from $2 to $4 away but keep the same dollar risk. Your position must be:', ['Twice as large', 'The same', 'Half as large', 'Closed'], 2, 'Size = dollars at risk / stop distance. Doubling the distance halves the size.'),
    q('Which trade risks more?', ['A $5,000 position with a stop 1% away', 'A $1,000 position with no stop at all', 'They risk the same', 'Neither has risk'], 1, 'The first risks $50. The second can lose the full $1,000. Position size is not risk.'),
    q('Why does risking 1% per trade matter?', ['It guarantees profit', 'A long losing streak then costs a manageable share of the account', 'It lowers fees', 'It makes stops unnecessary'], 1, 'Ten losses in a row cost roughly 10%, which you can recover from.'),
  ],
  'stop-loss-placement': [
    q('Where should a stop-loss go?', ['Where the loss feels comfortable', 'Where the chart shows your reason for the trade is no longer true', 'Exactly 1% from entry, always', 'At the nearest round number'], 1, 'The stop marks the point where the idea has failed. Size the position to fit it.'),
    q('ATR is 4. Which stop is most likely to be hit by ordinary noise?', ['1 point away', '6 points away', '10 points away', '12 points away'], 0, 'A stop well inside one ATR sits within the normal movement of a single candle.'),
    q('Price is nearing your stop and you move the stop further away "to give it room". This:', ['Is good risk management', 'Turns a planned small loss into an unplanned larger one', 'Lowers your risk', 'Is how trailing stops work'], 1, 'You may move a stop to reduce risk, never to increase it.'),
    q('What does a trailing stop do?', ['Moves against you as price falls', 'Follows price in your favour to lock in profit, never moving back', 'Removes the need for a target', 'Widens automatically'], 1, 'It ratchets in one direction only, protecting gains as the trade works.'),
    q('You choose the stop first, then find the position is too big for your risk. You should:', ['Move the stop closer', 'Reduce the position size', 'Skip the stop', 'Add leverage'], 1, 'The stop comes from the chart. The size is what you adjust.'),
  ],
  'risk-reward': [
    q('Entry 50, stop 48, target 56. What is the reward-to-risk?', ['1:1', '1:2', '1:3', '1:4'], 2, 'Risk is 2, reward is 6. 6 / 2 = 3, so 1:3 (or 3R).'),
    q('At a risk/reward of 1:2, what win rate breaks even (ignoring fees)?', ['25%', '33.3%', '50%', '66.7%'], 1, '1 / (1 + 2) = 33.3%. Win one in three and you break even.'),
    q('You win 4 of 10 trades at 1:2, risking $100 each. Net result?', ['-$200', '$0', '+$200', '+$800'], 2, '4 x $200 = +$800, 6 x $100 = -$600. Net +$200.'),
    q('A setup shows 1:6 only because the target is far beyond any resistance. That ratio is:', ['Excellent', 'Misleading: the target is unlikely to be reached', 'Guaranteed', 'Required'], 1, 'A reward that rarely arrives is worth little. Targets need a reason on the chart.'),
  ],
  expectancy: [
    q('A strategy wins 80% of trades. Is it profitable?', ['Yes, always', 'Not necessarily: it depends on the size of the wins and losses', 'No, never', 'Only with leverage'], 1, 'If the 20% of losers are much bigger than the winners, it loses money.'),
    q('Win rate 50%, average win $200, average loss $100. Expectancy per trade?', ['-$50', '$0', '+$50', '+$100'], 2, '0.5 x 200 - 0.5 x 100 = 100 - 50 = +$50.'),
    q('Win rate 30%, average win 3R, average loss 1R. Expectancy in R?', ['-0.2R', '0R', '+0.2R', '+0.9R'], 2, '0.3 x 3 - 0.7 x 1 = 0.9 - 0.7 = +0.2R per trade.'),
    q('A strategy with positive expectancy loses six trades in a row. This means:', ['The strategy is broken', 'Nothing by itself: streaks like this are expected', 'You should double your size', 'The market is rigged'], 1, 'Expectancy is an average over many trades. Short runs tell you very little.'),
    q('Why keep a trading journal?', ['It is required by law', 'To calculate your real win rate, average win and loss, and expectancy', 'To impress other traders', 'To avoid fees'], 1, 'Without records you are judging your trading by feeling, which is unreliable.'),
  ],
  drawdown: [
    q('Your account peaks at $15,000 and falls to $12,000. The drawdown is:', ['12%', '15%', '20%', '25%'], 2, '3,000 / 15,000 = 20%. Drawdown is measured from the peak, not from where you started.'),
    q('After a 50% loss, what gain gets you back to even?', ['50%', '75%', '100%', '150%'], 2, 'Half of the money has to double to return to the start: 0.5 / (1 - 0.5) = 100%.'),
    q('Why do large drawdowns matter more than they first appear?', ['They attract fees', 'The gain needed to recover grows much faster than the loss', 'They change the win rate', 'They do not matter'], 1, 'Lose 20%, need 25%. Lose 50%, need 100%. Lose 90%, need 900%.'),
    q('What is the main defence against deep drawdowns?', ['A higher win rate', 'Risking a small, fixed share of the account per trade', 'More leverage', 'Trading more often'], 1, 'Every strategy has losing streaks. Position sizing decides how much they cost.'),
    q('You are down 15% and tempted to double your size to win it back. This is:', ['Sound recovery practice', 'How a 15% drawdown becomes 50%', 'Required by the 1% rule', 'Mean reversion'], 1, 'Increasing size after losses raises the stakes exactly when you are trading worst.'),
  ],
});

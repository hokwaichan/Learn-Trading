import { defineQuizzes, q } from './helpers';

export const tradeManagementQuizzes = defineQuizzes('trade-management', {
  'scaling-in-and-out': [
    q('What does scaling out of a trade do to your results?', ['Raises the best outcome and worsens the worst', 'Lowers the best outcome and improves the worst', 'Has no effect', 'Removes all risk'], 1, 'Taking part of the position off early banks something if price reverses, and gives up some profit if it keeps going.'),
    q('Entry 50, stop 48, 100 units. You sell half at 52 and the rest is stopped at break-even. What is the result?', ['+$100', '+$200', '-$100', '$0'], 0, 'Half the position (50 units) made 2 each: $100. The other half closed at the entry for nothing.'),
    q('What is the hidden cost of moving a stop to break-even early?', ['Higher fees', 'Price often returns to the entry before continuing, so good trades are closed for nothing', 'The stop stops working', 'There is none'], 1, 'Entry prices are frequently retested. A break-even stop placed too soon exits trades that would have won.'),
    q('Which is the safe form of scaling in?', ['Adding to a losing position to lower the average price', 'Adding to a winning position while raising the stop so total risk does not grow', 'Doubling size after every loss', 'Adding without a stop'], 1, 'Pyramiding into a winner with a raised stop keeps total risk within the plan. Averaging down increases it.'),
    q('You plan two entries in the same trade. How should they be sized?', ['Each at 1% risk', 'So that the combined loss at the final stop stays within your 1% limit', 'The second at double the first', 'Size does not matter for the second'], 1, 'The limit applies to the whole position. Two full-size entries would double the risk.'),
  ],
  'trailing-stops': [
    q('What does a trailing stop replace?', ['The entry', 'The fixed profit target', 'The fee', 'The position size'], 1, 'A trailing stop has no target. It exits only when price turns back by a set amount.'),
    q('In which direction may a trailing stop move?', ['Either way', 'Only in favour of the trade', 'Only away from price', 'It never moves'], 1, 'It ratchets. Moving it away from price to give the trade room defeats its purpose.'),
    q('Highest close since entry 80, ATR 1.5, multiple 2. Where is the ATR trailing stop on a long?', ['77', '78.5', '83', '80'], 0, 'Two ATRs is 3, taken from the highest close: 80 - 3 = 77.'),
    q('What is the cost of a tight trailing stop?', ['It gives back too much profit at the end', 'Normal pullbacks knock you out of good trends early', 'Higher fees per trade', 'It cannot be placed'], 1, 'A tight trail keeps more of each small move but exits on ordinary noise before the big move arrives.'),
    q('Why does a trailing stop never sell the exact top?', ['It is badly designed', 'It only triggers after price has already turned down from the high', 'Exchanges prevent it', 'It sells too early'], 1, 'By construction it exits after a pullback of a set size. Giving back some profit is the price of staying in long moves.'),
  ],
  'correlation-and-exposure': [
    q('You are long Bitcoin, Ethereum and Solana, each risking 1%. What is your real exposure to a crypto sell-off?', ['About 1%', 'Close to 3%', 'Zero, they offset', 'Impossible to say'], 1, 'The three move together, so they behave like one position. All three stops can be hit by the same event.'),
    q('Which pair is most likely to be strongly correlated?', ['EUR/USD and GBP/USD', 'Apple shares and the price of wheat', 'Bitcoin and a 3-month Treasury bill', 'Gold and one small company share'], 0, 'Both pairs have the US dollar on one side, so dollar strength or weakness moves them together.'),
    q('How should correlated positions be sized?', ['Each at full risk', 'So that their combined risk stays within a limit for the group', 'Larger than usual', 'Without stops'], 1, 'Treat the group as one trade and divide the risk between its members.'),
    q('What tends to happen to correlations in a market panic?', ['They fall to zero', 'They rise: most things fall together', 'They reverse', 'They stay the same'], 1, 'Diversification works least when it is needed most. Plan total risk for the bad day.'),
  ],
  'risk-of-ruin': [
    q('A system wins 50% of the time. Over 100 trades, a run of seven losses in a row is:', ['Proof the system is broken', 'A normal outcome to plan for', 'Impossible', 'A sign to double your size'], 1, 'Wins and losses clump. Long streaks are expected even from a sound system.'),
    q('After ten losses in a row risking 5% each, the account is down about 40%. What gain is needed to recover?', ['40%', '50%', '67%', '100%'], 2, 'From 60 you need 40 more to get back to 100: 40 / 60 = 67%.'),
    q('The same system and the same losing streak ruin one trader and barely affect another. What differs?', ['Their broker', 'The amount risked per trade', 'Their chart colours', 'The time of day'], 1, 'Position size is the only thing that decides whether a normal streak is survivable.'),
    q('Win rate 40%, reward-to-risk 3 to 1. What is the Kelly fraction?', ['10%', '20%', '40%', '60%'], 1, '0.4 - 0.6 / 3 = 0.4 - 0.2 = 0.2, or 20%.'),
    q('Why should a retail trader not bet the full Kelly fraction?', ['It is illegal', 'The win rate and reward are only estimates, and overestimating them leads to ruin', 'It is always too small', 'It only applies to casinos'], 1, 'Kelly assumes a perfectly known edge. Real edges are uncertain and usually overestimated, so a small fraction is the most anyone should use.'),
    q('When should you increase the dollar amount you risk per trade?', ['After a run of wins, to press the advantage', 'Only as the account itself grows, by keeping the percentage fixed', 'After a run of losses, to recover faster', 'Whenever you feel confident'], 1, 'A fixed percentage scales the bet with the account automatically, in both directions.'),
  ],
});

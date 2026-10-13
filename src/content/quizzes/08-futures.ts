import { defineQuizzes, q } from './helpers';

export const futuresQuizzes = defineQuizzes('futures', {
  'futures-contracts': [
    q('What is a futures contract?', ['A share in a company', 'An agreement to buy or sell something at a set price on a set future date', 'A loan from a broker', 'A type of stop order'], 1, 'Both sides fix the price today for a trade that settles later.'),
    q('A contract has a multiplier of 50 and a tick size of 0.25. What is one tick worth?', ['$0.25', '$5.00', '$12.50', '$50.00'], 2, 'Tick value = tick size x multiplier = 0.25 x 50 = $12.50.'),
    q('You buy 2 contracts (multiplier 50) at 4,000 and sell at 4,006. Your profit is:', ['$300', '$600', '$1,200', '$6'], 1, '6 points x 50 x 2 contracts = $600.'),
    q('How is a perpetual future different from a dated one?', ['It cannot be shorted', 'It has no expiry date', 'It has no leverage', 'It is always cash'], 1, 'A perp can be held indefinitely. Funding keeps its price near spot instead of an expiry.'),
    q('What does "rolling" a futures contract mean?', ['Doubling the position', 'Closing the expiring contract and opening the next one', 'Moving the stop-loss', 'Being liquidated'], 1, 'Dated futures expire, so staying in the trade means moving to the next contract month.'),
  ],
  'margin-and-liquidation': [
    q('What is initial margin?', ['The fee to open a trade', 'The deposit needed to open a position', 'The profit target', 'The maximum position size'], 1, 'At 10x leverage the initial margin is 10% of the position value.'),
    q('When does liquidation happen?', ['When you reach your profit target', 'When your remaining margin falls to the maintenance margin', 'At the end of each day', 'When funding is paid'], 1, 'Losses come out of your margin. When it reaches the minimum, the exchange closes the position.'),
    q('You are long at 100 with 10x leverage and 0.5% maintenance margin. Roughly where is liquidation?', ['99.50', '95.00', '90.50', '50.00'], 2, '100 x (1 - 1/10 + 0.005) = 90.50.'),
    q('Why do exchanges use the mark price for liquidations rather than the last trade?', ['To charge more fees', 'So one odd trade or brief spike does not liquidate positions unfairly', 'Because the last price is secret', 'It is the same thing'], 1, 'The mark price is a smoothed fair value based on spot prices across exchanges.'),
    q('What is the main danger of cross margin?', ['Higher fees', 'A single losing position can draw on, and empty, your whole account', 'You cannot go short', 'Positions close too early'], 1, 'Isolated margin caps the loss at what you assigned to the trade. Cross margin does not.'),
  ],
  'funding-and-basis': [
    q('Futures are trading above the spot price. This is called:', ['Backwardation', 'Contango', 'Liquidation', 'Convergence'], 1, 'Contango: futures above spot. Backwardation: futures below spot.'),
    q('What happens to the basis as a dated future approaches expiry?', ['It grows', 'It shrinks to zero', 'It stays constant', 'It becomes random'], 1, 'The contract settles at spot, so the futures and spot prices converge.'),
    q('The funding rate on a perpetual is positive. Who pays whom?', ['Shorts pay longs', 'Longs pay shorts', 'Both pay the exchange', 'Nobody pays'], 1, 'Positive funding means the perp is above spot. Longs pay shorts, which discourages longs.'),
    q('You hold a $20,000 long and funding is 0.01% per 8 hours. Each payment is:', ['$0.20', '$2', '$20', '$200'], 1, '20,000 x 0.0001 = $2, paid three times a day.'),
    q('Why does high leverage make funding hurt more?', ['The rate is higher at high leverage', 'Funding is charged on the position value, which is large relative to your margin', 'Funding is charged twice', 'It does not'], 1, 'At 10x, funding on the full position is ten times as large relative to your own money.'),
  ],
  'hedging-and-speculation': [
    q('What is the purpose of a hedge?', ['To maximise profit', 'To offset a risk you already have', 'To avoid fees', 'To increase leverage'], 1, 'A hedge reduces uncertainty. It gives up some upside to remove downside.'),
    q('You own 2 ETH and short 2 ETH of perpetual futures. Price falls 10%. Ignoring fees and funding, your net result is:', ['A 10% loss', 'A 10% gain', 'About zero', 'A 20% loss'], 2, 'The loss on the holding is offset by the gain on the short.'),
    q('With $1,000 of margin at 5x, price rises 4%. Your return on margin is:', ['4%', '9%', '20%', '80%'], 2, 'A $5,000 position gains $200, which is 20% of your $1,000.'),
    q('At 20x leverage price dips 5% and then rallies 30%. What happens to your long?', ['You make 600%', 'You were liquidated on the dip and miss the rally', 'You break even', 'Nothing'], 1, 'High leverage means you can be right about direction and still lose, because you did not survive the path.'),
    q('What is the sensible way to decide how much leverage to use?', ['Use the maximum offered', 'Pick the stop and dollar risk first; use only the leverage that position size needs', 'Always use 10x', 'Leverage does not need deciding'], 1, 'Leverage is for sizing a correctly risked position, not for making it bigger than your rules allow.'),
  ],
});

import { defineQuizzes, q } from './helpers';

export const basicsQuizzes = defineQuizzes('basics', {
  'what-markets-are': [
    q('What is the price shown on a chart?', ['A value set by the exchange each morning', 'The most recent price a buyer and a seller agreed on', 'The average of what all traders think it is worth', 'The price the company says its shares are worth'], 1, 'A price is just the last trade: what one person paid and another accepted. It changes when the next pair agree on something different.'),
    q('More people are eager to buy than to sell at the current price. What usually happens?', ['The price rises', 'The price falls', 'The price stays the same', 'Trading stops'], 0, 'Eager buyers have to offer more to find a seller, so the price rises. This is supply and demand.'),
    q('What is a ticker (or symbol)?', ['The fee charged per trade', 'A short code that identifies an instrument, like AAPL', 'The smallest amount a price can move', 'A type of order'], 1, 'Each instrument has a short code. AAPL is Apple; BTC is Bitcoin.'),
    q('What is paper trading?', ['Trading with borrowed money', 'Trading shares of paper companies', 'Practising with pretend money at real prices', 'Writing your trades down in a journal'], 2, 'Paper trading uses simulated money, so you can practise and make mistakes without losing anything.'),
  ],
  'order-types': [
    q('You want to buy right now and do not mind exactly what price you get. Which order?', ['Limit order', 'Market order', 'Stop order', 'Take-profit order'], 1, 'A market order trades immediately at the best available price. You give up control of the price.'),
    q('Price is 105. You place a buy limit order at 101. What happens?', ['It fills immediately at 105', 'It fills immediately at 101', 'It waits, and fills only if price falls to 101 or lower', 'It is rejected because 101 is below the market'], 2, 'A buy limit only trades at your price or lower, so it waits. It may never fill if price does not come down.'),
    q('What is a stop-loss for?', ['To guarantee a profit', 'To close your trade automatically if price moves against you past a level you chose', 'To stop you from trading too often', 'To buy more if price falls'], 1, 'A stop-loss limits the damage when you are wrong. Decide where it goes before entering the trade.'),
    q('Price gaps straight past your stop-loss on overnight news. What happens?', ['You are filled exactly at your stop price', 'The order is cancelled', 'You are filled at the next available price, which may be worse than your stop', 'The exchange refunds the difference'], 2, 'A triggered stop becomes a market order. If price jumped past your level, the fill is at the next price available.'),
  ],
  'bid-ask-spread': [
    q('The bid is 49.95 and the ask is 50.05. What is the spread?', ['0.05', '0.10', '49.95', '50.00'], 1, 'The spread is the ask minus the bid: 50.05 - 49.95 = 0.10.'),
    q('You send a market order to BUY. Which price do you get?', ['The bid', 'The ask', 'The midpoint', 'Yesterday\'s close'], 1, 'Buyers who want to trade now pay the ask, the lowest price a seller is asking. Sellers who want to trade now receive the bid.'),
    q('Which market is likely to have the widest spread?', ['A major currency pair', 'A very large company\'s stock', 'A small, rarely traded coin', 'Bitcoin'], 2, 'Thinly traded instruments have few waiting orders, so the gap between the best buyer and best seller is wider.'),
    q('You buy at the ask and immediately sell at the bid, and the market has not moved. You have:', ['Broken even', 'Made the spread', 'Lost the spread (plus fees)', 'Made a small profit'], 2, 'You paid the higher price and received the lower one. The spread is a cost on every round trip.'),
  ],
  'long-and-short': [
    q('You go long at $50 and sell at $46. Your result per unit is:', ['+$4', '-$4', '+$46', '-$50'], 1, 'Long profit is exit minus entry: 46 - 50 = -4.'),
    q('You go short at $80 and buy back at $70. Your result per unit is:', ['-$10', '+$10', '+$70', '-$80'], 1, 'Short profit is entry minus exit: 80 - 70 = +10. Shorts make money when price falls.'),
    q('Why can a short lose more than a long?', ['Shorts pay higher fees', 'A price can only fall to zero but can rise without limit', 'Shorts are always leveraged', 'Brokers charge a penalty'], 1, 'A long loses at most 100%. A short loses more and more the higher the price goes, with no ceiling.'),
    q('Someone says they are "bearish" on a stock. They expect its price to:', ['Rise', 'Fall', 'Stay flat', 'Become more volatile'], 1, 'Bearish means expecting a fall; bullish means expecting a rise.'),
  ],
  leverage: [
    q('With 10x leverage, $500 of margin controls a position worth:', ['$50', '$500', '$5,000', '$50,000'], 2, 'Position value = margin x leverage = 500 x 10 = $5,000.'),
    q('You are long with 5x leverage and price rises 4%. Your return on margin is roughly:', ['+4%', '+9%', '+20%', '+45%'], 2, 'Leverage multiplies the move: 4% x 5 = 20%. It would be -20% if price had fallen 4%.'),
    q('At 20x leverage, roughly what adverse move wipes out your margin?', ['20%', '10%', '5%', '2%'], 2, 'The wipe-out move is about 1 divided by the leverage: 1 / 20 = 5%. Fees make it slightly less.'),
    q('What is liquidation?', ['Selling a position at a profit', 'The exchange closing your position because losses have used up your margin', 'Converting your account to cash', 'A fee for using leverage'], 1, 'When your margin is nearly gone the exchange closes the position so its loan is safe. You usually lose that margin.'),
    q('What does leverage change about a trade?', ['How likely it is to be right', 'The size of the gain or loss, in both directions', 'Only the size of the gains', 'The fees, and nothing else'], 1, 'Leverage does not make an idea better. It makes the result bigger whichever way it goes.'),
  ],
});

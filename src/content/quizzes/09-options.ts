import { defineQuizzes, q } from './helpers';

export const optionsQuizzes = defineQuizzes('options', {
  'calls-and-puts': [
    q('A call option gives its buyer the right to:', ['Sell the underlying at the strike', 'Buy the underlying at the strike', 'Borrow the underlying', 'Receive dividends'], 1, 'A call is the right to buy. A put is the right to sell.'),
    q('What is the most a buyer of an option can lose?', ['Nothing', 'The premium paid', 'The strike price', 'An unlimited amount'], 1, 'The buyer has a right, not an obligation. If it is not worth using, they lose only what they paid.'),
    q('You buy a 50-strike call for a premium of 2. What is the break-even at expiry?', ['48', '50', '52', '54'], 2, 'Break-even for a long call is strike plus premium: 50 + 2 = 52.'),
    q('You buy a 100-strike put for 3. At expiry the stock is at 90. Your profit per share is:', ['3', '7', '10', '13'], 1, 'The put is worth 100 - 90 = 10. Less the 3 premium: 7.'),
    q('A stock rises 2% over the month, but your call still loses money. The most likely reason:', ['The stock did not rise enough to cover the premium', 'Calls lose when stocks rise', 'The exchange made an error', 'The strike changed'], 0, 'The price must move past the break-even, before expiry, for the buyer to profit.'),
  ],
  'option-value': [
    q('A stock is at 108. What is the intrinsic value of a 100-strike call?', ['0', '8', '100', '108'], 1, 'Call intrinsic value = underlying - strike = 108 - 100 = 8.'),
    q('That call trades at 11. What is its time value?', ['0', '3', '8', '11'], 1, 'Premium = intrinsic + time value, so time value = 11 - 8 = 3.'),
    q('A stock is at 100. A put with a strike of 90 is:', ['In the money', 'At the money', 'Out of the money', 'Expired'], 2, 'A put is out of the money when the strike is below the price: selling at 90 is worse than selling at 100.'),
    q('What happens to time value at expiry?', ['It doubles', 'It becomes zero', 'It equals the strike', 'It is paid to the buyer'], 1, 'With no time left there is no chance of further gain, so only intrinsic value remains.'),
    q('What does "assignment" mean?', ['The buyer chooses a strike', 'A seller is required to fulfil the contract because a buyer exercised', 'The option is listed on an exchange', 'The premium is refunded'], 1, 'When a buyer exercises, a seller of that option must take the other side.'),
    q('A European-style option can be exercised:', ['Only in Europe', 'At any time before expiry', 'Only at expiry', 'Never'], 2, 'European-style means exercise at expiry only. American-style means any day up to expiry.'),
  ],
  'buying-vs-selling': [
    q('What is the maximum profit for the seller of an option?', ['Unlimited', 'The premium received', 'The strike price', 'Zero'], 1, 'The seller is paid the premium up front and can never make more than that.'),
    q('Why is an uncovered (naked) call so dangerous?', ['The premium is too small', 'There is no limit to how high the price can go, so no limit to the loss', 'It cannot be closed', 'It always expires in the money'], 1, 'The seller must deliver at the strike something that could cost any amount to buy.'),
    q('A sold call is "covered" when the seller:', ['Has a stop-loss', 'Already owns the underlying', 'Has bought insurance', 'Uses cross margin'], 1, 'If assigned they hand over shares they already own, so the risk is limited.'),
    q('Option sellers win most of the time. Why can they still lose money overall?', ['Fees are high', 'The occasional loss can be many times larger than the premiums collected', 'They are taxed more', 'They cannot'], 1, 'Many small wins and a rare very large loss is the typical profile of selling options.'),
    q('How does the passing of time affect buyer and seller?', ['It helps both', 'It hurts the buyer and helps the seller', 'It helps the buyer and hurts the seller', 'It affects neither'], 1, 'Time value decays every day. The buyer paid for it; the seller keeps it.'),
  ],
  'delta-and-gamma': [
    q('A call has a delta of 0.40. The stock rises $2. The call gains about:', ['$0.20', '$0.40', '$0.80', '$2.00'], 2, 'Delta x move = 0.40 x 2 = $0.80.'),
    q('Which option has a delta closest to 1?', ['Far out of the money call', 'At the money call', 'Deep in the money call', 'Any put'], 2, 'A deep ITM call moves almost one-for-one with the underlying.'),
    q('A put\'s delta is:', ['Between 0 and +1', 'Between -1 and 0', 'Always exactly -1', 'Always 0'], 1, 'Puts gain when the underlying falls, so their delta is negative.'),
    q('What does gamma measure?', ['How fast the option loses value over time', 'How much delta changes when the underlying moves $1', 'Sensitivity to interest rates', 'The premium'], 1, 'Gamma is the rate of change of delta.'),
    q('Where is gamma highest?', ['Deep in the money, far from expiry', 'At the money, close to expiry', 'Far out of the money', 'It is constant'], 1, 'Near expiry an at-the-money option flips quickly between worthless and valuable, so delta changes fast.'),
  ],
  'theta-vega-rho': [
    q('An option has a theta of -0.08. With everything else unchanged, tomorrow it will be worth about:', ['8 cents more', '8 cents less', 'The same', '8% less'], 1, 'Theta is the value lost per day from time passing alone.'),
    q('How does time decay behave as expiry approaches?', ['It slows down', 'It stays constant', 'It accelerates', 'It reverses'], 2, 'Time value drains slowly at first and fastest in the final weeks.'),
    q('Implied volatility rises 5 points. An option with a vega of 0.10 changes by about:', ['-$0.50', '+$0.05', '+$0.50', '+$5.00'], 2, 'Vega x change = 0.10 x 5 = +$0.50. Higher volatility raises both calls and puts.'),
    q('Who benefits when implied volatility falls?', ['Option buyers', 'Option sellers', 'Both', 'Neither'], 1, 'Sellers are short vega: the options they sold become cheaper to buy back.'),
    q('Which Greek matters least for short-dated options?', ['Delta', 'Theta', 'Vega', 'Rho'], 3, 'Interest-rate changes have little effect on options lasting weeks or a few months.'),
  ],
  'implied-volatility': [
    q('What is implied volatility?', ['How much the underlying moved last year', 'The volatility implied by current option prices: the market\'s expected movement', 'The daily change in the option price', 'A fee'], 1, 'IV is worked out backwards from option prices and reflects expectations.'),
    q('High implied volatility means options are:', ['Cheap', 'Expensive', 'Unavailable', 'About to expire'], 1, 'The market expects large moves, so both calls and puts cost more.'),
    q('What is IV crush?', ['A stock price crash', 'A sharp fall in implied volatility once an awaited event has passed', 'A broker margin call', 'Options being delisted'], 1, 'The uncertainty that inflated option prices is gone, so IV drops.'),
    q('You buy a call before earnings. The stock rises 2% but your call loses value. Why?', ['Calls lose when stocks rise', 'The fall in implied volatility outweighed the gain from the price move', 'Earnings cancel options', 'The strike moved'], 1, 'Option prices already included the expected jump. The move was smaller than priced in.'),
    q('What does the volatility smile describe?', ['IV being the same at every strike', 'IV being higher for strikes far from the current price', 'Options expiring happily', 'A chart pattern'], 1, 'Far OTM options, especially downside puts, carry higher IV because big moves are more common than simple models assume.'),
  ],
  'basic-strategies': [
    q('Which strategy has unlimited profit and a loss limited to the premium?', ['Covered call', 'Long call', 'Cash-secured put', 'Short call'], 1, 'A bought call gains as far as the price rises and can lose only what was paid.'),
    q('You own stock at 100 and sell a 110 call for 3. Your maximum profit per share is:', ['3', '10', '13', 'Unlimited'], 2, 'You gain 10 on the stock up to the strike plus the 3 premium. Above 110 the shares are called away.'),
    q('A cash-secured put is suitable when you:', ['Expect a crash', 'Would be happy to buy the stock at a lower price', 'Want unlimited upside', 'Own the stock already and want to sell'], 1, 'Either you keep the premium, or you buy the stock at the strike, effectively at a discount.'),
    q('A protective put works like:', ['A loan', 'Insurance on stock you own', 'A short sale', 'A dividend'], 1, 'You pay a premium for the right to sell at the strike whatever happens.'),
    q('You own stock at 100 and buy a 95 put for 3. Your maximum loss per share is:', ['3', '5', '8', '100'], 2, 'You can always sell at 95: a 5 loss on the stock plus the 3 premium.'),
  ],
  'spreads-and-volatility': [
    q('You buy a 100 call for 5 and sell a 110 call for 2. Your maximum loss is:', ['2', '3', '5', '10'], 1, 'The net debit: 5 - 2 = 3.'),
    q('In the same spread, the maximum profit is:', ['3', '7', '10', 'Unlimited'], 1, 'Difference between strikes minus the debit: 10 - 3 = 7.'),
    q('What does a spread give up compared with a single bought option?', ['The limited loss', 'Profit beyond the sold strike', 'The right to exercise', 'Nothing'], 1, 'The sold option pays for part of the trade and caps the gain.'),
    q('When does a long straddle make money?', ['When the price stays still', 'When the price moves far in either direction', 'Only when the price rises', 'Only when volatility falls'], 1, 'It holds both a call and a put, so it needs a move bigger than the combined premium.'),
    q('You buy a 100 call for 4 and a 100 put for 4. What are the break-evens?', ['96 and 104', '92 and 108', '100 only', '88 and 112'], 1, 'Strike plus and minus the total premium of 8.'),
    q('How does a strangle differ from a straddle?', ['It uses out-of-the-money options at two strikes: cheaper, but needs a bigger move', 'It has unlimited loss', 'It only uses puts', 'It profits from no movement'], 0, 'A strangle costs less and needs the price to travel further.'),
  ],
  'advanced-strategies': [
    q('An iron condor makes its maximum profit when the price at expiry is:', ['Above the highest strike', 'Below the lowest strike', 'Between the two sold strikes', 'Exactly at zero'], 2, 'All four options expire worthless and you keep the net credit.'),
    q('An iron condor has spreads 5 wide and collects a credit of 2. The maximum loss is:', ['2', '3', '5', '7'], 1, 'Spread width minus credit: 5 - 2 = 3.'),
    q('A long butterfly pays the most when the price ends:', ['Far above the upper strike', 'Exactly at the middle strike', 'Far below the lower strike', 'Anywhere'], 1, 'The payoff is a tent with its peak at the middle strike.'),
    q('How does a calendar spread make money?', ['The near-term option decays faster than the longer-term one', 'From a large move in either direction', 'From interest payments', 'From dividends'], 0, 'Time decay accelerates near expiry, so the sold near option loses value faster than the bought far one.'),
    q('Which of these gains if implied volatility rises?', ['Iron condor', 'Calendar spread', 'Short straddle', 'Covered call'], 1, 'The long-dated option in a calendar has more vega than the short-dated one sold against it.'),
  ],
});

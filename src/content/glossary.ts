import type { GlossaryEntry } from '@/types';

/**
 * Glossary entries.
 *
 * To add a term, add a line to the list below. It then appears on the
 * Glossary page and in the command palette, and is linked automatically the
 * first time it (or one of its aliases) appears in each lesson.
 *
 *   e(id, term, one-sentence definition, 'module/lesson', aliases, see-also ids, options)
 *
 * For everyday words that would be linked by mistake (such as "long" in
 * "a long wick"), pass { autoLink: false }: then only the aliases are linked.
 */
function e(
  id: string,
  term: string,
  definition: string,
  lesson: string | null,
  aliases: string[] = [],
  seeAlso: string[] = [],
  options: { autoLink?: boolean; details?: string } = {},
): GlossaryEntry {
  const [moduleId, lessonId] = lesson ? lesson.split('/') : [];
  return {
    id,
    term,
    aliases,
    definition,
    seeAlso,
    lesson: lesson ? { moduleId, lessonId } : undefined,
    ...options,
  };
}

export const GLOSSARY: GlossaryEntry[] = [
  // ── Basics ──────────────────────────────────────────────────────────
  e('market', 'Market', 'Any place where buyers and sellers meet to trade something at an agreed price.', 'basics/what-markets-are', ['markets'], [], { autoLink: false }),
  e('instrument', 'Instrument', 'The thing being traded: a stock, a currency pair, a cryptocurrency, a futures or option contract.', 'basics/what-markets-are', ['instruments']),
  e('ticker', 'Ticker', 'The short code that identifies an instrument, such as AAPL for Apple.', 'basics/what-markets-are', ['symbol', 'tickers']),
  e('stock', 'Stock', 'A small piece of ownership in a company; also called a share.', 'basics/what-markets-are', ['stocks', 'shares'], ['earnings']),
  e('forex', 'Forex', 'Foreign exchange: trading one currency for another, such as euros for US dollars.', 'basics/what-markets-are', ['currency pair', 'currency pairs']),
  e('derivative', 'Derivative', 'A contract whose value depends on the price of something else, such as a future or an option.', 'futures/futures-contracts', ['derivatives'], ['futures-contract', 'option', 'underlying']),
  e('supply-and-demand', 'Supply and demand', 'The balance between how much people want to sell and how much they want to buy, which is what moves price.', 'basics/what-markets-are'),
  e('paper-trading', 'Paper trading', 'Practising trades with pretend money at real prices, so mistakes cost nothing.', 'basics/what-markets-are', ['paper trade', 'paper trades', 'paper account']),
  e('order', 'Order', 'An instruction to buy or sell a certain amount of an instrument.', 'basics/order-types', [], ['market-order', 'limit-order', 'stop-order'], { autoLink: false }),
  e('market-order', 'Market order', 'An order to buy or sell immediately at the best price available.', 'basics/order-types', ['market orders'], ['slippage', 'limit-order']),
  e('limit-order', 'Limit order', 'An order to buy at a chosen price or lower, or to sell at a chosen price or higher; it waits until the market gets there.', 'basics/order-types', ['limit orders'], ['market-order']),
  e('stop-order', 'Stop order', 'An order that stays inactive until price reaches a trigger level, then becomes a market order.', 'basics/order-types', ['stop orders'], ['stop-loss']),
  e('stop-loss', 'Stop-loss', 'An order that closes your position automatically if price moves against you to a level you chose.', 'risk-management/stop-loss-placement', ['stop loss', 'stop-losses', 'stop losses'], ['take-profit', 'trailing-stop', 'position-sizing']),
  e('take-profit', 'Take-profit', 'An order that closes your position automatically once price reaches your profit target.', 'basics/order-types', ['take profit'], ['stop-loss', 'risk-reward']),
  e('fill', 'Fill', 'The execution of an order: when it actually trades.', 'basics/order-types', ['filled', 'fills'], [], { autoLink: false }),
  e('slippage', 'Slippage', 'The difference between the price you expected and the price your order actually filled at.', 'basics/bid-ask-spread', [], ['spread', 'liquidity']),
  e('bid', 'Bid', 'The highest price any buyer is currently offering.', 'basics/bid-ask-spread', [], ['ask', 'spread']),
  e('ask', 'Ask', 'The lowest price any seller is currently asking; also called the offer.', 'basics/bid-ask-spread', [], ['bid', 'spread'], { autoLink: false }),
  e('spread', 'Spread', 'The gap between the bid and the ask; a cost you pay on every trade.', 'basics/bid-ask-spread', ['bid/ask spread', 'bid-ask spread', 'the spread'], ['bid', 'ask', 'liquidity'], { autoLink: false }),
  e('order-book', 'Order book', 'The list of all waiting buy and sell orders for an instrument, arranged by price.', 'basics/bid-ask-spread', [], ['bid', 'ask']),
  e('liquidity', 'Liquidity', 'How easily you can trade without moving the price; liquid markets have tight spreads and many waiting orders.', 'basics/bid-ask-spread', ['liquid', 'illiquid'], ['spread', 'slippage']),
  e('long', 'Long', 'Buying something because you expect its price to rise; you profit if it goes up.', 'basics/long-and-short', ['going long', 'long position', 'go long'], ['short'], { autoLink: false }),
  e('short', 'Short', 'Selling something you have borrowed because you expect its price to fall; you profit if it goes down.', 'basics/long-and-short', ['going short', 'short position', 'shorting', 'go short'], ['long'], { autoLink: false }),
  e('position', 'Position', 'A trade that is currently open, long or short.', 'basics/long-and-short', ['positions']),
  e('bullish', 'Bullish', 'Expecting prices to rise.', 'basics/long-and-short', [], ['bearish']),
  e('bearish', 'Bearish', 'Expecting prices to fall.', 'basics/long-and-short', [], ['bullish']),
  e('leverage', 'Leverage', 'Controlling a position larger than your own money by borrowing the rest; it multiplies both gains and losses.', 'basics/leverage', ['leveraged'], ['margin', 'liquidation']),
  e('margin', 'Margin', 'The money you put up as a deposit to open and hold a leveraged position.', 'futures/margin-and-liquidation', [], ['leverage', 'initial-margin', 'maintenance-margin', 'liquidation']),
  e('liquidation', 'Liquidation', 'When losses use up your margin and the exchange closes your position for you, usually at a total loss of that margin.', 'futures/margin-and-liquidation', ['liquidated', 'liquidates', 'liquidation price'], ['margin', 'leverage', 'mark-price']),
  e('pnl', 'P&L', 'Profit and loss. Unrealised P&L is on a position that is still open; realised P&L is locked in once you close it.', 'basics/long-and-short', ['profit and loss', 'PnL', 'unrealised P&L', 'realised P&L']),
  e('fee', 'Fee', 'What the broker or exchange charges per trade, usually a small percentage of the trade value.', 'basics/bid-ask-spread', ['fees'], ['spread']),

  // ── Candlesticks ────────────────────────────────────────────────────
  e('candle', 'Candlestick', 'One bar on a price chart showing four prices for a period of time: the open, the high, the low and the close.', 'candlesticks/candle-anatomy', ['candle', 'candles', 'candlesticks'], ['ohlc', 'body', 'wick', 'timeframe']),
  e('ohlc', 'OHLC', 'Short for open, high, low, close: the four prices that describe one candlestick.', 'candlesticks/candle-anatomy', [], ['candle']),
  e('body', 'Body', 'The thick part of a candlestick, spanning the open and the close.', 'candlesticks/candle-anatomy', ['candle body'], ['wick', 'candle'], { autoLink: false }),
  e('wick', 'Wick', 'The thin line above or below a candle body, reaching to the high or the low; also called a shadow.', 'candlesticks/candle-anatomy', ['wicks', 'shadow'], ['body', 'candle']),
  e('timeframe', 'Timeframe', 'How much time one candlestick covers, such as 1 minute, 1 hour or 1 day.', 'candlesticks/timeframes', ['timeframes'], ['candle']),
  e('doji', 'Doji', 'A candle that opens and closes at almost the same price, showing indecision.', 'candlesticks/single-candle-patterns', [], ['spinning-top']),
  e('hammer', 'Hammer', 'A candle with a small body at the top and a long lower wick, appearing after a decline; buyers pushed price back up.', 'candlesticks/single-candle-patterns', [], ['shooting-star']),
  e('shooting-star', 'Shooting star', 'A candle with a small body at the bottom and a long upper wick, appearing after a rise; sellers pushed price back down.', 'candlesticks/single-candle-patterns', [], ['hammer']),
  e('marubozu', 'Marubozu', 'A candle that is almost all body with little or no wick, showing one side in control throughout.', 'candlesticks/single-candle-patterns'),
  e('spinning-top', 'Spinning top', 'A candle with a small body and wicks on both sides, showing indecision.', 'candlesticks/single-candle-patterns', [], ['doji']),
  e('engulfing', 'Engulfing pattern', 'Two candles where the second body completely covers the first and points the other way.', 'candlesticks/multi-candle-patterns', ['bullish engulfing', 'bearish engulfing', 'engulfing'], ['harami']),
  e('harami', 'Harami', 'Two candles where a small second body sits entirely inside a large first one, showing a move has stalled.', 'candlesticks/multi-candle-patterns', [], ['engulfing']),
  e('morning-star', 'Morning star / evening star', 'A three-candle reversal: a long candle, a small indecisive one, then a long candle the other way. Morning star is bullish, evening star bearish.', 'candlesticks/multi-candle-patterns', ['morning star', 'evening star'], ['engulfing']),
  e('three-soldiers', 'Three white soldiers', 'Three long up candles in a row, each closing higher; the bearish version is three black crows.', 'candlesticks/multi-candle-patterns', ['three black crows']),

  // ── Market structure ────────────────────────────────────────────────
  e('trend', 'Trend', 'The general direction of price: up, down or sideways.', 'market-structure/trends', ['trends', 'uptrend', 'downtrend'], ['swing', 'range']),
  e('swing', 'Swing high / swing low', 'A turning point: a peak with lower prices either side, or a trough with higher prices either side.', 'market-structure/trends', ['swing high', 'swing low', 'swing highs', 'swing lows'], ['trend', 'market-structure']),
  e('market-structure', 'Market structure', 'The pattern of swing highs and swing lows that shows whether a market is trending or ranging.', 'market-structure/trends', [], ['swing', 'trend']),
  e('higher-high', 'Higher high / higher low', 'How a swing compares with the previous one of the same kind: higher highs and higher lows define an uptrend, lower highs and lower lows a downtrend.', 'market-structure/trends', ['higher high', 'higher low', 'higher highs', 'higher lows', 'lower high', 'lower low', 'lower highs', 'lower lows'], ['trend']),
  e('range', 'Range', 'Sideways movement between a roughly level high and low; also called consolidation.', 'market-structure/trends', ['consolidation', 'ranging'], ['support', 'resistance'], { autoLink: false }),
  e('support', 'Support', 'A price level where falling prices have stopped and turned up before, because buyers appeared.', 'market-structure/support-and-resistance', [], ['resistance', 'retest']),
  e('resistance', 'Resistance', 'A price level where rising prices have stopped and turned down before, because sellers appeared.', 'market-structure/support-and-resistance', [], ['support', 'retest']),
  e('retest', 'Retest', 'Price returning to a level it has just broken, to see whether it now holds from the other side.', 'market-structure/support-and-resistance', [], ['breakout']),
  e('trend-line', 'Trend line', 'A sloping line through the swing lows of an uptrend or the swing highs of a downtrend.', 'market-structure/trend-lines', ['trend lines', 'trendline'], ['channel']),
  e('channel', 'Channel', 'A trend line plus a parallel line on the other side of price, forming a band price travels within.', 'market-structure/trend-lines', [], ['trend-line']),
  e('breakout', 'Breakout', 'Price moving clearly beyond a support or resistance level, often starting a new move.', 'market-structure/breakouts-and-fakeouts', ['breakouts'], ['fakeout', 'retest']),
  e('fakeout', 'Fakeout', 'A breakout that fails: price pokes beyond a level and then reverses back inside the range.', 'market-structure/breakouts-and-fakeouts', ['fakeouts', 'false breakout'], ['breakout']),

  // ── Chart patterns ──────────────────────────────────────────────────
  e('chart-pattern', 'Chart pattern', 'A recognisable shape formed by many candles that hints at a reversal or a continuation.', 'chart-patterns/head-and-shoulders', ['chart patterns', 'reversal pattern', 'continuation pattern', 'reversal patterns', 'continuation patterns']),
  e('head-and-shoulders', 'Head and shoulders', 'A reversal pattern of three peaks with the middle one highest, completed by a break below the neckline.', 'chart-patterns/head-and-shoulders', ['neckline'], ['double-top']),
  e('double-top', 'Double top / double bottom', 'A reversal pattern where price fails twice at about the same high (top) or low (bottom).', 'chart-patterns/double-tops-and-bottoms', ['double top', 'double bottom'], ['head-and-shoulders']),
  e('triangle', 'Triangle', 'A pattern of narrowing swings where lines through the highs and lows converge before a breakout.', 'chart-patterns/triangles', ['triangles', 'ascending triangle', 'descending triangle', 'symmetrical triangle'], ['breakout']),
  e('flag', 'Flag', 'A short, tight drift against a sharp move (the flagpole), usually followed by the move continuing.', 'chart-patterns/flags-and-wedges', ['flagpole', 'bull flag', 'bear flag'], ['wedge']),
  e('wedge', 'Wedge', 'A pattern with two converging lines sloping the same way, showing a move that is losing steam.', 'chart-patterns/flags-and-wedges', ['rising wedge', 'falling wedge', 'wedges'], ['flag']),
  e('cup-and-handle', 'Cup and handle', 'A bullish continuation pattern: a rounded recovery to an old high, a small dip, then a breakout.', 'chart-patterns/cup-and-handle'),

  // ── Indicators ──────────────────────────────────────────────────────
  e('indicator', 'Indicator', 'A calculation made from price or volume and drawn on the chart to make something easier to see.', 'indicators/moving-averages', ['indicators'], ['lag']),
  e('lag', 'Lag', 'The delay between price changing and an indicator showing it, because indicators are built from past prices.', 'indicators/moving-averages', ['lags']),
  e('moving-average', 'Moving average', 'The average price over the last N candles, recalculated on every new candle.', 'indicators/moving-averages', ['moving averages', 'SMA', 'simple moving average'], ['ema', 'period']),
  e('ema', 'EMA', 'Exponential moving average: a moving average that gives recent prices more weight, so it reacts sooner.', 'indicators/moving-averages', ['exponential moving average'], ['moving-average']),
  e('period', 'Period', 'The number of candles an indicator looks back over, such as 20 for a 20-period moving average.', 'indicators/moving-averages', [], [], { autoLink: false }),
  e('golden-cross', 'Golden cross', 'A shorter moving average crossing above a longer one (classically the 50 over the 200); the reverse is a death cross.', 'indicators/moving-averages', ['death cross']),
  e('whipsaw', 'Whipsaw', 'A signal that reverses almost immediately, causing a loss; common when trend tools are used in a range.', 'indicators/moving-averages', ['whipsaws', 'whipsawed']),
  e('volatility', 'Volatility', 'How much price moves around, regardless of direction.', 'indicators/volatility-indicators', ['volatile'], ['atr', 'bollinger-bands', 'implied-volatility']),
  e('bollinger-bands', 'Bollinger Bands', 'A band around a moving average, two standard deviations either side, that widens when price is volatile.', 'indicators/volatility-indicators', ['Bollinger band'], ['volatility', 'standard-deviation']),
  e('standard-deviation', 'Standard deviation', 'A measure of how spread out a set of numbers is; for prices, a measure of volatility.', 'indicators/volatility-indicators', ['standard deviations'], ['bollinger-bands']),
  e('atr', 'ATR', 'Average True Range: how far price typically moves in one candle, in price units.', 'indicators/volatility-indicators', ['average true range', 'true range'], ['volatility', 'stop-loss']),
  e('oscillator', 'Oscillator', 'An indicator that swings within a fixed range, usually 0 to 100, measuring momentum.', 'indicators/momentum-oscillators', ['oscillators'], ['rsi', 'stochastic', 'momentum']),
  e('momentum', 'Momentum', 'How strongly price has been moving in one direction.', 'indicators/momentum-oscillators', [], ['rsi', 'macd']),
  e('rsi', 'RSI', 'Relative Strength Index: a 0 to 100 gauge comparing recent gains with recent losses.', 'indicators/momentum-oscillators', ['relative strength index'], ['overbought', 'divergence']),
  e('stochastic', 'Stochastic', 'An oscillator showing where the close sits within the recent high-low range, from 0 to 100.', 'indicators/momentum-oscillators', ['stochastic oscillator'], ['rsi', 'overbought']),
  e('overbought', 'Overbought / oversold', 'An oscillator reading at its high or low extreme, meaning price has moved quickly; a caution, not a signal.', 'indicators/momentum-oscillators', ['overbought', 'oversold'], ['rsi', 'stochastic']),
  e('divergence', 'Divergence', 'Price and an oscillator disagreeing, such as a higher high in price with a lower high in RSI.', 'indicators/momentum-oscillators', ['divergences'], ['rsi', 'macd']),
  e('macd', 'MACD', 'Moving Average Convergence Divergence: the gap between a fast and a slow EMA, with a signal line and histogram.', 'indicators/macd', ['signal line', 'histogram'], ['ema', 'momentum']),
  e('volume', 'Volume', 'The amount traded during a candle.', 'indicators/volume-and-vwap', [], ['vwap']),
  e('vwap', 'VWAP', 'Volume-weighted average price: the average price paid during a session, counting busy candles more.', 'indicators/volume-and-vwap', ['volume-weighted average price'], ['volume']),

  // ── Strategies ──────────────────────────────────────────────────────
  e('strategy', 'Strategy', 'A set of rules for when to enter, when to exit and how much to trade.', 'strategies/trend-following', ['strategies']),
  e('trend-following', 'Trend following', 'Trading in the direction of an existing trend and holding until it ends.', 'strategies/trend-following', [], ['trend', 'mean-reversion']),
  e('mean-reversion', 'Mean reversion', 'Betting that a price stretched far from its average will return towards it.', 'strategies/mean-reversion', [], ['trend-following']),
  e('averaging-down', 'Averaging down', 'Buying more of a losing position to lower its average price; it increases exposure to what is going wrong.', 'strategies/mean-reversion', []),
  e('trailing-stop', 'Trailing stop', 'A stop-loss that follows price in your favour to lock in profit, and never moves back.', 'risk-management/stop-loss-placement', ['trailing stops'], ['stop-loss']),
  e('scalping', 'Scalping', 'Holding trades for seconds to minutes, aiming for very small moves many times a day.', 'strategies/trading-styles', [], ['day-trading']),
  e('day-trading', 'Day trading', 'Opening and closing every position within the same day.', 'strategies/trading-styles', ['day trader', 'day traders'], ['swing-trading']),
  e('swing-trading', 'Swing trading', 'Holding trades for days to a few weeks to catch one swing of a trend.', 'strategies/trading-styles', [], ['position-trading']),
  e('position-trading', 'Position trading', 'Holding trades for weeks to months, following the major trend.', 'strategies/trading-styles', [], ['swing-trading']),
  e('backtest', 'Backtest', 'Running a set of trading rules on historical data to see how they would have performed.', 'strategies/trend-following', ['backtesting', 'backtester'], ['overfitting']),
  e('overfitting', 'Overfitting', 'Tuning rules so closely to past data that they capture noise and fail on new data.', null, ['overfit'], ['backtest']),

  // ── Risk management ─────────────────────────────────────────────────
  e('risk-management', 'Risk management', 'Everything you do to make sure being wrong does not take you out of the game.', 'risk-management/position-sizing'),
  e('position-sizing', 'Position sizing', 'Choosing how many units to trade so that hitting your stop loses a fixed, small share of your account.', 'risk-management/position-sizing', ['position size', '1% rule'], ['stop-loss', 'r-multiple']),
  e('risk-reward', 'Risk/reward ratio', 'How much you could gain on a trade compared with how much you could lose; 1:2 means risking $1 to make $2.', 'risk-management/risk-reward', ['risk/reward', 'risk-reward', 'reward-to-risk'], ['stop-loss', 'take-profit', 'r-multiple']),
  e('r-multiple', 'R-multiple', 'A result measured in units of the amount risked: a 2R win made twice what was at risk.', 'risk-management/risk-reward', ['2R', '1R', '3R'], ['risk-reward', 'expectancy']),
  e('win-rate', 'Win rate', 'The percentage of your trades that make money.', 'risk-management/expectancy', [], ['expectancy']),
  e('expectancy', 'Expectancy', 'The average amount you make per trade over many trades: win rate times average win, minus loss rate times average loss.', 'risk-management/expectancy', [], ['win-rate', 'r-multiple']),
  e('drawdown', 'Drawdown', 'The fall in your account from its highest point to a later low, usually as a percentage.', 'risk-management/drawdown', ['drawdowns', 'maximum drawdown'], ['position-sizing']),
  e('profit-factor', 'Profit factor', 'Total profit from winning trades divided by total loss from losing trades; above 1 means profitable.', null, [], ['expectancy']),
  e('sharpe-ratio', 'Sharpe ratio', 'Return divided by the variability of that return; a measure of how smooth the profits were.', null, ['Sharpe'], ['drawdown']),
  e('journal', 'Trading journal', 'A record of every trade with the reasoning and result, used to find out what actually works for you.', 'psychology/trading-plan', ['journal'], ['trading-plan']),

  // ── Futures ─────────────────────────────────────────────────────────
  e('futures-contract', 'Futures contract', 'An agreement to buy or sell something at a set price on a set future date.', 'futures/futures-contracts', ['futures'], ['perpetual', 'underlying', 'derivative']),
  e('underlying', 'Underlying', 'The asset a derivative is based on, such as the stock behind an option.', 'futures/futures-contracts', []),
  e('contract-specs', 'Contract specs', 'The published details of a futures contract: multiplier, tick size, tick value, expiry and settlement.', 'futures/futures-contracts', ['multiplier', 'tick size', 'tick value']),
  e('perpetual', 'Perpetual future', 'A futures contract with no expiry date, kept close to the spot price by funding payments.', 'futures/futures-contracts', ['perpetual', 'perpetuals', 'perp', 'perps'], ['funding-rate', 'futures-contract']),
  e('rolling', 'Rolling', 'Closing an expiring futures contract and opening the next one to stay in the trade.', 'futures/funding-and-basis', ['roll cost'], ['contango']),
  e('initial-margin', 'Initial margin', 'The deposit needed to open a leveraged position.', 'futures/margin-and-liquidation', [], ['maintenance-margin', 'margin']),
  e('maintenance-margin', 'Maintenance margin', 'The minimum margin you must keep to hold a position open; below it you are liquidated.', 'futures/margin-and-liquidation', [], ['initial-margin', 'liquidation']),
  e('mark-price', 'Mark price', 'A smoothed fair value used by exchanges to calculate unrealised P&L and liquidations, instead of the last trade.', 'futures/margin-and-liquidation', [], ['liquidation']),
  e('isolated-margin', 'Isolated margin', 'Each position has its own margin, so a liquidation costs only what was assigned to that trade.', 'futures/margin-and-liquidation', [], ['cross-margin']),
  e('cross-margin', 'Cross margin', 'All positions share the whole account balance as margin, so one bad trade can drain everything.', 'futures/margin-and-liquidation', [], ['isolated-margin']),
  e('spot-price', 'Spot price', 'The price of something for immediate delivery, as opposed to a futures price.', 'futures/funding-and-basis', []),
  e('basis', 'Basis', 'The futures price minus the spot price.', 'futures/funding-and-basis', [], ['contango', 'convergence']),
  e('contango', 'Contango', 'Futures trading above the spot price; the opposite, futures below spot, is backwardation.', 'futures/funding-and-basis', ['backwardation'], ['basis']),
  e('convergence', 'Convergence', 'The futures price and spot price coming together as a contract approaches expiry.', 'futures/funding-and-basis', [], ['basis']),
  e('funding-rate', 'Funding rate', 'A small recurring payment between longs and shorts on a perpetual future that keeps its price near spot.', 'futures/funding-and-basis', ['funding', 'funding payment', 'funding payments'], ['perpetual']),
  e('hedge', 'Hedge', 'A position taken to offset a risk you already have.', 'futures/hedging-and-speculation', ['hedging', 'hedged'], ['speculation']),
  e('speculation', 'Speculation', 'Taking a position purely to profit from a price change, with nothing to protect.', 'futures/hedging-and-speculation', ['speculate'], ['hedge']),

  // ── Options ─────────────────────────────────────────────────────────
  e('option', 'Option', 'A contract giving the right, but not the obligation, to buy or sell something at a fixed price by a fixed date.', 'options/calls-and-puts', ['options'], ['call', 'put', 'premium']),
  e('call', 'Call option', 'The right to buy the underlying at the strike price; it gains value when the underlying rises.', 'options/calls-and-puts', ['call option', 'calls'], ['put', 'strike']),
  e('put', 'Put option', 'The right to sell the underlying at the strike price; it gains value when the underlying falls.', 'options/calls-and-puts', ['put option', 'puts'], ['call', 'strike']),
  e('strike', 'Strike price', 'The fixed price at which an option lets you buy or sell the underlying.', 'options/calls-and-puts', ['strike', 'strikes'], ['option']),
  e('expiry', 'Expiry', 'The date an option or futures contract ends.', 'options/calls-and-puts', ['expiration', 'expires']),
  e('premium', 'Premium', 'The price of an option, paid by the buyer to the seller.', 'options/calls-and-puts', ['premiums'], ['intrinsic-value', 'time-value']),
  e('payoff-diagram', 'Payoff diagram', 'A chart of the profit or loss of an option position at expiry for every possible final price.', 'options/calls-and-puts', ['payoff diagrams']),
  e('intrinsic-value', 'Intrinsic value', 'What an option would be worth if exercised right now; never less than zero.', 'options/option-value', [], ['time-value']),
  e('time-value', 'Time value', 'The part of an option premium above its intrinsic value, paid for the chance of further gain before expiry.', 'options/option-value', ['extrinsic value'], ['intrinsic-value', 'theta']),
  e('moneyness', 'Moneyness', 'Whether an option has intrinsic value: in the money, at the money or out of the money.', 'options/option-value', ['in the money', 'at the money', 'out of the money', 'ITM', 'ATM', 'OTM', 'in-the-money', 'at-the-money', 'out-of-the-money']),
  e('exercise', 'Exercise', 'Using the right an option gives: buying (call) or selling (put) the underlying at the strike.', 'options/option-value', ['exercised', 'exercises'], ['assignment']),
  e('assignment', 'Assignment', 'An option seller being required to fulfil the contract because a buyer exercised.', 'options/option-value', ['assigned'], ['exercise']),
  e('american-european', 'American / European style', 'American-style options can be exercised any day up to expiry; European-style only at expiry.', 'options/option-value', ['American-style', 'European-style']),
  e('writer', 'Option writer', 'The seller of an option, who receives the premium and takes on the obligation.', 'options/buying-vs-selling', ['writer'], ['uncovered']),
  e('uncovered', 'Uncovered option', 'A sold option with nothing held to meet the obligation; also called naked. An uncovered call has unlimited risk.', 'options/buying-vs-selling', ['uncovered', 'naked'], ['covered-call']),
  e('greeks', 'The Greeks', 'Measures of how an option price responds to changes in the underlying, time, volatility and interest rates.', 'options/delta-and-gamma', ['Greeks'], ['delta', 'gamma', 'theta', 'vega', 'rho']),
  e('delta', 'Delta', 'How much an option price changes when the underlying moves by $1.', 'options/delta-and-gamma', [], ['gamma']),
  e('gamma', 'Gamma', 'How much delta changes when the underlying moves by $1.', 'options/delta-and-gamma', [], ['delta']),
  e('theta', 'Theta', 'How much value an option loses each day from the passing of time alone.', 'options/theta-vega-rho', ['time decay'], ['time-value']),
  e('vega', 'Vega', 'How much an option price changes when implied volatility changes by one percentage point.', 'options/theta-vega-rho', [], ['implied-volatility']),
  e('rho', 'Rho', 'How much an option price changes when interest rates change by one percentage point.', 'options/theta-vega-rho', []),
  e('implied-volatility', 'Implied volatility', 'The amount of movement the market expects, worked out backwards from option prices.', 'options/implied-volatility', ['IV'], ['historical-volatility', 'iv-crush', 'vega']),
  e('historical-volatility', 'Historical volatility', 'How much the underlying has actually moved, measured from past prices.', 'options/implied-volatility', ['HV'], ['implied-volatility']),
  e('iv-crush', 'IV crush', 'A sharp fall in implied volatility once an awaited event, such as earnings, has passed.', 'options/implied-volatility', [], ['implied-volatility', 'earnings']),
  e('volatility-smile', 'Volatility smile', 'The pattern of implied volatility being higher for strikes far from the current price; a lopsided one is called skew.', 'options/implied-volatility', ['skew'], ['implied-volatility']),
  e('black-scholes', 'Black-Scholes model', 'A formula that prices a European option from the underlying price, strike, time, volatility and interest rate.', 'options/option-value', ['Black-Scholes']),
  e('leg', 'Leg', 'One bought or sold option (or stock position) within a multi-part option strategy.', 'options/basic-strategies', ['legs']),
  e('covered-call', 'Covered call', 'Owning the stock and selling a call against it: income in exchange for capping the upside.', 'options/basic-strategies', ['covered calls'], ['cash-secured-put']),
  e('cash-secured-put', 'Cash-secured put', 'Selling a put while holding enough cash to buy the stock at the strike if assigned.', 'options/basic-strategies', ['cash-secured puts', 'cash-secured'], ['covered-call']),
  e('protective-put', 'Protective put', 'Owning the stock and buying a put below the price, as insurance against a fall.', 'options/basic-strategies', []),
  e('vertical-spread', 'Vertical spread', 'Buying one option and selling another of the same type and expiry at a different strike, capping both risk and reward.', 'options/spreads-and-volatility', ['vertical spreads', 'bull call spread', 'bear put spread', 'bull put spread', 'debit spread', 'credit spread', 'credit spreads'], ['leg']),
  e('debit-credit', 'Debit / credit', 'A debit is a net premium paid to open a strategy; a credit is a net premium received.', 'options/spreads-and-volatility', ['net debit', 'net credit']),
  e('straddle', 'Straddle', 'Buying a call and a put at the same strike and expiry, to profit from a large move in either direction.', 'options/spreads-and-volatility', ['long straddle', 'short straddle'], ['strangle']),
  e('strangle', 'Strangle', 'Buying an out-of-the-money call and put: cheaper than a straddle, needing a bigger move.', 'options/spreads-and-volatility', ['long strangle', 'short strangle'], ['straddle']),
  e('iron-condor', 'Iron condor', 'Selling an out-of-the-money put spread and call spread together, to profit if price stays in a range.', 'options/advanced-strategies', ['iron condors'], ['butterfly']),
  e('butterfly', 'Butterfly', 'Three strikes, buying the outer two and selling two of the middle, to profit if price ends near the middle strike.', 'options/advanced-strategies', ['long butterfly'], ['iron-condor']),
  e('calendar-spread', 'Calendar spread', 'Selling a near-term option and buying a longer-term one at the same strike, to profit from faster decay in the near one.', 'options/advanced-strategies', ['calendar spreads'], ['theta']),

  // ── Psychology ──────────────────────────────────────────────────────
  e('fomo', 'FOMO', 'Fear of missing out: jumping into a move already under way because others seem to be profiting.', 'psychology/fomo-revenge-overtrading'),
  e('revenge-trading', 'Revenge trading', 'Taking a new trade straight after a loss to win the money back, usually larger and less thought through.', 'psychology/fomo-revenge-overtrading'),
  e('overtrading', 'Overtrading', 'Taking too many trades, from boredom or a wish for action, most of them low quality.', 'psychology/fomo-revenge-overtrading'),
  e('loss-aversion', 'Loss aversion', 'The tendency for a loss to hurt about twice as much as an equal gain feels good.', 'psychology/loss-aversion', [], ['confirmation-bias']),
  e('confirmation-bias', 'Confirmation bias', 'Noticing evidence that agrees with your position and dismissing evidence that does not.', 'psychology/loss-aversion', []),
  e('trading-plan', 'Trading plan', 'A written set of rules covering what you trade, entries, exits, risk and when to stop.', 'psychology/trading-plan', [], ['journal']),

  // ── Fundamentals ────────────────────────────────────────────────────
  e('fundamental-analysis', 'Fundamental analysis', 'Studying the real-world facts that make something worth more or less, such as profits and interest rates.', 'fundamentals/earnings', ['fundamentals']),
  e('earnings', 'Earnings', 'A company\'s profit, reported every three months along with revenue and a forecast.', 'fundamentals/earnings', ['earnings report', 'EPS', 'earnings per share'], ['guidance', 'iv-crush']),
  e('guidance', 'Guidance', 'A company\'s own forecast for coming quarters, given with its earnings report.', 'fundamentals/earnings', [], ['earnings']),
  e('gap', 'Gap', 'A jump in price from one candle to the next with no trading in between, usually on news released while the market was closed.', 'fundamentals/earnings', ['gaps', 'price gap'], ['stop-loss'], { autoLink: false }),
  e('pe-ratio', 'P/E ratio', 'Share price divided by annual earnings per share: what investors pay for each $1 of yearly profit.', 'fundamentals/earnings', ['price-to-earnings ratio', 'P/E']),
  e('interest-rate', 'Interest rate', 'The cost of borrowing money and the reward for lending it.', 'fundamentals/interest-rates', ['interest rates'], ['central-bank']),
  e('central-bank', 'Central bank', 'The institution that sets a country\'s base interest rate, such as the Federal Reserve.', 'fundamentals/interest-rates', ['central banks', 'Federal Reserve'], ['interest-rate', 'inflation']),
  e('inflation', 'Inflation', 'The general rise in prices over time.', 'fundamentals/interest-rates', ['CPI', 'Consumer Price Index'], ['central-bank']),
  e('economic-calendar', 'Economic calendar', 'A schedule of upcoming economic data releases and central bank decisions.', 'fundamentals/economic-news', []),
];

const BY_ID = new Map(GLOSSARY.map((entry) => [entry.id, entry]));

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return BY_ID.get(id);
}

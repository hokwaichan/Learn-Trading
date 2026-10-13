import { defineQuizzes, q } from './helpers';

export const marketsInPracticeQuizzes = defineQuizzes('markets-in-practice', {
  'crypto-markets': [
    q('What is a stablecoin?', ['A coin whose price never changes by law', 'A token designed to stay worth one unit of a currency such as the US dollar', 'The most traded coin each day', 'A coin held by a central bank'], 1, 'A stablecoin aims to hold a fixed value, usually one dollar. It can still fail if what backs it fails.'),
    q('Why is there no single official price for Bitcoin?', ['Prices are secret', 'It trades on many exchanges at slightly different prices', 'It is priced once a day', 'Governments set different prices'], 1, 'Each exchange has its own order book. Prices stay close because traders move between them, but they are not identical.'),
    q('Crypto is several times more volatile than a stock index. How should that change your position size?', ['Larger, to catch the moves', 'Smaller, to keep the same dollar risk', 'No change', 'Remove the stop instead'], 1, 'Wider swings need wider stops, so the size must shrink to hold risk constant.'),
    q('What is counterparty risk on an exchange?', ['The risk that price moves against you', 'The risk that the exchange holding your funds fails or freezes withdrawals', 'The risk of paying a fee', 'The risk of a wide spread'], 1, 'Assets held on an exchange are a claim on that company. If it fails, you may not get them back.'),
    q('Which is the sensible choice while learning?', ['Small, thinly traded tokens with high leverage', 'The largest, most liquid coins at a reduced size', 'Whatever is trending on social media', 'Only coins that have never fallen'], 1, 'Liquid coins have tight spreads and can be exited in a panic. Thin coins cannot.'),
  ],
  'reading-perpetuals-data': [
    q('Funding is strongly positive. What does that tell you?', ['Shorts are paying longs', 'Leveraged longs are crowded and paying to hold', 'The market is closed', 'Volume is zero'], 1, 'Positive funding means longs pay shorts, which happens when demand for leveraged longs is high.'),
    q('Funding is 0.05% every 8 hours. What does a $20,000 long pay per day?', ['$10', '$30', '$100', '$1'], 1, '$20,000 x 0.0005 x 3 = $30 a day.'),
    q('Price rises while open interest falls. The most likely explanation is:', ['New longs are piling in', 'Shorts are closing their positions', 'The exchange is offline', 'Funding is negative'], 1, 'Falling open interest means positions are closing. A rally on closing shorts tends to fade once they are done.'),
    q('What is a liquidation cascade?', ['A slow, steady trend', 'A chain reaction where forced selling triggers more forced selling', 'A scheduled funding payment', 'A type of limit order'], 1, 'Each wave of liquidations pushes price to the next cluster of liquidation levels.'),
    q('A cascade has just flushed price down on huge volume. Why is shorting now usually late?', ['Shorting is banned', 'The forced sellers are gone, so the selling pressure has passed', 'Funding turns positive', 'Volume is too low'], 1, 'Once leveraged longs have been cleared out, there is little forced selling left, and price often rebounds.'),
  ],
  'forex-basics': [
    q('EUR/USD is at 1.1000. What does that mean?', ['One dollar costs 1.10 euros', 'One euro costs 1.10 dollars', 'The euro is worth 110 dollars', 'The spread is 1.1 pips'], 1, 'The base currency (EUR) is priced in the quote currency (USD).'),
    q('EUR/USD moves from 1.0850 to 1.0890. How many pips is that?', ['4', '40', '400', '0.4'], 1, 'A pip is 0.0001. The move is 0.0040, or 40 pips.'),
    q('How large is a standard lot?', ['1,000 units', '10,000 units', '100,000 units', '1,000,000 units'], 2, 'A standard lot is 100,000 units of the base currency. A mini lot is 10,000 and a micro lot 1,000.'),
    q('What is one pip worth on a mini lot of EUR/USD?', ['$0.10', '$1', '$10', '$100'], 1, '10,000 x 0.0001 = $1 per pip.'),
    q('You risk $100 with a 20-pip stop on EUR/USD. What position gives that?', ['$1 a pip', '$5 a pip, five mini lots', '$20 a pip', '$100 a pip'], 1, '$100 / 20 pips = $5 a pip, which is five mini lots.'),
    q('A broker offers 30 to 1 leverage. How should you decide your position size?', ['Use all of it', 'From your stop distance and the percentage you are willing to lose', 'Use half of it', 'Leverage sets the size automatically'], 1, 'Available leverage is a limit, not a recommendation. Size comes from risk.'),
  ],
  'costs-and-execution': [
    q('Which of these is a trading cost even with a "zero commission" broker?', ['The spread', 'The candle colour', 'The timeframe', 'The moving average'], 0, 'You still buy at the ask and sell at the bid. The spread is how such brokers are paid.'),
    q('Fee 0.1% each way on a $2,000 round trip. What are the fees?', ['$2', '$4', '$20', '$0.20'], 1, '$2 to enter and $2 to exit: $4.'),
    q('What is slippage?', ['A fee charged monthly', 'The difference between the expected price and the price actually filled', 'The gap between two exchanges', 'A type of stop order'], 1, 'Slippage is the shortfall between plan and fill. It is worst on market and stop orders in fast markets.'),
    q('A strategy averages +0.3% a trade before costs, and a round trip costs 0.32%. The strategy is:', ['Strongly profitable', 'Slightly unprofitable', 'Break-even exactly', 'Impossible to judge'], 1, '0.3% - 0.32% is negative. Costs can turn a real edge into a loss.'),
    q('What is the surest way to reduce trading costs?', ['Use higher leverage', 'Trade less often', 'Trade at night', 'Use only market orders'], 1, 'Every trade pays costs. Fewer, better trades is the most reliable saving.'),
  ],
});

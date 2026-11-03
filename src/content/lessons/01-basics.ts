import { chart, danger, defineModule, formula, gallery, h, img, level, made, mark, note, ol, p, real, ul, walk, warn, widget, worked } from './helpers';

export const basics = defineModule(1, 'basics', 'Basics', 'What a market is, how orders work, and why leverage needs respect.', [
  {
    id: 'what-markets-are',
    title: 'What markets are',
    summary: 'A market is where buyers and sellers agree on a price. That is all a chart records.',
    minutes: 4,
    blocks: [
      p('A **market** is where people who want to buy meet people who want to sell. When they agree, a **trade** happens at a price. Nobody sets that price: it is simply the last amount a buyer and a seller agreed on.'),
      img(
        'nyse-trading-floor',
        'The trading floor of the New York Stock Exchange, crowded with traders, screens and flags',
        'The New York Stock Exchange. Most trading now happens on computers, but the idea is unchanged: buyers and sellers agreeing on prices.',
      ),
      h('What gets traded'),
      gallery([
        ['traded-stock-certificate', 'Stocks: part of a company'],
        ['traded-banknotes', 'Forex: one currency for another'],
        ['traded-bitcoin', 'Crypto: digital currencies'],
        ['traded-futures-pit', 'Derivatives: futures and options'],
      ]),
      p('Each **instrument** has a short code, its **symbol** or **ticker**: AAPL for Apple, BTC for Bitcoin.'),
      h('Why prices move'),
      p('More eager buyers than sellers, and the price rises. More eager sellers, and it falls. News, company results, interest rates, fear and greed all shift that balance, which is called **supply and demand**.'),
      chart(real('SPY', '2025-01-02', '2025-12-31', 'One year of real daily prices for SPY, a fund holding 500 large US companies. Each bar is one day. Point at a bar to read it, and drag sideways to pan.')),
      note('What a trader does', 'Buy for less than you later sell, or the reverse. Nobody knows the next price, so the skill is taking trades where the possible gain is worth the possible loss, and keeping losses small.'),
      p('Here you practise with **paper trading**: pretend money at real prices, so mistakes cost nothing.'),
    ],
  },
  {
    id: 'order-types',
    title: 'Order types: market, limit and stop',
    summary: 'An order is an instruction to buy or sell. The type decides when it happens and at what price.',
    minutes: 5,
    blocks: [
      p('An **order** is an instruction to buy or sell. Each type trades speed against price:'),
      ul(
        '**Market order**: trade now at the best price available. It always fills, but in a fast market you may get a worse price than you saw. That gap is **slippage**.',
        '**Limit order**: trade only at your price or better. You control the price, but the order may never be **filled**.',
        '**Stop order**: waits until price reaches your trigger, then becomes a market order. A **stop-loss** closes a losing trade; a **take-profit** closes a winner at your target.',
      ),
      chart(
        made(
          walk([100, 104, 101, 106, 103, 109, 112], { seed: 3 }),
          'One trade planned with three orders. A limit order waits below the current price to buy on a dip. Once it fills, a stop-loss sits below it and a take-profit above.',
          [level(101.2, 'Buy limit: buy at 101.20 or lower'), level(98.5, 'Stop-loss: sell if price falls to 98.50'), level(110.5, 'Take-profit: sell at 110.50'), mark(11, 'Limit fills here', 99.6)],
        ),
      ),
      note('Which to use', 'Need to get in or out now: market. Have a price in mind and can wait: limit. Want to be taken out if you are wrong: stop-loss, placed before you enter.'),
      warn('A stop is not a guarantee', 'Once triggered, a stop is a market order. If price jumps past it, for example on overnight news, you get the next available price, which can be worse.'),
    ],
  },
  {
    id: 'bid-ask-spread',
    title: 'Bid, ask and the spread',
    summary: 'There are always two prices: what buyers offer and what sellers ask. The gap is a cost you pay on every trade.',
    minutes: 5,
    blocks: [
      p('A market always has two prices. The **bid** is the most any buyer will pay right now. The **ask** is the least any seller will accept. The gap between them is the **spread**.'),
      img(
        'order-book-depth',
        'A level 2 order book: bid prices and sizes in green, ask prices and sizes in red, and a depth chart beside them',
        'An order book. Buyers wait below the price (green), sellers above (red). The best bid, $87.42, and the best ask, $87.43, meet in the middle: a spread of one cent.',
      ),
      p('All the waiting limit orders together are the **order book**. Try it:'),
      widget('order-book'),
      h('Why the spread costs you money'),
      worked(
        'The spread on a round trip',
        'You buy 100 shares with a market order at the ask of $100.02. Cost: $10,002.',
        'You change your mind and sell at the bid of $99.98. You receive $9,998.',
        'You lost $4, plus any fees, although the price did not move.',
      ),
      h('Liquidity'),
      p('**Liquidity** is how easily you can trade without moving the price. Big stocks, major currencies and large coins are liquid: tight spreads, little slippage. Small ones often have wide spreads, and a large order eats through several price levels.'),
      note('In this app', 'Paper trades here add a small simulated fee and slippage, which you can change in Settings, so your practice results are not unrealistically good.'),
    ],
  },
  {
    id: 'long-and-short',
    title: 'Long vs short',
    summary: 'Going long profits when price rises. Going short profits when it falls, and has a nastier worst case.',
    minutes: 5,
    blocks: [
      h('Going long'),
      p('Buy now, sell later, and profit if price rises: buy at $100, sell at $110, make $10. This is going **long**. The worst case is the price falling to zero, losing what you paid and no more.'),
      h('Going short'),
      p('Going **short** profits from a fall. You sell first and buy back later:'),
      ol(
        'Borrow the asset from your broker and sell it now, say at $100.',
        'Later, buy it back. This is called **covering**.',
        'Return what you borrowed and keep the difference: buy back at $90 and you made $10.',
      ),
      chart(
        made(
          walk([100, 106, 111, 108, 101, 95, 92, 96], { seed: 11 }),
          'The same price path seen from both sides. A long entered at A loses money by B. A short entered at A makes money by B.',
          [mark(11, 'A: enter at 111'), mark(35, 'B: exit at 92', 90.6), level(111, 'Entry 111'), level(92, 'Exit 92')],
        ),
      ),
      formula('Long profit = (exit price - entry price) x quantity\nShort profit = (entry price - exit price) x quantity', 'Both are negative when the trade goes the wrong way.'),
      danger('A short can lose more than a long', 'A price can only fall to zero, but it can rise without limit. A stock shorted at $100 that goes to $400 loses three times the original amount. Always use a stop-loss when short.'),
      img(
        'bull-and-bear',
        'Bronze statues of a bear and a bull facing each other outside the Frankfurt Stock Exchange',
        'The bull and the bear outside the Frankfurt Stock Exchange. Bullish means expecting prices to rise; bearish means expecting them to fall.',
      ),
      note('Words you will see', 'A long or short that is still open is a **position**. Closing it means doing the opposite trade. Shorts can also carry a borrowing fee, or funding on futures.'),
    ],
  },
  {
    id: 'leverage',
    title: 'Leverage and why it is dangerous',
    summary: 'Leverage lets you control a big position with a small deposit. It multiplies losses exactly as much as gains.',
    minutes: 6,
    blocks: [
      p('**Leverage** means trading a position larger than your money by borrowing the rest. The money you put in is the **margin**. With 10x leverage, $1,000 of margin controls a $10,000 position, and profit and loss are counted on the whole $10,000.'),
      worked(
        '10x leverage, both ways',
        'You put up $1,000 margin and open a $10,000 long.',
        'Price rises 5%. The position gains $500. On your $1,000 that is +50%.',
        'Instead, price falls 5%. The position loses $500. On your $1,000 that is -50%.',
        'Price falls 10%. The position loses $1,000: all of your margin is gone.',
      ),
      h('Liquidation'),
      p('When losses have used up nearly all your margin, the exchange closes the position for you. This is **liquidation**, and it usually costs the whole margin. The move that does it is roughly:'),
      formula('Move that wipes out the margin = 1 / leverage', '2x: 50%.  5x: 20%.  10x: 10%.  20x: 5%.  50x: 2%.  Fees and the exchange safety buffer make the real figure slightly smaller.'),
      widget('leverage-demo'),
      danger('Why this catches beginners', 'Markets move 2% to 5% in a day routinely, and crypto often more. At 20x an ordinary day wipes out your margin even if your idea was right. You are no longer betting on direction, but on price not wobbling first.'),
      ul(
        'Leverage does not make an idea better, only the result bigger.',
        'Decide how many dollars you will risk first, then size the position. The Risk management module shows how.',
        'Low leverage with a stop-loss well before liquidation means you choose where you get out, not the exchange.',
      ),
      warn('In this app', 'The futures simulator warns you above 5x and shows the percentage move that would wipe out the position before you confirm.'),
    ],
  },
]);

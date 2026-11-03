import { chart, danger, defineModule, formula, h, img, level, made, mark, note, ol, p, ul, walk, warn, widget, worked } from './helpers';

export const futures = defineModule(8, 'futures', 'Futures', 'Contracts that let you trade with leverage, long or short. Powerful, and the fastest way to lose an account.', [
  {
    id: 'futures-contracts',
    title: 'What a futures contract is',
    summary: 'An agreement to trade something later at a price fixed today, and the contract details you need to read first.',
    minutes: 6,
    blocks: [
      p('A **futures contract** is an agreement to buy or sell something at a set price on a set future date. A farmer and a baker can fix the price of wheat today for delivery in six months.'),
      img(
        'cme-building',
        'Glowing price boards and screens inside the Chicago Mercantile Exchange',
        'The Chicago Mercantile Exchange, home of many of the biggest futures contracts in the world.',
      ),
      p('Futures are **derivatives**: their value comes from an **underlying** such as wheat, oil, an index or Bitcoin. Most traders never touch the underlying; they trade the contract and close it before it ends.'),
      ul(
        '**Multiplier**: how much one contract controls. One E-mini S&P 500 contract is 50 times the index.',
        '**Tick size and value**: the smallest step, 0.25 points on the E-mini, worth 0.25 x 50 = $12.50.',
        '**Expiry and settlement**: when it ends, and whether the underlying is delivered or the difference paid in cash. Most financial futures are **cash-settled**.',
      ),
      formula('Profit or loss = (exit price - entry price) x multiplier x contracts', 'Reverse the sign for a short. Equivalently: number of ticks moved x tick value x contracts.'),
      worked(
        'One E-mini contract',
        'You buy 1 contract at 5,000.00. Multiplier 50, so you control $250,000 of index.',
        'Price rises to 5,010.00: 10 points, or 40 ticks.',
        'Profit: 10 x 50 = $500 (40 ticks x $12.50).',
        'A 10-point fall would lose $500 just as quickly.',
      ),
      chart(
        made(walk([4980, 5000, 4992, 5010, 5004, 5020], { seed: 121, noise: 0.0012 }), 'A long trade in a futures contract. Each point the price moves is worth the multiplier in dollars, per contract.', [
          level(5000, 'Buy 1 contract at 5,000'),
          level(5010, 'Sell at 5,010: 10 points x 50 = +$500'),
          mark(5, 'Enter', 4994),
          mark(17, 'Exit'),
        ]),
      ),
      p('Traditional futures are **dated**: to stay in past expiry you close one contract and open the next, called **rolling**. Crypto **perpetual futures** never expire and use funding instead. The Futures page simulates perpetuals.'),
      warn('Leverage is built in', 'That $250,000 E-mini position needs a deposit of perhaps $12,000 to $15,000. A 1% index move is $2,500.'),
    ],
  },
  {
    id: 'margin-and-liquidation',
    title: 'Margin, mark price and liquidation',
    summary: 'The deposit you put up, how the exchange measures your losses against it, and when it closes you out.',
    minutes: 6,
    blocks: [
      p('You do not pay the full value of a futures position. You put up **margin**, and position value divided by margin is the **leverage**.'),
      ul(
        '**Initial margin** opens the position: 10% of its value at 10x.',
        '**Maintenance margin** is the minimum to keep it open, often 0.4% to 1% on crypto perpetuals.',
      ),
      p('Losses come out of your margin. When what is left reaches the maintenance margin, the exchange closes you out: **liquidation**.'),
      formula('Initial margin = position value / leverage\nLiquidation (long) is roughly: entry x (1 - 1 / leverage + maintenance rate)\nLiquidation (short) is roughly: entry x (1 + 1 / leverage - maintenance rate)', 'Long at 100 with 10x and 0.5% maintenance: about 100 x (1 - 0.10 + 0.005) = 90.50.'),
      worked(
        'A long that gets liquidated',
        'You open a $10,000 long on BTC at 10x. Initial margin: $1,000. Maintenance margin at 0.5%: $50.',
        'Price falls 5%. Loss: $500. Margin left: $500. Still open.',
        'Price falls 9.5%. Loss: $950. Margin left: $50, which equals the maintenance margin.',
        'The exchange liquidates. You lose essentially the whole $1,000, plus a liquidation fee.',
      ),
      widget('leverage-demo'),
      p('Liquidation uses the **mark price**, a smoothed fair value from several exchanges, so one odd trade cannot wipe you out.'),
      ul(
        '**Isolated margin**: each position has its own margin; the most you can lose is what you assigned.',
        '**Cross margin**: positions share the whole balance, so one loser can take everything.',
      ),
      danger('Cross margin can empty the account', 'As a beginner use isolated margin, so the worst case on every trade is known.'),
      note('The stop goes before the liquidation price', 'If the stop you want is beyond the liquidation price, your leverage is too high.'),
      warn('In this app', 'The futures simulator shows margin used, free margin and the liquidation price before you confirm, draws the liquidation price on the chart, and warns you above 5x leverage.'),
    ],
  },
  {
    id: 'funding-and-basis',
    title: 'Funding, basis, contango and backwardation',
    summary: 'Why a futures price differs from the spot price, and the recurring payment that keeps perpetuals in line.',
    minutes: 6,
    blocks: [
      p('The price for immediate delivery is the **spot price**. The gap between a futures price and spot is the **basis**.'),
      formula('Basis = futures price - spot price', 'Positive when futures are above spot, negative when below.'),
      img(
        'contango-backwardation',
        'Chart of futures prices converging to the expected spot price by maturity: one line falling from above in contango, one rising from below in backwardation',
        'In contango futures trade above the expected spot price; in backwardation, below. Both meet it at maturity.',
      ),
      ul(
        '**Contango**: futures **above** spot, normal when holding the real thing costs storage or interest.',
        '**Backwardation**: futures **below** spot, as in a shortage or when prices are expected to fall.',
        '**Convergence**: at expiry the contract settles at spot, so the basis shrinks to zero.',
      ),
      chart(
        made(walk([4.2, 3.4, 2.7, 1.9, 1.2, 0.5, 0.02], { seed: 131, noise: 0.03 }), 'The basis of a dated future in contango, shrinking as expiry approaches. At expiry the futures price equals the spot price.', [
          level(0, 'Expiry: futures price = spot price'),
          mark(0, 'Futures 4.20 above spot'),
        ]),
      ),
      p('Rolling a contract in contango buys the dearer next month each time. This **roll cost** is why long-term futures funds drift below spot.'),
      h('Funding on perpetuals'),
      p('Perpetuals never expire, so the **funding rate**, a payment between longs and shorts usually every 8 hours, keeps them near spot. Above spot, **longs pay shorts**; below, **shorts pay longs**.'),
      formula('Funding payment = position value x funding rate', 'Paid or received at each interval. A typical rate is around 0.01% per 8 hours, but it can be many times that when the market is one-sided.'),
      worked(
        'What funding costs',
        'You hold a $10,000 long. The funding rate is +0.01% every 8 hours.',
        'Each payment: $10,000 x 0.0001 = $1.',
        'Three payments a day: $3 a day, or roughly 11% of the position value per year.',
        'At 10x leverage that $10,000 position is on $1,000 of margin, so funding is about 0.3% of your margin every day.',
      ),
      warn('Funding is paid on the position, not the margin', 'In a euphoric rally funding can reach 0.1% per 8 hours: over 100% a year on the position.'),
      note('Funding as a signal', 'Very high funding means crowded leveraged longs, many of whom would be forced to sell on a drop.'),
    ],
  },
  {
    id: 'hedging-and-speculation',
    title: 'Hedging, speculation and leverage in practice',
    summary: 'The two reasons to trade futures, and worked examples of leverage cutting both ways.',
    minutes: 6,
    blocks: [
      p('To **hedge** is to take a position that offsets a risk you already have. The aim is less uncertainty, not profit.'),
      worked(
        'Hedging a holding',
        'You own 1 BTC, worth $80,000, and do not want to sell it, but you fear a drop over the next month.',
        'You open a short perpetual for 1 BTC at $80,000.',
        'Price falls to $70,000. Your BTC is down $10,000. Your short is up $10,000. Net: zero.',
        'Price rises to $90,000 instead. Your BTC is up $10,000; your short is down $10,000. Net: zero.',
        'You gave up the upside to remove the downside. That is the trade-off of every hedge.',
      ),
      chart(
        made(walk([80000, 82500, 79000, 75500, 72000, 70000], { seed: 141, noise: 0.004 }), 'Price falls from 80,000 to 70,000. A holder with no hedge loses 10,000 per coin. A holder who also shorted one futures contract gains 10,000 on the short, so the two cancel.', [
          level(80000, 'Hedge opened: short 1 BTC at 80,000'),
          level(70000, 'Holding -10,000, short +10,000'),
        ]),
      ),
      p('To **speculate** is to trade purely for a price change. Most retail futures trading is speculation, so every bit of leverage is extra risk. The same $1,000 and a 4% move:'),
      worked('No leverage (1x)', 'Position: $1,000.', 'Price +4%: +$40, a 4% return.', 'Price -4%: -$40, a 4% loss.', 'Wipe-out move: a 100% fall.'),
      worked('5x leverage', 'Position: $5,000.', 'Price +4%: +$200, a 20% return.', 'Price -4%: -$200, a 20% loss.', 'Wipe-out move: about 20%.'),
      worked('20x leverage', 'Position: $20,000.', 'Price +4%: +$800, an 80% return.', 'Price -4%: -$800, an 80% loss.', 'Wipe-out move: about 5%. A 4% dip leaves you with $200; one more percent and you are liquidated.'),
      p('At 20x a 5% fall liquidates you, and a 30% rally afterwards does not help. You can be right on direction and still lose everything.'),
      ol(
        'Choose the stop from the chart.',
        'Choose the dollar risk, 1% of the account.',
        'The position size follows; use only the leverage it needs, often 1x to 3x.',
      ),
      danger('Leverage is a tool for sizing, not for getting rich', 'Use it to take a correctly sized position without tying up the whole account, never to trade bigger than your risk rules allow.'),
      note('Practise it safely', 'Try the same trade on the Futures page at 2x and at 20x, with the same entry. Watch how close the liquidation price sits to the current price in each case.'),
    ],
  },
]);

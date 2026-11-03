import { chart, defineModule, formula, gallery, h, made, mark, note, ol, p, real, seg, ul, walk, warn, widget, worked } from './helpers';

export const tradeManagement = defineModule(16, 'trade-management', 'Managing a trade and an account', 'What to do after the entry: partial exits and trailing stops, and how to keep several trades from adding up to one large bet.', [
  {
    id: 'scaling-in-and-out',
    title: 'Scaling in and out',
    summary: 'You do not have to enter or exit all at once. Splitting a position changes the risk, the reward and how the trade feels.',
    minutes: 5,
    blocks: [
      p('Adding to a position in stages is **scaling in**; closing it in stages is scaling out, or taking **partial profits**. The common version: close half at 1R and let the rest run.'),
      worked('The same trade, managed two ways', 'Entry 100, stop 95, 20 units: $100 at risk.', 'Price reaches 105, then 115, then falls back to 100.', 'All out at 115: $300, or 3R. Half at 105, half at 115: $200, or 2R.', 'If price had reached 105 and then hit the stop: all-or-nothing loses $100; the scaled version, with the stop moved to entry, makes +$50.'),
      p('Scaling out lowers the best result and improves the worst. It hurts trend-following systems that live on a few huge winners.'),
      h('The break-even stop'),
      p('Moving the stop to entry after the first target means the trade cannot lose, but price often revisits the entry before continuing. Move it only after real progress, ideally to just beyond the latest swing point.'),
      ul(
        '**Adding to a winner** (pyramiding): add only after price moves your way and the stop can be raised. Total risk never exceeds the plan.',
        '**Adding to a loser** (averaging down): the position grows as the evidence against it grows.',
      ),
      p('However you split it, the loss if every part is stopped must stay within your limit:'),
      widget('position-size'),
      warn('Averaging down is not scaling in', 'If the add was not written in your plan before entering, it is the losing kind.'),
    ],
  },
  {
    id: 'trailing-stops',
    title: 'Trailing stops: letting winners run',
    summary: 'A stop that follows price up locks in profit without guessing where the move will end. Four ways to trail, and what each costs.',
    minutes: 5,
    blocks: [
      p('The best trades go further than any sensible target. A **trailing stop** has no target: it follows price and exits only when price turns by a set amount.'),
      chart(
        made(walk([100, 108, 105, 114, 110, 121, 116, 110], { seed: 27 }), 'A long from 100 with the stop raised under each new higher low. It is hit near 115, keeping most of the move without predicting the top.', [
          seg(0, 97, 11, 97, 'First stop'),
          seg(11, 104, 23, 104, 'Raised under the higher low'),
          seg(23, 109, 35, 109, 'Raised again'),
          seg(35, 115, 41, 115, 'Raised again: hit here'),
          mark(29, 'The high: no one knows it yet'),
        ]),
      ),
      ul(
        '**By structure**: just beyond each confirmed swing low, as in the chart.',
        '**By ATR**: two or three ATR below the highest close; widens when volatility rises.',
        '**By moving average**: exit on a close below, say, the 20-period average.',
        '**By percentage**: easy to automate, blind to structure and volatility.',
      ),
      formula('ATR trailing stop (long) = highest close since entry - multiple x ATR', 'Highest close 120, ATR 2, multiple 3: stop at 114. It only ever moves up.'),
      p('A tight trail keeps more of each move but gets knocked out by normal pullbacks; a loose one stays in big trends but gives back more at the end.'),
      ol(
        'Only move it in your favour.',
        'Keep the initial stop until price has moved at least 1R.',
        'Choose the method before entering.',
      ),
      note('Targets and trails together', 'A common compromise: take half at a fixed target and trail the rest.'),
      warn('You will never sell the top', 'A trailing stop always exits after the high. Giving some back is the price of catching the move that goes three times further than expected.'),
    ],
  },
  {
    id: 'correlation-and-exposure',
    title: 'Correlation: when five trades are really one',
    summary: 'Positions that move together are a single bet. Risking 1% on each of five correlated trades is risking 5% on one idea.',
    minutes: 5,
    blocks: [
      p('**Correlation** measures how closely two things move together. The 1% rule limits one trade, not several that lose at the same moment.'),
      gallery(
        [
          ['correlation-positive', 'Strong positive: move together'],
          ['correlation-negative', 'Strong negative: move opposite'],
          ['correlation-low', 'Low: little relation'],
        ],
        'Each dot pairs two values. If the daily moves of two markets plot as a tight rising line, two positions in them are really one bet.',
      ),
      ul(
        '**Crypto**: most coins follow Bitcoin.',
        '**Stocks**: shares in a sector, and most large shares, fall together.',
        '**Currencies**: EUR/USD and GBP/USD both fall when the dollar strengthens.',
        '**In a panic**: shares and crypto drop together.',
      ),
      chart(real('SPY', '2025-01-02', '2025-06-30', 'SPY, 500 large US companies, in the first half of 2025. Compare with Apple below.')),
      chart(real('AAPL', '2025-01-02', '2025-06-30', 'Apple over the same months. The size differs, but the fall and the recovery come in the same weeks.')),
      worked('Three longs', 'Long Bitcoin, Ethereum and Solana, each sized to lose 1%.', 'Bitcoin drops 6%; the others follow.', 'All three stops hit within the hour: 3% lost on one event.', 'Fix: cap correlated risk at, say, 2%, so each is sized at about 0.67%.'),
      ol(
        'Before a trade, ask what else you hold that loses in the same scenario.',
        'Cap total open risk at 3% to 5%, and lower for one group.',
        'A long and short in correlated instruments partly cancel: a hedge, or two sets of fees for nothing.',
      ),
      warn('Correlation rises when it hurts most', 'In a sell-off almost everything falls together. Plan total risk for the bad day.'),
      note('In this app', 'The Positions tab lists every open position with its stop. Add up the losses if every stop hit at once: that is your real exposure.'),
    ],
  },
  {
    id: 'risk-of-ruin',
    title: 'Losing streaks and risk of ruin',
    summary: 'Every system has runs of losses. Whether you survive them depends almost entirely on how much you risk per trade.',
    minutes: 5,
    blocks: [
      p('Wins and losses come in clumps. **Risk of ruin** is the chance that a losing run takes the account down so far that you cannot continue. Over about 100 trades, plan for a longest losing run of:'),
      ul(
        'Win rate 60%: five or six.',
        'Win rate 50%: seven.',
        'Win rate 40%: nine or ten.',
        'Win rate 30%: thirteen or more.',
      ),
      p('Run the simulation a few times: same system, very different paths.'),
      widget('expectancy-sim'),
      worked('Ten losses in a row', 'Risking 1%: down 9.6%, needs 11% to recover.', 'Risking 2%: down 18%, needs 22%.', 'Risking 5%: down 40%, needs 67%.', 'Risking 10%: down 65%, needs 187%. The account is finished.'),
      p('Same system, same streak; only the size changed. That is why the 1% rule exists.'),
      h('The Kelly criterion'),
      formula('Kelly fraction = win rate - (1 - win rate) / reward-to-risk', '50% win rate, 2 to 1 reward: 0.5 - 0.5 / 2 = 0.25, or 25% per trade.'),
      p('**Kelly** gives the fastest-growing bet size if you know your edge exactly. You do not, and estimates are usually optimistic, so full Kelly leads to ruin. The lesson is the direction: more edge justifies more risk, no edge justifies none.'),
      ol(
        '**Per trade**: 1% or less while learning.',
        '**Per day**: stop at about three times that.',
        '**Per month**: down 10% from the peak, halve size. Down 20%, stop and review on paper.',
      ),
      warn('The streak will come', 'Traders size up after a winning run, just before the losing run arrives. Keep risk a fixed percentage so it shrinks as the account falls.'),
      note('In this app', 'Analytics shows your longest losing run and maximum drawdown. Compare them with the list above.'),
    ],
  },
]);

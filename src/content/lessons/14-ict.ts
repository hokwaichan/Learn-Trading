import { chart, defineModule, gallery, h, img, join, level, made, mark, note, ohlc, ol, p, ul, walk, warn, widget, worked, zone } from './helpers';

export const ict = defineModule(14, 'ict', 'ICT concepts', 'Sessions and kill zones, the daily cycle of accumulation, manipulation and distribution, and the optimal trade entry.', [
  {
    id: 'sessions-and-kill-zones',
    title: 'Sessions and kill zones',
    summary: 'When you trade matters as much as what you trade. The day has three sessions, and most of the movement happens in a few hours of them.',
    minutes: 5,
    blocks: [
      p('**ICT** (Inner Circle Trader) adds **time** to smart money concepts: markets behave differently at different hours, so setups are only taken in certain windows.'),
      gallery(
        [
          ['tokyo-exchange', 'Asia: Tokyo'],
          ['hong-kong-exchange', 'Asia: Hong Kong'],
          ['london-exchange', 'London'],
          ['nasdaq-marketsite', 'New York'],
        ],
        'The trading day follows business hours around the world: Asia, then London, then New York.',
      ),
      img('time-zones', 'A world map divided into coloured time zones', 'World time zones. When one financial centre closes, the next opens.'),
      ul(
        '**Asia** (about 7pm to 4am New York time): quietest, often a narrow range.',
        '**London** (3am to noon): volume arrives; the high or low of the day often forms early.',
        '**New York** (8am to 5pm): busiest while London is still open. Most US news comes at 8:30am.',
      ),
      chart(
        made(
          join(
            ohlc([
              [100, 100.4, 99.7, 100.2],
              [100.2, 100.5, 99.8, 100],
              [100, 100.3, 99.6, 99.9],
              [99.9, 100.4, 99.7, 100.3],
              [100.3, 100.6, 99.9, 100.1],
              [100.1, 100.5, 99.8, 100.4],
              [100.4, 100.6, 99.9, 100],
              [100, 100.3, 99.7, 100.2],
            ]),
            ohlc([
              [100.2, 100.4, 98.6, 99],
              [99, 99.4, 98.2, 99.3],
              [99.3, 101, 99.1, 100.8],
              [100.8, 102.2, 100.6, 102],
              [102, 102.6, 101.5, 101.8],
              [101.8, 102.4, 101.2, 102.2],
            ]),
            ohlc([
              [102.2, 103.8, 101.9, 103.5],
              [103.5, 105.2, 103.2, 105],
              [105, 105.6, 104.2, 104.6],
              [104.6, 106, 104.4, 105.8],
              [105.8, 106.2, 105, 105.3],
              [105.3, 105.7, 104.8, 105.5],
            ]),
          ),
          'One day, one candle per hour. Asia builds a tight range, London sweeps its low and reverses, New York continues. The low of the day came in the London kill zone.',
          [zone(0, 100.7, 7, 99.5, 'Asia: quiet range'), mark(9, 'London: sweep of the Asian low', 97.6), mark(15, 'New York: continuation')],
        ),
      ),
      h('Kill zones'),
      p('A **kill zone** is a window when the important move of the day tends to begin. In New York time:'),
      ul(
        '**London**: 2am to 5am.',
        '**New York**: 7am to 10am.',
        '**London close**: 10am to noon, when the morning move often partly reverses.',
        '**Asia**: 8pm to midnight, mostly for yen and Australian dollar pairs.',
      ),
      ol(
        'Moves on high volume are more likely to continue.',
        'Trading one kill zone means three hours of screen time, not twelve.',
        'Session highs and lows are liquidity; the Asian range is a common London target.',
      ),
      warn('Crypto runs all night, but not evenly', 'Bitcoin trades around the clock, yet its busiest hours are still the London and New York overlap. Weekend moves are thin and reverse more often.'),
      note('In this app', 'On an intraday chart open Overlays and switch on Sessions or Kill zones. Times are converted from New York time, including daylight saving.'),
    ],
  },
  {
    id: 'power-of-three',
    title: 'The power of three',
    summary: 'Accumulation, manipulation, distribution: a simple model of how a day or a week unfolds, and why the first move is often the wrong one.',
    minutes: 5,
    blocks: [
      p('On an up day price usually opens, dips to make the low first, then travels up to close near the high. ICT calls this the **power of three**, or AMD.'),
      ol(
        '**Accumulation**: sideways near the open; orders build on both sides.',
        '**Manipulation**: a break the wrong way that triggers stops, the **Judas swing**.',
        '**Distribution**: the real move, through the range and on into the close.',
      ),
      chart(
        made(
          join(
            ohlc([
              [100, 100.5, 99.6, 100.2],
              [100.2, 100.6, 99.8, 100],
              [100, 100.4, 99.7, 100.3],
              [100.3, 100.6, 99.9, 100.1],
              [100.1, 100.5, 99.8, 100.2],
              [100.2, 100.4, 99.7, 99.9],
            ]),
            ohlc([
              [99.9, 100, 98.8, 99],
              [99, 99.3, 98.1, 98.4],
              [98.4, 99.6, 98.2, 99.5],
            ]),
            walk([99.5, 104.5, 103.6, 107], { per: 5, seed: 71, noise: 0.003 }),
          ),
          'A quiet range, a drop below it that makes the low of the day, then a steady rise. Anyone who sold the breakdown was on the wrong side.',
          [zone(0, 100.7, 5, 99.5, 'Accumulation'), mark(7, 'Manipulation: the false move', 97.4), mark(18, 'Distribution: the real move')],
        ),
      ),
      ul(
        '**Start with a bias** from the higher timeframe; the model is useless without one.',
        '**Do not trade the first breakout** of the opening range. If you expect an up day, buy after the early drop fails.',
        '**Look for it in the kill zones.**',
        '**It scales**: a quiet Monday, a false move midweek, the real move into Friday.',
      ),
      warn('A model, not a schedule', 'Many days trend with no false move, and many chop. When your bias is wrong, the "manipulation" is the real move. A stop below the manipulation low keeps a wrong bias cheap.'),
    ],
  },
  {
    id: 'optimal-trade-entry',
    title: 'The optimal trade entry',
    summary: 'A specific Fibonacci zone, 62% to 79% of the way back, that ICT traders wait for before joining a move.',
    minutes: 5,
    blocks: [
      p('The **optimal trade entry** (OTE) is the zone between the 62% and 79% retracements of a move, with 70.5% as the ideal spot.'),
      chart(
        made(walk([100, 120, 106, 126], { seed: 81 }), 'A rise from 100 to 120. The OTE zone is a pullback to between 107.6 (62%) and 104.2 (79%). Price reaches it, turns, and makes a new high.', [
          zone(5, 107.6, 13, 104.2, 'OTE zone: 62% to 79%'),
          level(110, '50%: equilibrium'),
          mark(0, 'Start of the move', 98.4),
          mark(5, 'End of the move'),
        ]),
      ),
      ul(
        '**Deep in discount**: below the 50% line, the cheaper half.',
        '**Close stop**: just beyond the start of the move.',
        '**Far target**: the end of the move and beyond, often 3 to 1 or better.',
      ),
      worked('An OTE long', 'The move ran from 100 to 120.', 'Entry at 70.5%: 120 - 20 x 0.705 = 105.9.', 'Stop just below the start: 99.5. Risk: 6.4.', 'Target the high at 120: about 2.2 to 1. The 127% extension at 125.4: about 3 to 1.'),
      ol(
        'Only after a move that broke structure.',
        'Draw low to high in an uptrend, high to low in a downtrend.',
        'Enter where an order block or fair value gap overlaps the zone, ideally in a kill zone.',
      ),
      warn('The cost of waiting', 'Strong trends often pull back only to 38% or 50%, so you miss them. And a 70% pullback is nearly a reversal: wait for the lower timeframe to turn, and keep the stop.'),
    ],
  },
  {
    id: 'breakers-and-mitigation',
    title: 'Breaker and mitigation blocks',
    summary: 'What happens to an order block that fails. In ICT terms it does not disappear: it changes sides.',
    minutes: 5,
    blocks: [
      p('When price runs straight through an order block, ICT relabels it, the same logic as support turning into resistance.'),
      chart(
        made(walk([108, 103.6, 109, 104, 111.5, 99, 103.4, 95], { seed: 91 }), 'Buyers defend the zone near 104 twice. After a higher high, price falls through it. The retest from below fails at the same prices: the block is now a breaker.', [
          zone(5, 104.6, 35, 103.2, 'Failed block, now a breaker'),
          mark(23, 'Higher high: stops taken'),
          mark(35, 'Retest from below'),
        ]),
      ),
      ul(
        '**Order block**: the origin of a move that broke structure. Trade its first return.',
        '**Breaker block**: a failed order block, after price first swept liquidity. Trapped buyers sell at break-even on the retest.',
        '**Mitigation block**: a failed block with no sweep first. Same trade, lower confidence.',
      ),
      ol(
        'Mark the block when price closes through it.',
        'Wait for a return from the other side.',
        'Enter on rejection, stop beyond the far edge.',
        'Target the next liquidity pool.',
      ),
      note('You have seen this before', 'This is role reversal from the Support and resistance lesson, given a name: broken support tends to become resistance.'),
      warn('Naming is not predicting', 'ICT has a label for a zone that holds and one for a zone that fails, so it can describe any outcome. Decide before price arrives which outcome you are trading and where you are wrong.'),
    ],
  },
  {
    id: 'ict-trade-plan',
    title: 'An ICT-style trade plan',
    summary: 'The concepts as a routine you could follow every day: bias, time, liquidity, entry, risk. Plus a frank look at what the method cannot do.',
    minutes: 6,
    blocks: [
      p('Each step either moves you forward or ends the day with no trade.'),
      ol(
        '**Bias**: on the daily and 4-hour, which liquidity is price reaching for next? No answer, no trade.',
        '**Time**: wait for a kill zone.',
        '**Liquidity**: wait for a sweep against your bias, such as the Asian low for a long.',
        '**Shift**: a change of character on the 5 or 15-minute chart.',
        '**Entry**: a limit order in the fair value gap or order block, ideally in the OTE zone.',
        '**Risk**: stop beyond the sweep, 1% of the account or less, target the liquidity opposite.',
      ),
      p('The stop distance, not your confidence, decides the size. Try a tight and a wide stop:'),
      widget('position-size'),
      worked('A day that fits the plan', 'Bias bullish; yesterday’s high at 105 untouched.', 'At 3am price dips under the Asian low of 99.5 to 98.2 and closes back above.', 'The 15-minute chart breaks its swing high at 100.6, leaving a gap from 99.6 to 100.1.', 'Buy 99.9, stop 98, risk 1.9. $10,000 at 1%: $100 / 1.9 = 52 units.', 'Target 105: about 2.7 to 1.'),
      h('Right and sceptical'),
      ul(
        '**Right**: wait for price to come to you, trade active hours, know where stops are, define risk first.',
        '**The story**: an algorithm hunting retail stops cannot be proven from a chart.',
        '**The flexibility**: almost any chart can be explained afterwards.',
        '**The evidence**: online results are selected winners; there is no independent record.',
      ),
      warn('Most day traders lose money', 'Studies of real brokerage accounts find most day traders lose over time, whatever the method. Prove any system on paper first.'),
    ],
  },
]);

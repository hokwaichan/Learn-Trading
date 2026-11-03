import { chart, defineModule, h, level, made, mark, note, ol, p, seg, ul, walk, warn, zone } from './helpers';

export const marketStructure = defineModule(3, 'market-structure', 'Market structure', 'Trends, support and resistance, trend lines, and telling a real breakout from a fake one.', [
  {
    id: 'trends',
    title: 'Trends: higher highs and lower lows',
    summary: 'A trend is defined by its turning points. Learn to read them and you can say which way a market is going.',
    minutes: 5,
    blocks: [
      p('Price moves in waves. Each turn is a **swing**: a **swing high** is a peak, a **swing low** a trough. The pattern they make is the **market structure**.'),
      chart(
        made(walk([100, 108, 104, 114, 109, 120, 115, 126], { seed: 21 }), 'An uptrend: every peak and every trough is higher than the one before.', [
          mark(5, 'High'),
          mark(11, 'Higher low', 102.6),
          mark(17, 'Higher high'),
          mark(23, 'Higher low', 107.6),
          mark(29, 'Higher high'),
          mark(35, 'Higher low', 113.6),
        ]),
      ),
      ul(
        '**Uptrend**: higher highs and higher lows. Buyers pay more each time.',
        '**Downtrend**: lower highs and lower lows. Each bounce fails sooner.',
        '**Range**: highs and lows roughly level. Markets spend much of their time here, and trend methods lose money in it.',
      ),
      h('When a trend ends'),
      p('The first warning is a **lower high**: a bounce that cannot reach the last peak. The trend is broken when price then closes below the last higher low, a **break of structure**.'),
      ol(
        'Mark the last few swing highs and lows.',
        'Rising highs and lows: uptrend. Falling: downtrend. Neither: range.',
        'In an uptrend, watch the latest swing low. A close below it changes the trend.',
      ),
      note('The trend is your friend', 'Trading with the trend puts the odds on your side. Joining a move that is under way is easier than picking the exact top or bottom.'),
      warn('Trends depend on the timeframe', 'A market can rise on the daily chart and fall on the 15-minute chart at the same time. Read the structure on the timeframe you trade.'),
    ],
  },
  {
    id: 'support-and-resistance',
    title: 'Support and resistance',
    summary: 'Prices where buyers or sellers have shown up before, and are likely to again.',
    minutes: 5,
    blocks: [
      p('**Support** is a price where falls have stopped before because buyers appeared. **Resistance** is where rises have stopped because sellers appeared. Traders remember these prices, so orders cluster there again.'),
      chart(
        made(walk([104, 110, 101, 110.4, 100.6, 109.6, 101.2, 110.2, 105], { seed: 14 }), 'A range between support near 101 and resistance near 110. Price turned at each level several times.', [
          level(110.3, 'Resistance: sellers appear here'),
          level(100.8, 'Support: buyers appear here'),
        ]),
      ),
      p('Treat a level as a **zone**, not an exact line. A wick that pokes through and comes back has not broken it.'),
      h('What makes a level strong'),
      ul(
        '**More touches**: three turns matter more than one.',
        '**Longer timeframes**: a daily level outweighs a 5-minute one.',
        '**Sharp reactions**: price that left quickly shows strong interest.',
        '**Round numbers**: 100 or 50,000 attract orders because people think in round numbers.',
      ),
      h('Role reversal'),
      p('Broken resistance often becomes support, and broken support becomes resistance. A return to a broken level is a **retest**.'),
      note('Using levels', 'Buy near support with a stop-loss just below it, or take profit just before resistance. Levels make the risk easy to define.'),
      warn('Every level breaks eventually', 'Each test uses up some of the waiting orders. Never assume a level will hold; that is what the stop is for.'),
    ],
  },
  {
    id: 'trend-lines',
    title: 'Trend lines',
    summary: 'A sloping line through the swing lows or highs shows the pace of a trend and where it may find support.',
    minutes: 4,
    blocks: [
      p('A **trend line** is support or resistance on a slope: a line through the swing lows of an uptrend, or the swing highs of a downtrend. It shows the pace of the trend and where the next pullback may stop.'),
      chart(
        made(walk([100, 108, 104, 114, 109.5, 120, 115, 126, 120.5, 127], { seed: 21 }), 'An uptrend line through the swing lows. Each pullback found buyers near the line.', [
          seg(11, 103.2, 53, 123.2, 'Uptrend line'),
          mark(23, 'Third touch confirms', 107.6),
        ]),
      ),
      ol(
        'Pick two clear swing lows (or highs in a downtrend) and draw through them.',
        'Extend the line to the right.',
        'A third touch that holds confirms it. Draw your own with the trend line tool on the Charts page.',
      ),
      p('A parallel line through the swing highs makes a **channel**: the lower line acts as support, the upper as resistance.'),
      p('A close through a trend line means the trend has slowed, not necessarily reversed. Look for a lower high and lower low before calling a reversal.'),
      warn('Trend lines are subjective', 'Wicks or bodies, which swings: two traders draw different lines. Be consistent, and never move a line to fit what you hope.'),
      note('Steeper is weaker', 'Very steep lines cannot last. Gentler lines with more touches are more reliable.'),
    ],
  },
  {
    id: 'breakouts-and-fakeouts',
    title: 'Breakouts and fakeouts',
    summary: 'When price leaves a range it can start a new move, or snap straight back. Volume and the retest help tell them apart.',
    minutes: 6,
    blocks: [
      p('A **breakout** is price moving clearly beyond support or resistance, often after a quiet range. The orders holding price in are used up, and a new move can start.'),
      chart(
        made(walk([104, 110, 102, 110.3, 103, 110.1, 105, 113.5, 110.6, 118, 122], { seed: 30, volumeSpikes: [39, 40] }), 'A real breakout. Price closes above resistance on heavy volume, comes back to retest the level from above, holds, and continues.', [
          level(110.3, 'Resistance, then support'),
          mark(40, 'Breakout on heavy volume'),
          mark(47, 'Retest holds', 109.2),
        ]),
      ),
      p('A **fakeout** is a poke beyond the level that snaps back inside. Breakout buyers are trapped, and their stops push price further back.'),
      chart(
        made(walk([104, 110, 102, 110.2, 103, 110.4, 104, 111.8, 108, 103, 100], { seed: 33 }), 'A fakeout. Price pushes above resistance but cannot hold there and falls back into the range.', [
          level(110.3, 'Resistance'),
          mark(41, 'Breaks above...'),
          zone(42, 112.4, 54, 99, 'falls back inside'),
        ]),
      ),
      h('Telling them apart'),
      ul(
        '**A close, not a wick**, beyond the level.',
        '**Volume** clearly higher than recent candles.',
        '**The retest**: old resistance holding as support confirms it.',
        '**The bigger trend**: breakouts with it succeed more often.',
      ),
      ul(
        '**Enter on the breakout**: in early, but caught by more fakeouts.',
        '**Wait for the retest**: fewer fakeouts and a closer stop, but sometimes you miss the move.',
      ),
      note('Where the stop goes', 'Just back inside the range, below the broken level. If price returns there, the breakout has failed.'),
      warn('Do not chase', 'The further you buy from the level, the larger the stop and the worse the trade.'),
    ],
  },
]);

import { chart, defineModule, h, level, made, mark, note, ol, p, seg, ul, walk, warn, zone } from './helpers';

export const marketStructure = defineModule(3, 'market-structure', 'Market structure', 'Trends, support and resistance, trend lines, and telling a real breakout from a fake one.', [
  {
    id: 'trends',
    title: 'Trends: higher highs and lower lows',
    summary: 'A trend is defined by its turning points. Learn to read them and you can say which way a market is going.',
    minutes: 7,
    blocks: [
      p('Prices never move in a straight line. They advance, pull back, and advance again. Each place where price turns is a **swing**: a **swing high** is a peak with lower prices either side, and a **swing low** is a trough with higher prices either side. The pattern of these swings is called **market structure**.'),
      h('Uptrend'),
      p('In an **uptrend** each swing high is above the previous one (a **higher high**) and each swing low is above the previous one (a **higher low**). Buyers are willing to pay more each time, and step in sooner on each dip.'),
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
      h('Downtrend'),
      p('A **downtrend** is the mirror image: **lower highs** and **lower lows**. Each bounce fails sooner and each drop goes further.'),
      h('Range'),
      p('When highs and lows are roughly level, the market is moving sideways in a **range** (also called consolidation). Markets spend a large share of their time doing this, and trend-following methods lose money in it.'),
      h('When a trend ends'),
      p('An uptrend is intact as long as it keeps making higher lows. The first warning is a **lower high**: a bounce that fails to reach the previous peak. The trend is broken when price then falls below the most recent higher low. This is called a **break of structure**.'),
      ol(
        'Mark the last few swing highs and swing lows.',
        'Higher highs and higher lows: uptrend. Lower highs and lower lows: downtrend. Neither: range.',
        'Note the most recent swing low (in an uptrend). A close below it means the trend has changed.',
      ),
      note('The trend is your friend', 'Trades in the direction of the trend have the odds on their side. A beginner mistake is trying to pick the exact top or bottom. It is easier to join a move that is already under way.'),
      warn('Trends depend on the timeframe', 'A market can be in an uptrend on the daily chart and a downtrend on the 15-minute chart at the same moment. Decide which timeframe you are trading and read the structure there.'),
    ],
  },
  {
    id: 'support-and-resistance',
    title: 'Support and resistance',
    summary: 'Prices where buyers or sellers have shown up before, and are likely to again.',
    minutes: 7,
    blocks: [
      p('**Support** is a price level where falling prices have stopped and turned up before, because enough buyers appeared there. **Resistance** is a level where rising prices have stopped and turned down, because enough sellers appeared.'),
      p('These levels exist because traders remember. People who missed buying at a low hope for a second chance there. People who bought at a high and watched it fall are relieved to sell when price returns. Many orders end up clustered around the same prices.'),
      chart(
        made(walk([104, 110, 101, 110.4, 100.6, 109.6, 101.2, 110.2, 105], { seed: 14 }), 'A range between support near 101 and resistance near 110. Price turned at each level several times.', [
          level(110.3, 'Resistance: sellers appear here'),
          level(100.8, 'Support: buyers appear here'),
        ]),
      ),
      h('Zones, not lines'),
      p('Price rarely turns at exactly the same number. Treat support and resistance as a **zone** a little way either side of the level. A wick that pokes through and comes back has not broken it.'),
      h('What makes a level strong'),
      ul(
        '**More touches**: a level that has turned price three times matters more than one that did it once.',
        '**Longer timeframes**: a level on the daily chart outweighs one on the 5-minute chart.',
        '**Sharp reactions**: price that left the level quickly shows strong interest there.',
        '**Round numbers**: levels such as 100 or 50,000 attract orders simply because people think in round numbers.',
      ),
      h('Role reversal'),
      p('When price breaks clearly above resistance, that level often becomes support afterwards, and broken support often becomes resistance. Traders who sold at the old ceiling and were wrong are keen to buy back at the same price. A return to a broken level is called a **retest**.'),
      note('Using levels', 'Levels give you places to plan around: buy near support with a stop-loss just below it, or take profit just before resistance. They make the risk on a trade easy to define.'),
      warn('Every level breaks eventually', 'Support holds until it does not. The more often a level is tested, the more of the waiting orders get used up. Never assume a level will hold; that is what the stop is for.'),
    ],
  },
  {
    id: 'trend-lines',
    title: 'Trend lines',
    summary: 'A sloping line through the swing lows or highs shows the pace of a trend and where it may find support.',
    minutes: 6,
    blocks: [
      p('Support and resistance are horizontal. A **trend line** is the same idea on a slope: a straight line joining the swing lows of an uptrend, or the swing highs of a downtrend. It shows how fast the trend is moving and roughly where the next pullback might stop.'),
      h('Drawing one'),
      ol(
        'In an uptrend, find two clear swing lows and draw a line through them, extended to the right.',
        'In a downtrend, do the same through two swing highs.',
        'Two points only draw a line. A third touch that holds is what confirms it.',
      ),
      chart(
        made(walk([100, 108, 104, 114, 109.5, 120, 115, 126, 120.5, 127], { seed: 21 }), 'An uptrend line through the swing lows. Each pullback found buyers near the line.', [
          seg(11, 103.2, 53, 123.2, 'Uptrend line'),
          mark(23, 'Third touch confirms', 107.6),
        ]),
      ),
      p('You can draw this yourself: on the Charts page pick the trend line tool, click one swing low, then another.'),
      h('Channels'),
      p('If you draw a second line parallel to the trend line through the swing highs, you get a **channel**: a band price is travelling within. The lower line acts as support and the upper as resistance.'),
      h('When a trend line breaks'),
      p('A close clearly through a trend line says the trend has slowed, not necessarily reversed. Price may simply continue at a gentler slope or go sideways. Treat a break as a reason to tighten up or take some profit, and look to the swing structure (a lower high and lower low) for a real reversal.'),
      warn('Trend lines are subjective', 'Two traders will draw slightly different lines on the same chart, depending on whether they use wicks or bodies and which swings they pick. Be consistent, and do not adjust a line just to make it fit what you hope will happen.'),
      note('Steeper is weaker', 'A very steep trend line cannot last; price is rising too fast to keep it up. Gentler lines with more touches are more reliable.'),
    ],
  },
  {
    id: 'breakouts-and-fakeouts',
    title: 'Breakouts and fakeouts',
    summary: 'When price leaves a range it can start a new move, or snap straight back. Volume and the retest help tell them apart.',
    minutes: 8,
    blocks: [
      p('A **breakout** is price moving clearly beyond a support or resistance level, usually after a period of going sideways. It matters because the orders that were holding price in have been used up, and a new move can begin.'),
      chart(
        made(walk([104, 110, 102, 110.3, 103, 110.1, 105, 113.5, 110.6, 118, 122], { seed: 30, volumeSpikes: [39, 40] }), 'A real breakout. Price closes above resistance on heavy volume, comes back to retest the level from above, holds, and continues.', [
          level(110.3, 'Resistance, then support'),
          mark(40, 'Breakout on heavy volume'),
          mark(47, 'Retest holds', 109.2),
        ]),
      ),
      h('Fakeouts'),
      p('A **fakeout** (or false breakout) is when price pokes beyond the level and then reverses back inside the range. Traders who bought the breakout are trapped, and their stop-losses add to the move back down.'),
      chart(
        made(walk([104, 110, 102, 110.2, 103, 110.4, 104, 111.8, 108, 103, 100], { seed: 33 }), 'A fakeout. Price pushes above resistance but cannot hold there and falls back into the range.', [
          level(110.3, 'Resistance'),
          mark(41, 'Breaks above...'),
          zone(42, 112.4, 54, 99, 'falls back inside'),
        ]),
      ),
      h('Telling them apart'),
      ul(
        '**A close, not a wick.** A candle that closes beyond the level is stronger evidence than a wick that pokes through.',
        '**Volume.** A real breakout usually comes with clearly higher volume than recent candles. A breakout on light volume is suspect.',
        '**The retest.** After breaking out, price often returns to the level. If it holds there (old resistance acting as support), the breakout is confirmed.',
        '**The bigger trend.** Breakouts in the direction of the larger trend succeed more often than those against it.',
      ),
      h('Two ways to trade a breakout'),
      ul(
        '**Enter on the breakout candle.** You are in early, but you will be caught by more fakeouts.',
        '**Wait for the retest.** Fewer fakeouts and a nearby place for your stop, but sometimes price never comes back and you miss the move.',
      ),
      note('Where the stop goes', 'For a breakout above resistance, a common stop-loss is just back inside the range, below the broken level. If price returns there, the breakout has failed and you want to be out.'),
      warn('Most breakouts fail or retest', 'Do not chase a candle that has already run a long way past the level. The further you buy from the level, the larger your stop has to be and the worse the trade.'),
    ],
  },
]);

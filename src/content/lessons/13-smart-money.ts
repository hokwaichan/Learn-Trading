import { chart, defineModule, h, join, level, made, mark, note, ohlc, ol, p, seg, ul, walk, warn, worked, zone } from './helpers';

export const smartMoney = defineModule(13, 'smart-money', 'Smart money concepts', 'Structure breaks, liquidity, order blocks and fair value gaps: the vocabulary of SMC, taught with clear rules and an honest view of its limits.', [
  {
    id: 'structure-bos-choch',
    title: 'What SMC is, and breaks of structure',
    summary: 'Smart money concepts rename and sharpen ideas you already know. Start with the two labels every SMC chart is covered in: BOS and CHoCH.',
    minutes: 6,
    blocks: [
      p('**Smart money concepts** (SMC) read charts on one idea: large institutions move markets, need many orders on the other side, and leave marks a small trader can follow. It grew from the teaching of a trader known as ICT.'),
      note('Read this first', 'Much of SMC is older price action with precise new names: support becomes "demand", a false breakout a "liquidity sweep". The story about what institutions intend cannot be checked from a chart, and no study shows SMC beats simpler methods. Learn it as clear vocabulary, and test it.'),
      ul(
        'A **break of structure** (BOS) is a close beyond the last swing in the trend direction. The trend continues.',
        'A **change of character** (CHoCH) is the first close beyond a swing against the trend, such as below the last higher low in an uptrend. The trend may be turning.',
      ),
      chart(
        made(walk([100, 108, 104, 114, 109, 120, 113, 118, 107, 110, 102], { seed: 17 }), 'An uptrend breaks structure upward twice. Then a lower high forms, price closes below the last higher low (the change of character), and the next break confirms a downtrend.', [
          seg(5, 108.6, 14, 108.6, 'BOS'),
          seg(17, 114.6, 26, 114.6, 'BOS up'),
          seg(35, 112.5, 44, 112.5, 'CHoCH'),
          seg(47, 106.5, 56, 106.5, 'BOS down'),
        ]),
      ),
      ol(
        'Only a **close** beyond the level counts. A wick through it may be the opposite, a sweep.',
        'Pick swing points one way and keep to it. Three candles either side gives fewer, more meaningful breaks.',
        'Read structure from the higher timeframe down.',
      ),
      p('A BOS is permission to keep trading with the trend. A CHoCH is a reason to stop and wait, not yet to trade the other way: many lead only to a deeper pullback.'),
      note('In this app', 'On the Charts page open Overlays and switch on Market structure. Swing points get a small arrow, and each break is labelled BOS or CHoCH using exactly the rules above, with swings of three candles either side.'),
    ],
  },
  {
    id: 'liquidity',
    title: 'Liquidity: where the stops are',
    summary: 'Stop orders gather at obvious places. Price is drawn to them, and often reverses just after reaching them.',
    minutes: 6,
    blocks: [
      p('In SMC, liquidity means a price where many orders wait. Above an obvious high sit the stops of short sellers and the orders of breakout buyers; below an obvious low, the stops of buyers. Such a cluster is a **liquidity pool**.'),
      ul(
        '**Equal highs and lows**: the level looks strong, so stops gather just beyond.',
        '**Previous day, week or session highs and lows**: levels everyone sees.',
        '**Trend lines and round numbers**: where textbooks say to put stops.',
      ),
      p('Above the market is **buy-side liquidity**; below is **sell-side liquidity**. A big seller needs many buyers at once, so price often pokes just beyond a high, triggers the orders and turns: a **liquidity sweep**, or stop hunt. On the chart it is a wick beyond and a close back inside.'),
      chart(
        made(
          join(
            walk([104, 110, 105, 110.2, 105.5, 110.1, 106, 109.5], { seed: 23 }),
            ohlc([
              [109.5, 112, 109, 109.2],
              [109.2, 109.4, 106, 106.5],
              [106.5, 107, 103, 103.5],
              [103.5, 104, 101, 101.5],
              [101.5, 102.5, 100.5, 102],
              [102, 102.5, 99.5, 100],
            ]),
          ),
          'Three equal highs near 110 make an obvious resistance level. Price spikes through it to 112, closes back below, and falls. Traders who bought the breakout, and shorts who were stopped out, provided the buying that sellers needed.',
          [level(110.4, 'Equal highs: stops rest above'), mark(42, 'Sweep: wick above, close back below')],
        ),
      ),
      ul(
        '**As a target**: the pool above the nearest high is a natural place to take profit on a long.',
        '**As a warning**: a stop exactly where everyone puts theirs will be tested. Leave room, or wait for the sweep.',
        '**As a setup**: a sweep then a lower-timeframe CHoCH is the core SMC reversal, at the end of this module.',
      ),
      warn('A sweep and a breakout start the same way', 'Only the close tells them apart: back inside is a sweep, held beyond is a break. Do not trade the first tick through a level.'),
      note('The same event, three names', 'A fakeout, a Wyckoff spring or upthrust, and a liquidity sweep are the same thing seen by different schools.'),
    ],
  },
  {
    id: 'order-blocks',
    title: 'Order blocks',
    summary: 'The last candle against a strong move. SMC traders treat it as a zone where price is likely to react when it returns.',
    minutes: 5,
    blocks: [
      p('An **order block** is the last down candle before a strong rally that breaks structure (bullish), or the last up candle before a strong fall that does (bearish). The claim is that big buyers left orders there; plainly, it marks where a strong move began, and traders who missed it wait there, like ordinary support.'),
      chart(
        made(
          join(
            walk([112, 106, 109, 103], { seed: 31 }),
            ohlc([
              [103, 103.6, 101.8, 102.2],
              [102.2, 105.5, 102, 105.2],
              [105.2, 108.4, 105, 108],
              [108, 110.6, 107.6, 110.2],
              [110.2, 111.5, 109.4, 111],
              [111, 111.4, 108.5, 109],
              [109, 109.3, 106, 106.4],
              [106.4, 106.8, 103.2, 103.8],
              [103.8, 107, 103.4, 106.6],
              [106.6, 110, 106.2, 109.6],
              [109.6, 113, 109.2, 112.5],
            ]),
          ),
          'The last down candle before the rally is the order block (101.8 to 103.6). The rally closes above the previous swing high, breaking structure. Price later returns to the block, holds, and rises again.',
          [zone(18, 103.6, 28, 101.8, 'Bullish order block'), seg(11, 109.4, 21, 109.4, 'Break of structure'), mark(25, 'Return to the block', 100.9)],
        ),
      ),
      ul(
        '**It led to a break of structure.**',
        '**The move away was fast**: large candles with little overlap, **displacement**, often leaving a fair value gap.',
        '**It is fresh**: only the first return counts; a revisited block is **mitigated**.',
        '**It took liquidity first**: a block right after a sweep is stronger.',
      ),
      worked('A long from a bullish order block', 'The block spans 101.8 to 103.6. Price has broken structure and is now falling back.', 'Entry: a limit order at the top of the block, 103.6, or wait for a lower-timeframe change of character inside it.', 'Stop-loss: just below the block, 101.4. Risk: 2.2.', 'Target: the high that the rally made, 111.5. Reward: 7.9, about 3.6 to 1.'),
      warn('Most candles are not order blocks', 'Mark every opposite candle and price always "reacts" to one. Use the strict rule and trade only the first return. Many still fail.'),
      note('In this app', 'Overlays, Order blocks marks them by this rule and removes each one once price has come back to it.'),
    ],
  },
  {
    id: 'fair-value-gaps',
    title: 'Fair value gaps',
    summary: 'A three-candle pattern that shows price moved too fast for normal two-sided trading. Price often comes back to it.',
    minutes: 5,
    blocks: [
      p('A **fair value gap** (FVG), or imbalance, is a range price moved through too fast to trade both ways. In three candles, a bullish gap has the **low of the third candle above the high of the first**; only the middle candle crossed that space. A bearish gap is the mirror image.'),
      chart(
        made(
          join(
            walk([100, 103, 101.5], { seed: 41 }),
            ohlc([
              [101.5, 102.2, 101, 102],
              [102, 106.5, 101.9, 106.2],
              [106.2, 107.5, 104.4, 107],
              [107, 108.5, 106.5, 108],
              [108, 108.6, 106, 106.4],
              [106.4, 106.8, 103.6, 104],
              [104, 107, 103.2, 106.8],
              [106.8, 109.5, 106.4, 109.2],
              [109.2, 111, 108.8, 110.6],
            ]),
          ),
          'The first candle tops out at 102.2 and the third bottoms at 104.4, so the range between was traded only by the large middle candle. Price later dips back into that range, finds buyers, and continues up.',
          [zone(13, 104.4, 20, 102.2, 'Fair value gap'), mark(13, 'Displacement candle'), mark(17, 'Price returns into the gap', 101.6)],
        ),
      ),
      p('The first pullback after a sharp move tends to stop inside the candle that caused it, because traders who missed it wait there.'),
      ul(
        '**Entry on the return**: in an uptrend, buy as price dips into a bullish gap, often at its midpoint.',
        '**Stop beyond the gap**: if price crosses it completely, the gap is **filled** and the idea is over.',
        '**With structure**: a gap from the move that broke structure matters most. Old unfilled higher-timeframe gaps are used as targets.',
      ),
      warn('Gaps are everywhere on low timeframes', 'A 1-minute chart prints dozens a day. Prefer gaps on 15-minute charts and up, from a clearly large candle, with the higher-timeframe trend.'),
      note('In this app', 'Overlays, Fair value gaps shades each open gap and labels its direction. Gaps disappear from the chart once they are filled.'),
    ],
  },
  {
    id: 'premium-and-discount',
    title: 'Premium and discount',
    summary: 'Split the current range in half. Buy in the lower half, sell in the upper half. A simple filter that stops you chasing.',
    minutes: 4,
    blocks: [
      p('Between the recent swing low and high is the **dealing range**; its midpoint is the **equilibrium**. Above it is **premium**, expensive for the range; below it **discount**, cheap.'),
      chart(
        made(walk([100, 120, 108, 124], { seed: 52 }), 'The move from 100 to 120 sets the range. Its midpoint is 110. The pullback goes below 110 into the discount half before the uptrend continues.', [
          level(120, 'Range high'),
          level(110, 'Equilibrium (50%)'),
          level(100, 'Range low'),
          zone(5, 110, 13, 100, 'Discount: look for longs here'),
        ]),
      ),
      ul(
        'In an uptrend, look for longs only in **discount**.',
        'In a downtrend, look for shorts only in **premium**.',
        'Take profit on the other side.',
      ),
      p('It is "buy low, sell high" made precise, and a filter: buying in premium means a far stop and a near target. Premium and discount say roughly where; an order block or gap in discount says exactly where.'),
      warn('The range has to be chosen', 'Use the swings of your trading timeframe, and redraw only when structure breaks, not when the result is inconvenient.'),
      note('Fibonacci in disguise', 'The equilibrium is the 50% retracement. The next module narrows discount to the 62% to 79% "optimal trade entry".'),
    ],
  },
  {
    id: 'smc-setup',
    title: 'Putting an SMC trade together',
    summary: 'Sweep, shift, return: the standard SMC reversal setup step by step, with the checks that keep it from becoming a story told after the fact.',
    minutes: 6,
    blocks: [
      p('The pieces of this module combine into one widely taught setup, in this order:'),
      ol(
        '**Sweep.** Price takes an obvious low (or high) and closes back inside.',
        '**Shift.** A sharp move the other way closes beyond a swing: a CHoCH with displacement, usually leaving a fair value gap.',
        '**Return.** Price pulls back into that gap or order block. That is the entry.',
      ),
      chart(
        made(
          join(
            walk([112, 105, 108, 102.5, 105.5], { seed: 61 }),
            ohlc([
              [105.5, 105.6, 101.2, 103],
              [103, 107, 102.8, 106.8],
              [106.8, 109.6, 106.6, 109.3],
              [109.3, 109.8, 107.5, 108],
              [108, 108.3, 106, 106.3],
              [106.3, 109.5, 106.1, 109.2],
              [109.2, 112, 108.9, 111.6],
              [111.6, 114, 111, 113.5],
            ]),
          ),
          'A downtrend sweeps under its last low and closes back above it. Two strong candles follow, closing above the previous swing high and leaving a fair value gap. Price returns to the gap and the new uptrend begins.',
          [mark(24, '1. Sweep of the low', 100.2), seg(11, 108.4, 26, 108.4, '2. Change of character'), zone(25, 106.6, 31, 105.6, '3. Return to the gap: entry'), level(100.8, 'Stop: below the sweep')],
        ),
      ),
      worked('The trade in numbers', 'Entry in the gap at 106.2.', 'Stop-loss below the low of the sweep, at 100.8. Risk: 5.4.', 'First target: the high the downtrend started from, 112. Reward: 5.8, just over 1 to 1.', 'Second target: the next pool of liquidity above. Many traders close half at the first target and move the stop to the entry price.'),
      h('Checklist'),
      ul(
        'The higher timeframe agrees, or at least does not disagree.',
        'Real liquidity was taken: an obvious level, not a random wick.',
        'The shift closed beyond a swing with large candles.',
        'The entry is in discount (for a long).',
        'At least 2 to 1 to a realistic target. Above, the first target alone is not enough.',
      ),
      p('The winners are dramatic, which is why it is popular. Social media skips the times the return never comes or the gap fails. Every element needs judgement, so it is hard to test and easy to believe in.'),
      warn('Test it on charts you have not seen', 'Open Replay, pick a random date, switch on the overlays, and take only setups that meet every item on your checklist. Log each one in the Journal with the setup tag "SMC". After fifty trades the Analytics page will tell you whether it works in your hands. That number is worth more than any video.'),
    ],
  },
]);

import { chart, defineModule, formula, h, level, made, mark, note, ol, p, seg, ul, walk, warn } from './helpers';

export const chartPatterns = defineModule(4, 'chart-patterns', 'Chart patterns', 'Shapes that form over many candles and hint at a reversal or a continuation.', [
  {
    id: 'head-and-shoulders',
    title: 'Head and shoulders',
    summary: 'Three peaks with the middle one highest: the classic sign that an uptrend is running out of buyers.',
    minutes: 7,
    blocks: [
      p('A **chart pattern** is a shape formed by many candles. Like candle patterns they describe a struggle between buyers and sellers, only over a longer time. Patterns come in two families: **reversal patterns**, which suggest a trend is ending, and **continuation patterns**, which suggest a pause before the trend resumes.'),
      h('The shape'),
      p('The **head and shoulders** is a reversal pattern that forms at the top of an uptrend. It has three peaks:'),
      ol(
        'The **left shoulder**: a high, then a pullback.',
        'The **head**: a higher high, then a pullback to roughly the same low.',
        'The **right shoulder**: a lower high, about level with the left shoulder.',
      ),
      p('The line joining the two pullback lows is the **neckline**. The pattern is only complete when price closes below it.'),
      chart(
        made(walk([98, 112, 106, 118, 106.2, 112.5, 106, 99, 96], { seed: 41 }), 'Head and shoulders. The right shoulder is a lower high: buyers could not reach the previous peak. The break below the neckline completes it.', [
          mark(5, 'Left shoulder'),
          mark(17, 'Head'),
          mark(29, 'Right shoulder'),
          level(106, 'Neckline'),
          mark(38, 'Neckline breaks', 102.6),
        ]),
      ),
      h('Why it works'),
      p('It is the end of an uptrend seen through its structure. The head is a higher high, so the trend still looks healthy. The right shoulder is a **lower high**: the first sign buyers are weakening. The break of the neckline is the lower low that confirms it.'),
      h('Trading it'),
      ul(
        '**Entry**: after a close below the neckline, or on a retest of the neckline from below.',
        '**Stop-loss**: above the right shoulder.',
        '**Target**: measure the height from the neckline to the top of the head, and project that distance down from the neckline.',
      ),
      formula('Target = neckline - (head - neckline)', 'In the chart above: 106 - (118 - 106) = 94. This is a rough guide, not a promise.'),
      note('Inverse head and shoulders', 'The same pattern upside down, at the bottom of a downtrend, is a bullish reversal: three troughs with the middle one lowest, completed by a break above the neckline.'),
      warn('Wait for the neckline', 'Many would-be head and shoulders never complete. Price bounces off the neckline and the uptrend continues. Acting before the break means betting on a pattern that does not exist yet.'),
    ],
  },
  {
    id: 'double-tops-and-bottoms',
    title: 'Double tops and double bottoms',
    summary: 'Price tries the same level twice and fails. A simple reversal pattern built on support and resistance.',
    minutes: 6,
    blocks: [
      h('Double top'),
      p('A **double top** forms after a rise: price reaches a high, pulls back, rises to about the same high again, and fails. It looks like the letter M. The second failure shows that buyers could not push through resistance, and the pattern completes when price falls below the low between the two peaks.'),
      chart(
        made(walk([100, 115, 107, 115.3, 107, 101, 99], { seed: 52 }), 'A double top. Two failures at the same resistance, completed by the break below the middle low.', [
          mark(5, 'First top'),
          mark(17, 'Second top fails'),
          level(107, 'Support between the tops'),
          mark(26, 'Break confirms', 103.4),
        ]),
      ),
      h('Double bottom'),
      p('A **double bottom** is the reverse, after a fall: two lows at about the same level with a bounce between them, shaped like a W. It completes when price rises above the high of that bounce.'),
      chart(
        made(walk([116, 101, 109, 100.7, 109, 115, 118], { seed: 57 }), 'A double bottom. Sellers failed twice at the same support, then price broke above the middle high.', [
          mark(5, 'First bottom', 99.4),
          mark(17, 'Second bottom holds', 99.2),
          level(109, 'Resistance between the bottoms'),
          mark(27, 'Break confirms'),
        ]),
      ),
      h('Trading them'),
      ul(
        '**Entry**: on a close beyond the middle level (below it for a double top, above it for a double bottom).',
        '**Stop-loss**: beyond the two tops or bottoms.',
        '**Target**: the height of the pattern projected from the break. For the double top above: 107 - (115 - 107) = 99.',
      ),
      h('What makes one more reliable'),
      ul(
        'A clear trend leading into it. There has to be something to reverse.',
        'Reasonable spacing between the two peaks. Two peaks three candles apart are just noise.',
        'Lower volume on the second peak, showing less enthusiasm.',
      ),
      warn('Two touches are not a pattern yet', 'Price testing a high twice is extremely common in healthy uptrends, just before it breaks through. Until the middle level breaks, it is only a range.'),
      note('Triple tops and bottoms', 'The same idea with three attempts. More failures at a level make the eventual break more significant.'),
    ],
  },
  {
    id: 'triangles',
    title: 'Triangles',
    summary: 'Price coiling into a narrower and narrower range before it breaks out.',
    minutes: 7,
    blocks: [
      p('A **triangle** forms when the swings get smaller and smaller, so that lines drawn through the highs and the lows converge. Buyers and sellers are squeezing towards a decision. There are three kinds.'),
      h('Ascending triangle'),
      p('A flat top (resistance at the same price each time) with **rising lows**. Buyers are stepping in sooner on each dip while sellers defend one level. It usually breaks upwards.'),
      chart(
        made(walk([100, 110, 102, 110.2, 104.5, 110.1, 107, 110.3, 115.5, 118], { seed: 61, volumeSpikes: [43, 44] }), 'An ascending triangle: flat resistance, rising lows, then an upward breakout.', [
          level(110.3, 'Flat resistance'),
          seg(11, 101.4, 41, 107.4, 'Rising lows'),
          mark(44, 'Breakout'),
        ]),
      ),
      h('Descending triangle'),
      p('The mirror image: a flat bottom (support) with **falling highs**. Sellers are getting more aggressive while buyers defend one level. It usually breaks downwards.'),
      h('Symmetrical triangle'),
      p('Falling highs **and** rising lows, converging evenly. Neither side is winning. It tends to break in the direction of the trend that came before it, but can go either way, so wait for the break.'),
      chart(
        made(walk([96, 112, 100, 110, 102, 108.5, 103.5, 107, 113, 117], { seed: 66 }), 'A symmetrical triangle in an uptrend: lower highs, higher lows, then a break in the direction of the earlier trend.', [
          seg(5, 112.6, 41, 107.2, 'Falling highs'),
          seg(11, 99.4, 41, 104.4, 'Rising lows'),
          mark(44, 'Breakout'),
        ]),
      ),
      h('Trading triangles'),
      ul(
        '**Entry**: on a close outside the triangle, ideally with higher volume. Volume normally shrinks as the triangle forms.',
        '**Stop-loss**: back inside the triangle, beyond the last swing.',
        '**Target**: the height of the triangle at its widest point, projected from the breakout.',
      ),
      warn('Late breakouts are weak', 'A breakout that happens in the last quarter of the triangle, near the point where the lines meet, tends to be feeble. The best ones happen about half to three quarters of the way along.'),
      note('Same rules as any breakout', 'Everything from the Breakouts and fakeouts lesson applies here: prefer a close over a wick, look for volume, and consider waiting for a retest.'),
    ],
  },
  {
    id: 'flags-and-wedges',
    title: 'Flags and wedges',
    summary: 'A flag is a brief pause in a strong move. A wedge is a move that is losing steam.',
    minutes: 7,
    blocks: [
      h('Flags'),
      p('A **flag** is a continuation pattern. It has two parts: a sharp, almost vertical move called the **flagpole**, then a short, tight drift against that move, the **flag**. The drift is traders taking profit, not a change of mind. When it ends, the original move often resumes.'),
      chart(
        made(walk([100, 103, 117, 115, 116.5, 114, 115.5, 113.2, 120, 127], { per: 5, seed: 71, volumeSpikes: [6, 7, 8, 37] }), 'A bull flag: a sharp rise, a shallow drift downwards on lighter volume, then the rise continues.', [
          seg(4, 103, 9, 117, 'Flagpole'),
          seg(9, 117.6, 34, 115.2, ''),
          seg(9, 115.4, 34, 112.6, 'Flag'),
          mark(37, 'Breakout'),
        ]),
      ),
      ul(
        'A **bull flag** follows a sharp rise and drifts down or sideways.',
        'A **bear flag** follows a sharp fall and drifts up or sideways.',
        'A **pennant** is the same idea, but the pause is a small symmetrical triangle instead of a channel.',
      ),
      p('Trade a flag on the break out of it in the direction of the pole, with a stop-loss beyond the other side of the flag. A common target is the height of the flagpole added to the breakout point.'),
      h('Wedges'),
      p('A **wedge** looks like a triangle that is tilted: both lines slope the same way, and they converge.'),
      ul(
        'A **rising wedge** has higher highs and higher lows, but each push up gains less than the last. The advance is tiring. It usually breaks **down**.',
        'A **falling wedge** has lower highs and lower lows, with each drop smaller than the last. The decline is tiring. It usually breaks **up**.',
      ),
      chart(
        made(walk([98, 110, 104.5, 113, 108.5, 115, 111.5, 116, 109, 104], { seed: 76 }), 'A rising wedge. Price is still making higher highs, but by less each time, and then breaks down.', [
          seg(5, 110.8, 41, 117.2, 'Highs rising slowly'),
          seg(11, 103.8, 41, 112.6, 'Lows rising faster'),
          mark(46, 'Breaks down', 107.4),
        ]),
      ),
      note('Flag or wedge?', 'In a flag the lines are roughly parallel and the pause is brief, a handful of candles to a few dozen. In a wedge the lines converge and the pattern is the whole move, taking much longer.'),
      warn('A flag needs a pole', 'A gentle drift after a gentle rise is not a flag. The pattern depends on the sharp move before it: that is what shows strong interest in one direction.'),
    ],
  },
  {
    id: 'cup-and-handle',
    title: 'Cup and handle',
    summary: 'A rounded recovery followed by a small dip: a slow continuation pattern in uptrends.',
    minutes: 5,
    blocks: [
      p('The **cup and handle** is a bullish continuation pattern. It forms after a rise, and takes longer than most patterns: weeks or months on a daily chart.'),
      h('The shape'),
      ol(
        'The **cup**: price pulls back from a high, levels out, and gradually climbs back to about the same high. The bottom should be rounded like a U, not a sharp V.',
        'The **handle**: on reaching the old high, price dips again, but only a little, and drifts sideways or slightly down for a short time.',
        'The **breakout**: price rises above the top of the cup.',
      ),
      chart(
        made(walk([100, 112, 107, 103.5, 102.5, 103.5, 107, 112, 109, 109.8, 115, 120], { seed: 83, volumeSpikes: [56, 57] }), 'A cup and handle. A rounded base recovers to the old high, a shallow handle forms, and price breaks out.', [
          level(112.2, 'Rim of the cup'),
          mark(23, 'Cup', 100.8),
          mark(50, 'Handle', 107.6),
          mark(57, 'Breakout'),
        ]),
      ),
      h('What is happening'),
      p('The rounded bottom shows selling drying up gradually and buyers slowly returning. Back at the old high, people who bought there earlier and sat through the dip sell to get out even: that is the handle. Once they are gone, there is little left to stop the price.'),
      h('Trading it'),
      ul(
        '**Entry**: on a close above the rim of the cup, ideally on higher volume.',
        '**Stop-loss**: below the low of the handle.',
        '**Target**: the depth of the cup added to the breakout point. Here: 112 + (112 - 102.5) = 121.5.',
      ),
      h('Signs of a good one'),
      ul(
        'The cup is rounded and not too deep, typically giving back a third to a half of the previous rise.',
        'The handle is shallow and stays in the upper half of the cup.',
        'Volume fades through the base and the handle, then rises on the breakout.',
      ),
      warn('Patterns are easy to imagine', 'Given enough charts you can find a cup, a flag or a head and shoulders almost anywhere. A pattern only becomes useful when it gives you a clear entry, a clear stop and a target worth the risk. If you have to squint, it is not there.'),
      note('End of the pattern modules', 'You now have the vocabulary of price action: candles, structure, levels and patterns. The Trainer lets you practise recognising them on real charts.'),
    ],
  },
]);

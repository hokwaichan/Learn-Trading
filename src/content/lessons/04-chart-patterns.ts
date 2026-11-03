import { chart, defineModule, formula, img, level, made, mark, note, ol, p, seg, ul, walk, warn } from './helpers';

export const chartPatterns = defineModule(4, 'chart-patterns', 'Chart patterns', 'Shapes that form over many candles and hint at a reversal or a continuation.', [
  {
    id: 'head-and-shoulders',
    title: 'Head and shoulders',
    summary: 'Three peaks with the middle one highest: the classic sign that an uptrend is running out of buyers.',
    minutes: 5,
    blocks: [
      p('A **chart pattern** is a shape made by many candles. **Reversal patterns** suggest a trend is ending; **continuation patterns** suggest a pause before it resumes. The **head and shoulders** is the classic reversal at the top of an uptrend.'),
      img(
        'head-and-shoulders',
        'Diagram of a head and shoulders top: left shoulder, higher head, right shoulder, a neckline under them, and the projected fall after the break',
        'Three peaks, the middle one highest. The fall after the neckline breaks is often about the height of the head above the neckline.',
      ),
      ol(
        '**Left shoulder**: a high, then a pullback.',
        '**Head**: a higher high, then a pullback to about the same low.',
        '**Right shoulder**: a lower high. Buyers are weakening.',
      ),
      p('The line under the two pullbacks is the **neckline**. The pattern is complete only when price closes below it.'),
      chart(
        made(walk([98, 112, 106, 118, 106.2, 112.5, 106, 99, 96], { seed: 41 }), 'Head and shoulders. The right shoulder is a lower high: buyers could not reach the previous peak. The break below the neckline completes it.', [
          mark(5, 'Left shoulder'),
          mark(17, 'Head'),
          mark(29, 'Right shoulder'),
          level(106, 'Neckline'),
          mark(38, 'Neckline breaks', 102.6),
        ]),
      ),
      ul(
        '**Entry**: a close below the neckline, or its retest from below.',
        '**Stop-loss**: above the right shoulder.',
        '**Target**: the head\'s height above the neckline, projected down from the neckline.',
      ),
      formula('Target = neckline - (head - neckline)', 'In the chart above: 106 - (118 - 106) = 94. This is a rough guide, not a promise.'),
      note('Inverse head and shoulders', 'Upside down at the bottom of a downtrend, it is a bullish reversal, completed by a break above the neckline.'),
      warn('Wait for the neckline', 'Many never complete: price bounces off the neckline and the uptrend carries on.'),
    ],
  },
  {
    id: 'double-tops-and-bottoms',
    title: 'Double tops and double bottoms',
    summary: 'Price tries the same level twice and fails. A simple reversal pattern built on support and resistance.',
    minutes: 5,
    blocks: [
      p('A **double top** is two failures at the same high, shaped like an M. It completes when price breaks below the low between the peaks. A **double bottom** is the mirror image, a W, completed by a break above the middle high.'),
      img(
        'double-top',
        'Diagram of a double top: two peaks at the same height, a confirmation line under the dip between them, and price falling through it',
        'A double top: buyers fail twice at the same price, then the dip between the peaks gives way.',
      ),
      chart(
        made(walk([100, 115, 107, 115.3, 107, 101, 99], { seed: 52 }), 'A double top. Two failures at the same resistance, completed by the break below the middle low.', [
          mark(5, 'First top'),
          mark(17, 'Second top fails'),
          level(107, 'Support between the tops'),
          mark(26, 'Break confirms', 103.4),
        ]),
      ),
      chart(
        made(walk([116, 101, 109, 100.7, 109, 115, 118], { seed: 57 }), 'A double bottom. Sellers failed twice at the same support, then price broke above the middle high.', [
          mark(5, 'First bottom', 99.4),
          mark(17, 'Second bottom holds', 99.2),
          level(109, 'Resistance between the bottoms'),
          mark(27, 'Break confirms'),
        ]),
      ),
      ul(
        '**Entry**: a close beyond the middle level.',
        '**Stop-loss**: beyond the two tops or bottoms.',
        '**Target**: the pattern\'s height from the break. Above: 107 - (115 - 107) = 99.',
      ),
      p('More reliable with a clear trend before it, real spacing between the peaks, and less volume on the second one.'),
      warn('Two touches are not a pattern yet', 'Healthy uptrends often test a high twice before breaking through. Until the middle level breaks, it is only a range.'),
    ],
  },
  {
    id: 'triangles',
    title: 'Triangles',
    summary: 'Price coiling into a narrower and narrower range before it breaks out.',
    minutes: 5,
    blocks: [
      p('In a **triangle** the swings shrink until lines through the highs and lows meet. Buyers and sellers are squeezing towards a decision.'),
      ul(
        '**Ascending**: flat top, rising lows. Usually breaks up.',
        '**Descending**: flat bottom, falling highs. Usually breaks down.',
        '**Symmetrical**: both converge. Usually follows the earlier trend, but wait for the break.',
      ),
      chart(
        made(walk([100, 110, 102, 110.2, 104.5, 110.1, 107, 110.3, 115.5, 118], { seed: 61, volumeSpikes: [43, 44] }), 'An ascending triangle: flat resistance, rising lows, then an upward breakout.', [
          level(110.3, 'Flat resistance'),
          seg(11, 101.4, 41, 107.4, 'Rising lows'),
          mark(44, 'Breakout'),
        ]),
      ),
      chart(
        made(walk([96, 112, 100, 110, 102, 108.5, 103.5, 107, 113, 117], { seed: 66 }), 'A symmetrical triangle in an uptrend: lower highs, higher lows, then a break in the direction of the earlier trend.', [
          seg(5, 112.6, 41, 107.2, 'Falling highs'),
          seg(11, 99.4, 41, 104.4, 'Rising lows'),
          mark(44, 'Breakout'),
        ]),
      ),
      ul(
        '**Entry**: a close outside the triangle, ideally on rising volume.',
        '**Stop-loss**: back inside, beyond the last swing.',
        '**Target**: the triangle\'s widest height, projected from the breakout.',
      ),
      warn('Late breakouts are weak', 'The best breaks come half to three quarters of the way along. Near the tip they tend to fizzle.'),
    ],
  },
  {
    id: 'flags-and-wedges',
    title: 'Flags and wedges',
    summary: 'A flag is a brief pause in a strong move. A wedge is a move that is losing steam.',
    minutes: 5,
    blocks: [
      p('A **flag** is a sharp move, the **flagpole**, followed by a short tight drift the other way, the **flag**. The drift is profit-taking; when it ends the move often resumes.'),
      chart(
        made(walk([100, 103, 117, 115, 116.5, 114, 115.5, 113.2, 120, 127], { per: 5, seed: 71, volumeSpikes: [6, 7, 8, 37] }), 'A bull flag: a sharp rise, a shallow drift downwards on lighter volume, then the rise continues.', [
          seg(4, 103, 9, 117, 'Flagpole'),
          seg(9, 117.6, 34, 115.2, ''),
          seg(9, 115.4, 34, 112.6, 'Flag'),
          mark(37, 'Breakout'),
        ]),
      ),
      ul(
        '**Bull flag** after a rise, **bear flag** after a fall. A **pennant** pauses in a small triangle instead.',
        'Enter on the break in the pole\'s direction, stop beyond the flag, target the pole\'s height.',
      ),
      p('A **wedge** has both lines sloping the same way and converging. A **rising wedge** makes smaller and smaller gains and usually breaks **down**; a **falling wedge** usually breaks **up**.'),
      chart(
        made(walk([98, 110, 104.5, 113, 108.5, 115, 111.5, 116, 109, 104], { seed: 76 }), 'A rising wedge. Price is still making higher highs, but by less each time, and then breaks down.', [
          seg(5, 110.8, 41, 117.2, 'Highs rising slowly'),
          seg(11, 103.8, 41, 112.6, 'Lows rising faster'),
          mark(46, 'Breaks down', 107.4),
        ]),
      ),
      warn('A flag needs a pole', 'A gentle drift after a gentle rise is not a flag. The sharp move is what shows strong interest.'),
    ],
  },
  {
    id: 'cup-and-handle',
    title: 'Cup and handle',
    summary: 'A rounded recovery followed by a small dip: a slow continuation pattern in uptrends.',
    minutes: 4,
    blocks: [
      p('The **cup and handle** is a slow bullish continuation, weeks or months on a daily chart: a rounded U-shaped **cup** back to the old high, a shallow **handle** dip, then a breakout above the rim.'),
      chart(
        made(walk([100, 112, 107, 103.5, 102.5, 103.5, 107, 112, 109, 109.8, 115, 120], { seed: 83, volumeSpikes: [56, 57] }), 'A cup and handle. A rounded base recovers to the old high, a shallow handle forms, and price breaks out.', [
          level(112.2, 'Rim of the cup'),
          mark(23, 'Cup', 100.8),
          mark(50, 'Handle', 107.6),
          mark(57, 'Breakout'),
        ]),
      ),
      p('The rounded base shows selling drying up. The handle is earlier buyers getting out at break-even; once they are gone, little stands in the way.'),
      ul(
        '**Entry**: a close above the rim, ideally on higher volume.',
        '**Stop-loss**: below the handle.',
        '**Target**: the cup\'s depth added to the rim. Here: 112 + (112 - 102.5) = 121.5.',
        'Good ones: a rounded, not-too-deep cup and a shallow handle in its upper half.',
      ),
      warn('Patterns are easy to imagine', 'With enough charts you can see a pattern anywhere. It is only useful if it gives a clear entry, stop and target. If you have to squint, it is not there.'),
      note('Practise them', 'The Trainer shows chart patterns on real and constructed charts and asks you to name them.'),
    ],
  },
]);

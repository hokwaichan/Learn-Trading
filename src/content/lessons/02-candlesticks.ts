import { chart, defineModule, gallery, h, img, join, made, mark, note, ohlc, p, real, ul, walk, warn, widget } from './helpers';

export const candlesticks = defineModule(2, 'candlesticks', 'Reading candlesticks', 'What one candle tells you, and the handful of candle patterns worth knowing.', [
  {
    id: 'candle-anatomy',
    title: 'Body and wicks',
    summary: 'Each candle packs four prices into one shape: where price opened, closed, and how far it travelled.',
    minutes: 4,
    blocks: [
      p('A **candlestick** packs four prices for one period into one shape: the open, high, low and close, called **OHLC**. The thick **body** spans the open and close; the thin **wicks** reach the high and low.'),
      img(
        'candle-scheme',
        'Diagram of one candlestick, labelled high, open, close and low, with the upper shadow, real body and lower shadow',
        'One candle. Wicks are also called shadows.',
      ),
      img(
        'candle-bull-bear',
        'Two candles side by side: a rising candle that closes above its open, and a falling candle that closes below its open',
        'Close above the open: price rose, drawn in the up colour. Close below the open: price fell, drawn in the down colour.',
      ),
      p('Drag the sliders to build your own candle:'),
      widget('candle-anatomy'),
      h('Reading the shape'),
      ul(
        '**Long body**: one side was in control all period.',
        '**Short body**: buyers and sellers roughly cancelled out.',
        '**Long upper wick**: price went up and was pushed back down. Sellers rejected higher prices.',
        '**Long lower wick**: price went down and was pushed back up. Buyers rejected lower prices.',
      ),
      note('Try it on a real chart', 'Open the Charts page and click any candle. The Explain tab describes that exact candle in these terms.'),
    ],
  },
  {
    id: 'timeframes',
    title: 'Timeframes',
    summary: 'The same market looks different depending on how much time each candle covers.',
    minutes: 4,
    blocks: [
      p('The **timeframe** is how much time one candle covers, from 1 minute to 1 day in this app. It is the same data grouped differently: twenty-four 1-hour candles make exactly one daily candle.'),
      chart(real('AAPL', '2025-06-02', '2025-12-31', 'Apple on the daily timeframe. Each candle is one full trading day. On a 1-hour chart every one of these would be several candles, with far more small wiggles.')),
      ul(
        '**Short timeframes** (1 to 15 minutes): lots of detail and lots of noise. Patterns appear often and fail often.',
        '**Long timeframes** (4 hours, 1 day): the bigger direction. Fewer, more reliable signals, but wider stops and more waiting.',
      ),
      p('Match the timeframe to how long you hold: minutes, watch the 1 and 5 minute charts; days, watch the daily. Beginners do best on the 4-hour or daily, where there is time to think.'),
      note('Look one level up', 'Check the next timeframe up before trading. A rise on the 15-minute chart is less convincing if the daily chart is falling hard.'),
      warn('The newest candle is unfinished', 'The last candle on a live chart keeps changing until its period ends. Wait for it to close before reading its shape.'),
    ],
  },
  {
    id: 'single-candle-patterns',
    title: 'Single-candle patterns',
    summary: 'Doji, hammer, shooting star and marubozu: four shapes that say something about who is in control.',
    minutes: 6,
    blocks: [
      p('Some candle shapes have names because traders read them the same way. Each one is a hint about who is in control, never a promise, and where it appears matters as much as the shape.'),
      gallery(
        [
          ['pattern-hammer', 'Hammer'],
          ['pattern-hanging-man', 'Hanging man'],
          ['pattern-inverted-hammer', 'Inverted hammer'],
          ['pattern-shooting-star', 'Shooting star'],
        ],
        'Each shape shown at the end of the move that gives it meaning.',
      ),
      ul(
        '**Hammer**: small body on top, long lower wick, after a fall. Price was pushed down and buyers pushed it all the way back.',
        '**Hanging man**: the same shape after a rise. A warning instead.',
        '**Shooting star**: small body at the bottom, long upper wick, after a rise. Sellers pushed price back down.',
        '**Inverted hammer**: the same shape after a fall.',
        '**Doji**: open and close almost equal, a draw. After a strong move it suggests the move is tiring.',
        '**Marubozu**: almost all body, no wicks. One side in control from start to finish.',
      ),
      chart(
        made(
          join(
            walk([110, 104, 100], { per: 4, seed: 5 }),
            ohlc([[100, 100.5, 96, 100.3]]),
            walk([100.3, 106, 110], { per: 4, seed: 9 }),
            ohlc([[110, 114.2, 109.6, 109.9]]),
            walk([109.9, 105], { per: 4, seed: 2 }),
            ohlc([[105, 106.6, 103.4, 105.06], [105.06, 109.05, 105.0, 109.0]]),
          ),
          'Four named candles in context. The hammer comes after a fall and the shooting star after a rise, which is what gives them meaning.',
          [mark(8, 'Hammer', 94.8), mark(17, 'Shooting star'), mark(22, 'Doji', 102.4), mark(23, 'Marubozu')],
        ),
      ),
      h('How to use them'),
      ul(
        '**Context first.** A hammer after a long fall, at a price where buyers appeared before, is worth noticing. In the middle of a sideways market it means nothing.',
        '**Wait for confirmation.** Many traders want the next candle to move the expected way first.',
        '**They fail often.** Treat a pattern as one piece of evidence, and always have a stop-loss.',
      ),
      note('Practise spotting them', 'The Trainer page will show you real chart segments and ask which pattern you see.'),
    ],
  },
  {
    id: 'multi-candle-patterns',
    title: 'Multi-candle patterns',
    summary: 'Engulfing, morning and evening star, harami, and three soldiers or crows: patterns made of two or three candles.',
    minutes: 6,
    blocks: [
      p('Two and three-candle patterns tell a small story: one side in control, then losing it. Like single candles, they matter most after a clear move.'),
      gallery(
        [
          ['pattern-bullish-engulfing', 'Bullish engulfing'],
          ['pattern-bearish-engulfing', 'Bearish engulfing'],
          ['pattern-bullish-harami', 'Harami'],
          ['pattern-doji-star', 'Doji star'],
          ['pattern-morning-star', 'Morning star'],
          ['pattern-evening-star', 'Evening star'],
          ['pattern-three-white-soldiers', 'Three white soldiers'],
          ['pattern-three-black-crows', 'Three black crows'],
        ],
        'In these traditional drawings a white candle rose and a black candle fell.',
      ),
      ul(
        '**Engulfing**: a candle whose body swallows the previous body, in the other direction. A takeover.',
        '**Harami**: a small body sitting inside the previous large one. Hesitation, a weaker signal than engulfing.',
        '**Doji star**: a doji after a long candle. The move has stalled.',
        '**Morning star** and **evening star**: a long candle, a small pause, then a long candle the other way. A turn after a fall, or after a rise.',
        '**Three white soldiers** and **three black crows**: three long candles in a row one way. Strength, though the move may already be stretched.',
      ),
      chart(
        made(
          join(
            walk([112, 106, 101.5], { per: 4, seed: 4 }),
            ohlc([[101.5, 101.8, 99.9, 100.2], [99.9, 103.4, 99.7, 103.1]]),
            walk([103.1, 108, 111], { per: 3, seed: 8 }),
            ohlc([[111, 114.6, 110.8, 114.3], [114.6, 115.4, 114.1, 114.7], [114.4, 114.6, 110.6, 111.0]]),
            walk([111, 107, 104], { per: 3, seed: 6 }),
          ),
          'A bullish engulfing pattern ends the fall on the left. An evening star ends the rise on the right.',
          [mark(9, 'Bullish engulfing', 98.6), mark(17, 'Evening star')],
        ),
      ),
      chart(
        made(
          join(
            walk([104, 101, 100], { per: 4, seed: 12 }),
            ohlc([[100, 102.6, 99.8, 102.4], [101.6, 104.9, 101.4, 104.7], [103.9, 107.3, 103.7, 107.1]]),
            walk([107.1, 108.5, 108], { per: 3, seed: 3 }),
            ohlc([[108, 108.2, 105.4, 105.6], [106.3, 106.5, 103.1, 103.3], [104.0, 104.2, 100.8, 101.0]]),
          ),
          'Three white soldiers on the way up, three black crows on the way down.',
          [mark(9, 'Three white soldiers'), mark(18, 'Three black crows')],
        ),
      ),
      h('Keep them in proportion'),
      ul(
        'They say who won the last two or three periods, nothing certain about the next ten.',
        'They carry more weight on longer timeframes, at prices that mattered before, and with higher volume on the final candle.',
      ),
      warn('Easy to see in hindsight', 'Scrolling back, every turning point seems to have a pattern. You do not see the times the same pattern appeared and nothing happened. Judge patterns by trading them on paper.'),
    ],
  },
]);

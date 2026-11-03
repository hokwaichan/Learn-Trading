import { chart, defineModule, img, join, level, made, mark, note, ohlc, ol, p, real, seg, ul, walk, warn, worked, zone } from './helpers';

export const biggerPicture = defineModule(12, 'bigger-picture', 'Reading the bigger picture', 'Several timeframes at once, Fibonacci levels, divergence, and what volume says about who is in control.', [
  {
    id: 'top-down-analysis',
    title: 'Top-down analysis: more than one timeframe',
    summary: 'Start on a high timeframe to find the direction, then move down to find the entry. The single habit that removes the most bad trades.',
    minutes: 5,
    blocks: [
      p('A strong rally on the 5-minute chart can be a small bounce in a daily downtrend. **Top-down analysis** reads the market from the largest view to the smallest before trading.'),
      ol(
        '**Higher timeframe: direction.** Uptrend, downtrend or range, and the major levels. Only trade with it.',
        '**Middle timeframe: the setup** you actually trade, such as a pullback or breakout.',
        '**Lower timeframe: the entry**, closer to the stop for a better risk/reward.',
      ),
      p('Space them four to six times apart: daily, 4-hour and 1-hour for swing trading; 4-hour, 1-hour and 15-minute for day trading. Use the same three every time.'),
      chart(real('SPY', '2024-01-02', '2025-12-31', 'Two years of SPY on the daily chart with the 50-day and 200-day averages: the higher-timeframe view. Price above both rising averages means the direction is up, so on the lower timeframes you would look only for buys.', [{ id: 'sma', params: { period: 50 } }, { id: 'sma', params: { period: 200 } }])),
      p('When several independent reasons point at one price, such as daily support, a rising average and a 4-hour swing low, that is **confluence**. More traders watch that price; it is still not a certainty.'),
      ul(
        '**Higher up, lower down**: a pullback in an uptrend, often an opportunity once the lower chart turns up.',
        '**Higher in a range**: lower-timeframe trends tend to fail at its edges.',
        '**No clear higher picture**: no trade.',
      ),
      note('In this app', 'On the Charts page, switch between 1d, 4h and 1h with the buttons above the chart. Draw your higher-timeframe levels first: drawings stay on the chart when you change timeframe.'),
      warn('Do not keep zooming until you find a reason', 'Hunting through timeframes until one agrees with you is confirmation bias. Pick three and stop there.'),
    ],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci retracements and extensions',
    summary: 'A way to measure how far a pullback has gone and where a move might reach, using fixed percentages of the last swing.',
    minutes: 5,
    blocks: [
      p('A **Fibonacci retracement** measures a pullback as a share of the last swing, with lines at 23.6%, 38.2%, 50%, 61.8% and 78.6%. Nothing is magic about the numbers; they work because so many traders watch the same lines.'),
      img(
        'fibonacci-retracement',
        'A candlestick chart with Fibonacci retracement lines drawn across a fall, and price bouncing to one of the lines before turning down',
        'Fibonacci lines drawn over a fall. The bounce stalls at one of the lines (circled) and the fall resumes.',
      ),
      chart(
        made(walk([100, 130, 114, 138], { seed: 33 }), 'A rise from 100 to 130, then a pullback. It ended between the 50% line (115) and the 61.8% line (111.5), and the trend resumed.', [
          level(118.5, '38.2%'),
          level(115, '50%'),
          level(111.5, '61.8%'),
          mark(5, 'End of the move'),
          mark(11, 'Pullback ends here', 110),
        ]),
      ),
      p('Draw from swing low to swing high in an uptrend, high to low in a downtrend.'),
      ul(
        '**Shallow (23.6% to 38.2%)**: a strong trend.',
        '**Middle (50% to 61.8%)**: the most watched, a healthy pullback.',
        '**Deep (78.6% and beyond)**: the move is being undone. Past the start of the swing, the idea is wrong.',
      ),
      p('**Fibonacci extensions** project the swing forward for targets, usually 127.2% and 161.8%. A rise from 100 to 130 has its 161.8% extension at 148.5.'),
      worked('A trade planned with Fibonacci', 'Price rose from 100 to 130 and is pulling back.', 'You wait for the 50% to 61.8% zone, 115 to 111.5, and for a candle that shows buyers returning.', 'You buy at 114 with a stop at 108, below the 78.6% line. Risk: 6.', 'First target: the old high at 130. Reward 16, a risk/reward of about 2.7 to 1.'),
      warn('Lines everywhere', 'With five lines price is always near one. Combine Fibonacci with something independent and choose your line before price arrives.'),
      note('In this app', 'The Fibonacci tool is in the drawing tools above the chart. Click the start of a move, then its end.'),
    ],
  },
  {
    id: 'divergence',
    title: 'Divergence: when price and momentum disagree',
    summary: 'Price makes a new high but the indicator does not. An early warning that a trend is tiring, and one of the most misused signals in trading.',
    minutes: 5,
    blocks: [
      p('**Divergence** is price and momentum disagreeing: price makes a higher high, but RSI or MACD makes a lower high. The move goes on with less force behind it.'),
      img(
        'rsi-divergence',
        'A Bitcoin price chart making higher highs above an RSI pane whose peaks slope down, with lines drawn along both',
        'Bitcoin rising to higher highs while RSI makes lower highs: bearish divergence before the fall.',
      ),
      chart(
        made(
          join(walk([100, 113], { per: 8, seed: 5 }), walk([113, 107], { per: 5, seed: 6 }), walk([107, 114.5], { per: 14, seed: 9, noise: 0.008 }), walk([114.5, 108], { per: 6, seed: 4 })),
          'Price makes a slightly higher high the second time, but look at RSI underneath: its second peak is clearly lower than its first. The second rally was slower and weaker. This is bearish divergence.',
          [seg(7, 114.2, 26, 115.6, 'Price: higher high')],
          [{ id: 'rsi', params: { period: 14 } }],
        ),
      ),
      ul(
        '**Bearish divergence**: higher price high, lower indicator high. Buying is fading.',
        '**Bullish divergence**: lower price low, higher indicator low. Selling is fading.',
        '**Hidden divergence**: in an uptrend, a higher price low with a lower indicator low favours the trend continuing.',
      ),
      ol(
        'Treat it as a warning, not an entry.',
        'Wait for price to confirm: a break of the last swing.',
        'Trust it more at a level that already matters.',
      ),
      warn('Divergence can last a long time', 'In a strong trend it can appear again and again while price climbs. Shorting every bearish divergence in a bull market loses steadily.'),
      note('Which indicator?', 'RSI and the MACD histogram measure nearly the same thing, so divergence on both is one piece of evidence, not two.'),
    ],
  },
  {
    id: 'volume-and-wyckoff',
    title: 'Volume, accumulation and distribution',
    summary: 'Volume shows how much effort is behind a move. The Wyckoff method uses it to read ranges as large traders building or unloading positions.',
    minutes: 6,
    blocks: [
      p('Price shows what happened; **volume** shows how many took part. Read them together:'),
      ul(
        '**Heavy volume, big move**: genuine.',
        '**Heavy volume, small move**: someone is absorbing the pressure, often near a top or bottom.',
        '**Light volume, big move**: easy to reverse.',
        '**Volume drying up in a pullback**: sellers are not interested, healthy in an uptrend.',
      ),
      p('Richard Wyckoff described four phases: **accumulation** (large traders buying in a range after a fall), markup, **distribution** (selling in a range near the top) and markdown. The **Wyckoff method** tries to tell which a range is before it breaks.'),
      chart(
        made(
          join(
            walk([122, 104, 110, 104.4, 109.6, 104.8, 108], { seed: 12, volumeSpikes: [5] }),
            ohlc([
              [108, 108.2, 104, 104.6, 1400],
              [104.6, 105, 101.8, 104.9, 3200],
              [104.9, 108, 104.7, 107.8, 2300],
              [107.8, 111.5, 107.5, 111.2, 3000],
              [111.2, 114, 110.8, 113.6, 2500],
              [113.6, 116.5, 113.2, 116, 2200],
            ]),
          ),
          'A decline ends on heavy volume, then a range forms. Price dips under the lows, snaps back the same day on a volume spike (the spring), and breaks out on heavy volume.',
          [zone(5, 110.4, 35, 103.9, 'Accumulation range'), mark(37, 'Spring: a false break of the lows', 100.6), mark(39, 'Breakout on heavy volume')],
        ),
      ),
      ul(
        '**Climax volume**: a huge spike at the end of a decline or rally, the last panicked traders out or in.',
        '**The spring**: a brief dip below an accumulation range that reverses at once, triggering stops. At a top it is an **upthrust**.',
        '**Breakout and test**: out of the range on rising volume, back to the edge on low volume, and holding.',
      ),
      warn('Easy to see afterwards, hard at the time', 'Any range looks like accumulation if it breaks up. Treat a Wyckoff reading as a hypothesis with a clear point where it is wrong.'),
      note('Where this leads', 'The spring is what the next module calls a liquidity sweep: different words, same chart.'),
    ],
  },
]);

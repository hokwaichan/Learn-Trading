import { chart, defineModule, h, join, level, made, mark, note, ohlc, ol, p, real, seg, ul, walk, warn, worked, zone } from './helpers';

export const biggerPicture = defineModule(12, 'bigger-picture', 'Reading the bigger picture', 'Several timeframes at once, Fibonacci levels, divergence, and what volume says about who is in control.', [
  {
    id: 'top-down-analysis',
    title: 'Top-down analysis: more than one timeframe',
    summary: 'Start on a high timeframe to find the direction, then move down to find the entry. The single habit that removes the most bad trades.',
    minutes: 7,
    blocks: [
      p('Every chart is a zoomed view of the same market. A strong rally on the 5-minute chart can be a small bounce inside a daily downtrend. Traders who look at only one timeframe keep buying those bounces and wondering why they fail. **Top-down analysis** means reading the market from the largest view to the smallest before placing a trade.'),
      h('Three timeframes, three jobs'),
      ol(
        '**The higher timeframe sets the direction.** Is the market in an uptrend, a downtrend or a range? Where are the major support and resistance levels? You only take trades that agree with this.',
        '**The middle timeframe finds the setup.** This is the chart you actually trade: a pullback to support, a breakout, a pattern.',
        '**The lower timeframe times the entry.** Zooming in lets you enter closer to your stop-loss, which makes the same idea a better risk/reward.',
      ),
      p('A common spacing is a factor of four to six between each: daily, 4-hour and 1-hour for a swing trader; 4-hour, 1-hour and 15-minute for a day trader. The exact choice matters less than using the same three every time.'),
      chart(real('SPY', '2024-01-02', '2025-12-31', 'Two years of SPY on the daily chart with the 50-day and 200-day averages: the higher-timeframe view. Price above both rising averages means the direction is up, so on the lower timeframes you would look only for buys.', [{ id: 'sma', params: { period: 50 } }, { id: 'sma', params: { period: 200 } }])),
      h('Confluence'),
      p('When several independent reasons point at the same price, traders call it **confluence**. A daily support level that lines up with a rising moving average and a 4-hour swing low is a stronger place to buy than any one of them alone. Confluence does not make a trade certain; it means more traders are watching the same price.'),
      h('When timeframes disagree'),
      ul(
        '**Higher up, lower down**: a pullback inside an uptrend. This is usually an opportunity, once the lower timeframe turns back up.',
        '**Higher in a range**: expect lower-timeframe trends to fail at the edges of the range.',
        '**No clear picture on the higher timeframe**: the honest reading is "no trade".',
      ),
      note('In this app', 'On the Charts page, switch between 1d, 4h and 1h with the buttons above the chart. Draw your higher-timeframe levels first: drawings stay on the chart when you change timeframe.'),
      warn('Do not keep zooming until you find a reason', 'Looking at more and more timeframes until one of them agrees with what you already wanted to do is confirmation bias. Decide which three you use and stop there.'),
    ],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci retracements and extensions',
    summary: 'A way to measure how far a pullback has gone and where a move might reach, using fixed percentages of the last swing.',
    minutes: 7,
    blocks: [
      p('After a strong move, price usually gives some of it back before continuing. A **Fibonacci retracement** measures that pullback as a percentage of the move. The tool draws horizontal lines at 23.6%, 38.2%, 50%, 61.8% and 78.6% between the start and end of a swing, and traders watch those lines for the pullback to end.'),
      p('The percentages come from the Fibonacci number sequence (the 50% line does not, but is included because half-way pullbacks are so common). There is nothing magic in the numbers. They work as well as they do because so many traders draw the same lines and place orders near them.'),
      chart(
        made(walk([100, 130, 114, 138], { seed: 33 }), 'A rise from 100 to 130, then a pullback. It ended between the 50% line (115) and the 61.8% line (111.5), and the trend resumed.', [
          level(118.5, '38.2%'),
          level(115, '50%'),
          level(111.5, '61.8%'),
          mark(5, 'End of the move'),
          mark(11, 'Pullback ends here', 110),
        ]),
      ),
      h('How to draw it'),
      ol(
        'Find a clear swing: a move with an obvious start and end.',
        'In an uptrend, draw from the swing low up to the swing high. In a downtrend, from the swing high down to the swing low.',
        'The lines between show where a pullback of each size would reach.',
      ),
      h('Reading the depth of a pullback'),
      ul(
        '**Shallow (23.6% to 38.2%)**: the trend is strong. Buyers did not wait for a better price.',
        '**Middle (50% to 61.8%)**: the most watched area. A normal, healthy pullback.',
        '**Deep (78.6% and beyond)**: the move is being undone. If price passes the start of the swing, the idea is wrong.',
      ),
      h('Extensions: where might it go?'),
      p('**Fibonacci extensions** project the same swing forwards to give targets beyond its end, most often 127.2% and 161.8% of its length. If a rise from 100 to 130 pulls back and resumes, the 161.8% extension is at 148.5. Traders use these as places to take profit when there is no earlier price history to give a resistance level.'),
      worked('A trade planned with Fibonacci', 'Price rose from 100 to 130 and is pulling back.', 'You wait for the 50% to 61.8% zone, 115 to 111.5, and for a candle that shows buyers returning.', 'You buy at 114 with a stop at 108, below the 78.6% line. Risk: 6.', 'First target: the old high at 130. Reward 16, a risk/reward of about 2.7 to 1.'),
      warn('Lines everywhere', 'With five retracement lines, price is always near one of them, so it is easy to believe the tool "worked" after the fact. Use it together with something independent, such as a support level or a moving average, and decide which line you are trading before price gets there.'),
      note('In this app', 'The Fibonacci tool is in the drawing tools above the chart. Click the start of a move, then its end.'),
    ],
  },
  {
    id: 'divergence',
    title: 'Divergence: when price and momentum disagree',
    summary: 'Price makes a new high but the indicator does not. An early warning that a trend is tiring, and one of the most misused signals in trading.',
    minutes: 6,
    blocks: [
      p('In a healthy uptrend each new high in price comes with strong momentum. **Divergence** is when they stop agreeing: price pushes to a higher high, but an oscillator such as RSI or MACD makes a lower high. The move is still going, but with less force behind it.'),
      chart(
        made(
          join(walk([100, 113], { per: 8, seed: 5 }), walk([113, 107], { per: 5, seed: 6 }), walk([107, 114.5], { per: 14, seed: 9, noise: 0.008 }), walk([114.5, 108], { per: 6, seed: 4 })),
          'Price makes a slightly higher high the second time, but look at RSI underneath: its second peak is clearly lower than its first. The second rally was slower and weaker. This is bearish divergence.',
          [seg(7, 114.2, 26, 115.6, 'Price: higher high')],
          [{ id: 'rsi', params: { period: 14 } }],
        ),
      ),
      h('The two regular kinds'),
      ul(
        '**Bearish divergence**: price makes a higher high, the indicator makes a lower high. Buying pressure is fading. A warning for longs.',
        '**Bullish divergence**: price makes a lower low, the indicator makes a higher low. Selling pressure is fading. A warning for shorts.',
      ),
      h('Hidden divergence'),
      p('There is also a version that points to the trend continuing. In an uptrend, if price makes a higher low while the indicator makes a lower low, the pullback had plenty of momentum on paper but could not push price down. That is called **hidden divergence**, and it favours the existing trend.'),
      h('How to use it'),
      ol(
        'Treat divergence as a warning, not an entry. It says "this is weakening", not "this is over".',
        'Wait for price itself to confirm: a break of the last swing low after bearish divergence, or of the last swing high after bullish divergence.',
        'Give more weight to divergence that appears at a level that already matters, such as major resistance.',
      ),
      warn('Divergence can last a long time', 'In a strong trend, an indicator can show divergence again and again while price keeps climbing. Traders who short every bearish divergence in a bull market lose money steadily. This is the main reason the signal has a poor reputation: it is used as an entry when it is only a caution.'),
      note('Which indicator?', 'RSI and the MACD histogram are the usual choices. They measure nearly the same thing, so divergence on both at once is one piece of evidence, not two.'),
    ],
  },
  {
    id: 'volume-and-wyckoff',
    title: 'Volume, accumulation and distribution',
    summary: 'Volume shows how much effort is behind a move. The Wyckoff method uses it to read ranges as large traders building or unloading positions.',
    minutes: 8,
    blocks: [
      p('Price tells you what happened. **Volume** tells you how many traders took part. A rise on heavy volume has real buying behind it; the same rise on thin volume can be undone by one large seller. Reading the two together is one of the oldest skills in trading.'),
      h('Effort and result'),
      ul(
        '**Heavy volume, large move**: effort and result agree. The move is genuine.',
        '**Heavy volume, small move**: a lot of trading for little progress. Someone is absorbing the pressure. After a long rise this often marks a top; after a long fall, a bottom.',
        '**Light volume, large move**: little took part. Easy to reverse.',
        '**Volume drying up in a pullback**: sellers are not interested. Healthy for an uptrend.',
      ),
      h('The Wyckoff idea'),
      p('Richard Wyckoff, writing a century ago, described markets as cycling through four phases. In **accumulation**, large traders quietly buy inside a range after a decline. Then comes the markup (the uptrend), then **distribution**, where they sell inside a range near the top, then the markdown. The **Wyckoff method** is the practice of deciding which phase a range belongs to before it breaks.'),
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
      h('Signs to look for'),
      ul(
        '**Climax volume**: a huge spike at the end of a decline (a selling climax) or a rally (a buying climax), where the last panicked traders get out or in.',
        '**The spring**: a brief dip below the bottom of an accumulation range that reverses at once. It triggers stop-losses and lets large buyers fill their orders. The mirror image at a top is called an **upthrust**.',
        '**The breakout and its test**: price leaves the range on rising volume, then returns to the edge on low volume and holds.',
      ),
      warn('Easy to see afterwards, hard at the time', 'Every range looks like accumulation if it breaks upward and like distribution if it breaks down. In real time you cannot know who is buying. Treat a Wyckoff reading as a hypothesis with a clear point where it is wrong, such as a close back below the spring.'),
      note('Where this leads', 'The spring is the same event that the next module calls a liquidity sweep. The vocabulary is different; the chart is the same.'),
    ],
  },
]);

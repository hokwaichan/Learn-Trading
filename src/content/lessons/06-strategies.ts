import { chart, defineModule, img, level, made, mark, note, ol, p, real, ul, walk, warn } from './helpers';

export const strategies = defineModule(6, 'strategies', 'Strategies', 'Common ways to turn what you have learned into rules: when to enter, when to exit, and when each approach fails.', [
  {
    id: 'trend-following',
    title: 'Trend following and the moving-average crossover',
    summary: 'Buy what is already going up and hold until it stops. Simple, and uncomfortable in practice.',
    minutes: 6,
    blocks: [
      p('A **strategy** is a set of rules for entering, exiting and sizing a trade. Written rules can be tested on past data and followed without improvising under pressure.'),
      p('**Trend following** bets that a market already moving will keep moving. You do not predict the trend; you join it once it appears and stay until it ends. The classic rules use two moving averages:'),
      ol(
        '**Enter long** when the fast average crosses above the slow one.',
        '**Exit** when it crosses back below.',
        'Optionally, go short on the downward cross instead of just exiting.',
      ),
      chart(real('SPY', '2023-01-03', '2025-06-30', 'SPY with a 20-day and a 50-day EMA. Find each place the faster line crosses the slower one, and see how much of the following move a crossover trader would have caught.', [
        { id: 'ema', params: { period: 20 } },
        { id: 'ema', params: { period: 50 } },
      ])),
      ul(
        '**Low win rate, big winners**: often 30% to 45% wins, paid for by a few big trends.',
        '**Late in, late out**: you give back part of every trend before the exit.',
        '**Losing streaks in ranges**: every crossover is a whipsaw.',
      ),
      p('Common fixes: only buy above the 200-day average, trail a stop such as 3 ATR below the highest close, and skip signals when the averages are flat and tangled.'),
      note('Test it yourself', 'The Backtester has an EMA crossover preset. Run it on different symbols and periods and look at the win rate next to the total return.'),
      warn('The hard part is psychological', 'Most people abandon the rules after a string of small losses, just before the trade that would have paid for them all.'),
    ],
  },
  {
    id: 'breakout-trading',
    title: 'Breakout trading',
    summary: 'Enter when price escapes a range, on the bet that a new move is starting.',
    minutes: 5,
    blocks: [
      p('**Breakout trading** enters when price escapes a level that has held it: a range top, a previous high, a triangle edge. With the defending orders gone, price can travel fast.'),
      ol(
        'Find a level that has held two or three times.',
        '**Enter** on a candle that closes beyond it.',
        '**Stop-loss** just back inside the range.',
        '**Target** the range height from the breakout, or trail a stop.',
      ),
      chart(
        made(walk([103, 109, 101.5, 109.2, 102, 109, 104, 114, 110, 119, 124], { seed: 91, volumeSpikes: [38, 39] }), 'A range breakout trade. Entry on the close above resistance, stop back inside the range, target one range-height above.', [
          level(109.3, 'Resistance: entry on a close above'),
          level(106.8, 'Stop-loss back inside the range'),
          level(117, 'Target: range height projected up'),
          mark(39, 'Entry'),
        ]),
      ),
      p('A mechanical version buys a new **20-day high** and sells a new **10-day low**. It needs no judgement, so it is easy to backtest.'),
      ul(
        '**Many fakeouts**, but small losses because the stop is close.',
        '**Occasional big winners** when a real trend starts.',
        '**Slippage**: everyone sees the level, so fills can be worse than planned.',
        '**Filters**: above-average volume, the direction of the bigger trend, a tight range first, or a retest entry.',
      ),
      warn('Do not chase', 'If the breakout candle has already run far, the stop is too far away. Let it go, or wait for a retest.'),
    ],
  },
  {
    id: 'mean-reversion',
    title: 'Mean reversion',
    summary: 'Bet that a price stretched far from its average will come back. High win rate, dangerous losers.',
    minutes: 5,
    blocks: [
      p('**Mean reversion** is the opposite of trend following: price stretched far from its average tends to come back. You buy hard falls and sell hard rises.'),
      ul(
        '**With RSI**: buy when RSI(14) falls below 30; exit above 50 or at the 20-period average; stop 2 ATR below.',
        '**With Bollinger Bands**: buy a close below the lower band; exit at the middle band.',
      ),
      chart(real('SPY', '2024-10-01', '2025-09-30', 'SPY with Bollinger Bands and RSI. Look for closes below the lower band with RSI under 30, and whether price then returned to the middle band.', [
        { id: 'bollinger', params: { period: 20, multiplier: 2 } },
        { id: 'rsi', params: { period: 14 } },
      ])),
      ul(
        '**High win rate, small winners**: 60% to 70% wins is common.',
        '**Rare, large losers**: when something has really changed, price keeps going.',
        '**Best in ranges**: in a strong trend, oversold gets more oversold.',
      ),
      p('Make it safer: buy dips only in a long-term uptrend, always use a stop, and never add to a loser.'),
      note('Why both styles can work', 'Prices tend to revert over short stretches in ranges and trend over longer ones. Neither works all the time.'),
      warn('"It cannot go any lower"', 'It can. A stock down 80% can fall another 80%. Oversold describes the past, not a floor.'),
    ],
  },
  {
    id: 'support-resistance-bounce',
    title: 'The support and resistance bounce',
    summary: 'Buy at support, sell at resistance. A range strategy with a naturally tight stop.',
    minutes: 5,
    blocks: [
      p('The **bounce** bets a level will hold again: buy near support, sell near resistance.'),
      ol(
        'Find a range whose support and resistance have each held twice.',
        'Wait for price to reach support **and react**: a hammer, an engulfing candle, a close back up.',
        '**Enter long** after the reaction, **stop** just below support, **take profit** a little before resistance.',
      ),
      chart(
        made(walk([106, 110, 101, 109.8, 100.8, 109.6, 101.4, 108, 110], { seed: 96 }), 'A bounce trade. Price returns to support for the third time, shows a reaction, and travels back towards resistance.', [
          level(110, 'Resistance'),
          level(100.9, 'Support'),
          level(99.6, 'Stop-loss below support'),
          level(108.6, 'Take-profit before resistance'),
          mark(36, 'Entry after the reaction', 99.4),
        ]),
      ),
      p('The stop is close and the target far: here about 1.5 points of risk for 7 of reward.'),
      ul(
        'The last trade in every range loses, because that is when the level breaks.',
        'Each test weakens the level. A steep, high-volume move into it is more likely to break it.',
        'Buying without a reaction is **catching a falling knife**. In the middle of the range there is no edge.',
      ),
      note('Bounce or breakout?', 'At every level you choose between "it holds" and "it breaks". Ranges and weak momentum favour the bounce; a trend pressing with rising volume favours the breakout.'),
    ],
  },
  {
    id: 'trading-styles',
    title: 'Scalping, day, swing and position trading',
    summary: 'Four styles defined by how long a trade lasts. Pick the one that fits your time and temperament.',
    minutes: 5,
    blocks: [
      p('How long you hold is your **trading style**. It decides how much time trading takes, what it costs in fees, and how stressful it is.'),
      img(
        'nasdaq-marketsite',
        'The Nasdaq MarketSite tower in Times Square, New York, wrapped in a giant screen',
        'The Nasdaq MarketSite in New York. Day traders watch the open here; position traders may check once a week.',
      ),
      ul(
        '**Scalping**: seconds to minutes on 1-minute charts. Fees eat tiny profits; hardest for beginners.',
        '**Day trading**: in and out the same day on 5-minute to 1-hour charts. No overnight risk, but needs hours free.',
        '**Swing trading**: days to weeks on 4-hour and daily charts. Check once or twice a day; overnight risk.',
        '**Position trading**: weeks to months on daily and weekly charts. Least time, most patience.',
      ),
      chart(real('SPY', '2025-01-02', '2025-12-31', 'A year of SPY on the daily chart: the view a swing or position trader works from. A swing trader would aim to catch one leg of a move like these, lasting days to weeks. A scalper would be working inside a single one of these candles.')),
      p('Shorter styles mean more trades, higher costs relative to profit, and tighter stops. Longer styles mean wider stops and smaller positions.'),
      ul(
        'Have a job? Swing trading fits around it.',
        'New? Start with **swing trading on the daily or 4-hour chart**: slow decisions, less noise, cheaper mistakes.',
      ),
      warn('Shorter is not easier', 'Short timeframes feel like faster learning but bring more noise, higher costs and less time to think.'),
      note('One strategy, one style', 'Write the rules down and paper trade at least 30 trades before changing anything.'),
    ],
  },
]);

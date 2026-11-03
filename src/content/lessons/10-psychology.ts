import { chart, danger, defineModule, h, img, level, made, mark, note, ol, p, ul, walk, warn, widget, zone } from './helpers';

export const psychology = defineModule(10, 'psychology', 'Psychology', 'Most trading losses come from behaviour, not from analysis. Know the traps before you are in one.', [
  {
    id: 'fomo-revenge-overtrading',
    title: 'FOMO, revenge trading and overtrading',
    summary: 'Three ways emotion pushes you into trades your rules would never allow.',
    minutes: 6,
    blocks: [
      p('The hardest part of trading is doing what you planned when real feelings are involved. These three habits kill the most accounts.'),
      img(
        'crash-crowd',
        'A dense crowd of people in hats packed outside the New York Stock Exchange in 1929',
        'Crowds outside the New York Stock Exchange in the 1929 crash. Fear and greed spread through a crowd fast.',
      ),
      p('**FOMO**, fear of missing out, is jumping into a move already under way because everyone seems to be making money. You buy near the top with no plan.'),
      chart(
        made(walk([100, 102, 104, 112, 121, 126, 119, 113, 115, 109], { seed: 151, volumeSpikes: [22, 23, 24, 28] }), 'A FOMO entry. The move was obvious only after most of it had happened. Buying there meant a far-away stop and a nearby top.', [
          mark(10, 'A planned entry was here', 101.6),
          mark(28, 'FOMO buys here'),
          zone(29, 127, 53, 108, 'Late buyers sit in losses'),
        ]),
      ),
      ul(
        '**FOMO**: you feel rushed, have no stop in mind, and the reason is "it is going up". If the only sensible stop is far away, you are late. Let it go.',
        '**Revenge trading**: a bigger trade straight after a loss to win it back, made when judgement is worst. Rule: after two losses or -3% in a day, stop until tomorrow.',
        '**Overtrading**: too many trades from boredom or wanting action. Each pays fees, and most are setups you would skip on a calm day. Limit trades and require a written setup for each.',
      ),
      note('There is always another trade', 'Missing a setup costs nothing. Chasing one without a plan often costs a lot.'),
      danger('The pattern they share', 'All three are trades made to change how you feel, not because the chart met your rules. If the reason is an emotion, the answer is no.'),
      warn('Tag your emotions', 'The journal lets you tag each paper trade with how you felt: calm, FOMO, revenge, bored. After a few dozen trades the Analytics page will show you which feelings cost you money. Most people are surprised.'),
    ],
  },
  {
    id: 'loss-aversion',
    title: 'Loss aversion',
    summary: 'Losses hurt about twice as much as gains feel good. That bias makes traders cut winners and hold losers.',
    minutes: 6,
    blocks: [
      p('Losing $100 feels about twice as bad as gaining $100 feels good. This is **loss aversion**.'),
      img(
        'prospect-theory',
        'The prospect theory value function: an S-shaped curve that falls more steeply for losses than it rises for gains',
        'How gains and losses feel. The curve drops more steeply on the left: a loss hurts more than the same gain pleases.',
      ),
      ul(
        '**You hold losers too long**: closing makes the loss real, so you hope and move the stop.',
        '**You cut winners too early**: a profit feels like something you could lose, so you grab it.',
      ),
      p('The result is small wins and large losses, a bad risk/reward made entirely by behaviour: 2R winners shrink to 0.5R and 1R losses grow to 3R.'),
      chart(
        made(walk([104, 100.5, 102, 98, 99.5, 94, 96, 90, 88], { seed: 157 }), 'Loss aversion on a chart. The plan said to exit at the stop for a 1R loss. Moving the stop twice, then giving up, turned it into 4R.', [
          level(102, 'Entry 102'),
          level(99, 'Planned stop 99: a loss of 1R'),
          level(96, 'Stop moved to 96 "to give it room"'),
          level(90, 'Finally sold at 90: a loss of 4R'),
          mark(11, 'Enter'),
          mark(41, 'Give up', 88.6),
        ]),
      ),
      ul(
        '**"It will come back."** The times it does not are the ones that destroy accounts.',
        '**"I will sell at break-even."** The market does not care what you paid.',
        '**Averaging down** adds to exactly what is going wrong.',
        '**Sunk cost**: ask only "would I open this position now, at this price?" If not, close it.',
        '**Confirmation, recency and overconfidence**: you see what agrees with you, over-trust the last few trades, and size up just before a streak ends.',
      ),
      ol(
        '**Decide the exit before the entry**, and place it as a real order.',
        '**Risk an amount you do not mind losing.** A 1% loss is easy to accept.',
        '**Think in series.** One loss in a hundred is nothing.',
        '**Never widen a stop.**',
      ),
      note('A loss is a cost of doing business', 'A stopped-out trade at the planned size is your rent for being in the market. It is not a mistake.'),
      warn('Paper trading hides this', 'With pretend money nothing hurts. These feelings only appear with real money, so remember them before you ever trade for real.'),
    ],
  },
  {
    id: 'trading-plan',
    title: 'Why a trading plan matters',
    summary: 'A written set of rules made while calm, so you do not have to make decisions while stressed.',
    minutes: 5,
    blocks: [
      p('A **trading plan** writes down what you trade, when you enter and exit, how much you risk, and when you stop. It moves decisions from moments of stress to moments of calm, and lets you tell method from luck.'),
      ol(
        '**Markets and timeframe**: for example, BTC and ETH on the 4-hour chart.',
        '**Setups**: the exact conditions, such as an uptrend above the 50 EMA, a pullback to support and a bullish reaction candle.',
        '**Entry, stop and target**: enter on the close; stop below the swing low and at least 1.5 ATR away; first target 2R, then trail.',
        '**Risk**: 1% per trade, at most three open positions.',
        '**Stop-trading rules**: stop for the day after two losses or -3%; halve size after a 10% drawdown.',
        '**Review**: journal every trade, review weekly.',
      ),
      h('Before every trade'),
      ul(
        'Which setup is this, where is the stop and why, what is the risk/reward, and what size gives 1% risk?',
        'How do I feel? Rushed, angry or bored means no trade.',
      ),
      widget('position-size'),
      p('A **journal** shows whether the plan works. After 30 to 50 trades, the numbers show which setups pay and which rules you break. A loss that followed the plan is a **good trade**; a win that broke it is a **bad trade**.'),
      danger('Do not change the plan in the middle of a trade', 'Change rules only in a review, away from the screen, after enough trades.'),
      note('Start small and simple', 'One market, one timeframe, one setup, 1% risk. A plan on an index card that you follow beats a clever one you ignore.'),
      warn('In this app', 'Every paper trade is logged to the Journal automatically with a chart snapshot. Add your reasoning and an emotion tag, then use Analytics to see your results by setup and by emotion.'),
    ],
  },
]);

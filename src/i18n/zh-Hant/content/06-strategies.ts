// Traditional Chinese for content/lessons/06-strategies.ts and content/quizzes/06-strategies.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Strategies
  '1f9rakhvfsj': '交易策略',
  // Common ways to turn what you have learned into rules: when to enter, when to exit, and when each approach fails.
  'bu7elrfyl9': '把所學轉化為規則的常見方法：何時入場、何時出場，以及每種方法何時會失效。',
  // Trend following and the moving-average crossover
  'bpaew9to5z': '順勢交易與移動平均線交叉',
  // Buy what is already going up and hold until it stops. Simple, and uncomfortable in practice.
  'kzxhpg7tww': '買入已經在上升的東西，持有至它停下為止。簡單，但實際做起來並不舒服。',
  // A **strategy** is a set of rules that decides when you enter a trade, when you exit, and how much you trade. Rules matter because they can be tested on past data and followed without improvising under pressure.
  '2gi3cdo13q6': '**策略**是一套決定何時入場、何時出場和交易多少的規則。規則之所以重要，是因為它可以用過去的數據測試，並且讓你在壓力下照做而不用即興發揮。',
  // The idea
  '2e2134w7yp8': '概念',
  // **Trend following** assumes that a market already moving in one direction is more likely to continue than to reverse. You do not predict the trend. You wait for one to appear, join it, and stay until it ends.
  'tw7slgzzae': '**順勢交易**假設一個已經朝某方向移動的市場，延續的機會大於反轉。你不預測趨勢，而是等它出現、加入它，並留到它結束。',
  // A moving-average crossover system
  '1ho9jhu9d5g': '移動平均線交叉系統',
  // The classic rule set uses two moving averages, one fast and one slow:
  '25trwphtrf6': '經典的規則使用兩條移動平均線，一條快、一條慢：',
  // **Enter long** when the fast average crosses above the slow average.
  '1cyy58wqfte': '快線向上穿越慢線時**做多入場**。',
  // **Exit** when the fast average crosses back below.
  'yx6vaghhva': '快線向下穿越回去時**出場**。',
  // Optionally, go short on the downward cross instead of just exiting.
  '1g9l6qzkqm5': '也可以選擇在向下交叉時做空，而不只是出場。',
  // SPY with a 20-day and a 50-day EMA. Find each place the faster line crosses the slower one, and see how much of the following move a crossover trader would have caught.
  '7u60e2q1m3': 'SPY 加上 20 日和 50 日 EMA。找出每一個快線穿越慢線的地方，看看交叉交易者能捕捉到之後走勢的多少。',
  // What to expect
  'jg7uxrpl9s': '可以預期甚麼',
  // **Low win rate, big winners.** Trend systems often win only 30% to 45% of the time. They make money because the few big trends pay for many small losses.
  'zv1t46hjub': '**低勝率、大勝利。**順勢系統往往只有 30% 至 45% 的勝率。它們賺錢，是因為少數大趨勢足以支付很多小虧損。',
  // **Late in, late out.** You never buy the bottom or sell the top. You give back part of every trend before the exit signal comes.
  'qceowbawzk': '**遲入場、遲離場。**你永遠買不到底部，也賣不到頂部。在出場訊號出現之前，你會回吐每段趨勢的一部分。',
  // **Long losing streaks in ranges.** In a sideways market every crossover is a whipsaw, and markets range a lot of the time.
  '1tdq4qrwm2f': '**在區間市中長時間連續虧損。**在橫行市中，每次交叉都是來回打臉，而市場很多時候都在區間內。',
  // Common improvements
  '2d3dnyz9iyh': '常見的改良',
  // A **trend filter**: only take long signals when price is above a long average such as the 200.
  'lolmtswccd': '**趨勢過濾器**：只在價格高於長期平均線（例如 200）時才接受做多訊號。',
  // A **trailing stop**: instead of waiting for the cross back, move your stop-loss up behind price as it rises, for example 3 ATR below the highest close.
  '137z24q44x1': '**移動止蝕**：不等反向交叉，而是在價格上升時把止蝕跟在價格後面上移，例如放在最高收市價下方 3 個 ATR。',
  // A **volatility filter**: skip signals when the averages are flat and tangled together.
  '6rt7ytlww': '**波幅過濾器**：當平均線平坦而且糾纏在一起時，跳過訊號。',
  // Test it yourself
  '2bhhqwbcq7i': '自己測試',
  // The Backtester has an EMA crossover preset. Run it on different symbols and periods and look at the win rate next to the total return.
  'qn4g4aq9s4': '回測器有一個 EMA 交叉的預設策略。用不同的品種和期間執行它，並比較勝率與總回報。',
  // The hard part is psychological
  '2cvzhsrox64': '難的是心理部分',
  // Following a trend system means taking many small losses in a row and sitting through pullbacks in winning trades without closing early. Most people abandon the rules just before the trade that would have paid for everything.
  '2cwil6wtn9y': '跟隨順勢系統，意味著接受連續多次小虧損，並在盈利交易回調時忍住不提早平倉。大部分人都在本來足以抵銷一切的那宗交易之前，放棄了規則。',
  // Breakout trading
  '2ow2y62z4l': '突破交易',
  // Enter when price escapes a range, on the bet that a new move is starting.
  '28hbhj0gch': '在價格衝出區間時入場，押注新的走勢正在開始。',
  // **Breakout trading** enters when price moves beyond a level that has been containing it: the top of a range, a previous high, the edge of a triangle. The idea is that once the orders defending a level are gone, price can travel quickly.
  '5vl4ot4n46': '**突破交易**在價格越過一直困住它的價位時入場：區間的頂部、之前的高位、三角形的邊緣。概念是一旦守住價位的訂單消失，價格就可以快速移動。',
  // A simple rule set
  '1qzzw2e75cb': '一套簡單的規則',
  // Find a clear range or level that has held at least two or three times.
  '42xdp494ft': '找一個至少守住兩三次的明確區間或價位。',
  // **Enter long** on a candle that closes above resistance (or short on a close below support).
  '1ul0zl7889u': '陰陽燭收市高於阻力位時**做多入場**（或收市低於支持位時做空）。',
  // **Stop-loss** just back inside the range.
  '1dvqa0uvot0': '**止蝕**放在剛好回到區間內的位置。',
  // **Target** the height of the range projected from the breakout, or trail a stop.
  '1b8fm6a0lpk': '**目標**是由突破點投射區間的高度，或使用移動止蝕。',
  // A range breakout trade. Entry on the close above resistance, stop back inside the range, target one range-height above.
  '1ls6zwco7c6': '一宗區間突破交易。收市高於阻力位時入場，止蝕回到區間內，目標在上方一個區間高度。',
  // Resistance: entry on a close above
  '1if723d7f4u': '阻力位：收市高於此處入場',
  // Stop-loss back inside the range
  '26texi5ukvf': '止蝕回到區間內',
  // Target: range height projected up
  'hjx0psosl4': '目標：向上投射區間高度',
  // Entry
  '5p496sooaa': '入場',
  // A rule you can test: the channel breakout
  'nm0mrqbzto': '一條可以測試的規則：通道突破',
  // A mechanical version buys when price makes a new **20-day high** and sells when it makes a new **10-day low**. No judgement is needed, which makes it easy to backtest. It is a trend-following system triggered by breakouts.
  'y32pfqf840': '機械化的版本在價格創 **20 日新高**時買入，在創 **10 日新低**時賣出。它不需要判斷，所以很容易回測。這是由突破觸發的順勢系統。',
  // **Many fakeouts.** A large share of breakouts fail and return inside the range. Individual losses should be small because the stop is close.
  '2d81rtdb5yx': '**很多假突破。**很大一部分突破會失敗並回到區間內。由於止蝕很近，每次虧損都應該很小。',
  // **Occasional large winners** when a breakout starts a real trend.
  '1w6v3f8ie74': '**偶爾有大勝利**，當突破展開一段真正的趨勢時。',
  // **Slippage.** Everyone sees the same level, so price can jump when it breaks and your fill may be worse than planned.
  'vxnu2sy09o': '**滑價。**每個人都看到同一個價位，所以突破時價格可能跳升，你的成交價可能比計劃差。',
  // Filters that help
  '263r97q8bcc': '有幫助的過濾器',
  // **Volume**: require the breakout candle to have clearly above-average volume.
  'j4yc4uhimx': '**成交量**：要求突破陰陽燭的成交量明顯高於平均。',
  // **Trend direction**: only take breakouts in the direction of the larger trend.
  '230kvpo557g': '**趨勢方向**：只做順著較大趨勢方向的突破。',
  // **Tight range first**: breakouts from a narrow, quiet range (a Bollinger squeeze) tend to travel further.
  '2aormz9fbsh': '**先有窄區間**：從窄而平靜的區間（保力加收窄擠壓）出現的突破，往往走得更遠。',
  // **Retest entry**: wait for price to come back to the level and hold.
  '15ocvnkbdz4': '**回測入場**：等價格回到價位並守住。',
  // Do not chase
  '16t6qk7y0u9': '不要追價',
  // If the breakout candle has already run far beyond the level, your stop is far away and the trade is poor. Let it go, or wait for a retest.
  '23xul342zzd': '如果突破陰陽燭已經遠遠超出價位，你的止蝕就會很遠，交易也很差。放過它，或者等待回測。',
  // Mean reversion
  '207t666j5oa': '均值回歸',
  // Bet that a price stretched far from its average will come back. High win rate, dangerous losers.
  '1p5aobkivop': '押注偏離平均很遠的價格會回來。勝率高，但虧損的交易很危險。',
  // **Mean reversion** is the opposite of trend following. It assumes that when price moves unusually far from its average, it tends to return. "Mean" is just another word for average. You buy what has fallen hard and sell what has risen hard.
  '1jsi2708gad': '**均值回歸**與順勢交易相反。它假設當價格異常地遠離平均時，往往會回來。「均值」只是平均的另一個說法。你買入急跌的東西，賣出急升的東西。',
  // A simple rule set with RSI
  '21f4ck2jpmk': '用 RSI 的簡單規則',
  // **Enter long** when the 14-period RSI falls below 30 (oversold).
  'yhe7w0k2fw': '14 週期 RSI 跌穿 30（超賣）時**做多入場**。',
  // **Exit** when RSI rises back above 50, or price returns to its 20-period average.
  '25da1a2xp5p': 'RSI 回升至 50 以上，或價格回到 20 週期平均線時**出場**。',
  // **Stop-loss** at a fixed distance, for example 2 ATR below entry.
  'mvbmixv7ki': '**止蝕**放在固定距離，例如入場價下方 2 個 ATR。',
  // A rule set with Bollinger Bands
  'huofwlzjaz': '用保力加通道的規則',
  // **Enter long** when price closes below the lower band.
  '1jtvhwj910z': '價格收市低於下軌時**做多入場**。',
  // **Exit** at the middle band (the 20-period average).
  '2gct6djuz43': '在中軌（20 週期平均線）**出場**。',
  // SPY with Bollinger Bands and RSI. Look for closes below the lower band with RSI under 30, and whether price then returned to the middle band.
  '21u448sg0d4': 'SPY 加上保力加通道和 RSI。找出收市低於下軌而 RSI 低於 30 的地方，看看價格之後有沒有回到中軌。',
  // **High win rate, small winners.** Most stretched moves do snap back a little, so 60% to 70% winners is common. Each win is small because the target is nearby.
  '16jwxcvtzu': '**高勝率、小勝利。**大部分被拉伸的走勢確實會小幅回彈，所以 60% 至 70% 的勝率很常見。每次勝利都很小，因為目標很近。',
  // **Rare, large losers.** Sometimes price is stretched because something has really changed, and it keeps going. One such trade can erase many wins.
  '7ditbl5dev': '**罕見但巨大的虧損。**有時價格被拉伸，是因為真的有甚麼改變了，它會繼續走下去。一宗這樣的交易就能抹去很多次勝利。',
  // **Best in ranges.** In a strong trend, "oversold" keeps getting more oversold.
  'r29j64nf24': '**在區間市中最好。**在強勁的趨勢中，「超賣」會變得愈來愈超賣。',
  // Making it safer
  'gmjffw7w7d': '令它更安全',
  // **Trade with the larger trend.** Buy oversold dips only when the long-term trend is up; skip them in a downtrend.
  '4ksfgnuc22': '**順著較大的趨勢交易。**只在長期趨勢向上時買入超賣的回落；在下跌趨勢中跳過它們。',
  // **Always use a stop-loss.** The whole danger of this style is the trade that does not come back.
  '1iw3jmh5uly': '**永遠使用止蝕。**這種風格的全部危險，就是那宗回不來的交易。',
  // **Never add to a loser.** Buying more as it falls ("averaging down") turns a small loss into a ruinous one.
  '162qk92e76l': '**永遠不要向虧損的持倉加碼。**在下跌時買入更多（「向下攤平」）會把小虧損變成毀滅性的虧損。',
  // Why both styles can work
  '29ls5e16y82': '為甚麼兩種風格都可以有效',
  // Trend following and mean reversion sound contradictory, but they operate on different timescales and market conditions. Prices tend to revert over short stretches inside ranges and to trend over longer stretches. Neither works all the time.
  '1al5yx5t2hq': '順勢交易和均值回歸聽起來互相矛盾，但它們在不同的時間尺度和市況下運作。價格往往在區間內的短時間內回歸，在較長時間內則走出趨勢。兩者都不是任何時候都有效。',
  // "It cannot go any lower"
  'widzkj3895': '「它不可能再低了」',
  // It can. A stock that has fallen 80% can fall another 80%. Being oversold is a description of the past, not a floor.
  'ipja9hal38': '它可以。一隻已經跌了 80% 的股票，可以再跌 80%。超賣只是對過去的描述，不是底部。',
  // The support and resistance bounce
  '1s9jujoc5hz': '支持位和阻力位反彈',
  // Buy at support, sell at resistance. A range strategy with a naturally tight stop.
  '1scp2x7zpbm': '在支持位買入，在阻力位賣出。一種止蝕天然很近的區間策略。',
  // The **bounce** strategy trades inside a range. Instead of waiting for price to break a level, you bet that the level will hold again: buy near support, sell near resistance.
  '22x0f5bhlos': '**反彈**策略在區間內交易。你不等價格突破價位，而是押注價位會再次守住：在支持位附近買入，在阻力位附近賣出。',
  // The rules
  '1gdl6sjojw7': '規則',
  // Identify a range with clear support and resistance, each tested at least twice.
  '2bmwtzubogs': '找出一個有明確支持位和阻力位的區間，每個價位至少被測試過兩次。',
  // Wait for price to reach support **and show a reaction**: a hammer, a bullish engulfing candle, or simply a candle that closes back up.
  '1rikze4ksct': '等價格到達支持位**並出現反應**：一個錘頭、一支看漲吞沒陰陽燭，或者只是一支收市回升的陰陽燭。',
  // **Enter long** after that reaction candle.
  '1dnduvnjte6': '在那支反應陰陽燭之後**做多入場**。',
  // **Stop-loss** just below the support zone.
  'c633akx0qo': '**止蝕**放在支持區域下方少許。',
  // **Take profit** a little before resistance.
  '2b597cel6ip': '在阻力位之前少許**止賺**。',
  // A bounce trade. Price returns to support for the third time, shows a reaction, and travels back towards resistance.
  '1efuknw91y5': '一宗反彈交易。價格第三次回到支持位，出現反應，然後回升至阻力位。',
  // Resistance
  '6rmylrnh3e': '阻力位',
  // Support
  '1osc7jo1bd9': '支持位',
  // Stop-loss below support
  '2c3vlbhkqa3': '止蝕在支持位之下',
  // Take-profit before resistance
  '3k7imt029x': '止賺在阻力位之前',
  // Entry after the reaction
  '4x576to2h': '出現反應後入場',
  // Why the risk/reward is attractive
  'mjy906difi': '為甚麼風險回報吸引',
  // The stop sits just beyond the level, so the possible loss is small. The target is the other side of the range, which is much further away. In the chart above the risk is about 1.5 points and the reward about 7.
  'cgzgm2b6ky': '止蝕就在價位之外，所以可能的虧損很小。目標在區間的另一邊，遠得多。在上圖中，風險約 1.5 點，回報約 7 點。',
  // It works until the range ends. The last trade in every range is a loser, because that is the one where the level breaks.
  '1kdec1n0hg1': '它在區間結束之前都有效。每個區間的最後一宗交易都會虧損，因為那正是價位被突破的一宗。',
  // Levels weaken with each test, as the waiting orders get used up.
  '86w522qh7p': '價位每被測試一次就會減弱，因為排隊的訂單被消耗了。',
  // Entering without waiting for a reaction means buying into falling prices, which is called **catching a falling knife**.
  '1t8npfdhwm': '不等反應就入場，代表在價格下跌時買入，這叫**接下墜的刀**。',
  // **Strong trend arriving at the level?** A level tested by a steep, high-volume move is more likely to break. Stand aside.
  '1jtdx6ehip2': '**強勁的趨勢正衝向價位？**被陡峭、大成交量的走勢測試的價位更容易被突破。不要參與。',
  // **Middle of the range?** There is no edge there. The trade only makes sense near the edges.
  '1p239z5hm6y': '**在區間中間？**那裡沒有優勢。這種交易只在邊緣附近才合理。',
  // Bounce and breakout are two sides of one level
  '9r7ffu9n83': '反彈和突破是同一個價位的兩面',
  // At every level you are choosing between "it holds" and "it breaks". Range conditions and weak momentum favour the bounce; a trend pressing on the level with rising volume favours the breakout.
  '12dkogy43g1': '在每一個價位，你都在「守住」和「突破」之間選擇。區間市況和疲弱的動能有利於反彈；趨勢以上升的成交量壓向價位則有利於突破。',
  // Scalping, day, swing and position trading
  '157jhs1rf13': '超短線、日內、波段和長線持倉交易',
  // Four styles defined by how long a trade lasts. Pick the one that fits your time and temperament.
  '1p9k3wpvuo9': '按一宗交易持續多久來區分的四種風格。選擇適合你時間和性情的一種。',
  // Any strategy can be run on any timeframe. How long you hold a trade is called your **trading style**, and it changes almost everything about the experience: how much time it takes, what it costs in fees, and how stressful it is.
  'fzs5jaxqds': '任何策略都可以在任何時間週期執行。你持倉多久叫你的**交易風格**，它幾乎改變了一切體驗：要花多少時間、手續費成本多少，以及壓力有多大。',
  // Scalping
  'm14ml4oja4': '超短線交易',
  // **Scalping** means holding for seconds to minutes, aiming for very small moves many times a day, on 1-minute charts or faster. Because each profit is tiny, fees and the spread take a large share. It needs constant attention and fast execution. It is the hardest style for a beginner.
  'yc8tprj44d': '**超短線交易**指持倉幾秒至幾分鐘，在 1 分鐘或更快的圖表上，每天多次捕捉非常細小的波動。因為每次盈利都很小，手續費和差價會佔去很大比例。它需要時刻專注和快速執行。這是新手最難掌握的風格。',
  // Day trading
  '1gakl2hk2uv': '日內交易',
  // **Day trading** means opening and closing every position within the same day, on 5-minute to 1-hour charts. There is no overnight risk, since you are never holding when the market gaps on news. It needs several free hours while the market is active.
  '25u3s0ma3im': '**日內交易**指在同一日內開倉並平掉所有持倉，使用 5 分鐘至 1 小時圖。沒有隔夜風險，因為市場因新聞裂口時你從不持倉。它需要在市場活躍時有幾個小時的空閒時間。',
  // Swing trading
  '18uumeu9zrw': '波段交易',
  // **Swing trading** means holding for days to a few weeks, aiming to catch one swing of a trend, on 4-hour and daily charts. You check charts once or twice a day. Costs are low relative to the size of the moves. You do carry overnight and weekend risk.
  '11jd3a4yhdj': '**波段交易**指持倉幾日至幾星期，在 4 小時和日線圖上捕捉趨勢中的一段波動。你每天看一兩次圖表。相對於走勢的大小，成本很低。但你要承受隔夜和週末的風險。',
  // Position trading
  'exglm94xjt': '長線持倉交易',
  // **Position trading** means holding for weeks to months or more, following the major trend on daily and weekly charts. It needs the least time and the most patience, and usually involves fundamentals as well as charts.
  '26r26t15f1r': '**長線持倉交易**指持倉幾星期至幾個月或更長，在日線和週線圖上跟隨主要趨勢。它需要的時間最少、耐性最多，而且通常除了圖表之外還會看基本因素。',
  // A year of SPY on the daily chart: the view a swing or position trader works from. A swing trader would aim to catch one leg of a move like these, lasting days to weeks. A scalper would be working inside a single one of these candles.
  'rj33r6p9np': 'SPY 一年的日線圖：波段或長線交易者看的畫面。波段交易者會嘗試捕捉這樣的一段走勢，為期幾日至幾星期。超短線交易者則是在其中一支陰陽燭之內工作。',
  // **Time needed**: scalping most, position trading least.
  '10j9uez9g6m': '**所需時間**：超短線最多，長線持倉最少。',
  // **Number of trades**: scalping many, position trading few.
  '3cx68oi1a2': '**交易次數**：超短線很多，長線持倉很少。',
  // **Cost of fees and spread relative to profit**: highest for scalping, lowest for position trading.
  'sb7hf36ja8': '**手續費和差價相對盈利的成本**：超短線最高，長線持倉最低。',
  // **Stop distance**: tight for scalping, wide for position trading, so position sizes are smaller.
  '1uprs0kmqwf': '**止蝕距離**：超短線很窄，長線持倉很闊，所以持倉規模較小。',
  // Choosing
  '20ii76nr4wp': '如何選擇',
  // Have a job? Swing trading fits around it. Day trading and scalping do not.
  '151m3eqwcvz': '有工作？波段交易可以配合你的時間。日內交易和超短線則不行。',
  // Find it hard to sit still while a trade is open? Shorter holds may suit you, but watch the costs.
  'yqewidgau9': '持倉期間很難安坐？較短的持倉時間可能適合你，但要留意成本。',
  // New to this? Start with **swing trading on the daily or 4-hour chart**. Decisions are slow, noise is lower, and mistakes are cheaper.
  'yw850kzqjf': '剛開始？從**日線圖或 4 小時圖上的波段交易**開始。決策慢、雜訊少，犯錯的代價也較低。',
  // Shorter is not easier
  '276feraiqae': '較短不等於較容易',
  // Short timeframes feel like faster learning and more opportunity. In practice they mean more noise, higher costs and less time to think. Most beginners who start by scalping lose quickly.
  'zs4wrjr717': '短時間週期感覺學得更快、機會更多。實際上它代表更多雜訊、更高成本和更少思考時間。大部分以超短線起步的新手都很快虧錢。',
  // One strategy, one style
  'fpjouxtjcd': '一個策略，一種風格',
  // Pick one strategy and one style, write down the rules, and trade it on paper for at least 30 trades before changing anything. Switching approaches every few losses means you never find out whether any of them work.
  '2b7pibqr62u': '選擇一個策略和一種風格，寫下規則，並在改變任何東西之前，用模擬交易做至少 30 宗交易。每輸幾次就轉換方法，代表你永遠不會知道哪一種有效。',
  // What does trend following assume?
  '17fnmikxsye': '順勢交易假設甚麼？',
  // Prices always return to their average
  'hf2hdpkppi': '價格永遠會回到平均',
  // A market already moving one way is more likely to continue than reverse
  '1s39izgukso': '一個已經朝某方向移動的市場，延續的機會大於反轉',
  // Tops and bottoms can be predicted
  '59bdfyws97': '頂部和底部可以預測',
  // Volume does not matter
  'wtovti24xh': '成交量不重要',
  // You do not predict the trend. You wait for one, join it and stay until it ends.
  'quipjb89fi': '你不預測趨勢。你等它出現、加入它，並留到它結束。',
  // In a moving-average crossover system, when do you enter long?
  'xph19l1hlw': '在移動平均線交叉系統中，何時做多入場？',
  // When the fast average crosses above the slow average
  '1pqt67k9pk5': '快線向上穿越慢線時',
  // When RSI is below 30
  '1wvuirmdr2t': 'RSI 低於 30 時',
  // When price touches support
  '1rtwc7xfjqz': '價格觸及支持位時',
  // At the market open
  'qcscgffyax': '開市時',
  // The fast average crossing above the slow one is the entry; the cross back is the exit.
  '1pqywmc1bu6': '快線向上穿越慢線是入場；反向穿越是出場。',
  // A trend-following system wins 35% of its trades and is still profitable. How?
  '1gwie14gdlt': '一個順勢系統只贏 35% 的交易，但仍然有利可圖。怎樣做到？',
  // It cannot be
  '1y24liyp8c1': '不可能',
  // The few winners are much larger than the many small losses
  '1v8dso7b64v': '少數的勝利遠大於眾多的小虧損',
  // It hides its losses
  '1ekpynskr1c': '它隱藏了虧損',
  // It uses no stop-loss
  '171hvvzai0d': '它不用止蝕',
  // Trend systems rely on occasional large trends paying for many small losing trades.
  '11cznvl95pv': '順勢系統依靠偶爾出現的大趨勢，去支付很多小的虧損交易。',
  // Where does a crossover system perform worst?
  '12yw9ft3z1k': '交叉系統在哪裡表現最差？',
  // In long steady trends
  '2etb19fwytl': '長而穩定的趨勢',
  // In sideways ranges
  '14p5n0ao0po': '橫行的區間',
  // In high-volume markets
  '28uq0oktmw9': '大成交量的市場',
  // On daily charts
  '10ztak0edp2': '日線圖',
  // In a range the averages tangle and every cross is a whipsaw.
  '2d2bfkzf7ma': '在區間市中，平均線會糾纏，每次交叉都是來回打臉。',
  // In a range breakout trade above resistance, where does the stop-loss usually go?
  'yac0evyja6': '在升穿阻力位的區間突破交易中，止蝕通常放在哪裡？',
  // Far above the entry
  '22ovz8qfjg4': '遠高於入場價',
  // Just back inside the range
  '1sqcr320lkt': '剛好回到區間內',
  // At the bottom of the range
  'o585edje37': '區間的底部',
  // Nowhere
  '1wxfg807tsu': '不放',
  // If price returns inside the range the breakout has failed, so you want to be out with a small loss.
  '3dz3850jzl': '如果價格回到區間內，突破就失敗了，所以你希望以小虧損離場。',
  // What is a simple mechanical breakout rule?
  'l0ib9tvo3s': '甚麼是一條簡單的機械化突破規則？',
  // Buy when RSI is below 30
  '2ehz4cy668x': 'RSI 低於 30 時買入',
  // Buy a new 20-day high, sell a new 10-day low
  'yq57azumd': '創 20 日新高時買入，創 10 日新低時賣出',
  // Buy every Monday
  '236w8yb67wy': '每個星期一買入',
  // Buy when price touches the lower Bollinger Band
  '116u3sf0419': '價格觸及保力加通道下軌時買入',
  // A channel breakout needs no judgement, which makes it easy to backtest.
  '1ad9ugiax1g': '通道突破不需要判斷，所以很容易回測。',
  // Which filter makes a breakout more trustworthy?
  '14a8mxucuf5': '哪個過濾器令突破更可信？',
  // Below-average volume
  'qpi8s30zf8': '低於平均的成交量',
  // Clearly above-average volume on the breakout candle
  '26qsbajpk1w': '突破陰陽燭的成交量明顯高於平均',
  // A wick above the level
  '1wt1q78dwif': '影線高於價位',
  // Trading against the larger trend
  '1oy4ivb75wr': '逆著較大的趨勢交易',
  // Volume shows real participation behind the move.
  '14orl2gps5s': '成交量顯示走勢背後有真正的參與。',
  // The breakout candle has already run far above the level. The best response is usually to:
  'lk22vlkzti': '突破陰陽燭已經遠遠高於價位。通常最好的做法是：',
  // Buy immediately with a wide stop
  'avoezec207': '立即買入並使用很闊的止蝕',
  // Skip it or wait for a retest
  'xt1ai1xnbw': '放過它或等待回測',
  // Short it
  '9zl1ex0voz': '做空它',
  // Double your size
  'mzthhu71vn': '把規模加倍',
  // Buying far from the level means a distant stop and a poor risk/reward.
  'cqx9gsnnqr': '在遠離價位的地方買入，代表止蝕很遠，風險回報很差。',
  // What does mean reversion bet on?
  '2e1evk7do7a': '均值回歸押注甚麼？',
  // Trends continuing
  '8z1qvubr5j': '趨勢延續',
  // A price stretched far from its average returning towards it
  '258zm71cv7v': '偏離平均很遠的價格回到平均附近',
  // Breakouts succeeding
  '1vddeii3fud': '突破成功',
  // Volume rising
  '121ak92jy7e': '成交量上升',
  // "Mean" is another word for average. The bet is on a snap back.
  '1hu60voi7nr': '「均值」是平均的另一個說法。押注的是回彈。',
  // What is the typical profile of a mean-reversion strategy?
  '1nmixu8cwmn': '均值回歸策略的典型表現是怎樣的？',
  // Low win rate, large winners
  'o7av8c0nb5': '低勝率、大勝利',
  // High win rate, small winners, rare large losers
  '1hfxdq6baqj': '高勝率、小勝利、罕見但巨大的虧損',
  // It never loses
  '2241fy1hvc4': '它從不虧損',
  // Equal wins and losses
  'ox7ytgbggu': '勝負各半',
  // Most stretches snap back a little. The danger is the one that keeps going.
  '1i6wst0ebun': '大部分被拉伸的走勢都會小幅回彈。危險在於那個繼續走下去的。',
  // In which market is mean reversion most dangerous?
  '15hs6lkn4xs': '均值回歸在哪種市場最危險？',
  // A quiet range
  '1zsaiexpbnq': '平靜的區間',
  // A strong trend
  '11wkfknck44': '強勁的趨勢',
  // A market with tight spreads
  '1vcnheulhzs': '差價很窄的市場',
  // A weekend
  '21gce6pqn2y': '週末',
  // In a strong trend, oversold keeps getting more oversold.
  '2g5nj7463xg': '在強勁的趨勢中，超賣會變得愈來愈超賣。',
  // What is "averaging down"?
  '1qp5dct5b1e': '甚麼是「向下攤平」？',
  // Lowering your leverage
  '4ayli7bybr': '降低槓桿',
  // Buying more of a position as it falls
  '116uabjz10z': '在持倉下跌時買入更多',
  // Using a longer moving average
  '29nfogxh8z1': '使用較長的移動平均線',
  // Taking partial profit
  '1ioqv1tta3g': '部分止賺',
  // Adding to a loser multiplies the damage if price keeps falling. Avoid it.
  '1ujcqtayvdq': '向虧損的持倉加碼，會在價格繼續下跌時把損害成倍放大。要避免。',
  // Where does the bounce strategy enter long?
  '2ariyed9772': '反彈策略在哪裡做多入場？',
  // In the middle of the range
  '1vg5il8ymou': '區間的中間',
  // Near support, after price shows a reaction
  'jjmzjovloy': '在支持位附近、價格出現反應之後',
  // Above resistance
  '1o2jrh05tn': '阻力位之上',
  // At a new all-time high
  'qvj50yb5c': '歷史新高',
  // You want price at the edge of the range and evidence that buyers are responding.
  'y7scpadm4i': '你需要價格在區間的邊緣，以及買方正在回應的證據。',
  // Why wait for a reaction candle before entering at support?
  '2acev4q6y54': '為甚麼要在支持位等反應陰陽燭出現才入場？',
  // It lowers fees
  'ju1jkt1rwc': '它可以降低手續費',
  // Without it you are buying into falling prices with no sign the level is holding
  '1ifhy32ug9f': '沒有它，你是在價格下跌、而價位守住與否毫無跡象時買入',
  // It is required by the exchange
  '28pnuo0nl67': '交易所要求這樣做',
  // It guarantees a profit
  '2gaeebycdc': '它保證有盈利',
  // Buying a level blindly is called catching a falling knife.
  'ls6nlmxm7w': '盲目在價位買入叫接下墜的刀。',
  // Why can the bounce offer a good risk/reward?
  'hwqxya1nuy': '為甚麼反彈策略可以提供好的風險回報？',
  // The stop is close (just beyond the level) while the target is the far side of the range
  '1fz03kfyhg3': '止蝕很近（剛好在價位之外），目標則在區間的另一邊',
  // It uses leverage
  '1bg7ooqnqpy': '它使用槓桿',
  // Fees are lower
  'zz5dcgm3yz': '手續費較低',
  // A small defined risk against a larger possible reward is the appeal.
  'qgxe7e0cm1': '它吸引之處在於細小而明確的風險，對應較大的可能回報。',
  // A steep, high-volume move is pressing on support. The level is:
  '2b2i3vn48uk': '一段陡峭、大成交量的走勢正壓向支持位。這個價位：',
  // More likely to hold
  '2g2913pip2h': '更有可能守住',
  // More likely to break; better to stand aside
  'p8alo1a9gu': '更有可能被突破；最好不要參與',
  // Certain to hold
  'rn1c68ak26': '一定會守住',
  // Irrelevant
  '1eynjfex5q8': '無關重要',
  // Strong momentum into a level favours a break rather than a bounce.
  '16pntmilw2r': '強勁的動能衝向價位，有利於突破而不是反彈。',
  // Which style holds trades for days to a few weeks?
  '13z6zhopi1i': '哪種風格持倉幾日至幾星期？',
  // Swing trading aims to catch one swing of a trend on the 4-hour and daily charts.
  'e2ctp4ssdy': '波段交易嘗試在 4 小時和日線圖上捕捉趨勢中的一段波動。',
  // Why are fees and spread a bigger problem for scalpers?
  'nh6yxbnn4p': '為甚麼手續費和差價對超短線交易者的影響更大？',
  // Scalpers pay higher rates
  'mkf8agkkv9': '超短線交易者付的費率較高',
  // Each profit is tiny, so costs take a large share of it
  '1t9rufi1sih': '每次盈利都很小，所以成本佔了很大比例',
  // Scalpers trade larger instruments
  'nuzmbqaddo': '超短線交易者買賣較大的品種',
  // They are not a problem
  '41kayzowcg': '它們不是問題',
  // When you aim for very small moves, a fixed cost per trade is a large fraction of the gain.
  'o2athecpva': '當你瞄準非常細小的波動，每宗交易的固定成本就佔了盈利的很大部分。',
  // What risk does a day trader avoid that a swing trader accepts?
  '5u3u5zi41q': '日內交易者避開了哪種波段交易者要承受的風險？',
  // Slippage
  '2ffkxy4rmk2': '滑價',
  // Overnight risk: price gapping while the position is held
  '22rv3bxolot': '隔夜風險：持倉期間價格出現裂口',
  // Fees
  'hluwovic4z': '手續費',
  // Liquidation
  '1oz08kgjh27': '強制平倉',
  // Day traders close everything before the end of the day, so overnight news cannot gap against them.
  '20sds65iu3h': '日內交易者在當日結束前平掉所有持倉，所以隔夜新聞無法令價格向不利方向裂口。',
  // Which style is usually recommended for a beginner with a job?
  'zu3op6ew2e': '通常會推薦有工作的新手用哪種風格？',
  // Scalping on the 1-minute chart
  '1xm2bfjxdsy': '在 1 分鐘圖上做超短線',
  // Swing trading on the daily or 4-hour chart
  '1bm0wvab67s': '在日線圖或 4 小時圖上做波段交易',
  // Day trading on the 5-minute chart
  '1nq8y8p841s': '在 5 分鐘圖上做日內交易',
  // Whatever is most exciting
  '1j05eqa9qst': '最刺激的那一種',
  // Slower decisions, less noise, lower costs, and it fits around other commitments.
  'oqyklgx4jo': '決策較慢、雜訊較少、成本較低，而且可以配合其他事務。',
} satisfies Record<string, string>;

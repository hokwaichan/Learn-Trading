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
  // A **strategy** is a set of rules for entering, exiting and sizing a trade. Written rules can be tested on past data and followed without improvising under pressure.
  '1jhhz43z7w1': '**策略**是一套關於入場、出場和持倉規模的規則。寫下來的規則可以用過去數據測試，也能在壓力下照做而不臨場發揮。',
  // **Trend following** bets that a market already moving will keep moving. You do not predict the trend; you join it once it appears and stay until it ends. The classic rules use two moving averages:
  'hv7kjmlttj': '**順勢交易**押注已在移動的市場會繼續移動。你不預測趨勢；趨勢出現後加入，一直持有到它結束。經典規則用兩條移動平均線：',
  // **Enter long** when the fast average crosses above the slow one.
  '1xbxv9so7v0': '快線升穿慢線時**做多入場**。',
  // **Exit** when it crosses back below.
  '2dfv36c4pps': '跌穿回去時**出場**。',
  // Optionally, go short on the downward cross instead of just exiting.
  '1g9l6qzkqm5': '也可以選擇在向下交叉時做空，而不只是出場。',
  // SPY with a 20-day and a 50-day EMA. Find each place the faster line crosses the slower one, and see how much of the following move a crossover trader would have caught.
  '7u60e2q1m3': 'SPY 加上 20 日和 50 日 EMA。找出每一個快線穿越慢線的地方，看看交叉交易者能捕捉到之後走勢的多少。',
  // **Low win rate, big winners**: often 30% to 45% wins, paid for by a few big trends.
  '33jpwv3kx7': '**低勝率、大勝利**：勝率常只有 30% 至 45%，靠幾段大趨勢彌補。',
  // **Late in, late out**: you give back part of every trend before the exit.
  'hdlrc5vrv7': '**遲入場、遲離場**：每段趨勢在出場前都要回吐一部分。',
  // **Losing streaks in ranges**: every crossover is a whipsaw.
  '27yankzlssw': '**區間市中連續虧損**：每次交叉都是來回打臉。',
  // Common fixes: only buy above the 200-day average, trail a stop such as 3 ATR below the highest close, and skip signals when the averages are flat and tangled.
  '1ushoxgtaf9': '常見改進：只在 200 日平均線之上買入，使用移動止蝕（例如最高收市價之下 3 個 ATR），以及在平均線平坦糾纏時跳過訊號。',
  // Test it yourself
  '2bhhqwbcq7i': '自己測試',
  // The Backtester has an EMA crossover preset. Run it on different symbols and periods and look at the win rate next to the total return.
  'qn4g4aq9s4': '回測器有一個 EMA 交叉的預設策略。用不同的品種和期間執行它，並比較勝率與總回報。',
  // The hard part is psychological
  '2cvzhsrox64': '難的是心理部分',
  // Most people abandon the rules after a string of small losses, just before the trade that would have paid for them all.
  '1sgftn6k59x': '大部分人在連續幾次小虧損後放棄規則，就在那宗本可彌補一切的交易之前。',
  // Breakout trading
  '2ow2y62z4l': '突破交易',
  // Enter when price escapes a range, on the bet that a new move is starting.
  '28hbhj0gch': '在價格衝出區間時入場，押注新的走勢正在開始。',
  // **Breakout trading** enters when price escapes a level that has held it: a range top, a previous high, a triangle edge. With the defending orders gone, price can travel fast.
  'mwbshikcr': '**突破交易**在價格逃離一直困住它的價位時入場：區間頂部、之前的高點、三角形邊緣。防守的訂單沒有了，價格就能快速移動。',
  // Find a level that has held two or three times.
  '1sm2mhikyfc': '找一個守住過兩三次的價位。',
  // **Enter** on a candle that closes beyond it.
  '193ul2mn8nv': '在收市越過它的陰陽燭**入場**。',
  // **Stop-loss** just back inside the range.
  '1dvqa0uvot0': '**止蝕**放在剛好回到區間內的位置。',
  // **Target** the range height from the breakout, or trail a stop.
  '1sulor9o4ia': '**目標**是由突破點投射區間高度，或使用移動止蝕。',
  // A range breakout trade. Entry on the close above resistance, stop back inside the range, target one range-height above.
  '1ls6zwco7c6': '一宗區間突破交易。收市高於阻力位時入場，止蝕回到區間內，目標在上方一個區間高度。',
  // Entry
  '5p496sooaa': '入場',
  // Resistance: entry on a close above
  '1if723d7f4u': '阻力位：收市高於此處入場',
  // Resistance
  '6rmylrnh3e': '阻力位',
  // Stop-loss back inside the range
  '26texi5ukvf': '止蝕回到區間內',
  // Target: range height projected up
  'hjx0psosl4': '目標：向上投射區間高度',
  // A mechanical version buys a new **20-day high** and sells a new **10-day low**. It needs no judgement, so it is easy to backtest.
  'qpo7jmylmk': '機械化版本在**20 日新高**買入，在**10 日新低**賣出。它不需要判斷，所以容易回測。',
  // **Many fakeouts**, but small losses because the stop is close.
  '1eq1dfqxhw7': '**很多假突破**，但止蝕近所以虧損小。',
  // **Occasional big winners** when a real trend starts.
  '1bhwrjgsl58': '真正的趨勢開始時**偶爾有大勝利**。',
  // **Slippage**: everyone sees the level, so fills can be worse than planned.
  '13dg0m2gfj7': '**滑價**：人人都看到同一價位，所以成交價可能比計劃差。',
  // Slippage
  '2ffkxy4rmk2': '滑價',
  // **Filters**: above-average volume, the direction of the bigger trend, a tight range first, or a retest entry.
  '28478xremug': '**過濾條件**：高於平均的成交量、大趨勢的方向、先有窄區間，或回測入場。',
  // Do not chase
  '16t6qk7y0u9': '不要追價',
  // If the breakout candle has already run far, the stop is too far away. Let it go, or wait for a retest.
  '1gs3juewtuc': '如果突破陰陽燭已經走得很遠，止蝕就太遠了。放過它，或等待回測。',
  // Mean reversion
  '207t666j5oa': '均值回歸',
  // Bet that a price stretched far from its average will come back. High win rate, dangerous losers.
  '1p5aobkivop': '押注偏離平均很遠的價格會回來。勝率高，但虧損的交易很危險。',
  // **Mean reversion** is the opposite of trend following: price stretched far from its average tends to come back. You buy hard falls and sell hard rises.
  'j2j5z2n7mh': '**均值回歸**與順勢交易相反：遠離平均值的價格往往會回來。你買入急跌、賣出急升。',
  // **With RSI**: buy when RSI(14) falls below 30; exit above 50 or at the 20-period average; stop 2 ATR below.
  'u1totgfmch': '**用 RSI**：RSI(14) 跌穿 30 時買入；升過 50 或回到 20 週期平均線時出場；止蝕在 2 個 ATR 之下。',
  // **With Bollinger Bands**: buy a close below the lower band; exit at the middle band.
  'g0liteuoey': '**用保力加通道**：收市跌穿下軌時買入；在中線出場。',
  // SPY with Bollinger Bands and RSI. Look for closes below the lower band with RSI under 30, and whether price then returned to the middle band.
  '21u448sg0d4': 'SPY 加上保力加通道和 RSI。找出收市低於下軌而 RSI 低於 30 的地方，看看價格之後有沒有回到中軌。',
  // **High win rate, small winners**: 60% to 70% wins is common.
  '18xjff29iz7': '**高勝率、小勝利**：勝率 60% 至 70% 很常見。',
  // **Rare, large losers**: when something has really changed, price keeps going.
  'j2j2631y8k': '**罕見但巨大的虧損**：當情況真的改變了，價格會繼續走。',
  // **Best in ranges**: in a strong trend, oversold gets more oversold.
  '7ztcr3boh4': '**在區間市中最好**：在強勁趨勢中，超賣會變得更超賣。',
  // Make it safer: buy dips only in a long-term uptrend, always use a stop, and never add to a loser.
  'e7cu1cyyvf': '令它更安全：只在長期上升趨勢中買入回落，一定要設止蝕，永遠不要向虧損持倉加碼。',
  // Why both styles can work
  '29ls5e16y82': '為甚麼兩種風格都可以有效',
  // Prices tend to revert over short stretches in ranges and trend over longer ones. Neither works all the time.
  'mp88adjwnd': '價格在區間內短期傾向回歸，較長時間則傾向成趨勢。兩者都不是永遠有效。',
  // "It cannot go any lower"
  'widzkj3895': '「它不可能再低了」',
  // It can. A stock down 80% can fall another 80%. Oversold describes the past, not a floor.
  'yqbefwn5an': '它可以。跌了 80% 的股票可以再跌 80%。超賣描述的是過去，不是底部。',
  // The support and resistance bounce
  '1s9jujoc5hz': '支持位和阻力位反彈',
  // Buy at support, sell at resistance. A range strategy with a naturally tight stop.
  '1scp2x7zpbm': '在支持位買入，在阻力位賣出。一種止蝕天然很近的區間策略。',
  // The **bounce** bets a level will hold again: buy near support, sell near resistance.
  'utj7l20kxt': '**反彈**策略押注價位會再次守住：在支持位附近買入，在阻力位附近賣出。',
  // Find a range whose support and resistance have each held twice.
  'cwqfvqohwn': '找一個支持位和阻力位各守住過兩次的區間。',
  // Wait for price to reach support **and react**: a hammer, an engulfing candle, a close back up.
  'pdhvfsktov': '等價格到達支持位**並出現反應**：錘頭、吞沒陰陽燭，或收市回升。',
  // **Enter long** after the reaction, **stop** just below support, **take profit** a little before resistance.
  '1lpo0ka5wjk': '出現反應後**做多入場**，**止蝕**剛好在支持位之下，在阻力位之前一點**止賺**。',
  // A bounce trade. Price returns to support for the third time, shows a reaction, and travels back towards resistance.
  '1efuknw91y5': '一宗反彈交易。價格第三次回到支持位，出現反應，然後回升至阻力位。',
  // Support
  '1osc7jo1bd9': '支持位',
  // Stop-loss below support
  '2c3vlbhkqa3': '止蝕在支持位之下',
  // Take-profit before resistance
  '3k7imt029x': '止賺在阻力位之前',
  // Entry after the reaction
  '4x576to2h': '出現反應後入場',
  // The stop is close and the target far: here about 1.5 points of risk for 7 of reward.
  '1h2qwth5ylr': '止蝕近、目標遠：這裡約 1.5 點風險換 7 點回報。',
  // The last trade in every range loses, because that is when the level breaks.
  'vt17aq6h2g': '每個區間的最後一宗交易都會虧損，因為那就是價位被突破的時候。',
  // Each test weakens the level. A steep, high-volume move into it is more likely to break it.
  '1zt4p1t5u1k': '每次測試都會削弱價位。急劇、大成交量地衝向價位，更可能把它突破。',
  // Buying without a reaction is **catching a falling knife**. In the middle of the range there is no edge.
  '1a35ve4vu6j': '沒等反應就買入是**接下墜的刀**。在區間中間沒有優勢。',
  // In the middle of the range
  '1vg5il8ymou': '區間的中間',
  // Bounce or breakout?
  'eo58e69z37': '反彈還是突破？',
  // At every level you choose between "it holds" and "it breaks". Ranges and weak momentum favour the bounce; a trend pressing with rising volume favours the breakout.
  '26qsjzjj119': '在每個價位你都在「守住」和「突破」之間選擇。區間和弱動能有利反彈；成交量上升的趨勢壓向價位則有利突破。',
  // Scalping, day, swing and position trading
  '157jhs1rf13': '超短線、日內、波段和長線持倉交易',
  // Scalping
  'm14ml4oja4': '超短線交易',
  // Four styles defined by how long a trade lasts. Pick the one that fits your time and temperament.
  '1p9k3wpvuo9': '按一宗交易持續多久來區分的四種風格。選擇適合你時間和性情的一種。',
  // How long you hold is your **trading style**. It decides how much time trading takes, what it costs in fees, and how stressful it is.
  'azw8c5u22k': '持倉時間就是你的**交易風格**。它決定交易要花多少時間、手續費成本多少，以及壓力有多大。',
  // The Nasdaq MarketSite tower in Times Square, New York, wrapped in a giant screen
  'xfdils1u3b': '紐約時代廣場的納斯達克大樓，外牆是巨型屏幕',
  // The Nasdaq MarketSite in New York. Day traders watch the open here; position traders may check once a week.
  '256dc4fuo3l': '紐約的納斯達克大樓。日內交易者在這裡看開市；長線交易者可能一星期才看一次。',
  // **Scalping**: seconds to minutes on 1-minute charts. Fees eat tiny profits; hardest for beginners.
  '1mfisiye3vn': '**超短線交易**：在 1 分鐘圖上持倉數秒至數分鐘。手續費吃掉微小利潤；對新手最難。',
  // Fees
  'hluwovic4z': '手續費',
  // **Day trading**: in and out the same day on 5-minute to 1-hour charts. No overnight risk, but needs hours free.
  '5s3h7lv1yy': '**日內交易**：在 5 分鐘至 1 小時圖上，同日入場出場。沒有隔夜風險，但需要幾小時空閒。',
  // Day trading
  '1gakl2hk2uv': '日內交易',
  // **Swing trading**: days to weeks on 4-hour and daily charts. Check once or twice a day; overnight risk.
  '29b5i2tel80': '**波段交易**：在 4 小時和日線圖上持倉數日至數星期。每日看一兩次；有隔夜風險。',
  // Swing trading
  '18uumeu9zrw': '波段交易',
  // **Position trading**: weeks to months on daily and weekly charts. Least time, most patience.
  '22sgesjet8w': '**長線持倉交易**：在日線和週線圖上持倉數星期至數月。花時間最少，需要最多耐性。',
  // Position trading
  'exglm94xjt': '長線持倉交易',
  // A year of SPY on the daily chart: the view a swing or position trader works from. A swing trader would aim to catch one leg of a move like these, lasting days to weeks. A scalper would be working inside a single one of these candles.
  'rj33r6p9np': 'SPY 一年的日線圖：波段或長線交易者看的畫面。波段交易者會嘗試捕捉這樣的一段走勢，為期幾日至幾星期。超短線交易者則是在其中一支陰陽燭之內工作。',
  // Shorter styles mean more trades, higher costs relative to profit, and tighter stops. Longer styles mean wider stops and smaller positions.
  'rveyflruv': '較短的風格代表交易更多、成本相對利潤更高、止蝕更窄。較長的風格代表止蝕更闊、持倉更小。',
  // Have a job? Swing trading fits around it.
  '15mnlbrq6tj': '有工作？波段交易可以配合。',
  // New? Start with **swing trading on the daily or 4-hour chart**: slow decisions, less noise, cheaper mistakes.
  '2fgtakszt3s': '新手？從**日線圖或 4 小時圖上的波段交易**開始：決定慢、雜訊少、犯錯代價低。',
  // Shorter is not easier
  '276feraiqae': '較短不等於較容易',
  // Short timeframes feel like faster learning but bring more noise, higher costs and less time to think.
  '13x70gjqge0': '短時間週期感覺學得更快，但帶來更多雜訊、更高成本和更少思考時間。',
  // One strategy, one style
  'fpjouxtjcd': '一個策略，一種風格',
  // Write the rules down and paper trade at least 30 trades before changing anything.
  '1x85r2w9gfd': '把規則寫下來，並在改變任何東西之前做至少 30 宗模擬交易。',
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
  // Overnight risk: price gapping while the position is held
  '22rv3bxolot': '隔夜風險：持倉期間價格出現裂口',
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

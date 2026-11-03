// Traditional Chinese for content/lessons/05-indicators.ts and content/quizzes/05-indicators.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Indicators
  '12e0lvbc0tg': '技術指標',
  // What each indicator measures, how it is calculated, how traders use it, and where it misleads.
  '21o0uu57j2z': '每個指標量度甚麼、怎樣計算、交易者怎樣使用，以及它在哪裡會誤導人。',
  // Moving averages (SMA and EMA)
  '2e05a4v8oyr': '移動平均線（SMA 和 EMA）',
  // The simplest indicator: an average of recent prices that smooths out noise and shows the trend.
  'vniqyb5pqo': '最簡單的指標：近期價格的平均，能平滑雜訊並顯示趨勢。',
  // An **indicator** is a calculation drawn from price or volume. It adds no new information, but makes one thing, like trend or momentum, easier to see. Every indicator **lags**, because it is built from past prices.
  '1606cncwqk6': '**技術指標**是由價格或成交量計算出來的線。它不會提供新資訊，但能令趨勢或動能等某一方面更容易看到。所有指標都會**滯後**，因為它們由過去的價格計算。',
  // A **moving average** is the average close of the last N candles, the **period**, recalculated on every candle.
  '274cxmj3rj': '**移動平均線**是最近 N 支陰陽燭的平均收市價，N 叫**週期**，每支新陰陽燭都會重新計算。',
  // SMA = (sum of the last N closes) / N
  '1dho52mux6r': 'SMA =（最近 N 個收市價之和）/ N',
  // A 20-period SMA on a daily chart is the average close of the last 20 days.
  '1f80w8lusiw': '日線圖上的 20 週期 SMA，就是最近 20 日的平均收市價。',
  // A 5-period SMA by hand
  'uvbgbmxnh8': '用手計算 5 週期 SMA',
  // The last five closes are 10, 11, 12, 11 and 13.
  '57f5wkfnu8': '最近五個收市價是 10、11、12、11 和 13。',
  // Sum: 10 + 11 + 12 + 11 + 13 = 57.
  '160p9p9ue2l': '總和：10 + 11 + 12 + 11 + 13 = 57。',
  // SMA = 57 / 5 = 11.4.
  '294ufl263ie': 'SMA = 57 / 5 = 11.4。',
  // Tomorrow the oldest close (10) drops out and the new one comes in.
  '1cxfh4ooopb': '明天最舊的收市價（10）會被剔走，新的會加進來。',
  // The **EMA** gives recent closes more weight, so it turns sooner than the SMA.
  'npfg69i6y4': '**EMA** 給較近的收市價更大權重，所以轉向比 SMA 更早。',
  // A price chart with a simple and an exponential moving average, both 14 periods, the exponential one turning sooner after a sharp fall
  '24osy67925f': '一張價格圖表，上面有週期同為 14 的簡單和指數移動平均線，急跌後指數移動平均線更早轉向',
  // A 14-period SMA and EMA on the same chart. After the sharp drop, the EMA (orange) turns down first.
  '18zsvbcbmi6': '同一圖表上的 14 週期 SMA 和 EMA。急跌之後，EMA（橙色）先轉向下。',
  // EMA today = EMA yesterday + k x (close - EMA yesterday),   k = 2 / (N + 1)
  '28dv8ot6pcm': '今日 EMA = 昨日 EMA + k x（收市價 - 昨日 EMA），   k = 2 / (N + 1)',
  // With N = 20, k is about 0.095: each new close pulls the line about 9.5% of the way towards itself.
  '8a6ck3n62g': '若 N = 20，k 約為 0.095：每個新收市價會把線向自己拉近約 9.5%。',
  // SPY with a 20-day SMA and a 50-day EMA. The shorter average hugs price; the longer one shows the bigger trend. Click an average in the legend to see its current reading.
  '26yg446qvw4': 'SPY 加上 20 日 SMA 和 50 日 EMA。較短的平均線緊貼價格；較長的一條顯示較大的趨勢。點擊圖例中的平均線，可以看到它目前的讀數。',
  // **Trend**: price above a rising average leans up; below a falling one, down.
  '1ofcr1oel3f': '**趨勢**：價格在上升的平均線之上偏向上升；在下降的平均線之下偏向下跌。',
  // **Crossovers**: the 50-day crossing above the 200-day is a **golden cross**; below, a **death cross**.
  '2u3rx8jqok': '**交叉**：50 日線升穿 200 日線叫**黃金交叉**；跌穿叫**死亡交叉**。',
  // **Dynamic support**: pullbacks in a trend often end near the 20 or 50.
  '1y5tnvsainf': '**動態支持**：趨勢中的回調常在 20 或 50 日線附近結束。',
  // Weaknesses
  '1texnz8cxz': '弱點',
  // Signals come late, sideways markets cause whipsaws, and the period is arbitrary: short reacts fast but misleads more, long is steady but slow.
  'xkk7zne1bs': '訊號來得遲，橫行市會來回打臉，而且週期是隨意的：短週期反應快但誤導多，長週期穩定但慢。',
  // Common periods
  '10vs3xq4es0': '常用週期',
  // 9 and 20 for short-term trend, 50 for medium, 200 for long-term. They work partly because so many people watch them.
  'wsh82p5nik': '9 和 20 用於短期趨勢，50 用於中期，200 用於長期。它們有效，部分原因是有很多人在看。',
  // Volatility: Bollinger Bands and ATR
  '16quk1b9kt2': '波幅：保力加通道和 ATR',
  // Two ways to measure how much price is moving, which is what stop distances and position sizes should depend on.
  'ucp9hulfje': '量度價格波動多少的兩種方法，止蝕距離和持倉規模都應該以此為依據。',
  // **Volatility** is how much price moves, whichever way. The same stop distance is generous in a calm market and hopeless in a wild one.
  '1z6u1i01mmz': '**波幅**是價格移動的幅度，不論方向。同一個止蝕距離，在平靜市場很寬鬆，在狂野市場卻毫無作用。',
  // **Bollinger Bands** put an envelope around a 20-period SMA, 2 **standard deviations** above and below. The bands widen when price is jumpy and narrow when it is calm.
  '9e0sp0ldwc': '**保力加通道**在 20 週期 SMA 上下 2 個**標準差**畫出一個包絡。價格跳動時通道擴闊，平靜時收窄。',
  // The S&P 500 index with Bollinger Bands around price, and two indicator panes below
  '5fxc5jthp3': '標普 500 指數，價格周圍有保力加通道，下方有兩個指標窗格',
  // The S&P 500 with Bollinger Bands. The bands balloon in the sell-off and tighten as it calms.
  'unt4k855dg': '標普 500 和保力加通道。拋售時通道急劇擴闊，平靜下來後收窄。',
  // Upper = SMA(20) + 2 x standard deviation Lower = SMA(20) - 2 x standard deviation
  '1ke1ed7jf2u': '上軌 = SMA(20) + 2 x 標準差\n下軌 = SMA(20) - 2 x 標準差',
  // Roughly 90% to 95% of closes fall inside bands set this way.
  '1lo5hrmiyva': '以這種方式設定的通道，大約 90% 至 95% 的收市價會落在其中。',
  // A close outside a band is unusually stretched. In a range, look for a return to the middle.
  'o8jcl6748o': '收市在通道之外代表異常延伸。在區間市中，可留意回到中線。',
  // A **squeeze**, very narrow bands, often comes before a sharp move, direction unknown.
  '2bx6hoxqiri': '**收窄擠壓**即通道非常窄，常出現在急劇走勢之前，但方向未知。',
  // In a strong trend price can "walk the band". That is strength, not a reversal.
  '1ulo1ordr5d': '在強勁趨勢中，價格可以「貼着通道走」。這是強勢，不是反轉。',
  // **ATR**, the average true range, is how far price typically moves in one candle, averaged over 14 candles and including gaps.
  '8ioqd3a48o': '**ATR**（平均真實波幅）是價格在一支陰陽燭內通常移動的幅度，以 14 支陰陽燭平均並包括裂口。',
  // The S&P 500 index above its 14-day average true range, which rises sharply when the index falls
  '1zx7tgybxj9': '標普 500 指數及其下方的 14 日平均真實波幅，指數下跌時 ATR 急升',
  // The S&P 500 and its ATR below. ATR jumps when markets fall fast, so stops need room then.
  '2dwpxjw7bx1': '標普 500 及其下方的 ATR。市場急跌時 ATR 跳升，所以這時止蝕需要更多空間。',
  // True range = the largest of: high - low,  |high - previous close|,  |low - previous close| ATR = smoothed average of the true range over 14 candles
  '7f32zjyign': '真實波幅 = 以下三者中最大的一個：最高 - 最低、|最高 - 前收市|、|最低 - 前收市|\nATR = 14 支陰陽燭真實波幅的平滑平均',
  // ATR is in price units. An ATR of 3.50 on a $200 stock means a typical day covers about $3.50.
  'die8funs1x': 'ATR 以價格單位計算。一隻 $200 股票的 ATR 為 3.50，代表典型的一天大約波動 $3.50。',
  // Tesla with Bollinger Bands and, below, the ATR. Notice the bands squeeze together in quiet periods and balloon during big moves.
  '282ac7yz0st': 'Tesla 加上保力加通道，下方是 ATR。留意通道在平靜時期收窄，在大波動時膨脹。',
  // **Stops**: closer than about 1 ATR sits inside normal noise. Many use 1.5 to 3 ATR.
  '1cxpx6lzmme': '**止蝕**：近於約 1 個 ATR 會落在正常雜訊之內。很多人用 1.5 至 3 個 ATR。',
  // **Size**: a higher ATR needs a wider stop, so a smaller position for the same risk.
  'udu2z2toni': '**規模**：ATR 較高需要較闊的止蝕，所以同樣風險下持倉要較小。',
  // **Compare markets**: divide ATR by price. A 2% ATR is twice as volatile as 1%.
  '28vwlsuea65': '**比較市場**：把 ATR 除以價格。2% 的 ATR 波幅是 1% 的兩倍。',
  // Volatility clusters
  '13uquqyvzqa': '波幅會聚集',
  // Neither tool shows direction, and calm periods end suddenly. Do not assume a quiet market will stay quiet.
  'wnuq051xvt': '兩個工具都不顯示方向，而且平靜期會突然結束。不要假設平靜的市場會一直平靜。',
  // Momentum: RSI and Stochastic
  '9pec47kb96': '動能：RSI 和隨機指標',
  // Two gauges that run from 0 to 100 and show how stretched a move is.
  'wzd3f3tj00': '兩個由 0 至 100 的量表，顯示走勢被拉伸了多少。',
  // An **oscillator** swings within a fixed range, usually 0 to 100, in its own pane. It measures **momentum**: how strongly price has been moving.
  'qxu88rsvgl': '**擺動指標**在固定範圍內擺動，通常是 0 至 100，畫在獨立窗格中。它量度**動能**：價格移動得有多強。',
  // **RSI** compares recent gains with recent losses over 14 candles:
  '1v3icgs4hdm': '**RSI** 比較最近 14 支陰陽燭的升幅和跌幅：',
  // Note each candle's change from the previous close.
  '1ra9hvaq2ix': '記下每支陰陽燭相對前一個收市的變化。',
  // Average the gains, and separately the losses.
  '1nsoh307t1m': '把升幅平均，跌幅另外平均。',
  // RSI = 100 - 100 / (1 + average gain / average loss).
  '28na3gh0ie2': 'RSI = 100 - 100 / (1 + 平均升幅 / 平均跌幅)。',
  // Above **70**: **overbought**, a fast rise. Below **30**: **oversold**, a fast fall.
  '1ba4gn75tcm': '高於 **70**：**超買**，上升得快。低於 **30**：**超賣**，下跌得快。',
  // Above 50 leans bullish; below 50 bearish.
  '1evebej82tc': '高於 50 偏向看漲；低於 50 偏向看跌。',
  // Apple with RSI and the Stochastic oscillator. Compare where each reaches its extremes with what price did next: sometimes a turn, sometimes nothing.
  '1d14dq797xi': '蘋果公司加上 RSI 和隨機指標。比較每個指標到達極端值的位置，以及價格之後的表現：有時會轉向，有時甚麼都沒發生。',
  // The **Stochastic** shows where the close sits in the last 14 candles' range.
  'yoxijvoobr': '**隨機指標**顯示收市價位於最近 14 支陰陽燭範圍中的哪個位置。',
  // %K = 100 x (close - lowest low) / (highest high - lowest low)
  '1xszjq2o1gb': '%K = 100 x（收市價 - 最低價）/（最高價 - 最低價）',
  // Near 100 means closing at the top of the recent range; near 0, at the bottom. %K is smoothed, and %D is a 3-period average of %K that acts as a signal line.
  '24xnw5xoo1q': '接近 100 代表收在近期區間的頂部；接近 0 則在底部。%K 會經過平滑處理，%D 是 %K 的 3 週期平均，作為訊號線。',
  // Above **80** is overbought, below **20** oversold. %K crossing %D at an extreme is read as a signal.
  '81gqq4bt2i': '高於 **80** 是超買，低於 **20** 是超賣。%K 在極端位置穿越 %D 被視為訊號。',
  // **Divergence** is price and oscillator disagreeing: a higher price high on a lower RSI high warns the move is tiring.
  'gmtqucjc7n': '**背馳**是價格和擺動指標意見不一：價格創出更高的高點，RSI 的高點卻較低，警告走勢正在疲倦。',
  // Overbought
  '2dyngvfrui8': '超買',
  // Overbought does not mean about to fall
  '29iaxlpvosl': '超買不代表即將下跌',
  // In a strong uptrend RSI can stay above 70 for weeks. Oscillators work best in ranges, worst in trends, and divergences are clearer afterwards than in real time.
  '1b6llk3quaj': '在強勁的上升趨勢中，RSI 可以連續幾星期高於 70。擺動指標在區間市最好用，在趨勢市最差，而背馳事後看比實時清楚得多。',
  // Match the tool to the market
  'ygmvwbz2v9': '讓工具配合市場',
  // In a range, use the extremes. In a trend, only trade with it: for example, buy when RSI dips towards 40 in an uptrend.
  'q4t4024z5': '在區間市中，利用極端位置。在趨勢市中，只順勢交易：例如在上升趨勢中 RSI 回落到 40 附近時買入。',
  // MACD
  '1ozkyypbuiu': 'MACD',
  // The gap between two moving averages, used to see momentum building or fading.
  'yjxt3bc1nh': '兩條移動平均線之間的差距，用來觀察動能在增強還是減弱。',
  // The gap between two moving averages
  'x7e8gvtc3y': '兩條移動平均線之間的差距',
  // **MACD** measures the gap between a fast and a slow EMA. A speeding trend pulls them apart; a tiring one brings them together.
  '67yug39vq6': '**MACD** 量度快和慢兩條 EMA 之間的距離。加速的趨勢把它們拉開；疲倦的趨勢令它們靠攏。',
  // **MACD line** = 12-period EMA minus 26-period EMA.
  '1ptt954l46i': '**MACD 線** = 12 週期 EMA 減 26 週期 EMA。',
  // 12-period EMA minus 26-period EMA
  '9k6pxedafp': '12 週期 EMA 減 26 週期 EMA',
  // **Signal line** = 9-period EMA of the MACD line.
  '9evolsz9u4': '**訊號線** = MACD 線的 9 週期 EMA。',
  // **Histogram** = MACD line minus signal line, drawn as bars.
  '3qki11n2y9': '**柱狀圖** = MACD 線減訊號線，以棒形顯示。',
  // SPY with MACD in the lower pane. The bars are the histogram: positive when the MACD line is above its signal line.
  '225rf18mbkt': 'SPY 加上下方窗格的 MACD。柱就是柱狀圖：MACD 線高於訊號線時為正。',
  // **Signal crossover**: MACD above its signal line, momentum turning up.
  '1ievt2yyljf': '**訊號線交叉**：MACD 升穿訊號線，動能轉強。',
  // **Zero line**: above zero, the 12 EMA is above the 26, an uptrend.
  '1x3wqkzl6q': '**零線**：高於零代表 12 EMA 在 26 EMA 之上，是上升趨勢。',
  // **Histogram shrinking**: momentum fading, the earliest of the three.
  '20r67c7rvbz': '**柱狀圖縮短**：動能減弱，是三者中最早的訊號。',
  // **Divergence**: a new price high on a lower MACD high.
  '4twpzdkpte': '**背馳**：價格創新高，MACD 的高點卻較低。',
  // Reading one moment
  '7n6jqzhf98': '解讀某一刻的讀數',
  // MACD line is +1.8 and the signal line is +1.2.
  'qslr2c6bfa': 'MACD 線為 +1.8，訊號線為 +1.2。',
  // MACD is above zero: the fast average is above the slow one, so the trend is up.
  '15sseecxls6': 'MACD 高於零：快線平均高於慢線平均，所以趨勢向上。',
  // The histogram is +0.6: MACD is above its signal, so momentum is positive.
  'jikme3h3b9': '柱狀圖為 +0.6：MACD 高於訊號線，所以動能為正。',
  // If the histogram was +1.1 a few candles ago, momentum is fading even though both readings are still bullish.
  'acgrzfxzkw': '如果幾支陰陽燭之前柱狀圖是 +1.1，即使兩個讀數仍然看漲，動能也正在減弱。',
  // An average of averages lags twice, tangles in ranges, and is in price units, so readings cannot be compared between markets.
  'sa180err3r': '平均線的平均線會雙重滯後，在區間市中糾纏不清，而且以價格單位計算，所以不同市場的讀數無法比較。',
  // Do not stack indicators
  'nqm31ovnwj': '不要堆疊指標',
  // Indicators built from price mostly agree with each other. One trend tool, one momentum tool and volume is plenty.
  '7vmmql9maq': '由價格計算的指標大多互相一致。一個趨勢工具、一個動能工具加上成交量已經足夠。',
  // Volume and VWAP
  '3shimt1bp1': '成交量和 VWAP',
  // Volume
  'alc1a0j1b0': '成交量',
  // Volume shows how much conviction is behind a move. VWAP shows the average price actually paid.
  'bfo3tb82eg': '成交量顯示走勢背後有多少信心。VWAP 顯示實際成交的平均價格。',
  // **Volume** is how much traded in a candle. Price shows what happened; volume shows how many were behind it. It is the one common indicator not made from price.
  'cm69in63j8': '**成交量**是一支陰陽燭內的交易數量。價格顯示發生了甚麼；成交量顯示有多少人參與。它是唯一一個不由價格計算的常用指標。',
  // A long-term chart of Dow Jones Industrial Average trading volume rising over many years
  'xp0wynfo42': '一張長期圖表，顯示道瓊斯工業平均指數的成交量多年來不斷上升',
  // Dow Jones trading volume over decades. "High" only means something compared with normal for the time.
  'r0iq05z9b8': '數十年來的道瓊斯成交量。「大」只有與當時的正常水平比較才有意義。',
  // Moves on **high volume** have broad support and tend to continue.
  '1sgyopssdhk': '**大成交量**下的走勢有廣泛支持，往往會延續。',
  // Moves on **low volume** are easier to reverse.
  '1coj2xiskai': '**小成交量**下的走勢較容易反轉。',
  // A **breakout** with a jump in volume is more trustworthy.
  '1ca5fga41tv': '成交量跳升的**突破**更可信。',
  // A huge spike after a long move, a **climax**, can mark exhaustion.
  '1z1nqqropjo': '長時間走勢後的巨大成交量，即**高潮**，可能代表力竭。',
  // A 20-period **volume moving average** shows what is normal. Bars well above it are unusual.
  '1whlb9s14nd': '20 週期**成交量移動平均線**顯示正常水平。遠高於它的棒形就是異常。',
  // Apple with a 20-day volume average on the volume bars and monthly VWAP on price. Look for the tallest volume bars and what price did on those days.
  '20lnwcoc709': '蘋果公司加上成交量柱上的 20 日成交量平均線，以及價格上的每月 VWAP。找出最高的成交量柱，看看價格在那些日子做了甚麼。',
  // **VWAP** is the volume-weighted average price paid this session. Above it, the average buyer is in profit; price often returns to it during the day.
  '1sw7l50up4i': '**VWAP** 是這個時段按成交量加權的平均成交價。價格在它之上時，平均買家有利潤；日內價格常會回到 VWAP。',
  // VWAP = sum(typical price x volume) / sum(volume),   typical price = (high + low + close) / 3
  '2q3va3867z': 'VWAP = 總和（典型價格 x 成交量）/ 總和（成交量），   典型價格 =（最高 + 最低 + 收市）/ 3',
  // The sums restart each session. In this app that is each day on intraday charts and each month on daily charts.
  '1wuqf7b7m8o': '總和在每個時段重新開始。在這個應用程式中，日內圖表是每日，日線圖則是每月。',
  // Volume does not say which side was more eager, crypto and forex volume is from one venue only (EUR/USD here has none), and VWAP means little just after it resets.
  '1zljc7ncqbs': '成交量不會說明哪一方更心急，加密貨幣和外匯的成交量只來自一個交易場所（這裡的 EUR/USD 沒有成交量），而 VWAP 剛重設後意義不大。',
  // One tool per job
  '25qxck3ahk6': '每項工作一個工具',
  // Trend: moving averages. Volatility: Bollinger, ATR. Momentum: RSI, Stochastic, MACD. Participation: volume, VWAP. Add any of them from the Indicators button.
  'eds35yn3ak': '趨勢：移動平均線。波幅：保力加通道、ATR。動能：RSI、隨機指標、MACD。參與度：成交量、VWAP。可以在「指標」按鈕加入任何一個。',
  // The last four closes are 20, 22, 24 and 26. What is the 4-period SMA?
  '6o3xhgjl4q': '最近四個收市價是 20、22、24 和 26。4 週期 SMA 是多少？',
  // How does an EMA differ from an SMA of the same period?
  '1kmkwc3emjk': '相同週期的 EMA 與 SMA 有甚麼不同？',
  // It uses the high instead of the close
  'kqjvzs6cy4': '它用最高價而不是收市價',
  // It gives recent closes more weight, so it reacts sooner
  '24rd3soiir3': '它給近期收市價較大比重，所以反應較快',
  // It never lags
  'bo36yzzqzm': '它從不滯後',
  // It is always above the SMA
  '2xhs2rmjci': '它永遠高於 SMA',
  // The EMA weights recent prices more heavily. It still lags, only less.
  '146t7apxjiz': 'EMA 給近期價格較重的比重。它仍然會滯後，只是少一點。',
  // Why do moving averages lag?
  '197vr3m6nhc': '為甚麼移動平均線會滯後？',
  // Exchanges delay the data
  '26jk53ig3xy': '交易所延遲了數據',
  // They are built from prices that have already happened
  'buouqo8krg': '它們是由已經發生的價格構成的',
  // They use the wrong formula
  '1011osuarpq': '它們用了錯誤的公式',
  // They only update once a day
  '1bej2c68hcg': '它們一天只更新一次',
  // An average of past closes can only turn after price has already turned.
  'zmkjtlicem': '由過去收市價計算的平均，只能在價格已經轉向之後才轉向。',
  // In which market do moving average crossovers give the most false signals?
  '83gw3pk8hk': '在哪種市場中，移動平均線交叉的假訊號最多？',
  // A strong uptrend
  'iztqp1g1qt': '強勁的上升趨勢',
  // A strong downtrend
  'r9qz0pveb9': '強勁的下跌趨勢',
  // A sideways range
  '129ddqyld3l': '橫行的區間',
  // They never give false signals
  'cnzud2q148': '它們從不給出假訊號',
  // In a range price crosses back and forth over the average, producing a string of whipsaws.
  '16mr8gn96u0': '在區間市中，價格會來回穿越平均線，產生一連串的來回打臉。',
  // What is a golden cross?
  'gcg034o7nh': '甚麼是黃金交叉？',
  // Price touching a round number
  '13ou5husn4z': '價格觸及整數',
  // The 50-period average crossing above the 200-period average
  'dz1at2lrzq': '50 週期平均線向上穿越 200 週期平均線',
  // RSI crossing 50
  '91d4rqfhuz': 'RSI 穿越 50',
  // Two dojis in a row
  '1m5ih9n9v1j': '連續兩個十字星',
  // A shorter average crossing above a longer one. The opposite is a death cross.
  'xn1y08sh0k': '較短的平均線向上穿越較長的一條。相反的情況叫死亡交叉。',
  // What do Bollinger Bands do when the market becomes more volatile?
  '155eyczlucs': '市場變得更波動時，保力加通道會怎樣？',
  // Narrow
  '1hapap657ar': '收窄',
  // Widen
  'yoloo8q16a': '變闊',
  // Disappear
  '270dg063rqo': '消失',
  // Turn flat
  '6nzri841u5': '變平',
  // The bands are set by standard deviation, which grows when closes are more spread out.
  '1i3bkukrosl': '通道由標準差決定，收市價愈分散，標準差就愈大。',
  // A Bollinger "squeeze" (very narrow bands) suggests:
  'ktmf4txin7': '保力加「收窄擠壓」（通道非常窄）暗示：',
  // Price will rise
  '28kkkx1jwsa': '價格會上升',
  // Price will fall
  '7x98mtr6i5': '價格會下跌',
  // Volatility is unusually low and a larger move may follow, direction unknown
  'smja5tv259': '波幅異常低，之後可能出現較大的走勢，方向未知',
  // The trend has ended
  '87uekwqnu8': '趨勢已經結束',
  // A squeeze says a move is likely, not which way.
  'pyzy6r3c7t': '收窄擠壓說明可能會有走勢，但不說明方向。',
  // A squeeze
  '1ewzukrwr6m': '收窄擠壓',
  // A stock trades at $100 with an ATR of $2. A stop-loss $0.50 from your entry is:
  '859lmausbp': '一隻股票價格 $100，ATR 為 $2。離入場價 $0.50 的止蝕是：',
  // Safely wide
  '5urnyc3vpy': '足夠寬裕',
  // Inside normal noise and likely to be hit by chance
  'zw9s8066a': '位於正常雜訊之內，很可能被隨機觸發',
  // Exactly right
  '1cuu8v9t1bm': '剛剛好',
  // Impossible to place
  '2b8sjgisq9b': '不可能放置',
  // A typical candle covers about $2. A $0.50 stop will be triggered by ordinary movement.
  'grsqw54p3h': '典型的陰陽燭大約波動 $2。$0.50 的止蝕會被平常的波動觸發。',
  // What does ATR tell you about direction?
  '14t8wn2jths': 'ATR 告訴你甚麼方向？',
  // Rising ATR means price is rising
  't5gozzv6b': 'ATR 上升代表價格上升',
  // Falling ATR means price is falling
  '4o1ayi6oqh': 'ATR 下降代表價格下跌',
  // Nothing: it measures the size of moves only
  '9isk0yrtb2': '甚麼都沒有：它只量度波動的大小',
  // It always points to the trend
  '3yhhl1q9i6': '它永遠指向趨勢',
  // ATR is volatility. A high ATR can accompany a rally or a crash.
  '18l38wfccqv': 'ATR 就是波幅。高 ATR 可以伴隨急升，也可以伴隨急跌。',
  // ATR doubles. To risk the same dollars with a stop the same number of ATRs away, your position should be:
  '1xowb0h2104': 'ATR 翻倍。要以相同的 ATR 倍數放置止蝕並承受同樣金額的風險，你的持倉應該：',
  // Twice as large
  '1kuzanwa8lb': '大一倍',
  // The same size
  'kb3jss2ow': '大小不變',
  // Half the size
  'oewrsqxzxj': '減半',
  // Closed
  'of37issh9': '平倉',
  // A wider stop needs a smaller position to keep the dollar risk constant.
  'pbqxzoerkd': '止蝕更闊，持倉就要更小，金額風險才能保持不變。',
  // RSI is 78. This is called:
  'polw31rugk': 'RSI 為 78。這叫做：',
  // Oversold
  'lqu0h6b2y4': '超賣',
  // Neutral
  'g0husduell': '中性',
  // Divergent
  'wchqy11p1': '背馳',
  // Above 70 is overbought: price has risen quickly. It is a caution, not a sell signal.
  '1hsbjes8ayt': '高於 70 就是超買：價格升得很快。這是提醒，不是賣出訊號。',
  // In a strong uptrend, RSI above 70 most often means:
  'fxytp1mc90': '在強勁的上升趨勢中，RSI 高於 70 最常代表：',
  // Sell immediately
  '2e9adt3qi2c': '立即賣出',
  // The trend is strong, and RSI can stay high for a long time
  '1iuhbyanxoa': '趨勢很強，RSI 可以長時間保持在高位',
  // The data is wrong
  '18hfaw4kpmf': '數據有誤',
  // A crash is certain
  'o115gpdel7': '一定會大跌',
  // Strong trends keep oscillators pinned at their extremes. Selling just because RSI is high is a classic mistake.
  'rm3xsaxc5f': '強勁的趨勢會令擺動指標一直停在極端值。單單因為 RSI 高就賣出是典型的錯誤。',
  // Strong trends
  'hl8pazqknl': '強勁的趨勢',
  // What does the Stochastic oscillator measure?
  '244o2xlbsx5': '隨機指標量度甚麼？',
  // The average gain versus average loss
  'f6iy5bqal4': '平均升幅相對平均跌幅',
  // Where the close sits within the recent high-low range
  '1xqfghlot71': '收市價位於近期高低區間的哪裡',
  // %K shows the close as a percentage of the way from the lowest low to the highest high.
  '4j2si2l2fc': '%K 以百分比顯示收市價由最低價到最高價之間的位置。',
  // Price makes a higher high while RSI makes a lower high. This is:
  'poyf1l7ki4': '價格創出更高的高點，RSI 卻創出更低的高點。這是：',
  // Bullish divergence
  '71p860klfx': '看漲背馳',
  // Bearish divergence
  '1e0ndwkw4hv': '看跌背馳',
  // A golden cross
  'j3bvcz8o7': '黃金交叉',
  // The new high came with less momentum. It warns the move may be tiring.
  '3b7t8qq9r9': '新高點的動能較少。這警告走勢可能正在疲倦。',
  // Oscillators such as RSI and Stochastic are most useful in:
  '46dm50j00': 'RSI 和隨機指標這類擺動指標在哪裡最有用？',
  // Sideways ranges
  '2a64qdkbzyf': '橫行的區間',
  // Markets with no volume
  '2666tnvl4s5': '沒有成交量的市場',
  // Every market equally
  '15gsd1d8ldl': '每個市場都一樣',
  // In a range, extremes tend to mark turning points. In a trend they stay extreme and mislead.
  '1oprvm6g67a': '在區間市中，極端值往往標示轉折點。在趨勢市中，它們會一直停在極端值並誤導人。',
  // How is the MACD line calculated?
  '164hzne7am9': 'MACD 線怎樣計算？',
  // 26-period SMA minus 12-period SMA
  '1xmdf9t99vj': '26 週期 SMA 減 12 週期 SMA',
  // Close minus open
  '2a0s1rtgkt3': '收市價減開市價',
  // RSI minus 50
  '21djavr2bmb': 'RSI 減 50',
  // The MACD line is the fast EMA minus the slow EMA.
  '14t9nzb9tmk': 'MACD 線是快速 EMA 減慢速 EMA。',
  // The MACD line is above zero. That means:
  'c2o5q0mf78': 'MACD 線高於零。這代表：',
  // The 12 EMA is above the 26 EMA
  '28p8a2cl085': '12 EMA 高於 26 EMA',
  // RSI is above 50
  '1hzrf0q91qg': 'RSI 高於 50',
  // Price is above 100
  '1yp9lzmc7dp': '價格高於 100',
  // Volume is rising
  '1fdvc3qndvx': '成交量在上升',
  // Positive MACD means the fast average is above the slow one, which describes an uptrend.
  't15kw3wl17': 'MACD 為正代表快線平均高於慢線平均，描述的是上升趨勢。',
  // What does the MACD histogram show?
  '1p879agae95': 'MACD 柱狀圖顯示甚麼？',
  // The MACD line minus its signal line
  'm4l6sxzdt5': 'MACD 線減其訊號線',
  // The 26 EMA
  'eveiokg2px': '26 EMA',
  // The spread
  'apx723s67j': '買賣差價',
  // The bars are the gap between MACD and its signal. They shrink before the lines cross.
  '8ve10rcmpa': '柱是 MACD 與其訊號線之間的差距。兩線交叉前，柱會先收縮。',
  // Why is MACD said to lag twice?
  '1vwf04yztnx': '為甚麼說 MACD 有雙重滯後？',
  // It is published a day late
  '1hv9dwgvedp': '它遲一天公佈',
  // It is an average of moving averages
  '2a3prurgv3k': '它是移動平均線的平均',
  // It uses two timeframes
  '1h59mmfgqud': '它用兩個時間週期',
  // It ignores the close
  '4yvji9ek0b': '它忽略收市價',
  // The signal line is an EMA of a difference of EMAs. Crossovers arrive well after price turns.
  '1c5kcr8x5mw': '訊號線是 EMA 之差的 EMA。交叉在價格轉向後很久才出現。',
  // Adding five indicators that all derive from price will mostly give you:
  '13afxu8xa0c': '加入五個全部由價格衍生的指標，大多數時候會給你：',
  // Five independent confirmations
  '1uut2rjfqz5': '五個互相獨立的確認',
  // Signals that agree with each other because they share the same input
  'vdh3sixu0d': '互相一致的訊號，因為它們用同一份輸入',
  // Guaranteed profits
  '10s7enn01iw': '保證的盈利',
  // Less lag
  '1dvt6ig8izr': '較少滯後',
  // Indicators built from the same closes are not independent evidence.
  '29fihtmpl4s': '由同一批收市價計算的指標並不是獨立的證據。',
  // A breakout happens on volume far above average. Compared with one on light volume it is:
  '1v0e1j2duni': '一次突破的成交量遠高於平均。與成交量少的突破相比，它：',
  // Less trustworthy
  '154ddm76emx': '較不可信',
  // More trustworthy
  '25p2352op35': '較可信',
  // Exactly the same
  's2y4fp2zv9': '完全一樣',
  // A fakeout by definition
  '1iinrihfn84': '按定義就是假突破',
  // High volume shows many traders took part, so the move has more behind it.
  '1qh98i4rb59': '大成交量顯示很多交易者參與，所以走勢背後的力量更大。',
  // What does volume NOT tell you?
  '8s0fcdjtg5': '成交量不能告訴你甚麼？',
  // How much was traded
  '1lwlj6bg3x3': '成交了多少',
  // Whether buyers or sellers were the more eager side
  'fil73lphtw': '買方還是賣方更積極',
  // Whether the candle was unusually busy
  '14q8wh6ydv4': '這支陰陽燭是否異常活躍',
  // How participation compares with normal
  'df8z7wmkcb': '參與度與正常水平相比如何',
  // Every trade has a buyer and a seller. Volume counts the trades, not who pushed.
  '3w755dm5ec': '每一宗交易都有一個買家和一個賣家。成交量計算的是交易，而不是誰在推動。',
  // VWAP is best described as:
  '873yaw92sa': 'VWAP 最好的描述是：',
  // The highest price of the session
  '1sp0poz81s4': '時段內的最高價',
  // The average price paid this session, weighted by volume
  'a8szjwzy1y': '這個時段以成交量加權的平均成交價',
  // A 20-period moving average
  '4msi6yjzk7': '20 週期移動平均線',
  // The opening price
  'si988rnrei': '開市價',
  // Each candle counts according to how much traded in it.
  '4ybks81o0d': '每支陰陽燭按其成交量計算比重。',
  // Price is trading above VWAP. Traders read this as:
  '20d9swvs2ye': '價格在 VWAP 之上交易。交易者把這解讀為：',
  // Sellers in control
  'p4hm7mum1n': '賣方主導',
  // Buyers in control: the average buyer this session is in profit
  '1tqm2jf2b9k': '買方主導：這個時段的平均買家正在獲利',
  // A guaranteed breakout
  '11kcxo1zmb': '保證會突破',
  // Nothing at all
  '6dvnq3zx5r': '完全沒有意義',
  // Above VWAP means recent buyers are, on average, sitting on gains.
  '28ie4z6ahh7': '高於 VWAP 代表近期的買家平均正處於獲利狀態。',
  // Why can VWAP not be drawn on the bundled EUR/USD chart?
  '1ofzqjs9z39': '為甚麼內置的歐元／美元圖表無法畫出 VWAP？',
  // Forex has no prices
  '3xdqogwvtc': '外匯沒有價格',
  // That data has no volume
  '1wd22f992qg': '那份數據沒有成交量',
  // VWAP only works on stocks
  '1n45kh4jmek': 'VWAP 只適用於股票',
  // It can, it is just hidden
  '1r5107mvj2c': '其實可以，只是被隱藏了',
  // VWAP needs volume to weight prices. Without it there is nothing to calculate.
  '1h713icqgte': 'VWAP 需要成交量來為價格加權。沒有成交量就沒有東西可以計算。',
} satisfies Record<string, string>;

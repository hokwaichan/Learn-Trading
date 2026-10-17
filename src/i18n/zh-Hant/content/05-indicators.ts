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
  // An **indicator** is a calculation made from price or volume and drawn on the chart. It adds no new information: everything it shows is already in the candles. What it does is make one aspect, such as trend or momentum, easier to see. Every indicator **lags**, because it is built from prices that have already happened.
  '27dk0saisgi': '**技術指標**是由價格或成交量計算出來、畫在圖表上的數值。它不會增加新資訊：它顯示的一切早已在陰陽燭裡。它的作用是令某一方面（例如趨勢或動能）更容易看見。每個指標都會**滯後**，因為它是由已經發生的價格構成的。',
  // Simple moving average (SMA)
  'qgfyvfd4ln': '簡單移動平均線（SMA）',
  // A **moving average** is the average closing price over the last N candles, recalculated on every new candle so the line "moves". N is called the **period**.
  'z5zinsbege': '**移動平均線**是最近 N 支陰陽燭的平均收市價，每出現一支新陰陽燭就重新計算，所以這條線會「移動」。N 叫做**週期**。',
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
  // Exponential moving average (EMA)
  '1fso5hsqvzc': '指數移動平均線（EMA）',
  // The SMA gives every close in the window equal weight. The **EMA** gives recent closes more weight, so it turns sooner when price turns.
  '224vu7yuevs': 'SMA 給窗口內每個收市價相同的比重。**EMA** 給近期的收市價較大比重，所以價格轉向時它會更快轉向。',
  // EMA today = EMA yesterday + k x (close - EMA yesterday),   k = 2 / (N + 1)
  '28dv8ot6pcm': '今日 EMA = 昨日 EMA + k x（收市價 - 昨日 EMA），   k = 2 / (N + 1)',
  // With N = 20, k is about 0.095: each new close pulls the line about 9.5% of the way towards itself.
  '8a6ck3n62g': '若 N = 20，k 約為 0.095：每個新收市價會把線向自己拉近約 9.5%。',
  // SPY with a 20-day SMA and a 50-day EMA. The shorter average hugs price; the longer one shows the bigger trend. Click an average in the legend to see its current reading.
  '26yg446qvw4': 'SPY 加上 20 日 SMA 和 50 日 EMA。較短的平均線緊貼價格；較長的一條顯示較大的趨勢。點擊圖例中的平均線，可以看到它目前的讀數。',
  // Typical signals
  '6ud9y6ql': '常見訊號',
  // **Trend direction**: price above a rising average suggests an uptrend; below a falling average, a downtrend.
  'ibd7z1b0ag': '**趨勢方向**：價格高於上升中的平均線代表上升趨勢；低於下跌中的平均線則代表下跌趨勢。',
  // **Crossovers**: a short average crossing above a long one is read as momentum turning up. The 50-day crossing above the 200-day is called a **golden cross**; crossing below is a **death cross**.
  '2fm70ogv9du': '**交叉**：短期平均線向上穿越長期平均線，被解讀為動能轉強。50 日向上穿越 200 日叫**黃金交叉**；向下穿越叫**死亡交叉**。',
  // **Dynamic support**: in a trend, pullbacks often end near a widely watched average such as the 20 or 50.
  'zbw6coce22': '**動態支持**：在趨勢中，回調常在 20 或 50 這類廣受關注的平均線附近結束。',
  // Weaknesses
  '1texnz8cxz': '弱點',
  // **Lag.** The average turns only after price has. Signals come late, sometimes after most of the move.
  'azbwoa1ilj': '**滯後。**價格轉向之後平均線才會轉。訊號來得遲，有時要到走勢大部分完成後才出現。',
  // **Whipsaws.** In a sideways market price crosses the average repeatedly, and each cross is a false signal.
  '17nds2s0ux6': '**來回打臉。**在橫行市中，價格反覆穿越平均線，每次穿越都是假訊號。',
  // **The period is arbitrary.** Shorter periods react faster and give more false signals; longer periods are steadier and slower. There is no correct value.
  '1s9cjm7y0p3': '**週期是隨意的。**較短的週期反應較快、假訊號較多；較長的週期較平穩、較慢。並沒有正確的數值。',
  // Common periods
  '10vs3xq4es0': '常用週期',
  // 9 and 20 for short-term trend, 50 for medium, 200 for long-term. They work partly because so many people watch them.
  'wsh82p5nik': '9 和 20 用於短期趨勢，50 用於中期，200 用於長期。它們有效，部分原因是有很多人在看。',
  // Volatility: Bollinger Bands and ATR
  '16quk1b9kt2': '波幅：保力加通道和 ATR',
  // Two ways to measure how much price is moving, which is what stop distances and position sizes should depend on.
  'ucp9hulfje': '量度價格波動多少的兩種方法，止蝕距離和持倉規模都應該以此為依據。',
  // **Volatility** is how much price moves, regardless of direction. A calm market might move 0.5% a day; a wild one 5%. It matters because the same stop-loss distance is generous in one and hopeless in the other.
  '2bg1n6lfhug': '**波幅**是價格移動的幅度，不論方向。平靜的市場一天可能只動 0.5%；狂野的市場可以動 5%。它之所以重要，是因為同一個止蝕距離，在一個市場很寬裕，在另一個卻毫無作用。',
  // Bollinger Bands
  '17f49b8xmhr': '保力加通道',
  // **Bollinger Bands** draw an envelope around a moving average. The middle band is a 20-period SMA. The upper and lower bands sit 2 **standard deviations** above and below it. Standard deviation is a measure of how spread out the recent closes are, so the bands widen when price is jumpy and narrow when it is calm.
  '1jtoax6efir': '**保力加通道**在移動平均線周圍畫出一個外殼。中軌是 20 週期 SMA。上軌和下軌位於它上下 2 個**標準差**。標準差量度近期收市價有多分散，所以價格跳動時通道會變闊，平靜時會收窄。',
  // Upper = SMA(20) + 2 x standard deviation Lower = SMA(20) - 2 x standard deviation
  '1ke1ed7jf2u': '上軌 = SMA(20) + 2 x 標準差\n下軌 = SMA(20) - 2 x 標準差',
  // Roughly 90% to 95% of closes fall inside bands set this way.
  '1lo5hrmiyva': '以這種方式設定的通道，大約 90% 至 95% 的收市價會落在其中。',
  // Tesla with Bollinger Bands and, below, the ATR. Notice the bands squeeze together in quiet periods and balloon during big moves.
  '282ac7yz0st': 'Tesla 加上保力加通道，下方是 ATR。留意通道在平靜時期收窄，在大波動時膨脹。',
  // A close outside a band is unusually far from the average. In a range, traders look for a return towards the middle.
  'gb93s29f87': '收市在通道之外，代表離平均異常地遠。在區間市中，交易者會留意價格回到中軌附近。',
  // A **squeeze**, where the bands become very narrow, means volatility is unusually low. A sharp move often follows, though the bands do not say which way.
  '22zdvph0xq4': '**收窄擠壓**是通道變得非常窄，代表波幅異常低。之後常會出現急劇的走勢，但通道不會說明方向。',
  // In a strong trend price can "walk the band", closing near it for many candles. That is strength, not a reversal signal.
  '22m5k0kpywl': '在強勁的趨勢中，價格可以「沿軌道走」，連續多支陰陽燭都在軌道附近收市。這是強勢，不是反轉訊號。',
  // Average True Range (ATR)
  '21ap839ohh8': '平均真實波幅（ATR）',
  // **ATR** answers one question: how far does price typically move in one candle? It averages the **true range** over 14 candles. The true range is the candle's high minus low, extended to include any gap from the previous close.
  '5gmon8gcjt': '**ATR** 回答一個問題：價格在一支陰陽燭內通常移動多遠？它把 14 支陰陽燭的**真實波幅**平均。真實波幅是陰陽燭的最高價減最低價，並延伸至包括與上一個收市價之間的任何裂口。',
  // True range = the largest of: high - low,  |high - previous close|,  |low - previous close| ATR = smoothed average of the true range over 14 candles
  '7f32zjyign': '真實波幅 = 以下三者中最大的一個：最高 - 最低、|最高 - 前收市|、|最低 - 前收市|\nATR = 14 支陰陽燭真實波幅的平滑平均',
  // ATR is in price units. An ATR of 3.50 on a $200 stock means a typical day covers about $3.50.
  'die8funs1x': 'ATR 以價格單位計算。一隻 $200 股票的 ATR 為 3.50，代表典型的一天大約波動 $3.50。',
  // Using ATR
  '8dvul8u04h': '運用 ATR',
  // **Stop placement**: a stop-loss closer than about 1 ATR sits inside normal noise and gets hit by chance. Many traders place stops 1.5 to 3 ATR away.
  'tkbk2h9z82': '**放置止蝕**：離入場價少於約 1 個 ATR 的止蝕位於正常雜訊之內，會被隨機觸發。很多交易者把止蝕放在 1.5 至 3 個 ATR 之外。',
  // **Position sizing**: when ATR is high, the stop must be wider, so the position must be smaller to risk the same dollars.
  '1ze4uzjjndz': '**持倉規模**：ATR 高時止蝕必須更闊，所以持倉必須更小，才能承受同樣金額的風險。',
  // **Comparing instruments**: divide ATR by price. A 2% ATR is twice as volatile as a 1% ATR.
  '1d0tcs2xyvt': '**比較不同品種**：把 ATR 除以價格。2% 的 ATR 波動程度是 1% ATR 的兩倍。',
  // Neither indicator says anything about direction.
  'v36lwgpy6k': '兩個指標都完全不說明方向。',
  // Both describe the recent past. Volatility can change abruptly on news.
  '2bndafde2vt': '兩者都只描述近期的過去。波幅可以因為消息而突然改變。',
  // A touch of a Bollinger Band is not a trade signal by itself. Prices outside the bands can keep going.
  '1kujjtku6wz': '單單觸及保力加通道本身不是交易訊號。價格在通道外也可以繼續走。',
  // Volatility clusters
  '13uquqyvzqa': '波幅會聚集',
  // Quiet periods tend to follow quiet periods and wild ones follow wild ones, until suddenly they do not. Do not assume a calm market will stay calm.
  'oi4kg05v2u': '平靜的時期之後往往仍是平靜的時期，狂野的時期之後往往仍是狂野的時期，直至某天突然不再如此。不要假設平靜的市場會一直平靜。',
  // Momentum: RSI and Stochastic
  '9pec47kb96': '動能：RSI 和隨機指標',
  // Two gauges that run from 0 to 100 and show how stretched a move is.
  'wzd3f3tj00': '兩個由 0 至 100 的量表，顯示走勢被拉伸了多少。',
  // An **oscillator** is an indicator that swings back and forth within a fixed range, usually 0 to 100, and is drawn in its own pane under the chart. Oscillators measure **momentum**: how strongly price has been moving.
  '1ekctm22tpx': '**擺動指標**是在固定範圍內（通常是 0 至 100）來回擺動、畫在圖表下方獨立窗格的指標。擺動指標量度**動能**：價格移動得有多強勁。',
  // Relative Strength Index (RSI)
  '29h9flvgorc': '相對強弱指數（RSI）',
  // **RSI** compares the size of recent gains with recent losses over 14 candles.
  'rylxt9rago': '**RSI** 比較最近 14 支陰陽燭的升幅和跌幅大小。',
  // For each of the last 14 candles, note the change from the previous close.
  'a51czuecoh': '記下最近 14 支陰陽燭中每一支與上一個收市價的變化。',
  // Average the gains. Separately, average the losses.
  '76d4f7i1tn': '計算升幅的平均。另外計算跌幅的平均。',
  // RSI = 100 - 100 / (1 + average gain / average loss).
  '28na3gh0ie2': 'RSI = 100 - 100 / (1 + 平均升幅 / 平均跌幅)。',
  // If gains and losses are equal, RSI is 50. If there were only gains it is 100; only losses, 0.
  '16z9a40m7de': '如果升幅和跌幅相等，RSI 就是 50。如果全是升幅就是 100；全是跌幅就是 0。',
  // Above **70** is called **overbought**: price has risen quickly.
  '1gw597of5q5': '高於 **70** 叫**超買**：價格升得很快。',
  // Below **30** is called **oversold**: price has fallen quickly.
  'atqcc6bub6': '低於 **30** 叫**超賣**：價格跌得很快。',
  // Above 50 leans bullish; below 50 leans bearish.
  '14ysgfnt5rv': '高於 50 傾向看漲；低於 50 傾向看跌。',
  // Apple with RSI and the Stochastic oscillator. Compare where each reaches its extremes with what price did next: sometimes a turn, sometimes nothing.
  '1d14dq797xi': '蘋果公司加上 RSI 和隨機指標。比較每個指標到達極端值的位置，以及價格之後的表現：有時會轉向，有時甚麼都沒發生。',
  // Stochastic oscillator
  '4uee752ngn': '隨機指標',
  // The **Stochastic** asks a different question: where is the close within the high-low range of the last 14 candles?
  '20lv3gux38p': '**隨機指標**問的是另一個問題：收市價位於最近 14 支陰陽燭高低區間的哪裡？',
  // %K = 100 x (close - lowest low) / (highest high - lowest low)
  '1xszjq2o1gb': '%K = 100 x（收市價 - 最低價）/（最高價 - 最低價）',
  // Near 100 means closing at the top of the recent range; near 0, at the bottom. %K is smoothed, and %D is a 3-period average of %K that acts as a signal line.
  '24xnw5xoo1q': '接近 100 代表收在近期區間的頂部；接近 0 則在底部。%K 會經過平滑處理，%D 是 %K 的 3 週期平均，作為訊號線。',
  // Above **80** is overbought; below **20** is oversold.
  '24vgqoun513': '高於 **80** 為超買；低於 **20** 為超賣。',
  // %K crossing above %D while below 20 is read as a buy signal; crossing below while above 80, a sell signal.
  '2ebb4lu8y1g': '在 20 以下時 %K 向上穿越 %D 被解讀為買入訊號；在 80 以上時向下穿越則為賣出訊號。',
  // Divergence
  'uvfnpf2396': '背馳',
  // **Divergence** is when price and the oscillator disagree. Price makes a higher high but RSI makes a lower high: the new high was reached with less momentum than the last. This is a bearish divergence, a warning that the move is tiring. The reverse at lows is a bullish divergence.
  '2aati1zyuj5': '**背馳**是價格與擺動指標互相矛盾。價格創出更高的高點，RSI 卻創出更低的高點：新高點的動能比上一次少。這是看跌背馳，警告走勢正在疲倦。在低位出現相反情況就是看漲背馳。',
  // **Overbought does not mean about to fall.** In a strong uptrend RSI can sit above 70 for weeks while price keeps rising. Selling because RSI is high is one of the most common beginner losses.
  '2eq3673s0ra': '**超買不代表即將下跌。**在強勁的上升趨勢中，RSI 可以連續幾星期停留在 70 以上，而價格繼續上升。因為 RSI 高而賣出，是新手最常見的虧損原因之一。',
  // Oscillators work best in ranges and worst in trends, the opposite of moving averages.
  '1mrgqlsfnww': '擺動指標在區間市中最有效，在趨勢市中最差，與移動平均線剛好相反。',
  // The Stochastic is fast and jumpy, so it gives many false signals.
  '2ca3713mzzl': '隨機指標快而跳動，所以會給出很多假訊號。',
  // Divergences are obvious afterwards and unreliable in real time.
  'jo6h7vxg1h': '背馳事後很明顯，實時卻不可靠。',
  // Match the tool to the market
  'ygmvwbz2v9': '讓工具配合市場',
  // First decide whether the market is trending or ranging (the Market structure module). In a range, oscillator extremes are useful. In a trend, use them only in the direction of the trend: for example, buy when RSI dips towards 40 in an uptrend.
  '13d9xemwcal': '先判斷市場是在走趨勢還是處於區間（市場結構單元）。在區間市中，擺動指標的極端值很有用。在趨勢市中，只沿趨勢方向使用它們：例如在上升趨勢中，RSI 回落到 40 附近時買入。',
  // MACD
  '1ozkyypbuiu': 'MACD',
  // The gap between two moving averages, used to see momentum building or fading.
  'yjxt3bc1nh': '兩條移動平均線之間的差距，用來觀察動能在增強還是減弱。',
  // **MACD** stands for Moving Average Convergence Divergence. It measures the distance between a fast and a slow EMA. When a trend accelerates, the fast average pulls away from the slow one; when it loses steam, they come back together.
  '145g0sa9s0c': '**MACD** 是移動平均匯聚背馳指標（Moving Average Convergence Divergence）的縮寫。它量度快速和慢速 EMA 之間的距離。趨勢加速時，快線會拉開與慢線的距離；失去動力時，兩者會重新靠攏。',
  // The three parts
  'zhkjhl6h82': '三個部分',
  // The **MACD line** = 12-period EMA minus 26-period EMA.
  'hemsepe27c': '**MACD 線** = 12 週期 EMA 減 26 週期 EMA。',
  // The **signal line** = 9-period EMA of the MACD line.
  'elo3tb87ay': '**訊號線** = MACD 線的 9 週期 EMA。',
  // The **histogram** = MACD line minus signal line, drawn as bars.
  '1bnkldrsdzm': '**柱狀圖** = MACD 線減訊號線，以柱畫出。',
  // SPY with MACD in the lower pane. The bars are the histogram: positive when the MACD line is above its signal line.
  '225rf18mbkt': 'SPY 加上下方窗格的 MACD。柱就是柱狀圖：MACD 線高於訊號線時為正。',
  // **Signal-line crossover**: MACD crossing above its signal line is read as momentum turning up; crossing below, turning down.
  '1ql62hkg5sq': '**訊號線交叉**：MACD 向上穿越訊號線被解讀為動能轉強；向下穿越則為轉弱。',
  // **Zero-line crossover**: MACD above zero means the 12 EMA is above the 26 EMA, an uptrend. Below zero is a downtrend.
  'gb2okimxm6': '**零線交叉**：MACD 高於零代表 12 EMA 高於 26 EMA，即上升趨勢。低於零則是下跌趨勢。',
  // **Histogram**: bars shrinking towards zero show momentum fading before the lines actually cross. It is the earliest of the three.
  '1rinhlt7uqb': '**柱狀圖**：柱逐漸向零收縮，顯示動能在兩線真正交叉前已經減弱。它是三者中最早出現的訊號。',
  // **Divergence**: price makes a new high while MACD makes a lower high.
  'hjg4cmcs67': '**背馳**：價格創出新高，MACD 卻創出更低的高點。',
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
  // **Double lag.** MACD is an average of averages. Crossovers often arrive after much of the move has happened.
  'pbkz0v6su3': '**雙重滯後。**MACD 是平均線的平均。交叉往往在走勢大部分完成後才出現。',
  // **Whipsaws in ranges.** With no trend, the lines tangle around zero and cross constantly.
  '6u3uylr9p6': '**在區間市中來回打臉。**沒有趨勢時，兩條線會在零附近糾纏並不斷交叉。',
  // **Not comparable between instruments.** MACD is in price units, so a reading of 50 on Bitcoin and 0.5 on a stock say nothing about each other.
  '1nee0kn9mjo': '**不同品種之間無法比較。**MACD 以價格單位計算，所以比特幣讀數 50 和股票讀數 0.5 之間沒有任何可比性。',
  // MACD and RSI together
  '228h2frx6u9': 'MACD 與 RSI 一起用',
  // MACD is a trend-following momentum tool; RSI is a stretched-or-not gauge. They often get paired, but both are made from the same closing prices, so two agreeing indicators are less independent confirmation than they look.
  'dixqstqrl6': 'MACD 是順勢的動能工具；RSI 是量度是否被拉伸的量表。它們常常被配對使用，但兩者都由同一批收市價計算，所以兩個指標意見一致，並不如表面看來那麼獨立地互相確認。',
  // Do not stack indicators
  'nqm31ovnwj': '不要堆疊指標',
  // Five indicators that all derive from price will mostly agree with each other and with the chart. More lines do not mean more information. One trend tool, one momentum tool and volume is plenty.
  'v2yezz6p8w': '五個全部由價格衍生的指標，大多數時候會互相一致，也與圖表一致。線條更多並不代表資訊更多。一個趨勢工具、一個動能工具加上成交量就已經足夠。',
  // Volume and VWAP
  '3shimt1bp1': '成交量和 VWAP',
  // Volume shows how much conviction is behind a move. VWAP shows the average price actually paid.
  'bfo3tb82eg': '成交量顯示走勢背後有多少信心。VWAP 顯示實際成交的平均價格。',
  // **Volume** is the amount traded during a candle, drawn as bars under the chart. Price tells you what happened; volume tells you how many participants were behind it. It is the one common indicator that is not derived from price.
  '2dtuzktxlua': '**成交量**是一支陰陽燭期間的成交數量，以柱畫在圖表下方。價格告訴你發生了甚麼；成交量告訴你背後有多少參與者。它是唯一一個不是由價格衍生的常用指標。',
  // Reading volume
  'ma1v56ha1y': '解讀成交量',
  // A move on **high volume** has broad participation and is more likely to continue.
  'tc1q2wpzzv': '在**大成交量**下出現的走勢參與者廣泛，較有可能延續。',
  // A move on **low volume** is easier to reverse, because few traders were committed to it.
  'lwu4x3w6p0': '在**小成交量**下出現的走勢較容易逆轉，因為投入其中的交易者很少。',
  // A **breakout** with a jump in volume is more trustworthy than one without.
  '28loi4krvso': '成交量跳升的**突破**比沒有跳升的更可信。',
  // In a healthy uptrend, volume tends to rise on up moves and fall on pullbacks.
  '1qyk50w14r8': '在健康的上升趨勢中，成交量往往在上升時增加、在回調時減少。',
  // An enormous volume spike after a long move, sometimes called a **climax**, can mark exhaustion: everyone who wanted in is in.
  '2b3xer6l7tj': '在長時間走勢之後出現巨大的成交量急升（有時叫**高潮**），可能代表力竭：所有想入場的人都已經入場。',
  // Volume moving average
  '1ti3ybot338': '成交量移動平均線',
  // "High" only means something relative to normal. A **volume moving average**, usually 20 periods, draws a line across the volume bars showing the typical amount. Bars well above it are unusual.
  'c2etccwbvy': '「大」只是相對正常水平而言。**成交量移動平均線**（通常為 20 週期）在成交量柱上畫一條線，顯示典型的成交量。遠高於它的柱才是異常的。',
  // Apple with a 20-day volume average on the volume bars and monthly VWAP on price. Look for the tallest volume bars and what price did on those days.
  '20lnwcoc709': '蘋果公司加上成交量柱上的 20 日成交量平均線，以及價格上的每月 VWAP。找出最高的成交量柱，看看價格在那些日子做了甚麼。',
  // VWAP
  '23kojl9iq9w': 'VWAP',
  // **VWAP** is the volume-weighted average price: the average price paid during the session, counting each candle by how much traded in it.
  '204a3ux211h': '**VWAP** 是成交量加權平均價：時段內的平均成交價，每支陰陽燭按其成交量計算比重。',
  // VWAP = sum(typical price x volume) / sum(volume),   typical price = (high + low + close) / 3
  '2q3va3867z': 'VWAP = 總和（典型價格 x 成交量）/ 總和（成交量），   典型價格 =（最高 + 最低 + 收市）/ 3',
  // The sums restart each session. In this app that is each day on intraday charts and each month on daily charts.
  '1wuqf7b7m8o': '總和在每個時段重新開始。在這個應用程式中，日內圖表是每日，日線圖則是每月。',
  // Price above VWAP means the average buyer this session is in profit; traders read that as buyers in control.
  '26f6oqodctd': '價格高於 VWAP 代表這個時段的平均買家正在獲利；交易者把這解讀為買方主導。',
  // Day traders treat VWAP as a fair price. Buying below it is getting a better-than-average deal.
  '10tyz4cjw72': '日內交易者把 VWAP 當作公平價。低於它買入就是比平均更好的成交。',
  // Price often returns to VWAP during the day, so it acts as intraday support or resistance.
  '1nnih0svuob': '價格在日內常常回到 VWAP，所以它可以作為日內的支持位或阻力位。',
  // Volume shows how much traded, not whether buyers or sellers were the more eager side.
  '27ftiuo56b5': '成交量顯示成交了多少，而不是買方還是賣方更積極。',
  // Crypto and forex trade on many venues; the volume you see is from one of them. The bundled EUR/USD history has no volume at all, so VWAP cannot be drawn on it.
  '20kqi8vwahq': '加密貨幣和外匯在很多平台交易；你看到的成交量只來自其中一個。內置的歐元／美元歷史完全沒有成交量，所以無法畫出 VWAP。',
  // Volume has a daily rhythm. A bar can be above average simply because of the time of day.
  '1nfik3hswms': '成交量有每日的節奏。一支柱高於平均，可能只是因為時間。',
  // VWAP resets each session, so it means little in the first few candles after a reset.
  '231825r1uuf': 'VWAP 每個時段重新計算，所以重設後最初幾支陰陽燭的意義不大。',
  // End of the indicators module
  '1ll7ax16es8': '技術指標單元完結',
  // You have seen one tool for each job: trend (moving averages), volatility (Bollinger, ATR), momentum (RSI, Stochastic, MACD) and participation (volume, VWAP). Add them to any chart from the Indicators button.
  '14ktklp4n39': '你已經看過每種用途各一個工具：趨勢（移動平均線）、波幅（保力加通道、ATR）、動能（RSI、隨機指標、MACD）以及參與度（成交量、VWAP）。可以從「技術指標」按鈕把它們加到任何圖表上。',
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
  // Overbought
  '2dyngvfrui8': '超買',
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
  // What does the Stochastic oscillator measure?
  '244o2xlbsx5': '隨機指標量度甚麼？',
  // The average gain versus average loss
  'f6iy5bqal4': '平均升幅相對平均跌幅',
  // Where the close sits within the recent high-low range
  '1xqfghlot71': '收市價位於近期高低區間的哪裡',
  // The gap between two moving averages
  'x7e8gvtc3y': '兩條移動平均線之間的差距',
  // Volume
  'alc1a0j1b0': '成交量',
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
  // A squeeze
  '1ewzukrwr6m': '收窄擠壓',
  // The new high came with less momentum. It warns the move may be tiring.
  '3b7t8qq9r9': '新高點的動能較少。這警告走勢可能正在疲倦。',
  // Oscillators such as RSI and Stochastic are most useful in:
  '46dm50j00': 'RSI 和隨機指標這類擺動指標在哪裡最有用？',
  // Strong trends
  'hl8pazqknl': '強勁的趨勢',
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
  // 12-period EMA minus 26-period EMA
  '9k6pxedafp': '12 週期 EMA 減 26 週期 EMA',
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

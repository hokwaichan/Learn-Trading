// Traditional Chinese for content/lessons/02-candlesticks.ts and content/quizzes/02-candlesticks.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Reading candlesticks
  '1vqzpduejr0': '閱讀陰陽燭',
  // What one candle tells you, and the handful of candle patterns worth knowing.
  '1jzgc5ktgn0': '一支陰陽燭告訴你甚麼，以及值得認識的幾個陰陽燭形態。',
  // Body and wicks
  '1f107t0q38l': '實體和影線',
  // Each candle packs four prices into one shape: where price opened, closed, and how far it travelled.
  '16rkfhy4767': '每支陰陽燭把四個價格濃縮成一個形狀：價格在哪裡開市、收市，以及走了多遠。',
  // A price chart could just be a line joining closing prices, but that hides most of what happened. A **candlestick** shows four prices for one period of time:
  '10ar6b1xr39': '價格圖表可以只是一條連接收市價的線，但那樣會隱藏大部分發生過的事。**陰陽燭**顯示一段時間內的四個價格：',
  // **Open**: the first price of the period.
  '1skcmdcue7o': '**開市**：該時段的第一個價格。',
  // **High**: the highest price reached.
  '1yijc9yt30n': '**最高**：到達過的最高價格。',
  // **Low**: the lowest price reached.
  '1f576nyvud2': '**最低**：到達過的最低價格。',
  // **Close**: the last price of the period.
  'ase0o9wux0': '**收市**：該時段的最後一個價格。',
  // Together these are called **OHLC**. The thick part of the candle, the **body**, spans the open and the close. The thin lines above and below, the **wicks** (also called shadows), reach to the high and the low.
  '1lz3unyqko': '這四個價格合稱 **OHLC**。陰陽燭粗的部分是**實體**，由開市價延伸至收市價。上下的細線是**影線**（亦稱燭芯），延伸至最高價和最低價。',
  // Colour tells you the direction. If the close is above the open, price rose during the period and the candle is drawn in the "up" colour. If the close is below the open, price fell and it is drawn in the "down" colour. Drag the sliders to build your own candle:
  '2045fw7xnzt': '顏色告訴你方向。如果收市高於開市，價格在該時段上升，陰陽燭以「上升」的顏色畫出。如果收市低於開市，價格下跌，以「下跌」的顏色畫出。拖動滑桿，砌出你自己的陰陽燭：',
  // Reading the shape
  '1dttvrvepv1': '解讀形狀',
  // A **long body** means price moved decisively one way and stayed there. One side was in control.
  '25jekhlt1sj': '**長實體**代表價格果斷地朝一個方向移動並停留在那裡。其中一方佔主導。',
  // A **short body** means the open and close were close together: buyers and sellers roughly cancelled out.
  '1pz7q4nsx34': '**短實體**代表開市和收市很接近：買賣雙方大致互相抵消。',
  // A **long upper wick** means price went up and was pushed back down. Sellers rejected the higher prices.
  '290itskwdim': '**長上影線**代表價格上升後被壓回。賣方拒絕了較高的價格。',
  // A **long lower wick** means price went down and was pushed back up. Buyers rejected the lower prices.
  '2aadxoawuc7': '**長下影線**代表價格下跌後被推回。買方拒絕了較低的價格。',
  // Try it on a real chart
  'mh8kgeryxw': '在真實圖表上試試',
  // Open the Charts page and click any candle. The Explain tab describes that exact candle in these terms.
  '2679zxzkq1l': '打開圖表頁並點擊任何一支陰陽燭。「解釋」分頁會用這些詞彙描述那一支陰陽燭。',
  // Timeframes
  '1om777qb269': '時間週期',
  // The same market looks different depending on how much time each candle covers.
  '230fg4uafno': '同一個市場看起來會有所不同，視乎每支陰陽燭涵蓋多少時間。',
  // The **timeframe** is how much time one candle represents. On a 1-hour chart each candle is one hour of trading; on a daily chart each is one day. The app offers 1 minute, 5 minutes, 15 minutes, 1 hour, 4 hours and 1 day.
  '242wx90le49': '**時間週期**是一支陰陽燭代表的時間。在 1 小時圖上，每支陰陽燭是一小時的交易；在日線圖上，每支是一天。這個應用程式提供 1 分鐘、5 分鐘、15 分鐘、1 小時、4 小時和 1 日。',
  // It is all the same price data, grouped differently. Twenty-four 1-hour candles contain exactly the same trading as one daily candle: the daily open is the first hourly open, the daily close is the last hourly close, and the daily high and low are the extremes of the whole day.
  '9z3emas3nv': '這些全是同一份價格數據，只是分組方式不同。二十四支 1 小時陰陽燭包含的交易，與一支日線陰陽燭完全相同：日線的開市價是第一個小時的開市價，收市價是最後一個小時的收市價，最高和最低價是全日的極端值。',
  // Apple on the daily timeframe. Each candle is one full trading day. On a 1-hour chart every one of these would be several candles, with far more small wiggles.
  '1az4suq6lpy': '蘋果公司的日線圖。每支陰陽燭是一整個交易日。在 1 小時圖上，每一支都會變成好幾支陰陽燭，還有多得多的細小起伏。',
  // What changes with the timeframe
  '27guqdwnu3c': '時間週期改變了甚麼',
  // **Short timeframes** (1 to 15 minutes) show a lot of detail and a lot of noise: small moves that mean little. Patterns appear often and fail often.
  'eee41o18kq': '**短時間週期**（1 至 15 分鐘）顯示大量細節和大量雜訊：意義不大的細小波動。形態經常出現，也經常失效。',
  // **Long timeframes** (4 hours, 1 day) hide the noise and show the bigger direction. Signals are rarer and more reliable, but you wait longer and stops need to be wider.
  '1w7bjl6fg9c': '**長時間週期**（4 小時、1 日）隱藏雜訊，顯示較大的方向。訊號較少但較可靠，不過你要等得更久，止蝕也要更闊。',
  // Which to use
  '1wuauctrd3t': '應該用哪一個',
  // It depends on how long you plan to hold a trade. Someone holding for minutes watches the 1 and 5 minute charts. Someone holding for days or weeks watches the daily. As a beginner, start with the 4-hour or daily chart: things happen slowly enough to think.
  'rd9xtai1m0': '視乎你打算持倉多久。持倉幾分鐘的人看 1 分鐘和 5 分鐘圖；持倉幾日或幾星期的人看日線。作為新手，先從 4 小時圖或日線圖開始：事情發生得夠慢，讓你有時間思考。',
  // Look one level up
  '1v8htft7wan': '看高一級',
  // A common habit is to check the next timeframe up before trading. A rise on the 15-minute chart is less convincing if the daily chart is falling hard. Trade in the direction of the bigger picture when you can.
  '1yvs4hphy4': '常見的習慣是交易前先看高一級的時間週期。如果日線圖正在急跌，15 分鐘圖上的上升就沒那麼有說服力。盡可能順著大局的方向交易。',
  // The newest candle is unfinished
  '44wg14mvy': '最新的陰陽燭未完成',
  // The last candle on a live chart is still forming. Its close, high and low keep changing until its period ends, so wait for a candle to finish before reading its shape.
  '2c9s4cni1e2': '即時圖表上最後一支陰陽燭仍在形成。在時段結束前，它的收市、最高和最低價都會不斷變化，所以要等陰陽燭完成後才解讀它的形狀。',
  // Single-candle patterns
  '227bn27cjk7': '單支陰陽燭形態',
  // Doji, hammer, shooting star and marubozu: four shapes that say something about who is in control.
  '1h9mhkuh2en': '十字星、錘頭、射擊之星和光頭光腳陰陽燭：四個能說明誰在主導的形狀。',
  // A few candle shapes have names because traders have long read them the same way. A named shape is a hint about the balance between buyers and sellers, never a promise. Where it appears matters as much as the shape.
  '1m5qhwh6q23': '有幾種陰陽燭形狀有名稱，因為交易者一直以同一方式解讀它們。有名稱的形狀只是暗示買賣雙方的力量平衡，從來不是承諾。它出現的位置和形狀本身一樣重要。',
  // Doji
  'lln2fctvkm': '十字星',
  // A **doji** opens and closes at almost the same price, so its body is a thin line with wicks either side. Buyers and sellers ended in a draw. After a strong move it suggests the move is tiring.
  'dj62gzsdj0': '**十字星**的開市價和收市價幾乎相同，所以實體是一條細線，兩邊有影線。買賣雙方打成平手。在強勁走勢之後出現，暗示走勢開始疲倦。',
  // Hammer
  'w3ye98d4ey': '錘頭',
  // A **hammer** has a small body at the top and a long lower wick, at least twice the body. Price fell hard during the period and buyers pushed it all the way back. It matters after a decline, where it can mark buyers stepping in. The same shape after a rise is called a **hanging man** and is a warning instead.
  '63doov0e69': '**錘頭**的細小實體位於頂部，下影線很長，至少是實體的兩倍。價格在該時段大幅下跌，買方又把它一路推回去。它在下跌之後才有意義，可能代表買方入場。同樣的形狀出現在上升之後叫**上吊線**，反而是警號。',
  // Shooting star
  'cdwugpaglq': '射擊之星',
  // A **shooting star** is the hammer upside down: small body at the bottom, long upper wick. Price rose hard and sellers pushed it back. It matters after a rise. The same shape after a decline is an **inverted hammer**.
  '1f4yiu0jxyu': '**射擊之星**是倒轉的錘頭：細小實體在底部，上影線很長。價格大幅上升，賣方又把它壓回去。它在上升之後才有意義。同樣的形狀出現在下跌之後叫**倒錘頭**。',
  // Marubozu
  '189oug5poew': '光頭光腳陰陽燭',
  // A **marubozu** is almost all body, with little or no wick. Price opened at one extreme and closed at the other. It shows one side in control from start to finish, and suggests the move may continue.
  '12h392lbxkc': '**光頭光腳陰陽燭**幾乎全是實體，很少或沒有影線。價格在一個極端開市，在另一個極端收市。它顯示一方由頭到尾都佔主導，暗示走勢可能延續。',
  // Four named candles in context. The hammer comes after a fall and the shooting star after a rise, which is what gives them meaning.
  '28k7wn8e3bz': '四種有名稱的陰陽燭放在背景中看。錘頭出現在下跌之後，射擊之星出現在上升之後，這正是它們有意義的原因。',
  // How to use them
  '1gdx7f4bi9': '如何使用它們',
  // **Context first.** A hammer in the middle of a sideways market means nothing. A hammer after a long fall, at a price where buyers appeared before, is worth noticing.
  '2cqi17wxwsb': '**背景優先。**在橫行市中間出現的錘頭毫無意義。在長時間下跌之後、在之前曾有買家出現的價位出現的錘頭，才值得留意。',
  // **Wait for confirmation.** Many traders want the next candle to move in the expected direction before acting.
  'erua6gv02y': '**等待確認。**很多交易者會等下一支陰陽燭朝預期方向移動才行動。',
  // **They fail often.** Treat a pattern as one piece of evidence, and always have a stop-loss.
  '15tnobpqcn0': '**它們經常失效。**把形態當作一份證據，並且永遠設好止蝕。',
  // Practise spotting them
  '20jsmq67j8m': '練習辨認它們',
  // The Trainer page will show you real chart segments and ask which pattern you see.
  '16hu6uh4ywe': '訓練場會給你看真實的圖表片段，問你看到甚麼形態。',
  // Multi-candle patterns
  '1ol3ovitdzg': '多支陰陽燭形態',
  // Engulfing, morning and evening star, harami, and three soldiers or crows: patterns made of two or three candles.
  '2fpmyw18aeg': '吞沒、早晨之星和黃昏之星、孕線，以及紅三兵或三隻烏鴉：由兩至三支陰陽燭組成的形態。',
  // Some patterns take two or three candles to form. They describe a small story: one side in control, then losing it. As with single candles, they matter most after a clear move.
  '1soyot3yqeb': '有些形態需要兩三支陰陽燭才能形成。它們描述一個小故事：一方佔主導，然後失去主導。與單支陰陽燭一樣，它們在明顯的走勢之後最有意義。',
  // Engulfing (two candles)
  'u1on525kx1': '吞沒（兩支陰陽燭）',
  // A **bullish engulfing** pattern is a down candle followed by a larger up candle whose body completely covers the first body. Sellers were in charge, then buyers overwhelmed them in a single period. A **bearish engulfing** is the reverse: an up candle swallowed by a larger down candle.
  '1mlsmedan49': '**看漲吞沒**形態是一支下跌陰陽燭之後出現一支更大的上升陰陽燭，其實體完全覆蓋第一支的實體。賣方原本主導，之後買方在一段時間內就把他們壓倒。**看跌吞沒**則相反：一支上升陰陽燭被一支更大的下跌陰陽燭吞沒。',
  // Harami (two candles)
  '181abjvm2c9': '孕線（兩支陰陽燭）',
  // A **harami** is the opposite arrangement: a large candle followed by a small one whose body sits entirely inside the first. The strong move has stalled. It is a weaker signal than engulfing: it shows hesitation, not a takeover.
  '18a07ht4f6g': '**孕線**的排列相反：一支大陰陽燭之後出現一支小陰陽燭，其實體完全位於第一支之內。強勁的走勢停頓了。它是比吞沒弱的訊號：它顯示的是猶豫，而不是接管。',
  // Morning star and evening star (three candles)
  '2mpcbge6qm': '早晨之星和黃昏之星（三支陰陽燭）',
  // A **morning star** appears after a decline: a long down candle, then a small-bodied candle showing indecision, then a long up candle that closes well into the first candle. Selling, a pause, then buying. The **evening star** is the mirror image after a rise.
  'oz6ft99t63': '**早晨之星**出現在下跌之後：一支長的下跌陰陽燭，然後一支實體細小、顯示猶豫的陰陽燭，再一支長的上升陰陽燭，收市深入第一支之內。先賣出、再停頓，然後買入。**黃昏之星**是上升之後的鏡像。',
  // A bullish engulfing pattern ends the fall on the left. An evening star ends the rise on the right.
  '1jr8a7gg9db': '左邊一個看漲吞沒形態結束了下跌。右邊一個黃昏之星結束了上升。',
  // Bullish engulfing
  '20wajkwzla9': '看漲吞沒',
  // Evening star
  'ib65dzfrqw': '黃昏之星',
  // Three white soldiers and three black crows
  '23sg4vmombw': '紅三兵和三隻烏鴉',
  // **Three white soldiers** are three long up candles in a row, each opening inside the previous body and closing higher. Buyers are firmly in control. **Three black crows** are three long down candles in a row: sellers in control. They show strength, though after three big candles the move may already be stretched.
  'ktwvaqoekl': '**紅三兵**是連續三支長的上升陰陽燭，每支都在上一支實體內開市，並收市更高。買方牢牢控制大局。**三隻烏鴉**是連續三支長的下跌陰陽燭：賣方控制大局。它們顯示強勢，但三支大陰陽燭之後，走勢可能已經走得太遠。',
  // Three white soldiers on the way up, three black crows on the way down.
  '1nfatf1ycq5': '上升途中的紅三兵，下跌途中的三隻烏鴉。',
  // Three white soldiers
  '1oryq4xhasc': '紅三兵',
  // Three black crows
  '76bvfu4rfd': '三隻烏鴉',
  // Keep them in proportion
  '231tx8ouqxd': '保持合理的比重',
  // These patterns say who won the last two or three periods. They say nothing certain about the next ten.
  'q4snjbdjcy': '這些形態說明了最近兩三段時間誰贏了。它們對之後十段時間沒有任何確定的說法。',
  // They carry more weight on longer timeframes and at prices that have mattered before (support and resistance, in the next module).
  'luq4xk4neq': '它們在較長的時間週期、以及之前曾經重要的價位（支持位和阻力位，下一個單元會講）上更有份量。',
  // Higher volume on the candle that completes the pattern makes it more convincing.
  '28orkur0bua': '完成形態的那支陰陽燭成交量較大，會令它更有說服力。',
  // Easy to see in hindsight
  '25kfuwjwnxs': '事後很容易看見',
  // Looking back at a chart, every turning point seems to have a pattern on it. You do not see all the times the same pattern appeared and nothing happened. Judge patterns by trading them on paper, not by scrolling back.
  '2753aap4zo0': '回看圖表時，每個轉折點似乎都有一個形態。但你看不到同一個形態出現後甚麼都沒發生的所有時候。應該用模擬交易去評價形態，而不是靠往回捲動圖表。',
  // Which two prices does the body of a candle span?
  '1lrbkwha0h8': '陰陽燭的實體橫跨哪兩個價格？',
  // The high and the low
  'k01lx8z0rh': '最高價和最低價',
  // The open and the close
  '1ql1mzcdcge': '開市價和收市價',
  // The bid and the ask
  'o7okui6xu5': '買入價和賣出價',
  // The open and the high
  '2fu06gvvzo7': '開市價和最高價',
  // The body runs from the open to the close. The wicks reach out to the high and the low.
  'jgz1ki1upq': '實體由開市價延伸至收市價。影線則延伸至最高價和最低價。',
  // A candle opened at 50, reached a high of 56, a low of 49, and closed at 51. What does its long upper wick tell you?
  'acgapmduko': '一支陰陽燭在 50 開市，最高到 56，最低到 49，在 51 收市。它長長的上影線告訴你甚麼？',
  // Buyers stayed in control all period
  '1fdun82yvbk': '買方整段時間都保持主導',
  // Price rose a long way and was pushed back down
  '2dfk5vo4eca': '價格上升了很多然後被壓回',
  // Price never went above the open
  '1k7zhctxisx': '價格從未高於開市價',
  // Volume was low
  'nrfut104k5': '成交量很低',
  // Price got to 56 but closed at 51. Sellers rejected the higher prices, leaving a long upper wick.
  '1dq98jzpvo7': '價格到了 56 但在 51 收市。賣方拒絕了較高的價格，留下長長的上影線。',
  // A candle closes below its open. It is:
  '8iooue3gdr': '一支陰陽燭收市低於開市。它是：',
  // An up (bullish) candle
  'oou7mttnxu': '上升（看漲）陰陽燭',
  // A down (bearish) candle
  '1gdj5dags2v': '下跌（看跌）陰陽燭',
  // A doji
  '176hzeulaml': '十字星',
  // Impossible
  'q8w5yw99sj': '不可能',
  // Close below open means price fell during the period, so it is drawn in the down colour.
  '13xcvm9l1kg': '收市低於開市代表價格在該時段下跌，所以以下跌的顏色畫出。',
  // What does a very small body with wicks on both sides suggest?
  'lco3psgh4h': '實體非常細小、兩邊都有影線，暗示甚麼？',
  // Strong buying
  '28z6fw1fyfz': '強勁的買盤',
  // Strong selling
  'o64tze2zii': '強勁的賣盤',
  // Indecision: buyers and sellers roughly cancelled out
  '17vgk6rz8ew': '猶豫不決：買賣雙方大致互相抵消',
  // The market was closed
  '19bqzxa0ieu': '市場休市',
  // A small body means the open and close were close together, so neither side won the period.
  '1kl0eqi5j8z': '細小的實體代表開市和收市很接近，所以哪一方都沒有贏得這段時間。',
  // On a 4-hour chart, one candle represents:
  '1v4pomrt6a0': '在 4 小時圖上，一支陰陽燭代表：',
  // Four trades
  '266pk8wh9eg': '四宗交易',
  // Four hours of trading
  'scp9babszg': '四小時的交易',
  // Four days of trading
  '1plr01kqqhu': '四天的交易',
  // A quarter of an hour
  '1co0rdg2pxr': '十五分鐘',
  // The timeframe is how much time each candle covers.
  '1xydy9tpxb6': '時間週期是每支陰陽燭涵蓋的時間。',
  // Compared with a daily chart, a 1-minute chart of the same market shows:
  '22wb5wgobcc': '與日線圖相比，同一市場的 1 分鐘圖顯示：',
  // Less noise and fewer signals
  '2d8blhqhgk4': '較少雜訊和較少訊號',
  // More noise and more signals, many of them false
  '20w74qicp7w': '較多雜訊和較多訊號，其中很多是假訊號',
  // Different prices
  '2gmiw4ff9k5': '不同的價格',
  // Only the closing prices
  '21idmmiuut1': '只有收市價',
  // Short timeframes show every small wiggle. Patterns appear often and fail often.
  '287jvi4vezs': '短時間週期顯示每一下細小的起伏。形態經常出現，也經常失效。',
  // The daily chart is falling steadily but the 15-minute chart shows a small rise. The sensible reading is:
  'e7qzw26o0h': '日線圖穩步下跌，但 15 分鐘圖顯示小幅上升。合理的解讀是：',
  // The trend has reversed
  'pgq1pvswec': '趨勢已經反轉',
  // The rise is probably a small bounce inside a bigger decline
  'lpe03g99ww': '這次上升很可能只是更大跌勢中的小反彈',
  // The daily chart is wrong
  '1bu957zwwqq': '日線圖錯了',
  // Timeframes cannot disagree
  '4bpgvomg65': '不同的時間週期不可能有分歧',
  // Check the next timeframe up. A short-term move against the bigger trend is less convincing.
  '1l65gzfxdpa': '看高一級的時間週期。與大趨勢相反的短期走勢沒那麼有說服力。',
  // Why should you wait before reading the shape of the newest candle on a live chart?
  'kb9fnkpov1': '為甚麼要等一等才解讀即時圖表上最新陰陽燭的形狀？',
  // It is always a doji
  '8zd9d7brck': '它永遠都是十字星',
  // It is still forming, so its close, high and low can change
  '1n8po9loq8n': '它仍在形成，所以收市、最高和最低價都可能改變',
  // It has no volume
  'jpgz8nasd': '它沒有成交量',
  // It uses a different timeframe
  'xs7owj8gkb': '它用了不同的時間週期',
  // Until its period ends the last candle keeps changing. A hammer can turn into something else in the final minutes.
  '1h17zqfxoik': '在時段結束之前，最後一支陰陽燭會不斷變化。錘頭可以在最後幾分鐘變成別的東西。',
  // A candle after a long decline has a small body at the top and a lower wick three times the body. It is a:
  '1ddbecnewvi': '長時間下跌後的一支陰陽燭，細小實體在頂部，下影線是實體的三倍。它是：',
  // Small body on top, long lower wick, after a fall: a hammer. Price was pushed down and buyers brought it back.
  '4kpr27xkvf': '細小實體在頂部、長下影線、出現在下跌之後：這是錘頭。價格被壓低，買方又把它帶回來。',
  // A shooting star is most meaningful when it appears:
  '210jjctltxy': '射擊之星出現在甚麼時候最有意義？',
  // After a rise
  'wp8vlpjfik': '上升之後',
  // After a decline
  '169sk8kq0k3': '下跌之後',
  // In a sideways market
  '15s11glia7v': '橫行市中',
  // At any time
  '1v1fjohp1ko': '任何時候',
  // A shooting star shows sellers rejecting higher prices. That matters after price has been rising.
  'm3fd865zzw': '射擊之星顯示賣方拒絕較高的價格。這在價格一直上升之後才有意義。',
  // What does a marubozu show?
  'crmvs1m56n': '光頭光腳陰陽燭顯示甚麼？',
  // Indecision
  '3c470ctg0o': '猶豫不決',
  // One side in control from open to close
  '1xwxsn03ysc': '由開市到收市都是一方主導',
  // A reversal is certain
  'pb6a134c8a': '肯定會反轉',
  // Very low volume
  '2b1craqof5c': '成交量非常低',
  // A marubozu is nearly all body: price opened at one extreme and closed at the other.
  '49muyl7bt2': '光頭光腳陰陽燭幾乎全是實體：價格在一個極端開市，在另一個極端收市。',
  // You see a hammer in the middle of a flat, sideways market. How much weight should you give it?
  '2a8v9h2wdbw': '你在一個平坦、橫行的市場中間看到一個錘頭。應該給它多少比重？',
  // A lot: hammers always mean buy
  '24qy5j71zal': '很多：錘頭一定代表買入',
  // Little: without a decline before it, the shape has no real meaning
  'yp90i6lpq3': '很少：之前沒有下跌，這個形狀就沒有真正的意義',
  // None: hammers only matter on daily charts
  '230oinz5wqa': '完全沒有：錘頭只在日線圖上有意義',
  // It means sell
  'o8jlv885k8': '它代表賣出',
  // Context comes first. A hammer is about buyers stepping in after selling. With no prior fall there is nothing to reverse.
  '1zyvf6tb2bl': '背景優先。錘頭講的是賣壓之後買方入場。之前沒有下跌，就沒有東西可以反轉。',
  // A doji appears after several strong up candles. The most reasonable reading is:
  '8mvu5w7je0': '幾支強勁的上升陰陽燭之後出現一個十字星。最合理的解讀是：',
  // Price will definitely fall
  '1d7xx4pe7k0': '價格一定會下跌',
  // The up move may be losing energy; watch the next candle
  '18u2ra1bki9': '升勢可能正在失去動力；留意下一支陰陽燭',
  // Buyers are stronger than ever
  '28ddupe6f5u': '買方比以往任何時候都強',
  // Nothing can be learned
  'tq6s1tbe7j': '甚麼都看不出來',
  // A doji shows a draw between buyers and sellers. After a strong move that is a sign of tiring, not a guaranteed reversal.
  '136jcb3r3gf': '十字星顯示買賣雙方打成平手。在強勁走勢之後，這是疲倦的跡象，而不是保證會反轉。',
  // A small down candle is followed by a larger up candle whose body completely covers it. This is a:
  'y5gi1vqv9u': '一支細小的下跌陰陽燭之後出現一支更大的上升陰陽燭，其實體完全覆蓋前者。這是：',
  // Bearish engulfing
  '24ix3uz6mnc': '看跌吞沒',
  // Harami
  '202uub5ftft': '孕線',
  // Morning star
  '1gitc12qgkm': '早晨之星',
  // An up candle swallowing the previous down candle is a bullish engulfing pattern: buyers overwhelmed sellers.
  '11vg8f1428x': '一支上升陰陽燭吞沒上一支下跌陰陽燭，就是看漲吞沒形態：買方壓倒了賣方。',
  // How is a harami different from an engulfing pattern?
  '13va3lod1xt': '孕線與吞沒形態有甚麼不同？',
  // It has three candles
  'b0c8k542qc': '它有三支陰陽燭',
  // The second candle is small and sits inside the first, rather than covering it
  '4hxudfppbi': '第二支陰陽燭細小並位於第一支之內，而不是把它覆蓋',
  // It only appears on daily charts
  '13lrog05801': '它只出現在日線圖上',
  // It is always bearish
  '82bsgj4fhm': '它一定是看跌的',
  // In a harami the second body is inside the first. It shows hesitation, a weaker signal than the takeover an engulfing shows.
  'fhjwiul70g': '孕線的第二個實體位於第一個之內。它顯示的是猶豫，是比吞沒所顯示的接管更弱的訊號。',
  // Which sequence describes a morning star?
  '59g6ehg1x7': '哪一個次序描述的是早晨之星？',
  // Long up candle, small candle, long down candle
  '25qsypt4261': '長的上升陰陽燭、細小陰陽燭、長的下跌陰陽燭',
  // Long down candle, small candle, long up candle
  'kdgsnhcbba': '長的下跌陰陽燭、細小陰陽燭、長的上升陰陽燭',
  // Three long up candles
  '1kx3pvu70mp': '三支長的上升陰陽燭',
  // Two dojis in a row
  '1m5ih9n9v1j': '連續兩個十字星',
  // Selling, a pause, then buying: long down, small body, long up. It appears after a decline.
  '14wfzricab3': '先賣出、再停頓，然後買入：長的下跌、細小實體、長的上升。它出現在下跌之後。',
  // Three long down candles in a row, each closing lower, are called:
  '144axy8rbgc': '連續三支長的下跌陰陽燭，每支收市都更低，叫做：',
  // An evening star
  'yx9gtsoqjm': '黃昏之星',
  // A triple top
  '1ihof4u34is': '三重頂',
  // Three black crows show sellers firmly in control. Three white soldiers are the bullish version.
  '6tkwz8uzlp': '三隻烏鴉顯示賣方牢牢控制大局。紅三兵是看漲的版本。',
  // What makes a candle pattern more convincing?
  '1ca5rfyjasb': '甚麼會令陰陽燭形態更有說服力？',
  // It appears on a 1-minute chart
  'imt6h1drfb': '它出現在 1 分鐘圖上',
  // It forms after a clear move, at a price that mattered before, with higher volume
  'k9ryea2ifl': '它在明顯的走勢之後、在之前重要的價位形成，而且成交量較大',
  // It has a well-known name
  'm2sitnrqlx': '它有一個廣為人知的名稱',
  // It appears many times a day
  'x7nxfbzj5j': '它一天出現很多次',
  // Context, location and volume all add weight. A pattern on its own in the middle of nowhere means little.
  '5q5xybgi00': '背景、位置和成交量都會增加份量。單獨出現在無關痛癢位置的形態意義不大。',
} satisfies Record<string, string>;

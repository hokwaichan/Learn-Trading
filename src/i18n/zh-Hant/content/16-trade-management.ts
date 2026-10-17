// Traditional Chinese for content/lessons/16-trade-management.ts and content/quizzes/16-trade-management.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Managing a trade and an account
  '1v0x3onsyl7': '管理交易和戶口',
  // What to do after the entry: partial exits and trailing stops, and how to keep several trades from adding up to one large bet.
  '23g7cmxejq9': '入場後要做甚麼：部分平倉和追蹤止蝕，以及如何避免幾宗交易加起來變成一個大注碼。',
  // Scaling in and out
  '16nwckoh468': '分段入場和分段出場',
  // You do not have to enter or exit all at once. Splitting a position changes the risk, the reward and how the trade feels.
  'rrgy17ln9b': '你不必一次過入場或出場。分拆持倉會改變風險、回報，以及交易給你的感覺。',
  // So far every trade has been one entry and one exit. In practice many traders split a position into parts. Adding to a position in stages is called **scaling in**. Closing it in stages is called scaling out, or taking **partial profits**.
  '15zwjdx5q55': '到目前為止，每宗交易都是一次入場、一次出場。實際上很多交易者會把持倉分成幾部分。分階段加倉叫做**分段入場**。分階段平倉叫做分段出場，或**部分止賺**。',
  // Scaling out
  '4ungvx60wg': '分段出場',
  // The most common version: close half the position at a first target, usually when the profit equals the risk (1R), and let the rest run toward a further target with the stop moved up.
  '3yvd6lfgwk': '最常見的版本：在第一個目標平掉一半持倉，通常是利潤等於風險（1R）的時候，然後把止蝕上移，讓餘下部分向更遠的目標發展。',
  // The same trade, managed two ways
  'trmn0qb5ls': '同一宗交易，兩種管理方式',
  // Entry 100, stop 95, so the risk is 5 per unit. You hold 20 units: $100 at risk.
  'llo83hu83q': '入場 100，止蝕 95，所以每單位風險是 5。你持有 20 單位：$100 承受風險。',
  // Price reaches 105, then 115, then falls back to 100.
  '1ywv237xxn': '價格到達 105，然後 115，然後跌回 100。',
  // All-or-nothing with a target at 115: you make 15 x 20 = $300, or 3R.
  '1q21jhnzr8u': '全進全出、目標 115：你賺 15 x 20 = $300，即 3R。',
  // Half off at 105, rest at 115: 5 x 10 + 15 x 10 = $200, or 2R.
  '4jpv1zpqq3': '在 105 平掉一半，餘下在 115 平倉：5 x 10 + 15 x 10 = $200，即 2R。',
  // If instead price had reached 105 and then fallen to the stop: all-or-nothing loses $100. The scaled version makes $50 on the first half and, with the stop moved to the entry, nothing on the rest: +$50.
  '1jarxeq799y': '如果價格到達 105 後跌到止蝕：全進全出虧損 $100。分段版本在第一半賺 $50，而止蝕已移到入場價，餘下部分不賺不蝕：+$50。',
  // Scaling out lowers the best result and improves the worst. It raises your win rate and shrinks your average win. Whether that is better depends on your system: a trend-following method that relies on a few very large winners is hurt by cutting them in half.
  'rod7wzu4tp': '分段出場降低最好的結果，改善最差的結果。它提高你的勝率，縮小你的平均盈利。這是否更好取決於你的系統：依賴少數非常大的贏錢交易的趨勢跟隨方法，把它們切一半會受損。',
  // The break-even stop
  'bac7u5uh8o': '打和止蝕',
  // After the first target is hit, many traders move the stop-loss on the remainder to the entry price. This is a **break-even stop**: the trade can no longer lose. It feels safe, and it has a cost. Price very often comes back to the entry before continuing, so a break-even stop takes you out of trades that would have worked.
  '29ifxij5wn1': '第一個目標達到後，很多交易者把餘下部分的止蝕移到入場價。這就是**打和止蝕**：交易不會再虧損。它感覺安全，但有代價。價格很常在繼續前先回到入場價，所以打和止蝕會令你退出本來會成功的交易。',
  // Move it only after price has made real progress, for example beyond 1R and past a structure level.
  '15rlsc0nvrl': '只在價格有實際進展後才移動它，例如超過 1R 並越過一個結構價位。',
  // Better still, move it to just beyond the most recent swing point, not to an arbitrary price that happens to be your entry.
  '19dq3b1un77': '更好的做法是移到最近的擺動點剛好之外，而不是一個碰巧是你入場價的隨意價格。',
  // Scaling in
  '7woqno0d7w': '分段入場',
  // **Adding to a winner** (pyramiding): you open part of the position, and add more only after price has moved in your favour and you can raise the stop. The total risk never exceeds the original plan. This is how trend followers build large positions safely.
  '230axm4i7mz': '**向贏錢持倉加倉**（金字塔式加倉）：你先開部分持倉，只在價格向你有利的方向移動、而你可以上移止蝕後才加倉。總風險永遠不超過原本的計劃。趨勢跟隨者就是這樣安全地建立大持倉。',
  // **Adding to a loser** (averaging down): you buy more as price falls, to lower the average entry. The position grows as the evidence against it grows. One trend that does not come back wipes out many small recoveries.
  '1d20ku4isa3': '**向虧損持倉加倉**（攤平）：價格下跌時買入更多，以降低平均入場價。反對它的證據越多，持倉就越大。一個不回頭的趨勢就會抹去很多次小幅回升。',
  // Size still comes from the stop
  '1rw16ugq8ue': '規模仍由止蝕決定',
  // However you split it, the money lost if every part is stopped out must stay inside your limit. Use the calculator: if you plan to add a second entry, size both so that the combined loss at the final stop is still 1% of the account.
  '27wn0ab2t89': '不論你怎樣分拆，如果每部分都被止蝕，損失的金額必須保持在你的上限之內。用計算機：如果你計劃加入第二次入場，兩者的規模都要令最終止蝕的合計損失仍是戶口的 1%。',
  // Averaging down is not scaling in
  '1d7xbqmh73b': '攤平不是分段入場',
  // Planned adds to a winning position, with the stop raised each time, reduce risk. Unplanned adds to a losing one, with no stop, are the classic way accounts are lost. If you did not write the add in your plan before entering, it is the second kind.
  '1tji2osrlgv': '按計劃向贏錢持倉加倉，每次都上移止蝕，會降低風險。沒有計劃地向虧損持倉加倉，而且沒有止蝕，是輸光戶口的典型方式。如果加倉不是入場前已寫在計劃裡，就屬於第二種。',
  // Trailing stops: letting winners run
  '1i950wqsg6v': '追蹤止蝕：讓贏錢交易繼續跑',
  // A stop that follows price up locks in profit without guessing where the move will end. Four ways to trail, and what each costs.
  'utcti9acbv': '跟隨價格上移的止蝕，不用猜走勢在哪裡結束就能鎖定利潤。四種追蹤方法，以及各自的代價。',
  // A fixed target answers "where will I get out?" before the trade begins. The trouble is that the best trades go much further than any sensible target. A **trailing stop** has no target: it follows price in your favour and takes you out only when price turns by a set amount.
  '2c5p815kjtt': '固定目標在交易開始前回答「我在哪裡離場？」。問題是最好的交易走得比任何合理目標都遠得多。**追蹤止蝕**沒有目標：它跟隨價格向你有利的方向移動，只在價格回頭一個設定幅度時才令你離場。',
  // A long from 100 with the stop raised to just under each new higher low. It is finally hit near 115, keeping most of the move without ever predicting the top.
  '16ntybpm32m': '在 100 做多，止蝕上移到每個新的更高低點剛好之下。最終在 115 附近被觸及，保留了大部分走勢，而從未需要預測頂部。',
  // First stop
  '2arz16305m2': '最初的止蝕',
  // Raised under the higher low
  '1s0nn90f9xb': '上移到更高的低點之下',
  // Raised again
  '1njao1duix': '再上移',
  // Raised again: hit here
  '1785c593h2r': '再上移：在這裡被觸及',
  // The high: no one knows it yet
  '26fdiz31fxo': '高點：還沒有人知道',
  // Four ways to trail
  '1shg95w91ar': '四種追蹤方法',
  // **By structure.** Move the stop to just beyond each new swing low (in an uptrend) once it is confirmed. It respects how the market is actually moving. This is the method in the chart.
  '1f5ilhbpi4r': '**按結構。**每個新擺動低點確認後（上升趨勢中），把止蝕移到它剛好之外。它尊重市場實際的走法。這是圖表中的方法。',
  // **By ATR.** Keep the stop a multiple of the average true range, often two or three times, below the highest close since entry. It widens automatically when the market gets more volatile.
  '2fvgadeqtaz': '**按 ATR。**把止蝕保持在入場以來最高收市價之下若干倍平均真實波幅，通常是兩至三倍。市場波動加劇時它會自動放闊。',
  // **By moving average.** Stay in while price closes above, say, the 20-period average, and exit on a close below it. Simple, but slow to react after a sharp spike.
  '1n9w25isney': '**按移動平均線。**價格收市高於例如 20 週期平均線時持有，收市低於它時離場。簡單，但急升後反應慢。',
  // **By percentage.** Keep the stop a fixed percentage below the highest price. Easy to automate, and blind to both structure and volatility.
  '1qfo30t6ffh': '**按百分比。**把止蝕保持在最高價之下固定百分比。容易自動化，但對結構和波動都視而不見。',
  // The trade-off
  '25x5bdhm03k': '取捨',
  // A tight trail keeps more of each move but gets knocked out by normal pullbacks. A loose trail stays in the big trends but gives back a large part of the profit at the end. There is no setting that does both. Choose the one that matches your timeframe, and accept its cost.
  '19ackwnn58z': '緊的追蹤止蝕保留每段走勢較多，但會被正常回調打出局。鬆的追蹤止蝕能留在大趨勢中，但在最後回吐大部分利潤。沒有一個設定能兩者兼得。選擇配合你時間週期的那一種，並接受它的代價。',
  // ATR trailing stop (long) = highest close since entry - multiple x ATR
  '1r1niuz6cku': 'ATR 追蹤止蝕（多倉）= 入場以來最高收市價 - 倍數 x ATR',
  // With a highest close of 120, an ATR of 2 and a multiple of 3, the stop is at 114. It only ever moves up, never down.
  'z52orfazrc': '最高收市價 120、ATR 2、倍數 3，止蝕在 114。它只會上移，永不下移。',
  // Rules
  '1kddytp99dm': '規則',
  // A trailing stop only moves in your favour. Moving it away from price to "give the trade room" turns it back into hope.
  '1b3dbxzzfme': '追蹤止蝕只向對你有利的方向移動。把它移離價格以「給交易空間」，等於把它變回希望。',
  // Do not trail from the first candle. Give the trade its initial stop until it has moved by at least the amount you risked.
  '23k3sqmijz9': '不要從第一支陰陽燭就開始追蹤。在交易至少移動了你承受風險的幅度之前，保留它最初的止蝕。',
  // Decide the method before entering, and write it in the plan.
  '1w4b63kcg0a': '入場前決定方法，並寫在計劃中。',
  // Targets and trails together
  'wynndaa5oy': '目標和追蹤一起用',
  // A common compromise is the scaled exit from the last lesson: take half at a fixed target, and trail the stop on the other half. You bank something and still take part if the move runs.
  '28wv4dnawc7': '常見的折衷是上一課的分段出場：在固定目標平掉一半，另一半用追蹤止蝕。你先落袋一些，走勢延續時仍能參與。',
  // You will never sell the top
  '1ioqwbwuxrm': '你永遠不會賣在最高位',
  // A trailing stop always exits after the high, by design. Watching profit shrink before the stop is hit is uncomfortable, and that discomfort is the price of catching the occasional move that goes three times further than you expected.
  'gbrtftk31f': '追蹤止蝕按設計總是在高點之後才離場。看著利潤在止蝕觸發前縮水並不舒服，而這種不適，就是捕捉偶爾比你預期走遠三倍的走勢的代價。',
  // Correlation: when five trades are really one
  'w30cb51xol': '相關性：當五宗交易其實是一宗',
  // Positions that move together are a single bet. Risking 1% on each of five correlated trades is risking 5% on one idea.
  'dflng6omx6': '一起移動的持倉是一個注碼。在五宗相關的交易各承受 1% 風險，就是在一個想法上承受 5% 風險。',
  // The 1% rule limits what one trade can cost. It says nothing about what happens when several trades lose at the same moment. **Correlation** measures how closely two instruments move together, and it is the reason a careful trader can still lose 5% in an afternoon.
  'k8s62njntm': '1% 規則限制一宗交易的損失。它沒有說明幾宗交易同時虧損時會怎樣。**相關性**量度兩個工具一起移動的程度，也是一個小心的交易者仍可能在一個下午輸掉 5% 的原因。',
  // What moves together
  '1k6g96scd9i': '甚麼會一起移動',
  // **Crypto.** Most coins follow Bitcoin. A long in Bitcoin, Ethereum and Solana is close to one position three times the size.
  '2fn5cl4scrn': '**加密貨幣。**大部分幣跟隨比特幣。同時做多比特幣、以太幣和 Solana，接近一個三倍大的持倉。',
  // **Stocks.** Shares in the same sector, and most large shares generally, fall together when the whole market falls.
  'simsaoty87': '**股票。**同一行業的股票，以及一般大部分大型股，在整體市場下跌時一起下跌。',
  // **Currencies.** EUR/USD and GBP/USD both have the dollar on one side. If the dollar strengthens, both fall.
  '1x6j4u10b8y': '**貨幣。**EUR/USD 和 GBP/USD 一邊都是美元。如果美元轉強，兩者都會下跌。',
  // **Across markets.** In a panic, things that normally behave differently, such as shares and crypto, drop at the same time.
  'awl4wf1vcg': '**跨市場。**恐慌時，平常表現不同的東西，例如股票和加密貨幣，會同時下跌。',
  // SPY, a fund holding 500 large US companies, in the first half of 2025. Compare its shape with the chart of Apple below, over the same months.
  '1a6dck1k0u4': 'SPY，一隻持有 500 間美國大型公司的基金，2025 年上半年的走勢。把它的形狀與下面同期的蘋果圖表比較。',
  // Apple over the same six months. The size of the moves differs, but the turning points line up: the sharp fall and the recovery come in the same weeks. Holding both gave much less diversification than holding two unrelated things.
  'ni9xepj1a9': '蘋果同樣六個月的走勢。走勢幅度不同，但轉折點對齊：急跌和回升都在同幾個星期出現。同時持有兩者，分散風險的效果遠低於持有兩樣不相關的東西。',
  // Measuring exposure
  '1b69vwalomc': '量度風險承擔',
  // Add up the risk of every open position that depends on the same thing, and treat the total as one trade.
  '1ledd8s5l3t': '把所有取決於同一件事的未平倉持倉的風險加起來，把總和當作一宗交易。',
  // Three longs
  'hl0403zj25': '三個多倉',
  // You are long Bitcoin, Ethereum and Solana, each sized to lose 1% at its stop.
  'h9p3s2rh2x': '你做多比特幣、以太幣和 Solana，每個的規模都令觸及止蝕時虧損 1%。',
  // Bitcoin drops 6% on bad news. The other two follow, as they usually do.
  'ac4vdjicsk': '比特幣因壞消息下跌 6%。另外兩個如常跟隨。',
  // All three stops are hit within the hour. Loss: 3% of the account, from one event.
  'frjv33tprt': '三個止蝕在一小時內全部觸發。損失：戶口的 3%，來自一件事件。',
  // The fix: decide a limit for total risk in correlated positions, for example 2%. With three such trades, each is sized at about 0.67%.
  '1seyhnno2hj': '解決方法：為相關持倉的總風險定一個上限，例如 2%。有三宗這類交易時，每宗規模約為 0.67%。',
  // Practical rules
  '1zrmcm5xw11': '實用規則',
  // Before opening a trade, ask what else you hold that would lose in the same scenario.
  'wp3qnpvwvx': '開倉前，問自己還持有甚麼會在同一情境下虧損。',
  // Set a cap on total open risk, such as 3% to 5% of the account across everything.
  'jdgmg6otwr': '為未平倉總風險設定上限，例如所有持倉合計戶口的 3% 至 5%。',
  // Set a lower cap for positions in the same group.
  '10sd517epgn': '為同一組別的持倉設定較低的上限。',
  // A long and a short in correlated instruments partly cancel. That can be a deliberate hedge, or it can mean you are paying two sets of fees for no position at all.
  'gcnnok89o9': '在相關工具上同時做多和做空會部分抵銷。這可以是刻意的對沖，也可以代表你付兩份手續費卻根本沒有持倉。',
  // Correlation rises when it hurts most
  'qpacpbm9m5': '相關性在最傷的時候上升',
  // In calm markets different assets drift apart and diversification seems to work. In a sell-off almost everything falls together. Plan your total risk for the bad day, not the average one.
  '1g0yms3hn39': '平靜的市場中，不同資產各走各路，分散投資似乎有效。拋售時差不多所有東西一起下跌。為壞日子而不是平均日子計劃你的總風險。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The Positions tab lists everything open with its stop. Add up the losses if every stop were hit at once: that is your real exposure. The Analytics page shows results by instrument type and by symbol, which is where concentration shows up afterwards.
  'p3ffwbhtwf': '「持倉」分頁列出所有未平倉持倉及其止蝕。把所有止蝕同時觸發的損失加起來：那就是你真正的風險承擔。績效分析頁按工具類型和代號顯示成績，集中風險事後會在那裡顯現。',
  // Losing streaks and risk of ruin
  '1sr82l1ez2y': '連敗和破產風險',
  // Every system has runs of losses. Whether you survive them depends almost entirely on how much you risk per trade.
  '1xiyswhjuxr': '每個系統都有連續虧損。你能否捱過，幾乎完全取決於每宗交易承受多少風險。',
  // A system that wins 50% of the time does not win every other trade. Wins and losses come in clumps, and over a few hundred trades a run of seven or eight losses in a row is close to certain. **Risk of ruin** is the chance that such a run takes your account down so far that you cannot, or will not, continue.
  '1zchdlqqm14': '勝率 50% 的系統不會每隔一宗就贏一次。贏和輸是成堆出現的，在幾百宗交易中，連輸七八次幾乎是必然的。**破產風險**是這樣一段連敗令戶口跌到你無法或不願繼續的機會。',
  // How long a losing streak to expect
  '1jhgp6x32eb': '預期會有多長的連敗',
  // Over about 100 trades, the longest run of losses you should plan for is roughly:
  '1jgr39qm1d0': '在約 100 宗交易中，你應該預計的最長連輸大約是：',
  // Win rate 60%: five or six in a row.
  '1u2tqyphxb3': '勝率 60%：連輸五至六次。',
  // Win rate 50%: seven in a row.
  '257q1qp8vis': '勝率 50%：連輸七次。',
  // Win rate 40%: nine or ten in a row.
  'ijcv9u28mi': '勝率 40%：連輸九至十次。',
  // Win rate 30%: thirteen or more in a row.
  '1fctdgxcoaz': '勝率 30%：連輸十三次或以上。',
  // These are normal outcomes for a system that is working, not signs that it has broken. Run the simulation a few times and watch how different the paths are with the same win rate and reward.
  '10avfsxl0hs': '這些是運作正常的系統的正常結果，不是系統失效的跡象。多執行幾次模擬，看看同樣的勝率和回報下路徑有多不同。',
  // What a streak costs
  'uyrdhmst6o': '連敗的代價',
  // Ten losses in a row
  '27u61m86d1o': '連輸十次',
  // Risking 1% per trade: the account falls about 9.6%. It needs an 11% gain to recover. Unpleasant, routine.
  'rnzps55wwk': '每宗交易承受 1% 風險：戶口下跌約 9.6%。需要上升 11% 才能回本。不好受，但很平常。',
  // Risking 2%: down 18%. Needs 22% to recover.
  '4udpag7lte': '承受 2%：下跌 18%。需要 22% 才能回本。',
  // Risking 5%: down 40%. Needs 67% to recover.
  '2go3o1i25v7': '承受 5%：下跌 40%。需要 67% 才能回本。',
  // Risking 10%: down 65%. Needs 187% to recover. For practical purposes the account is finished.
  'gfm6qaazu9': '承受 10%：下跌 65%。需要 187% 才能回本。實際上這個戶口已經完了。',
  // The system and the streak are identical in every row. The only thing that changed is position size. This is why the 1% rule exists: it makes the worst normal streak survivable.
  '2d36aejrtlp': '每一行的系統和連敗都完全相同。唯一改變的是持倉規模。這就是 1% 規則存在的原因：它令最差的正常連敗也能捱過。',
  // The Kelly criterion
  '64p04r2agu': '凱利公式',
  // The **Kelly criterion** is a formula for the bet size that grows an account fastest over the long run, given the win rate and the reward-to-risk ratio.
  '1sk14d3whsr': '**凱利公式**是一條根據勝率和回報風險比，計算長期令戶口增長最快的注碼大小的公式。',
  // Kelly fraction = win rate - (1 - win rate) / reward-to-risk
  '6d0mjw9xnx': '凱利比例 = 勝率 - (1 - 勝率) / 回報風險比',
  // With a 50% win rate and 2 to 1 reward: 0.5 - 0.5 / 2 = 0.25, or 25% of the account per trade.
  '1d30nidz27k': '勝率 50%、回報 2 比 1：0.5 - 0.5 / 2 = 0.25，即每宗交易用戶口的 25%。',
  // Twenty-five percent is an alarming number, and it should be. Kelly assumes you know your true win rate and reward exactly. You do not: you have an estimate from a limited number of trades, and it is probably optimistic. Betting full Kelly on an overestimated edge leads to ruin. Professionals who use it at all bet a small fraction of it. For a retail trader the useful lesson is the direction: a bigger edge justifies more risk, no edge justifies none, and risking more than Kelly makes you poorer even with a winning system.
  'j1v8hgll1e': '百分之二十五是個令人警惕的數字，也應該如此。凱利公式假設你準確知道真正的勝率和回報。你並不知道：你只有一個從有限交易得出的估計，而且很可能偏樂觀。以全凱利押注在被高估的優勢上會導致破產。專業人士即使使用，也只押它的一小部分。對散戶來說，有用的教訓是方向：優勢越大，越值得承受更多風險；沒有優勢就不應承受任何風險；承受多於凱利比例的風險，即使系統能贏也會令你越來越窮。',
  // Limits that keep you in the game
  '1f283e8gjv2': '讓你留在場上的限制',
  // **Per trade**: 1% or less while learning.
  '25cb54aicj1': '**每宗交易**：學習期間 1% 或以下。',
  // **Per day**: stop at about three times the per-trade risk.
  'wbhgnj91pw': '**每日**：在約每宗交易風險的三倍時停止。',
  // **Per month**: if the account is down 10% from its peak, halve your size until it recovers. At 20%, stop and review everything on paper.
  '1puvprghqpx': '**每月**：如果戶口由高峰下跌 10%，把規模減半直到回升。到 20% 時，停止並以模擬交易重新檢討一切。',
  // The streak will come
  'gz16vhzkb3': '連敗一定會來',
  // New traders size up after a run of wins, which is exactly when a run of losses is due to arrive at the larger size. Keep the risk per trade fixed as a percentage, so it shrinks automatically as the account falls and grows only as it grows.
  '1ei6caw43ut': '新手在連贏後加大規模，而那正是連敗應該在較大規模下出現的時候。把每宗交易的風險固定為百分比，這樣它會隨戶口下跌自動縮小，只在戶口增長時才增長。',
  // Analytics shows your longest losing run and your maximum drawdown. Compare them with the table above for your own win rate.
  '2bhyt2k17hv': '績效分析顯示你最長的連輸和最大回撤。把它們與上表中你自己的勝率比較。',
  // What does scaling out of a trade do to your results?
  'q7em9n4zka': '分段出場對你的成績有甚麼影響？',
  // Raises the best outcome and worsens the worst
  '2cjf7uvt2ry': '提高最好的結果，令最差的結果更差',
  // Lowers the best outcome and improves the worst
  '1yz21wdmrmf': '降低最好的結果，改善最差的結果',
  // Has no effect
  '2gh4jtig14p': '沒有影響',
  // Removes all risk
  '29dr1cf1akn': '消除所有風險',
  // Taking part of the position off early banks something if price reverses, and gives up some profit if it keeps going.
  '1gb2xv4cg6w': '提早平掉部分持倉，在價格反轉時能落袋一些，在走勢延續時則放棄部分利潤。',
  // Entry 50, stop 48, 100 units. You sell half at 52 and the rest is stopped at break-even. What is the result?
  '1bzapcqr7g': '入場 50，止蝕 48，100 單位。你在 52 賣出一半，餘下部分在打和位被止蝕。結果是多少？',
  // Half the position (50 units) made 2 each: $100. The other half closed at the entry for nothing.
  '1cahj8qijsr': '一半持倉（50 單位）每單位賺 2：$100。另一半在入場價平倉，不賺不蝕。',
  // What is the hidden cost of moving a stop to break-even early?
  'qr5qbzphrx': '過早把止蝕移到打和位的隱藏代價是甚麼？',
  // Higher fees
  'jt5bcqdb26': '手續費較高',
  // Price often returns to the entry before continuing, so good trades are closed for nothing
  'yvqq00so28': '價格常在繼續前先回到入場價，所以好的交易被白白平倉',
  // The stop stops working
  '18p9j085xi2': '止蝕失效',
  // There is none
  '1rvlgo31p8q': '沒有代價',
  // Entry prices are frequently retested. A break-even stop placed too soon exits trades that would have won.
  '26k3fc9acqe': '入場價經常被重新測試。太早設定的打和止蝕會退出本來會贏的交易。',
  // Which is the safe form of scaling in?
  'k5mi0evikw': '哪一種是安全的分段入場？',
  // Adding to a losing position to lower the average price
  '2edlbfqh2lj': '向虧損持倉加倉以降低平均價',
  // Adding to a winning position while raising the stop so total risk does not grow
  '1vdl8xe7b1d': '向贏錢持倉加倉，同時上移止蝕，令總風險不增加',
  // Doubling size after every loss
  '6du3p8xked': '每次虧損後把規模加倍',
  // Adding without a stop
  'h94bg9n10p': '不設止蝕地加倉',
  // Pyramiding into a winner with a raised stop keeps total risk within the plan. Averaging down increases it.
  'rhkeqpb38l': '以上移的止蝕向贏錢持倉金字塔式加倉，令總風險保持在計劃之內。攤平則會增加風險。',
  // You plan two entries in the same trade. How should they be sized?
  'me5ce3gr3p': '你計劃在同一宗交易中分兩次入場。規模應該怎樣定？',
  // Each at 1% risk
  '85jxhw0qqd': '每次承受 1% 風險',
  // So that the combined loss at the final stop stays within your 1% limit
  'sitgpi6udd': '令最終止蝕時的合計損失保持在你的 1% 上限之內',
  // The second at double the first
  '1seqo9u9pb8': '第二次是第一次的兩倍',
  // Size does not matter for the second
  '1ygru2kbu6q': '第二次的規模無關重要',
  // The limit applies to the whole position. Two full-size entries would double the risk.
  'qfkf6pyuap': '上限適用於整個持倉。兩次全額入場會令風險加倍。',
  // What does a trailing stop replace?
  '1ox7hnndi5a': '追蹤止蝕取代甚麼？',
  // The entry
  '23bcyjbfv9w': '入場',
  // The fixed profit target
  'dgaavixijz': '固定的止賺目標',
  // The fee
  'p9x0u1ir7p': '手續費',
  // The position size
  '1npigqn8g3v': '持倉規模',
  // A trailing stop has no target. It exits only when price turns back by a set amount.
  'bkw7ngy9sq': '追蹤止蝕沒有目標。它只在價格回頭一個設定幅度時離場。',
  // In which direction may a trailing stop move?
  'xflzmhbw37': '追蹤止蝕可以向哪個方向移動？',
  // Either way
  '1r5ph7hd7ma': '任何方向',
  // Only in favour of the trade
  '24o61336ovp': '只向對交易有利的方向',
  // Only away from price
  '1xt344aon97': '只移離價格',
  // It never moves
  'j4fueahtgq': '它從不移動',
  // It ratchets. Moving it away from price to give the trade room defeats its purpose.
  '1gmmjzhqcjc': '它只進不退。把它移離價格以給交易空間，就失去了它的作用。',
  // Highest close since entry 80, ATR 1.5, multiple 2. Where is the ATR trailing stop on a long?
  '17kot27izys': '入場以來最高收市價 80，ATR 1.5，倍數 2。多倉的 ATR 追蹤止蝕在哪裡？',
  // Two ATRs is 3, taken from the highest close: 80 - 3 = 77.
  '59ugx4b2tl': '兩個 ATR 是 3，由最高收市價減去：80 - 3 = 77。',
  // What is the cost of a tight trailing stop?
  '1zoxoprr4at': '緊的追蹤止蝕有甚麼代價？',
  // It gives back too much profit at the end
  '1z58ayuwzd3': '它在最後回吐太多利潤',
  // Normal pullbacks knock you out of good trends early
  'rxan1ewzq1': '正常回調會過早把你打出好的趨勢',
  // Higher fees per trade
  '1kwoadkr761': '每宗交易手續費較高',
  // It cannot be placed
  '2dc841pt1gn': '它無法設定',
  // A tight trail keeps more of each small move but exits on ordinary noise before the big move arrives.
  '26wi8mmaega': '緊的追蹤止蝕保留每段小走勢較多，但會在大走勢到來前因普通雜訊而離場。',
  // Why does a trailing stop never sell the exact top?
  '2bsrhlj8o4l': '為甚麼追蹤止蝕永遠不會賣在準確的頂部？',
  // It is badly designed
  '2da7xa895e4': '它設計得不好',
  // It only triggers after price has already turned down from the high
  '2f2mivwm5kl': '它只在價格已從高點回落後才觸發',
  // Exchanges prevent it
  '2exdj043pvr': '交易所阻止它',
  // It sells too early
  '1nog7osqw7n': '它賣得太早',
  // By construction it exits after a pullback of a set size. Giving back some profit is the price of staying in long moves.
  '2ggo3c9pxbp': '按其構造，它在設定幅度的回調後才離場。回吐部分利潤是留在大走勢中的代價。',
  // You are long Bitcoin, Ethereum and Solana, each risking 1%. What is your real exposure to a crypto sell-off?
  'dzw509gp7i': '你做多比特幣、以太幣和 Solana，每個承受 1% 風險。你對加密貨幣拋售的真正風險承擔是多少？',
  // About 1%
  '2bbon0jz65j': '約 1%',
  // Close to 3%
  '2wn2w3636x': '接近 3%',
  // Zero, they offset
  'h6geyu6y2s': '零，它們互相抵銷',
  // Impossible to say
  '178a7fem2iv': '無法說',
  // The three move together, so they behave like one position. All three stops can be hit by the same event.
  '40wu7uj623': '三者一起移動，所以表現得像一個持倉。三個止蝕可以被同一件事件觸發。',
  // Which pair is most likely to be strongly correlated?
  '8ulufga8g0': '哪一對最可能有強烈相關性？',
  // EUR/USD and GBP/USD
  '2f1ugs9x5qj': 'EUR/USD 和 GBP/USD',
  // Apple shares and the price of wheat
  '9cs0vjcxn3': '蘋果股票和小麥價格',
  // Bitcoin and a 3-month Treasury bill
  '1czkfoaucna': '比特幣和 3 個月美國國庫券',
  // Gold and one small company share
  'sw94vir646': '黃金和一隻小型公司股票',
  // Both pairs have the US dollar on one side, so dollar strength or weakness moves them together.
  '11oweq7cd7j': '兩個貨幣對一邊都是美元，所以美元強弱會令它們一起移動。',
  // How should correlated positions be sized?
  '21a3k7wypoi': '相關的持倉應該怎樣定規模？',
  // Each at full risk
  '1vecjxkuncm': '每個都承受全額風險',
  // So that their combined risk stays within a limit for the group
  'vei73jxh0f': '令它們的合計風險保持在組別上限之內',
  // Larger than usual
  '1rg57knxc1b': '比平常大',
  // Without stops
  '47tknb81h6': '不設止蝕',
  // Treat the group as one trade and divide the risk between its members.
  '9k45h3tiyx': '把組別當作一宗交易，在成員之間分配風險。',
  // What tends to happen to correlations in a market panic?
  '1kiej5tlwvv': '市場恐慌時相關性往往會怎樣？',
  // They fall to zero
  '14gcy90qlee': '跌至零',
  // They rise: most things fall together
  '1ne1uh4ht9a': '上升：大部分東西一起下跌',
  // They reverse
  '2a5p457cxqj': '反轉',
  // They stay the same
  '27cxonr7lvn': '保持不變',
  // Diversification works least when it is needed most. Plan total risk for the bad day.
  '19di7owawxm': '分散投資在最需要時最無效。為壞日子計劃總風險。',
  // A system wins 50% of the time. Over 100 trades, a run of seven losses in a row is:
  '2agq1iwrmna': '一個系統勝率 50%。在 100 宗交易中，連輸七次是：',
  // Proof the system is broken
  '1xfe0p58re0': '系統失效的證明',
  // A normal outcome to plan for
  'a05roaspx7': '需要預計的正常結果',
  // Impossible
  'q8w5yw99sj': '不可能',
  // A sign to double your size
  'b7xlhz01ls': '把規模加倍的訊號',
  // Wins and losses clump. Long streaks are expected even from a sound system.
  '2cikgfkyf2l': '贏和輸成堆出現。即使穩健的系統也預計會有長連敗。',
  // After ten losses in a row risking 5% each, the account is down about 40%. What gain is needed to recover?
  'csmd638wib': '每次承受 5% 風險連輸十次後，戶口下跌約 40%。需要上升多少才能回本？',
  // From 60 you need 40 more to get back to 100: 40 / 60 = 67%.
  '2dwwiau7tgj': '由 60 需要再多 40 才回到 100：40 / 60 = 67%。',
  // The same system and the same losing streak ruin one trader and barely affect another. What differs?
  '1qu49fxrmwz': '同一個系統、同一段連敗，令一個交易者破產，另一個幾乎不受影響。分別在哪裡？',
  // Their broker
  '1jyoze9ny8j': '他們的經紀',
  // The amount risked per trade
  'ru83yq6lys': '每宗交易承受的金額',
  // Their chart colours
  '1cl3u13ez5b': '他們的圖表顏色',
  // The time of day
  '2ef481snqv3': '一天中的時間',
  // Position size is the only thing that decides whether a normal streak is survivable.
  '208f1yf5hqq': '持倉規模是決定正常連敗能否捱過的唯一因素。',
  // Win rate 40%, reward-to-risk 3 to 1. What is the Kelly fraction?
  '2d5jf6u1xez': '勝率 40%，回報風險比 3 比 1。凱利比例是多少？',
  // 0.4 - 0.6 / 3 = 0.4 - 0.2 = 0.2, or 20%.
  'd4uocnll4g': '0.4 - 0.6 / 3 = 0.4 - 0.2 = 0.2，即 20%。',
  // Why should a retail trader not bet the full Kelly fraction?
  '1dpkp1wr4x9': '為甚麼散戶不應以全凱利比例下注？',
  // It is illegal
  '1el4nkx4e2b': '這是違法的',
  // The win rate and reward are only estimates, and overestimating them leads to ruin
  'iojiqyk6wl': '勝率和回報只是估計，高估它們會導致破產',
  // It is always too small
  '1ddxdpaphfm': '它總是太小',
  // It only applies to casinos
  '1d9w5zod1w2': '它只適用於賭場',
  // Kelly assumes a perfectly known edge. Real edges are uncertain and usually overestimated, so a small fraction is the most anyone should use.
  '1goesrhufyh': '凱利公式假設優勢完全已知。真實的優勢不確定，而且通常被高估，所以任何人最多只應用它的一小部分。',
  // When should you increase the dollar amount you risk per trade?
  '1and77nw6dn': '你應該在甚麼時候增加每宗交易承受風險的金額？',
  // After a run of wins, to press the advantage
  '2tueeprd8z': '連贏之後，乘勝追擊',
  // Only as the account itself grows, by keeping the percentage fixed
  '1azivhhpcwt': '只在戶口本身增長時，透過保持百分比固定',
  // After a run of losses, to recover faster
  'i1ey8lzmon': '連輸之後，以更快回本',
  // Whenever you feel confident
  '16u387ib46s': '每當你感到自信',
  // A fixed percentage scales the bet with the account automatically, in both directions.
  '1yly2uay3k9': '固定百分比會自動令注碼隨戶口在兩個方向調整。',
} satisfies Record<string, string>;

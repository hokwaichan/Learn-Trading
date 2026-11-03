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
  // Adding to a position in stages is **scaling in**; closing it in stages is scaling out, or taking **partial profits**. The common version: close half at 1R and let the rest run.
  '21ine22p9np': '分階段加倉叫做**分段入場**；分階段平倉叫做分段出場，或**部分止賺**。常見做法：在 1R 平掉一半，讓其餘繼續跑。',
  // The same trade, managed two ways
  'trmn0qb5ls': '同一宗交易，兩種管理方式',
  // Entry 100, stop 95, 20 units: $100 at risk.
  '29usw6iuwca': '入場 100，止蝕 95，20 單位：風險 $100。',
  // Price reaches 105, then 115, then falls back to 100.
  '1ywv237xxn': '價格到達 105，然後 115，然後跌回 100。',
  // All out at 115: $300, or 3R. Half at 105, half at 115: $200, or 2R.
  'o7pp5jzssg': '全部在 115 平倉：$300，即 3R。一半在 105、一半在 115：$200，即 2R。',
  // If price had reached 105 and then hit the stop: all-or-nothing loses $100; the scaled version, with the stop moved to entry, makes +$50.
  '6j1me9fnoq': '如果價格到 105 後跌到止蝕：一次過平倉的做法輸 $100；分段版本把止蝕移到入場價，賺 +$50。',
  // Scaling out lowers the best result and improves the worst. It hurts trend-following systems that live on a few huge winners.
  '1qod8js6e9c': '分段出場降低最好的結果，改善最差的結果。對靠少數大贏單生存的趨勢跟隨系統不利。',
  // The break-even stop
  'bac7u5uh8o': '打和止蝕',
  // Moving the stop to entry after the first target means the trade cannot lose, but price often revisits the entry before continuing. Move it only after real progress, ideally to just beyond the latest swing point.
  '1s2fqf8hrch': '到第一目標後把止蝕移到入場價，交易便不會輸，但價格常在繼續前回到入場價。要等真正有進展才移，最好移到最近擺動點之外。',
  // **Adding to a winner** (pyramiding): add only after price moves your way and the stop can be raised. Total risk never exceeds the plan.
  '16xrviy5ic4': '**向贏錢持倉加倉**（金字塔式加倉）：只在價格向你有利移動、止蝕可以上移後才加。總風險永不超過計劃。',
  // **Adding to a loser** (averaging down): the position grows as the evidence against it grows.
  '1k3c8himggq': '**向輸錢持倉加倉**（攤平）：反對你的證據越多，持倉越大。',
  // However you split it, the loss if every part is stopped must stay within your limit:
  '1idhh7mv75v': '無論怎樣分，所有部分都被止蝕時的虧損必須在你的上限內：',
  // Averaging down is not scaling in
  '1d7xbqmh73b': '攤平不是分段入場',
  // If the add was not written in your plan before entering, it is the losing kind.
  '1zcec2p4t76': '如果加倉不是入場前已寫進計劃，就是輸錢的那一種。',
  // Trailing stops: letting winners run
  '1i950wqsg6v': '追蹤止蝕：讓贏錢交易繼續跑',
  // A stop that follows price up locks in profit without guessing where the move will end. Four ways to trail, and what each costs.
  'utcti9acbv': '跟隨價格上移的止蝕，不用猜走勢在哪裡結束就能鎖定利潤。四種追蹤方法，以及各自的代價。',
  // The best trades go further than any sensible target. A **trailing stop** has no target: it follows price and exits only when price turns by a set amount.
  'x7lutji1eq': '最好的交易走得比任何合理目標都遠。**追蹤止蝕**沒有目標：它跟隨價格，只在價格反轉一定幅度時才出場。',
  // A long from 100 with the stop raised under each new higher low. It is hit near 115, keeping most of the move without predicting the top.
  'gd74pshnwp': '在 100 做多，止蝕上移到每個新的更高低位之下。最終在約 115 被觸發，保住大部分走勢，而毋須預測頂部。',
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
  // **By structure**: just beyond each confirmed swing low, as in the chart.
  '1it9tydmpy9': '**按結構**：設在每個已確認的擺動低位之外，如圖所示。',
  // **By ATR**: two or three ATR below the highest close; widens when volatility rises.
  '2biy5mfjel3': '**按 ATR**：最高收市價之下兩至三個 ATR；波動增加時自動放闊。',
  // **By moving average**: exit on a close below, say, the 20-period average.
  'ugjfx18c3l': '**按移動平均線**：收市跌穿例如 20 期平均線就出場。',
  // **By percentage**: easy to automate, blind to structure and volatility.
  '1us1zflvcx7': '**按百分比**：容易自動化，但不理結構和波動。',
  // ATR trailing stop (long) = highest close since entry - multiple x ATR
  '1r1niuz6cku': 'ATR 追蹤止蝕（多倉）= 入場以來最高收市價 - 倍數 x ATR',
  // Highest close 120, ATR 2, multiple 3: stop at 114. It only ever moves up.
  'iz5eop6ek': '最高收市 120，ATR 2，倍數 3：止蝕在 114。它只會向上移。',
  // A tight trail keeps more of each move but gets knocked out by normal pullbacks; a loose one stays in big trends but gives back more at the end.
  '1p4kkfxh7wb': '窄的追蹤止蝕保住每段走勢更多利潤，但會被正常回調掃走；闊的能留在大趨勢中，但最後回吐較多。',
  // Only move it in your favour.
  '2f6tb1po86i': '只向有利方向移動。',
  // Keep the initial stop until price has moved at least 1R.
  'uq4ycruev2': '價格最少走了 1R 之前，保留原本止蝕。',
  // Choose the method before entering.
  '2el4mrup514': '入場前選定方法。',
  // Targets and trails together
  'wynndaa5oy': '目標和追蹤一起用',
  // A common compromise: take half at a fixed target and trail the rest.
  '20jmyl9cfdi': '常見的折衷：一半在固定目標平倉，其餘用追蹤止蝕。',
  // You will never sell the top
  '1ioqwbwuxrm': '你永遠不會賣在最高位',
  // A trailing stop always exits after the high. Giving some back is the price of catching the move that goes three times further than expected.
  'hifogu6ww8': '追蹤止蝕必定在高位之後才出場。回吐一些，是捕捉那段比預期遠三倍的走勢的代價。',
  // Correlation: when five trades are really one
  'w30cb51xol': '相關性：當五宗交易其實是一宗',
  // Positions that move together are a single bet. Risking 1% on each of five correlated trades is risking 5% on one idea.
  'dflng6omx6': '一起移動的持倉是一個注碼。在五宗相關的交易各承受 1% 風險，就是在一個想法上承受 5% 風險。',
  // **Correlation** measures how closely two things move together. The 1% rule limits one trade, not several that lose at the same moment.
  '17u52lcm6xt': '**相關性**量度兩樣東西走勢有多一致。1% 規則限制的是一宗交易，而不是同時虧損的幾宗。',
  // Strong positive: move together
  '1nhc1gbh9ge': '強正相關：一起移動',
  // Strong negative: move opposite
  '4wqvb84i1v': '強負相關：反向移動',
  // Low: little relation
  'nbrb8yvhfl': '低相關：關係不大',
  // Each dot pairs two values. If the daily moves of two markets plot as a tight rising line, two positions in them are really one bet.
  '12jp20v5two': '每一點代表一對數值。如果兩個市場的每日走勢畫出來是一條緊密的上升線，在它們的兩個持倉其實是同一注。',
  // **Crypto**: most coins follow Bitcoin.
  '15dy9v4pfwn': '**加密貨幣**：大部分幣跟隨比特幣。',
  // **Stocks**: shares in a sector, and most large shares, fall together.
  '22s77rzn14m': '**股票**：同一行業的股票，以及大部分大型股，會一起下跌。',
  // **Currencies**: EUR/USD and GBP/USD both fall when the dollar strengthens.
  '1zkpmvkoh5e': '**貨幣**：美元走強時，EUR/USD 和 GBP/USD 一起下跌。',
  // EUR/USD and GBP/USD
  '2f1ugs9x5qj': 'EUR/USD 和 GBP/USD',
  // **In a panic**: shares and crypto drop together.
  '1mhqt61n2y2': '**恐慌時**：股票和加密貨幣一起下跌。',
  // SPY, 500 large US companies, in the first half of 2025. Compare with Apple below.
  '1mttrx14bb5': 'SPY，即 500 間美國大型公司，2025 年上半年。與下面的蘋果比較。',
  // Apple over the same months. The size differs, but the fall and the recovery come in the same weeks.
  '28ooguzrgoo': '同期的蘋果。幅度不同，但下跌和回升在同幾個星期出現。',
  // Three longs
  'hl0403zj25': '三個多倉',
  // Long Bitcoin, Ethereum and Solana, each sized to lose 1%.
  'z26pudald': '做多比特幣、以太幣和 Solana，每個都設定為虧損 1%。',
  // Bitcoin drops 6%; the others follow.
  'aksye5u6fe': '比特幣跌 6%；其餘跟隨。',
  // All three stops hit within the hour: 3% lost on one event.
  'kin9te5wiu': '三個止蝕在一小時內全部觸發：一件事輸掉 3%。',
  // Fix: cap correlated risk at, say, 2%, so each is sized at about 0.67%.
  '20z5tqo1i03': '解決方法：把相關持倉的總風險限制在例如 2%，每個約 0.67%。',
  // Before a trade, ask what else you hold that loses in the same scenario.
  'dpqlu6fpcy': '交易前，問自己還持有甚麼會在同一情況下虧損。',
  // Cap total open risk at 3% to 5%, and lower for one group.
  '15ym7n57dpz': '總持倉風險上限 3% 至 5%，同一組別更低。',
  // A long and short in correlated instruments partly cancel: a hedge, or two sets of fees for nothing.
  '1ffmsvpkuif': '相關產品的一長一短會部分抵銷：是對沖，或是付兩份手續費卻等於沒有持倉。',
  // Correlation rises when it hurts most
  'qpacpbm9m5': '相關性在最傷的時候上升',
  // In a sell-off almost everything falls together. Plan total risk for the bad day.
  '1jzwcb1q9yw': '拋售時幾乎所有東西一起下跌。按壞日子規劃總風險。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The Positions tab lists every open position with its stop. Add up the losses if every stop hit at once: that is your real exposure.
  '2100a24iofj': '「持倉」分頁列出所有持倉及其止蝕。把所有止蝕同時觸發的虧損加起來：那才是你真正的風險。',
  // Losing streaks and risk of ruin
  '1sr82l1ez2y': '連敗和破產風險',
  // Every system has runs of losses. Whether you survive them depends almost entirely on how much you risk per trade.
  '1xiyswhjuxr': '每個系統都有連續虧損。你能否捱過，幾乎完全取決於每宗交易承受多少風險。',
  // Wins and losses come in clumps. **Risk of ruin** is the chance that a losing run takes the account down so far that you cannot continue. Over about 100 trades, plan for a longest losing run of:
  '17amuxhqxkc': '贏輸會成串出現。**破產風險**是一段連輸令戶口跌到無法繼續的機會。約 100 宗交易中，應預計最長連輸為：',
  // Win rate 60%: five or six.
  '1up93l744iv': '勝率 60%：五至六次。',
  // Win rate 50%: seven.
  '2428c9zhp46': '勝率 50%：七次。',
  // Win rate 40%: nine or ten.
  '2c9sol8a39r': '勝率 40%：九至十次。',
  // Win rate 30%: thirteen or more.
  'wwme02arye': '勝率 30%：十三次或以上。',
  // Run the simulation a few times: same system, very different paths.
  '2cl9jn9jzky': '多運行幾次模擬：同一系統，路徑大不相同。',
  // Ten losses in a row
  '27u61m86d1o': '連輸十次',
  // Risking 1%: down 9.6%, needs 11% to recover.
  'b4jf592dhz': '每單冒 1%：跌 9.6%，需升 11% 才回本。',
  // Risking 2%: down 18%, needs 22%.
  's6ecvplmkl': '每單冒 2%：跌 18%，需升 22%。',
  // Risking 5%: down 40%, needs 67%.
  '23o4fzvjk9d': '每單冒 5%：跌 40%，需升 67%。',
  // Risking 10%: down 65%, needs 187%. The account is finished.
  'fbe42bgtjq': '每單冒 10%：跌 65%，需升 187%。戶口基本完蛋。',
  // Same system, same streak; only the size changed. That is why the 1% rule exists.
  '28rip33d156': '同一系統、同一段連輸；只有注碼改變。這就是 1% 規則存在的原因。',
  // The Kelly criterion
  '64p04r2agu': '凱利公式',
  // Kelly fraction = win rate - (1 - win rate) / reward-to-risk
  '6d0mjw9xnx': '凱利比例 = 勝率 - (1 - 勝率) / 回報風險比',
  // 50% win rate, 2 to 1 reward: 0.5 - 0.5 / 2 = 0.25, or 25% per trade.
  '17n280uwtut': '勝率 50%，回報 2 比 1：0.5 - 0.5 / 2 = 0.25，即每單 25%。',
  // **Kelly** gives the fastest-growing bet size if you know your edge exactly. You do not, and estimates are usually optimistic, so full Kelly leads to ruin. The lesson is the direction: more edge justifies more risk, no edge justifies none.
  'ekyjj4sl2e': '**凱利公式**給出增長最快的注碼，前提是你準確知道自己的優勢。你並不知道，而估計通常過分樂觀，所以全凱利會導致破產。要學的是方向：優勢越大可冒越多風險，沒有優勢就不應冒險。',
  // **Per trade**: 1% or less while learning.
  '25cb54aicj1': '**每宗交易**：學習期間 1% 或以下。',
  // **Per day**: stop at about three times that.
  '2bkvjsdkz99': '**每日**：約三倍時停手。',
  // **Per month**: down 10% from the peak, halve size. Down 20%, stop and review on paper.
  '1xq0svtmt0b': '**每月**：從高峰跌 10%，注碼減半。跌 20%，停手並在模擬盤上檢討。',
  // The streak will come
  'gz16vhzkb3': '連敗一定會來',
  // Traders size up after a winning run, just before the losing run arrives. Keep risk a fixed percentage so it shrinks as the account falls.
  '110euul0ofa': '交易者在連贏後加大注碼，正好在連輸來臨之前。把風險固定為百分比，戶口下跌時注碼自動縮小。',
  // Analytics shows your longest losing run and maximum drawdown. Compare them with the list above.
  '1rwstf7wp3w': '分析頁顯示你最長的連輸和最大回撤。與上面的列表比較。',
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
  // Impossible
  'q8w5yw99sj': '不可能',
  // The three move together, so they behave like one position. All three stops can be hit by the same event.
  '40wu7uj623': '三者一起移動，所以表現得像一個持倉。三個止蝕可以被同一件事件觸發。',
  // Which pair is most likely to be strongly correlated?
  '8ulufga8g0': '哪一對最可能有強烈相關性？',
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

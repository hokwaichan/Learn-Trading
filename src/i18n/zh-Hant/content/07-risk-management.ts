// Traditional Chinese for content/lessons/07-risk-management.ts and content/quizzes/07-risk-management.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Risk management
  '1lcsam7bl1o': '風險管理',
  // How much to trade, where to get out, and the arithmetic that decides whether you survive.
  '1ltj8sejpky': '交易多少、在哪裡離場，以及決定你能否生存的算術。',
  // Position sizing and the 1% rule
  '1c3g6rwd0h9': '持倉規模與 1% 規則',
  // Decide how many dollars you can lose first. The size of the trade follows from that.
  '1y1phl0vteo': '先決定你能輸多少錢，交易規模由此而來。',
  // **Risk management** keeps being wrong, which happens often, from ending your trading. It matters more than your entry method.
  '1imlr5n8ws2': '**風險管理**確保經常出現的判斷錯誤，不會令你的交易生涯結束。它比入場方法更重要。',
  // The best-known rule: **never risk more than 1% of your account on one trade**. Risk is what you lose if the stop is hit, not the size of the position. On $10,000, ten losses in a row at 1% cost about 10%; at 10% per trade they leave about a third.
  '1g6zx6dvvln': '最著名的規則：**每宗交易承受的風險永遠不要超過帳戶的 1%**。風險是觸及止蝕時輸掉的金額，不是持倉的大小。以 $10,000 計，每宗 1% 連輸十次約虧 10%；每宗 10% 則只剩約三分之一。',
  // Dollars at risk = account x risk percentage.
  '253ql6kzoe': '承受風險的金額 = 帳戶 x 風險百分比。',
  // Put the stop where the chart says. Entry minus stop is the risk per unit.
  '2b818091n7h': '按圖表放止蝕。入場價減止蝕價就是每單位風險。',
  // Entry
  '5p496sooaa': '入場',
  // Units = dollars at risk / risk per unit.
  '1ev20m5u8oz': '單位數 = 承受風險的金額 / 每單位風險。',
  // Position size = (account x risk %) / |entry price - stop price|
  'qk08jc6h6d': '持倉規模 =（帳戶 x 風險 %）/ |入場價 - 止蝕價|',
  // The stop decides the size. A wider stop means a smaller position, so the dollar risk stays the same.
  '1016j3enjy0': '止蝕決定規模。止蝕愈闊，持倉就愈小，所以金額風險保持不變。',
  // Sizing a stock trade
  '1r7zhhhsdp6': '為一宗股票交易決定規模',
  // Account: $10,000. Risk: 1%, so $100.
  '1ll73dbziiy': '帳戶：$10,000。風險：1%，即 $100。',
  // Entry at $50, stop-loss at $48. Risk per share: $2.
  '209v79h2oiv': '在 $50 入場，止蝕在 $48。每股風險：$2。',
  // Size: $100 / $2 = 50 shares, worth $2,500.
  '17cpgqln35v': '規模：$100 / $2 = 50 股，價值 $2,500。',
  // If the stop is hit you lose 50 x $2 = $100, exactly 1%.
  'kpmau361x4': '如果觸及止蝕，你會輸 50 x $2 = $100，剛好 1%。',
  // Every trade then risks the same amount, volatile markets get smaller positions automatically, and you know the worst case before you click.
  'nbtnlseri1': '這樣每宗交易承受的風險都一樣，波動大的市場自動用較小持倉，而且按下前就知道最壞情況。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The order ticket has this calculator built in: enter your risk percentage and stop price and it fills in the size. It warns you if a trade risks more than 2% or has no stop-loss.
  'fvbr8gk90d': '下單面板內置了這個計算機：輸入你的風險百分比和止蝕價，它就會填上規模。如果交易風險超過 2% 或沒有止蝕，它會警告你。',
  // Position size is not risk
  '14vu0n99rgu': '持倉規模不等於風險',
  // A $5,000 position with a stop 1% away
  'h7vi2gqx1j': '一個 $5,000、止蝕距離 1% 的持倉',
  // A $5,000 position with a stop 1% away risks $50. A $1,000 position with no stop risks $1,000.
  '29j0qugoun9': '止蝕在 1% 之外的 $5,000 持倉，風險是 $50。沒有止蝕的 $1,000 持倉，風險是 $1,000。',
  // Where to put a stop-loss
  '13nf4ag813l': '止蝕應該放在哪裡',
  // A stop belongs where the chart proves your idea wrong, not where the loss feels comfortable.
  '6rngpjqftk': '止蝕應該放在圖表證明你的想法錯誤的地方，而不是虧損感覺舒服的地方。',
  // Put the **stop-loss** where your reason for the trade stops being true. Then size the position so that being stopped costs your chosen risk.
  '2cka2709foc': '把**止蝕**放在你入市理由不再成立的地方。然後調整持倉規模，令觸及止蝕的損失等於你選定的風險。',
  // **Structure**: just beyond the level that should hold, such as below the support you are buying.
  'cmmnpdfg0z': '**結構**：剛好在應該守住的價位之外，例如你買入的支持位之下。',
  // **Volatility**: 1.5 to 3 ATR from entry, outside normal noise.
  '3hgir32q3p': '**波幅**：距離入場價 1.5 至 3 個 ATR，在正常雜訊之外。',
  // **Both**: below the level plus a small ATR buffer.
  'htm66tt9gx': '**兩者結合**：價位之下再加少量 ATR 緩衝。',
  // Three candidate stops for a long entered on the bounce from support. Too tight gets hit by noise; the structural stop survives; an arbitrary wide stop risks more than the idea needs.
  'x3aqqczdlu': '在支持位反彈時入場做多的三個候選止蝕。太窄會被雜訊觸發；結構性止蝕能守住；隨意的闊止蝕承受的風險比想法所需的更多。',
  // Support
  '1osc7jo1bd9': '支持位',
  // Too tight: inside the noise
  'xrc2dpfz5r': '太窄：位於雜訊之內',
  // Structural: below support with a buffer
  '6qaitet5oy': '結構性：支持位下方加緩衝',
  // Too wide: far beyond where the idea fails
  '27ehv40uo6s': '太闊：遠超想法失效的位置',
  // **Stop chosen from the loss you want**: it lands inside the noise. Pick it from the chart and change the size instead.
  '1mzjgjdj7ao': '**由想輸的金額去決定止蝕**：止蝕會落在雜訊之內。應按圖表選止蝕，改為調整規模。',
  // **Exactly on the obvious level**: price often dips just through round numbers and visible lows. Leave a little room.
  '240o61ixqaw': '**剛好放在明顯的價位**：價格常會稍為跌穿整數和明顯低點。留一點空間。',
  // **Moving it away as price approaches**: a planned small loss becomes an unplanned big one.
  'qzfre82f14': '**價格逼近時把止蝕移遠**：計劃中的小虧損會變成計劃外的大虧損。',
  // A **trailing stop** only moves in your favour, for example under each new higher low, locking in profit while the trend runs.
  '3pk45bxwqe': '**移動止蝕**只向對你有利的方向移動，例如放在每個新的更高低點之下，在趨勢延續時鎖定利潤。',
  // A stop you move is not a stop
  '1g274gqm7on': '會移動的止蝕不是止蝕',
  // Move a stop to reduce risk, never to increase it.
  'a6ljm1xyu9': '移動止蝕只可以減少風險，永遠不可以增加風險。',
  // Break-even stops
  'n3m1v2ma3r': '保本止蝕',
  // Moving the stop to entry once a trade is well in profit stops it losing, but doing it too early gets you shaken out of good trades.
  '1od7r25j1h8': '交易大幅獲利後把止蝕移到入場價，可以令它不再虧損，但太早這樣做會令你在好交易中被震出場。',
  // Risk/reward ratio
  '9ybkifk0p2': '風險回報比',
  // Compare what you could make with what you could lose before every trade.
  '1c68slritka': '每宗交易之前，比較你可能賺多少和可能輸多少。',
  // The **risk/reward ratio** compares the distance to the target with the distance to the stop. Risking $1 to make $2 is 1:2, or **2R**, where **R** is the amount risked.
  '1p2eplklo8k': '**風險回報比**比較到目標的距離和到止蝕的距離。冒 $1 風險賺 $2 是 1:2，即 **2R**，**R** 是承受的風險金額。',
  // Reward-to-risk = |target - entry| / |entry - stop|
  '13jsodjm827': '回報風險比 = |目標 - 入場| / |入場 - 止蝕|',
  // Entry 100, stop 95, target 115: reward 15, risk 5, so 3R (or 1:3).
  '18btynt7o7z': '入場 100、止蝕 95、目標 115：回報 15，風險 5，所以是 3R（或 1:3）。',
  // A planned trade. The distance down to the stop is the risk; the distance up to the target is the reward.
  '1dpdf20rm5c': '一宗計劃好的交易。向下到止蝕的距離是風險；向上到目標的距離是回報。',
  // Entry 102
  '11t8q1psjhp': '入場 102',
  // Stop 99: risk of 3
  '24kyjdgy7nh': '止蝕 99：風險 3',
  // Target 111: reward of 9, or 3R
  'bfogwb372b': '目標 111：回報 9，即 3R',
  // Enter
  '2bguige90oi': '入場',
  // The ratio sets how often you must be right: at 1:1 more than half the time, at 1:2 a third, at 1:3 a quarter.
  '47qm2apwh': '這個比率決定你需要對多少次：1:1 要對一半以上，1:2 要三分之一，1:3 要四分之一。',
  // Break-even win rate = 1 / (1 + reward-to-risk)
  '2cn437n2nx0': '損益平衡勝率 = 1 /（1 + 回報風險比）',
  // 1:1 needs 50%.  1:2 needs 33.3%.  1:3 needs 25%.  Fees push all of these slightly higher.
  '1nha6vr7knn': '1:1 需要 50%。1:2 需要 33.3%。1:3 需要 25%。手續費會令這些數字全部略為提高。',
  // Ten trades at 1:2, winning only four
  '1wg5tithq3k': '以 1:2 做十宗交易，只贏四宗',
  // Risk $100 per trade, target $200.
  'bikkiv606c': '每宗交易承受 $100 風險，目標 $200。',
  // Four winners: 4 x $200 = +$800.
  '2di0a2rm2js': '四宗勝利：4 x $200 = +$800。',
  // Six losers: 6 x $100 = -$600.
  '1pmvai7cm8o': '六宗虧損：6 x $100 = -$600。',
  // Net: +$200, despite losing more often than winning.
  '15fxvd36xg5': '淨結果：+$200，雖然輸的次數比贏的多。',
  // Before a trade: find the stop from the chart, find a realistic target such as the next resistance, and skip anything under about 1:2.
  'x8isnjb4yl': '交易前：按圖表找止蝕，找一個實際的目標（例如下一個阻力位），低於約 1:2 的就跳過。',
  // The target must be realistic
  'pmefcd7gl3': '目標必須實際',
  // Any trade shows 1:5 if the target is somewhere price will rarely reach. Put it where the chart gives a reason.
  '1sywthlzoiw': '只要把目標放在價格很少到達的地方，任何交易都可以顯示 1:5。把目標放在圖表有理由的位置。',
  // Read it with the win rate
  '29uo4qyp36z': '與勝率一起看',
  // A 1:5 setup that works one time in ten loses money; a 1:1 that works seven in ten is excellent.
  '1mj31elblkr': '十次只成功一次的 1:5 形態會虧錢；十次成功七次的 1:1 形態則非常好。',
  // Win rate vs expectancy
  'lcutedrmed': '勝率與期望值',
  // A high win rate does not mean you are profitable. Expectancy is the number that does.
  '1wf3vzwlx9v': '高勝率不代表你有利可圖。期望值才是關鍵數字。',
  // The **win rate** is the share of trades that make money. It feels good, but a strategy can win 90% of the time and lose money. **Expectancy**, the average result per trade, is what counts.
  '1u8fr7z0zf6': '**勝率**是賺錢交易所佔的比例。贏的感覺很好，但一個策略可以九成時間贏而仍然虧錢。重要的是**期望值**，即每宗交易的平均結果。',
  // Expectancy = (win rate x average win) - (loss rate x average loss)
  'trdwgcvb4u': '期望值 =（勝率 x 平均盈利）-（敗率 x 平均虧損）',
  // Positive means the strategy makes money over time. Negative means it loses, however good it feels.
  '1xphp9mkq37': '正數代表策略長遠會賺錢。負數代表它會虧錢，不論感覺有多好。',
  // Strategy A: wins often, loses big
  'g1us0509kp': '策略 A：經常贏，輸就輸大',
  // Wins 80% of the time, average win $50. Loses 20%, average loss $300.
  'n0ea4t2mrk': '80% 的時間贏，平均盈利 $50。20% 的時間輸，平均虧損 $300。',
  // Expectancy = 0.80 x 50 - 0.20 x 300 = 40 - 60 = -$20 per trade.
  '2bckmcnkdk4': '期望值 = 0.80 x 50 - 0.20 x 300 = 40 - 60 = 每宗交易 -$20。',
  // Feels great most days. Loses $2,000 over 100 trades.
  '1zenlwaw2qq': '大部分日子感覺很好。100 宗交易後輸掉 $2,000。',
  // Strategy B: wins rarely, wins big
  '1g7n6xxsuek': '策略 B：很少贏，贏就贏大',
  // Wins 35% of the time, average win $300. Loses 65%, average loss $100.
  '1hzuca75xcl': '35% 的時間贏，平均盈利 $300。65% 的時間輸，平均虧損 $100。',
  // Expectancy = 0.35 x 300 - 0.65 x 100 = 105 - 65 = +$40 per trade.
  'atjlhk0f62': '期望值 = 0.35 x 300 - 0.65 x 100 = 105 - 65 = 每宗交易 +$40。',
  // Loses most days. Makes $4,000 over 100 trades.
  '6a43ufquad': '大部分日子都在輸。100 宗交易後賺 $4,000。',
  // In **R**: losses of 1R and winners of 2R at a 40% win rate give 0.4 x 2 - 0.6 x 1 = +0.2R per trade.
  '648cu19tqw': '以 **R** 計：虧損 1R、勝利 2R、勝率 40%，得出 0.4 x 2 - 0.6 x 1 = 每宗交易 +0.2R。',
  // +0.2R
  '29mi1cqb9n3': '+0.2R',
  // An average only appears over many trades. A +0.2R strategy can easily lose eight in a row, so judge it on at least 30 trades, ideally 100. Draw a few runs with the same odds:
  'e53x8zkpu': '平均值只會在很多宗交易後出現。+0.2R 的策略很容易連輸八次，所以至少要看 30 宗交易，最好 100 宗。用同樣的機率畫幾次：',
  // A losing streak does not prove a strategy broken, and a winning one does not prove it works. A **journal** gives you your real numbers.
  'p95p8tmg1y': '連輸不能證明策略失效，連贏也不能證明它有效。**交易日誌**給你真實的數字。',
  // The Analytics page works out your win rate, average win and loss, expectancy and average R from your paper trades, and the Backtester reports the same for a rule set on historical data.
  'j2bvazqa4f': '績效分析頁會根據你的模擬交易計算勝率、平均盈虧、期望值和平均 R，回測器也會為一套規則在歷史數據上報告同樣的數字。',
  // Losing streaks are normal
  '1wamdqkyia0': '連續虧損是正常的',
  // At a 40% win rate, six losses in a row turn up about once every twenty-odd trades. With small risk per trade it costs 6% and you carry on.
  'je6bx25oap': '勝率 40% 時，大約每二十多宗交易就會出現一次六連輸。每宗風險小的話，只損失 6%，你可以繼續。',
  // Drawdown
  '1dq61tgrxpu': '回撤',
  // The fall from a peak in your account. The deeper it goes, the harder it is to climb out.
  '1vokb9h34ud': '帳戶由高峰的回落。回落得愈深，就愈難爬回來。',
  // A **drawdown** is the fall from the highest point of your account to a later low. Up to $12,000 then down to $9,600 is a 20% drawdown, even though you are only 4% below a $10,000 start. **Maximum drawdown**, the largest one, is the most honest measure of how painful a strategy is.
  'mflvw3lw2z': '**回撤**是帳戶由最高點跌到之後低點的幅度。升到 $12,000 再跌到 $9,600 是 20% 回撤，即使你只比 $10,000 本金低 4%。**最大回撤**，即最大的一次，最能誠實反映一個策略有多難捱。',
  // After a loss you have less money, so you need a bigger gain to get back:
  'n8430nkzrv': '虧損後你的資金變少，所以需要更大的升幅才能回本：',
  // Gain needed to recover = loss / (1 - loss)
  '29pgylskh4m': '回本所需收益 = 虧損 /（1 - 虧損）',
  // Lose 10%, need 11%.  Lose 20%, need 25%.  Lose 50%, need 100%.  Lose 90%, need 900%.
  '1xi6qrg6by1': '虧 10%，需要 11%。虧 20%，需要 25%。虧 50%，需要 100%。虧 90%，需要 900%。',
  // Think of this as an account balance rather than a price. The fall from the peak of 120 to the low of 96 is a 20% drawdown, and it takes a 25% gain from there to get back.
  '154x4bnpp4p': '把這看作帳戶結餘而不是價格。由 120 的高峰跌到 96 的低點是 20% 的回撤，從那裡要賺 25% 才能回本。',
  // Peak: 120
  '26z1v5e2g0y': '高峰：120',
  // Peak
  '1jjt59f8e2z': '高峰',
  // Trough: 96, a 20% drawdown
  '1fwx6liptrz': '谷底：96，即 20% 回撤',
  // Trough
  'e06b5o8t20': '谷底',
  // At 1% risk, ten losses in a row is about a 10% drawdown, back with an 11% gain.
  'wj00bfmxo7': '每宗 1% 風險，連輸十次約回撤 10%，賺 11% 即可回本。',
  // At 5% risk, about 40%: you need 67%.
  '13d931z0d8y': '每宗 5% 風險，約 40%：需要 67%。',
  // At 10% risk, about 65%: you need 186%.
  '268a5qu456h': '每宗 10% 風險，約 65%：需要 186%。',
  // **Set limits in advance**: halve size after a 10% drawdown, stop and review after 20%.
  'wyy7ya4vun': '**預先設定上限**：回撤 10% 後把規模減半，20% 後停止並檢討。',
  // **Daily loss limit**: stop for the day after losing, say, 3%.
  '1i595dkzd2v': '**每日虧損上限**：輸了例如 3% 就停止當日交易。',
  // **Never size up to win it back.** That turns 15% into 50%.
  '11qk2hymy5q': '**永遠不要為了贏回來而加大規模。**這會把 15% 變成 50%。',
  // Leverage makes drawdowns faster
  '1jyqpir68x0': '槓桿令回撤來得更快',
  // Leverage multiplies every loss, and a liquidation loses the whole margin on that trade in one step.
  '1y0s6089is8': '槓桿放大每一次虧損，而強制平倉一步就輸掉該交易的全部保證金。',
  // The one thing to remember
  '1wt1st5lxzg': '要記住的一件事',
  // Size every trade from the stop, risk a small fixed share of the account, and never move a stop to make a loss bigger.
  '51l1f15apo': '按止蝕決定每宗交易的規模，只拿帳戶的一小部分固定比例冒險，永遠不要為了令虧損更大而移動止蝕。',
  // Under the 1% rule, "risk" means:
  '1nflzimdxb7': '在 1% 規則下，「風險」指：',
  // The size of the position
  '23w43a3nmd5': '持倉的大小',
  // The amount you lose if your stop-loss is hit
  '28t63lxqpik': '觸及止蝕時你會輸掉的金額',
  // The fee on the trade
  '238oo3o54jo': '交易的手續費',
  // Your total account
  '25snk1p41x9': '你的整個帳戶',
  // Risk is the loss at the stop, not the value of the position.
  '1xx74s1068f': '風險是觸及止蝕時的虧損，而不是持倉的價值。',
  // Account $20,000, risking 1%. Entry $40, stop $38. How many shares?
  '22yxa7bu5gk': '帳戶 $20,000，承受 1% 風險。入場 $40，止蝕 $38。可以買多少股？',
  // Risk is $200. Risk per share is $2. 200 / 2 = 100 shares.
  '1xgb1fulaib': '風險是 $200。每股風險是 $2。200 / 2 = 100 股。',
  // You widen your stop from $2 to $4 away but keep the same dollar risk. Your position must be:
  '1ntyg1o6lac': '你把止蝕距離由 $2 放闊到 $4，但保持相同的金額風險。你的持倉必須：',
  // Twice as large
  '1kuzanwa8lb': '大一倍',
  // The same
  'w70htjf19w': '不變',
  // Half as large
  '2gc5f1xw7s0': '減半',
  // Closed
  'of37issh9': '平倉',
  // Size = dollars at risk / stop distance. Doubling the distance halves the size.
  '1e2l0vnafy4': '規模 = 承受風險的金額 / 止蝕距離。距離加倍，規模就減半。',
  // Which trade risks more?
  '50e47fttk9': '哪一宗交易承受的風險較大？',
  // A $1,000 position with no stop at all
  '14yhqfdyeuo': '一個 $1,000、完全沒有止蝕的持倉',
  // They risk the same
  '17n8f33u6h0': '兩者風險相同',
  // Neither has risk
  '179n0q12hqy': '兩者都沒有風險',
  // The first risks $50. The second can lose the full $1,000. Position size is not risk.
  '111rm0a5qr3': '第一個承受 $50 風險。第二個可以輸掉全部 $1,000。持倉規模不等於風險。',
  // Why does risking 1% per trade matter?
  '1tvmm0pounx': '為甚麼每宗交易承受 1% 風險很重要？',
  // It guarantees profit
  '1ucj0q1x3tn': '它保證有盈利',
  // A long losing streak then costs a manageable share of the account
  'ha3noe7bx5': '長時間的連敗只會損失帳戶中可以承受的一部分',
  // It lowers fees
  'ju1jkt1rwc': '它降低手續費',
  // It makes stops unnecessary
  'r1kfpmgdj3': '它令止蝕變得不必要',
  // Ten losses in a row cost roughly 10%, which you can recover from.
  '24gtxx7i282': '連輸十次大約損失 10%，你可以從中恢復。',
  // Where should a stop-loss go?
  '21mis57d8rn': '止蝕應該放在哪裡？',
  // Where the loss feels comfortable
  '1nmqj5ek873': '虧損感覺舒服的地方',
  // Where the chart shows your reason for the trade is no longer true
  'nwr3qy9biq': '圖表顯示你做這宗交易的理由不再成立的地方',
  // Exactly 1% from entry, always
  '21pbth9p1r9': '永遠剛好離入場價 1%',
  // At the nearest round number
  '23c4uex0dtb': '最近的整數',
  // The stop marks the point where the idea has failed. Size the position to fit it.
  '19b55m6v9o3': '止蝕標示想法失效的位置。按它來決定持倉規模。',
  // ATR is 4. Which stop is most likely to be hit by ordinary noise?
  '2f9zcezkr6q': 'ATR 是 4。哪一個止蝕最有可能被普通雜訊觸發？',
  // 1 point away
  '1rxithpjk8g': '距離 1 點',
  // 6 points away
  '1occu50w1f1': '距離 6 點',
  // 10 points away
  'g6huj71ltl': '距離 10 點',
  // 12 points away
  'i7qt8n6g7t': '距離 12 點',
  // A stop well inside one ATR sits within the normal movement of a single candle.
  's29lhj65by': '遠小於一個 ATR 的止蝕，位於單一支陰陽燭的正常波動範圍內。',
  // Price is nearing your stop and you move the stop further away "to give it room". This:
  '5buoxsuw13': '價格逼近你的止蝕，你「為了給它空間」把止蝕移遠。這：',
  // Is good risk management
  'oa0qcv1qc6': '是良好的風險管理',
  // Turns a planned small loss into an unplanned larger one
  '20qkx56hn8h': '把計劃中的小虧損變成計劃外的大虧損',
  // Lowers your risk
  '28wkvkxvu20': '降低了你的風險',
  // Is how trailing stops work
  '54rk9ilvdp': '就是移動止蝕的運作方式',
  // You may move a stop to reduce risk, never to increase it.
  '2ewyncjq6bo': '你可以為了降低風險而移動止蝕，但永遠不能為了增加風險而移動。',
  // What does a trailing stop do?
  '4nqbuqfxzr': '移動止蝕有甚麼作用？',
  // Moves against you as price falls
  '13i9ansb5ck': '在價格下跌時向不利方向移動',
  // Follows price in your favour to lock in profit, never moving back
  '12aw07oiuqv': '跟隨價格向有利方向移動以鎖定盈利，永不後退',
  // Removes the need for a target
  '13slufiq4zj': '不再需要目標',
  // Widens automatically
  '1mrf7e2257x': '自動放闊',
  // It ratchets in one direction only, protecting gains as the trade works.
  '1xok8o1q2ib': '它只向一個方向收緊，在交易奏效時保護盈利。',
  // You choose the stop first, then find the position is too big for your risk. You should:
  '1kxzj4v674s': '你先選好止蝕，然後發現持倉相對你的風險太大。你應該：',
  // Move the stop closer
  'r27fp1wezp': '把止蝕移近',
  // Reduce the position size
  '1lkb1jgbufk': '減少持倉規模',
  // Skip the stop
  '1xqy9b9fx86': '不設止蝕',
  // Add leverage
  '13l2pn1c41i': '加槓桿',
  // The stop comes from the chart. The size is what you adjust.
  '1k3dtb435yi': '止蝕來自圖表。你要調整的是規模。',
  // Entry 50, stop 48, target 56. What is the reward-to-risk?
  'duiuzaarc7': '入場 50、止蝕 48、目標 56。回報風險比是多少？',
  // Risk is 2, reward is 6. 6 / 2 = 3, so 1:3 (or 3R).
  '1l8t4iqotfr': '風險是 2，回報是 6。6 / 2 = 3，所以是 1:3（或 3R）。',
  // At a risk/reward of 1:2, what win rate breaks even (ignoring fees)?
  '1iz9yk172oe': '風險回報比為 1:2 時，多少勝率可以打和（不計手續費）？',
  // 1 / (1 + 2) = 33.3%. Win one in three and you break even.
  '1hxhb6yrhk5': '1 /（1 + 2）= 33.3%。三次贏一次就能打和。',
  // You win 4 of 10 trades at 1:2, risking $100 each. Net result?
  '18yu2n3umc5': '以 1:2 做 10 宗交易贏了 4 宗，每宗承受 $100 風險。淨結果是？',
  // 4 x $200 = +$800, 6 x $100 = -$600. Net +$200.
  '1acziug9pqm': '4 x $200 = +$800，6 x $100 = -$600。淨 +$200。',
  // A setup shows 1:6 only because the target is far beyond any resistance. That ratio is:
  '1vdrgawyohs': '一個形態顯示 1:6，只因為目標遠遠超出任何阻力位。這個比率：',
  // Excellent
  '8b54st44dz': '非常好',
  // Misleading: the target is unlikely to be reached
  'v5oz3dxfan': '具誤導性：目標不太可能到達',
  // Guaranteed
  'l7fzmr6fan': '有保證',
  // Required
  '1gn0cv8a5d9': '是必須的',
  // A reward that rarely arrives is worth little. Targets need a reason on the chart.
  'izukbspbvf': '很少兌現的回報價值不大。目標需要在圖表上有理由。',
  // A strategy wins 80% of trades. Is it profitable?
  'iouiemr5ka': '一個策略贏 80% 的交易。它有利可圖嗎？',
  // Yes, always
  '1886n6m9hon': '是，一定',
  // Not necessarily: it depends on the size of the wins and losses
  '1hs5k0urjrs': '不一定：要看盈利和虧損的大小',
  // No, never
  'sglywwma4': '不，永遠不會',
  // Only with leverage
  '1erfqk93m8c': '只有用槓桿才會',
  // If the 20% of losers are much bigger than the winners, it loses money.
  'e6z79v232i': '如果那 20% 的虧損遠大於盈利，它就會虧錢。',
  // Win rate 50%, average win $200, average loss $100. Expectancy per trade?
  '1a07fff3h8p': '勝率 50%，平均盈利 $200，平均虧損 $100。每宗交易的期望值是？',
  // 0.5 x 200 - 0.5 x 100 = 100 - 50 = +$50.
  'yq8rtgmc2s': '0.5 x 200 - 0.5 x 100 = 100 - 50 = +$50。',
  // Win rate 30%, average win 3R, average loss 1R. Expectancy in R?
  '1m4utclcaac': '勝率 30%，平均盈利 3R，平均虧損 1R。以 R 計的期望值是？',
  // -0.2R
  'g7qqd8dsfr': '-0.2R',
  // 0R
  'p1kqyn6dy1': '0R',
  // +0.9R
  '21huzffkrsq': '+0.9R',
  // 0.3 x 3 - 0.7 x 1 = 0.9 - 0.7 = +0.2R per trade.
  '22x1zkkbtvz': '0.3 x 3 - 0.7 x 1 = 0.9 - 0.7 = 每宗交易 +0.2R。',
  // A strategy with positive expectancy loses six trades in a row. This means:
  '24qkvky4jwl': '一個期望值為正的策略連輸六宗交易。這代表：',
  // The strategy is broken
  '2bkhojlxfvn': '策略失效了',
  // Nothing by itself: streaks like this are expected
  '3c42pafz4j': '本身不代表甚麼：這樣的連敗是預期之內的',
  // You should double your size
  'wqk5od9ikg': '你應該把規模加倍',
  // The market is rigged
  '1csi70s389x': '市場被操控了',
  // Expectancy is an average over many trades. Short runs tell you very little.
  'rg946ept9k': '期望值是多宗交易的平均。短時間的結果說明不了甚麼。',
  // Why keep a trading journal?
  '2d8uyhfyefh': '為甚麼要寫交易日誌？',
  // It is required by law
  '1n949g45wm': '法律要求',
  // To calculate your real win rate, average win and loss, and expectancy
  '29bhcvcrhg3': '為了計算你真實的勝率、平均盈虧和期望值',
  // To impress other traders
  '1bmvaxtfy6v': '為了令其他交易者佩服',
  // To avoid fees
  '1zb0h374dxy': '為了避免手續費',
  // Without records you are judging your trading by feeling, which is unreliable.
  '2f3w75pmwnk': '沒有紀錄，你就是憑感覺評價自己的交易，而感覺並不可靠。',
  // Your account peaks at $15,000 and falls to $12,000. The drawdown is:
  'r2760e6f8n': '你的帳戶高峰為 $15,000，之後跌到 $12,000。回撤是：',
  // 3,000 / 15,000 = 20%. Drawdown is measured from the peak, not from where you started.
  'uvq1imkvws': '3,000 / 15,000 = 20%。回撤是從高峰量度的，而不是從你開始的地方。',
  // After a 50% loss, what gain gets you back to even?
  '18pin4iubmv': '虧損 50% 後，要賺多少才能回本？',
  // Half of the money has to double to return to the start: 0.5 / (1 - 0.5) = 100%.
  '1isuc97rcac': '剩下的一半資金要翻倍才能回到起點：0.5 /（1 - 0.5）= 100%。',
  // Why do large drawdowns matter more than they first appear?
  'bkrf0ttsb8': '為甚麼大幅回撤比初看起來更重要？',
  // They attract fees
  '2w7c6pqobl': '它們會產生手續費',
  // The gain needed to recover grows much faster than the loss
  'x5lsqm4qr1': '回本所需的收益比虧損增長得快得多',
  // They change the win rate
  '1v4pjpgwec9': '它們會改變勝率',
  // They do not matter
  '1w5nh56p2s7': '它們不重要',
  // Lose 20%, need 25%. Lose 50%, need 100%. Lose 90%, need 900%.
  '1o52kdyv57u': '虧 20%，需要 25%。虧 50%，需要 100%。虧 90%，需要 900%。',
  // What is the main defence against deep drawdowns?
  '147m3svdvg6': '防止深度回撤的主要方法是甚麼？',
  // A higher win rate
  '931987aq2n': '更高的勝率',
  // Risking a small, fixed share of the account per trade
  '1i0z40pwd9w': '每宗交易只承受帳戶一個細小而固定的比例風險',
  // More leverage
  '1p8mct0pojb': '更多槓桿',
  // Trading more often
  '1rlnsbe78y5': '更頻密地交易',
  // Every strategy has losing streaks. Position sizing decides how much they cost.
  '2fzgkwrfe72': '每個策略都有連敗。持倉規模決定它們的代價有多大。',
  // You are down 15% and tempted to double your size to win it back. This is:
  '186i6h5wgay': '你虧了 15%，很想把規模加倍贏回來。這是：',
  // Sound recovery practice
  '2bo6jngsel4': '合理的回本做法',
  // How a 15% drawdown becomes 50%
  '1mipnrkdnj4': '15% 回撤變成 50% 的方式',
  // Required by the 1% rule
  '53npvddoky': '1% 規則的要求',
  // Mean reversion
  '207t666j5oa': '均值回歸',
  // Increasing size after losses raises the stakes exactly when you are trading worst.
  '28rti3941yl': '虧損後加大規模，正好在你交易得最差的時候提高了注碼。',
} satisfies Record<string, string>;

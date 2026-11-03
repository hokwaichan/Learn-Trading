// Traditional Chinese for content/lessons/08-futures.ts and content/quizzes/08-futures.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Futures
  '1onvln2444z': '期貨',
  // Contracts that let you trade with leverage, long or short. Powerful, and the fastest way to lose an account.
  '5oq6d2zq6l': '讓你用槓桿做多或做空的合約。威力強大，也是最快輸光帳戶的方式。',
  // What a futures contract is
  'ro2z8xujrk': '期貨合約是甚麼',
  // An agreement to trade something later at a price fixed today, and the contract details you need to read first.
  '1e481aqmcnr': '一份以今日定下的價格、在日後交易某樣東西的協議，以及你需要先看清楚的合約細節。',
  // A **futures contract** is an agreement to buy or sell something at a set price on a set future date. A farmer and a baker can fix the price of wheat today for delivery in six months.
  'j9br90eyh7': '**期貨合約**是在設定的未來日期以設定價格買入或賣出某樣東西的協議。農夫和麵包師傅可以今天就定下六個月後交收的小麥價格。',
  // Glowing price boards and screens inside the Chicago Mercantile Exchange
  '9og7etro5j': '芝加哥商品交易所內發光的報價板和屏幕',
  // The Chicago Mercantile Exchange, home of many of the biggest futures contracts in the world.
  'dvrk8zo4a3': '芝加哥商品交易所，全球很多最大期貨合約的所在地。',
  // Futures are **derivatives**: their value comes from an **underlying** such as wheat, oil, an index or Bitcoin. Most traders never touch the underlying; they trade the contract and close it before it ends.
  '28j3cbx12i0': '期貨是**衍生工具**：它們的價值來自**相關資產**，例如小麥、石油、指數或比特幣。大部分交易者從不接觸相關資產；他們買賣合約，並在到期前平倉。',
  // **Multiplier**: how much one contract controls. One E-mini S&P 500 contract is 50 times the index.
  '9uu5teh5x': '**合約乘數**：一張合約控制多少相關資產。一張 E-mini 標普 500 合約是指數的 50 倍。',
  // **Tick size and value**: the smallest step, 0.25 points on the E-mini, worth 0.25 x 50 = $12.50.
  '125uy8ggmy7': '**最小價格變動和每跳價值**：最小的一步，E-mini 是 0.25 點，值 0.25 x 50 = $12.50。',
  // **Expiry and settlement**: when it ends, and whether the underlying is delivered or the difference paid in cash. Most financial futures are **cash-settled**.
  '21jor2api4m': '**到期日和結算方式**：何時結束，以及交收相關資產還是以現金支付差額。大部分金融期貨是**現金結算**。',
  // Profit or loss = (exit price - entry price) x multiplier x contracts
  '1oyybfk6j2z': '盈虧 =（出場價 - 入場價）x 合約乘數 x 合約數',
  // Reverse the sign for a short. Equivalently: number of ticks moved x tick value x contracts.
  'j1f2xiwqx': '做空則正負號相反。亦即：變動的跳數 x 每跳價值 x 合約數。',
  // One E-mini contract
  'g45l7fxbtt': '一張 E-mini 合約',
  // You buy 1 contract at 5,000.00. Multiplier 50, so you control $250,000 of index.
  '1tli9i24ii8': '你在 5,000.00 買入 1 張合約。合約乘數 50，所以你控制 $250,000 的指數。',
  // Price rises to 5,010.00: 10 points, or 40 ticks.
  '25iyjgynvfd': '價格升到 5,010.00：10 點，即 40 跳。',
  // Profit: 10 x 50 = $500 (40 ticks x $12.50).
  'pwiemb5m7b': '盈利：10 x 50 = $500（40 跳 x $12.50）。',
  // A 10-point fall would lose $500 just as quickly.
  '23ow34brzp8': '下跌 10 點也會同樣快地輸掉 $500。',
  // A long trade in a futures contract. Each point the price moves is worth the multiplier in dollars, per contract.
  'f30pilcg2c': '一張期貨合約的多倉交易。價格每變動一點，每張合約就值合約乘數那麼多錢。',
  // Buy 1 contract at 5,000
  'x6rd2ew9nk': '在 5,000 買入 1 張合約',
  // Sell at 5,010: 10 points x 50 = +$500
  'vrb5hv7s8w': '在 5,010 賣出：10 點 x 50 = +$500',
  // Enter
  '2bguige90oi': '入場',
  // Exit
  '17cc35ut54e': '出場',
  // Traditional futures are **dated**: to stay in past expiry you close one contract and open the next, called **rolling**. Crypto **perpetual futures** never expire and use funding instead. The Futures page simulates perpetuals.
  '1ifky115u8a': '傳統期貨有**到期日**：要在到期後繼續持有，就平掉一張合約再開下一張，叫做**轉倉**。加密貨幣**永續合約**沒有到期日，改用資金費用。期貨頁模擬的是永續合約。',
  // Leverage is built in
  '1p0burncbr2': '槓桿是內置的',
  // That $250,000 E-mini position needs a deposit of perhaps $12,000 to $15,000. A 1% index move is $2,500.
  '1pzl2on05x0': '那個 $250,000 的 E-mini 持倉只需約 $12,000 至 $15,000 按金。指數變動 1% 就是 $2,500。',
  // Margin, mark price and liquidation
  'rngs0jzuk4': '保證金、標記價格和強制平倉',
  // The deposit you put up, how the exchange measures your losses against it, and when it closes you out.
  '10q1cpixb9a': '你存入的按金、交易所如何以它衡量你的虧損，以及它何時替你平倉。',
  // You do not pay the full value of a futures position. You put up **margin**, and position value divided by margin is the **leverage**.
  '2fsg8t7v8xr': '期貨持倉不用付全數。你付出**保證金**，持倉價值除以保證金就是**槓桿**。',
  // **Initial margin** opens the position: 10% of its value at 10x.
  '2d7n3mjw29n': '**初始保證金**用來開倉：10 倍槓桿時是持倉價值的 10%。',
  // **Maintenance margin** is the minimum to keep it open, often 0.4% to 1% on crypto perpetuals.
  '25dy1vf3a38': '**維持保證金**是保持持倉所需的最低金額，加密貨幣永續合約通常是 0.4% 至 1%。',
  // Losses come out of your margin. When what is left reaches the maintenance margin, the exchange closes you out: **liquidation**.
  '1029pf54tjy': '虧損從保證金扣除。剩餘的降到維持保證金時，交易所會替你平倉：**強制平倉**。',
  // Initial margin = position value / leverage Liquidation (long) is roughly: entry x (1 - 1 / leverage + maintenance rate) Liquidation (short) is roughly: entry x (1 + 1 / leverage - maintenance rate)
  'g36kow8ztm': '初始保證金 = 持倉價值 / 槓桿\n強平價（做多）大約為：入場價 x（1 - 1 / 槓桿 + 維持保證金率）\n強平價（做空）大約為：入場價 x（1 + 1 / 槓桿 - 維持保證金率）',
  // Liquidation
  '1oz08kgjh27': '強制平倉',
  // Long at 100 with 10x and 0.5% maintenance: about 100 x (1 - 0.10 + 0.005) = 90.50.
  '22dp81xirke': '以 10 倍槓桿、0.5% 維持保證金在 100 做多：約 100 x（1 - 0.10 + 0.005）= 90.50。',
  // A long that gets liquidated
  'lr1g70elwh': '一個被強制平倉的多倉',
  // You open a $10,000 long on BTC at 10x. Initial margin: $1,000. Maintenance margin at 0.5%: $50.
  '1y9gmeos6ok': '你以 10 倍槓桿開立 $10,000 的比特幣多倉。初始保證金：$1,000。0.5% 的維持保證金：$50。',
  // Price falls 5%. Loss: $500. Margin left: $500. Still open.
  '1saexa1d13b': '價格下跌 5%。虧損：$500。剩餘保證金：$500。仍然持倉。',
  // Price falls 9.5%. Loss: $950. Margin left: $50, which equals the maintenance margin.
  '22tsyfybsqb': '價格下跌 9.5%。虧損：$950。剩餘保證金：$50，等於維持保證金。',
  // The exchange liquidates. You lose essentially the whole $1,000, plus a liquidation fee.
  '1gozrr5h2nr': '交易所強制平倉。你基本上輸掉全部 $1,000，另加強平費用。',
  // Liquidation uses the **mark price**, a smoothed fair value from several exchanges, so one odd trade cannot wipe you out.
  '3yse1d98al': '強制平倉以**標記價格**計算，即由多個交易所得出的平滑公平價，所以一宗異常成交不會令你爆倉。',
  // **Isolated margin**: each position has its own margin; the most you can lose is what you assigned.
  '2c1s0vu8lm1': '**逐倉保證金**：每個持倉有自己的保證金；最多只會輸掉分配給它的金額。',
  // **Cross margin**: positions share the whole balance, so one loser can take everything.
  '19ihmpn4e2j': '**全倉保證金**：所有持倉共用整個帳戶結餘，所以一個虧損持倉可以拿走一切。',
  // Cross margin can empty the account
  'it9f93bnuq': '全倉保證金可以令帳戶清零',
  // As a beginner use isolated margin, so the worst case on every trade is known.
  's3igoanvvr': '新手應使用逐倉保證金，這樣每宗交易的最壞情況都是已知的。',
  // The stop goes before the liquidation price
  '15qmgizfw8m': '止蝕要放在強平價之前',
  // If the stop you want is beyond the liquidation price, your leverage is too high.
  '12aaahlrz7f': '如果你想要的止蝕在強制平倉價之外，你的槓桿就太高了。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The futures simulator shows margin used, free margin and the liquidation price before you confirm, draws the liquidation price on the chart, and warns you above 5x leverage.
  '10tzw2a8d4z': '期貨模擬器在你確認前顯示已用保證金、可用保證金和強平價，在圖表上畫出強平價，並在槓桿超過 5 倍時警告你。',
  // 5x leverage
  'cofkbn47na': '5 倍槓桿',
  // Funding, basis, contango and backwardation
  '2bt9t18qc7a': '資金費用、基差、升水和貼水',
  // Why a futures price differs from the spot price, and the recurring payment that keeps perpetuals in line.
  '1yajg9ykqph': '期貨價格為甚麼與現貨價格不同，以及令永續合約保持一致的定期支付。',
  // The price for immediate delivery is the **spot price**. The gap between a futures price and spot is the **basis**.
  'g86u446wn8': '即時交收的價格是**現貨價**。期貨價格與現貨價之間的差距是**基差**。',
  // Basis = futures price - spot price
  '1d89bucekav': '基差 = 期貨價 - 現貨價',
  // Positive when futures are above spot, negative when below.
  'kkoaz5hqc4': '期貨高於現貨時為正，低於時為負。',
  // Chart of futures prices converging to the expected spot price by maturity: one line falling from above in contango, one rising from below in backwardation
  '1qub7z7qcve': '期貨價格在到期時收斂到預期現貨價的圖表：期貨升水的線從上方下跌，期貨貼水的線從下方上升',
  // In contango futures trade above the expected spot price; in backwardation, below. Both meet it at maturity.
  'a2gdqj6h3i': '期貨升水時期貨價格高於預期現貨價；期貨貼水時低於。兩者都在到期時與它相遇。',
  // **Contango**: futures **above** spot, normal when holding the real thing costs storage or interest.
  '22406q5bphl': '**期貨升水**：期貨**高於**現貨，當持有實物需要倉儲或利息成本時是正常的。',
  // Contango
  '1uc8lndr3a8': '期貨升水',
  // **Backwardation**: futures **below** spot, as in a shortage or when prices are expected to fall.
  '1n8278abwod': '**期貨貼水**：期貨**低於**現貨，例如出現短缺或預期價格下跌時。',
  // Backwardation
  '15h9ytyhum1': '期貨貼水',
  // **Convergence**: at expiry the contract settles at spot, so the basis shrinks to zero.
  '5fmi5zc2i8': '**收斂**：到期時合約以現貨價結算，所以基差縮小至零。',
  // Convergence
  '1lb867pth8c': '收斂',
  // The basis of a dated future in contango, shrinking as expiry approaches. At expiry the futures price equals the spot price.
  '3xgw32e7vh': '處於升水的定期期貨的基差，隨到期日接近而收縮。到期時期貨價等於現貨價。',
  // Expiry: futures price = spot price
  '1jfd4yb8lr2': '到期：期貨價 = 現貨價',
  // Futures 4.20 above spot
  '1s17lmjs3w3': '期貨比現貨高 4.20',
  // Rolling a contract in contango buys the dearer next month each time. This **roll cost** is why long-term futures funds drift below spot.
  '1ew6bfcadiw': '在期貨升水時轉倉，每次都要買較貴的下一個月合約。這個**轉倉成本**解釋了為甚麼長期持有期貨的基金會逐漸落後於現貨。',
  // Funding on perpetuals
  'npjqllnpg': '永續合約的資金費用',
  // Perpetuals never expire, so the **funding rate**, a payment between longs and shorts usually every 8 hours, keeps them near spot. Above spot, **longs pay shorts**; below, **shorts pay longs**.
  'h8ubl7lv6d': '永續合約沒有到期日，所以用**資金費率**（通常每 8 小時在多空雙方之間支付一次）令價格貼近現貨。高於現貨時，**做多一方付給做空一方**；低於時，**做空一方付給做多一方**。',
  // Funding payment = position value x funding rate
  '1lrwrgu4s7i': '資金費用 = 持倉價值 x 資金費率',
  // Paid or received at each interval. A typical rate is around 0.01% per 8 hours, but it can be many times that when the market is one-sided.
  'wby2x91bev': '每個結算時段支付或收取。典型的費率約為每 8 小時 0.01%，但市場一面倒時可以是它的很多倍。',
  // What funding costs
  '7i0sduqup7': '資金費用的成本',
  // You hold a $10,000 long. The funding rate is +0.01% every 8 hours.
  '22v4ceoxz1o': '你持有 $10,000 的多倉。資金費率為每 8 小時 +0.01%。',
  // Each payment: $10,000 x 0.0001 = $1.
  '1eldt5aikxp': '每次支付：$10,000 x 0.0001 = $1。',
  // Three payments a day: $3 a day, or roughly 11% of the position value per year.
  '1k19zxfhvu1': '每天支付三次：每天 $3，即每年約為持倉價值的 11%。',
  // At 10x leverage that $10,000 position is on $1,000 of margin, so funding is about 0.3% of your margin every day.
  '19iepricqs': '以 10 倍槓桿計，這個 $10,000 持倉只用了 $1,000 保證金，所以資金費用每天約為你保證金的 0.3%。',
  // Funding is paid on the position, not the margin
  '23wffqmnfkd': '資金費用按持倉計算，而不是按保證金',
  // In a euphoric rally funding can reach 0.1% per 8 hours: over 100% a year on the position.
  '1zfh8zu5vze': '在狂熱的升市中，資金費率可以達到每 8 小時 0.1%：持倉一年超過 100%。',
  // Funding as a signal
  'ly9twt7n0t': '資金費率作為訊號',
  // Very high funding means crowded leveraged longs, many of whom would be forced to sell on a drop.
  'za7g4d5iuv': '資金費率非常高代表槓桿多倉擁擠，價格一跌，很多人會被迫賣出。',
  // Hedging, speculation and leverage in practice
  'nhpvcdpd4c': '對沖、投機和實際的槓桿',
  // The two reasons to trade futures, and worked examples of leverage cutting both ways.
  '1qclc5y8inl': '交易期貨的兩個理由，以及槓桿雙向影響的示範計算。',
  // To **hedge** is to take a position that offsets a risk you already have. The aim is less uncertainty, not profit.
  'j5sxxwf7wk': '**對沖**是開一個抵銷你已有風險的持倉。目的是減少不確定性，不是賺錢。',
  // Hedging a holding
  'pxhappmaya': '對沖手上的資產',
  // You own 1 BTC, worth $80,000, and do not want to sell it, but you fear a drop over the next month.
  '1nshxcf9eik': '你持有 1 個比特幣，價值 $80,000，你不想賣出，但擔心下個月會下跌。',
  // You open a short perpetual for 1 BTC at $80,000.
  '23cml1esfo8': '你在 $80,000 開立 1 個比特幣的永續合約空倉。',
  // Price falls to $70,000. Your BTC is down $10,000. Your short is up $10,000. Net: zero.
  '1dv9uv1hlfo': '價格跌到 $70,000。你的比特幣虧 $10,000。你的空倉賺 $10,000。淨結果：零。',
  // Price rises to $90,000 instead. Your BTC is up $10,000; your short is down $10,000. Net: zero.
  '2c43dgsz4h': '如果價格反而升到 $90,000。你的比特幣賺 $10,000；你的空倉虧 $10,000。淨結果：零。',
  // You gave up the upside to remove the downside. That is the trade-off of every hedge.
  '1cgqfizlth5': '你放棄了上升空間，換取消除下跌風險。這就是每個對沖的取捨。',
  // Price falls from 80,000 to 70,000. A holder with no hedge loses 10,000 per coin. A holder who also shorted one futures contract gains 10,000 on the short, so the two cancel.
  '785ogzzcm6': '價格由 80,000 跌到 70,000。沒有對沖的持有人每個幣輸 10,000。同時做空一張期貨合約的持有人在空倉上賺 10,000，所以兩者互相抵消。',
  // Hedge opened: short 1 BTC at 80,000
  '16rwew7e6bl': '開立對沖：在 80,000 做空 1 個比特幣',
  // Holding -10,000, short +10,000
  '207y5gfyuct': '持有部分 -10,000，空倉 +10,000',
  // To **speculate** is to trade purely for a price change. Most retail futures trading is speculation, so every bit of leverage is extra risk. The same $1,000 and a 4% move:
  '2fce5ymzg6u': '**投機**是純粹為價格變動而交易。大部分散戶期貨交易都是投機，所以每一點槓桿都是額外風險。同樣 $1,000、同樣 4% 的變動：',
  // No leverage (1x)
  'pyx59hpqy9': '沒有槓桿（1 倍）',
  // Position: $1,000.
  'kz7215q7t0': '持倉：$1,000。',
  // Price +4%: +$40, a 4% return.
  'tes3jzw6lf': '價格 +4%：+$40，即 4% 回報。',
  // Price -4%: -$40, a 4% loss.
  'gp0hi60hu7': '價格 -4%：-$40，即 4% 虧損。',
  // Wipe-out move: a 100% fall.
  '22vvsic89u6': '輸光所需的波動：下跌 100%。',
  // Position: $5,000.
  '1e74qpqtzq1': '持倉：$5,000。',
  // Price +4%: +$200, a 20% return.
  '104nrqyhur4': '價格 +4%：+$200，即 20% 回報。',
  // Price -4%: -$200, a 20% loss.
  '1sb0moulevg': '價格 -4%：-$200，即 20% 虧損。',
  // Wipe-out move: about 20%.
  '1zgnu6jycbu': '輸光所需的波動：約 20%。',
  // 20x leverage
  'iezkvi3fd7': '20 倍槓桿',
  // Position: $20,000.
  '7vwrkjhqfs': '持倉：$20,000。',
  // Price +4%: +$800, an 80% return.
  '2240vr8fdui': '價格 +4%：+$800，即 80% 回報。',
  // Price -4%: -$800, an 80% loss.
  '2989hbhoomd': '價格 -4%：-$800，即 80% 虧損。',
  // Wipe-out move: about 5%. A 4% dip leaves you with $200; one more percent and you are liquidated.
  'u0bfa0cnr': '輸光所需的波動：約 5%。下跌 4% 後你只剩 $200；再跌 1% 就會被強制平倉。',
  // At 20x a 5% fall liquidates you, and a 30% rally afterwards does not help. You can be right on direction and still lose everything.
  'ivsbeduio6': '20 倍槓桿下，下跌 5% 就會被強制平倉，之後升 30% 也無補於事。你可以看對方向，卻仍然輸掉一切。',
  // Choose the stop from the chart.
  '1oyu53a1r3m': '按圖表選止蝕。',
  // Choose the dollar risk, 1% of the account.
  'pj6bdezkuy': '選擇承受風險的金額，即帳戶的 1%。',
  // The position size follows; use only the leverage it needs, often 1x to 3x.
  '1bd7vjkbwfz': '持倉規模隨之而定；只用它需要的槓桿，通常是 1 至 3 倍。',
  // Leverage is a tool for sizing, not for getting rich
  '1ebtglgtcx2': '槓桿是調整規模的工具，不是致富的工具',
  // Use it to take a correctly sized position without tying up the whole account, never to trade bigger than your risk rules allow.
  '2bz8coplxn7': '用它來開一個規模正確的持倉而不佔用整個帳戶，永遠不要用它來做超出風險規則的大交易。',
  // Practise it safely
  '1pqsoo3j9u6': '安全地練習',
  // Try the same trade on the Futures page at 2x and at 20x, with the same entry. Watch how close the liquidation price sits to the current price in each case.
  '1c39ibrxbe1': '在期貨頁以相同的入場價，分別用 2 倍和 20 倍做同一宗交易。看看兩種情況下強平價離現價有多近。',
  // What is a futures contract?
  '2623unr1gua': '期貨合約是甚麼？',
  // A share in a company
  '2dlwexl6aif': '一間公司的股份',
  // An agreement to buy or sell something at a set price on a set future date
  '1xsiz61z7ld': '在指定的將來日期、以指定價格買入或賣出某樣東西的協議',
  // A loan from a broker
  '1mqj6zoigq0': '經紀提供的貸款',
  // A type of stop order
  'o820jpydwh': '一種觸發單',
  // Both sides fix the price today for a trade that settles later.
  '23hqur5us4v': '雙方今天就定下日後才結算的交易的價格。',
  // A contract has a multiplier of 50 and a tick size of 0.25. What is one tick worth?
  '23e0jkv2e9a': '一張合約的合約乘數為 50，最小價格變動為 0.25。每跳值多少？',
  // Tick value = tick size x multiplier = 0.25 x 50 = $12.50.
  '1k29yitkp2c': '每跳價值 = 最小價格變動 x 合約乘數 = 0.25 x 50 = $12.50。',
  // You buy 2 contracts (multiplier 50) at 4,000 and sell at 4,006. Your profit is:
  'hqfrvcuvv0': '你在 4,000 買入 2 張合約（合約乘數 50），在 4,006 賣出。你的盈利是：',
  // 6 points x 50 x 2 contracts = $600.
  '1q8kdnniuh4': '6 點 x 50 x 2 張合約 = $600。',
  // How is a perpetual future different from a dated one?
  '1tq8wdnwzwu': '永續合約與定期期貨有甚麼不同？',
  // It cannot be shorted
  'hzizyo7ogy': '它不能做空',
  // It has no expiry date
  '1i1oyk532b6': '它沒有到期日',
  // It has no leverage
  '1p4b2y8wkqr': '它沒有槓桿',
  // It is always cash
  '22gqtoe6vam': '它一定是現金',
  // A perp can be held indefinitely. Funding keeps its price near spot instead of an expiry.
  '156m9eirjr5': '永續合約可以無限期持有。它靠資金費用而不是到期日來令價格貼近現貨。',
  // What does "rolling" a futures contract mean?
  'y5ss3mq8i4': '期貨合約「轉倉」是甚麼意思？',
  // Doubling the position
  '1v2z2601ukl': '把持倉加倍',
  // Closing the expiring contract and opening the next one
  '210leorw6s9': '平掉即將到期的合約並開立下一張',
  // Moving the stop-loss
  '17wk5ny6irb': '移動止蝕',
  // Being liquidated
  '267p3bczeih': '被強制平倉',
  // Dated futures expire, so staying in the trade means moving to the next contract month.
  '11n0o74z0yc': '定期期貨會到期，所以要繼續持倉，就要轉到下一個合約月份。',
  // What is initial margin?
  'uxnafl7zhd': '甚麼是初始保證金？',
  // The fee to open a trade
  '1sg28ol4eiv': '開倉的手續費',
  // The deposit needed to open a position
  '22p61r2m3zq': '開倉所需的按金',
  // The profit target
  'q8cyl4wlzw': '盈利目標',
  // The maximum position size
  'oa8lj4ix5w': '最大持倉規模',
  // At 10x leverage the initial margin is 10% of the position value.
  '2eg0suiyb4t': '以 10 倍槓桿計，初始保證金是持倉價值的 10%。',
  // When does liquidation happen?
  'b5awbv9xvn': '強制平倉甚麼時候發生？',
  // When you reach your profit target
  '27bpjrpiv40': '到達盈利目標時',
  // When your remaining margin falls to the maintenance margin
  'wdsqwhfuk5': '剩餘保證金跌到維持保證金時',
  // At the end of each day
  'rqdgow58i': '每天結束時',
  // When funding is paid
  'w8xi0iavsz': '支付資金費用時',
  // Losses come out of your margin. When it reaches the minimum, the exchange closes the position.
  '1oy8t43u85p': '虧損從保證金中扣除。當它跌到最低水平，交易所就會平倉。',
  // You are long at 100 with 10x leverage and 0.5% maintenance margin. Roughly where is liquidation?
  '1y1yflnn545': '你以 10 倍槓桿、0.5% 維持保證金在 100 做多。強平價大約在哪裡？',
  // 100 x (1 - 1/10 + 0.005) = 90.50.
  '1a7yzt15qms': '100 x（1 - 1/10 + 0.005）= 90.50。',
  // Why do exchanges use the mark price for liquidations rather than the last trade?
  'm7ihwxnw8n': '為甚麼交易所用標記價格而不是最後成交價來決定強制平倉？',
  // To charge more fees
  '12n07pphoev': '為了收更多手續費',
  // So one odd trade or brief spike does not liquidate positions unfairly
  'cdkccylxyk': '令一宗古怪的成交或短暫的急升不會不公平地強平持倉',
  // Because the last price is secret
  '25lc5blo7do': '因為最後成交價是秘密',
  // It is the same thing
  '21ck1ye6yty': '兩者其實一樣',
  // The mark price is a smoothed fair value based on spot prices across exchanges.
  '19ubidzrile': '標記價格是根據多個交易所現貨價計算的平滑公允價值。',
  // What is the main danger of cross margin?
  'jlm9j824v1': '全倉保證金的主要危險是甚麼？',
  // Higher fees
  'jt5bcqdb26': '手續費較高',
  // A single losing position can draw on, and empty, your whole account
  'iwasosdua7': '一個虧損的持倉可以動用並耗盡你整個帳戶',
  // You cannot go short
  'kir6ekize7': '你不能做空',
  // Positions close too early
  '1v3nd4f652j': '持倉太早平倉',
  // Isolated margin caps the loss at what you assigned to the trade. Cross margin does not.
  'y16kyqqf92': '逐倉保證金把虧損上限定在你分配給該交易的金額。全倉保證金則沒有。',
  // Futures are trading above the spot price. This is called:
  'cuek3mntru': '期貨以高於現貨的價格交易。這叫做：',
  // Contango: futures above spot. Backwardation: futures below spot.
  '1wdtcomb3x7': '升水：期貨高於現貨。貼水：期貨低於現貨。',
  // What happens to the basis as a dated future approaches expiry?
  'f9xho1iht8': '隨著定期期貨接近到期，基差會怎樣？',
  // It grows
  'sfm0ki95pz': '擴大',
  // It shrinks to zero
  'keyg4661xe': '收縮至零',
  // It stays constant
  '11h66gd5uv4': '保持不變',
  // It becomes random
  'r9o6pcg091': '變得隨機',
  // The contract settles at spot, so the futures and spot prices converge.
  'igshk8xnlx': '合約以現貨價結算，所以期貨和現貨價格會收斂。',
  // The funding rate on a perpetual is positive. Who pays whom?
  '1a85vavz3nt': '永續合約的資金費率為正。誰付錢給誰？',
  // Shorts pay longs
  '1y1tu640k4o': '做空一方付給做多一方',
  // Longs pay shorts
  '21hgkic9595': '做多一方付給做空一方',
  // Both pay the exchange
  '28a563e8s9s': '雙方都付給交易所',
  // Nobody pays
  '1zmikj2t2s9': '沒有人支付',
  // Positive funding means the perp is above spot. Longs pay shorts, which discourages longs.
  '1d3t27898un': '正資金費率代表永續合約高於現貨。做多一方付給做空一方，從而抑制做多。',
  // You hold a $20,000 long and funding is 0.01% per 8 hours. Each payment is:
  '2efibe7bns1': '你持有 $20,000 的多倉，資金費率為每 8 小時 0.01%。每次支付是：',
  // 20,000 x 0.0001 = $2, paid three times a day.
  '190ceqralcx': '20,000 x 0.0001 = $2，每天支付三次。',
  // Why does high leverage make funding hurt more?
  '23qkcfqb6u7': '為甚麼高槓桿令資金費用更傷？',
  // The rate is higher at high leverage
  'hn8fe17voq': '高槓桿的費率較高',
  // Funding is charged on the position value, which is large relative to your margin
  'aj9dc4c7az': '資金費用按持倉價值收取，而持倉價值相對你的保證金很大',
  // Funding is charged twice
  '267nc14vc9h': '資金費用收兩次',
  // It does not
  '12jkwww7ijy': '不會',
  // At 10x, funding on the full position is ten times as large relative to your own money.
  'rho9c398a0': '以 10 倍計，整個持倉的資金費用相對你自己的資金大了十倍。',
  // What is the purpose of a hedge?
  '1lkfsjnvq9': '對沖的目的是甚麼？',
  // To maximise profit
  '1fsunecyvid': '盡量提高盈利',
  // To offset a risk you already have
  '1q3osdulzw6': '抵消你已有的風險',
  // To avoid fees
  '1zb0h374dxy': '避免手續費',
  // To increase leverage
  '1tefy9fe8h5': '增加槓桿',
  // A hedge reduces uncertainty. It gives up some upside to remove downside.
  '1yktclh32x6': '對沖減少不確定性。它放棄部分上升空間以消除下跌風險。',
  // You own 2 ETH and short 2 ETH of perpetual futures. Price falls 10%. Ignoring fees and funding, your net result is:
  '2d51enj5e54': '你持有 2 個以太幣，並做空 2 個以太幣的永續合約。價格下跌 10%。不計手續費和資金費用，你的淨結果是：',
  // A 10% loss
  '18aqo3ih3h8': '虧損 10%',
  // A 10% gain
  '24mnq4rxsye': '盈利 10%',
  // About zero
  'thwf0l284y': '大約為零',
  // A 20% loss
  '2d4ruza8z41': '虧損 20%',
  // The loss on the holding is offset by the gain on the short.
  '1gfhay0cokl': '持有部分的虧損被空倉的盈利抵消。',
  // With $1,000 of margin at 5x, price rises 4%. Your return on margin is:
  '1y8776fi6tq': '以 5 倍槓桿用 $1,000 保證金，價格上升 4%。你的保證金回報是：',
  // A $5,000 position gains $200, which is 20% of your $1,000.
  '1w759mzmcro': '$5,000 的持倉賺 $200，是你 $1,000 的 20%。',
  // At 20x leverage price dips 5% and then rallies 30%. What happens to your long?
  'x77dle2pdo': '以 20 倍槓桿，價格先下跌 5%，然後上升 30%。你的多倉會怎樣？',
  // You make 600%
  '23h3t6qnr6c': '你賺 600%',
  // You were liquidated on the dip and miss the rally
  '1vgxaky8mxq': '你在下跌時被強平，錯過了升市',
  // You break even
  '115w3btlkp9': '你打和',
  // Nothing
  '2109u9fst05': '甚麼都不會發生',
  // High leverage means you can be right about direction and still lose, because you did not survive the path.
  '52sg6pc3nt': '高槓桿代表你可以判斷對了方向卻仍然虧損，因為你捱不過途中的波動。',
  // What is the sensible way to decide how much leverage to use?
  'au6z2b5prw': '決定用多少槓桿的合理方法是甚麼？',
  // Use the maximum offered
  'g4b1ns41nl': '用最高的槓桿',
  // Pick the stop and dollar risk first; use only the leverage that position size needs
  'ufgrmdm0pj': '先決定止蝕和金額風險；只用該持倉規模所需的槓桿',
  // Always use 10x
  '1dvf0lrbeqq': '永遠用 10 倍',
  // Leverage does not need deciding
  'ms4we16now': '槓桿不需要決定',
  // Leverage is for sizing a correctly risked position, not for making it bigger than your rules allow.
  '1yrc1prjo5v': '槓桿是用來為風險正確的持倉調整規模，而不是令它大過你規則容許的。',
} satisfies Record<string, string>;

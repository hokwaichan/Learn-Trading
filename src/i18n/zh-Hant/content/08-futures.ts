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
  // A **futures contract** is an agreement to buy or sell something at a set price on a set future date. A farmer and a baker might agree today that the baker will buy wheat in six months at $6 a bushel. Both now know their price, whatever the market does.
  '13xv29sdess': '**期貨合約**是在指定的將來日期、以指定價格買入或賣出某樣東西的協議。農夫和麵包師傅今天可以協定，麵包師傅六個月後以每蒲式耳 $6 買入小麥。不論市場怎樣變化，雙方現在都知道自己的價格。',
  // Futures are **derivatives**: their value is derived from something else, called the **underlying** (wheat, oil, a stock index, Bitcoin). Most futures traders never touch the underlying. They buy and sell the contract itself to profit from its price changing, and close it before it ends.
  '1naf7bq10ed': '期貨是**衍生工具**：它的價值衍生自另一樣東西，叫**相關資產**（小麥、石油、股票指數、比特幣）。大部分期貨交易者從不接觸相關資產。他們買賣合約本身，從其價格變動中獲利，並在合約到期前平倉。',
  // Contract specifications
  '2ay84k2g94m': '合約規格',
  // Every futures contract has published details, the **contract specs**. Read them before trading, because they decide what one price move is worth in dollars.
  '2aedt1i9jbp': '每張期貨合約都有公佈的細節，即**合約規格**。交易前要先看清楚，因為它們決定了一次價格變動值多少錢。',
  // **Multiplier** (contract size): how much of the underlying one contract controls. One E-mini S&P 500 contract is worth 50 times the index.
  '15bfs0tmusk': '**合約乘數**（合約大小）：一張合約控制多少相關資產。一張 E-mini 標普 500 合約的價值是指數的 50 倍。',
  // **Tick size**: the smallest price step. For the E-mini it is 0.25 index points.
  '8dfj36pbpb': '**最小價格變動**：價格最小的一步。E-mini 是 0.25 個指數點。',
  // **Tick value**: what one tick is worth per contract. For the E-mini: 0.25 x 50 = $12.50.
  '1yv0bqfq14u': '**每跳價值**：每張合約每跳一下值多少。E-mini 為：0.25 x 50 = $12.50。',
  // **Expiry**: the date the contract ends and is settled.
  'i2me5ldo0f': '**到期日**：合約完結並結算的日子。',
  // **Settlement**: whether the underlying is actually delivered, or the difference is simply paid in cash. Most financial futures are **cash-settled**.
  '238emj26qz5': '**結算方式**：相關資產是否實物交收，還是只以現金支付差額。大部分金融期貨都是**現金結算**。',
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
  // Dated futures and perpetuals
  '1f8f1jzvgyp': '有到期日的期貨和永續合約',
  // Traditional futures are **dated**: each contract expires in a particular month, and there are several months trading at once. If you want to stay in after expiry you must close the expiring contract and open the next one, which is called **rolling**.
  '1k1oahstk3l': '傳統期貨有**到期日**：每張合約在某個月份到期，同時會有幾個月份的合約在交易。如果你想在到期後繼續持倉，就要平掉即將到期的合約並開立下一張，這叫**轉倉**。',
  // Crypto exchanges popularised the **perpetual future** (or "perp"), which has **no expiry**. You can hold it indefinitely. To keep its price close to the real market price, perps use a mechanism called funding, covered two lessons from now. The Futures page in this app simulates perpetuals.
  '1ubiae53wbp': '加密貨幣交易所普及了**永續合約**（或「perp」），它**沒有到期日**。你可以無限期持有。為了令價格貼近真實市價，永續合約使用一種叫資金費用的機制，兩課之後會講到。這個應用程式的期貨頁模擬的就是永續合約。',
  // Why futures exist
  '1929xh21uhn': '期貨為甚麼存在',
  // They began as a way for producers and buyers to lock in prices. They are popular with traders because going short is as easy as going long, and because you only put up a small deposit, which is leverage.
  'ig2cgqirg5': '它最初是生產者和買家鎖定價格的方法。它受交易者歡迎，因為做空和做多一樣容易，而且你只需存入少量按金，也就是槓桿。',
  // Leverage is built in
  '1p0burncbr2': '槓桿是內置的',
  // That $250,000 E-mini position needs only a deposit of perhaps $12,000 to $15,000. A 1% move in the index is $2,500. Futures are leveraged whether you think of them that way or not.
  '27nozclnanu': '那個 $250,000 的 E-mini 持倉，可能只需要 $12,000 至 $15,000 按金。指數變動 1% 就是 $2,500。不論你是否這樣看，期貨都是有槓桿的。',
  // Margin, mark price and liquidation
  'rngs0jzuk4': '保證金、標記價格和強制平倉',
  // The deposit you put up, how the exchange measures your losses against it, and when it closes you out.
  '10q1cpixb9a': '你存入的按金、交易所如何以它衡量你的虧損，以及它何時替你平倉。',
  // To open a futures position you do not pay the full value. You put up a deposit called **margin**. The ratio between the position value and your margin is the **leverage**.
  '13cx1uxse0t': '開立期貨持倉時，你不需要支付全部價值。你存入一筆叫**保證金**的按金。持倉價值與保證金的比率就是**槓桿**。',
  // Initial and maintenance margin
  '96gnk06f1s': '初始保證金和維持保證金',
  // **Initial margin** is what you need to open the position. At 10x leverage it is 10% of the position value.
  'abxu7jzk2q': '**初始保證金**是開倉所需的金額。以 10 倍槓桿計，就是持倉價值的 10%。',
  // **Maintenance margin** is the minimum you must keep in the position to hold it open. It is smaller, often 0.4% to 1% of the position value on crypto perpetuals.
  '2citdtdexy8': '**維持保證金**是維持持倉所需保留的最低金額。它較小，加密貨幣永續合約通常是持倉價值的 0.4% 至 1%。',
  // As the trade moves against you, the loss comes out of your margin. When what is left falls to the maintenance margin, the exchange closes the position. That is **liquidation**.
  '1xdcz4vzqcq': '當交易向不利方向發展，虧損會從保證金中扣除。當剩餘金額跌到維持保證金時，交易所就會平倉。這就是**強制平倉**。',
  // Initial margin = position value / leverage Liquidation (long) is roughly: entry x (1 - 1 / leverage + maintenance rate) Liquidation (short) is roughly: entry x (1 + 1 / leverage - maintenance rate)
  'g36kow8ztm': '初始保證金 = 持倉價值 / 槓桿\n強平價（做多）大約為：入場價 x（1 - 1 / 槓桿 + 維持保證金率）\n強平價（做空）大約為：入場價 x（1 + 1 / 槓桿 - 維持保證金率）',
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
  // Move the sliders to see how leverage changes the liquidation distance:
  '1woflbabti9': '移動滑桿，看看槓桿如何改變與強平價的距離：',
  // Mark price
  '8yg6qkpuux': '標記價格',
  // Exchanges do not use the last traded price to decide liquidations, because one odd trade could wipe people out unfairly. They use the **mark price**: a smoothed fair value based on the underlying spot price across several exchanges. Your unrealised P&L and liquidation are measured against the mark price, so a brief spike on one exchange does not liquidate you.
  'ze0vpa2s75': '交易所不會用最後成交價決定強制平倉，因為一宗古怪的成交就可能不公平地令人爆倉。它們用**標記價格**：根據多個交易所的相關資產現貨價計算的平滑公允價值。你的未實現盈虧和強制平倉都以標記價格計算，所以某個交易所的短暫急升不會令你被強平。',
  // Isolated and cross margin
  '1a9dgnstbjo': '逐倉和全倉保證金',
  // **Isolated margin**: each position has its own margin. If it is liquidated you lose that margin and nothing else. The loss is capped at what you assigned to the trade.
  '17u9ok7exqo': '**逐倉保證金**：每個持倉有自己的保證金。如果它被強制平倉，你輸掉那筆保證金，不會更多。虧損上限就是你分配給該交易的金額。',
  // **Cross margin**: all positions share your whole account balance as margin. A losing position can draw on the rest of your account, so it is liquidated later, but when it does go it can take the entire account with it.
  'lsk0m7k0g9': '**全倉保證金**：所有持倉共用你整個帳戶結餘作保證金。虧損的持倉可以動用帳戶其餘資金，所以較遲才被強平，但一旦被強平，可能帶走整個帳戶。',
  // Cross margin can empty the account
  'it9f93bnuq': '全倉保證金可以令帳戶清零',
  // With cross margin a single bad trade with no stop-loss can consume everything. As a beginner use isolated margin, so the worst case on any trade is known in advance.
  '21qblsljs6c': '用全倉保證金時，一宗沒有止蝕的壞交易就可以耗盡一切。作為新手請使用逐倉保證金，讓每宗交易的最壞情況都預先知道。',
  // The stop goes before the liquidation price
  '15qmgizfw8m': '止蝕要放在強平價之前',
  // Liquidation is the exchange choosing your exit, at the worst possible point and with a fee. Your stop-loss should always sit well before it. If the stop you want is beyond the liquidation price, your leverage is too high.
  '1csg6uag7t3': '強制平倉是交易所替你選擇出場點，在最差的位置而且還要收費。你的止蝕應該永遠遠在它之前。如果你想要的止蝕超出了強平價，你的槓桿就太高了。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The futures simulator shows margin used, free margin and the liquidation price before you confirm, draws the liquidation price on the chart, and warns you above 5x leverage.
  '10tzw2a8d4z': '期貨模擬器在你確認前顯示已用保證金、可用保證金和強平價，在圖表上畫出強平價，並在槓桿超過 5 倍時警告你。',
  // Funding, basis, contango and backwardation
  '2bt9t18qc7a': '資金費用、基差、升水和貼水',
  // Why a futures price differs from the spot price, and the recurring payment that keeps perpetuals in line.
  '1yajg9ykqph': '期貨價格為甚麼與現貨價格不同，以及令永續合約保持一致的定期支付。',
  // The price of something for immediate delivery is the **spot price**. A futures contract on the same thing usually trades at a slightly different price. The difference is the **basis**.
  '27rb5zvpwax': '即時交收的價格是**現貨價**。同一樣東西的期貨合約通常以略為不同的價格交易。兩者的差額就是**基差**。',
  // Basis = futures price - spot price
  '1d89bucekav': '基差 = 期貨價 - 現貨價',
  // Positive when futures are above spot, negative when below.
  'kkoaz5hqc4': '期貨高於現貨時為正，低於時為負。',
  // Contango and backwardation
  '21562c0njfa': '升水和貼水',
  // **Contango**: futures trade **above** spot, and later-dated contracts are higher still. This is the normal state for many markets, because holding the real thing until that date costs money (storage, interest).
  'qds4npzrcw': '**期貨升水**：期貨價格**高於**現貨，較遠期的合約更高。這是很多市場的正常狀態，因為持有實物到那個日期要付出成本（儲存、利息）。',
  // **Backwardation**: futures trade **below** spot. This happens when people want the underlying right now, for example during a shortage, or when the market expects prices to fall.
  '185hf7rvwcp': '**期貨貼水**：期貨價格**低於**現貨。這在人們想立即得到相關資產時出現，例如短缺期間，或市場預期價格會下跌時。',
  // Convergence
  '1lb867pth8c': '收斂',
  // On the expiry date a futures contract is settled at the spot price, so the two must meet. As expiry approaches the basis shrinks to zero. This is called **convergence**.
  '18h3k08uhya': '在到期日，期貨合約以現貨價結算，所以兩者必定相遇。隨著到期日接近，基差會收縮至零。這叫**收斂**。',
  // The basis of a dated future in contango, shrinking as expiry approaches. At expiry the futures price equals the spot price.
  '3xgw32e7vh': '處於升水的定期期貨的基差，隨到期日接近而收縮。到期時期貨價等於現貨價。',
  // Expiry: futures price = spot price
  '1jfd4yb8lr2': '到期：期貨價 = 現貨價',
  // Futures 4.20 above spot
  '1s17lmjs3w3': '期貨比現貨高 4.20',
  // Rolling a contract
  '16kul3gbhwk': '轉倉',
  // To stay in a dated future beyond its expiry you **roll**: close the expiring contract and open the next month. In contango the next contract costs more, so each roll loses a little. This **roll cost** is why some funds that hold futures long-term drift below the spot price.
  '1wsk7zh7qk0': '要在定期期貨到期後繼續持倉，你需要**轉倉**：平掉即將到期的合約，開立下一個月的合約。在升水時，下一張合約較貴，所以每次轉倉都會損失少許。這個**轉倉成本**解釋了為甚麼一些長期持有期貨的基金會逐漸落後於現貨價。',
  // Funding on perpetuals
  'npjqllnpg': '永續合約的資金費用',
  // A perpetual never expires, so nothing forces it to converge. Instead exchanges use the **funding rate**: a small payment exchanged between longs and shorts at regular intervals, usually every 8 hours.
  '17b72vxujws': '永續合約永不到期，所以沒有東西迫使它收斂。交易所改用**資金費率**：做多和做空雙方之間定期（通常每 8 小時）交換的小額支付。',
  // Perp price **above** spot: funding is **positive**, and **longs pay shorts**. Being long becomes costly, which pushes the price back down.
  'pg2mdw3u9o': '永續合約價格**高於**現貨：資金費率為**正**，**做多一方付給做空一方**。做多變得昂貴，把價格推回下方。',
  // Perp price **below** spot: funding is **negative**, and **shorts pay longs**.
  'q7985xuxw2': '永續合約價格**低於**現貨：資金費率為**負**，**做空一方付給做多一方**。',
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
  // High leverage makes funding large relative to your own money. During a euphoric rally funding can reach 0.1% per 8 hours or more: over 100% a year on the position.
  '97oly0hc09': '高槓桿令資金費用相對你自己的資金變得很大。在狂熱的升市中，資金費率可以達到每 8 小時 0.1% 或更高：相當於持倉每年超過 100%。',
  // Funding as a signal
  'ly9twt7n0t': '資金費率作為訊號',
  // Very high positive funding means the market is crowded with leveraged longs. That does not predict a fall, but it does mean many traders would be forced to sell if price dropped.
  'jglfj4v3o0': '非常高的正資金費率代表市場擠滿了槓桿多倉。這並不預示下跌，但意味著價格一旦下跌，很多交易者會被迫賣出。',
  // Hedging, speculation and leverage in practice
  'nhpvcdpd4c': '對沖、投機和實際的槓桿',
  // The two reasons to trade futures, and worked examples of leverage cutting both ways.
  '1qclc5y8inl': '交易期貨的兩個理由，以及槓桿雙向影響的示範計算。',
  // Hedging
  '23po9ovptgl': '對沖',
  // To **hedge** is to take a position that offsets a risk you already have. The aim is not profit; it is to reduce uncertainty.
  '2c2pl0naul2': '**對沖**是開立一個抵消你已有風險的持倉。目的不是賺錢，而是減少不確定性。',
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
  // Speculation
  '14dh0dgd843': '投機',
  // To **speculate** is to take a position purely to profit from a price change, with no underlying exposure to protect. Most retail futures trading is speculation. It is not wrong, but it means every dollar of leverage is a dollar of extra risk.
  '17wk0l0v46x': '**投機**是純粹為了從價格變動中獲利而開立持倉，並沒有任何相關資產風險需要保護。大部分散戶期貨交易都是投機。這並沒有錯，但它代表每一元槓桿都是一元額外風險。',
  // Leverage, worked both ways
  '19n0kqw1wel': '槓桿的雙向示範',
  // The same $1,000 of your own money, the same 4% price moves, at three levels of leverage:
  '109y4ocq3wu': '同樣是你自己的 $1,000，同樣 4% 的價格變動，三個槓桿水平：',
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
  // 5x leverage
  'cofkbn47na': '5 倍槓桿',
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
  // The asymmetry nobody mentions
  'xzz4fzvzq0': '沒有人提及的不對稱',
  // At 20x, a 5% fall liquidates you. If price then recovers and rallies 30%, it does not matter: you are no longer in the trade. High leverage means you can be right about direction and still lose everything, because you could not survive the path.
  '1lq479dd6s6': '以 20 倍槓桿計，下跌 5% 就會令你被強平。之後價格回升甚至上升 30% 都沒關係：你已經不在這宗交易之中。高槓桿代表你可以判斷對了方向卻仍然輸光一切，因為你捱不過途中的波動。',
  // Choose where your stop-loss goes from the chart.
  '2dybrqlzzm8': '從圖表決定止蝕放在哪裡。',
  // Choose your dollar risk (1% of the account).
  '14gu0402tul': '決定你的金額風險（帳戶的 1%）。',
  // The position size follows from those two.
  '10r1u301g8a': '持倉規模由這兩者得出。',
  // Use only as much leverage as that position size needs. Often that is 1x to 3x.
  '11xi937ltg1': '只使用該持倉規模所需的槓桿。通常是 1 至 3 倍。',
  // Leverage is a tool for sizing, not for getting rich
  '1ebtglgtcx2': '槓桿是調整規模的工具，不是致富的工具',
  // Its legitimate use is to take a correctly sized position without tying up your whole account. Using it to take a position bigger than your risk rules allow is how accounts end.
  'o5tzgbqqa1': '它的正當用途，是在不佔用整個帳戶的情況下開立規模正確的持倉。用它開立超出你風險規則容許的持倉，就是帳戶完蛋的方式。',
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
  // Backwardation
  '15h9ytyhum1': '期貨貼水',
  // Contango
  '1uc8lndr3a8': '期貨升水',
  // Liquidation
  '1oz08kgjh27': '強制平倉',
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

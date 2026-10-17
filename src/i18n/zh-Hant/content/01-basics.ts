// Traditional Chinese for content/lessons/01-basics.ts and content/quizzes/01-basics.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Basics
  '2dzolzqpt29': '基礎',
  // What a market is, how orders work, and why leverage needs respect.
  '1enq6pbjh43': '市場是甚麼、訂單如何運作，以及為甚麼要敬畏槓桿。',
  // What markets are
  '1f7diau4yx9': '市場是甚麼',
  // A market is where buyers and sellers agree on a price. That is all a chart records.
  '7vpqh25b13': '市場就是買家和賣家就價格達成協議的地方。圖表記錄的就只是這些。',
  // A **market** is any place where people who want to buy something meet people who want to sell it. A fruit market does this with apples. A financial market does it with things like company shares, currencies and cryptocurrencies.
  '1fqgqwc155y': '**市場**就是想買東西的人與想賣東西的人相遇的任何地方。街市用蘋果做這件事；金融市場則用公司股份、貨幣和加密貨幣等東西做這件事。',
  // Whenever a buyer and a seller agree, a **trade** happens at a price. That price is simply the most recent amount one person was willing to pay and another was willing to accept. Nobody sets it. It moves because the next pair of people agree on something different.
  '1034b0ftur0': '每當買家和賣家達成協議，就會以某個價格完成一宗**交易**。這個價格只是最近一個人願意付、另一個人願意接受的金額。沒有人設定它。它會變動，是因為下一對人同意了另一個價錢。',
  // What gets traded
  '2c546sbv9h5': '可以交易甚麼',
  // **Stocks** (also called shares) are small pieces of ownership in a company, such as Apple.
  '13mm1bfagtb': '**股票**（亦稱股份）是一間公司（例如蘋果公司）的一小部分擁有權。',
  // **Forex** is the exchange of one currency for another, such as euros for US dollars.
  '222hld2tltx': '**外匯**是把一種貨幣兌換成另一種，例如用美元換歐元。',
  // **Crypto** means digital currencies such as Bitcoin.
  '1rveqwjqn0v': '**加密貨幣**指比特幣這類數碼貨幣。',
  // **Derivatives** are contracts whose value depends on something else. Futures and options, covered later, are derivatives.
  '2eeqgve6z6e': '**衍生工具**是價值取決於另一樣東西的合約。之後會講到的期貨和期權都是衍生工具。',
  // The thing being traded is called an **instrument**, and each one has a short code called a **symbol** or **ticker**: AAPL for Apple, BTC for Bitcoin.
  '9a48tcimjp': '被交易的東西叫**交易品種**，每一個都有一個簡短代碼，叫**代號**或**股票代號**：蘋果是 AAPL，比特幣是 BTC。',
  // Why prices move
  '1j9m6i6ekep': '價格為甚麼會變動',
  // If more people are eager to buy than to sell at the current price, buyers have to offer more to find a seller, and the price rises. If more are eager to sell, the price falls. News, company results, interest rates and plain fear or greed all change how eager people are. This balance is called **supply and demand**.
  '1aj6u9kbwmb': '如果在目前價格下，想買的人比想賣的人多，買家就要出更高的價才找到賣家，價格便上升。如果想賣的人較多，價格便下跌。新聞、公司業績、利率，以及單純的恐懼或貪婪，都會改變人們有多心急。這種平衡就叫**供求**。',
  // One year of real daily prices for SPY, a fund that tracks 500 large US companies. Every bar is one day of buyers and sellers agreeing on prices. Move the pointer over it to read each day, and drag sideways to pan.
  '1qrsegnj04k': 'SPY 一年的真實每日價格。SPY 是追蹤 500 間美國大公司的基金。每一支棒都是買家和賣家一天內就價格達成的協議。把指標移到上面可以看每一天的數字，左右拖動可以平移。',
  // What a trader does
  'w9tdilhrh3': '交易者做甚麼',
  // A trader tries to buy something for less than they later sell it for (or the reverse). Nobody knows what the next price will be. Trading well is about making decisions where the possible gain is worth the possible loss, and keeping losses small when you are wrong.
  '1k6uhs3u698': '交易者嘗試以低於日後賣出的價格買入某樣東西（或者相反）。沒有人知道下一個價格是多少。交易得好，就是做出可能的收益值得可能的損失的決定，並在判斷錯誤時把損失控制得細小。',
  // In this app you practise with **paper trading**: pretend money at real prices, so mistakes cost nothing.
  'pf9ewtci9b': '在這個應用程式中，你會用**模擬交易**來練習：用假的資金、按真實價格交易，所以犯錯不用付出代價。',
  // Order types: market, limit and stop
  'zzp1jdi30h': '訂單類型：市價單、限價單和觸發單',
  // An order is an instruction to buy or sell. The type decides when it happens and at what price.
  '1fc24w2nf4e': '訂單是買入或賣出的指示。類型決定它何時成交以及成交價格。',
  // You trade by sending an **order**: an instruction to buy or sell a certain amount. The three basic types answer one question differently: do you care more about trading now, or about the price you get?
  '1ivvi5gcwwp': '你透過發出**訂單**來交易：即買入或賣出某個數量的指示。三種基本類型對同一個問題有不同答案：你更在乎現在就成交，還是成交的價格？',
  // Market order: trade now
  '170rkczpybc': '市價單：現在就成交',
  // A **market order** says: buy (or sell) immediately at the best price available. It always trades, but you do not control the price. In a fast or thinly traded market you can get a noticeably worse price than you saw on screen. That difference is called **slippage**.
  '44nzy7j13k': '**市價單**的意思是：立即以當時最佳的價格買入（或賣出）。它一定會成交，但你控制不了價格。在快速或成交稀疏的市場，你得到的價格可能明顯差過你在螢幕上看到的。這個差距叫**滑價**。',
  // Limit order: trade at my price or better
  'nf4eyb00z6': '限價單：以我的價格或更好價格成交',
  // A **limit order** says: buy only at this price or lower (or sell only at this price or higher). You control the price, but the order waits, and it may never trade if the market does not come to you. When an order trades it is said to be **filled**.
  '24xgd3iws26': '**限價單**的意思是：只以這個價格或更低價買入（或只以這個價格或更高價賣出）。你控制價格，但訂單要等候，如果市場不來到你的價位，可能永遠不會成交。訂單完成交易就叫**成交**。',
  // Stop order: trade if price gets here
  'dc3bwx9ac8': '觸發單：價格到這裡就成交',
  // A **stop order** stays asleep until the market reaches a trigger price you choose, then becomes a market order. Its main use is protection. A **stop-loss** is a stop order that closes your trade if price moves against you by more than you are prepared to lose. A **take-profit** is the mirror image: an order that closes the trade once your target is reached.
  '1gqdj97u17h': '**觸發單**會一直休眠，直至市場到達你選定的觸發價，然後變成市價單。它的主要用途是保護。**止蝕**是一種觸發單，當價格逆向移動超過你準備承受的損失時，就會平掉你的交易。**止賺**則是它的鏡像：價格到達你的目標時平倉的訂單。',
  // One trade planned with three orders. A limit order waits below the current price to buy on a dip. Once it fills, a stop-loss sits below it and a take-profit above.
  '1qa4eb7ccme': '用三張訂單計劃的一宗交易。一張限價單在現價下方等候，準備在回落時買入。成交後，止蝕放在它下方，止賺放在它上方。',
  // Buy limit: buy at 101.20 or lower
  '2bk7880cbwm': '買入限價單：以 101.20 或更低價買入',
  // Stop-loss: sell if price falls to 98.50
  's7d4fvi0hd': '止蝕：價格跌到 98.50 就賣出',
  // Take-profit: sell at 110.50
  '1uk5i2k3vko': '止賺：在 110.50 賣出',
  // Limit fills here
  '2a59yri6dbf': '限價單在這裡成交',
  // Which to use
  '1wuauctrd3t': '應該用哪一種',
  // Getting in or out matters more than the exact price: **market**.
  '1lim9io6miy': '入市或離場比確切價格更重要：**市價單**。',
  // You have a specific price in mind and can wait: **limit**.
  '106zed5r0tt': '你心中有一個特定價格，而且可以等：**限價單**。',
  // You want to be taken out automatically if you are wrong: **stop-loss**. Decide where it goes before you enter.
  '1m4kitf17nh': '你希望判斷錯誤時被自動踢出場：**止蝕**。入場前就決定好放在哪裡。',
  // A stop is not a guarantee
  'k14i04s81': '止蝕不是保證',
  // A stop becomes a market order when triggered. If price jumps straight past your level, for example on overnight news, you are filled at the next available price, which can be worse than your stop.
  '1r1ylsgwi0i': '止蝕被觸發後會變成市價單。如果價格直接跳過你的價位（例如因為隔夜新聞），你會以下一個可得的價格成交，可能比你的止蝕價更差。',
  // Bid, ask and the spread
  '1gapxuvm0r1': '買入價、賣出價和買賣差價',
  // There are always two prices: what buyers offer and what sellers ask. The gap is a cost you pay on every trade.
  '13jd71aghp5': '價格永遠有兩個：買家出的價和賣家要的價。兩者之間的差距是你每宗交易都要付的成本。',
  // A market does not really have one price. At any moment there are two:
  'j3wsa8zsuu': '市場其實沒有單一的價格。任何時候都有兩個：',
  // The **bid** is the highest price any buyer is currently offering.
  'zz9esguz2g': '**買入價**是目前任何買家願意出的最高價。',
  // The **ask** (or offer) is the lowest price any seller is currently asking.
  '2exrnooz60f': '**賣出價**（或叫價）是目前任何賣家要求的最低價。',
  // The gap between them is the **spread**. If the bid is 99.98 and the ask is 100.02, the spread is 0.04.
  '2astj8w0op0': '兩者之間的差距就是**買賣差價**。如果買入價是 99.98、賣出價是 100.02，差價就是 0.04。',
  // The order book
  '7cz06cdur0': '訂單簿',
  // All the waiting limit orders are collected in a list called the **order book**: buy orders stacked below the current price, sell orders above. The best of each side are the bid and the ask. Try it:
  '1xzze0tyqnf': '所有排隊中的限價單都集中在一張叫**訂單簿**的清單上：買單排在現價下方，賣單排在上方。兩邊最好的價格就是買入價和賣出價。試試看：',
  // Why the spread costs you money
  '1itiw1u9v8t': '為甚麼差價會令你蝕錢',
  // A market order to buy fills at the ask. A market order to sell fills at the bid. So if you bought and sold again instantly, you would buy at 100.02, sell at 99.98, and lose 0.04 without the market moving at all. The spread is a cost of trading, paid on the way in and the way out.
  '1tqi1abigif': '買入的市價單以賣出價成交；賣出的市價單以買入價成交。所以如果你買入後立即賣出，你會以 100.02 買入、99.98 賣出，即使市場完全沒動也輸了 0.04。差價是交易的成本，入場和離場時都要付。',
  // The spread on a round trip
  'h24la2a6qi': '一買一賣的差價成本',
  // You buy 100 shares with a market order at the ask of $100.02. Cost: $10,002.
  '1wrs0xyggbu': '你用市價單以賣出價 $100.02 買入 100 股。成本：$10,002。',
  // You change your mind and sell at the bid of $99.98. You receive $9,998.
  'y5dpns1lxg': '你改變主意，以買入價 $99.98 賣出。你收到 $9,998。',
  // You lost $4, plus any fees, although the price did not move.
  'apz73flx2w': '雖然價格沒有變動，你也輸了 $4，另加手續費。',
  // Liquidity
  '164e4t70n79': '流動性',
  // **Liquidity** is how easily you can trade without moving the price. A liquid market has many orders waiting, so the spread is tight and large orders fill near the quoted price. An illiquid market has few, so the spread is wide and a big market order eats through several price levels, giving you slippage. Major stocks, major currency pairs and large cryptocurrencies are liquid; small ones often are not.
  'ddjoocn9hf': '**流動性**是指你能否在不推動價格的情況下輕易交易。流動性高的市場有大量訂單在排隊，所以差價很窄，大額訂單也能在報價附近成交。流動性低的市場訂單很少，所以差價很闊，一張大額市價單會吃穿幾檔價格，帶來滑價。主要股票、主要貨幣對和大型加密貨幣的流動性都高；細小的則往往不是。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // Paper trades here add a small simulated fee and slippage, which you can change in Settings, so your practice results are not unrealistically good.
  '7ie2mtzllb': '這裡的模擬交易會加入少量模擬手續費和滑價（可在設定中更改），讓你的練習結果不會好得不切實際。',
  // Long vs short
  '23pk7ounlkp': '做多與做空',
  // Going long profits when price rises. Going short profits when it falls, and has a nastier worst case.
  '23r8zdph07p': '做多在價格上升時獲利。做空在價格下跌時獲利，而且最壞情況更可怕。',
  // Going long
  '93s54v2p8p': '做多',
  // Buying something because you expect it to rise is called going **long**. You buy, wait, and sell later. If you buy at $100 and sell at $110, you made $10. If it falls to $90 and you sell, you lost $10. Your worst case is the price going to zero: you lose what you paid and no more.
  '1l3yrmp5xhf': '因為預期某樣東西會上升而買入，叫**做多**。你買入、等待，之後賣出。如果你在 $100 買入、$110 賣出，你賺了 $10。如果它跌到 $90 而你賣出，你就輸了 $10。最壞的情況是價格跌到零：你輸掉付出的金額，不會更多。',
  // Going short
  'hl11o5vnuo': '做空',
  // Going **short** is how you profit from a falling price. You sell first and buy back later:
  '13cuwvimj6b': '**做空**是從價格下跌中獲利的方法。你先賣出，之後再買回：',
  // You borrow the asset from your broker and sell it straight away at the current price, say $100.
  'zdcufhg0ur': '你向經紀借入資產，並立即以現價（例如 $100）賣出。',
  // Later you buy it back. This is called **covering**.
  '1vunl8lebb2': '之後你把它買回來。這叫**平倉回補**。',
  // You return what you borrowed and keep the difference.
  '1stjgj450dt': '你歸還借來的東西，並保留差額。',
  // If you buy back at $90, you made $10. If the price rose to $110 instead, buying back costs more than you received and you lost $10. In practice the broker handles the borrowing automatically; you just press Sell.
  'd3p1d04i43': '如果你在 $90 買回，你賺了 $10。如果價格反而升到 $110，買回的成本比你收到的多，你就輸了 $10。實際上經紀會自動處理借貨；你只需按「賣出」。',
  // The same price path seen from both sides. A long entered at A loses money by B. A short entered at A makes money by B.
  '27zis0jzpjk': '從兩邊看同一條價格路徑。在 A 入場的多倉到 B 時虧錢；在 A 入場的空倉到 B 時賺錢。',
  // A: enter at 111
  '1vorudv998i': 'A：在 111 入場',
  // B: exit at 92
  '161tmf9pbmj': 'B：在 92 出場',
  // Entry 111
  '29ch9495qfq': '入場 111',
  // Exit 92
  '2a03xe38p10': '出場 92',
  // Long profit = (exit price - entry price) x quantity Short profit = (entry price - exit price) x quantity
  'muz6inr79t': '做多盈利 =（出場價 - 入場價）x 數量\n做空盈利 =（入場價 - 出場價）x 數量',
  // Both are negative when the trade goes the wrong way.
  '2t77hb47z4': '交易方向錯誤時，兩者都是負數。',
  // A short can lose more than a long
  'lshq7eojm9': '做空可以比做多輸得更多',
  // A price can only fall to zero, so a long can lose at most 100% of what you paid. But a price can rise without limit, so a short has no upper limit on its loss. A stock shorted at $100 that goes to $400 loses three times the original amount. Always use a stop-loss when short.
  'n0bw3z9b8a': '價格最多只能跌到零，所以做多最多輸掉付出金額的 100%。但價格可以無限上升，所以做空的虧損沒有上限。一隻在 $100 做空的股票升到 $400，就會輸掉原本金額的三倍。做空時一定要用止蝕。',
  // Shorting also has running costs: you may pay a fee for borrowing, and on futures you may pay funding, covered in the Futures module.
  '1kzgr6s00za': '做空還有持續成本：你可能要付借貨費，做期貨則可能要付資金費用，期貨單元會講到。',
  // Words you will see
  '1pqsn3lvfka': '你會看到的詞彙',
  // A long or short that is still open is a **position**. Closing it means doing the opposite trade. **Bullish** means expecting prices to rise; **bearish** means expecting them to fall.
  '2d3gujv5e4k': '仍然未平倉的多倉或空倉叫**持倉**。平倉就是做相反方向的交易。**看漲**指預期價格上升；**看跌**指預期價格下跌。',
  // Leverage and why it is dangerous
  '1hwoouqldx1': '槓桿以及它為何危險',
  // Leverage lets you control a big position with a small deposit. It multiplies losses exactly as much as gains.
  '1k2de8dxpi3': '槓桿讓你用少量按金控制大額持倉。它放大虧損的程度與放大盈利完全一樣。',
  // **Leverage** means trading a position larger than the money you put in, by borrowing the rest from your broker or exchange. The money you put in is called **margin**. With 10x leverage, $1,000 of margin controls a $10,000 position.
  '1irb1vpdu4n': '**槓桿**是指交易比你投入的資金更大的持倉，其餘部分向經紀或交易所借入。你投入的資金叫**保證金**。用 10 倍槓桿，$1,000 保證金可以控制 $10,000 的持倉。',
  // Your profit and loss are calculated on the whole position, not on your margin. That is the entire point of leverage, and the entire danger.
  '1ax8i0bi8h5': '你的盈虧是按整個持倉計算的，而不是按你的保證金。這就是槓桿的全部意義，也是它的全部危險。',
  // 10x leverage, both ways
  '4ntazagb5a': '10 倍槓桿，兩個方向',
  // You put up $1,000 margin and open a $10,000 long.
  'fxund3yiov': '你投入 $1,000 保證金，開立 $10,000 的多倉。',
  // Price rises 5%. The position gains $500. On your $1,000 that is +50%.
  '1da66yvvvd4': '價格上升 5%。持倉賺 $500。相對你的 $1,000 即是 +50%。',
  // Instead, price falls 5%. The position loses $500. On your $1,000 that is -50%.
  'wqxv1pfiiw': '如果價格反而下跌 5%。持倉輸 $500。相對你的 $1,000 即是 -50%。',
  // Price falls 10%. The position loses $1,000: all of your margin is gone.
  '1otldrdr8yq': '價格下跌 10%。持倉輸 $1,000：你的保證金全部沒了。',
  // Liquidation
  '1oz08kgjh27': '強制平倉',
  // The lender will not let losses eat into the money they lent you. When your losses have used up nearly all of your margin, the exchange closes your position for you. This is **liquidation**, and it usually means losing the whole margin for that trade. Roughly, the move that wipes you out is 1 divided by the leverage:
  'osk0lj05z7': '借錢給你的一方不會讓虧損蠶食他們借出的資金。當你的虧損幾乎耗盡保證金時，交易所會替你平倉。這就是**強制平倉**，通常代表輸掉該宗交易的全部保證金。大致上，令你輸光的波動是 1 除以槓桿倍數：',
  // Move that wipes out the margin = 1 / leverage
  '194c8mcem5s': '輸光保證金所需的波動 = 1 / 槓桿',
  // 2x: 50%.  5x: 20%.  10x: 10%.  20x: 5%.  50x: 2%.  Fees and the exchange safety buffer make the real figure slightly smaller.
  '11onqlz5g9v': '2 倍：50%。5 倍：20%。10 倍：10%。20 倍：5%。50 倍：2%。手續費和交易所的安全緩衝會令實際數字略小。',
  // Move the sliders to see how fast this happens:
  'p1c513xga2': '移動滑桿，看看這會發生得有多快：',
  // Why this catches beginners
  '1p1m1eqdlxy': '為甚麼新手會中招',
  // Markets move 2% to 5% in a day routinely, and crypto often more. At 20x leverage an ordinary day wipes out your margin even if your idea was right and price later went your way. You are no longer betting on direction; you are betting that price will not wobble first.
  'glfw2yq8va': '市場一天波動 2% 至 5% 是家常便飯，加密貨幣往往更多。用 20 倍槓桿，即使你的想法正確、價格之後也朝你的方向走，平常的一天就足以輸光你的保證金。你押注的已不再是方向，而是價格不會先晃一晃。',
  // Using it sensibly
  '1cmbqraoe97': '明智地使用槓桿',
  // Leverage does not change how good your idea is. It only changes how big the result is.
  '1a3oad3aml7': '槓桿不會改變你的想法有多好，只會改變結果有多大。',
  // Decide how many dollars you are willing to lose first, then size the position to match. The Risk management module shows how.
  'l50vsr1arj': '先決定你願意輸多少錢，再按此決定持倉大小。風險管理單元會示範怎樣做。',
  // Low leverage with a stop-loss well before the liquidation price means you choose where you get out, not the exchange.
  'jbifdaegey': '低槓桿加上遠在強平價之前的止蝕，代表由你決定在哪裡離場，而不是由交易所決定。',
  // The futures simulator warns you above 5x and shows the percentage move that would wipe out the position before you confirm.
  'zxb7pyhv2r': '期貨模擬器在槓桿超過 5 倍時會警告你，並在你確認前顯示會令持倉輸光的波動百分比。',
  // What is the price shown on a chart?
  'hxyxyghbbn': '圖表上顯示的價格是甚麼？',
  // A value set by the exchange each morning
  '19ax5dhr1tx': '交易所每天早上設定的數值',
  // The most recent price a buyer and a seller agreed on
  'ighxxaqwg3': '買家和賣家最近一次同意的價格',
  // The average of what all traders think it is worth
  '1s9l2e8zym6': '所有交易者認為它值多少的平均',
  // The price the company says its shares are worth
  'gl9gfmgpdl': '公司表示其股份值多少的價格',
  // A price is just the last trade: what one person paid and another accepted. It changes when the next pair agree on something different.
  '1ijtq47xnaa': '價格只是最後一宗交易：一個人付了、另一個人接受了的金額。下一對人同意了不同的價錢，它就會改變。',
  // More people are eager to buy than to sell at the current price. What usually happens?
  '2d44pw0f5jr': '在目前價格下，想買的人比想賣的人多。通常會發生甚麼？',
  // The price rises
  '1tv0c050zbm': '價格上升',
  // The price falls
  '7c9tc4vsl8': '價格下跌',
  // The price stays the same
  '1b4o6tvvren': '價格不變',
  // Trading stops
  '1vugpmg88xv': '交易停止',
  // Eager buyers have to offer more to find a seller, so the price rises. This is supply and demand.
  '1bo0fvszsul': '心急的買家要出更高的價才找到賣家，所以價格上升。這就是供求。',
  // What is a ticker (or symbol)?
  'bdka05319r': '股票代號（或代號）是甚麼？',
  // The fee charged per trade
  '15itgc4a3ar': '每宗交易收取的費用',
  // A short code that identifies an instrument, like AAPL
  '1mfgtt3ng7g': '識別交易品種的簡短代碼，例如 AAPL',
  // The smallest amount a price can move
  'vwdsrvcwj1': '價格最小的變動幅度',
  // A type of order
  'kxvi9pkbob': '一種訂單類型',
  // Each instrument has a short code. AAPL is Apple; BTC is Bitcoin.
  '1te75mvg5b6': '每個交易品種都有一個簡短代碼。AAPL 是蘋果公司；BTC 是比特幣。',
  // What is paper trading?
  '1n2nxe11qny': '模擬交易是甚麼？',
  // Trading with borrowed money
  '2c88sklq51y': '用借來的錢交易',
  // Trading shares of paper companies
  '1zfr66e9spq': '買賣紙上公司的股份',
  // Practising with pretend money at real prices
  '1grzsq9z349': '用假的資金、按真實價格練習',
  // Writing your trades down in a journal
  '11ao32hp2eq': '把交易寫在交易日誌裡',
  // Paper trading uses simulated money, so you can practise and make mistakes without losing anything.
  '1otus97l2ja': '模擬交易使用模擬資金，所以你可以練習和犯錯，而不會損失任何東西。',
  // You want to buy right now and do not mind exactly what price you get. Which order?
  'kx27f0ybp3': '你想立即買入，而且不太在意成交價。應該用哪種訂單？',
  // Limit order
  '27sxvf3p05i': '限價單',
  // Market order
  'a8ht02pmv6': '市價單',
  // Stop order
  'pboq121xzq': '觸發單',
  // Take-profit order
  'al1hsh9o2n': '止賺單',
  // A market order trades immediately at the best available price. You give up control of the price.
  'uch1oyomel': '市價單以當時最佳的價格立即成交。你放棄了對價格的控制。',
  // Price is 105. You place a buy limit order at 101. What happens?
  '89j3vgqb6h': '價格是 105。你在 101 落了一張買入限價單。會發生甚麼？',
  // It fills immediately at 105
  '16fn2i0plj0': '立即以 105 成交',
  // It fills immediately at 101
  'u48x99tkvd': '立即以 101 成交',
  // It waits, and fills only if price falls to 101 or lower
  'y6plz04c9l': '它會等候，只有價格跌到 101 或更低才成交',
  // It is rejected because 101 is below the market
  '1iiqx9v7l9d': '因為 101 低於市價而被拒絕',
  // A buy limit only trades at your price or lower, so it waits. It may never fill if price does not come down.
  '1kd46sajqoq': '買入限價單只會以你的價格或更低價成交，所以它會等候。如果價格沒有回落，它可能永遠不會成交。',
  // What is a stop-loss for?
  '1vsxzauxzr5': '止蝕的用途是甚麼？',
  // To guarantee a profit
  '1r979mhl75z': '保證有盈利',
  // To close your trade automatically if price moves against you past a level you chose
  '1yal4pzuj02': '當價格逆向越過你選定的水平時，自動平掉你的交易',
  // To stop you from trading too often
  '1j1l9ibb3qw': '阻止你過於頻繁地交易',
  // To buy more if price falls
  '1t90w8hhm7u': '價格下跌時買入更多',
  // A stop-loss limits the damage when you are wrong. Decide where it goes before entering the trade.
  'jx473ms2tr': '止蝕在你判斷錯誤時限制損害。入場前就決定好放在哪裡。',
  // Price gaps straight past your stop-loss on overnight news. What happens?
  '20py6ysawxp': '價格因隔夜新聞直接跳過你的止蝕。會發生甚麼？',
  // You are filled exactly at your stop price
  '1fe2cwrgmlj': '你會剛好在止蝕價成交',
  // The order is cancelled
  'ijsec594pi': '訂單被取消',
  // You are filled at the next available price, which may be worse than your stop
  '1wtm5pgck8': '你會以下一個可得的價格成交，可能比你的止蝕價更差',
  // The exchange refunds the difference
  'bcece27xbh': '交易所退回差額',
  // A triggered stop becomes a market order. If price jumped past your level, the fill is at the next price available.
  '9jo3fzegy1': '觸發後的止蝕會變成市價單。如果價格跳過了你的價位，就會以下一個可得的價格成交。',
  // The bid is 49.95 and the ask is 50.05. What is the spread?
  'ws14so6fzl': '買入價是 49.95，賣出價是 50.05。差價是多少？',
  // The spread is the ask minus the bid: 50.05 - 49.95 = 0.10.
  '1o7nxxymi3p': '差價是賣出價減買入價：50.05 - 49.95 = 0.10。',
  // You send a market order to BUY. Which price do you get?
  '104iv8q3i7a': '你發出一張買入市價單。你會得到哪個價格？',
  // The bid
  'koghiehux6': '買入價',
  // The ask
  '1ho4ozvsu1a': '賣出價',
  // The midpoint
  'xubuuvwwzv': '中間價',
  // Yesterday's close
  '6bzajrmd5t': '昨日收市價',
  // Buyers who want to trade now pay the ask, the lowest price a seller is asking. Sellers who want to trade now receive the bid.
  '7341tb92af': '想立即成交的買家要付賣出價，即賣家要求的最低價。想立即成交的賣家則收到買入價。',
  // Which market is likely to have the widest spread?
  '23bcwab1wla': '哪個市場的差價很可能最闊？',
  // A major currency pair
  '23o3624u3b0': '主要貨幣對',
  // A very large company's stock
  '1qjha1emfmz': '一間非常大型公司的股票',
  // A small, rarely traded coin
  'jwo6hhkad5': '一個細小、很少交易的加密貨幣',
  // Bitcoin
  '4efds2jjo9': '比特幣',
  // Thinly traded instruments have few waiting orders, so the gap between the best buyer and best seller is wider.
  '1szwlsiuxbg': '成交稀疏的交易品種排隊訂單很少，所以最佳買家和最佳賣家之間的差距較闊。',
  // You buy at the ask and immediately sell at the bid, and the market has not moved. You have:
  '245orfxw3m1': '你以賣出價買入，並立即以買入價賣出，而市場沒有變動。你：',
  // Broken even
  '1e12p9cur4o': '打和',
  // Made the spread
  '2362uhko95e': '賺了差價',
  // Lost the spread (plus fees)
  '25dr0ekhak0': '輸了差價（另加手續費）',
  // Made a small profit
  '1w4emvht9ph': '賺了少許',
  // You paid the higher price and received the lower one. The spread is a cost on every round trip.
  '1vuzg2zyzl9': '你付了較高的價格，收到較低的價格。差價是每一次買賣都要付的成本。',
  // You go long at $50 and sell at $46. Your result per unit is:
  'dxueq8uog6': '你在 $50 做多，在 $46 賣出。每單位的結果是：',
  // Long profit is exit minus entry: 46 - 50 = -4.
  '231nuvqvkfn': '做多盈利是出場價減入場價：46 - 50 = -4。',
  // You go short at $80 and buy back at $70. Your result per unit is:
  '1gngqk1mj7w': '你在 $80 做空，在 $70 買回。每單位的結果是：',
  // Short profit is entry minus exit: 80 - 70 = +10. Shorts make money when price falls.
  'ietg8ws3y9': '做空盈利是入場價減出場價：80 - 70 = +10。價格下跌時做空就會賺錢。',
  // Why can a short lose more than a long?
  '1j5x66xv8mj': '為甚麼做空可以比做多輸得更多？',
  // Shorts pay higher fees
  '14udp05vq': '做空的手續費較高',
  // A price can only fall to zero but can rise without limit
  'qdqr6ywm5m': '價格最多只能跌到零，但可以無限上升',
  // Shorts are always leveraged
  '2807p3lhmay': '做空一定會用槓桿',
  // Brokers charge a penalty
  '16w5njwclip': '經紀會收取罰款',
  // A long loses at most 100%. A short loses more and more the higher the price goes, with no ceiling.
  '140tivtwqaa': '做多最多輸 100%。做空則價格升得愈高輸得愈多，沒有上限。',
  // Someone says they are "bearish" on a stock. They expect its price to:
  'a8xi9mnuo8': '有人說他對一隻股票「看跌」。他預期它的價格會：',
  // Rise
  '48gs0gs75u': '上升',
  // Fall
  'psuevbz2jp': '下跌',
  // Stay flat
  '7hb4ydt11j': '保持不變',
  // Become more volatile
  '12p4nrqtqts': '變得更波動',
  // Bearish means expecting a fall; bullish means expecting a rise.
  'qisqrfoxt1': '看跌指預期下跌；看漲指預期上升。',
  // With 10x leverage, $500 of margin controls a position worth:
  '1vf6wwrb42x': '用 10 倍槓桿，$500 保證金可以控制價值多少的持倉：',
  // Position value = margin x leverage = 500 x 10 = $5,000.
  '29lhvgxcxb': '持倉價值 = 保證金 x 槓桿 = 500 x 10 = $5,000。',
  // You are long with 5x leverage and price rises 4%. Your return on margin is roughly:
  'mqvt98gz85': '你以 5 倍槓桿做多，價格上升 4%。你的保證金回報大約是：',
  // Leverage multiplies the move: 4% x 5 = 20%. It would be -20% if price had fallen 4%.
  'ehci5nvmsb': '槓桿會放大波動：4% x 5 = 20%。如果價格下跌 4%，就是 -20%。',
  // At 20x leverage, roughly what adverse move wipes out your margin?
  'xaan9u5x0q': '用 20 倍槓桿，大約多大的逆向波動會令你輸光保證金？',
  // The wipe-out move is about 1 divided by the leverage: 1 / 20 = 5%. Fees make it slightly less.
  'ofnuh0tx79': '輸光的波動大約是 1 除以槓桿倍數：1 / 20 = 5%。手續費會令它略小一點。',
  // What is liquidation?
  '1npmiy6ggxp': '強制平倉是甚麼？',
  // Selling a position at a profit
  '1t5hatuhcd1': '賺錢時賣出持倉',
  // The exchange closing your position because losses have used up your margin
  '15z9ltonmxk': '因為虧損耗盡了保證金，交易所替你平倉',
  // Converting your account to cash
  '5lh8poxvr0': '把帳戶轉換為現金',
  // A fee for using leverage
  '21fi05q5tow': '使用槓桿的費用',
  // When your margin is nearly gone the exchange closes the position so its loan is safe. You usually lose that margin.
  '1o6klcqsgi7': '當你的保證金快要用盡，交易所會平掉持倉以保障它的借款。你通常會輸掉那筆保證金。',
  // What does leverage change about a trade?
  'axb9qearzh': '槓桿改變了交易的甚麼？',
  // How likely it is to be right
  '8v7wrfsg2a': '判斷正確的可能性',
  // The size of the gain or loss, in both directions
  '1seacf3jpk1': '盈利或虧損的大小，兩個方向都是',
  // Only the size of the gains
  'uskot82btt': '只有盈利的大小',
  // The fees, and nothing else
  '2gh8qeaiu48': '手續費，其他都不變',
  // Leverage does not make an idea better. It makes the result bigger whichever way it goes.
  '1fxv7vop1ad': '槓桿不會令想法變得更好。無論結果是好是壞，它都會把結果放大。',
} satisfies Record<string, string>;

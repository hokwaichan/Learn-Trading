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
  // A **market** is where people who want to buy meet people who want to sell. When they agree, a **trade** happens at a price. Nobody sets that price: it is simply the last amount a buyer and a seller agreed on.
  '25x6qgm2hd3': '**市場**是想買的人和想賣的人相遇的地方。雙方同意時，就會以某個價格達成一宗**交易**。沒有人設定這個價格：它只是買家和賣家最近一次同意的金額。',
  // The trading floor of the New York Stock Exchange, crowded with traders, screens and flags
  '6iwq1cclqg': '紐約證券交易所的交易大堂，擠滿交易員、屏幕和旗幟',
  // The New York Stock Exchange. Most trading now happens on computers, but the idea is unchanged: buyers and sellers agreeing on prices.
  'edigd7sg8l': '紐約證券交易所。現在大部分交易都在電腦上進行，但道理不變：買家和賣家就價格達成協議。',
  // What gets traded
  '2c546sbv9h5': '可以交易甚麼',
  // Stocks: part of a company
  'fxey5qkge5': '股票：公司的一部分',
  // Forex: one currency for another
  'p0blr3jje2': '外匯：以一種貨幣兌換另一種',
  // Crypto: digital currencies
  '108uqr3kbwo': '加密貨幣：數碼貨幣',
  // Derivatives: futures and options
  '13xu0z12su5': '衍生工具：期貨和期權',
  // Each **instrument** has a short code, its **symbol** or **ticker**: AAPL for Apple, BTC for Bitcoin.
  'hwm1779zbf': '每種**交易品種**都有一個簡短代碼，即**代號**或**股票代號**：蘋果是 AAPL，比特幣是 BTC。',
  // Bitcoin
  '4efds2jjo9': '比特幣',
  // Why prices move
  '1j9m6i6ekep': '價格為甚麼會變動',
  // More eager buyers than sellers, and the price rises. More eager sellers, and it falls. News, company results, interest rates, fear and greed all shift that balance, which is called **supply and demand**.
  '23447hmai9x': '想買的人比想賣的人多，價格便上升；想賣的人較多，價格便下跌。新聞、公司業績、利率、恐懼和貪婪都會改變這個平衡，這就叫**供求**。',
  // One year of real daily prices for SPY, a fund holding 500 large US companies. Each bar is one day. Point at a bar to read it, and drag sideways to pan.
  'u1klz09b3t': 'SPY 一年的真實每日價格。SPY 是持有 500 間美國大公司的基金。每支棒是一天。指向一支棒可以看該日數字，左右拖動可以平移。',
  // What a trader does
  'w9tdilhrh3': '交易者做甚麼',
  // Buy for less than you later sell, or the reverse. Nobody knows the next price, so the skill is taking trades where the possible gain is worth the possible loss, and keeping losses small.
  '2a4kkv3skf8': '以低於日後賣出的價格買入，或者相反。沒有人知道下一個價格，所以技巧在於只做可能收益值得可能損失的交易，並把損失控制得細小。',
  // Here you practise with **paper trading**: pretend money at real prices, so mistakes cost nothing.
  '1u2xqw5flpp': '在這裡你會用**模擬交易**練習：用假的資金、按真實價格交易，所以犯錯不用付出代價。',
  // Order types: market, limit and stop
  'zzp1jdi30h': '訂單類型：市價單、限價單和觸發單',
  // An order is an instruction to buy or sell. The type decides when it happens and at what price.
  '1fc24w2nf4e': '訂單是買入或賣出的指示。類型決定它何時成交以及成交價格。',
  // An **order** is an instruction to buy or sell. Each type trades speed against price:
  '21d10x2p9a4': '**訂單**是買入或賣出的指示。每種類型都在速度和價格之間取捨：',
  // **Market order**: trade now at the best price available. It always fills, but in a fast market you may get a worse price than you saw. That gap is **slippage**.
  '2a30epc9xep': '**市價單**：立即以當時最佳價格成交。它一定會成交，但在快速市場中你得到的價格可能比看到的差。這個差距叫**滑價**。',
  // Market order
  'a8ht02pmv6': '市價單',
  // **Limit order**: trade only at your price or better. You control the price, but the order may never be **filled**.
  '11okajesr8v': '**限價單**：只以你的價格或更好的價格成交。你控制價格，但訂單可能永遠不會**成交**。',
  // Limit order
  '27sxvf3p05i': '限價單',
  // **Stop order**: waits until price reaches your trigger, then becomes a market order. A **stop-loss** closes a losing trade; a **take-profit** closes a winner at your target.
  'wjta3f3yd0': '**觸發單**：等價格到達你的觸發價，然後變成市價單。**止蝕**平掉虧損的交易；**止賺**在目標價平掉賺錢的交易。',
  // Stop order
  'pboq121xzq': '觸發單',
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
  // Need to get in or out now: market. Have a price in mind and can wait: limit. Want to be taken out if you are wrong: stop-loss, placed before you enter.
  '15mj6fhhc7o': '需要立即入市或離場：市價單。心中有價而且可以等：限價單。想在判斷錯誤時被踢出場：止蝕，並在入場前設好。',
  // A stop is not a guarantee
  'k14i04s81': '止蝕不是保證',
  // Once triggered, a stop is a market order. If price jumps past it, for example on overnight news, you get the next available price, which can be worse.
  '1wol82ykvn5': '止蝕一旦觸發就是市價單。如果價格跳過它（例如因為隔夜新聞），你會以下一個可得價格成交，可能更差。',
  // Bid, ask and the spread
  '1gapxuvm0r1': '買入價、賣出價和買賣差價',
  // There are always two prices: what buyers offer and what sellers ask. The gap is a cost you pay on every trade.
  '13jd71aghp5': '價格永遠有兩個：買家出的價和賣家要的價。兩者之間的差距是你每宗交易都要付的成本。',
  // A market always has two prices. The **bid** is the most any buyer will pay right now. The **ask** is the least any seller will accept. The gap between them is the **spread**.
  '2b7bdikhgxl': '市場永遠有兩個價格。**買入價**是此刻任何買家願意出的最高價。**賣出價**是任何賣家願意接受的最低價。兩者之間的差距就是**買賣差價**。',
  // A level 2 order book: bid prices and sizes in green, ask prices and sizes in red, and a depth chart beside them
  'qqdvdyekpk': '一份第二層訂單簿：綠色是買入價和數量，紅色是賣出價和數量，旁邊是市場深度圖',
  // An order book. Buyers wait below the price (green), sellers above (red). The best bid, $87.42, and the best ask, $87.43, meet in the middle: a spread of one cent.
  '2188ncpeal6': '一份訂單簿。買家在價格下方等候（綠色），賣家在上方（紅色）。最佳買入價 $87.42 和最佳賣出價 $87.43 在中間相遇：差價一仙。',
  // All the waiting limit orders together are the **order book**. Try it:
  '15fuaa7esj3': '所有排隊中的限價單合起來就是**訂單簿**。試試看：',
  // Why the spread costs you money
  '1itiw1u9v8t': '為甚麼差價會令你蝕錢',
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
  // **Liquidity** is how easily you can trade without moving the price. Big stocks, major currencies and large coins are liquid: tight spreads, little slippage. Small ones often have wide spreads, and a large order eats through several price levels.
  '12hcgtgfkje': '**流動性**是指你能否在不推動價格的情況下輕易交易。大型股票、主要貨幣和大型加密貨幣流動性高：差價窄、滑價少。細小的品種差價往往很闊，一張大額訂單會吃穿幾檔價格。',
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
  // Going short
  'hl11o5vnuo': '做空',
  // Buy now, sell later, and profit if price rises: buy at $100, sell at $110, make $10. This is going **long**. The worst case is the price falling to zero, losing what you paid and no more.
  'ic010k66f2': '現在買入、之後賣出，價格上升就賺錢：$100 買入、$110 賣出，賺 $10。這就是**做多**。最壞情況是價格跌到零，輸掉付出的金額，不會更多。',
  // Going **short** profits from a fall. You sell first and buy back later:
  '7zel6m1vv8': '**做空**從下跌中獲利。你先賣出，之後再買回：',
  // Borrow the asset from your broker and sell it now, say at $100.
  '2dxzvkvvy9x': '向經紀借入資產並立即賣出，例如在 $100。',
  // Later, buy it back. This is called **covering**.
  'fne7itdylz': '之後把它買回來。這叫**平倉回補**。',
  // Return what you borrowed and keep the difference: buy back at $90 and you made $10.
  '5f03ahhghn': '歸還借來的東西並保留差額：在 $90 買回就賺了 $10。',
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
  // A price can only fall to zero, but it can rise without limit. A stock shorted at $100 that goes to $400 loses three times the original amount. Always use a stop-loss when short.
  'bl0sa7vcoz': '價格最多只能跌到零，但可以無限上升。一隻在 $100 做空的股票升到 $400，就會輸掉原本金額的三倍。做空時一定要用止蝕。',
  // Bronze statues of a bear and a bull facing each other outside the Frankfurt Stock Exchange
  'p88ppe5d90': '法蘭克福證券交易所外，一熊一牛兩座銅像面對面',
  // The bull and the bear outside the Frankfurt Stock Exchange. Bullish means expecting prices to rise; bearish means expecting them to fall.
  '3wk7n6rok3': '法蘭克福證券交易所外的牛和熊。看漲指預期價格上升；看跌指預期價格下跌。',
  // Words you will see
  '1pqsn3lvfka': '你會看到的詞彙',
  // A long or short that is still open is a **position**. Closing it means doing the opposite trade. Shorts can also carry a borrowing fee, or funding on futures.
  '24y6kbb9qvg': '仍然未平倉的多倉或空倉叫**持倉**。平倉就是做相反方向的交易。做空還可能要付借貨費，做期貨則要付資金費用。',
  // Leverage and why it is dangerous
  '1hwoouqldx1': '槓桿以及它為何危險',
  // Leverage lets you control a big position with a small deposit. It multiplies losses exactly as much as gains.
  '1k2de8dxpi3': '槓桿讓你用少量按金控制大額持倉。它放大虧損的程度與放大盈利完全一樣。',
  // **Leverage** means trading a position larger than your money by borrowing the rest. The money you put in is the **margin**. With 10x leverage, $1,000 of margin controls a $10,000 position, and profit and loss are counted on the whole $10,000.
  '17ah7zrh98g': '**槓桿**是指借入資金，交易比你的資金更大的持倉。你投入的資金叫**保證金**。用 10 倍槓桿，$1,000 保證金可以控制 $10,000 的持倉，盈虧按整個 $10,000 計算。',
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
  // When losses have used up nearly all your margin, the exchange closes the position for you. This is **liquidation**, and it usually costs the whole margin. The move that does it is roughly:
  '1p0jqf7z3g8': '當虧損用光了差不多全部保證金，交易所會替你平倉。這就是**強制平倉**，通常會輸掉整筆保證金。造成強制平倉的走勢大約是：',
  // Move that wipes out the margin = 1 / leverage
  '194c8mcem5s': '輸光保證金所需的波動 = 1 / 槓桿',
  // 2x: 50%.  5x: 20%.  10x: 10%.  20x: 5%.  50x: 2%.  Fees and the exchange safety buffer make the real figure slightly smaller.
  '11onqlz5g9v': '2 倍：50%。5 倍：20%。10 倍：10%。20 倍：5%。50 倍：2%。手續費和交易所的安全緩衝會令實際數字略小。',
  // Why this catches beginners
  '1p1m1eqdlxy': '為甚麼新手會中招',
  // Markets move 2% to 5% in a day routinely, and crypto often more. At 20x an ordinary day wipes out your margin even if your idea was right. You are no longer betting on direction, but on price not wobbling first.
  'tpulaiu57f': '市場一天波動 2% 至 5% 很平常，加密貨幣往往更大。用 20 倍槓桿，普通的一天就能抹去你的保證金，即使你的想法是對的。你押注的不再是方向，而是價格不會先晃一下。',
  // Leverage does not make an idea better, only the result bigger.
  '1ppa1rvqn48': '槓桿不會令想法變好，只會令結果變大。',
  // Decide how many dollars you will risk first, then size the position. The Risk management module shows how.
  '24jgd2hipum': '先決定願意承受多少金額的風險，再決定持倉規模。「風險管理」單元會教你怎樣做。',
  // Low leverage with a stop-loss well before liquidation means you choose where you get out, not the exchange.
  '1fekkzbpzfk': '低槓桿加上遠早於強制平倉價的止蝕，代表由你決定在哪裡離場，而不是交易所。',
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
  // The bid
  'koghiehux6': '買入價',
  // The spread is the ask minus the bid: 50.05 - 49.95 = 0.10.
  '1o7nxxymi3p': '差價是賣出價減買入價：50.05 - 49.95 = 0.10。',
  // You send a market order to BUY. Which price do you get?
  '104iv8q3i7a': '你發出一張買入市價單。你會得到哪個價格？',
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

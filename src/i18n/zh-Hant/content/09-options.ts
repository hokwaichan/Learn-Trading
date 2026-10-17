// Traditional Chinese for content/lessons/09-options.ts and content/quizzes/09-options.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Options
  '13y4iyj8uki': '期權',
  // Contracts that give a right without an obligation. Flexible, and easy to misunderstand.
  'todbx32ums': '賦予權利而沒有義務的合約。靈活，也很容易被誤解。',
  // Calls and puts
  '2cpatoumsjv': '認購期權和認沽期權',
  // An option is the right to buy or sell at a fixed price by a fixed date. You pay a premium for that right.
  '23z91tx0oi3': '期權是在某日期前以固定價格買入或賣出的權利。你要為這個權利支付期權金。',
  // An **option** is a contract that gives its buyer the **right, but not the obligation**, to buy or sell something at a fixed price on or before a fixed date. The something is the **underlying**: a stock, an index, a cryptocurrency.
  '7l13qq05i9': '**期權**是一種合約，賦予買方在某個日期或之前以固定價格買入或賣出某樣東西的**權利，但沒有義務**。那樣東西就是**相關資產**：股票、指數、加密貨幣。',
  // Compare it with a deposit on a house. You pay a small sum to lock in the price for three months. If prices rise you buy at the old price. If they fall you walk away and lose only the deposit.
  '2ebob7a3yur': '把它與買樓的訂金比較。你付一小筆錢把價格鎖定三個月。如果樓價上升，你以舊價格買入。如果下跌，你轉身離開，只損失訂金。',
  // The two kinds
  '163nekc55al': '兩種期權',
  // A **call** option is the right to **buy** the underlying at the fixed price. Calls gain value when the underlying rises.
  '27vxzfp7kgn': '**認購期權**是以固定價格**買入**相關資產的權利。相關資產上升時，認購期權會升值。',
  // A **put** option is the right to **sell** the underlying at the fixed price. Puts gain value when the underlying falls.
  '1nz3bgwle5l': '**認沽期權**是以固定價格**賣出**相關資產的權利。相關資產下跌時，認沽期權會升值。',
  // The terms of the contract
  '2a8801xloby': '合約條款',
  // **Strike price**: the fixed price at which you can buy (call) or sell (put).
  '1yujz6cgcqh': '**行使價**：你可以買入（認購）或賣出（認沽）的固定價格。',
  // **Expiry** (or expiration): the date the right ends. After it the option no longer exists.
  '11gmizc1abf': '**到期日**：權利結束的日子。之後期權就不再存在。',
  // **Premium**: the price of the option itself. The buyer pays it up front and it is the most the buyer can lose.
  '1lwetlz03rg': '**期權金**：期權本身的價格。買方預先支付，這也是買方最多可能輸掉的金額。',
  // **Contract size**: stock options usually cover 100 shares, so a premium quoted at $3 costs $300 per contract.
  '2fnnltqc96u': '**合約大小**：股票期權通常涵蓋 100 股，所以報價 $3 的期權金每張合約要 $300。',
  // Buying a call
  '29vxgrgzukz': '買入認購期權',
  // A stock trades at $100. You buy a call with a $100 strike expiring in one month, for a premium of $4.
  '1vduxpi8w00': '一隻股票價格 $100。你買入一張行使價 $100、一個月後到期的認購期權，期權金 $4。',
  // At expiry the stock is at $112. Your right to buy at $100 is worth $12. Minus the $4 you paid: +$8 profit.
  '1d84lm772jx': '到期時股價 $112。你以 $100 買入的權利值 $12。減去你付的 $4：盈利 +$8。',
  // At expiry the stock is at $103. The right is worth $3. Minus $4: a $1 loss, even though the stock rose.
  'l0ux1yljx': '到期時股價 $103。權利值 $3。減去 $4：虧損 $1，雖然股價上升了。',
  // At expiry the stock is at $95. Nobody wants the right to buy at $100. It expires worthless and you lose the $4.
  'dff2oqrmil': '到期時股價 $95。沒有人想要以 $100 買入的權利。它變得毫無價值，你輸掉 $4。',
  // A **payoff diagram** shows profit or loss at expiry for every possible final price. Drag the slider to move the price at expiry:
  'by2uv19lm9': '**損益圖**顯示每一個可能的最終價格在到期時的盈虧。拖動滑桿來移動到期價格：',
  // Long call: strike 100, premium 4
  '1z64o1iwv59': '買入認購期權：行使價 100，期權金 4',
  // Reading the diagram
  '1yhs8blvtfq': '解讀損益圖',
  // Below the strike the line is flat at -4: the option expires worthless and you lose the premium, and no more.
  '83x4b2d9wr': '在行使價以下，線平坦地停在 -4：期權到期時毫無價值，你輸掉期權金，不會更多。',
  // Above the strike the line rises one-for-one with the price.
  '6syobwpq85': '在行使價以上，線隨價格一比一上升。',
  // It crosses zero at the **break-even**: strike plus premium, here 104. The stock has to rise more than 4% just for you to get your money back.
  '1jv34yb94lz': '它在**損益平衡點**穿過零：行使價加期權金，這裡是 104。股價要上升超過 4%，你才能拿回本錢。',
  // Long put: strike 100, premium 4
  'z5c8sxevfv': '買入認沽期權：行使價 100，期權金 4',
  // The put is the mirror image. It profits as the price falls, breaks even at strike minus premium (96), and loses only the premium if the price ends above the strike.
  '1z1t1vlnf17': '認沽期權是鏡像。它在價格下跌時獲利，在行使價減期權金（96）打和，如果價格收在行使價之上，只會輸掉期權金。',
  // Why buy an option instead of the stock?
  'wnwz4pnur7': '為甚麼買期權而不是買股票？',
  // Limited risk and leverage. The call above controls $100 of stock for $4. If the stock jumps 12%, the option triples. The price of that is the premium, which you lose entirely if the move does not come in time.
  '1tx2qmfskqc': '有限的風險和槓桿。上面的認購期權用 $4 控制 $100 的股票。如果股價急升 12%，期權會翻三倍。代價就是期權金，如果走勢沒有及時出現，你會全部輸掉。',
  // Being right is not enough
  '8t7e9doww5': '判斷正確並不足夠',
  // To profit from buying an option you must be right about direction, about how far, and about how soon. A stock that goes where you expected one week after expiry earns you nothing.
  '17hoo3k3p7i': '要從買入期權中獲利，你必須判斷對方向、幅度和時間。一隻股票在到期後一星期才走到你預期的位置，你甚麼都賺不到。',
  // What an option is worth
  '1u8dfizt8dg': '期權值多少',
  // Intrinsic value, time value, in and out of the money, and what happens at exercise and assignment.
  '2277j7rwm4g': '內在價值、時間值、價內和價外，以及行使和被行使時會發生甚麼。',
  // An option's premium is made of two parts.
  '17tpacr142h': '期權的期權金由兩部分組成。',
  // Intrinsic value
  '15zgyfgb94d': '內在價值',
  // **Intrinsic value** is what the option would be worth if you used it this instant. For a call it is the underlying price minus the strike; for a put, the strike minus the underlying price. It can never be negative: if using the option would lose money, you simply would not.
  '1d1r13oiiow': '**內在價值**是期權如果在這一刻行使所值的價值。認購期權是相關資產價格減行使價；認沽期權是行使價減相關資產價格。它永遠不會是負數：如果行使會虧錢，你就不會行使。',
  // Call intrinsic value = max(0, underlying - strike) Put intrinsic value = max(0, strike - underlying)
  '1f9kh2ouzex': '認購期權內在價值 = max(0, 相關資產價格 - 行使價)\n認沽期權內在價值 = max(0, 行使價 - 相關資產價格)',
  // Stock at 108, 100-strike call: intrinsic 8. Stock at 95, same call: intrinsic 0.
  'ugkorwfy04': '股價 108，行使價 100 的認購期權：內在價值 8。股價 95，同一張認購期權：內在價值 0。',
  // Time value
  'zk3ho46nxq': '時間值',
  // **Time value** (or extrinsic value) is everything else in the premium: what buyers pay for the chance that the option becomes more valuable before expiry. More time and more volatility mean more chance, so more time value. At expiry there is no chance left, so time value is zero.
  '1lab6xipeea': '**時間值**（或外在價值）是期權金中其餘的一切：買家為期權在到期前變得更有價值的機會而付出的價錢。時間愈多、波幅愈大，機會就愈大，時間值也就愈多。到期時已沒有任何機會，所以時間值為零。',
  // Premium = intrinsic value + time value
  '20wb89gjzwo': '期權金 = 內在價值 + 時間值',
  // Stock at 108, 100-strike call trading at 11: intrinsic 8, time value 3.
  '18t3ac1h2zr': '股價 108，行使價 100 的認購期權以 11 交易：內在價值 8，時間值 3。',
  // Move the price and the days to expiry, and watch the premium split into its two parts:
  '1v0mr9z6c7l': '移動價格和距離到期的日數，看看期權金如何分成兩部分：',
  // Moneyness
  '13yhrl52sjv': '價內外程度',
  // **In the money (ITM)**: the option has intrinsic value. A call with a strike below the price; a put with a strike above it.
  'ne094gq876': '**價內（ITM）**：期權有內在價值。行使價低於現價的認購期權；行使價高於現價的認沽期權。',
  // **At the money (ATM)**: the strike is at or very near the current price. These have the most time value.
  '1kd4k3y3qo9': '**價平（ATM）**：行使價等於或非常接近現價。這些期權的時間值最多。',
  // **Out of the money (OTM)**: no intrinsic value. A call with a strike above the price; a put with a strike below it. The whole premium is time value.
  '1ibxp7b8q5s': '**價外（OTM）**：沒有內在價值。行使價高於現價的認購期權；行使價低於現價的認沽期權。整個期權金都是時間值。',
  // Exercise and assignment
  '1bjye23igrl': '行使和被行使',
  // To **exercise** an option is to use the right: buy the underlying at the strike (call) or sell it at the strike (put). When a buyer exercises, a seller of that option is **assigned**: they must take the other side, selling the stock at the strike (call) or buying it at the strike (put).
  '1cmvkifdqmu': '**行使**期權就是運用權利：以行使價買入（認購）或賣出（認沽）相關資產。當買方行使時，該期權的一個賣方會**被行使**：他們必須承擔另一方，以行使價賣出股票（認購）或買入股票（認沽）。',
  // In practice most traders never exercise. They sell the option back to the market before expiry, because selling captures the remaining time value and exercising throws it away.
  '27nclhj5oqc': '實際上大部分交易者從不行使。他們在到期前把期權賣回市場，因為賣出可以取得剩餘的時間值，行使則會把它丟掉。',
  // American and European style
  '1s9ieluu83n': '美式和歐式',
  // **American-style** options can be exercised on any day up to expiry. Most stock options are American.
  '2ftn9ipeth7': '**美式**期權在到期前任何一天都可以行使。大部分股票期權是美式的。',
  // **European-style** options can be exercised only at expiry. Most index options and most crypto options are European.
  'vy014bfj1h': '**歐式**期權只能在到期時行使。大部分指數期權和加密貨幣期權是歐式的。',
  // The names have nothing to do with geography.
  'tuiu63tmn4': '這些名稱與地理無關。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // Option prices here are simulated with the Black-Scholes model, which prices European-style options. So in the simulator, exercise and assignment happen only at expiry.
  '1s5ekq4cu0o': '這裡的期權價格用柏力克－舒爾斯模型模擬，它為歐式期權定價。所以在模擬器中，行使和被行使只在到期時發生。',
  // Out-of-the-money options look cheap for a reason
  '1u0g488o590': '價外期權看起來便宜是有原因的',
  // A far OTM option costing $0.20 is cheap because it will very probably expire worthless. Buying many of them is one of the most reliable ways to lose money slowly.
  '1258tfbhd8w': '一張只需 $0.20 的深度價外期權之所以便宜，是因為它很可能到期時毫無價值。大量買入這類期權，是慢慢輸錢最可靠的方法之一。',
  // Buying vs selling options
  '2cgcgwyr8jp': '買入與沽出期權',
  // Buyers have limited risk and need a move. Sellers collect premium and take on the risk, which can be unlimited.
  '1srqsvtf0kk': '買方風險有限，需要走勢出現。賣方收取期權金並承擔風險，風險可以是無限的。',
  // Every option has a buyer and a seller. The seller is also called the **writer**. Their positions are exact opposites: whatever the buyer makes, the seller loses.
  'i8giyqhkq5': '每張期權都有一個買方和一個賣方。賣方亦稱**沽出者**。他們的持倉完全相反：買方賺多少，賣方就輸多少。',
  // The buyer
  '2arvb9nfmpi': '買方',
  // Pays the premium up front.
  'g585vds0n6': '預先支付期權金。',
  // Has a right and no obligation.
  '23uoxhdtu2g': '擁有權利而沒有義務。',
  // **Maximum loss**: the premium.
  'g61uoej6sd': '**最大虧損**：期權金。',
  // **Maximum profit**: unlimited for a call; large for a put (the price can only fall to zero).
  '28rm6xeqaq3': '**最大盈利**：認購期權無上限；認沽期權很大（價格最多只能跌到零）。',
  // Time works against them: the option loses time value every day.
  'o34ufjxwwf': '時間對他們不利：期權每天都在損失時間值。',
  // The seller
  'wu2fi1epv2': '賣方',
  // Receives the premium up front.
  '2463bij4kun': '預先收取期權金。',
  // Has an obligation if assigned.
  '25167nmv2yn': '被行使時有義務。',
  // **Maximum profit**: the premium, and nothing more.
  '5qcynu6gsq': '**最大盈利**：期權金，不會更多。',
  // **Maximum loss**: potentially very large or unlimited.
  '24taxscuqr8': '**最大虧損**：可能非常大或無上限。',
  // Time works for them: they keep the premium if the option expires worthless.
  'z1exda28u7': '時間對他們有利：如果期權到期時毫無價值，他們就保留期權金。',
  // Short call: strike 100, premium 4 (uncovered)
  '1zxh3d6hsbf': '沽出認購期權：行使價 100，期權金 4（無備兌）',
  // This is the long call turned upside down. The seller keeps 4 if the price ends at or below 100. Above 104 they lose, and the loss grows without limit as the price rises.
  '1bul8bz3u1p': '這是倒轉了的買入認購期權。如果價格收在 100 或以下，賣方保留 4。高於 104 他們就會虧損，而且價格愈升，虧損愈大，沒有上限。',
  // Why selling is tempting
  'xv8yb10mj6': '為甚麼沽出期權令人心動',
  // Most options expire worthless, so sellers win most of the time. A seller might collect a small premium month after month and feel they have found free money. Then one large move produces a loss many times the size of all the premiums collected.
  '26j11dktm0x': '大部分期權到期時都毫無價值，所以賣方大部分時間都會贏。賣方可能每個月都收取一小筆期權金，覺得自己找到了免費的錢。然後一次大波動就帶來比所有已收期權金大很多倍的虧損。',
  // One bad month
  '1la20fvz235': '一個壞月份',
  // You sell one uncovered call at the 100 strike for $4 each month and keep it eleven times: +$44.
  'wyw24lwtru': '你每個月以 $4 沽出一張行使價 100 的無備兌認購期權，十一次都保留了期權金：+$44。',
  // In month twelve the company gets a takeover offer and the stock opens at $160.
  '1qhsq5pqukz': '第十二個月，公司收到收購建議，股價以 $160 開市。',
  // You must sell at 100 something that costs 160: a loss of $60, less the $4 premium: -$56.
  '1sbze4773uk': '你必須以 100 賣出一樣價值 160 的東西：虧損 $60，減去 $4 期權金：-$56。',
  // Eleven wins, one loss, and you are down $12 overall. With 100 shares per contract, multiply everything by 100.
  '21v5os2vit5': '十一勝一負，整體虧損 $12。每張合約 100 股，所有數字都要乘以 100。',
  // Covered and uncovered
  'wzi8uub74p': '有備兌和無備兌',
  // A sold call is **covered** if you already own the underlying. If assigned you just hand over your shares. Risk is limited.
  '2670s92s4nd': '如果你已經持有相關資產，沽出的認購期權就是**有備兌**的。被行使時你只需交出股份。風險有限。',
  // A sold call is **uncovered** (or **naked**) if you do not. If assigned you must buy at the market price, whatever it is, and sell at the strike.
  '27ddw3ztjr2': '如果你沒有持有，沽出的認購期權就是**無備兌**的（或**裸沽**）。被行使時，你必須以市價（不論多少）買入，再以行使價賣出。',
  // A sold put is **cash-secured** if you hold enough cash to buy the underlying at the strike.
  '1w0pfjc2qz3': '如果你持有足夠現金以行使價買入相關資產，沽出的認沽期權就是**現金擔保**的。',
  // An uncovered call has unlimited risk
  '20664nujdb1': '無備兌的認購期權風險無上限',
  // There is no ceiling on how high a price can go, so there is no ceiling on the loss from a naked call. An uncovered put can lose almost the entire strike value if the underlying collapses. Brokers restrict uncovered selling to experienced accounts for this reason.
  'my3o072dtw': '價格可以升多高並沒有上限，所以裸沽認購期權的虧損也沒有上限。如果相關資產崩潰，無備兌的認沽期權可以輸掉幾乎整個行使價的價值。因此經紀只容許有經驗的帳戶做無備兌沽出。',
  // The safer ways to sell
  '1zhd0pnlo18': '較安全的沽出方法',
  // Selling is not wrong: it is how you get paid for taking a risk someone else wants to shed. The strategies later in this module (covered calls, cash-secured puts, spreads) are all ways of selling options with the loss capped.
  '5k9tw4zsd7': '沽出期權並沒有錯：這是你承擔別人想擺脫的風險而得到報酬的方式。這個單元稍後的策略（備兌認購期權、現金擔保認沽期權、價差）都是在虧損有上限的情況下沽出期權的方法。',
  // The Greeks: delta and gamma
  '2chnfhva38t': '希臘字母：Delta 和 Gamma',
  // Delta is how much the option moves when the underlying moves. Gamma is how fast delta itself changes.
  '282jxqoupu4': 'Delta 是相關資產變動時期權變動多少。Gamma 是 Delta 本身變化得有多快。',
  // An option's price responds to several things at once: the underlying price, time, volatility and interest rates. The **Greeks** measure each response separately. They are named after Greek letters and are the dashboard of options trading.
  '84awgkvps0': '期權價格同時對幾樣東西作出反應：相關資產價格、時間、波幅和利率。**希臘字母**分別量度每一種反應。它們以希臘字母命名，是期權交易的儀表板。',
  // Delta
  '164u1jb2eji': 'Delta',
  // **Delta** is how much the option price changes when the underlying moves by $1.
  '15n8rvahw5o': '**Delta** 是相關資產變動 $1 時，期權價格變動多少。',
  // Calls have a delta between 0 and +1. Puts have a delta between -1 and 0.
  '13hvoj94z5f': '認購期權的 Delta 介乎 0 至 +1。認沽期權的 Delta 介乎 -1 至 0。',
  // An at-the-money option has a delta near 0.5 (or -0.5 for a put): it moves about 50 cents for each dollar.
  '16dk9itw4r1': '價平期權的 Delta 接近 0.5（認沽期權則接近 -0.5）：相關資產每變動一元，它約變動 50 仙。',
  // A deep in-the-money option has a delta near 1: it moves almost like the stock.
  '12k0w8we9xe': '深度價內期權的 Delta 接近 1：它幾乎與股票同步移動。',
  // A far out-of-the-money option has a delta near 0: it barely reacts.
  '1szh9hvtetr': '深度價外期權的 Delta 接近 0：它幾乎沒有反應。',
  // Using delta
  '2e5dmw09jrb': '運用 Delta',
  // A call costs $5.00 with a delta of 0.60.
  '194h4nhb2dn': '一張認購期權價格 $5.00，Delta 為 0.60。',
  // The stock rises $1. The call rises about $0.60, to $5.60.
  '1z7xskgnm33': '股價上升 $1。認購期權約上升 $0.60，至 $5.60。',
  // The stock falls $2. The call falls about $1.20, to $3.80.
  '2de0221kdr3': '股價下跌 $2。認購期權約下跌 $1.20，至 $3.80。',
  // One contract of 100 shares therefore behaves like owning about 60 shares.
  'cnkqwobu5p': '因此一張 100 股的合約，表現大約像持有 60 股。',
  // Move the underlying price and watch delta change:
  '1zcmu1k8mfb': '移動相關資產價格，看看 Delta 如何變化：',
  // Delta as a rough probability
  'q3e5vqmaxx': '把 Delta 當作大概的機率',
  // Traders often read delta as the approximate chance that the option finishes in the money. A 0.25 delta call has roughly a 25% chance of ending above its strike. It is an approximation, but a handy one.
  '2eubaytd4': '交易者常把 Delta 解讀為期權到期時處於價內的大概機會。Delta 0.25 的認購期權，大約有 25% 機會收在行使價之上。這只是近似值，但很方便。',
  // Gamma
  '17bhfb20ogq': 'Gamma',
  // Delta is not fixed. As you saw on the slider, it changes as the underlying moves. **Gamma** is how much delta changes when the underlying moves by $1.
  '277i66l2rny': 'Delta 並不固定。正如你在滑桿上看到的，它會隨相關資產變動而改變。**Gamma** 是相關資產變動 $1 時，Delta 變動多少。',
  // Gamma in action
  '25m4rimbiks': 'Gamma 的實際作用',
  // A call has a delta of 0.50 and a gamma of 0.04.
  'v11u7gxiqh': '一張認購期權的 Delta 為 0.50，Gamma 為 0.04。',
  // The stock rises $1. Delta becomes about 0.54.
  'pz2fmonfi0': '股價上升 $1。Delta 變成約 0.54。',
  // The stock rises another $1. Delta becomes about 0.58, so the option is now gaining faster.
  'l4mebdqv7a': '股價再上升 $1。Delta 變成約 0.58，所以期權現在升得更快。',
  // This is why a bought option accelerates when it goes your way.
  'b7zvenlv22': '這就是為甚麼買入的期權在走勢對你有利時會加速。',
  // Gamma is highest for **at-the-money** options and falls away either side.
  '3und3d82d': '**價平**期權的 Gamma 最高，向兩邊遞減。',
  // Gamma grows as **expiry approaches**. Near expiry an at-the-money option can swing from nearly worthless to valuable on a small move.
  '2f26i33kt0w': 'Gamma 隨**到期日接近**而增大。接近到期時，價平期權可以因為一個小波動，由幾乎毫無價值變得很有價值。',
  // Option **buyers** have positive gamma: moves help them increasingly. **Sellers** have negative gamma: moves hurt them increasingly.
  '29xa8gz1ni3': '期權**買方**擁有正 Gamma：波動對他們的幫助愈來愈大。**賣方**擁有負 Gamma：波動對他們的傷害愈來愈大。',
  // Put it together
  '2brcqzekcl0': '綜合起來',
  // Delta tells you your exposure now. Gamma tells you how quickly that exposure will change. A position with high gamma needs watching, because its risk can double within a day.
  'ph5ybjar2j': 'Delta 告訴你目前的風險敞口。Gamma 告訴你這個敞口會變化得多快。Gamma 高的持倉需要密切留意，因為它的風險可以在一天內翻倍。',
  // Short gamma near expiry
  '22ri3lvj5e9': '接近到期時的負 Gamma',
  // Selling at-the-money options in their final days collects the fastest time decay, but gamma is at its peak. A small adverse move turns into a large loss very quickly.
  'n0yck7phlt': '在最後幾天沽出價平期權可以收取最快的時間值損耗，但 Gamma 也處於最高峰。一個小的不利波動很快就會變成大虧損。',
  // The Greeks: theta, vega and rho
  '27oj1lj0sud': '希臘字母：Theta、Vega 和 Rho',
  // How time, volatility and interest rates move an option price.
  '1bgulsfqfdi': '時間、波幅和利率如何推動期權價格。',
  // Theta: time decay
  'datenq9b7': 'Theta：時間值損耗',
  // **Theta** is how much value an option loses each day from the passing of time alone, with everything else unchanged. It is usually shown as a negative number for a bought option: a theta of -0.05 means the option loses about 5 cents a day.
  '222ahyhkwyw': '**Theta** 是在其他一切不變的情況下，單純因為時間流逝，期權每天損失多少價值。對買入的期權而言，它通常以負數顯示：Theta 為 -0.05 代表期權每天約損失 5 仙。',
  // Time value has to reach zero by expiry, and it does not drain evenly. **Time decay** is slow at first and accelerates in the last few weeks. Slide the days to expiry down and watch the price:
  '2511ubxxwb6': '時間值必須在到期時歸零，而且它並不是平均地流失。**時間值損耗**起初很慢，在最後幾星期加速。把距離到期的日數向下拖，看看價格：',
  // Theta is largest for **at-the-money** options, which hold the most time value.
  '28tvxo62h3b': '**價平**期權的 Theta 最大，因為它們持有最多的時間值。',
  // It accelerates as expiry nears: an option can lose a third of its value in its last week.
  '4j0f2dirxa': '它隨到期日接近而加速：一張期權可以在最後一星期損失三分之一的價值。',
  // Option **buyers** pay theta every day. Option **sellers** collect it.
  '1j3qtx91bhd': '期權**買方**每天支付 Theta。期權**賣方**每天收取它。',
  // What theta costs
  '10bx0l9vn9l': 'Theta 的成本',
  // You buy a 30-day at-the-money call for $3.00 with a theta of -0.05.
  '11lx8dibs54': '你以 $3.00 買入一張 30 日到期、Theta 為 -0.05 的價平認購期權。',
  // The stock does nothing for a week.
  '2clzg12gft7': '股價一星期都沒有動。',
  // The option is now worth about $2.60: you lost 13% with the stock unchanged.
  'g01b86ajjj': '期權現在約值 $2.60：股價不變，你卻輸了 13%。',
  // To profit, the stock has to move enough, soon enough, to outrun the decay.
  'rdi8ffxbje': '要獲利，股價必須夠快地走得夠遠，才能跑贏損耗。',
  // Vega: sensitivity to volatility
  '1l0uobimxr2': 'Vega：對波幅的敏感度',
  // **Vega** is how much the option price changes when implied volatility changes by one percentage point. Implied volatility, covered next lesson, is the market's estimate of how much the underlying will move.
  '22ojix5uktd': '**Vega** 是引伸波幅變動一個百分點時，期權價格變動多少。引伸波幅（下一課會講）是市場對相關資產將會波動多少的估計。',
  // Higher expected volatility makes every option more valuable, calls and puts alike, because bigger moves mean a bigger chance of a large payoff. Raise the volatility slider:
  '2elxpi6c2g1': '預期波幅愈高，每一張期權（認購和認沽都一樣）就愈有價值，因為波動愈大，獲得大回報的機會就愈大。調高波幅滑桿：',
  // Vega is largest for **at-the-money** options with a **long time** to expiry.
  '151p9ho6jj6': '**價平**而且距離到期**時間長**的期權，Vega 最大。',
  // Option **buyers** are long vega: they gain if volatility rises.
  '6aq0qkfiex': '期權**買方**是做多 Vega：波幅上升他們就獲利。',
  // Option **sellers** are short vega: they gain if volatility falls.
  '2fnpiba7ifo': '期權**賣方**是做空 Vega：波幅下降他們就獲利。',
  // Vega in action
  '135258692du': 'Vega 的實際作用',
  // A call costs $4.00 with a vega of 0.12. Implied volatility is 30%.
  '1v96uayltc9': '一張認購期權價格 $4.00，Vega 為 0.12。引伸波幅為 30%。',
  // Volatility rises to 35%: the call gains about 5 x 0.12 = $0.60, to $4.60, with the stock unchanged.
  'zgjj9e9075': '波幅升到 35%：股價不變，認購期權約上升 5 x 0.12 = $0.60，至 $4.60。',
  // Volatility falls to 22%: the call loses about 8 x 0.12 = $0.96, to $3.04.
  'nxumw1c62': '波幅跌到 22%：認購期權約下跌 8 x 0.12 = $0.96，至 $3.04。',
  // Rho: sensitivity to interest rates
  'wgulscddg2': 'Rho：對利率的敏感度',
  // **Rho** is how much the option price changes when interest rates change by one percentage point. Higher rates raise call prices slightly and lower put prices slightly. For options lasting a few weeks or months the effect is small, and rho is the Greek traders watch least.
  '5q8vz5n8t9': '**Rho** 是利率變動一個百分點時，期權價格變動多少。利率較高會令認購期權價格略升、認沽期權價格略跌。對於為期幾星期或幾個月的期權，影響很小，Rho 也是交易者最少留意的希臘字母。',
  // The five together
  'xnaue63yl8': '五個一起看',
  // **Delta**: direction. How much do I make if the price moves $1?
  '1nzz2dbuazl': '**Delta**：方向。價格變動 $1，我賺多少？',
  // **Gamma**: how fast does that change?
  'vrmigkibn1': '**Gamma**：它變化得有多快？',
  // **Theta**: what does waiting cost me per day?
  'rwhj1m2xns': '**Theta**：等待每天要付出多少？',
  // **Vega**: what happens if the market gets more or less nervous?
  '22yfrarns3u': '**Vega**：如果市場變得更緊張或更平靜會怎樣？',
  // **Rho**: what if interest rates change? (Usually: not much.)
  '1p8ofrjmqf8': '**Rho**：如果利率改變會怎樣？（通常：影響不大。）',
  // The basic trade-off
  '1ed9vmw01in': '基本的取捨',
  // Buying options means positive gamma and vega but paying theta: you want something to happen, soon. Selling options means collecting theta but being short gamma and vega: you want nothing to happen.
  '24p0sxr62e6': '買入期權代表擁有正 Gamma 和 Vega，但要支付 Theta：你希望有事情發生，而且要快。沽出期權代表收取 Theta，但做空 Gamma 和 Vega：你希望甚麼都不發生。',
  // The Greeks are estimates
  'gh9xrtr1rr': '希臘字母只是估算',
  // Each Greek assumes only one thing changes, by a small amount. In real markets everything moves at once, and a large move makes the numbers stale. Treat them as a guide to direction and rough size.
  'fcl7bt67qf': '每個希臘字母都假設只有一樣東西小幅改變。在真實市場中一切同時變動，大波動會令這些數字過時。把它們當作方向和大概幅度的指引。',
  // Implied volatility
  '29ivb7ryav0': '引伸波幅',
  // The market's forecast of movement, built into every option price. Often what you are really trading.
  '2bmu6e58hsc': '市場對波動的預測，內置於每一個期權價格中。往往是你真正在交易的東西。',
  // **Volatility** is how much a price moves around, given as an annual percentage. A stock with 20% volatility typically ends a year within about 20% of where it started, up or down.
  '2fdoafh1yl7': '**波幅**是價格上下波動的程度，以年化百分比表示。一隻波幅 20% 的股票，一年後通常會在起點上下約 20% 之內。',
  // Historical and implied
  'm8yadxuxlz': '歷史波幅和引伸波幅',
  // **Historical volatility** (HV) is measured from past prices. It tells you how much the underlying **has** moved.
  '10d5ig9ugu7': '**歷史波幅**（HV）由過去的價格量度。它告訴你相關資產**已經**波動了多少。',
  // **Implied volatility** (IV) is worked out backwards from option prices. It is the volatility that, put into a pricing model, gives the price the option is actually trading at. It tells you how much the market **expects** the underlying to move.
  'x4ocoa5du3': '**引伸波幅**（IV）由期權價格倒推計算。它是代入定價模型後，能得出期權實際交易價格的那個波幅。它告訴你市場**預期**相關資產會波動多少。',
  // IV is the one input to an option price that cannot be looked up. So in practice the market sets option prices by supply and demand, and IV is how traders express whether those prices are high or low.
  '2cvhr1e4hjk': '引伸波幅是期權價格中唯一一個無法查到的輸入。所以實際上市場以供求決定期權價格，而引伸波幅就是交易者表達這些價格是高是低的方式。',
  // Change the volatility and watch the option price respond:
  'mepypkq4k5': '改變波幅，看看期權價格如何反應：',
  // High and low IV
  '2e1majcoe8': '高引伸波幅和低引伸波幅',
  // **High IV**: options are expensive. The market expects big moves, usually because of an upcoming event or recent turmoil.
  '1rxclczegx4': '**高引伸波幅**：期權昂貴。市場預期會有大波動，通常是因為即將發生的事件或近期的動盪。',
  // **Low IV**: options are cheap. The market expects calm.
  '1yf5j8hu6t9': '**低引伸波幅**：期權便宜。市場預期會平靜。',
  // Compare IV with its own history for that underlying, not with other stocks. 40% is high for a utility and low for a small biotech.
  '22sdevpn15c': '應該把引伸波幅與該相關資產自己的歷史比較，而不是與其他股票比較。40% 對公用股來說很高，對細價生物科技股來說卻很低。',
  // When IV is well above historical volatility, options are pricing in more movement than has recently occurred.
  '1olm7ff4ift': '當引伸波幅遠高於歷史波幅，期權反映的波動多於近期實際出現的。',
  // IV crush
  'wvy4xoc6f9': '引伸波幅急跌',
  // Before a scheduled event with an unknown outcome, such as a company's earnings report, IV rises because a jump is likely. The moment the news is out, the uncertainty is gone and IV collapses. This is **IV crush**.
  '1wgho5zy5yb': '在結果未知的預定事件（例如公司公佈業績）之前，引伸波幅會上升，因為很可能出現跳動。消息一公佈，不確定性就消失，引伸波幅隨即崩潰。這就是**引伸波幅急跌**。',
  // Right about direction, still losing
  '16n46az2d5a': '方向判斷正確，仍然虧損',
  // A stock is at $100 the day before earnings. IV is 80%. You buy a one-week 100 call for $4.50.
  '15gogh97dob': '一隻股票在公佈業績前一天價格 $100。引伸波幅 80%。你以 $4.50 買入一張一星期到期、行使價 100 的認購期權。',
  // Earnings are good. The stock opens at $103.
  '1u9t8ncwwx2': '業績很好。股價以 $103 開市。',
  // IV drops from 80% to 35% now the news is known.
  '19emsiiql9o': '消息公佈後，引伸波幅由 80% 跌到 35%。',
  // The call is worth about $3.75: intrinsic value of 3 plus less than a dollar of time value. You lost about a sixth of your money on a correct call.
  'u8sg4mskms': '認購期權約值 $3.75：內在價值 3，加不到一元的時間值。你判斷正確，卻輸掉了約六分之一的錢。',
  // Option prices before an event already include the expected jump. To profit as a buyer, the move has to be bigger than the market priced in.
  '293etbh2xxx': '事件之前的期權價格已經包含了預期的跳動。作為買方要獲利，走勢必須大於市場已反映的幅度。',
  // The volatility smile
  '2fs8611qsb6': '波幅微笑',
  // If you work out IV for every strike at one expiry, it is not the same across them. Plotted against strike, IV is usually lowest near the money and higher for far out-of-the-money options, tracing a curve called the **volatility smile**. In stock markets it is lopsided, with downside puts carrying the highest IV, which is called the **skew**.
  '1kls5sw0fd7': '如果你計算同一到期日每一個行使價的引伸波幅，它們並不相同。以行使價為橫軸畫出，引伸波幅通常在價平附近最低，在深度價外期權較高，形成一條叫**波幅微笑**的曲線。在股票市場它是不對稱的，下方的認沽期權引伸波幅最高，這叫**波幅偏斜**。',
  // It exists because large moves, especially crashes, happen more often than simple models assume, so people pay extra for protection against them.
  'ivacduu437': '它之所以存在，是因為大波動（尤其是崩市）比簡單模型假設的更常發生，所以人們願意為防範它們付出額外的價錢。',
  // Before buying or selling an option
  '1ish1uwaf2a': '買入或沽出期權之前',
  // Check whether IV is high or low for that underlying. Buying when IV is high means paying a lot for movement that may already be expected. Selling when IV is low means being paid little for the risk.
  'ab8y9x1pht': '檢查該相關資產的引伸波幅是高是低。在引伸波幅高時買入，代表為可能已在預期之內的波動付出高價。在引伸波幅低時沽出，代表承擔風險卻只收到很少報酬。',
  // High IV is not free money for sellers
  '1d3oiaa3kpj': '高引伸波幅對賣方來說並不是免費的錢',
  // IV is high when the market sees real risk. Selling expensive options before an event collects a large premium, and occasionally the event produces a move far larger than anyone priced.
  '1x4vus445fg': '當市場看到真正的風險，引伸波幅才會高。在事件前沽出昂貴的期權可以收取大筆期權金，但偶爾事件會帶來遠超任何人預料的波動。',
  // Strategies: single options and options with stock
  'np25qpw3xo': '策略：單一期權及期權配合股票',
  // Long call, long put, covered call, cash-secured put and protective put: the five building blocks.
  'mokq0baigt': '買入認購期權、買入認沽期權、備兌認購期權、現金擔保認沽期權和保護性認沽期權：五個基本組件。',
  // An option **strategy** is one or more options, sometimes combined with the underlying, chosen to fit a view. Each bought or sold option is called a **leg**. For every strategy, know four things before you trade: when to use it, the maximum profit, the maximum loss, and the break-even.
  'hxqajuu3dw': '期權**策略**是一張或多張期權（有時配合相關資產），按某個看法挑選組合而成。每一張買入或沽出的期權叫一條**腳**。每個策略在交易前都要知道四件事：何時使用、最大盈利、最大虧損和損益平衡點。',
  // All examples use a stock at $100. Premiums are per share.
  '1y691b4txoj': '所有例子都以價格 $100 的股票計算。期權金以每股計。',
  // Long call
  '21dvxyyvlow': '買入認購期權',
  // **When**: you expect a clear rise, soon.
  '2f9p8oeojuc': '**何時用**：你預期價格很快會明顯上升。',
  // **Max profit**: unlimited.
  '1t2f6j2hu33': '**最大盈利**：無上限。',
  // **Max loss**: the premium paid.
  '26zgfq311xg': '**最大虧損**：已付的期權金。',
  // **Break-even**: strike + premium.
  'cov8ms0irj': '**損益平衡點**：行使價 + 期權金。',
  // Long call: buy the 100 call for 4
  '1wkbt96ejrb': '買入認購期權：以 4 買入行使價 100 的認購期權',
  // Long put
  '1x1ki972wlz': '買入認沽期權',
  // **When**: you expect a clear fall, soon.
  '1k27gfhu41h': '**何時用**：你預期價格很快會明顯下跌。',
  // **Max profit**: strike - premium (if the price goes to zero).
  'yanj3w4ps9': '**最大盈利**：行使價 - 期權金（如果價格跌到零）。',
  // **Break-even**: strike - premium.
  '1j7746d7mcp': '**損益平衡點**：行使價 - 期權金。',
  // Long put: buy the 100 put for 4
  '20uqkkeqpsu': '買入認沽期權：以 4 買入行使價 100 的認沽期權',
  // Covered call
  'ohcl7dv8dw': '備兌認購期權',
  // You own the stock and **sell** a call against it, usually out of the money. You collect premium in exchange for agreeing to sell your shares at the strike.
  'kk2rhze1ss': '你持有股票並以它**沽出**一張認購期權，通常是價外的。你收取期權金，作為同意以行使價賣出股份的交換。',
  // **When**: you own the stock and expect it to go sideways or rise a little.
  'f526vm9etd': '**何時用**：你持有股票，並預期它橫行或小幅上升。',
  // **Max profit**: (strike - stock cost) + premium. The upside is capped at the strike.
  '2g1yje9j0x8': '**最大盈利**：（行使價 - 股票成本）+ 期權金。上升空間在行使價封頂。',
  // **Max loss**: stock cost - premium (if the stock goes to zero).
  '25s0wn8d0hz': '**最大虧損**：股票成本 - 期權金（如果股價跌到零）。',
  // **Break-even**: stock cost - premium.
  'xp9k6ufef2': '**損益平衡點**：股票成本 - 期權金。',
  // Covered call: own stock at 100, sell the 110 call for 3
  '275w9ppzfwp': '備兌認購期權：在 100 持有股票，以 3 沽出行使價 110 的認購期權',
  // Cash-secured put
  'ye05zuq8j3': '現金擔保認沽期權',
  // You **sell** a put and keep enough cash to buy the stock at the strike if assigned. Either the put expires worthless and you keep the premium, or you buy the stock at a discount to today's price.
  'oax3xppbq1': '你**沽出**一張認沽期權，並保留足夠現金在被行使時以行使價買入股票。要麼認沽期權到期時毫無價值，你保留期權金；要麼你以低於今日的價格買入股票。',
  // **When**: you would be happy to own the stock at a lower price.
  '1ne39pugumc': '**何時用**：你樂意以較低價格持有這隻股票。',
  // **Max profit**: the premium received.
  'ff7t8qaipf': '**最大盈利**：收到的期權金。',
  // **Max loss**: strike - premium (if the stock goes to zero).
  '2ee5uz01on8': '**最大虧損**：行使價 - 期權金（如果股價跌到零）。',
  // Cash-secured put: sell the 95 put for 3
  '1ni7k9r9eol': '現金擔保認沽期權：以 3 沽出行使價 95 的認沽期權',
  // Same shape
  '1oo42ktahv8': '形狀相同',
  // Compare the covered call and the cash-secured put. Their diagrams are nearly identical: limited gain, large downside. Both are ways of being paid to take the risk of owning the stock.
  '183fnue5ds9': '比較備兌認購期權和現金擔保認沽期權。兩者的損益圖幾乎一模一樣：盈利有限，下跌風險很大。兩者都是收取報酬去承擔持有股票的風險。',
  // Protective put
  'owo28c4kkj': '保護性認沽期權',
  // You own the stock and **buy** a put below the current price. It works like insurance: whatever happens, you can sell at the strike.
  '1y9mym1vyz3': '你持有股票並**買入**一張低於現價的認沽期權。它就像保險：無論發生甚麼，你都可以按行使價賣出。',
  // **When**: you own the stock, want to keep it, and fear a drop.
  'qiwyyuxjwe': '**何時用**：你持有股票、想繼續持有，但擔心它下跌。',
  // **Max profit**: unlimited (the stock gain, less the premium).
  'ilmwo84kt7': '**最大盈利**：無上限（股票的升幅減去期權金）。',
  // **Max loss**: (stock cost - strike) + premium.
  '280twgu6w2r': '**最大虧損**：（股票成本 - 行使價）+ 期權金。',
  // **Break-even**: stock cost + premium.
  '2jdaspmq94': '**損益平衡點**：股票成本 + 期權金。',
  // Protective put: own stock at 100, buy the 95 put for 3
  '1vnw8rjj7b6': '保護性認沽期權：在 100 持有股票，以 3 買入行使價 95 的認沽期權',
  // Insurance has a price
  '1izznwr4p95': '保險是有價錢的',
  // A protective put costs premium every time you buy one. Held continuously it can eat several percent of the position each year. It makes most sense around specific risks.
  '224j4ykei10': '每次買入保護性認沽期權都要付期權金。如果持續持有，每年可以蠶食持倉幾個百分點。在面對特定風險時使用最合理。',
  // Build them yourself
  '27qpco4q931': '自己動手建立',
  // The Options page has a strategy builder with these templates. It draws the payoff diagram and shows maximum profit, maximum loss and break-evens for whatever legs you add.
  '1xkw0qvhpd3': '期權頁有一個附帶這些範本的策略設定。無論你加入甚麼期權腳，它都會畫出損益圖，並顯示最大盈利、最大虧損和損益平衡點。',
  // Strategies: vertical spreads, straddles and strangles
  'uee0n6s6x2': '策略：垂直價差、跨式和勒束式',
  // Spreads cap both risk and reward. Straddles and strangles bet on movement in either direction.
  'nft5jg9ngg': '價差同時限制風險和回報。跨式和勒束式押注任何方向的波動。',
  // Vertical spreads
  'brgse6iyo1': '垂直價差',
  // A **vertical spread** buys one option and sells another of the same type and expiry at a different strike. The sold option pays for part of the bought one. In exchange, the profit is capped. Both the maximum gain and the maximum loss are known up front.
  '2bfevjrz71p': '**垂直價差**買入一張期權，同時沽出另一張同類型、同到期日但不同行使價的期權。沽出的期權支付了買入那張的部分成本。作為交換，盈利有上限。最大盈利和最大虧損都預先知道。',
  // Bull call spread (a debit spread)
  '18z9vkbrrto': '牛市認購價差（淨支出價差）',
  // Buy a call, sell a higher-strike call. You pay a net premium, called a **debit**.
  '1xs22t0hs6u': '買入一張認購期權，沽出一張行使價較高的認購期權。你支付淨期權金，叫**淨支出**。',
  // **When**: you expect a moderate rise.
  '13biwphqbjw': '**何時用**：你預期價格溫和上升。',
  // **Max profit**: (difference between strikes) - net debit.
  '1r6tv8y56ks': '**最大盈利**：（行使價之差）- 淨支出。',
  // **Max loss**: the net debit.
  '1t090auh8hh': '**最大虧損**：淨支出。',
  // **Break-even**: lower strike + net debit.
  '1086wradl6x': '**損益平衡點**：較低行使價 + 淨支出。',
  // Bull call spread: buy the 100 call for 5, sell the 110 call for 2
  'bzu60j9e2x': '牛市認購價差：以 5 買入行使價 100 的認購期權，以 2 沽出行使價 110 的認購期權',
  // Net debit 3. Max loss 3, max profit 10 - 3 = 7, break-even 103. Compare with the plain long call at a cost of 5: cheaper, with a lower break-even, but no gain beyond 110.
  '1ao86r4pjsh': '淨支出 3。最大虧損 3，最大盈利 10 - 3 = 7，損益平衡點 103。與成本 5 的單純買入認購期權相比：較便宜、損益平衡點較低，但 110 以上沒有額外盈利。',
  // Bear put spread
  '1w0qmps9d7l': '熊市認沽價差',
  // The bearish mirror image: buy a put, sell a lower-strike put.
  't5ron4qsml': '看跌的鏡像：買入一張認沽期權，沽出一張行使價較低的認沽期權。',
  // **When**: you expect a moderate fall.
  '22a9he3nvo5': '**何時用**：你預期價格溫和下跌。',
  // **Break-even**: higher strike - net debit.
  'uo5onkyjww': '**損益平衡點**：較高行使價 - 淨支出。',
  // Bear put spread: buy the 100 put for 5, sell the 90 put for 2
  'cpzh5teynl': '熊市認沽價差：以 5 買入行使價 100 的認沽期權，以 2 沽出行使價 90 的認沽期權',
  // Credit spreads
  '10pqxzx4uxi': '淨收入價差',
  // Turn either spread around and you receive a net premium, a **credit**, instead of paying one. A **bull put spread** sells a put and buys a lower-strike put: you keep the credit if the price stays above the sold strike. The maximum loss is the difference between strikes minus the credit. It is a way of selling options with the risk capped.
  '1846pam7yjx': '把任何一個價差反過來，你就會收到淨期權金，即**淨收入**，而不是付出。**牛市認沽價差**沽出一張認沽期權並買入一張行使價較低的認沽期權：只要價格保持在沽出的行使價之上，你就保留淨收入。最大虧損是行使價之差減淨收入。這是在風險有上限的情況下沽出期權的方法。',
  // Bull put spread: sell the 95 put for 3, buy the 90 put for 1.5
  '10lgmrjr58m': '牛市認沽價差：以 3 沽出行使價 95 的認沽期權，以 1.5 買入行使價 90 的認沽期權',
  // Long straddle
  '1rmfdpedfpo': '買入跨式',
  // Buy a call **and** a put at the same strike and expiry. You do not care which way the price goes, only that it goes far.
  'g78dqmlses': '以相同行使價和到期日買入一張認購期權**和**一張認沽期權。你不在乎價格向哪邊走，只在乎它走得夠遠。',
  // **When**: you expect a big move but do not know the direction, and implied volatility is not already high.
  '2ghe1ui9a7t': '**何時用**：你預期會有大波動但不知道方向，而且引伸波幅還未高企。',
  // **Max profit**: unlimited upwards; large downwards.
  '7y9bblzpr5': '**最大盈利**：向上無上限；向下很大。',
  // **Max loss**: both premiums.
  '2dxphdywb2e': '**最大虧損**：兩份期權金。',
  // **Break-evens**: strike + total premium, and strike - total premium.
  'gnmye6tec0': '**損益平衡點**：行使價 + 總期權金，以及行使價 - 總期權金。',
  // Long straddle: buy the 100 call for 4 and the 100 put for 4
  'iai1ko4otr': '買入跨式：以 4 買入行使價 100 的認購期權，以 4 買入行使價 100 的認沽期權',
  // Long strangle
  'q1h9k1cjby': '買入勒束式',
  // The same idea with out-of-the-money options: buy a call above the price and a put below it. It is cheaper than a straddle, but the price has to move further before you profit.
  '1z0dsxzv08p': '同一個概念，但用價外期權：買入高於現價的認購期權和低於現價的認沽期權。它比跨式便宜，但價格要走得更遠你才能獲利。',
  // **When**: you expect a very large move in either direction.
  '16vfcw4lda2': '**何時用**：你預期任何一個方向都會有極大的波動。',
  // **Break-evens**: call strike + total premium, and put strike - total premium.
  'na2k959m5s': '**損益平衡點**：認購行使價 + 總期權金，以及認沽行使價 - 總期權金。',
  // Long strangle: buy the 105 call for 2 and the 95 put for 2
  '1gvxw1j236x': '買入勒束式：以 2 買入行使價 105 的認購期權，以 2 買入行使價 95 的認沽期權',
  // Straddles before earnings usually disappoint
  'lxoddkxxrw': '業績前買入跨式通常令人失望',
  // Buying a straddle before an event feels safe because direction does not matter. But the options already price in the expected move, and implied volatility collapses afterwards. The stock has to move more than the market expected for the straddle to pay.
  'nvseu0kqxe': '在事件前買入跨式感覺很安全，因為方向不重要。但期權早已反映預期的波動，而且事件後引伸波幅會崩潰。股價的波動必須大於市場預期，跨式才會賺錢。',
  // Selling straddles and strangles
  '1kmh45zc29g': '沽出跨式和勒束式',
  // The opposite trades, a short straddle or short strangle, profit when the price stays still. Their losses are unlimited, so they are not for beginners. The iron condor in the next lesson is the capped version.
  'dr53pa0gn0': '相反的交易，即沽出跨式或沽出勒束式，在價格靜止不動時獲利。它們的虧損沒有上限，所以不適合新手。下一課的鐵兀鷹就是有上限的版本。',
  // Strategies: iron condor, butterfly and calendar spread
  '1i441edi61a': '策略：鐵兀鷹、蝶式和日曆價差',
  // Three ways to profit when the price stays put, each with the loss capped.
  '6bbcn9vmfk': '三種在價格不動時獲利的方法，每種虧損都有上限。',
  // These strategies make money when the underlying goes **nowhere**. They are built from the spreads in the previous lesson, so every one has a defined maximum loss.
  'mk2ed5jk69': '這些策略在相關資產**原地不動**時賺錢。它們由上一課的價差組成，所以每一種都有明確的最大虧損。',
  // Iron condor
  '5odpkfb7ws': '鐵兀鷹',
  // Sell an out-of-the-money put spread **and** an out-of-the-money call spread at the same time. Four legs:
  '1blstpegcfy': '同時沽出價外的認沽價差**和**價外的認購價差。共四條腳：',
  // Buy a far out-of-the-money put (protection).
  '1nofrbhutxz': '買入一張深度價外的認沽期權（保護）。',
  // Sell a put below the price.
  '1ut8ih35kob': '沽出一張低於現價的認沽期權。',
  // Sell a call above the price.
  'sx2lnuzgek': '沽出一張高於現價的認購期權。',
  // Buy a far out-of-the-money call (protection).
  '1qjrguskaja': '買入一張深度價外的認購期權（保護）。',
  // **When**: you expect the price to stay inside a range until expiry, and implied volatility is fairly high.
  '10jy6fdol0j': '**何時用**：你預期價格在到期前會留在一個區間內，而且引伸波幅頗高。',
  // **Max profit**: the net credit, kept if the price ends between the two sold strikes.
  '1p9nhhajjkn': '**最大盈利**：淨收入，在價格收在兩個沽出行使價之間時保留。',
  // **Max loss**: (width of one spread) - net credit.
  '1gjlpjg4ae6': '**最大虧損**：（一個價差的闊度）- 淨收入。',
  // **Break-evens**: sold put strike - credit, and sold call strike + credit.
  '2fzs3lf0vi7': '**損益平衡點**：沽出的認沽行使價 - 收入，以及沽出的認購行使價 + 收入。',
  // Iron condor: buy 85 put for 1, sell 90 put for 2.5, sell 110 call for 2.5, buy 115 call for 1
  'shhhkuy5o': '鐵兀鷹：以 1 買入 85 認沽期權，以 2.5 沽出 90 認沽期權，以 2.5 沽出 110 認購期權，以 1 買入 115 認購期權',
  // Net credit 3. The profit zone is wide, from 87 to 113. But note the proportions: you risk 2 to make 3 here, and with narrower, more typical pricing you often risk more than you can make. Iron condors win often and lose bigger.
  '1a5mtkm4yej': '淨收入 3。獲利區很闊，由 87 至 113。但留意比例：這裡你冒 2 的風險去賺 3，而在較窄、較典型的定價下，你承受的風險往往比可賺的多。鐵兀鷹經常贏，輸就輸得更大。',
  // Long butterfly
  'm347nt0uvq': '買入蝶式',
  // Buy one lower-strike call, sell two middle-strike calls, buy one higher-strike call, with the strikes evenly spaced. The payoff is a tent with its peak at the middle strike.
  'f52a6tynsi': '買入一張較低行使價的認購期權，沽出兩張中間行使價的認購期權，買入一張較高行使價的認購期權，行使價間距相等。損益圖像一個帳篷，頂點在中間行使價。',
  // **When**: you expect the price to finish very close to a particular level.
  '2c7208312kb': '**何時用**：你預期價格會收在非常接近某個水平的位置。',
  // **Max profit**: (distance between strikes) - net debit, if the price ends exactly at the middle strike.
  'm1h7d4lge7': '**最大盈利**：（行使價之間的距離）- 淨支出，在價格剛好收在中間行使價時。',
  // **Break-evens**: lower strike + debit, and upper strike - debit.
  'anrvsgr4he': '**損益平衡點**：較低行使價 + 支出，以及較高行使價 - 支出。',
  // Long call butterfly: buy 90 call for 11.5, sell two 100 calls for 4.5 each, buy 110 call for 1
  '1o3kvowsmpq': '買入認購蝶式：以 11.5 買入 90 認購期權，每張以 4.5 沽出兩張 100 認購期權，以 1 買入 110 認購期權',
  // Net debit 3.5. It costs little and can pay up to 6.5, but only if the price lands near 100. It is a precise, low-cost bet on calm.
  'hv8yfhtm8z': '淨支出 3.5。它成本很低，最多可賺 6.5，但只限於價格落在 100 附近。這是一個精準、低成本的押注，賭市場平靜。',
  // Calendar spread
  '1s0l27srsvu': '日曆價差',
  // Sell a near-term option and buy a longer-term option at the **same strike**. Both are calls, or both puts.
  '1ak3gsiu9xd': '以**相同行使價**沽出近期期權並買入遠期期權。兩張都是認購期權，或兩張都是認沽期權。',
  // **When**: you expect the price to stay near the strike for now, and perhaps move later.
  '2dnwi9607wh': '**何時用**：你預期價格暫時會留在行使價附近，之後或者會移動。',
  // **How it profits**: the near option decays faster than the far one (theta accelerates near expiry), so the spread widens in your favour.
  '23lliwc3t3a': '**如何獲利**：近期期權的時間值損耗比遠期期權快（Theta 在接近到期時加速），所以價差會向對你有利的方向擴大。',
  // **Max loss**: the net debit paid.
  '1eflm579rwl': '**最大虧損**：已付的淨支出。',
  // **Max profit**: when the price is at the strike as the near option expires. The exact amount depends on the implied volatility of the remaining option.
  '2fajdphh5qv': '**最大盈利**：在近期期權到期時價格剛好在行使價。確實金額視乎剩餘期權的引伸波幅。',
  // A calendar has two expiry dates, so it cannot be drawn as a single expiry payoff. Its value when the near option expires depends on what the far option is still worth. The strategy builder on the Options page prices it for you.
  'z1h4a3o2f4': '日曆價差有兩個到期日，所以無法畫成單一到期日的損益圖。近期期權到期時，它的價值取決於遠期期權當時還值多少。期權頁的策略設定會替你計算價格。',
  // Calendars like rising volatility
  'ne1tg6xthj': '日曆價差喜歡波幅上升',
  // The long-dated option has more vega than the short-dated one, so a calendar gains if implied volatility rises and loses if it falls. That makes it the opposite of an iron condor in its response to volatility.
  '27o0p9ip1f2': '遠期期權的 Vega 比近期期權大，所以引伸波幅上升時日曆價差獲利，下降時虧損。這令它對波幅的反應與鐵兀鷹相反。',
  // Choosing between them
  '1fjxeqjnqrw': '如何在它們之間選擇',
  // **Iron condor**: a wide range, collect premium, short vega.
  '31elikj1up': '**鐵兀鷹**：闊的區間，收取期權金，做空 Vega。',
  // **Butterfly**: a narrow target, pay a small debit, large reward if exactly right.
  '15j8sr24upq': '**蝶式**：窄的目標，付少量支出，判斷剛好正確時回報很大。',
  // **Calendar**: a narrow target now, pay a debit, long vega.
  'sx6hv74zyr': '**日曆價差**：現在窄的目標，付出支出，做多 Vega。',
  // Many legs, many costs
  'riqhwr97c5': '腳愈多，成本愈多',
  // A four-leg strategy pays the spread and fees four times to open and up to four times to close. On small accounts these costs can take most of the expected profit.
  '78tkk71edy': '四條腳的策略，開倉時要付四次差價和手續費，平倉時最多也要四次。對細小的帳戶來說，這些成本可以吃掉大部分預期盈利。',
  // End of the options module
  '213efwkgyy9': '期權單元完結',
  // You now know the vocabulary, the Greeks and the common strategies. The Options page lets you build any of these on simulated prices and trade them on paper.
  '2db4mxxci2b': '你現在已掌握詞彙、希臘字母和常見策略。期權頁讓你用模擬價格建立任何這些策略，並以模擬交易買賣。',
  // A call option gives its buyer the right to:
  '10r90khcn7d': '認購期權賦予買方的權利是：',
  // Sell the underlying at the strike
  '23wt6s00rsp': '以行使價賣出相關資產',
  // Buy the underlying at the strike
  'gfki4vsdxc': '以行使價買入相關資產',
  // Borrow the underlying
  '588rg98ji9': '借入相關資產',
  // Receive dividends
  '2gdmycld0yj': '收取股息',
  // A call is the right to buy. A put is the right to sell.
  '1y9bqoxytdy': '認購期權是買入的權利。認沽期權是賣出的權利。',
  // What is the most a buyer of an option can lose?
  '19zv99dja8b': '期權買方最多可能輸多少？',
  // Nothing
  '2109u9fst05': '甚麼都不會輸',
  // The premium paid
  'h38adcwp47': '已付的期權金',
  // The strike price
  'tusw7aej8u': '行使價',
  // An unlimited amount
  '1k4qvjsn78v': '無限的金額',
  // The buyer has a right, not an obligation. If it is not worth using, they lose only what they paid.
  'kbenzhnixz': '買方擁有權利，而不是義務。如果不值得行使，他們只會輸掉付出的金額。',
  // You buy a 50-strike call for a premium of 2. What is the break-even at expiry?
  '24gl6yrmmpf': '你以期權金 2 買入行使價 50 的認購期權。到期時的損益平衡點是多少？',
  // Break-even for a long call is strike plus premium: 50 + 2 = 52.
  '2c5n0zn962q': '買入認購期權的損益平衡點是行使價加期權金：50 + 2 = 52。',
  // You buy a 100-strike put for 3. At expiry the stock is at 90. Your profit per share is:
  'aapt0gmaqd': '你以 3 買入行使價 100 的認沽期權。到期時股價為 90。你每股的盈利是：',
  // The put is worth 100 - 90 = 10. Less the 3 premium: 7.
  '1o4mzxik5wj': '認沽期權值 100 - 90 = 10。減去 3 的期權金：7。',
  // A stock rises 2% over the month, but your call still loses money. The most likely reason:
  '1isz5b3clqy': '一隻股票在一個月內上升了 2%，但你的認購期權仍然虧損。最可能的原因是：',
  // The stock did not rise enough to cover the premium
  '1025utfb0s7': '股價升幅不足以抵銷期權金',
  // Calls lose when stocks rise
  'qageaxk4ph': '股票上升時認購期權會虧損',
  // The exchange made an error
  '1za3ojxa5om': '交易所出錯',
  // The strike changed
  '1llh7t8i395': '行使價改變了',
  // The price must move past the break-even, before expiry, for the buyer to profit.
  'zhm68dnq7w': '價格必須在到期前越過損益平衡點，買方才會獲利。',
  // A stock is at 108. What is the intrinsic value of a 100-strike call?
  '1xugtuvf4cv': '一隻股票價格 108。行使價 100 的認購期權內在價值是多少？',
  // Call intrinsic value = underlying - strike = 108 - 100 = 8.
  'ezk8zakz14': '認購期權內在價值 = 相關資產價格 - 行使價 = 108 - 100 = 8。',
  // That call trades at 11. What is its time value?
  'sajf5g8435': '那張認購期權以 11 交易。它的時間值是多少？',
  // Premium = intrinsic + time value, so time value = 11 - 8 = 3.
  '2fhf919q1rm': '期權金 = 內在價值 + 時間值，所以時間值 = 11 - 8 = 3。',
  // A stock is at 100. A put with a strike of 90 is:
  '1zwuv56e5i8': '一隻股票價格 100。行使價 90 的認沽期權是：',
  // In the money
  'h03ooqasp4': '價內',
  // At the money
  'kom9u126pt': '價平',
  // Out of the money
  '26h6mziwupl': '價外',
  // Expired
  '1jc0jxqtima': '已到期',
  // A put is out of the money when the strike is below the price: selling at 90 is worse than selling at 100.
  '186qt0o7vhs': '認沽期權的行使價低於現價時就是價外：以 90 賣出比以 100 賣出差。',
  // What happens to time value at expiry?
  '1qna9lt3mpq': '到期時時間值會怎樣？',
  // It doubles
  '1lzjojr1jnc': '翻倍',
  // It becomes zero
  '1s74f5x9ne': '變成零',
  // It equals the strike
  '1emba4pox1u': '等於行使價',
  // It is paid to the buyer
  'ucwbqj9sop': '付給買方',
  // With no time left there is no chance of further gain, so only intrinsic value remains.
  'dcqw8paheh': '沒有剩餘時間，就沒有進一步獲利的機會，所以只剩下內在價值。',
  // What does "assignment" mean?
  '1dmc6s94sy6': '「被行使」是甚麼意思？',
  // The buyer chooses a strike
  '15x2t8hgbre': '買方選擇行使價',
  // A seller is required to fulfil the contract because a buyer exercised
  '15p5gapbum': '因為買方行使了期權，賣方必須履行合約',
  // The option is listed on an exchange
  '23bpn3ga7s0': '期權在交易所上市',
  // The premium is refunded
  'vhunwfid6r': '期權金被退回',
  // When a buyer exercises, a seller of that option must take the other side.
  '1l8ustxzypt': '當買方行使時，該期權的一個賣方必須承擔另一方。',
  // A European-style option can be exercised:
  'wapbn8o2a8': '歐式期權可以在何時行使：',
  // Only in Europe
  '24fkqmo271d': '只能在歐洲',
  // At any time before expiry
  'bzqjimzvv9': '到期前任何時候',
  // Only at expiry
  '169t6xtswgt': '只能在到期時',
  // Never
  '221ct4go232': '永遠不能',
  // European-style means exercise at expiry only. American-style means any day up to expiry.
  'zi738iur4j': '歐式代表只能在到期時行使。美式代表到期前任何一天都可以。',
  // What is the maximum profit for the seller of an option?
  'lv8wgnpvu8': '期權賣方的最大盈利是多少？',
  // Unlimited
  '21l5rpcq28w': '無上限',
  // The premium received
  '1t1dicgagxv': '收到的期權金',
  // Zero
  't6c2ao04dd': '零',
  // The seller is paid the premium up front and can never make more than that.
  '14q1aqdadst': '賣方預先收取期權金，永遠不能賺得比這更多。',
  // Why is an uncovered (naked) call so dangerous?
  '1eby69chmqy': '為甚麼無備兌（裸沽）的認購期權這麼危險？',
  // The premium is too small
  '1wcwac1zy8c': '期權金太少',
  // There is no limit to how high the price can go, so no limit to the loss
  'fhslbehrvs': '價格可以升多高沒有上限，所以虧損也沒有上限',
  // It cannot be closed
  'mhp4gy9t8i': '它不能平倉',
  // It always expires in the money
  'c3junqufsl': '它到期時一定是價內',
  // The seller must deliver at the strike something that could cost any amount to buy.
  'p6wuw1erxk': '賣方必須以行使價交付一樣可能要花任何價錢才能買到的東西。',
  // A sold call is "covered" when the seller:
  '1zwfc1xdgbf': '沽出的認購期權在賣方怎樣時算是「有備兌」：',
  // Has a stop-loss
  '1thgxiwldp6': '有止蝕',
  // Already owns the underlying
  'kqgh7f9o1d': '已經持有相關資產',
  // Has bought insurance
  'vgrnlms0kr': '買了保險',
  // Uses cross margin
  '1baa4t8x6w7': '使用全倉保證金',
  // If assigned they hand over shares they already own, so the risk is limited.
  '1wgedrmyaqc': '被行使時他們交出已持有的股份，所以風險有限。',
  // Option sellers win most of the time. Why can they still lose money overall?
  'w885gxdcf1': '期權賣方大部分時間都會贏。為甚麼他們整體上仍可能虧錢？',
  // Fees are high
  'yrig181ly0': '手續費很高',
  // The occasional loss can be many times larger than the premiums collected
  'mm0cglg68s': '偶爾一次的虧損可以比收取的期權金大很多倍',
  // They are taxed more
  'rts9m2srz0': '他們要交更多稅',
  // They cannot
  '47jmi62yb1': '他們不會虧錢',
  // Many small wins and a rare very large loss is the typical profile of selling options.
  '29lbyi9fufz': '很多小勝利加上罕見的巨大虧損，是沽出期權的典型表現。',
  // How does the passing of time affect buyer and seller?
  'asxdqk8h56': '時間流逝如何影響買方和賣方？',
  // It helps both
  '7ruriefrce': '對兩者都有幫助',
  // It hurts the buyer and helps the seller
  '6xmobx8c81': '對買方不利，對賣方有利',
  // It helps the buyer and hurts the seller
  '1adtmet8s46': '對買方有利，對賣方不利',
  // It affects neither
  '1b9rinsmgwx': '對兩者都沒有影響',
  // Time value decays every day. The buyer paid for it; the seller keeps it.
  '1cdq01zkigz': '時間值每天都在損耗。買方為它付了錢；賣方則保留它。',
  // A call has a delta of 0.40. The stock rises $2. The call gains about:
  '10hn82q6z30': '一張認購期權的 Delta 為 0.40。股價上升 $2。認購期權約上升：',
  // Delta x move = 0.40 x 2 = $0.80.
  '10s94ixbtjd': 'Delta x 變動 = 0.40 x 2 = $0.80。',
  // Which option has a delta closest to 1?
  'ey7ch2kmpq': '哪一張期權的 Delta 最接近 1？',
  // Far out of the money call
  '1moz3ttcp9b': '深度價外的認購期權',
  // At the money call
  'yauqycy093': '價平的認購期權',
  // Deep in the money call
  '1urtxeg0nc0': '深度價內的認購期權',
  // Any put
  '1zgt9rzntn8': '任何認沽期權',
  // A deep ITM call moves almost one-for-one with the underlying.
  'edfu0q07d8': '深度價內的認購期權幾乎與相關資產一比一同步移動。',
  // A put's delta is:
  'jft0g2m1qd': '認沽期權的 Delta：',
  // Between 0 and +1
  '13m5bu7solk': '介乎 0 至 +1',
  // Between -1 and 0
  '1w6zf3d4i3l': '介乎 -1 至 0',
  // Always exactly -1
  'hg4mygspvb': '永遠剛好是 -1',
  // Always 0
  '4hwbo4z883': '永遠是 0',
  // Puts gain when the underlying falls, so their delta is negative.
  '1dm9mt235cy': '認沽期權在相關資產下跌時獲利，所以它的 Delta 是負數。',
  // What does gamma measure?
  '15hdjsvnagv': 'Gamma 量度甚麼？',
  // How fast the option loses value over time
  'qb381iwb9o': '期權隨時間損失價值的速度',
  // How much delta changes when the underlying moves $1
  'tlod4tpdvn': '相關資產變動 $1 時，Delta 變動多少',
  // Sensitivity to interest rates
  'pwib9dd3pq': '對利率的敏感度',
  // The premium
  '6dk9iud2jj': '期權金',
  // Gamma is the rate of change of delta.
  '1jl75b0pze8': 'Gamma 是 Delta 的變化率。',
  // Where is gamma highest?
  'j024jb4306': 'Gamma 在哪裡最高？',
  // Deep in the money, far from expiry
  '1g0nqw64hp8': '深度價內、距離到期很遠',
  // At the money, close to expiry
  '1t0q1ecozpy': '價平、接近到期',
  // Far out of the money
  '1ykvb516oqb': '深度價外',
  // It is constant
  '233hmyv1rz3': '它是固定的',
  // Near expiry an at-the-money option flips quickly between worthless and valuable, so delta changes fast.
  '208nkj2bmvr': '接近到期時，價平期權會在毫無價值和很有價值之間快速轉換，所以 Delta 變化得很快。',
  // An option has a theta of -0.08. With everything else unchanged, tomorrow it will be worth about:
  '2d3u5y4a2sk': '一張期權的 Theta 為 -0.08。在其他一切不變的情況下，明天它約值：',
  // 8 cents more
  '1yhpw6dlj62': '多 8 仙',
  // 8 cents less
  '1tdkcgysk2s': '少 8 仙',
  // The same
  'w70htjf19w': '一樣',
  // 8% less
  '3k4h4qtz83': '少 8%',
  // Theta is the value lost per day from time passing alone.
  '280v3ya9zx6': 'Theta 是單純因為時間流逝而每天損失的價值。',
  // How does time decay behave as expiry approaches?
  'aygdj9gv9j': '隨著到期日接近，時間值損耗會怎樣？',
  // It slows down
  'g50b4f7i51': '放慢',
  // It stays constant
  '11h66gd5uv4': '保持不變',
  // It accelerates
  '1g4hbi89xgp': '加速',
  // It reverses
  '1tm8g68k2n4': '逆轉',
  // Time value drains slowly at first and fastest in the final weeks.
  '17ab2e92748': '時間值起初流失得慢，在最後幾星期流失得最快。',
  // Implied volatility rises 5 points. An option with a vega of 0.10 changes by about:
  '1ui42tebr13': '引伸波幅上升 5 點。Vega 為 0.10 的期權約變動：',
  // Vega x change = 0.10 x 5 = +$0.50. Higher volatility raises both calls and puts.
  'qz1pfl944w': 'Vega x 變動 = 0.10 x 5 = +$0.50。波幅較高會令認購和認沽期權都升值。',
  // Who benefits when implied volatility falls?
  '1tz8hbvtqy8': '引伸波幅下降時誰會受惠？',
  // Option buyers
  'zzhs0bd5wx': '期權買方',
  // Option sellers
  'y7j2rplod0': '期權賣方',
  // Both
  '54949phuur': '兩者',
  // Neither
  '1xlfibnn70k': '兩者都不會',
  // Sellers are short vega: the options they sold become cheaper to buy back.
  'pfakefg2n3': '賣方做空 Vega：他們沽出的期權變得更便宜，買回成本降低。',
  // Which Greek matters least for short-dated options?
  'bhvfe2b3f6': '對短期期權來說，哪個希臘字母最不重要？',
  // Theta
  '23n06h34gwi': 'Theta',
  // Vega
  '1pnmtk9nf8p': 'Vega',
  // Rho
  '1y1usra0akk': 'Rho',
  // Interest-rate changes have little effect on options lasting weeks or a few months.
  '12vboxzm9aq': '利率變化對為期幾星期或幾個月的期權影響很小。',
  // What is implied volatility?
  '284fgqix5vs': '甚麼是引伸波幅？',
  // How much the underlying moved last year
  '22ymwigb5lu': '相關資產去年波動了多少',
  // The volatility implied by current option prices: the market's expected movement
  '1mlzubyclsv': '由目前期權價格引伸出來的波幅：市場預期的波動',
  // The daily change in the option price
  '1zpjncfqghm': '期權價格的每日變化',
  // A fee
  'xkwq8k9xcy': '一種費用',
  // IV is worked out backwards from option prices and reflects expectations.
  '1q018v6ndtq': '引伸波幅由期權價格倒推計算，反映市場的預期。',
  // High implied volatility means options are:
  '222tlve7l4p': '引伸波幅高代表期權：',
  // Cheap
  '4l4rahx5st': '便宜',
  // Expensive
  '1w7yv6f6gyn': '昂貴',
  // Unavailable
  '1hikkpwixsm': '買不到',
  // About to expire
  'twe74tfa73': '即將到期',
  // The market expects large moves, so both calls and puts cost more.
  '1bq6lhweg26': '市場預期會有大波動，所以認購和認沽期權都更貴。',
  // What is IV crush?
  'ynmrc8b54y': '甚麼是引伸波幅急跌？',
  // A stock price crash
  'ecqiwiy0nl': '股價崩潰',
  // A sharp fall in implied volatility once an awaited event has passed
  '8e6eohgtqb': '期待已久的事件過去後，引伸波幅急跌',
  // A broker margin call
  '193g6e8di4m': '經紀追收保證金',
  // Options being delisted
  '2ca2p475n3e': '期權被除牌',
  // The uncertainty that inflated option prices is gone, so IV drops.
  '2ano703h66n': '推高期權價格的不確定性消失了，所以引伸波幅下跌。',
  // You buy a call before earnings. The stock rises 2% but your call loses value. Why?
  'yhxjdq7nwv': '你在業績公佈前買入認購期權。股價上升 2%，但你的認購期權卻貶值。為甚麼？',
  // The fall in implied volatility outweighed the gain from the price move
  '1e0422woixi': '引伸波幅的下跌抵銷了價格變動帶來的收益',
  // Earnings cancel options
  'nmkjuit46x': '業績會取消期權',
  // The strike moved
  '2ax9twvr1tw': '行使價移動了',
  // Option prices already included the expected jump. The move was smaller than priced in.
  '17yi6f7owua': '期權價格早已包含預期的跳動。實際波動小於已反映的幅度。',
  // What does the volatility smile describe?
  '16728zyemz2': '波幅微笑描述的是甚麼？',
  // IV being the same at every strike
  '1dr633tkvzj': '每個行使價的引伸波幅都相同',
  // IV being higher for strikes far from the current price
  '107o5tx01o7': '離現價愈遠的行使價，引伸波幅愈高',
  // Options expiring happily
  '23edyxvavaf': '期權愉快地到期',
  // A chart pattern
  '7b2sklpdbx': '一種圖表形態',
  // Far OTM options, especially downside puts, carry higher IV because big moves are more common than simple models assume.
  '29dnyffqsfh': '深度價外期權（尤其是下方的認沽期權）引伸波幅較高，因為大波動比簡單模型假設的更常見。',
  // Which strategy has unlimited profit and a loss limited to the premium?
  '16207s0k55t': '哪一個策略盈利無上限、虧損限於期權金？',
  // Short call
  'ynyuq0p4n3': '沽出認購期權',
  // A bought call gains as far as the price rises and can lose only what was paid.
  's389ss6rm': '買入的認購期權在價格上升時一直獲利，最多只會輸掉付出的金額。',
  // You own stock at 100 and sell a 110 call for 3. Your maximum profit per share is:
  '1xv4xzxdsxr': '你在 100 持有股票，以 3 沽出 110 認購期權。你每股的最大盈利是：',
  // You gain 10 on the stock up to the strike plus the 3 premium. Above 110 the shares are called away.
  '1w2t62annnr': '股票升到行使價可賺 10，再加 3 的期權金。高於 110 時股份會被收走。',
  // A cash-secured put is suitable when you:
  '1c7157ax0ef': '現金擔保認沽期權適合當你：',
  // Expect a crash
  '22d3whjj77a': '預期會崩市',
  // Would be happy to buy the stock at a lower price
  '2834mr6kor2': '樂意以較低價格買入這隻股票',
  // Want unlimited upside
  '25iyze1b5hi': '想要無限的上升空間',
  // Own the stock already and want to sell
  '28q2neodrj2': '已經持有股票並想賣出',
  // Either you keep the premium, or you buy the stock at the strike, effectively at a discount.
  '177egfcing7': '要麼你保留期權金，要麼你以行使價買入股票，實際上是折讓價。',
  // A protective put works like:
  '1kym5zgvy2a': '保護性認沽期權的作用像：',
  // A loan
  'c1ha5f2zbc': '一筆貸款',
  // Insurance on stock you own
  '17jf0ghkcvm': '為你持有的股票買保險',
  // A short sale
  '2f2cxco56yl': '沽空',
  // A dividend
  'dvcj0celgm': '股息',
  // You pay a premium for the right to sell at the strike whatever happens.
  '27b8g7di2f9': '你付出期權金，換取無論發生甚麼都能以行使價賣出的權利。',
  // You own stock at 100 and buy a 95 put for 3. Your maximum loss per share is:
  '1bxmvo0rfew': '你在 100 持有股票，以 3 買入 95 認沽期權。你每股的最大虧損是：',
  // You can always sell at 95: a 5 loss on the stock plus the 3 premium.
  '7cjt9i458q': '你永遠可以在 95 賣出：股票虧 5，加上 3 的期權金。',
  // You buy a 100 call for 5 and sell a 110 call for 2. Your maximum loss is:
  '1eunrx64mdv': '你以 5 買入 100 認購期權，以 2 沽出 110 認購期權。你的最大虧損是：',
  // The net debit: 5 - 2 = 3.
  '9npsd2tx01': '淨支出：5 - 2 = 3。',
  // In the same spread, the maximum profit is:
  '8wdwkk1y8q': '同一個價差中，最大盈利是：',
  // Difference between strikes minus the debit: 10 - 3 = 7.
  '49o8n2qvfc': '行使價之差減支出：10 - 3 = 7。',
  // What does a spread give up compared with a single bought option?
  '1wnn10766fl': '與單一買入的期權相比，價差放棄了甚麼？',
  // The limited loss
  '2f2yt5l5u08': '有限的虧損',
  // Profit beyond the sold strike
  '17m1073f52y': '超出沽出行使價的盈利',
  // The right to exercise
  '1s3uhbv341j': '行使的權利',
  // The sold option pays for part of the trade and caps the gain.
  '1ogsc5fzabl': '沽出的期權支付了交易的部分成本，並封頂了盈利。',
  // When does a long straddle make money?
  '20pf8j15t4b': '買入跨式在甚麼時候賺錢？',
  // When the price stays still
  '271428mxqo7': '價格靜止不動時',
  // When the price moves far in either direction
  'iyod4aq526': '價格向任何方向大幅移動時',
  // Only when the price rises
  '1jtfv1wfif5': '只在價格上升時',
  // Only when volatility falls
  'df8hq3l57e': '只在波幅下降時',
  // It holds both a call and a put, so it needs a move bigger than the combined premium.
  '6bkqarcqef': '它同時持有認購和認沽期權，所以需要比總期權金更大的波動。',
  // You buy a 100 call for 4 and a 100 put for 4. What are the break-evens?
  'zn2g1ssvb': '你以 4 買入 100 認購期權，以 4 買入 100 認沽期權。損益平衡點是多少？',
  // 96 and 104
  '105td4lr89h': '96 及 104',
  // 92 and 108
  '23h1d5fgxty': '92 及 108',
  // 100 only
  '3t24kd4635': '只有 100',
  // 88 and 112
  '1851vy1aog0': '88 及 112',
  // Strike plus and minus the total premium of 8.
  '1gkpg11ankc': '行使價加減總期權金 8。',
  // How does a strangle differ from a straddle?
  '1rj5j96kphv': '勒束式與跨式有甚麼不同？',
  // It uses out-of-the-money options at two strikes: cheaper, but needs a bigger move
  'f3dsm42kbv': '它使用兩個行使價的價外期權：較便宜，但需要更大的波動',
  // It has unlimited loss
  '22z3xyupxmx': '它的虧損無上限',
  // It only uses puts
  '1oxgbu10lmp': '它只用認沽期權',
  // It profits from no movement
  'wf2o62sbtl': '它在沒有波動時獲利',
  // A strangle costs less and needs the price to travel further.
  'w14pofjza2': '勒束式成本較低，需要價格走得更遠。',
  // An iron condor makes its maximum profit when the price at expiry is:
  '2141m8spm58': '鐵兀鷹在到期價格處於哪裡時獲得最大盈利？',
  // Above the highest strike
  '12zjs3nqlsx': '高於最高的行使價',
  // Below the lowest strike
  't3xqm56x1p': '低於最低的行使價',
  // Between the two sold strikes
  '24aq2exi7b0': '介乎兩個沽出的行使價之間',
  // Exactly at zero
  'wb9p82am0o': '剛好是零',
  // All four options expire worthless and you keep the net credit.
  '2dv7nu353ya': '四張期權全部到期時毫無價值，你保留淨收入。',
  // An iron condor has spreads 5 wide and collects a credit of 2. The maximum loss is:
  '6336e6j3bh': '一個鐵兀鷹的價差闊度為 5，收取淨收入 2。最大虧損是：',
  // Spread width minus credit: 5 - 2 = 3.
  '1cqr3ydtev5': '價差闊度減收入：5 - 2 = 3。',
  // A long butterfly pays the most when the price ends:
  '172ct7z2lec': '買入蝶式在價格收在哪裡時回報最大：',
  // Far above the upper strike
  '9ykarh42pg': '遠高於較高行使價',
  // Exactly at the middle strike
  '4wa27l9c6r': '剛好在中間行使價',
  // Far below the lower strike
  '2bg9umnnsop': '遠低於較低行使價',
  // Anywhere
  'rbj9ewyirn': '任何地方',
  // The payoff is a tent with its peak at the middle strike.
  '1dd0z0lvk26': '損益圖像一個帳篷，頂點在中間行使價。',
  // How does a calendar spread make money?
  '9onf5s5hn0': '日曆價差怎樣賺錢？',
  // The near-term option decays faster than the longer-term one
  '1tmgj6xk9t4': '近期期權的損耗比遠期期權快',
  // From a large move in either direction
  '5ijdxzcgeo': '從任何方向的大波動中',
  // From interest payments
  '2cvo9xc2t86': '從利息收入中',
  // From dividends
  '1qmgeda19yd': '從股息中',
  // Time decay accelerates near expiry, so the sold near option loses value faster than the bought far one.
  '1jhmoatrnyv': '時間值損耗在接近到期時加速，所以沽出的近期期權比買入的遠期期權損失價值更快。',
  // Which of these gains if implied volatility rises?
  'tu3irs6ty3': '以下哪一個會在引伸波幅上升時獲利？',
  // Short straddle
  '1fiwgn1bdn': '沽出跨式',
  // The long-dated option in a calendar has more vega than the short-dated one sold against it.
  'tar6pihv6e': '日曆價差中的遠期期權，Vega 比沽出的近期期權大。',
} satisfies Record<string, string>;

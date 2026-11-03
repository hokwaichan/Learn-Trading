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
  // An **option** gives its buyer the **right, but not the obligation**, to buy or sell an **underlying** (a stock, index or coin) at a fixed price by a fixed date. Like a deposit on a house: if prices rise you buy at the old price; if they fall you walk away and lose only the deposit.
  '11x49w6fcax': '**期權**給予買方在固定日期或之前，以固定價格買入或賣出**相關資產**（股票、指數或加密貨幣）的**權利，但沒有義務**。就像買樓的訂金：樓價上升，你以舊價買入；下跌就放棄，只輸掉訂金。',
  // A **call** is the right to **buy**. Calls gain when the underlying rises.
  '187p7pmzi3k': '**認購期權**是**買入**的權利。相關資產上升時認購期權升值。',
  // A **put** is the right to **sell**. Puts gain when the underlying falls.
  '15ptszr0dyg': '**認沽期權**是**賣出**的權利。相關資產下跌時認沽期權升值。',
  // Long call
  '21dvxyyvlow': '買入認購期權',
  // Long put
  '1x1ki972wlz': '買入認沽期權',
  // Profit at expiry against the final share price. The most a buyer loses is the premium.
  'ccrve7odvk': '到期時的盈虧與最終股價的關係。買方最多輸掉期權金。',
  // **Strike price**: the fixed price to buy (call) or sell (put) at.
  '2e1d4oeri09': '**行使價**：買入（認購）或賣出（認沽）的固定價格。',
  // **Expiry**: when the right ends.
  '213nknsw2vm': '**到期日**：權利結束的日子。',
  // **Premium**: the price of the option, paid up front, and the most the buyer can lose.
  'pcd3vds6h1': '**期權金**：期權本身的價格，預先支付，也是買方最多會輸的金額。',
  // **Contract size**: stock options usually cover 100 shares, so a $3 premium costs $300.
  'cvngdpqdsy': '**合約大小**：股票期權通常代表 100 股，所以 $3 的期權金要付 $300。',
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
  // Drag the price at expiry on this **payoff diagram**:
  'kpp5x4dew8': '在這個**損益圖**上拖動到期時的價格：',
  // Long call: strike 100, premium 4
  '1z64o1iwv59': '買入認購期權：行使價 100，期權金 4',
  // Below the strike you lose the premium and no more; above it the line rises one-for-one. It crosses zero at the **break-even**, strike plus premium: 104.
  '1s2axgb43uj': '低於行使價時你輸掉期權金，不會更多；高於行使價後，線條一比一上升。它在**損益平衡點**（行使價加期權金：104）穿過零。',
  // Long put: strike 100, premium 4
  'z5c8sxevfv': '買入認沽期權：行使價 100，期權金 4',
  // The put is the mirror image, breaking even at strike minus premium, 96.
  '1vzpwvk5buu': '認沽期權是鏡像，損益平衡點是行使價減期權金：96。',
  // Being right is not enough
  '8t7e9doww5': '判斷正確並不足夠',
  // A bought option needs the right direction, far enough, soon enough. A move one week after expiry earns nothing.
  '1hzdqvoit4s': '買入的期權需要方向對、幅度夠、來得及時。到期後一星期才出現的走勢毫無收穫。',
  // What an option is worth
  '1u8dfizt8dg': '期權值多少',
  // Intrinsic value, time value, in and out of the money, and what happens at exercise and assignment.
  '2277j7rwm4g': '內在價值、時間值、價內和價外，以及行使和被行使時會發生甚麼。',
  // A premium has two parts. **Intrinsic value** is what the option is worth if used right now, never below zero. **Time value** is the rest: what buyers pay for the chance it gains before expiry. More time and more volatility mean more time value; at expiry it is zero.
  '1nzgtp0h1my': '期權金分兩部分。**內在價值**是此刻行使的價值，永不低於零。**時間值**是其餘部分：買家為到期前升值的機會而付的錢。時間越長、波幅越大，時間值越高；到期時為零。',
  // Call intrinsic value = max(0, underlying - strike) Put intrinsic value = max(0, strike - underlying)
  '1f9kh2ouzex': '認購期權內在價值 = max(0, 相關資產價格 - 行使價)\n認沽期權內在價值 = max(0, 行使價 - 相關資產價格)',
  // Stock at 108, 100-strike call: intrinsic 8. Stock at 95, same call: intrinsic 0.
  'ugkorwfy04': '股價 108，行使價 100 的認購期權：內在價值 8。股價 95，同一張認購期權：內在價值 0。',
  // Premium = intrinsic value + time value
  '20wb89gjzwo': '期權金 = 內在價值 + 時間值',
  // Stock at 108, 100-strike call trading at 11: intrinsic 8, time value 3.
  '18t3ac1h2zr': '股價 108，行使價 100 的認購期權以 11 交易：內在價值 8，時間值 3。',
  // **In the money (ITM)**: has intrinsic value.
  '2e02filbu0': '**價內（ITM）**：有內在價值。',
  // In the money
  'h03ooqasp4': '價內',
  // **At the money (ATM)**: strike near the price; the most time value.
  'dr635t97gq': '**價平（ATM）**：行使價接近現價；時間值最多。',
  // At the money
  'kom9u126pt': '價平',
  // **Out of the money (OTM)**: no intrinsic value; all time value.
  '2ec7480sp25': '**價外（OTM）**：沒有內在價值；全部是時間值。',
  // Out of the money
  '26h6mziwupl': '價外',
  // To **exercise** is to use the right; the seller who must take the other side is **assigned**. Most traders sell the option back instead, which keeps the time value. **American-style** options can be exercised any day; **European-style** only at expiry.
  'mwxg3pv7mf': '**行使**是使用權利；必須接手另一邊的賣方就是**被行使**。大部分交易者會把期權賣回市場，保留時間值。**美式**期權任何一日都可行使；**歐式**只可在到期時行使。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // Option prices here are simulated with the Black-Scholes model, which prices European-style options. So in the simulator, exercise and assignment happen only at expiry.
  '1s5ekq4cu0o': '這裡的期權價格用柏力克－舒爾斯模型模擬，它為歐式期權定價。所以在模擬器中，行使和被行使只在到期時發生。',
  // Out-of-the-money options look cheap for a reason
  '1u0g488o590': '價外期權看起來便宜是有原因的',
  // A far OTM option at $0.20 will very probably expire worthless. Buying lots of them loses money slowly and reliably.
  '19l1urmmp7v': '$0.20 的遠價外期權很可能到期時毫無價值。大量買入它們會穩定地慢慢虧錢。',
  // Buying vs selling options
  '2cgcgwyr8jp': '買入與沽出期權',
  // Buyers have limited risk and need a move. Sellers collect premium and take on the risk, which can be unlimited.
  '1srqsvtf0kk': '買方風險有限，需要走勢出現。賣方收取期權金並承擔風險，風險可以是無限的。',
  // Every option has a buyer and a seller, the **writer**. Whatever one makes, the other loses.
  'ee39bph5s0': '每份期權都有買方和賣方，即**沽出者**。一方賺多少，另一方就輸多少。',
  // **Buyer**: pays the premium, has a right, loses at most the premium, and loses time value every day.
  '3q8y5uvp3c': '**買方**：支付期權金，擁有權利，最多輸掉期權金，每天損失時間值。',
  // **Seller**: receives the premium, has an obligation, gains at most the premium, and can lose far more.
  '1xefhd1rtz8': '**賣方**：收取期權金，承擔義務，最多賺期權金，卻可能輸得多很多。',
  // Short call
  'ynyuq0p4n3': '沽出認購期權',
  // Short put
  '1inzeupwefw': '沽出認沽期權',
  // The seller keeps the premium if the option expires worthless. Past the strike, losses keep growing.
  '1mcrj1qa3ld': '期權到期時毫無價值，賣方就保留期權金。超過行使價後，虧損不斷擴大。',
  // Short call: strike 100, premium 4 (uncovered)
  '1zxh3d6hsbf': '沽出認購期權：行使價 100，期權金 4（無備兌）',
  // Most options expire worthless, so sellers win most of the time, until one big move wipes out many premiums:
  '18cuz3vijm4': '大部分期權到期時毫無價值，所以賣方大部分時間都贏，直到一次大走勢抹去多次期權金：',
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
  // A sold call is **covered** if you own the underlying: risk is limited.
  '2revbdfj23': '如果你持有相關資產，沽出的認購期權是**有備兌**的：風險有限。',
  // A sold call is **uncovered** (**naked**) if you do not: you must buy at any price to deliver.
  'bse45hnfxe': '如果沒有，就是**無備兌**（**裸沽**）：你必須以任何價格買入來交收。',
  // A sold put is **cash-secured** if you hold the cash to buy at the strike.
  '83gsxc2ini': '如果你持有足夠現金在行使價買入，沽出的認沽期權就是**現金擔保**的。',
  // An uncovered call has unlimited risk
  '20664nujdb1': '無備兌的認購期權風險無上限',
  // There is no ceiling on price, so none on the loss. Brokers restrict uncovered selling for this reason.
  '1kg01k49o18': '價格沒有上限，所以虧損也沒有上限。經紀因此限制無備兌沽出。',
  // The safer ways to sell
  '1zhd0pnlo18': '較安全的沽出方法',
  // Covered call
  'ohcl7dv8dw': '備兌認購期權',
  // Covered calls, cash-secured puts and spreads, later in this module, all sell options with the loss capped.
  '1trxpg9p656': '備兌認購期權、現金擔保認沽期權和價差（本單元稍後會講）都是限制虧損的沽出方式。',
  // The Greeks: delta and gamma
  '2chnfhva38t': '希臘字母：Delta 和 Gamma',
  // Delta is how much the option moves when the underlying moves. Gamma is how fast delta itself changes.
  '282jxqoupu4': 'Delta 是相關資產變動時期權變動多少。Gamma 是 Delta 本身變化得有多快。',
  // Delta
  '164u1jb2eji': 'Delta',
  // The **Greeks** measure how an option price responds to each input separately: price, time, volatility and rates.
  'eisxykb5nc': '**希臘字母**分別量度期權價格對每個因素的反應：價格、時間、波幅和利率。',
  // **Delta** is how much the option moves when the underlying moves $1. Calls run 0 to +1, puts -1 to 0. At the money it is about 0.5; deep in the money near 1; far out of the money near 0.
  '1gw8kpzbmle': '**Delta** 是相關資產變動 $1 時期權變動多少。認購期權介乎 0 至 +1，認沽期權 -1 至 0。價平約 0.5；深價內接近 1；遠價外接近 0。',
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
  // Traders also read delta as a rough chance of finishing in the money: a 0.25 delta call has about a 25% chance.
  '5kuttjj6qi': '交易者也把 Delta 看作到期時處於價內的大約機率：Delta 0.25 的認購期權約有 25% 機會。',
  // **Gamma** is how much delta changes per $1 move. It is highest at the money and grows as expiry nears.
  '1rgtrdh8qab': '**Gamma** 是價格每變動 $1 時 Delta 的變化。它在價平時最高，並隨到期日接近而上升。',
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
  // Buyers have positive gamma, so moves help them more and more. Sellers have negative gamma, so moves hurt them more and more.
  '1zybpy8spkj': '買方的 Gamma 是正數，走勢對他們越來越有利。賣方的 Gamma 是負數，走勢對他們越來越不利。',
  // Short gamma near expiry
  '22ri3lvj5e9': '接近到期時的負 Gamma',
  // Selling at-the-money options in their last days collects the fastest decay, with gamma at its peak. A small adverse move becomes a big loss quickly.
  'cgm5dsddaa': '在最後幾天沽出價平期權，收取最快的時間值損耗，但 Gamma 正處於高峰。小小的逆向走勢會迅速變成大虧損。',
  // The Greeks: theta, vega and rho
  '27oj1lj0sud': '希臘字母：Theta、Vega 和 Rho',
  // How time, volatility and interest rates move an option price.
  '1bgulsfqfdi': '時間、波幅和利率如何推動期權價格。',
  // **Theta** is the value an option loses each day from time alone. A theta of -0.05 is about 5 cents a day. **Time decay** is slow at first and speeds up in the last weeks:
  '20pq5zszzp7': '**Theta** 是期權單純因時間流逝每天損失的價值。Theta -0.05 約等於每天 5 仙。**時間值損耗**起初緩慢，在最後幾星期加速：',
  // Theta
  '23n06h34gwi': 'Theta',
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
  // **Vega** is the change in price when implied volatility moves one percentage point. Higher expected volatility makes calls and puts both dearer:
  '1cl7avu8c63': '**Vega** 是引伸波幅變動一個百分點時期權價格的變化。預期波幅越高，認購和認沽期權都越貴：',
  // Vega
  '1pnmtk9nf8p': 'Vega',
  // Vega in action
  '135258692du': 'Vega 的實際作用',
  // A call costs $4.00 with a vega of 0.12. Implied volatility is 30%.
  '1v96uayltc9': '一張認購期權價格 $4.00，Vega 為 0.12。引伸波幅為 30%。',
  // Implied volatility
  '29ivb7ryav0': '引伸波幅',
  // Volatility rises to 35%: the call gains about 5 x 0.12 = $0.60, to $4.60, with the stock unchanged.
  'zgjj9e9075': '波幅升到 35%：股價不變，認購期權約上升 5 x 0.12 = $0.60，至 $4.60。',
  // Volatility falls to 22%: the call loses about 8 x 0.12 = $0.96, to $3.04.
  'nxumw1c62': '波幅跌到 22%：認購期權約下跌 8 x 0.12 = $0.96，至 $3.04。',
  // **Rho** is the response to a one-point change in interest rates. For options of a few weeks or months it is small.
  '1n2fqo50gbb': '**Rho** 是利率變動一個百分點時的反應。對於幾星期或幾個月的期權，影響很小。',
  // Rho
  '1y1usra0akk': 'Rho',
  // **Delta**: what do I make if the price moves $1?
  '16gvttknbzc': '**Delta**：價格變動 $1 時我賺多少？',
  // **Gamma**: how fast does that change?
  'vrmigkibn1': '**Gamma**：它變化得有多快？',
  // **Theta**: what does waiting cost per day?
  '1w2cz98qrm4': '**Theta**：每等一天要付出多少？',
  // **Vega**: what if the market gets more or less nervous?
  '2da7gs2p8v1': '**Vega**：市場變得更緊張或更平靜會怎樣？',
  // **Rho**: what if rates change? (Usually: not much.)
  '6sdddb869v': '**Rho**：利率改變會怎樣？（通常：影響不大。）',
  // The basic trade-off
  '1ed9vmw01in': '基本的取捨',
  // Buyers have gamma and vega but pay theta: they want something to happen, soon. Sellers collect theta but are short gamma and vega: they want nothing to happen.
  '1jhycmagxwd': '買方擁有 Gamma 和 Vega，但要付 Theta：他們希望事情盡快發生。賣方收取 Theta，但持有負 Gamma 和負 Vega：他們希望甚麼都不發生。',
  // The Greeks are estimates
  'gh9xrtr1rr': '希臘字母只是估算',
  // Each assumes one small change at a time. Big moves make them stale; treat them as a rough guide.
  '1vddfzdd12d': '每個都假設一次只有一個小變化。大幅走勢會令它們過時；把它們當作粗略指引。',
  // The market's forecast of movement, built into every option price. Often what you are really trading.
  '2bmu6e58hsc': '市場對波動的預測，內置於每一個期權價格中。往往是你真正在交易的東西。',
  // **Volatility** is how much a price moves, as a yearly percentage. **Historical volatility** (HV) measures what the underlying **has** done. **Implied volatility** (IV) is worked backwards from option prices: what the market **expects**.
  '2g1wclhx0pl': '**波幅**是價格移動的幅度，以年度百分比表示。**歷史波幅**（HV）量度相關資產**已經**怎樣移動。**引伸波幅**（IV）由期權價格倒推出來：市場**預期**的移動。',
  // A line chart of the VIX volatility index from 2004 to 2019, spiking to about 60 in 2008 and lower peaks later
  '1hea4o81ghm': 'VIX 波幅指數 2004 至 2019 年的線圖，2008 年急升至約 60，之後高峰較低',
  // The VIX, the implied volatility of S&P 500 options. It spikes in panics such as 2008 and sinks in calm years.
  '1kwywgkfzy7': 'VIX，即標普 500 期權的引伸波幅。在 2008 年等恐慌時急升，在平靜年份回落。',
  // **High IV**: expensive options. The market expects big moves, often an event or turmoil.
  '1h8aif28icv': '**高引伸波幅**：期權昂貴。市場預期大幅走勢，通常因為事件或動盪。',
  // **Low IV**: cheap options. The market expects calm.
  'pfdhn11a1v': '**低引伸波幅**：期權便宜。市場預期平靜。',
  // Compare IV with its own history: 40% is high for a utility and low for a small biotech.
  '235ql5itwc1': '與它自己的歷史比較：40% 對公用股是高，對小型生物科技股是低。',
  // Before an event such as earnings, IV rises. Once the news is out it collapses: **IV crush**.
  'q69h40ra65': '在業績等事件之前，引伸波幅上升。消息公佈後隨即崩跌：**引伸波幅急跌**。',
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
  // IV differs by strike. Plotted against strike it usually curves up away from the money: the **volatility smile**. In stocks downside puts are highest, the **skew**, because crashes happen more than simple models assume.
  '17u32f0wan6': '不同行使價的引伸波幅不同。按行使價畫出來，通常越遠離價平越高：**波幅微笑**。在股票市場，下方的認沽期權最高，即**波幅偏斜**，因為大跌出現的次數比簡單模型假設的多。',
  // A U-shaped curve of implied volatility against strike price, lowest in the middle
  'n2tuxfkxpn': '一條引伸波幅對行使價的 U 形曲線，中間最低',
  // The volatility smile: options far from the current price carry higher implied volatility.
  '21hrwwke8b6': '波幅微笑：遠離現價的期權有較高的引伸波幅。',
  // Before buying or selling an option
  '1ish1uwaf2a': '買入或沽出期權之前',
  // Check whether IV is high or low for that underlying. Buying high IV means paying for movement already expected; selling low IV means being paid little for the risk.
  'aha3a1l0ys': '查看該相關資產的引伸波幅是高是低。在高引伸波幅時買入，代表為已預期的波動付錢；在低引伸波幅時沽出，代表承擔風險卻收得很少。',
  // High IV is not free money for sellers
  '1d3oiaa3kpj': '高引伸波幅對賣方來說並不是免費的錢',
  // IV is high because the market sees real risk, and sometimes the move is far bigger than anyone priced.
  '1pnn5gqw8z4': '引伸波幅高是因為市場看到真正的風險，有時走勢會比任何人預計的大得多。',
  // Strategies: single options and options with stock
  'np25qpw3xo': '策略：單一期權及期權配合股票',
  // Long call, long put, covered call, cash-secured put and protective put: the five building blocks.
  'mokq0baigt': '買入認購期權、買入認沽期權、備兌認購期權、現金擔保認沽期權和保護性認沽期權：五個基本組件。',
  // An option **strategy** combines one or more **legs** to fit a view. Know four things first: when to use it, maximum profit, maximum loss and break-even. Examples use a $100 stock.
  'ccevo671ex': '期權**策略**組合一隻或多隻**腳**以配合看法。先知道四件事：何時用、最大盈利、最大虧損和損益平衡點。例子用一隻 $100 的股票。',
  // **Long call**: expect a clear rise soon. Max profit unlimited, max loss the premium, break-even strike + premium.
  'tflouj8ge9': '**買入認購期權**：預期很快明顯上升。最大盈利無限，最大虧損是期權金，損益平衡點是行使價 + 期權金。',
  // **Long put**: expect a clear fall soon. Max profit strike - premium, max loss the premium, break-even strike - premium.
  '4jogs3d5pe': '**買入認沽期權**：預期很快明顯下跌。最大盈利是行使價 - 期權金，最大虧損是期權金，損益平衡點是行使價 - 期權金。',
  // Long call: buy the 100 call for 4
  '1wkbt96ejrb': '買入認購期權：以 4 買入行使價 100 的認購期權',
  // Long put: buy the 100 put for 4
  '20uqkkeqpsu': '買入認沽期權：以 4 買入行使價 100 的認沽期權',
  // Own the stock and **sell** an out-of-the-money call: you collect premium and agree to sell at the strike.
  'zeskp83u84': '持有股票並**沽出**一張價外認購期權：你收取期權金，並同意在行使價賣出。',
  // Payoff of a covered call: profit rising with the price up to the strike, then flat
  '1xfqrlwg6uh': '備兌認購期權的損益：利潤隨價格上升至行使價，之後持平',
  // A covered call caps the upside at the strike in exchange for the premium.
  'x6w5dp1f3f': '備兌認購期權以期權金換取在行使價封頂的上升空間。',
  // **When**: you own the stock and expect sideways or a small rise.
  '285kxlsswkg': '**何時用**：你持有股票，預期橫行或小幅上升。',
  // **Max profit**: (strike - stock cost) + premium.
  '23pzha3mqxo': '**最大盈利**：（行使價 - 股票成本）+ 期權金。',
  // **Max loss**: stock cost - premium.
  '1jelwoiyi8w': '**最大虧損**：股票成本 - 期權金。',
  // **Break-even**: stock cost - premium.
  'xp9k6ufef2': '**損益平衡點**：股票成本 - 期權金。',
  // Covered call: own stock at 100, sell the 110 call for 3
  '275w9ppzfwp': '備兌認購期權：在 100 持有股票，以 3 沽出行使價 110 的認購期權',
  // Cash-secured put
  'ye05zuq8j3': '現金擔保認沽期權',
  // **Sell** a put and keep the cash to buy at the strike. Either you keep the premium or you buy the stock below the price today.
  '1dyyfppe19l': '**沽出**一張認沽期權，並保留在行使價買入所需的現金。要麼你保留期權金，要麼以低於今天的價格買入股票。',
  // **When**: you would happily own it lower.
  'q590lqm9au': '**何時用**：你樂意以較低價格持有它。',
  // **Max profit**: the premium.
  'f3i6m1mo5a': '**最大盈利**：期權金。',
  // **Max loss**: strike - premium.
  '10y86apvdww': '**最大虧損**：行使價 - 期權金。',
  // **Break-even**: strike - premium.
  '1j7746d7mcp': '**損益平衡點**：行使價 - 期權金。',
  // Cash-secured put: sell the 95 put for 3
  '1ni7k9r9eol': '現金擔保認沽期權：以 3 沽出行使價 95 的認沽期權',
  // Protective put
  'owo28c4kkj': '保護性認沽期權',
  // Own the stock and **buy** a put below the price: insurance that lets you sell at the strike whatever happens.
  '28alzbnes4d': '持有股票並**買入**一張低於現價的認沽期權：保險，無論如何都可以在行使價賣出。',
  // **Max profit**: unlimited, less the premium.
  '2a8vkvwkv8n': '**最大盈利**：無限，減去期權金。',
  // **Max loss**: (stock cost - strike) + premium.
  '280twgu6w2r': '**最大虧損**：（股票成本 - 行使價）+ 期權金。',
  // **Break-even**: stock cost + premium.
  '2jdaspmq94': '**損益平衡點**：股票成本 + 期權金。',
  // Protective put: own stock at 100, buy the 95 put for 3
  '1vnw8rjj7b6': '保護性認沽期權：在 100 持有股票，以 3 買入行使價 95 的認沽期權',
  // Insurance has a price
  '1izznwr4p95': '保險是有價錢的',
  // Held all the time, protective puts can cost several percent a year. Use them around specific risks.
  '19l8nzm93p6': '長期持有保護性認沽期權，每年可能花費幾個百分點。在特定風險前後才使用。',
  // Build them yourself
  '27qpco4q931': '自己動手建立',
  // The Options page has a strategy builder with these templates. It draws the payoff diagram and shows maximum profit, maximum loss and break-evens for whatever legs you add.
  '1xkw0qvhpd3': '期權頁有一個附帶這些範本的策略設定。無論你加入甚麼期權腳，它都會畫出損益圖，並顯示最大盈利、最大虧損和損益平衡點。',
  // Strategies: vertical spreads, straddles and strangles
  'uee0n6s6x2': '策略：垂直價差、跨式和勒束式',
  // Spreads cap both risk and reward. Straddles and strangles bet on movement in either direction.
  'nft5jg9ngg': '價差同時限制風險和回報。跨式和勒束式押注任何方向的波動。',
  // Straddles and strangles
  '1qtfiz71bhu': '跨式和勒束式',
  // A **vertical spread** buys one option and sells another of the same type and expiry at a different strike. The sold one pays for part of the bought one, and both the maximum gain and loss are known.
  '1a9kwuy3886': '**垂直價差**買入一張期權，同時沽出另一張類型和到期日相同、但行使價不同的期權。沽出的那張支付部分買入成本，最大盈利和虧損都是已知的。',
  // **Bull call spread** (a **debit**): buy a call, sell a higher call. Max loss the debit; max profit strike gap - debit; break-even lower strike + debit.
  '1pq8mfxup5e': '**牛市認購價差**（**淨支出**）：買入認購期權，沽出較高行使價的認購期權。最大虧損是淨支出；最大盈利是行使價差距 - 淨支出；損益平衡點是較低行使價 + 淨支出。',
  // Bull call spread: buy the 100 call for 5, sell the 110 call for 2
  'bzu60j9e2x': '牛市認購價差：以 5 買入行使價 100 的認購期權，以 2 沽出行使價 110 的認購期權',
  // Net debit 3: max loss 3, max profit 7, break-even 103. Cheaper than the plain call, but nothing beyond 110.
  '16kvpqrnbqe': '淨支出 3：最大虧損 3，最大盈利 7，損益平衡點 103。比單買認購期權便宜，但 110 以上沒有額外收益。',
  // Cheap
  '4l4rahx5st': '便宜',
  // **Bear put spread**: buy a put, sell a lower put. Same shape, for a moderate fall.
  'y027389vlq': '**熊市認沽價差**：買入認沽期權，沽出較低行使價的認沽期權。同樣形狀，適合溫和下跌。',
  // Bear put spread: buy the 100 put for 5, sell the 90 put for 2
  'cpzh5teynl': '熊市認沽價差：以 5 買入行使價 100 的認沽期權，以 2 沽出行使價 90 的認沽期權',
  // Reverse a spread and you receive a **credit**. A **bull put spread** sells a put and buys a lower one: keep the credit if price stays above the sold strike; max loss is the strike gap minus the credit.
  '1mjptpc0tza': '把價差反轉，你會收到**淨收入**。**牛市認沽價差**沽出一張認沽期權並買入較低的一張：價格保持在沽出行使價之上就保留淨收入；最大虧損是行使價差距減淨收入。',
  // Bull put spread: sell the 95 put for 3, buy the 90 put for 1.5
  '10lgmrjr58m': '牛市認沽價差：以 3 沽出行使價 95 的認沽期權，以 1.5 買入行使價 90 的認沽期權',
  // A **long straddle** buys a call **and** a put at the same strike: it pays if the price moves far either way. Max loss both premiums; break-evens strike plus and minus the total premium.
  '1nt7fj6unup': '**買入跨式**同時以相同行使價買入認購**和**認沽期權：價格向任何一方大幅移動就有利。最大虧損是兩份期權金；損益平衡點是行使價加減總期權金。',
  // Long straddle: buy the 100 call for 4 and the 100 put for 4
  'iai1ko4otr': '買入跨式：以 4 買入行使價 100 的認購期權，以 4 買入行使價 100 的認沽期權',
  // A **long strangle** uses out-of-the-money options instead: cheaper, but it needs a bigger move.
  '1dqh32lc8oa': '**買入勒束式**改用價外期權：較便宜，但需要更大的走勢。',
  // Long strangle: buy the 105 call for 2 and the 95 put for 2
  '1gvxw1j236x': '買入勒束式：以 2 買入行使價 105 的認購期權，以 2 買入行使價 95 的認沽期權',
  // Straddles before earnings usually disappoint
  'lxoddkxxrw': '業績前買入跨式通常令人失望',
  // The expected move is already priced in and IV collapses after. The stock must move more than expected.
  '1xilka7h47m': '預期的走勢已計入價格，之後引伸波幅還會崩跌。股價必須比預期移動得更多。',
  // Selling straddles and strangles
  '1kmh45zc29g': '沽出跨式和勒束式',
  // Short straddle
  '1fiwgn1bdn': '沽出跨式',
  // Short straddles and strangles profit if price stays still, with unlimited losses. The iron condor, next, is the capped version.
  'bl40n65fg2': '沽出跨式和勒束式在價格不動時獲利，但虧損無限。下一課的鐵兀鷹是限制虧損的版本。',
  // Strategies: iron condor, butterfly and calendar spread
  '1i441edi61a': '策略：鐵兀鷹、蝶式和日曆價差',
  // Three ways to profit when the price stays put, each with the loss capped.
  '6bbcn9vmfk': '三種在價格不動時獲利的方法，每種虧損都有上限。',
  // These strategies make money when the underlying goes **nowhere**, and every one has a capped loss.
  '1lmbh770spp': '這些策略在相關資產**原地不動**時賺錢，而且每個都有虧損上限。',
  // An **iron condor** sells an out-of-the-money put spread and an out-of-the-money call spread together:
  '2awirp4xpn8': '**鐵兀鷹**同時沽出一個價外認沽價差和一個價外認購價差：',
  // Buy a far out-of-the-money put (protection).
  '1nofrbhutxz': '買入一張深度價外的認沽期權（保護）。',
  // Sell a put below the price.
  '1ut8ih35kob': '沽出一張低於現價的認沽期權。',
  // Sell a call above the price.
  'sx2lnuzgek': '沽出一張高於現價的認購期權。',
  // Buy a far out-of-the-money call (protection).
  '1qjrguskaja': '買入一張深度價外的認購期權（保護）。',
  // Payoff of a flat iron condor: a flat profit between two strikes, sloping down to a flat capped loss on each side
  'hf7mj471rp': '平頂鐵兀鷹的損益：兩個行使價之間是平坦的利潤，兩邊斜下至平坦且封頂的虧損',
  // An iron condor keeps the credit while price stays between the sold strikes, with the loss capped on both sides.
  'dpbifxoqrn': '價格停留在兩個沽出行使價之間時，鐵兀鷹保留淨收入，兩邊的虧損都有上限。',
  // **Max profit**: the net credit, if price ends between the sold strikes.
  '19ytxhshyc3': '**最大盈利**：淨收入，前提是價格收在兩個沽出行使價之間。',
  // **Max loss**: width of one spread - net credit.
  'ki88h89drs': '**最大虧損**：其中一個價差的闊度 - 淨收入。',
  // **Break-evens**: sold put strike - credit, and sold call strike + credit.
  '2fzs3lf0vi7': '**損益平衡點**：沽出的認沽行使價 - 收入，以及沽出的認購行使價 + 收入。',
  // Iron condor
  '5odpkfb7ws': '鐵兀鷹',
  // Iron condor: buy 85 put for 1, sell 90 put for 2.5, sell 110 call for 2.5, buy 115 call for 1
  'shhhkuy5o': '鐵兀鷹：以 1 買入 85 認沽期權，以 2.5 沽出 90 認沽期權，以 2.5 沽出 110 認購期權，以 1 買入 115 認購期權',
  // Net credit 3, profit zone 87 to 113. With typical pricing you often risk more than you can make: condors win often and lose bigger.
  'yxiqzht5l8': '淨收入 3，盈利區 87 至 113。按一般定價，你往往冒的風險比可賺的多：鐵兀鷹經常贏，但輸的時候輸得更多。',
  // A **long butterfly** buys one low call, sells two middle calls and buys one high call, evenly spaced. The payoff is a tent peaking at the middle strike.
  '18yth12j2yv': '**買入蝶式**買入一張低行使價認購期權、沽出兩張中間的、買入一張高的，行使價間距相同。損益圖像一個帳篷，頂點在中間行使價。',
  // Long call butterfly: buy 90 call for 11.5, sell two 100 calls for 4.5 each, buy 110 call for 1
  '1o3kvowsmpq': '買入認購蝶式：以 11.5 買入 90 認購期權，每張以 4.5 沽出兩張 100 認購期權，以 1 買入 110 認購期權',
  // Net debit 3.5 for up to 6.5, but only if price lands near 100: a cheap, precise bet on calm.
  '1j240cbsdyl': '淨支出 3.5，最多可賺 6.5，但價格必須收在 100 附近：一個便宜而精準的平靜押注。',
  // A **calendar spread** sells a near option and buys a later one at the **same strike**. The near one decays faster, so it profits if price sits at the strike. It has two expiries, so the builder on the Options page prices it rather than one diagram.
  '1ik6yuds9ds': '**日曆價差**沽出近期期權並買入較遠期、**相同行使價**的期權。近期那張損耗更快，所以價格停在行使價附近就獲利。它有兩個到期日，所以由期權頁的策略建構器計價，而不是一張損益圖。',
  // **Iron condor**: wide range, collect premium, short vega.
  'mcy83t64xw': '**鐵兀鷹**：闊區間，收取期權金，負 Vega。',
  // **Butterfly**: narrow target, small debit.
  'rgqiqx6oqy': '**蝶式**：窄目標，少量淨支出。',
  // **Calendar**: narrow target now, debit, long vega.
  '8zpm6dg5de': '**日曆價差**：目前窄目標，淨支出，正 Vega。',
  // Many legs, many costs
  'riqhwr97c5': '腳愈多，成本愈多',
  // Four legs pay the spread and fees four times to open and again to close, which can eat most of the profit on small accounts.
  '10py79dabl9': '四隻腳開倉要付四次差價和手續費，平倉又要再付，在小帳戶中可能吃掉大部分利潤。',
  // Try them on paper
  'xnsztqejkf': '用模擬交易試試',
  // The Options page lets you build any of these on simulated prices and trade them on paper.
  'otpkfzf6vl': '期權頁讓你以模擬價格建構以上任何策略，並進行模擬交易。',
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
  // The premium
  '6dk9iud2jj': '期權金',
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
  // Option sellers
  'y7j2rplod0': '期權賣方',
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
  // Far out of the money
  '1ykvb516oqb': '深度價外',
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
  // Gamma is the rate of change of delta.
  '1jl75b0pze8': 'Gamma 是 Delta 的變化率。',
  // Where is gamma highest?
  'j024jb4306': 'Gamma 在哪裡最高？',
  // Deep in the money, far from expiry
  '1g0nqw64hp8': '深度價內、距離到期很遠',
  // At the money, close to expiry
  '1t0q1ecozpy': '價平、接近到期',
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
  // Both
  '54949phuur': '兩者',
  // Neither
  '1xlfibnn70k': '兩者都不會',
  // Sellers are short vega: the options they sold become cheaper to buy back.
  'pfakefg2n3': '賣方做空 Vega：他們沽出的期權變得更便宜，買回成本降低。',
  // Which Greek matters least for short-dated options?
  'bhvfe2b3f6': '對短期期權來說，哪個希臘字母最不重要？',
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
  // Calendar spread
  '1s0l27srsvu': '日曆價差',
  // The long-dated option in a calendar has more vega than the short-dated one sold against it.
  'tar6pihv6e': '日曆價差中的遠期期權，Vega 比沽出的近期期權大。',
} satisfies Record<string, string>;

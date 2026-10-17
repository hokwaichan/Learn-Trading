// Traditional Chinese for content/lessons/18-staying-in-the-game.ts and content/quizzes/18-staying-in-the-game.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Testing, reviewing and staying safe
  '1e3f3lbexg8': '測試、檢討和保障自己',
  // How to test an idea honestly, turn it into a written playbook, learn from your own trades, avoid the traps aimed at new traders, and move from paper to real money.
  'n1ynbp3rvw': '如何誠實地測試一個想法、把它變成書面交易手冊、從自己的交易中學習、避開針對新手的陷阱，以及由模擬交易轉到真錢。',
  // Testing a strategy honestly
  'mtksyevqia': '誠實地測試策略',
  // A backtest can prove almost anything if you let it. The habits that separate a real edge from a pattern fitted to the past.
  '84cxdveipd': '如果你容許，回測幾乎可以證明任何東西。區分真正優勢和遷就過去的形態的習慣。',
  // A backtest runs a set of rules over past prices to see what would have happened. It is the only way to find out whether an idea has ever worked without paying to find out. It is also the easiest tool in trading to fool yourself with.
  '1km5p64hm5e': '回測把一套規則套用在過去的價格上，看看會發生甚麼。這是不用付錢就能知道一個想法是否曾經有效的唯一方法。它也是交易中最容易令自己受騙的工具。',
  // How backtests lie
  '17kyv7989zy': '回測怎樣說謊',
  // **Overfitting.** Try enough settings and one will look brilliant by chance. A moving-average crossover tested with 400 combinations of periods will have a winner. That winner fitted the noise of that period, and the noise will not repeat.
  '192af7ici86': '**過度擬合。**試夠多的設定，總有一個會碰巧看起來很出色。以 400 種週期組合測試移動平均線交叉，必定有一個贏家。那個贏家擬合的是那段時期的雜訊，而雜訊不會重演。',
  // **Look-ahead.** Using information that was not available at the time: entering at the low of the candle that gave the signal, or using today’s close to decide a trade placed this morning.
  '2c2vpco0amh': '**前視偏差。**使用當時還未有的資訊：在發出訊號那支陰陽燭的低點入場，或用今天的收市價決定今天早上下的交易。',
  // **Ignoring costs.** Fees, spread and slippage, which turn many high-turnover systems from profit to loss.
  '1z261nihf5k': '**忽略成本。**手續費、差價和滑價，它們令很多高周轉率的系統由盈利變虧損。',
  // **Too few trades.** Twelve trades with nine winners proves nothing. The same system could easily have had four.
  '4n1q63o3xg': '**交易太少。**十二宗交易九宗贏，甚麼都證明不了。同一個系統也很容易只有四宗贏。',
  // **One market, one period.** A long-only strategy tested on a bull market measures the bull market.
  '1eme6pos1q4': '**一個市場，一段時期。**在牛市測試的只做多策略，量度的是牛市。',
  // **Survivorship bias.** Testing only on coins or shares that still exist today leaves out all the ones that went to zero.
  'tvyg9u3050': '**倖存者偏差。**只用今天仍然存在的幣或股票測試，就漏掉了所有跌至零的。',
  // Three years of SPY with 20 and 50-day exponential averages. A crossover strategy looks good here because the market trended. The honest question is what the same rules do on a market that went sideways, and on the years before this chart begins.
  '1ri3clny4pd': 'SPY 三年的走勢，加上 20 日和 50 日指數移動平均線。交叉策略在這裡看起來不錯，因為市場有趨勢。誠實的問題是：同樣的規則在橫行的市場，以及這張圖表開始之前的年份，表現如何。',
  // In-sample and out-of-sample
  '1239il4kgk8': '樣本內和樣本外',
  // The standard defence is to split your history in two. Develop and adjust the rules on the first part, the **in-sample** data. Then run them once, unchanged, on the second part, the **out-of-sample** data, which the rules have never seen. If performance collapses, the rules were fitted to the first part.
  '231s3mfjz0p': '標準的防範方法是把歷史分成兩部分。在第一部分，即**樣本內**數據上發展和調整規則。然後在第二部分，即規則從未見過的**樣本外**數據上，原封不動地執行一次。如果表現崩潰，規則就是擬合了第一部分。',
  // **Walk-forward testing** repeats this: tune on years one to three, test on year four; tune on years two to four, test on year five; and so on. It mimics how you would really use a strategy, re-tuning as time passes.
  '1sfmhw2w157': '**前進式測試**重複這個過程：用第一至三年調整，在第四年測試；用第二至四年調整，在第五年測試；如此類推。它模擬你實際使用策略的方式，隨時間重新調整。',
  // A testing routine
  'frbbdg1mmk': '測試程序',
  // Write the rules down completely before testing. If a rule needs judgement, it cannot be backtested.
  '3ybu5s8i7e': '測試前把規則完整寫下。如果某條規則需要判斷，就無法回測。',
  // Test on the first two thirds of your data. Adjust if you must, but change as few numbers as possible.
  'xaw5jbbi0t': '在數據的首三分之二上測試。必要時調整，但盡量少改數字。',
  // Run it once on the last third. That result is your estimate. Do not go back and adjust.
  '6pxcjr4wnx': '在最後三分之一上執行一次。那個結果就是你的估計。不要回頭調整。',
  // Run the same rules on two other symbols. A real edge usually shows up, weaker, in related markets.
  '1a0md66gn9k': '在另外兩個代號上執行同樣的規則。真正的優勢通常在相關市場中也會出現，只是較弱。',
  // Change each setting a little. If 20 works and 18 and 22 fail, you have found noise.
  '1vvshjh72s8': '把每個設定稍作改變。如果 20 有效而 18 和 22 失敗，你找到的是雜訊。',
  // Include realistic costs, then double them and see whether it survives.
  '1zkj74n7yiy': '計入實際成本，然後把它加倍，看看策略能否存活。',
  // Look for at least 30 trades, preferably 100, before believing any number.
  'l6bjggfwor': '相信任何數字之前，至少要有 30 宗交易，最好是 100 宗。',
  // Reading a result
  '2393fitputk': '解讀結果',
  // A strategy shows +80% over two years with a 35% maximum drawdown and 14 trades.
  '1kg9fhnunc1': '一個策略兩年內顯示 +80%，最大回撤 35%，共 14 宗交易。',
  // Fourteen trades: far too few. One or two large winners probably account for most of the profit.
  '2a40slapm4s': '十四宗交易：太少了。大部分利潤可能來自一兩宗大贏的交易。',
  // A 35% drawdown: could you sit through losing a third of the account and keep following the rules? Most people cannot.
  '11rmvbqyscl': '35% 的回撤：你能捱過損失戶口三分之一，並繼續遵守規則嗎？大部分人不能。',
  // Compare with buy and hold over the same period. If simply holding made +90%, the strategy added risk and work for less return.
  '257yo3ekxmk': '與同期買入並持有比較。如果單是持有已賺 +90%，這個策略增加了風險和工作，回報卻更少。',
  // In this app
  '1fjqwz7ng0w': '在這個應用程式中',
  // The Backtester fills signals at the next candle’s open, so it cannot look ahead, and it charges the fees and slippage from Settings. Use the date range to make your own in-sample and out-of-sample periods, and the Recent runs table to compare symbols.
  '2fp615ir2j9': '回測器在下一支陰陽燭的開市價成交訊號，所以不會前視，並收取「設定」中的手續費和滑價。用日期範圍自行劃分樣本內和樣本外時期，並用「最近執行」表比較不同代號。',
  // A good backtest is the start, not the proof
  'anfao8r959': '好的回測是開始，不是證明',
  // Even an honest backtest describes the past. Markets change, and an edge that many people find stops working. After the backtest comes forward testing: trading the rules on paper, in real time, for weeks.
  'a77pmtvuh5': '即使誠實的回測也只描述過去。市場會改變，很多人都發現的優勢會失效。回測之後是前向測試：以模擬交易實時按規則交易幾個星期。',
  // Building a playbook
  '17yqzo40073': '建立交易手冊',
  // Pick two or three setups, write each one down as a checklist, and trade nothing else. Fewer setups, traded well, beat knowing everything.
  'dywlohq6h6': '選兩三個交易形態，把每一個寫成檢查清單，其他一概不做。較少的形態、做得好，勝過甚麼都懂。',
  // By now you have met dozens of patterns, indicators and concepts. Trying to use them all is a common reason beginners lose: there is always some signal somewhere saying "trade". A **playbook** is a short written list of the specific setups you trade, each defined precisely enough that you could hand it to someone else.
  '1m1j1oegfqt': '到現在你已經接觸過幾十個形態、指標和概念。嘗試全部使用，是初學者虧錢的常見原因：總有某處某個訊號在說「交易」。**交易手冊**是一份簡短的書面清單，列出你交易的特定形態，每一個都定義得足夠精確，可以交給別人執行。',
  // One page per setup
  'xwh5xmc3ej': '每個形態一頁',
  // **Name.** Short and specific: "Pullback to the 20 EMA in a daily uptrend".
  '1g834ptqwwb': '**名稱。**簡短而具體：「日線上升趨勢中回調到 20 EMA」。',
  // **Market conditions.** When it applies and when it does not. Trend or range? Which timeframe? Which hours?
  'al5uv6pmz': '**市場狀況。**甚麼時候適用，甚麼時候不適用。趨勢還是區間？哪個時間週期？哪些時間？',
  // **Entry trigger.** The exact event: a candle closing above the previous candle’s high after touching the average.
  'g34c5qq7ln': '**入場觸發。**確切的事件：觸及平均線後，一支陰陽燭收市高於前一支陰陽燭的高點。',
  // **Stop-loss.** Where, and why there.
  '9m0nz4x2f1': '**止蝕。**放在哪裡，以及為甚麼放在那裡。',
  // **Target or exit.** A fixed target, a trailing method, or both.
  '7fuxr0ac3q': '**目標或離場。**固定目標、追蹤方法，或兩者兼用。',
  // **Position size.** The percentage of the account at risk.
  '163pfohomjr': '**持倉規模。**戶口承受風險的百分比。',
  // **What cancels it.** News due within the hour, an earlier loss limit reached, the level already tested three times.
  '6b9wc3bcs5': '**甚麼會取消它。**一小時內有消息公佈、已到達較早前的虧損上限、價位已被測試三次。',
  // **An example chart.** A marked-up picture of the setup done well.
  'an3umeajky': '**範例圖表。**一張標記好、做得好的形態圖片。',
  // A playbook example: an uptrend, a pullback to the rising 20-period average, a candle that closes back above the previous high, the stop under the pullback low and the target at twice the risk.
  'zd6q2d9yw7': '交易手冊範例：上升趨勢、回調到上升中的 20 週期平均線、一支收市回到前一個高點之上的陰陽燭、止蝕在回調低點之下，目標是風險的兩倍。',
  // Touches the average
  '2g50xsq09fv': '觸及平均線',
  // Trigger: closes above the prior high
  'xjtwm1lbum': '觸發：收市高於前一個高點',
  // Stop: under the pullback low
  '21vu2cufzsh': '止蝕：回調低點之下',
  // Target: 2R
  '1tzfhc1xzdg': '目標：2R',
  // Choosing your setups
  'h6a7fzf8kt': '選擇你的形態',
  // **Start with one.** A trend-pullback setup is a good first choice: it trades with the trend and has a natural stop.
  '1fiy05w64pl': '**先從一個開始。**趨勢回調形態是不錯的首選：它順勢交易，並有自然的止蝕位。',
  // **Make it fit your life.** If you can look at charts for twenty minutes a day, a daily-chart swing setup fits. A 5-minute scalp does not.
  '2840ifkmhfv': '**配合你的生活。**如果你每天可以看圖二十分鐘，日線波段形態合適。5 分鐘炒短線就不合適。',
  // **Add a second only after 50 logged trades of the first.** Ideally one that works in different conditions, such as a range setup to go with a trend setup.
  '4dsonbl32d': '**第一個形態記錄了 50 宗交易後才加入第二個。**最好是在不同狀況下有效的，例如配合趨勢形態的區間形態。',
  // **Three is plenty.** Many professional traders make a living from one.
  'kiocwr6i2j': '**三個已經很多。**很多專業交易者靠一個形態維生。',
  // Grading setups
  '1ncdspi6zxi': '為形態評級',
  // Not every instance is equally good. Many traders grade each one before entering: A when every condition is present and the higher timeframe agrees, B when one is missing, C when it is marginal. Then they take only A setups, or trade B at half size. Grading in advance, and logging the grade, shows you later whether your judgement of quality is worth anything.
  'kx9wkryz7p': '不是每次出現都同樣好。很多交易者在入場前為每次評級：所有條件齊備且較高時間週期同意時是 A，缺一個時是 B，勉強時是 C。然後只做 A 級形態，或以一半規模做 B 級。事先評級並記錄級別，日後就能看出你對質素的判斷有沒有價值。',
  // Keeping it alive
  '9bvdwpkxqq': '保持它有生命力',
  // The playbook changes with evidence. Every month, look at the Analytics page by setup. A setup with a negative expectancy over 40 trades gets rewritten or removed. A setup with a strong record earns a little more risk. Ideas you have not tested stay out of it.
  'vhaxwsnjky': '交易手冊隨證據改變。每個月按形態查看績效分析頁。40 宗交易中期望值為負的形態要重寫或刪除。紀錄強勁的形態可以多承受一點風險。未經測試的想法不能放進去。',
  // Tag every trade in the Journal with the setup’s name, exactly as written in your playbook. The Analytics page then reports win rate and result for each setup, which is the feedback the playbook needs.
  '2etf8hjt8w8': '在交易日誌中為每宗交易標記形態名稱，與交易手冊中寫的完全一樣。績效分析頁就會報告每個形態的勝率和成績，這正是交易手冊需要的回饋。',
  // If it is not in the playbook, it is not a trade
  '1p9097vhz1f': '不在交易手冊中，就不是交易',
  // The moment you take a trade "because it looks good", you are no longer testing anything, and your results stop telling you what works.
  '1tqnin67fx3': '當你「因為看起來不錯」而做一宗交易的那一刻，你就不再測試任何東西，你的成績也不再告訴你甚麼有效。',
  // Reviewing your trades
  '5z7w7fkt7s': '檢討你的交易',
  // A journal is only useful if you read it. A weekly review turns a list of trades into two or three things to change.
  'ymfs4t25lr': '交易日誌只有在你閱讀時才有用。每週檢討把一連串交易變成兩三件要改變的事。',
  // Most traders who keep a journal write in it and never look back. The value is in the review: a regular, short session where you treat your past trades as data about one particular trader, yourself.
  '11rqtfmequi': '大部分寫交易日誌的交易者只寫不看。價值在於檢討：定期、簡短地把過去的交易當作一位特定交易者（你自己）的數據。',
  // Two kinds of mistake
  'l3zp8s4kqk': '兩種錯誤',
  // **A bad outcome**: you followed the plan and the trade lost. This is the cost of doing business. Nothing to fix.
  '1r5nkthg38u': '**壞結果**：你遵守了計劃，交易虧損了。這是做生意的成本。沒有要修正的。',
  // **A bad decision**: you broke the plan, whether the trade won or lost. This is what a review is for.
  'vkol21w1kc': '**壞決定**：你破壞了計劃，不論交易輸贏。這才是檢討要處理的。',
  // A win from a broken rule is the dangerous one, because it rewards the behaviour. Mark it as a mistake anyway.
  '7wdm62qj5r': '破壞規則而贏錢最危險，因為它獎勵了那種行為。無論如何都要把它標記為錯誤。',
  // The weekly review
  '28hycv4idz0': '每週檢討',
  // **Sort by setup.** Which setups made money and which lost? Is any one responsible for most of the loss?
  '2aqo8gr2upp': '**按形態排序。**哪些形態賺錢，哪些虧錢？有沒有一個造成大部分虧損？',
  // **Sort by feeling.** Compare trades tagged calm with trades tagged FOMO or revenge. The difference is usually large and usually surprising.
  'qk6bausath': '**按感受排序。**比較標記為冷靜的交易和標記為害怕錯過或報復的交易。差別通常很大，也通常令人意外。',
  // **Look at the losers.** For each: was the stop in a sensible place? Was the entry early? Was it in the playbook at all?
  'e6k5kruup3': '**看虧損的交易。**每一宗：止蝕放在合理的位置嗎？入場太早嗎？它到底在不在交易手冊中？',
  // **Look at the winners.** Did you exit early? How much further did price go? Was the size smaller than planned?
  '1gfzz8yxwdl': '**看贏錢的交易。**你有沒有太早離場？價格之後再走了多遠？規模比計劃小嗎？',
  // **Count rule breaks.** How many trades followed the plan completely? That percentage is your real score for the week.
  '1z0kxwi19fc': '**數算破壞規則的次數。**有多少宗交易完全遵守計劃？這個百分比就是你這星期真正的分數。',
  // **Write one change.** One, not five. Carry it into next week and check it at the next review.
  '1we6g0v0sdh': '**寫下一個改變。**一個，不是五個。帶到下星期，在下次檢討時檢查。',
  // Sample size
  '1ejjow9ujtx': '樣本大小',
  // Ten trades tell you almost nothing about a setup. With a true win rate of 50%, getting three wins in ten, or seven, is ordinary luck. Run the simulation several times and compare the first ten trades of each run with where it ends.
  '1ope3zzftpn': '十宗交易對一個形態幾乎說明不了甚麼。真正勝率 50% 時，十宗中贏三宗或七宗都只是普通的運氣。多執行幾次模擬，比較每次首十宗交易與最終結果。',
  // So review behaviour every week, because rule-breaking shows up at once. Judge a setup’s numbers only over 30 to 50 trades.
  '2gnmufrg3op': '所以每週檢討行為，因為破壞規則會立即顯現。只在 30 至 50 宗交易後才評判一個形態的數字。',
  // Numbers worth tracking
  '24cnsx77q0m': '值得追蹤的數字',
  // **Expectancy per trade**, in R. The one number that says whether you have an edge.
  '1ko88xen3kx': '**每宗交易期望值**，以 R 計。說明你有沒有優勢的那一個數字。',
  // **Win rate and average win against average loss.** Together they explain the expectancy.
  'qxz2e0hylb': '**勝率，以及平均盈利對平均虧損。**兩者一起解釋期望值。',
  // **Maximum drawdown and longest losing run.** What you must be able to sit through.
  '96kq7o4cfa': '**最大回撤和最長連輸。**你必須能捱過的情況。',
  // **Plan-following rate.** The share of trades taken exactly as written.
  '17eh0e5wq0h': '**遵守計劃比率。**完全按書面計劃進行的交易所佔比例。',
  // **Results by setup, by day and by feeling.** Where the edge is, and where it leaks.
  '59kgh4a9hc': '**按形態、日子和感受劃分的成績。**優勢在哪裡，又在哪裡流失。',
  // The Journal has fields for the setup, how you felt, a review, and a 1 to 5 score for following the plan. The Analytics page breaks results down by each of those, and its "What stands out" box names the largest gap.
  '1s97wyh51xd': '交易日誌有交易形態、感受、檢討，以及 1 至 5 分的遵守計劃評分欄位。績效分析頁按每一項分拆成績，「值得注意」方塊會指出最大的差距。',
  // Do not review during a session
  'g3dnd3v0f2': '不要在時段進行中檢討',
  // Reviewing a loss minutes after it happened is not analysis, it is searching for a way to win it back. Review at a fixed time, away from live prices.
  'fhk3m47beh': '虧損後幾分鐘就檢討不是分析，而是在找方法贏回來。在固定時間、遠離實時價格時檢討。',
  // Scams, signal groups and prop firms
  '1jvahjf258x': '騙局、訊號群組和自營交易公司',
  // New traders are a target market. How to recognise the common schemes, and how to read the small print of a funded-account challenge.
  '208j4fbj80z': '新手交易者是目標市場。如何辨認常見的計倆，以及如何細閱資助戶口挑戰的細則。',
  // Trading attracts people hoping to make money quickly, and an industry exists to sell to them. Much of it is legal and merely poor value. Some of it is theft. Recognising the patterns is a skill as practical as reading a chart.
  '14i70ih14wk': '交易吸引希望快速賺錢的人，也有一個行業專門向他們推銷。大部分是合法的，只是不划算。有些則是盜竊。辨認這些模式是一項與看圖同樣實用的技能。',
  // Red flags
  'n1kfguszy': '警號',
  // **Guaranteed or unusually steady returns.** Real trading has losing months. "2% a week, every week" is the signature of a fraud.
  'rdtn9zn0ms': '**保證或異常穩定的回報。**真實的交易有虧損的月份。「每週 2%，週週如是」是欺詐的標誌。',
  // **Screenshots of profits.** Trivially faked, and even real ones show selected winners.
  '12snu5tgaq1': '**利潤截圖。**輕易就能偽造，即使是真的也只顯示挑選過的贏錢交易。',
  // **Urgency.** "Only ten places left", "the price doubles at midnight". Pressure exists to stop you thinking.
  'k2w4bf3xbp': '**緊迫感。**「只剩十個名額」、「午夜價格加倍」。壓力的存在是為了阻止你思考。',
  // **Lifestyle marketing.** Cars and beaches are advertising, usually paid for by selling courses, not by trading.
  '3b6xnlggdf': '**生活方式營銷。**名車和海灘是廣告，通常靠賣課程而不是靠交易支付。',
  // **Someone who wants to trade your money or log into your account.** No.
  '20vyvod5ffv': '**有人想替你交易你的錢或登入你的戶口。**不行。',
  // **An unregulated broker you have never heard of**, especially one recommended by a stranger.
  'uk4ezybmv8': '**一個你從未聽過、不受監管的經紀**，尤其是陌生人推薦的。',
  // Pump and dump
  '27zfcqrtpvj': '拉高出貨',
  // In a **pump and dump**, organisers quietly buy a thinly traded coin or share, then promote it loudly to a group. Followers rush in, the price spikes, and the organisers sell into that buying. The price collapses within minutes or hours, leaving the followers holding it.
  '2a9f9fxq9z3': '在**拉高出貨**中，組織者悄悄買入一隻交投稀疏的幣或股票，然後向一個群組大肆推廣。追隨者蜂擁而入，價格急升，組織者趁買盤賣出。價格在幾分鐘或幾小時內崩潰，追隨者被困。',
  // Quiet trading, then a spike of 50% in two candles on enormous volume, a long upper wick where the organisers sold, and a fall to below the starting price. Anyone who bought after the announcement bought from the people who planned it.
  '2gch96r1eni': '平靜的交投，然後兩支陰陽燭以巨大成交量急升 50%，留下組織者賣出的長上影線，再跌到起始價之下。任何在宣佈後買入的人，都是從策劃者手上買入。',
  // Organisers buy quietly
  '2cezdtijoac': '組織者悄悄買入',
  // Promotion: followers buy
  '1nt6rbouq9f': '推廣：追隨者買入',
  // Organisers sell into it
  '17l49havhdn': '組織者趁勢賣出',
  // Followers are left holding
  'quhkihn5c2': '追隨者被困',
  // Signal groups and copy trading
  '3aml7kcoew': '訊號群組和跟單交易',
  // A **signal group** sells trade alerts. Consider the incentives: someone with a reliably profitable method gains nothing by selling it for a monthly fee, and following alerts teaches you nothing. Many groups are also paid by a broker for each customer they refer, and are paid more when those customers trade more, win or lose.
  'rd9a3sf7f': '**訊號群組**出售交易提示。想想背後的誘因：擁有可靠盈利方法的人，以月費出售它毫無得益，而跟隨提示也學不到任何東西。很多群組也會因每位轉介的客戶獲經紀付款，客戶交易越多，不論輸贏，他們收得越多。',
  // Prop firms and funded accounts
  'f06hrnclom': '自營交易公司和資助戶口',
  // A **prop firm**, in the retail sense, sells an evaluation: you pay a fee to trade a simulated account under strict rules, and if you hit a profit target without breaking them, you get a "funded account" and keep a share of profits. Some pay out as promised. The business model is still worth understanding: most firms earn mainly from evaluation fees, because most people fail.
  'd6ywlpzuo5': '零售意義上的**自營交易公司**出售的是考核：你付費在嚴格規則下交易一個模擬戶口，如果在不違規的情況下達到利潤目標，你會得到一個「資助戶口」並保留部分利潤。有些確實按承諾付款。這種商業模式仍值得了解：大部分公司主要收入來自考核費，因為大部分人都失敗。',
  // **Daily loss limit.** Often 4% to 5%. One bad session ends the account.
  '1gfgen2hfvb': '**每日虧損上限。**通常 4% 至 5%。一個壞時段就會結束戶口。',
  // **Maximum drawdown.** Often 8% to 10%, sometimes trailing behind your highest balance, so profits you made can raise the level at which you fail.
  'gvt033jdkh': '**最大回撤。**通常 8% 至 10%，有時跟隨你的最高結餘移動，所以你賺到的利潤會提高你失敗的水平。',
  // **Profit target and time.** A target of 8% to 10% pushes traders to risk too much.
  '1p271q3k217': '**利潤目標和時限。**8% 至 10% 的目標會推使交易者承受過多風險。',
  // **Consistency and news rules.** Limits on how much profit can come from one day, or bans on trading around announcements.
  '11d2g8t2f8z': '**一致性和消息規則。**限制一天內可賺多少利潤，或禁止在消息公佈前後交易。',
  // **Payout terms.** How often, with what minimums, and what the firm’s record of paying is.
  '1qwpkrx1cj9': '**提款條款。**多久一次、最低金額是多少，以及公司的付款紀錄。',
  // Is the challenge realistic for you?
  'jtfpwny0vs': '這個挑戰對你來說實際嗎？',
  // Target +8%, maximum drawdown 8%, daily limit 4%.
  '1121p3bzmzk': '目標 +8%，最大回撤 8%，每日上限 4%。',
  // Risking 1% a trade, a normal run of seven losses takes you to minus 7%, one loss from failing.
  '2as38rcrb8k': '每宗交易承受 1% 風險，正常的七連輸會令你虧損 7%，再輸一宗就失敗。',
  // Risking 0.5% a trade gives room to survive that streak, but you then need 16R of net profit to pass.
  '1gneto3lyhi': '每宗交易承受 0.5% 風險，有空間捱過那段連敗，但你就需要 16R 的淨利潤才能通過。',
  // Check your own record: has your paper account ever gained 16R without first losing 16 trades’ worth? If not, the fee is buying a lottery ticket.
  '2x4eeizs7e': '檢查自己的紀錄：你的模擬戶口有沒有試過在未先輸掉 16 宗交易的金額前就賺到 16R？如果沒有，這筆費用就是買彩票。',
  // If you would not pass on paper, you will not pass after paying
  'mcdwyh6tf3': '如果模擬交易也過不了，付錢後也過不了',
  // Run the rules against your own Journal first. The limits a prop firm imposes are sensible ones to trade under anyway, and practising them here costs nothing.
  'pi63o8dr6d': '先用你自己的交易日誌對照這些規則。自營交易公司的限制本來就是合理的交易規範，在這裡練習不用花錢。',
  // A simple test
  'hdimoaffey': '一個簡單的測試',
  // Before paying for anything in trading, ask: how does this person make money, and does it depend on me winning? If the answer is "from my fee, whether I win or not", weigh their advice accordingly.
  '2bhk5x9xhq3': '在交易方面付錢買任何東西之前，問：這個人怎樣賺錢，而這是否取決於我贏錢？如果答案是「從我的費用，不論我輸贏」，就相應地衡量他們的建議。',
  // From paper to real money
  '12bmedrhqsz': '由模擬交易到真錢',
  // Paper trading leaves out fear. How to know when you are ready, how to start small enough that mistakes are cheap, and what to expect honestly.
  '2k78ta96vo': '模擬交易沒有恐懼。如何知道你準備好了、如何從足夠小的規模開始令錯誤代價低廉，以及誠實的預期。',
  // Everything you have done in this app uses simulated money. That is its strength: mistakes are free. It is also its limit. Paper trading does not make your heart race when a position is down, and it fills every order perfectly. The step to real money is a change in psychology more than in method.
  '4gwu4bgz69': '你在這個應用程式中做的一切都用模擬資金。這是它的優點：犯錯不用付錢。這也是它的局限。持倉虧損時，模擬交易不會令你心跳加速，而且每張訂單都完美成交。轉到真錢與其說是方法的改變，不如說是心理的改變。',
  // What paper trading hides
  '1cnjhpk37g': '模擬交易隱藏了甚麼',
  // **Emotion.** A paper loss does not hurt. With real money, the urge to move a stop or close a winner early is far stronger.
  'ali22mqui3': '**情緒。**模擬虧損不痛。用真錢時，移動止蝕或提早平掉贏錢交易的衝動強烈得多。',
  // **Fills.** Real orders can be filled late, partly, or at a worse price, most of all in fast markets.
  'ou7iqevth9': '**成交。**真實訂單可能延遲成交、部分成交或以較差價格成交，在快速市場中尤其如此。',
  // **Size effects.** Your paper order never moves the price. In a thin market a real one can.
  '1i4fjpcrr26': '**規模效應。**你的模擬訂單從不推動價格。在交投稀疏的市場中，真實訂單可以。',
  // **Boredom and time.** It is easy to be disciplined for an hour of practice, harder across months.
  '1p37e64vct1': '**沉悶和時間。**練習一小時保持紀律很容易，持續幾個月就難得多。',
  // Are you ready? A checklist
  '1rrze2auq95': '你準備好了嗎？檢查清單',
  // You have a written playbook with one to three setups.
  '1hrsxv7j8q0': '你有一份包含一至三個形態的書面交易手冊。',
  // You have logged at least 50 paper trades taken from that playbook.
  '28ynvkwhzfn': '你已記錄了至少 50 宗按交易手冊進行的模擬交易。',
  // The expectancy across those trades is positive after fees.
  '20py1tlj3so': '這些交易扣除手續費後的期望值是正數。',
  // You followed your plan on at least four trades in five.
  '2878i1mbi9u': '每五宗交易中至少有四宗遵守了計劃。',
  // You have sat through your system’s normal losing streak on paper without changing the rules.
  'jedph347ch': '你在模擬交易中捱過了系統的正常連敗，而沒有更改規則。',
  // The money you would use is money you can lose completely without it affecting your life. Not rent, not savings you need, never borrowed.
  'rd6gdrwul5': '你會用的錢，是全部輸掉也不影響生活的錢。不是租金，不是你需要的儲蓄，絕不是借來的。',
  // If any of these is missing, more paper trading is not a delay. It is the cheapest tuition available.
  '1oj0kcw77no': '如果缺少任何一項，更多模擬交易不是拖延，而是最便宜的學費。',
  // Starting small
  '197o5ymk3zc': '由小開始',
  // Begin with the smallest size the market allows, so that a full loss is a trivial sum. The goal of the first months is not profit. It is to find out whether you trade real money the same way you traded paper. Size from the stop exactly as before:
  'u0nuwsnc17': '從市場容許的最小規模開始，令全額損失只是微不足道的金額。最初幾個月的目標不是利潤，而是找出你用真錢交易時是否與模擬交易一樣。完全按之前的方法由止蝕定規模：',
  // Trade minimum size for at least 30 trades.
  'tm9axo4dal': '以最小規模至少交易 30 宗。',
  // Compare the results, and your plan-following rate, with your paper record.
  '1m676h2iyil': '把成績和遵守計劃比率與你的模擬紀錄比較。',
  // If they match, raise the risk a step, for example from 0.25% to 0.5% of the account. If they do not, go back to paper and find out why.
  '11729iuit3g': '如果兩者相符，把風險提高一級，例如由戶口的 0.25% 提高到 0.5%。如果不相符，回到模擬交易找出原因。',
  // Never raise size after a winning streak or to recover a loss.
  '1rbvr7fihh4': '永遠不要在連贏後或為了追回虧損而加大規模。',
  // Honest expectations
  '29jg0t40nju': '誠實的預期',
  // Studies of brokerage records in several countries find that most retail day traders lose money, and only a few percent are consistently profitable over years.
  'usodhwgykx': '對多個國家證券紀錄的研究發現，大部分零售即日交易者虧錢，只有百分之幾能多年持續獲利。',
  // A professional fund that makes 15% to 20% a year after costs is doing very well. Promises of that per month are fantasy or fraud.
  'of8cd2euo': '扣除成本後每年賺 15% 至 20% 的專業基金已經表現非常好。承諾每月有這樣回報的，不是幻想就是欺詐。',
  // For most people, steady investing in a broad index fund will beat their trading. Trading can still be worth doing as a skill and an interest, with money set aside for it.
  '9adfdnmevm': '對大部分人來說，穩定投資廣泛的指數基金會勝過他們的交易。交易仍然可以作為一項技能和興趣，用預留的資金去做。',
  // The practical side
  'r1ccv48swv': '實際事項',
  // Use a regulated broker or a large, established exchange. Read how deposits are protected.
  '1dilfbzw8qq': '使用受監管的經紀或大型、歷史悠久的交易所。了解存款受到怎樣的保障。',
  // Turn on two-factor authentication. Never share login details or recovery phrases.
  '24o01vyuikr': '開啟雙重認證。永遠不要分享登入資料或恢復短語。',
  // Keep records of every trade. In most countries trading profits are taxable and you are responsible for reporting them.
  '26fkbfzgpk4': '保存每宗交易的紀錄。在大部分國家，交易利潤需要課稅，而你有責任申報。',
  // Keep leverage off, or very low, until you have a year of real results.
  '1v5dd7mqxu4': '在有一年真實成績之前，不用槓桿或只用非常低的槓桿。',
  // This app cannot tell you that you are ready
  '8116kaa0cb': '這個應用程式無法告訴你已經準備好',
  // A good paper record is necessary, not sufficient. Nothing here is financial advice, and no course or tool can remove the risk of losing money. Decide what you can afford to lose before you start, and stop if you reach it.
  'eu5mdld05h': '良好的模擬紀錄是必要條件，但不是充分條件。這裡的一切都不是投資建議，沒有任何課程或工具能消除虧錢的風險。開始前決定你能承受損失多少，到達時就停止。',
  // Keep practising here
  '21q5hhw2s4f': '繼續在這裡練習',
  // Replay lets you trade months of history in an evening, the Backtester tests an idea in seconds, and the Journal and Analytics keep score. Real money does not replace any of that. It adds to it.
  '218imtsw26g': '重播讓你一個晚上交易幾個月的歷史，回測器在幾秒內測試一個想法，交易日誌和績效分析為你計分。真錢不會取代這些，而是加在其上。',
  // You test 300 parameter combinations and pick the best. Why is its result unreliable?
  '244c9879dfe': '你測試了 300 個參數組合並選出最好的。為甚麼它的結果不可靠？',
  // Computers make rounding errors
  '1yvbae8losz': '電腦有捨入誤差',
  // With that many tries, one will look great by chance: it is overfitted
  '1fqf2k38ym1': '試了這麼多次，總有一個碰巧看起來很好：它過度擬合了',
  // More combinations always improve accuracy
  '1pd2n2ghsif': '更多組合總會提高準確度',
  // It is reliable
  '1ul9n5pyt5y': '它是可靠的',
  // The best of many attempts has fitted the noise of that period. That noise will not repeat.
  'lt0o8oau1a': '眾多嘗試中最好的那個擬合了那段時期的雜訊。那些雜訊不會重演。',
  // What is out-of-sample data?
  '1h64i9sa00e': '樣本外數據是甚麼？',
  // Data from another exchange
  'zn3rv078gw': '來自另一個交易所的數據',
  // History the rules were not developed on, used once to check them
  '1hxgdktcav1': '規則不是在其上發展的歷史，只用一次來檢查規則',
  // Data with errors removed
  'z4jfvrldmh': '移除了錯誤的數據',
  // The most recent candle only
  '19wdc2iuv1o': '只有最近一支陰陽燭',
  // Rules are tuned in-sample and then tested, unchanged, on data they have never seen.
  '4hu5b82g89': '規則在樣本內調整，然後原封不動地在從未見過的數據上測試。',
  // A backtest enters at the low of the candle that produced the signal. This is:
  '151myeb8k1o': '一個回測在發出訊號那支陰陽燭的低點入場。這是：',
  // Good execution
  '7nyb3ikc0x': '良好的執行',
  // Look-ahead bias: the low was not known when the signal appeared
  '1uba8gb6n9g': '前視偏差：訊號出現時還不知道低點',
  // Slippage
  '2ffkxy4rmk2': '滑價',
  // Survivorship bias
  '2epa0q42dyo': '倖存者偏差',
  // The low of a candle is only known once it has closed. Using it for the entry uses the future.
  'idxje1c3p9': '陰陽燭的低點只在收市後才知道。用它來入場等於使用未來。',
  // A strategy works with a period of 20 but fails with 18 and with 22. What does that suggest?
  '3700ela5p6': '一個策略在週期 20 時有效，但 18 和 22 時都失敗。這暗示甚麼？',
  // 20 is the correct value
  '3qf8iup56w': '20 是正確的數值',
  // The result is probably noise, not a real edge
  'bwcb930bip': '結果很可能是雜訊，不是真正的優勢',
  // The market prefers round numbers
  'yp7wpwj4hq': '市場偏好整數',
  // Use 20 with more leverage
  '1cobvgrf51': '用 20 並加大槓桿',
  // A real edge is robust to small changes. A result that depends on one exact setting is fitted.
  '25pwllmnwnj': '真正的優勢對小改變很穩健。依賴一個確切設定的結果是擬合出來的。',
  // A backtest shows 12 trades, 9 of them winners. How much should you trust the 75% win rate?
  '1ofv1q0lkgw': '一個回測顯示 12 宗交易，其中 9 宗贏。你應該多信任這個 75% 的勝率？',
  // Completely
  'v3vfkundlz': '完全信任',
  // Very little: 12 trades is far too few
  '230qja7p4z8': '很少：12 宗交易太少了',
  // It is exact
  'rd004pg7qy': '它是準確的',
  // More than a test with 200 trades
  '182tfvtpj3y': '比 200 宗交易的測試更信任',
  // Small samples swing widely by luck. Look for at least 30 trades, preferably 100.
  '1c0e6j7ygd1': '小樣本會因運氣大幅波動。至少要 30 宗交易，最好是 100 宗。',
  // What is survivorship bias in a backtest?
  'ubgtnkokx8': '回測中的倖存者偏差是甚麼？',
  // Testing only on instruments that still exist, ignoring those that failed
  'mie86q2f5z': '只用仍然存在的工具測試，忽略已失敗的',
  // Keeping winning trades open too long
  '16tx9k37dfq': '贏錢交易持有太久',
  // Trading only in bull markets
  '72ylfnhxin': '只在牛市交易',
  // Using too many indicators
  '17qdnyyu10q': '用太多指標',
  // Leaving out the coins and shares that went to zero makes any long strategy look better than it was.
  '1iygze1la0u': '漏掉跌至零的幣和股票，會令任何做多策略看起來比實際更好。',
  // What is a trading playbook?
  '18h2duxzg0j': '交易手冊是甚麼？',
  // A list of every pattern you have learned
  '2gjd6a8p91n': '你學過的每一個形態的清單',
  // A short written set of the specific setups you trade, each with exact rules
  '290mph2qj7c': '一份簡短的書面清單，列出你交易的特定形態，每個都有確切規則',
  // A broker’s price list
  '1d8hx2lmuy5': '經紀的價目表',
  // A record of past profits
  '13jfjjmkxul': '過去利潤的紀錄',
  // A playbook defines a few setups precisely enough that someone else could follow them.
  'jxtgulidov': '交易手冊把幾個形態定義得足夠精確，別人也能照著做。',
  // How many setups should a beginner start with?
  '8048xzfhxh': '初學者應該從多少個形態開始？',
  // One
  '281h3ebu7y4': '一個',
  // Five
  '1805my4x30e': '五個',
  // Ten
  '2b7p5c87dcx': '十個',
  // As many as possible
  '1cj54zswv31': '越多越好',
  // One setup, logged for 50 trades, teaches more than ten traded at random.
  '2eowsubaj2j': '一個形態記錄 50 宗交易，比隨意交易十個形態學到更多。',
  // Which belongs on a playbook page?
  '1f9afaagbaw': '哪一項應該放在交易手冊頁面上？',
  // The exact entry trigger, the stop, the exit and what cancels the trade
  '2dqi0jhqwt2': '確切的入場觸發、止蝕、離場，以及甚麼會取消交易',
  // A prediction of next month’s price
  '1ulai6sf2k6': '下個月價格的預測',
  // Your broker’s phone number
  'i104a7rlua': '經紀的電話號碼',
  // Other traders’ opinions
  '1qox2a28ajm': '其他交易者的意見',
  // Each setup needs conditions, trigger, stop, exit, size and cancel conditions, plus an example.
  'ymt3gqnswb': '每個形態都需要狀況、觸發、止蝕、離場、規模和取消條件，再加一個範例。',
  // A trade looks good but is not in your playbook. What do you do?
  '217ng0vlwh5': '一宗交易看起來不錯，但不在你的交易手冊中。你會怎樣做？',
  // Take it at half size
  '29glos6dh6f': '以一半規模做',
  // Do not take it
  '1azh3jbmjik': '不做',
  // Take it without a stop
  '3mw2af33wg': '不設止蝕去做',
  // Take it and add the setup afterwards
  'eislqinc97': '做了之後再把形態加進去',
  // Untested ideas stay out. Trades outside the playbook make your results meaningless as feedback.
  '15hs6rbrp09': '未經測試的想法不能放進去。交易手冊以外的交易令你的成績失去回饋作用。',
  // After 40 trades one setup has a clearly negative expectancy. What should happen?
  '1d778wulqcc': '40 宗交易後，一個形態的期望值明顯為負。應該怎樣？',
  // Trade it larger to recover
  '21efnb0buok': '加大規模以追回',
  // Rewrite it or remove it from the playbook
  '16bsb6c17fo': '重寫它，或把它從交易手冊中刪除',
  // Ignore the numbers
  '1sffg6orl7v': '不理會數字',
  // Keep it unchanged for another year
  'ogf4saogjt': '原封不動再用一年',
  // The playbook follows the evidence. A setup that loses over a fair sample is changed or dropped.
  '1v0tos5ktj4': '交易手冊跟隨證據。在合理樣本中虧損的形態要修改或刪除。',
  // You followed your plan exactly and the trade lost. In a review this is:
  '1anzs62r9ez': '你完全遵守了計劃，交易虧損了。在檢討中這是：',
  // A mistake to fix
  'hftzyofonu': '要修正的錯誤',
  // A bad outcome, not a bad decision
  '2bp4a14x5ys': '壞結果，不是壞決定',
  // A reason to change the system
  'wv7pcffmzf': '更改系統的理由',
  // A reason to stop journalling
  '1b9eoqnzjla': '停止寫交易日誌的理由',
  // Losses that follow the plan are the normal cost of trading. There is nothing to correct.
  '1lmcwtqhaxa': '遵守計劃的虧損是交易的正常成本。沒有要修正的。',
  // You broke your rules and the trade won. How should you record it?
  '53rt15z16n': '你破壞了規則，交易贏了。你應該怎樣記錄？',
  // As a success
  '1lk1funogw9': '記為成功',
  // As a mistake, despite the profit
  '1k3ugw81zre': '儘管有利潤，仍記為錯誤',
  // Do not record it
  'sizipnpss0': '不記錄',
  // As a new setup
  '21o6eazm2bs': '記為新形態',
  // A winning rule-break rewards bad behaviour, which makes it the most dangerous kind.
  '28dzrgei1ga': '破壞規則而贏錢獎勵了壞行為，所以是最危險的一種。',
  // How many trades are needed before judging a setup’s numbers?
  '9ak8ysytud': '評判一個形態的數字前需要多少宗交易？',
  // 30 to 50
  '1uw212alj7w': '30 至 50',
  // 1,000 at least
  '299ou155r1r': '至少 1,000',
  // Ten trades are dominated by luck. Thirty to fifty start to mean something.
  'j7p0ts1r2b': '十宗交易受運氣主導。三十至五十宗才開始有意義。',
  // How many changes should come out of one weekly review?
  '236qehytron': '一次每週檢討應該帶出多少個改變？',
  // None, reviews are only for records
  '20ineoo751b': '沒有，檢討只為記錄',
  // At least five
  'up2ubs5z4w': '至少五個',
  // One specific change, carried into next week and checked, actually gets done.
  '1oktrrqq9ms': '一個具體的改變，帶到下星期並檢查，才真的會做到。',
  // When is the wrong time to review a losing trade?
  '20w6my212sg': '甚麼時候檢討虧損交易是錯的？',
  // At the weekend
  '2484dapncu': '週末',
  // Minutes after it happened, during the session
  '19w14677fq5': '虧損後幾分鐘，在時段進行中',
  // The next morning
  '28ozqkb2ehb': '第二天早上',
  // At a fixed weekly time
  'mjhfma7rz0': '每週固定時間',
  // Straight after a loss you are looking for a way to win it back, not analysing.
  '1cmu17g6355': '剛虧損後你是在找方法贏回來，而不是在分析。',
  // A service advertises 3% profit every week, guaranteed. This is:
  '1dsw3wogjco': '一項服務宣傳每週保證 3% 利潤。這是：',
  // A good conservative offer
  '1i32jjkorfz': '一個保守的好提議',
  // A red flag: real trading has losing periods and no guarantees
  '1kw7b8nnne8': '警號：真實的交易有虧損期，沒有保證',
  // Normal for professionals
  '1l3gsz5h2oa': '專業人士的正常水平',
  // Low, so probably honest
  'xxicz1yw6u': '回報不高，所以大概是真的',
  // Guaranteed or perfectly steady returns are the signature of fraud.
  '8txiyra0lv': '保證或完全穩定的回報是欺詐的標誌。',
  // In a pump and dump, who profits?
  'lhi476ldmp': '在拉高出貨中，誰獲利？',
  // Everyone who joins
  '5g0ar4w5c3': '每個加入的人',
  // The organisers, who bought earlier and sell to the followers
  '1wjfxjfxqn': '較早買入並賣給追隨者的組織者',
  // The exchange only
  '1sicvbc2jcr': '只有交易所',
  // Nobody
  'uwj9yk2ogf': '沒有人',
  // Organisers buy first and sell into the buying they create. Followers are the exit.
  '11j0xqljyti': '組織者先買入，再趁自己製造的買盤賣出。追隨者就是他們的出口。',
  // Why should you doubt someone selling trade signals for a monthly fee?
  '7qgky2w24t': '為甚麼你應該懷疑以月費出售交易訊號的人？',
  // Signals are illegal
  '1nrt6297tdp': '訊號是違法的',
  // A reliably profitable method is worth more traded than sold, and sellers are often paid when you trade more
  '1tl9a7zr4zh': '可靠的盈利方法用來交易比出售更有價值，而且賣家常在你交易越多時收得越多',
  // Fees are too low to be serious
  'u17m0ztc2s': '費用太低，不夠認真',
  // There is no reason to
  '25imx1vmc70': '沒有理由懷疑',
  // Look at the incentives: the seller profits from subscriptions and referrals whether or not you win.
  '2g5wzteghiy': '看看誘因：不論你輸贏，賣家都從訂閱和轉介中獲利。',
  // How do most retail prop firms earn most of their income?
  '24budz6xd7o': '大部分零售自營交易公司的主要收入來自哪裡？',
  // From traders’ profits
  '124bx076dch': '來自交易者的利潤',
  // From evaluation fees paid by people who mostly fail
  '2upjehd4t7': '來自大多會失敗的人支付的考核費',
  // From government grants
  '12htin45t94': '來自政府資助',
  // From interest
  'afxiuouq47': '來自利息',
  // Most challengers fail, and their fees are the core of the business.
  '1xfrrt355gt': '大部分挑戰者都失敗，他們的費用是這門生意的核心。',
  // A challenge has an 8% maximum drawdown and you risk 1% a trade. Why is that tight?
  'bo7ket3nub': '一個挑戰的最大回撤是 8%，你每宗交易承受 1% 風險。為甚麼這很緊？',
  // A normal losing streak of seven or eight trades nearly ends the account
  '2a75zj4ynsl': '正常的七八宗連輸幾乎會結束戶口',
  // You cannot place trades at 1%
  'or1irayq45': '你無法以 1% 下單',
  // Drawdown limits do not apply to losses
  '7x26ts6q7v': '回撤上限不適用於虧損',
  // It is not tight
  '1lzuw1mi5ny': '並不緊',
  // Runs of seven losses are normal for a sound system. At 1% risk that streak alone uses most of the allowance.
  '1h33987qtzz': '七連輸對穩健的系統來說很正常。以 1% 風險計，單是這段連敗就用掉大部分容許額度。',
  // What is the useful question to ask before paying for any trading product?
  '23um6lyixv0': '在為任何交易產品付錢前，應該問甚麼有用的問題？',
  // How expensive is it?
  '126au4dsrc4': '它有多貴？',
  // How does the seller make money, and does it depend on me winning?
  'h2m7cc3880': '賣家怎樣賺錢，而這是否取決於我贏錢？',
  // How many followers do they have?
  '21tqxquw2n2': '他們有多少追隨者？',
  // What car do they drive?
  'h3tun29suk': '他們駕甚麼車？',
  // Incentives tell you more than marketing. If they are paid whether you win or lose, treat the advice accordingly.
  '1nojb8vhbcn': '誘因比營銷告訴你更多。如果不論你輸贏他們都收錢，就相應地看待他們的建議。',
  // What does paper trading mainly fail to reproduce?
  '1m3lojklim6': '模擬交易主要無法重現甚麼？',
  // Chart patterns
  '13kpc9aus5u': '圖表形態',
  // The emotions of having real money at risk
  '1rmhdwr6jzc': '真錢承受風險時的情緒',
  // Moving averages
  '232m0sh0p0m': '移動平均線',
  // The price of Bitcoin
  '14ybeevi71b': '比特幣的價格',
  // The method is the same. Fear and greed with real money are what change behaviour.
  '1edbs1pa90h': '方法是一樣的。真錢帶來的恐懼和貪婪才會改變行為。',
  // Which is a sign you are ready to try real money?
  '231u2d1h6jj': '哪一項是你準備好嘗試真錢的跡象？',
  // One very profitable paper trade
  '1n1o85f4a32': '一宗非常賺錢的模擬交易',
  // At least 50 logged paper trades from a written playbook, with positive expectancy after fees
  '2by6kqjpago': '至少 50 宗按書面交易手冊記錄的模擬交易，扣除手續費後期望值為正',
  // A friend made money
  '1gs58rts8qd': '朋友賺了錢',
  // You watched a course
  '7guo6o67iz': '你看過一個課程',
  // A fair sample of rule-following trades with a positive result is the minimum evidence.
  '1xto50nmf4e': '足夠樣本的守規則交易而且成績為正，是最起碼的證據。',
  // What is the goal of your first months with real money?
  'iagt5u235': '用真錢的最初幾個月，目標是甚麼？',
  // Maximum profit
  'hbvbacj5w4': '最大利潤',
  // Finding out whether you trade real money the same way you traded paper
  'c3xxjiln7v': '找出你用真錢交易時是否與模擬交易一樣',
  // Recovering the cost of courses
  '1u7ufgq9c8s': '賺回課程費用',
  // Using full leverage
  '25609hdu8j8': '用盡槓桿',
  // Start at minimum size. The point is to test your behaviour, not to earn.
  '7zhdgz7h3e': '從最小規模開始。重點是測試你的行為，不是賺錢。',
  // When may you increase your position size?
  '21f7wxuygph': '你甚麼時候可以增加持倉規模？',
  // After a winning streak
  'jvdmau8xz': '連贏之後',
  // After results at small size match your paper record, in small steps
  '1mp9e8cq17l': '小規模的成績與模擬紀錄相符後，小步增加',
  // To recover a loss faster
  '24h988s8e6k': '為了更快追回虧損',
  // Whenever you feel confident
  '16u387ib46s': '每當你感到自信',
  // Size goes up only on evidence, gradually, never in response to recent wins or losses.
  '19n51y3z0h2': '規模只按證據逐步增加，永不因近期的輸贏而改變。',
  // What do studies of real brokerage accounts say about retail day traders?
  'fzj45c45vy': '對真實證券戶口的研究怎樣描述零售即日交易者？',
  // Most are profitable
  '1wxcsqhokns': '大部分都有利可圖',
  // Most lose money, and only a few percent profit consistently
  '1br6u0wg4t7': '大部分虧錢，只有百分之幾持續獲利',
  // Half win and half lose
  'wz7iva8q0d': '一半贏一半輸',
  // There is no data
  '17d446h5pia': '沒有數據',
  // The evidence is consistent across countries. Expect it to be hard, and risk only what you can lose.
  '1behi7ti3wn': '各國的證據一致。預期這很困難，只拿你輸得起的錢冒險。',
  // Which money is suitable for trading?
  '15croza711j': '哪些錢適合用來交易？',
  // Borrowed money
  '1qbbo17ontu': '借來的錢',
  // Money you could lose completely without it affecting your life
  '1nweo5p85ww': '全部輸掉也不影響生活的錢',
  // Next month’s rent
  'gwutoqnmnu': '下個月的租金',
  // Emergency savings
  '1co2eb0ss0h': '緊急儲蓄',
  // Only risk capital. Needing the money changes every decision for the worse.
  '1wqap6xelmf': '只用風險資本。需要那筆錢會令每個決定都變差。',
} satisfies Record<string, string>;

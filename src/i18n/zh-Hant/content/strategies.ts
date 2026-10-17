// Traditional Chinese for content/strategies.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Long call
  '21dvxyyvlow': '買入認購期權',
  // Buy a call.
  '1pmlv4ry3dn': '買入一張認購期權。',
  // You expect a clear rise, soon.
  'qvqn2igd4b': '你預期價格很快會明顯上升。',
  // Unlimited
  '21l5rpcq28w': '無上限',
  // The premium paid
  'h38adcwp47': '已付的期權金',
  // Strike + premium
  '1h4nobket9j': '行使價 + 期權金',
  // Long put
  '1x1ki972wlz': '買入認沽期權',
  // Buy a put.
  'grb2musd1g': '買入一張認沽期權。',
  // You expect a clear fall, soon.
  '7cp1bxy66d': '你預期價格很快會明顯下跌。',
  // Strike - premium
  '1wft7j3zga0': '行使價 - 期權金',
  // Short (uncovered) call
  '25ykftpcldb': '沽出（無備兌）認購期權',
  // Sell a call without owning the underlying.
  '1z905x1xse3': '在沒有持有相關資產的情況下沽出認購期權。',
  // Rarely appropriate: the loss is unlimited if the price rises.
  '162scvn9bwe': '很少適合：如果價格上升，虧損沒有上限。',
  // The premium received
  '1t1dicgagxv': '收到的期權金',
  // Covered call
  'ohcl7dv8dw': '備兌認購期權',
  // Own the stock and sell a call above the price.
  '1mobgp0s5z5': '持有股票，並沽出高於現價的認購期權。',
  // You own the stock and expect it to go sideways or rise a little.
  '1jm898atvar': '你持有股票，並預期它橫行或小幅上升。',
  // (Strike - stock cost) + premium
  '17hxai4v4b5': '（行使價 - 股票成本）+ 期權金',
  // Stock cost - premium
  'ou1g4sxwxy': '股票成本 - 期權金',
  // Cash-secured put
  'ye05zuq8j3': '現金擔保認沽期權',
  // Sell a put below the price, holding cash to buy the stock if assigned.
  '17ggvy4q8n5': '沽出低於現價的認沽期權，並持有現金以便被行使時買入股票。',
  // You would be happy to own the stock at a lower price.
  '1x7rxi5m1p1': '你樂意以較低價格持有這隻股票。',
  // Protective put
  'owo28c4kkj': '保護性認沽期權',
  // Own the stock and buy a put below the price as insurance.
  '1fsqlwjdehw': '持有股票，並買入低於現價的認沽期權作為保險。',
  // You own the stock, want to keep it, and fear a drop.
  '10n08mno1tn': '你持有股票、想繼續持有，但擔心它下跌。',
  // (Stock cost - strike) + premium
  'ntdtmkey8b': '（股票成本 - 行使價）+ 期權金',
  // Stock cost + premium
  '10j0fuc6qsp': '股票成本 + 期權金',
  // Bull call spread
  '5nzibalyzw': '牛市認購價差',
  // Buy a call and sell a higher-strike call.
  '1nci5mdihv6': '買入一張認購期權，並沽出一張行使價較高的認購期權。',
  // You expect a moderate rise.
  '1etaap90e3': '你預期價格溫和上升。',
  // Strike difference - net debit
  '65wvqwezvg': '行使價差距 - 淨支出',
  // The net debit
  '3f5m2vgjth': '淨支出',
  // Lower strike + net debit
  'vhbyfaicwb': '較低行使價 + 淨支出',
  // Bear put spread
  '1w0qmps9d7l': '熊市認沽價差',
  // Buy a put and sell a lower-strike put.
  'xym6f6id9z': '買入一張認沽期權，並沽出一張行使價較低的認沽期權。',
  // You expect a moderate fall.
  '12r7mr429na': '你預期價格溫和下跌。',
  // Higher strike - net debit
  '1l0roa6rbmv': '較高行使價 - 淨支出',
  // Bull put spread (credit)
  'duvqv06t0r': '牛市認沽價差（淨收入）',
  // Sell a put and buy a lower-strike put.
  '12950djfan3': '沽出一張認沽期權，並買入一張行使價較低的認沽期權。',
  // You expect the price to stay above the sold strike.
  '1vuc7a3f047': '你預期價格會保持在沽出的行使價之上。',
  // The net credit
  '1pmitmnv4a3': '淨收入',
  // Strike difference - net credit
  '1ymwyxgegmw': '行使價差距 - 淨收入',
  // Sold strike - net credit
  'v2emzpmdxf': '沽出的行使價 - 淨收入',
  // Long straddle
  '1rmfdpedfpo': '買入跨式',
  // Buy a call and a put at the same strike.
  '1bmg1s8jqjb': '以相同行使價買入一張認購期權和一張認沽期權。',
  // You expect a big move but do not know the direction, and implied volatility is not already high.
  '2a4a38m3bn6': '你預期會有大幅波動但不知道方向，而且引伸波幅還未高企。',
  // Both premiums
  '1hxwxsxjop3': '兩份期權金',
  // Strike plus and minus the total premium
  '1wry0cr8z5u': '行使價加減總期權金',
  // Long strangle
  'q1h9k1cjby': '買入勒束式',
  // Buy an out-of-the-money call and an out-of-the-money put.
  '1voihp1jx9y': '買入一張價外認購期權和一張價外認沽期權。',
  // You expect a very large move in either direction.
  '23jcr57y0b5': '你預期任何一個方向都會有極大的波動。',
  // Call strike + total premium, and put strike - total premium
  'bmbfo919us': '認購行使價 + 總期權金，以及認沽行使價 - 總期權金',
  // Iron condor
  '5odpkfb7ws': '鐵兀鷹',
  // Sell an out-of-the-money put spread and call spread together.
  '1kz1g4c4z1w': '同時沽出價外的認沽價差和認購價差。',
  // You expect the price to stay inside a range, and implied volatility is fairly high.
  '1nnby4twu05': '你預期價格會留在一個區間內，而且引伸波幅頗高。',
  // Spread width - net credit
  'uhzecx4y6i': '價差闊度 - 淨收入',
  // Sold put strike - credit, and sold call strike + credit
  'ht1flb860w': '沽出的認沽行使價 - 收入，以及沽出的認購行使價 + 收入',
  // Long call butterfly
  'fl8uju8dnt': '買入認購蝶式',
  // Buy one lower call, sell two middle calls, buy one higher call.
  '1bflooshmih': '買入一張較低行使價的認購期權，沽出兩張中間行使價的，再買入一張較高行使價的。',
  // You expect the price to finish very close to a particular level.
  'lf4jrkky8j': '你預期價格會收在非常接近某個水平的位置。',
  // Strike spacing - net debit
  '86dvlq4ycq': '行使價間距 - 淨支出',
  // Lower strike + debit, and upper strike - debit
  'cnt8hjtuwz': '較低行使價 + 支出，以及較高行使價 - 支出',
  // Calendar spread
  '1s0l27srsvu': '日曆價差',
  // Sell a near-term option and buy a longer-term one at the same strike.
  'vc6nqjhm9a': '以相同行使價沽出近期期權，並買入較遠期的期權。',
  // You expect the price to stay near the strike for now, and perhaps move later.
  '1xiirjp8h9x': '你預期價格暫時會留在行使價附近，之後或者會移動。',
  // Depends on the value of the longer option when the near one expires
  'isi9fgxr9e': '視乎近期期權到期時遠期期權的價值',
  // Depends on implied volatility
  '1o3oxy3zvj8': '視乎引伸波幅',
  // You expect a stock to rise sharply within the next month and want your loss limited to a small, fixed amount.
  '5cxea3nnb2': '你預期一隻股票會在下個月內急升，並希望把虧損限制在一個細小、固定的金額。',
  // A bought call has unlimited upside and can lose only its premium. A covered call would cap the very rise you expect.
  '28931qxn4s6': '買入的認購期權上升空間無限，最多只會輸掉期權金。備兌認購期權反而會封頂你預期的升幅。',
  // You expect a stock to fall sharply over the next few weeks and want a defined, limited risk.
  '1n9rkvkr3us': '你預期一隻股票會在未來幾星期急跌，並希望風險明確而有限。',
  // A bought put profits from a fall and can lose only its premium. An uncovered short call also profits from a fall but has unlimited risk.
  '1rhguec5b63': '買入的認沽期權會從下跌中獲利，最多只會輸掉期權金。無備兌沽出認購期權雖然也會從下跌中獲利，但風險沒有上限。',
  // You own 100 shares and expect the price to drift sideways for a month. You would like some income from them.
  'da47fm15de': '你持有 100 股，預期價格會在一個月內橫行。你希望從中賺取一些收入。',
  // Selling a call against shares you own collects premium. You give up gains above the strike, which you do not expect anyway.
  '1f6iwfqt1k6': '以持有的股票沽出認購期權可以收取期權金。你放棄了高於行使價的升幅，但你本來就不預期會升到那裡。',
  // You own shares you want to keep for years, but you are worried about a sharp drop over the next two months.
  'fsszuwqg9o': '你持有想長期持有的股票，但擔心未來兩個月會急跌。',
  // A bought put is insurance: whatever happens you can sell at the strike. A covered call would add income but gives no protection against a large fall.
  '2dcwfdp4hde': '買入的認沽期權就是保險：無論發生甚麼，你都可以按行使價賣出。備兌認購期權雖然增加收入，但對大跌毫無保護。',
  // You like a stock at $100 but think it is a little expensive. You would happily buy it at $95, and have the cash ready.
  'rh4w1w8c7q': '你喜歡一隻 $100 的股票，但覺得它有點貴。你樂意在 $95 買入，而且已準備好現金。',
  // Selling the 95 put pays you a premium to wait. Either it expires and you keep the premium, or you buy the stock at 95, below today's price.
  'sbt7pmd4zd': '沽出行使價 95 的認沽期權，讓你在等待期間收取期權金。要麼期權到期、你保留期權金；要麼你以 95 買入股票，低於今日的價格。',
  // You expect a modest rise of about 5% to 10% and want to pay less than a plain call would cost.
  'j0ev6n5zy3': '你預期溫和上升約 5% 至 10%，並希望付出比單純買入認購期權更少的成本。',
  // Selling a higher-strike call pays for part of the call you buy. The gain is capped at the higher strike, which fits a modest target.
  '22iigsr16k1': '沽出較高行使價的認購期權，可以支付你買入那張認購期權的部分成本。收益在較高行使價封頂，正好配合溫和的目標。',
  // You expect a modest decline of about 5% to 10% and want a cheaper bet than buying a put outright.
  'lp3xd8paih': '你預期溫和下跌約 5% 至 10%，並希望用比直接買入認沽期權更便宜的方式押注。',
  // Selling a lower-strike put pays for part of the put you buy. Profit is capped at the lower strike, which fits a modest decline.
  '2ctdr2wmdh5': '沽出較低行使價的認沽期權，可以支付你買入那張認沽期權的部分成本。盈利在較低行使價封頂，正好配合溫和的跌幅。',
  // A court ruling next week will send a stock sharply up or sharply down. You have no idea which. Implied volatility is still low.
  '1lbflen1z1u': '下星期的一個法庭裁決會令一隻股票急升或急跌。你完全不知道是哪一個。引伸波幅仍然偏低。',
  // A straddle holds a call and a put, so it profits from a large move either way. Low implied volatility means the options are not yet expensive.
  'pm2kcc8kqs': '跨式同時持有認購和認沽期權，所以無論哪個方向大幅波動都會獲利。引伸波幅低代表期權還未變得昂貴。',
  // You expect an enormous move in either direction and want to pay as little as possible for the bet.
  '10zw39732xm': '你預期任何一個方向都會有巨大的波動，並希望押注的成本盡量低。',
  // A strangle uses out-of-the-money options, so it costs less than a straddle. It needs a bigger move to pay, which is what you expect.
  'dcovpzfdoy': '勒束式使用價外期權，所以成本比跨式低。它需要更大的波動才會獲利，而這正是你的預期。',
  // A stock has been stuck between 90 and 110 for months and you expect that to continue. Implied volatility is high. You want your maximum loss capped.
  '18pivjdpgzf': '一隻股票幾個月來都困在 90 至 110 之間，你預期會繼續這樣。引伸波幅高企。你希望最大虧損有上限。',
  // An iron condor collects premium if the price stays in a range, and the bought outer options cap the loss. High implied volatility means a larger credit.
  '1s9e705vafc': '如果價格留在區間內，鐵兀鷹就能收取期權金，而買入的外側期權會限制虧損。引伸波幅高代表收到的淨收入更多。',
  // You expect a stock to finish the month almost exactly at 100 and want a small, cheap bet with a large payoff if you are right.
  '23tkie2x8le': '你預期一隻股票月底會收在幾乎剛好 100，並希望用一個細小而便宜的注碼，在判斷正確時獲得大回報。',
  // A butterfly costs a small debit and pays most when the price ends at the middle strike. It loses only that debit if the price ends far away.
  'vz0sxewt57': '蝶式只需少量淨支出，價格收在中間行使價時回報最大。如果價格收在很遠的地方，也只會輸掉那筆淨支出。',
  // You expect a stock to sit still for the next few weeks, then possibly move later in the year. You expect implied volatility to rise.
  '1l3tsuwgo4y': '你預期一隻股票未來幾星期會原地不動，然後在年內較後時間可能出現走勢。你預期引伸波幅會上升。',
  // A calendar sells fast-decaying near-term premium and keeps a longer-dated option that gains if volatility rises. An iron condor loses when volatility rises.
  '17r260xpud8': '日曆價差沽出時間值損耗快的近期期權金，同時保留一張在波幅上升時會升值的遠期期權。鐵兀鷹則會在波幅上升時虧損。',
  // You think a stock will stay above 95 for the next month. You want to be paid for that view with a capped loss if you are wrong.
  '707fuaw1q6': '你認為一隻股票未來一個月會保持在 95 之上。你希望這個看法能帶來收入，而判斷錯誤時虧損有上限。',
  // Selling the 95 put and buying a lower put collects a credit that you keep if the price stays above 95. The bought put caps the loss.
  'vrk947kkvp': '沽出行使價 95 的認沽期權並買入一張較低行使價的認沽期權，可以收取一筆淨收入，只要價格保持在 95 之上就能保留。買入的認沽期權限制了虧損。',
  // Which of these has a loss that can grow without limit if you are wrong?
  '1jcjeu4hlar': '以下哪一個策略在判斷錯誤時，虧損可以無限擴大？',
  // An uncovered short call must deliver at the strike something that could cost any amount to buy. The other three all have a fixed maximum loss.
  'y4fdu670uy': '無備兌沽出的認購期權必須按行使價交付一樣可能要花任何價錢才能買到的東西。其餘三個策略都有固定的最大虧損。',
  // EMA crossover
  'pdtw34zyq6': 'EMA 交叉',
  // Trend following. Buy when the faster average (20) crosses above the slower one (50), which says recent prices are rising faster than older ones. Sell when it crosses back. Expect many small losses in sideways markets and a few large wins in trends.
  '109dqyaiu3x': '順勢交易。當較快的平均線（20）向上穿越較慢的一條（50）時買入，代表近期價格升得比之前的快。當它反向穿越時賣出。預期在橫行市中會有很多小虧損，在趨勢中則有幾次大勝。',
  // RSI mean reversion
  '1m7pyqrce6d': 'RSI 均值回歸',
  // Buys weakness. Enter when RSI drops below 30 (oversold), on the bet that a sharp fall tends to bounce. Exit once RSI recovers above 55. The stop-loss matters here: in a real downtrend, oversold can stay oversold.
  '1om4jx8q4yn': '買入弱勢。當 RSI 跌穿 30（超賣）時入場，押注急跌之後往往會反彈。RSI 回升至 55 以上時出場。這裡止蝕很重要：在真正的下跌趨勢中，超賣可以一直超賣。',
  // Bollinger breakout
  'fok9b5cgew': '保力加突破',
  // Buys strength. Enter when the close breaks above the upper Bollinger Band, which means price has moved unusually far up for recent conditions. Exit when it falls back below the middle band. Many breakouts fail, so the stop-loss keeps the failures small.
  '2c9thul4k27': '買入強勢。當收市價突破保力加通道上軌時入場，代表價格相對近期情況異常地向上移動。跌回中軌以下時出場。很多突破都會失敗，所以止蝕能令失敗的損失保持細小。',
  // MACD crossover
  '27ba2jn5h9i': 'MACD 交叉',
  // Momentum. Buy when the MACD line crosses above its signal line, a sign that upward momentum is building. Sell when it crosses back below. Reacts faster than the EMA crossover, so it trades more often and pays more in fees.
  '6g8l0kvoi6': '動能。當 MACD 線向上穿越訊號線時買入，這是向上動能正在增強的跡象。反向穿越時賣出。它比 EMA 交叉反應更快，所以交易更頻密，手續費也更多。',
  // Pullback in an uptrend
  'zki9olero5': '上升趨勢中的回調',
  // Two conditions together. Only buy when price is above its 200-period average (the long-term trend is up) and RSI has dipped below 40 (a short-term pullback). Exit when RSI recovers above 65, or at the stop-loss. Shows how a trend filter changes a mean-reversion entry.
  'xb9582g25s': '兩個條件同時成立。只在價格高於 200 週期平均線（長期趨勢向上）而且 RSI 跌穿 40（短期回調）時買入。RSI 回升至 65 以上或觸及止蝕時出場。示範趨勢過濾器如何改變均值回歸的入場。',
  // Donchian breakout (turtle)
  '20ftnzz7kdy': '唐奇安突破（海龜）',
  // Classic trend following. Buy when the close makes a new 20-candle high, and sell when it makes a new 10-candle low. It loses small and often in ranges and depends on a few long trends, so judge it over many trades and several markets.
  '29jwiixmx3y': '經典順勢交易。收市價創 20 支陰陽燭新高時買入，創 10 支陰陽燭新低時賣出。它在區間市中經常小輸，依賴少數幾段長趨勢，所以要以大量交易和多個市場來評價它。',
  // VWAP reclaim
  'x9o1gycxdn': '重奪 VWAP',
  // A day-trading idea. Buy when the close crosses back above VWAP while price is above its 50-period average, on the view that buyers have taken control again. Exit when it closes back below VWAP, or at the stop-loss. On daily candles VWAP restarts each month; on intraday candles, each day.
  '1rne4h5ei4i': '日內交易的想法。當價格高於 50 週期平均線、收市價重新升穿 VWAP 時買入，認為買方再次取得控制。收市跌回 VWAP 以下或觸及止蝕時出場。在日線陰陽燭上 VWAP 每月重新計算；在日內陰陽燭上則每日重新計算。',
  // Opening range breakout
  '878flwoo8k': '開市區間突破',
  // A day-trading setup that needs intraday candles: choose a crypto symbol with 5 or 15-minute candles. Buy when the close breaks above the high of the first hour of the UTC day. Exit when it closes back below the range low, at the 1.5% stop-loss or at the 3% target. On daily candles it never trades, because there is no opening range to form.
  '1tpqjdv3jer': '需要日內陰陽燭的日內交易形態：請選擇使用 5 或 15 分鐘陰陽燭的加密貨幣品種。當收市價突破 UTC 日首一小時的高位時買入。收市跌回區間低位以下、觸及 1.5% 止蝕或 3% 目標時出場。在日線陰陽燭上它永遠不會交易，因為無法形成開市區間。',
} satisfies Record<string, string>;

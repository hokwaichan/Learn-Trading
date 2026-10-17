// Traditional Chinese for content/indicators.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // The average closing price over the last N candles. Smooths out noise so the trend is easier to see.
  '2eu4u6pvi7b': '最近 N 支陰陽燭的平均收市價。它把雜訊平滑掉，令趨勢更容易看見。',
  // The average price over a recent stretch of time. Because it averages many candles, it moves slowly and shows the general direction of price rather than every wiggle.
  'huuls1lbc4': '最近一段時間的平均價格。因為它平均了很多支陰陽燭，所以移動得慢，顯示的是價格的大致方向，而不是每一下起伏。',
  // Add up the closing prices of the last N candles and divide by N. With a period of 20, each point on the line is the average of the 20 most recent closes. Every close in the window counts equally.
  '27f7a9x9cck': '把最近 N 支陰陽燭的收市價加起來再除以 N。若週期為 20，線上每一點都是最近 20 個收市價的平均。窗口內每個收市價的比重都一樣。',
  // Price above a rising average suggests an uptrend; price below a falling average suggests a downtrend.
  '10wo0zv1m0z': '價格高於上升中的平均線代表上升趨勢；價格低於下跌中的平均線代表下跌趨勢。',
  // Price crossing the average is read as a possible change of direction.
  '1wk4n7ft5sv': '價格穿越平均線被解讀為方向可能改變。',
  // A shorter average crossing above a longer one (for example 50 over 200) is called a golden cross; crossing below is a death cross.
  'mhen34fqaz': '較短的平均線向上穿越較長的一條（例如 50 穿越 200）叫黃金交叉；向下穿越則叫死亡交叉。',
  // In a trend, price often pulls back to the average and then continues, so some traders treat it as a moving support or resistance level.
  'e6cwyybal1': '在趨勢中，價格常常回調到平均線然後繼續，所以有些交易者把它當作移動的支持位或阻力位。',
  // It lags. The average only turns after price has already turned, so signals come late.
  '16nzc7rfofr': '它會滯後。價格已經轉向之後，平均線才會轉，所以訊號來得遲。',
  // In a sideways market price crosses the average again and again, giving one false signal after another. This is called getting whipsawed.
  '1m5nenm0gf7': '在橫行市中，價格會一次又一次穿越平均線，產生一個接一個的假訊號。這叫被來回打臉。',
  // The period is a choice, not a law. A 20-period and a 50-period average can disagree.
  'skj02h8gcl': '週期是一個選擇，不是定律。20 週期和 50 週期的平均線可以給出不同的結論。',
  // A moving average that gives recent candles more weight, so it reacts faster than the simple one.
  '1rpvd7eog12': '給近期陰陽燭較大比重的移動平均線，所以反應比簡單移動平均線快。',
  // The average price over a recent stretch of time, like a simple moving average, but weighted so that the newest candles matter most. It follows price more closely.
  'rro89pfnob': '與簡單移動平均線一樣，是最近一段時間的平均價格，但經過加權，令最新的陰陽燭最重要。它更貼近價格。',
  // Start from a simple average of the first N closes. From then on, each new value moves the previous one part of the way towards the latest close: new EMA = old EMA + k x (close - old EMA), where k = 2 / (N + 1). With N = 20, k is about 0.095, so each new close pulls the line about 9.5% of the way towards itself.
  'r6b7b0j39c': '先由首 N 個收市價的簡單平均開始。之後每個新數值都會把上一個數值向最新收市價拉近一部分：新 EMA = 舊 EMA + k x（收市價 - 舊 EMA），其中 k = 2 / (N + 1)。若 N = 20，k 約為 0.095，所以每個新收市價會把線向自己拉近約 9.5%。',
  // Used like a simple moving average: price above a rising EMA suggests an uptrend, below a falling EMA a downtrend.
  'yp0d6vw8re': '用法與簡單移動平均線相同：價格高於上升中的 EMA 代表上升趨勢，低於下跌中的 EMA 代表下跌趨勢。',
  // A fast EMA crossing a slow EMA (for example 12 and 26) is a common entry and exit rule.
  'efzeut4sv3': '快速 EMA 穿越慢速 EMA（例如 12 和 26）是常見的入場和出場規則。',
  // Because it reacts sooner, traders on short timeframes often prefer it.
  '24ksrk3k13y': '因為它反應較快，短線交易者通常較喜歡用它。',
  // Still lags, only less than a simple average.
  '2bekcimge3k': '它仍然滯後，只是比簡單平均少一點。',
  // Reacting faster also means reacting to noise: more signals, and more of them false.
  '2347wi08hrz': '反應較快也代表會對雜訊作出反應：訊號更多，假訊號也更多。',
  // Whipsaws in sideways markets, just like the simple average.
  '1y724jhudgz': '在橫行市中和簡單平均一樣會被來回打臉。',
  // A band around a moving average that widens when price is jumpy and narrows when it is calm.
  'q7ndzjdfkq': '圍繞移動平均線的通道，價格跳動時變闊，平靜時收窄。',
  // How far price is from its recent average, measured against how much it has been moving lately. The bands show what counts as an unusually high or low price right now.
  '28npuxx80u8': '價格離近期平均有多遠，並以它最近的波動程度來衡量。通道顯示目前怎樣才算異常地高或低的價格。',
  // The middle band is a simple moving average, normally of 20 closes. Work out the standard deviation of those same closes (a measure of how spread out they are). The upper band is the average plus 2 standard deviations and the lower band is the average minus 2.
  'st5brhrhbx': '中軌是簡單移動平均線，通常為 20 個收市價。計算這些收市價的標準差（量度它們有多分散）。上軌是平均加 2 個標準差，下軌是平均減 2 個標準差。',
  // Price touching the upper band is high relative to recent prices; touching the lower band is low. In a sideways market traders look for a move back towards the middle.
  '1sgvhwy5k9o': '價格觸及上軌代表相對近期價格偏高；觸及下軌代表偏低。在橫行市中，交易者會留意價格回到中軌。',
  // Very narrow bands (a squeeze) mean volatility is unusually low. A sharp move often follows, though the bands do not say in which direction.
  's67067ew5x': '非常窄的通道（收窄擠壓）代表波幅異常低。之後常會出現急劇的走勢，但通道不會告訴你方向。',
  // In a strong trend price can ride along one band for a long time. That is a sign of strength, not a reversal signal.
  '251disdpu3j': '在強勁的趨勢中，價格可以沿著其中一條軌道走很久。這是強勢的表現，不是反轉訊號。',
  // Touching a band is not a signal to trade on its own. Prices outside the bands can keep going.
  '1uowf9n650l': '單單觸及軌道本身不是交易訊號。價格在通道外也可以繼續走。',
  // The bands widen after a big move, so they describe what has happened rather than predict it.
  '1u3mlqsf22i': '大走勢之後通道才會變闊，所以它描述的是已經發生的事，而不是預測。',
  // It says nothing about direction.
  '1d11qs15b5k': '它完全沒有說明方向。',
  // The average price actually paid this session, counting busy candles more than quiet ones.
  '122o45u5ynn': '這個時段實際成交的平均價格，成交活躍的陰陽燭比清淡的佔較大比重。',
  // The average price at which trading has taken place during the session, weighted by volume. It answers: across everything traded so far, what was the typical price paid?
  '1a485fd51b1': '這個時段內以成交量加權的平均成交價。它回答的問題是：到目前為止所有成交中，典型的成交價是多少？',
  // For each candle take the typical price (high + low + close) / 3 and multiply it by that candle volume. Keep a running total of those, and a running total of volume, and divide one by the other. Here the totals restart every day (UTC) on intraday charts and every calendar month on daily charts.
  '21mz2c3yip5': '每支陰陽燭取典型價格（最高 + 最低 + 收市）/ 3，再乘以該陰陽燭的成交量。分別累計這些乘積和成交量，再把前者除以後者。這裡在日內圖表上每日（UTC）重新計算，在日線圖上每個曆月重新計算。',
  // Price above VWAP means the average buyer this session is in profit, which traders read as buyers in control; below means sellers are.
  '1flczav1pwf': '價格高於 VWAP 代表這個時段的平均買家正在獲利，交易者視之為買方主導；低於則代表賣方主導。',
  // Day traders often treat VWAP as a fair price: buying below it or selling above it is getting a better-than-average deal.
  '1n1tq8trub7': '日內交易者常把 VWAP 當作公平價：低於它買入或高於它賣出，就是比平均更好的成交。',
  // Price returning to VWAP after moving away is a common intraday support or resistance level.
  'acaxs8gysx': '價格離開 VWAP 後再回來，是常見的日內支持位或阻力位。',
  // It needs volume data. For instruments without it, such as the bundled EUR/USD history, it cannot be drawn.
  '29rvpj0vwir': '它需要成交量數據。沒有成交量的品種（例如內置的歐元／美元歷史）就畫不出來。',
  // It restarts each session, so it jumps at the session boundary and means little in the first few candles.
  '1fbqk9awr0m': '它每個時段重新計算，所以在時段交界會跳動，最初幾支陰陽燭的意義不大。',
  // Late in a session it barely moves, because one new candle is small next to everything already counted.
  'kv66omyk3i': '到時段後段它幾乎不動，因為一支新陰陽燭相比已計入的一切實在太少。',
  // The highest high and lowest low of the last N candles. Shows when price makes a genuine new high or low.
  '5hhgwb28c3': '最近 N 支陰陽燭的最高價和最低價。顯示價格何時創出真正的新高或新低。',
  // The top and bottom of the recent trading range. Price closing outside it has gone somewhere it has not been for N candles.
  '1f3pryv2u7s': '近期交易區間的頂部和底部。價格收市在通道外，代表它去到了 N 支陰陽燭以來未到過的地方。',
  // The upper line is the highest high of the N candles before the current one; the lower line is the lowest low. The middle line is halfway between. The current candle is left out, so a close above the upper line is a new high for the period.
  'qy9gmzmyij': '上線是目前陰陽燭之前 N 支陰陽燭的最高價；下線是最低價。中線在兩者中間。目前的陰陽燭不計在內，所以收市高於上線就是該期間的新高。',
  // A close above the upper line is a breakout: the classic "turtle" trend-following entry was a 20-day high.
  'lgxl4e6d50': '收市高於上線就是突破：經典的「海龜」順勢入場規則就是 20 日新高。',
  // A close below the lower line is a breakdown, used the same way for shorts or as an exit for longs.
  'eyomaq2lg1': '收市低於下線就是跌破，以同樣方式用作做空，或作為多倉的出場。',
  // The lines mark where stop orders gather, which is where liquidity sweeps happen.
  '6nt3owfdao': '這些線標示止蝕盤聚集的地方，也就是流動性掃蕩發生的地方。',
  // A narrow channel means a quiet market; breakouts from narrow channels tend to travel further.
  '360m39pmfy': '窄的通道代表市場平靜；從窄通道突破的走勢往往走得更遠。',
  // Most breakouts fail. Trend followers using it lose more often than they win and rely on a few large winners.
  '1uv2nj671og': '大部分突破都會失敗。用它的順勢交易者輸的次數比贏的多，靠的是少數大勝。',
  // In a range price touches both lines repeatedly, giving one false signal after another.
  '1kdxwjv883z': '在區間市中，價格會反覆觸及兩條線，產生一個接一個的假訊號。',
  // It only looks at extremes, so one freak wick can hold a line in place for the whole period.
  '1azxdp58hlk': '它只看極端值，所以一條怪異的影線就能令一條線在整段期間停在原位。',
  // Yesterday's high, low and close as lines on today's chart. The levels day traders watch first.
  '1tsohx0gvmc': '昨日的最高、最低和收市價，以線條畫在今日的圖表上。是日內交易者最先留意的價位。',
  // Where the previous day's trading began to fail in each direction, and where it settled. Many traders place stops and breakout orders just beyond these prices.
  '22tggnlzg06': '前一日的交易在每個方向開始失守的地方，以及最後定格的地方。很多交易者會把止蝕盤和突破單放在這些價格之外。',
  // The highest price, lowest price and final price of the previous UTC day, drawn across every candle of the current day. On a daily chart this is simply the previous candle.
  '12qqmyeei5d': '前一個 UTC 日的最高價、最低價和最後價格，橫跨今日每一支陰陽燭畫出。在日線圖上，這就是上一支陰陽燭。',
  // Price holding above yesterday's high suggests buyers are in control today; holding below yesterday's low suggests sellers are.
  'l6iq0zsnzj': '價格守在昨日高位之上，代表買方今日主導；守在昨日低位之下，代表賣方主導。',
  // A poke beyond the level that quickly reverses is a liquidity sweep, often followed by a move the other way.
  '18ln5dw58bi': '價格穿越該價位後很快反轉，就是流動性掃蕩，之後常會出現反方向的走勢。',
  // Yesterday's close marks whether today is up or down; price often returns to it in a quiet session.
  '289cl89omcm': '昨日收市價標示今日是升還是跌；在平靜的時段，價格常常會回到這裡。',
  // Crypto never closes, so the day boundary (midnight UTC) is a convention, not a real open and close.
  '14caxk8c5rh': '加密貨幣從不休市，所以日子的分界（UTC 午夜）只是慣例，並不是真正的開市和收市。',
  // The levels are widely known, which is exactly why price often runs through them briefly to trigger orders.
  '259yjp8ubv7': '這些價位人所共知，正因如此，價格常常短暫穿越它們去觸發訂單。',
  // They say nothing about direction on their own; they are places to watch, not signals.
  '3hzwfhqt0j': '它們本身不說明方向；它們是值得留意的地方，而不是訊號。',
  // The high and low of the first minutes of the day. A break of either is a classic day-trading entry.
  'x1i3fuono9': '當日最初幾分鐘的最高價和最低價。突破任何一邊都是經典的日內交易入場點。',
  // The range set while the day finds its footing. Early trading is busy and two-sided; once it settles, the side that breaks out often sets the tone.
  '1hjhzcmlokx': '當日站穩陣腳時形成的區間。開市初段交投活躍、雙向拉扯；一旦穩定下來，率先突破的一方往往定下當日的基調。',
  // The highest and lowest price during the first N minutes after the start hour, then held as two lines for the rest of the day. The lines only appear once the opening period is over. Needs candles shorter than the range.
  '1zkxh62dg98': '開始時間後最初 N 分鐘內的最高價和最低價，之後以兩條線保留至當日結束。開市時段完結後這兩條線才會出現。需要比區間更短的陰陽燭。',
  // A close above the range high is an opening-range breakout to the upside; below the range low, to the downside.
  '1yq4p2tr786': '收市高於區間高位即為向上的開市區間突破；低於區間低位即為向下突破。',
  // The opposite side of the range is the natural stop-loss, which fixes the risk before entry.
  'ro19c3b8kn': '區間的另一邊是自然的止蝕位，令入場前已確定風險。',
  // A break that fails and comes back through the range often runs to the other side.
  'y103dktda3': '突破失敗並穿回區間的走勢，常常會一直走到另一邊。',
  // On quiet days price chops across both lines and stops out breakouts in both directions.
  '2lqmxwg7v': '在平靜的日子，價格會在兩條線之間來回，令兩個方向的突破都被止蝕。',
  // A wide opening range means a wide stop, so the position must be smaller.
  '1ofrld2wb29': '開市區間闊，止蝕也要闊，所以持倉必須較小。',
  // For crypto the start of the day is a convention. Set the start hour to the session you actually trade.
  '1szg2zagezg': '對加密貨幣來說，一天的開始只是慣例。請把開始時間設為你實際交易的時段。',
  // The average volume over the last N candles, drawn over the volume bars. Shows what normal trading looks like.
  '13pmwp4msmj': '最近 N 支陰陽燭的平均成交量，畫在成交量柱上。顯示正常的交投是怎樣。',
  // The typical amount traded per candle recently, so you can tell whether the current candle is unusually busy or quiet.
  '1s95v5k0wm2': '近期每支陰陽燭的典型成交量，讓你分辨目前這支陰陽燭是否異常活躍或清淡。',
  // Add up the volume of the last N candles and divide by N.
  'ww1mkulw5r': '把最近 N 支陰陽燭的成交量加起來再除以 N。',
  // A price move on volume well above the average has many traders behind it and is taken more seriously.
  '1jlx0led6j5': '在遠高於平均的成交量下出現的價格走勢，背後有很多交易者支持，會被看得更重。',
  // A breakout on volume below the average is more likely to fail.
  '20ljzup2pzl': '成交量低於平均的突破較容易失敗。',
  // Volume drying up during a pullback, then expanding as the trend resumes, is a healthy sign for the trend.
  '1w0h6x5izs4': '回調時成交量萎縮，趨勢恢復時成交量擴大，對趨勢來說是健康的跡象。',
  // Volume shows how much traded, not who was more eager, buyers or sellers.
  '1jadip8rxsq': '成交量顯示成交了多少，而不是買方還是賣方更積極。',
  // Crypto volume differs between exchanges; this shows one exchange only.
  '1g275vnk9ke': '不同交易所的加密貨幣成交量各有不同；這裡只顯示一個交易所。',
  // Volume has a daily rhythm (quiet at some hours), so a bar can be above average simply because of the time of day.
  '19l573ka4q9': '成交量有每日的節奏（某些時段比較清淡），所以一支柱高於平均，可能只是因為時間。',
  // A 0 to 100 gauge of how strongly price has been rising compared with falling. Above 70 is called overbought, below 30 oversold.
  'xz2uu49k5b': '量度價格上升相對下跌有多強勁的 0 至 100 指標。高於 70 叫超買，低於 30 叫超賣。',
  // Momentum: how large recent gains have been compared with recent losses. A high reading means the up moves have dominated; a low reading means the down moves have.
  '13mwf5sc5w': '動能：近期升幅相對近期跌幅有多大。讀數高代表上升主導；讀數低代表下跌主導。',
  // Look at the change from each close to the next over the last 14 candles. Average the gains, and separately average the losses. RSI = 100 - 100 / (1 + average gain / average loss). If gains and losses are equal the result is 50. After the first value the averages are smoothed, so one candle changes them only a little.
  '191j6ddgtqq': '看最近 14 支陰陽燭中每個收市價到下一個的變化。分別計算升幅的平均和跌幅的平均。RSI = 100 - 100 / (1 + 平均升幅 / 平均跌幅)。如果升幅和跌幅相等，結果就是 50。第一個數值之後，平均值會經過平滑處理，所以一支陰陽燭只會令它們小幅改變。',
  // Above 70 is called overbought: price has risen fast and may be due a pause. Below 30 is oversold.
  '8k32nhsor2': '高於 70 叫超買：價格升得很快，可能需要歇一歇。低於 30 叫超賣。',
  // Above 50 leans bullish and below 50 leans bearish; some traders use the 50 line as a trend filter.
  'f55uo86ba0': '高於 50 傾向看漲，低於 50 傾向看跌；有些交易者把 50 線當作趨勢過濾器。',
  // Divergence: price makes a new high but RSI makes a lower high. This suggests the move is running out of energy.
  'ws37xf5x8g': '背馳：價格創出新高，RSI 卻出現更低的高點。這暗示走勢正在耗盡動力。',
  // Overbought does not mean about to fall. In a strong uptrend RSI can stay above 70 for weeks while price keeps climbing.
  '24nprzc5w0w': '超買不代表即將下跌。在強勁的上升趨勢中，RSI 可以連續幾星期停留在 70 以上，而價格繼續上升。',
  // The 70 and 30 levels are conventions, not thresholds with any special property.
  '1vb6ifoz7d9': '70 和 30 只是慣例，並不是有任何特殊性質的門檻。',
  // Divergences are easy to see afterwards and often fail in real time.
  '2dkaa0rhvf4': '背馳事後很容易看見，但在實時中常常失效。',
  // The gap between a fast and a slow moving average. Shows whether momentum is building or fading.
  '1ny0sdfjsrd': '快速和慢速移動平均線之間的差距。顯示動能是在增強還是減弱。',
  // The distance between a fast and a slow exponential moving average. When the fast one pulls away from the slow one, momentum is building; when they converge, it is fading.
  'n83yb7frvu': '快速和慢速指數移動平均線之間的距離。快線拉開與慢線的距離時，動能在增強；兩者靠攏時，動能在減弱。',
  // MACD line = 12-period EMA minus 26-period EMA. Signal line = 9-period EMA of the MACD line. Histogram = MACD line minus signal line. The bars are positive when MACD is above its signal and negative when below.
  '1mvlvbpj6ug': 'MACD 線 = 12 週期 EMA 減 26 週期 EMA。訊號線 = MACD 線的 9 週期 EMA。柱狀圖 = MACD 線減訊號線。MACD 高於訊號線時柱為正，低於時為負。',
  // MACD crossing above its signal line is read as momentum turning up; crossing below as turning down.
  '1e18d9vr6c': 'MACD 向上穿越訊號線被解讀為動能轉強；向下穿越則為轉弱。',
  // MACD above zero means the fast average is above the slow one (an uptrend); below zero the opposite.
  '1x442uryzpb': 'MACD 高於零代表快線平均高於慢線平均（上升趨勢）；低於零則相反。',
  // Histogram bars shrinking towards zero show a move losing momentum before the lines actually cross.
  '1buttk02ips': '柱狀圖逐漸向零收縮，代表走勢在兩線真正交叉之前已經失去動能。',
  // It is built from moving averages, so it lags twice over. Crossovers often come after much of the move.
  'tysmvvy2ds': '它由移動平均線構成，所以滯後兩次。交叉往往在走勢的大部分完成後才出現。',
  // Many false crossovers in sideways markets.
  '1subtl0kvpc': '在橫行市中會有很多假交叉。',
  // Its values are in price units, so readings cannot be compared between a $100 stock and a $60,000 coin.
  'lvp7gzb7xj': '它的數值以價格單位計算，所以 $100 的股票和 $60,000 的加密貨幣之間的讀數無法比較。',
  // A 0 to 100 gauge of where the close sits in the recent high-low range. Above 80 is overbought, below 20 oversold.
  '9zfmz19mlr': '顯示收市價在近期高低區間中位置的 0 至 100 指標。高於 80 為超買，低於 20 為超賣。',
  // Where the latest close sits between the lowest low and the highest high of the last 14 candles. Near 100 means price is closing at the top of its recent range; near 0, at the bottom.
  '227mmjty2ax': '最新收市價位於最近 14 支陰陽燭最低價和最高價之間的哪裡。接近 100 代表價格收在近期區間的頂部；接近 0 則在底部。',
  // %K = 100 x (close - lowest low) / (highest high - lowest low) over the last 14 candles, then smoothed with a 3-candle average. %D is a 3-candle average of %K and acts as its signal line.
  '1k3qp8dab2w': '%K = 100 x（收市價 - 最低價）/（最高價 - 最低價），以最近 14 支陰陽燭計算，再以 3 支陰陽燭平均平滑。%D 是 %K 的 3 支陰陽燭平均，作為它的訊號線。',
  // Above 80 is called overbought and below 20 oversold.
  '24d70c78b5o': '高於 80 叫超買，低於 20 叫超賣。',
  // %K crossing above %D while both are below 20 is read as a buy signal; crossing below while above 80 as a sell signal.
  'h80s5zq2l4': '兩者都低於 20 時 %K 向上穿越 %D 被解讀為買入訊號；兩者都高於 80 時向下穿越被解讀為賣出訊號。',
  // Works best when price is moving sideways in a range.
  '261njgdctr1': '在價格於區間內橫行時最有效。',
  // In a strong trend it pins near 100 or 0 and stays there, so overbought and oversold readings keep failing.
  '1mb52t6eam7': '在強勁的趨勢中，它會貼近 100 或 0 並停留在那裡，所以超買和超賣讀數會一直失效。',
  // It is very quick and jumpy, which means frequent false signals.
  '1oqmowkg57i': '它非常快而且跳動大，代表經常出現假訊號。',
  // It only knows about the last 14 candles; a wider view can look completely different.
  'dnrvq7ncfl': '它只知道最近 14 支陰陽燭；放闊視野後可能完全不同。',
  // How far price typically moves in one candle, in price units. Used for placing stops and sizing positions.
  '2o4gfsl4ap': '價格在一支陰陽燭內通常移動多遠，以價格單位計算。用來放置止蝕和決定持倉規模。',
  // Volatility: the typical size of one candle, including any gap from the previous close. It says how much price moves, not which way.
  '4m4qjw0yz6': '波幅：一支陰陽燭的典型大小，包括與上一個收市價之間的任何裂口。它說明價格移動多少，而不是向哪個方向。',
  // For each candle take the true range: the largest of (high - low), (high - previous close) and (previous close - low). ATR is a smoothed average of the true range over 14 candles.
  'ra4orrzy61': '每支陰陽燭取真實波幅：（最高 - 最低）、（最高 - 前收市）和（前收市 - 最低）三者中最大的一個。ATR 是 14 支陰陽燭真實波幅的平滑平均。',
  // Stop placement: a stop-loss closer than about one ATR from your entry sits inside normal noise and is likely to be hit by chance. Many traders use 1.5 to 3 ATR.
  'aqom83zdtc': '放置止蝕：離入場價少於約一個 ATR 的止蝕位於正常雜訊之內，很可能會被隨機觸發。很多交易者用 1.5 至 3 個 ATR。',
  // Position sizing: when ATR is high, trade smaller so the same dollar risk covers the wider stop.
  '5svzvujwg9': '持倉規模：ATR 高時交易規模要小一點，令同樣的金額風險能覆蓋較闊的止蝕。',
  // A rising ATR means the market is getting more volatile; a falling ATR means it is calming down.
  '1az6ut91nbj': 'ATR 上升代表市場愈來愈波動；ATR 下降代表市場正在平靜下來。',
  // It has no direction. A high ATR can come with a rally or a crash.
  '23vsixqm3ii': '它沒有方向。高 ATR 可以伴隨急升，也可以伴隨急跌。',
  // It describes recent candles; volatility can change abruptly on news.
  '45hedmiwdv': '它描述的是近期的陰陽燭；波幅可以因為消息而突然改變。',
  // It is in price units, so compare it with the price (ATR as a percentage) rather than between instruments.
  '1nur3thdpvu': '它以價格單位計算，所以應該拿它與價格比較（ATR 佔價格的百分比），而不是在不同品種之間比較。',
} satisfies Record<string, string>;

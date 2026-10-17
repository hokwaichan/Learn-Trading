// Traditional Chinese for content/patterns.ts.
// Keyed by textKey(english), with the English above each entry. The test in
// src/i18n/i18n.test.ts prints any entry that is missing after the English changes.
export default {
  // Doji
  'lln2fctvkm': '十字星',
  // A candle that opens and closes at almost the same price, so its body is a thin line.
  '229e7aejljt': '開市價和收市價幾乎相同的陰陽燭，所以實體只是一條細線。',
  // Buyers and sellers ended the period in a draw. After a strong move it suggests the move is tiring.
  '1xtmizlo8tk': '買賣雙方在這段時間打成平手。在強勁走勢之後出現，暗示走勢開始疲倦。',
  // It is very common and says nothing about direction. On its own it is not a signal.
  'pijnnjelmk': '它非常常見，並不說明方向。單憑它並不是訊號。',
  // Hammer
  'w3ye98d4ey': '錘頭',
  // A small body at the top with a lower wick at least twice as long, appearing after a decline.
  'g0dkt36of0': '實體細小且位於頂部，下影線至少是實體的兩倍長，出現在下跌之後。',
  // Price was pushed down hard and buyers brought it all the way back. It can mark buyers stepping in.
  'v1vtx7d4pn': '價格被大力壓低，買方又把它一路推回去。這可能代表買方入場。',
  // Needs a decline before it and ideally a higher close on the next candle. In a strong downtrend hammers fail often.
  'cw2xfo1i7p': '之前需要有一段下跌，最好下一支陰陽燭收市更高。在強勁的下跌趨勢中，錘頭經常失效。',
  // Shooting star
  'cdwugpaglq': '射擊之星',
  // A small body at the bottom with an upper wick at least twice as long, appearing after a rise.
  '2012h9ju6lk': '實體細小且位於底部，上影線至少是實體的兩倍長，出現在上升之後。',
  // Price was pushed up hard and sellers brought it all the way back. It can mark sellers taking control.
  '1fz8yevmf6r': '價格被大力推高，賣方又把它一路壓回去。這可能代表賣方取得主導。',
  // Needs a rise before it and ideally a lower close on the next candle. In a strong uptrend it often fails.
  '1us87xlpnhv': '之前需要有一段上升，最好下一支陰陽燭收市更低。在強勁的上升趨勢中它經常失效。',
  // Marubozu
  '189oug5poew': '光頭光腳陰陽燭',
  // A large candle that is almost all body, with little or no wick at either end.
  '2cnpo2pq8ea': '幾乎全是實體的大陰陽燭，兩端很少或沒有影線。',
  // One side was in control from the open to the close. It suggests the move may continue in the direction of the candle.
  '1uchq9oucy9': '由開市到收市都是同一方主導。暗示走勢可能沿陰陽燭方向延續。',
  // After a long run, one more huge candle can be the last burst of a move rather than the start of one.
  '1jnf540b2v1': '經過一段長走勢後，再多一支巨型陰陽燭可能是走勢最後的爆發，而不是開始。',
  // Bullish engulfing
  '20wajkwzla9': '看漲吞沒',
  // After a decline, a down candle followed by a larger up candle whose body completely covers it.
  'cs0q7gfmbu': '下跌之後，一支下跌陰陽燭之後出現一支更大的上升陰陽燭，其實體完全覆蓋前者。',
  // Sellers were in charge, then buyers overwhelmed them within one period.
  '1y84ohhiio8': '賣方原本主導，之後買方在一段時間內就把他們壓倒。',
  // Common inside ranges, where it means little. Stronger at support and on higher volume.
  '121dnehbreh': '在區間內很常見，在那裡意義不大。出現在支持位、而且成交量較大時會更有力。',
  // Bearish engulfing
  '24ix3uz6mnc': '看跌吞沒',
  // After a rise, an up candle followed by a larger down candle whose body completely covers it.
  '1sgk4zre8xl': '上升之後，一支上升陰陽燭之後出現一支更大的下跌陰陽燭，其實體完全覆蓋前者。',
  // Buyers were in charge, then sellers overwhelmed them within one period.
  'z1lm7he5lx': '買方原本主導，之後賣方在一段時間內就把他們壓倒。',
  // Common inside ranges, where it means little. Stronger at resistance and on higher volume.
  'nw3od3yzre': '在區間內很常見，在那裡意義不大。出現在阻力位、而且成交量較大時會更有力。',
  // Bullish harami
  '28kjcbapiix': '看漲孕線',
  // After a decline, a long down candle followed by a small up candle whose body sits inside the first.
  '1v64mb91seo': '下跌之後，一支長的下跌陰陽燭之後出現一支細小的上升陰陽燭，其實體位於第一支之內。',
  // The selling has stalled. It shows hesitation rather than a takeover by buyers.
  'wo93lss3wk': '賣壓停頓了。它顯示的是猶豫，而不是買方接管。',
  // A weak signal. It says the move paused, not that it reversed; wait for confirmation.
  '1x4wewgv8md': '這是較弱的訊號。它說明走勢停頓，而不是反轉；請等待確認。',
  // Bearish harami
  '297us47qh2r': '看跌孕線',
  // After a rise, a long up candle followed by a small down candle whose body sits inside the first.
  '1wkn9ighn74': '上升之後，一支長的上升陰陽燭之後出現一支細小的下跌陰陽燭，其實體位於第一支之內。',
  // The buying has stalled. It shows hesitation rather than a takeover by sellers.
  'uut85kwud0': '買盤停頓了。它顯示的是猶豫，而不是賣方接管。',
  // Morning star
  '1gitc12qgkm': '早晨之星',
  // After a decline: a long down candle, a small-bodied candle, then a long up candle closing well into the first.
  '1lesfsu4gsj': '下跌之後：一支長的下跌陰陽燭、一支實體細小的陰陽燭，再一支長的上升陰陽燭，收市深入第一支之內。',
  // Selling, a pause, then buying. One of the more reliable candle reversals.
  'bz0w5x7ath': '先賣出，再停頓，然後買入。是較可靠的陰陽燭反轉形態之一。',
  // Rare, and by the time the third candle closes much of the bounce has already happened.
  '21e0hiihifr': '很少見，而且到第三支陰陽燭收市時，反彈的大部分已經發生了。',
  // Evening star
  'ib65dzfrqw': '黃昏之星',
  // After a rise: a long up candle, a small-bodied candle, then a long down candle closing well into the first.
  '2d88mwevu7i': '上升之後：一支長的上升陰陽燭、一支實體細小的陰陽燭，再一支長的下跌陰陽燭，收市深入第一支之內。',
  // Buying, a pause, then selling. One of the more reliable candle reversals.
  'mgqa55il7n': '先買入，再停頓，然後賣出。是較可靠的陰陽燭反轉形態之一。',
  // Rare, and by the time the third candle closes much of the drop has already happened.
  '2e071lpwr00': '很少見，而且到第三支陰陽燭收市時，下跌的大部分已經發生了。',
  // Three white soldiers
  '1oryq4xhasc': '紅三兵',
  // Three long up candles in a row, each opening near the previous body and closing higher.
  'orrftv31dn': '連續三支長的上升陰陽燭，每支都在上一支實體附近開市，並收市更高。',
  // Buyers are firmly in control across three periods.
  'vco9hsrdev': '買方在三段時間內都牢牢控制大局。',
  // After three big candles the move may already be stretched, so entries are late and stops are far away.
  '8wqfz8mx7s': '三支大陰陽燭之後，走勢可能已經走得太遠，所以入場會太遲，止蝕也會很遠。',
  // Three black crows
  '76bvfu4rfd': '三隻烏鴉',
  // Three long down candles in a row, each opening near the previous body and closing lower.
  'w8976zl6a2': '連續三支長的下跌陰陽燭，每支都在上一支實體附近開市，並收市更低。',
  // Sellers are firmly in control across three periods.
  '1r3beo4kb01': '賣方在三段時間內都牢牢控制大局。',
  // After three big candles the move may already be stretched, and a bounce is common.
  'nd4i7yqq40': '三支大陰陽燭之後，走勢可能已經走得太遠，反彈很常見。',
  // Head and shoulders
  'jsw5x3esad': '頭肩頂',
  // Three peaks after an uptrend, the middle one highest, completed by a break below the neckline joining the two lows.
  'owzvgks4kk': '上升趨勢後出現三個峰頂，中間最高，跌穿連接兩個低點的頸線即告完成。',
  // The right shoulder is a lower high: buyers could not reach the previous peak. The neckline break confirms the reversal.
  'u46tlpun19': '右肩是更低的高點：買方未能到達之前的峰頂。跌穿頸線確認反轉。',
  // Many never complete: price bounces off the neckline and the uptrend continues. Wait for the break.
  'lz0mp5fet8': '很多頭肩頂最終沒有完成：價格在頸線反彈，上升趨勢繼續。請等待跌穿。',
  // Inverse head and shoulders
  '1t4xv5jr05j': '頭肩底',
  // Three troughs after a downtrend, the middle one lowest, completed by a break above the neckline joining the two highs.
  'tepwrc82bs': '下跌趨勢後出現三個谷底，中間最低，升穿連接兩個高點的頸線即告完成。',
  // The right shoulder is a higher low: sellers could not reach the previous trough. The neckline break confirms the reversal.
  '1j2kxngdt9m': '右肩是更高的低點：賣方未能到達之前的谷底。升穿頸線確認反轉。',
  // Many never complete. Wait for a close above the neckline.
  '1ur1htzy3u1': '很多頭肩底最終沒有完成。請等待收市高於頸線。',
  // Double top
  'ibuc2k9co0': '雙頂',
  // Two peaks at about the same level with a dip between them, shaped like an M, completed by a break below that dip.
  '283f0xlyog5': '兩個大約同一水平的峰頂，中間有一次回落，形狀像 M，跌穿該回落低點即告完成。',
  // Buyers failed twice at the same resistance. The break of the middle low confirms sellers have taken over.
  '2ebvdplqagc': '買方兩次在同一阻力位失守。跌穿中間的低點確認賣方已經接管。',
  // Two tests of a high are very common in healthy uptrends just before a breakout. It is only a range until the middle low breaks.
  'oaaxc0zqxu': '在健康的上升趨勢中，突破前兩次測試高位是非常常見的。在中間低點被跌穿之前，它只是一個區間。',
  // Double bottom
  '12ru5qpi1lk': '雙底',
  // Two troughs at about the same level with a bounce between them, shaped like a W, completed by a break above that bounce.
  '1rge6wb6ap6': '兩個大約同一水平的谷底，中間有一次反彈，形狀像 W，升穿該反彈高點即告完成。',
  // Sellers failed twice at the same support. The break of the middle high confirms buyers have taken over.
  '7s96o1xa01': '賣方兩次在同一支持位失守。升穿中間的高點確認買方已經接管。',
  // It is only a range until the middle high breaks.
  '11or2szuf0o': '在中間高點被升穿之前，它只是一個區間。',
  // Ascending triangle
  '1cvu3qr42c4': '上升三角形',
  // A flat top with rising lows: resistance at one level while each dip is shallower than the last.
  '1g1nqbu36y9': '平頂加上不斷抬高的低點：阻力位在同一水平，每次回落都比上一次淺。',
  // Buyers are stepping in sooner each time while sellers defend one price. It usually breaks upwards.
  '18z2iq8s7m1': '買方每次都更早入場，賣方則守住同一個價格。通常會向上突破。',
  // It can break down instead. Breakouts late in the triangle, near the point, tend to be weak.
  'gf5kmx05cj': '它也可以向下跌破。在三角形後段、接近尖端時的突破往往較弱。',
  // Descending triangle
  '1p2pyqmrrgq': '下降三角形',
  // A flat bottom with falling highs: support at one level while each bounce is weaker than the last.
  '12x6hkremfs': '平底加上不斷降低的高點：支持位在同一水平，每次反彈都比上一次弱。',
  // Sellers are getting more aggressive while buyers defend one price. It usually breaks downwards.
  '1w23xap4ql8': '賣方愈來愈進取，買方則守住同一個價格。通常會向下跌破。',
  // It can break up instead. Wait for the break.
  '28kuy3o4v3j': '它也可以向上突破。請等待突破。',
  // Symmetrical triangle
  '1iytrrzba5l': '對稱三角形',
  // Falling highs and rising lows converging evenly towards a point.
  '154yxavoq7z': '不斷降低的高點和不斷抬高的低點，均勻地向一點收窄。',
  // Neither side is winning. It tends to break in the direction of the trend that came before.
  '22xc97qgzze': '雙方都沒有佔上風。它往往會沿之前趨勢的方向突破。',
  // It can break either way, and false breaks are common.
  '3eyiflfdy': '它可以向任何一邊突破，而且假突破很常見。',
  // Bull flag
  'a26c749i65': '牛旗',
  // A sharp rise (the flagpole) followed by a short, tight drift downwards or sideways.
  '1z5jfrm18hw': '急升（旗桿）之後，一段短而緊湊的向下或橫向漂移。',
  // The drift is profit-taking, not a change of mind. A break above the flag usually resumes the rise.
  '1l8jo7zt248': '這段漂移只是獲利回吐，而不是改變主意。升穿旗形通常會令升勢恢復。',
  // Needs a real flagpole. A long or deep flag is no longer a pause but a reversal forming.
  '1v2w4nxv7d9': '需要有真正的旗桿。太長或太深的旗形已經不是停頓，而是正在形成反轉。',
  // Bear flag
  '6j32wfu42p': '熊旗',
  // A sharp fall (the flagpole) followed by a short, tight drift upwards or sideways.
  '2258monkmc4': '急跌（旗桿）之後，一段短而緊湊的向上或橫向漂移。',
  // The drift is short-covering, not a change of mind. A break below the flag usually resumes the fall.
  '1bz2wtcbooe': '這段漂移只是空倉回補，而不是改變主意。跌穿旗形通常會令跌勢恢復。',
  // Needs a real flagpole. A long or steep flag may be a reversal forming.
  '53fsudak4d': '需要有真正的旗桿。太長或太陡的旗形可能正在形成反轉。',
  // Rising wedge
  '1ofmf2xe4zh': '上升楔形',
  // Higher highs and higher lows squeezed between two rising, converging lines.
  't8uim0cs4c': '更高的高點和更高的低點，被夾在兩條向上而逐漸匯聚的線之間。',
  // Each push up gains less than the last, so the advance is tiring. It usually breaks down.
  '7ahqrj0non': '每次上推的升幅都比上一次少，所以升勢正在疲倦。通常會向下跌破。',
  // Price can grind higher inside a wedge for a long time before it breaks.
  'zpfc048q8h': '價格可以在楔形內慢慢上磨很久才跌破。',
  // Falling wedge
  '25off0jlpas': '下降楔形',
  // Lower highs and lower lows squeezed between two falling, converging lines.
  '1mkdd6gyxjn': '更低的高點和更低的低點，被夾在兩條向下而逐漸匯聚的線之間。',
  // Each drop is smaller than the last, so the decline is tiring. It usually breaks up.
  'a1n288oubs': '每次下跌的跌幅都比上一次小，所以跌勢正在疲倦。通常會向上突破。',
  // Price can grind lower inside a wedge for a long time before it breaks.
  '3020z9a81g': '價格可以在楔形內慢慢下磨很久才突破。',
  // Cup and handle
  'wg2yo9s1lq': '杯柄形態',
  // A rounded pullback that recovers to its old high (the cup), a small dip (the handle), then a breakout.
  '1i9bxd2aftd': '以圓弧形回升到舊高位的回調（杯），一次小回落（柄），然後突破。',
  // Selling dried up gradually and buyers returned. The handle is earlier buyers getting out even.
  '26sugj9gldz': '賣壓逐漸消退，買方回來了。柄是較早的買家打和離場。',
  // Slow to form and easy to imagine. A deep or V-shaped cup is much less reliable.
  '2deissv1yyj': '形成得慢，而且很容易憑想像看出來。深的或 V 形的杯可靠得多少。',
} satisfies Record<string, string>;

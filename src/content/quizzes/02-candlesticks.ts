import { defineQuizzes, q } from './helpers';

export const candlesticksQuizzes = defineQuizzes('candlesticks', {
  'candle-anatomy': [
    q('Which two prices does the body of a candle span?', ['The high and the low', 'The open and the close', 'The bid and the ask', 'The open and the high'], 1, 'The body runs from the open to the close. The wicks reach out to the high and the low.'),
    q('A candle opened at 50, reached a high of 56, a low of 49, and closed at 51. What does its long upper wick tell you?', ['Buyers stayed in control all period', 'Price rose a long way and was pushed back down', 'Price never went above the open', 'Volume was low'], 1, 'Price got to 56 but closed at 51. Sellers rejected the higher prices, leaving a long upper wick.'),
    q('A candle closes below its open. It is:', ['An up (bullish) candle', 'A down (bearish) candle', 'A doji', 'Impossible'], 1, 'Close below open means price fell during the period, so it is drawn in the down colour.'),
    q('What does a very small body with wicks on both sides suggest?', ['Strong buying', 'Strong selling', 'Indecision: buyers and sellers roughly cancelled out', 'The market was closed'], 2, 'A small body means the open and close were close together, so neither side won the period.'),
  ],
  timeframes: [
    q('On a 4-hour chart, one candle represents:', ['Four trades', 'Four hours of trading', 'Four days of trading', 'A quarter of an hour'], 1, 'The timeframe is how much time each candle covers.'),
    q('Compared with a daily chart, a 1-minute chart of the same market shows:', ['Less noise and fewer signals', 'More noise and more signals, many of them false', 'Different prices', 'Only the closing prices'], 1, 'Short timeframes show every small wiggle. Patterns appear often and fail often.'),
    q('The daily chart is falling steadily but the 15-minute chart shows a small rise. The sensible reading is:', ['The trend has reversed', 'The rise is probably a small bounce inside a bigger decline', 'The daily chart is wrong', 'Timeframes cannot disagree'], 1, 'Check the next timeframe up. A short-term move against the bigger trend is less convincing.'),
    q('Why should you wait before reading the shape of the newest candle on a live chart?', ['It is always a doji', 'It is still forming, so its close, high and low can change', 'It has no volume', 'It uses a different timeframe'], 1, 'Until its period ends the last candle keeps changing. A hammer can turn into something else in the final minutes.'),
  ],
  'single-candle-patterns': [
    q('A candle after a long decline has a small body at the top and a lower wick three times the body. It is a:', ['Shooting star', 'Marubozu', 'Hammer', 'Doji'], 2, 'Small body on top, long lower wick, after a fall: a hammer. Price was pushed down and buyers brought it back.'),
    q('A shooting star is most meaningful when it appears:', ['After a rise', 'After a decline', 'In a sideways market', 'At any time'], 0, 'A shooting star shows sellers rejecting higher prices. That matters after price has been rising.'),
    q('What does a marubozu show?', ['Indecision', 'One side in control from open to close', 'A reversal is certain', 'Very low volume'], 1, 'A marubozu is nearly all body: price opened at one extreme and closed at the other.'),
    q('You see a hammer in the middle of a flat, sideways market. How much weight should you give it?', ['A lot: hammers always mean buy', 'Little: without a decline before it, the shape has no real meaning', 'None: hammers only matter on daily charts', 'It means sell'], 1, 'Context comes first. A hammer is about buyers stepping in after selling. With no prior fall there is nothing to reverse.'),
    q('A doji appears after several strong up candles. The most reasonable reading is:', ['Price will definitely fall', 'The up move may be losing energy; watch the next candle', 'Buyers are stronger than ever', 'Nothing can be learned'], 1, 'A doji shows a draw between buyers and sellers. After a strong move that is a sign of tiring, not a guaranteed reversal.'),
  ],
  'multi-candle-patterns': [
    q('A small down candle is followed by a larger up candle whose body completely covers it. This is a:', ['Bearish engulfing', 'Bullish engulfing', 'Harami', 'Morning star'], 1, 'An up candle swallowing the previous down candle is a bullish engulfing pattern: buyers overwhelmed sellers.'),
    q('How is a harami different from an engulfing pattern?', ['It has three candles', 'The second candle is small and sits inside the first, rather than covering it', 'It only appears on daily charts', 'It is always bearish'], 1, 'In a harami the second body is inside the first. It shows hesitation, a weaker signal than the takeover an engulfing shows.'),
    q('Which sequence describes a morning star?', ['Long up candle, small candle, long down candle', 'Long down candle, small candle, long up candle', 'Three long up candles', 'Two dojis in a row'], 1, 'Selling, a pause, then buying: long down, small body, long up. It appears after a decline.'),
    q('Three long down candles in a row, each closing lower, are called:', ['Three white soldiers', 'Three black crows', 'An evening star', 'A triple top'], 1, 'Three black crows show sellers firmly in control. Three white soldiers are the bullish version.'),
    q('What makes a candle pattern more convincing?', ['It appears on a 1-minute chart', 'It forms after a clear move, at a price that mattered before, with higher volume', 'It has a well-known name', 'It appears many times a day'], 1, 'Context, location and volume all add weight. A pattern on its own in the middle of nowhere means little.'),
  ],
});

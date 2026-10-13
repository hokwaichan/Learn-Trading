import { defineQuizzes, q } from './helpers';

export const chartPatternsQuizzes = defineQuizzes('chart-patterns', {
  'head-and-shoulders': [
    q('In a head and shoulders top, which peak is the highest?', ['The left shoulder', 'The head', 'The right shoulder', 'They are all equal'], 1, 'The head is the middle and highest peak, with a lower shoulder on each side.'),
    q('When is a head and shoulders pattern complete?', ['When the head forms', 'When the right shoulder forms', 'When price closes below the neckline', 'When volume rises'], 2, 'Until the neckline breaks it is only three peaks. Many never complete.'),
    q('The neckline is at 50 and the head peaked at 58. What is the measured target after a breakdown?', ['58', '50', '46', '42'], 3, 'Project the height of the head below the neckline: 50 - (58 - 50) = 42.'),
    q('Why is the right shoulder significant?', ['It is a lower high, the first sign buyers are weakening', 'It is the highest point', 'It always has the most volume', 'It marks the entry price'], 0, 'The head was a higher high. The right shoulder fails to match it, which is how uptrends begin to end.'),
  ],
  'double-tops-and-bottoms': [
    q('A double top looks like which letter?', ['W', 'M', 'V', 'U'], 1, 'Two peaks with a dip between them: an M. A double bottom is a W.'),
    q('A double bottom is confirmed when price:', ['Touches the low a second time', 'Rises above the high between the two lows', 'Falls below both lows', 'Forms a doji'], 1, 'The break above the middle high completes the pattern. Before that it is just a range.'),
    q('For a double top, where does the stop-loss go if you short the breakdown?', ['Below the middle low', 'Above the two tops', 'At the target', 'At the first top exactly'], 1, 'If price gets back above the tops, the reversal idea is wrong.'),
    q('Price tests the same high twice in an uptrend but has not broken the low between them. You should treat it as:', ['A confirmed double top', 'A range so far; no pattern until the middle low breaks', 'A reason to short immediately', 'A head and shoulders'], 1, 'Two touches of a high are common just before price breaks through. Wait for confirmation.'),
  ],
  triangles: [
    q('An ascending triangle has:', ['Falling highs and a flat bottom', 'A flat top and rising lows', 'Falling highs and rising lows', 'Rising highs and falling lows'], 1, 'Flat resistance with higher lows: buyers are becoming more eager. It usually breaks upwards.'),
    q('Which triangle most often breaks downwards?', ['Ascending', 'Descending', 'Symmetrical', 'None'], 1, 'A descending triangle has flat support and lower highs: sellers are becoming more aggressive.'),
    q('What usually happens to volume while a triangle forms?', ['It rises steadily', 'It shrinks, then expands on the breakout', 'It stays exactly constant', 'It is irrelevant'], 1, 'Activity dries up as the range narrows. A breakout with a jump in volume is more convincing.'),
    q('A symmetrical triangle forms in the middle of a strong uptrend. The most likely break is:', ['Upwards, in the direction of the earlier trend', 'Downwards', 'It will never break', 'Sideways for ever'], 0, 'Symmetrical triangles tend to continue the prior trend, though you should wait for the actual break.'),
  ],
  'flags-and-wedges': [
    q('What are the two parts of a flag pattern?', ['Cup and handle', 'A sharp move (the pole) and a short drift against it (the flag)', 'Head and shoulders', 'Two equal peaks'], 1, 'The pole shows strong interest in one direction. The flag is a brief pause before it resumes.'),
    q('A rising wedge usually breaks:', ['Up', 'Down', 'Sideways', 'It never breaks'], 1, 'Each push up gains less than the last, so the advance is tiring. Rising wedges tend to break down.'),
    q('How does a wedge differ from a flag?', ['A wedge has converging lines and is the whole move; a flag has parallel lines and is a brief pause', 'They are the same thing', 'A wedge needs a flagpole', 'A flag always breaks down'], 0, 'Parallel and brief is a flag. Converging and drawn out is a wedge.'),
    q('A bull flag forms after a sharp rise of 20 points. A common target after the breakout is:', ['5 points above the breakout', 'About 20 points above the breakout', '20 points below the breakout', 'The bottom of the flagpole'], 1, 'The height of the flagpole is projected from the breakout point.'),
  ],
  'cup-and-handle': [
    q('The cup and handle is which kind of pattern?', ['Bearish reversal', 'Bullish continuation', 'Bearish continuation', 'A candle pattern'], 1, 'It forms after a rise and suggests the rise will continue once the rim breaks.'),
    q('What should the bottom of the cup look like?', ['A sharp V', 'A rounded U', 'A flat line', 'A double top'], 1, 'A rounded base shows selling fading gradually. A sharp V is a different, less reliable shape.'),
    q('Where is the entry on a cup and handle?', ['At the bottom of the cup', 'On a close above the rim of the cup', 'In the middle of the handle', 'When volume falls'], 1, 'The breakout above the rim completes the pattern.'),
    q('What does the handle represent?', ['New buyers rushing in', 'Earlier buyers selling to get out even near the old high', 'The exchange pausing trading', 'A failed breakout'], 1, 'People who bought at the old high sell as price returns there. Once they are gone there is less to hold price back.'),
  ],
});

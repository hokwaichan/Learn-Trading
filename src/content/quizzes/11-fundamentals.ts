import { defineQuizzes, q } from './helpers';

export const fundamentalsQuizzes = defineQuizzes('fundamentals', {
  earnings: [
    q('How often do public companies report earnings?', ['Every month', 'Every three months', 'Once a year', 'Only when they choose'], 1, 'Results are reported each quarter.'),
    q('A company reports record profits and its stock falls 8%. The most likely reason:', ['The market expected even more, or its guidance was weak', 'Record profits are bad', 'The exchange made an error', 'Earnings do not affect prices'], 0, 'Prices react to the surprise against expectations, and to guidance about the future.'),
    q('What is "guidance"?', ['Advice from a broker', 'The company\'s own forecast for coming quarters', 'A type of stop order', 'The analyst consensus'], 1, 'Guidance is management\'s outlook, and is often the most important part of the report.'),
    q('Why does a stop-loss not fully protect you through an earnings report?', ['Stops are cancelled at earnings', 'The price can gap past your stop when the market reopens', 'Brokers disable them', 'It does'], 1, 'Results are released outside trading hours. You are filled at the open, wherever that is.'),
    q('What happens to option implied volatility around earnings?', ['It falls before and rises after', 'It rises before and collapses after', 'It does not change', 'It becomes zero'], 1, 'Uncertainty inflates option prices beforehand; once the news is known, IV is crushed.'),
  ],
  'interest-rates': [
    q('Why does a central bank raise interest rates?', ['To boost spending', 'To cool an overheating economy and bring inflation down', 'To raise share prices', 'To weaken its currency'], 1, 'Higher rates make borrowing expensive, slowing spending and price rises.'),
    q('How do rising interest rates generally affect stock prices?', ['They help', 'They hurt', 'No effect', 'They double them'], 1, 'Higher borrowing costs, slower spending and more attractive safe alternatives all weigh on stocks.'),
    q('A country raises rates while others hold steady. Its currency tends to:', ['Weaken', 'Strengthen', 'Stay the same', 'Disappear'], 1, 'Investors move money to where it earns more, increasing demand for that currency.'),
    q('The market expects a 0.50 point cut and the central bank cuts 0.25. Stocks will most likely:', ['Rise, because rates fell', 'Fall, because the cut was smaller than priced in', 'Not move', 'Stop trading'], 1, 'The reaction is to the gap between the decision and the expectation.'),
    q('A central bank statement described as "hawkish" leans towards:', ['Lower rates', 'Higher rates', 'No change ever', 'Printing money'], 1, 'Hawkish means favouring higher rates to fight inflation. Dovish means favouring lower rates.'),
  ],
  'economic-news': [
    q('What does CPI measure?', ['Unemployment', 'How fast consumer prices are rising (inflation)', 'Company profits', 'Trading volume'], 1, 'The Consumer Price Index is the main inflation gauge and often the most market-moving release.'),
    q('A jobs report comes in much stronger than expected and stocks fall. Why might that be?', ['Strong hiring makes rate rises more likely', 'Jobs are bad for companies', 'The data was false', 'It cannot happen'], 0, 'When rates are the main worry, good economic news can mean tighter policy ahead.'),
    q('A PMI reading of 47 indicates:', ['Activity is growing', 'Activity is shrinking', 'No change', 'High inflation'], 1, 'Above 50 is expansion; below 50 is contraction.'),
    q('What is the sensible approach in the minutes around a major scheduled release?', ['Increase size to catch the move', 'Reduce size or stand aside; spreads widen and the first spike often reverses', 'Remove stop-losses', 'Trade the first tick'], 1, 'Conditions are at their worst right at the announcement. Let the market settle.'),
    q('How do you protect against unscheduled shocks you cannot predict?', ['By predicting them anyway', 'By keeping every position small enough that one shock cannot ruin you', 'By using more leverage', 'By trading only on Fridays'], 1, 'You cannot forecast them. Position sizing is the only defence.'),
  ],
});

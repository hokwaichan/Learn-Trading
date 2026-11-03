import { chart, defineModule, img, note, ol, p, real, ul, warn, worked } from './helpers';

export const fundamentals = defineModule(11, 'fundamentals', 'Fundamentals primer', 'The real-world events behind the charts: company results, interest rates and economic news.', [
  {
    id: 'earnings',
    title: 'Earnings',
    summary: 'Four times a year a company reports how it did. The reaction depends on expectations, not on the numbers alone.',
    minutes: 5,
    blocks: [
      p('**Fundamental analysis** asks why prices move: the real-world facts behind them. You do not need to be an analyst, but you should know which events move prices.'),
      p('Every quarter, public companies publish an **earnings report**:'),
      ul(
        '**Revenue**: money from sales. **Earnings**: profit after costs.',
        '**Earnings per share (EPS)**: profit divided by shares, the headline figure.',
        '**Guidance**: the forecast of the company itself, often the most important part.',
      ),
      p('The average analyst forecast, the **consensus**, is already in the price. The stock reacts to the **surprise**: a **beat** or a **miss** against it. Record profits can fall 10% if more was expected; a loss can rise if it was smaller than feared.'),
      worked(
        'Good news, falling price',
        'Analysts expect EPS of $2.00. The stock has risen 20% in the past month on optimism.',
        'The company reports $2.05: a beat.',
        'But it guides next quarter below what analysts expected.',
        'The stock opens 8% lower. The beat was already priced in; the weak guidance was not.',
      ),
      chart(real('TSLA', '2024-01-02', '2025-06-30', 'Tesla daily. Look for the days where price jumps or drops sharply from one day to the next, leaving a gap: many of them are the day after an earnings report.')),
      ul(
        '**Gaps**: reports come out of hours, and a stop does not protect you from a gap.',
        '**Know the date** before holding a stock or its options across it.',
        '**Options get expensive** before earnings, then IV collapses.',
        '**Post-earnings drift**: after a big surprise, price often keeps going for days or weeks.',
      ),
      note('Key valuation word: P/E', 'The **price-to-earnings ratio** is share price divided by yearly EPS. A P/E of 30 means paying $30 per $1 of profit, betting on growth; such stocks fall hardest when growth disappoints.'),
      warn('Holding through earnings is a gamble', 'Nobody knows the surprise, and the reaction often contradicts the numbers. Many traders cut size before a report.'),
    ],
  },
  {
    id: 'interest-rates',
    title: 'Interest rates',
    summary: 'The price of money. When it changes, the value of almost everything else changes with it.',
    minutes: 5,
    blocks: [
      p('An **interest rate** is the cost of borrowing money. Each **central bank**, such as the Federal Reserve in the US, sets a base rate that steers every other rate.'),
      img(
        'fed-building',
        'The marble Eccles Building of the Federal Reserve in Washington, DC, under renovation',
        'The Federal Reserve in Washington. Its rate decisions move markets around the world.',
      ),
      p('With **inflation** too high they **raise** rates to cool spending; in a weak economy they **cut** to encourage it.'),
      img(
        'fed-funds-rate',
        'A line chart of the US federal funds rate from 1954 to 2022, peaking near 19% around 1981 and near zero after 2008 and 2020',
        'The US base rate since 1954: near 20% in the early 1980s, near zero after 2008 and 2020.',
      ),
      ul(
        '**Stocks** usually suffer from higher rates, growth companies most.',
        '**Bonds** fall as rates rise.',
        '**Currencies** with rising rates tend to strengthen.',
        '**Crypto and gold** tend to do worse when money is expensive.',
      ),
      chart(real('EURUSD', '2021-06-01', '2023-06-30', 'EUR/USD from mid-2021 to mid-2023. The US central bank raised rates faster than the European one through 2022, and the euro fell against the dollar before recovering as the gap narrowed.')),
      p('Again, markets react to surprises. An expected move may change nothing; a different decision or a **hawkish** (towards higher rates) or **dovish** (towards lower) tone does.'),
      worked(
        'A cut that sends stocks down',
        'The market expects a 0.50 point rate cut.',
        'The central bank cuts by 0.25.',
        'It is still a cut, but smaller than was priced in.',
        'Stocks fall: relative to expectations, policy just got tighter.',
      ),
      warn('Decision days are volatile', 'Around the announcement prices can whip both ways before picking one. Tight stops get hit in the noise.'),
    ],
  },
  {
    id: 'economic-news',
    title: 'Economic news',
    summary: 'A handful of scheduled data releases move every market. Know when they are and what they mean.',
    minutes: 5,
    blocks: [
      p('A few scheduled statistics move every market because they shape what central banks do next. An **economic calendar** lists their dates and forecasts.'),
      img(
        'us-cpi',
        'A chart of the US Consumer Price Index from 1913 to 2022, with its yearly percentage change',
        'US consumer prices since 1913 (blue) and their yearly change (red). Inflation spikes reshape markets.',
      ),
      ul(
        '**Inflation (CPI)**: how fast prices are rising. Usually the biggest mover.',
        '**Jobs (non-farm payrolls)**: US hiring and unemployment, the first Friday of each month.',
        '**GDP**: total output. Two shrinking quarters is a common definition of a **recession**.',
        '**Central bank decisions** and **PMI surveys** (above 50 means business is growing).',
      ),
      worked(
        'Strong jobs, falling stocks',
        'The jobs report shows far more hiring than forecast.',
        'A strong economy: surely good for stocks?',
        'But strong hiring can push wages and inflation up, making rate rises more likely.',
        'Stocks fall and the currency rises. When rates are the main worry of the market, good economic news can be bad market news.',
      ),
      chart(real('SPY', '2022-01-03', '2022-12-30', 'SPY through 2022, a year dominated by inflation reports and rate rises. Many of the sharpest single-day moves fell on the days inflation data or central bank decisions were released.')),
      p('Unscheduled shocks, such as wars, bank failures or hacks, cause the biggest gaps. You cannot predict them, only keep every position small enough to survive one.'),
      ol(
        'Check the calendar each week.',
        'Before a big release, cut size, widen stops or stand aside.',
        'Do not trade the first spike; it often reverses within minutes.',
        'Once it settles, trade the chosen direction with your usual setups.',
      ),
      note('Technical and fundamental together', 'News explains why a market moves; the chart shows where. Many traders use fundamentals to pick what and when, and charts for entry, stop and target.'),
      warn('"Buy the rumour, sell the news"', 'Prices often rise before an expected good event and fall when it happens. Public news is usually too late to trade.'),
    ],
  },
]);

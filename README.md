# TradeSchool

Learn trading from beginner to intermediate level with interactive lessons, real
charts and risk-free practice. Everything runs in your browser: there is no
backend, no login, and no real money.

> Educational only. Not financial advice. All trading here uses simulated money.

## Setup

Requires Node 20 or newer.

```
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app with hot reload |
| `npm test` | Run the unit tests once |
| `npm run test:watch` | Re-run tests as files change |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint, including the folder-boundary rules |
| `npm run build` | Type-check and build to `dist/` |
| `npm run smoke` | Drive every screen in a real browser and report pass or fail |
| `npm run a11y` | Accessibility audit of every screen in both themes |
| `npm run screenshots` | Screenshot every route at desktop and phone width in both themes |
| `npm run fetch-data` | Re-download the bundled daily history in `public/data/` |

The last four need the dev server running. `smoke`, `a11y` and
`screenshots` use Playwright: run `npx playwright install chromium` once
first. `smoke` also needs internet, for live crypto prices.

## What is in it

| Screen | Address | What it is for |
| --- | --- | --- |
| Home | `/` | Where you left off, the daily challenge, your account and what to practise |
| Lessons | `/learn` | 18 modules, 86 lessons, each with interactive charts and a quiz |
| Trainer | `/trainer` | Pattern, smart money and options drills, scheduled by spaced repetition |
| Glossary | `/glossary` | Every term, searchable; terms are linked automatically in lessons |
| Charts | `/charts/:symbol` | Chart workspace with indicators, structure overlays, drawings and spot paper trading |
| Futures | `/futures/:symbol` | The same workspace with leverage, margin, liquidation and funding |
| Options | `/options/:symbol` | Simulated option chain, strategy builder, what-if sliders |
| Replay | `/replay` | Trade past prices candle by candle with the future hidden |
| Backtester | `/backtest` | Test a rule-based strategy on history, with no code |
| Journal | `/journal` | Every paper trade, logged automatically, with your notes |
| Analytics | `/analytics` | What your trades add up to, and where results come from |
| Calculators | `/tools` | Position size, risk/reward, compounding and more |
| Settings | `/settings` | Theme, fees, account reset, export and import |

Ctrl+K (Cmd+K on a Mac) opens a command palette that searches screens,
symbols, lessons and glossary terms.

**No real money, anywhere.** There is no brokerage connection and no way to
place a real order. Prices for crypto are real and live; every balance,
order, fill and option price is simulated.

## Folder map

```
src/
  app/              App shell: router, layout, sidebar, top bar, command palette
  components/ui/    Shared components (Button, Tabs, DataTable, Modal, ...)
  components/chart/ Chart wrapper around lightweight-charts
  features/         One folder per screen; each exposes only its index.ts
  lib/              Pure TypeScript, no React: indicators, pricing, trading,
                    replay, backtest, journal, data, srs. Unit tests live next
                    to the code.
  content/          Lessons, quizzes, glossary, patterns, strategies (typed data)
  stores/           Zustand stores, persisted with a schema version
  types/            Shared TypeScript types
  styles/           Theme variables (theme.css) and global CSS
public/data/        Bundled historical price files
scripts/            Browser tests, accessibility audit, screenshots, data download
```

Rules, enforced by ESLint:

- `lib/` never imports React, stores, components or features.
- Shared folders never import from `features/`.
- A feature imports another feature only through that feature's `index.ts`.

## Theme

Every colour is a CSS variable in `src/styles/theme.css`, exposed to Tailwind in
`src/styles/globals.css` (`bg-surface`, `text-muted`, `text-up-text`, ...).
`src/styles/theme.test.ts` checks that every text and surface pairing meets
WCAG AA in dark, light and colour-blind modes.

## Market data

All price data goes through the `MarketDataProvider` interface in
`src/types/market.ts`. Three providers are set up in `src/lib/data/index.ts`:

| Provider | Used for | Notes |
| --- | --- | --- |
| Binance spot | Crypto pairs, 1m to 1d, live | Public endpoints, no key. Uses the `data-api.binance.vision` mirror first because `api.binance.com` is blocked in some regions. |
| Binance USDT-M futures | Perpetuals | Blocked in some regions. When it cannot be reached the app shows spot prices for the same coin and says so. |
| Bundled files | AAPL, TSLA, SPY, EUR/USD daily | `public/data/*.json`, from Yahoo Finance, split-adjusted. Works offline. No live price. |

Fetched candles are cached in IndexedDB, so a chart you have opened before
still shows when you are offline, with a notice that the prices are saved ones.

### Adding a data source

1. Create `src/lib/data/<name>.ts` exporting a function that returns a
   `MarketDataProvider`. Only `id`, `listInstruments` and `getCandles` are
   required; `binance.ts` and `static.ts` are working examples. Throw
   `DataError` (from `errors.ts`) so the screen can show a useful message.
2. Add its instruments to `INSTRUMENTS` in `src/lib/data/instruments.ts`.
3. Create the provider in `createProviders()` and return it from
   `providersFor()` in `src/lib/data/index.ts`.

Nothing outside `src/lib/data` needs to change.

### Adding a bundled symbol

Add it to `SYMBOLS` in `scripts/fetch-static-data.mjs`, run
`npm run fetch-data`, then list it in `instruments.ts` with `bundled(...)`.

## Charts

Charts use TradingView's open-source
[lightweight-charts](https://github.com/tradingview/lightweight-charts) library;
its logo on each chart is the attribution its licence asks for.

## Indicators

Each indicator is a pure function in its own file in `src/lib/indicators/`,
returning one value per candle (`null` while it is warming up). The registry in
`src/lib/indicators/index.ts` describes each one: its parameters, its outputs,
and whether it is drawn on the price, on the volume bars, or in a pane of its
own. The chart, the Indicators dialog, the legends and the Explain tab all read
from that registry, and the backtester will too.

Conventions: SMA-seeded EMA, Wilder smoothing for RSI and ATR, population
standard deviation for Bollinger Bands, and VWAP that restarts each UTC day on
intraday charts and each calendar month on daily charts.

### Adding an indicator

1. Write the function in `src/lib/indicators/<name>.ts`. `series.ts` has
   helpers for moving averages over values that start with `null`.
2. Test it in `indicators.test.ts` against values you can trust: a published
   worked example, or a small case computed by hand.
3. Add its id to `IndicatorId` in `src/types/backtest.ts`.
4. Add an entry to `INDICATORS` in `src/lib/indicators/index.ts`.
5. Add its plain-language description to `src/content/indicators.ts`, and a
   `case` to `reading()` in `src/lib/explain/indicator.ts` for the sentence
   that interprets the current value. TypeScript reports both if you forget.

## Lessons, quizzes and glossary

All teaching content is typed data in `src/content/`, never text inside
components:

| File | Holds |
| --- | --- |
| `content/lessons/NN-<module>.ts` | One module: its lessons, each a list of blocks |
| `content/quizzes/NN-<module>.ts` | The quiz for each lesson in that module |
| `content/lessons/index.ts`, `content/quizzes/index.ts` | The list of modules, in curriculum order |
| `content/glossary.ts` | Every glossary term |
| `content/indicators.ts` | Indicator explanations |

`src/content/content.test.ts` checks every lesson, quiz and glossary entry on
`npm test`: each lesson has enough text, an interactive block and a 3 to 6
question quiz; chart annotations land on the chart; glossary links resolve.

### Adding a lesson

1. Open the module file and add an object to its `lessons` array:

   ```ts
   {
     id: 'my-lesson',             // used in the address: /learn/<module>/my-lesson
     title: 'My lesson',
     summary: 'One sentence shown under the title and in the lesson list.',
     minutes: 6,
     blocks: [
       p('A paragraph. Use **double asterisks** for bold.'),
       h('A heading'),
       ul('A bullet', 'Another bullet'),          // ol(...) for numbered
       note('Title', 'An info box.'),             // warn(...) and danger(...) too
       formula('a = b / c', 'What the formula means.'),
       worked('A worked example', 'Step one.', 'Step two.'),
       chart(real('SPY', '2025-01-02', '2025-06-30', 'Caption.', [{ id: 'sma', params: { period: 20 } }])),
       widget('position-size'),
     ],
   }
   ```

2. Add its quiz to the matching file in `content/quizzes/`, under the same id:

   ```ts
   'my-lesson': [
     q('The question?', ['Choice A', 'Choice B', 'Choice C'], 1, 'Why B is right.'),
     // 3 to 6 questions. The number is the position of the right answer, from 0.
   ],
   ```

   Answers are shown in a shuffled order on every attempt, so do not write
   choices such as "all of the above" that depend on position.

3. Run `npm test`.

Glossary terms are linked automatically the first time each appears in a
lesson. Every lesson needs at least one `chart(...)` or `widget(...)`.

### Charts in lessons

- `real(symbol, from, to, caption, indicators?)` shows bundled daily history
  (AAPL, TSLA, SPY, EURUSD), so lessons work offline.
- `made(candles, caption, annotations?)` shows a hand-made example. Build the
  candles with `walk([100, 108, 104, ...])`, a price path through waypoints, or
  `ohlc([[open, high, low, close], ...])` for exact candles, and combine pieces
  with `join(...)`.
- Annotations: `mark(index, 'Label')` labels a candle, `level(price, 'Label')`
  draws a horizontal line, `seg(i1, p1, i2, p2, 'Label')` a sloping line and
  `zone(i1, p1, i2, p2, 'Label')` a shaded box. `index` counts candles from 0;
  `walk` draws 6 candles per waypoint unless you pass `{ per }`.

### Adding a module

Create `content/lessons/NN-<name>.ts` with `defineModule(order, id, title,
description, [lessons])` and `content/quizzes/NN-<name>.ts` with
`defineQuizzes(id, {...})`, then add both to the two `index.ts` files.

### Adding an interactive widget

Write the component in `src/features/lessons/components/widgets/`, add its name
to `LessonWidget` in `src/types/content.ts`, and add a `case` for it in
`LessonBlocks.tsx`. Keep its maths in `src/lib/` with a test.

## Curriculum

| # | Module | What it covers |
| --- | --- | --- |
| 1 | Basics | Markets, order types, the spread, long and short, leverage |
| 2 | Reading candlesticks | Bodies and wicks, timeframes, candle patterns |
| 3 | Market structure | Trends, support and resistance, trend lines, breakouts |
| 4 | Chart patterns | Head and shoulders, double tops, triangles, flags, cup and handle |
| 5 | Indicators | Moving averages, Bollinger Bands, ATR, RSI, Stochastic, MACD, volume, VWAP |
| 6 | Strategies | Trend following, breakouts, mean reversion, trading styles |
| 7 | Risk management | Position sizing, stops, risk/reward, expectancy, drawdown |
| 8 | Futures | Contracts, margin, liquidation, funding, hedging |
| 9 | Options | Calls and puts, pricing, the Greeks, implied volatility, strategies |
| 10 | Psychology | FOMO, revenge trading, loss aversion, trading plans |
| 11 | Fundamentals | Earnings, interest rates, economic news |
| 12 | Reading the bigger picture | Top-down analysis, Fibonacci, divergence, volume and Wyckoff |
| 13 | Smart money concepts | Breaks of structure, liquidity, order blocks, fair value gaps, premium and discount |
| 14 | ICT concepts | Sessions and kill zones, the power of three, optimal trade entry, breaker blocks |
| 15 | Day trading | The trading day, opening range, VWAP, key levels, momentum and scalping, a daily routine |
| 16 | Managing a trade and an account | Scaling in and out, trailing stops, correlation, risk of ruin |
| 17 | Crypto, forex and costs | Crypto markets, funding and open interest, pips and lots, the true cost of a trade |
| 18 | Testing, reviewing and staying safe | Honest backtesting, a playbook, trade reviews, scams and prop firms, paper to real money |

Nothing is locked; the order is a suggestion.

### How SMC and ICT are taught

Smart money concepts and ICT are popular and contested. They have no single
agreed definition, and there is no independent evidence that they beat simpler
methods. The lessons teach the vocabulary with one explicit rule for each
idea, say where teachers differ, point out when a concept is an older idea
under a new name, and repeatedly send the reader to test setups in Replay and
log them in the Journal. The claim that institutions deliberately hunt retail
stops is presented as a story, not a fact.

## Structure overlays and session tools

The detection code is in `src/lib/structure/`, pure and tested:

| What | Rule used |
| --- | --- |
| Swing high or low | Higher (or lower) than the 3 candles before and at least as high (low) as the 3 after. Known only once those 3 have printed. |
| Break of structure, change of character | A candle **closes** beyond the latest confirmed swing. With the trend: BOS. First one against it: CHoCH. |
| Fair value gap | Three candles where the first and third do not overlap, at least 0.1% of price apart. Removed from the chart once filled. |
| Order block | The last candle against the move, at the origin of a move that broke structure. Removed once price returns to it. |
| Equal highs and lows | Consecutive swings of one kind within 0.2% of each other. |
| Liquidity sweep | A candle trades beyond a confirmed swing and closes back inside. The ten most recent are shown. |
| Sessions and kill zones | Defined in New York time and converted with daylight saving. Intraday charts only. |

They are switched on from **Overlays** in the chart toolbar (`StructureLayer` in
`src/components/chart/`), work in Replay as well, and look only at the last 500
candles. Because swings need three later candles to be confirmed, a marking
never depends on candles that have not printed yet, so Replay cannot leak
the future through them.

Three indicators were added to the registry, so they also work in the
Backtester: **Donchian Channel**, **Previous Day Levels** and **Opening
Range**. Three presets use them: Donchian breakout, VWAP reclaim and Opening
range breakout (which needs intraday candles).

The Trainer has a **Smart money** drill: it marks a stretch of a real chart and
asks whether it shows a fair value gap, a liquidity sweep, a break of
structure or a change of character.

## Paper trading

The engine is pure code in `src/lib/trading/engine.ts`: it takes an account
and an order or a price update and returns a new account plus a list of
events. The account store calls it; `app/usePaperEngine.ts` feeds it live
prices for every symbol with an open position or waiting order.

How the simulation behaves:

- **Balance and equity.** Cash is the realised balance. Equity is cash plus
  the unrealised profit or loss of open positions. Spot positions cannot
  exceed equity (no leverage).
- **One position per symbol.** An order the other way reduces it, closes it,
  or closes it and opens the opposite position with what is left.
- **Fees and slippage** come from Settings. The fee is charged on every fill.
  Slippage makes market and stop fills slightly worse; limit and take-profit
  fills get their price exactly.
- **Gaps.** If price jumps past a stop, it fills at the price it jumped to,
  which is worse than the stop. If it jumps past a limit, the fill is better.
- **Same-bar ambiguity** (matters in Replay and the backtester, where a whole
  candle arrives at once): if one candle reaches both the stop-loss and the
  take-profit, the stop-loss is assumed to have been hit first, and a position
  is never stopped out by the same candle that opened it.
- **Nothing runs while the app is closed.** Orders are checked against the
  price when the app is next open, not against what happened in between.

## Futures

The Futures page is the chart workspace trading perpetual contracts on the
same paper account. The rules live in the trading engine and
`src/lib/trading/futures.ts`.

- **Leverage** from 1x to 20x. Margin is the position value divided by
  leverage. It is set aside, not spent: opening a position costs only the fee.
- **Isolated margin**: a position can lose at most its own margin. It is
  liquidated at entry x (1 - 1/leverage + 0.5%) for a long, and the mirror
  image for a short.
- **Cross margin**: the whole account backs the position. It is liquidated
  when account equity falls to the maintenance margin of the open futures
  positions, so its liquidation price moves as other positions gain or lose.
- **Maintenance margin** is one flat 0.5% of position value. Real exchanges
  use tiers that rise with size.
- **Liquidation** closes the position at the liquidation price and takes
  what is left of its margin as a fee. It is checked before the stop-loss; the
  stop-loss wins only when it is nearer and price did not gap past both.
- **Funding** is charged every 8 hours (00:00, 08:00, 16:00 UTC) at a fixed
  0.01% of position value, paid by longs and received by shorts. Funding
  times missed while the app was closed are charged when it is next opened.
- **Warnings**: above 5x the ticket states the move that would liquidate the
  position and asks for confirmation. A stop-loss beyond the liquidation
  price is flagged.

Binance futures data is blocked in some regions. When it is, the page shows
the spot price of the same coin with a notice, and funding stays at the
fixed rate.

## Options

The pricing code is in `src/lib/pricing/`:

| File | What it does |
| --- | --- |
| `blackScholes.ts` | Price and Greeks of a European option |
| `impliedVol.ts` | Implied-volatility solver, and historical volatility from candles |
| `chain.ts` | The simulated chain: expiries, strikes, volatility smile, bid and ask |
| `payoff.ts` | Payoff at expiry, break-evens, maximum profit and loss |
| `strategy.ts` | Value, Greeks and payoff curves of a multi-leg strategy on any date; chance of profit; margin |
| `draft.ts`, `templates.ts` | Turning builder choices and strategy templates into priced legs |

**Every option price in the app is simulated.** There is no options market
data. The chain is built from the real price of the underlying and the
volatility of its last 30 daily closes, priced with Black-Scholes, and the
page says so above the chain.

- **Expiries** are five Fridays at 08:00 UTC, from this week to about three
  months out. **Strikes** are 12 either side of the price, about 1% apart.
- **Volatility** per strike is the historical figure with a mild smile.
- **Bid and ask** sit 2% apart around the model price. A bought leg pays the
  ask and a sold leg receives the bid.
- **Contract size** is 1 unit for crypto and 100 for the bundled symbols.
- **The builder** takes up to four option legs plus the underlying. The solid
  line is the payoff at expiry; the dashed line follows the what-if sliders
  for price, time and implied volatility, as do the Greeks.
- **Chance of profit** is the probability of finishing in profit at expiry if
  price moves log-normally at the historical volatility. A model figure.

Paper trading for options is in `src/lib/trading/options.ts`:

- A strategy is held as one position, valued by the model whenever the
  underlying price changes and every 30 seconds.
- Each leg keeps the volatility it was opened at. Real implied volatility
  moves; the sliders show what that would do.
- Funds tied up are the most the strategy can lose, or for an uncovered short
  call 20% of the underlying it covers plus the premium.
- Options are European and cash-settled. At expiry each leg is paid or
  charged its exercise value at the underlying price at that moment (looked
  up from history if the app was closed). A short leg that finishes in the
  money is recorded as an assignment.
- A strategy with two expiries is settled whole at the first one.
- The bundled symbols can be analysed but not paper traded, because their
  price never updates.

### Adding an option strategy template

Append an entry to `OPTION_STRATEGIES` in `src/content/strategies.ts`, with
each strike given as a fraction away from the current price. It appears in
the builder, the Options lessons and the trainer.

## Journal and analytics

Nothing has to be logged by hand. The Journal lists every closed trade and
open position straight from the paper accounts: spot, futures and options.
The logic is in `src/lib/journal/journal.ts`.

- **Notes** (reasoning, setup, feeling, review, a 1 to 5 rating for following
  the plan) are saved by `src/stores/journal.ts`, keyed by position, so notes
  written while a trade is open stay with it when it closes.
- **Chart snapshots** are stored as candles and markers, not as images, so
  they follow the theme and stay zoomable. One is saved to IndexedDB when a
  trade closes; if that fails it is rebuilt from history when the trade is
  opened in the Journal. The candle size is the smallest that fits the whole
  trade in about 150 candles.
- **Funding payments and liquidations** are read from the account ledger and
  listed on the trade.
- **CSV export** writes the trades currently shown, with notes. Text that
  starts with =, +, - or @ is prefixed with an apostrophe so a spreadsheet
  does not run it as a formula.
- **Replay trades** live in their own account. The Journal shows them when
  asked, and Analytics leaves them out unless the switch is on.
- **Analytics** works on closed trades only: net result, win rate,
  expectancy, average R and achieved reward-to-risk, profit factor, drawdown
  of the running total, and results by setup, instrument type, day of the
  week, feeling and symbol.

Resetting the paper account clears its trades. Notes for cleared trades are
kept but no longer shown.

## Replay

Replay is the chart workspace on past data. You pick a symbol, a candle size
and a start date; the chart stops just before that date and you reveal one
candle at a time (or press Play), trading as you go.

- **The future is hidden in one place.** The session keeps every loaded
  candle plus a cursor. Everything on screen reads candles through
  `visibleCandles(candles, cursor)` in `src/lib/replay/session.ts`, so the
  chart, indicators, Explain panel and order ticket cannot see past the
  cursor.
- **Each revealed candle goes through the trading engine** (`advance()` in
  the same file), which is how limit orders, stop-losses and take-profits
  trigger. The same-bar rules under Paper trading apply.
- **The replay clock** is the close of the newest candle shown. Orders and
  trades are stamped with that time, not the real one.
- **Separate account.** Replay trades use the `replay` account, never the
  main paper account. It can be reset from the Replay set-up screen.
- **Sessions survive a reload.** The symbol, candle size and cursor time are
  saved by `src/stores/replay.ts`; the candles are fetched again.
- **Ending a session** (or starting a new one) closes open replay positions
  at the current replay price and cancels waiting orders, after asking.
- **Jump to date** moves forward only. A date outside the loaded history
  starts a new session from that date.
- The bundled symbols (AAPL, TSLA, SPY, EUR/USD) replay on daily candles.
  Crypto replays on any candle size, loading history as it goes.
- Keyboard: Space plays and pauses, N reveals the next candle.

## Backtester

The Backtester runs a rule-based strategy over past candles. The engine is
pure code in `src/lib/backtest/`: `rules.ts` turns conditions into values per
candle, `engine.ts` simulates the trades, and `stats.ts` works out the numbers.

How a test trades:

- **No looking ahead.** Rules are read at a candle's close and filled at the
  next candle's open.
- **One position at a time**, long or short, sized as a share of the account.
- **Stop-loss and take-profit** are checked against each candle's high and
  low, starting with the entry candle. If one candle reaches both, the
  stop-loss is assumed to have come first. A price that gaps past a stop
  fills at the open.
- **Costs.** Every fill pays the fee from Settings. Market and stop fills pay
  slippage; take-profit fills get their price exactly.
- **Futures mode** (crypto only) adds leverage, a liquidation price
  (`lib/trading/futures.ts`, one flat 0.5% maintenance rate) and funding at a
  fixed 0.01% every eight hours. A liquidation loses the whole margin of that
  trade. If the account is emptied, trading stops.
- **Warm-up.** Candles from before the test period are loaded so indicators
  have settled; no trades are taken on them.
- **Buy and hold** buys at the first open of the period, pays the fee once,
  and never sells.
- **Sharpe ratio** uses per-candle returns, a zero risk-free rate, and 365
  days a year for crypto or 252 for the bundled markets.

A test loads at most 20,000 candles. Results are kept in memory only; the
strategy being edited, saved strategies, the set-up and the headline numbers
of the last 12 runs are saved by `src/stores/backtest.ts`.

### Adding a preset strategy

Append an entry to `BACKTEST_PRESETS` in `src/content/strategies.ts`. A
strategy is an entry rule and an exit rule, each a list of conditions
(left side, comparison, right side) joined by "all" or "any". A side is a
price, an indicator line with its settings, or a fixed number. The content
tests check that every preset is valid and takes trades on real history.

Any indicator in the registry can be used in a rule without further work.

## Home and the daily challenge

Home shows a continue-learning card, the daily challenge, the paper account
with a small equity line, progress per module, recent trades, and the
patterns answered worst in the Trainer.

The daily challenge is one pattern question and one concept question
(`src/features/trainer/challenge.ts`). Both are chosen from the date, so the
challenge is the same all day and changes at local midnight. The concept
question comes from the quizzes of lessons already completed, or from the
first module before any are. Finishing it counts towards the daily streak.

## Calculators

Seven calculators on one page: position size, risk/reward, compounding,
break-even win rate, leverage and liquidation price, option profit, and the
probability of a price level. The arithmetic is in `src/lib/calculators.ts`,
`src/lib/trading/sizing.ts` and `src/lib/trading/futures.ts`, with tests. Each
keeps what was typed while you switch between them. The option and
probability figures come from the Black-Scholes model and say so.

## Your data

Everything is saved in the browser the app is opened in. Nothing is sent
anywhere, and clearing the browser data erases it.

| Where | What |
| --- | --- |
| `localStorage`, keys starting `tradeschool.` | Settings, both accounts, progress, journal notes, layouts, drawings, replay set-up, saved strategies |
| IndexedDB | Cached price history and the chart saved with each journal trade |

**Settings → Export all data** saves the localStorage entries as one JSON
file. **Import a backup** replaces everything with a file's contents after
a confirmation, and **Erase everything** returns the app to new. The code is
`src/lib/backup.ts`. Journal charts are not in the backup; they are rebuilt from
price history when a trade is opened.

Each store has a schema version and a list of upgrade steps
(`src/lib/migrate.ts`), so data saved by an older build, including an imported
backup, is upgraded when the app loads instead of being discarded. To change
a store's shape, raise its version and add a step from the old version.

## Accessibility

- Text and controls meet WCAG AA contrast in both themes. The palette is
  checked by a unit test (`src/styles/theme.test.ts`) and every screen by
  `npm run a11y`, which runs axe-core on each screen and its main dialogs
  at desktop and phone width.
- Everything works from the keyboard, with a visible focus ring. Dialogs
  trap focus and return it when closed.
- Colour is never the only signal: profit and loss carry a sign, buy and sell
  are labelled, and there is a colour-blind palette (blue and orange) in
  Settings.
- Motion is short, and switched off when the system asks for reduced motion.

The audit is automated, so it catches markup and contrast problems, not
everything. The price chart is drawn on a canvas, which a screen reader
cannot read; the legend, the Explain panel and the tables carry the same
information as text.

## Tests

`npm test` runs the unit tests, which sit next to the code in `src/lib/`.
They cover every indicator against published reference values, order fills,
fees and profit-and-loss arithmetic, futures margin, funding and
liquidation, Black-Scholes prices and Greeks against published values and
put-call parity, the implied-volatility solver, option strategies and
expiry, the backtest engine against hand-worked trades, the journal and CSV
export, the calculators, backup round-trips, and the lesson content itself
(every lesson has a quiz and an interactive block, every link resolves).

`npm run smoke` runs thirteen scripts in `scripts/` that use the app in a real
browser at desktop and phone width. Where a test needs the market to move,
the live price stream is replaced by one the script controls.

## Known limits

These are deliberate simplifications. Each is also stated where it applies.

- Option prices are from a model, not a market. Options are European and
  cash-settled; dividends are ignored.
- Futures use one flat maintenance margin rate and a fixed funding rate.
  Where Binance futures data is blocked, futures charts show the spot price.
- Orders and stops are only checked while the app is open.
- Stocks and EUR/USD have bundled daily history only, so they can be
  charted, replayed, backtested and analysed, but not traded live.
- When one candle reaches both a stop-loss and a take-profit, the stop-loss
  is assumed to have come first.
- The structure overlays apply one fixed rule to ideas that practitioners
  draw in different ways. They are a consistent reading, not the only one.
- The lessons are written to be accurate and plain, but have not been
  reviewed by a licensed professional. Nothing here is financial advice.

## Trainer

The trainer asks one question at a time from five drills:

| Drill | Source | Recorded against |
| --- | --- | --- |
| Candlestick pattern | Real bundled history, found by the detectors in `lib/patterns/detectors.ts` | One card per pattern |
| Chart pattern | Constructed examples from `content/patterns.ts` | One card per pattern |
| What happened next? | Real bundled history with the future hidden | One card for the drill |
| Payoff diagram | Templates in `content/strategies.ts`, priced with Black-Scholes | One card per strategy |
| Strategy for an outlook | Scenarios in `content/strategies.ts` | One card per scenario |

Each answer updates a spaced-repetition card (SM-2, in `lib/srs/sm2.ts`).
Weak, overdue and unseen items are picked more often; nothing is ever locked
out.

Chart patterns use constructed examples, labelled as such, because automatic
detection of shapes like head and shoulders in real data finds too many
doubtful cases to teach from.

- **Add a candlestick pattern:** add a rule to `DETECTORS` in
  `lib/patterns/detectors.ts` with a test, then a definition with the same
  `detectorId` in `content/patterns.ts`.
- **Add a chart pattern:** add its waypoints to `SHAPES` and a definition with
  `build: shape(...)` in `content/patterns.ts`, and a mirror entry in
  `features/trainer/questions.ts`.
- **Add an option strategy or scenario:** append to `OPTION_STRATEGIES` or
  `OUTLOOK_SCENARIOS` in `content/strategies.ts`.

### Adding a glossary term

Add one line to `content/glossary.ts`:

```ts
e('id', 'Term', 'One plain sentence ending in a full stop.', 'module/lesson', ['alias'], ['related-id']),
```

An alias is linked using the entry's definition, so it must be a true synonym.
For an everyday word that would be linked by mistake ("long" in "a long wick"),
pass `{ autoLink: false }` as the last argument; then only its aliases link.

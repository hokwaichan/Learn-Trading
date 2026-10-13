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
| `npm run screenshots` | Screenshot every route at desktop and phone width in both themes (dev server must be running; first run `npx playwright install chromium`) |
| `npm run smoke` | Click through the app shell, chart workspace, indicators and every lesson and report pass/fail (dev server and internet needed) |
| `npm run fetch-data` | Re-download the bundled daily history in `public/data/` |

## Build status

The app is being built in twelve milestones.

| # | Milestone | Status |
| --- | --- | --- |
| 1 | Project setup, theme, UI components, app shell | Done |
| 2 | Chart workspace | Done |
| 3 | Indicators | Done |
| 4 | Lessons and glossary | Done |
| 5 | Pattern trainer | Next |
| 6 | Spot paper trading | |
| 7 | Replay | |
| 8 | Backtester | |
| 9 | Futures | |
| 10 | Options | |
| 11 | Journal and analytics | |
| 12 | Dashboard and polish | |

## Folder map

```
src/
  app/              App shell: router, layout, sidebar, top bar, command palette
  components/ui/    Shared components (Button, Tabs, DataTable, Modal, ...)
  components/chart/ Chart wrapper around lightweight-charts
  features/         One folder per screen; each exposes only its index.ts
  lib/              Pure TypeScript, no React: indicators, pricing, trading,
                    backtest, data, srs. Unit tests live next to the code.
  content/          Lessons, quizzes, glossary, patterns, strategies (typed data)
  stores/           Zustand stores, persisted with a schema version
  types/            Shared TypeScript types
  styles/           Theme variables (theme.css) and global CSS
public/data/        Bundled historical price files
scripts/            Screenshot and smoke-test scripts
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

### Adding a glossary term

Add one line to `content/glossary.ts`:

```ts
e('id', 'Term', 'One plain sentence ending in a full stop.', 'module/lesson', ['alias'], ['related-id']),
```

An alias is linked using the entry's definition, so it must be a true synonym.
For an everyday word that would be linked by mistake ("long" in "a long wick"),
pass `{ autoLink: false }` as the last argument; then only its aliases link.

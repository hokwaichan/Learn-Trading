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
| `npm run smoke` | Click through the app shell and chart workspace and report pass/fail (dev server and internet needed) |
| `npm run fetch-data` | Re-download the bundled daily history in `public/data/` |

## Build status

The app is being built in twelve milestones.

| # | Milestone | Status |
| --- | --- | --- |
| 1 | Project setup, theme, UI components, app shell | Done |
| 2 | Chart workspace | Done |
| 3 | Indicators | Next |
| 4 | Lessons and glossary | |
| 5 | Pattern trainer | |
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

Guides for adding lessons and indicators will be added here as those parts are
built.

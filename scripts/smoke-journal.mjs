// Smoke test for the Journal and Analytics. Needs the dev server and internet.
//   npm run smoke
//
// Starts from a saved account with a known set of closed trades, so the
// totals are the same on every run, then adds one live trade through the UI.
import { mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = '.screenshots';
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

// ── Seed data ──────────────────────────────────────────────────────────
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
// Noon UTC, four days ago and after, so every trade has price history.
const T = Math.floor((Date.now() - 6 * DAY) / DAY) * DAY + 12 * HOUR;
const BTC = 80000;
let n = 0;
function trade(p) {
  n++;
  const base = {
    id: `t${n}`, accountId: 'main', positionId: `p${n}`, symbol: 'BTCUSDT', kind: 'spot', direction: 'long', quantity: 0.01,
    entryPrice: BTC, exitPrice: BTC, openedAt: T + n * 5 * HOUR, closedAt: T + n * 5 * HOUR + 2 * HOUR,
    grossPnl: 0, fees: 1, funding: 0, netPnl: 0, returnPct: 0, exitReason: 'manual',
  };
  const t = { ...base, ...p };
  t.grossPnl = t.netPnl + t.fees + t.funding;
  t.returnPct = t.netPnl / 800;
  return t;
}
const TRADES = [
  trade({ netPnl: 40, initialRisk: 20, rMultiple: 2, stopLoss: BTC * 0.975, takeProfit: BTC * 1.05, exitReason: 'take_profit', exitPrice: BTC * 1.05 }),
  trade({ netPnl: 30, initialRisk: 20, rMultiple: 1.5 }),
  trade({ netPnl: 20, initialRisk: 20, rMultiple: 1 }),
  trade({ netPnl: -25, initialRisk: 20, rMultiple: -1.25, exitReason: 'stop_loss', symbol: 'ETHUSDT', entryPrice: 2500, exitPrice: 2450 }),
  trade({ netPnl: -20, initialRisk: 20, rMultiple: -1, exitReason: 'stop_loss' }),
  trade({ netPnl: -15, initialRisk: 20, rMultiple: -0.75 }),
  trade({ netPnl: -100, kind: 'perpetual', leverage: 10, exitReason: 'liquidation', funding: 0.5, direction: 'short', exitPrice: BTC * 1.095 }),
  trade({ netPnl: 12, kind: 'option', label: 'Bull call spread', symbol: 'ETHUSDT', entryPrice: 90, exitPrice: 103, quantity: 1, exitReason: 'expiry' }),
];
const NET = TRADES.reduce((s, t) => s + t.netPnl, 0);
const liq = TRADES[6];
const account = (id, trades, ledger = []) => ({ id, startingBalance: 10000, cash: 10000 + trades.reduce((s, t) => s + t.netPnl, 0), positions: [], orders: [], trades, ledger, equityHistory: [{ time: T, equity: 10000 }], createdAt: T, resetCount: 0 });
const replayTrade = { ...trade({ netPnl: 55, symbol: 'AAPL', entryPrice: 180, exitPrice: 185.5, quantity: 10 }), id: 'r1', positionId: 'rp1', accountId: 'replay', openedAt: Date.UTC(2024, 2, 4, 21), closedAt: Date.UTC(2024, 2, 20, 21) };
const SEED = {
  'tradeschool.account': {
    state: {
      accounts: {
        main: account('main', TRADES, [
          { id: 'l1', time: liq.openedAt + HOUR, type: 'funding', amount: -0.5, refId: liq.positionId },
          { id: 'l2', time: liq.closedAt, type: 'liquidation', amount: -4, refId: liq.positionId },
        ]),
        replay: account('replay', [replayTrade]),
      },
    },
    version: 1,
  },
  'tradeschool.journal': {
    state: {
      notes: {
        p1: { reasoning: 'Clean breakout, with volume', review: 'Held to target', setup: 'Breakout', emotion: 'calm', rating: 5, updatedAt: T },
        p2: { reasoning: '', review: '', setup: 'Breakout', emotion: 'calm', updatedAt: T },
        p3: { reasoning: '', review: '', setup: 'Pullback', emotion: 'calm', updatedAt: T },
        p4: { reasoning: 'Chased it, "late"', review: '', setup: 'Pullback', emotion: 'fomo', updatedAt: T },
        p5: { reasoning: '', review: '', setup: 'Pullback', emotion: 'fomo', updatedAt: T },
        p6: { reasoning: '', review: '', setup: 'Breakout', emotion: 'fomo', updatedAt: T },
      },
    },
    version: 1,
  },
};

const browser = await chromium.launch();
const errors = [];
const STEP = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 };

async function open(viewport, extra = {}, seed = SEED) {
  const context = await browser.newContext({ viewport, acceptDownloads: true, ...extra });
  if (seed) {
    await context.addInitScript((data) => {
      // Only on the first load, so changes made during the test survive a reload.
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      for (const [key, value] of Object.entries(data)) localStorage.setItem(key, JSON.stringify(value));
    }, seed);
  }
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''))) return;
    errors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
  const sockets = new Set();
  await page.routeWebSocket(/binance\.(vision|com)\/ws\//, (ws) => {
    sockets.add(ws);
    ws.onClose(() => sockets.delete(ws));
  });
  const push = async (symbol, price) => {
    for (const ws of sockets) {
      const m = ws.url().match(/\/ws\/(\w+)@kline_(\w+)/);
      if (!m || m[1] !== symbol.toLowerCase()) continue;
      const step = STEP[m[2]] * 1000;
      const p = String(price);
      try {
        ws.send(JSON.stringify({ e: 'kline', k: { t: Math.floor(Date.now() / step) * step, o: p, h: p, l: p, c: p, v: '1' } }));
      } catch {
        sockets.delete(ws);
      }
    }
    await page.waitForTimeout(250);
  };
  return { context, page, push };
}

/** True once the element shows up, false if it never does. */
const seen = (locator) => locator.first().waitFor({ timeout: 8000 }).then(() => true, () => false);
const money = (text) => Number(text.replace(/[^0-9.-]/g, ''));
const { context, page, push } = await open({ width: 1440, height: 900 });
const rows = page.getByRole('table', { name: 'Trades' }).locator('tbody tr');
const select = (label, value) => page.getByLabel(label, { exact: true }).selectOption(value);

// ── Journal list ───────────────────────────────────────────────────────
await page.goto(`${BASE}/journal`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Journal', level: 1 }).waitFor({ timeout: 10000 });
check('every closed paper trade is listed', (await rows.count()) === 8);
check('the list totals the closed trades', money(await page.getByText(/Closed trades total/).innerText()) === NET, `${NET}`);
const first = await rows.first().innerText();
check('the newest trade is first, with its strategy name', /Bull call spread/.test(first) && /Options/.test(first) && /Expired/.test(first), first.replace(/\s+/g, ' ').slice(0, 90));
check('results carry a sign', /\+\$12\.00/.test(first) && /-\$100\.00/.test(await rows.nth(1).innerText()));
check('a row shows its setup, feeling and R', /Breakout/.test(await rows.nth(7).innerText()) && /Calm/.test(await rows.nth(7).innerText()) && /\+2\.00R/.test(await rows.nth(7).innerText()));
await page.screenshot({ path: `${OUT}/journal.list.png` });

await select('Type', 'perpetual');
check('filter by type', (await rows.count()) === 1 && /Liquidated/.test(await rows.first().innerText()));
await select('Type', 'all');
await select('Result', 'losses');
check('filter by result', (await rows.count()) === 4);
await select('Result', 'all');
await select('Feeling', 'fomo');
check('filter by feeling', (await rows.count()) === 3 && (await page.getByText('of 8').isVisible()));
await select('Setup', 'Pullback');
check('filters combine', (await rows.count()) === 2);
await select('Feeling', 'all');
await select('Setup', '');
await page.getByRole('textbox', { name: 'Search', exact: true }).fill('eth');
check('search by symbol', (await rows.count()) === 2);
await page.getByRole('textbox', { name: 'Search', exact: true }).fill('nothing-matches');
check('no matches is explained', await page.getByText('No trades match these filters').isVisible());
await page.getByRole('textbox', { name: 'Search', exact: true }).fill('');
await select('Account', 'replay');
check('replay trades are kept apart', (await rows.count()) === 1 && /AAPL/.test(await rows.first().innerText()));
await select('Account', 'all');
check('both accounts together', (await rows.count()) === 9);
await select('Account', 'main');

// ── CSV ────────────────────────────────────────────────────────────────
const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export CSV' }).click()]);
const csv = readFileSync(await download.path(), 'utf8');
const lines = csv.trimEnd().split('\r\n');
check('the CSV has a header and a line per trade', lines.length === 9 && /^﻿Account,Status,/.test(lines[0]), `${lines.length} lines, file ${download.suggestedFilename()}`);
check('the CSV carries the notes, with quotes escaped', csv.includes('"Chased it, ""late"""') && csv.includes('Clean breakout'));
check('the CSV carries the numbers', lines.some((l) => /,Futures,,Short,0\.01,10,/.test(l) && /,-100,/.test(l) && /Liquidated/.test(l)));

// ── Detail ─────────────────────────────────────────────────────────────
await rows.nth(7).click();
await page.waitForURL(/\/journal\/p1$/);
await page.getByLabel('Review').waitFor({ timeout: 10000 });
check('clicking a trade opens its detail view', await page.getByRole('heading', { level: 1, name: /BTC\/USDT long/ }).isVisible());
check('the result is shown large, with its sign', /\+\$40\.00/.test(await page.locator('header').filter({ hasText: 'Result after costs' }).innerText()));
await page.locator('section', { hasText: 'Chart' }).first().locator('canvas').first().waitFor({ timeout: 30000 });
check('the chart of the trade is drawn', await page.getByText(/candles around the trade, saved when it closed/).isVisible());
const numbers = await page.locator('section').filter({ hasText: 'The numbers' }).innerText();
check('the numbers include prices, costs and R', /Entry price/.test(numbers) && /Stop-loss/.test(numbers) && /Take-profit/.test(numbers) && /Fees\s*-\$1\.00/.test(numbers) && /\+2\.00R/.test(numbers));
check('saved notes are shown', (await page.getByLabel('Why did you take this trade?').inputValue()) === 'Clean breakout, with volume' && (await page.getByRole('button', { name: 'Calm' }).getAttribute('aria-pressed')) === 'true');
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/journal.detail.png` });

await page.getByLabel('Review').fill('Would take this again');
await page.getByLabel('Setup', { exact: true }).fill('Trend following');
await page.getByRole('button', { name: 'Confident' }).click();
await page.getByRole('button', { name: '4 out of 5' }).click();
check('saving is confirmed', await page.getByText('Saved', { exact: true }).isVisible());
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByLabel('Review').waitFor({ timeout: 10000 });
check(
  'notes survive a reload',
  (await page.getByLabel('Review').inputValue()) === 'Would take this again' &&
    (await page.getByLabel('Setup', { exact: true }).inputValue()) === 'Trend following' &&
    (await page.getByRole('button', { name: 'Confident' }).getAttribute('aria-pressed')) === 'true' &&
    (await page.getByRole('button', { name: '4 out of 5' }).getAttribute('aria-pressed')) === 'true',
);
await page.locator('section', { hasText: 'Chart' }).first().locator('canvas').first().waitFor({ timeout: 30000 });
check('the saved chart is read back after a reload', await page.getByText(/saved when it closed/).isVisible());

await page.goto(`${BASE}/journal/${liq.positionId}`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { level: 1, name: /short/ }).waitFor({ timeout: 10000 });
const liqText = await page.locator('main').innerText();
check('a liquidated futures trade shows leverage, funding and the liquidation', /10x/.test(liqText) && /Funding paid/.test(liqText) && /Liquidated: the rest of the margin/.test(liqText) && /Return on margin/.test(liqText));
await page.goto(`${BASE}/journal/p8`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { level: 1, name: /Bull call spread on ETH/ }).waitFor({ timeout: 10000 });
check('an option trade shows what it cost and how it ended', /Cost to open\s*\$90\.00/.test(await page.locator('main').innerText()) && /Expired and settled in cash/.test(await page.locator('main').innerText()));
await page.goto(`${BASE}/journal/rp1`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { level: 1, name: /AAPL long/ }).waitFor({ timeout: 10000 });
await page.locator('section', { hasText: 'Chart' }).first().locator('canvas').first().waitFor({ timeout: 30000 });
check('a replay trade is charted from its own dates', (await page.getByText('Replay', { exact: true }).first().isVisible()) && (await page.getByText(/1 day candles around the trade/).isVisible()));
await page.goto(`${BASE}/journal/does-not-exist`, { waitUntil: 'domcontentloaded' });
check('an unknown trade is handled', await seen(page.getByText('That trade is not in the journal')));

// ── A live trade is logged by itself ───────────────────────────────────
await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
const ticket = page.locator('form').filter({ hasText: 'Simulated money' });
await ticket.waitFor({ timeout: 20000 });
await page.waitForTimeout(1500);
const P = Math.round(money(await ticket.locator('.num').first().innerText()) / 100) * 100;
await push('BTCUSDT', P);
await ticket.getByRole('textbox', { name: 'Quantity' }).fill('0.01');
await ticket.getByRole('textbox', { name: 'Stop-loss' }).fill(String(P * 0.99));
await ticket.getByRole('button', { name: /^Buy/ }).last().click();
await page.waitForTimeout(400);
await page.goto(`${BASE}/journal`, { waitUntil: 'domcontentloaded' });
await rows.first().waitFor({ timeout: 10000 });
check('an open position appears in the journal straight away', (await rows.count()) === 9 && /Open/.test(await rows.first().innerText()));
await rows.first().click();
await page.getByLabel('Why did you take this trade?').fill('Testing the journal');
check('an open position can be annotated', await page.getByText('Still open').isVisible());
await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await ticket.waitFor({ timeout: 20000 });
await page.waitForTimeout(1500);
await push('BTCUSDT', P * 1.01);
await ticket.getByRole('button', { name: 'Close position at market' }).click();
await page.waitForTimeout(600);
await page.goto(`${BASE}/journal`, { waitUntil: 'domcontentloaded' });
await rows.first().waitFor({ timeout: 10000 });
const logged = await rows.first().innerText();
check('closing it logs the trade with no further action', (await rows.count()) === 9 && /Closed by you/.test(logged) && /\+\$/.test(logged), logged.replace(/\s+/g, ' ').slice(0, 80));
await rows.first().click();
await page.getByLabel('Why did you take this trade?').waitFor({ timeout: 10000 });
check('notes written while it was open carry over', (await page.getByLabel('Why did you take this trade?').inputValue()) === 'Testing the journal');
await page.locator('section', { hasText: 'Chart' }).first().locator('canvas').first().waitFor({ timeout: 30000 });
check('its chart was saved', await page.getByText(/saved when it closed/).isVisible());

// ── Analytics ──────────────────────────────────────────────────────────
// Fresh seeded state, so the totals are the known ones.
const a = await open({ width: 1440, height: 900 });
const ap = a.page;
await ap.goto(`${BASE}/analytics`, { waitUntil: 'domcontentloaded' });
await ap.getByRole('heading', { name: 'Analytics', level: 1 }).waitFor({ timeout: 10000 });
const tile = async (label) => (await ap.locator('div.rounded-card').filter({ has: ap.getByText(label, { exact: true }) }).first().innerText()).replace(/\s+/g, ' ');
check('net result is the sum of the trades', new RegExp(`-\\$${Math.abs(NET).toFixed(2)}`).test(await tile('Net result')), await tile('Net result'));
check('win rate counts wins over trades', /50\.0%/.test(await tile('Win rate')) && /4 won · 4 lost/.test(await tile('Win rate')));
check('expectancy is the average result per trade', new RegExp(`-\\$${Math.abs(NET / 8).toFixed(2)}`).test(await tile('Expectancy')), await tile('Expectancy'));
check('average risk/reward is given in R', /\+0\.25R/.test(await tile('Average risk/reward')), await tile('Average risk/reward'));
check('profit factor is wins over losses', /0\.64/.test(await tile('Profit factor')), await tile('Profit factor'));
check('max drawdown and the longest losing run are given', /-\$160\.00/.test(await tile('Max drawdown')) && /Longest losing run: 4/.test(await tile('Max drawdown')), await tile('Max drawdown'));
check('a small sample is called out', await ap.getByText(/these numbers are mostly luck/).isVisible());
check('the profit curve is drawn', await ap.getByRole('img', { name: /Running total of profit across 8 closed trades/ }).isVisible());
const table = async (name) => (await ap.getByRole('table', { name }).innerText()).replace(/\s+/g, ' ');
check('results by setup', /Breakout 3 67% \+\$55\.00/.test(await table('By setup')) && /Pullback 3 33% -\$25\.00/.test(await table('By setup')) && /Not tagged 2/.test(await table('By setup')), await table('By setup'));
check('results by instrument type', /Spot 6 50% \+\$30\.00/.test(await table('By instrument type')) && /Futures 1 0% -\$100\.00/.test(await table('By instrument type')) && /Options 1 100% \+\$12\.00/.test(await table('By instrument type')));
check('results by feeling', /Calm 3 100% \+\$90\.00/.test(await table('By feeling')) && /FOMO 3 0% -\$60\.00/.test(await table('By feeling')), await table('By feeling'));
check('results by day of the week', (await ap.getByRole('table', { name: 'By day of the week' }).locator('tbody tr').count()) >= 2);
check('the pattern is put in a sentence', await ap.getByText(/Your FOMO trades lose \$20\.00 a trade on average, while Calm trades make \$30\.00/).isVisible());
await ap.waitForTimeout(300);
await ap.screenshot({ path: `${OUT}/analytics.png`, fullPage: false });

await ap.getByLabel('Type', { exact: true }).selectOption('spot');
check('filtering by type recalculates everything', /\+\$30\.00/.test(await tile('Net result')) && /6 closed trades/.test(await tile('Net result')));
await ap.getByLabel('Type', { exact: true }).selectOption('all');
await ap.getByRole('switch', { name: 'Include Replay trades' }).click();
check('replay trades are left out unless asked for', /9 closed trades/.test(await tile('Net result')) && /AAPL/.test(await table('By symbol')));
await a.context.close();

// ── Empty ──────────────────────────────────────────────────────────────
const empty = await open({ width: 1440, height: 900 }, {}, null);
await empty.page.goto(`${BASE}/journal`, { waitUntil: 'domcontentloaded' });
check('an empty journal says how to fill it', (await seen(empty.page.getByText('No trades yet'))) && (await empty.page.getByRole('button', { name: 'Export CSV' }).isDisabled()));
await empty.page.goto(`${BASE}/analytics`, { waitUntil: 'domcontentloaded' });
check('empty analytics says what will appear', await seen(empty.page.getByText('No closed trades to analyse yet')));
await empty.context.close();
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
const overflow = () => phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await phone.page.goto(`${BASE}/journal`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('table', { name: 'Trades' }).locator('tbody tr').first().waitFor({ timeout: 10000 });
check('phone: the journal list fits', (await overflow()) <= 0);
await phone.page.screenshot({ path: `${OUT}/journal.phone.png` });
await phone.page.getByRole('table', { name: 'Trades' }).locator('tbody tr').nth(7).tap();
await phone.page.getByLabel('Review').waitFor({ timeout: 10000 });
check('phone: the detail view fits', (await overflow()) <= 0);
await phone.page.goto(`${BASE}/analytics`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('table', { name: 'By setup' }).waitFor({ timeout: 10000 });
check('phone: analytics fits', (await overflow()) <= 0);
await phone.page.screenshot({ path: `${OUT}/analytics.phone.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

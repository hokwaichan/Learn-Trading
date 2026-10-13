// Smoke test for Replay. Needs the dev server; the Bitcoin check at the end needs internet.
//   npm run smoke
//
// Most of it runs on the bundled AAPL daily history, so the prices are the
// same on every run.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = '.screenshots';
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const browser = await chromium.launch();
const errors = [];

async function open(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, ...extra });
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''))) return;
    errors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
  return { context, page };
}

const money = (text) => Number(text.replace(/[^0-9.-]/g, ''));

/** Helpers bound to one page. */
function ui(page) {
  const bar = page.getByRole('toolbar', { name: 'Replay controls' });
  const ticket = page.locator('form').filter({ hasText: 'Simulated money' });
  const setup = page.locator('form').filter({ hasText: 'Start replay' });
  const input = (name) => setup.getByLabel(name, { exact: true });
  return {
    input,
    bar,
    ticket,
    field: (name) => ticket.getByRole('textbox', { name }),
    tab: (name) => page.getByRole('tab', { name }),
    rows: (label) => page.getByRole('table', { name: label }).locator('tbody tr'),
    clock: async () => (await bar.getByText('Replay time').locator('xpath=following-sibling::span').innerText()).trim(),
    replayEquity: async () => money((await bar.getByText('Replay account').locator('xpath=following-sibling::span').innerText()).split('\n')[0].split(' ')[0]),
    mainEquity: async () => money(await page.locator('header a[href="/journal"] .num').first().innerText()),
    price: async () => money(await ticket.locator('.num').first().innerText()),
    toasts: () => page.locator('div.fixed[aria-live="polite"]').innerText(),
    /** The replay store, read from the running app. */
    store: () =>
      page.evaluate(() => {
        const s = window.__replay.getState();
        return { cursor: s.cursor, loaded: s.candles.length, close: s.candles[s.cursor]?.close, time: s.candles[s.cursor]?.time, playing: s.playing, status: s.status };
      }),
    start: async (symbol, date) => {
      await input('Symbol').selectOption(symbol);
      await input('Start date').fill(date);
      await page.getByRole('button', { name: 'Start replay' }).click();
      await bar.waitFor({ timeout: 20000 });
      await page.locator('canvas').first().waitFor({ timeout: 20000 });
    },
  };
}

const { context, page } = await open({ width: 1440, height: 900 });
const u = ui(page);

// ── Set-up ─────────────────────────────────────────────────────────────
await page.goto(`${BASE}/replay`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Replay', level: 1 }).waitFor({ timeout: 10000 });
check('the set-up form is shown first', await page.getByRole('button', { name: 'Start replay' }).isVisible());
check('no playback bar before a session starts', !(await u.bar.isVisible()));
await page.screenshot({ path: `${OUT}/replay.setup.png` });

await page.getByRole('button', { name: 'Random date' }).click();
const random = await u.input('Start date').inputValue();
check('Random date picks a date in the past', /^\d{4}-\d{2}-\d{2}$/.test(random) && random < new Date().toISOString().slice(0, 10), random);

await u.input('Symbol').selectOption('AAPL');
check('a bundled symbol offers daily candles only', (await u.input('Candle size').locator('option').count()) === 1 && (await page.getByText('has daily history only').isVisible()));

await u.input('Start date').fill('2999-01-01');
check('a future date is refused', (await page.getByText('Choose a date before today.').isVisible()) && (await page.getByRole('button', { name: 'Start replay' }).isDisabled()));

// ── Start ──────────────────────────────────────────────────────────────
await u.start('AAPL', '2024-03-01');
check('starting shows the chart and the playback bar', await u.bar.isVisible());
check('the clock stops on the last day before the start date', (await u.clock()) === '2024-02-29', await u.clock());
check('the chart says it is a replay', await page.getByText('Replaying past prices').isVisible());
let s = await u.store();
check('history after the replay time is loaded but not shown', s.loaded > s.cursor + 100, `${s.loaded - s.cursor - 1} candles hidden`);
check('the ticket uses the replay price', Math.abs((await u.price()) - s.close) < 0.01, `$${s.close}`);
check('there is no watchlist in replay', !(await page.getByRole('tab', { name: 'Watchlist' }).isVisible()));
await page.screenshot({ path: `${OUT}/replay.start.png` });

// ── Stepping ───────────────────────────────────────────────────────────
await u.bar.getByRole('button', { name: /Next candle/ }).click();
check('Next candle reveals one day', (await u.clock()) === '2024-03-01', await u.clock());
const before = (await u.store()).cursor;
await u.bar.getByRole('button', { name: 'Forward 10 candles' }).click();
check('Forward 10 reveals ten candles', (await u.store()).cursor === before + 10);
await page.locator('main').click({ position: { x: 5, y: 5 } }).catch(() => {});
await page.locator('body').press('n');
check('N steps one candle', (await u.store()).cursor === before + 11);
s = await u.store();
check('the ticket price follows the replay', Math.abs((await u.price()) - s.close) < 0.01, `$${s.close}`);

// ── Trading on the replay account ──────────────────────────────────────
const mainBefore = await u.mainEquity();
const P = await u.price();
await u.field('Quantity').fill('10');
await u.field('Stop-loss').fill((P * 0.92).toFixed(2));
await u.field('Take-profit').fill((P * 1.01).toFixed(2));
await u.ticket.getByRole('button', { name: /^(Buy|Sell)/ }).last().click();
await page.waitForTimeout(300);
const confirm = page.getByRole('dialog', { name: 'Place this trade anyway?' });
if (await confirm.isVisible()) await confirm.getByRole('button', { name: /^(Buy|Sell)/ }).click();
await page.waitForTimeout(300);
check('a market order fills at the replay price', (await u.rows('Open positions').count()) === 1, await u.toasts());
const afterBuy = await u.replayEquity();
check('the cost comes off the replay account', afterBuy < 10000 && afterBuy > 9990, `$${afterBuy}`);
check('the main paper account is untouched', (await u.mainEquity()) === mainBefore, `$${mainBefore}`);
await page.screenshot({ path: `${OUT}/replay.position.png` });

let steps = 0;
while ((await u.rows('Open positions').count()) > 0 && steps < 20) {
  await u.bar.getByRole('button', { name: /Next candle/ }).click();
  steps++;
}
check('stepping forward triggers the take-profit', (await u.rows('Open positions').count()) === 0, `${steps} candles`);
check('a toast announces it', /Take-profit hit/.test(await u.toasts()));
await u.tab('History').click();
const trade = await u.rows('Trade history').first().innerText();
check('the trade is recorded with its exit reason', /Take-profit/.test(trade));
check('the trade is dated in replay time, not today', /2024|Mar/.test(trade) && !trade.includes(String(new Date().getFullYear())), trade.replace(/\s+/g, ' ').slice(0, 80));
check('the replay account shows the profit', (await u.replayEquity()) > 10000, `$${await u.replayEquity()}`);
check('the main paper account is still untouched', (await u.mainEquity()) === mainBefore);
await u.tab(/^Positions/).click();

// ── Play, pause, speed ─────────────────────────────────────────────────
await u.bar.getByLabel('Playback speed').selectOption('10');
const c0 = (await u.store()).cursor;
await u.bar.getByRole('button', { name: 'Play' }).click();
await page.waitForTimeout(1500);
await u.bar.getByRole('button', { name: 'Pause' }).click();
const c1 = (await u.store()).cursor;
check('Play reveals candles at the chosen speed', c1 - c0 >= 8 && c1 - c0 <= 20, `${c1 - c0} candles in 1.5s at 10 per second`);
await page.waitForTimeout(500);
check('Pause stops it', (await u.store()).cursor === c1);
await page.locator('body').press(' ');
await page.waitForTimeout(400);
check('Space starts playback', (await u.store()).playing);
await page.locator('body').press(' ');
check('Space pauses it', !(await u.store()).playing);

// ── Jump to date ───────────────────────────────────────────────────────
await u.bar.getByLabel('Jump to date').fill('2024-09-03');
await u.bar.getByRole('button', { name: 'Jump' }).click();
await page.waitForTimeout(300);
check('Jump moves forward to just before the date', (await u.clock()) === '2024-08-30', await u.clock());
await page.screenshot({ path: `${OUT}/replay.jump.png` });

// ── Reload carries on ──────────────────────────────────────────────────
await u.field('Quantity').fill('5');
await u.field('Stop-loss').fill(((await u.price()) * 0.95).toFixed(2));
await u.field('Take-profit').fill('');
await u.ticket.getByRole('button', { name: /^(Buy|Sell)/ }).last().click();
await page.waitForTimeout(300);
if (await confirm.isVisible()) await confirm.getByRole('button', { name: /^(Buy|Sell)/ }).click();
await page.waitForTimeout(300);
check('a second position is open before the reload', (await u.rows('Open positions').count()) === 1);
await page.reload({ waitUntil: 'domcontentloaded' });
await u.bar.waitFor({ timeout: 20000 });
check('a reload carries on at the same replay time', (await u.clock()) === '2024-08-30', await u.clock());
check('and keeps the open position', (await u.rows('Open positions').count()) === 1);

// ── Ending ─────────────────────────────────────────────────────────────
await u.bar.getByRole('button', { name: 'End session' }).click();
const endDialog = page.getByRole('dialog', { name: 'End this session?' });
check('ending with an open position asks first', await endDialog.isVisible());
await page.screenshot({ path: `${OUT}/replay.end.png` });
await endDialog.getByRole('button', { name: 'Cancel' }).click();
check('cancelling keeps the session', (await u.bar.isVisible()) && (await u.rows('Open positions').count()) === 1);
await u.bar.getByRole('button', { name: 'End session' }).click();
await endDialog.getByRole('button', { name: 'End session' }).click();
await page.getByRole('button', { name: 'Start replay' }).waitFor({ timeout: 5000 });
check('ending returns to the set-up form', !(await u.bar.isVisible()));
check('the set-up form counts the replay trades', await page.getByText(/2 trades so far/).isVisible());

await page.getByRole('button', { name: 'Reset replay account' }).click();
const resetDialog = page.getByRole('dialog', { name: 'Reset replay account?' });
check('resetting the replay account asks first', await resetDialog.isVisible());
await resetDialog.getByRole('button', { name: 'Reset replay account' }).click();
await page.waitForTimeout(300);
check('reset clears the replay trades', await page.getByText(/0 trades so far/).isVisible());

// ── End of history ─────────────────────────────────────────────────────
const recent = new Date(Date.now() - 12 * 86_400_000).toISOString().slice(0, 10);
await u.start('AAPL', recent);
for (let i = 0; i < 3; i++) await u.bar.getByRole('button', { name: 'Forward 10 candles' }).click({ timeout: 2000 }).catch(() => {});
check('running out of history says so and disables the controls', (await u.bar.getByText('End of history').isVisible()) && (await u.bar.getByRole('button', { name: 'Play' }).isDisabled()));
await u.bar.getByRole('button', { name: 'End session' }).click();
await page.getByRole('button', { name: 'Start replay' }).waitFor({ timeout: 5000 });

// ── Live crypto history ────────────────────────────────────────────────
const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
await u.input('Symbol').selectOption('BTCUSDT');
await u.input('Candle size').selectOption('1h');
await u.start('BTCUSDT', monthAgo);
check('Bitcoin replays on hourly candles', (await u.clock()).startsWith(monthAgo) || (await u.clock()).includes('UTC'), await u.clock());
const b0 = (await u.store()).cursor;
await u.bar.getByRole('button', { name: 'Forward 10 candles' }).click();
check('and steps forward', (await u.store()).cursor === b0 + 10);
check('the main workspace is separate: top bar equity unchanged', (await u.mainEquity()) === mainBefore);
await page.screenshot({ path: `${OUT}/replay.btc.png` });
await u.bar.getByRole('button', { name: 'End session' }).click();
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
const pu = ui(phone.page);
await phone.page.goto(`${BASE}/replay`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('button', { name: 'Start replay' }).waitFor({ timeout: 10000 });
check('phone: set-up has no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.screenshot({ path: `${OUT}/replay.phone.setup.png` });
await pu.start('AAPL', '2024-03-01');
await pu.bar.getByRole('button', { name: /Next candle/ }).tap();
check('phone: the playback bar works', (await pu.clock()) === '2024-03-01', await pu.clock());
check('phone: no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.screenshot({ path: `${OUT}/replay.phone.chart.png` });
await phone.page.getByRole('button', { name: 'Order', exact: true }).tap();
check('phone: the ticket opens in a bottom sheet', await phone.page.getByRole('dialog', { name: 'Order' }).getByRole('textbox', { name: 'Quantity' }).isVisible());
await phone.page.waitForTimeout(300);
await phone.page.screenshot({ path: `${OUT}/replay.phone.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

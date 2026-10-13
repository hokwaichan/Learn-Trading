// Smoke test for spot paper trading. Needs the dev server and internet.
//   npm run smoke
//
// Candles come from the real API, but the live price stream is replaced with
// one this script controls, so stop-losses, take-profits and limit orders can
// be triggered on demand instead of waiting for the market.
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
const STEP = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400 };

async function open(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, ...extra });
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
  /** Sends a new last price for a symbol to every stream the page has open for it. */
  const push = async (symbol, price) => {
    for (const ws of sockets) {
      const m = ws.url().match(/\/ws\/(\w+)@kline_(\w+)/);
      if (!m || m[1] !== symbol.toLowerCase()) continue;
      const step = STEP[m[2]] * 1000;
      const t = Math.floor(Date.now() / step) * step;
      const p = String(price);
      try {
        ws.send(JSON.stringify({ e: 'kline', k: { t, o: p, h: p, l: p, c: p, v: '1' } }));
      } catch {
        sockets.delete(ws);
      }
    }
    await page.waitForTimeout(250);
  };
  return { context, page, push, sockets };
}

const { context, page, push, sockets } = await open({ width: 1440, height: 900 });
const money = (text) => Number(text.replace(/[^0-9.-]/g, ''));
const ticket = page.locator('form').filter({ hasText: 'Simulated money' });
const field = (name) => ticket.getByRole('textbox', { name });
const tab = (name) => page.getByRole('tab', { name });
const rows = (label) => page.getByRole('table', { name: label }).locator('tbody tr');
const equity = async () => money(await page.locator('header a[href="/journal"] .num').first().innerText());
const toastArea = page.locator('div.fixed[aria-live="polite"]');
const toasts = () => toastArea.innerText();
const lastToast = () => toastArea.locator('> div').last().innerText();
const submit = () => ticket.getByRole('button', { name: /^(Buy|Sell)/ }).last().click();

await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await ticket.waitFor({ timeout: 10000 });
check('the Order tab shows the ticket by default', await ticket.isVisible());
const start = money(await ticket.locator('.num').first().innerText());
// Round test prices so they are easy to read in the output.
const P = Math.round(start / 100) * 100;
await page.waitForFunction(() => true);
await page.waitForTimeout(1500);
await push('BTCUSDT', P);
check('the ticket follows the live price', money(await ticket.locator('.num').first().innerText()) === P, `price ${P}`);
check('account starts at $10,000', (await equity()) === 10000);

// ── Validation and warnings ────────────────────────────────────────────
await submit();
check('an empty ticket asks for a quantity', await ticket.getByText('Enter a quantity.').isVisible());
await field('Quantity').fill('0.01');
check('a trade with no stop-loss is flagged', await ticket.getByText(/No stop-loss\. Nothing limits the loss/).isVisible());
await submit();
const confirm = page.getByRole('dialog', { name: 'Place this trade anyway?' });
check('placing it asks for confirmation in the warning style', await confirm.isVisible());
await page.screenshot({ path: `${OUT}/trade.confirm.png` });
await confirm.getByRole('button', { name: 'Cancel' }).click();
check('cancelling places nothing', (await rows('Open positions').count()) === 0);

await field('Stop-loss').fill(String(P * 1.01));
await submit();
check('a stop-loss on the wrong side is refused', await ticket.getByText('For a long, the stop-loss must be below the entry price.').isVisible());

// ── Market order with stop and target ──────────────────────────────────
await field('Stop-loss').fill(String(P * 0.99));
await field('Take-profit').fill(String(P * 1.02));
const ratio = Number((await ticket.locator('dl').innerText()).match(/([\d.]+) : 1/)?.[1]);
check('reward to risk is shown, after slippage', ratio > 1.8 && ratio < 1.9, `${ratio} : 1`);
await page.screenshot({ path: `${OUT}/trade.ticket.png` });
await submit();
await page.waitForTimeout(300);
check('with a small risk and a stop there is no confirmation', !(await confirm.isVisible()));
check('a toast confirms the fill', /Bought 0\.01 BTC/.test(await lastToast()));
check('the position appears', (await rows('Open positions').count()) === 1);
const row = rows('Open positions').first();
check('it is labelled Long in words', await row.getByText('Long', { exact: true }).isVisible());
const fee = 10000 - (await equity());
check('the fee and slippage came off equity straight away', fee > 0.5 && fee < 2, `equity down $${fee.toFixed(2)}`);
check('the Positions tab shows a count', /Positions\s*1/.test(await tab(/^Positions/).innerText()));

await push('BTCUSDT', P * 1.005);
const pnlText = await row.locator('td').nth(5).innerText();
check('profit is shown with a plus sign', /^\+\$\d/.test(pnlText.trim()), pnlText.replace(/\s+/g, ' '));
check("today's P&L in the top bar is positive", /\+\$/.test(await page.locator('header a[href="/journal"]').innerText()));
await page.screenshot({ path: `${OUT}/trade.position.png` });

await tab(/^Orders/).click();
check('the stop-loss and take-profit are listed as orders', (await rows('Open orders').count()) === 2 && (await rows('Open orders').filter({ hasText: 'Stop-loss' }).count()) === 1);
await tab(/^Positions/).click();

// ── Edit stops ─────────────────────────────────────────────────────────
await row.getByRole('button', { name: /Edit stops/ }).click();
const edit = page.getByRole('dialog', { name: /Stops for BTC\/USDT long/ });
await edit.getByRole('textbox', { name: 'Stop-loss' }).fill(String(P * 1.01));
await edit.getByRole('button', { name: 'Save' }).click();
check('a stop above the current price is refused when editing', await edit.getByText(/must be below the current price/).isVisible());
await edit.getByRole('textbox', { name: 'Stop-loss' }).fill(String(P * 0.995));
await edit.getByRole('button', { name: 'Save' }).click();
await page.waitForTimeout(200);
check('a valid stop is saved', /0\.995|,/.test(await row.locator('td').nth(6).innerText()) && !(await edit.isVisible()));

// ── Take-profit triggers ───────────────────────────────────────────────
await push('BTCUSDT', P * 1.021);
check('reaching the target closes the position', (await rows('Open positions').count()) === 0);
check('a toast announces the take-profit', /Take-profit hit/.test(await toasts()));
await tab('History').click();
const first = rows('Trade history').first();
check('the trade is in History with its exit reason', /Take-profit/.test(await first.innerText()));
const r1 = (await first.innerText()).match(/([+-]\d+\.\d\d)R/)?.[1];
check('the result is close to +2R after costs', Number(r1) > 1.5 && Number(r1) <= 2.05, `${r1}R`);
await page.screenshot({ path: `${OUT}/trade.history.png` });

// ── Size from risk, then a stop-loss ───────────────────────────────────
await push('BTCUSDT', P);
await tab(/^Positions/).click();
await ticket.getByRole('radio', { name: 'Size from risk' }).click();
await field('Stop-loss').fill(String(P * 0.98));
await field('Take-profit').fill('');
const sizing = await ticket.getByText(/gives a size of/).innerText();
const eq = await equity();
const size = Number(sizing.match(/size of\s*([\d.]+)/)[1]);
const expected = (eq * 0.01) / (P * 1.0005 - P * 0.98);
check('the calculator sizes the trade to risk 1% of the account', Math.abs(size - expected) / expected < 0.01, `${size} BTC, expected about ${expected.toFixed(5)}`);
await submit();
await page.waitForTimeout(300);
check('the sized trade fills', (await rows('Open positions').count()) === 1);
await push('BTCUSDT', P * 0.979);
check('falling through the stop closes the position', (await rows('Open positions').count()) === 0);
check('a toast announces the stop-loss', /Stop-loss hit/.test(await toasts()));
await tab('History').click();
const r2 = (await rows('Trade history').first().innerText()).match(/([+-]\d+\.\d\d)R/)?.[1];
check('the loss is about 1R, slightly worse after slippage and fees', Number(r2) <= -1 && Number(r2) > -1.25, `${r2}R`);
const lost = eq - (await equity());
check('the account lost about 1%', lost / eq > 0.0095 && lost / eq < 0.0125, `${((lost / eq) * 100).toFixed(2)}%`);

// ── Risk above 2% ──────────────────────────────────────────────────────
await push('BTCUSDT', P);
await tab(/^Positions/).click();
await ticket.getByRole('slider', { name: 'Risk on this trade' }).fill('3');
check('risking more than 2% is flagged', await ticket.getByText(/above the 2% guideline/).isVisible());
// With the stop only 2% away, 3% risk needs a position bigger than the account: spot has no leverage.
await submit();
check('a size the account cannot fund is refused before any confirmation', (await ticket.getByText(/Not enough free funds/).isVisible()) && !(await confirm.isVisible()));
await field('Stop-loss').fill(String(P * 0.9));
await submit();
check('and needs confirmation', await confirm.isVisible());
await confirm.getByRole('button', { name: /^Buy/ }).click();
await page.waitForTimeout(300);
check('confirming places it', (await rows('Open positions').count()) === 1);
await rows('Open positions').first().getByRole('button', { name: /Close/ }).click();
await page.waitForTimeout(300);
check('Close closes the position at market', (await rows('Open positions').count()) === 0);

// ── Limit order ────────────────────────────────────────────────────────
await ticket.getByRole('radio', { name: 'Set quantity' }).click();
await ticket.getByRole('radio', { name: 'Limit' }).click();
await field('Limit price').fill(String(P * 0.95));
await field('Quantity').fill('0.01');
await field('Stop-loss').fill(String(P * 0.94));
await submit();
await page.waitForTimeout(300);
check('a limit order below the market waits', (await rows('Open positions').count()) === 0 && /Limit order placed/.test(await toasts()));
await tab(/^Orders/).click();
check('it is listed under Orders', (await rows('Open orders').filter({ hasText: 'Limit' }).count()) === 1);
await page.screenshot({ path: `${OUT}/trade.orders.png` });
await push('BTCUSDT', P * 0.949);
check('it fills when price reaches it', /Limit order filled/.test(await toasts()));
await tab(/^Positions/).click();
// The price jumped straight to 0.949 P, past the limit, so the fill is at that better price.
const cells = await rows('Open positions').first().locator('td').allInnerTexts();
check('at the limit price or better', money(cells[3]) <= P * 0.95 && money(cells[3]) >= P * 0.949 - 0.01, cells[3]);
check('with its stop-loss attached', money(cells[6]) === P * 0.94, cells[6]);
await rows('Open positions').first().getByRole('button', { name: /Close/ }).click();

// Cancel a waiting order.
await push('BTCUSDT', P);
await field('Limit price').fill(String(P * 0.9));
await field('Quantity').fill('0.01');
await field('Stop-loss').fill(String(P * 0.89));
await submit();
await tab(/^Orders/).click();
await rows('Open orders').first().getByRole('button', { name: /Cancel/ }).click();
check('a waiting order can be cancelled', (await rows('Open orders').count()) === 0);

// ── Too large, and going short ─────────────────────────────────────────
await ticket.getByRole('radio', { name: 'Market' }).click();
await field('Stop-loss').fill('');
await field('Quantity').fill('5');
await submit();
check('an order bigger than the account is refused with the amounts', await ticket.getByText(/Not enough free funds\. This needs/).isVisible());

await ticket.getByRole('button', { name: 'Sell / Short' }).click();
await field('Quantity').fill('0.01');
await field('Stop-loss').fill(String(P * 1.01));
await submit();
await page.waitForTimeout(300);
await tab(/^Positions/).click();
check('selling opens a short', await rows('Open positions').first().getByText('Short', { exact: true }).isVisible());
await push('BTCUSDT', P * 0.99);
check('a short profits when price falls', /^\+\$/.test((await rows('Open positions').first().locator('td').nth(5).innerText()).trim()));

// ── Persistence and the engine running on other pages ──────────────────
await page.reload({ waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await tab(/^Positions/).click();
check('open positions survive a reload', (await rows('Open positions').count()) === 1);
await page.getByRole('link', { name: 'Glossary' }).first().click();
await page.getByRole('heading', { name: 'Glossary', level: 1 }).waitFor();
await page.waitForTimeout(1500);
check('a price stream stays open for the position away from the chart', [...sockets].some((ws) => /btcusdt@kline_1m/.test(ws.url())));
await push('BTCUSDT', P * 1.011);
check('the stop-loss still triggers on another page', /Stop-loss hit/.test(await toasts()));
check('equity in the top bar reflects it', (await equity()) < 10000);

// ── Bundled symbols and reset ──────────────────────────────────────────
await page.goto(`${BASE}/charts/AAPL`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
check('bundled symbols cannot be traded live and point to Replay', await page.getByText('AAPL has no live price').isVisible());

await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Reset account' }).click();
await page.getByRole('dialog', { name: 'Reset paper account?' }).getByRole('button', { name: 'Reset account' }).click();
await page.waitForTimeout(300);
check('reset puts the balance back to $10,000', (await equity()) === 10000);
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
await phone.page.goto(`${BASE}/charts/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await phone.page.locator('canvas').first().waitFor({ timeout: 20000 });
await phone.page.getByRole('button', { name: 'Order', exact: true }).tap();
const sheet = phone.page.getByRole('dialog', { name: 'Order' });
await sheet.getByRole('button', { name: 'Buy / Long' }).first().waitFor();
check('phone: the ticket opens in a bottom sheet', await sheet.getByRole('textbox', { name: 'Quantity' }).isVisible());
check('phone: no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.waitForTimeout(300);
await phone.page.screenshot({ path: `${OUT}/trade.phone.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

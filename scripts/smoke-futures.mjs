// Smoke test for the futures simulator. Needs the dev server and internet.
//   npm run smoke
//
// Candles come from the real API, but the live price stream is replaced with
// one this script controls, so liquidations can be triggered on demand.
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

async function open(viewport, extra = {}, fakeClock = false) {
  const context = await browser.newContext({ viewport, ...extra });
  const page = await context.newPage();
  if (fakeClock) await page.clock.install();
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
    const now = await page.evaluate(() => Date.now());
    for (const ws of sockets) {
      const m = ws.url().match(/\/ws\/(\w+)@kline_(\w+)/);
      if (!m || m[1] !== symbol.toLowerCase()) continue;
      const step = STEP[m[2]] * 1000;
      const t = Math.floor(now / step) * step;
      const p = String(price);
      try {
        ws.send(JSON.stringify({ e: 'kline', k: { t, o: p, h: p, l: p, c: p, v: '1' } }));
      } catch {
        sockets.delete(ws);
      }
    }
    await page.waitForTimeout(250);
  };
  return { context, page, push };
}

const money = (text) => Number(text.replace(/[^0-9.-]/g, ''));

function ui(page) {
  const ticket = page.locator('form').filter({ hasText: 'Simulated money' });
  const confirm = page.getByRole('dialog', { name: 'Place this trade anyway?' });
  const toastArea = page.locator('div.fixed[aria-live="polite"]');
  return {
    ticket,
    confirm,
    field: (name) => ticket.getByRole('textbox', { name }),
    tab: (name) => page.getByRole('tab', { name }),
    rows: (label) => page.getByRole('table', { name: label }).locator('tbody tr'),
    equity: async () => money(await page.locator('header a[href="/journal"] .num').first().innerText()),
    toasts: () => toastArea.innerText(),
    row: async (label) => (await ticket.locator('dl div').filter({ hasText: label }).first().locator('dd').innerText()).trim(),
    leverage: (x) => ticket.getByRole('slider', { name: /Leverage/ }).fill(String(x)),
    meter: page.getByRole('meter', { name: 'Distance to liquidation' }),
    /** Submits the ticket and accepts the warning dialog if one appears. */
    submit: async () => {
      await ticket.getByRole('button', { name: /^(Buy|Sell)/ }).last().click();
      await page.waitForTimeout(300);
      if (await confirm.isVisible()) await confirm.getByRole('button', { name: /^(Buy|Sell)/ }).click();
      await page.waitForTimeout(300);
    },
    ready: async () => {
      await page.locator('canvas').first().waitFor({ timeout: 20000 });
      await ticket.waitFor({ timeout: 15000 });
      await page.waitForTimeout(1500);
    },
  };
}

const { context, page, push } = await open({ width: 1440, height: 900 });
const u = ui(page);

await page.goto(`${BASE}/futures/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await u.ready();
const P = Math.round(money(await u.ticket.locator('.num').first().innerText()) / 100) * 100;
await push('BTCUSDT', P);

// ── The ticket ─────────────────────────────────────────────────────────
check('the futures ticket has a leverage slider and margin modes', (await u.ticket.getByRole('slider', { name: /Leverage/ }).isVisible()) && (await u.ticket.getByRole('tab', { name: 'Isolated' }).isVisible()) && (await u.ticket.getByRole('tab', { name: 'Cross' }).isVisible()));
check('leverage is explained in plain words', await u.ticket.getByText(/Every \$1 of your money controls \$3 of BTC/).isVisible());
check('isolated margin is explained', await u.ticket.getByText(/Isolated: this trade can lose only the margin put into it/).isVisible());

await u.leverage(10);
await u.field('Quantity').fill('0.05');
const value = P * 0.05;
const marginText = await u.row('Margin needed');
check('margin needed is the position value divided by leverage', Math.abs(money(marginText) - value / 10) < value * 0.002, `${marginText} for a ${Math.round(value)} position`);
const liqText = await u.row('Liquidation price');
const liqEst = money(liqText.split('(')[0]);
check('the estimated liquidation price is about 9.5% below entry at 10x', Math.abs(liqEst / P - 0.905) < 0.002 && /9\.5% away/.test(liqText), liqText);
check('above 5x a warning says how small a move liquidates', await u.ticket.getByText(/10x leverage\. A move of only 9\.5% against you liquidates this position/).isVisible());

await u.leverage(5);
check('at 5x there is no leverage warning', !(await u.ticket.getByText(/5x leverage\. A move/).isVisible()));
await u.leverage(20);
check('20x is the most allowed, with liquidation 4.5% away', /4\.5% away/.test(await u.row('Liquidation price')));

await u.ticket.getByRole('tab', { name: 'Cross' }).click();
const crossText = await u.row('Liquidation price');
check('cross margin puts liquidation much further away', crossText === 'None' || Number(crossText.match(/([\d.]+)% away/)?.[1]) > 30, crossText);
check('cross margin is explained with its danger', await u.ticket.getByText(/a liquidation can empty the account/).isVisible());
await u.ticket.getByRole('tab', { name: 'Isolated' }).click();

await u.leverage(10);
await u.field('Stop-loss').fill(String(P * 0.85));
check('a stop-loss beyond the liquidation price is called out', await u.ticket.getByText(/Your stop-loss is beyond the liquidation price/).isVisible());
await u.field('Stop-loss').fill('');
await page.screenshot({ path: `${OUT}/futures.ticket.png` });

// ── Open a 10x long ────────────────────────────────────────────────────
await u.ticket.getByRole('button', { name: /^Buy/ }).last().click();
await page.waitForTimeout(300);
check('high leverage asks for confirmation in the warning style', (await u.confirm.isVisible()) && /10x leverage/.test(await u.confirm.innerText()));
await page.screenshot({ path: `${OUT}/futures.confirm.png` });
await u.confirm.getByRole('button', { name: /^Buy/ }).click();
await page.waitForTimeout(400);
check('the position opens', (await u.rows('Open positions').count()) === 1);
const row = u.rows('Open positions').first();
check('the position row shows its leverage', /10x/.test(await row.innerText()));
const cells = await row.locator('td').allInnerTexts();
const liq = money(cells[8]);
check('the position row shows its liquidation price', Math.abs(liq / P - 0.905) < 0.003, cells[8]);
const cost = 10000 - (await u.equity());
check('opening costs only the fee: margin is set aside, not spent', cost > 0 && cost < value * 0.003, `equity down $${cost.toFixed(2)}`);
check('margin in use is shown', Math.abs(money(await u.row('Margin in use')) - value / 10) < value * 0.003, await u.row('Margin in use'));

// ── The gauge ──────────────────────────────────────────────────────────
check('a liquidation gauge appears for the open position', await u.meter.isVisible());
check('at the entry price it reads comfortable', /Comfortable/.test(await u.meter.getAttribute('aria-valuetext')), await u.meter.getAttribute('aria-valuetext'));
check('it says what a liquidation would cost', await u.ticket.getByText(/That would lose its \$[\d,.]+ margin and nothing more/).isVisible());
check('funding and the next payment are shown', await u.ticket.getByText(/Next in\s+\dh \d\dm/).isVisible());
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/futures.position.png` });

await push('BTCUSDT', P * 0.95);
check('half way to liquidation it reads getting close', /Getting close/.test(await u.meter.getAttribute('aria-valuetext')), await u.meter.getAttribute('aria-valuetext'));
const pnlCell = (await row.locator('td').nth(5).innerText()).replace(/\s+/g, ' ');
check('a 5% fall at 10x shows as about -50% on the margin', /-5\d\.\d+%/.test(pnlCell), pnlCell);
await push('BTCUSDT', P * 0.915);
check('close to it, it reads near liquidation', /Near liquidation/.test(await u.meter.getAttribute('aria-valuetext')));
await page.screenshot({ path: `${OUT}/futures.danger.png` });

// ── Liquidation ────────────────────────────────────────────────────────
await push('BTCUSDT', P * 0.9);
check('reaching the liquidation price closes the position', (await u.rows('Open positions').count()) === 0);
check('a toast announces the liquidation', /Position liquidated/.test(await u.toasts()));
const afterLiq = 10000 - (await u.equity());
check('the loss is the margin plus the entry fee, no more', Math.abs(afterLiq - value / 10) < value * 0.004, `lost $${afterLiq.toFixed(2)} on $${(value / 10).toFixed(2)} of margin`);
await u.tab('History').click();
check('history records it as liquidated', /Liquidated/.test(await u.rows('Trade history').first().innerText()));
await u.tab(/^Positions/).click();
await page.screenshot({ path: `${OUT}/futures.liquidated.png` });

// ── Stop-loss before liquidation, short side ───────────────────────────
await push('BTCUSDT', P);
await u.ticket.getByRole('button', { name: 'Sell / Short' }).click();
await u.leverage(5);
await u.field('Quantity').fill('0.05');
await u.field('Stop-loss').fill(String(P * 1.05));
check('a short is liquidated above its entry', money((await u.row('Liquidation price')).split('(')[0]) > P * 1.15);
await u.submit();
check('a 5x short opens without the leverage warning', (await u.rows('Open positions').count()) === 1 && /Short/.test(await u.rows('Open positions').first().innerText()));
await push('BTCUSDT', P * 1.06);
check('its stop-loss closes it before liquidation', (await u.rows('Open positions').count()) === 0 && /Stop-loss hit/.test(await u.toasts()));

// ── Spot is unchanged ──────────────────────────────────────────────────
await page.goto(`${BASE}/charts/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await u.ready();
check('the spot ticket has no leverage', !(await u.ticket.getByRole('slider', { name: /Leverage/ }).isVisible()) && (await u.ticket.getByText('Free funds').isVisible()));
await context.close();

// ── Funding ────────────────────────────────────────────────────────────
const timed = await open({ width: 1440, height: 900 }, {}, true);
const t = ui(timed.page);
await timed.page.goto(`${BASE}/futures/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await t.ready();
const E = Math.round(money(await t.ticket.locator('.num').first().innerText()));
await timed.push('ETHUSDT', E);
await t.leverage(2);
await t.field('Quantity').fill('1');
await t.field('Stop-loss').fill(String(Math.round(E * 0.9)));
await t.submit();
check('funding: a position is open', (await t.rows('Open positions').count()) === 1);
const before = await t.equity();
await timed.page.clock.fastForward('08:01:00');
await timed.page.waitForTimeout(500);
await timed.push('ETHUSDT', E);
check('funding is charged when the funding time passes', /Funding paid/.test(await t.toasts()), (await t.toasts()).replace(/\s+/g, ' ').slice(-70));
const paid = before - (await t.equity());
check('a long pays 0.01% of the position', Math.abs(paid - E * 0.0001) < E * 0.00003, `$${paid.toFixed(4)} on a $${E} position`);
check('the position card shows funding paid so far', await t.ticket.getByText(/so far:\s+paid \$/).isVisible());
await timed.context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
await phone.page.goto(`${BASE}/futures/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await phone.page.locator('canvas').first().waitFor({ timeout: 20000 });
await phone.page.getByRole('button', { name: 'Order', exact: true }).tap();
const sheet = phone.page.getByRole('dialog', { name: 'Order' });
await sheet.getByRole('slider', { name: /Leverage/ }).waitFor({ timeout: 15000 });
check('phone: the futures ticket opens in a sheet with leverage', await sheet.getByRole('tab', { name: 'Cross' }).isVisible());
check('phone: no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.waitForTimeout(300);
await phone.page.screenshot({ path: `${OUT}/futures.phone.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

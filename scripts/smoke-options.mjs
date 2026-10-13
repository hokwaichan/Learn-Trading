// Smoke test for the Options page. Needs the dev server and internet.
//   npm run smoke
//
// Daily candles come from the real API; the live price stream is replaced
// with one this script controls so option values can be moved on demand.
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
      const p = String(price);
      try {
        ws.send(JSON.stringify({ e: 'kline', k: { t: Math.floor(now / step) * step, o: p, h: p, l: p, c: p, v: '1' } }));
      } catch {
        sockets.delete(ws);
      }
    }
    await page.waitForTimeout(300);
  };
  return { context, page, push };
}

const money = (text) => Number(text.replace(/[^0-9.-]/g, ''));

function ui(page) {
  const builder = page.getByRole('complementary', { name: 'Strategy builder' }).or(page.locator('#options-panel-builder'));
  const chain = page.getByRole('table', { name: /Simulated option chain/ });
  const fact = async (label) => (await builder.locator('dl div').filter({ has: page.locator('dt', { hasText: label }) }).first().locator('dd').innerText()).trim().replace(/\s+/g, ' ');
  return {
    builder,
    chain,
    fact,
    atm: chain.locator('tr[data-atm]'),
    legs: builder.getByRole('group', { name: /^Leg \d/ }),
    readout: async () => (await builder.locator('section[aria-label="Payoff diagram"] p').innerText()).replace(/\s+/g, ' '),
    readoutPnl: async () => money((await builder.locator('section[aria-label="Payoff diagram"] p span').last().innerText()).replace('+', '')),
    template: (id) => builder.getByLabel('Start from a strategy').selectOption(id),
    slider: (name) => builder.getByRole('slider', { name }),
    openButton: builder.getByRole('button', { name: 'Open paper position' }),
    positions: page.getByRole('table', { name: 'Open option positions' }).locator('tbody tr'),
    equity: async () => money(await page.locator('header a[href="/journal"] .num').first().innerText()),
    toasts: () => page.locator('div.fixed[aria-live="polite"]').innerText(),
    spot: async () => money(await page.locator('span', { hasText: /^Price/ }).first().locator('.num').innerText()),
    ready: async () => {
      await chain.waitFor({ timeout: 30000 });
      await page.waitForTimeout(1200);
    },
  };
}

const { context, page, push } = await open({ width: 1440, height: 900 });
const u = ui(page);
await page.goto(`${BASE}/options/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await u.ready();
const S = Math.round(await u.spot());
await push('ETHUSDT', S);

// ── Chain ──────────────────────────────────────────────────────────────
check('the page says prices are simulated, not market quotes', await page.getByText('Simulated prices, not market quotes.').isVisible());
const vol = await page.getByRole('note').locator('.num').first().innerText();
check('the volatility behind the prices is stated', /^\d+\.\d%$/.test(vol.trim()), vol);
check('five expiries are offered', (await page.getByRole('tablist', { name: 'Expiry date' }).getByRole('tab').count()) === 5);
check('calls are on the left and puts on the right of the strikes', /Calls.*Puts/s.test(await u.chain.locator('thead').innerText()));
check('one row is marked at the money', (await u.atm.count()) === 1 && /ATM/.test(await u.atm.innerText()));
const strike = money((await u.atm.locator('th').innerText()).replace('ATM', ''));
check('the at-the-money strike is the one nearest the price', Math.abs(strike - S) / S < 0.011, `strike ${strike}, price ${S}`);
check('the chain lists 25 strikes', (await u.chain.locator('tbody tr').count()) === 25);
const cells = await u.atm.locator('td').allInnerTexts();
check('each side shows delta, volatility, bid and ask', cells.length === 8 && /^0\.\d\d$/.test(cells[0].trim()) && /%$/.test(cells[1].trim()) && /^-0\.\d\d$/.test(cells[7].trim()), cells.map((c) => c.trim()).join(' | '));
check('the ask is above the bid', money(cells[3]) > money(cells[2]) && money(cells[5]) > money(cells[4]));
await page.screenshot({ path: `${OUT}/options.chain.png` });

// ── A single leg from the chain ────────────────────────────────────────
const ask = money(cells[3]);
await u.atm.getByRole('button', { name: /^Buy the .* call/ }).click();
check('clicking an ask adds a bought leg to the builder', (await u.legs.count()) === 1 && /buy 1 .* call/.test(await u.legs.first().getAttribute('aria-label')));
check('the clicked price is marked in the chain', (await u.atm.getByRole('button', { name: /^Buy the .* call/ }).getAttribute('aria-pressed')) === 'true');
check('a payoff diagram is drawn', await u.builder.getByRole('img', { name: /Payoff diagram/ }).isVisible());
check('a long call is a debit of its ask', /^Debit/.test(await u.fact('Net premium')) && Math.abs(money(await u.fact('Net premium')) - ask) < 0.02, await u.fact('Net premium'));
check('its max loss is the premium and its max profit unlimited', Math.abs(money(await u.fact('Max loss')) - ask) < 0.02 && (await u.fact('Max profit')) === 'Unlimited');
check('its break-even is the strike plus the premium', Math.abs(money(await u.fact('Break-even')) - (strike + ask)) < 0.05, await u.fact('Break-even'));
const chance = money(await u.fact('Chance of profit'));
check('a chance of profit is given', chance > 5 && chance < 60, `${chance}%`);
check('delta is positive and theta negative for a bought call', /^\+\$/.test(await u.fact('Delta')) && /^-\$/.test(await u.fact('Theta')), `${await u.fact('Delta')} · ${await u.fact('Theta')}`);

// ── What-if sliders ────────────────────────────────────────────────────
const today = await u.readoutPnl();
check('opened and valued at once it shows a small loss: the spread', today < 0 && today > -ask * 0.1, `$${today}`);
const maxDays = Number(await u.slider('Time passing').getAttribute('max'));
await u.slider('Time passing').fill(String(Math.floor(maxDays / 2)));
const halfway = await u.readoutPnl();
check('time passing alone loses money: time decay', halfway < today, `today ${today}, in ${Math.floor(maxDays / 2)} days ${halfway}`);
check('theta shrinks or grows but stays negative', /^-\$/.test(await u.fact('Theta')));
await u.slider('Time passing').fill(String(maxDays));
check('the last stop is the expiry', /at expiry/.test(await u.readout()), await u.readout());
const atExpiry = await u.readoutPnl();
check('at expiry at the same price the call has lost its time value', atExpiry <= halfway && atExpiry >= -ask - 0.02, `$${atExpiry}`);
await u.slider('Time passing').fill('0');
await u.slider('Implied volatility').fill('50');
check('higher implied volatility makes the call worth more: vega', (await u.readoutPnl()) > today + 1, `$${await u.readoutPnl()}`);
await u.slider('Implied volatility').fill('0');
await u.slider(/ETH price/).press('End');
check('a higher price makes the call worth more', (await u.readoutPnl()) > today + 10, await u.readout());
await page.screenshot({ path: `${OUT}/options.whatif.png` });
await u.builder.getByRole('button', { name: 'Reset' }).click();
check('reset returns to today at the current price', Math.abs((await u.readoutPnl()) - today) < 0.02);

// ── Templates ──────────────────────────────────────────────────────────
await u.template('iron-condor');
check('a template fills in its legs', (await u.legs.count()) === 4);
check('an iron condor is a credit with a limited loss and two break-evens', /^Credit/.test(await u.fact('Net premium')) && /^\$/.test(await u.fact('Max loss')) && / and /.test(await u.fact('Break-evens')), `${await u.fact('Net premium')} · max loss ${await u.fact('Max loss')}`);
check('no more than four legs can be added', await u.builder.getByRole('button', { name: 'Add option leg' }).isDisabled());
await page.screenshot({ path: `${OUT}/options.condor.png` });
await u.template('covered-call');
check('a covered call includes the underlying itself', (await u.builder.getByRole('group', { name: 'Underlying leg' }).isVisible()) && (await u.legs.count()) === 1);
await u.template('calendar-spread');
check('a calendar spread uses two expiries and says its figures are approximate', await u.builder.getByText(/Legs expire on different dates/).isVisible());

await u.template('short-call');
check('an uncovered short call shows unlimited loss with a warning', (await u.fact('Max loss')) === 'Unlimited' && (await u.builder.getByText(/no limit on its loss/).isVisible()));
await u.openButton.click();
const confirm = page.getByRole('dialog', { name: 'Open this strategy anyway?' });
check('opening it asks for confirmation in the warning style', await confirm.isVisible());
await page.screenshot({ path: `${OUT}/options.confirm.png` });
await confirm.getByRole('button', { name: 'Cancel' }).click();
check('cancelling opens nothing', (await page.getByRole('tab', { name: /Open positions/ }).innerText()).trim() === 'Open positions');

// ── Paper trading ──────────────────────────────────────────────────────
await u.template('bull-call-spread');
const debit = money(await u.fact('Net premium'));
const maxLoss = money(await u.fact('Max loss'));
check('a bull call spread can lose only what it cost', Math.abs(debit - maxLoss) < 0.02, `debit ${debit}, max loss ${maxLoss}`);
const before = await u.equity();
await u.openButton.click();
await page.waitForTimeout(400);
if (await confirm.isVisible()) await confirm.getByRole('button', { name: 'Open paper position' }).click();
await page.waitForTimeout(400);
check('opening the spread is confirmed', /Paper position opened/.test(await u.toasts()));
check('the open positions tab shows a count', /Open positions\s*1/.test(await page.getByRole('tab', { name: /Open positions/ }).innerText()));
await page.getByRole('tab', { name: /Open positions/ }).click();
check('the position is listed with its name and legs', (await u.positions.count()) === 1 && /Bull call spread/.test(await u.positions.first().innerText()) && /\+1 C \d+ · -1 C \d+/.test(await u.positions.first().innerText()));
const cost = before - (await u.equity());
check('equity falls by only the spread and the fee', cost > 0 && cost < debit * 0.25, `$${cost.toFixed(2)} on a $${debit} spread`);
await page.screenshot({ path: `${OUT}/options.position.png` });

await push('ETHUSDT', S * 1.08);
await page.waitForTimeout(400);
const up = money((await u.positions.first().locator('td').nth(4).innerText()).replace('+', ''));
check('the position gains when the underlying rises', up > 0, `+$${up}`);
check('the top bar equity follows it', (await u.equity()) > before - cost);
await u.positions.first().getByRole('button', { name: /^Close/ }).click();
await page.waitForTimeout(400);
check('closing records the trade and empties the list', (await u.positions.count()) === 0 && /Strategy closed/.test(await u.toasts()));
check('the profit lands in the account', (await u.equity()) > before);

// ── Bundled symbol ─────────────────────────────────────────────────────
await page.goto(`${BASE}/options/AAPL`, { waitUntil: 'domcontentloaded' });
await u.ready();
check('a bundled symbol has a chain from its last close', (await u.atm.count()) === 1 && (await page.getByText('Bundled daily history: last close, no live price.').isVisible()));
await u.template('long-put');
check('stock options cover 100 shares per contract', await u.builder.getByText('One contract covers 100 AAPL.').isVisible());
check('it can be analysed but not paper traded', (await u.openButton.isDisabled()) && (await u.builder.getByText(/paper trading is off/).isVisible()));
await context.close();

// ── Expiry ─────────────────────────────────────────────────────────────
const timed = await open({ width: 1440, height: 900 }, {}, true);
const t = ui(timed.page);
await timed.page.goto(`${BASE}/options/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await t.ready();
const E = Math.round(await t.spot());
await timed.push('ETHUSDT', E);
await timed.page.getByRole('tablist', { name: 'Expiry date' }).getByRole('tab').first().click();
await t.atm.getByRole('button', { name: /^Buy the .* call/ }).click();
const paid = money(await t.fact('Net premium'));
await t.openButton.click();
await timed.page.waitForTimeout(300);
const dialog = timed.page.getByRole('dialog', { name: 'Open this strategy anyway?' });
if (await dialog.isVisible()) await dialog.getByRole('button', { name: 'Open paper position' }).click();
await timed.page.waitForTimeout(300);
check('expiry: a call on the nearest expiry is open', /Open positions\s*1/.test(await timed.page.getByRole('tab', { name: /Open positions/ }).innerText()));
const start = await t.equity();
// Past the nearest Friday, with the price well below the strike: it expires worthless.
await timed.push('ETHUSDT', E * 0.9);
await timed.page.clock.fastForward(9 * 86_400_000);
await timed.page.waitForTimeout(1500);
check('at expiry the position is settled automatically', /Options expired/.test(await t.toasts()), (await t.toasts()).replace(/\s+/g, ' ').slice(-80));
check('an out-of-the-money call expires worthless: the premium is lost', Math.abs(10000 - (await t.equity()) - paid) < paid * 0.05 + 0.5, `paid $${paid}, account down $${(10000 - (await t.equity())).toFixed(2)} (was $${start})`);
check('the position is gone', (await timed.page.getByRole('tab', { name: /Open positions/ }).innerText()).trim() === 'Open positions');
await timed.context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
const p = ui(phone.page);
await phone.page.goto(`${BASE}/options/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await p.ready();
check('phone: chain, builder, chart and positions are tabs', (await phone.page.getByRole('tablist', { name: 'Options sections' }).getByRole('tab').count()) === 4);
check('phone: the chain keeps bid and ask and drops the rest', (await p.atm.locator('td').count()) === 4);
check('phone: no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.screenshot({ path: `${OUT}/options.phone.chain.png` });
await p.atm.getByRole('button', { name: /^Buy the .* put/ }).tap();
await phone.page.getByRole('tab', { name: /^Builder/ }).tap();
await phone.page.getByRole('img', { name: /Payoff diagram/ }).waitFor({ timeout: 5000 });
check('phone: a tapped price shows up in the builder', (await phone.page.getByRole('group', { name: /^Leg 1/ }).count()) === 1);
check('phone: the builder has no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.waitForTimeout(300);
await phone.page.screenshot({ path: `${OUT}/options.phone.builder.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

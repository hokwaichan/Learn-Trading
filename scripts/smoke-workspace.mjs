// Interaction smoke test for the chart workspace. Needs the dev server
// running and an internet connection (it uses real Binance data).
//   npm run smoke
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
const track = (page) => {
  // Requests to Binance can fail by region; the app handles that, so only
  // errors from our own code count here.
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const where = m.location().url ?? '';
    if (/binance/.test(where) || /binance/.test(m.text()) || /net::ERR_FAILED/.test(m.text())) return;
    errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
};

const legendText = (page) => page.locator('.pointer-events-none.absolute.top-1\\.5').first().innerText();
const chartBox = async (page) => (await page.getByRole('group', { name: /chart,/ }).boundingBox());
const drawingCount = (page) => page.locator('svg g[role="button"]').count();

// ── Desktop ────────────────────────────────────────────────────────────
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
track(page);
const sockets = [];
page.on('websocket', (ws) => {
  const entry = { url: ws.url(), frames: 0 };
  sockets.push(entry);
  ws.on('framereceived', () => entry.frames++);
});
const klineRequests = [];
page.on('request', (r) => r.url().includes('/klines') && klineRequests.push(r.url()));

await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await page.waitForTimeout(800);
let legend = await legendText(page);
check('chart loads real BTC candles with an OHLC legend', /BTC\/USDT/.test(legend) && /O\s*[\d,]+\.\d\d/.test(legend), legend.replace(/\s+/g, ' ').slice(0, 70));

// Timeframe and chart type
await page.getByRole('button', { name: '1 day', exact: true }).click();
await page.waitForTimeout(1200);
legend = await legendText(page);
check('switching to the daily timeframe reloads the chart', /\b1d\b/.test(legend));
await page.getByRole('combobox', { name: 'Chart type' }).selectOption('heikin-ashi');
await page.waitForTimeout(300);
check('Heikin-Ashi chart type is shown in the legend', /Heikin-Ashi/.test(await legendText(page)));
await page.getByRole('combobox', { name: 'Chart type' }).selectOption('line');
await page.waitForTimeout(300);
legend = await legendText(page);
check('line chart shows only the close', /C\s*[\d,]+/.test(legend) && !/H\s*[\d,]+\.\d\d\s*L/.test(legend));
await page.screenshot({ path: `${OUT}/ws.line.png` });
await page.getByRole('combobox', { name: 'Chart type' }).selectOption('candles');
await page.reload({ waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor();
await page.waitForTimeout(800);
check('timeframe choice survives a reload', /\b1d\b/.test(await legendText(page)));

// Explain by click and by keyboard
let box = await chartBox(page);
await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.4);
const explainTitle = page.getByRole('heading', { name: /^Candle of \d{4}-\d\d-\d\d$/ });
await explainTitle.waitFor({ timeout: 3000 }).catch(() => {});
check('clicking a candle explains it in the Explain tab', await explainTitle.isVisible());
check('explanation has a plain-language section', await page.getByText('What this candle shows').isVisible());
const firstTitle = await explainTitle.innerText();
await page.getByRole('group', { name: /chart,/ }).focus();
await page.keyboard.press('ArrowLeft');
await page.waitForTimeout(150);
const secondTitle = await explainTitle.innerText();
check('arrow keys move the selected candle', firstTitle !== secondTitle, `${firstTitle} -> ${secondTitle}`);
await page.screenshot({ path: `${OUT}/ws.explain.png` });

// Drawings
box = await chartBox(page);
const at = (fx, fy) => [box.x + box.width * fx, box.y + box.height * fy];
await page.getByRole('button', { name: /^Horizontal line:/ }).click();
await page.mouse.click(...at(0.4, 0.3));
check('horizontal line is drawn with one click', (await drawingCount(page)) === 1);
await page.getByRole('button', { name: /^Trend line:/ }).click();
await page.mouse.click(...at(0.2, 0.5));
await page.mouse.move(...at(0.35, 0.4));
check('first click of a trend line does not finish it', (await drawingCount(page)) === 1);
await page.mouse.click(...at(0.5, 0.25));
check('second click finishes the trend line', (await drawingCount(page)) === 2);
await page.getByRole('button', { name: /^Fibonacci retracement:/ }).click();
await page.mouse.click(...at(0.55, 0.5));
await page.mouse.click(...at(0.75, 0.2));
check('Fibonacci retracement shows its levels', (await page.locator('svg text', { hasText: '0.618' }).count()) === 1);
await page.getByRole('button', { name: /^Rectangle:/ }).click();
await page.mouse.click(...at(0.1, 0.15));
await page.mouse.click(...at(0.2, 0.3));
await page.getByRole('button', { name: /^Note:/ }).click();
await page.mouse.click(...at(0.3, 0.55));
const noteDialog = page.getByRole('dialog', { name: 'Add a note' });
check('placing a note asks for its text', await noteDialog.isVisible());
await page.keyboard.type('Support held here');
await page.keyboard.press('Enter');
check('note appears on the chart', (await page.locator('svg text', { hasText: 'Support held here' }).count()) === 1);
check('five drawings exist', (await drawingCount(page)) === 5);
await page.screenshot({ path: `${OUT}/ws.drawings.png` });

await page.getByRole('button', { name: /^Trend line:/ }).click();
await page.mouse.click(...at(0.6, 0.6));
await page.keyboard.press('Escape');
check('Escape cancels a half-drawn line', (await drawingCount(page)) === 5);

await page.reload({ waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor();
await page.waitForTimeout(800);
check('drawings survive a reload', (await drawingCount(page)) === 5);
await page.getByRole('button', { name: '4 hours', exact: true }).click();
await page.waitForTimeout(1500);
check('drawings carry over to another timeframe', (await drawingCount(page)) === 5);

await page.locator('svg g[role="button"]').first().focus();
await page.keyboard.press('Delete');
check('Delete removes the focused drawing', (await drawingCount(page)) === 4);
await page.getByRole('button', { name: 'Clear all drawings on this symbol' }).click();
const clearDialog = page.getByRole('dialog', { name: 'Clear all drawings?' });
check('clearing all drawings asks first', await clearDialog.isVisible());
await clearDialog.getByRole('button', { name: 'Clear drawings' }).click();
check('all drawings cleared', (await drawingCount(page)) === 0);

// Scrolling back loads older candles
const before = klineRequests.filter((u) => u.includes('endTime')).length;
box = await chartBox(page);
for (let i = 0; i < 16; i++) {
  await page.mouse.move(...[box.x + box.width * 0.2, box.y + box.height * 0.5]);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.5, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1500);
check('scrolling back in time loads older candles', klineRequests.filter((u) => u.includes('endTime')).length > before);

// Watchlist and panels
await page.getByRole('tab', { name: 'Watchlist' }).click();
await page.waitForTimeout(1500);
const ethRow = page.getByRole('link', { name: /ETH\/USDT/ });
check('watchlist shows a live price for ETH', /\d,\d{3}\.\d\d/.test(await ethRow.innerText()), (await ethRow.innerText()).replace(/\s+/g, ' '));
check('watchlist shows bundled AAPL with its change', /[+-]\d+\.\d\d%/.test(await page.getByRole('link', { name: /AAPL/ }).innerText()));
await page.screenshot({ path: `${OUT}/ws.watchlist.png` });
await page.getByRole('button', { name: 'Collapse side panel' }).click();
check('side panel collapses to an icon strip', await page.getByRole('button', { name: 'Expand side panel' }).isVisible());
await page.getByRole('button', { name: 'Collapse account panel' }).click();
check('account panel collapses', await page.getByRole('button', { name: 'Expand account panel' }).isVisible());
await page.screenshot({ path: `${OUT}/ws.collapsed.png` });
await page.getByRole('button', { name: 'Expand side panel' }).click();
await page.getByRole('button', { name: 'Expand account panel' }).click();

// Live stream
await page.waitForTimeout(4000);
const stream = sockets.filter((s) => s.url.includes('@kline_'));
check('live candle stream is connected and receiving', stream.some((s) => s.frames > 0), `${stream.length} socket(s), ${stream.reduce((a, s) => a + s.frames, 0)} frames`);

// Other instruments
await page.goto(`${BASE}/futures/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
const fallbackNotice = await page.getByText(/shows the spot price, which stays very close/).isVisible();
console.log(`INFO  futures data source: ${fallbackNotice ? 'blocked here, using spot fallback with a notice' : 'Binance futures reachable'}`);
check('futures workspace shows a chart either way', (await page.locator('canvas').count()) > 0);

await page.goto(`${BASE}/charts/AAPL`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
check('bundled symbol explains it has no live price', await page.getByText(/Bundled daily history up to/).isVisible());
check('intraday timeframes are disabled for bundled symbols', (await page.getByRole('button', { name: '1 hour', exact: true }).getAttribute('aria-disabled')) === 'true');
await page.goto(`${BASE}/charts/NOPE`, { waitUntil: 'domcontentloaded' });
await page.getByText('No chart for').waitFor({ timeout: 5000 }).catch(() => {});
check('unknown symbol offers the available ones', await page.getByText('No chart for "NOPE"').isVisible());
await desktop.close();

const API = /binance.(vision|com)/;
// ── Failure modes ──────────────────────────────────────────────────────
const failing = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const f = await failing.newPage();
await f.route(API, (route) => route.fulfill({ status: 429, headers: { 'Retry-After': '30', 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Retry-After' }, body: '{}' }));
await f.goto(`${BASE}/charts/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await f.getByText('Could not load prices').waitFor({ timeout: 10000 }).catch(() => {});
check('rate limit shows a clear error with the wait time', await f.getByText(/slow down.*30 seconds/).isVisible());
await f.screenshot({ path: `${OUT}/ws.rate-limit.png` });
await f.unroute(API);
await f.getByRole('button', { name: 'Try again' }).click();
await f.locator('canvas').first().waitFor({ timeout: 20000 }).catch(() => {});
check('Try again recovers once the server answers', (await f.locator('canvas').count()) > 0);
await f.waitForTimeout(800);

await f.route(API, (route) => route.abort());
await f.reload({ waitUntil: 'domcontentloaded' });
await f.getByText(/Showing saved prices/).waitFor({ timeout: 10000 }).catch(() => {});
check('offline: saved candles are shown with a notice', (await f.getByText(/Showing saved prices/).isVisible()) && (await f.locator('canvas').count()) > 0);
await f.screenshot({ path: `${OUT}/ws.offline.png` });
await failing.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await phone.newPage();
track(m);
await m.goto(`${BASE}/charts/SOLUSDT`, { waitUntil: 'domcontentloaded' });
await m.locator('canvas').first().waitFor({ timeout: 20000 });
await m.waitForTimeout(800);
check('phone: no horizontal page overflow', (await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
const mBox = await chartBox(m);
await m.touchscreen.tap(mBox.x + mBox.width * 0.5, mBox.y + mBox.height * 0.4);
const sheet = m.getByRole('dialog', { name: 'Explain' });
await sheet.waitFor({ timeout: 3000 }).catch(() => {});
check('phone: tapping a candle opens Explain as a bottom sheet', await sheet.isVisible());
await m.waitForTimeout(300);
await m.screenshot({ path: `${OUT}/ws.phone-explain.png` });
await sheet.getByRole('button', { name: 'Close' }).tap();
await m.getByRole('button', { name: 'Positions' }).tap();
check('phone: Positions opens as a bottom sheet', await m.getByRole('dialog', { name: 'Positions' }).isVisible());
await phone.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].join(' | ').slice(0, 300));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

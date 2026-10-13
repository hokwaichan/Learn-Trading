// Interaction smoke test for chart indicators. Needs the dev server running
// and an internet connection.
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
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''))) return;
    errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
};

const NAMES = [
  'Simple Moving Average', 'Exponential Moving Average', 'Bollinger Bands', 'Volume-Weighted Average Price',
  'Volume Moving Average', 'Relative Strength Index', 'MACD', 'Stochastic Oscillator',
];

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
track(page);
await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await page.waitForTimeout(800);

const paneCount = () => page.evaluate(() => document.querySelectorAll('main table tr').length);
const basePanes = await paneCount();
// Heights of the chart's panes, top to bottom (separator rows are 1px and skipped).
const paneHeights = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('main table tr')].map((r) => Math.round(r.getBoundingClientRect().height)).filter((h) => h > 4),
  );
const priceIsTallest = async () => {
  const h = await paneHeights();
  return { ok: h.length >= 2 && h[0] === Math.max(...h.slice(0, -1)) && h[0] > 150, detail: h.join(', ') };
};

// With no indicators, swapping the chart type must not disturb the panes.
const before = await paneHeights();
for (const type of ['line', 'area', 'heikin-ashi', 'candles']) {
  await page.getByRole('combobox', { name: 'Chart type' }).selectOption(type);
  await page.waitForTimeout(250);
}
const after = await paneHeights();
check('chart type changes keep the price and volume panes as they were', before.join() === after.join(), `${before.join(', ')} -> ${after.join(', ')}`);
const legendButton = (label) => page.getByRole('button', { name: `Explain ${label}`, exact: true });

// Add eight indicators through the dialog
await page.getByRole('button', { name: 'Indicators' }).click();
const dialog = page.getByRole('dialog', { name: 'Indicators' });
check('Indicators dialog opens with a beginner explanation', await dialog.getByText('No indicators yet').isVisible());
check('dialog lists all nine indicators', (await dialog.getByRole('button', { name: /^Add / }).count()) === 9);
for (const name of NAMES) await dialog.getByRole('button', { name: `Add ${name}`, exact: true }).click();
check('eighth indicator fills the chart and disables Add', await dialog.getByRole('button', { name: 'Add Average True Range' }).isDisabled());
check('dialog explains the limit', await dialog.getByText(/holds up to 8 indicators/).isVisible());
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/ind.dialog.png` });
await dialog.getByRole('button', { name: 'Done' }).click();
await page.waitForTimeout(800);

for (const label of ['SMA 20', 'EMA 20', 'BB 20, 2', 'VWAP', 'Vol MA 20', 'RSI 14', 'MACD 12, 26, 9', 'Stoch 14, 3, 3']) {
  check(`legend shows ${label}`, await legendButton(label).isVisible());
}
const sma = await legendButton('SMA 20').innerText();
check('overlay legend shows a price value', /\d{2},\d{3}\.\d\d/.test(sma), sma.replace(/\s+/g, ' '));
const rsi = await legendButton('RSI 14').innerText();
check('RSI legend shows a 0-100 value', /RSI 14\s+\d{1,2}\.\d\d/.test(rsi), rsi.replace(/\s+/g, ' '));
check('oscillators get panes of their own', (await paneCount()) > basePanes, `${basePanes} -> ${await paneCount()} rows`);
await page.screenshot({ path: `${OUT}/ind.all.png` });

// Legends sit inside their own panes, top to bottom
const ys = [];
for (const label of ['SMA 20', 'Vol MA 20', 'RSI 14', 'MACD 12, 26, 9', 'Stoch 14, 3, 3']) ys.push((await legendButton(label).boundingBox()).y);
check('pane legends are stacked in pane order', ys.every((y, i) => i === 0 || y > ys[i - 1] + 20), ys.map((y) => Math.round(y)).join(', '));

// Explain from the legend
await legendButton('RSI 14').click();
check('clicking an indicator legend explains it', await page.getByRole('heading', { name: 'Relative Strength Index (RSI 14)' }).isVisible());
check('explanation covers calculation and weaknesses', (await page.getByText('How it is calculated').isVisible()) && (await page.getByText('Weaknesses').isVisible()));
check('explanation gives the current reading', await page.getByText(/^RSI is \d+\.\d\./).isVisible());
await page.screenshot({ path: `${OUT}/ind.explain.png` });
const box = await page.getByRole('group', { name: /chart,/ }).boundingBox();
await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.2);
await page.waitForTimeout(200);
const heading = await page.locator('[role="tabpanel"] h3').first().innerText();
check('clicking the chart goes back to explaining a candle or the clicked line', /^Candle of|\(/.test(heading), heading);

// Live theme switch keeps every pane
const rowsBefore = await paneCount();
await page.getByRole('button', { name: 'Switch to light theme' }).click();
await page.waitForTimeout(700);
check('theme switch keeps all panes', (await paneCount()) === rowsBefore, `${rowsBefore} -> ${await paneCount()}`);
check('legends survive a theme switch', await legendButton('MACD 12, 26, 9').isVisible());
let layout = await priceIsTallest();
check('theme switch leaves the price pane on top and tallest', layout.ok, layout.detail);
const smaY = (await legendButton('SMA 20').boundingBox()).y;
const volY = (await legendButton('Vol MA 20').boundingBox()).y;
check('theme switch keeps legends in their own panes', volY - smaY > 100, `SMA at ${Math.round(smaY)}, Vol MA at ${Math.round(volY)}`);
await page.screenshot({ path: `${OUT}/ind.light.png` });
await page.getByRole('button', { name: 'Switch to dark theme' }).click();
await page.waitForTimeout(500);

// Chart type and timeframe changes keep indicators
await page.getByRole('combobox', { name: 'Chart type' }).selectOption('line');
await page.waitForTimeout(400);
check('indicators survive a chart type change', (await legendButton('SMA 20').isVisible()) && (await paneCount()) === rowsBefore);
layout = await priceIsTallest();
check('chart type change leaves the price pane on top and tallest', layout.ok, layout.detail);
await page.getByRole('combobox', { name: 'Chart type' }).selectOption('candles');
await page.getByRole('button', { name: '4 hours', exact: true }).click();
await legendButton('RSI 14').waitFor({ timeout: 8000 }).catch(() => {});
await page.waitForTimeout(600);
check('indicators survive a timeframe change', (await legendButton('RSI 14').isVisible()) && (await paneCount()) === rowsBefore);

// Configure, hide, remove
await page.getByRole('button', { name: 'Indicators' }).click();
const period = dialog.getByRole('textbox', { name: 'Period' }).first();
await period.fill('50');
await period.press('Enter');
await dialog.getByRole('button', { name: 'Hide EMA' }).click();
await dialog.getByRole('button', { name: 'Remove Stoch' }).click();
await dialog.getByRole('button', { name: 'Done' }).click();
await page.waitForTimeout(600);
check('changing a period updates the legend', await legendButton('SMA 50').isVisible());
check('a hidden indicator leaves the chart', (await legendButton('EMA 20').count()) === 0);
check('removing an oscillator removes its pane', (await paneCount()) < rowsBefore, `${rowsBefore} -> ${await paneCount()}`);

await page.reload({ waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor();
await legendButton('SMA 50').waitFor({ timeout: 8000 }).catch(() => {});
check('indicators and their settings survive a reload', (await legendButton('SMA 50').isVisible()) && (await legendButton('MACD 12, 26, 9').isVisible()));
check('toolbar shows the indicator count', /Indicators\s*7/.test(await page.getByRole('button', { name: /^Indicators/ }).innerText()));

// ATR, and a symbol without volume
await page.getByRole('button', { name: /^Indicators/ }).click();
await dialog.getByRole('button', { name: 'Add Average True Range' }).click();
await dialog.getByRole('button', { name: 'Done' }).click();
await page.waitForTimeout(500);
check('ATR is drawn', await legendButton('ATR 14').isVisible());

await page.goto(`${BASE}/charts/EURUSD`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await legendButton('VWAP').waitFor({ timeout: 8000 }).catch(() => {});
await legendButton('VWAP').click();
check('VWAP on a symbol with no volume explains the missing value', await page.getByText(/There is no value here yet/).isVisible());
await context.close();

// Phone
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await phone.newPage();
track(m);
await m.goto(`${BASE}/charts/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await m.locator('canvas').first().waitFor({ timeout: 20000 });
await m.getByRole('button', { name: 'Indicators' }).tap();
const mDialog = m.getByRole('dialog', { name: 'Indicators' });
await mDialog.getByRole('button', { name: 'Add Bollinger Bands' }).tap();
await mDialog.getByRole('button', { name: 'Add Relative Strength Index' }).tap();
await mDialog.getByRole('button', { name: 'Done' }).tap();
await m.waitForTimeout(800);
check('phone: indicators render without page overflow', (await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await m.getByRole('button', { name: 'Explain RSI 14' }).tap();
check('phone: tapping a legend opens Explain as a sheet', await m.getByRole('dialog', { name: 'Explain' }).isVisible());
await m.waitForTimeout(300);
await m.screenshot({ path: `${OUT}/ind.phone.png` });
await phone.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].join(' | ').slice(0, 400));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

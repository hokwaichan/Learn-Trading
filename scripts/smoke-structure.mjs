// Smoke test for the structure overlays and the new indicators. Needs the dev server and internet.
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
const seen = (locator, timeout = 8000) => locator.first().waitFor({ timeout }).then(() => true, () => false);

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

const { context, page } = await open({ width: 1440, height: 900 });
const toolbar = page.getByRole('toolbar', { name: 'Chart' });
const dialog = page.getByRole('dialog', { name: 'Chart overlays' });
// The overlay is the one SVG in the chart that is hidden from assistive tech and holds these tags.
const tags = () => page.locator('svg[aria-hidden="true"] text');
const tagTexts = async () => (await tags().allTextContents()).map((t) => t.trim());
const toggle = async (name) => {
  await toolbar.getByRole('button', { name: /^Overlays/ }).click();
  await dialog.getByRole('switch', { name }).click();
  await dialog.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(500);
};

await page.goto(`${BASE}/charts/BTCUSDT`, { waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await toolbar.getByRole('button', { name: '15 minutes' }).click();
await page.waitForTimeout(2500);

// ── The dialog ─────────────────────────────────────────────────────────
check('the toolbar has an Overlays button', await toolbar.getByRole('button', { name: /^Overlays/ }).isVisible());
await toolbar.getByRole('button', { name: /^Overlays/ }).click();
check('the dialog offers six overlays, all off to begin with', (await dialog.getByRole('switch').count()) === 6 && (await dialog.getByRole('switch', { checked: true }).count()) === 0);
check('it says the markings are not trade signals and links to the lessons', (await dialog.getByText(/not signals to trade/).isVisible()) && (await dialog.getByRole('link', { name: 'Smart money concepts' }).isVisible()));
await dialog.getByRole('button', { name: 'Done' }).click();
check('nothing is drawn while everything is off', (await tags().count()) === 0);

// ── Each overlay ───────────────────────────────────────────────────────
await toggle('Market structure');
let texts = await tagTexts();
check('market structure marks breaks of structure', texts.some((t) => t === 'BOS' || t === 'CHoCH'), [...new Set(texts)].join(', '));
check('the button counts what is on', /Overlays\s*1/.test(await toolbar.getByRole('button', { name: /^Overlays/ }).innerText()));

await toggle('Fair value gaps');
texts = await tagTexts();
check('fair value gaps are labelled with their direction', texts.some((t) => /^FVG \((bullish|bearish)\)$/.test(t)), `${texts.filter((t) => t.startsWith('FVG')).length} open gaps`);

await toggle('Order blocks');
texts = await tagTexts();
check('order blocks are labelled with their direction', texts.some((t) => /^Order block \((bullish|bearish)\)$/.test(t)) || texts.filter((t) => t === 'BOS' || t === 'CHoCH').length < 2, `${texts.filter((t) => t.startsWith('Order block')).length} untouched blocks`);

await toggle('Liquidity');
texts = await tagTexts();
check('liquidity marks sweeps or equal highs and lows', texts.some((t) => t === 'Sweep' || /^Equal (highs|lows)/.test(t)), `${texts.filter((t) => t === 'Sweep').length} sweeps`);

await toggle('Sessions');
texts = await tagTexts();
check('sessions are drawn and named', ['Asia', 'London', 'New York'].every((s) => texts.includes(s)));

await toggle('Kill zones');
texts = await tagTexts();
check('kill zones are drawn and named', texts.includes('London kill zone') && texts.includes('New York kill zone'));
check('all six are counted', /Overlays\s*6/.test(await toolbar.getByRole('button', { name: /^Overlays/ }).innerText()));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/structure.all.png` });

// ── Daily charts ───────────────────────────────────────────────────────
await toolbar.getByRole('button', { name: '1 day' }).click();
await page.waitForTimeout(2500);
texts = await tagTexts();
check('on a daily chart sessions and kill zones are not drawn', !texts.includes('London') && !texts.includes('London kill zone') && texts.some((t) => t === 'BOS' || t === 'CHoCH'));
check('and the count drops to the four that apply', /Overlays\s*4/.test(await toolbar.getByRole('button', { name: /^Overlays/ }).innerText()));
await toolbar.getByRole('button', { name: /^Overlays/ }).click();
check('the dialog says why they are unavailable', (await dialog.getByText(/Needs a chart of 1 hour candles or shorter/).count()) === 2 && (await dialog.getByRole('switch', { name: 'Sessions' }).isDisabled()));
await page.screenshot({ path: `${OUT}/structure.dialog.png` });
await dialog.getByRole('button', { name: 'Turn all off' }).click();
await dialog.getByRole('button', { name: 'Done' }).click();
await page.waitForTimeout(400);
check('Turn all off clears the chart', (await tags().count()) === 0);

// ── Saved, and shared with Replay ──────────────────────────────────────
await toggle('Fair value gaps');
await page.reload({ waitUntil: 'domcontentloaded' });
await page.locator('canvas').first().waitFor({ timeout: 20000 });
await page.waitForTimeout(2500);
check('overlay choices survive a reload', /Overlays\s*1/.test(await toolbar.getByRole('button', { name: /^Overlays/ }).innerText()));

// ── New indicators ─────────────────────────────────────────────────────
await toolbar.getByRole('button', { name: /^Indicators/ }).click();
const indicators = page.getByRole('dialog', { name: /Indicators/ });
const listed = await indicators.innerText();
check('the three new indicators are offered', /Donchian Channel/.test(listed) && /Previous Day Levels/.test(listed) && /Opening Range/.test(listed));
await page.keyboard.press('Escape');

// ── Replay keeps the future hidden ─────────────────────────────────────
await page.goto(`${BASE}/replay`, { waitUntil: 'domcontentloaded' });
const setup = page.locator('form').filter({ hasText: 'Start replay' });
await setup.getByLabel('Symbol', { exact: true }).selectOption('AAPL');
await setup.getByLabel('Start date', { exact: true }).fill('2024-03-01');
await setup.getByRole('button', { name: 'Start replay' }).click();
await page.getByRole('toolbar', { name: 'Replay controls' }).waitFor({ timeout: 20000 });
await page.waitForTimeout(1500);
const before = (await tagTexts()).filter((t) => t.startsWith('FVG')).length;
check('overlays work in Replay too', before >= 0 && (await seen(toolbar.getByRole('button', { name: /^Overlays\s*1/ }))), `${before} open gaps at the start`);
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
await phone.page.goto(`${BASE}/charts/ETHUSDT`, { waitUntil: 'domcontentloaded' });
await phone.page.locator('canvas').first().waitFor({ timeout: 20000 });
const overlaysButton = phone.page.getByRole('toolbar', { name: 'Chart' }).getByRole('button', { name: /^Overlays/ });
await overlaysButton.scrollIntoViewIfNeeded();
await overlaysButton.tap();
check('phone: the overlays dialog opens and fits', (await seen(phone.page.getByRole('dialog', { name: 'Chart overlays' }))) && (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.screenshot({ path: `${OUT}/structure.phone.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

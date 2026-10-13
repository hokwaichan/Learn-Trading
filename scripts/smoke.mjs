// Interaction smoke test for the app shell. Needs the dev server running.
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
// Requests to Binance can fail by region; the app handles that itself.
const EXPECTED = /binance|net::ERR_FAILED/;

// ── Desktop ────────────────────────────────────────────────────────────
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
page.on('console', (m) => m.type() === 'error' && !EXPECTED.test(m.text() + (m.location().url ?? '')) && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });

// Command palette
await page.keyboard.press('Control+k');
const palette = page.getByRole('dialog', { name: 'Command palette' });
check('Ctrl+K opens the command palette', await palette.isVisible());
await page.keyboard.type('lever');
check('palette finds a glossary term', await palette.getByRole('option', { name: /^Leverage Controlling/ }).isVisible());
check('palette finds a lesson', await palette.getByRole('option', { name: /^Leverage and why it is dangerous/ }).isVisible());
await page.screenshot({ path: `${OUT}/smoke.palette.png` });
await page.keyboard.press('Control+a');
await page.keyboard.type('eth');
await page.keyboard.press('Enter');
await page.waitForURL('**/charts/ETHUSDT');
check('palette navigates to a symbol', page.url().endsWith('/charts/ETHUSDT'));
check('palette closes after choosing', !(await palette.isVisible()));
await page.keyboard.press('Control+k');
await palette.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
await page.keyboard.press('Escape');
await palette.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
check('Escape closes the palette', !(await palette.isVisible()));

// Top-bar symbol search
await page.goto(`${BASE}/futures/BTCUSDT`, { waitUntil: 'networkidle' });
const search = page.getByRole('combobox', { name: 'Search symbols' });
await search.fill('sol');
await search.press('Enter');
await page.waitForURL('**/futures/SOLUSDT');
check('symbol search on Futures stays in futures mode', page.url().endsWith('/futures/SOLUSDT'));

// Redirects and 404
await page.goto(`${BASE}/charts`, { waitUntil: 'networkidle' });
check('/charts redirects to the default symbol', page.url().endsWith('/charts/BTCUSDT'));
await page.goto(`${BASE}/nope`, { waitUntil: 'networkidle' });
check('unknown route shows Page not found', await page.getByText('Page not found').isVisible());

// Sidebar collapse persists
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Collapse sidebar' }).click();
await page.reload({ waitUntil: 'networkidle' });
check('collapsed sidebar survives a reload', await page.getByRole('button', { name: 'Expand sidebar' }).isVisible());
await page.screenshot({ path: `${OUT}/smoke.sidebar-collapsed.png` });
await page.getByRole('button', { name: 'Expand sidebar' }).click();

// Theme toggle persists, with no flash attribute mismatch
await page.getByRole('button', { name: 'Switch to light theme' }).click();
check('theme toggle switches to light', (await page.evaluate(() => document.documentElement.dataset.theme)) === 'light');
await page.reload({ waitUntil: 'networkidle' });
check('theme survives a reload', (await page.evaluate(() => document.documentElement.dataset.theme)) === 'light');
await page.getByRole('button', { name: 'Switch to dark theme' }).click();

// Settings: colour-blind mode and reset confirmation
await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
await page.getByRole('switch', { name: 'Colour-blind mode' }).click();
const up = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--c-up').trim());
check('colour-blind mode swaps the up colour to blue', up.toLowerCase() === '#2f81f7', up);
await page.screenshot({ path: `${OUT}/smoke.colour-blind.png` });
await page.getByRole('switch', { name: 'Colour-blind mode' }).click();

await page.getByRole('button', { name: 'Reset account' }).click();
const confirm = page.getByRole('dialog', { name: 'Reset paper account?' });
check('reset asks for confirmation', await confirm.isVisible());
check('Cancel is focused by default', await confirm.getByRole('button', { name: 'Cancel' }).evaluate((el) => el === document.activeElement));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/smoke.confirm.png` });
await confirm.getByRole('button', { name: 'Reset account' }).click();
check('reset is recorded', await page.getByText('Reset 1 time.').isVisible());
check('a toast confirms the reset', await page.getByText('Paper account reset').isVisible());

// Keyboard: skip link is the first tab stop
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
check('first Tab lands on "Skip to content"', (await page.evaluate(() => document.activeElement?.textContent)) === 'Skip to content');

// Resizable panel by keyboard
await page.goto(`${BASE}/dev/components`, { waitUntil: 'networkidle' });
const handle = page.getByRole('separator', { name: 'Resize Demo panel' });
const before = Number(await handle.getAttribute('aria-valuenow'));
await handle.focus();
await page.keyboard.press('ArrowLeft');
await page.keyboard.press('ArrowLeft');
check('arrow keys resize a panel', Number(await handle.getAttribute('aria-valuenow')) === before + 32);

// Table sorting
await page.getByRole('button', { name: 'Entry' }).click();
const firstCell = await page.getByRole('table', { name: 'Demo positions' }).locator('tbody tr').first().locator('td').first().textContent();
check('clicking a column header sorts the table', firstCell === 'BTC/USDT', firstCell ?? '');
await desktop.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await phone.newPage();
m.on('console', (msg) => msg.type() === 'error' && !EXPECTED.test(msg.text() + (msg.location().url ?? '')) && errors.push(msg.text()));
m.on('pageerror', (e) => errors.push(e.message));
await m.goto(BASE, { waitUntil: 'networkidle' });
check('sidebar is hidden on phones', !(await m.getByRole('button', { name: /sidebar/ }).isVisible()));
await m.getByRole('button', { name: 'More' }).tap();
const sheet = m.getByRole('dialog', { name: 'All sections' });
check('More opens a sheet with every section', await sheet.getByRole('link', { name: 'Backtester' }).isVisible());
await m.waitForTimeout(300);
await m.screenshot({ path: `${OUT}/smoke.more-sheet.png` });
await sheet.getByRole('link', { name: 'Backtester' }).tap();
await m.waitForURL('**/backtest');
check('More sheet navigates and closes', !(await sheet.isVisible()));
await m.getByRole('button', { name: 'Search' }).tap();
check('phone search button opens the palette', await m.getByRole('dialog', { name: 'Command palette' }).isVisible());
await m.screenshot({ path: `${OUT}/smoke.palette-phone.png` });
await phone.close();

await browser.close();
check('no console errors', errors.length === 0, [...new Set(errors)].join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

// Smoke test for the Backtester. Needs the dev server; the futures checks need internet.
//   npm run smoke
//
// Most of it runs on the bundled AAPL daily history, so results are the same
// on every run.
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

function ui(page) {
  const form = page.locator('form').filter({ hasText: 'Run backtest' });
  const input = (name) => form.getByLabel(name, { exact: true });
  const heading = page.locator('section[aria-label="Results"], [role=tabpanel]').getByRole('heading', { level: 2 });
  const tile = (label) => page.locator('div.rounded-card').filter({ has: page.getByText(label, { exact: true }) }).first();
  return {
    form,
    input,
    heading,
    tile,
    tileValue: async (label) => (await tile(label).locator('.num').first().innerText()).trim(),
    runButton: form.getByRole('button', { name: /Run backtest|Loading history/ }),
    trades: page.getByRole('table', { name: 'Backtest trades' }).locator('tbody tr'),
    history: page.getByRole('table', { name: 'Recent backtest runs' }).locator('tbody tr'),
    tradeCount: async () => Number((await page.getByRole('heading', { name: /^Trades \(\d+\)$/ }).innerText()).match(/\d+/)[0]),
    /** Runs and waits for a new result or an error. */
    run: async () => {
      await form.getByRole('button', { name: 'Run backtest' }).click();
      await page.waitForFunction(() => !document.querySelector('form button[type=submit]')?.textContent?.includes('Loading'), null, { timeout: 60000 });
      await page.waitForTimeout(300);
    },
    period: async (from, to) => {
      await input('From').fill(from);
      await input('To').fill(to);
    },
  };
}

const { context, page } = await open({ width: 1440, height: 900 });
const u = ui(page);

// ── First view ─────────────────────────────────────────────────────────
await page.goto(`${BASE}/backtest`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Backtester', level: 1 }).waitFor({ timeout: 10000 });
check('the builder and an empty results panel are shown', (await u.runButton.isVisible()) && (await page.getByText('No results yet').isVisible()));
const presets = await u.input('Start from').locator('option').allInnerTexts();
check('five presets are offered', presets.filter((p) => p.startsWith('Preset')).length === 5, presets.join(' | '));
check('the first preset is loaded with its rule in words', await u.form.getByText('EMA 20 crosses above EMA 50').isVisible());
check('fees and slippage from Settings are stated', await u.form.getByText(/Every fill pays a 0\.1% fee and 0\.05% slippage/).isVisible());
await page.screenshot({ path: `${OUT}/backtest.empty.png` });

// ── Run a preset on bundled data ───────────────────────────────────────
await u.input('Symbol').selectOption('AAPL');
check('a bundled symbol has daily candles and no futures option', (await u.input('Candle size').locator('option').count()) === 1 && (await u.form.getByText('Leverage is available on the crypto symbols only.').isVisible()));
await u.period('2019-01-01', '2023-12-31');
await u.run();
check('results name the strategy and the symbol', /EMA crossover on AAPL/.test(await u.heading.first().innerText()), await u.heading.first().innerText());
check('a plain sentence compares it with buy and hold', await page.getByText(/The strategy (made|lost) [\d.]+%, .* buying at the start and holding/).isVisible());
check('the overfitting warning is shown', (await page.getByText('Past results do not predict future returns').isVisible()) && (await page.getByRole('note').getByRole('link', { name: 'overfitting' }).isVisible()));
const n1 = await u.tradeCount();
check('trades are listed, and the count matches the table', n1 > 0 && (await u.trades.count()) === n1, `${n1} trades`);
check('a small sample is called out', n1 >= 30 || (await page.getByText(/too few to tell a good rule from a\s+lucky one/).isVisible()));
const ret = await u.tileValue('Total return');
const hold = await u.tileValue('Buy and hold');
check('returns carry a sign', /^[+-]\d/.test(ret) && /^[+-]\d/.test(hold), `strategy ${ret}, hold ${hold}`);
check('AAPL buy and hold over 2019 to 2023 is a large gain', Number(hold.replace(/[^0-9.-]/g, '')) > 300, hold);
const winText = await u.tile('Win rate').innerText();
const [, won, of] = winText.match(/(\d+) of (\d+) trades won/) ?? [];
check('the win rate matches wins over trades', Number(of) === n1 && Math.abs(Number(won) / n1 * 100 - parseFloat(await u.tileValue('Win rate'))) < 0.06, winText.replace(/\s+/g, ' '));
for (const label of ['Profit factor', 'Max drawdown', 'Sharpe ratio', 'Average win / loss', 'Costs']) {
  check(`${label} is reported`, /\d/.test(await u.tile(label).innerText()), (await u.tile(label).locator('.num').first().innerText()).replace(/\s+/g, ' '));
}
check('max drawdown is shown as a negative percentage', /^-\d+\.\d\d%$/.test(await u.tileValue('Max drawdown')));
check('the account curve is drawn against buy and hold', await page.getByRole('img', { name: /Account growth over the test/ }).isVisible());
check('the price chart is drawn', (await page.locator('section[aria-label="Results"] canvas').count()) > 0);
check('each trade says how it closed', /Exit rule|End of test/.test(await u.trades.first().innerText()));
check('the run is added to recent runs', (await u.history.count()) === 1);
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/backtest.results.png` });
await page.locator('section[aria-label="Results"]').evaluate((el) => el.scrollTo(0, 620));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/backtest.chart.png` });

// ── Change a number ────────────────────────────────────────────────────
await u.form.getByLabel('Entry condition 1, left side: EMA period').fill('10');
await u.form.getByLabel('Exit condition 1, left side: EMA period').fill('10');
check('the rule in words follows the edit', await u.form.getByText('EMA 10 crosses above EMA 50').isVisible());
await u.run();
const n2 = await u.tradeCount();
check('a faster average changes the trades', n2 !== n1 || (await u.tileValue('Total return')) !== ret, `${n1} -> ${n2} trades`);
check('recent runs now has two rows to compare', (await u.history.count()) === 2);

// ── Stop-loss ──────────────────────────────────────────────────────────
await u.input('Stop-loss').fill('3');
await u.run();
check('a tight stop-loss closes some trades', (await u.trades.filter({ hasText: 'Stop-loss' }).count()) > 0);
check('the summary mentions the stop-loss', await page.getByText(/or at a 3% stop-loss/).isVisible());
await u.input('Stop-loss').fill('');

// ── Build a rule ───────────────────────────────────────────────────────
await u.form.getByRole('button', { name: 'Add entry condition' }).click();
check('a condition can be added', await u.form.getByLabel('Entry condition 2, left side', { exact: true }).isVisible());
await u.form.getByLabel('Entry condition 2, left side', { exact: true }).selectOption('indicator:rsi');
await u.form.getByLabel('Entry condition 2, comparison').selectOption('lt');
await u.form.getByLabel('Entry condition 2, right side', { exact: true }).selectOption('constant');
await u.form.getByLabel('Entry condition 2, right side: number').fill('70');
check('the new condition reads in words', await u.form.getByText('RSI 14 is below 70').isVisible());
check('conditions can be joined by all or any', await u.form.getByLabel('Entry: how conditions combine').isVisible());
await u.form.getByLabel('Entry condition 2, right side: number').fill('');
check('a missing number blocks the run', (await u.form.getByText('A condition is missing its number.').isVisible()) && (await u.form.getByRole('button', { name: 'Run backtest' }).isDisabled()));
await u.form.getByRole('button', { name: 'Remove entry condition 2' }).click();
await u.form.getByRole('button', { name: 'Remove entry condition 1' }).click();
check('no entry condition blocks the run and says why', (await u.form.getByText('Add at least one entry condition.').isVisible()) && (await u.form.getByRole('button', { name: 'Run backtest' }).isDisabled()));

// ── Presets, saving ────────────────────────────────────────────────────
await u.input('Start from').selectOption('rsi-mean-reversion');
check('loading a preset replaces the rules', (await u.form.getByText('RSI 14 crosses below 30').isVisible()) && (await u.input('Stop-loss').inputValue()) === '8');
check('a preset explains its idea', await u.form.getByText(/Buys weakness/).isVisible());
await u.input('Name').fill('My RSI idea');
await u.form.getByRole('button', { name: 'Save as my own' }).click();
await page.waitForTimeout(200);
const options = await u.input('Start from').locator('option').allInnerTexts();
check('saving a preset makes a copy in the list', options.includes('Saved · My RSI idea') && options.includes('Preset · RSI mean reversion'), options.slice(-2).join(' | '));
await u.run();
check('the saved strategy runs', /My RSI idea on AAPL/.test(await u.heading.first().innerText()));

await page.reload({ waitUntil: 'domcontentloaded' });
await u.runButton.waitFor({ timeout: 10000 });
check('a reload keeps the strategy, the set-up and the run history', (await u.input('Name').inputValue()) === 'My RSI idea' && (await u.input('Symbol').inputValue()) === 'AAPL' && (await u.input('From').inputValue()) === '2019-01-01' && (await u.history.count()) === 4);

// ── Short ──────────────────────────────────────────────────────────────
await u.form.getByRole('radio', { name: /Short/ }).click();
check('short flips the wording', (await u.form.getByText('Enter (sell short) when').isVisible()) && (await u.form.getByText('Profits when price falls after entry.').isVisible()));
await u.run();
check('a short test says so', await page.getByText(/· Short$/).or(page.getByText(/· Short ·/)).first().isVisible());
await u.form.getByRole('radio', { name: /Long/ }).click();

// ── Errors ─────────────────────────────────────────────────────────────
await u.period('2023-12-31', '2019-01-01');
const before = await u.history.count();
await u.form.getByRole('button', { name: 'Run backtest' }).click();
await page.waitForTimeout(400);
check('dates the wrong way round are refused by the form', (await u.history.count()) === before && !(await u.form.evaluate((f) => f.checkValidity())));
await u.period('1990-01-01', '1990-12-31');
await u.run();
check('a period with no history says so', await page.getByText(/no AAPL price history in that period/).isVisible());
await u.input('Symbol').selectOption('BTCUSDT');
await u.input('Candle size').selectOption('1m');
await u.period('2024-01-01', '2025-12-31');
await u.run();
check('a period with too many candles is refused with a way out', await page.getByText(/Choose a larger candle size or a shorter period/).isVisible());

// ── Futures ────────────────────────────────────────────────────────────
await u.input('Start from').selectOption('ema-crossover');
await u.input('Candle size').selectOption('1d');
await u.form.getByRole('button', { name: 'Last 2 years' }).click();
await u.form.getByRole('switch', { name: 'Trade it as futures' }).click();
check('futures adds leverage and funding', (await u.form.getByRole('slider', { name: /Leverage/ }).isVisible()) && (await u.form.getByRole('switch', { name: 'Charge funding' }).isVisible()));
await u.form.getByRole('slider', { name: /Leverage/ }).fill('20');
check('20x says how small a move liquidates', await u.form.getByText(/if price moves about\s+4\.5%\s+down from entry/).isVisible());
check('above 5x shows a warning', await u.form.getByText(/Above 5x, ordinary daily swings/).isVisible());
await u.run();
const sub = await page.locator('section[aria-label="Results"] header p').first().innerText();
check('the result is labelled as 20x futures', /20x futures/.test(sub), sub);
const liq = await page.getByText(/trades? (was|were)\s+liquidated|No trades were liquidated/).first().innerText().catch(() => '');
check('liquidations are counted and explained', /liquidated/.test(liq), liq.slice(0, 70));
check('at 20x on daily Bitcoin candles some trades are liquidated', (await u.trades.filter({ hasText: 'Liquidated' }).count()) > 0);
check('funding is reported in costs', /funding (paid|received)/.test(await u.tile('Costs').innerText()));
await page.screenshot({ path: `${OUT}/backtest.futures.png` });
await page.getByRole('button', { name: 'Switch to light theme' }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/backtest.light.png` });
await page.locator('section[aria-label="Results"]').evaluate((el) => el.scrollTo(0, 900));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/backtest.light.chart.png` });
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
const pu = ui(phone.page);
await phone.page.goto(`${BASE}/backtest`, { waitUntil: 'domcontentloaded' });
await pu.runButton.waitFor({ timeout: 10000 });
check('phone: strategy and results are tabs', (await phone.page.getByRole('tab', { name: 'Strategy' }).isVisible()) && (await phone.page.getByRole('tab', { name: 'Results' }).isVisible()));
check('phone: builder has no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.screenshot({ path: `${OUT}/backtest.phone.builder.png` });
await pu.input('Symbol').selectOption('SPY');
await pu.form.getByRole('button', { name: 'Last 5 years' }).tap();
await pu.form.getByRole('button', { name: 'Run backtest' }).tap();
await phone.page.getByRole('heading', { level: 2, name: /on SPY/ }).waitFor({ timeout: 30000 });
check('phone: running switches to the results', (await phone.page.getByRole('tab', { name: 'Results' }).getAttribute('aria-selected')) === 'true');
check('phone: results have no horizontal overflow', (await phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await phone.page.waitForTimeout(500);
await phone.page.screenshot({ path: `${OUT}/backtest.phone.results.png` });
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

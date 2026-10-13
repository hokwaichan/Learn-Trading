// Smoke test for Home, the daily challenge, the calculators, and export/import.
// Needs the dev server.
//   npm run smoke
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

async function open(viewport, extra = {}, seed = null) {
  const context = await browser.newContext({ viewport, acceptDownloads: true, ...extra });
  if (seed) {
    await context.addInitScript((data) => {
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
  return { context, page };
}

// ── First visit ────────────────────────────────────────────────────────
const { context, page } = await open({ width: 1440, height: 900 });
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
check('a first visit is welcomed and pointed at lesson one', (await seen(page.getByRole('heading', { level: 1, name: 'Welcome to TradeSchool' }))) && (await page.getByRole('link', { name: /Start the first lesson/ }).isVisible()));
check('it says no real money is involved', await page.getByText(/Nothing here uses real money/).isVisible());
const tile = async (label) => (await page.locator('div.rounded-card').filter({ has: page.getByText(label, { exact: true }) }).first().innerText()).replace(/\s+/g, ' ');
check('progress starts at zero', /0 of 52/.test(await tile('Lessons completed')) && /0 days/.test(await tile('Daily streak')), await tile('Lessons completed'));
check('the paper account is summarised', (await page.getByText('Equity (simulated money)').isVisible()) && /\$10,000\.00/.test(await page.locator('section').filter({ hasText: 'Paper account' }).first().innerText()));
check('every module has a progress bar', (await page.locator('section').filter({ hasText: 'Progress by module' }).getByRole('progressbar').count()) === 11);
check('empty lists explain themselves', (await page.getByText(/No closed trades yet/).isVisible()) && (await page.getByText(/Nothing to show yet\. Answer a few pattern drills/).isVisible()));
await page.screenshot({ path: `${OUT}/home.first.png`, fullPage: true });

// ── Daily challenge ────────────────────────────────────────────────────
const card = page.locator('section').filter({ hasText: 'Daily challenge' }).first();
check('the daily challenge is offered', await card.getByRole('button', { name: "Start today's challenge" }).isVisible());
await card.getByRole('button', { name: "Start today's challenge" }).click();
const dialog = page.getByRole('dialog', { name: 'Daily challenge' });
await dialog.getByRole('group', { name: 'Answers' }).waitFor({ timeout: 20000 });
check('it starts with question 1 of 2, a pattern', /Question 1 of 2/.test(await dialog.innerText()) && (await dialog.locator('canvas, svg[role="img"]').count()) > 0);
check('Next is disabled until an answer is chosen', await dialog.getByRole('button', { name: 'Next question' }).isDisabled());
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/home.challenge.png` });
await dialog.getByRole('group', { name: 'Answers' }).getByRole('button').first().click();
check('the answer is explained', (await seen(dialog.getByText(/^(Right|Not quite)\./))) && (await dialog.getByText('Correct answer').isVisible()));
await dialog.getByRole('button', { name: 'Next question' }).click();
await dialog.getByText(/Question 2 of 2/).waitFor({ timeout: 5000 });
check('question 2 is a concept question', /Concept/.test(await dialog.innerText()) && (await dialog.getByRole('group', { name: 'Answers' }).getByRole('button').count()) >= 3);
await dialog.getByRole('group', { name: 'Answers' }).getByRole('button').first().click();
await dialog.getByRole('button', { name: 'Finish' }).click();
check('a score is shown at the end', await seen(dialog.getByText(/^[012] of 2 right$/)));
await dialog.getByRole('button', { name: 'Done' }).click();
check('the card shows it is done for today', (await seen(card.getByText('Done for today'))) && (await card.getByRole('button', { name: 'Do it again' }).isVisible()));
check('doing it starts the daily streak', /1 day/.test(await tile('Daily streak')) && /2 answers so far/.test(await tile('Trainer accuracy')), `${await tile('Daily streak')} | ${await tile('Trainer accuracy')}`);
check('the top bar streak follows', /1/.test(await page.locator('header').getByLabel(/streak/i).first().innerText().catch(() => '1')));
await page.reload({ waitUntil: 'domcontentloaded' });
check('it stays done after a reload', await seen(card.getByText('Done for today')));

// ── Calculators ────────────────────────────────────────────────────────
await page.goto(`${BASE}/tools`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Calculators', level: 1 }).waitFor({ timeout: 10000 });
check('seven calculators are offered', (await page.getByRole('tablist', { name: 'Calculators' }).getByRole('tab').count()) === 7);
const panel = () => page.locator('[role="tabpanel"]:visible');
const field = (label) => panel().getByLabel(label, { exact: true });
const result = async () => (await panel().locator('section').filter({ hasText: 'Result' }).innerText()).replace(/\s+/g, ' ');
const tab = (name) => page.getByRole('tab', { name, exact: true }).click();

check('position size: 1% of $10,000 with a 5-point stop is 20 units', /20 units/.test(await result()) && /\$100\.00/.test(await result()) && /Position value \$2,000\.00/.test(await result()), await result());
await field('Stop-loss price').fill('99.5');
check('a tight stop means a large position, and it says leverage is needed', /200 units/.test(await result()) && /larger than the account/.test(await result()) && /2\.0x leverage/.test(await result()));
await field('Stop-loss price').fill('100');
check('nonsense inputs get guidance, not a wrong number', /an entry and stop that differ/.test(await result()));
await page.screenshot({ path: `${OUT}/tools.size.png` });

await tab('Risk/reward');
check('risk/reward: 100, 95, 110 is 2 to 1, breaking even at 33.3%', /2\.00 : 1/.test(await result()) && /33\.3%/.test(await result()) && /\+0\.20R per trade/.test(await result()), await result());
await field('Take-profit price').fill('90');
check('a target on the wrong side is caught', /opposite sides of the entry/.test(await result()));

await tab('Compounding');
check('compounding: 2% a month for 24 months turns $10,000 into $16,084.37', /\$16,084\.37/.test(await result()) && /35\.0 months/.test(await result()) && (await panel().getByRole('img', { name: /Balance over 24 months/ }).isVisible()), await result());
await field('Added each month').fill('100');
check('monthly additions are counted as paid in', /Paid in \$12,400\.00/.test(await result()));

await tab('Break-even win rate');
check('break-even: a $150 win against a $100 loss needs 40%', /40\.0%/.test(await result()) && /\+\$12\.50 per trade/.test(await result()) && /\+\$1,250\.00/.test(await result()), await result());

await tab('Leverage and liquidation');
check('liquidation: a 5x long from 50,000 is liquidated at 40,250', /40,250/.test(await result()) && /19\.5% down/.test(await result()) && /\$5,000\.00/.test(await result()) && /\+\$200\.00 \(\+20\.0% of margin\)/.test(await result()), await result());
await panel().getByRole('slider', { name: /Leverage/ }).fill('20');
check('20x is liquidated 4.5% away, with a warning above 5x', /47,750/.test(await result()) && /4\.5% down/.test(await result()) && /Above 5x/.test(await result()));
await field('Exit price to test').fill('47000');
check('an exit past liquidation loses the margin, not more', /-\$1,000\.00 \(-100\.0% of margin\), liquidated/.test(await result()), await result());
await panel().getByLabel('Direction').selectOption('short');
check('a short is liquidated above its entry', /52,250/.test(await result()) && /4\.5% up/.test(await result()));
await page.screenshot({ path: `${OUT}/tools.leverage.png` });

await tab('Option profit');
const option = await result();
check('option profit: values a call before expiry and at expiry', /Result if price is 112 in 15 days/.test(option) && /Break-even at expiry/.test(option) && /Most you can make Unlimited/.test(option), option.slice(0, 160));
await field('Premium per unit').fill('2');
await field('Days from now').fill('30');
check('at expiry a 105 call bought for 2 with price at 112 makes $500', /Result if price is 112 at expiry/.test(await result()) && /\+\$500\.00/.test(await result()) && /Break-even at expiry 107/.test(await result()) && /Most you can lose \$200\.00/.test(await result()), await result());
await panel().getByLabel('You', { exact: true }).selectOption('sell');
check('selling it flips the result and the risk', /-\$500\.00/.test(await result()) && /Most you can lose Unlimited/.test(await result()));

await tab('Probability');
const prob = await result();
const [above, below] = [...prob.matchAll(/(\d+\.\d)%/g)].map((m) => Number(m[1]));
check('probability: above and below add to 100%, with a likely range', Math.abs(above + below - 100) < 0.11 && above < 50 && /Likely range/.test(prob), prob.slice(0, 120));
check('it is labelled as a model figure', await panel().getByText(/not a prediction/).isVisible());

await tab('Position size');
check('a calculator keeps what was typed when you come back', (await field('Stop-loss price').inputValue()) === '100');

// ── Export and import ──────────────────────────────────────────────────
await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Export all data' }).waitFor({ timeout: 10000 });
check('settings says the data stays in this browser', await page.getByText(/Everything is stored in this browser only/).isVisible());
const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export all data' }).click()]);
const backupPath = await download.path();
const backup = JSON.parse(readFileSync(backupPath, 'utf8'));
check('export saves a backup file with the stores in it', backup.app === 'TradeSchool' && /^tradeschool-backup-\d{4}-\d\d-\d\d\.json$/.test(download.suggestedFilename()) && 'tradeschool.progress' in backup.data, Object.keys(backup.data).join(', '));
check('the backup holds the challenge just done', backup.data['tradeschool.progress'].state.challengeDays.length === 1);

await page.getByRole('button', { name: 'Erase everything' }).click();
const erase = page.getByRole('dialog', { name: 'Erase everything?' });
check('erasing asks first, in the warning style', await erase.isVisible());
await page.screenshot({ path: `${OUT}/settings.erase.png` });
await erase.getByRole('button', { name: 'Cancel' }).click();
await page.getByRole('button', { name: 'Erase everything' }).click();
await erase.getByRole('button', { name: 'Erase everything' }).click();
await page.waitForLoadState('domcontentloaded');
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
check('after erasing, the app is as new', (await seen(page.getByRole('heading', { level: 1, name: 'Welcome to TradeSchool' }))) && (await seen(page.getByRole('button', { name: "Start today's challenge" }))));

await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Import a backup' }).waitFor({ timeout: 10000 });
const bad = `${OUT}/not-a-backup.json`;
writeFileSync(bad, JSON.stringify({ hello: 'world' }));
await page.getByLabel('Backup file to import').setInputFiles(bad);
check('a file that is not a backup is refused with a reason', await seen(page.getByText('That file is not a TradeSchool backup.')));
await page.getByLabel('Backup file to import').setInputFiles(backupPath);
const importDialog = page.getByRole('dialog', { name: 'Replace everything with this backup?' });
check('importing lists what the file contains and asks first', (await seen(importDialog)) && /Lesson and trainer progress/.test(await importDialog.innerText()));
await importDialog.getByRole('button', { name: 'Import and replace' }).click();
await page.waitForLoadState('domcontentloaded');
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
check('after importing, progress is back', (await seen(page.getByText('Done for today'))) && /1 day/.test(await tile('Daily streak')));
await context.close();

// ── A returning learner ────────────────────────────────────────────────
const now = Date.now();
const day = (offset) => {
  const d = new Date(now - offset * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const trade = (i, netPnl) => ({ id: `t${i}`, accountId: 'main', positionId: `p${i}`, symbol: 'BTCUSDT', kind: 'spot', direction: 'long', quantity: 0.01, entryPrice: 80000, exitPrice: 80000 + netPnl * 100, openedAt: now - (i + 1) * 3_600_000, closedAt: now - i * 3_600_000, grossPnl: netPnl + 1, fees: 1, funding: 0, netPnl, returnPct: netPnl / 800, exitReason: 'manual' });
const reviewCard = (refId, attempts, correct) => ({ id: `pattern:${refId}`, kind: 'pattern', refId, ease: 2.5, intervalDays: 1, repetitions: 1, lapses: 0, dueAt: now, attempts, correct });
const SEED = {
  'tradeschool.progress': {
    state: {
      lessons: { 'basics/what-is-trading': { completedAt: now, bestScore: 1, attempts: 1 }, 'basics/markets-and-assets': { completedAt: now, bestScore: 0.6, attempts: 2 } },
      lastLesson: { moduleId: 'basics', lessonId: 'what-is-trading' },
      activeDays: [day(2), day(1), day(0)],
      challengeDays: [],
      cards: { 'pattern:hammer': reviewCard('hammer', 10, 3), 'pattern:doji': reviewCard('doji', 8, 7), 'pattern:head-and-shoulders': reviewCard('head-and-shoulders', 4, 2) },
    },
    version: 2,
  },
  'tradeschool.account': {
    state: {
      accounts: {
        main: { id: 'main', startingBalance: 10000, cash: 10035, positions: [], orders: [], trades: [trade(1, 40), trade(2, -25), trade(3, 20)], ledger: [], equityHistory: [{ time: now - 4 * 3_600_000, equity: 10000 }, { time: now - 3 * 3_600_000, equity: 10020 }, { time: now - 2 * 3_600_000, equity: 9995 }, { time: now - 3_600_000, equity: 10035 }], createdAt: now - 86_400_000, resetCount: 0 },
        replay: { id: 'replay', startingBalance: 10000, cash: 10000, positions: [], orders: [], trades: [], ledger: [], equityHistory: [], createdAt: now, resetCount: 0 },
      },
    },
    version: 1,
  },
};
const back = await open({ width: 1440, height: 900 }, {}, SEED);
const bp = back.page;
await bp.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
const lessonIds = await bp.evaluate(async () => {
  const { MODULES } = await import('/src/content/lessons/index.ts');
  return MODULES[0].lessons.slice(0, 3).map((l) => `${l.moduleId}/${l.id}`);
});
// Re-seed with the real ids of the first two lessons, so the test does not depend on their names.
await bp.evaluate(([ids, seed]) => {
  const progress = seed['tradeschool.progress'];
  progress.state.lessons = { [ids[0]]: { completedAt: Date.now(), bestScore: 1, attempts: 1 }, [ids[1]]: { completedAt: Date.now(), bestScore: 0.6, attempts: 2 } };
  progress.state.lastLesson = { moduleId: ids[0].split('/')[0], lessonId: ids[0].split('/')[1] };
  localStorage.setItem('tradeschool.progress', JSON.stringify(progress));
}, [lessonIds, SEED]);
await bp.reload({ waitUntil: 'domcontentloaded' });
check('a returning learner is welcomed back', await seen(bp.getByRole('heading', { level: 1, name: 'Welcome back' })));
const btile = async (label) => (await bp.locator('div.rounded-card').filter({ has: bp.getByText(label, { exact: true }) }).first().innerText()).replace(/\s+/g, ' ');
check('lesson progress and quiz scores are summarised', /2 of 52/.test(await btile('Lessons completed')) && /80%/.test(await btile('Average quiz score')) && /3 days/.test(await btile('Daily streak')), `${await btile('Lessons completed')} | ${await btile('Average quiz score')} | ${await btile('Daily streak')}`);
const cont = bp.locator('section').filter({ hasText: 'Continue learning' }).first();
const href = await cont.getByRole('link', { name: /Continue/ }).first().getAttribute('href');
check('continue learning points at the next unfinished lesson', href === `/learn/${lessonIds[2]}` && /lesson 3 of 52/.test((await cont.innerText()).replace(/\s+/g, ' ')), href);
check('the weakest pattern is suggested as the next thing to practise', /Hammer/.test(await cont.innerText()) && /30%/.test(await cont.innerText()));
const weak = (await bp.locator('section').filter({ hasText: 'Weakest patterns to practise' }).first().innerText()).replace(/\s+/g, ' ');
check('weakest patterns are listed worst first', weak.indexOf('Hammer') < weak.indexOf('Head and shoulders') && weak.indexOf('Head and shoulders') < weak.indexOf('Doji') && /30% right over 10 tries/.test(weak), weak.slice(0, 140));
const acct = (await bp.locator('section').filter({ hasText: 'Paper account' }).first().innerText()).replace(/\s+/g, ' ');
check('the account summary shows equity, the total result and a sparkline', /\$10,035\.00/.test(acct) && /\+\$35\.00/.test(acct) && (await bp.getByRole('img', { name: /Equity from \$10,000\.00 to \$10,035\.00/ }).isVisible()), acct.slice(0, 120));
const recent = bp.locator('section').filter({ hasText: 'Recent trades' }).first();
check('recent trades are listed newest first with signed results', (await recent.getByRole('listitem').count()) === 3 && /\+\$40\.00/.test(await recent.getByRole('listitem').first().innerText()));
await recent.getByRole('listitem').first().getByRole('link').click();
check('a recent trade opens in the journal', await seen(bp.getByRole('heading', { level: 1, name: /BTC\/USDT long/ })));
await bp.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await bp.getByRole('heading', { level: 1, name: 'Welcome back' }).waitFor({ timeout: 10000 });
await bp.waitForTimeout(300);
await bp.screenshot({ path: `${OUT}/home.returning.png`, fullPage: true });
await bp.getByRole('button', { name: 'Switch to light theme' }).click();
await bp.waitForTimeout(300);
await bp.screenshot({ path: `${OUT}/home.returning.light.png`, fullPage: true });
await back.context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true }, SEED);
const overflow = () => phone.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await phone.page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('heading', { level: 1 }).waitFor({ timeout: 10000 });
check('phone: home fits', (await overflow()) <= 0);
await phone.page.screenshot({ path: `${OUT}/home.phone.png` });
await phone.page.goto(`${BASE}/tools`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('heading', { name: 'Calculators', level: 1 }).waitFor({ timeout: 10000 });
check('phone: calculators fit', (await overflow()) <= 0);
await phone.page.getByRole('tab', { name: 'Leverage and liquidation' }).tap();
check('phone: every calculator can be reached', await seen(phone.page.getByText('Liquidation price', { exact: true })));
check('phone: no overflow after switching', (await overflow()) <= 0);
await phone.page.screenshot({ path: `${OUT}/tools.phone.png` });
await phone.page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
await phone.page.getByRole('button', { name: 'Export all data' }).waitFor({ timeout: 10000 });
check('phone: settings fit', (await overflow()) <= 0);
await phone.context.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

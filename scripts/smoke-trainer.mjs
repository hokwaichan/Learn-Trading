// Smoke test for the pattern trainer. Needs the dev server.
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
    errors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
};

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
track(page);

const answers = () => page.getByRole('group', { name: 'Answers' }).getByRole('button');
const stat = async (label) => (await page.getByRole('group', { name: 'This session' }).locator('div', { hasText: label }).last().locator('span').first().innerText()).trim();
const topic = () => page.locator('main section span span').first().innerText();
const waitQuestion = () => page.locator('#trainer-prompt').waitFor({ timeout: 15000 });
const pickMode = async (name) => {
  await page.getByRole('radio', { name, exact: true }).click();
  await waitQuestion();
  await page.waitForTimeout(500);
};

await page.goto(`${BASE}/trainer`, { waitUntil: 'domcontentloaded' });
await waitQuestion();
await page.waitForTimeout(800);
check('a question appears with its answer buttons', (await answers().count()) >= 3);
check('session strip starts empty', (await stat('Answered')) === '0');

// ── Candlestick drill ──────────────────────────────────────────────────
await pickMode('Candlesticks');
check('candlestick drill uses real history', await page.getByText('Real history').isVisible());
check('the candles in question are marked', (await page.locator('main svg text', { hasText: 'Which pattern?' }).count()) === 1);
check('four distinct answers are offered', new Set(await answers().allInnerTexts()).size === 4);
const canvasBefore = await page.locator('main canvas').first().screenshot();
await page.screenshot({ path: `${OUT}/trainer.candlestick.png` });
await page.keyboard.press('1');
await page.getByRole('button', { name: 'Next question' }).waitFor();
check('pressing 1 answers the question', (await stat('Answered')) === '1');
check('the answer is locked', await answers().first().isDisabled());
check('the right answer is labelled in words', (await page.getByText('Correct answer').count()) === 1);
check('an explanation with how traders read it and its weakness is shown', (await page.getByText(/How traders read it:/).isVisible()) && (await page.getByText(/Weakness:/).isVisible()));
check('it says what actually happened next', await page.getByText(/What happened here: over the next 8 candles/).isVisible());
await page.waitForTimeout(500);
const canvasAfter = await page.locator('main canvas').first().screenshot();
check('later candles are revealed after answering', !canvasBefore.equals(canvasAfter));
check('the marked candles are named after answering', (await page.locator('main svg text', { hasText: 'Which pattern?' }).count()) === 0);
check('Next question is focused', await page.getByRole('button', { name: 'Next question' }).evaluate((el) => el === document.activeElement));
await page.screenshot({ path: `${OUT}/trainer.candlestick-answered.png` });
const firstPrompt = await page.locator('main canvas').first().screenshot();
await page.keyboard.press('Enter');
await page.waitForTimeout(700);
check('Enter moves to a new question', (await page.getByRole('button', { name: 'Next question' }).count()) === 0 && !(await answers().first().isDisabled()));
check('the new question has a different chart', !(await page.locator('main canvas').first().screenshot()).equals(firstPrompt));

// ── Chart pattern drill ────────────────────────────────────────────────
await pickMode('Chart patterns');
check('chart pattern drill is labelled as constructed', (await page.getByText('Constructed example').count()) >= 1);
await page.screenshot({ path: `${OUT}/trainer.chart.png` });
await answers().nth(1).click();
await page.getByRole('button', { name: 'Next question' }).waitFor();
check('explanation links to the lesson', await page.getByRole('link', { name: 'Read the lesson' }).isVisible());

// ── What happened next ─────────────────────────────────────────────────
await pickMode('What next?');
const nextLabels = await answers().allInnerTexts();
check('prediction drill offers up, sideways and down', ['Up', 'Sideways', 'Down'].every((l) => nextLabels.some((t) => t.includes(l))) && nextLabels.length === 3);
await page.screenshot({ path: `${OUT}/trainer.next.png` });
await page.keyboard.press('2');
await page.getByRole('button', { name: 'Next question' }).waitFor();
await page.waitForTimeout(500);
check('the hidden candles are revealed and boxed', (await page.locator('main svg text', { hasText: 'What happened next' }).count()) === 1);
check('the result is given in percent and ATRs', await page.getByText(/price moved [+-]?\d+\.\d\d%, which is \d+\.\d times the average candle range/).isVisible());
check('it is honest that this cannot be predicted reliably', await page.getByText(/Nobody predicts this reliably/).isVisible());
await page.screenshot({ path: `${OUT}/trainer.next-answered.png` });

// ── Smart money drill ──────────────────────────────────────────────────
await pickMode('Smart money');
await page.getByRole('group', { name: 'Answers' }).waitFor({ timeout: 10000 });
check('smart money: asks about a marked stretch of a real chart', (await topic()).includes('Smart money') && /marked candles show|What has just happened/.test(await page.locator('#trainer-prompt').innerText()));
const smcChoices = await page.getByRole('group', { name: 'Answers' }).getByRole('button').allInnerTexts();
check('smart money: offers the four structure events', ['Fair value gap', 'Liquidity sweep', 'Break of structure', 'Change of character'].every((name) => smcChoices.some((c) => c.includes(name))), smcChoices.map((c) => c.replace(/\s+/g, ' ').trim()).join(' | '));
await page.screenshot({ path: `${OUT}/trainer.smart-money.png` });
await page.getByRole('group', { name: 'Answers' }).getByRole('button').first().click();
await page.waitForTimeout(400);
check('smart money: explains the rule and says it is not a prediction', (await page.getByText(/^The rule:/).isVisible()) && (await page.getByText(/They are not predictions, and they fail often/).isVisible()));
check('smart money: links to its lesson', (await page.getByRole('link', { name: 'Read the lesson' }).getAttribute('href'))?.startsWith('/learn/smart-money/') === true);

// ── Options drills ─────────────────────────────────────────────────────
await pickMode('Options');
let sawPayoff = false;
let sawOutlook = false;
for (let i = 0; i < 14 && !(sawPayoff && sawOutlook); i++) {
  const t = await topic();
  if (t.includes('Payoff')) {
    if (!sawPayoff) await page.screenshot({ path: `${OUT}/trainer.payoff.png` });
    sawPayoff = true;
  } else {
    if (!sawOutlook) await page.screenshot({ path: `${OUT}/trainer.outlook.png` });
    sawOutlook = true;
  }
  await answers().first().click();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.waitForTimeout(250);
}
check('options mode asks payoff-diagram questions', sawPayoff);
check('options mode asks pick-a-strategy questions', sawOutlook);

// ── Session, accuracy table and persistence ────────────────────────────
const answered = Number(await stat('Answered'));
check('the session strip counts answers', answered >= 5, `${answered} answered, ${await stat('Accuracy')} accuracy`);
const table = page.getByRole('table', { name: 'Accuracy by item' });
check('accuracy table lists what has been answered', (await table.locator('tbody tr').count()) >= 4);
await table.scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/trainer.accuracy.png` });
check('the streak counts trainer practice', (await page.getByRole('img', { name: '1 day streak' }).count()) === 1);

const saved = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('tradeschool.progress')).state.cards).length);
await page.reload({ waitUntil: 'domcontentloaded' });
await waitQuestion();
check('answers are saved between visits', saved >= 4 && (await page.getByRole('table', { name: 'Accuracy by item' }).locator('tbody tr').count()) >= 4, `${saved} cards`);
check('the chosen drill is remembered', (await page.getByRole('radio', { name: 'Options', exact: true }).getAttribute('aria-checked')) === 'true');

// Saved progress from before the trainer existed still loads.
await page.evaluate(() => {
  localStorage.setItem('tradeschool.progress', JSON.stringify({ version: 1, state: { lessons: { 'basics/leverage': { completedAt: 1, bestScore: 1, attempts: 1 } }, activeDays: [], challengeDays: [] } }));
});
await page.reload({ waitUntil: 'domcontentloaded' });
await waitQuestion();
await answers().first().click();
await page.getByRole('button', { name: 'Next question' }).waitFor();
const migrated = await page.evaluate(() => JSON.parse(localStorage.getItem('tradeschool.progress')));
check('old saved progress is upgraded, not wiped', migrated.version === 2 && migrated.state.lessons['basics/leverage']?.bestScore === 1 && Object.keys(migrated.state.cards).length === 1);

// Many questions in a row without an error.
await pickMode('Mixed');
const topics = new Set();
for (let i = 0; i < 40; i++) {
  topics.add(await topic());
  await page.keyboard.press(String(1 + (i % 3)));
  await page.getByRole('button', { name: 'Next question' }).waitFor({ timeout: 5000 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(120);
}
check('mixed mode cycles through all six drills', topics.size === 6, [...topics].join(', '));
check('40 questions in a row with no error', errors.length === 0, [...new Set(errors)].slice(0, 3).join(' | '));
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await phone.newPage();
track(m);
await m.goto(`${BASE}/trainer`, { waitUntil: 'domcontentloaded' });
await m.locator('#trainer-prompt').waitFor({ timeout: 15000 });
await m.waitForTimeout(800);
check('phone: no horizontal overflow', (await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 0);
await m.screenshot({ path: `${OUT}/trainer.phone.png` });
await m.getByRole('group', { name: 'Answers' }).getByRole('button').first().tap();
check('phone: tapping an answer works', await m.getByRole('button', { name: 'Next question' }).isVisible());
await phone.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

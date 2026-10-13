// Smoke test for lessons, quizzes and the glossary. Needs the dev server.
// It opens every lesson in the curriculum.
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
const track = (page, label) => {
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''))) return;
    errors.push(`${label()}: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => errors.push(`${label()}: ${e.message.slice(0, 200)}`));
};

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
let where = 'start';
track(page, () => where);

// ── Curriculum overview ────────────────────────────────────────────────
await page.goto(`${BASE}/learn`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Lessons', level: 1 }).waitFor();
check('overview offers a place to start', await page.getByText('Start here').isVisible());
const links = await page.locator('main ol a[href^="/learn/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
check('overview lists every lesson', links.length >= 50, `${links.length} lessons`);
check('overview shows all eighteen modules', (await page.locator('main section[aria-labelledby^="module-"]').count()) === 18);
await page.screenshot({ path: `${OUT}/learn.overview.png` });

// ── Every lesson renders ───────────────────────────────────────────────
let broken = 0;
let charts = 0;
let widgets = 0;
const problems = [];
for (const href of links) {
  where = href;
  await page.goto(BASE + href, { waitUntil: 'domcontentloaded' });
  const h1 = page.locator('article h1');
  await h1.waitFor({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(350);
  const info = await page.evaluate(() => ({
    title: document.querySelector('article h1')?.textContent ?? '',
    figures: document.querySelectorAll('article figure').length,
    canvases: [...document.querySelectorAll('article figure')].filter((f) => f.querySelector('canvas')).length,
    widgets: document.querySelectorAll('article section[aria-label]:not([aria-labelledby])').length,
    questions: document.querySelectorAll('article fieldset').length,
    failed: document.body.innerText.includes('This screen hit a problem') || document.body.innerText.includes('Could not load this chart'),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    wideBlocks: [...document.querySelectorAll('article p, article li')].filter((el) => el.getBoundingClientRect().width > 760).length,
  }));
  charts += info.canvases;
  widgets += info.widgets;
  const lessonCharts = info.figures; // payoff and diagram figures have no canvas; only price charts do
  if (!info.title || info.failed || info.questions < 3 || info.overflow > 0 || info.wideBlocks > 0 || (lessonCharts === 0 && info.widgets === 0)) {
    broken++;
    problems.push(`${href} ${JSON.stringify(info)}`);
  }
}
check(`all ${links.length} lessons render with a title, an interactive block and a quiz`, broken === 0, problems.slice(0, 3).join(' | '));
check('price charts drew in lessons', charts >= 30, `${charts} charts`);
check('interactive widgets rendered', widgets >= 25, `${widgets} widgets`);
check('no errors while opening every lesson', errors.length === 0, [...new Set(errors)].slice(0, 3).join(' | '));

// ── A lesson in detail ─────────────────────────────────────────────────
where = 'detail';
await page.goto(`${BASE}/learn/basics/order-types`, { waitUntil: 'domcontentloaded' });
await page.locator('article h1').waitFor();
await page.waitForTimeout(600);
const column = await page.locator('article > p').first().boundingBox();
check('reading column is about 70 characters wide', column.width > 480 && column.width <= 720, `${Math.round(column.width)}px`);
check('lesson text is 16px', (await page.locator('article > p').first().evaluate((el) => getComputedStyle(el).fontSize)) === '16px');
check('outline marks the current lesson', (await page.getByRole('navigation', { name: 'Curriculum' }).getByRole('link', { name: /Order types/ }).getAttribute('aria-current')) === 'page');
check('chart annotations are drawn', (await page.locator('article figure svg text', { hasText: 'Stop-loss' }).count()) >= 1);
await page.screenshot({ path: `${OUT}/learn.lesson.png` });

const term = page.locator('article a[href^="/glossary#"]').first();
const termText = await term.innerText();
await term.hover();
await page.waitForTimeout(500);
check('glossary terms are linked and show a definition on hover', await page.getByRole('tooltip').isVisible(), termText);
const linkedIds = await page.locator('article a[href^="/glossary#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
check('each term is linked only once per lesson', new Set(linkedIds).size === linkedIds.length, `${linkedIds.length} links`);
await page.mouse.move(5, 5);

// Quiz
const fieldsets = page.locator('article fieldset');
const count = await fieldsets.count();
const firstOrder = await fieldsets.first().locator('button').allInnerTexts();
await fieldsets.nth(0).locator('button').first().click();
check('answering shows an explanation at once', await page.locator('article [role="status"]').first().isVisible());
check('an answered question is locked', await fieldsets.nth(0).locator('button').first().isDisabled());
check('the correct answer is labelled in words, not only colour', (await fieldsets.nth(0).getByText('Correct answer').count()) === 1);
for (let i = 1; i < count; i++) await fieldsets.nth(i).locator('button').first().click();
check('finishing the quiz shows a score', await page.getByText(/You got \d of \d\./).isVisible());
check('the lesson is marked completed', await page.getByText('Completed', { exact: true }).isVisible());
await page.screenshot({ path: `${OUT}/learn.quiz.png`, fullPage: false });
check('the streak starts', (await page.getByRole('img', { name: '1 day streak' }).count()) === 1);
await page.getByRole('button', { name: 'Try again' }).click();
const secondOrder = await fieldsets.first().locator('button').allInnerTexts();
check('a retry resets the quiz', !(await fieldsets.nth(0).locator('button').first().isDisabled()));
console.log(`INFO  answer order, first attempt: ${firstOrder.map((t) => t.slice(0, 18)).join(' | ')}`);
console.log(`INFO  answer order, retry:         ${secondOrder.map((t) => t.slice(0, 18)).join(' | ')}`);

await page.getByRole('link', { name: /^Next/ }).click();
await page.waitForURL('**/learn/basics/bid-ask-spread');
await page.getByRole('heading', { name: 'Bid, ask and the spread', level: 1 }).waitFor();
check('Next goes to the following lesson', true);
check('the new lesson starts at the top', (await page.locator('article').evaluate((el) => el.parentElement.scrollTop)) === 0);

await page.goto(`${BASE}/learn`, { waitUntil: 'domcontentloaded' });
await page.getByText('Continue learning').waitFor();
check('overview records the completed lesson and its quiz score', await page.getByText(/Quiz \d+%/).first().isVisible());
check('overview resumes the lesson you were reading', (await page.locator('main').getByText('Bid, ask and the spread').first().isVisible()));
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByText('Continue learning').waitFor();
check('progress survives a reload', await page.getByText(/Quiz \d+%/).first().isVisible());

// ── Widgets respond ────────────────────────────────────────────────────
where = 'widgets';
await page.goto(`${BASE}/learn/basics/leverage`, { waitUntil: 'domcontentloaded' });
const lev = page.getByRole('slider', { name: 'Leverage' });
await lev.waitFor();
await lev.fill('25');
await page.getByRole('slider', { name: 'Price move' }).fill('-5');
check('leverage demo shows a liquidation at 25x and -5%', await page.getByText(/Liquidated/).isVisible());

await page.goto(`${BASE}/learn/options/calls-and-puts`, { waitUntil: 'domcontentloaded' });
const priceSlider = page.getByRole('slider', { name: 'Price at expiry' }).first();
await priceSlider.waitFor();
await priceSlider.fill('112');
const callFrame = page.getByRole('region', { name: /Long call/ });
check('payoff widget: long 100 call at 112 makes +$8.00', (await callFrame.getByText('+$8.00').count()) === 1);
check('payoff widget lists max loss and break-even', /4\.00/.test(await callFrame.locator('dl').innerText()) && /104\.00/.test(await callFrame.locator('dl').innerText()));
await page.screenshot({ path: `${OUT}/learn.payoff.png` });

await page.goto(`${BASE}/learn/options/delta-and-gamma`, { waitUntil: 'domcontentloaded' });
const spot = page.getByRole('slider', { name: 'Price of the underlying' }).first();
await spot.waitFor();
const deltaCell = page.getByRole('region', { name: /Delta: sensitivity/ }).locator('dl > div', { hasText: 'Delta' }).locator('dd');
await spot.fill('60');
const low = Number(await deltaCell.innerText());
await spot.fill('140');
const high = Number(await deltaCell.innerText());
check('delta slider: delta runs from near 0 to near 1', low < 0.05 && high > 0.95, `${low} -> ${high}`);
await page.locator('article').getByRole('region', { name: /Delta: sensitivity/ }).scrollIntoViewIfNeeded();
await page.screenshot({ path: `${OUT}/learn.greeks.png` });

await page.goto(`${BASE}/learn/risk-management/expectancy`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Draw five new runs' }).waitFor();
const before = await page.getByRole('region', { name: /five different outcomes/ }).locator('dl').innerText();
await page.getByRole('button', { name: 'Draw five new runs' }).click();
const after = await page.getByRole('region', { name: /five different outcomes/ }).locator('dl').innerText();
check('expectancy simulator draws new runs with the same expectancy', before !== after && /\+0\.2R/.test(after));

// ── Glossary ───────────────────────────────────────────────────────────
where = 'glossary';
await page.goto(`${BASE}/glossary`, { waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Glossary', level: 1 }).waitFor();
const total = await page.locator('main dl > div').count();
check('glossary lists its terms', total > 150, `${total} terms`);
await page.getByRole('searchbox', { name: 'Search the glossary' }).fill('liquidation');
await page.waitForTimeout(150);
check('search narrows the list, best match first', (await page.locator('main dl > div dt').first().innerText()) === 'Liquidation');
await page.getByRole('searchbox').fill('zzzz');
check('search with no match explains itself', await page.getByText('No term matches "zzzz"').isVisible());
await page.goto(`${BASE}/glossary#theta`, { waitUntil: 'domcontentloaded' });
await page.locator('#theta').waitFor();
await page.waitForTimeout(300);
check('a link to one term scrolls to it', await page.locator('#theta').isVisible());
check('a term links to the lesson that teaches it', await page.locator('#theta').getByRole('link', { name: /Lesson: The Greeks: theta/ }).isVisible());
await page.screenshot({ path: `${OUT}/glossary.png` });

// Command palette knows lessons and terms
await page.keyboard.press('Control+k');
await page.keyboard.type('iron condor');
const palette = page.getByRole('dialog', { name: 'Command palette' });
check('command palette finds lessons and glossary terms', (await palette.getByRole('option').count()) >= 2);
await page.keyboard.press('Escape');
await context.close();

// ── Phone ──────────────────────────────────────────────────────────────
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const m = await phone.newPage();
where = 'phone';
track(m, () => where);
for (const path of ['/learn', '/learn/candlesticks/candle-anatomy', '/learn/options/advanced-strategies', '/learn/basics/bid-ask-spread', '/glossary']) {
  await m.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await m.locator('main h1').first().waitFor();
  await m.waitForTimeout(500);
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`phone: ${path} has no horizontal overflow`, overflow <= 0, `${overflow}px`);
}
await m.goto(`${BASE}/learn/candlesticks/candle-anatomy`, { waitUntil: 'domcontentloaded' });
await m.getByRole('button', { name: 'Contents' }).tap();
check('phone: Contents opens the curriculum as a sheet', await m.getByRole('dialog', { name: 'Contents' }).isVisible());
await m.waitForTimeout(300);
await m.screenshot({ path: `${OUT}/learn.phone-contents.png` });
await m.getByRole('dialog', { name: 'Contents' }).getByRole('button', { name: 'Close' }).tap();
await m.screenshot({ path: `${OUT}/learn.phone.png` });
await phone.close();

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

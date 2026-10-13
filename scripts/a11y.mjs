// Accessibility audit: runs axe-core (WCAG 2.1 A and AA rules) on every
// screen, in both themes and at desktop and phone width, and checks that
// keyboard focus is visible. Needs the dev server.
//   npm run a11y
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

/** Each screen, with anything to do first so the audit sees real content rather than an empty state. */
const SCREENS = [
  { path: '/', name: 'Home' },
  { path: '/learn', name: 'Lessons' },
  { path: '/learn/basics/what-is-trading', name: 'Lesson', fallback: '/learn' },
  { path: '/learn/smart-money/order-blocks', name: 'Smart money lesson', wait: 800 },
  { path: '/learn/ict/ict-trade-plan', name: 'ICT lesson', wait: 800 },
  { path: '/trainer', name: 'Trainer', wait: 1500 },
  { path: '/glossary', name: 'Glossary' },
  { path: '/charts/BTCUSDT', name: 'Charts', wait: 2500 },
  { path: '/futures/BTCUSDT', name: 'Futures', wait: 2500 },
  { path: '/options/BTCUSDT', name: 'Options', wait: 2500, prepare: (page) => page.getByLabel('Start from a strategy').selectOption('iron-condor').catch(() => {}) },
  { path: '/replay', name: 'Replay' },
  { path: '/backtest', name: 'Backtester' },
  { path: '/journal', name: 'Journal' },
  { path: '/journal/p1', name: 'Journal trade', wait: 2000 },
  { path: '/analytics', name: 'Analytics' },
  { path: '/tools', name: 'Calculators' },
  { path: '/settings', name: 'Settings' },
  // The same screens with something open or filled in.
  { path: '/', name: 'Daily challenge dialog', prepare: (page) => click(page.getByRole('button', { name: /today's challenge|Do it again/ }), page.getByRole('group', { name: 'Answers' })) },
  { path: '/settings', name: 'Confirmation dialog', prepare: (page) => click(page.getByRole('button', { name: 'Reset account' }), page.getByRole('dialog')) },
  { path: '/settings', name: 'Command palette', prepare: async (page) => { await page.keyboard.press('Control+k'); await page.getByRole('dialog').waitFor({ timeout: 3000 }).catch(() => {}); } },
  { path: '/charts/BTCUSDT', name: 'Indicators dialog', wait: 2500, desktopOnly: true, prepare: (page) => click(page.getByRole('button', { name: 'Indicators' }), page.getByRole('dialog')) },
  { path: '/charts/BTCUSDT', name: 'Overlays dialog', wait: 2500, prepare: (page) => click(page.getByRole('toolbar', { name: 'Chart' }).getByRole('button', { name: /^Overlays/ }), page.getByRole('dialog', { name: 'Chart overlays' })) },
  { path: '/trainer', name: 'Trainer answered', wait: 1500, prepare: (page) => click(page.getByRole('group', { name: 'Answers' }).getByRole('button').first(), page.getByText(/^(Right|Not quite)\./)) },
  {
    path: '/backtest',
    name: 'Backtester results',
    desktopOnly: true,
    prepare: async (page) => {
      const form = page.locator('form').filter({ hasText: 'Run backtest' });
      await form.getByLabel('Symbol', { exact: true }).selectOption('SPY');
      await form.getByRole('button', { name: 'Last 5 years' }).click();
      await click(form.getByRole('button', { name: 'Run backtest' }), page.getByRole('table', { name: 'Backtest trades' }), 20000);
    },
  },
  {
    path: '/replay',
    name: 'Replay session',
    desktopOnly: true,
    prepare: async (page) => {
      const form = page.locator('form').filter({ hasText: 'Start replay' });
      await form.getByLabel('Symbol', { exact: true }).selectOption('AAPL');
      await form.getByLabel('Start date', { exact: true }).fill('2024-03-01');
      await click(form.getByRole('button', { name: 'Start replay' }), page.getByRole('toolbar', { name: 'Replay controls' }), 20000);
    },
  },
];

/** Clicks something and waits for what it should bring up. Never throws: a missing control just means less is audited. */
let reached = 0;
let missed = 0;
async function click(target, expected, timeout = 8000) {
  try {
    await target.first().click({ timeout });
    await expected.first().waitFor({ timeout });
    reached++;
  } catch {
    // Audit whatever is on screen.
    missed++;
  }
}

const now = Date.now();
const trade = (i, netPnl, extra = {}) => ({ id: `t${i}`, accountId: 'main', positionId: `p${i}`, symbol: 'BTCUSDT', kind: 'spot', direction: 'long', quantity: 0.01, entryPrice: 80000, exitPrice: 80000 + netPnl * 100, openedAt: now - (i + 30) * 3_600_000, closedAt: now - (i + 28) * 3_600_000, grossPnl: netPnl + 1, fees: 1, funding: 0, netPnl, returnPct: netPnl / 800, exitReason: 'manual', ...extra });
const SEED = {
  'tradeschool.account': {
    state: {
      accounts: {
        main: { id: 'main', startingBalance: 10000, cash: 10035, positions: [], orders: [], trades: [trade(1, 40, { initialRisk: 20, rMultiple: 2, stopLoss: 78000, takeProfit: 84000 }), trade(2, -25), trade(3, 20), trade(4, -60, { kind: 'perpetual', leverage: 10, exitReason: 'liquidation' })], ledger: [], equityHistory: [{ time: now - 90_000_000, equity: 10000 }, { time: now - 80_000_000, equity: 10035 }], createdAt: now - 100_000_000, resetCount: 0 },
        replay: { id: 'replay', startingBalance: 10000, cash: 10000, positions: [], orders: [], trades: [], ledger: [], equityHistory: [], createdAt: now, resetCount: 0 },
      },
    },
    version: 1,
  },
  'tradeschool.journal': { state: { notes: { p1: { reasoning: 'Breakout', review: '', setup: 'Breakout', emotion: 'calm', updatedAt: now }, p2: { reasoning: '', review: '', setup: 'Pullback', emotion: 'fomo', updatedAt: now } } }, version: 1 },
  'tradeschool.progress': { state: { lessons: {}, activeDays: [], challengeDays: [], cards: { 'pattern:hammer': { id: 'pattern:hammer', kind: 'pattern', refId: 'hammer', ease: 2.5, intervalDays: 1, repetitions: 1, lapses: 0, dueAt: now, attempts: 6, correct: 2 } } }, version: 2 },
};

const browser = await chromium.launch();
const problems = [];
let audited = 0;

for (const [device, viewport, extra] of [
  ['desktop', { width: 1440, height: 900 }, {}],
  ['phone', { width: 390, height: 844 }, { isMobile: true, hasTouch: true }],
]) {
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport, ...extra });
    await context.addInitScript(
      ([seed, t]) => {
        for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, JSON.stringify(value));
        localStorage.setItem('tradeschool.settings', JSON.stringify({ state: { theme: t }, version: 1 }));
      },
      [SEED, theme],
    );
    const page = await context.newPage();
    for (const screen of SCREENS) {
      if (screen.desktopOnly && device !== 'desktop') continue;
      await page.goto(BASE + screen.path, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(screen.wait ?? 400);
      if (screen.prepare) {
        await screen.prepare(page);
        await page.waitForTimeout(300);
      }
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      audited++;
      for (const v of violations) {
        for (const node of v.nodes) {
          problems.push({ where: `${screen.name} [${device}/${theme}]`, rule: v.id, impact: v.impact, help: v.help, target: node.target.join(' '), detail: (node.any[0]?.message ?? node.failureSummary ?? '').replace(/\s+/g, ' ').slice(0, 160), html: node.html.replace(/\s+/g, ' ').slice(0, 140) });
        }
      }
    }

    // Keyboard: tabbing from the top of the page must show where focus is.
    if (device === 'desktop') {
      await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
      let invisible = 0;
      for (let i = 0; i < 25; i++) {
        await page.keyboard.press('Tab');
        const shown = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return true;
          const style = getComputedStyle(el);
          const ring = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
          const shadow = style.boxShadow !== 'none';
          // A control inside a styled wrapper may show focus on the wrapper.
          const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
          const parentRing = parent ? (parent.outlineStyle !== 'none' && parseFloat(parent.outlineWidth) > 0) || parent.boxShadow !== 'none' : false;
          return ring || shadow || parentRing || el.className.includes('sr-only') ? true : el.outerHTML.slice(0, 120);
        });
        if (shown !== true) {
          invisible++;
          problems.push({ where: `Settings keyboard [${theme}]`, rule: 'focus-visible', impact: 'serious', help: 'Focused element has no visible focus indicator', target: '', detail: '', html: String(shown) });
        }
      }
      void invisible;
    }
    await context.close();
  }
}
await browser.close();

console.log(`Audited ${audited} screen states (${SCREENS.length} screens, desktop and phone, dark and light) against WCAG 2.1 A and AA.`);
console.log(`Opened ${reached} dialogs and filled-in states${missed ? `; ${missed} could not be reached and were audited as they stood` : ''}.`);
if (missed) process.exitCode = 1;
if (problems.length === 0) {
  console.log('No violations found.');
} else {
  // The same element usually fails in several themes and sizes; group them.
  const groups = new Map();
  for (const p of problems) {
    const key = `${p.rule}|${p.html}`;
    const g = groups.get(key) ?? { ...p, places: new Set() };
    g.places.add(p.where);
    groups.set(key, g);
  }
  console.log(`\n${groups.size} distinct problem(s), ${problems.length} occurrences:\n`);
  for (const g of groups.values()) {
    console.log(`[${g.impact}] ${g.rule}: ${g.help}`);
    console.log(`   ${g.html}`);
    if (g.detail) console.log(`   ${g.detail}`);
    console.log(`   in: ${[...g.places].slice(0, 6).join('; ')}${g.places.size > 6 ? ` (+${g.places.size - 6} more)` : ''}\n`);
  }
  process.exitCode = 1;
}

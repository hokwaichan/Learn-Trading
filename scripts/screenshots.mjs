// Screenshots every route at desktop and phone width in both themes, and
// reports console errors and horizontal overflow.
//
//   npm run dev            (in another terminal)
//   npm run screenshots    [-- /settings /dev/components]
//
// Images go to .screenshots/ (git-ignored).
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const OUT = '.screenshots';

const ALL_ROUTES = [
  '/', '/learn', '/trainer', '/glossary', '/charts/BTCUSDT', '/futures/BTCUSDT', '/options/BTCUSDT',
  '/replay', '/backtest', '/journal', '/analytics', '/tools', '/settings', '/dev/components',
];
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ALL_ROUTES;

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 } };
const THEMES = ['dark', 'light'];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const [device, viewport] of Object.entries(VIEWPORTS)) {
  for (const theme of THEMES) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: device === 'phone' });
    await context.addInitScript((t) => {
      const saved = JSON.parse(localStorage.getItem('tradeschool.settings') ?? '{"state":{},"version":1}');
      saved.state.theme = t;
      localStorage.setItem('tradeschool.settings', JSON.stringify(saved));
    }, theme);
    const page = await context.newPage();
    // Requests to Binance can fail by region; the app handles that itself.
    const expected = (m) => /binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''));
    page.on('console', (m) => m.type() === 'error' && !expected(m) && problems.push(`[${device}/${theme}] console: ${m.text()}`));
    page.on('pageerror', (e) => problems.push(`[${device}/${theme}] pageerror: ${e.message}`));

    for (const route of routes) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(route.match(/charts|futures/) ? 1500 : 250);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) problems.push(`[${device}/${theme}] ${route}: page overflows horizontally by ${overflow}px`);
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '_');
      await page.screenshot({ path: `${OUT}/${name}.${device}.${theme}.png` });
    }
    await context.close();
  }
}

await browser.close();
console.log(`${routes.length} routes x ${Object.keys(VIEWPORTS).length} sizes x ${THEMES.length} themes -> ${OUT}/`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of [...new Set(problems)]) console.log(' -', p);
  process.exitCode = 1;
} else {
  console.log('No console errors and no horizontal overflow.');
}

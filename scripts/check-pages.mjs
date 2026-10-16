// Serves dist/ the way GitHub Pages does (under /Learn-Trading/, with 404.html
// for unknown paths) and checks the built site works there.
//   BASE_PATH=/Learn-Trading/ npm run build && cp dist/index.html dist/404.html
//   node scripts/check-pages.mjs
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const BASE = '/Learn-Trading/';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };

const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.startsWith(BASE) ? join('dist', path.slice(BASE.length)) : null;
  if (file && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    return res.end(readFileSync(file));
  }
  res.writeHead(404, { 'content-type': 'text/html' });
  res.end(readFileSync('dist/404.html'));
}).listen(4174);

const url = (p) => `http://localhost:4174${BASE}${p}`;
const results = [];
const check = (name, ok, detail = '') => {
  results.push(ok);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const failed = [];
page.on('response', (r) => r.status() >= 400 && r.url().includes('localhost') && !r.url().endsWith('/') && failed.push(`${r.status()} ${r.url()}`));

await page.goto(url(''), { waitUntil: 'networkidle' });
check('home loads under the sub-folder', await page.getByRole('heading', { level: 1, name: /Welcome/ }).isVisible());
await page.getByRole('link', { name: 'Lessons' }).first().click();
await page.waitForURL((u) => u.pathname.includes('/learn'), { timeout: 5000 }).catch(() => {});
check('in-app links keep the sub-folder', page.url().startsWith(url('learn')), page.url());

await page.goto(url('learn/smart-money/order-blocks'), { waitUntil: 'networkidle' });
check('a deep link to a lesson loads', await page.getByRole('heading', { level: 1, name: 'Order blocks' }).isVisible());

await page.goto(url('charts/AAPL'), { waitUntil: 'networkidle' });
await page.locator('canvas').first().waitFor({ timeout: 15000 }).catch(() => {});
check('bundled price data loads from the sub-folder', (await page.locator('canvas').count()) > 0 && !(await page.getByText('Could not load prices').isVisible()));

await page.goto(url('no-such-page'), { waitUntil: 'networkidle' });
check('an unknown path shows the app’s not-found page', await page.getByText(/not found|doesn.t exist|No page/i).first().isVisible());

// Document requests for app routes 404 on GitHub Pages by design (404.html serves the app); only site files must load.
const missing = failed.filter((f) => /\.(js|css|svg|json|png|woff2?)$/.test(f));
check('no failed requests for site files', missing.length === 0, missing.slice(0, 3).join(' | '));
check('no page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
await browser.close();
server.close();
process.exitCode = results.every(Boolean) ? 0 : 1;

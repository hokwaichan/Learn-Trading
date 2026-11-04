// Smoke test for sync between devices, through the real Neon project. Two
// separate browser contexts stand in for a computer and a phone. It creates
// throwaway accounts, so it is not part of `npm run smoke` or CI.
// Needs the dev server and internet.
//   npm run smoke:sync
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const PASSWORD = 'smoke-test-password-1';

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
const seen = (locator, timeout = 20000) => locator.first().waitFor({ timeout }).then(() => true, () => false);

const progress = (lessons, activeDays) => ({
  state: { lessons, activeDays, challengeDays: [], cards: {}, moduleTests: {} },
  version: 2,
});

const browser = await chromium.launch();
const errors = [];

async function device(seed, viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript((data) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [key, value] of Object.entries(data)) localStorage.setItem(key, JSON.stringify(value));
  }, seed);
  const page = await context.newPage();
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (/binance|net::ERR_FAILED/.test(m.text() + (m.location().url ?? ''))) return;
    // The deliberate mistakes below (wrong password, used email, wrong code) are refused with these.
    if (/Failed to load resource: the server responded with a status of (400|401|422)/.test(m.text())) return;
    errors.push(m.text().slice(0, 200));
  });
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
  await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });
  return { context, page };
}

const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), key);

async function signIn(page, email, create) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: create ? 'Create an account' : 'Sign in', exact: true }).click();
  return seen(page.getByText(/Last synced/));
}

const email = `sync-smoke+${Date.now()}@example.com`;

// ── The computer: has read lesson one, uses the light theme ─────────────
const computer = await device({
  'tradeschool.progress': progress({ 'basics/what-markets-are': { completedAt: 1_700_000_000_000, bestScore: 0.6, attempts: 1 } }, ['2026-11-01']),
  'tradeschool.settings': { state: { locale: 'en', theme: 'light', colorBlind: false, feeRate: 0.001, slippagePct: 0.0005, riskFreeRate: 0.04, sidebarCollapsed: false }, version: 1 },
});
// A learner with progress is invited from Home to create an account.
await computer.page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
check('Home suggests an account once there is progress', await seen(computer.page.getByRole('heading', { name: 'Save your progress' })));
await computer.page.getByRole('link', { name: 'Create an account' }).click();
check('the suggestion opens the account form in Settings', (await seen(computer.page.getByLabel('Email'))) && computer.page.url().endsWith('/settings#sync'));
check('the email field is ready to type in', await computer.page.evaluate(() => document.activeElement?.id === 'sync-email'));
check('signed out, Settings offers an account with email and password', (await seen(computer.page.getByRole('heading', { name: 'Save your progress' }))) && (await computer.page.getByLabel('Password').isVisible()));
await computer.page.getByLabel('Email').fill('not-an-email');
await computer.page.getByRole('button', { name: 'Sign in', exact: true }).click();
check('a bad email is caught before anything is sent', await seen(computer.page.getByText('Enter an email address.'), 3000));
check('creating an account signs in and syncs', await signIn(computer.page, email, true));
check('it says who is signed in', await computer.page.getByText(`Signed in as ${email}.`).isVisible());
await computer.page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await computer.page.getByRole('heading', { level: 1 }).waitFor();
check('signed in, Home stops suggesting an account', !(await computer.page.getByRole('heading', { name: 'Save your progress' }).isVisible()));
await computer.page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded' });

// ── The phone: has done lesson two, a better quiz score on lesson one, dark theme ──
const phone = await device(
  {
    'tradeschool.progress': progress(
      {
        'basics/what-markets-are': { completedAt: 1_700_000_500_000, bestScore: 0.9, attempts: 2 },
        'basics/order-types': { completedAt: 1_700_001_000_000, attempts: 0 },
      },
      ['2026-11-02'],
    ),
    'tradeschool.settings': { state: { locale: 'en', theme: 'dark', colorBlind: false, feeRate: 0.001, slippagePct: 0.0005, riskFreeRate: 0.04, sidebarCollapsed: false }, version: 1 },
  },
  { width: 390, height: 844 },
);
check('phone: the sync card fits the screen', await phone.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
// Mistakes people make, with messages they can act on.
await phone.page.getByLabel('Email').fill(email);
await phone.page.getByLabel('Password').fill('wrong-password-0');
await phone.page.getByRole('button', { name: 'Sign in', exact: true }).click();
check('a wrong password says so and points to Forgot password', await seen(phone.page.getByText('That email and password do not match. Check them, or use Forgot password.')));
await phone.page.getByLabel('Password').fill(PASSWORD);
await phone.page.getByRole('button', { name: 'Create an account', exact: true }).click();
check('creating a second account with the same email says to sign in instead', await seen(phone.page.getByText('There is already an account with that email. Sign in instead.')));

await phone.page.getByRole('button', { name: 'Forgot password?' }).click();
await phone.page.getByRole('button', { name: 'Send code' }).click();
check('Forgot password sends a code to the email', await seen(phone.page.getByLabel('Code from the email')));
await phone.page.getByLabel('Code from the email').fill('000000');
await phone.page.getByLabel('New password').fill('another-password-2');
await phone.page.getByRole('button', { name: 'Set new password' }).click();
check('a wrong code is refused with a clear message', await seen(phone.page.getByText('That code is not right. Check the email and try again.')));
await phone.page.getByRole('button', { name: 'Back', exact: true }).click();
check('the phone signs in to the same account', await signIn(phone.page, email, false));
const phoneProgress = (await stored(phone.page, 'tradeschool.progress')).state;
check('the phone now has both lessons', Object.keys(phoneProgress.lessons).sort().join() === 'basics/order-types,basics/what-markets-are');
check('the better score and the earlier finish are both kept', phoneProgress.lessons['basics/what-markets-are'].bestScore === 0.9 && phoneProgress.lessons['basics/what-markets-are'].completedAt === 1_700_000_000_000);
check('study days from both devices are kept', phoneProgress.activeDays.join() === '2026-11-01,2026-11-02');
check('a new device adopts the synced settings', (await stored(phone.page, 'tradeschool.settings')).state.theme === 'light');
check('the screen updates without a reload', (await phone.page.evaluate(() => document.documentElement.dataset.theme)) === 'light');

// ── Back on the computer ───────────────────────────────────────────────
await computer.page.getByRole('button', { name: 'Sync now' }).click();
check('Sync now reports success', await seen(computer.page.getByText('Synced', { exact: true })));
const computerProgress = (await stored(computer.page, 'tradeschool.progress')).state;
check('the computer receives the phone’s lesson', 'basics/order-types' in computerProgress.lessons && computerProgress.lessons['basics/what-markets-are'].bestScore === 0.9);

// ── Someone else cannot see it ─────────────────────────────────────────
// ── Someone who does not want an account can hide the suggestion ───────
const casual = await device({ 'tradeschool.progress': progress({ 'basics/what-markets-are': { completedAt: 1_700_000_000_000, attempts: 0 } }, ['2026-11-01']) });
await casual.page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await seen(casual.page.getByRole('heading', { name: 'Save your progress' }));
await casual.page.getByRole('button', { name: 'Not now' }).click();
await casual.page.reload({ waitUntil: 'domcontentloaded' });
await casual.page.getByRole('heading', { level: 1 }).waitFor();
check('"Not now" hides the suggestion, and it stays hidden', !(await casual.page.getByRole('heading', { name: 'Save your progress' }).isVisible()));
await casual.context.close();

const stranger = await device({});
check('a different account signs in', await signIn(stranger.page, `sync-smoke-other+${Date.now()}@example.com`, true));
const strangerProgress = await stored(stranger.page, 'tradeschool.progress');
check('and gets none of the first account’s progress', !strangerProgress || !('basics/order-types' in (strangerProgress.state.lessons ?? {})));

// ── Clean up: delete the cloud copies, which also signs out ───────────
for (const { page } of [computer, stranger]) {
  await page.getByRole('button', { name: 'Delete cloud copy' }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete cloud copy' }).click();
  await seen(page.getByText('Cloud copy deleted'));
}
check('deleting the cloud copy signs out and keeps local data', (await seen(computer.page.getByLabel('Password'))) && 'basics/order-types' in (await stored(computer.page, 'tradeschool.progress')).state.lessons);
await computer.page.reload({ waitUntil: 'domcontentloaded' });
check('signed out stays signed out after a reload', await seen(computer.page.getByLabel('Password')));

await browser.close();
check('no console errors from the app', errors.length === 0, [...new Set(errors)].slice(0, 4).join(' | '));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exitCode = failed ? 1 : 0;

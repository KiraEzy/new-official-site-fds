/**
 * Recapture Plasmic Studio after the Homepage canvas has painted.
 * Run: npx tsx scripts/recapture-plasmic-studio.mjs
 */
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, '..', 'public', 'assets', 'focal-wcms', 'plasmic-studio.png');

const EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'plasmic-poc@local.test';
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'P@ssw0rd123';

const env = {
  ...process.env,
  HTTP_PROXY: '',
  HTTPS_PROXY: '',
  ALL_PROXY: '',
  http_proxy: '',
  https_proxy: '',
  all_proxy: '',
  NO_PROXY: '*',
  no_proxy: '*',
};

const browser = await chromium.launch({
  headless: false,
  env,
  args: ['--disable-dev-shm-usage', '--proxy-bypass-list=*'],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto('http://127.0.0.1:1338/admin/auth/login', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
if (page.url().includes('login')) {
  await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /log in|login|登入/i }).click();
  await page.waitForTimeout(2500);
}

await page.goto(
  'http://127.0.0.1:1338/admin/content-manager/single-types/api::official-home.official-home?plugins[i18n][locale]=en',
  { waitUntil: 'domcontentloaded' }
);
await page.waitForTimeout(1800);
await page.keyboard.press('Escape').catch(() => {});

const popupPromise = context.waitForEvent('page', { timeout: 45000 });
await page.getByRole('button', { name: /visual editor/i }).first().click();
const popup = await popupPromise;
await popup.waitForLoadState('domcontentloaded');
console.log('studio url', popup.url());

await popup.waitForTimeout(4000);
if ((await popup.getByText(/csrf failed|Bad Gateway/i).count()) > 0) {
  console.warn('CSRF/502 toast — wait and reload');
  await popup.waitForTimeout(5000);
  await popup.reload({ waitUntil: 'domcontentloaded' });
  await popup.waitForTimeout(4000);
}

await popup.getByRole('button', { name: /Homepage/i }).waitFor({ timeout: 90000 });
await popup.waitForTimeout(10000);

const title = await popup.title();
console.log('title', title);
await popup.screenshot({ path: dest, fullPage: false });
console.log('wrote', dest);
await browser.close();

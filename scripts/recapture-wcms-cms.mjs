import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, '..', 'public', 'assets', 'focal-wcms', 'cms-official-home.png');
const featuresDest = path.join(__dirname, '..', 'public', 'assets', 'focal-wcms', 'live-capture-features.png');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://127.0.0.1:1338/admin', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(800);
if (page.url().includes('login')) {
  await page.locator('input[name="email"], input[type="email"]').first().fill('plasmic-poc@local.test');
  await page.locator('input[name="password"], input[type="password"]').first().fill('P@ssw0rd123');
  await page.getByRole('button', { name: /log in|login|登入/i }).click();
  await page.waitForTimeout(2500);
}
await page.goto(
  'http://127.0.0.1:1338/admin/content-manager/single-types/api::official-home.official-home?plugins[i18n][locale]=en',
  { waitUntil: 'domcontentloaded' }
);
await page.waitForTimeout(1800);
for (const name of [/skip/i, /^next$/i, /got it/i]) {
  const btn = page.getByRole('button', { name });
  if (await btn.count()) {
    await btn.first().click().catch(() => {});
    await page.waitForTimeout(350);
  }
}
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(400);
await page.screenshot({ path: dest, fullPage: false });
console.log('rewrote', dest);

await page.goto('http://127.0.0.1:3040/en/p/capture', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const features = page.getByRole('button', { name: /features/i });
if (await features.count()) {
  await features.first().click();
  await page.waitForTimeout(700);
}
await page.screenshot({ path: featuresDest, fullPage: false });
console.log('wrote', featuresDest);

await browser.close();

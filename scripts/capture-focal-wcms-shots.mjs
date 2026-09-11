/**
 * Capture live product screenshots for the Focal WCMS promo page.
 * Run: npx tsx scripts/capture-focal-wcms-shots.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'assets', 'focal-wcms');
fs.mkdirSync(outDir, { recursive: true });

const STRAPI_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'plasmic-poc@local.test';
const STRAPI_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'P@ssw0rd123';

async function shot(page, url, file, waitMs = 1200) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(waitMs);
  const dest = path.join(outDir, file);
  await page.screenshot({ path: dest, fullPage: false });
  console.log('wrote', dest);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  await shot(page, 'http://127.0.0.1:3040/en/p/capture', 'live-capture.png', 1800);
  await shot(page, 'http://127.0.0.1:3040/en/p/homepage', 'live-homepage.png', 1800);
  await shot(page, 'http://127.0.0.1:3000/#capture', 'static-capture.png', 1500);

  try {
    await page.goto('http://127.0.0.1:1338/admin/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(800);
    const email = page.locator('input[name="email"], input[type="email"]').first();
    const password = page.locator('input[name="password"], input[type="password"]').first();
    if (await email.count()) {
      await email.fill(STRAPI_EMAIL);
      await password.fill(STRAPI_PASSWORD);
      await page.getByRole('button', { name: /log in|login|登入/i }).click();
      await page.waitForTimeout(2500);
    }
    await page.goto(
      'http://127.0.0.1:1338/admin/content-manager/single-types/api::official-home.official-home?plugins[i18n][locale]=en',
      { waitUntil: 'domcontentloaded', timeout: 30000 }
    );
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(outDir, 'cms-official-home.png'),
      fullPage: false,
    });
    console.log('wrote cms-official-home.png');
  } catch (err) {
    console.warn('Strapi screenshot skipped:', err instanceof Error ? err.message : err);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Capture Plasmic Studio + Strapi admin screens for the Focal WCMS promo page.
 * Run: npx tsx scripts/capture-focal-wcms-editors.mjs
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'assets', 'focal-wcms');
fs.mkdirSync(outDir, { recursive: true });

const EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'plasmic-poc@local.test';
const PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'P@ssw0rd123';

async function shot(page, dest, extra = {}) {
  await page.screenshot({ path: dest, fullPage: false, ...extra });
  console.log('wrote', dest);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:1338/admin/auth/login', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
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
  for (const name of [/skip/i, /^next$/i]) {
    const btn = page.getByRole('button', { name });
    if (await btn.count()) {
      await btn.first().click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  await page.keyboard.press('Escape').catch(() => {});

  const localeList = page.getByText('pageLocaleList').first();
  if (await localeList.count()) {
    await localeList.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
  }
  await shot(page, path.join(outDir, 'strapi-page-locales.png'));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await shot(page, path.join(outDir, 'strapi-official-home.png'));

  await page.goto(
    'http://127.0.0.1:1338/admin/content-manager/collection-types/api::official-page.official-page?plugins[i18n][locale]=en',
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForTimeout(1500);
  await shot(page, path.join(outDir, 'strapi-official-pages.png'));

  await page.goto(
    'http://127.0.0.1:1338/admin/content-manager/single-types/api::navigation.navigation?plugins[i18n][locale]=en',
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForTimeout(1500);
  await shot(page, path.join(outDir, 'strapi-navigation.png'));

  await page.goto(
    'http://127.0.0.1:1338/admin/content-manager/single-types/api::official-home.official-home?plugins[i18n][locale]=en',
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForTimeout(1500);

  let studioShot = false;
  try {
    const visual = page.getByRole('button', { name: /visual editor/i });
    if (await visual.count()) {
      const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
      await visual.first().click();
      const popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded', { timeout: 20000 });
      await popup.waitForTimeout(4000);
      const dest = path.join(outDir, 'plasmic-studio.png');
      await popup.screenshot({ path: dest, fullPage: false });
      console.log('wrote', dest, 'url=', popup.url());
      studioShot = !/\/login/.test(popup.url());
      await popup.close().catch(() => {});
    }
  } catch (err) {
    console.warn('Visual Editor popup failed:', err instanceof Error ? err.message : err);
  }

  if (!studioShot) {
    await page.goto('http://127.0.0.1:3040/plasmic-host', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });
    await page.waitForTimeout(2500);
    await shot(page, path.join(outDir, 'plasmic-host.png'));
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

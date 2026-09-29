import { test, expect } from '@playwright/test';

const origin = process.env.E2E_ORIGIN ?? 'http://localhost:3000';
const previewUrl = `${origin}/?hero=rings`;

test('rings hero renders the editorial pulse and links to contact', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(previewUrl);
  const hero = page.locator('[data-home-hero="rings"]');
  await expect(hero).toBeVisible();
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText(/Solutions That Fit\.\s*Systems That Connect\./);
  await expect(hero.locator('.rings-circle')).toHaveCount(5);
  await expect(hero.locator('.rings-cta')).toHaveText('Contact Us');
  await page.screenshot({ path: testInfo.outputPath('rings-desktop.png') });
  await hero.locator('.rings-cta').click();
  await expect(page).toHaveURL(/hero=rings#contact-us/);
  await expect(hero).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('rings pulse and freeze when reduced motion is requested', async ({ page }) => {
  const hero = page.locator('[data-home-hero="rings"]');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(previewUrl);
  await expect(hero).toHaveAttribute('data-motion', 'running');
  const first = hero.locator('.rings-circle').first();
  const initial = await first.evaluate(element => getComputedStyle(element).transform);
  await expect.poll(() => first.evaluate(element => getComputedStyle(element).transform)).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hero).toHaveAttribute('data-motion', 'static');
  expect(await first.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('demo controls can select the rings hero', async ({ page }) => {
  await page.goto(`${origin}/?hero=centered`);
  await expect(page.locator('[data-home-hero="centered"]')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle demo style controls' }).click();
  await page.getByLabel('Hero layout').selectOption('rings');
  await expect(page).toHaveURL(/hero=rings/);
  await expect(page.locator('[data-home-hero="rings"]')).toBeVisible();
});

test('rings hero does not overflow on a phone', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(previewUrl);
  await expect(page.locator('[data-home-hero="rings"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('rings-mobile.png') });
});

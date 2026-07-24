import { test, expect } from '@playwright/test';

test.describe('home interactive hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
  });

  test('renders interactive profile-style hero without soft-sky style attr', async ({ page }) => {
    const hero = page.locator('[data-home-hero="interactive"]');
    await expect(hero).toBeVisible();
    await expect(page.locator('[data-hero-style]')).toHaveCount(0);
    await expect(page.locator('#hero-swiper-pagination')).toHaveCount(0);
    await expect(page.getByText(/Est\. in Hong Kong 1993|創立於香港|创立于香港/i)).toBeVisible();
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(/Design to|設計以|设计以/);
    await expect(heading).toContainText(/Simplify|簡化|简化/);
    await expect(heading).toContainText(/Excellence\.|卓越。/);
    await expect(
      page.getByText(/Twenty years of technical excellence|二十年技術精進|二十年技术精进/)
    ).toBeVisible();
  });

  test('does not expose demo hero style switcher', async ({ page }) => {
    await page.getByRole('button', { name: /demo style controls|切換演示樣式控制台|切换演示样式控制台/i }).click();
    await expect(page.getByLabel(/hero visual style|主視覺外觀樣式|主视觉外观样式/i)).toHaveCount(0);
  });

  test('shows festival hero background and frost panel when festival bar is present', async ({ page }) => {
    const hero = page.locator('[data-home-hero="interactive"]');
    await expect(hero).toBeVisible();
    const bg = page.locator('[data-festival-bg="hero"]');
    await expect(bg).toBeVisible();
    await expect(bg).toHaveCSS('background-image', /dragon-boat-hero/);
    await expect(page.locator('[data-festival-frost="text"]')).toBeVisible();
  });

  test('removes festival hero background when festival bar is closed', async ({ page }) => {
    await expect(page.locator('[data-festival-bg="hero"]')).toBeVisible();
    await page.getByRole('button', { name: /Close announcement bar/i }).click();
    await expect(page.locator('[data-festival-bg="hero"]')).toHaveCount(0);
    await expect(page.locator('[data-festival-frost="text"]')).toHaveCount(0);
  });
});

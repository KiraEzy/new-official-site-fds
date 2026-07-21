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
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Design to|設計以|设计以/);
    await expect(page.getByText(/^Simplify$|^簡化$|^简化$/)).toBeVisible();
    await expect(page.getByText(/Excellence\.|卓越。/)).toBeVisible();
    await expect(
      page.getByText(/Engineering speed, reliability|為區內市場打造|为区内市场打造/)
    ).toBeVisible();
  });

  test('does not expose demo hero style switcher', async ({ page }) => {
    await page.getByRole('button', { name: /demo style controls|切換演示樣式控制台|切换演示样式控制台/i }).click();
    await expect(page.getByLabel(/hero visual style|主視覺外觀樣式|主视觉外观样式/i)).toHaveCount(0);
  });
});

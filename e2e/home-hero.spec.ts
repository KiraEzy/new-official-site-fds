import { test, expect } from '@playwright/test';

test.describe('home soft-sky hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
  });

  test('renders centered light hero without swiper pagination', async ({ page }) => {
    const hero = page.locator('[data-hero-style]');
    await expect(hero).toBeVisible();
    await expect(hero).toHaveAttribute('data-hero-style', 'softSky');
    await expect(page.locator('#hero-swiper-pagination')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Design to Simplify');
    await expect(page.getByText(/Twenty years of technical excellence/i)).toBeVisible();
    await expect(page.getByText(/HKSAR Government/i)).toBeVisible();
  });

  test('demo hero style switch updates data attribute', async ({ page }) => {
    await page.getByRole('button', { name: /demo style controls|切換演示樣式控制台|切换演示样式控制台/i }).click();
    await page.getByLabel(/hero visual style|主視覺外觀樣式|主视觉外观样式/i).selectOption('skyGrid');
    await expect(page.locator('[data-hero-style]')).toHaveAttribute('data-hero-style', 'skyGrid');
  });

  test('demo can select ripple lattice hero', async ({ page }) => {
    await page.getByRole('button', { name: /demo style controls|切換演示樣式控制台|切换演示样式控制台/i }).click();
    await page.getByLabel(/hero visual style|主視覺外觀樣式|主视觉外观样式/i).selectOption('skyRipple');
    await expect(page.locator('[data-hero-style]')).toHaveAttribute('data-hero-style', 'skyRipple');
    await expect(page.locator('[data-hero-lattice-mode="ripple"]')).toBeVisible();
  });
});

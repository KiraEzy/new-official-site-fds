import { test, expect } from '@playwright/test';

test.describe('home editorial hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders editorial hero without swiper pagination or in-hero CTA', async ({ page }) => {
    const hero = page.locator('[data-home-hero="editorial"]');
    await expect(hero).toBeVisible();
    await expect(page.locator('#hero-swiper-pagination')).toHaveCount(0);
    await expect(hero.getByRole('heading', { level: 1 })).toContainText('Design to Simplify');
    await expect(hero.getByText(/Twenty years/i)).toBeVisible();
    await expect(hero.getByText(/HKSAR/i)).toBeVisible();
    await expect(hero.getByRole('button', { name: /see more/i })).toHaveCount(0);
  });
});

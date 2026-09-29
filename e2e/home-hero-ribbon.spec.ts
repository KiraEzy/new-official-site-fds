import { test, expect } from '@playwright/test';

const previewUrl = 'http://localhost:3000/?hero=ribbon';

test('hero text stays ink off the ribbon and tints only where it overlaps artwork', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1131, height: 627 });
  await page.goto(previewUrl);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const position of [{ x: 1000, y: 220 }, { x: 250, y: 420 }]) {
    await page.mouse.move(position.x, position.y);
    const result = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>('.ribbon-copy > .ribbon-content .ribbon-title')!;
      const lead = document.querySelector<HTMLElement>('.ribbon-copy > .ribbon-content .ribbon-lead')!;
      const burnTitle = document.querySelector<HTMLElement>('.ribbon-blend-group .ribbon-title')!;
      const burnLead = document.querySelector<HTMLElement>('.ribbon-blend-group .ribbon-lead')!;
      const group = document.querySelector<HTMLElement>('.ribbon-blend-group')!;
      const layer = document.querySelector<HTMLElement>('.ribbon-cursor-layer')!;
      const bounds = title.getBoundingClientRect();
      const hit = document.elementFromPoint(Math.min(bounds.left + 24, bounds.right - 45), bounds.top + 18);
      const textStyle = (el: HTMLElement) => {
        const style = getComputedStyle(el);
        return { blend: style.mixBlendMode, gradient: style.backgroundImage, clip: style.backgroundClip };
      };
      return {
        hitTitle: hit === title || title.contains(hit),
        aligned: Math.abs(title.getBoundingClientRect().top - burnTitle.getBoundingClientRect().top) < 1
          && Math.abs(lead.getBoundingClientRect().top - burnLead.getBoundingClientRect().top) < 1,
        groupBlend: getComputedStyle(group).mixBlendMode,
        artworkBlend: getComputedStyle(layer).mixBlendMode,
        title: textStyle(title),
        lead: textStyle(lead),
        burnTitle: textStyle(burnTitle),
        burnLead: textStyle(burnLead)
      };
    });
    expect(result.hitTitle).toBe(true);
    expect(result.aligned).toBe(true);
    expect(['multiply', 'plus-darker']).toContain(result.groupBlend);
    expect(result.artworkBlend).toBe('normal');
    for (const text of [result.title, result.lead]) {
      expect(text.blend).toBe('normal');
      expect(text.gradient).toBe('none');
      expect(text.clip).not.toBe('text');
    }
    expect(result.burnTitle.blend).toBe('color-burn');
    expect(result.burnLead.blend).toBe('color-burn');
  }
  await page.screenshot({ path: testInfo.outputPath('ribbon-text-blend-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath('ribbon-text-blend-mobile.png') });
});

test('ribbon artwork follows the mouse with a springy offset', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1131, height: 800 });
  await page.goto(previewUrl);
  const layer = page.locator('.ribbon-cursor-layer');
  const initial = await layer.evaluate(element => getComputedStyle(element).transform);
  await page.mouse.move(1050, 180);
  await expect.poll(() => layer.evaluate(element => getComputedStyle(element).transform)).not.toBe(initial);
  const moved = await layer.evaluate(element => getComputedStyle(element).transform);
  await page.mouse.move(565, 400);
  await expect.poll(() => layer.evaluate(element => getComputedStyle(element).transform)).not.toBe(moved);
  await expect.poll(() => layer.evaluate(element => {
    const transform = getComputedStyle(element).transform;
    if (transform === 'none') return true;
    const values = transform.match(/matrix(?:3d)?\(([^)]+)\)/)?.[1].split(',').map(Number);
    if (!values) return false;
    const x = transform.startsWith('matrix3d') ? values[12] : values[4];
    const y = transform.startsWith('matrix3d') ? values[13] : values[5];
    return Math.abs(x) < 1 && Math.abs(y) < 1;
  })).toBe(true);
});

test('live controls update both effects, persist, and reset', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1131, height: 800 });
  await page.goto(previewUrl);
  const trigger = page.getByRole('button', { name: 'Ribbon controls', exact: true });
  await trigger.click();
  const panel = page.getByRole('region', { name: 'Ribbon controls' });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('slider')).toHaveCount(7);
  const approvedDefaults = {
    'Movement strength': '1.2', 'Ribbon speed': '1.2', 'Flow speed': '3',
    'Line visibility': '0.15', 'Line thickness': '1.5', 'Line density': '27', 'Streak length': '120',
  };
  for (const [name, value] of Object.entries(approvedDefaults)) {
    await expect(panel.getByRole('slider', { name, exact: true })).toHaveValue(value);
  }
  await page.screenshot({ path: testInfo.outputPath('ribbon-controls-desktop.png') });
  await panel.getByRole('slider', { name: 'Movement strength' }).press('Home');
  await expect(panel.getByRole('slider', { name: 'Movement strength' })).toHaveValue('0');
  expect(await page.locator('.ribbon-art').evaluate(element => getComputedStyle(element).getPropertyValue('--ribbon-front-x'))).toBe('0px');
  await panel.getByRole('slider', { name: 'Ribbon speed', exact: true }).press('End');
  expect(Number.parseFloat(await page.locator('.ribbon-layer-front').evaluate(element => getComputedStyle(element).animationDuration))).toBeCloseTo(13 / 3, 3);
  await panel.getByRole('slider', { name: 'Flow speed' }).press('End');
  const current = page.locator('.ribbon-layer-front .ribbon-current').first();
  expect(await current.evaluate(element => getComputedStyle(element).animationDuration)).toBe('9.5s');
  await panel.getByRole('slider', { name: 'Line visibility' }).press('End');
  expect(await current.evaluate(element => getComputedStyle(element).strokeOpacity)).toBe('1');
  await panel.getByRole('slider', { name: 'Line thickness' }).press('End');
  expect(await current.evaluate(element => getComputedStyle(element).strokeWidth)).toBe('2px');
  await panel.getByRole('slider', { name: 'Line density' }).press('End');
  await expect(page.locator('.ribbon-layer-front .ribbon-current')).toHaveCount(28);
  await panel.getByRole('slider', { name: 'Streak length' }).press('Home');
  expect(await current.evaluate(element => getComputedStyle(element).strokeDasharray)).toBe('40px, 460px');
  await page.reload();
  await trigger.click();
  await expect(panel.getByRole('slider', { name: 'Line density' })).toHaveValue('28');
  await expect(panel.getByRole('slider', { name: 'Movement strength' })).toHaveValue('0');
  await expect(panel.getByRole('slider', { name: 'Streak length' })).toHaveValue('40');
  await panel.getByRole('button', { name: 'Reset to defaults' }).click();
  for (const [name, value] of Object.entries(approvedDefaults)) {
    await expect(panel.getByRole('slider', { name, exact: true })).toHaveValue(value);
  }
  await expect(page.locator('.ribbon-layer-front .ribbon-current')).toHaveCount(27);
  await panel.getByRole('slider', { name: 'Line visibility' }).press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.reload();
  await trigger.click();
  await expect(panel.getByRole('slider', { name: 'Movement strength' })).toHaveValue('1.2');
});

test('controls fit a small screen and scrolling them keeps the hero visible', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto(previewUrl);
  await page.getByRole('button', { name: 'Ribbon controls', exact: true }).click();
  const panel = page.getByRole('region', { name: 'Ribbon controls' });
  const bounds = await panel.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  await page.screenshot({ path: testInfo.outputPath('ribbon-controls-mobile.png') });
  await panel.hover();
  await page.mouse.wheel(0, 350);
  await expect.poll(() => panel.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await panel.getByRole('button', { name: 'Reset to defaults' }).click();
  await page.getByRole('button', { name: 'Ribbon controls', exact: true }).click();
  await expect(panel).toHaveCount(0);
});

test('ribbon moves, pauses, and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(previewUrl);
  const artwork = page.locator('.ribbon-art');
  const front = artwork.locator('.ribbon-layer-front').first();
  const current = front.locator('.ribbon-current').first();
  const alignment = await front.evaluate(group => {
    const fill = group.querySelector<SVGPathElement>('path[fill="url(#ribbon-face)"]')!;
    const lines = [...group.querySelectorAll<SVGPathElement>('.ribbon-current')];
    let outside = 0;
    for (const line of lines) {
      const length = line.getTotalLength();
      for (let sample = 1; sample < 40; sample++) {
        if (!fill.isPointInFill(line.getPointAtLength(length * sample / 40))) outside++;
      }
    }
    const gaps = [180, 300, 440, 600].flatMap(y => {
      const positions = lines.map(line => {
        let low = 0;
        let high = line.getTotalLength();
        for (let step = 0; step < 20; step++) {
          const middle = (low + high) / 2;
          if (line.getPointAtLength(middle).y < y) low = middle;
          else high = middle;
        }
        return line.getPointAtLength((low + high) / 2).x;
      }).sort((a, b) => a - b);
      return positions.slice(1).map((x, index) => x - positions[index]);
    });
    return { outside, spacingPerDensity: Math.min(...gaps) * lines.length };
  });
  expect(alignment.outside).toBe(0);
  // Normalize spacing for the configurable line count (the approved preset uses 27).
  expect(alignment.spacingPerDensity).toBeGreaterThan(36);
  await expect(artwork).toHaveAttribute('data-motion', 'running');
  const initialTransform = await front.evaluate(element => getComputedStyle(element).transform);
  await expect.poll(() => front.evaluate(element => getComputedStyle(element).transform)).not.toBe(initialTransform);
  const initialOffset = await current.evaluate(element => getComputedStyle(element).strokeDashoffset);
  await expect.poll(() => current.evaluate(element => getComputedStyle(element).strokeDashoffset)).not.toBe(initialOffset);
  await page.getByRole('button', { name: 'Pause ribbon animation' }).click();
  await expect(artwork).toHaveAttribute('data-motion', 'paused');
  const pausedTransform = await front.evaluate(element => getComputedStyle(element).transform);
  const pausedOffset = await current.evaluate(element => getComputedStyle(element).strokeDashoffset);
  await page.waitForTimeout(300);
  expect(await front.evaluate(element => getComputedStyle(element).transform)).toBe(pausedTransform);
  expect(await current.evaluate(element => getComputedStyle(element).strokeDashoffset)).toBe(pausedOffset);
  await page.getByRole('button', { name: 'Play ribbon animation' }).click();
  await expect(artwork).toHaveAttribute('data-motion', 'running');
  await expect.poll(() => front.evaluate(element => getComputedStyle(element).transform)).not.toBe(pausedTransform);
  await expect.poll(() => current.evaluate(element => getComputedStyle(element).strokeDashoffset)).not.toBe(pausedOffset);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(artwork).toHaveAttribute('data-motion', 'static');
  expect(await front.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await current.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.getByRole('button', { name: 'Pause ribbon animation' })).toHaveCount(0);
});

test('ribbon preview renders and links to existing homepage content', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1131, height: 627 });
  await page.goto(previewUrl);
  const hero = page.locator('[data-home-hero="ribbon"]');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Solutions That Fit. Systems That Connect.');
  await expect(hero).toHaveAttribute('data-ribbon-strip', 'credentials');
  await expect(hero.getByRole('list', { name: 'FDS credentials' })).toBeVisible();
  await expect(hero.getByText('SOA-QPS5', { exact: true })).toBeVisible();
  await expect(hero.getByRole('img', { name: 'RTHK', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Close announcement bar' })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('ribbon-desktop.png') });
  await expect(hero.locator('.ribbon-hero-nav').getByRole('button', { name: 'Language', exact: true })).toBeVisible();
  await hero.locator('.ribbon-hero-nav').getByRole('button', { name: 'Solutions', exact: true }).hover();
  await expect(hero.getByRole('link', { name: 'Focal AI', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await hero.getByRole('button', { name: 'Explore Our Solutions' }).click();
  await expect(page.locator('#what-we-build')).toBeInViewport();
  await expect(hero.locator('.ribbon-art')).toHaveAttribute('data-motion', 'paused');
  await page.goto(previewUrl);
  await hero.locator('.ribbon-hero-nav').getByRole('link', { name: 'Contact Us', exact: true }).click();
  await expect(page).toHaveURL(/hero=ribbon#contact-us/);
  await expect(hero).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('ribbon mobile menu works without horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(previewUrl);
  await expect(page.locator('[data-home-hero="ribbon"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('ribbon-mobile.png') });
  await page.locator('.ribbon-hero-nav button').filter({ has: page.locator('svg.lucide-menu') }).click();
  await page.locator('.fixed a[href="#services"]:visible').click();
  await expect(page).toHaveURL(/#services/);
  await expect(page.locator('[data-home-hero="ribbon"]')).toHaveCount(0);
  await page.goto('http://localhost:3000/');
  await expect(page.locator('[data-home-hero="centered"]')).toBeVisible();
});

test('ribbon bottom strip follows the preview URL', async ({ page }) => {
  const hero = page.locator('[data-home-hero="ribbon"]');

  await page.goto(`${previewUrl}&strip=products`);
  await expect(hero).toHaveAttribute('data-ribbon-strip', 'products');
  const products = hero.getByRole('navigation', { name: 'FDS products' });
  await expect(products.getByRole('link', { name: 'Capture', exact: true })).toBeVisible();
  await expect(products.getByRole('link', { name: 'Focal AI', exact: true })).toBeVisible();
  await expect(hero.getByRole('img', { name: 'RTHK', exact: true })).toHaveCount(0);

  await page.goto(`${previewUrl}&strip=partners`);
  await expect(hero).toHaveAttribute('data-ribbon-strip', 'partners');
  const partners = hero.getByRole('list', { name: 'Technology partners' });
  for (const name of ['IBM', 'Qmatic', 'Bricsys', 'Chapoo']) {
    const logo = partners.getByRole('img', { name, exact: true });
    await expect(logo).toBeVisible();
    await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }

  await page.goto(`${previewUrl}&strip=none`);
  await expect(hero).toHaveAttribute('data-ribbon-strip', 'none');
  await expect(hero.getByRole('list')).toHaveCount(0);
  await expect(hero.getByRole('navigation', { name: 'FDS products' })).toHaveCount(0);
});

test('ribbon bottom strips span the hero and products retain their marks on mobile', async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const mode of ['credentials', 'partners', 'products']) {
      await page.goto(`${previewUrl}&strip=${mode}`);
      const hero = page.locator('[data-home-hero="ribbon"]');
      const strip = hero.locator('.ribbon-strip');
      await expect(strip).toBeVisible();
      const heroBox = (await hero.boundingBox())!;
      const stripBox = (await strip.boundingBox())!;
      expect(stripBox.x).toBeCloseTo(heroBox.x, 0);
      expect(stripBox.width).toBeCloseTo(heroBox.width, 0);
      expect(stripBox.y + stripBox.height).toBeCloseTo(heroBox.y + heroBox.height, 0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (mode === 'products') {
        await expect(strip.locator('a svg')).toHaveCount(5);
        await strip.evaluate(element => { element.scrollLeft = element.scrollWidth; });
        await expect(strip.getByRole('link').last()).toBeInViewport();
      }
      await page.screenshot({ path: testInfo.outputPath(`strip-${mode}-${width}.png`) });
    }
  }
});

test('demo controls persist the ribbon strip in the URL', async ({ page }) => {
  await page.goto(previewUrl);
  await page.getByRole('button', { name: 'Toggle demo style controls' }).click();
  await page.getByLabel('Ribbon bottom strip').selectOption('none');
  await expect(page).toHaveURL(/strip=none/);
  await expect(page.locator('[data-home-hero="ribbon"]')).toHaveAttribute('data-ribbon-strip', 'none');
});

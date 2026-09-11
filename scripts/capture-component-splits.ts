/**
 * Capture another-new-hero home page and crop proposed Plasmic section components.
 * Run: npx tsx scripts/capture-component-splits.ts
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
  'd:/Users/CharlesWong/FocalCMS/docs/plasmic-component-splits/another-new-hero-home'
);
const BASE = process.env.SITE_URL || 'http://127.0.0.1:3055/';
const VIEWPORT = { width: 1440, height: 900 };

type Split = {
  file: string;
  label: string;
  /** CSS selector for element to crop; if missing, use y0/y1 full-width slice */
  selector?: string;
  /** Prefer first match that is a section/main landmark */
  preferSection?: boolean;
};

const SPLITS: Split[] = [
  { file: '01-festival-bar', label: 'Festival / announcement bar (optional)', selector: '[aria-label="Close announcement bar"]' },
  { file: '02-navbar', label: 'Navbar (global chrome)', selector: 'nav, header' },
  { file: '03-home-hero', label: 'HomeHero', selector: 'main > section:first-of-type, [data-home-hero], main section' },
  { file: '04-latest-news', label: 'Latest News', selector: '#latest-news' },
  { file: '05-bento-solutions', label: 'What we build (bento)', selector: '#what-we-build' },
  { file: '06-all-about-fds', label: 'All About FDS (stats)', selector: 'section:has(h2)' },
  { file: '07-get-in-touch', label: 'Get In Touch', selector: 'section:has(form), [id*="contact"], section:has(h2)' },
  { file: '08-footer', label: 'Footer', selector: 'footer' },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 });
  // Let hero / motion settle
  await page.waitForTimeout(2500);

  // Full page reference
  const fullPath = path.join(OUT, '00-full-home.png');
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log('wrote', fullPath);

  // Discover section structure (string eval avoids tsx __name inject into browser)
  const sections = (await page.evaluate(`(() => {
    const nodes = [];
    function pick(el) {
      const r = el.getBoundingClientRect();
      nodes.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        className: (el.className && el.className.toString ? el.className.toString().slice(0, 80) : '') || '',
        top: r.top + window.scrollY,
        height: r.height,
        text: (el.innerText || '').slice(0, 80).replace(/\\s+/g, ' '),
      });
    }
    const main = document.querySelector('main');
    if (main) Array.from(main.children).forEach(pick);
    const footer = document.querySelector('footer');
    if (footer) pick(footer);
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (nav) pick(nav);
    return nodes;
  })()`)) as Array<{
    tag: string;
    id: string;
    className: string;
    top: number;
    height: number;
    text: string;
  }>;
  fs.writeFileSync(path.join(OUT, 'section-map.json'), JSON.stringify(sections, null, 2));
  console.log('sections', sections.length);

  const crops: Array<{ file: string; label: string; top: number; height: number; note?: string }> = [];

  // Navbar: fixed/sticky — capture viewport top strip
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, '02-navbar.png'),
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: 120 },
  });
  crops.push({ file: '02-navbar.png', label: 'Navbar', top: 0, height: 120 });

  // Festival bar if visible (above nav)
  const festival = await page.locator('text=Close announcement').count().catch(() => 0);
  if (festival > 0) {
    await page.screenshot({
      path: path.join(OUT, '01-festival-bar.png'),
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: 56 },
    });
    crops.push({ file: '01-festival-bar.png', label: 'Festival bar', top: 0, height: 56 });
  } else {
    // placeholder note
    fs.writeFileSync(
      path.join(OUT, '01-festival-bar.txt'),
      'Festival bar not visible in this session (dismissed or off). Treat as optional chrome component.'
    );
  }

  // Helper: screenshot element by scrolling into view
  async function shotSelector(file: string, selector: string, label: string) {
    const loc = page.locator(selector).first();
    if ((await loc.count()) === 0) {
      console.warn('missing', selector);
      return;
    }
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const box = await loc.boundingBox();
    if (!box || box.height < 40) {
      console.warn('tiny box', selector, box);
      return;
    }
    // Cap extremely tall sections for review (still capture full via element screenshot)
    const out = path.join(OUT, `${file}.png`);
    await loc.screenshot({ path: out });
    crops.push({ file: `${file}.png`, label, top: box.y + (await page.evaluate(() => window.scrollY)), height: box.height });
    console.log('wrote', out, Math.round(box.width), 'x', Math.round(box.height));
  }

  // Home hero = first section in main (HomeHero root)
  const firstSection = page.locator('main > section').first();
  if ((await firstSection.count()) > 0) {
    await firstSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await firstSection.screenshot({ path: path.join(OUT, '03-home-hero.png') });
    const box = await firstSection.boundingBox();
    crops.push({
      file: '03-home-hero.png',
      label: 'HomeHero',
      top: box?.y ?? 0,
      height: box?.height ?? 0,
    });
    console.log('wrote 03-home-hero.png');
  }

  await shotSelector('04-latest-news', '#latest-news', 'Latest News');
  await shotSelector('05-bento-solutions', '#what-we-build', 'Bento / What we build');

  // All About FDS — section after #what-we-build that is not get-in-touch
  // Prefer section containing "All About" / FDS eyebrow text from DOM order:
  const aboutIdx = (await page.evaluate(`(() => {
    const secs = Array.from(document.querySelectorAll('main > section'));
    return secs.findIndex((s) =>
      /all about|fds|years/i.test((s.innerText || '').slice(0, 400)) &&
      s.id !== 'what-we-build' &&
      s.id !== 'latest-news'
    );
  })()`)) as number;
  if (aboutIdx >= 0) {
    const about = page.locator('main > section').nth(aboutIdx);
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await about.screenshot({ path: path.join(OUT, '06-all-about-fds.png') });
    console.log('wrote 06-all-about-fds.png idx', aboutIdx);
  }

  // Get in touch — last substantial section before footer, or component root
  const git = page.locator('main > section').last();
  // Better: find by form or "Get in touch" text
  const gitByText = page.locator('main section').filter({ hasText: /get in touch|contact/i }).last();
  if ((await gitByText.count()) > 0) {
    await gitByText.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await gitByText.screenshot({ path: path.join(OUT, '07-get-in-touch.png') });
    console.log('wrote 07-get-in-touch.png');
  } else if ((await git.count()) > 0) {
    await git.screenshot({ path: path.join(OUT, '07-get-in-touch.png') });
  }

  const footer = page.locator('footer').first();
  if ((await footer.count()) > 0) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await footer.screenshot({ path: path.join(OUT, '08-footer.png') });
    console.log('wrote 08-footer.png');
  }

  // Manifest index
  const md = [
    '# another-new-hero — proposed home component splits',
    '',
    `Source: \`${BASE}\` (Vite worktree \`another-new-hero\`)`,
    `Viewport: ${VIEWPORT.width}×${VIEWPORT.height}`,
    `Captured: ${new Date().toISOString()}`,
    '',
    'Please confirm whether these splits match how you want Plasmic / Strapi sections modeled.',
    '',
    '| # | File | Proposed component |',
    '| --- | --- | --- |',
    '| 00 | `00-full-home.png` | Full page reference |',
    '| 01 | `01-festival-bar.png` / `.txt` | FestivalBar (optional chrome) |',
    '| 02 | `02-navbar.png` | Navbar (global) |',
    '| 03 | `03-home-hero.png` | HomeHero |',
    '| 04 | `04-latest-news.png` | LatestNews / NewsGrid |',
    '| 05 | `05-bento-solutions.png` | SolutionsBento (`#what-we-build`) |',
    '| 06 | `06-all-about-fds.png` | AllAboutFds / Stats |',
    '| 07 | `07-get-in-touch.png` | GetInTouch |',
    '| 08 | `08-footer.png` | Footer (global) |',
    '',
    '## Notes',
    '',
    '- **Navbar / Footer** are usually site chrome (shared across pages), not per-page Plasmic blocks.',
    '- **HomeHero** already exists as `src/components/HomeHero.tsx`.',
    '- **Latest News** and **Bento** are strong Strapi-driven candidates (cards / CTAs).',
    '- Org logo marquee is disabled in source — not captured as a primary split.',
    '- See `section-map.json` for measured DOM sections.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'README.md'), md);
  console.log('done →', OUT);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

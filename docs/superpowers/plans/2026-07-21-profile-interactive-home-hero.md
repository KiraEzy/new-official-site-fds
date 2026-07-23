# Profile Interactive Home Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home soft-sky/p5 hero with the Profile interactive spotlight hero (badge + “Design to” + Simplify/Excellence mouse spotlight + subtitle + CTA), and leave Profile without that hero.

**Architecture:** Extract `HeroSimplifyAndExcellenceSpot` into its own component (reads `home` i18n). Rewrite `HomeHero` as a full-viewport light surface that composes badge, design-to line, spotlight, subtitle, CTA, scroll hint, and nav portal. Slim `App.tsx` so it no longer drives hero styles/slides/hexagon tuning. Delete unused p5/style helpers and update e2e + type assert scripts.

**Tech Stack:** React 19, TypeScript, Motion (`motion/react`), existing i18n catalogs (`home` / `demo`), Playwright e2e, `tsc --noEmit` lint.

## Global Constraints

- Work only in worktree `c:\Users\charleswong\Documents\new-official-page\.worktrees\profile-hero` on branch `profile-hero`.
- Full swap only — no soft-sky / p5 alternate styles remain on home.
- Profile page must not regain the interactive hero (empty hero section stays).
- Spotlight knockout must match home hero surface (`bg-text/3` + same `color-mix` formula as the old Profile hero).
- Keep CTA → bento scroll, scroll hint, and `heroNavPortalRef` behavior.
- Spec: `docs/superpowers/specs/2026-07-21-profile-interactive-home-hero-design.md`.

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/HeroSimplifyAndExcellenceSpot.tsx` | **Create** — mouse-follow spotlight for simplify/excellence words; props: `simplifyWord`, `excellenceWord` (or read from `home` via `useI18n`) |
| `src/components/HomeHero.tsx` | **Rewrite** — full-viewport interactive home hero chrome |
| `src/components/homeHeroTypes.ts` | **Delete or gut** — remove `HeroStyle` / `getHeroLead` / hexagon tuning once unused |
| `src/components/HomeHeroP5Sky.tsx` | **Delete** |
| `src/components/HomeHeroP5Hexagons.tsx` | **Delete** |
| `src/App.tsx` | **Modify** — simpler `HomeHero` props; remove hero style/copy/hexagon state + demo controls |
| `src/i18n/locales/{en,zh-Hant,zh-Hans}/home.json` | **Modify** — add interactive hero keys; drop unused slide/style-driven headline keys |
| `src/i18n/locales/{en,zh-Hant,zh-Hans}/demo.json` | **Modify** — remove hero style / hexagon / hero copy control strings |
| `src/components/ProfilePage.tsx` | **No change required** — already empty hero |
| `e2e/home-hero.spec.ts` | **Rewrite** — assert interactive home hero, not softSky |
| `scripts/assert-home-hero-types.mts` | **Rewrite or delete** — stop asserting old `HERO_STYLES` |

---

### Task 1: Home i18n keys for interactive hero

**Files:**
- Modify: `src/i18n/locales/en/home.json`
- Modify: `src/i18n/locales/zh-Hant/home.json`
- Modify: `src/i18n/locales/zh-Hans/home.json`
- Test: `scripts/assert-home-hero-i18n.mts` (create)

**Interfaces:**
- Consumes: none
- Produces: `home` catalog keys `heroBadge`, `heroDesignTo`, `simplifySpot`, `excellenceSpot`, `heroSubtitle`, `heroCta`, `scrollHint` (scrollHint already exists)

- [ ] **Step 1: Write the failing assert script**

Create `scripts/assert-home-hero-i18n.mts`:

```ts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['en', 'zh-Hant', 'zh-Hans'] as const;
const required = [
  'heroBadge',
  'heroDesignTo',
  'simplifySpot',
  'excellenceSpot',
  'heroSubtitle',
  'heroCta',
  'scrollHint'
] as const;

for (const locale of locales) {
  const home = JSON.parse(
    readFileSync(join(root, `src/i18n/locales/${locale}/home.json`), 'utf8')
  ) as Record<string, unknown>;
  for (const key of required) {
    assert.equal(typeof home[key], 'string', `${locale}.home.${key} must be a non-empty string`);
    assert.ok(String(home[key]).length > 0, `${locale}.home.${key} must be non-empty`);
  }
  assert.equal(home.heroSlides, undefined, `${locale}.home.heroSlides must be removed`);
  assert.equal(home.heroSlideDesc0, undefined, `${locale}.home.heroSlideDesc0 must be removed`);
  assert.equal(home.heroSlideDesc1, undefined, `${locale}.home.heroSlideDesc1 must be removed`);
  assert.equal(home.heroSlideDesc2, undefined, `${locale}.home.heroSlideDesc2 must be removed`);
  assert.equal(home.heroImageAlt, undefined, `${locale}.home.heroImageAlt must be removed`);
}

console.log('assert-home-hero-i18n: ok');
```

- [ ] **Step 2: Run assert to verify it fails**

Run: `npx --yes tsx scripts/assert-home-hero-i18n.mts`  
Expected: FAIL — missing keys / `heroSlides` still present

- [ ] **Step 3: Update the three `home.json` files**

For **en**, replace the top hero block (remove `heroSlides`, `heroSlideDesc0..2`, `heroImageAlt`) with:

```json
{
  "heroBadge": "Est. in Hong Kong 1993",
  "heroDesignTo": "Design to",
  "simplifySpot": "Simplify",
  "excellenceSpot": "Excellence.",
  "heroSubtitle": "Engineering speed, reliability, and manageability into enterprise business solutions for the regional market.",
  "heroCta": "See more",
  "scrollHint": "Scroll Down",
  "bentoEyebrow": "FDS Solutions"
}
```

(Keep all existing non-hero keys from `bentoEyebrow` downward unchanged.)

For **zh-Hant**:

```json
"heroBadge": "創立於香港 · 1993",
"heroDesignTo": "設計以",
"simplifySpot": "簡化",
"excellenceSpot": "卓越。",
"heroSubtitle": "為區內市場打造兼具速度、可靠性與可管理性的企業方案。",
"heroCta": "了解更多",
"scrollHint": "向下瀏覽"
```

For **zh-Hans**:

```json
"heroBadge": "创立于香港 · 1993",
"heroDesignTo": "设计以",
"simplifySpot": "简化",
"excellenceSpot": "卓越。",
"heroSubtitle": "为区内市场打造兼具速度、可靠性与可管理性的企业方案。",
"heroCta": "了解更多",
"scrollHint": "向下浏览"
```

- [ ] **Step 4: Re-run assert**

Run: `npx --yes tsx scripts/assert-home-hero-i18n.mts`  
Expected: `assert-home-hero-i18n: ok`

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/en/home.json src/i18n/locales/zh-Hant/home.json src/i18n/locales/zh-Hans/home.json scripts/assert-home-hero-i18n.mts
git commit -m "feat(home): add interactive hero i18n keys"
```

---

### Task 2: Extract `HeroSimplifyAndExcellenceSpot`

**Files:**
- Create: `src/components/HeroSimplifyAndExcellenceSpot.tsx`
- Test: `scripts/assert-spotlight-export.mts` (create)

**Interfaces:**
- Consumes: `simplifyWord: string`, `excellenceWord: string`
- Produces: `export function HeroSimplifyAndExcellenceSpot({ simplifyWord, excellenceWord }: { simplifyWord: string; excellenceWord: string }): JSX.Element`

Port behavior verbatim from `git show HEAD:src/components/ProfilePage.tsx` (the former `HeroSimplifyAndExcellenceSpot` + `SPOTLIGHT_RADIUS_PX` + `HERO_SURFACE_KNOCKOUT`). Do **not** call `useI18n` inside — parent passes strings so home owns copy.

- [ ] **Step 1: Write failing export assert**

Create `scripts/assert-spotlight-export.mts`:

```ts
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/components/HeroSimplifyAndExcellenceSpot.tsx'
);

await access(file);
const mod = await import('../src/components/HeroSimplifyAndExcellenceSpot.tsx');
assert.equal(typeof mod.HeroSimplifyAndExcellenceSpot, 'function');
console.log('assert-spotlight-export: ok');
```

- [ ] **Step 2: Run assert — expect fail (file missing)**

Run: `npx --yes tsx scripts/assert-spotlight-export.mts`  
Expected: FAIL (ENOENT or import error)

- [ ] **Step 3: Implement the component**

Create `src/components/HeroSimplifyAndExcellenceSpot.tsx` by copying the spotlight implementation from `git show HEAD:src/components/ProfilePage.tsx` (lines covering `SPOTLIGHT_RADIUS_PX`, `HERO_SURFACE_KNOCKOUT`, and `function HeroSimplifyAndExcellenceSpot` through its closing `}`).

Required adaptations:

1. Export the function: `export function HeroSimplifyAndExcellenceSpot(...)`.
2. Replace `useI18n` / `p.simplifySpot` with props:

```tsx
export function HeroSimplifyAndExcellenceSpot({
  simplifyWord,
  excellenceWord
}: {
  simplifyWord: string;
  excellenceWord: string;
}) {
```

3. Keep `locale` out of the dependency list — use `[layoutMeasure, simplifyWord, excellenceWord]` for the fonts `useLayoutEffect`.
4. Keep knockout constant exactly:

```ts
const HERO_SURFACE_KNOCKOUT =
  'color-mix(in srgb, var(--color-text, #01141a) 4%, var(--color-background, #f9fdff))';
```

5. Imports:

```tsx
import { motion, useSpring, useMotionValue } from 'motion/react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
```

- [ ] **Step 4: Re-run export assert**

Run: `npx --yes tsx scripts/assert-spotlight-export.mts`  
Expected: `assert-spotlight-export: ok`

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSimplifyAndExcellenceSpot.tsx scripts/assert-spotlight-export.mts
git commit -m "feat(home): extract interactive spotlight hero component"
```

---

### Task 3: Rewrite `HomeHero` for interactive stack

**Files:**
- Modify: `src/components/HomeHero.tsx`
- Test: `e2e/home-hero.spec.ts` (update in this task’s red phase; full green after Task 4)

**Interfaces:**
- Consumes: `HeroSimplifyAndExcellenceSpot`; `CtaButton` component type from App
- Produces:

```tsx
export function HomeHero({
  heroRef,
  heroNavPortalRef,
  badge,
  designTo,
  simplifyWord,
  excellenceWord,
  subtitle,
  ctaLabel,
  scrollHint,
  colorProfile,
  showMintBlend,
  mintBlendAppearance,
  onCtaClick,
  CtaButton
}: {
  heroRef: Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  badge: string;
  designTo: string;
  simplifyWord: string;
  excellenceWord: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  onCtaClick?: () => void;
  CtaButton: ComponentType<{ label: string; colorProfile?: 'default' | 'navy'; onClick?: () => void }>;
}): JSX.Element
```

- [ ] **Step 1: Rewrite e2e to the new contract (red until App wired)**

Replace `e2e/home-hero.spec.ts` with:

```ts
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
```

- [ ] **Step 2: Implement `HomeHero.tsx`**

Full file:

```tsx
import type { ComponentType, Ref } from 'react';
import { motion } from 'motion/react';
import { HeroSimplifyAndExcellenceSpot } from './HeroSimplifyAndExcellenceSpot';

export function HomeHero({
  heroRef,
  heroNavPortalRef,
  badge,
  designTo,
  simplifyWord,
  excellenceWord,
  subtitle,
  ctaLabel,
  scrollHint,
  colorProfile,
  showMintBlend,
  mintBlendAppearance,
  onCtaClick,
  CtaButton
}: {
  heroRef: Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  badge: string;
  designTo: string;
  simplifyWord: string;
  excellenceWord: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  onCtaClick?: () => void;
  CtaButton: ComponentType<{ label: string; colorProfile?: 'default' | 'navy'; onClick?: () => void }>;
}) {
  return (
    <section
      ref={heroRef}
      data-home-hero="interactive"
      className="relative h-screen min-h-[700px] w-full overflow-hidden border-b border-text/5 bg-text/3"
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(17,184,245,0.03)_0%,rgba(255,255,255,0)_100%)]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-5xl overflow-visible px-1 sm:px-2"
        >
          <div className="relative z-40 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
            {badge}
          </div>
          <h1 className="relative mx-auto mb-8 max-w-4xl overflow-visible text-center text-5xl font-bold leading-[1.18] tracking-tight text-text sm:leading-[1.15] lg:max-w-5xl lg:text-8xl lg:leading-[1.14]">
            <span className="relative z-30 inline-block w-full">{designTo}</span>
            <br />
            <span className="relative z-[1] flex flex-col items-center">
              <HeroSimplifyAndExcellenceSpot simplifyWord={simplifyWord} excellenceWord={excellenceWord} />
            </span>
          </h1>
          <p className="relative z-[25] mx-auto mb-10 max-w-2xl text-xl font-medium leading-relaxed text-text/60">
            {subtitle}
          </p>
          <div className="relative z-[25] flex flex-wrap justify-center gap-5">
            <CtaButton label={ctaLabel} colorProfile={colorProfile} onClick={onCtaClick} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`pointer-events-none absolute right-8 z-30 flex flex-col items-center gap-3 text-text/55 ${
          showMintBlend ? 'bottom-32 sm:bottom-40 lg:bottom-48' : 'bottom-8'
        }`}
      >
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
          {scrollHint}
        </span>
        <div className="h-16 w-[2px] rounded-full bg-linear-to-t from-text/50 via-text/25 to-transparent" />
      </motion.div>

      {showMintBlend ? (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-22 h-[clamp(280px,40vh,520px)] ${
            mintBlendAppearance === 'mint'
              ? 'bg-[linear-gradient(to_bottom,transparent_0%,transparent_28%,rgba(1,20,26,0.04)_52%,rgba(246,251,255,0.45)_80%,#f6fbff_100%)]'
              : 'bg-[linear-gradient(to_bottom,transparent_0%,transparent_26%,rgba(255,255,255,0.05)_48%,rgba(250,248,255,0.35)_74%,rgba(255,255,255,0.75)_100%)]'
          }`}
        />
      ) : null}
    </section>
  );
}
```

- [ ] **Step 3: Commit HomeHero + e2e rewrite**

```bash
git add src/components/HomeHero.tsx e2e/home-hero.spec.ts
git commit -m "feat(home): rewrite HomeHero as interactive spotlight hero"
```

(Note: e2e stays red until Task 4 wires App.)

---

### Task 4: Wire `App.tsx` and remove style/copy/hexagon controls

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/i18n/locales/en/demo.json`
- Modify: `src/i18n/locales/zh-Hant/demo.json`
- Modify: `src/i18n/locales/zh-Hans/demo.json`

**Interfaces:**
- Consumes: new `HomeHero` props from Task 3; `home` keys from Task 1
- Produces: home page renders interactive hero; demo panel has no hero style / hexagon / hero copy controls

- [ ] **Step 1: Update imports and remove unused hero state**

In `src/App.tsx`:

1. Delete import of `getHeroLead`, `HeroStyle`, `DEFAULT_HEXAGON_HERO_TUNING`, `HexagonHeroTuning` from `./components/homeHeroTypes`.
2. Delete `heroSlides` derivation.
3. Delete state: `heroStyle`, `heroCopyIndex`, `hexagonTuning`.
4. Delete `safeCopyIndex`, `activeHeroSlide`, `activeHeroLead`.
5. Keep `heroMintBlendEnabled` / `showHeroMintBlend` if the mint-blend demo toggle remains.

- [ ] **Step 2: Replace `<HomeHero ... />` call**

```tsx
<HomeHero
  heroRef={heroRef}
  heroNavPortalRef={setHeroNavPortalEl}
  badge={String(home.heroBadge ?? '')}
  designTo={String(home.heroDesignTo ?? '')}
  simplifyWord={String(home.simplifySpot ?? '')}
  excellenceWord={String(home.excellenceSpot ?? '')}
  subtitle={String(home.heroSubtitle ?? '')}
  ctaLabel={String(home.heroCta ?? '')}
  scrollHint={String(home.scrollHint ?? '')}
  colorProfile={colorProfile}
  showMintBlend={showHeroMintBlend}
  mintBlendAppearance={bentoSectionAppearance}
  onCtaClick={() => {
    bentoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }}
  CtaButton={SwipeBackgroundButton}
/>
```

- [ ] **Step 3: Delete demo panel blocks for hero style, hexagon tuning, and hero copy**

Remove the entire `<label>` / conditional blocks that render:
- `demo.heroStyleLabel` select
- `heroStyle === 'skyHexagon'` hexagon sliders
- `demo.heroCopyLabel` select

Keep other demo controls (bento, nav, mint blend, festival, etc.).

- [ ] **Step 4: Strip unused keys from all three `demo.json` files**

Delete keys: `heroStyleLabel`, `heroStyleHelp`, `heroStyleAria`, `heroStyleSoftSky`, `heroStyleSkyHard`, `heroStyleSkyHexagon`, `hexagonTuningTitle`, `hexagonTuningHelp`, `hexagonGreyLabel`, `hexagonGreyHelp`, `hexagonGreyAria`, `hexagonInfluenceLabel`, `hexagonInfluenceHelp`, `hexagonInfluenceAria`, `hexagonAttractionLabel`, `hexagonAttractionHelp`, `hexagonAttractionAria`, `hexagonWidthLabel`, `hexagonWidthHelp`, `hexagonWidthAria`, `heroStyleSkyDeep`, `heroStyleSkyGrid`, `heroStyleSkyDots`, `heroStyleSkyCalm`, `heroCopyLabel`, `heroCopyHelp`, `heroCopyAria`, `heroCopy0`, `heroCopy1`, `heroCopy2`.

- [ ] **Step 5: Typecheck**

Run: `npm run lint`  
Expected: exit 0

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/i18n/locales/en/demo.json src/i18n/locales/zh-Hant/demo.json src/i18n/locales/zh-Hans/demo.json
git commit -m "feat(home): wire interactive hero and drop style demos"
```

---

### Task 5: Delete dead soft-sky / p5 / type helpers; fix asserts

**Files:**
- Delete: `src/components/HomeHeroP5Sky.tsx`
- Delete: `src/components/HomeHeroP5Hexagons.tsx`
- Delete: `src/components/homeHeroTypes.ts`
- Delete: `scripts/assert-home-hero-types.mts`
- Modify: `src/index.css` (remove unused `.home-sky-*` rules if nothing else references them)
- Optional: remove `home-sky` CSS only after `rg home-sky` shows no TSX usage

**Interfaces:**
- Consumes: confirmation no remaining imports of deleted modules
- Produces: clean tree; lint green

- [ ] **Step 1: Confirm no remaining imports**

Run:

```bash
rg -n "HomeHeroP5|homeHeroTypes|getHeroLead|HeroStyle|HERO_STYLES|home-sky-" src e2e scripts
```

Expected: no matches under `src/` (CSS may still match until Step 3).

- [ ] **Step 2: Delete dead files**

```bash
git rm src/components/HomeHeroP5Sky.tsx src/components/HomeHeroP5Hexagons.tsx src/components/homeHeroTypes.ts scripts/assert-home-hero-types.mts
```

- [ ] **Step 3: Remove unused sky CSS from `src/index.css`**

Delete the `@keyframes home-sky-drift` block and classes `.home-sky-drift`, `.home-sky-drift--deep`, `.home-sky-drift--calm`, `.home-sky-grid`, `.home-sky-dots`, plus any `@media (prefers-reduced-motion)` rules that only target those classes.

- [ ] **Step 4: Lint + i18n assert**

Run:

```bash
npm run lint
npx --yes tsx scripts/assert-home-hero-i18n.mts
npx --yes tsx scripts/assert-spotlight-export.mts
```

Expected: all pass

- [ ] **Step 5: Manual / e2e check**

With `npm run dev` (port per `playwright.config.ts`, typically 3000):

```bash
npx playwright test e2e/home-hero.spec.ts
```

Expected: both tests PASS

Also open `#profile` and confirm the Profile hero section is still empty (no Simplify/Excellence spotlight).

- [ ] **Step 6: Commit**

```bash
git add -A src/components src/index.css scripts e2e
git commit -m "chore(home): remove unused soft-sky hero machinery"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Interactive Profile-style hero on home | 2, 3, 4 |
| Badge / Design to / spotlight / subtitle / CTA / scroll hint | 1, 3, 4 |
| Knockout matches `bg-text/3` surface | 2, 3 |
| Remove soft-sky / p5 / style switcher / copy index | 4, 5 |
| Profile stays without interactive hero | already done; verified in Task 5 |
| i18n under `home` for three locales | 1 |
| lint passes | 4, 5 |
| Update e2e / assert scripts | 1, 3, 5 |

## Self-review notes

- No TBD/placeholder steps.
- `HomeHero` prop names are consistent across Tasks 3–4.
- CTA uses dedicated `heroCta` key (not leftover `heroSlides`).
- Demo mint-blend toggle may remain; it is not a hero *style* switcher and is allowed by the spec (“optional mint blend if still wired”).

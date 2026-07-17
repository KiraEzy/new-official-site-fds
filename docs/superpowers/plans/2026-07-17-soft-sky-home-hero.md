# Soft-sky Home Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark image-carousel home hero with a light, centered soft-sky hero (slow flowing gradients) plus demo switches for visual variants and copy sets.

**Architecture:** Extract `HomeHero` that renders animated sky backgrounds + centered title/lead/CTA. `App.tsx` owns demo state (`heroStyle`, `heroCopyIndex`) and wires i18n slide data. CSS keyframes live in `index.css`. No Swiper on home.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, Motion (existing CTA), Playwright for smoke, `tsc --noEmit` for typecheck.

## Global Constraints

- No full-bleed hero photos or dark dimming overlays.
- Content stack: 2-line title → 1–2 line lead → one CTA, centered.
- Soft sky with slow flow (~16–22s); honor `prefers-reduced-motion: reduce`.
- Demo: 5 `heroStyle` values + 3 copy sets; defaults `softSky` and index `0`.
- Mint-blend demo toggle defaults **off**.
- Reuse existing `home.heroSlides` / `heroSlideDesc0|1|2` — no copy rewrite.
- Branch: `feat/alternative-hero-section`.
- Spec: `docs/superpowers/specs/2026-07-17-soft-sky-home-hero-design.md`.

---

## File map

| File | Responsibility |
| --- | --- |
| `src/components/homeHeroTypes.ts` | `HeroStyle` union + lead lookup helper |
| `src/components/HomeHero.tsx` | Sky layers + centered content + scroll hint |
| `src/index.css` | `@keyframes home-sky-drift` + utility classes + reduced motion |
| `src/App.tsx` | Replace Swiper hero; demo state + panel selects; remove unused Swiper imports |
| `src/i18n/locales/{en,zh-Hant,zh-Hans}/demo.json` | Labels for new controls |
| `e2e/home-hero.spec.ts` | Smoke: light hero, no swiper pagination, style switch |

---

### Task 1: Hero types + lead helper

**Files:**
- Create: `src/components/homeHeroTypes.ts`
- Create: `scripts/assert-home-hero-types.mts` (one-shot assert runner; delete optional after pass)
- Test: run via `npx tsx scripts/assert-home-hero-types.mts`

**Interfaces:**
- Produces:
  - `export type HeroStyle = 'softSky' | 'skyDeep' | 'skyGrid' | 'skyDots' | 'skyCalm'`
  - `export type HeroSlide = { title: string; cta: string; image?: string }`
  - `export function getHeroLead(home: Record<string, unknown>, copyIndex: number): string`
  - `export const HERO_STYLES: HeroStyle[]` (all five in order)

- [ ] **Step 1: Write the failing assert script**

Create `scripts/assert-home-hero-types.mts`:

```ts
import assert from 'node:assert/strict';
import { getHeroLead, HERO_STYLES } from '../src/components/homeHeroTypes.ts';

assert.deepEqual(HERO_STYLES, ['softSky', 'skyDeep', 'skyGrid', 'skyDots', 'skyCalm']);

const home = {
  heroSlideDesc0: 'Lead zero',
  heroSlideDesc1: 'Lead one',
  heroSlideDesc2: 'Lead two'
};

assert.equal(getHeroLead(home, 0), 'Lead zero');
assert.equal(getHeroLead(home, 1), 'Lead one');
assert.equal(getHeroLead(home, 2), 'Lead two');
assert.equal(getHeroLead(home, 99), 'Lead zero'); // clamp / fallback to 0
assert.equal(getHeroLead({}, 0), '');

console.log('assert-home-hero-types: ok');
```

- [ ] **Step 2: Run assert — expect FAIL (module missing)**

Run: `npx tsx scripts/assert-home-hero-types.mts`  
Expected: error resolving `../src/components/homeHeroTypes.ts`

- [ ] **Step 3: Implement `homeHeroTypes.ts`**

```ts
export type HeroStyle = 'softSky' | 'skyDeep' | 'skyGrid' | 'skyDots' | 'skyCalm';

export const HERO_STYLES: HeroStyle[] = [
  'softSky',
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
];

export type HeroSlide = { title: string; cta: string; image?: string };

export function getHeroLead(home: Record<string, unknown>, copyIndex: number): string {
  const safeIndex = copyIndex >= 0 && copyIndex <= 2 ? copyIndex : 0;
  const key = `heroSlideDesc${safeIndex}` as const;
  const value = home[key];
  return typeof value === 'string' ? value : '';
}
```

- [ ] **Step 4: Re-run assert — expect PASS**

Run: `npx tsx scripts/assert-home-hero-types.mts`  
Expected: `assert-home-hero-types: ok`

- [ ] **Step 5: Commit** (only if user asked / repo ready)

```bash
git add src/components/homeHeroTypes.ts scripts/assert-home-hero-types.mts
git commit -m "feat: add home hero style types and lead helper"
```

---

### Task 2: Sky CSS motion utilities

**Files:**
- Modify: `src/index.css`
- Test: visual / reduced-motion via Playwright in Task 5; lint via `npm run lint` after Task 3

**Interfaces:**
- Produces CSS classes used by `HomeHero`:
  - `.home-sky-drift` — animated multi-radial sky
  - `.home-sky-drift--deep` — richer cyan
  - `.home-sky-drift--calm` — near-flat, subtler animation
  - `.home-sky-grid` / `.home-sky-dots` — overlay patterns
  - `@media (prefers-reduced-motion: reduce)` disables animation

- [ ] **Step 1: Append keyframes and utilities to `src/index.css` (after existing `@keyframes slow-pan` block)**

```css
@keyframes home-sky-drift {
  0% {
    background-position: 0% 40%, 100% 60%, 50% 0%;
  }
  50% {
    background-position: 80% 55%, 10% 35%, 40% 20%;
  }
  100% {
    background-position: 0% 40%, 100% 60%, 50% 0%;
  }
}

.home-sky-drift {
  background-color: #f7fbff;
  background-image:
    radial-gradient(ellipse 70% 55% at 20% 30%, rgba(125, 211, 252, 0.55), transparent 60%),
    radial-gradient(ellipse 65% 50% at 85% 25%, rgba(186, 230, 253, 0.65), transparent 55%),
    radial-gradient(ellipse 80% 60% at 50% 90%, rgba(224, 242, 254, 0.9), transparent 55%);
  background-size: 140% 140%, 150% 150%, 120% 120%;
  animation: home-sky-drift 18s ease-in-out infinite;
}

.home-sky-drift--deep {
  background-image:
    radial-gradient(ellipse 75% 60% at 18% 28%, rgba(56, 189, 248, 0.55), transparent 58%),
    radial-gradient(ellipse 70% 55% at 88% 22%, rgba(14, 165, 233, 0.35), transparent 52%),
    radial-gradient(ellipse 85% 65% at 50% 95%, rgba(186, 230, 253, 0.85), transparent 55%);
}

.home-sky-drift--calm {
  background-image:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(186, 230, 253, 0.35), transparent 55%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(224, 242, 254, 0.5), transparent 50%),
    radial-gradient(ellipse 50% 40% at 10% 70%, rgba(241, 245, 249, 0.8), transparent 50%);
  animation-duration: 28s;
}

.home-sky-grid {
  background-image:
    linear-gradient(rgba(1, 20, 26, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(1, 20, 26, 0.045) 1px, transparent 1px);
  background-size: 42px 42px;
}

.home-sky-dots {
  background-image: radial-gradient(rgba(1, 20, 26, 0.09) 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .home-sky-drift,
  .home-sky-drift--calm {
    animation: none;
  }
}
```

- [ ] **Step 2: Remove obsolete hero-swiper pagination rules** from the same file (`.hero-swiper`, `.hero-swiper-pagination`, bullets) once Task 4 removes Swiper markup — can do in Task 4 if preferred; do not leave dead CSS after Task 4.

- [ ] **Step 3: Commit** (if requested)

```bash
git add src/index.css
git commit -m "feat: add soft-sky drift CSS for home hero"
```

---

### Task 3: `HomeHero` component

**Files:**
- Create: `src/components/HomeHero.tsx`
- Consumes: `HeroStyle`, `HeroSlide`, sky CSS classes
- Produces: `<HomeHero />` with `data-hero-style` for tests

**Interfaces:**
- Consumes: `HeroStyle`, `HeroSlide` from `./homeHeroTypes`
- Produces:

```tsx
export function HomeHero(props: {
  heroRef: React.Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  style: HeroStyle;
  slide: HeroSlide;
  lead: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  CtaButton: React.ComponentType<{ label: string; colorProfile?: 'default' | 'navy' }>;
}): JSX.Element
```

- [ ] **Step 1: Create `HomeHero.tsx` with this structure**

```tsx
import { motion } from 'motion/react';
import type { HeroSlide, HeroStyle } from './homeHeroTypes';

function skyBaseClass(style: HeroStyle): string {
  if (style === 'skyDeep') return 'home-sky-drift home-sky-drift--deep';
  if (style === 'skyCalm') return 'home-sky-drift home-sky-drift--calm';
  return 'home-sky-drift';
}

export function HomeHero({
  heroRef,
  heroNavPortalRef,
  style,
  slide,
  lead,
  scrollHint,
  colorProfile,
  showMintBlend,
  mintBlendAppearance,
  CtaButton
}: {
  heroRef: React.Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  style: HeroStyle;
  slide: HeroSlide;
  lead: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  CtaButton: React.ComponentType<{ label: string; colorProfile?: 'default' | 'navy' }>;
}) {
  return (
    <section
      ref={heroRef}
      data-hero-style={style}
      className="relative h-screen min-h-[700px] w-full overflow-hidden"
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />

      <div className={`absolute inset-0 ${skyBaseClass(style)}`} aria-hidden />
      {style === 'skyGrid' ? <div className="home-sky-grid absolute inset-0" aria-hidden /> : null}
      {style === 'skyDots' ? <div className="home-sky-dots absolute inset-0" aria-hidden /> : null}

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="mb-6 whitespace-pre-line text-5xl font-bold leading-[1.05] tracking-tight text-text lg:text-7xl">
            {slide.title}
          </h1>
          {lead ? (
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-text/60 md:text-xl md:leading-8">
              {lead}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-5">
            <CtaButton label={slide.cta} colorProfile={colorProfile} />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`pointer-events-none absolute right-8 z-30 flex flex-col items-center gap-3 text-text/55 ${
          showMintBlend ? 'bottom-32 sm:bottom-40 lg:bottom-48' : 'bottom-8'
        }`}
      >
        <span className="vertical-rl mb-1 text-[10px] font-semibold uppercase tracking-[0.3em]">
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

- [ ] **Step 2: Typecheck component in isolation after App wiring (Task 4)** — if exporting early, run `npm run lint` and fix any `React` namespace import (`import type { Ref, ComponentType } from 'react'`).

- [ ] **Step 3: Commit** (if requested)

```bash
git add src/components/HomeHero.tsx
git commit -m "feat: add HomeHero soft-sky centered component"
```

---

### Task 4: Wire `App.tsx` + demo i18n; remove Swiper hero

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/i18n/locales/en/demo.json`
- Modify: `src/i18n/locales/zh-Hant/demo.json`
- Modify: `src/i18n/locales/zh-Hans/demo.json`
- Modify: `src/index.css` (delete `.hero-swiper*` rules if not done in Task 2)

**Interfaces:**
- Consumes: `HomeHero`, `getHeroLead`, `HeroStyle`
- State defaults: `heroStyle = 'softSky'`, `heroCopyIndex = 0`, `heroMintBlendEnabled = false`

- [ ] **Step 1: Add demo strings** to all three `demo.json` files:

```json
"heroStyleLabel": "Hero style",
"heroStyleHelp": "Light soft-sky backgrounds with slow drift. No photo carousel.",
"heroStyleAria": "Hero visual style",
"heroStyleSoftSky": "Soft sky (default)",
"heroStyleSkyDeep": "Sky deep",
"heroStyleSkyGrid": "Sky + grid",
"heroStyleSkyDots": "Sky + dots",
"heroStyleSkyCalm": "Sky calm",
"heroCopyLabel": "Hero copy",
"heroCopyHelp": "Switch among the three existing hero messages.",
"heroCopyAria": "Hero copy set",
"heroCopy0": "Set 1 — Automating Processes",
"heroCopy1": "Set 2 — Design to Simplify",
"heroCopy2": "Set 3 — Twenty Years"
```

(zh-Hant / zh-Hans: translate labels; keep meaning aligned.)

- [ ] **Step 2: In `App.tsx`**

1. Remove:

```ts
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
```

2. Add:

```ts
import { HomeHero } from './components/HomeHero';
import { getHeroLead, type HeroStyle } from './components/homeHeroTypes';
```

3. Change state:

```ts
const [heroMintBlendEnabled, setHeroMintBlendEnabled] = useState(false);
const [heroStyle, setHeroStyle] = useState<HeroStyle>('softSky');
const [heroCopyIndex, setHeroCopyIndex] = useState(0);
```

4. Derive slide + lead near `heroSlides`:

```ts
const safeCopyIndex = heroCopyIndex >= 0 && heroCopyIndex < heroSlides.length ? heroCopyIndex : 0;
const activeHeroSlide = heroSlides[safeCopyIndex] ?? { title: '', cta: '', image: '' };
const activeHeroLead = getHeroLead(home, safeCopyIndex);
```

5. Replace the entire Swiper `<section ref={heroRef} …>…</section>` block with:

```tsx
<HomeHero
  heroRef={heroRef}
  heroNavPortalRef={setHeroNavPortalEl}
  style={heroStyle}
  slide={activeHeroSlide}
  lead={activeHeroLead}
  scrollHint={String(home.scrollHint ?? '')}
  colorProfile={colorProfile}
  showMintBlend={showHeroMintBlend}
  mintBlendAppearance={bentoSectionAppearance}
  CtaButton={SwipeBackgroundButton}
/>
```

6. In the demo panel (near nav layout select), add two `<label>` selects mirroring existing patterns for `heroStyle` and `heroCopyIndex` (`Number(event.target.value)` for copy).

- [ ] **Step 3: Delete `.hero-swiper*` CSS** from `src/index.css` if still present.

- [ ] **Step 4: Run typecheck**

Run: `npm run lint`  
Expected: exit 0

- [ ] **Step 5: Manual smoke**

Run: `npm run dev`  
Open home: centered dark text on soft sky, slow drift, no Unsplash hero images in Network, demo switches change style + copy.

- [ ] **Step 6: Commit** (if requested)

```bash
git add src/App.tsx src/index.css src/i18n/locales/en/demo.json src/i18n/locales/zh-Hant/demo.json src/i18n/locales/zh-Hans/demo.json
git commit -m "feat: replace home image carousel with soft-sky HomeHero"
```

---

### Task 5: Playwright smoke for home hero

**Files:**
- Create: `e2e/home-hero.spec.ts`
- Check: `playwright.config.ts` baseURL (use local Vite if configured; otherwise `page.goto('http://127.0.0.1:3000/')` and document that `npm run dev` must be running)

**Interfaces:**
- Consumes: `data-hero-style` on hero section; demo panel controls

- [ ] **Step 1: Write failing/smoke test**

```ts
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Automating Processes');
  });

  test('demo hero style switch updates data attribute', async ({ page }) => {
    await page.getByRole('button', { name: /demo style controls/i }).click();
    await page.getByLabel(/hero visual style/i).selectOption('skyGrid');
    await expect(page.locator('[data-hero-style]')).toHaveAttribute('data-hero-style', 'skyGrid');
  });
});
```

Adjust toggle button `name` to match `demo.toggleAria` exactly if different.

- [ ] **Step 2: Run with dev server up**

Run: `npx playwright test e2e/home-hero.spec.ts`  
Expected: PASS (fix selectors if FAIL)

- [ ] **Step 3: Commit** (if requested)

```bash
git add e2e/home-hero.spec.ts
git commit -m "test: add Playwright smoke for soft-sky home hero"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Remove image carousel / dimming | 4 |
| Soft sky + slow flow | 2, 3 |
| Title / lead / CTA centered | 3 |
| 5 hero styles in demo | 3, 4 |
| 3 copy sets, default 0 | 1, 4 |
| Mint blend default off | 4 |
| Reduced motion | 2 |
| i18n demo labels | 4 |
| No news/bento redesign | respected (out of scope) |

## Placeholder / consistency self-review

- Types use `HeroStyle` / `getHeroLead` consistently across tasks.
- CSS class names in Task 2 match Task 3.
- No TBD left; commits gated on user request (repo may still lack an initial commit).

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-17-soft-sky-home-hero.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — run tasks in this session with executing-plans checkpoints  

Which approach?

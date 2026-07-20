# Editorial Home Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centered, type-led home hero (Oliwia-inspired layout) with restored FDS title/lead copy, no status pill and no in-hero CTA.

**Architecture:** Presentational `HomeHero` receives `title` and `lead` strings. `App.tsx` mounts it as the first home section and restores scroll-snap so the hero is the top snap target. Copy lives in `home.json` for three locales. Serif display font is scoped to the hero H1 via `index.css`.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, Motion, existing i18n catalogs, `tsc --noEmit` (`npm run lint`).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-20-editorial-home-hero-design.md`
- Branch / worktree: `experiment/new-hero-section` at `.worktrees/experiment-new-hero`
- Near-literal visual clone of [omikolajczak.com](https://omikolajczak.com/) hero stack (no pill, no CTA)
- Copy from prior home hero slide 0 only (not Oliwia’s wording)
- Flat `bg-background`; no photo, sky animation, or p5
- Navbar unchanged; other page heroes unchanged
- Honor `prefers-reduced-motion` for entrance motion

---

## File map

| File | Responsibility |
| --- | --- |
| `src/components/HomeHero.tsx` | Centered serif H1 + muted lead; load motion |
| `src/index.css` | Import Fraunces; `--font-hero-display` / `.font-hero-display` |
| `src/i18n/locales/{en,zh-Hans,zh-Hant}/home.json` | `heroTitle`, `heroLead` |
| `src/App.tsx` | Mount hero + `heroRef`; restore snap branches |
| `scripts/assert-editorial-home-hero.mts` | One-shot assert for HomeHero export + i18n keys |

---

### Task 1: i18n keys + assert script

**Files:**
- Modify: `src/i18n/locales/en/home.json`
- Modify: `src/i18n/locales/zh-Hans/home.json`
- Modify: `src/i18n/locales/zh-Hant/home.json`
- Create: `scripts/assert-editorial-home-hero.mts`

**Interfaces:**
- Produces: `home.heroTitle: string`, `home.heroLead: string` in all three locale files

- [ ] **Step 1: Write the failing assert script**

Create `scripts/assert-editorial-home-hero.mts`:

```ts
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const locale of ['en', 'zh-Hans', 'zh-Hant'] as const) {
  const home = JSON.parse(readFileSync(join(root, `src/i18n/locales/${locale}/home.json`), 'utf8')) as Record<
    string,
    unknown
  >;
  if (typeof home.heroTitle !== 'string' || !home.heroTitle.trim()) {
    throw new Error(`${locale}: missing heroTitle`);
  }
  if (typeof home.heroLead !== 'string' || !home.heroLead.trim()) {
    throw new Error(`${locale}: missing heroLead`);
  }
  if (!String(home.heroTitle).includes('\n')) {
    throw new Error(`${locale}: heroTitle should include a line break`);
  }
}

console.log('assert-editorial-home-hero: i18n ok');
```

- [ ] **Step 2: Run assert — expect fail**

Run: `npx tsx scripts/assert-editorial-home-hero.mts`  
Expected: FAIL with `en: missing heroTitle` (or equivalent)

- [ ] **Step 3: Add keys to all three `home.json` files**

Insert at the top of each file (before `bentoEyebrow`):

**en:**
```json
"heroTitle": "Design to Simplify \nYour Enterprise.",
"heroLead": "Twenty years of technical excellence—trusted by HKSAR Government and leading financial institutions for mission-critical systems.",
```

**zh-Hans:**
```json
"heroTitle": "以简驭繁，\n成就企业数字化转型。",
"heroLead": "二十年技术精进，备受香港特区政府与领先金融机构信赖，承载关键业务系统。",
```

**zh-Hant:**
```json
"heroTitle": "以簡馭繁，\n成就企業數碼轉型。",
"heroLead": "二十年技術精進，備受香港特區政府與領先金融機構信賴，承載關鍵業務系統。",
```

- [ ] **Step 4: Run assert — expect i18n pass (component check not yet)**

Run: `npx tsx scripts/assert-editorial-home-hero.mts`  
Expected: `assert-editorial-home-hero: i18n ok`

- [ ] **Step 5: Commit**

```bash
git add src/i18n/locales/en/home.json src/i18n/locales/zh-Hans/home.json src/i18n/locales/zh-Hant/home.json scripts/assert-editorial-home-hero.mts
git commit -m "feat: restore editorial home hero i18n keys"
```

---

### Task 2: `HomeHero` component + serif font

**Files:**
- Create: `src/components/HomeHero.tsx`
- Modify: `src/index.css` (font import + theme token)
- Modify: `scripts/assert-editorial-home-hero.mts` (assert component exports)

**Interfaces:**
- Consumes: none beyond React + `motion`
- Produces: `export function HomeHero(props: { title: string; lead: string }): JSX.Element`

- [ ] **Step 1: Extend assert to require `HomeHero` export**

Append to `scripts/assert-editorial-home-hero.mts` (after i18n checks):

```ts
const heroMod = await import('../src/components/HomeHero.tsx');
if (typeof heroMod.HomeHero !== 'function') {
  throw new Error('HomeHero export missing');
}
console.log('assert-editorial-home-hero: ok');
```

Change the final i18n-only log so the script ends with a single `ok` line after both checks (remove the earlier `i18n ok` log or keep both).

- [ ] **Step 2: Run assert — expect fail on missing module**

Run: `npx tsx scripts/assert-editorial-home-hero.mts`  
Expected: FAIL resolving `HomeHero.tsx` or missing export

- [ ] **Step 3: Add Fraunces to `src/index.css`**

Replace the existing Google Fonts Inter import line with:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap');
```

Inside `@theme { ... }` add:

```css
--font-hero-display: "Fraunces", ui-serif, Georgia, serif;
```

In `@layer utilities` add:

```css
.font-hero-display {
  font-family: var(--font-hero-display);
}
```

- [ ] **Step 4: Implement `src/components/HomeHero.tsx`**

```tsx
import { motion, useReducedMotion } from 'motion/react';

export function HomeHero({ title, lead }: { title: string; lead: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-home-hero="editorial"
      className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="font-hero-display mb-6 whitespace-pre-line text-5xl font-semibold leading-[1.12] tracking-tight text-text md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        {lead ? (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
            className="mx-auto max-w-2xl text-lg leading-8 text-text/60 md:text-xl md:leading-8"
          >
            {lead}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run assert + lint**

Run:
```bash
npx tsx scripts/assert-editorial-home-hero.mts
npm run lint
```
Expected: `assert-editorial-home-hero: ok` and `tsc` exit 0

- [ ] **Step 6: Commit**

```bash
git add src/components/HomeHero.tsx src/index.css scripts/assert-editorial-home-hero.mts
git commit -m "feat: add editorial HomeHero with Fraunces display"
```

---

### Task 3: Wire into `App.tsx` + restore scroll-snap

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `HomeHero({ title, lead })`
- Produces: home page starts with editorial hero; `heroRef` drives snap

- [ ] **Step 1: Import and mount `HomeHero`**

Add import near other component imports:

```tsx
import { HomeHero } from './components/HomeHero';
```

Inside `App`, after `newsItems` (or near other home data), no extra state needed beyond a ref.

Add:

```tsx
const heroRef = useRef<HTMLElement>(null);
```

Change the home `<main>` opening so the hero is first. Prefer forwarding the ref into the section. Update `HomeHero` to accept an optional `heroRef` **or** wrap:

Simplest (no prop change): wrap in a fragment and put ref on a wrapper — but snap needs the hero section height. Prefer extending props:

Update `HomeHero` signature to:

```tsx
export function HomeHero({
  title,
  lead,
  heroRef
}: {
  title: string;
  lead: string;
  heroRef?: React.Ref<HTMLElement>;
}) {
```

and put `ref={heroRef}` on the `<section>`.

Then in `App.tsx` home branch:

```tsx
<main>
  <HomeHero
    heroRef={heroRef}
    title={String(home.heroTitle ?? '')}
    lead={String(home.heroLead ?? '')}
  />

  {/* Latest News */}
  <section ref={newsSectionRef} ...>
```

- [ ] **Step 2: Restore snap logic for hero-first layout**

In the home scroll-snap `useEffect`, restore hero-aware geometry:

```tsx
const topThreshold = 80;
const heroBoundaryPadding = 120;
const sectionSnapPadding = 160;

const getHeroBottom = () => {
  const hero = heroRef.current;
  return hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
};

// inside handleSnapIntent:
const heroBottom = getHeroBottom();
const sectionOneTop = getSectionTop(newsSectionRef.current, heroBottom);
const sectionTwoTop = getSectionTop(bentoSectionRef.current, sectionOneTop + window.innerHeight);
const sectionThreeTop = getSectionTop(
  solutionsSectionRef.current,
  sectionTwoTop + window.innerHeight
);

// down from top → latest news
if (direction === 'down' && scrollY <= topThreshold) {
  snapTo(sectionOneTop, 'hero → latest news');
  return true;
}

// ... keep news→bento and bento→solutions branches ...

// up into hero
if (
  direction === 'up' &&
  scrollY > topThreshold &&
  scrollY <= heroBottom + heroBoundaryPadding - 100
) {
  snapTo(0, 'hero boundary → top');
  return true;
}
```

Include `heroBottom` in the snap log `ctx` object again.

- [ ] **Step 3: Lint**

Run: `npm run lint`  
Expected: exit 0

- [ ] **Step 4: Manual smoke on worktree dev server**

Run (if not already): `npm run dev -- --port 3001`  
Open `http://localhost:3001/`  
Check:
- Hero above Latest News
- Serif title with line break; muted lead
- No pill, no hero CTA
- Locale switch still shows ZH title/lead if language toggle exists

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/HomeHero.tsx
git commit -m "feat: mount editorial home hero and restore snap"
```

---

### Task 4: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Re-run assert + lint**

```bash
npx tsx scripts/assert-editorial-home-hero.mts
npm run lint
```
Expected: both pass

- [ ] **Step 2: Confirm acceptance checklist from spec**

- [ ] Editorial hero visible on home
- [ ] Centered type stack, no pill/CTA
- [ ] EN + ZH-Hans + ZH-Hant keys present
- [ ] Lint clean

No commit if nothing changed.

---

## Spec coverage self-review

| Spec item | Task |
| --- | --- |
| Near-literal centered stack, no pill/CTA | Task 2–3 |
| FDS restored title + lead | Task 1 |
| `HomeHero` component | Task 2 |
| Mount before Latest News | Task 3 |
| Fraunces (serif) on H1 only | Task 2 |
| Scroll-snap hero first | Task 3 |
| Navbar / other heroes unchanged | (no task — leave alone) |
| `npm run lint` | Tasks 2–4 |

## Placeholder / consistency check

- Prop name: `heroRef` optional on `HomeHero`; `title` / `lead` required strings — consistent across Task 2–3.
- i18n keys: `heroTitle` / `heroLead` only (not `heroSlides`).
- No TBD/TODO left in steps.

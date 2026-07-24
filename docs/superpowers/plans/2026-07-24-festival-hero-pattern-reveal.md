# Festival Hero Pattern Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the festival bar is on, hide a tiling dragon pattern under the home hero and reveal it through a ~118px feathered cursor mask across the whole hero, without changing Simplify / Excellence spotlight behavior.

**Architecture:** `App` passes `showFestivalReveal={showFestivalBar}` into `HomeHero`. `HomeHero` mounts a full-bleed tiled underlay above the cyan section background (and white glow) but below hero copy, clipped with a feathered radial `mask-image` that spring-follows the pointer. Turning the festival bar off unmounts the layer.

**Tech Stack:** React, Motion (`useMotionValue` / `useSpring`), Vite static `public/` assets, Playwright e2e.

## Global Constraints

- Reveal radius ~118px and feather ~36px (match `HeroSimplifyAndExcellenceSpot`)
- Gate strictly on `showFestivalBar` (dismiss + demo toggle)
- Keep word spotlight behavior unchanged
- Underlay is `aria-hidden` + `pointer-events-none`
- Work only in the `profile-hero` worktree
- Spec: `docs/superpowers/specs/2026-07-24-festival-hero-pattern-reveal-design.md`

## File map

| File | Responsibility |
| --- | --- |
| `public/festival/dragon-pattern.png` | Tiling dragon pattern asset |
| `src/components/HomeHero.tsx` | Festival underlay + cursor mask; accepts `showFestivalReveal` |
| `src/App.tsx` | Wire `showFestivalReveal={showFestivalBar}` into `HomeHero` |
| `e2e/home-hero.spec.ts` | Assert underlay mounts/unmounts with festival bar |

---

### Task 1: Add festival pattern asset + e2e for mount/unmount

**Files:**
- Create: `public/festival/dragon-pattern.png`
- Modify: `e2e/home-hero.spec.ts`
- Modify (later tasks): `src/components/HomeHero.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: none
- Produces: static URL `/festival/dragon-pattern.png`; e2e selectors `[data-festival-reveal="pattern"]` and festival close control

- [ ] **Step 1: Copy the provided pattern into the worktree**

Source (Cursor upload):

`C:\Users\charleswong\.cursor\projects\c-Users-charleswong-Documents-GitHub-new-official-site-fds\assets\c__Users_charleswong_AppData_Roaming_Cursor_User_workspaceStorage_77b8bcd72db00584d6da1d72e0aed1a3_images_New_Project__6_-9ce2eef4-2a4a-4db9-ac63-a0f379a8811b.png`

```powershell
New-Item -ItemType Directory -Force -Path public/festival | Out-Null
Copy-Item -Force `
  "C:\Users\charleswong\.cursor\projects\c-Users-charleswong-Documents-GitHub-new-official-site-fds\assets\c__Users_charleswong_AppData_Roaming_Cursor_User_workspaceStorage_77b8bcd72db00584d6da1d72e0aed1a3_images_New_Project__6_-9ce2eef4-2a4a-4db9-ac63-a0f379a8811b.png" `
  "public/festival/dragon-pattern.png"
```

Verify:

```powershell
Test-Path public/festival/dragon-pattern.png
(Get-Item public/festival/dragon-pattern.png).Length
```

Expected: `True`, length ~245871

- [ ] **Step 2: Write the failing e2e tests**

Append to `e2e/home-hero.spec.ts`:

```ts
  test('shows festival pattern reveal underlay when festival bar is present', async ({ page }) => {
    const hero = page.locator('[data-home-hero="interactive"]');
    await expect(hero).toBeVisible();
    const reveal = page.locator('[data-festival-reveal="pattern"]');
    await expect(reveal).toBeVisible();
    await expect(reveal).toHaveCSS('background-image', /dragon-pattern/);
  });

  test('removes festival pattern reveal when festival bar is closed', async ({ page }) => {
    await expect(page.locator('[data-festival-reveal="pattern"]')).toBeVisible();
    await page.getByRole('button', { name: /Close announcement bar/i }).click();
    await expect(page.locator('[data-festival-reveal="pattern"]')).toHaveCount(0);
  });
```

- [ ] **Step 3: Run e2e to verify failure**

Dev server must already be on port 3000 (`npm run dev`). Then:

```powershell
npx playwright test e2e/home-hero.spec.ts --grep "festival pattern"
```

Expected: FAIL — `[data-festival-reveal="pattern"]` not found

- [ ] **Step 4: Commit asset + failing tests**

```powershell
git add public/festival/dragon-pattern.png e2e/home-hero.spec.ts
git commit -m "test(home): add festival pattern reveal coverage"
```

---

### Task 2: Add `showFestivalReveal` underlay + cursor mask in `HomeHero`

**Files:**
- Modify: `src/components/HomeHero.tsx`
- Test: `e2e/home-hero.spec.ts` (from Task 1; still fails until App wires the prop)

**Interfaces:**
- Consumes: `showFestivalReveal?: boolean` (default `false`); asset `/festival/dragon-pattern.png`
- Produces: When `showFestivalReveal` is true, renders `[data-festival-reveal="pattern"]` with feathered cursor mask (~118px / ~36px)

- [ ] **Step 1: Extend `HomeHero` props and imports**

At top of `src/components/HomeHero.tsx`, change imports and add mask helpers (keep local — do not refactor the word spotlight file):

```tsx
import type { ComponentType, Ref } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { HeroSimplifyAndExcellenceSpot } from './HeroSimplifyAndExcellenceSpot';

const FESTIVAL_REVEAL_RADIUS_PX = 118;
const FESTIVAL_REVEAL_FEATHER_PX = 36;

function featheredFestivalRevealMask(x: number, y: number) {
  const r = FESTIVAL_REVEAL_RADIUS_PX;
  const hardCore = Math.max(0, r - FESTIVAL_REVEAL_FEATHER_PX);
  const mid = hardCore + FESTIVAL_REVEAL_FEATHER_PX * 0.45;
  return `radial-gradient(circle ${r}px at ${x}px ${y}px, #000 0px, #000 ${hardCore}px, rgba(0,0,0,0.45) ${mid}px, transparent ${r}px)`;
}
```

Add prop to the component signature (alongside existing props):

```tsx
  showFestivalReveal = false,
```

and in the props type:

```tsx
  showFestivalReveal?: boolean;
```

- [ ] **Step 2: Track cursor relative to the hero and drive the mask**

Inside `HomeHero`, after existing refs/state, add:

```tsx
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const [festivalMask, setFestivalMask] = useState(() => featheredFestivalRevealMask(-500, -500));

  useEffect(() => {
    if (!showFestivalReveal) return;

    const handleMove = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMove);

    const syncMask = () => {
      setFestivalMask(featheredFestivalRevealMask(springX.get(), springY.get()));
    };
    const unsubX = springX.on('change', syncMask);
    const unsubY = springY.on('change', syncMask);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      unsubX();
      unsubY();
    };
  }, [showFestivalReveal, mouseX, mouseY, springX, springY]);
```

- [ ] **Step 3: Render the underlay above the cyan fill / white glow, below copy**

Replace the empty decorative stub:

```tsx
      <div
        className=""
        aria-hidden
      />
```

with:

```tsx
      {showFestivalReveal ? (
        <div
          aria-hidden
          data-festival-reveal="pattern"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            backgroundImage: 'url(/festival/dragon-pattern.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '420px auto',
            WebkitMaskImage: festivalMask,
            maskImage: festivalMask,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%'
          }}
        />
      ) : null}
```

Keep white glow at `z-[1]` and floor at `z-[2]` so the pattern peeks on top of the cyan atmosphere but under `z-20` content. Do not change `HeroSimplifyAndExcellenceSpot` usage.

- [ ] **Step 4: Typecheck**

```powershell
npm run lint
```

Expected: PASS (no TS errors)

- [ ] **Step 5: Commit**

```powershell
git add src/components/HomeHero.tsx
git commit -m "feat(home): add festival cursor pattern reveal underlay"
```

---

### Task 3: Wire `showFestivalBar` from `App` and verify e2e

**Files:**
- Modify: `src/App.tsx` (HomeHero call site ~1104–1121)
- Test: `e2e/home-hero.spec.ts`

**Interfaces:**
- Consumes: `showFestivalBar: boolean` from App state; `HomeHero`’s `showFestivalReveal?: boolean`
- Produces: Festival reveal active exactly when festival bar is shown

- [ ] **Step 1: Pass the prop**

In `src/App.tsx`, on the home `HomeHero` element, add:

```tsx
          showFestivalReveal={showFestivalBar}
```

Place it next to the other boolean props (`showMintBlend`, etc.).

- [ ] **Step 2: Run e2e festival tests**

Ensure `npm run dev` is serving `http://127.0.0.1:3000/`, then:

```powershell
npx playwright test e2e/home-hero.spec.ts --grep "festival pattern"
```

Expected: PASS (both new tests)

- [ ] **Step 3: Manual smoke (optional but recommended)**

With festival bar on, move the cursor across the hero: a ~118px soft hole should reveal the green dragon tile; Simplify stroke + Excellence gold glow still work. Close the bar: underlay disappears.

- [ ] **Step 4: Commit**

```powershell
git add src/App.tsx
git commit -m "feat(home): gate festival pattern reveal on festival bar"
```

---

## Self-review checklist (plan author)

1. **Spec coverage:** Full-hero reveal, keep word effects, ~118/36 mask, underlay in `HomeHero`, gate on `showFestivalBar`, asset path, a11y attrs, dismiss unmount — covered by Tasks 1–3.
2. **Placeholders:** None.
3. **Type consistency:** Prop name is `showFestivalReveal` everywhere; selector is `data-festival-reveal="pattern"`; asset URL `/festival/dragon-pattern.png`.

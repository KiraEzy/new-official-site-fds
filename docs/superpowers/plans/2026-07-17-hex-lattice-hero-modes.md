# Hex Lattice Hero Modes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four lattice cursor-interaction hero styles (Ripple, Spotlight, Connect, Paint) as top-level demo options beside Hexagon, keep independent per-style tuning, and remove Sky polygons (p5).

**Architecture:** One `HomeHeroP5Hexagons` component takes `mode` + live `tuning` ref. `App` stores `Record<LatticeHeroStyle, LatticeTuning>` so slider values are not shared across styles. `HomeHero` maps lattice `HeroStyle` ids to mode; delete `HomeHeroP5Sky` / `skyHard`.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, p5@^2.3.0, Playwright smoke, `tsc --noEmit`, `npx tsx` assert script.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-17-hex-lattice-hero-modes-design.md`
- Four new top-level styles; Hexagon stays magnetic nudge.
- Per-style tuning state — values **not** shared when switching styles.
- Core sliders: grey + hex width for all lattice styles; plus mode-specific sliders.
- Remove `skyHard` and `HomeHeroP5Sky.tsx` completely.
- White canvas; `pointer-events: none` on host; window `pointermove` tracking.
- Honor `prefers-reduced-motion: reduce` with static lattice.
- Branch: `feat/alternative-hero-section` (may still have zero commits — create first commit only if user asked / following plan commit steps when appropriate).

---

## File map

| File | Responsibility |
| --- | --- |
| `src/components/homeHeroTypes.ts` | `HeroStyle`, lattice types, defaults, `isLatticeHeroStyle`, `getLatticeMode` |
| `scripts/assert-home-hero-types.mts` | Assert style list + lattice helpers |
| `src/components/HomeHeroP5Hexagons.tsx` | p5 lattice + five interaction modes |
| `src/components/HomeHero.tsx` | Map lattice styles → p5; drop sky polygons |
| Delete `src/components/HomeHeroP5Sky.tsx` | Removed feature |
| `src/App.tsx` | Per-style tuning state + dropdown + conditional sliders |
| `src/i18n/locales/{en,zh-Hant,zh-Hans}/demo.json` | Labels; remove skyHard; add new keys |
| `e2e/home-hero.spec.ts` | Smoke: select Ripple, assert `data-hero-style` |

---

### Task 1: Types, defaults, helpers + assert script

**Files:**
- Modify: `src/components/homeHeroTypes.ts`
- Modify: `scripts/assert-home-hero-types.mts`

**Interfaces:**
- Produces:
  - `export type LatticeHeroMode = 'magnetic' | 'ripple' | 'spotlight' | 'connect' | 'paint'`
  - `export type LatticeHeroStyle = 'skyHexagon' | 'skyRipple' | 'skySpotlight' | 'skyConnect' | 'skyPaint'`
  - `export type HeroStyle = 'softSky' | LatticeHeroStyle | 'skyDeep' | 'skyGrid' | 'skyDots' | 'skyCalm'` (no `skyHard`)
  - `export type LatticeTuning = { grey: number; hexWidth: number; influenceRadius: number; attraction: number; waveStrength: number; densifyStrength: number; linkCount: number; trailLength: number; trailBrightness: number }`
  - `export const LATTICE_HERO_STYLES: LatticeHeroStyle[]`
  - `export const DEFAULT_LATTICE_TUNING_BY_STYLE: Record<LatticeHeroStyle, LatticeTuning>`
  - `export function isLatticeHeroStyle(style: HeroStyle): style is LatticeHeroStyle`
  - `export function getLatticeMode(style: LatticeHeroStyle): LatticeHeroMode`
  - Keep `getHeroLead`, `HeroSlide`, `HERO_STYLES`
  - Remove `HexagonHeroTuning` / `DEFAULT_HEXAGON_HERO_TUNING` (replace with lattice types above)

- [ ] **Step 1: Update assert script to the new expected surface**

Replace `scripts/assert-home-hero-types.mts` with:

```ts
import assert from 'node:assert/strict';
import {
  getHeroLead,
  getLatticeMode,
  HERO_STYLES,
  isLatticeHeroStyle,
  LATTICE_HERO_STYLES,
  DEFAULT_LATTICE_TUNING_BY_STYLE
} from '../src/components/homeHeroTypes.ts';

assert.deepEqual(HERO_STYLES, [
  'softSky',
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint',
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
]);

assert.ok(!HERO_STYLES.includes('skyHard' as never));

assert.deepEqual(LATTICE_HERO_STYLES, [
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint'
]);

assert.equal(getLatticeMode('skyHexagon'), 'magnetic');
assert.equal(getLatticeMode('skyRipple'), 'ripple');
assert.equal(getLatticeMode('skySpotlight'), 'spotlight');
assert.equal(getLatticeMode('skyConnect'), 'connect');
assert.equal(getLatticeMode('skyPaint'), 'paint');

assert.equal(isLatticeHeroStyle('skyRipple'), true);
assert.equal(isLatticeHeroStyle('softSky'), false);

for (const style of LATTICE_HERO_STYLES) {
  const t = DEFAULT_LATTICE_TUNING_BY_STYLE[style];
  assert.ok(t.grey >= 140 && t.grey <= 240);
  assert.ok(t.hexWidth >= 10 && t.hexWidth <= 40);
}

assert.equal(DEFAULT_LATTICE_TUNING_BY_STYLE.skyHexagon.attraction, 0.85);
assert.equal(DEFAULT_LATTICE_TUNING_BY_STYLE.skyConnect.linkCount, 4);
assert.notEqual(
  DEFAULT_LATTICE_TUNING_BY_STYLE.skyHexagon.grey,
  DEFAULT_LATTICE_TUNING_BY_STYLE.skySpotlight.grey
);

const home = {
  heroSlideDesc0: 'Lead zero',
  heroSlideDesc1: 'Lead one',
  heroSlideDesc2: 'Lead two'
};

assert.equal(getHeroLead(home, 0), 'Lead zero');
assert.equal(getHeroLead(home, 99), 'Lead zero');
assert.equal(getHeroLead({}, 0), '');

console.log('assert-home-hero-types: ok');
```

- [ ] **Step 2: Run assert — expect FAIL**

Run: `npx tsx scripts/assert-home-hero-types.mts`  
Expected: FAIL (missing exports / still includes `skyHard`)

- [ ] **Step 3: Rewrite `homeHeroTypes.ts`**

Replace file contents with:

```ts
export type LatticeHeroMode = 'magnetic' | 'ripple' | 'spotlight' | 'connect' | 'paint';

export type LatticeHeroStyle =
  | 'skyHexagon'
  | 'skyRipple'
  | 'skySpotlight'
  | 'skyConnect'
  | 'skyPaint';

export type HeroStyle =
  | 'softSky'
  | LatticeHeroStyle
  | 'skyDeep'
  | 'skyGrid'
  | 'skyDots'
  | 'skyCalm';

export const LATTICE_HERO_STYLES: LatticeHeroStyle[] = [
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint'
];

export const HERO_STYLES: HeroStyle[] = [
  'softSky',
  ...LATTICE_HERO_STYLES,
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
];

export type LatticeTuning = {
  grey: number;
  hexWidth: number;
  influenceRadius: number;
  attraction: number;
  waveStrength: number;
  densifyStrength: number;
  linkCount: number;
  trailLength: number;
  trailBrightness: number;
};

const baseLattice = (partial: Partial<LatticeTuning>): LatticeTuning => ({
  grey: 210,
  hexWidth: 20,
  influenceRadius: 160,
  attraction: 0.85,
  waveStrength: 0.9,
  densifyStrength: 0.85,
  linkCount: 4,
  trailLength: 28,
  trailBrightness: 0.9,
  ...partial
});

export const DEFAULT_LATTICE_TUNING_BY_STYLE: Record<LatticeHeroStyle, LatticeTuning> = {
  skyHexagon: baseLattice({ grey: 210, hexWidth: 20, influenceRadius: 160, attraction: 0.85 }),
  skyRipple: baseLattice({ grey: 210, hexWidth: 20, influenceRadius: 180, waveStrength: 0.9 }),
  skySpotlight: baseLattice({ grey: 220, hexWidth: 20, influenceRadius: 200, densifyStrength: 0.85 }),
  skyConnect: baseLattice({ grey: 210, hexWidth: 22, influenceRadius: 140, linkCount: 4 }),
  skyPaint: baseLattice({ grey: 215, hexWidth: 20, trailLength: 28, trailBrightness: 0.9 })
};

export function isLatticeHeroStyle(style: HeroStyle): style is LatticeHeroStyle {
  return (LATTICE_HERO_STYLES as string[]).includes(style);
}

export function getLatticeMode(style: LatticeHeroStyle): LatticeHeroMode {
  switch (style) {
    case 'skyHexagon':
      return 'magnetic';
    case 'skyRipple':
      return 'ripple';
    case 'skySpotlight':
      return 'spotlight';
    case 'skyConnect':
      return 'connect';
    case 'skyPaint':
      return 'paint';
  }
}

export type HeroSlide = { title: string; cta: string; image?: string };

export function getHeroLead(home: Record<string, unknown>, copyIndex: number): string {
  const safeIndex = copyIndex >= 0 && copyIndex <= 2 ? copyIndex : 0;
  const key = `heroSlideDesc${safeIndex}` as const;
  const value = home[key];
  return typeof value === 'string' ? value : '';
}
```

- [ ] **Step 4: Run assert — expect PASS**

Run: `npx tsx scripts/assert-home-hero-types.mts`  
Expected: `assert-home-hero-types: ok`

- [ ] **Step 5: Commit** (skip if user has not requested commits / repo policy forbids)

```bash
git add src/components/homeHeroTypes.ts scripts/assert-home-hero-types.mts
git commit -m "$(cat <<'EOF'
feat: add lattice hero style types and per-style defaults

EOF
)"
```

---

### Task 2: Remove Sky polygons + wire HomeHero to lattice modes

**Files:**
- Delete: `src/components/HomeHeroP5Sky.tsx`
- Modify: `src/components/HomeHero.tsx`
- Modify: `src/App.tsx` (imports only enough to compile — full slider work in Task 4; for this task, temporarily pass active lattice tuning + mode so `tsc` can pass after Task 3)

**Interfaces:**
- Consumes: `isLatticeHeroStyle`, `getLatticeMode`, `LatticeTuning`, `LatticeHeroMode` from Task 1
- Produces: `HomeHero` props `latticeMode` + `latticeTuning` (replace `hexagonTuning`)

- [ ] **Step 1: Update `HomeHero.tsx`**

Replace imports and background mapping:

```tsx
import type { ComponentType, Ref } from 'react';
import { motion } from 'motion/react';
import type { HeroSlide, HeroStyle, LatticeHeroMode, LatticeTuning } from './homeHeroTypes';
import { isLatticeHeroStyle } from './homeHeroTypes';
import { HomeHeroP5Hexagons } from './HomeHeroP5Hexagons';

function skyBaseClass(style: HeroStyle): string {
  if (style === 'skyDeep') return 'home-sky-drift home-sky-drift--deep';
  if (style === 'skyCalm') return 'home-sky-drift home-sky-drift--calm';
  if (isLatticeHeroStyle(style)) return 'bg-white';
  return 'home-sky-drift';
}

// In props: replace hexagonTuning with:
//   latticeMode: LatticeHeroMode;
//   latticeTuning: LatticeTuning;

// Background:
const p5Background = isLatticeHeroStyle(style) ? (
  <HomeHeroP5Hexagons
    key={style}
    className="absolute inset-0 z-0 h-full w-full"
    mode={latticeMode}
    tuning={latticeTuning}
  />
) : null;
```

- [ ] **Step 2: Delete `src/components/HomeHeroP5Sky.tsx`**

- [ ] **Step 3: Temporary App compile fix**

In `App.tsx`, change imports from `DEFAULT_HEXAGON_HERO_TUNING, HexagonHeroTuning` to:

```ts
import {
  getHeroLead,
  getLatticeMode,
  isLatticeHeroStyle,
  DEFAULT_LATTICE_TUNING_BY_STYLE,
  type HeroStyle,
  type LatticeHeroStyle,
  type LatticeTuning
} from './components/homeHeroTypes';
```

Replace hexagon state with (full UI in Task 4):

```ts
const [latticeTuningByStyle, setLatticeTuningByStyle] = useState<Record<LatticeHeroStyle, LatticeTuning>>(
  () => structuredClone(DEFAULT_LATTICE_TUNING_BY_STYLE)
);

const activeLatticeStyle: LatticeHeroStyle | null = isLatticeHeroStyle(heroStyle) ? heroStyle : null;
const activeLatticeTuning = activeLatticeStyle
  ? latticeTuningByStyle[activeLatticeStyle]
  : DEFAULT_LATTICE_TUNING_BY_STYLE.skyHexagon;
```

Pass to `HomeHero`:

```tsx
latticeMode={activeLatticeStyle ? getLatticeMode(activeLatticeStyle) : 'magnetic'}
latticeTuning={activeLatticeTuning}
```

Keep existing Hexagon-only slider block temporarily keyed on `heroStyle === 'skyHexagon'` but update setters to write `latticeTuningByStyle.skyHexagon` so types compile. Full multi-style slider UI is Task 4.

- [ ] **Step 4: Commit** (if committing)

```bash
git add src/components/HomeHero.tsx src/App.tsx
git rm src/components/HomeHeroP5Sky.tsx
git commit -m "$(cat <<'EOF'
refactor: remove sky polygons hero and map lattice styles in HomeHero

EOF
)"
```

---

### Task 3: Implement five interaction modes in `HomeHeroP5Hexagons`

**Files:**
- Modify: `src/components/HomeHeroP5Hexagons.tsx`

**Interfaces:**
- Consumes: `LatticeHeroMode`, `LatticeTuning`
- Produces: `HomeHeroP5Hexagons({ className?, mode, tuning })`

- [ ] **Step 1: Change component signature + remount on mode**

```tsx
export function HomeHeroP5Hexagons({
  className,
  mode,
  tuning
}: {
  className?: string;
  mode: LatticeHeroMode;
  tuning: LatticeTuning;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tuningRef = useRef(tuning);
  tuningRef.current = tuning;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    // existing p5 bootstrap...
  }, [mode]); // remount sketch when mode changes (also keyed from HomeHero)

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      data-hero-p5-hexagon
      data-hero-lattice-mode={mode}
      style={{ backgroundColor: '#ffffff', pointerEvents: 'none' }}
    />
  );
}
```

- [ ] **Step 2: Shared draw scaffolding**

Inside the p5 sketch, keep `HexCell` with `cx, cy, x, y`. Add optional per-frame locals (not stored forever): scale and grey override.

Keep rebuild / syncSize / pointer tracking as today.

In `draw`:

```ts
const t = tuningRef.current;
const currentMode = modeRef.current;
const reduceMotion = prefersReducedMotion();
p.background(255);
const baseDotR = Math.max(1.05, t.hexWidth * 0.032);
const baseGrey = Math.round(t.grey);
```

Branch by `currentMode` after computing pointer state. Always ease magnetic positions back to rest when not magnetic (or only update x/y in magnetic mode — prefer: non-magnetic modes draw at `cx, cy` and reset `x,y` to rest to avoid leftover offset when switching).

- [ ] **Step 3: Magnetic mode**

Port existing pull logic using `t.influenceRadius`, `t.attraction`, `t.hexWidth`. Draw `circle(cell.x, cell.y, baseDotR * 2)` with `fill(baseGrey)`.

- [ ] **Step 4: Ripple mode**

```ts
type Wave = { x: number; y: number; born: number };
let waves: Wave[] = [];
let lastPointerX = pointerX;
let lastPointerY = pointerY;

// In pointer handler or draw: if moved > 6px and pointerInside, push wave; keep max 4
// age = (millis() - born) / 1000
// radius = age * (influenceRadius * 1.2)
// ringWidth = hexWidth * 0.9
// for each cell: d = dist to wave; band = 1 - abs(d - radius)/ringWidth; if band>0:
//   scaleBoost = band * waveStrength * 0.85
//   greyDelta = band * waveStrength * 55  (darker)
// draw with radius baseDotR * (1 + scaleBoost), grey = baseGrey - greyDelta
// remove waves with age > 0.85
```

If `reduceMotion`, skip spawning/drawing waves.

- [ ] **Step 5: Spotlight mode**

No positional nudge. For each cell:

```ts
const dist = hypot(pointerX - cx, pointerY - cy);
let scale = 1;
let grey = baseGrey;
if (!reduceMotion && pointerInside && dist < influenceRadius) {
  const falloff = 1 - dist / influenceRadius;
  const s = falloff * falloff * (3 - 2 * falloff) * densifyStrength;
  scale = 1 + s * 1.35;
  grey = Math.round(baseGrey - s * 70);
}
p.fill(grey, grey, grey);
p.circle(cx, cy, baseDotR * 2 * scale);
```

- [ ] **Step 6: Connect mode**

Dots at rest with base grey. If pointer inside and not reduced motion:

```ts
// compute distances, pick nearest clamp(linkCount, 3, 6)
// stroke(baseGrey, alpha); strokeWeight(1); line(pointer, cell)
// slightly enlarge linked dots
```

- [ ] **Step 7: Paint mode**

```ts
type TrailSample = { x: number; y: number; born: number };
let trail: TrailSample[] = [];
// each draw while pointerInside: push sample; trim to trailLength
// for each cell: max influence from samples by distance < hexWidth * 1.1
// ageFade = 1 - age/life; life ~ 0.7s
// brightness = trailBrightness * ageFade * proximity
// grey = baseGrey - brightness * 90; scale = 1 + brightness * 0.6
```

- [ ] **Step 8: Typecheck**

Run: `npm run lint`  
Expected: exit 0

- [ ] **Step 9: Manual smoke** (dev server)

Run: `npm run dev`  
Verify each of the five lattice modes reacts distinctly to cursor; reduced-motion freezes interaction.

- [ ] **Step 10: Commit** (if committing)

```bash
git add src/components/HomeHeroP5Hexagons.tsx
git commit -m "$(cat <<'EOF'
feat: add ripple, spotlight, connect, and paint lattice modes

EOF
)"
```

---

### Task 4: Demo panel — per-style sliders + i18n + dropdown

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/i18n/locales/en/demo.json`
- Modify: `src/i18n/locales/zh-Hant/demo.json`
- Modify: `src/i18n/locales/zh-Hans/demo.json`

**Interfaces:**
- Consumes: `isLatticeHeroStyle`, `LATTICE_HERO_STYLES` / defaults from Task 1
- Produces: dropdown options for four new styles; tuning panel when `isLatticeHeroStyle(heroStyle)`

- [ ] **Step 1: Add i18n keys (all three locales)**

English keys to add (and translate for zh-Hant / zh-Hans):

```json
"heroStyleSkyRipple": "Ripple (p5)",
"heroStyleSkySpotlight": "Spotlight (p5)",
"heroStyleSkyConnect": "Connect (p5)",
"heroStyleSkyPaint": "Paint trail (p5)",
"latticeTuningTitle": "Lattice tuning",
"latticeTuningHelp": "Only applies to the selected lattice (p5) style. Values are kept per style.",
"hexagonWaveLabel": "Wave strength",
"hexagonWaveHelp": "How strong each ripple pulse scales and darkens dots.",
"hexagonWaveAria": "Ripple wave strength",
"hexagonDensifyLabel": "Densify strength",
"hexagonDensifyHelp": "How much near-cursor dots enlarge and darken.",
"hexagonDensifyAria": "Spotlight densify strength",
"hexagonLinkCountLabel": "Link count",
"hexagonLinkCountHelp": "How many nearest dots connect to the cursor (3–6).",
"hexagonLinkCountAria": "Connect link count",
"hexagonTrailLengthLabel": "Trail length",
"hexagonTrailLengthHelp": "How many recent cursor samples brighten the path.",
"hexagonTrailLengthAria": "Paint trail length",
"hexagonTrailBrightnessLabel": "Trail brightness",
"hexagonTrailBrightnessHelp": "How bright the fading paint path becomes.",
"hexagonTrailBrightnessAria": "Paint trail brightness"
```

Remove: `heroStyleSkyHard` from all three locale files.

Keep existing hexagon grey/influence/attraction/width keys; retitle panel to use `latticeTuningTitle` / `latticeTuningHelp`.

Chinese (zh-Hant) examples:

```json
"heroStyleSkyRipple": "漣漪（p5）",
"heroStyleSkySpotlight": "聚光（p5）",
"heroStyleSkyConnect": "連線（p5）",
"heroStyleSkyPaint": "繪跡（p5）",
"latticeTuningTitle": "點陣調校",
"latticeTuningHelp": "僅套用至目前選取的點陣（p5）樣式；各樣式的數值互不共用。"
```

zh-Hans:

```json
"heroStyleSkyRipple": "涟漪（p5）",
"heroStyleSkySpotlight": "聚光（p5）",
"heroStyleSkyConnect": "连线（p5）",
"heroStyleSkyPaint": "绘迹（p5）",
"latticeTuningTitle": "点阵调校",
"latticeTuningHelp": "仅套用至当前选取的点阵（p5）样式；各样式的数值互不共用。"
```

(Translate the new slider label/help/aria strings similarly.)

- [ ] **Step 2: Dropdown options in App**

```tsx
<option value="softSky">{demo.heroStyleSoftSky}</option>
<option value="skyHexagon">{demo.heroStyleSkyHexagon}</option>
<option value="skyRipple">{demo.heroStyleSkyRipple}</option>
<option value="skySpotlight">{demo.heroStyleSkySpotlight}</option>
<option value="skyConnect">{demo.heroStyleSkyConnect}</option>
<option value="skyPaint">{demo.heroStyleSkyPaint}</option>
<option value="skyDeep">{demo.heroStyleSkyDeep}</option>
<option value="skyGrid">{demo.heroStyleSkyGrid}</option>
<option value="skyDots">{demo.heroStyleSkyDots}</option>
<option value="skyCalm">{demo.heroStyleSkyCalm}</option>
```

Remove `skyHard` option.

- [ ] **Step 3: Helper to patch active style tuning**

```ts
const patchActiveLattice = (patch: Partial<LatticeTuning>) => {
  if (!activeLatticeStyle) return;
  setLatticeTuningByStyle((prev) => ({
    ...prev,
    [activeLatticeStyle]: { ...prev[activeLatticeStyle], ...patch }
  }));
};
```

- [ ] **Step 4: Conditional slider panel**

Show when `activeLatticeStyle !== null`. Always show grey + hex width.

Then mode-specific:

- `skyHexagon`: influence + attraction
- `skyRipple`: influence + waveStrength (0.15–2, step 0.05)
- `skySpotlight`: influence + densifyStrength (0.15–2, step 0.05)
- `skyConnect`: influence + linkCount (3–6, step 1)
- `skyPaint`: trailLength (8–64, step 1) + trailBrightness (0.15–2, step 0.05)

Use `activeLatticeTuning` for `value=` bindings.

- [ ] **Step 5: Typecheck**

Run: `npm run lint`  
Expected: exit 0

- [ ] **Step 6: Commit** (if committing)

```bash
git add src/App.tsx src/i18n/locales/en/demo.json src/i18n/locales/zh-Hant/demo.json src/i18n/locales/zh-Hans/demo.json
git commit -m "$(cat <<'EOF'
feat: add lattice hero demo options with per-style sliders

EOF
)"
```

---

### Task 5: Playwright smoke + verify

**Files:**
- Modify: `e2e/home-hero.spec.ts`

- [ ] **Step 1: Extend e2e**

Add:

```ts
test('demo can select ripple lattice hero', async ({ page }) => {
  await page.getByRole('button', { name: /demo style controls|切換演示樣式控制台|切换演示样式控制台/i }).click();
  await page.getByLabel(/hero visual style|主視覺外觀樣式|主视觉外观样式/i).selectOption('skyRipple');
  await expect(page.locator('[data-hero-style]')).toHaveAttribute('data-hero-style', 'skyRipple');
  await expect(page.locator('[data-hero-lattice-mode="ripple"]')).toBeVisible();
});
```

- [ ] **Step 2: Run assert + lint + e2e**

```bash
npx tsx scripts/assert-home-hero-types.mts
npm run lint
npx playwright test e2e/home-hero.spec.ts
```

Expected: all pass.

- [ ] **Step 3: Commit** (if committing)

```bash
git add e2e/home-hero.spec.ts
git commit -m "$(cat <<'EOF'
test: smoke ripple lattice hero style switch

EOF
)"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Four new top-level styles + keep Hexagon | 1, 4 |
| Per-style independent tuning | 1, 4 |
| Core + mode-specific sliders | 4 |
| Ripple / Spotlight / Connect / Paint behaviors | 3 |
| Remove skyHard + HomeHeroP5Sky | 2 |
| Reduced motion static lattice | 3 |
| White lattice visual language | 3 |
| Assert / e2e updates | 1, 5 |

## Self-review notes

- No `skyHard` left in types, App, HomeHero, i18n, or asserts.
- `HexagonHeroTuning` fully replaced by `LatticeTuning` to avoid dual types.
- `HomeHero` uses `key={style}` so mode switches remount canvas and clear waves/trails.
- Slider values stored in `Record<LatticeHeroStyle, LatticeTuning>` — switching styles cannot overwrite another style’s values.

# Hex lattice hero modes — design

**Date:** 2026-07-17  
**Status:** Approved for planning  
**Scope:** Add four cursor-interaction hero styles on the shared hex lattice; remove Sky polygons (p5).

## Goal

Give the demo menu more “alive” lattice hero options that are easy to understand on a white field of light grey dots, without photo carousels or the previous sky-polygon sketch.

## Decisions (locked)

1. **Four new top-level hero styles** alongside existing Hexagon (magnetic). Not a sub-mode dropdown under one Hexagon entry.
2. **Per-style tuning state** — slider values are **not** shared when switching styles. Each lattice style keeps its own defaults and live values.
3. **Core + mode-specific sliders** — every lattice style exposes grey + hex width; each mode adds its own controls (see below).
4. **Remove Sky polygons (p5)** — delete `skyHard` and `HomeHeroP5Sky` and all related wiring/i18n/assert entries.

## Product surface

### Hero style dropdown (lattice family)

| Style id | Label (EN) | Interaction |
|---|---|---|
| `skyHexagon` | Hexagon (p5) | Magnetic nudge toward cursor (existing) |
| `skyRipple` | Ripple (p5) | Cursor motion emits a short expanding wave of scale/opacity through the lattice |
| `skySpotlight` | Spotlight (p5) | Dots near cursor get larger/darker; far dots stay faint |
| `skyConnect` | Connect (p5) | Temporary thin links to the nearest 3–6 dots |
| `skyPaint` | Paint trail (p5) | Short fading path of brighter dots under the cursor |

### Removed

| Style id | Action |
|---|---|
| `skyHard` | Remove from types, dropdown, i18n, HomeHero branch; delete `HomeHeroP5Sky.tsx` |

Unchanged CSS sky variants (`softSky`, `skyDeep`, `skyGrid`, `skyDots`, `skyCalm`) stay as they are.

## Visual language

- White canvas background.
- Lattice of light grey dots on hex centers (no hex borders/fills).
- Brand/copy/CTA layout unchanged — these are background-only demos.
- Canvas remains `pointer-events: none`; pointer tracked via `window` `pointermove` (same as Hexagon today).
- `prefers-reduced-motion: reduce`: static lattice (no waves, links, trails, or nudges).

## Architecture

### Single p5 component + mode

Extend `HomeHeroP5Hexagons` with:

```ts
mode: 'magnetic' | 'ripple' | 'spotlight' | 'connect' | 'paint'
```

`HomeHero` maps:

- `skyHexagon` → `mode="magnetic"`
- `skyRipple` → `mode="ripple"`
- `skySpotlight` → `mode="spotlight"`
- `skyConnect` → `mode="connect"`
- `skyPaint` → `mode="paint"`

Shared: lattice rebuild, resize, pointer tracking, grey/hexWidth reads from a live tuning ref.

### Per-style tuning in App

```ts
type LatticeHeroStyle =
  | 'skyHexagon'
  | 'skyRipple'
  | 'skySpotlight'
  | 'skyConnect'
  | 'skyPaint';

type LatticeTuning = {
  grey: number;
  hexWidth: number;
  // mode-specific (ignored by other modes)
  influenceRadius: number;
  attraction: number;       // magnetic
  waveStrength: number;     // ripple
  densifyStrength: number;  // spotlight
  linkCount: number;        // connect (3–6)
  trailLength: number;      // paint
  trailBrightness: number;  // paint
};
```

`App` holds `Record<LatticeHeroStyle, LatticeTuning>` initialized from per-style defaults. Demo sliders read/write only the active style’s entry. Switching styles remounts or swaps `mode` + that style’s tuning object; values of inactive styles are preserved.

### Demo sliders by style

| Style | Sliders |
|---|---|
| Hexagon | grey, influence radius, attraction, hex width |
| Ripple | grey, hex width, influence radius, wave strength |
| Spotlight | grey, hex width, influence radius, densify strength |
| Connect | grey, hex width, influence radius, link count (3–6) |
| Paint | grey, hex width, trail length, trail brightness |

Show the lattice tuning panel whenever the active `heroStyle` is any of the five lattice ids (not only Hexagon).

## Behavior details

### Magnetic (`skyHexagon`)

Keep current behavior: dots ease toward cursor within influence radius; pull magnitude = `hexWidth * attraction` with smooth falloff.

### Ripple (`skyRipple`)

- On meaningful pointer movement, spawn a wave at cursor with age `t = 0`.
- Wave radius grows; dots near the ring briefly increase scale and opacity (brighter/darker relative to base grey), then settle.
- Cap concurrent waves (e.g. 3–4) so fast mouse motion does not flood.
- `waveStrength` scales peak scale/opacity delta; `influenceRadius` seeds initial/max ring size.

### Spotlight (`skySpotlight`)

- No positional nudge.
- Per-dot scale and darkness fall off smoothly with distance to cursor using `influenceRadius`.
- `densifyStrength` scales how much larger/darker near dots get.
- Outside influence: base faint grey at base size.

### Connect (`skyConnect`)

- Each frame (while pointer inside), find nearest `linkCount` dots (clamped 3–6).
- Draw thin light-grey lines from cursor to those dots; opacity softens with distance.
- When pointer leaves hero, lines disappear immediately (or fade in ≤150ms).
- Dots stay on lattice (no magnetic pull) unless we later decide otherwise — **locked: no pull**.

### Paint (`skyPaint`)

- Ring buffer of recent pointer samples; length controlled by `trailLength`.
- Dots near recent samples brighten (and optionally slightly enlarge); older samples fade.
- `trailBrightness` controls peak brightness of the trail.
- Idle or pointer leave: trail fades out.

## Defaults (sensible starting points)

| Field | Hexagon | Ripple | Spotlight | Connect | Paint |
|---|---|---|---|---|---|
| grey | 210 | 210 | 220 | 210 | 215 |
| hexWidth | 20 | 20 | 20 | 22 | 20 |
| influenceRadius | 160 | 180 | 200 | 140 | — |
| attraction | 0.85 | — | — | — | — |
| waveStrength | — | 0.9 | — | — | — |
| densifyStrength | — | — | 0.85 | — | — |
| linkCount | — | — | — | 4 | — |
| trailLength | — | — | — | — | 28 |
| trailBrightness | — | — | — | — | 0.9 |

Unused fields may exist on the shared type for simplicity but must not affect other modes.

## Files touched (expected)

- `src/components/homeHeroTypes.ts` — add styles; remove `skyHard`; lattice tuning types/defaults
- `src/components/HomeHeroP5Hexagons.tsx` — modes + behaviors
- `src/components/HomeHero.tsx` — map styles; drop P5Sky
- Delete `src/components/HomeHeroP5Sky.tsx`
- `src/App.tsx` — dropdown options; per-style tuning state + conditional sliders
- `src/i18n/locales/{en,zh-Hant,zh-Hans}/demo.json` — labels; remove skyHard keys; add new style + slider strings
- `scripts/assert-home-hero-types.mts` — update style list
- `e2e/home-hero.spec.ts` — smoke if it asserts style list / skyHard

## Out of scope

- Changing hero copy, CTA, or navbar chrome
- Shipping a non-demo production default to one of the new modes (demo switch only)
- Touch-specific gestures beyond pointer tracking
- Restoring or redesigning sky polygons

## Success criteria

- Demo can select all five lattice styles; each shows distinct cursor feedback.
- Switching styles preserves each style’s last slider values.
- Sky polygons option and code are gone; app builds/lints clean.
- Reduced-motion users see a static lattice.

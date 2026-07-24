# Festival hero pattern reveal — design

**Date:** 2026-07-24  
**Branch / worktree:** `profile-hero`  
**Status:** Approved for planning

## Goal

When the festival announcement bar is present, hide a tiling dragon-pattern image under the home hero and reveal it only through a cursor-following circular mask across the whole hero section. Existing Simplify / Excellence spotlight effects remain unchanged.

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Reveal scope | Full hero section (anywhere the cursor moves) |
| Word spotlight | Keep cyan stroke + gold glow as today |
| Hole size | Same as word spotlight (~118px radius, ~36px feather) |
| Approach | Festival underlay layer owned by `HomeHero` |
| Gate | Tied to `showFestivalBar` (demo toggle + dismiss both remove reveal) |

## Behavior

1. When `showFestivalBar` is `true`, the home hero mounts a full-bleed tiled dragon-pattern underlay behind the existing cyan/white hero surface.
2. Outside the cursor hole, the pattern is fully hidden (decorative underlay only).
3. A feathered circular mask (~118px + ~36px feather) follows the pointer and reveals the pattern through a “hole” in the hero.
4. Closing or toggling off the festival bar unmounts the underlay and stops mask tracking.
5. Non-home pages are unaffected.

## Layering (bottom → top)

1. Festival pattern underlay (cursor-masked; only when festival is on)
2. Existing hero fill / white glow / floor
3. Headline + Simplify / Excellence spotlight (unchanged)
4. CTA / scroll hint / other hero chrome

## Components & data flow

- **Asset:** Copy the provided dragon tile into the worktree as a static file, e.g. `public/festival/dragon-pattern.png`. Use CSS `background-image` + `background-repeat: repeat`.
- **`App`:** Pass `showFestivalReveal={showFestivalBar}` into `HomeHero`.
- **`HomeHero`:** When `showFestivalReveal` is true:
  - Track pointer position relative to the hero section root.
  - Prefer the same spring-follow feel as `HeroSimplifyAndExcellenceSpot` when practical; direct follow is acceptable fallback.
  - Render an absolute `inset-0` underlay with tiled background and `mask-image` / `-webkit-mask-image` as a feathered radial circle at the cursor.
  - Mark underlay `aria-hidden` and `pointer-events-none`.
- **`HeroSimplifyAndExcellenceSpot`:** No behavioral changes required for this feature.

## Edge cases

- **Festival off:** Underlay unmounts immediately; no leftover mask state.
- **Pointer off-hero:** Keep the hole parked off-canvas (or last in-hero point) so the pattern does not leak at edges.
- **a11y:** Decorative only — no interaction, no announcement.
- **Perf:** One additional masked DOM layer; no canvas.

## Out of scope

- Changing festival bar copy, colors, or layout
- Profile page hero changes
- Replacing or redesigning the word spotlight
- Larger/smaller reveal radius variants
- Mobile-specific alternate pattern or touch gesture redesign (desktop cursor path is the primary target; touch may simply show no hole or last position)

## Verification

- Festival on → move cursor across hero → pattern peeks at ~118px feathered hole
- Simplify stroke + Excellence gold glow still work during festival mode
- Festival off (close or demo toggle) → pattern gone
- Desktop and mobile layout remain correct (no overflow / z-index breakage)

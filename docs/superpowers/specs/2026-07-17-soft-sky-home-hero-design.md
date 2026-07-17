# Soft-sky alternative home hero — design

**Date:** 2026-07-17  
**Branch:** `feat/alternative-hero-section`  
**Status:** Approved for planning (pending user review of this spec)

## Problem

The current home hero uses a full-bleed image carousel with a dark dimming overlay so white text stays readable. Stakeholders dislike the dark/dimmed look. Reference sites ([Meltano](https://meltano.com/), [Synthesia](https://www.synthesia.io/), [Jamie](https://www.meetjamie.ai/), [Wehype](https://www.wehype.com/)) use light, centered text heroes without photo overlays.

## Goals

- Replace the image carousel with a **light, centered** hero.
- Keep **existing home hero copy** (titles, leads, CTAs).
- Provide a **demo switch** to compare curated soft-sky visual variants and copy sets.
- Preserve the rest of the home page and existing style-controls panel patterns.

## Non-goals

- Redesigning Latest News, bento, or other home sections.
- Adding new photography or restoring a dark full-bleed image hero as a demo option.
- Changing navbar architecture beyond what light text-on-sky already requires for contrast.
- Shipping a permanent production default selection UI (demo panel remains the comparison tool).

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Background family | Soft sky gradient with **slow flowing** radial drift |
| Content stack | **Title (2 lines) → lead (1–2 lines) → one CTA**, centered |
| Carousel images | **Removed** (no dimmed full-bleed photos) |
| Copy handling | All 3 existing slide messages available via demo **copy set**; **default = set 1** |
| Implementation approach | Sky family + **variant matrix** in existing demo panel |

## Structure

1. Remove home `Swiper` hero (images, pagination, dark overlay).
2. Render a full-viewport (min-height consistent with current hero) **centered** block:
   - Animated soft-sky background layers
   - `h1` with two visual lines (`whitespace-pre-line` or explicit `<br />` from existing `\n` titles)
   - Lead paragraph from `heroSlideDescN` (clamp to ~1–2 lines on desktop; allow wrap on mobile)
   - Single primary CTA using the selected slide’s `cta` label
3. Keep scroll-hint affordance if it remains readable on light sky (darken text/line as needed).
4. Navbar demos (`heroTransparent` / pill) stay; verify contrast on light sky and adjust only if broken.

## Demo controls

Extend the existing home **Style Controls** panel with:

### Hero style (`heroStyle`)

| Value | Description |
| --- | --- |
| `softSky` (default) | Soft cyan→white sky, slow drift (~16–22s) |
| `skyDeep` | Richer cyan blobs, same slow flow |
| `skyGrid` | Soft sky + faint technical grid lines |
| `skyDots` | Soft sky + light dot mesh |
| `skyCalm` | Near-flat wash, very subtle drift |

### Hero copy (`heroCopyIndex`)

| Value | Source |
| --- | --- |
| `0` (default) | `heroSlides[0]` + `heroSlideDesc0` |
| `1` | `heroSlides[1]` + `heroSlideDesc1` |
| `2` | `heroSlides[2]` + `heroSlideDesc2` |

i18n labels for both controls go in `demo.json` (en, zh-Hant, zh-Hans).

## Visual / motion

- Background: layered absolute elements with radial gradients (brand cyan family, e.g. primary `#11b8f5` tints on `#f7fbff` / white).
- Motion: CSS `@keyframes` drifting `background-position` (or equivalent transform on soft blobs). Slow, continuous, ease-in-out.
- `prefers-reduced-motion: reduce`: freeze to a static soft-sky frame (no drift).
- Foreground: dark text (`text-text` / muted opacity for lead); primary CTA using existing brand button patterns (adapt `SwipeBackgroundButton` or a light-theme CTA if the current one assumes dark hero).
- No floating badges, promo chips, or card chrome in the hero.
- Brand first: FDS identity remains clear via typography and CTA; no competing hero chrome.

## Mint blend / pagination

- Remove hero Swiper pagination.
- Default **mint-blend off** for sky heroes (light sky into bento should not need a heavy dark→mint ramp). Keep the existing demo checkbox so reviewers can still turn blend on if useful.

## Implementation sketch

- Prefer a focused component (e.g. `src/components/HomeHero.tsx`) plus small CSS (module or global keyframes) over growing `App.tsx` further; wire from the home branch in `App.tsx`.
- State: `heroStyle`, `heroCopyIndex` alongside existing demo state in `App`.
- Data: continue reading `home.heroSlides` and `home.heroSlideDesc0|1|2` from i18n catalogs — **no copy rewrite** in this change.
- CTA click behavior: preserve whatever current slide CTA does; if slides are not wired to routes yet, keep current behavior (no new routing scope).
- Accessibility: semantic `h1`, sufficient contrast, respect reduced motion, decorative background `aria-hidden`.

## Testing

- Manual: switch all 5 hero styles × 3 copy sets; check desktop + mobile.
- Confirm no image requests for old Unsplash hero slide URLs on home load.
- Confirm reduced-motion freezes animation.
- Smoke existing style controls (bento, nav layout) still work.

## Out of scope follow-ups

- Permanently picking one variant as production default and removing the demo panel.
- Editorial rewrite of titles/leads.
- Adding a secondary CTA.

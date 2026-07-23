# Profile Interactive Hero → Home Hero (Full Swap)

**Date:** 2026-07-21  
**Branch / worktree:** `profile-hero`  
**Status:** Approved for planning

## Goal

Replace the front-page (home) hero with the interactive spotlight hero formerly used on the Profile page: badge, “Design to”, mouse-follow **Simplify / Excellence.** treatment, subtitle, and CTA. Profile keeps an empty hero placeholder (no duplicate).

## Decision

**Full swap (option A):** The interactive headline stack becomes the home hero content. Soft-sky / p5 backgrounds, hero style switcher, hexagon tuning, and hero copy-index controls are removed from the home path.

## Architecture

```
App (home)
  └─ HomeHero
       ├─ nav portal + full-viewport chrome
       ├─ HeroSimplifyAndExcellenceSpot (interactive headline words)
       ├─ badge / “Design to” / subtitle / CTA
       └─ scroll hint (+ optional mint blend if still wired)
```

- Extract spotlight logic into `src/components/HeroSimplifyAndExcellenceSpot.tsx` (moved out of Profile).
- `HomeHero` owns layout, CTA, scroll hint, and nav portal; it no longer takes `style`, `hexagonTuning`, or slide-driven titles for the primary headline.
- Profile page continues with an empty hero `<section>` only.

## Home hero content (first viewport)

| Element | Behavior |
|--------|----------|
| Badge | From `home` i18n (ex-profile `heroBadge`) |
| Line 1 | Static “Design to” (localized) |
| Lines 2–3 | Interactive `HeroSimplifyAndExcellenceSpot` |
| Subtitle | From `home` i18n (ex-profile `heroSubtitle`) |
| CTA | Keep existing swipe CTA; scrolls to bento |
| Scroll hint | Keep existing vertical “Scroll Down” |

Background: light surface compatible with existing knockout (`bg-text/3` or equivalent home surface). No photo carousel, soft-sky drift, or p5 canvases.

Spotlight knockout color must match the home hero surface so the cyan fill / stroke reveal still reads correctly (same technique as Profile: `color-mix` against text/background tokens).

## i18n

Move / add under `home` for `en`, `zh-Hant`, `zh-Hans`:

- `heroBadge`
- `heroDesignTo` (the “Design to” line)
- `simplifySpot`
- `excellenceSpot`
- `heroSubtitle`

Remove from the home UI path (and clean keys if unused):

- Slide-driven titles / `heroSlides` as the primary headline source
- Demo controls for hero style, hexagon tuning, and hero copy index

Profile i18n: hero spot keys stay removed (already cleared). Do not reintroduce the interactive hero on Profile.

## App wiring cleanup

In `App.tsx` home branch:

- Stop passing `heroStyle`, `hexagonTuning`, slide title/lead from `heroSlides` / `getHeroLead` into `HomeHero` for the primary content.
- Remove demo panel controls for hero style, hexagon tuning, and hero copy index.
- Keep CTA → bento scroll and nav portal behavior.

Optional follow-up (same plan if cheap): delete unused `HomeHeroP5Sky`, `HomeHeroP5Hexagons`, and unused `homeHeroTypes` style enums once nothing references them. If e2e (`home-hero.spec.ts`) or `assert-home-hero-types.mts` assert old styles, update or remove those tests to match the new hero.

## Out of scope

- Redesigning Profile tabs, stats, partnerships, or certified sections
- New visual redesign beyond relocating the existing interactive treatment
- Keeping soft-sky / hexagon as alternate styles

## Success criteria

1. Visiting `/` (home) shows the interactive Profile-style hero in the first viewport.
2. Mouse movement reveals the spotlight stroke / gold glow on Simplify / Excellence as before.
3. CTA and scroll hint still work; nav portal still mounts into the hero.
4. Profile page has no interactive hero duplicate.
5. `npm run lint` (`tsc --noEmit`) passes.

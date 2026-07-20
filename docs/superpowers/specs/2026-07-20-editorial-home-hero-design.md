# Editorial home hero (Oliwia-inspired)

Date: 2026-07-20  
Branch / worktree: `experiment/new-hero-section`  
Reference: [omikolajczak.com](https://omikolajczak.com/) hero (layout/look), FDS copy from prior home hero

## Goal

Restore a home-page hero in the worktree as a **near-literal visual clone** of the reference hero stack, using **existing FDS headline + lead** (not the reference designer’s copy). No status pill. No in-hero CTA.

## Decisions (locked)

| Topic | Choice |
|--------|--------|
| Fidelity | Near-literal visual clone; swap identity/copy for FDS |
| Copy | Prior home hero: “Design to Simplify Your Enterprise.” + former slide-0 lead |
| Status pill | Omitted |
| Implementation | New `HomeHero` component + i18n + mount in `App.tsx` |
| Navbar | Unchanged |

## Visual design

- Full-viewport (or near) centered section on flat site `background` (`#f9fdff` / theme token). No photo, mesh, or p5 sky.
- Vertical stack, horizontally centered:
  1. **H1** — large serif, dark text, `whitespace-pre-line` for the intentional line break.
  2. **Lead** — muted sans (`text-text/60`), constrained max-width (~`max-w-2xl`), centered.
- Generous vertical whitespace; portfolio/news content begins below the fold.
- Entrance: light staggered fade/rise on load (`motion`), respect `prefers-reduced-motion`.
- Accent: no green “available” dot; no orange sunburst. Brand remains the existing FDS logo in the navbar.

## Copy (i18n)

Keys in `home.json` for `en`, `zh-Hans`, `zh-Hant`:

- `heroTitle` — restore prior primary slide title (EN example: `Design to Simplify \nYour Enterprise.`)
- `heroLead` — restore prior `heroSlideDesc0` text

Chinese locales use the previous localized titles/leads from the removed hero strings (not new marketing copy).

## Architecture

```
App (home branch)
  └── HomeHero { title, lead }
        reads via props from ns('home')
```

- **Create:** `src/components/HomeHero.tsx` — presentational; props `title: string`, `lead: string`.
- **Wire:** Mount as first child of home `<main>` before Latest News.
- **CSS:** Import a serif display font (e.g. Fraunces or Source Serif 4) in `index.css`; apply only to hero H1 (e.g. utility or scoped class). Keep Inter for body/UI.
- **Scroll snap:** Reintroduce hero as first snap target — from page top, first intentional snap goes to Latest News; upward into hero snaps to top (`0`) as before the removal.

## Out of scope

- Status / availability pill
- In-hero CTA button
- Hero style demo controls, hexagon/p5 backgrounds, mint blend
- Restyling navbar to reference pills
- Changing heroes on other routes (Services, Profile, Career, etc.)
- Removing dormant `heroTransparent` navbar mode (leave as-is)

## Acceptance

- Worktree home page shows the editorial hero above Latest News.
- Desktop look matches the reference composition (centered type stack, whitespace, no hero CTA/pill).
- EN + both ZH locales show restored FDS title/lead.
- `npm run lint` (`tsc --noEmit`) passes.
- Dev server on the worktree (port 3001) renders without console errors from the new hero.

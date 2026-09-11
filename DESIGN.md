---
name: FDS Solutions Limited
description: Cyan-on-ice official site for a Hong Kong systems integrator and the Focal product suite.
colors:
  primary: "#11b8f5"
  interactive: "#11b8f5"
  secondary: "#7f9bfa"
  accent: "#514ef7"
  text: "#01141a"
  background: "#f9fdff"
  ice: "#f6fbff"
  navy: "#071427"
  utility-navy: "#0a1f44"
  enquiry-navy: "#294877"
  white: "#ffffff"
  chrome-bar: "#f4f7fa"
  chrome-well: "#eef4f8"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.35rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  chrome: "1.75rem"
  plate: "2rem"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.enquiry-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-secondary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
  button-inverse:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-enquiry:
    backgroundColor: "{colors.interactive}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-enquiry-hover:
    backgroundColor: "{colors.enquiry-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
  button-form:
    backgroundColor: "{colors.interactive}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    height: "56px"
    padding: "0 24px"
  input-text:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    height: "52px"
    padding: "0 16px"
  card-surface:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "28px 36px"
  chrome-frame:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.chrome}"
  nav-pill:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  chip-product:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: FDS Solutions Limited

## Overview

**Creative North Star: "Design to Simplify as a cyan-on-ice systems-integrator desk"**

This is the public desk of **FDS Solutions Limited**: a Hong Kong enterprise and government systems integrator with an owned **Focal** product suite. The room is ice-white and quiet. Cyan is the instrument on the desk—the enquiry pill, the interactive hover, the one accent word in a headline—not a consumer-SaaS glow and not a generic agency purple wash. Voice stays professional, governed, and low-drama. The binding line is **Design to Simplify**.

Density is scannable rather than sparse: a buyer should read who FDS is and what a Focal product does without decoding a concept poster. Product evidence sits in lifted chrome plates (browser frames around real UI). Marketing actions are capsules. Page ground is ice; navy is a band, not the default field.

Confirmed visual rejections: government or client logos until consent exists; generic agency purple-to-blue gradients; recasting FDS as consumer SaaS or a creative shop.

**Key Characteristics:**
- Inter only, bold tracking-tight headlines, cyan accent word inside the title
- Ice page ground with lifted white and chrome plates
- Rounded-full primary CTAs; browser-chrome product shots
- Cyan for action; navy for utility chrome and dark product bands
- Trilingual surfaces (English, Traditional Chinese, Simplified Chinese) inherit the same type ramp and color roles

## Colors

A cool ice field, near-black ink, and one loud Focal cyan. Periwinkle and violet exist in the theme as supporting notes; they do not compete with cyan.

### Primary
- **Focal Cyan** (`primary` / `interactive`): Enquiry pills, product-page CTAs, headline accent spans, focus rings, and interactive hover. In the default profile the two tokens match. A demo navy profile remaps `primary` to a deep blue while `interactive` stays cyan so filled CTAs and nav swipe remain Focal cyan.

### Secondary
- **Desk Periwinkle** (`secondary`): Supporting focus treatment in glass menus. Not a second brand fill.

### Tertiary
- **Instrument Violet** (`accent`): Rare supporting wash (form-plate bloom, navy-profile hover). Never the page field and never a purple-gradient hero.

### Neutral
- **Ink** (`text`): Body copy and UI chrome. Body paragraphs typically sit at ink with reduced opacity (`/60`–`/70`); labels and titles stay solid.
- **Canvas** (`background`): Default document fill from the theme.
- **Ice Ground** (`ice`): Recurring page and section ground across home, contact, news, and Focal product bands—slightly cooler than canvas.
- **White** (`white`): Lifted plates, inputs, secondary capsules, inverse CTAs on cyan bands.
- **Navy Band** (`navy`): Dark product sections and emphasis strips. White type; cyan still marks action.
- **Utility Navy** (`utility-navy`): Top utility bar and the default filled-button hover on forms.
- **Enquiry Navy** (`enquiry-navy`): Hover on nav enquiry and several home CTAs—cyan at rest, this navy on hover.
- **Chrome Bar / Well** (`chrome-bar`, `chrome-well`): Title-bar grey and screenshot well inside browser frames.

### Named Rules
**The Cyan Voice Rule.** Focal cyan is the only loud color. It marks CTAs, interactive states, and at most one accent span in a headline. Ice, white, and navy carry area.

**The Ice Desk Rule.** Page ground is ice or canvas. Do not fill a section with a purple-to-blue agency gradient.

## Typography

**Display Font:** Inter (with ui-sans-serif, system-ui)
**Body Font:** Inter (same stack)
**Label/Mono Font:** Inter; tabular/mono only for codes, file stubs, and step indices—not a second family

**Character:** One Swiss-engineered sans. Hierarchy is weight, size, and tracking-tight headlines—not a display serif, not a marketing script.

### Hierarchy
- **Display** (700, clamp 2.35rem–3.75rem, 1.08): Contact and flagship page titles. Tracking-tight. Some home/contact lines go larger; do not add a second family to get there.
- **Headline** (700, clamp 2.25rem–3.75rem, 1.08): Product-page `h1`. Pair with a cyan accent span on the key phrase, not on the whole title.
- **Title** (700, 1.5rem–2.25rem, 1.15): Section `h2` / card titles.
- **Body** (400, 1rem, 1.75): Leads and section copy in ink at reduced opacity. Medium 16–18px is used for hero leads.
- **Label** (600, 14px, tracking-tight): Nav items, uppercase. Form field captions are 14px semibold at ink `/70` without forced uppercase.

### Named Rules
**The One Family Rule.** Inter is the only typeface. Weight and size carry hierarchy. Do not introduce a display serif or a second sans.

**The Accent Word Rule.** A headline may color one phrase in Focal cyan. Do not cyan the entire title.

## Layout

Content lives on a **max-width 80rem** desk (`max-w-7xl`) with horizontal gutters of 16px / 24px / 32px at small / medium / large. Section padding is 64px, opening to 96px on large screens. Product pages pad the top for the fixed pill nav (roughly 6–10rem before the first heading).

The spatial model is a systems-integrator desk: left-aligned copy, evidence plates beside or below, not a centered poster. Two-column splits at the large breakpoint (copy | chrome, or 7/5 and 6/6 on product evidence). Hairline dividers use ink at ~5–8% opacity. A faint 42px ink grid sometimes textures ice sections; it stays decorative and low-contrast.

Nav is a full-bleed utility strip over a max-width pill. Home hero may go wider or use a viewport-based column; new product surfaces should return to the 80rem desk.

## Elevation & Depth

Hybrid: **tonal ice ground + lifted plates**. Resting cards and chrome frames use large, soft navy-tinted shadows—not hard offset drops. Hover adds a cyan-tinted bloom and a 1px rise. Dark navy bands invert the stack: chrome plates pick up a deeper black shadow so they still lift off navy.

Glass is reserved for the nav pill and solutions menu (white translucent fill, backdrop blur, white rim). It is not the default card material.

### Shadow Vocabulary
- **Plate rest** (`box-shadow: 0 18px 60px rgba(1,20,26,0.06)`): White cards on ice.
- **Chrome lift** (`box-shadow: 0 28px 80px rgba(1,20,26,0.12)`): Browser frames around product shots.
- **Cyan bloom** (`box-shadow: 0 12px 40px rgba(17,184,245,0.12)` or `shadow-xl` with primary at 20%): Primary CTA rest; card hover.
- **Nav glass** (`box-shadow: 0 12px 44px -10px rgba(10,31,68,0.22), inset 0 1px 0 rgba(255,255,255,0.85)`): Fixed pill header.
- **Menu** (`box-shadow: 0 28px 90px rgba(1,20,26,0.22)`): Solutions dropdown.
- **Navy-band chrome** (`box-shadow: 0 28px 80px rgba(0,0,0,0.35)`): Frames sitting on `navy`.
- **Focus halo** (`box-shadow: 0 0 0 4px rgba(17,184,245,0.12)`): Text fields. Buttons use a 2px `interactive` ring.

### Named Rules
**The Lifted Plate Rule.** White and chrome plates lift off ice with large, soft navy-tinted shadows. Hard offset drop-shadows are not this world. Hover tints the lift cyan; it does not invent a new silhouette.

## Shapes

Actions are **capsules** (`rounded-full`). Evidence and forms are **plates**: chrome frames at 1.75rem, marketing CTA bands at 2rem, cards at 24px, inputs at 16px, small icon wells at 8–12px. Product-name chips are capsules with a 1px cyan border and a 10% cyan fill.

Borders are hairline ink at 6–12% on white plates, white at 70% on glass, white at 8–10% on navy. Do not square off marketing CTAs. Do not fully round a product screenshot—the chrome frame’s 1.75rem radius is the clip.

## Components

### Buttons
Capsules for marketing and nav; a 16px-radius full-width block only on the enquiry form submit.

- **Shape:** Fully rounded capsules (9999px) for primary, secondary, inverse, and nav enquiry. Form submit uses 16px radius, 56px height, full width of the form plate.
- **Primary:** Cyan fill, white 14px bold label, 16px 32px padding, cyan bloom shadow. Product pages often keep cyan on hover and scale 1.02 / 0.98; home and nav enquiry hover to enquiry navy.
- **Secondary:** White fill, 1px ink/12 border, ink/80 label; hover border cyan/30 and label cyan.
- **Inverse:** White capsule on a cyan rounded plate (closing enquiry band). Cyan label, bold, often uppercase with wide tracking.
- **Hover / Focus:** 200–300ms color shift; `focus-visible` 2px interactive ring. Easing `cubic-bezier(0.22, 1, 0.36, 1)` where motion is explicit.

### Chips
Product-name chips: capsule, cyan/20 border, cyan/10 fill, 10px bold uppercase cyan label. Use as a product identifier on a Focal page hero—not as a section kicker stacked above every heading.

### Cards / Containers
- **Corner Style:** 24px on content cards; 2–2.5rem on the contact form plate; 1.75rem on chrome frames.
- **Background:** White on ice; white/90 glass on the contact form. Navy bands are full-bleed `navy`, not cards.
- **Shadow Strategy:** Plate rest at rest; cyan bloom and 1px translate on hover.
- **Border:** Ink at 5–8% opacity.
- **Internal Padding:** 20–36px; news/bento cards go denser at 28–36px.

### Inputs / Fields
- **Style:** White fill, 16px radius, 1px ink/10 border, 52px height, 16px horizontal padding, 14px medium Inter. Placeholders at ink/30.
- **Focus:** Border to cyan/50 plus the 4px cyan halo. No hard glow.
- **Error / Disabled:** Not a shared token yet—do not invent a red system beyond what a specific surface already ships.

### Navigation
Fixed header: navy utility bar (phone, email, locale) over a frosted white **pill** (full radius, white/80, blur, white rim). Links are 14px semibold uppercase ink/80; hover/focus reveals the same word in cyan via clip or scale. Enquiry is a cyan capsule, 11–12px bold uppercase, enquiry-navy hover. Solutions menu is a 24px glass plate with a cyan highlight pill. Mobile: full-radius icon button, then a stacked sheet—do not shrink the pill into a hamburger-only header on large screens.

### Browser chrome (signature)
Product shots sit in a white figure: 1.75rem radius, ink/8 border, chrome lift shadow. Title bar is `chrome-bar` with three 10px traffic-light dots and a 10px muted caption. The well is `chrome-well` (or white when the shot contains its own UI). This is how Focal evidence is shown—not a floating screenshot with a drop shadow and no frame.

### Cyan enquiry band (signature)
A 2rem-radius cyan plate, white type, soft white radial at the top, inverse white capsule CTA. Used to close Focal product pages.

## Do's and Don'ts

### Do:
- **Do** set page ground to ice or canvas and lift white/chrome plates off it.
- **Do** use Inter at the recorded ramp, with a single cyan accent span in product headlines.
- **Do** make marketing and nav CTAs rounded-full cyan capsules; put product screenshots in browser chrome frames.
- **Do** keep navy for the utility bar and dark product bands, not as a purple-tinted page fill.
- **Do** ship every visitor-facing surface in `en`, `zh-Hant`, and `zh-Hans` on the same layout.
- **Do** treat new Focal product pages as extensions of this desk—same tokens, chrome, and capsules.

### Don't:
- **Don't** display government or client logos until consent is confirmed.
- **Don't** fill heroes or sections with generic agency purple-to-blue gradients.
- **Don't** recast the site as consumer SaaS (playful display type, sticker UI, unearned metrics).
- **Don't** invent a second palette or type family for an individual Focal product.
- **Don't** square off primary CTAs or present product UI as unframed PDFs or spreadsheet dumps.
- **Don't** use Unsplash or stock photography as if it were FDS or client evidence.

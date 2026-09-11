# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitors are IT and procurement decision-makers at HKSAR departments and Hong Kong enterprises. They arrive while evaluating a systems integrator for business-process, document, workflow, capture, or web-content programmes, and need to judge whether FDS and the Focal suite fit a mission-critical engagement.

Job seekers (Career) and existing clients (FDS Care / contact) are real audiences on the site but are not the primary job.

## Product Purpose

This repository is the replacement official website for **FDS Solutions Limited**. It must help a qualified buyer understand who FDS is, what the Focal products do, and send an enquiry. Success is a serious enquiry from that buyer—not a generic bounce, and not an internal design review alone.

## Positioning

FDS is a Hong Kong systems integrator with local R&D and an owned **Focal** product suite (Capture, Document Management, Web Content Management, Workflow / case operations, and Focal AI), sold with the line **Design to Simplify**. The site’s distinctive claim is that combination: Hong Kong–made Focal products plus long-running public-sector contracting (SOA-QPS5 / OGCIO), not a generic agency landing page a neighboring SI could copy with different logos.

## Operating Context

Buyers are comparing integrators for government and enterprise programmes, often under Hong Kong office hours and public-sector procurement norms. The company operates from Kwun Tong (Nanyang Plaza) and publishes phone, fax, and `fdscall@fdssolutions.com.hk` as the enquiry path.

The site is a Vite + React hash-routed SPA (`#profile`, `#focal-ai`, `#workflow-management`, and related hashes). Copy currently lives in locale JSON (`src/i18n/locales/{en,zh-Hant,zh-Hans}/`). A floating style-controls panel exists in the home view; whether that ships on the public site is undecided.

Secondary operating facts on the site, not the primary visitor job: FDS Care maintenance schemes, Career applications to `recruit@fdssolutions.com.hk`, and methodologies named in Services copy (PRINCE, SLC3, SSADM, RAD, FREM/FPA/FORM).

## Capabilities and Constraints

Confirmed capabilities:

- Public pages: Home, Company Profile, Services, Career, Contact Us, Capture, Focal AI, Workflow Management, Document Management, Web Content Management, and individual news articles (hash prefix `#news/`).
- Trilingual UI: English, Traditional Chinese, Simplified Chinese (`en`, `zh-Hant`, `zh-Hans`).
- Enquiry via published contact details and the on-site message form.
- Hash-based SPA routing unless a later decision changes it.

Confirmed constraints:

- Do not display government or organizational logos until consent is confirmed (client marquee is currently disabled for this reason).
- Keep Focal / FOCAL product naming and **Design to Simplify**.
- Keep the published Hong Kong contact facts (address, phone `(852) 3100 7272`, fax `(852) 3100 7222`, `fdscall@fdssolutions.com.hk`, Mon–Fri 9:00 am–6:00 pm HKT, closed public holidays).

Undecided (do not invent a resolution):

- Whether homepage news cards and numeric claims that lack backing articles or assets are shippable as-is.
- Whether the home style-controls panel is public, internal-only, or removed.
- Whether production content stays in locale JSON or moves to a CMS.
- Accessibility standard beyond ordinary web practice.

## Brand Commitments

- Legal / public name: **FDS Solutions Limited**.
- Product family: **Focal** (also styled FOCAL in solution copy).
- Binding line: **Design to Simplify**.
- Voice in current copy: professional, Hong Kong enterprise / government SI—practical, governed, low-drama. Do not recast the company as a consumer SaaS or a generic creative agency.

## Evidence on Hand

Present in the project and usable as site evidence only where already represented:

- Company logo referenced at `/assets/fds-logo.png`.
- One fleshed-out news article: MyERBWeb revamp with ERB (`src/i18n/locales/*/newsArticles.json`, slug `my-erbweb-revamp`).
- Focal-flow video files at `public/assets/focal-flow/hero.mp4` and `hero2.mp4` (local assets; not yet wired as confirmed public hero media).
- Contact, hours, and address as listed under Constraints.
- Company claims already in site copy (treat as current public copy, not independently verified here): incorporated in Hong Kong in 1993; SOA-QPS5 awarded by OGCIO (copy says January 2022); SOA-QPS contractor since 2009; IBM FileNet and Qmatic named as platform / partnership references (profile page currently labels the latter “Qmatics”).

Must not be fabricated in future work, and must not be shown until the noted condition is met:

- Government / organizational logos exist under `public/assets/` (and in commented marquee data in `src/App.tsx`) but **must not appear** until consent is confirmed.
- Do not invent testimonials, unnamed “leading clients,” or performance metrics that are not already in confirmed copy or assets. Several homepage news items have titles/dates only—no article body—so they are not proof until given real content.
- Hero and Focal AI imagery currently includes Unsplash stock; that is placeholder photography, not FDS or client evidence.

## Product Principles

1. Serve the evaluating buyer first: Focal capabilities and FDS credibility should be scannable enough to justify an enquiry.
2. FDS is a Hong Kong SI with an owned Focal suite—not a interchangeable offshore implementer or a model-vendor AI lab.
3. In public-sector contexts, withhold third-party marks and unbacked claims until consent or evidence exists.
4. Every visitor-facing surface must work in English, Traditional Chinese, and Simplified Chinese.
5. The conversion that matters is a qualified enquiry during Hong Kong business hours.

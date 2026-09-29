<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fe9b7b8f-d442-4ad0-bf61-5bf30b426362

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Compare homepage heroes

The ribbon preview has a **Ribbon controls** button at the bottom right. Adjust movement strength and speed, plus river flow speed, visibility, thickness, density, and streak length. Settings preview immediately and persist in this browser; **Reset to defaults** restores the starting values. Pause/resume and device reduced-motion preferences apply to both effects.

This worktree previews the centered hero by default. The original `HomeHero.tsx` carousel, the editorial alternative, the ribbon layout, and the concentric-ring pulse remain available.

- Centered text with image below: `http://localhost:3000/?hero=centered`
- Editorial alternative: `http://localhost:3000/?hero=alternative`
- Original: `http://localhost:3000/?hero=original`
- Ribbon reference layout: `http://localhost:3000/?hero=ribbon` (current worktree preview: `http://localhost:3001/?hero=ribbon`). Uses FDS copy, the existing site navbar, local SVG ribbons, and existing customer logos. Available in **Demo Controls → Hero layout**.
- Concentric-ring pulse: `http://localhost:3000/?hero=rings` (worktree preview: `http://localhost:3001/?hero=rings`). Cream field, expanding rings, roman + italic headline, and a dark contact pill — same structure as the Instrumental “Bring us the problem” block, with FDS copy.
- Switch between layouts using **Demo Controls → Hero layout** in the bottom-left corner. The selected version stays in the URL when reloading or sharing a preview link. If running on a custom port, replace `3000` with that port (the current preview uses `3001`).

The alternatives live in `src/components/HomeHeroAlternative.tsx`, `src/components/HomeHeroCentered.tsx`, `src/components/HomeHeroRibbon.tsx`, and `src/components/HomeHeroRings.tsx`, each with an adjacent CSS file. They reuse the existing palette, navigation destinations, and translated content. Both English and Chinese are supported.

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

This worktree previews the centered hero by default. The original `HomeHero.tsx` carousel and the earlier editorial alternative remain available.

- Centered text with image below: `http://localhost:3000/?hero=centered`
- Editorial alternative: `http://localhost:3000/?hero=alternative`
- Original: `http://localhost:3000/?hero=original`
- Switch between all three using **Demo Controls → Hero layout** in the bottom-left corner. The selected version stays in the URL when reloading or sharing a preview link. If running on a custom port, replace `3000` with that port (the current preview uses `3055`).

The alternatives live in `src/components/HomeHeroAlternative.tsx` and `src/components/HomeHeroCentered.tsx`, each with an adjacent CSS file. They reuse the existing palette, image, navigation destinations, and translated content. Both English and Chinese are supported.

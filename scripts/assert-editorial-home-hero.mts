import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const locale of ['en', 'zh-Hans', 'zh-Hant'] as const) {
  const home = JSON.parse(readFileSync(join(root, `src/i18n/locales/${locale}/home.json`), 'utf8')) as Record<
    string,
    unknown
  >;
  if (typeof home.heroTitle !== 'string' || !home.heroTitle.trim()) {
    throw new Error(`${locale}: missing heroTitle`);
  }
  if (typeof home.heroLead !== 'string' || !home.heroLead.trim()) {
    throw new Error(`${locale}: missing heroLead`);
  }
  if (!String(home.heroTitle).includes('\n')) {
    throw new Error(`${locale}: heroTitle should include a line break`);
  }
}

const heroMod = await import('../src/components/HomeHero.tsx');
if (typeof heroMod.HomeHero !== 'function') {
  throw new Error('HomeHero export missing');
}
console.log('assert-editorial-home-hero: ok');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['en', 'zh-Hant', 'zh-Hans'] as const;
const required = [
  'heroBadge',
  'heroDesignTo',
  'simplifySpot',
  'excellenceSpot',
  'heroSubtitle',
  'heroCta',
  'scrollHint'
] as const;

for (const locale of locales) {
  const home = JSON.parse(
    readFileSync(join(root, `src/i18n/locales/${locale}/home.json`), 'utf8')
  ) as Record<string, unknown>;
  for (const key of required) {
    assert.equal(typeof home[key], 'string', `${locale}.home.${key} must be a non-empty string`);
    assert.ok(String(home[key]).length > 0, `${locale}.home.${key} must be non-empty`);
  }
  assert.equal(home.heroSlides, undefined, `${locale}.home.heroSlides must be removed`);
  assert.equal(home.heroSlideDesc0, undefined, `${locale}.home.heroSlideDesc0 must be removed`);
  assert.equal(home.heroSlideDesc1, undefined, `${locale}.home.heroSlideDesc1 must be removed`);
  assert.equal(home.heroSlideDesc2, undefined, `${locale}.home.heroSlideDesc2 must be removed`);
  assert.equal(home.heroImageAlt, undefined, `${locale}.home.heroImageAlt must be removed`);
}

console.log('assert-home-hero-i18n: ok');

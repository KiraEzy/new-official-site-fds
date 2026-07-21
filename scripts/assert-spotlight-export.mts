import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = join(
  dirname(fileURLToPath(import.meta.url)),
  '../src/components/HeroSimplifyAndExcellenceSpot.tsx'
);

await access(file);
const mod = await import('../src/components/HeroSimplifyAndExcellenceSpot.tsx');
assert.equal(typeof mod.HeroSimplifyAndExcellenceSpot, 'function');
console.log('assert-spotlight-export: ok');

import assert from 'node:assert/strict';
import { getHeroLead, HERO_STYLES } from '../src/components/homeHeroTypes.ts';

assert.deepEqual(HERO_STYLES, [
  'softSky',
  'skyHard',
  'skyHexagon',
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
]);

const home = {
  heroSlideDesc0: 'Lead zero',
  heroSlideDesc1: 'Lead one',
  heroSlideDesc2: 'Lead two'
};

assert.equal(getHeroLead(home, 0), 'Lead zero');
assert.equal(getHeroLead(home, 1), 'Lead one');
assert.equal(getHeroLead(home, 2), 'Lead two');
assert.equal(getHeroLead(home, 99), 'Lead zero');
assert.equal(getHeroLead({}, 0), '');

console.log('assert-home-hero-types: ok');

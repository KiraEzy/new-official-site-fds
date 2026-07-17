import assert from 'node:assert/strict';
import {
  getHeroLead,
  getLatticeMode,
  HERO_STYLES,
  isLatticeHeroStyle,
  LATTICE_HERO_STYLES,
  DEFAULT_LATTICE_TUNING_BY_STYLE
} from '../src/components/homeHeroTypes.ts';

assert.deepEqual(HERO_STYLES, [
  'softSky',
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint',
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
]);

assert.ok(!HERO_STYLES.includes('skyHard' as never));

assert.deepEqual(LATTICE_HERO_STYLES, [
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint'
]);

assert.equal(getLatticeMode('skyHexagon'), 'magnetic');
assert.equal(getLatticeMode('skyRipple'), 'ripple');
assert.equal(getLatticeMode('skySpotlight'), 'spotlight');
assert.equal(getLatticeMode('skyConnect'), 'connect');
assert.equal(getLatticeMode('skyPaint'), 'paint');

assert.equal(isLatticeHeroStyle('skyRipple'), true);
assert.equal(isLatticeHeroStyle('softSky'), false);

for (const style of LATTICE_HERO_STYLES) {
  const t = DEFAULT_LATTICE_TUNING_BY_STYLE[style];
  assert.ok(t.grey >= 140 && t.grey <= 240);
  assert.ok(t.hexWidth >= 10 && t.hexWidth <= 40);
}

assert.equal(DEFAULT_LATTICE_TUNING_BY_STYLE.skyHexagon.attraction, 0.85);
assert.equal(DEFAULT_LATTICE_TUNING_BY_STYLE.skyConnect.linkCount, 4);
assert.notEqual(
  DEFAULT_LATTICE_TUNING_BY_STYLE.skyHexagon.grey,
  DEFAULT_LATTICE_TUNING_BY_STYLE.skySpotlight.grey
);

const home = {
  heroSlideDesc0: 'Lead zero',
  heroSlideDesc1: 'Lead one',
  heroSlideDesc2: 'Lead two'
};

assert.equal(getHeroLead(home, 0), 'Lead zero');
assert.equal(getHeroLead(home, 99), 'Lead zero');
assert.equal(getHeroLead({}, 0), '');

console.log('assert-home-hero-types: ok');

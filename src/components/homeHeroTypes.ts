export type LatticeHeroMode = 'magnetic' | 'ripple' | 'spotlight' | 'connect' | 'paint';

export type LatticeHeroStyle =
  | 'skyHexagon'
  | 'skyRipple'
  | 'skySpotlight'
  | 'skyConnect'
  | 'skyPaint';

export type HeroStyle =
  | 'softSky'
  | LatticeHeroStyle
  | 'skyDeep'
  | 'skyGrid'
  | 'skyDots'
  | 'skyCalm';

export const LATTICE_HERO_STYLES: LatticeHeroStyle[] = [
  'skyHexagon',
  'skyRipple',
  'skySpotlight',
  'skyConnect',
  'skyPaint'
];

export const HERO_STYLES: HeroStyle[] = [
  'softSky',
  ...LATTICE_HERO_STYLES,
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
];

export type LatticeTuning = {
  grey: number;
  hexWidth: number;
  influenceRadius: number;
  attraction: number;
  waveStrength: number;
  densifyStrength: number;
  linkCount: number;
  trailLength: number;
  trailBrightness: number;
};

const baseLattice = (partial: Partial<LatticeTuning>): LatticeTuning => ({
  grey: 210,
  hexWidth: 20,
  influenceRadius: 160,
  attraction: 0.85,
  waveStrength: 0.9,
  densifyStrength: 0.85,
  linkCount: 4,
  trailLength: 28,
  trailBrightness: 0.9,
  ...partial
});

export const DEFAULT_LATTICE_TUNING_BY_STYLE: Record<LatticeHeroStyle, LatticeTuning> = {
  skyHexagon: baseLattice({ grey: 210, hexWidth: 20, influenceRadius: 160, attraction: 0.85 }),
  skyRipple: baseLattice({ grey: 210, hexWidth: 20, influenceRadius: 180, waveStrength: 0.9 }),
  skySpotlight: baseLattice({ grey: 220, hexWidth: 20, influenceRadius: 200, densifyStrength: 0.85 }),
  skyConnect: baseLattice({ grey: 210, hexWidth: 22, influenceRadius: 140, linkCount: 4 }),
  skyPaint: baseLattice({ grey: 215, hexWidth: 20, trailLength: 28, trailBrightness: 0.9 })
};

export function isLatticeHeroStyle(style: HeroStyle): style is LatticeHeroStyle {
  return (LATTICE_HERO_STYLES as string[]).includes(style);
}

export function getLatticeMode(style: LatticeHeroStyle): LatticeHeroMode {
  switch (style) {
    case 'skyHexagon':
      return 'magnetic';
    case 'skyRipple':
      return 'ripple';
    case 'skySpotlight':
      return 'spotlight';
    case 'skyConnect':
      return 'connect';
    case 'skyPaint':
      return 'paint';
  }
}

export type HeroSlide = { title: string; cta: string; image?: string };

export function getHeroLead(home: Record<string, unknown>, copyIndex: number): string {
  const safeIndex = copyIndex >= 0 && copyIndex <= 2 ? copyIndex : 0;
  const key = `heroSlideDesc${safeIndex}` as const;
  const value = home[key];
  return typeof value === 'string' ? value : '';
}

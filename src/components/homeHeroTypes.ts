export type HeroStyle =
  | 'softSky'
  | 'skyHard'
  | 'skyHexagon'
  | 'skyDeep'
  | 'skyGrid'
  | 'skyDots'
  | 'skyCalm';

export const HERO_STYLES: HeroStyle[] = [
  'softSky',
  'skyHard',
  'skyHexagon',
  'skyDeep',
  'skyGrid',
  'skyDots',
  'skyCalm'
];

/** Demo-tunable params for Hexagon (p5) hero. */
export type HexagonHeroTuning = {
  /** Dot grey channel 0–255 (higher = lighter). */
  grey: number;
  /** Cursor influence radius in px. */
  influenceRadius: number;
  /** Max pull as a multiple of hex width. */
  attraction: number;
  /** Hex cell radius / half-width in px. */
  hexWidth: number;
};

export const DEFAULT_HEXAGON_HERO_TUNING: HexagonHeroTuning = {
  grey: 210,
  influenceRadius: 160,
  attraction: 0.85,
  hexWidth: 20
};

export type HeroSlide = { title: string; cta: string; image?: string };

export function getHeroLead(home: Record<string, unknown>, copyIndex: number): string {
  const safeIndex = copyIndex >= 0 && copyIndex <= 2 ? copyIndex : 0;
  const key = `heroSlideDesc${safeIndex}` as const;
  const value = home[key];
  return typeof value === 'string' ? value : '';
}

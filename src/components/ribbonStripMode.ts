export const RIBBON_STRIP_MODES = ['credentials', 'products', 'partners', 'none'] as const;

export type RibbonStripMode = (typeof RIBBON_STRIP_MODES)[number];

export const DEFAULT_RIBBON_STRIP_MODE: RibbonStripMode = 'credentials';

export function parseRibbonStripMode(value: string | null | undefined): RibbonStripMode {
  return RIBBON_STRIP_MODES.includes(value as RibbonStripMode) ? (value as RibbonStripMode) : DEFAULT_RIBBON_STRIP_MODE;
}

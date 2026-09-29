export const RIBBON_SETTINGS_KEY = 'fds.ribbon-settings.v1';

export const ribbonControlRanges = {
  movement: { min: 0, max: 3, step: .1, default: 1.2 },
  ribbonSpeed: { min: .25, max: 3, step: .05, default: 1.2 },
  riverSpeed: { min: .25, max: 3, step: .05, default: 3 },
  riverOpacity: { min: 0, max: 1, step: .01, default: .15 },
  riverWidth: { min: .3, max: 2, step: .1, default: 1.5 },
  riverDensity: { min: 6, max: 28, step: 1, default: 27 },
  riverLength: { min: 40, max: 300, step: 10, default: 120 },
} as const;

export type RibbonSetting = keyof typeof ribbonControlRanges;
export type RibbonSettings = Record<RibbonSetting, number>;

export const defaultRibbonSettings = Object.fromEntries(
  Object.entries(ribbonControlRanges).map(([key, range]) => [key, range.default])
) as RibbonSettings;

export function readRibbonSettings(): RibbonSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(RIBBON_SETTINGS_KEY) ?? '{}');
    const settings = { ...defaultRibbonSettings };
    for (const key of Object.keys(ribbonControlRanges) as RibbonSetting[]) {
      const range = ribbonControlRanges[key];
      const value = saved?.[key];
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      const clamped = Math.max(range.min, Math.min(range.max, value));
      settings[key] = Number((range.min + Math.round((clamped - range.min) / range.step) * range.step).toFixed(2));
    }
    return settings;
  } catch {
    return { ...defaultRibbonSettings };
  }
}

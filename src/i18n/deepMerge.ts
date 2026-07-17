/** Deep-merge plain objects for partial locale overlays (fallback: English). */
export function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<Record<string, unknown>>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override)) {
    const b = base[key];
    const o = override[key];
    if (Array.isArray(o)) {
      out[key] = o;
    } else if (o !== null && typeof o === 'object' && !Array.isArray(o) && b !== null && typeof b === 'object' && !Array.isArray(b)) {
      out[key] = deepMerge(b as Record<string, unknown>, o as Record<string, unknown>);
    } else if (o !== undefined) {
      out[key] = o;
    }
  }
  return out as T;
}

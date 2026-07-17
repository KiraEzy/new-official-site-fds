/** Dot-path resolver for primitive leaves (strings) used by t(). */
export function getStringAtPath(root: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.').filter(Boolean);
  let cur: unknown = root;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

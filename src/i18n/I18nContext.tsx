import { createContext, useCallback, useContext, useMemo, useState, type ReactNode, useEffect } from 'react';
import type { Locale } from './types';
import { LOCALE_STORAGE_KEY } from './types';
import type { FullCatalog } from './catalogs';
import { catalogs } from './catalogs';
import { getStringAtPath } from './resolvePath';

type I18nState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  catalog: FullCatalog;
  t: (path: string) => string;
  ns: <K extends keyof FullCatalog>(key: K) => FullCatalog[K];
};

const I18nContext = createContext<I18nState | null>(null);

function langAttribute(locale: Locale): string {
  if (locale === 'en') return 'en';
  if (locale === 'zh-Hant') return 'zh-Hant';
  return 'zh-Hans';
}

export function pickInitialLocale(): Locale {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
    if (saved === 'en' || saved === 'zh-Hant' || saved === 'zh-Hans') return saved;
  } catch {
    /* ignore */
  }
  if (typeof navigator === 'undefined') return 'en';
  const lang = (navigator.language || '').toLowerCase();
  if (lang === 'zh-tw' || lang === 'zh-hk' || lang === 'zh-mo' || lang.includes('zh-hant')) return 'zh-Hant';
  if (lang === 'zh-cn' || lang === 'zh-sg' || lang.includes('zh-hans')) return 'zh-Hans';
  if (lang.startsWith('zh')) return 'zh-Hant';
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => pickInitialLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = langAttribute(locale);
  }, [locale]);

  const catalog = catalogs[locale];
  const enCatalog = catalogs.en;

  const t = useCallback(
    (path: string) =>
      getStringAtPath(catalog as unknown as Record<string, unknown>, path) ??
      getStringAtPath(enCatalog as unknown as Record<string, unknown>, path) ??
      path,
    [catalog, enCatalog]
  );

  const nsFn = useCallback(<K extends keyof FullCatalog>(key: K) => catalog[key], [catalog]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      catalog,
      t,
      ns: nsFn
    }),
    [locale, setLocale, catalog, t, nsFn]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nState {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

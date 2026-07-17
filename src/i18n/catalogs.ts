import type { Locale } from './types';
import { deepMerge } from './deepMerge';

import enMeta from './locales/en/meta.json';
import enUtility from './locales/en/utility.json';
import enNav from './locales/en/nav.json';
import enHome from './locales/en/home.json';
import enFocalAi from './locales/en/focalAi.json';
import enCaseManagement from './locales/en/caseManagement.json';
import enDemo from './locales/en/demo.json';
import enFooter from './locales/en/footer.json';
import enGetInTouch from './locales/en/getInTouch.json';
import enUnknown from './locales/en/unknown.json';
import enContact from './locales/en/contact.json';
import enProfile from './locales/en/profile.json';
import enCareer from './locales/en/career.json';
import enServices from './locales/en/services.json';
import enCapture from './locales/en/capture.json';
import enDocumentManagement from './locales/en/documentManagement.json';
import enWebContentManagement from './locales/en/webContentManagement.json';
import enNewsArticles from './locales/en/newsArticles.json';

import zhHantMeta from './locales/zh-Hant/meta.json';
import zhHantUtility from './locales/zh-Hant/utility.json';
import zhHantNav from './locales/zh-Hant/nav.json';
import zhHantHome from './locales/zh-Hant/home.json';
import zhHantFocalAi from './locales/zh-Hant/focalAi.json';
import zhHantCaseManagement from './locales/zh-Hant/caseManagement.json';
import zhHantDemo from './locales/zh-Hant/demo.json';
import zhHantFooter from './locales/zh-Hant/footer.json';
import zhHantGetInTouch from './locales/zh-Hant/getInTouch.json';
import zhHantUnknown from './locales/zh-Hant/unknown.json';
import zhHantContact from './locales/zh-Hant/contact.json';
import zhHantProfile from './locales/zh-Hant/profile.json';
import zhHantCareer from './locales/zh-Hant/career.json';
import zhHantServices from './locales/zh-Hant/services.json';
import zhHantCapture from './locales/zh-Hant/capture.json';
import zhHantDocumentManagement from './locales/zh-Hant/documentManagement.json';
import zhHantWebContentManagement from './locales/zh-Hant/webContentManagement.json';
import zhHantNewsArticles from './locales/zh-Hant/newsArticles.json';

import zhHansMeta from './locales/zh-Hans/meta.json';
import zhHansUtility from './locales/zh-Hans/utility.json';
import zhHansNav from './locales/zh-Hans/nav.json';
import zhHansHome from './locales/zh-Hans/home.json';
import zhHansFocalAi from './locales/zh-Hans/focalAi.json';
import zhHansCaseManagement from './locales/zh-Hans/caseManagement.json';
import zhHansDemo from './locales/zh-Hans/demo.json';
import zhHansFooter from './locales/zh-Hans/footer.json';
import zhHansGetInTouch from './locales/zh-Hans/getInTouch.json';
import zhHansUnknown from './locales/zh-Hans/unknown.json';
import zhHansContact from './locales/zh-Hans/contact.json';
import zhHansProfile from './locales/zh-Hans/profile.json';
import zhHansCareer from './locales/zh-Hans/career.json';
import zhHansServices from './locales/zh-Hans/services.json';
import zhHansCapture from './locales/zh-Hans/capture.json';
import zhHansDocumentManagement from './locales/zh-Hans/documentManagement.json';
import zhHansWebContentManagement from './locales/zh-Hans/webContentManagement.json';
import zhHansNewsArticles from './locales/zh-Hans/newsArticles.json';

export type MessageCatalog = Record<string, unknown>;

function ns(en: Record<string, unknown>, zh: Record<string, unknown>): Record<string, unknown> {
  return deepMerge(en, zh);
}

const enBuilt = {
  meta: enMeta,
  utility: enUtility,
  nav: enNav,
  home: enHome,
  focalAi: enFocalAi,
  caseManagement: enCaseManagement,
  demo: enDemo,
  footer: enFooter,
  getInTouch: enGetInTouch,
  unknown: enUnknown,
  contact: enContact,
  profile: enProfile,
  career: enCareer,
  services: enServices,
  capture: enCapture,
  documentManagement: enDocumentManagement,
  webContentManagement: enWebContentManagement,
  newsArticles: enNewsArticles
};

export type FullCatalog = {
  meta: Record<string, unknown>;
  utility: Record<string, unknown>;
  nav: Record<string, unknown>;
  home: Record<string, unknown>;
  focalAi: Record<string, unknown>;
  caseManagement: Record<string, unknown>;
  demo: Record<string, unknown>;
  footer: Record<string, unknown>;
  getInTouch: Record<string, unknown>;
  unknown: Record<string, unknown>;
  contact: Record<string, unknown>;
  profile: Record<string, unknown>;
  career: Record<string, unknown>;
  services: Record<string, unknown>;
  capture: Record<string, unknown>;
  documentManagement: Record<string, unknown>;
  webContentManagement: Record<string, unknown>;
  newsArticles: Record<string, unknown>;
};

export const catalogs: Record<Locale, FullCatalog> = {
  en: enBuilt as FullCatalog,
  'zh-Hant': {
    meta: ns(enMeta, zhHantMeta),
    utility: ns(enUtility, zhHantUtility),
    nav: ns(enNav, zhHantNav),
    home: ns(enHome, zhHantHome),
    focalAi: ns(enFocalAi, zhHantFocalAi),
    caseManagement: ns(enCaseManagement, zhHantCaseManagement),
    demo: ns(enDemo, zhHantDemo),
    footer: ns(enFooter, zhHantFooter),
    getInTouch: ns(enGetInTouch, zhHantGetInTouch),
    unknown: ns(enUnknown, zhHantUnknown),
    contact: ns(enContact, zhHantContact),
    profile: ns(enProfile, zhHantProfile),
    career: ns(enCareer, zhHantCareer),
    services: ns(enServices, zhHantServices),
    capture: ns(enCapture, zhHantCapture),
    documentManagement: ns(enDocumentManagement, zhHantDocumentManagement),
    webContentManagement: ns(enWebContentManagement, zhHantWebContentManagement),
    newsArticles: ns(enNewsArticles, zhHantNewsArticles)
  },
  'zh-Hans': {
    meta: ns(enMeta, zhHansMeta),
    utility: ns(enUtility, zhHansUtility),
    nav: ns(enNav, zhHansNav),
    home: ns(enHome, zhHansHome),
    focalAi: ns(enFocalAi, zhHansFocalAi),
    caseManagement: ns(enCaseManagement, zhHansCaseManagement),
    demo: ns(enDemo, zhHansDemo),
    footer: ns(enFooter, zhHansFooter),
    getInTouch: ns(enGetInTouch, zhHansGetInTouch),
    unknown: ns(enUnknown, zhHansUnknown),
    contact: ns(enContact, zhHansContact),
    profile: ns(enProfile, zhHansProfile),
    career: ns(enCareer, zhHansCareer),
    services: ns(enServices, zhHansServices),
    capture: ns(enCapture, zhHansCapture),
    documentManagement: ns(enDocumentManagement, zhHansDocumentManagement),
    webContentManagement: ns(enWebContentManagement, zhHansWebContentManagement),
    newsArticles: ns(enNewsArticles, zhHansNewsArticles)
  }
};

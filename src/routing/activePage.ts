import {
  CAPTURE_HASH,
  CAREER_HASH,
  CONTACT_US_HASH,
  CUSTOMER_FLOW_PAGE_HASH,
  DOCUMENT_MANAGEMENT_HASH,
  FOCAL_AI_PAGE_HASH,
  LATEST_NEWS_HASH,
  PROFILE_HASH,
  SERVICES_HASH,
  WEB_CONTENT_MANAGEMENT_HASH,
  WORKFLOW_MANAGEMENT_HASH
} from '../content/pageHashes';

export type ActivePage =
  | 'home'
  | 'unknown'
  | 'case-management'
  | 'focal-ai'
  | 'profile'
  | 'services'
  | 'career'
  | 'contact-us'
  | 'capture'
  | 'document-management'
  | 'web-content-management'
  | 'news-article';

const HASH_TO_PAGE: Record<string, ActivePage> = {
  [WORKFLOW_MANAGEMENT_HASH]: 'case-management',
  [CUSTOMER_FLOW_PAGE_HASH]: 'case-management',
  [FOCAL_AI_PAGE_HASH]: 'focal-ai',
  [PROFILE_HASH]: 'profile',
  [SERVICES_HASH]: 'services',
  [CAREER_HASH]: 'career',
  [CONTACT_US_HASH]: 'contact-us',
  [CAPTURE_HASH]: 'capture',
  [DOCUMENT_MANAGEMENT_HASH]: 'document-management',
  [WEB_CONTENT_MANAGEMENT_HASH]: 'web-content-management'
};

const NEWS_ARTICLE_HASH_PREFIX = '#news/';

/** Empty fragment, lone `#`, or in-page home sections resolve to home; any other unknown hash → `unknown`. */
export function pageFromHash(rawHash: string): ActivePage {
  const h = rawHash === '#' ? '' : rawHash;
  if (h === '' || h === LATEST_NEWS_HASH) return 'home';
  if (h.startsWith(NEWS_ARTICLE_HASH_PREFIX) && h.length > NEWS_ARTICLE_HASH_PREFIX.length) {
    return 'news-article';
  }
  const mapped = HASH_TO_PAGE[h];
  return mapped ?? 'unknown';
}

export function newsSlugFromHash(rawHash: string): string | null {
  const h = rawHash === '#' ? '' : rawHash;
  if (!h.startsWith(NEWS_ARTICLE_HASH_PREFIX)) return null;
  const slug = h.slice(NEWS_ARTICLE_HASH_PREFIX.length);
  return slug || null;
}

export function titleForActivePage(page: ActivePage): string {
  const base = 'FDS Solutions Limited';
  switch (page) {
    case 'home':
      return base;
    case 'case-management':
      return `Workflow Management · ${base}`;
    case 'focal-ai':
      return `Focal AI · ${base}`;
    case 'profile':
      return `Company Profile · ${base}`;
    case 'services':
      return `Services · ${base}`;
    case 'career':
      return `Career · ${base}`;
    case 'contact-us':
      return `Contact Us · ${base}`;
    case 'capture':
      return `Capture · ${base}`;
    case 'document-management':
      return `Document Management · ${base}`;
    case 'web-content-management':
      return `Web Content Management · ${base}`;
    case 'news-article':
      return `News · ${base}`;
    default:
      return `Page not found · ${base}`;
  }
}

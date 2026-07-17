/** Hash fragments for client-side routing (see App.tsx `pageFromHash`). */

export const PROFILE_HASH = '#profile';
export const SERVICES_HASH = '#services';
export const CAREER_HASH = '#career';
export const CONTACT_US_HASH = '#contact-us';

export const CAPTURE_HASH = '#capture';
export const DOCUMENT_MANAGEMENT_HASH = '#document-management';
export const WEB_CONTENT_MANAGEMENT_HASH = '#web-content-management';

/** Primary route for the workflow / case operations solution page. */
export const WORKFLOW_MANAGEMENT_HASH = '#workflow-management';

/** Legacy hash — resolves to the same page as {@link WORKFLOW_MANAGEMENT_HASH}. */
export const CUSTOMER_FLOW_PAGE_HASH = '#customer-flow-management';

export const FOCAL_AI_PAGE_HASH = '#focal-ai';

/** Prefix for individual news article routes, e.g. `#news/my-erbweb-revamp`. */
export const NEWS_ARTICLE_HASH_PREFIX = '#news/';

export function newsArticleHash(slug: string): string {
  return `${NEWS_ARTICLE_HASH_PREFIX}${slug}`;
}

/**
 * Static marketing copy for inner hash routes.
 * Mem0 searches returned no memories at implementation time; content is expanded from existing homepage positioning.
 */

export type MarketingSection = {
  heading: string;
  paragraphs: string[];
  variant?: 'light' | 'dark';
};

/** Two-column enterprise hero (stats left, philosophy card right). Optional on any slug; used by Document Management. */
export type SplitHeroStat = { value: string; label: string };

export type SplitHeroPhilosophyItem = { title: string; description: string };

export type SplitHeroContent = {
  /** Overrides `title` for the large left headline when set */
  headline?: string;
  /** Overrides main intro paragraph when set */
  lead?: string;
  stats: SplitHeroStat[];
  philosophyTitle: string;
  philosophyItems: SplitHeroPhilosophyItem[];
};

export type MarketingPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  introSecondary?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroCaption?: string;
  sections: MarketingSection[];
  bullets?: string[];
  splitHero?: SplitHeroContent;
  /** Shorter capabilities band headline (optional). */
  capabilitiesHeadline?: string;
};

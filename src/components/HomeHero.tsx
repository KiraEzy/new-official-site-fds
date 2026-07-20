import type * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type HeroTitleFont =
  | 'page'
  | 'jost'
  | 'quicksand'
  | 'outfit'
  | 'lexend'
  | 'urbanist';

export const HERO_TITLE_FONTS: HeroTitleFont[] = [
  'page',
  'jost',
  'quicksand',
  'outfit',
  'lexend',
  'urbanist'
];

const HERO_TITLE_FONT_CLASS: Record<HeroTitleFont, string> = {
  page: 'font-sans',
  jost: 'font-hero-jost',
  quicksand: 'font-hero-quicksand',
  outfit: 'font-hero-outfit',
  lexend: 'font-hero-lexend',
  urbanist: 'font-hero-urbanist'
};

export function HomeHero({
  title,
  lead,
  heroRef,
  heroNavPortalRef,
  titleFont = 'page',
  titleFontWeight = 600
}: {
  title: string;
  lead: string;
  heroRef?: React.Ref<HTMLElement>;
  heroNavPortalRef?: (el: HTMLDivElement | null) => void;
  titleFont?: HeroTitleFont;
  titleFontWeight?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={heroRef}
      data-home-hero="editorial"
      data-hero-title-font={titleFont}
      className="relative flex min-h-[68vh] w-full items-center justify-center bg-background px-4 py-24 sm:px-6 lg:px-8"
    >
      <div
        ref={heroNavPortalRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-[60]"
      />
      <div className="mx-auto mt-[25vh] mb-[15vh] max-w-4xl text-center">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ fontWeight: titleFontWeight }}
          className={`${HERO_TITLE_FONT_CLASS[titleFont]} mb-6 whitespace-pre-line text-5xl leading-[1.12] tracking-tight text-text md:text-6xl lg:text-7xl`}
        >
          {title}
        </motion.h1>
        {lead ? (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08 }}
            className="mx-auto max-w-2xl text-lg leading-8 text-text/60 md:text-xl md:leading-8"
          >
            {lead}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}

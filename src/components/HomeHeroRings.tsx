import { useSyncExternalStore, type ComponentProps } from 'react';
import { motion } from 'framer-motion';
import type { HomeHero } from './HomeHero';
import { CONTACT_US_HASH } from '../content/pageHashes';
import { useI18n } from '../i18n/I18nContext';
import './HomeHeroRings.css';

const RING_COUNT = 5;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

/** Cream field with expanding concentric rings; independent of the other hero options. */
export function HomeHeroRings({
  heroRef,
  heroNavPortalRef,
  title,
  lead
}: ComponentProps<typeof HomeHero>) {
  const { t } = useI18n();
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true);
  const titleLines = title.split('\n').map(line => line.trim()).filter(Boolean);
  const roman = titleLines[0] ?? title;
  const italic = titleLines.slice(1).join(' ');
  const entrance = (delay: number) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.7,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  });

  return (
    <section
      ref={heroRef}
      className="rings-hero"
      data-home-hero="rings"
      data-motion={reduceMotion ? 'static' : 'running'}
      aria-labelledby="rings-hero-title"
    >
      <div ref={heroNavPortalRef} className="rings-hero-nav pointer-events-none absolute inset-x-0 top-0 z-[60]" />

      <div className="rings-circles" aria-hidden="true">
        {Array.from({ length: RING_COUNT }, (_, index) => (
          <span key={index} className="rings-circle" />
        ))}
      </div>

      <div className="rings-copy">
        <motion.h1 {...entrance(0.08)} id="rings-hero-title" className="rings-title">
          {roman}
          {italic ? <em>{italic}</em> : null}
        </motion.h1>
        <motion.p {...entrance(0.18)} className="rings-lead">{lead}</motion.p>
      </div>

      <motion.div {...entrance(0.28)} className="rings-actions">
        <a className="rings-cta" href={CONTACT_US_HASH}>{t('nav.contactUs')}</a>
      </motion.div>
    </section>
  );
}

import type { ComponentProps } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { HomeHero } from './HomeHero';
import { useI18n } from '../i18n/I18nContext';
import './HomeHeroCentered.css';

/** Centered copy and a wide image below; independent of both earlier hero options. */
export function HomeHeroCentered({
  heroRef,
  heroNavPortalRef,
  title,
  lead,
  ctaSecondary,
  imageSrc,
  cards,
  onDiscoverClick
}: ComponentProps<typeof HomeHero>) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const titleLines = title.split('\n');
  const entrance = (delay: number) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduceMotion ? 0 : 0.65,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  });

  return (
    <section ref={heroRef} className="centered-hero" data-home-hero="centered" aria-labelledby="centered-hero-title">
      <div ref={heroNavPortalRef} className="centered-hero-nav pointer-events-none absolute inset-x-0 top-0 z-[60]" />

      <div className="centered-hero-inner">
        <div className="centered-hero-copy">
          <motion.h1 {...entrance(0.06)} id="centered-hero-title" className="centered-hero-title">
            {titleLines.map((line, index) => (
              <span key={index} className={index === titleLines.length - 1 ? 'centered-hero-title-accent' : undefined}>
                {line.trim()}{index < titleLines.length - 1 ? ' ' : ''}
              </span>
            ))}
          </motion.h1>

          <motion.p {...entrance(0.14)} className="centered-hero-lead">{lead}</motion.p>

          <motion.div {...entrance(0.22)} className="centered-hero-actions">
            <button type="button" className="centered-hero-cta" onClick={onDiscoverClick}>
              {ctaSecondary}
              <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </motion.div>
        </div>

        <div className="centered-hero-visual-wrap">
          <motion.figure {...entrance(0.3)} className="centered-hero-visual">
            <div className="centered-hero-image-frame">
              <img
                src={imageSrc}
                alt={t('home.heroCenteredImageAlt')}
                width={1024}
                height={593}
                fetchPriority="high"
                className="centered-hero-image"
              />
            </div>

            <figcaption className="centered-hero-proof">
              <div className="centered-hero-experience">
                <span className="centered-hero-stat-value">{t('home.statYearsValue')}</span>
                <span className="centered-hero-stat-label">{t('home.statYearsLabel')}</span>
                <span className="centered-hero-stat-rule" aria-hidden="true" />
              </div>
              <div className="centered-hero-qualification">
                <span className="centered-hero-shield"><ShieldCheck size={23} strokeWidth={1.5} aria-hidden="true" /></span>
                <span>
                  <span className="centered-hero-qualification-title">{t('home.statSoaTitle')}</span>
                  <span className="centered-hero-stat-label">{t('home.statSoaLabel')}</span>
                </span>
              </div>
            </figcaption>
          </motion.figure>
        </div>

        <motion.nav {...entrance(0.38)} className="centered-hero-links" aria-label={t('home.heroAlternativeExplore')}>
          {cards.map(card => (
            <a
              key={card.href}
              href={card.href}
              onClick={event => {
                if (!card.onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                card.onNavigate();
              }}
            >
              {card.title}
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>
          ))}
        </motion.nav>
      </div>
    </section>
  );
}

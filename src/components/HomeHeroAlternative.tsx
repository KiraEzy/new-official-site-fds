import type { ComponentProps, MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { HomeHero } from './HomeHero';
import { useI18n } from '../i18n/I18nContext';
import './HomeHeroAlternative.css';

type HomeHeroAlternativeProps = ComponentProps<typeof HomeHero>;
type HeroCard = HomeHeroAlternativeProps['cards'][number];

function navigateCard(event: MouseEvent<HTMLAnchorElement>, card: HeroCard) {
  if (!card.onNavigate || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  card.onNavigate();
}

/** An independent hero option; the original HomeHero remains available in demo controls. */
export function HomeHeroAlternative({
  heroRef,
  heroNavPortalRef,
  title,
  lead,
  ctaSecondary,
  imageSrc,
  imageAlt,
  cards,
  onDiscoverClick
}: HomeHeroAlternativeProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const titleLines = title.split('\n');
  const aboutCard = cards[2];
  const entrance = (delay: number) => ({
    initial: reduceMotion ? false as const : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const }
  });

  return (
    <section ref={heroRef} className="alternative-hero" data-home-hero="alternative" aria-labelledby="alternative-hero-title">
      <div ref={heroNavPortalRef} className="alternative-hero-nav pointer-events-none absolute inset-x-0 top-0 z-[60]" />

      <div className="alternative-hero-inner">
        <div className="alternative-hero-main">
          <div className="alternative-hero-copy">
            <motion.p {...entrance(0.05)} className="alternative-hero-eyebrow">
              <span aria-hidden="true" />
              {t('home.heroAlternativeEyebrow')}
            </motion.p>

            <motion.h1 {...entrance(0.12)} id="alternative-hero-title" className="alternative-hero-title">
              {titleLines.map((line, index) => (
                <span key={index} className={index === titleLines.length - 1 ? 'alternative-hero-title-accent' : undefined}>
                  {line.trim()}{index < titleLines.length - 1 ? ' ' : ''}
                </span>
              ))}
            </motion.h1>

            <motion.p {...entrance(0.2)} className="alternative-hero-lead">{lead}</motion.p>

            <motion.div {...entrance(0.28)} className="alternative-hero-actions">
              <button type="button" onClick={onDiscoverClick} className="alternative-hero-primary">
                {ctaSecondary}
                <ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" />
              </button>
              {aboutCard && (
                <a href={aboutCard.href} onClick={(event) => navigateCard(event, aboutCard)} className="alternative-hero-about">
                  {aboutCard.title}
                  <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                </a>
              )}
            </motion.div>
          </div>

          <motion.figure {...entrance(0.18)} className="alternative-hero-visual">
            <div className="alternative-hero-frame">
              <div className="alternative-hero-photo">
                <img src={imageSrc} alt={imageAlt} fetchPriority="high" width={1024} height={593} />
                <span className="alternative-hero-photo-label">{t('home.heroAlternativeLocation')}</span>
              </div>
              <figcaption className="alternative-hero-proof">
                <div className="alternative-hero-stat">
                  <span className="alternative-hero-years">{t('home.statYearsValue')}</span>
                  <span className="alternative-hero-stat-label">{t('home.statYearsLabel')}</span>
                </div>
                <div className="alternative-hero-stat">
                  <span className="alternative-hero-qualification">{t('home.statSoaTitle')}</span>
                  <span className="alternative-hero-stat-label">{t('home.statSoaLabel')}</span>
                </div>
              </figcaption>
            </div>
            <div className="alternative-hero-visual-note" aria-hidden="true">
              <span />
              Design to Simplify
            </div>
          </motion.figure>
        </div>

        <motion.nav {...entrance(0.38)} className="alternative-hero-explore" aria-label={t('home.heroAlternativeExplore')}>
          <p className="alternative-hero-explore-label">{t('home.heroAlternativeExplore')}</p>
          <div className="alternative-hero-links">
            {cards.map((card, index) => (
              <a key={card.href} href={card.href} onClick={(event) => navigateCard(event, card)} className="alternative-hero-link">
                <span className="alternative-hero-link-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="alternative-hero-link-title">{card.title}</span>
                <ArrowUpRight className="alternative-hero-link-arrow" size={21} strokeWidth={1.5} aria-hidden="true" />
              </a>
            ))}
          </div>
        </motion.nav>
      </div>
    </section>
  );
}

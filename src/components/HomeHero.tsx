import type { ComponentType, Ref } from 'react';
import { motion } from 'motion/react';
import { HeroSimplifyAndExcellenceSpot } from './HeroSimplifyAndExcellenceSpot';

export function HomeHero({
  heroRef,
  heroNavPortalRef,
  badge,
  designTo,
  simplifyWord,
  excellenceWord,
  subtitle,
  ctaLabel,
  scrollHint,
  colorProfile,
  showMintBlend,
  mintBlendAppearance,
  onCtaClick,
  CtaButton
}: {
  heroRef: Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  badge: string;
  designTo: string;
  simplifyWord: string;
  excellenceWord: string;
  subtitle: string;
  ctaLabel: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  onCtaClick?: () => void;
  CtaButton: ComponentType<{ label: string; colorProfile?: 'default' | 'navy'; onClick?: () => void }>;
}) {
  return (
    <section
      ref={heroRef}
      data-home-hero="interactive"
      className="relative h-screen min-h-[700px] w-full overflow-hidden border-b border-text/5 bg-text/3"
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(17,184,245,0.03)_0%,rgba(255,255,255,0)_100%)]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-5xl overflow-visible px-1 sm:px-2"
        >
          <div className="relative z-40 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
            {badge}
          </div>
          <h1 className="relative mx-auto mb-8 max-w-4xl overflow-visible text-center text-5xl font-bold leading-[1.18] tracking-tight text-text sm:leading-[1.15] lg:max-w-5xl lg:text-8xl lg:leading-[1.14]">
            <span className="relative z-30 inline-block w-full">{designTo}</span>
            <br />
            <span className="relative z-[1] flex flex-col items-center">
              <HeroSimplifyAndExcellenceSpot simplifyWord={simplifyWord} excellenceWord={excellenceWord} />
            </span>
          </h1>
          <p className="relative z-[25] mx-auto mb-10 max-w-2xl text-xl font-medium leading-relaxed text-text/60">
            {subtitle}
          </p>
          <div className="relative z-[25] flex flex-wrap justify-center gap-5">
            <CtaButton label={ctaLabel} colorProfile={colorProfile} onClick={onCtaClick} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`pointer-events-none absolute right-8 z-30 flex flex-col items-center gap-3 text-text/55 ${
          showMintBlend ? 'bottom-32 sm:bottom-40 lg:bottom-48' : 'bottom-8'
        }`}
      >
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
          {scrollHint}
        </span>
        <div className="h-16 w-[2px] rounded-full bg-linear-to-t from-text/50 via-text/25 to-transparent" />
      </motion.div>

      {showMintBlend ? (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-22 h-[clamp(280px,40vh,520px)] ${
            mintBlendAppearance === 'mint'
              ? 'bg-[linear-gradient(to_bottom,transparent_0%,transparent_28%,rgba(1,20,26,0.04)_52%,rgba(246,251,255,0.45)_80%,#f6fbff_100%)]'
              : 'bg-[linear-gradient(to_bottom,transparent_0%,transparent_26%,rgba(255,255,255,0.05)_48%,rgba(250,248,255,0.35)_74%,rgba(255,255,255,0.75)_100%)]'
          }`}
        />
      ) : null}
    </section>
  );
}

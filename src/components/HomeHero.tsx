import { Fragment, type ComponentType, type Ref } from 'react';
import { motion } from 'motion/react';
import type { HeroSlide, HeroStyle, LatticeHeroMode, LatticeTuning } from './homeHeroTypes';
import { isLatticeHeroStyle } from './homeHeroTypes';
import { HomeHeroP5Hexagons } from './HomeHeroP5Hexagons';

function skyBaseClass(style: HeroStyle): string {
  if (style === 'skyDeep') return 'home-sky-drift home-sky-drift--deep';
  if (style === 'skyCalm') return 'home-sky-drift home-sky-drift--calm';
  if (isLatticeHeroStyle(style)) return 'bg-white';
  return 'home-sky-drift';
}

export function HomeHero({
  heroRef,
  heroNavPortalRef,
  style,
  slide,
  lead,
  scrollHint,
  colorProfile,
  showMintBlend,
  mintBlendAppearance,
  showFrostedGlass,
  onCtaClick,
  CtaButton,
  latticeMode,
  latticeTuning
}: {
  heroRef: Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  style: HeroStyle;
  slide: HeroSlide;
  lead: string;
  scrollHint: string;
  colorProfile: 'default' | 'navy';
  showMintBlend: boolean;
  mintBlendAppearance: 'pastel' | 'mint' | 'dark';
  showFrostedGlass: boolean;
  onCtaClick?: () => void;
  CtaButton: ComponentType<{ label: string; colorProfile?: 'default' | 'navy'; onClick?: () => void }>;
  latticeMode: LatticeHeroMode;
  latticeTuning: LatticeTuning;
}) {
  const p5Background = isLatticeHeroStyle(style) ? (
    <Fragment key={style}>
      <HomeHeroP5Hexagons
        className="absolute inset-0 z-0 h-full w-full"
        mode={latticeMode}
        tuning={latticeTuning}
        frostedGlass={showFrostedGlass}
      />
    </Fragment>
  ) : null;

  const frostClass = showFrostedGlass
    ? isLatticeHeroStyle(style)
      ? 'home-hero-frost home-hero-frost--over-canvas max-w-4xl rounded-[2rem] border border-white/40 px-6 py-10 shadow-[0_24px_80px_rgba(1,20,26,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] sm:px-12 sm:py-12'
      : 'home-hero-frost max-w-4xl rounded-[2rem] border border-white/40 bg-white/20 px-6 py-10 shadow-[0_24px_80px_rgba(1,20,26,0.08),inset_0_1px_0_0_rgba(255,255,255,0.5)] sm:px-12 sm:py-12'
    : 'max-w-4xl';

  return (
    <section
      ref={heroRef}
      data-hero-style={style}
      data-hero-glass={showFrostedGlass ? 'on' : 'off'}
      className="relative h-screen min-h-[700px] w-full"
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />

      {/*
        Keep the p5 canvas a direct section child (no overflow/isolation wrapper).
        Wrapping it in overflow-hidden makes Chromium stop sampling it for backdrop-filter,
        so the glass paints as a solid cover again.
      */}
      {p5Background}
      {!p5Background ? (
        <div className={`absolute inset-0 z-0 overflow-hidden ${skyBaseClass(style)}`} aria-hidden />
      ) : null}
      {style === 'skyGrid' ? <div className="home-sky-grid absolute inset-0 z-0 overflow-hidden" aria-hidden /> : null}
      {style === 'skyDots' ? <div className="home-sky-dots absolute inset-0 z-0 overflow-hidden" aria-hidden /> : null}

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className={frostClass}>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 whitespace-pre-line text-5xl font-bold leading-[1.05] tracking-tight text-text lg:text-7xl"
          >
            {slide.title}
          </motion.h1>
          {lead ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-text/60 md:text-xl md:leading-8"
            >
              {lead}
            </motion.p>
          ) : null}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="flex flex-wrap justify-center gap-5"
          >
            <CtaButton label={slide.cta} colorProfile={colorProfile} onClick={onCtaClick} />
          </motion.div>
        </div>
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

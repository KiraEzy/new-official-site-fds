import type { ComponentType, Ref } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { HeroSimplifyAndExcellenceSpot } from './HeroSimplifyAndExcellenceSpot';

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else ref.current = value;
}

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
  CtaButton,
  showFestivalReveal = false,
  festivalBarOffset = 0
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
  showFestivalReveal?: boolean;
  /** Matches fixed festival bar height so hero content clears the lowered navbar. */
  festivalBarOffset?: number;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const simplifyAnchorRef = useRef<HTMLElement | null>(null);
  const ctaWrapRef = useRef<HTMLDivElement | null>(null);
  const [whiteGlow, setWhiteGlow] = useState<{ x: number; y: number; r: number } | null>(null);

  const measureWhiteGlow = useCallback(() => {
    if (showFestivalReveal) {
      setWhiteGlow(null);
      return;
    }
    const root = rootRef.current;
    const simplify = simplifyAnchorRef.current;
    const cta = ctaWrapRef.current;
    if (!root || !simplify || !cta) return;

    const rootBox = root.getBoundingClientRect();
    const simplifyBox = simplify.getBoundingClientRect();
    const ctaBox = cta.getBoundingClientRect();

    const simplifyCx = simplifyBox.left + simplifyBox.width / 2 - rootBox.left;
    const simplifyCy = simplifyBox.top + simplifyBox.height / 2 - rootBox.top;
    const endX = ctaBox.left + ctaBox.width / 2 - rootBox.left;
    const endY = ctaBox.bottom - rootBox.top;

    // Sit the glow below Simplify’s center, then expand past the CTA bottom.
    const x = simplifyCx;
    const y = simplifyCy + (endY - simplifyCy) * 0.2;
    const r = Math.hypot(endX - x, endY - y) * 1.55;
    if (!Number.isFinite(r) || r < 8) return;

    setWhiteGlow({ x, y, r });
  }, [showFestivalReveal]);

  useLayoutEffect(() => {
    const run = () => {
      void document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(measureWhiteGlow));
      });
    };
    run();
    window.addEventListener('resize', measureWhiteGlow);

    const root = rootRef.current;
    const ro =
      typeof ResizeObserver !== 'undefined' && root
        ? new ResizeObserver(() => measureWhiteGlow())
        : null;
    if (root && ro) ro.observe(root);

    return () => {
      window.removeEventListener('resize', measureWhiteGlow);
      ro?.disconnect();
    };
  }, [measureWhiteGlow, simplifyWord, excellenceWord, subtitle, ctaLabel, designTo, badge]);

  return (
    <section
      ref={(el) => {
        rootRef.current = el;
        assignRef(heroRef, el);
      }}
      data-home-hero="interactive"
      style={festivalBarOffset > 0 ? { paddingTop: festivalBarOffset } : undefined}
      className={`relative box-border h-screen min-h-[700px] w-full overflow-hidden ${
        showFestivalReveal ? 'bg-[#d8efe6]' : 'bg-[#e8f6fc]'
      }`}
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />

      {showFestivalReveal ? (
        <div
          aria-hidden
          data-festival-bg="hero"
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/festival/dragon-boat-hero.png)',
            backgroundPosition: 'center 0%'
          }}
        />
      ) : null}

      {!showFestivalReveal && whiteGlow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(circle ${whiteGlow.r}px at ${whiteGlow.x}px ${whiteGlow.y}px, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)`
          }}
        />
      ) : null}

      {/* Floor the hero bottom in white so it meets the bridge without a blue seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[28%]"
        style={{
          background: showFestivalReveal
            ? 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, #ffffff 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%, #ffffff 100%)'
        }}
      />

      <div
        className={`relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8 ${
          showFestivalReveal
            ? 'justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36'
            : 'justify-center'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mx-auto w-full overflow-visible px-1 sm:px-2 ${
            showFestivalReveal ? 'max-w-3xl' : 'max-w-5xl'
          }`}
          onAnimationComplete={measureWhiteGlow}
        >
          <div
            className={
              showFestivalReveal
                ? 'mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/55 bg-white/45 px-6 py-8 shadow-[0_16px_48px_rgba(15,60,50,0.1)] backdrop-blur-xl sm:max-w-3xl sm:px-8 sm:py-9'
                : undefined
            }
            data-festival-frost={showFestivalReveal ? 'text' : undefined}
          >
            <div
              className={`relative z-40 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase ${
                showFestivalReveal ? 'mb-3.5 sm:mb-4' : 'mb-6'
              }`}
            >
              {badge}
            </div>
            <h1
              className={
                showFestivalReveal
                  ? 'relative mx-auto mb-7 max-w-2xl overflow-visible text-center text-5xl font-bold leading-[1.16] tracking-tight text-text sm:max-w-3xl sm:text-6xl sm:leading-[1.14] lg:text-[5.25rem] lg:leading-[1.12]'
                  : 'relative mx-auto mb-8 max-w-4xl overflow-visible text-center text-5xl font-bold leading-[1.18] tracking-tight text-text sm:leading-[1.15] lg:max-w-5xl lg:text-8xl lg:leading-[1.14]'
              }
            >
              <span className="relative z-30 inline-block w-full">{designTo}</span>
              <br />
              <span className="relative z-[1] flex flex-col items-center">
                <HeroSimplifyAndExcellenceSpot
                  simplifyWord={simplifyWord}
                  excellenceWord={excellenceWord}
                  simplifyAnchorRef={simplifyAnchorRef}
                />
              </span>
            </h1>
            <p
              className={
                showFestivalReveal
                  ? 'relative z-[25] mx-auto max-w-2xl text-xl font-medium leading-relaxed text-text/60'
                  : 'relative z-[25] mx-auto max-w-2xl text-xl font-medium leading-relaxed text-text/60'
              }
            >
              {subtitle}
            </p>
          </div>

          <div
            ref={ctaWrapRef}
            className={`relative z-[25] flex flex-wrap justify-center gap-5 ${
              showFestivalReveal ? 'mt-8 sm:mt-10' : 'mt-10'
            }`}
          >
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

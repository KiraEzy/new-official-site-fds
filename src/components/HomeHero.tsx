import type { ComponentType, Ref } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { HeroSimplifyAndExcellenceSpot } from './HeroSimplifyAndExcellenceSpot';

const FESTIVAL_REVEAL_RADIUS_PX = 118;
const FESTIVAL_REVEAL_FEATHER_PX = 36;

function featheredFestivalRevealMask(x: number, y: number) {
  const r = FESTIVAL_REVEAL_RADIUS_PX;
  const hardCore = Math.max(0, r - FESTIVAL_REVEAL_FEATHER_PX);
  const mid = hardCore + FESTIVAL_REVEAL_FEATHER_PX * 0.45;
  return `radial-gradient(circle ${r}px at ${x}px ${y}px, #000 0px, #000 ${hardCore}px, rgba(0,0,0,0.45) ${mid}px, transparent ${r}px)`;
}

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
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const simplifyAnchorRef = useRef<HTMLElement | null>(null);
  const ctaWrapRef = useRef<HTMLDivElement | null>(null);
  const [whiteGlow, setWhiteGlow] = useState<{ x: number; y: number; r: number } | null>(null);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const [festivalMask, setFestivalMask] = useState(() => featheredFestivalRevealMask(-500, -500));

  useEffect(() => {
    if (!showFestivalReveal) return;

    const handleMove = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMove);

    const syncMask = () => {
      setFestivalMask(featheredFestivalRevealMask(springX.get(), springY.get()));
    };
    const unsubX = springX.on('change', syncMask);
    const unsubY = springY.on('change', syncMask);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      unsubX();
      unsubY();
    };
  }, [showFestivalReveal, mouseX, mouseY, springX, springY]);

  const measureWhiteGlow = useCallback(() => {
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
  }, []);

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
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#e8f6fc]"
    >
      <div ref={heroNavPortalRef} className="pointer-events-none absolute left-0 right-0 top-0 z-[60]" />
      {showFestivalReveal ? (
        <div
          aria-hidden
          data-festival-reveal="pattern"
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            backgroundImage: 'url(/festival/dragon-pattern.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '420px auto',
            WebkitMaskImage: festivalMask,
            maskImage: festivalMask,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%'
          }}
        />
      ) : null}
      {whiteGlow ? (
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
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%, #ffffff 100%)'
        }}
      />

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto w-full max-w-5xl overflow-visible px-1 sm:px-2"
          onAnimationComplete={measureWhiteGlow}
        >
          <div className="relative z-40 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
            {badge}
          </div>
          <h1 className="relative mx-auto mb-8 max-w-4xl overflow-visible text-center text-5xl font-bold leading-[1.18] tracking-tight text-text sm:leading-[1.15] lg:max-w-5xl lg:text-8xl lg:leading-[1.14]">
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
          <p className="relative z-[25] mx-auto mb-10 max-w-2xl text-xl font-medium leading-relaxed text-text/60">
            {subtitle}
          </p>
          <div ref={ctaWrapRef} className="relative z-[25] flex flex-wrap justify-center gap-5">
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

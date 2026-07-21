import type { Ref } from 'react';
import { useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

type HeroFeatureCard = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  onNavigate?: () => void;
};

type HomeHeroProps = {
  heroRef: Ref<HTMLElement>;
  heroNavPortalRef: (el: HTMLDivElement | null) => void;
  title: string;
  lead: string;
  ctaSecondary: string;
  imageSrc: string;
  imageAlt: string;
  cards: HeroFeatureCard[];
  onDiscoverClick: () => void;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Puzzle intro: three batches, paired pieces from different directions. */
const INTRO = {
  batch1: 0.08,
  batch2: 0.32,
  batch3: 0.56,
  duration: 0.72,
  spring: { type: 'spring' as const, stiffness: 280, damping: 28, mass: 0.9 }
};

const introTransition = (delay: number, reduceMotion: boolean | null) =>
  reduceMotion
    ? { duration: 0 }
    : { ...INTRO.spring, delay, duration: INTRO.duration };

const overlayVariants = {
  idle: {
    y: '-100%',
    transition: {
      duration: 0.4,
      ease: easeOut,
      when: 'afterChildren' as const,
      staggerChildren: 0.03,
      staggerDirection: -1 as const
    }
  },
  active: {
    y: '0%',
    transition: {
      duration: 0.48,
      ease: easeOut,
      staggerChildren: 0.05,
      delayChildren: 0.15
    }
  }
};

const titleVariants = {
  idle: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.18, ease: easeOut }
  },
  active: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 28 }
  }
};

const arrowVariants = {
  idle: {
    opacity: 0,
    x: 14,
    scale: 0.82,
    transition: { duration: 0.16, ease: easeOut }
  },
  active: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 480, damping: 24 }
  }
};

function FeatureCard({ card }: { card: HeroFeatureCard }) {
  const [active, setActive] = useState(false);
  const reduceMotion = useReducedMotion();
  const state = active ? 'active' : 'idle';

  return (
    <a
      href={card.href}
      className="group relative block aspect-[16/10] overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/50 focus-visible:ring-offset-2"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={(event) => {
        if (!card.onNavigate) return;
        event.preventDefault();
        card.onNavigate();
      }}
    >
      <img
        src={card.imageSrc}
        alt={card.imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        referrerPolicy="no-referrer"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-0"
      />
      <span className="absolute bottom-4 left-4 z-[1] max-w-[85%] whitespace-pre-line text-lg font-semibold leading-snug text-white transition-opacity duration-300 group-hover:opacity-0 sm:text-xl">
        {card.title}
      </span>
      <motion.div
        aria-hidden={!active}
        className="absolute inset-0 z-[2] bg-[#294877] p-5 sm:p-6"
        initial={false}
        variants={reduceMotion ? undefined : overlayVariants}
        animate={
          reduceMotion
            ? { y: active ? '0%' : '-100%', transition: { duration: 0 } }
            : state
        }
      >
        <motion.span
          variants={reduceMotion ? undefined : titleVariants}
          animate={
            reduceMotion
              ? { opacity: active ? 1 : 0, y: 0, transition: { duration: 0 } }
              : undefined
          }
          className="relative z-[1] block max-w-[calc(100%-2.75rem)] whitespace-pre-line text-4xl font-bold leading-tight text-white sm:max-w-[calc(100%-3rem)] sm:text-5xl"
        >
          {card.title}
        </motion.span>
        <motion.span
          variants={reduceMotion ? undefined : arrowVariants}
          animate={
            reduceMotion
              ? { opacity: active ? 1 : 0, x: 0, scale: 1, transition: { duration: 0 } }
              : undefined
          }
          className="absolute bottom-5 right-5 z-[2] inline-flex sm:bottom-6 sm:right-6"
        >
          <ArrowRight
            className="size-8 shrink-0 text-white sm:size-9"
            strokeWidth={2.25}
            aria-hidden
          />
        </motion.span>
      </motion.div>
    </a>
  );
}

export function HomeHero({
  heroRef,
  heroNavPortalRef,
  title,
  lead,
  ctaSecondary,
  imageSrc,
  imageAlt,
  cards,
  onDiscoverClick
}: HomeHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section ref={heroRef} className="relative flex min-h-svh w-full flex-col bg-white">
      <div
        ref={heroNavPortalRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-[60]"
      />

      <div className="mx-auto flex w-[60vw] flex-1 flex-col justify-center px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: copy + CTA */}
          <div className="flex flex-col justify-center lg:pr-4">
            {/* Part 4 — batch 1 from top */}
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: -56 }}
              animate={{ opacity: 1, y: 0 }}
              transition={introTransition(INTRO.batch1, reduceMotion)}
              className="whitespace-pre-line text-[2.35rem] font-bold leading-[1.12] tracking-tight text-[#2a2f36] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.12] xl:text-[5.5rem]"
            >
              {title}
            </motion.h1>

            {/* Part 5 — batch 2 from left */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: -48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={introTransition(INTRO.batch2 + 0.04, reduceMotion)}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#6b7280] sm:text-lg"
            >
              {lead}
            </motion.p>

            {/* Part 6 — batch 3 from left */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={introTransition(INTRO.batch3 + 0.04, reduceMotion)}
              className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={onDiscoverClick}
                className="inline-flex items-center justify-center rounded-full bg-interactive px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-interactive/25 transition-colors hover:bg-[#294877] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/50 focus-visible:ring-offset-2"
              >
                {ctaSecondary}
              </button>
            </motion.div>
          </div>

          {/* Right: main image + feature-card carousel */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Part 1 — batch 1 from right */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 72 }}
              animate={{ opacity: 1, x: 0 }}
              transition={introTransition(INTRO.batch1 + 0.06, reduceMotion)}
              className="overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
            >
              <img
                src={imageSrc}
                alt={imageAlt}
                className="aspect-[16/10] w-full scale-[1.2] object-cover object-[42%_38%] -translate-y-[7%]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="hero-feature-carousel w-full min-w-0">
              {/*
                Part 2 — animate the real .hero-feature-swiper node from bottom (batch 2).
                Part 3 — slide pieces from right (batch 3); part 3' — pagination from right.
              */}
              <Swiper
                modules={[Autoplay, Pagination]}
                loop
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={16}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 20
                  }
                }}
                pagination={{
                  clickable: true,
                  el: '.hero-feature-pagination'
                }}
                className="hero-feature-swiper w-full"
                onBeforeInit={(swiper: SwiperInstance) => {
                  if (reduceMotion) return;
                  // Hide shell before first paint so part 2 can enter from bottom.
                  swiper.el.style.opacity = '0';
                  swiper.el.style.transform = 'translate3d(0, 96px, 0)';
                }}
                onSwiper={(swiper: SwiperInstance) => {
                  if (reduceMotion) return;
                  animate(
                    swiper.el,
                    { opacity: 1, y: 0 },
                    {
                      delay: INTRO.batch2,
                      type: 'spring',
                      stiffness: INTRO.spring.stiffness,
                      damping: INTRO.spring.damping,
                      mass: INTRO.spring.mass
                    }
                  );
                }}
              >
                {cards.map((card) => (
                  <SwiperSlide key={card.title} className="!h-auto">
                    {/* Part 3 — batch 3 from right (standalone from pagination) */}
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, x: 80 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={introTransition(INTRO.batch3, reduceMotion)}
                    >
                      <FeatureCard card={card} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/*
                Part 3' — pagination enters from the right on its own track.
                Outer slot stays layout-correct (centered); only the inner layer translates,
                so it never looks “parked” too far right after batch 2.
              */}
              <div className="mt-4 w-full overflow-hidden">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: '55%' }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={introTransition(INTRO.batch3, reduceMotion)}
                  className="w-full will-change-transform"
                >
                  <div className="hero-feature-pagination" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

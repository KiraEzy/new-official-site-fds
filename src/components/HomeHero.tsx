import type { Ref } from 'react';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Autoplay, Pagination } from 'swiper/modules';
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
  return (
    <section ref={heroRef} className="relative w-full bg-white">
      <div
        ref={heroNavPortalRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-[60]"
      />

      <div className="mx-auto w-[60vw] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-52">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: copy + CTA */}
          <div className="flex flex-col justify-center lg:min-h-[28rem] lg:pr-4">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="whitespace-pre-line text-[2.35rem] font-bold leading-[1.12] tracking-tight text-[#2a2f36] sm:text-5xl lg:text-[3.15rem] lg:leading-[1.12] xl:text-[5.5rem]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: easeOut }}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#6b7280] sm:text-lg"
            >
              {lead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: easeOut }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <div className="overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="aspect-[16/10] w-full scale-[1.2] object-cover object-[42%_38%] -translate-y-[7%]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="hero-feature-carousel w-full min-w-0">
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
              >
                {cards.map((card) => (
                  <SwiperSlide key={card.title} className="!h-auto">
                    <FeatureCard card={card} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="hero-feature-pagination mt-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion, useReducedMotion } from 'motion/react';

export function HomeHero({ title, lead }: { title: string; lead: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-home-hero="editorial"
      className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="font-hero-display mb-6 whitespace-pre-line text-5xl font-semibold leading-[1.12] tracking-tight text-text md:text-6xl lg:text-7xl"
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

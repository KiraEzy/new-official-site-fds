import { motion } from 'motion/react';
import GetInTouchSection from '../components/GetInTouchSection';
import { useI18n } from '../i18n/I18nContext';

type ContactUsPageProps = {
  colorProfile: 'default' | 'navy';
};

export default function ContactUsPage({ colorProfile }: ContactUsPageProps) {
  const { ns } = useI18n();
  const c = ns('contact');

  return (
    <main className="bg-[#f6fbff] mt-25 text-text antialiased">
      <section className="relative overflow-hidden pb-10 pt-16 lg:pb-14 lg:pt-22">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,184,245,0.12),transparent_42%),radial-gradient(circle_at_88%_36%,rgba(56,189,248,0.1),transparent_38%)]" />
        <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />

        <div className="relative z-10 mx-auto max-w-[880px] px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
            className="mb-6 text-xs font-bold uppercase tracking-[0.34em] text-primary"
          >
            {c.eyebrow as string}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-[clamp(2.35rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text"
          >
            {c.title as string}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.1 }}
            className="mx-auto mt-8 max-w-2xl text-xl font-medium leading-snug text-text/72 md:text-2xl md:leading-snug"
          >
            {c.lead as string}
          </motion.p>
        </div>
      </section>

      <GetInTouchSection colorProfile={colorProfile} alignContactInfoBottom={false} />
    </main>
  );
}
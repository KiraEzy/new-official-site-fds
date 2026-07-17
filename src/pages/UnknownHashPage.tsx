import { motion } from 'motion/react';
import { useI18n } from '../i18n/I18nContext';

export default function UnknownHashPage() {
  const { ns } = useI18n();
  const u = ns('unknown');

  return (
    <main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center bg-[#f6fbff] px-4 pt-28 pb-20 text-center text-text">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-lg"
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-primary">{u.eyebrow as string}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{u.title as string}</h1>
        <p className="mt-4 text-lg leading-8 text-text/65">{u.body as string}</p>
        <a
          href="#"
          className="mt-10 inline-flex items-center justify-center rounded-2xl bg-interactive px-8 py-3.5 text-sm font-bold text-white shadow-[0_18px_45px_rgba(17,184,245,0.28)] transition-all hover:bg-[#0a1f44]"
        >
          {u.backHome as string}
        </a>
      </motion.div>
    </main>
  );
}
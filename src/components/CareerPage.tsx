import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

function JobModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { ns } = useI18n();
  const c = ns('career');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] cursor-pointer bg-text/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 z-[101] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:inset-x-auto md:top-20 md:bottom-20 md:left-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2"
          >
            <div className="overflow-y-auto p-8 md:p-16">
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-text">{c.modalTitle as string}</h2>
                  <p className="text-sm font-medium text-text/40">{c.modalSubtitle as string}</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-text/5">
                  <X size={24} className="text-text/40" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none space-y-8 font-sans leading-relaxed text-text/70">
                <p>{c.modalInvite as string}</p>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-text">{c.sectionResponsibilities as string}</h3>
                  <p>{c.bodyResponsibilities as string}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-text">{c.sectionRequirements as string}</h3>
                  <p>{c.bodyRequirements as string}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-text">{c.sectionSkills as string}</h3>
                  <p>{c.bodySkills as string}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold uppercase tracking-wider text-text">{c.sectionBenefits as string}</h3>
                  <p>{c.bodyBenefits as string}</p>
                </div>

                <div className="border-t border-text/5 pt-8">
                  <p className="mb-4 font-bold text-text">
                    {c.applyClosing as string}
                    <a href={`mailto:${c.applyEmail as string}`} className="text-primary hover:underline">
                      {c.applyEmail as string}
                    </a>
                    {c.applyClosingAfterEmail as string}
                  </p>
                  <p className="text-xs italic text-text/30">{c.privacyNote as string}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CareerPage() {
  const { ns } = useI18n();
  const c = ns('career');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="bg-background pb-24 mt-[4.5rem] text-text antialiased sm:mt-[4.75rem] lg:mt-20">
      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <section className="bg-text/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
              {c.badge as string}
            </div>
            <h1 className="mb-8 text-5xl leading-none font-bold tracking-tighter text-text lg:text-7xl">
              {c.heroLine1 as string} <br />
              {c.heroLine2Lead as string} <span className="text-primary italic">{c.heroLine2Accent as string}</span>
            </h1>
            <p className="text-xl font-medium leading-relaxed text-text/60">{c.heroSubtitle as string}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="mb-12 flex items-center gap-4 text-2xl font-bold tracking-widest text-text/40 uppercase">
              {c.openOpportunities as string}
              <div className="h-px grow bg-text/5" />
            </h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="group flex flex-col justify-between gap-8 rounded-3xl border border-text/5 bg-white p-10 transition-all hover:border-primary/30 hover:shadow-2xl md:flex-row md:items-center"
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                  {c.engineeringTag as string}
                </div>
                <h3 className="text-4xl font-bold tracking-tighter text-text">{c.jobTitle as string}</h3>
                <div className="flex flex-wrap gap-8 text-sm font-bold tracking-widest text-text/40 uppercase">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" /> {c.locationHongKong as string}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> {c.employmentFullTime as string}
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" /> {c.freshGrads as string}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex shrink-0 items-center gap-3 rounded-full bg-text px-10 py-5 font-bold text-white shadow-xl shadow-text/10 transition-all hover:bg-primary group"
              >
                {c.applyNow as string} <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

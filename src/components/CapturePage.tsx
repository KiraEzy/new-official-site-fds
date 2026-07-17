import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Barcode,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Cpu,
  Layers,
  Scan,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { useI18n } from '../i18n/I18nContext';

const CONTACT_HASH = '#contact-us';

const FEATURE_ICONS: LucideIcon[] = [Scan, LayoutGrid, SlidersHorizontal, Tags, RefreshCw, Barcode, ClipboardCheck];

function featurePairs(c: Record<string, unknown>): { title: string; desc: string }[] {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    title: String(c[`feat${i}Title`]),
    desc: String(c[`feat${i}Desc`])
  }));
}

export default function CapturePage() {
  const { ns } = useI18n();
  const c = ns('capture') as Record<string, unknown>;
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specifications' | 'resources'>('overview');

  const tabs: { id: typeof activeTab; label: string; icon: ReactNode }[] = [
    { id: 'overview', label: String(c.tabOverview), icon: <Cpu size={18} aria-hidden /> },
    { id: 'features', label: String(c.tabFeatures), icon: <Layers size={18} aria-hidden /> },
    { id: 'specifications', label: String(c.tabSpecifications), icon: <Settings2 size={18} aria-hidden /> },
    { id: 'resources', label: String(c.tabResources), icon: <BookOpen size={18} aria-hidden /> }
  ];

  const specs = [
    { title: String(c.specCard0Title), desc: String(c.specCard0Desc) },
    { title: String(c.specCard1Title), desc: String(c.specCard1Desc) },
    { title: String(c.specCard2Title), desc: String(c.specCard2Desc) },
    { title: String(c.specCard3Title), desc: String(c.specCard3Desc) }
  ];

  const specificationBlocks = [
    { heading: String(c.specBlock0Heading), body: String(c.specBlock0Body) },
    { heading: String(c.specBlock1Heading), body: String(c.specBlock1Body) },
    { heading: String(c.specBlock2Heading), body: String(c.specBlock2Body) }
  ];

  const overviewBenefits = [
    String(c.overviewBenefit0),
    String(c.overviewBenefit1),
    String(c.overviewBenefit2),
    String(c.overviewBenefit3)
  ];

  const featureItems = featurePairs(c);

  const tabContent = {
    overview: (
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-2xl font-bold text-text">{c.overviewTitle as string}</h3>
          <p className="leading-relaxed text-text/60">
            {c.overviewP1Lead as string}
            <span className="font-semibold text-text/80">{c.overviewP1Bold as string}</span>
            {c.overviewP1After as string}
          </p>
        </div>
        <p className="leading-relaxed text-text/60">
          {c.overviewP2Lead as string} <span className="font-semibold text-text/80">{c.overviewP2Bold as string}</span>
          {c.overviewP2After as string}
        </p>
        <div>
          <h4 className="mb-3 text-lg font-semibold text-text">{c.benefitsHeading as string}</h4>
          <ul className="space-y-3">
            {overviewBenefits.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-text/65">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    features: (
      <div className="space-y-7">
        <p className="mx-auto max-w-2xl text-center text-sm text-text/60">{c.featuresIntro as string}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureItems.map(({ title, desc }, idx) => {
            const Icon = FEATURE_ICONS[idx];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center rounded-2xl border border-text/8 bg-white p-6 text-center shadow-sm transition hover:border-primary/20 hover:shadow-md"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-background">
                  {Icon ? <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden /> : null}
                </span>
                <h4 className="mb-2 text-base font-bold text-text">{title}</h4>
                <p className="text-xs leading-relaxed text-text/60">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    ),
    specifications: (
      <div className="space-y-7">
        <p className="text-sm leading-relaxed text-text/65">{c.specLead as string}</p>
        <div className="grid gap-5 md:grid-cols-3">
          {specificationBlocks.map((block, idx) => (
            <motion.article
              key={block.heading}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl border border-text/10 bg-background p-5"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{block.heading}</p>
              <p className="text-sm leading-relaxed text-text/70">{block.body}</p>
            </motion.article>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {specs.map((spec) => (
            <div key={spec.title} className="flex gap-3 rounded-2xl border border-text/6 bg-white/80 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h4 className="mb-1 font-bold text-text">{spec.title}</h4>
                <p className="text-sm text-text/65">{spec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    resources: (
      <div className="space-y-6 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.05] via-background to-accent/[0.04] p-6 md:p-8">
        <div>
          <h3 className="mb-2 text-xl font-bold text-text">{c.resourcesHeading as string}</h3>
          <p className="text-sm leading-relaxed text-text/65">{c.resourcesLead as string}</p>
        </div>
        <ul className="space-y-2 text-sm text-text/70">
          <li className="flex gap-3">
            <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>{c.resourcesBullet0 as string}</span>
          </li>
          <li className="flex gap-3">
            <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>{c.resourcesBullet1 as string}</span>
          </li>
        </ul>
        <motion.a
          href={CONTACT_HASH}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/25"
        >
          {c.resourcesCta as string} <ArrowRight size={18} aria-hidden />
        </motion.a>
      </div>
    )
  } as const;

  return (
    <main className="bg-background pb-16 pt-24 text-text antialiased sm:pt-28 lg:pb-20 lg:pt-44">
      <section className="relative overflow-hidden border-b border-text/5 pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_50%_40%,rgba(17,184,245,0.04)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {c.pill as string}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-text sm:text-5xl lg:mb-6 lg:text-6xl">
                {c.heroHeadlineLead as string} <br />
                <span className="text-primary">{c.heroHeadlineAccent as string}</span>
              </h1>
              <p className="mb-4 max-w-xl text-base font-medium leading-relaxed text-text/60 sm:text-lg">
                {(() => {
                  const lead = String(c.heroParagraph);
                  const bold = String(c.heroParagraphBold);
                  const idx = lead.indexOf(bold);
                  if (idx < 0) return lead;
                  return (
                    <>
                      {lead.slice(0, idx)}
                      <span className="font-semibold text-text/75">{bold}</span>
                      {lead.slice(idx + bold.length)}
                    </>
                  );
                })()}
              </p>
              <div className="mb-8 flex flex-wrap gap-4">
                <motion.a
                  href={CONTACT_HASH}
                  whileHover="hover"
                  initial="initial"
                  className="group relative inline-flex h-auto overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 sm:px-10 sm:py-5 sm:text-base"
                >
                  <span className="relative z-10">{c.heroCta as string}</span>
                  <motion.div
                    variants={{
                      initial: { width: 0 },
                      hover: { width: '100%' }
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 z-0 bg-accent"
                  />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square lg:aspect-1.5/1"
            >
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-text/5 bg-white p-8 shadow-2xl">
                <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-primary/20">
                  <Scan size={120} className="text-primary/10" aria-hidden />
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-primary/5 p-2 px-4 text-[10px] font-bold tracking-tighter text-primary uppercase">
                      {c.batchLabel as string}
                    </div>
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-text/5">
                      <motion.div
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="h-full w-1/2 bg-primary/40 shadow-[0_0_10px_rgba(17,184,245,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 flex items-center gap-3 rounded-2xl border border-text/5 bg-white p-5 shadow-xl"
              >
                <ClipboardCheck className="text-primary" size={24} aria-hidden />
                <div>
                  <div className="text-[10px] font-bold uppercase text-text/40">{c.verificationLabel as string}</div>
                  <div className="text-sm font-bold text-text">{c.verificationValue as string}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="h-fit lg:sticky lg:top-36 lg:col-span-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all sm:text-base ${
                      activeTab === tab.id
                        ? 'translate-x-2 bg-primary text-white shadow-xl shadow-primary/20'
                        : 'text-text/40 hover:bg-text/5 hover:text-text'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-white' : 'text-primary'}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[280px] lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-text/2 py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">{c.glanceEyebrow as string}</p>
            <h2 className="mt-2 text-xl font-bold text-text md:text-2xl">{c.glanceHeading as string}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.title} className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{spec.title}</h4>
                <p className="text-sm font-medium text-text/70">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-primary p-10 text-white shadow-2xl shadow-primary/20 sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]" />
            <h2 className="relative z-10 mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{c.ctaTitle as string}</h2>
            <p className="relative z-10 mx-auto mb-8 max-w-xl text-base font-medium text-white/75 sm:text-lg">{c.ctaSubtitle as string}</p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <motion.a
                href={CONTACT_HASH}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-primary shadow-xl transition-all hover:bg-gray-50 sm:px-10 sm:py-5 sm:text-sm"
              >
                {c.ctaButton as string} <ArrowRight size={18} aria-hidden />
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

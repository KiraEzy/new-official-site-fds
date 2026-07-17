import { AnimatePresence, motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  Archive,
  CheckCircle2,
  Clock,
  Code,
  Database,
  Globe,
  ImageIcon,
  Layers,
  LayoutPanelLeft,
  Megaphone,
  Newspaper,
  PieChart,
  Rss,
  Search,
  Share2,
  Shield,
  Shuffle,
  Tags,
  Users,
  Zap
} from 'lucide-react';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';

const CONTACT_HASH = '#contact-us';

/** Icon order aligns with webContentManagement locale productFeatures JSON array */
const PRODUCT_FEATURE_ICONS: LucideIcon[] = [
  Database,
  Archive,
  ImageIcon,
  Code,
  Users,
  LayoutPanelLeft,
  Newspaper,
  Megaphone,
  PieChart,
  Shuffle,
  Tags,
  Search,
  Layers,
  Rss,
  AppWindow
];

const WCM_WIDGET_FOLLOW_STRENGTH = 0.38;

function WcmHeroVisual({ caption }: { caption: string }) {
  const [pointerInside, setPointerInside] = useState(false);
  const [follow, setFollow] = useState({ x: 0, y: 0 });

  const handleWidgetMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const k = WCM_WIDGET_FOLLOW_STRENGTH;
    setFollow({
      x: (mx - cx) * k,
      y: (my - cy) * k
    });
  };

  const handleWidgetLeave = () => {
    setPointerInside(false);
    setFollow({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative aspect-square overflow-hidden rounded-[2rem] border border-text/[0.06] bg-white shadow-2xl lg:aspect-video"
    >
      <div className="absolute inset-0 bg-primary/[0.06] p-8">
        <div
          role="presentation"
          onMouseEnter={() => setPointerInside(true)}
          onMouseMove={handleWidgetMove}
          onMouseLeave={handleWidgetLeave}
          className="relative flex h-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/20"
        >
          <Globe size={80} className="pointer-events-none text-primary/15" strokeWidth={1.25} aria-hidden />
          <div className="pointer-events-none flex gap-2">
            <div className="h-3 w-3 rounded-full bg-primary/25" />
            <div className="h-3 w-12 rounded-full bg-primary/25" />
          </div>
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            animate={{ x: follow.x, y: follow.y }}
            transition={
              pointerInside
                ? { type: 'spring', stiffness: 42, damping: 26, mass: 0.85 }
                : { type: 'spring', stiffness: 86, damping: 17, mass: 0.72 }
            }
          >
            <div className="flex max-w-[min(100%-2rem,280px)] items-center gap-3 rounded-2xl border border-text/[0.06] bg-white p-4 shadow-xl">
              <Share2 className="shrink-0 text-primary" size={20} aria-hidden />
              <span className="text-xs font-bold leading-snug text-text">{caption}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WebContentManagementPage() {
  const { ns } = useI18n();
  const w = ns('webContentManagement');
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow'>('overview');

  const productFeatures = w.productFeatures as { title: string; desc: string }[];
  const officialBenefits = w.officialBenefits as string[];
  const workflowSteps = w.workflowSteps as { step: string; desc: string }[];
  const channelHighlights = w.channelHighlights as string[];
  const modulesSidebarBenefits = w.modulesSidebarBenefits as string[];

  const tabs: { id: typeof activeTab; label: string; icon: ReactNode }[] = [
    { id: 'overview', label: w.tabOverview as string, icon: <Globe size={18} aria-hidden /> },
    { id: 'workflow', label: w.tabPublishingFlow as string, icon: <Zap size={18} aria-hidden /> }
  ];

  const tabPanels = {
    overview: (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-3xl font-bold text-text">{w.overviewChannelTitle as string}</h3>
          <p className="mb-3 text-base leading-relaxed text-text/60 sm:text-lg">{w.overviewChannelLead as string}</p>
          <p className="text-sm leading-relaxed text-text/55 sm:text-base">{w.overviewChannelUnified as string}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          {officialBenefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-text/[0.06] bg-primary/[0.04] p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12">
                <CheckCircle2 className="text-primary" size={18} strokeWidth={2} aria-hidden />
              </div>
              <p className="font-medium text-text/70">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    workflow: (
      <div className="space-y-12">
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-text/10" aria-hidden />
          <div className="space-y-12">
            {workflowSteps.map((item, idx) => (
              <div key={`${item.step}-${idx}`} className="relative pl-12">
                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-white">
                  {idx + 1}
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="text-primary" size={18} aria-hidden />
                  <h4 className="text-xl font-bold text-text">{item.step}</h4>
                </div>
                <p className="text-text/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  return (
    <main className="bg-background pb-24 pt-25 text-text antialiased">
      <section className="relative overflow-hidden border-b border-text/[0.05] pt-8 pb-20 lg:pt-10 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(35%_35%_at_50%_40%,rgba(17,184,245,0.06)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {w.heroBadge as string}
              </div>
              <h1 className="mb-8 text-5xl font-bold leading-[1.08] tracking-tight text-text lg:text-7xl">
                {w.heroLine1 as string} <br />
                <span className="text-primary">{w.heroLine2Accent as string}</span>
              </h1>
              <p className="mb-6 max-w-xl text-lg font-medium leading-relaxed text-text/60 sm:text-xl">{w.overviewChannelLead as string}</p>
              <p className="mb-12 max-w-xl text-sm font-medium leading-relaxed text-text/55 sm:text-base">{w.overviewChannelUnified as string}</p>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={CONTACT_HASH}
                  whileHover="hover"
                  initial="initial"
                  className="group relative inline-flex h-auto overflow-hidden rounded-full bg-primary px-10 py-5 font-bold text-white shadow-xl shadow-primary/20"
                >
                  <span className="relative z-10">{w.heroCtaPrimary as string}</span>
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

            <WcmHeroVisual caption={w.heroVisualCaption as string} />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="h-fit lg:sticky lg:top-28 lg:col-span-4">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">{w.exploreEyebrow as string}</p>
              <h2 className="mb-8 text-3xl font-bold text-text lg:text-4xl">{w.exploreTitle as string}</h2>
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-left text-base font-bold transition-all ${
                      activeTab === tab.id
                        ? 'translate-x-1 bg-primary text-white shadow-xl shadow-primary/20'
                        : 'text-text/45 hover:bg-text/[0.04] hover:text-text'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-white' : 'text-primary'}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[28rem] lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28 }}
                >
                  {tabPanels[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-text/[0.06] bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
            <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">{w.capabilitiesEyebrow as string}</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-text lg:text-4xl xl:text-[2.5rem] xl:leading-tight">
                {w.modulesSidebarTitle as string}
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-text/65">{w.modulesSidebarSummary as string}</p>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-text/45">{w.modulesSidebarBenefitsTitle as string}</h3>
              <ul className="mb-6 space-y-2">
                {modulesSidebarBenefits.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[13px] leading-snug text-text/70">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] leading-relaxed text-text/45">{w.modulesFooterNote as string}</p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {productFeatures.map(({ title, desc }, idx) => {
                  const Icon = PRODUCT_FEATURE_ICONS[idx];
                  return (
                    <motion.article
                      key={`${title}-${idx}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                      className="relative min-h-[220px] overflow-hidden rounded-3xl border border-text/5 bg-white p-6 shadow-[0_18px_60px_rgba(1,20,26,0.05)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <span className="absolute inset-x-0 top-0 h-3 bg-linear-to-r from-primary via-secondary to-accent" aria-hidden />
                      <span className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/8 to-transparent" aria-hidden />
                      <div className="pointer-events-none absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f1f8ff] text-primary shadow-inner">
                        {Icon ? <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden /> : null}
                      </div>
                      <div className="relative z-10 pr-14">
                        <h3 className="text-lg font-bold text-text">{title}</h3>
                        <p className="mt-3 text-sm leading-7 text-text/60">{desc}</p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-text py-24 text-white lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="mb-10 text-4xl font-bold leading-tight">
                {w.channelHighlightTitleLine1 as string} <br />
                <span className="text-primary">{w.channelHighlightTitleAccent as string}</span>
              </h2>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {channelHighlights.map((item, idx) => (
                  <motion.div
                    key={`${item.slice(0, 24)}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    viewport={{ once: true }}
                    className="group flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} aria-hidden />
                    <span className="text-sm font-medium leading-snug text-white/72 transition-colors group-hover:text-white">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                <Shield className="text-primary" size={32} aria-hidden />
                <h3 className="text-2xl font-bold text-white">{w.guardrailsTitle as string}</h3>
              </div>
              <p className="mb-8 text-sm leading-relaxed text-white/55">{w.guardrailsBody as string}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                  <Users className="text-primary" size={22} aria-hidden />
                  <span className="text-sm font-bold uppercase tracking-wider text-white/90">{w.guardrailAccount as string}</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                  <Clock className="text-primary" size={22} aria-hidden />
                  <span className="text-sm font-bold uppercase tracking-wider text-white/90">{w.guardrailSchedule as string}</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                  <Archive className="text-primary" size={22} aria-hidden />
                  <span className="text-sm font-bold uppercase tracking-wider text-white/90">{w.guardrailRetention as string}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[3rem] border border-primary/10 bg-primary/[0.03] p-12 lg:p-20">
            <h2 className="mb-8 text-4xl font-bold tracking-tight text-text lg:text-6xl">{w.ctaBandTitle as string}</h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-text/50">{w.ctaBandLead as string}</p>
            <motion.a
              href={CONTACT_HASH}
              whileHover="hover"
              initial="initial"
              className="group relative inline-flex h-auto items-center gap-3 overflow-hidden rounded-full bg-primary px-12 py-5 font-bold text-white shadow-xl shadow-primary/20"
            >
              <span className="relative z-10">{w.ctaBandButton as string}</span>
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
        </div>
      </section>
    </main>
  );
}

import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarClock,
  Eye,
  FilePlus,
  GitBranch,
  ImageIcon,
  Languages,
  LayoutTemplate,
  ListTree,
  MonitorPlay,
  Sparkles,
  StretchHorizontal,
  Wand2,
  Settings2,
  MessageSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { CONTACT_US_HASH, FOCAL_AI_PAGE_HASH } from '../content/pageHashes';

function ChromeFrame({
  caption,
  className = '',
  children,
}: {
  caption?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[1.75rem] border border-text/8 bg-white shadow-[0_28px_80px_rgba(1,20,26,0.12)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-text/6 bg-[#f4f7fa] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate text-[10px] font-medium tracking-wide text-text/35">
          {caption ?? 'focal-wcms'}
        </span>
      </div>
      {children}
    </figure>
  );
}

function ShotFrame({
  src,
  alt,
  caption,
  className = '',
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <ChromeFrame caption={caption} className={className}>
      <img src={src} alt={alt} className="aspect-video w-full bg-background object-cover object-top" />
    </ChromeFrame>
  );
}

function HeroVideo({
  src,
  title,
  caption,
}: {
  src: string;
  title: string;
  caption?: string;
}) {
  return (
    <ChromeFrame caption={caption}>
      <video
        className="aspect-video w-full bg-[#01141a] object-cover"
        src={src}
        title={title}
        aria-label={title}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
      />
    </ChromeFrame>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FeatureGrid({
  items,
  dark = false,
}: {
  items: { title: string; body: string; Icon: LucideIcon }[];
  dark?: boolean;
}) {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
      {items.map(({ title, body, Icon }) => (
        <li
          key={title}
          className={
            dark
              ? 'rounded-2xl border border-white/10 bg-white/6 p-4'
              : 'rounded-2xl border border-text/8 bg-white p-4 shadow-sm'
          }
        >
          <span
            className={
              dark
                ? 'mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-sky-300'
                : 'mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary'
            }
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-text'}`}>{title}</p>
          <p className={`mt-1.5 text-xs leading-relaxed ${dark ? 'text-white/65' : 'text-text/60'}`}>{body}</p>
        </li>
      ))}
    </ul>
  );
}

function AgentConsole({ w }: { w: Record<string, string> }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#071427] shadow-[0_28px_80px_rgba(1,20,26,0.35)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-400" aria-hidden />
          <p className="text-xs font-bold tracking-wide text-white">{w.aiMockTitle}</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-300 uppercase">
          {w.aiMockHint}
        </span>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="ml-8 rounded-2xl rounded-tr-md bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/90">
          {w.aiMockQ}
        </div>
        <div className="mr-8 rounded-2xl rounded-tl-md bg-primary/20 px-4 py-3 text-sm leading-relaxed text-sky-50">
          {w.aiMockA}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {[w.aiMockSkill0, w.aiMockSkill1, w.aiMockSkill2].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/80"
            >
              <Wand2 size={12} aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/25 px-5 py-4">
        <p className="mb-3 text-[10px] font-bold tracking-[0.22em] text-white/45 uppercase">{w.aiSettingsLabel}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { label: w.aiSettingsModel, Icon: Settings2 },
            { label: w.aiSettingsTools, Icon: Wand2 },
            { label: w.aiSettingsReview, Icon: MessageSquare },
          ].map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
              <Icon size={14} className="shrink-0 text-sky-300" aria-hidden />
              <span className="text-[11px] font-medium text-white/75">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FocalWcmsPage() {
  const { ns } = useI18n();
  const w = ns('focalWcms') as Record<string, string>;

  const suite = [
    { id: 'focal-layout-editor', name: w.suite0Name, blurb: w.suite0Blurb, n: '01' },
    { id: 'focal-locale-manager', name: w.suite1Name, blurb: w.suite1Blurb, n: '02' },
    { id: 'focal-content-manager', name: w.suite2Name, blurb: w.suite2Blurb, n: '03' },
    { id: 'focal-ai-integration', name: w.suite3Name, blurb: w.suite3Blurb, n: '04' },
  ];

  const layoutFeats = [
    { title: w.layoutFeat0Title, body: w.layoutFeat0Body, Icon: LayoutTemplate },
    { title: w.layoutFeat1Title, body: w.layoutFeat1Body, Icon: StretchHorizontal },
    { title: w.layoutFeat2Title, body: w.layoutFeat2Body, Icon: Eye },
    { title: w.layoutFeat3Title, body: w.layoutFeat3Body, Icon: MonitorPlay },
  ];

  const localeFeats = [
    { title: w.localeFeat0Title, body: w.localeFeat0Body, Icon: GitBranch },
    { title: w.localeFeat1Title, body: w.localeFeat1Body, Icon: ListTree },
    { title: w.localeFeat2Title, body: w.localeFeat2Body, Icon: Languages },
  ];

  const cmFeats = [
    { title: w.cmFeat0Title, body: w.cmFeat0Body, Icon: FilePlus },
    { title: w.cmFeat1Title, body: w.cmFeat1Body, Icon: CalendarClock },
    { title: w.cmFeat2Title, body: w.cmFeat2Body, Icon: ImageIcon },
  ];

  const aiFeats = [
    { title: w.aiFeat0Title, body: w.aiFeat0Body, Icon: MessageSquare },
    { title: w.aiFeat1Title, body: w.aiFeat1Body, Icon: Wand2 },
    { title: w.aiFeat2Title, body: w.aiFeat2Body, Icon: Settings2 },
  ];

  return (
    <main className="bg-background pb-16 pt-24 text-text antialiased sm:pt-28 lg:pb-20 lg:pt-44">
      <section className="relative overflow-hidden border-b border-text/5 pb-14 pt-6 sm:pb-20 sm:pt-8 lg:pb-24 lg:pt-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_80%_10%,rgba(17,184,245,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                {w.pill}
              </div>
              <h1 className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {w.heroHeadlineLead} <span className="text-primary">{w.heroHeadlineAccent}</span>
              </h1>
              <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-text/60 sm:text-lg">{w.heroLead}</p>
              <div className="flex flex-wrap gap-3">
                <motion.a
                  href={CONTACT_US_HASH}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20"
                >
                  {w.heroCta} <ArrowRight size={18} aria-hidden />
                </motion.a>
                <button
                  type="button"
                  onClick={() => scrollToId('focal-wcms-suite')}
                  className="inline-flex items-center gap-2 rounded-full border border-text/12 bg-white px-8 py-4 text-sm font-bold text-text/80 transition hover:border-primary/30 hover:text-primary"
                >
                  {w.heroSecondary}
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              <HeroVideo src="/assets/focal-wcms/hero.mp4" title={w.heroShotAlt} caption={w.heroShotCaption} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-text/5 bg-[#f6fbff] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.proofEyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{w.proofTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text/60">{w.proofBody}</p>
        </div>
      </section>

      <section id="focal-wcms-suite" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.suiteEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{w.suiteTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text/60">{w.suiteLead}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {suite.map((item, idx) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => scrollToId(item.id)}
                className="group flex h-full flex-col rounded-[1.5rem] border border-text/8 bg-white p-5 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md"
              >
                <span className="font-mono text-[11px] font-semibold tracking-widest text-primary/70">{item.n}</span>
                <h3 className="mt-3 text-base font-bold leading-snug group-hover:text-primary">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text/55">{item.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
                  <ArrowRight size={14} aria-hidden />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="focal-layout-editor"
        className="scroll-mt-28 border-y border-text/5 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ShotFrame src="/assets/focal-wcms/layout-editor.png" alt={w.layoutAlt} caption={w.layoutEyebrow} />
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.layoutEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.layoutTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.layoutBody}</p>
            <FeatureGrid items={layoutFeats} />
          </div>
        </div>
      </section>

      <section id="focal-locale-manager" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <ShotFrame src="/assets/focal-wcms/content-manager-locales.png" alt={w.localeAlt} caption={w.localeEyebrow} />
          </div>
          <div className="lg:order-1">
            <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.localeEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.localeTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.localeBody}</p>
            <FeatureGrid items={localeFeats} />
          </div>
        </div>
      </section>

      <section
        id="focal-content-manager"
        className="scroll-mt-28 border-y border-text/5 bg-[#f6fbff] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid gap-4">
            <ShotFrame src="/assets/focal-wcms/content-manager-pages.png" alt={w.cmAlt} caption={w.cmEyebrow} />
            <ShotFrame src="/assets/focal-wcms/content-manager-nav.png" alt={w.cmAlt2} caption={w.cmEyebrow} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.cmEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.cmTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.cmBody}</p>
            <FeatureGrid items={cmFeats} />
          </div>
        </div>
      </section>

      <section
        id="focal-ai-integration"
        className="scroll-mt-28 bg-[#071427] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <AgentConsole w={w} />
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-sky-400 uppercase">{w.aiEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.aiTitle}</h2>
            <p className="mt-5 text-base leading-8 text-white/65">{w.aiBody}</p>
            <FeatureGrid items={aiFeats} dark />
            <a
              href={FOCAL_AI_PAGE_HASH}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-white"
            >
              {w.aiSecondary} <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-10 py-12 text-center text-white shadow-2xl shadow-primary/20 sm:px-12 lg:px-16 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%)]" />
          <h2 className="relative z-10 mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{w.ctaTitle}</h2>
          <p className="relative z-10 mx-auto mb-8 max-w-xl text-base font-medium text-white/75 sm:text-lg">
            {w.ctaSubtitle}
          </p>
          <motion.a
            href={CONTACT_US_HASH}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold tracking-widest text-primary uppercase shadow-xl sm:text-sm"
          >
            {w.ctaButton} <ArrowRight size={18} aria-hidden />
          </motion.a>
        </div>
      </section>
    </main>
  );
}

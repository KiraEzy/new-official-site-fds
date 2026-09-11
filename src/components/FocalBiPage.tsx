import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Crosshair,
  Database,
  Filter,
  Flag,
  GitBranch,
  ImageIcon,
  Layers,
  LayoutDashboard,
  MonitorPlay,
  MousePointerClick,
  Palette,
  Table2,
  Terminal,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { CONTACT_US_HASH } from '../content/pageHashes';

type DeskId = 'dashboards' | 'charts' | 'sql' | 'datasets';

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
          {caption ?? 'focal-bi'}
        </span>
      </div>
      {children}
    </figure>
  );
}

function EmptyMedia({
  kind,
  alt,
  need,
  caption,
  file,
  pendingBadge,
  kindLabel,
  className = '',
  frameClassName = 'aspect-video',
  dark = false,
}: {
  kind: 'image' | 'video';
  alt: string;
  need: string;
  caption?: string;
  file: string;
  pendingBadge: string;
  kindLabel: string;
  className?: string;
  frameClassName?: string;
  dark?: boolean;
}) {
  const Icon = kind === 'video' ? MonitorPlay : ImageIcon;
  return (
    <ChromeFrame caption={caption} className={className}>
      <div
        role="img"
        aria-label={alt}
        className={`flex w-full flex-col justify-between p-5 text-left sm:p-6 ${frameClassName} ${
          dark ? 'bg-[#071427]' : 'bg-[#eef4f8]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={
              dark
                ? 'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold tracking-wide text-sky-200 uppercase'
                : 'inline-flex items-center gap-1.5 rounded-full border border-text/10 bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-primary uppercase'
            }
          >
            <Icon size={12} aria-hidden />
            {kindLabel}
          </span>
          <span
            className={
              dark
                ? 'rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-200'
                : 'rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-800'
            }
          >
            {pendingBadge}
          </span>
        </div>
        <div>
          <p className={`font-mono text-[11px] font-semibold ${dark ? 'text-sky-300/90' : 'text-primary'}`}>{file}</p>
          <p className={`mt-2 max-w-xl text-xs leading-relaxed sm:text-sm ${dark ? 'text-white/70' : 'text-text/55'}`}>
            {need}
          </p>
        </div>
      </div>
    </ChromeFrame>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FeatureList({
  items,
  dark = false,
}: {
  items: { title: string; body: string; Icon: LucideIcon }[];
  dark?: boolean;
}) {
  return (
    <ul
      className={`mt-8 space-y-0 divide-y border-t ${
        dark ? 'divide-white/10 border-white/10' : 'divide-text/8 border-text/8'
      }`}
    >
      {items.map(({ title, body, Icon }) => (
        <li key={title} className="flex gap-4 py-4 first:pt-5">
          <span
            className={
              dark
                ? 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-sky-300'
                : 'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'
            }
          >
            <Icon size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-text'}`}>{title}</p>
            <p className={`mt-1 text-sm leading-relaxed ${dark ? 'text-white/65' : 'text-text/60'}`}>{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function FocalBiPage() {
  const { ns } = useI18n();
  const w = ns('focalBi') as Record<string, string>;
  const [desk, setDesk] = useState<DeskId>('dashboards');

  const desks: {
    id: DeskId;
    label: string;
    title: string;
    body: string;
    file: string;
    alt: string;
    need: string;
    Icon: LucideIcon;
    feats: { title: string; body: string; Icon: LucideIcon }[];
  }[] = [
    {
      id: 'dashboards',
      label: w.desk0Label,
      title: w.desk0Title,
      body: w.desk0Body,
      file: '/assets/focal-bi/dashboards.png',
      alt: w.card0Alt,
      need: w.card0Need,
      Icon: LayoutDashboard,
      feats: [
        { title: w.desk0Feat0Title, body: w.desk0Feat0Body, Icon: Filter },
        { title: w.desk0Feat1Title, body: w.desk0Feat1Body, Icon: Palette },
        { title: w.desk0Feat2Title, body: w.desk0Feat2Body, Icon: Zap },
      ],
    },
    {
      id: 'charts',
      label: w.desk1Label,
      title: w.desk1Title,
      body: w.desk1Body,
      file: '/assets/focal-bi/chart-builder.png',
      alt: w.card1Alt,
      need: w.card1Need,
      Icon: BarChart3,
      feats: [
        { title: w.desk1Feat0Title, body: w.desk1Feat0Body, Icon: MousePointerClick },
        { title: w.desk1Feat1Title, body: w.desk1Feat1Body, Icon: BarChart3 },
        { title: w.desk1Feat2Title, body: w.desk1Feat2Body, Icon: Layers },
      ],
    },
    {
      id: 'sql',
      label: w.desk2Label,
      title: w.desk2Title,
      body: w.desk2Body,
      file: '/assets/focal-bi/sql-lab.png',
      alt: w.card2Alt,
      need: w.card2Need,
      Icon: Terminal,
      feats: [
        { title: w.desk2Feat0Title, body: w.desk2Feat0Body, Icon: Terminal },
        { title: w.desk2Feat1Title, body: w.desk2Feat1Body, Icon: Table2 },
        { title: w.desk2Feat2Title, body: w.desk2Feat2Body, Icon: Database },
      ],
    },
    {
      id: 'datasets',
      label: w.desk3Label,
      title: w.desk3Title,
      body: w.desk3Body,
      file: '/assets/focal-bi/datasets.png',
      alt: w.card3Alt,
      need: w.card3Need,
      Icon: Database,
      feats: [
        { title: w.desk3Feat0Title, body: w.desk3Feat0Body, Icon: GitBranch },
        { title: w.desk3Feat1Title, body: w.desk3Feat1Body, Icon: Table2 },
        { title: w.desk3Feat2Title, body: w.desk3Feat2Body, Icon: Crosshair },
      ],
    },
  ];

  const activeDesk = desks.find((d) => d.id === desk) ?? desks[0];

  const deepFeats = [
    { title: w.deepFeat0Title, body: w.deepFeat0Body, Icon: MousePointerClick },
    { title: w.deepFeat1Title, body: w.deepFeat1Body, Icon: Crosshair },
    { title: w.deepFeat2Title, body: w.deepFeat2Body, Icon: GitBranch },
    { title: w.cap7Title, body: w.cap7Body, Icon: Flag },
  ];

  return (
    <main className="bg-background pb-16 pt-24 text-text antialiased sm:pt-28 lg:pb-20 lg:pt-44">
      <section className="relative overflow-hidden border-b border-text/5 pb-10 pt-6 sm:pb-12 sm:pt-8 lg:pb-16 lg:pt-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_80%_10%,rgba(17,184,245,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute inset-0 -z-10 opacity-50 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                {w.pill}
              </div>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {w.heroLine1} <span className="text-primary">{w.heroLine2Accent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-text/60 sm:text-lg">{w.heroLead}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 lg:pb-1">
              <motion.a
                href={CONTACT_US_HASH}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20"
              >
                {w.heroCtaEnquire} <ArrowRight size={18} aria-hidden />
              </motion.a>
              <button
                type="button"
                onClick={() => scrollToId('focal-bi-desks')}
                className="inline-flex items-center gap-2 rounded-full border border-text/12 bg-white px-8 py-4 text-sm font-bold text-text/80 transition hover:border-primary/30 hover:text-primary"
              >
                {w.heroCta}
              </button>
            </div>
          </div>

          <div className="mt-10 lg:mt-12">
            <EmptyMedia
              kind="image"
              file="/assets/focal-bi/hero.png"
              alt={w.heroShotAlt}
              need={w.heroShotNeed}
              caption={w.heroShotCaption}
              pendingBadge={w.pendingBadge}
              kindLabel={w.pendingImage}
              frameClassName="aspect-[5/4] sm:aspect-video lg:aspect-[2/1]"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-text/5 bg-[#f6fbff] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.pillarsEyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{w.pillarsTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text/60">{w.pillarsLead}</p>
        </div>
      </section>

      <section id="focal-bi-desks" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.desksEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{w.desksTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text/60">{w.desksLead}</p>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="h-fit lg:sticky lg:top-36 lg:col-span-4">
              <div role="tablist" aria-label={w.desksTitle} className="space-y-2">
                {desks.map((tab) => {
                  const selected = desk === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      id={`focal-bi-tab-${tab.id}`}
                      aria-controls="focal-bi-desk-panel"
                      onClick={() => setDesk(tab.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all sm:text-base ${
                        selected
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 lg:translate-x-2'
                          : 'text-text/55 hover:bg-text/5 hover:text-text'
                      }`}
                    >
                      <span className={selected ? 'text-white' : 'text-primary'}>
                        <tab.Icon size={18} aria-hidden />
                      </span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              id="focal-bi-desk-panel"
              role="tabpanel"
              aria-labelledby={`focal-bi-tab-${activeDesk.id}`}
              className="min-h-[280px] lg:col-span-8"
            >
              <EmptyMedia
                kind="image"
                file={activeDesk.file}
                alt={activeDesk.alt}
                need={activeDesk.need}
                caption={activeDesk.label}
                pendingBadge={w.pendingBadge}
                kindLabel={w.pendingImage}
              />
              <h3 className="mt-8 text-2xl font-bold tracking-tight md:text-3xl">{activeDesk.title}</h3>
              <p className="mt-4 text-base leading-8 text-text/60">{activeDesk.body}</p>
              <FeatureList items={activeDesk.feats} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071427] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-sky-400 uppercase">{w.deepEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.deepTitle}</h2>
            <p className="mt-5 text-base leading-8 text-white/65">{w.deepBody}</p>
            <FeatureList items={deepFeats} dark />
          </div>
          <div className="grid gap-4">
            <EmptyMedia
              kind="video"
              file="/assets/focal-bi/interactive.mp4"
              alt={w.deepVideoAlt}
              need={w.deepVideoNeed}
              caption={w.deepVideoCaption}
              pendingBadge={w.pendingBadge}
              kindLabel={w.pendingVideo}
              dark
            />
            <EmptyMedia
              kind="video"
              file="/assets/focal-bi/drill.mp4"
              alt={w.drillVideoAlt}
              need={w.drillVideoNeed}
              caption={w.drillVideoCaption}
              pendingBadge={w.pendingBadge}
              kindLabel={w.pendingVideo}
              dark
            />
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

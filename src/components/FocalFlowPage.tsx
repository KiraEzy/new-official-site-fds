import { motion } from 'motion/react';
import {
  ArrowRight,
  Bus,
  Cpu,
  FileKey,
  GitBranch,
  History,
  ImageIcon,
  MonitorPlay,
  QrCode,
  Route,
  ScanLine,
  ShieldCheck,
  TrainFront,
  Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { CONTACT_US_HASH, FOCAL_ROOM_BOOKING_HASH } from '../content/pageHashes';

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
          {caption ?? 'focal-flow'}
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
  dark?: boolean;
}) {
  const Icon = kind === 'video' ? MonitorPlay : ImageIcon;
  return (
    <ChromeFrame caption={caption} className={className}>
      <div
        role="img"
        aria-label={alt}
        className={
          dark
            ? 'flex aspect-video w-full flex-col justify-between bg-[#071427] p-5 text-left sm:p-6'
            : 'flex aspect-video w-full flex-col justify-between bg-[#eef4f8] p-5 text-left sm:p-6'
        }
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

export default function FocalFlowPage() {
  const { ns } = useI18n();
  const w = ns('focalFlow') as Record<string, string>;

  const suite = [
    { id: 'focal-flow-ocr', name: w.suite0Name, blurb: w.suite0Blurb, n: '01' },
    { id: 'focal-flow-transit', name: w.suite1Name, blurb: w.suite1Blurb, n: '02' },
    { id: 'focal-flow-bpmn', name: w.suite2Name, blurb: w.suite2Blurb, n: '03' },
  ];

  const ocrFeats = [
    { title: w.ocrFeat0Title, body: w.ocrFeat0Body, Icon: Cpu },
    { title: w.ocrFeat1Title, body: w.ocrFeat1Body, Icon: ScanLine },
    { title: w.ocrFeat2Title, body: w.ocrFeat2Body, Icon: FileKey },
    { title: w.ocrFeat3Title, body: w.ocrFeat3Body, Icon: QrCode },
  ];

  const transitFeats = [
    { title: w.transitFeat0Title, body: w.transitFeat0Body, Icon: Route },
    { title: w.transitFeat1Title, body: w.transitFeat1Body, Icon: Bus },
  ];

  const bpmnFeats = [
    { title: w.bpmnFeat0Title, body: w.bpmnFeat0Body, Icon: Workflow },
    { title: w.bpmnFeat1Title, body: w.bpmnFeat1Body, Icon: FileKey },
    { title: w.bpmnFeat2Title, body: w.bpmnFeat2Body, Icon: GitBranch },
    { title: w.bpmnFeat3Title, body: w.bpmnFeat3Body, Icon: ShieldCheck },
    { title: w.bpmnFeat4Title, body: w.bpmnFeat4Body, Icon: History },
  ];

  const journey = [w.journey0, w.journey1, w.journey2, w.journey3, w.journey4];

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
                  onClick={() => scrollToId('focal-flow-suite')}
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
              <EmptyMedia
                kind="video"
                file="/assets/focal-flow/hero.mp4"
                alt={w.heroShotAlt}
                need={w.heroShotNeed}
                caption={w.heroShotCaption}
                pendingBadge={w.pendingBadge}
                kindLabel={w.pendingVideo}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-text/5 bg-[#f6fbff] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.proofEyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{w.proofTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text/60">{w.proofBody}</p>
          <ol className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {journey.map((label, idx) => (
              <li key={label} className="flex items-center gap-2">
                <span className="inline-flex h-9 items-center rounded-full border border-primary/20 bg-white px-3.5 text-xs font-bold text-text">
                  <span className="mr-2 font-mono text-[10px] text-primary/70">0{idx + 1}</span>
                  {label}
                </span>
                {idx < journey.length - 1 ? (
                  <ArrowRight size={14} className="hidden text-primary/40 sm:block" aria-hidden />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="focal-flow-suite" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.suiteEyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{w.suiteTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text/60">{w.suiteLead}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
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
        id="focal-flow-ocr"
        className="scroll-mt-28 border-y border-text/5 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/ocr-single.png"
            alt={w.ocrAlt}
            need={w.ocrNeed}
            caption={w.ocrEyebrow}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
          />
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.ocrEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.ocrTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.ocrBody}</p>
            <FeatureGrid items={ocrFeats} />
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-3">
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/ocr-batch.png"
            alt={w.ocrBatchAlt}
            need={w.ocrBatchNeed}
            caption={w.ocrFeat1Title}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
          />
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/ocr-engines.png"
            alt={w.ocrEngineAlt}
            need={w.ocrEngineNeed}
            caption={w.ocrFeat2Title}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
          />
          <EmptyMedia
            kind="video"
            file="/assets/focal-flow/ocr-qr.mp4"
            alt={w.ocrQrAlt}
            need={w.ocrQrNeed}
            caption={w.ocrQrCaption}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingVideo}
          />
        </div>
      </section>

      <section
        id="focal-flow-transit"
        className="scroll-mt-28 bg-[#f6fbff] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2 grid gap-4">
            <EmptyMedia
              kind="image"
              file="/assets/focal-flow/transit-calculator.png"
              alt={w.transitAlt}
              need={w.transitNeed}
              caption={w.transitEyebrow}
              pendingBadge={w.pendingBadge}
              kindLabel={w.pendingImage}
            />
            <EmptyMedia
              kind="image"
              file="/assets/focal-flow/transit-map.png"
              alt={w.transitMapAlt}
              need={w.transitMapNeed}
              caption={w.suite1Name}
              pendingBadge={w.pendingBadge}
              kindLabel={w.pendingImage}
            />
          </div>
          <div className="lg:order-1">
            <p className="text-[10px] font-bold tracking-[0.28em] text-primary uppercase">{w.transitEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.transitTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.transitBody}</p>
            <FeatureGrid items={transitFeats} />
            <div className="mt-6 flex flex-wrap gap-2">
              {['MTR', 'KMB', 'Citybus'].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-text/10 bg-white px-3 py-1.5 text-[11px] font-bold text-text/70"
                >
                  {name === 'MTR' ? <TrainFront size={12} aria-hidden /> : <Bus size={12} aria-hidden />}
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="focal-flow-bpmn"
        className="scroll-mt-28 bg-[#071427] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <EmptyMedia
            kind="video"
            file="/assets/focal-flow/bpmn-editor.mp4"
            alt={w.bpmnAlt}
            need={w.bpmnNeed}
            caption={w.bpmnEyebrow}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingVideo}
            dark
          />
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-sky-400 uppercase">{w.bpmnEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{w.bpmnTitle}</h2>
            <p className="mt-5 text-base leading-8 text-white/65">{w.bpmnBody}</p>
            <FeatureGrid items={bpmnFeats} dark />
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 lg:grid-cols-2">
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/bpmn-xml.png"
            alt={w.bpmnXmlAlt}
            need={w.bpmnXmlNeed}
            caption={w.bpmnFeat1Title}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
            dark
          />
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/bpmn-versions.png"
            alt={w.bpmnVerAlt}
            need={w.bpmnVerNeed}
            caption={w.bpmnFeat2Title}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
            dark
          />
          <EmptyMedia
            kind="image"
            file="/assets/focal-flow/bpmn-rbac.png"
            alt={w.bpmnRbacAlt}
            need={w.bpmnRbacNeed}
            caption={w.bpmnFeat3Title}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingImage}
            dark
          />
          <EmptyMedia
            kind="video"
            file="/assets/focal-flow/bpmn-replay.mp4"
            alt={w.bpmnReplayAlt}
            need={w.bpmnReplayNeed}
            caption={w.bpmnReplayCaption}
            pendingBadge={w.pendingBadge}
            kindLabel={w.pendingVideo}
            dark
          />
        </div>
      </section>

      <section className="border-t border-text/5 bg-[#f6fbff] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{w.roomBookingTitle}</h2>
            <p className="mt-4 text-base leading-7 text-text/60">{w.roomBookingBody}</p>
          </div>
          <a
            href={FOCAL_ROOM_BOOKING_HASH}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20"
          >
            {w.roomBookingCta} <ArrowRight size={18} aria-hidden />
          </a>
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

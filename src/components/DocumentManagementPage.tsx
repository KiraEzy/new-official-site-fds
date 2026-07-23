import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  ClipboardList,
  Cloud,
  Database,
  CheckCircle2,
  FileSearch,
  FolderTree,
  GitBranch,
  LayoutDashboard,
  Lock,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Tags,
  UserCog,
  UsersRound,
  FileText,
  Pin,

} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const CONTACT_HASH = '#contact-us';

/** Icon order aligns with documentManagement locale productFeatures JSON array */
const PRODUCT_FEATURE_ICONS: LucideIcon[] = [
  Cloud,
  Lock,
  FolderTree,
  FileText,
  UserCog,
  UsersRound,
  GitBranch,
  Pin,
  Search,
  FileSearch,
  Tags,
  ClipboardList,
  Share2,
  LayoutDashboard,
  Bell,
  RefreshCw
];

export default function DocumentManagementPage() {
  const { ns } = useI18n();
  const dm = ns('documentManagement') as Record<string, unknown>;

  const officialBenefits = (dm.officialBenefits as { keyword: string; detail: string }[]) ?? [];
  const productFeatures = (dm.productFeatures as { title: string; desc: string }[]) ?? [];
  const specLines = (dm.specLines as string[]) ?? [];
  const intelligenceHighlights = (dm.intelligenceHighlights as string[]) ?? [];

  const s = (key: string) => String(dm[key] ?? '');

  return (
    <main className="bg-background pb-24 mt-25 text-text antialiased">
      <section className="relative overflow-hidden bg-text/[0.02] pt-8 pb-20 lg:pt-10 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_50%,rgba(17,184,245,0.05)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {s('heroBadge')}
              </div>
              <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-text lg:text-7xl">
                {s('heroLine1')} <br />
                <span className="text-primary">{s('heroLine2Accent')}</span>
              </h1>
              <p className="mb-6 max-w-xl text-xl font-medium leading-relaxed text-text/60">{s('heroP1')}</p>
              <p className="mb-12 max-w-xl text-base font-medium leading-relaxed text-text/55">{s('heroP2')}</p>
              <div className="flex gap-4">
                <motion.a
                  href={CONTACT_HASH}
                  whileHover="hover"
                  initial="initial"
                  className="group relative inline-flex h-auto overflow-hidden rounded-full bg-primary px-10 py-5 font-bold text-white shadow-xl shadow-primary/20"
                >
                  <span className="relative z-10">{s('heroCta')}</span>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rotate-2 rounded-[2.5rem] border border-text/5 bg-white p-4 shadow-2xl">
                <div className="flex aspect-video items-center justify-center rounded-[1.5rem] bg-text/[0.03] p-8">
                  <Database size={120} className="text-primary/20" strokeWidth={1.25} aria-hidden />
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-6 -top-6 flex items-center gap-4 rounded-2xl border border-text/5 bg-white p-6 shadow-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text/40">{s('floatingEncryptLabel')}</div>
                  <div className="text-sm font-bold text-text">{s('floatingEncryptValue')}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-text/[0.06] bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-text lg:text-4xl">{s('benefitsSectionTitle')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {officialBenefits.map(({ keyword, detail }, idx) => (
              <motion.div
                key={keyword}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 rounded-2xl border border-text/5 bg-[#f8fdff] p-5 text-left"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                <div className="min-w-0 space-y-1.5">
                  <p className="text-[13px] font-semibold leading-snug tracking-tight text-text sm:text-sm">{keyword}</p>
                  <p className="text-[12px] leading-relaxed text-text/58 sm:text-[13px] sm:leading-relaxed">{detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">{s('platformEyebrow')}</p>
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-text lg:text-4xl">{s('platformTitle')}</h2>
          <p className="text-lg leading-relaxed text-text/60">{s('platformP1')}</p>
          <p className="mt-6 text-lg leading-relaxed text-text/60">{s('platformP2')}</p>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">{s('capabilitiesEyebrow')}</p>
            <h2 className="mb-4 text-3xl font-bold text-text lg:text-5xl">{s('capabilitiesTitle')}</h2>
            <p className="text-lg font-medium text-text/50">{s('capabilitiesLead')}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {productFeatures.map(({ title, desc }, idx) => (
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
                  {(() => {
                    const Icon = PRODUCT_FEATURE_ICONS[idx] ?? Cloud;
                    return <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />;
                  })()}
                </div>
                <div className="relative z-10 pr-14">
                  <h3 className="text-lg font-bold text-text">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text/60">{desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-24 text-text lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="mb-10 text-4xl font-bold leading-tight">
                {s('intelBandLine1')} <br />
                <span className="text-primary">{s('intelBandAccent')}</span>
              </h2>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {intelligenceHighlights.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    viewport={{ once: true }}
                    className="group flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} aria-hidden />
                    <span className="text-sm font-medium leading-snug text-text/70 transition-colors group-hover:text-text">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="rounded-[2.5rem] border border-text/10 bg-white p-10">
              <h3 className="mb-6 text-2xl font-bold text-text">{s('complianceTitle')}</h3>
              <p className="mb-8 text-sm leading-relaxed text-text/55">{s('complianceBody')}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-text/5 bg-gray-100 p-4">
                  <Lock className="text-primary" size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider text-text/90">{s('badgeAes')}</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-text/5 bg-gray-100 p-4">
                  <ClipboardList className="text-primary" size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider text-text/90">{s('badgeAudit')}</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-text/5 bg-gray-100 p-4">
                  <RefreshCw className="text-primary" size={22} />
                  <span className="text-sm font-bold uppercase tracking-wider text-text/90">{s('badgeLifecycle')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-text/[0.02] py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-text/8 bg-white p-10 shadow-[0_20px_60px_rgba(1,20,26,0.06)] lg:p-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-primary">{s('specEyebrow')}</p>
            <h2 className="mb-6 text-2xl font-bold text-text lg:text-3xl">{s('specTitle')}</h2>
            <p className="mb-8 text-sm leading-relaxed text-text/55">{s('specIntro')}</p>
            <ul className="space-y-4">
              {specLines.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed text-text/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[3rem] border border-primary/10 bg-primary/[0.03] p-12 lg:p-20">
            <h2 className="mb-8 text-4xl font-bold tracking-tight text-text lg:text-6xl">{s('ctaTitle')}</h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-text/50">{s('ctaBody')}</p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.a
                href={CONTACT_HASH}
                whileHover="hover"
                initial="initial"
                className="group relative inline-flex h-auto items-center gap-3 overflow-hidden rounded-full bg-primary px-12 py-5 font-bold text-white shadow-xl shadow-primary/20"
              >
                <span className="relative z-10 flex items-center gap-3">{s('ctaButton')}</span>
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
        </div>
      </section>
    </main>
  );
}

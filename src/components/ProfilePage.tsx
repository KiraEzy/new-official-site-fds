import { motion, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { Target, Eye, Rocket, Award, ShieldCheck, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';

const SPOTLIGHT_RADIUS_PX = 118;

/** Matches profile hero chrome (`bg-text/3`): paint over cyan fill inside the spotlight without masking glyphs (avoids WebKit cropping italic tails). */
const HERO_SURFACE_KNOCKOUT =
  'color-mix(in srgb, var(--color-text, #01141a) 4%, var(--color-background, #f9fdff))';

function HeroSimplifyAndExcellenceSpot() {
  const { locale, ns } = useI18n();
  const p = ns('profile');
  const simplifyWord = String(p.simplifySpot);
  const excellenceWord = String(p.excellenceSpot);

  const wrapRef = useRef<HTMLSpanElement>(null);
  const simplifyRootRef = useRef<HTMLSpanElement>(null);
  const excellenceRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const geomRef = useRef({ sx: 0, sy: 0, ex: 0, ey: 0 });

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const [simpStrokeClip, setSimpStrokeClip] = useState('circle(0px at 0px 0px)');
  const [excGoldClip, setExcGoldClip] = useState('circle(0px at 0px 0px)');
  const [knockPos, setKnockPos] = useState({ x: -500, y: -500 });
  const [borderBoxPx, setBorderBoxPx] = useState<number | undefined>(undefined);
  const [inlinePadPx, setInlinePadPx] = useState<number | undefined>(undefined);

  const measureGeom = useCallback(() => {
    const w = wrapRef.current;
    const s = simplifyRootRef.current;
    const e = excellenceRef.current;
    if (!w || !s || !e) return;
    const wr = w.getBoundingClientRect();
    const sr = s.getBoundingClientRect();
    const er = e.getBoundingClientRect();
    geomRef.current = {
      sx: sr.left - wr.left,
      sy: sr.top - wr.top,
      ex: er.left - wr.left,
      ey: er.top - wr.top
    };
  }, []);

  const remeasureSimplifyWidths = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    let w = el.scrollWidth;
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rw = range.getBoundingClientRect().width;
      if (Number.isFinite(rw) && rw > 0) w = Math.max(w, rw);
    } catch {
      /* ignore Range API quirks */
    }
    if (!Number.isFinite(w) || w < 4) return;
    const box = el.getBoundingClientRect();
    const h = box.height || 1;
    const slackTotal = Math.max(56, Math.round(h * 0.36));
    const pad = slackTotal / 2;
    setBorderBoxPx(Math.ceil(w + slackTotal));
    setInlinePadPx(pad);
  }, []);

  const layoutMeasure = useCallback(() => {
    measureGeom();
    remeasureSimplifyWidths();
  }, [measureGeom, remeasureSimplifyWidths]);

  useLayoutEffect(() => {
    void document.fonts.ready.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(layoutMeasure));
    });
  }, [layoutMeasure, locale, simplifyWord, excellenceWord]);

  useEffect(() => {
    window.addEventListener('resize', layoutMeasure);
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', layoutMeasure);
    }
    const ro = new ResizeObserver(() => layoutMeasure());
    ro.observe(wrap);
    return () => {
      window.removeEventListener('resize', layoutMeasure);
      ro.disconnect();
    };
  }, [layoutMeasure]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    const syncSpotlight = () => {
      const g = geomRef.current;
      const x = springX.get();
      const y = springY.get();
      setKnockPos({ x: x - g.sx, y: y - g.sy });
      setSimpStrokeClip(`circle(${SPOTLIGHT_RADIUS_PX}px at ${x - g.sx}px ${y - g.sy}px)`);
      setExcGoldClip(`circle(${SPOTLIGHT_RADIUS_PX}px at ${x - g.ex}px ${y - g.ey}px)`);
    };

    const unsubscribeX = springX.on('change', syncSpotlight);
    const unsubscribeY = springY.on('change', syncSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      unsubscribeX();
      unsubscribeY();
    };
  }, [springX, springY]);

  return (
    <span ref={wrapRef} className="relative flex cursor-default flex-col items-center">
      <span
        ref={simplifyRootRef}
        className="group/simplify relative isolate box-border inline-grid w-max max-w-none shrink-0 justify-items-center justify-self-center overflow-visible [grid-template-columns:auto] [grid-template-rows:auto]"
        style={
          borderBoxPx != null && inlinePadPx != null
            ? {
                boxSizing: 'border-box',
                minWidth: borderBoxPx,
                paddingLeft: inlinePadPx,
                paddingRight: inlinePadPx
              }
            : undefined
        }
      >
        <span
          ref={measureRef}
          className="invisible col-start-1 row-start-1 box-content mx-auto inline-block max-w-none select-none whitespace-nowrap font-bold italic tracking-tight"
          aria-hidden
        >
          {simplifyWord}
        </span>

        <span className="relative z-0 col-start-1 row-start-1 box-content mx-auto inline-block max-w-none overflow-visible text-center text-primary italic font-bold tracking-tight">
          {simplifyWord}
        </span>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-[1] rounded-full"
          style={{
            width: SPOTLIGHT_RADIUS_PX * 2,
            height: SPOTLIGHT_RADIUS_PX * 2,
            left: knockPos.x,
            top: knockPos.y,
            translateX: '-50%',
            translateY: '-50%',
            background: HERO_SURFACE_KNOCKOUT
          }}
        />

        <motion.span
          className="pointer-events-none col-start-1 row-start-1 z-[2] mx-auto box-content inline-block max-w-none overflow-visible text-center italic font-bold tracking-tight text-transparent"
          style={{
            clipPath: simpStrokeClip,
            WebkitClipPath: simpStrokeClip,
            WebkitTextStroke: '1.5px #BEE3F8',
            pointerEvents: 'none'
          }}
          aria-hidden
        >
          {simplifyWord}
        </motion.span>

        <motion.div
          className="pointer-events-none absolute -z-10 rounded-full bg-primary/10 blur-[100px]"
          style={{
            width: 240,
            height: 240,
            left: knockPos.x,
            top: knockPos.y,
            translateX: '-50%',
            translateY: '-50%'
          }}
        />
      </span>

      <span ref={excellenceRef} className="relative z-20 isolate block w-full text-center not-italic">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 block w-full text-center font-bold text-transparent"
          style={{
            clipPath: excGoldClip,
            WebkitClipPath: excGoldClip,
            WebkitTextFillColor: 'transparent',
            textShadow:
              '0 0 1px rgba(255,240,200,0.95), 0 0 12px rgba(255,215,80,0.95), 0 0 28px rgba(255,190,50,0.85), 0 0 48px rgba(220,150,30,0.45)'
          }}
        >
          {excellenceWord}
        </span>
        <span className="relative z-10 font-bold text-primary">{excellenceWord}</span>
      </span>
    </span>
  );
}

type TabId = 'profile' | 'focal' | 'mission';

export default function ProfilePage() {
  const { ns } = useI18n();
  const p = ns('profile');
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: 'profile', label: p.tabCompanyProfile as string, icon: <Users size={18} aria-hidden /> },
    { id: 'focal', label: p.tabFocalWay as string, icon: <Rocket size={18} aria-hidden /> },
    { id: 'mission', label: p.tabMissionVision as string, icon: <Target size={18} aria-hidden /> }
  ];

  const partners = [
    { name: 'IBM', country: 'USA' },
    { name: 'Qmatics', country: 'Sweden' },
    { name: 'Bricsys', country: 'Belgium' },
    { name: 'Chapoo', country: 'Belgium' }
  ];

  const certifiedBullets = [
    p.certifiedBullet0 as string,
    p.certifiedBullet1 as string,
    p.certifiedBullet2 as string,
    p.certifiedBullet3 as string
  ];

  const stats = [
    { label: p.statHongKongHeritageLabel as string, value: p.statYearsValue as string },
    { label: p.statSOAPartnerLabel as string, value: p.statYearsNum as string },
    { label: p.statProjectsLabel as string, value: p.statBodiesValue as string },
    { label: p.statQPS5Label as string, value: p.statAwardValue as string }
  ];

  const tabContent: Record<TabId, ReactNode> = useMemo(
    () => ({
      profile: (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-text">{p.profileTitle as string}</h3>
          <p className="text-lg leading-relaxed text-text/60">
            {p.profileLeadPrefix as string} <span className="font-bold text-primary">{p.profileLeadCompany as string}</span> {p.profileLead as string}
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-text/5 bg-white p-6 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-text">
                <Award className="text-primary" size={20} aria-hidden />
                {p.qps5Title as string}
              </h4>
              <p className="text-sm leading-relaxed text-text/50">{p.qps5Body as string}</p>
            </div>
            <div className="space-y-4 rounded-2xl border border-text/5 bg-white p-6 shadow-sm">
              <h4 className="flex items-center gap-2 font-bold text-text">
                <ShieldCheck className="text-primary" size={20} aria-hidden />
                {p.qualityTitle as string}
              </h4>
              <p className="text-sm leading-relaxed text-text/50">{p.qualityBody as string}</p>
            </div>
          </div>
        </div>
      ),
      focal: (
        <div className="space-y-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-full bg-primary px-4 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
              {p.focalBrandBadge as string}
            </div>
          </div>
          <h3 className="text-3xl font-bold text-text">{p.focalBrandTitle as string}</h3>
          <p className="leading-relaxed text-text/60">
            {p.focalLeadPrefix as string}
            <span className="font-bold text-primary">{p.focalBrandLeadBold as string}</span>
            {p.focalBrandLead as string}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[p.focalProduct0, p.focalProduct1, p.focalProduct2, p.focalProduct3, p.focalProduct4].map((item) => (
              <div key={String(item)} className="flex items-center gap-3 rounded-xl border border-text/5 bg-text/3 p-4">
                <CheckCircle2 size={16} className="text-primary" aria-hidden />
                <span className="text-sm font-bold text-text/70">{String(item)}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-sm italic text-text/60">{p.focalQuote as string}</div>
        </div>
      ),
      mission: (
        <div className="grid gap-12 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-2xl shadow-primary/20">
            <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <Target size={120} aria-hidden />
            </div>
            <h4 className="relative z-10 mb-4 font-mono text-xl font-bold tracking-tighter">{p.missionHeading as string}</h4>
            <p className="relative z-10 text-sm leading-relaxed text-white/80">{p.missionBody as string}</p>
          </div>
          <div className="group relative overflow-hidden rounded-3xl bg-text p-8 text-white">
            <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
              <Eye size={120} aria-hidden />
            </div>
            <h4 className="relative z-10 mb-4 font-mono text-xl font-bold tracking-tighter">{p.visionHeading as string}</h4>
            <p className="relative z-10 text-sm leading-relaxed text-white/80 italic">{p.visionBody as string}</p>
          </div>
        </div>
      )
    }),
    [p]
  );

  return (
    <main className="bg-background pb-24 mt-25 text-text antialiased">
      <section className="relative overflow-hidden border-b border-text/5 bg-text/3 py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_40%,rgba(17,184,245,0.03)_0%,rgba(255,255,255,0)_100%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-5xl overflow-visible px-1 sm:px-2"
          >
            <div className="relative z-40 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
              {p.heroBadge as string}
            </div>
            <h1 className="relative mx-auto mb-8 max-w-4xl overflow-visible text-center text-5xl font-bold leading-[1.18] tracking-tight text-text sm:leading-[1.15] lg:max-w-5xl lg:text-8xl lg:leading-[1.14]">
              <span className="relative z-30 inline-block w-full">Design to</span>
              <br />
              <span className="relative z-[1] flex flex-col items-center">
                <HeroSimplifyAndExcellenceSpot />
              </span>
            </h1>
            <p className="relative z-[25] mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-text/60">
              {p.heroSubtitle as string}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-[2rem] border border-text/5 bg-text/3 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-left font-bold transition-all ${
                      activeTab === tab.id
                        ? 'translate-x-2 bg-primary text-white shadow-xl shadow-primary/20'
                        : 'text-text/40 hover:bg-text/5 hover:text-text'
                    }`}
                  >
                    <span
                      className={
                        activeTab === tab.id
                          ? 'text-white'
                          : 'text-primary transition-transform animate-pulse group-hover:scale-110'
                      }
                    >
                      {tab.icon}
                    </span>
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" aria-hidden />}
                  </button>
                ))}
              </div>

              <div className="rounded-[2rem] bg-text p-8 text-white">
                <h4 className="mb-4 flex items-center gap-2 font-bold italic">
                  <span className="block h-2 w-2 rounded-full bg-primary" aria-hidden /> {p.rdHeading as string}
                </h4>
                <p className="text-xs leading-relaxed text-white/50 italic">{p.rdQuote as string}</p>
              </div>
            </div>

            <div className="lg:col-span-8">
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

      <section className="relative overflow-hidden bg-text py-24 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="space-y-2 border-l-2 border-primary/20 pl-6 text-center lg:text-left"
              >
                <div className="text-4xl font-bold tracking-tighter text-primary lg:text-6xl">{stat.value}</div>
                <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tighter text-text">{p.partnershipsTitle as string}</h2>
            <p className="text-sm font-medium text-text/40 italic">{p.partnershipsSubtitle as string}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {partners.map((p) => (
              <div key={`${p.name}-${p.country}`} className="group flex flex-col items-center">
                <div className="text-3xl font-black text-text/10 transition-colors duration-500 group-hover:text-primary">{p.name}</div>
                <div className="text-[10px] font-bold tracking-widest text-text/20 uppercase">{p.country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-text/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] bg-primary/5 p-12 lg:p-20">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <h2 className="text-4xl leading-none font-bold tracking-tight text-text uppercase lg:text-6xl">
                  {p.certifiedEyebrow} <br />
                  <span className="italic text-primary">{p.certifiedTitleAccent as string}</span>
                </h2>
                <p className="text-lg font-medium leading-relaxed text-text/60">{p.certifiedLead as string}</p>
                <ul className="space-y-4">
                  {certifiedBullets.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-bold text-text/70">
                      <CheckCircle2 size={18} className="text-primary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="group relative">
                <div className="absolute inset-0 bg-primary/20 opacity-20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                <div className="relative flex -rotate-3 items-center justify-center rounded-[2rem] border border-text/5 bg-white p-12 shadow-2xl transition-transform duration-500 hover:rotate-0">
                  <Award size={160} className="text-primary" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

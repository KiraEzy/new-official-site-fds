import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Copy,
  GanttChart,
  MapPin,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { CONTACT_US_HASH } from '../content/pageHashes';

const SHOT = '/assets/focal-flow/screenshots/room-booking';

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
          {caption ?? 'room-booking'}
        </span>
      </div>
      {children}
    </figure>
  );
}

function ProductShot({
  src,
  alt,
  caption,
  className = '',
  frameClassName = '',
  imgClassName = 'aspect-video w-full object-cover object-top',
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  frameClassName?: string;
  imgClassName?: string;
}) {
  return (
    <ChromeFrame caption={caption} className={className}>
      <div className={`overflow-hidden bg-[#eef4f8] ${frameClassName}`}>
        <img src={src} alt={alt} className={`block ${imgClassName}`} />
      </div>
    </ChromeFrame>
  );
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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function FlowArrow() {
  return <ArrowRight size={12} className="shrink-0 text-primary/40" aria-hidden />;
}

export default function FocalRoomBookingPage() {
  const { ns } = useI18n();
  const w = ns('focalRoomBooking') as Record<string, string>;
  const reduceMotion = useReducedMotion();
  const [scrub, setScrub] = useState(1);

  const bullets = [w.bullet0, w.bullet1, w.bullet2];
  const pins = [
    { color: '#22c55e', label: w.pinAvailable },
    { color: '#f59e0b', label: w.pinBooked },
    { color: '#ef4444', label: w.pinMeeting },
    { color: '#94a3b8', label: w.pinEnded },
  ];
  const scrubShots = [
    { src: `${SHOT}/06-floor-plan-morning.png`, label: w.scrubMorning },
    { src: `${SHOT}/07-floor-plan-afternoon.png`, label: w.scrubAfternoon },
    { src: `${SHOT}/08-floor-plan-evening.png`, label: w.scrubEvening },
  ];
  const flowBeats = [
    { id: 'see', label: w.beatSee, href: 'room-booking-see', steps: [w.flow0, w.flow1] },
    { id: 'book', label: w.beatBook, href: 'room-booking-book', steps: [w.flow2, w.flow3, w.flow4, w.flow5] },
    { id: 'scan', label: w.beatScan, href: 'room-booking-scan', steps: [w.flow6, w.flow7] },
    { id: 'enter', label: w.beatEnter, href: 'room-booking-enter', steps: [w.flow8, w.flow9, w.flow10, w.flow11] },
  ];

  return (
    <main className="bg-background pb-16 pt-24 text-text antialiased selection:bg-primary/25 selection:text-text sm:pt-28 lg:pb-20 lg:pt-40">
      <section className="relative overflow-hidden border-b border-text/5 pb-8 pt-4 sm:pb-10 sm:pt-6 lg:pb-10 lg:pt-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_80%_10%,rgba(17,184,245,0.08)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px] opacity-50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
                {w.pill}
              </div>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                {w.heroLine1} <span className="text-primary">{w.heroLine2Accent}</span>
              </h1>
              <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-text/60">{w.heroLead}</p>
              <ul className="mt-4 flex max-w-3xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {bullets.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm font-medium leading-snug text-text/70">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 lg:pb-1">
              <motion.a
                href={CONTACT_US_HASH}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
              >
                {w.heroCtaEnquire} <ArrowRight size={18} aria-hidden />
              </motion.a>
              <button
                type="button"
                onClick={() => scrollToId('room-booking-flow')}
                className="inline-flex items-center gap-2 rounded-full border border-text/12 bg-white px-8 py-4 text-sm font-bold text-text/80 transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
              >
                {w.heroCta}
              </button>
            </div>
          </div>

          <div className="mt-6 lg:mt-7">
            <ChromeFrame caption={w.scrubCaption}>
              <div className="relative h-[min(40vh,21rem)] overflow-hidden bg-[#0b1220] sm:h-[min(44vh,24rem)] lg:h-[min(46vh,26rem)]">
                {scrubShots.map((shot, idx) => (
                  <img
                    key={shot.src}
                    src={shot.src}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-[center_38%]"
                    style={{
                      opacity: scrub === idx ? 1 : 0,
                      transition: reduceMotion ? 'none' : 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                ))}
                <img src={scrubShots[scrub].src} alt={w.heroShotAlt} className="sr-only" />
                <div className="absolute inset-x-0 bottom-0 border-t border-text/6 bg-white px-4 py-3 sm:px-5">
                  <div className="mb-2.5 flex flex-wrap gap-2">
                    {pins.map((pin) => (
                      <span
                        key={pin.label}
                        className="inline-flex items-center gap-2 rounded-full border border-text/8 bg-[#f6fbff] px-2.5 py-1 text-[11px] font-bold text-text/70"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pin.color }} />
                        {pin.label}
                      </span>
                    ))}
                  </div>
                  <label htmlFor="room-booking-scrub" className="flex items-center justify-between gap-4 text-xs font-bold text-text/55">
                    <span>{w.scrubLabel}</span>
                    <span className="tabular-nums text-text">{scrubShots[scrub].label}</span>
                  </label>
                  <input
                    id="room-booking-scrub"
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={scrub}
                    aria-valuetext={scrubShots[scrub].label}
                    onChange={(event) => setScrub(Number(event.target.value))}
                    className="room-booking-scrub mt-2 w-full"
                  />
                </div>
              </div>
            </ChromeFrame>
          </div>
        </div>
      </section>

      <section
        id="room-booking-flow"
        className="scroll-mt-28 border-b border-text/5 bg-[#f6fbff] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight md:text-3xl">{w.flowTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text/60">{w.flowLead}</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flowBeats.map((beat) => (
              <li key={beat.id}>
                <button
                  type="button"
                  onClick={() => scrollToId(beat.href)}
                  className="flex h-full w-full flex-col rounded-[1.5rem] border border-text/8 bg-white p-5 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">{beat.label}</span>
                  <span className="mt-4 flex flex-wrap items-center gap-1.5">
                    {beat.steps.map((step, idx) => (
                      <span key={step} className="inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center rounded-full border border-text/10 bg-[#f6fbff] px-2.5 py-1 text-[11px] font-bold text-text">
                          {step}
                        </span>
                        {idx < beat.steps.length - 1 ? <FlowArrow /> : null}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="room-booking-see" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">{w.seeTitle}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-text/60">{w.seeLead}</p>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ProductShot
                src={`${SHOT}/11-floor-plan-pin-calendar.png`}
                alt={w.pinAlt}
                caption={w.pinCaption}
                imgClassName="aspect-video w-full object-contain bg-white"
              />
            </div>
            <div className="lg:col-span-5">
              <FeatureList
                items={[
                  { title: w.seeFeat0Title, body: w.seeFeat0Body, Icon: MapPin },
                  { title: w.seeFeat2Title, body: w.seeFeat2Body, Icon: GanttChart },
                  { title: w.seeFeat3Title, body: w.seeFeat3Body, Icon: ArrowRight },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="room-booking-book"
        className="scroll-mt-28 border-y border-text/5 bg-[#f6fbff] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">{w.bookTitle}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-text/60">{w.bookLead}</p>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
            <ProductShot
              src={`${SHOT}/15-booking-form-filled.png`}
              alt={w.formAlt}
              caption={w.formCaption}
              imgClassName="aspect-video w-full object-contain bg-white"
            />
            <ProductShot
              src={`${SHOT}/17-booking-overlap-error.png`}
              alt={w.overlapAlt}
              caption={w.overlapCaption}
              imgClassName="aspect-video w-full object-contain bg-white"
            />
          </div>
          <div className="mt-6">
            <ProductShot
              src={`${SHOT}/18-booking-confirmed-code.png`}
              alt={w.codeAlt}
              caption={w.codeCaption}
              imgClassName="aspect-video w-full object-contain bg-white"
            />
          </div>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ProductShot
                src={`${SHOT}/21-my-bookings.png`}
                alt={w.weekAlt}
                caption={w.weekCaption}
                imgClassName="aspect-video w-full object-contain bg-white"
              />
            </div>
            <div className="lg:col-span-5">
              <FeatureList
                items={[
                  { title: w.bookFeat0Title, body: w.bookFeat0Body, Icon: ShieldCheck },
                  { title: w.bookFeat1Title, body: w.bookFeat1Body, Icon: CalendarDays },
                  { title: w.bookFeat2Title, body: w.bookFeat2Body, Icon: Copy },
                  { title: w.bookFeat3Title, body: w.bookFeat3Body, Icon: GanttChart },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="room-booking-scan" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{w.scanTitle}</h2>
            <p className="mt-5 text-base leading-8 text-text/60">{w.scanLead}</p>
            <FeatureList
              items={[
                { title: w.scanFeat0Title, body: w.scanFeat0Body, Icon: QrCode },
                { title: w.scanFeat1Title, body: w.scanFeat1Body, Icon: Smartphone },
              ]}
            />
          </div>
          <div className="mx-auto w-full max-w-md lg:col-span-6">
            <ProductShot
              src={`${SHOT}/26-qr-card-1001.png`}
              alt={w.qrAlt}
              caption={w.qrCaption}
              imgClassName="w-full object-contain bg-white"
            />
          </div>
        </div>
      </section>

      <section
        id="room-booking-enter"
        className="scroll-mt-28 bg-[#071427] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">{w.enterTitle}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{w.enterLead}</p>
          <FeatureList
            items={[
              { title: w.enterFeat0Title, body: w.enterFeat0Body, Icon: Smartphone },
              { title: w.enterFeat1Title, body: w.enterFeat1Body, Icon: RotateCcw },
              { title: w.enterFeat2Title, body: w.enterFeat2Body, Icon: ArrowRight },
            ]}
            dark
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <ProductShot
              src={`${SHOT}/m07-roomcode-keypad.png`}
              alt={w.keypadAlt}
              caption={w.keypadCaption}
              className="shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
              imgClassName="aspect-[390/844] w-full object-cover object-top"
            />
            <ProductShot
              src={`${SHOT}/m08-roomcode-wrong.png`}
              alt={w.wrongAlt}
              caption={w.wrongCaption}
              className="shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
              imgClassName="aspect-[390/844] w-full object-cover object-top"
            />
            <ProductShot
              src={`${SHOT}/m11-roomcode-checkin.png`}
              alt={w.checkinAlt}
              caption={w.checkinCaption}
              className="shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
              imgClassName="aspect-[390/844] w-full object-cover object-top"
            />
          </div>
          <div className="mt-6">
            <ProductShot
              src={`${SHOT}/38-roomcode-checkout-overlay.png`}
              alt={w.checkoutAlt}
              caption={w.checkoutCaption}
              className="shadow-[0_28px_80px_rgba(0,0,0,0.35)]"
              imgClassName="aspect-video w-full object-contain bg-[#071427]"
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
            className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold tracking-widest text-primary uppercase shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-sm"
          >
            {w.ctaButton} <ArrowRight size={18} aria-hidden />
          </motion.a>
        </div>
      </section>
    </main>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useI18n } from './i18n/I18nContext';
import fdsLogoUrl from './assets/fds-logo.png';
import Navbar, { type NavbarLayoutMode } from './components/Navbar';
import CapturePage from './components/CapturePage';
import ProfilePage from './components/ProfilePage';
import CareerPage from './components/CareerPage';
import ServicesPage from './components/ServicesPage';
import DocumentManagementPage from './components/DocumentManagementPage';
import WebContentManagementPage from './components/WebContentManagementPage';
import GetInTouchSection from './components/GetInTouchSection';
import MiniCaseFlow from './components/MiniCaseFlow';
import ContactUsPage from './pages/ContactUsPage';
import NewsArticlePage from './pages/NewsArticlePage';
import UnknownHashPage from './pages/UnknownHashPage';
import {
  CAPTURE_HASH,
  CAREER_HASH,
  CONTACT_US_HASH,
  DOCUMENT_MANAGEMENT_HASH,
  FOCAL_AI_PAGE_HASH,
  LATEST_NEWS_HASH,
  PROFILE_HASH,
  SERVICES_HASH,
  WEB_CONTENT_MANAGEMENT_HASH,
  WHAT_WE_BUILD_HASH,
  WORKFLOW_MANAGEMENT_HASH,
  newsArticleHash
} from './content/pageHashes';
import { type ActivePage, newsSlugFromHash, pageFromHash } from './routing/activePage';
import { motion, AnimatePresence } from 'motion/react';
// Government / organizational logos require consent before use — marquee disabled.
// import Marquee from 'react-fast-marquee';
import { ArrowRight, ArrowUp, X, Globe, Users, CheckCircle2, Database, Cpu, Phone, Mail, MapPin, Clock3, Send, SlidersHorizontal, Cloud, PencilRuler, ShieldCheck, Route, RefreshCw, ListChecks, Search, BarChart3, PlugZap, BadgeCheck, Printer, Sparkles, Zap, Rocket, GitBranch, LayoutDashboard, Smartphone, Puzzle, Building2, ClipboardList, Bell, AlarmClock, AlertCircle, UsersRound, Share2, Ship, type LucideIcon } from 'lucide-react';
import { HomeHero } from './components/HomeHero';
import '@xyflow/react/dist/style.css';

const FESTIVAL_BAR_HEIGHT = 56;

/*
const clientLogos = [
  {
    name: 'Auxiliary Medical Service',
    src: '/assets/Auxiliary_Medical_Service.svg'
  },
  {
    name: 'Education Bureau',
    src: '/assets/Education-Bureau-tc.png'
  },
  {
    name: 'Department of Health',
    src: '/assets/health_logo_tc.png'
  },
  {
    name: 'Innovation and Technology Commission',
    src: '/assets/logo_ITA_tc.png'
  },
  {
    name: 'Marine Department',
    src: '/assets/logo_marine.png'
  },
  {
    name: 'Census and Statistics Department',
    src: '/assets/logo_consensus_tc.png'
  },
  {
    name: 'Civil Service Bureau',
    src: '/assets/logo_csb_tc.svg'
  },
  {
    name: 'Home Affairs Department',
    src: '/assets/logo_HAD_tc.png'
  },
  {
    name: 'Highways Department',
    src: '/assets/highway_dept_logo.png'
  },
  {
    name: 'Information Services Department',
    src: '/assets/logo_Information_Services_Department_tc.png'
  },
  {
    name: 'Labour and Welfare Bureau',
    src: '/assets/logo-labour-tc.png'
  },
  {
    name: 'Radio Television Hong Kong',
    src: '/assets/RTHK-logo.png'
  },
  {
    name: 'Transport Department',
    src: '/assets/transportation_department_logo_tc.png'
  },
  {
    name: 'CreateHK',
    src: '/assets/createhk_logo_tc.jpg'
  }
];

const clientLogoRows = [
  clientLogos.slice(0, 5),
  clientLogos.slice(5, 9),
  clientLogos.slice(9, 14)
];
*/

const caseBenefitIcons: LucideIcon[] = [Rocket, GitBranch, LayoutDashboard, Cloud, Smartphone, Puzzle, Building2];

const caseFeatureIcons: LucideIcon[] = [
  Cloud,
  PencilRuler,
  Route,
  RefreshCw,
  ListChecks,
  Search,
  BarChart3,
  ClipboardList,
  AlarmClock,
  AlertCircle,
  UsersRound,
  ShieldCheck,
  Bell,
  LayoutDashboard,
  Share2,
  Mail,
  Smartphone
];

function CaseFeatureGraphic({ Icon, variant }: { Icon: LucideIcon; variant: number }) {
  const iconClass = 'h-6 w-6';

  if (variant === 0) {
    return (
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className={iconClass} />
      </div>
    );
  }

  if (variant === 1) {
    return (
      <div className="absolute right-5 top-5 flex h-13 w-13 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon className={iconClass} />
      </div>
    );
  }

  if (variant === 2) {
    return <Icon className="absolute -right-5 -top-5 h-28 w-28 text-primary/8" strokeWidth={1.35} />;
  }

  if (variant === 3) {
    return (
      <div className="absolute left-0 top-0 flex h-full w-2 items-center justify-center bg-linear-to-b from-primary to-accent">
        <Icon className="absolute left-4 top-6 h-7 w-7 rounded-xl bg-white p-1.5 text-primary shadow-[0_12px_30px_rgba(17,184,245,0.18)]" />
      </div>
    );
  }

  if (variant === 4) {
    return (
      <div className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f1f8ff] text-primary shadow-inner">
        <Icon className="h-7 w-7" />
      </div>
    );
  }

  if (variant === 5) {
    return (
      <div className="mb-5 flex items-center gap-2">
        <span className="h-px flex-1 bg-linear-to-r from-primary/50 to-transparent" />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-text text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    );
  }

  if (variant === 6) {
    return (
      <div className="absolute left-1/2 top-5 flex h-12 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-primary/8 text-primary">
        <Icon className="h-5 w-5" />
      </div>
    );
  }

  if (variant === 7) {
    return (
      <div className="absolute -left-8 bottom-4 flex h-24 w-24 items-center justify-center rounded-full border border-primary/15 text-primary/45">
        <Icon className="h-9 w-9" />
      </div>
    );
  }

  if (variant === 8) {
    return (
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-4xl bg-primary/10 text-primary">
        <Icon className="absolute right-5 top-5 h-7 w-7" />
      </div>
    );
  }

  if (variant === 9) {
    return (
      <div className="mb-6 grid h-15 w-15 place-items-center rounded-[1.4rem] border border-primary/15 bg-white text-accent shadow-[0_14px_34px_rgba(1,20,26,0.07)]">
        <Icon className="h-7 w-7" />
      </div>
    );
  }

  if (variant === 10) {
    return (
      <div className="absolute bottom-0 right-0 flex h-28 w-28 translate-x-6 translate-y-6 items-start justify-start rounded-tl-[2.5rem] bg-linear-to-br from-primary to-accent p-6 text-white shadow-[0_16px_36px_rgba(17,184,245,0.22)]">
        <Icon className="h-9 w-9" />
      </div>
    );
  }

  return (
    <div className="absolute left-5 top-5 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-white shadow-[0_16px_36px_rgba(17,184,245,0.22)]">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function FocalAiHeroGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Integration mesh — arcs + nodes (distinct from prior wedge motif) */}
      <svg
        className="absolute right-[-10%] top-[6%] h-[min(520px,54vw)] w-[min(520px,54vw)] opacity-[0.48] lg:right-[-6%] lg:top-[10%]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <defs>
          <linearGradient id="focalArcStroke" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="rgb(17 184 245)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="focalArcGlow" cx="72%" cy="38%" r="52%">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.26" />
            <stop offset="55%" stopColor="rgb(17 184 245)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0" />
          </radialGradient>
          <filter id="focalArcBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <circle cx="248" cy="152" r="168" fill="url(#focalArcGlow)" filter="url(#focalArcBlur)" opacity="0.85" />
        {[118, 158, 198, 238].map((r, i) => (
          <ellipse
            key={r}
            cx="210"
            cy="200"
            rx={r}
            ry={r * 0.92}
            stroke="url(#focalArcStroke)"
            strokeWidth={i === 0 ? 0.9 : 1.05}
            strokeDasharray={i % 2 === 0 ? '6 14' : '10 18'}
            transform={`rotate(${-18 + i * 4} 210 200)`}
            opacity={0.35 + i * 0.12}
          />
        ))}
        <path
          d="M72 248 Q168 108 288 168 T344 302"
          stroke="rgb(17 184 245)"
          strokeOpacity="0.35"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
        <path
          d="M108 312 Q220 192 332 228"
          stroke="rgb(56 189 248)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 10"
        />
        {[
          [286, 118],
          [332, 214],
          [268, 286],
          [178, 312],
          [118, 232],
          [198, 168]
        ].map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r={i % 3 === 0 ? 9 : 6} fill="rgb(17 184 245)" fillOpacity={i % 3 === 0 ? 0.42 : 0.28} />
            <circle cx={x} cy={y} r={i % 3 === 0 ? 14 : 11} stroke="rgb(56 189 248)" strokeOpacity="0.22" strokeWidth="1" />
          </g>
        ))}
      </svg>
      <PlugZap
        className="absolute right-[min(12%,92px)] top-[40%] h-14 w-14 text-primary/14 lg:right-[16%] lg:top-[38%] lg:h-15 lg:w-15"
        strokeWidth={1}
      />
    </div>
  );
}

function FocalAiPage() {
  const { ns } = useI18n();
  const fa = ns('focalAi') as Record<string, string>;

  const focalHeroImage =
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600';

  const focalAiCapabilityBand = [
    { headline: fa.cap0Headline, caption: fa.cap0Caption },
    { headline: fa.cap1Headline, caption: fa.cap1Caption },
    { headline: fa.cap2Headline, caption: fa.cap2Caption }
  ];

  const focalAiOutcomes = [fa.outcome0, fa.outcome1, fa.outcome2];

  const focalAiStoryBeats = [
    { title: fa.story0Title, body: fa.story0Body },
    { title: fa.story1Title, body: fa.story1Body },
    { title: fa.story2Title, body: fa.story2Body }
  ];

  const focalAiAudiences = [
    { title: fa.audience0Title, body: fa.audience0Body, Icon: Users },
    { title: fa.audience1Title, body: fa.audience1Body, Icon: Cpu },
    { title: fa.audience2Title, body: fa.audience2Body, Icon: ShieldCheck }
  ];

  const focalAiDifferentiators = [
    { title: fa.diff0Title, body: fa.diff0Body },
    { title: fa.diff1Title, body: fa.diff1Body },
    { title: fa.diff2Title, body: fa.diff2Body }
  ];

  const focalAiPillars = [
    { title: fa.pillar0Title, body: fa.pillar0Body, Icon: ShieldCheck },
    { title: fa.pillar1Title, body: fa.pillar1Body, Icon: Zap },
    { title: fa.pillar2Title, body: fa.pillar2Body, Icon: BadgeCheck },
    { title: fa.pillar3Title, body: fa.pillar3Body, Icon: Sparkles }
  ];

  return (
    <main className="bg-[#f6fbff] pt-25 text-text antialiased">
      {/* Manifesto hero — centered headline rhythm inspired by Workleap about */}
      <section className="relative overflow-hidden pb-14 pt-20 lg:pb-20 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,184,245,0.12),transparent_42%),radial-gradient(circle_at_88%_36%,rgba(56,189,248,0.1),transparent_38%)]" />
        <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />
        <FocalAiHeroGraphic />

        <div className="relative z-10 mx-auto max-w-[880px] px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-primary">{fa.pillEyebrow}</p>
            <div className="flex items-center gap-2.5 rounded-full border border-primary/15 bg-white/75 px-3.5 py-2 shadow-[0_10px_28px_rgba(17,184,245,0.1)] backdrop-blur-sm">
              <Sparkles className="h-5 w-5 shrink-0 text-sky-500" strokeWidth={1.35} aria-hidden />
              <span className="text-xs font-semibold text-text/80">{fa.pillBadge}</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-[clamp(2.35rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-text"
          >
            {fa.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.1 }}
            className="mx-auto mt-8 max-w-2xl text-xl font-medium leading-snug text-text/72 md:text-2xl md:leading-snug"
          >
            {fa.heroLead}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-text/55 md:text-lg md:leading-8"
          >
            {fa.heroSub}
          </motion.p>
        </div>
      </section>

      {/* Wide visual band */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-4xl border border-white/70 shadow-[0_32px_80px_rgba(1,20,26,0.12)] ring-1 ring-primary/10"
        >
          <img
            src={focalHeroImage}
            alt={fa.bandImageAlt}
            className="aspect-video w-full object-cover md:aspect-[21/9]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#01141a]/65 via-[#01141a]/10 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 max-w-xl text-sm font-medium leading-relaxed text-white/95 md:text-base">
            {fa.bandCaption}
          </p>
        </motion.div>
      </section>

      {/* What we do — split headline + body (Workleap “what we do” block) */}
      <section className="border-y border-text/[0.06] bg-white px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.32em] text-primary">{fa.whatWeDoEyebrow}</p>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:items-start">
            <h2 className="text-4xl font-bold tracking-tight text-text md:text-5xl lg:max-w-[20ch] lg:leading-[1.12]">
              {fa.whatWeDoTitle}
            </h2>
            <div className="space-y-6 text-lg leading-8 text-text/65">
              <p>{fa.whatWeDoP1}</p>
              <p className="text-base leading-7 text-text/55">{fa.whatWeDoP2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capability band — bold headline columns like Workleap stats strip */}
      <section className="bg-[#071427] px-4 py-16 text-white sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
          {focalAiCapabilityBand.map(({ headline, caption }, idx) => (
            <motion.div
              key={headline}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className={`relative ${idx > 0 ? 'border-t border-white/10 pt-10 md:border-l md:border-t-0 md:pt-0 md:pl-10 lg:pl-14' : ''}`}
            >
              <p className="text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none tracking-tight text-white">{headline}</p>
              <p className="mt-4 text-sm leading-7 text-white/65 md:text-[0.9375rem]">{caption}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section id="focal-mission" className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-primary">{fa.missionEyebrow}</p>
          <h2 className="text-4xl font-bold tracking-tight md:text-[2.75rem] md:leading-[1.15]">
            {fa.missionTitle}
          </h2>
          <ul className="mx-auto mt-12 max-w-lg space-y-4 text-left">
            {focalAiOutcomes.map((line) => (
              <li key={line} className="flex gap-3 text-base leading-7 text-text/65">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Story beats */}
      <section id="focal-story" className="border-t border-text/[0.06] bg-white px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.32em] text-primary lg:text-left">{fa.storyEyebrow}</p>
          <div className="grid gap-14 lg:grid-cols-3 lg:gap-12">
            {focalAiStoryBeats.map(({ title, body }, idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-primary/80">
                  {String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-text">{title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-7 text-text/60">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section id="focal-audiences" className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-primary">{fa.audiencesEyebrow}</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{fa.audiencesTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {focalAiAudiences.map(({ title, body, Icon }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl border border-text/[0.06] bg-white p-8 shadow-[0_18px_50px_rgba(1,20,26,0.05)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text/60">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing emphasis strip */}
      <section className="bg-[#071427] px-4 py-14 text-center text-white sm:px-6 lg:py-16">
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/78 md:text-xl md:leading-snug">{fa.emphasisStrip}</p>
      </section>

      {/* Differentiators */}
      <section className="border-t border-text/[0.06] bg-white px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-primary">{fa.diffEyebrow}</p>
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-text md:text-4xl md:leading-[1.15]">
            {fa.diffTitle}
          </h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {focalAiDifferentiators.map(({ title, body }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <h3 className="text-lg font-bold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text/60">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles grid */}
      <section id="focal-principles" className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center lg:text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-primary">{fa.principlesEyebrow}</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{fa.principlesTitle}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {focalAiPillars.map(({ title, body, Icon }, idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="relative overflow-hidden rounded-3xl border border-text/[0.06] bg-white p-8 shadow-[0_18px_60px_rgba(1,20,26,0.05)]"
              >
                <span className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-sky-400 via-primary to-sky-300" aria-hidden />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-600">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text/60">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function CaseManagementPage() {
  const { ns } = useI18n();
  const cm = ns('caseManagement') as Record<string, string>;

  const WORKFLOW_OVERVIEW_BENEFITS = Array.from({ length: 7 }, (_, i) => ({
    keyword: cm[`benefit${i}Keyword`],
    detail: cm[`benefit${i}Detail`],
    Icon: caseBenefitIcons[i]!
  }));

  const caseManagementFeatures = Array.from({ length: 17 }, (_, i) =>
    [cm[`feature${i}Title`], cm[`feature${i}Desc`]] as [string, string]
  );

  return (
    <main className="bg-[#f6fbff] pt-25 text-text">
      <section className="relative min-h-[640px] overflow-hidden pb-20 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(17,184,245,0.16),transparent_32%),radial-gradient(circle_at_86%_10%,rgba(81,78,247,0.12),transparent_28%)]" />
        <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />

        <div className="absolute inset-0 z-10 w-screen">
          <MiniCaseFlow
            labels={{
              request: cm.miniFlowReceived,
              assign: cm.miniFlowAssign,
              review: cm.miniFlowReview,
              resolve: cm.miniFlowResolve
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="pointer-events-none relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-xl rounded-4xl bg-[#f6fbff]/72 p-6 backdrop-blur-sm sm:p-8 lg:-translate-x-20 xl:-translate-x-28">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-primary">{cm.heroEyebrow}</p>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">{cm.heroTitle}</h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-text/65">{cm.heroLead}</p>
          </div>
        </motion.div>
      </section>

      <section id="case-overview" className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:gap-12">
          <header className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">{cm.overviewEyebrow}</p>
            <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl lg:text-[2.25rem] lg:leading-[1.15]">
              {cm.overviewTitle}
            </h2>
            <p className="mt-6 text-base leading-relaxed md:text-[1.0625rem] md:leading-[1.65]">
              <span className="font-semibold tracking-tight text-text">{cm.productNameShort}</span>{' '}
              <span className="text-text/62">{cm.leadRest}</span>
            </p>
          </header>

          <div className="w-full rounded-3xl border border-text/[0.06] bg-white p-6 shadow-[0_18px_60px_rgba(1,20,26,0.06)] sm:p-8">
            <div className="mb-5 border-b border-text/[0.06] pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-primary">{cm.benefitsEyebrow}</p>
              <p className="mt-2 max-w-2xl text-sm leading-snug text-text/45">{cm.benefitsIntro}</p>
            </div>
            <ul className="grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-3">
              {WORKFLOW_OVERVIEW_BENEFITS.map(({ keyword, detail, Icon }) => (
                <li
                  key={keyword}
                  className="group flex gap-3 rounded-2xl border border-text/[0.06] bg-linear-to-br from-[#f8fdff] to-[#f2fbff] px-4 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] transition-colors hover:border-primary/18 hover:from-[#f2fbff] hover:to-white sm:min-h-0"
                >
                  <span
                    className="mt-0.5 flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-primary/14 text-primary ring-1 ring-primary/10"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[13px] font-semibold leading-snug tracking-tight text-text sm:text-sm">{keyword}</p>
                    <p className="text-[12px] leading-relaxed text-text/58 sm:text-[13px] sm:leading-relaxed">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="case-features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">{cm.featuresEyebrow}</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{cm.featuresTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caseManagementFeatures.map(([title, desc], idx) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="relative min-h-[220px] overflow-hidden rounded-3xl border border-text/5 bg-white p-6 shadow-[0_18px_60px_rgba(1,20,26,0.05)] transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-x-0 top-0 h-3 bg-linear-to-r from-primary via-secondary to-accent" aria-hidden="true" />
                <span className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/8 to-transparent" aria-hidden="true" />
                <CaseFeatureGraphic Icon={caseFeatureIcons[idx]} variant={4} />
                <div className="relative z-10 pr-14">
                  <h3 className="text-lg font-bold text-text">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text/60">{desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const { t, ns } = useI18n();
  const home = ns('home') as Record<string, unknown>;
  const demo = ns('demo') as Record<string, string>;
  const footer = ns('footer') as Record<string, string>;

  const newsItems = (
    Array.isArray(home.newsItems)
      ? (home.newsItems as { title: string; category: string; date: string; slug?: string }[])
      : []
  );

  const heroRef = useRef<HTMLElement>(null);
  const bentoSectionRef = useRef<HTMLElement>(null);
  const newsSectionRef = useRef<HTMLElement>(null);
  const solutionsSectionRef = useRef<HTMLElement>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>(() => pageFromHash(window.location.hash));
  const [forceNavbarTop, setForceNavbarTop] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showStyleControls, setShowStyleControls] = useState(false);
  const [showBentoIcons, setShowBentoIcons] = useState(true);
  const [alignContactInfoBottom, setAlignContactInfoBottom] = useState(true);
  const [hideEnquiryButton, setHideEnquiryButton] = useState(false);
  const [hideUtilityBarWhenHomeAtTop, setHideUtilityBarWhenHomeAtTop] = useState(false);
  const [useNavSpinHover, setUseNavSpinHover] = useState(false);
  const [dropdownGlassOpacity, setDropdownGlassOpacity] = useState(0.9);
  const [bentoSectionAppearance, setBentoSectionAppearance] = useState<'pastel' | 'mint' | 'dark'>('mint');
  const [pastelBentoGlassStrength, setPastelBentoGlassStrength] = useState<'airy' | 'balanced' | 'readable'>('readable');
  const [colorProfile, setColorProfile] = useState<'default' | 'navy'>('default');
  const [navLayoutDemo, setNavLayoutDemo] = useState<NavbarLayoutMode>('heroTransparent');
  const [showFestivalBar, setShowFestivalBar] = useState(true);
  const [heroNavPortalEl, setHeroNavPortalEl] = useState<HTMLDivElement | null>(null);

  const pastelBentoGlassPresets = {
    airy: {
      shell:
        'border border-white/60 bg-white/30 shadow-[0_12px_48px_rgba(1,20,26,0.11),inset_0_1px_0_0_rgba(255,255,255,0.65)] backdrop-blur-[34px] backdrop-saturate-150',
      wash1: 'from-white/35 via-white/12 to-primary/8',
      wash2: 'from-text/8 via-transparent to-transparent',
      hoverRadial: 'bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,245,0.22),transparent_34%)]'
    },
    balanced: {
      shell:
        'border border-white/58 bg-white/44 shadow-[0_14px_52px_rgba(1,20,26,0.12),inset_0_1px_0_0_rgba(255,255,255,0.58)] backdrop-blur-[26px] backdrop-saturate-150',
      wash1: 'from-white/40 via-white/14 to-primary/7',
      wash2: 'from-text/10 via-transparent to-transparent',
      hoverRadial: 'bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,245,0.28),transparent_34%)]'
    },
    readable: {
      shell:
        'border border-white/5 bg-white/55 shadow-[0_16px_56px_rgba(1,20,26,0.13),inset_0_1px_0_0_rgba(255,255,255,0.5)] backdrop-blur-[20px] backdrop-saturate-[1.25]',
      wash1: 'from-white/45 via-white/18 to-primary/8',
      wash2: 'from-text/14 via-transparent to-transparent',
      hoverRadial: 'bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,245,0.34),transparent_34%)]'
    }
  } as const;

  useEffect(() => {
    const root = document.documentElement;
    if (colorProfile === 'navy') {
      root.dataset.colorProfile = 'navy';
    } else {
      delete root.dataset.colorProfile;
    }
  }, [colorProfile]);

  useEffect(() => {
    const scrollToHomeSection = (section: HTMLElement | null) => {
      window.requestAnimationFrame(() => {
        if (!section) return;
        window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
      });
    };

    const handleHashChange = () => {
      const hash = window.location.hash === '#' ? '' : window.location.hash;
      setActivePage(pageFromHash(hash));
      if (hash === LATEST_NEWS_HASH) {
        scrollToHomeSection(newsSectionRef.current);
        return;
      }
      if (hash === WHAT_WE_BUILD_HASH) {
        scrollToHomeSection(bentoSectionRef.current);
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);

    if (window.location.hash === LATEST_NEWS_HASH) {
      scrollToHomeSection(newsSectionRef.current);
    } else if (window.location.hash === WHAT_WE_BUILD_HASH) {
      scrollToHomeSection(bentoSectionRef.current);
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const key = activePage === 'unknown' ? 'meta.pages.unknown' : (`meta.pages.${activePage}` as const);
    document.title = t(key);
  }, [activePage, t]);

  useEffect(() => {
    const SNAP_FILTER = '[scroll-snap]';
    const snapLog = (msg: string, extra?: Record<string, unknown>) => {
      if (extra === undefined) console.log(SNAP_FILTER, msg);
      else console.log(SNAP_FILTER, msg, extra);
    };

    if (activePage !== 'home') {
      snapLog('listeners not attached', { reason: 'activePage !== home', activePage });
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      snapLog('listeners not attached', { reason: 'prefers-reduced-motion: reduce' });
      return;
    }

    snapLog('listeners attached');

    const topThreshold = 80;
    const heroBoundaryPadding = 120;
    const sectionSnapPadding = 160;

    const getHeroBottom = () => {
      const hero = heroRef.current;
      return hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    };

    const getSectionTop = (section: HTMLElement | null, fallback: number) => {
      return section ? section.offsetTop : fallback;
    };

    const snapTo = (top: number, label: string) => {
      if (snapTimeoutRef.current !== null) {
        snapLog('snapTo skipped (cooldown)', { label, top });
        return;
      }

      snapLog('snapTo', { label, top, scrollYBefore: window.scrollY });
      setForceNavbarTop(top === 0);
      window.scrollTo({ top, behavior: 'smooth' });
      snapTimeoutRef.current = window.setTimeout(() => {
        snapTimeoutRef.current = null;
        setForceNavbarTop(false);
      }, 900);
    };

    const handleSnapIntent = (
      direction: 'down' | 'up',
      source: 'wheel' | 'touch'
    ): boolean => {
      const scrollY = window.scrollY;
      const heroBottom = getHeroBottom();
      const sectionOneTop = getSectionTop(newsSectionRef.current, heroBottom);
      const sectionTwoTop = getSectionTop(bentoSectionRef.current, sectionOneTop + window.innerHeight);
      const sectionThreeTop = getSectionTop(
        solutionsSectionRef.current,
        sectionTwoTop + window.innerHeight
      );

      const ctx = {
        source,
        direction,
        scrollY,
        heroBottom,
        sectionOneTop,
        sectionTwoTop,
        sectionThreeTop,
        topThreshold,
        sectionSnapPadding,
      };

      if (direction === 'down' && scrollY <= topThreshold) {
        snapTo(sectionOneTop, 'hero → latest news');
        snapLog('intent handled', { ...ctx, branch: 'down: top → section1' });
        return true;
      }

      if (
        direction === 'down' &&
        scrollY >= sectionOneTop - topThreshold &&
        scrollY < sectionTwoTop - sectionSnapPadding
      ) {
        snapTo(sectionTwoTop, 'latest news → bento');
        snapLog('intent handled', { ...ctx, branch: 'down: section1 → section2' });
        return true;
      }

      if (
        direction === 'down' &&
        scrollY >= sectionTwoTop - topThreshold &&
        scrollY < sectionThreeTop - sectionSnapPadding
      ) {
        snapTo(sectionThreeTop, 'bento → solutions');
        snapLog('intent handled', { ...ctx, branch: 'down: section2 → section3' });
        return true;
      }

      if (
        direction === 'up' &&
        scrollY > topThreshold &&
        scrollY <= heroBottom + heroBoundaryPadding - 100
      ) {
        snapTo(0, 'hero boundary → top');
        snapLog('intent handled', { ...ctx, branch: 'up: into hero → 0' });
        return true;
      }

      if (
        direction === 'up' &&
        scrollY >= sectionTwoTop - topThreshold &&
        scrollY <= sectionTwoTop + sectionSnapPadding
      ) {
        snapTo(sectionOneTop, 'bento zone → latest news');
        snapLog('intent handled', { ...ctx, branch: 'up: section2 → section1' });
        return true;
      }

      if (
        direction === 'up' &&
        scrollY >= sectionThreeTop - topThreshold &&
        scrollY <= sectionThreeTop + sectionSnapPadding
      ) {
        snapTo(sectionTwoTop, 'solutions zone → bento');
        snapLog('intent handled', { ...ctx, branch: 'up: section3 → section2' });
        return true;
      }

      snapLog('intent no match', ctx);
      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        snapLog('wheel ignored', {
          ctrlKey: event.ctrlKey,
          deltaX: event.deltaX,
          deltaY: event.deltaY,
        });
        return;
      }

      const direction = event.deltaY > 0 ? 'down' : 'up';
      const handled = handleSnapIntent(direction, 'wheel');
      snapLog('wheel', { direction, deltaY: event.deltaY, handled, defaultPreventedWillBe: handled });
      if (handled) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = event.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY === null || endY === undefined) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < 24) {
        snapLog('touch ignored', { reason: 'delta too small', deltaY });
        return;
      }

      const direction = deltaY > 0 ? 'down' : 'up';
      const handled = handleSnapIntent(direction, 'touch');
      snapLog('touch', { direction, deltaY, handled });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);

      if (snapTimeoutRef.current !== null) {
        window.clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 160);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    setForceNavbarTop(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => setForceNavbarTop(false), 900);
  };

  const newsArticleSlug = newsSlugFromHash(window.location.hash);
  const scrolledSectionTopPad = showFestivalBar
    ? `calc(11rem + ${FESTIVAL_BAR_HEIGHT}px)`
    : '11rem';

  return (
    <div className="min-h-screen bg-background font-sans">
      <AnimatePresence>
        {showFestivalBar && (
          <motion.div
            key="festival-bar"
            initial={{ height: 0 }}
            animate={{ height: FESTIVAL_BAR_HEIGHT }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-52 overflow-hidden"
          >
            <div className="relative flex h-14 items-center justify-center gap-3 border-b border-[#c9a227]/35 bg-[linear-gradient(90deg,#0a3324_0%,#145c38_42%,#0f5248_100%)] px-6 text-[#f0dfa0] shadow-[inset_0_1px_0_rgba(201,162,39,0.22)]">
              <Ship size={16} className="shrink-0 text-[#e8c547]" aria-hidden />
              <p className="text-sm font-semibold tracking-wide">{String(home.festivalBarMessage ?? '')}</p>
              <button
                type="button"
                onClick={() => setShowFestivalBar(false)}
                className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full text-[#f0dfa0]/70 transition-colors hover:bg-[#c9a227]/15 hover:text-[#f0dfa0]"
                aria-label="Close announcement bar"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar
        forceTopState={forceNavbarTop}
        topStateEnabled={activePage === 'home'}
        hideUtilityBarWhenHomeAtTop={hideUtilityBarWhenHomeAtTop}
        hideEnquiryButton={hideEnquiryButton}
        navHoverEffect={useNavSpinHover ? 'spin' : 'swipe'}
        dropdownGlassOpacity={dropdownGlassOpacity}
        colorProfile={colorProfile}
        navLayout={navLayoutDemo}
        heroNavPortalEl={activePage === 'home' ? heroNavPortalEl : null}
        topOffset={showFestivalBar ? FESTIVAL_BAR_HEIGHT : 0}
      />

      {activePage === 'home' ? (
      <main>
        <HomeHero
          heroRef={heroRef}
          heroNavPortalRef={setHeroNavPortalEl}
          title={String(home.heroTitle ?? '')}
          lead={String(home.heroLead ?? '')}
          ctaSecondary={String(home.heroCtaSecondary ?? '')}
          imageSrc={String(home.heroImageSrc ?? '')}
          imageAlt={String(home.heroImageAlt ?? '')}
          cards={[
            {
              title: String(home.heroCard0Title ?? ''),
              href: LATEST_NEWS_HASH,
              imageSrc: String(home.heroCard0ImageSrc ?? ''),
              imageAlt: String(home.heroCard0ImageAlt ?? ''),
              onNavigate: () => {
                newsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            },
            {
              title: String(home.heroCard1Title ?? ''),
              href: SERVICES_HASH,
              imageSrc: String(home.heroCard1ImageSrc ?? ''),
              imageAlt: String(home.heroCard1ImageAlt ?? '')
            },
            {
              title: String(home.heroCard2Title ?? ''),
              href: PROFILE_HASH,
              imageSrc: String(home.heroCard2ImageSrc ?? ''),
              imageAlt: String(home.heroCard2ImageAlt ?? '')
            },
            {
              title: String(home.heroCard3Title ?? ''),
              href: CONTACT_US_HASH,
              imageSrc: String(home.heroCard3ImageSrc ?? ''),
              imageAlt: String(home.heroCard3ImageAlt ?? '')
            }
          ]}
          onDiscoverClick={() => {
            bentoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Latest News */}
        <section
          id="latest-news"
          ref={newsSectionRef}
          className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white py-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(17,184,245,0.07),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(81,78,247,0.05),transparent_35%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold tracking-tight text-text md:text-5xl">{String(home.newsTitle ?? '')}</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item, idx) => {
                const cardClassName =
                  'group flex flex-col rounded-3xl border border-text/6 bg-white p-9 shadow-[0_4px_24px_rgba(1,20,26,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(17,184,245,0.12)]';
                const cardContent = (
                  <>
                    <div className="mb-4 flex items-center gap-2 text-text/45">
                      <Clock3 size={14} aria-hidden />
                      <span className="text-base font-medium">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-text transition-colors duration-200 group-hover:text-primary">
                      {item.title}
                    </h3>
                  </>
                );
                const motionProps = {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: idx * 0.07 }
                };

                if (item.slug) {
                  return (
                    <motion.a
                      key={item.slug}
                      href={newsArticleHash(item.slug)}
                      {...motionProps}
                      className={`${cardClassName} no-underline`}
                    >
                      {cardContent}
                    </motion.a>
                  );
                }

                return (
                  <motion.article key={idx} {...motionProps} className={cardClassName}>
                    {cardContent}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bento Solutions */}
        <section
          ref={bentoSectionRef}
          id="what-we-build"
          style={{ paddingTop: scrolledSectionTopPad }}
          className={`relative min-h-screen overflow-hidden pb-12 transition-[background-color,padding-top] duration-500 ${
            bentoSectionAppearance === 'dark' ? 'bg-[#05070b]' : 'bg-[#f6fbff]'
          }`}
        >
          {bentoSectionAppearance === 'pastel' ? (
            <img
              src="/assets/bento-pastel-mesh-bg.png"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
              decoding="async"
              draggable={false}
            />
          ) : null}
          {bentoSectionAppearance === 'mint' ? (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(17,184,245,0.12),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(81,78,247,0.10),transparent_30%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-60 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />
            </>
          ) : null}
          <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{String(home.bentoEyebrow ?? '')}</p>
              <h2
                className={`text-3xl font-bold tracking-tight md:text-4xl ${
                  bentoSectionAppearance === 'dark' ? 'text-white' : 'text-text'
                }`}
              >
                {String(home.bentoHeading ?? '')}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[125px]">
              {[
                {
                  slug: 'capture',
                  title: String(home.bentoCard0Title ?? ''),
                  icon: <Cpu size={30} strokeWidth={2.4} />,
                  desc: String(home.bentoCard0Desc ?? ''),
                  ctaAria: String(home.bentoCard0CtaAria ?? ''),
                  ctaHref: CAPTURE_HASH,
                  image: '/assets/bento-capture-bg.png',
                  className: 'lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2'
                },
                {
                  slug: 'focal-ai',
                  title: String(home.bentoCard1Title ?? ''),
                  icon: <Sparkles size={28} strokeWidth={2.4} />,
                  desc: String(home.bentoCard1Desc ?? ''),
                  ctaAria: String(home.bentoCard1CtaAria ?? ''),
                  ctaHref: FOCAL_AI_PAGE_HASH,
                  image: '/assets/bento-focal-ai-bg.png',
                  className: 'lg:col-start-6 lg:col-span-4 lg:row-start-1 lg:row-span-2'
                },
                {
                  slug: 'workflow',
                  title: String(home.bentoCard2Title ?? ''),
                  icon: <Users size={28} strokeWidth={2.4} />,
                  desc: String(home.bentoCard2Desc ?? ''),
                  ctaAria: String(home.bentoCard2CtaAria ?? ''),
                  ctaHref: WORKFLOW_MANAGEMENT_HASH,
                  image: '/assets/bento-workflow-bg.png',
                  className: 'lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-2'
                },
                {
                  slug: 'document',
                  title: String(home.bentoCard3Title ?? ''),
                  icon: <Database size={30} strokeWidth={2.4} />,
                  desc: String(home.bentoCard3Desc ?? ''),
                  ctaAria: String(home.bentoCard3CtaAria ?? ''),
                  ctaHref: DOCUMENT_MANAGEMENT_HASH,
                  image: '/assets/bento-document-management-hover.png',
                  className: 'lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:row-span-2'
                },
                {
                  slug: 'web-content',
                  title: String(home.bentoCard4Title ?? ''),
                  icon: <Globe size={28} strokeWidth={2.4} />,
                  desc: String(home.bentoCard4Desc ?? ''),
                  ctaAria: String(home.bentoCard4CtaAria ?? ''),
                  ctaHref: WEB_CONTENT_MANAGEMENT_HASH,
                  image: '/assets/bento-web-content-bg.png',
                  className: 'lg:col-start-7 lg:col-span-6 lg:row-start-3 lg:row-span-2'
                }
              ].map((item, idx) => {
                const isMintWhite = bentoSectionAppearance === 'mint';
                const pastelGlass = bentoSectionAppearance === 'pastel';
                const glass = pastelBentoGlassPresets[pastelBentoGlassStrength];
                // Offset mesh crop per tile so cards don't look identical
                const pastelMeshPositions = [
                  'object-[18%_22%]',
                  'object-[72%_18%]',
                  'object-[88%_48%]',
                  'object-[28%_78%]',
                  'object-[62%_62%]'
                ] as const;
                const lightText = isMintWhite || pastelGlass;

                return (
                <motion.article
                  key={item.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className={`group relative min-h-[300px] overflow-hidden rounded-3xl p-6 transition-all duration-300 lg:min-h-0 ${item.className} ${
                    isMintWhite
                      ? 'border border-text/6 bg-white shadow-[0_4px_24px_rgba(1,20,26,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(17,184,245,0.12)]'
                      : pastelGlass
                        ? 'isolate border border-white/55 bg-white/20 shadow-[0_16px_56px_rgba(1,20,26,0.10),inset_0_1px_0_0_rgba(255,255,255,0.55)] hover:-translate-y-1 hover:border-white/70 hover:shadow-[0_24px_72px_rgba(17,184,245,0.14),0_14px_44px_rgba(1,20,26,0.08)]'
                        : 'border border-white/10 bg-[#11141b] shadow-[0_18px_80px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_28px_100px_rgba(17,184,245,0.18)]'
                  }`}
                >
                  {isMintWhite ? null : pastelGlass ? (
                    <img
                      src="/assets/bento-pastel-mesh-bg.png"
                      alt=""
                      className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${pastelMeshPositions[idx] ?? 'object-center'}`}
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy={item.image.startsWith('http') ? 'no-referrer' : undefined}
                    />
                  )}
                  {isMintWhite ? null : pastelGlass ? (
                    <>
                      <div className="pointer-events-none absolute inset-0 z-[2] bg-white/25" />
                      <div className={`pointer-events-none absolute inset-0 z-[2] bg-linear-to-br ${glass.wash1}`} />
                      <div className={`pointer-events-none absolute inset-0 z-[2] bg-linear-to-t ${glass.wash2}`} />
                      <div
                        className={`pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${glass.hoverRadial}`}
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-linear-to-br from-black/85 via-black/48 to-black/18" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/72 via-transparent to-black/22" />
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,245,0.32),transparent_34%)]" />
                    </>
                  )}

                  <div
                    className={`relative z-20 pb-16 pr-12 ${item.slug === 'web-content' ? 'max-w-2xl' : 'max-w-[95%]'}`}
                  >
                    <h3
                      className={
                        lightText
                          ? `mb-3 text-2xl font-bold tracking-tight text-text${
                              isMintWhite
                                ? ' transition-colors duration-200 group-hover:text-primary'
                                : ' [text-shadow:0_1px_0_rgba(255,255,255,0.75)]'
                            }`
                          : 'mb-3 text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
                      }
                    >
                      {item.title}
                    </h3>
                    <p
                      className={
                        lightText
                          ? `text-sm font-medium leading-6 text-text/76${
                              pastelGlass ? ' [text-shadow:0_1px_0_rgba(255,255,255,0.5)]' : ''
                            }`
                          : 'text-sm font-medium leading-6 text-white/88 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]'
                      }
                    >
                      {item.desc}
                    </p>
                  </div>

                  <div className={`pointer-events-none absolute right-5 top-5 z-20 transition-all duration-300 ${showBentoIcons ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-primary shadow-[0_12px_40px_rgba(1,20,26,0.14)] transition-transform duration-300 group-hover:scale-105 [&_svg]:h-6 [&_svg]:w-6 ${
                        isMintWhite
                          ? 'border border-text/8 bg-[#f6fbff]'
                          : pastelGlass
                            ? 'border border-white/45 bg-white/28 ring-1 ring-inset ring-white/35 backdrop-blur-md'
                            : 'border border-white/25 bg-white/15 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md [&_svg]:text-white'
                      }`}
                    >
                      {showBentoIcons && item.icon}
                    </div>
                  </div>

                  <a
                    href={item.ctaHref}
                    className={`absolute bottom-5 left-6 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-[0_8px_28px_rgba(1,20,26,0.12)] transition-all hover:border-transparent hover:bg-primary hover:text-white ${
                      isMintWhite
                        ? 'border border-text/10 bg-white text-text hover:shadow-[0_12px_36px_rgba(17,184,245,0.22)]'
                        : pastelGlass
                          ? 'border border-text/12 bg-white/88 text-text backdrop-blur-sm hover:shadow-[0_12px_36px_rgba(17,184,245,0.22)]'
                          : 'border border-white/20 bg-white/95 text-text shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
                    }`}
                    aria-label={item.ctaAria}
                  >
                    {String(home.bentoCardCtaLabel ?? '')}
                    <ArrowRight size={16} className="shrink-0" aria-hidden />
                  </a>

                  <span className="sr-only">{item.title}</span>
                </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* All About FDS */}
        <section
          ref={solutionsSectionRef}
          style={{ paddingTop: scrolledSectionTopPad }}
          className="relative min-h-screen overflow-hidden bg-[#f6fbff] pb-24 transition-[padding-top] duration-500"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(17,184,245,0.12),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(81,78,247,0.10),transparent_30%)]" />
          <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="w-full"
            >
              <p className="mb-2 text-lg font-bold uppercase tracking-[0.32em] text-primary">{String(home.fdsEyebrow ?? '')}</p>
              <h2 className="text-5xl font-bold tracking-tight text-text md:text-7xl lg:text-8xl">{String(home.fdsTitle ?? '')}</h2>
              <p className="mt-6 max-w-5xl text-lg leading-8 text-text/60 md:text-xl">{String(home.fdsLead ?? '')}</p>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                [String(home.statYearsValue ?? ''), String(home.statYearsLabel ?? ''), ''],
                [String(home.statSoaTitle ?? ''), String(home.statSoaLabel ?? ''), ''],
                [String(home.statBodiesValue ?? ''), String(home.statBodiesLabel ?? ''), ''],
                [String(home.statMatureTitle ?? ''), String(home.statMatureDesc ?? ''), '']
              ].map(([value, title, desc], idx) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="group rounded-3xl border border-text/5 bg-white p-7 shadow-[0_18px_60px_rgba(1,20,26,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(17,184,245,0.14)]"
                >
                  <div className="mb-5 text-4xl font-bold tracking-tight text-primary">{value}</div>
                  <h3 className="text-xl font-bold leading-snug text-text">{title}</h3>
                  {desc && <p className="mt-3 text-sm leading-7 text-text/55">{desc}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizations We Serve + logo marquee — disabled until government / organizational logo consent */}
        {false && (
        <section className="relative flex min-h-screen overflow-hidden bg-[#f6fbff] px-4 py-12 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(72,128,255,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(90,226,196,0.22),transparent_34%),linear-gradient(120deg,#eef8ff_0%,#f8fdff_48%,#f6fbff_100%)]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(90deg,rgba(17,184,245,0.2)_1px,transparent_1px),linear-gradient(rgba(17,184,245,0.18)_1px,transparent_1px)] bg-size-[18px_18px] opacity-35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-[#f6fbff]" />

          <div className="relative z-10 mx-auto flex w-full max-w-[1540px] items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative w-full overflow-hidden rounded-4xl bg-white/88 px-3 py-16 text-center shadow-[0_34px_110px_rgba(17,184,245,0.16)] ring-1 ring-white/80 backdrop-blur-xl sm:rounded-[2.5rem] sm:px-8 md:py-20"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(70,130,255,0.20),transparent_34%),radial-gradient(circle_at_72%_10%,rgba(83,232,198,0.24),transparent_36%)]" />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/40 to-white/80" />

              <div className="relative z-10 mx-auto max-w-5xl">
                <h2 className="text-4xl font-light tracking-tight text-[#3066d6] md:text-6xl lg:text-7xl">
                  Organizations <span className="font-bold text-[#2f60ff]">we serve</span>
                </h2>
                {/* <p className="mx-auto mt-6 max-w-3xl text-xl font-medium leading-relaxed text-text/70 md:text-3xl">
                  FDS partners with leading clients to build a future of <span className="font-bold text-text">intelligence</span>
                </p> */}
              </div>

              {/*
              <div className="relative z-10 mt-14 space-y-8 overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-linear-to-r from-white via-white/85 to-transparent sm:w-40" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-linear-to-l from-white via-white/85 to-transparent sm:w-40" />

                {clientLogoRows.map((row, rowIndex) => (
                  <Marquee
                    key={rowIndex}
                    pauseOnHover
                    speed={rowIndex === 1 ? 30 : 38}
                    direction={rowIndex === 1 ? 'right' : 'left'}
                    gradient={false}
                    className="py-1"
                  >
                    {Array.from({ length: 4 }).flatMap(() => row).map((client, clientIndex) => (
                      <div
                        key={`${client.name}-${rowIndex}-${clientIndex}`}
                        className="mx-2 flex h-20 min-w-44 items-center justify-center opacity-85 transition-all duration-300 hover:scale-105 hover:opacity-100 sm:mx-3 sm:h-28 sm:min-w-64"
                      >
                        <img
                          src={client.src}
                          alt={client.name}
                          className="max-h-16 max-w-52 object-contain sm:max-h-24 sm:max-w-72"
                        />
                      </div>
                    ))}
                  </Marquee>
                ))}
              </div>
              */}
            </motion.div>
          </div>
        </section>
        )}

        <GetInTouchSection colorProfile={colorProfile} alignContactInfoBottom={alignContactInfoBottom} />
      </main>
      ) : activePage === 'case-management' ? (
        <CaseManagementPage />
      ) : activePage === 'focal-ai' ? (
        <FocalAiPage />
      ) : activePage === 'contact-us' ? (
        <ContactUsPage colorProfile={colorProfile} />
      ) : activePage === 'unknown' ? (
        <UnknownHashPage />
      ) : activePage === 'capture' ? (
        <CapturePage />
      ) : activePage === 'profile' ? (
        <ProfilePage />
      ) : activePage === 'document-management' ? (
        <DocumentManagementPage />
      ) : activePage === 'web-content-management' ? (
        <WebContentManagementPage />
      ) : activePage === 'services' ? (
        <ServicesPage />
      ) : activePage === 'career' ? (
        <CareerPage />
      ) : activePage === 'news-article' ? (
        <NewsArticlePage slug={newsArticleSlug ?? ''} />
      ) : (
        <UnknownHashPage />
      )}

      {activePage === 'home' ? (
      <div className="fixed bottom-8 left-8 z-50">
        <motion.div
          initial={false}
          animate={{
            opacity: showStyleControls ? 1 : 0,
            y: showStyleControls ? 0 : 12,
            scale: showStyleControls ? 1 : 0.96
          }}
          transition={{ duration: 0.22 }}
          className={`demo-style-controls-panel mb-3 max-h-[calc(100dvh-8rem)] w-72 overflow-x-hidden overflow-y-auto overscroll-contain rounded-3xl border border-white/30 bg-[#07111f]/90 p-5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl ${showStyleControls ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-interactive">{demo.controlsEyebrow}</p>
            <h3 className="mt-1 text-lg font-bold">{demo.controlsTitle}</h3>
          </div>

          <label className="mb-3 block rounded-2xl border border-white/10 bg-white/8 p-4">
            <span className="block text-sm font-semibold text-interactive">{demo.navLayoutLabel}</span>
            <span className="mt-1 mb-2 block text-xs leading-5 text-white/55">{demo.navLayoutHelp}</span>
            <select
              value={navLayoutDemo}
              onChange={(event) => setNavLayoutDemo(event.target.value as NavbarLayoutMode)}
              aria-label={demo.navLayoutAria}
              className="mt-2 w-full rounded-xl border border-white/20 bg-[#07111f]/80 px-3 py-2.5 text-sm font-medium text-white outline-none"
            >
              <option value="pillFixed">{demo.navLayoutPill}</option>
              <option value="heroTransparent">{demo.navLayoutHeroTransparent}</option>
            </select>
          </label>

          <label className="mt-5 block rounded-2xl border border-white/10 bg-white/8 p-4">
            <span className="block text-sm font-semibold text-interactive">{demo.colorProfileLabel}</span>
            <span className="mt-1 mb-2 block text-xs leading-5 text-white/55">{demo.colorProfileHelp}</span>
            <select
              value={colorProfile}
              onChange={(event) => setColorProfile(event.target.value as 'default' | 'navy')}
              className="mt-1 w-full cursor-pointer rounded-xl border border-white/15 bg-[#0d1828] px-3 py-2.5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
              aria-label={demo.colorProfileAria}
            >
              <option value="default">{demo.colorDefault}</option>
              <option value="navy">{demo.colorNavy}</option>
            </select>
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.bentoIconsTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.bentoIconsHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={showBentoIcons}
              onChange={(event) => setShowBentoIcons(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 block rounded-2xl border border-white/10 bg-white/8 p-4">
            <span className="block text-sm font-semibold text-interactive">{demo.bentoAppearanceLabel}</span>
            <span className="mt-1 mb-2 block text-xs leading-5 text-white/55">{demo.bentoAppearanceHelp}</span>
            <select
              value={bentoSectionAppearance}
              onChange={(event) => setBentoSectionAppearance(event.target.value as 'pastel' | 'mint' | 'dark')}
              className="mt-1 w-full cursor-pointer rounded-xl border border-white/15 bg-[#0d1828] px-3 py-2.5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]"
              aria-label={demo.bentoAppearanceAria}
            >
              <option value="pastel">{demo.bentoAppearancePastel}</option>
              <option value="mint">{demo.bentoAppearanceMint}</option>
              <option value="dark">{demo.bentoAppearanceDarkDemo}</option>
            </select>
          </label>

          <label
            className={`mt-3 block rounded-2xl border border-white/10 bg-white/8 p-4 ${
              bentoSectionAppearance !== 'pastel' ? 'pointer-events-none opacity-45' : ''
            }`}
          >
            <span className="block text-sm font-semibold text-interactive">{demo.bentoPastelGlassLabel}</span>
            <span className="mt-1 mb-2 block text-xs leading-5 text-white/55">{demo.bentoPastelGlassHelp}</span>
            <select
              value={pastelBentoGlassStrength}
              disabled={bentoSectionAppearance !== 'pastel'}
              onChange={(event) =>
                setPastelBentoGlassStrength(event.target.value as 'airy' | 'balanced' | 'readable')
              }
              className="mt-1 w-full cursor-pointer rounded-xl border border-white/15 bg-[#0d1828] px-3 py-2.5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={demo.bentoPastelGlassAria}
            >
              <option value="airy">{demo.bentoPastelGlassAiry}</option>
              <option value="balanced">{demo.bentoPastelGlassBalanced}</option>
              <option value="readable">{demo.bentoPastelGlassReadable}</option>
            </select>
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.contactAlignTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.contactAlignHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={alignContactInfoBottom}
              onChange={(event) => setAlignContactInfoBottom(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.hideEnquiryTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.hideEnquiryHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={hideEnquiryButton}
              onChange={(event) => setHideEnquiryButton(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.utilityBarAtTopTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.utilityBarAtTopHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={hideUtilityBarWhenHomeAtTop}
              onChange={(event) => setHideUtilityBarWhenHomeAtTop(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.navSpinTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.navSpinHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={useNavSpinHover}
              onChange={(event) => setUseNavSpinHover(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
            <span>
              <span className="block text-sm font-semibold">{demo.festivalBarTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-white/55">{demo.festivalBarHelp}</span>
            </span>
            <input
              type="checkbox"
              checked={showFestivalBar}
              onChange={(event) => setShowFestivalBar(event.target.checked)}
              className="h-5 w-5 accent-interactive"
            />
          </label>

          <label className="mt-3 block rounded-2xl border border-white/10 bg-white/8 p-4">
            <span className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-semibold">{demo.dropdownGlassTitle}</span>
                <span className="mt-1 block text-xs leading-5 text-white/55">{demo.dropdownGlassHelp}</span>
              </span>
              <span className="text-xs font-bold text-interactive">{Math.round(dropdownGlassOpacity * 100)}%</span>
            </span>
            <input
              type="range"
              min="0.25"
              max="0.95"
              step="0.01"
              value={dropdownGlassOpacity}
              onChange={(event) => setDropdownGlassOpacity(Number(event.target.value))}
              className="mt-4 w-full accent-interactive"
            />
          </label>
        </motion.div>

        <button
          type="button"
          onClick={() => setShowStyleControls((isOpen) => !isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-[#07111f] text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur transition-colors duration-300 hover:bg-interactive"
          aria-expanded={showStyleControls}
          aria-label={demo.toggleAria}
        >
          <SlidersHorizontal size={22} strokeWidth={2.4} />
        </button>
      </div>
      ) : null}

      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={false}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          y: showBackToTop ? 0 : 18,
          scale: showBackToTop ? 1 : 0.92
        }}
        transition={{ duration: 0.24 }}
        className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-interactive text-white shadow-[0_18px_50px_rgba(17,184,245,0.35)] backdrop-blur transition-colors duration-300 ${
          colorProfile === 'default'
            ? 'hover:bg-[#0a1f44] hover:shadow-[0_18px_50px_rgba(10,31,68,0.45)]'
            : 'hover:bg-accent'
        } ${showBackToTop ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-label={footer.backToTopAria}
      >
        <ArrowUp size={22} strokeWidth={2.6} />
      </motion.button>

      {/* Footer */}
      <footer className="bg-background pt-24 pb-12 border-t border-text/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center mb-6">
                <img src={fdsLogoUrl} alt={footer.logoAlt} className="h-12 w-auto object-contain" />
              </div>
              <p className="text-text/50 text-sm leading-relaxed mb-8">{footer.blurb}</p>
            </div>

            <div>
              <h4 className="text-text font-bold mb-6 text-sm uppercase tracking-widest">{footer.columnSolutions}</h4>
              <ul className="space-y-3 text-sm text-text/60">
                <li className="hover:text-interactive cursor-pointer transition-colors">{footer.linkBmp}</li>
                <li className="hover:text-interactive cursor-pointer transition-colors">{footer.linkDmsNav}</li>
                <li>
                  <a href={WORKFLOW_MANAGEMENT_HASH} className="hover:text-interactive transition-colors">
                    {footer.linkWfmFooter}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-text font-bold mb-6 text-sm uppercase tracking-widest">{footer.columnCompany}</h4>
              <ul className="space-y-3 text-sm text-text/60">
                <li>
                  <a href={PROFILE_HASH} className="hover:text-interactive transition-colors">
                    {footer.linkAboutProfile}
                  </a>
                </li>
                <li>
                  <a href={SERVICES_HASH} className="hover:text-interactive transition-colors">
                    {footer.linkServices}
                  </a>
                </li>
                <li>
                  <a href={CAREER_HASH} className="hover:text-interactive transition-colors">
                    {footer.linkCareer}
                  </a>
                </li>
                <li>
                  <a href={CONTACT_US_HASH} className="hover:text-interactive transition-colors">
                    {footer.linkContactNav}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-text font-bold mb-6 text-sm uppercase tracking-widest">{footer.columnContact}</h4>
              <ul className="space-y-4 text-sm text-text/60">
                <li className="flex items-start gap-3">
                  <Phone size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>(852) 3100 7272</span>
                </li>
                <li className="flex items-start gap-3">
                  <Printer size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>(852) 3100 7222</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span>fdscall@fdssolutions.com.hk</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span className="leading-relaxed">
                    {footer.addressLine.split('|').map((segment, idx) => (
                      <span key={idx}>
                        {idx > 0 ? <br /> : null}
                        {segment.trim()}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock3 size={14} className="mt-0.5 shrink-0 text-primary" />
                  <span className="leading-relaxed">{footer.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-text/5 flex flex-col md:row justify-between items-center gap-6 text-[11px] font-medium text-text/40 uppercase tracking-[0.2em]">
            <span>{footer.copyright}</span>
            <div className="flex gap-8">
              <span className="hover:text-interactive cursor-pointer transition-colors">{footer.privacy}</span>
              <span className="hover:text-interactive cursor-pointer transition-colors">{footer.terms}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

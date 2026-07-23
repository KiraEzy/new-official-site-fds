import { motion } from 'motion/react';
import {
  Settings,
  ChevronRight,
  Clock,
  Search,
  FileEdit,
  Activity,
  Layers,
  Cpu,
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import type { ReactNode } from 'react';

import { CONTACT_US_HASH } from '../content/pageHashes';
import { useI18n } from '../i18n/I18nContext';

function RocketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.73-.78 7.5-3 10a22.08 22.08 0 0 1-4 2l-3-3Z" />
      <path d="M9 12H4s.5-1 1-4c2 0 5 2.5 5 2.5a22.08 22.08 0 0 0-1 1.5Z" />
      <path d="M15 15v5s-1 .5-4 1c0-2 2.5-5 2.5-5a22.08 22.08 0 0 0 1.5-1Z" />
      <line x1="11.5" y1="15.5" x2="15.5" y2="11.5" />
    </svg>
  );
}

/** Order matches services.json supportServices array entries */
const SUPPORT_ICONS: ReactNode[] = [
  <Clock key="i0" />,
  <RocketIcon key="i1" />,
  <Search key="i2" />,
  <Settings key="i3" />,
  <Activity key="i4" />,
  <FileEdit key="i5" />
];

type Methodology = {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  body: string;
  stages: string[];
  color: string;
};

interface MethodologyCardProps {
  item: Methodology;
  methodologyCardBadge: string;
  index: number;
}

function MethodologyCard({ item, methodologyCardBadge, index }: MethodologyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-text/5 bg-gray-100 p-8 group"
    >
      <div className={`absolute top-0 right-0 size-32 ${item.color} translate-x-10 -translate-y-10 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150`} />

      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div className="rounded-lg bg-text/5 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-text/40 uppercase">
          {methodologyCardBadge}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${item.color}`}>
          <Layers size={18} />
        </div>
      </div>

      <div className="relative z-10 mb-auto">
        <h3 className="mb-1 text-3xl font-bold tracking-tighter text-text">{item.code}</h3>
        <p className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">{item.subtitle}</p>
        <p className="mb-8 text-sm leading-relaxed text-text/50">{item.body}</p>
      </div>

      <div className="relative z-10 border-t border-text/10 pt-6">
        <div className="flex flex-wrap gap-2">
          {item.stages.map((stage) => (
            <span key={stage} className="rounded-md bg-text/5 px-2 py-1 text-[9px] font-bold tracking-wider text-text/30 uppercase">
              {stage}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const { ns } = useI18n();
  const s = ns('services');

  const supportServices = s.supportServices as { title: string; desc: string }[];
  const methodologies = s.methodologies as Methodology[];

  const maintenanceRows = [
    { id: 'M1', title: s.maintM1Title as string, desc: s.maintM1Desc as string },
    { id: 'M2', title: s.maintM2Title as string, desc: s.maintM2Desc as string },
    { id: 'M3', title: s.maintM3Title as string, desc: s.maintM3Desc as string }
  ];

  const estimationMethods = [
    { name: s.estimationFREMName as string, full: s.estimationFREMDesc as string },
    { name: s.estimationFPAName as string, full: s.estimationFPADesc as string },
    { name: s.estimationFORMName as string, full: s.estimationFORMDesc as string }
  ];

  return (
    <main className="min-h-screen bg-background pb-16 text-text antialiased  lg:pb-20 ">
      <section className="relative overflow-hidden bg-gray-100 pb-24 pt-42 text-text lg:pt-46">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
              {s.heroBadge as string}
            </div>
            <h1 className="mb-8 text-6xl leading-[0.95] font-bold tracking-tighter lg:text-8xl">
              {s.heroTitleLine1 as string} <br />
              <span className="text-primary italic">{s.heroTitleAccent as string}</span>
            </h1>
            <p className="mb-12 max-w-2xl text-xl font-medium leading-relaxed text-text/50">{s.heroSubtitle as string}</p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-text/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <h2 className="text-5xl leading-none font-bold tracking-tighter text-text uppercase">
                {s.careTitleLead as string} <span className="text-primary italic">{s.careTitleAccent as string}</span>
              </h2>
              <p className="text-lg leading-relaxed text-text/60">{s.careBody as string}</p>

              <div className="relative overflow-hidden rounded-[2rem] bg-gray-100 p-8 text-text group">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
                    <TableIcon size={24} />
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">{s.maintenanceSchemesTitle as string}</h4>
                </div>
                <div className="space-y-4">
                  {maintenanceRows.map((row) => (
                    <div key={row.id} className="flex items-center justify-between border-b border-text/10 py-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-primary">
                          {row.id}
                        </span>
                        <span className="text-sm font-medium">{row.title}</span>
                      </div>
                      <span className="text-xs text-text/40">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              {supportServices.map((service, idx) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group rounded-3xl border border-text/5 bg-text/[0.02] p-8 transition-all hover:border-primary/20"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-text/5 bg-white text-primary transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl">
                    {SUPPORT_ICONS[idx]}
                  </div>
                  <h4 className="mb-3 text-xl font-bold tracking-tight text-text">{service.title}</h4>
                  <p className="text-sm leading-relaxed text-text/50">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-text/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <div className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">{s.methodsEyebrow as string}</div>
            <h2 className="mb-6 text-5xl font-bold tracking-tighter text-text">{s.methodsHeading as string}</h2>
            <p className="font-medium leading-relaxed text-text/60">
              {s.methodsLeadPart1 as string}{' '}
              <span className="font-bold text-primary">{s.methodsLeadAccent1 as string}</span> {s.methodsLeadPart2 as string}{' '}
              <span className="font-bold text-primary">{s.methodsLeadAccent2 as string}</span>
              {s.methodsLeadPart3 as string} <span className="font-bold text-primary">{s.methodsLeadAccent3 as string}</span> {s.methodsLeadPart4 as string}
            </p>
          </div>

          <div className="mb-24 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {methodologies.map((item, index) => (
              <div key={item.id} className="contents">
                <MethodologyCard
                  item={item}
                  index={index}
                  methodologyCardBadge={s.methodologyCardBadge as string}
                />
              </div>
            ))}
          </div>

          <div className="relative grid items-center gap-12 overflow-hidden rounded-[3rem] bg-gray-100 p-12 text-text lg:grid-cols-3">
            <div className="pointer-events-none absolute top-0 right-0 p-12 opacity-5">
              <Cpu size={300} />
            </div>

            <div className="flex h-full flex-col justify-center border-text/10 py-4 lg:col-span-1 lg:border-r lg:pr-12">
              <h4 className="mb-4 text-3xl font-bold tracking-tighter uppercase">{s.estimationRigidnessHeading as string}</h4>
              <p className="text-sm italic leading-relaxed text-text/40">&quot;{s.estimationQuote as string}&quot;</p>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-8 sm:grid-cols-3">
                {estimationMethods.map((m) => (
                  <div key={m.name} className="group space-y-2">
                    <div className="text-2xl font-bold tracking-tighter text-primary transition-transform duration-300 group-hover:translate-x-2">
                      {m.name}
                    </div>
                    <p className="text-[10px] leading-tight font-bold tracking-widest text-text/30 uppercase">{m.full}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-text/5 pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={16} />
                  <span className="text-xs font-bold text-text/60">{s.footerCheckFpa as string}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={16} />
                  <span className="text-xs font-bold text-text/60">{s.footerCheckFrem as string}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-8 rounded-[2.5rem] border border-primary/10 bg-primary/[0.02] p-12">
            <h3 className="text-3xl font-bold tracking-tighter text-text uppercase">{s.closingTitle as string}</h3>
            <p className="text-text/60">{s.closingBody as string}</p>
            <motion.a
              href={CONTACT_US_HASH}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mx-auto flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-5 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-accent"
            >
              {s.closingCTA as string} <ChevronRight size={18} />
            </motion.a>
          </div>
        </div>
      </section>
    </main>
  );
}

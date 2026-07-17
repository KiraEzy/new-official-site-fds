import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Phone, Printer, Mail, MapPin, Clock3, Send } from 'lucide-react';

import { useI18n } from '../i18n/I18nContext';

export type GetInTouchSectionProps = {
  colorProfile: 'default' | 'navy';
  alignContactInfoBottom?: boolean;
};

export default function GetInTouchSection({ colorProfile, alignContactInfoBottom = true }: GetInTouchSectionProps) {
  const { ns } = useI18n();
  const g = ns('getInTouch');
  const addrLines = String(g.addressMultiline).split('|');

  const contactRows: { icon: ReactNode; label: string; value: ReactNode }[] = [
    {
      icon: <Phone size={20} />,
      label: g.labelPhone as string,
      value: g.valuePhone as string
    },
    {
      icon: <Printer size={20} />,
      label: g.labelFax as string,
      value: g.valueFax as string
    },
    {
      icon: <Mail size={20} />,
      label: g.labelEmail as string,
      value: g.valueEmail as string
    },
    {
      icon: <MapPin size={20} />,
      label: g.labelAddress as string,
      value: (
        <>
          {addrLines.map((line, i) => (
            <span key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </>
      )
    },
    {
      icon: <Clock3 size={20} />,
      label: g.labelOfficeHours as string,
      value: g.officeHoursLong as string
    }
  ];

  return (
    <section className="relative -mt-px overflow-hidden bg-[#f6fbff] px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(17,184,245,0.14),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(81,78,247,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)]" />
      <div className="absolute inset-0 opacity-55 bg-[linear-gradient(rgba(1,20,26,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(1,20,26,0.035)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex h-full flex-col"
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-primary">{g.eyebrow as string}</p>
          <h2 className="text-5xl font-bold tracking-tight text-text md:text-7xl">{g.title as string}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text/60">{g.lead as string}</p>

          <div className={`space-y-0 transition-all duration-300 ${alignContactInfoBottom ? 'lg:mt-auto' : ''}`}>
            {contactRows.map((item) => (
              <div key={item.label} className="flex gap-4 border-b border-text/10 py-5 last:border-b-0">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 text-primary">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-text/35">{item.label}</p>
                  <div className="mt-1 text-base font-semibold leading-relaxed text-text">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-[0_32px_110px_rgba(17,184,245,0.16)] backdrop-blur-xl md:p-8 lg:p-10"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

          <form className="relative z-10 space-y-5" onSubmit={(event) => event.preventDefault()}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-primary">{g.sendEyebrow as string}</p>
              <h3 className="mt-2 text-3xl font-bold tracking-tight text-text">{g.formTitle as string}</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text/70">{g.fieldName as string}</span>
                <input
                  type="text"
                  placeholder={g.placeholderName as string}
                  className="h-13 w-full rounded-2xl border border-text/10 bg-white px-4 text-sm font-medium text-text outline-none transition-all placeholder:text-text/30 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(17,184,245,0.12)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text/70">{g.fieldEmail as string}</span>
                <input
                  type="email"
                  placeholder={g.placeholderEmail as string}
                  className="h-13 w-full rounded-2xl border border-text/10 bg-white px-4 text-sm font-medium text-text outline-none transition-all placeholder:text-text/30 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(17,184,245,0.12)]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text/70">{g.fieldCompany as string}</span>
              <input
                type="text"
                placeholder={g.placeholderCompany as string}
                className="h-13 w-full rounded-2xl border border-text/10 bg-white px-4 text-sm font-medium text-text outline-none transition-all placeholder:text-text/30 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(17,184,245,0.12)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text/70">{g.fieldMessage as string}</span>
              <textarea
                placeholder={g.placeholderMessage as string}
                rows={5}
                className="w-full resize-none rounded-2xl border border-text/10 bg-white px-4 py-4 text-sm font-medium text-text outline-none transition-all placeholder:text-text/30 focus:border-primary/50 focus:shadow-[0_0_0_4px_rgba(17,184,245,0.12)]"
              />
            </label>

            <button
              type="submit"
              className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-interactive px-6 font-bold text-white shadow-[0_18px_45px_rgba(17,184,245,0.28)] transition-all duration-300 ${
                colorProfile === 'default'
                  ? 'hover:bg-[#0a1f44] hover:shadow-[0_22px_55px_rgba(10,31,68,0.38)]'
                  : 'hover:bg-accent hover:shadow-[0_22px_55px_rgba(81,78,247,0.28)]'
              }`}
            >
              {g.submitSend as string}
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

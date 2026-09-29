import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { ribbonControlRanges, type RibbonSetting, type RibbonSettings } from './ribbonSettings';

type RibbonControlsProps = {
  settings: RibbonSettings;
  onChange: (key: RibbonSetting, value: number) => void;
  onReset: () => void;
  paused: boolean;
  onTogglePause: () => void;
  reducedMotion: boolean;
};

function settingLabel(key: RibbonSetting, value: number) {
  if (key === 'riverOpacity') return `${Math.round(value * 100)}%`;
  if (key === 'riverLength') return `${value / 10}%`;
  if (key === 'riverWidth') return `${value.toFixed(1)} px`;
  if (key === 'riverDensity') return String(value);
  return `${Number(value.toFixed(2))}×`;
}

export function RibbonControls({ settings, onChange, onReset, paused, onTogglePause, reducedMotion }: RibbonControlsProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const slider = (key: RibbonSetting) => {
    const range = ribbonControlRanges[key];
    return <label key={key} className="ribbon-control-slider">
      <span>{t(`home.ribbonControls.${key}`)}<output htmlFor={`ribbon-setting-${key}`}>{settingLabel(key, settings[key])}</output></span>
      <input
        id={`ribbon-setting-${key}`}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={settings[key]}
        aria-label={t(`home.ribbonControls.${key}`)}
        aria-valuetext={settingLabel(key, settings[key])}
        onChange={event => onChange(key, Number(event.target.value))}
      />
    </label>;
  };

  return <div className="ribbon-tuning" ref={containerRef}
    onWheel={event => event.stopPropagation()}
    onTouchStart={event => event.stopPropagation()}
    onTouchEnd={event => event.stopPropagation()}
    onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      close();
    }
  }}>
    {open && <section id="ribbon-controls-panel" className="ribbon-controls-panel" aria-labelledby="ribbon-controls-title">
      <div className="ribbon-controls-heading">
        <h2 id="ribbon-controls-title">{t('home.ribbonControls.title')}</h2>
        <button type="button" onClick={close} aria-label={t('home.ribbonControls.close')}><X size={17} aria-hidden="true" /></button>
      </div>
      <p className="ribbon-controls-note">{t('home.ribbonControls.saved')}</p>
      {reducedMotion && <p className="ribbon-controls-notice">{t('home.ribbonControls.reducedMotion')}</p>}
      <fieldset>
        <legend>{t('home.ribbonControls.ribbon')}</legend>
        {slider('movement')}
        {slider('ribbonSpeed')}
      </fieldset>
      <fieldset>
        <legend>{t('home.ribbonControls.river')}</legend>
        {slider('riverSpeed')}
        {slider('riverOpacity')}
        {slider('riverWidth')}
        {slider('riverDensity')}
        {slider('riverLength')}
      </fieldset>
      <button type="button" className="ribbon-controls-reset" onClick={onReset}><RotateCcw size={13} aria-hidden="true" />{t('home.ribbonControls.reset')}</button>
    </section>}
    <div className="ribbon-controls-toolbar">
      {!reducedMotion && <button type="button" className="ribbon-motion-toggle" onClick={onTogglePause}
        aria-label={t(paused ? 'home.heroRibbonPlay' : 'home.heroRibbonPause')}
        title={t(paused ? 'home.heroRibbonPlay' : 'home.heroRibbonPause')}>
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>}
      <button ref={triggerRef} type="button" className="ribbon-controls-trigger" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="ribbon-controls-panel">
        <SlidersHorizontal size={15} aria-hidden="true" />{t('home.ribbonControls.title')}
      </button>
    </div>
  </div>;
}

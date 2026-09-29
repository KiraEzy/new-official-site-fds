import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useInView, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { HomeHero } from './HomeHero';
import { useI18n } from '../i18n/I18nContext';
import { CONTACT_US_HASH } from '../content/pageHashes';
import { ribbonEdges, ribbonFiber, ribbonOutline } from './ribbonGeometry';
import { RibbonControls } from './RibbonControls';
import { defaultRibbonSettings, readRibbonSettings, RIBBON_SETTINGS_KEY, type RibbonSettings } from './ribbonSettings';
import { RibbonStrip } from './RibbonStrip';
import { DEFAULT_RIBBON_STRIP_MODE, type RibbonStripMode } from './ribbonStripMode';
import './HomeHeroRibbon.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

const backOutline = ribbonOutline(ribbonEdges.back);
const frontOutline = ribbonOutline(ribbonEdges.front);
const tailOutline = ribbonOutline(ribbonEdges.tail);

/** Long, staggered highlights travel downstream along the existing fiber curves. */
function ribbonCurrent(path: string, index: number, speed: number) {
  return <path
    key={index}
    className="ribbon-current"
    d={path}
    pathLength={1000}
    style={{ animationDuration: `${(24 + index % 5 * 1.5) / speed}s`, animationDelay: `${-(index * .618 % 1) * (24 + index % 5 * 1.5) / speed}s` }}
  />;
}

/** Local vector artwork: layered silk ribbons, with fine fibers following the folds. */
function RibbonArtwork({ paused, reducedMotion, settings, cursorX, cursorY }: { paused: boolean; reducedMotion: boolean; settings: RibbonSettings; cursorX: MotionValue<number>; cursorY: MotionValue<number> }) {
  const artworkRef = useRef<SVGSVGElement>(null);
  const inView = useInView(artworkRef);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const motionState = reducedMotion ? 'static' : paused || !inView || !pageVisible ? 'paused' : 'running';
  const backCount = Math.round(settings.riverDensity * 7 / 6);
  const frontCount = settings.riverDensity;
  const tailCount = Math.round(settings.riverDensity * 5 / 6);
  const artworkStyle = {
    '--ribbon-drift-x': `${-10 * settings.movement}px`,
    '--ribbon-drift-y': `${-6 * settings.movement}px`,
    '--ribbon-drift-scale': 1 + .025 * settings.movement,
    '--ribbon-back-rotation': `${-1.6 * settings.movement}deg`,
    '--ribbon-back-skew': `${1.2 * settings.movement}deg`,
    '--ribbon-front-x': `${13 * settings.movement}px`,
    '--ribbon-front-rotation': `${1.3 * settings.movement}deg`,
    '--ribbon-tail-rotation': `${-2 * settings.movement}deg`,
    '--ribbon-tail-scale': 1 + .045 * settings.movement,
    '--ribbon-drift-duration': `${20 / settings.ribbonSpeed}s`,
    '--ribbon-back-duration': `${16 / settings.ribbonSpeed}s`,
    '--ribbon-front-duration': `${13 / settings.ribbonSpeed}s`,
    '--ribbon-tail-duration': `${17 / settings.ribbonSpeed}s`,
    '--river-opacity': settings.riverOpacity,
    '--river-width': settings.riverWidth,
    '--river-dashes': `${settings.riverLength} ${500 - settings.riverLength}`,
  } as CSSProperties;

  return (
    <motion.div className="ribbon-cursor-layer" style={{ x: cursorX, y: cursorY }}>
    <svg ref={artworkRef} className="ribbon-art" style={artworkStyle} data-motion={motionState} viewBox="0 0 1131 627" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ribbon-back" x1="0" y1="0.6" x2="1" y2="0.15" gradientUnits="objectBoundingBox">
          <stop stopColor="#e7f7ff" /><stop offset=".21" stopColor="#acd3fb" /><stop offset=".45" stopColor="#d1b6fa" />
          <stop offset=".66" stopColor="#fb91ef" /><stop offset=".83" stopColor="#ff73db" /><stop offset="1" stopColor="#ffb848" />
        </linearGradient>
        <linearGradient id="ribbon-tail" x1="0" y1="1" x2="1" y2=".45">
          <stop stopColor="#7163f1" /><stop offset=".3" stopColor="#b484f5" /><stop offset=".53" stopColor="#ffd071" />
          <stop offset=".8" stopColor="#ffa19a" /><stop offset="1" stopColor="#ff83dc" />
        </linearGradient>
        <linearGradient id="ribbon-face" x1="0" y1=".55" x2="1" y2=".3">
          <stop stopColor="#fff0b4" /><stop offset=".08" stopColor="#ffb62e" /><stop offset=".37" stopColor="#ff9c04" />
          <stop offset=".59" stopColor="#ffa835" /><stop offset=".75" stopColor="#ff946b" /><stop offset=".91" stopColor="#f780c7" /><stop offset="1" stopColor="#b77af2" />
        </linearGradient>
        <linearGradient id="ribbon-edge"><stop stopColor="#fff4c5" /><stop offset=".45" stopColor="#ffd7a1" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <filter id="ribbon-soft"><feGaussianBlur stdDeviation="1.8" /></filter>
        <clipPath id="ribbon-back-clip"><path d={backOutline} /></clipPath>
        <clipPath id="ribbon-face-clip"><path d={frontOutline} /></clipPath>
        <clipPath id="ribbon-tail-clip"><path d={tailOutline} /></clipPath>
      </defs>
      <g className="ribbon-layer-back">
        <path filter="url(#ribbon-soft)" fill="url(#ribbon-back)" d={backOutline} />
        <g clipPath="url(#ribbon-back-clip)" fill="none" strokeWidth=".6">
          {Array.from({ length: 48 }, (_, i) => <path key={i} opacity=".045" stroke="#a8a3d4" d={ribbonFiber(ribbonEdges.back, (i + .5) / 48)} />)}
          {Array.from({ length: backCount }, (_, i) => ribbonCurrent(ribbonFiber(ribbonEdges.back, (i + .5) / backCount), i, settings.riverSpeed))}
        </g>
      </g>
      <g className="ribbon-layer-tail">
        <path filter="url(#ribbon-soft)" fill="url(#ribbon-tail)" d={tailOutline} />
        <g clipPath="url(#ribbon-tail-clip)" fill="none">
          {Array.from({ length: tailCount }, (_, i) => ribbonCurrent(ribbonFiber(ribbonEdges.tail, (i + .5) / tailCount), i + 7, settings.riverSpeed))}
        </g>
      </g>
      <g className="ribbon-layer-front">
        <g filter="url(#ribbon-soft)">
          <path fill="url(#ribbon-face)" d={frontOutline} />
          <path fill="url(#ribbon-edge)" opacity=".72" d="M475 -55 C611 130 829 164 866 325 C889 425 846 569 836 665 L824 667 C837 555 880 418 858 328 C825 159 605 125 461 -70Z" />
        </g>
        <g clipPath="url(#ribbon-face-clip)" fill="none" strokeWidth=".7">
          {Array.from({ length: 40 }, (_, i) => <path key={i} opacity=".055" stroke="#e8a081" d={ribbonFiber(ribbonEdges.front, (i + .5) / 40)} />)}
          {Array.from({ length: frontCount }, (_, i) => ribbonCurrent(ribbonFiber(ribbonEdges.front, (i + .5) / frontCount), i + 3, settings.riverSpeed))}
        </g>
      </g>
    </svg>
    </motion.div>
  );
}

export function HomeHeroRibbon({
  heroRef,
  heroNavPortalRef,
  title,
  lead,
  ctaSecondary,
  onDiscoverClick,
  stripMode = DEFAULT_RIBBON_STRIP_MODE
}: ComponentProps<typeof HomeHero> & { stripMode?: RibbonStripMode }) {
  const { t } = useI18n();
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState(readRibbonSettings);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springCursorX = useSpring(cursorX, { stiffness: 95, damping: 24, mass: .8 });
  const springCursorY = useSpring(cursorY, { stiffness: 95, damping: 24, mass: .8 });

  useEffect(() => {
    if (reducedMotion) {
      cursorX.set(0);
      cursorY.set(0);
    }
  }, [cursorX, cursorY, reducedMotion]);

  const updateCursorPosition = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse' || (event.target as Element).closest('.ribbon-tuning')) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    cursorX.set(normalizedX * 10 * settings.movement);
    cursorY.set(normalizedY * 6 * settings.movement);
  };

  const resetCursorPosition = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') {
      cursorX.set(0);
      cursorY.set(0);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(RIBBON_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Live controls still work when browser storage is unavailable.
    }
  }, [settings]);

  const heading = title.replace(/\s*\n\s*/g, ' ');
  const eyebrow = (
    <p className="ribbon-eyebrow">{t('home.heroAlternativeEyebrow')}<span>{t('home.statYearsValue')} {t('home.statYearsLabel')}</span></p>
  );
  const actions = (
    <div className="ribbon-actions">
      <button type="button" className="ribbon-button" onClick={onDiscoverClick}>{ctaSecondary}<ArrowRight size={15} aria-hidden="true" /></button>
      <a className="ribbon-button ribbon-button-secondary" href={CONTACT_US_HASH}>{t('nav.contactUs')}<ArrowRight size={15} aria-hidden="true" /></a>
    </div>
  );

  return (
    <section
      ref={heroRef}
      className="ribbon-hero"
      data-home-hero="ribbon"
      data-ribbon-strip={stripMode}
      aria-labelledby="ribbon-hero-title"
      onPointerMove={updateCursorPosition}
      onPointerLeave={resetCursorPosition}
    >
      <div ref={heroNavPortalRef} className="ribbon-hero-nav pointer-events-none absolute inset-x-0 top-0 z-[60]" />
      <div className="ribbon-copy">
        <div className="ribbon-content">
          {eyebrow}
          <h1 id="ribbon-hero-title" className="ribbon-title">{heading}</h1>
          <p className="ribbon-lead">{lead}</p>
          {actions}
        </div>
        <div className="ribbon-blend-group" aria-hidden="true" inert>
          <RibbonArtwork paused={paused} reducedMotion={reducedMotion} settings={settings} cursorX={springCursorX} cursorY={springCursorY} />
          <div className="ribbon-content">
            {eyebrow}
            <div className="ribbon-title">{heading}</div>
            <p className="ribbon-lead">{lead}</p>
            {actions}
          </div>
        </div>
      </div>
      <RibbonStrip mode={stripMode} />
      <RibbonControls
        settings={settings}
        onChange={(key, value) => setSettings(previous => ({ ...previous, [key]: value }))}
        onReset={() => { setSettings({ ...defaultRibbonSettings }); setPaused(false); }}
        paused={paused}
        onTogglePause={() => setPaused(value => !value)}
        reducedMotion={reducedMotion}
      />
    </section>
  );
}

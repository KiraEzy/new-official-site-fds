import { motion, useSpring, useMotionValue } from 'motion/react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';

const SPOTLIGHT_RADIUS_PX = 118;

/** Matches profile hero chrome (`bg-text/3`): paint over cyan fill inside the spotlight without masking glyphs (avoids WebKit cropping italic tails). */
const HERO_SURFACE_KNOCKOUT =
  'color-mix(in srgb, var(--color-text, #01141a) 4%, var(--color-background, #f9fdff))';

export function HeroSimplifyAndExcellenceSpot({
  simplifyWord,
  excellenceWord
}: {
  simplifyWord: string;
  excellenceWord: string;
}) {
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
  }, [layoutMeasure, simplifyWord, excellenceWord]);

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

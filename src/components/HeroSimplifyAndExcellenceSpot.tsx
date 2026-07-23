import { motion, useSpring, useMotionValue } from 'motion/react';
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type Ref
} from 'react';

const SPOTLIGHT_RADIUS_PX = 118;
/** Soft rim — core stays opaque; rim fades so the disc isn’t a hard white ring. */
const SPOTLIGHT_FEATHER_PX = 36;
/**
 * Extra paint box around the Excellence gold layer. `mask-image` clips overflow
 * (including text-shadow) to the element box — without this pad the glow becomes
 * a hard rectangle inside the soft circular mask.
 */
const EXCELLENCE_SHADOW_PAD_PX = 64;

/** Matches the white glow under Simplify: paint over cyan fill inside the spotlight without masking glyphs. */
const HERO_SURFACE_KNOCKOUT = '#ffffff';

function featheredSpotlightMask(x: number, y: number) {
  const r = SPOTLIGHT_RADIUS_PX;
  const hardCore = Math.max(0, r - SPOTLIGHT_FEATHER_PX);
  const mid = hardCore + SPOTLIGHT_FEATHER_PX * 0.45;
  return `radial-gradient(circle ${r}px at ${x}px ${y}px, #000 0px, #000 ${hardCore}px, rgba(0,0,0,0.45) ${mid}px, transparent ${r}px)`;
}

function featheredWhiteKnockout() {
  const r = SPOTLIGHT_RADIUS_PX;
  const hardCore = Math.max(0, r - SPOTLIGHT_FEATHER_PX);
  const mid = hardCore + SPOTLIGHT_FEATHER_PX * 0.45;
  return `radial-gradient(circle ${r}px at 50% 50%, ${HERO_SURFACE_KNOCKOUT} 0px, ${HERO_SURFACE_KNOCKOUT} ${hardCore}px, rgba(255,255,255,0.45) ${mid}px, transparent ${r}px)`;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else ref.current = value;
}

export function HeroSimplifyAndExcellenceSpot({
  simplifyWord,
  excellenceWord,
  simplifyAnchorRef
}: {
  simplifyWord: string;
  excellenceWord: string;
  simplifyAnchorRef?: Ref<HTMLElement | null>;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const simplifyRootRef = useRef<HTMLSpanElement>(null);
  const excellenceRef = useRef<HTMLSpanElement>(null);
  const goldLayerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const geomRef = useRef({ sx: 0, sy: 0, ex: 0, ey: 0 });

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const [simpStrokeMask, setSimpStrokeMask] = useState(() => featheredSpotlightMask(-500, -500));
  const [excGoldMask, setExcGoldMask] = useState(() => featheredSpotlightMask(-500, -500));
  const [knockPos, setKnockPos] = useState({ x: -500, y: -500 });
  const [borderBoxPx, setBorderBoxPx] = useState<number | undefined>(undefined);
  const [padLeftPx, setPadLeftPx] = useState<number | undefined>(undefined);
  const [padRightPx, setPadRightPx] = useState<number | undefined>(undefined);
  const strokeLayerRef = useRef<HTMLSpanElement>(null);

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
    // Italic “y” overhangs the right; keep extra end slack so mask/stroke don’t clip it.
    const padLeft = Math.max(28, Math.round(h * 0.16));
    const padRight = Math.max(88, Math.round(h * 0.48));
    setBorderBoxPx(Math.ceil(w + padLeft + padRight));
    setPadLeftPx(padLeft);
    setPadRightPx(padRight);
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
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      const g = geomRef.current;
      const x = springX.get();
      const y = springY.get();
      const clientX = wr.left + x;
      const clientY = wr.top + y;

      setKnockPos({ x: x - g.sx, y: y - g.sy });

      // Measure the stroke layer itself (includes end padding) so the mask tracks the cursor.
      const stroke = strokeLayerRef.current;
      if (stroke) {
        const sr = stroke.getBoundingClientRect();
        setSimpStrokeMask(featheredSpotlightMask(clientX - sr.left, clientY - sr.top));
      } else {
        setSimpStrokeMask(featheredSpotlightMask(x - g.sx, y - g.sy));
      }

      // Measure the gold layer itself so padding expansion can’t left-shift the mask.
      const gold = goldLayerRef.current;
      if (gold) {
        const gr = gold.getBoundingClientRect();
        setExcGoldMask(featheredSpotlightMask(clientX - gr.left, clientY - gr.top));
      }
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
        ref={(el) => {
          simplifyRootRef.current = el;
          assignRef(simplifyAnchorRef, el);
        }}
        className="group/simplify relative isolate box-border inline-grid w-max max-w-none shrink-0 justify-items-center justify-self-center overflow-visible [grid-template-columns:auto] [grid-template-rows:auto]"
        style={
          borderBoxPx != null && padLeftPx != null && padRightPx != null
            ? {
                boxSizing: 'border-box',
                minWidth: borderBoxPx,
                // Extra end-pad for italic “y” would optically left-shift the glyphs when the
                // box is centered — nudge right by half the pad imbalance.
                transform: `translateX(${((padRightPx - padLeftPx) / 2) * 0.6}px)`
              }
            : borderBoxPx != null
              ? {
                  boxSizing: 'border-box',
                  minWidth: borderBoxPx
                }
              : undefined
        }
      >
        <span
          ref={measureRef}
          className="invisible col-start-1 row-start-1 box-content mx-auto inline-block max-w-none select-none whitespace-nowrap font-bold italic tracking-tight"
          style={
            padLeftPx != null && padRightPx != null
              ? { paddingLeft: padLeftPx, paddingRight: padRightPx }
              : undefined
          }
          aria-hidden
        >
          {simplifyWord}
        </span>

        <span
          className="relative z-0 col-start-1 row-start-1 box-content mx-auto inline-block max-w-none overflow-visible text-center text-primary italic font-bold tracking-tight"
          style={
            padLeftPx != null && padRightPx != null
              ? { paddingLeft: padLeftPx, paddingRight: padRightPx }
              : undefined
          }
        >
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
            background: featheredWhiteKnockout()
          }}
        />

        <motion.span
          ref={strokeLayerRef}
          className="pointer-events-none col-start-1 row-start-1 z-[2] mx-auto box-content inline-block max-w-none overflow-visible text-center italic font-bold tracking-tight text-transparent"
          style={{
            ...(padLeftPx != null && padRightPx != null
              ? { paddingLeft: padLeftPx, paddingRight: padRightPx }
              : null),
            WebkitMaskImage: simpStrokeMask,
            maskImage: simpStrokeMask,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
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
          ref={goldLayerRef}
          aria-hidden
          className="pointer-events-none absolute z-0 block text-center font-bold text-transparent"
          style={{
            // Expand the box so text-shadow isn’t clipped to a hard rectangle by mask-image.
            left: -EXCELLENCE_SHADOW_PAD_PX,
            right: -EXCELLENCE_SHADOW_PAD_PX,
            top: -EXCELLENCE_SHADOW_PAD_PX,
            padding: EXCELLENCE_SHADOW_PAD_PX,
            WebkitMaskImage: excGoldMask,
            maskImage: excGoldMask,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
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

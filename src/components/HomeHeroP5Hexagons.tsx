import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import type { LatticeHeroMode, LatticeTuning } from './homeHeroTypes';

type HexCell = {
  cx: number;
  cy: number;
  x: number;
  y: number;
};

/**
 * p5 hero: hex lattice with several cursor-driven interaction modes.
 * Tuning is read live via ref so demo sliders update without remounting.
 */
export function HomeHeroP5Hexagons({
  className,
  mode,
  tuning,
  frostedGlass = false
}: {
  className?: string;
  mode: LatticeHeroMode;
  tuning: LatticeTuning;
  /** CSS backdrop-filter cannot blur canvas in Chromium — draw frost in-canvas instead. */
  frostedGlass?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tuningRef = useRef(tuning);
  tuningRef.current = tuning;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const frostRef = useRef(frostedGlass);
  frostRef.current = frostedGlass;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let instance: p5 | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const prefersReducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    void import('p5').then(({ default: P5 }) => {
      if (cancelled || !hostRef.current) return;

      instance = new P5((p: p5) => {
        let cells: HexCell[] = [];
        let builtHexWidth = -1;
        let pointerX = -9999;
        let pointerY = -9999;
        let pointerInside = false;
        const seed = Math.floor(Math.random() * 1_000_000);
        type Wave = { x: number; y: number; born: number };
        type TrailSample = { x: number; y: number; born: number };
        let waves: Wave[] = [];
        let trail: TrailSample[] = [];
        let lastPointerX = pointerX;
        let lastPointerY = pointerY;

        const onPointerMove = (event: PointerEvent) => {
          const el = hostRef.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          pointerInside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          if (!pointerInside) {
            pointerX = -9999;
            pointerY = -9999;
            return;
          }
          pointerX = event.clientX - rect.left;
          pointerY = event.clientY - rect.top;

          const moved = Math.hypot(pointerX - lastPointerX, pointerY - lastPointerY) > 6;
          if (
            moved &&
            modeRef.current === 'ripple' &&
            !prefersReducedMotion()
          ) {
            waves.push({ x: pointerX, y: pointerY, born: p.millis() });
            waves = waves.slice(-4);
          }
          lastPointerX = pointerX;
          lastPointerY = pointerY;
        };

        const onPointerLeaveWindow = () => {
          pointerInside = false;
          pointerX = -9999;
          pointerY = -9999;
          lastPointerX = pointerX;
          lastPointerY = pointerY;
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('blur', onPointerLeaveWindow);

        const rebuild = (hexWidth: number) => {
          if (p.width < 8 || p.height < 8) return;
          p.randomSeed(seed);

          const hexRadius = hexWidth;
          builtHexWidth = hexWidth;

          const w = hexRadius * 2;
          const h = Math.sqrt(3) * hexRadius;
          const colStep = w * 0.75;
          const rowStep = h;

          cells = [];
          const cols = Math.ceil(p.width / colStep) + 3;
          const rows = Math.ceil(p.height / rowStep) + 3;

          for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
              const cx = col * colStep;
              const cy = row * rowStep + (col % 2 === 0 ? 0 : h * 0.5);
              cells.push({ cx, cy, x: cx, y: cy });
            }
          }
        };

        const syncSize = () => {
          const el = hostRef.current;
          if (!el) return false;
          const w = Math.max(1, Math.floor(el.clientWidth));
          const h = Math.max(1, Math.floor(el.clientHeight));
          const hexWidth = tuningRef.current.hexWidth;
          const sizeChanged = w !== p.width || h !== p.height;
          if (!sizeChanged && cells.length > 0 && builtHexWidth === hexWidth) return true;
          if (sizeChanged) p.resizeCanvas(w, h);
          rebuild(hexWidth);
          return cells.length > 0;
        };

        p.setup = () => {
          // Keep canvas CSS pixels 1:1 so frost geometry matches the HTML panel.
          p.pixelDensity(1);
          const w = Math.max(1, host.clientWidth);
          const h = Math.max(1, host.clientHeight);
          const canvas = p.createCanvas(w, h);
          canvas.parent(host);
          canvas.style('display', 'block');
          canvas.style('width', '100%');
          canvas.style('height', '100%');
          p.noStroke();
          rebuild(tuningRef.current.hexWidth);
          requestAnimationFrame(() => {
            if (!cancelled) syncSize();
          });
        };

        p.draw = () => {
          const t = tuningRef.current;
          const currentMode = modeRef.current;
          const reduceMotion = prefersReducedMotion();
          if (cells.length === 0 || builtHexWidth !== t.hexWidth) syncSize();

          p.background(255);
          const baseDotR = Math.max(1.05, t.hexWidth * 0.032);
          const baseGrey = Math.round(t.grey);
          p.noStroke();

          if (currentMode === 'ripple') {
            waves = reduceMotion
              ? []
              : waves.filter((wave) => (p.millis() - wave.born) / 1000 <= 0.85);
          } else {
            waves = [];
          }

          if (currentMode === 'paint') {
            if (!reduceMotion && pointerInside) {
              trail.push({ x: pointerX, y: pointerY, born: p.millis() });
              trail = trail.slice(-Math.max(1, Math.round(t.trailLength)));
            }
            trail = reduceMotion
              ? []
              : trail.filter((sample) => (p.millis() - sample.born) / 1000 <= 0.7);
          } else {
            trail = [];
          }

          const linkedCells = new Set<HexCell>();
          if (currentMode === 'connect' && !reduceMotion && pointerInside) {
            const linkCount = Math.min(6, Math.max(3, Math.round(t.linkCount)));
            const nearest = [...cells]
              .sort(
                (a, b) =>
                  Math.hypot(a.cx - pointerX, a.cy - pointerY) -
                  Math.hypot(b.cx - pointerX, b.cy - pointerY)
              )
              .slice(0, linkCount);
            p.stroke(baseGrey, baseGrey, baseGrey, 120);
            p.strokeWeight(1);
            for (const cell of nearest) {
              linkedCells.add(cell);
              p.line(pointerX, pointerY, cell.cx, cell.cy);
            }
            p.noStroke();
          }

          for (const cell of cells) {
            let scale = 1;
            let grey = baseGrey;

            if (currentMode === 'magnetic') {
              let targetX = cell.cx;
              let targetY = cell.cy;
              if (!reduceMotion && pointerInside) {
                const dx = pointerX - cell.cx;
                const dy = pointerY - cell.cy;
                const distance = Math.hypot(dx, dy);
                if (distance > 0.001 && distance < t.influenceRadius) {
                  const progress = 1 - distance / t.influenceRadius;
                  const falloff = progress * progress * (3 - 2 * progress);
                  const pull = t.hexWidth * t.attraction * falloff;
                  targetX = cell.cx + (dx / distance) * pull;
                  targetY = cell.cy + (dy / distance) * pull;
                }
              }
              if (reduceMotion) {
                cell.x = cell.cx;
                cell.y = cell.cy;
              } else {
                cell.x += (targetX - cell.x) * 0.16;
                cell.y += (targetY - cell.y) * 0.16;
              }
              p.fill(grey, grey, grey);
              p.circle(cell.x, cell.y, baseDotR * 2);
              continue;
            }

            cell.x = cell.cx;
            cell.y = cell.cy;

            if (currentMode === 'ripple' && !reduceMotion) {
              for (const wave of waves) {
                const age = (p.millis() - wave.born) / 1000;
                const radius = age * (t.influenceRadius * 1.2);
                const ringWidth = t.hexWidth * 0.9;
                const distance = Math.hypot(cell.cx - wave.x, cell.cy - wave.y);
                const band = 1 - Math.abs(distance - radius) / ringWidth;
                if (band > 0) {
                  scale = Math.max(scale, 1 + band * t.waveStrength * 0.85);
                  grey = Math.min(grey, baseGrey - band * t.waveStrength * 55);
                }
              }
            } else if (currentMode === 'spotlight' && !reduceMotion && pointerInside) {
              const distance = Math.hypot(pointerX - cell.cx, pointerY - cell.cy);
              if (distance < t.influenceRadius) {
                const falloff = 1 - distance / t.influenceRadius;
                const strength = falloff * falloff * (3 - 2 * falloff) * t.densifyStrength;
                scale = 1 + strength * 1.35;
                grey = Math.round(baseGrey - strength * 70);
              }
            } else if (currentMode === 'connect' && linkedCells.has(cell)) {
              scale = 1.35;
            } else if (currentMode === 'paint' && !reduceMotion) {
              let brightness = 0;
              for (const sample of trail) {
                const distance = Math.hypot(cell.cx - sample.x, cell.cy - sample.y);
                const influenceRadius = t.hexWidth * 1.1;
                if (distance < influenceRadius) {
                  const proximity = 1 - distance / influenceRadius;
                  const age = (p.millis() - sample.born) / 1000;
                  const ageFade = Math.max(0, 1 - age / 0.7);
                  brightness = Math.max(brightness, t.trailBrightness * ageFade * proximity);
                }
              }
              grey = baseGrey - brightness * 90;
              scale = 1 + brightness * 0.6;
            }

            p.fill(grey, grey, grey);
            p.circle(cell.cx, cell.cy, baseDotR * 2 * scale);
          }

          // Chromium will not backdrop-blur HTML canvas pixels. Simulate frost in-canvas
          // under the HTML copy panel so lattice heroes match soft-sky glass.
          if (frostRef.current) {
            const canvasEl =
              (hostRef.current?.querySelector('canvas') as HTMLCanvasElement | null) ?? undefined;
            const frostEl = hostRef.current
              ?.closest('section')
              ?.querySelector('.home-hero-frost') as HTMLElement | null;
            if (canvasEl && frostEl) {
              const canvasRect = canvasEl.getBoundingClientRect();
              const frostRect = frostEl.getBoundingClientRect();
              const sx = p.width / Math.max(1, canvasRect.width);
              const sy = p.height / Math.max(1, canvasRect.height);
              const fx = (frostRect.left - canvasRect.left) * sx;
              const fy = (frostRect.top - canvasRect.top) * sy;
              const fw = frostRect.width * sx;
              const fh = frostRect.height * sy;
              const radius = 32 * Math.min(sx, sy);
              const ctx = p.drawingContext as CanvasRenderingContext2D;

              ctx.save();
              p.noStroke();

              const r = radius;
              ctx.beginPath();
              ctx.moveTo(fx + r, fy);
              ctx.arcTo(fx + fw, fy, fx + fw, fy + fh, r);
              ctx.arcTo(fx + fw, fy + fh, fx, fy + fh, r);
              ctx.arcTo(fx, fy + fh, fx, fy, r);
              ctx.arcTo(fx, fy, fx + fw, fy, r);
              ctx.closePath();
              ctx.clip();

              // Soft veil (not opaque) + bloomed dots = frosted lattice look.
              p.fill(255, 255, 255, 55);
              p.rect(fx, fy, fw, fh, radius);

              for (const cell of cells) {
                const dx = cell.x;
                const dy = cell.y;
                if (dx < fx - 12 || dx > fx + fw + 12 || dy < fy - 12 || dy > fy + fh + 12) continue;
                const g = Math.round(tuningRef.current.grey);
                p.noStroke();
                p.fill(g, g, g, 40);
                p.circle(dx, dy, baseDotR * 10);
                p.fill(g, g, g, 80);
                p.circle(dx, dy, baseDotR * 5);
                p.fill(g, g, g, 150);
                p.circle(dx, dy, baseDotR * 2.2);
              }

              p.fill(255, 255, 255, 28);
              p.rect(fx, fy, fw, fh, radius);
              ctx.restore();
            }
          }
        };

        p.windowResized = () => {
          syncSize();
        };

        (p as p5 & { __cleanupMagnet?: () => void }).__cleanupMagnet = () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('blur', onPointerLeaveWindow);
        };
      }, host);

      resizeObserver = new ResizeObserver(() => {
        instance?.windowResized();
      });
      resizeObserver.observe(host);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      const cleanup = (instance as (p5 & { __cleanupMagnet?: () => void }) | null)?.__cleanupMagnet;
      cleanup?.();
      instance?.remove();
      instance = null;
    };
  }, [mode]);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      data-hero-p5-hexagon
      data-hero-lattice-mode={mode}
      style={{ backgroundColor: '#ffffff', pointerEvents: 'none' }}
    />
  );
}

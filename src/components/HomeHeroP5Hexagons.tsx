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
 * p5 hero: hex lattice of light grey dots with magnetic cursor nudge.
 * Tuning is read live via ref so demo sliders update without remounting.
 */
export function HomeHeroP5Hexagons({
  className,
  mode: _mode,
  tuning
}: {
  className?: string;
  key?: string;
  mode: LatticeHeroMode;
  tuning: LatticeTuning;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tuningRef = useRef(tuning);
  tuningRef.current = tuning;

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
        };

        const onPointerLeaveWindow = () => {
          pointerInside = false;
          pointerX = -9999;
          pointerY = -9999;
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
          const { grey, influenceRadius, attraction, hexWidth } = tuningRef.current;
          if (cells.length === 0 || builtHexWidth !== hexWidth) syncSize();

          p.background(255);
          const dotR = Math.max(1.05, hexWidth * 0.032);
          const g = Math.round(grey);
          p.fill(g, g, g);
          p.noStroke();

          const reduceMotion = prefersReducedMotion();
          const influence = influenceRadius;
          const maxPull = hexWidth * attraction;
          const ease = 0.16;

          for (const cell of cells) {
            let targetX = cell.cx;
            let targetY = cell.cy;

            if (!reduceMotion && pointerInside) {
              const dx = pointerX - cell.cx;
              const dy = pointerY - cell.cy;
              const dist = Math.hypot(dx, dy);
              if (dist > 0.001 && dist < influence) {
                const t = 1 - dist / influence;
                const falloff = t * t * (3 - 2 * t);
                const pull = maxPull * falloff;
                targetX = cell.cx + (dx / dist) * pull;
                targetY = cell.cy + (dy / dist) * pull;
              }
            }

            cell.x += (targetX - cell.x) * ease;
            cell.y += (targetY - cell.y) * ease;

            p.circle(cell.x, cell.y, dotR * 2);
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
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      data-hero-p5-hexagon
      style={{ backgroundColor: '#ffffff', pointerEvents: 'none' }}
    />
  );
}

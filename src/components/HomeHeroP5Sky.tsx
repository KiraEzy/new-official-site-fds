import { useEffect, useRef } from 'react';
import type p5 from 'p5';

type Point = { x: number; y: number };

type PolyBlob = {
  base: Point[];
  phase: number;
  driftAmp: number;
};

type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

function cross(o: Point, a: Point, b: Point): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function convexHull(points: Point[]): Point[] {
  if (points.length <= 3) return points.slice();
  const sorted = points
    .slice()
    .sort((p, q) => (p.x === q.x ? p.y - q.y : p.x - q.x));

  const lower: Point[] = [];
  for (const pt of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) {
      lower.pop();
    }
    lower.push(pt);
  }

  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const pt = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) {
      upper.pop();
    }
    upper.push(pt);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function centroid(points: Point[]): Point {
  const n = points.length || 1;
  let x = 0;
  let y = 0;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / n, y: y / n };
}

function radiusOf(points: Point[], c: Point): number {
  let r = 0;
  for (const p of points) {
    const d = Math.hypot(p.x - c.x, p.y - c.y);
    if (d > r) r = d;
  }
  return r;
}

function boundsOf(points: Point[]): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

function aabbOverlap(a: Bounds, b: Bounds, pad = 0): boolean {
  return !(
    a.maxX + pad < b.minX ||
    b.maxX + pad < a.minX ||
    a.maxY + pad < b.minY ||
    b.maxY + pad < a.minY
  );
}

/** True only when shapes substantially overlap (not just near each other). */
function substantiallyOverlaps(a: Point[], b: Point[]): boolean {
  const ba = boundsOf(a);
  const bb = boundsOf(b);
  if (!aabbOverlap(ba, bb, -4)) return false;

  const ca = centroid(a);
  const cb = centroid(b);
  const ra = radiusOf(a, ca);
  const rb = radiusOf(b, cb);
  // Require deep circle overlap so near-misses stay separate
  return Math.hypot(ca.x - cb.x, ca.y - cb.y) < (ra + rb) * 0.52;
}

/**
 * Light sky-blue curved polygons on white. Separate until they collide, then merge into one hull.
 */
export function HomeHeroP5Sky({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

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
        let blobs: PolyBlob[] = [];
        const seed = Math.floor(Math.random() * 1_000_000);
        const skyBlue = () => p.color(186, 230, 253);

        const sketchApi = p as p5 & {
          splineVertex: (x: number, y: number) => void;
          CLOSE: 'close';
        };

        const makePolygonAt = (cx: number, cy: number, r: number): PolyBlob => {
          const n = p.floor(p.random(6, 10));
          const base: Point[] = [];
          for (let i = 0; i < n; i++) {
            const a = (i / n) * p.TWO_PI + p.random(-0.18, 0.18);
            const rr = r * p.random(0.65, 1.15);
            base.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
          }
          return {
            base: convexHull(base),
            phase: p.random(p.TWO_PI),
            driftAmp: p.random(8, 16)
          };
        };

        const driftedPoints = (blob: PolyBlob, t: number): Point[] =>
          blob.base.map((pt, i) => ({
            x: pt.x + Math.sin(t + blob.phase + i * 0.85) * blob.driftAmp,
            y: pt.y + Math.cos(t * 0.9 + blob.phase + i * 0.7) * blob.driftAmp * 0.9
          }));

        const tryPlace = (existing: PolyBlob[]): PolyBlob | null => {
          const w = Math.max(p.width, 2);
          const h = Math.max(p.height, 2);
          const minDim = Math.min(w, h);
          for (let attempt = 0; attempt < 40; attempt++) {
            const r = p.random(minDim * 0.1, minDim * 0.2);
            const cx = p.random(r + 24, w - r - 24);
            const cy = p.random(r + 24, h - r - 24);
            const candidate = makePolygonAt(cx, cy, r);
            const ok = existing.every((other) => !substantiallyOverlaps(candidate.base, other.base));
            if (ok) return candidate;
          }
          return null;
        };

        const mergeOverlaps = (t: number) => {
          let merged = true;
          let guard = 0;
          while (merged && guard++ < 24) {
            merged = false;
            outer: for (let i = 0; i < blobs.length; i++) {
              for (let j = i + 1; j < blobs.length; j++) {
                const aWorld = driftedPoints(blobs[i], t);
                const bWorld = driftedPoints(blobs[j], t);
                if (!substantiallyOverlaps(aWorld, bWorld)) continue;

                const hull = convexHull([...aWorld, ...bWorld]);
                const next: PolyBlob = {
                  base: hull,
                  phase: (blobs[i].phase + blobs[j].phase) * 0.5,
                  driftAmp: Math.min(blobs[i].driftAmp, blobs[j].driftAmp) * 0.9
                };
                blobs.splice(j, 1);
                blobs.splice(i, 1);
                blobs.push(next);
                merged = true;
                break outer;
              }
            }
          }
        };

        const rebuild = () => {
          if (p.width < 8 || p.height < 8) return;
          p.randomSeed(seed);
          blobs = [];
          const target = p.floor(p.random(5, 8));
          for (let i = 0; i < target; i++) {
            const placed = tryPlace(blobs);
            if (placed) blobs.push(placed);
          }
        };

        const drawClosedSpline = (pts: Point[]) => {
          if (pts.length < 3) return;
          sketchApi.beginShape();
          for (const pt of pts) {
            sketchApi.splineVertex(pt.x, pt.y);
          }
          sketchApi.endShape(sketchApi.CLOSE);
        };

        const syncSize = () => {
          const el = hostRef.current;
          if (!el) return false;
          const w = Math.max(1, Math.floor(el.clientWidth));
          const h = Math.max(1, Math.floor(el.clientHeight));
          if (w === p.width && h === p.height && blobs.length > 0) return true;
          p.resizeCanvas(w, h);
          rebuild();
          return blobs.length > 0;
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
          rebuild();
          requestAnimationFrame(() => {
            if (!cancelled) syncSize();
          });
        };

        p.draw = () => {
          if (blobs.length === 0) syncSize();

          p.background(255);
          const t = prefersReducedMotion() ? 0 : p.millis() * 0.00012;

          mergeOverlaps(t);

          p.fill(skyBlue());
          for (const blob of blobs) {
            drawClosedSpline(driftedPoints(blob, t));
          }
        };

        p.windowResized = () => {
          syncSize();
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
      instance?.remove();
      instance = null;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
      data-hero-p5-sky
      style={{ backgroundColor: '#ffffff', pointerEvents: 'none' }}
    />
  );
}

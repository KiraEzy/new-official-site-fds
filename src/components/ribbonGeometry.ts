type Point = [number, number];
export type RibbonEdges = { left: Point[]; right: Point[] };
export type RibbonLayer = 'back' | 'front' | 'tail';
export type RibbonPointer = { x: number; y: number; strength: number };

const blend = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const coordinates = (point: Point) => point.map(value => Number(value.toFixed(3))).join(' ');

/** Split a cubic without changing its shape, so both edges have matching segments. */
function splitCubic(points: Point[], t: number): Point[] {
  const a = blend(points[0], points[1], t);
  const b = blend(points[1], points[2], t);
  const c = blend(points[2], points[3], t);
  const d = blend(a, b, t);
  const e = blend(b, c, t);
  return [points[0], a, d, blend(d, e, t), e, c, points[3]];
}

const baseEdges: Record<RibbonLayer, RibbonEdges> = {
  back: {
    left: [[255, -65], [303, 134], [434, 289], [637, 363], [722, 403.333], [807, 443.667], [892, 484]],
    right: splitCubic([[739, -65], [778, 39], [783, 250], [951, 356]], .65),
  },
  front: {
    left: [[461, -70], [605, 125], [825, 159], [858, 328], [880, 418], [837, 555], [825, 667]],
    right: [[830, -70], [879, 32], [882, 116], [907, 180], [954, 293], [990, 457], [985, 667]],
  },
  tail: {
    left: [[882, 290], [858, 433], [916, 526], [922, 679]],
    right: [[882, 290], [965, 374], [1109, 471], [1150, 679]],
  },
};

function edgePath(points: Point[]) {
  let path = `M${coordinates(points[0])}`;
  for (let i = 1; i < points.length; i += 3) {
    path += ` C${coordinates(points[i])} ${coordinates(points[i + 1])} ${coordinates(points[i + 2])}`;
  }
  return path;
}

export function ribbonOutline({ left, right }: RibbonEdges) {
  return `${edgePath(left)} ${edgePath([...right].reverse()).replace(/^M/, 'L')}Z`;
}

/** Derive each strand across the full ribbon width from the same edges as its fill. */
function smoothEdge(source: Point[]) {
  const points = source.map(point => [...point] as Point);
  // Smooth the shared edges, never individual fibers: every layer stays on one surface.
  for (let i = 3; i < points.length - 1; i += 3) {
    const before = points[i - 1];
    const join = points[i];
    const after = points[i + 1];
    const incoming = Math.hypot(join[0] - before[0], join[1] - before[1]);
    const outgoing = Math.hypot(after[0] - join[0], after[1] - join[1]);
    const length = Math.hypot(after[0] - before[0], after[1] - before[1]);
    if (!length) continue;
    const tangent: Point = [(after[0] - before[0]) / length, (after[1] - before[1]) / length];
    points[i - 1] = [join[0] - tangent[0] * incoming, join[1] - tangent[1] * incoming];
    points[i + 1] = [join[0] + tangent[0] * outgoing, join[1] + tangent[1] * outgoing];
  }
  return points;
}

export const ribbonEdges = Object.fromEntries(Object.entries(baseEdges).map(([key, edges]) => [
  key, { left: smoothEdge(edges.left), right: smoothEdge(edges.right) },
])) as Record<RibbonLayer, RibbonEdges>;

export function ribbonFiber({ left, right }: RibbonEdges, position: number) {
  return edgePath(left.map((point, index) => blend(point, right[index], position)));
}

/** A translucent band on the same surface as the outline and river strands. */
export function ribbonBand({ left, right }: RibbonEdges, start: number, end: number) {
  return ribbonOutline({
    left: left.map((point, index) => blend(point, right[index], start)),
    right: left.map((point, index) => blend(point, right[index], end)),
  });
}

/** Slow travelling bends plus a bounded, local push around the spring-smoothed pointer. */
export function deformRibbon(edges: RibbonEdges, time: number, movement: number, pointer: RibbonPointer): RibbonEdges {
  const deform = ([x, y]: Point): Point => {
    const envelope = Math.sin(Math.PI * Math.max(0, Math.min(1, (y + 70) / 749)));
    const phase = time * .55 - y * .006;
    const distanceSquared = ((x - pointer.x) / 190) ** 2 + ((y - pointer.y) / 155) ** 2;
    const influence = Math.exp(-distanceSquared * 1.5) * pointer.strength;
    return [
      x + movement * envelope * (18 * Math.sin(phase) + 7 * Math.sin(phase * .63 + x * .004)) + movement * 28 * influence,
      y + movement * envelope * 7 * Math.sin(phase + .9) - movement * 10 * influence,
    ];
  };
  return { left: smoothEdge(edges.left.map(deform)), right: smoothEdge(edges.right.map(deform)) };
}

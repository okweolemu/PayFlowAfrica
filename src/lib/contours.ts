/**
 * Generates topographic contour lines — a quiet nod to landscape and terrain
 * that avoids literal "African" motifs. Output is deterministic for a given seed
 * so builds are reproducible.
 */

interface Peak {
  x: number;
  y: number;
  rings: number;
  baseRadius: number;
  spacing: number;
}

interface ContourOptions {
  width: number;
  height: number;
  peaks: Peak[];
  seed?: number;
  /** Horizontal stretch so rings read as landforms rather than circles. */
  stretch?: number;
  samples?: number;
}

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmt = (value: number) => (Math.round(value * 10) / 10).toString();

/** Closed Catmull–Rom spline through the points, as cubic Bézier path data. */
function smoothClosedPath(points: [number, number][]): string {
  const n = points.length;
  let d = `M${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return `${d}Z`;
}

export function contourPaths({ peaks, seed = 7, stretch = 1.35, samples = 22 }: ContourOptions): string[] {
  const random = mulberry32(seed);
  const paths: string[] = [];

  for (const peak of peaks) {
    // Shared harmonics per peak keep neighbouring rings roughly parallel, like real contours.
    const harmonics = [2, 3, 4, 5].map((k) => ({
      k,
      amplitude: (0.05 + random() * 0.09) / (k * 0.55),
      phase: random() * Math.PI * 2,
      drift: (random() - 0.5) * 0.28,
    }));

    for (let ring = 0; ring < peak.rings; ring++) {
      const radius = peak.baseRadius + ring * peak.spacing;
      const roughness = 1 + ring * 0.07;
      const points: [number, number][] = [];
      for (let i = 0; i < samples; i++) {
        const angle = (i / samples) * Math.PI * 2;
        let factor = 1;
        for (const h of harmonics) {
          factor += h.amplitude * roughness * Math.sin(h.k * angle + h.phase + h.drift * ring);
        }
        points.push([
          peak.x + Math.cos(angle) * radius * factor * stretch,
          peak.y + Math.sin(angle) * radius * factor,
        ]);
      }
      paths.push(smoothClosedPath(points));
    }
  }
  return paths;
}

export function contourSvg(options: ContourOptions & { stroke: string; strokeOpacity: number; strokeWidth?: number }): string {
  const { width, height, stroke, strokeOpacity, strokeWidth = 1 } = options;
  const paths = contourPaths(options)
    .map((d) => `<path d="${d}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}">${paths}</g></svg>`;
}

/** The site-wide pattern used behind dark sections and in the social preview image. */
export const brandContours = {
  width: 1600,
  height: 900,
  seed: 11,
  peaks: [
    { x: 1180, y: 250, rings: 13, baseRadius: 34, spacing: 31 },
    { x: 330, y: 760, rings: 10, baseRadius: 40, spacing: 34 },
  ],
} satisfies ContourOptions;

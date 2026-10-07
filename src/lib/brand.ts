/** Single source for the PayFlow Africa mark, shared by the site and the asset generator. */

export const brandColors = {
  tile: '#0c7d54',
  glyph: '#ffffff',
  dot: '#f2b84b',
  navy: '#0a1a2f',
};

/** An "F" built from payroll-like bars, ending in a warm "payment" dot. 32×32 grid. */
export const markGlyphPath =
  'M10 8H22A2 2 0 0 1 22 12H12V14.5H18A2 2 0 0 1 18 18.5H12V23A2 2 0 0 1 8 23V10A2 2 0 0 1 10 8Z';

export const markDot = { cx: 22.5, cy: 22, r: 2.5 };

interface MarkOptions {
  size?: number;
  radius?: number;
  /** Scale of the glyph inside the tile; < 1 leaves room for maskable icon safe zones. */
  glyphScale?: number;
}

export function markSvg({ size = 32, radius = 8, glyphScale = 1 }: MarkOptions = {}): string {
  const offset = (32 - 32 * glyphScale) / 2;
  const transform = glyphScale === 1 ? '' : ` transform="translate(${offset} ${offset}) scale(${glyphScale})"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">`,
    `<rect width="32" height="32" rx="${radius}" fill="${brandColors.tile}"/>`,
    `<g${transform}>`,
    `<path d="${markGlyphPath}" fill="${brandColors.glyph}"/>`,
    `<circle cx="${markDot.cx}" cy="${markDot.cy}" r="${markDot.r}" fill="${brandColors.dot}"/>`,
    '</g></svg>',
  ].join('');
}

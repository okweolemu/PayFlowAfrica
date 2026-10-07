// Regenerates the contour background pattern, favicon set and social preview image in public/.
// Run with `npm run assets` (Node 23.6+ runs the imported .ts modules directly).
// The outputs are committed, so this only needs re-running after a brand change.
//
// Text in the preview image uses a system font (Segoe UI on Windows, falling back
// to Helvetica/Arial elsewhere) because the image renderer cannot read WOFF2 web fonts.

import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { brandColors, markDot, markGlyphPath, markSvg } from '../src/lib/brand.ts';
import { brandContours, contourPaths, contourSvg } from '../src/lib/contours.ts';

const publicDir = new URL('../public/', import.meta.url);
const out = (name) => new URL(name, publicDir);

const rasterise = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** Packs PNG images into a .ico container (PNG-in-ICO is supported by all current browsers). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;
  images.forEach(({ size, data }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size, entry);
    directory.writeUInt8(size, entry + 1);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((image) => image.data)]);
}

const FONT = `'Segoe UI', 'Helvetica Neue', Arial, sans-serif`;

function socialImageSvg() {
  const contours = contourPaths(brandContours)
    .map((d) => `<path d="${d}"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="80%" cy="10%" r="70%">
      <stop offset="0" stop-color="#3ccb91" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#3ccb91" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${brandColors.navy}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="scale(0.75)" fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="2">${contours}</g>
  <g transform="translate(80 76) scale(1.75)">
    <rect width="32" height="32" rx="8" fill="${brandColors.tile}"/>
    <path d="${markGlyphPath}" fill="${brandColors.glyph}"/>
    <circle cx="${markDot.cx}" cy="${markDot.cy}" r="${markDot.r}" fill="${brandColors.dot}"/>
  </g>
  <text x="156" y="116" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">PayFlow <tspan font-weight="400" fill="#a7b4c8">Africa</tspan></text>
  <text x="76" y="318" font-family="${FONT}" font-size="88" font-weight="700" letter-spacing="-2" fill="#ffffff">Payroll that works</text>
  <text x="76" y="418" font-family="${FONT}" font-size="88" font-weight="700" letter-spacing="-2" fill="#ffffff">for <tspan fill="#3ccb91">Africa.</tspan></text>
  <text x="80" y="500" font-family="${FONT}" font-size="30" fill="#cbd5e2">Modern payroll &amp; HR technology for African organisations</text>
  <text x="80" y="566" font-family="${FONT}" font-size="24" font-weight="600" fill="#f2b84b">In development · Early access</text>
  <text x="1120" y="566" text-anchor="end" font-family="${FONT}" font-size="24" fill="#a7b4c8">payflowafrica.com</text>
</svg>`;
}

const roundedMark = markSvg({ size: 512 });
const fullBleedMark = markSvg({ size: 512, radius: 0, glyphScale: 0.78 });

await mkdir(out('patterns/'), { recursive: true });
await writeFile(
  out('patterns/contours.svg'),
  `${contourSvg({ ...brandContours, stroke: '#ffffff', strokeOpacity: 0.1 })}\n`,
);
await writeFile(out('favicon.svg'), `${markSvg()}\n`);
await writeFile(
  out('favicon.ico'),
  toIco([
    { size: 16, data: await rasterise(roundedMark, 16) },
    { size: 32, data: await rasterise(roundedMark, 32) },
    { size: 48, data: await rasterise(roundedMark, 48) },
  ]),
);
await writeFile(out('apple-touch-icon.png'), await rasterise(fullBleedMark, 180));
await writeFile(out('icon-192.png'), await rasterise(roundedMark, 192));
await writeFile(out('icon-512.png'), await rasterise(roundedMark, 512));
await writeFile(out('icon-maskable-512.png'), await rasterise(fullBleedMark, 512));
await writeFile(
  out('og-image.png'),
  await sharp(Buffer.from(socialImageSvg())).png({ compressionLevel: 9, palette: false }).toBuffer(),
);

console.log('Generated the contour pattern, favicons, app icons and og-image.png in public/.');

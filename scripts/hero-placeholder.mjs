import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

// PLACEHOLDER hero background. Replace public/hero/somua-s35.jpg with the
// real photo (tank in the village, no text). Tonal layout mimics the
// reference: darker/olive on the left (under the text), lighter on the right.
mkdirSync('public/hero', { recursive: true });

const W = 1920;
const H = 1080;
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0"   stop-color="#1c2116"/>
      <stop offset="0.45" stop-color="#37402a"/>
      <stop offset="1"   stop-color="#8a8467"/>
    </linearGradient>
    <radialGradient id="v" cx="0.62" cy="0.55" r="0.7">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.35"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#v)"/>
  <text x="62%" y="54%" font-family="sans-serif" font-size="42" fill="#ffffff" fill-opacity="0.28" text-anchor="middle">PLACEHOLDER — replace with somua-s35.jpg</text>
</svg>`;

await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile('public/hero/somua-s35.jpg');
const m = await sharp('public/hero/somua-s35.jpg').metadata();
console.log(`public/hero/somua-s35.jpg: ${m.width}x${m.height}`);

import sharp from 'sharp';

const SRC = 'public/logo.png';
const OLIVE = '#4e5a2e'; // same green as the site accent / logo

// Shape mask from the emblem's alpha (transparent bg).
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;
const mask = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) mask[i] = data[i * C + 3];

const r = parseInt(OLIVE.slice(1, 3), 16);
const g = parseInt(OLIVE.slice(3, 5), 16);
const b = parseInt(OLIVE.slice(5, 7), 16);

// Recolor the full emblem to olive, then trim transparent margins.
const olive = await sharp({ create: { width: W, height: H, channels: 3, background: { r, g, b } } })
  .joinChannel(mask, { raw: { width: W, height: H, channels: 1 } })
  .png()
  .toBuffer();
const trimmed = await sharp(olive).trim({ threshold: 10 }).png().toBuffer();

// Square, transparent bg, small padding — emblem centered.
async function make(size, out) {
  const inner = Math.round(size * 0.86); // ~7% padding each side
  const pad = Math.round((size - inner) / 2);
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  await sharp(trimmed)
    .resize(inner, inner, { fit: 'contain', background: transparent })
    .extend({ top: pad, bottom: size - inner - pad, left: pad, right: size - inner - pad, background: transparent })
    .png()
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log(`${out}: ${m.width}x${m.height} alpha=${m.hasAlpha}`);
}

await make(512, 'app/icon.png');
await make(180, 'app/apple-icon.png');

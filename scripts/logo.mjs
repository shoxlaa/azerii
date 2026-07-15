import sharp from 'sharp';

const SRC = 'public/logo.png';

// --- shape mask from the emblem's alpha (transparent bg, no white box) ---
const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;
const mask = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) mask[i] = data[i * C + 3];

async function recolor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return sharp({ create: { width: W, height: H, channels: 3, background: { r, g, b } } })
    .joinChannel(mask, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();
}

// Header logo variants (transparent bg):
//  light (cream)  -> shown on the DARK header
//  dark  (olive)  -> shown on the WHITE header
const cream = await recolor('#F2EDE3');
const olive = await recolor('#4E5A2E');
await sharp(cream).toFile('public/logo-light.png');
await sharp(olive).toFile('public/logo-dark.png');

// --- favicon: recognizable two-figure crest of the emblem, cream on a rounded olive tile ---
const region = { left: 312, top: 0, width: 410, height: 298 };
const creamCrest = await sharp(cream).extract(region).png().toBuffer();

async function tile(size, pad, out) {
  const inner = size - pad * 2;
  const emblem = await sharp(creamCrest)
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const radius = Math.round(size * 0.2);
  const roundedMask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );
  const tileBuf = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0x4e, g: 0x5a, b: 0x2e, alpha: 1 } },
  })
    .composite([{ input: roundedMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  await sharp(tileBuf).composite([{ input: emblem, gravity: 'center' }]).png().toFile(out);
}

await tile(512, 90, 'app/icon.png');
await tile(180, 30, 'app/apple-icon.png');

console.log('logo-light.png, logo-dark.png, app/icon.png, app/apple-icon.png written');

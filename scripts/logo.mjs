import sharp from 'sharp';

const SRC = process.env.LOGO_SRC ?? 'public/logo.png';

/**
 * Build an alpha channel from luminance: white bg -> transparent,
 * black art -> opaque. Then paint the shape a solid target color.
 * This removes the white background entirely (no white frame/halo)
 * and lets us recolor the mark for dark/light surfaces.
 */
async function build(hex, out) {
  const { width, height } = await sharp(SRC).metadata();

  // Grayscale luminance of the source (background white ~255, art ~0).
  const gray = await sharp(SRC).removeAlpha().grayscale().raw().toBuffer();

  // alpha = 255 - luminance, with a small floor so faint bg noise is fully clear.
  const alpha = Buffer.alloc(width * height);
  for (let i = 0; i < gray.length; i++) {
    const a = 255 - gray[i];
    alpha[i] = a < 8 ? 0 : a; // kill near-white halo
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Compute a tight bounding box of the opaque pixels (alpha > 16).
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 4; // tiny breathing room
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Stage 1: composite solid color + alpha into a full-size RGBA buffer.
  const rgba = await sharp({
    create: { width, height, channels: 3, background: { r, g, b } },
  })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  // Stage 2: crop to the emblem's bounding box.
  await sharp(rgba)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${out}: ${meta.width}x${meta.height} ${meta.channels}ch alpha=${meta.hasAlpha}`);
}

// public/logo.png       -> black art, transparent bg (base transparent version)
// public/logo-dark.png  -> black art, transparent bg (for light sections)
// public/logo-light.png -> cream #F2EDE3 art, transparent bg (for dark header)
await build('#000000', 'public/logo.png');
await build('#000000', 'public/logo-dark.png');
await build('#F2EDE3', 'public/logo-light.png');

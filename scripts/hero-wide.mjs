import sharp from 'sharp';

/**
 * Crop each hero photo to a wide 16:5 band (2560×800), choosing the vertical
 * window per-photo so the tank is framed well (turret headroom, tracks near the
 * bottom edge). `top` is the fraction (0..1) of the available vertical slack.
 */
const TARGET_W = 2560;
const TARGET_H = 800;
const ASPECT = TARGET_W / TARGET_H; // 3.2

const JOBS = [
  { src: 'somua-s35.jpg', out: 'somua-wide.jpg', top: 0.42 },
  { src: 'hero-b1-reims.jpg', out: 'b1-reims-wide.jpg', top: 0.30 },
  { src: 'hero-t28-polygon.jpg', out: 't28-polygon-wide.jpg', top: 0.46 },
  { src: 'hero-german-field.jpg', out: 'german-field-wide.jpg', top: 0.34 },
];

for (const job of JOBS) {
  const path = `public/hero/${job.src}`;
  const { width: W, height: H } = await sharp(path).metadata();

  // Crop full width, height = W/aspect (band shorter than source).
  let cropW = W;
  let cropH = Math.round(W / ASPECT);
  if (cropH > H) {
    cropH = H;
    cropW = Math.round(H * ASPECT);
  }
  const left = Math.round((W - cropW) / 2);
  const top = Math.round(job.top * (H - cropH));

  await sharp(path)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(TARGET_W, TARGET_H)
    .jpeg({ quality: 84 })
    .toFile(`public/hero/${job.out}`);
  console.log(`${job.out}  src ${W}x${H}  crop ${cropW}x${cropH}@${left},${top}  top=${job.top}`);
}

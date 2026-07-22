import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

/**
 * Re-encode the oversized source photographs in public/hero.
 *
 * These arrive from the renderer at 2.5–3 MB each. Next re-optimizes them per
 * width anyway, so the size never reaches a visitor — but every transformation
 * reads the full file, and the repository carries it forever.
 *
 * DRY RUN BY DEFAULT. Pass --apply to overwrite. Re-encoding is lossy and
 * there is no undo here: the previous file is the one in git, so
 * `git checkout -- public/hero` restores it.
 */

const DIR = 'public/hero';

/**
 * A ceiling for future arrivals, not a constraint on today's files: every
 * photograph in the folder is currently ~1448px wide, so nothing is resized
 * and the whole saving comes from re-encoding.
 *
 * The value matches the 2560px bands hero-wide.mjs crops from these same
 * sources — shrinking past it would force that script to upscale even further
 * than it already does.
 */
const MAX_WIDTH = 2560;

const QUALITY = 82;

/** Files already this lean are derivatives (the *-wide crops) — leave them. */
const MIN_BYTES = 600 * 1024;

/** Below this saving the loss of a re-encode is not worth it. */
const MIN_GAIN = 0.05;

const APPLY = process.argv.includes('--apply');
const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;

const names = (await readdir(DIR)).filter((n) => /\.jpe?g$/i.test(n)).sort();

let before = 0;
let after = 0;
let changed = 0;

for (const name of names) {
  const file = path.join(DIR, name);
  const { size } = await stat(file);

  if (size < MIN_BYTES) {
    console.log(`skip   ${name.padEnd(28)} ${mb(size).padStart(9)}  already lean`);
    continue;
  }

  const { width, height } = await sharp(file).metadata();

  const buffer = await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();

  const gain = (size - buffer.length) / size;

  if (gain < MIN_GAIN) {
    console.log(`skip   ${name.padEnd(28)} ${mb(size).padStart(9)}  no useful gain`);
    continue;
  }

  before += size;
  after += buffer.length;
  changed += 1;

  const outWidth = Math.min(width, MAX_WIDTH);
  const geometry = outWidth < width ? `${width}x${height} → ${outWidth}px` : `${width}x${height}`;
  const verb = APPLY ? 'wrote ' : 'would ';
  console.log(
    `${verb} ${name.padEnd(28)} ${mb(size).padStart(9)} → ${mb(buffer.length).padStart(9)}` +
      `  −${Math.round(gain * 100)}%  ${geometry}`,
  );

  if (APPLY) {
    // Write beside the original, then swap, so an interrupted run cannot
    // truncate a photograph.
    const tmp = `${file}.tmp`;
    await sharp(buffer).toFile(tmp);
    await rename(tmp, file).catch(async (err) => {
      await unlink(tmp).catch(() => {});
      throw err;
    });
  }
}

if (changed === 0) {
  console.log('\nNothing to do.');
} else {
  console.log(
    `\n${changed} file(s): ${mb(before)} → ${mb(after)} ` +
      `(−${Math.round(((before - after) / before) * 100)}%)`,
  );
  if (!APPLY) console.log('Dry run. Re-run with --apply to overwrite.');
}

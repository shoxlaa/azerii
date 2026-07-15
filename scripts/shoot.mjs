import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = 'design';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shootAt(width, height, suffix) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}/styleguide`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Header element
  await page.locator('header').screenshot({ path: `${OUT}/header-${suffix}.png` });
  // Footer element
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator('footer').screenshot({ path: `${OUT}/footer-${suffix}.png` });

  // Sticky check: scroll down, capture viewport top to prove header stays pinned.
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/sticky-${suffix}.png`, clip: { x: 0, y: 0, width, height: 260 } });

  console.log(`shot ${suffix} (${width}x${height})`);
  await page.close();
}

await shootAt(1440, 900, 'desktop');
await shootAt(390, 844, 'mobile');

await browser.close();

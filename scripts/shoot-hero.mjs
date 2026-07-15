import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const widths = [360, 390, 768, 1024, 1440];
const browser = await chromium.launch();

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 820 } });
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  // Horizontal scroll check
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  const hScroll = overflow.scrollW > overflow.clientW;
  console.log(`w=${w}  hScroll=${hScroll}  (scrollW=${overflow.scrollW} clientW=${overflow.clientW})`);

  await page.locator('section').first().screenshot({ path: `design/hero-${w}.png` });
  await page.close();
}

await browser.close();
console.log('done');

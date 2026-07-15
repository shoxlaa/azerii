import { chromium } from 'playwright';
const BASE = 'http://localhost:3000';
const widths = [360, 390, 768, 1024, 1440];
const browser = await chromium.launch();

for (const w of widths) {
  for (const theme of ['dark','light']) {
    const page = await browser.newPage({ viewport: { width: w, height: 760 } });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.locator('section').first().screenshot({ path: `design/hs-${w}-${theme}.png` });
    console.log(`w=${w} ${theme} hScroll=${hScroll}`);
    await page.close();
  }
}

// Slide navigation check at 1440 dark: click dot 2 then dot 3
const page = await browser.newPage({ viewport: { width: 1440, height: 760 } });
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
const dots = page.locator('section button[aria-label^="Слайд"]');
await dots.nth(1).click(); await page.waitForTimeout(900);
await page.locator('section').first().screenshot({ path: 'design/hs-slide2.png' });
await dots.nth(2).click(); await page.waitForTimeout(900);
await page.locator('section').first().screenshot({ path: 'design/hs-slide3.png' });
console.log('slide2/slide3 captured');
await page.close();
await browser.close();

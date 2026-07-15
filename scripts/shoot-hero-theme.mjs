import { chromium } from 'playwright';
const BASE = 'http://localhost:3000';
const browser = await chromium.launch();
for (const [w, dev] of [[1440,'desktop'],[390,'mobile']]) {
  for (const theme of ['dark','light']) {
    const page = await browser.newPage({ viewport: { width: w, height: 820 } });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.locator('section').first().screenshot({ path: `design/hero-theme-${theme}-${dev}.png` });
    console.log(`hero ${theme} ${dev} hScroll=${overflow}`);
    await page.close();
  }
}
await browser.close();

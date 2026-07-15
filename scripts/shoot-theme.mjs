import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const browser = await chromium.launch();

async function setTheme(page, theme) {
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
}

async function run(width, device) {
  for (const theme of ['dark', 'light']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${BASE}/styleguide`, { waitUntil: 'networkidle' });
    await setTheme(page, theme);

    await page.locator('header').screenshot({ path: `design/theme-${theme}-${device}-header.png` });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.locator('footer').screenshot({ path: `design/theme-${theme}-${device}-footer.png` });

    if (device === 'desktop') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      await page.screenshot({ path: `design/theme-${theme}-full.png`, fullPage: true });
    }
    console.log(`shot ${theme} ${device}`);
    await page.close();
  }
}

await run(1440, 'desktop');
await run(390, 'mobile');
await browser.close();
console.log('done');

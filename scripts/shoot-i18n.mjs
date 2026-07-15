import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/styleguide`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// Footer in default locale (RU)
await page.locator('footer').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator('footer').screenshot({ path: 'design/footer-ru.png' });
console.log('shot footer-ru');

// Switch language via header toggle (RU -> EN)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
await page.click('button[aria-label="Сменить язык"]');
await page.waitForTimeout(500);

// Footer now in EN
await page.locator('footer').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator('footer').screenshot({ path: 'design/footer-en.png' });
console.log('shot footer-en');

// Header with logo (desktop) — back to top, EN header for variety
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
await page.locator('header').screenshot({ path: 'design/logo-header-desktop.png' });

await browser.close();
console.log('done');

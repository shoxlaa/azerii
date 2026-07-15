import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const browser = await chromium.launch();

// Desktop header
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/styleguide`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.locator('header').screenshot({ path: 'design/logo-header-desktop.png' });
await page.close();

// Mobile header (closed)
page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`${BASE}/styleguide`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.locator('header').screenshot({ path: 'design/logo-header-mobile.png' });

// Mobile header with burger menu open
await page.click('button[aria-label="Меню"]');
await page.waitForTimeout(400);
await page.screenshot({ path: 'design/logo-header-mobile-burger.png', clip: { x: 0, y: 0, width: 390, height: 380 } });
await page.close();

await browser.close();
console.log('done');

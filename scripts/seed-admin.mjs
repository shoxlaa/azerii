import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();const p=await b.newPage();
await p.goto(`${BASE}/admin/create-first-user`,{waitUntil:'networkidle'});
await p.waitForTimeout(800);
const has=await p.locator('#field-email').count();
if(has){ await p.fill('#field-email','admin@azerii.com'); await p.fill('#field-password','Admin12345'); await p.fill('#field-confirm-password','Admin12345');
  await Promise.all([p.waitForLoadState('networkidle'),p.click('button[type="submit"]')]); await p.waitForTimeout(1500);
  console.log('created first user, url:',p.url());
} else { console.log('no create-first-user form (user may already exist), url:',p.url()); }
await b.close();

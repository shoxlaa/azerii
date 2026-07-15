import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
for(const theme of ['dark','light']){
  const p=await b.newPage({viewport:{width:1440,height:820}});
  await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
  await p.evaluate((t)=>localStorage.setItem('theme',t),theme);
  await p.reload({waitUntil:'networkidle'});
  await p.waitForTimeout(700);
  await p.locator('section').first().screenshot({path:`design/h4-theme-${theme}.png`});
  console.log('theme',theme);
  await p.close();
}
await b.close();

import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
for(const [w,dev] of [[1440,'desktop'],[390,'mobile']]){
  for(const theme of ['dark','light']){
    const p=await b.newPage({viewport:{width:w,height:900}});
    await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
    await p.evaluate((t)=>localStorage.setItem('theme',t),theme);
    await p.reload({waitUntil:'networkidle'});
    await p.waitForTimeout(800);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    const cat=p.locator('section').nth(1);
    await cat.scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    await cat.screenshot({path:`design/cat-${dev}-${theme}.png`});
    console.log(`${dev} ${theme} hScroll=${hs}`);
    await p.close();
  }
}
await b.close();

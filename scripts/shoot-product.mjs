import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
async function setTheme(p,t){await p.evaluate((x)=>localStorage.setItem('theme',x),t);await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(500);}
for(const w of [360,768,1440]){
  for(const theme of ['dark','light']){
    const p=await b.newPage({viewport:{width:w,height:900}});
    await p.goto(`${BASE}/catalog/somua-s35`,{waitUntil:'networkidle'});
    await setTheme(p,theme);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    await p.screenshot({path:`design/prod-${w}-${theme}.png`,fullPage:true});
    console.log(`${w} ${theme} hScroll=${hs}`);
    await p.close();
  }
}
// Interaction @1440 dark
const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto(`${BASE}/catalog/somua-s35`,{waitUntil:'networkidle'});
await setTheme(p,'dark');
const mainImg=()=>p.locator('div.group img').first();
const before=await mainImg().getAttribute('src');
await p.locator('button[aria-label="SOMUA S-35 — 3"]').click();
await p.waitForTimeout(500);
const after=await mainImg().getAttribute('src');
console.log('main changed:', before!==after, '| new has t28:', (after||'').includes('t28'));
await p.screenshot({path:'design/prod-gallery.png'});
await p.getByRole('button',{name:'Характеристики',exact:true}).click();
await p.waitForTimeout(400);
await p.screenshot({path:'design/prod-tab-specs.png'});
console.log('done');
await p.close();
await b.close();

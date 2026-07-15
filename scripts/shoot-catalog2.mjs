import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
async function setTheme(p,t){await p.evaluate((x)=>localStorage.setItem('theme',x),t);await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(500);}

// Full-page shots at widths × themes
for(const w of [360,768,1440]){
  for(const theme of ['dark','light']){
    const p=await b.newPage({viewport:{width:w,height:900}});
    await p.goto(`${BASE}/catalog`,{waitUntil:'networkidle'});
    await setTheme(p,theme);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    await p.screenshot({path:`design/cat2-${w}-${theme}.png`,fullPage:true});
    console.log(`${w} ${theme} hScroll=${hs}`);
    await p.close();
  }
}

// Interaction: 1440 dark — apply a type filter + sort, then an empty combo
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto(`${BASE}/catalog`,{waitUntil:'networkidle'});
await setTheme(p,'dark');
// count before
const countText=async()=>await p.locator('h1 + p').innerText();
console.log('before:', await countText());
// click type "Танки"
await p.getByRole('button',{name:'Танки',exact:true}).click();
await p.waitForTimeout(400);
console.log('after type=Танки:', await countText());
// sort price desc
await p.locator('select').selectOption('price-desc');
await p.waitForTimeout(400);
await p.screenshot({path:'design/cat2-filtered.png',fullPage:true});
// reset then empty combo: Шасси + технология 3D-печать (chassis is rezin only -> empty)
await p.getByRole('button',{name:'Сбросить',exact:true}).click();
await p.waitForTimeout(300);
await p.getByRole('button',{name:'Шасси',exact:true}).click();
await p.getByRole('button',{name:'3D-печать',exact:true}).click();
await p.waitForTimeout(400);
console.log('empty combo:', await countText());
await p.screenshot({path:'design/cat2-empty.png',fullPage:true});
await p.close();

// Mobile filters open
const pm=await b.newPage({viewport:{width:360,height:780}});
await pm.goto(`${BASE}/catalog`,{waitUntil:'networkidle'});
await pm.waitForTimeout(500);
await pm.getByRole('button',{name:/Фильтры/}).click();
await pm.waitForTimeout(400);
await pm.screenshot({path:'design/cat2-mobile-open.png',fullPage:true});
console.log('mobile filters opened');
await pm.close();
await b.close();

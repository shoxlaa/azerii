import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
async function setTheme(p,t){await p.evaluate((x)=>localStorage.setItem('theme',x),t);await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(600);}
for(const w of [360,768,1440]){
  for(const theme of ['dark','light']){
    const p=await b.newPage({viewport:{width:w,height:900}});
    await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
    await setTheme(p,theme);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    // sections: 0 hero,1 catalog,2 features,3 workshop,4 promo
    for(const [idx,name] of [[2,'features'],[3,'workshop'],[4,'promo']]){
      const s=p.locator('section').nth(idx);
      await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(250);
      await s.screenshot({path:`design/h3-${name}-${w}-${theme}.png`});
    }
    console.log(`${w} ${theme} hScroll=${hs}`);
    await p.close();
  }
}
await b.close();

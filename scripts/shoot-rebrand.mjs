import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
async function setTheme(p,t){await p.evaluate((x)=>localStorage.setItem('theme',x),t);await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(700);}
const pages=[['/','home'],['/catalog','catalog'],['/catalog/somua-s35','product']];
for(const [url,name] of pages){
  for(const theme of ['dark','light']){
    const p=await b.newPage({viewport:{width:1440,height:1000}});
    await p.goto(`${BASE}${url}`,{waitUntil:'networkidle'});
    await setTheme(p,theme);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    await p.screenshot({path:`design/rb-${name}-${theme}.png`,fullPage:true});
    console.log(`${name} ${theme} hScroll=${hs}`);
    await p.close();
  }
}
// hero close-up both themes
for(const theme of ['dark','light']){
  const p=await b.newPage({viewport:{width:1440,height:760}});
  await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
  await setTheme(p,theme);
  await p.locator('section').first().screenshot({path:`design/rb-hero-${theme}.png`});
  await p.close();
}
await b.close();

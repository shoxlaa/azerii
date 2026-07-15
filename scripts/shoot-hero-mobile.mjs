import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
// mobile widths, slides 1 (somua) and 2 (b1 tall)
for(const w of [360,390,414]){
  const p=await b.newPage({viewport:{width:w,height:780}});
  await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
  await p.waitForTimeout(700);
  const box=await p.locator('section').first().boundingBox();
  await p.mouse.move(box.x+box.width/2, box.y+box.height/2); // pause autoplay
  await p.waitForTimeout(200);
  const dots=p.locator('section button[aria-label^="Слайд"]');
  for(const idx of [0,1]){
    await dots.nth(idx).click();
    await p.waitForTimeout(1000);
    await p.mouse.move(box.x+box.width/2, box.y+box.height/2);
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    await p.locator('section').first().screenshot({path:`design/hm-${w}-s${idx+1}.png`});
    console.log(`w=${w} s${idx+1} hScroll=${hs}`);
  }
  await p.close();
}
// desktop unchanged check
const p=await b.newPage({viewport:{width:1440,height:820}});
await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
await p.waitForTimeout(700);
await p.locator('section').first().screenshot({path:'design/hm-desktop-check.png'});
console.log('desktop captured');
await b.close();

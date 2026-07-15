import { chromium } from 'playwright';
const BASE='http://localhost:3000';
const b=await chromium.launch();
for(const [w,dev] of [[1440,'d'],[390,'m']]){
  const p=await b.newPage({viewport:{width:w,height:820}});
  await p.goto(`${BASE}/`,{waitUntil:'networkidle'});
  await p.waitForTimeout(700);
  // hover hero to pause autoplay
  const box=await p.locator('section').first().boundingBox();
  await p.mouse.move(box.x+box.width/2, box.y+box.height/2);
  await p.waitForTimeout(300);
  const dots=p.locator('section button[aria-label^="Слайд"]');
  for(let i=0;i<4;i++){
    await dots.nth(i).click();
    await p.waitForTimeout(1100);
    await p.mouse.move(box.x+box.width/2, box.y+box.height/2); // keep paused
    const hs=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    await p.locator('section').first().screenshot({path:`design/h4-${dev}-s${i+1}.png`});
    console.log(`${dev} s${i+1} hScroll=${hs}`);
  }
  await p.close();
}
await b.close();

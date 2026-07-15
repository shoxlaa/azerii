import sharp from 'sharp';
const SRC='public/logo.png';
// Tight crop of the two central columns (figures) — bigger in the square.
const region={left:318,top:0,width:398,height:291};
const {data,info}=await sharp(SRC).ensureAlpha().extract(region).raw().toBuffer({resolveWithObject:true});
const iw=info.width, ih=info.height, C=info.channels;
const mask=Buffer.alloc(iw*ih);
for(let i=0;i<iw*ih;i++)mask[i]=data[i*C+3];
const shape=async(hex)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return sharp({create:{width:iw,height:ih,channels:3,background:{r,g,b}}}).joinChannel(mask,{raw:{width:iw,height:ih,channels:1}}).png().toBuffer();};
const goldBuf=await shape('#C2A36B'), darkBuf=await shape('#201810');
async function makeIcon(size,pad,bg){
  const cw=size-pad*2, ch=Math.round(cw*ih/iw);
  const gold=await sharp(goldBuf).resize(cw,ch).png().toBuffer();
  const oW=Math.round(cw*1.05),oH=Math.round(ch*1.05);
  const dark=await sharp(darkBuf).resize(oW,oH).png().toBuffer();
  const base=bg?sharp({create:{width:size,height:size,channels:4,background:bg}}):sharp({create:{width:size,height:size,channels:4,background:{r:0,g:0,b:0,alpha:0}}});
  return base.composite([{input:dark,left:Math.round((size-oW)/2),top:Math.round((size-oH)/2)},{input:gold,left:Math.round((size-cw)/2),top:Math.round((size-ch)/2)}]).png().toBuffer();
}
await sharp(await makeIcon(512,34,null)).toFile('app/icon.png');
await sharp(await makeIcon(180,16,{r:0x18,g:0x14,b:0x10,alpha:1})).toFile('app/apple-icon.png');
// ZOOM preview: render 16 & 32, upscale 9x nearest, on white and dark
const icon=await sharp('app/icon.png').toBuffer();
const zoom=async(s)=>{const small=await sharp(icon).resize(s,s).png().toBuffer();return sharp(small).resize(s*9,s*9,{kernel:'nearest'}).png().toBuffer();};
const z16=await zoom(16), z32=await zoom(32);
await sharp({create:{width:16*9*2+60,height:32*9+40,channels:4,background:'#ffffff'}})
 .composite([
   {input:{create:{width:16*9+30,height:32*9+40,channels:4,background:'#1a1a1a'}},left:16*9+30,top:0},
   {input:z16,left:15,top:20},{input:z32,left:15,top:20+16*9+0-  (16*9)+ (32*9)-(32*9)}, // placeholder
 ]).png().toFile('design/fav-zoom-tmp.png');
// simpler: two rows (16 and 32), two cols (light/dark)
const pad=16;
const cell16=16*9, cell32=32*9;
const Wt=pad*3+cell32+cell16, Ht=pad*3+cell32;
await sharp({create:{width:Wt,height:Ht,channels:4,background:'#ffffff'}})
 .composite([
   {input:{create:{width:Math.round(Wt/2),height:Ht,channels:4,background:'#1a1a1a'}},left:Math.round(Wt/2),top:0},
   {input:z32,left:pad,top:pad},
   {input:z16,left:pad+cell32+pad-cell16,top:pad},
   {input:z32,left:Math.round(Wt/2)+pad,top:pad},
   {input:z16,left:Math.round(Wt/2)+pad+cell32+pad-cell16,top:pad},
 ]).png().toFile('design/fav-zoom.png');
console.log('icon.png/apple-icon.png + design/fav-zoom.png written; emblem', iw+'x'+ih);

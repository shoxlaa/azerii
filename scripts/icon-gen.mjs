import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const svg = readFileSync('app/icon.svg');

// Preview on light + dark backgrounds side by side (to check tab visibility)
const emblem = await sharp(svg).resize(96,96).png().toBuffer();
await sharp({create:{width:220,height:120,channels:4,background:'#ffffff'}})
  .composite([
    {input:{create:{width:110,height:120,channels:4,background:'#1a1a1a'}},left:110,top:0},
    {input:emblem,left:12,top:12},
    {input:emblem,left:122,top:12},
  ]).png().toFile('design/icon-preview.png');
console.log('preview -> design/icon-preview.png');

// apple-icon.png 180x180 — dark tile + gold emblem centered
const big = await sharp(svg).resize(126,126).png().toBuffer();
await sharp({create:{width:180,height:180,channels:4,background:'#181410'}})
  .composite([{input:big,left:27,top:27}])
  .png().toFile('app/apple-icon.png');
const m = await sharp('app/apple-icon.png').metadata();
console.log('apple-icon.png', m.width+'x'+m.height);

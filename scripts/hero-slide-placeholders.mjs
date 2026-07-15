import sharp from 'sharp';
const W = 1920, H = 1080;
const make = async (file, c1, c2, label) => {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${c1}"/><stop offset="0.5" stop-color="${c2}"/><stop offset="1" stop-color="#8a8467"/>
    </linearGradient>
    <radialGradient id="v" cx="0.62" cy="0.55" r="0.7">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#v)"/>
    <text x="62%" y="54%" font-family="sans-serif" font-size="46" fill="#fff" fill-opacity="0.25" text-anchor="middle">${label} — placeholder</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(file);
  console.log(file);
};
await make('public/hero/char-b1.jpg', '#241f16', '#3a3324', 'CHAR B1 early');
await make('public/hero/t-26.jpg', '#161d1a', '#2a3830', 'T-26');

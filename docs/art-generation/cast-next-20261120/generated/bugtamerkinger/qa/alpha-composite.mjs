import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const { createCanvas, loadImage } = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(evidenceDir);
const slots = ['walk', 'victory'];
const width = 480, height = 480;
const sheet = createCanvas(width * 3, height * 2), ctx = sheet.getContext('2d');
const metrics = [];
for (let row = 0; row < slots.length; row++) {
  const slot = slots[row], im = await loadImage(path.join(root, `${slot}.png`));
  const raw = createCanvas(im.width, im.height), rc = raw.getContext('2d');
  rc.drawImage(im, 0, 0);
  const px = rc.getImageData(0, 0, im.width, im.height).data;
  const hist = Array(256).fill(0);
  for (let i = 3; i < px.length; i += 4) hist[px[i]]++;
  const bounds = t => {
    let x0 = im.width, x1 = -1, y0 = im.height, y1 = -1;
    for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (px[(y * im.width + x) * 4 + 3] >= t) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    return x1 < 0 ? null : [x0, y0, x1 + 1, y1 + 1];
  };
  metrics.push({ slot, dimensions: [im.width, im.height], alpha0: hist[0], alpha1to11: hist.slice(1, 12).reduce((a,b)=>a+b,0), alpha12to63: hist.slice(12,64).reduce((a,b)=>a+b,0), alpha64to239: hist.slice(64,240).reduce((a,b)=>a+b,0), alpha240to255: hist.slice(240).reduce((a,b)=>a+b,0), bounds1: bounds(1), bounds12: bounds(12), bounds128: bounds(128), bounds240: bounds(240) });
  for (let col = 0; col < 3; col++) {
    ctx.save(); ctx.translate(col * width, row * height);
    if (col === 0) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height); }
    else if (col === 1) {
      for (let y=0;y<height;y+=24) for(let x=0;x<width;x+=24){ctx.fillStyle=((x/24+y/24)%2)?'#767676':'#bdbdbd';ctx.fillRect(x,y,24,24);}
    } else {
      const grad=ctx.createLinearGradient(0,0,0,height);grad.addColorStop(0,'#061722');grad.addColorStop(0.72,'#154247');grad.addColorStop(1,'#272139');ctx.fillStyle=grad;ctx.fillRect(0,0,width,height);
      ctx.fillStyle='#315960';ctx.fillRect(0,height-55,width,3);
      ctx.strokeStyle='#244d58';for(let y=height-48;y<height;y+=12){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    }
    const scale=Math.min((width-44)/im.width,(height-70)/im.height),dw=im.width*scale,dh=im.height*scale;
    ctx.drawImage(im,(width-dw)/2,42+(height-60-dh)/2,dw,dh);
    ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText(`${row === 0 ? "walk" : "victory"} / ${['black','checker','dark diagnostic'][col]}`,12,27);
    ctx.restore();
  }
}
fs.writeFileSync(path.join(evidenceDir, 'alpha-composite.png'),sheet.toBuffer('image/png'));
fs.writeFileSync(path.join(evidenceDir, 'alpha-composite.json'),JSON.stringify({renderer:'Node @napi-rs/canvas; standard source-over, no source modifications',metrics},null,2)+'\n');
console.log(JSON.stringify(metrics,null,2));

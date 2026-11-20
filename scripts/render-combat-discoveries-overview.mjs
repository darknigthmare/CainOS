import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const {createCanvas,loadImage}=await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas/index.js')));
const repo=fileURLToPath(new URL('..',import.meta.url));
const wave=path.join(repo,'docs/art-generation/cast-next-20261120');
const completion=JSON.parse(await fs.readFile(path.join(wave,'generation-completion.json'),'utf8'));
const names={jaxsuitpomni:'Pomni · combinaison Jax',noirribbit:'Ribbit · Film noir',kaufmosuitribbit:'Ribbit · combinaison Kaufmo',intermissioncaine:'Caine · Intermission',showtimepomni:'Pomni · Showtime',bowlingpinragatha:'Ragatha · quille',ringmastercaine:'Caine · Ringmaster',strongmanorbsman:'Orbsman · Strongman',stagehandbubble:'Bubble · Stagehand',bugtamerkinger:'Kinger · Bug Tamer'};
const canvas=createCanvas(1248,740),ctx=canvas.getContext('2d');
ctx.fillStyle='#101521';ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle='#f9edcf';ctx.font='bold 29px sans-serif';ctx.fillText('ENCORE  /  10 nouvelles apparences',24,40);
ctx.fillStyle='#b9c6dd';ctx.font='16px sans-serif';ctx.fillText('110 dessins individuels · portraits affichés par le moteur de production',24,68);
for(const [index,id] of completion.order.entries()){
 const img=await loadImage(path.join(wave,'review',id,'archive-portraits-01.jpg'));
 const x=24+(index%5)*244, y=92+Math.floor(index/5)*310;
 ctx.fillStyle='#232c3f';ctx.fillRect(x,y,224,286);
 ctx.drawImage(img,8,8,224,242,x,y,224,242);
 ctx.fillStyle='#f9edcf';ctx.font='bold 13px sans-serif';ctx.fillText(names[id],x+10,y+262,204);
 ctx.fillStyle='#a4b5d3';ctx.font='12px sans-serif';ctx.fillText('11 / 11 dessins',x+10,y+279);
}
ctx.fillStyle='#91a1bd';ctx.font='13px sans-serif';ctx.fillText('Adaptations originales pour le jeu d’après les produits officiels GLITCH · 20 novembre 2026',24,727);
await fs.writeFile(path.join(wave,'review/overview.jpg'),canvas.toBuffer('image/jpeg',92));
console.log(path.join(wave,'review/overview.jpg'));

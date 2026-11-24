/** Focused recovery of the abstraction Canvas review.
 * Production renderer, exact image sources, uniform scale and both facings.
 * Static poses only; no browser interaction or canonical 1:1 certification.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const repo=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
let skia;
try{skia=await import('@napi-rs/canvas');}
catch(error){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw error;skia=await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas/index.js')));}
const {createCanvas,Image:NativeImage}=skia, imageSources=new WeakMap(),decodedSources=new WeakMap();
globalThis.Image=class extends NativeImage{
  set src(value){const source=typeof value==='string'&&value.startsWith('file:')?fileURLToPath(value):value;if(typeof source==='string')imageSources.set(this,path.resolve(source));super.src=source;}
  get src(){return super.src;} removeAttribute(){}
};
globalThis.document={createElement(name){
  assert.equal(name,'canvas');const canvas=createCanvas(1,1),ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx);canvas.isConnected=true;
  ctx.drawImage=(source,...coords)=>{const file=imageSources.get(source)||decodedSources.get(source);if(file)decodedSources.set(canvas,file);return draw(source,...coords);};return canvas;
}};
const {FIGHTERS,VARIANTS,equipCostume}=await import('../combat/data.mjs');
const {ABSTRACTION_APPEARANCE_IDS}=await import('../combat/abstractions-content.mjs');
const {ART_FILES}=await import('../combat/offline-manifest.mjs');
const {CombatRenderer,drawPortrait}=await import('../combat/render.mjs');
const {ACTION_ART,loadFighterIllustration}=await import('../combat/illustrations.mjs');
const args=process.argv.slice(2),at=args.indexOf('--output'),pick=args.indexOf('--appearance'),reportAt=args.indexOf('--report');
const output=path.resolve(at<0?'docs/art-generation/abstractions-20261124/canvas/characters':args[at+1]);
const partial=args.includes('--available-only'),appearanceId=pick<0?null:args[pick+1];
await fs.mkdir(output,{recursive:true});
const published=new Set(ART_FILES),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const appearances=ABSTRACTION_APPEARANCE_IDS.filter(id=>!appearanceId||id===appearanceId).map(id=>{
  const base=FIGHTERS.find(f=>f.id===id);if(base)return{id,name:base.name,f:base};
  const v=VARIANTS.find(v=>v.id===id);assert.ok(v,id);
  const f=equipCostume(FIGHTERS.find(f=>f.id===v.baseFighterId),id);assert.equal(f.costume,id);
  return{id,name:v.name,f};
});
assert.ok(appearances.length);
const report={schema:'encore-character-canvas-review/v1',createdAt:new Date().toISOString(),
  method:'Production Canvas2D modules under Node/native Skia; actual drawImage sources and transforms inspected.',
  limitations:['No browser, DOM, input, audio, service-worker or physical-device test.','Static poses do not establish frame-by-frame animation.','No canonical 1:1 certification.'],
  partial,abstractionsOnly:true,appearanceId,sources:{},actions:[],stances:[],portraits:[],missing:[],sheets:[],browserTestStatus:'not_executed'};
for(const file of ['combat/data.mjs','combat/abstractions-content.mjs','combat/illustrations.mjs','combat/render.mjs','combat/render-poses.mjs','combat/render-sequences.mjs','combat/render-presentation.mjs','combat/projectile-art.mjs','combat/offline-manifest.mjs','scripts/render-combat-abstraction-review.mjs'])report.sources[file]=sha(await fs.readFile(path.join(repo,file)));
function sourceFor(f,slot){
  const directory=f.sprite?.crossoverDirectory;assert.ok(directory);
  const stem=directory+'/'+slot,src=[stem+'.webp',stem+'.png'].find(s=>published.has(s));
  return src?path.relative(repo,path.resolve(repo,'combat',src)).split(path.sep).join('/'):null;
}
function background(ctx,w,h){ctx.fillStyle='#242b3d';ctx.fillRect(0,0,w,h);for(let y=0;y<h;y+=24)for(let x=0;x<w;x+=24)if((x/24+y/24)%2){ctx.fillStyle='#30394d';ctx.fillRect(x,y,24,24);}}
function box(frame,m){const{x,y,width,height}=frame.bounds;const p=[[x,y],[x+width,y],[x,y+height],[x+width,y+height]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));return{left:Math.min(...p.map(p=>p.x)),right:Math.max(...p.map(p=>p.x)),top:Math.min(...p.map(p=>p.y)),bottom:Math.max(...p.map(p=>p.y))};}
const arena=createCanvas(1280,720),renderer=new CombatRenderer(arena),ctx=renderer.ctx;let sampled=[];
const draw=ctx.drawImage.bind(ctx);ctx.drawImage=(source,...coords)=>{sampled.push({source,matrix:ctx.getTransform()});return draw(source,...coords);};
function verify(f,frame,actor,phase,winner,height){
  const checks=[],maxWidth=f.visual?.maxIllustratedWidth;
  const unconstrainedWidth=frame.bounds.width*height/frame.bounds.height;
  const widthLimited=Number.isFinite(maxWidth)&&maxWidth>0&&unconstrainedWidth>maxWidth;
  const expectedHeight=widthLimited?height*maxWidth/unconstrainedWidth:height;
  for(const face of [1,-1]){
    actor.face=face;sampled=[];ctx.clearRect(0,0,1280,720);
    const before=JSON.stringify(actor);renderer.drawActor(actor,0,true,{phase,winner});
    assert.equal(JSON.stringify(actor),before);
    const emitted=sampled.find(row=>row.source===frame.canvas);assert.ok(emitted,f.id+': exact authored drawing');
    const m=emitted.matrix;assert.equal(Math.sign(m.a),face*frame.nativeFacing);
    assert.ok(Math.abs(Math.hypot(m.a,m.b)-Math.hypot(m.c,m.d))<.0001);
    const visibleHeight=Math.hypot(m.c,m.d)*frame.bounds.height,visibleWidth=Math.hypot(m.a,m.b)*frame.bounds.width;
    assert.ok(Math.abs(visibleHeight-expectedHeight)<.01);
    if(Number.isFinite(maxWidth)&&maxWidth>0)assert.ok(visibleWidth<=maxWidth+.01,f.id+': illustrated width ceiling');
    if(widthLimited)assert.ok(Math.abs(visibleWidth-maxWidth)<.01,f.id+': width limit applied uniformly');
    const anchorX=Number.isFinite(f.visual?.anchorX)?f.visual.anchorX:.5;
    const x=frame.bounds.x+frame.bounds.width*anchorX,y=frame.bounds.y+frame.bounds.height;
    const anchorWorld={x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f};
    assert.ok(Math.abs(anchorWorld.x-actor.x)<.001,f.id+': preserved head/body anchor');
    const visibleWorldBounds=box(frame,m);
    assert.ok(Math.abs(visibleWorldBounds.bottom-actor.y)<.08,f.id+': floor support preserved');
    const initialFramingProjection=f.id==='aquaticabstraction'?{
      actorX:face===1?380:900,left:visibleWorldBounds.left+(face===1?380:900)-actor.x,
      right:visibleWorldBounds.right+(face===1?380:900)-actor.x}:null;
    if(initialFramingProjection)assert.ok(initialFramingProjection.left>=0&&initialFramingProjection.right<=1280,'Aquatic tendrils stay in the initial ring framing');
    checks.push({face,sourceVerified:true,uniformScale:true,anchorVerified:true,effectiveAnchorX:anchorX,
      sourceAnchor:{x,y},anchorWorld,visibleWorldBounds,visibleHeight,visibleWidth,requestedHeight:height,
      unconstrainedWidth,maxIllustratedWidth:maxWidth??null,widthLimited,initialFramingProjection,
      matrix:{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}});
  }
  assert.ok(Math.abs(checks[0].visibleWorldBounds.left+checks[1].visibleWorldBounds.right-2*actor.x)<.001,'Mirrored left edge');
  assert.ok(Math.abs(checks[0].visibleWorldBounds.right+checks[1].visibleWorldBounds.left-2*actor.x)<.001,'Mirrored right edge');
  return checks;
}
const poses=[...ACTION_ART,'heavy'];
for(const{id,name,f}of appearances){
  // Native image memory is outside V8's small wrapper objects. The optional
  // --expose-gc runner keeps review batches bounded on a shared workstation.
  globalThis.gc?.();
  let stanceFrame=null,stanceChecks=null;
  const stanceFile=sourceFor(f,'stance');
  if(!stanceFile)report.missing.push(id+'/stance');
  else{
    const frame=await loadFighterIllustration('stance',f);assert.ok(frame?.canvas);
    assert.equal(decodedSources.get(frame.canvas),path.resolve(repo,stanceFile));
    const height=f.visual.height;
    const checks=verify(f,frame,{f,slot:0,state:'idle',x:640,y:568,onGround:true},'fight',0,height);
    stanceFrame=frame;stanceChecks=checks;
    const bytes=await fs.readFile(path.join(repo,stanceFile));
    report.stances.push({id,file:stanceFile,sha256:sha(bytes),bytes:bytes.length,nativeFacing:frame.nativeFacing,visibleBounds:frame.bounds,
      visibleHeight:checks[0].visibleHeight,visibleWidth:checks[0].visibleWidth,authoredAnchorX:f.visual?.anchorX??null,
      effectiveAnchorX:checks[0].effectiveAnchorX,maxIllustratedWidth:f.visual?.maxIllustratedWidth??null,
      rendered:true,sourceVerified:true,bothFacings:true,drawChecks:checks});
  }
  const sheet=createCanvas(1080,1460),sc=sheet.getContext('2d');background(sc,1080,1460);
  sc.fillStyle='#fff0d4';sc.font='bold 24px sans-serif';sc.fillText(id+' / même échelle par planche',18,32);
  const maxPoseFactor=Math.max(1,...Object.values(f.visual?.poseHeightFactors||{}).filter(value=>Number.isFinite(value)&&value>0));
  const sheetScale=Math.min(1,300/(f.visual.height*maxPoseFactor),336/((f.visual?.maxIllustratedWidth||stanceChecks?.[0].visibleWidth||400)+30));
  function paintCell(frame,actor,phase,winner,index,label,matrix){
    const bounds=box(frame,matrix),x=index%3*360,y=Math.floor(index/3)*350+52;
    actor.face=1;
    sc.save();sc.beginPath();sc.rect(x+2,y+28,356,312);sc.clip();
    sc.translate(x+180-(bounds.left+bounds.right)/2*sheetScale,y+330-bounds.bottom*sheetScale);sc.scale(sheetScale,sheetScale);
    const previousContext=renderer.ctx;
    try{renderer.ctx=sc;renderer.drawActor(actor,0,true,{phase,winner});}
    finally{renderer.ctx=previousContext;sc.restore();}
    sc.fillStyle='#f1e7d1';sc.font='16px sans-serif';sc.fillText(label,x+12,y+20);
  }
  if(stanceFrame)paintCell(stanceFrame,{f,slot:0,state:'idle',x:640,y:568,face:1,onGround:true},'fight',0,0,'stance · référence',stanceChecks[0].matrix);
  let checked=0;
  for(const[index,pose]of poses.entries()){
    const file=sourceFor(f,pose);if(!file){report.missing.push(id+'/'+pose);continue;}
    const frame=await loadFighterIllustration('poses',f,pose);assert.ok(frame?.canvas);
    assert.equal(decodedSources.get(frame.canvas),path.resolve(repo,file));
    const actor={f,slot:0,state:pose,x:640,y:568,face:1,onGround:pose!=='jump'};
    const phase=pose==='intro'?'intro':['victory','defeat'].includes(pose)?'matchOver':'fight',winner=pose==='defeat'?1:0;
    if(['attack','heavy'].includes(pose)){const slot=pose==='heavy'?'heavy':'light';actor.attack={name:slot,def:f.moves[slot],t:f.moves[slot].startup};}
    const configuredFactor=f.visual?.poseHeightFactors?.[pose];
    const poseHeightFactor=Number.isFinite(configuredFactor)&&configuredFactor>0?configuredFactor:1;
    const height=f.visual.height*(['crouch','defeat'].includes(pose)?.74:1)*poseHeightFactor;
    const checks=verify(f,frame,actor,phase,winner,height);
    // One shared scale makes horizontal poses comparable to their own stance.
    // Draw directly: Skia can defer a copy of a reused arena until a later pose.
    paintCell(frame,actor,phase,winner,index+1,pose,checks[0].matrix);
    const bytes=await fs.readFile(path.join(repo,file));
    report.actions.push({id,pose,sourcePose:pose,file,sha256:sha(bytes),bytes:bytes.length,visibleBounds:frame.bounds,nativeFacing:frame.nativeFacing,
      authoredAnchorX:f.visual?.anchorX??null,effectiveAnchorX:checks[0].effectiveAnchorX,anchorVerified:true,
      visibleWidth:checks[0].visibleWidth,visibleHeight:checks[0].visibleHeight,unconstrainedWidth:checks[0].unconstrainedWidth,
      maxIllustratedWidth:f.visual?.maxIllustratedWidth??null,widthLimited:checks[0].widthLimited,poseHeightFactor,sheetScale,
      sourceVerified:true,bothFacings:true,uniformScale:true,rendered:true,drawChecks:checks});
    checked++;
  }
  if(checked){const file='actions-'+id+'.jpg';await fs.writeFile(path.join(output,file),sheet.toBuffer('image/jpeg',88));report.sheets.push(file);}
  sheet.width=1;sheet.height=1;
}
const portraitSheet=createCanvas(1440,Math.ceil(appearances.length/6)*284),pc=portraitSheet.getContext('2d');
background(pc,portraitSheet.width,portraitSheet.height);
for(const[index,{id,f}]of appearances.entries()){
  const file=sourceFor(f,'selection');if(!file){report.missing.push(id+'/selection');continue;}
  const frame=await loadFighterIllustration('selection',f);assert.ok(frame?.canvas);assert.equal(decodedSources.get(frame.canvas),path.resolve(repo,file));
  const canvas=createCanvas(224,242),ctx=canvas.getContext('2d'),draw=ctx.drawImage.bind(ctx),calls=[];
  ctx.drawImage=(source,...coords)=>{calls.push({source,coords});return draw(source,...coords);};
  assert.equal(await drawPortrait(canvas,f,{selection:true,glow:false}),true);
  const emitted=calls.find(c=>c.source===frame.canvas);assert.ok(emitted);assert.equal(emitted.coords.length,8);
  const[sx,sy,sw,sh,,,dw,dh]=emitted.coords;assert.deepEqual([sx,sy,sw,sh],[frame.bounds.x,frame.bounds.y,frame.bounds.width,frame.bounds.height]);
  const scale=Math.min(canvas.width*.87/sw,canvas.height*.91/sh);
  assert.ok(Math.abs(dw-sw*scale)<=.5&&Math.abs(dh-sh*scale)<=.5);
  const x=index%6*240,y=Math.floor(index/6)*284;pc.drawImage(canvas,x+8,y+8);pc.fillStyle='#f1e7d1';pc.font='13px sans-serif';pc.fillText(id,x+10,y+274);
  const bytes=await fs.readFile(path.join(repo,file));report.portraits.push({id,file,sha256:sha(bytes),bytes:bytes.length,rendered:true,sourceVerified:true,uniformScaleWithinPixelRounding:true,directionalAPI:false});
}
await fs.writeFile(path.join(output,'archive-portraits-01.jpg'),portraitSheet.toBuffer('image/jpeg',88));report.sheets.push('archive-portraits-01.jpg');
report.counts={appearances:appearances.length,expectedActions:appearances.length*9,actions:report.actions.length,stances:report.stances.length,
  drawChecks:(report.actions.length+report.stances.length)*2,archiveEntries:0,portraits:report.portraits.length,expectedPortraits:appearances.length,missing:report.missing.length,
  aliasedActions:report.actions.filter(row=>row.pose!==row.sourcePose).length,widthLimitedActions:report.actions.filter(row=>row.widthLimited).length,
  anchorChecks:report.actions.concat(report.stances).reduce((sum,row)=>sum+row.drawChecks.filter(check=>check.anchorVerified).length,0),
  poseHeightCalibrations:report.actions.filter(row=>row.poseHeightFactor!==1).length};
report.complete=report.missing.length===0;
await fs.writeFile(path.join(output,'character-canvas-review.json'),JSON.stringify(report,null,2)+'\n');
const target=path.resolve(repo,reportAt<0?'docs/encore-abstractions-20261124.md':args[reportAt+1]),reportLink=path.relative(output,target).split(path.sep).join('/');
const markdown=['# Formes abstraites — revue Canvas','',report.actions.length+' poses statiques, '+report.stances.length+' stances et '+report.portraits.length+' portraits vérifiés.','',
  'Renderer de production sous Node/Skia : sources exactes, retournement, ancre conservée et échelle uniforme. Chaque planche garde une échelle commune et commence par la stance de référence. Les plafonds de largeur restent propres aux nouvelles abstractions. Cette passe ne prouve ni un parcours navigateur ni une fidélité canonique 1:1.','',
  '[Rapport détaillé](character-canvas-review.json) · [Bilan]('+reportLink+')','','| Apparence | Actions | Planche |','| --- | ---: | --- |',
  ...appearances.map(a=>'| '+a.name+' | '+report.actions.filter(p=>p.id===a.id).length+'/9 | ['+a.id+'](actions-'+a.id+'.jpg) |'),
  '','[Portraits individuels](archive-portraits-01.jpg)',''].join('\n');
await fs.writeFile(path.join(output,'README.md'),markdown);
console.log(JSON.stringify({output,...report.counts,complete:report.complete}));
if(!partial)assert.deepEqual(report.missing,[]);


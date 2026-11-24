/** Production Canvas2D and unchanged CombatEngine verification under native Skia.
 * Not a browser interaction or canonical 1:1 certification.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const repo = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const imageSources = new WeakMap(), decodedSources = new WeakMap();
globalThis.Image = class extends NativeImage {
  set src(value) {
    const source = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof source === 'string') imageSources.set(this, path.resolve(source));
    super.src = source;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1), ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx);
  canvas.isConnected = true;
  ctx.drawImage = (source, ...coordinates) => {
    const file = imageSources.get(source) || decodedSources.get(source);
    if (file) decodedSources.set(canvas, file);
    return draw(source, ...coordinates);
  };
  return canvas;
} };
const { FIGHTERS, STAGES } = await import('../combat/data.mjs');
const { ART_FILES } = await import('../combat/offline-manifest.mjs');
const { CombatEngine, FIXED_DT, getHurtbox } = await import('../combat/engine.mjs');
const { CombatRenderer } = await import('../combat/render.mjs');
const { standingIllustration } = await import('../combat/illustrations.mjs');
const { PROJECTILE_ART, projectileArtSpec } = await import('../combat/projectile-art.mjs');
const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? 'audit-combat/projectiles-2026-11-24' : args[at + 1]);
assert.ok(!args.includes('--abstraction-scenes'), 'The optional six-scene appendix was not restored; use the separate stage review.');
await fs.mkdir(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const report = {
  schema: 'encore-projectile-canvas-review/v1', createdAt: new Date().toISOString(),
  method: 'Production Canvas2D renderer and unchanged CombatEngine, executed by Node and native Skia.',
  limitations: ['No browser, DOM, input, audio or service-worker verification.',
    'No canonical 1:1 certification; accessories and combat are original fan-game adaptations.',
    'Gallery shots are repositioned; the trace keeps original simulated coordinates.',
    'The fused trick box is not reflectable in the actual rules.'],
  sourceHashes: {}, images: [], shots: [], aquaticOrigins: [], outputImages: [], browserTestStatus: 'not_executed',
};
for (const file of ['combat/data.mjs','combat/abstractions-content.mjs','combat/engine.mjs',
  'combat/projectile-art.mjs','combat/render-presentation.mjs','combat/render.mjs',
  'combat/render-sequences.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs',
  'scripts/render-combat-projectile-review.mjs']) report.sourceHashes[file] = sha(await fs.readFile(path.join(repo, file)));
const stage = STAGES.find(item => item.id === 'bigtop'), reflector = FIGHTERS.find(item => item.id === 'kinger');
const copy = value => JSON.parse(JSON.stringify(value));
function simulate(attacker, slot, direction) {
  const engine = new CombatEngine({ fighters: [attacker, reflector], stage, skipIntro: true,
    mode: 'local', cpu: [false, false], seed: 20261124 });
  engine.state.a.x = direction === 1 ? 300 : 980;
  engine.state.b.x = direction === 1 ? 760 : 520;
  engine.state.a.meter = 100;
  let normal = null, reflected = null, requestedParry = false;
  const move = attacker.moves[slot], reflectable = !move.fuse && !['explosive','fire','rocket'].includes(move.tag);
  for (let frame = 0; frame < 170; frame++) {
    const current = engine.state;
    const projectile = current.projectiles.find(item => !item.dead && !item.delay && item.owner === 0);
    const input = [frame === 0 ? { slot } : {}, {}];
    const parryRange = projectile && Math.abs(projectile.vx) * (reflector.moves.specialBack.startup + 4)
      + reflector.combat.simulationBody.width / 2 + 8;
    if (reflectable && projectile && !requestedParry && Math.abs(current.b.x - projectile.x) <= parryRange) {
      input[1] = { slot: 'specialBack' }; requestedParry = true;
    }
    engine.step(FIXED_DT, input);
    const state = engine.state;
    const first = state.projectiles.find(item => !item.dead && !item.delay && item.owner === 0);
    if (!normal && first) normal = { q: copy(first), actors: copy([state.a,state.b]), frame: state.frame };
    const returned = state.projectiles.find(item => item.owner === 1 && item.reflections === 1);
    if (returned) { reflected = { q: copy(returned), actors: copy([state.a,state.b]), frame: state.frame }; break; }
    if (!reflectable && normal) break;
  }
  assert.ok(normal, attacker.id + '/' + slot + ': actual projectile');
  assert.equal(Math.sign(normal.q.vx), direction);
  if (reflectable) {
    assert.ok(reflected, attacker.id + '/' + slot + ': timed parry');
    assert.equal(Math.sign(reflected.q.vx), -direction);
    assert.equal(reflected.q.def.name, normal.q.def.name);
    assert.equal(engine.state.metrics.reflect, 1);
  }
  return { normal, reflected, reflectable };
}
function backdrop(ctx, width, height) {
  ctx.fillStyle = '#182131'; ctx.fillRect(0,0,width,height);
  for (let y=0;y<height;y+=20) for(let x=0;x<width;x+=20) if((x/20+y/20)%2) {
    ctx.fillStyle='#253247'; ctx.fillRect(x,y,20,20);
  }
}
const gallery=createCanvas(1280,1650), renderer=new CombatRenderer(gallery);
gallery.width=1280; gallery.height=1650;
const ctx=renderer.ctx; backdrop(ctx,1280,1650);
ctx.fillStyle='#fff2d0'; ctx.font='bold 24px sans-serif'; ctx.fillText('ENCORE / 15 PROJECTILES / RENDU NATIF',20,36);
ctx.font='15px sans-serif';
for(const [label,x] of [['Motif',20],['Tir → · 1×',260],['Tir ← · 1×',430],['Renvoi ← · 1×',590],['Renvoi → · 1×',760],['Détail · 3×',1010]]) ctx.fillText(label,x,68);
let sampled=[];
const draw=ctx.drawImage.bind(ctx);
ctx.drawImage=(source,...coordinates)=>{sampled.push({source,coordinates,matrix:ctx.getTransform()});return draw(source,...coordinates);};
function drawShot(spec, frame, snapshot, x, y, zoom=1) {
  const projectile={...snapshot.q,x:zoom===1?x:0,y:zoom===1?y:0}, before=JSON.stringify([projectile,snapshot.actors]);
  assert.equal(projectileArtSpec(projectile,snapshot.actors[projectile.owner]).id,spec.id);
  sampled=[];ctx.save();
  if(zoom!==1){ctx.translate(x,y);ctx.scale(zoom,zoom);}
  renderer.drawProjectile(projectile,snapshot.actors,0,true);ctx.restore();
  assert.equal(JSON.stringify([projectile,snapshot.actors]),before);
  const emitted=sampled.find(item=>item.source===frame.canvas);
  assert.ok(emitted,spec.id+': exact native art, not fallback');
  assert.equal(decodedSources.get(emitted.source),path.resolve(repo,'combat',spec.src));
  const [sx,sy,sw,sh,dx,dy,dw,dh]=emitted.coordinates;
  assert.deepEqual([sx,sy,sw,sh],[frame.bounds.x,frame.bounds.y,frame.bounds.width,frame.bounds.height]);
  assert.ok(Math.abs(dw/sw-dh/sh)<1e-8);assert.equal(dx,-dw/2);assert.equal(dy,-dh/2);
  const {a,b,c,d}=emitted.matrix;
  assert.ok(Math.abs(Math.hypot(a,b)-Math.hypot(c,d))<1e-8);
  assert.equal(Math.sign(a),Math.sign(snapshot.q.vx));
  if(spec.motion!=='velocity')assert.ok(d>0);
  return {exactSource:true,uniformScale:true,facingVerified:true,logicalWidth:dw,logicalHeight:dh,
    nativeVelocity:snapshot.q.vx,owner:snapshot.q.owner,reflections:snapshot.q.reflections,
    matrix:{a,b,c,d},direction:Math.sign(snapshot.q.vx),zoom};
}
for(const [index,spec] of Object.values(PROJECTILE_ART).entries()) {
  assert.ok(ART_FILES.includes(spec.src),spec.id+': published');
  const file=path.resolve(repo,'combat',spec.src),bytes=await fs.readFile(file);
  const frame=await renderer.projectileArt.load(spec);assert.ok(frame?.canvas);
  const attacker=FIGHTERS.find(f=>Object.values(f.moves).some(m=>m.kind==='projectile'&&projectileArtSpec({def:m},{f})?.id===spec.id));
  assert.ok(attacker);
  const [slot]=Object.entries(attacker.moves).find(([,m])=>m.kind==='projectile'&&projectileArtSpec({def:m},{f:attacker})?.id===spec.id);
  const right=simulate(attacker,slot,1),left=simulate(attacker,slot,-1),y=125+index*100;
  ctx.fillStyle='#f0e6d4';ctx.font='bold 15px sans-serif';ctx.fillText(spec.id,20,y-10);
  ctx.fillStyle='#aebbd0';ctx.font='12px sans-serif';ctx.fillText(attacker.id,20,y+10);
  const checks=[drawShot(spec,frame,right.normal,300,y),drawShot(spec,frame,left.normal,470,y)];
  if(right.reflected&&left.reflected)checks.push(drawShot(spec,frame,right.reflected,640,y),drawShot(spec,frame,left.reflected,810,y));
  else{ctx.fillStyle='#b0bdd1';ctx.font='12px sans-serif';ctx.fillText('non réfléchissable',590,y+4);ctx.fillText('non réfléchissable',760,y+4);}
  drawShot(spec,frame,right.normal,1060,y,3);
  report.images.push({id:spec.id,file:path.relative(repo,file),sha256:sha(bytes),bytes:bytes.length,
    cacheWidth:frame.canvas.width,cacheHeight:frame.canvas.height,visibleBounds:frame.bounds,nativeFileUnmodified:true});
  report.shots.push({id:spec.id,fighter:attacker.id,slot,reflectable:right.reflectable,moveName:attacker.moves[slot].name,
    rightSpawn:right.normal.q,leftSpawn:left.normal.q,rightReflection:right.reflected?.q||null,leftReflection:left.reflected?.q||null,drawChecks:checks});
}
await fs.writeFile(path.join(output,'projectiles-native-and-reflected.png'),gallery.toBuffer('image/png'));
report.outputImages.push('projectiles-native-and-reflected.png');
if(args.includes('--aquatic-origin')) {
  const aquatic=FIGHTERS.find(f=>f.id==='aquaticabstraction'),arena=STAGES.find(s=>s.id==='abstractionthreshold');
  const canvas=createCanvas(1280,720),originRenderer=new CombatRenderer(canvas);
  assert.equal((await originRenderer.preload([aquatic,reflector],[arena])).ok,true);
  const stance=standingIllustration(aquatic);assert.ok(stance?.canvas);assert.equal(aquatic.visual.anchorX,.78);
  const context=canvas.getContext('2d'),originalDraw=context.drawImage.bind(context);let bodyMatrix;
  context.drawImage=(source,...coordinates)=>{if(source===stance.canvas)bodyMatrix=context.getTransform();return originalDraw(source,...coordinates);};
  for(const direction of [1,-1]) {
    const engine=new CombatEngine({fighters:[aquatic,reflector],stage:arena,skipIntro:true,mode:'local',cpu:[false,false],seed:20261124});
    if(direction===-1)[engine.state.a.x,engine.state.b.x]=[engine.state.b.x,engine.state.a.x];
    let projectile;
    for(let frame=0;frame<90;frame++){
      engine.step(FIXED_DT,[frame===0?{slot:'special'}:{},{}]);
      projectile=engine.state.projectiles.find(q=>!q.dead&&!q.delay);if(projectile)break;
    }
    assert.ok(projectile);assert.equal(Math.sign(projectile.vx),direction);
    const before=JSON.stringify(engine.getSnapshot());bodyMatrix=null;
    originRenderer.render(engine.state,{reducedMotion:true,hitboxes:true});
    assert.equal(JSON.stringify(engine.getSnapshot()),before);assert.ok(bodyMatrix);
    assert.equal(decodedSources.get(stance.canvas),path.resolve(repo,'assets/encore/abstractions/aquaticabstraction/stance.png'));
    const {a,b,c,d,e,f}=bodyMatrix,bounds=stance.bounds;
    const corners=[[bounds.x,bounds.y],[bounds.x+bounds.width,bounds.y],[bounds.x,bounds.y+bounds.height],[bounds.x+bounds.width,bounds.y+bounds.height]];
    const xs=corners.map(([x,y])=>a*x+c*y+e),headBoundX=direction===1?Math.max(...xs):Math.min(...xs);
    const actor=engine.state.a,spawnX=actor.x+direction*projectile.def.projectileOrigin[direction].forward,margin=direction*(spawnX-headBoundX);
    assert.ok(margin>0,'unadvanced projectile centre ahead of the full visible head bounds');
    assert.equal(Math.sign(a),direction);assert.ok(Math.abs(Math.hypot(a,b)-Math.hypot(c,d))<1e-8);
    assert.ok(Math.abs(Math.hypot(c,d)*bounds.height-200)<1e-6);
    const body=getHurtbox(actor);assert.deepEqual([body.w,body.h],[195,200]);
    const file='aquatic-origin-'+(direction===1?'right':'left')+'.jpg';
    await fs.writeFile(path.join(output,file),canvas.toBuffer('image/jpeg',91));report.outputImages.push(file);
    report.aquaticOrigins.push({direction,file,exactSource:true,uniformScale:true,authoredAnchorX:aquatic.visual.anchorX,
      visibleHeight:200,simulationBody:body,nativeStanceWidth:bounds.width*200/bounds.height,headBoundX,spawnX,spawnMargin:margin,
      firstFrameProjectileX:projectile.x,projectileMove:projectile.def.name,projectileArt:projectileArtSpec(projectile,actor)?.id,
      matrix:{a,b,c,d,e,f},simulationUnchangedByRendering:true,
      decorativeScope:'Trailing tendrils remain decorative outside the new 195 × 200 collision body.'});
  }
}
report.counts={images:report.images.length,simulatedShots:report.shots.length*2,
  actualReflections:report.shots.filter(s=>s.reflectable).length*2,
  nativeDrawChecks:report.shots.reduce((sum,s)=>sum+s.drawChecks.length,0),scenes:0,aquaticOriginChecks:report.aquaticOrigins.length};
await fs.writeFile(path.join(output,'projectile-canvas-review.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,...report.counts}));


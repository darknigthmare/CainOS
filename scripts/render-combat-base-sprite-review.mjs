/** Review declared static bases through the production Canvas renderer.
 * This is a native Skia check, not a browser run or an animation certificate.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => { const index = args.indexOf(name); return index < 0 ? fallback : args[index + 1]; };
const output = path.resolve(option('--output', path.join(root, 'docs/art-generation/base-sprites-20261124/canvas')));
const selectedId = option('--appearance', null);
const worker = args.includes('--worker');
assert.ok(!worker || selectedId, '--worker requires one appearance');
async function canvasModule() {
  try { return await import('@napi-rs/canvas'); }
  catch (error) {
    if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
    return import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
  }
}

async function runSequential() {
  const { spawnSync } = await import('node:child_process');
  const { BASE_SPRITE_COSTUMES } = await import('../combat/data.mjs');
  assert.ok(BASE_SPRITE_COSTUMES.length, 'No verified static bases to review');
  await fs.mkdir(path.join(output, 'families'), { recursive: true });
  let report;
  const execution = [];
  for (const costume of BASE_SPRITE_COSTUMES) {
    const result = spawnSync(process.execPath, ['--expose-gc', '--max-old-space-size=128',
      fileURLToPath(import.meta.url), '--appearance', costume.id, '--worker', '--output', output],
    { encoding: 'utf8', timeout: 60000, maxBuffer: 1024*1024 });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    execution.push({ id: costume.id, status: result.status, signal: result.signal || null });
    await fs.writeFile(path.join(output, 'batch-progress.json'), JSON.stringify({
      schema: 'encore-static-base-canvas-batch/v1', complete: false, expected: BASE_SPRITE_COSTUMES.length, execution,
    }, null, 2)+'\n');
    assert.equal(result.error, undefined, costume.id+': worker error');
    assert.equal(result.status, 0, costume.id+': worker must complete before the next family starts');
    const part = JSON.parse(await fs.readFile(path.join(output, 'families', costume.id+'.json'), 'utf8'));
    assert.equal(part.summary.pass, true); assert.equal(part.selectedId, costume.id);
    assert.equal(part.appearances.length, 1); assert.equal(part.authoredDrawings, 2);
    execution.at(-1).peakRSSBytes = part.summary.peakRSSBytes;
    if (!report) report = { ...part, selectedId: null, authoredDrawings: 0, appearances: [], sheets: [],
      collection: 'One sequential Node process per family, 128 MiB JavaScript heap limit; no simultaneous image workers.' };
    assert.deepEqual(part.sources, report.sources, 'Sources must remain identical between workers');
    assert.equal(part.offlineVersion, report.offlineVersion);
    report.authoredDrawings += part.authoredDrawings;
    report.appearances.push(...part.appearances); report.sheets.push(...part.sheets);
  }
  // Only JPEG review sheets are decoded here, after all source-image workers
  // have exited. The overview never retains the native character textures.
  const { createCanvas, loadImage } = await canvasModule();
  const overview = createCanvas(1280, Math.ceil(report.appearances.length/4)*280+52), ctx = overview.getContext('2d');
  ctx.fillStyle='#202737';ctx.fillRect(0,0,overview.width,overview.height);ctx.fillStyle='#2b3548';
  for(let y=0;y<overview.height;y+=24)for(let x=0;x<overview.width;x+=24)if((x/24+y/24)%2)ctx.fillRect(x,y,24,24);
  ctx.fillStyle='#f6e9cc';ctx.font='bold 23px sans-serif';
  ctx.fillText('Bases statiques · portrait et garde · aucun dessin d’action ajouté',18,32);
  for(const [index,row] of report.appearances.entries()) {
    const image=await loadImage(path.join(output,'base-'+row.id+'.jpg'));
    const ox=index%4*320,oy=Math.floor(index/4)*280+52;
    ctx.fillStyle='#f6e9cc';ctx.font='12px sans-serif';ctx.fillText(row.id,ox+8,oy+18);
    const pb=row.files.selection.bounds,ps=Math.min(252/pb.width,290/pb.height);
    const stanceScale=Math.min(1,285/row.visibleHeight,318/row.visibleWidth);
    const views=[{cx:144,floor:373,w:pb.width*ps,h:pb.height*ps,center:ox+80},
      {cx:474,floor:374,w:row.visibleWidth*stanceScale,h:row.visibleHeight*stanceScale,center:ox+238}];
    for(const view of views) {
      const sw=view.w+12,sh=view.h+12,scale=Math.min(150/sw,215/sh);
      ctx.drawImage(image,view.cx-view.w/2-6,view.floor-view.h-6,sw,sh,
        view.center-sw*scale/2,oy+250-sh*scale,sw*scale,sh*scale);
    }
    ctx.getImageData(0,0,1,1);globalThis.gc?.();
  }
  await fs.writeFile(path.join(output,'bases-overview.jpg'),overview.toBuffer('image/jpeg',88));
  report.sheets.push('bases-overview.jpg');
  report.execution=execution;
  report.summary={appearances:report.appearances.length,authoredDrawings:report.authoredDrawings,
    sourceAndFacingChecks:report.appearances.reduce((n,row)=>n+row.drawChecks.length,0),
    actualStateDraws:report.appearances.reduce((n,row)=>n+row.drawChecks.length*3,0),
    portraits:report.appearances.length,peakWorkerRSSBytes:Math.max(...execution.map(row=>row.peakRSSBytes)),pass:true};
  assert.equal(report.appearances.length,BASE_SPRITE_COSTUMES.length);
  assert.equal(report.authoredDrawings,BASE_SPRITE_COSTUMES.length*2);
  for(const [file,hash] of Object.entries(report.sources))assert.equal(createHash('sha256').update(await fs.readFile(path.join(root,file))).digest('hex'),hash,'Source changed during batch: '+file);
  await fs.writeFile(path.join(output,'base-canvas-review.json'),JSON.stringify(report,null,2)+'\n');
  await fs.writeFile(path.join(output,'batch-progress.json'),JSON.stringify({schema:'encore-static-base-canvas-batch/v1',complete:true,expected:BASE_SPRITE_COSTUMES.length,execution},null,2)+'\n');
  await fs.writeFile(path.join(output,'README.md'),`# Bases statiques — revue Canvas\n\n${report.summary.appearances} familles, ${report.authoredDrawings} dessins de base et ${report.summary.sourceAndFacingChecks} contrôles état/direction. Chaque contrôle utilise la même garde aux temps 0 et 600, puis avec mouvements réduits. Aucun dessin d’action supplémentaire n’est revendiqué.\n\nUne seule famille est décodée par processus Node ; les processus sont strictement séquentiels. Le portrait et la garde sont distincts. Les planches proviennent du renderer de production, dans les deux sens, avec échelle uniforme et ancres conservées. Les données de combat ne sont pas modifiées. L’aperçu global est assemblé à partir de ces planches vérifiées.\n\nCette preuve native Skia ne vaut pas test navigateur ni certification canonique 1:1.\n\n${report.appearances.map(row=>'- ['+row.id+'](base-'+row.id+'.jpg)').join('\n')}\n`);
  overview.width=1;overview.height=1;globalThis.gc?.();
  console.log(JSON.stringify({output,...report.summary}));
}

if (!selectedId && !worker) {
  await runSequential();
} else {
const skia = await canvasModule();
const { createCanvas, Image: NativeImage } = skia;
const sourceFiles = new WeakMap(), canvasFiles = new WeakMap(), requests = [];
globalThis.Image = class extends NativeImage {
  set src(value) {
    const filename = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof filename === 'string') { sourceFiles.set(this, path.resolve(filename)); requests.push(path.resolve(filename)); }
    super.src = filename;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1), context = canvas.getContext('2d'), draw = context.drawImage.bind(context);
  context.drawImage = (source, ...coordinates) => {
    const filename = sourceFiles.get(source) || canvasFiles.get(source);
    if (filename) canvasFiles.set(canvas, filename);
    return draw(source, ...coordinates);
  };
  return canvas;
} };

const { FIGHTERS, BASE_SPRITE_COSTUMES, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES, OFFLINE_VERSION } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer, drawPortrait } = await import('../combat/render.mjs');
const { ACTION_ART, loadFighterIllustration, actionIllustration, warmCombatPoses } = await import('../combat/illustrations.mjs');
const appearances = BASE_SPRITE_COSTUMES.filter(costume => !selectedId || costume.id === selectedId);
assert.ok(appearances.length, 'No verified and published static family selected');
if (selectedId) assert.equal(appearances.length, 1, 'Unknown or unpublished appearance');
await fs.mkdir(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const published = new Set(ART_FILES);
const report = {
  schema: 'encore-static-base-canvas-review/v1', createdAt: new Date().toISOString(), offlineVersion: OFFLINE_VERSION,
  method: 'Production Canvas2D renderer, native Skia; exact source path, uniform scale, facing, anchor and static reuse checked.',
  selectedId, authoredSlots: ['selection', 'stance'], authoredDrawings: 0,
  browserTestStatus: 'not_executed', sources: {}, appearances: [], sheets: [],
  limitations: ['A repeated stance is one authored base, not nine action drawings or frame-by-frame animation.',
    'Native Canvas does not exercise DOM, input, audio, service workers or a physical device.',
    'Technical rendering checks do not certify canonical 1:1 identity or hidden anatomy.'],
};
const sourceNames = ['combat/base-sprite-content.mjs', 'combat/base-sprite-continuation-20261125.mjs', 'combat/base-sprite-continuation-20261125-b.mjs', 'combat/base-sprite-continuation-20261127.mjs', 'combat/data.mjs', 'combat/crossovers.mjs',
  'combat/fidelity.mjs', 'combat/illustrations.mjs', 'combat/render.mjs', 'combat/render-poses.mjs',
  'combat/render-sequences.mjs', 'combat/engine.mjs', 'combat/offline-manifest.mjs', 'scripts/render-combat-base-sprite-review.mjs'];
for (const file of sourceNames) report.sources[file] = sha(await fs.readFile(path.join(root, file)));

const arena = createCanvas(1280, 720), renderer = new CombatRenderer(arena), context = renderer.ctx;
let samples = [];
const drawArena = context.drawImage.bind(context);
context.drawImage = (source, ...coordinates) => {
  samples.push({ source, matrix: context.getTransform() }); return drawArena(source, ...coordinates);
};
const matrixValues = m => ({ a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f });
const transform = (m, x, y) => ({ x: m.a*x + m.c*y + m.e, y: m.b*x + m.d*y + m.f });
function bounds(frame, matrix) {
  const b = frame.bounds;
  const p = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y]) => transform(matrix,x,y));
  return { left: Math.min(...p.map(v=>v.x)), right: Math.max(...p.map(v=>v.x)), top: Math.min(...p.map(v=>v.y)), bottom: Math.max(...p.map(v=>v.y)) };
}
function checker(ctx, width, height) {
  ctx.fillStyle = '#202737'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#2b3548';
  for (let y=0;y<height;y+=24) for (let x=0;x<width;x+=24) if ((x/24+y/24)%2) ctx.fillRect(x,y,24,24);
}
const overview = createCanvas(worker ? 1 : 1280, worker ? 1 : Math.ceil(appearances.length/4)*280+52), overviewContext = overview.getContext('2d');
checker(overviewContext, overview.width, overview.height);
overviewContext.fillStyle = '#f6e9cc'; overviewContext.font = 'bold 23px sans-serif';
overviewContext.fillText('Bases statiques · portrait et garde · aucun dessin d’action ajouté', 18, 32);
const states = ['stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat'];

for (const [appearanceIndex, costume] of appearances.entries()) {
  globalThis.gc?.();
  const owner = FIGHTERS.find(fighter => fighter.id === costume.fighterId), f = equipCostume(owner, costume.id);
  assert.equal(f.costume, costume.id); assert.equal(f.sprite.baseOnly, true); assert.equal(f.animation, null);
  assert.equal(f.combat, owner.combat); assert.equal(f.moves, owner.moves);
  const beforeRequests = requests.length;
  const files = Object.fromEntries(['selection','stance'].map(slot => [slot, f.sprite.crossoverDirectory+'/'+slot+'.png']));
  for (const file of Object.values(files)) assert.ok(published.has(file), file+' must be in the exact offline manifest');
  const frames = {};
  for (const slot of ['selection','stance']) {
    frames[slot] = await loadFighterIllustration(slot, f);
    assert.ok(frames[slot]?.canvas, costume.id+'/'+slot+': native decode');
    assert.equal(canvasFiles.get(frames[slot].canvas), path.resolve(root,'combat',files[slot]), 'Exact native source');
  }
  const row = { id: costume.id, fighterId: owner.id, authoredDrawings: 2, reusedGuardStates: states.slice(1), files: {}, drawChecks: [] };
  for (const slot of ['selection','stance']) {
    const bytes = await fs.readFile(path.resolve(root,'combat',files[slot]));
    row.files[slot] = { file: files[slot].replace('../',''), bytes: bytes.length, sha256: sha(bytes), bounds: frames[slot].bounds, nativeFacing: frames[slot].nativeFacing };
    assert.equal(row.files[slot].sha256, costume.assetReview.sha256[slot], costume.id+'/'+slot+': reviewed bytes');
  }
  assert.notEqual(row.files.selection.sha256, row.files.stance.sha256, 'Two distinct authored bases');
  for (const action of [...ACTION_ART,'heavy']) {
    assert.equal(await loadFighterIllustration('poses',f,action), null);
    assert.equal(actionIllustration(f,action), null);
  }
  await warmCombatPoses([f],()=>true);
  const stable = new Map(), source = frames.stance;
  for (const state of states) for (const face of [1,-1]) {
    const actor = { f, slot: 0, state: state === 'stance' ? 'idle' : state, x: 640, y: 568, face, onGround: state !== 'jump' };
    const phase = state === 'intro' ? 'intro' : ['victory','defeat'].includes(state) ? 'matchOver' : 'fight';
    if (['attack','heavy'].includes(state)) {
      const slot = state === 'attack' ? 'light' : 'heavy'; actor.attack = { name: slot, def: f.moves[slot], t: f.moves[slot].startup };
    }
    const before = JSON.stringify(actor);
    for (const [tick,reducedMotion] of [[0,false],[600,false],[600,true]]) {
      samples = []; context.clearRect(0,0,1280,720);
      renderer.drawActor(actor,tick,reducedMotion,{phase,presentationFrame:tick,winner:state==='defeat'?1:0});
      // Force native raster work now rather than retaining deferred commands
      // across states. The source PNGs and decoded stance stay untouched.
      context.getImageData(0,0,1,1);
      const emitted = samples.find(sample=>sample.source===source.canvas);
      assert.ok(emitted,costume.id+'/'+state+': own stance drawn');
      const m = matrixValues(emitted.matrix);
      if (!stable.has(face)) stable.set(face,m);
      assert.deepEqual(m,stable.get(face),costume.id+'/'+state+': same stance geometry at every time and state');
      assert.equal(Math.sign(m.a),face*source.nativeFacing);
      assert.ok(Math.abs(Math.hypot(m.a,m.b)-Math.hypot(m.c,m.d))<1e-8,'Uniform scale');
      const anchorX = Math.max(0,Math.min(1,f.visual?.anchorX ?? .5));
      const anchor = transform(m,source.bounds.x+source.bounds.width*anchorX,source.bounds.y+source.bounds.height);
      assert.ok(Math.abs(anchor.x-actor.x)<.01 && Math.abs(anchor.y-actor.y)<.01,'Own actor anchor');
      const maximumWidth=f.visual?.maxIllustratedWidth, height=f.visual?.height || f.combat.simulationBody.height;
      const expectedScale=Number.isFinite(maximumWidth)&&maximumWidth>0 ? Math.min(height/source.bounds.height,maximumWidth/source.bounds.width) : height/source.bounds.height;
      assert.ok(Math.abs(Math.abs(m.a)-expectedScale)<1e-6,'Stance dimensions, never action-height normalization');
    }
    assert.equal(JSON.stringify(actor),before,'Read-only presentation');
    row.drawChecks.push({state,face,source:row.files.stance.file,matrix:stable.get(face),timeSamples:[0,600],reducedMotion:true,uniformScale:true,anchorVerified:true});
  }
  const portrait=createCanvas(260,300), pc=portrait.getContext('2d'), portraitDraw=pc.drawImage.bind(pc); let portraitSource;
  pc.drawImage=(image,...coordinates)=>{portraitSource=canvasFiles.get(image);return portraitDraw(image,...coordinates);};
  assert.equal(await drawPortrait(portrait,f,{selection:true,glow:false}),true);
  assert.equal(portraitSource,path.resolve(root,'combat',files.selection),'Production portrait uses its own selection');
  row.portraitSourceVerified=true;
  const width=source.bounds.width*Math.abs(stable.get(1).a), height=source.bounds.height*Math.abs(stable.get(1).d);
  row.visibleWidth=width;row.visibleHeight=height;row.maxIllustratedWidth=f.visual?.maxIllustratedWidth ?? null;
  const sheet=createCanvas(1024,440), sc=sheet.getContext('2d'); checker(sc,1024,440);
  sc.fillStyle='#f6e9cc';sc.font='bold 22px sans-serif';sc.fillText(costume.id,18,32);
  sc.font='16px sans-serif';sc.fillText('Deux dessins de base ; même garde intacte pour tous les états non dessinés.',18,423);
  const portraitFrame=frames.selection, pb=portraitFrame.bounds, ps=Math.min(252/pb.width,290/pb.height);
  sc.drawImage(portraitFrame.canvas,pb.x,pb.y,pb.width,pb.height,144-pb.width*ps/2,373-pb.height*ps,pb.width*ps,pb.height*ps);
  sc.fillText('Portrait propre',65,66);
  function drawStanding(targetContext, face, centerX, floor, scale) {
    const world=bounds(source,stable.get(face)); targetContext.save();
    targetContext.translate(centerX-(world.left+world.right)/2*scale,floor-world.bottom*scale);targetContext.scale(scale,scale);
    const previous=renderer.ctx;
    try { renderer.ctx=targetContext;renderer.drawActor({f,slot:0,state:'idle',x:640,y:568,face,onGround:true},0,true,{phase:'fight'}); }
    finally {renderer.ctx=previous;targetContext.restore();}
  }
  const previewScale=Math.min(1,285/height,318/width);
  for (const [face,x] of [[1,474],[-1,824]]) {sc.fillText(face===1?'Garde vers la droite':'Même garde vers la gauche',x-100,66);drawStanding(sc,face,x,374,previewScale);}
  const filename='base-'+costume.id+'.jpg';await fs.writeFile(path.join(output,filename),sheet.toBuffer('image/jpeg',88));report.sheets.push(filename);
  if (!worker) {
  const ox=appearanceIndex%4*320,oy=Math.floor(appearanceIndex/4)*280+52;
  overviewContext.fillStyle='#f6e9cc';overviewContext.font='12px sans-serif';overviewContext.fillText(costume.id,ox+8,oy+18);
  const smallPortraitScale=Math.min(140/pb.width,215/pb.height);
  overviewContext.drawImage(portraitFrame.canvas,pb.x,pb.y,pb.width,pb.height,ox+80-pb.width*smallPortraitScale/2,oy+250-pb.height*smallPortraitScale,pb.width*smallPortraitScale,pb.height*smallPortraitScale);
  drawStanding(overviewContext,1,ox+238,oy+250,Math.min(1,215/height,150/width));
  }
  const expectedRequests=Object.values(files).map(file=>path.resolve(root,'combat',file));
  assert.deepEqual([...new Set(requests.slice(beforeRequests))].sort(),expectedRequests.sort(),'No pose or old-atlas requests');
  row.uniqueRequestedFiles=2;report.authoredDrawings+=2;report.appearances.push(row);
  sheet.width=1;sheet.height=1;portrait.width=1;portrait.height=1;globalThis.gc?.();
  console.log(JSON.stringify({id:costume.id,authoredDrawings:2,stateFacingChecks:row.drawChecks.length,visibleWidth:width,visibleHeight:height}));
}
if (!worker) { await fs.writeFile(path.join(output,'bases-overview.jpg'),overview.toBuffer('image/jpeg',88));report.sheets.push('bases-overview.jpg'); }
for(const file of sourceNames)assert.equal(sha(await fs.readFile(path.join(root,file))),report.sources[file],'Source changed during review: '+file);
report.summary={appearances:report.appearances.length,authoredDrawings:report.authoredDrawings,sourceAndFacingChecks:report.appearances.reduce((n,row)=>n+row.drawChecks.length,0),actualStateDraws:report.appearances.reduce((n,row)=>n+row.drawChecks.length*3,0),portraits:report.appearances.length,peakRSSBytes:process.resourceUsage().maxRSS*1024,pass:true};
const reportFile=worker ? path.join(output,'families',selectedId+'.json') : path.join(output,'base-canvas-review.json');
await fs.mkdir(path.dirname(reportFile),{recursive:true});
await fs.writeFile(reportFile,JSON.stringify(report,null,2)+'\n');
if (!worker) await fs.writeFile(path.join(output,'README.md'),`# Bases statiques — revue Canvas\n\n${report.summary.appearances} familles, ${report.authoredDrawings} dessins de base et ${report.summary.sourceAndFacingChecks} contrôles état/direction. Chaque contrôle utilise la même garde aux temps 0 et 600, puis avec mouvements réduits. Aucun dessin d’action supplémentaire n’est revendiqué.\n\nLe portrait et la garde de chaque famille sont distincts. Les planches montrent le rendu de production dans les deux sens, avec une échelle uniforme et les ancres conservées. Les données de combat ne sont pas modifiées.\n\nCette preuve native Skia ne vaut pas test navigateur ni certification de fidélité canonique 1:1.\n`);
arena.width=1;arena.height=1;overview.width=1;overview.height=1;globalThis.gc?.();
console.log(JSON.stringify({output, ...report.summary}));
}

/** All complete scenic paintings through the production renderer.
 * Native Skia evidence, never a browser run or a canonical 1:1 certificate.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = fileURLToPath(new URL('../', import.meta.url));
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const sourceFiles = new WeakMap(), decodedFiles = new WeakMap();
globalThis.Image = class extends NativeImage {
  set src(value) {
    const filename = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof filename === 'string') sourceFiles.set(this, path.resolve(filename));
    super.src = filename;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1), ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx);
  canvas.isConnected = true;
  ctx.drawImage = (source, ...coordinates) => {
    const file = sourceFiles.get(source) || decodedFiles.get(source);
    if (file) decodedFiles.set(canvas, file);
    return draw(source, ...coordinates);
  };
  return canvas;
} };
const { FIGHTERS, STAGES, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES, OFFLINE_VERSION } = await import('../combat/offline-manifest.mjs');
const { REBUILT_STAGE_SCENES } = await import('../combat/stage-scenes-20261127.mjs');
const { loadStagePlanes, drawStagePlanes } = await import('../combat/stage-parallax.mjs');
const { CombatEngine } = await import('../combat/engine.mjs');
const { CombatRenderer } = await import('../combat/render.mjs');
const { standingIllustration } = await import('../combat/illustrations.mjs');
const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? path.join(repo, 'docs/art-generation/recovery-20261127/stages/canvas') : args[at + 1]);
await fs.mkdir(output, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const pixels = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
const pixelHash = canvas => hash(pixels(canvas));
const report = {
  schema: 'encore-complete-stage-canvas-review/v1', createdAt: new Date().toISOString(), offlineVersion: OFFLINE_VERSION,
  method: 'Production scene loader, camera, CombatEngine initialization and CombatRenderer executed with native Skia.',
  sourceHashes: {}, stages: [], outputImages: [],
  limitations: ['Initialized duel captures are not played matches.',
    'Native Skia does not exercise browser DOM, controls, audio, offline service workers or physical devices.',
    'Each scene is one complete painting, not three independently moving parallax planes.',
    'Official identity references guide each setting; camera widening and unseen continuity are Encore adaptations, not certified 1:1 reconstructions.'],
};
const runtimeFiles = (await fs.readdir(path.join(repo, 'combat'))).filter(name => name.endsWith('.mjs')).sort().map(name => 'combat/' + name);
for (const name of [...runtimeFiles, 'scripts/render-combat-rebuilt-stage-review.mjs']) report.sourceHashes[name] = hash(await fs.readFile(path.join(repo, name)));
const overview = createCanvas(1280, Math.ceil(Object.keys(REBUILT_STAGE_SCENES).length / 2) * 396), overviewContext = overview.getContext('2d');
overviewContext.fillStyle = '#101725'; overviewContext.fillRect(0, 0, overview.width, overview.height);
async function save(name, canvas) {
  await fs.writeFile(path.join(output, name), canvas.toBuffer('image/jpeg', 91)); report.outputImages.push(name);
}
function assertOpaque(canvas, label) {
  const rgba = pixels(canvas);
  for (let offset = 3; offset < rgba.length; offset += 4) assert.equal(rgba[offset], 255, label + ': opaque at every pixel');
}
const fighters = [equipCostume(FIGHTERS.find(f => f.id === 'kaufmo'), 'glitch-murderdrones-kaufmo-hommage'), FIGHTERS.find(f => f.id === 'jax')];
assert.ok(fighters.every(Boolean)); assert.equal(fighters[0].costume, 'glitch-murderdrones-kaufmo-hommage');
for (const [index, [id, scene]] of Object.entries(REBUILT_STAGE_SCENES).entries()) {
  const stage = STAGES.find(item => item.id === id); assert.ok(stage, id);
  assert.ok(ART_FILES.includes(scene.path), id + ': published complete painting');
  const native = path.resolve(repo, 'combat', scene.path), bytes = await fs.readFile(native);
  const beforeStage = JSON.stringify(stage), set = await loadStagePlanes(stage);
  assert.ok(set?.complete); assert.equal(set.fullScene, true); assert.equal(set.layers.length, 1);
  assert.equal(decodedFiles.get(set.layers[0]), native);
  const row = { id, path: path.relative(repo, native), bytes: bytes.length, sha256: hash(bytes),
    exactNativeFileLoaded: true, completePaintingCount: 1, cameraChecks: [] };
  const strip = createCanvas(1920, 394), stripCtx = strip.getContext('2d');
  stripCtx.fillStyle = '#101725'; stripCtx.fillRect(0, 0, 1920, 394);
  for (const [cameraIndex, camera] of [-1, 0, 1].entries()) {
    const canvas = createCanvas(1280, 720), ctx = canvas.getContext('2d');
    drawStagePlanes(ctx, set.layers, camera); assertOpaque(canvas, id + '/' + camera);
    row.cameraChecks.push({ camera, pixelSha256: pixelHash(canvas), opaquePixels: 1280 * 720 });
    stripCtx.fillStyle = '#f4e9d5'; stripCtx.font = '20px sans-serif'; stripCtx.fillText(id + ' / caméra ' + camera, cameraIndex * 640 + 12, 25);
    stripCtx.drawImage(canvas, cameraIndex * 640, 34, 640, 360);
  }
  assert.equal(new Set(row.cameraChecks.map(item => item.pixelSha256)).size, 3);
  await save('camera-' + id + '.jpg', strip);
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
  assert.equal((await renderer.preload(fighters, [stage])).ok, true);
  const empty = { frame: 0, phase: 'fight', stage, fighters: [], traps: [], projectiles: [], fx: [] };
  const ambientHashes = [];
  for (const [ambientFrame, reducedMotion] of [[0, false], [600, false], [600, true]]) {
    renderer.render(empty, { ambientFrame, reducedMotion }); ambientHashes.push(pixelHash(canvas));
  }
  assert.equal(new Set(ambientHashes).size, 1, 'Historical procedural props must not float over a rebuilt room');
  row.ambientDecoration = { frames: [0, 600], reducedMotionAlsoCompared: true, identicalPixels: true };
  const engine = new CombatEngine({ fighters, stage, mode: 'local', cpu: [false, false], skipIntro: true, seed: 20261127 });
  engine.state.a.x = 380; engine.state.b.x = 900;
  const snapshot = JSON.stringify(engine.getSnapshot()), stances = fighters.map(f => standingIllustration(f));
  const draw = renderer.ctx.drawImage.bind(renderer.ctx), actorDraws = [];
  renderer.ctx.drawImage = (source, ...coordinates) => {
    const actor = stances.findIndex(frame => source === frame?.canvas);
    if (actor >= 0) {
      const transform = renderer.ctx.getTransform();
      assert.ok(Math.abs(Math.hypot(transform.a, transform.b) - Math.hypot(transform.c, transform.d)) < 1e-8);
      actorDraws.push({ actor, file: path.relative(repo, decodedFiles.get(source)), scale: Math.hypot(transform.a, transform.b) });
    }
    return draw(source, ...coordinates);
  };
  renderer.render(engine.state, { reducedMotion: true, ambientFrame: 120 });
  assert.equal(actorDraws.length, 2); assert.equal(JSON.stringify(engine.getSnapshot()), snapshot); assert.equal(JSON.stringify(stage), beforeStage);
  row.duel = { fighters: fighters.map(f => ({ id: f.id, costume: f.costume || null })), actorDraws, simulationUnchanged: true, pixelSha256: pixelHash(canvas) };
  await save('duel-' + id + '.jpg', canvas);
  const x = index % 2 * 640, y = Math.floor(index / 2) * 396;
  overviewContext.fillStyle = '#f4e9d5'; overviewContext.font = 'bold 18px sans-serif'; overviewContext.fillText(id + ' / décor complet / duel initialisé', x + 12, y + 25);
  overviewContext.drawImage(canvas, x, y + 34, 640, 360);
  report.stages.push(row);
  globalThis.gc?.();
}
await save('stages-overview.jpg', overview);
for (const [name, sha256] of Object.entries(report.sourceHashes)) assert.equal(hash(await fs.readFile(path.join(repo, name))), sha256, 'Source changed during review: ' + name);
report.counts = { stages: report.stages.length, nativePaintings: report.stages.length,
  cameraCompositions: report.stages.reduce((total, row) => total + row.cameraChecks.length, 0), initializedDuels: report.stages.length };
report.ok = true;
await fs.writeFile(path.join(output, 'stage-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, ...report.counts, ok: report.ok }));

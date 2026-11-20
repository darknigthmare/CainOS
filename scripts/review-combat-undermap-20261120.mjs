/** Reproducible three-camera review through the shipped parallax loader and renderer. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const repo = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? path.join(repo, 'docs/art-generation/stage-next-missing-20261120/review') : args[at + 1]);
await fs.mkdir(output, { recursive: true });
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const requested = new Set();
globalThis.Image = class extends NativeImage {
  set src(value) {
    if (typeof value === 'string' && value.startsWith('file:')) {
      value = fileURLToPath(value); requested.add(path.relative(repo, value));
    }
    super.src = value;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas'); const canvas = createCanvas(1, 1); canvas.isConnected = true; return canvas;
} };
const { getStage, getFighter } = await import('../combat/data.mjs');
const { ART_FILES, ART_BYTES, ART_VERSION, OFFLINE_VERSION } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer } = await import('../combat/render.mjs');
const { CombatEngine } = await import('../combat/engine.mjs');
const { loadStagePlanes, drawStagePlanes, stageCamera } = await import('../combat/stage-parallax.mjs');
const { drawStageMotion } = await import('../combat/render-stage-motion.mjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const stage = getStage('undermap'), expectedFiles = ['far', 'mid', 'near'].map(plane => `assets/encore/stages/undermap/${plane}.png`);
assert.equal(stage.id, 'undermap');
for (const file of expectedFiles) assert.ok(ART_FILES.includes('../' + file), 'Regenerate the offline manifest before review: ' + file);
const stageBefore = JSON.stringify(stage);
const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
renderer.render(null, { stage, reducedMotion: true });
const fallback = canvas.toBuffer('image/png');
await fs.writeFile(path.join(output, 'fallback.png'), fallback);
const circusCanvas = createCanvas(1280, 720);
new CombatRenderer(circusCanvas).render(null, { stage: getStage('bigtop'), reducedMotion: true });
assert.notEqual(hash(fallback), hash(circusCanvas.toBuffer('image/png')), 'Fallback must not substitute the circus');
const fighters = ['pomni', 'gummigoo'].map(getFighter);
const preloaded = await renderer.preload(fighters, [stage]);
assert.equal(preloaded.ok, true, JSON.stringify(preloaded.errors));
const planes = await loadStagePlanes(stage);
assert.equal(planes?.complete, true); assert.equal(planes.layers.length, 3);
for (const file of expectedFiles) assert.ok(requested.has(file), 'Actual loader did not read ' + file);
const report = {
  schema: 'encore-undermap-canvas-review-v1', createdAt: new Date().toISOString(), stage: stage.id,
  method: 'Node + native Skia using production loadStagePlanes, drawStagePlanes and CombatRenderer.',
  browserTestStatus: 'not_executed',
  limitations: ['No browser, DOM, input, audio, service-worker or physical-device assertions.', 'A single official source still grounds palette and materials; layout, parallax and ambient light are fan-game adaptations.', 'Successful rendering does not replace separate visual inspection.'],
  sources: {}, assets: [], cameras: [], scenes: [],
  offline: { version: OFFLINE_VERSION, artVersion: ART_VERSION, images: ART_FILES.length, bytes: ART_BYTES },
  checks: [],
};
for (const file of ['combat/data.mjs', 'combat/fidelity.mjs', 'combat/progression.mjs', 'combat/stories.mjs', 'combat/render.mjs', 'combat/render-stage-motion.mjs', 'combat/stage-parallax.mjs', 'combat/engine.mjs', 'combat/offline-manifest.mjs', 'scripts/review-combat-undermap-20261120.mjs']) {
  report.sources[file] = hash(await fs.readFile(path.join(repo, file)));
}
for (const file of expectedFiles) {
  const bytes = await fs.readFile(path.join(repo, file)); report.assets.push({ file, bytes: bytes.length, sha256: hash(bytes), requested: requested.has(file) });
}
report.checks.push({ name: 'Three published native PNGs decoded through the actual loader', pass: true });
report.checks.push({ name: 'Procedural fallback is distinct from the circus', pass: true, file: 'fallback.png', sha256: hash(fallback) });
const engine = new CombatEngine({ fighters, stage, skipIntro: true, mode: 'local', cpu: [false, false], seed: 20261120 });
const overview = createCanvas(1280, 1140), oc = overview.getContext('2d');
oc.fillStyle = '#11172b'; oc.fillRect(0, 0, overview.width, overview.height);
for (const [index, camera] of [-1, 0, 1].entries()) {
  const label = ['left', 'center', 'right'][index], raw = createCanvas(1280, 720), ctx = raw.getContext('2d');
  drawStagePlanes(ctx, planes.layers, camera);
  const pixels = ctx.getImageData(0, 0, 1280, 720).data;
  for (let i = 3; i < pixels.length; i += 4) assert.equal(pixels[i], 255, label + ': transparent hole in composed stage');
  const bytes = raw.toBuffer('image/png'), file = `planes-${label}.png`;
  await fs.writeFile(path.join(output, file), bytes); report.cameras.push({ camera, file, sha256: hash(bytes), fullyOpaque: true });
  const state = engine.state;
  const positions = [[65, 191], [320, 960], [1089, 1215]][index];
  const actors = state.fighters.map((actor, i) => ({ ...actor, x: positions[i], y: 568 }));
  const view = { ...state, fighters: actors };
  if (state.a && state.b) { view.a = actors[0]; view.b = actors[1]; }
  assert.equal(stageCamera(actors, false), camera);
  assert.equal(stageCamera(actors, true), 0);
  const before = JSON.stringify(view); renderer.render(view, { reducedMotion: false, ambientFrame: 0 });
  assert.equal(JSON.stringify(view), before, 'Rendering mutated review state');
  const scene = canvas.toBuffer('image/png'), sceneFile = `scene-${label}.png`;
  await fs.writeFile(path.join(output, sceneFile), scene);
  report.scenes.push({ camera, file: sceneFile, sha256: hash(scene), actors: actors.map(actor => ({ id: (actor.f || actor.def).id, x: actor.x, y: actor.y })) });
  oc.drawImage(raw, 0, index * 380, 640, 360); oc.drawImage(canvas, 640, index * 380, 640, 360);
  oc.fillStyle = '#e5eaff'; oc.font = '16px sans-serif'; oc.fillText(`Caméra ${camera} · trois plans`, 12, index * 380 + 377); oc.fillText(`Pomni / Gummigoo · sol y568`, 652, index * 380 + 377);
}
assert.equal(new Set(report.cameras.map(view => view.sha256)).size, 3);
report.checks.push({ name: 'Three distinct camera positions compose without transparent gaps', pass: true });
report.checks.push({ name: 'Reduced motion fixes the camera at zero for all three actor arrangements', pass: true });
const motionFrames = [0, 123].map(frame => {
  const c = createCanvas(1280, 720), ctx = c.getContext('2d'); drawStagePlanes(ctx, planes.layers, 0); drawStageMotion(ctx, stage, frame, false, true);
  return { full: hash(c.toBuffer('image/png')), floor: hash(ctx.getImageData(0, 568, 1280, 152).data) };
});
assert.notEqual(motionFrames[0].full, motionFrames[1].full); assert.equal(motionFrames[0].floor, motionFrames[1].floor);
report.checks.push({ name: 'Ambient blue light evolves while every floor pixel remains identical', pass: true, frames: motionFrames });
assert.equal(JSON.stringify(stage), stageBefore);
report.checks.push({ name: 'Rendering keeps stage definitions and actor review states unchanged', pass: true });
await fs.writeFile(path.join(output, 'three-cameras.png'), overview.toBuffer('image/png'));
report.overview = 'three-cameras.png'; report.requestedFiles = [...requested].sort();
await fs.writeFile(path.join(output, 'canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, assets: report.assets.length, cameras: report.cameras.length, scenes: report.scenes.length, checks: report.checks.length, offline: report.offline }));

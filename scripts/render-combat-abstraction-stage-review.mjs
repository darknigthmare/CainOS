/**
 * Focused production Canvas review of the two original abstraction arenas.
 * Native Skia evidence only: no browser session or canonical 1:1 certification.
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
const { createCanvas, Image: NativeImage, loadImage } = skia;
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

const { FIGHTERS, STAGES, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES } = await import('../combat/offline-manifest.mjs');
const { CombatEngine, getHurtbox } = await import('../combat/engine.mjs');
const { CombatRenderer } = await import('../combat/render.mjs');
const { standingIllustration } = await import('../combat/illustrations.mjs');
const { loadStagePlanes, drawStagePlanes, stageCamera } = await import('../combat/stage-parallax.mjs');

const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? 'docs/art-generation/abstractions-20261124/canvas/stages' : args[at + 1]);
await fs.mkdir(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const pixels = canvas => canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
const pixelHash = canvas => sha(pixels(canvas));
const file = name => path.join(output, name);
const report = {
  schema: 'encore-abstraction-stage-canvas-review/v1', createdAt: new Date().toISOString(),
  method: 'Production stage loader, camera, planes, CombatEngine and CombatRenderer executed with native Skia.',
  limitations: [
    'The two arenas are original fan-game locations, with no canonical 1:1 claim.',
    'These are initialized duel snapshots, not played matches.',
    'No browser, DOM, input, audio playback or service-worker verification follows from this report.',
    'Aquatic trailing tendrils are decorative outside its 195 × 200 collision body.',
  ],
  sourceHashes: {}, planes: [], stages: [], duels: [], outputImages: [],
};
const runtimeFiles = (await fs.readdir(path.join(repo, 'combat'))).filter(item => item.endsWith('.mjs')).sort().map(item => 'combat/' + item);
for (const item of [...runtimeFiles, 'scripts/render-combat-abstraction-stage-review.mjs']) {
  report.sourceHashes[item] = sha(await fs.readFile(path.join(repo, item)));
}

function alphaStats(canvas) {
  const data = pixels(canvas), width = canvas.width, height = canvas.height;
  let transparent = 0, visible = 0, opaque = 0, minAlpha = 255, maxAlpha = 0;
  let centerVisible = 0, centerPixels = 0, upperVisible = 0, upperPixels = 0;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const alpha = data[(y * width + x) * 4 + 3], shown = alpha > 12;
    if (alpha === 0) transparent++;
    if (alpha === 255) opaque++;
    minAlpha = Math.min(minAlpha, alpha); maxAlpha = Math.max(maxAlpha, alpha);
    if (shown) {
      visible++; left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (x >= Math.ceil(width * .18) && x < Math.floor(width * .82)
      && y >= Math.ceil(height * .32) && y < Math.floor(height * .81)) {
      centerPixels++; if (shown) centerVisible++;
    }
    if (y < Math.floor(height * .85)) { upperPixels++; if (shown) upperVisible++; }
  }
  return { width, height, alphaExtrema: [minAlpha, maxAlpha], transparentFraction: transparent / (width * height),
    opaqueFraction: opaque / (width * height), visiblePixelsThreshold12: visible,
    visibleBoundsThreshold12: right < left ? null : [left, top, right + 1, bottom + 1],
    centerVisibleFraction: centerPixels ? centerVisible / centerPixels : 0, centerVisiblePixels: centerVisible,
    centerPixels, upper85VisiblePixels: upperVisible, upper85Pixels: upperPixels };
}
async function saveJpeg(name, canvas) {
  await fs.writeFile(file(name), canvas.toBuffer('image/jpeg', 91));
  report.outputImages.push(name);
}
const ids = ['memoryfracture', 'abstractionthreshold'], centerImages = [], plainDuels = [], boxDuels = [];
const overview = createCanvas(1280, 1136), overviewCtx = overview.getContext('2d');
overviewCtx.fillStyle = '#101725'; overviewCtx.fillRect(0, 0, 1280, 1136);
for (const [title, y] of [
  ['DEUX ARÈNES ORIGINALES / PLANS NATIFS / CAMÉRA CENTRALE', 25],
  ['DUELS INITIALISÉS / RENDU DE PRODUCTION', 393],
  ['MÊMES DUELS / CORPS DE COLLISION VISIBLES', 761],
]) {
  overviewCtx.font = 'bold 18px sans-serif'; overviewCtx.fillStyle = '#f4e9d5';
  overviewCtx.fillText(title, 14, y);
}
for (const id of ids) {
  const stage = STAGES.find(item => item.id === id); assert.ok(stage, id);
  const stageBefore = JSON.stringify(stage), sources = [];
  for (const plane of ['far', 'mid', 'near']) {
    const relative = 'assets/encore/stages/' + id + '/' + plane + '.png';
    assert.ok(ART_FILES.includes('../' + relative), relative + ': published');
    const absolute = path.join(repo, relative), bytes = await fs.readFile(absolute), image = await loadImage(absolute);
    const native = createCanvas(image.width, image.height); native.getContext('2d').drawImage(image, 0, 0);
    const alpha = alphaStats(native);
    assert.ok(alpha.visiblePixelsThreshold12 > 0, relative + ': nonempty');
    if (plane === 'far') assert.equal(alpha.opaqueFraction, 1, relative + ': opaque far');
    else {
      assert.ok(alpha.transparentFraction > .8, relative + ': >80% fully transparent');
      assert.ok(alpha.centerVisibleFraction < .01, relative + ': center less than 1% visible');
      if (plane === 'near') assert.equal(alpha.upper85VisiblePixels, 0, relative + ': near absent above bottom 15%');
    }
    report.planes.push({ id, plane, file: relative, sha256: sha(bytes), bytes: bytes.length, nativeFileUnmodified: true, ...alpha });
    sources.push(absolute);
  }
  const layers = await loadStagePlanes(stage);
  assert.ok(layers?.complete); assert.equal(layers.layers.length, 3);
  assert.deepEqual(layers.layers.map(layer => decodedSources.get(layer)), sources);
  const cameraChecks = [], cameraImages = [];
  for (const camera of [-1, 0, 1]) {
    const canvas = createCanvas(1280, 720), ctx = canvas.getContext('2d'), drawn = [], draw = ctx.drawImage.bind(ctx);
    ctx.drawImage = (source, ...coordinates) => {
      drawn.push({ file: path.relative(repo, decodedSources.get(source)), coordinates });
      return draw(source, ...coordinates);
    };
    drawStagePlanes(ctx, layers.layers, camera);
    assert.equal(drawn.length, 3); assert.deepEqual(drawn.map(item => path.join(repo, item.file)), sources);
    const alpha = alphaStats(canvas); assert.equal(alpha.opaqueFraction, 1, id + ': camera remains opaque');
    cameraChecks.push({ camera, hash: pixelHash(canvas), opaque: true, planesDrawn: drawn });
    cameraImages.push(canvas);
  }
  assert.equal(new Set(cameraChecks.map(item => item.hash)).size, 3, id + ': cameras produce three distinct compositions');
  assert.equal(stageCamera([{ x: -1000 }], false), -1);
  assert.equal(stageCamera([{ x: 640 }], false), 0);
  assert.equal(stageCamera([{ x: 3000 }], false), 1);
  assert.equal(stageCamera([{ x: 3000 }], true), 0);
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
  assert.equal((await renderer.preload([], [stage])).ok, true);
  const state = { frame: 0, phase: 'fight', stage, fighters: [], traps: [], projectiles: [], fx: [] };
  const before = JSON.stringify(state);
  renderer.render(state, { reducedMotion: true, ambientFrame: 0 }); const reducedFirst = pixelHash(canvas);
  renderer.render(state, { reducedMotion: true, ambientFrame: 600 }); const reducedLater = pixelHash(canvas);
  assert.equal(reducedFirst, reducedLater); assert.equal(JSON.stringify(state), before);
  assert.equal(JSON.stringify(stage), stageBefore);
  const triptych = createCanvas(1920, 394), context = triptych.getContext('2d');
  context.fillStyle = '#101725'; context.fillRect(0, 0, 1920, 394); context.fillStyle = '#f4e9d5'; context.font = '20px sans-serif';
  cameraImages.forEach((image, index) => {
    context.fillText(id + ' / caméra ' + [-1, 0, 1][index], index * 640 + 14, 25);
    context.drawImage(image, index * 640, 34, 640, 360);
  });
  await saveJpeg('camera-' + id + '.jpg', triptych);
  centerImages.push(cameraImages[1]);
  report.stages.push({ id, publishedAndLoaded: true, exactNativeSources: sources.map(item => path.relative(repo, item)),
    cameraChecks, reducedMotion: { frame0: reducedFirst, frame600: reducedLater, pixelsEqual: true },
    actorAndStageUnchanged: true });
}
for (const [index, id] of ids.entries()) {
  const stage = STAGES.find(item => item.id === id);
  const fighters = id === 'memoryfracture'
    ? [FIGHTERS.find(item => item.id === 'originalabstractedpomni'), FIGHTERS.find(item => item.id === 'jax')]
    : [FIGHTERS.find(item => item.id === 'aquaticabstraction'), equipCostume(FIGHTERS.find(item => item.id === 'abstractedqueenie'), 'abstractedqueeniedark')];
  assert.ok(fighters.every(Boolean));
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
  assert.equal((await renderer.preload(fighters, [stage])).ok, true);
  const stances = fighters.map(fighter => standingIllustration(fighter)); assert.ok(stances.every(frame => frame?.canvas));
  const ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx); let observed = [];
  ctx.drawImage = (source, ...coordinates) => {
    const actor = stances.findIndex(frame => source === frame.canvas);
    if (actor >= 0) observed.push({ actor, file: path.relative(repo, decodedSources.get(source)), matrix: ctx.getTransform(), coordinates });
    return draw(source, ...coordinates);
  };
  const engine = new CombatEngine({ fighters, stage, mode: 'local', cpu: [false, false], skipIntro: true, seed: 20261124 });
  engine.state.a.x = 380; engine.state.b.x = 900;
  const before = JSON.stringify(engine.getSnapshot()), captures = [];
  for (const hitboxes of [false, true]) {
    observed = []; renderer.render(engine.state, { reducedMotion: true, ambientFrame: 120, hitboxes });
    assert.equal(JSON.stringify(engine.getSnapshot()), before);
    assert.equal(observed.length, 2, id + ': both native standing drawings used');
    for (const [i, row] of observed.entries()) {
      const { a, b, c, d } = row.matrix;
      assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 1e-8);
      const expected = fighters[row.actor].sprite?.crossoverDirectory;
      if (expected) assert.equal(row.file, path.relative(repo, path.resolve(repo, 'combat', expected, 'stance.png')));
    }
    const filename = 'duel-' + id + (hitboxes ? '-hitboxes' : '') + '.jpg';
    await saveJpeg(filename, canvas); captures.push({ file: filename, hitboxes, hash: pixelHash(canvas), nativeDraws: observed });
    // Freeze pixels rather than retaining a deferred Skia canvas-to-canvas draw.
    const retained = createCanvas(1280, 720); retained.getContext('2d').putImageData(ctx.getImageData(0, 0, 1280, 720), 0, 0);
    assert.equal(pixelHash(retained), captures.at(-1).hash);
    (hitboxes ? boxDuels : plainDuels).push(retained);
  }
  assert.equal(pixelHash(plainDuels[index]), captures[0].hash, 'Retained plain capture stays unchanged after drawing hurtboxes');
  assert.notEqual(captures[0].hash, captures[1].hash, 'Hurtbox overlay changes the captured pixels');
  report.duels.push({ stage: id, fighters: fighters.map(f => ({ id: f.id, costume: f.costume || null })),
    positions: [engine.state.a.x, engine.state.b.x], simulationBodies: [getHurtbox(engine.state.a), getHurtbox(engine.state.b)],
    simulationUnchangedByRendering: true, captures });
}
for (let i = 0; i < 2; i++) {
  overviewCtx.drawImage(centerImages[i], i * 640, 34, 640, 360);
  overviewCtx.drawImage(plainDuels[i], i * 640, 402, 640, 360);
  overviewCtx.drawImage(boxDuels[i], i * 640, 770, 640, 360);
}
await saveJpeg('stages-overview.jpg', overview);
report.counts = { stages: report.stages.length, nativePlanes: report.planes.length,
  cameraCompositions: report.stages.reduce((sum, stage) => sum + stage.cameraChecks.length, 0),
  initializedDuels: report.duels.length, duelCaptures: report.duels.reduce((sum, duel) => sum + duel.captures.length, 0) };
report.ok = true;
await fs.writeFile(file('stage-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, ...report.counts, ok: report.ok }));



/** Targeted reproducible scene review through the production Canvas2D renderer. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../..');
const output = path.join(here, 'scenes');
await fs.mkdir(output, { recursive: true });
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const sourceImages = new WeakMap(), decodedSources = new WeakMap(), requested = new Set();
globalThis.Image = class extends NativeImage {
  set src(value) {
    const source = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof source === 'string') {
      sourceImages.set(this, path.resolve(source));
      requested.add(path.relative(repo, path.resolve(source)));
    }
    super.src = source;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1); canvas.isConnected = true;
  const ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx);
  ctx.drawImage = (source, ...coordinates) => {
    const file = sourceImages.get(source) || decodedSources.get(source);
    if (file) decodedSources.set(canvas, file);
    return draw(source, ...coordinates);
  };
  return canvas;
} };

const load = relative => import(pathToFileURL(path.join(repo, relative)));
const { getFighter, getStage, equipCostume } = await load('combat/data.mjs');
const { CombatRenderer } = await load('combat/render.mjs');
const { CombatEngine } = await load('combat/engine.mjs');
const { loadFighterIllustration } = await load('combat/illustrations.mjs');
const { loadStagePlanes } = await load('combat/stage-parallax.mjs');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const recipes = [
  { stage: 'softballfield', appearances: [['ragatha', 'caferagatha'], ['gangle', 'cafegangle']] },
  { stage: 'barnoir', appearances: [['gangle', 'cafegangle'], ['zooble', 'cafezooble']] },
  { stage: 'undermap', appearances: [['zooble', 'cafezooble'], ['ragatha', 'caferagatha']] },
];
const report = {
  schema: 'encore-cafe-c-scene-review/v1', createdAt: new Date().toISOString(),
  method: 'Production CombatEngine, CombatRenderer and image/parallax loaders executed by Node + native Skia.',
  browserTestStatus: 'not_executed', sources: {}, scenes: [],
  limitations: ['Static Canvas render only: no browser, input, audio, service-worker or physical-device execution.',
    'Individual authored poses do not establish complete animation cycles.', 'No canonical 1:1 certification.'],
};
for (const relative of ['combat/data.mjs', 'combat/costume-continuation-20261120-c.mjs', 'combat/render.mjs',
  'combat/engine.mjs', 'combat/illustrations.mjs', 'combat/stage-parallax.mjs', 'combat/offline-manifest.mjs',
  path.relative(repo, fileURLToPath(import.meta.url))]) {
  report.sources[relative] = hash(await fs.readFile(path.join(repo, relative)));
}
const overview = createCanvas(960, recipes.length * 572), oc = overview.getContext('2d');
oc.fillStyle = '#141b2b'; oc.fillRect(0, 0, overview.width, overview.height);
for (const [index, recipe] of recipes.entries()) {
  const stage = getStage(recipe.stage);
  assert.equal(stage.id, recipe.stage);
  const fighters = recipe.appearances.map(([owner, appearance]) => {
    const fighter = equipCostume(getFighter(owner), appearance);
    assert.equal(fighter.costume, appearance);
    return fighter;
  });
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas), ctx = renderer.ctx;
  const preload = await renderer.preload(fighters, [stage]);
  assert.equal(preload.ok, true, JSON.stringify(preload.errors));
  const planes = await loadStagePlanes(stage);
  assert.equal(planes?.complete, true);
  assert.equal(planes.layers.length, 3);
  const stances = await Promise.all(fighters.map(fighter => loadFighterIllustration('stance', fighter)));
  for (const [i, stance] of stances.entries()) {
    assert.ok(stance?.canvas);
    assert.equal(decodedSources.get(stance.canvas), path.join(repo, 'assets/encore/stance/' + recipe.appearances[i][1] + '.png'));
  }
  const engine = new CombatEngine({ fighters, stage, skipIntro: true, mode: 'local', cpu: [false, false], seed: 20261120 });
  const stateBefore = JSON.stringify(engine.state), sampled = [], draw = ctx.drawImage.bind(ctx);
  ctx.drawImage = (source, ...coordinates) => {
    sampled.push({ source, matrix: ctx.getTransform() });
    return draw(source, ...coordinates);
  };
  renderer.render(engine.state, { reducedMotion: true });
  assert.equal(JSON.stringify(engine.state), stateBefore, 'Scene rendering must not mutate the simulation state');
  const actors = stances.map((stance, i) => {
    const emitted = sampled.find(value => value.source === stance.canvas);
    assert.ok(emitted, recipe.appearances[i][1] + ': render the installed authored stance');
    const { a, b, c, d } = emitted.matrix;
    const face = engine.state.fighters[i].face;
    assert.equal(Math.sign(a), face * stance.nativeFacing);
    assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 0.0001);
    return { appearanceId: recipe.appearances[i][1], owner: recipe.appearances[i][0],
      file: path.relative(repo, decodedSources.get(stance.canvas)), face, nativeFacing: stance.nativeFacing,
      actualDrawSourceVerified: true, facingVerified: true, uniformScale: true };
  });
  const filename = 'scene-' + recipe.stage + '.png', bytes = canvas.toBuffer('image/png');
  await fs.writeFile(path.join(output, filename), bytes);
  report.scenes.push({ stage: stage.id, file: path.relative(repo, path.join(output, filename)), sha256: hash(bytes),
    dimensions: [1280, 720], nativeStagePlanes: 3, preload: true, simulationUnchanged: true, actors });
  oc.drawImage(canvas, 0, index * 572, 960, 540);
  oc.fillStyle = '#f4ead7'; oc.font = '17px sans-serif';
  oc.fillText(recipe.appearances.map(([, id]) => id).join(' / ') + ' — ' + stage.id, 12, index * 572 + 563);
}
const overviewFile = path.join(output, 'scenes-overview.jpg');
await fs.writeFile(overviewFile, overview.toBuffer('image/jpeg', 90));
report.overview = { file: path.relative(repo, overviewFile), sha256: hash(await fs.readFile(overviewFile)) };
report.requestedFiles = [...requested].sort();
report.counts = { scenes: report.scenes.length, authoredStanceDraws: report.scenes.reduce((n, scene) => n + scene.actors.length, 0),
  appearances: new Set(report.scenes.flatMap(scene => scene.actors.map(actor => actor.appearanceId))).size };
report.complete = true;
await fs.writeFile(path.join(output, 'scene-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, ...report.counts, complete: report.complete }));

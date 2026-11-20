/** Review recovered props with the production renderer; never rewrite source PNGs. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  if (index < 0) return null;
  assert(args[index + 1] && !args[index + 1].startsWith('--'), `Missing value for ${name}`);
  return path.resolve(args[index + 1]);
};
const output = option('--output');
assert(output, 'Pass --output with a dedicated review directory.');
const baseline = option('--compare');
const before = args.includes('--before');
assert(!(before && baseline), 'A baseline cannot compare to itself.');
assert(!baseline || output !== baseline, 'Keep --output separate from --compare; baseline images must not be overwritten.');
const mapping = [
  ['haunted-lamppost', 'gaslightwharf', 'wharf-lamp'],
  ['circus-ticket-dispenser', 'showgrounds', 'ticket-dispenser'],
  ['blue-hologram-pedestal', 'gameoverse', 'orbital-checkpoint'],
  ['pastel-turnstile', 'parkplanet', 'garden-turnstile'],
  ['vintage-brass-microphone', 'littledaisy', 'jazz-microphone'],
  ['bamboo-bell', 'simpleflipisland', 'bamboo-checkpoint'],
];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function readSkia() {
  try { return await import('@napi-rs/canvas'); }
  catch (error) {
    if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
    return import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
  }
}
const stageIndex = args.indexOf('--stage');
const onlyStage = stageIndex < 0 ? null : args[stageIndex + 1];
assert(stageIndex < 0 || mapping.some(([, id]) => id === onlyStage), 'Unknown or missing --stage ID');
if (!onlyStage) {
  // Each background has three 4K sources. End the process after each scene so
  // native decoder memory does not accumulate while reviewing unrelated scenes.
  for (const [, id] of mapping) {
    const child = spawnSync(process.execPath, ['--expose-gc', fileURLToPath(import.meta.url), ...args, '--stage', id],
      { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
    if (child.stdout) process.stdout.write(child.stdout);
    if (child.stderr) process.stderr.write(child.stderr);
    assert.equal(child.status, 0, `Scene worker failed: ${id} (${child.signal || child.error || child.status})`);
  }
  const { createCanvas, loadImage } = await readSkia();
  const natives = createCanvas(1440, 760), nc = natives.getContext('2d');
  const stages = createCanvas(1280, 1188), sc = stages.getContext('2d');
  nc.fillStyle = sc.fillStyle = '#111827';
  nc.fillRect(0, 0, natives.width, natives.height); sc.fillRect(0, 0, stages.width, stages.height);
  const parts = [];
  for (const [index, [, id]] of mapping.entries()) {
    globalThis.gc?.();
    const part = JSON.parse(await fs.readFile(path.join(output, `canvas-review-${id}.json`), 'utf8'));
    if (parts.length) {
      assert.deepEqual(part.sources, parts[0].sources);
      assert.deepEqual(part.offline, parts[0].offline);
      assert.equal(part.phase, parts[0].phase);
    }
    parts.push(part);
    nc.drawImage(await loadImage(path.join(output, `native-prop-${id}.jpg`)), index * 240, 0);
    sc.drawImage(await loadImage(path.join(output, `stage-prop-${id}.jpg`)), index % 2 * 640, Math.floor(index / 2) * 396);
  }
  await fs.writeFile(path.join(output, 'native-props-review.jpg'), natives.toBuffer('image/jpeg', 92));
  await fs.writeFile(path.join(output, 'stage-props-review.jpg'), stages.toBuffer('image/jpeg', 90));
  const report = { ...parts[0], createdAt: new Date().toISOString(),
    assets: parts.flatMap(part => part.assets), scenes: parts.flatMap(part => part.scenes),
    counts: { sources: 6, activeProps: before ? 0 : 6, scenes: 6, cameraViews: 18,
      newNativeBytes: parts.reduce((sum, part) => sum + part.counts.newNativeBytes, 0) },
    renderingIsolation: 'One production-renderer process per scene; source files are unchanged.' };
  await fs.writeFile(path.join(output, 'canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ output, phase: report.phase, counts: report.counts }));
  process.exit(0);
}
const { createCanvas, loadImage, Image: NativeImage } = await readSkia();
const baselineBytes = baseline ? await fs.readFile(path.join(baseline, 'canvas-review.json')) : null;
const baselineReport = baselineBytes ? JSON.parse(baselineBytes) : null;
if (baselineReport) {
  assert.equal(baselineReport.schema, 'encore-recovered-prop-review/v1');
  assert.equal(baselineReport.phase, 'before_integration');
}
const requested = new Set(), propDraws = [];
const targets = new Set(mapping.map(([, stage, stem]) => `assets/encore/props/${stage}/${stem}.png`));
globalThis.Image = class extends NativeImage {
  set src(value) {
    if (typeof value === 'string' && value.startsWith('file:')) {
      value = fileURLToPath(value);
      this.reviewPath = path.relative(root, value);
      requested.add(this.reviewPath);
    }
    super.src = value;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1), context = canvas.getContext('2d');
  const draw = context.drawImage.bind(context);
  context.drawImage = (image, ...coordinates) => {
    if (targets.has(image.reviewPath)) propDraws.push({ file: image.reviewPath, coordinates });
    return draw(image, ...coordinates);
  };
  canvas.isConnected = true;
  return canvas;
} };
const { STAGES } = await import('../combat/data.mjs');
const { ART_FILES, ART_BYTES, ART_VERSION, OFFLINE_VERSION } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer } = await import('../combat/render.mjs');
const { loadStagePlanes, drawStagePlanes } = await import('../combat/stage-parallax.mjs');
const recoveryFile = 'art/sources/recovered-local-props-20261119/manifest.json';
const recovered = JSON.parse(await fs.readFile(path.join(root, recoveryFile), 'utf8'));
await fs.mkdir(output, { recursive: true });
const report = {
  schema: 'encore-recovered-prop-review/v1', createdAt: new Date().toISOString(),
  phase: before ? 'before_integration' : 'integrated',
  environment: 'Node + Skia, production stage-selector Canvas2D renderer; not a browser session',
  provenance: recoveryFile, sources: {}, assets: [], scenes: [],
  offline: { images: ART_FILES.length, bytes: ART_BYTES, artVersion: ART_VERSION, version: OFFLINE_VERSION },
  ...(baselineReport ? { baseline: { file: path.relative(root, path.join(baseline, 'canvas-review.json')),
    sha256: hash(baselineBytes), phase: baselineReport.phase } } : {}),
  limitations: ['Original fan-game props; no claim of canonical episode appearance.',
    'No DOM, input, audio or service-worker verification.', 'Visual review is recorded separately from successful rendering.'],
};
for (const file of [recoveryFile, 'combat/stage-parallax.mjs', 'combat/render.mjs', 'combat/engine.mjs', 'combat/offline-manifest.mjs']) {
  report.sources[file] = hash(await fs.readFile(path.join(root, file)));
}
const sourceSheet = createCanvas(240, 760), sourceContext = sourceSheet.getContext('2d');
sourceContext.fillStyle = '#111827'; sourceContext.fillRect(0, 0, 240, 760);
const stageSheet = createCanvas(640, 396), stageContext = stageSheet.getContext('2d');
stageContext.fillStyle = '#111827'; stageContext.fillRect(0, 0, 640, 396);
for (const [id, stageId, stem] of mapping.filter(([, stage]) => stage === onlyStage)) {
  globalThis.gc?.();
  const source = recovered.files.find(asset => asset.id === id);
  assert(source, id);
  const file = `assets/encore/props/${stageId}/${stem}.png`;
  const bytes = await fs.readFile(path.join(root, source.file));
  assert.equal(hash(bytes), source.sha256, 'Recovered source changed: ' + id);
  assert.equal(ART_FILES.includes('../' + file), !before, 'Unexpected publication state: ' + file);
  if (!before) assert.deepEqual(await fs.readFile(path.join(root, file)), bytes, 'Prop must remain byte-identical to its source');
  const native = await loadImage(path.join(root, source.file));
  for (const [row, color] of ['#17253b', '#eee8da'].entries()) {
    const x = 0, y = row * 380;
    sourceContext.fillStyle = color; sourceContext.fillRect(x + 4, y + 4, 232, 370);
    const scale = Math.min(216 / native.width, 320 / native.height);
    sourceContext.drawImage(native, x + (240 - native.width * scale) / 2, y + 12, native.width * scale, native.height * scale);
    sourceContext.fillStyle = row ? '#17253b' : '#f2ead5'; sourceContext.font = '14px sans-serif';
    sourceContext.fillText(source.label, x + 9, y + 355, 220);
  }
  const stage = STAGES.find(value => value.id === stageId);
  assert(stage, stageId);
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
  const preload = await renderer.preload([], [stage]);
  assert.equal(preload.ok, true, JSON.stringify(preload.errors));
  const planes = await loadStagePlanes(stage);
  assert.equal(planes?.complete, true, 'Scene did not finish decoding: ' + stageId);
  const stageBefore = JSON.stringify(stage);
  renderer.render(null, { stage, reducedMotion: true });
  assert.equal(JSON.stringify(stage), stageBefore, 'Rendering changed the stage definition');
  const frame = canvas.toBuffer('image/png');
  await fs.writeFile(path.join(output, `scene-${stageId}.png`), frame);
  const x = 0, y = 0;
  stageContext.drawImage(canvas, x, y, 640, 360);
  stageContext.fillStyle = '#f2ead5'; stageContext.font = '17px sans-serif';
  stageContext.fillText(stage.name + ' — ' + source.label, x + 10, y + 383, 620);
  const scene = { id: stageId, name: stage.name, file: `scene-${stageId}.png`, sha256: hash(frame),
    prop: file, requested: requested.has(file), draw: propDraws.find(item => item.file === file) ?? null,
    complete: planes.complete, stageDefinitionUnchanged: true, cameras: [] };
  assert.equal(scene.requested, !before);
  assert.equal(Boolean(scene.draw), !before);
  for (const camera of [-1, 0, 1]) {
    const view = createCanvas(1280, 720);
    drawStagePlanes(view.getContext('2d'), planes.layers, camera);
    scene.cameras.push({ camera, sha256: hash(view.toBuffer('image/png')) });
  }
  assert.equal(new Set(scene.cameras.map(item => item.sha256)).size, 3, 'Parallax views must differ');
  if (baseline) {
    const previousScene = baselineReport.scenes.find(item => item.id === stageId);
    assert.equal(previousScene?.file, `scene-${stageId}.png`, 'Missing baseline record: ' + stageId);
    const previousPath = path.join(baseline, previousScene.file);
    assert.equal(hash(await fs.readFile(previousPath)), previousScene.sha256, 'Baseline PNG changed: ' + stageId);
    const old = await loadImage(previousPath);
    const comparison = createCanvas(1280, 720), cc = comparison.getContext('2d');
    cc.drawImage(old, 0, 0);
    const a = cc.getImageData(0, 0, 1280, 720).data;
    const b = canvas.getContext('2d').getImageData(0, 0, 1280, 720).data;
    const box = { x: 1280, y: 720, right: -1, bottom: -1 };
    let changedPixels = 0;
    for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) {
      const px = (i / 4) % 1280, py = Math.floor(i / 4 / 1280);
      changedPixels++; box.x = Math.min(box.x, px); box.y = Math.min(box.y, py);
      box.right = Math.max(box.right, px); box.bottom = Math.max(box.bottom, py);
    }
    assert(changedPixels > 40, 'New prop must visibly affect its scene: ' + stageId);
    scene.beforeAfter = { baselineFile: path.relative(root, previousPath), baselineSHA256: previousScene.sha256,
      changedPixels, bounds: box };
    const pair = createCanvas(1280, 400), pc = pair.getContext('2d');
    pc.fillStyle = '#111827'; pc.fillRect(0, 0, 1280, 400);
    pc.drawImage(old, 0, 32, 640, 360); pc.drawImage(canvas, 640, 32, 640, 360);
    pc.fillStyle = '#f2ead5'; pc.font = '18px sans-serif';
    pc.fillText(stage.name + ' — AVANT', 12, 23); pc.fillText('APRÈS — ' + source.label, 652, 23);
    await fs.writeFile(path.join(output, `comparison-${stageId}.jpg`), pair.toBuffer('image/jpeg', 90));
  }
  report.assets.push({ id, label: source.label, source: source.file, file, stageId,
    sha256: source.sha256, bytes: bytes.length, dimensions: [native.width, native.height],
    sourceGenerationId: source.sourceGenerationId, nativeCopyVerified: !before });
  report.scenes.push(scene);
}
await fs.writeFile(path.join(output, `native-prop-${onlyStage}.jpg`), sourceSheet.toBuffer('image/jpeg', 92));
await fs.writeFile(path.join(output, `stage-prop-${onlyStage}.jpg`), stageSheet.toBuffer('image/jpeg', 90));
report.counts = { sources: 1, activeProps: before ? 0 : 1, scenes: 1, cameraViews: 3,
  newNativeBytes: before ? 0 : report.assets.reduce((sum, item) => sum + item.bytes, 0) };
await fs.writeFile(path.join(output, `canvas-review-${onlyStage}.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, phase: report.phase, counts: report.counts }));

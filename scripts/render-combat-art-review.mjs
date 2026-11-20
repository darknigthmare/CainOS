/**
 * Reproducible Canvas2D review using the shipped renderer and a local Skia canvas.
 * This is a rendered asset review, not a browser, interaction or release-CI test.
 * Optional review dependency: @napi-rs/canvas (or the managed runtime copy).
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
const requested = new Set();
globalThis.Image = class extends NativeImage {
  set src(value) {
    if (typeof value === 'string' && value.startsWith('file:')) {
      requested.add(path.relative(repo, fileURLToPath(value)));
      value = fileURLToPath(value);
    }
    super.src = value;
  }
  get src() { return super.src; }
  removeAttribute() { /* The local Image is collected after the decoder returns. */ }
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1);
  canvas.isConnected = true;
  return canvas;
} };

const { FIGHTERS, STAGES } = await import('../combat/data.mjs');
const { ART_FILES } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer, drawPortrait } = await import('../combat/render.mjs');
const { CombatEngine } = await import('../combat/engine.mjs');
const { loadFighterIllustration } = await import('../combat/illustrations.mjs');
const { loadStagePlanes } = await import('../combat/stage-parallax.mjs');
const args = process.argv.slice(2);
const outArg = args.indexOf('--output');
const output = path.resolve(outArg >= 0 ? args[outArg + 1] : 'audit-combat/art-review-2026-11-19');
await fs.mkdir(output, { recursive: true });
const kinds = args.includes('--stances') ? ['stance'] : ['selection', 'stance'];
const roster = FIGHTERS.filter(fighter => ART_FILES.includes(`../assets/encore/stance/${fighter.id}.png`));
assert.equal(roster.length, 40, 'all forty promoted fighters need their own published stance');
const report = { schema: 'encore-canvas-art-review/v1', createdAt: new Date().toISOString(),
  environment: 'Node + @napi-rs/canvas (Skia); production Canvas2D modules; no browser session',
  limitations: ['No DOM, keyboard, audio or service-worker verification.', 'No canonical 1:1 certification.',
    'Still poses do not establish complete frame-by-frame animation.'],
  images: [], scenes: [], sourceHashes: {}, outputImages: [],
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const file of ['combat/illustrations.mjs','combat/render.mjs','combat/stage-parallax.mjs','combat/offline-manifest.mjs']) {
  report.sourceHashes[file] = hash(await fs.readFile(path.join(repo, file)));
}
function cardBackground(ctx, x, y, width, height) {
  ctx.fillStyle = '#151a27'; ctx.fillRect(x, y, width, height);
  for (let row = 0; row < height; row += 18) for (let col = 0; col < width; col += 18) {
    ctx.fillStyle = ((row + col) / 18) % 2 ? '#242b3d' : '#2b3348';
    ctx.fillRect(x + col, y + row, Math.min(18, width - col), Math.min(18, height - row));
  }
}
for (const kind of kinds) {
  const cellW = 210, cellH = 286, columns = 8;
  const sheet = createCanvas(cellW * columns, cellH * Math.ceil(roster.length / columns) + 64);
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#0e1422'; ctx.fillRect(0, 0, sheet.width, sheet.height);
  ctx.fillStyle = '#f0e7cb'; ctx.font = 'bold 25px sans-serif';
  ctx.fillText(`ENCORE / ${kind === 'stance' ? '40 GARDES' : '40 SÉLECTIONS'} / 19.11.2026`, 20, 38);
  for (const [index, fighter] of roster.entries()) {
    const file = `assets/encore/${kind}/${fighter.id}.png`;
    assert.ok(ART_FILES.includes('../' + file), file + ' must be published');
    const frame = await loadFighterIllustration(kind, fighter);
    assert.ok(frame?.canvas && frame.bounds.width > 0 && frame.bounds.height > 0, file);
    const x = index % columns * cellW, y = Math.floor(index / columns) * cellH + 64;
    cardBackground(ctx, x + 5, y, cellW - 10, cellH - 35);
    const portrait = createCanvas(cellW - 16, cellH - 42);
    if (kind === 'selection') assert.equal(await drawPortrait(portrait, fighter, { selection: true, glow: false }), true);
    else {
      const b = frame.bounds, pc = portrait.getContext('2d');
      const scale = Math.min((portrait.width - 10) / b.width, (portrait.height - 10) / b.height);
      pc.drawImage(frame.canvas, b.x, b.y, b.width, b.height,
        (portrait.width - b.width * scale) / 2, portrait.height - 4 - b.height * scale, b.width * scale, b.height * scale);
    }
    ctx.drawImage(portrait, x + 8, y + 2);
    ctx.fillStyle = '#e5e9f3'; ctx.font = '13px sans-serif'; ctx.fillText(fighter.name.slice(0, 28), x + 9, y + cellH - 13);
    const bytes = await fs.readFile(path.join(repo, file));
    report.images.push({ fighter: fighter.id, kind, file, sha256: hash(bytes), visibleBounds: frame.bounds, decoded: true });
  }
  const filename = `expansion-${kind}-review.png`;
  await fs.writeFile(path.join(output, filename), sheet.toBuffer('image/png'));
  report.outputImages.push(filename);
}

const stages = ['falseexit','coppernine','silicacity','portaurora','gaslightwharf','parkplanet','gameoverse','littledaisy','showgrounds','simpleflipisland'];
const stageSheet = createCanvas(1280, 390 * 5 + 56), sc = stageSheet.getContext('2d');
sc.fillStyle = '#0e1422'; sc.fillRect(0, 0, stageSheet.width, stageSheet.height);
sc.fillStyle = '#f0e7cb'; sc.font = 'bold 24px sans-serif'; sc.fillText('ENCORE / RENDU DES SCÈNES / CANVAS 2D', 20, 35);
for (const [index, id] of stages.entries()) {
  const stage = STAGES.find(item => item.id === id);
  assert.ok(stage, id);
  const fighters = id === 'falseexit'
    ? ['queenie','kaufmo'].map(name => FIGHTERS.find(f => f.id === name))
    : [roster[(index * 2) % roster.length], roster[(index * 2 + 1) % roster.length]];
  const canvas = createCanvas(1280, 720), renderer = new CombatRenderer(canvas);
  const preload = await renderer.preload(fighters, [stage]);
  assert.equal(preload.ok, true, JSON.stringify(preload.errors));
  const planes = await loadStagePlanes(stage);
  assert.equal(planes?.complete, true, id + ' must use its published art');
  assert.equal(planes.layers.length, 3);
  const engine = new CombatEngine({ fighters, stage, skipIntro: true, mode: 'local', cpu: [false, false], seed: 20261119 });
  renderer.render(engine.state, { reducedMotion: true });
  const filename = `scene-${id}.png`;
  await fs.writeFile(path.join(output, filename), canvas.toBuffer('image/png'));
  const x = index % 2 * 640, y = Math.floor(index / 2) * 390 + 56;
  sc.drawImage(canvas, x, y, 640, 360); sc.fillStyle = '#f0e7cb'; sc.font = '15px sans-serif';
  sc.fillText(stage.name, x + 10, y + 381);
  report.scenes.push({ id, fighters: fighters.map(f => f.id), planes: 3, preload: true, file: filename });
  report.outputImages.push(filename);
}
await fs.writeFile(path.join(output, 'expansion-scenes-review.jpg'), stageSheet.toBuffer('image/jpeg', 88));
report.outputImages.push('expansion-scenes-review.jpg');
report.requestedFiles = [...requested].sort();
report.browserTestStatus = 'not_executed';
await fs.writeFile(path.join(output, 'canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, images: report.images.length, scenes: report.scenes.length,
  result: 'Rendered and decoded; visual inspection remains a separate human/agent review.' }));

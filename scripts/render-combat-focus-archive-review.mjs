/** Verify the two historical Evil Pomni cards through the real portrait loader.
 * Native Canvas evidence only; this does not exercise browser navigation.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'docs/art-generation/focus-20261127/bases');
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const sources = new WeakMap(), requests = [];
globalThis.Image = class extends NativeImage {
  set src(value) {
    const file = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof file === 'string') { sources.set(this, path.resolve(file)); requests.push(path.resolve(file)); }
    super.src = file;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas');
  const canvas = createCanvas(1, 1), ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx);
  ctx.drawImage = (source, ...coordinates) => {
    const file = sources.get(source); if (file) sources.set(canvas, file);
    return draw(source, ...coordinates);
  };
  return canvas;
} };

const { ARCHIVE, FIGHTERS, COSTUMES, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES, OFFLINE_VERSION } = await import('../combat/offline-manifest.mjs');
const { loadFighterIllustration } = await import('../combat/illustrations.mjs');
const { drawPortrait } = await import('../combat/render.mjs');
const aliases = ['evilpomni', 'rivalbaseballpomni'];
const appearance = 'evilpomni-pendantz';
assert.ok(COSTUMES.some(item => item.id === appearance));
const expected = path.join(root, 'assets/encore/base-costumes', appearance, 'selection.png');
const records = [...aliases.map(id => ARCHIVE.find(item => item.id === id)),
  equipCostume(FIGHTERS.find(item => item.id === 'pomni'), appearance)];
const before = JSON.stringify([ARCHIVE, FIGHTERS]);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const report = { date: '2026-11-27', offlineVersion: OFFLINE_VERSION,
  method: 'Production loadFighterIllustration and drawPortrait executed with native Skia.',
  browserTestStatus: 'not_executed', sameDecodedFrame: true, cards: [], sources: {},
  limitations: ['Native Canvas does not exercise browser navigation.', 'Shared art does not turn the NPC into a canonical transformation of Pomni.'] };
for (const file of ['combat/base-sprite-focus-20261127.mjs', 'combat/illustrations.mjs',
  'combat/render.mjs', 'combat/sprite-catalog.mjs', 'combat/offline-manifest.mjs',
  'scripts/render-combat-focus-archive-review.mjs']) report.sources[file] = sha(await fs.readFile(path.join(root, file)));
const sheet = createCanvas(960, 410), ctx = sheet.getContext('2d');
ctx.fillStyle = '#202737'; ctx.fillRect(0, 0, sheet.width, sheet.height);
ctx.fillStyle = '#2b3548';
for (let y = 0; y < sheet.height; y += 24) for (let x = 0; x < sheet.width; x += 24)
  if ((x / 24 + y / 24) % 2) ctx.fillRect(x, y, 24, 24);
let shared;
for (const [index, record] of records.entries()) {
  assert.ok(record);
  const id = record.costume || record.id;
  const frame = await loadFighterIllustration('selection', record);
  assert.ok(frame?.canvas); assert.equal(sources.get(frame.canvas), expected);
  if (shared) assert.equal(frame, shared); else shared = frame;
  const target = createCanvas(280, 320), draws = [];
  const targetCtx = target.getContext('2d'), draw = targetCtx.drawImage.bind(targetCtx);
  targetCtx.drawImage = (source, ...coords) => { draws.push(sources.get(source)); return draw(source, ...coords); };
  assert.equal(await drawPortrait(target, record, { selection: true, glow: false }), true);
  assert.deepEqual(draws, [expected]);
  ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 17px sans-serif'; ctx.fillText(id, index * 320 + 18, 32);
  ctx.drawImage(target, index * 320 + 20, 56);
  const item = { id, source: path.relative(root, expected), exactNativeSource: true, sameDecodedFrame: true };
  if (aliases.includes(id)) {
    assert.equal(record.identityId, 'evilpomni-big-top');
    assert.deepEqual(record.archiveAliases, aliases);
    assert.equal(record.supersededArtwork.preserved, true);
    const historical = path.resolve(root, 'combat', record.supersededArtwork.selection);
    assert.ok(ART_FILES.includes(record.supersededArtwork.selection));
    item.preservedHistoricalFile = path.relative(root, historical);
    item.preservedHistoricalSHA256 = sha(await fs.readFile(historical));
    item.sharedIdentity = record.identityId;
  }
  report.cards.push(item);
}
assert.deepEqual(requests, [expected], 'One shared native portrait, no old archive portrait or atlas decoded');
assert.equal(JSON.stringify([ARCHIVE, FIGHTERS]), before);
ctx.fillStyle = '#f6e9cc'; ctx.font = '15px sans-serif';
ctx.fillText('Deux identifiants historiques · un même PNJ · une sélection corrigée partagée', 18, 394);
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, 'evil-archive-aliases.jpg'), sheet.toBuffer('image/jpeg', 90));
report.outputImage = 'evil-archive-aliases.jpg';
report.summary = { cards: 3, historicalAliases: 2, nativeDecodes: requests.length, historicalBytesRetained: true, pass: true };
await fs.writeFile(path.join(output, 'archive-portrait-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary));

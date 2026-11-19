/** Verify published character drawings through the production Canvas2D renderer.
 * This native Skia review does not run a browser, play matches or certify canon.
 * Optional dependency: @napi-rs/canvas, also available in the managed runtime.
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
globalThis.Image = class extends NativeImage {
  set src(value) { super.src = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value; }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas'); const canvas = createCanvas(1, 1); canvas.isConnected = true; return canvas;
} };

const { FIGHTERS, VARIANTS, ARCHIVE, COSTUME_ADDITIONS, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer, drawPortrait } = await import('../combat/render.mjs');
const { ACTION_ART, loadFighterIllustration, archiveSelectionParts } = await import('../combat/illustrations.mjs');
const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? 'audit-combat/character-review-2026-11-19' : args[at + 1]);
const partial = args.includes('--available-only');
const additionsOnly = args.includes('--costume-additions');
await fs.mkdir(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const published = new Set(ART_FILES);
const sourceFor = stem => [stem + '.webp', stem + '.png'].find(file => published.has('../' + file));
const report = { schema: 'encore-character-canvas-review/v1', createdAt: new Date().toISOString(),
  method: 'Production Canvas2D modules executed by Node and native Skia; actual drawImage sources and transforms inspected.',
  limitations: ['No browser, DOM, input, audio, service-worker or physical-device test.',
    'Individual static poses do not establish frame-by-frame animation.',
    'Asset identity/proportion fidelity requires separate visual review; no canonical 1:1 certification.'],
  partial, additionsOnly, sources: {}, actions: [], stances: [], portraits: [], missing: [], sheets: [], browserTestStatus: 'not_executed' };
for (const file of ['combat/data.mjs','combat/costume-additions.mjs','combat/illustrations.mjs','combat/render.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs','scripts/render-combat-character-review.mjs']) {
  report.sources[file] = sha(await fs.readFile(path.join(repo, file)));
}
function background(ctx, width, height) {
  ctx.fillStyle = '#242b3d'; ctx.fillRect(0, 0, width, height);
  for (let y = 0; y < height; y += 24) for (let x = 0; x < width; x += 24) {
    if ((x / 24 + y / 24) % 2) { ctx.fillStyle = '#30394d'; ctx.fillRect(x, y, 24, 24); }
  }
}
const appearances = [...(additionsOnly ? [] : FIGHTERS.map(f => ({ id: f.id, name: f.name, f }))), ...(additionsOnly ? COSTUME_ADDITIONS : [...VARIANTS, ...COSTUME_ADDITIONS]).map(v => {
  const base = FIGHTERS.find(f => f.id === v.baseFighterId);
  return { id: v.id, name: v.name || v.label || v.id, f: { ...base, costume: v.id, sprite: v.sprite,
    visual: { ...base.visual, ...v.visual }, animation: v.animation || null } };
})];
const poses = [...ACTION_ART, 'heavy'];
const arena = createCanvas(1280, 720), renderer = new CombatRenderer(arena), ctx = renderer.ctx;
let sampled = [];
const draw = ctx.drawImage.bind(ctx);
ctx.drawImage = (source, ...rest) => { sampled.push({ source, matrix: ctx.getTransform() }); return draw(source, ...rest); };
for (const { id, f } of appearances) {
  const stanceFile = sourceFor(`assets/encore/stance/${id}`);
  if (!stanceFile) report.missing.push(id + '/stance');
  else {
    const stance = await loadFighterIllustration('stance', f);
    assert.ok(stance?.canvas, id + ': authored stance must decode');
    for (const face of [1, -1]) {
      sampled = []; ctx.clearRect(0, 0, arena.width, arena.height);
      renderer.drawActor({ f, slot: 0, state: 'idle', x: 640, y: 568, face, onGround: true }, 0, true, { phase: 'fight' });
      const emitted = sampled.find(row => row.source === stance.canvas);
      assert.ok(emitted, id + ': renderer must use its own stance');
      const { a, b, c, d } = emitted.matrix;
      assert.equal(Math.sign(a), face, id + ': stance facing');
      assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 0.0001, id + ': uniform stance scale');
    }
    const bytes = await fs.readFile(path.join(repo, stanceFile));
    report.stances.push({ id, file: stanceFile, sha256: sha(bytes), bytes: bytes.length, rendered: true, bothFacings: true });
  }
  const sheet = createCanvas(1080, 1110), sc = sheet.getContext('2d');
  background(sc, sheet.width, sheet.height);
  sc.fillStyle = '#fff0d4'; sc.font = 'bold 24px sans-serif'; sc.fillText(id + ' / poses individuelles', 18, 32);
  let checked = 0;
  for (const [index, pose] of poses.entries()) {
    const file = sourceFor(`assets/encore/poses/${id}/${pose}`);
    if (!file) { report.missing.push(id + '/' + pose); continue; }
    const expected = await loadFighterIllustration('poses', f, pose);
    assert.ok(expected?.canvas && expected.bounds.height > 0, 'decode ' + file);
    const actor = { f, slot: 0, state: pose, x: 640, y: 568, face: 1, onGround: pose !== 'jump' };
    const phase = pose === 'intro' ? 'intro' : ['victory','defeat'].includes(pose) ? 'matchOver' : 'fight';
    if (['attack','heavy'].includes(pose)) {
      const slot = pose === 'heavy' ? 'heavy' : 'light';
      actor.attack = { name: slot, def: f.moves[slot], t: f.moves[slot].startup };
    }
    for (const face of [1, -1]) {
      actor.face = face; sampled = []; ctx.clearRect(0, 0, 1280, 720);
      renderer.drawActor(actor, 0, true, { phase, winner: pose === 'defeat' ? 1 : 0 });
      const emitted = sampled.find(row => row.source === expected.canvas);
      assert.ok(emitted, id + '/' + pose + ': renderer must use the authored drawing');
      const { a, b, c, d } = emitted.matrix;
      assert.equal(Math.sign(a), face, id + '/' + pose + ': facing');
      assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 0.0001, 'uniform scale');
      const height = (f.visual?.height || f.combat?.simulationBody?.height || 230) * (['crouch','defeat'].includes(pose) ? 0.74 : 1);
      assert.ok(Math.abs(Math.hypot(c, d) * expected.bounds.height - height) < 0.01, id + '/' + pose + ': visible height');
      if (face === 1) {
        // Centered production crop; the right/left facing assertions above use
        // the entire unscaled arena. The sheet is only a visual review aid.
        const x = index % 3 * 360, y = Math.floor(index / 3) * 350 + 52;
        const visibleWidth = expected.bounds.width * height / expected.bounds.height;
        const scale = Math.min(1, 300 / Math.max(1, height), 336 / (visibleWidth + 30));
        sc.save(); sc.beginPath(); sc.rect(x + 2, y + 28, 356, 312); sc.clip();
        sc.translate(x + 180 - 640 * scale, y + 330 - 568 * scale);
        sc.scale(scale, scale); sc.drawImage(arena, 0, 0); sc.restore();
        sc.fillStyle = '#f1e7d1'; sc.font = '16px sans-serif'; sc.fillText(pose, x + 12, y + 20);
      }
    }
    const bytes = await fs.readFile(path.join(repo, file));
    report.actions.push({ id, pose, file, sha256: sha(bytes), bytes: bytes.length,
      visibleBounds: expected.bounds, bothFacings: true, uniformScale: true, rendered: true });
    checked++;
  }
  if (checked) {
    const filename = `actions-${id}.jpg`;
    await fs.writeFile(path.join(output, filename), sheet.toBuffer('image/jpeg', 88)); report.sheets.push(filename);
  }
}

const portraits = (additionsOnly ? [] : ARCHIVE).flatMap(item => {
  const parts = archiveSelectionParts(item.id);
  return parts.length ? parts.map(part => ({ ...item, id: part.id, name: part.label, archiveId: item.id })) : [{ ...item, archiveId: item.id }];
}).concat(COSTUME_ADDITIONS.map(item => ({ ...equipCostume(FIGHTERS.find(f => f.id === item.fighterId), item.id), id: item.id, archiveId: null })));
for (let offset = 0; offset < portraits.length; offset += 24) {
  const rows = Math.ceil(Math.min(24, portraits.length - offset) / 6);
  const sheet = createCanvas(1440, rows * 284), sc = sheet.getContext('2d'); background(sc, sheet.width, sheet.height);
  for (const [index, item] of portraits.slice(offset, offset + 24).entries()) {
    const file = sourceFor(`assets/encore/selection/${item.id}`);
    if (!file) { report.missing.push(item.id + '/selection'); continue; }
    const expected = await loadFighterIllustration('selection', item);
    assert.ok(expected?.canvas, 'selection decode ' + item.id);
    const canvas = createCanvas(224, 242);
    assert.equal(await drawPortrait(canvas, item, { selection: true, glow: false }), true, item.id);
    const x = index % 6 * 240, y = Math.floor(index / 6) * 284;
    sc.drawImage(canvas, x + 8, y + 8); sc.fillStyle = '#f1e7d1'; sc.font = '13px sans-serif'; sc.fillText(item.id, x + 10, y + 274);
    const bytes = await fs.readFile(path.join(repo, file));
    report.portraits.push({ id: item.id, archiveId: item.archiveId, file, sha256: sha(bytes), bytes: bytes.length, rendered: true });
  }
  const filename = `archive-portraits-${String(offset / 24 + 1).padStart(2, '0')}.jpg`;
  await fs.writeFile(path.join(output, filename), sheet.toBuffer('image/jpeg', 88)); report.sheets.push(filename);
}
report.counts = { appearances: appearances.length, expectedActions: appearances.length * poses.length,
  actions: report.actions.length, stances: report.stances.length, drawChecks: (report.actions.length + report.stances.length) * 2, archiveEntries: additionsOnly ? 0 : ARCHIVE.length,
  portraits: report.portraits.length, expectedPortraits: portraits.length, missing: report.missing.length };
report.complete = report.missing.length === 0;
await fs.writeFile(path.join(output, 'character-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
const table = items => ['| Apparence | Actions rendues | Planche |', '| --- | ---: | --- |',
  ...items.map(item => {
    const count = report.actions.filter(action => action.id === item.id).length;
    return `| ${item.name} | ${count}/9 | ${count ? `[${item.id}](actions-${item.id}.jpg)` : 'Non publiée'} |`;
  })].join('\n');
const reportLink = path.relative(output, path.join(repo, 'docs', additionsOnly
  ? 'COMBAT_CAST_CONTINUATION_2026-11-19.md' : 'COMBAT_CHARACTER_COMPLETION_2026-11-19.md')).split(path.sep).join('/');
const gallery = [
  '# Personnages d’Encore — galerie du 19 novembre 2026', '',
  `${report.counts.actions} actions statiques de ${appearances.length} apparences et ${report.counts.portraits} portraits individuels ont été rendus avec les modules Canvas du jeu.`, '',
  'Chaque planche rassemble des fichiers individuels pour faciliter la revue. Les fichiers de jeu restent séparés. Ce rendu Node/Skia ne constitue pas un parcours navigateur, une animation image par image ou une certification canonique.', '',
  '[Rapport des sources et contrôles](character-canvas-review.json) · [Bilan de la passe](' + reportLink + ')', '',
  ...(additionsOnly ? ['## Variantes supplémentaires', '', table(appearances), ''] : [
    '## Combattants', '', table(appearances.slice(0, FIGHTERS.length)), '',
    '## Variantes', '', table(appearances.slice(FIGHTERS.length)), '']),
  '## Portraits individuels', '',
  ...report.sheets.filter(file => file.startsWith('archive-portraits-')).map((file, index) => `- [Planche ${index + 1}](${file})`), '',
].join('\n');
await fs.writeFile(path.join(output, 'README.md'), gallery);
console.log(JSON.stringify({ output, ...report.counts, complete: report.complete }));
if (!partial) assert.deepEqual(report.missing, [], 'Every declared static character slot must be published');

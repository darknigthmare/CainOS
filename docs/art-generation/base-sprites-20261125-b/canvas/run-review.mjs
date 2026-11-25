/** Technical production-render review of this continuation only.
 * Visual inspection is recorded separately after opening the generated sheets.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CONTINUATION_B_BASE_DEFINITIONS } from '../../../../combat/base-sprite-continuation-20261125-b.mjs';
import { BASE_SPRITE_COSTUMES } from '../../../../combat/data.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const output = fileURLToPath(new URL('.', import.meta.url));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (name, value) => fs.writeFile(path.join(output, name), JSON.stringify(value, null, 2) + '\n');
const definitions = CONTINUATION_B_BASE_DEFINITIONS;
const ids = definitions.map(definition => definition.id);
assert.equal(definitions.length, 18, 'All eighteen reviewed base families must be installed first');
assert.equal(new Set(ids).size, 18);
for (const id of ids) assert.ok(BASE_SPRITE_COSTUMES.some(costume => costume.id === id), id + ': regenerate the offline manifest before rendering');
await fs.mkdir(path.join(output, 'families'), { recursive: true });
const startedAt = new Date().toISOString(), execution = [];
let report;
await save('batch-progress.json', { schema: 'encore-static-base-canvas-batch/v1', startedAt, complete: false, expected: 18, execution });

for (const definition of definitions) {
  const familyFile = path.join(output, 'families', definition.id + '.json');
  // A failed worker cannot inherit a report from an older execution.
  await fs.rm(familyFile, { force: true });
  const started = Date.now();
  const result = spawnSync(process.execPath, ['--expose-gc', '--max-old-space-size=128',
    path.join(root, 'scripts/render-combat-base-sprite-review.mjs'),
    '--appearance', definition.id, '--worker', '--output', output],
  { cwd: root, encoding: 'utf8', timeout: 60_000, maxBuffer: 1024 * 1024 });
  const row = { id: definition.id, status: result.status, signal: result.signal || null,
    elapsedMs: Date.now() - started, workerLog: 'families/' + definition.id + '.log' };
  await fs.writeFile(path.join(output, row.workerLog), (result.stdout || '') + (result.stderr || ''));
  execution.push(row);
  await save('batch-progress.json', { schema: 'encore-static-base-canvas-batch/v1', startedAt, complete: false, expected: 18, execution });
  assert.equal(result.error, undefined, definition.id + ': worker error');
  assert.equal(result.status, 0, definition.id + ': worker failed; inspect its dated log');
  const part = JSON.parse(await fs.readFile(familyFile, 'utf8'));
  assert.equal(part.selectedId, definition.id);
  assert.equal(part.summary.pass, true);
  assert.equal(part.authoredDrawings, 2);
  assert.equal(part.appearances.length, 1);
  assert.equal(part.appearances[0].drawChecks.length, 20);
  assert.equal(part.appearances[0].portraitSourceVerified, true);
  assert.equal(part.appearances[0].uniqueRequestedFiles, 2);
  row.peakRSSBytes = part.summary.peakRSSBytes;
  if (!report) report = { ...part, selectedId: null, createdAt: startedAt, authoredDrawings: 0,
    appearances: [], sheets: [],
    scope: 'Exactly the eighteen Queenie base families introduced in continuation B on 2026-11-25.',
    collection: 'Eighteen sequential Node workers; each worker has a 128 MiB JavaScript heap limit and releases its native image state before the next.' };
  assert.deepEqual(part.sources, report.sources, 'Renderer sources changed between workers');
  assert.equal(part.offlineVersion, report.offlineVersion, 'Offline manifest changed between workers');
  for (const file of Object.values(part.appearances[0].files)) {
    const bytes = await fs.readFile(path.join(root, file.file));
    assert.equal(bytes.length, file.bytes);
    assert.equal(digest(bytes), file.sha256, 'Native bytes changed after rendering: ' + file.file);
  }
  report.authoredDrawings += part.authoredDrawings;
  report.appearances.push(...part.appearances);
  report.sheets.push(...part.sheets);
  console.log(JSON.stringify({ id: row.id, pass: true, drawChecks: 20, elapsedMs: row.elapsedMs }));
}

let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')).href);
}
const overview = skia.createCanvas(1280, Math.ceil(definitions.length / 4) * 292 + 72);
const ctx = overview.getContext('2d');
ctx.fillStyle = '#202737'; ctx.fillRect(0, 0, overview.width, overview.height);
ctx.fillStyle = '#2b3548';
for (let y = 0; y < overview.height; y += 24) for (let x = 0; x < overview.width; x += 24)
  if ((x / 24 + y / 24) % 2) ctx.fillRect(x, y, 24, 24);
ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 25px sans-serif';
ctx.fillText('Queenie · six nouvelles collections · 18 apparences', 18, 31);
ctx.font = '15px sans-serif';
ctx.fillText('Rendu Canvas de production · 36 dessins de base · sans animation ajoutée', 18, 56);
for (const [index, row] of report.appearances.entries()) {
  const sheet = await skia.loadImage(path.join(output, 'base-' + row.id + '.jpg'));
  const ox = index % 4 * 320, oy = Math.floor(index / 4) * 292 + 72;
  ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText(definitions[index].name, ox + 8, oy + 18, 304);
  ctx.font = '10px sans-serif'; ctx.fillStyle = '#c7d0df';
  ctx.fillText(row.id, ox + 8, oy + 34, 304);
  const pb = row.files.selection.bounds, portraitScale = Math.min(252 / pb.width, 290 / pb.height);
  const stanceScale = Math.min(1, 285 / row.visibleHeight, 318 / row.visibleWidth);
  const views = [
    { cx: 144, floor: 373, w: pb.width * portraitScale, h: pb.height * portraitScale, center: ox + 80 },
    { cx: 474, floor: 374, w: row.visibleWidth * stanceScale, h: row.visibleHeight * stanceScale, center: ox + 238 },
  ];
  for (const view of views) {
    const width = view.w + 12, height = view.h + 12, scale = Math.min(150 / width, 225 / height);
    ctx.drawImage(sheet, view.cx - view.w / 2 - 6, view.floor - view.h - 6, width, height,
      view.center - width * scale / 2, oy + 274 - height * scale, width * scale, height * scale);
  }
  ctx.getImageData(0, 0, 1, 1); globalThis.gc?.();
}
await fs.writeFile(path.join(output, 'bases-overview.jpg'), overview.toBuffer('image/jpeg', 90));
report.sheets.push('bases-overview.jpg');
for (const [file, hash] of Object.entries(report.sources))
  assert.equal(digest(await fs.readFile(path.join(root, file))), hash, 'Source changed during collection: ' + file);
report.summary = {
  appearances: 18, authoredDrawings: report.authoredDrawings,
  sourceAndFacingChecks: report.appearances.reduce((sum, row) => sum + row.drawChecks.length, 0),
  actualStateDraws: report.appearances.reduce((sum, row) => sum + row.drawChecks.length * 3, 0),
  portraits: report.appearances.length,
  peakWorkerRSSBytes: Math.max(...execution.map(row => row.peakRSSBytes)),
  nativeAssetHashesVerified: 36, sourceFilesCurrentAndIdentical: Object.keys(report.sources).length,
  pass: true,
};
assert.equal(report.summary.authoredDrawings, 36);
assert.equal(report.summary.sourceAndFacingChecks, 360);
assert.equal(report.summary.actualStateDraws, 1080);
report.visualReview = { status: 'pending-separate-inspection', note: 'Technical checks do not establish visual or canonical fidelity. Open all individual sheets and record observations separately.' };
report.execution = execution;
report.completedAt = new Date().toISOString();
report.collectorSha256 = digest(await fs.readFile(fileURLToPath(import.meta.url)));
report.sheetHashes = {};
for (const sheet of report.sheets) report.sheetHashes[sheet] = digest(await fs.readFile(path.join(output, sheet)));
await save('base-canvas-review.json', report);
await save('batch-progress.json', { schema: 'encore-static-base-canvas-batch/v1', startedAt, completedAt: report.completedAt, complete: true, expected: 18, execution });
overview.width = 1; overview.height = 1; globalThis.gc?.();
console.log(JSON.stringify({ output, ...report.summary, visualReview: report.visualReview.status }));

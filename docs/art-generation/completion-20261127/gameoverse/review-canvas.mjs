/** Three Gameoverse families, one sequential production-renderer worker each. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { COMPLETION_20261127_GAMEOVERSE_BASE_DEFINITIONS as targets } from '../../../../combat/base-sprite-completion-20261127-gameoverse.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const output = path.join(here, 'canvas');
const sha = value => createHash('sha256').update(value).digest('hex');
assert.equal(targets.length, 3);
assert.ok(targets.every(target => target.fighterId === 'kaufmo' && target.crossover.series === 'gameoverse'));
await fs.mkdir(output, { recursive: true });
const extraSources = {};
for (const file of [
  'combat/base-sprite-completion-20261127-gameoverse.mjs',
  'docs/art-generation/completion-20261127/gameoverse/manifest.json',
  'docs/art-generation/completion-20261127/gameoverse/review-canvas.mjs',
]) extraSources[file] = sha(await fs.readFile(path.join(root, file)));
const parts = [], execution = [];
for (const target of targets) {
  const result = spawnSync(process.execPath, ['--expose-gc', '--max-old-space-size=128',
    path.join(root, 'scripts/render-combat-base-sprite-review.mjs'),
    '--appearance', target.id, '--worker', '--output', output],
  { cwd: root, encoding: 'utf8', timeout: 60000, maxBuffer: 1024 * 1024 });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const run = { id: target.id, status: result.status, signal: result.signal || null };
  execution.push(run);
  await fs.writeFile(path.join(output, 'batch-progress.json'), JSON.stringify({
    schema: 'encore-static-base-canvas-batch/v1', complete: false, expected: targets.length, execution,
  }, null, 2) + '\n');
  assert.equal(result.error, undefined, target.id + ': worker error');
  assert.equal(result.status, 0, target.id + ': worker failed');
  const part = JSON.parse(await fs.readFile(path.join(output, 'families', target.id + '.json'), 'utf8'));
  assert.equal(part.summary.pass, true);
  assert.equal(part.selectedId, target.id);
  assert.equal(part.appearances.length, 1);
  assert.equal(part.authoredDrawings, 2);
  if (parts.length) {
    assert.deepEqual(part.sources, parts[0].sources, 'Sources changed between workers');
    assert.equal(part.offlineVersion, parts[0].offlineVersion);
  }
  run.peakRSSBytes = part.summary.peakRSSBytes;
  parts.push(part);
}

let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, loadImage } = skia;
// This review sheet only decodes worker JPEGs; it never changes the native PNGs.
const sheet = createCanvas(1060, 88 + 496 * targets.length), ctx = sheet.getContext('2d');
ctx.fillStyle = '#151c2b'; ctx.fillRect(0, 0, sheet.width, sheet.height);
ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 28px sans-serif';
ctx.fillText('Kaufmo × Gameoverse · 3 apparences · 6 dessins de base', 18, 37);
ctx.fillStyle = '#c7d6ef'; ctx.font = '20px sans-serif';
ctx.fillText('Canvas de production : portrait, garde droite, garde gauche.', 18, 68);
for (const [index, target] of targets.entries()) {
  const image = await loadImage(path.join(output, 'base-' + target.id + '.jpg'));
  const y = 88 + index * 496;
  ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 23px sans-serif';
  ctx.fillText(target.name, 26, y + 29);
  ctx.drawImage(image, 18, y + 40, 1024, 440);
  ctx.getImageData(0, 0, 1, 1);
}
await fs.writeFile(path.join(output, 'gameoverse-bases-overview.jpg'), sheet.toBuffer('image/jpeg', 92));

const report = { ...parts[0], selectedId: null,
  sources: { ...parts[0].sources, ...extraSources },
  collection: 'Three Kaufmo × Gameoverse completion families. One sequential Node process per family; 128 MiB JavaScript heap limit.',
  authoredDrawings: parts.reduce((n, part) => n + part.authoredDrawings, 0),
  appearances: parts.flatMap(part => part.appearances),
  sheets: [...parts.flatMap(part => part.sheets), 'gameoverse-bases-overview.jpg'], execution,
};
report.summary = {
  appearances: report.appearances.length, authoredDrawings: report.authoredDrawings,
  sourceAndFacingChecks: parts.reduce((n, part) => n + part.summary.sourceAndFacingChecks, 0),
  actualStateDraws: parts.reduce((n, part) => n + part.summary.actualStateDraws, 0),
  portraits: report.appearances.length,
  peakWorkerRSSBytes: Math.max(...execution.map(row => row.peakRSSBytes)), pass: true,
};
for (const [file, hash] of Object.entries(report.sources)) {
  assert.equal(sha(await fs.readFile(path.join(root, file))), hash, 'Source changed during batch: ' + file);
}
await fs.writeFile(path.join(output, 'base-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
await fs.writeFile(path.join(output, 'batch-progress.json'), JSON.stringify({
  schema: 'encore-static-base-canvas-batch/v1', complete: true, expected: targets.length, execution,
}, null, 2) + '\n');
await fs.writeFile(path.join(output, 'README.md'), `# Kaufmo × Gameoverse — revue Canvas\n\n` +
  `Version hors-ligne : \`${report.offlineVersion}\`.\n\n` +
  `${report.summary.appearances} familles, ${report.authoredDrawings} dessins natifs, ` +
  `${report.summary.sourceAndFacingChecks} contrôles état/direction et ${report.summary.actualStateDraws} rendus d’état.\n\n` +
  `Une famille par processus. Les contrôles vérifient le chemin et le SHA du PNG, le portrait distinct, les deux sens, l’échelle uniforme, l’ancre au sol et la réutilisation statique de la garde aux temps 0 et 600 puis avec mouvements réduits.\n\n` +
  `La [planche d’ensemble](gameoverse-bases-overview.jpg) provient uniquement des trois JPEG de production. Le [bilan JSON](base-canvas-review.json) conserve les empreintes des sources et la [revue visuelle](manual-visual-review.md) décrit leur inspection.\n\n` +
  `Ce contrôle natif Skia n’exécute pas le navigateur, les entrées, l’audio ni le service worker. Il ne certifie pas une animation ou une apparition canonique.\n\n` +
  targets.map(row => '- [' + row.name + '](base-' + row.id + '.jpg)').join('\n') + '\n');
console.log(JSON.stringify({ output, offlineVersion: report.offlineVersion, ...report.summary }));

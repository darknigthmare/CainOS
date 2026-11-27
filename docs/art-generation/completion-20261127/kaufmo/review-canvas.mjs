/** Targeted review of the nine new Kaufmo static bases, with one worker at a time. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { COMPLETION_20261127_KAUFMO_BASE_DEFINITIONS } from '../../../../combat/base-sprite-completion-20261127-kaufmo.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const output = path.join(here, 'canvas');
const targets = COMPLETION_20261127_KAUFMO_BASE_DEFINITIONS;
assert.equal(targets.length, 9);
assert.ok(targets.every(row => row.fighterId === 'kaufmo'));
await fs.mkdir(output, { recursive: true });
const parts = [], execution = [];
const localModule = 'combat/base-sprite-completion-20261127-kaufmo.mjs';
const localModuleSha = createHash('sha256').update(await fs.readFile(path.join(root, localModule))).digest('hex');
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
  assert.equal(createHash('sha256').update(await fs.readFile(path.join(root, localModule))).digest('hex'), localModuleSha, 'Native declarations changed during review');
  part.sources[localModule] = localModuleSha;
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
// Only the worker JPEGs are decoded here; the native sprite textures remain untouched.
const margin = 16, width = 680, height = 292, rowHeight = 348;
const sheet = createCanvas(width * 3 + margin * 4, 88 + rowHeight * 3), ctx = sheet.getContext('2d');
ctx.fillStyle = '#151c2b'; ctx.fillRect(0, 0, sheet.width, sheet.height);
ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 30px sans-serif';
ctx.fillText('Kaufmo · 9 apparences originales · 18 dessins de base', margin, 37);
ctx.fillStyle = '#c7d6ef'; ctx.font = '20px sans-serif';
ctx.fillText('Rendu Canvas de production : portrait, garde vers la droite, garde vers la gauche.', margin, 68);
const styles = ['hommage', 'resident', 'fusion'], series = ['sunsetparadise', 'gaslightdistrict', 'knightsofguinevere'];
for (let row = 0; row < styles.length; row++) for (let column = 0; column < series.length; column++) {
  const target = targets.find(item => item.crossover.series === series[column] && item.crossover.style === styles[row]);
  const image = await loadImage(path.join(output, 'base-' + target.id + '.jpg'));
  const x = margin + column * (width + margin), y = 88 + row * rowHeight;
  ctx.fillStyle = '#f6e9cc'; ctx.font = 'bold 19px sans-serif';
  ctx.fillText(target.name, x + 10, y + 29);
  ctx.drawImage(image, x, y + 40, width, height);
  ctx.getImageData(0, 0, 1, 1);
}
await fs.writeFile(path.join(output, 'kaufmo-bases-overview.jpg'), sheet.toBuffer('image/jpeg', 92));

const report = { ...parts[0], selectedId: null,
  collection: 'Only the nine Kaufmo completion families. One sequential Node process per family; 128 MiB JavaScript heap limit.',
  authoredDrawings: parts.reduce((n, part) => n + part.authoredDrawings, 0),
  appearances: parts.flatMap(part => part.appearances),
  sheets: [...parts.flatMap(part => part.sheets), 'kaufmo-bases-overview.jpg'], execution,
};
report.summary = {
  appearances: report.appearances.length, authoredDrawings: report.authoredDrawings,
  sourceAndFacingChecks: parts.reduce((n, part) => n + part.summary.sourceAndFacingChecks, 0),
  actualStateDraws: parts.reduce((n, part) => n + part.summary.actualStateDraws, 0),
  portraits: report.appearances.length,
  peakWorkerRSSBytes: Math.max(...execution.map(row => row.peakRSSBytes)), pass: true,
};
for (const [file, hash] of Object.entries(report.sources)) {
  assert.equal(createHash('sha256').update(await fs.readFile(path.join(root, file))).digest('hex'), hash, 'Source changed during batch: ' + file);
}
await fs.writeFile(path.join(output, 'base-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
await fs.writeFile(path.join(output, 'batch-progress.json'), JSON.stringify({
  schema: 'encore-static-base-canvas-batch/v1', complete: true, expected: targets.length, execution,
}, null, 2) + '\n');
await fs.writeFile(path.join(output, 'README.md'), `# Kaufmo — revue Canvas ciblée\n\n` +
  `Version hors-ligne : \`${report.offlineVersion}\`.\n\n` +
  `${report.summary.appearances} familles, ${report.authoredDrawings} dessins natifs, ` +
  `${report.summary.sourceAndFacingChecks} contrôles état/direction et ${report.summary.actualStateDraws} rendus d’état.\n\n` +
  `Chaque famille passe dans un processus Node distinct, en séquence. Les contrôles vérifient le chemin et le SHA du PNG propre à la famille, le portrait distinct, les deux sens, l’échelle uniforme, l’ancre au sol et la réutilisation statique de la garde aux temps 0 et 600 puis avec mouvements réduits. Les règles et données de combat restent inchangées.\n\n` +
  `La [planche d’ensemble](kaufmo-bases-overview.jpg) est assemblée uniquement à partir des neuf JPEG des workers. ` +
  `Le [bilan JSON](base-canvas-review.json) conserve les empreintes des sources, dont le module de continuation. ` +
  `La [revue visuelle](manual-visual-review.md) documente l’inspection visuelle de ces captures.\n\n` +
  `Ce contrôle natif Skia n’exécute pas le navigateur, les entrées, l’audio ni le service worker. Il documente dix-huit dessins statiques ; il ne certifie pas une animation ou une apparition canonique.\n\n` +
  targets.map(row => '- [' + row.name + '](base-' + row.id + '.jpg)').join('\n') + '\n');
console.log(JSON.stringify({ output, offlineVersion: report.offlineVersion, ...report.summary }));

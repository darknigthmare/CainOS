/**
 * Append Cafe Ragatha, Cafe Gangle and Cafe Zooble to the current tracker.
 * No previous recovery checkpoint is used as a data source.
 * XLSX authoring uses only public @oai/artifact-tool APIs in the primary runtime.
 * Run a private copy linked to the primary node_modules.
 * --freeze, --render-baseline, --prepare --final-evidence-confirmed, --build, --reimport,
 * --render [--view name], --publish.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/tracker-continuation-c-20261120')));
const targetDir = path.join(output, 'native-target');
const docDir = 'docs/art-generation/continuation-20261120-c/workbook';
const reviewFile = `${docDir}/workbook-review.json`;
const scriptFile = 'scripts/update-combat-continuation-c-workbook-20261120.mjs';
const xlsxName = 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx';
const xlsxPath = path.join(output, xlsxName);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const repoJson = file => json(path.join(root, file));
const loadModule = file => import(pathToFileURL(path.join(root, file)));
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const address = c => col(c[1]) + c[0];
const position = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref.replaceAll('$', '')); assert(m); return [Number(m[2]), [...m[1]].reduce((v, c) => v * 26 + c.charCodeAt(0) - 64, 0)]; };
const slots = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat'];
const tableKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const normal = rows => rows.map(r => r.map(v => v ?? ''));
const reviewScopes = p => p.scopes;
const phase = label => { globalThis.gc?.(); console.log(JSON.stringify({ phase: label, ...process.memoryUsage() })); };
assert.notEqual(output, path.join(root, 'docs'));
await fs.mkdir(output, { recursive: true });
if (args.includes('--freeze')) { await freezeBaseline(); process.exit(0); }
if (args.includes('--prepare')) { await prepare(); process.exit(0); }
if (args.includes('--publish')) { await publish(); process.exit(0); }
const { Workbook, SpreadsheetFile, FileBlob } = await import('@oai/artifact-tool');
if (args.includes('--render-baseline')) {
  const frozen = await json(path.join(output, 'baseline-freeze.json'));
  assert.equal(digest(await fs.readFile(path.join(root, 'docs', xlsxName))), frozen.files['docs/' + xlsxName].sha256);
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(root, 'docs', xlsxName)));
  for (const [sheetName, range, name] of [
    ['Synthèse', 'A1:H18', 'baseline-summary'],
    ['Production', 'A3248:J3250', 'baseline-production'],
    ['QA', 'A2458:I2459', 'baseline-qa'],
    ['Références', 'A167:E177', 'baseline-references'],
  ]) {
    const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(output, name + '.png'), new Uint8Array(await blob.arrayBuffer()));
    phase('rendered-' + name);
  }
  process.exit(0);
}
const plan = await json(path.join(output, 'update-plan.json'));
if (args.includes('--reimport')) {
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  await verify(wb, plan, true);
  await writeJson(path.join(output, 'reimport-result.json'), { status: 'passed', sha256: digest(await fs.readFile(xlsxPath)), planSha256: digest(await fs.readFile(path.join(output, 'update-plan.json'))), trackerDataSha256: digest(await fs.readFile(path.join(output, 'combat-tracker-data.json'))), formulas: plan.formulas.length, allTableRowsCompared: true, sheets: plan.counts.sheets, nativeTables: plan.counts.nativeTables });
  if (args.includes('--render')) {
    for (const [sheetName, range, name] of reviewScopes(plan)) {
      if (flag('--view', null) && flag('--view') !== name) continue;
      const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
      await fs.writeFile(path.join(output, name + '.png'), new Uint8Array(await blob.arrayBuffer()));
      phase('rendered-' + name);
    }
  }
  phase('reimport-passed'); process.exit(0);
}
if (args.includes('--render')) {
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  await verify(wb, plan, false);
  for (const [sheetName, range, name] of reviewScopes(plan)) {
    if (flag('--view', null) && flag('--view') !== name) continue;
    const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(output, name + '.png'), new Uint8Array(await blob.arrayBuffer()));
    phase('rendered-' + name);
  }
  process.exit(0);
}
assert(args.includes('--build'), 'Choose --prepare, --build, --reimport, --render or --publish');
const manifest = await json(path.join(targetDir, 'manifest.json'));
const wb = Workbook.create();
for (const entry of manifest.sheets) wb.worksheets.add(entry.name);
for (const entry of manifest.sheets) {
  const data = await json(path.join(targetDir, entry.file));
  const sheet = wb.worksheets.getItem(entry.name);
  const maxRow = Math.max(...data.cells.map(c => c[0])), maxCol = Math.max(...data.cells.map(c => c[1]));
  const matrix = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));
  for (const c of data.cells) if (!c[4]) matrix[c[0] - 1][c[1] - 1] = typeof c[3] === 'string' && c[3].startsWith('=') ? `'${c[3]}` : c[3];
  for (let start = 0; start < maxRow; start += 160) {
    const block = matrix.slice(start, Math.min(maxRow, start + 160));
    sheet.getRangeByIndexes(start, 0, block.length, maxCol).values = block;
  }
  for (const c of data.cells) if (c[4]) sheet.getRange(address(c)).formulas = [[c[4]]];
  for (const table of data.tables) {
    assert(table.rowStripes);
    const native = sheet.tables.add(table.range, true, table.name);
    native.style = table.style; native.showFilterButton = table.filter;
    native.showBandedColumns = table.columnStripes; native.showTotals = false;
  }
  sheet.showGridLines = data.gridLines;
  if (data.tabColor) sheet.tabColor = data.tabColor;
  if (data.freeze.rows) sheet.freezePanes.freezeRows(data.freeze.rows);
  if (data.freeze.columns) sheet.freezePanes.freezeColumns(data.freeze.columns);
  for (const [number, width] of Object.entries(data.widths)) sheet.getRange(`${col(Number(number))}1`).format.columnWidth = width;
  for (const [number, height] of Object.entries(data.heights)) sheet.getRange(`A${number}`).format.rowHeight = height;
  for (const run of styleRuns(data.cells)) {
    const format = apiFormat(manifest.styles[run.style]);
    if (Object.keys(format).length) sheet.getRangeByIndexes(run.row - 1, run.column - 1, run.rows, run.columns).format = format;
  }
  for (const c of data.cells) if (Object.keys(manifest.styles[c[5]].borders).length) sheet.getRange(address(c)).format.borders = manifest.styles[c[5]].borders;
  for (const rule of data.validations) sheet.getRange(rule.range).dataValidation = { rule: { type: 'list', values: rule.values } };
  for (const rule of data.rules) sheet.getRange(rule.range).conditionalFormats.add('containsText', { text: rule.text, format: rule.format });
  phase('authored-' + entry.name);
}
wb.recalculate();
await verify(wb, plan, true);
const summary = wb.worksheets.getItem('Synthèse'), production = wb.worksheets.getItem('Production');
const statusCell = plan.statusMutationCell, old = production.getRange(statusCell).values[0][0];
assert.equal(old, 'Implémenté');
const implemented = summary.getRange('B16').values[0][0], partial = summary.getRange('C16').values[0][0];
production.getRange(statusCell).values = [['Partiel']]; wb.recalculate();
assert.equal(summary.getRange('B16').values[0][0], implemented - 1);
assert.equal(summary.getRange('C16').values[0][0], partial + 1);
production.getRange(statusCell).values = [[old]]; wb.recalculate();
await verify(wb, plan, false);
const inspected = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, maxChars: 3000 });
await fs.writeFile(path.join(output, 'formula-error-scan.ndjson'), inspected.ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(xlsxPath);
await writeJson(path.join(output, 'authoring-result.json'), { status: 'exported-awaiting-native-comparison-reimport-visual-review', sha256: digest(await fs.readFile(xlsxPath)), planSha256: digest(await fs.readFile(path.join(output, 'update-plan.json'))), trackerDataSha256: digest(await fs.readFile(path.join(output, 'combat-tracker-data.json'))), method: 'Workbook.create from constrained native snapshot via public APIs', formulas: plan.formulas.length, errors: 0, representativeStatusRecalculationPassed: true });
phase('exported');


async function freezeBaseline() {
  const directory = path.join(output, 'baseline'); await fs.mkdir(directory, { recursive: true });
  const files = {};
  const expected = {
    'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx': '4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e',
    'docs/combat-tracker-data.json': '839790a0a128e09573e0c1578ccecc46e1dc20819c75108650c666a2aeabb352',
  };
  for (const file of ['docs/' + xlsxName, 'docs/combat-tracker-data.json', 'docs/combat-workbook-verification.json', 'docs/combat-qa-evidence-0.7.0.json']) {
    const bytes = await fs.readFile(path.join(root, file)), sha256 = digest(bytes);
    if (expected[file]) assert.equal(sha256, expected[file], 'Wrong starting baseline: ' + file);
    const destination = path.join(directory, path.basename(file));
    try { assert.equal(digest(await fs.readFile(destination)), sha256, 'Existing freeze differs'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await fs.writeFile(destination, bytes); }
    files[file] = { bytes: bytes.length, sha256 };
  }
  await writeJson(path.join(output, 'baseline-freeze.json'), { schema: 'encore-tracker-continuation-c-baseline/v1', createdAt: new Date().toISOString(), localCommit: 'd0b1c092120b2c472354b67ffbf136f6a58004c5', remoteCommit: '4229ce9e69b39c31b24bb296dc1c8e93bfc52852', files, scope: 'Current published tracker baseline; historical evidence retained byte for byte.' });
  phase('baseline-frozen');
}

async function prepare() {
  assert(args.includes('--final-evidence-confirmed'), 'Wait for final QA, Canvas, integration and visual evidence before preparing executed statuses.');
  const freeze = await json(path.join(output, 'baseline-freeze.json'));
  const baselineHashes = {};
  for (const [file, entry] of Object.entries(freeze.files)) {
    const bytes = await fs.readFile(path.join(root, file));
    assert.equal(bytes.length, entry.bytes); assert.equal(digest(bytes), entry.sha256, 'Installed baseline changed: ' + file);
    baselineHashes[file] = entry.sha256;
    assert.equal(digest(await fs.readFile(path.join(output, 'baseline', path.basename(file)))), entry.sha256);
  }
  assert.equal(baselineHashes['docs/' + xlsxName], '4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e');
  assert.equal(baselineHashes['docs/combat-tracker-data.json'], '839790a0a128e09573e0c1578ccecc46e1dc20819c75108650c666a2aeabb352');
  const data = await json(path.join(output, 'baseline/combat-tracker-data.json')), before = structuredClone(data);
  assert.equal(before.production.length, 3308); assert.equal(before.qa.length, 2454); assert.equal(before.sources.length, 161);
  const native = await json(path.join(output, 'native-baseline/manifest.json'));
  assert.equal(native.sha256, baselineHashes['docs/' + xlsxName]); assert.equal(native.sheets.length, 11);
  assert.equal(native.sheets.reduce((s, sh) => s + sh.cells, 0), 82697);
  assert.equal(native.sheets.reduce((s, sh) => s + sh.formulas, 0), 42);
  const sheets = new Map(), baselineSnapshotHashes = {};
  for (const file of ['manifest.json', ...native.sheets.map(s => s.file)]) baselineSnapshotHashes[file] = digest(await fs.readFile(path.join(output, 'native-baseline', file)));
  for (const entry of native.sheets) sheets.set(entry.name, await json(path.join(output, 'native-baseline', entry.file)));
  const sourceSheets = structuredClone([...sheets]);
  const evidenceHashes = {};
  async function evidence(file, expected) {
    const bytes = await fs.readFile(path.join(root, file)), hash = digest(bytes);
    if (expected) assert.equal(hash, expected, 'Evidence changed: ' + file);
    evidenceHashes[file] = hash;
    return file.endsWith('.json') ? JSON.parse(bytes) : bytes;
  }
  const folder = 'docs/art-generation/continuation-20261120-c', cafeFolder = folder + '/cafe';
  const finalProof = await evidence(folder + '/verification.json');
  const integration = await evidence(cafeFolder + '/integration-proof.json');
  const completion = await evidence(cafeFolder + '/generation-completion.json');
  const inventory = await evidence(cafeFolder + '/asset-inventory.json');
  const canvasProof = await evidence(folder + '/canvas/canvas-review.json');
  const wardrobeBaseline = await evidence(folder + '/baseline.json');
  const qaLog = await evidence(folder + '/qa.log');
  const qaText = qaLog.toString('utf8');
  const lastCount = key => { const matches = [...qaText.matchAll(new RegExp('^(?:#|ℹ) ' + key + ' (\\d+)$', 'gm'))]; assert(matches.length, 'Missing Node test count: ' + key); return Number(matches.at(-1)[1]); };
  const qaProof = { tests: lastCount('tests'), pass: lastCount('pass'), fail: lastCount('fail'), skipped: lastCount('skipped') };
  assert.equal(qaProof.tests, qaProof.pass); assert.equal(qaProof.fail, 0); assert.equal(qaProof.skipped, 0); assert(qaProof.tests >= 431);
  // These final fields are mapped only after the root's completed evidence exists.
  assert.equal(finalProof.status, 'passed_with_documented_limits');
  assert.equal(finalProof.qa.exitCode, 0); assert.equal(finalProof.qa.bothBuildsPassed, true);
  assert.equal(finalProof.qa.tests, qaProof.tests);
  assert.equal(finalProof.canvas.drawChecks, 60); assert.equal(finalProof.canvas.missing, 0);
  assert.equal(canvasProof.status, 'complete'); assert.equal(canvasProof.complete, true);
  assert.equal(canvasProof.counts.drawChecks, finalProof.canvas.drawChecks); assert.equal(canvasProof.counts.missing, 0);
  assert.equal(canvasProof.counts.uniquePublishedDrawings, 33); assert.equal(canvasProof.counts.portraits, 3);
  for (const [file, expected] of Object.entries(canvasProof.sources)) await evidence(file, expected);
  assert.equal(integration.status, 'passed'); assert.equal(integration.nativeCopiesVerified, 33);
  assert.equal(integration.nativeReferencesAndJobsVerified, true); assert.equal(integration.pixelTransforms, 0);
  assert.equal(integration.orderingFunctionPreserved, true); assert.equal(integration.historicalPrefix.costumesPreserved, 477);
  assert.equal(integration.historicalPrefix.circusAppearancesPreserved, 42);
  assert.equal(integration.historicalPrefix.definitionsAndOrderPreserved, true);
  await evidence(integration.historicalPrefix.manifest, integration.historicalPrefix.sha256);
  for (const source of integration.runtimeFiles) await evidence(source.file, source.sha256);
  assert.equal(finalProof.integrity.status, 'passed'); assert.equal(finalProof.integrity.nativeAssetComparisons, 66);
  assert.equal(finalProof.integrity.historicalAssetsUnchanged, true); assert.equal(finalProof.integrity.historicalAssetsCompared, 5830);
  assert.equal(finalProof.integrity.moduleComparisons, 38);
  assert.equal(finalProof.browser.status, 'not_executed'); assert.equal(finalProof.browser.successfulChecks, 0);
  assert.equal(finalProof.browser.attempted, true); assert.equal(finalProof.browser.navigationPerformed, false);
  for (const file of finalProof.browser.evidenceFiles) await evidence(file);
  const visualFile = finalProof.visualReview.file;
  const artVisual = await evidence(visualFile, finalProof.visualReview.sha256);
  assert.equal(artVisual.status, 'accepted_with_stated_scope');
  for (const report of Object.values(finalProof.reports || {})) await evidence(report.file, report.sha256);
  for (const [file, expected] of Object.entries(finalProof.sources || {})) await evidence(file, expected);
  const [{ COSTUME_ADDITIONS, COSTUME_ADDITION_SOURCES }, runtime, offline] = await Promise.all([
    loadModule('combat/costume-additions.mjs'), loadModule('combat/data.mjs'), loadModule('combat/offline-manifest.mjs'),
  ]);
  const order = ['caferagatha', 'cafegangle', 'cafezooble'];
  assert.equal(completion.status, 'complete_active'); assert.deepEqual(completion.order, order); assert.deepEqual(completion.slots, slots);
  assert.deepEqual(completion.appearances.map(a => a.id), order); assert.equal(completion.counts.newNativePngs, 33);
  assert.equal(completion.counts.cumulativeAppearances, 45); assert.equal(completion.counts.cumulativeAppearancePngs, 495);
  assert.deepEqual(inventory, completion.appearances.flatMap(a => a.files)); assert.equal(inventory.length, 33);
  assert.deepEqual(COSTUME_ADDITIONS.slice(0, 42).map(a => a.id), before.costumeAdditionCoverage.ids);
  assert.deepEqual(COSTUME_ADDITIONS.slice(42).map(a => a.id), order); assert.equal(COSTUME_ADDITIONS.length, 45);
  assert.equal(runtime.COSTUMES.length, 480); assert.equal(wardrobeBaseline.costumeCount, 477);
  assert.deepEqual(runtime.COSTUMES.slice(0, 477).map(c => c.id), wardrobeBaseline.costumeIds);
  assert.equal(digest(Buffer.from(JSON.stringify(runtime.COSTUMES.slice(0, 477)))), wardrobeBaseline.costumesSHA256);
  assert.deepEqual(runtime.COSTUMES.slice(477).map(c => c.id), order);
  assert.equal(runtime.FIGHTERS.length, 54); assert.equal(runtime.STAGES.length, 25); assert.equal(runtime.DEDICATED_STAGES.length, 54);
  assert.deepEqual(runtime.STAGES.map(s => s.id), before.stages.map(s => s[0]));
  assert.equal(runtime.COSTUMES.filter(c => c.crossover).length, 384); assert.equal(before.crossoverArt.costumeDrawings, 3847);
  assert.equal(offline.ART_FILES.length, 5907);
  assert.equal(offline.ART_FILES.length, finalProof.runtimeCounts.offlineImages); assert.equal(offline.ART_BYTES, finalProof.runtimeCounts.offlineBytes);
  assert.equal(offline.OFFLINE_VERSION, finalProof.runtimeCounts.offlineVersion); assert.equal(offline.ART_VERSION, finalProof.runtimeCounts.artVersion);
  const additions = new Map(runtime.COSTUMES.map(a => [a.id, a]));
  const sourceMap = new Map(COSTUME_ADDITION_SOURCES.map(source => [source.id, source]));
  const offlineFiles = new Set(offline.ART_FILES.map(file => file.replace(/^\.\.\//, '')));
  const newAssets = [], assetChecks = [], familyRows = [], drawingRows = [], qaRows = [];
  const qa = (id, area, title, status, proof, result, limit) => qaRows.push([id, area, title, status, 'P0', proof, result, limit, '']);
  const scope = 'Dessins statiques originaux adaptés au jeu. Les cycles animés complets et la comparaison canonique plan par plan restent ouverts.';
  const slotNames = { selection: 'Portrait de sélection', stance: 'Garde', intro: 'Entrée', attack: 'Attaque', heavy: 'Coup lourd', hit: 'Impact', walk: 'Marche', jump: 'Saut', crouch: 'Accroupissement', victory: 'Victoire', defeat: 'Défaite' };
  for (const id of order) {
    const def = additions.get(id); assert(def);
    const definition = await evidence(cafeFolder + '/definitions/' + id + '.json'); assert.equal(definition.id, id);
    const sourceText = def.fidelity.sourceIds.map(sourceId => { assert(sourceMap.has(sourceId)); return sourceMap.get(sourceId).scope; }).join(' ');
    familyRows.push(['WAVE32-' + id, 'Tenue Circus', def.name, 'Portrait, garde et neuf poses', 'Implémenté', 'P1',
      'assets/encore/selection/' + id + '.png\nassets/encore/stance/' + id + '.png\nassets/encore/poses/' + id + '/',
      '11 PNG natifs distincts actifs. Les onze emplacements sont détaillés dans les lignes Dessin de tenue et QA WAVE32. Preuve : ' + cafeFolder + '/integration-proof.json.',
      sourceText + ' ' + scope, '']);
    for (const slot of slots) {
      const receiptFile = cafeFolder + '/generated/' + id + '/' + slot + '.json';
      const asset = inventory.find(item => item.appearanceId === id && item.slot === slot); assert(asset);
      assert.equal(asset.receiptFile, receiptFile);
      const receipt = await evidence(receiptFile, asset.receiptSHA256);
      await evidence(asset.jobFile, asset.jobSHA256);
      assert.equal(receipt.status, 'accepted_native'); assert.equal(receipt.method, 'image_gen.imagegen');
      assert.equal(receipt.appearanceId, id); assert.equal(receipt.slot, slot); assert.equal(receipt.nativeCopyVerified, true);
      assert.equal(receipt.visualReview.status, 'accepted'); assert.equal(receipt.mode, 'RGBA');
      assert.equal(receipt.definitionSha256, evidenceHashes[cafeFolder + '/definitions/' + id + '.json']);
      const activePath = slot === 'selection' || slot === 'stance' ? 'assets/encore/' + slot + '/' + id + '.png' : 'assets/encore/poses/' + id + '/' + slot + '.png';
      assert.equal(receipt.targetFile, activePath); assert(offlineFiles.has(activePath));
      assert.equal(asset.file, activePath); assert.equal(asset.archiveFile, receipt.file);
      assert.equal(asset.sha256, receipt.sha256); assert.equal(asset.bytes, receipt.bytes); assert.deepEqual(asset.dimensions, receipt.dimensions);
      const bytes = await fs.readFile(path.join(root, activePath));
      assert.equal(digest(bytes), receipt.sha256); assert.equal(bytes.length, receipt.bytes);
      await evidence(receipt.file, receipt.sha256);
      for (const ref of receipt.portableReferences) { const refBytes = await evidence(ref.file, ref.sha256); assert.equal(refBytes.length, ref.bytes); }
      const [w, h] = receipt.dimensions, bounds = receipt.alpha12Bounds;
      assert(bounds[0] > 0 && bounds[1] > 0 && bounds[2] < w && bounds[3] < h);
      const detail = receipt.dimensions.join(' × ') + ' px · RGBA · ' + receipt.bytes.toLocaleString('fr-FR') + ' octets.\nSHA-256 : ' + receipt.sha256;
      drawingRows.push(['WAVE32-' + id + '-' + slot, 'Dessin de tenue', def.name, slotNames[slot], 'Implémenté', 'P1', activePath,
        detail + '\nReçu : ' + receiptFile,
        'Copie active identique au PNG natif archivé. Alpha natif conservé ; limites visibles mesurées à alpha > 12. ' + scope, '']);
      qa('WAVE32-asset-' + id + '-' + slot, 'Apparences · Fichier individuel', def.name + ' · ' + slotNames[slot], 'Réussi', activePath + '\n' + receiptFile,
        detail + '\nEmpreinte active = archive = reçu. Présent dans le manifeste hors ligne ; dimensions et limites alpha contrôlées.',
        'Contrôle des octets et du reçu accepté. Une image de pose n’est pas un cycle animé ni une certification d’épisode.');
      newAssets.push({ id, slot, file: activePath, sha256: receipt.sha256, bytes: receipt.bytes, generationManifest: cafeFolder + '/generation-completion.json', receipt: receiptFile, published: true });
      assetChecks.push({ appearanceId: id, slot, file: activePath, archiveFile: receipt.file, receiptFile, sha256: receipt.sha256, bytes: receipt.bytes,
        productionId: 'WAVE32-' + id + '-' + slot, qaId: 'WAVE32-asset-' + id + '-' + slot, nativeCopyVerified: true, offline: true,
        dimensions: receipt.dimensions, mode: receipt.mode, alpha12Bounds: bounds });
    }
  }
  assert.equal(newAssets.length, 33); assert.equal(new Set(newAssets.map(a => a.sha256)).size, 33);
  const nativeBytes = newAssets.reduce((sum, asset) => sum + asset.bytes, 0);
  assert.equal(nativeBytes, completion.counts.bytes);
  const newProduction = [...familyRows, ...drawingRows]; assert.equal(newProduction.length, 36); data.production.push(...newProduction);
  const newSources = [], existingIds = new Set(before.sources.map(s => s.id));
  for (const sourceId of new Set(order.flatMap(id => additions.get(id).fidelity.sourceIds))) {
    if (existingIds.has(sourceId)) continue;
    const source = sourceMap.get(sourceId); assert(source);
    newSources.push({ ...source, scope: source.scope + (source.imageUrl ? ' Image de référence : ' + source.imageUrl : '') }); existingIds.add(sourceId);
  }
  assert.equal(newSources.length, 3); data.sources.push(...newSources);
  const offlineIndex = data.sources.findIndex(s => s.id === 'offline'); assert(offlineIndex >= 0);
  data.sources[offlineIndex].scope = offline.ART_FILES.length.toLocaleString('fr-FR') + ' images et ' + offline.ART_BYTES.toLocaleString('fr-FR') + ' octets dans le manifeste local. La publication GitHub est vérifiée séparément.';
  qa('WAVE32-art', 'Apparences · Inventaire', 'Trois familles, trente-trois emplacements', 'Réussi', cafeFolder + '/integration-proof.json',
    '3 sélections, 3 gardes et 27 poses. 33 PNG natifs distincts, ' + nativeBytes.toLocaleString('fr-FR') + ' octets ; correspondance individuelle des 33 lignes Production et QA.', scope);
  qa('WAVE32-canvas', 'Apparences · Canvas', 'Rendu de production des trois familles', 'Réussi', folder + '/canvas/canvas-review.json',
    finalProof.canvas.drawChecks + ' vérifications de dessin avec les modules du jeu ; ' + finalProof.canvas.missing + ' fichier attendu manquant.',
    'Rendu Canvas2D sous Skia, distinct des interactions navigateur, de l’audio et des périphériques physiques.');
  qa('WAVE32-node', 'Code · Tests et constructions', 'Campagne finale du lot', 'Réussi', folder + '/verification.json\n' + folder + '/qa.log',
    qaProof.pass + ' tests Node réussis sur ' + qaProof.tests + ', zéro échec et les deux constructions réussies. Exécution terminée le ' + finalProof.qa.completedAt + '.',
    'Résultat daté de ce lot. Le classeur ne cumule pas les tests d’anciennes révisions et ne les présente pas comme exécutés par son builder.');
  qa('WAVE32-integrity', 'Intégrité · Distributions et histoire', 'Actifs, modules et fichiers historiques', 'Réussi', folder + '/verification.json',
    finalProof.integrity.nativeAssetComparisons + ' copies d’images comparées dans les deux distributions ; ' + finalProof.integrity.moduleComparisons + ' copies de modules et ' + finalProof.integrity.historicalAssetsCompared + ' fichiers Encore historiques préservés.',
    'Contrôle des empreintes du lot et du préfixe historique. La publication distante est une étape séparée.');
  qa('WAVE32-browser', 'Navigateur · Campagne du lot', 'Navigateur non exécuté pour cette continuation', 'Non exécuté', folder + '/verification.json',
    'Tentative de lancement Chromium bloquée avant navigation par une erreur de permission de socket ; zéro contrôle navigateur exécuté. Les trois apparences ont leurs preuves Canvas séparées.',
    'Les interactions DOM, l’audio et les périphériques physiques ne sont pas couverts par les vues Canvas. La CI distante est rapportée séparément.');
  qa('TRACKER32-update', 'Suivi · Mise à jour', 'Export des trois Café depuis le classeur réconcilié', 'Réussi', reviewFile,
    'Export XLSX, 42 formules recalculées, variation temporaire de statut annulée, réimport et comparaison native. Onze feuilles et dix tables conservées ; 33 dessins détaillés en Production et QA.',
    'Statut publié uniquement après contrôles d’export, de réimport, de structure native et revue visuelle. Aucune session Excel desktop revendiquée.');
  assert.equal(qaRows.length, 39); data.qa.push(...qaRows);
  const allAssets = [...before.costumeAdditionCoverage.assets, ...newAssets]; assert.equal(allAssets.length, 495);
  assert.equal(new Set(allAssets.map(a => a.file)).size, 495); assert.equal(new Set(allAssets.map(a => a.sha256)).size, 495);
  for (const asset of [...before.costumeAdditionCoverage.assets, ...before.npcCrossoverCoverage.assets]) {
    const bytes = await fs.readFile(path.join(root, asset.file)); assert.equal(digest(bytes), asset.sha256, 'Historical appearance changed: ' + asset.file);
    assert.equal(bytes.length, asset.bytes); assert(offlineFiles.has(asset.file));
  }
  data.costumeAdditionHistory.push({ coverage: before.costumeAdditionCoverage, review: before.costumeAdditionReview });
  data.costumeAdditionCoverage = { schema: 'encore-costume-addition-coverage/v1', asOf: '2026-11-20', ids: COSTUME_ADDITIONS.map(a => a.id), appearances: 45, pngFiles: 495,
    bytes: allAssets.reduce((sum, asset) => sum + asset.bytes, 0), drawingsBySlot: Object.fromEntries(slots.map(slot => [slot, 45])), publishedFiles: 495,
    sourceIds: [...new Set(COSTUME_ADDITIONS.flatMap(a => a.fidelity.sourceIds))], assets: allAssets };
  data.costumeAdditionReview = { asOf: '2026-11-20', evidence: folder + '/verification.json', workbookEvidence: reviewFile,
    qaRowIds: qaRows.filter(row => order.some(id => row[0].includes(id))).map(row => row[0]), appendedAppearances: 3, appendedIndividualDrawingRows: 33, newNativePngs: 33, priorAppearancesPreserved: 42 };
  data.qaCampaigns.push(before.currentQa);
  data.currentQa = { gameVersion: data.version, campaign: 'continuation-c-2026-11-20', complete: false, evidence: folder + '/verification.json', workbookEvidence: reviewFile,
    rowIds: qaRows.map(r => r[0]), totals: { nodeTests: qaProof.tests, nodePassed: qaProof.pass, browserAssertionsExecutedByWorkbookUpdate: 0 },
    scope: 'Preuves finales importées avec leurs dates et empreintes. Les tests du jeu ne sont pas présentés comme exécutés par le builder du classeur.' };
  data.historicalQaRows = before.qa.length;
  data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(s => [s, data.qa.filter(r => r[3] === s).length]));
  data.qaSummaryScope = 'Lignes historiques et preuves datées ; les tests de plusieurs révisions ne sont pas additionnés comme exécutions de cette mise à jour.';
  data.asOf = '2026-11-20'; data.contentAsOf = '2026-11-20';
  Object.assign(data.counts, { variants: 480, costumeAdditions: 45, production: data.production.length, qa: data.qa.length, offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES });
  data.continuationCPass = { asOf: '2026-11-20', evidence: reviewFile, baseWorkbookSHA256: baselineHashes['docs/' + xlsxName], appendedAppearanceIds: order,
    newNativeAppearanceFiles: 33, appendedDrawingRows: 33, appendedStageId: null, newNativeStagePlanes: 0, priorHistoryPreserved: true, historicalCostumePrefixCount: 477, pendingNpcCrossoverFamilies: 1074 };
  const featureChanges = [];
  function updateFeature(id, column, value) { const index = data.features.findIndex(row => row[0] === id); assert(index >= 0); const prior = data.features[index][column]; data.features[index][column] = value; featureChanges.push({ id, row: index + 6, column: column + 1, before: prior, value }); }
  updateFeature('PRE-03', 6, '480 tenues équipables : 51 variantes d’archive, 45 tenues Circus et 384 crossovers dans 9 collections. Le joueur et le rival peuvent utiliser des apparences différentes.');
  updateFeature('PRD-11', 6, 'Documenter 54 combattants, 540 techniques, 25 arènes, 51 variantes historiques, 45 tenues Circus et 384 crossovers, avec leurs repères et limites de référence.');
  const sourceChanges = [];
  for (const key of ['roster', 'moves', 'atlas', 'stages', 'scenarios', 'dedicatedStages', 'workbookReconciliation', 'costumePreparationHistory', 'costumeAdditionPreparation', 'extension', 'nextMissingPass', 'nextWavePass', 'continuationBPass', 'illustratedAssets', 'illustratedArtDate', 'crossoverArt', 'crossoverArtHistory', 'npcCrossoverCoverage', 'npcCrossoverCoverageHistory']) assert.deepEqual(data[key], before[key], 'Preserved companion section: ' + key);
  assert.deepEqual(data.qa.slice(0, before.qa.length), before.qa); assert.deepEqual(data.production.slice(0, before.production.length), before.production);
  for (let i = 0; i < before.features.length; i++) {
    assert.equal(data.features[i][0], before.features[i][0]); assert.equal(data.features[i][8], before.features[i][8]);
    for (let c = 0; c < before.features[i].length; c++) if (!featureChanges.some(change => change.row === i + 6 && change.column === c + 1)) assert.deepEqual(data.features[i][c], before.features[i][c]);
  }
  assert.equal(data.production.find(r => r[0] === 'SERIES-jax__australian_extremist')[4], 'À vérifier');
  assert.equal(data.production.find(r => r[0] === 'RIBBIT28-maidribbit-reference')[4], 'À vérifier');
  for (const key of ['production', 'qa']) assert.equal(new Set(data[key].map(r => r[0])).size, data[key].length);
  assert.equal(new Set(data.sources.map(s => s.id)).size, data.sources.length);
  const changed = new Map();
  const setCell = (name, ref, value, formula = null) => {
    const [r, c] = position(ref), cell = sheets.get(name).cells.find(x => x[0] === r && x[1] === c); assert(cell, name + '!' + ref);
    if (!changed.has(name + '!' + ref)) changed.set(name + '!' + ref, { sheet: name, cell: ref, before: cell.slice(2, 5), value, formula });
    else Object.assign(changed.get(name + '!' + ref), { value, formula });
    cell[2] = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'; cell[3] = value; cell[4] = formula;
  };
  for (const change of featureChanges) setCell('Fonctionnalités', col(change.column) + change.row, change.value);
  for (const change of sourceChanges) setCell('Références', col(change.column) + change.row, change.value);
  const appendStyle = fill => { native.styles.push({ font: { name: 'Arial', size: 10, bold: false, italic: false, color: '#23243B' }, fill, borders: {}, numberFormat: 'General', horizontalAlignment: 'general', verticalAlignment: 'center', wrapText: true }); return native.styles.length - 1; };
  const styles = { light: appendStyle('#F4F0F8'), white: appendStyle('#FFFFFF'), note: appendStyle('#FFF1C9') };
  const rowHeight = (sheet, row, minimum) => Math.max(minimum, 13 * Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((s, line) => s + Math.max(1, Math.ceil(line.length / Math.max(12, (sheet.widths[c + 1] || 22) * 1.08))), 0))) + 10);
  function append(name, rows, oldCount, noteColumn) {
    const sheet = sheets.get(name), width = sheet.tables[0].columns.length;
    for (const [i, row] of rows.entries()) {
      const number = oldCount + i + 6; assert.equal(row.length, width);
      row.forEach((v, c) => sheet.cells.push([number, c + 1, typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'string', v, null, c + 1 === noteColumn ? styles.note : (oldCount + i) % 2 ? styles.white : styles.light]));
      // Individual receipts wrap across several lines in the existing narrow
      // H column. Keep the historical width and give these new rows enough
      // height for the full digest and repository path.
      const minimum = name === 'Références' ? 70 : name === 'Production' && row[1] === 'Dessin de tenue' ? 170 : name === 'QA' && row[0].startsWith('WAVE32-asset-') ? 145 : 42;
      sheet.heights[number] = rowHeight(sheet, row, minimum);
    }
    sheet.tables[0].range = 'A5:' + col(width) + (oldCount + rows.length + 5);
    if (!['Production', 'QA'].includes(name)) return;
    const letter = name === 'QA' ? 'D' : 'E', range = letter + (oldCount + 6) + ':' + letter + (oldCount + rows.length + 5);
    sheet.validations.push({ range, values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] });
    for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Non exécuté', '#EAE7F1', '#56496D']]) sheet.rules.push({ range, text, format: { font: { color }, fill }, priority: sheet.rules.length + 1 });
  }
  append('Production', newProduction, before.production.length, 10);
  append('QA', qaRows, before.qa.length, 9);
  const featureSheet = sheets.get('Fonctionnalités');
  for (const row of new Set(featureChanges.map(c => c.row))) featureSheet.heights[row] = Math.max(featureSheet.heights[row] || 0, rowHeight(featureSheet, data.features[row - 6], 42));
  const references = sheets.get('Références'), footerStart = before.sources.length + 6, shift = newSources.length;
  for (const c of references.cells) if (c[0] >= footerStart) c[0] += shift;
  references.heights = Object.fromEntries(Object.entries(references.heights).map(([r, h]) => [Number(r) >= footerStart ? Number(r) + shift : r, h]));
  append('Références', newSources.map(s => [s.id, s.title, s.kind, s.url, s.scope]), before.sources.length, null);
  setCell('Références', 'E' + (offlineIndex + 6), data.sources[offlineIndex].scope);
  const summary = sheets.get('Synthèse');
  for (const c of summary.cells) if (c[4]) {
    let formula = c[4];
    for (const [sheetName, oldCount, newCount] of [['Production', before.production.length, data.production.length], ['QA', before.qa.length, data.qa.length], ['Arènes', before.stages.length, data.stages.length]]) {
      formula = formula.replace(new RegExp("('" + sheetName + "'![A-Z]+\\$?6:[A-Z]+\\$?)" + (oldCount + 5) + '(?=[,)])', 'g'), '$1' + (newCount + 5));
    }
    setCell('Synthèse', address(c), c[3], formula);
  }
  const summaryValues = { H2: 'Version 0.7.0 · continuation C · 20 novembre 2026', H8: '45 tenues Circus · 495 dessins individuels', H13: qaProof.tests + ' tests Node dans la preuve finale du lot', H14: 'Navigateur local non exécuté pour cette continuation', H15: 'Classeur recalculé et réimporté ; historique conservé', H16: '3 tenues Café · 33 dessins individuels', H30: '105 ensembles de base + 45 tenues (495 PNG)' };
  for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
  const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
  for (const c of summary.cells) if (c[4]) setCell('Synthèse', address(c), evaluate(c[4].slice(1), lookup, 'Synthèse'), c[4]);
  assert.equal(lookup.get('Synthèse').get('B9')[3], 25);
  assert.equal(lookup.get('Synthèse').get('B11')[3], 480);
  assert.equal(lookup.get('Synthèse').get('F16')[3], 3344);
  assert.equal(lookup.get('Synthèse').get('F22')[3], 2493);
  assert.equal(lookup.get('Synthèse').get('H21')[3], '25 thèmes musicaux d’arènes');
  assert.equal(lookup.get('Synthèse').get('H24')[3], '25 ambiances visuelles animées');
  assert.equal(lookup.get('Synthèse').get('H32')[3], '25 ambiances sonores originales');
  let constrainedCells = 0;
  const approvedRowHeightChanges = [];
  for (const [name, source] of sourceSheets) {
    const target = sheets.get(name), cells = new Map(target.cells.map(c => [address(c), c]));
    for (const prop of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) assert.deepEqual(source[prop], target[prop], name + '/' + prop);
    for (const [oldRow, oldHeight] of Object.entries(source.heights)) {
      const row = Number(oldRow) + (name === 'Références' && Number(oldRow) >= footerStart ? shift : 0);
      const height = target.heights[row];
      if (height !== oldHeight) {
        assert.equal(name, 'Fonctionnalités');
        assert(featureChanges.some(change => change.row === row));
        assert(height >= oldHeight, 'Historical row height cannot decrease');
        approvedRowHeightChanges.push({ sheet: name, row, before: oldHeight, after: height });
      }
    }
    assert.deepEqual(target.validations.slice(0, source.validations.length), source.validations);
    assert.deepEqual(target.rules.slice(0, source.rules.length), source.rules);
    for (const c of source.cells) {
      const ref = col(c[1]) + (c[0] + (name === 'Références' && c[0] >= footerStart ? shift : 0)), actual = cells.get(ref); assert(actual);
      assert.deepEqual(native.styles[c[5]], native.styles[actual[5]], name + '/' + ref + ' style');
      if (!changed.has(name + '!' + ref)) assert.deepEqual(actual.slice(2, 5), c.slice(2, 5), name + '/' + ref + ' content');
      constrainedCells++;
    }
    for (const table of source.tables) {
      const actual = target.tables.find(t => t.name === table.name); assert(actual);
      assert.deepEqual({ ...actual, range: table.range }, table, 'Historical table structure ' + name);
    }
  }
  assert.equal(constrainedCells, 82697);
  await fs.mkdir(targetDir, { recursive: true });
  for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
  native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
  await writeJson(path.join(output, 'combat-tracker-data.json'), data);
  const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']];
  for (const row of new Set(featureChanges.map(c => c.row))) scopes.push(['Fonctionnalités', 'A' + row + ':I' + row, 'feature-' + data.features[row - 6][0].toLowerCase()]);
  scopes.push(['Production', 'A' + (before.production.length + 6) + ':J' + (before.production.length + familyRows.length + 5), 'production-1']);
  for (let i = familyRows.length, view = 2; i < newProduction.length; i += 4, view++) scopes.push(['Production', 'A' + (before.production.length + i + 6) + ':J' + (before.production.length + Math.min(i + 3, newProduction.length - 1) + 6), 'production-' + view]);
  for (let i = 0; i < qaRows.length; i += 4) scopes.push(['QA', 'A' + (before.qa.length + i + 6) + ':I' + (before.qa.length + Math.min(i + 3, qaRows.length - 1) + 6), 'qa-' + (i / 4 + 1)]);
  scopes.push(['Références', 'A' + (before.sources.length + 6) + ':E' + (data.sources.length + 5), 'references-new'],
    ['Références', 'A' + (offlineIndex + 6) + ':E' + (offlineIndex + 6), 'references-offline'],
    ['Références', 'A' + (data.sources.length + 6) + ':E' + (data.sources.length + 16), 'references-footer']);
  const finalPlan = { schema: 'encore-tracker-continuation-c-plan/v1', createdAt: new Date().toISOString(), baselineHashes, baselineSnapshotHashes,
    historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], approvedRowHeightChanges,
    coverageChanges: { featureIds: [...new Set(featureChanges.map(c => c.id))], sourceIds: sourceChanges.map(c => c.id), promotedNpcFamilies: 6, remainingNpcFamilies: 1074, noHistoricalProductionRowChanged: true, allStageAndCrossoverDataPreserved: true },
    appendedProductionIds: newProduction.map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(s => s.id), appendedStageId: null,
    evidenceHashes, runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) },
    counts: { ...data.counts, sheets: 11, nativeTables: [...sheets.values()].reduce((s, sh) => s + sh.tables.length, 0), sources: data.sources.length,
      addedProductionRows: 36, addedQaRows: 39, addedSourceRows: newSources.length, addedStageRows: 0, costumePngs: 495, crossoverCostumes: 384, crossoverDrawings: 3847,
      newIndividualDrawingRows: 33, historicalCells: 82697, totalNativeCells: native.sheets.reduce((s, sh) => s + sh.cells, 0) },
    formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: 'E' + (before.production.length + 6), scopes,
    historicalFooterShift: shift, assetSlotChecks: assetChecks, activeAssetDigests: newAssets.map(a => ({ file: a.file, sha256: a.sha256, bytes: a.bytes })),
    qaEvidence: { tests: qaProof.tests, failures: 0, bothBuildsPassed: true, costumeCanvasDrawChecks: finalProof.canvas.drawChecks, stageCanvasChecks: 0,
      nativeDistributionComparisons: finalProof.integrity.nativeAssetComparisons, moduleComparisons: finalProof.integrity.moduleComparisons,
      historicalEncoreFiles: finalProof.integrity.historicalAssetsCompared } };
  assert.equal(finalPlan.formulas.length, 42); assert.equal(finalPlan.counts.nativeTables, 10); assert.equal(finalPlan.counts.totalNativeCells, 83423);
  await writeJson(path.join(output, 'asset-slot-verification.json'), { schema: 'encore-tracker-asset-slots/v1', status: 'passed', verifiedSlots: 33, order, slots, checks: assetChecks, productionRowCount: drawingRows.length, qaRowCount: qaRows.filter(r => r[0].startsWith('WAVE32-asset-')).length });
  await writeJson(path.join(output, 'update-plan.json'), finalPlan);
  phase('prepared-final-plan');
}

async function verify(workbook, p, tables) {
  const summary = workbook.worksheets.getItem('Synthèse');
  for (const f of p.formulas) { assert.equal(summary.getRange(f.cell).formulas[0][0], f.formula); assert.equal(summary.getRange(f.cell).values[0][0], f.value, f.cell); }
  if (!tables) return;
  const data = await json(path.join(output, 'combat-tracker-data.json'));
  for (const [sheetName, key] of Object.entries(tableKeys)) assert.deepEqual(normal(workbook.worksheets.getItem(sheetName).tables.items[0].getDataRows()), normal(data[key]), `All rows ${sheetName}`);
  assert.deepEqual(normal(workbook.worksheets.getItem('Références').tables.items[0].getDataRows()), normal(data.sources.map(s => [s.id, s.title, s.kind, s.url, s.scope])));
  // Extension PNJ has no separate companion array. Compare its native table
  // directly with the preserved target as well, so all ten tables are covered.
  const native = await json(path.join(targetDir, 'manifest.json'));
  for (const entry of native.sheets.filter(s => !(s.name in tableKeys) && s.name !== 'Références')) {
    const expected = await json(path.join(targetDir, entry.file));
    const cells = new Map(expected.cells.map(c => [address(c), c[3]]));
    for (const table of expected.tables) {
      const [first, last] = table.range.split(':').map(position);
      const rows = Array.from({ length: last[0] - first[0] }, (_, r) => Array.from({ length: last[1] - first[1] + 1 }, (_, c) => cells.get(col(first[1] + c) + (first[0] + r + 1))));
      const actual = workbook.worksheets.getItem(entry.name).tables.items.find(t => t.name === table.name); assert(actual);
      assert.deepEqual(normal(actual.getDataRows()), normal(rows), `Preserved native table ${entry.name}/${table.name}`);
    }
  }
}



async function publish() {
  const p = await json(path.join(output, 'update-plan.json'));
  const comparison = await json(path.join(output, 'native-comparison.json'));
  const imported = await json(path.join(output, 'reimport-result.json'));
  const authored = await json(path.join(output, 'authoring-result.json'));
  const visual = await json(path.join(output, 'visual-review.json'));
  const baselineVisual = await json(path.join(output, 'baseline-visual-review.json'));
  assert.equal(baselineVisual.workbookSHA256, p.baselineHashes['docs/' + xlsxName]);
  assert.equal(baselineVisual.status, 'accepted_as_baseline');
  for (const view of baselineVisual.views) assert.equal(digest(await fs.readFile(path.join(output, view.file))), view.sha256);
  const slotsReport = await json(path.join(output, 'asset-slot-verification.json'));
  const workbookSHA256 = digest(await fs.readFile(xlsxPath)), trackerDataSHA256 = digest(await fs.readFile(path.join(output, 'combat-tracker-data.json')));
  const planSha256 = digest(await fs.readFile(path.join(output, 'update-plan.json')));
  assert.equal(comparison.status, 'passed'); assert.equal(imported.status, 'passed'); assert.equal(visual.status, 'accepted');
  assert.equal(slotsReport.status, 'passed'); assert.equal(slotsReport.verifiedSlots, 33);
  assert.deepEqual(slotsReport.checks, p.assetSlotChecks);
  assert.equal(comparison.actualSHA256, workbookSHA256); assert.equal(imported.sha256, workbookSHA256); assert.equal(authored.sha256, workbookSHA256);
  assert.equal(authored.planSha256, planSha256); assert.equal(imported.planSha256, planSha256);
  assert.equal(authored.trackerDataSha256, trackerDataSHA256); assert.equal(imported.trackerDataSha256, trackerDataSHA256);
  assert.equal(visual.workbookSHA256, workbookSHA256); assert.equal(visual.planSha256, planSha256);
  const targetManifest = await json(path.join(targetDir, 'manifest.json'));
  const targetHashes = Object.fromEntries(await Promise.all(['manifest.json', ...targetManifest.sheets.map(s => s.file)].map(async file => [file, digest(await fs.readFile(path.join(targetDir, file)))])));
  const reimportDir = path.join(output, 'native-reimport');
  const reimportManifest = await json(path.join(reimportDir, 'manifest.json'));
  assert.equal(reimportManifest.sha256, workbookSHA256);
  const reimportHashes = Object.fromEntries(await Promise.all(['manifest.json', ...reimportManifest.sheets.map(s => s.file)].map(async file => [file, digest(await fs.readFile(path.join(reimportDir, file)))])));
  assert.deepEqual(comparison.expectedSnapshotHashes, targetHashes);
  assert.deepEqual(visual.views.map(v => v.file).sort(), reviewScopes(p).map(s => s[2] + '.png').sort());
  for (const view of visual.views) assert.equal(digest(await fs.readFile(path.join(output, view.file))), view.sha256);
  for (const [file, expected] of Object.entries(p.baselineHashes)) assert.equal(digest(await fs.readFile(path.join(root, file))), expected, 'Installed baseline changed: ' + file);
  assert.equal(digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))), p.runtimeManifest.sha256);
  for (const [file, expected] of Object.entries(p.evidenceHashes)) assert.equal(digest(await fs.readFile(path.join(root, file))), expected, 'Evidence changed after plan: ' + file);
  for (const asset of p.activeAssetDigests) {
    const bytes = await fs.readFile(path.join(root, asset.file));
    assert.equal(bytes.length, asset.bytes); assert.equal(digest(bytes), asset.sha256);
  }
  const data = await json(path.join(output, 'combat-tracker-data.json'));
  const sourceDigests = { ...p.evidenceHashes, 'combat/offline-manifest.mjs': p.runtimeManifest.sha256 };
  for (const file of [scriptFile, 'scripts/inspect-combat-workbook-native.py', 'scripts/workbook-publication.mjs']) sourceDigests[file] = digest(await fs.readFile(path.join(root, file)));
  const report = {
    schema: 'encore-tracker-continuation-c-review/v1', createdAt: new Date().toISOString(), gameVersion: data.version,
    workbookSHA256, trackerDataSHA256, sourceDigests, baselineHashes: p.baselineHashes, baselineSnapshotHashes: p.baselineSnapshotHashes,
    counts: p.counts, runtimeManifest: p.runtimeManifest, currentQa: data.currentQa,
    formulas: { count: 42, recalculated: true, errors: 0, statusChangeRecalculated: true, exportRoundTripPassed: true },
    nativeComparison: comparison, reimport: imported, visualReview: visual, baselineVisualReview: baselineVisual, assetSlotVerification: slotsReport,
    historicalCellsConstrained: p.historicalCellsConstrained, originalIdsAndOrderPreserved: true, userNotesPreserved: true,
    historicalEvidencePreserved: true, coverageChanges: p.coverageChanges,
    appendedProductionIds: p.appendedProductionIds, appendedQaIds: p.appendedQaIds,
    appendedSourceIds: p.appendedSourceIds, appendedStageId: p.appendedStageId, qaEvidence: p.qaEvidence,
    releaseReviewed: false, fullCiExecutedByWorkbookUpdate: false, canonicalVisualApproval: false,
    limitations: [
      'The update authored and checked the workbook, all native cells, all ten tables, all forty-two formulas and the thirty-three individual drawing slots.',
      'Runtime QA and Canvas results retain the dates, versions and scopes of the final frozen generation wave.',
      'No desktop Excel session, physical-device test, full animation cycle or scene-by-scene canonical approval is claimed.',
      'The published fields in costume coverage denote active local files; GitHub publication is recorded separately.',
    ],
  };
  await writeJson(path.join(output, 'workbook-review.json'), report);
  await writeJson(path.join(output, 'combat-workbook-verification.json'), report);
  const { publishWorkbookArtifacts } = await loadModule('scripts/workbook-publication.mjs');
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json'].map(name => ({ source: path.join(output, name), name })) });
  const dest = path.join(root, docDir); await fs.mkdir(dest, { recursive: true });
  for (const name of ['workbook-review.json', 'update-plan.json', 'native-comparison.json', 'reimport-result.json', 'authoring-result.json', 'visual-review.json', 'formula-error-scan.ndjson', 'baseline-freeze.json', 'baseline-visual-review.json', 'asset-slot-verification.json']) await fs.copyFile(path.join(output, name), path.join(dest, name));
  for (const [, , name] of reviewScopes(p)) await fs.copyFile(path.join(output, name + '.png'), path.join(dest, name + '.png'));
  for (const name of ['baseline-summary', 'baseline-production', 'baseline-qa', 'baseline-references']) await fs.copyFile(path.join(output, name + '.png'), path.join(dest, name + '.png'));
  await writeJson(path.join(dest, 'native-snapshot-hashes.json'), { baseline: p.baselineSnapshotHashes, target: targetHashes, reimport: reimportHashes });
  const published = {};
  for (const name of [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json']) {
    published[name] = digest(await fs.readFile(path.join(root, 'docs', name)));
    assert.equal(published[name], digest(await fs.readFile(path.join(output, name))));
  }
  const historicalSha = digest(await fs.readFile(path.join(root, 'docs/combat-qa-evidence-0.7.0.json')));
  assert.equal(historicalSha, p.baselineHashes['docs/combat-qa-evidence-0.7.0.json']);
  await writeJson(path.join(dest, 'publication.json'), { status: 'published_locally_verified', createdAt: new Date().toISOString(), files: published, historicalQaEvidencePreserved: true, historicalQaEvidenceSHA256: historicalSha, gitPublishedByThisScript: false });
  phase('published-and-verified');
}

function apiFormat(style) {
  const result = {};
  if (JSON.stringify(style.font) !== JSON.stringify({ name: 'Carlito', size: 11, bold: false, italic: false, color: null })) result.font = Object.fromEntries(Object.entries(style.font).filter(([, v]) => v !== null));
  if (style.fill) result.fill = style.fill;
  if (style.numberFormat !== 'General') result.numberFormat = style.numberFormat;
  if (style.horizontalAlignment !== 'general') result.horizontalAlignment = style.horizontalAlignment;
  if (style.verticalAlignment !== 'bottom') result.verticalAlignment = style.verticalAlignment;
  if (style.wrapText) result.wrapText = true;
  return result;
}
function styleRuns(cells) {
  const rows = new Map(); for (const c of cells) { if (!rows.has(c[0])) rows.set(c[0], []); rows.get(c[0]).push(c); }
  const result = [], open = new Map();
  for (const [row, items] of rows) {
    const ranges = [];
    for (const c of items) { const prior = ranges.at(-1); if (prior && prior.style === c[5] && prior.column + prior.columns === c[1]) prior.columns++; else ranges.push({ row, column: c[1], rows: 1, columns: 1, style: c[5] }); }
    const active = new Set();
    for (const r of ranges) { const key = `${r.column}:${r.columns}:${r.style}`; active.add(key); const prior = open.get(key); if (prior && prior.row + prior.rows === row) prior.rows++; else { result.push(r); open.set(key, r); } }
    for (const key of open.keys()) if (!active.has(key)) open.delete(key);
  }
  return result;
}
function split(expression, separator) {
  const out = []; let start = 0, depth = 0, quote = null;
  for (let i = 0; i < expression.length; i++) { const c = expression[i]; if (quote) { if (c === quote) { if (expression[i + 1] === quote) i++; else quote = null; } continue; } if (c === '"' || c === "'") quote = c; else if (c === '(') depth++; else if (c === ')') depth--; else if (c === separator && depth === 0) { out.push(expression.slice(start, i)); start = i + 1; } }
  out.push(expression.slice(start)); return out;
}
function evaluate(expression, lookup, name) {
  const concat = split(expression, '&'); if (concat.length > 1) return concat.map(p => evaluate(p, lookup, name)).join('');
  const add = split(expression, '+'); if (add.length > 1) return add.reduce((s, p) => s + Number(evaluate(p, lookup, name)), 0);
  if (expression.startsWith('"')) { assert(expression.endsWith('"')); return expression.slice(1, -1).replaceAll('""', '"'); }
  if (/^[0-9]+$/.test(expression)) return Number(expression);
  const fn = /^(COUNTA|COUNTIFS)\((.*)\)$/.exec(expression);
  if (fn) {
    const parts = split(fn[2], ','), ranges = [];
    for (let i = 0; i < parts.length; i += fn[1] === 'COUNTA' ? 1 : 2) { const ref = /^'([^']+)'!([A-Z]+\$?\d+):([A-Z]+\$?\d+)$/.exec(parts[i]); assert(ref); const [first, c] = position(ref[2]), [last, endC] = position(ref[3]); assert.equal(c, endC); ranges.push({ values: Array.from({ length: last - first + 1 }, (_, j) => lookup.get(ref[1]).get(col(c) + (first + j))), criterion: fn[1] === 'COUNTIFS' ? evaluate(parts[i + 1], lookup, name) : null }); }
    if (fn[1] === 'COUNTA') return ranges.reduce((s, r) => s + r.values.filter(c => c && c[2] !== 'blank').length, 0);
    assert(ranges.every(r => r.values.length === ranges[0].values.length)); return ranges[0].values.reduce((s, _, i) => s + Number(ranges.every(r => r.values[i]?.[3] === r.criterion)), 0);
  }
  const cell = lookup.get(name).get(expression.replaceAll('$', '')); assert(cell, expression); return cell[4] ? evaluate(cell[4].slice(1), lookup, name) : cell[3];
}

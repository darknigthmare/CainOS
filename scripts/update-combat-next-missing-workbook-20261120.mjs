/**
 * Append the November 20 next-missing wave to the CURRENT reconciled tracker.
 * No previous recovery checkpoint is used as a data source.
 * XLSX authoring uses only public @oai/artifact-tool APIs in the primary runtime.
 * Run a private copy linked to the primary node_modules.
 * --render-baseline, --prepare --final-evidence-confirmed, --build, --reimport,
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
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/tracker-next-missing-20261120')));
const targetDir = path.join(output, 'native-target');
const docDir = 'docs/art-generation/workbook-next-missing-20261120';
const reviewFile = `${docDir}/workbook-review.json`;
const scriptFile = 'scripts/update-combat-next-missing-workbook-20261120.mjs';
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
if (args.includes('--prepare')) { await prepare(); process.exit(0); }
if (args.includes('--publish')) { await publish(); process.exit(0); }
const { Workbook, SpreadsheetFile, FileBlob } = await import('@oai/artifact-tool');
if (args.includes('--render-baseline')) {
  const frozen = await json(path.join(output, 'baseline-freeze.json'));
  assert.equal(digest(await fs.readFile(path.join(root, 'docs', xlsxName))), frozen.files['docs/' + xlsxName].sha256);
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(root, 'docs', xlsxName)));
  for (const [sheetName, range, name] of [
    ['Synthèse', 'A1:H18', 'baseline-summary'],
    ['Arènes', 'A27:L27', 'baseline-stage-left'],
    ['Arènes', 'M27:T27', 'baseline-stage-right'],
    ['Production', 'A3137:J3139', 'baseline-production'],
    ['QA', 'A2284:I2286', 'baseline-qa'],
    ['Références', 'A151:E164', 'baseline-references'],
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


async function prepare() {
  assert(args.includes('--final-evidence-confirmed'), 'Wait for the final frozen QA, Canvas and consolidated evidence before preparing executed statuses.');
  const freeze = await json(path.join(output, 'baseline-freeze.json'));
  const baselineHashes = {};
  for (const [file, entry] of Object.entries(freeze.files)) {
    const bytes = await fs.readFile(path.join(root, file));
    assert.equal(bytes.length, entry.bytes);
    assert.equal(digest(bytes), entry.sha256, 'Installed baseline changed: ' + file);
    baselineHashes[file] = entry.sha256;
    assert.equal(digest(await fs.readFile(path.join(output, 'baseline', path.basename(file)))), entry.sha256);
  }
  assert.equal(baselineHashes['docs/' + xlsxName], 'aea3c94ea5921f9ed1fd0a4c46b769587c338b2a63d4d70fef8f18a70b0dda5a');
  assert.equal(baselineHashes['docs/combat-tracker-data.json'], 'd84353598c621b729098937f9816b5930b960746d85072cbcdd637322157f7c8');
  const data = await json(path.join(output, 'baseline/combat-tracker-data.json')), before = structuredClone(data);
  assert.equal(before.production.length, 3134); assert.equal(before.qa.length, 2281); assert.equal(before.sources.length, 149);
  const native = await json(path.join(output, 'native-baseline/manifest.json'));
  assert.equal(native.sha256, baselineHashes['docs/' + xlsxName]);
  assert.equal(native.sheets.length, 11);
  assert.equal(native.sheets.reduce((s, sh) => s + sh.cells, 0), 79280);
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
  const folder = 'docs/art-generation/cast-next-missing-20261120', stageFolder = 'docs/art-generation/stage-next-missing-20261120';
  const completion = await evidence(folder + '/generation-completion.json');
  const inventory = await evidence(folder + '/asset-inventory.json');
  const qaProof = await evidence(folder + '/qa-result.json');
  await evidence(qaProof.log);
  const runtimeProof = await evidence(folder + '/runtime-counts.json');
  const canvasProof = await evidence(folder + '/canvas-summary.json');
  const integrityProof = await evidence(folder + '/build-integrity.json');
  const finalProof = await evidence(folder + '/verification.json');
  const artVisual = await evidence(folder + '/visual-review.json');
  assert.equal(artVisual.status, 'accepted_with_stated_scope');
  const independent = await evidence(folder + '/' + finalProof.visualReview.independentEvidence, finalProof.visualReview.independentSha256);
  assert.equal(finalProof.status, 'local_qa_canvas_and_integrity_passed_browser_not_reexecuted');
  assert.equal(finalProof.generation.manifestSha256, evidenceHashes[folder + '/generation-completion.json']);
  assert.deepEqual(finalProof.runtimeCounts, runtimeProof);
  const stageInventory = await evidence(stageFolder + '/asset-inventory.json');
  const stageProof = await evidence(stageFolder + '/verification.json');
  const stageCanvas = await evidence(stageFolder + '/' + stageProof.canvas.path, stageProof.canvas.sha256);
  await evidence(stageFolder + '/' + stageProof.visualReview.path, stageProof.visualReview.sha256);
  await evidence(stageFolder + '/' + stageProof.testLog.path, stageProof.testLog.sha256);
  assert.equal(completion.status, 'complete_active');
  assert.equal(qaProof.exitCode, 0); assert.equal(qaProof.testSummary.tests, 411);
  assert.equal(qaProof.testSummary.pass, 411); assert.equal(qaProof.testSummary.fail, 0); assert.equal(qaProof.bothBuildsPassed, true);
  assert.equal(canvasProof.complete, true); assert.equal(canvasProof.counts.missing, 0);
  assert.equal(canvasProof.counts.appearances, 4); assert.equal(integrityProof.status, 'passed');
  assert.equal(integrityProof.nativeAssetComparisons, 94);
  assert.equal(integrityProof.costumeComparisons, 88); assert.equal(integrityProof.stageComparisons, 6);
  assert.equal(stageProof.visualReview.accepted, true);
  assert.equal(stageProof.counts.canvasChecks, 6);
  assert.equal(stageProof.canvas.manifestSnapshot.images, 5769, 'Stage Canvas must use the final offline manifest.');
  for (const proof of [qaProof, canvasProof, integrityProof, stageProof, finalProof]) {
    for (const [file, expected] of Object.entries(proof.sources || {})) await evidence(file, expected);
  }
  for (const run of canvasProof.runs) await evidence(run.report);
  for (const file of [
    'candidate-review-watermelongangle.md', 'candidate-review-aquablasterpomni.md',
    'candidate-review-ptocaine.md', 'candidate-review-freakjax.md',
    'candidate-review-australianjax.md', 'candidate-review-noirgangle.md',
    'candidate-review-contortionistzooble.md', 'candidate-review-hotdogabel.md', 'remaining-work.md',
  ]) await evidence(folder + '/' + file);
  // The final consolidated record is retained as evidence, but runtime results
  // are checked against the underlying dated files rather than inferred.
  const [{ COSTUME_ADDITIONS, COSTUME_ADDITION_SOURCES }, runtime, offline, audio, ambience, motion, fidelity] = await Promise.all([
    loadModule('combat/costume-additions.mjs'), loadModule('combat/data.mjs'),
    loadModule('combat/offline-manifest.mjs'), loadModule('combat/audio.mjs'),
    loadModule('combat/audio-ambiences.mjs'), loadModule('combat/render-stage-motion.mjs'), loadModule('combat/fidelity.mjs'),
  ]);
  const order = ['watermelongangle', 'aquablasterpomni', 'ptocaine', 'freakjax'];
  assert.deepEqual(completion.order, order); assert.deepEqual(completion.appearances.map(a => a.id), order);
  assert.deepEqual(completion.slots, slots);
  assert.deepEqual(COSTUME_ADDITIONS.slice(0, 35).map(a => a.id), before.costumeAdditionCoverage.ids);
  assert.deepEqual(COSTUME_ADDITIONS.slice(35).map(a => a.id), order);
  assert.equal(COSTUME_ADDITIONS.length, 39); assert.equal(runtime.COSTUMES.length, 468);
  assert.equal(runtime.FIGHTERS.length, 54); assert.equal(runtime.STAGES.length, 23);
  assert.equal(runtime.DEDICATED_STAGES.length, 54);
  assert.deepEqual(runtime.STAGES.slice(0, 22).map(s => s.id), before.stages.map(s => s[0]));
  assert.equal(runtime.STAGES.at(-1).id, 'undermap');
  assert.equal(offline.ART_FILES.length, 5769); assert.equal(offline.ART_BYTES, 3059080660);
  assert.equal(runtimeProof.offlineImages, offline.ART_FILES.length);
  assert.equal(runtimeProof.offlineBytes, offline.ART_BYTES);
  assert.equal(runtimeProof.offlineVersion, offline.OFFLINE_VERSION);
  assert.equal(runtimeProof.artVersion, offline.ART_VERSION);
  assert.equal(stageProof.canvas.manifestSnapshot.version, offline.OFFLINE_VERSION);
  assert.equal(stageProof.canvas.manifestSnapshot.artVersion, offline.ART_VERSION);
  const additions = new Map(COSTUME_ADDITIONS.map(a => [a.id, a]));
  const sourceMap = new Map(COSTUME_ADDITION_SOURCES.map(s => [s.id, s]));
  const offlineFiles = new Set(offline.ART_FILES.map(f => f.replace(/^\.\.\//, '')));
  const flattened = completion.appearances.flatMap(a => a.files);
  assert.deepEqual(inventory, flattened);
  assert.equal(flattened.length, 44); assert.equal(flattened.reduce((s, a) => s + a.bytes, 0), 41910315);
  const newAssets = [], assetChecks = [], familyRows = [], drawingRows = [], stageRows = [], qaRows = [];
  const qa = (id, area, title, status, proof, result, limit) => qaRows.push([id, area, title, status, 'P0', proof, result, limit, '']);
  const scope = 'Dessins statiques originaux adaptés au jeu. Les cycles animés complets et la comparaison canonique plan par plan restent ouverts.';
  const slotNames = { selection: 'Portrait de sélection', stance: 'Garde', intro: 'Entrée', attack: 'Attaque', heavy: 'Coup lourd', hit: 'Impact', walk: 'Marche', jump: 'Saut', crouch: 'Accroupissement', victory: 'Victoire', defeat: 'Défaite' };
  for (const appearance of completion.appearances) {
    const def = additions.get(appearance.id); assert(def);
    assert.deepEqual(appearance.files.map(f => f.slot), slots);
    const sourceText = def.fidelity.sourceIds.map(id => { assert(sourceMap.has(id)); return sourceMap.get(id).scope; }).join(' ');
    familyRows.push(['NEXT29-' + appearance.id, 'Tenue Circus', def.name, 'Portrait, garde et neuf poses', 'Implémenté', 'P1',
      'assets/encore/selection/' + appearance.id + '.png\nassets/encore/stance/' + appearance.id + '.png\nassets/encore/poses/' + appearance.id + '/',
      '11 PNG natifs distincts actifs. Les onze emplacements sont détaillés dans les lignes Dessin de tenue et QA NEXT29. Preuve : ' + folder + '/generation-completion.json.',
      sourceText + ' ' + scope, '']);
    for (const asset of appearance.files) {
      assert.equal(asset.appearanceId, appearance.id); assert(asset.file.startsWith('assets/encore/'));
      const bytes = await fs.readFile(path.join(root, asset.file));
      assert.equal(digest(bytes), asset.sha256); assert.equal(bytes.length, asset.bytes);
      assert.equal(digest(await fs.readFile(path.join(root, asset.archiveFile))), asset.sha256);
      assert(offlineFiles.has(asset.file));
      const receipt = await evidence(asset.receiptFile);
      assert.equal(receipt.status, 'accepted_native'); assert.equal(receipt.method, 'image_gen.imagegen');
      assert.equal(receipt.sha256, asset.sha256); assert.equal(receipt.bytes, asset.bytes);
      assert.equal(receipt.nativeCopyVerified, true); assert.equal(receipt.visualReview.status, 'accepted');
      assert.deepEqual(receipt.dimensions, asset.dimensions); assert.equal(receipt.mode, 'RGBA');
      assert.deepEqual(receipt.alpha12Bounds, asset.alpha12Bounds);
      for (const ref of asset.references) {
        const refBytes = await fs.readFile(path.join(root, ref.file));
        assert.equal(refBytes.length, ref.bytes); assert.equal(digest(refBytes), ref.sha256);
      }
      const [w, h] = asset.dimensions, bounds = asset.alpha12Bounds;
      assert(bounds[0] > 0 && bounds[1] > 0 && bounds[2] < w && bounds[3] < h);
      const detail = asset.dimensions.join(' × ') + ' px · RGBA · ' + asset.bytes.toLocaleString('fr-FR') + ' octets.\nSHA-256 : ' + asset.sha256;
      drawingRows.push(['NEXT29-' + appearance.id + '-' + asset.slot, 'Dessin de tenue', def.name, slotNames[asset.slot], 'Implémenté', 'P1', asset.file,
        detail + '\nReçu : ' + asset.receiptFile,
        'Copie active identique au PNG natif archivé. Alpha natif conservé ; limites visibles mesurées à alpha > 12, sans affirmer que chaque pixel du bord vaut zéro. ' + scope, '']);
      qa('NEXT29-asset-' + appearance.id + '-' + asset.slot, 'Apparences · Fichier individuel', def.name + ' · ' + slotNames[asset.slot], 'Réussi',
        asset.file + '\n' + asset.receiptFile,
        detail + '\nEmpreinte active = archive = reçu. Présent dans le manifeste hors ligne ; dimensions et limites alpha contrôlées.',
        'Contrôle des octets et du reçu accepté. Une image de pose n’est pas un cycle animé ni une certification d’épisode.');
      newAssets.push({ id: appearance.id, slot: asset.slot, file: asset.file, sha256: asset.sha256, bytes: asset.bytes, generationManifest: folder + '/generation-completion.json', receipt: asset.receiptFile, published: true });
      assetChecks.push({ appearanceId: appearance.id, slot: asset.slot, file: asset.file, archiveFile: asset.archiveFile, receiptFile: asset.receiptFile, sha256: asset.sha256, bytes: asset.bytes, productionId: 'NEXT29-' + appearance.id + '-' + asset.slot, qaId: 'NEXT29-asset-' + appearance.id + '-' + asset.slot, nativeCopyVerified: true, offline: true, dimensions: asset.dimensions, mode: asset.mode, alpha12Bounds: asset.alpha12Bounds });
    }
  }
  assert.equal(new Set(newAssets.map(a => a.sha256)).size, 44);
  const stage = runtime.STAGES.at(-1), theme = audio.AUDIO_THEMES.undermap, ambient = ambience.AUDIO_AMBIENCES.undermap;
  assert(theme && ambient && motion.STAGE_AMBIENCES.undermap);
  const stageSourceMap = new Map(fidelity.FIDELITY_SOURCES.map(s => [s.id, s]));
  for (const id of stage.fidelity.sourceIds) assert(before.sources.some(s => s.id === id), 'Existing stage source must remain in place: ' + id);
  const newStage = [stage.id, stage.name, 'Implémenté', 'Implémenté', stage.theme, stage.width, stage.floor, stage.bounds.left, stage.bounds.right,
    'Aucune collision de décor', 'Prévu', stage.sourceId,
    stage.description + '\nMusique : ' + theme.title + ' · ' + theme.bpm + ' BPM.',
    'Trois PNG natifs 1672 × 941, sans réencodage · assets/encore/stages/undermap/',
    stage.fidelity.sourceIds.map(id => id + ' : ' + stageSourceMap.get(id).url).join('\n'),
    stage.fidelity.observedTraits.join(' '), stage.fidelity.combatAdaptation,
    'Référence visuelle consultée', stage.fidelity.reviewScope, ''];
  assert.equal(newStage.length, 20); data.stages.push(newStage);
  assert.deepEqual(stageInventory.assets.map(a => a.plane), ['far', 'mid', 'near']);
  assert.equal(stageInventory.totalNativeBytes, 1821031);
  for (const asset of stageInventory.assets) {
    const bytes = await fs.readFile(path.join(root, asset.activePath));
    assert.equal(bytes.length, asset.bytes); assert.equal(digest(bytes), asset.sha256);
    assert.equal(digest(await fs.readFile(path.join(root, asset.nativePath))), asset.sha256);
    assert(offlineFiles.has(asset.activePath)); assert.equal(asset.nativePreserved, true);
    qa('UNDERMAP29-asset-' + asset.plane, 'Arène · Fichier individuel', 'Sous la carte · ' + asset.plane, 'Réussi', asset.activePath + '\n' + stageFolder + '/asset-inventory.json',
      asset.width + ' × ' + asset.height + ' px · ' + asset.mode + ' · ' + asset.bytes.toLocaleString('fr-FR') + ' octets.\nSHA-256 : ' + asset.sha256 + '\nCopie active identique au natif et incluse dans le manifeste final.',
      'Dimensions réellement rendues par image_gen. Aucune revendication 4K ni agrandissement ; alpha natif conservé.');
  }
  const stageArt = 'assets/encore/stages/undermap/';
  stageRows.push(
    ['ART-undermap-background', 'Arène', stage.name, 'Fond et profondeur', 'Implémenté', 'P1', stageArt + 'far.png\n' + stageArt + 'mid.png', 'Fond indigo quadrillé et plan médian séparés, copiés depuis les trois PNG natifs. Preuve : ' + stageFolder + '/asset-inventory.json.', stage.fidelity.reviewScope, ''],
    ['ART-undermap-floor', 'Arène', stage.name, 'Sol jouable', 'Implémenté', 'P1', stageArt + 'mid.png\ncombat/data.mjs', 'Piste logique à y568, limites 65–1215, vérifiée dans les vues Canvas avec acteurs sur le manifeste final.', 'La perspective illustrée est adaptée au duel. La revue ne certifie aucune géométrie canonique ni essai sur périphérique physique.', ''],
    ['ART-undermap-foreground', 'Arène', stage.name, 'Premier plan', 'Implémenté', 'P1', stageArt + 'near.png', 'Reflets de premier plan en RGBA natif, alpha maximal 90, gardés derrière la lecture des acteurs. Preuve : ' + stageFolder + '/verification.json.', 'Troisième plan du même décor ; aucune nouvelle arène ni obstacle de collision supplémentaire.', ''],
    ['ART-undermap-music', 'Arène', stage.name, 'Musique de l’arène', 'Implémenté', 'P1', 'combat/audio.mjs', theme.title + ' · ' + theme.bpm + ' BPM.', 'Composition procédurale originale du jeu. Le mixage sur appareils et la fidélité sonore à un épisode restent à vérifier.', ''],
    ['ART-undermap-ambience', 'Arène', stage.name, 'Ambiance sonore', 'Implémenté', 'P1', 'combat/audio-ambiences.mjs', ambient.title + ' · ' + ambient.periodSeconds + ' s · ' + ambient.layers.length + ' couches.\n' + ambient.description, 'Création sonore du jeu. Les validations de code ne remplacent pas un essai audio physique.', ''],
    ['ANIM-undermap-ambience', 'Animation d’arène', stage.name, 'Ambiance visuelle animée', 'Implémenté', 'P1', 'combat/render-stage-motion.mjs\ncombat/stage-parallax.mjs', motion.STAGE_AMBIENCES.undermap + '. Effets derrière les acteurs ; le réglage de mouvements réduits fige les effets.', 'Pulsation et composition originales pour Encore. Animation canonique de la salle non certifiée.', ''],
  );
  const newProduction = [...familyRows, ...drawingRows, ...stageRows];
  assert.equal(newProduction.length, 54); data.production.push(...newProduction);
  const candidateIndex = data.production.findIndex(r => r[0] === 'SERIES-jax__australian_extremist');
  assert(candidateIndex >= 0); const candidateBefore = [...data.production[candidateIndex]], candidateAfter = [...candidateBefore];
  assert.equal(candidateBefore[4], 'À vérifier');
  candidateAfter[6] = 'https://www.youtube.com/watch?v=L4p2gN2CzsA\nhttps://www.youtube.com/watch?v=sQ5DCwcpMy0\n' + folder + '/candidate-review-australianjax.md';
  candidateAfter[7] = 'Correction de la revue : short kaki confirmé, avec bas des jambes violets visibles ; aucun pantalon long attesté. Chapeau brun, chemise kaki, ceinture, gants jaunes et mallette grise repérés.';
  candidateAfter[8] = 'Les pieds restent hors cadre ou masqués dans les vues officielles inspectées. Les formes claires au bas du plan sont des mains, pas des chaussures. Obtenir une vue complète avant génération ; candidate toujours À vérifier, sans nouvel actif compté.';
  data.production[candidateIndex] = candidateAfter;
  const newSources = [], existingIds = new Set(before.sources.map(s => s.id));
  for (const id of order) for (const sourceId of additions.get(id).fidelity.sourceIds) {
    if (existingIds.has(sourceId)) continue;
    const source = sourceMap.get(sourceId); assert(source);
    newSources.push({ ...source, scope: source.scope + (source.imageUrl ? ' Image de référence : ' + source.imageUrl : '') }); existingIds.add(sourceId);
  }
  assert.equal(newSources.length, 4); data.sources.push(...newSources);
  const offlineIndex = data.sources.findIndex(s => s.id === 'offline'); assert(offlineIndex >= 0);
  data.sources[offlineIndex].scope = offline.ART_FILES.length.toLocaleString('fr-FR') + ' images et ' + offline.ART_BYTES.toLocaleString('fr-FR') + ' octets dans le manifeste local. La publication GitHub est vérifiée séparément.';
  qa('NEXT29-art', 'Apparences · Inventaire', 'Quatre familles, quarante-quatre emplacements', 'Réussi', folder + '/generation-completion.json',
    '4 sélections, 4 gardes et 36 poses. 44 PNG natifs distincts, 41 910 315 octets ; les 44 lignes Production et les 44 lignes QA individuelles correspondent une à une aux fichiers.', scope);
  qa('NEXT29-canvas', 'Apparences · Canvas', 'Rendu de production des quatre familles', 'Réussi', folder + '/canvas-summary.json',
    canvasProof.counts.drawChecks + ' vérifications de dessin via les modules Canvas du jeu ; ' + canvasProof.counts.missing + ' fichier attendu manquant.',
    'Rendu Canvas2D sous Skia, distinct des interactions navigateur, de l’audio et des périphériques physiques.');
  qa('UNDERMAP29-canvas', 'Arène · Canvas', 'Sous la carte : caméras et acteurs', 'Réussi', stageFolder + '/verification.json',
    'Trois positions caméra et trois scènes avec acteurs, six vues vérifiées sur le manifeste ' + offline.OFFLINE_VERSION + '. Les 66 plans historiques restent conservés.',
    'Une arène partagée nouvelle, trois plans natifs. Les 54 arrangements home-* restent des réemplois.');
  qa('NEXT29-node', 'Code · Tests et constructions', 'Campagne finale du lot', 'Réussi', folder + '/qa-result.json',
    qaProof.testSummary.pass + ' tests Node réussis sur ' + qaProof.testSummary.tests + ', zéro échec et les deux constructions réussies. Campagne du ' + qaProof.endedAt + '.',
    'Résultat daté de ce lot. Le classeur ne cumule pas les tests d’anciennes révisions et ne se déclare pas nouvelle exécution des tests du jeu.');
  qa('NEXT29-integrity', 'Intégrité · Distributions et histoire', 'Actifs, modules et fichiers historiques', 'Réussi', folder + '/build-integrity.json',
    integrityProof.nativeAssetComparisons + ' copies d’images comparées dans les deux distributions, ' + integrityProof.moduleComparisons + ' copies de modules et ' + integrityProof.historicalEncoreFilesVerified + ' fichiers Encore historiques vérifiés.',
    'Contrôle des empreintes du lot et du préfixe historique. La publication distante est une étape séparée.');
  const browser = finalProof.browser || {};
  const browserPassed = browser.status === 'passed' && Number(browser.assertionsExecuted || 0) > 0;
  assert(!browserPassed, 'A successful browser campaign needs an explicit mapping to its observed assertions before updating this row.');
  qa('NEXT29-browser', 'Navigateur · Campagne du lot', 'Statut de la tentative navigateur', 'Non exécuté', folder + '/verification.json',
    'Aucune campagne navigateur locale réexécutée pour ce lot ; zéro vérification réussie attribuée à cette révision. La tentative Chromium antérieure est historique. La CI distante est rapportée séparément pour le commit publié.',
    'Les interactions DOM, l’audio et les périphériques physiques ne sont pas couverts par les vues Canvas.');
  qa('TRACKER29-update', 'Suivi · Mise à jour', 'Export du lot depuis le classeur réconcilié', 'Réussi', reviewFile,
    'Export XLSX, 42 formules recalculées, variation temporaire de statut annulée, réimport et comparaison native de toutes les cellules. Onze feuilles et dix tables conservées ; 44 emplacements détaillés en Production et QA.',
    'Statut publié uniquement après les contrôles d’export, de réimport, de structure native et la revue des vues du classeur. Aucune session Excel desktop revendiquée.');
  assert.equal(qaRows.length, 54); data.qa.push(...qaRows);
  const allAssets = [...before.costumeAdditionCoverage.assets, ...newAssets];
  assert.equal(allAssets.length, 429);
  assert.equal(new Set(allAssets.map(a => a.file)).size, 429); assert.equal(new Set(allAssets.map(a => a.sha256)).size, 429);
  for (const asset of before.costumeAdditionCoverage.assets) {
    const bytes = await fs.readFile(path.join(root, asset.file));
    assert.equal(digest(bytes), asset.sha256, 'Historical appearance changed: ' + asset.file);
    assert.equal(bytes.length, asset.bytes); assert(offlineFiles.has(asset.file));
  }
  data.costumeAdditionHistory.push({ coverage: before.costumeAdditionCoverage, review: before.costumeAdditionReview });
  data.costumeAdditionCoverage = { schema: 'encore-costume-addition-coverage/v1', asOf: '2026-11-20', ids: COSTUME_ADDITIONS.map(a => a.id), appearances: 39, pngFiles: 429, bytes: allAssets.reduce((s, a) => s + a.bytes, 0), drawingsBySlot: Object.fromEntries(slots.map(s => [s, 39])), publishedFiles: 429, sourceIds: [...new Set(COSTUME_ADDITIONS.flatMap(a => a.fidelity.sourceIds))], assets: allAssets };
  data.qaCampaigns.push(before.currentQa);
  data.currentQa = { gameVersion: data.version, campaign: 'next29-2026-11-20', complete: false, evidence: folder + '/verification.json', workbookEvidence: reviewFile, rowIds: qaRows.map(r => r[0]), totals: { nodeTests: 411, nodePassed: 411, browserAssertionsExecutedByWorkbookUpdate: 0 }, scope: 'Preuves du lot final importées avec leur date et leurs empreintes. La mise à jour contrôle le classeur et les octets des actifs sans se déclarer nouvelle exécution des tests du jeu.' };
  data.costumeAdditionReview = { asOf: '2026-11-20', evidence: folder + '/verification.json', workbookEvidence: reviewFile, qaRowIds: qaRows.map(r => r[0]), appendedAppearances: 4, appendedIndividualDrawingRows: 44, newNativePngs: 44, priorAppearancesPreserved: 35 };
  data.historicalQaRows = before.qa.length;
  data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(s => [s, data.qa.filter(r => r[3] === s).length]));
  data.qaSummaryScope = 'Lignes historiques et preuves datées ; les totaux de tests de différentes révisions ne sont pas additionnés comme exécutions de cette mise à jour.';
  data.asOf = '2026-11-20'; data.contentAsOf = '2026-11-20';
  Object.assign(data.counts, { fighters: 54, variants: 468, stages: 23, musicThemes: 23, animatedStages: 23, audioAmbiences: 23, costumeAdditions: 39, production: data.production.length, qa: data.qa.length, offlineImages: 5769, offlineBytes: offline.ART_BYTES });
  data.nextMissingPass = { asOf: '2026-11-20', evidence: reviewFile, baseWorkbookSHA256: baselineHashes['docs/' + xlsxName], appendedAppearanceIds: order, newNativeAppearanceFiles: 44, appendedDrawingRows: 44, appendedStageId: 'undermap', newNativeStagePlanes: 3, priorHistoryPreserved: true, correctedReference: { id: candidateAfter[0], priorRow: candidateBefore, status: 'À vérifier', correction: 'Short kaki confirmé ; pieds encore masqués.' }, unqualifiedCandidates: ['australianjax', 'noirgangle', 'contortionistzooble', 'maidribbit'] };
  for (const key of ['features', 'roster', 'moves', 'atlas', 'scenarios', 'dedicatedStages', 'workbookReconciliation', 'costumePreparationHistory', 'costumeAdditionPreparation']) assert.deepEqual(data[key], before[key], 'Preserved companion section: ' + key);
  assert.deepEqual(data.stages.slice(0, before.stages.length), before.stages);
  assert.deepEqual(data.qa.slice(0, before.qa.length), before.qa);
  for (let i = 0; i < before.production.length; i++) if (i !== candidateIndex) assert.deepEqual(data.production[i], before.production[i]);
  assert.equal(data.production[candidateIndex][9], before.production[candidateIndex][9]);
  assert.equal(data.production.find(r => r[0] === 'RIBBIT28-maidribbit-reference')[4], 'À vérifier');
  assert.equal(new Set(data.production.map(r => r[0])).size, data.production.length);
  assert.equal(new Set(data.qa.map(r => r[0])).size, data.qa.length);
  assert.equal(new Set(data.sources.map(s => s.id)).size, data.sources.length);
  const changed = new Map();
  const setCell = (name, ref, value, formula = null) => {
    const [r, c] = position(ref), cell = sheets.get(name).cells.find(x => x[0] === r && x[1] === c); assert(cell, name + '!' + ref);
    if (!changed.has(name + '!' + ref)) changed.set(name + '!' + ref, { sheet: name, cell: ref, before: cell.slice(2, 5), value, formula });
    else Object.assign(changed.get(name + '!' + ref), { value, formula });
    cell[2] = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'; cell[3] = value; cell[4] = formula;
  };
  for (const c of [6, 7, 8]) setCell('Production', col(c + 1) + (candidateIndex + 6), candidateAfter[c]);
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
      const minimum = name === 'Références' ? 70 : name === 'Production' && row[1] === 'Dessin de tenue' ? 140 : 42;
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
  append('Arènes', [newStage], before.stages.length, 20);
  const stageSheet = sheets.get('Arènes'), priorStageRules = [...stageSheet.rules];
  for (const letter of ['C', 'D', 'K']) {
    const range = letter + '28', validation = stageSheet.validations.find(v => v.range.startsWith(letter));
    assert(validation); stageSheet.validations.push({ ...structuredClone(validation), range });
    for (const rule of priorStageRules.filter(r => r.range.startsWith(letter))) stageSheet.rules.push({ ...structuredClone(rule), range, priority: stageSheet.rules.length + 1 });
  }
  const productionSheet = sheets.get('Production');
  productionSheet.heights[candidateIndex + 6] = Math.max(productionSheet.heights[candidateIndex + 6] || 0, rowHeight(productionSheet, candidateAfter, 42));
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
  const summaryValues = { H2: 'Version 0.7.0 · nouveaux manquants · 20 novembre 2026', H8: '39 tenues Circus · 429 dessins individuels', H13: '411 tests Node dans la preuve finale du lot', H14: 'État navigateur détaillé dans la preuve datée', H15: 'Classeur recalculé et réimporté ; historique conservé', H16: '4 tenues · 44 dessins · 1 arène à trois plans', H30: '105 ensembles de base + 39 tenues (429 PNG)', H34: '23 arènes communes · 54 arrangements à décor partagé' };
  for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
  const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
  for (const c of summary.cells) if (c[4]) setCell('Synthèse', address(c), evaluate(c[4].slice(1), lookup, 'Synthèse'), c[4]);
  assert.equal(lookup.get('Synthèse').get('B9')[3], 23);
  assert.equal(lookup.get('Synthèse').get('B11')[3], 468);
  assert.equal(lookup.get('Synthèse').get('F16')[3], 3188);
  assert.equal(lookup.get('Synthèse').get('F22')[3], 2335);
  assert.equal(lookup.get('Synthèse').get('H21')[3], '23 thèmes musicaux d’arènes');
  assert.equal(lookup.get('Synthèse').get('H24')[3], '23 ambiances visuelles animées');
  assert.equal(lookup.get('Synthèse').get('H32')[3], '23 ambiances sonores originales');
  let constrainedCells = 0;
  for (const [name, source] of sourceSheets) {
    const target = sheets.get(name), cells = new Map(target.cells.map(c => [address(c), c]));
    for (const prop of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) assert.deepEqual(source[prop], target[prop], name + '/' + prop);
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
  assert.equal(constrainedCells, 79280);
  await fs.mkdir(targetDir, { recursive: true });
  for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
  native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
  await writeJson(path.join(output, 'combat-tracker-data.json'), data);
  const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom'],
    ['Arènes', 'A28:L28', 'stage-left'], ['Arènes', 'M28:T28', 'stage-right'],
    ['Production', 'A' + (candidateIndex + 6) + ':J' + (candidateIndex + 6), 'australian-reference']];
  for (let i = 0; i < newProduction.length; i += 4) scopes.push(['Production', 'A' + (before.production.length + i + 6) + ':J' + (before.production.length + Math.min(i + 3, newProduction.length - 1) + 6), 'production-' + (i / 4 + 1)]);
  for (let i = 0; i < qaRows.length; i += 4) scopes.push(['QA', 'A' + (before.qa.length + i + 6) + ':I' + (before.qa.length + Math.min(i + 3, qaRows.length - 1) + 6), 'qa-' + (i / 4 + 1)]);
  scopes.push(['Références', 'A155:E158', 'references-new'], ['Références', 'A64:E64', 'references-offline'], ['Références', 'A159:E169', 'references-footer']);
  const finalPlan = { schema: 'encore-tracker-next-missing-plan/v1', createdAt: new Date().toISOString(), baselineHashes, baselineSnapshotHashes,
    historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], correctedReference: { id: candidateAfter[0], row: candidateIndex + 6, keptStatus: candidateAfter[4] },
    appendedProductionIds: newProduction.map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(s => s.id), appendedStageId: stage.id,
    evidenceHashes, runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: 5769, artBytes: offline.ART_BYTES, sha256: digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) },
    counts: { ...data.counts, sheets: 11, nativeTables: [...sheets.values()].reduce((s, sh) => s + sh.tables.length, 0), sources: data.sources.length, addedProductionRows: 54, addedQaRows: 54, addedSourceRows: 4, addedStageRows: 1, costumePngs: 429, newIndividualDrawingRows: 44, historicalCells: 79280, totalNativeCells: native.sheets.reduce((s, sh) => s + sh.cells, 0) },
    formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: 'E3140', scopes, historicalFooterShift: shift, assetSlotChecks: assetChecks,
    activeAssetDigests: [...newAssets.map(a => ({ file: a.file, sha256: a.sha256, bytes: a.bytes })), ...stageInventory.assets.map(a => ({ file: a.activePath, sha256: a.sha256, bytes: a.bytes }))],
    qaEvidence: { tests: 411, failures: 0, bothBuildsPassed: true, costumeCanvasDrawChecks: canvasProof.counts.drawChecks, stageCanvasChecks: 6, nativeDistributionComparisons: integrityProof.nativeAssetComparisons, moduleComparisons: integrityProof.moduleComparisons, historicalEncoreFiles: integrityProof.historicalEncoreFilesVerified } };
  assert.equal(finalPlan.formulas.length, 42); assert.equal(finalPlan.counts.nativeTables, 10);
  await writeJson(path.join(output, 'asset-slot-verification.json'), { schema: 'encore-tracker-asset-slots/v1', status: 'passed', verifiedSlots: 44, order, slots, checks: assetChecks, productionRowCount: drawingRows.length, qaRowCount: qaRows.filter(r => r[0].startsWith('NEXT29-asset-')).length });
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
  const slotsReport = await json(path.join(output, 'asset-slot-verification.json'));
  const workbookSHA256 = digest(await fs.readFile(xlsxPath)), trackerDataSHA256 = digest(await fs.readFile(path.join(output, 'combat-tracker-data.json')));
  const planSha256 = digest(await fs.readFile(path.join(output, 'update-plan.json')));
  assert.equal(comparison.status, 'passed'); assert.equal(imported.status, 'passed'); assert.equal(visual.status, 'accepted');
  assert.equal(slotsReport.status, 'passed'); assert.equal(slotsReport.verifiedSlots, 44);
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
    schema: 'encore-tracker-next-missing-review/v1', createdAt: new Date().toISOString(), gameVersion: data.version,
    workbookSHA256, trackerDataSHA256, sourceDigests, baselineHashes: p.baselineHashes, baselineSnapshotHashes: p.baselineSnapshotHashes,
    counts: p.counts, runtimeManifest: p.runtimeManifest, currentQa: data.currentQa,
    formulas: { count: 42, recalculated: true, errors: 0, statusChangeRecalculated: true, exportRoundTripPassed: true },
    nativeComparison: comparison, reimport: imported, visualReview: visual, assetSlotVerification: slotsReport,
    historicalCellsConstrained: p.historicalCellsConstrained, originalIdsAndOrderPreserved: true, userNotesPreserved: true,
    historicalEvidencePreserved: true, correctedReference: p.correctedReference,
    appendedProductionIds: p.appendedProductionIds, appendedQaIds: p.appendedQaIds,
    appendedSourceIds: p.appendedSourceIds, appendedStageId: p.appendedStageId, qaEvidence: p.qaEvidence,
    releaseReviewed: false, fullCiExecutedByWorkbookUpdate: false, canonicalVisualApproval: false,
    limitations: [
      'The update authored and checked the workbook, all native cells, all ten tables, all forty-two formulas and the forty-four individual drawing slots.',
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
  for (const name of ['workbook-review.json', 'update-plan.json', 'native-comparison.json', 'reimport-result.json', 'authoring-result.json', 'visual-review.json', 'formula-error-scan.ndjson', 'baseline-freeze.json', 'asset-slot-verification.json']) await fs.copyFile(path.join(output, name), path.join(dest, name));
  for (const [, , name] of reviewScopes(p)) await fs.copyFile(path.join(output, name + '.png'), path.join(dest, name + '.png'));
  for (const name of ['baseline-summary', 'baseline-stage-left', 'baseline-stage-right', 'baseline-production', 'baseline-qa', 'baseline-references']) await fs.copyFile(path.join(output, name + '.png'), path.join(dest, name + '.png'));
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

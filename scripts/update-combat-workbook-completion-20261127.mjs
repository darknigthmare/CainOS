/** Extend the existing 14-sheet workbook in place, preserving its native data.
 * Run a copy in a private OS temporary directory with the primary runtime Node
 * and a node_modules link to CODEX_PRIMARY_RUNTIME_NODE_MODULES.
 * All XLSX authoring uses the public artifact-tool API; the Python inspector
 * reads native workbook features only and never modifies XLSX/XML.
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const outputDir = path.resolve(flag('--output-dir', path.join(root, '../outputs/encore-completion-20261127')));
const evidenceDir = 'docs/verification/completion-workbook-20261127';
const sourceFile = 'docs/bible/extensions-workbook-data.json';
const completionFile = flag('--completion-data', 'docs/art-generation/completion-20261127/tracker-completion.json');
const inputNames = ['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx', 'combat-tracker-data.json', 'combat-workbook-verification.json'];
const reportName = 'combat-completion-workbook-verification.json';
const sha = value => createHash('sha256').update(value).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const normalized = rows => rows.map(row => row.map(value => value === '' || value === undefined ? null : value));
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const initialSheets = ['Synthèse', 'Fonctionnalités', 'Combattants', 'Techniques', 'Arènes', 'Atlas', 'Production', 'Scénarios', 'Extension PNJ', 'QA', 'Références', 'Guide combat', 'Extensions combat', 'Fiches extensions'];
const sheetDataKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const allowedChanges = [], renders = [], renderRequests = [];
const appended = {}, appendedControls = {};
let wb, before, data, beforeSummaryFormulas, beforeSummaryValues, nativeDirectory;
await fs.mkdir(outputDir, { recursive: true });

if (args.includes('--inspect-baseline')) {
  const book = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(root, 'docs', inputNames[0])));
  const baseline = await json(path.join(root, 'docs', inputNames[1]));
  const views = [
    ['Synthèse', 'A1:H18', 'baseline-summary.png'],
    ['Production', `A${baseline.production.length + 3}:F${baseline.production.length + 5}`, 'baseline-production.png'],
    ['Extensions combat', 'A8:F8', 'baseline-selection-section.png'],
  ];
  for (const [sheetName, range, name] of views) {
    const blob = await book.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(outputDir, name), new Uint8Array(await blob.arrayBuffer()));
  }
  const inspect = await book.inspect({ kind: 'table', range: "'Synthèse'!A6:H18", include: 'values,formulas', tableMaxRows: 13, tableMaxCols: 8, maxChars: 5000 });
  await fs.writeFile(path.join(outputDir, 'baseline-inspection.ndjson'), inspect.ndjson);
  console.log(JSON.stringify({ status: 'baseline-rendered', views: views.map(view => view[2]), workbookSHA256: sha(await fs.readFile(path.join(root, 'docs', inputNames[0]))) }));
  process.exit(0);
}

if (args.includes('--render-staged')) { await renderStaged(); process.exit(0); }
if (args.includes('--publish-staged')) { await publish(); process.exit(0); }
assert(args.includes('--build'), 'Choose --inspect-baseline, --build, --render-staged or --publish-staged');
await build();

async function build() {
  const baselineDir = path.join(outputDir, 'baseline');
  await fs.mkdir(baselineDir, { recursive: true });
  for (const name of inputNames) {
    const bytes = await fs.readFile(path.join(root, 'docs', name));
    try { assert.equal(sha(await fs.readFile(path.join(baselineDir, name))), sha(bytes), 'Installed baseline changed: ' + name); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await fs.writeFile(path.join(baselineDir, name), bytes); }
  }
  const inputWorkbook = path.join(baselineDir, inputNames[0]);
  const inputTrackerBytes = await fs.readFile(path.join(baselineDir, inputNames[1]));
  const sourceBytes = await fs.readFile(path.join(root, sourceFile));
  const completionBytes = await fs.readFile(path.resolve(root, completionFile));
  const completion = JSON.parse(completionBytes);
  before = JSON.parse(inputTrackerBytes); data = structuredClone(before);
  assert.equal(completion.schema, 'encore-tracker-completion/v1');
  assert.equal(before.counts.variants, 546); assert.equal(completion.counts.variants, 573);
  for (const [file, digest] of Object.entries(completion.sourceDigests || {})) {
    assert(!path.isAbsolute(file) && !file.split('/').includes('..'));
    assert.equal(sha(await fs.readFile(path.join(root, file))), digest, 'Completion source changed: ' + file);
  }
  wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputWorkbook));
  console.log(JSON.stringify({ step: 'baseline-imported' }));
  beforeSummaryFormulas = wb.worksheets.getItem('Synthèse').getUsedRange().formulas;
  beforeSummaryValues = wb.worksheets.getItem('Synthèse').getUsedRange().values;
  verifyTables(wb, before, 'baseline');

  for (const [key, value] of Object.entries(completion.counts)) data.counts[key] = value;
  for (const [key, value] of Object.entries(completion.metadataUpdates)) {
    assert(['npcCrossoverCoverage', 'npcCrossoverCoverageHistory', 'crossoverArt', 'crossoverArtHistory', 'baseSpriteContinuation', 'baseSpriteContinuationHistory', 'qaSummary', 'qaSummaryScope'].includes(key), 'Unsupported companion update: ' + key);
    data[key] = value;
  }
  for (const change of completion.rowUpdates) {
    const key = sheetDataKeys[change.sheet]; assert(key, 'Unknown data sheet');
    const index = data[key].findIndex(row => row[0] === change.id); assert(index >= 0, 'Unknown row ID: ' + change.id);
    for (const [column, value] of Object.entries(change.cells)) {
      assert(+column >= 1 && +column < data[key][index].length - 1, 'Preserve ID and user note');
      data[key][index][+column] = value; setCell(change.sheet, `${col(+column + 1)}${index + 6}`, value);
    }
  }
  for (const change of completion.extensionRowUpdates || []) {
    const index = data.extensionsIntegration.rows.findIndex(row => row[0] === change.id); assert(index >= 0);
    for (const [column, value] of Object.entries(change.cells)) {
      assert(+column >= 1 && +column < 9, 'Preserve extension ID and user note');
      data.extensionsIntegration.rows[index][+column] = value;
      setCell('Extensions combat', `${col(+column + 1)}${index + 6}`, value);
    }
  }
  addRows('Production', 'production', completion.productionRows);
  addRows('QA', 'qa', completion.qaRows);
  data.historicalCurrentQa = [...(data.historicalCurrentQa || []), before.currentQa].filter(Boolean);
  data.currentQa = completion.currentQa;
  data.historicalQaRows = before.qa.length;
  data.qaCampaigns = [...(data.qaCampaigns || []), completion.currentQa];
  data.contentAsOf = data.asOf = '2026-11-27';
  data.completionIntegration = { ...completion.completion, source: completionFile, sourceSHA256: sha(completionBytes), sourceDigests: completion.sourceDigests, baselineCommit: completion.baselineCommit };
  data.extensionsIntegration.sourceSHA256 = sha(sourceBytes);
  data.extensionsIntegration.runtimeContinuation = {
    asOf: '2026-11-27', requirementId: 'EN-G32', scope: 'Présentation statique du menu, annonces et retour par côté ; gestes individuels encore à produire.',
    evidence: 'docs/art-generation/completion-20261127/selection/verification.json', authoredEntryExitAnimations: 0,
  };
  setCell('Synthèse', 'H2', 'Version 0.7.0 · reprise complétée · 27 novembre 2026');
  setCell('Synthèse', 'H7', 'Sélection statique intégrée · gestes à produire');
  setCell('Synthèse', 'H8', '254 fiches de conception associées');
  setCell('Synthèse', 'H13', completion.qaSummaryLabel);
  setCell('Synthèse', 'H14', completion.browserSummaryLabel);
  setCell('Synthèse', 'H15', 'Extensions : bible intégrée, systèmes encore partiels');
  setCell('Synthèse', 'H16', completion.summary);
  setCell('Synthèse', 'H17', 'Lot repris : 79 PNG neufs tracés (16 + 63)');
  setCell('Synthèse', 'H30', `${data.counts.baseOnlyCostumes} familles statiques · aucune nouvelle animation`);
  setCell('Synthèse', 'H34', '27 arènes : 13 peintures complètes · 64 arrangements');
  wb.recalculate();

  const expectedSummary = { B7: data.counts.fighters, B8: data.counts.moves, B9: data.counts.stages, B10: data.counts.atlas, B11: data.counts.variants, B12: data.counts.dedicatedStages, F15: data.features.length, F16: data.production.length, F17: data.scenarios.length, F18: data.atlas.length, F22: data.qa.length, H24: `${data.counts.animatedStages} ambiances visuelles procédurales actives` };
  for (const [address, value] of Object.entries(expectedSummary)) assert.equal(wb.worksheets.getItem('Synthèse').getRange(address).values[0][0], value, 'Independent total: ' + address);
  assert.equal(beforeSummaryFormulas.flat().filter(Boolean).length, wb.worksheets.getItem('Synthèse').getUsedRange().formulas.flat().filter(Boolean).length, 'Preserve all existing formula cells');
  const actualQa = Object.fromEntries(Object.keys(data.qaSummary).map(key => [key, 0]));
  for (const row of data.qa) actualQa[row[3]] = (actualQa[row[3]] || 0) + 1;
  assert.deepEqual(actualQa, data.qaSummary);
  for (const edit of allowedChanges) edit.after = wb.worksheets.getItem(edit.sheet).getCell(edit.row - 1, edit.column - 1).values[0][0];
  verifyTables(wb, data, 'updated');
  const formulaScan = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 30 }, maxChars: 3000 });
  await fs.writeFile(path.join(outputDir, 'formula-scan.ndjson'), formulaScan.ndjson);
  assert(formulaScan.ndjson.includes('Cell search matched 0 entries.'), 'Unexpected formula error');
  const inspect = await wb.inspect({ kind: 'table', range: "'Synthèse'!A6:H18", include: 'values,formulas', tableMaxRows: 13, tableMaxCols: 8, maxChars: 5000 });
  await fs.writeFile(path.join(outputDir, 'completion-inspection.ndjson'), inspect.ndjson);

  queueRender('Synthèse', 'A1:H18', 'summary');
  queueRender('Synthèse', 'A19:H34', 'summary-detail');
  const selectionRow = data.extensionsIntegration.rows.findIndex(row => row[0] === 'EN-G32') + 6;
  queueRender('Extensions combat', `A${selectionRow}:F${selectionRow}`, 'selection-section-status');
  queueRender('Extensions combat', `G${selectionRow}:J${selectionRow}`, 'selection-section-detail');
  for (const change of completion.rowUpdates.filter(row => row.sheet === 'Arènes')) {
    const row = data.stages.findIndex(item => item[0] === change.id) + 6;
    queueRender('Arènes', `N${row}:S${row}`, 'stage-' + change.id);
  }
  for (const [sheetName, detail] of Object.entries(appended)) {
    const first = detail.before + 6, end = Math.min(detail.after + 5, first + 2);
    queueRender(sheetName, `A${first}:F${end}`, sheetName.toLowerCase() + '-added-overview');
    queueRender(sheetName, `G${first}:${sheetName === 'QA' ? 'I' : 'J'}${end}`, sheetName.toLowerCase() + '-added-detail');
  }
  const selectionProductionRow = data.production.findIndex(row => row[0] === 'COMP27-selection') + 6;
  queueRender('Production', `G${selectionProductionRow}:J${selectionProductionRow}`, 'selection-production');
  const featureRow = data.features.findIndex(row => row[0] === 'PRE-BASE-35') + 6;
  queueRender('Fonctionnalités', `F${featureRow}:I${featureRow}`, 'static-family-feature');

  const output = path.join(outputDir, inputNames[0]);
  await (await SpreadsheetFile.exportXlsx(wb)).save(output);
  const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(output));
  verifyTables(reopened, data, 'export/reimport');
  assert.deepEqual(reopened.worksheets.getItem('Synthèse').getUsedRange().formulas, wb.worksheets.getItem('Synthèse').getUsedRange().formulas);

  // Extraction lives in OS temp storage and is removed after comparison. Only
  // the compact semantic report is retained; no large cell dumps are shipped.
  nativeDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'encore-completion-native-'));
  const inspector = path.join(root, 'scripts/inspect-combat-workbook-native.py');
  assert(process.env.CODEX_PRIMARY_RUNTIME_PYTHON);
  let native, beforeManifest, afterManifest;
  try {
    execFileSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON, [inspector, 'extract', inputWorkbook, path.join(nativeDirectory, 'native-before')], { stdio: 'ignore' });
    execFileSync(process.env.CODEX_PRIMARY_RUNTIME_PYTHON, [inspector, 'extract', output, path.join(nativeDirectory, 'native-after')], { stdio: 'ignore' });
    native = await compareNative();
    beforeManifest = await json(path.join(nativeDirectory, 'native-before/manifest.json'));
    afterManifest = await json(path.join(nativeDirectory, 'native-after/manifest.json'));
    await writeJson(path.join(outputDir, 'native-preservation.json'), native);
    assert.equal(native.differences.length, 0, JSON.stringify(native.differences.slice(0, 4)));
  } finally { await fs.rm(nativeDirectory, { recursive: true, force: true }); }
  const dataBytes = Buffer.from(JSON.stringify(data, null, 2) + '\n');
  await fs.writeFile(path.join(outputDir, inputNames[1]), dataBytes);
  const report = {
    schema: 'encore-completion-workbook-review/v1', asOf: '2026-11-27', sourceCommit: completion.currentQa?.sourceCommit || completion.baselineCommit,
    sourceCommitScope: completion.currentQa?.sourceCommit ? 'QA evidence commit' : 'Historical baseline; modified working-tree evidence is identified by the exact source SHA-256 values.',
    inputWorkbookSHA256: sha(await fs.readFile(inputWorkbook)), inputTrackerSHA256: sha(inputTrackerBytes),
    workbookSHA256: sha(await fs.readFile(output)), trackerDataSHA256: sha(dataBytes), sourceDataSHA256: sha(sourceBytes), completionSourceSHA256: sha(completionBytes),
    existingSheets: initialSheets, addedSheets: [], allowedExistingChanges: allowedChanges, appended, appendedControls, nativePreservation: native,
    formulas: { before: beforeManifest.sheets.reduce((n, sheet) => n + sheet.formulas, 0), after: afterManifest.sheets.reduce((n, sheet) => n + sheet.formulas, 0), recalculated: true, errorMatches: 0, exportReimportChecked: true, desktopExcelOpened: false },
    renders: renders.map(name => `${evidenceDir}/${name}`), renderRequests, renderRecords: {}, visualReview: { status: 'awaiting-renders-and-agent-review' },
    gameTestsExecutedByWorkbookUpdate: false, releaseReviewed: false,
    limitations: ['Les preuves de jeu restent datées et séparées de cette revue du classeur.', 'Excel bureau et périphériques physiques non vérifiés. La fidélité canonique 1:1 n’est pas certifiée par la présence des fichiers.'],
  };
  await writeJson(path.join(outputDir, reportName), report);
  await fs.writeFile(path.join(outputDir, 'previous-workbook-verification.json'), await fs.readFile(path.join(baselineDir, inputNames[2])));
  console.log(JSON.stringify({ status: 'staged', output, cellsCompared: native.cellsChecked, sheetCount: initialSheets.length, formulas: report.formulas.after, addedRows: appended, renderViews: renderRequests.length, workbookSHA256: report.workbookSHA256 }));
}

function verifyTables(book, tracker, stage) {
  for (const [sheetName, key] of Object.entries(sheetDataKeys)) assert.deepEqual(normalized(book.worksheets.getItem(sheetName).tables.items[0].getDataRows()), normalized(tracker[key]), `${stage} table differs: ${sheetName}`);
  assert.deepEqual(normalized(book.worksheets.getItem('Extensions combat').tables.items[0].getDataRows()), normalized(tracker.extensionsIntegration.rows), stage + ' extension sections');
  assert.deepEqual(normalized(book.worksheets.getItem('Fiches extensions').tables.items[0].getDataRows()), normalized(tracker.extensionsIntegration.profileRows), stage + ' individual briefs');
}

function queueRender(sheetName, range, label) {
  const name = label + '.png'; renders.push(name);
  renderRequests.push({ name, sheetName, range, scale: 1, format: 'png' });
}

async function renderStaged() {
  const report = await json(path.join(outputDir, reportName));
  const workbookPath = path.join(outputDir, inputNames[0]);
  assert.equal(sha(await fs.readFile(workbookPath)), report.workbookSHA256, 'Staged workbook changed before rendering');
  const first = Number(flag('--render-start', 0)), limit = Number(flag('--render-limit', 3));
  assert(Number.isInteger(first) && first >= 0 && Number.isInteger(limit) && limit > 0);
  const batch = report.renderRequests.slice(first, first + limit);
  assert(batch.length, 'Empty render batch');
  const book = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
  for (const request of batch) {
    const { name, ...options } = request;
    const bytes = new Uint8Array(await (await book.render(options)).arrayBuffer());
    await fs.writeFile(path.join(outputDir, name), bytes);
    report.renderRecords[name] = { workbookSHA256: report.workbookSHA256, sha256: sha(bytes), sheetName: request.sheetName, range: request.range };
  }
  report.visualReview = { status: 'awaiting-agent-review' };
  await writeJson(path.join(outputDir, reportName), report);
  console.log(JSON.stringify({ step: 'render-batch-complete', first, rendered: batch.map(request => request.name), completed: Object.keys(report.renderRecords).length, total: report.renderRequests.length }));
}

async function publish() {
  const report = await json(path.join(outputDir, reportName));
  assert.equal(report.nativePreservation.status, 'passed');
  assert.equal(report.visualReview.status, 'passed', 'Review the rendered views before installing');
  for (const request of report.renderRequests) {
    const record = report.renderRecords[request.name];
    assert(record && record.workbookSHA256 === report.workbookSHA256, 'Missing or stale render: ' + request.name);
    assert.equal(sha(await fs.readFile(path.join(outputDir, request.name))), record.sha256);
  }
  assert.equal(sha(await fs.readFile(path.join(root, sourceFile))), report.sourceDataSHA256, 'Bible data changed after review');
  assert.equal(sha(await fs.readFile(path.resolve(root, completionFile))), report.completionSourceSHA256, 'Completion evidence changed after review');
  const bytes = await fs.readFile(path.join(outputDir, inputNames[0]));
  const trackerBytes = await fs.readFile(path.join(outputDir, inputNames[1]));
  const tracker = JSON.parse(trackerBytes);
  assert.equal(sha(bytes), report.workbookSHA256); assert.equal(sha(trackerBytes), report.trackerDataSHA256);
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[0]))), report.inputWorkbookSHA256, 'Concurrent workbook change');
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[1]))), report.inputTrackerSHA256, 'Concurrent companion change');
  const previousBytes = await fs.readFile(path.join(outputDir, 'previous-workbook-verification.json'));
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[2]))), sha(previousBytes), 'Concurrent verification change');
  const evidenceNames = ['previous-workbook-verification.json', 'native-preservation.json', 'formula-scan.ndjson', 'completion-inspection.ndjson', 'baseline-summary.png', 'baseline-production.png', 'baseline-selection-section.png', ...report.renders.map(file => path.basename(file))];
  const sourceDigests = {
    [sourceFile]: report.sourceDataSHA256, [completionFile]: report.completionSourceSHA256,
    [`docs/${reportName}`]: sha(await fs.readFile(path.join(outputDir, reportName))),
    'scripts/update-combat-workbook-completion-20261127.mjs': sha(await fs.readFile(path.join(root, 'scripts/update-combat-workbook-completion-20261127.mjs'))),
  };
  for (const [file, digest] of Object.entries(tracker.completionIntegration.sourceDigests)) {
    assert.equal(sha(await fs.readFile(path.join(root, file))), digest, 'Source changed after workbook review: ' + file);
    sourceDigests[file] = digest;
  }
  for (const name of evidenceNames) sourceDigests[`${evidenceDir}/${name}`] = sha(await fs.readFile(path.join(outputDir, name)));
  const canonical = {
    schema: 'encore-completion-workbook-canonical/v1', createdAt: new Date().toISOString(), gameVersion: '0.7.0', sourceCommit: report.sourceCommit, sourceCommitScope: report.sourceCommitScope,
    scope: 'Mise à jour des ressources et de la sélection statique dans les 14 feuilles existantes, avec conservation des notes, formules et preuves historiques.',
    workbookSHA256: report.workbookSHA256, trackerDataSHA256: report.trackerDataSHA256, counts: tracker.counts, sourceDigests,
    workbookReview: { path: `docs/${reportName}`, sha256: sourceDigests[`docs/${reportName}`], status: 'passed', preservedCells: report.nativePreservation.cellsChecked, existingSheetsPreserved: initialSheets.length, addedSheets: 0, formulasRecalculated: report.formulas.after, formulaErrors: 0 },
    historicalEvidence: { path: `${evidenceDir}/previous-workbook-verification.json`, sha256: sha(previousBytes), scope: 'Rapport précédent conservé intégralement. La CI cc972c8 est ajoutée comme preuve historique séparée, sans certifier les ajouts actuels.' },
    currentQa: tracker.currentQa,
    workbookQa: { gameVersion: '0.7.0', campaign: 'completion-workbook-2026-11-27', complete: true, gameTestsExecuted: false, evidence: `docs/${reportName}`, scope: 'Contrôles du classeur uniquement ; les contrôles du jeu conservent leur preuve et leur portée propres.' },
    releaseReviewed: false, fullCiExecutedByWorkbookUpdate: false, canonicalVisualApproval: false,
    packaging: { eligible: false, reason: 'La revue du classeur ne vaut pas revue de livraison du jeu ; une campagne complète rattachée au même runtime reste nécessaire.' }, limitations: report.limitations,
  };
  await writeJson(path.join(outputDir, inputNames[2]), canonical);
  const { publishWorkbookArtifacts } = await import(pathToFileURL(path.join(root, 'scripts/workbook-publication.mjs')));
  await fs.mkdir(path.join(root, evidenceDir), { recursive: true });
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, evidenceDir), files: evidenceNames.map(name => ({ name, source: path.join(outputDir, name) })) });
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: [...inputNames, reportName].map(name => ({ name, source: path.join(outputDir, name) })) });
  console.log(JSON.stringify({ status: 'installed', workbookSHA256: report.workbookSHA256, trackerDataSHA256: report.trackerDataSHA256, releaseReviewed: false }));
}

function setCell(sheetName, address, value, formula = false) {
  const cell = wb.worksheets.getItem(sheetName).getRange(address);
  const match = /^([A-Z]+)(\d+)$/.exec(address);
  const column = [...match[1]].reduce((n, letter) => n * 26 + letter.charCodeAt(0) - 64, 0);
  const originalRow = Number(match[2]) - 1;
  const oldValue = sheetName === 'Synthèse' ? beforeSummaryValues[originalRow][column - 1] : cell.values[0][0];
  const oldFormula = (sheetName === 'Synthèse' ? beforeSummaryFormulas[originalRow][column - 1] : cell.formulas[0][0]) || null;
  if (formula) cell.formulas = [[value]]; else cell.values = [[value]];
  const existing = allowedChanges.find(edit => edit.sheet === sheetName && edit.row === Number(match[2]) && edit.column === column);
  if (existing) { existing.after = cell.values[0][0]; existing.afterFormula = formula ? value : null; }
  else allowedChanges.push({ sheet: sheetName, row: Number(match[2]), column, before: oldValue, beforeFormula: oldFormula, after: cell.values[0][0], afterFormula: formula ? value : null });
}

function addRows(sheetName, key, rows) {
  if (!rows?.length) return;
  const sheet = wb.worksheets.getItem(sheetName), table = sheet.tables.items[0];
  const oldCount = data[key].length, oldEnd = oldCount + 5, width = data[key][0].length;
  const templateWidths = sheetName === 'QA' ? [27, 22, 110, 20, 12, 68, 95, 100, 40] : [40, 18, 31, 29, 18, 12, 70, 46, 94, 40];
  const ids = new Set(data[key].map(row => row[0]));
  for (const row of rows) { assert.equal(row.length, width, sheetName + ' row width'); assert(!ids.has(row[0]), 'Duplicate row ID: ' + row[0]); ids.add(row[0]); }
  table.rows.add(null, rows);
  for (let i = 0; i < rows.length; i++) {
    const r = oldEnd + i + 1;
    sheet.getRange(`A${r}:${col(width)}${r}`).copyFrom(sheet.getRange(`A${oldEnd}:${col(width)}${oldEnd}`), 'all');
    sheet.getRange(`A${r}:${col(width)}${r}`).values = [rows[i]];
    sheet.getRange(`A${r}:${col(width)}${r}`).format.wrapText = true;
    sheet.getRange(`A${r}:${col(width - 1)}${r}`).format.fill = r % 2 === 0 ? '#F3F0F8' : '#FFFFFF';
    sheet.getRange(`A${r}`).format.rowHeight = Math.max(56, ...rows[i].map((v, j) => String(v ?? '').split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / (templateWidths[j] * 1.3 - 4))), 0) * 15 + 14));
  }
  data[key].push(...rows);
  appended[sheetName] = { before: oldCount, after: data[key].length, rows: rows.length };
  const statusRange = `${sheetName === 'QA' ? 'D' : 'E'}${oldEnd + 1}:${sheetName === 'QA' ? 'D' : 'E'}${data[key].length + 5}`;
  const values = sheetName === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'];
  sheet.getRange(statusRange).dataValidation = { rule: { type: 'list', values } };
  const statusColors = [['Implémenté', '#23513D', '#E4F1E9'], ['Partiel', '#79501D', '#FCEED8'], ['Prévu', '#56496D', '#EAE7F1'], ['À vérifier', '#805B00', '#FFF1C9'], ['Réussi', '#23513D', '#E4F1E9'], ['Échec', '#A12A2A', '#FBE0E0'], ['Non exécuté', '#56496D', '#EAE7F1']];
  const rules = statusColors.map(([text, color, fill]) => ({ range: statusRange, text, format: { font: { color }, fill } }));
  for (const { text, format } of rules) sheet.getRange(statusRange).conditionalFormats.add('containsText', { text, format });
  appendedControls[sheetName] = { validation: { range: statusRange, values }, rules };
  data.counts[key] = data[key].length;
  const summary = wb.worksheets.getItem('Synthèse');
  const formulas = summary.getUsedRange().formulas;
  for (let r = 0; r < formulas.length; r++) for (let c = 0; c < formulas[r].length; c++) {
    const f = formulas[r][c];
    if (typeof f !== 'string' || !f.includes(sheetName)) continue;
    const pattern = new RegExp(`((?:'${sheetName}'|${sheetName})!\\$?[A-Z]+\\$?\\d+:\\$?[A-Z]+\\$?)${oldEnd}(?!\\d)`, 'g');
    const next = f.replace(pattern, (_, prefix) => prefix + (data[key].length + 5));
    if (next !== f) setCell('Synthèse', `${col(c + 1)}${r + 1}`, next, true);
  }
}


async function compareNative() {
  const before = await json(path.join(nativeDirectory, 'native-before/manifest.json')), after = await json(path.join(nativeDirectory, 'native-after/manifest.json'));
  const differences = []; let cellsChecked = 0;
  const equal = (a, b, at) => { if (JSON.stringify(a) !== JSON.stringify(b) && differences.length < 50) differences.push({ at, expected: a, actual: b }); };
  equal(before.sheets.map(s => s.name), initialSheets, 'baseline sheet order');
  equal(after.sheets.map(s => s.name), initialSheets, 'final sheet order'); equal(before.theme, after.theme, 'theme');
  for (let i = 0; i < before.sheets.length; i++) {
    const old = await json(path.join(nativeDirectory, 'native-before', before.sheets[i].file)), now = await json(path.join(nativeDirectory, 'native-after', after.sheets[i].file));
    for (const key of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) equal(old[key], now[key], old.name + '/' + key);
    if (appendedControls[old.name]) {
      equal(old.validations, now.validations.slice(0, old.validations.length), old.name + '/existing-validations');
      equal([appendedControls[old.name].validation], now.validations.slice(old.validations.length), old.name + '/new-validation');
      equal(old.rules, now.rules.slice(0, old.rules.length), old.name + '/existing-rules');
      const lastPriority = Math.max(...old.rules.map(rule => rule.priority));
      const expectedRules = appendedControls[old.name].rules.map((rule, index) => ({ ...rule, priority: lastPriority + index + 1 }));
      equal(expectedRules, now.rules.slice(old.rules.length), old.name + '/new-rules');
    } else {
      equal(old.validations, now.validations, old.name + '/validations');
      equal(old.rules, now.rules, old.name + '/rules');
    }
    for (const [r, h] of Object.entries(old.heights)) equal(h, now.heights[r], old.name + '/height/' + r);
    if (!appended[old.name]) equal(old.tables, now.tables, old.name + '/tables');
    else {
      assert.equal(old.tables.length, now.tables.length);
      for (let j = 0; j < old.tables.length; j++) {
        const oldTable = structuredClone(old.tables[j]), nowTable = structuredClone(now.tables[j]);
        oldTable.range = oldTable.range.replace(/\d+$/, String(appended[old.name].after + 5));
        equal(oldTable, nowTable, old.name + '/extended-table/' + j);
      }
    }
    const current = new Map(now.cells.map(c => [c[0] + ':' + c[1], c]));
    if (!appended[old.name]) equal(old.cells.map(c => c.slice(0, 2)), now.cells.map(c => c.slice(0, 2)), old.name + '/cell addresses');
    for (const cell of old.cells) {
      const other = current.get(cell[0] + ':' + cell[1]); if (!other) { differences.push({ at: old.name, missing: cell.slice(0, 2) }); continue; }
      cellsChecked++;
      const edit = allowedChanges.find(c => c.sheet === old.name && c.row === cell[0] && c.column === cell[1]);
      if (edit) { equal(edit.before, cell[3], old.name + '/approved-before/' + cell.slice(0, 2)); equal(edit.after, other[3], old.name + '/approved-after/' + cell.slice(0, 2)); equal(edit.afterFormula, other[4], old.name + '/approved-formula/' + cell.slice(0, 2)); }
      else if (cell[4] && old.name === 'Synthèse' && Object.keys(appended).length) equal(cell[4], other[4], old.name + '/formula/' + cell.slice(0, 2));
      else equal(cell.slice(2, 5), other.slice(2, 5), old.name + '/cell/' + cell.slice(0, 2));
      equal(before.styles[cell[5]], after.styles[other[5]], old.name + '/style/' + cell.slice(0, 2));
    }
  }
  return { status: differences.length ? 'failed' : 'passed', cellsChecked, sheetsChecked: initialSheets.length, differences, checked: ['Existing IDs, row order, values, formulas and notes', 'Effective cell styles, existing dimensions, panes, tables, filters, validations, conditional formats, margins and theme'], approvedCellChanges: allowedChanges.length };
}


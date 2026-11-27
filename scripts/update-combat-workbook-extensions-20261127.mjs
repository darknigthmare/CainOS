/**
 * Extend the existing Encore tracker with the two original guide extensions.
 * Run a copy of this file in a private OS temporary directory using
 * CODEX_PRIMARY_RUNTIME_NODE and the primary runtime node_modules symlink.
 * --build stages the XLSX; --render-staged renders bounded isolated batches;
 * --publish-staged installs the exact bytes after the recorded visual review.
 * All workbook authoring uses the public @oai/artifact-tool API.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const outputDir = path.resolve(flag('--output-dir', path.join(root, '../outputs/encore-extensions-20261127')));
const evidenceDir = 'docs/verification/extensions-workbook-20261127';
const sourceFile = 'docs/bible/extensions-workbook-data.json';
const continuationFile = flag('--continuation-data', null);
const inputNames = ['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx', 'combat-tracker-data.json', 'combat-workbook-verification.json'];
const reportName = 'combat-extensions-workbook-verification.json';
const sha = value => createHash('sha256').update(value).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const normalized = rows => rows.map(row => row.map(value => value === '' || value === undefined ? null : value));
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const initialSheets = ['Synthèse', 'Fonctionnalités', 'Combattants', 'Techniques', 'Arènes', 'Atlas', 'Production', 'Scénarios', 'Extension PNJ', 'QA', 'Références', 'Guide combat'];
const addedSheets = ['Extensions combat', 'Fiches extensions'];
const sheetDataKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const allowedChanges = [];
const appended = {};
const appendedControls = {};
const renders = [];
const renderRequests = [];
await fs.mkdir(outputDir, { recursive: true });

if (args.includes('--publish-staged')) {
  await publish();
  process.exit(0);
}
if (args.includes('--render-staged')) {
  await renderStaged();
  process.exit(0);
}
assert(args.includes('--build'), 'Choose --build or --publish-staged');

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
const source = JSON.parse(sourceBytes);
const before = JSON.parse(inputTrackerBytes), data = structuredClone(before);
const continuation = continuationFile ? await json(path.resolve(continuationFile)) : null;
for (const [file, digest] of Object.entries(continuation?.sourceDigests || {})) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Continuation evidence must be repo-relative');
  assert.equal(sha(await fs.readFile(path.join(root, file))), digest, 'Continuation source changed: ' + file);
}
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputWorkbook));
console.log(JSON.stringify({ step: 'baseline-imported' }));
const beforeSummaryFormulas = wb.worksheets.getItem('Synthèse').getUsedRange().formulas;
const beforeSummaryValues = wb.worksheets.getItem('Synthèse').getUsedRange().values;
for (const [sheetName, key] of Object.entries(sheetDataKeys)) {
  const rows = wb.worksheets.getItem(sheetName).tables.items[0].getDataRows();
  assert.deepEqual(normalized(rows), normalized(before[key]), 'Source workbook and companion differ: ' + sheetName);
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

// The extension data is a documentation input, not proof of playable mechanics.
const prepared = prepareExtensionRows(source);
assert.equal(prepared.sections.length, 38, 'The two extensions cover sections 30–67');
const sectionHeaders = ['ID', 'Rubrique', 'Conception', 'Assets', 'Intégration', 'Tests', 'Application à Encore', 'Validation attendue', 'Source', 'Notes utilisateur'];
const profileHeaders = ['ID', 'Type', 'Personnage ou contenu', 'Conception proposée', 'Conception', 'Assets', 'Intégration', 'Tests', 'Source', 'Notes utilisateur'];
addSheet('Extensions combat', 'Extensions du guide de combat', 'Sections 30–67 : expressions, équipes, bonus et accès au contenu.', sectionHeaders, prepared.sections, [20, 42, 21, 24, 24, 24, 68, 68, 60, 36], 'ExtensionsCombatTable');
addSheet('Fiches extensions', 'Fiches de conception des extensions', 'Fiches reliées au catalogue existant. Les statuts de conception et de jeu sont séparés.', profileHeaders, prepared.profiles, [30, 20, 32, 100, 21, 24, 24, 24, 60, 36], 'FichesExtensionsTable');
console.log(JSON.stringify({ step: 'extension-sheets-added', profiles: prepared.profiles.length }));

if (continuation) applyContinuation(continuation);
console.log(JSON.stringify({ step: 'continuation-applied', appended }));
setCell('Synthèse', 'H2', 'Version 0.7.0 · extensions du guide · 27 novembre 2026');
setCell('Synthèse', 'H7', 'Extensions du guide : rubriques 30–67');
setCell('Synthèse', 'H8', `${prepared.profiles.length} fiches de conception associées`);
setCell('Synthèse', 'H13', 'Contrôles du jeu antérieurs : voir les preuves datées');
setCell('Synthèse', 'H15', 'Extensions : conception, assets, intégration et tests séparés');
setCell('Synthèse', 'H16', continuation?.summary || '79 PNG annoncés le 26/11 : sources non récupérées');
if (continuation) {
  setCell('Synthèse', 'H17', '79 PNG annoncés le 26/11 : non récupérés, exclus des ajouts');
  setCell('Synthèse', 'H30', `${data.counts.baseOnlyCostumes} familles statiques au total · aucune nouvelle animation`);
  setCell('Synthèse', 'H24', `=COUNTIFS('Production'!B6:B${data.production.length + 5},"Animation d’arène",'Production'!E6:E${data.production.length + 5},"Implémenté")&" ambiances visuelles procédurales actives"`, true);
  if (continuation.qaSummaryLabel) setCell('Synthèse', 'H13', continuation.qaSummaryLabel);
  if (continuation.browserSummaryLabel) setCell('Synthèse', 'H14', continuation.browserSummaryLabel);
}
data.contentAsOf = '2026-11-27';
data.asOf = '2026-11-27';
data.extensionsIntegration = {
  schema: 'encore-extensions-tracker/v1', asOf: '2026-11-27', source: sourceFile,
  sourceSHA256: sha(sourceBytes), sections: prepared.sections.length,
  profiles: prepared.profiles.length, sheets: addedSheets,
  scope: 'Association des deux extensions à la bible. Les statuts documentaires ne valent pas intégration jouable.',
  rows: prepared.sections, profileRows: prepared.profiles,
  recovery: { announcedPng: 79, recoveredPng: 0, evidence: 'docs/art-generation/recovery-20261127/recovery.json', countedAsDelivered: false },
  continuation: continuation || null,
};
wb.recalculate();
console.log(JSON.stringify({ step: 'formulas-recalculated' }));
const expectedSummary = { B7: data.counts.fighters, B8: data.counts.moves, B9: data.counts.stages, B10: data.counts.atlas, B11: data.counts.variants, B12: data.counts.dedicatedStages, F15: data.features.length, F16: data.production.length, F17: data.scenarios.length, F18: data.atlas.length, F22: data.qa.length };
if (continuation) expectedSummary.H24 = `${data.counts.animatedStages} ambiances visuelles procédurales actives`;
for (const [address, value] of Object.entries(expectedSummary)) assert.equal(wb.worksheets.getItem('Synthèse').getRange(address).values[0][0], value, 'Independent summary total: ' + address);
assert.equal(beforeSummaryFormulas.flat().filter(Boolean).length, wb.worksheets.getItem('Synthèse').getUsedRange().formulas.flat().filter(Boolean).length, 'No existing formula may be replaced by a constant');
const actualQaSummary = Object.fromEntries(Object.keys(data.qaSummary).map(key => [key, 0]));
for (const row of data.qa) actualQaSummary[row[3]] = (actualQaSummary[row[3]] || 0) + 1;
assert.deepEqual(actualQaSummary, data.qaSummary, 'Companion QA summary must equal the preserved and appended QA rows');

// Verify that all explicit summary edits are final after recalculation.
for (const edit of allowedChanges) edit.after = wb.worksheets.getItem(edit.sheet).getCell(edit.row - 1, edit.column - 1).values[0][0];
for (const [sheetName, key] of Object.entries(sheetDataKeys)) assert.deepEqual(normalized(wb.worksheets.getItem(sheetName).tables.items[0].getDataRows()), normalized(data[key]), 'Updated table and companion differ: ' + sheetName);
const formulaScan = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 30 }, maxChars: 3000 });
await fs.writeFile(path.join(outputDir, 'formula-scan.ndjson'), formulaScan.ndjson);
assert(formulaScan.ndjson.includes('Cell search matched 0 entries.'), 'Formula errors require review');
await fs.writeFile(path.join(outputDir, 'extensions-inspection.ndjson'), (await wb.inspect({ kind: 'table', range: "'Extensions combat'!A5:F10", include: 'values,formulas', tableMaxRows: 6, tableMaxCols: 6, maxChars: 5500 })).ndjson);
await render('Synthèse', 'A1:H18', 'summary');
await render('Extensions combat', 'A1:F10', 'extensions-overview');
await render('Extensions combat', 'G5:J8', 'extensions-detail');
await render('Fiches extensions', 'A1:D9', 'profiles-overview');
await render('Fiches extensions', 'E5:J9', 'profiles-status');
await render('Extensions combat', 'A35:F43', 'access-overview');
await render('Extensions combat', 'G14:J18', 'long-section-details');
await render('Fiches extensions', 'A198:D201', 'duo-profiles');
await render('Fiches extensions', 'A210:D213', 'bonus-profiles');
await render('Fiches extensions', 'A232:D238', 'access-profiles');
await render('Fiches extensions', 'E223:J226', 'access-status');
if (continuation) {
  await render('Synthèse', 'A19:H34', 'summary-detail');
  for (const update of continuation.rowUpdates.filter(update => update.sheet === 'Arènes')) {
    const row = data.stages.findIndex(row => row[0] === update.id) + 6;
    await render('Arènes', `N${row}:S${row}`, 'stage-' + update.id);
  }
  for (const id of ['falseexit', 'undermap']) {
    const row = data.production.findIndex(row => row[0] === `ART-${id}-background`) + 6;
    await render('Production', `G${row}:J${row + 2}`, 'stage-production-' + id);
  }
  for (const [sheetName, details] of Object.entries(appended)) {
    await render(sheetName, `A${details.before + 6}:F${Math.min(details.after + 5, details.before + 9)}`, sheetName.toLowerCase() + '-added-overview');
    await render(sheetName, `G${details.before + 6}:${sheetName === 'QA' ? 'I' : 'J'}${Math.min(details.after + 5, details.before + 9)}`, sheetName.toLowerCase() + '-added-detail');
  }
}

const output = path.join(outputDir, inputNames[0]);
console.log(JSON.stringify({ step: 'render-views-queued', count: renders.length }));
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(output));
for (const [sheetName, key] of Object.entries(sheetDataKeys)) assert.deepEqual(normalized(reopened.worksheets.getItem(sheetName).tables.items[0].getDataRows()), normalized(data[key]), 'Export/reimport table mismatch: ' + sheetName);
assert.deepEqual(reopened.worksheets.getItem('Extensions combat').tables.items[0].getDataRows(), prepared.sections);
assert.deepEqual(reopened.worksheets.getItem('Fiches extensions').tables.items[0].getDataRows(), prepared.profiles);
assert.deepEqual(reopened.worksheets.getItem('Synthèse').getUsedRange().formulas, wb.worksheets.getItem('Synthèse').getUsedRange().formulas);

const inspector = path.join(root, 'scripts/inspect-combat-workbook-native.py');
const python = process.env.CODEX_PRIMARY_RUNTIME_PYTHON;
assert(python, 'CODEX_PRIMARY_RUNTIME_PYTHON is required');
execFileSync(python, [inspector, 'extract', inputWorkbook, path.join(outputDir, 'native-before')], { stdio: 'ignore' });
execFileSync(python, [inspector, 'extract', output, path.join(outputDir, 'native-after')], { stdio: 'ignore' });
const native = await compareNative();
await writeJson(path.join(outputDir, 'native-preservation.json'), native);
assert.equal(native.differences.length, 0, JSON.stringify(native.differences.slice(0, 4)));
const dataBytes = Buffer.from(JSON.stringify(data, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, inputNames[1]), dataBytes);
const beforeManifest = await json(path.join(outputDir, 'native-before/manifest.json'));
const afterManifest = await json(path.join(outputDir, 'native-after/manifest.json'));
const report = {
  schema: 'encore-extensions-workbook-review/v1', asOf: '2026-11-27', sourceCommit: '6e44ab75b9c82b4d6fe62a0051287275abc97753',
  inputWorkbookSHA256: sha(await fs.readFile(inputWorkbook)), inputTrackerSHA256: sha(inputTrackerBytes),
  workbookSHA256: sha(await fs.readFile(output)), trackerDataSHA256: sha(dataBytes), sourceDataSHA256: sha(sourceBytes),
  addedSheets: addedSheets.map((name, i) => ({ name, rows: i === 0 ? prepared.sections.length : prepared.profiles.length, notesColumn: 'J' })),
  allowedExistingChanges: allowedChanges, appended, appendedControls, nativePreservation: native,
  formulas: { before: beforeManifest.sheets.reduce((n, s) => n + s.formulas, 0), after: afterManifest.sheets.reduce((n, s) => n + s.formulas, 0), recalculated: true, errorMatches: 0, exportReimportChecked: true, desktopExcelOpened: false },
  renders: renders.map(name => `${evidenceDir}/${name}`), renderRequests, renderRecords: {}, visualReview: { status: 'awaiting-renders-and-agent-review' },
  gameTestsExecutedByWorkbookUpdate: false, releaseReviewed: false,
  limitations: ['Les contrôles de jeu historiques restent datés ; aucune campagne QA du jeu n’est exécutée par ce générateur de classeur.', 'Excel bureau et périphériques physiques non vérifiés. La fidélité 1:1 n’est pas certifiée par la présence de fichiers.'],
};
await writeJson(path.join(outputDir, reportName), report);
await fs.writeFile(path.join(outputDir, 'previous-workbook-verification.json'), await fs.readFile(path.join(baselineDir, inputNames[2])));
console.log(JSON.stringify({ status: 'staged', output, cellsCompared: native.cellsChecked, sections: prepared.sections.length, profiles: prepared.profiles.length, addedRows: appended, workbookSHA256: report.workbookSHA256 }));

function addSheet(name, title, subtitle, headers, rows, widths, tableName) {
  const sheet = wb.worksheets.add(name), end = rows.length + 5;
  sheet.showGridLines = false; sheet.tabColor = '#6A3884';
  sheet.getRange(`A1:J${end}`).format.font = { name: 'Arial', size: 11, color: '#17233A' };
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = { name: 'Arial', size: 16, bold: true, color: '#604399' };
  sheet.getRange('A2:J2').format.rowHeight = 28;
  sheet.getRange('A3').values = [[subtitle]];
  sheet.getRange('A3:J3').format.rowHeight = 24;
  sheet.getRange('A4').values = [['Sources : bible Encore et extensions 01/02 originales du guide, conservées intégralement dans le dépôt.']];
  sheet.getRange('A4:J4').format.rowHeight = 24;
  sheet.getRange('A5:J5').values = [headers];
  sheet.getRange(`A6:J${end}`).values = rows;
  const table = sheet.tables.add(`A5:J${end}`, true, tableName); table.style = 'TableStyleLight1'; table.showFilterButton = true;
  sheet.getRange('A5:J5').format = { fill: '#47315E', font: { name: 'Arial', size: 11, bold: true, color: '#FFFFFF' }, wrapText: true, horizontalAlignment: 'center', verticalAlignment: 'center', rowHeight: 38 };
  sheet.getRange(`A6:J${end}`).format.verticalAlignment = 'top';
  sheet.getRange(`A6:J${end}`).format.wrapText = true;
  sheet.getRange(`J6:J${end}`).format.fill = '#FFF2CC';
  widths.forEach((width, i) => { sheet.getRange(`${col(i + 1)}1`).format.columnWidth = width; });
  for (let i = 0; i < rows.length; i++) {
    if (i % 2 === 0) sheet.getRange(`A${i + 6}:I${i + 6}`).format.fill = '#F3F0F8';
    const lines = Math.max(...rows[i].map((v, j) => String(v ?? '').split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / Math.max(8, widths[j] - 4))), 0)));
    sheet.getRange(`A${i + 6}`).format.rowHeight = Math.max(66, lines * 16 + 14);
  }
  const statusRange = name === 'Extensions combat' ? `C6:F${end}` : `E6:H${end}`;
  sheet.getRange(statusRange).conditionalFormats.add('containsText', { text: 'Non', format: { fill: '#FFF2CC', font: { color: '#815300' } } });
  sheet.getRange(statusRange).conditionalFormats.add('containsText', { text: 'À ', format: { fill: '#FFF2CC', font: { color: '#815300' } } });
  sheet.freezePanes.freezeRows(5); sheet.freezePanes.freezeColumns(2);
}

function prepareExtensionRows(input) {
  // Schema is explicitly owned by the versioned bible generator.
  assert(Array.isArray(input.sections), 'extensions-workbook-data.sections required');
  assert(Array.isArray(input.profiles), 'extensions-workbook-data.profiles required');
  const status = row => row.status || {};
  const profileTypes = { taunt: 'Provocation', selection: 'Sélection', deselection: 'Désélection', duo: 'Duo', bonus: 'Bonus', hub: 'Salle du hub', 'regle-acces': 'Règle d’accès', 'soutien-inactif': 'Soutien inactif', 'charte-verrou': 'Charte visuelle', 'test-droits': 'Test des droits', clash: 'Clash' };
  const sections = input.sections.map(s => [s.id, `${s.section} — ${s.title}`, status(s).design || 'Documentée', status(s).assets || 'À produire', status(s).integration || 'Non intégré', status(s).tests || 'Non exécuté', s.adaptation, s.verification, (s.links || []).join('\n'), null]);
  const profiles = input.profiles.map(p => [p.id, profileTypes[p.type] || p.type, p.entity, [p.title, p.description].filter(Boolean).join('\n'), status(p).design || 'Documentée', status(p).assets || 'À produire', status(p).integration || 'Non intégré', status(p).tests || 'Non exécuté', p.source, null]);
  assert.equal(new Set(sections.map(row => row[0])).size, sections.length);
  assert.equal(new Set(profiles.map(row => row[0])).size, profiles.length);
  return { sections, profiles };
}

function applyContinuation(c) {
  for (const [key, value] of Object.entries(c.counts || {})) data.counts[key] = value;
  for (const [key, value] of Object.entries(c.metadataUpdates || {})) {
    assert(['npcCrossoverCoverage', 'npcCrossoverCoverageHistory', 'crossoverArt', 'crossoverArtHistory', 'baseSpriteContinuation', 'baseSpriteContinuationHistory', 'illustratedAssets', 'illustratedAssetsScope', 'qaSummary', 'qaSummaryScope'].includes(key), 'Unsupported companion update: ' + key);
    data[key] = value;
  }
  for (const change of c.rowUpdates || []) {
    const key = sheetDataKeys[change.sheet]; assert(key, 'Unsupported existing data sheet');
    const index = data[key].findIndex(row => row[0] === change.id); assert(index >= 0, 'Unknown existing ID ' + change.id);
    const row = data[key][index];
    for (const [column, value] of Object.entries(change.cells)) {
      assert(+column >= 1 && +column < row.length - 1, 'Never overwrite ID or user note');
      row[+column] = value; setCell(change.sheet, `${col(+column + 1)}${index + 6}`, value);
    }
  }
  addRows('Production', 'production', c.productionRows || []);
  addRows('QA', 'qa', c.qaRows || []);
  if (c.currentQa) {
    data.historicalCurrentQa = [...(Array.isArray(data.historicalCurrentQa) ? data.historicalCurrentQa : []), data.currentQa].filter(Boolean);
    data.currentQa = c.currentQa;
    data.historicalQaRows = before.qa.length;
    data.qaCampaigns = [...(data.qaCampaigns || []), { ...c.currentQa, asOf: '2026-11-27' }];
  }
}

async function render(sheetName, range, label) {
  const name = label + '.png';
  renders.push(name); renderRequests.push({ name, sheetName, range, scale: 1, format: 'png' });
}

async function renderStaged() {
  const report = await json(path.join(outputDir, reportName));
  const workbookPath = path.join(outputDir, inputNames[0]);
  assert.equal(sha(await fs.readFile(workbookPath)), report.workbookSHA256, 'Staged workbook changed before rendering');
  const first = Number(flag('--render-start', 0)), limit = Number(flag('--render-limit', 4));
  assert(Number.isInteger(first) && first >= 0 && Number.isInteger(limit) && limit > 0);
  const batch = report.renderRequests.slice(first, first + limit);
  assert(batch.length, 'Empty render batch');
  const renderWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
  for (const request of batch) {
    const { name, ...options } = request;
    const bytes = new Uint8Array(await (await renderWorkbook.render(options)).arrayBuffer());
    await fs.writeFile(path.join(outputDir, name), bytes);
    report.renderRecords[name] = { workbookSHA256: report.workbookSHA256, sha256: sha(bytes), sheetName: request.sheetName, range: request.range };
  }
  report.visualReview = { status: 'awaiting-agent-review' };
  await writeJson(path.join(outputDir, reportName), report);
  console.log(JSON.stringify({ step: 'render-batch-complete', first, rendered: batch.map(request => request.name), completed: Object.keys(report.renderRecords).length, total: report.renderRequests.length }));
}

async function compareNative() {
  const before = await json(path.join(outputDir, 'native-before/manifest.json')), after = await json(path.join(outputDir, 'native-after/manifest.json'));
  const differences = []; let cellsChecked = 0;
  const equal = (a, b, at) => { if (JSON.stringify(a) !== JSON.stringify(b) && differences.length < 50) differences.push({ at, expected: a, actual: b }); };
  equal(before.sheets.map(s => s.name), initialSheets, 'baseline sheet order');
  equal(after.sheets.map(s => s.name), [...initialSheets, ...addedSheets], 'final sheet order'); equal(before.theme, after.theme, 'theme');
  for (let i = 0; i < before.sheets.length; i++) {
    const old = await json(path.join(outputDir, 'native-before', before.sheets[i].file)), now = await json(path.join(outputDir, 'native-after', after.sheets[i].file));
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

async function publish() {
  const report = await json(path.join(outputDir, reportName));
  assert.equal(report.nativePreservation.status, 'passed'); assert.equal(report.visualReview.status, 'passed', 'Review the actual rendered views before publication');
  for (const request of report.renderRequests) {
    const record = report.renderRecords[request.name];
    assert(record && record.workbookSHA256 === report.workbookSHA256, 'Render missing or from an earlier workbook: ' + request.name);
    assert.equal(sha(await fs.readFile(path.join(outputDir, request.name))), record.sha256, 'Rendered image changed after review: ' + request.name);
  }
  assert.equal(sha(await fs.readFile(path.join(root, sourceFile))), report.sourceDataSHA256, 'Extension source changed after review');
  const bytes = await fs.readFile(path.join(outputDir, inputNames[0])), trackerBytes = await fs.readFile(path.join(outputDir, inputNames[1]));
  assert.equal(sha(bytes), report.workbookSHA256); assert.equal(sha(trackerBytes), report.trackerDataSHA256);
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[0]))), report.inputWorkbookSHA256, 'Concurrent workbook change');
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[1]))), report.inputTrackerSHA256, 'Concurrent tracker change');
  const previousBytes = await fs.readFile(path.join(outputDir, 'previous-workbook-verification.json'));
  assert.equal(sha(await fs.readFile(path.join(root, 'docs', inputNames[2]))), sha(previousBytes), 'Concurrent verification change');
  const evidenceNames = ['previous-workbook-verification.json', 'native-preservation.json', 'formula-scan.ndjson', 'extensions-inspection.ndjson', ...report.renders.map(p => path.basename(p))];
  const sourceDigests = { [sourceFile]: report.sourceDataSHA256, [`docs/${reportName}`]: sha(await fs.readFile(path.join(outputDir, reportName))), 'scripts/update-combat-workbook-extensions-20261127.mjs': sha(await fs.readFile(path.join(root, 'scripts/update-combat-workbook-extensions-20261127.mjs'))) };
  for (const [file, digest] of Object.entries(JSON.parse(trackerBytes).extensionsIntegration.continuation?.sourceDigests || {})) {
    assert.equal(sha(await fs.readFile(path.join(root, file))), digest, 'Continuation source changed after workbook review: ' + file);
    sourceDigests[file] = digest;
  }
  for (const name of evidenceNames) sourceDigests[`${evidenceDir}/${name}`] = sha(await fs.readFile(path.join(outputDir, name)));
  const canonical = {
    schema: 'encore-extensions-workbook-canonical/v1', createdAt: new Date().toISOString(), gameVersion: '0.7.0', sourceCommit: report.sourceCommit,
    scope: 'Association des extensions 01/02 à la bible et au suivi, avec conservation des données historiques.', workbookSHA256: report.workbookSHA256, trackerDataSHA256: report.trackerDataSHA256,
    counts: JSON.parse(trackerBytes).counts, sourceDigests,
    workbookReview: { path: `docs/${reportName}`, sha256: sourceDigests[`docs/${reportName}`], status: 'passed', preservedCells: report.nativePreservation.cellsChecked, existingSheetsPreserved: initialSheets.length, addedSheets: addedSheets.length, formulasRecalculated: report.formulas.after, formulaErrors: 0 },
    historicalEvidence: { path: `${evidenceDir}/previous-workbook-verification.json`, sha256: sha(previousBytes), scope: 'Rapport précédent conservé intégralement. Ses contrôles de jeu restent historiques.' },
    currentQa: JSON.parse(trackerBytes).currentQa,
    workbookQa: { gameVersion: '0.7.0', campaign: 'guide-extensions-2026-11-27', complete: true, gameTestsExecuted: false, evidence: `docs/${reportName}`, scope: 'Le générateur vérifie le classeur uniquement. Les preuves du jeu de cette reprise sont importées et gardent leur portée propre.' },
    releaseReviewed: false, fullCiExecutedByWorkbookUpdate: false, canonicalVisualApproval: false,
    packaging: { eligible: false, reason: 'La revue du classeur ne remplace pas les preuves complètes de QA du jeu.' }, limitations: report.limitations,
  };
  await writeJson(path.join(outputDir, inputNames[2]), canonical);
  const { publishWorkbookArtifacts } = await import(pathToFileURL(path.join(root, 'scripts/workbook-publication.mjs')));
  await fs.mkdir(path.join(root, evidenceDir), { recursive: true });
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, evidenceDir), files: evidenceNames.map(name => ({ name, source: path.join(outputDir, name) })) });
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: [...inputNames, reportName].map(name => ({ name, source: path.join(outputDir, name) })) });
  console.log(JSON.stringify({ status: 'published', workbookSHA256: report.workbookSHA256, trackerDataSHA256: report.trackerDataSHA256, releaseReviewed: false }));
}

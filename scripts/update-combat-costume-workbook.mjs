/**
 * Append the officially referenced Circus outfits to the existing tracker.
 * Run a copy from a private temp directory with the primary artifact-tool runtime.
 * This is an incremental edit: all earlier IDs, rows, notes and evidence remain.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const root = path.resolve(flag('--repo-root', process.cwd()));
const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs', 'encore-costume-workbook-20261119')));
const input = path.resolve(flag('--input-workbook', path.join(root, 'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
const dataPath = path.resolve(flag('--input-data', path.join(root, 'docs/combat-tracker-data.json')));
const evidenceFile = 'docs/art-generation/cast-continuation-20261119/verification.json';
const EXPECTED_ADDITIONS = Object.freeze(['beachpomni', 'noirragatha', 'presidentpomni', 'noirzooble', 'beachragatha', 'beachzooble', 'beachjax', 'sandcastlekinger']);
const DRAWING_SLOTS = Object.freeze(['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const loadModule = file => import(pathToFileURL(path.join(root, file)));
const populated = value => value !== '' && value !== null && value !== undefined;
const normal = rows => rows.map(row => row.map(value => value ?? ''));
const literal = value => typeof value === 'string' && value.startsWith('=') ? `'${value}` : value;
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const TABLES = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const names = ['Synthèse', ...Object.keys(TABLES).filter(name => name !== 'QA'), 'Extension PNJ', 'QA', 'Références'];
const data = await json(dataPath);
const inputData = structuredClone(data);
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const before = {};
for (const name of names) {
  const sheet = workbook.worksheets.getItem(name), used = sheet.getUsedRange();
  before[name] = {
    values: structuredClone(used.values), formulas: structuredClone(used.formulas),
    tables: sheet.tables.items.map(table => ({ name: table.name, style: table.style, filter: table.showFilterButton,
      headers: table.getHeaderRowRange().values[0], rows: normal(table.getDataRows()) })),
  };
  if (TABLES[name]) {
    assert.equal(sheet.tables.items.length, 1, `Expected one table: ${name}`);
    const table = before[name].tables[0];
    assert.equal(table.headers.at(-1), 'Notes utilisateur');
    assert.deepEqual(table.rows.map(row => row[0]), data[TABLES[name]].map(row => row[0]), `JSON/workbook order differs: ${name}`);
    assert.equal(new Set(table.rows.map(row => row[0])).size, table.rows.length, `Duplicate ID: ${name}`);
    data[TABLES[name]] = structuredClone(table.rows);
  }
}
const sourceRows = before['Références'].tables[0].rows;
assert.deepEqual(sourceRows.map(row => row[0]), data.sources.map(row => row.id), 'Source identity/order differs');
// The workbook owns user edits to its five source fields; preserve other JSON metadata.
data.sources = sourceRows.map(([id, title, kind, url, scope], index) => ({ ...data.sources[index], id, title, kind, url, scope }));
await fs.mkdir(outputDir, { recursive: true });
const render = async (name, range, label) => {
  const image = await workbook.render({ sheetName: name, range, scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${label}.png`), new Uint8Array(await image.arrayBuffer()));
};
if (args.includes('--inspect-only')) {
  const end = before.Production.tables[0].rows.length + 5;
  await render('Synthèse', 'A1:H35', 'before-summary');
  await render('Production', `A${end - 1}:J${end}`, 'before-production');
  await render('Références', 'A5:E7', 'before-references');
  console.log((await workbook.inspect({ kind: 'workbook,sheet,table', maxChars: 6000, tableMaxRows: 2, tableMaxCols: 6, tableMaxCellChars: 60 })).ndjson);
  console.log('COSTUME_WORKBOOK_INSPECTED ' + JSON.stringify({ outputDir, sheets: names.length, production: data.production.length, sources: data.sources.length, qa: data.qa.length,
    currentQa: { campaign: data.currentQa.campaign, rows: data.currentQa.rowIds.length },
    historicalCurrentQa: { campaign: data.historicalCurrentQa.campaign, totals: data.historicalCurrentQa.totals } }));
  process.exit(0);
}

// The final edit is gated on the completed runtime manifest and dated execution evidence.
assert(args.includes('--confirmed-runtime'), 'Wait for the final manifest/build confirmation, then pass --confirmed-runtime');
const evidence = await json(path.join(root, evidenceFile));
const proof = await loadRunProof(evidence);
const [{ FIGHTERS, VARIANTS, COSTUMES }, { COSTUME_ADDITIONS, COSTUME_ADDITION_SOURCES }, offline] = await Promise.all([
  loadModule('combat/data.mjs'), loadModule('combat/costume-additions.mjs'), loadModule('combat/offline-manifest.mjs'),
]);
const expectedIds = COSTUME_ADDITIONS.map(item => item.id), slots = DRAWING_SLOTS;
assert.deepEqual([...expectedIds].sort(), [...EXPECTED_ADDITIONS].sort());
const additionCount = expectedIds.length, expectedArtCount = additionCount * slots.length;
assert.equal(FIGHTERS.length, 54); assert.equal(VARIANTS.length, 51); assert.equal(COSTUMES.length, proof.runtime.costumes);
assert.equal(COSTUME_ADDITION_SOURCES.length, expectedIds.length);
const published = new Set(offline.ART_FILES.map(file => file.replace(/^\.\.\//, '')));
const generationDir = path.join(root, 'docs/art-generation/cast-continuation-20261119');
const generations = new Map();
for (const name of (await fs.readdir(generationDir)).filter(name => name.endsWith('.json')).sort()) {
  const document = await json(path.join(generationDir, name));
  const entries = document.assets || document.entries || (document.file && document.slot ? [document] : []);
  for (const entry of entries) {
    const file = entry.relativePath || entry.file;
    if (!file?.startsWith('assets/encore/') || !entry.sha256 || !entry.slot || !entry.sourceURLs?.length) continue;
    if (generations.has(file)) assert.equal(generations.get(file).sha256, entry.sha256, `Conflicting art manifest: ${file}`);
    generations.set(file, { ...entry, manifest: 'docs/art-generation/cast-continuation-20261119/' + name });
  }
}
const assets = [];
for (const id of expectedIds) for (const slot of slots) {
  const file = ['selection', 'stance'].includes(slot) ? `assets/encore/${slot}/${id}.png` : `assets/encore/poses/${id}/${slot}.png`;
  const bytes = await fs.readFile(path.join(root, file)), record = generations.get(file);
  assert(record, `No generation record: ${file}`);
  assert.equal(digest(bytes), record.sha256, `Generation bytes changed: ${file}`);
  assert(published.has(file), `Absent from final offline manifest: ${file}`);
  assert(record.sourceURLs?.length, `No source URLs recorded: ${file}`);
  assets.push({ id, slot, file, sha256: record.sha256, bytes: bytes.length, generationManifest: record.manifest, published: true });
}
assert.equal(assets.length, expectedArtCount); assert.equal(new Set(assets.map(asset => asset.sha256)).size, assets.length);
const reviewedAssets = new Map(proof.inventory.assets.map(asset => [asset.file, asset]));
for (const asset of assets) {
  assert.equal(reviewedAssets.get(asset.file)?.sha256, asset.sha256, `Reviewed inventory differs: ${asset.file}`);
  assert.equal(reviewedAssets.get(asset.file)?.nativeCopyVerified, true, `No native-byte verification: ${asset.file}`);
}
assert.equal(proof.runtime.artFiles, offline.ART_FILES.length);
assert.equal(proof.runtime.artBytes, offline.ART_BYTES);
assert.equal(proof.runtime.artVersion, offline.ART_VERSION);
assert.equal(proof.runtime.offlineVersion, offline.OFFLINE_VERSION);
const expectedManifestHash = proof.runtime.manifestSha256;
assert.equal(digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))), expectedManifestHash);

const reviewFile = 'docs/art-generation/cast-continuation-20261119/workbook-review.json';
const sourceMap = new Map(COSTUME_ADDITION_SOURCES.map(source => [source.id, source]));
const newProduction = COSTUME_ADDITIONS.map(item => {
  const source = sourceMap.get(item.fidelity.sourceIds[0]);
  assert(source, `Missing official source: ${item.id}`);
  return [`CIRCUS26-${item.id}`, 'Tenue Circus', item.name, 'Portrait, garde et neuf poses', 'Implémenté', 'P1',
    `assets/encore/selection/${item.id}.png\nassets/encore/stance/${item.id}.png\nassets/encore/poses/${item.id}/`,
    `11 PNG individuels natifs inclus dans le manifeste du jeu. Portrait, garde, intro, attaque, attaque forte, impact, marche, saut, accroupi, victoire, défaite. Source : ${source.id}.`,
    `${source.scope} Poses et proportions adaptées au jeu ; animation et comparaison plan par plan de la série ouvertes.`, ''];
});
for (const row of newProduction) assert(!data.production.some(prior => prior[0] === row[0]), `Already appended: ${row[0]}`);
data.production.push(...newProduction);
const existingSources = new Set(data.sources.map(source => source.id));
for (const source of COSTUME_ADDITION_SOURCES) {
  assert(!existingSources.has(source.id), `Source already present: ${source.id}`);
  data.sources.push({ ...source, scope: source.scope + (source.imageUrl ? ` Image de référence : ${source.imageUrl}` : '') });
}
const offlineSourceIndex = data.sources.findIndex(source => source.id === 'offline');
assert(offlineSourceIndex >= 0, 'Missing offline source');
data.sources[offlineSourceIndex].scope = `${offline.ART_FILES.length.toLocaleString('fr-FR')} images dans le manifeste local, ${offline.ART_BYTES.toLocaleString('fr-FR')} octets. Inventaire final de cette continuation ; la publication distante est un contrôle séparé.`;

const newQa = [
  ['CAST26-art', 'Tenues Circus · Inventaire', `${additionCount} tenues complètes et sources officielles`, 'Réussi', 'P0', evidenceFile,
    `${assets.length} PNG individuels : ${additionCount} portraits, ${additionCount} gardes et ${additionCount * 9} actions. Empreintes natives, alpha et présence dans le manifeste vérifiés. Chaque tenue conserve onze dessins distincts.`,
    'La référence est un produit dérivé officiel stylisé. Aucun plan exact ni cycle animé complet n’est certifié.', ''],
  ['CAST26-canvas', 'Tenues Circus · Canvas natif', 'Composition des sources par le rendu de production', 'Réussi', 'P0', proof.canvas.file,
    proof.canvas.summary,
    'Canvas2D exécuté avec Node et Skia. Ce résultat ne valide ni le DOM, ni les entrées du navigateur, ni le son ou le matériel physique.', ''],
  ['CAST26-node', 'Tenues Circus · Code', 'Tests Node et constructions de cette passe', 'Réussi', 'P0', evidenceFile,
    `${proof.node.command} : ${proof.node.tests} tests réussis, aucun échec ni test ignoré. Journal : ${proof.node.log}.`,
    'Exécution datée de cette continuation. Les 399 tests de la passe précédente restent des preuves historiques distinctes. Aucun résultat navigateur déduit de Node.', ''],
  ['CAST26-browser', 'Tenues Circus · Navigateur', 'Tentative de lancement Chromium', 'Non exécuté', 'P0', proof.browser.file,
    `Lancement réellement tenté, bloqué avant navigation : ${proof.browser.failure}`,
    'Aucune assertion navigateur exécutée. Interactions, service worker, audio et périphériques physiques restent à vérifier.', ''],
  ['CAST26-workbook', 'Tenues Circus · Classeur', 'Ajout incrémental et conservation du suivi', 'Réussi', 'P0', 'scripts/update-combat-costume-workbook.mjs',
    `${additionCount} lignes Production et ${COSTUME_ADDITION_SOURCES.length} références ajoutées. Ordre, identifiants, notes, formules, tables et lignes QA antérieures préservés ; recalcul et réimport contrôlés.`,
    `Preuve : ${reviewFile}. Contrôle du classeur, distinct des tests du jeu et de la fidélité canonique.`, ''],
];
for (const row of newQa) assert(!data.qa.some(prior => prior[0] === row[0]), `Already appended: ${row[0]}`);
data.qa.push(...newQa);
data.costumeAdditionCoverage = {
  schema: 'encore-costume-addition-coverage/v1', asOf: '2026-11-19', ids: expectedIds,
  appearances: expectedIds.length, pngFiles: assets.length, bytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
  drawingsBySlot: Object.fromEntries(slots.map(slot => [slot, assets.filter(asset => asset.slot === slot).length])),
  publishedFiles: assets.filter(asset => asset.published).length, sourceIds: COSTUME_ADDITION_SOURCES.map(source => source.id), assets,
  scope: `${additionCount} tenues distinctes des 51 variantes historiques et des 378 costumes crossover. Références de produits officiels ; poses et proportions adaptées au jeu. Les ${data.characterCoverage.namedCharacterArtFiles.toLocaleString('fr-FR')} dessins de couverture historique restent comptés séparément.`,
  canonicalSceneComparisonComplete: false, fullAnimationCyclesComplete: false, evidence: evidenceFile,
};
data.costumeAdditionReview = { asOf: '2026-11-19', evidence: evidenceFile, workbookEvidence: reviewFile, qaRowIds: newQa.map(row => row[0]), browserAssertionsExecuted: 0 };
data.qaCampaigns ||= [];
if (!data.qaCampaigns.some(campaign => campaign.campaign === data.currentQa.campaign && campaign.evidence === data.currentQa.evidence)) data.qaCampaigns.push(structuredClone(data.currentQa));
data.currentQa = {
  gameVersion: data.version, campaign: 'cast-continuation-2026-11-19', complete: false,
  evidence: evidenceFile, workbookEvidence: reviewFile, rowIds: newQa.map(row => row[0]),
  totals: { nodeTests: proof.node.tests, nodePassed: proof.node.tests, browserAssertionsExecuted: 0 },
  scope: 'Tests Node, constructions, inventaire et Canvas natif exécutés ; suivi incrémental vérifié. Chromium bloqué avant navigation. Les résultats antérieurs restent dans leurs campagnes datées.',
};
data.historicalQaRows = data.qa.length - newQa.length;
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(row => row[3] === status).length]));
data.qaSummaryScope = 'Total des lignes historiques, objectifs et contrôles datés. La campagne CAST26 est séparée ; ces lignes ne constituent pas autant de tests indépendants exécutés à nouveau.';
data.contentAsOf = '2026-11-19';
Object.assign(data.counts, { fighters: FIGHTERS.length, variants: COSTUMES.length, archiveVariants: VARIANTS.length,
  costumeAdditions: COSTUME_ADDITIONS.length, production: data.production.length, qa: data.qa.length,
  offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES });
assert.deepEqual(data.characterCoverage, inputData.characterCoverage, 'Historical coverage must remain unchanged');

// Append only; the existing cells, including all user notes, are authoritative.
for (const [name, rows] of [['Production', newProduction], ['QA', newQa]]) {
  const sheet = workbook.worksheets.getItem(name), table = sheet.tables.items[0];
  const source = before[name].tables[0], width = source.headers.length;
  table.rows.add(null, rows.map(row => row.map(literal)));
  const widths = source.headers.map((_, i) => sheet.getRange(`${col(i + 1)}5`).format.columnWidth || 22);
  for (const [index, row] of rows.entries()) {
    const number = source.rows.length + index + 6;
    const range = sheet.getRange(`A${number}:${col(width)}${number}`);
    range.copyFrom(sheet.getRange(`A6:${col(width)}6`), 'all'); range.values = [row.map(literal)];
    range.format.fill = (source.rows.length + index) % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
    sheet.getRange(`${col(width)}${number}`).format.fill = '#FFF1C9';
    const lines = Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(12, widths[c] * 1.08))), 0)));
    range.format.rowHeight = Math.max(42, 13 * lines + 10);
  }
  const statusCol = name === 'Production' ? 'E' : 'D';
  const range = sheet.getRange(`${statusCol}${source.rows.length + 6}:${statusCol}${source.rows.length + rows.length + 5}`);
  range.dataValidation = { rule: { type: 'list', values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] } };
  for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Non exécuté', '#EAE7F1', '#56496D']]) range.conditionalFormats.add('containsText', { text, format: { fill, font: { color } } });
}
const references = workbook.worksheets.getItem('Références'), referenceTable = references.tables.items[0];
const newSourceRows = data.sources.slice(sourceRows.length).map(source => [source.id, source.title, source.kind, source.url, source.scope]);
const { appendWorkbookReferences } = await loadModule('scripts/combat-workbook-reference-rows.mjs');
appendWorkbookReferences(references, referenceTable, newSourceRows);
for (const [index, row] of newSourceRows.entries()) {
  const number = sourceRows.length + index + 6, range = references.getRange(`A${number}:E${number}`);
  range.copyFrom(references.getRange('A6:E6'), 'all'); range.values = [row];
  range.format.fill = (sourceRows.length + index) % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
  range.format.rowHeight = 70;
}
references.getRange(`E${offlineSourceIndex + 6}`).values = [[data.sources[offlineSourceIndex].scope]];

const summary = workbook.worksheets.getItem('Synthèse'), changedSummary = new Map();
const setSummaryValue = (cell, value) => { summary.getRange(cell).values = [[value]]; changedSummary.set(cell, { value }); };
const setSummaryFormula = (cell, formula) => { summary.getRange(cell).formulas = [[formula]]; changedSummary.set(cell, { formula }); };
const oldProductionEnd = before.Production.tables[0].rows.length + 5, newProductionEnd = data.production.length + 5;
const oldQaEnd = before.QA.tables[0].rows.length + 5, newQaEnd = data.qa.length + 5;
for (let r = 0; r < before['Synthèse'].formulas.length; r++) for (let c = 0; c < before['Synthèse'].formulas[r].length; c++) {
  const prior = before['Synthèse'].formulas[r][c]; if (!populated(prior)) continue;
  let next = prior.replace(new RegExp(`('Production'![A-Z]+\\$?6:[A-Z]+\\$?)${oldProductionEnd}(?=[,)])`, 'g'), `$1${newProductionEnd}`);
  next = next.replace(new RegExp(`('QA'![A-Z]+\\$?6:[A-Z]+\\$?)${oldQaEnd}(?=[,)])`, 'g'), `$1${newQaEnd}`);
  if (next !== prior) setSummaryFormula(`${col(c + 1)}${r + 1}`, next);
}
setSummaryFormula('B11', summary.getRange('B11').formulas[0][0] + `+COUNTIFS('Production'!B6:B${newProductionEnd},"Tenue Circus")`);
setSummaryFormula('H27', `=B7+B8+B9+COUNTIFS('Atlas'!C6:C184,"Variante visuelle")+COUNTIFS('Production'!B6:B${newProductionEnd},"Tenue Circus")&" fiches, hors tenues crossover"`);
setSummaryValue('H2', 'Version 0.7.0 · tenues au 19 novembre 2026');
setSummaryValue('H8', 'Tenues Circus et formes de série suivies en Production');
setSummaryValue('H13', `${proof.node.tests} tests Node de cette passe · Canvas natif revu`);
setSummaryValue('H14', 'Chromium bloqué au lancement ; aucune assertion');
setSummaryValue('H15', 'Historique conservé ; campagne CAST26 ajoutée dans QA');
setSummaryValue('H30', `${data.characterCoverage.completeFighterStaticSets + data.characterCoverage.completeVariantStaticSets} apparences d’archive + ${additionCount} tenues (${assets.length} PNG)`);
setSummaryValue('A22', 'Historique et contrôles datés');
workbook.recalculate();
assert.equal(summary.getRange('B11').values[0][0], COSTUMES.length);
assert.equal(summary.getRange('F16').values[0][0], data.production.length);
assert.equal(summary.getRange('F22').values[0][0], data.qa.length);
for (const [i, status] of ['Implémenté', 'Partiel', 'Prévu', 'À vérifier'].entries()) assert.equal(summary.getRange(`${col(i + 2)}16`).values[0][0], data.production.filter(row => row[4] === status).length);
for (const [i, status] of ['Réussi', 'Échec', 'Non exécuté', 'À vérifier'].entries()) assert.equal(summary.getRange(`${col(i + 2)}22`).values[0][0], data.qaSummary[status]);
const errorPattern = /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
let formulaCount = 0;
for (const name of names) {
  const range = workbook.worksheets.getItem(name).getUsedRange(), values = range.values;
  range.formulas.forEach((row, r) => row.forEach((formula, c) => { if (populated(formula)) { formulaCount++; assert(!errorPattern.test(String(values[r]?.[c] ?? '')), `Formula error: ${name}/${r + 1}/${c + 1}`); } }));
}
const firstProduction = before.Production.tables[0].rows.length + 6, firstQa = before.QA.tables[0].rows.length + 6;
const scopes = [
  ['Synthèse', 'A1:H35', 'summary'],
  ['QA', `A${firstQa}:I${firstQa + 2}`, 'qa-runtime'],
  ['QA', `A${firstQa + 3}:I${firstQa + 4}`, 'qa-browser-workbook'],
  ['Références', `A${offlineSourceIndex + 6}:E${offlineSourceIndex + 6}`, 'reference-offline'],
];
for (let index = 0; index < newProduction.length; index += 3) scopes.push(['Production', `A${firstProduction + index}:J${firstProduction + Math.min(index + 2, newProduction.length - 1)}`, `production-${index / 3 + 1}`]);
for (let index = 0; index < newSourceRows.length; index += 4) scopes.push(['Références', `A${sourceRows.length + index + 6}:E${sourceRows.length + Math.min(index + 3, newSourceRows.length - 1) + 6}`, `references-${index / 4 + 1}`]);
for (const scope of scopes) await render(...scope);
const xlsxPath = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
await (await SpreadsheetFile.exportXlsx(workbook)).save(xlsxPath);
const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
for (const name of names) {
  const sheet = reopened.worksheets.getItem(name), initial = before[name];
  const metadata = sheet.tables.items.map(table => ({ name: table.name, style: table.style, filter: table.showFilterButton }));
  assert.deepEqual(metadata, initial.tables.map(({ name, style, filter }) => ({ name, style, filter })), `Table metadata changed: ${name}`);
  if (TABLES[name]) {
    const actual = normal(sheet.tables.items[0].getDataRows());
    assert.deepEqual(actual, data[TABLES[name]], `Round-trip table differs: ${name}`);
    assert.deepEqual(actual.slice(0, initial.tables[0].rows.length), initial.tables[0].rows, `Existing rows changed: ${name}`);
    assert.equal(new Set(actual.map(row => row[0])).size, actual.length, `Duplicate ID: ${name}`);
  }
  for (let r = 0; r < initial.formulas.length; r++) for (let c = 0; c < initial.formulas[r].length; c++) {
    const address = `${col(c + 1)}${r + 1}`, prior = initial.formulas[r][c];
    if (populated(prior)) {
      const expected = name === 'Synthèse' && changedSummary.get(address)?.formula || prior;
      assert.equal(sheet.getRange(address).formulas[0][0], expected, `Formula changed: ${name}/${address}`);
    }
  }
  if (!['Synthèse', 'Production', 'QA', 'Références'].includes(name)) assert.deepEqual(normal(sheet.getUsedRange().values), normal(initial.values), `Unrelated sheet changed: ${name}`);
}
const reopenedReferences = reopened.worksheets.getItem('Références');
const expectedSourceRows = [...structuredClone(sourceRows), ...newSourceRows];
expectedSourceRows[offlineSourceIndex][4] = data.sources[offlineSourceIndex].scope;
assert.deepEqual(normal(reopenedReferences.tables.items[0].getDataRows()), expectedSourceRows);
const firstFooter = sourceRows.length + 6;
for (let row = firstFooter; row <= before['Références'].values.length; row++) {
  assert.deepEqual(normal(reopenedReferences.getRange(`A${row + newSourceRows.length}:E${row + newSourceRows.length}`).values)[0], normal([before['Références'].values[row - 1].slice(0, 5)])[0], `Reference footer lost: row ${row}`);
}
for (const [cell, expected] of changedSummary) {
  if (expected.value !== undefined) assert.equal(reopened.worksheets.getItem('Synthèse').getRange(cell).values[0][0], expected.value);
}
assert.equal(reopened.worksheets.getItem('Synthèse').getRange('B11').values[0][0], COSTUMES.length);
const dataBytes = JSON.stringify(data, null, 2) + '\n';
await fs.writeFile(path.join(outputDir, 'combat-tracker-data.json'), dataBytes);
const verification = {
  schema: 'encore-costume-workbook-review/v1', createdAt: new Date().toISOString(),
  inputWorkbookSHA256: digest(await fs.readFile(input)), inputDataSHA256: digest(await fs.readFile(dataPath)),
  workbookSHA256: digest(await fs.readFile(xlsxPath)), trackerDataSHA256: digest(dataBytes),
  builderSHA256: digest(await fs.readFile(path.join(root, 'scripts/update-combat-costume-workbook.mjs'))),
  executionEvidence: { file: evidenceFile, sha256: digest(await fs.readFile(path.join(root, evidenceFile))), hashesVerified: true, files: proof.evidenceHashes },
  counts: { sheets: names.length, nativeTables: names.reduce((sum, name) => sum + before[name].tables.length, 0),
    productionBefore: before.Production.tables[0].rows.length, productionAfter: data.production.length,
    qaBefore: before.QA.tables[0].rows.length, qaAfter: data.qa.length, sourcesBefore: sourceRows.length, sourcesAfter: data.sources.length,
    costumes: COSTUMES.length, fighters: FIGHTERS.length, archiveVariants: VARIANTS.length, newArtFiles: assets.length },
  originalRowsIdsOrderNotesPreserved: true, unrelatedSheetValuesPreserved: true, historicalCoverageUnchanged: true,
  existingReferenceEdits: [{ id: 'offline', cell: `Références!E${offlineSourceIndex + 6}`, previous: sourceRows[offlineSourceIndex][4], current: data.sources[offlineSourceIndex].scope }],
  sourceFooterPreserved: true, nativeTablesPreserved: true, formulas: { count: formulaCount, recalculated: true, errors: 0, exportRoundTripPassed: true },
  summaryChanges: [...changedSummary.entries()].map(([cell, change]) => ({ cell, ...change })),
  renderedViews: scopes.map(([sheet, range, file]) => ({ sheet, range, file: file + '.png' })),
  visualReview: { status: 'awaiting-review-of-rendered-views' },
  limitations: ['Only the workbook was authored and checked here; the root verification supplies separately dated runtime evidence.',
    'The historical 399-test result is preserved and is not counted as a new execution.',
    'No desktop Excel session, browser assertion, physical-device test, full animation or scene-by-scene canonical approval is claimed.'],
};
await fs.writeFile(path.join(outputDir, 'workbook-review.json'), JSON.stringify(verification, null, 2) + '\n');
console.log('COSTUME_WORKBOOK_UPDATED ' + JSON.stringify({ outputDir, counts: verification.counts, formulas: formulaCount, notesPreserved: true }));

async function loadRunProof(report) {
  assert.equal(report.schema, 'encore-cast-continuation-verification/v1');
  assert.equal(report.status, 'passed_with_browser_environment_limitation');
  assert.equal(report.runtime.fighters, 54); assert.equal(report.runtime.historicalVariants, 51);
  assert.equal(report.runtime.costumeAdditions, EXPECTED_ADDITIONS.length);
  assert.equal(report.runtime.costumes, report.runtime.historicalVariants + report.runtime.crossovers + report.runtime.costumeAdditions);
  const count = report.runtime.costumeAdditions, files = count * DRAWING_SLOTS.length;
  const evidenceHashes = {};
  const readEvidence = async (file, expected) => {
    const bytes = await fs.readFile(path.join(root, file)), sha256 = digest(bytes);
    if (expected) assert.equal(sha256, expected, `Evidence bytes differ: ${file}`);
    evidenceHashes[file] = sha256; return bytes;
  };
  for (const [file, expected] of Object.entries(report.sourceHashes)) await readEvidence(file, expected);
  const inventoryFile = 'docs/art-generation/cast-continuation-20261119/asset-inventory.json';
  const inventory = JSON.parse(await readEvidence(inventoryFile));
  assert.equal(inventory.schema, 'encore-costume-addition-inventory/v1');
  assert.deepEqual(report.newArtwork, inventory.counts);
  for (const key of ['files', 'uniqueHashes', 'nativeCopiesVerified', 'transparent', 'completeMargins']) assert.equal(inventory.counts[key], files, `Incomplete asset check: ${key}`);
  assert.equal(inventory.assets.length, files);
  const canvas = JSON.parse(await readEvidence(report.canvas.report, report.canvas.sha256));
  assert.equal(canvas.complete, true); assert.equal(canvas.partial, false); assert.equal(canvas.additionsOnly, true);
  assert.equal(canvas.counts.missing, 0); assert.equal(canvas.counts.appearances, count);
  assert.equal(canvas.counts.actions, count * 9); assert.equal(canvas.counts.stances, count); assert.equal(canvas.counts.portraits, count);
  for (const [file, expected] of Object.entries(canvas.sources)) await readEvidence(file, expected);
  const hashes = new Map(inventory.assets.map(asset => [asset.file, asset.sha256]));
  for (const asset of [...canvas.actions, ...canvas.stances, ...canvas.portraits]) {
    assert.equal(asset.rendered, true); assert.equal(asset.sha256, hashes.get(asset.file), `Canvas used other bytes: ${asset.file}`);
  }
  assert.equal(report.qa.exitCode, 0); assert.equal(report.qa.nodeFailed, 0);
  assert.equal(report.qa.nodeTests, report.qa.nodePassed);
  const journal = (await readEvidence(report.qa.log, report.qa.logSha256)).toString('utf8');
  const testCounts = {};
  for (const field of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
    const matches = [...journal.matchAll(new RegExp('^(?:#|ℹ) ' + field + ' (\\d+)\\s*$', 'gm'))];
    assert.equal(matches.length, 1, `Missing or ambiguous Node count: ${field}`);
    testCounts[field] = Number(matches[0][1]);
  }
  assert.equal(testCounts.tests, report.qa.nodeTests); assert.equal(testCounts.pass, report.qa.nodePassed);
  assert.equal(testCounts.fail + testCounts.cancelled + testCounts.skipped + testCounts.todo, 0);
  assert.deepEqual(report.builds.map(build => build.directory).sort(), ['dist', 'dist-combat']);
  for (const build of report.builds) { assert.equal(build.completed, true); assert.equal(build.newNativeImagesVerified, files); }
  const browserFile = 'docs/art-generation/cast-continuation-20261119/browser-attempt.json';
  const browser = JSON.parse(await readEvidence(browserFile));
  assert.deepEqual(report.browser, browser);
  assert.equal(browser.status, 'blocked_before_page_navigation');
  assert.equal(browser.executed, true); assert.equal(browser.browserAssertionsExecuted, 0);
  return {
    evidenceHashes, inventory,
    runtime: { artFiles: report.offline.illustrations, artBytes: report.offline.bytes, artVersion: report.offline.artVersion,
      offlineVersion: report.offline.version, manifestSha256: report.sourceHashes['combat/offline-manifest.mjs'], costumes: report.runtime.costumes },
    node: { command: report.qa.command, tests: report.qa.nodeTests, log: report.qa.log },
    canvas: { file: report.canvas.report, summary: `${canvas.counts.appearances} tenues : ${canvas.counts.actions} actions et ${canvas.counts.stances} gardes, ${canvas.counts.drawChecks} rendus dans les deux sens et ${canvas.counts.portraits} portraits. Aucun fichier manquant ; proportions et silhouettes revues.` },
    browser: { file: browserFile, failure: browser.failure },
  };
}

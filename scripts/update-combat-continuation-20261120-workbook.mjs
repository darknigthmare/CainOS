/**
 * Append the 20 November Circus appearances to the existing tracker.
 * Run a copy from a private temp directory with the primary artifact-tool runtime.
 * This is an incremental edit: all earlier IDs, rows, notes and evidence remain.
 * --inspect-only reads the baseline; --confirmed-runtime requires the final,
 * hash-linked verification.json. Outputs are review copies outside the input paths.
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
const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs', 'encore-continuation-workbook-20261120')));
const input = path.resolve(flag('--input-workbook', path.join(root, 'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
const dataPath = path.resolve(flag('--input-data', path.join(root, 'docs/combat-tracker-data.json')));
const INTRODUCED_ON = '2026-11-20';
const generationPath = 'docs/art-generation/cast-continuation-20261120';
const evidenceFile = generationPath + '/verification.json';
const builderFile = 'scripts/update-combat-continuation-20261120-workbook.mjs';
const DRAWING_SLOTS = Object.freeze(['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const loadModule = file => import(pathToFileURL(path.join(root, file)));
const populated = value => value !== '' && value !== null && value !== undefined;
const normal = rows => rows.map(row => row.map(value => value ?? ''));
const literal = value => typeof value === 'string' && value.startsWith('=') ? `'${value}` : value;
const phase = label => { globalThis.gc?.(); console.log('CONTINUATION_WORKBOOK_PHASE ' + JSON.stringify({ label, ...process.memoryUsage() })); };
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const TABLES = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const names = ['Synthèse', ...Object.keys(TABLES).filter(name => name !== 'QA'), 'Extension PNJ', 'QA', 'Références'];
if (args.includes('--verify-export')) { await verifyExport(); process.exit(0); }
let data = await json(dataPath);
let inputData = structuredClone({ costumeAdditionCoverage: data.costumeAdditionCoverage, costumeAdditionReview: data.costumeAdditionReview, characterCoverage: data.characterCoverage });
assert.notEqual(path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx'), input, 'Export to a review copy, never over the input workbook');
assert.notEqual(path.join(outputDir, 'combat-tracker-data.json'), dataPath, 'Export to a review copy, never over the input data');
phase('importing-baseline');
let workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
phase('baseline-imported');
let before = {};
for (const name of names) {
  const sheet = workbook.worksheets.getItem(name), used = sheet.getUsedRange();
  before[name] = {
    values: ['Production', 'QA'].includes(name) ? [] : structuredClone(used.values), formulas: structuredClone(used.formulas),
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
assert.equal(data.production.length, 3100, 'Expected the complete 19 November Production baseline');
assert.equal(data.qa.length, 2260, 'Expected the complete 19 November QA baseline');
assert.equal(sourceRows.length, 120, 'Expected the complete 19 November reference baseline');
assert.equal(names.reduce((sum, name) => sum + before[name].tables.length, 0), 10, 'Preserve all ten native tables');
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
  console.log('CONTINUATION_WORKBOOK_INSPECTED ' + JSON.stringify({ outputDir, introducedOn: INTRODUCED_ON, sheets: names.length, production: data.production.length, sources: data.sources.length, qa: data.qa.length,
    currentQa: { campaign: data.currentQa.campaign, rows: data.currentQa.rowIds.length },
    historicalCurrentQa: { campaign: data.historicalCurrentQa.campaign, totals: data.historicalCurrentQa.totals } }));
  process.exit(0);
}

// The final edit is gated on the completed runtime manifest and dated execution evidence.
assert(args.includes('--confirmed-runtime'), 'Wait for the final manifest/build confirmation, then pass --confirmed-runtime');
let evidence = await json(path.join(root, evidenceFile));
const [{ FIGHTERS, VARIANTS, COSTUMES }, { COSTUME_ADDITIONS, COSTUME_ADDITION_SOURCES }, offline] = await Promise.all([
  loadModule('combat/data.mjs'), loadModule('combat/costume-additions.mjs'), loadModule('combat/offline-manifest.mjs'),
]);
const additions = COSTUME_ADDITIONS.filter(item => item.introducedOn === INTRODUCED_ON);
const expectedIds = additions.map(item => item.id), slots = DRAWING_SLOTS;
assert(expectedIds.length > 0, 'No appearances in the requested dated wave');
assert.equal(new Set(COSTUME_ADDITIONS.map(item => item.id)).size, COSTUME_ADDITIONS.length, 'Duplicate runtime appearance ID');
assert(COSTUME_ADDITIONS.every(item => /^\d{4}-\d{2}-\d{2}$/.test(item.introducedOn)), 'Every added appearance must retain its introducedOn date');
let proof = await loadRunProof(evidence, expectedIds, COSTUME_ADDITIONS.length);
const additionCount = expectedIds.length, expectedArtCount = additionCount * slots.length;
assert.equal(FIGHTERS.length, 54); assert.equal(VARIANTS.length, 51); assert.equal(COSTUMES.length, proof.runtime.costumes);
const published = new Set(offline.ART_FILES.map(file => file.replace(/^\.\.\//, '')));
let preparation = await loadPreparationProof(evidence, expectedIds, published);
phase('runtime-and-pending-evidence-verified');
const pendingAppearances = preparation.appearances.filter(item => !item.completed);
const pendingCount = pendingAppearances.length;
const generationDir = path.join(root, generationPath);
const generations = new Map();
for (const name of (await fs.readdir(generationDir)).filter(name => name.endsWith('.json')).sort()) {
  const document = await json(path.join(generationDir, name));
  const entries = Array.isArray(document.assets) ? document.assets
    : Array.isArray(document.entries) ? document.entries : (document.file && document.slot ? [document] : []);
  for (const entry of entries) {
    const file = entry.relativePath || entry.file;
    if (!file?.startsWith('assets/encore/') || !entry.sha256 || !entry.slot || !entry.sourceURLs?.length) continue;
    if (generations.has(file)) assert.equal(generations.get(file).sha256, entry.sha256, `Conflicting art manifest: ${file}`);
    generations.set(file, { ...entry, manifest: generationPath + '/' + name });
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

const reviewFile = generationPath + '/workbook-review.json';
const sourceMap = new Map();
for (const source of COSTUME_ADDITION_SOURCES) {
  if (sourceMap.has(source.id)) assert.deepEqual(source, sourceMap.get(source.id), `Conflicting source definitions: ${source.id}`);
  else sourceMap.set(source.id, source);
}
for (const { definition: def } of pendingAppearances) {
  const source = {
    id: def.sourceId, title: def.sourceTitle, url: def.sourceUrl,
    ...(def.imageUrl ? { imageUrl: def.imageUrl } : {}), kind: def.sourceKind || 'Produit dérivé officiel',
    scope: def.scope + ' Référence consultée le 20 novembre 2026. ' +
      (def.sourceKind?.startsWith('Épisode')
        ? 'Les plans indiqués attestent les éléments décrits ; les poses originales ne constituent pas une reproduction image par image de la série.'
        : 'Ce produit stylisé ne certifie ni les proportions exactes de la série ni ses mouvements.'),
  };
  if (sourceMap.has(source.id)) assert.deepEqual(source, sourceMap.get(source.id), `Conflicting pending source: ${source.id}`);
  else sourceMap.set(source.id, source);
}
const waveSourceIds = [...new Set(additions.flatMap(item => item.fidelity.sourceIds))];
const allPlannedSourceIds = [...new Set([...waveSourceIds, ...pendingAppearances.map(item => item.definition.sourceId)])];
const waveSources = allPlannedSourceIds.map(id => {
  const source = sourceMap.get(id);
  assert(source && source.title && source.kind && source.url && source.scope, `Incomplete official reference: ${id}`);
  assert.equal(new URL(source.url).protocol, 'https:', `Unexpected reference protocol: ${id}`);
  return source;
});
const newProduction = additions.map(item => {
  const sources = item.fidelity.sourceIds.map(id => sourceMap.get(id));
  assert(sources.length > 0 && sources.every(Boolean), `Missing official source: ${item.id}`);
  return [`CIRCUS27-${item.id}`, 'Tenue Circus', item.name, 'Portrait, garde et neuf poses', 'Implémenté', 'P1',
    `assets/encore/selection/${item.id}.png\nassets/encore/stance/${item.id}.png\nassets/encore/poses/${item.id}/`,
    `11 PNG individuels natifs inclus dans le manifeste du jeu. Portrait, garde, intro, attaque, attaque forte, impact, marche, saut, accroupi, victoire, défaite. Sources : ${item.fidelity.sourceIds.join(', ')}.`,
    `${sources.map(source => source.scope).join(' ')} Poses adaptées au jeu ; animation et comparaison plan par plan de la série ouvertes.`, ''];
});
for (const item of pendingAppearances) {
  const source = sourceMap.get(item.definition.sourceId);
  newProduction.push([`CIRCUS27-${item.id}`, 'Apparence en préparation', item.definition.name,
    'Portrait, garde et neuf poses — en préparation', 'Partiel', 'P1',
    `${preparation.resumeFile}\n${preparation.inventoryFile}\n${generationPath}/pending-assets/${item.id}/`,
    `${item.presentSlots.length}/11 PNG natifs archivés, hors catalogue et pack du jeu. Présents : ${item.presentSlots.join(', ')}. Manquants : ${item.missingSlots.join(', ')}. Source : ${source.id}.`,
    `${source.scope} Génération interrompue par la limite imagegen ; prompts exacts et reçus conservés dans le plan de reprise. Aucun ensemble incomplet n’est déclaré jouable ou implémenté.`, '']);
}
for (const row of newProduction) assert(!data.production.some(prior => prior[0] === row[0]), `Already appended: ${row[0]}`);
data.production.push(...newProduction);
const existingSources = new Set(data.sources.map(source => source.id));
const appendedSources = waveSources.filter(source => !existingSources.has(source.id));
for (const source of appendedSources) {
  data.sources.push({ ...source, scope: source.scope + (source.imageUrl ? ` Image de référence : ${source.imageUrl}` : '') });
  existingSources.add(source.id);
}
const offlineSourceIndex = data.sources.findIndex(source => source.id === 'offline');
assert(offlineSourceIndex >= 0, 'Missing offline source');
data.sources[offlineSourceIndex].scope = `${offline.ART_FILES.length.toLocaleString('fr-FR')} images dans le manifeste local, ${offline.ART_BYTES.toLocaleString('fr-FR')} octets. Inventaire final de cette continuation ; la publication distante est un contrôle séparé.`;

const newQa = [
  ['CAST27-art', 'Apparences Circus · Inventaire', `${additionCount} apparences actives ; ${pendingCount} préparations suivies séparément`, 'Réussi', 'P0', evidenceFile,
    `${assets.length} PNG actifs : ${additionCount} portraits, ${additionCount} gardes et ${additionCount * 9} actions. Empreintes natives, alpha et présence dans le manifeste vérifiés. En préparation : ${preparation.assets.length} PNG archivés et ${preparation.missingJobs.length} poses manquantes, hors runtime.`,
    'Références d’épisodes ou de produits officiels selon chaque fiche. Les poses de combat sont des adaptations ; aucun cycle animé complet ni fidélité globale à chaque plan n’est certifié.', ''],
  ['CAST27-canvas', 'Apparences Circus · Canvas natif', 'Composition des sources par le rendu de production', 'Réussi', 'P0', proof.canvas.file,
    proof.canvas.summary,
    'Canvas2D exécuté avec Node et Skia. Ce résultat ne valide ni le DOM, ni les entrées du navigateur, ni le son ou le matériel physique.', ''],
  ['CAST27-node', 'Apparences Circus · Code', 'Tests Node et constructions de cette passe', 'Réussi', 'P0', evidenceFile,
    `${proof.node.command} : ${proof.node.tests} tests réussis, aucun échec ni test ignoré. Journal : ${proof.node.log}.`,
    'Exécution datée de cette continuation. Les résultats antérieurs restent des preuves historiques distinctes. Aucun résultat navigateur déduit de Node ni d’une CI exécutée sur un autre arbre.', ''],
  ['CAST27-browser', 'Apparences Circus · Navigateur', 'Tentative de lancement Chromium', 'Non exécuté', 'P0', proof.browser.file,
    `Lancement réellement tenté, bloqué avant navigation : ${proof.browser.failure}`,
    'Aucune assertion navigateur exécutée. Interactions, service worker, audio et périphériques physiques restent à vérifier.', ''],
  ['CAST27-workbook', 'Apparences Circus · Classeur', 'Ajout incrémental et conservation du suivi', 'Réussi', 'P0', builderFile,
    `${newProduction.length} lignes Production (${additionCount} Implémenté, ${pendingCount} Partiel) et ${appendedSources.length} références ajoutées. Ordre, identifiants, notes, formules, tables et lignes QA antérieures préservés ; recalcul et réimport contrôlés.`,
    `Preuve : ${reviewFile}. Contrôle du classeur, distinct des tests du jeu et de la fidélité canonique.`, ''],
];
for (const row of newQa) assert(!data.qa.some(prior => prior[0] === row[0]), `Already appended: ${row[0]}`);
data.qa.push(...newQa);
const previousCoverage = structuredClone(inputData.costumeAdditionCoverage);
const previousReview = structuredClone(inputData.costumeAdditionReview);
assert.equal(previousCoverage.asOf, '2026-11-19'); assert.equal(previousReview.asOf, '2026-11-19');
assert.equal(previousCoverage.appearances, 8); assert.equal(previousCoverage.assets.length, 88);
assert.deepEqual([...previousCoverage.ids].sort(), COSTUME_ADDITIONS.filter(item => item.introducedOn < INTRODUCED_ON).map(item => item.id).sort(), 'Historical additions differ from the preserved coverage');
for (const asset of previousCoverage.assets) {
  const bytes = await fs.readFile(path.join(root, asset.file));
  assert.equal(digest(bytes), asset.sha256, `Historical artwork changed: ${asset.file}`);
  assert.equal(bytes.length, asset.bytes, `Historical artwork size changed: ${asset.file}`);
  assert(published.has(asset.file), `Historical artwork removed from manifest: ${asset.file}`);
}
data.costumeAdditionHistory ||= [];
assert(!data.costumeAdditionHistory.some(item => item.coverage?.asOf === previousCoverage.asOf), 'The baseline coverage has already been archived');
data.costumeAdditionHistory.push({ coverage: previousCoverage, review: previousReview });
const cumulativeAssets = [...previousCoverage.assets, ...assets];
const cumulativeIds = [...previousCoverage.ids, ...expectedIds];
assert.equal(new Set(cumulativeIds).size, cumulativeIds.length, 'Appearance reused across dated waves');
assert.equal(new Set(cumulativeAssets.map(asset => asset.file)).size, cumulativeAssets.length, 'File reused across dated waves');
assert.deepEqual([...cumulativeIds].sort(), COSTUME_ADDITIONS.map(item => item.id).sort(), 'Cumulative coverage differs from the runtime');
data.costumeAdditionCoverage = {
  schema: 'encore-costume-addition-coverage/v1', asOf: INTRODUCED_ON, ids: cumulativeIds,
  appearances: cumulativeIds.length, pngFiles: cumulativeAssets.length, bytes: cumulativeAssets.reduce((sum, asset) => sum + asset.bytes, 0),
  drawingsBySlot: Object.fromEntries(slots.map(slot => [slot, cumulativeAssets.filter(asset => asset.slot === slot).length])),
  publishedFiles: cumulativeAssets.filter(asset => asset.published).length, sourceIds: [...new Set([...previousCoverage.sourceIds, ...waveSourceIds])], assets: cumulativeAssets,
  scope: `${cumulativeIds.length} apparences additionnelles, dont ${additionCount} dans la passe du 20 novembre, distinctes des ${VARIANTS.length} variantes historiques et des ${evidence.runtime.crossovers} costumes crossover. Épisodes ou produits officiels selon chaque source ; poses adaptées au jeu. Les ${data.characterCoverage.namedCharacterArtFiles.toLocaleString('fr-FR')} dessins de couverture historique restent comptés séparément.`,
  waves: [{ introducedOn: previousCoverage.asOf, ids: previousCoverage.ids, evidence: previousCoverage.evidence }, { introducedOn: INTRODUCED_ON, ids: expectedIds, evidence: evidenceFile }],
  canonicalSceneComparisonComplete: false, fullAnimationCyclesComplete: false, evidence: evidenceFile,
};
data.costumeAdditionReview = { asOf: INTRODUCED_ON, introducedOn: INTRODUCED_ON, ids: expectedIds, appearances: additionCount, evidence: evidenceFile, workbookEvidence: reviewFile, qaRowIds: newQa.map(row => row[0]), browserAssertionsExecuted: 0 };
assert(!data.costumeAdditionPreparation, 'Do not overwrite an earlier pending appearance register');
data.costumeAdditionPreparation = {
  asOf: INTRODUCED_ON, appearances: pendingCount, ids: pendingAppearances.map(item => item.id),
  pngFiles: preparation.assets.length, bytes: preparation.assets.reduce((sum, asset) => sum + asset.bytes, 0),
  missingFiles: preparation.missingJobs.length, assets: preparation.assets,
  entries: pendingAppearances.map(({ id, presentSlots, missingSlots, definition }) => ({ id, name: definition.name, sourceId: definition.sourceId, presentSlots, missingSlots })),
  generationResume: preparation.resumeFile, inventory: preparation.inventoryFile,
  runtimeIncluded: false, offlineIncluded: false, browserAssertionsExecuted: 0,
  scope: 'Dessins natifs archivés après interruption de la génération. Les ensembles restent incomplets, hors du catalogue actif et du pack hors ligne ; les poses à créer sont consignées sans duplication de fichiers existants.',
};
data.qaCampaigns ||= [];
if (!data.qaCampaigns.some(campaign => campaign.campaign === data.currentQa.campaign && campaign.evidence === data.currentQa.evidence)) data.qaCampaigns.push(structuredClone(data.currentQa));
data.currentQa = {
  gameVersion: data.version, campaign: 'cast-continuation-' + INTRODUCED_ON, complete: false,
  evidence: evidenceFile, workbookEvidence: reviewFile, rowIds: newQa.map(row => row[0]),
  totals: { nodeTests: proof.node.tests, nodePassed: proof.node.tests, browserAssertionsExecuted: 0 },
  scope: 'Tests Node, constructions, inventaire actif et Canvas natif exécutés ; suivi incrémental et reçus des préparations vérifiés séparément. Chromium bloqué avant navigation. Les résultats antérieurs restent dans leurs campagnes datées.',
};
data.historicalQaRows = data.qa.length - newQa.length;
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(row => row[3] === status).length]));
data.qaSummaryScope = 'Total des lignes historiques, objectifs et contrôles datés. La campagne CAST27 est séparée ; ces lignes ne constituent pas autant de tests indépendants exécutés à nouveau.';
data.contentAsOf = INTRODUCED_ON;
Object.assign(data.counts, { fighters: FIGHTERS.length, variants: COSTUMES.length, archiveVariants: VARIANTS.length,
  costumeAdditions: COSTUME_ADDITIONS.length, production: data.production.length, qa: data.qa.length,
  pendingCostumeAdditions: pendingCount, pendingCostumeArtFiles: preparation.assets.length,
  offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES });
assert.deepEqual(data.characterCoverage, inputData.characterCoverage, 'Historical coverage must remain unchanged');
assert.deepEqual(data.costumeAdditionHistory.at(-1), { coverage: inputData.costumeAdditionCoverage, review: inputData.costumeAdditionReview }, 'The complete previous addition coverage and review must remain archived');

// Append only; the existing cells, including all user notes, are authoritative.
phase('appending-tracker-rows');
for (const [name, rows] of [['Production', newProduction], ['QA', newQa]]) {
  const sheet = workbook.worksheets.getItem(name), table = sheet.tables.items[0];
  const source = before[name].tables[0], width = source.headers.length;
  // Extend the native table boundary without inserting worksheet rows. The
  // existing cells, row order and notes stay in place while only the tail grows.
  table.delete();
  phase('extending-' + name + '-boundary');
  sheet.getRange(`A${source.rows.length + 6}:${col(width)}${source.rows.length + rows.length + 5}`).values = rows.map(row => row.map(literal));
  phase('written-' + name + '-tail');
  const extendedTable = sheet.tables.add(`A5:${col(width)}${source.rows.length + rows.length + 5}`, true, source.name);
  extendedTable.style = source.style; extendedTable.showFilterButton = source.filter;
  phase('added-' + name);
  const appended = sheet.getRange(`A${source.rows.length + 6}:${col(width)}${source.rows.length + rows.length + 5}`);
  // Match the existing Arial body style and apply the new range rules once below.
  appended.format = { font: { name: 'Arial', size: 10, color: '#23243B' }, wrapText: true, verticalAlignment: 'center' };
  const widths = source.headers.map((_, i) => sheet.getRange(`${col(i + 1)}5`).format.columnWidth || 22);
  for (const [index, row] of rows.entries()) {
    const number = source.rows.length + index + 6;
    const range = sheet.getRange(`A${number}:${col(width)}${number}`);
    range.format.fill = (source.rows.length + index) % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
    sheet.getRange(`${col(width)}${number}`).format.fill = '#FFF1C9';
    const lines = Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(12, widths[c] * 1.08))), 0)));
    range.format.rowHeight = Math.max(42, 13 * lines + 10);
    globalThis.gc?.();
  }
  const statusCol = name === 'Production' ? 'E' : 'D';
  const range = sheet.getRange(`${statusCol}${source.rows.length + 6}:${statusCol}${source.rows.length + rows.length + 5}`);
  range.dataValidation = { rule: { type: 'list', values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] } };
  for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Non exécuté', '#EAE7F1', '#56496D']]) range.conditionalFormats.add('containsText', { text, format: { fill, font: { color } } });
  phase('formatted-' + name);
}
const references = workbook.worksheets.getItem('Références'), referenceTable = references.tables.items[0];
const newSourceRows = data.sources.slice(sourceRows.length).map(source => [source.id, source.title, source.kind, source.url, source.scope]);
if (newSourceRows.length) {
  const first = sourceRows.length + 6, last = before['Références'].values.length, shift = newSourceRows.length;
  for (let row = last; row >= first; row--) {
    const source = references.getRange(`A${row}:E${row}`), destination = references.getRange(`A${row + shift}:E${row + shift}`);
    const height = source.format.rowHeight;
    destination.copyFrom(source, 'all');
    if (height != null) destination.format.rowHeight = height;
  }
  references.getRange(`A${first}:E${first + shift - 1}`).clear();
  const source = before['Références'].tables[0];
  referenceTable.delete();
  references.getRange(`A${first}:E${first + shift - 1}`).values = newSourceRows.map(row => row.map(literal));
  const extendedTable = references.tables.add(`A5:E${first + shift - 1}`, true, source.name);
  extendedTable.style = source.style; extendedTable.showFilterButton = source.filter;
}
phase('added-References');
const referenceWidths = sourceRows[0].map((_, index) => references.getRange(`${col(index + 1)}5`).format.columnWidth || 22);
for (const [index, row] of newSourceRows.entries()) {
  const number = sourceRows.length + index + 6, range = references.getRange(`A${number}:E${number}`);
  range.format = { font: { name: 'Arial', size: 10, color: '#23243B' }, wrapText: true, verticalAlignment: 'center' };
  range.format.fill = (sourceRows.length + index) % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
  const lines = Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(12, referenceWidths[c] * 1.08))), 0)));
  range.format.rowHeight = Math.max(70, 13 * lines + 10);
  globalThis.gc?.();
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
// B11 and H27 already count Tenue Circus once. Only extend their existing ranges.
assert.equal((summary.getRange('B11').formulas[0][0].match(/"Tenue Circus"/g) || []).length, 1, 'B11 must count Circus additions exactly once');
setSummaryValue('H2', 'Version 0.7.0 · apparences au 20 novembre 2026');
setSummaryValue('H8', `${additionCount} nouvelles tenues actives ; ${pendingCount} préparations suivies`);
setSummaryValue('H13', `${proof.node.tests} tests Node de cette passe · Canvas natif revu`);
setSummaryValue('H14', 'Chromium bloqué au lancement ; aucune assertion');
setSummaryValue('H15', 'Historique conservé ; campagne CAST27 ajoutée dans QA');
setSummaryValue('H16', `${pendingCount} apparences en préparation · ${preparation.assets.length} PNG archivés`);
setSummaryValue('H30', `${data.characterCoverage.completeFighterStaticSets + data.characterCoverage.completeVariantStaticSets} apparences d’archive + ${cumulativeIds.length} tenues (${cumulativeAssets.length} PNG)`);
setSummaryValue('A22', 'Historique et contrôles datés');
workbook.recalculate();
phase('recalculated');
assert.equal(summary.getRange('B11').values[0][0], COSTUMES.length);
const fidelityCount = FIGHTERS.length + data.moves.length + data.stages.length + VARIANTS.length + COSTUME_ADDITIONS.length;
assert.equal(summary.getRange('H27').values[0][0], `${fidelityCount} fiches, hors tenues crossover`, 'Pending preparations must not increase active fidelity coverage');
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
const xlsxPath = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
let dataBytes = JSON.stringify(data, null, 2) + '\n';
const verificationDraft = {
  schema: 'encore-costume-workbook-review/v1', createdAt: new Date().toISOString(),
  inputWorkbookSHA256: digest(await fs.readFile(input)), inputDataSHA256: digest(await fs.readFile(dataPath)),
  workbookSHA256: null, trackerDataSHA256: digest(dataBytes),
  builderSHA256: digest(await fs.readFile(path.join(root, builderFile))), introducedOn: INTRODUCED_ON, appearanceIds: expectedIds, pendingAppearanceIds: pendingAppearances.map(item => item.id),
  executionEvidence: { file: evidenceFile, sha256: digest(await fs.readFile(path.join(root, evidenceFile))), hashesVerified: true, files: { ...proof.evidenceHashes, ...preparation.evidenceHashes } },
  counts: { sheets: names.length, nativeTables: names.reduce((sum, name) => sum + before[name].tables.length, 0),
    productionBefore: before.Production.tables[0].rows.length, productionAfter: data.production.length,
    qaBefore: before.QA.tables[0].rows.length, qaAfter: data.qa.length, sourcesBefore: sourceRows.length, sourcesAfter: data.sources.length,
    costumes: COSTUMES.length, fighters: FIGHTERS.length, archiveVariants: VARIANTS.length, fidelityRecords: fidelityCount,
    newAppearances: additionCount, costumeAdditions: cumulativeIds.length, newArtFiles: assets.length, cumulativeAdditionArtFiles: cumulativeAssets.length,
    pendingAppearances: pendingCount, pendingArtFiles: preparation.assets.length, pendingMissingFiles: preparation.missingJobs.length,
    newProductionImplemented: additionCount, newProductionPartial: pendingCount },
  originalRowsIdsOrderNotesPreserved: true, unrelatedSheetValuesPreserved: true, historicalCoverageUnchanged: true,
  previousAdditionCoverageAndReviewArchived: true,
  pendingArtworkPreservedSeparately: true,
  existingReferenceEdits: [{ id: 'offline', cell: `Références!E${offlineSourceIndex + 6}`, previous: sourceRows[offlineSourceIndex][4], current: data.sources[offlineSourceIndex].scope }],
  sourceFooterPreserved: true, nativeTablesPreserved: true, formulas: { count: formulaCount, recalculated: true, errors: 0, exportRoundTripPassed: false },
  summaryChanges: [...changedSummary.entries()].map(([cell, change]) => ({ cell, ...change })),
  renderedViews: scopes.map(([sheet, range, file]) => ({ sheet, range, file: file + '.png' })),
  visualReview: { status: 'awaiting-review-of-rendered-views' },
  limitations: ['Only the workbook was authored and checked here; the root verification supplies separately dated runtime evidence.',
    'Earlier local and remote test results are preserved under their original revisions and are not counted as this wave’s execution.',
    'No desktop Excel session, browser assertion, physical-device test, full animation or scene-by-scene canonical approval is claimed.'],
};

let checkpoint = { before, data, scopes, offlineSourceIndex, verificationDraft };
await fs.writeFile(path.join(outputDir, 'authoring-checkpoint.json'), JSON.stringify(checkpoint));
checkpoint = null;
dataBytes = null;
before = null; data = null; inputData = null; proof = null; preparation = null; evidence = null;
generations.clear();
phase('exporting-without-render-caches');
await (await SpreadsheetFile.exportXlsx(workbook)).save(xlsxPath);
phase('exported-awaiting-separate-verification');
console.log('CONTINUATION_WORKBOOK_EXPORTED ' + JSON.stringify({ outputDir, xlsxPath, next: '--verify-export' }));
process.exit(0);

async function verifyExport() {
  const { before, data, scopes, offlineSourceIndex, verificationDraft: verification } = await json(path.join(outputDir, 'authoring-checkpoint.json'));
  assert.equal(digest(await fs.readFile(input)), verification.inputWorkbookSHA256, 'Baseline workbook changed between export and verification');
  assert.equal(digest(await fs.readFile(dataPath)), verification.inputDataSHA256, 'Baseline tracker changed between export and verification');
  const xlsxPath = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
  const sourceRows = before['Références'].tables[0].rows;
  const newSourceRows = data.sources.slice(sourceRows.length).map(source => [source.id, source.title, source.kind, source.url, source.scope]);
  const changedSummary = new Map(verification.summaryChanges.map(({ cell, ...change }) => [cell, change]));
  phase('reimporting-export-in-new-process');
  const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  reopened.recalculate();
  phase('reimported-for-verification');
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
assert.equal(reopened.worksheets.getItem('Synthèse').getRange('B11').values[0][0], verification.counts.costumes);

  const errors = /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
  let formulaCount = 0;
  for (const name of names) {
    const used = reopened.worksheets.getItem(name).getUsedRange(), values = used.values;
    used.formulas.forEach((row, r) => row.forEach((formula, c) => {
      if (populated(formula)) {
        formulaCount++;
        assert(!errors.test(String(values[r]?.[c] ?? '')), `Export formula error: ${name}/${r + 1}/${c + 1}`);
      }
    }));
  }
  assert.equal(formulaCount, verification.formulas.count, 'Formula count changed during export');
  const comparison = path.join(outputDir, 'comparison-before-phase-split');
  await fs.mkdir(comparison, { recursive: true });
  for (const [sheetName, range, label] of scopes) {
    const imagePath = path.join(outputDir, label + '.png'), previousPath = path.join(comparison, label + '.png');
    try { await fs.access(previousPath); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      try { await fs.copyFile(imagePath, previousPath); }
      catch (missing) { if (missing.code !== 'ENOENT') throw missing; }
    }
    const image = await reopened.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(imagePath, new Uint8Array(await image.arrayBuffer()));
    phase('verified-render-' + label);
  }
  const dataBytes = JSON.stringify(data, null, 2) + '\n';
  assert.equal(digest(dataBytes), verification.trackerDataSHA256, 'Tracker checkpoint differs');
  await fs.writeFile(path.join(outputDir, 'combat-tracker-data.json'), dataBytes);
  verification.createdAt = new Date().toISOString();
  verification.workbookSHA256 = digest(await fs.readFile(xlsxPath));
  verification.formulas.exportRoundTripPassed = true;
  verification.memoryWorkflow = 'Author and export without rendering; reimport, verify and render in a separate primary-runtime process.';
  await fs.writeFile(path.join(outputDir, 'workbook-review.json'), JSON.stringify(verification, null, 2) + '\n');
  console.log('CONTINUATION_WORKBOOK_UPDATED ' + JSON.stringify({ outputDir, introducedOn: INTRODUCED_ON, counts: verification.counts, formulas: formulaCount, notesPreserved: true }));
}

async function loadPreparationProof(report, activeIds, published) {
  const planFile = generationPath + '/appearance-plan.json';
  const resumeFile = generationPath + '/generation-resume.json';
  const inventoryFile = generationPath + '/pending-artwork-inventory.json';
  const evidenceHashes = {};
  const read = async file => {
    const bytes = await fs.readFile(path.join(root, file)), sha256 = digest(bytes);
    assert.equal(report.sourceHashes[file], sha256, `Pending evidence is not pinned by verification: ${file}`);
    evidenceHashes[file] = sha256;
    return JSON.parse(bytes);
  };
  const plan = await read(planFile), resume = await read(resumeFile), inventory = await read(inventoryFile);
  assert.equal(plan.schema, 'encore-cast-continuation-plan/v1');
  assert.equal(plan.introducedOn, INTRODUCED_ON);
  assert.equal(inventory.schema, 'encore-pending-costume-inventory/v1');
  assert.equal(plan.generationBlock.httpStatus, 429);
  assert.equal(plan.generationBlock.type, 'usage_limit_reached');
  assert(Array.isArray(resume.appearances) && Array.isArray(resume.missingJobs), 'Missing resumable appearance or generation jobs');
  const appearances = resume.appearances;
  const ordered = values => [...values].sort();
  assert.equal(new Set(appearances.map(item => item.id)).size, appearances.length, 'Duplicate resume appearance ID');
  assert.deepEqual(ordered(appearances.map(item => item.id)), ordered(plan.appearances.map(item => item.id)));
  assert.equal(plan.plannedAppearances, appearances.length);
  assert.equal(plan.plannedFiles, appearances.length * DRAWING_SLOTS.length);
  assert.deepEqual(ordered(plan.activeIds), ordered(activeIds));
  assert.deepEqual(ordered(appearances.filter(item => item.completed).map(item => item.id)), ordered(activeIds));
  const fileProjection = item => ({ slot: item.slot, file: item.file, targetFile: item.targetFile ?? null, sha256: item.sha256, bytes: item.bytes });
  for (const item of appearances) {
    const planned = plan.appearances.find(entry => entry.id === item.id);
    assert.equal(item.definition.id, item.id);
    assert.equal(item.definition.introducedOn, INTRODUCED_ON);
    for (const key of ['fighterId', 'name', 'sourceId', 'sourceTitle', 'sourceUrl', 'imageUrl', 'sourceKind', 'traits', 'scope']) {
      assert.deepEqual(item.definition[key], planned[key], `Resume definition differs from plan: ${item.id}/${key}`);
    }
    assert.equal(item.state, planned.state);
    assert.equal(item.completed, item.state === 'active');
    assert.deepEqual(ordered(item.presentSlots), ordered(planned.availableSlots));
    assert.deepEqual(ordered(item.missingSlots), ordered(planned.missingSlots));
    assert.deepEqual(ordered([...item.presentSlots, ...item.missingSlots]), ordered(DRAWING_SLOTS), `Slots do not partition the appearance: ${item.id}`);
    assert.deepEqual(item.files.map(fileProjection).sort((a, b) => a.slot.localeCompare(b.slot)), planned.files.map(fileProjection).sort((a, b) => a.slot.localeCompare(b.slot)));
    assert.deepEqual(ordered(item.files.map(file => file.slot)), ordered(item.presentSlots));
    if (item.completed) assert.equal(item.missingSlots.length, 0);
    else assert(item.presentSlots.length > 0 && item.missingSlots.length > 0, `Partial row must describe actual progress and remaining work: ${item.id}`);
  }
  const pending = appearances.filter(item => !item.completed), assets = inventory.assets;
  assert.deepEqual(ordered(pending.map(item => item.id)), ordered(plan.pendingIds));
  assert.equal(inventory.counts.appearances, pending.length);
  assert.equal(inventory.counts.files, assets.length);
  assert.equal(plan.pendingFiles, assets.length);
  assert.equal(plan.activeFiles, activeIds.length * DRAWING_SLOTS.length);
  assert.equal(plan.generatedFiles, plan.activeFiles + plan.pendingFiles);
  assert.equal(plan.missingFiles, plan.plannedFiles - plan.generatedFiles);
  assert.equal(inventory.counts.missingFiles, plan.missingFiles);
  for (const key of ['uniqueHashes', 'nativeCopiesVerified', 'transparent', 'completeMargins']) assert.equal(inventory.counts[key], assets.length, `Incomplete pending check: ${key}`);
  assert.equal(new Set(assets.map(asset => asset.file)).size, assets.length, 'Duplicate pending file');
  assert.equal(new Set(assets.map(asset => asset.sha256)).size, assets.length, 'Duplicated pending drawing');
  assert.equal(assets.reduce((sum, asset) => sum + asset.bytes, 0), inventory.counts.bytes);
  assert.deepEqual(ordered([...new Set(assets.map(asset => asset.appearanceId))]), ordered(plan.pendingIds));
  const targetFor = (id, slot) => ['selection', 'stance'].includes(slot)
    ? `assets/encore/${slot}/${id}.png` : `assets/encore/poses/${id}/${slot}.png`;
  for (const asset of assets) {
    const appearance = pending.find(item => item.id === asset.appearanceId);
    const planned = appearance.files.find(file => file.slot === asset.slot);
    assert.deepEqual(fileProjection(asset), fileProjection(planned), `Pending inventory differs: ${asset.file}`);
    assert(asset.file.startsWith(generationPath + '/pending-assets/'), `Pending drawing is outside its archive: ${asset.file}`);
    assert.equal(asset.targetFile, targetFor(asset.appearanceId, asset.slot));
    assert.equal(asset.nativeCopyVerified, true);
    const bytes = await fs.readFile(path.join(root, asset.file));
    assert.equal(digest(bytes), asset.sha256); assert.equal(bytes.length, asset.bytes);
    assert(!published.has(asset.file) && !published.has(asset.targetFile), `Pending drawing leaked into the offline pack: ${asset.file}`);
    const activeExists = await fs.stat(path.join(root, asset.targetFile)).then(() => true, error => {
      if (error.code !== 'ENOENT') throw error; return false;
    });
    assert.equal(activeExists, false, `Pending drawing remains in active assets: ${asset.targetFile}`);
  }
  const expectedJobs = pending.flatMap(item => item.missingSlots.map(slot => item.id + '/' + slot));
  assert.deepEqual(ordered(resume.missingJobs.map(job => job.appearanceId + '/' + job.slot)), ordered(expectedJobs), 'Missing prompts do not match the exact pending slots');
  assert.equal(resume.missingJobs.length, plan.missingFiles);
  for (const job of resume.missingJobs) {
    assert(typeof job.prompt === 'string' && job.prompt.trim().length > 0, `Missing generation prompt: ${job.appearanceId}/${job.slot}`);
    assert(Array.isArray(job.referencePaths) && job.referencePaths.length > 0, `Missing references: ${job.appearanceId}/${job.slot}`);
    assert.equal(job.targetFile, targetFor(job.appearanceId, job.slot));
  }
  return { planFile, resumeFile, inventoryFile, evidenceHashes, appearances, assets, missingJobs: resume.missingJobs };
}

async function loadRunProof(report, expectedIds, totalAdditionCount) {
  assert.equal(report.schema, 'encore-cast-continuation-verification/v1');
  assert.equal(report.status, 'passed_with_browser_environment_limitation');
  assert.equal(report.runtime.fighters, 54); assert.equal(report.runtime.historicalVariants, 51);
  assert.equal(report.runtime.costumeAdditions, totalAdditionCount);
  assert.equal(report.runtime.costumes, report.runtime.historicalVariants + report.runtime.crossovers + report.runtime.costumeAdditions);
  const count = expectedIds.length, files = count * DRAWING_SLOTS.length;
  assert.equal(report.newArtwork.appearances, count, 'The new wave count must be distinct from total runtime additions');
  const reportedIds = report.newArtwork.ids ?? report.newArtwork.appearanceIds;
  assert(Array.isArray(reportedIds), 'verification.newArtwork.ids must identify the exact dated wave');
  assert.equal(new Set(reportedIds).size, count, 'Repeated or missing appearance IDs in verification');
  assert.deepEqual([...reportedIds].sort(), [...expectedIds].sort(), 'Verification IDs differ from the dated runtime wave');
  const evidenceHashes = {};
  const readEvidence = async (file, expected) => {
    const bytes = await fs.readFile(path.join(root, file)), sha256 = digest(bytes);
    if (expected) assert.equal(sha256, expected, `Evidence bytes differ: ${file}`);
    evidenceHashes[file] = sha256; return bytes;
  };
  for (const [file, expected] of Object.entries(report.sourceHashes)) await readEvidence(file, expected);
  const inventoryFile = generationPath + '/asset-inventory.json';
  const inventory = JSON.parse(await readEvidence(inventoryFile));
  assert.equal(inventory.schema, 'encore-costume-addition-inventory/v1');
  for (const [key, value] of Object.entries(inventory.counts)) assert.deepEqual(report.newArtwork[key], value, `Artwork count differs: ${key}`);
  for (const key of ['files', 'uniqueHashes', 'nativeCopiesVerified', 'transparent', 'completeMargins']) assert.equal(inventory.counts[key], files, `Incomplete asset check: ${key}`);
  assert.equal(inventory.assets.length, files);
  assert.equal(new Set(inventory.assets.map(asset => asset.file)).size, files, 'Repeated inventory file');
  assert.deepEqual([...new Set(inventory.assets.map(asset => asset.appearanceId))].sort(), [...expectedIds].sort(), 'Inventory IDs differ from the dated wave');
  assert.equal(inventory.assets.reduce((sum, asset) => sum + asset.bytes, 0), inventory.counts.bytes, 'Inventory byte total differs');
  for (const id of expectedIds) assert.deepEqual(inventory.assets.filter(asset => asset.appearanceId === id).map(asset => asset.slot).sort(), [...DRAWING_SLOTS].sort(), `Incomplete eleven-slot inventory: ${id}`);
  const canvas = JSON.parse(await readEvidence(report.canvas.report, report.canvas.sha256));
  assert.equal(canvas.complete, true); assert.equal(canvas.partial, false); assert.equal(canvas.additionsOnly, true);
  assert.equal(canvas.introducedOn, INTRODUCED_ON, 'Canvas must render the same dated wave');
  assert.equal(canvas.counts.missing, 0); assert.equal(canvas.counts.appearances, count);
  assert.equal(canvas.counts.actions, count * 9); assert.equal(canvas.counts.stances, count); assert.equal(canvas.counts.portraits, count);
  assert.equal(canvas.counts.drawChecks, count * 20);
  for (const [kind, expectedLength] of [['actions', count * 9], ['stances', count], ['portraits', count]]) {
    assert.equal(canvas[kind].length, expectedLength, `Canvas ${kind} records differ`);
    assert.deepEqual([...new Set(canvas[kind].map(asset => asset.id))].sort(), [...expectedIds].sort(), `Canvas ${kind} IDs differ`);
  }
  for (const [file, expected] of Object.entries(canvas.sources)) await readEvidence(file, expected);
  const hashes = new Map(inventory.assets.map(asset => [asset.file, asset.sha256]));
  for (const asset of [...canvas.actions, ...canvas.stances, ...canvas.portraits]) {
    assert.equal(asset.rendered, true); assert.equal(asset.sha256, hashes.get(asset.file), `Canvas used other bytes: ${asset.file}`);
  }
  for (const asset of [...canvas.actions, ...canvas.stances]) assert.equal(asset.bothFacings, true, `Both orientations not verified: ${asset.file}`);
  for (const asset of canvas.actions) assert.equal(asset.uniformScale, true, `Non-uniform action scaling: ${asset.file}`);
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
  const browserFile = generationPath + '/browser-attempt.json';
  const browser = JSON.parse(await readEvidence(browserFile));
  assert.deepEqual(report.browser, browser);
  assert.equal(browser.status, 'blocked_before_page_navigation');
  assert.equal(browser.sessionDate, INTRODUCED_ON, 'Do not reuse the preceding wave’s browser attempt');
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

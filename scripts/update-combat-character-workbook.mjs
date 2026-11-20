/**
 * Refresh the character artwork inventory without declaring canonical approval.
 * Run a copy from a private temp directory with the primary artifact-tool runtime.
 * Existing row order, user notes, formulas and native workbook tables are retained.
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
const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs', 'encore-character-coverage-20261119')));
const input = path.resolve(flag('--input-workbook', path.join(root, 'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
const dataPath = path.resolve(flag('--input-data', path.join(root, 'docs/combat-tracker-data.json')));
const researchPath = path.resolve(flag('--research', path.join(root, 'docs/combat-character-canon-research-2026-11-19.json')));
const mappingPath = path.resolve(flag('--mapping', path.join(root, 'docs/combat-character-canon-mapping-2026-11-19.json')));
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const populated = value => value !== '' && value !== null && value !== undefined;
const normal = rows => rows.map(row => row.map(value => value ?? ''));
const literal = value => typeof value === 'string' && value.startsWith('=') ? `'${value}` : value;
const same = (a, b) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '');
const loadModule = file => import(pathToFileURL(path.join(root, file)));
const TABLES = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const data = await json(dataPath);
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const names = ['Synthèse', ...Object.keys(TABLES).filter(name => name !== 'QA'), 'Extension PNJ', 'QA', 'Références'];
const before = {};
for (const name of names) {
  const sheet = workbook.worksheets.getItem(name), used = sheet.getUsedRange();
  before[name] = { values: structuredClone(used.values), formulas: structuredClone(used.formulas), tables: sheet.tables.items.map(table => ({ name: table.name, style: table.style, filter: table.showFilterButton, headers: table.getHeaderRowRange().values[0], rows: normal(table.getDataRows()) })) };
  if (TABLES[name]) {
    assert.equal(sheet.tables.items.length, 1, `Expected one table: ${name}`);
    const table = before[name].tables[0];
    assert.equal(table.headers.at(-1), 'Notes utilisateur');
    assert.deepEqual(table.rows.map(row => row[0]), data[TABLES[name]].map(row => row[0]), `JSON/workbook order differs: ${name}`);
    assert.equal(new Set(table.rows.map(row => row[0])).size, table.rows.length, `Duplicate ID: ${name}`);
    data[TABLES[name]] = structuredClone(table.rows);
  }
}
data.sources = before['Références'].tables[0].rows.map(([id, title, kind, url, scope]) => ({ id, title, kind, url, scope }));
await fs.mkdir(outputDir, { recursive: true });
const render = async (name, range, label) => {
  const image = await workbook.render({ sheetName: name, range, scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${label}.png`), new Uint8Array(await image.arrayBuffer()));
};
if (args.includes('--inspect-only')) {
  await render('Synthèse', 'A1:H35', 'before-summary');
  await render('Production', 'A6:J9', 'before-production');
  await render('Combattants', 'A18:O21', 'before-roster');
  console.log((await workbook.inspect({ kind: 'table', range: 'Synthèse!A6:F23', include: 'values,formulas', maxChars: 3500, tableMaxRows: 18, tableMaxCols: 6 })).ndjson);
  console.log('CHARACTER_WORKBOOK_INSPECTED ' + outputDir);
  process.exit(0);
}

const research = await json(researchPath), mappings = await json(mappingPath);
const [{ FIGHTERS, VARIANTS, ROSTER_ARCHIVE }, offline] = await Promise.all([loadModule('combat/data.mjs'), loadModule('combat/offline-manifest.mjs')]);
const published = new Set(offline.ART_FILES.map(file => file.replace(/^\.\.\//, '')));
const fighters = new Map(FIGHTERS.map(row => [row.id, row]));
const variants = new Map(VARIANTS.map(row => [row.id, row]));
const entityMap = new Map(research.entities.map(row => [row.entity_id, row]));
const entityForArchive = new Map();
for (const row of mappings.entityMappings) for (const id of row.archiveIds) if (!entityForArchive.has(id)) entityForArchive.set(id, { ...entityMap.get(row.entityId), mapping: row });
const variantMap = new Map(mappings.variantMappings.map(row => [row.variantId, row]));
const individualSlots = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat'];
const selectionGroups = {
  bestchildren: ['bestchildren-a', 'bestchildren-b'],
  mildenhallsouls: ['mildenhallsouls', 'mildenhallsouls-b', 'mildenhallsouls-c'],
  laughingshadows: ['laughingshadows', 'laughingshadows-b', 'laughingshadows-c'],
};
const roleLabels = { primary: 'Principal', secondary: 'Secondaire', tertiary: 'Tertiaire', variant: 'Variante', unverified: 'Archive à identifier', object_or_effect: 'Accessoire ou effet' };
const artwork = async (id, slot) => {
  const stem = ['selection', 'stance'].includes(slot) ? `assets/encore/${slot}/${id}` : `assets/encore/poses/${id}/${slot}`;
  for (const extension of ['webp', 'png']) {
    const relative = `${stem}.${extension}`;
    try { const bytes = await fs.readFile(path.join(root, relative)); return { path: relative, bytes: bytes.length, sha256: digest(bytes), published: published.has(relative) }; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return null;
};
const appearances = [];
for (const entry of ROSTER_ARCHIVE) {
  const isFighter = fighters.has(entry.id), isVariant = variants.has(entry.id);
  const source = entityForArchive.get(entry.id) || (isVariant ? entityForArchive.get(variants.get(entry.id).baseFighterId) : null);
  const objectOnly = !isFighter && !isVariant && ['prop', 'effect', 'projection'].includes(entry.archiveKind) && source?.suggested_game_role !== 'jumpscare_npc';
  const tier = isVariant ? 'variant' : objectOnly ? 'object_or_effect' : source?.production_tier || 'unverified';
  const required = isFighter || isVariant ? individualSlots : ['selection'];
  const assets = Object.fromEntries(await Promise.all(individualSlots.map(async slot => [slot, await artwork(entry.id, slot)])));
  // Mirror individual subjects within grouped gallery entries without inventing
  // name attribution or counting one archive card as several named characters.
  const selectionSubjects = selectionGroups[entry.id] || [entry.id];
  const selectionParts = await Promise.all(selectionSubjects.map(async id => ({ id, asset: id === entry.id ? assets.selection : await artwork(id, 'selection') })));
  const missingSelectionSubjects = selectionParts.filter(part => !part.asset).map(part => part.id);
  const unpublishedSelectionSubjects = selectionParts.filter(part => part.asset && !part.asset.published).map(part => part.id);
  assets.selection = missingSelectionSubjects.length ? null : selectionParts[0].asset;
  const missing = required.filter(slot => !assets[slot]);
  const unpublished = required.filter(slot => assets[slot] && (slot === 'selection' ? unpublishedSelectionSubjects.length : !assets[slot].published));
  const sourceEpisodes = source ? { firstAppearance: source.series_debut_episode, firstFullBody: source.first_full_body_episode, evidenceLevel: source.evidence_level, sourceUrl: source.source_url, episodeUrl: source.episode_url, visuallyVerified: false, note: source.notes || '' } : null;
  const status = !missing.length && !unpublished.length ? 'Implémenté' : required.length === missing.length && selectionParts.every(part => !part.asset) ? 'Prévu' : 'Partiel';
  const galleryStatus = !missingSelectionSubjects.length && !unpublishedSelectionSubjects.length ? 'Implémenté' : selectionParts.some(part => part.asset) ? 'Partiel' : 'Prévu';
  appearances.push({ id: entry.id, name: entry.name, tier, tierMeaning: 'Priorité de production du projet, non classement officiel de la série', runtimeCategory: isFighter ? 'fighter' : isVariant ? 'variant' : entry.archiveKind, coveragePurpose: isFighter || isVariant ? 'static_combat_drawings' : 'archive_gallery', baseFighterId: isVariant ? variants.get(entry.id).baseFighterId : null, sourceEntityId: source?.entity_id || null, sourceEpisodes, required, assets, selectionParts, missingSelectionSubjects, unpublishedSelectionSubjects, galleryStatus, present: required.length - missing.length, missing, unpublished, drawingCoverageStatus: status, canonicalVisualApproval: false, animationFramesComplete: false });
}
const appearanceMap = new Map(appearances.map(row => [row.id, row]));
const seriesCandidates = research.variant_candidates.map(row => {
  const mapping = variantMap.get(row.variant_id) || { archiveIds: [], confidence: 'unmapped', notes: '' };
  return { ...row, archiveIds: mapping.archiveIds, mappingConfidence: mapping.confidence, mappingNotes: mapping.notes, status: mapping.archiveIds.length ? 'Archive repérée, comparaison visuelle ouverte' : 'Référence visuelle à vérifier avant génération', countedAsNewCharacter: false };
});
const allArtwork = new Map(appearances.flatMap(row => [...Object.values(row.assets), ...row.selectionParts.map(part => part.asset)].filter(Boolean)).map(asset => [asset.path, asset]));
const totals = {
  archiveAppearances: appearances.length,
  fighters: FIGHTERS.length,
  archiveVariants: VARIANTS.length,
  researchEntities: research.entities.length,
  seriesFormCandidates: seriesCandidates.length,
  unmappedFormCandidates: seriesCandidates.filter(row => !row.archiveIds.length).length,
  namedCharacterArtFiles: allArtwork.size,
  publishedCharacterArtFiles: [...allArtwork.values()].filter(asset => asset.published).length,
  selectionImageFiles: appearances.reduce((sum, row) => sum + row.selectionParts.filter(part => part.asset).length, 0),
  completeGalleryEntries: appearances.filter(row => row.galleryStatus === 'Implémenté').length,
  drawingsBySlot: Object.fromEntries(individualSlots.map(slot => [slot, appearances.filter(row => row.assets[slot]).length])),
  completeFighterStaticSets: appearances.filter(row => row.runtimeCategory === 'fighter' && !row.missing.length && !row.unpublished.length).length,
  completeVariantStaticSets: appearances.filter(row => row.runtimeCategory === 'variant' && !row.missing.length && !row.unpublished.length).length,
  missingFighterDrawingSlots: appearances.filter(row => row.runtimeCategory === 'fighter').reduce((sum, row) => sum + row.missing.length, 0),
  missingVariantDrawingSlots: appearances.filter(row => row.runtimeCategory === 'variant').reduce((sum, row) => sum + row.missing.length, 0),
  missingSelectionSubjects: appearances.reduce((sum, row) => sum + row.missingSelectionSubjects.length, 0),
  tierCounts: Object.fromEntries(Object.keys(roleLabels).map(tier => [tier, appearances.filter(row => row.tier === tier).length])),
};
const matrix = { schema: 'encore-character-coverage/v1', asOf: '2026-11-19', sourceResearch: path.basename(researchPath), sourceMapping: path.basename(mappingPath), sourceResearchSha256: digest(await fs.readFile(researchPath)), sourceMappingSha256: digest(await fs.readFile(mappingPath)), scope: `Static illustration coverage and research inventory. A filled slot is not an animation cycle or a canonical 1:1 approval. The ${seriesCandidates.length} research forms include base states, props and review candidates; they are not ${seriesCandidates.length} missing characters.`, drawingContract: { fightersAndVariants: individualSlots, archiveOnly: ['selection'], heavy: 'Dedicated drawing target; a runtime fallback can remain valid without this drawing.', groupedEntries: selectionGroups, fileCounts: 'Distinct chosen artwork paths, including every separate subject of grouped gallery entries. Publication means inclusion in the local offline manifest, not a remote release.' }, totals, appearances, seriesCandidates, exclusions: research.out_of_series_or_uncertain };
if (args.includes('--inventory-only')) {
  await fs.writeFile(path.join(outputDir, 'combat-character-coverage-2026-11-19.json'), JSON.stringify(matrix, null, 2) + '\n');
  console.log('CHARACTER_INVENTORY_UPDATED ' + JSON.stringify({ outputDir, totals }));
  process.exit(0);
}

const upsert = (rows, row) => {
  const i = rows.findIndex(existing => existing[0] === row[0]);
  if (i < 0) rows.push(row);
  else { row[row.length - 1] = rows[i][rows[i].length - 1]; rows[i] = row; }
};
const production = new Map(data.production.map(row => [row[0], row]));
const poseTasks = { idle: 'stance', guard: 'stance', walk: 'walk', jump: 'jump', crouch: 'crouch', hurt: 'hit', light: 'attack', heavy: 'heavy', victory: 'victory' };
for (const row of data.roster) {
  const item = appearanceMap.get(row[0]);
  const poseList = Object.entries(item.assets).filter(([, value]) => value).map(([slot]) => slot).join(', ');
  row[14] = `Dessins individuels : ${poseList}. ${item.present}/${item.required.length} repères statiques. Animation image par image et comparaison canonique ouvertes.`;
  for (const [task, slot] of Object.entries(poseTasks)) {
    const tracked = production.get(`ART-${item.id}-${task}`), asset = item.assets[slot];
    if (!tracked || !asset) continue;
    tracked[6] = asset.path;
    tracked[7] = `Dessin individuel pour ${slot}. ${asset.published ? 'Présent dans le manifeste du jeu.' : 'Intégration au manifeste en attente.'} Les images de transition restent un travail distinct.`;
  }
}
for (const row of data.atlas) {
  const item = appearanceMap.get(row[0]);
  if (Object.values(item.assets).some(Boolean)) row[16] = `${item.present}/${item.required.length} dessins attendus. ${item.missing.length ? 'À produire : ' + item.missing.join(', ') + '.' : 'Repères statiques présents.'} Animation et comparaison canonique ouvertes.`;
}
for (const item of appearances) {
  const missingText = item.missing.length ? 'À produire : ' + item.missing.join(', ') + '.' : 'Repères statiques présents.';
  const groupText = item.selectionParts.length > 1 ? ` ${item.selectionParts.filter(part => part.asset).length}/${item.selectionParts.length} sujets de galerie dessinés séparément.` : '';
  const special = item.sourceEpisodes?.firstFullBody === null ? 'Corps complet non attesté par cette recherche. La silhouette du jeu reste une adaptation.' : 'Comparer les silhouettes aux plans primaires avant toute validation 1:1.';
  upsert(data.production, [`COV-${item.id}`, 'Couverture d’apparence', item.name, `${roleLabels[item.tier]} · ${item.coveragePurpose === 'archive_gallery' ? 'illustration de galerie' : 'dessins individuels'}`, item.drawingCoverageStatus, item.tier === 'primary' ? 'P0' : item.tier === 'secondary' || item.tier === 'variant' ? 'P1' : 'P2', 'docs/combat-character-coverage-2026-11-19.json', `${item.present}/${item.required.length} repères. ${missingText}${groupText}${item.unpublished.length ? ' Hors manifeste : ' + item.unpublished.join(', ') + '.' : ''}`, `${special} Un dessin statique ne constitue pas un cycle animé.`, '']);
}
for (const candidate of seriesCandidates) {
  const entity = entityMap.get(candidate.entity_id);
  upsert(data.production, [`SERIES-${candidate.variant_id}`, 'Revue des formes de série', entity?.name || candidate.entity_id, candidate.name, 'À vérifier', entity?.production_tier === 'primary' ? 'P1' : 'P2', candidate.episode_url || candidate.source_url, `${candidate.archiveIds.length ? 'Archive liée : ' + candidate.archiveIds.join(', ') : 'Aucun rapprochement certain avec une archive existante.'} Type : ${candidate.variant_kind}.`, `Identifier le plan exact puis comparer l’apparence. ${candidate.notes || ''} ${candidate.mappingNotes || ''}`.trim(), '']);
}
const sourceUrls = new Set(data.sources.map(source => source.url));
for (const entity of research.entities) if (!sourceUrls.has(entity.source_url)) {
  sourceUrls.add(entity.source_url);
  data.sources.push({ id: 'char-index-' + digest(entity.source_url).slice(0, 10), title: 'Index de personnages · ' + entity.name, kind: 'Index secondaire', url: entity.source_url, scope: 'Repérage textuel pour la couverture des personnages. Une entrée d’index ne certifie ni les sprites du jeu, ni une comparaison visuelle avec un plan officiel.' });
}
const qaId = 'CHARCOV26-workbook';
upsert(data.qa, [qaId, 'Classeur · Personnages', 'Couverture des dessins et conservation des lignes', 'Réussi', 'P0', 'scripts/update-combat-character-workbook.mjs', 'Inventaire des fichiers par identifiant, maintien des notes et formules, recalcul et réimport du classeur. Preuve : docs/combat-character-workbook-review-2026-11-19.json.', 'Ce contrôle concerne le suivi. Il ne remplace pas les essais du jeu ni la comparaison canonique.', '']);
// Import executed evidence only after matching its bytes and runtime hashes.
// The workbook does not turn native Canvas checks into browser execution.
const completionFile = 'docs/combat-character-verification-2026-11-19.json';
const evidenceDigests = {};
const evidenceJSON = async (file, expected) => {
  const bytes = await fs.readFile(path.join(root, file));
  const hash = digest(bytes);
  if (expected) assert.equal(hash, expected, 'Execution evidence changed: ' + file);
  evidenceDigests[file] = hash;
  return JSON.parse(bytes);
};
const execution = await evidenceJSON(completionFile);
assert.equal(execution.schema, 'encore-character-completion-verification/v1');
assert.equal(execution.runtime.ART_VERSION, offline.ART_VERSION);
assert.equal(execution.runtime.OFFLINE_VERSION, offline.OFFLINE_VERSION);
assert.equal(execution.runtime.ART_BYTES, offline.ART_BYTES);
assert.equal(execution.runtime.artFiles, offline.ART_FILES.length);
await Promise.all(Object.entries({ ...execution.runtimeSourceHashes, ...execution.testSourceHashes }).map(async ([file, expected]) => {
  assert.equal(digest(await fs.readFile(path.join(root, file))), expected, 'Executed source changed: ' + file);
}));
const [inventory, canvasEvidence, sceneEvidence] = await Promise.all([
  evidenceJSON(execution.inventory.file, execution.inventory.sha256),
  evidenceJSON(execution.productionCanvas.file, execution.productionCanvas.sha256),
  evidenceJSON(execution.expansionAndScenesCanvas.file, execution.expansionAndScenesCanvas.sha256),
]);
assert.equal(inventory.counts.namedCharacterArtFiles, totals.namedCharacterArtFiles);
assert.equal(inventory.counts.missingSlots, totals.missingFighterDrawingSlots + totals.missingVariantDrawingSlots + totals.missingSelectionSubjects);
assert.equal(inventory.files.length, allArtwork.size);
for (const asset of inventory.files) assert.equal(asset.sha256, allArtwork.get(asset.file)?.sha256, 'Inventory asset differs: ' + asset.file);
assert.equal(canvasEvidence.complete, true);
assert.equal(canvasEvidence.counts.missing, 0);
assert.equal(canvasEvidence.counts.actions, individualSlots.filter(slot => !['selection', 'stance'].includes(slot)).reduce((sum, slot) => sum + totals.drawingsBySlot[slot], 0));
assert.equal(canvasEvidence.counts.portraits, totals.selectionImageFiles);
for (const asset of [...canvasEvidence.actions, ...canvasEvidence.portraits]) {
  assert.equal(asset.rendered, true, 'Canvas evidence lacks rendered asset: ' + asset.file);
  assert.equal(asset.sha256, allArtwork.get(asset.file)?.sha256, 'Canvas asset differs: ' + asset.file);
}
for (const asset of sceneEvidence.images) {
  assert.equal(asset.decoded, true);
  assert.equal(asset.sha256, allArtwork.get(asset.file)?.sha256, 'Scene asset differs: ' + asset.file);
}
assert.ok(sceneEvidence.scenes.every(scene => scene.preload && scene.planes === 3));
const nodeEvidence = execution.nodeAndBuilds;
assert.equal(nodeEvidence.exitCode, 0);
assert.equal(nodeEvidence.tests, nodeEvidence.pass);
assert.equal(nodeEvidence.fail + nodeEvidence.cancelled + nodeEvidence.skipped + nodeEvidence.todo, 0);
const journalBytes = await fs.readFile(path.join(root, nodeEvidence.journal));
assert.equal(digest(journalBytes), nodeEvidence.journalSha256);
evidenceDigests[nodeEvidence.journal] = nodeEvidence.journalSha256;
for (const field of ['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo']) {
  const match = journalBytes.toString('utf8').match(new RegExp('^(?:#|ℹ) ' + field + ' (\\d+)\\s*$', 'm'));
  assert.equal(Number(match?.[1]), nodeEvidence[field], 'Node journal count differs: ' + field);
}
assert.equal(execution.browser.status, 'not_executed_in_this_session');
const evidenceRows = [
  ['CHARCOV26-inventory', 'Personnages · Inventaire', 'Tous les emplacements statiques attendus', 'Réussi', 'P0', execution.inventory.file, totals.namedCharacterArtFiles + ' fichiers : ' + totals.selectionImageFiles + ' portraits, ' + totals.drawingsBySlot.stance + ' gardes et ' + canvasEvidence.counts.actions + ' actions. Aucun emplacement manquant ; ' + inventory.counts.newPathsComparedWithBranchHead + ' nouveaux chemins et ' + inventory.counts.nativeGenerationHashMatches + ' empreintes natives rapprochées.', 'Le signal alpha 12 de Scratch/intro a été revu sur fond opaque sans défaut visible ; le PNG natif est conservé. Les dessins ne certifient pas une fidélité 1:1.', ''],
  ['CHARCOV26-canvas', 'Personnages · Canvas natif', 'Sources et proportions des actions et portraits', 'Réussi', 'P0', execution.productionCanvas.file, canvasEvidence.counts.appearances + ' apparences ; ' + canvasEvidence.counts.actions + ' actions, ' + canvasEvidence.counts.drawChecks + ' rendus dans les deux sens et ' + canvasEvidence.counts.portraits + ' portraits. Aucun fichier manquant.', 'Modules Canvas2D de production exécutés avec Node et Skia. Aucun DOM, navigateur, son, périphérique physique ou cycle animé complet validé par ce constat.', ''],
  ['CHARCOV26-scenes', 'Personnages · Scènes PNJ', 'Gardes, sélections et décors à trois plans', 'Réussi', 'P1', execution.expansionAndScenesCanvas.file, sceneEvidence.images.length + ' images de garde/sélection décodées et ' + sceneEvidence.scenes.length + ' scènes à trois plans. Planches et contact des scènes examinés.', 'Revue native des rendus ; les essais des interactions et de l’audio restent séparés.', ''],
  ['CHARCOV26-node', 'Code · Vérification finale', 'Tests Node et construction des deux distributions', 'Réussi', 'P0', completionFile, nodeEvidence.command + ' : ' + nodeEvidence.tests + ' tests réussis, aucun échec ni test ignoré ; ' + nodeEvidence.builds.join(' et ') + '. Journal : ' + nodeEvidence.journal + '.', 'Preuve du runtime figé, identifiée par ses empreintes et le manifeste. Cette commande ne lance pas les suites navigateur.', ''],
  ['CHARCOV26-browser', 'Navigateur · Passe finale', 'Campagne interactive du runtime final', 'Non exécuté', 'P0', completionFile, execution.browser.suiteConfigurations + ' configurations recensées ; ' + execution.browser.uniqueScriptsSyntaxChecked + ' scripts uniques contrôlés pour leur syntaxe. Exécution navigateur bloquée par la politique de l’environnement.', 'Aucun résultat navigateur de cette session n’est déclaré réussi. Les anciennes campagnes restent des preuves historiques.', ''],
];
for (const row of evidenceRows) upsert(data.qa, row);
data.characterCoverage = totals;
data.characterArtworkReview = { asOf: '2026-11-19', qaRowId: qaId, evidence: 'docs/combat-character-workbook-review-2026-11-19.json', canonicalComparisonComplete: false, fullAnimationCyclesComplete: false };
data.characterArtworkReview.completionEvidence = completionFile;
data.characterArtworkReview.browserExecuted = false;
data.currentQa.rowIds = [...new Set([...data.currentQa.rowIds, qaId, ...evidenceRows.map(row => row[0])])];
data.currentQa.characterCoverageEvidence = 'docs/combat-character-workbook-review-2026-11-19.json';
data.currentQa.characterCompletionEvidence = completionFile;
data.historicalQaRows = data.qa.length - data.currentQa.rowIds.length;
data.qaSummaryScope = 'Historique conservé ; contrôles du classeur et preuves Node/Canvas du 19 novembre. Les suites navigateur restent non exécutées pour cette passe.';
data.contentAsOf = '2026-11-19';
data.counts.production = data.production.length;
data.counts.qa = data.qa.length;
data.counts.offlineImages = offline.ART_FILES.length;
data.counts.offlineBytes = offline.ART_BYTES;
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(row => row[3] === status).length]));
const changes = [];
const allowedSheets = new Set(['Combattants', 'Atlas', 'Production', 'QA']);
for (const [name, key] of Object.entries(TABLES)) {
  const rows = data[key], source = before[name].tables[0], sheet = workbook.worksheets.getItem(name), table = sheet.tables.items[0];
  if (!allowedSheets.has(name)) { assert.deepEqual(rows, source.rows, `Unrelated data changed: ${name}`); continue; }
  assert.deepEqual(rows.slice(0, source.rows.length).map(row => row[0]), source.rows.map(row => row[0]), `Existing order changed: ${name}`);
  assert.equal(new Set(rows.map(row => row[0])).size, rows.length, `Duplicate ID: ${name}`);
  const width = source.headers.length;
  if (rows.length > source.rows.length) table.rows.add(null, rows.slice(source.rows.length).map(row => row.map(literal)));
  const widths = source.headers.map((_, i) => sheet.getRange(`${col(i + 1)}5`).format.columnWidth || 22);
  for (let i = 0; i < rows.length; i++) {
    const range = sheet.getRange(`A${i + 6}:${col(width)}${i + 6}`);
    let changed = i >= source.rows.length;
    if (changed) {
      range.copyFrom(sheet.getRange(`A6:${col(width)}6`), 'all');
      range.values = [rows[i].map(literal)];
      range.format.fill = i % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
      sheet.getRange(`${col(width)}${i + 6}`).format.fill = '#FFF1C9';
    } else for (let c = 0; c < width - 1; c++) if (!same(rows[i][c], source.rows[i][c])) {
      assert(!populated(before[name].formulas[i + 5]?.[c]), `Refusing to overwrite formula ${name}/${rows[i][0]}/${c}`);
      sheet.getRange(`${col(c + 1)}${i + 6}`).values = [[literal(rows[i][c])]];
      changes.push({ sheet: name, id: rows[i][0], column: c + 1 }); changed = true;
    }
    if (changed) {
      const lines = Math.max(1, ...rows[i].map((value, c) => String(value ?? '').split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(12, widths[c] * 1.08))), 0)));
      const height = Math.max(29, 13 * lines + 8);
      if (i >= source.rows.length || height > (range.format.rowHeight || 29)) range.format.rowHeight = height;
    }
  }
  if (rows.length > source.rows.length) {
    const statusCol = name === 'Production' ? 'E' : 'D';
    const range = sheet.getRange(`${statusCol}${source.rows.length + 6}:${statusCol}${rows.length + 5}`);
    range.dataValidation = { rule: { type: 'list', values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] } };
    for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D']]) range.conditionalFormats.add('containsText', { text, format: { fill, font: { color } } });
  }
}
const references = workbook.worksheets.getItem('Références'), refTable = references.tables.items[0];
const refCount = before['Références'].tables[0].rows.length;
const { appendWorkbookReferences } = await loadModule('scripts/combat-workbook-reference-rows.mjs');
const addedSources = data.sources.slice(refCount).map(source => [source.id, source.title, source.kind, source.url, source.scope]);
appendWorkbookReferences(references, refTable, addedSources);
for (let i = 0; i < addedSources.length; i++) {
  const range = references.getRange(`A${refCount + i + 6}:E${refCount + i + 6}`);
  range.copyFrom(references.getRange('A6:E6'), 'all'); range.values = [addedSources[i]]; range.format.rowHeight = 92;
}

const summary = workbook.worksheets.getItem('Synthèse');
summary.getRange('H2').values = [['Version 0.7.0 · personnages au 19 novembre 2026']];
summary.getRange('H8').values = [['Dessins et formes de série suivis dans Production']];
summary.getRange('H16').values = [['Dessins, animation et fidélité suivis séparément.']];
summary.getRange('H29').values = [[`${totals.fighters} combattants · ${totals.archiveVariants} variantes d’archive`]];
summary.getRange('H30').values = [[`${totals.completeFighterStaticSets + totals.completeVariantStaticSets} kits complets · ${totals.namedCharacterArtFiles.toLocaleString('fr-FR')} dessins de personnages`]];
const oldProductionEnd = before.Production.tables[0].rows.length + 5, newProductionEnd = data.production.length + 5;
const oldQaEnd = before.QA.tables[0].rows.length + 5, newQaEnd = data.qa.length + 5;
for (let r = 0; r < before['Synthèse'].formulas.length; r++) for (let c = 0; c < before['Synthèse'].formulas[r].length; c++) {
  const prior = before['Synthèse'].formulas[r][c];
  if (!populated(prior)) continue;
  let next = prior.replace(new RegExp(`('Production'![A-Z]+\\$?6:[A-Z]+\\$?)${oldProductionEnd}(?=[,)])`, 'g'), `$1${newProductionEnd}`);
  next = next.replace(new RegExp(`('QA'![A-Z]+\\$?6:[A-Z]+\\$?)${oldQaEnd}(?=[,)])`, 'g'), `$1${newQaEnd}`);
  if (next !== prior) summary.getRange(`${col(c + 1)}${r + 1}`).formulas = [[next]];
}
workbook.recalculate();
assert.equal(summary.getRange('F16').values[0][0], data.production.length, 'Production summary does not include appended rows');
assert.equal(summary.getRange('F22').values[0][0], data.qa.length, 'QA summary does not include appended rows');
for (const [i, status] of ['Implémenté', 'Partiel', 'Prévu', 'À vérifier'].entries()) assert.equal(summary.getRange(`${col(i + 2)}16`).values[0][0], data.production.filter(row => row[4] === status).length, `Production status total differs: ${status}`);
const temporaryRow = data.production.findIndex(row => row[0] === 'COV-pomni') + 6;
const stateCell = workbook.worksheets.getItem('Production').getRange(`E${temporaryRow}`), oldStatus = stateCell.values[0][0], oldImplemented = summary.getRange('B16').values[0][0];
stateCell.values = [[oldStatus === 'Implémenté' ? 'Prévu' : 'Implémenté']]; workbook.recalculate();
assert.equal(summary.getRange('B16').values[0][0], oldImplemented + (oldStatus === 'Implémenté' ? -1 : 1));
stateCell.values = [[oldStatus]]; workbook.recalculate();
assert.equal(summary.getRange('B16').values[0][0], oldImplemented);
const errorPattern = /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
let formulas = 0;
for (const name of names) {
  const range = workbook.worksheets.getItem(name).getUsedRange(), values = range.values;
  range.formulas.forEach((row, r) => row.forEach((formula, c) => { if (populated(formula)) { formulas++; assert(!errorPattern.test(String(values[r]?.[c] ?? '')), `Formula error: ${name}/${r + 1}/${c + 1}`); } }));
}
const coverageRow = data.production.findIndex(row => row[0].startsWith('COV-')) + 6;
const seriesRow = data.production.findIndex(row => row[0].startsWith('SERIES-')) + 6;
const qaRow = data.qa.findIndex(row => row[0] === qaId) + 6;
const scopes = [['Synthèse', 'A1:H35', 'summary'], ['Combattants', 'A18:O21', 'roster'], ['Atlas', 'A6:S8', 'atlas'], ['Production', `A${coverageRow}:J${coverageRow + 3}`, 'coverage'], ['Production', `A${seriesRow}:J${seriesRow + 3}`, 'series'], ['QA', `A${qaRow - 1}:I${qaRow}`, 'qa']];
scopes[scopes.length - 1] = ['QA', 'A' + qaRow + ':I' + (qaRow + 2), 'qa'];
scopes.push(['QA', 'A' + (qaRow + 3) + ':I' + (qaRow + 5), 'qa-current-runtime']);
for (const spec of scopes) await render(...spec);
const xlsxPath = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
await (await SpreadsheetFile.exportXlsx(workbook)).save(xlsxPath);
const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
for (const name of names) {
  const sheet = reopened.worksheets.getItem(name), initial = before[name];
  const metadata = sheet.tables.items.map(table => ({ name: table.name, style: table.style, filter: table.showFilterButton }));
  assert.deepEqual(metadata, initial.tables.map(({ name, style, filter }) => ({ name, style, filter })), `Native table metadata changed: ${name}`);
  if (TABLES[name]) {
    const actual = normal(sheet.tables.items[0].getDataRows());
    assert.deepEqual(actual, data[TABLES[name]], `Round-trip table differs: ${name}`);
    const sourceRows = initial.tables[0].rows;
    assert.deepEqual(actual.slice(0, sourceRows.length).map(row => row[0]), sourceRows.map(row => row[0]), `Lost order: ${name}`);
    for (let i = 0; i < sourceRows.length; i++) assert.deepEqual(actual[i].at(-1), sourceRows[i].at(-1), `Lost note: ${name}/${sourceRows[i][0]}`);
  }
  if (name !== 'Synthèse') {
    for (let r = 0; r < initial.formulas.length; r++) for (let c = 0; c < initial.formulas[r].length; c++) if (populated(initial.formulas[r][c])) assert.equal(sheet.getRange(`${col(c + 1)}${r + 1}`).formulas[0][0], initial.formulas[r][c], `Lost existing formula: ${name}/${r + 1}/${c + 1}`);
  }
  if (!allowedSheets.has(name) && !['Synthèse', 'Références'].includes(name)) assert.deepEqual(normal(sheet.getUsedRange().values), normal(initial.values), `Unrelated sheet changed: ${name}`);
}
const dataBytes = JSON.stringify(data, null, 2) + '\n';
const matrixBytes = JSON.stringify(matrix, null, 2) + '\n';
const verification = { schema: 'encore-character-workbook-review/v1', createdAt: new Date().toISOString(), inputWorkbookSHA256: digest(await fs.readFile(input)), inputDataSHA256: digest(await fs.readFile(dataPath)), workbookSHA256: digest(await fs.readFile(xlsxPath)), trackerDataSHA256: digest(dataBytes), coverageSHA256: digest(matrixBytes), counts: data.counts, characterCoverage: totals, formulas: { count: formulas, recalculated: true, errors: 0, statusChangeRecalculated: true, exportRoundTripPassed: true }, nativeTables: names.reduce((sum, name) => sum + before[name].tables.length, 0), sheets: names.length, originalIdsAndOrderPreserved: true, userNotesAndFormulasPreserved: true, unrelatedSheetValuesPreserved: true, modifiedCells: changes, renderedViews: scopes.map(([sheet, range]) => ({ sheet, range })), releaseReviewed: false, fullCiExecuted: false, canonicalVisualApproval: false, limitations: ['Only the workbook and file inventory were verified here.', 'Canonical image comparison and animation cycles remain separate production tasks.', 'No desktop Excel or physical-device session is claimed.'] };
verification.gameVersion = data.version;
verification.runtimeManifest = { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) };
verification.generatorSHA256 = digest(await fs.readFile(path.join(root, 'scripts/update-combat-character-workbook.mjs')));
verification.completionEvidence = { file: completionFile, inputs: evidenceDigests, hashesVerifiedAgainstCurrentFiles: true, qaRowIds: evidenceRows.map(row => row[0]) };
verification.limitations[0] = 'Workbook and file inventory rebuilt; dated Node/Canvas execution evidence imported after checking its hashes, not rerun by this generator.';
await fs.writeFile(path.join(outputDir, 'combat-tracker-data.json'), dataBytes);
await fs.writeFile(path.join(outputDir, 'combat-character-coverage-2026-11-19.json'), matrixBytes);
await fs.writeFile(path.join(outputDir, 'combat-character-workbook-review-2026-11-19.json'), JSON.stringify(verification, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, 'combat-workbook-verification.json'), JSON.stringify(verification, null, 2) + '\n');
console.log('CHARACTER_COVERAGE_UPDATED ' + JSON.stringify({ outputDir, totals, production: data.production.length, qa: data.qa.length, formulas, notesPreserved: true }));

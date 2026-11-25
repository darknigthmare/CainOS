/**
 * Preserve the current tracker while adding only requested static base sprites.
 * Native XLSX reading is separate; all workbook writing uses the existing
 * public Artifact API builder. No action-pose debt is assigned to baseOnly.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/queenie_tracker_20261125')));
const final = args.includes('--final');
const folder = 'docs/art-generation/base-sprites-20261125-b';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
const xlsxName = 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx';
if (args.includes('--freeze')) {
  const directory = path.join(output, 'baseline'); await fs.mkdir(directory, { recursive: true });
  const files = {};
  for (const name of [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json', 'combat-qa-evidence-0.7.0.json']) {
    const bytes = await fs.readFile(path.join(root, 'docs', name)), sha256 = hash(bytes);
    const destination = path.join(directory, name);
    try { assert.equal(hash(await fs.readFile(destination)), sha256, 'Baseline changed: ' + name); }
    catch (error) { if (error.code !== 'ENOENT') throw error; await fs.writeFile(destination, bytes); }
    files['docs/' + name] = { bytes: bytes.length, sha256 };
  }
  const frozenData = await json(path.join(directory, 'combat-tracker-data.json'));
  assert.equal(frozenData.counts.variants, 508);
  assert.equal(frozenData.production.some(row => row[0].startsWith('BASE36-')), false,
    'The recovered 32-PNG lot must not already be included in this baseline');
  await writeJson(path.join(output, 'baseline-freeze.json'), {
    schema: 'encore-tracker-static-base-baseline/v1', createdAt: new Date().toISOString(), files,
    scope: 'Published 508-costume tracker before recovered lot A and continuation B. Preserve all existing notes, IDs, order and historical evidence.',
  });
  console.log(JSON.stringify({ phase: 'baseline-frozen', variants: 508 })); process.exit(0);
}
const baseline = await json(path.join(output, 'baseline-freeze.json'));
for (const [file, record] of Object.entries(baseline.files)) assert.equal(hash(await fs.readFile(path.join(output, 'baseline', path.basename(file)))), record.sha256, file);
const before = await json(path.join(output, 'baseline/combat-tracker-data.json'));
assert.equal(before.counts.variants, 508);
if (args.includes('--render-baseline')) {
  const { FileBlob, SpreadsheetFile } = await import('@oai/artifact-tool');
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(path.join(output, 'baseline', xlsxName)));
  const featureRow = before.features.findIndex(r => r[0] === 'PRE-03') + 6;
  const scopes = [
    ['Synthèse', 'A1:H18', 'baseline-summary-top'],
    ['Synthèse', 'A19:H35', 'baseline-summary-bottom'],
    ['Fonctionnalités', 'A' + featureRow + ':I' + featureRow, 'baseline-costumes-feature'],
    ['Production', 'A' + (before.production.length + 4) + ':J' + (before.production.length + 5), 'baseline-production'],
    ['QA', 'A' + (before.qa.length + 4) + ':I' + (before.qa.length + 5), 'baseline-qa'],
    ['Références', 'A' + (before.sources.length + 3) + ':E' + (before.sources.length + 10), 'baseline-references'],
  ];
  const inspected = await wb.inspect({ kind: 'workbook,sheet,table', maxChars: 6000, tableMaxRows: 2, tableMaxCols: 5, tableMaxCellChars: 75 });
  await fs.writeFile(path.join(output, 'baseline-inspection.ndjson'), inspected.ndjson);
  for (const [sheetName, range, name] of scopes) {
    const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(output, name + '.png'), new Uint8Array(await blob.arrayBuffer()));
    globalThis.gc?.(); console.log(JSON.stringify({ phase: name, rss: process.memoryUsage().rss }));
  }
  await writeJson(path.join(output, 'baseline-render-scopes.json'), scopes);
  process.exit(0);
}
assert(args.includes('--prepare'), 'Choose --render-baseline or --prepare [--final].');

const moduleAt = file => import(pathToFileURL(path.join(root, file)).href);
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const address = c => col(c[1]) + c[0];
const position = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref.replaceAll('$', '')); assert(m); return [Number(m[2]), [...m[1]].reduce((v, c) => v * 26 + c.charCodeAt(0) - 64, 0)]; };
const tableKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const baselineHashes = Object.fromEntries(Object.entries(baseline.files).map(([file, record]) => [file, record.sha256]));
for (const [file, expected] of Object.entries(baselineHashes)) assert.equal(hash(await fs.readFile(path.join(root, file))), expected, 'Installed baseline changed: ' + file);
const native = await json(path.join(output, 'native-baseline/manifest.json'));
assert.equal(native.sha256, baselineHashes['docs/' + xlsxName]);
assert.equal(native.sheets.length, 11);
assert.equal(native.sheets.reduce((n, s) => n + s.cells, 0), 91743);
const sheets = new Map(), baselineSnapshotHashes = {};
for (const file of ['manifest.json', ...native.sheets.map(s => s.file)]) baselineSnapshotHashes[file] = hash(await fs.readFile(path.join(output, 'native-baseline', file)));
for (const entry of native.sheets) sheets.set(entry.name, await json(path.join(output, 'native-baseline', entry.file)));
const sourceSheets = structuredClone([...sheets]);
const data = structuredClone(before);
const [runtime, baseSprites, offline, stories, abstractions, projectiles] = await Promise.all([
  'combat/data.mjs', 'combat/base-sprite-content.mjs', 'combat/offline-manifest.mjs',
  'combat/stories.mjs', 'combat/abstractions-content.mjs', 'combat/projectile-art.mjs',
].map(moduleAt));
const { FIGHTERS, COSTUMES, BASE_SPRITE_COSTUMES, STAGES } = runtime;
const { BASE_SPRITE_ART_SLOTS, BASE_SPRITE_DEFINITIONS, BASE_SPRITE_SOURCES } = baseSprites;
const expectedOfficials = ['bunnyjax', 'maidribbit', 'ghostlyvacuum', 'mingtrophy', 'disappearingguymicrophone'];
const originalSeries = ['murderdrones', 'metarunner', 'sunsetparadise', 'gaslightdistrict', 'knightsofguinevere', 'gameoverse', 'lackadaisy', 'smg4', 'ultrajumpmania'];
const expectedOriginals = originalSeries.flatMap(series => ['hommage', 'resident', 'fusion'].map(style => `glitch-${series}-queenie-${style}`));
const lotAIds = new Set([...expectedOfficials, ...expectedOriginals.slice(0, 9)]);
const expectedIds = new Set([...expectedOfficials, ...expectedOriginals]);
const definitions = BASE_SPRITE_DEFINITIONS.filter(d => expectedIds.has(d.id));
const originals = definitions.filter(d => d.crossover), officials = definitions.filter(d => !d.crossover);
assert.equal(definitions.length, 32); assert.equal(originals.length, 27); assert.equal(officials.length, 5);
assert.deepEqual(new Set(officials.map(d => d.id)), new Set(expectedOfficials));
assert.deepEqual(new Set(originals.map(d => d.id)), new Set(expectedOriginals));
assert.equal(BASE_SPRITE_DEFINITIONS.length, 56); assert.equal(BASE_SPRITE_COSTUMES.length, 56);
assert.deepEqual([...BASE_SPRITE_ART_SLOTS], ['selection', 'stance']);
assert.equal(FIGHTERS.length, 64); assert.deepEqual(FIGHTERS.map(f => f.id), before.roster.map(r => r[0]));
const fighterName = id => FIGHTERS.find(f => f.id === id)?.name || id;
const evidenceHashes = {};
async function evidence(file) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Evidence must be repo-relative');
  const bytes = await fs.readFile(path.join(root, file)); evidenceHashes[file] = hash(bytes);
  return file.endsWith('.json') ? JSON.parse(bytes) : bytes;
}
// The old ordered catalog is preserved exactly. Its receipts remain historical.
const oldIntegration = await evidence('docs/art-generation/base-sprites-20261124/integration-baseline.json');
const oldStaticIds = [...before.baseSpriteContinuation.originalCrossoverAppearances, ...before.baseSpriteContinuation.officialAppearances];
const oldCostumeIds = [...oldIntegration.costumeIds, ...oldStaticIds];
assert.equal(oldCostumeIds.length, 508);
assert.deepEqual(COSTUMES.slice(0, 508).map(c => c.id), oldCostumeIds);
assert.deepEqual(BASE_SPRITE_DEFINITIONS.slice(0, 24).map(d => d.id), oldStaticIds);
assert.deepEqual(COSTUMES.slice(508).map(c => c.id), definitions.map(d => d.id));
assert.equal(COSTUMES.length, 540);
const verificationFile = flag('--verification', folder + '/verification.json');
const proof = final ? await evidence(verificationFile) : null;
if (final) {
  assert(proof.qa && proof.qa.tests > 0); assert.equal(proof.qa.pass, proof.qa.tests);
  assert.equal(proof.qa.fail, 0); assert.equal(proof.qa.skipped, 0); assert.equal(proof.qa.bothBuildsPassed, true);
  assert(Object.keys(proof.combatSourceHashes || {}).length > 0, 'Current source hashes required');
  assert(Object.keys(proof.qaSourceHashes || {}).length > 0, 'Executed test source hashes required');
  for (const [file, sha256] of Object.entries({ ...proof.combatSourceHashes, ...proof.qaSourceHashes })) assert.equal(hash(await fs.readFile(path.join(root, file))), sha256, 'Frozen runtime or test changed: ' + file);
  for (const [file, sha256] of Object.entries(proof.evidenceHashes || {})) { await evidence(file); assert.equal(evidenceHashes[file], sha256, 'QA evidence changed: ' + file); }
  for (const result of [...Object.values(proof.builds), proof.canvas.bases, proof.canvas.projectiles]) {
    await evidence(result.report); assert.equal(evidenceHashes[result.report], result.reportSHA256, result.report);
  }
  assert.equal(proof.canvas.bases.pass, true); assert.equal(proof.canvas.bases.appearances, 32);
  assert.equal(proof.canvas.sourceHashesCurrent, true);
  assert.equal(proof.browser.localAssertions, 0); assert.equal(proof.browser.localStatus, 'not_executed');
}
const inventoryFile = proof?.assetInventory || flag('--inventory', folder + '/asset-inventory.json');
const inventory = await evidence(inventoryFile);
if (final) assert.equal(evidenceHashes[inventoryFile], proof.assetInventorySHA256);
assert.equal(inventory.complete, true); assert.equal(inventory.assets.length, 72);
const byFile = new Map(inventory.assets.map(asset => [asset.file, asset]));
assert.equal(byFile.size, 72);
const published = new Set(offline.ART_FILES), assetChecks = [];
const reviews = new Set();
async function checkedAsset(id, slot, file, kind) {
  const receipt = byFile.get(file); assert(receipt, 'Missing native receipt: ' + file);
  assert.equal(receipt.nativeBytesVerified, true, 'Native copy not proven: ' + file);
  assert.equal(receipt.id, id); assert.equal(receipt.slot, slot);
  assert(receipt.reviewPath, 'Missing visual review path: ' + file);
  if (!reviews.has(receipt.reviewPath)) { await evidence(receipt.reviewPath); reviews.add(receipt.reviewPath); }
  assert(published.has('../' + file), 'Not published: ' + file);
  const bytes = await fs.readFile(path.join(root, file)), sha256 = hash(bytes);
  assert.equal(sha256, receipt.sha256, file); assert.equal(bytes.length, receipt.bytes, file);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
  const record = { id, slot, file, sha256, bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), nativeBytesVerified: true, published: true, kind, reviewPath: receipt.reviewPath, evidence: inventoryFile };
  assetChecks.push(record); return record;
}
for (const def of definitions) {
  assert.equal(def.baseOnly, true); assert.equal(def.presentation, 'static');
  assert.deepEqual([...def.authoredSlots], ['selection', 'stance']); assert.equal(def.assetReview.status, 'verified-base-files');
  for (const slot of BASE_SPRITE_ART_SLOTS) {
    const record = await checkedAsset(def.id, slot, def.directory.replace(/^\.\.\//, '') + '/' + slot + '.png', 'static-base');
    assert.equal(def.assetReview.sha256[slot], record.sha256, record.file); record.baseOnly = true;
  }
}
const projectileOwners = { 'queenie-royal': 'queenie', 'ribbit-lily': 'ribbit', 'kaufmo-ball': 'kaufmo', 'ming-star': 'ming', 'ghostly-wisp': 'ghostly', 'orbsman-orb': 'orbsman', 'oyster-pearl': 'oyster', 'abel-program': 'abel' };
for (const [id, owner] of Object.entries(projectileOwners)) {
  const spec = projectiles.PROJECTILE_ART[id]; assert(spec); assert.equal(projectiles.NPC_PROJECTILE_ART[owner].motif, id);
  const file = spec.src.replace(/^\.\.\//, '');
  const receipt = byFile.get(file); assert(receipt);
  const record = await checkedAsset(id, receipt.slot, file, 'projectile'); record.owner = owner;
}
const historicalProjectileAssets = [];
for (const row of before.production.filter(r => r[0].startsWith('ABS34-projectile-'))) {
  const id = row[0].slice('ABS34-projectile-'.length), sha256 = row[7].match(/SHA-256 : ([a-f0-9]{64})/)?.[1];
  assert(sha256); assert.equal(projectiles.PROJECTILE_ART[id]?.src, '../' + row[6]);
  const bytes = await fs.readFile(path.join(root, row[6])); assert.equal(hash(bytes), sha256, 'Historical projectile changed: ' + id);
  assert(published.has('../' + row[6])); historicalProjectileAssets.push({ id, file: row[6], sha256, bytes: bytes.length });
}
assert.equal(historicalProjectileAssets.length, 15);
assert.deepEqual(new Set(Object.keys(projectiles.PROJECTILE_ART)), new Set([...historicalProjectileAssets.map(asset => asset.id), ...Object.keys(projectileOwners)]));
assert.equal(assetChecks.length, 72); assert.equal(new Set(assetChecks.map(a => a.sha256)).size, 72);
const baseAssets = assetChecks.filter(a => a.kind === 'static-base');
const officialAssets = baseAssets.filter(a => expectedOfficials.includes(a.id));
const originalAssets = baseAssets.filter(a => expectedOriginals.includes(a.id));
const projectileAssets = assetChecks.filter(a => a.kind === 'projectile');
assert.equal(baseAssets.length, 64); assert.equal(officialAssets.length, 10); assert.equal(originalAssets.length, 54); assert.equal(projectileAssets.length, 8);
const addedBytes = assetChecks.reduce((n, a) => n + a.bytes, 0);
assert.equal(offline.ART_FILES.length, before.counts.offlineImages + 72);
assert.equal(offline.ART_BYTES, before.counts.offlineBytes + addedBytes);
const artStatus = 'Implémenté', qaStatus = final ? 'Réussi' : 'À vérifier';
const sourceIds = new Set(before.sources.map(s => s.id)), newSources = [];
const declaredSources = new Set(definitions.map(d => d.sourceId).filter(Boolean));
for (const source of BASE_SPRITE_SOURCES.filter(s => declaredSources.has(s.id))) {
  if (sourceIds.has(source.id)) continue;
  assert(source.url && source.title && source.kind && source.scope, 'Incomplete declared source: ' + source.id);
  newSources.push({ id: source.id, title: source.title, kind: source.kind, url: source.url, scope: source.scope }); sourceIds.add(source.id);
}
for (const def of definitions) assert(def.sourceId && sourceIds.has(def.sourceId), 'Every new family requires a declared reference record: ' + def.id);
data.sources.push(...newSources);
const seriesIds = [...new Set(originals.map(d => d.crossover.series))];
assert.deepEqual(new Set(seriesIds), new Set(originalSeries));
const productionRows = [];
for (const def of definitions) {
  const filePrefix = def.directory.replace(/^\.\.\//, '');
  const rowPrefix = lotAIds.has(def.id) ? 'BASE36' : 'BASE37';
  const moduleFile = lotAIds.has(def.id) ? 'combat/base-sprite-continuation-20261125.mjs' : 'combat/base-sprite-continuation-20261125-b.mjs';
  const evidenceText = `${def.sourceKind} ; ${def.sourceUrl}\nRevue des dessins : ${[...new Set(baseAssets.filter(a => a.id === def.id).map(a => a.reviewPath))].join(' / ')}`;
  productionRows.push([def.crossover ? 'COST-' + def.id : rowPrefix + '-family-' + def.id, def.crossover ? 'Costume crossover' : 'Tenue Circus', fighterName(def.fighterId) + ' · ' + def.name, 'Portrait et garde statiques', artStatus, 'P1', moduleFile + ' · ' + filePrefix, evidenceText, 'Deux bases attendues et présentes : sélection et garde. Neuf poses d’action hors périmètre ; les états utilisent cette garde sans animation. ' + (def.staticConstraint || 'Conserver le dessin et ses proportions. Kit et collision du combattant conservés.'), '']);
  for (const slot of BASE_SPRITE_ART_SLOTS) {
    const asset = baseAssets.find(a => a.id === def.id && a.slot === slot);
    productionRows.push([rowPrefix + '-asset-' + def.id + '-' + slot, 'Dessin de base', fighterName(def.fighterId) + ' · ' + def.name, slot === 'selection' ? 'Portrait de sélection' : 'Garde statique', artStatus, 'P1', asset.file, `PNG natif : ${asset.width} × ${asset.height} px · ${asset.bytes} octets\nSHA-256 : ${asset.sha256}\nRevue : ${asset.reviewPath}`, slot === 'selection' ? 'Cadrage du portrait relu dans sa référence et sa famille. Cette ligne ne promet aucune pose d’action.' : 'Dessin fixe commun aux états du costume ; proportions et accessoires conservés. Aucun cycle animé à livrer pour cette famille.', '']);
  }
}
for (const asset of projectileAssets) productionRows.push([(['queenie-royal', 'ribbit-lily', 'kaufmo-ball', 'ming-star'].includes(asset.id) ? 'BASE36' : 'BASE37') + '-projectile-' + asset.id, 'Projectile illustré', fighterName(asset.owner), asset.id, artStatus, 'P1', asset.file, `PNG natif : ${asset.width} × ${asset.height} px · ${asset.bytes} octets\nSHA-256 : ${asset.sha256}\nRevue : ${asset.reviewPath}`, 'Motif dédié au projectile existant. Trajectoire, collisions et réflexion appartiennent au kit conservé ; accessoire original pour Encore, sans pouvoir canonique supplémentaire ni cycle animé dessiné.', '']);
assert.equal(productionRows.length, 104); data.production.push(...productionRows);
const storyChanges = [];
for (const def of abstractions.ABSTRACTION_DEFS) {
  const panel = stories.STORY_ROUTES[def.id].epilogue.at(-1);
  assert.equal(panel.stageId, 'training'); assert.equal(panel.composition, 'solo'); assert.equal(panel.id, def.id + '-epilogue-3');
  const row = data.production.find(r => r[0] === 'ABS34-panel-' + panel.id); assert(row);
  storyChanges.push({ rowId: row[0], fighterId: def.id, previousText: row[7], stageId: panel.stageId, composition: panel.composition });
  row[7] = panel.summary + '\nComposition : ' + panel.composition + ' · Arène : ' + STAGES.find(s => s.id === panel.stageId).name;
  assert.equal(stories.STORY_ROUTES[def.id].chapters.at(-1).stageId, 'abstractionthreshold', 'Playable final encounter remains unchanged');
}
assert.equal(storyChanges.length, 10);
const updatedFeatures = {
  'PRE-03': { 5: 'combat/data.mjs · combat/base-sprite-content.mjs · combat/base-sprite-continuation-20261125-b.mjs · combat/crossovers.mjs', 6: '540 tenues équipables : 52 variantes d’archive, 56 tenues Circus et 432 crossovers dans neuf collections. Les 56 familles de base statiques possèdent chacune un portrait et une garde.', 7: 'Les 508 apparences publiées et le préfixe local de 522 conservent leur ordre. Ribbit et Queenie couvrent les neuf séries et trois styles. Les 38 autres PNJ promus et les dix abstractions restent sans tenue crossover ; les fusions sont originales.' },
  'PRD-11': { 5: 'combat/fidelity.mjs / combat/costume-fidelity.mjs / combat/base-sprite-content.mjs / combat/base-sprite-continuation-20261125-b.mjs', 6: 'Documenter 64 combattants, 640 techniques, 36 arènes (27 partagées et neuf crossovers), 52 variantes d’archive, 56 tenues Circus et 432 crossovers avec leurs références.', 7: 'Les deux lots ajoutent cinq apparences issues de vues officielles et 27 crossovers originaux de Queenie. Chaque famille demande deux bases statiques. Références visibles et créations originales restent distinctes ; aucune certification graphique 1:1.' },
  'INT-11': { 6: 'Télécharger ' + offline.ART_FILES.length + ' illustrations (' + offline.ART_BYTES + ' octets) à la demande puis jouer sans réseau. Un pack incomplet après éviction reste incomplet si sa réparation échoue.' },
  'PRE-BASE-35': { 5: 'combat/base-sprite-content.mjs / combat/base-sprite-continuation-20261125-b.mjs / combat/illustrations.mjs / combat/render.mjs', 6: 'Activer les 56 familles statiques lorsque leurs deux PNG sont présents et vérifiés : sélection et garde. Les lots A et B ajoutent 32 familles. Le choix du costume conserve la silhouette, les accessoires et les occultations documentées.' },
};
for (const [id, changes] of Object.entries(updatedFeatures)) { const row = data.features.find(r => r[0] === id); assert(row); for (const [c, value] of Object.entries(changes)) row[Number(c)] = value; }
const featureRows = [];
const qaRows = [
  ['BASE36-native', 'Art statique', '64 bases et huit motifs de projectile natifs', 'Réussi', 'P0', 'Inventaire complet, dimensions PNG, SHA-256 et publication ART_FILES', inventoryFile, '72 fichiers distincts ; ' + addedBytes + ' octets. Lot A : 32 fichiers récupérés. Lot B : 40 fichiers, dont onze récupérés et 29 générés dans cette continuation. Aucun cycle animé ajouté.', ''],
  ['BASE36-official', 'Références', 'Cinq apparences de références officielles', 'Réussi', 'P0', 'Sources déclarées et revues visibles de chaque dessin', [...new Set(officialAssets.map(a => a.reviewPath))].join(' / '), 'Bunny Jax, Maid Ribbit et accessoires documentés de Ghostly, Ming et Disappearing Guy. Périmètre limité aux vues référencées ; aucun modèle caché, épisode inédit ou accord pixel à pixel certifié.', ''],
  ['BASE36-original', 'Créations originales', '27 familles crossover de Queenie', 'Réussi', 'P1', 'Deux dessins relus par famille ; trois styles dans neuf univers', [...new Set(originalAssets.map(a => a.reviewPath))].join(' / '), 'Les neuf séries comportent hommage, résidente et fusion. Neuf familles récupérées du lot A et dix-huit achevées au lot B. Identité et choix de design documentés ; créations Encore, sans apparition canonique ni action supplémentaire affirmée.', ''],
  ['BASE36-projectiles', 'Rendu', 'Huit motifs dédiés associés à leur combattant', qaStatus, 'P1', final ? `${proof.canvas.projectiles.images} motifs, ${proof.canvas.projectiles.simulatedShots} tirs simulés, ${proof.canvas.projectiles.actualReflections} renvois et ${proof.canvas.projectiles.nativeDrawChecks} contrôles de dessin Canvas` : 'Source PROJECTILE_ART, propriétaires PNJ et inventaire natif comparés', final ? proof.canvas.projectiles.report + ' / ' + verificationFile : inventoryFile, 'Queenie, Ribbit, Kaufmo, Ming, Ghostly, Orbsman, l’Huître et Abel ont leurs motifs propres. Les 15 motifs précédents restent présents : 23 au total. Aucun cycle animé ni succès DOM déduit.', ''],
  ['BASE36-static', 'Rendu', 'Deux slots statiques conservés par les nouvelles familles', qaStatus, 'P0', final ? `${proof.canvas.bases.sourceAndFacingChecks} contrôles de source et de sens ; ${proof.canvas.bases.actualStateDraws} dessins Canvas ; tests Node du lot courant` : 'Validation runtime finale en attente', final ? proof.canvas.bases.report + ' / ' + verificationFile : verificationFile, 'Les 32 familles ajoutées déclarent sélection et garde ; activation après publication des deux fichiers et de leurs empreintes. Les assertions DOM sont suivies séparément.', ''],
  ['BASE36-prefix', 'Régression', 'Préfixes de 508 puis 522 costumes et 64 combattants conservés', qaStatus, 'P0', 'Comparaison exacte de l’ordre, des identifiants et des données avant et après ajout', verificationFile + ' / ' + folder + '/workbook/update-plan.json', '540 costumes au total. Lot A ajouté après les 508 entrées publiées ; lot B après les 522 locales. Les 64 combattants et 640 techniques restent identiques ; aucun contrat historique réinterprété.', ''],
  ['BASE36-endings', 'Histoire', 'Dix derniers tableaux déplacés vers la calibration', 'Partiel', 'P0', 'Source et lignes Production comparées ; contrôles Node exécutés, navigateur en attente', 'combat/abstractions-narrative.mjs / tests/combat-story-presentation-browser.mjs / ' + verificationFile, 'Le dernier épilogue utilise training ; les chapitres jouables conservent leur arène. L’exigence de six images distinctes reste inchangée. CI #115 avait trouvé cinq images ; aucun nouveau passage navigateur affirmé.', ''],
  ['BASE36-search', 'Lisibilité', 'Filtre Pomni : deux identités exactes attendues', 'Partiel', 'P0', 'Assertion corrigée pour pomni et originalabstractedpomni ; navigateur en attente', 'tests/combat-readability-browser.mjs / ' + verificationFile, 'Le résultat correct contient Pomni et son abstraction originale. Les contrôles des identifiants et libellés restent stricts ; le parcours navigateur n’a pas été réexécuté localement.', ''],
  ['BASE36-global', 'Validation', 'Tests Node et deux paquets construits', qaStatus, 'P0', final ? proof.qa.tests + ' tests réussis, zéro échec, zéro ignoré ; deux builds contrôlés' : 'Exécution globale en attente', verificationFile, 'Preuve propre à ce lot. Les résultats antérieurs restent historiques ; aucune campagne navigateur complète ni validation de périphérique physique déduite des tests Node.', ''],
  ['BASE36-browser', 'Navigateur', 'Suites corrigées et nouvelles familles : exécution locale ouverte', 'Non exécuté', 'P1', 'Binaire Chromium local indisponible ; aucune assertion navigateur de cette passe', verificationFile, 'Le wrapper système Chromium ne contient pas son exécutable et le cache Playwright est absent. Les tests Node et Canvas ne certifient pas le parcours navigateur. Assertions existantes conservées ; résultat GitHub Actions à lire sur son SHA propre.', ''],
  ['TRACKER36-update', 'Suivi', 'Préservation, recalcul et réimportation du classeur', qaStatus, 'P0', 'Moteur tableur principal ; comparaison native complète et aperçus relus', folder + '/workbook/workbook-review.json', '91 743 cellules de départ contraintes ; onze feuilles, dix tableaux, 42 formules et toutes les notes préservés. Dix lignes de conclusions mises à jour sur place ; publication bloquée si les contrôles échouent.', ''],
];
data.qa.push(...qaRows);
const oldCoverage = structuredClone(before.npcCrossoverCoverage), coverage = data.npcCrossoverCoverage;
data.npcCrossoverCoverageHistory.push(oldCoverage);
coverage.previousEvidence = oldCoverage.evidence; coverage.evidence = inventoryFile; coverage.asOf = '2026-11-25';
coverage.assets.push(...originalAssets); coverage.completedFamilies += 27; coverage.publishedPngs += 54;
coverage.ownersWithAnyCrossover.push('queenie'); coverage.ownersWithoutCrossover = coverage.ownersWithoutCrossover.filter(id => id !== 'queenie');
coverage.queenie = { completedSeries: seriesIds, completedStyleIds: originals.map(d => d.id), remainingSeries: [], completedFamilies: 27, potentialFamilies: 27, completeAcrossAllSeries: true, completionBasis: 'Two required static drawings per new family.', fullPoseFamilies: 0, baseOnlyFamilies: 27, baseOnlySlots: ['selection', 'stance'] };
coverage.pendingFamiliesWithinNineSeries -= 27; coverage.pendingAllNonLegacyFamilies -= 27;
coverage.handDirection = { ...structuredClone(oldCoverage.handDirection), previousEvidence: structuredClone(oldCoverage.handDirection.currentCollectionEvidence), currentCollectionEvidence: [...new Set(originalAssets.map(a => a.reviewPath))], scope: 'The new Queenie designs follow their reviewed references and declared original anatomy; prior Ribbit design rules remain historical and unchanged.' };
coverage.scope = 'Ribbit conserve ses 27 styles sur neuf séries (135 PNG). Queenie possède les 27 styles statiques des neuf séries (54 PNG). Les 38 autres PNJ représentent 1 026 créations crossover possibles, auxquelles le catalogue historique ajoute 270 combinaisons potentielles pour les dix abstractions. Ce total de 1 296 possibilités ne désigne pas des costumes officiels manquants. Aucune nouvelle action attendue.';
assert.equal(coverage.assets.length, 189); assert.equal(coverage.pendingFamiliesWithinNineSeries, 1026); assert.equal(coverage.pendingAllNonLegacyFamilies, 1296);
data.crossoverArtHistory.push(structuredClone(before.crossoverArt));
data.crossoverArt = { ...data.crossoverArt, asOf: '2026-11-25', outfits: 432, costumeDrawings: 3970, promotedNpcOutfits: 54, promotedNpcDrawings: 189, newBaseOnlyFamilies: 27, newBaseOnlyDrawings: 54, completionScope: 'Two required drawings for each new baseOnly family; existing full families retain their authored pose contracts.', evidence: inventoryFile };
data.costumeAdditionHistory.push({ asOf: before.costumeAdditionCoverage.asOf, evidence: before.costumeAdditionReview.evidence, coverage: structuredClone(before.costumeAdditionCoverage), review: structuredClone(before.costumeAdditionReview) });
const costumeCoverage = data.costumeAdditionCoverage;
costumeCoverage.asOf = '2026-11-25'; costumeCoverage.ids.push(...officials.map(d => d.id)); costumeCoverage.sourceIds.push(...officials.map(d => d.sourceId)); costumeCoverage.assets.push(...officialAssets);
costumeCoverage.appearances += 5; costumeCoverage.pngFiles += 10; costumeCoverage.publishedFiles += 10; costumeCoverage.bytes += officialAssets.reduce((n, a) => n + a.bytes, 0);
costumeCoverage.drawingsBySlot.selection += 5; costumeCoverage.drawingsBySlot.stance += 5;
costumeCoverage.fullPoseAppearances = 45; costumeCoverage.baseOnlyAppearances = 11; costumeCoverage.baseOnlySlots = ['selection', 'stance'];
costumeCoverage.scope = '45 anciennes apparences à onze dessins et onze apparences à deux bases statiques. Les neuf actions ne sont pas attendues pour ces onze familles.';
assert.equal(costumeCoverage.appearances, 56); assert.equal(costumeCoverage.pngFiles, 517);
data.costumeAdditionReview = { asOf: '2026-11-25', evidence: verificationFile, workbookEvidence: folder + '/workbook/workbook-review.json', qaRowIds: qaRows.map(r => r[0]), appendedAppearances: 5, appendedIndividualDrawingRows: 10, newNativePngs: 10, priorAppearancesPreserved: 51, newFamiliesBaseOnly: true };
data.historicalCurrentQa.push(structuredClone(before.currentQa));
data.currentQa = { gameVersion: data.version, campaign: 'base-sprites-2026-11-25-a-b', complete: false, evidence: verificationFile, workbookEvidence: folder + '/workbook/workbook-review.json', rowIds: qaRows.map(r => r[0]), totals: { nodeTests: proof?.qa.tests || 0, nodePassed: proof?.qa.pass || 0, canvasBaseChecks: proof?.canvas.bases.sourceAndFacingChecks || 0, canvasBaseDraws: proof?.canvas.bases.actualStateDraws || 0, canvasProjectileChecks: proof?.canvas.projectiles.nativeDrawChecks || 0, browserAssertionsExecutedByWorkbookUpdate: 0 }, scope: '32 familles à deux bases statiques et huit motifs dédiés réunis dans cette publication. Inventaires, tests Node, builds, Canvas et limites des sources séparés. Validation navigateur et appareils physiques ouverts ; aucune animation ni fidélité canonique 1:1 certifiée.' };
data.qaCampaigns.push({ id: data.currentQa.campaign, asOf: '2026-11-25', evidence: verificationFile, rowIds: qaRows.map(r => r[0]), node: proof?.qa || null, browserCampaignExecuted: false });
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(r => r[3] === status).length]));
data.qaSummaryScope = 'Lignes historiques conservées et preuves datées ; les campagnes ne sont pas additionnées comme une exécution unique. La campagne de bases statiques du 25 novembre est identifiée séparément ; les validations navigateur demeurent ouvertes.';
data.historicalQaRows = before.qa.length;
Object.assign(data.counts, { variants: 540, crossovers: 432, costumeAdditions: 56, baseOnlyCostumes: 56, baseOnlyOfficialCostumes: 11, baseOnlyCrossoverCostumes: 45, sharedStages: 27, crossoverStages: 9, totalStages: 36, offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES, features: data.features.length, production: data.production.length, qa: data.qa.length, projectileMotifs: 23 });
data.asOf = '2026-11-25'; data.contentAsOf = '2026-11-25';
data.baseSpriteContinuationHistory = [...(before.baseSpriteContinuationHistory || []), structuredClone(before.baseSpriteContinuation)];
data.baseSpriteContinuation = { asOf: '2026-11-25', phase: final ? 'verified-static-bases-browser-open' : 'draft-awaiting-global-evidence', baselineCostumes: 508, preservedLocalPrefix: 522, addedCostumes: 32, officialAppearances: officials.map(d => d.id), originalCrossoverAppearances: originals.map(d => d.id), requiredSlots: ['selection', 'stance'], authoredPngs: 64, projectilePngs: 8, integratedPngs: 72, lotA: { recoveredPngs: 32, appearances: 14, projectilePngs: 4 }, lotB: { recoveredPngs: 11, generatedThisSessionPngs: 29, integratedPngs: 40, appearances: 18, projectilePngs: 4 }, generatedThisSessionPngs: 29, recoveredPngs: 43, authoredBytes: baseAssets.reduce((n, a) => n + a.bytes, 0), integratedBytes: addedBytes, reviewPaths: [...reviews], newActionPngs: 0, newAnimations: 0, missingRequiredSlots: 0, actionSlotsOutOfScope: true, canonicalPixelCertification: false, assets: baseAssets, projectiles: projectileAssets, correctedStoryPanels: storyChanges, evidence: verificationFile, historicalRowsPreservedExceptDeclaredChanges: true };
const changedStoryIds = new Set(storyChanges.map(change => change.rowId));
for (const [name, key] of Object.entries(tableKeys)) {
  assert.equal(new Set(data[key].map(r => r[0])).size, data[key].length, key + ' unique IDs');
  assert.deepEqual(data[key].slice(0, before[key].length).map(r => r[0]), before[key].map(r => r[0]), key + ' original order');
  assert.deepEqual(data[key].slice(0, before[key].length).map(r => r.at(-1)), before[key].map(r => r.at(-1)), key + ' notes');
  for (let i = 0; i < before[key].length; i++) {
    if (key === 'features' && Object.hasOwn(updatedFeatures, before[key][i][0])) continue;
    if (key === 'production' && changedStoryIds.has(before[key][i][0])) { const copy = [...data[key][i]]; copy[7] = before[key][i][7]; assert.deepEqual(copy, before[key][i]); continue; }
    assert.deepEqual(data[key][i], before[key][i], key + ' unchanged historical row ' + i);
  }
}
assert.deepEqual(data.sources.slice(0, before.sources.length), before.sources);
assert.equal(new Set(data.sources.map(s => s.id)).size, data.sources.length);

const changed = new Map();
function setCell(name, ref, value, formula = null) {
  const [r, c] = position(ref), cell = sheets.get(name).cells.find(x => x[0] === r && x[1] === c); assert(cell, name + '!' + ref);
  if (cell[3] === value && cell[4] === formula) return;
  if (!changed.has(name + '!' + ref)) changed.set(name + '!' + ref, { sheet: name, cell: ref, before: cell.slice(2, 5), value, formula });
  else Object.assign(changed.get(name + '!' + ref), { value, formula });
  cell[2] = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'; cell[3] = value; cell[4] = formula;
}
for (const [name, key] of Object.entries(tableKeys)) for (let r = 0; r < before[key].length; r++) for (let c = 0; c < before[key][r].length; c++) if (before[key][r][c] !== data[key][r][c]) setCell(name, col(c + 1) + (r + 6), data[key][r][c]);
const sourceColumns = ['id', 'title', 'kind', 'url', 'scope'];
for (let r = 0; r < before.sources.length; r++) for (let c = 0; c < sourceColumns.length; c++) if (before.sources[r][sourceColumns[c]] !== data.sources[r][sourceColumns[c]]) setCell('Références', col(c + 1) + (r + 6), data.sources[r][sourceColumns[c]]);
const appendStyle = fill => { native.styles.push({ font: { name: 'Arial', size: 10, bold: false, italic: false, color: '#23243B' }, fill, borders: {}, numberFormat: 'General', horizontalAlignment: 'general', verticalAlignment: 'center', wrapText: true }); return native.styles.length - 1; };
const styles = { light: appendStyle('#F4F0F8'), white: appendStyle('#FFFFFF'), note: appendStyle('#FFF1C9') };
const numericStyles = new Map();
function appendCellStyle(name, previousRow, column, baseStyle, value) {
  if (typeof value !== 'number') return baseStyle;
  const source = sheets.get(name).cells.find(c => c[0] === previousRow && c[1] === column);
  if (!source) return baseStyle;
  const format = native.styles[source[5]].numberFormat;
  if (format === native.styles[baseStyle].numberFormat) return baseStyle;
  const key = baseStyle + '/' + format;
  if (!numericStyles.has(key)) { native.styles.push({ ...structuredClone(native.styles[baseStyle]), numberFormat: format }); numericStyles.set(key, native.styles.length - 1); }
  return numericStyles.get(key);
}
const rowHeight = (sheet, row, minimum = 42) => Math.max(minimum, 13 * Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((s, line) => s + Math.max(1, Math.ceil(line.length / Math.max(12, (sheet.widths[c + 1] || 22) * 1.08))), 0))) + 10);
const statusColumns = { 'Fonctionnalités': ['D'], 'Combattants': ['E', 'F', 'H'], 'Techniques': ['N', 'O'], 'Arènes': ['C', 'D', 'K'], 'Atlas': ['E', 'F'], 'Production': ['E'], 'Scénarios': ['H'], 'QA': ['D'] };
function append(name, rows, oldCount, noteColumn) {
  if (!rows.length) return;
  const sheet = sheets.get(name), width = sheet.tables[0].columns.length;
  for (const [i, row] of rows.entries()) {
    const number = oldCount + i + 6; assert.equal(row.length, width, name + '/' + row[0]);
    row.forEach((value, c) => {
      const baseStyle = c + 1 === noteColumn ? styles.note : (oldCount + i) % 2 ? styles.white : styles.light;
      sheet.cells.push([number, c + 1, typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string', value, null, appendCellStyle(name, oldCount + 5, c + 1, baseStyle, value)]);
    });
    // Native SHA-256 and review paths wrap to seven lines in these new rows.
    // The rendered workbook needs breathing room beyond the character estimate.
    const minimumHeight = name === 'Production' && ['Dessin de base', 'Projectile illustré'].includes(row[1]) ? 100 : 42;
    sheet.heights[number] = rowHeight(sheet, row, minimumHeight);
  }
  sheet.tables[0].range = 'A5:' + col(width) + (oldCount + rows.length + 5);
  for (const letter of statusColumns[name] || []) {
    const range = rows.length === 1 ? letter + (oldCount + 6) : letter + (oldCount + 6) + ':' + letter + (oldCount + rows.length + 5);
    sheet.validations.push({ range, values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] });
    for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Échec', '#FBE0E0', '#A12A2A'], ['Non exécuté', '#EAE7F1', '#56496D']]) sheet.rules.push({ range, text, format: { font: { color }, fill }, priority: sheet.rules.length + 1 });
  }
}
for (const [name, key] of Object.entries(tableKeys)) append(name, data[key].slice(before[key].length), before[key].length, data[key][0].length);
for (const [name, key] of Object.entries(tableKeys)) for (const row of new Set([...changed.values()].filter(c => c.sheet === name).map(c => position(c.cell)[0]))) sheets.get(name).heights[row] = Math.max(sheets.get(name).heights[row] || 0, rowHeight(sheets.get(name), data[key][row - 6]));
const references = sheets.get('Références'), footerStart = before.sources.length + 6, shift = newSources.length;
for (const c of references.cells) if (c[0] >= footerStart) c[0] += shift;
references.heights = Object.fromEntries(Object.entries(references.heights).map(([r, h]) => [Number(r) >= footerStart ? Number(r) + shift : r, h]));
append('Références', newSources.map(s => [s.id, s.title, s.kind, s.url, s.scope]), before.sources.length, null);
for (const row of new Set([...changed.values()].filter(change => change.sheet === 'Références').map(change => position(change.cell)[0]))) references.heights[row] = Math.max(references.heights[row] || 0, rowHeight(references, sourceColumns.map(field => data.sources[row - 6][field])));
const summary = sheets.get('Synthèse');
for (const c of summary.cells) if (c[4]) {
  let formula = c[4];
  for (const [sheetName, key] of Object.entries(tableKeys)) formula = formula.replace(new RegExp("('" + sheetName + "'![A-Z]+\\$?6:[A-Z]+\\$?)" + (before[key].length + 5) + '(?=[,)])', 'g'), '$1' + (data[key].length + 5));
  setCell('Synthèse', address(c), c[3], formula);
}

const summaryValues = {
  H2: 'Version 0.7.0 · bases statiques · 25 novembre 2026',
  H7: 'Sprites de base et motifs dédiés', H8: '5 apparences de référence · 27 créations de Queenie',
  H9: '36 arènes : 27 partagées et 9 crossovers',
  H13: final ? proof.qa.tests + ' tests Node et deux builds validés' : 'Bilan global du lot en cours',
  H14: 'Navigateur et périphériques physiques : validation ouverte',
  H15: final ? 'Classeur recalculé, réimporté et comparé au socle' : 'Classeur en préparation ; publication finale ouverte',
  H16: '32 familles · 64 bases · 8 projectiles natifs',
  A23: 'Contrôles partiels datés',
  A27: 'Filtrer Production par personnage et par contrat de dessins.',
  H30: '56 familles statiques au total · aucune nouvelle animation',
};
for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
for (const c of summary.cells) if (c[4]) setCell('Synthèse', address(c), evaluate(c[4].slice(1), lookup, 'Synthèse'), c[4]);
for (const [ref, value] of Object.entries({ B7: 64, B8: 640, B9: 27, B10: 184, B11: 540, B12: 64, F15: 107, F16: 3915, F17: 408, F18: 184, F22: 2518, H27: '839 fiches, hors tenues crossover' })) assert.equal(lookup.get('Synthèse').get(ref)[3], value, ref);
let constrainedCells = 0;
const approvedRowHeightChanges = [];
for (const [name, source] of sourceSheets) {
  const target = sheets.get(name), cells = new Map(target.cells.map(c => [address(c), c]));
  for (const prop of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) assert.deepEqual(source[prop], target[prop], name + '/' + prop);
  for (const [oldRow, oldHeight] of Object.entries(source.heights)) {
    const row = Number(oldRow) + (name === 'Références' && Number(oldRow) >= footerStart ? shift : 0);
    const height = target.heights[row];
    if (height !== oldHeight) {
      assert([...changed.values()].some(c => c.sheet === name && position(c.cell)[0] === row), 'Unexpected row height change');
      assert(height >= oldHeight);
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
  for (const table of source.tables) assert.deepEqual({ ...target.tables.find(t => t.name === table.name), range: table.range }, table, 'Preserved native table ' + name);
}
assert.equal(constrainedCells, 91743);
const targetDir = path.join(output, 'native-target'); await fs.mkdir(targetDir, { recursive: true });
for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
await writeJson(path.join(output, 'combat-tracker-data.json'), data);

const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']];
for (const row of new Set([...changed.values()].filter(c => c.sheet === 'Fonctionnalités').map(c => position(c.cell)[0]))) scopes.push(['Fonctionnalités', 'A' + row + ':I' + row, 'feature-' + data.features[row - 6][0].toLowerCase()]);
for (const change of storyChanges) {
  const row = data.production.findIndex(r => r[0] === change.rowId) + 6;
  scopes.push(['Production', 'A' + row + ':J' + row, 'story-ending-' + change.fighterId]);
}
for (let i = 0; i < definitions.length; i++) {
  const first = before.production.length + 6 + i * 3;
  scopes.push(['Production', 'A' + first + ':J' + (first + 2), 'base-family-' + definitions[i].id]);
}
for (let i = 0; i < projectileAssets.length; i += 2) {
  const first = before.production.length + 6 + definitions.length * 3 + i;
  scopes.push(['Production', 'A' + first + ':J' + Math.min(first + 1, data.production.length + 5), 'projectiles-' + (i / 2 + 1)]);
}
for (let i = 0; i < qaRows.length; i += 2) { const first = before.qa.length + 6 + i; scopes.push(['QA', 'A' + first + ':I' + Math.min(first + 1, data.qa.length + 5), 'qa-' + (i / 2 + 1)]); }
for (let i = 0; i < newSources.length; i += 3) { const first = before.sources.length + 6 + i; scopes.push(['Références', 'A' + first + ':E' + Math.min(first + 2, data.sources.length + 5), 'references-' + (i / 3 + 1)]); }
scopes.push(['Références', 'A' + (data.sources.length + 6) + ':E' + (data.sources.length + 16), 'references-footer']);
const runtimeSourceHashes = { ...(proof?.combatSourceHashes || {}) };
for (const name of (await fs.readdir(path.join(root, 'combat'))).filter(name => name.endsWith('.mjs')).sort()) runtimeSourceHashes['combat/' + name] = hash(await fs.readFile(path.join(root, 'combat', name)));
for (const file of offline.CORE_FILES) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'));
  runtimeSourceHashes['combat/' + file] = hash(await fs.readFile(path.join(root, 'combat', file)));
}
const qaSourceHashes = {};
for (const name of (await fs.readdir(path.join(root, 'tests'))).filter(name => name.endsWith('.mjs')).sort()) qaSourceHashes['tests/' + name] = hash(await fs.readFile(path.join(root, 'tests', name)));
const authoringSourceHashes = {};
for (const file of ['scripts/prepare-combat-base-sprites-tracker-20261125.mjs', 'scripts/publish-combat-base-sprites-workbook-20261125.mjs', 'scripts/update-combat-abstractions-workbook-20261124.mjs', 'scripts/inspect-combat-workbook-native.py', 'scripts/workbook-publication.mjs']) authoringSourceHashes[file] = hash(await fs.readFile(path.join(root, file)));
const plan = {
  schema: 'encore-tracker-static-base-plan/v2', createdAt: new Date().toISOString(), phase: final ? 'final-evidence-confirmed-awaiting-workbook-review' : 'draft-unpublished',
  baselineHashes, baselineSnapshotHashes, historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], approvedRowHeightChanges, evidenceHashes, runtimeSourceHashes, qaSourceHashes, authoringSourceHashes,
  counts: { ...data.counts, sheets: 11, nativeTables: [...sheets.values()].reduce((n, s) => n + s.tables.length, 0), sources: data.sources.length, addedProductionRows: productionRows.length, updatedStoryRows: storyChanges.length, addedQaRows: qaRows.length, declaredArtFiles: 72, verifiedArtFiles: assetChecks.length, totalNativeCells: native.sheets.reduce((n, s) => n + s.cells, 0) },
  appendedProductionIds: productionRows.map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(s => s.id), appendedFeatureIds: featureRows.map(r => r[0]),
  coverageChanges: { addedFighters: 0, addedTechniques: 0, addedStages: 0, addedOfficialCostumes: 5, addedOriginalCrossoverCostumes: 27, addedPngs: 72, recoveredPngs: 43, generatedThisSessionPngs: 29, addedBasePngs: 64, addedProjectilePngs: 8, newActionPngs: 0, newAnimations: 0, requiredSlotsPerNewFamily: 2, priorCostumesPreserved: 508, localPrefixPreserved: 522, historicalRowsPreservedExceptDeclaredCellChanges: true, updatedStoryRowIds: storyChanges.map(change => change.rowId), updatedFeatureIds: Object.keys(updatedFeatures), historicalNotesPreserved: true, historicalCoverageSnapshotsPreserved: true },
  formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: 'E6', scopes,
  historicalFooterShift: shift, assetSlotChecks: assetChecks, historicalProjectileAssets, activeAssetDigests: [...assetChecks, ...historicalProjectileAssets],
  runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: hash(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) },
  qaEvidence: { final: proof?.qa || null, canvas: proof?.canvas || null, browser: proof?.browser || null, browserAssertionsExecutedByWorkbookUpdate: 0 },
};
assert.equal(plan.formulas.length, 42); assert.equal(plan.counts.nativeTables, 10);
await writeJson(path.join(output, 'update-plan.json'), plan);
console.log(JSON.stringify({ phase: plan.phase, counts: plan.counts, preservedCells: constrainedCells, changedHistoricalCells: changed.size, renderViews: scopes.length }));
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

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
const output = path.resolve(flag('--output-dir', '/workspace/scratch/e51b531817b1/outputs/base-sprites-tracker-20261124'));
const final = args.includes('--final');
const folder = 'docs/art-generation/base-sprites-20261124';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
const xlsxName = 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx';
const baseline = await json(path.join(output, 'baseline-freeze.json'));
for (const [file, record] of Object.entries(baseline.files)) assert.equal(hash(await fs.readFile(path.join(output, 'baseline', path.basename(file)))), record.sha256, file);
const before = await json(path.join(output, 'baseline/combat-tracker-data.json'));
assert.equal(before.counts.variants, 484);
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
assert.equal(native.sheets.reduce((n, s) => n + s.cells, 0), 90882);
const sheets = new Map(), baselineSnapshotHashes = {};
for (const file of ['manifest.json', ...native.sheets.map(s => s.file)]) baselineSnapshotHashes[file] = hash(await fs.readFile(path.join(output, 'native-baseline', file)));
for (const entry of native.sheets) sheets.set(entry.name, await json(path.join(output, 'native-baseline', entry.file)));
const sourceSheets = structuredClone([...sheets]);
const data = structuredClone(before);
const [runtime, baseSprites, offline, crossovers] = await Promise.all(['combat/data.mjs', 'combat/base-sprite-content.mjs', 'combat/offline-manifest.mjs', 'combat/crossovers.mjs'].map(moduleAt));
const { FIGHTERS, COSTUMES, BASE_SPRITE_COSTUMES } = runtime;
const { BASE_SPRITE_ART_SLOTS, BASE_SPRITE_DEFINITIONS, BASE_SPRITE_SOURCES } = baseSprites;
const definitions = [...BASE_SPRITE_DEFINITIONS], originals = definitions.filter(d => d.crossover), officials = definitions.filter(d => !d.crossover);
assert.equal(definitions.length, 24); assert.equal(originals.length, 18); assert.equal(officials.length, 6);
assert.deepEqual([...BASE_SPRITE_ART_SLOTS], ['selection', 'stance']);
assert.equal(FIGHTERS.length, 64); assert.deepEqual(FIGHTERS.map(f => f.id), before.roster.map(r => r[0]));
const fighterName = id => FIGHTERS.find(f => f.id === id)?.name || id;
const evidenceHashes = {};
async function evidence(file) { const bytes = await fs.readFile(path.join(root, file)); evidenceHashes[file] = hash(bytes); return file.endsWith('.json') ? JSON.parse(bytes) : bytes; }
const integrationBaseline = await evidence(folder + '/integration-baseline.json');
assert.equal(integrationBaseline.costumeCount, 484);
assert.deepEqual(COSTUMES.slice(0, 484).map(c => c.id), integrationBaseline.costumeIds);
assert.equal(BASE_SPRITE_COSTUMES.length, 24, 'Wait for all two-file families to be reviewed and published in ART_FILES.');
assert.deepEqual(COSTUMES.slice(484).map(c => c.id), definitions.map(d => d.id));
assert.equal(COSTUMES.length, 508);
const verificationFile = flag('--verification', folder + '/verification.json');
const proof = final ? await evidence(verificationFile) : null;
if (final) {
  assert(proof.qa && proof.qa.tests > 0); assert.equal(proof.qa.pass, proof.qa.tests); assert.equal(proof.qa.fail, 0); assert.equal(proof.qa.skipped, 0); assert.equal(proof.qa.bothBuildsPassed, true);
  for (const [file, sha256] of Object.entries(proof.combatSourceHashes || {})) assert.equal(hash(await fs.readFile(path.join(root, file))), sha256, 'Frozen runtime changed: ' + file);
}
const officialAudit = await evidence(folder + '/official-costumes/asset-audit.json');
const rootAudit = await evidence(folder + '/root-official/asset-inventory.json');
await evidence(folder + '/root-official/review.json');
const originalAudit = await evidence(folder + '/crossovers/manifest.json');
const originalReview = await evidence(folder + '/crossovers/visual-review-final.json');
await evidence(folder + '/crossovers/references/reference-catalog.json');
assert.equal(officialAudit.complete, true); assert.equal(officialAudit.assets.length, 8);
assert.equal(originalReview.records.length, 36); assert(originalReview.records.every(record => record.accepted === true));
assert.equal(rootAudit.assets.length, 4); assert.equal(originalAudit.complete, true); assert.equal(originalAudit.records.length, 36);
const records = [...officialAudit.assets, ...rootAudit.assets, ...originalAudit.records];
const byFile = new Map(records.map(a => [a.file || a.path, a]));
assert.equal(byFile.size, 48);
const published = new Set(offline.ART_FILES);
const assetChecks = [];
for (const def of definitions) {
  assert.equal(def.baseOnly, true); assert.equal(def.presentation, 'static'); assert.deepEqual([...def.authoredSlots], ['selection', 'stance']);
  assert.equal(def.assetReview.status, 'verified-base-files');
  for (const slot of BASE_SPRITE_ART_SLOTS) {
    const file = def.directory.replace(/^\.\.\//, '') + '/' + slot + '.png', asset = byFile.get(file);
    assert(asset, 'Missing native receipt: ' + file); assert(published.has('../' + file), 'Not published: ' + file);
    assert.equal(asset.nativeBytesVerified === true || asset.nativeCopyIdentical === true, true, 'Native copy not proven: ' + file);
    if (def.crossover) assert.equal(asset.accepted, true);
    const bytes = await fs.readFile(path.join(root, file)); const sha256 = hash(bytes);
    assert.equal(sha256, asset.sha256, file); assert.equal(bytes.length, asset.bytes, file); assert.equal(def.assetReview.sha256[slot], sha256, file);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
    assetChecks.push({ id: def.id, slot, file, sha256, bytes: bytes.length, nativeBytesVerified: true, published: true, baseOnly: true, evidence: def.crossover ? folder + '/crossovers/manifest.json' : officials.slice(0, 4).some(d => d.id === def.id) ? folder + '/official-costumes/asset-audit.json' : folder + '/root-official/asset-inventory.json' });
  }
}
assert.equal(assetChecks.length, 48); assert.equal(new Set(assetChecks.map(a => a.sha256)).size, 48);
const officialAssets = assetChecks.filter(a => officials.some(d => d.id === a.id)), originalAssets = assetChecks.filter(a => originals.some(d => d.id === a.id));
assert.equal(officialAssets.length, 12); assert.equal(originalAssets.length, 36);
const addedBytes = assetChecks.reduce((n, a) => n + a.bytes, 0);
assert.equal(offline.ART_FILES.length, before.counts.offlineImages + assetChecks.length);
assert.equal(offline.ART_BYTES, before.counts.offlineBytes + addedBytes);
const artStatus = 'Implémenté', qaStatus = final ? 'Réussi' : 'À vérifier';
const sourceIds = new Set(before.sources.map(s => s.id));
const newSources = BASE_SPRITE_SOURCES.filter(s => !sourceIds.has(s.id)).map(s => ({ id: s.id, title: s.title, kind: s.kind, url: s.url, scope: s.scope }));
assert.equal(newSources.length, 6);
const seriesIds = [...new Set(originals.map(d => d.crossover.series))];
for (const series of seriesIds) {
  const seriesManifest = await evidence(folder + '/crossovers/manifest-' + series + '.json');
  assert.equal(seriesManifest.complete, true); assert.equal(seriesManifest.records.length, 6);
  const first = seriesManifest.appearances[0], sourceUrls = [...new Set(seriesManifest.appearances.flatMap(a => a.sourceUrls || []))];
  assert(sourceUrls.length, 'Missing documented series references: ' + series);
  newSources.push({ id: 'encore-static-ribbit-' + series + '-20261124', title: 'Ribbit × ' + first.name.split(' · ')[0] + ' — trois bases originales', kind: 'Création originale Encore ; références de série', url: sourceUrls[0], scope: 'Trois créations de fan-game : hommage, résident et fusion. Deux images par style, portrait et garde. La série fournit des repères de design ; aucun costume canonique de Ribbit ni fidélité 1:1 de cette fusion n’est affirmé. Références exactes et traits : ' + folder + '/crossovers/manifest-' + series + '.json. Les neuf actions sont hors du contrat statique.' });
}
assert.equal(newSources.length, 12); data.sources.push(...newSources);
const familyRows = [], productionRows = [];
for (const def of definitions) {
  const filePrefix = def.directory.replace(/^\.\.\//, ''), familyId = def.crossover ? 'COST-' + def.id : 'BASE35-family-' + def.id;
  const sourceText = def.crossover ? 'Création originale Encore ; références de série documentées dans ' + folder + '/crossovers/manifest-' + def.crossover.series + '.json.' : def.sourceKind + ' ; ' + def.sourceUrl;
  const family = [familyId, def.crossover ? 'Costume crossover' : 'Tenue Circus', fighterName(def.fighterId) + ' · ' + def.name, 'Portrait et garde statiques', artStatus, 'P1', 'combat/base-sprite-content.mjs · ' + filePrefix, sourceText, 'Deux bases attendues et présentes : sélection et garde. Neuf poses d’action hors périmètre ; les états utilisent cette garde sans animation. ' + (def.staticConstraint || 'Conserver le dessin et ses proportions. Aucun changement du kit ou de la collision du combattant.'), ''];
  familyRows.push(family); productionRows.push(family);
  for (const slot of BASE_SPRITE_ART_SLOTS) productionRows.push(['BASE35-asset-' + def.id + '-' + slot, 'Dessin de base', fighterName(def.fighterId) + ' · ' + def.name, slot === 'selection' ? 'Portrait de sélection' : 'Garde statique', artStatus, 'P1', filePrefix + '/' + slot + '.png', 'PNG natif vérifié par SHA-256 ; alpha et silhouette relus. ' + (def.crossover ? 'Création originale.' : 'Vue officielle documentée, occultations conservées.'), slot === 'selection' ? 'Conserver le cadrage du portrait approuvé. Cette ligne ne promet aucune pose d’action.' : 'Dessin fixe commun aux états du costume ; échelle uniforme, sens miroir de jeu et accessoires conservés. Aucun cycle animé à livrer pour cette famille.', '']);
}
assert.equal(productionRows.length, 72); data.production.push(...productionRows);
const updatedFeatures = {
  'PRE-03': { 5: 'combat/data.mjs · combat/base-sprite-content.mjs · combat/crossovers.mjs · combat/app.mjs', 6: '508 tenues équipables : 52 variantes d’archive, 51 tenues Circus et 405 crossovers dans neuf collections. Les 24 nouvelles familles possèdent chacune un portrait et une garde statique.', 7: 'Les 484 apparences de départ conservent leur ordre. Ribbit couvre les neuf séries : neuf familles historiques à onze dessins et dix-huit familles nouvelles à deux bases. Les 39 autres PNJ promus et les dix abstractions restent sans tenue crossover ; les fusions sont originales.' },
  'PRD-11': { 5: 'combat/fidelity.mjs / combat/costume-fidelity.mjs / combat/base-sprite-content.mjs / combat/data.mjs', 6: 'Documenter 64 combattants, 640 techniques, 27 arènes, 52 variantes d’archive, 51 tenues Circus et 405 crossovers avec leurs repères, classifications et limites de référence.', 7: 'Les six apparences officielles nouvelles sont comparées à leurs vues commerciales documentées ; les dix-huit crossovers sont des créations originales. Le contrat de ces 24 familles est limité à deux bases statiques, sans certification graphique globale.' },
  'INT-11': { 6: 'Télécharger ' + offline.ART_FILES.length + ' illustrations (' + offline.ART_BYTES + ' octets) à la demande puis jouer sans réseau. Un pack incomplet après éviction reste incomplet si sa réparation échoue.' },
};
for (const [id, changes] of Object.entries(updatedFeatures)) { const row = data.features.find(r => r[0] === id); assert(row); for (const [c, value] of Object.entries(changes)) row[Number(c)] = value; }
const featureRows = [['PRE-BASE-35', 'Présentation', 'Bases statiques à deux images', artStatus, 'P1', 'combat/base-sprite-content.mjs / combat/illustrations.mjs / combat/render.mjs', 'Ajouter 24 familles seulement lorsque leurs deux PNG sont présents et vérifiés : sélection et garde. Le choix du costume conserve la silhouette entière, les accessoires et les occultations documentées.', 'Aucune animation demandée : intro, attaque, défense, déplacement et finales utilisent la garde de cette même famille. Aucun chargement d’action ni repli vers le costume normal ; corps et kit restent ceux du combattant.', '']];
data.features.push(...featureRows);
const qaRows = [
  ['BASE35-native', 'Art statique', '48 PNG natifs et contrat de deux slots', 'Réussi', 'P0', 'Inventaires natifs, SHA-256, alpha et sources visuelles relues', folder + '/official-costumes/asset-audit.json / ' + folder + '/root-official/asset-inventory.json / ' + folder + '/crossovers/manifest.json', '24 familles, deux images distinctes chacune ; ' + addedBytes + ' octets. Aucun PNG d’action ajouté, aucune retouche du fichier natif après génération.', ''],
  ['BASE35-official', 'Références', 'Six compositions officielles documentées', 'Réussi', 'P0', 'Sources primaires de produits GLITCH et collaboration Animate', folder + '/official-costumes/catalog-proposals.json / ' + folder + '/root-official/review.json', 'Comparaison limitée aux vues visibles. Zooble reste replié, Abel garde son chariot et ses jambes masquées ; aucune anatomie cachée ni vue arrière inventée. Aucune certification pixel à pixel.', ''],
  ['BASE35-original', 'Créations originales', 'Dix-huit bases crossover de Ribbit', 'Réussi', 'P1', 'Revue des deux dessins de chaque style', folder + '/crossovers/visual-review-final.json', 'Six séries ajoutées, trois styles chacune. Les 18 gardes sont en pied ; 15 portraits sont en pied et les trois portraits Ultra sont des bustes intentionnels. Créations Encore distinctes des apparences officielles. Neuf anciennes familles à onze dessins préservées ; aucune action nouvelle attendue.', ''],
  ['BASE35-static', 'Rendu', 'Garde fixe dans chaque état et chaque sens', qaStatus, 'P0', final ? 'Contrôles runtime et revue Canvas datés' : 'Revue globale en attente', verificationFile, 'Les 24 familles restent statiques. Chaque état doit utiliser la garde de sa famille, conserver proportions et ancrage, et rester identique entre les temps 0 et 600. La revue ne constitue pas une campagne DOM ou périphériques.', ''],
  ['BASE35-prefix', 'Régression', 'Préfixe des 484 costumes et combattants conservé', qaStatus, 'P0', 'Instantané publié du catalogue et tests de compatibilité', folder + '/integration-baseline.json / tests/combat-base-sprites.test.mjs', 'Les nouveaux costumes sont ajoutés à la fin. Les 64 combattants, les 640 techniques, les corps de collision et les tirages historiques ne sont pas remplacés par cette passe.', ''],
  ['BASE35-global', 'Validation', 'Tests Node et deux paquets construits', qaStatus, 'P0', final ? proof.qa.tests + ' tests réussis, zéro échec, zéro ignoré ; deux builds contrôlés' : 'Exécution globale en attente', verificationFile, 'Preuve datée propre à ce lot. Les validations des abstractions et de Sunset restent historiques et ne sont pas présentées comme un résultat nouveau.', ''],
  ['BASE35-browser', 'Navigateur', 'Interactions DOM et appareils physiques', 'Non exécuté', 'P1', 'Aucune campagne Chromium complète ou périphérique physique revendiqué par cette mise à jour', verificationFile, 'Les suites de navigation conservent leurs assertions ; leur présence ne prouve pas leur exécution. Les contrôles Canvas et Node sont recensés séparément.', ''],
  ['TRACKER35-update', 'Suivi', 'Préservation, recalcul et réimportation du classeur', qaStatus, 'P0', 'Moteur tableur principal ; comparaison native et relecture des aperçus avant publication', folder + '/workbook/workbook-review.json', '90 882 cellules de départ contraintes ; onze feuilles, dix tableaux, 42 formules et toutes les notes préservés. Les familles statiques comptent deux bases et ne créent pas neuf poses manquantes. Publication bloquée si les contrôles échouent.', ''],
];
data.qa.push(...qaRows);
const oldCoverage = structuredClone(before.npcCrossoverCoverage), coverage = data.npcCrossoverCoverage;
data.npcCrossoverCoverageHistory.push(oldCoverage);
coverage.previousEvidence = oldCoverage.evidence; coverage.evidence = folder + '/crossovers/manifest.json'; coverage.asOf = '2026-11-24';
coverage.assets.push(...originalAssets); coverage.completedFamilies += originals.length; coverage.publishedPngs += originalAssets.length;
coverage.ribbit.completedSeries = [...new Set([...coverage.ribbit.completedSeries, ...seriesIds])];
coverage.ribbit.completedStyleIds.push(...originals.map(d => d.id)); coverage.ribbit.remainingSeries = []; coverage.ribbit.completedFamilies = 27; coverage.ribbit.completeAcrossAllSeries = true;
coverage.ribbit.completionBasis = 'Required static bases; nine historical eleven-slot families plus eighteen requested two-slot families.';
coverage.ribbit.fullPoseFamilies = 9; coverage.ribbit.baseOnlyFamilies = 18; coverage.ribbit.baseOnlySlots = ['selection', 'stance'];
coverage.pendingFamiliesWithinNineSeries -= 18; coverage.pendingAllNonLegacyFamilies -= 18;
coverage.handDirection = { kind: 'Original artistic decisions recorded per collection and family', canonicalTraitClaim: false, historicalStanceChanged: false, historicalRule: structuredClone(oldCoverage.handDirection), currentCollectionEvidence: seriesIds.map(series => folder + '/crossovers/manifest-' + series + '.json'), scope: 'No universal digit-count rule is imposed on the new designs. Visible hands, gloves and fusion anatomy follow each reviewed family; the historical three-lobe choice remains in its original scope.' };
coverage.scope = 'Ribbit possède les 27 styles des neuf séries pour leurs bases demandées : neuf anciennes familles à onze dessins (99 PNG) et dix-huit familles statiques à deux dessins (36 PNG). Les neuf actions ne sont pas attendues pour ces nouvelles bases. Les 39 autres PNJ et les dix abstractions restent ouverts, soit 1 323 familles potentielles supplémentaires.';
assert.equal(coverage.assets.length, 135); assert.equal(coverage.pendingAllNonLegacyFamilies, 1323);
data.crossoverArtHistory.push(structuredClone(before.crossoverArt));
data.crossoverArt = { ...data.crossoverArt, asOf: '2026-11-24', outfits: 405, costumeDrawings: 3916, promotedNpcOutfits: 27, promotedNpcDrawings: 135, newBaseOnlyFamilies: 18, newBaseOnlyDrawings: 36, completionScope: 'Two required drawings for each new baseOnly family; existing full families retain their authored pose contracts.', evidence: folder + '/crossovers/manifest.json' };
data.costumeAdditionHistory.push({ asOf: '2026-11-24', evidence: before.costumeAdditionReview.evidence, coverage: structuredClone(before.costumeAdditionCoverage), review: structuredClone(before.costumeAdditionReview) });
const costumeCoverage = data.costumeAdditionCoverage;
costumeCoverage.asOf = '2026-11-24'; costumeCoverage.ids.push(...officials.map(d => d.id)); costumeCoverage.sourceIds.push(...officials.map(d => d.sourceId)); costumeCoverage.assets.push(...officialAssets);
costumeCoverage.appearances += 6; costumeCoverage.pngFiles += 12; costumeCoverage.publishedFiles += 12; costumeCoverage.bytes += officialAssets.reduce((n, a) => n + a.bytes, 0);
costumeCoverage.drawingsBySlot.selection += 6; costumeCoverage.drawingsBySlot.stance += 6;
costumeCoverage.fullPoseAppearances = 45; costumeCoverage.baseOnlyAppearances = 6; costumeCoverage.baseOnlySlots = ['selection', 'stance'];
costumeCoverage.scope = '45 anciennes apparences à onze dessins et six nouvelles apparences à deux bases statiques. Les neuf actions ne sont pas attendues pour ces six familles.';
assert.equal(costumeCoverage.appearances, 51); assert.equal(costumeCoverage.pngFiles, 507);
data.costumeAdditionReview = { asOf: '2026-11-24', evidence: verificationFile, workbookEvidence: folder + '/workbook/workbook-review.json', qaRowIds: qaRows.map(r => r[0]), appendedAppearances: 6, appendedIndividualDrawingRows: 12, newNativePngs: 12, priorAppearancesPreserved: 45, newFamiliesBaseOnly: true };
data.historicalCurrentQa.push(structuredClone(before.currentQa));
data.currentQa = { gameVersion: data.version, campaign: 'base-sprites-2026-11-24', complete: false, evidence: verificationFile, workbookEvidence: folder + '/workbook/workbook-review.json', rowIds: qaRows.map(r => r[0]), totals: { nodeTests: proof?.qa.tests || 0, nodePassed: proof?.qa.pass || 0, browserAssertionsExecutedByWorkbookUpdate: 0 }, scope: 'Deux bases statiques par nouvelle famille. Inventaires natifs, contrôles techniques et limites des sources séparés. La campagne navigateur complète et les périphériques physiques restent ouverts.' };
data.qaCampaigns.push({ id: data.currentQa.campaign, asOf: '2026-11-24', evidence: verificationFile, rowIds: qaRows.map(r => r[0]), node: proof?.qa || null, browserCampaignExecuted: false });
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(r => r[3] === status).length]));
data.historicalQaRows = before.qa.length;
Object.assign(data.counts, { variants: 508, crossovers: 405, costumeAdditions: 51, baseOnlyCostumes: 24, baseOnlyOfficialCostumes: 6, baseOnlyCrossoverCostumes: 18, offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES, features: data.features.length, production: data.production.length, qa: data.qa.length });
data.asOf = '2026-11-24'; data.contentAsOf = '2026-11-24';
data.baseSpriteContinuation = { asOf: '2026-11-24', phase: final ? 'verified-static-bases' : 'draft-awaiting-global-evidence', baselineCostumes: 484, addedCostumes: 24, officialAppearances: officials.map(d => d.id), originalCrossoverAppearances: originals.map(d => d.id), requiredSlots: ['selection', 'stance'], authoredPngs: 48, authoredBytes: addedBytes, crossoverFraming: originalAudit.framingSummary, framingEvidence: folder + '/crossovers/visual-review-final.json', newActionPngs: 0, newAnimations: 0, missingRequiredSlots: 0, actionSlotsOutOfScope: true, canonicalPixelCertification: false, assets: assetChecks, evidence: verificationFile, historicalRowsPreserved: true };
for (const [name, key] of Object.entries(tableKeys)) {
  assert.equal(new Set(data[key].map(r => r[0])).size, data[key].length, key + ' unique IDs');
  assert.deepEqual(data[key].slice(0, before[key].length).map(r => r[0]), before[key].map(r => r[0]), key + ' original order');
  assert.deepEqual(data[key].slice(0, before[key].length).map(r => r.at(-1)), before[key].map(r => r.at(-1)), key + ' notes');
  if (key !== 'features') assert.deepEqual(data[key].slice(0, before[key].length), before[key], key + ' unchanged historical rows');
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
    sheet.heights[number] = rowHeight(sheet, row, 42);
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
  H2: 'Version 0.7.0 · bases statiques · 24 novembre 2026',
  H7: 'Sprites de base statiques', H8: '6 apparences officielles · 18 crossovers originaux',
  H13: final ? proof.qa.tests + ' tests Node et deux builds validés' : 'Bilan global du lot en cours',
  H14: 'Campagne navigateur complète et appareils physiques ouverts',
  H15: final ? 'Classeur recalculé, réimporté et comparé au socle' : 'Classeur en préparation ; publication finale ouverte',
  H16: '24 familles · 48 PNG natifs · deux bases chacune',
  A27: 'Filtrer Production par personnage et par contrat de dessins.',
  H30: '24 nouvelles bases statiques · aucun dessin d’action requis',
};
for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
for (const c of summary.cells) if (c[4]) setCell('Synthèse', address(c), evaluate(c[4].slice(1), lookup, 'Synthèse'), c[4]);
for (const [ref, value] of Object.entries({ B7: 64, B8: 640, B9: 27, B10: 184, B11: 508, B12: 64, F15: 107, F16: 3811, F17: 408, F18: 184, F22: 2507, H27: '834 fiches, hors tenues crossover' })) assert.equal(lookup.get('Synthèse').get(ref)[3], value, ref);
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
assert.equal(constrainedCells, 90882);
const targetDir = path.join(output, 'native-target'); await fs.mkdir(targetDir, { recursive: true });
for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
await writeJson(path.join(output, 'combat-tracker-data.json'), data);

const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']];
for (const row of new Set([...changed.values()].filter(c => c.sheet === 'Fonctionnalités').map(c => position(c.cell)[0]))) scopes.push(['Fonctionnalités', 'A' + row + ':I' + row, 'feature-' + data.features[row - 6][0].toLowerCase()]);
scopes.push(['Fonctionnalités', 'A' + (before.features.length + 6) + ':I' + (data.features.length + 5), 'feature-static-bases']);
for (let i = 0; i < definitions.length; i++) {
  const first = before.production.length + 6 + i * 3;
  scopes.push(['Production', 'A' + first + ':J' + (first + 2), 'base-family-' + definitions[i].id]);
}
for (let i = 0; i < qaRows.length; i += 2) { const first = before.qa.length + 6 + i; scopes.push(['QA', 'A' + first + ':I' + Math.min(first + 1, data.qa.length + 5), 'qa-' + (i / 2 + 1)]); }
for (let i = 0; i < newSources.length; i += 3) { const first = before.sources.length + 6 + i; scopes.push(['Références', 'A' + first + ':E' + Math.min(first + 2, data.sources.length + 5), 'references-' + (i / 3 + 1)]); }
scopes.push(['Références', 'A' + (data.sources.length + 6) + ':E' + (data.sources.length + 16), 'references-footer']);
const runtimeSourceHashes = {};
for (const name of (await fs.readdir(path.join(root, 'combat'))).filter(name => name.endsWith('.mjs')).sort()) runtimeSourceHashes['combat/' + name] = hash(await fs.readFile(path.join(root, 'combat', name)));
const plan = {
  schema: 'encore-tracker-static-base-plan/v1', createdAt: new Date().toISOString(), phase: final ? 'final-evidence-confirmed-awaiting-workbook-review' : 'draft-unpublished',
  baselineHashes, baselineSnapshotHashes, historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], approvedRowHeightChanges, evidenceHashes, runtimeSourceHashes,
  counts: { ...data.counts, sheets: 11, nativeTables: [...sheets.values()].reduce((n, s) => n + s.tables.length, 0), sources: data.sources.length, addedProductionRows: productionRows.length, addedQaRows: qaRows.length, declaredArtFiles: 48, verifiedArtFiles: assetChecks.length, totalNativeCells: native.sheets.reduce((n, s) => n + s.cells, 0) },
  appendedProductionIds: productionRows.map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(s => s.id), appendedFeatureIds: featureRows.map(r => r[0]),
  coverageChanges: { addedFighters: 0, addedTechniques: 0, addedStages: 0, addedOfficialCostumes: 6, addedOriginalCrossoverCostumes: 18, addedPngs: 48, newActionPngs: 0, newAnimations: 0, requiredSlotsPerNewFamily: 2, priorCostumesPreserved: 484, historicalRowsPreservedExceptDeclaredCellChanges: true, updatedFeatureIds: Object.keys(updatedFeatures), historicalNotesPreserved: true, historicalCoverageSnapshotsPreserved: true },
  formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: 'E6', scopes,
  historicalFooterShift: shift, assetSlotChecks: assetChecks, activeAssetDigests: assetChecks,
  runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: hash(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) },
  qaEvidence: { final: proof?.qa || null, browserAssertionsExecutedByWorkbookUpdate: 0 },
};
assert.equal(plan.formulas.length, 42); assert.equal(plan.counts.nativeTables, 10); assert.equal(plan.scopes.length, 39);
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

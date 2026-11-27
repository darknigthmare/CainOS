/** Prepare factual companion rows for the 27 November workbook update.
 * This writes JSON only. XLSX authoring belongs to the artifact-tool builder.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const output = path.resolve(flag('--output', path.join(root, 'docs/art-generation/recovery-20261127/tracker-continuation.json')));
const qaFile = flag('--qa-input', null);
const read = async file => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const tracker = await read('docs/combat-tracker-data.json');
assert.equal(tracker.counts.variants, 540, 'Build this one-time continuation from the preserved 25 November baseline');
const { FIGHTERS, STAGES, COSTUMES, BASE_SPRITE_COSTUMES, CROSSOVER_COSTUMES } = await import(pathToFileURL(path.join(root, 'combat/data.mjs')));
const { ART_FILES, ART_BYTES } = await import(pathToFileURL(path.join(root, 'combat/offline-manifest.mjs')));
const { CONTINUATION_20261127_BASE_DEFINITIONS: definitions } = await import(pathToFileURL(path.join(root, 'combat/base-sprite-continuation-20261127.mjs')));
const { REBUILT_STAGE_SCENES } = await import(pathToFileURL(path.join(root, 'combat/stage-scenes-20261127.mjs')));
const art = new Set(ART_FILES), costumes = new Map(COSTUMES.map(c => [c.id, c]));
const baseManifestPath = 'docs/art-generation/recovery-20261127/kaufmo/manifest.json';
const stageManifestPath = 'docs/art-generation/recovery-20261127/stage-files.json';
const manifest = await read(baseManifestPath), stages = await read(stageManifestPath);
const sourceDigests = {};
async function evidence(file, expected) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Evidence must be repository-relative');
  const bytes = await fs.readFile(path.join(root, file)), digest = sha(bytes);
  if (expected) assert.equal(digest, expected, 'Evidence bytes changed: ' + file);
  sourceDigests[file] = digest;
  return bytes;
}
for (const file of [baseManifestPath, stageManifestPath, 'docs/art-generation/recovery-20261127/recovery.json', 'combat/base-sprite-continuation-20261127.mjs', 'combat/base-sprite-content.mjs', 'combat/offline-manifest.mjs', 'combat/stage-scenes-20261127.mjs', 'combat/stage-parallax.mjs', 'combat/render.mjs', 'scripts/build-combat-tracker-continuation-20261127.mjs']) await evidence(file);

assert.equal(definitions.length, manifest.families.length, 'All generated families must have runtime definitions');
assert.equal(FIGHTERS.length, tracker.counts.fighters);
assert.equal(STAGES.length, tracker.counts.stages);
assert.equal(COSTUMES.length, tracker.counts.variants + definitions.length, 'Only complete runtime families count as delivered');
const rows = [], rowUpdates = [], assets = [];
for (const definition of definitions) {
  const family = manifest.families.find(f => f.id === definition.id), costume = costumes.get(definition.id);
  assert(family && costume && costume.baseOnly, 'Family is absent from the playable static-base catalogue: ' + definition.id);
  assert.deepEqual(costume.authoredSlots, ['selection', 'stance']);
  assert.equal(costume.canonicalCostumeClaim, false);
  for (const slot of ['selection', 'stance']) {
    const file = family.files[slot];
    assert(file && art.has('../' + file.path), 'Static base absent from offline manifest');
    const bytes = await evidence(file.path, file.sha256);
    assert.equal(bytes.length, file.bytes);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), file.width); assert.equal(bytes.readUInt32BE(20), file.height);
    assert.equal(bytes[25], 6, 'Static base must retain native RGBA pixels');
    assert.equal(file.nativePixelsUnmodified, true);
    assert.equal(costume.assetReview.sha256[slot], file.sha256);
    assets.push({ id: family.id, slot, file: file.path, sha256: file.sha256, bytes: file.bytes, width: file.width, height: file.height, nativeBytesVerified: true, published: true, publicationScope: 'Fichier présent et référencé dans le manifeste hors ligne du dépôt ; la publication distante relève de la PR.', kind: 'static-base', reviewPath: baseManifestPath, evidence: baseManifestPath, baseOnly: true });
    rows.push([`BASE27-asset-${family.id}-${slot}`, 'Dessin de base', 'Kaufmo', slot === 'selection' ? 'Portrait de sélection' : 'Garde statique', 'Implémenté', 'P1', file.path, `PNG RGBA natif ${file.width} × ${file.height} ; ${file.bytes} octets ; SHA-256 ${file.sha256}.`, 'Un personnage par fichier ; proportions natives et transparence conservées. La présence du PNG ne certifie pas une fidélité canonique 1:1.', '']);
  }
  rows.push([`COST-${family.id}`, 'Costume crossover', 'Kaufmo', definition.name, 'Implémenté', 'P1', `combat/base-sprite-continuation-20261127.mjs · ${definition.directory.replace(/^\.\.\//, '')}`, 'Portrait de sélection et garde statique reliés au catalogue. Les autres états conservent cette même garde ; aucune nouvelle pose d’action.', `${definition.traits.join(' ')} Création originale de fan-game fondée sur les références déclarées ; apparence non canonique.`, '']);
}
assert.equal(manifest.newAppearanceFamilies, definitions.length);
assert.equal(manifest.newNativeImages, assets.length);
assert.equal(stages.length, Object.keys(REBUILT_STAGE_SCENES).length);
const stageNames = new Map(tracker.stages.map(row => [row[0], row[1]]));
for (const stage of stages) {
  const runtime = REBUILT_STAGE_SCENES[stage.id];
  assert(runtime && runtime.path === '../' + stage.path && art.has(runtime.path), 'Stage not active in the runtime manifest');
  const bytes = await evidence(stage.path, stage.sha256);
  assert.equal(bytes.length, stage.bytes);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  const common = `Scène complète PNG ${width} × ${height}, mise à l’échelle uniforme ; léger déplacement de caméra de 6 px. Aucun effet visuel procédural additionnel. Les plans historiques restent disponibles en repli.`;
  rowUpdates.push({ sheet: 'Arènes', id: stage.id, cells: {
    13: `Un PNG complet natif, sans réencodage · ${stage.path}`,
    16: `${common} La piste logique reste à y568 ; les proportions, le cadrage et la profondeur de ce décor sont une adaptation pour Encore.`,
    17: 'Référence visuelle consultée — reconstruction du 27 novembre',
    18: `Référence officielle : ${runtime.sourceUrl}. Le fichier et son intégration sont traçables ; les régions hors cadrage et la fidélité pixel à pixel ne sont pas certifiées. Les ambiances audio existantes restent actives.`,
  } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-background`, cells: { 6: stage.path, 7: common, 8: 'Comparer les repères du décor à la source officielle et vérifier la lisibilité en duel. Un seul PNG complet, pas trois plans indépendants.' } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-floor`, cells: { 6: `${stage.path} · combat/stage-parallax.mjs`, 7: 'Sol inclus dans la scène complète. Ligne logique y568 conservée ; ancrage vertical spécifique pour Sous la carte.', 8: 'Contrôler la lecture des pieds, des ombres et du sol à différents cadrages, sans étirer le PNG.' } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-foreground`, cells: { 4: 'Partiel', 6: stage.path, 7: `Premier plan inclus dans la peinture complète. Ancien near.png conservé comme repli ; aucun plan séparé utilisé pour la scène actuelle.`, 8: 'Maintenir la lisibilité des combattants. La présence du dessin ne vaut pas livraison de trois couches de parallaxe.' } });
  rowUpdates.push({ sheet: 'Production', id: `ANIM-${stage.id}-ambience`, cells: { 3: 'Ambiance visuelle procédurale', 4: 'Partiel', 6: 'combat/render.mjs · combat/stage-scenes-20261127.mjs', 7: 'Effets procéduraux désactivés quand la scène complète est chargée ; léger déplacement de caméra 6 px seulement. Ambiance audio conservée.', 8: 'Aucune boucle visuelle additionnelle revendiquée pour la scène complète. Les effets historiques restent disponibles avec le décor de repli.' } });
  rows.push([`SCENE27-${stage.id}`, 'Décor de référence', stageNames.get(stage.id), 'Scène complète reconstruite', 'Implémenté', 'P1', stage.path, `${width} × ${height} ; ${stage.bytes} octets ; SHA-256 ${stage.sha256}.`, `${common} Référence : ${runtime.sourceUrl}`, '']);
}
const previousCoverage = tracker.npcCrossoverCoverage, coverage = structuredClone(previousCoverage);
coverage.asOf = '2026-11-27'; coverage.assets.push(...assets);
coverage.completedFamilies += definitions.length; coverage.publishedPngs += assets.length;
coverage.ownersWithAnyCrossover = [...new Set([...coverage.ownersWithAnyCrossover, ...definitions.map(d => d.fighterId)])];
coverage.ownersWithoutCrossover = coverage.promotedNpcFighters.filter(id => !coverage.ownersWithAnyCrossover.includes(id));
coverage.pendingFamiliesWithinNineSeries -= definitions.length; coverage.pendingAllNonLegacyFamilies -= definitions.length;
const series = previousCoverage.ribbit.completedSeries;
const completedSeries = series.filter(id => definitions.filter(d => d.crossover.series === id).length === 3);
coverage.kaufmo = { completedSeries, completedStyleIds: definitions.map(d => d.id), remainingSeries: series.filter(id => !completedSeries.includes(id)), completedFamilies: definitions.length, potentialFamilies: 27, completeAcrossAllSeries: definitions.length === 27, completionBasis: 'Deux fichiers statiques natifs par famille : portrait de sélection et garde. Les autres états réutilisent la garde.', fullPoseFamilies: 0, baseOnlyFamilies: definitions.length, baseOnlySlots: ['selection', 'stance'] };
coverage.previousEvidence = previousCoverage.evidence; coverage.evidence = baseManifestPath;
coverage.scope = `Ribbit conserve 27 familles (135 PNG) et Queenie 27 familles (54 PNG). Kaufmo ajoute ${definitions.length} familles statiques (${assets.length} PNG) dans ${completedSeries.length} séries. ${coverage.ownersWithoutCrossover.length} PNJ ne possèdent pas encore de crossover. Restent ${coverage.pendingFamiliesWithinNineSeries} familles potentielles chez les PNJ promus et 270 chez les dix abstractions : créations possibles pour le fan-game, pas apparences officielles manquantes. Les 79 PNG annoncés le 26 novembre n’ont pas été récupérés et ne sont pas additionnés.`;
coverage.handDirection.currentCollectionEvidence = [...coverage.handDirection.currentCollectionEvidence, baseManifestPath];
coverage.handDirection.scope = 'Les choix anatomiques restent propres à chaque collection originale et à ses références déclarées. Les règles historiques de Ribbit et de Queenie sont conservées ; aucune règle de doigts de Kaufmo n’est déduite de celles-ci.';
const crossover = { ...tracker.crossoverArt, asOf: '2026-11-27', outfits: CROSSOVER_COSTUMES.length, costumeDrawings: tracker.crossoverArt.costumeDrawings + assets.length, promotedNpcOutfits: coverage.completedFamilies, promotedNpcDrawings: coverage.publishedPngs, evidence: baseManifestPath, newBaseOnlyFamilies: definitions.length, newBaseOnlyDrawings: assets.length };
const nativeRows = [
  ['REC27-static-files', 'Ressources du 27 novembre', `${assets.length} nouveaux PNG de bases statiques`, 'Réussi', 'P1', 'SHA-256, octets et dimensions PNG comparés au manifeste ; présence au catalogue et manifeste hors ligne.', baseManifestPath, 'Chaque famille possède exactement selection et stance ; aucun des 79 PNG annoncés et non récupérés n’est ajouté.', ''],
  ['REC27-stage-files', 'Ressources du 27 novembre', `${stages.length} scènes complètes reliées aux arènes existantes`, 'Réussi', 'P1', 'SHA-256, octets et correspondance entre scene path, manifeste hors ligne et configuration du runtime.', stageManifestPath, '27 arènes au total, peintures complètes à échelle uniforme ; les anciens fichiers restent disponibles en repli.', ''],
];
let extra = {};
if (qaFile) {
  extra = await read(qaFile);
  await evidence(qaFile);
  for (const [file, digest] of Object.entries(extra.sourceDigests || {})) await evidence(file, digest);
  assert(Array.isArray(extra.qaRows), 'QA input must contain explicit tracker QA rows');
  if (extra.currentQa) assert.equal(extra.currentQa.complete, false, 'No release-level completion claim in this continuation');
}
const importedQaRows = (extra.qaRows || []).map(row => {
  const result = [...row];
  if (result[3] === 'À tester') result[3] = 'Non exécuté';
  assert(Object.hasOwn(tracker.qaSummary, result[3]), 'QA status is outside the existing tracker vocabulary');
  return result;
});
const qaRows = [...nativeRows, ...importedQaRows, ['TRACKER27-extensions', 'Classeur de suivi', 'Extensions, ressources vérifiées et conservation de l’historique', 'Réussi', 'P1', 'Import artifact-tool, recalcul, égalité avec le JSON, export/réimport, comparaison native et revue des rendus. Publication bloquée tant que la revue échoue ou manque.', 'docs/combat-extensions-workbook-verification.json', '12 feuilles existantes conservées ; 2 feuilles ajoutées, 38 sections et 254 fiches. Les 42 formules, les identifiants et les notes restent préservés.', '']];
const qaSummary = Object.fromEntries(Object.keys(tracker.qaSummary).map(key => [key, 0]));
for (const row of [...tracker.qa, ...qaRows]) qaSummary[row[3]] = (qaSummary[row[3]] || 0) + 1;
const counts = { fighters: FIGHTERS.length, stages: STAGES.length, totalStages: STAGES.length, variants: COSTUMES.length, crossovers: CROSSOVER_COSTUMES.length, baseOnlyCostumes: BASE_SPRITE_COSTUMES.length, baseOnlyOfficialCostumes: BASE_SPRITE_COSTUMES.filter(c => !c.crossover).length, baseOnlyCrossoverCostumes: BASE_SPRITE_COSTUMES.filter(c => c.crossover).length, offlineImages: ART_FILES.length, offlineBytes: ART_BYTES, animatedStages: tracker.counts.animatedStages - stages.length, rebuiltStages: stages.length };
assert.equal(counts.baseOnlyCostumes, tracker.counts.baseOnlyCostumes + definitions.length);
assert.equal(counts.offlineImages, tracker.counts.offlineImages + assets.length + stages.length);
assert.equal(counts.offlineBytes, tracker.counts.offlineBytes + assets.reduce((n, a) => n + a.bytes, 0) + stages.reduce((n, a) => n + a.bytes, 0));
assert.equal(crossover.costumeDrawings, ART_FILES.filter(file => file.startsWith('../assets/encore/crossovers/')).length);
const result = {
  schema: 'encore-tracker-continuation/v1', asOf: '2026-11-27',
  summary: `${definitions.length} familles de Kaufmo · ${assets.length} bases · ${stages.length} décors complets`, counts,
  animatedStagesScope: 'Ambiances visuelles procédurales actives ; exclut les scènes complètes qui conservent un léger déplacement de caméra. Les 27 ambiances audio restent actives.',
  productionRows: rows, rowUpdates, qaRows,
  metadataUpdates: {
    npcCrossoverCoverage: coverage,
    npcCrossoverCoverageHistory: [...(tracker.npcCrossoverCoverageHistory || []), previousCoverage],
    crossoverArt: crossover, crossoverArtHistory: [...(tracker.crossoverArtHistory || []), tracker.crossoverArt],
    baseSpriteContinuationHistory: [...(tracker.baseSpriteContinuationHistory || []), tracker.baseSpriteContinuation],
    baseSpriteContinuation: { asOf: '2026-11-27', phase: 'static-bases-only', baselineCostumes: 540, addedCostumes: definitions.length, officialAppearances: [], originalCrossoverAppearances: definitions.map(d => d.id), requiredSlots: ['selection', 'stance'], authoredPngs: assets.length, integratedPngs: assets.length, projectilePngs: 0, authoredBytes: assets.reduce((n, a) => n + a.bytes, 0), generatedThisSessionPngs: assets.length, recoveredPngs: 0, newActionPngs: 0, newAnimations: 0, missingRequiredSlots: 0, actionSlotsOutOfScope: true, canonicalPixelCertification: false, assets, evidence: baseManifestPath, recoveryEvidence: 'docs/art-generation/recovery-20261127/recovery.json', historicalRowsPreservedExceptDeclaredChanges: true },
    qaSummary, qaSummaryScope: 'Lignes historiques conservées ; chaque preuve garde sa date et sa portée. Les contrôles du 27 novembre sont séparés et ne constituent pas une revue de livraison complète.',
  },
  currentQa: extra.currentQa ? { gameVersion: tracker.version, asOf: '2026-11-27', rowIds: qaRows.map(row => row[0]), ...extra.currentQa } : undefined,
  qaSummaryLabel: extra.qaSummaryLabel || undefined, browserSummaryLabel: extra.browserSummaryLabel || undefined,
  sourceDigests,
};
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ output, counts, families: definitions.length, bases: assets.length, stages: stages.length, productionRows: rows.length, changedRows: rowUpdates.length, qaRows: qaRows.length }));

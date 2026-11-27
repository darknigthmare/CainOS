/** Build factual companion rows from the completed native-file manifests.
 * JSON preparation only; XLSX editing belongs to the artifact-tool builder.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const output = path.resolve(flag('--output', path.join(root, 'docs/art-generation/completion-20261127/tracker-completion.json')));
const qaFile = flag('--qa-input', null);
const read = async file => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const tracker = await read('docs/combat-tracker-data.json');
assert.equal(tracker.counts.variants, 546, 'Use the preserved 27 November recovery baseline');
assert.equal(tracker.counts.offlineImages, 6218);
const { FIGHTERS, STAGES, COSTUMES, BASE_SPRITE_COSTUMES, CROSSOVER_COSTUMES } = await import(pathToFileURL(path.join(root, 'combat/data.mjs')));
const { ART_FILES, ART_BYTES } = await import(pathToFileURL(path.join(root, 'combat/offline-manifest.mjs')));
const { COMPLETED_STAGE_SCENES } = await import(pathToFileURL(path.join(root, 'combat/stage-scenes-completion-20261127.mjs')));
const { REBUILT_STAGE_SCENES } = await import(pathToFileURL(path.join(root, 'combat/stage-scenes-20261127.mjs')));
const art = new Set(ART_FILES), costumes = new Map(COSTUMES.map(c => [c.id, c]));
const sourceDigests = {};
async function evidence(file, expected) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Evidence must be repository-relative');
  const bytes = await fs.readFile(path.join(root, file)), digest = sha(bytes);
  if (expected) assert.equal(digest, expected, 'Evidence bytes changed: ' + file);
  sourceDigests[file] = digest;
  return bytes;
}

const definitions = [], manifests = [];
for (const filename of (await fs.readdir(path.join(root, 'combat'))).filter(name => /^base-sprite-completion-20261127-.*\.mjs$/.test(name)).sort()) {
  const file = 'combat/' + filename;
  const module = await import(pathToFileURL(path.join(root, file)));
  const lists = Object.entries(module).filter(([key]) => key.endsWith('_BASE_DEFINITIONS'));
  assert.equal(lists.length, 1, 'One definition list per completion module');
  definitions.push(...lists[0][1].map(definition => ({ ...definition, module: file })));
  await evidence(file);
}
const collectionDir = 'docs/art-generation/completion-20261127';
for (const entry of await fs.readdir(path.join(root, collectionDir), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = `${collectionDir}/${entry.name}/manifest.json`;
  let manifest;
  try { manifest = await read(file); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  if (!Array.isArray(manifest.families)) continue;
  await evidence(file);
  manifests.push({ file, ...manifest });
}
assert.equal(definitions.length, 27, 'The completed lot requires 21 Kaufmo families and 6 Max families');
assert.equal(new Set(definitions.map(row => row.id)).size, definitions.length);
assert.equal(manifests.reduce((n, manifest) => n + manifest.families.length, 0), definitions.length);
assert.equal(COSTUMES.length, tracker.counts.variants + definitions.length);
assert.equal(FIGHTERS.length, tracker.counts.fighters);
assert.equal(STAGES.length, tracker.counts.stages);
for (const file of ['combat/base-sprite-content.mjs', 'combat/offline-manifest.mjs', 'combat/data.mjs', 'combat/stage-scenes-completion-20261127.mjs', 'combat/stage-scenes-20261127.mjs', 'combat/stage-parallax.mjs', 'combat/render.mjs', 'combat/selection-presentation.mjs', 'combat/app.mjs', 'docs/art-generation/completion-20261127/selection/verification.json', 'docs/art-generation/completion-20261127/qa/baseline-ci.json', 'scripts/build-combat-tracker-completion-20261127.mjs']) await evidence(file);

const rows = [], rowUpdates = [], assets = [];
for (const definition of definitions) {
  const manifest = manifests.find(item => item.families.some(family => family.id === definition.id));
  const family = manifest?.families.find(item => item.id === definition.id), costume = costumes.get(definition.id);
  assert(family && costume?.baseOnly, 'Complete family must be playable: ' + definition.id);
  assert.deepEqual(costume.authoredSlots, ['selection', 'stance']);
  assert.equal(costume.canonicalCostumeClaim, false);
  const fighterName = FIGHTERS.find(f => f.id === definition.fighterId).name;
  for (const slot of ['selection', 'stance']) {
    const file = family.files[slot];
    assert(file && art.has('../' + file.path), 'Native asset absent from offline manifest');
    const bytes = await evidence(file.path, file.sha256);
    assert.equal(bytes.length, file.bytes);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), file.width); assert.equal(bytes.readUInt32BE(20), file.height);
    assert.equal(bytes[25], 6, 'Native character drawing must retain RGBA');
    assert.equal(file.nativePixelsUnmodified, true);
    assert.equal(costume.assetReview.sha256[slot], file.sha256);
    assets.push({ id: family.id, slot, file: file.path, sha256: file.sha256, bytes: file.bytes, width: file.width, height: file.height, nativeBytesVerified: true, published: true, publicationScope: 'Référencé par le catalogue et le manifeste hors ligne du dépôt ; la publication distante relève de la PR.', kind: 'static-base', reviewPath: manifest.file, evidence: manifest.file, baseOnly: true });
    rows.push([`COMP27-asset-${family.id}-${slot}`, 'Dessin de base', fighterName, slot === 'selection' ? 'Portrait de sélection' : 'Garde statique', 'Implémenté', 'P1', file.path, `PNG RGBA natif ${file.width} × ${file.height} ; ${file.bytes} octets ; SHA-256 ${file.sha256}.`, 'Un personnage par fichier ; pixels natifs et transparence conservés. Revue technique et comparaison aux références distinctes ; aucune certification canonique à 1:1.', '']);
  }
  rows.push([`COST-${family.id}`, 'Costume crossover', fighterName, definition.name, 'Implémenté', 'P1', `${definition.module} · ${definition.directory.replace(/^\.\.\//, '')}`, 'Portrait et garde séparés reliés au catalogue. Les autres états réutilisent la garde de cette famille ; aucune nouvelle pose d’action.', `${definition.traits.join(' ')} Création originale de fan-game fondée sur les références déclarées ; apparence non canonique.`, '']);
}
assert.equal(assets.length, 54);
assert.equal(manifests.reduce((n, manifest) => n + manifest.newNativeImages, 0), assets.length);

const stageManifestPath = collectionDir + '/stages/manifest.json';
const stageManifest = await read(stageManifestPath); await evidence(stageManifestPath);
const stages = stageManifest.stages;
assert.equal(stages.length, 9); assert.equal(stages.length, Object.keys(COMPLETED_STAGE_SCENES).length);
const stageNames = new Map(tracker.stages.map(row => [row[0], row[1]]));
for (const stage of stages) {
  const runtime = COMPLETED_STAGE_SCENES[stage.id];
  assert(runtime && runtime.path === '../' + stage.path && art.has(runtime.path));
  const bytes = await evidence(stage.path, stage.sha256);
  assert.equal(bytes.length, stage.bytes);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), stage.width); assert.equal(bytes.readUInt32BE(20), stage.height);
  assert.equal(stage.nativePixelsUnmodified, true);
  const common = `Scène complète PNG ${stage.width} × ${stage.height}, échelle uniforme ; léger déplacement de caméra de 6 px. Effets visuels procéduraux additionnels désactivés. Plans historiques conservés en repli.`;
  rowUpdates.push({ sheet: 'Arènes', id: stage.id, cells: {
    13: `Un PNG complet natif, sans réencodage · ${stage.path}`,
    ...(stage.id === 'lake' ? { 14: `ep1 (lac) : ${runtime.sourceUrl}` } : {}),
    16: `${common} Ligne logique y568 conservée ; cadrage et aire de duel adaptés pour Encore.`,
    17: 'Références consultées — peinture complète du 27 novembre',
    18: `Source : ${runtime.sourceUrl}. Composition et continuité hors champ adaptées pour Encore ; géographie intégrale et fidélité pixel à pixel non certifiées. Ambiance audio existante conservée.`,
  } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-background`, cells: { 6: stage.path, 7: common, 8: 'Comparer les repères à la source et vérifier la lisibilité du duel. Un seul PNG complet ; les trois plans historiques ne sont plus la composition active.' } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-floor`, cells: { 6: `${stage.path} · combat/stage-parallax.mjs`, 7: 'Sol intégré à la peinture complète. Ligne de combat y568 conservée.', 8: 'Vérifier l’ancrage des pieds dans les deux sens de caméra ; échelle uniforme du PNG.' } });
  rowUpdates.push({ sheet: 'Production', id: `ART-${stage.id}-foreground`, cells: { 4: 'Partiel', 6: stage.path, 7: 'Premier plan inclus dans la peinture. Ancien near.png disponible en repli ; aucun plan séparé utilisé dans la composition actuelle.', 8: 'La présence du dessin ne constitue pas trois couches indépendantes de parallaxe.' } });
  rowUpdates.push({ sheet: 'Production', id: `ANIM-${stage.id}-ambience`, cells: { 3: 'Ambiance visuelle procédurale', 4: 'Partiel', 6: 'combat/render.mjs · combat/stage-scenes-completion-20261127.mjs', 7: 'Effets procéduraux désactivés quand la peinture est chargée ; déplacement de caméra 6 px seulement. Ambiance audio conservée.', 8: 'Aucune nouvelle boucle visuelle revendiquée. Les effets historiques restent liés au décor de repli.' } });
  rows.push([`COMP27-scene-${stage.id}`, 'Décor de référence', stageNames.get(stage.id), 'Scène complète reconstruite', 'Implémenté', 'P1', stage.path, `${stage.width} × ${stage.height} ; ${stage.bytes} octets ; SHA-256 ${stage.sha256}.`, `${common} Référence : ${runtime.sourceUrl}`, '']);
}
rows.push(['COMP27-selection', 'Présentation du menu', '64 artistes', 'Choix immédiat et retour par côté', 'Implémenté', 'P1', 'combat/selection-presentation.mjs · combat/app.mjs · docs/art-generation/completion-20261127/selection/verification.json', 'Annonce accessible, deux badges en miroir, annulation du dernier artiste/costume par côté et statut de portrait protégé contre les réponses tardives. Retour de focus et nettoyage des historiques au départ du menu ou combat.', 'Présentation statique reliée aux identifiants de la bible. Les 64 entrées et 64 sorties dessinées restent à produire ; aucun nouveau cycle ni geste individuel revendiqué.', '']);
rowUpdates.push({ sheet: 'Fonctionnalités', id: 'PRE-01', cells: { 5: 'combat/app.mjs · combat/selection-presentation.mjs · assets/encore/selection/', 6: '64 portraits, choix immédiat, annonce accessible, badges J1/J2 en miroir et annulation indépendante du dernier choix. Les anciens chargements ne changent pas le statut du nouveau portrait.', 7: 'Les silhouettes, kits, profils et replays restent distincts. Présentation statique ; gestes d’entrée/sortie et modèle complet des huit états de la bible non livrés dans cette passe.' } });
rowUpdates.push({ sheet: 'Fonctionnalités', id: 'PRE-BASE-35', cells: { 5: 'combat/base-sprite-content.mjs · combat/base-sprite-completion-20261127-*.mjs · combat/illustrations.mjs · combat/render.mjs', 6: `${BASE_SPRITE_COSTUMES.length} familles statiques disponibles après vérification des deux PNG : portrait et garde. Cette reprise ajoute 27 familles, 21 de Kaufmo et 6 de Max.`, 7: 'Les états sans dessin propre utilisent la garde de la même famille. Aucun chargement d’action ni repli vers le costume normal ; corps et kit de combat conservés.' } });
rowUpdates.push({ sheet: 'Fonctionnalités', id: 'PRE-02', cells: { 5: 'combat/stage-scenes-20261127.mjs · combat/stage-scenes-completion-20261127.mjs · combat/stage-parallax.mjs', 6: '27 arènes communes, dont 13 peintures complètes et 14 compositions en trois plans ; les 64 arrangements par combattant restent disponibles.', 7: 'Références et limites de chaque peinture documentées. Les cadrages et continuités hors champ sont des adaptations pour Encore ; la présence des scènes ne certifie pas une fidélité canonique 1:1.' } });

const previousCoverage = tracker.npcCrossoverCoverage, coverage = structuredClone(previousCoverage);
coverage.asOf = '2026-11-27'; coverage.assets.push(...assets);
coverage.completedFamilies += definitions.length; coverage.publishedPngs += assets.length;
coverage.ownersWithAnyCrossover = [...new Set([...coverage.ownersWithAnyCrossover, ...definitions.map(d => d.fighterId)])];
coverage.ownersWithoutCrossover = coverage.promotedNpcFighters.filter(id => !coverage.ownersWithAnyCrossover.includes(id));
coverage.pendingFamiliesWithinNineSeries -= definitions.length; coverage.pendingAllNonLegacyFamilies -= definitions.length;
const series = previousCoverage.ribbit.completedSeries;
for (const fighterId of ['kaufmo', 'max']) {
  const familyList = CROSSOVER_COSTUMES.filter(costume => costume.fighterId === fighterId);
  const completedSeries = series.filter(id => familyList.filter(costume => costume.crossover.series === id).length === 3);
  coverage[fighterId] = { completedSeries, completedStyleIds: familyList.map(costume => costume.id), remainingSeries: series.filter(id => !completedSeries.includes(id)), completedFamilies: familyList.length, potentialFamilies: 27, completeAcrossAllSeries: familyList.length === 27, completionBasis: 'Deux dessins statiques par famille : portrait et garde. Les états non dessinés réutilisent cette garde.', fullPoseFamilies: 0, baseOnlyFamilies: familyList.length, baseOnlySlots: ['selection', 'stance'] };
}
assert.equal(coverage.kaufmo.completedFamilies, 27); assert.equal(coverage.max.completedFamilies, 6);
coverage.previousEvidence = previousCoverage.evidence; coverage.evidence = collectionDir + '/tracker-completion.json';
coverage.scope = `Ribbit et Queenie conservent leurs 27 familles chacun. Kaufmo atteint 27 familles statiques sur 9 séries ; Max possède 6 familles dans Murder Drones et Meta Runner. ${coverage.ownersWithoutCrossover.length} PNJ n’ont pas encore de crossover. Restent ${coverage.pendingFamiliesWithinNineSeries} familles potentielles chez les PNJ promus et 270 chez les dix abstractions ; ces possibilités de fan-game ne sont pas des apparitions officielles manquantes. Le lot de 79 PNG annoncé auparavant est couvert par 79 générations nouvelles tracées (16 + 63), sans fichier annoncé récupéré ni double comptage.`;
coverage.handDirection.currentCollectionEvidence.push(...manifests.map(manifest => manifest.file));
coverage.handDirection.scope = 'Les choix anatomiques restent propres à chaque collection originale et à ses références. Les décisions historiques de Ribbit et Queenie ne sont pas transposées à Kaufmo ou Max.';
const crossover = { ...tracker.crossoverArt, asOf: '2026-11-27', outfits: CROSSOVER_COSTUMES.length, costumeDrawings: tracker.crossoverArt.costumeDrawings + assets.length, promotedNpcOutfits: coverage.completedFamilies, promotedNpcDrawings: coverage.publishedPngs, evidence: collectionDir + '/tracker-completion.json', newBaseOnlyFamilies: definitions.length, newBaseOnlyDrawings: assets.length };
const counts = { fighters: FIGHTERS.length, stages: STAGES.length, totalStages: STAGES.length, variants: COSTUMES.length, crossovers: CROSSOVER_COSTUMES.length, baseOnlyCostumes: BASE_SPRITE_COSTUMES.length, baseOnlyOfficialCostumes: BASE_SPRITE_COSTUMES.filter(costume => !costume.crossover).length, baseOnlyCrossoverCostumes: BASE_SPRITE_COSTUMES.filter(costume => costume.crossover).length, offlineImages: ART_FILES.length, offlineBytes: ART_BYTES, animatedStages: tracker.counts.animatedStages - stages.length, rebuiltStages: Object.keys(REBUILT_STAGE_SCENES).length };
assert.equal(counts.variants, 573); assert.equal(counts.baseOnlyCostumes, 89);
assert.equal(counts.crossovers, 465); assert.equal(counts.rebuiltStages, 13); assert.equal(counts.animatedStages, 14);
assert.equal(counts.offlineImages, tracker.counts.offlineImages + assets.length + stages.length);
assert.equal(counts.offlineBytes, tracker.counts.offlineBytes + assets.reduce((n, asset) => n + asset.bytes, 0) + stages.reduce((n, stage) => n + stage.bytes, 0));
assert.equal(crossover.costumeDrawings, ART_FILES.filter(file => file.startsWith('../assets/encore/crossovers/')).length);

assert(qaFile, '--qa-input must identify the final, scoped QA facts before workbook preparation');
const extra = await read(qaFile); await evidence(qaFile);
for (const [file, digest] of Object.entries(extra.sourceDigests || {})) await evidence(file, digest);
assert(Array.isArray(extra.qaRows));
assert(extra.currentQa && typeof extra.currentQa.complete === 'boolean', 'QA input must declare its exact completion scope');
const nativeRows = [
  ['COMP27-static-files', 'Ressources du 27 novembre', '54 PNG neufs dans 27 familles de Kaufmo et Max', 'Réussi', 'P1', 'SHA-256, octets, dimensions, RGBA et chemins comparés aux manifestes et au catalogue actif.', collectionDir + '/tracker-completion.json', 'Portrait + garde, aucun dessin d’action supplémentaire ; fichiers natifs conservés.', ''],
  ['COMP27-stage-files', 'Ressources du 27 novembre', '9 peintures complètes supplémentaires', 'Réussi', 'P1', 'SHA-256, dimensions et chemins comparés au manifeste hors ligne et à la configuration des arènes.', stageManifestPath, '27 arènes au total : 13 scènes complètes et 14 compositions en trois plans. Anciens fichiers conservés en repli.', ''],
  ['COMP27-baseline-ci', 'CI historique confirmée', 'Commit cc972c8 : 473 tests Node et 477 contrôles navigateur réussis', 'Réussi', 'P1', 'Run 45949935433 terminé avec succès : 43 suites Node et 21 suites navigateur. Résumé exact des logs conservé.', collectionDir + '/qa/baseline-ci.json', 'Ce résultat porte sur le commit antérieur. Il ne valide pas les ajouts de cette tranche ni la 22e suite nouvellement enregistrée.', ''],
];
const qaRows = [...nativeRows, ...extra.qaRows];
for (const row of qaRows) { assert.equal(row.length, 9); assert(Object.hasOwn(tracker.qaSummary, row[3])); }
const qaSummary = Object.fromEntries(Object.keys(tracker.qaSummary).map(key => [key, 0]));
for (const row of [...tracker.qa, ...qaRows]) qaSummary[row[3]] = (qaSummary[row[3]] || 0) + 1;
const extensionRowUpdates = [{ id: 'EN-G32', cells: {
  4: 'Partiel — menu statique', 5: extra.selectionTestLabel || 'Node 11/11 ; navigateur incomplet',
  6: 'Choix immédiat, annonce accessible, deux badges en miroir, annulation par côté et chargement de portrait protégé. Les gestes des 64 fiches et le modèle complet des huit états restent à produire.',
  7: '11 régressions Node, relecture du nettoyage à la navigation et au combat. Parcours réseau retardé, clavier, retour exact du costume et 390 px enregistrés en CI ; leur résultat final doit rester distinct de la tentative locale interrompue.',
  8: tracker.extensionsIntegration.rows.find(row => row[0] === 'EN-G32')[8] + '\ndocs/art-generation/completion-20261127/selection/verification.json',
} }];
const result = {
  schema: 'encore-tracker-completion/v1', asOf: '2026-11-27', baselineCommit: 'cc972c8412bddb5278ef7c609dd82897325a2922',
  summary: '27 familles · 54 bases · 9 décors complets', counts, productionRows: rows, rowUpdates, extensionRowUpdates, qaRows,
  metadataUpdates: {
    npcCrossoverCoverage: coverage, npcCrossoverCoverageHistory: [...(tracker.npcCrossoverCoverageHistory || []), previousCoverage],
    crossoverArt: crossover, crossoverArtHistory: [...(tracker.crossoverArtHistory || []), tracker.crossoverArt],
    baseSpriteContinuationHistory: [...(tracker.baseSpriteContinuationHistory || []), tracker.baseSpriteContinuation],
    baseSpriteContinuation: { asOf: '2026-11-27', phase: 'static-bases-only', baselineCostumes: 546, addedCostumes: definitions.length, officialAppearances: [], originalCrossoverAppearances: definitions.map(definition => definition.id), requiredSlots: ['selection', 'stance'], authoredPngs: assets.length, integratedPngs: assets.length, projectilePngs: 0, authoredBytes: assets.reduce((n, asset) => n + asset.bytes, 0), generatedThisSessionPngs: assets.length, recoveredPngs: 0, newActionPngs: 0, newAnimations: 0, missingRequiredSlots: 0, actionSlotsOutOfScope: true, canonicalPixelCertification: false, assets, evidence: collectionDir + '/tracker-completion.json', historicalRowsPreservedExceptDeclaredChanges: true },
    qaSummary, qaSummaryScope: 'Historique conservé avec dates et portée ; CI cc972c8 séparée de la QA des ajouts. Les lignes du classeur ne remplacent pas les preuves versionnées.',
  },
  completion: { asOf: '2026-11-27', previousAnnouncedPngs: 79, previousFilesRecovered: 0, priorNewPngs: 16, newPngs: 63, cumulativeReplacementPngs: 79, lotCoveredByNewTraceableGenerations: true, authoredStaticPngs: 54, newStagePaintings: 9, newAnimations: 0, canonicalOneToOneCertified: false, manifestFiles: manifests.map(manifest => manifest.file), stageManifest: stageManifestPath },
  currentQa: { gameVersion: tracker.version, asOf: '2026-11-27', rowIds: qaRows.map(row => row[0]), ...extra.currentQa },
  qaSummaryLabel: extra.qaSummaryLabel || 'QA des ajouts : voir les preuves datées',
  browserSummaryLabel: extra.browserSummaryLabel || 'Nouvelle CI à confirmer · parcours local interrompu',
  sourceDigests,
};
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ output, counts, newFamilies: definitions.length, newPngs: assets.length + stages.length, productionRows: rows.length, changedRows: rowUpdates.length, qaRows: qaRows.length }));

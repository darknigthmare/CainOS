/**
 * Publish the reviewed Artifact export and companion JSON as one recoverable
 * local update. No Git, remote publication or mutation of historical QA files.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
assert(args.includes('--publish-final'), 'Use --publish-final only after current art, runtime, native workbook and visual evidence are complete.');
const root = path.resolve(flag('--repo-root', process.cwd()));
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/queenie_tracker_20261125')));
const docDir = 'docs/art-generation/base-sprites-20261125-b/workbook';
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJson = async (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const p = await json(path.join(output, 'update-plan.json'));
assert.equal(p.phase, 'final-evidence-confirmed-awaiting-workbook-review');
assert.equal(p.counts.verifiedArtFiles, 72);
assert.equal(p.counts.variants, 540);
assert.equal(p.counts.crossovers, 432);
assert.equal(p.counts.projectileMotifs, 23);
assert.equal(p.counts.totalStages, 36);
assert.equal(p.counts.costumeAdditions, 56);
assert.equal(p.counts.updatedStoryRows, 10);
assert.equal(p.coverageChanges.requiredSlotsPerNewFamily, 2);
assert.equal(p.coverageChanges.newActionPngs, 0);
assert.equal(p.historicalCellsConstrained, 91743);
assert.equal(p.formulas.length, 42);
assert.equal(p.counts.nativeTables, 10);
const comparison = await json(path.join(output, 'native-comparison.json'));
const imported = await json(path.join(output, 'reimport-result.json'));
const authored = await json(path.join(output, 'authoring-result.json'));
const visual = await json(path.join(output, 'visual-review.json'));
const baselineVisual = await json(path.join(output, 'baseline-visual-review.json'));
const data = await json(path.join(output, 'combat-tracker-data.json'));
const xlsxName = 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx';
const workbookSHA256 = hash(await fs.readFile(path.join(output, xlsxName)));
const trackerDataSHA256 = hash(await fs.readFile(path.join(output, 'combat-tracker-data.json')));
const planSHA256 = hash(await fs.readFile(path.join(output, 'update-plan.json')));
for (const file of ['tests/combat-story-presentation-browser.mjs', 'tests/combat-readability-browser.mjs']) assert.match(p.qaSourceHashes[file], /^[a-f0-9]{64}$/);
assert.equal(comparison.status, 'passed'); assert.equal(comparison.differences.length, 0);
assert.equal(comparison.cellsChecked, p.counts.totalNativeCells);
assert.equal(imported.status, 'passed'); assert.equal(imported.allTableRowsCompared, true);
assert.equal(authored.representativeStatusRecalculationPassed, true);
assert.equal(visual.status, 'accepted');
assert.equal(baselineVisual.status, 'accepted_as_baseline');
assert.equal(baselineVisual.workbookSHA256, p.baselineHashes['docs/' + xlsxName]);
assert.equal(comparison.actualSHA256, workbookSHA256);
for (const result of [imported, authored]) {
  assert.equal(result.sha256, workbookSHA256);
  assert.equal(result.planSha256, planSHA256);
  assert.equal(result.trackerDataSha256, trackerDataSHA256);
}
assert.equal(visual.workbookSHA256, workbookSHA256); assert.equal(visual.planSha256, planSHA256);
assert.deepEqual(visual.views.map(v => v.file).sort(), p.scopes.map(s => s[2] + '.png').sort());
for (const review of [visual, baselineVisual]) for (const view of review.views) assert.equal(hash(await fs.readFile(path.join(output, view.file))), view.sha256, 'Visual proof changed: ' + view.file);
const targetManifest = await json(path.join(output, 'native-target/manifest.json'));
const targetHashes = {}, reimportHashes = {};
for (const file of ['manifest.json', ...targetManifest.sheets.map(s => s.file)]) {
  targetHashes[file] = hash(await fs.readFile(path.join(output, 'native-target', file)));
  reimportHashes[file] = hash(await fs.readFile(path.join(output, 'native-reimport', file)));
}
assert.deepEqual(comparison.expectedSnapshotHashes, targetHashes);
assert.equal((await json(path.join(output, 'native-reimport/manifest.json'))).sha256, workbookSHA256);
for (const [file, expected] of Object.entries(p.baselineHashes)) assert.equal(hash(await fs.readFile(path.join(root, file))), expected, 'Installed baseline changed: ' + file);
for (const [file, expected] of Object.entries({ ...p.evidenceHashes, ...p.runtimeSourceHashes, ...p.qaSourceHashes, ...p.authoringSourceHashes })) assert.equal(hash(await fs.readFile(path.join(root, file))), expected, 'Source or evidence changed after planning: ' + file);
for (const asset of p.activeAssetDigests) {
  const bytes = await fs.readFile(path.join(root, asset.file));
  assert.equal(hash(bytes), asset.sha256, asset.file);
  assert.equal(bytes.length, asset.bytes, asset.file);
}
assert.equal(p.qaEvidence.final.fail, 0);
assert.equal(p.qaEvidence.final.pass, p.qaEvidence.final.tests);
assert.equal(p.qaEvidence.final.bothBuildsPassed, true);
const sourceDigests = { ...p.evidenceHashes, ...p.runtimeSourceHashes, ...p.qaSourceHashes, ...p.authoringSourceHashes };
for (const file of [
  'scripts/prepare-combat-base-sprites-tracker-20261125.mjs',
  'scripts/update-combat-abstractions-workbook-20261124.mjs',
  'scripts/publish-combat-base-sprites-workbook-20261125.mjs',
  'scripts/inspect-combat-workbook-native.py',
  'scripts/workbook-publication.mjs',
]) sourceDigests[file] = hash(await fs.readFile(path.join(root, file)));
const report = {
  schema: 'encore-tracker-static-base-review/v2',
  createdAt: new Date().toISOString(), gameVersion: data.version,
  workbookSHA256, trackerDataSHA256, sourceDigests,
  baselineHashes: p.baselineHashes, baselineSnapshotHashes: p.baselineSnapshotHashes,
  counts: p.counts, runtimeManifest: p.runtimeManifest, currentQa: data.currentQa,
  formulas: { count: 42, recalculated: true, errors: 0, statusChangeRecalculated: true, exportRoundTripPassed: true },
  nativeComparison: comparison, reimport: imported, visualReview: visual, baselineVisualReview: baselineVisual,
  historicalCellsConstrained: p.historicalCellsConstrained, originalIdsAndOrderPreserved: true, userNotesPreserved: true,
  historicalEvidencePreserved: true, coverageChanges: p.coverageChanges,
  appendedProductionIds: p.appendedProductionIds, appendedQaIds: p.appendedQaIds,
  appendedSourceIds: p.appendedSourceIds, appendedFeatureIds: p.appendedFeatureIds,
  assetSlotChecks: p.assetSlotChecks,
  qaEvidence: p.qaEvidence, releaseReviewed: false, fullCiExecutedByWorkbookUpdate: false, canonicalVisualApproval: false,
  limitations: [
    'The published 508-costume baseline and its historical QA remain preserved; the recovered lot A and completed lot B append 32 appearances. The prior local 522-costume prefix is also preserved.',
    'The 91,743 baseline cells, eleven sheets, ten native tables, user notes and forty-two formulas were constrained before authoring with public Artifact APIs.',
    '64 native base images and eight dedicated projectile motifs are covered by their reviews, executed Node checks and dated builds. Lot A contributes 32 recovered files. Lot B contributes 11 recovered and 29 newly generated files. Previous delivery evidence remains historical.',
    'Five appearances adapted from official references and 27 original Queenie crossovers remain distinct. Each new family requires selection and stance only; action images and animation cycles are outside this request. No canonical pixel certification is asserted.',
    'Ten existing ending-panel records now match the calibration stage. Their browser six-distinct-image check remains intact and unexecuted locally, as does the corrected two-identity archive search.',
    'No desktop Excel session, complete local browser campaign or physical-device test is claimed by this workbook update. Its checks use the primary spreadsheet runtime and the recorded game evidence.',
    'This script publishes local workbook files only; Git and release publication are recorded separately.',
  ],
};
await writeJson(path.join(output, 'workbook-review.json'), report);
await writeJson(path.join(output, 'combat-workbook-verification.json'), report);
const { publishWorkbookArtifacts } = await import(pathToFileURL(path.join(root, 'scripts/workbook-publication.mjs')).href);
const names = [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json'];
// Install the dated evidence before replacing the canonical three files.
// An interrupted evidence copy therefore leaves the old workbook and its
// references intact, and the existing baseline gate permits a safe retry.
const destination = path.join(root, docDir); await fs.mkdir(destination, { recursive: true });
async function copyEvidence(file) {
  await fs.copyFile(path.join(output, file), path.join(destination, file));
  assert.equal(hash(await fs.readFile(path.join(destination, file))), hash(await fs.readFile(path.join(output, file))), 'Copied evidence differs: ' + file);
}
for (const file of ['workbook-review.json', 'update-plan.json', 'native-comparison.json', 'reimport-result.json', 'authoring-result.json', 'visual-review.json', 'baseline-visual-review.json', 'baseline-freeze.json', 'formula-error-scan.ndjson']) await copyEvidence(file);
for (const review of [visual, baselineVisual]) for (const view of review.views) await copyEvidence(view.file);
await writeJson(path.join(destination, 'native-snapshot-hashes.json'), { baseline: p.baselineSnapshotHashes, target: targetHashes, reimport: reimportHashes });
await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: names.map(name => ({ source: path.join(output, name), name })) });
const published = {};
for (const name of names) {
  published[name] = hash(await fs.readFile(path.join(root, 'docs', name)));
  assert.equal(published[name], hash(await fs.readFile(path.join(output, name))));
}
const historicalQaHash = hash(await fs.readFile(path.join(root, 'docs/combat-qa-evidence-0.7.0.json')));
assert.equal(historicalQaHash, p.baselineHashes['docs/combat-qa-evidence-0.7.0.json']);
await writeJson(path.join(destination, 'publication.json'), { status: 'published_locally_verified', createdAt: new Date().toISOString(), files: published, historicalQaEvidencePreserved: true, historicalQaEvidenceSHA256: historicalQaHash, gitPublishedByThisScript: false });
await fs.writeFile(path.join(destination, 'README.md'), [
  '# Suivi des bases statiques — 25 novembre 2026', '',
  'Le classeur reprend les 91 743 cellules du suivi publié : onze feuilles, dix tableaux, 42 formules, ordre et notes conservés. Les totaux sont 64 combattants, 640 techniques, 36 arènes (27 partagées et neuf crossovers), 23 projectiles et 184 fiches. Les apparences équipables passent de 508 à 540, dont 432 crossovers.', '',
  'Les lots A et B ajoutent cinq apparences adaptées de références officielles et 27 créations crossover de Queenie. Chaque famille demande un portrait et une garde : 32 familles, 64 bases et huit projectiles, soit 72 PNG. Le lot A apporte 32 fichiers récupérés. Le lot B comprend onze fichiers récupérés et 29 générés dans cette continuation. Aucune animation nouvelle ; les anciennes familles à onze dessins conservent leur contrat.', '',
  'Le suivi ajoute 104 lignes Production, onze constats QA et ' + p.appendedSourceIds.length + ' références. Quatre fonctionnalités existantes reflètent les nouveaux totaux et le paquet hors ligne. Les dix conclusions des abstractions sont corrigées sur place pour citer la Salle de calibration ; leurs chapitres jouables restent inchangés.', '',
  'Les cinq apparences de référence sont comparées aux vues réellement documentées. Les accessoires, proportions et parties masquées restent limités aux références ; les créations crossover sont décrites comme originales. Aucune correspondance pixel à pixel n’est certifiée.', '',
  'Le moteur tableur principal a écrit le fichier, recalculé ses 42 formules et vérifié un changement de statut réversible. La réimportation compare les dix tableaux au JSON compagnon. La comparaison native contrôle ' + p.counts.totalNativeCells + ' cellules, avec les 91 743 cellules de départ contraintes. Les ' + p.scopes.length + ' aperçus finaux recensés dans visual-review.json ont été relus.', '',
  'Les preuves finales du jeu sont enregistrées séparément dans ../verification.json. Les corrections de présentation et de recherche gardent une validation navigateur ouverte. L’exigence de six images distinctes et les deux identités de Pomni sont conservées. Cette mise à jour du classeur ne revendique aucune campagne navigateur complète ni aucun essai de périphérique physique.', '',
  'workbook-review.json relie les données, les sources, les inventaires, les aperçus et le XLSX par SHA-256. publication.json décrit le remplacement local contrôlé ; les publications Git et les releases relèvent d’un autre relevé.', '',
].join('\n'));
console.log(JSON.stringify({ status: 'published_locally_verified', counts: p.counts, workbookSHA256, trackerDataSHA256, historicalQaEvidencePreserved: true }));

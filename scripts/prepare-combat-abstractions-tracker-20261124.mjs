/**
 * Plan a bounded extension of the restored, published Café tracker.
 * This script edits JSON planning snapshots only. The companion author uses
 * public @oai/artifact-tool APIs to write and recalculate the actual workbook.
 * Until --final-evidence-confirmed is supplied, new artwork remains unverified
 * and the outputs are a draft outside docs; the historical 480-costume baseline
 * is never treated as an installed 483-costume Sunset export.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/abstractions-tracker-20261124')));
const final = args.includes('--final-evidence-confirmed');
const folder = 'docs/art-generation/abstractions-20261124';
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value) => fs.writeFile(file, JSON.stringify(value, null, 2) + '\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const moduleAt = file => import(pathToFileURL(path.join(root, file)).href);
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const address = c => col(c[1]) + c[0];
const position = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref.replaceAll('$', '')); assert(m); return [Number(m[2]), [...m[1]].reduce((v, c) => v * 26 + c.charCodeAt(0) - 64, 0)]; };
const tableKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
assert.notEqual(output, path.join(root, 'docs'));
const freeze = await json(path.join(output, 'baseline-freeze.json'));
const baselineHashes = {};
for (const [file, entry] of Object.entries(freeze.files)) {
  const installed = await fs.readFile(path.join(root, file));
  assert.equal(hash(installed), entry.sha256, 'Installed baseline changed: ' + file);
  assert.equal(installed.length, entry.bytes);
  assert.equal(hash(await fs.readFile(path.join(output, 'baseline', path.basename(file)))), entry.sha256);
  baselineHashes[file] = entry.sha256;
}
const data = await json(path.join(output, 'baseline/combat-tracker-data.json'));
const before = structuredClone(data);
assert.equal(before.counts.fighters, 54); assert.equal(before.counts.variants, 480);
assert.equal(before.production.length, 3344); assert.equal(before.sources.length, 164);
const native = await json(path.join(output, 'native-baseline/manifest.json'));
assert.equal(native.sha256, baselineHashes['docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx']);
assert.equal(native.sheets.length, 11);
assert.equal(native.sheets.reduce((n, s) => n + s.cells, 0), 83423);
const sheets = new Map(), baselineSnapshotHashes = {};
for (const file of ['manifest.json', ...native.sheets.map(s => s.file)]) baselineSnapshotHashes[file] = hash(await fs.readFile(path.join(output, 'native-baseline', file)));
for (const entry of native.sheets) sheets.set(entry.name, await json(path.join(output, 'native-baseline', entry.file)));
const sourceSheets = structuredClone([...sheets]);
const [
  runtime, abstractions, fidelity, stories, tournaments, finishers, friendships,
  presentation, audio, projectileArt, sunset, offline,
] = await Promise.all([
  'combat/data.mjs', 'combat/abstractions-content.mjs', 'combat/fidelity.mjs',
  'combat/stories.mjs', 'combat/tournament-lore.mjs', 'combat/finisher-catalog.mjs',
  'combat/friendship-catalog.mjs', 'combat/render-sequences.mjs', 'combat/audio.mjs',
  'combat/projectile-art.mjs', 'combat/crossover-sunset-recovery-20261124.mjs',
  'combat/offline-manifest.mjs',
].map(moduleAt));
const { FIGHTERS, MOVES, STAGES, VARIANTS, COSTUMES, ROSTER_ARCHIVE, DEDICATED_STAGES, MOVE_SLOTS, SLOT_LABELS } = runtime;
const { ABSTRACTION_IDS, ABSTRACTION_DEFS, ABSTRACTION_CALM_ID, ABSTRACTION_APPEARANCE_IDS, ABSTRACTION_ART_SLOTS, ABSTRACTION_SOURCES } = abstractions;
const ids = new Set(ABSTRACTION_IDS), appearances = [...ABSTRACTION_APPEARANCE_IDS];
const newFighters = FIGHTERS.filter(f => ids.has(f.id)), newMoves = MOVES.filter(m => ids.has(m.fighterId));
const newStages = STAGES.filter(s => ['memoryfracture', 'abstractionthreshold'].includes(s.id));
assert.equal(newFighters.length, 10); assert.equal(newMoves.length, 100); assert.equal(newStages.length, 2); assert.equal(appearances.length, 11);
assert.deepEqual(FIGHTERS.slice(0, 54).map(f => f.id), before.roster.map(r => r[0]));
assert.deepEqual(STAGES.slice(0, 25).map(s => s.id), before.stages.map(r => r[0]));
const sunsetIds = new Set(sunset.SUNSET_RECOVERY_DEFINITIONS.map(d => d.id));
const activeSunset = COSTUMES.filter(c => sunsetIds.has(c.id));
assert([0, 3].includes(activeSunset.length), 'Sunset installation must be all-or-nothing');
assert.equal(COSTUMES.length, 481 + activeSunset.length);
const sources = new Map([...runtime.SOURCES, ...fidelity.FIDELITY_SOURCES].map(s => [s.id, s]));
const fById = new Map(FIGHTERS.map(f => [f.id, f]));
const stageById = new Map(STAGES.map(s => [s.id, s]));
const nameOf = id => fById.get(id)?.name || id;
const evidenceHashes = {};
async function evidence(file) {
  const bytes = await fs.readFile(path.join(root, file));
  evidenceHashes[file] = hash(bytes);
  return file.endsWith('.json') ? JSON.parse(bytes) : bytes;
}
const contentLog = (await evidence(folder + '/recovery-content-tests.log')).toString('utf8');
const lastCount = (text, name) => { const matches = [...text.matchAll(new RegExp('^(?:#|ℹ) ' + name + ' (\\d+)$', 'gm'))]; assert(matches.length, 'Missing test count ' + name); return Number(matches.at(-1)[1]); };
const contentQa = { tests: lastCount(contentLog, 'tests'), pass: lastCount(contentLog, 'pass'), fail: lastCount(contentLog, 'fail'), skipped: lastCount(contentLog, 'skipped') };
assert.equal(contentQa.tests, 85); assert.equal(contentQa.pass, 85); assert.equal(contentQa.fail, 0); assert.equal(contentQa.skipped, 0);
let proof = null, inventory = null;
const assetChecks = [];
const assetPaths = [
  ...appearances.flatMap(id => ABSTRACTION_ART_SLOTS.map(slot => 'assets/encore/abstractions/' + id + '/' + slot + '.png')),
  ...Object.keys(projectileArt.PROJECTILE_ART).map(id => 'assets/encore/projectiles/' + id + '.png'),
  ...newStages.flatMap(s => ['far', 'mid', 'near'].map(layer => 'assets/encore/stages/' + s.id + '/' + layer + '.png')),
];
assert.equal(assetPaths.length, 142); assert.equal(new Set(assetPaths).size, 142);
if (final) {
  proof = await evidence(folder + '/verification.json');
  inventory = await evidence(folder + '/asset-inventory.json');
  assert.equal(inventory.complete, true);
  assert.equal(inventory.counts.verified, 142); assert.equal(inventory.counts.newNativeAdditions, 136); assert.equal(inventory.counts.reusedPortraits, 6);
  assert.deepEqual(inventory.failures, []);
  assert.equal(proof.qa.fail, 0); assert.equal(proof.qa.pass, proof.qa.tests); assert.equal(proof.qa.bothBuildsPassed, true);
  assert(proof.qa.tests >= contentQa.tests);
  assert(proof.status?.startsWith('passed') || proof.status === 'complete');
  const records = inventory.files || inventory.records || inventory.assets;
  assert(Array.isArray(records)); assert.equal(records.length, 142);
  for (const file of assetPaths) {
    const record = records.find(r => (r.file || r.path || r.target) === file); assert(record, 'Missing native inventory: ' + file);
    assert.equal(record.nativeBytesVerified, true, 'Native-byte comparison incomplete: ' + file);
    const bytes = await fs.readFile(path.join(root, file));
    assert.equal(bytes.length, record.bytes, file);
    assert.equal(hash(bytes), record.sha256, file);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    const opaqueStage = file.startsWith('assets/encore/stages/') && file.endsWith('/far.png');
    assert(opaqueStage ? [2, 6].includes(bytes[25]) : bytes[25] === 6, 'Native PNG color type: ' + file);
    assert(offline.ART_FILES.includes('../' + file), 'Native image absent from the offline manifest: ' + file);
    assetChecks.push({ file, bytes: bytes.length, sha256: hash(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), colorType: bytes[25], source: record.provenance || record.native || record.source || null, nativeComparison: record.nativeBytesVerified });
  }
}
const artStatus = final ? 'Implémenté' : 'À vérifier';
const technicalStatus = final ? 'Repères statiques intégrés et contrôlés ; animation complète et comparaison canonique ouvertes.' : 'Fichiers déclarés ; nouvelle génération et revue technique en cours après restauration.';
const sourceLabel = value => value === 'original-encore' ? 'Création originale Encore' : value === 'archive-attribution' ? 'Attribution d’archive non confirmée' : 'Identité officielle ; dessin de jeu à comparer';
function fidelityCells(record) {
  assert(record && Array.isArray(record.sourceIds) && Array.isArray(record.observedTraits));
  const references = record.sourceIds.map(id => { const source = sources.get(id); assert(source?.url, id); return id + ' : ' + source.url; });
  return [
    references.join('\n') || 'Sans référence canonique : création originale Encore',
    record.observedTraits.join('\n') || 'Aucun repère visuel primaire consigné dans cette revue.',
    record.combatAdaptation, record.reviewStatus, record.reviewScope,
  ];
}
function moveDetails(m) {
  const parts = ['Niveau : ' + m.level, 'Catégorie : ' + m.tag];
  for (const [key, label] of Object.entries({ cooldown: 'Recharge', status: 'Statut', duration: 'Durée', speed: 'Vitesse', life: 'Vie', height: 'Hauteur', count: 'Projectiles', interval: 'Intervalle', returnAt: 'Retour', bounces: 'Rebonds', fuse: 'Mèche', radius: 'Rayon', travel: 'Déplacement', launch: 'Projection', blink: 'Décalage', parryMode: 'Parade', arm: 'Armement', maxTraps: 'Pièges', hp: 'PV du piège', buff: 'Bonus', hits: 'Impacts', heal: 'Soins', restore: 'Stabilité' })) if (m[key] !== undefined) parts.push(label + ' : ' + m[key]);
  if (m.lowProfile) parts.push('Profil bas');
  if (m.projectileOrigin) parts.push('Origine du tir propre au corps : ' + JSON.stringify(m.projectileOrigin));
  return parts.join(' · ');
}
const rosterRows = newFighters.map(f => [
  f.id, f.name, f.role, 'Oui', 'Implémenté', 'Partiel', 'Automatique réussi', 'Partiel', MOVE_SLOTS.length,
  f.stats.health, f.power, f.speed, f.reach, f.sprite.src.replace('../', ''),
  '11 repères distincts : sélection, garde et neuf actions. ' + technicalStatus + (f.visual.maxIllustratedWidth ? ' Largeur illustrée plafonnée à ' + f.visual.maxIllustratedWidth + ' px par mise à l’échelle uniforme.' : ''),
  f.loreSource, sourceLabel(f.sourceKind) + '. Kit et corps de collision propres ; aucune identité normale recyclée.',
  f.combat.simulationBody.width + ' × ' + f.combat.simulationBody.height + ' px · accroupi ' + f.combat.simulationBody.crouchHeight + ' px',
  'Saut ' + f.stats.jump + ' px/frame · Défense ×' + f.stats.defense + ' · ' + f.combat.resource.label + ' ' + f.combat.resource.max + ', régénération ' + f.combat.resource.regen + '/frame',
  f.combat.links.map(chain => chain.map(slot => SLOT_LABELS[slot]).join(' → ')).join(' · '),
  ...fidelityCells(f.fidelity), '',
]);
const moveRows = newMoves.map(m => [m.id, m.fighterName, SLOT_LABELS[m.slot], m.name, m.kind, m.startup, m.active, m.recovery, m.damage || 0, m.reach || 0, m.cost || 0, m.meter || 0, moveDetails(m), 'Implémenté', 'À vérifier', 'adaptation', m.description, ...fidelityCells(m.fidelity), '']);
const stageRows = newStages.map(s => [s.id, s.name, 'Implémenté', 'Partiel', s.theme, s.width, s.floor, s.bounds.left, s.bounds.right, 'Aucune collision de décor', 'Prévu', s.sourceId, s.description + '\nMusique : ' + audio.AUDIO_THEMES[s.id].title + ' · ' + audio.AUDIO_THEMES[s.id].bpm + ' BPM.', s.sourceStatus, ...fidelityCells(s.fidelity), '']);
function atlasRow(a, previous) {
  const variant = VARIANTS.find(v => v.id === a.id), fighter = fById.get(a.id), fid = variant?.fidelity || fighter?.fidelity;
  const review = variant?.fidelity.assetReview;
  const reviewCells = review ? [review.status, review.visibleTraits.join('\n'), review.identityEvidence, review.framing, review.transparency, review.proportions + (variant.visual?.maxIllustratedWidth ? '\nLargeur illustrée plafonnée à ' + variant.visual.maxIllustratedWidth + ' px ; mise à l’échelle uniforme, sans modification du corps de collision.' : ''), review.issues.join('\n'), review.captureId || 'Revue après restauration : ' + folder + '/calm-asset-review.json', ...fidelityCells(fid)] : ['Voir la fiche Combattants', '', sourceLabel(fighter.sourceKind), '', '', '', '', '', ...fidelityCells(fid)];
  const row = [a.id, a.name, variant ? 'Variante visuelle' : 'Combattant jouable', variant?.fighterId || a.id, 'Implémenté', 'À vérifier', a.sprite.sheet || 'abstractions-20261124', a.sprite.src.replace('../', ''), a.sprite.cols, a.sprite.rows, a.sprite.col, a.sprite.row, a.sourceAge, a.provenance, a.source, variant ? 'Kit de Queenie abstraite' : '10 techniques propres', '11 repères attendus. ' + technicalStatus, a.classificationReason + ' ' + (variant ? 'L’état calme reste une apparence du même combattant.' : sourceLabel(fighter.sourceKind) + '. Comparaison primaire et animation complète ouvertes.'), 'P1', ...reviewCells, previous?.at(-1) ?? ''];
  assert.equal(row.length, 33);
  // Keep the labels and archival provenance that explain the pre-existing entry.
  if (previous) for (const i of [0, 1, 12, 13, 14, 32]) row[i] = previous[i];
  return row;
}
const promotedIds = [...ABSTRACTION_IDS.slice(0, 5), ABSTRACTION_CALM_ID];
for (const id of promotedIds) { const i = data.atlas.findIndex(r => r[0] === id); assert(i >= 0); data.atlas[i] = atlasRow(ROSTER_ARCHIVE.find(a => a.id === id), data.atlas[i]); }
const atlasRows = ROSTER_ARCHIVE.filter(a => ids.has(a.id) && !before.atlas.some(r => r[0] === a.id)).map(a => atlasRow(a));
assert.equal(atlasRows.length, 5);

const productionRows = [];
const addProduction = (id, domain, owner, element, status, file, resource, accept, priority = 'P1') => productionRows.push([id, domain, owner, element, status, priority, file, resource, accept, '']);
const slotNames = { selection: 'Sélection', stance: 'Garde', intro: 'Introduction', attack: 'Attaque', heavy: 'Attaque forte', hit: 'Impact reçu', walk: 'Marche', jump: 'Saut', crouch: 'Accroupissement', victory: 'Victoire', defeat: 'Défaite' };
const copiedPortraits = new Set([...ABSTRACTION_IDS.slice(0, 5), ABSTRACTION_CALM_ID]);
const checksByFile = new Map(assetChecks.map(r => [r.file, r]));
function assetResource(file, copied = false) {
  const c = checksByFile.get(file);
  return (copied ? 'Portrait antérieur conservé octet pour octet. ' : 'Dessin original statique adapté pour Encore. ') + (c ? c.width + ' × ' + c.height + ' px · ' + (c.colorType === 2 ? 'RGB opaque' : 'RGBA') + ' · ' + c.bytes + ' octets\nSHA-256 : ' + c.sha256 + '\nInventaire : ' + folder + '/asset-inventory.json' : 'Réception, empreinte native, transparence et revue en jeu en attente.');
}
for (const id of appearances) {
  const def = ABSTRACTION_DEFS.find(f => f.id === id), label = def?.name || 'Queenie abstraite — état calme';
  addProduction('ABS34-family-' + id, 'Forme abstraite', label, 'Famille de onze repères statiques', final ? 'Implémenté' : 'Partiel', 'assets/encore/abstractions/' + id + '/', technicalStatus, (id === ABSTRACTION_CALM_ID ? 'Même kit et corps que Queenie abstraite. ' : sourceLabel(def.sourceKind) + '. ') + 'Cycles animés complets, comparaison primaire et validation 1:1 ouverts.');
  for (const slot of ABSTRACTION_ART_SLOTS) {
    const file = 'assets/encore/abstractions/' + id + '/' + slot + '.png';
    addProduction('ABS34-asset-' + id + '-' + slot, 'Dessin d’abstraction', label, slotNames[slot], artStatus, file, assetResource(file, slot === 'selection' && copiedPortraits.has(id)), 'Conserver les octets natifs et l’alpha ; vérifier cadre, appuis, deux sens de rendu et silhouette. Les poses dessinées restent des adaptations, sans certification canonique.');
  }
}
for (const [id, item] of Object.entries(projectileArt.PROJECTILE_ART)) {
  const file = item.src.replace('../', '');
  addProduction('ABS34-projectile-' + id, 'Projectile illustré', id, 'Motif natif de projectile', artStatus, file, assetResource(file), 'Rendu ancré au projectile simulé, réflexion conservant le motif, dimensions et origine lisibles. Accessoire original, aucun pouvoir canonique supplémentaire.');
}
for (const s of newStages) for (const layer of ['far', 'mid', 'near']) {
  const file = 'assets/encore/stages/' + s.id + '/' + layer + '.png';
  addProduction('ABS34-stage-' + s.id + '-' + layer, 'Plan d’arène', s.name, ({ far: 'Arrière-plan', mid: 'Plan intermédiaire', near: 'Premier plan' })[layer], artStatus, file, assetResource(file), 'Décor original Encore. Sol de simulation à y568 dégagé, profondeur lisible, mêmes cadrages dans CainOS et Encore ; aucun lieu officiel revendiqué.');
}
const scenarioRows = [];
for (const f of newFighters) {
  const route = stories.STORY_ROUTES[f.id], cup = tournaments.TOURNAMENT_LORE[f.id];
  const home = DEDICATED_STAGES.find(s => s.dedicatedTo === f.id); assert(home);
  addProduction('ABS34-home-' + f.id, 'Arrangement d’arène', f.name, home.name, 'Implémenté', 'combat/data.mjs', home.description, 'Même piste et collisions que le décor commun ; palette et attribution originales explicites.');
  scenarioRows.push(['STORY-' + f.id, 'Route individuelle', f.name + ' · ' + route.title, 'Introduction : ' + route.intro + '\nPrologue : ' + route.prologue.map(p => p.title).join(' ; ') + '\nConclusion : ' + route.ending + '\nÉpilogue : ' + route.epilogue.map(p => p.title).join(' ; ') + '\n' + route.writingApproach, 'Rencontres', route.chapters.length, route.chapters.map(c => nameOf(c.opponentId)).join(' → '), 'Implémenté', 'P1', 'combat/abstractions-narrative.mjs / combat/stories.mjs / combat/progression.mjs', '']);
  for (const panel of [...route.prologue, ...route.epilogue]) addProduction('ABS34-panel-' + panel.id, 'Tableau d’histoire', f.name, panel.title, 'Implémenté', 'combat/abstractions-narrative.mjs / combat/story-presentation.mjs', panel.summary + '\nComposition : ' + panel.composition + ' · Arène : ' + stageById.get(panel.stageId).name, 'Narration originale sans voix prêtée à l’abstraction. Portraits et décors partagés ; aucun dessin narratif dédié ni guérison canonique.');
  for (const [i, chapter] of route.chapters.entries()) {
    const prose = chapter.summary + '\nArène : ' + stageById.get(chapter.stageId).name + '.\n' + chapter.dialogue.map(line => line.speaker + ' : ' + line.text).join('\n');
    scenarioRows.push(['STORY-' + f.id + '-' + (i + 1), 'Chapitre jouable', (i + 1) + '. ' + chapter.title, prose, 'Victoire', 1, nameOf(chapter.opponentId), 'Implémenté', 'P1', 'combat/abstractions-narrative.mjs / combat/stories.mjs', '']);
    addProduction('ABS34-briefing-' + f.id + '-' + (i + 1), 'Briefing illustré', f.name, chapter.title, 'Implémenté', 'combat/story-presentation.mjs / combat/abstractions-narrative.mjs', prose, 'Narration et adversaires distincts ; route de quatre rencontres sérialisable, attribution officielle / archive / original conservée.');
  }
  scenarioRows.push(['TOURNOI-' + f.id, 'Tournoi à tableau', f.name + ' · ' + cup.intro.title, cup.intro.summary + '\nCouronnement : ' + cup.ending, 'Trois victoires joueur', 3, nameOf(cup.rivalId), 'Implémenté', 'P1', 'combat/tournament-lore.mjs / combat/progression.mjs', '']);
  for (const row of finishers.FINISHER_CATALOG.filter(r => r.fighterId === f.id)) addProduction('ABS34-finale-' + row.id.replace('.', '-'), 'Finition visuelle', f.name, row.title, 'Partiel', 'combat/finisher-catalog.mjs / combat/render-finishers.mjs', row.beats.map(b => b.title + ' : ' + b.description).join('\n'), row.remainingArtWork);
  const friend = friendships.FRIENDSHIP_CATALOG.find(r => r.fighterId === f.id); assert(friend);
  addProduction('ABS34-friendship-' + f.id, 'Numéro d’amitié', f.name, friend.title, 'Implémenté', 'combat/friendship-catalog.mjs / combat/render-finishers.mjs', friend.adaptation, friend.remainingArtWork);
  for (const event of presentation.SEQUENCE_EVENTS) addProduction('ABS34-sequence-' + f.id + '-' + event, 'Présentation individuelle', f.name, event, 'Implémenté', 'combat/render-sequences.mjs / combat/render-poses.mjs', 'Rythme propre à cette abstraction. Les cinq événements utilisent sa famille d’images, avec l’état calme pour Queenie si sélectionné.', 'Animation procédurale de repères statiques ; aucune substitution de Pomni ni cycle animé dessiné complet.');
}
for (const s of newStages) {
  const theme = audio.AUDIO_THEMES[s.id]; assert(theme);
  addProduction('ABS34-music-' + s.id, 'Arène', s.name, 'Musique de l’arène', 'Implémenté', 'combat/audio.mjs', theme.title + ' · ' + theme.bpm + ' BPM · composition procédurale originale', 'Boucle, arrêt et reprise, volumes indépendants. Écoute sur appareils physiques ouverte.');
  addProduction('ABS34-ambience-' + s.id, 'Arène', s.name, 'Ambiance sonore', 'Implémenté', 'combat/audio-ambiences.mjs / combat/audio.mjs', 'Ambiance procédurale originale : souffle, pulsations et espaces du décor.', 'Contrôles audio automatisés du lot ; mixage sur appareils physiques à vérifier.');
  addProduction('ABS34-motion-' + s.id, 'Animation d’arène', s.name, 'Ambiance visuelle animée', 'Implémenté', 'combat/render-stage-motion.mjs', 'Mouvement de fond original, figé en mode mouvements réduits.', 'Garder le sol et les attaques lisibles ; revue Canvas séparée de la simulation.');
}
assert.equal(productionRows.length, 359); assert.equal(scenarioRows.length, 60);
const sunsetRows = [], sunsetAssetChecks = [];
if (activeSunset.length) {
  const sunsetInventory = await evidence('docs/art-generation/sunsetparadise-ribbit-20261124/content-integration.json');
  assert.equal(sunsetInventory.status, 'native-families-integrated');
  assert.equal(sunsetInventory.files.length, 33);
  for (const record of sunsetInventory.files) {
    const bytes = await fs.readFile(path.join(root, record.file));
    assert.equal(hash(bytes), record.sha256, 'Installed Sunset PNG changed');
    assert.equal(bytes.length, record.bytes);
    assert.equal(bytes[25], 6);
    if (final) assert(offline.ART_FILES.includes('../' + record.file), 'Sunset PNG missing from offline manifest');
    sunsetAssetChecks.push(record);
  }
  for (const d of sunset.SUNSET_RECOVERY_DEFINITIONS) {
    const directory = 'assets/encore/crossovers/sunsetparadise/ribbit/' + d.style;
    sunsetRows.push(['SUNSET34-family-' + d.id, 'Costume crossover', 'Ribbit', d.name, final ? 'Implémenté' : 'Partiel', 'P1', directory + '/', 'Onze repères statiques originaux ; tenue d’hommage, résidente ou fusion corporelle.', 'Création pour Encore inspirée de Sunset Paradise. Aucun costume officiel de Ribbit ni fidélité 1:1 revendiqués.', '']);
    for (const slot of sunset.SUNSET_RECOVERY_SLOTS) sunsetRows.push(['SUNSET34-asset-' + d.style + '-' + slot, 'Dessin de tenue', 'Ribbit · ' + d.name, slotNames[slot], final ? 'Implémenté' : 'À vérifier', 'P1', directory + '/' + slot + '.png', 'Copie native vérifiée avant activation par le manifeste de récupération Sunset.', 'Conserver le dessin et son alpha ; lire les directions et les proportions dans les onze états. Les cycles animés complets restent ouverts.', '']);
  }
}
const qaRows = [
  ['ABS34-art', 'Illustrations', '121 repères d’abstraction, 15 projectiles et six plans', final ? 'Réussi' : 'À vérifier', 'P0', 'Inventaire natif, SHA-256 et revue visuelle séparés de la fidélité canonique', folder + '/asset-inventory.json / ' + folder + '/verification.json', final ? '142 fichiers intégrés : 136 nouveaux dessins et six portraits conservés.' : 'Images en cours de restauration ; aucun résultat du disque perdu transféré comme validation actuelle.', ''],
  ['ABS34-content', 'Moteur et contenu', 'Dix identités, cent techniques et corps distincts', 'Réussi', 'P0', 'Suites Node ciblées exécutées après restauration', folder + '/recovery-content-tests.log', contentQa.pass + '/' + contentQa.tests + ' tests réussis, zéro échec et zéro ignoré ; calme Queenie rattaché au même kit.', ''],
  ['ABS34-history', 'Compatibilité', '54 combattants antérieurs et programmes historiques', 'Réussi', 'P0', 'Empreintes du socle intact et 77 programmes × cinq points de reprise', 'tests/combat-abstractions.test.mjs / tests/fixtures/abstractions-recovery-20261124.json', '385 restaurations, suites et reprises après défaite ; 54 combattants, 480 costumes, histoires et arrangements antérieurs inchangés.', ''],
  ['ABS34-global', 'Intégration', 'Tests du jeu, projectiles, décors et deux builds', final ? 'Réussi' : 'À vérifier', 'P0', 'Bilan final du lot, distinct des 85 tests ciblés', folder + '/verification.json', final ? proof.qa.tests + ' tests réussis et deux builds validés ; limites Canvas / navigateur explicites dans la preuve.' : 'Le bilan global et les deux builds attendent la fin des illustrations.', ''],
  ['ABS34-browser', 'Navigateur', 'Interactions DOM et périphériques physiques', 'Non exécuté', 'P1', 'Environnement local ; aucune campagne Chromium complète revendiquée', 'tests/combat-roster-browser.mjs / tests/combat-merge-browser.mjs', 'Suites adaptées au catalogue 64 sans retirer leurs contrôles ; parcours navigateur et appareils physiques ouverts.', ''],
  ['TRACKER34-update', 'Suivi', 'Préservation du classeur, recalcul et réimportation', final ? 'Réussi' : 'À vérifier', 'P0', 'Moteur tableur principal, comparaison native et aperçus relus avant publication', folder + '/workbook/workbook-review.json', '83 423 cellules historiques contraintes, notes conservées, 42 formules recalculées et dix tableaux comparés au JSON compagnon. Publication refusée si une de ces étapes échoue.', ''],
];
const newSources = [
  ...ABSTRACTION_SOURCES,
  { id: 'encore-original-abstractions-20261124', title: 'Encore — cinq abstractions originales et deux lieux inventés', kind: 'Définitions originales du fan-game', url: 'combat/abstractions-content.mjs', scope: 'Pomni, Ragatha, Gangle, Kinger et Zooble reçoivent des formes abstraites complètes inventées pour Encore. Memoryfracture et abstractionthreshold sont des lieux originaux. Ces définitions, techniques et histoires ne sont pas des apparitions officielles.' },
  { id: 'encore-abstraction-recovery-20261124', title: 'Encore — inventaire et limites de la reprise du 24 novembre', kind: 'Preuve technique du projet ; validation canonique ouverte', url: folder + '/verification.json', scope: '142 fichiers déclarés : 121 repères pour onze apparences, quinze motifs de projectile et six plans de décor. Six portraits sont conservés, 136 dessins sont nouveaux. Les preuves du disque perdu restent historiques ; seuls les contrôles exécutés sur les nouveaux fichiers comptent comme vérification de cette reprise.' },
];
for (const d of sunset.SUNSET_RECOVERY_DEFINITIONS.filter(d => activeSunset.some(c => c.id === d.id))) newSources.push({ id: 'encore-sunset-ribbit-' + d.style + '-20261124', title: 'Ribbit × Sunset Paradise — ' + d.name, kind: 'Création originale ; motifs de série référencés', url: 'https://www.glitchprod.com/sunset-paradise', scope: 'Design original de récupération : ' + d.name + '. Les références de série orientent couleurs, vêtements et univers ; le corps amphibien, les poses et la combinaison avec Ribbit appartiennent au fan-game. Aucun costume canonique ni modèle 1:1 revendiqué. Définitions : combat/crossover-sunset-recovery-20261124.mjs.' });
assert.equal(newSources.length, 3 + activeSunset.length);

data.roster.push(...rosterRows); data.moves.push(...moveRows); data.stages.push(...stageRows);
data.atlas.push(...atlasRows); data.production.push(...productionRows, ...sunsetRows);
data.scenarios.push(...scenarioRows); data.qa.push(...qaRows); data.sources.push(...newSources);
const featureChanges = {
  'CQC-24': { 6: '192 présentations de KO, trois par artiste. Les trente nouvelles finales d’abstraction utilisent une composition procédurale ; leurs décors dédiés et cycles animés restent à produire.' },
  'MOD-09': { 6: '64 routes individuelles : introduction, quatre rencontres et arènes propres, puis conclusion. Les dix routes d’abstraction emploient une narration silencieuse ; les autres conservent leurs dialogues.' },
  'PRE-01': { 2: 'Sélection de 64 combattants', 7: 'Chaque identité jouable possède son portrait, son kit et son corps de collision. Costumes et archives gardent une classification distincte ; leur présence ne vaut pas validation visuelle 1:1.' },
  'PRE-02': { 2: '27 arènes thématiques' },
  'PRE-03': {
    6: COSTUMES.length + ' tenues équipables : 52 variantes d’archive, 45 tenues Circus et ' + (384 + activeSunset.length) + ' crossovers dans 9 collections. Le joueur et le rival peuvent utiliser des apparences différentes.',
    7: 'Les 378 crossovers des 14 propriétaires historiques restent intacts. Ribbit possède trois styles Murder Drones et trois styles Meta Runner' + (activeSunset.length ? ', puis trois styles Sunset Paradise ; ses six autres séries' : ' ; ses sept autres séries') + ' restent manquantes. Les 39 autres PNJ promus et les dix nouvelles abstractions n’ont pas de tenue crossover. Fusions et rôles originaux.',
  },
  'PRE-04': { 2: 'Catalogue de 184 apparences' },
  'PRE-09': { 6: '27 thèmes originaux de synthèse, un par arène, avec leur tempo et leur mélodie. Les réglages de musique et de bruitages sont indépendants.' },
  'PRD-06': { 6: 'Consigner les repères visibles, l’identité, le cadre, la transparence, les proportions, les points à revoir et la capture ou le relevé technique de chacune des 52 variantes.' },
  'PRD-10': { 6: 'Réconcilier 64 combattants, 52 variantes compatibles et 68 archives sans kit, soit 184 entrées conservées. Les attributions non confirmées et les créations originales restent explicites.' },
  'PRD-11': { 6: 'Documenter 64 combattants, 640 techniques, 27 arènes, 52 variantes d’archive, 45 tenues Circus et ' + (384 + activeSunset.length) + ' crossovers, avec leurs repères, classifications et limites de référence.' },
  'PRE-16': { 6: '320 séquences finies : introduction, victoire et défaite de manche, victoire et défaite de match. Dix rythmes propres aux abstractions ; une égalité reste neutre.' },
  'PRE-17': { 6: '27 ambiances derrière les combattants, au-dessus du sol de simulation ; le réglage de mouvements réduits fige les effets.' },
  'PRE-20': {
    6: '384 tableaux de prologue et d’épilogue, puis 256 briefings avant les duels. Les dix nouvelles routes restent entièrement narrées, sans réversion ni guérison canonique.',
    7: '140 dessins narratifs historiques conservés. Les nouvelles routes composent leurs tableaux avec les portraits et les décors communs ; elles n’ajoutent pas de dessin narratif dédié. Dialogues et mises en scène restent des adaptations françaises pour Encore.',
  },
  'PRE-21': { 6: '27 ambiances originales avec volume indépendant, arrêt à la pause et changement d’arène.' },
};
for (const [id, fields] of Object.entries(featureChanges)) {
  const row = data.features.find(r => r[0] === id); assert(row);
  for (const [column, text] of Object.entries(fields)) row[Number(column)] = text;
}
const grouped = number => new Intl.NumberFormat('fr-FR').format(number);
const sourceChanges = {
  'stage-ambiences': { scope: '27 ambiances visuelles derrière les combattants. Le réglage de mouvements réduits fige leurs effets.' },
  music: { scope: '26 motifs synthétiques et 27 thèmes originaux composés pour Encore.' },
  'audio-ambiences-07': { title: 'Encore — 27 ambiances sonores' },
  offline: { scope: grouped(offline.ART_FILES.length) + ' images et ' + grouped(offline.ART_BYTES) + ' octets dans le manifeste local. La publication GitHub est vérifiée séparément.' },
};
for (const [id, fields] of Object.entries(sourceChanges)) { const source = data.sources.find(s => s.id === id); assert(source); Object.assign(source, fields); }
const newDedicatedStages = DEDICATED_STAGES.filter(stage => ids.has(stage.dedicatedTo));
assert.equal(newDedicatedStages.length, 10);
data.dedicatedStages.push(...newDedicatedStages.map(stage => ({ id: stage.id, fighterId: stage.dedicatedTo, name: stage.name, baseStageId: stage.theme, description: stage.description, sharedArtwork: true, reviewStatus: 'À vérifier' })));
assert.deepEqual(data.dedicatedStages.slice(0, before.dedicatedStages.length), before.dedicatedStages);
assert.equal(data.dedicatedStages.length, 64);
data.characterCoverageScope = 'Relevé historique conservé du socle publié avant la reprise du 24 novembre ; les 121 repères supplémentaires et leurs onze familles sont décrits dans abstractionContinuation et dans l’inventaire natif daté.';
data.illustratedAssetsScope = 'Répartition historique conservée. Les comptages actuels complets proviennent du manifeste hors ligne ; les ajouts d’abstraction et Sunset sont consignés séparément dans abstractionContinuation et crossoverArt.';
data.crossoverArtHistory = [...(data.crossoverArtHistory || []), { asOf: before.asOf, counts: structuredClone(before.crossoverArt), reason: 'Socle conservé avant les trois familles Sunset Paradise du 24 novembre.' }];
data.crossoverArt = { ...before.crossoverArt, asOf: '2026-11-24', outfits: 384 + activeSunset.length, costumeDrawings: 3847 + sunsetAssetChecks.length, promotedNpcOutfits: 6 + activeSunset.length, promotedNpcDrawings: 66 + sunsetAssetChecks.length, heavyAttacksScope: '14 attaques fortes de combattants historiques ; ce champ ne compte pas les poses fortes des tenues.', evidence: activeSunset.length ? 'docs/art-generation/sunsetparadise-ribbit-20261124/content-integration.json' : before.npcCrossoverCoverage.evidence };
data.npcCrossoverCoverageHistory = [...(data.npcCrossoverCoverageHistory || []), structuredClone(before.npcCrossoverCoverage)];
const coverage = data.npcCrossoverCoverage;
coverage.asOf = '2026-11-24';
coverage.completedFamilies = 6 + activeSunset.length; coverage.publishedPngs = 66 + sunsetAssetChecks.length;
coverage.assets.push(...sunsetAssetChecks.map(record => ({ ...record, nativeBytesVerified: true, evidence: 'docs/art-generation/sunsetparadise-ribbit-20261124/content-integration.json' })));
coverage.ribbit.completedSeries = [...before.npcCrossoverCoverage.ribbit.completedSeries, ...(activeSunset.length ? ['sunsetparadise'] : [])];
coverage.ribbit.completedStyleIds = [...before.npcCrossoverCoverage.ribbit.completedStyleIds, ...activeSunset.map(costume => costume.id)];
coverage.ribbit.remainingSeries = before.npcCrossoverCoverage.ribbit.remainingSeries.filter(series => !activeSunset.length || series !== 'sunsetparadise');
coverage.ribbit.completedFamilies = coverage.completedFamilies;
coverage.pendingFamiliesWithinNineSeries = 1074 - activeSunset.length;
coverage.additionalAbstractionFighters = [...ABSTRACTION_IDS];
coverage.additionalAbstractionFamilies = ABSTRACTION_IDS.length * 9 * 3;
coverage.pendingAllNonLegacyFamilies = coverage.pendingFamiliesWithinNineSeries + coverage.additionalAbstractionFamilies;
coverage.scope = 'Le groupe historique des 40 PNJ promus est conservé. Ribbit possède ' + coverage.ribbit.completedSeries.length + ' collections et ' + coverage.completedFamilies + ' styles ; ses ' + coverage.ribbit.remainingSeries.length + ' autres séries et les 39 autres PNJ restent ouverts. Les dix nouvelles abstractions sont comptées séparément : 270 familles potentielles supplémentaires, aucune tenue crossover intégrée pour elles.';
coverage.previousEvidence = before.npcCrossoverCoverage.evidence;
if (activeSunset.length) coverage.evidence = 'docs/art-generation/sunsetparadise-ribbit-20261124/content-integration.json';
data.contentAsOf = '2026-11-24';
data.asOf = '2026-11-24';
data.counts = { ...data.counts, fighters: 64, moves: 640, stages: 27, atlas: 184, variants: COSTUMES.length, archiveOnly: ROSTER_ARCHIVE.filter(a => !a.playable && !VARIANTS.some(v => v.id === a.id)).length, archiveVariants: 52, storyRoutes: 64, storyChapters: 256, storyPanels: 384, storyBriefings: 256, musicThemes: 27, presentationSequences: 320, animatedStages: 27, finishers: 192, audioAmbiences: 27, dedicatedStages: 64, friendships: 64, crossovers: 384 + activeSunset.length, production: data.production.length, scenarios: data.scenarios.length, qa: data.qa.length, offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES };
data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(status => [status, data.qa.filter(r => r[3] === status).length]));
data.qaSummaryScope = 'Lignes historiques conservées et preuves datées ; les différentes campagnes ne sont pas additionnées comme une exécution unique. La reprise du 24 novembre est identifiée séparément.';
data.historicalCurrentQa = [...(Array.isArray(data.historicalCurrentQa) ? data.historicalCurrentQa : data.historicalCurrentQa ? [data.historicalCurrentQa] : []), before.currentQa];
data.currentQa = { gameVersion: data.version, campaign: 'abstractions-recovery-2026-11-24', complete: false, evidence: folder + '/verification.json', workbookEvidence: folder + '/workbook/workbook-review.json', rowIds: qaRows.map(r => r[0]), totals: { nodeTests: final ? proof.qa.tests : contentQa.tests, nodePassed: final ? proof.qa.pass : contentQa.pass, browserAssertionsExecutedByWorkbookUpdate: 0 }, scope: final ? 'Preuves finales de reprise importées avec leurs empreintes ; comparaison canonique et appareils physiques ouverts.' : 'Préparation du suivi. Les 85 tests ciblés sont exécutés ; art, bilan global et classeur final attendent leurs vérifications.' };
data.abstractionContinuation = { asOf: '2026-11-24', phase: final ? 'reviewed-static-art-with-open-canonical-comparison' : 'draft-awaiting-current-art-evidence', baselineCostumes: 480, addedFighters: 10, addedTechniques: 100, officialIdentities: ['abstractedjax', 'abstractedqueenie'], unconfirmedArchiveAttributions: ['cellarabstraction', 'aquaticabstraction', 'abstractedribbit'], originalIdentities: ABSTRACTION_IDS.slice(5), calmCostume: ABSTRACTION_CALM_ID, addedStages: newStages.map(s => s.id), integratedFileCount: final ? 142 : 0, declaredFileCount: 142, newDrawings: 136, copiedPortraits: 6, artworkStatus: artStatus, sunset: { definitions: 3, activeCostumes: activeSunset.length, declaredDrawings: 33, status: activeSunset.length ? 'installed-after-native-inventory' : 'inactive-awaiting-33-native-pngs' }, historicalCoverageReportsPreserved: true, canonicalVisualApproval: false, fullAnimationCyclesComplete: false };
for (const [key, rows] of Object.entries(tableKeys)) {
  const prior = before[rows]; assert.equal(new Set(data[rows].map(r => r[0])).size, data[rows].length, rows);
  assert.deepEqual(data[rows].slice(0, prior.length).map(r => r[0]), prior.map(r => r[0]), rows + ' IDs');
  assert.deepEqual(data[rows].slice(0, prior.length).map(r => r.at(-1)), prior.map(r => r.at(-1)), rows + ' notes');
  if (!['features', 'atlas'].includes(rows)) assert.deepEqual(data[rows].slice(0, prior.length), prior, rows + ' unchanged historical rows');
}
assert.deepEqual(data.sources.slice(0, before.sources.length), before.sources.map(source => ({ ...source, ...(sourceChanges[source.id] || {}) })));
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
const statusColumns = { 'Combattants': ['E', 'F', 'H'], 'Techniques': ['N', 'O'], 'Arènes': ['C', 'D', 'K'], 'Atlas': ['E', 'F'], 'Production': ['E'], 'Scénarios': ['H'], 'QA': ['D'] };
function append(name, rows, oldCount, noteColumn) {
  if (!rows.length) return;
  const sheet = sheets.get(name), width = sheet.tables[0].columns.length;
  for (const [i, row] of rows.entries()) {
    const number = oldCount + i + 6; assert.equal(row.length, width, name + '/' + row[0]);
    row.forEach((value, c) => {
      const baseStyle = c + 1 === noteColumn ? styles.note : (oldCount + i) % 2 ? styles.white : styles.light;
      sheet.cells.push([number, c + 1, typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string', value, null, appendCellStyle(name, oldCount + 5, c + 1, baseStyle, value)]);
    });
    sheet.heights[number] = rowHeight(sheet, row, name === 'Production' && row[0].includes('-asset-') ? 145 : 42);
  }
  sheet.tables[0].range = 'A5:' + col(width) + (oldCount + rows.length + 5);
  for (const letter of statusColumns[name] || []) {
    const range = letter + (oldCount + 6) + ':' + letter + (oldCount + rows.length + 5);
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
  H2: 'Version 0.7.0 · abstractions · 24 novembre 2026',
  H13: (final ? proof.qa.tests + ' tests Node et deux builds validés' : '85 tests ciblés réussis ; bilan global en cours'),
  H14: 'Campagne navigateur complète et appareils physiques ouverts',
  H15: final ? 'Classeur recalculé, réimporté et comparé au socle' : 'Classeur en préparation ; aucune publication finale déclarée',
  H16: '10 abstractions · 142 PNG ' + (final ? 'vérifiés' : 'à vérifier') + (activeSunset.length ? ' · 33 PNG Sunset' : ''),
  H29: '64 combattants · 52 variantes d’archive',
  H30: '116 ensembles de base + 45 tenues (495 PNG)',
  H33: '64 combattants · 640 techniques · 192 finales',
  H34: '27 arènes communes · 64 arrangements',
};
for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
for (const c of summary.cells) if (c[4]) setCell('Synthèse', address(c), evaluate(c[4].slice(1), lookup, 'Synthèse'), c[4]);
for (const [ref, value] of Object.entries({ B7: 64, B8: 640, B9: 27, B10: 184, B11: COSTUMES.length, B12: 64, F16: data.production.length, F17: 408, F18: 184, F22: 2499 })) assert.equal(lookup.get('Synthèse').get(ref)[3], value, ref);
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
assert.equal(constrainedCells, 83423);
const targetDir = path.join(output, 'native-target'); await fs.mkdir(targetDir, { recursive: true });
for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
await writeJson(path.join(output, 'combat-tracker-data.json'), data);
const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']];
for (const row of new Set([...changed.values()].filter(c => c.sheet === 'Fonctionnalités').map(c => position(c.cell)[0]))) scopes.push(['Fonctionnalités', 'A' + row + ':I' + row, 'feature-' + data.features[row - 6][0].toLowerCase()]);
for (const row of new Set([...changed.values()].filter(change => change.sheet === 'Références').map(change => position(change.cell)[0]))) scopes.push(['Références', 'A' + row + ':E' + row, 'reference-' + data.sources[row - 6].id]);
for (let i = 0; i < rosterRows.length; i += 2) {
  const first = before.roster.length + 6 + i, last = Math.min(first + 1, data.roster.length + 5);
  scopes.push(['Combattants', 'A' + first + ':P' + last, 'roster-' + (i / 2 + 1)], ['Combattants', 'Q' + first + ':Z' + last, 'roster-review-' + (i / 2 + 1)]);
}
for (const row of [546, 566, 596, 636]) scopes.push(['Techniques', 'A' + row + ':M' + (row + 1), 'techniques-' + row], ['Techniques', 'N' + row + ':W' + (row + 1), 'techniques-review-' + row]);
scopes.push(['Arènes', 'A31:N32', 'stages'], ['Arènes', 'O31:T32', 'stages-review']);
for (const id of [...promotedIds, ABSTRACTION_IDS[5], ABSTRACTION_IDS[9]]) {
  const row = data.atlas.findIndex(r => r[0] === id) + 6;
  scopes.push(['Atlas', 'A' + row + ':S' + row, 'atlas-' + id], ['Atlas', 'T' + row + ':AG' + row, 'atlas-review-' + id]);
}
const productionStart = before.production.length + 6;
const representatives = [];
for (const [i, row] of [...productionRows, ...sunsetRows].entries()) if (!representatives.some(r => r.category === row[1])) representatives.push({ index: i, category: row[1] });
for (const [i, item] of representatives.entries()) {
  const row = productionStart + item.index;
  scopes.push(['Production', 'A' + row + ':J' + Math.min(row + 1, data.production.length + 5), 'production-category-' + (i + 1)]);
}
scopes.push(['Scénarios', 'A354:K355', 'scenarios-archive'], ['Scénarios', 'A384:K385', 'scenarios-original'], ['QA', 'A2499:I2501', 'qa-1'], ['QA', 'A2502:I2504', 'qa-2'], ['Références', 'A170:E' + (data.sources.length + 5), 'references-new'], ['Références', 'A' + (data.sources.length + 6) + ':E' + (data.sources.length + 16), 'references-footer']);
const runtimeSourceHashes = {};
for (const name of (await fs.readdir(path.join(root, 'combat'))).filter(name => name.endsWith('.mjs')).sort()) runtimeSourceHashes['combat/' + name] = hash(await fs.readFile(path.join(root, 'combat', name)));
const plan = {
  schema: 'encore-tracker-abstractions-recovery-plan/v1', createdAt: new Date().toISOString(), phase: final ? 'final-evidence-confirmed-awaiting-workbook-review' : 'draft-unpublished',
  baselineHashes, baselineSnapshotHashes, historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], approvedRowHeightChanges,
  evidenceHashes, runtimeSourceHashes, counts: { ...data.counts, sheets: 11, nativeTables: [...sheets.values()].reduce((n, s) => n + s.tables.length, 0), sources: data.sources.length, addedProductionRows: productionRows.length + sunsetRows.length, addedQaRows: qaRows.length, declaredArtFiles: 142, verifiedArtFiles: assetChecks.length, verifiedSunsetFiles: sunsetAssetChecks.length, totalNativeCells: native.sheets.reduce((n, s) => n + s.cells, 0) },
  appendedProductionIds: [...productionRows, ...sunsetRows].map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(s => s.id), promotedAtlasIds: promotedIds,
  coverageChanges: { addedFighters: 10, addedTechniques: 100, addedStages: 2, addedArchiveEntries: 5, addedCalmCostumes: 1, addedSunsetCostumes: activeSunset.length, historicalRowsPreservedExceptDeclaredCellChanges: true, updatedFeatureIds: Object.keys(featureChanges), updatedSourceIds: Object.keys(sourceChanges), historicalNotesPreserved: true, historicalCoverageSnapshotsPreserved: true },
  formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: 'E6', scopes,
  historicalFooterShift: shift, assetSlotChecks: assetChecks, sunsetAssetChecks, activeAssetDigests: [...assetChecks, ...sunsetAssetChecks],
  runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: hash(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))) },
  qaEvidence: { contentTests: contentQa, final: proof?.qa || null, browserAssertionsExecutedByWorkbookUpdate: 0 },
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

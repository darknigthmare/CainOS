/** Prepare the focus companion data from inspected files and the active runtime.
 * JSON only: XLSX editing is handled by the artifact-tool update script.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const folder = 'docs/art-generation/focus-20261127';
const manifestFile = flag('--manifest', folder + '/manifest.json');
const qaFile = flag('--qa-input', null);
const output = path.resolve(root, flag('--output', folder + '/tracker-focus.json'));
assert(qaFile, '--qa-input must identify the actual scoped QA evidence');
const sha = value => createHash('sha256').update(value).digest('hex');
const read = async file => JSON.parse(await fs.readFile(path.resolve(root, file), 'utf8'));
const load = file => import(pathToFileURL(path.join(root, file)));
const sourceDigests = {};
async function evidence(file, expected) {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'), 'Repository-relative evidence required');
  const bytes = await fs.readFile(path.join(root, file));
  const digest = sha(bytes);
  if (expected) assert.equal(digest, expected, 'Evidence changed: ' + file);
  sourceDigests[file] = digest;
  return bytes;
}

const tracker = await read('docs/combat-tracker-data.json');
assert.equal(tracker.counts.variants, 573, 'Install the reviewed completion workbook before the focus');
assert.equal(tracker.counts.offlineImages, 6281);
assert.equal(tracker.counts.baseOnlyCostumes, 89);
assert.equal(tracker.counts.projectileMotifs, 23);
const historicalCommit = 'cc972c8412bddb5278ef7c609dd82897325a2922';
const historicalSource = file => execFileSync('git', ['show', historicalCommit + ':' + file], { cwd: root, maxBuffer: 8 * 1024 * 1024 });
const manifest = await read(manifestFile); await evidence(manifestFile);
assert(Array.isArray(manifest.assets), 'Focus manifest needs an assets array');
assert.equal(manifest.assets.length, 34, 'Expected four base drawings, twenty story paintings and ten projectile motifs');
const { FIGHTERS, VARIANTS, COSTUME_ADDITIONS, COSTUMES, CROSSOVER_COSTUMES, BASE_SPRITE_COSTUMES, STAGES, ARCHIVE } = await load('combat/data.mjs');
const { ART_FILES, ART_BYTES } = await load('combat/offline-manifest.mjs');
const { FOCUS_20261127_BASE_DEFINITIONS, FOCUS_20261127_BASE_REVIEWS } = await load('combat/base-sprite-focus-20261127.mjs');
const { campaignIllustration } = await load('combat/illustrations.mjs');
const { PROJECTILE_ART, projectileArtSpec } = await load('combat/projectile-art.mjs');
const { STORY_ROUTES } = await load('combat/stories.mjs');
const published = new Set(ART_FILES), fighters = new Map(FIGHTERS.map(f => [f.id, f]));
const costumes = new Map(COSTUMES.map(c => [c.id, c]));
const assets = [];
for (const record of manifest.assets) {
  const file = record.path;
  assert.equal(typeof file, 'string');
  assert(file.startsWith('assets/encore/') && file.endsWith('.png'), 'Native PNG path required: ' + file);
  assert(published.has('../' + file), 'Asset absent from active offline manifest: ' + file);
  const bytes = await evidence(file, record.sha256);
  assert.equal(record.nativePixelsUnmodified, true, 'Manifest must attest unchanged native pixels: ' + file);
  assert.equal(typeof record.nativeSource, 'string', 'Native output source required: ' + file);
  const nativeSourceBytes = await fs.readFile(record.nativeSource);
  assert.equal(sha(nativeSourceBytes), sha(bytes), 'Installed PNG differs from its native generation output: ' + file);
  assert.equal(bytes.length, record.bytes, 'Asset size: ' + file);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20), colorType = bytes[25];
  assert.equal(width, record.width); assert.equal(height, record.height);
  const base = /^assets\/encore\/base-costumes\/([^/]+)\/(selection|stance)\.png$/.exec(file);
  const campaign = /^assets\/encore\/campaign\/([^/]+)\/([^/]+)\.png$/.exec(file);
  const projectile = /^assets\/encore\/projectiles\/([^/]+)\.png$/.exec(file);
  assert.equal([base, campaign, projectile].filter(Boolean).length, 1, 'Unrecognized asset: ' + file);
  const kind = base ? 'static-base' : campaign ? 'campaign' : 'projectile';
  if (kind !== 'campaign') assert.equal(colorType, 6, 'Native transparent RGBA required: ' + file);
  if (record.mode) assert.equal(record.mode, colorType === 6 ? 'RGBA' : colorType === 2 ? 'RGB' : record.mode);
  assets.push({ ...record, kind, file, path: file, width, height, bytes: bytes.length,
    sha256: sha(bytes), nativeBytesVerified: true, nativeSourceBytesCompared: true, published: true, evidence: manifestFile,
    ...(base ? { id: base[1], slot: base[2] } : {}),
    ...(campaign ? { fighterId: campaign[1], panelId: campaign[2] } : {}),
    ...(projectile ? { motifId: projectile[1] } : {}) });
}
assert.equal(new Set(assets.map(a => a.file)).size, 34);
assert.equal(new Set(assets.map(a => a.sha256)).size, 34, 'Each authored file must be distinct');
const bases = assets.filter(a => a.kind === 'static-base');
const campaigns = assets.filter(a => a.kind === 'campaign');
const projectiles = assets.filter(a => a.kind === 'projectile');
assert.equal(bases.length, 4); assert.equal(campaigns.length, 20); assert.equal(projectiles.length, 10);
assert.deepEqual([...new Set(bases.map(a => a.id))].sort(), ['evilpomni-pendantz', 'godcaine']);
const definitions = FOCUS_20261127_BASE_DEFINITIONS.filter(d => bases.some(a => a.id === d.id));
assert.equal(definitions.length, 2);

const productionRows = [], rowUpdates = [], renderRanges = [], changes = [];
const rowFor = (key, id) => { const row = tracker[key].find(r => r[0] === id); assert(row, 'Missing historical row: ' + id); return row; };
const addChange = (sheet, key, id, cells) => {
  const row = rowFor(key, id);
  for (const col of Object.keys(cells)) assert(+col > 0 && +col < row.length - 1, 'Preserve ID/user note');
  rowUpdates.push({ sheet, id, cells });
  changes.push({ sheet, id, before: Object.fromEntries(Object.keys(cells).map(c => [c, row[c]])), after: cells });
};
const renderRow = (sheetName, key, id, columns, label) => {
  const index = tracker[key].findIndex(r => r[0] === id); assert(index >= 0);
  renderRanges.push({ sheetName, range: `${columns[0]}${index + 6}:${columns[1]}${index + 6}`, label });
};
const nativeLabel = asset => `PNG natif ${asset.width} × ${asset.height} ; ${asset.bytes} octets ; SHA-256 ${asset.sha256}.`;

for (const definition of definitions) {
  const costume = costumes.get(definition.id), review = FOCUS_20261127_BASE_REVIEWS[definition.id];
  assert(costume?.baseOnly && !costume.crossover, 'Focus appearance must be exposed: ' + definition.id);
  assert.equal(review?.status, 'verified-base-files');
  assert.equal(costume.canonicalCostumeClaim, false);
  assert.deepEqual(costume.authoredSlots, ['selection', 'stance']);
  const name = fighters.get(definition.fighterId)?.name; assert(name);
  for (const slot of ['selection', 'stance']) {
    const asset = bases.find(a => a.id === definition.id && a.slot === slot); assert(asset);
    assert.equal(asset.sha256, review.sha256[slot]);
    asset.fighterId = definition.fighterId; asset.sourceUrl = definition.sourceUrl;
    productionRows.push([`FOCUS27-asset-${definition.id}-${slot}`, 'Dessin de base', name,
      `${definition.name} · ${slot === 'selection' ? 'portrait' : 'garde'}`, 'Implémenté', 'P1', asset.file,
      nativeLabel(asset), `${definition.sourceKind}. ${definition.scope}`, '']);
  }
  productionRows.push([`COST-${definition.id}`, 'Tenue Circus', name, definition.name,
    'Implémenté', 'P1', `combat/base-sprite-focus-20261127.mjs · ${definition.directory.replace('../', '')}`,
    'Portrait et garde séparés, intégrés après validation de leur paire. Autres états : garde de la même famille, sans nouvelle animation.',
    `${definition.sourceScope} ${definition.sourceUrl}`, '']);
}

for (const asset of campaigns) {
  const fighter = fighters.get(asset.fighterId); assert(fighter);
  const route = STORY_ROUTES[asset.fighterId]; assert(route);
  const panel = [...route.prologue, ...route.epilogue].find(p => p.id === asset.panelId); assert(panel);
  const chosen = campaignIllustration(asset.fighterId, asset.panelId);
  assert(chosen && fileURLToPath(chosen) === path.join(root, asset.file), 'Native story painting is not the active renderer choice: ' + asset.file);
  asset.stageId = panel.stageId;
  const id = [`BOARD-${asset.panelId}`, `ABS34-panel-${asset.panelId}`].find(value => tracker.production.some(r => r[0] === value));
  assert(id, 'Historical storyboard row required: ' + asset.panelId);
  const previous = rowFor('production', id);
  let note = String(previous[8]);
  note = note.replace('Portraits et décors partagés ; aucun dessin narratif dédié ni guérison canonique.', 'Peinture native dédiée ; portraits et décors partagés restent disponibles en repli. Aucune guérison canonique.');
  note = note.replace('Décors et portraits existants, sans nouveau dessin dédié ni animation narrative.', 'Peinture native dédiée ; composition historique conservée en repli, sans animation narrative.');
  assert.notEqual(note, previous[8], 'Review the historical storyboard wording before changing it: ' + id);
  addChange('Production', 'production', id, { 6: `${asset.file} · combat/story-presentation.mjs`, 8: note });
  renderRow('Production', 'production', id, ['G', 'J'], 'story-' + asset.panelId);
  productionRows.push([`FOCUS27-story-${asset.panelId}`, 'Dessin narratif', fighter.name,
    panel.title, 'Implémenté', 'P1', asset.file, nativeLabel(asset),
    `Peinture statique dédiée au tableau ${asset.panelId}, arène ${panel.stageId}. ${panel.summary} Récit original Encore ; aucun nouvel événement canonique, dialogue ajouté ou cycle animé.`, '']);
}

for (const asset of projectiles) {
  const spec = PROJECTILE_ART[asset.motifId]; assert(spec && spec.src === '../' + asset.file);
  const targets = FIGHTERS.flatMap(f => Object.entries(f.moves || {}).filter(([, move]) => move.kind === 'projectile')
    .filter(([, move]) => projectileArtSpec({ def: move }, { f })?.src === spec.src).map(([slot]) => ({ fighterId: f.id, slot })));
  assert(targets.length > 0, 'Projectile motif is not wired: ' + asset.motifId);
  const owners = [...new Set(targets.map(t => t.fighterId))]; assert.equal(owners.length, 1, 'Focus motifs must have their distinct owner');
  asset.fighterId = owners[0]; asset.targets = targets;
  productionRows.push([`FOCUS27-projectile-${asset.motifId}`, 'Projectile illustré', fighters.get(owners[0]).name,
    asset.name || asset.motifId, 'Implémenté', 'P1', asset.file,
    `${nativeLabel(asset)} Affichage ${spec.width} × ${spec.height} ; ${targets.map(t => t.slot).join(', ')}.`,
    'Accessoire original Encore du kit déjà simulé. Motif statique conservé après réflexion ; aucune mécanique, collision, puissance ni capacité canonique ajoutée.', '']);
}
assert.equal(productionRows.length, 36);

for (const id of ['evilpomni', 'rivalbaseballpomni']) {
  const archive = ARCHIVE.find(a => a.id === id); assert.equal(archive?.identityId, 'evilpomni-big-top');
  addChange('Atlas', 'atlas', id, {
    13: 'Evil Pomni, PNJ adverse des Big Top. Les archives evilpomni et rivalbaseballpomni sont deux alias de la même incarnation. Portrait corrigé rouge/jaune à accents bleus ; anciennes interprétations conservées.',
    14: [...archive.referenceUrls, 'Archive historique : ' + archive.source].join('\n'),
    17: 'Galerie : portrait partagé de la paire evilpomni-pendantz. Identifiants et planches historiques conservés ; aucun combattant supplémentaire ni transformation canonique de Pomni.'
  });
  renderRow('Atlas', 'atlas', id, ['N', 'R'], 'archive-' + id);
  const coverage = rowFor('production', 'COV-' + id);
  addChange('Production', 'production', 'COV-' + id, {
    6: `${coverage[6]} · ${manifestFile}`,
    7: 'Portrait corrigé partagé via la paire validée evilpomni-pendantz. Les anciens dessins demeurent dans les fichiers et les archives.',
    8: 'Même PNJ des Big Top : alias Evil Pomni / Rival Baseball Pomni. Références épisode 5 et Pendantz ; pas de kit supplémentaire ni de certification pixel à pixel.'
  });
  renderRow('Production', 'production', 'COV-' + id, ['G', 'J'], 'coverage-' + id);
}

const campaignTotal = ART_FILES.filter(file => file.startsWith('../assets/encore/campaign/')).length;
const projectileTotal = Object.keys(PROJECTILE_ART).length;
const activePanels = Object.values(STORY_ROUTES).flatMap(route => [...route.prologue, ...route.epilogue]
  .map(panel => ({ fighterId: route.fighterId, panelId: panel.id, source: campaignIllustration(route.fighterId, panel.id) })));
const illustratedStoryPanels = activePanels.filter(panel => panel.source).length;
const composedStoryPanels = activePanels.length - illustratedStoryPanels;
assert.equal(activePanels.length, tracker.counts.storyPanels);
assert.equal(illustratedStoryPanels, 104); assert.equal(composedStoryPanels, 280);
assert.equal(campaignTotal, tracker.illustratedAssets.campaign + campaigns.length);
assert.equal(projectileTotal, tracker.counts.projectileMotifs + projectiles.length);
addChange('Fonctionnalités', 'features', 'PRE-BASE-35', {
  5: 'combat/base-sprite-content.mjs · combat/base-sprite-focus-20261127.mjs · combat/illustrations.mjs',
  6: `${BASE_SPRITE_COSTUMES.length} familles statiques exposées. Le focus ajoute God Caine Animatez et Evil Pomni Pendantz, chacune avec un portrait et une garde distincts.`,
  7: 'Les autres états réutilisent la garde de la même famille. Produit officiel, incarnation de PNJ et adaptation au jeu gardent leurs portées documentaires propres ; aucun nouveau kit ni cycle animé.'
});
addChange('Fonctionnalités', 'features', 'PRE-20', {
  5: 'assets/encore/campaign/ · combat/story-presentation.mjs · ' + manifestFile,
  6: `${activePanels.length} tableaux de prologue et d’épilogue : ${illustratedStoryPanels} avec un dessin dédié et ${composedStoryPanels} composés de portraits et décors. Les 256 briefings avant duel restent disponibles ; les routes d’abstraction gardent leur narration sans réversion ni guérison canonique.`,
  7: `${tracker.illustratedAssets.campaign} fichiers narratifs historiques et ${campaigns.length} nouvelles peintures conservés, soit ${campaignTotal} fichiers. Le nombre de fichiers diffère des ${illustratedStoryPanels} tableaux actifs illustrés. Récits et mises en scène originaux Encore, sans événement canonique ajouté.`
});
addChange('Fonctionnalités', 'features', 'PRE-07', {
  5: 'combat/render.mjs · combat/render-presentation.mjs · combat/projectile-art.mjs',
  7: `${projectileTotal} motifs de projectile illustrés, dont ${projectiles.length} nouveaux motifs propres aux abstractions. Accessoires du fan-game, conservés après réflexion, sans changement des mécaniques ni pouvoir canonique revendiqué.`
});
for (const id of ['PRE-BASE-35', 'PRE-20', 'PRE-07']) renderRow('Fonctionnalités', 'features', id, ['F', 'I'], 'feature-' + id.toLowerCase());
for (const [label, first, last] of [['bases', 0, 5], ['stories', 6, 25], ['projectiles', 26, 35]]) {
  const start = tracker.production.length + 6 + first, end = tracker.production.length + 6 + last;
  renderRanges.push({ sheetName: 'Production', range: `A${start}:F${end}`, label: 'focus-' + label + '-overview' });
  renderRanges.push({ sheetName: 'Production', range: `G${start}:J${end}`, label: 'focus-' + label + '-detail' });
}

const counts = { variants: COSTUMES.length, crossovers: CROSSOVER_COSTUMES.length,
  costumeAdditions: COSTUME_ADDITIONS.length + BASE_SPRITE_COSTUMES.filter(c => !c.crossover).length,
  baseOnlyCostumes: BASE_SPRITE_COSTUMES.length,
  baseOnlyOfficialCostumes: BASE_SPRITE_COSTUMES.filter(c => !c.crossover).length,
  baseOnlyCrossoverCostumes: BASE_SPRITE_COSTUMES.filter(c => c.crossover).length,
  projectileMotifs: projectileTotal, campaignIllustrationFiles: campaignTotal, illustratedStoryPanels, composedStoryPanels,
  offlineImages: ART_FILES.length, offlineBytes: ART_BYTES };
assert.equal(FIGHTERS.length, tracker.counts.fighters); assert.equal(STAGES.length, tracker.counts.stages);
assert.equal(counts.variants, 575); assert.equal(counts.baseOnlyCostumes, 91);
assert.equal(counts.costumeAdditions, tracker.counts.costumeAdditions + definitions.length);
assert.equal(VARIANTS.length + counts.costumeAdditions + counts.crossovers, counts.variants);
assert.equal(counts.crossovers, tracker.counts.crossovers);
assert.equal(counts.offlineImages, tracker.counts.offlineImages + assets.length);
assert.equal(counts.offlineBytes, tracker.counts.offlineBytes + assets.reduce((n, a) => n + a.bytes, 0));

// Reconcile regenerated documentation with the exact source behind the installed
// workbook. Runtime annotations already added to EN-G32 are retained when the
// generator itself has not changed those fields; user note columns stay intact.
const extensionFile = 'docs/bible/extensions-workbook-data.json';
const oldExtensionBytes = historicalSource(extensionFile);
assert.equal(sha(oldExtensionBytes), tracker.extensionsIntegration.sourceSHA256);
const newExtensionBytes = await evidence(extensionFile);
const extensionTypes = { taunt: 'Provocation', selection: 'Sélection', deselection: 'Désélection', duo: 'Duo', bonus: 'Bonus', hub: 'Salle du hub', 'regle-acces': 'Règle d’accès', 'soutien-inactif': 'Soutien inactif', 'charte-verrou': 'Charte visuelle', 'test-droits': 'Test des droits', clash: 'Clash' };
const extensionRows = input => ({
  sections: input.sections.map(s => [s.id, `${s.section} — ${s.title}`, s.status?.design || 'Documentée', s.status?.assets || 'À produire', s.status?.integration || 'Non intégré', s.status?.tests || 'Non exécuté', s.adaptation, s.verification, (s.links || []).join('\n'), null]),
  profiles: input.profiles.map(p => [p.id, extensionTypes[p.type] || p.type, p.entity, [p.title, p.description].filter(Boolean).join('\n'), p.status?.design || 'Documentée', p.status?.assets || 'À produire', p.status?.integration || 'Non intégré', p.status?.tests || 'Non exécuté', p.source, null])
});
const oldExtension = extensionRows(JSON.parse(oldExtensionBytes)), newExtension = extensionRows(JSON.parse(newExtensionBytes));
const extensionRowUpdates = [], extensionProfileUpdates = [], retainedRuntimeAnnotations = [];
for (const [key, trackerKey, destination, sheetName] of [
  ['sections', 'rows', extensionRowUpdates, 'Extensions combat'],
  ['profiles', 'profileRows', extensionProfileUpdates, 'Fiches extensions']
]) {
  assert.deepEqual(newExtension[key].map(r => r[0]), oldExtension[key].map(r => r[0]), 'Bible row IDs/order changed: ' + key);
  assert.deepEqual(tracker.extensionsIntegration[trackerKey].map(r => r[0]), oldExtension[key].map(r => r[0]));
  for (let index = 0; index < oldExtension[key].length; index++) {
    const previousSource = oldExtension[key][index], nextSource = newExtension[key][index], installed = tracker.extensionsIntegration[trackerKey][index];
    const cells = {};
    for (let column = 1; column < 9; column++) {
      if (nextSource[column] === previousSource[column]) continue;
      if (installed[column] !== previousSource[column] && installed[column] !== nextSource[column]) {
        assert(key === 'sections' && installed[0] === 'EN-G32' && [4, 5, 6, 7, 8].includes(column), 'Conflicting handwritten/runtime bible annotation: ' + installed[0] + '/' + column);
        retainedRuntimeAnnotations.push({ id: installed[0], column, installed: installed[column], previousSource: previousSource[column], newSource: nextSource[column] });
        continue;
      }
      if (installed[column] !== nextSource[column]) cells[column] = nextSource[column];
    }
    if (Object.keys(cells).length) {
      destination.push({ id: installed[0], cells });
      changes.push({ sheet: sheetName, id: installed[0], before: Object.fromEntries(Object.keys(cells).map(c => [c, installed[c]])), after: cells });
      renderRanges.push({ sheetName, range: `A${index + 6}:J${index + 6}`, label: 'bible-' + installed[0].toLowerCase() });
    }
  }
}
const guideFile = 'docs/bible/guide-design.json';
const oldGuideBytes = historicalSource(guideFile), newGuideBytes = await evidence(guideFile);
const oldGuide = JSON.parse(oldGuideBytes), newGuide = JSON.parse(newGuideBytes);
const guideRows = source => source.sections.map(s => [s.id, s.section + ' — ' + s.title, s.priority, s.decision, s.runtimeStatus, s.requirements.length, s.adaptation, s.verification, s.links.join('\n'), null]);
const guideBaselineRows = guideRows(oldGuide), guideUpdatedRows = guideRows(newGuide), guideRowUpdates = [];
assert.deepEqual(guideUpdatedRows.map(r => r[0]), guideBaselineRows.map(r => r[0]));
for (let index = 0; index < guideBaselineRows.length; index++) {
  const previous = guideBaselineRows[index], next = guideUpdatedRows[index], cells = {};
  for (let column = 1; column < 9; column++) if (previous[column] !== next[column]) cells[column] = next[column];
  if (Object.keys(cells).length) {
    guideRowUpdates.push({ id: previous[0], cells });
    changes.push({ sheet: 'Guide combat', id: previous[0], before: Object.fromEntries(Object.keys(cells).map(c => [c, previous[c]])), after: cells });
    renderRanges.push({ sheetName: 'Guide combat', range: `A${index + 6}:J${index + 6}`, label: 'guide-' + previous[0].toLowerCase() });
  }
}
const bibleReconciliation = { baselineCommit: historicalCommit,
  extensions: { source: extensionFile, beforeSHA256: sha(oldExtensionBytes), afterSHA256: sha(newExtensionBytes), sectionRowsUpdated: extensionRowUpdates.length, profileRowsUpdated: extensionProfileUpdates.length },
  guide: { source: guideFile, beforeSHA256: sha(oldGuideBytes), afterSHA256: sha(newGuideBytes), rowsUpdated: guideRowUpdates.length },
  retainedRuntimeAnnotations, userNotesPreserved: true };

const extra = await read(qaFile); await evidence(qaFile);
assert(extra.currentQa && typeof extra.currentQa.complete === 'boolean'); assert(Array.isArray(extra.qaRows));
for (const [file, digest] of Object.entries(extra.sourceDigests || {})) await evidence(file, digest);
for (const file of ['combat/data.mjs', 'combat/offline-manifest.mjs', 'combat/base-sprite-focus-20261127.mjs', 'combat/base-sprite-content.mjs',
  'combat/illustrations.mjs', 'combat/projectile-art.mjs', 'combat/stories.mjs', 'combat/abstractions-narrative.mjs', 'combat/story-presentation.mjs',
  'scripts/build-combat-tracker-focus-20261127.mjs']) await evidence(file);
const qaRows = [
  ['FOCUS27-native-assets', 'Ressources du focus', '34 PNG natifs uniques contrôlés et exposés', 'Réussi', 'P1',
    '4 dessins de base, 20 peintures narratives et 10 motifs : SHA-256, octets, dimensions, catalogue et résolution du runtime vérifiés.', manifestFile,
    'Contrôle technique des ressources ; aucune certification canonique globale, nouvelle animation ou mécanique déduite.', ''],
  ['FOCUS27-runtime-links', 'Raccordement du focus', 'Paires, tableaux et accessoires réellement résolus', 'Réussi', 'P1',
    'Deux paires validées dans le catalogue ; 20 peintures choisies par campaignIllustration ; 10 motifs associés à leurs propriétaires et techniques existantes.', folder + '/tracker-focus.json',
    'Les fichiers, identités d’archive, sources et notes historiques restent conservés. Les contrôles de jeu complets gardent leur preuve propre.', ''],
  ...extra.qaRows
];
for (const row of qaRows) { assert.equal(row.length, 9); assert(Object.hasOwn(tracker.qaSummary, row[3])); }
const qaSummary = Object.fromEntries(Object.keys(tracker.qaSummary).map(key => [key, 0]));
for (const row of [...tracker.qa, ...qaRows]) qaSummary[row[3]]++;
const focus = { asOf: '2026-11-27', evidence: folder + '/tracker-focus.json', manifest: manifestFile,
  baselineCostumes: tracker.counts.variants, newAppearanceFamilies: definitions.length,
  nativePngs: assets.length, baseDrawings: bases.length, storyPaintings: campaigns.length, projectileMotifs: projectiles.length,
  campaignIllustrationFiles: campaignTotal, illustratedStoryPanels, composedStoryPanels,
  newFighters: 0, newMoves: 0, newAnimations: 0, canonicalOneToOneCertified: false,
  historicalFilesPreserved: true, assets, declaredExistingRowChanges: changes };
const result = {
  schema: 'encore-tracker-focus/v1', asOf: '2026-11-27', baselineCommit: 'cc972c8412bddb5278ef7c609dd82897325a2922',
  baselineCounts: { variants: 573, offlineImages: 6281, baseOnlyCostumes: 89, projectileMotifs: 23 },
  counts, productionRows, rowUpdates, extensionRowUpdates, extensionProfileUpdates, guideBaselineRows, guideRowUpdates, bibleReconciliation, qaRows, renderRanges,
  metadataUpdates: { focusContinuation: focus,
    guideIntegrationHistory: [...(tracker.guideIntegrationHistory || []), tracker.guideIntegration],
    guideIntegration: { ...tracker.guideIntegration, asOf: '2026-11-27', sourceCommitScope: 'Historical creation commit; this working-tree continuation is pinned by sourceSnapshot.',
      sourceSnapshot: { file: guideFile, sha256: sha(newGuideBytes) }, focusReconciliation: bibleReconciliation.guide,
      rows: newGuide.sections.map(s => ({ id: s.id, priority: s.priority, decision: s.decision, runtimeStatus: s.runtimeStatus, requirementIds: s.requirements.map(r => r.id), links: s.links })) },
    focusContinuationHistory: [...(tracker.focusContinuationHistory || []), ...(tracker.focusContinuation ? [tracker.focusContinuation] : [])],
    baseSpriteContinuationHistory: [...(tracker.baseSpriteContinuationHistory || []), tracker.baseSpriteContinuation],
    baseSpriteContinuation: { asOf: '2026-11-27', phase: 'static-bases-only', baselineCostumes: 573, addedCostumes: 2,
      officialAppearances: definitions.map(d => d.id), originalCrossoverAppearances: [], requiredSlots: ['selection', 'stance'],
      authoredPngs: 4, integratedPngs: 4, projectilePngs: projectiles.length, generatedThisSessionPngs: 4, recoveredPngs: 0,
      authoredBytes: bases.reduce((n, a) => n + a.bytes, 0), newActionPngs: 0, newAnimations: 0,
      missingRequiredSlots: 0, actionSlotsOutOfScope: true, canonicalPixelCertification: false, assets: bases,
      evidence: folder + '/tracker-focus.json', historicalRowsPreservedExceptDeclaredChanges: true },
    qaSummary, qaSummaryScope: 'Historique et portée des campagnes conservés ; le focus garde ses preuves distinctes du jalon précédent.' },
  completion: { ...focus, assets: undefined, declaredExistingRowChanges: undefined },
  currentQa: { gameVersion: tracker.version, asOf: '2026-11-27', rowIds: qaRows.map(r => r[0]), ...extra.currentQa },
  summaryCells: { H2: 'Version 0.7.0 · focus Pomni, Caine, abstractions · 27 novembre 2026',
    H13: extra.qaSummaryLabel || 'Focus : ressources et raccordements vérifiés',
    H14: extra.browserSummaryLabel || 'QA de jeu : consulter les preuves datées',
    H16: `${bases.length} bases · ${campaigns.length} peintures narratives · ${projectiles.length} motifs`,
    H15: `${illustratedStoryPanels} tableaux illustrés · ${composedStoryPanels} composés`,
    H30: `${counts.baseOnlyCostumes} familles statiques · aucune nouvelle animation` },
  sourceDigests
};
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ output, counts, assets: assets.length, productionRows: productionRows.length,
  changedRows: rowUpdates.length, qaRows: qaRows.length, renderRanges: renderRanges.length }));

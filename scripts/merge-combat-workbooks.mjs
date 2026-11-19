/**
 * Reconcile the two established Encore trackers after a branch merge.
 * This is a document reconciliation, not a replacement for the full CI/release
 * evidence gate. Run a copied builder from a private temporary directory using
 * CODEX_PRIMARY_RUNTIME_NODE and its bundled artifact-tool dependencies.
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
const snapshots = path.resolve(flag('--snapshots', path.join(root, '..', 'merge-preservation')));
const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs', 'encore-reconciled-20261119')));
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const sha256 = value => createHash('sha256').update(value).digest('hex');
const column = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const hasValue = value => value !== null && value !== undefined && value !== '';
const normalized = rows => rows.map(row => row.map(value => value ?? ''));
const equal = (a, b) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '');
const literal = value => typeof value === 'string' && value.startsWith('=') ? `'${value}` : value;
const TRACKER_SHEETS = {
  'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves',
  'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production',
  'Scénarios': 'scenarios', 'QA': 'qa',
};
const versions = {};
await fs.mkdir(outputDir, { recursive: true });
for (const label of ['main', 'pr7']) {
  const directory = path.join(snapshots, label, 'docs');
  const file = path.join(directory, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
  const data = await json(path.join(directory, 'combat-tracker-data.json'));
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(file));
  const tables = {};
  for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
    const sheet = workbook.worksheets.getItem(name);
    assert.equal(sheet.tables.items.length, 1, `${label}/${name}: expected one native table`);
    const table = sheet.tables.items[0];
    const headers = table.getHeaderRowRange().values[0];
    const rows = normalized(table.getDataRows());
    const formulas = sheet.getRange(`A6:${column(headers.length)}${rows.length + 5}`).formulasR1C1;
    assert.equal(headers.at(-1), 'Notes utilisateur');
    assert.equal(new Set(rows.map(row => row[0])).size, rows.length, `${label}/${name}: duplicate ID`);
    assert.deepEqual(rows.map(row => row[0]).sort(), data[key].map(row => row[0]).sort(), `${label}/${name}: workbook/JSON IDs differ`);
    tables[name] = { headers, rows, formulas, name: table.name, style: table.style, filter: table.showFilterButton };
  }
  const references = workbook.worksheets.getItem('Références').tables.items[0];
  assert.deepEqual(references.getDataRows().map(row => row[0]).sort(), data.sources.map(row => row.id).sort());
  versions[label] = { data, workbook, tables, file };
  const render = await workbook.render({ sheetName: 'Synthèse', range: 'A1:H34', scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `before-${label}-summary.png`), new Uint8Array(await render.arrayBuffer()));
}
const inventory = Object.fromEntries(Object.entries(versions).map(([label, version]) => [label, {
  tables: Object.fromEntries(Object.entries(version.tables).map(([name, table]) => [name, {
    rows: table.rows.length,
    formulas: table.formulas.reduce((n, row) => n + row.filter(hasValue).length, 0),
    notes: table.rows.filter((row, i) => hasValue(row.at(-1)) || hasValue(table.formulas[i]?.at(-1))).length,
    jsonDifferences: table.rows.filter(row => !equal(row, version.data[TRACKER_SHEETS[name]].find(item => item[0] === row[0]))).length,
  }])),
  summary: version.workbook.worksheets.getItem('Synthèse').getRange('A1:H34').values,
  summaryFormulas: version.workbook.worksheets.getItem('Synthèse').getRange('A1:H34').formulas,
}]));
await fs.writeFile(path.join(outputDir, 'source-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log('WORKBOOK_SOURCE_INVENTORY ' + JSON.stringify(Object.fromEntries(Object.entries(inventory).map(([label, data]) => [label, data.tables]))));
if (args.includes('--inspect-only')) process.exit(0);

// The reconciliation and export are below. Imported workbooks remain immutable
// until the source previews and inventory have been reviewed.
const base = await json(path.join(snapshots, 'base-tracker-data.json'));
const data = structuredClone(versions.main.data);
const workbook = versions.main.workbook;
const mergedFormulas = new Map();
const noteCollisions = [];
const mergeCells = (name, id, first, second, ancestor, noteColumn = -1) => first.map((value, c) => {
  if (c === 0 || equal(value, second[c])) return value;
  if (c === noteColumn) {
    if (!hasValue(value)) return second[c];
    if (!hasValue(second[c])) return value;
    noteCollisions.push({ sheet: name, id, main: value, pr7: second[c] });
    return `[main]\n${value}\n\n[PR7]\n${second[c]}`;
  }
  if (equal(value, ancestor?.[c])) return second[c];
  if (equal(second[c], ancestor?.[c])) return value;
  throw new Error(`Unresolved content collision: ${name}/${id}/${column(c + 1)}`);
});
for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
  const main = versions.main.tables[name], pr7 = versions.pr7.tables[name];
  assert.deepEqual(main.headers, pr7.headers, `Column meanings differ: ${name}`);
  const original = new Map(base[key].map(row => [row[0], row]));
  const other = new Map(pr7.rows.map(row => [row[0], row]));
  const ids = new Set(main.rows.map(row => row[0]));
  const rows = main.rows.map(row => other.has(row[0])
    ? mergeCells(name, row[0], row, other.get(row[0]), original.get(row[0]), row.length - 1)
    : structuredClone(row));
  rows.push(...pr7.rows.filter(row => !ids.has(row[0])).map(row => structuredClone(row)));
  data[key] = rows;
  const formulas = new Map();
  for (const [label, source] of [['main', main], ['pr7', pr7]]) {
    source.rows.forEach((row, i) => source.formulas[i].forEach((formula, c) => {
      if (!hasValue(formula)) return;
      const id = `${row[0]}\0${c}`, previous = formulas.get(id);
      assert(!previous || previous.formula === formula, `Conflicting formulas: ${name}/${row[0]}/${column(c + 1)}`);
      if (c === row.length - 1) assert(!noteCollisions.some(note => note.sheet === name && note.id === row[0]), `Formula and text notes require manual reconciliation: ${name}/${row[0]}`);
      formulas.set(id, { formula, label });
    }));
  }
  mergedFormulas.set(name, formulas);
}
const sourceArray = source => [source.id, source.title, source.kind, source.url, source.scope];
const sourceObject = ([id, title, kind, url, scope]) => ({ id, title, kind, url, scope });
const mainSources = workbook.worksheets.getItem('Références').tables.items[0].getDataRows();
const pr7Sources = versions.pr7.workbook.worksheets.getItem('Références').tables.items[0].getDataRows();
const baseSources = new Map(base.sources.map(source => [source.id, sourceArray(source)]));
const pr7SourceMap = new Map(pr7Sources.map(row => [row[0], row]));
const sourceIds = new Set(mainSources.map(row => row[0]));
data.sources = mainSources.map(row => sourceObject(pr7SourceMap.has(row[0])
  ? mergeCells('Références', row[0], row, pr7SourceMap.get(row[0]), baseSources.get(row[0])) : row));
data.sources.push(...pr7Sources.filter(row => !sourceIds.has(row[0])).map(sourceObject));
for (const key of Object.keys(versions.pr7.data)) if (!(key in data)) data[key] = structuredClone(versions.pr7.data[key]);

const readModule = file => import(pathToFileURL(path.join(root, file)));
const [content, offline, fidelity, music, ambience, motion, tournament, finishers, friendship] = await Promise.all([
  readModule('combat/data.mjs'), readModule('combat/offline-manifest.mjs'), readModule('combat/fidelity.mjs'),
  readModule('combat/audio.mjs'), readModule('combat/audio-ambiences.mjs'), readModule('combat/render-stage-motion.mjs'),
  readModule('combat/tournament-lore.mjs'), readModule('combat/finisher-catalog.mjs'), readModule('combat/friendship-catalog.mjs'),
]);
const { FIGHTERS, MOVES, STAGES, DEDICATED_STAGES, VARIANTS, COSTUMES } = content;
const add = (rows, row) => { if (!rows.some(existing => existing[0] === row[0])) rows.push(row); };
const fileSet = new Set(offline.ART_FILES.map(file => file.replace(/^\.\.\//, '')));
const imagePath = stem => [stem + '.webp', stem + '.png'].find(file => fileSet.has(file));
const sourceMap = new Map(data.sources.map(source => [source.id, source]));
for (const stage of STAGES) {
  if (data.stages.some(row => row[0] === stage.id)) continue;
  const f = stage.fidelity;
  for (const id of f.sourceIds) if (!sourceMap.has(id)) {
    const source = fidelity.FIDELITY_SOURCES.find(source => source.id === id);
    assert(source, `Missing source: ${id}`); data.sources.push(source); sourceMap.set(id, source);
  }
  const theme = music.AUDIO_THEMES[stage.id], sound = ambience.AUDIO_AMBIENCES[stage.id];
  add(data.stages, [stage.id, stage.name, 'Implémenté', 'Partiel', stage.theme, stage.width, stage.floor,
    stage.bounds.left, stage.bounds.right, 'Aucune collision de décor', 'Prévu', stage.sourceId,
    `${stage.description}\nMusique : ${theme.title} · ${theme.bpm} BPM.`, stage.provenance,
    f.sourceIds.map(id => `${id} : ${sourceMap.get(id).url}`).join('\n'), f.observedTraits.join('\n'),
    f.combatAdaptation, f.reviewStatus, f.reviewScope, '']);
  for (const [task, label, criterion] of [
    ['background', 'Fond et profondeur', 'Comparer la composition aux références de la fiche Arènes.'],
    ['floor', 'Sol jouable', 'Aligner les pieds, les ombres et la ligne de combat.'],
    ['foreground', 'Premier plan', 'Conserver une lecture claire des attaques et des déplacements.'],
  ]) add(data.production, [`ART-${stage.id}-${task}`, 'Arène', stage.name, label, 'Partiel', 'P2',
    'combat/render.mjs', 'Décor du jeu ; revue visuelle détaillée à poursuivre.', criterion, '']);
  add(data.production, [`ART-${stage.id}-music`, 'Arène', stage.name, 'Musique de l’arène', 'Implémenté', 'P2',
    'combat/audio.mjs', `${theme.title} · ${theme.bpm} BPM`, `${theme.provenance} Mixage sur appareils réels à vérifier.`, '']);
  add(data.production, [`ART-${stage.id}-ambience`, 'Arène', stage.name, 'Ambiance sonore', 'Implémenté', 'P2',
    'combat/audio-ambiences.mjs', `${sound.title} · ${sound.periodSeconds} s · ${sound.layers.length} couches`,
    `${sound.description} ${sound.provenance} Mixage sur appareils réels à vérifier.`, '']);
  add(data.production, [`ANIM-${stage.id}-ambience`, 'Animation d’arène', stage.name, 'Ambiance visuelle animée',
    'Implémenté', 'P1', 'combat/render-stage-motion.mjs', motion.STAGE_AMBIENCES[stage.id],
    'Effets derrière les acteurs. Le réglage de mouvements réduits fige les effets.', '']);
}
data.dedicatedStages = DEDICATED_STAGES.map(stage => ({
  id: stage.id, fighterId: stage.dedicatedTo, name: stage.name, baseStageId: stage.theme,
  description: stage.description, sharedArtwork: true, reviewStatus: 'À vérifier',
}));
for (const stage of DEDICATED_STAGES) add(data.production, [`STAGE-${stage.id}`, 'Arrangement d’arène',
  FIGHTERS.find(f => f.id === stage.dedicatedTo).name, stage.name, 'Implémenté', 'P1',
  'combat/data.mjs · combat/stage-parallax.mjs', `Arrangement ${stage.id}. Décor partagé : ${stage.theme}.`,
  'Réutilise les plans du lieu commun avec une identité de combattant. Ne compte pas comme une nouvelle illustration ni une géométrie canonique validée.', '']);
for (const fighter of FIGHTERS) {
  const entry = tournament.TOURNAMENT_LORE?.[fighter.id];
  if (entry) add(data.scenarios, [`TOURNOI-${fighter.id}`, 'Tournoi à tableau', `${fighter.name} · ${entry.intro.title}`,
    `${entry.intro.summary}\nCouronnement : ${entry.ending}`, 'Trois victoires joueur', 3,
    FIGHTERS.find(f => f.id === entry.rivalId).name, 'Implémenté', 'P1', 'combat/tournament-lore.mjs · combat/progression.mjs', '']);
}
for (const entry of friendship.FRIENDSHIP_CATALOG) add(data.production, [`FRIEND-${entry.id}`, 'Numéro d’amitié',
  FIGHTERS.find(fighter => fighter.id === entry.fighterId).name, entry.title, 'Implémenté', 'P1',
  'combat/friendship-catalog.mjs · combat/render-finishers.mjs',
  `${entry.durationFrames} frames de présentation.\n${entry.beats.map(beat => `${beat.frame} f : ${beat.title}. ${beat.description}`).join('\n')}`,
  `${entry.adaptation}\nTravail restant : ${entry.remainingArtWork}`, '']);
add(data.features, ['PRE-22', 'Présentation', 'Numéros d’amitié par combattant', 'Partiel', 'P1',
  'combat/friendship-catalog.mjs · combat/render-finishers.mjs',
  '54 numéros d’amitié procéduraux avec trois temps narratifs. Le réglage choisit cette présentation après le duel.',
  'Dessins dédiés, animations image par image et revue des références restent distincts de l’implémentation procédurale.', '']);
const { updateIllustratedTracker } = await readModule('scripts/combat-illustrated-tracker.mjs');
const { updateCrossoverTracker } = await readModule('scripts/combat-crossover-tracker.mjs');
updateIllustratedTracker(data, offline);
updateCrossoverTracker(data, offline, content);
for (const row of data.roster) {
  const stance = imagePath(`assets/encore/stance/${row[0]}`);
  if (stance && !row[14].startsWith('Dessins individuels')) row[14] = `Garde individuelle : ${stance}. Autres poses dédiées à produire et revoir.`;
}
const feature = id => data.features.find(row => row[0] === id);
feature('MOD-09')[6] = `${FIGHTERS.length} routes individuelles : introduction, quatre rencontres avec dialogues et arènes propres, puis conclusion.`;
feature('CQC-24')[6] = `${finishers.FINISHER_CATALOG.length} présentations de KO, trois par artiste. Les poses animées dédiées et la comparaison canonique restent ouvertes.`;
feature('PRE-01')[2] = `Sélection de ${FIGHTERS.length} combattants`;
feature('PRE-20')[6] = `${FIGHTERS.length * 6} tableaux de prologue et d’épilogue, puis ${FIGHTERS.length * 4} briefings avant les duels. Vérifier l’ordre, les dialogues et le passage volontaire à la suite.`;
feature('PRE-20')[7] = `${data.illustratedAssets.campaign} illustrations dédiées. Les autres tableaux utilisent une composition du jeu. Les dialogues et les mises en scène sont des adaptations françaises pour Encore.`;
feature('PRD-10')[6] = `Réconcilier ${FIGHTERS.length} combattants, ${VARIANTS.length} variantes historiques compatibles et ${data.counts.archiveOnly} archives sans kit, soit ${data.counts.atlas} entrées conservées. Les costumes crossover sont suivis séparément dans Production.`;
Object.assign(data.counts, { fighters: FIGHTERS.length, moves: MOVES.length, stages: STAGES.length,
  dedicatedStages: DEDICATED_STAGES.length, variants: COSTUMES.length, archiveVariants: VARIANTS.length,
  storyRoutes: FIGHTERS.length, storyChapters: FIGHTERS.length * 4, storyPanels: FIGHTERS.length * 6,
  storyBriefings: FIGHTERS.length * 4, finishers: finishers.FINISHER_CATALOG.length,
  friendships: friendship.FRIENDSHIP_CATALOG?.length ?? Object.keys(friendship.FRIENDSHIPS || {}).length,
});
data.asOf = '2026-11-19'; data.contentAsOf = '2026-11-19';
data.historicalCurrentQa = structuredClone(versions.main.data.currentQa);
const currentIds = ['WBMERGE26-identities', 'WBMERGE26-formulas', 'WBMERGE26-release'];
for (const row of data.qa) if (['Réussi', 'Échec'].includes(row[3]) && !row[1].startsWith('Historique ')) {
  row[1] = `Historique avant fusion · ${row[1]}`;
  row[6] = `Preuve antérieure conservée. Aucun nouvel essai n’est déduit de la fusion.\n${row[6]}`;
}
add(data.qa, [currentIds[0], 'Classeur · Réconciliation', 'Identifiants, notes et lignes des deux branches',
  'Réussi', 'P0', 'Import des deux classeurs avec le runtime tableur principal',
  '19 novembre 2026. Tous les identifiants, les notes et les formules de détail sont conservés par ID. Ordre de main conservé, ajouts PR7 à la suite.',
  'Conserver les 54 combattants, les 540 techniques, les 429 costumes et la feuille Extension PNJ.', '']);
add(data.qa, [currentIds[1], 'Classeur · Recalcul', 'Formules de synthèse et égalité Excel / JSON',
  'Réussi', 'P0', 'Recalcul artifact-tool, export et réimport',
  '19 novembre 2026. Synthèses recalculées, mutation de statut contrôlée, tableaux natifs et égalité des lignes vérifiés après export.',
  '22 arènes communes et 54 arrangements sont comptés séparément. Aucune validation canonique n’est déduite du recalcul.', '']);
add(data.qa, [currentIds[2], 'Classeur · Publication', 'Campagne complète requise pour la livraison certifiée',
  'Non exécuté', 'P0', 'scripts/run-combat-ci.mjs puis générateur officiel',
  'La réconciliation ne produit aucune preuve CI complète. Les contrôles navigateur, le matériel réel et les revues artistiques gardent leur propre périmètre.',
  'Exécuter la campagne complète sur les sources finales et régénérer le classeur avant le packaging certifié.', '']);
data.currentQa = { gameVersion: data.version, campaign: 'workbook-reconciliation-2026-11-19', complete: false,
  rowIds: currentIds, evidence: 'docs/combat-workbook-reconciliation-2026-11-19.json',
  scope: 'Réconciliation des documents. La campagne CI complète des sources fusionnées reste requise.' };
data.historicalQaRows = data.qa.length - currentIds.length;
data.qaSummaryScope = 'Historique conservé et contrôles de réconciliation. Les succès historiques ne constituent pas de nouveaux essais du runtime fusionné.';
data.qaSummary = Object.fromEntries([...new Set(data.qa.map(row => row[3]))].map(status => [status, data.qa.filter(row => row[3] === status).length]));
for (const status of ['Réussi', 'Échec', 'Non exécuté', 'À vérifier']) data.qaSummary[status] ??= 0;
for (const [key, value] of [['features', data.features], ['production', data.production], ['scenarios', data.scenarios], ['qa', data.qa]]) data.counts[key] = value.length;
assert.equal(data.roster.length, 54); assert.equal(data.moves.length, 540); assert.equal(data.stages.length, 22);
assert.equal(data.counts.variants, 429); assert.equal(data.dedicatedStages.length, 54);
assert.equal(data.production.filter(row => row[1] === 'Costume crossover').length + VARIANTS.length, 429);

const sheetNames = ['Synthèse', ...Object.keys(TRACKER_SHEETS).filter(name => name !== 'QA'), 'Extension PNJ', 'QA', 'Références'];
const nativeBefore = sheetNames.flatMap(name => workbook.worksheets.getItem(name).tables.items.map(table => ({ sheet: name, name: table.name, style: table.style, filter: table.showFilterButton })));
const extensionBefore = normalized(workbook.worksheets.getItem('Extension PNJ').tables.items[0].getDataRows());
const summaryBeforeFormulas = workbook.worksheets.getItem('Synthèse').getRange('A1:H34').formulas;
let modifiedCells = 0, expandedRows = 0;
for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
  const sheet = workbook.worksheets.getItem(name), table = sheet.tables.items[0], source = versions.main.tables[name];
  const rows = data[key], width = source.headers.length, oldCount = source.rows.length;
  assert.deepEqual(rows.slice(0, oldCount).map(row => row[0]), source.rows.map(row => row[0]), `Existing order changed: ${name}`);
  assert.equal(new Set(rows.map(row => row[0])).size, rows.length, `Duplicate merged ID: ${name}`);
  if (rows.length > oldCount) table.rows.add(null, rows.slice(oldCount).map(row => row.map(literal)));
  const widths = source.headers.map((_, c) => sheet.getRange(`${column(c + 1)}5`).format.columnWidth || 22);
  for (let i = 0; i < rows.length; i++) {
    let changed = i >= oldCount;
    const range = sheet.getRange(`A${i + 6}:${column(width)}${i + 6}`);
    if (i >= oldCount) {
      range.copyFrom(sheet.getRange(`A6:${column(width)}6`), 'all');
      range.values = [rows[i].map(literal)];
      range.format.fill = i % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
      sheet.getRange(`${column(width)}${i + 6}`).format.fill = '#FFF1C9';
    } else for (let c = 0; c < width; c++) if (!equal(source.rows[i][c], rows[i][c])) {
      assert(!hasValue(source.formulas[i]?.[c]), `Refusing to replace formula: ${name}/${rows[i][0]}/${column(c + 1)}`);
      sheet.getRange(`${column(c + 1)}${i + 6}`).values = [[literal(rows[i][c])]];
      modifiedCells++; changed = true;
    }
    for (let c = 0; c < width; c++) {
      const formula = mergedFormulas.get(name).get(`${rows[i][0]}\0${c}`);
      if (formula) sheet.getRange(`${column(c + 1)}${i + 6}`).formulasR1C1 = [[formula.formula]];
    }
    if (changed) {
      const lines = Math.max(1, ...rows[i].map((value, c) => String(value ?? '').split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.length / Math.max(12, widths[c] * 1.05))), 0)));
      const height = Math.max(29, lines * 13 + 8, i >= oldCount ? (name === 'Production' ? 92 : 70) : 0);
      if (height > (range.format.rowHeight ?? 29)) { range.format.rowHeight = height; expandedRows++; }
    }
  }
  if (rows.length > oldCount) {
    const columns = { 'Fonctionnalités': [4], 'Combattants': [5, 6, 8], 'Techniques': [14, 15], 'Arènes': [3, 4], 'Atlas': [5, 6], 'Production': [5], 'Scénarios': [8], 'QA': [4] }[name];
    for (const c of columns) {
      const range = sheet.getRange(`${column(c)}${oldCount + 6}:${column(c)}${rows.length + 5}`);
      range.dataValidation = { rule: { type: 'list', values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] } };
      for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Échec', '#FBE0E0', '#A12A2A'], ['Non exécuté', '#EAE7F1', '#56496D']]) range.conditionalFormats.add('containsText', { text, format: { fill, font: { color } } });
    }
  }
}
const references = workbook.worksheets.getItem('Références'), referenceTable = references.tables.items[0];
const { appendWorkbookReferences } = await readModule('scripts/combat-workbook-reference-rows.mjs');
const referencesBefore = referenceTable.getDataRows(), referenceIds = new Set(referencesBefore.map(row => row[0]));
const newSources = data.sources.filter(source => !referenceIds.has(source.id)).map(sourceArray);
appendWorkbookReferences(references, referenceTable, newSources);
for (let i = 0; i < data.sources.length; i++) {
  const range = references.getRange(`A${i + 6}:E${i + 6}`);
  if (i >= referencesBefore.length) { range.copyFrom(references.getRange('A6:E6'), 'all'); range.format.rowHeight = 90; }
  range.values = [sourceArray(data.sources[i])];
}
references.getRange('A3').values = [['État du contenu : 19 novembre 2026. Les références de fiction ne valident pas les statistiques du jeu.']];
workbook.worksheets.getItem('QA').getRange('A3').values = [['Historique conservé. La réconciliation du classeur ne remplace pas la campagne CI complète ni les revues canoniques.']];

const summary = workbook.worksheets.getItem('Synthèse');
const set = (cell, value) => { summary.getRange(cell).values = [[value]]; };
const expected = new Map();
const formula = (cell, expression, value) => { summary.getRange(cell).formulas = [['=' + expression]]; expected.set(cell, value); };
set('H2', 'Version 0.7.0 · contenu réconcilié le 19 novembre 2026');
set('A9', 'Arènes communes'); set('A11', 'Costumes équipables'); set('E11', 'Atlas et Production');
summary.getRange('A12:F12').copyFrom(summary.getRange('A11:F11'), 'all');
set('A12', 'Arrangements par combattant'); set('C12', 'Décors partagés'); set('D12', 'À vérifier'); set('E12', 'Production');
set('H8', 'Équilibrage des 54 kits'); set('H13', 'Preuves datées conservées dans QA');
set('H14', 'Campagne Chromium complète à exécuter'); set('H15', `${data.historicalQaRows} lignes historiques et objectifs conservés`);
set('H16', 'Recalcul du classeur vérifié. Release à certifier.'); set('A22', 'Historique et réconciliation');
for (const [cell, key, name] of [['B7', 'fighters', 'Combattants'], ['B8', 'moves', 'Techniques'], ['B9', 'stages', 'Arènes'], ['B10', 'atlas', 'Atlas']]) {
  formula(cell, `COUNTA('${name}'!A6:A${data[TRACKER_SHEETS[name]].length + 5})`, data.counts[key]);
}
const productionEnd = data.production.length + 5, pb = `'Production'!B6:B${productionEnd}`, pd = `'Production'!D6:D${productionEnd}`, pe = `'Production'!E6:E${productionEnd}`;
formula('B11', `COUNTIFS('Atlas'!C6:C${data.atlas.length + 5},"Variante visuelle")+COUNTIFS(${pb},"Costume crossover")`, 429);
formula('B12', `COUNTIFS(${pb},"Arrangement d’arène")`, 54);
for (const [r, name, key, col] of [[15, 'Fonctionnalités', 'features', 4], [16, 'Production', 'production', 5], [17, 'Scénarios', 'scenarios', 8], [18, 'Atlas', 'atlas', 5]]) {
  const end = data[key].length + 5, c = column(col);
  for (let i = 0; i < 4; i++) formula(`${column(i + 2)}${r}`, `COUNTIFS('${name}'!${c}$6:${c}$${end},${column(i + 2)}$14)`, data[key].filter(row => row[col - 1] === ['Implémenté', 'Partiel', 'Prévu', 'À vérifier'][i]).length);
  formula(`F${r}`, `COUNTA('${name}'!A6:A${end})`, data[key].length);
}
for (let i = 0; i < 4; i++) formula(`${column(i + 2)}22`, `COUNTIFS('QA'!D6:D${data.qa.length + 5},${column(i + 2)}21)`, data.qaSummary[['Réussi', 'Échec', 'Non exécuté', 'À vérifier'][i]]);
formula('F22', `COUNTA('QA'!A6:A${data.qa.length + 5})`, data.qa.length);
set('A23', 'Constat historique partiel'); formula('B23', `COUNTIFS('QA'!D6:D${data.qa.length + 5},"Partiel")`, data.qaSummary.Partiel || 0);
const count = domain => data.production.filter(row => row[1] === domain).length;
formula('H19', `COUNTIFS('Scénarios'!B6:B${data.scenarios.length + 5},"Route individuelle")&" routes et "&COUNTIFS(${pb},"Tableau d’histoire")&" tableaux"`, `${data.scenarios.filter(row => row[1] === 'Route individuelle').length} routes et ${count('Tableau d’histoire')} tableaux`);
formula('H20', `COUNTIFS(${pb},"Briefing illustré")&" briefings de rencontre"`, `${count('Briefing illustré')} briefings de rencontre`);
formula('H21', `COUNTIFS(${pb},"Arène",${pd},"Musique de l’arène")&" thèmes musicaux d’arènes"`, `${data.counts.musicThemes} thèmes musicaux d’arènes`);
for (const [cell, domain, suffix] of [['H22', 'Motif sonore', ' motifs sonores synthétiques'], ['H23', 'Présentation individuelle', ' séquences de présentation'], ['H24', 'Animation d’arène', ' ambiances visuelles animées'], ['H25', 'Costume', ' costumes historiques redessinés'], ['H31', 'Finition visuelle', ' présentations de KO']]) formula(cell, `COUNTIFS(${pb},"${domain}")&"${suffix}"`, count(domain) + suffix);
formula('H32', `COUNTIFS(${pb},"Arène",${pd},"Ambiance sonore",${pe},"Implémenté")&" ambiances sonores originales"`, `${data.counts.audioAmbiences} ambiances sonores originales`);
formula('H27', `B7+B8+B9+COUNTIFS('Atlas'!C6:C${data.atlas.length + 5},"Variante visuelle")&" fiches, hors tenues crossover"`, '667 fiches, hors tenues crossover');
set('H33', '54 combattants · 540 techniques · 162 finales');
set('H34', '22 arènes communes · 54 arrangements à décor partagé');
summary.getRange('H35').copyFrom(summary.getRange('H32'), 'all');
formula('H35', `COUNTIFS(${pb},"Numéro d’amitié")&" numéros d’amitié procéduraux"`, '54 numéros d’amitié procéduraux');
set('A34', 'Chaque PNJ : dix techniques, trois finales et quatre rencontres. Kits et textes dérivés d’un modèle de rôle. Animations dédiées et comparaison canonique à poursuivre.');
summary.getRange('A34:F34').format.wrapText = true;
summary.getRange('A34:H34').format.rowHeight = 54;
workbook.recalculate();
for (const [cell, value] of expected) assert.equal(summary.getRange(cell).values[0][0], value, `Calculated summary mismatch: ${cell}`);
const statusCell = workbook.worksheets.getItem('Fonctionnalités').getRange('D6');
const status = statusCell.values[0][0], oldTotal = summary.getRange('B15').values[0][0];
statusCell.values = [[status === 'Implémenté' ? 'Prévu' : 'Implémenté']]; workbook.recalculate();
assert.equal(summary.getRange('B15').values[0][0], oldTotal + (status === 'Implémenté' ? -1 : 1));
statusCell.values = [[status]]; workbook.recalculate();
assert.equal(summary.getRange('B15').values[0][0], oldTotal);
let formulaCount = 0;
const errors = /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
for (const name of sheetNames) {
  const used = workbook.worksheets.getItem(name).getUsedRange(), values = used.values, formulas = used.formulas;
  formulas.forEach((row, r) => row.forEach((formula, c) => { if (hasValue(formula)) { formulaCount++; assert(!errors.test(String(values[r]?.[c] ?? '')), `Formula error: ${name}/${r + 1}/${c + 1}`); } }));
}
summaryBeforeFormulas.forEach((row, r) => row.forEach((formula, c) => { if (hasValue(formula)) assert(hasValue(summary.getRange(`${column(c + 1)}${r + 1}`).formulas[0][0]), 'An existing summary formula was removed'); }));
assert.deepEqual(normalized(workbook.worksheets.getItem('Extension PNJ').tables.items[0].getDataRows()), extensionBefore);
for (const [name, key] of Object.entries(TRACKER_SHEETS)) data[key] = normalized(workbook.worksheets.getItem(name).tables.items[0].getDataRows());

const renderSpecs = [
  ['Synthèse', 'A1:H35', 'summary'], ['Fonctionnalités', 'A103:I112', 'features'],
  ['Combattants', 'A18:O22', 'roster'], ['Techniques', 'A143:O147', 'moves'],
  ['Arènes', 'A25:N27', 'stages'], ['Atlas', 'A18:S21', 'atlas'],
  ['Production', `A${versions.main.tables.Production.rows.length + 6}:J${versions.main.tables.Production.rows.length + 9}`, 'crossovers'],
  ['Scénarios', `A${data.scenarios.length + 3}:K${data.scenarios.length + 5}`, 'scenarios'],
  ['Extension PNJ', 'A1:H5', 'extension'], ['QA', `A${data.qa.length + 3}:I${data.qa.length + 5}`, 'reconciliation-qa'],
  ['Références', `A${data.sources.length + 3}:E${data.sources.length + 8}`, 'references'],
];
for (const [name, range, label] of renderSpecs) {
  const preview = await workbook.render({ sheetName: name, range, scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${label}.png`), new Uint8Array(await preview.arrayBuffer()));
}
const xlsx = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
await (await SpreadsheetFile.exportXlsx(workbook)).save(xlsx);
const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsx));
const nativeTables = sheetNames.flatMap(name => reopened.worksheets.getItem(name).tables.items.map(table => ({ sheet: name, name: table.name, style: table.style, filter: table.showFilterButton, rows: table.getDataRows().length })));
assert.deepEqual(nativeTables.map(({ rows, ...metadata }) => metadata), nativeBefore, 'Native table metadata changed');
for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
  const sheet = reopened.worksheets.getItem(name), rows = normalized(sheet.tables.items[0].getDataRows());
  assert.deepEqual(rows, data[key], `Round-trip rows differ: ${name}`);
  const ids = new Set(rows.map(row => row[0]));
  for (const label of ['main', 'pr7']) for (const original of versions[label].tables[name].rows) {
    assert(ids.has(original[0]), `Lost ID: ${label}/${name}/${original[0]}`);
    if (hasValue(original.at(-1))) assert(String(rows.find(row => row[0] === original[0]).at(-1)).includes(String(original.at(-1))), `Lost note: ${label}/${name}/${original[0]}`);
  }
  for (const [id, { formula }] of mergedFormulas.get(name)) {
    const [rowId, c] = id.split('\0'), i = rows.findIndex(row => row[0] === rowId);
    assert.equal(sheet.getRange(`${column(+c + 1)}${i + 6}`).formulasR1C1[0][0], formula, 'Round-trip formula differs');
  }
}
assert.deepEqual(normalized(reopened.worksheets.getItem('Extension PNJ').tables.items[0].getDataRows()), extensionBefore);
for (const [cell, value] of expected) assert.equal(reopened.worksheets.getItem('Synthèse').getRange(cell).values[0][0], value, `Exported summary differs: ${cell}`);
const dataBytes = JSON.stringify(data, null, 2) + '\n';
const parents = {};
for (const label of ['main', 'pr7']) parents[label] = {
  workbookSHA256: sha256(await fs.readFile(versions[label].file)),
  trackerDataSHA256: sha256(await fs.readFile(path.join(snapshots, label, 'docs/combat-tracker-data.json'))),
};
const verification = {
  schema: 'encore-workbook-reconciliation/v1', gameVersion: data.version, createdAt: new Date().toISOString(),
  sourceParents: { main: '402dbd952337089517ae2b472a71fd0bb0993411', pr7: 'b64dc7ad33a7ec85f2bb69d906921403ad4cf09d' },
  counts: data.counts, qaSummary: data.qaSummary, qaSummaryScope: data.qaSummaryScope, currentQa: data.currentQa,
  parents, workbookSHA256: sha256(await fs.readFile(xlsx)), trackerDataSHA256: sha256(dataBytes),
  nativeTables, formulaErrors: 0, formulas: { count: formulaCount, generalRecalculation: true,
    summaryValuesChecked: expected.size, existingSummaryFormulaCellsPreserved: true, desktopExcelOpened: false },
  notesPreservation: { sourceNonEmptyNotes: Object.values(inventory).reduce((n, version) => n + Object.values(version.tables).reduce((m, table) => m + table.notes, 0), 0),
    collisions: noteCollisions, identityPreserved: true, exportRoundTripPassed: true, mainRowOrderPreserved: true },
  statusMutationRecalculated: true, extensionSheetPreserved: true, modifiedCells, expandedRows,
  renderedSheets: renderSpecs.map(([name]) => name), releaseReviewed: false, fullCiExecuted: false,
  limitations: ['Document reconciliation only. No full CI claim or release gate override.', 'No desktop Excel session, physical-device review or new canonical visual certification.', 'Historical test evidence remains historical.'],
};
await fs.writeFile(path.join(outputDir, 'combat-tracker-data.json'), dataBytes);
await fs.writeFile(path.join(outputDir, 'combat-workbook-verification.json'), JSON.stringify(verification, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, 'combat-workbook-reconciliation-2026-11-19.json'), JSON.stringify(verification, null, 2) + '\n');
console.log('ENCORE_WORKBOOK_RECONCILED ' + JSON.stringify({ outputDir, counts: data.counts, formulas: formulaCount, nativeTables: nativeTables.length, notes: verification.notesPreservation, releaseReviewed: false }));
if (args.includes('--publish')) {
  const { publishWorkbookArtifacts } = await readModule('scripts/workbook-publication.mjs');
  const files = ['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx', 'combat-tracker-data.json', 'combat-workbook-verification.json', 'combat-workbook-reconciliation-2026-11-19.json'];
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: files.map(name => ({ name, source: path.join(outputDir, name) })) });
  console.log('ENCORE_RECONCILIATION_COPIED_TO_DOCS');
}

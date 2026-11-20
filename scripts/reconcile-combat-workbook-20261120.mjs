/**
 * Reconcile the preserved November tracker after its memory-blocked export.
 * Authoring uses only public artifact-tool APIs in the primary runtime.
 * Run a private copy linked to the primary node_modules; outputs stay outside
 * the installed documents until the native, reimport and visual gates pass.
 * --prepare, --build, --reimport, --render [--view name], --publish
 * --with-ribbit requires the two completed runtime families and their receipts.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const root = path.resolve(flag('--repo-root', process.cwd()));
const recovery = path.resolve(flag('--recovery-dir', path.join(root, '../outputs/tracker-recovery-20261120')));
const output = path.resolve(flag('--output-dir', path.join(root, '../outputs/tracker-reconciliation-20261120')));
const targetDir = path.join(output, 'native-target');
const docDir = 'docs/art-generation/workbook-reconciliation-20261120';
const reviewFile = `${docDir}/workbook-review.json`;
const scriptFile = 'scripts/reconcile-combat-workbook-20261120.mjs';
const xlsxName = 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx';
const xlsxPath = path.join(output, xlsxName);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, data) => fs.writeFile(file, JSON.stringify(data, null, 2) + '\n');
const repoJson = file => json(path.join(root, file));
const loadModule = file => import(pathToFileURL(path.join(root, file)));
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const address = c => col(c[1]) + c[0];
const position = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref.replaceAll('$', '')); assert(m); return [Number(m[2]), [...m[1]].reduce((v, c) => v * 26 + c.charCodeAt(0) - 64, 0)]; };
const slots = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat'];
const tableKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
const normal = rows => rows.map(r => r.map(v => v ?? ''));
const reviewScopes = p => [...p.scopes,
  ['Production', 'A3106:J3108', 'production-recovered-1'], ['Production', 'A3109:J3111', 'production-recovered-2'],
  ['QA', 'A2266:I2267', 'qa-recovered-1'], ['QA', 'A2268:I2269', 'qa-recovered-2'],
  ['Références', 'A126:E129', 'references-recovered-1'], ['Références', 'A130:E133', 'references-recovered-2'],
  ['Références', 'A134:E137', 'references-recovered-3'], ['Références', 'A138:E140', 'references-recovered-4'],
  ['Références', 'A64:E64', 'references-offline'],
  ['Références', `A${p.counts.sources + 6}:E${p.counts.sources + 16}`, 'references-footer'],
];
const phase = label => { globalThis.gc?.(); console.log(JSON.stringify({ phase: label, ...process.memoryUsage() })); };
assert.notEqual(output, path.join(root, 'docs'));
await fs.mkdir(output, { recursive: true });
if (args.includes('--prepare')) { await prepare(); process.exit(0); }
if (args.includes('--publish')) { await publish(); process.exit(0); }
const { Workbook, SpreadsheetFile, FileBlob } = await import('@oai/artifact-tool');
const plan = await json(path.join(output, 'reconciliation-plan.json'));
if (args.includes('--reimport')) {
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  await verify(wb, plan, true);
  await writeJson(path.join(output, 'reimport-result.json'), { status: 'passed', sha256: digest(await fs.readFile(xlsxPath)), planSha256: digest(await fs.readFile(path.join(output, 'reconciliation-plan.json'))), trackerDataSha256: digest(await fs.readFile(path.join(output, 'combat-tracker-data.json'))), formulas: plan.formulas.length, allTableRowsCompared: true, sheets: plan.counts.sheets, nativeTables: plan.counts.nativeTables });
  phase('reimport-passed'); process.exit(0);
}
if (args.includes('--render')) {
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  await verify(wb, plan, false);
  for (const [sheetName, range, name] of reviewScopes(plan)) {
    if (flag('--view', null) && flag('--view') !== name) continue;
    const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(output, name + '.png'), new Uint8Array(await blob.arrayBuffer()));
    phase('rendered-' + name);
  }
  process.exit(0);
}
assert(args.includes('--build'), 'Choose --prepare, --build, --reimport, --render or --publish');
const manifest = await json(path.join(targetDir, 'manifest.json'));
const wb = Workbook.create();
for (const entry of manifest.sheets) wb.worksheets.add(entry.name);
for (const entry of manifest.sheets) {
  const data = await json(path.join(targetDir, entry.file));
  const sheet = wb.worksheets.getItem(entry.name);
  const maxRow = Math.max(...data.cells.map(c => c[0])), maxCol = Math.max(...data.cells.map(c => c[1]));
  const matrix = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));
  for (const c of data.cells) if (!c[4]) matrix[c[0] - 1][c[1] - 1] = typeof c[3] === 'string' && c[3].startsWith('=') ? `'${c[3]}` : c[3];
  for (let start = 0; start < maxRow; start += 160) {
    const block = matrix.slice(start, Math.min(maxRow, start + 160));
    sheet.getRangeByIndexes(start, 0, block.length, maxCol).values = block;
  }
  for (const c of data.cells) if (c[4]) sheet.getRange(address(c)).formulas = [[c[4]]];
  for (const table of data.tables) {
    assert(table.rowStripes);
    const native = sheet.tables.add(table.range, true, table.name);
    native.style = table.style; native.showFilterButton = table.filter;
    native.showBandedColumns = table.columnStripes; native.showTotals = false;
  }
  sheet.showGridLines = data.gridLines;
  if (data.tabColor) sheet.tabColor = data.tabColor;
  if (data.freeze.rows) sheet.freezePanes.freezeRows(data.freeze.rows);
  if (data.freeze.columns) sheet.freezePanes.freezeColumns(data.freeze.columns);
  for (const [number, width] of Object.entries(data.widths)) sheet.getRange(`${col(Number(number))}1`).format.columnWidth = width;
  for (const [number, height] of Object.entries(data.heights)) sheet.getRange(`A${number}`).format.rowHeight = height;
  for (const run of styleRuns(data.cells)) {
    const format = apiFormat(manifest.styles[run.style]);
    if (Object.keys(format).length) sheet.getRangeByIndexes(run.row - 1, run.column - 1, run.rows, run.columns).format = format;
  }
  for (const c of data.cells) if (Object.keys(manifest.styles[c[5]].borders).length) sheet.getRange(address(c)).format.borders = manifest.styles[c[5]].borders;
  for (const rule of data.validations) sheet.getRange(rule.range).dataValidation = { rule: { type: 'list', values: rule.values } };
  for (const rule of data.rules) sheet.getRange(rule.range).conditionalFormats.add('containsText', { text: rule.text, format: rule.format });
  phase('authored-' + entry.name);
}
wb.recalculate();
await verify(wb, plan, true);
const summary = wb.worksheets.getItem('Synthèse'), production = wb.worksheets.getItem('Production');
const statusCell = plan.statusMutationCell, old = production.getRange(statusCell).values[0][0];
assert.equal(old, 'Implémenté');
const implemented = summary.getRange('B16').values[0][0], partial = summary.getRange('C16').values[0][0];
production.getRange(statusCell).values = [['Partiel']]; wb.recalculate();
assert.equal(summary.getRange('B16').values[0][0], implemented - 1);
assert.equal(summary.getRange('C16').values[0][0], partial + 1);
production.getRange(statusCell).values = [[old]]; wb.recalculate();
await verify(wb, plan, false);
const inspected = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 100 }, maxChars: 3000 });
await fs.writeFile(path.join(output, 'formula-error-scan.ndjson'), inspected.ndjson);
await (await SpreadsheetFile.exportXlsx(wb)).save(xlsxPath);
await writeJson(path.join(output, 'authoring-result.json'), { status: 'exported-awaiting-native-comparison-reimport-visual-review', sha256: digest(await fs.readFile(xlsxPath)), planSha256: digest(await fs.readFile(path.join(output, 'reconciliation-plan.json'))), trackerDataSha256: digest(await fs.readFile(path.join(output, 'combat-tracker-data.json'))), method: 'Workbook.create from constrained native snapshot via public APIs', formulas: plan.formulas.length, errors: 0, representativeStatusRecalculationPassed: true });
phase('exported');

async function prepare() {
  const baseCompare = await json(path.join(recovery, 'recovery-native-comparison.json'));
  const baseImport = await json(path.join(recovery, 'reimport-result.json'));
  assert.equal(baseCompare.status, 'passed'); assert.equal(baseImport.status, 'passed-formula-and-row-count-checks');
  const frozenSnapshots = await repoJson('docs/art-generation/workbook-recovery-20261120/native-snapshot-hashes.json');
  for (const [folder, entries] of Object.entries(frozenSnapshots)) for (const entry of entries) {
    const bytes = await fs.readFile(path.join(recovery, folder, entry.file));
    assert.equal(bytes.length, entry.bytes); assert.equal(digest(bytes), entry.sha256, `Frozen recovery snapshot changed: ${folder}/${entry.file}`);
  }
  const baselineHashes = {};
  for (const name of [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json', 'combat-qa-evidence-0.7.0.json']) baselineHashes['docs/' + name] = digest(await fs.readFile(path.join(root, 'docs', name)));
  assert.equal(baselineHashes['docs/' + xlsxName], 'fdba67e67cebfd18a5988017c86ee7abe6cbb5fa625d0d4b5e850c125deac89d');
  assert.equal(baselineHashes['docs/combat-tracker-data.json'], 'cdc0eb3a39b03ec8bc40458f3790a7068c9af672f86dc09ac4f82e936a5ded32');
  const data = await json(path.join(recovery, 'combat-tracker-data.json'));
  const before = structuredClone(data);
  // The frozen preparation marked its intended workbook success before export.
  // Keep that checkpoint on disk, but do not publish its unexecuted claim as fact.
  const preparedWorkbookIndex = data.qa.findIndex(row => row[0] === 'CAST27-workbook');
  assert(preparedWorkbookIndex >= 0);
  data.qa[preparedWorkbookIndex] = [...data.qa[preparedWorkbookIndex]];
  data.qa[preparedWorkbookIndex][3] = 'Non exécuté';
  data.qa[preparedWorkbookIndex][6] = 'Au checkpoint initial, les quinze lignes et le modèle étaient préparés, mais l’export XLSX était bloqué par la mémoire. Aucun nouveau classeur n’avait alors été publié.';
  data.qa[preparedWorkbookIndex][7] = `État historique : docs/art-generation/workbook-recovery-20261120/workbook-review.json. La reprise achevée est consignée séparément dans TRACKER28-reconciliation et ${reviewFile}.`;
  const native = await json(path.join(recovery, 'native-target/manifest.json'));
  const sheets = new Map();
  for (const entry of native.sheets) sheets.set(entry.name, await json(path.join(recovery, 'native-target', entry.file)));
  const sourceSheets = structuredClone([...sheets]);
  const evidenceHashes = {};
  async function evidence(file, expected) {
    const bytes = await fs.readFile(path.join(root, file)), hash = digest(bytes);
    if (expected) assert.equal(hash, expected, `Evidence changed: ${file}`);
    evidenceHashes[file] = hash;
    return JSON.parse(bytes);
  }
  const propFolder = 'docs/art-generation/props-integration-20261120';
  const resumeFolder = 'docs/art-generation/cast-resumption-20261120';
  const nextFolder = 'docs/art-generation/cast-next-20261120';
  const propsProof = await evidence(propFolder + '/verification.json');
  const props = await evidence(propsProof.assets.inventory, propsProof.assets.sha256);
  const resumeProof = await evidence(resumeFolder + '/verification.json');
  const resume = await evidence(resumeFolder + '/generation-completion.json');
  const nextProof = await evidence(nextFolder + '/verification.json');
  const next = await evidence(nextProof.generation.evidence.file, nextProof.generation.evidence.sha256);
  for (const proof of [nextProof.qa, nextProof.canvas, nextProof.visualReview, nextProof.independentRuntimeAudit, nextProof.buildIntegrity]) await evidence(proof.evidence.file, proof.evidence.sha256);
  for (const proof of [resumeProof.nativeIntegrityAudit, resumeProof.runtimeDirectionReview, resumeProof.visualReview, resumeProof.buildIntegrity]) await evidence(resumeFolder + '/' + proof.file, proof.sha256);
  await evidence(propsProof.canvas.report, propsProof.canvas.sha256);
  assert.equal(propsProof.assets.nativeCopiesVerified, 6); assert.equal(resumeProof.generation.newCompleteAppearances, 9); assert.equal(nextProof.generation.appearances, 10);
  assert.equal(nextProof.qa.failed, 0); assert.equal(nextProof.qa.bothBuildsPassed, true);
  const [{ COSTUME_ADDITIONS, COSTUME_ADDITION_SOURCES }, runtime, offline] = await Promise.all([
    loadModule('combat/costume-additions.mjs'), loadModule('combat/data.mjs'), loadModule('combat/offline-manifest.mjs'),
  ]);
  const additions = new Map(COSTUME_ADDITIONS.map(a => [a.id, a]));
  const sourceMap = new Map(COSTUME_ADDITION_SOURCES.map(s => [s.id, s]));
  const offlineFiles = new Set(offline.ART_FILES.map(f => f.replace(/^\.\.\//, '')));
  let waves = [{ prefix: 'RESUME28', folder: resumeFolder, report: resumeProof, completion: resume }, { prefix: 'DISCOVERY28', folder: nextFolder, report: nextProof, completion: next }];
  if (args.includes('--with-ribbit')) {
    const folder = 'docs/art-generation/cast-ribbit-20261120';
    const completion = await evidence(folder + '/generation-completion.json');
    const report = await evidence(folder + '/verification.json');
    assert.equal(evidenceHashes[folder + '/generation-completion.json'], report.generation.manifestSha256);
    const datedQa = await evidence(folder + '/' + report.qa.evidence);
    const datedCanvas = await evidence(folder + '/' + report.canvas.evidence);
    const datedIntegrity = await evidence(folder + '/' + report.integrity.evidence);
    await evidence(folder + '/' + report.visualReview.evidence);
    const independent = await evidence(folder + '/' + report.visualReview.independentEvidence);
    await evidence(folder + '/' + independent.integrityReport);
    await evidence(folder + '/' + independent.runtimeReport);
    await evidence(folder + '/' + report.browser.evidence);
    assert.equal(datedQa.testSummary.tests, report.qa.tests); assert.equal(datedQa.testSummary.fail, 0); assert.equal(datedQa.bothBuildsPassed, true);
    assert.equal(datedCanvas.counts.missing, 0); assert.equal(datedIntegrity.status, 'passed');
    assert.equal(report.runtimeCounts.costumes, runtime.COSTUMES.length); assert.equal(report.runtimeCounts.offlineImages, offline.ART_FILES.length);
    for (const [file, expected] of Object.entries(report.sources)) {
      const actual = digest(await fs.readFile(path.join(root, file))); assert.equal(actual, expected, 'Current Ribbit source changed: ' + file); evidenceHashes[file] = actual;
    }
    assert.deepEqual(completion.appearances.map(a => a.id).sort(), ['animeribbit', 'jaxsuitribbit']);
    assert(completion.appearances.every(a => a.files.length === 11));
    assert(additions.has('animeribbit') && additions.has('jaxsuitribbit'));
    waves.push({ prefix: 'RIBBIT28', folder, report, completion });
  }
  assert.equal(COSTUME_ADDITIONS.length, args.includes('--with-ribbit') ? 35 : 33, 'Unexpected live catalogue; re-audit the intended scope');
  const newAssets = [], newProduction = [], changedRows = [];
  const scope = 'Dessins statiques adaptés au jeu. Les cycles animés complets et la comparaison canonique plan par plan restent ouverts.';
  for (const wave of waves) for (const appearance of wave.completion.appearances) {
    const def = additions.get(appearance.id); assert(def, 'Missing active appearance ' + appearance.id);
    assert.deepEqual(appearance.files.map(f => f.slot).sort(), [...slots].sort());
    for (const file of appearance.files) {
      const activeFile = file.targetFile || file.file;
      assert(activeFile.startsWith('assets/encore/'));
      const bytes = await fs.readFile(path.join(root, activeFile));
      assert.equal(digest(bytes), file.sha256, 'Native file changed: ' + activeFile);
      assert.equal(bytes.length, file.bytes);
      assert(offlineFiles.has(activeFile), 'Not in offline catalogue: ' + activeFile);
      newAssets.push({ id: appearance.id, slot: file.slot, file: activeFile, sha256: file.sha256, bytes: file.bytes, generationManifest: wave.folder + '/generation-completion.json', published: true });
    }
    const sourceIds = def.fidelity.sourceIds;
    const sourceText = sourceIds.map(id => { assert(sourceMap.has(id)); return sourceMap.get(id).scope; }).join(' ');
    const priorIndex = data.production.findIndex(row => row[0] === `CIRCUS27-${appearance.id}`);
    const row = [priorIndex >= 0 ? `CIRCUS27-${appearance.id}` : `${wave.prefix}-${appearance.id}`, 'Tenue Circus', def.name,
      'Portrait, garde et neuf poses', 'Implémenté', 'P1',
      `assets/encore/selection/${appearance.id}.png\nassets/encore/stance/${appearance.id}.png\nassets/encore/poses/${appearance.id}/`,
      `11 PNG natifs distincts inclus dans le manifeste. Sélection, garde, entrée, attaque, coup lourd, impact, marche, saut, accroupissement, victoire, défaite. Preuve : ${wave.folder}/generation-completion.json.`,
      `${sourceText} ${scope}`, priorIndex >= 0 ? data.production[priorIndex][9] : ''];
    if (priorIndex >= 0) {
      assert.equal(data.production[priorIndex][4], 'Partiel');
      changedRows.push({ index: priorIndex, id: row[0], before: data.production[priorIndex], after: row }); data.production[priorIndex] = row;
    } else newProduction.push(row);
  }
  assert.equal(changedRows.length, 9);
  const propNames = ['Lampadaire du quai', 'Distributeur de billets du château', 'Point de contrôle orbital', 'Tourniquet du jardin', 'Microphone de jazz', 'Point de contrôle en bambou'];
  for (const [index, prop] of props.assets.entries()) {
    const bytes = await fs.readFile(path.join(root, prop.file));
    assert.equal(digest(bytes), prop.sha256); assert.equal(bytes.length, prop.bytes); assert(offlineFiles.has(prop.file));
    newProduction.push([`PROP28-${prop.id}`, 'Accessoire d’arène', propNames[index], prop.stageId, 'Implémenté', 'P1', prop.file,
      `PNG natif intégré au décor existant. Copie identique de ${prop.source}. Preuve : ${propFolder}/verification.json.`,
      'Accessoire original du fan-game. Six décors et dix-huit vues caméra revus avec le rendu Canvas. Aucune nouvelle arène créée.', '']);
  }
  const ribbitReviewFile = 'docs/art-generation/ribbit-candidates-20261120/reference-review.md';
  evidenceHashes[ribbitReviewFile] = digest(await fs.readFile(path.join(root, ribbitReviewFile)));
  await evidence('docs/art-generation/ribbit-candidates-20261120/references/downloads.json');
  newProduction.push(['RIBBIT28-maidribbit-reference', 'Référence à compléter', 'Ribbit — Maid', 'Qualifier le bas du costume avant génération', 'À vérifier', 'P1', ribbitReviewFile,
    'La tenue est distincte, mais les pieds ne sont pas visibles dans le portrait officiel. Les vues de groupe masquent ou ne précisent pas les chaussures et les jambes.',
    'Obtenir une vue officielle du corps entier. Ne pas inventer la couleur des bas ou chaussures. Aucun PNG actif ni costume achevé n’est compté pour cette candidate.', '']);
  data.production.push(...newProduction);
  const originalSourceIds = new Set(data.sources.map(s => s.id));
  const newSources = [];
  for (const wave of waves) for (const a of wave.completion.appearances) for (const id of additions.get(a.id).fidelity.sourceIds) {
    if (originalSourceIds.has(id)) continue;
    const source = sourceMap.get(id); assert(source);
    const row = { ...source, scope: source.scope + (source.imageUrl ? ` Image de référence : ${source.imageUrl}` : '') };
    newSources.push(row); originalSourceIds.add(id);
  }
  newSources.push({ id: 'props-recovered-20261120', title: 'Six accessoires récupérés et intégrés — 20 novembre 2026', kind: 'Production originale du fan-game', url: 'https://github.com/darknigthmare/CainOS/blob/feat/encore-glitch-crossovers/docs/art-generation/props-integration-20261120/verification.json', scope: 'Six PNG natifs, six décors existants et dix-huit vues caméra. Sources et empreintes conservées dans le manifeste local.' });
  newSources.push({ id: 'store-pendantz-maidribbit-review', title: 'GLITCH — Ribbit Pendantz — Maid, référence partielle', kind: 'Produit dérivé officiel · référence à compléter', url: 'https://glitchproductions.store/products/ribbit-pendantz-blindbox', scope: 'Photos officielles examinées le 20 novembre 2026. La robe est identifiable, mais les pieds et le bas des jambes restent masqués ou trop peu définis. Candidate non générée et non intégrée ; revue : ' + ribbitReviewFile });
  data.sources.push(...newSources);
  const offlineIndex = data.sources.findIndex(s => s.id === 'offline'); assert(offlineIndex >= 0);
  data.sources[offlineIndex].scope = `${offline.ART_FILES.length.toLocaleString('fr-FR')} images et ${offline.ART_BYTES.toLocaleString('fr-FR')} octets dans le manifeste local. La publication GitHub est vérifiée séparément.`;
  const qaRows = [];
  const qa = (id, area, title, status, proof, result, limit) => qaRows.push([id, area, title, status, 'P0', proof, result, limit, '']);
  qa('PROPS28-art', 'Accessoires · Inventaire et Canvas', 'Six accessoires natifs intégrés', 'Réussi', propFolder + '/verification.json', 'Six fichiers copiés à l’octet près, six décors, dix-huit vues caméra et les deux distributions vérifiés dans la passe datée.', scope);
  qa('PROPS28-node', 'Accessoires · Code', 'Tests Node et constructions du lot', 'Réussi', propFolder + '/verification.json', '401 tests Node réussis, zéro échec et les deux builds réussis lors du lot du 20 novembre.', 'Résultat historique lié à ce lot, non compté comme une exécution de la réconciliation.');
  qa('PROPS28-browser', 'Accessoires · Navigateur', 'Tentative Chromium du lot', 'Non exécuté', propFolder + '/browser-attempt.log', 'Chromium bloqué avant la première navigation. Zéro assertion navigateur exécutée.', 'Essais physiques et nouvelle campagne navigateur requis.');
  for (const wave of waves) {
    const count = wave.completion.appearances.length, report = wave.report;
    const nodeCount = report.qa?.tests ?? report.qa?.counts?.tests;
    assert(Number.isInteger(nodeCount) && nodeCount > 0, `Missing dated QA evidence: ${wave.folder}`);
    assert.equal(report.qa.failed ?? report.qa.counts?.fail ?? 0, 0);
    assert.equal(report.qa.bothBuildsPassed, true, `Both build results required: ${wave.folder}`);
    assert.equal(report.canvas?.missing ?? report.canvas?.counts?.missing, 0, `Canvas missing-file count required: ${wave.folder}`);
    qa(`${wave.prefix}-art`, 'Apparences · Inventaire', `${count} apparences achevées`, 'Réussi', wave.folder + '/generation-completion.json', `${count * 11} fichiers natifs actifs : ${count} sélections, ${count} gardes et ${count * 9} actions. Les empreintes ont été revérifiées lors de la réconciliation.`, scope);
    qa(`${wave.prefix}-canvas`, 'Apparences · Canvas', 'Rendu de production du lot', 'Réussi', wave.folder + '/verification.json', `${count} familles revues avec les modules Canvas du jeu dans la passe datée. Aucun fichier attendu manquant.`, 'Revue Canvas distincte des interactions DOM, audio et périphériques physiques.');
    qa(`${wave.prefix}-node`, 'Apparences · Code', 'Tests Node et constructions du lot', 'Réussi', wave.folder + '/verification.json', `${nodeCount} tests réussis et les deux constructions réussies, selon la preuve datée de ce lot.`, 'Exécution historique du lot identifié. La réconciliation du classeur ne relance pas ces tests du jeu.');
    qa(`${wave.prefix}-browser`, 'Apparences · Navigateur', 'Statut navigateur du lot', 'Non exécuté', wave.folder + '/verification.json', 'Le présent suivi ne réutilise aucune réussite navigateur provenant d’une autre révision. Voir la preuve du lot pour la tentative et la CI distante.', 'Aucune certification d’essai physique, de cycle complet ou de fidélité canonique globale.');
  }
  qa('TRACKER28-reconciliation', 'Suivi · Réconciliation', 'Reprise de l’export et mise à jour des lots', 'Réussi', reviewFile, 'Export XLSX, 42 formules recalculées, test temporaire de statut annulé, réimport et comparaison native de toutes les cellules. Onze feuilles et dix tables conservées.', 'Vérification du fichier exporté, distincte d’une session Excel desktop et de la validation complète du jeu.');
  data.qa.push(...qaRows);
  const allAssets = [...before.costumeAdditionCoverage.assets, ...newAssets];
  assert.equal(new Set(allAssets.map(a => a.file)).size, allAssets.length);
  assert.equal(new Set(allAssets.map(a => a.sha256)).size, allAssets.length, 'Each drawing slot must retain a distinct native image');
  assert.equal(allAssets.length, COSTUME_ADDITIONS.length * 11);
  for (const asset of before.costumeAdditionCoverage.assets) {
    const bytes = await fs.readFile(path.join(root, asset.file));
    assert.equal(digest(bytes), asset.sha256, 'Preserved appearance changed: ' + asset.file);
    assert.equal(bytes.length, asset.bytes); assert(offlineFiles.has(asset.file));
  }
  data.costumeAdditionHistory ||= [];
  data.costumeAdditionHistory.push({ coverage: before.costumeAdditionCoverage, review: before.costumeAdditionReview });
  data.costumePreparationHistory ||= [];
  if (data.pendingCostumeAdditions) data.costumePreparationHistory.push(data.pendingCostumeAdditions);
  if (data.pendingCostumeArtwork) data.costumePreparationHistory.push(data.pendingCostumeArtwork);
  if (data.costumeAdditionPreparation) data.costumePreparationHistory.push(data.costumeAdditionPreparation);
  for (const key of ['pendingCostumeAdditions', 'pendingCostumeArtwork', 'costumeAdditionPreparation']) if (data[key]) data[key] = { status: 'completed', completedBy: resumeFolder + '/generation-completion.json', pendingAppearances: 0, missingFiles: 0, historicalStatePreserved: true };
  data.costumeAdditionCoverage = { schema: 'encore-costume-addition-coverage/v1', asOf: '2026-11-20', ids: COSTUME_ADDITIONS.map(a => a.id), appearances: COSTUME_ADDITIONS.length, pngFiles: allAssets.length, bytes: allAssets.reduce((s, a) => s + a.bytes, 0), drawingsBySlot: Object.fromEntries(slots.map(s => [s, COSTUME_ADDITIONS.length])), publishedFiles: allAssets.length, sourceIds: [...new Set(COSTUME_ADDITIONS.flatMap(a => a.fidelity.sourceIds))], assets: allAssets };
  const latest = waves.at(-1), latestNodeCount = latest.report.qa.tests ?? latest.report.qa.counts?.tests;
  data.qaCampaigns ||= []; data.qaCampaigns.push(before.currentQa);
  data.currentQa = { gameVersion: data.version, campaign: latest.prefix.toLowerCase() + '-2026-11-20', complete: false, evidence: latest.folder + '/verification.json', workbookEvidence: reviewFile, rowIds: qaRows.filter(r => r[0].startsWith(latest.prefix)).map(r => r[0]), totals: { nodeTests: latestNodeCount, nodePassed: latestNodeCount, browserAssertionsExecutedByWorkbookReconciliation: 0 }, scope: 'Preuves du dernier lot importées avec leurs dates et empreintes. La réconciliation a contrôlé le classeur et les octets des assets, sans se déclarer nouvelle exécution des tests du jeu.' };
  data.costumeAdditionReview = { asOf: '2026-11-20', evidence: latest.folder + '/verification.json', workbookEvidence: reviewFile, qaRowIds: qaRows.map(r => r[0]), completedFrozenPreparations: 9, appendedAppearances: newProduction.filter(r => r[1] === 'Tenue Circus').length, addedProps: 6 };
  data.historicalQaRows = before.qa.length;
  data.qaSummary = Object.fromEntries(['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'].map(s => [s, data.qa.filter(r => r[3] === s).length]));
  data.qaSummaryScope = 'Lignes historiques et preuves datées, sans additionner les totaux de tests de différentes révisions comme des exécutions de cette réconciliation.';
  data.asOf = '2026-11-20'; data.contentAsOf = '2026-11-20';
  Object.assign(data.counts, { fighters: runtime.FIGHTERS.length, variants: runtime.COSTUMES.length, costumeAdditions: COSTUME_ADDITIONS.length, production: data.production.length, qa: data.qa.length, pendingCostumeAdditions: 0, pendingCostumeArtFiles: 0, offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES });
  data.workbookReconciliation = { asOf: '2026-11-20', evidence: reviewFile, recoveredCheckpoint: 'appearance-wave-ce7ceeb7', completedFrozenPreparations: 9, newActiveAppearanceRows: newProduction.filter(r => r[1] === 'Tenue Circus').length, newPropRows: 6, unqualifiedRibbitCandidates: args.includes('--with-ribbit') ? ['maidribbit'] : ['animeribbit', 'maidribbit', 'jaxsuitribbit'], correctedPreparedQaClaim: { id: 'CAST27-workbook', originalPreparedRow: before.qa[preparedWorkbookIndex], reason: 'The prepared status described a planned success, but its dated evidence explicitly records memory-blocked export. Current success is a separate QA row.' } };
  assert.equal(new Set(data.production.map(r => r[0])).size, data.production.length);
  assert.equal(new Set(data.qa.map(r => r[0])).size, data.qa.length);
  assert.equal(new Set(data.sources.map(r => r.id)).size, data.sources.length);
  const changed = new Map();
  const setCell = (name, ref, value, formula = null) => {
    const [r, c] = position(ref), cell = sheets.get(name).cells.find(x => x[0] === r && x[1] === c); assert(cell, `${name}!${ref}`);
    changed.set(name + '!' + ref, { sheet: name, cell: ref, before: cell.slice(2, 5), value, formula });
    cell[2] = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'; cell[3] = value; cell[4] = formula;
  };
  for (const row of changedRows) for (let c = 0; c < 9; c++) if (row.before[c] !== row.after[c]) setCell('Production', `${col(c + 1)}${row.index + 6}`, row.after[c]);
  for (const c of [3, 6, 7]) setCell('QA', `${col(c + 1)}${preparedWorkbookIndex + 6}`, data.qa[preparedWorkbookIndex][c]);
  const appendStyle = fill => { native.styles.push({ font: { name: 'Arial', size: 10, bold: false, italic: false, color: '#23243B' }, fill, borders: {}, numberFormat: 'General', horizontalAlignment: 'general', verticalAlignment: 'center', wrapText: true }); return native.styles.length - 1; };
  const styles = { light: appendStyle('#F4F0F8'), white: appendStyle('#FFFFFF'), note: appendStyle('#FFF1C9') };
  const rowHeight = (sheet, row, minimum) => Math.max(minimum, 13 * Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((s, line) => s + Math.max(1, Math.ceil(line.length / Math.max(12, (sheet.widths[c + 1] || 22) * 1.08))), 0))) + 10);
  function append(name, rows, oldCount, noteColumn) {
    const sheet = sheets.get(name), width = sheet.tables[0].columns.length;
    for (const [i, row] of rows.entries()) {
      const number = oldCount + i + 6;
      row.forEach((v, c) => sheet.cells.push([number, c + 1, typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'string', v, null, c + 1 === noteColumn ? styles.note : (oldCount + i) % 2 ? styles.white : styles.light]));
      sheet.heights[number] = rowHeight(sheet, row, name === 'Références' ? 70 : 42);
    }
    sheet.tables[0].range = `A5:${col(width)}${oldCount + rows.length + 5}`;
    if (name === 'Références') return;
    const range = `${name === 'QA' ? 'D' : 'E'}${oldCount + 6}:${name === 'QA' ? 'D' : 'E'}${oldCount + rows.length + 5}`;
    sheet.validations.push({ range, values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] });
    for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Non exécuté', '#EAE7F1', '#56496D']]) sheet.rules.push({ range, text, format: { font: { color }, fill }, priority: sheet.rules.length + 1 });
  }
  append('Production', newProduction, before.production.length, 10);
  append('QA', qaRows, before.qa.length, 9);
  for (const row of changedRows) {
    const sheet = sheets.get('Production'), number = row.index + 6;
    sheet.heights[number] = Math.max(sheet.heights[number] || 0, rowHeight(sheet, row.after, 42));
  }
  const amendedQaSheet = sheets.get('QA'), amendedQaNumber = preparedWorkbookIndex + 6;
  amendedQaSheet.heights[amendedQaNumber] = Math.max(amendedQaSheet.heights[amendedQaNumber] || 0, rowHeight(amendedQaSheet, data.qa[preparedWorkbookIndex], 42));
  const references = sheets.get('Références'), footerStart = before.sources.length + 6, shift = newSources.length;
  for (const c of references.cells) if (c[0] >= footerStart) c[0] += shift;
  references.heights = Object.fromEntries(Object.entries(references.heights).map(([r, h]) => [Number(r) >= footerStart ? Number(r) + shift : r, h]));
  append('Références', newSources.map(s => [s.id, s.title, s.kind, s.url, s.scope]), before.sources.length, null);
  setCell('Références', `E${offlineIndex + 6}`, data.sources[offlineIndex].scope);
  const summary = sheets.get('Synthèse');
  for (const c of summary.cells) if (c[4]) {
    let formula = c[4].replace(new RegExp(`('Production'![A-Z]+\\$?6:[A-Z]+\\$?)${before.production.length + 5}(?=[,)])`, 'g'), `$1${data.production.length + 5}`);
    formula = formula.replace(new RegExp(`('QA'![A-Z]+\\$?6:[A-Z]+\\$?)${before.qa.length + 5}(?=[,)])`, 'g'), `$1${data.qa.length + 5}`);
    if (formula !== c[4]) setCell('Synthèse', address(c), c[3], formula);
  }
  const summaryValues = { H2: 'Version 0.7.0 · suivi réconcilié au 20 novembre 2026', H8: `${COSTUME_ADDITIONS.length} tenues Circus · ${allAssets.length} dessins individuels`, H13: `${latestNodeCount} tests Node dans la preuve du dernier lot`, H14: 'État navigateur détaillé dans les preuves datées', H15: 'Classeur recalculé et réimporté ; historique conservé', H16: '9 préparations achevées · 6 accessoires intégrés', H30: `105 ensembles de base + ${COSTUME_ADDITIONS.length} tenues (${allAssets.length} PNG)` };
  for (const [ref, value] of Object.entries(summaryValues)) setCell('Synthèse', ref, value);
  const lookup = new Map([...sheets].map(([name, sheet]) => [name, new Map(sheet.cells.map(c => [address(c), c]))]));
  for (const c of summary.cells) if (c[4]) { c[3] = evaluate(c[4].slice(1), lookup, 'Synthèse'); c[2] = typeof c[3] === 'number' ? 'number' : 'string'; }
  assert.equal(lookup.get('Synthèse').get('B11')[3], runtime.COSTUMES.length);
  assert.equal(lookup.get('Synthèse').get('F16')[3], data.production.length);
  assert.equal(lookup.get('Synthèse').get('F22')[3], data.qa.length);
  let constrainedCells = 0;
  for (const [name, source] of sourceSheets) {
    const target = sheets.get(name), cells = new Map(target.cells.map(c => [address(c), c]));
    for (const prop of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) assert.deepEqual(source[prop], target[prop], `${name}/${prop}`);
    for (const c of source.cells) {
      const ref = col(c[1]) + (c[0] + (name === 'Références' && c[0] >= footerStart ? shift : 0));
      const actual = cells.get(ref); assert(actual);
      assert.deepEqual(native.styles[c[5]], native.styles[actual[5]], `${name}/${ref} style`);
      if (!changed.has(name + '!' + ref)) assert.deepEqual(actual.slice(2, 5), c.slice(2, 5), `${name}/${ref} content`);
      constrainedCells++;
    }
  }
  await fs.mkdir(targetDir, { recursive: true });
  for (const entry of native.sheets) { const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]); entry.cells = sheet.cells.length; await writeJson(path.join(targetDir, entry.file), sheet); }
  native.sha256 = null; await writeJson(path.join(targetDir, 'manifest.json'), native);
  await writeJson(path.join(output, 'combat-tracker-data.json'), data);
  const scopes = [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']];
  scopes.push(['QA', `A${preparedWorkbookIndex + 6}:I${preparedWorkbookIndex + 6}`, 'qa-prepared-history']);
  for (let i = 0; i < newProduction.length; i += 3) scopes.push(['Production', `A${before.production.length + i + 6}:J${before.production.length + Math.min(i + 2, newProduction.length - 1) + 6}`, `production-new-${i / 3 + 1}`]);
  const changedStart = Math.min(...changedRows.map(r => r.index + 6)), changedEnd = Math.max(...changedRows.map(r => r.index + 6));
  for (let start = changedStart; start <= changedEnd; start += 3) scopes.push(['Production', `A${start}:J${Math.min(start + 2, changedEnd)}`, `production-completed-${start}`]);
  for (let i = 0; i < qaRows.length; i += 3) scopes.push(['QA', `A${before.qa.length + i + 6}:I${before.qa.length + Math.min(i + 2, qaRows.length - 1) + 6}`, `qa-${i / 3 + 1}`]);
  for (let i = 0; i < newSources.length; i += 4) scopes.push(['Références', `A${before.sources.length + i + 6}:E${before.sources.length + Math.min(i + 3, newSources.length - 1) + 6}`, `references-${i / 4 + 1}`]);
  const manifestBytes = await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'));
  const finalPlan = { schema: 'encore-tracker-reconciliation-plan/v1', createdAt: new Date().toISOString(), baselineHashes, recoveredNativeComparison: baseCompare, recoveredReimport: baseImport, historicalCellsConstrained: constrainedCells, approvedChangedCells: [...changed.values()], completedRows: changedRows.map(r => ({ id: r.id, row: r.index + 6 })), appendedProductionIds: newProduction.map(r => r[0]), appendedQaIds: qaRows.map(r => r[0]), appendedSourceIds: newSources.map(r => r.id), evidenceHashes, runtimeManifest: { offlineVersion: offline.OFFLINE_VERSION, artVersion: offline.ART_VERSION, artFiles: offline.ART_FILES.length, artBytes: offline.ART_BYTES, sha256: digest(manifestBytes) }, counts: { ...data.counts, sheets: native.sheets.length, nativeTables: [...sheets.values()].reduce((s, sh) => s + sh.tables.length, 0), sources: data.sources.length, completedPreparationRows: changedRows.length, addedProductionRows: newProduction.length, addedQaRows: qaRows.length, addedSourceRows: newSources.length, costumePngs: allAssets.length }, formulas: summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] })), statusMutationCell: `E${before.production.length + 6}`, scopes, historicalFooterShift: shift };
  await writeJson(path.join(output, 'reconciliation-plan.json'), finalPlan);
  phase('prepared-final-plan');
}

async function verify(workbook, p, tables) {
  const summary = workbook.worksheets.getItem('Synthèse');
  for (const f of p.formulas) { assert.equal(summary.getRange(f.cell).formulas[0][0], f.formula); assert.equal(summary.getRange(f.cell).values[0][0], f.value, f.cell); }
  if (!tables) return;
  const data = await json(path.join(output, 'combat-tracker-data.json'));
  for (const [sheetName, key] of Object.entries(tableKeys)) assert.deepEqual(normal(workbook.worksheets.getItem(sheetName).tables.items[0].getDataRows()), normal(data[key]), `All rows ${sheetName}`);
  assert.deepEqual(normal(workbook.worksheets.getItem('Références').tables.items[0].getDataRows()), normal(data.sources.map(s => [s.id, s.title, s.kind, s.url, s.scope])));
  // Extension PNJ has no separate companion array. Compare its native table
  // directly with the preserved target as well, so all ten tables are covered.
  const native = await json(path.join(targetDir, 'manifest.json'));
  for (const entry of native.sheets.filter(s => !(s.name in tableKeys) && s.name !== 'Références')) {
    const expected = await json(path.join(targetDir, entry.file));
    const cells = new Map(expected.cells.map(c => [address(c), c[3]]));
    for (const table of expected.tables) {
      const [first, last] = table.range.split(':').map(position);
      const rows = Array.from({ length: last[0] - first[0] }, (_, r) => Array.from({ length: last[1] - first[1] + 1 }, (_, c) => cells.get(col(first[1] + c) + (first[0] + r + 1))));
      const actual = workbook.worksheets.getItem(entry.name).tables.items.find(t => t.name === table.name); assert(actual);
      assert.deepEqual(normal(actual.getDataRows()), normal(rows), `Preserved native table ${entry.name}/${table.name}`);
    }
  }
}

async function publish() {
  const p = await json(path.join(output, 'reconciliation-plan.json'));
  const comparison = await json(path.join(output, 'native-comparison.json'));
  const imported = await json(path.join(output, 'reimport-result.json'));
  const authored = await json(path.join(output, 'authoring-result.json'));
  const visual = await json(path.join(output, 'visual-review.json'));
  const workbookSHA256 = digest(await fs.readFile(xlsxPath)), trackerDataSHA256 = digest(await fs.readFile(path.join(output, 'combat-tracker-data.json')));
  const planSha256 = digest(await fs.readFile(path.join(output, 'reconciliation-plan.json')));
  assert.equal(comparison.status, 'passed'); assert.equal(imported.status, 'passed'); assert.equal(visual.status, 'accepted');
  assert.equal(comparison.actualSHA256, workbookSHA256); assert.equal(imported.sha256, workbookSHA256); assert.equal(authored.sha256, workbookSHA256);
  assert.equal(authored.planSha256, planSha256); assert.equal(imported.planSha256, planSha256);
  assert.equal(authored.trackerDataSha256, trackerDataSHA256); assert.equal(imported.trackerDataSha256, trackerDataSHA256);
  assert.equal(visual.workbookSHA256, workbookSHA256); assert.equal(visual.planSha256, planSha256);
  const targetManifest = await json(path.join(targetDir, 'manifest.json'));
  const targetHashes = Object.fromEntries(await Promise.all(['manifest.json', ...targetManifest.sheets.map(s => s.file)].map(async file => [file, digest(await fs.readFile(path.join(targetDir, file)))])));
  assert.deepEqual(comparison.expectedSnapshotHashes, targetHashes, 'Native comparison must describe this exact prepared target');
  assert.deepEqual(visual.views.map(v => v.file).sort(), reviewScopes(p).map(s => s[2] + '.png').sort());
  for (const view of visual.views) assert.equal(digest(await fs.readFile(path.join(output, view.file))), view.sha256);
  for (const [file, expected] of Object.entries(p.baselineHashes)) assert.equal(digest(await fs.readFile(path.join(root, file))), expected, `Installed baseline changed: ${file}`);
  assert.equal(digest(await fs.readFile(path.join(root, 'combat/offline-manifest.mjs'))), p.runtimeManifest.sha256, 'Runtime changed after plan');
  for (const [file, expected] of Object.entries(p.evidenceHashes)) assert.equal(digest(await fs.readFile(path.join(root, file))), expected, 'Evidence changed after plan: ' + file);
  const data = await json(path.join(output, 'combat-tracker-data.json'));
  const report = { schema: 'encore-tracker-reconciliation-review/v1', createdAt: new Date().toISOString(), gameVersion: data.version, workbookSHA256, trackerDataSHA256, sourceDigests: { ...p.evidenceHashes, 'combat/offline-manifest.mjs': p.runtimeManifest.sha256, [scriptFile]: digest(await fs.readFile(path.join(root, scriptFile))) }, baselineHashes: p.baselineHashes, counts: p.counts, runtimeManifest: p.runtimeManifest, currentQa: data.currentQa, formulas: { count: p.formulas.length, recalculated: true, errors: 0, statusChangeRecalculated: true, exportRoundTripPassed: true }, nativeComparison: comparison, reimport: imported, visualReview: visual, historicalCellsConstrained: p.historicalCellsConstrained, originalIdsAndOrderPreserved: true, userNotesPreserved: true, historicalEvidencePreserved: true, completedPreparationRows: p.completedRows, appendedProductionIds: p.appendedProductionIds, appendedQaIds: p.appendedQaIds, appendedSourceIds: p.appendedSourceIds, releaseReviewed: false, fullCiExecuted: false, canonicalVisualApproval: false, limitations: ['Only workbook authoring, native comparison, export/reimport, visual inspection and asset hash checks were executed by this reconciliation.', 'Runtime QA results retain the actual dates and scopes of their generation waves.', 'No physical-device, desktop Excel, full animation or scene-by-scene canonical approval is claimed.'] };
  await writeJson(path.join(output, 'workbook-review.json'), report);
  await writeJson(path.join(output, 'combat-workbook-verification.json'), report);
  const { publishWorkbookArtifacts } = await loadModule('scripts/workbook-publication.mjs');
  await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: [xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json'].map(name => ({ source: path.join(output, name), name })) });
  const dest = path.join(root, docDir); await fs.mkdir(dest, { recursive: true });
  for (const name of ['workbook-review.json', 'reconciliation-plan.json', 'native-comparison.json', 'reimport-result.json', 'authoring-result.json', 'visual-review.json', 'formula-error-scan.ndjson']) await fs.copyFile(path.join(output, name), path.join(dest, name));
  for (const [, , name] of reviewScopes(p)) await fs.copyFile(path.join(output, name + '.png'), path.join(dest, name + '.png'));
  await writeJson(path.join(dest, 'publication.json'), { status: 'published_locally_verified', createdAt: new Date().toISOString(), files: Object.fromEntries(await Promise.all([xlsxName, 'combat-tracker-data.json', 'combat-workbook-verification.json'].map(async name => [name, digest(await fs.readFile(path.join(root, 'docs', name)))]))), historicalQaEvidencePreserved: digest(await fs.readFile(path.join(root, 'docs/combat-qa-evidence-0.7.0.json'))) === p.baselineHashes['docs/combat-qa-evidence-0.7.0.json'] });
  phase('published-and-verified');
}

function apiFormat(style) {
  const result = {};
  if (JSON.stringify(style.font) !== JSON.stringify({ name: 'Carlito', size: 11, bold: false, italic: false, color: null })) result.font = Object.fromEntries(Object.entries(style.font).filter(([, v]) => v !== null));
  if (style.fill) result.fill = style.fill;
  if (style.numberFormat !== 'General') result.numberFormat = style.numberFormat;
  if (style.horizontalAlignment !== 'general') result.horizontalAlignment = style.horizontalAlignment;
  if (style.verticalAlignment !== 'bottom') result.verticalAlignment = style.verticalAlignment;
  if (style.wrapText) result.wrapText = true;
  return result;
}
function styleRuns(cells) {
  const rows = new Map(); for (const c of cells) { if (!rows.has(c[0])) rows.set(c[0], []); rows.get(c[0]).push(c); }
  const result = [], open = new Map();
  for (const [row, items] of rows) {
    const ranges = [];
    for (const c of items) { const prior = ranges.at(-1); if (prior && prior.style === c[5] && prior.column + prior.columns === c[1]) prior.columns++; else ranges.push({ row, column: c[1], rows: 1, columns: 1, style: c[5] }); }
    const active = new Set();
    for (const r of ranges) { const key = `${r.column}:${r.columns}:${r.style}`; active.add(key); const prior = open.get(key); if (prior && prior.row + prior.rows === row) prior.rows++; else { result.push(r); open.set(key, r); } }
    for (const key of open.keys()) if (!active.has(key)) open.delete(key);
  }
  return result;
}
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

/**
 * Apply the 2026-10-29 readability and offline fixes to the established workbook.
 * Run with the managed primary runtime; dependencies are resolved through a
 * temporary symlink, without adding packages or node_modules to this checkout.
 *
 * node scripts/update-combat-workbook-readability.mjs --publish
 *   --ci-evidence audit-combat/ci/evidence-0.7.0.json
 *   --readability-evidence docs/readability-validation-2026-10-29.json
 *
 * Exports are verified in outputs/readability-20261029 before optional publication
 * to docs. Historical evidence and QA identities are retained. Existing current cases only refresh their execution proof.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  assert(args[index + 1] && !args[index + 1].startsWith('--'), 'Missing value for ' + name);
  return args[index + 1];
};
const root = path.resolve(flag('--repo-root', process.cwd()));
if (!args.includes('--primary-worker')) {
  const node = process.env.CODEX_PRIMARY_RUNTIME_NODE;
  const modules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
  assert(node && modules, 'The primary spreadsheet runtime is required; no dependency installation is performed.');
  const temporary = await fs.mkdtemp(path.join(path.resolve(flag('--temp-root', os.tmpdir())), 'encore-readability-workbook-'));
  try {
    await fs.symlink(modules, path.join(temporary, 'node_modules'), 'dir');
    const executable = path.join(temporary, 'update-combat-workbook-readability.mjs');
    await fs.copyFile(fileURLToPath(import.meta.url), executable);
    const child = spawnSync(node, ['--max-old-space-size=768', executable, ...args, '--repo-root', root, '--primary-worker'], { cwd: root, stdio: 'inherit' });
    if (child.error) throw child.error;
    process.exitCode = child.status ?? 1;
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
} else {
  try { await updateWorkbook(); }
  catch (error) { console.error('ENCORE_READABILITY_WORKBOOK_FAILED ' + error.message); process.exitCode = 1; }
}

async function updateWorkbook() {
  const { FileBlob, SpreadsheetFile } = await import('@oai/artifact-tool');
  const { TRACKER_SHEETS, QA_STATUSES, sha256, prepareCurrentTracker } = await import(pathToFileURL(path.join(root, 'scripts/combat-workbook-current-data.mjs')));
  const { publishWorkbookArtifacts } = await import(pathToFileURL(path.join(root, 'scripts/workbook-publication.mjs')));
  const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs', 'readability-20261029')));
  const previewDir = path.resolve(flag('--preview-dir', path.join(root, 'audit-combat', 'workbook-readability-20261029')));
  const input = path.resolve(flag('--input-workbook', path.join(root, 'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx')));
  const dataFile = path.resolve(flag('--input-data', path.join(root, 'docs/combat-tracker-data.json')));
  const ciFile = path.resolve(flag('--ci-evidence', path.join(root, 'audit-combat/ci/evidence-0.7.0.json')));
  const passFile = path.resolve(flag('--readability-evidence', path.join(root, 'docs/readability-validation-2026-10-29.json')));
  const ciPublished = 'docs/combat-qa-evidence-readability-2026-10-29.json';
  const passPublished = 'docs/readability-validation-2026-10-29.json';
  assert(path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx') !== input, 'Export to a separate staging directory before publication');
  assert(!(args.includes('--skip-previews') && args.includes('--publish')), 'Preview skipping is reserved for isolated repeat verification');
  const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
  const baselineData = await json(dataFile), evidence = await json(ciFile), pass = await json(passFile);
  const manifest = await json(path.join(root, 'docs/gamedev/manifest.json'));
  const fileDigest = async relative => {
    const target = path.resolve(root, relative);
    assert(target.startsWith(root + path.sep), 'Source path escapes checkout');
    return sha256(await fs.readFile(target));
  };
  assert.equal(pass.schema, 'encore-readability-validation/v1');
  assert.equal(pass.date, '2026-10-29');
  assert(/^[a-f0-9]{40}$/.test(pass.baseCommit), 'The historical base must be a full commit SHA');
  assert.equal(pass.sourceCommit, evidence.sourceCommit, 'Targeted and full evidence identify different tested commits');
  assert(Array.isArray(pass.checks) && pass.checks.length > 0, 'Targeted checks are required');
  assert.equal(new Set(pass.checks.map(check => check.id)).size, pass.checks.length, 'Duplicate targeted check ID');
  for (const check of pass.checks) {
    assert(/^[a-z0-9-]+$/.test(check.id), 'Invalid targeted check ID');
    assert(['passed', 'failed', 'not-run'].includes(check.status), 'Unknown targeted check status');
    for (const key of ['name', 'command', 'evidence']) assert(typeof check[key] === 'string' && check[key], 'Missing check ' + key);
  }
  for (const id of ['readability', 'archive-focus', 'offline-update', 'offline-cache']) assert(pass.checks.some(check => check.id === id), 'Missing targeted check: ' + id);
  assert(pass.sourceHashes && Object.keys(pass.sourceHashes).length, 'Targeted source hashes are required');
  for (const [file, digest] of Object.entries(pass.sourceHashes)) assert.equal(await fileDigest(file), digest, 'Targeted source drift: ' + file);
  const historicalEvidenceFiles = ['docs/combat-qa-evidence.json', 'docs/combat-qa-evidence-0.7.0.json', 'docs/combat-qa-evidence-gamedev-2026-10-29.json', 'docs/gamedev-validation-2026-10-29.json', 'docs/combat-qa-evidence-gamedev-followup-2026-10-29.json', 'docs/gamedev-followup-validation-2026-10-29.json'];
  const historicalEvidenceHashes = Object.fromEntries(await Promise.all(historicalEvidenceFiles.map(async file => [file, await fileDigest(file)])));

  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
  const names = ['Synthèse', ...Object.keys(TRACKER_SHEETS), 'Références'];
  const sheets = Object.fromEntries(names.map(name => [name, workbook.worksheets.getItem(name)]));
  const column = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
  const hasValue = value => value !== null && value !== undefined && value !== '';
  const literal = value => typeof value === 'string' && value.startsWith('=') ? "'" + value : value;
  const normalized = rows => rows.map(row => row.map(value => value ?? ''));
  const before = {}, notes = new Map(), data = structuredClone(baselineData);
  for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
    const sheet = sheets[name], table = sheet.tables.items[0];
    assert.equal(sheet.tables.items.length, 1, 'Expected one native table: ' + name);
    const headers = table.getHeaderRowRange().values[0], rows = table.getDataRows();
    assert.equal(headers.at(-1), 'Notes utilisateur');
    const ids = rows.map(row => String(row[0]));
    assert(ids.every(Boolean)); assert.equal(new Set(ids).size, ids.length, 'Duplicate workbook ID: ' + name);
    assert.deepEqual([...ids].sort(), baselineData[key].map(row => String(row[0])).sort(), 'Workbook/data identity mismatch: ' + name);
    const formulas = sheet.getRange(`A6:${column(headers.length)}${rows.length + 5}`).formulasR1C1;
    before[name] = { headers, rows: structuredClone(rows), formulas,
      heights: rows.map((_, index) => sheet.getRange(`A${index + 6}`).format.rowHeight) };
    notes.set(name, new Map(rows.flatMap((row, index) => {
      const formula = formulas[index]?.at(-1), value = row.at(-1);
      return hasValue(formula) || hasValue(value) ? [[String(row[0]), { value, formula: hasValue(formula) ? formula : null }]] : [];
    })));
    data[key] = normalized(rows);
  }
  const references = sheets['Références'], refTable = references.tables.items[0], refBefore = refTable.getDataRows();
  assert.deepEqual(refBefore.map(row => row[0]).sort(), baselineData.sources.map(source => source.id).sort(), 'Reference identity mismatch');
  assert.equal(new Set(refBefore.map(row => row[0])).size, refBefore.length);
  data.sources = refBefore.map(([id, title, kind, url, scope]) => ({ id, title, kind, url, scope }));
  const nativeBefore = names.flatMap(name => sheets[name].tables.items.map(table => ({ sheet: name, name: table.name, style: table.style, filter: table.showFilterButton })));
  assert.equal(nativeBefore.length, 9, 'Established native tables must be retained');
  const summary = sheets['Synthèse'];
  const summaryFormulaPositions = summary.getUsedRange().formulas.flatMap((row, r) => row.flatMap((value, c) => hasValue(value) ? [`${column(c + 1)}${r + 1}`] : []));

  const upsert = (rows, replacement) => {
    const index = rows.findIndex(row => row[0] === replacement[0]);
    if (index < 0) rows.push(replacement);
    else { replacement[replacement.length - 1] = rows[index].at(-1); rows[index] = replacement; }
  };
  const passed = id => pass.checks.find(check => check.id === id).status === 'passed';
  const state = ids => ids.every(passed) ? 'Implémenté' : 'À vérifier';
  const updateExisting = (key, id, changes) => {
    const row = data[key].find(row => row[0] === id); assert(row, 'Missing existing item: ' + id);
    for (const [index, value] of Object.entries(changes)) row[Number(index)] = value;
  };
  const offline = await import(pathToFileURL(path.join(root, 'combat/offline-manifest.mjs')));
  const readabilityFiles = 'combat/readability.mjs / combat/app.mjs / combat/render.mjs / combat/session.mjs / tests/combat-readability-browser.mjs';
  updateExisting('features', 'PRE-12', { 3: passed('readability') ? 'Partiel' : 'À vérifier', 5: readabilityFiles,
    6: 'Les signaux critiques sont distincts sans dépendre seulement des couleurs. Première tranche : Repères renforcés avec formes J1/J2, motifs et valeurs Vie/Garde/Finale ; VIE CRITIQUE et FINALE PRÊTE suivent les seuils réels.',
    7: 'Repères du HUD et des acteurs vérifiés dans le périmètre du rapport. Option conservée dans le profil v1, désactivée par défaut. Palette globale, autres indicateurs et validation avec des utilisateurs concernés restent ouverts.' });
  updateExisting('features', 'CTL-08', { 5: 'combat/menu-navigation.mjs / combat/app.mjs / tests/combat-accessibility-browser.mjs / tests/combat-readability-browser.mjs',
    6: 'Parcourir les groupes au clavier et à la manette. La recherche Archives conserve la sélection de texte et le focus. Quitter Archives annule son rafraîchissement différé.',
    7: 'Le rafraîchissement ne reprend pas le focus après Tab et ne réouvre pas Archives après navigation. Clavier et manette virtuelle vérifiés ; technologies d’assistance et manettes physiques à poursuivre.' });
  updateExisting('features', 'INT-11', { 5: 'combat/offline.mjs / combat/sw.js / tests/combat-offline.test.mjs / tests/combat-offline-browser.mjs',
    6: `Télécharger ${offline.ART_FILES.length} illustrations (${offline.ART_BYTES} octets) à la demande puis jouer sans réseau. Un pack incomplet après éviction reste incomplet si sa réparation échoue.`,
    7: 'Une mise à jour refusée ou expirée retire son écouteur de rechargement. Réessai possible. Le code conserve les illustrations inchangées ; préparation et capacité de stockage restent nécessaires.' });
  const production = [
    ['READ26-PLAYER-CUES', 'Accessibilité', 'Combat', 'Repères renforcés pour joueurs et jauges', state(['readability']), 'P1', readabilityFiles,
      'Formes et textes distinguent les joueurs, motifs et nombres distinguent Vie/Garde/Finale. Messages explicites aux seuils critiques. Repères lisibles dans les configurations testées.',
      'Option de présentation désactivée par défaut. Profil v1 et règles de replay conservés. Les palettes spécialisées et essais utilisateurs ne sont pas déclarés terminés.', ''],
    ['READ26-ARCHIVE-FOCUS', 'Interface', 'Archives', 'Recherche différée et focus conservés', state(['archive-focus']), 'P1', 'combat/app.mjs / combat/menu-navigation.mjs / tests/combat-readability-browser.mjs',
      'Annuler le rafraîchissement après sortie des Archives. Préserver le curseur et la sélection pendant la recherche ; respecter un changement de focus par Tab.',
      'Reproductions et parcours navigateur consignés dans la preuve ciblée. Aucun nouveau contrôle de saisie ni changement du catalogue.', ''],
    ['READ26-OFFLINE-UPDATE', 'Hors ligne', 'Mise à jour', 'Retirer un rechargement différé après refus', state(['offline-update']), 'P1', 'combat/offline.mjs / tests/combat-offline.test.mjs / tests/combat-offline-browser.mjs',
      'Retirer l’écouteur controllerchange si l’activation échoue ou expire. Un changement de contrôleur ultérieur ne recharge pas le jeu au titre de cette tentative.',
      'Conserver l’erreur, le réessai et l’activation réussie. Les profils et illustrations ne sont pas supprimés.', ''],
    ['READ26-OFFLINE-CACHE', 'Hors ligne', 'Illustrations', 'Invalider un pack évincé et incomplet', state(['offline-cache']), 'P1', 'combat/sw.js / tests/combat-offline-browser.mjs',
      'Réconcilier le marqueur de préparation avec les fichiers réellement présents. Après éviction puis réparation partielle en échec, annoncer un pack incomplet.',
      'La reprise doit télécharger les fichiers manquants et annoncer complet uniquement une fois tous les fichiers requis disponibles.', ''],
  ];
  for (const row of production) upsert(data.production, row);

  // Reuse stable case identities. Preserve previous case descriptions, expected
  // results and notes; only their execution evidence is refreshed after a rerun.
  // All other historical rows, including the four audio/save objectives, stay exact.
  const priorQa = new Map(data.qa.map(row => [row[0], [...row]]));
  const protectedQa = data.qa.filter(row => !/^GDF26-[NB]-/.test(row[0]) && !/^READ26-C-/.test(row[0])).map(row => [...row]);
  const checked = await prepareCurrentTracker({ root, priorData: data, evidence });
  const totals = checked.totals, freshIds = new Set(checked.data.currentQa.rowIds);
  const freshQa = checked.data.qa.filter(row => freshIds.has(row[0])).map(row => {
    const result = [...row]; result[0] = result[0].replace(/^CI07-/, 'GDF26-');
    const previous = priorQa.get(result[0]);
    if (previous) {
      assert.equal(previous[2], result[2], 'A stable case ID must retain its check name');
      assert.equal(previous[3], 'Réussi', 'Do not silently overwrite a previously failed case');
      const retained = [...previous]; retained[6] = result[6]; return retained;
    }
    result[1] = result[1].replace('CI 0.7', 'Lisibilité 2026-10-29');
    return result;
  });
  assert.equal(freshQa.length, totals.nodeTests + totals.browserChecks);
  const qaStatus = { passed: 'Réussi', failed: 'Échec', 'not-run': 'Non exécuté' };
  const targetedQa = pass.checks.map(check => ['READ26-C-' + check.id, 'Lisibilité 2026-10-29 · Contrôle ciblé', check.name, qaStatus[check.status], 'P1', check.command,
    `${pass.date}\n${check.evidence}\nDétail : ${passPublished}`,
    check.expected || `Réussir les assertions citées. ${check.limitations || 'Portée limitée aux fichiers et à l’environnement du rapport.'}`, '']);
  for (const row of [...freshQa, ...targetedQa]) upsert(data.qa, row);
  for (const row of protectedQa) assert.deepEqual(data.qa.find(current => current[0] === row[0]), row, 'Historical QA row changed: ' + row[0]);
  if (data.currentQa && data.currentQa.evidence !== ciPublished) {
    data.qaCampaigns ??= [];
    if (!data.qaCampaigns.some(campaign => campaign.evidence === data.currentQa.evidence)) data.qaCampaigns.push(structuredClone(data.currentQa));
  }
  data.currentQa = { gameVersion: data.version, campaign: 'readability-2026-10-29', sourceCommit: evidence.sourceCommit,
    runUrl: evidence.runUrl, totals, rowIds: freshQa.map(row => row[0]).sort(), evidence: ciPublished };
  data.readabilityPass = { date: pass.date, baseCommit: pass.baseCommit, sourceCommit: pass.sourceCommit, evidence: passPublished, upstreamCommit: manifest.upstreamCommit,
    targetedRowIds: targetedQa.map(row => row[0]), targetedChecks: targetedQa.length, currentCiEvidence: ciPublished,
    qaRowPolicy: 'Les IDs GDF26-N/B identifient les cas. Leur preuve suit la dernière exécution. Les résultats des campagnes précédentes restent dans leurs preuves complètes datées.' };
  const activeIds = new Set([...data.currentQa.rowIds, ...data.readabilityPass.targetedRowIds]);
  data.historicalQaRows = data.qa.filter(row => !activeIds.has(row[0])).length;
  data.contentAsOf ??= data.asOf; data.asOf = pass.date;
  Object.assign(data.counts, { features: data.features.length, production: data.production.length, qa: data.qa.length,
    offlineImages: offline.ART_FILES.length, offlineBytes: offline.ART_BYTES });
  data.qaSummary = Object.fromEntries(QA_STATUSES.map(status => [status, data.qa.filter(row => row[3] === status).length]));
  data.qaSummaryScope = 'Historique et objectifs de revue conservés. La campagne actuelle réutilise les IDs de cas exécutés et ajoute seulement les nouveaux cas. Les contrôles ciblés recoupent cette campagne ; le total de lignes ne compte pas des tests indépendants.';
  const extraSources = [
    { id: 'readability-evidence-20261029', title: 'Preuves de lisibilité, navigation Archives et hors ligne', kind: 'Exécutions automatiques datées', url: ciPublished,
      scope: 'Campagne complète et empreintes de sources. Contrôles ciblés : ' + passPublished + '. Les preuves des campagnes antérieures sont conservées.' },
  ];
  const sourceMap = new Map(data.sources.map(source => [source.id, source]));
  for (const source of extraSources) sourceMap.set(source.id, source);
  data.sources = [...sourceMap.values()];
  for (const key of Object.values(TRACKER_SHEETS)) assert.equal(new Set(data[key].map(row => row[0])).size, data[key].length, 'Duplicate data IDs: ' + key);

  await fs.mkdir(outputDir, { recursive: true }); await fs.mkdir(previewDir, { recursive: true });
  const render = async (name, range, label) => {
    if (args.includes('--skip-previews')) return;
    const blob = await workbook.render({ sheetName: name, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(previewDir, label + '.png'), new Uint8Array(await blob.arrayBuffer()));
  };
  await render('Synthèse', 'A1:H34', 'before-summary');
  const changes = [], addedRows = {};
  const statusColumns = { 'Fonctionnalités': 4, 'Production': 5, 'QA': 4 };
  const applyStatusRules = range => {
    for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Échec', '#FBE0E0', '#A12A2A'], ['Non exécuté', '#EAE7F1', '#56496D']]) range.conditionalFormats.add('containsText', { text, format: { fill, font: { color } } });
  };
  for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
    const sheet = sheets[name], table = sheet.tables.items[0], source = before[name], rows = data[key], width = source.headers.length, count = source.rows.length;
    assert.deepEqual(rows.slice(0, count).map(row => row[0]), source.rows.map(row => row[0]), 'Existing order changed: ' + name);
    addedRows[name] = rows.length - count;
    if (rows.length > count) {
      table.rows.add(null, rows.slice(count).map(row => row.map(literal)));
      for (let index = count; index < rows.length; index++) {
        const rowNumber = index + 6, range = sheet.getRange(`A${rowNumber}:${column(width)}${rowNumber}`);
        range.copyFrom(sheet.getRange(`A6:${column(width)}6`), 'all'); range.values = [rows[index].map(literal)];
        range.format.fill = index % 2 === 0 ? '#F4F0F8' : '#FFFFFF';
        range.format.rowHeight = name === 'QA' ? 126 : name === 'Production' ? 168 : 120;
        sheet.getRange(`${column(width)}${rowNumber}`).format.fill = '#FFF1C9';
      }
      if (statusColumns[name]) {
        const c = column(statusColumns[name]), range = sheet.getRange(`${c}${count + 6}:${c}${rows.length + 5}`);
        range.dataValidation = { rule: { type: 'list', values: name === 'QA' ? QA_STATUSES : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] } };
        applyStatusRules(range);
      }
    }
    for (let index = 0; index < count; index++) for (let c = 0; c < width - 1; c++) if ((source.rows[index][c] ?? '') !== (rows[index][c] ?? '')) {
      assert(!hasValue(source.formulas[index]?.[c]), `Refusing to replace a user formula: ${name}/${rows[index][0]}/${c + 1}`);
      assert(['PRE-12', 'CTL-08', 'INT-11'].includes(rows[index][0]) || rows[index][0].startsWith('READ26-') || (name === 'QA' && /^GDF26-[NB]-/.test(rows[index][0]) && c === 6 && freshQa.some(row => row[0] === rows[index][0])), 'Unrelated existing row changed');
      sheet.getRange(`${column(c + 1)}${index + 6}`).values = [[literal(rows[index][c])]];
      changes.push({ sheet: name, id: rows[index][0], column: c + 1 });
    }
  }
  for (const id of ['PRE-12', 'CTL-08', 'INT-11']) {
    const row = data.features.findIndex(entry => entry[0] === id) + 6;
    const range = sheets['Fonctionnalités'].getRange('A' + row + ':I' + row);
    range.format.rowHeight = Math.max(range.format.rowHeight || 0, 120);
  }

  // The established legend starts immediately below this table. Make explicit
  // room by copying its rows from bottom to top, including all cell formatting.
  const addedSources = data.sources.filter(source => !refBefore.some(row => row[0] === source.id));
  const legendStart = refBefore.length + 6, legendEnd = references.getUsedRange().values.length;
  const legendValues = references.getRange(`A${legendStart}:E${legendEnd}`).values;
  const legendFormulas = references.getRange(`A${legendStart}:E${legendEnd}`).formulasR1C1;
  assert.equal(legendValues[0][0], 'Lecture du suivi', 'Unexpected reference footer layout');
  if (addedSources.length) {
    const shift = addedSources.length;
    for (let row = legendEnd; row >= legendStart; row--) {
      const source = references.getRange(`A${row}:E${row}`), destination = references.getRange(`A${row + shift}:E${row + shift}`), height = source.format.rowHeight;
      destination.copyFrom(source, 'all'); destination.format.rowHeight = height;
    }
    references.getRange(`A${legendStart}:E${legendStart + shift - 1}`).values = Array.from({ length: shift }, () => Array(5).fill(null));
    refTable.rows.add(null, addedSources.map(source => [source.id, source.title, source.kind, source.url, source.scope]));
    for (let index = 0; index < shift; index++) {
      const row = legendStart + index, source = addedSources[index], range = references.getRange(`A${row}:E${row}`);
      range.copyFrom(references.getRange('A6:E6'), 'all');
      range.values = [[source.id, source.title, source.kind, source.url, source.scope]]; range.format.rowHeight = 88;
    }
  }
  // Existing reference rows retain their values and order.
  assert.deepEqual(data.sources.slice(0, refBefore.length).map(source => [source.id, source.title, source.kind, source.url, source.scope]), refBefore);
  const finalLegendStart = legendStart + addedSources.length, finalLegendEnd = legendEnd + addedSources.length;
  assert.deepEqual(references.getRange(`A${finalLegendStart}:E${finalLegendEnd}`).values, legendValues, 'Reference legend changed');
  assert.deepEqual(references.getRange(`A${finalLegendStart}:E${finalLegendEnd}`).formulasR1C1, legendFormulas, 'Reference legend formulas changed');
  references.getRange('A3').values = [[`Dates et état du suivi : ${data.asOf}. Les sources de fiction ne valident pas les statistiques du jeu.`]];
  sheets.QA.getRange('A3').values = [['GDF26-N/B : dernière exécution par cas. READ26-C : contrôles ciblés. Historique et quatre objectifs audio/sauvegarde conservés ; campagnes antérieures dans leurs preuves datées.']];
  const set = (cell, value) => { summary.getRange(cell).values = [[value]]; };
  set('H2', `Version ${data.version} · ${data.asOf}`);
  set('H13', `${totals.nodeTests} tests Node · ${totals.nodeSuites} suites`);
  set('H14', `${totals.browserChecks} contrôles Chromium · lisibilité`);
  set('H15', `${data.historicalQaRows} lignes historiques / revues`);
  set('H16', `Campagne + ${targetedQa.length} contrôles ciblés.`);
  set('A22', 'Historique et campagne actuelle');
  const expected = new Map();
  const formula = (cell, expression, value) => { summary.getRange(cell).formulas = [['=' + expression]]; expected.set(cell, value); };
  for (const [cell, key, sheet] of [['B7', 'fighters', 'Combattants'], ['B8', 'moves', 'Techniques'], ['B9', 'stages', 'Arènes'], ['B10', 'atlas', 'Atlas']]) formula(cell, `COUNTA('${sheet}'!A6:A${data[TRACKER_SHEETS[sheet]].length + 5})`, data.counts[key]);
  formula('B11', `COUNTIFS('Atlas'!C6:C${data.atlas.length + 5},"Variante visuelle")`, data.counts.variants);
  const statuses = ['Implémenté', 'Partiel', 'Prévu', 'À vérifier'];
  for (const [r, sheet, key, col] of [[15, 'Fonctionnalités', 'features', 4], [16, 'Production', 'production', 5], [17, 'Scénarios', 'scenarios', 8], [18, 'Atlas', 'atlas', 5]]) {
    const end = data[key].length + 5, c = column(col);
    for (let i = 0; i < statuses.length; i++) formula(`${column(i + 2)}${r}`, `COUNTIFS('${sheet}'!${c}$6:${c}$${end},${column(i + 2)}$14)`, data[key].filter(row => row[col - 1] === statuses[i]).length);
    formula(`F${r}`, `COUNTA('${sheet}'!A6:A${end})`, data[key].length);
  }
  for (let i = 0; i < QA_STATUSES.length; i++) formula(`${column(i + 2)}22`, `COUNTIFS('QA'!D6:D${data.qa.length + 5},${column(i + 2)}21)`, data.qaSummary[QA_STATUSES[i]]);
  formula('F22', `COUNTA('QA'!A6:A${data.qa.length + 5})`, data.qa.length);
  const end = data.production.length + 5, pb = `'Production'!B6:B${end}`, pd = `'Production'!D6:D${end}`, pe = `'Production'!E6:E${end}`;
  const count = domain => data.production.filter(row => row[1] === domain).length;
  formula('H19', `COUNTIFS('Scénarios'!B6:B${data.scenarios.length + 5},"Route individuelle")&" routes et "&COUNTIFS(${pb},"Tableau d’histoire")&" tableaux"`, `${data.scenarios.filter(row => row[1] === 'Route individuelle').length} routes et ${count('Tableau d’histoire')} tableaux`);
  formula('H20', `COUNTIFS(${pb},"Briefing illustré")&" briefings de rencontre"`, `${count('Briefing illustré')} briefings de rencontre`);
  formula('H21', `COUNTIFS(${pb},"Arène",${pd},"Musique de l’arène")&" thèmes musicaux d’arènes"`, `${data.production.filter(row => row[1] === 'Arène' && row[3] === 'Musique de l’arène').length} thèmes musicaux d’arènes`);
  for (const [cell, domain, suffix] of [['H22', 'Motif sonore', ' motifs sonores synthétiques'], ['H23', 'Présentation individuelle', ' séquences de présentation'], ['H24', 'Animation d’arène', ' ambiances visuelles animées'], ['H25', 'Costume', ' costumes redessinés'], ['H31', 'Finition visuelle', ' présentations de KO']]) formula(cell, `COUNTIFS(${pb},"${domain}")&"${suffix}"`, count(domain) + suffix);
  formula('H32', `COUNTIFS(${pb},"Arène",${pd},"Ambiance sonore",${pe},"Implémenté")&" ambiances sonores originales"`, `${data.counts.audioAmbiences} ambiances sonores originales`);
  assert.deepEqual([...expected.keys()].sort(), [...summaryFormulaPositions].sort(), 'Unexpected summary formula layout');
  workbook.recalculate();
  for (const [cell, value] of expected) assert.equal(summary.getRange(cell).values[0][0], value, 'Calculated summary mismatch: ' + cell);
  const statusCell = sheets['Fonctionnalités'].getRange('D6'), oldStatus = statusCell.values[0][0], oldTotal = summary.getRange('B15').values[0][0];
  statusCell.values = [[oldStatus === 'Implémenté' ? 'Prévu' : 'Implémenté']]; workbook.recalculate();
  assert.equal(summary.getRange('B15').values[0][0], oldTotal + (oldStatus === 'Implémenté' ? -1 : 1));
  statusCell.values = [[oldStatus]]; workbook.recalculate(); assert.equal(summary.getRange('B15').values[0][0], oldTotal);
  const errorPattern = /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/;
  let formulaCount = 0;
  for (const name of names) {
    const range = sheets[name].getUsedRange(), formulas = range.formulas, values = range.values;
    for (let r = 0; r < formulas.length; r++) for (let c = 0; c < formulas[r].length; c++) if (hasValue(formulas[r][c])) {
      formulaCount++; assert(!errorPattern.test(String(values[r]?.[c] ?? '')), `Formula error: ${name}/${r + 1}/${c + 1}`);
    }
  }
  console.log((await workbook.inspect({ kind: 'table', range: 'Synthèse!A13:H22', include: 'values,formulas', tableMaxRows: 10, tableMaxCols: 8, maxChars: 4500 })).ndjson);
  console.log((await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 50 }, summary: 'Formula error scan' })).ndjson);
  // Formula notes can legitimately recalculate when a tracked total changes.
  // Keep their formulas, and record their newly calculated values in JSON.
  for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
    const rows = sheets[name].tables.items[0].getDataRows();
    for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) if (!hasValue(before[name].formulas[r]?.[c])) {
      assert.equal(rows[r][c] ?? '', data[key][r][c] ?? '', 'Unexpected cell value: ' + name + '/' + (r + 6) + '/' + (c + 1));
    }
    data[key] = normalized(rows);
  }
  const verifyRows = (book, roundTrip) => {
    for (const [name, key] of Object.entries(TRACKER_SHEETS)) {
      const sheet = book.worksheets.getItem(name), rows = sheet.tables.items[0].getDataRows(), source = before[name];
      assert.deepEqual(normalized(rows), data[key], (roundTrip ? 'Round-trip' : 'Workbook') + ' data differs: ' + name);
      const formulas = sheet.getRange(`A6:${column(source.headers.length)}${rows.length + 5}`).formulasR1C1;
      for (let r = 0; r < source.rows.length; r++) for (let c = 0; c < source.headers.length; c++) if (hasValue(source.formulas[r]?.[c])) assert.equal(formulas[r]?.[c], source.formulas[r][c], 'Existing formula changed');
      for (const [id, note] of notes.get(name)) {
        const index = rows.findIndex(row => String(row[0]) === id); assert(index >= 0);
        if (note.formula) assert.equal(formulas[index].at(-1), note.formula, 'Note formula changed');
        else assert.equal(rows[index].at(-1), note.value, 'Note value changed');
      }
      for (let r = 0; r < source.rows.length; r++) if (typeof source.heights[r] === 'number') assert(sheet.getRange(`A${r + 6}`).format.rowHeight >= source.heights[r], 'Existing row height reduced');
    }
    const ref = book.worksheets.getItem('Références');
    assert.deepEqual(normalized(ref.tables.items[0].getDataRows()), data.sources.map(source => [source.id, source.title, source.kind, source.url, source.scope]));
    assert.deepEqual(ref.getRange(`A${finalLegendStart}:E${finalLegendEnd}`).values, legendValues, 'Reference legend changed after export');
  };
  verifyRows(workbook, false);
  const rowFor = (key, id) => data[key].findIndex(row => row[0] === id) + 6;
  const firstQa = data.qa.findIndex(row => data.currentQa.rowIds.includes(row[0])) + 6;
  const firstTarget = data.qa.findIndex(row => row[0].startsWith('READ26-C-')) + 6;
  const firstNewCase = data.qa.findIndex(row => data.currentQa.rowIds.includes(row[0]) && !priorQa.has(row[0]));
  const readability = rowFor('features', 'PRE-12'), navigation = rowFor('features', 'CTL-08'), offlineFeature = rowFor('features', 'INT-11');
  const firstProduction = rowFor('production', 'READ26-PLAYER-CUES');
  const renders = [
    ['Synthèse', 'A1:H34', 'summary'],
    ['Fonctionnalités', 'A' + readability + ':I' + readability, 'readability-feature'],
    ['Fonctionnalités', 'A' + navigation + ':I' + navigation, 'navigation-feature'],
    ['Fonctionnalités', 'A' + offlineFeature + ':I' + offlineFeature, 'offline-feature'],
    ['Production', 'A' + firstProduction + ':J' + (firstProduction + 3), 'new-production'],
    ['QA', 'A' + firstQa + ':I' + (firstQa + 2), 'current-qa'],
    ['QA', 'A' + firstTarget + ':I' + (firstTarget + targetedQa.length - 1), 'targeted-qa'],
    ['Références', 'A' + (refBefore.length + 4) + ':E' + finalLegendEnd, 'references'],
  ];
  if (firstNewCase >= 0) renders.push(['QA', 'A' + (firstNewCase + 6) + ':I' + Math.min(firstNewCase + 8, data.qa.length + 5), 'new-cases']);
  for (const [name, range, label] of renders) await render(name, range, label);
  const xlsx = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
  await (await SpreadsheetFile.exportXlsx(workbook)).save(xlsx);
  const reopened = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsx));
  verifyRows(reopened, true);
  const nativeTables = names.flatMap(name => reopened.worksheets.getItem(name).tables.items.map(table => ({ sheet: name, name: table.name, style: table.style, filter: table.showFilterButton, rows: table.getDataRows().length })));
  assert.deepEqual(nativeTables.map(({ rows, ...rest }) => rest), nativeBefore, 'Native table metadata changed');
  for (const [cell, value] of expected) assert.equal(reopened.worksheets.getItem('Synthèse').getRange(cell).values[0][0], value, 'Round-trip summary mismatch: ' + cell);
  for (const [file, digest] of Object.entries(historicalEvidenceHashes)) assert.equal(await fileDigest(file), digest, 'Historical proof changed');
  const sourceDigests = { ...evidence.runtimeSourceHashes, ...pass.sourceHashes, ...historicalEvidenceHashes };
  for (const report of [...evidence.nodeReports, ...evidence.browserReports]) sourceDigests[report.file] = report.sourceSha256;
  for (const file of ['scripts/update-combat-workbook-readability.mjs', 'scripts/combat-workbook-current-data.mjs', 'scripts/workbook-publication.mjs', 'scripts/combat-ci-suites.mjs', 'scripts/combat-release-evidence.mjs', 'scripts/package-combat-release.mjs', 'docs/gamedev/manifest.json', passPublished]) sourceDigests[file] = await fileDigest(file);
  for (const source of checked.offline.ART_FILES) { const file = path.relative(root, path.resolve(root, 'combat', source)); sourceDigests[file] = await fileDigest(file); }
  const evidenceBytes = await fs.readFile(ciFile); sourceDigests[ciPublished] = sha256(evidenceBytes);
  const dataBytes = JSON.stringify(data, null, 2) + '\n';
  const verification = { schema: 'encore-workbook-artifact/v1', gameVersion: data.version, createdAt: new Date().toISOString(), sourceCommit: evidence.sourceCommit,
    counts: data.counts, qaSummary: data.qaSummary, qaSummaryScope: data.qaSummaryScope, currentQa: data.currentQa, historicalQaRows: data.historicalQaRows, gamedevPass: data.gamedevPass, gamedevFollowup: data.gamedevFollowup, readabilityPass: data.readabilityPass,
    baseline: { gameVersion: baselineData.version, workbookSHA256: sha256(await fs.readFile(input)), trackerDataSHA256: sha256(await fs.readFile(dataFile)) },
    workbookSHA256: sha256(await fs.readFile(xlsx)), trackerDataSHA256: sha256(dataBytes), nativeTables, sourceDigests, formulaErrors: 0,
    formulas: { count: formulaCount, generalRecalculation: true, summaryValuesChecked: expected.size, desktopExcelOpened: false },
    notesPreservation: { preserved: [...notes.values()].reduce((n, map) => n + map.size, 0), formulas: [...notes.values()].reduce((n, map) => n + [...map.values()].filter(note => note.formula).length, 0), identityPreserved: true, exportRoundTripPassed: true },
    statusMutationRecalculated: true, renderedSheets: args.includes('--skip-previews') ? [] : [...new Set(renders.map(([name]) => name))], modifiedCells: changes.length, changes, addedRows,
    layout: { existingRowsRetained: true, largerUserRowHeightsPreserved: true, referenceLegendPreserved: true, referenceLegendShift: addedSources.length },
    historicalEvidenceUnchanged: historicalEvidenceHashes,
    qaPreservation: { protectedRowsUnchanged: protectedQa.length, reusedCaseIds: freshQa.filter(row => priorQa.has(row[0])).length, addedCaseIds: freshQa.filter(row => !priorQa.has(row[0])).length, existingCaseChangesLimitedToEvidence: true },
    publication: 'Four staged outputs with backups and rollback. The historical evidence files are excluded. Group replacement is not simultaneously atomic.',
    limitations: ['No desktop Excel session or physical device validation.', 'Stable current case IDs carry their latest executed proof; previous complete campaigns remain archived. Targeted objectives overlap the campaign.', 'Specific vision palettes, user studies, physical devices, dedicated art and canonical comparison remain open.'] };
  const outputNames = ['DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx', 'combat-tracker-data.json', 'combat-workbook-verification.json', path.basename(ciPublished)];
  await fs.writeFile(path.join(outputDir, outputNames[1]), dataBytes);
  await fs.writeFile(path.join(outputDir, outputNames[2]), JSON.stringify(verification, null, 2) + '\n');
  await fs.writeFile(path.join(outputDir, outputNames[3]), evidenceBytes);
  if (args.includes('--publish')) await publishWorkbookArtifacts({ outputDirectory: path.join(root, 'docs'), files: outputNames.map(name => ({ name, source: path.join(outputDir, name) })) });
  console.log('ENCORE_READABILITY_WORKBOOK ' + JSON.stringify({ outputDir, published: args.includes('--publish'), counts: data.counts, currentQA: totals,
    historicalQaRows: data.historicalQaRows, targetedChecks: targetedQa.length, nativeTables: nativeTables.length, formulaCount, notesPreserved: verification.notesPreservation.preserved, addedRows, modifiedCells: changes.length }));
}

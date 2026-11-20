/**
 * Recover the dated tracker through public Workbook.create() authoring.
 * Input native-source JSON comes only from the read-only XML inspector. The
 * continuation checkpoint is frozen to the ce7 appearance wave, not later props.
 * Run a private copy with the primary runtime and its node_modules symlink.
 * --prepare-only writes auditable JSON, --build exports a review XLSX,
 * --build --serialize-only and --export-model separate construction/export,
 * --render uses the public serialized model, and --reimport checks the XLSX.
 * No command publishes or replaces the installed tracker.
 */
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { once } from 'node:events';
import { finished } from 'node:stream/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
const root = path.resolve(flag('--repo-root', process.cwd()));
const outputDir = path.resolve(flag('--output-dir', path.join(root, '..', 'outputs/encore-workbook-recovery-20261120')));
const sourceDir = path.join(outputDir, 'native-source');
const targetDir = path.join(outputDir, 'native-target');
const input = path.join(root, 'docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
const inputData = path.join(root, 'docs/combat-tracker-data.json');
const xlsxPath = path.join(outputDir, 'DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx');
const checkpointPath = path.join(root, 'docs/art-generation/cast-continuation-20261120/workbook-preparation-checkpoint.json.gz');
const proofFile = 'docs/art-generation/workbook-recovery-20261120/workbook-review.json';
const expectedSource = 'fdba67e67cebfd18a5988017c86ee7abe6cbb5fa625d0d4b5e850c125deac89d';
const expectedData = 'cdc0eb3a39b03ec8bc40458f3790a7068c9af672f86dc09ac4f82e936a5ded32';
const expectedCheckpoint = 'ee313dcbf58045bf0a3be897d8901c8b483b5e32ef5f2fa76c5747e2654c778d';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value, pretty = false) => fs.writeFile(file, JSON.stringify(value, null, pretty ? 2 : 0) + '\n');
const phase = label => { globalThis.gc?.(); console.log('NATIVE_RECOVERY ' + JSON.stringify({ label, ...process.memoryUsage() })); };
const col = n => { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; };
const address = cell => `${col(cell[1])}${cell[0]}`;
const coordinate = ref => { const m = /^([A-Z]+)(\d+)$/.exec(ref.replaceAll('$', '')); assert(m, `Unsupported cell ${ref}`); return [Number(m[2]), [...m[1]].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0)]; };
const normal = rows => rows.map(row => row.map(value => value ?? ''));
assert.notEqual(xlsxPath, input, 'The recovery must export to a review copy');
assert.notEqual(path.join(outputDir, 'combat-tracker-data.json'), inputData, 'The recovery must preserve installed JSON');
await fs.mkdir(outputDir, { recursive: true });
assert.equal(sha(await fs.readFile(input)), expectedSource, 'Baseline workbook changed since checkpoint');
assert.equal(sha(await fs.readFile(inputData)), expectedData, 'Baseline tracker changed since checkpoint');

if (args.includes('--prepare-only')) { await prepare(); process.exit(0); }
const { Workbook, SpreadsheetFile, FileBlob } = await import('@oai/artifact-tool');
if (args.includes('--export-model')) {
  let model = await json(path.join(outputDir, 'recreated-model.json'));
  const prepared = await Workbook.load(model); model = null;
  prepared.recalculate();
  await verifyModel(prepared);
  phase('loaded-model-for-export');
  await (await SpreadsheetFile.exportXlsx(prepared)).save(xlsxPath);
  await writeJson(path.join(outputDir, 'export-result.json'), { status: 'exported-awaiting-comparison', sourceImportUsed: false, method: 'Workbook.load(public-model) then SpreadsheetFile.exportXlsx', sha256: sha(await fs.readFile(xlsxPath)) }, true);
  phase('exported-native-recreation');
  process.exit(0);
}
if (args.includes('--reimport')) {
  phase('reimporting-saved-xlsx');
  const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(xlsxPath));
  await verifyModel(wb);
  await writeJson(path.join(outputDir, 'reimport-result.json'), {
    status: 'passed-formula-and-row-count-checks', method: 'SpreadsheetFile.importXlsx',
    sha256: sha(await fs.readFile(xlsxPath)), checked: { summaryFormulasAndValues: 42, tableRowCounts: ['Production', 'QA', 'Références'] },
    exhaustivePreservationChecked: false, requiredSeparately: ['native XML comparison against the constrained target', 'visual review'],
  }, true);
  phase('reimport-verified');
  process.exit(0);
}
if (args.includes('--render')) {
  let model = await json(path.join(outputDir, 'recreated-model.json'));
  const wb = await Workbook.load(model); model = null;
  await verifyModel(wb);
  const plan = await json(path.join(outputDir, 'recovery-plan.json'));
  const chosen = flag('--view', null);
  for (const [sheetName, range, label] of plan.scopes) {
    if (chosen && chosen !== label) continue;
    const blob = await wb.render({ sheetName, range, scale: 1, format: 'png' });
    await fs.writeFile(path.join(outputDir, label + '.png'), new Uint8Array(await blob.arrayBuffer()));
    phase('rendered-' + label);
  }
  process.exit(0);
}
assert(args.includes('--build'), 'Use --prepare-only, --build, --render, or --reimport');
const manifest = await json(path.join(targetDir, 'manifest.json'));
const wb = Workbook.create();
for (const entry of manifest.sheets) wb.worksheets.add(entry.name);
phase('created-empty-workbook');
for (const entry of manifest.sheets) {
  let data = await json(path.join(targetDir, entry.file));
  const sheet = wb.worksheets.getItem(entry.name);
  const maxRow = Math.max(...data.cells.map(c => c[0])), maxCol = Math.max(...data.cells.map(c => c[1]));
  const matrix = Array.from({ length: maxRow }, () => Array(maxCol).fill(null));
  for (const c of data.cells) if (!c[4]) matrix[c[0] - 1][c[1] - 1] = literal(c[3]);
  // Bounded row blocks avoid retaining a second complete workbook-sized matrix.
  for (let start = 0; start < maxRow; start += 160) {
    const block = matrix.slice(start, Math.min(maxRow, start + 160));
    sheet.getRangeByIndexes(start, 0, block.length, maxCol).values = block;
  }
  for (const c of data.cells) if (c[4]) sheet.getRange(address(c)).formulas = [[c[4]]];
  for (const table of data.tables) {
    assert(table.rowStripes, 'Only default row-banded tables occur in the source');
    const native = sheet.tables.add(table.range, true, table.name);
    native.style = table.style;
    native.showFilterButton = table.filter;
    native.showBandedColumns = table.columnStripes;
    native.showTotals = false;
  }
  sheet.showGridLines = data.gridLines;
  if (data.tabColor) sheet.tabColor = data.tabColor;
  if (data.freeze.rows) sheet.freezePanes.freezeRows(data.freeze.rows);
  if (data.freeze.columns) sheet.freezePanes.freezeColumns(data.freeze.columns);
  for (const [number, width] of Object.entries(data.widths)) sheet.getRange(`${col(Number(number))}1`).format.columnWidth = width;
  for (const [number, height] of Object.entries(data.heights)) sheet.getRange(`A${number}`).format.rowHeight = height;
  const runs = styleRuns(data.cells);
  for (const run of runs) {
    const style = manifest.styles[run.style];
    const format = apiFormat(style);
    if (Object.keys(format).length) sheet.getRangeByIndexes(run.row - 1, run.column - 1, run.rows, run.columns).format = format;
  }
  // Per-cell borders preserve internal edges; range edges alone would lose them.
  for (const c of data.cells) {
    const border = manifest.styles[c[5]].borders;
    if (Object.keys(border).length) sheet.getRange(address(c)).format.borders = border;
  }
  for (const rule of data.validations) sheet.getRange(rule.range).dataValidation = { rule: { type: 'list', values: rule.values } };
  for (const rule of data.rules) sheet.getRange(rule.range).conditionalFormats.add('containsText', { text: rule.text, format: rule.format });
  data = null;
  phase('authored-' + entry.name);
}
wb.recalculate();
await verifyModel(wb);
const summary = wb.worksheets.getItem('Synthèse');
const production = wb.worksheets.getItem('Production');
const oldStatus = production.getRange('E3106').values[0][0];
const oldImplemented = summary.getRange('B16').values[0][0];
const oldPartial = summary.getRange('C16').values[0][0];
assert.equal(oldStatus, 'Implémenté');
production.getRange('E3106').values = [['Partiel']]; wb.recalculate();
assert.equal(summary.getRange('B16').values[0][0], oldImplemented - 1);
assert.equal(summary.getRange('C16').values[0][0], oldPartial + 1);
production.getRange('E3106').values = [[oldStatus]]; wb.recalculate();
await verifyModel(wb);
phase('recalculated-and-restored');
if (args.includes('--serialize-only')) {
  await saveModel(wb.toProto(), path.join(outputDir, 'recreated-model.json'));
  await writeJson(path.join(outputDir, 'authoring-result.json'), { status: 'prepared-model-awaiting-export', method: 'Workbook.create then toProto', sourceSHA256: expectedSource, checkpointSHA256: expectedCheckpoint, formulaCount: 42, independentFormulaValuesPassed: true, representativeStatusRecalculationPassed: true, sourceImportUsed: false, savedXlsxReimportPassed: false }, true);
  phase('serialized-for-separate-export');
  process.exit(0);
}
await (await SpreadsheetFile.exportXlsx(wb)).save(xlsxPath);
phase('exported-native-recreation');
await saveModel(wb.toProto(), path.join(outputDir, 'recreated-model.json'));
await writeJson(path.join(outputDir, 'authoring-result.json'), {
  status: 'exported-awaiting-native-comparison-and-visual-review', method: 'Workbook.create',
  sourceSHA256: expectedSource, checkpointSHA256: expectedCheckpoint,
  outputSHA256: sha(await fs.readFile(xlsxPath)), formulaCount: 42,
  independentFormulaValuesPassed: true, representativeStatusRecalculationPassed: true,
  sourceImportUsed: false, savedXlsxReimportPassed: false,
}, true);
phase('serialized-for-separate-render');

function literal(value) { return typeof value === 'string' && value.startsWith('=') ? `'${value}` : value; }

function apiFormat(style) {
  const format = {};
  const defaultFont = { name: 'Carlito', size: 11, bold: false, italic: false, color: null };
  if (JSON.stringify(style.font) !== JSON.stringify(defaultFont)) {
    format.font = Object.fromEntries(Object.entries(style.font).filter(([, value]) => value !== null));
  }
  if (style.fill) format.fill = style.fill;
  if (style.numberFormat !== 'General') format.numberFormat = style.numberFormat;
  if (style.horizontalAlignment !== 'general') format.horizontalAlignment = style.horizontalAlignment;
  if (style.verticalAlignment !== 'bottom') format.verticalAlignment = style.verticalAlignment;
  if (style.wrapText) format.wrapText = true;
  return format;
}

function styleRuns(cells) {
  const rows = new Map();
  for (const c of cells) { if (!rows.has(c[0])) rows.set(c[0], []); rows.get(c[0]).push(c); }
  const result = [], open = new Map();
  for (const [row, rowCells] of rows) {
    const ranges = [];
    for (const c of rowCells) {
      const previous = ranges.at(-1);
      if (previous && previous.style === c[5] && previous.column + previous.columns === c[1]) previous.columns++;
      else ranges.push({ row, column: c[1], rows: 1, columns: 1, style: c[5] });
    }
    const active = new Set();
    for (const range of ranges) {
      const key = `${range.column}:${range.columns}:${range.style}`;
      active.add(key);
      const previous = open.get(key);
      if (previous && previous.row + previous.rows === row) previous.rows++;
      else { result.push(range); open.set(key, range); }
    }
    for (const key of open.keys()) if (!active.has(key)) open.delete(key);
  }
  return result;
}

async function verifyModel(workbook) {
  const plan = await json(path.join(outputDir, 'recovery-plan.json'));
  const summary = workbook.worksheets.getItem('Synthèse');
  for (const item of plan.formulas) {
    assert.equal(summary.getRange(item.cell).formulas[0][0], item.formula, `Formula ${item.cell}`);
    assert.equal(summary.getRange(item.cell).values[0][0], item.value, `Independent result ${item.cell}`);
  }
  for (const [name, expected] of [['Production', 3115], ['QA', 2265], ['Références', 135]]) {
    const sheet = workbook.worksheets.getItem(name);
    assert.equal(sheet.tables.items.length, 1);
    assert.equal(sheet.tables.items[0].getDataRows().length, expected);
  }
}

async function prepare() {
  const checkpointBytes = await fs.readFile(checkpointPath);
  assert.equal(sha(checkpointBytes), expectedCheckpoint);
  const checkpoint = JSON.parse(gunzipSync(checkpointBytes));
  const manifest = await json(path.join(sourceDir, 'manifest.json'));
  assert.equal(manifest.sha256, expectedSource);
  const data = checkpoint.data;
  assert.equal(data.production.length, 3115); assert.equal(data.qa.length, 2265); assert.equal(data.sources.length, 135);
  const qa = data.qa.find(row => row[0] === 'CAST27-workbook');
  assert(qa);
  qa[5] = 'scripts/recover-combat-workbook-native.mjs';
  qa[6] = '15 lignes Production (6 Implémenté, 9 Partiel), cinq constats QA et 15 références ajoutés. Recréation par le moteur tableur principal depuis une lecture XML ; ordre, types, notes, formules, styles et tables comparés au fichier source. Recalcul contrôlé.';
  qa[7] = `Preuve : ${proofFile}. Le statut de réimport du XLSX et la revue visuelle sont indiqués séparément dans cette preuve. Contrôle du classeur, distinct des tests du jeu et de la fidélité canonique.`;
  data.currentQa.workbookEvidence = proofFile;
  data.costumeAdditionReview.workbookEvidence = proofFile;
  const sheets = new Map();
  for (const entry of manifest.sheets) sheets.set(entry.name, await json(path.join(sourceDir, entry.file)));
  const original = structuredClone([...sheets]);
  const tableKeys = { 'Fonctionnalités': 'features', 'Combattants': 'roster', 'Techniques': 'moves', 'Arènes': 'stages', 'Atlas': 'atlas', 'Production': 'production', 'Scénarios': 'scenarios', 'QA': 'qa' };
  for (const [name, key] of Object.entries(tableKeys)) {
    const sheet = sheets.get(name), table = sheet.tables[0], width = table.columns.length;
    const oldRows = checkpoint.before[name].tables[0].rows;
    const rowValues = Array.from({ length: oldRows.length }, () => Array(width).fill(null));
    for (const c of sheet.cells) if (c[0] >= 6 && c[0] < oldRows.length + 6) rowValues[c[0] - 6][c[1] - 1] = c[3];
    assert.deepEqual(normal(rowValues), oldRows, `Checkpoint mismatch ${name}`);
    assert.deepEqual(data[key].slice(0, oldRows.length), oldRows, `Prepared historical rows changed ${name}`);
  }
  const style = fill => ({ font: { name: 'Arial', size: 10, bold: false, italic: false, color: '#23243B' }, fill, borders: {}, numberFormat: 'General', horizontalAlignment: 'general', verticalAlignment: 'center', wrapText: true });
  const appendStyle = fill => { manifest.styles.push(style(fill)); return manifest.styles.length - 1; };
  const styleIds = { light: appendStyle('#F4F0F8'), white: appendStyle('#FFFFFF'), note: appendStyle('#FFF1C9') };
  function appendRows(name, rows, oldCount, noteColumn) {
    const sheet = sheets.get(name), width = sheet.tables[0].columns.length;
    rows.forEach((row, index) => {
      const number = oldCount + index + 6;
      row.forEach((value, c) => sheet.cells.push([number, c + 1, typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string', value, null,
        c + 1 === noteColumn ? styleIds.note : (oldCount + index) % 2 === 0 ? styleIds.light : styleIds.white]));
      const lines = Math.max(1, ...row.map((value, c) => String(value ?? '').split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(12, (sheet.widths[c + 1] || 22) * 1.08))), 0)));
      sheet.heights[number] = Math.max(name === 'Références' ? 70 : 42, 13 * lines + 10);
    });
    sheet.tables[0].range = `A5:${col(width)}${oldCount + rows.length + 5}`;
    if (name !== 'Références') {
      const statusColumn = name === 'QA' ? 'D' : 'E';
      const range = `${statusColumn}${oldCount + 6}:${statusColumn}${oldCount + rows.length + 5}`;
      sheet.validations.push({ range, values: name === 'QA' ? ['Réussi', 'Échec', 'Non exécuté', 'À vérifier', 'Partiel'] : ['Implémenté', 'Partiel', 'Prévu', 'À vérifier', 'Hors périmètre'] });
      for (const [text, fill, color] of [['Implémenté', '#E4F1E9', '#23513D'], ['Partiel', '#FCEED8', '#79501D'], ['Prévu', '#EAE7F1', '#56496D'], ['À vérifier', '#FFF1C9', '#805B00'], ['Réussi', '#E4F1E9', '#23513D'], ['Non exécuté', '#EAE7F1', '#56496D']]) sheet.rules.push({ range, text, format: { font: { color }, fill }, priority: sheet.rules.length + 1 });
    }
  }
  appendRows('Production', data.production.slice(3100), 3100, 10);
  appendRows('QA', data.qa.slice(2260), 2260, 9);
  const refs = sheets.get('Références');
  for (const c of refs.cells) if (c[0] >= 126) c[0] += 15;
  refs.heights = Object.fromEntries(Object.entries(refs.heights).map(([row, h]) => [Number(row) >= 126 ? Number(row) + 15 : row, h]));
  appendRows('Références', data.sources.slice(120).map(s => [s.id, s.title, s.kind, s.url, s.scope]), 120, null);
  refs.cells.find(c => c[0] === checkpoint.offlineSourceIndex + 6 && c[1] === 5)[3] = data.sources[checkpoint.offlineSourceIndex].scope;
  const summary = sheets.get('Synthèse');
  const summaryChanges = new Map(checkpoint.verificationDraft.summaryChanges.map(c => [c.cell, c]));
  for (const [ref, change] of summaryChanges) {
    const [r, c] = coordinate(ref), cell = summary.cells.find(x => x[0] === r && x[1] === c);
    if (change.formula) cell[4] = change.formula;
    else { cell[2] = typeof change.value === 'number' ? 'number' : 'string'; cell[3] = change.value; cell[4] = null; }
  }
  const lookup = new Map([...sheets].map(([name, s]) => [name, new Map(s.cells.map(c => [address(c), c]))]));
  for (const c of summary.cells) if (c[4]) { c[3] = evaluate(c[4].slice(1), lookup, 'Synthèse'); c[2] = typeof c[3] === 'number' ? 'number' : 'string'; }
  // Independently constrain every source cell: only the checkpoint's explicit
  // summary cells, offline scope and the reference footer move are authorized.
  let preservedCells = 0;
  for (const [name, before] of original) {
    const afterSheet = sheets.get(name);
    for (const property of ['widths', 'gridLines', 'freeze', 'tabColor', 'margins']) assert.deepEqual(afterSheet[property], before[property], `Changed ${name}/${property}`);
    for (const [row, height] of Object.entries(before.heights)) {
      const destination = name === 'Références' && Number(row) >= 126 ? Number(row) + 15 : row;
      assert.equal(afterSheet.heights[destination], height, `Changed old height ${name}/${row}`);
    }
    assert.deepEqual(afterSheet.validations.slice(0, before.validations.length), before.validations, `Changed old validation ${name}`);
    assert.deepEqual(afterSheet.rules.slice(0, before.rules.length), before.rules, `Changed old conditional rule ${name}`);
    assert.equal(afterSheet.tables.length, before.tables.length, `Changed table count ${name}`);
    for (let index = 0; index < before.tables.length; index++) {
      const { range: priorRange, ...prior } = before.tables[index];
      const { range: nextRange, ...next } = afterSheet.tables[index];
      assert.deepEqual(next, prior, `Changed native table properties ${name}`);
      if (!['Production', 'QA', 'Références'].includes(name)) assert.equal(nextRange, priorRange);
    }
    const after = lookup.get(name);
    for (const old of before.cells) {
      const shifted = name === 'Références' && old[0] >= 126;
      const ref = `${col(old[1])}${old[0] + (shifted ? 15 : 0)}`;
      const next = after.get(ref);
      assert(next, `Lost old cell ${name}!${ref}`);
      const allowed = (name === 'Synthèse' && summaryChanges.has(ref)) || (name === 'Références' && old[0] === checkpoint.offlineSourceIndex + 6 && old[1] === 5);
      assert.deepEqual(manifest.styles[next[5]], manifest.styles[old[5]], `Changed old style ${name}!${ref}`);
      if (!allowed) assert.deepEqual(next.slice(2), old.slice(2), `Changed old cell ${name}!${ref}`);
      preservedCells++;
    }
  }
  await fs.mkdir(targetDir, { recursive: true });
  for (const entry of manifest.sheets) {
    const sheet = sheets.get(entry.name); sheet.cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    entry.cells = sheet.cells.length;
    await writeJson(path.join(targetDir, entry.file), sheet);
  }
  manifest.sha256 = null;
  await writeJson(path.join(targetDir, 'manifest.json'), manifest, true);
  const formulas = summary.cells.filter(c => c[4]).map(c => ({ cell: address(c), formula: c[4], value: c[3] }));
  assert.equal(formulas.length, 42);
  assert.equal(lookup.get('Synthèse').get('B11')[3], 443);
  assert.equal(lookup.get('Synthèse').get('H27')[3], '681 fiches, hors tenues crossover');
  const scopes = checkpoint.scopes.flatMap(item => item[2] === 'summary' ? [['Synthèse', 'A1:H18', 'summary-top'], ['Synthèse', 'A19:H35', 'summary-bottom']] : [item]);
  await writeJson(path.join(outputDir, 'combat-tracker-data.json'), data, true);
  await writeJson(path.join(outputDir, 'recovery-plan.json'), { schema: 'encore-workbook-recovery-plan/v1', sourceSHA256: expectedSource, inputDataSHA256: expectedData, checkpointSHA256: expectedCheckpoint, scope: 'appearance-wave-ce7ceeb7', sourceCellsConstrained: preservedCells, checkpointSummaryChanges: [...summaryChanges.values()], formulas, scopes, counts: checkpoint.verificationDraft.counts, nativeSourceImportUsed: false, publishAllowed: false }, true);
  phase('prepared-native-plan');
}

function split(expression, separator) {
  const out = []; let start = 0, depth = 0, quote = null;
  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];
    if (quote) { if (ch === quote) { if (expression[i + 1] === quote) i++; else quote = null; } continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === separator && depth === 0) { out.push(expression.slice(start, i)); start = i + 1; }
  }
  out.push(expression.slice(start)); return out;
}

function evaluate(expression, lookup, name) {
  const concat = split(expression, '&'); if (concat.length > 1) return concat.map(p => evaluate(p, lookup, name)).join('');
  const add = split(expression, '+'); if (add.length > 1) return add.reduce((sum, p) => sum + Number(evaluate(p, lookup, name)), 0);
  if (expression.startsWith('"')) { assert(expression.endsWith('"')); return expression.slice(1, -1).replaceAll('""', '"'); }
  if (/^[0-9]+$/.test(expression)) return Number(expression);
  const func = /^(COUNTA|COUNTIFS)\((.*)\)$/.exec(expression);
  if (func) {
    const parts = split(func[2], ',');
    const ranges = [];
    for (let i = 0; i < parts.length; i += func[1] === 'COUNTA' ? 1 : 2) {
      const ref = /^'([^']+)'!([A-Z]+\$?\d+):([A-Z]+\$?\d+)$/.exec(parts[i]);
      assert(ref, `Unsupported independent range ${parts[i]}`);
      const [first, firstCol] = coordinate(ref[2]), [last, lastCol] = coordinate(ref[3]); assert.equal(firstCol, lastCol);
      const values = Array.from({ length: last - first + 1 }, (_, n) => lookup.get(ref[1]).get(`${col(firstCol)}${n + first}`));
      ranges.push({ values, criterion: func[1] === 'COUNTIFS' ? evaluate(parts[i + 1], lookup, name) : null });
    }
    if (func[1] === 'COUNTA') return ranges.reduce((sum, r) => sum + r.values.filter(c => c && c[2] !== 'blank').length, 0);
    assert(ranges.every(r => r.values.length === ranges[0].values.length));
    return ranges[0].values.reduce((sum, _, i) => sum + Number(ranges.every(r => r.values[i]?.[3] === r.criterion)), 0);
  }
  const ref = expression.replaceAll('$', ''), cell = lookup.get(name).get(ref); assert(cell, `Unsupported independent expression ${expression}`);
  return cell[4] ? evaluate(cell[4].slice(1), lookup, name) : cell[3];
}

async function saveModel(model, filename) {
  const stream = createWriteStream(filename, { encoding: 'utf8' });
  const write = async value => { if (!stream.write(value)) await once(stream, 'drain'); };
  try {
    await write('{'); let separator = '';
    for (const [key, value] of Object.entries(model)) {
      if (value === undefined) continue;
      await write(separator + JSON.stringify(key) + ':'); separator = ',';
      if (Array.isArray(value)) { await write('['); for (let i = 0; i < value.length; i++) await write((i ? ',' : '') + JSON.stringify(value[i] ?? null)); await write(']'); }
      else await write(JSON.stringify(value));
    }
    await write('}'); stream.end(); await finished(stream);
  } catch (error) { stream.destroy(); throw error; }
}

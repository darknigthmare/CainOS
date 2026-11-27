/**
 * Compare a finished build with its current source checkout without modifying it.
 * Usage: node scripts/verify-combat-built-assets.mjs --output DIR
 *        --type cainos|standalone [--report FILE]
 * Run after building, while source artwork and combat files are unchanged.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { ART_FILES, ART_VERSION, OFFLINE_VERSION } from '../combat/offline-manifest.mjs';
import { GAME } from '../combat/data.mjs';

const sourceRoot = await fs.realpath(fileURLToPath(new URL('..', import.meta.url)));
const args = process.argv.slice(2), options = {};
for (let i = 0; i < args.length; i++) {
  assert.ok(['--output', '--type', '--report'].includes(args[i]), 'Unknown option: ' + args[i]);
  const name = args[i].slice(2), value = args[++i];
  assert.ok(value && !value.startsWith('--'), 'Missing value for --' + name);
  assert.ok(!Object.hasOwn(options, name), 'Repeated option: --' + name); options[name] = value;
}
assert.ok(options.output && options.type, 'Required: --output DIR --type cainos|standalone [--report FILE]');
const kind = options.type.toLowerCase();
assert.ok(['cainos', 'standalone'].includes(kind), '--type must be cainos or standalone');
const outputRoot = await fs.realpath(path.resolve(options.output));
assert.notEqual(outputRoot, sourceRoot, 'A build must be distinct from its source checkout');
assert.ok((await fs.stat(outputRoot)).isDirectory(), '--output must name an existing build directory');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
async function hashFile(file) {
  const hash = createHash('sha256'); let bytes = 0;
  for await (const chunk of createReadStream(file, { highWaterMark: 256 * 1024 })) {
    hash.update(chunk); bytes += chunk.length;
  }
  return { sha256: hash.digest('hex'), bytes };
}
async function filesUnder(root, relative) {
  const result = [];
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(root, name));
    else if (entry.isFile()) result.push(name);
    else throw new Error('Unsupported nonregular build entry: ' + name);
  }
  return result.sort();
}
const report = {
  schema: 'encore-built-assets-verification/v1', createdAt: new Date().toISOString(),
  type: kind, sourceRoot, outputRoot, offlineVersion: OFFLINE_VERSION, artVersion: ART_VERSION,
  method: 'Streaming SHA-256 and byte-length comparison of each published illustration, every combat file and the entry files.',
  limitations: ['Byte identity does not establish browser behavior or canonical artwork fidelity.'],
  sourceHashes: {}, verified: [], failures: [], extraCombatFiles: [],
};
for (const relative of ['combat/offline-manifest.mjs', 'scripts/build-combat.mjs',
  'scripts/build-static.js', 'scripts/build-output.cjs', 'scripts/verify-combat-built-assets.mjs']) {
  report.sourceHashes[relative] = (await hashFile(path.join(sourceRoot, relative))).sha256;
}
const art = [...new Set(ART_FILES.map(name => {
  const relative = path.posix.normalize(path.posix.join('combat', name));
  assert.ok(!path.posix.isAbsolute(relative) && relative !== '..' && !relative.startsWith('../'),
    'Invalid published asset path: ' + name);
  return relative;
}))].sort();
assert.equal(art.length, ART_FILES.length, 'Published art paths must be unique');
assert.ok(art.length > 0, 'Published art catalog must not be empty');
const combat = await filesUnder(sourceRoot, 'combat');
let builtCombat = [];
try { builtCombat = await filesUnder(outputRoot, 'combat'); }
catch (error) { report.failures.push({ file: 'combat/', error: error.message }); }
const expectedCombat = new Set(combat);
report.extraCombatFiles = builtCombat.filter(name => !expectedCombat.has(name));
for (const file of report.extraCombatFiles) report.failures.push({ file, error: 'Unexpected extra combat file in build' });
const rootFiles = kind === 'cainos'
  ? ['index.html', 'index.css', 'app.js', 'episodes.js', 'cloud-account.js', 'favicon.png'] : [];
const expected = new Map([
  ...art.map(file => [file, 'art']),
  ...combat.map(file => [file, 'combat']),
  ...rootFiles.map(file => [file, 'entry']),
]);
for (const [file, category] of expected) {
  try {
    const [source, built] = await Promise.all([
      hashFile(path.join(sourceRoot, file)), hashFile(path.join(outputRoot, file)),
    ]);
    if (source.sha256 !== built.sha256 || source.bytes !== built.bytes) {
      report.failures.push({ file, category, source, built, error: 'Byte mismatch' });
    } else report.verified.push({ file, category, ...source });
  } catch (error) { report.failures.push({ file, category, error: error.message }); }
}

/** Decode only quoted JS strings and the one documented version insertion.
 * The build script is read as text, never executed by the verifier.
 */
function generatedText(code, name) {
  const prefix = "fs.writeFileSync(path.join(output, '" + name + "'), ";
  const line = code.split('\n').find(line => line.startsWith(prefix));
  assert.ok(line?.endsWith(');'), 'Standalone generated entry declaration missing: ' + name);
  const expression = line.slice(prefix.length, -2);
  let i = 0, result = '', expectValue = true;
  const escapes = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0', "'": "'", '"': '"', '\\': '\\' };
  while (i < expression.length) {
    if (/\s/.test(expression[i])) { i++; continue; }
    if (!expectValue) { assert.equal(expression[i++], '+', 'Unsupported generated entry expression'); expectValue = true; continue; }
    if (expression.startsWith('GAME.version', i)) { result += GAME.version; i += 'GAME.version'.length; }
    else {
      assert.equal(expression[i++], "'", 'Only quoted strings and GAME.version are allowed in generated entries');
      let closed = false;
      while (i < expression.length) {
        const char = expression[i++];
        if (char === "'") { closed = true; break; }
        if (char !== '\\') { result += char; continue; }
        const escaped = expression[i++];
        assert.ok(Object.hasOwn(escapes, escaped), 'Unsupported escape in generated entry');
        result += escapes[escaped];
      }
      assert.ok(closed, 'Unclosed generated entry literal');
    }
    expectValue = false;
  }
  assert.equal(expectValue, false, 'Incomplete generated entry expression');
  return result;
}
if (kind === 'standalone') {
  const script = await fs.readFile(path.join(sourceRoot, 'scripts/build-combat.mjs'), 'utf8');
  for (const file of ['index.html', 'README.txt']) {
    try {
      const bytes = Buffer.from(generatedText(script, file)), source = { sha256: digest(bytes), bytes: bytes.length };
      const built = await hashFile(path.join(outputRoot, file));
      if (source.sha256 !== built.sha256 || source.bytes !== built.bytes) {
        report.failures.push({ file, category: 'entry', source, built, error: 'Generated entry byte mismatch' });
      } else report.verified.push({ file, category: 'entry', generatedFrom: 'scripts/build-combat.mjs', ...source });
    } catch (error) { report.failures.push({ file, category: 'entry', error: error.message }); }
  }
}
report.counts = {
  expectedIllustrations: art.length, verifiedIllustrations: report.verified.filter(row => row.category === 'art').length,
  expectedCombatFiles: combat.length, verifiedCombatFiles: report.verified.filter(row => row.category === 'combat').length,
  expectedEntryFiles: kind === 'cainos' ? rootFiles.length : 2,
  verifiedEntryFiles: report.verified.filter(row => row.category === 'entry').length,
  expectedFiles: expected.size + (kind === 'standalone' ? 2 : 0), verifiedFiles: report.verified.length,
  verifiedBytes: report.verified.reduce((sum, row) => sum + row.bytes, 0), failures: report.failures.length,
};
report.verifiedDigest = digest(report.verified.map(row => row.file + '\0' + row.bytes + '\0' + row.sha256 + '\n').join(''));
report.ok = report.failures.length === 0 && report.counts.verifiedFiles === report.counts.expectedFiles;
if (options.report) {
  const destination = path.resolve(options.report);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ type: kind, output: outputRoot, report: options.report || null,
  ...report.counts, verifiedDigest: report.verifiedDigest, ok: report.ok }));
if (!report.ok) {
  console.error(JSON.stringify(report.failures.slice(0, 20), null, 2));
  process.exitCode = 1;
}



import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SUNSET_RECOVERY_DEFINITIONS, SUNSET_RECOVERY_SLOTS } from '../combat/crossover-sunset-recovery-20261124.mjs';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2), proofIndex = args.indexOf('--verified-inventory');
assert(proofIndex >= 0 && args[proofIndex + 1], 'Provide the independently reviewed native inventory with --verified-inventory.');
const inventory = JSON.parse(await fs.readFile(path.resolve(args[proofIndex + 1]), 'utf8'));
assert.equal(inventory.complete, true);
const files = inventory.files || inventory.records || inventory.assets;
assert(Array.isArray(files));
const hashes = new Set(), checked = [];
for (const def of SUNSET_RECOVERY_DEFINITIONS) for (const slot of SUNSET_RECOVERY_SLOTS) {
  const file = 'assets/encore/crossovers/sunsetparadise/ribbit/' + def.style + '/' + slot + '.png';
  const record = files.find(item => item.file === file || item.target === file || item.path === file);
  assert(record && record.nativeBytesVerified === true, 'Native-byte review missing: ' + file);
  const bytes = await fs.readFile(path.join(root, file));
  assert.deepEqual([...bytes.subarray(0, 8)], [137,80,78,71,13,10,26,10]);
  assert.equal(bytes[25], 6, 'Native RGBA is required: ' + file);
  const hash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash, record.sha256, 'Reviewed PNG changed: ' + file);
  assert(!hashes.has(hash), 'Repeated drawing reused for two slots: ' + file);
  hashes.add(hash); checked.push({ file, sha256: hash, bytes: bytes.length });
}
const definitionPath = path.join(root, 'combat/crossover-npc-additions.mjs');
const orderPath = path.join(root, 'combat/costume-order.mjs');
const [definitionSource, orderSource] = await Promise.all([fs.readFile(definitionPath, 'utf8'), fs.readFile(orderPath, 'utf8')]);
const ids = SUNSET_RECOVERY_DEFINITIONS.map(entry => entry.id);
const hasDefinitions = ids.every(id => definitionSource.includes(id));
const hasOrder = ids.every(id => orderSource.includes(id));
assert.equal(hasDefinitions, hasOrder, 'Partial prior activation must be reviewed before retry.');
if (!hasDefinitions) {
  assert(ids.every(id => !definitionSource.includes(id) && !orderSource.includes(id)), 'A partial set is already installed.');
  const closeDefinitions = '\n].map(entry => Object.freeze(entry)));';
  assert.equal(definitionSource.split(closeDefinitions).length, 2);
  const nextDefinitions = definitionSource.replace(closeDefinitions, ',\n' + SUNSET_RECOVERY_DEFINITIONS.map(entry => '  ' + JSON.stringify(entry)).join(',\n') + closeDefinitions);
  const lastOrder = '  "cafezooble"\n]);';
  assert.equal(orderSource.split(lastOrder).length, 2);
  const nextOrder = orderSource.replace(lastOrder, '  "cafezooble",\n' + ids.map(id => '  ' + JSON.stringify(id)).join(',\n') + '\n]);');
  await fs.writeFile(definitionPath, nextDefinitions);
  try { await fs.writeFile(orderPath, nextOrder); }
  catch (error) { await fs.writeFile(definitionPath, definitionSource); throw error; }
}
const reportPath = path.join(root, 'docs/art-generation/sunsetparadise-ribbit-20261124/content-integration.json');
await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, JSON.stringify({ schema: 'encore-sunset-recovery-integration/v1', status: 'native-families-integrated', ids, slots: SUNSET_RECOVERY_SLOTS, files: checked, preservedCostumePrefix: 480, mechanicsChanged: false, canonicalCostumeClaim: false, gitPublished: false }, null, 2) + '\n');
console.log(JSON.stringify({ status: 'integrated', families: 3, nativePngs: checked.length, reportPath }));


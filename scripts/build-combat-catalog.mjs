import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Rebuild the atlas inventory from the existing CainOS cast without executing the OS.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await fs.readFile(path.join(root, 'app.js'), 'utf8');
const atlasSource = app.slice(app.indexOf('  loadCircusAvatarSheets() {'), app.indexOf('  getCircusAvatarAnimationSpec('));
function readLiteral(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing source marker: ${startMarker}`);
  const body = start + startMarker.length;
  const end = source.indexOf(endMarker, body);
  if (end < 0) throw new Error(`Missing source end: ${endMarker}`);
  return vm.runInNewContext(`(${source.slice(body, end)})`, Object.create(null), { timeout: 500 });
}
const sources = readLiteral(atlasSource, 'const sources = ', ';\n    this.circusAvatarSheets');
const tables = readLiteral(atlasSource, 'const tables = ', ';\n    for (const table');
const castSource = app.slice(app.indexOf('  getWackyCastData() {'), app.indexOf('  getEpisodeCastKeys('));
const cast = readLiteral(castSource, 'const castData = ', ';\n\n    return castData');
const archive = tables.flatMap(table => Object.entries(table.map).map(([id, [col, row]]) => ({
  id,
  name: cast[id]?.name || id,
  sourceAge: cast[id]?.age || '',
  sprite: { src: `../${sources[table.sheet]}`, sheet: table.sheet, cols: table.cols, rows: table.rows, col, row },
  source: 'https://github.com/darknigthmare/CainOS/blob/4926834a2f063028903d6431e77f0bece859e671/app.js',
  provenance: 'Archive CainOS. Le libellé du projet ne constitue pas une validation canonique.',
  status: 'Visuel CainOS existant',
})));
if (new Set(archive.map(item => item.id)).size !== archive.length) throw new Error('Duplicate atlas ID');
for (const item of archive) await fs.access(path.resolve(root, 'combat', item.sprite.src));
await fs.mkdir(path.join(root, 'combat'), { recursive: true });
await fs.writeFile(path.join(root, 'combat', 'sprite-catalog.mjs'), `// Generated from the CainOS atlas table. Run node scripts/build-combat-catalog.mjs.\nexport const SPRITE_CATALOG = ${JSON.stringify(archive, null, 2)};\n`);
console.log(`Catalogued ${archive.length} existing atlas entries across ${tables.length} sheets.`);

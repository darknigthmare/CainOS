/**
 * Technical, read-only audit of the exact sprites and animation cells used by Encore.
 * An alpha/geometry pass is not a canonical-fidelity or visual-framing approval.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { FIGHTERS, ARCHIVE, VARIANTS, SOURCES, GAME } from '../combat/data.mjs';
import { ANIMATION_REGISTRATION, POSE_PRESENTATION, POSE_REGISTRATION_VERSION, spriteSourceRegion } from '../combat/render-poses.mjs';

const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const positiveInteger = value => Number.isInteger(value) && value > 0;
const pngSignature = Buffer.from([137,80,78,71,13,10,26,10]);
const sourceFiles = [
  'combat/data.mjs', 'combat/sprite-catalog.mjs', 'combat/render-poses.mjs',
  'combat/render-sequences.mjs', 'combat/fidelity.mjs', 'combat/costume-fidelity.mjs',
  'combat/costume-refinements.mjs', 'scripts/audit-combat-assets.mjs',
  'scripts/audit-combat-raster.py',
  'docs/gamedev/upstream/skills/disciplines/create-game-assets/scripts/asset_report.py',
];

export function assetPath(src) {
  if (typeof src !== 'string' || !src || src.includes('\\') || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(src)) throw new Error('Expected a local sprite source.');
  const relative = path.posix.normalize(path.posix.join('combat', src.startsWith('assets/') ? '../' + src : src));
  if (!relative.startsWith('assets/images/') || !relative.endsWith('.png')) throw new Error('Sprite source must resolve inside assets/images/*.png.');
  return relative;
}

function rasterBatch(root, images, python) {
  const child = spawnSync(python, ['-B', path.join(sourceRoot, 'scripts/audit-combat-raster.py')], {
    input: JSON.stringify({root, images}), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    timeout: 120000, env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
  });
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error('Raster inspection failed: ' + (child.stderr || child.stdout).trim());
  const result = JSON.parse(child.stdout);
  if (result.error || !Array.isArray(result.images)) throw new Error(result.error || 'Raster inspector returned invalid data.');
  return result;
}

export async function auditCombatAssets({
  root = sourceRoot, fighters = FIGHTERS, archive = ARCHIVE, variants = VARIANTS,
  registrations = ANIMATION_REGISTRATION, presentation = POSE_PRESENTATION, sources = SOURCES,
  python = process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3',
} = {}) {
  root = path.resolve(root);
  const errors = [], references = [], images = new Map(), sourceMap = new Map(sources.map(source => [source.id, source]));
  const problem = (code, subject, detail) => errors.push({code, subject, detail});
  const fidelity = (item, kind) => ({
    register: kind === 'fighter' ? 'combat/fidelity.mjs' : item.fidelity ? 'combat/costume-fidelity.mjs' : 'combat/sprite-catalog.mjs',
    recordId: item.id, reviewStatus: item.fidelity?.reviewStatus || 'Archive provenance; canonical comparison not assessed by this audit.',
    sourceIds: [...(item.fidelity?.sourceIds || [])],
    sources: (item.fidelity?.sourceIds || []).map(id => ({id, url: sourceMap.get(id)?.url || null})),
    archiveSource: item.source || null,
  });
  for (const [kind, entries] of [['fighter', fighters], ['archive', archive]]) {
    const ids = new Set();
    for (const item of entries) {
      if (!item.id || ids.has(item.id)) problem('duplicate-id', kind + ':' + item.id, 'Catalog IDs must be populated and unique within their catalog.');
      ids.add(item.id);
      for (const sourceId of item.fidelity?.sourceIds || []) if (!sourceMap.has(sourceId)) problem('unknown-fidelity-source', kind + ':' + item.id, sourceId);
    }
  }
  for (const variant of variants) {
    const archived = archive.find(item => item.id === variant.id);
    if (!archived || JSON.stringify(archived.sprite) !== JSON.stringify(variant.sprite))
      problem('variant-not-in-archive', variant.id, 'The selectable costume must use its actual archive sprite.');
  }
  async function loadImage(spec, subject) {
    let name;
    try { name = assetPath(spec?.src); }
    catch (error) { problem('invalid-source', subject, error.message); return null; }
    if (images.has(name)) return images.get(name);
    const row = {path: name, crops: [], problems: []};
    images.set(name, row);
    try {
      const file = path.join(root, name), real = await fs.realpath(file);
      if (!real.startsWith(root + path.sep)) throw new Error('Image resolves outside the repository.');
      const bytes = await fs.readFile(file);
      if (bytes.length < 33 || !bytes.subarray(0, 8).equals(pngSignature) || bytes.toString('ascii', 12, 16) !== 'IHDR')
        throw new Error('Invalid PNG signature or header.');
      row.width = bytes.readUInt32BE(16); row.height = bytes.readUInt32BE(20);
      if (!positiveInteger(row.width) || !positiveInteger(row.height)) throw new Error('Invalid PNG dimensions.');
      row.bytes = bytes.length; row.sha256 = sha256(bytes);
    } catch (error) {
      row.problems.push(error.message); problem('unreadable-image', subject, name + ': ' + error.message);
    }
    return row;
  }
  function addRegion(item, kind, spec, image, index, animated) {
    const subject = kind + ':' + item.id + (animated ? ':frame:' + index : ':sprite');
    const reference = {id: subject, catalog: kind, entityId: item.id, category: item.category || kind,
      source: spec?.src || null, image: image?.path || null, animated, frame: animated ? index : null,
      alphaPolicy: animated || spec?.matteMode === 'native-alpha' ? 'native-alpha' : 'runtime-matte',
      fidelity: fidelity(item, kind)};
    references.push(reference);
    if (!image || image.problems.length) return;
    const cols = spec.cols ?? 1, rows = spec.rows ?? 1;
    if (!positiveInteger(cols) || !positiveInteger(rows)) { problem('invalid-grid', subject, 'Grid dimensions must be positive integers.'); return; }
    if (animated && (!Number.isInteger(index) || index < 0 || index >= cols * rows)) { problem('invalid-frame', subject, 'Frame index is outside the animation grid.'); return; }
    if (!animated && !spec.sourceRect && (!Number.isInteger(spec.col ?? 0) || !Number.isInteger(spec.row ?? 0) || (spec.col ?? 0) < 0 || (spec.row ?? 0) < 0 || (spec.col ?? 0) >= cols || (spec.row ?? 0) >= rows)) {
      problem('invalid-cell', subject, 'Static sprite cell is outside the grid.'); return;
    }
    let region;
    try { region = spriteSourceRegion(spec, index, animated, image.width, image.height); }
    catch (error) { problem('invalid-crop', subject, error.message); return; }
    reference.region = {x: region.x, y: region.y, width: region.width, height: region.height, offsetX: region.offsetX, offsetY: region.offsetY};
    reference.cropKey = [region.x, region.y, region.width, region.height].join(',');
    if (!image.crops.some(crop => crop.key === reference.cropKey))
      image.crops.push({key: reference.cropKey, rect: [region.x, region.y, region.width, region.height]});
    if (animated) {
      const registration = registrations[item.id];
      reference.registration = registration ? {id: registration.id, version: POSE_REGISTRATION_VERSION, anchor: registration.anchors?.[index] || null, expectedSize: registration.size, provenance: registration.provenance} : null;
      if (!registration || !region.registration) {
        problem('unregistered-animation', subject, 'The source filename, dimensions, grid and frame must resolve to an inspected runtime registration.');
        return;
      }
      if (registration.source !== path.posix.basename(image.path) || registration.cols !== cols || registration.rows !== rows || registration.size?.[0] !== image.width || registration.size?.[1] !== image.height)
        problem('registration-mismatch', subject, 'Animation metadata does not match the registered source, dimensions or grid.');
      const anchor = registration.anchors?.[index];
      if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y) || anchor.x < region.offsetX || anchor.y < region.offsetY || anchor.x >= region.offsetX + region.width || anchor.y >= region.offsetY + region.height)
        problem('invalid-anchor', subject, 'The registered anchor must be a finite point inside its source region.');
      else if (region.registration.id !== item.id || anchor.x !== region.registration.anchor.x || anchor.y !== region.registration.anchor.y)
        problem('anchor-mismatch', subject, 'The reviewed registration and the runtime source region disagree.');
    }
  }
  for (const [kind, entries] of [['fighter', fighters], ['archive', archive]]) {
    for (const item of entries) {
      const image = await loadImage(item.sprite, kind + ':' + item.id);
      addRegion(item, kind, item.sprite || {}, image, 0, false);
    }
  }
  let animationSheets = 0, animationFrames = 0, animationStateReferences = 0;
  for (const item of fighters) {
    const spec = item.animation;
    if (!spec) continue;
    animationSheets++;
    const image = await loadImage(spec, 'animation:' + item.id), cols = spec.cols, rows = spec.rows;
    if (!positiveInteger(cols) || !positiveInteger(rows) || cols * rows > 4096) {
      problem('invalid-grid', 'animation:' + item.id, 'Animation grid dimensions are invalid.'); continue;
    }
    const count = cols * rows, registration = registrations[item.id];
    if (registration?.anchors?.length !== count) problem('anchor-count', 'animation:' + item.id, 'Each animation cell must have exactly one reviewed anchor.');
    const states = spec.frames && typeof spec.frames === 'object' ? Object.entries(spec.frames) : [];
    if (!states.length) problem('missing-frames', 'animation:' + item.id, 'Animation states are absent.');
    const validateFrames = (name, frames) => {
      if (!Array.isArray(frames) || !frames.length) { problem('invalid-frame-list', item.id + ':' + name, 'State frames must be a nonempty array.'); return; }
      for (const frame of frames) {
        animationStateReferences++;
        if (!Number.isInteger(frame) || frame < 0 || frame >= count)
          problem('invalid-frame', item.id + ':' + name, 'Referenced frame ' + frame + ' is outside the animation grid.');
      }
    };
    for (const [name, frames] of states) validateFrames('animation.' + name, frames);
    const poses = presentation[item.id];
    if (!poses) problem('missing-presentation', item.id, 'Animated fighter has no pose presentation mapping.');
    else for (const name of ['intro', 'victory', 'defeat', 'melee', 'projectile', 'support'])
      validateFrames('presentation.' + name, Array.isArray(poses[name]) ? poses[name] : [poses[name]]);
    for (let index = 0; index < count; index++) { addRegion(item, 'fighter', spec, image, index, true); animationFrames++; }
  }

  const imageRows = [...images.values()].sort((a,b) => a.path.localeCompare(b.path, 'en'));
  let raster;
  try {
    raster = rasterBatch(root, imageRows.filter(row => !row.problems.length).map(({path, crops}) => ({path, crops})), python);
    const decoded = new Map(raster.images.map(row => [row.path, row]));
    for (const image of imageRows) {
      if (image.problems.length) continue;
      const result = decoded.get(image.path);
      if (!result || result.problems.length) { problem('raster-decode', image.path, result?.problems?.join('; ') || 'Raster result missing.'); continue; }
      if (result.width !== image.width || result.height !== image.height || result.bytes !== image.bytes)
        problem('raster-changed', image.path, 'Decoded dimensions or bytes differ from the catalog inspection.');
      image.raster = result;
      for (const reference of references.filter(ref => ref.image === image.path && ref.cropKey)) {
        const crop = result.crops.find(item => item.key === reference.cropKey);
        if (!crop) { problem('crop-result-missing', reference.id, reference.cropKey); continue; }
        reference.alpha = crop;
        if (crop.visible_pixels <= 0) problem('empty-region', reference.id, 'The selected region has no pixels visible at the renderer alpha threshold (12).');
        if (reference.alphaPolicy === 'native-alpha' && (!crop.has_alpha || crop.alpha_min === 255))
          problem('opaque-native-alpha', reference.id, 'Native-alpha artwork must contain real transparency in this selected region.');
      }
      // Do not claim the source stayed unchanged if an external edit raced inspection.
      if (sha256(await fs.readFile(path.join(root, image.path))) !== image.sha256)
        problem('raster-changed', image.path, 'Image bytes changed during the read-only audit.');
    }
  } catch (error) { problem('raster-tool', 'python', error.message); }
  const sourceHashes = {};
  for (const file of sourceFiles) sourceHashes[file] = sha256(await fs.readFile(path.join(sourceRoot, file)));
  const nativeRegions = references.filter(ref => ref.alphaPolicy === 'native-alpha');
  return {
    schema: 'encore-assets-audit/v1', pass: errors.length === 0, gameVersion: GAME.version,
    guideCommit: '19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9',
    scope: 'Read-only PNG decoding, source regions, animation registration and alpha validation; no canonical fidelity certification.',
    toolchain: {pillow: raster?.pillow || null},
    sourceHashes, catalogSha256: sha256(JSON.stringify({fighters: fighters.map(item => ({id:item.id,sprite:item.sprite,animation:item.animation})), archive: archive.map(item => ({id:item.id,sprite:item.sprite})), registrations,presentation})),
    summary: {
      fighters: fighters.length, archiveEntries: archive.length, selectableVariants: variants.length,
      animationSheets, animationFrames, animationStateReferences, images: imageRows.length,
      imageBytes: imageRows.reduce((sum,image) => sum + (image.bytes || 0), 0),
      references: references.length, uniqueCrops: imageRows.reduce((sum,image) => sum + image.crops.length, 0),
      nativeAlphaReferences: nativeRegions.length, runtimeMatteReferences: references.length - nativeRegions.length,
      violations: errors.length,
    },
    limitations: [
      'Pixel transparency and valid rectangles do not establish canonical 1:1 proportions, identity or costumes.',
      'This audit does not prove that limbs are intact, frames are aesthetically aligned, or the silhouette is readable in motion; in-game visual review remains required.',
      'Legacy opaque atlases are intentionally allowed under runtime-matte. Their post-matte Canvas result is covered by rendering tests, not by source alpha alone.',
      'Valid anchors remain the project\'s reviewed source registrations; this audit does not infer canonical ground contact or character height.',
      'No image is edited, normalized, regenerated or written by this audit.',
    ],
    images: imageRows, references, errors,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && !(args.length === 2 && args[0] === '--output')) throw new Error('Usage: node scripts/audit-combat-assets.mjs [--output report.json]');
  const output = path.resolve(args[1] || path.join(sourceRoot, 'audit-combat/assets-report.json'));
  const report = await auditCombatAssets();
  await fs.mkdir(path.dirname(output), {recursive: true});
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({pass: report.pass, ...report.summary, report: path.relative(sourceRoot, output)}, null, 2));
  if (!report.pass) { console.error(JSON.stringify(report.errors, null, 2)); process.exitCode = 1; }
}

/** Final focus preservation proof, independent of the historical completion report.
 * Retains that verifier's exact archive exceptions and historical comparisons.
 * Adds the two focus families and 34 native assets after the 27-family completion.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as current from '../../../../combat/data.mjs';
import * as art from '../../../../combat/offline-manifest.mjs';
import { BASE_SPRITE_DEFINITIONS } from '../../../../combat/base-sprite-content.mjs';
import { ABSTRACTION_IDS } from '../../../../combat/abstractions-content.mjs';
import { ABSTRACTION_PROJECTILE_ART, projectileArtSpec } from '../../../../combat/projectile-art.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const baselineRoot = path.resolve(process.argv[2] || '');
assert.ok(process.argv[2], 'Pass a clean runtime snapshot directory of cc972c8.');
const baseCommit = 'cc972c8412bddb5278ef7c609dd82897325a2922';
const before = await import(pathToFileURL(path.join(baselineRoot, 'combat/data.mjs')));
const oldArt = await import(pathToFileURL(path.join(baselineRoot, 'combat/offline-manifest.mjs')));
const digest = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
// Authenticate the complete 68-file combat snapshot against cc972c8 before it
// is accepted as the reference for any current-runtime comparison.
const gitBlob = bytes => createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
const snapshotTree = execFileSync('git', ['ls-tree', '-r', '-z', baseCommit, 'combat'],
  { cwd: root, encoding: 'utf8', maxBuffer: 1024 * 1024 });
const snapshotBlobs = new Map(snapshotTree.split('\0').filter(Boolean).map(line => {
  const [head, name] = line.split('\t'); return [name, head.split(' ')[2]];
}));
const snapshotDirectory = await fs.readdir(path.join(baselineRoot, 'combat'), { withFileTypes: true });
assert.ok(snapshotDirectory.every(entry => entry.isFile()), 'The cc972c8 combat snapshot is flat');
assert.deepEqual(snapshotDirectory.map(entry => 'combat/' + entry.name).sort(), [...snapshotBlobs.keys()].sort());
assert.equal(snapshotBlobs.size, 68);
const snapshotSHA256 = {};
for (const [file, blob] of snapshotBlobs) {
  const bytes = await fs.readFile(path.join(baselineRoot, file));
  assert.equal(gitBlob(bytes), blob, file + ': snapshot matches cc972c8');
  snapshotSHA256[file] = digest(bytes);
}
const baselineSnapshot = { directory: baselineRoot, files: snapshotBlobs.size,
  everyFileMatchesBaseCommit: true, sha256: snapshotSHA256 };
const historicalRoot = path.join(root, 'docs/art-generation/completion-20261127');
const historicalFiles = ['verify-preservation.mjs', ...(await fs.readdir(path.join(historicalRoot, 'qa')))
  .filter(name => /\.(?:json|log)$/.test(name)).map(name => 'qa/' + name)];
const historicalEvidenceHashes = Object.fromEntries(await Promise.all(historicalFiles.map(async file =>
  [file, digest(await fs.readFile(path.join(historicalRoot, file)))])));
console.log(JSON.stringify({ phase: 'baseline-authenticated', combatFiles: snapshotBlobs.size, historicalReportsProtected: historicalFiles.length }));
assert.equal(before.COSTUMES.length, 546);
assert.equal(before.FIGHTERS.length, 64);
assert.equal(before.STAGES.length, 27);
assert.equal(oldArt.ART_FILES.length, 6218);
assert.deepEqual(current.FIGHTERS, before.FIGHTERS);
// The next focus corrected the identity/provenance of these two archive aliases.
// Allow only this reviewed, exact metadata delta; old sprite/source/classification
// fields and every other archive entry still have to match the published baseline.
const archiveAliasMetadata = {
  provenance: 'Evil Pomni, PNJ adverse des Big Top : les archives evilpomni et rivalbaseballpomni désignent la même incarnation, pas une transformation de Pomni. Références : épisode 5 vers 20 min 50 s et Pendantz officiel rouge/jaune à accents bleus. Les anciens dessins incorrects restent conservés ; le portrait corrigé est partagé après validation de sa paire.',
  status: 'Alias du même PNJ ; ancienne illustration remplacée après validation de la paire',
  identityId: 'evilpomni-big-top',
  archiveAliases: ['evilpomni', 'rivalbaseballpomni'],
  referenceUrls: ['https://glitchproductions.store/products/pomni-animiniz-pendantz', 'https://www.youtube.com/watch?v=L4p2gN2CzsA&t=1250s']
};
const archiveReplacementReasons = {
  evilpomni: 'L’ancienne création noire/rouge à boutons en croix ne reproduit pas le costume officiel rouge/jaune à accents bleus.',
  rivalbaseballpomni: 'L’ancienne création à étoiles, lunettes et yeux jaunes ne reproduit pas la Pomni adverse de l’épisode 5.'
};
const permittedArchiveMetadataUpdates = [];
const expectedArchive = before.ARCHIVE.map(item => {
  if (!Object.hasOwn(archiveReplacementReasons, item.id)) return item;
  const metadata = {...archiveAliasMetadata, supersededArtwork: {
    selection: '../assets/encore/selection/' + item.id + '.png',
    replacementAppearanceId: 'evilpomni-pendantz', preserved: true,
    reason: archiveReplacementReasons[item.id]
  }};
  permittedArchiveMetadataUpdates.push({id: item.id, fields: Object.keys(metadata),
    before: Object.fromEntries(Object.keys(metadata).map(key => [key, item[key] ?? null])), after: metadata});
  return {...item, ...metadata};
});
assert.equal(permittedArchiveMetadataUpdates.length, 2);
assert.deepEqual(current.ARCHIVE, expectedArchive);
assert.deepEqual(current.COSTUMES.slice(0, before.COSTUMES.length), before.COSTUMES);
assert.deepEqual(current.CROSSOVER_COSTUMES.slice(0, before.CROSSOVER_COSTUMES.length), before.CROSSOVER_COSTUMES);
const metadataKeys = new Set(['fidelity', 'description', 'sourceId', 'sourceStatus', 'loreSource']);
const mechanical = item => Object.fromEntries(Object.entries(item).filter(([key]) => !metadataKeys.has(key)));
assert.deepEqual(current.STAGES.map(mechanical), before.STAGES.map(mechanical));
assert.deepEqual(current.DEDICATED_STAGES.map(mechanical), before.DEDICATED_STAGES.map(mechanical));
// Preserve the historical completion assertions on its exact 27-entry slice.
const newFamilies = current.COSTUMES.slice(before.COSTUMES.length, before.COSTUMES.length + 27);
assert.equal(newFamilies.length, 27);
assert.equal(newFamilies.filter(item => item.fighterId === 'kaufmo').length, 21);
assert.equal(newFamilies.filter(item => item.fighterId === 'max').length, 6);
const focusFamilies = current.COSTUMES.slice(before.COSTUMES.length + 27);
assert.deepEqual(focusFamilies.map(item => item.id), ['godcaine', 'evilpomni-pendantz']);
assert.deepEqual(focusFamilies.map(item => item.fighterId), ['caine', 'pomni']);
assert.equal(current.COSTUMES.length, 575);
for (const family of focusFamilies) {
  assert.equal(family.baseOnly, true);
  assert.equal(family.presentation, 'static');
  assert.equal(family.animation, null);
  assert.deepEqual(family.authoredSlots, ['selection', 'stance']);
}
const retained = new Set(art.ART_FILES);
for (const name of oldArt.ART_FILES) assert.ok(retained.has(name), name + ': baseline asset retained');
assert.equal(art.ART_FILES.length - oldArt.ART_FILES.length, 97);
const oldPublished = new Set(oldArt.ART_FILES);
const addedAssets = art.ART_FILES.filter(file => !oldPublished.has(file));
assert.equal(addedAssets.length, 97);
const focusManifestFile = path.join(here, '../manifest.json');
const focusManifestBytes = await fs.readFile(focusManifestFile);
const focusManifest = JSON.parse(focusManifestBytes);
assert.equal(focusManifest.baselineCommit, baseCommit);
assert.equal(focusManifest.assets.length, 34);
assert.equal(focusManifest.counts.nativeImages, 34);
assert.equal(focusManifest.counts.staticBaseFamilies, 2);
assert.equal(focusManifest.counts.staticBaseImages, 4);
assert.equal(focusManifest.counts.projectileMotifs, 10);
assert.equal(focusManifest.counts.campaignPaintings, 20);
assert.equal(focusManifest.counts.campaignRoutes, 10);
assert.equal(focusManifest.counts.newAnimationFrames, 0);
assert.deepEqual(new Set(Object.keys(ABSTRACTION_PROJECTILE_ART)), new Set(ABSTRACTION_IDS));
const expectedFocusPaths = [
  ...focusFamilies.flatMap(item => ['selection', 'stance'].map(slot => 'assets/encore/base-costumes/' + item.id + '/' + slot + '.png')),
  ...ABSTRACTION_IDS.map(id => 'assets/encore/projectiles/' + ABSTRACTION_PROJECTILE_ART[id].motif + '.png'),
  ...ABSTRACTION_IDS.flatMap(id => ['prologue-1', 'epilogue-3'].map(panel => 'assets/encore/campaign/' + id + '/' + id + '-' + panel + '.png')),
];
assert.equal(new Set(expectedFocusPaths).size, 34);
assert.deepEqual(focusManifest.assets.map(item => item.path).sort(), [...expectedFocusPaths].sort());
const focusAssets = [];
let focusBytes = 0;
for (const entry of focusManifest.assets) {
  const publishedPath = '../' + entry.path;
  assert.ok(retained.has(publishedPath), entry.path + ': published');
  assert.ok(!oldPublished.has(publishedPath), entry.path + ': new focus image');
  const bytes = await fs.readFile(path.join(root, entry.path));
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(digest(bytes), entry.sha256, entry.path + ': exact recorded native bytes');
  assert.equal(bytes.length, entry.bytes);
  focusBytes += bytes.length;
  focusAssets.push({ id: entry.id, kind: entry.kind, path: entry.path, bytes: bytes.length, sha256: digest(bytes) });
}
assert.equal(focusBytes, focusManifest.nativeBytes);
for (const family of focusFamilies) {
  const definition = BASE_SPRITE_DEFINITIONS.find(item => item.id === family.id);
  assert.equal(definition.assetReview.status, 'verified-base-files');
  for (const slot of ['selection', 'stance']) {
    const file = 'assets/encore/base-costumes/' + family.id + '/' + slot + '.png';
    assert.equal(focusAssets.find(item => item.path === file).sha256, definition.assetReview.sha256[slot]);
  }
}
let focusProjectileTechniques = 0;
for (const id of ABSTRACTION_IDS) {
  const fighter = current.FIGHTERS.find(item => item.id === id);
  for (const move of Object.values(fighter.moves).filter(item => item.kind === 'projectile')) {
    assert.equal(projectileArtSpec({ def: move }, { f: fighter }).id, ABSTRACTION_PROJECTILE_ART[id].motif);
    focusProjectileTechniques++;
  }
}
assert.equal(focusProjectileTechniques, 13);
assert.equal(focusManifest.counts.projectileTechniques, focusProjectileTechniques);
const completionOnlyAssets = addedAssets.filter(file => !expectedFocusPaths.includes(file.replace(/^\.\.\//, '')));
assert.equal(completionOnlyAssets.length, 63);
console.log(JSON.stringify({ phase: 'focus-validated', families: focusFamilies.length, images: focusAssets.length, bytes: focusBytes, projectileTechniques: focusProjectileTechniques }));
const unchangedFiles = ['combat/engine.mjs','combat/session.mjs','combat/progression.mjs','combat/bindings.mjs',
  'combat/stories.mjs','combat/render.mjs','combat/render-poses.mjs','combat/render-sequences.mjs','combat/stage-parallax.mjs'];
const sourceHashes = {};
for (const file of unchangedFiles) {
  const a = await fs.readFile(path.join(root, file)), b = await fs.readFile(path.join(baselineRoot, file));
  assert.deepEqual(a, b, file + ': source unchanged');
  assert.equal(gitBlob(a), snapshotBlobs.get(file), file + ': current source matches cc972c8');
  sourceHashes[file] = digest(a);
}
// Git's tree retains the old object IDs even in a filtered checkout; no old image
// blobs are fetched and no build directory or duplicate artwork is created.
const tree = execFileSync('git', ['ls-tree','-r','-z',baseCommit,'assets'], {cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
const oldBlobs = new Map(tree.split('\0').filter(Boolean).map(line => {
  const [head, name] = line.split('\t'); return [name, head.split(' ')[2]];
}));
let verifiedBytes = 0, verifiedImages = 0;
for (const name of oldArt.ART_FILES) {
  const absolute = path.resolve(root, 'combat', name), relative = path.relative(root, absolute).split(path.sep).join('/');
  const bytes = await fs.readFile(absolute);
  const gitHash = createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(gitHash, oldBlobs.get(relative), relative + ': baseline bytes unchanged');
  verifiedBytes += bytes.length; verifiedImages++;
  if (verifiedImages % 1000 === 0) console.log(JSON.stringify({ phase: 'historical-image-blobs', verifiedImages, verifiedBytes }));
}
assert.equal(verifiedBytes, oldArt.ART_BYTES);
const stagesChanged = current.STAGES.flatMap((stage,index) => {
  const old = before.STAGES[index];
  const changed = [...metadataKeys].filter(key => JSON.stringify(stage[key]) !== JSON.stringify(old[key]));
  return changed.length ? [{id:stage.id,changedMetadata:changed}] : [];
});
for (const [file, hash] of Object.entries(historicalEvidenceHashes))
  assert.equal(digest(await fs.readFile(path.join(historicalRoot, file))), hash, file + ': historical evidence untouched');
const report = {schema:'encore-focus-preservation/v1',date:'2026-11-27',baseCommit, baselineSnapshot,
  derivedFrom: { file: 'docs/art-generation/completion-20261127/verify-preservation.mjs', sha256: historicalEvidenceHashes['verify-preservation.mjs'],
    scope: 'All historical comparisons and the exact two archive metadata exceptions retained. Original 27-family completion checked separately from the two appended focus families.' },
  counts:{fighters:current.FIGHTERS.length,techniques:current.FIGHTERS.reduce((n,f)=>n+Object.keys(f.moves).length,0),
    costumes:current.COSTUMES.length,crossovers:current.CROSSOVER_COSTUMES.length,staticBaseFamilies:current.BASE_SPRITE_COSTUMES.length,
    declaredStaticBaseFamilies:BASE_SPRITE_DEFINITIONS.length,
    stages:current.STAGES.length,dedicatedArrangements:current.DEDICATED_STAGES.length,
    illustrations:art.ART_FILES.length,illustrationBytes:art.ART_BYTES,newRuntimeImages:97,newAppearanceFamilies:29,
    previousCompletionImages:63,previousCompletionFamilies:27,focusImages:34,focusFamilies:2},
  preserved:{fighterFieldsSHA256:digest(current.FIGHTERS),archiveFieldsSHA256:digest(current.ARCHIVE),
    costumePrefixCount:before.COSTUMES.length,costumePrefixSHA256:digest(before.COSTUMES),
    crossoverPrefixCount:before.CROSSOVER_COSTUMES.length,crossoverPrefixSHA256:digest(before.CROSSOVER_COSTUMES),
    originalImages:oldArt.ART_FILES.length,originalImageBytes:verifiedBytes,allOriginalImageGitBlobsMatch:true,
    stageAndArrangementMechanicalFields:true,sourceHashes,
    historicalEvidenceFilesUnchanged:true,historicalEvidenceHashes},
  permittedStageMetadataUpdates:stagesChanged,
  permittedArchiveMetadataUpdates,
  previousCompletionFamilyIds:newFamilies.map(item=>item.id),
  focus:{familyIds:focusFamilies.map(item=>item.id),manifestSHA256:digest(focusManifestBytes),nativeBytes:focusBytes,
    assets:focusAssets,projectileTechniques:focusProjectileTechniques,allNativeBytesMatchManifest:true},
  newFamilyIds:[...newFamilies,...focusFamilies].map(item=>item.id),offlineVersion:art.OFFLINE_VERSION,artVersion:art.ART_VERSION,ok:true};
await fs.writeFile(path.join(here,'preservation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:true,...report.counts,originalImagesVerified:oldArt.ART_FILES.length}));

/** Compare a clean runtime snapshot of the published baseline with this continuation. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as current from '../../../combat/data.mjs';
import * as art from '../../../combat/offline-manifest.mjs';
import { BASE_SPRITE_DEFINITIONS } from '../../../combat/base-sprite-content.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const baselineRoot = path.resolve(process.argv[2] || '');
assert.ok(process.argv[2], 'Pass a clean runtime snapshot directory of cc972c8.');
const baseCommit = 'cc972c8412bddb5278ef7c609dd82897325a2922';
const before = await import(pathToFileURL(path.join(baselineRoot, 'combat/data.mjs')));
const oldArt = await import(pathToFileURL(path.join(baselineRoot, 'combat/offline-manifest.mjs')));
const digest = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
assert.equal(before.COSTUMES.length, 546);
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
const newFamilies = current.COSTUMES.slice(before.COSTUMES.length);
assert.equal(newFamilies.length, 27);
assert.equal(newFamilies.filter(item => item.fighterId === 'kaufmo').length, 21);
assert.equal(newFamilies.filter(item => item.fighterId === 'max').length, 6);
const retained = new Set(art.ART_FILES);
for (const name of oldArt.ART_FILES) assert.ok(retained.has(name), name + ': baseline asset retained');
assert.equal(art.ART_FILES.length - oldArt.ART_FILES.length, 63);
const unchangedFiles = ['combat/engine.mjs','combat/session.mjs','combat/progression.mjs','combat/bindings.mjs',
  'combat/stories.mjs','combat/render.mjs','combat/render-poses.mjs','combat/render-sequences.mjs','combat/stage-parallax.mjs'];
const sourceHashes = {};
for (const file of unchangedFiles) {
  const a = await fs.readFile(path.join(root, file)), b = await fs.readFile(path.join(baselineRoot, file));
  assert.deepEqual(a, b, file + ': source unchanged'); sourceHashes[file] = digest(a);
}
// Git's tree retains the old object IDs even in a filtered checkout; no old image
// blobs are fetched and no build directory or duplicate artwork is created.
const tree = execFileSync('git', ['ls-tree','-r','-z',baseCommit,'assets'], {cwd:root,encoding:'utf8',maxBuffer:4*1024*1024});
const oldBlobs = new Map(tree.split('\0').filter(Boolean).map(line => {
  const [head, name] = line.split('\t'); return [name, head.split(' ')[2]];
}));
let verifiedBytes = 0;
for (const name of oldArt.ART_FILES) {
  const absolute = path.resolve(root, 'combat', name), relative = path.relative(root, absolute).split(path.sep).join('/');
  const bytes = await fs.readFile(absolute);
  const gitHash = createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(gitHash, oldBlobs.get(relative), relative + ': baseline bytes unchanged');
  verifiedBytes += bytes.length;
}
assert.equal(verifiedBytes, oldArt.ART_BYTES);
const stagesChanged = current.STAGES.flatMap((stage,index) => {
  const old = before.STAGES[index];
  const changed = [...metadataKeys].filter(key => JSON.stringify(stage[key]) !== JSON.stringify(old[key]));
  return changed.length ? [{id:stage.id,changedMetadata:changed}] : [];
});
const report = {schema:'encore-completion-preservation/v1',date:'2026-11-27',baseCommit,
  counts:{fighters:current.FIGHTERS.length,techniques:current.FIGHTERS.reduce((n,f)=>n+Object.keys(f.moves).length,0),
    costumes:current.COSTUMES.length,crossovers:current.CROSSOVER_COSTUMES.length,staticBaseFamilies:current.BASE_SPRITE_COSTUMES.length,
    declaredStaticBaseFamilies:BASE_SPRITE_DEFINITIONS.length,
    stages:current.STAGES.length,dedicatedArrangements:current.DEDICATED_STAGES.length,
    illustrations:art.ART_FILES.length,illustrationBytes:art.ART_BYTES,newRuntimeImages:63,newAppearanceFamilies:27},
  preserved:{fighterFieldsSHA256:digest(current.FIGHTERS),archiveFieldsSHA256:digest(current.ARCHIVE),
    costumePrefixCount:before.COSTUMES.length,costumePrefixSHA256:digest(before.COSTUMES),
    crossoverPrefixCount:before.CROSSOVER_COSTUMES.length,crossoverPrefixSHA256:digest(before.CROSSOVER_COSTUMES),
    originalImages:oldArt.ART_FILES.length,originalImageBytes:verifiedBytes,allOriginalImageGitBlobsMatch:true,
    stageAndArrangementMechanicalFields:true,sourceHashes},
  permittedStageMetadataUpdates:stagesChanged,
  permittedArchiveMetadataUpdates,
  newFamilyIds:newFamilies.map(item=>item.id),offlineVersion:art.OFFLINE_VERSION,artVersion:art.ART_VERSION,ok:true};
await fs.writeFile(path.join(here,'qa/catalog-preservation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:true,...report.counts,originalImagesVerified:oldArt.ART_FILES.length}));

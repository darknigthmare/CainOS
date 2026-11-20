import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { COSTUMES, CROSSOVER_COSTUMES, FIGHTERS, equipCostume } from '../combat/data.mjs';
import { NPC_CROSSOVER_DEFINITIONS } from '../combat/crossover-npc-additions.mjs';
import { COSTUME_EXTENSION_ORDER } from '../combat/costume-order.mjs';
import { crossoverStylesFor } from '../combat/crossovers.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';

const folder = 'docs/art-generation/continuation-20261120-b/metarunner';
const styles = ['hommage', 'resident', 'fusion'];
const ids = styles.map(style => 'glitch-metarunner-ribbit-' + style);
const slots = ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat'];
const bytes = file => readFileSync(new URL('../' + file, import.meta.url));
const json = file => JSON.parse(bytes(file));
const sha = value => createHash('sha256').update(value).digest('hex');

test('the three explicit Ribbit Meta Runner designs append after both Cafe outfits and preserve their owner kit', () => {
  assert.deepEqual(COSTUMES.slice(472, 474).map(costume => costume.id), ['cafekinger', 'cafepomni']);
  assert.deepEqual(COSTUMES.slice(474, 477).map(costume => costume.id), ids);
  assert.deepEqual(CROSSOVER_COSTUMES.slice(381, 384).map(costume => costume.id), ids);
  assert.deepEqual(NPC_CROSSOVER_DEFINITIONS.slice(3, 6).map(definition => definition.id), ids);
  assert.deepEqual(COSTUME_EXTENSION_ORDER.slice(43, 48), ['cafekinger', 'cafepomni', ...ids]);
  assert.deepEqual(crossoverStylesFor('metarunner', 'ribbit'), styles);
  const owner = FIGHTERS.find(fighter => fighter.id === 'ribbit');
  for (const [index, id] of ids.entries()) {
    const costume = COSTUMES.find(candidate => candidate.id === id);
    assert.equal(costume.fighterId, 'ribbit');
    assert.equal(costume.baseFighterId, 'ribbit');
    assert.deepEqual(costume.crossover, { series: 'metarunner', style: styles[index] });
    assert.equal(costume.canonicalCostumeClaim, false);
    assert.equal(costume.sprite.src, '../assets/encore/crossovers/metarunner/ribbit/' + styles[index] + '/stance.png');
    assert.equal(costume.sprite.nativeFacing, 1);
    const equipped = equipCostume(owner, id);
    assert.equal(equipped.costume, id);
    assert.equal(equipped.moves, owner.moves);
    assert.equal(equipped.combat, owner.combat);
    assert.deepEqual(equipped.visual, owner.visual);
    const other = FIGHTERS.find(fighter => fighter.id === 'jax');
    assert.equal(equipCostume(other, id), other);
  }
});

test('all 33 Meta Runner slots retain native bytes, accepted receipts, frozen definitions and exact job references', () => {
  const completion = json(folder + '/generation-completion.json');
  assert.equal(completion.status, 'integrated_native');
  assert.deepEqual(completion.order, ids);
  assert.deepEqual(completion.slots, slots);
  assert.equal(completion.historicalWardrobePrefixPreserved, 472);
  assert.equal(completion.historicalCrossoversPreserved, 381);
  assert.equal(completion.historicalNpcDefinitionsPreserved, 3);
  assert.equal(completion.canonicalCostumeClaim, false);
  assert.equal(completion.completeAnimationClaim, false);
  const assets = completion.appearances.flatMap(appearance => appearance.files);
  assert.deepEqual(completion.appearances.map(appearance => appearance.id), ids);
  assert.equal(assets.length, 33);
  assert.equal(completion.counts.nativePNG, 33);
  assert.equal(completion.counts.bytes, assets.reduce((sum, asset) => sum + asset.bytes, 0));
  assert.equal(new Set(assets.map(asset => asset.sha256)).size, 33);
  assert.equal(new Set(assets.map(asset => asset.sourceGenerationId)).size, 33);
  assert.deepEqual(json(folder + '/asset-inventory.json').assets, assets);
  const offline = new Set(ART_FILES.map(file => file.replace(/^\.\.\//, '')));
  for (const appearance of completion.appearances) {
    assert.deepEqual(appearance.files.map(asset => asset.slot), slots);
    const definitionFile = folder + '/definitions/' + appearance.id + '.json';
    const definitionSHA256 = sha(bytes(definitionFile));
    for (const asset of appearance.files) {
      assert.equal(asset.file, 'assets/encore/crossovers/metarunner/ribbit/' + appearance.style + '/' + asset.slot + '.png');
      assert.ok(offline.has(asset.file), asset.file);
      const active = bytes(asset.file), archive = bytes(asset.archiveFile);
      assert.equal(active.length, asset.bytes);
      assert.equal(sha(active), asset.sha256);
      assert.equal(sha(archive), asset.sha256);
      assert.equal(active.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(active[25], 6, 'Native RGBA');
      const receipt = json(asset.receiptFile), job = json(asset.jobFile);
      assert.equal(receipt.appearanceId, appearance.id);
      assert.equal(receipt.slot, asset.slot);
      assert.equal(receipt.targetFile, asset.file);
      assert.equal(receipt.status, 'accepted_native');
      assert.equal(receipt.method, 'image_gen.imagegen');
      assert.equal(receipt.nativeCopyVerified, true);
      assert.equal(receipt.includedInRuntime, true);
      assert.equal(receipt.visualReview.status, 'accepted');
      assert.ok(receipt.visualReview.observations.length);
      assert.equal(receipt.definitionSHA256, definitionSHA256);
      assert.equal(job.definitionSHA256, definitionSHA256);
      assert.equal(asset.definitionSHA256, definitionSHA256);
      assert.equal(receipt.sha256, asset.sha256);
      for (const [key, value] of Object.entries(job)) assert.deepEqual(receipt[key], value, asset.jobFile + ' / ' + key);
      assert.ok(job.referencePaths.length);
      assert.deepEqual(receipt.portableReferences.map(reference => reference.file), job.referencePaths);
      assert.deepEqual(asset.references, receipt.portableReferences);
      for (const reference of receipt.portableReferences) {
        const content = bytes(reference.file);
        assert.equal(content.length, reference.bytes);
        assert.equal(sha(content), reference.sha256);
      }
    }
  }
});

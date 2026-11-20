import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { COSTUMES, COSTUME_ADDITIONS, FIGHTERS, STAGES, VARIANTS, equipCostume } from '../combat/data.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';
import { getFidelitySources } from '../combat/fidelity.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { emptyProfile, GAME_VERSION, validateProfile, validateReplay } from '../combat/session.mjs';

const appearanceWaves = {
  '2026-11-19': ['beachpomni', 'noirragatha', 'presidentpomni', 'noirzooble',
    'beachragatha', 'beachzooble', 'beachjax', 'sandcastlekinger'],
  '2026-11-20': ['noirpomni', 'noirjax', 'noirkinger', 'badendcaine',
    'bodyguardragatha', 'bodyguardzooble'],
};

test('additional outfits retain their owner, authored kit and saved appearance through replay and campaign round trips', () => {
  assert.equal(COSTUME_ADDITIONS.length, 14);
  assert.equal(VARIANTS.length, 51, 'historical atlas remains stable');
  for (const [date, ids] of Object.entries(appearanceWaves)) {
    assert.deepEqual(COSTUME_ADDITIONS.filter(outfit => outfit.introducedOn === date).map(outfit => outfit.id), ids,
      date + ': preserve the historical wave and identify every new appearance');
  }
  for (const outfit of COSTUME_ADDITIONS) {
    const owner = FIGHTERS.find(f => f.id === outfit.fighterId);
    const other = FIGHTERS.find(f => f.id !== outfit.fighterId);
    assert.ok(owner);
    assert.equal(COSTUMES.filter(v => v.id === outfit.id).length, 1);
    const dressed = equipCostume(owner, outfit.id);
    assert.equal(dressed.costume, outfit.id);
    assert.equal(dressed.moves, owner.moves);
    assert.equal(dressed.combat, owner.combat);
    assert.deepEqual(dressed.visual, owner.visual);
    assert.equal(equipCostume(other, outfit.id), other);
    const program = createProgram('story', owner.id, FIGHTERS, STAGES, { variantId: outfit.id, seed: 7 });
    assert.equal(validateProgram(JSON.parse(JSON.stringify(program))).variantId, outfit.id);
    assert.equal(validateProfile({ ...emptyProfile(), program }).program.variantId, outfit.id);
    assert.throws(() => createProgram('story', other.id, FIGHTERS, STAGES, { variantId: outfit.id }));
    const config = { fighters: [owner.id, other.id], variants: [outfit.id, ''], stage: STAGES[0].id,
      cpu: [false, true], difficulty: 'normal', seed: 7, roundTime: 90, roundsToWin: 1 };
    const replay = { format: 'circus-encore-replay', version: GAME_VERSION, config, runs: [[1, 0, 0]] };
    const validate = value => validateReplay(value, FIGHTERS.map(f => f.id), STAGES.map(s => s.id));
    assert.equal(validate(replay).config.variants[0], outfit.id);
    assert.throws(() => validate({ ...replay, config: { ...config, variants: ['', outfit.id] } }));
    const sources = getFidelitySources(outfit.fidelity.sourceIds);
    assert.equal(sources.length, outfit.fidelity.sourceIds.length);
    for (const source of sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      if (source.kind.startsWith('Épisode')) {
        assert.equal(url.hostname, 'www.youtube.com');
        assert.equal(url.pathname, '/watch');
        assert.ok(url.searchParams.get('v'), 'episode sources identify the official video');
      } else {
        assert.equal(source.kind, 'Produit dérivé officiel');
        assert.equal(url.hostname, 'glitchproductions.store');
        assert.ok(url.pathname.startsWith('/products/'));
      }
    }
  }
});

test('each additional outfit ships all eleven independent native-alpha PNG drawings in the offline pack', () => {
  const files = new Set(ART_FILES), signatures = new Set();
  for (const outfit of COSTUME_ADDITIONS) {
    for (const slot of ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']) {
      const file = ['selection', 'stance'].includes(slot)
        ? '../assets/encore/' + slot + '/' + outfit.id + '.png'
        : '../assets/encore/poses/' + outfit.id + '/' + slot + '.png';
      assert.ok(files.has(file), outfit.id + '/' + slot + ': offline publication');
      const bytes = readFileSync(new URL('../combat/' + file, import.meta.url));
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
      assert.equal(bytes[25], 6, file + ': native RGBA');
      assert.ok(bytes.readUInt32BE(16) >= 768 && bytes.readUInt32BE(20) >= 768, file + ': complete native dimensions');
      signatures.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(signatures.size, 154, 'each slot in both active dated waves has its own drawing');
});

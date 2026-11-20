import test from 'node:test';
import assert from 'node:assert/strict';
import { closeSync, fstatSync, openSync, readSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ART_FILES } from '../combat/offline-manifest.mjs';
import { COSTUMES, COSTUME_ADDITIONS, CROSSOVER_COSTUMES, FIGHTERS, STAGES, VARIANTS, equipCostume } from '../combat/data.mjs';
import { CROSSOVER_FUSIONS } from '../combat/crossover-fusions.mjs';
import { NPC_CROSSOVER_DEFINITIONS } from '../combat/crossover-npc-additions.mjs';
import { CROSSOVER_SERIES, createCrossoverCostumes, crossoverStylesFor, matchesCostumeFilter } from '../combat/crossovers.mjs';
import { updateCrossoverTracker } from '../scripts/combat-crossover-tracker.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { GAME_VERSION, emptyProfile, validateProfile, validateReplay } from '../combat/session.mjs';

test('the fourteen complete crossover wardrobes and the explicitly reviewed NPC groups coexist', () => {
  const illustrated = FIGHTERS.filter(fighter => CROSSOVER_SERIES.every(series => CROSSOVER_FUSIONS[series.id]?.[fighter.id]));
  const pending = FIGHTERS.filter(fighter => !illustrated.includes(fighter));
  assert.equal(illustrated.length, 14);
  assert.equal(pending.length, 40);
  assert.equal(CROSSOVER_SERIES.length, 9);
  const fusions = Object.values(CROSSOVER_FUSIONS).reduce((sum, roster) => sum + Object.keys(roster).length, 0);
  assert.equal(fusions, CROSSOVER_SERIES.length * illustrated.length);
  for (const series of CROSSOVER_SERIES) {
    const roster = CROSSOVER_FUSIONS[series.id];
    assert.deepEqual(Object.keys(roster).sort(), illustrated.map(fighter => fighter.id).sort());
    assert.equal(new Set(Object.values(roster)).size, illustrated.length);
  }
  assert.equal(new Set(COSTUMES.map(item => item.id)).size, 303 + fusions + COSTUME_ADDITIONS.length + NPC_CROSSOVER_DEFINITIONS.length);
  assert.equal(VARIANTS.length, 51);
  assert.equal(CROSSOVER_COSTUMES.length, 252 + fusions + NPC_CROSSOVER_DEFINITIONS.length);
  for (const fighter of illustrated) {
    for (const { id } of CROSSOVER_SERIES) {
      const choices = CROSSOVER_COSTUMES.filter(item => item.fighterId === fighter.id && matchesCostumeFilter(item, id));
      assert.deepEqual(choices.map(item => item.crossover.style).sort(), ['fusion', 'hommage', 'resident']);
      for (const item of choices) {
        assert.ok(item.name && !item.name.includes('undefined'));
        assert.ok(matchesCostumeFilter(item, id, item.crossover.style));
        assert.equal(item.sprite.src, `../assets/encore/crossovers/${id}/${fighter.id}/${item.crossover.style}/stance.webp`);
        const equipped = equipCostume(fighter, item.id);
        assert.equal(equipped.costume, item.id);
        assert.equal(equipped.moves, fighter.moves);
        assert.equal(equipped.combat, fighter.combat);
        assert.deepEqual(equipped.visual, fighter.visual);
      }
    }
  }
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, 'circus')).length, 51 + COSTUME_ADDITIONS.length);
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, '', 'resident')).length, 126 + NPC_CROSSOVER_DEFINITIONS.filter(item => item.style === 'resident').length);
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, '', 'fusion')).length, fusions + NPC_CROSSOVER_DEFINITIONS.filter(item => item.style === 'fusion').length);
  assert.ok(crossoverStylesFor('', 'pomni').includes('fusion'));
  assert.deepEqual(crossoverStylesFor('circus', 'pomni'), []);
  assert.deepEqual(crossoverStylesFor('murderdrones', 'unknown-fighter'), []);
  for (const fighter of pending) {
    const reviewed = NPC_CROSSOVER_DEFINITIONS.filter(entry => entry.fighterId === fighter.id);
    assert.deepEqual(CROSSOVER_COSTUMES.filter(costume => costume.fighterId === fighter.id).map(item => item.id), reviewed.map(item => item.id), fighter.id);
    assert.deepEqual(crossoverStylesFor('', fighter.id).sort(), [...new Set(reviewed.map(item => item.style))].sort(), fighter.id);
    for (const series of CROSSOVER_SERIES) {
      assert.deepEqual(crossoverStylesFor(series.id, fighter.id).sort(), reviewed.filter(entry => entry.series === series.id).map(item => item.style).sort(), fighter.id + '/' + series.id);
    }
  }
});

test('the published Murder Drones Ribbit group retains its historical positions and all 468 earlier wardrobe entries', () => {
  const baselineBytes = readFileSync(new URL('../docs/art-generation/npc-crossovers-next-wave-20261120/integration-baseline.json', import.meta.url));
  const sha = value => createHash('sha256').update(value).digest('hex');
  assert.equal(sha(baselineBytes), '1bea46363a8b121b71db75eb2da67f21b7db55254bc85eda5d242bb15e23acbf');
  const baseline = JSON.parse(baselineBytes);
  assert.deepEqual(COSTUMES.slice(0, 468).map(item => item.id), baseline.costumeIds);
  assert.equal(sha(JSON.stringify(COSTUMES.slice(0, 468))), baseline.costumesSHA256);
  assert.deepEqual(CROSSOVER_COSTUMES.slice(0, 378).map(item => item.id), baseline.crossoverIds);
  assert.deepEqual(createCrossoverCostumes(FIGHTERS), CROSSOVER_COSTUMES);
  const ids = ['hommage','resident','fusion'].map(style => 'glitch-murderdrones-ribbit-' + style);
  assert.deepEqual(NPC_CROSSOVER_DEFINITIONS.slice(0, 3).map(item => item.id), ids);
  assert.deepEqual(CROSSOVER_COSTUMES.slice(378, 381).map(item => item.id), ids);
  assert.deepEqual(COSTUMES.slice(469, 472).map(item => item.id), ids);
  const owner = FIGHTERS.find(item => item.id === 'ribbit');
  for (const costume of CROSSOVER_COSTUMES.slice(378, 381)) {
    assert.equal(costume.fighterId, 'ribbit');
    assert.equal(costume.crossover.series, 'murderdrones');
    assert.equal(costume.canonicalCostumeClaim, false);
    assert.match(costume.sprite.src, /\/stance\.png$/);
    const equipped = equipCostume(owner, costume.id);
    assert.equal(equipped.costume, costume.id);
    assert.equal(equipped.moves, owner.moves);
    assert.equal(equipped.combat, owner.combat);
    assert.deepEqual(equipped.visual, owner.visual);
  }
  for (const series of CROSSOVER_SERIES.filter(item => item.id !== 'murderdrones')) {
    const reviewed = NPC_CROSSOVER_DEFINITIONS.filter(item => item.fighterId === 'ribbit' && item.series === series.id);
    assert.deepEqual(crossoverStylesFor(series.id, 'ribbit').sort(), reviewed.map(item => item.style).sort());
  }
});

test('replays, profiles and campaign checkpoints retain historical and NPC crossovers only for their owner', () => {
  const choices = ['resident', 'fusion'].map(style => CROSSOVER_COSTUMES.find(item => item.fighterId === 'pomni' && item.crossover.style === style));
  choices.push(...CROSSOVER_COSTUMES.filter(item => item.fighterId === 'ribbit'));
  for (const costume of choices) {
    const owner = costume.fighterId;
    const variantId = costume.id;
    const program = createProgram('story', owner, FIGHTERS, STAGES, { seed: 41, variantId });
    assert.equal(validateProgram(JSON.parse(JSON.stringify(program))).variantId, variantId);
    assert.equal(validateProfile({ ...emptyProfile(), program }).program.variantId, variantId);
    assert.throws(() => createProgram('story', 'jax', FIGHTERS, STAGES, { variantId }));
    const config = { fighters: [owner, 'jax'], variants: [variantId, ''], stage: STAGES[0].id,
      cpu: [false, true], difficulty: 'normal', seed: 41, roundTime: 90, roundsToWin: 1 };
    const replay = { format: 'circus-encore-replay', version: GAME_VERSION, config, runs: [[1, 0, 0]] };
    const check = value => validateReplay(value, FIGHTERS.map(f => f.id), STAGES.map(stage => stage.id));
    assert.equal(check(replay).config.variants[0], variantId);
    assert.throws(() => check({ ...replay, config: { ...config, variants: ['', variantId] } }));
  }
});

test('the production tracker counts individual published poses and preserves notes across an update', () => {
  const costume = CROSSOVER_COSTUMES.find(item => item.crossover.style === 'fusion');
  const file = pose => costume.sprite.crossoverDirectory + '/' + pose + '.webp';
  const content = { FIGHTERS, VARIANTS, COSTUMES: [costume], STAGES: [] };
  const data = {
    production: [], stages: [], scenarios: [], sources: [], features: [],
    counts: {}, illustratedAssets: {selection: 0, stance: 0},
  };
  updateCrossoverTracker(data, { ART_FILES: [file('selection')] }, content);
  assert.equal(data.production.length, 0);
  updateCrossoverTracker(data, { ART_FILES: ['selection', 'stance', 'walk'].map(file) }, content);
  const row = data.production[0];
  assert.equal(row[4], 'Partiel');
  assert.match(row[7], /3 dessins individuels/);
  assert.match(row[8], /attaque/);
  assert.doesNotMatch(row[8], /marche/);
  assert.equal(data.crossoverArt.costumeDrawings, 3);
  row[row.length - 1] = 'Repère de relecture';
  const poses = ['selection','stance','attack','victory','intro','walk','jump','crouch','hit','defeat'];
  updateCrossoverTracker(data, { ART_FILES: poses.map(file) }, content);
  assert.equal(data.production.length, 1);
  assert.equal(row[4], 'Implémenté');
  assert.equal(row.at(-1), 'Repère de relecture');
  assert.equal(data.crossoverArt.costumeDrawings, 10);
});

test('historical crossover views remain WebP and new NPC families publish all eleven native PNG slots', () => {
  const filenames = new Set(ART_FILES);
  const states = ['selection', 'stance', 'attack', 'victory', 'intro', 'walk', 'jump', 'crouch', 'hit', 'defeat'];
  for (const costume of CROSSOVER_COSTUMES) {
    const native = NPC_CROSSOVER_DEFINITIONS.some(entry => entry.id === costume.id);
    const extension = native ? '.png' : '.webp';
    for (const state of native ? [...states, 'heavy'] : states) {
      const file = costume.sprite.crossoverDirectory + '/' + state + extension;
      assert.ok(filenames.has(file), costume.id + '/' + state);
      if (native) {
        const bytes = readFileSync(new URL('../combat/' + file, import.meta.url));
        assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
        assert.equal(bytes.toString('ascii', 12, 16), 'IHDR', file);
        assert.ok(bytes.readUInt32BE(16) >= 768 && bytes.readUInt32BE(20) >= 768, file);
        assert.equal(bytes[25], 6, 'RGBA ' + file);
        assert.equal(bytes.toString('ascii', bytes.length - 8, bytes.length - 4), 'IEND', file);
      }
    }
  }
  const header = Buffer.alloc(12);
  for (const filename of ART_FILES.filter(name => name.includes('/crossovers/') && name.endsWith('.webp'))) {
    const fd = openSync(new URL('../combat/' + filename, import.meta.url), 'r');
    try {
      assert.equal(readSync(fd, header, 0, header.length, 0), header.length, filename);
      assert.equal(header.toString('ascii', 0, 4), 'RIFF', filename);
      assert.equal(header.toString('ascii', 8, 12), 'WEBP', filename);
      assert.equal(header.readUInt32LE(4) + 8, fstatSync(fd).size, filename);
    } finally {
      closeSync(fd);
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { COSTUMES, CROSSOVER_COSTUMES, FIGHTERS, STAGES, VARIANTS, equipCostume } from '../combat/data.mjs';
import { CROSSOVER_FUSIONS } from '../combat/crossover-fusions.mjs';
import { CROSSOVER_SERIES, crossoverStylesFor, matchesCostumeFilter } from '../combat/crossovers.mjs';
import { updateCrossoverTracker } from '../scripts/combat-crossover-tracker.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { GAME_VERSION, emptyProfile, validateProfile, validateReplay } from '../combat/session.mjs';

test('every fighter has both legacy styles in nine series and an original Copper 9 fusion', () => {
  assert.equal(CROSSOVER_SERIES.length, 9);
  const fusions = Object.values(CROSSOVER_FUSIONS).reduce((sum, roster) => sum + Object.keys(roster).length, 0);
  assert.equal(Object.keys(CROSSOVER_FUSIONS.murderdrones).length, FIGHTERS.length);
  assert.equal(new Set(COSTUMES.map(item => item.id)).size, 303 + fusions);
  assert.equal(VARIANTS.length, 51);
  assert.equal(CROSSOVER_COSTUMES.length, 252 + fusions);
  for (const fighter of FIGHTERS) {
    for (const { id } of CROSSOVER_SERIES) {
      const choices = CROSSOVER_COSTUMES.filter(item => item.fighterId === fighter.id && matchesCostumeFilter(item, id));
      assert.deepEqual(choices.map(item => item.crossover.style).sort(), (CROSSOVER_FUSIONS[id]?.[fighter.id] ? ['fusion', 'hommage', 'resident'] : ['hommage', 'resident']));
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
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, 'circus')).length, 51);
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, '', 'resident')).length, 126);
  assert.equal(COSTUMES.filter(item => matchesCostumeFilter(item, '', 'fusion')).length, fusions);
  assert.ok(crossoverStylesFor('', 'pomni').includes('fusion'));
  assert.deepEqual(crossoverStylesFor('circus', 'pomni'), []);
  assert.deepEqual(crossoverStylesFor('murderdrones', 'unknown-fighter'), ['hommage', 'resident']);
});

test('replays, profiles and campaign checkpoints retain the crossover only for its owner', () => {
  for (const style of ['resident', 'fusion']) {
    const costume = CROSSOVER_COSTUMES.find(item => item.fighterId === 'pomni' && item.crossover.style === style);
    const variantId = costume.id;
    const program = createProgram('story', 'pomni', FIGHTERS, STAGES, { seed: 41, variantId });
    assert.equal(validateProgram(JSON.parse(JSON.stringify(program))).variantId, variantId);
    assert.equal(validateProfile({ ...emptyProfile(), program }).program.variantId, variantId);
    assert.throws(() => createProgram('story', 'jax', FIGHTERS, STAGES, { variantId }));
    const config = { fighters: ['pomni', 'jax'], variants: [variantId, ''], stage: STAGES[0].id,
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

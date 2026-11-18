import test from 'node:test';
import assert from 'node:assert/strict';
import { COSTUMES, CROSSOVER_COSTUMES, FIGHTERS, STAGES, VARIANTS, equipCostume } from '../combat/data.mjs';
import { CROSSOVER_SERIES, CROSSOVER_STYLES, matchesCostumeFilter } from '../combat/crossovers.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { GAME_VERSION, emptyProfile, validateProfile, validateReplay } from '../combat/session.mjs';

test('each fighter has two distinct costumes in each of the nine series alongside the original wardrobe', () => {
  assert.equal(CROSSOVER_SERIES.length, 9);
  assert.equal(new Set(COSTUMES.map(item => item.id)).size, 303);
  assert.equal(VARIANTS.length, 51);
  assert.equal(CROSSOVER_COSTUMES.length, 252);
  for (const fighter of FIGHTERS) {
    for (const { id } of CROSSOVER_SERIES) {
      const choices = CROSSOVER_COSTUMES.filter(item => item.fighterId === fighter.id && matchesCostumeFilter(item, id));
      assert.deepEqual(choices.map(item => item.crossover.style).sort(), Object.keys(CROSSOVER_STYLES).sort());
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
});

test('replays, profiles and campaign checkpoints retain the crossover only for its owner', () => {
  const costume = CROSSOVER_COSTUMES.find(item => item.fighterId === 'pomni' && item.crossover.style === 'resident');
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
});

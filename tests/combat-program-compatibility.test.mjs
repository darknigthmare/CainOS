import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { createProgram, validateProgram, programTournamentRival, recordProgramResult, retryProgram, PROGRAM_MODES } from '../combat/progression.mjs';
import { emptyProfile, validateProfile } from '../combat/session.mjs';

const { fixtures } = JSON.parse(readFileSync(new URL('./fixtures/combat-program-v1-catalogs.json', import.meta.url), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));

for (const catalog of new Set(fixtures.map(item => item.catalog))) {
  test(`version-one ${catalog} checkpoints keep their route, results and tournament rules`, () => {
    for (const item of fixtures.filter(entry => entry.catalog === catalog)) {
      for (const key of ['start','firstWin','secondWin','defeat','completion']) {
        const restored = validateProgram(clone(item[key]));
        assert.deepEqual(restored, item[key], item.mode + '/' + key);
        const profile = validateProfile({ ...emptyProfile(), program: clone(item[key]) });
        assert.deepEqual(profile.program, item[key].status === 'active' ? item[key] : null, item.mode + '/' + key + '/profile');
      }
      const next = recordProgramResult(clone(item.firstWin), { won:true, health:6532 });
      assert.deepEqual(next, item.secondWin, item.mode + ': continuing uses the old draw');
      assert.deepEqual(retryProgram(clone(item.defeat)), item.retry, item.mode + ': retry preserves the old catalog');
      let run = clone(item.start);
      while (run.status === 'active') run = recordProgramResult(clone(run), { won:true, health:6532 });
      assert.deepEqual(run, item.completion, item.mode + ': completion keeps historical simulation');
    }
  });
}

test('tournament presentation promises a rival only for authored rules, even when legacy draws contain that rival', () => {
  for (const item of fixtures.filter(entry => entry.mode === 'tournament')) {
    const expected = item.catalog === 'main-54-fighters-12-arenas' ? 'jax' : null;
    assert.ok(item.start.tournament.participants.includes('jax'), 'the fixture distinguishes a guaranteed rival from mere participation');
    for (const key of ['start', 'firstWin', 'secondWin', 'defeat', 'completion', 'retry']) {
      const saved = clone(item[key]);
      assert.equal(programTournamentRival(saved), expected, item.catalog + '/' + key + '/JSON');
      const restored = validateProgram(saved);
      assert.equal(programTournamentRival(restored), expected, item.catalog + '/' + key + '/restored');
      assert.deepEqual(restored, saved, 'presentation must not change the checkpoint');
    }
  }
  assert.equal(programTournamentRival(createProgram('arcade', 'pomni')), null);
  assert.equal(programTournamentRival(null), null);
  assert.equal(programTournamentRival({ mode: 'tournament', tournament: { participants: ['pomni', 'jax'] } }), null);
});

test('dedicated stages start and resume each programme without adding all arrangements to the random pool', () => {
  for (const mode of PROGRAM_MODES) {
    const start = createProgram(mode, 'max', FIGHTERS, STAGES, {seed:20261119,stage:'home-max'});
    assert.deepEqual(validateProgram(clone(start)), start, mode);
    if (mode !== 'story') {
      assert.equal(start.initialStage, 'home-max');
      assert.equal(start.stages[0], 'home-max');
      assert.ok(start.stages.every(id => id === 'home-max' || STAGES.some(stage => stage.id === id)));
    }
    const afterWin = recordProgramResult(start, {won:true,health:7312});
    assert.deepEqual(validateProfile({...emptyProfile(),program:clone(afterWin)}).program, afterWin);
  }
  assert.throws(() => createProgram('arcade','max',FIGHTERS,STAGES,{stage:'home-unknown'}));
  assert.throws(() => createProgram('arcade','max',FIGHTERS,[STAGES[0]],{stage:'home-max'}), /Arène/);
});

test('historical catalog recovery still rejects tampered seeds, opponents and bracket outcomes', () => {
  for (const item of fixtures) {
    const altered = clone(item.firstWin);
    altered.opponents[0] = 'unknown-fighter';
    assert.throws(() => validateProgram(altered), item.catalog + '/' + item.mode);
    const wrongSeed = clone(item.firstWin);
    wrongSeed.seed = 100;
    if (item.mode !== 'story') assert.throws(() => validateProgram(wrongSeed), item.catalog + '/' + item.mode + '/seed');
    if (item.mode === 'tournament') {
      const bracket = clone(item.firstWin);
      const match = bracket.tournament.rounds[0].matches.find(entry => entry.method === 'simulated');
      match.winner = match.winner === match.a ? match.b : match.a;
      assert.throws(() => validateProgram(bracket), item.catalog + '/CPU result');
    }
  }
});

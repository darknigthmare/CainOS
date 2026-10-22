import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, STAGES, VARIANTS } from '../combat/data.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { STORY_NOTICE, STORY_ROUTES, getStoryRoute, getStoryScene, getStoryEnding } from '../combat/stories.mjs';
import {
  PROGRAM_KEY, PROGRAM_MODES, SURVIVAL_RECOVERY,
  createProgram, programEncounter, recordProgramResult, validateProgram,
  retryProgram, readProgram, saveProgram,
} from '../combat/progression.mjs';

const fighterIds = FIGHTERS.map(f => f.id), stageIds = STAGES.map(s => s.id);
const clone = value => JSON.parse(JSON.stringify(value));
const make = (mode, fighter = 'pomni', options = {}) => createProgram(mode, fighter, FIGHTERS, STAGES, { seed: 20261022, ...options });
const win = (run, health = 7000) => recordProgramResult(run, { won: true, health });
const lose = (run, health = 0) => recordProgramResult(run, { won: false, health });
const allMatches = run => run.tournament.rounds.flatMap(round => round.matches);
const memoryStorage = () => {
  const records = new Map();
  return { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) };
};

test('the complete roster has fourteen individually authored four-scene routes with playable references', () => {
  assert.match(STORY_NOTICE, /originaux.*fan-game/);
  assert.deepEqual(Object.keys(STORY_ROUTES).sort(), [...fighterIds].sort());
  const intros = new Set(), endings = new Set(), summaries = new Set(), exchanges = new Set();
  for (const fighter of FIGHTERS) {
    const route = getStoryRoute(fighter.id);
    assert.equal(route.fighterId, fighter.id);
    assert.ok(route.title && route.intro && route.ending);
    assert.equal(route.chapters.length, 4);
    intros.add(route.intro); endings.add(route.ending);
    for (let index = 0; index < 4; index++) {
      const scene = getStoryScene(fighter.id, index);
      assert.equal(scene, route.chapters[index]);
      assert.ok(fighterIds.includes(scene.opponentId), `${fighter.id}: unknown opponent`);
      assert.ok(stageIds.includes(scene.stageId), `${fighter.id}: unknown stage`);
      assert.notEqual(scene.opponentId, fighter.id);
      assert.ok(scene.title && scene.summary);
      assert.equal(scene.dialogue.length, 2);
      assert.ok(scene.dialogue.every(line => typeof line.speaker === 'string' && line.speaker && typeof line.text === 'string' && line.text));
      summaries.add(scene.summary); exchanges.add(scene.dialogue.map(line => line.text).join('\n'));
    }
    assert.equal(getStoryEnding(fighter.id), route.ending);
  }
  assert.equal(intros.size, 14);
  assert.equal(endings.size, 14);
  assert.equal(summaries.size, 56);
  assert.equal(exchanges.size, 56);
});

test('story helpers reject absent/prototype IDs and protect shared authored text', () => {
  for (const id of ['missing', '__proto__', 'constructor', 'toString', null]) {
    assert.equal(getStoryRoute(id), null);
    assert.equal(getStoryScene(id, 0), null);
    assert.equal(getStoryEnding(id), '');
  }
  for (const index of [-1, 4, 1000, .5, '0', null]) assert.equal(getStoryScene('pomni', index), null);
  const scene = getStoryScene('pomni', 0);
  assert.throws(() => { scene.opponentId = 'missing'; }, TypeError);
  assert.throws(() => { scene.dialogue[0].text = 'replacement'; }, TypeError);
  assert.match(getStoryRoute('abstractedkaufmo').intro, /construction d’archive/);
  assert.match(getStoryEnding('abstractedkaufmo'), /sans révélation/);
});

test('all fourteen story routes finish through four actual player results and preserve their authored stage order', () => {
  for (const fighter of FIGHTERS) {
    const route = getStoryRoute(fighter.id);
    let run = make('story', fighter.id, { stage: 'void' });
    assert.deepEqual(run.opponents, route.chapters.map(scene => scene.opponentId));
    assert.deepEqual(run.stages, route.chapters.map(scene => scene.stageId));
    for (let index = 0; index < 4; index++) {
      const encounter = programEncounter(run);
      assert.equal(encounter.opponentId, route.chapters[index].opponentId);
      assert.equal(encounter.stageId, route.chapters[index].stageId);
      assert.equal(encounter.number, index + 1);
      assert.equal(encounter.total, 4);
      run = validateProgram(clone(win(run, 4300)));
    }
    assert.equal(run.status, 'complete');
    assert.equal(run.results.length, 4);
    assert.equal(programEncounter(run), null);
    assert.throws(() => win(run), /terminé/);
  }
});

test('arcade, boss rush and survival retain their six, four and ten encounter objectives', () => {
  const lengths = { arcade: 6, boss: 4, survival: 10 };
  for (const [mode, length] of Object.entries(lengths)) {
    const original = make(mode, 'jax', { stage: 'manor', difficulty: 'hard', roundTime: 120 });
    assert.equal(original.opponents.length, length);
    assert.equal(original.stages.length, length);
    assert.equal(original.stages[0], 'manor');
    assert.ok(original.opponents.every(id => fighterIds.includes(id)));
    assert.ok(original.stages.every(id => stageIds.includes(id)));
    let run = original;
    for (let i = 0; i < length; i++) {
      assert.equal(run.index, i);
      assert.equal(run.status, 'active');
      run = win(run, 6100);
    }
    assert.equal(run.status, 'complete');
    assert.equal(run.index, length);
    assert.equal(run.results.length, length);
    assert.equal(original.results.length, 0, 'recording does not mutate a result screen’s existing run');
    assert.equal(original.index, 0);
    assert.equal(run.difficulty, 'hard');
    assert.equal(run.roundTime, 120);
    assert.equal(programEncounter(run), null);
  }
  assert.equal(make('arcade').opponents.at(-1), 'caine');
  assert.deepEqual(make('boss').opponents, ['gloinkqueen', 'fudge', 'abstractedkaufmo', 'caine']);
  assert.ok(make('survival').opponents.every(id => id !== 'pomni'));
});

test('survival carries bounded integer health, adds the stated recovery and preserves the next encounter checkpoint', () => {
  const start = make('survival');
  const next = win(start, 3274.6);
  assert.equal(next.results[0].health, 3275);
  assert.equal(next.health, 3275 + SURVIVAL_RECOVERY);
  assert.deepEqual(programEncounter(next).initialHealth, [4475, 10000]);
  assert.notEqual(programEncounter(start).seed, programEncounter(next).seed);
  assert.equal(win(next, 9999).health, 10000);
  assert.equal(win(start, .01).health, 1201);
  assert.equal(start.health, 10000);
  const defeated = lose(next, 200); // Timeout loss may leave nonzero HP.
  assert.equal(defeated.status, 'eliminated');
  assert.equal(defeated.health, next.health, 'a checkpoint contains starting HP, not losing HP');
  assert.equal(defeated.index, 1);
  assert.equal(programEncounter(defeated), null);
});

test('seeded draws repeat exactly, distinguish seeds and accept unsigned seed boundaries', () => {
  for (const seed of [0, 1, 20261022, 4294967295]) for (const mode of PROGRAM_MODES) {
    const left = make(mode, 'pomni', { seed }), right = make(mode, 'pomni', { seed });
    assert.deepEqual(left, right);
    assert.deepEqual(validateProgram(clone(left)), left);
    const encounter = programEncounter(left);
    assert.ok(Number.isInteger(encounter.seed) && encounter.seed >= 0 && encounter.seed <= 4294967295);
  }
  const draws = new Set(Array.from({ length: 12 }, (_, seed) => JSON.stringify(make('tournament', 'pomni', { seed }).tournament.participants)));
  assert.ok(draws.size >= 10, 'a new seed meaningfully varies the bracket');
});

test('tournaments draw eight unique participants across every player slot, regardless of selected artist', () => {
  const occupiedSlots = new Set();
  for (const fighterId of fighterIds) for (let seed = 0; seed < 64; seed++) {
    const run = make('tournament', fighterId, { seed });
    const { participants, rounds, champion } = run.tournament;
    assert.equal(new Set(participants).size, 8);
    assert.ok(participants.every(id => fighterIds.includes(id)));
    assert.equal(participants.filter(id => id === fighterId).length, 1);
    occupiedSlots.add(participants.indexOf(fighterId));
    assert.deepEqual(rounds.map(round => round.matches.length), [4, 2, 1]);
    assert.equal(champion, null);
    assert.equal(allMatches(run).filter(match => match.method === 'simulated').length, 3);
    assert.equal(allMatches(run).filter(match => match.method === 'played').length, 0);
    assert.equal(run.opponents.length, 3);
    assert.equal(run.opponents[1], null);
    assert.equal(run.opponents[2], null);
    assert.notEqual(programEncounter(run).opponentId, fighterId);
  }
  assert.equal(occupiedSlots.size, 8, 'the player is not fixed to the first quarter-final');
});

test('a tournament requires three real victories and propagates winners through all seven matches', () => {
  const initial = make('tournament', 'kinger');
  let run = initial;
  const defeated = [];
  for (let round = 0; round < 3; round++) {
    const before = clone(run), encounter = programEncounter(run);
    assert.equal(encounter.number, round + 1);
    assert.equal(encounter.total, 3);
    assert.equal(encounter.opponentId, run.opponents[round]);
    assert.deepEqual(encounter.initialHealth, [10000, 10000]);
    defeated.push(encounter.opponentId);
    run = win(run, 4710);
    assert.deepEqual(initial.results, []);
    assert.equal(before.status, 'active');
    assert.equal(allMatches(run).filter(match => match.method === 'played').length, round + 1);
    assert.equal(run.status, round === 2 ? 'complete' : 'active');
    assert.deepEqual(validateProgram(clone(run)), run);
  }
  assert.equal(new Set(defeated).size, 3);
  assert.equal(run.tournament.champion, 'kinger');
  assert.equal(allMatches(run).filter(match => match.method === 'played').length, 3);
  assert.equal(allMatches(run).filter(match => match.method === 'simulated').length, 4);
  assert.ok(allMatches(run).every(match => match.winner === match.a || match.winner === match.b));
  for (let round = 1; round < 3; round++) {
    run.tournament.rounds[round].matches.forEach((match, index) => {
      assert.equal(match.a, run.tournament.rounds[round - 1].matches[index * 2].winner);
      assert.equal(match.b, run.tournament.rounds[round - 1].matches[index * 2 + 1].winner);
    });
  }
  assert.equal(programEncounter(run), null);
  assert.throws(() => win(run), /terminé/);
});

test('a loss in any tournament round eliminates the player and labels every remaining CPU result as simulated', () => {
  for (let lossRound = 0; lossRound < 3; lossRound++) {
    let run = make('tournament', 'gangle', { seed: lossRound + 17 });
    for (let wonRound = 0; wonRound < lossRound; wonRound++) run = win(run);
    const rival = programEncounter(run).opponentId;
    const eliminated = lose(run, 1900);
    assert.equal(eliminated.status, 'eliminated');
    assert.equal(eliminated.index, lossRound);
    assert.equal(eliminated.results.length, lossRound + 1);
    assert.notEqual(eliminated.tournament.champion, eliminated.playerId);
    assert.ok(fighterIds.includes(eliminated.tournament.champion));
    const lostMatch = eliminated.tournament.rounds[lossRound].matches.find(match => match.a === 'gangle' || match.b === 'gangle');
    assert.equal(lostMatch.winner, rival);
    assert.equal(lostMatch.method, 'played');
    assert.equal(allMatches(eliminated).filter(match => match.method === 'played').length, lossRound + 1);
    assert.equal(allMatches(eliminated).filter(match => match.method === 'simulated').length, 6 - lossRound);
    assert.ok(allMatches(eliminated).every(match => match.winner === match.a || match.winner === match.b));
    assert.equal(programEncounter(eliminated), null);
    assert.deepEqual(validateProgram(clone(eliminated)), eliminated);
    assert.throws(() => win(eliminated), /terminé/);
    assert.equal(run.status, 'active', 'the old match result can still be rendered');
  }
});

test('CPU bracket simulations and future opponents are deterministic across save/reload at every round', () => {
  for (const playerId of fighterIds) {
    let uninterrupted = make('tournament', playerId, { seed: 4294967295 });
    let reloaded = clone(uninterrupted);
    for (const result of [{ won: true, health: 7890 }, { won: true, health: 3030 }, { won: false, health: 0 }]) {
      uninterrupted = recordProgramResult(uninterrupted, result);
      reloaded = recordProgramResult(validateProgram(clone(reloaded)), result);
      assert.deepEqual(reloaded, uninterrupted);
    }
  }
});

test('checkpoints save and resume every programme with the same costume, rules, encounter seed and starting health', () => {
  const variant = VARIANTS.find(item => item.baseFighterId === 'pomni' || item.fighterId === 'pomni');
  assert.ok(variant, 'the roster includes an approved Pomni costume');
  const storage = memoryStorage();
  assert.equal(readProgram(storage), null);
  for (const mode of PROGRAM_MODES) {
    let run = make(mode, 'pomni', { seed: 0, variantId: variant.id, difficulty: 'hard', roundTime: 120, stage: 'void' });
    run = win(run, 2600);
    assert.equal(saveProgram(storage, run), true);
    const resumed = readProgram(storage);
    assert.deepEqual(resumed, run);
    assert.deepEqual(programEncounter(resumed), programEncounter(run));
    assert.equal(resumed.variantId, variant.id);
    assert.equal(resumed.difficulty, 'hard');
    assert.equal(resumed.roundTime, 120);
    resumed.results[0].health = 1;
    assert.equal(readProgram(storage).results[0].health, 2600, 'read records are independent');
  }
  assert.equal(saveProgram(storage, null), true);
  assert.equal(readProgram(storage), null);
});

test('resumed survival checkpoints restart the real CQC engine reproducibly, with carried health', () => {
  const checkpoint = win(make('survival', 'ragatha', { seed: 41, difficulty: 'hard' }), 5211);
  const makeEngine = run => {
    const encounter = programEncounter(run);
    const engine = new CombatEngine({
      fighters: [run.playerId, encounter.opponentId].map(id => FIGHTERS.find(f => f.id === id)),
      stage: STAGES.find(stage => stage.id === encounter.stageId), cpu: [false, true],
      difficulty: run.difficulty, roundTime: run.roundTime, roundsToWin: 1, seed: encounter.seed,
    });
    engine.state.fighters.forEach((fighter, index) => { fighter.life = encounter.initialHealth[index]; });
    return engine;
  };
  const beforeReload = makeEngine(checkpoint), resumed = makeEngine(validateProgram(clone(checkpoint)));
  assert.equal(resumed.state.fighters[0].life, 6411);
  const startingState = resumed.getSnapshot();
  for (let frame = 0; frame < 480; frame++) {
    const inputs = [{ right: frame < 160, guard: frame >= 300, slot: frame % 45 === 0 ? 'light' : null }, { slot: null }];
    beforeReload.step(FIXED_DT, inputs); resumed.step(FIXED_DT, inputs);
  }
  assert.deepEqual(resumed.getSnapshot(), beforeReload.getSnapshot());
  assert.notDeepEqual(resumed.getSnapshot(), startingState);
  assert.deepEqual(makeEngine(validateProgram(clone(checkpoint))).getSnapshot(), startingState,
    'mid-match reload deliberately returns to the encounter start, not to a fabricated mid-frame state');
});

test('retry preserves prior story/arcade/boss victories while survival and tournament begin a new attempt', () => {
  for (const mode of PROGRAM_MODES) {
    const start = make(mode, 'jax');
    const second = win(start, 2750);
    const lost = lose(second, 11);
    const retried = retryProgram(lost);
    assert.equal(retried.status, 'active');
    if (['survival', 'tournament'].includes(mode)) assert.deepEqual(retried, start);
    else {
      assert.deepEqual(retried, second);
      assert.equal(retried.index, 1);
      assert.deepEqual(programEncounter(retried), programEncounter(second));
    }
    assert.equal(lost.status, 'eliminated');
    assert.deepEqual(retryProgram(retried), retried);
  }
  let completed = make('story');
  for (let i = 0; i < 4; i++) completed = win(completed);
  assert.throws(() => retryProgram(completed), /remporté/);
});

test('untrusted import rejects malformed identity, rules, bounds, stage/opponent references and status', () => {
  const valid = win(make('survival'), 4000);
  const corruptions = [
    value => { value.format = 'other'; }, value => { value.version = 2; },
    value => { value.mode = 'versus'; }, value => { value.playerId = 'missing'; },
    value => { value.playerId = '__proto__'; }, value => { value.variantId = 'missing'; },
    value => { value.initialStage = 'missing'; }, value => { value.seed = -1; },
    value => { value.seed = 4294967296; }, value => { value.seed = .5; },
    value => { value.difficulty = 'impossible'; }, value => { value.roundTime = 0; },
    value => { value.index = -1; }, value => { value.index = 11; }, value => { value.index = .5; },
    value => { value.index = 0; }, value => { value.health = 0; }, value => { value.health = 10001; },
    value => { value.health = '5200'; }, value => { value.health = 5200.5; }, value => { value.health = 999; },
    value => { value.status = 'complete'; }, value => { value.status = 'unknown'; },
    value => { value.opponents[1] = 'missing'; }, value => { value.opponents[1] = 'pomni'; },
    value => { value.stages[0] = 'missing'; }, value => { value.stages.pop(); },
    value => { value.opponents.push('jax'); }, value => { value.tournament = {}; },
    value => { delete value.variantId; }, value => { delete value.initialStage; },
  ];
  for (const corrupt of corruptions) {
    const value = clone(valid); corrupt(value);
    assert.throws(() => validateProgram(value), corrupt.toString());
  }
  for (const value of [null, [], 'saved', 1, {}, { ...valid, health: NaN }, { ...valid, seed: Infinity }]) assert.throws(() => validateProgram(value));
  assert.deepEqual(validateProgram(valid), valid);
});

test('import cannot introduce impossible, fractional or additional results beyond a defeat or programme completion', () => {
  const active = make('survival');
  const corruptResults = [
    [{ won: 'true', health: 5000 }], [{ won: 1, health: 5000 }], [{ won: true, health: 0 }],
    [{ won: true, health: -1 }], [{ won: true, health: 10001 }], [{ won: true, health: '6000' }],
    [{ won: true, health: 5000.5 }], [{ won: true }], [null],
    [{ won: false, health: 0 }, { won: true, health: 7000 }],
    Array.from({ length: 11 }, () => ({ won: true, health: 7000 })),
  ];
  for (const results of corruptResults) assert.throws(() => validateProgram({ ...active, results }));
  for (const result of [{ won: true, health: 0 }, { won: true, health: Infinity }, { won: true, health: 10001 }, { won: 1, health: 1000 }]) {
    assert.throws(() => recordProgramResult(active, result));
  }
  const completed = [0, 1, 2, 3].reduce(run => win(run), make('story'));
  assert.throws(() => validateProgram({ ...completed, results: [...completed.results, { won: true, health: 7000 }] }));
});

test('tournament import verifies participants, round ancestry, CPU results, champion and real player outcome provenance', () => {
  const run = win(make('tournament', 'bubble', { seed: 2718 }));
  const corruptions = [
    value => { value.tournament.participants[0] = value.tournament.participants[1]; },
    value => { value.tournament.participants[0] = 'missing'; },
    value => { value.tournament.rounds[0].matches[0].id = 'final-1'; },
    value => { value.tournament.rounds[0].matches[0].a = 'missing'; },
    value => { value.tournament.rounds[0].matches[0].winner = 'missing'; },
    value => { value.tournament.rounds[0].matches[0].method = 'pending'; },
    value => {
      const simulated = allMatches(value).find(match => match.method === 'simulated');
      simulated.winner = simulated.winner === simulated.a ? simulated.b : simulated.a;
    },
    value => { allMatches(value).find(match => match.method === 'simulated').method = 'played'; },
    value => { allMatches(value).find(match => match.method === 'played').method = 'simulated'; },
    value => { value.tournament.rounds[1].matches[0].a = 'bubble'; value.tournament.rounds[1].matches[1].a = 'bubble'; },
    value => { value.tournament.rounds[2].matches[0].winner = 'bubble'; },
    value => { value.tournament.champion = 'bubble'; },
    value => { value.tournament.rounds.pop(); },
    value => { value.tournament.rounds[0].matches.push(clone(value.tournament.rounds[0].matches[0])); },
    value => { value.opponents[2] = 'caine'; },
    value => { value.results[0].won = false; },
  ];
  for (const corrupt of corruptions) {
    const value = clone(run); corrupt(value);
    assert.throws(() => validateProgram(value), corrupt.toString());
  }
  assert.deepEqual(validateProgram(clone(run)), run);
});

test('normalized imports discard unknown fields without sharing arrays or polluting object prototypes', () => {
  const source = win(make('tournament'));
  const imported = clone(source);
  imported.extra = { ignored: true };
  imported.results[0].extra = 'discarded';
  imported.tournament.extra = 'discarded';
  Object.defineProperty(imported, '__proto__', { value: { polluted: true }, enumerable: true });
  const clean = validateProgram(imported);
  assert.deepEqual(clean, source);
  assert.equal(Object.hasOwn(clean, 'extra'), false);
  assert.equal(Object.hasOwn(clean, '__proto__'), false);
  assert.equal({}.polluted, undefined);
  imported.opponents[0] = 'missing';
  imported.tournament.rounds[0].matches[0].a = 'missing';
  assert.deepEqual(clean, source);
});

test('program construction rejects invalid catalogues, unsupported modes and costumes belonging to another fighter', () => {
  const invalid = [
    () => make('unknown'), () => make('arcade', 'missing'), () => make('story', '__proto__'),
    () => make('arcade', 'pomni', { seed: -1 }), () => make('arcade', 'pomni', { difficulty: 'impossible' }),
    () => make('arcade', 'pomni', { roundTime: 300 }), () => make('arcade', 'pomni', { stage: 'missing' }),
    () => createProgram('arcade', 'pomni', [], STAGES),
    () => createProgram('arcade', 'pomni', FIGHTERS, []),
    () => createProgram('arcade', 'pomni', [FIGHTERS[0], FIGHTERS[0]], STAGES),
    () => createProgram('tournament', 'pomni', FIGHTERS.slice(0, 7), STAGES),
    () => createProgram('story', 'pomni', FIGHTERS.slice(0, 7), STAGES),
    () => createProgram('story', 'pomni', FIGHTERS, STAGES.slice(0, 1)),
  ];
  for (const action of invalid) assert.throws(action);
  const costume = VARIANTS.find(item => item.baseFighterId === 'pomni' || item.fighterId === 'pomni');
  assert.throws(() => make('arcade', 'jax', { variantId: costume.id }), /apparence/);
  assert.throws(() => make('arcade', 'pomni', { variantId: null }), /apparence/);
  assert.deepEqual(createProgram('arcade', 'pomni', fighterIds, stageIds), createProgram('arcade', 'pomni'));
});

test('missing, inaccessible, oversized or corrupt storage fails safely without resuming bad state', () => {
  const storage = memoryStorage();
  for (const raw of ['{', 'null', '{}', '[]', 'x'.repeat(65537), JSON.stringify({ ...make('tournament'), health: 0 })]) {
    storage.setItem(PROGRAM_KEY, raw);
    assert.equal(readProgram(storage), null);
  }
  const unavailable = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('full'); }, removeItem() { throw new Error('denied'); } };
  assert.equal(readProgram(unavailable), null);
  assert.equal(readProgram(null), null);
  assert.equal(saveProgram(unavailable, make('story')), false);
  assert.equal(saveProgram(unavailable, null), false);
  assert.throws(() => saveProgram(storage, { ...make('story'), index: 100 }), /corrompu/);
});

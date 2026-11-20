import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FIGHTERS, STAGES, ALL_STAGES, getStage, getReplayFighter } from '../combat/data.mjs';
import { STORY_ROUTES } from '../combat/stories.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { createProgram, validateProgram, recordProgramResult, retryProgram, PROGRAM_MODES } from '../combat/progression.mjs';
import { emptyProfile, validateProfile, validateReplay, replayInputs, replayRulesVersion } from '../combat/session.mjs';
import { FIDELITY_SOURCES } from '../combat/fidelity.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const captured = readFileSync(new URL('./fixtures/combat-pre-undermap.json', import.meta.url));
const baseline = JSON.parse(captured);
const clone = value => JSON.parse(JSON.stringify(value));

test('undermap appends one distinct documented arena after the historical 22', () => {
  assert.equal(hash(captured), '3b50be4fe6c51b3cb47babf874eeb159db1b619d87f995aa9fcbde0ca19b9a0d', 'Fixture captured before the addition must remain unchanged');
  assert.deepEqual(STAGES.slice(0, baseline.stageIds.length).map(stage => stage.id), baseline.stageIds);
  assert.equal(STAGES.filter(stage => stage.id === 'undermap').length, 1);
  const stage = getStage('undermap');
  assert.equal(stage.sourceId, 'ep2');
  assert.deepEqual([stage.width, stage.floor, stage.bounds.left, stage.bounds.right], [1280, 568, 65, 1215]);
  assert.deepEqual(stage.fidelity.sourceIds, ['ep2', 'glitch-undermap']);
  assert.match(FIDELITY_SOURCES.find(source => source.id === 'glitch-undermap').url, /0558e3b65a3146b5b04b7828da5b4d0e/);
  for (const plane of ['far', 'mid', 'near']) {
    const native = readFileSync(new URL('../docs/art-generation/stage-next-missing-20261120/native/' + plane + '.png', import.meta.url));
    const active = readFileSync(new URL('../assets/encore/stages/undermap/' + plane + '.png', import.meta.url));
    assert.deepEqual(active, native, plane + ': preserve the original generated PNG');
    assert.deepEqual([...active.subarray(0, 8)], [137,80,78,71,13,10,26,10]);
  }
});

test('all 54 authored routes and their panels retain their pre-addition content', () => {
  assert.equal(Object.keys(baseline.storyRoutes).length, 54);
  for (const [id, expected] of Object.entries(baseline.storyRoutes)) {
    assert.equal(hash(JSON.stringify(STORY_ROUTES[id])), expected.sha256, id + ': complete route changed');
    assert.deepEqual(STORY_ROUTES[id].chapters.map(chapter => ({ opponentId: chapter.opponentId, stageId: chapter.stageId })), expected.chapters);
  }
});

test('270 captured checkpoints retain their draw, profile, continuation, retry and completion', () => {
  assert.equal(baseline.fixtures.length, 45);
  for (const fixture of baseline.fixtures) {
    for (const key of ['start', 'firstWin', 'secondWin', 'defeat', 'retry', 'completion']) {
      const restored = validateProgram(clone(fixture[key]));
      assert.deepEqual(restored, fixture[key], fixture.player + '/' + fixture.mode + '/' + key);
      const profile = validateProfile({ ...emptyProfile(), program: clone(fixture[key]) });
      assert.deepEqual(profile.program, fixture[key].status === 'active' ? fixture[key] : null);
    }
    assert.deepEqual(recordProgramResult(clone(fixture.firstWin), { won: true, health: 6532 }), fixture.secondWin);
    assert.deepEqual(retryProgram(clone(fixture.defeat)), fixture.retry);
    let run = clone(fixture.start);
    while (run.status === 'active') run = recordProgramResult(clone(run), { won: true, health: 6532 });
    assert.deepEqual(run, fixture.completion, fixture.player + '/' + fixture.mode + '/completion');
  }
});

test('known previous stage catalogs do not permit arbitrary imported schedules', () => {
  for (const fixture of baseline.fixtures.filter(item => item.mode !== 'story')) {
    const corrupted = clone(fixture.firstWin);
    corrupted.stages[1] = 'home-pomni';
    if (corrupted.initialStage === 'home-pomni') corrupted.stages[1] = 'home-jax';
    assert.throws(() => validateProgram(corrupted), /reprise/);
  }
});

test('new programmes can start at undermap while authored stories stay on their route', () => {
  for (const mode of PROGRAM_MODES) {
    const run = createProgram(mode, 'pomni', FIGHTERS, STAGES, { seed: 20261120, stage: 'undermap' });
    assert.deepEqual(validateProgram(clone(run)), run);
    if (mode === 'story') assert.deepEqual(run.stages, STORY_ROUTES.pomni.chapters.map(chapter => chapter.stageId));
    else assert.equal(run.stages[0], 'undermap');
    assert.deepEqual(validateProgram(clone(recordProgramResult(run, { won: true, health: 6532 }))).stages, run.stages);
  }
  assert.ok(Array.from({ length: 32 }, (_, i) => createProgram('survival', 'pomni', FIGHTERS, STAGES, { seed: i + 1 }))
    .some(run => run.stages.includes('undermap')), 'The new arena also participates in new shuffled draws');
});

test('14 historical replay fixtures retain all 3682 captured frame fingerprints', () => {
  let frames = 0;
  for (const fixture of baseline.replays) {
    const replay = validateReplay(clone(fixture.replay), FIGHTERS.map(fighter => fighter.id), ALL_STAGES.map(stage => stage.id));
    const engine = new CombatEngine({ ...replay.config,
      fighters: replay.config.fighters.map(id => getReplayFighter(id, replay.version)),
      stage: getStage(replay.config.stage), rulesVersion: replayRulesVersion(replay.version) });
    const digest = createHash('sha256');
    for (const input of replayInputs(replay)) {
      engine.step(FIXED_DT, input); digest.update(JSON.stringify(engine.getSnapshot()) + '\n');
    }
    assert.equal(digest.digest('hex'), fixture.allFrameSHA256, replay.version + '/' + replay.config.stage);
    assert.equal(engine.getSnapshot().frame, fixture.frames); frames += fixture.frames;
  }
  assert.equal(frames, 3682);
});

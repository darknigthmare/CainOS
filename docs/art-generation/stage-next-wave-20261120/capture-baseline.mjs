import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { FIGHTERS, STAGES, ALL_STAGES, COSTUMES, getStage, getReplayFighter } from '../../../combat/data.mjs';
import { STORY_ROUTES } from '../../../combat/stories.mjs';
import { CombatEngine, FIXED_DT } from '../../../combat/engine.mjs';
import { createProgram, validateProgram, recordProgramResult, retryProgram, PROGRAM_MODES } from '../../../combat/progression.mjs';
import { validateReplay, replayInputs, replayRulesVersion } from '../../../combat/session.mjs';

const BASE = '570fdb31512cdd2a2d5ba5e2c26d7c10b47ae063';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const fixtureURL = new URL('../../../tests/fixtures/combat-pre-barnoir.json', import.meta.url);
assert.equal(existsSync(fixtureURL), false, 'Never overwrite the independent pre-addition fixture');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), BASE);
const sourceHashes = {};
for (const path of ['combat/data.mjs', 'combat/progression.mjs', 'combat/stories.mjs', 'combat/engine.mjs', 'combat/session.mjs']) {
  const current = readFileSync(new URL('../../../' + path, import.meta.url));
  assert.deepEqual(current, execFileSync('git', ['show', BASE + ':' + path], { cwd: root }), path + ' changed before capture');
  sourceHashes[path] = hash(current);
}
assert.equal(STAGES.length, 23);
assert.equal(COSTUMES.length, 468);
assert.equal(STAGES.at(-1).id, 'undermap');
const storyRoutes = Object.fromEntries(FIGHTERS.map(fighter => {
  const route = STORY_ROUTES[fighter.id];
  return [fighter.id, { sha256: hash(JSON.stringify(route)),
    chapters: route.chapters.map(chapter => ({ opponentId: chapter.opponentId, stageId: chapter.stageId })),
    prologue: route.prologue.map(panel => panel.stageId), epilogue: route.epilogue.map(panel => panel.stageId) }];
}));
const fixtures = [];
for (const player of ['pomni', 'gummigoo', 'ribbit']) {
  for (const [seed, stage] of [[1, 'bigtop'], [20261120, 'falseexit'], [4294967295, 'home-' + player], [20261121, 'undermap']]) {
    for (const mode of PROGRAM_MODES) {
      const start = createProgram(mode, player, FIGHTERS, STAGES, { seed, stage });
      const firstWin = recordProgramResult(clone(start), { won: true, health: 6532 });
      const secondWin = recordProgramResult(clone(firstWin), { won: true, health: 6532 });
      const defeat = recordProgramResult(clone(firstWin), { won: false, health: 0 });
      const retry = retryProgram(clone(defeat));
      let completion = clone(start), guard = 0;
      while (completion.status === 'active') {
        assert.ok(++guard <= 12);
        completion = recordProgramResult(clone(completion), { won: true, health: 6532 });
      }
      const checkpoints = { start, firstWin, secondWin, defeat, retry, completion };
      for (const checkpoint of Object.values(checkpoints)) assert.deepEqual(validateProgram(clone(checkpoint)), checkpoint);
      fixtures.push({ catalog: 'pre-barnoir-54-fighters-23-arenas', player, mode, seed, requestedStage: stage, ...checkpoints });
    }
  }
}
const previous = JSON.parse(readFileSync(new URL('../../../tests/fixtures/combat-pre-undermap.json', import.meta.url)));
for (const [id, route] of Object.entries(storyRoutes)) assert.equal(route.sha256, previous.storyRoutes[id].sha256, id + ': older story changed');
const sourceReplays = previous.replays.filter(item => item.replay.version === '0.7.0').map(item => clone(item.replay));
sourceReplays.push({ ...clone(sourceReplays[0]), config: { ...clone(sourceReplays[0].config), stage: 'undermap' } });
const replays = sourceReplays.map(source => {
  const replay = validateReplay(source, FIGHTERS.map(fighter => fighter.id), ALL_STAGES.map(stage => stage.id));
  const engine = new CombatEngine({ ...replay.config, fighters: replay.config.fighters.map(id => getReplayFighter(id, replay.version)),
    stage: getStage(replay.config.stage), rulesVersion: replayRulesVersion(replay.version) });
  const digest = createHash('sha256');
  for (const input of replayInputs(replay)) { engine.step(FIXED_DT, input); digest.update(JSON.stringify(engine.getSnapshot()) + '\n'); }
  return { replay, frames: engine.getSnapshot().frame, allFrameSHA256: digest.digest('hex') };
});
const capturedAt = new Date().toISOString();
const fixture = { note: 'Captured from unchanged 570fdb315 modules BEFORE adding barnoir or NPC crossover aggregation. Existing pre-undermap fixtures remain untouched.',
  capturedAt, sourceHashes, stageIds: STAGES.map(stage => stage.id), costumeCount: COSTUMES.length,
  costumeIds: COSTUMES.map(costume => costume.id), costumesSHA256: hash(JSON.stringify(COSTUMES)), storyRoutes, fixtures, replays };
const bytes = JSON.stringify(fixture, null, 2) + '\n';
writeFileSync(fixtureURL, bytes);
const proof = { capturedAt, sourceCommit: BASE, sourceRemoteCommit: '5be043ba21f3fe7a6dedd3fa1b00dc36f296b540', sourceHashes,
  captureScript: 'capture-baseline.mjs', captureScriptSHA256: hash(readFileSync(fileURLToPath(import.meta.url))),
  fixturePath: 'tests/fixtures/combat-pre-barnoir.json', fixtureSHA256: hash(bytes), storyRoutes: Object.keys(storyRoutes).length,
  programFixtures: fixtures.length, checkpoints: fixtures.length * 6, initialStageCases: ['bigtop', 'falseexit', 'home-{player}', 'undermap'],
  replayFixtures: replays.length, replayFrames: replays.reduce((sum, replay) => sum + replay.frames, 0),
  earlierFixturePath: 'tests/fixtures/combat-pre-undermap.json', earlierFixtureSHA256: hash(readFileSync(new URL('../../../tests/fixtures/combat-pre-undermap.json', import.meta.url))),
  historicalCostumes: COSTUMES.length, historicalCostumesSHA256: fixture.costumesSHA256 };
writeFileSync(new URL('before-addition-proof.json', import.meta.url), JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify(proof));

import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { FIGHTERS, STAGES, ALL_STAGES, COSTUMES, getStage, getReplayFighter } from '../../../../combat/data.mjs';
import { STORY_ROUTES } from '../../../../combat/stories.mjs';
import { CombatEngine, FIXED_DT } from '../../../../combat/engine.mjs';
import { createProgram, validateProgram, recordProgramResult, retryProgram, PROGRAM_MODES } from '../../../../combat/progression.mjs';
import { validateReplay, replayInputs, replayRulesVersion } from '../../../../combat/session.mjs';

const BASE = '38e8000cad61f4b229ad300877f44c31356343fa';
const REMOTE = '6c99eb430e0ffcc17406428fee1ff6d8e2edeab4';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const fixturePath = 'tests/fixtures/combat-pre-softballfield.json';
const fixtureURL = new URL('../../../../' + fixturePath, import.meta.url);
assert.equal(existsSync(fixtureURL), false, 'Never overwrite the independent pre-addition fixture');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), BASE);
const runtimePaths = execFileSync('git', ['ls-tree', '-r', '--name-only', BASE, 'combat'], { cwd: root, encoding: 'utf8' })
  .trim().split('\n').filter(path => path.endsWith('.mjs'));
const sourceHashes = {};
for (const path of runtimePaths) {
  const current = readFileSync(new URL('../../../../' + path, import.meta.url));
  assert.deepEqual(current, execFileSync('git', ['show', BASE + ':' + path], { cwd: root }), path + ' changed before capture');
  sourceHashes[path] = hash(current);
}
assert.equal(STAGES.length, 24);
assert.equal(COSTUMES.length, 472);
assert.equal(STAGES.at(-1).id, 'barnoir');
assert.equal(ALL_STAGES.some(stage => stage.id === 'softballfield'), false);
const storyRoutes = Object.fromEntries(FIGHTERS.map(fighter => {
  const route = STORY_ROUTES[fighter.id];
  return [fighter.id, { sha256: hash(JSON.stringify(route)),
    chapters: route.chapters.map(chapter => ({ opponentId: chapter.opponentId, stageId: chapter.stageId })),
    prologue: route.prologue.map(panel => panel.stageId), epilogue: route.epilogue.map(panel => panel.stageId) }];
}));
const fixtures = [];
for (const player of ['pomni', 'gummigoo', 'ribbit']) {
  for (const [seed, stage] of [[1, 'bigtop'], [20261120, 'falseexit'], [4294967295, 'home-' + player], [20261121, 'undermap'], [20261122, 'barnoir']]) {
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
      fixtures.push({ catalog: 'pre-softballfield-54-fighters-24-arenas', player, mode, seed, requestedStage: stage, ...checkpoints });
    }
  }
}
const previousPath = 'tests/fixtures/combat-pre-barnoir.json';
const previous = JSON.parse(readFileSync(new URL('../../../../' + previousPath, import.meta.url)));
for (const [id, route] of Object.entries(storyRoutes)) assert.equal(route.sha256, previous.storyRoutes[id].sha256, id + ': older story changed');
const sourceReplays = previous.replays.filter(item => item.replay.version === '0.7.0').map(item => clone(item.replay));
sourceReplays.push({ ...clone(sourceReplays[0]), config: { ...clone(sourceReplays[0].config), stage: 'barnoir' } });
const replays = sourceReplays.map(source => {
  const replay = validateReplay(source, FIGHTERS.map(fighter => fighter.id), ALL_STAGES.map(stage => stage.id));
  const engine = new CombatEngine({ ...replay.config, fighters: replay.config.fighters.map(id => getReplayFighter(id, replay.version)),
    stage: getStage(replay.config.stage), rulesVersion: replayRulesVersion(replay.version) });
  const digest = createHash('sha256');
  for (const input of replayInputs(replay)) { engine.step(FIXED_DT, input); digest.update(JSON.stringify(engine.getSnapshot()) + '\n'); }
  return { replay, frames: engine.getSnapshot().frame, allFrameSHA256: digest.digest('hex') };
});
// Detect any concurrent mutation across the capture, including imported registries.
for (const [path, expected] of Object.entries(sourceHashes)) {
  assert.equal(hash(readFileSync(new URL('../../../../' + path, import.meta.url))), expected, path + ' changed during capture');
}
const capturedAt = new Date().toISOString();
const fixture = { note: 'Captured from unchanged 38e8000c modules BEFORE adding softballfield or the continuation costume aggregation. Older fixtures remain untouched.',
  capturedAt, sourceHashes, stageIds: STAGES.map(stage => stage.id), costumeCount: COSTUMES.length,
  costumeIds: COSTUMES.map(costume => costume.id), costumesSHA256: hash(JSON.stringify(COSTUMES)), storyRoutes, fixtures, replays };
const bytes = JSON.stringify(fixture, null, 2) + '\n';
writeFileSync(fixtureURL, bytes);
const earlierFixtures = ['tests/fixtures/combat-pre-undermap.json', previousPath].map(path => ({ path,
  sha256: hash(readFileSync(new URL('../../../../' + path, import.meta.url))) }));
const proof = { capturedAt, sourceCommit: BASE, sourceRemoteCommit: REMOTE, sourceTree: '34ab7f73ab6a5725b0d7ab6622524926f5a0baa2',
  sourceHashes, unchangedRuntimeModules: runtimePaths.length,
  captureScript: 'capture-baseline.mjs', captureScriptSHA256: hash(readFileSync(fileURLToPath(import.meta.url))),
  fixturePath, fixtureSHA256: hash(bytes), storyRoutes: Object.keys(storyRoutes).length,
  programFixtures: fixtures.length, checkpoints: fixtures.length * 6,
  initialStageCases: ['bigtop', 'falseexit', 'home-{player}', 'undermap', 'barnoir'],
  replayFixtures: replays.length, replayFrames: replays.reduce((sum, replay) => sum + replay.frames, 0), earlierFixtures,
  historicalCostumes: COSTUMES.length, historicalCostumesSHA256: fixture.costumesSHA256 };
writeFileSync(new URL('before-addition-proof.json', import.meta.url), JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify(proof));

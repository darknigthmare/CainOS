import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { CombatEngine, CQCCombat, ENGINE_RULES_VERSION, ENGINE_RULES_VERSIONS, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS, STAGES, GAME, getFighter, getReplayFighter } from '../combat/data.mjs';
import { GAME_VERSION, REPLAY_VERSIONS, replayRulesVersion, validateReplay, replayInputs } from '../combat/session.mjs';

// Captured from the published engine before applying the 0.5.0 corrections.
// Each digest covers every serialized frame of a 900-frame seeded CPU duel,
// not just its final score. The version selects the historical fighter kit.
const LEGACY_BASELINE = {
  "capturedAt": "2026-10-23T06:44:36.910Z",
  "baseCommit": "f2253279c92b6e782006be7abeed9f2ea4d33453",
  "engineSHA256": "cc22edd35abeff874a2bf27ff64dd669f30484e70bb3bfba4ea868dd9c8ebc1a",
  "frames": 900,
  "opponentOffset": 5,
  "seedBase": 20261023,
  "versions": [
    "0.1.0",
    "0.2.0",
    "0.3.0",
    "0.4.0"
  ],
  "traces": [
    {
      "version": "0.1.0",
      "fighters": [
        "pomni",
        "kinger"
      ],
      "stage": "bigtop",
      "seed": 20261023,
      "sha256": "72272453d2b0978fbde2c3097b80d8ff7fd71999323b4c8fcd45c2c775ea268e"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "jax",
        "caine"
      ],
      "stage": "candy",
      "seed": 20261024,
      "sha256": "fc626d0d9efcd4d325256073c1de9a97119e3001d689712effdf1917b893cd17"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "ragatha",
        "bubble"
      ],
      "stage": "manor",
      "seed": 20261025,
      "sha256": "9a7195e4e1dc1d53c2cb2995adc9950f5c4c589e35da98a758bb2cc992f95156"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "gangle",
        "gummigoo"
      ],
      "stage": "spudsy",
      "seed": 20261026,
      "sha256": "56e8c1380b4afb9be6b657a42583693cbc9ed66e77333b3cb9fda28a4bc8ef39"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "zooble",
        "loolilalu"
      ],
      "stage": "cellar",
      "seed": 20261027,
      "sha256": "7c0b3b8092a90e771c5126a187e0fc5e4531d099b8f15a45a44c28b40641f845"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "kinger",
        "gloinkqueen"
      ],
      "stage": "void",
      "seed": 20261028,
      "sha256": "8e41e8334ede072a1f05ab0e534c28f829ed9f19752045f4b64d496606f7bfc8"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "caine",
        "fudge"
      ],
      "stage": "lake",
      "seed": 20261029,
      "sha256": "b4f747c6b4651858c1f8339f0a032174046d9066d96be0558e94b5d41ab97f26"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "bubble",
        "abstractedkaufmo"
      ],
      "stage": "training",
      "seed": 20261030,
      "sha256": "1689741264ede0bd19942c7c1bbb373fdbc9ccad43f13a9dee847a5ce36d1c81"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "gummigoo",
        "baronmildenhall"
      ],
      "stage": "gloink",
      "seed": 20261031,
      "sha256": "98b465daa45fe2fb18eee353a16c548df1f43f8db8f6619215595d7ff4f97bfb"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "loolilalu",
        "pomni"
      ],
      "stage": "kingdom",
      "seed": 20261032,
      "sha256": "0669de78287c3467b0e963d0f810bb78534d64248c2a512a7aa765c2a8489d58"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "gloinkqueen",
        "jax"
      ],
      "stage": "grounds",
      "seed": 20261033,
      "sha256": "b2174e414c749090567f50963ac795394fcad6c7b6f062fe727e5c343cef3c6c"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "fudge",
        "ragatha"
      ],
      "stage": "backstage",
      "seed": 20261034,
      "sha256": "80fe0c5ff98ec943d3f3cf2cabb238bb808dfc04820a331b477ef1b3a4b5f16b"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "abstractedkaufmo",
        "gangle"
      ],
      "stage": "bigtop",
      "seed": 20261035,
      "sha256": "5aca20ef31e461afd8ef827c010a32813cafa4f649374be154d26e4b225ba250"
    },
    {
      "version": "0.1.0",
      "fighters": [
        "baronmildenhall",
        "zooble"
      ],
      "stage": "candy",
      "seed": 20261036,
      "sha256": "d4b7f939208af1f61cdf806327edc932727973f6340b5b424bf4650a54e3cb1f"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "pomni",
        "kinger"
      ],
      "stage": "bigtop",
      "seed": 20261023,
      "sha256": "72272453d2b0978fbde2c3097b80d8ff7fd71999323b4c8fcd45c2c775ea268e"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "jax",
        "caine"
      ],
      "stage": "candy",
      "seed": 20261024,
      "sha256": "fc626d0d9efcd4d325256073c1de9a97119e3001d689712effdf1917b893cd17"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "ragatha",
        "bubble"
      ],
      "stage": "manor",
      "seed": 20261025,
      "sha256": "9a7195e4e1dc1d53c2cb2995adc9950f5c4c589e35da98a758bb2cc992f95156"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "gangle",
        "gummigoo"
      ],
      "stage": "spudsy",
      "seed": 20261026,
      "sha256": "56e8c1380b4afb9be6b657a42583693cbc9ed66e77333b3cb9fda28a4bc8ef39"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "zooble",
        "loolilalu"
      ],
      "stage": "cellar",
      "seed": 20261027,
      "sha256": "7c0b3b8092a90e771c5126a187e0fc5e4531d099b8f15a45a44c28b40641f845"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "kinger",
        "gloinkqueen"
      ],
      "stage": "void",
      "seed": 20261028,
      "sha256": "8e41e8334ede072a1f05ab0e534c28f829ed9f19752045f4b64d496606f7bfc8"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "caine",
        "fudge"
      ],
      "stage": "lake",
      "seed": 20261029,
      "sha256": "b4f747c6b4651858c1f8339f0a032174046d9066d96be0558e94b5d41ab97f26"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "bubble",
        "abstractedkaufmo"
      ],
      "stage": "training",
      "seed": 20261030,
      "sha256": "1689741264ede0bd19942c7c1bbb373fdbc9ccad43f13a9dee847a5ce36d1c81"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "gummigoo",
        "baronmildenhall"
      ],
      "stage": "gloink",
      "seed": 20261031,
      "sha256": "98b465daa45fe2fb18eee353a16c548df1f43f8db8f6619215595d7ff4f97bfb"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "loolilalu",
        "pomni"
      ],
      "stage": "kingdom",
      "seed": 20261032,
      "sha256": "0669de78287c3467b0e963d0f810bb78534d64248c2a512a7aa765c2a8489d58"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "gloinkqueen",
        "jax"
      ],
      "stage": "grounds",
      "seed": 20261033,
      "sha256": "b2174e414c749090567f50963ac795394fcad6c7b6f062fe727e5c343cef3c6c"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "fudge",
        "ragatha"
      ],
      "stage": "backstage",
      "seed": 20261034,
      "sha256": "80fe0c5ff98ec943d3f3cf2cabb238bb808dfc04820a331b477ef1b3a4b5f16b"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "abstractedkaufmo",
        "gangle"
      ],
      "stage": "bigtop",
      "seed": 20261035,
      "sha256": "5aca20ef31e461afd8ef827c010a32813cafa4f649374be154d26e4b225ba250"
    },
    {
      "version": "0.2.0",
      "fighters": [
        "baronmildenhall",
        "zooble"
      ],
      "stage": "candy",
      "seed": 20261036,
      "sha256": "d4b7f939208af1f61cdf806327edc932727973f6340b5b424bf4650a54e3cb1f"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "pomni",
        "kinger"
      ],
      "stage": "bigtop",
      "seed": 20261023,
      "sha256": "2ccd752ab2ed4cd3d61bc08b0cdaa5f004879ef00806362c264013b933e82eb9"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "jax",
        "caine"
      ],
      "stage": "candy",
      "seed": 20261024,
      "sha256": "fc626d0d9efcd4d325256073c1de9a97119e3001d689712effdf1917b893cd17"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "ragatha",
        "bubble"
      ],
      "stage": "manor",
      "seed": 20261025,
      "sha256": "9a7195e4e1dc1d53c2cb2995adc9950f5c4c589e35da98a758bb2cc992f95156"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "gangle",
        "gummigoo"
      ],
      "stage": "spudsy",
      "seed": 20261026,
      "sha256": "56e8c1380b4afb9be6b657a42583693cbc9ed66e77333b3cb9fda28a4bc8ef39"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "zooble",
        "loolilalu"
      ],
      "stage": "cellar",
      "seed": 20261027,
      "sha256": "7c0b3b8092a90e771c5126a187e0fc5e4531d099b8f15a45a44c28b40641f845"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "kinger",
        "gloinkqueen"
      ],
      "stage": "void",
      "seed": 20261028,
      "sha256": "8e41e8334ede072a1f05ab0e534c28f829ed9f19752045f4b64d496606f7bfc8"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "caine",
        "fudge"
      ],
      "stage": "lake",
      "seed": 20261029,
      "sha256": "b4f747c6b4651858c1f8339f0a032174046d9066d96be0558e94b5d41ab97f26"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "bubble",
        "abstractedkaufmo"
      ],
      "stage": "training",
      "seed": 20261030,
      "sha256": "1689741264ede0bd19942c7c1bbb373fdbc9ccad43f13a9dee847a5ce36d1c81"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "gummigoo",
        "baronmildenhall"
      ],
      "stage": "gloink",
      "seed": 20261031,
      "sha256": "98b465daa45fe2fb18eee353a16c548df1f43f8db8f6619215595d7ff4f97bfb"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "loolilalu",
        "pomni"
      ],
      "stage": "kingdom",
      "seed": 20261032,
      "sha256": "fd5dd0784204e276250e39ec23152dcba5da4eb33c92bd57541e3ebe85c27594"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "gloinkqueen",
        "jax"
      ],
      "stage": "grounds",
      "seed": 20261033,
      "sha256": "b2174e414c749090567f50963ac795394fcad6c7b6f062fe727e5c343cef3c6c"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "fudge",
        "ragatha"
      ],
      "stage": "backstage",
      "seed": 20261034,
      "sha256": "80fe0c5ff98ec943d3f3cf2cabb238bb808dfc04820a331b477ef1b3a4b5f16b"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "abstractedkaufmo",
        "gangle"
      ],
      "stage": "bigtop",
      "seed": 20261035,
      "sha256": "f03b9665b7f1e579f019288cfa744d0a84a27fa1c964878aadaabfd3d7cd15ce"
    },
    {
      "version": "0.3.0",
      "fighters": [
        "baronmildenhall",
        "zooble"
      ],
      "stage": "candy",
      "seed": 20261036,
      "sha256": "d4b7f939208af1f61cdf806327edc932727973f6340b5b424bf4650a54e3cb1f"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "pomni",
        "kinger"
      ],
      "stage": "bigtop",
      "seed": 20261023,
      "sha256": "2ccd752ab2ed4cd3d61bc08b0cdaa5f004879ef00806362c264013b933e82eb9"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "jax",
        "caine"
      ],
      "stage": "candy",
      "seed": 20261024,
      "sha256": "fc626d0d9efcd4d325256073c1de9a97119e3001d689712effdf1917b893cd17"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "ragatha",
        "bubble"
      ],
      "stage": "manor",
      "seed": 20261025,
      "sha256": "9a7195e4e1dc1d53c2cb2995adc9950f5c4c589e35da98a758bb2cc992f95156"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "gangle",
        "gummigoo"
      ],
      "stage": "spudsy",
      "seed": 20261026,
      "sha256": "56e8c1380b4afb9be6b657a42583693cbc9ed66e77333b3cb9fda28a4bc8ef39"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "zooble",
        "loolilalu"
      ],
      "stage": "cellar",
      "seed": 20261027,
      "sha256": "7c0b3b8092a90e771c5126a187e0fc5e4531d099b8f15a45a44c28b40641f845"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "kinger",
        "gloinkqueen"
      ],
      "stage": "void",
      "seed": 20261028,
      "sha256": "8e41e8334ede072a1f05ab0e534c28f829ed9f19752045f4b64d496606f7bfc8"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "caine",
        "fudge"
      ],
      "stage": "lake",
      "seed": 20261029,
      "sha256": "b4f747c6b4651858c1f8339f0a032174046d9066d96be0558e94b5d41ab97f26"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "bubble",
        "abstractedkaufmo"
      ],
      "stage": "training",
      "seed": 20261030,
      "sha256": "1689741264ede0bd19942c7c1bbb373fdbc9ccad43f13a9dee847a5ce36d1c81"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "gummigoo",
        "baronmildenhall"
      ],
      "stage": "gloink",
      "seed": 20261031,
      "sha256": "98b465daa45fe2fb18eee353a16c548df1f43f8db8f6619215595d7ff4f97bfb"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "loolilalu",
        "pomni"
      ],
      "stage": "kingdom",
      "seed": 20261032,
      "sha256": "fd5dd0784204e276250e39ec23152dcba5da4eb33c92bd57541e3ebe85c27594"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "gloinkqueen",
        "jax"
      ],
      "stage": "grounds",
      "seed": 20261033,
      "sha256": "b2174e414c749090567f50963ac795394fcad6c7b6f062fe727e5c343cef3c6c"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "fudge",
        "ragatha"
      ],
      "stage": "backstage",
      "seed": 20261034,
      "sha256": "80fe0c5ff98ec943d3f3cf2cabb238bb808dfc04820a331b477ef1b3a4b5f16b"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "abstractedkaufmo",
        "gangle"
      ],
      "stage": "bigtop",
      "seed": 20261035,
      "sha256": "f03b9665b7f1e579f019288cfa744d0a84a27fa1c964878aadaabfd3d7cd15ce"
    },
    {
      "version": "0.4.0",
      "fighters": [
        "baronmildenhall",
        "zooble"
      ],
      "stage": "candy",
      "seed": 20261036,
      "sha256": "d4b7f939208af1f61cdf806327edc932727973f6340b5b424bf4650a54e3cb1f"
    }
  ]
};

const neutral = () => ({ slot: null });
const frames = (engine, count, inputs = [neutral(), neutral()]) => {
  for (let frame = 0; frame < count; frame++) engine.step(FIXED_DT, inputs);
};
const make = (options = {}) => new CombatEngine({
  fighters: [getFighter('jax'), getFighter('pomni')], stage: STAGES[0],
  cpu: [false, false], mode: 'local', seed: 1, skipIntro: true, roundTime: 0, ...options,
});
const onlyCandidate = (actor, slot) => {
  for (const name of Object.keys(actor.f.combat.moves)) if (name !== slot) actor.cooldowns[name] = 999;
};

function trapEncounter(id, version, crouch = false) {
  const engine = make({ fighters: [getReplayFighter(id, version), getReplayFighter('pomni', version)], rulesVersion: version });
  engine.state.a.x = 400;
  engine.state.b.x = 520;
  const move = engine.state.a.f.combat.moves.specialDown;
  engine.step(FIXED_DT, [{ slot: 'specialDown' }, { slot: null, guard: true, down: crouch }]);
  frames(engine, move.startup + move.arm + 2, [neutral(), { slot: null, guard: true, down: crouch }]);
  return engine;
}

function doubleProjectileGuard(version, level) {
  const definition = structuredClone(getFighter('pomni'));
  Object.assign(definition.combat.moves.special, {
    startup: 1, active: 1, recovery: 20, damage: 100, cost: 0,
    count: 2, interval: 1, speed: 15, height: 100, level,
  });
  const engine = make({ fighters: [definition, getFighter('jax')], cpu: [false, true], rulesVersion: version });
  engine.state.a.x = 400;
  engine.state.b.x = 480;
  // The CPU has already chosen its guard. Two actual projectile impacts then
  // test whether its posture survives the first impact's blockstun.
  engine.state.b.cpuGuard = 20;
  engine.state.b.cpuLow = level === 'low';
  engine.step(FIXED_DT, [{ slot: 'special' }, neutral()]);
  engine.step(FIXED_DT);
  return engine;
}

function healFixture(options = {}) {
  const engine = make({ fighters: [getFighter('ragatha'), getFighter('pomni')], ...options });
  engine.state.a.life = 9000;
  engine.state.a.gray = 500;
  onlyCandidate(engine.state.a, 'utility');
  return engine;
}

function throwFixture(options = {}) {
  const engine = make({ fighters: [getFighter('gloinkqueen'), getFighter('pomni')], ...options });
  engine.state.a.x = 400;
  engine.state.b.x = 700;
  onlyCandidate(engine.state.a, 'throw');
  return engine;
}

test('presentation version 0.6 retains the 0.5 engine and rejects unknown rule mappings', () => {
  assert.equal(ENGINE_RULES_VERSION, '0.5.0');
  assert.equal(GAME.version, GAME_VERSION);
  assert.equal(GAME_VERSION, '0.6.0');
  assert.equal(replayRulesVersion(GAME_VERSION), ENGINE_RULES_VERSION);
  assert.deepEqual(REPLAY_VERSIONS.map(replayRulesVersion), [...ENGINE_RULES_VERSIONS, ENGINE_RULES_VERSION]);
  assert.equal(make().config.rulesVersion, ENGINE_RULES_VERSION);
  for (const version of ENGINE_RULES_VERSIONS) {
    const engine = make({ rulesVersion: version });
    assert.equal(engine.state.options.rulesVersion, version);
    engine.reset();
    assert.equal(engine.state.options.rulesVersion, version);
  }
  assert.throws(() => make({ rulesVersion: '0.6.0' }), /rules version/);
  for (const unknown of ['0.7.0', '__proto__', null, undefined]) assert.throws(() => replayRulesVersion(unknown), /inconnue/);
});

test('all fourteen 0.6 replay routes match 0.5 simulation for 900 seeded frames', () => {
  for (let index = 0; index < FIGHTERS.length; index++) {
    const fighterIds = [FIGHTERS[index].id, FIGHTERS[(index + 5) % FIGHTERS.length].id];
    const engines = ['0.5.0', '0.6.0'].map(version => make({
      fighters: fighterIds.map(id => getReplayFighter(id, version)),
      stage: STAGES[index % STAGES.length], rulesVersion: replayRulesVersion(version),
      cpu: [true, true], difficulty: 'normal', seed: 0x6000 + index, roundsToWin: 3,
    }));
    for (let frame = 0; frame < 900; frame++) {
      engines.forEach(engine => engine.step(FIXED_DT, [neutral(), neutral()]));
      assert.deepEqual(engines[0].getSnapshot(), engines[1].getSnapshot(), `${fighterIds[0]} frame ${frame}`);
    }
  }
});

test('all 56 captured legacy CPU duels preserve every frame fingerprint', () => {
  assert.equal(LEGACY_BASELINE.traces.length, 56);
  for (const fixture of LEGACY_BASELINE.traces) {
    const engine = make({
      fighters: fixture.fighters.map(id => getReplayFighter(id, fixture.version)),
      stage: STAGES.find(stage => stage.id === fixture.stage), rulesVersion: fixture.version,
      cpu: [true, true], difficulty: 'normal', seed: fixture.seed,
      roundsToWin: 3,
    });
    const digest = createHash('sha256');
    for (let frame = 0; frame < LEGACY_BASELINE.frames; frame++) {
      engine.step(FIXED_DT, [neutral(), neutral()]);
      digest.update(JSON.stringify(engine.getSnapshot()));
    }
    assert.equal(digest.digest('hex'), fixture.sha256, `${fixture.version}: ${fixture.fighters.join(' / ')}`);
  }
});

test('all ten authored low traps bypass standing guard and respect crouching guard in 0.5', () => {
  const artists = FIGHTERS.filter(fighter => fighter.moves.specialDown.kind === 'trap' && fighter.moves.specialDown.level === 'low');
  assert.equal(artists.length, 10);
  for (const artist of artists) {
    const standing = trapEncounter(artist.id, '0.5.0');
    const crouching = trapEncounter(artist.id, '0.5.0', true);
    assert.equal(standing.state.metrics.trapTrigger, 1, artist.id);
    assert.equal(crouching.state.metrics.trapTrigger, 1, artist.id);
    const hit = standing.state.events.find(event => event.type === 'damage');
    const block = crouching.state.events.find(event => event.type === 'damage');
    assert.equal(hit.blocked, false, artist.id);
    assert.equal(block.blocked, true, artist.id);
    assert.ok(hit.amount > block.amount, artist.id);
  }
});

test('historical versions retain their original tag-derived trap guard behavior', () => {
  for (const version of LEGACY_BASELINE.versions) {
    const standing = trapEncounter('jax', version);
    const crouching = trapEncounter('jax', version, true);
    assert.equal(standing.state.metrics.block, 1, version);
    assert.equal(crouching.state.metrics.block, 1, version);
    assert.equal(standing.state.b.hp, crouching.state.b.hp, version);
  }
});

test('re-importing the same trap recording preserves old rules and exact 0.5 playback', () => {
  const fixture = {
    format: 'circus-encore-replay',
    config: { fighters: ['jax', 'pomni'], stage: STAGES[0].id, cpu: [false, false],
      difficulty: 'normal', seed: 1, roundTime: 90, roundsToWin: 2, initialHealth: [10000, 10000] },
    runs: [[112, 0, 0], [70, 0, 1], [1, 768, 8], [80, 0, 8]],
  };
  const play = replay => {
    const engine = new CombatEngine({ ...replay.config,
      fighters: replay.config.fighters.map(id => getReplayFighter(id, replay.version)),
      stage: STAGES[0], rulesVersion: replayRulesVersion(replay.version) });
    for (const input of replayInputs(replay)) engine.step(FIXED_DT, input);
    return engine.getSnapshot();
  };
  for (const version of REPLAY_VERSIONS) {
    const original = { ...fixture, version };
    const imported = validateReplay(JSON.parse(JSON.stringify(original)), FIGHTERS.map(f => f.id), STAGES.map(s => s.id));
    const actual = play(imported);
    assert.deepEqual(actual, play(original));
    assert.equal(actual.frame, 263);
    assert.equal(actual.fighters[1].hp, replayRulesVersion(version) === '0.5.0' ? 9430 : 9932, version);
  }
});

test('CPU keeps its selected high or low guard across consecutive projectile impacts', () => {
  for (const level of ['high', 'low']) {
    const engine = doubleProjectileGuard('0.5.0', level);
    assert.equal(engine.state.b.stats.blocked, 2, level);
    assert.equal(engine.state.b.block, true, level);
    assert.equal(engine.state.b.crouch, level === 'low', level);
    assert.equal(engine.lastInputs[1].guard, true, level);
    assert.equal(engine.lastInputs[1].down, level === 'low', level);
  }
});

test('legacy CPU recordings keep their original guard decision during blockstun', () => {
  for (const version of LEGACY_BASELINE.versions) for (const level of ['high', 'low']) {
    const engine = doubleProjectileGuard(version, level);
    assert.equal(engine.state.b.stats.blocked, 1, `${version} / ${level}`);
    assert.equal(engine.state.b.block, false);
  }
});

test('Ragatha CPU activates useful healing and respects the remaining heal budget', () => {
  for (const alreadyHealed of [0, 850]) {
    const engine = healFixture({ cpu: [true, false] });
    engine.state.a.regenUsed = alreadyHealed;
    engine.step(FIXED_DT);
    assert.equal(engine.state.a.attack?.name, 'utility');
    assert.equal(engine.state.a.r, 78);
    frames(engine, 23);
    const healed = Math.min(380, 900 - alreadyHealed);
    assert.equal(engine.state.a.hp, 9000 + healed);
    assert.equal(engine.state.a.gray, 500 - healed);
    assert.equal(engine.state.a.stats.healed, healed);
    assert.equal(engine.state.a.regenUsed, alreadyHealed + healed);
  }
});

test('CPU never starts unusable healing when health, budget, resource, cooldown or position prevents it', () => {
  const cases = {
    'full health': engine => { engine.state.a.life = engine.state.a.max; },
    'no gray life': engine => { engine.state.a.gray = 0; },
    'spent budget': engine => { engine.state.a.regenUsed = 900; },
    'insufficient resource': engine => { engine.state.a.r = 21; },
    cooldown: engine => { engine.state.a.cooldowns.utility = 300; },
    airborne: engine => { engine.state.a.onGround = false; },
    'opponent too close': engine => { engine.state.b.x = engine.state.a.x + 200; },
  };
  for (const [label, configure] of Object.entries(cases)) {
    const engine = healFixture();
    configure(engine);
    const input = CQCCombat.cpu(engine._native, engine.state.a, engine.state.b);
    assert.notEqual(input.slot, 'utility', label);
  }
});

test('legacy CPU rules do not newly select Ragatha utility healing', () => {
  for (const version of LEGACY_BASELINE.versions) {
    const engine = healFixture({ rulesVersion: version });
    assert.notEqual(CQCCombat.cpu(engine._native, engine.state.a, engine.state.b).slot, 'utility', version);
  }
});

test('Gloink Queen CPU can land its authored long throw beyond the old 85px cutoff', () => {
  const engine = throwFixture({ cpu: [true, false] });
  engine.step(FIXED_DT, [neutral(), { slot: null, guard: true }]);
  assert.equal(engine.state.a.attack?.name, 'throw');
  frames(engine, 11, [neutral(), { slot: null, guard: true }]);
  assert.ok(engine.state.b.hp < engine.state.b.maxHp);
  assert.ok(engine.state.b.throwProtect > 0);
  assert.equal(engine.state.a.stats.hits, 1);
  for (const version of LEGACY_BASELINE.versions) {
    const legacy = throwFixture({ rulesVersion: version });
    assert.notEqual(CQCCombat.cpu(legacy._native, legacy.state.a, legacy.state.b).slot, 'throw', version);
  }
});

test('CPU throw candidates respect actual range and every target protection condition', () => {
  const cases = {
    'outside collision reach': engine => {
      const p = engine.state.a, o = engine.state.b;
      o.x = p.x + p.f.moves.throw.reach * p.f.reach + engine.box(o).w / 2 + 1;
    },
    'attacker airborne': engine => { engine.state.a.onGround = false; },
    'target airborne': engine => { engine.state.b.onGround = false; },
    hitstun: engine => { engine.state.b.hit = 1; },
    blockstun: engine => { engine.state.b.blockstun = 1; },
    'throw protection': engine => { engine.state.b.throwProtect = 1; },
  };
  for (const [label, configure] of Object.entries(cases)) {
    const engine = throwFixture();
    configure(engine);
    assert.notEqual(CQCCombat.cpu(engine._native, engine.state.a, engine.state.b).slot, 'throw', label);
  }
});

test('single-frame stepping is available only in a paused training session', () => {
  for (const mode of ['local', 'training']) for (const paused of [false, true]) {
    const engine = make({ mode });
    engine.pause(paused);
    const before = engine.getSnapshot();
    const state = engine.stepFrame([{ slot: 'light' }, neutral()]);
    const allowed = mode === 'training' && paused;
    assert.equal(state.frame, before.frame + (allowed ? 1 : 0));
    assert.equal(engine.paused, paused);
    if (!allowed) assert.deepEqual(engine.getSnapshot(), before);
  }
});

test('single-frame stepping consumes one explicit edge and clears fractional ticks and pending inputs', () => {
  const engine = make({ mode: 'training', autoheal: false, freeMeter: false, freeResource: false });
  engine.step(FIXED_DT / 2, [{ slot: 'heavy' }, neutral()]);
  engine.pause(true);
  engine.stepFrame([{ slot: 'light' }, neutral()]);
  assert.equal(engine.state.frame, 1);
  assert.equal(engine.state.a.attack?.name, 'light');
  assert.equal(engine.state.a.attack?.t, 1);
  assert.equal(engine.lastInputs[0].slot, 'light');
  assert.equal(engine.paused, true);
  engine.stepFrame();
  assert.equal(engine.state.frame, 2);
  assert.equal(engine.state.a.attack?.t, 2);
  assert.equal(engine.lastInputs[0].slot, null);
  engine.pause(false);
  engine.step(FIXED_DT / 2);
  assert.equal(engine.state.frame, 2, 'paused half-tick cannot leak into resume');
  engine.step(FIXED_DT / 2);
  assert.equal(engine.state.frame, 3);
  assert.equal(engine.state.a.stats.starts, 1);
});

test('playback dummy obeys J2 movement and attack inputs even when a CPU flag was previously set', () => {
  for (const frozen of [false, true]) {
    const engine = make({ mode: 'training', cpu: [false, true], autoheal: false });
    assert.equal(engine.setTraining({ dummy: 'playback' }), true);
    engine.pause(frozen);
    const before = engine.state.b.x;
    const advance = input => frozen ? engine.stepFrame(input) : engine.step(FIXED_DT, input);
    advance([neutral(), { slot: null, left: true }]);
    assert.ok(engine.state.b.x < before);
    advance([neutral(), { slot: 'light' }]);
    assert.equal(engine.state.b.attack?.name, 'light');
    assert.equal(engine.state.a.stats.starts, 0);
    assert.equal(engine.lastInputs[1].slot, 'light');
    assert.equal(engine.paused, frozen);
  }
});

test('lastInputs exposes actual dummy decisions through independent copies and resets to neutral', () => {
  const engine = make({ mode: 'training' });
  engine.setTraining({ dummy: 'crouch' });
  engine.step(FIXED_DT, [neutral(), { slot: 'super', right: true }]);
  const observed = engine.lastInputs;
  assert.equal(observed[1].guard, true);
  assert.equal(observed[1].down, true);
  assert.equal(observed[1].slot, null);
  observed[1].guard = false;
  observed[0].slot = 'super';
  assert.equal(engine.lastInputs[1].guard, true);
  assert.equal(engine.lastInputs[0].slot, null);
  engine.reset();
  assert.deepEqual(engine.lastInputs, [CQCCombat.empty(), CQCCombat.empty()]);
});

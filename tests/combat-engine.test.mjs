import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, CQCCombat, BASE_MOVES, FIXED_DT, ARENA, SOURCE, normalizeFighter } from '../combat/engine.mjs';
import { FIGHTERS, MOVE_SLOTS, STAGES } from '../combat/data.mjs';

const fighter = (id, moves = {}, extra = {}) => ({
  id, name: id, power: 1, speed: 1, reach: 1, ...extra,
  combat: { resource: { kind: 'energy', max: 100, regen: 0.15 }, passive: {}, moves, ...extra.combat },
});
const make = (options = {}) => new CombatEngine({
  fighters: [fighter('pomni'), fighter('jax')], cpu: [false, false],
  skipIntro: true, roundTime: 90, roundsToWin: 2, ...options,
});
const frames = (engine, count, inputs = [{}, {}]) => {
  for (let i = 0; i < count; i++) engine.step(FIXED_DT, typeof inputs === 'function' ? inputs(i) : inputs);
  return engine.state;
};
const close = engine => {
  engine.state.a.x = 500;
  engine.state.b.x = 560;
  return engine;
};

test('the imported CQC lineage and ten authored slots remain explicit', () => {
  assert.equal(SOURCE.commit, '42279c1c884769873e66bbda0b6fe849bcd2f1a2');
  assert.equal(CQCCombat.FPS, 60);
  assert.equal(Object.keys(BASE_MOVES).length, 10);
  assert.equal(CQCCombat.FLOOR, 568);
  assert.equal(normalizeFighter(fighter('pomni')).combat.moves.specialDown.slot, 'specialDown');
});

test('startup, active frames and recovery delay damage and prevent repeated contact damage', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ light: true }, {}]);
  assert.equal(e.state.a.actionPhase, 'startup');
  frames(e, 4);
  assert.equal(e.state.b.hp, 10000);
  e.step(FIXED_DT);
  assert.equal(e.state.b.hp, 9680);
  assert.equal(e.state.a.actionPhase, 'active');
  frames(e, 3);
  assert.equal(e.state.a.actionPhase, 'recovery');
  frames(e, 12);
  assert.equal(e.state.a.attack, null);
  assert.equal(e.state.a.stats.hits, 1);
  assert.equal(e.state.b.hp, 9680);
});

test('holding an attack does not repeatedly attack; releasing and pressing starts another', () => {
  const e = close(make());
  frames(e, 80, [{ light: true }, {}]);
  assert.equal(e.state.a.stats.starts, 1);
  e.step(FIXED_DT, [{}, {}]);
  e.step(FIXED_DT, [{ light: true }, {}]);
  assert.equal(e.state.a.stats.starts, 2);
});

test('inputs shorter than one 60 Hz tick survive a 120 Hz render cycle', () => {
  const e = close(make());
  e.step(FIXED_DT / 2, [{ light: true }, {}]);
  assert.equal(e.state.frame, 0);
  e.step(FIXED_DT / 2, [{}, {}]);
  assert.equal(e.state.frame, 1);
  assert.equal(e.state.a.attack.name, 'light');
  frames(e, 5);
  assert.equal(e.state.b.hp, 9680);
});

test('fixed-time simulation gives identical movement at 30, 60 and 120 rendering Hz', () => {
  const a = make(), b = make(), c = make();
  for (let i = 0; i < 60; i++) a.step(1 / 60, [{ right: true }, {}]);
  for (let i = 0; i < 30; i++) b.step(1 / 30, [{ right: true }, {}]);
  for (let i = 0; i < 120; i++) c.step(1 / 120, [{ right: true }, {}]);
  assert.deepEqual(a.getSnapshot(), b.getSnapshot());
  assert.deepEqual(a.getSnapshot(), c.getSnapshot());
});

test('ordinary guard reduces damage, and held guard survives blockstun', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ slot: 'light' }, { guard: true }]);
  frames(e, 5, [{}, { guard: true }]);
  assert.equal(e.state.b.hp, 9962);
  assert.ok(e.state.b.guard < 100);
  e.step(FIXED_DT, [{}, { guard: true }]);
  assert.equal(e.state.b.block, true);
  assert.ok(e.state.b.blockstun > 0);
});

test('low attacks bypass standing guard but are stopped by crouching guard', () => {
  const standing = close(make()), crouching = close(make());
  standing.step(FIXED_DT, [{ slot: 'low' }, { guard: true }]);
  crouching.step(FIXED_DT, [{ slot: 'low' }, { guard: true, down: true }]);
  frames(standing, 11, [{}, { guard: true }]);
  frames(crouching, 11, [{}, { guard: true, down: true }]);
  assert.equal(standing.state.b.hp, 9560);
  assert.equal(crouching.state.b.hp, 9947);
});

test('chip damage never KOs, and guard depletion exposes a real punish window', () => {
  const e = close(make());
  e.state.b.hp = 1;
  e.state.b.guard = 2;
  e.step(FIXED_DT, [{ slot: 'heavy' }, { block: true }]);
  frames(e, 13, [{}, { block: true }]);
  assert.equal(e.state.b.hp, 1);
  assert.equal(e.state.phase, 'fight');
  assert.ok(e.state.b.stun > 0);
  assert.equal(e.state.b.block, false);
  assert.equal(e.state.metrics.guardBreak, 1);
});

test('grabs beat guard and cannot chain into protected post-throw targets', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ grab: true }, { block: true }]);
  frames(e, 7, [{}, { block: true }]);
  assert.equal(e.state.b.hp, 9200);
  assert.ok(e.state.b.throwProtect >= 100);
  const before = e.state.b.hp;
  CQCCombat.damage(e._native, e.state.a, e.state.b, e.state.a.f.combat.moves.throw);
  assert.equal(e.state.b.hp, before);
});

test('throw-tech works in the inherited seven-frame window', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ slot: 'throw' }, { tech: true }]);
  frames(e, 7);
  assert.equal(e.state.b.hp, 10000);
  assert.equal(e.state.metrics.throwTech, 1);
  assert.ok(e.state.a.throwProtect > 0 && e.state.b.throwProtect > 0);
});

test('holding throw-tech cannot renew the seven-frame protection window indefinitely', () => {
  const e = close(make());
  frames(e, 15, [{}, { tech: true }]);
  e.step(FIXED_DT, [{ slot: 'throw' }, { tech: true }]);
  frames(e, 7, [{}, { tech: true }]);
  assert.equal(e.state.b.hp, 9200);
  assert.equal(e.state.metrics.throwTech, undefined);
});

test('airborne opponents cannot be grabbed', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ slot: 'throw' }, { jump: true }]);
  frames(e, 7);
  assert.ok(e.state.b.y < ARENA.floor);
  assert.equal(e.state.b.hp, 10000);
});

test('an active melee parry counters a strike but does not confer permanent immunity', () => {
  const e = close(make({ fighters: [fighter('pomni'), fighter('jax', {
    specialBack: { kind: 'parry', startup: 1, active: 12, recovery: 24, damage: 450, parryMode: 'melee', cost: 0 },
  })] }));
  e.step(FIXED_DT, [{ slot: 'light' }, { slot: 'specialBack' }]);
  frames(e, 5);
  assert.equal(e.state.b.hp, 10000);
  assert.equal(e.state.a.hp, 9550);
  assert.equal(e.state.metrics.parry, 1);
  assert.equal(e.state.b.attack, null);
  assert.ok(e.state.b.cool > 0);
});

test('projectile parry reflects once, changes ownership and retains a bounded travel budget', () => {
  const e = make({ fighters: [fighter('pomni'), fighter('bubble', {
    specialBack: { kind: 'parry', startup: 1, active: 60, recovery: 20, parryMode: 'projectile', cost: 0 },
  })] });
  e.state.a.x = 400;
  e.state.b.x = 750;
  e.step(FIXED_DT, [{ slot: 'special' }, { slot: 'specialBack' }]);
  frames(e, 34);
  assert.equal(e.state.metrics.reflect, 1);
  assert.equal(e.state.b.hp, 10000);
  assert.ok(e.state.projectiles.some(q => q.owner === 1 && q.reflections === 1));
  frames(e, 35);
  assert.ok(e.state.a.hp < 10000);
  assert.equal(e.state.projectiles.length, 0);
});

test('fast projectiles use swept collision and cannot skip a small body', () => {
  const e = make({ fighters: [fighter('jax', {
    special: { startup: 1, speed: 90, reach: 500, height: 80, damage: 600, cost: 0 },
  }), fighter('bubble', {}, { combat: { simulationBody: { width: 28, height: 100 } } })] });
  e.state.a.x = 400;
  e.state.b.x = 575;
  e.step(FIXED_DT, [{ slot: 'special' }, {}]);
  frames(e, 3);
  assert.equal(e.state.b.hp, 9400);
  assert.equal(e.state.a.stats.hits, 1);
});

test('a declared projectile range limits travel even with long lifetime', () => {
  const e = make({ fighters: [fighter('pomni', {
    special: { startup: 1, reach: 80, speed: 20, life: 200, cost: 0 },
  }), fighter('jax')] });
  e.state.a.x = 400;
  e.state.b.x = 700;
  e.step(FIXED_DT, [{ slot: 'special' }, {}]);
  frames(e, 30);
  assert.equal(e.state.b.hp, 10000);
  assert.equal(e.state.projectiles.length, 0);
});

test('crouching evades a high projectile at the correct vertical height', () => {
  const e = make({ fighters: [fighter('pomni', { special: { startup: 1, height: 145, cost: 0 } }), fighter('jax')] });
  e.state.a.x = 400;
  e.state.b.x = 650;
  e.step(FIXED_DT, [{ slot: 'special' }, { down: true }]);
  frames(e, 35, [{}, { down: true }]);
  assert.equal(e.state.b.hp, 10000);
});

test('hit-confirm cancels require a real hit; whiffed attacks cannot cancel', () => {
  const hit = close(make());
  hit.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(hit, 5);
  hit.step(FIXED_DT, [{ slot: 'heavy' }, {}]);
  assert.equal(hit.state.a.attack.name, 'heavy');
  assert.equal(hit.state.metrics.confirmCancel, 1);
  const miss = make();
  miss.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(miss, 5);
  miss.step(FIXED_DT, [{ slot: 'heavy' }, {}]);
  assert.equal(miss.state.a.attack.name, 'light');
  assert.equal(miss.state.metrics.confirmCancel, undefined);
});

test('simultaneous active strikes trade damage and double KO does not favor player one', () => {
  const e = close(make());
  e.state.a.hp = e.state.b.hp = 300;
  e.step(FIXED_DT, [{ slot: 'light' }, { slot: 'light' }]);
  frames(e, 5);
  assert.equal(e.state.a.hp, 0);
  assert.equal(e.state.b.hp, 0);
  assert.equal(e.state.roundWinner, -1);
  assert.deepEqual(e.state.wins, [0, 0]);
  assert.equal(e.state.phase, 'roundOver');
});

test('resource and super costs are checked and denied actions do not consume meter', () => {
  const e = close(make());
  e.state.a.r = 0;
  e.step(FIXED_DT, [{ slot: 'special' }, {}]);
  assert.equal(e.state.a.attack, null);
  assert.equal(e.state.a.meter, 0);
  e.step(FIXED_DT, [{ slot: 'super' }, {}]);
  assert.equal(e.state.a.attack, null);
  assert.equal(e.state.metrics.denied, 2);
  e.state.a.meter = 100;
  e.step(FIXED_DT, [{ slot: 'super' }, {}]);
  assert.equal(e.state.a.attack.name, 'super');
  assert.equal(e.state.a.meter, 50);
});

test('interrupted recovery does not grant free energy', () => {
  const e = close(make());
  e.state.a.r = 10;
  e.step(FIXED_DT, [{ slot: 'utility' }, { slot: 'light' }]);
  frames(e, 41);
  assert.equal(e.state.a.attack, null);
  assert.equal(e.state.metrics.recover, undefined);
  assert.ok(e.state.a.r < 11, 'only the normal pre-action passive regeneration is allowed');
});

test('traps have arming time and finite lifetime', () => {
  const e = make({ fighters: [fighter('pomni', {
    specialDown: { startup: 1, reach: 90, arm: 20, duration: 25, cost: 0, damage: 500 },
  }), fighter('jax')] });
  e.state.a.x = 500;
  e.state.b.x = 590;
  e.step(FIXED_DT, [{ slot: 'specialDown' }, {}]);
  assert.equal(e.state.traps.length, 1);
  frames(e, 10);
  assert.equal(e.state.b.hp, 10000);
  frames(e, 10);
  assert.equal(e.state.b.hp, 9500);
  assert.equal(e.state.traps.length, 0);
});

test('pause freezes combat, timer and seed without queuing a phantom attack', () => {
  const e = make({ cpu: [false, true] });
  frames(e, 60);
  e.pause(true);
  const before = e.getSnapshot();
  frames(e, 120, [{ super: true, right: true }, {}]);
  assert.deepEqual(e.getSnapshot(), before);
  e.pause(false);
  e.step(FIXED_DT);
  assert.equal(e.state.a.attack, null);
  assert.equal(e.state.frame, before.frame + 1);
});

test('round settings end a match only after the configured number of wins', () => {
  const e = close(make({ roundsToWin: 2 }));
  e.state.b.hp = 1;
  e.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(e, 5);
  assert.equal(e.state.phase, 'roundOver');
  assert.deepEqual(e.state.wins, [1, 0]);
  const snapshot = e.getSnapshot();
  frames(e, 200);
  assert.deepEqual(e.getSnapshot(), snapshot, 'rounds do not advance without UI acknowledgement');
  assert.equal(e.nextRound(), true);
  close(e);
  e.state.b.hp = 1;
  e.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(e, 5);
  assert.equal(e.state.phase, 'matchOver');
  assert.equal(e.state.winner, 0);
  assert.deepEqual(e.state.wins, [2, 0]);
  assert.equal(e.nextRound(), false);
});

test('timeout draws award nobody a win and no-time-limit mode stays active', () => {
  const timed = make({ roundTime: 1 });
  frames(timed, 60);
  assert.equal(timed.state.phase, 'roundOver');
  assert.equal(timed.state.roundWinner, -1);
  assert.deepEqual(timed.state.wins, [0, 0]);
  const infinite = make({ roundTime: 0 });
  frames(infinite, 600);
  assert.equal(infinite.state.phase, 'fight');
  assert.equal(infinite.state.timer, Infinity);
});

test('training reset, health recovery and all dummy modes remain playable', () => {
  const e = close(make({ mode: 'training', autoheal: true, freeMeter: true }));
  e.setTraining({ dummy: 'block' });
  e.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(e, 5);
  assert.equal(e.state.b.hp, 9962);
  assert.equal(e.state.a.meter, 100);
  frames(e, 160);
  assert.equal(e.state.b.hp, 10000);
  e.setTraining({ dummy: 'jump' });
  e.step(FIXED_DT);
  assert.ok(e.state.b.y < ARENA.floor);
  e.reset();
  assert.equal(e.state.b.hp, 10000);
  assert.equal(e.state.a.stats.hits, 0);
  assert.equal(e.state.phase, 'fight');
});

test('seeded CPU selects attacks repeatedly and produces deterministic replays', () => {
  const a = make({ cpu: [true, true], seed: 987, roundTime: 0 });
  const b = make({ cpu: [true, true], seed: 987, roundTime: 0 });
  frames(a, 1500);
  frames(b, 1500);
  assert.deepEqual(a.getSnapshot(), b.getSnapshot());
  assert.ok(a.state.a.stats.starts > 6);
  assert.ok(a.state.b.stats.starts > 6);
  assert.ok(a.state.a.stats.damage > 0);
  assert.ok(a.state.b.stats.damage > 0);
});

test('a narrow arena still spawns separated, alive fighters inside its boundaries', () => {
  const e = make({ stage: { id: 'small', bounds: { left: 480, right: 800 } } });
  assert.ok(e.state.b.x - e.state.a.x > 100);
  assert.equal(e.state.a.hp, 10000);
  frames(e, 300, [{ left: true }, { right: true }]);
  assert.equal(e.state.a.x, 480);
  assert.equal(e.state.b.x, 800);
  assert.equal(e.state.phase, 'fight');
});

test('retreat dash obeys the held direction instead of forcing forward motion', () => {
  const e = make();
  const start = e.state.a.x;
  e.step(FIXED_DT, [{ left: true, dash: true }, {}]);
  assert.ok(e.state.a.x < start);
});

test('invalid elapsed time and an inactive tab cannot corrupt or fast-forward simulation', () => {
  const e = make();
  for (const dt of [NaN, Infinity, -1]) e.step(dt, [{ light: true }, {}]);
  assert.equal(e.state.frame, 0);
  e.step(1000);
  assert.equal(e.state.frame, 15);
  assert.ok(Number.isFinite(e.state.a.x));
});

test('differently sized authored bodies drive actual collision geometry', () => {
  const e = make({ fighters: [fighter('bubble', {}, { combat: { simulationBody: { width: 60, height: 110, crouchHeight: 75 } } }), fighter('queen', {}, { combat: { simulationBody: { width: 160, height: 285, crouchHeight: 180 } } })] });
  assert.equal(e.box(0).h, 110);
  assert.equal(e.box(1).w, 160);
  e.step(FIXED_DT, [{ crouch: true }, {}]);
  assert.equal(e.box(0).h, 75);
});

test('draining events does not lose combat metrics and snapshots serialize', () => {
  const e = close(make());
  e.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(e, 5);
  assert.ok(e.drainEvents().some(event => event.type === 'damage'));
  assert.deepEqual(e.drainEvents(), []);
  assert.equal(e.state.metrics.damage, 1);
  assert.equal(JSON.parse(JSON.stringify(e.getSnapshot())).fighters[1].hp, 9680);
});

test('all 140 authored Digital Circus moves activate, spend bounded resources and leave finite state', () => {
  let count = 0;
  for (const f of FIGHTERS) for (const slot of MOVE_SLOTS) {
    const e = make({ fighters: [f, FIGHTERS[0]], mode: 'training', autoheal: false, freeMeter: false, freeResource: false });
    e.state.a.meter = 100;
    e.state.a.gray = 1000;
    e.state.a.hp -= 1000;
    const definition = e.state.a.f.combat.moves[slot];
    const before = e.state.a.r;
    e.step(FIXED_DT, [{ slot }, {}]);
    assert.equal(e.state.a.stats.starts, 1, `${f.id}.${slot} must start`);
    assert.ok(e.state.a.r <= before + 0.2 && e.state.a.r >= 0, `${f.id}.${slot} resource bounds`);
    frames(e, definition.startup + definition.active + definition.recovery + 2);
    assert.equal(e.state.a.stats.activations, 1, `${f.id}.${slot} must activate exactly once`);
    assert.equal(e.state.a.attack, null, `${f.id}.${slot} must recover`);
    for (const p of e.state.fighters) for (const key of ['x', 'y', 'hp', 'r', 'guard', 'meter']) {
      assert.ok(Number.isFinite(p[key]), `${f.id}.${slot} ${key} must stay finite`);
    }
    count++;
  }
  assert.equal(count, 140);
});

test('every roster fighter can run the actual seeded CPU against another authored profile', () => {
  for (let index = 0; index < FIGHTERS.length; index++) {
    const e = make({ fighters: [FIGHTERS[index], FIGHTERS[(index + 5) % FIGHTERS.length]],
      stage: STAGES[index % STAGES.length], cpu: [true, true], seed: 500 + index, roundTime: 0 });
    frames(e, 1200);
    assert.ok(e.state.a.stats.starts >= 3, `${FIGHTERS[index].id} must choose multiple moves`);
    assert.ok(e.state.b.stats.starts >= 3, `${FIGHTERS[index].id}'s opponent must choose multiple moves`);
    assert.ok(e.state.a.stats.damage + e.state.b.stats.damage > 0, `${FIGHTERS[index].id} match must produce real damage`);
  }
});

test('unaffordable hit-confirm cancels do not erase the original recovery', () => {
  const e = close(make({ fighters: [fighter('pomni', { heavy: { cost: 100 } }), fighter('jax')] }));
  e.state.a.r = 0;
  e.step(FIXED_DT, [{ slot: 'light' }, {}]);
  frames(e, 5);
  e.step(FIXED_DT, [{ slot: 'heavy' }, {}]);
  assert.equal(e.state.a.attack.name, 'light');
  assert.equal(e.state.a.chainDepth, 0);
});

test('timeout compares remaining health percentage across unequal maximum health', () => {
  const e = make({ fighters: [fighter('small', {}, { stats: { health: 5000 } }), fighter('large')], roundTime: 1 });
  frames(e, 60);
  assert.equal(e.state.roundWinner, -1);
  assert.deepEqual(e.state.wins, [0, 0]);
});

test('native jump velocity can be authored in pixels per frame without changing its height', () => {
  const e = make({ fighters: [FIGHTERS[0], FIGHTERS[1]] });
  e.step(FIXED_DT, [{ jump: true }, {}]);
  assert.ok(Math.abs(e.state.a.vy - (-12.6 + 0.72)) < 1e-9);
});

test('every roster light and heavy lands at native body-push spacing against every body in both directions', () => {
  for (const attacker of FIGHTERS) for (const defender of FIGHTERS) for (const slot of ['light', 'heavy']) for (const face of [1, -1]) {
    const e = make({ fighters: [attacker, defender] });
    e.state.a.x = 640; e.state.b.x = 640 + face;
    e.step(FIXED_DT);
    const expectedGap = (e.box(0).w + e.box(1).w) * .30;
    assert.ok(Math.abs(Math.abs(e.state.a.x - e.state.b.x) - expectedGap) < 1e-8);
    assert.equal(e.state.a.face, face);
    e.step(FIXED_DT, [{ slot }, {}]);
    frames(e, e.state.a.f.combat.moves[slot].startup + 2);
    assert.ok(e.state.a.stats.damage > 0, `${attacker.id}.${slot} must hit ${defender.id} at the native push limit facing ${face}`);
  }
});

test('all roster light and heavy attacks reach beyond their visible body front, including the elongated Queen', () => {
  for (const attacker of FIGHTERS) for (const defender of FIGHTERS) for (const slot of ['light', 'heavy']) for (const face of [1, -1]) {
    const e = make({ fighters: [attacker, defender] });
    const distance = (e.box(0).w + e.box(1).w) / 2 + .5;
    e.state.a.x = face > 0 ? 400 : 900;
    e.state.b.x = e.state.a.x + distance * face;
    e.step(FIXED_DT, [{ slot }, {}]);
    frames(e, e.state.a.f.combat.moves[slot].startup + 2);
    assert.ok(e.state.a.stats.damage > 0, `${attacker.id}.${slot} must reach ${defender.id} from visible contact facing ${face}`);
  }
});

test('Bubble projectiles originate inside its authored small body and hit a standing opponent', () => {
  const bubble = FIGHTERS.find(f => f.id === 'bubble');
  for (const slot of ['special', 'super']) {
    const e = make({ fighters: [bubble, FIGHTERS[1]] });
    e.state.a.meter = 100;
    e.step(FIXED_DT, [{ slot }, {}]);
    frames(e, e.state.a.f.combat.moves[slot].startup - 1);
    const projectile = e.state.projectiles[0], body = e.box(0);
    assert.ok(projectile, `${slot} must spawn`);
    assert.ok(projectile.y >= body.y && projectile.y <= body.y + body.h,
      `${slot} origin must match Bubble's body, not a tall humanoid offset`);
    frames(e, 100);
    assert.ok(e.state.a.stats.damage > 0, `${slot} must produce actual damage from the normal spawn positions`);
  }
});

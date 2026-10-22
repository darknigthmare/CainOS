import test from 'node:test';
import assert from 'node:assert/strict';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { InputController } from '../combat/input.mjs';
import {
  GAME_VERSION, SAVE_KEY, SLOT_ORDER, MAX_PACKED_INPUT, DEFAULT_SETTINGS,
  emptyProfile, cleanSettings, validateProfile, readProfile, saveProfile,
  packInput, unpackInput, appendReplayFrame, validateReplay, replayInputs,
  CHALLENGES, makeRun, createMatchStats, collectMatchStats, challengeProgress,
} from '../combat/session.mjs';

const fighterIds = FIGHTERS.map(f => f.id);
const stageIds = STAGES.map(s => s.id);
const flags = ['left', 'right', 'down', 'guard', 'jump', 'dash', 'tech'];
const idle = () => ({ slot: null });
const replayFixture = (overrides = {}) => ({
  format: 'circus-encore-replay', version: GAME_VERSION,
  config: { fighters: ['pomni', 'jax'], stage: stageIds[0], cpu: [false, true],
    difficulty: 'easy', seed: 20261021, roundTime: 60, roundsToWin: 2, initialHealth: [10000, 10000] },
  runs: [[1, 0, 0]], ...overrides,
});
const validated = value => validateReplay(value, fighterIds, stageIds);
const engineFor = config => new CombatEngine({
  ...config, fighters: config.fighters.map(id => FIGHTERS.find(f => f.id === id)),
  stage: STAGES.find(s => s.id === config.stage),
});

test('all native input flags and all ten techniques survive packing without aliasing', () => {
  const encoded = new Set();
  for (const slot of [null, ...SLOT_ORDER]) for (let mask = 0; mask < 128; mask++) {
    const input = { slot };
    flags.forEach((key, bit) => { input[key] = !!(mask & (1 << bit)); });
    const packed = packInput(input);
    assert.deepEqual(unpackInput(packed), input);
    encoded.add(packed);
  }
  assert.equal(encoded.size, 128 * 11);
  assert.equal(Math.max(...encoded), MAX_PACKED_INPUT);
  assert.equal(MAX_PACKED_INPUT, 1407);
  assert.equal(packInput({ slot: 'grab' }), packInput({ slot: 'throw' }));
});

test('replay runs compress held inputs, split long runs and reproduce the exact frame sequence', () => {
  const runs = [];
  const input = [{ right: true, guard: true, slot: null }, { down: true, slot: 'low' }];
  for (let frame = 0; frame < 3601; frame++) appendReplayFrame(runs, input);
  appendReplayFrame(runs, [{ slot: 'super', tech: true }, {}]);
  assert.deepEqual(runs.map(r => r[0]), [3600, 1, 1]);
  const replay = validated(replayFixture({ runs }));
  const frames = [...replayInputs(replay)];
  assert.equal(replay.frames, 3602);
  assert.equal(frames.length, 3602);
  assert.deepEqual(frames[0], input.map(v => unpackInput(packInput(v))));
  assert.deepEqual(frames[3600], frames[0]);
  assert.equal(frames[3601][0].slot, 'super');
  assert.equal(frames[3601][0].tech, true);
  frames[0][0].right = false;
  assert.equal(frames[1][0].right, true, 'expanded frames have independent input objects');
});

test('replay import rejects corrupt technique bits, oversized durations and malformed frames', () => {
  assert.equal(validated(replayFixture({ runs: [[1, MAX_PACKED_INPUT, MAX_PACKED_INPUT]] })).frames, 1);
  for (const corrupt of [-1, MAX_PACKED_INPUT + 1, 1535, 1536, 2 ** 32, .5, null, '128']) {
    assert.throws(() => validated(replayFixture({ runs: [[1, corrupt, 0]] })), /corrompue/);
  }
  for (const runs of [[], [[0, 0, 0]], [[3601, 0, 0]], [[1, 0]], [[1, 0, 0, 0]], Array.from({ length: 21 }, () => [3600, 0, 0])]) {
    assert.throws(() => validated(replayFixture({ runs })));
  }
  assert.equal(validated(replayFixture({ runs: Array.from({ length: 20 }, () => [3600, 0, 0]) })).frames, 72000);
});

test('replay import validates version, roster, rules and carried survival health', () => {
  const original = replayFixture();
  for (const change of [
    { fighters: ['missing', 'jax'] }, { fighters: ['pomni'] }, { stage: 'missing' },
    { seed: -1 }, { seed: 4294967296 }, { seed: 1.5 }, { cpu: [false, 1] },
    { roundsToWin: 0 }, { roundsToWin: 4 }, { roundTime: 1 }, { difficulty: 'impossible' },
    { initialHealth: [0, 10000] }, { initialHealth: [10001, 10000] },
    { initialHealth: [100, 1.5] }, { initialHealth: [100] }, { initialHealth: null },
  ]) assert.throws(() => validated({ ...original, config: { ...original.config, ...change } }), JSON.stringify(change));
  assert.throws(() => validated({ ...original, version: 'old-build' }), /incompatible/);
  const valid = validated({ ...original, config: { ...original.config, initialHealth: [4075, 10000] } });
  assert.deepEqual(valid.config.initialHealth, [4075, 10000]);
  original.config.fighters[0] = 'caine';
  assert.equal(valid.config.fighters[0], 'pomni', 'validation takes an independent copy');
});

test('profile import keeps recognized progress and sanitizes settings without sharing defaults', () => {
  const profile = emptyProfile();
  profile.settings = { volume: Infinity, seconds: 0, rounds: 99, difficulty: 'broken', layout: 'unknown', touch: 'on', sound: false };
  profile.stats = { matches: 12, wins: 8, losses: 4, bestSurvival: 900, damage: -1 };
  profile.challenges = ['combo', 'combo', 'guard', 'invented'];
  profile.medals = ['arcade', 'survival', 'super-admin', 'arcade'];
  profile.history = Array.from({ length: 18 }, () => ({ fighter: 'p'.repeat(100), opponent: 'jax', mode: 'local', won: true, ignored: 'extra' }));
  const clean = validateProfile(profile);
  assert.deepEqual(clean.challenges, ['combo', 'guard']);
  assert.deepEqual(clean.medals, ['arcade', 'survival']);
  assert.equal(clean.stats.bestSurvival, 10);
  assert.equal(clean.stats.damage, 0);
  assert.equal(clean.settings.seconds, 90);
  assert.equal(clean.settings.volume, .25);
  assert.equal(clean.settings.sound, false);
  assert.equal(clean.settings.touch, 'on');
  assert.equal(clean.history.length, 12);
  assert.equal(clean.history[0].fighter.length, 60);
  assert.equal(clean.history[0].ignored, undefined);
  clean.settings.seconds = 60;
  assert.equal(emptyProfile().settings.seconds, DEFAULT_SETTINGS.seconds);
  assert.equal(cleanSettings(null).layout, 'azerty');
  assert.throws(() => validateProfile({ ...profile, version: 2 }), /version 1/);
});

test('storage corruption or denied local storage does not prevent a fresh playable profile', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const profile = emptyProfile();
  profile.challenges = ['super'];
  assert.equal(saveProfile(storage, profile), true);
  assert.deepEqual(readProfile(storage), profile);
  values.set(SAVE_KEY, '{invalid');
  assert.deepEqual(readProfile(storage), emptyProfile());
  const denied = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } };
  assert.deepEqual(readProfile(denied), emptyProfile());
  assert.equal(saveProfile(denied, profile), false);
});

test('every selectable fighter receives complete arcade, boss and survival routes', () => {
  for (const fighter of FIGHTERS) for (const [mode, count] of [['arcade', 6], ['boss', 4], ['survival', 10]]) {
    const run = makeRun(mode, fighter.id, FIGHTERS, STAGES);
    assert.equal(run.opponents.length, count, `${fighter.id} ${mode}`);
    assert.equal(run.stages.length, count);
    assert.ok(run.opponents.every(id => fighterIds.includes(id)));
    assert.ok(run.stages.every(id => stageIds.includes(id)));
    assert.equal(run.health, 10000);
    if (mode === 'arcade') assert.equal(run.opponents.at(-1), 'caine');
    if (mode === 'survival') assert.ok(run.opponents.every(id => id !== fighter.id));
  }
  assert.throws(() => makeRun('versus', 'pomni', FIGHTERS, STAGES));
  assert.throws(() => makeRun('arcade', 'missing', FIGHTERS, STAGES));
  assert.throws(() => makeRun('arcade', 'pomni', FIGHTERS, []));
});

// These strategies use only currently visible state and legal player inputs.
// They never modify positions, health, meter, cooldowns or the CPU's decisions.
function exerciseInput(challenge, engine, stats) {
  const { a, b } = engine.state;
  const distance = Math.abs(a.x - b.x), input = idle();
  const advance = () => { input[a.x < b.x ? 'right' : 'left'] = true; };
  if (challenge.id === 'guard') {
    if (distance > 155) advance(); else input.guard = true;
    if (input.guard && b.attack?.def.level === 'low') input.down = true;
  } else if (challenge.id === 'specialist') {
    if (!a.attack && !a.hit && !a.cool) input.slot = ['light', 'heavy', 'special', 'utility'].find(slot => !stats.unique.has(slot)) || null;
  } else if (distance > 75 && !a.attack) advance();
  else if (challenge.id === 'throw') {
    if (!a.attack && !a.hit && !b.throwProtect) input.slot = 'throw';
  } else if (challenge.id === 'super') {
    if (!a.attack && !a.hit) input.slot = 'super';
  } else if (a.attack?.confirmed) {
    input.slot = a.attack.name === 'light' ? 'heavy' : a.attack.name === 'heavy' ? 'specialForward' : null;
  } else if (!a.attack && !a.hit) input.slot = 'light';
  return input;
}

for (const challenge of CHALLENGES) {
  test(`challenge ${challenge.id} can be completed from normal spawns within 60 seconds`, () => {
    const engine = new CombatEngine({ fighters: [FIGHTERS[0], FIGHTERS[1]], stage: STAGES[0],
      mode: 'training', cpu: [false, false], difficulty: 'normal', seed: 123456 });
    engine.setTraining({ dummy: challenge.dummy, freeMeter: true, freeResource: true, autoheal: true });
    const stats = createMatchStats();
    let elapsed = 0;
    while (elapsed < 3600 && challengeProgress(challenge, stats[0]) < challenge.goal) {
      engine.step(FIXED_DT, [exerciseInput(challenge, engine, stats[0]), idle()]);
      collectMatchStats(stats, engine.drainEvents(), engine.state);
      elapsed++;
    }
    assert.ok(challengeProgress(challenge, stats[0]) >= challenge.goal,
      `${challenge.id}: ${challengeProgress(challenge, stats[0])}/${challenge.goal} after ${elapsed} frames`);
    assert.ok(elapsed < 900, 'the exercise should leave a reasonable margin for a human player');
    assert.equal(engine.state.phase, 'fight');
    assert.ok(engine.state.a.life > 0);
  });
}

test('actual blocked, throw and multi-projectile super events credit the correct player and technique', () => {
  const engine = new CombatEngine({ fighters: [FIGHTERS.find(f => f.id === 'caine'), FIGHTERS[1]],
    mode: 'training', cpu: [false, false], seed: 7, autoheal: false });
  const stats = createMatchStats();
  engine.setTraining({ dummy: 'block' });
  const guardChallenge = { id: 'first-impact' };
  for (let frame = 0; frame < 220; frame++) {
    engine.step(FIXED_DT, [exerciseInput(guardChallenge, engine, stats[0]), idle()]);
    collectMatchStats(stats, engine.drainEvents(), engine.state);
  }
  assert.ok(stats[1].blocked > 0);
  assert.equal(stats[0].blocked, 0);
  assert.equal(stats[0].throws, 0);
  engine.setTraining({ dummy: 'idle' });
  let superDamageEvents = 0;
  for (let frame = 0; frame < 240; frame++) {
    engine.step(FIXED_DT, [{ slot: frame === 70 ? 'super' : null }, idle()]);
    const events = engine.drainEvents();
    superDamageEvents += events.filter(e => e.type === 'damage' && !e.blocked && e.actor === 0 && e.slot === 'super').length;
    collectMatchStats(stats, events, engine.state);
  }
  assert.ok(superDamageEvents > 1, 'a multi-projectile final creates actual super impacts');
  assert.equal(stats[0].supers, superDamageEvents);
  assert.equal(stats[1].supers, 0);
  assert.equal(stats[0].damage, engine.state.a.stats.damage);
});

test('a complete multi-round human-versus-CPU recording replays identical state and results', () => {
  const record = replayFixture({ runs: [] });
  const original = engineFor(record.config), stats = createMatchStats(), checkpoints = [];
  let elapsed = 0;
  while (original.state.phase !== 'matchOver' && elapsed < 18000) {
    if (original.state.phase === 'roundOver') {
      checkpoints.push(original.getSnapshot());
      // Wall-clock intermissions and pauses contain no simulation input frames.
      original.pause(true);
      original.pause(false);
      assert.equal(original.nextRound(), true);
    }
    const inputs = [exerciseInput({ id: 'first-impact' }, original, stats[0]), idle()];
    appendReplayFrame(record.runs, inputs);
    original.step(FIXED_DT, inputs);
    collectMatchStats(stats, original.drainEvents(), original.state);
    elapsed++;
  }
  assert.equal(original.state.phase, 'matchOver');
  assert.ok(checkpoints.length >= 1);
  assert.ok(original.state.wins.includes(2));
  const replay = validated(JSON.parse(JSON.stringify(record)));
  const playback = engineFor(replay.config), replayStats = createMatchStats();
  let roundIndex = 0;
  for (const inputs of replayInputs(replay)) {
    if (playback.state.phase === 'roundOver') {
      assert.deepEqual(playback.getSnapshot(), checkpoints[roundIndex++]);
      assert.equal(playback.nextRound(), true);
    }
    playback.step(FIXED_DT, inputs);
    collectMatchStats(replayStats, playback.drainEvents(), playback.state);
  }
  assert.equal(replay.frames, elapsed);
  assert.deepEqual(playback.getSnapshot(), original.getSnapshot());
  assert.deepEqual(replayStats, stats);
});

test('native edge pulses remain deterministic when a pause separates adjacent recorded throw-tech inputs', () => {
  const config = { fighters: [FIGHTERS[0], FIGHTERS[1]], mode: 'local', cpu: [false, false], skipIntro: true };
  const original = new CombatEngine(config), playback = new CombatEngine(config), runs = [];
  for (const e of [original, playback]) { e.state.a.x = 500; e.state.b.x = 560; }
  const inputs = [
    [{ slot: null, tech: true }, idle()],
    [{ slot: null, tech: true }, { slot: 'throw' }],
    ...Array.from({ length: 8 }, () => [idle(), idle()]),
  ];
  inputs.forEach((frame, index) => {
    if (index === 1) { original.pause(true); original.pause(false); }
    appendReplayFrame(runs, frame);
    original.step(FIXED_DT, frame);
  });
  for (const frame of replayInputs({ runs })) playback.step(FIXED_DT, frame);
  assert.equal(original.state.metrics.throwTech, 1);
  assert.equal(playback.state.metrics.throwTech, 1);
  assert.equal(original.state.a.life, 10000);
  assert.deepEqual(playback.getSnapshot(), original.getSnapshot());
});

class EventSurface {
  constructor() { this.handlers = new Map(); }
  addEventListener(type, handler) { const list = this.handlers.get(type) || []; list.push(handler); this.handlers.set(type, list); }
  emit(type, value = {}) {
    const event = { target: { tagName: 'CANVAS' }, repeat: false, preventDefault() { this.prevented = true; }, ...value };
    for (const listener of this.handlers.get(type) || []) listener(event);
    return event;
  }
}
class TouchButton extends EventSurface {
  constructor(action) {
    super(); this.dataset = { control: action }; this.classes = new Set();
    this.classList = { add: v => this.classes.add(v), remove: v => this.classes.delete(v) };
  }
  setPointerCapture() {}
}
function withInputDOM(run) {
  const old = Object.fromEntries(['document', 'window', 'navigator'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const document = new EventSurface(), window = new EventSurface(), buttons = [], pads = [];
  document.hidden = false;
  document.querySelectorAll = () => buttons.filter(b => b.classes.has('pressed'));
  for (const [key, value] of Object.entries({ document, window, navigator: { getGamepads: () => pads } })) {
    Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  }
  let enabled = true, pauses = 0, helps = 0;
  const controls = new InputController({ enabled: () => enabled, onPause: () => { pauses++; }, onHelp: () => { helps++; } });
  const touch = actions => {
    const added = actions.map(action => new TouchButton(action)); buttons.push(...added);
    controls.bindTouch({ querySelectorAll: () => added });
    return Object.fromEntries(added.map(button => [button.dataset.control, button]));
  };
  try { return run({ controls, document, window, pads, touch, setEnabled: value => { enabled = value; }, pauses: () => pauses, helps: () => helps }); }
  finally { for (const [key, descriptor] of Object.entries(old)) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } }
}

test('a keyboard attack pressed and released between polls starts exactly once in the combat engine', () => withInputDOM(({ controls, document }) => {
  document.emit('keydown', { code: 'KeyJ' });
  document.emit('keyup', { code: 'KeyJ' });
  const engine = new CombatEngine({ fighters: [FIGHTERS[0], FIGHTERS[1]], cpu: [false, false], skipIntro: true });
  engine.step(FIXED_DT, controls.poll(engine.state.fighters));
  assert.equal(engine.state.a.attack.name, 'light');
  for (let frame = 0; frame < 90; frame++) engine.step(FIXED_DT, controls.poll(engine.state.fighters));
  assert.equal(engine.state.a.stats.starts, 1);
}));

test('keyboard direction plus special follows facing and a held action is not retriggered', () => withInputDOM(({ controls, document }) => {
  document.emit('keydown', { code: 'KeyD' });
  document.emit('keydown', { code: 'KeyI' });
  assert.equal(controls.poll([{ face: 1 }])[0].slot, 'specialForward');
  document.emit('keydown', { code: 'KeyI', repeat: true });
  assert.equal(controls.poll([{ face: 1 }])[0].slot, null);
  document.emit('keyup', { code: 'KeyI' });
  document.emit('keydown', { code: 'KeyI' });
  assert.equal(controls.poll([{ face: -1 }])[0].slot, 'specialBack');
  document.emit('keydown', { code: 'KeyS' });
  document.emit('keyup', { code: 'KeyI' });
  document.emit('keydown', { code: 'KeyI' });
  assert.equal(controls.poll([{ face: -1 }])[0].slot, 'specialDown');
}));

test('two local keyboard maps remain independent and form fields do not trigger attacks', () => withInputDOM(({ controls, document }) => {
  document.emit('keydown', { code: 'KeyJ', target: { tagName: 'INPUT' } });
  assert.equal(controls.poll()[0].slot, null);
  document.emit('keydown', { code: 'KeyK' });
  document.emit('keydown', { code: 'KeyB' });
  const inputs = controls.poll([], true);
  assert.equal(inputs[0].slot, 'heavy');
  assert.equal(inputs[1].slot, 'light');
  document.emit('keyup', { code: 'KeyB' });
  document.emit('keydown', { code: 'KeyB' });
  assert.deepEqual(controls.poll([], false)[1], {});
}));

test('quick touch attacks retain directional specials and the dedicated throw-tech button', () => withInputDOM(({ controls, touch }) => {
  const buttons = touch(['right', 'special', 'tech', 'specialDown']);
  buttons.right.emit('pointerdown', { pointerId: 1 });
  buttons.special.emit('pointerdown', { pointerId: 2 });
  buttons.special.emit('pointerup', { pointerId: 2 });
  assert.equal(controls.poll([{ face: 1 }])[0].slot, 'specialForward');
  buttons.tech.emit('pointerdown', { pointerId: 3 });
  buttons.tech.emit('pointerup', { pointerId: 3 });
  const tech = controls.poll()[0];
  assert.equal(tech.tech, true);
  assert.equal(tech.slot, null);
  assert.equal(controls.poll()[0].tech, false);
  buttons.specialDown.emit('pointerdown', { pointerId: 4 });
  assert.equal(controls.poll()[0].slot, 'specialDown');
}));

test('multitouch releases only the matching pointer and inactive controls cannot queue an attack', () => withInputDOM(({ controls, touch, setEnabled }) => {
  const buttons = touch(['left', 'guard', 'light']);
  buttons.left.emit('pointerdown', { pointerId: 1 });
  buttons.guard.emit('pointerdown', { pointerId: 2 });
  let input = controls.poll()[0];
  assert.equal(input.left, true); assert.equal(input.guard, true);
  buttons.left.emit('pointercancel', { pointerId: 1 });
  input = controls.poll()[0];
  assert.equal(input.left, false); assert.equal(input.guard, true);
  assert.equal(buttons.left.classes.has('pressed'), false);
  assert.equal(buttons.guard.classes.has('pressed'), true);
  controls.clear();
  assert.equal(buttons.guard.classes.has('pressed'), false);
  setEnabled(false);
  buttons.light.emit('pointerdown', { pointerId: 3 });
  setEnabled(true);
  assert.equal(controls.poll()[0].slot, null);
}));

test('blur and tab hiding release movement and queued attacks without affecting key bindings', () => withInputDOM(({ controls, document, window }) => {
  document.emit('keydown', { code: 'KeyD' });
  document.emit('keydown', { code: 'KeyJ' });
  window.emit('blur');
  let input = controls.poll()[0];
  assert.equal(input.right, false); assert.equal(input.slot, null);
  document.emit('keydown', { code: 'KeyD' });
  document.hidden = true; document.emit('visibilitychange');
  assert.equal(controls.poll()[0].right, false);
  document.hidden = false;
  document.emit('keydown', { code: 'KeyJ' });
  assert.equal(controls.poll()[0].slot, 'light');
}));

test('standard gamepads provide separate player inputs and one action edge per physical press', () => withInputDOM(({ controls, pads, pauses }) => {
  const pad = () => ({ axes: [0, 0], buttons: Array.from({ length: 16 }, () => ({ pressed: false })) });
  pads.push(pad(), pad());
  pads[0].axes[0] = .8; pads[0].buttons[1].pressed = true;
  pads[1].buttons[2].pressed = true;
  let inputs = controls.poll([{ face: 1 }, { face: -1 }], true);
  assert.equal(inputs[0].right, true); assert.equal(inputs[0].slot, 'specialForward');
  assert.equal(inputs[1].slot, 'light');
  inputs = controls.poll([], true);
  assert.equal(inputs[0].slot, null); assert.equal(inputs[1].slot, null);
  pads[0].buttons[9].pressed = true;
  controls.poll([], true); controls.poll([], true);
  assert.equal(pauses(), 1);
  pads[0].buttons[9].pressed = false; controls.poll([], true);
  pads[0].buttons[9].pressed = true; controls.poll([], true);
  assert.equal(pauses(), 2);
}));

import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDIO_THEMES, CombatAudio } from '../combat/audio.mjs';
import { STAGES } from '../combat/data.mjs';

/** A deterministic audio clock tracks observable resource lifetime, not samples. */
async function withAudio(options, callback) {
  const names = ['AudioContext', 'webkitAudioContext', 'setInterval', 'clearInterval'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const contexts = [], timers = new Map(); let nextTimer = 0, pendingResume = null;
  const controls = { rejectResume: options.rejectResume || false, failNode: false };
  class Parameter {
    value = 1; events = [];
    setValueAtTime(value, time) { this.record('set', value, time); }
    setTargetAtTime(value, time, duration) { assert.ok(duration > 0); this.record('target', value, time); }
    linearRampToValueAtTime(value, time) { this.record('linear', value, time); }
    exponentialRampToValueAtTime(value, time) { assert.ok(value > 0); this.record('exponential', value, time); }
    cancelScheduledValues(time) { assert.ok(Number.isFinite(time)); }
    record(kind, value, time) { assert.ok(Number.isFinite(value)); assert.ok(Number.isFinite(time)); this.value = value; this.events.push({ kind, value, time }); }
  }
  class Node {
    constructor(context, kind) {
      this.context = context; this.kind = kind; this.targets = new Set(); this.disconnects = 0;
      if (kind === 'gain') this.gain = new Parameter();
      else { this.frequency = new Parameter(); this.startAt = null; this.stopAt = null; this.onended = null; this.ended = false; }
      context.nodes.push(this);
    }
    connect(target) { this.targets.add(target); return target; }
    disconnect() { this.disconnects++; this.targets.clear(); }
    start(at) { assert.equal(this.startAt, null); assert.ok(at >= this.context.currentTime); this.startAt = at; }
    stop(at = this.context.currentTime) { if (this.startAt === null) throw new Error('Not started'); this.stopAt = at; }
  }
  class Context {
    constructor() {
      if (options.failConstructor) throw new Error('Output unavailable');
      this.state = 'suspended'; this.currentTime = 0; this.nodes = []; this.listeners = new Set();
      this.resumeCalls = 0; this.closeCalls = 0; this.destination = {}; contexts.push(this);
    }
    createGain() { if (controls.failNode) throw new Error('Node quota reached'); return new Node(this, 'gain'); }
    createOscillator() { if (controls.failNode) throw new Error('Node quota reached'); return new Node(this, 'oscillator'); }
    addEventListener(type, handler) { assert.equal(type, 'statechange'); this.listeners.add(handler); }
    removeEventListener(type, handler) { assert.equal(type, 'statechange'); this.listeners.delete(handler); }
    changeState(state) { this.state = state; for (const handler of this.listeners) handler(); }
    resume() {
      this.resumeCalls++;
      if (controls.rejectResume) return Promise.reject(new Error('Gesture required'));
      if (options.holdResume) return new Promise(resolve => { pendingResume = () => { this.changeState('running'); resolve(); }; });
      this.changeState('running'); return Promise.resolve();
    }
    close() { this.closeCalls++; this.changeState('closed'); return Promise.resolve(); }
    advance(seconds, fireEnded = true) {
      this.currentTime += seconds;
      if (fireEnded) for (const node of this.nodes) {
        if (node.kind === 'oscillator' && !node.ended && node.stopAt !== null && node.stopAt <= this.currentTime) {
          node.ended = true; node.onended?.();
        }
      }
    }
  }
  const values = {
    AudioContext: options.absent || options.webkit ? undefined : Context,
    webkitAudioContext: options.webkit ? Context : undefined,
    setInterval: handler => { const id = ++nextTimer; timers.set(id, handler); return id; },
    clearInterval: id => timers.delete(id),
  };
  for (const [name, value] of Object.entries(values)) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  try {
    return await callback({ contexts, timers, controls, tick: () => { for (const handler of [...timers.values()]) handler(); },
      finishResume: () => { assert.ok(pendingResume); const resume = pendingResume; pendingResume = null; resume(); } });
  } finally {
    for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
}

test('every playable stage has a distinct frozen original arrangement', () => {
  assert.deepEqual(Object.keys(AUDIO_THEMES).sort(), STAGES.map(stage => stage.id).sort());
  assert.equal(Object.keys(AUDIO_THEMES).length, 12);
  assert.equal(new Set(Object.values(AUDIO_THEMES).map(theme => JSON.stringify(theme.melody))).size, 12);
  for (const arrangement of Object.values(AUDIO_THEMES)) {
    assert.ok(arrangement.title.length > 5); assert.ok(arrangement.bpm >= 60 && arrangement.bpm <= 180);
    assert.match(arrangement.provenance, /originale/);
    assert.ok(Object.isFrozen(arrangement) && Object.isFrozen(arrangement.melody) && Object.isFrozen(arrangement.scale));
  }
});

test('missing or denied audio remains an optional no-op', async () => {
  for (const options of [{ absent: true }, { failConstructor: true }]) await withAudio(options, async ({ contexts, timers }) => {
    const audio = new CombatAudio({ getSettings: () => ({ music: true }) });
    audio.setTheme('manor'); audio.setPaused(false);
    assert.equal(audio.play('damage'), false); assert.equal(await audio.unlock(), false);
    assert.equal(contexts.length, 0); assert.equal(timers.size, 0); assert.equal(audio.diagnostics.activeVoices, 0);
    audio.destroy(); assert.equal(await audio.unlock(), false);
  });
});

test('settings, themes and effects never construct audio before explicit unlock', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio();
  audio.setTheme('candy'); audio.setPaused(true); audio.setPaused(false); audio.play('win');
  assert.equal(contexts.length, 0); assert.equal(audio.diagnostics.contextState, 'uninitialized');
  assert.equal(await audio.unlock(), true); assert.equal(contexts.length, 1);
  assert.equal(audio.diagnostics.musicEnabled, false); assert.equal(audio.diagnostics.ambienceEnabled, true); assert.equal(timers.size, 1);
  assert.equal(audio.play('damage'), true);
  assert.equal(contexts[0].nodes.filter(node => node.kind === 'gain')[1].gain.value, .25);
  assert.ok(Object.isFrozen(audio.diagnostics));
  assert.throws(() => { audio.diagnostics.theme = 'void'; }, TypeError);
  assert.throws(() => { audio.diagnostics = {}; }, TypeError);
  audio.destroy();
}));

test('concurrent unlock gestures share one context and one pending resume', async () => withAudio({ holdResume: true }, async ({ contexts, finishResume, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) });
  const first = audio.unlock(), second = audio.unlock();
  assert.equal(first, second); assert.equal(contexts.length, 1); assert.equal(contexts[0].resumeCalls, 1);
  assert.equal(timers.size, 0); finishResume();
  assert.equal(await first, true); assert.equal(timers.size, 1);
  assert.equal(await audio.unlock(), true); assert.equal(contexts[0].resumeCalls, 1); assert.equal(timers.size, 1);
  audio.destroy();
}));

test('a denied resume can be retried only through another unlock gesture', async () => withAudio({ rejectResume: true }, async ({ contexts, controls, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) });
  assert.equal(await audio.unlock(), false);
  audio.setTheme('lake'); audio.play('start'); audio.setPaused(false);
  assert.equal(contexts[0].resumeCalls, 1); assert.equal(timers.size, 0); assert.ok(audio.diagnostics.error);
  controls.rejectResume = false;
  assert.equal(await audio.unlock(), true); assert.equal(contexts[0].resumeCalls, 2); assert.equal(audio.diagnostics.error, null);
  audio.destroy();
}));

test('twelve themes and the light menu arrangement share a single bounded scheduler', async () => withAudio({}, async ({ contexts, timers, tick }) => {
  const settings = { music: true }, audio = new CombatAudio({ getSettings: () => settings });
  await audio.unlock(); const context = contexts[0];
  assert.equal(timers.size, 1); assert.ok(audio.diagnostics.playing);
  for (const id of [...Object.keys(AUDIO_THEMES), 'menu']) {
    assert.equal(audio.setTheme(id), id);
    const before = audio.diagnostics.scheduledSteps; audio.setTheme(id);
    assert.equal(audio.diagnostics.scheduledSteps, before);
    for (let frame = 0; frame < 30; frame++) { context.advance(.05); tick(); assert.ok(audio.diagnostics.activeVoices <= 24); assert.equal(timers.size, 1); }
    assert.ok(audio.diagnostics.scheduledSteps > before);
  }
  audio.setTheme('__proto__'); assert.equal(audio.diagnostics.theme, 'menu');
  audio.destroy(); assert.equal(timers.size, 0);
  assert.ok(context.nodes.every(node => node.targets.size === 0));
}));

test('a delayed clock schedules only the next notes instead of a burst of missed music', async () => withAudio({}, async ({ contexts, tick }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); await audio.unlock();
  const before = audio.diagnostics.scheduledSteps; contexts[0].advance(600, false); tick();
  assert.ok(audio.diagnostics.scheduledSteps - before <= 4); assert.ok(audio.diagnostics.activeVoices <= 12);
  const liveOscillators = contexts[0].nodes.filter(node => node.kind === 'oscillator' && node.targets.size);
  assert.ok(liveOscillators.every(node => node.startAt >= 600));
  audio.destroy();
}));

test('effects and music honor independent mute and volume controls', async () => withAudio({}, async ({ contexts, timers, tick }) => {
  const settings = { sound: true, volume: .6, music: true, musicVolume: .15 };
  const audio = new CombatAudio({ getSettings: () => settings }); await audio.unlock();
  const context = contexts[0], [, sfx, music] = context.nodes.filter(node => node.kind === 'gain');
  assert.equal(sfx.gain.value, .6); assert.equal(music.gain.value, .15);
  assert.equal(audio.play('win'), true);
  settings.sound = false; audio.setTheme('menu');
  assert.equal(sfx.gain.value, 0); assert.equal(audio.play('damage'), false); assert.equal(timers.size, 1);
  settings.sound = true; settings.volume = 2; settings.music = false; audio.setTheme('menu');
  assert.equal(sfx.gain.value, 1); assert.equal(music.gain.value, 0); assert.equal(timers.size, 0);
  assert.equal(audio.play('damage'), true);
  settings.music = true; settings.musicVolume = -4; audio.setTheme('menu'); assert.equal(timers.size, 0);
  settings.musicVolume = NaN; audio.setTheme('menu'); assert.equal(music.gain.value, .2); assert.equal(timers.size, 1);
  settings.music = false; tick(); assert.equal(timers.size, 0);
  audio.destroy();
}));

test('effect bursts stay bounded and ended voices disconnect their nodes', async () => withAudio({}, async ({ contexts }) => {
  const audio = new CombatAudio(); await audio.unlock();
  const context = contexts[0];
  assert.equal(audio.play('unknown'), false); assert.equal(audio.play('__proto__'), false);
  assert.equal(audio.play('damage'), true); assert.equal(audio.play('hit'), false);
  for (const effect of ['block', 'parry', 'super', 'win', 'lose', 'recover', 'special', 'explosion']) audio.play(effect);
  assert.ok(audio.diagnostics.activeVoices <= 12);
  const sources = context.nodes.filter(node => node.kind === 'oscillator');
  context.advance(2); assert.equal(audio.diagnostics.activeVoices, 0);
  assert.ok(sources.every(node => node.targets.size === 0 && node.onended === null));
  assert.equal(audio.play('hit'), true); audio.destroy();
}));

test('pause immediately clears scheduled voices and resumes without old effects', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); await audio.unlock();
  audio.setTheme('grounds'); audio.play('win'); const context = contexts[0];
  const oldSources = context.nodes.filter(node => node.kind === 'oscillator');
  audio.setPaused(true); assert.equal(timers.size, 0); assert.equal(audio.diagnostics.activeVoices, 0);
  assert.equal(audio.play('damage'), false); assert.ok(oldSources.every(node => node.targets.size === 0));
  context.advance(40); audio.setPaused(false);
  assert.equal(audio.diagnostics.theme, 'grounds'); assert.equal(timers.size, 1);
  assert.ok(context.nodes.filter(node => node.kind === 'oscillator' && node.targets.size).every(node => node.startAt >= 40));
  audio.destroy();
}));

test('an interrupted context stops its clock and waits for an explicit unlock', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); await audio.unlock();
  const context = contexts[0]; context.changeState('suspended');
  assert.equal(timers.size, 0); assert.equal(audio.diagnostics.activeVoices, 0);
  audio.play('damage'); audio.setTheme('void');
  assert.equal(context.resumeCalls, 1); assert.equal(await audio.unlock(), true);
  assert.equal(context.resumeCalls, 2); assert.equal(timers.size, 1); audio.destroy();
}));

test('destroy is idempotent and a late resume cannot resurrect audio resources', async () => withAudio({ holdResume: true }, async ({ contexts, timers, finishResume }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) });
  const pending = audio.unlock(), context = contexts[0]; audio.destroy(); audio.destroy(); finishResume();
  assert.equal(await pending, false); assert.equal(await audio.unlock(), false);
  assert.equal(context.closeCalls, 1); assert.equal(context.listeners.size, 0); assert.equal(timers.size, 0);
  assert.ok(context.nodes.every(node => node.targets.size === 0));
  assert.equal(audio.play('win'), false); assert.equal(audio.diagnostics.destroyed, true);
}));

test('node allocation failure does not leak or prevent a later valid effect', async () => withAudio({}, async ({ contexts, controls }) => {
  const audio = new CombatAudio(); await audio.unlock();
  controls.failNode = true; assert.equal(audio.play('damage'), false); assert.equal(audio.diagnostics.activeVoices, 0);
  controls.failNode = false; assert.equal(audio.play('damage'), true);
  audio.destroy(); assert.ok(contexts[0].nodes.every(node => node.targets.size === 0));
}));

test('legacy WebKit contexts and missing settings keep safe defaults', async () => withAudio({ webkit: true }, async ({ contexts, timers }) => {
  const audio = new CombatAudio({ getSettings: () => { throw new Error('Profile unavailable'); } });
  assert.equal(await audio.unlock(), true); assert.equal(audio.play('select'), true);
  assert.equal(contexts.length, 1); assert.equal(timers.size, 0); assert.equal(audio.diagnostics.musicEnabled, false);
  audio.destroy();
}));

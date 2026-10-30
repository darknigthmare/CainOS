import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDIO_AMBIENCES, AUDIO_EFFECT_IDS, AUDIO_IMPACT_CUES, CombatAudio } from '../combat/audio.mjs';
import { AMBIENCE_STAGE_IDS } from '../combat/audio-ambiences.mjs';
import { STAGES } from '../combat/data.mjs';

/** Observable Web Audio resources with a deterministic, manually advanced clock. */
async function withAudio(options, callback) {
  const names = ['AudioContext', 'webkitAudioContext', 'setInterval', 'clearInterval'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const contexts = [], timers = new Map(); let nextTimer = 0, pendingResume;
  const controls = { failKind: null, rejectResume: false };
  class Parameter {
    value = 1; events = [];
    record(kind, value, time) { assert.ok(Number.isFinite(value)); assert.ok(Number.isFinite(time)); this.value = value; this.events.push({ kind, value, time }); }
    setValueAtTime(value, time) { this.record('set', value, time); }
    setTargetAtTime(value, time, duration) { assert.ok(duration > 0); this.record('target', value, time); }
    linearRampToValueAtTime(value, time) { this.record('linear', value, time); }
    exponentialRampToValueAtTime(value, time) { assert.ok(value > 0); this.record('exponential', value, time); }
    cancelScheduledValues(time) { assert.ok(Number.isFinite(time)); }
  }
  class Node {
    constructor(context, kind) {
      this.context = context; this.kind = kind; this.targets = new Set(); this.disconnects = 0;
      this.startAt = null; this.stopAt = null; this.onended = null; this.ended = false;
      if (kind === 'gain') this.gain = new Parameter();
      if (kind === 'oscillator' || kind === 'filter') this.frequency = new Parameter();
      if (kind === 'filter') this.Q = new Parameter();
      context.nodes.push(this);
    }
    connect(target) { this.targets.add(target); return target; }
    disconnect() { this.disconnects++; this.targets.clear(); }
    start(at) { assert.equal(this.startAt, null); assert.ok(at >= this.context.currentTime); this.startAt = at; }
    stop(at = this.context.currentTime) { if (this.startAt === null) throw new Error('Not started'); this.stopAt = at; }
  }
  class Context {
    constructor() {
      this.state = 'suspended'; this.currentTime = 0; this.sampleRate = 48000;
      this.nodes = []; this.buffers = []; this.listeners = new Set();
      this.resumeCalls = 0; this.closeCalls = 0; this.destination = {};
      if (options.noNoise) this.createBufferSource = undefined;
      contexts.push(this);
    }
    node(kind) { if (controls.failKind === kind) throw new Error('Simulated node quota'); return new Node(this, kind); }
    createGain() { return this.node('gain'); }
    createOscillator() { return this.node('oscillator'); }
    createBufferSource() { return this.node('bufferSource'); }
    createBiquadFilter() { return this.node('filter'); }
    createBuffer(channels, length, rate) {
      if (controls.failKind === 'buffer') throw new Error('Simulated buffer quota');
      assert.equal(channels, 1); assert.equal(rate, this.sampleRate); assert.ok(length <= rate * 2);
      const samples = new Float32Array(length), buffer = { length, sampleRate: rate, getChannelData: channel => { assert.equal(channel, 0); return samples; } };
      this.buffers.push(buffer); return buffer;
    }
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
      if (fireEnded) for (const node of this.nodes) if (['oscillator', 'bufferSource'].includes(node.kind) && !node.ended && node.stopAt !== null && node.stopAt <= this.currentTime) {
        node.ended = true; node.onended?.();
      }
    }
  }
  for (const [name, value] of Object.entries({
    AudioContext: Context, webkitAudioContext: undefined,
    setInterval: handler => { const id = ++nextTimer; timers.set(id, handler); return id; },
    clearInterval: id => timers.delete(id),
  })) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  try {
    return await callback({ contexts, timers, controls, tick: () => { for (const handler of [...timers.values()]) handler(); },
      finishResume: () => { assert.ok(pendingResume); const finish = pendingResume; pendingResume = null; finish(); } });
  } finally {
    for (const [name, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; }
  }
}
const liveSources = context => context.nodes.filter(node => ['oscillator', 'bufferSource'].includes(node.kind) && node.targets.size);
const buses = context => context.nodes.filter(node => node.kind === 'gain').slice(0, 4);

test('twelve immutable atmosphere scores cover the playable stages with distinct quiet textures', () => {
  assert.deepEqual(AMBIENCE_STAGE_IDS.slice().sort(), STAGES.map(stage => stage.id).sort());
  assert.equal(AMBIENCE_STAGE_IDS.length, 12);
  assert.equal(new Set(Object.values(AUDIO_AMBIENCES).map(item => JSON.stringify(item.layers))).size, 12);
  assert.ok(Object.isFrozen(AUDIO_AMBIENCES) && Object.isFrozen(AMBIENCE_STAGE_IDS));
  for (const item of Object.values(AUDIO_AMBIENCES)) {
    assert.ok(Object.isFrozen(item) && Object.isFrozen(item.layers));
    assert.match(item.provenance, /originale/);
    assert.ok(item.periodSeconds >= 6 && item.periodSeconds <= 12);
    assert.ok(item.layers.length >= 2 && item.layers.length <= 4);
    for (const layer of item.layers) {
      assert.ok(Object.isFrozen(layer));
      assert.ok(layer.delay >= 0 && layer.duration > 0);
      assert.ok(layer.delay + layer.duration < item.periodSeconds);
      assert.ok(layer.level > 0 && layer.level <= .025);
      assert.ok(layer.from > 0 && layer.to > 0);
    }
  }
});

test('stage atmospheres wait for an explicit unlock and the menu has no atmosphere', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio();
  audio.setTheme('bigtop'); assert.equal(contexts.length, 0); assert.equal(audio.diagnostics.ambiencePlaying, false);
  audio.setTheme('menu'); await audio.unlock();
  assert.equal(timers.size, 0); assert.equal(contexts[0].buffers.length, 0);
  audio.setTheme('bigtop');
  assert.equal(audio.diagnostics.musicEnabled, false); assert.equal(audio.diagnostics.playing, false);
  assert.equal(audio.diagnostics.ambienceEnabled, true); assert.equal(audio.diagnostics.ambiencePlaying, true);
  assert.equal(buses(contexts[0])[3].gain.value, .35); assert.equal(timers.size, 1);
  audio.setTheme('menu'); assert.equal(timers.size, 0); assert.equal(audio.diagnostics.ambienceVoices, 0);
  audio.setTheme('__proto__'); assert.equal(audio.diagnostics.theme, 'menu');
  audio.destroy();
}));

test('all twelve stages schedule audible resources and reuse one noise buffer', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio(); await audio.unlock(); const context = contexts[0];
  for (const id of AMBIENCE_STAGE_IDS) {
    audio.setTheme(id);
    const count = audio.diagnostics.scheduledAmbiences, sources = liveSources(context);
    assert.ok(sources.length >= 2 && sources.length <= 4, id);
    assert.equal(timers.size, 1);
    audio.setTheme(id);
    assert.equal(audio.diagnostics.scheduledAmbiences, count);
    assert.deepEqual(liveSources(context), sources);
  }
  assert.equal(context.buffers.length, 1); assert.equal(audio.diagnostics.noiseBuffers, 1);
  audio.destroy(); assert.equal(audio.diagnostics.noiseBuffers, 0);
  assert.ok(context.nodes.every(node => node.targets.size === 0));
}));

test('ambience, effects and music have independent mute and volume controls on a single clock', async () => withAudio({}, async ({ contexts, timers }) => {
  const settings = { sound: true, volume: .6, music: true, musicVolume: .15, ambience: true, ambienceVolume: .45 };
  const audio = new CombatAudio({ getSettings: () => settings }); audio.setTheme('lake'); await audio.unlock();
  const [master, sfx, music, ambience] = buses(contexts[0]);
  assert.equal(master.gain.value, .7); assert.equal(sfx.gain.value, .6); assert.equal(music.gain.value, .15); assert.equal(ambience.gain.value, .45);
  assert.equal(timers.size, 1);
  settings.sound = false; settings.music = false; audio.setTheme('lake');
  assert.equal(audio.play('trap'), false); assert.equal(sfx.gain.value, 0); assert.equal(music.gain.value, 0);
  assert.equal(ambience.gain.value, .45); assert.equal(audio.diagnostics.ambiencePlaying, true); assert.equal(timers.size, 1);
  settings.music = true; settings.ambience = false; audio.setTheme('lake');
  assert.equal(ambience.gain.value, 0); assert.equal(audio.diagnostics.ambienceVoices, 0); assert.equal(audio.diagnostics.playing, true);
  settings.music = false; settings.sound = true; audio.setTheme('lake');
  assert.equal(timers.size, 0); assert.equal(audio.play('ko'), true);
  audio.destroy();
}));

test('invalid atmosphere volume uses the safe default, while zero and false fully mute its bus', async () => withAudio({}, async ({ contexts, timers }) => {
  const settings = { ambienceVolume: NaN };
  const audio = new CombatAudio({ getSettings: () => settings }); audio.setTheme('manor'); await audio.unlock();
  const bus = buses(contexts[0])[3];
  assert.equal(bus.gain.value, .35);
  for (const value of ['0.8', null, undefined, Infinity]) {
    settings.ambienceVolume = value; audio.setTheme('manor'); assert.equal(bus.gain.value, .35);
  }
  settings.ambienceVolume = 4; audio.setTheme('manor'); assert.equal(bus.gain.value, 1);
  settings.ambienceVolume = -1; audio.setTheme('manor'); assert.equal(bus.gain.value, 0);
  assert.equal(timers.size, 0); assert.equal(audio.diagnostics.ambienceVoices, 0);
  settings.ambienceVolume = .4; audio.setTheme('manor'); assert.equal(timers.size, 1);
  settings.ambience = false; audio.setTheme('manor'); assert.equal(timers.size, 0);
  audio.destroy();
}));

test('stage changes cancel old texture sources without cutting an independent interface effect', async () => withAudio({}, async ({ contexts }) => {
  const audio = new CombatAudio(); audio.setTheme('backstage'); await audio.unlock();
  const context = contexts[0], oldSources = liveSources(context);
  audio.play('select'); const effect = liveSources(context).find(node => !oldSources.includes(node));
  assert.ok(effect); audio.setTheme('spudsy');
  assert.ok(oldSources.every(node => node.targets.size === 0 && node.onended === null));
  assert.ok(effect.targets.size > 0);
  assert.equal(audio.diagnostics.ambienceVoices, 3);
  audio.destroy();
}));

test('pause clears noise, filters and future cues immediately and resumes at the current clock', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); audio.setTheme('lake'); await audio.unlock();
  const context = contexts[0], oldSources = liveSources(context);
  assert.ok(oldSources.some(node => node.kind === 'bufferSource'));
  audio.setPaused(true);
  assert.equal(timers.size, 0); assert.equal(audio.diagnostics.activeVoices, 0);
  assert.ok(oldSources.every(node => node.targets.size === 0));
  assert.ok(context.nodes.filter(node => node.kind === 'filter').every(node => node.targets.size === 0));
  context.advance(120); audio.setPaused(false); audio.setPaused(false);
  assert.equal(timers.size, 1); assert.ok(liveSources(context).every(node => node.startAt >= 120));
  assert.equal(context.buffers.length, 1);
  audio.destroy();
}));

test('a throttled clock skips missed atmosphere cycles instead of creating a burst', async () => withAudio({}, async ({ contexts, tick }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); audio.setTheme('grounds'); await audio.unlock();
  const context = contexts[0], before = audio.diagnostics;
  context.advance(600, false); tick();
  assert.equal(audio.diagnostics.scheduledAmbiences - before.scheduledAmbiences, 1);
  assert.ok(audio.diagnostics.scheduledSteps - before.scheduledSteps <= 4);
  assert.ok(liveSources(context).every(node => node.startAt >= 600));
  assert.ok(audio.diagnostics.ambienceVoices <= 4);
  audio.destroy();
}));

test('long playback and effect bursts stay within both voice caps without buffer growth', async () => withAudio({}, async ({ contexts, tick, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ music: true }) }); audio.setTheme('lake'); await audio.unlock();
  const context = contexts[0];
  for (let step = 0; step < 1200; step++) {
    context.advance(.05, step % 3 !== 0); tick();
    if (step % 8 === 0) for (const cue of ['trap', 'ko', 'damage', 'super', 'explosion']) audio.play(cue);
    assert.ok(audio.diagnostics.activeVoices <= 24);
    assert.ok(audio.diagnostics.ambienceVoices <= 6);
    assert.equal(timers.size, 1);
  }
  assert.equal(context.buffers.length, 1);
  audio.destroy(); assert.equal(timers.size, 0); assert.ok(context.nodes.every(node => node.targets.size === 0));
}));

test('finite noise sources release their filters and reuse deterministic bounded samples', async () => withAudio({}, async ({ contexts }) => {
  const audio = new CombatAudio(); audio.setTheme('manor'); await audio.unlock();
  const context = contexts[0], noise = context.nodes.find(node => node.kind === 'bufferSource');
  assert.ok(noise.loop); assert.ok(Number.isFinite(noise.stopAt) && noise.stopAt > noise.startAt);
  const filter = [...noise.targets][0]; assert.equal(filter.kind, 'filter');
  const samples = context.buffers[0].getChannelData(0);
  assert.equal(samples.length, context.sampleRate * 2);
  let sum = 0, square = 0;
  for (const value of samples) { assert.ok(value >= -1 && value <= 1); sum += value; square += value * value; }
  assert.ok(Math.abs(sum / samples.length) < .02); assert.ok(square / samples.length > .2 && square / samples.length < .5);
  context.advance(12);
  assert.equal(noise.targets.size, 0); assert.equal(filter.targets.size, 0); assert.equal(noise.onended, null);
  audio.destroy();
  const second = new CombatAudio(); second.setTheme('manor'); await second.unlock();
  const other = contexts[1].buffers[0].getChannelData(0);
  assert.deepEqual(Array.from(other.slice(0, 100)), Array.from(samples.slice(0, 100)));
  second.destroy();
}));

test('missing noise support leaves tonal textures and effects operational', async () => withAudio({ noNoise: true }, async ({ contexts }) => {
  const audio = new CombatAudio(); audio.setTheme('manor'); await audio.unlock();
  assert.equal(audio.diagnostics.error, null); assert.equal(contexts[0].buffers.length, 0);
  assert.equal(liveSources(contexts[0]).length, 2); assert.equal(audio.play('ko'), true);
  audio.destroy(); assert.ok(contexts[0].nodes.every(node => node.targets.size === 0));
}));

test('a failed filter allocation disconnects partial nodes and a later stage can recover', async () => withAudio({}, async ({ contexts, controls }) => {
  const audio = new CombatAudio(); await audio.unlock(); controls.failKind = 'filter';
  audio.setTheme('spudsy'); const context = contexts[0];
  assert.ok(context.nodes.filter(node => node.kind === 'bufferSource').every(node => node.targets.size === 0));
  controls.failKind = null; audio.setTheme('lake');
  assert.ok(liveSources(context).some(node => node.kind === 'bufferSource'));
  assert.equal(context.buffers.length, 1); audio.destroy();
  assert.ok(context.nodes.every(node => node.targets.size === 0));
}));

test('context interruption suspends the atmosphere until an explicit unlock succeeds', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio(); audio.setTheme('cellar'); await audio.unlock();
  const context = contexts[0]; context.changeState('suspended');
  assert.equal(timers.size, 0); assert.equal(audio.diagnostics.activeVoices, 0);
  audio.setTheme('void'); audio.play('trap'); assert.equal(context.resumeCalls, 1);
  assert.equal(await audio.unlock(), true); assert.equal(context.resumeCalls, 2); assert.equal(timers.size, 1);
  audio.destroy();
}));

test('trap and KO have distinct bounded signatures and KO rejects duplicate immediate playback', async () => withAudio({}, async ({ contexts }) => {
  assert.ok(AUDIO_EFFECT_IDS.includes('trap') && AUDIO_EFFECT_IDS.includes('ko'));
  const audio = new CombatAudio(); await audio.unlock(); const context = contexts[0], signatures = [];
  for (const cue of ['damage', 'trap', 'ko']) {
    const before = context.nodes.length; assert.equal(audio.play(cue), true);
    signatures.push(context.nodes.slice(before).filter(node => node.kind === 'oscillator').map(node => [node.type, node.frequency.events.map(event => ({ kind: event.kind, value: event.value, offset: Math.round((event.time - node.startAt) * 1e6) / 1e6 })), Math.round((node.stopAt - node.startAt) * 1e6) / 1e6]));
    if (cue === 'ko') assert.equal(audio.play(cue), false);
    context.advance(1);
  }
  assert.equal(new Set(signatures.map(value => JSON.stringify(value))).size, 3);
  assert.equal(audio.play('ko'), true); audio.destroy();
}));

test('six landed-impact sounds have different finite synthesis and share the existing effect volume', async () => withAudio({}, async ({ contexts, timers }) => {
  const settings = { ambience: false, volume: .4 }, signatures = [];
  const audio = new CombatAudio({ getSettings: () => settings }); await audio.unlock();
  const context = contexts[0];
  for (const cue of AUDIO_IMPACT_CUES) {
    const before = context.nodes.length;
    assert.equal(audio.play(cue), true, cue);
    assert.equal(audio.play(cue), false, 'Repeated immediate ' + cue + ' must stay rate limited');
    const sources = context.nodes.slice(before).filter(node => node.kind === 'oscillator');
    assert.ok(sources.length >= 2 && sources.length <= 3);
    assert.ok(sources.every(node => node.stopAt - node.startAt < .3));
    signatures.push(sources.map(node => [node.type, node.frequency.events.map(event => [event.kind, event.value]), Math.round((node.stopAt - node.startAt) * 1e6)]));
    assert.equal(buses(context)[1].gain.value, .4);
    context.advance(1);
    assert.equal(audio.diagnostics.activeVoices, 0);
    assert.ok(sources.every(node => node.targets.size === 0 && node.onended === null));
  }
  assert.equal(new Set(signatures.map(value => JSON.stringify(value))).size, 6);
  settings.sound = false;
  for (const cue of AUDIO_IMPACT_CUES) assert.equal(audio.play(cue), false);
  assert.equal(buses(context)[1].gain.value, 0);
  assert.equal(timers.size, 0);
  audio.destroy();
}));

test('destroy during a pending unlock cannot restart an atmosphere or retain a buffer', async () => withAudio({ holdResume: true }, async ({ contexts, finishResume, timers }) => {
  const audio = new CombatAudio(); audio.setTheme('bigtop');
  const pending = audio.unlock(); audio.destroy(); audio.destroy(); finishResume();
  assert.equal(await pending, false); assert.equal(timers.size, 0);
  assert.equal(contexts[0].closeCalls, 1); assert.equal(audio.diagnostics.noiseBuffers, 0);
  assert.ok(contexts[0].nodes.every(node => node.targets.size === 0));
}));


// Measure the scheduled sound, including the envelope, rather than relying on
// effect names: two names that synthesize the same cue must fail this check.
const effectSignature = (context, nodes, at) => nodes.filter(node => node.kind === 'oscillator').map(source => {
  const gain = [...source.targets][0];
  const events = values => values.map(({ kind, value, time }) => [kind, value, Math.round((time - at) * 1e6)]);
  return [source.type, Math.round((source.startAt - at) * 1e6), Math.round((source.stopAt - at) * 1e6), events(source.frequency.events), events(gain.gain.events)];
});

test('throw escape has a finite distinct sound and does not share the parry cooldown', async () => withAudio({}, async ({ contexts, timers }) => {
  const audio = new CombatAudio({ getSettings: () => ({ ambience: false }) });
  await audio.unlock(); const context = contexts[0];
  let before = context.nodes.length, at = context.currentTime;
  assert.equal(audio.play('parry'), true);
  const parry = effectSignature(context, context.nodes.slice(before), at);
  context.advance(1); before = context.nodes.length; at = context.currentTime;
  assert.equal(audio.play('throwTech'), true);
  const escape = effectSignature(context, context.nodes.slice(before), at);
  assert.notDeepEqual(escape, parry, 'Escaping a throw must sound different from a parry');
  assert.equal(audio.play('parry'), true, 'A throw escape must not consume the parry cooldown');
  assert.equal(audio.play('throwTech'), false, 'An immediate repeated escape remains rate limited');
  assert.equal(audio.play('reflect'), false, 'Reflect keeps the existing parry alias');
  const sources = liveSources(context);
  assert.ok(sources.length <= 6 && sources.every(node => node.stopAt - at <= .3));
  assert.equal(timers.size, 0);
  context.advance(1); assert.equal(audio.diagnostics.activeVoices, 0);
  assert.ok(sources.every(node => node.targets.size === 0 && node.onended === null));
  audio.destroy();
}));

test('confirmation has a finite distinct sound and does not share the selection cooldown', async () => withAudio({}, async ({ contexts, timers }) => {
  const settings = { ambience: false, volume: .4 };
  const audio = new CombatAudio({ getSettings: () => settings });
  await audio.unlock(); const context = contexts[0], at = context.currentTime;
  let before = context.nodes.length;
  assert.equal(audio.play('select'), true);
  const select = effectSignature(context, context.nodes.slice(before), at);
  before = context.nodes.length;
  assert.equal(audio.play('confirm'), true, 'Confirming immediately after selecting must be audible');
  const confirm = effectSignature(context, context.nodes.slice(before), at);
  assert.notDeepEqual(confirm, select, 'Confirming a choice must sound different from selecting it');
  assert.equal(audio.play('confirm'), false);
  assert.equal(audio.play('select'), false);
  const sources = liveSources(context);
  assert.ok(sources.length <= 4 && sources.every(node => node.stopAt - at <= .3));
  assert.equal(buses(context)[1].gain.value, .4); assert.equal(timers.size, 0);
  context.advance(1); assert.equal(audio.diagnostics.activeVoices, 0);
  assert.ok(sources.every(node => node.targets.size === 0 && node.onended === null));
  audio.destroy();
}));

test('throw escape and confirmation respect unlock, pause, mute and destruction', async () => withAudio({}, async ({ contexts }) => {
  const settings = { ambience: false, volume: .4 };
  const audio = new CombatAudio({ getSettings: () => settings });
  const cues = ['throwTech', 'confirm'];
  for (const cue of cues) assert.equal(audio.play(cue), false);
  assert.equal(contexts.length, 0);
  await audio.unlock(); const context = contexts[0];
  audio.setPaused(true);
  for (const cue of cues) assert.equal(audio.play(cue), false);
  audio.setPaused(false);
  for (const cue of cues) assert.equal(audio.play(cue), true);
  audio.setPaused(true); assert.equal(audio.diagnostics.activeVoices, 0);
  context.advance(1); audio.setPaused(false); settings.volume = 0;
  for (const cue of cues) assert.equal(audio.play(cue), false);
  settings.volume = .4;
  for (const cue of cues) assert.equal(audio.play(cue), true);
  settings.sound = false; audio.setTheme('menu');
  assert.equal(audio.diagnostics.activeVoices, 0);
  for (const cue of cues) assert.equal(audio.play(cue), false);
  audio.destroy(); settings.sound = true;
  for (const cue of cues) assert.equal(audio.play(cue), false);
  assert.ok(context.nodes.every(node => node.targets.size === 0));
}));


test('effect diagnostics count only accepted motifs and expose immutable bounded snapshots', async () => withAudio({}, async ({ contexts }) => {
  const audio = new CombatAudio({ getSettings: () => ({ ambience: false }) });
  assert.equal(audio.diagnostics.lastEffect, null);
  assert.deepEqual(Object.keys(audio.diagnostics.effectCounts), AUDIO_EFFECT_IDS);
  assert.ok(Object.values(audio.diagnostics.effectCounts).every(count => count === 0));
  assert.equal(audio.play('confirm'), false);
  await audio.unlock();
  assert.equal(audio.play('confirm'), true); assert.equal(audio.play('confirm'), false);
  assert.equal(audio.play('__proto__'), false);
  const snapshot = audio.diagnostics;
  assert.equal(snapshot.lastEffect, 'confirm'); assert.equal(snapshot.effectCounts.confirm, 1);
  assert.ok(Object.isFrozen(snapshot.effectCounts));
  assert.throws(() => { snapshot.effectCounts.confirm = 99; }, TypeError);
  assert.equal(audio.play('reflect'), true);
  assert.equal(audio.diagnostics.lastEffect, 'parry'); assert.equal(audio.diagnostics.effectCounts.parry, 1);
  assert.equal(snapshot.lastEffect, 'confirm'); assert.equal(snapshot.effectCounts.parry, 0);
  audio.setPaused(true); assert.equal(audio.play('throwTech'), false);
  assert.equal(audio.diagnostics.effectCounts.throwTech, 0);
  assert.equal(Object.values(audio.diagnostics.effectCounts).reduce((sum, value) => sum + value, 0), 2);
  contexts[0].advance(1); audio.setPaused(false); assert.equal(audio.play('confirm'), true);
  assert.equal(audio.diagnostics.effectCounts.confirm, 2); assert.equal(snapshot.effectCounts.confirm, 1);
  audio.destroy();
}));

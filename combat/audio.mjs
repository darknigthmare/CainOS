/** Original procedural arrangements for Encore. No recording or series score. */
const major = [0, 2, 4, 5, 7, 9, 11], minor = [0, 2, 3, 5, 7, 8, 10];
const theme = (id, title, bpm, root, scale, melody, bass, waveform = 'triangle', swing = 0) => Object.freeze({
  id, title, bpm, root, scale: Object.freeze([...scale]), melody: Object.freeze(melody),
  bass: Object.freeze(bass), waveform, swing, provenance: 'Composition procédurale originale Encore',
});
export const AUDIO_THEMES = Object.freeze({
  bigtop: theme('bigtop', 'Rideau de pixels', 124, 60, major, [0, 2, 4, 6, 4, null, 1, 3, 5, 4, 2, null, 1, 2, 4, 0], [0, 3, 4, 2], 'triangle', .08),
  candy: theme('candy', 'Caravane acidulée', 116, 62, [0, 2, 4, 7, 9], [0, null, 2, 4, 3, 2, null, 1, 4, 3, 2, null, 0, 1, 3, 2], [0, 2, 3, 1], 'sine', .14),
  manor: theme('manor', 'Bougies en contretemps', 92, 57, minor, [0, null, 4, 3, null, 1, 2, null, 6, 5, null, 3, 2, null, 1, 0], [0, 5, 3, 4], 'sine'),
  spudsy: theme('spudsy', 'Service à minuit', 128, 55, [0, 2, 3, 5, 7, 9, 10], [0, 0, null, 2, 4, null, 3, 2, 6, null, 4, 2, 1, 3, null, 4], [0, 3, 0, 4], 'square', .12),
  cellar: theme('cellar', 'Archives sous tension', 102, 48, [0, 1, 3, 5, 7, 8, 10], [0, null, 1, null, 4, 3, null, 2, 0, 4, null, 5, 3, null, 1, 0], [0, 1, 5, 4], 'triangle'),
  void: theme('void', 'Horizon sans fin', 80, 59, [0, 2, 5, 7, 9], [0, null, null, 2, 4, null, 3, null, 1, null, 4, null, 2, 1, null, 0], [0, 2, 1, 3], 'sine'),
  lake: theme('lake', 'Reflets de mémoire', 98, 62, major, [4, 2, null, 0, 1, 3, null, 2, 5, null, 4, 1, 2, null, 0, 4], [0, 5, 3, 4], 'sine', .06),
  training: theme('training', 'Impulsion de calibration', 120, 60, [0, 2, 5, 7, 10], [0, null, 2, null, 1, null, 3, null, 2, null, 4, 3, 1, null, 2, 0], [0, 0, 2, 1], 'triangle'),
  gloink: theme('gloink', 'Géométrie en cavale', 136, 53, [0, 2, 3, 6, 7, 9, 10], [0, 3, 1, 4, null, 2, 5, 3, 6, null, 4, 2, 0, 1, null, 3], [0, 2, 4, 1], 'square', .04),
  kingdom: theme('kingdom', 'Couronne de sucre', 108, 65, major, [0, 4, 2, null, 5, 3, 1, null, 6, 4, 5, 2, null, 3, 1, 0], [0, 4, 5, 3], 'triangle', .08),
  grounds: theme('grounds', 'Tour de piste', 118, 57, [0, 2, 4, 5, 7, 9, 10], [0, 1, 3, 4, null, 2, 1, 5, 4, null, 3, 6, 2, 1, null, 0], [0, 3, 1, 4], 'triangle', .1),
  backstage: theme('backstage', 'La porte suivante', 104, 59, minor, [0, 2, null, 1, 4, null, 3, 5, 2, 0, null, 4, 6, 3, null, 1], [0, 3, 5, 4], 'sine', .05),
});

// [frequency, end frequency, seconds, delay, waveform, amplitude].
const EFFECTS = Object.freeze({
  damage: [[170, 55, .13, 0, 'triangle', .06]],
  block: [[390, 180, .065, 0, 'square', .032], [650, 260, .06, .025, 'sine', .032]],
  parry: [[650, 900, .12, 0, 'sine', .05], [1120, 1500, .13, .04, 'sine', .035]],
  guardBreak: [[190, 60, .18, 0, 'sawtooth', .04], [800, 160, .1, .03, 'triangle', .04]],
  jump: [[260, 520, .12, 0, 'sine', .035]],
  dash: [[180, 700, .09, 0, 'sawtooth', .026]],
  special: [[400, 1300, .2, 0, 'triangle', .045]],
  super: [[220, 440, .18, 0, 'triangle', .045], [440, 880, .2, .1, 'sine', .04], [880, 1320, .26, .2, 'sine', .035]],
  start: [[392, 392, .12, 0, 'triangle', .045], [494, 494, .12, .09, 'triangle', .045], [587, 587, .22, .18, 'triangle', .045]],
  win: [[523, 523, .18, 0, 'sine', .05], [659, 659, .18, .1, 'sine', .05], [784, 784, .2, .2, 'sine', .05], [1047, 1047, .35, .34, 'sine', .045]],
  lose: [[440, 440, .18, 0, 'triangle', .045], [349, 349, .2, .14, 'triangle', .04], [262, 220, .3, .3, 'triangle', .04]],
  select: [[660, 880, .06, 0, 'sine', .035]],
  back: [[440, 330, .07, 0, 'sine', .035]],
  denied: [[120, 90, .12, 0, 'triangle', .04]],
  recover: [[500, 750, .14, 0, 'sine', .04], [750, 1000, .17, .08, 'sine', .03]],
  explosion: [[100, 28, .23, 0, 'sawtooth', .045], [170, 45, .15, .02, 'triangle', .045]],
});
const ALIASES = Object.freeze({ hit: 'damage', reflect: 'parry', throwTech: 'parry', barrier: 'block', heal: 'recover', utility: 'recover', roundEnd: 'win' });
export const AUDIO_EFFECT_IDS = Object.freeze(Object.keys(EFFECTS));
export const AUDIO_EFFECT_ALIASES = ALIASES;
const MAX_VOICES = 24, MAX_GROUP_VOICES = 12, LOOKAHEAD = .12;
const volume = (value, fallback) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
const audioConstructor = () => globalThis.AudioContext || globalThis.webkitAudioContext;
const frequency = (arrangement, degree) => {
  const scale = arrangement.scale, note = arrangement.root + scale[((degree % scale.length) + scale.length) % scale.length] + 12 * Math.floor(degree / scale.length);
  return 440 * 2 ** ((note - 69) / 12);
};
const disconnect = node => { try { node?.disconnect(); } catch { /* Already disconnected. */ } };

/**
 * Call unlock() from a trusted user gesture. All other methods stay silent until
 * it succeeds. Settings are read on each call and every active music tick; call
 * setTheme(currentTheme) after changing settings to start newly enabled music.
 * The owner controls visibility with setPaused(), and calls destroy() on exit.
 */
export class CombatAudio {
  #getSettings; #context = null; #master = null; #buses = null; #busVolumes = {};
  #unlocked = false; #unlocking = null; #destroyed = false; #paused = false;
  #theme = 'menu'; #timer = null; #nextAt = 0; #step = 0; #scheduledSteps = 0;
  #voices = new Set(); #lastEffects = new Map(); #stateListener = null; #error = null;

  constructor({ getSettings = () => ({}) } = {}) {
    this.#getSettings = typeof getSettings === 'function' ? getSettings : () => ({});
  }

  #settings() {
    let settings; try { settings = this.#getSettings(); } catch { /* Optional settings provider. */ }
    settings = settings && typeof settings === 'object' ? settings : {};
    return { sound: settings.sound !== false, volume: volume(settings.volume, .25), music: settings.music === true, musicVolume: volume(settings.musicVolume, .2) };
  }

  get diagnostics() {
    const settings = this.#settings();
    return Object.freeze({ supported: typeof audioConstructor() === 'function', unlocked: this.#unlocked,
      contextState: this.#context?.state || (this.#destroyed ? 'closed' : 'uninitialized'), theme: this.#theme,
      musicEnabled: settings.music, playing: this.#timer !== null && this.#context?.state === 'running',
      paused: this.#paused, activeVoices: this.#voices.size, scheduledSteps: this.#scheduledSteps,
      schedulerRunning: this.#timer !== null, destroyed: this.#destroyed, error: this.#error });
  }

  /** Only this method constructs or resumes an AudioContext. */
  unlock() {
    if (this.#destroyed) return Promise.resolve(false);
    if (this.#unlocking) return this.#unlocking;
    if (!this.#context) {
      const Constructor = audioConstructor();
      if (typeof Constructor !== 'function') return Promise.resolve(false);
      let context, master, sfx, music;
      try {
        context = new Constructor();
        master = context.createGain(); sfx = context.createGain(); music = context.createGain();
        master.gain.setValueAtTime(.7, context.currentTime);
        sfx.gain.setValueAtTime(0, context.currentTime); music.gain.setValueAtTime(0, context.currentTime);
        sfx.connect(master); music.connect(master); master.connect(context.destination);
        this.#context = context; this.#master = master; this.#buses = { sfx, music };
        this.#stateListener = () => this.#refresh();
        context.addEventListener('statechange', this.#stateListener);
      } catch {
        disconnect(sfx); disconnect(music); disconnect(master);
        try { context?.close()?.catch?.(() => {}); } catch { /* Optional audio. */ }
        this.#context = null; this.#master = null; this.#buses = null;
        this.#error = 'Le navigateur ne peut pas initialiser l’audio.';
        return Promise.resolve(false);
      }
    }
    const context = this.#context;
    const pending = (async () => {
      try {
        if (context.state !== 'running') await context.resume();
        if (this.#destroyed || this.#context !== context || context.state !== 'running') return false;
        this.#unlocked = true; this.#error = null; this.#refresh();
        return true;
      } catch {
        this.#error = 'L’audio attend une interaction autorisée par le navigateur.';
        return false;
      }
    })();
    this.#unlocking = pending;
    pending.then(() => { if (this.#unlocking === pending) this.#unlocking = null; });
    return pending;
  }

  setTheme(stageId) {
    if (this.#destroyed) return this.#theme;
    const next = Object.hasOwn(AUDIO_THEMES, stageId) ? stageId : 'menu';
    if (next !== this.#theme) {
      this.#theme = next; this.#step = 0; this.#stopTimer(); this.#stopVoices('music');
    }
    this.#refresh();
    return this.#theme;
  }

  setPaused(paused) {
    if (this.#destroyed) return;
    this.#paused = paused === true;
    this.#refresh();
  }

  play(kind) {
    if (this.#destroyed) return false;
    this.#refresh();
    const settings = this.#settings(), effect = Object.hasOwn(ALIASES, kind) ? ALIASES[kind] : kind;
    if (!this.#unlocked || this.#paused || this.#context?.state !== 'running' || !settings.sound || !settings.volume || !Object.hasOwn(EFFECTS, effect)) return false;
    const now = this.#context.currentTime, cooldown = effect === 'win' || effect === 'lose' ? .25 : .035;
    if (now - (this.#lastEffects.get(effect) ?? -Infinity) < cooldown) return false;
    let played = false;
    for (const [from, to, duration, delay, waveform, level] of EFFECTS[effect]) {
      played = this.#voice('sfx', now + delay, duration, from, to, waveform, level) || played;
    }
    if (played) this.#lastEffects.set(effect, now);
    return played;
  }

  #setVolume(group, value, now) {
    if (this.#busVolumes[group] === value) return;
    const param = this.#buses[group].gain;
    param.cancelScheduledValues(now); param.setTargetAtTime(value, now, .015);
    this.#busVolumes[group] = value;
  }

  #sync() {
    if (this.#destroyed || !this.#context) return false;
    const context = this.#context, settings = this.#settings(), now = context.currentTime;
    this.#prune(now);
    this.#setVolume('sfx', this.#paused || !settings.sound ? 0 : settings.volume, now);
    this.#setVolume('music', this.#paused || !settings.music ? 0 : settings.musicVolume, now);
    if (!settings.sound || !settings.volume) this.#stopVoices('sfx');
    if (!this.#unlocked || this.#paused || context.state !== 'running') {
      this.#stopTimer(); this.#stopVoices(); return false;
    }
    if (!settings.music || !settings.musicVolume) {
      this.#stopTimer(); this.#stopVoices('music'); return false;
    }
    if (this.#timer === null) {
      this.#nextAt = now + .025;
      this.#timer = globalThis.setInterval(() => this.#tick(), 50);
      this.#timer?.unref?.();
    }
    return true;
  }

  #refresh() {
    try { if (this.#sync()) this.#tick(); }
    catch { this.#stopTimer(); this.#stopVoices(); this.#error = 'La sortie audio est momentanément indisponible.'; }
  }

  #tick() {
    try {
      if (!this.#sync()) return;
      const now = this.#context.currentTime, arrangement = AUDIO_THEMES[this.#theme] || AUDIO_THEMES.bigtop;
      const beat = 60 / (arrangement.bpm * (this.#theme === 'menu' ? .8 : 1)) / 2;
      // A throttled/background clock resumes here instead of replaying its backlog.
      if (this.#nextAt < now - .15) this.#nextAt = now + .025;
      let batch = 0;
      while (this.#nextAt < now + LOOKAHEAD && batch++ < 4) {
        this.#scheduleStep(arrangement, this.#step, this.#nextAt, beat);
        this.#nextAt += beat * (1 + (this.#step % 2 ? -arrangement.swing : arrangement.swing));
        this.#step = (this.#step + 1) % 32; this.#scheduledSteps++;
      }
    } catch { this.#stopTimer(); this.#stopVoices('music'); this.#error = 'La musique est momentanément indisponible.'; }
  }

  #scheduleStep(arrangement, step, at, beat) {
    const chord = arrangement.bass[Math.floor(step / 8) % arrangement.bass.length];
    const note = arrangement.melody[step % arrangement.melody.length], menu = this.#theme === 'menu';
    if (note !== null) {
      const pitch = frequency(arrangement, note + chord + arrangement.scale.length);
      this.#voice('music', at, beat * .76, pitch, pitch, arrangement.waveform, arrangement.waveform === 'square' ? .018 : .028);
    }
    if (step % 4 === 0) {
      const bass = frequency(arrangement, chord - arrangement.scale.length);
      this.#voice('music', at, beat * 1.7, bass, bass, 'triangle', .034);
    }
    if (!menu && step % 4 === 0) this.#voice('music', at, .12, 110, 42, 'sine', .032);
    if (!menu && step % 4 === 2) this.#voice('music', at, .055, 185, 110, 'triangle', .022);
    if (!menu && step % 2 === 1) this.#voice('music', at, .028, 1600, 450, 'triangle', .01);
  }

  #voice(group, at, duration, from, to, waveform, level) {
    if (this.#voices.size >= MAX_VOICES || [...this.#voices].filter(voice => voice.group === group).length >= MAX_GROUP_VOICES) return false;
    const context = this.#context, end = at + duration;
    let oscillator, gain, voice;
    try {
      oscillator = context.createOscillator(); gain = context.createGain();
      oscillator.type = waveform; oscillator.frequency.setValueAtTime(from, at);
      if (from !== to) oscillator.frequency.exponentialRampToValueAtTime(to, end);
      gain.gain.setValueAtTime(.0001, at); gain.gain.linearRampToValueAtTime(level, at + .006);
      gain.gain.exponentialRampToValueAtTime(.0001, end - .005);
      oscillator.connect(gain); gain.connect(this.#buses[group]);
      voice = { group, oscillator, gain, end }; this.#voices.add(voice);
      oscillator.onended = () => this.#release(voice);
      oscillator.start(at); oscillator.stop(end);
      return true;
    } catch {
      if (voice) this.#release(voice, true);
      else { try { oscillator?.stop(); } catch { /* May not have started. */ } disconnect(oscillator); disconnect(gain); }
      return false;
    }
  }

  #release(voice, stop = false) {
    if (!this.#voices.delete(voice)) return;
    voice.oscillator.onended = null;
    if (stop) { try { voice.oscillator.stop(this.#context?.currentTime || 0); } catch { /* Already ended. */ } }
    disconnect(voice.oscillator); disconnect(voice.gain);
  }
  #prune(now) { for (const voice of this.#voices) if (voice.end + .05 <= now) this.#release(voice); }
  #stopVoices(group) { for (const voice of this.#voices) if (!group || voice.group === group) this.#release(voice, true); }
  #stopTimer() { if (this.#timer !== null) globalThis.clearInterval(this.#timer); this.#timer = null; }

  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true; this.#unlocked = false; this.#stopTimer(); this.#stopVoices(); this.#lastEffects.clear();
    const context = this.#context;
    try { if (context && this.#stateListener) context.removeEventListener('statechange', this.#stateListener); } catch { /* Optional output. */ }
    disconnect(this.#buses?.sfx); disconnect(this.#buses?.music); disconnect(this.#master);
    try { if (context?.state !== 'closed') context?.close()?.catch?.(() => {}); } catch { /* The browser may already have closed it. */ }
    this.#context = null; this.#buses = null; this.#master = null; this.#stateListener = null;
  }
}

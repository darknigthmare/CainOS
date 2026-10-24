import { CombatEngine, ENGINE_RULES_VERSION } from './engine.mjs';
import { CombatRenderer } from './render.mjs';
import { sampleFinisherPresentation } from './finishers.mjs';

/** A separate non-playing scene: never receives the active match or a profile. */
export class FinisherGallery {
  constructor({ canvas, fighters, stage, definition, onChange = () => {} }) {
    if (!definition || !Array.isArray(fighters) || fighters.length !== 2 || fighters[0].id !== definition.fighterId) throw new Error('Finale introuvable.');
    const engine = new CombatEngine({ fighters, stage, rulesVersion: ENGINE_RULES_VERSION, mode: 'local', cpu: [false, false], seed: 1, roundTime: 90, roundsToWin: 1 });
    this.state = engine.state;
    this.state.phase = 'matchOver'; this.state.winner = 0; this.state.roundWinner = 0;
    this.state.fighters[1].life = 0;
    this.entry = Object.freeze({ ...definition, winnerIndex: 0, loserIndex: 1, trigger: definition.variant, matchFrame: 0 });
    this.renderer = new CombatRenderer(canvas);
    this.stage = stage; this.fighters = fighters; this.onChange = onChange;
    this.frame = 0; this.previous = null; this.playing = true; this.ready = false; this.disposed = false;
    this.lastSignature = ''; this.lastDraw = '';
  }
  async prepare() {
    const result = await this.renderer.preload(this.fighters, [this.stage]);
    if (this.disposed) return result;
    this.ready = true; this.previous = null;
    return result;
  }
  get snapshot() {
    return Object.freeze({ id: this.entry.id, fighterId: this.entry.fighterId, frame: Math.floor(this.frame), durationFrames: this.entry.durationFrames, ready: this.ready, playing: this.playing, done: this.frame >= this.entry.durationFrames });
  }
  replay() { if (this.disposed) return; this.frame = 0; this.playing = true; this.previous = null; this.lastDraw = ''; }
  toggle() {
    if (this.disposed) return;
    if (this.frame >= this.entry.durationFrames) this.replay();
    else { this.playing = !this.playing; this.previous = null; }
  }
  // The owner calls this from visibility events, which still fire when the
  // browser stops animation callbacks before an invisible tick can run.
  suspendClock() { this.previous = null; }
  dispose() { this.disposed = true; this.playing = false; this.onChange = () => {}; }
  tick(now, { visible = true, reducedMotion = false } = {}) {
    if (this.disposed || !this.ready) return;
    // A background tab can stop requestAnimationFrame entirely. Discard its
    // clock anchor so the first visible tick cannot consume hidden time.
    if (!visible) { this.suspendClock(); return; }
    const time = Number.isFinite(now) ? now : 0;
    const dt = this.previous === null ? 0 : Math.min(.1, Math.max(0, (time - this.previous) / 1000));
    this.previous = time;
    if (reducedMotion) { this.frame = this.entry.durationFrames; this.playing = false; }
    else if (this.playing) this.frame = Math.min(this.entry.durationFrames, this.frame + dt * 60);
    if (this.frame >= this.entry.durationFrames) this.playing = false;
    const sample = sampleFinisherPresentation(this.entry, this.frame, { reducedMotion });
    const signature = [sample.beatIndex, this.playing, sample.done, reducedMotion].join(':');
    if (signature !== this.lastSignature) {
      this.lastSignature = signature;
      this.onChange({ ...this.snapshot, beat: sample.beat, beatIndex: sample.beatIndex, reducedMotion });
    }
    const drawSignature = [Math.floor(this.frame), !!reducedMotion].join(':');
    if (this.lastDraw !== drawSignature) {
      this.renderer.render(this.state, { stage: this.stage, finisher: this.entry, presentationFrame: this.frame, ambientFrame: 0, reducedMotion });
      this.lastDraw = drawSignature;
    }
  }
}

/**
 * Authored timing for procedural presentations of existing illustrations.
 * These sequences never author combat poses, move an actor, or change rules.
 * All motion has a finite end; reduced motion shows the settled illustration.
 */
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finiteFrame = frame => Number.isFinite(frame) ? Math.max(0, frame) : 0;
const smooth = value => value * value * (3 - 2 * value);

// Each performer has an individual rhythm and silhouette-safe movement budget.
// Motion is expressed in screen pixels and radians, never source-art scaling.
const performers = {
  pomni: { title: 'Hésitation et soulagement', x: 6, lift: 9, lean: 0.035, beat: 0.31, cells: [4, 5, 7] },
  jax: { title: 'Salut narquois', x: 11, lift: 5, lean: -0.045, beat: 0.41, cells: [4, 5, 7] },
  ragatha: { title: 'Salut de la poupée', x: 5, lift: 4, lean: 0.04, beat: 0.36, cells: [4, 5, 7] },
  gangle: { title: 'Rubans et révérence', x: 7, lift: 7, lean: -0.035, beat: 0.28, cells: [4, 5, 7] },
  zooble: { title: 'Assemblage impatient', x: 9, lift: 3, lean: -0.055, beat: 0.22, cells: [4, 5, 7] },
  kinger: { title: 'Majesté hésitante', x: 4, lift: 5, lean: 0.03, beat: 0.46, cells: [4, 5, 7] },
  caine: { title: 'Annonce du maître de piste', x: 10, lift: 12, lean: 0.045, beat: 0.33, cells: [4, 5, 7] },
  bubble: { title: 'Bulle en suspension', x: 12, lift: 16, lean: 0.02, beat: 0.25, cells: [0, 0, 0] },
  gummigoo: { title: 'Salut du convoyeur', x: 8, lift: 3, lean: -0.03, beat: 0.43, cells: [0, 0, 0] },
  loolilalu: { title: 'Révérence royale', x: 4, lift: 5, lean: 0.04, beat: 0.38, cells: [0, 0, 0] },
  gloinkqueen: { title: 'Majesté du nid', x: 5, lift: 3, lean: 0.025, beat: 0.48, cells: [0, 0, 0] },
  abstractedkaufmo: { title: 'Impulsion abstraite', x: 7, lift: 8, lean: -0.025, beat: 0.19, cells: [0, 0, 0] },
  baronmildenhall: { title: 'Salut spectral', x: 6, lift: 11, lean: 0.03, beat: 0.44, cells: [0, 0, 0] },
  fudge: { title: 'Vague de chocolat', x: 8, lift: 4, lean: -0.03, beat: 0.29, cells: [0, 0, 0] },
};

export const SEQUENCE_EVENTS = freeze(['intro', 'roundVictory', 'roundDefeat', 'matchVictory', 'matchDefeat']);
export const SEQUENCE_DURATIONS = freeze({ intro: 96, roundVictory: 90, roundDefeat: 90, matchVictory: 132, matchDefeat: 132 });
export const SEQUENCE_PROVENANCE = 'Finite procedural motion of existing artwork; dedicated authored intro, combat and outcome drawings remain to be produced.';

const key = (at, xOffset, lift, lean, alpha = 1) => ({ at, xOffset, lift, lean, alpha });
function makeSequence(id, p, event) {
  const duration = SEQUENCE_DURATIONS[event], beat = Math.round(duration * p.beat);
  const victory = event.endsWith('Victory'), defeat = event.endsWith('Defeat');
  const match = event.startsWith('match'), amount = match ? 1.25 : 1;
  let keys;
  if (event === 'intro') keys = [key(0, -p.x, 0, -p.lean), key(beat, p.x * 0.35, p.lift, p.lean), key(Math.round(duration * 0.72), 0, p.lift * 0.2, -p.lean * 0.25), key(duration, 0, 0, 0)];
  else if (victory) keys = [key(0, 0, 0, 0.025), key(beat, p.x * amount, p.lift * amount, p.lean * 1.5), key(Math.round(duration * 0.74), -p.x * 0.22, p.lift * 0.2, -p.lean * 0.4), key(duration, 0, 0, 0.025)];
  else keys = [key(0, 0, 0, -0.08, 0.88), key(beat, -p.x * amount, 0, -0.08 - Math.abs(p.lean), 0.82), key(Math.round(duration * 0.75), -p.x * 0.3, 0, -0.09, 0.86), key(duration, 0, 0, -0.08, 0.88)];
  return { id: `${id}:${event}`, fighterId: id, event, title: p.title, duration, frame: p.cells[defeat ? 2 : victory ? 1 : 0], keys, provenance: SEQUENCE_PROVENANCE };
}

export const FIGHTER_SEQUENCES = freeze(Object.fromEntries(Object.entries(performers).map(([id, p]) => [id, Object.fromEntries(SEQUENCE_EVENTS.map(event => [event, makeSequence(id, p, event)]))])));

/** A pure snapshot; independent of simulation frame, RNG, health and inputs. */
export function sequencePose(fighterId, event, presentationFrame = 0, options = {}) {
  const sequence = FIGHTER_SEQUENCES[fighterId]?.[event];
  if (!sequence) return null;
  const tick = options.reducedMotion ? sequence.duration : clamp(finiteFrame(presentationFrame), 0, sequence.duration);
  const right = sequence.keys.findIndex(point => point.at >= tick);
  const b = sequence.keys[Math.max(0, right)], a = sequence.keys[Math.max(0, right - 1)];
  const progress = b.at === a.at ? 1 : smooth(clamp((tick - a.at) / (b.at - a.at), 0, 1));
  const sample = field => a[field] + (b[field] - a[field]) * progress;
  return { sequenceId: sequence.id, sequenceProgress: tick / sequence.duration, sequenceDone: tick >= sequence.duration, frame: sequence.frame, xOffset: sample('xOffset'), lift: sample('lift'), lean: sample('lean'), alpha: sample('alpha') };
}

/** Ties and unknown results deliberately have no winner/loser choreography. */
export function outcomeEvent(phase, slot, winner, roundWinner) {
  if (phase === 'intro') return 'intro';
  if (!['roundOver', 'roundEnd', 'matchOver'].includes(phase)) return null;
  const result = phase === 'matchOver' ? winner : roundWinner;
  if (!Number.isInteger(result) || result < 0 || result > 1) return null;
  return `${phase === 'matchOver' ? 'match' : 'round'}${result === slot ? 'Victory' : 'Defeat'}`;
}

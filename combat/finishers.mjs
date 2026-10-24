import { FINISHER_CATALOG } from './finisher-catalog.mjs';
export { FINISHER_NOTICE } from './finisher-catalog.mjs';

/** Presentation-only endings: no engine steps, RNG or progression writes. */
const MATCH_MODES = new Set(['versus', 'local', 'arcade', 'boss', 'survival', 'story', 'tournament']);
const IMPACT_SLOTS = new Set(['light', 'heavy', 'low', 'air', 'dash', 'throw']);
const SPECIAL_SLOTS = new Set(['special', 'specialDown', 'specialForward', 'specialBack']);
const catalogue = new Map();
for (const definition of FINISHER_CATALOG) {
  if (!catalogue.has(definition.fighterId)) catalogue.set(definition.fighterId, new Map());
  const variants = catalogue.get(definition.fighterId);
  if (variants.has(definition.variant)) throw new Error('Duplicate finisher: ' + definition.id);
  variants.set(definition.variant, definition);
}
function familyForSlot(slot) {
  if (slot === 'super') return 'super';
  if (SPECIAL_SLOTS.has(slot)) return 'special';
  if (IMPACT_SLOTS.has(slot)) return 'impact';
  return null;
}
function healthOf(actor) {
  return Number.isFinite(actor?.life) ? actor.life : Number.isFinite(actor?.hp) ? actor.hp : NaN;
}
/** The last winning damage on the actual final KO frame is authoritative. */
export function selectMatchFinisher(state, events, options = {}) {
  const mode = options?.mode ?? 'versus';
  if (!MATCH_MODES.has(mode) || options?.replay || state?.phase !== 'matchOver') return null;
  const winnerIndex = state.winner;
  if (!Number.isInteger(winnerIndex) || winnerIndex < 0 || winnerIndex > 1 ||
      !Number.isInteger(state.frame) || state.frame < 0 || !Array.isArray(events)) return null;
  const fighters = Array.isArray(state.fighters) ? state.fighters : [state.a, state.b];
  if (fighters.length !== 2) return null;
  const loserIndex = 1 - winnerIndex, winner = fighters[winnerIndex], loser = fighters[loserIndex];
  if (!winner || !loser || healthOf(loser) !== 0 || !(healthOf(winner) > 0)) return null;
  let decisive = null;
  for (let index = events.length - 1; index >= 0; index--) {
    const event = events[index];
    if (event?.type === 'damage' && event.frame === state.frame &&
        event.actor === winnerIndex && event.target === loserIndex &&
        event.blocked === false && Number.isFinite(event.amount) && event.amount > 0) {
      decisive = event;
      break;
    }
  }
  if (!decisive) return null;
  const trigger = familyForSlot(decisive.slot);
  const fighterId = winner.f?.id ?? winner.def?.id ?? winner.id;
  const definition = catalogue.get(fighterId)?.get(trigger);
  if (!definition) return null;
  return Object.freeze({ ...definition, winnerIndex, loserIndex, trigger, matchFrame: state.frame });
}
/** A separate presentation clock; reduced motion uses the final composition. */
export function sampleFinisherPresentation(entry, presentationFrame = 0, options = {}) {
  const durationFrames = entry?.durationFrames, beats = entry?.beats;
  if (!Number.isInteger(durationFrames) || durationFrames <= 0 ||
      !Array.isArray(beats) || !beats.length || beats[0]?.frame !== 0) return null;
  for (let index = 0; index < beats.length; index++) {
    const at = beats[index]?.frame;
    if (!Number.isInteger(at) || at < 0 || at > durationFrames ||
        index > 0 && at <= beats[index - 1].frame) return null;
  }
  const finite = Number.isFinite(presentationFrame) ? presentationFrame : 0;
  const frame = options?.reducedMotion ? durationFrames : Math.max(0, Math.min(durationFrames, finite));
  let beatIndex = 0;
  while (beatIndex + 1 < beats.length && beats[beatIndex + 1].frame <= frame) beatIndex++;
  const beat = beats[beatIndex], end = beats[beatIndex + 1]?.frame ?? durationFrames;
  const localProgress = end === beat.frame ? 1 : Math.max(0, Math.min(1, (frame - beat.frame) / (end - beat.frame)));
  return Object.freeze({
    id: entry.id, frame, durationFrames, progress: frame / durationFrames,
    beatIndex, beat, localProgress, done: frame >= durationFrames,
  });
}

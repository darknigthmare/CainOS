import { FIGHTERS, STAGES, VARIANTS } from './data.mjs';
import { getStoryRoute } from './stories.mjs';

/**
 * JSON checkpoints for Encore's multi-encounter programmes. A checkpoint is
 * always the START of the current encounter, not a partial simulation frame.
 * Its immutable seed, rules and recorded results rebuild the complete route
 * and tournament bracket on import. This is corruption checking, not anti-cheat.
 * No session/UI dependency: session.mjs can safely embed a validated programme.
 */
export const PROGRAM_KEY = 'cainos.circus-combat.program.v1';
export const PROGRAM_FORMAT = 'circus-encore-program';
export const PROGRAM_VERSION = 1;
export const PROGRAM_MODES = Object.freeze(['arcade', 'boss', 'survival', 'story', 'tournament']);
export const SURVIVAL_RECOVERY = 1200;
const FULL_HEALTH = 10000;
const MAX_UINT = 4294967295;
const BOSS_IDS = ['gloinkqueen', 'fudge', 'abstractedkaufmo', 'caine'];
const TOURNAMENT_ROUNDS = [
  ['quarterfinal', 'Quarts de finale', 4],
  ['semifinal', 'Demi-finales', 2],
  ['final', 'Finale', 1],
];
const plain = value => value !== null && typeof value === 'object'
  && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const integer = (value, low, high) => Number.isInteger(value) && value >= low && value <= high;
const fail = message => { throw new Error(message); };

function catalogIds(items, label) {
  if (!Array.isArray(items) || !items.length || items.length > 256) fail(`Catalogue ${label} invalide.`);
  const ids = items.map(item => typeof item === 'string' ? item : item?.id);
  if (!ids.every(id => typeof id === 'string' && id.length > 0 && id.length < 100)
      || new Set(ids).size !== ids.length) fail(`Identifiants ${label} invalides.`);
  return ids;
}

function hashSeed(seed, salt) {
  let hash = (seed ^ 2166136261) >>> 0;
  for (let i = 0; i < salt.length; i++) hash = Math.imul(hash ^ salt.charCodeAt(i), 16777619) >>> 0;
  return hash;
}

function randomFrom(seed) {
  let state = seed || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

function shuffled(values, seed, salt) {
  const result = [...values], random = randomFrom(hashSeed(seed, salt));
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function stageSchedule(ids, first, length, seed) {
  const order = [first, ...shuffled(ids.filter(id => id !== first), seed, 'stages')];
  return Array.from({ length }, (_, i) => order[i % order.length]);
}

function blankTournament(participants) {
  return {
    participants: [...participants],
    rounds: TOURNAMENT_ROUNDS.map(([id, label, count], round) => ({
      id, label,
      matches: Array.from({ length: count }, (_, index) => ({
        id: `${id}-${index + 1}`,
        a: round === 0 ? participants[index * 2] : null,
        b: round === 0 ? participants[index * 2 + 1] : null,
        winner: null,
        method: 'pending',
      })),
    })),
    champion: null,
  };
}

function propagateTournament(tournament) {
  for (let round = 1; round < tournament.rounds.length; round++) {
    const previous = tournament.rounds[round - 1].matches;
    tournament.rounds[round].matches.forEach((match, index) => {
      match.a = previous[index * 2].winner;
      match.b = previous[index * 2 + 1].winner;
    });
  }
  tournament.champion = tournament.rounds[2].matches[0].winner;
}

function simulateRound(run, roundIndex) {
  for (const match of run.tournament.rounds[roundIndex].matches) {
    if (!match.a || !match.b || match.winner || match.a === run.playerId || match.b === run.playerId) continue;
    const random = randomFrom(hashSeed(run.seed, `${match.id}:${match.a}:${match.b}`));
    match.winner = random() < .5 ? match.a : match.b;
    match.method = 'simulated';
  }
  propagateTournament(run.tournament);
}

function playerMatch(run, roundIndex = run.index) {
  return run.tournament?.rounds[roundIndex]?.matches.find(match => match.a === run.playerId || match.b === run.playerId);
}

function findTournamentOpponent(run) {
  const match = playerMatch(run);
  if (!match || !match.a || !match.b || match.winner) fail('Le tableau ne contient pas de rencontre à jouer.');
  return match.a === run.playerId ? match.b : match.a;
}

function copyProgram(run) {
  return {
    ...run,
    opponents: [...run.opponents], stages: [...run.stages],
    results: run.results.map(result => ({ ...result })),
    tournament: run.tournament ? {
      participants: [...run.tournament.participants],
      rounds: run.tournament.rounds.map(round => ({ ...round, matches: round.matches.map(match => ({ ...match })) })),
      champion: run.tournament.champion,
    } : null,
  };
}

/**
 * Create a reproducible programme. Pass a fresh uint32 seed for a new draw;
 * the default seed is deliberately stable for callers that omit it.
 * Stages can be roster objects or ID arrays. Story stages are authored.
 */
export function createProgram(mode, playerId, roster = FIGHTERS, stages = STAGES, options = {}) {
  if (!plain(options) || !PROGRAM_MODES.includes(mode)) fail('Programme de combat inconnu.');
  const fighterIds = catalogIds(roster, 'des artistes'), stageIds = catalogIds(stages, 'des arènes');
  if (fighterIds.length < 2 || !fighterIds.includes(playerId)) fail('Artiste du programme introuvable.');
  const { seed = 1, difficulty = 'normal', roundTime = 90, variantId = '', stage = stageIds[0], variants = VARIANTS } = options;
  if (!integer(seed, 0, MAX_UINT) || !['easy', 'normal', 'hard'].includes(difficulty)
      || ![60, 90, 120].includes(roundTime)) fail('Règles du programme invalides.');
  if (!stageIds.includes(stage)) fail('Arène du programme introuvable.');
  if (typeof variantId !== 'string' || variantId && (!Array.isArray(variants)
      || !variants.some(item => item.id === variantId && (item.baseFighterId || item.fighterId) === playerId))) {
    fail('Cette apparence ne correspond pas à l’artiste du programme.');
  }
  const run = {
    format: PROGRAM_FORMAT, version: PROGRAM_VERSION,
    mode, playerId, variantId, seed, difficulty, roundTime, initialStage: stage,
    index: 0, health: FULL_HEALTH, status: 'active', opponents: [], stages: [], results: [], tournament: null,
  };
  const others = shuffled(fighterIds.filter(id => id !== playerId), seed, 'opponents');
  if (mode === 'story') {
    const route = getStoryRoute(playerId);
    if (!route || route.chapters.some(chapter => !fighterIds.includes(chapter.opponentId) || !stageIds.includes(chapter.stageId))) {
      fail('La route de cet artiste n’est pas disponible dans ce catalogue.');
    }
    run.opponents = route.chapters.map(chapter => chapter.opponentId);
    run.stages = route.chapters.map(chapter => chapter.stageId);
    run.initialStage = run.stages[0];
  } else if (mode === 'tournament') {
    if (fighterIds.length < 8) fail('Le tournoi demande huit artistes distincts.');
    const participants = shuffled([playerId, ...others.slice(0, 7)], seed, 'bracket');
    run.tournament = blankTournament(participants);
    run.opponents = [null, null, null];
    simulateRound(run, 0);
    run.opponents[0] = findTournamentOpponent(run);
  } else if (mode === 'boss') {
    run.opponents = BOSS_IDS.filter(id => fighterIds.includes(id));
    if (!run.opponents.length) fail('Aucun adversaire du boss rush n’est disponible.');
  } else if (mode === 'survival') {
    run.opponents = Array.from({ length: 10 }, (_, i) => others[i % others.length]);
  } else {
    const finale = fighterIds.includes('caine') ? 'caine' : others.at(-1);
    const opening = others.filter(id => id !== finale);
    if (!opening.length) opening.push(...others);
    run.opponents = [...Array.from({ length: 5 }, (_, i) => opening[i % opening.length]), finale];
  }
  if (!run.stages.length) run.stages = stageSchedule(stageIds, stage, run.opponents.length, seed);
  return run;
}

/** Describes exactly what the existing CombatEngine must start or restart. */
export function programEncounter(run) {
  if (!run || run.status !== 'active') return null;
  const opponentId = run.opponents?.[run.index], stageId = run.stages?.[run.index];
  if (!opponentId || !stageId || !integer(run.health, 1, FULL_HEALTH)) return null;
  return {
    opponentId, stageId, number: run.index + 1, total: run.opponents.length,
    seed: hashSeed(run.seed, `${run.mode}:encounter:${run.index}`),
    initialHealth: [run.health, FULL_HEALTH],
  };
}

function normalizeResult(result, imported = false) {
  if (!plain(result) || typeof result.won !== 'boolean' || !Number.isFinite(result.health)
      || result.health < 0 || result.health > FULL_HEALTH || result.won && result.health <= 0
      || imported && !Number.isInteger(result.health)) fail('Résultat du programme invalide.');
  return { won: result.won, health: Math.max(result.won ? 1 : 0, Math.round(result.health)) };
}

function applyResult(run, result) {
  if (run.status !== 'active') fail('Ce programme est déjà terminé.');
  const next = copyProgram(run);
  next.results.push({ ...result });
  if (next.mode === 'tournament') {
    const match = playerMatch(next);
    if (!match || match.winner) fail('La rencontre du tournoi est déjà terminée.');
    match.winner = result.won ? next.playerId : next.opponents[next.index];
    match.method = 'played';
    propagateTournament(next.tournament);
    if (!result.won) {
      next.status = 'eliminated';
      // The player remains eliminated. Remaining CPU rounds only complete the
      // displayed bracket, and are explicitly marked as simulations.
      for (let round = next.index + 1; round < 3; round++) simulateRound(next, round);
      return next;
    }
    next.index++;
    if (next.index === next.opponents.length) next.status = 'complete';
    else {
      simulateRound(next, next.index);
      next.opponents[next.index] = findTournamentOpponent(next);
    }
    return next;
  }
  if (!result.won) {
    next.status = 'eliminated';
    return next;
  }
  next.health = next.mode === 'survival' ? Math.min(FULL_HEALTH, result.health + SURVIVAL_RECOVERY) : FULL_HEALTH;
  next.index++;
  if (next.index === next.opponents.length) next.status = 'complete';
  return next;
}

/**
 * Record one actual player duel without mutating the current result screen.
 * Live fractional HP is rounded once; saved/imported HP must already be integer.
 */
export function recordProgramResult(run, result, roster = FIGHTERS, stages = STAGES, variants = VARIANTS) {
  return applyResult(validateProgram(run, roster, stages, variants), normalizeResult(result));
}

// Compare only the canonical schema. Unknown imported fields are discarded;
// arrays must have exact lengths, so extra matches/results cannot be smuggled in.
function agreesWith(value, expected) {
  if (Array.isArray(expected)) return Array.isArray(value) && value.length === expected.length
    && expected.every((item, i) => agreesWith(value[i], item));
  if (plain(expected)) return plain(value) && Object.keys(expected).every(key => agreesWith(value[key], expected[key]));
  return value === expected;
}

/**
 * Import untrusted JSON by replaying bounded result history into a fresh run.
 * Opponents, stage order, round/index, starting HP and all seven bracket matches
 * must agree with that reconstruction. No arbitrary imported objects are copied.
 */
export function validateProgram(value, roster = FIGHTERS, stages = STAGES, variants = VARIANTS) {
  if (!plain(value) || value.format !== PROGRAM_FORMAT || value.version !== PROGRAM_VERSION) {
    fail('Ce fichier n’est pas un programme Encore version 1.');
  }
  if (!PROGRAM_MODES.includes(value.mode) || typeof value.playerId !== 'string'
      || typeof value.variantId !== 'string' || typeof value.initialStage !== 'string'
      || !integer(value.seed, 0, MAX_UINT) || !['easy', 'normal', 'hard'].includes(value.difficulty)
      || ![60, 90, 120].includes(value.roundTime) || !integer(value.index, 0, 10)
      || !integer(value.health, 1, FULL_HEALTH) || !['active', 'complete', 'eliminated'].includes(value.status)
      || !Array.isArray(value.results) || value.results.length > 10) fail('Le point de reprise est corrompu.');
  let expected = createProgram(value.mode, value.playerId, roster, stages, {
    seed: value.seed, difficulty: value.difficulty, roundTime: value.roundTime,
    variantId: value.variantId, stage: value.initialStage, variants,
  });
  if (value.results.length > expected.opponents.length) fail('Le programme contient trop de résultats.');
  for (const result of value.results) expected = applyResult(expected, normalizeResult(result, true));
  if (!agreesWith(value, expected)) fail('Le point de reprise ne correspond pas aux résultats du programme.');
  return expected;
}

/**
 * Story/arcade/boss retries keep prior victories and restart the lost encounter.
 * Survival and tournament losses end that attempt: retry starts a fresh attempt
 * with the same seeded draw and full health, never restores a defeated bracket.
 */
export function retryProgram(value, roster = FIGHTERS, stages = STAGES, variants = VARIANTS) {
  const run = validateProgram(value, roster, stages, variants);
  if (run.status === 'active') return run;
  if (run.status !== 'eliminated') fail('Ce programme est déjà remporté.');
  let retried = createProgram(run.mode, run.playerId, roster, stages, {
    seed: run.seed, difficulty: run.difficulty, roundTime: run.roundTime,
    variantId: run.variantId, stage: run.initialStage, variants,
  });
  if (!['survival', 'tournament'].includes(run.mode)) {
    for (const result of run.results.slice(0, -1)) retried = applyResult(retried, result);
  }
  return retried;
}

export function readProgram(storage, roster = FIGHTERS, stages = STAGES, variants = VARIANTS) {
  try {
    const raw = storage.getItem(PROGRAM_KEY);
    if (!raw || typeof raw !== 'string' || raw.length > 65536) return null;
    return validateProgram(JSON.parse(raw), roster, stages, variants);
  } catch { return null; }
}

export function saveProgram(storage, run, roster = FIGHTERS, stages = STAGES, variants = VARIANTS) {
  const valid = run === null ? null : validateProgram(run, roster, stages, variants);
  try {
    if (valid === null) storage.removeItem(PROGRAM_KEY);
    else storage.setItem(PROGRAM_KEY, JSON.stringify(valid));
    return true;
  } catch { return false; }
}

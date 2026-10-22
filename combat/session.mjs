/** Shared, versioned local profile and replay format for the OS and standalone. */
export const SAVE_KEY = 'cainos.circus-combat.profile.v1';
export const REPLAY_KEY = 'cainos.circus-combat.replay.v1';
export const GAME_VERSION = '0.1.0';
export const SLOT_ORDER = ['light', 'heavy', 'low', 'throw', 'special', 'specialDown', 'specialForward', 'specialBack', 'super', 'utility'];
const FLAGS = ['left', 'right', 'down', 'guard', 'jump', 'dash', 'tech'];
export const MAX_PACKED_INPUT = (SLOT_ORDER.length << FLAGS.length) | ((1 << FLAGS.length) - 1);
export const DEFAULT_SETTINGS = Object.freeze({ layout: 'azerty', difficulty: 'normal', seconds: 90, rounds: 2, volume: .25, sound: true, reducedMotion: false, hitboxes: false, touch: 'auto' });
const integer = (v, lo, hi, fallback = lo) => Number.isInteger(v) && v >= lo && v <= hi ? v : fallback;
const choice = (v, allowed, fallback) => allowed.includes(v) ? v : fallback;
export function cleanSettings(value = {}) {
  const s = value && typeof value === 'object' ? value : {};
  return {
    layout: choice(s.layout, ['azerty', 'qwerty'], 'azerty'),
    difficulty: choice(s.difficulty, ['easy', 'normal', 'hard'], 'normal'),
    seconds: choice(s.seconds, [60, 90, 120], 90), rounds: choice(s.rounds, [1, 2, 3], 2),
    volume: typeof s.volume === 'number' && Number.isFinite(s.volume) ? Math.max(0, Math.min(1, s.volume)) : .25,
    sound: s.sound !== false, reducedMotion: s.reducedMotion === true, hitboxes: s.hitboxes === true,
    touch: choice(s.touch, ['auto', 'on', 'off'], 'auto')
  };
}
export function emptyProfile() {
  return { format: 'circus-encore-profile', version: 1, settings: { ...DEFAULT_SETTINGS }, stats: { matches: 0, wins: 0, losses: 0, bestSurvival: 0, damage: 0 }, challenges: [], medals: [], history: [] };
}
export function validateProfile(value) {
  if (!value || value.format !== 'circus-encore-profile' || value.version !== 1) throw new Error('Ce fichier n’est pas une sauvegarde Encore version 1.');
  const profile = emptyProfile();
  profile.settings = cleanSettings(value.settings);
  for (const key of Object.keys(profile.stats)) profile.stats[key] = integer(value.stats?.[key], 0, 1e9);
  const allowed = { challenges: CHALLENGES.map(c => c.id), medals: ['arcade', 'boss', 'survival'] };
  for (const key of ['challenges', 'medals']) profile[key] = [...new Set((Array.isArray(value[key]) ? value[key] : []).filter(v => allowed[key].includes(v)))];
  profile.stats.bestSurvival = Math.min(10, profile.stats.bestSurvival);
  profile.history = (Array.isArray(value.history) ? value.history : []).filter(v => v && typeof v.fighter === 'string' && typeof v.opponent === 'string').slice(0, 12).map(v => ({ fighter: v.fighter.slice(0, 60), opponent: v.opponent.slice(0, 60), mode: String(v.mode || '').slice(0, 30), won: v.won === true, at: String(v.at || '').slice(0, 30) }));
  return profile;
}
export function readProfile(storage) {
  try { const raw = storage.getItem(SAVE_KEY); return raw ? validateProfile(JSON.parse(raw)) : emptyProfile(); }
  catch { return emptyProfile(); }
}
export function saveProfile(storage, profile) {
  const valid = validateProfile(profile);
  try { storage.setItem(SAVE_KEY, JSON.stringify(valid)); return true; }
  catch { return false; }
}
export function packInput(input = {}) {
  let flags = 0;
  FLAGS.forEach((key, bit) => { if (input[key]) flags |= 1 << bit; });
  const slot = SLOT_ORDER.indexOf(input.slot === 'grab' ? 'throw' : input.slot);
  return flags | ((slot + 1) << 7);
}
export function unpackInput(packed) {
  const input = {};
  FLAGS.forEach((key, bit) => { input[key] = !!(packed & (1 << bit)); });
  input.slot = SLOT_ORDER[(packed >> 7) - 1] || null;
  return input;
}
export function appendReplayFrame(runs, inputs) {
  const a = packInput(inputs[0]), b = packInput(inputs[1]);
  const last = runs.at(-1);
  if (last && last[1] === a && last[2] === b && last[0] < 3600) last[0]++;
  else runs.push([1, a, b]);
}
export function validateReplay(value, fighterIds, stageIds) {
  if (!value || value.format !== 'circus-encore-replay' || value.version !== GAME_VERSION) throw new Error('Replay incompatible avec cette version du jeu.');
  const c = value.config;
  if (!c || !Array.isArray(c.fighters) || c.fighters.length !== 2 || !c.fighters.every(id => fighterIds.includes(id)) || !stageIds.includes(c.stage)) throw new Error('Combattant ou arène introuvable dans le replay.');
  if (!Number.isInteger(c.seed) || c.seed < 0 || c.seed > 4294967295 || !Number.isInteger(c.roundsToWin) || c.roundsToWin < 1 || c.roundsToWin > 3 || ![60,90,120].includes(c.roundTime) || !['easy','normal','hard'].includes(c.difficulty)) throw new Error('Règles de replay invalides.');
  if (!Array.isArray(c.cpu) || c.cpu.length !== 2 || !c.cpu.every(v => typeof v === 'boolean') || !Array.isArray(value.runs) || value.runs.length > 72000) throw new Error('Entrées du replay invalides.');
  let total = 0;
  for (const r of value.runs) {
    if (!Array.isArray(r) || r.length !== 3 || !Number.isInteger(r[0]) || r[0] < 1 || r[0] > 3600 || !r.slice(1).every(v => Number.isInteger(v) && v >= 0 && v <= MAX_PACKED_INPUT && (v >> FLAGS.length) <= SLOT_ORDER.length)) throw new Error('Une entrée du replay est corrompue.');
    total += r[0];
  }
  if (!total || total > 72000) throw new Error('Le replay doit durer entre 1 image et 20 minutes.');
  if (c.initialHealth !== undefined && (!Array.isArray(c.initialHealth) || c.initialHealth.length !== 2 || !c.initialHealth.every(v => Number.isInteger(v) && v > 0 && v <= 10000))) throw new Error('La santé initiale du replay est invalide.');
  const initialHealth = c.initialHealth ? [...c.initialHealth] : [10000, 10000];
  return { format: value.format, version: GAME_VERSION, config: { fighters: [...c.fighters], stage: c.stage, seed: c.seed, roundsToWin: c.roundsToWin, roundTime: c.roundTime, difficulty: c.difficulty, cpu: [...c.cpu], initialHealth }, runs: value.runs.map(r => [...r]), frames: total };
}
export function* replayInputs(replay) {
  for (const [count, a, b] of replay.runs) for (let frame = 0; frame < count; frame++) yield [unpackInput(a), unpackInput(b)];
}
export const MODES = [
  { id: 'versus', name: 'Versus CPU', eyebrow: '01 / UN CONTRE UN', icon: '✦', description: 'Choisis ton rival. Un duel libre, sans objectif annexe.', label: 'Duel libre' },
  { id: 'local', name: 'Duel local', eyebrow: '02 / DEUX JOUEURS', icon: '↔', description: 'Deux artistes, un écran. Claviers partagés ou manettes.', label: '2 joueurs' },
  { id: 'arcade', name: 'Le grand spectacle', eyebrow: '03 / ARCADE', icon: '♛', description: 'Six rencontres jusqu’au face-à-face avec Caine.', label: '6 actes' },
  { id: 'boss', name: 'Les anomalies', eyebrow: '04 / BOSS RUSH', icon: '◉', description: 'Affronte les géants, l’Abstraction et le maître du jeu.', label: 'Boss rush' },
  { id: 'survival', name: 'Encore. Encore.', eyebrow: '05 / SURVIE', icon: '∞', description: 'Dix adversaires. Ta santé se transmet entre les duels.', label: '10 vagues' },
  { id: 'training', name: 'Les répétitions', eyebrow: '06 / ENTRAÎNEMENT', icon: '⌘', description: 'Étudie les techniques, la garde et les ouvertures.', label: 'Laboratoire' },
  { id: 'challenge', name: 'Les défis de Caine', eyebrow: '07 / OBJECTIFS', icon: '◇', description: 'Six exercices de précision et de maîtrise du combat.', label: '6 défis' }
];
export const CHALLENGES = [
  { id: 'first-impact', name: 'Entrée en scène', text: 'Infliger 2 000 dégâts en 60 secondes.', goal: 2000, metric: 'damage', dummy: 'idle' },
  { id: 'guard', name: 'Le spectacle continue', text: 'Bloquer 5 attaques de la CPU en 60 secondes.', goal: 5, metric: 'blocked', dummy: 'cpu' },
  { id: 'combo', name: 'Un, deux, trois !', text: 'Réussir une séquence de 3 impacts avant la fin du combo.', goal: 3, metric: 'combo', dummy: 'idle' },
  { id: 'throw', name: 'Changement de place', text: 'Réussir 3 projections sur un adversaire qui garde.', goal: 3, metric: 'throws', dummy: 'block' },
  { id: 'specialist', name: 'Numéro personnel', text: 'Activer 4 techniques différentes pendant le même exercice.', goal: 4, metric: 'unique', dummy: 'idle' },
  { id: 'super', name: 'Le grand final', text: 'Toucher avec le grand final. La jauge est disponible.', goal: 1, metric: 'supers', dummy: 'idle' }
];
export function makeRun(mode, playerId, roster, stages) {
  if (!['arcade', 'boss', 'survival'].includes(mode) || !Array.isArray(roster) || roster.length < 2 || !roster.some(f => f.id === playerId) || !Array.isArray(stages) || !stages.length) throw new Error('Ce programme demande un artiste, un adversaire et une arène valides.');
  const others = roster.filter(f => f.id !== playerId).map(f => f.id);
  const bosses = ['gloinkqueen', 'fudge', 'abstractedkaufmo', 'caine'].filter(id => roster.some(f => f.id === id));
  let opponents = mode === 'boss' ? bosses : mode === 'survival' ? Array.from({ length: 10 }, (_, i) => others[(i * 3) % others.length]) : [...others.filter(id => id !== 'caine').slice(0, 5), 'caine'];
  opponents = opponents.filter(id => roster.some(f => f.id === id));
  return { mode, index: 0, health: 10000, opponents, stages: opponents.map((_, i) => stages[i % stages.length].id) };
}

/** Event accounting shared by challenges, result screens and their tests. */
export function createMatchStats() {
  return [0, 1].map(() => ({ damage: 0, hits: 0, blocked: 0, throws: 0, supers: 0, unique: new Set(), combo: 0 }));
}
export function collectMatchStats(stats, events, state) {
  let sound = null;
  for (const event of events) {
    const stat = stats[event.actor];
    if (!stat) continue;
    if (event.type === 'damage') {
      stat.damage += Number.isFinite(event.amount) ? Math.max(0, event.amount) : 0;
      stat.hits++;
      if (!event.blocked && event.slot === 'throw') stat.throws++;
      if (!event.blocked && event.slot === 'super') stat.supers++;
      sound ||= event.blocked ? 'block' : 'damage';
    }
    if (event.type === 'block') stat.blocked++;
    if (event.type === 'activate' && SLOT_ORDER.includes(event.slot)) stat.unique.add(event.slot);
  }
  const fighters = state.fighters || [state.a, state.b];
  stats[0].combo = Math.max(stats[0].combo, fighters[1]?.comboHits || 0);
  stats[1].combo = Math.max(stats[1].combo, fighters[0]?.comboHits || 0);
  return sound;
}
export function challengeProgress(challenge, stat) {
  return challenge.metric === 'unique' ? stat.unique.size : stat[challenge.metric] || 0;
}

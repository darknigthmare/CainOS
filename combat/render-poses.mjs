import { sequencePose, outcomeEvent } from './render-sequences.mjs';

/**
 * Presentation registrations measured from the seven existing CainOS atlases.
 * Coordinates describe these files, not canonical character proportions.
 * No simulation, damage, hitbox, save or replay value is changed here.
 */
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
const profile = (id, size, anchors, extra = {}) => ({
  id, source: `cainos-${id}-animation-sheet.png`, size, cols: 4, rows: 2,
  anchors: anchors.map(([x, y]) => ({ x, y })),
  provenance: 'Eight source cells inspected; root and ground registered in source pixels. Existing artwork only.',
  ...extra,
});

export const POSE_REGISTRATION_VERSION = 'encore-source-registration-2';
export const ANIMATION_REGISTRATION = freeze({
  pomni: profile('pomni', [1774, 887], [[252, 385], [222, 386], [207, 385], [190, 385], [241, 359], [222, 359], [190, 359], [187, 359]], {
    crouchRig: { frame: 0, cutY: 315, bodyBottom: 315, splitX: 252, drop: 16, legs: [
      { bend: -1, hip: [229, 315], knee: [227, 335], ankle: [223, 353], mask: [[182, 315], [251, 315], [251, 385], [182, 385]] },
      { bend: 1, hip: [281, 315], knee: [281, 335], ankle: [283, 353], mask: [[251, 315], [334, 315], [334, 385], [251, 385]] },
    ] },
  }),
  jax: profile('jax', [1536, 1024], [[213, 418], [167, 418], [160, 421], [134, 421], [203, 392], [180, 393], [158, 392], [162, 393]], {
    source: 'cainos-jax-animation-sheet-0.5.0.png',
    provenance: 'Regenerated transparent eight-cell illustration; roots measured from the opaque foot support. Intact artwork, no inherited cutout rig.',
  }),
  ragatha: profile('ragatha', [1536, 1024], [[248, 429], [205, 429], [155, 429], [127, 429], [241, 362], [198, 362], [152, 362], [124, 361]]),
  gangle: profile('gangle', [1536, 1024], [[204, 428], [166, 428], [147, 428], [119, 426], [205, 336], [180, 336], [142, 342], [136, 342]], {
    // The fourth walk drawing starts at global x=1141, eleven pixels before
    // its nominal cell. Keep that ribbon in frame 3, out of frame 2.
    regions: { 2: { x: 0, y: 0, width: 320, height: 512 }, 3: { x: -20, y: 0, width: 404, height: 512 } },
  }),
  zooble: profile('zooble', [1536, 1024], [[220, 453], [194, 456], [177, 454], [155, 453], [220, 396], [193, 396], [160, 396], [145, 396]], {
    crouchRig: { frame: 0, cutY: 360, bodyBottom: 383, splitX: 230, drop: 24, legs: [
      { bend: -1, hip: [205, 360], knee: [187, 389], ankle: [181, 427], mask: [[192, 360], [217, 360], [201, 426], [202, 453], [135, 453], [135, 429], [170, 426]] },
      { bend: 1, hip: [257, 360], knee: [265, 392], ankle: [269, 427], mask: [[250, 360], [270, 360], [286, 426], [309, 426], [309, 453], [247, 453], [247, 425]] },
    ] },
  }),
  kinger: profile('kinger', [1536, 1024], [[201, 422], [181, 422], [164, 425], [150, 425], [202, 389], [195, 389], [157, 389], [158, 389]]),
  caine: profile('caine', [1536, 1024], [[229, 432], [190, 432], [168, 436], [128, 435], [232, 373], [174, 374], [106, 379], [166, 382]], {
    note: 'The portal in cell 6 is an accessory. It never determines horizontal body registration or scale.',
  }),
});

export function frameRegistration(spec, index, imageWidth, imageHeight) {
  if (!spec || spec.cols !== 4 || spec.rows !== 2) return null;
  const source = String(spec.src || '').split('/').at(-1);
  const found = Object.values(ANIMATION_REGISTRATION).find(item => item.source === source);
  if (!found || found.size[0] !== imageWidth || found.size[1] !== imageHeight || !found.anchors[index]) return null;
  return { id: found.id, index, anchor: found.anchors[index], region: found.regions?.[index] || null, version: POSE_REGISTRATION_VERSION };
}

export function spriteSourceRegion(spec, index, animated, imageWidth, imageHeight) {
  const cols = Math.max(1, spec.cols || 1), rows = Math.max(1, spec.rows || 1);
  const cellWidth = Math.floor(imageWidth / cols), cellHeight = Math.floor(imageHeight / rows);
  const registration = animated ? frameRegistration(spec, index, imageWidth, imageHeight) : null;
  const local = registration?.region || { x: 0, y: 0, width: cellWidth, height: cellHeight };
  const explicit = !animated && spec.sourceRect;
  const rect = explicit || {
    x: (animated ? index % cols : spec.col || 0) * cellWidth + local.x,
    y: (animated ? Math.floor(index / cols) : spec.row || 0) * cellHeight + local.y,
    width: local.width, height: local.height,
  };
  if (![rect.x, rect.y, rect.width, rect.height].every(Number.isInteger) || rect.x < 0 || rect.y < 0 || rect.width < 1 || rect.height < 1 || rect.x + rect.width > imageWidth || rect.y + rect.height > imageHeight) throw new Error('Invalid sprite source rectangle');
  return { ...rect, offsetX: animated ? local.x : 0, offsetY: animated ? local.y : 0, registration };
}

const identity = () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const limit = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const rigidBone = (sourceA, sourceB, targetA, targetB) => {
  const angle = Math.atan2(targetB[1] - targetA[1], targetB[0] - targetA[0]) - Math.atan2(sourceB[1] - sourceA[1], sourceB[0] - sourceA[0]);
  const c = Math.cos(angle), s = Math.sin(angle);
  return { a: c, b: s, c: -s, d: c, e: targetA[0] - c * sourceA[0] + s * sourceA[1], f: targetA[1] - s * sourceA[0] - c * sourceA[1] };
};

/** Fixed-length two-bone fold. The ankle and original shoe pixels stay put. */
export function bendLeg(leg, drop) {
  if (!Number.isFinite(drop) || drop < 0) return null;
  if (drop === 0) return { hip: [...leg.hip], knee: [...leg.knee], ankle: [...leg.ankle], upper: identity(), lower: identity() };
  const hip = [leg.hip[0], leg.hip[1] + drop], ankle = leg.ankle;
  const upper = distance(leg.hip, leg.knee), lower = distance(leg.knee, ankle), reach = distance(hip, ankle);
  if (reach < 0.001 || reach > upper + lower || reach < Math.abs(upper - lower)) return null;
  const along = (upper * upper - lower * lower + reach * reach) / (2 * reach);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  const dx = (ankle[0] - hip[0]) / reach, dy = (ankle[1] - hip[1]) / reach;
  const side = leg.bend === -1 ? -1 : 1;
  const knee = [hip[0] + along * dx + side * height * dy, hip[1] + along * dy - side * height * dx];
  return { hip, knee, ankle: [...ankle], upper: rigidBone(leg.hip, leg.knee, hip, knee), lower: rigidBone(leg.knee, ankle, knee, ankle) };
}

/**
 * Rigid cutout articulation, only for two inspected base idle drawings.
 * It is a shallow low stance, not a new authored crouch or a hitbox preview.
 * Faces and torsos are translated as one intact piece; limbs rotate at their
 * inspected joints without scaling, shoes remain fixed. Other morphologies
 * and all costumes use their intact artwork until dedicated poses exist.
 */
export function crouchParts(fighter, frame, amount = 1) {
  const registration = frame?.registration, rig = ANIMATION_REGISTRATION[registration?.id]?.crouchRig;
  if (!rig || !frame.animated || fighter.costume || fighter.id !== registration.id || frame.index !== rig.frame) return null;
  const drop = rig.drop * limit(amount, 0, 1), parts = [], joints = [];
  for (const leg of rig.legs) {
    const bent = bendLeg(leg, drop);
    if (!bent) return null;
    joints.push(bent);
    parts.push({ name: 'shin', mask: leg.mask, fromY: leg.knee[1] - 2, toY: leg.ankle[1] + 2, matrix: bent.lower });
    parts.push({ name: 'thigh', mask: leg.mask, fromY: rig.cutY - 2, toY: leg.knee[1] + 2, matrix: bent.upper });
  }
  parts.push({ name: 'shoes', fromY: Math.min(...rig.legs.map(leg => leg.ankle[1])) - 2, toY: frame.bounds.y + frame.bounds.height + 1, matrix: identity() });
  parts.push({ name: 'body', holes: rig.legs.map(leg => leg.mask), fromY: frame.y, toY: rig.bodyBottom, matrix: { ...identity(), f: drop } });
  return { parts, joints, drop, provenance: 'Procedural rigid articulation of inspected idle artwork; dedicated crouch drawing unavailable.' };
}

/**
 * Existing cells are selected for readable game states, not renamed as authored
 * fight animations. Cell 6 is character-specific: Caine's portal must not
 * appear on every punch, and Kinger's thinking gesture is not a punch either.
 */
export const POSE_PRESENTATION = freeze({
  pomni: { intro: 4, victory: 5, defeat: 7, melee: [2, 3], projectile: 6, support: 4, interaction: 'pointing' },
  jax: { intro: 4, victory: 5, defeat: 7, melee: [2, 3], projectile: 6, support: 4, interaction: 'pointing' },
  ragatha: { intro: 4, victory: 5, defeat: 7, melee: [4, 6], projectile: 6, support: 4, interaction: 'reaching with an open hand' },
  gangle: { intro: 4, victory: 5, defeat: 7, melee: [2, 6], projectile: 6, support: 4, interaction: 'raised ribbon; reaction cell has a cracked mask' },
  zooble: { intro: 4, victory: 5, defeat: 7, melee: [2, 3], projectile: 6, support: 4, interaction: 'holding a detached module' },
  kinger: { intro: 4, victory: 5, defeat: 7, melee: [2, 3], projectile: 5, support: 6, interaction: 'hand at chin' },
  caine: { intro: 4, victory: 5, defeat: 7, melee: [2, 3], projectile: 5, support: 4, interaction: 'portal accessory' },
});

export const POSE_LIMITATIONS = freeze({
  registration: '56 inspected cells, fixed idle scale and per-cell roots; no claim about canonical height ratios.',
  crouch: 'Two shallow rigid cutout poses (base Pomni and Zooble). Jax and other drawings stay intact. No dedicated crouch art and no visual hurtbox equivalence.',
  actions: 'Idle, walk, speech, interaction and reaction artwork is reused for combat states. Seventy finite procedural intro/outcome sequences animate existing artwork; dedicated combat drawings remain unavailable.',
  costumes: 'All costumes and unregistered static art use intact sprite presentation; base cutout rigs never transfer to them.',
});

const finiteTick = tick => Number.isFinite(tick) ? Math.max(0, tick) : 0;
const selectLoop = (values, tick, delay) => values[Math.floor(finiteTick(tick) / delay) % values.length];

function attackCell(fighter, attack, profile) {
  if (!profile) return 0;
  const def = attack.def || {}, slot = attack.name || def.slot;
  if (def.lowProfile) return 0;
  if (def.kind === 'projectile') return profile.projectile;
  if (def.kind === 'mobility') return fighter.id === 'caine' && def.blink ? 6 : 3;
  if (def.kind === 'parry') return 0;
  if (['buff', 'heal', 'recover', 'trap'].includes(def.kind)) return profile.support;
  return profile.melee[slot === 'light' ? 0 : 1];
}

/** Read-only presentation, using the separate round-outcome clock if supplied. */
export function actorPose(actor, options = {}) {
  const fighter = actor.f || actor.def || {}, profile = POSE_PRESENTATION[fighter.id];
  const tick = finiteTick(options.presentationFrame ?? options.frame);
  const reduced = !!options.reducedMotion;
  const result = { state: 'idle', action: 'idle', frame: reduced ? 0 : selectLoop([0, 1], tick, 24), lean: 0, low: false, phaseProgress: 0, alpha: 1 };
  const event = outcomeEvent(options.phase, actor.slot, options.winner, options.roundWinner);
  const sequence = event && sequencePose(fighter.id, event, tick, { reducedMotion: reduced });
  if (options.phase === 'intro') return { ...result, state: 'intro', action: 'talk', frame: profile?.intro ?? 0, ...sequence };
  if (['roundOver', 'matchOver', 'roundEnd'].includes(options.phase)) {
    const winner = options.phase === 'matchOver' ? options.winner : options.roundWinner;
    if (!Number.isInteger(winner) || winner < 0 || winner > 1) return { ...result, state: 'draw', frame: 0 };
    const victory = winner === actor.slot;
    return { ...result, state: victory ? 'victory' : 'defeat', action: victory ? 'talk' : 'hurt', frame: victory ? profile?.victory ?? 0 : profile?.defeat ?? 0, lean: victory ? 0.025 : -0.08, alpha: victory ? 1 : 0.88, ...sequence };
  }
  if (actor.hit > 0 || actor.state === 'hit') return { ...result, state: 'hit', action: 'hurt', frame: profile?.defeat ?? 0, lean: -0.09 };
  if (actor.attack) {
    const attack = actor.attack, def = attack.def || {}, time = finiteTick(attack.t);
    const startup = Math.max(0, def.startup || 0), active = Math.max(1, def.active || 1), recovery = Math.max(1, def.recovery || 1);
    const phase = time < startup ? 'windup' : time < startup + active ? 'active' : 'recovery';
    const progress = phase === 'windup' ? time / Math.max(1, startup) : phase === 'active' ? (time - startup) / active : limit((time - startup - active) / recovery, 0, 1);
    const selected = attackCell(fighter, attack, profile);
    const frame = phase === 'windup' ? 0 : phase === 'active' || progress < 0.4 ? selected : 0;
    const lean = def.lowProfile ? 0 : phase === 'windup' ? -0.035 * progress : phase === 'active' ? 0.05 : 0.05 * (1 - progress);
    return { ...result, state: `attack-${phase}`, action: 'attack', frame, low: !!def.lowProfile, lean, phaseProgress: progress };
  }
  if (actor.crouch || actor.state === 'crouch') return { ...result, state: 'crouch', frame: 0, low: true, lean: -0.035 };
  if (actor.block || actor.state === 'guard') return { ...result, state: 'guard', frame: 0, lean: -0.035 };
  if (actor.state === 'jump' || actor.onGround === false) return { ...result, state: 'jump', action: 'walk', frame: 2 };
  if (actor.state === 'walk') return { ...result, state: 'walk', action: 'walk', frame: reduced ? 2 : selectLoop([2, 3], tick, 8) };
  return result;
}

/** Uniform scale plus rigid transform; lowest source support stays on actor.y. */
export function frameGeometry(fighter, frame, idle, pose, facing = 1) {
  const height = fighter.visual?.height || fighter.combat?.simulationBody?.height || 230;
  const scale = height / Math.max(1, idle.bounds.height);
  const anchor = frame.registration?.anchor || { x: frame.bounds.x + frame.bounds.width / 2, y: frame.bounds.y + frame.bounds.height };
  const flip = (facing < 0 ? -1 : 1) * (fighter.sprite?.nativeFacing || 1);
  // Large static bosses get a smaller rigid tilt, with no shape compression.
  const angle = (pose?.lean || 0) * (facing < 0 ? -1 : 1) * (fighter.visual?.width > 180 ? 0.4 : 1);
  const sine = Math.sin(angle), cosine = Math.cos(angle);
  const contour = frame.floorContour?.length ? frame.floorContour : [[frame.bounds.x, frame.bounds.y + frame.bounds.height], [frame.bounds.x + frame.bounds.width, frame.bounds.y + frame.bounds.height]];
  const support = Math.max(...contour.map(([x, y]) => ((x + 0.5 - anchor.x) * flip * sine + (y - anchor.y) * cosine) * scale));
  return { scale, anchor, flip, angle, support };
}

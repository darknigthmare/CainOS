import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS, MOVES, MOVE_SLOTS, STAGES, SOURCES, VARIANTS, getFighter, getReplayFighter } from '../combat/data.mjs';
import {
  FIDELITY_SOURCES, FIGHTER_FIDELITY, MOVE_FIDELITY, STAGE_FIDELITY,
  getFighterFidelity, getMoveFidelity, getStageFidelity, getFidelitySources,
} from '../combat/fidelity.mjs';
import { COSTUME_FIDELITY, getCostumeFidelity } from '../combat/costume-fidelity.mjs';

test('all playable fighters, techniques and stages expose the shared review records', () => {
  assert.deepEqual(Object.keys(FIGHTER_FIDELITY).sort(), FIGHTERS.map(f => f.id).sort());
  assert.deepEqual(Object.keys(MOVE_FIDELITY).sort(), MOVES.map(m => m.id).sort());
  assert.deepEqual(Object.keys(STAGE_FIDELITY).sort(), STAGES.map(s => s.id).sort());
  assert.equal(MOVES.length, 140);
  for (const fighter of FIGHTERS) {
    assert.equal(fighter.fidelity, getFighterFidelity(fighter.id));
    for (const slot of MOVE_SLOTS) assert.equal(fighter.moves[slot].fidelity, getMoveFidelity(fighter.id, slot));
  }
  for (const move of MOVES) assert.equal(move.fidelity, getMoveFidelity(move.fighterId, move.slot));
  for (const stage of STAGES) assert.equal(stage.fidelity, getStageFidelity(stage.id));
});

test('review records keep source scope, observations and invented combat separate', () => {
  const sourceIds = new Set(FIDELITY_SOURCES.map(s => s.id));
  assert.equal(sourceIds.size, FIDELITY_SOURCES.length);
  assert.equal(new Set(SOURCES.map(s => s.id)).size, SOURCES.length);
  for (const source of FIDELITY_SOURCES) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(['www.glitchprod.com', 'static.wixstatic.com', 'www.youtube.com', 'glitchproductions.store', 'www.comicsbeat.com'].includes(url.hostname));
    assert.ok(source.title && source.kind && source.scope);
    assert.ok(SOURCES.includes(source));
  }
  const all = [...Object.values(FIGHTER_FIDELITY), ...Object.values(MOVE_FIDELITY), ...Object.values(STAGE_FIDELITY)];
  for (const item of all) {
    assert.ok(Array.isArray(item.sourceIds));
    assert.ok(Array.isArray(item.observedTraits));
    assert.ok(item.combatAdaptation.length > 30);
    assert.ok(item.reviewStatus && item.reviewScope.length > 30);
    for (const id of item.sourceIds) assert.ok(sourceIds.has(id), `unresolved primary source: ${id}`);
    if (item.reviewStatus === 'Épisode à revoir') assert.deepEqual(item.observedTraits, []);
    if (item.reviewStatus === 'Référence visuelle consultée') {
      assert.ok(item.observedTraits.length > 0);
      assert.ok(getFidelitySources(item.sourceIds).some(s => s.kind === 'Visuel officiel'));
    }
  }
  for (const move of Object.values(MOVE_FIDELITY)) {
    assert.equal(move.reviewStatus, 'Adaptation de combat');
    assert.match(move.reviewScope, /pas l’exécution du coup/);
  }
  assert.deepEqual(STAGE_FIDELITY.training.sourceIds, []);
  assert.equal(STAGE_FIDELITY.training.reviewStatus, 'Création originale');
  assert.equal(STAGE_FIDELITY.lake.reviewStatus, 'Source primaire à identifier');
});

test('the nine episode references retain later costumes without claiming to have reviewed them', () => {
  for (let i = 1; i <= 9; i++) {
    const [source] = getFidelitySources([`ep${i}`]);
    assert.equal(source.kind, 'Épisode officiel');
    assert.match(source.url, /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
  }
  assert.equal(VARIANTS.length, 51);
  for (const variant of VARIANTS) {
    assert.equal(variant.fidelity, getCostumeFidelity(variant.id));
    assert.notEqual(variant.fidelity, getFighterFidelity(variant.baseFighterId), 'a base appearance review must not certify its costumes');
    assert.ok(!/^Validé|^Certifié|^Conforme/.test(variant.fidelity.reviewStatus));
  }
  for (const id of ['baseballpomni', 'shadowcaine', 'maidjax', 'workgangle']) assert.ok(VARIANTS.some(v => v.id === id));
});

test('the Void, cellar and resident corridor cannot borrow an unrelated visual as proof', () => {
  assert.ok(STAGE_FIDELITY.void.sourceIds.includes('glitch-void'));
  assert.ok(!STAGE_FIDELITY.void.sourceIds.includes('glitch-undermap'));
  assert.ok(!STAGE_FIDELITY.void.sourceIds.includes('glitch-false-exit'));
  assert.ok(STAGE_FIDELITY.cellar.sourceIds.includes('glitch-cellar'));
  assert.ok(!STAGE_FIDELITY.backstage.sourceIds.includes('glitch-false-exit'));
  assert.deepEqual(STAGE_FIDELITY.backstage.observedTraits, []);
  assert.match(STAGES.find(s => s.id === 'cellar').description, /yeux multicolores/);
  assert.match(STAGES.find(s => s.id === 'void').description, /blanc et irisé/);
});

test('unknown IDs fail closed and shared review data cannot be mutated by a consumer', () => {
  for (const id of ['unknown', '__proto__', 'constructor', 'toString']) {
    assert.equal(getFighterFidelity(id), null);
    assert.equal(getStageFidelity(id), null);
    assert.equal(getMoveFidelity(id, 'specialBack'), null);
    assert.equal(getMoveFidelity('pomni', id), null);
    assert.equal(getCostumeFidelity(id), null);
    assert.deepEqual(getFidelitySources([id]), []);
  }
  assert.deepEqual(getFidelitySources(null), []);
  assert.equal(getFidelitySources(['ep1', 'ep1']).length, 1);
  assert.throws(() => FIGHTER_FIDELITY.pomni.observedTraits.push('unverified claim'), TypeError);
  assert.throws(() => MOVE_FIDELITY['pomni.specialBack'].sourceIds.push('unknown'), TypeError);
  assert.throws(() => COSTUME_FIDELITY.maidjax.assetReview.visibleTraits.push('unverified claim'), TypeError);
  assert.throws(() => COSTUME_FIDELITY.workgangle.assetReview.issues.push('mutation'), TypeError);
});

test('all 51 costumes have an individual technical review independent of canonical evidence', () => {
  assert.deepEqual(Object.keys(COSTUME_FIDELITY).sort(), VARIANTS.map(v => v.id).sort());
  for (const [id, item] of Object.entries(COSTUME_FIDELITY)) {
    assert.ok(Array.isArray(item.sourceIds) && Array.isArray(item.observedTraits), id);
    assert.equal(getFidelitySources(item.sourceIds).length, item.sourceIds.length, id);
    assert.ok(item.combatAdaptation.includes('mêmes dix techniques'), id);
    assert.ok(item.reviewStatus && item.reviewScope.length > 30, id);
    const review = item.assetReview;
    assert.ok(review.status.startsWith('Revue technique effectuée'), id);
    assert.ok(review.visibleTraits.length >= 2 && review.visibleTraits.every(t => t.length > 15), id);
    for (const field of ['identityEvidence', 'framing', 'transparency', 'proportions']) assert.ok(review[field].length > 35, `${id}:${field}`);
    assert.ok(Array.isArray(review.issues), id);
    assert.match(review.captureId, new RegExp(`^costumes-0\\.4\\.0-page-[1-5]#${id}$`));
    if (item.observedTraits.length) {
      assert.ok(item.sourceIds.length > 0, `${id}: no unsupported canonical observations`);
      assert.equal(item.reviewStatus, 'Comparaison partielle — écarts ou limites');
    } else assert.ok(['Épisode à revoir', 'Référence de costume à identifier'].includes(item.reviewStatus));
  }
  assert.equal(Object.values(COSTUME_FIDELITY).filter(v => v.observedTraits.length).length, 7);
  assert.match(COSTUME_FIDELITY.gangletragedy.reviewScope, /fissure/);
  assert.match(COSTUME_FIDELITY.maidjax.reviewScope, /cœur violet/);
  assert.match(COSTUME_FIDELITY.workgangle.reviewScope, /cravate noire/);
  assert.match(COSTUME_FIDELITY.gloinkqueenscale.assetReview.issues.join(' '), /True Scale/);
  assert.match(COSTUME_FIDELITY.groundedcaine.assetReview.identityEvidence, /ne démontre pas une perte de pouvoirs/);
  assert.deepEqual(COSTUME_FIDELITY.inertbubble.observedTraits, []);
});

test('consulted references identify their exact scope rather than certifying poses or merchandise proportions', () => {
  const [interview] = getFidelitySources(['temmer-interview']);
  assert.equal(interview.kind, 'Entretien primaire');
  assert.match(interview.scope, /ne certifient aucune pose ni aucun costume/);
  for (const id of ['store-maid-jax', 'store-gangle-masks', 'store-gangle-figure', 'store-spudsy-gangle', 'store-costume-group', 'store-spudsy-ragatha']) {
    const [source] = getFidelitySources([id]);
    assert.equal(source.kind, 'Produit dérivé officiel');
    assert.match(source.url, /\/cdn\/shop\/files\//);
    assert.match(source.scope, /ne mesure pas les proportions/);
  }
  assert.match(FIGHTER_FIDELITY.jax.reviewScope, /peau grise/);
});

// Computed from the published e71b08c rules, not from getReplayFighter.
// 7a2bf03 (0.1.0) and d8c5c7b (0.2.0) have identical authored combat rules.
const LEGACY_RULES_SHA256 = 'd1e4b7fdfbc14ababedaa7d18118122edfabcd2d2bf5ad653db9528c5daddd6f';
const UNCHANGED_RULES_SHA256 = '879660d4a347385d1224ad09a1b6de2e9a1c0ac990356bc7b4e50e922e46f1be';
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).filter(k => k !== 'fidelity').sort().map(k => [k, canonical(value[k])]))
  : value;
const rulesDigest = (fighters, omitRetreats = false) => {
  const rules = fighters.map(f => {
    const moves = { ...f.combat.moves };
    if (omitRetreats && ['pomni', 'abstractedkaufmo'].includes(f.id)) delete moves.specialBack;
    return { id: f.id, power: f.power, speed: f.speed, reach: f.reach, stats: f.stats, visual: f.visual, combat: { ...f.combat, moves } };
  });
  return createHash('sha256').update(JSON.stringify(canonical(rules))).digest('hex');
};

test('every old combat rule and body remains exact for 0.1.0 and 0.2.0 replays', () => {
  for (const version of ['0.1.0', '0.2.0']) {
    const fighters = FIGHTERS.map(f => getReplayFighter(f.id, version));
    assert.equal(rulesDigest(fighters), LEGACY_RULES_SHA256, version);
    for (const fighter of fighters) assert.equal(fighter.moves, fighter.combat.moves);
  }
  assert.equal(rulesDigest(FIGHTERS, true), UNCHANGED_RULES_SHA256, 'only the two retreat definitions may change in this pass');
  for (const fighter of FIGHTERS) assert.equal(getReplayFighter(fighter.id, '0.3.0'), fighter);
  assert.notEqual(getReplayFighter('pomni', '0.2.0').moves.specialBack, getFighter('pomni').moves.specialBack);
});

test('all fourteen kits and 140 techniques stay mechanically identical between published 0.3.0 and 0.4.0', () => {
  // Independently derived from git show 171f422:combat/data.mjs. Only presentation
  // fields (visual, sprite, animation, fidelity) are omitted; all authored combat,
  // body, resource, passive, move, power/speed/reach and health fields are included.
  const mechanics = FIGHTERS.map(f => ({ id: f.id, power: f.power, speed: f.speed, reach: f.reach, stats: f.stats, combat: f.combat }));
  const digest = createHash('sha256').update(JSON.stringify(canonical(mechanics))).digest('hex');
  assert.equal(digest, '8c074267273275cb52fa8da66c62dacf258f12d578949dc9f9423b4b62f4e608');
  for (const fighter of FIGHTERS) {
    assert.equal(getReplayFighter(fighter.id, '0.3.0'), fighter);
    assert.equal(getReplayFighter(fighter.id, '0.4.0'), fighter);
    assert.equal(Object.keys(fighter.combat.moves).length, 10);
  }
});

function retreatTrace(id, version, options = {}) {
  const e = new CombatEngine({ fighters: [getReplayFighter(id, version), getFighter('jax')], stage: STAGES[0], cpu: [false, false], skipIntro: true });
  e.state.a.x = options.start ?? 500;
  e.state.b.x = options.reverse ? 250 : 1000;
  const move = e.state.a.f.combat.moves.specialBack;
  const total = move.startup + move.active + move.recovery;
  const deltas = [], positions = [], busy = [];
  let previous = e.state.a.x;
  for (let frame = 0; frame <= total; frame++) {
    e.step(FIXED_DT, frame === 0 ? [{ specialBack: true }, {}] : [{}, {}]);
    deltas.push(e.state.a.x - previous);
    positions.push(e.state.a.x);
    busy.push(!!e.state.a.attack);
    previous = e.state.a.x;
  }
  return { e, move, deltas, positions, busy, total };
}

for (const [id, startup, distance, step, recovery] of [['pomni', 5, 150, 10, 10], ['abstractedkaufmo', 8, 135, 9, 13]]) {
  test(`${id}: the new retreat moves continuously during fifteen active frames`, () => {
    const { e, move, deltas, positions, busy, total } = retreatTrace(id, '0.3.0');
    assert.equal(move.kind, 'mobility');
    assert.equal(move.blink, undefined);
    assert.equal(move.startup, startup);
    assert.equal(move.active, 15);
    assert.equal(move.recovery, recovery);
    assert.deepEqual(deltas.slice(0, startup - 1), Array(startup - 1).fill(0));
    assert.deepEqual(deltas.slice(startup - 1, startup + 14), Array(15).fill(-step));
    assert.deepEqual(deltas.slice(startup + 14), Array(deltas.length - startup - 14).fill(0));
    assert.equal(positions.at(-1), 500 - distance);
    assert.equal(busy[total - 2], true);
    assert.equal(busy[total - 1], false);
    assert.equal(e.state.b.hp, 10000);
  });

  test(`${id}: both old replay versions retain the original instantaneous displacement`, () => {
    for (const version of ['0.1.0', '0.2.0']) {
      const old = retreatTrace(id, version);
      const current = retreatTrace(id, '0.3.0');
      assert.deepEqual(old.deltas.filter(Boolean), [-distance]);
      assert.equal(old.move.active, 1);
      assert.equal(old.move.blink, -distance);
      assert.equal(old.move.travel, undefined);
      assert.equal(old.deltas[startup - 1], -distance);
      assert.equal(old.positions.at(-1), current.positions.at(-1));
      assert.equal(old.total, current.total);
      assert.deepEqual(old.busy, current.busy);
    }
  });

  test(`${id}: a physical retreat respects ring bounds and the facing direction`, () => {
    const corner = retreatTrace(id, '0.3.0', { start: 90 });
    assert.ok(corner.positions.every(x => x >= STAGES[0].bounds.left));
    assert.ok(corner.deltas.every(x => x >= -step && x <= 0));
    const reversed = retreatTrace(id, '0.3.0', { start: 750, reverse: true });
    assert.equal(reversed.positions.at(-1), 750 + distance);
    assert.deepEqual(reversed.deltas.filter(Boolean), Array(15).fill(step));
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FIGHTERS, MOVES, MOVE_SLOTS, COSTUMES, VARIANTS, STAGES, DEDICATED_STAGES, ARCHIVE_ONLY_ENTRIES, getFighter, equipCostume, getReplayFighter } from '../combat/data.mjs';
import { ABSTRACTION_DEFS, ABSTRACTION_IDS, ABSTRACTION_CALM_ID, ABSTRACTION_APPEARANCE_IDS, ABSTRACTION_ART_SLOTS } from '../combat/abstractions-content.mjs';
import { PRE_ABSTRACTION_FIGHTER_IDS, PRE_ABSTRACTION_STAGE_IDS } from '../combat/catalog-history.mjs';
import { STORY_ROUTES, getStoryRival } from '../combat/stories.mjs';
import { getTournamentLore } from '../combat/tournament-lore.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { FRIENDSHIP_CATALOG } from '../combat/friendship-catalog.mjs';
import { validateProgram, recordProgramResult, retryProgram, createProgram } from '../combat/progression.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/abstractions-recovery-20261124.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const frames = (engine, count, inputs = [{}, {}]) => { for (let i = 0; i < count; i++) engine.step(FIXED_DT, inputs); };
const engineFor = (id, face = 1) => {
  const engine = new CombatEngine({ fighters: [getFighter(id), getFighter('jax')], cpu: [false, false], skipIntro: true, seed: 20261124 });
  engine.state.a.x = face > 0 ? 380 : 900; engine.state.b.x = face > 0 ? 900 : 380;
  engine.state.a.face = face; engine.state.b.face = -face;
  engine.state.a.r = 100; engine.state.a.meter = 100;
  return engine;
};

test('the restored 54-fighter, 480-costume baseline and its authored routes remain exact', () => {
  assert.equal(fixture.format, 'encore-abstractions-recovered-baseline-20261124');
  assert.match(fixture.recoveryNotice, /not the lost fixture/);
  assert.deepEqual(PRE_ABSTRACTION_FIGHTER_IDS, fixture.baseline.fighterIds);
  assert.deepEqual(PRE_ABSTRACTION_STAGE_IDS, fixture.baseline.stageIds);
  assert.deepEqual(FIGHTERS.slice(0, 54).map(item => item.id), PRE_ABSTRACTION_FIGHTER_IDS);
  assert.equal(hash(FIGHTERS.slice(0, 54)), fixture.baseline.fighters);
  assert.equal(hash(COSTUMES.slice(0, 480)), fixture.baseline.costumes);
  assert.equal(hash(DEDICATED_STAGES.slice(0, 54)), fixture.baseline.dedicated);
  assert.equal(hash(Object.fromEntries(PRE_ABSTRACTION_FIGHTER_IDS.map(id => [id, STORY_ROUTES[id]]))), fixture.baseline.stories);
});

test('385 independently captured checkpoint states resume, continue and retry on their original catalog', () => {
  assert.equal(fixture.fixtureCount, 77);
  assert.equal(fixture.checkpointCount, 385);
  let checked = 0;
  for (const scenario of fixture.fixtures) for (const checkpoint of scenario.checkpoints) {
    const restored = validateProgram(clone(checkpoint.value));
    assert.deepEqual(restored, checkpoint.value, scenario.id + ':' + checkpoint.checkpointIndex);
    if (checkpoint.continued) assert.deepEqual(recordProgramResult(clone(restored), { won: true, health: 6100 }), checkpoint.continued, scenario.id + ': continued');
    if (checkpoint.retried) assert.deepEqual(retryProgram(clone(restored)), checkpoint.retried, scenario.id + ': retry');
    checked++;
  }
  assert.equal(checked, 385);
  const corrupt = clone(fixture.fixtures[0].checkpoints[1].value);
  corrupt.opponents[0] = 'originalabstractedpomni';
  assert.throws(() => validateProgram(corrupt), /point de reprise/);
});

test('ten new identities own 100 distinct techniques and standing/crouching simulation bodies', () => {
  assert.equal(ABSTRACTION_IDS.length, 10);
  assert.equal(FIGHTERS.length, 64); assert.equal(MOVES.length, 640);
  assert.equal(ABSTRACTION_APPEARANCE_IDS.length, 11); assert.equal(ABSTRACTION_ART_SLOTS.length, 11);
  const names = new Set(), normal = { cellarabstraction: 'abstractedkaufmo', aquaticabstraction: 'bubble', abstractedjax: 'jax', abstractedqueenie: 'queenie', abstractedribbit: 'ribbit' };
  for (const def of ABSTRACTION_DEFS) {
    const fighter = getFighter(def.id), base = getFighter(normal[def.id] || def.rivalId);
    assert.equal(fighter.id, def.id); assert.equal(fighter.combat.key, def.id);
    assert.deepEqual(Object.keys(fighter.moves).sort(), [...MOVE_SLOTS].sort());
    assert.equal(fighter.combat.moves, fighter.moves);
    assert.notEqual(fighter.moves, base.moves);
    assert.ok(!Object.hasOwn(ARCHIVE_ONLY_ENTRIES, def.id));
    assert.equal(fighter.visual.profile, 'abstraction');
    assert.deepEqual(fighter.combat.simulationBody, { width: def.width, height: def.height, crouchHeight: def.crouchHeight });
    const engine = engineFor(def.id);
    assert.deepEqual([engine.box(0).w, engine.box(0).h], [def.width, def.height]);
    engine.step(FIXED_DT, [{ down: true }, {}]);
    assert.equal(engine.box(0).h, def.crouchHeight);
    assert.notDeepEqual(fighter.combat.simulationBody, base.combat.simulationBody);
    for (const move of Object.values(fighter.moves)) {
      names.add(move.name);
      assert.equal(move.fidelity.sourceKind, def.sourceKind);
      assert.ok(move.startup > 0 && move.recovery > 0);
    }
  }
  assert.equal(names.size, 100);
  assert.equal(getFighter('aquaticabstraction').visual.anchorX, .78);
  assert.deepEqual(getFighter('aquaticabstraction').combat.simulationBody, { width: 195, height: 200, crouchHeight: 112 });
});

test('calm Queenie is one costume of abstracted Queenie with unchanged rules and resumable stories', () => {
  const fighter = getFighter('abstractedqueenie'), calm = equipCostume(fighter, ABSTRACTION_CALM_ID);
  assert.equal(VARIANTS.at(-1).id, ABSTRACTION_CALM_ID);
  assert.equal(VARIANTS.at(-1).baseFighterId, fighter.id);
  assert.equal(calm.id, fighter.id); assert.equal(calm.costume, ABSTRACTION_CALM_ID);
  assert.equal(calm.combat, fighter.combat); assert.equal(calm.moves, fighter.moves);
  assert.deepEqual(calm.visual, fighter.visual);
  assert.notEqual(calm.sprite.src, fighter.sprite.src);
  assert.equal(equipCostume(getFighter('queenie'), ABSTRACTION_CALM_ID), getFighter('queenie'));
  assert.equal(getReplayFighter(fighter.id, '0.5.0'), fighter);
  const run = createProgram('story', fighter.id, FIGHTERS, STAGES, { seed: 20261124, variantId: ABSTRACTION_CALM_ID });
  assert.deepEqual(validateProgram(clone(run)), run);
  assert.equal(recordProgramResult(run, { won: true, health: 7000 }).variantId, ABSTRACTION_CALM_ID);
});

test('new projectile slots originate beyond their body in both directions and damage opponents', () => {
  for (const def of ABSTRACTION_DEFS) for (const slot of ['special', 'super']) {
    const move = getFighter(def.id).moves[slot];
    if (move.kind !== 'projectile') continue;
    for (const face of [1, -1]) {
      const engine = engineFor(def.id, face);
      engine.step(FIXED_DT, [{ slot }, {}]);
      let projectile;
      for (let i = 0; i < move.startup + 3 && !projectile; i++) {
        engine.step(FIXED_DT); projectile = engine.state.projectiles.find(item => item.owner === 0);
      }
      assert.ok(projectile, def.id + ':' + slot + ':' + face);
      assert.ok((projectile.x - engine.state.a.x) * face > def.width / 2);
      assert.ok(engine.state.a.r < 100, 'resource cost is charged');
      frames(engine, 105);
      assert.ok(engine.state.b.life < 10000, def.id + ':' + slot + ': hit');
    }
  }
});

test('slow and marked projectiles apply their actual status, and heavy startup remains interruptible', () => {
  for (const [id, status] of [['aquaticabstraction', 'slow'], ['abstractedjax', 'marked'], ['originalabstractedragatha', 'slow']]) {
    const engine = engineFor(id);
    engine.step(FIXED_DT, [{ slot: 'special' }, {}]);
    let observed = false;
    for (let i = 0; i < 130; i++) { engine.step(FIXED_DT); observed ||= !!engine.state.b.statuses[status]; }
    assert.ok(observed, id + ':' + status);
  }
  for (const id of ABSTRACTION_IDS) {
    const engine = engineFor(id);
    engine.state.a.x = 500; engine.state.b.x = 580;
    engine.step(FIXED_DT, [{ slot: 'heavy' }, { slot: 'light' }]);
    frames(engine, 12);
    assert.ok(engine.state.a.life < 10000, id + ': counter hit during startup');
    assert.equal(engine.state.b.life, 10000, id + ': interrupted heavy did not activate');
    assert.equal(engine.state.a.attack, null);
  }
});

test('Queenie traps arm before applying shock and leap shapes move continuously', () => {
  const engine = engineFor('abstractedqueenie');
  engine.step(FIXED_DT, [{ slot: 'specialDown' }, {}]);
  let trap;
  for (let i = 0; i < 35 && !trap; i++) { engine.step(FIXED_DT); trap = engine.state.traps[0]; }
  assert.ok(trap); assert.ok(trap.age < trap.arm);
  engine.state.b.x = trap.x;
  engine.step(FIXED_DT);
  assert.equal(engine.state.b.life, 10000, 'unarmed trap cannot hit');
  let shocked = false;
  for (let i = 0; i < trap.arm + 3; i++) { engine.step(FIXED_DT); shocked ||= !!engine.state.b.statuses.shock; }
  assert.ok(shocked); assert.equal(engine.state.traps.length, 0);
  for (const id of ['abstractedribbit', 'originalabstractedpomni']) {
    const e = engineFor(id); e.state.a.x = 280; e.state.b.x = 1100;
    e.step(FIXED_DT, [{ slot: 'specialForward' }, {}]);
    const deltas = [];
    for (let i = 0; i < 35; i++) { const before = e.state.a.x; e.step(FIXED_DT); deltas.push(e.state.a.x - before); }
    assert.ok(deltas.filter(n => n > 0).length >= 5, id + ': continuous charge');
    assert.ok(deltas.every(n => Math.abs(n) <= 9.001), id + ': no teleport');
  }
});

test('official identities, uncertain archives and invented forms stay distinct and narrated', () => {
  const counts = {};
  for (const def of ABSTRACTION_DEFS) {
    counts[def.sourceKind] = (counts[def.sourceKind] || 0) + 1;
    const fighter = getFighter(def.id), route = STORY_ROUTES[def.id], tour = getTournamentLore(def.id);
    assert.deepEqual(fighter.fidelity.observedTraits, []);
    assert.equal(fighter.fidelity.sourceKind, def.sourceKind);
    assert.ok(!/^(?:Validé|Certifié|Conforme)/.test(fighter.fidelity.reviewStatus));
    assert.equal(getStoryRival(def.id).id, def.rivalId);
    assert.equal(new Set(route.chapters.map(chapter => chapter.opponentId)).size, 4);
    const lines = [...route.chapters, ...route.prologue, ...route.epilogue].flatMap(part => part.dialogue).concat(tour.intro.dialogue);
    assert.ok(lines.every(line => line.speakerId === 'narration'), def.id + ': no invented voice');
    assert.match(tour.prize, /sans guérison/);
    if (def.sourceKind === 'original-encore') {
      assert.deepEqual(fighter.fidelity.sourceIds, []); assert.deepEqual(route.referenceIds, []);
    }
    for (const finale of FINISHER_CATALOG.filter(item => item.fighterId === def.id)) {
      assert.equal(finale.motif, 'glitch'); assert.match(finale.remainingArtWork, /restent à produire/);
      assert.deepEqual(finale.sourceIds, def.sourceIds);
    }
    assert.equal(FRIENDSHIP_CATALOG.filter(item => item.fighterId === def.id).length, 1);
  }
  assert.deepEqual(counts, { 'archive-attribution': 3, 'official-identity': 2, 'original-encore': 5 });
});


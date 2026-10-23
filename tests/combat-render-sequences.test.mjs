import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { FIGHTER_SEQUENCES, SEQUENCE_EVENTS, SEQUENCE_DURATIONS, sequencePose, outcomeEvent } from '../combat/render-sequences.mjs';
import { stageMotion, drawStageMotion, STAGE_AMBIENCES, AMBIENT_FLOOR } from '../combat/render-stage-motion.mjs';
import { actorPose } from '../combat/render-poses.mjs';

test('all fourteen fighters have five individually timed immutable presentation sequences', () => {
  assert.deepEqual(new Set(Object.keys(FIGHTER_SEQUENCES)), new Set(FIGHTERS.map(f => f.id)));
  const ids = [], motions = new Set();
  for (const f of FIGHTERS) for (const event of SEQUENCE_EVENTS) {
    const s = FIGHTER_SEQUENCES[f.id][event];
    ids.push(s.id); assert.equal(s.fighterId, f.id); assert.equal(s.event, event);
    assert.ok(Object.isFrozen(s.keys)); assert.equal(s.keys[0].at, 0); assert.equal(s.keys.at(-1).at, s.duration);
    motions.add(JSON.stringify(s.keys));
  }
  assert.equal(new Set(ids).size, 70); assert.equal(motions.size, 70);
});

test('every sequence is finite, continuous at its keyframes and settles exactly', () => {
  for (const [id, sequences] of Object.entries(FIGHTER_SEQUENCES)) for (const s of Object.values(sequences)) {
    const last = sequencePose(id, s.event, s.duration);
    assert.deepEqual(sequencePose(id, s.event, s.duration + 10000), last);
    assert.equal(last.sequenceDone, true); assert.equal(last.sequenceProgress, 1);
    for (const key of s.keys) {
      const at = sequencePose(id, s.event, key.at);
      for (const field of ['xOffset', 'lift', 'lean', 'alpha']) assert.ok(Math.abs(at[field] - key[field]) < 1e-8);
      if (key.at > 0) assert.ok(Math.abs(sequencePose(id, s.event, key.at - 0.00001).lean - at.lean) < 0.00001);
    }
  }
});

test('reduced motion uses a fixed settled pose for all seventy sequences', () => {
  for (const id of Object.keys(FIGHTER_SEQUENCES)) for (const event of SEQUENCE_EVENTS) {
    const fixed = sequencePose(id, event, 0, { reducedMotion: true });
    assert.deepEqual(fixed, sequencePose(id, event, 1000, { reducedMotion: true }));
    assert.deepEqual(fixed, sequencePose(id, event, SEQUENCE_DURATIONS[event]));
  }
});

test('phase routing distinguishes round and final results and leaves draws neutral', () => {
  assert.equal(outcomeEvent('intro', 0), 'intro');
  assert.equal(outcomeEvent('roundOver', 0, 1, 0), 'roundVictory');
  assert.equal(outcomeEvent('roundEnd', 1, 1, 0), 'roundDefeat');
  assert.equal(outcomeEvent('matchOver', 1, 1, 0), 'matchVictory');
  assert.equal(outcomeEvent('matchOver', 0, 1, 0), 'matchDefeat');
  for (const result of [-1, 2, undefined, NaN]) assert.equal(outcomeEvent('matchOver', 0, result), null);
  assert.equal(outcomeEvent('fight', 0, 0, 0), null);
});

test('presentation uses its own clock and never changes a fighter or combat state', () => {
  for (const f of FIGHTERS) {
    const actor = { f, slot: 0, state: 'hit', hit: 12, x: 400, y: 568, attack: { t: 5, def: f.moves.heavy } }, before = JSON.stringify(actor);
    const first = actorPose(actor, { phase: 'matchOver', winner: 0, frame: 4000, presentationFrame: 0 });
    const next = actorPose(actor, { phase: 'matchOver', winner: 0, frame: 4000, presentationFrame: 30 });
    assert.notDeepEqual(first, next); assert.equal(first.state, 'victory');
    assert.equal(next.sequenceId, `${f.id}:matchVictory`); assert.equal(JSON.stringify(actor), before);
  }
});

test('motions have bounded rigid offsets and alpha without negative lift or scaling', () => {
  for (const id of Object.keys(FIGHTER_SEQUENCES)) for (const event of SEQUENCE_EVENTS) for (let tick = 0; tick <= 150; tick++) {
    const p = sequencePose(id, event, tick);
    assert.ok(Math.abs(p.xOffset) <= 16); assert.ok(p.lift >= 0 && p.lift <= 20);
    assert.ok(Math.abs(p.lean) <= 0.14); assert.ok(p.alpha >= 0.8 && p.alpha <= 1);
    assert.ok(!('scale' in p)); assert.ok(Number.isInteger(p.frame) && p.frame >= 0 && p.frame < 8);
  }
});

test('invalid sequence inputs are safe and negative frames clamp to the beginning', () => {
  assert.equal(sequencePose('missing', 'intro', 0), null);
  assert.equal(sequencePose('jax', 'fight', 0), null);
  for (const frame of [-100, NaN, Infinity]) assert.deepEqual(sequencePose('jax', 'intro', frame), sequencePose('jax', 'intro', 0));
});

test('each of twelve stage ambiences has a distinct deterministic evolving layer', () => {
  assert.deepEqual(new Set(Object.keys(STAGE_AMBIENCES)), new Set(STAGES.map(s => s.id)));
  const forms = new Set();
  for (const s of STAGES) {
    const first = stageMotion(s, 0), later = stageMotion(s, 123);
    assert.ok(first.shapes.length > 0 && first.shapes.length <= 24);
    assert.notDeepEqual(first.shapes, later.shapes); assert.deepEqual(later, stageMotion(s, 123));
    forms.add(JSON.stringify(first.shapes));
  }
  assert.equal(forms.size, 12);
});

test('reduced-motion stage layers are static, including the calibration scanner', () => {
  for (const s of STAGES) assert.deepEqual(stageMotion(s, 0, true), stageMotion(s, 40000, true));
  assert.deepEqual(stageMotion('circus', 10), stageMotion('bigtop', 10));
  assert.equal(stageMotion('missing', 50).shapes.length, 0);
});

test('ambient layers are clipped above the fight floor and restore Canvas state', () => {
  for (const s of STAGES) {
    const calls = [], ctx = new Proxy({}, { get: (_, key) => (...args) => calls.push([key, ...args]), set: () => true });
    drawStageMotion(ctx, s, 123);
    assert.deepEqual(calls[0], ['save']); assert.deepEqual(calls[2], ['rect', 0, 0, 1280, AMBIENT_FLOOR]);
    assert.deepEqual(calls[3], ['clip']); assert.deepEqual(calls.at(-1), ['restore']);
    assert.equal(AMBIENT_FLOOR, 568);
  }
});

test('stage sampling preserves its input and rejects nonfinite presentation clocks', () => {
  for (const s of STAGES) {
    const before = JSON.stringify(s);
    for (const tick of [0, 100, 100000, -2, NaN, Infinity]) {
      const motion = stageMotion(s, tick);
      assert.ok(!JSON.stringify(motion).includes('null'));
      assert.equal(JSON.stringify(s), before);
    }
    assert.deepEqual(stageMotion(s, NaN), stageMotion(s, 0));
  }
});

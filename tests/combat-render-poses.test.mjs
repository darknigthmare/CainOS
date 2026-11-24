import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, equipCostume } from '../combat/data.mjs';
import { ABSTRACTION_IDS } from '../combat/abstractions-content.mjs';
import { ANIMATION_REGISTRATION, POSE_PRESENTATION, frameRegistration, spriteSourceRegion, bendLeg, crouchParts, actorPose, frameGeometry, illustratedAction, illustratedHeightRatio } from '../combat/render-poses.mjs';

const fighter = id => FIGHTERS.find(f => f.id === id);
const actor = (id = 'pomni', extra = {}) => ({ f: fighter(id), slot: 0, x: 400, y: 568, face: 1, onGround: true, state: 'idle', ...extra });
const sourceFrame = (id, index = 0) => {
  const f = fighter(id), p = ANIMATION_REGISTRATION[id], a = p.anchors[index];
  return { animated: true, index, registration: frameRegistration(f.animation, index, ...p.size), x: 80, y: 80, width: 300, height: 400, bounds: { x: 95, y: 90, width: 240, height: a.y - 90 + 1 }, floorContour: [[a.x - 20, a.y + 1], [a.x + 20, a.y + 1]] };
};
const almost = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
const transform = (m, p) => [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];

test('dedicated action drawings follow the resolved state, final outcome and exact move', () => {
  const fighter = actor('gummigoo');
  const action = (extra, options = {}) => {
    const value = { ...fighter, ...extra };
    return illustratedAction(actorPose(value, options), value.attack);
  };
  assert.equal(action({}, { phase: 'intro' }), 'intro');
  assert.equal(action({}, { phase: 'matchOver', winner: 0 }), 'victory');
  assert.equal(action({}, { phase: 'roundEnd', roundWinner: 1 }), 'defeat');
  assert.equal(action({}, { phase: 'roundEnd', roundWinner: -1 }), null);
  for (const state of ['walk', 'jump', 'crouch', 'hit']) assert.equal(action({ state }), state);
  const move = (name, frame) => ({ attack: { name, def: fighter.f.moves[name], t: frame } });
  const light = fighter.f.moves.light;
  assert.equal(action(move('light', 0)), null);
  assert.equal(action(move('light', light.startup)), 'attack');
  assert.equal(action(move('light', light.startup + light.active)), 'attack');
  assert.equal(action(move('light', light.startup + light.active + light.recovery)), null);
  assert.equal(action(move('heavy', fighter.f.moves.heavy.startup)), 'heavy');
  assert.equal(action(move('heavy', 0)), null);
  for (const other of ['low', 'throw', 'special', 'super']) {
    assert.equal(action(move(other, fighter.f.moves[other].startup)), null);
  }
  for (const id of ['ragatha', 'gangle']) {
    const value = actor(id), def = value.f.moves.light;
    assert.equal(actorPose({ ...value, attack: { name: 'light', def, t: def.startup } }).frame, 6);
  }
});

test('registrations cover the eight inspected cells of each of the seven exact source files', () => {
  assert.equal(Object.keys(ANIMATION_REGISTRATION).length, 7);
  let count = 0;
  for (const [id, p] of Object.entries(ANIMATION_REGISTRATION)) {
    assert.equal(p.anchors.length, 8);
    assert.ok(Object.isFrozen(p.anchors));
    for (let index = 0; index < 8; index++) {
      const found = frameRegistration(fighter(id).animation, index, ...p.size);
      assert.equal(found.id, id); assert.equal(found.index, index);
      assert.ok(found.anchor.x > 0 && found.anchor.x < p.size[0] / 4);
      assert.ok(found.anchor.y > 0 && found.anchor.y < p.size[1] / 2);
      count++;
    }
  }
  assert.equal(count, 56);
});

test('unreviewed filenames, dimensions, grids and frame indexes never borrow a registration', () => {
  const spec = fighter('jax').animation;
  assert.equal(frameRegistration({ ...spec, src: '../assets/new-jax.png' }, 0, 1536, 1024), null);
  assert.equal(frameRegistration(spec, 0, 2048, 1024), null);
  assert.equal(frameRegistration({ ...spec, rows: 3 }, 0, 1536, 1024), null);
  assert.equal(frameRegistration(spec, 8, 1536, 1024), null);
});

test('Gangle walk regions retain the left crossing ribbon without importing it into the preceding cell', () => {
  const spec = fighter('gangle').animation;
  const second = spriteSourceRegion(spec, 2, true, 1536, 1024), third = spriteSourceRegion(spec, 3, true, 1536, 1024);
  assert.equal(second.x + second.width, 1088);
  assert.equal(third.x, 1132);
  assert.equal(third.offsetX, -20);
  assert.ok(third.x < 1141, 'observed ribbon starts eleven pixels before its nominal cell');
  assert.ok(second.x + second.width < 1141, 'neighbouring ribbon excluded');
});

test('absolute costume rectangles override grids without altering animated-source registrations', () => {
  const spec = { src: 'atlas.png', cols: 4, rows: 3, col: 1, row: 2, sourceRect: { x: 450, y: 340, width: 245, height: 285 } };
  const region = spriteSourceRegion(spec, 9, false, 1536, 1024);
  assert.deepEqual({ x: region.x, y: region.y, width: region.width, height: region.height }, spec.sourceRect);
  assert.equal(region.registration, null);
  assert.equal(region.offsetX, 0);
  const animation = fighter('pomni').animation;
  assert.equal(spriteSourceRegion({ ...animation, sourceRect: spec.sourceRect }, 1, true, 1774, 887).x, 443);
});

test('invalid absolute crop coordinates are rejected before Canvas can clip or stretch them', () => {
  for (const sourceRect of [{ x: -1, y: 0, width: 50, height: 50 }, { x: 0, y: 0, width: 0, height: 1 }, { x: 1000, y: 0, width: 600, height: 10 }, { x: 0.5, y: 0, width: 50, height: 50 }]) {
    assert.throws(() => spriteSourceRegion({ sourceRect }, 0, false, 1536, 1024), /Invalid sprite source rectangle/);
  }
});

test('shallow crouch articulation preserves both bone lengths, the ankle, and rigid transforms', () => {
  for (const id of ['pomni', 'zooble']) {
    const rig = ANIMATION_REGISTRATION[id].crouchRig;
    for (const leg of rig.legs) {
      const bent = bendLeg(leg, rig.drop);
      assert.deepEqual(bent.ankle, leg.ankle);
      almost(Math.hypot(...bent.knee.map((v, i) => v - bent.hip[i])), Math.hypot(...leg.knee.map((v, i) => v - leg.hip[i])));
      almost(Math.hypot(...bent.ankle.map((v, i) => v - bent.knee[i])), Math.hypot(...leg.ankle.map((v, i) => v - leg.knee[i])));
      for (const m of [bent.upper, bent.lower]) { almost(m.a * m.d - m.b * m.c, 1); almost(Math.hypot(m.a, m.b), 1); almost(Math.hypot(m.c, m.d), 1); }
      transform(bent.upper, leg.hip).forEach((v, i) => almost(v, bent.hip[i]));
      transform(bent.lower, leg.ankle).forEach((v, i) => almost(v, bent.ankle[i]));
      assert.equal(Math.sign(bent.knee[0] - bent.hip[0]), leg.bend, 'knees fold outward, not into a shared knot');
    }
  }
});

test('zero articulation returns untouched joints and impossible folds fail safely', () => {
  const leg = ANIMATION_REGISTRATION.pomni.crouchRig.legs[0];
  const rest = bendLeg(leg, 0);
  assert.deepEqual(rest.knee, leg.knee);
  assert.deepEqual(rest.upper, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  assert.equal(bendLeg(leg, 900), null);
  assert.equal(bendLeg(leg, Number.NaN), null);
});

test('the face and torso are one translated piece, and the shoe band never transforms', () => {
  for (const id of ['pomni', 'zooble']) {
    const pose = crouchParts(fighter(id), sourceFrame(id));
    const body = pose.parts.find(p => p.name === 'body'), shoes = pose.parts.find(p => p.name === 'shoes');
    assert.deepEqual(body.matrix, { a: 1, b: 0, c: 0, d: 1, e: 0, f: ANIMATION_REGISTRATION[id].crouchRig.drop });
    assert.deepEqual(shoes.matrix, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    assert.ok(body.toY + pose.drop < sourceFrame(id).registration.anchor.y, 'torso cannot be translated under the floor');
  }
});

test('costumes, static sprites, other morphologies and non-idle drawings never inherit a base cutout rig', () => {
  assert.equal(crouchParts({ ...fighter('pomni'), costume: 'maidpomni' }, sourceFrame('pomni')), null);
  assert.equal(crouchParts(fighter('jax'), sourceFrame('pomni')), null);
  assert.equal(crouchParts(fighter('pomni'), { ...sourceFrame('pomni'), animated: false }), null);
  assert.equal(crouchParts(fighter('pomni'), sourceFrame('pomni', 1)), null);
  for (const id of ['jax', 'ragatha', 'gangle', 'kinger', 'caine']) assert.equal(crouchParts(fighter(id), sourceFrame(id)), null);
});

test('right-facing standing art overrides the Queen’s left-facing atlas on either side', () => {
  const queen = fighter('gloinkqueen');
  const atlas = { bounds: { x: 0, y: 0, width: 300, height: 100 } };
  const stance = { ...atlas, nativeFacing: 1 };
  for (const facing of [-1, 1]) {
    assert.equal(frameGeometry(queen, atlas, atlas, {}, facing).flip, -facing);
    assert.equal(frameGeometry(queen, stance, stance, {}, facing).flip, facing);
  }
});

test('uniform scale is fixed by idle height; taller reaction and wider accessory frames keep it', () => {
  const f = fighter('caine'), idle = sourceFrame('caine'), portal = sourceFrame('caine', 6);
  portal.bounds = { x: 10, y: 30, width: 360, height: 470 };
  const a = frameGeometry(f, idle, idle, { lean: 0 }), b = frameGeometry(f, portal, idle, { lean: 0 });
  assert.equal(a.scale, b.scale);
  assert.equal(b.anchor.x, 106, 'portal width does not recenter the body');
  assert.equal(b.flip, 1);
  assert.equal(frameGeometry(f, portal, idle, { lean: 0 }, -1).flip, -1);
});

test('support compensation keeps the lowest source point on the floor for either facing', () => {
  const f = fighter('jax'), frame = sourceFrame('jax');
  for (const facing of [-1, 1]) for (const lean of [-0.09, 0, 0.05]) {
    const g = frameGeometry(f, frame, frame, { lean }, facing);
    const supportPoints = frame.floorContour.map(([x, y]) => ((x + 0.5 - g.anchor.x) * g.flip * Math.sin(g.angle) + (y - g.anchor.y) * Math.cos(g.angle)) * g.scale - g.support);
    almost(Math.max(...supportPoints), 0);
  }
});

test('intro, victory, defeat and draw select distinct honest source presentations before stale combat state', () => {
  const a = actor('pomni', { hit: 8, crouch: true });
  assert.equal(actorPose(a, { phase: 'intro' }).frame, 4);
  assert.equal(actorPose(a, { phase: 'roundOver', roundWinner: 0 }).state, 'victory');
  assert.equal(actorPose(a, { phase: 'roundOver', roundWinner: 0 }).frame, 5);
  assert.equal(actorPose(a, { phase: 'matchOver', winner: 1 }).frame, 7);
  assert.equal(actorPose(a, { phase: 'roundOver', roundWinner: -1 }).state, 'draw');
});

test('attack source selection separates startup, contact and recovery without changing attack data', () => {
  const def = fighter('pomni').moves.heavy, a = actor('pomni', { attack: { name: 'heavy', def, t: def.startup - 1 } });
  assert.equal(actorPose(a).state, 'attack-windup'); assert.equal(actorPose(a).frame, 0);
  a.attack.t = def.startup; assert.equal(actorPose(a).state, 'attack-active'); assert.equal(actorPose(a).frame, 3);
  a.attack.t = def.startup + def.active + def.recovery - 1;
  assert.equal(actorPose(a).state, 'attack-recovery'); assert.equal(actorPose(a).frame, 0);
});

test('Caine portal and Kinger thinking artwork are not reused as every attack', () => {
  const pose = (id, slot) => { const def = fighter(id).moves[slot]; return actorPose(actor(id, { attack: { name: slot, def, t: def.startup } })); };
  assert.notEqual(pose('caine', 'heavy').frame, 6);
  assert.notEqual(pose('caine', 'special').frame, 6);
  assert.equal(pose('caine', 'specialBack').frame, 6);
  assert.notEqual(pose('kinger', 'heavy').frame, 6);
  assert.equal(actorPose(actor('gangle', { state: 'guard' })).frame, 0, 'guard does not crack the mask');
});

test('low-profile moves use the reviewed idle cutout even when the engine crouch flag is false', () => {
  const f = fighter('jax'), a = actor('jax', { crouch: false, attack: { name: 'low', def: f.moves.low, t: f.moves.low.startup } });
  const pose = actorPose(a);
  assert.equal(pose.low, true); assert.equal(pose.frame, 0);
  assert.equal(pose.state, 'attack-active');
});

test('reduced motion freezes presentation loops while preserving the current gameplay pose', () => {
  for (const state of ['idle', 'walk', 'guard', 'crouch', 'jump']) {
    const a = actor('pomni', { state });
    assert.deepEqual(actorPose(a, { frame: 0, reducedMotion: true }), actorPose(a, { frame: 600, presentationFrame: 900, reducedMotion: true }));
  }
  const a = actor('jax');
  assert.deepEqual(actorPose(a, { phase: 'roundOver', roundWinner: 0, presentationFrame: 0, reducedMotion: true }), actorPose(a, { phase: 'roundOver', roundWinner: 0, presentationFrame: 600, reducedMotion: true }));
  assert.notEqual(actorPose(a, { phase: 'roundOver', roundWinner: 0, presentationFrame: 0 }).lean, actorPose(a, { phase: 'roundOver', roundWinner: 0, presentationFrame: 30 }).lean);
});

test('presentation reads all fourteen fighter kits and every move without mutating simulation data', () => {
  const original = JSON.stringify(FIGHTERS);
  for (const f of FIGHTERS) for (const [name, def] of Object.entries(f.moves)) for (const t of [0, def.startup, def.startup + def.active + 1]) {
    const a = actor(f.id, { attack: { name, def, t }, statuses: { burn: 20 }, buffs: { armor: 1 } });
    const before = JSON.stringify(a), pose = actorPose(a, { frame: 240, presentationFrame: 300 });
    assert.ok(Number.isFinite(pose.lean)); assert.ok(pose.frame >= 0 && pose.frame < 8);
    assert.equal(JSON.stringify(a), before);
  }
  assert.equal(JSON.stringify(FIGHTERS), original);
  assert.equal(Object.keys(POSE_PRESENTATION).length, 7);
});

test('Jax keeps intact artwork for low stance and does not inherit the historical cutout rig', () => {
  assert.equal(ANIMATION_REGISTRATION.jax.crouchRig, undefined);
  assert.equal(crouchParts(fighter('jax'), sourceFrame('jax')), null);
  assert.equal(actorPose(actor('jax', { crouch: true })).low, true);
});

test('an asymmetric abstraction anchors its head uniformly on either side without shifting legacy art', () => {
  const f = fighter('aquaticabstraction');
  const frame = { bounds: { x: 55, y: 46, width: 532, height: 234 }, nativeFacing: 1 };
  const before = JSON.stringify([f, frame]), front = frame.bounds.x + frame.bounds.width;
  for (const face of [1, -1]) {
    const geometry = frameGeometry(f, frame, frame, {}, face);
    almost(geometry.scale, 200 / 234);
    almost(geometry.anchor.x, 55 + 532 * 0.78);
    almost((front - geometry.anchor.x) * geometry.scale, 100.03418803418803);
    assert.equal(geometry.flip, face);
    assert.ok(f.moves.special.projectileOrigin[face].forward > (front - geometry.anchor.x) * geometry.scale);
  }
  const neutral = frameGeometry(fighter('pomni'), frame, frame, {});
  almost(neutral.anchor.x, 55 + 532 / 2);
  const registered = sourceFrame('caine', 6);
  assert.deepEqual(frameGeometry({ ...fighter('caine'), visual: { ...fighter('caine').visual, anchorX: 0.78 } },
    registered, registered, {}).anchor, registered.registration.anchor);
  assert.equal(JSON.stringify([f, frame]), before);
});

test('lowered abstraction drawings stay within their authored width without resizing legacy fighters', () => {
  const f = fighter('cellarabstraction');
  // Visible dimensions decoded from the current native horizontal attack.
  const frame = { bounds: { x: 28, y: 33, width: 592, height: 254 }, nativeFacing: 1 };
  const before = JSON.stringify([f, frame]);
  for (const face of [1, -1]) {
    const geometry = frameGeometry(f, frame, frame, { lean: .05 }, face);
    almost(geometry.scale * frame.bounds.width, 290);
    assert.ok(geometry.scale * frame.bounds.height < 125, 'A low pose stays lower than its 280px stance');
    almost(geometry.anchor.x, frame.bounds.x + frame.bounds.width / 2);
    assert.equal(geometry.flip, face);
  }
  assert.equal(JSON.stringify([f, frame]), before);
  const old = FIGHTERS.filter(f => !ABSTRACTION_IDS.includes(f.id));
  assert.ok(old.length >= 54);
  for (const legacy of old) {
    assert.equal(legacy.visual?.maxIllustratedWidth, undefined, legacy.id);
    almost(frameGeometry(legacy, frame, frame, {}).scale, legacy.visual.height / frame.bounds.height);
  }
});

test('calm Queenie owns a width limit while retaining its low central anchor on both sides', () => {
  const queenie = fighter('abstractedqueenie'), calm = equipCostume(queenie, 'abstractedqueeniedark');
  const frame = { bounds: { x: 19, y: 35, width: 600, height: 379 }, nativeFacing: 1 };
  for (const face of [1, -1]) {
    const geometry = frameGeometry(calm, frame, frame, { lean: .05 }, face);
    almost(geometry.scale * frame.bounds.width, 315);
    assert.deepEqual(geometry.anchor, { x: 319, y: 414 });
    assert.equal(geometry.flip, face);
    almost(frameGeometry(queenie, frame, frame, { lean: .05 }, face).scale * frame.bounds.width, 355);
  }
});

test('raised-pose calibration preserves the body scale only for its resolved authored action', () => {
  const f = fighter('originalabstractedpomni'), move = f.moves.heavy;
  const a = actor(f.id, { attack: { name: 'heavy', def: move, t: 0 } });
  const source = () => illustratedAction(actorPose(a), a.attack);
  assert.equal(source(), null, 'Windup still shows the standing drawing');
  assert.equal(illustratedHeightRatio(f, source()), 1);
  a.attack.t = move.startup;
  assert.equal(source(), 'heavy');
  const frame = { bounds: { x: 48, y: 81, width: 493, height: 486 }, nativeFacing: 1 };
  const before = JSON.stringify([f, a, frame]);
  for (const face of [1, -1]) {
    const geometry = frameGeometry(f, frame, frame, {}, face, illustratedHeightRatio(f, source()));
    almost(geometry.scale * frame.bounds.height, 364);
    assert.ok(geometry.scale * frame.bounds.width < 530);
    assert.deepEqual(geometry.anchor, { x: 294.5, y: 567 });
    assert.equal(geometry.flip, face);
    const wide = { ...frame, bounds: { ...frame.bounds, width: 1200 } };
    almost(frameGeometry(f, wide, wide, {}, face, illustratedHeightRatio(f, source())).scale * 1200, 530,
      'Height calibration cannot bypass the width ceiling');
  }
  assert.equal(JSON.stringify([f, a, frame]), before);
  const calibrated = FIGHTERS.filter(f => f.visual?.poseHeightFactors).map(f => [f.id, Object.keys(f.visual.poseHeightFactors).sort()]);
  assert.deepEqual(calibrated, [
    ['originalabstractedpomni', ['heavy', 'hit', 'intro', 'victory']],
    ['originalabstractedragatha', ['heavy']],
  ]);
  for (const legacy of FIGHTERS.filter(f => !ABSTRACTION_IDS.includes(f.id))) {
    assert.equal(legacy.visual?.poseHeightFactors, undefined, legacy.id);
    for (const action of [null, 'intro', 'heavy', 'hit', 'victory']) assert.equal(illustratedHeightRatio(legacy, action), 1, legacy.id);
    assert.equal(illustratedHeightRatio(legacy, 'crouch'), .74, legacy.id);
    assert.equal(illustratedHeightRatio(legacy, 'defeat'), .74, legacy.id);
  }
});

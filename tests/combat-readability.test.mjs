import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS } from '../combat/data.mjs';
import { CombatEngine } from '../combat/engine.mjs';
import { cleanSettings, emptyProfile, validateProfile, saveProfile, readProfile } from '../combat/session.mjs';
import { fighterReadout, fighterMarkers } from '../combat/readability.mjs';

const actor = (fighter = FIGHTERS[0]) => new CombatEngine({ fighters: [fighter, fighter], mode: 'local', cpu: [false, false], skipIntro: true }).state.fighters[0];

test('reinforced cues are opt-in and old version-one profiles retain their progress', () => {
  for (const value of [undefined, null, false, 1, 'true', {}, []]) assert.equal(cleanSettings({ enhancedReadability: value }).enhancedReadability, false);
  assert.equal(cleanSettings({ enhancedReadability: true }).enhancedReadability, true);
  const legacy = emptyProfile(); delete legacy.settings.enhancedReadability; legacy.stats.wins = 7; legacy.stats.matches = 11;
  const loaded = validateProfile(legacy);
  assert.equal(loaded.version, 1); assert.equal(loaded.settings.enhancedReadability, false); assert.deepEqual(loaded.stats, legacy.stats);
});

test('the cue setting survives save and profile import without changing progress or bindings', () => {
  const profile = emptyProfile(); profile.settings.enhancedReadability = true; profile.stats.matches = 3; profile.challenges = ['combo'];
  const data = new Map(), storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  assert.equal(saveProfile(storage, profile), true);
  assert.deepEqual(readProfile(storage), profile); assert.deepEqual(validateProfile(JSON.parse(JSON.stringify(profile))), profile);
  assert.equal(emptyProfile().settings.enhancedReadability, false);
});

test('critical-life text uses the actual quarter-health boundary without rounding or false KO', () => {
  const value = actor(); value.max = 10000;
  value.life = 2501; assert.equal(fighterReadout(value).critical, false);
  value.life = 2500; assert.equal(fighterReadout(value).critical, true); assert.match(fighterReadout(value).status, /VIE CRITIQUE/);
  value.life = 0; assert.equal(fighterReadout(value).critical, false); assert.equal(fighterReadout(value).status, 'KO');
});

test('all fourteen finale thresholds follow the authored kit rather than a fixed 100 percent', () => {
  for (const fighter of FIGHTERS) {
    const value = actor(fighter), required = value.f.combat.moves.super.meter;
    value.r = value.f.combat.resource.max; value.meter = required - .01;
    assert.equal(fighterReadout(value).ready, false, fighter.id);
    value.meter = required;
    assert.equal(fighterReadout(value).requiredMeter, required, fighter.id);
    assert.equal(fighterReadout(value).ready, true, fighter.id);
    assert.match(fighterReadout(value).status, /FINALE PRÊTE/, fighter.id);
  }
});

test('a full finale gauge still names a missing resource or cooldown instead of claiming readiness', () => {
  const value = actor(); value.meter = 100; value.r = 0;
  assert.equal(fighterReadout(value).ready, false); assert.match(fighterReadout(value).status, /RESSOURCE REQUISE/);
  value.r = 100; value.cooldowns.super = 10;
  assert.equal(fighterReadout(value).ready, false); assert.match(fighterReadout(value).status, /RÉCUPÉRATION/);
  value.cooldowns.super = 0; assert.equal(fighterReadout(value).ready, true);
});

test('readouts describe guard fragility without inventing a guard-break event and never mutate actors', () => {
  const value = actor(); value.guard = 25; const before = JSON.stringify(value);
  assert.match(fighterReadout(value).status, /GARDE FRAGILE/); assert.doesNotMatch(fighterReadout(value).status, /BRISÉE/);
  assert.equal(JSON.stringify(value), before);
  value.guard = 25.01; assert.doesNotMatch(fighterReadout(value).status, /GARDE FRAGILE/);
});

test('circle J1 and diamond J2 follow their slots across a mirror-match crossover', () => {
  const actors = [actor(), actor()]; actors[0].x = 900; actors[1].x = 380;
  const before = JSON.stringify(actors), markers = fighterMarkers(actors);
  assert.deepEqual(markers.map(({ label, shape }) => ({ label, shape })), [{ label: 'J1', shape: 'circle' }, { label: 'J2', shape: 'diamond' }]);
  assert.ok(markers[0].x > markers[1].x); assert.equal(JSON.stringify(actors), before);
});

test('nearby and high-jumping badges remain bounded on separate rows', () => {
  const actors = [actor(), actor()];
  for (const y of [568, 100, -100]) {
    actors[0].x = 640; actors[1].x = 641; actors.forEach(value => { value.y = y; });
    const markers = fighterMarkers(actors);
    assert.ok(Math.abs(markers[0].y - markers[1].y) >= 104);
    assert.ok(markers.every(({ x, y }) => x >= 80 && x <= 1200 && y >= 42 && y <= 600));
  }
});

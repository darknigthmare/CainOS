import test from 'node:test';
import assert from 'node:assert/strict';
import { AUDIO_EFFECT_IDS, AUDIO_IMPACT_CUES, selectCombatCue } from '../combat/audio.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS, STAGES } from '../combat/data.mjs';

const damage = (slot, overrides = {}) => ({ type: 'damage', frame: 100, actor: 0, target: 1, blocked: false, amount: 400, slot, ...overrides });
const state = { fighters: [{ life: 10000 }, { life: 10000 }] };

test('landed light, heavy, low, throw, special and super contacts select six distinct available sounds', () => {
  const slots = ['light', 'heavy', 'low', 'throw', 'special', 'super'];
  assert.deepEqual(slots.map(slot => selectCombatCue([damage(slot)], state)), AUDIO_IMPACT_CUES);
  for (const cue of AUDIO_IMPACT_CUES) assert.ok(AUDIO_EFFECT_IDS.includes(cue));
  for (const slot of ['specialDown', 'specialForward', 'specialBack']) assert.equal(selectCombatCue([damage(slot)], state), 'impactSpecial');
  for (const slot of ['air', 'dash']) assert.equal(selectCombatCue([damage(slot)], state), 'impactLight');
  assert.equal(selectCombatCue([damage('unknown')], state), 'damage');
});

test('guarded blows, super wind-ups and trap placement do not pretend to be landed impacts', () => {
  for (const slot of ['light', 'heavy', 'low', 'throw', 'special', 'super']) {
    assert.equal(selectCombatCue([damage(slot, { blocked: true })], state), 'block');
  }
  assert.equal(selectCombatCue([{ type: 'activate', slot: 'super' }], state), 'super');
  assert.equal(selectCombatCue([{ type: 'activate', slot: 'specialForward' }], state), 'special');
  assert.equal(selectCombatCue([{ type: 'activate', slot: 'heavy' }], state), null);
  assert.equal(selectCombatCue([{ type: 'trapPlaced' }, { type: 'activate', slot: 'specialDown' }], state), 'trap');
  assert.equal(selectCombatCue([{ type: 'trapTrigger' }, damage('specialDown')], state), 'impactSpecial');
});

test('critical outcomes take precedence while simultaneous ordinary contacts use the larger impact', () => {
  const impact = damage('super', { amount: 1700 });
  for (const type of ['guardBreak', 'parry', 'reflect', 'throwTech', 'explosion']) {
    assert.equal(selectCombatCue([impact, { type }], state), type);
  }
  assert.equal(selectCombatCue([impact, { type: 'roundEnd' }, { type: 'guardBreak' }], { fighters: [{ life: 10 }, { life: 0 }] }), 'ko');
  assert.equal(selectCombatCue([{ type: 'roundEnd' }], state), null, 'Timeout with remaining life has no KO cue');
  assert.equal(selectCombatCue([{ type: 'roundEnd' }], { a: { life: 0 }, b: { life: 0 } }), 'ko');
  assert.equal(selectCombatCue([{ type: 'roundEnd' }], { fighters: [{ hp: 10 }, { hp: 0 }] }), 'ko');
  assert.equal(selectCombatCue([damage('heavy', { amount: 700 }), damage('light', { amount: 300 })], state), 'impactHeavy');
  assert.equal(selectCombatCue([damage('light', { amount: 300 }), damage('heavy', { amount: 700 })], state), 'impactHeavy');
  assert.equal(selectCombatCue([damage('super', { blocked: true }), damage('light')], state), 'impactLight');
});

test('invalid batches and damage values produce no invented sound and frozen events remain untouched', () => {
  for (const events of [null, undefined, {}, [], [null, undefined, {}], [{ type: 'constructor' }]]) assert.equal(selectCombatCue(events, state), null);
  for (const invalid of [{ amount: 0 }, { amount: NaN }, { amount: -1 }, { amount: Infinity }, { actor: -1 }, { target: 0 }, { blocked: undefined }]) {
    assert.equal(selectCombatCue([damage('heavy', invalid)], state), null);
  }
  const events = Object.freeze([Object.freeze(damage('heavy'))]), before = JSON.stringify(events);
  for (let i = 0; i < 20; i++) assert.equal(selectCombatCue(events, Object.freeze(state)), 'impactHeavy');
  assert.equal(JSON.stringify(events), before);
});

test('real engine contacts preserve simulation snapshots while selecting their audible family', () => {
  const expected = { light: 'impactLight', heavy: 'impactHeavy', low: 'impactLow', throw: 'impactThrow', special: 'impactSpecial', super: 'impactSuper' };
  for (const [slot, cue] of Object.entries(expected)) {
    const engine = new CombatEngine({ fighters: FIGHTERS.slice(0, 2), stage: STAGES[0], mode: 'local', cpu: [false, false], skipIntro: true, roundsToWin: 1, seed: 7452 });
    engine.state.a.x = 500; engine.state.b.x = 560; engine.state.a.meter = 100; engine.state.a.r = 100;
    engine.drainEvents(); let heard = null;
    for (let frame = 0; frame < 120; frame++) {
      engine.step(FIXED_DT, [{ slot: frame === 0 ? slot : null }, {}]);
      const events = engine.drainEvents(), before = engine.getSnapshot();
      const selected = selectCombatCue(events, engine.state);
      assert.deepEqual(engine.getSnapshot(), before, slot + ' audio must not change the match');
      if (events.some(event => event.type === 'damage')) { heard = selected; break; }
    }
    assert.equal(heard, cue, slot);
  }
});


test('a real throw escape selects its dedicated cue without changing damage or replay state', () => {
  const engine = new CombatEngine({ fighters: FIGHTERS.slice(0, 2), stage: STAGES[0], mode: 'local', cpu: [false, false], skipIntro: true, roundsToWin: 1, seed: 7452 });
  engine.state.a.x = 500; engine.state.b.x = 560;
  engine.drainEvents(); let heard = null;
  for (let frame = 0; frame < 10; frame++) {
    engine.step(FIXED_DT, frame === 0 ? [{ slot: 'throw' }, { tech: true }] : [{}, {}]);
    const events = engine.drainEvents();
    if (!events.some(event => event.type === 'throwTech')) continue;
    const before = engine.getSnapshot();
    heard = selectCombatCue(events, engine.state);
    assert.deepEqual(engine.getSnapshot(), before);
  }
  assert.equal(heard, 'throwTech');
  assert.ok(AUDIO_EFFECT_IDS.includes(heard), 'The selected escape must have its own available motif');
  assert.equal(engine.state.metrics.throwTech, 1);
  assert.equal(engine.state.a.hp, 10000); assert.equal(engine.state.b.hp, 10000);
});

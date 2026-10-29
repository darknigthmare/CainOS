import test from 'node:test';
import assert from 'node:assert/strict';
import * as session from '../combat/session.mjs';
import { createProgram, recordProgramResult } from '../combat/progression.mjs';

const BACKUP_KEY = `${session.SAVE_KEY}.backup`;
function fixture() {
  const profile = session.emptyProfile();
  profile.stats = { matches: 17, wins: 10, losses: 7, damage: 45003, bestSurvival: 4 };
  profile.challenges = ['combo', 'super'];
  profile.medals = ['arcade', 'story'];
  profile.stories = ['jax'];
  profile.history = [{ fighter: 'jax', opponent: 'caine', mode: 'story', won: true, at: '2026-10-29T10:00:00.000Z' }];
  profile.settings.sound = false;
  profile.settings.bindings[0].light = ['KeyC'];
  profile.program = recordProgramResult(createProgram('survival', 'jax', undefined, undefined, { seed: 43 }), { won: true, health: 4321 });
  return profile;
}
function storageFixture(entries = []) {
  const records = new Map(entries), writes = [];
  return {
    records, writes,
    getItem: key => records.get(key) ?? null,
    setItem(key, value) { writes.push(['set', key]); records.set(key, value); },
    removeItem(key) { writes.push(['remove', key]); records.delete(key); },
  };
}

// Existing achievements are fixture data, not claimed gameplay-earned rewards.
test('the first successful save and later saves each provide a complete recoverable copy', () => {
  const storage = storageFixture(), first = fixture();
  assert.equal(session.saveProfile(storage, first), true);
  storage.records.set(session.SAVE_KEY, '{truncated');
  assert.deepEqual(session.readProfile(storage), first, 'the first completed save must survive a damaged primary');
  const next = structuredClone(first);
  next.challenges.push('throw');
  next.settings.music = true;
  assert.equal(session.saveProfile(storage, next), true);
  storage.records.set(session.SAVE_KEY, '{truncated again');
  assert.deepEqual(session.readProfile(storage), next, 'the fallback follows later successful saves');
});

test('a valid primary wins and profile reads never rewrite either stored copy', () => {
  const primary = fixture(), older = session.emptyProfile();
  const storage = storageFixture([
    [session.SAVE_KEY, JSON.stringify(primary)], [BACKUP_KEY, JSON.stringify(older)],
  ]);
  assert.deepEqual(session.readProfile(storage), primary);
  assert.equal(session.readProfileState(storage).source, 'primary');
  storage.records.set(session.SAVE_KEY, '{truncated');
  const before = new Map(storage.records);
  assert.deepEqual(session.readProfileState(storage), { profile: older, source: 'backup' });
  assert.deepEqual(storage.records, before);
  assert.deepEqual(storage.writes, []);
});

test('an empty stored primary is corruption rather than deletion and cannot discard a valid backup on a failed repair', () => {
  const saved = fixture(), rawBackup = JSON.stringify(saved);
  for (const damaged of ['', '   ']) {
    const storage = storageFixture([[session.SAVE_KEY, damaged], [BACKUP_KEY, rawBackup]]);
    assert.deepEqual(session.readProfile(storage), saved);
    assert.deepEqual(session.readProfileState(storage), { profile: saved, source: 'backup' });
    const write = storage.setItem;
    storage.setItem = (key, value) => {
      if (key === session.SAVE_KEY) throw new Error('QuotaExceededError');
      write(key, value);
    };
    assert.equal(session.saveProfile(storage, saved), false);
    assert.equal(storage.getItem(session.SAVE_KEY), damaged);
    assert.equal(storage.getItem(BACKUP_KEY), rawBackup);
    assert.deepEqual(storage.writes, []);
  }
});

test('backup recovery drops only an obsolete checkpoint and an explicit save repairs both copies', () => {
  const original = fixture();
  original.program.index = 99;
  const expected = { ...original, program: null };
  const storage = storageFixture([
    [session.SAVE_KEY, '{truncated'], [BACKUP_KEY, JSON.stringify(original)],
  ]);
  const recovered = session.readProfile(storage);
  assert.deepEqual(recovered, expected);
  assert.equal(storage.getItem(session.SAVE_KEY), '{truncated', 'loading does not overwrite the damaged record');
  recovered.settings.reducedMotion = true;
  assert.equal(session.saveProfile(storage, recovered), true);
  assert.deepEqual(session.readProfileState(storage), { profile: recovered, source: 'primary' });
  assert.deepEqual(session.validateProfile(JSON.parse(storage.getItem(BACKUP_KEY))), recovered);
  assert.equal(storage.getItem(session.SAVE_KEY), storage.getItem(BACKUP_KEY));
  assert.equal(original.program.index, 99, 'the imported fixture is not mutated');
});

test('a failed primary write preserves the valid fallback and reports failure', () => {
  const saved = fixture(), next = structuredClone(saved);
  next.stats.matches++;
  const rawBackup = JSON.stringify(saved);
  const storage = storageFixture([[session.SAVE_KEY, '{truncated'], [BACKUP_KEY, rawBackup]]);
  const write = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === session.SAVE_KEY) throw new Error('QuotaExceededError');
    write(key, value);
  };
  assert.equal(session.saveProfile(storage, next), false);
  assert.equal(storage.getItem(BACKUP_KEY), rawBackup);
  assert.equal(storage.getItem(session.SAVE_KEY), '{truncated');
  assert.deepEqual(storage.writes, []);
  assert.deepEqual(session.readProfile(storage), saved);
});

test('a refused backup does not cancel a successfully persisted primary or destroy an older fallback', () => {
  const older = fixture(), next = structuredClone(older);
  next.stats.damage += 77;
  const rawBackup = JSON.stringify(older);
  const storage = storageFixture([[session.SAVE_KEY, rawBackup], [BACKUP_KEY, rawBackup]]);
  const write = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === BACKUP_KEY) throw new Error('QuotaExceededError');
    write(key, value);
  };
  assert.equal(session.saveProfile(storage, next), true);
  assert.deepEqual(session.readProfile(storage), next);
  assert.equal(storage.getItem(BACKUP_KEY), rawBackup);
  storage.records.set(session.SAVE_KEY, '{truncated');
  assert.deepEqual(session.readProfile(storage), older, 'an older known-valid backup remains usable');
});

test('quota that fits one copy still persists the first profile before attempting the backup', () => {
  const profile = fixture(), raw = JSON.stringify(session.validateProfile(profile));
  const capacity = raw.length + 16;
  const storage = storageFixture();
  const write = storage.setItem;
  storage.setItem = (key, value) => {
    const proposed = new Map(storage.records);
    proposed.set(key, value);
    const bytes = [...proposed.values()].reduce((total, item) => total + item.length, 0);
    if (bytes > capacity) throw new Error('QuotaExceededError');
    write(key, value);
  };
  assert.equal(session.saveProfile(storage, profile), true);
  assert.deepEqual(session.readProfile(storage), profile);
  assert.equal(storage.getItem(BACKUP_KEY), null, 'a duplicate is optional when the store only fits the primary');
});

test('invalid imports cannot change the primary, backup or their storage ordering', () => {
  const saved = fixture(), raw = JSON.stringify(saved);
  const storage = storageFixture([[session.SAVE_KEY, raw], [BACKUP_KEY, raw]]);
  for (const invalid of [
    { ...saved, version: 2 },
    { ...saved, format: 'another-game' },
    { ...saved, program: { ...saved.program, index: 99 } },
  ]) {
    assert.throws(() => session.saveProfile(storage, invalid));
    assert.deepEqual([...storage.records], [[session.SAVE_KEY, raw], [BACKUP_KEY, raw]]);
  }
  assert.deepEqual(storage.writes, []);
});

test('missing, invalid and inaccessible storage are distinguished without resurrecting an absent primary', () => {
  const saved = fixture(), raw = JSON.stringify(saved);
  const missing = storageFixture([[BACKUP_KEY, raw]]);
  assert.deepEqual(session.readProfileState(missing), { profile: session.emptyProfile(), source: 'empty' });
  assert.equal(missing.getItem(BACKUP_KEY), raw, 'reading alone does not discard an orphaned backup');
  for (const invalid of ['', '{broken', JSON.stringify({ ...saved, version: 2 })]) {
    const storage = storageFixture([[session.SAVE_KEY, invalid], [BACKUP_KEY, '{also broken']]);
    assert.deepEqual(session.readProfileState(storage), { profile: session.emptyProfile(), source: 'invalid' });
    assert.deepEqual(storage.writes, []);
  }
  const denied = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('SecurityError'); } };
  assert.deepEqual(session.readProfileState(denied), { profile: session.emptyProfile(), source: 'unavailable' });
  assert.equal(session.saveProfile(denied, saved), false);
});

test('a fresh profile after primary deletion cannot later resurrect an orphaned backup if backup writes are refused', () => {
  const old = fixture(), fresh = session.emptyProfile();
  const storage = storageFixture([[BACKUP_KEY, JSON.stringify(old)]]);
  const write = storage.setItem;
  storage.setItem = (key, value) => {
    if (key === BACKUP_KEY) throw new Error('QuotaExceededError');
    write(key, value);
  };
  assert.equal(session.saveProfile(storage, fresh), true);
  assert.equal(storage.getItem(BACKUP_KEY), null, 'the orphan must not remain eligible for a future recovery');
  assert.deepEqual(storage.writes, [['remove', BACKUP_KEY], ['set', session.SAVE_KEY]]);
  storage.records.set(session.SAVE_KEY, '{truncated');
  assert.deepEqual(session.readProfile(storage), fresh);
});

test('failure to discard an orphaned backup leaves the deleted primary absent and reports failure', () => {
  const saved = fixture(), raw = JSON.stringify(saved);
  const storage = storageFixture([[BACKUP_KEY, raw]]);
  storage.removeItem = () => { throw new Error('SecurityError'); };
  assert.equal(session.saveProfile(storage, session.emptyProfile()), false);
  assert.equal(storage.getItem(session.SAVE_KEY), null);
  assert.equal(storage.getItem(BACKUP_KEY), raw);
  assert.deepEqual(storage.writes, []);
});

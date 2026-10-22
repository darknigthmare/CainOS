import test from 'node:test';
import assert from 'node:assert/strict';
import { SPRITE_CATALOG } from '../combat/sprite-catalog.mjs';
import {
  FIGHTERS, ROSTER_ARCHIVE, VARIANTS, COSTUME_BASE_FIGHTERS,
  ARCHIVE_ONLY_ENTRIES, classifyArchiveEntry,
} from '../combat/data.mjs';

const byId = new Map(ROSTER_ARCHIVE.map(entry => [entry.id, entry]));
const fighters = new Set(FIGHTERS.map(fighter => fighter.id));

test('classification preserves all 179 source records and their historical provenance', () => {
  assert.equal(SPRITE_CATALOG.length, 179);
  assert.equal(byId.size, SPRITE_CATALOG.length);
  assert.deepEqual(ROSTER_ARCHIVE.map(entry => entry.id), SPRITE_CATALOG.map(entry => entry.id));
  for (const source of SPRITE_CATALOG) {
    const classified = byId.get(source.id);
    for (const [key, value] of Object.entries(source)) {
      if (key !== 'sprite') assert.deepEqual(classified[key], value, `${source.id}: preserve ${key}`);
    }
    for (const [key, value] of Object.entries(source.sprite)) assert.deepEqual(classified.sprite[key], value, `${source.id}: preserve sprite ${key}`);
  }
});

test('every current archive entry has exactly one reviewed classification with no stale declarations', () => {
  const variants = new Set(Object.keys(COSTUME_BASE_FIGHTERS));
  const archives = new Set(Object.keys(ARCHIVE_ONLY_ENTRIES));
  assert.equal(fighters.size, 14);
  assert.equal(variants.size, 51);
  assert.equal(archives.size, 114);
  const declarations = [...fighters, ...variants, ...archives];
  assert.equal(new Set(declarations).size, declarations.length, 'classification declarations must be disjoint');
  assert.deepEqual(new Set(declarations), new Set(byId.keys()), 'new content needs an explicit review, without removing archives');
  for (const entry of ROSTER_ARCHIVE) {
    assert.ok(['fighter', 'variant', 'archive'].includes(entry.category));
    assert.notEqual(entry.archiveKind, 'unreviewed', entry.id);
    assert.ok(entry.classificationReason.length > 30, `${entry.id}: decision must be explainable`);
    assert.equal(entry.playable, fighters.has(entry.id));
    assert.equal(entry.fighterId, entry.baseFighterId);
    assert.equal(entry.category === 'archive', entry.baseFighterId === null);
  }
});

test('every playable identity retains its own kit including the distinct Kaufmo abstraction', () => {
  for (const fighter of FIGHTERS) {
    const entry = byId.get(fighter.id);
    assert.equal(entry.category, 'fighter');
    assert.equal(entry.baseFighterId, fighter.id);
    assert.equal(entry.playable, true);
  }
  assert.equal(byId.get('kaufmo').baseFighterId, null, 'pre-abstraction archive is not the boss kit');
  assert.equal(byId.get('abstractedjax').baseFighterId, null, 'new morphology needs its own combat definition');
});

test('names shared with relatives, rivals, props and effects never grant a costume kit', () => {
  const rejected = [
    'jaxfather', 'jaxmother', 'ragathamothershadow', 'zoobleparts', 'plasticganglemask',
    'evilpomni', 'eviljax', 'evilragatha', 'evilkinger', 'evilzooble',
    'rivalbaseballzooble', 'rivalbaseballpomni', 'rivalbaseballragatha', 'rivalbaseballjax', 'rivalbaseballkinger',
    'jaxmindviolent', 'jaxmindcomic', 'jaxmindtrapped', 'whatifragatha', 'whatifgangle',
    'jumbledpomni', 'jumbledragatha',
  ];
  for (const id of rejected) {
    const entry = byId.get(id);
    assert.equal(entry.category, 'archive', id);
    assert.equal(entry.baseFighterId, null, id);
    assert.equal(entry.fighterId, null, id);
    assert.equal(entry.playable, false, id);
    assert.ok(!VARIANTS.some(variant => variant.id === id), `${id}: absent from all costume selectors`);
  }
  assert.equal(byId.get('plasticganglemask').archiveKind, 'prop');
  assert.equal(byId.get('jumbledpomni').archiveKind, 'effect');
  assert.equal(byId.get('jaxfather').archiveKind, 'other-person');
});

test('reviewed outfits and visual states reuse the same existing fighter without adding a kit', () => {
  for (const [id, parent] of [
    ['maidjax', 'jax'], ['workgangle', 'gangle'], ['baseballpomni', 'pomni'],
    ['spudsyragatha', 'ragatha'], ['flamingozooble', 'zooble'],
    ['possessedpomni', 'pomni'], ['inertbubble', 'bubble'],
    ['gloinkqueenscale', 'gloinkqueen'], ['shadowcaine', 'caine'],
  ]) {
    assert.equal(byId.get(id).baseFighterId, parent, id);
    assert.equal(byId.get(id).category, 'variant', id);
    assert.equal(byId.get(id).playable, false, id);
  }
  assert.equal(VARIANTS.length, 51);
  for (const variant of VARIANTS) {
    assert.ok(fighters.has(variant.baseFighterId), variant.id);
    assert.notEqual(variant.id, variant.baseFighterId);
    assert.ok(!fighters.has(variant.id), 'a costume must not inflate the playable roster');
    assert.equal(variant.category, 'variant');
  }
  assert.equal(byId.get('gloinkqueenscale').sprite.component, 'largest');
  assert.equal(byId.get('gloinkqueenscale').sprite.nativeFacing, -1);
});

test('future and prototype-like IDs fail closed even when they contain a fighter name', () => {
  for (const id of ['newpomni', 'jaxfatheruniform', 'jax', 'pomni', '__proto__', 'constructor', 'toString']) {
    if (fighters.has(id)) continue;
    const entry = classifyArchiveEntry(id);
    assert.equal(entry.category, 'archive', id);
    assert.equal(entry.archiveKind, 'unreviewed', id);
    assert.equal(entry.baseFighterId, null, id);
    assert.equal(entry.playable, false, id);
  }
});

test('every classified appearance still points at a bounded source atlas cell', () => {
  for (const entry of ROSTER_ARCHIVE) {
    const { cols, rows, col, row, src } = entry.sprite;
    assert.ok(Number.isInteger(cols) && cols > 0, entry.id);
    assert.ok(Number.isInteger(rows) && rows > 0, entry.id);
    assert.ok(Number.isInteger(col) && col >= 0 && col < cols, entry.id);
    assert.ok(Number.isInteger(row) && row >= 0 && row < rows, entry.id);
    assert.match(src, /^\.\.\/assets\//, entry.id);
  }
});

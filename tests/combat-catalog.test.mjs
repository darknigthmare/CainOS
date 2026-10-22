import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SPRITE_CATALOG } from '../combat/sprite-catalog.mjs';
import { COSTUME_SPRITE_OVERRIDES, getCostumeFidelity } from '../combat/costume-fidelity.mjs';
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

test('the 51 stable costume IDs and fighter bindings remain exact for existing profiles and replays', () => {
  // Independently derived from the published 171f422 data.mjs (Encore 0.3.0).
  const digest = createHash('sha256').update(JSON.stringify(VARIANTS.map(v => [v.id, v.baseFighterId]))).digest('hex');
  assert.equal(digest, 'b738cfcfce663d6ce2d8c636b1c8fe1ab495e54d775ecc54ea14c2886c0f470d');
  for (const variant of VARIANTS) assert.equal(variant.fidelity, getCostumeFidelity(variant.id));
  for (const entry of ROSTER_ARCHIVE.filter(e => e.category !== 'variant')) assert.equal(entry.fidelity, undefined, 'costume reviews are not inherited by unrelated archive entries');
});

test('all seventeen corrected costume rectangles fit their actual PNG and preserve source grid metadata', () => {
  const crops = Object.entries(COSTUME_SPRITE_OVERRIDES).filter(([, override]) => override.sourceRect);
  assert.equal(crops.length, 17);
  const sizes = new Map();
  for (const [id, override] of crops) {
    const entry = byId.get(id);
    assert.equal(entry.category, 'variant', id);
    assert.equal(entry.sprite.sourceRect, override.sourceRect, id);
    if (!sizes.has(entry.sprite.src)) {
      const png = readFileSync(new URL(entry.sprite.src, new URL('../combat/data.mjs', import.meta.url)));
      assert.equal(png.subarray(1, 4).toString(), 'PNG');
      sizes.set(entry.sprite.src, [png.readUInt32BE(16), png.readUInt32BE(20)]);
    }
    const [width, height] = sizes.get(entry.sprite.src);
    const r = entry.sprite.sourceRect;
    for (const value of Object.values(r)) assert.ok(Number.isInteger(value), id);
    assert.ok(r.x >= 0 && r.y >= 0 && r.width > 0 && r.height > 0, id);
    assert.ok(r.x + r.width <= width && r.y + r.height <= height, id);
    const source = SPRITE_CATALOG.find(e => e.id === id);
    for (const key of ['src', 'sheet', 'cols', 'rows', 'col', 'row']) assert.equal(entry.sprite[key], source.sprite[key], `${id}:${key}`);
  }
  assert.ok(byId.get('ganglecomedy').sprite.sourceRect.y + byId.get('ganglecomedy').sprite.sourceRect.height <= 640, 'Ragatha starts below this crop');
  assert.ok(byId.get('gangletragedy').sprite.sourceRect.y + byId.get('gangletragedy').sprite.sourceRect.height < 632, 'Kinger’s cross is outside this crop');
  assert.deepEqual(VARIANTS.filter(v => v.sprite.paletteSwap).map(v => v.id), ['gangletragedy']);
  assert.deepEqual(VARIANTS.filter(v => v.sprite.matteMode).map(v => [v.id, v.sprite.matteMode]), [
    ['shadowpomni', 'preserve-source'], ['shadowragatha', 'preserve-source'], ['shadowcaine', 'preserve-source'],
  ], 'only the three reviewed ambiguous Shadow cells bypass removal');
});

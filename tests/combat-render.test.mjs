import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS } from '../combat/data.mjs';
import { removeAtlasMatte, projectilePresentation, trapPresentation, PRESENTATION_FIGHTERS } from '../combat/render-presentation.mjs';

function cell(width, height, background) {
  const data = new Uint8ClampedArray(width * height * 4);
  const put = (x, y, color) => data.set(color, (y * width + x) * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) put(x, y, background);
  return { data, put, pixel: (x, y) => [...data.slice((y * width + x) * 4, (y * width + x) * 4 + 4)] };
}
const byId = id => FIGHTERS.find(fighter => fighter.id === id);

test('black atlas matte preserves a connected dark body and bright eyes (Kaufmo regression)', () => {
  const { data, put, pixel } = cell(15, 15, [0, 0, 0, 255]);
  for (let y = 3; y < 12; y++) for (let x = 4; x < 11; x++) put(x, y, [15, 7, 15, 255]);
  put(5, 5, [246, 248, 247, 255]); put(9, 8, [234, 239, 20, 255]);
  assert.equal(removeAtlasMatte(data, 15, 15), 225 - 63);
  assert.deepEqual(pixel(4, 3), [15, 7, 15, 255]);
  assert.deepEqual(pixel(5, 5), [246, 248, 247, 255]);
  assert.deepEqual(pixel(9, 8), [234, 239, 20, 255]);
  assert.equal(pixel(0, 7)[3], 0);
});

test('white atlas matte preserves black outlines and enclosed white mask detail', () => {
  const { data, put, pixel } = cell(9, 9, [255, 255, 255, 255]);
  for (let y = 2; y < 7; y++) for (let x = 2; x < 7; x++) put(x, y, [0, 0, 0, 255]);
  for (let y = 3; y < 6; y++) for (let x = 3; x < 6; x++) put(x, y, [255, 255, 255, 255]);
  put(4, 4, [15, 12, 18, 255]);
  assert.equal(removeAtlasMatte(data, 9, 9), 81 - 25);
  assert.deepEqual(pixel(2, 2), [0, 0, 0, 255]);
  assert.deepEqual(pixel(3, 3), [255, 255, 255, 255]);
  assert.equal(pixel(4, 4)[3], 255);
});

test('an enclosed matte-colour region is never mistaken for the connected background', () => {
  const { data, put, pixel } = cell(9, 9, [0, 0, 0, 255]);
  for (let y = 2; y < 7; y++) for (let x = 2; x < 7; x++) put(x, y, [180, 45, 75, 255]);
  put(4, 4, [0, 0, 0, 255]);
  removeAtlasMatte(data, 9, 9);
  assert.equal(pixel(0, 0)[3], 0);
  assert.deepEqual(pixel(4, 4), [0, 0, 0, 255]);
});

test('native transparency is authoritative, including semitransparent highlights', () => {
  const { data, put } = cell(8, 8, [0, 0, 0, 0]);
  put(2, 2, [0, 0, 0, 255]); put(3, 3, [255, 255, 255, 255]);
  put(4, 4, [245, 232, 254, 87]); put(7, 7, [245, 245, 245, 255]);
  const original = data.slice();
  assert.equal(removeAtlasMatte(data, 8, 8), 0);
  assert.deepEqual(data, original);
});

test('ambiguous opaque corners fail safely without deleting artwork', () => {
  const { data, put } = cell(5, 5, [80, 40, 90, 255]);
  put(0, 0, [255, 0, 0, 255]); put(4, 0, [0, 255, 0, 255]);
  put(0, 4, [0, 0, 255, 255]); put(4, 4, [255, 255, 0, 255]);
  const original = data.slice();
  assert.equal(removeAtlasMatte(data, 5, 5), 0);
  assert.deepEqual(data, original);
});

test('matte removal changes alpha only and tolerates modest opaque-atlas edge noise', () => {
  const { data, put } = cell(12, 12, [6, 6, 7, 255]);
  for (let x = 0; x < 12; x++) put(x, 1, [9, 7, 10, 255]);
  for (let y = 3; y < 9; y++) for (let x = 3; x < 9; x++) put(x, y, [34, 25, 42, 255]);
  const original = data.slice();
  assert.equal(removeAtlasMatte(data, 12, 12), 144 - 36);
  for (let i = 0; i < data.length; i++) if (i % 4 !== 3) assert.equal(data[i], original[i]);
});

test('invalid image buffers are rejected before mutation', () => {
  for (const [w, h, n] of [[0, 4, 0], [3, -1, 0], [2.5, 2, 20], [4, 4, 63]]) {
    const data = new Uint8ClampedArray(n);
    assert.throws(() => removeAtlasMatte(data, w, h), /Invalid atlas cell/);
  }
});

test('all fourteen existing fighter kits have a specific projectile presentation', () => {
  const before = JSON.stringify(FIGHTERS);
  assert.deepEqual(new Set(PRESENTATION_FIGHTERS), new Set(FIGHTERS.map(fighter => fighter.id)));
  for (const fighter of FIGHTERS) {
    for (const move of Object.values(fighter.moves).filter(move => move.kind === 'projectile')) {
      assert.notEqual(projectilePresentation({ def: move }, { f: fighter }), 'signal', `${fighter.id}: ${move.name}`);
    }
  }
  assert.equal(JSON.stringify(FIGHTERS), before, 'presentation never edits move data');
});

test('a reflected key keeps its original object despite a new owner and cloned move data', () => {
  const projectile = { owner: 1, def: { ...byId('jax').moves.special }, vx: -17, reflections: 1 };
  const before = JSON.stringify(projectile);
  assert.equal(projectilePresentation(projectile, { f: byId('kinger') }), 'key');
  assert.equal(projectilePresentation({ def: { ...byId('ragatha').moves.special } }, { f: byId('bubble') }), 'button');
  assert.equal(JSON.stringify(projectile), before);
});

test('similar tags retain distinct named objects instead of sharing a square or ball', () => {
  const motif = (id, slot = 'special') => projectilePresentation({ def: byId(id).moves[slot] }, { f: byId(id) });
  assert.notEqual(motif('zooble'), motif('gloinkqueen'), 'geometry module versus Gloink');
  assert.notEqual(motif('gummigoo'), motif('loolilalu'), 'wrapped candy versus sugar shard');
  assert.notEqual(motif('jax', 'super'), motif('bubble', 'super'), 'explosive surprise versus bubble');
  assert.equal(motif('bubble'), motif('bubble', 'super'));
  assert.notEqual(motif('pomni'), motif('caine'), 'juggling ball versus confetti');
});

test('named ground objects remain distinct and are independent of projectile styles', () => {
  const before = JSON.stringify(FIGHTERS);
  assert.equal(trapPresentation({ def: byId('gangle').moves.specialDown }, { f: byId('gangle') }), 'ribbon-knot');
  assert.equal(trapPresentation({ def: byId('fudge').moves.specialDown }, { f: byId('fudge') }), 'fudge-pool');
  assert.notEqual(trapPresentation({ def: byId('gummigoo').moves.specialDown }), trapPresentation({ def: byId('loolilalu').moves.specialDown }));
  assert.equal(JSON.stringify(FIGHTERS), before);
});

test('unknown future move names use a neutral fallback rather than an unrelated fighter object', () => {
  assert.equal(projectilePresentation({ def: { name: 'Unreviewed new attack', slot: 'special' } }, { f: byId('jax') }), 'signal');
  assert.equal(trapPresentation({ def: { name: 'Unreviewed new trap' } }, { f: byId('gangle') }), 'stage-mark');
});

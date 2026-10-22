import test from 'node:test';
import assert from 'node:assert/strict';
import { applySpritePalette, removeAtlasMatte } from '../combat/render-presentation.mjs';

function frame(width = 245, height = 285) {
  const data = new Uint8ClampedArray(width * height * 4);
  const put = (x, y, color) => data.set(color, (y * width + x) * 4);
  const pixel = (x, y) => [...data.slice((y * width + x) * 4, (y * width + x) * 4 + 4)];
  return { data, put, pixel, width, height };
}

test('Gangle ribbon correction preserves original shading while shifting only selected blue-violet pixels to red', () => {
  const f = frame();
  f.put(100, 190, [68, 72, 129, 255]);
  f.put(50, 120, [136, 143, 190, 255]);
  f.put(100, 200, [32, 34, 58, 255]);
  f.put(87, 110, [68, 72, 129, 255]);
  f.put(105, 125, [68, 72, 129, 255]);
  f.put(130, 141, [68, 72, 129, 255]);
  f.put(130, 220, [210, 205, 199, 255]);
  assert.equal(applySpritePalette(f.data, f.width, f.height, 'gangle-red-ribbons'), 6);
  assert.deepEqual(f.pixel(100, 190), [129, 68, 68, 255]);
  assert.deepEqual(f.pixel(50, 120), [190, 136, 136, 255]);
  assert.deepEqual(f.pixel(100, 200), [58, 32, 32, 255]);
  for (const [x, y] of [[87, 110], [105, 125], [130, 141]]) assert.deepEqual(f.pixel(x, y), [129, 68, 68, 255], 'ribbons beside the curved mask are included without a straight blue band');
  assert.deepEqual(f.pixel(130, 220), [210, 205, 199, 255], 'pale hand pixels stay unchanged');
});

test('the mask and tears stay exact even if a protected pixel shares the ribbon colour', () => {
  const f = frame();
  for (let y = 0; y < 147; y++) for (let x = 0; x < 245; x++) {
    const mask = ((x - 147) / 62) ** 2 + ((y - 75) / 65) ** 2 <= 1;
    const cheekHand = x >= 175 && x <= 212 && y <= 146;
    if (y < 97 || mask || cheekHand) f.put(x, y, [68, 72, 129, 255]);
  }
  f.put(10, 90, [68, 72, 129, 255]);
  f.put(100, 160, [37, 142, 210, 255]);
  f.put(100, 180, [237, 240, 252, 255]);
  const original = f.data.slice();
  assert.equal(applySpritePalette(f.data, f.width, f.height, 'gangle-red-ribbons'), 0);
  assert.deepEqual(f.data, original);
});

test('the explicit preserve-source mode retains every RGBA byte of an ambiguous opaque Shadow cell', () => {
  const f = frame(45, 31);
  for (let y = 0; y < f.height; y++) for (let x = 0; x < f.width; x++) {
    const dark = x < 5 || y < 5 || x > 39 || y > 25 || x > 16 && x < 28;
    f.put(x, y, dark ? [0, 0, 0, 255] : [x * 5, y * 7, (x + y) * 2, 255]);
  }
  const original = f.data.slice(), automatic = f.data.slice();
  assert.ok(removeAtlasMatte(automatic, f.width, f.height) > 0, 'the same black body connected to a black edge is ambiguous without the option');
  assert.equal(removeAtlasMatte(f.data, f.width, f.height, { mode: 'preserve-source', tolerance: 32 }), 0);
  assert.deepEqual(f.data, original, 'all source colours and alpha remain exact, including the opaque background');
  f.put(14, 17, [23, 42, 51, 73]);
  const nativeAlpha = f.data.slice();
  assert.equal(removeAtlasMatte(f.data, f.width, f.height, { mode: 'preserve-source' }), 0);
  assert.deepEqual(f.data, nativeAlpha, 'preservation also respects any original partial alpha');
});

test('palette correction preserves alpha, native transparent highlights and black detail after matte handling', () => {
  const f = frame();
  f.put(80, 200, [61, 66, 127, 255]);
  f.put(81, 200, [61, 66, 127, 91]);
  f.put(82, 200, [61, 66, 127, 0]);
  f.put(83, 200, [0, 0, 0, 255]);
  f.put(84, 200, [15, 7, 15, 255]);
  const original = f.data.slice();
  assert.equal(removeAtlasMatte(f.data, f.width, f.height), 0, 'native alpha remains authoritative');
  assert.equal(applySpritePalette(f.data, f.width, f.height, 'gangle-red-ribbons'), 2);
  for (let p = 3; p < f.data.length; p += 4) assert.equal(f.data[p], original[p]);
  assert.deepEqual(f.pixel(82, 200), [61, 66, 127, 0]);
  assert.deepEqual(f.pixel(83, 200), [0, 0, 0, 255]);
  assert.deepEqual(f.pixel(84, 200), [15, 7, 15, 255]);
});

test('palette correction requires its explicit option and the reviewed absolute crop dimensions', () => {
  for (const option of [undefined, null, 'unreviewed', '__proto__']) {
    const f = frame(); f.put(100, 200, [68, 72, 129, 255]);
    const before = f.data.slice();
    assert.equal(applySpritePalette(f.data, f.width, f.height, option), 0);
    assert.deepEqual(f.data, before);
  }
  const wrongCrop = frame(244, 285); wrongCrop.put(100, 200, [68, 72, 129, 255]);
  const before = wrongCrop.data.slice();
  assert.equal(applySpritePalette(wrongCrop.data, wrongCrop.width, wrongCrop.height, 'gangle-red-ribbons'), 0);
  assert.deepEqual(wrongCrop.data, before);
  assert.throws(() => applySpritePalette(new Uint8ClampedArray(10), 245, 285, 'gangle-red-ribbons'), /Invalid palette frame/);
});

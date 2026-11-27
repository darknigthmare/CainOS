import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS } from '../combat/data.mjs';
import { EXPANSION_IDS } from '../combat/roster-expansion.mjs';
import { ABSTRACTION_IDS } from '../combat/abstractions-content.mjs';
import { CombatRenderer } from '../combat/render.mjs';
import { PROJECTILE_ART, NPC_PROJECTILE_ART, ABSTRACTION_PROJECTILE_ART, PROJECTILE_ART_LIMITS,
  ProjectileArtLoader, projectileArtSpec } from '../combat/projectile-art.mjs';
const fighter = id => FIGHTERS.find(item => item.id === id);
const shot = (id, slot = 'special') => ({
  owner: 0, x: 440, y: 420, vx: 15, vy: 0, delay: 0, dead: false,
  def: { ...fighter(id).moves[slot] },
});
function cacheFixture({ publishedFiles = Object.values(PROJECTILE_ART).map(item => item.src), gate = null } = {}) {
  const requests = [], denied = new Set();
  let now = 0, active = 0, peak = 0, empty = false;
  const surfaceFactory = () => {
    const canvas = { width: 0, height: 0 };
    const context = {
      drawImage(image) { canvas.source = image.src; },
      getImageData(_x, _y, width, height) {
        const data = new Uint8ClampedArray(width * height * 4);
        if (!empty) for (let y = 4; y < height - 4; y++) for (let x = 8; x < width - 8; x++) data.set([190, 70, 150, 255], (y * width + x) * 4);
        return { data };
      },
    };
    canvas.getContext = () => context; return canvas;
  };
  const loader = new ProjectileArtLoader({
    publishedFiles, surfaceFactory, now: () => now,
    imageFactory: () => ({
      naturalWidth: 1024, naturalHeight: 512, src: '',
      async decode() {
        requests.push(this.src); active++; peak = Math.max(peak, active);
        try { if (gate) await gate(); if (denied.has(new URL(this.src).pathname)) throw new Error('Unavailable image'); }
        finally { active--; }
      },
      removeAttribute() {},
    }),
  });
  return { loader, requests, denied, clock: value => { now = value; },
    empty: value => { empty = value; }, active: () => active, peak: () => peak };
}
test('each existing projectile move has a named visual and NPC choices retain their documented scope', () => {
  const before = JSON.stringify(FIGHTERS);
  assert.deepEqual(new Set(Object.keys(NPC_PROJECTILE_ART)), new Set(EXPANSION_IDS));
  assert.ok(new Set(Object.values(NPC_PROJECTILE_ART).map(item => item.motif)).size >= 8);
  for (const [id, definition] of Object.entries(NPC_PROJECTILE_ART)) {
    assert.ok(definition.reason.length > 20, id); assert.ok(PROJECTILE_ART[definition.motif]);
  }
  for (const owner of FIGHTERS) for (const move of Object.values(owner.moves)) {
    if (move.kind !== 'projectile') continue;
    const spec = projectileArtSpec({ def: move }, { f: owner });
    assert.ok(spec, owner.id + ': ' + move.name); assert.ok(Object.isFrozen(spec));
  }
  assert.equal(JSON.stringify(FIGHTERS), before);
});
test('reflection keeps the original accessory for core and promoted NPC attacks', () => {
  const key = { ...shot('jax'), owner: 1, vx: -15, reflections: 1 };
  const npcShot = { ...shot('marthamildenhall'), owner: 1, vx: -15, reflections: 1 };
  const before = JSON.stringify([key, npcShot]);
  assert.equal(projectileArtSpec(key, { f: fighter('kinger') }).id, 'key');
  assert.equal(projectileArtSpec(npcShot, { f: fighter('kaufmo') }).id, 'spectral-shot');
  assert.equal(projectileArtSpec(shot('jax', 'super'), { f: fighter('bubble') }).id, 'trick-box');
  assert.equal(JSON.stringify([key, npcShot]), before);
  assert.equal(projectileArtSpec({ def: { name: 'Unknown future attack', slot: 'special' } }, { f: fighter('jax') }), null);
});
test('thirteen abstraction projectile slots retain ten distinct original motifs after reflection', () => {
  const before = JSON.stringify(FIGHTERS);
  assert.deepEqual(new Set(Object.keys(ABSTRACTION_PROJECTILE_ART)), new Set(ABSTRACTION_IDS));
  assert.equal(new Set(Object.values(ABSTRACTION_PROJECTILE_ART).map(item => item.motif)).size, 10);
  let count = 0;
  for (const id of ABSTRACTION_IDS) {
    const owner = fighter(id); assert.ok(owner, id);
    const choice = ABSTRACTION_PROJECTILE_ART[id];
    assert.equal(choice.sourceKind, 'original-encore-projectile');
    assert.ok(choice.reason.length > 40); assert.ok(Object.isFrozen(choice));
    const projectiles = Object.values(owner.moves).filter(move => move.kind === 'projectile');
    assert.ok(projectiles.length > 0);
    for (const move of projectiles) {
      count++;
      const source = projectileArtSpec({ owner: 0, def: move }, { f: owner });
      assert.equal(source.id, choice.motif, id + '/' + move.slot);
      assert.equal(source.motion, 'fixed');
      assert.equal(projectileArtSpec({ owner: 1, vx: -15, reflections: 1, def: { ...move } }, { f: fighter('jax') }), source);
      assert.equal(projectileArtSpec({ slot: move.slot }, { f: owner }), source);
    }
  }
  assert.equal(count, 13);
  assert.equal(projectileArtSpec(shot('abstractedkaufmo'), { f: fighter('jax') }).id, 'corruption');
  assert.equal(projectileArtSpec({ def: { name: 'Unknown abstraction attack', slot: 'special' } }, { f: fighter('originalabstractedpomni') }), null);
  assert.equal(JSON.stringify(FIGHTERS), before);
});
test('an abstraction preloads its one published motif for both existing projectile slots', async () => {
  const spec = PROJECTILE_ART['abstraction-aquatic-foam'];
  const { loader, requests } = cacheFixture({ publishedFiles: [spec.src] });
  await loader.preload([fighter('aquaticabstraction'), fighter('abstractedjax')]);
  assert.equal(requests.length, 1); assert.ok(requests[0].endsWith('/abstraction-aquatic-foam.png'));
  assert.ok(loader.peek(spec));
});
test('preloading requests only published accessories used by the current pair', async () => {
  const { loader, requests } = cacheFixture({ publishedFiles: [PROJECTILE_ART.juggle.src] });
  await loader.preload([fighter('pomni'), fighter('jax')]);
  assert.equal(requests.length, 1); assert.ok(requests[0].endsWith('/juggle.png'));
  assert.equal(loader.peek(PROJECTILE_ART.key), null); assert.equal(loader.load(PROJECTILE_ART.key), null);
  await loader.preload([fighter('pomni')]); assert.equal(requests.length, 1);
});
test('concurrent requests are deduplicated and image decoding stays within two slots', async () => {
  const release = [];
  const fixture = cacheFixture({ gate: () => new Promise(resolve => release.push(resolve)) });
  const first = fixture.loader.load(PROJECTILE_ART.key);
  assert.equal(fixture.loader.load(PROJECTILE_ART.key), first);
  const second = fixture.loader.load(PROJECTILE_ART.bubble), third = fixture.loader.load(PROJECTILE_ART.candy);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(fixture.active(), 2); assert.equal(fixture.requests.length, 2);
  release.shift()(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(fixture.requests.length, 3); assert.equal(fixture.active(), 2);
  for (const resolve of release.splice(0)) resolve();
  await Promise.all([first, second, third]); assert.equal(fixture.peak(), PROJECTILE_ART_LIMITS.decoders);
});
test('decoded canvases stay small and least-recently-used textures are evicted', async () => {
  const { loader, requests } = cacheFixture();
  const specs = Object.values(PROJECTILE_ART).slice(0, PROJECTILE_ART_LIMITS.cached + 1);
  for (const spec of specs.slice(0, -1)) await loader.load(spec);
  const retained = loader.peek(specs[0]);
  assert.ok(retained.canvas.width <= PROJECTILE_ART_LIMITS.edge); assert.ok(retained.canvas.height <= PROJECTILE_ART_LIMITS.edge);
  assert.deepEqual(retained.bounds, { x: 8, y: 4, width: 112, height: 56 });
  await loader.load(specs.at(-1)); assert.ok(loader.peek(specs[0])); assert.equal(loader.peek(specs[1]), null);
  const count = requests.length; await loader.load(specs[1]);
  assert.equal(requests.length, count + 1); assert.equal(loader.frames.size, PROJECTILE_ART_LIMITS.cached);
});
test('a failed optional image keeps fallback active and retries after a bounded cooldown', async () => {
  const { loader, denied, requests, clock } = cacheFixture(), spec = PROJECTILE_ART.corruption;
  denied.add(new URL(spec.src, new URL('../combat/projectile-art.mjs', import.meta.url)).pathname);
  assert.equal(await loader.load(spec), null);
  for (let frame = 0; frame < 120; frame++) assert.equal(loader.load(spec), null);
  assert.equal(requests.length, 1);
  denied.clear(); clock(PROJECTILE_ART_LIMITS.retryMs);
  assert.ok(await loader.load(spec)); assert.equal(requests.length, 2);
});
test('an empty transparent image is rejected instead of replacing a visible fallback', async () => {
  const { loader, empty } = cacheFixture(); empty(true);
  assert.equal(await loader.load(PROJECTILE_ART.confetti), null); assert.equal(loader.peek(PROJECTILE_ART.confetti), null);
});
test('an image decode that never settles cannot block match preparation indefinitely', async () => {
  let released = false;
  const loader = new ProjectileArtLoader({
    publishedFiles: [PROJECTILE_ART.key.src], decodeTimeoutMs: 10,
    imageFactory: () => ({ decode: () => new Promise(() => {}), removeAttribute() { released = true; } }),
  });
  await loader.preload([fighter('jax')]);
  assert.equal(loader.peek(PROJECTILE_ART.key), null); assert.equal(released, true); assert.equal(loader.pending.size, 0);
});
function rendererFixture(loader) {
  const draws = [], rotations = [], operations = [], target = { width: 1280, height: 720 };
  const context = new Proxy({
    drawImage(...args) { draws.push(args); }, rotate(angle) { rotations.push(angle); },
  }, { get(object, property) { return property in object ? object[property] : (...args) => operations.push([property, ...args]); } });
  target.getContext = () => context;
  const renderer = new CombatRenderer(target); renderer.projectileArt = loader;
  return { renderer, draws, rotations, operations };
}
test('the real renderer draws native art with uniform scale and respects reduced motion', async () => {
  const { loader } = cacheFixture(), art = await loader.load(PROJECTILE_ART.key);
  const { renderer, draws, rotations } = rendererFixture(loader);
  const projectile = { ...shot('jax'), owner: 1, vx: -15, reflections: 1 }, owners = [{ f: fighter('jax') }, { f: fighter('kinger') }];
  const before = JSON.stringify([projectile, owners]);
  renderer.drawProjectile(projectile, owners, 20, true);
  assert.equal(draws.length, 1); assert.equal(draws[0][0], art.canvas);
  const [, , , sw, sh, x, y, width, height] = draws[0];
  assert.equal(width / sw, height / sh); assert.equal(x, -width / 2); assert.equal(y, -height / 2);
  assert.ok(rotations.every(angle => angle === 0));
  renderer.drawProjectile(projectile, owners, 20, false); assert.ok(rotations.some(angle => angle !== 0));
  assert.equal(JSON.stringify([projectile, owners]), before);
});
test('native accessories follow left and reflected velocity while velocity art rotates only once', async () => {
  const { loader } = cacheFixture(), owners = [{ f: fighter('jax') }, { f: fighter('kinger') }];
  for (const [id, slot] of [['jax', 'special'], ['caine', 'special'], ['jax', 'super']]) {
    const original = shot(id, slot); await loader.load(projectileArtSpec(original, { f: fighter(id) }));
    for (const reflected of [false, true]) {
      const projectile = { ...original, vx: -15, owner: reflected ? 1 : 0, reflections: reflected ? 1 : 0 };
      const { renderer, draws, operations, rotations } = rendererFixture(loader);
      renderer.drawProjectile(projectile, owners, 20, true);
      assert.equal(draws.length, 1);
      assert.deepEqual(operations.filter(([name]) => name === 'scale'), [['scale', -1, 1]]);
      assert.ok(rotations.every(angle => angle === 0));
    }
    const forward = rendererFixture(loader); forward.renderer.drawProjectile(original, owners, 20, true);
    assert.equal(forward.operations.some(([name]) => name === 'scale'), false);
  }
  const velocity = shot('kinger'); await loader.load(projectileArtSpec(velocity, { f: fighter('kinger') }));
  const { renderer, operations, rotations } = rendererFixture(loader);
  renderer.drawProjectile({ ...velocity, vx: -15 }, owners, 20, true);
  assert.equal(operations.some(([name]) => name === 'scale'), false); assert.deepEqual(rotations, [Math.PI]);
});
test('the real renderer keeps visible Canvas fallback and ignores delayed or dead projectiles', () => {
  const { loader } = cacheFixture({ publishedFiles: [] }), { renderer, draws, operations } = rendererFixture(loader);
  const owners = [{ f: fighter('kaufmo') }], projectile = shot('kaufmo');
  renderer.drawProjectile(projectile, owners, 5, false);
  assert.equal(draws.length, 0); assert.ok(operations.some(([name]) => name === 'fill'));
  const count = operations.length;
  renderer.drawProjectile({ ...projectile, delay: 4 }, owners, 5, false);
  renderer.drawProjectile({ ...projectile, dead: true }, owners, 5, false);
  assert.equal(operations.length, count);
});


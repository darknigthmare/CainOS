import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ABSTRACTION_APPEARANCE_IDS, ABSTRACTION_ART_SLOTS, ABSTRACTION_CALM_ID, abstractionSprite } from '../combat/abstractions-content.mjs';

test('all eleven abstraction families resolve their 121 declared PNG slots without normal-form aliasing', async t => {
  const files = ABSTRACTION_APPEARANCE_IDS.flatMap(id => ABSTRACTION_ART_SLOTS.map(slot => '../assets/encore/abstractions/' + id + '/' + slot + '.png'));
  const { art, requests } = await isolatedIllustrations(t, files);
  assert.equal(files.length, 121);
  const allCanvases = new Set();
  for (const id of ABSTRACTION_APPEARANCE_IDS) {
    const fighter = { id: id === ABSTRACTION_CALM_ID ? 'abstractedqueenie' : id, ...(id === ABSTRACTION_CALM_ID ? { costume: id } : {}), sprite: abstractionSprite(id) };
    const poses = new Map();
    for (const slot of ABSTRACTION_ART_SLOTS) {
      const kind = ['selection', 'stance'].includes(slot) ? slot : 'poses';
      const frame = await art.loadFighterIllustration(kind, fighter, kind === 'poses' ? slot : undefined);
      assert.ok(frame?.canvas, id + ':' + slot);
      assert.ok(requests.at(-1).endsWith('/abstractions/' + id + '/' + slot + '.png'));
      assert.equal(frame.nativeFacing, 1);
      assert.deepEqual(frame.bounds, { x: 10, y: 20, width: frame.width - 20, height: frame.height - 40 });
      allCanvases.add(frame.canvas); poses.set(slot, frame);
    }
    assert.notEqual(poses.get('heavy'), poses.get('attack'), id + ': own heavy drawing');
    assert.equal(art.actionIllustration(fighter, 'heavy'), poses.get('heavy'));
  }
  assert.equal(allCanvases.size, 121, 'each state and appearance has its own decoded canvas');
});


async function isolatedIllustrations(t, files) {
  const folder = await mkdtemp(path.join(tmpdir(), 'encore-illustration-formats-'));
  const previous = { Image: globalThis.Image, document: globalThis.document };
  const requests = [];
  t.after(async () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
    await rm(folder, { recursive: true, force: true });
  });
  await writeFile(path.join(folder, 'offline-manifest.mjs'), 'export const ART_FILES = ' + JSON.stringify(files) + ';');
  for (const file of ['illustrations.mjs', 'costume-resumption-20261120.mjs']) {
    await writeFile(path.join(folder, file), await readFile(new URL('../combat/' + file, import.meta.url)));
  }
  globalThis.Image = class {
    naturalWidth = 320;
    naturalHeight = 480;
    async decode() { requests.push(this.src); }
    removeAttribute() {}
  };
  globalThis.document = { createElement() { return { getContext() { return {
    drawImage() {},
    getImageData(_x, _y, width, height) {
      const data = new Uint8ClampedArray(width * height * 4);
      for (let y = 20; y < height - 20; y++) for (let x = 10; x < width - 10; x++) data[(y * width + x) * 4 + 3] = 255;
      return { data };
    },
  }; } }; } };
  const art = await import(pathToFileURL(path.join(folder, 'illustrations.mjs')).href);
  return { art, requests };
}

test('the image loader uses published PNGs and retains WebP precedence and heavy fallbacks', async t => {
  const cross = '../assets/encore/crossovers/murderdrones/jax/fusion';
  const fallback = '../assets/encore/crossovers/murderdrones/pomni/fusion';
  const { art, requests } = await isolatedIllustrations(t, [
    '../assets/encore/selection/queenie.png', '../assets/encore/stance/queenie.png',
    '../assets/encore/selection/bestchildren-a.png', '../assets/encore/selection/bestchildren-a.webp',
    '../assets/encore/selection/bestchildren-b.png',
    ...['mildenhallsouls', 'mildenhallsouls-b', 'mildenhallsouls-c',
      'laughingshadows', 'laughingshadows-b', 'laughingshadows-c']
      .map(id => `../assets/encore/selection/${id}.png`),
    '../assets/encore/stance/pomni.webp', '../assets/encore/stance/pomni.png',
    '../assets/encore/poses/queenie/intro.png',
    '../assets/encore/campaign/queenie/queenie-prologue-1.png',
    cross + '/heavy.png', cross + '/attack.webp', fallback + '/attack.webp',
  ]);

  const children = art.archiveSelectionParts('bestchildren');
  assert.deepEqual(children.map(part => [part.id, part.label]), [
    ['bestchildren-a', 'Enfant Best A'], ['bestchildren-b', 'Enfant Best B'],
  ]);
  assert.ok(children[0].src.endsWith('/bestchildren-a.webp'));
  assert.ok(children[1].src.endsWith('/bestchildren-b.png'));
  assert.equal(new Set(children.map(part => part.src)).size, 2, 'each child keeps a separate image');
  for (const id of ['mildenhallsouls', 'laughingshadows']) {
    const parts = art.archiveSelectionParts(id);
    assert.deepEqual(parts.map(part => part.id), [id, id + '-b', id + '-c']);
    assert.equal(new Set(parts.map(part => part.src)).size, 3, 'each silhouette keeps its own image');
  }
  assert.deepEqual(art.archiveSelectionParts('not-published'), []);

  for (const [kind, pose] of [['selection'], ['stance'], ['poses', 'intro']]) {
    const frame = await art.loadFighterIllustration(kind, { id: 'queenie' }, pose);
    assert.ok(frame?.canvas);
    assert.deepEqual(frame.bounds, { x: 10, y: 20, width: frame.width - 20, height: frame.height - 40 }, 'transparent margins must not determine the fighter size or foot anchor');
    assert.ok(requests.at(-1).endsWith('.png'));
  }
  assert.ok(art.campaignIllustration('queenie', 'queenie-prologue-1').endsWith('.png'));
  assert.equal(art.campaignIllustration('queenie', 'not-published'), null);
  await art.loadFighterIllustration('stance', { id: 'pomni' });
  assert.ok(requests.at(-1).endsWith('/pomni.webp'));
  const requestCount = requests.length;
  assert.equal(art.loadFighterIllustration('stance', { id: 'not-published' }), null);
  assert.equal(requests.length, requestCount);

  const jax = { id: 'jax', costume: 'jax-drone', sprite: { crossoverDirectory: cross } };
  await art.loadFighterIllustration('poses', jax, 'attack');
  const heavy = await art.loadFighterIllustration('poses', jax, 'heavy');
  assert.ok(requests.at(-1).endsWith('/heavy.png'));
  assert.equal(art.actionIllustration(jax, 'heavy'), heavy, 'the recovered PNG must replace the generic attack');
  const pomni = { id: 'pomni', costume: 'pomni-drone', sprite: { crossoverDirectory: fallback } };
  const attack = await art.loadFighterIllustration('poses', pomni, 'attack');
  assert.equal(art.actionIllustration(pomni, 'heavy'), attack, 'unillustrated heavy retains the existing attack fallback');
});

test('mixed-direction Abstracting Gangle frames keep their own facing through decoding, caching and appearance changes', async t => {
  // These expected directions come from the reviewed drawings, independently
  // of the runtime lookup: the stance cannot supply a family-wide direction.
  const directions = {
    selection: -1, stance: -1, intro: 1, attack: -1, heavy: 1, hit: -1,
    walk: -1, jump: -1, crouch: -1, victory: -1, defeat: -1,
  };
  const appearanceId = 'abstractinggangle';
  const fileFor = (id, slot) => ['selection', 'stance'].includes(slot)
    ? `../assets/encore/${slot}/${id}.png` : `../assets/encore/poses/${id}/${slot}.png`;
  const { art, requests } = await isolatedIllustrations(t, [
    ...Object.keys(directions).map(slot => fileFor(appearanceId, slot)),
    fileFor('gangle', 'attack'), fileFor('smilingtragedygangle', 'attack'),
  ]);
  const fighter = { id: 'gangle', costume: appearanceId, sprite: { nativeFacing: -1 } };
  const actorFrames = new Map();
  // Exercise simultaneous left/right requests; the decoder and cache must not
  // reuse a direction from the previous pose or the base fighter identity.
  await Promise.all(Object.entries(directions).map(async ([slot, facing]) => {
    const kind = ['selection', 'stance'].includes(slot) ? slot : 'poses';
    const pose = kind === 'poses' ? slot : undefined;
    const first = art.loadFighterIllustration(kind, fighter, pose);
    assert.equal(art.loadFighterIllustration(kind, fighter, pose), first, slot + ': deduplicate pending decoding');
    const frame = await first;
    assert.equal(frame.nativeFacing, facing, slot + ': direction of the actual drawing');
    assert.deepEqual(frame.bounds, { x: 10, y: 20, width: frame.width - 20, height: frame.height - 40 });
    actorFrames.set(slot, frame);
  }));
  assert.equal(requests.length, 11, 'one decode per distinct drawing');
  assert.equal(new Set([...actorFrames.values()].map(frame => frame.canvas)).size, 11, 'poses retain distinct textures');
  assert.equal(art.standingIllustration(fighter), actorFrames.get('stance'));
  for (const [slot, facing] of Object.entries(directions)) {
    const kind = ['selection', 'stance'].includes(slot) ? slot : 'poses';
    const frame = art.loadFighterIllustration(kind, { id: appearanceId }, kind === 'poses' ? slot : undefined);
    assert.equal(frame, actorFrames.get(slot), slot + ': archive and equipped costume share the exact cached frame');
    assert.equal(frame.nativeFacing, facing);
    if (kind === 'poses') assert.equal(art.actionIllustration(fighter, slot), frame);
  }
  assert.equal(requests.length, 11, 'cache reuse does not decode or rewrite orientation');
  const base = await art.loadFighterIllustration('poses', { id: 'gangle' }, 'attack');
  const other = await art.loadFighterIllustration('poses', { id: 'gangle', costume: 'smilingtragedygangle' }, 'attack');
  assert.equal(base.nativeFacing, 1, 'base fighter retains its historical right-facing default');
  assert.equal(other.nativeFacing, 1, 'Smiling Tragedy Gangle remains right-facing');
  assert.notEqual(base, actorFrames.get('attack'));
  assert.notEqual(other, actorFrames.get('attack'));
  assert.equal(art.actionIllustration(fighter, 'attack').nativeFacing, -1, 'other appearances cannot pollute the cached left-facing pose');
  assert.equal(art.actionIllustration(fighter, 'heavy').nativeFacing, 1, 'the same costume still retains its right-facing heavy');
});

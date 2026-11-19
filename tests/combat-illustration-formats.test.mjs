import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('the image loader uses published PNGs and retains WebP precedence and heavy fallbacks', async t => {
  const folder = await mkdtemp(path.join(tmpdir(), 'encore-illustration-formats-'));
  const previous = { Image: globalThis.Image, document: globalThis.document };
  const requests = [];
  t.after(async () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
    }
    await rm(folder, { recursive: true, force: true });
  });
  const cross = '../assets/encore/crossovers/murderdrones/jax/fusion';
  const fallback = '../assets/encore/crossovers/murderdrones/pomni/fusion';
  const files = [
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
  ];
  await writeFile(path.join(folder, 'offline-manifest.mjs'), 'export const ART_FILES = ' + JSON.stringify(files) + ';');
  await writeFile(path.join(folder, 'illustrations.mjs'), await readFile(new URL('../combat/illustrations.mjs', import.meta.url)));
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

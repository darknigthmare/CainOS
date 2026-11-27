import test from 'node:test';
import assert from 'node:assert/strict';
import { stageScenePlacement, loadStagePlanes } from '../combat/stage-parallax.mjs';
import { REBUILT_STAGE_SCENES } from '../combat/stage-scenes-20261127.mjs';
import { CombatRenderer } from '../combat/render.mjs';

const WIDTH = 1344, HEIGHT = 756, TOP = -28;

test('complete scenes cover the canvas uniformly and ground the undermap behind the fighters', () => {
  for (const [width, height] of [[1672, 941], [3840, 2160], [1600, 900]]) {
    for (const anchor of [undefined, REBUILT_STAGE_SCENES.undermap.groundAnchor]) {
      const p = stageScenePlacement(width, height, anchor);
      assert.ok(p.x <= 0 && p.y <= 0);
      assert.ok(p.x + p.width >= WIDTH - 1e-9 && p.y + p.height >= HEIGHT - 1e-9);
      assert.ok(Math.abs(p.width / width - p.height / height) < 1e-12, 'no nonuniform stretch');
      if (anchor) {
        const floor = p.y + anchor.sourceFraction * height * p.scale + TOP;
        assert.ok(Math.abs(floor - 520) < 1e-9);
        assert.ok(floor < 568, 'actors stand in front of the wall, on the continuous floor');
      }
    }
  }
  for (const [w, h] of [[0, 1], [1, 0], [Infinity, 1], [1, NaN]]) assert.throws(() => stageScenePlacement(w, h), RangeError);
  for (const anchor of [{sourceFraction: 0, targetY: 520}, {sourceFraction: 1, targetY: 520}, {sourceFraction: .5, targetY: Infinity}]) {
    assert.throws(() => stageScenePlacement(1672, 941, anchor), RangeError);
  }
});

function mockedCanvas(t, delayedId) {
  const originals = { Image: globalThis.Image, document: globalThis.document };
  const requests = [];
  let release, notify;
  const started = new Promise(resolve => { notify = resolve; });
  let held = false;
  globalThis.Image = class {
    naturalWidth = 1672;
    naturalHeight = 941;
    async decode() {
      requests.push(String(this.src));
      if (!held && String(this.src).includes('/' + delayedId + '/')) {
        held = true;
        notify();
        await new Promise(resolve => { release = resolve; });
      }
    }
    removeAttribute() {}
  };
  globalThis.document = { createElement() { return { getContext() { return { drawImage() {} }; } }; } };
  t.after(() => { globalThis.Image = originals.Image; globalThis.document = originals.document; });
  return { requests, started, release: () => release?.() };
}

function previewRecorder() {
  const renderer = Object.create(CombatRenderer.prototype), draws = [];
  Object.assign(renderer, {
    canvas: { isConnected: true }, stageArt: new Map(), previewRequest: 0,
    render(_state, options) { draws.push(options.stage.id); },
    projectileArt: { preload: async () => {} },
  });
  return { renderer, draws };
}

test('a slow old arena cannot replace the most recently selected arena', { timeout: 5000 }, async t => {
  const mock = mockedCanvas(t, 'falseexit'), { renderer, draws } = previewRecorder();
  const first = renderer.previewStage({ id: 'falseexit' });
  await mock.started;
  const latest = renderer.previewStage({ id: 'kingdom' });
  mock.release();
  await Promise.all([first, latest]);
  assert.deepEqual(draws, ['falseexit', 'kingdom', 'kingdom']);
  assert.equal(renderer.stageArt.has('falseexit'), false);
  assert.equal(renderer.stageArt.get('kingdom').fullScene, true);
  assert.equal(renderer.stageArt.get('kingdom').layers.length, 1);
  assert.deepEqual(mock.requests.map(url => url.split('/stages/')[1]), [
    'falseexit/scene-20261127.png', 'kingdom/scene-20261127.png',
  ], 'only the complete new locations load, without old theatre layers');
});

test('starting a combat preload cancels a pending menu preview', { timeout: 5000 }, async t => {
  const mock = mockedCanvas(t, 'undermap'), { renderer, draws } = previewRecorder();
  const preview = renderer.previewStage({ id: 'undermap' });
  await mock.started;
  const result = await renderer.preload([]);
  assert.equal(result.ok, true);
  mock.release();
  await preview;
  assert.deepEqual(draws, ['undermap']);
  assert.equal(renderer.stageArt.has('undermap'), false);
});

test('an untouched arena still loads its original independent three planes', async t => {
  const mock = mockedCanvas(t, 'never-delayed');
  const result = await loadStagePlanes({ id: 'training' });
  assert.ok(result?.complete);
  assert.equal(result.fullScene, false);
  assert.equal(result.layers.length, 3);
  assert.deepEqual(mock.requests.map(url => url.split('/stages/')[1]), [
    'training/far.webp', 'training/mid.webp', 'training/near.webp',
  ]);
});

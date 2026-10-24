import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { FinisherGallery } from '../combat/finisher-gallery.mjs';

// The renderer is replaced only to observe the separate gallery clock. Pixel
// and artwork checks remain in the real Chromium gallery suite.
async function gallery() {
  const calls = [], notices = [];
  const view = new FinisherGallery({
    canvas: { getContext: () => ({}) }, fighters: FIGHTERS.slice(0, 2), stage: STAGES[0],
    definition: FINISHER_CATALOG.find(item => item.id === 'pomni.impact'),
    onChange: state => notices.push(state),
  });
  view.renderer = { preload: async () => ({ ok: true, errors: [] }), render: (state, options) => calls.push({ state, options }) };
  await view.prepare();
  return { view, calls, notices };
}

test('hidden gallery time never advances the first visible frame, including throttled tabs', async () => {
  const { view, calls } = await gallery();
  view.tick(0); view.tick(100);
  const before = view.snapshot, draws = calls.length;
  view.tick(200, { visible: false });
  view.tick(600000, { visible: false });
  assert.deepEqual(view.snapshot, before);
  assert.equal(calls.length, draws);
  view.tick(650000);
  assert.deepEqual(view.snapshot, before, 'A resume must not catch up hidden time');
  view.tick(650050);
  assert.equal(view.snapshot.frame, before.frame + 3);
  view.dispose();
});

test('changing reduced motion redraws even when the finished gallery frame is unchanged', async () => {
  const { view, calls, notices } = await gallery();
  view.tick(0, { reducedMotion: true });
  assert.equal(view.snapshot.done, true);
  assert.equal(calls.at(-1).options.reducedMotion, true);
  const before = view.snapshot, draws = calls.length;
  view.tick(100, { reducedMotion: false });
  assert.equal(calls.length, draws + 1);
  assert.equal(calls.at(-1).options.reducedMotion, false);
  assert.deepEqual(view.snapshot, before);
  view.tick(200, { reducedMotion: true });
  assert.equal(calls.length, draws + 2);
  assert.equal(notices.at(-1).reducedMotion, true);
  view.dispose();
});

test('a visibility event suspends the gallery clock before a browser stops animation callbacks', async () => {
  const { view } = await gallery();
  view.tick(0); view.tick(100);
  const before = view.snapshot;
  view.suspendClock();
  // No hidden tick: requestAnimationFrame has stopped immediately.
  view.tick(600000);
  assert.deepEqual(view.snapshot, before);
  view.tick(600050);
  assert.equal(view.snapshot.frame, before.frame + 3);
  view.dispose();
});

test('pause, replay and disposal leave the separate gallery match state unchanged', async () => {
  const { view, calls } = await gallery(), initial = JSON.stringify(view.state);
  view.tick(0); view.tick(100); view.toggle();
  const frozen = view.snapshot;
  view.tick(900000);
  assert.deepEqual(view.snapshot, frozen);
  view.toggle(); view.tick(910000);
  assert.equal(view.snapshot.frame, frozen.frame);
  view.tick(910050); assert.equal(view.snapshot.frame, frozen.frame + 3);
  view.replay(); view.tick(920000);
  assert.equal(view.snapshot.frame, 0);
  assert.equal(view.snapshot.playing, true);
  view.dispose(); const draws = calls.length;
  view.tick(930000); view.toggle(); view.replay();
  assert.equal(calls.length, draws);
  assert.equal(view.snapshot.playing, false);
  assert.equal(JSON.stringify(view.state), initial);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SelectionPresentation, selectionPortraitStatus } from '../combat/selection-presentation.mjs';
import { FIGHTERS, COSTUMES } from '../combat/data.mjs';

const pomni = { fighterId: 'pomni', variantId: '' }, jax = { fighterId: 'jax', variantId: '' };
const create = () => new SelectionPresentation([pomni, jax]);

test('a menu choice is immediate, undoable once and isolated from the other side', () => {
  const view = create(), before = view.snapshot(1);
  assert.equal(view.choose(0, { fighterId: 'kaufmo' }), true);
  assert.deepEqual(view.snapshot(0).current, { fighterId: 'kaufmo', variantId: '' });
  assert.deepEqual(view.snapshot(1), before);
  assert.deepEqual(view.undo(0), pomni);
  assert.equal(view.undo(0), null);
  assert.deepEqual(view.snapshot(1), before);
});

test('reselecting an unchanged choice neither overwrites undo nor invalidates its portrait', () => {
  const view = create();
  view.choose(0, jax); const token = view.beginPortrait(0, jax);
  assert.equal(view.choose(0, jax), false);
  assert.equal(view.finishPortrait(0, token, true), true);
  assert.deepEqual(view.undo(0), pomni);
});

test('a mirror supports independent costumes and independent undo histories', () => {
  const view = create();
  const outfits = COSTUMES.filter(item => item.fighterId === 'pomni').slice(0, 2);
  assert.equal(outfits.length, 2);
  const first = { fighterId: 'pomni', variantId: outfits[0].id };
  const second = { fighterId: 'pomni', variantId: outfits[1].id };
  view.choose(0, first); view.choose(1, second);
  assert.deepEqual(view.snapshot(0).current, first);
  assert.deepEqual(view.snapshot(1).current, second);
  assert.deepEqual(view.undo(1), jax);
  assert.deepEqual(view.snapshot(0).current, first);
  assert.deepEqual(view.undo(0), pomni);
});

test('late and duplicate portrait completions cannot replace the latest choice status', () => {
  const view = create(), old = view.beginPortrait(0, pomni);
  view.choose(0, jax); const current = view.beginPortrait(0, jax);
  assert.equal(view.finishPortrait(0, old, false), false);
  assert.equal(view.snapshot(0).portrait, 'loading');
  assert.equal(view.finishPortrait(0, current, true), true);
  assert.equal(view.finishPortrait(0, old, false), false);
  assert.equal(view.finishPortrait(0, current, false), false);
  assert.equal(view.snapshot(0).portrait, 'ready');
});

test('a later draw of the same choice supersedes an older canvas while the other side stays active', () => {
  const view = create();
  const first = view.beginPortrait(0, pomni), other = view.beginPortrait(1, jax), second = view.beginPortrait(0, pomni);
  assert.equal(view.finishPortrait(0, first, false), false);
  assert.equal(view.finishPortrait(1, other, true), true);
  assert.equal(view.finishPortrait(0, second, true), true);
});

test('portrait failure preserves the choice and a fresh request can recover it', () => {
  const view = create();
  assert.equal(view.beginPortrait(0, jax), null);
  const failed = view.beginPortrait(0, pomni);
  assert.equal(view.finishPortrait(0, failed, false), true);
  assert.equal(view.snapshot(0).portrait, 'unavailable');
  assert.deepEqual(view.snapshot(0).current, pomni);
  assert.match(selectionPortraitStatus(view.snapshot(0).portrait), /Choix conservé/);
  const retry = view.beginPortrait(0, pomni);
  assert.equal(view.finishPortrait(0, retry, true), true);
  assert.equal(selectionPortraitStatus(view.snapshot(0).portrait), 'Choix retenu');
});

test('undo during a load invalidates the abandoned appearance and accepts its restored portrait', () => {
  const view = create(); view.choose(0, jax);
  const abandoned = view.beginPortrait(0, jax);
  assert.deepEqual(view.undo(0), pomni);
  const restored = view.beginPortrait(0, pomni);
  assert.equal(view.finishPortrait(0, abandoned, true), false);
  assert.equal(view.finishPortrait(0, restored, true), true);
});

test('navigation and match reset remove undo and invalidate all pending requests', () => {
  const view = create(); view.choose(0, jax); view.choose(1, pomni);
  const a = view.beginPortrait(0, jax), b = view.beginPortrait(1, pomni);
  view.reset([pomni, jax]);
  assert.equal(view.undo(0), null); assert.equal(view.undo(1), null);
  assert.equal(view.finishPortrait(0, a, true), false);
  assert.equal(view.finishPortrait(1, b, true), false);
  const next = view.beginPortrait(0, pomni);
  assert.ok(next > a && next > b);
});

test('external choices clear only affected history while stage-only refreshes preserve it', () => {
  const view = create(); view.choose(0, jax); view.choose(1, pomni);
  const before = view.snapshot(0);
  view.reconcile([jax, pomni]); assert.deepEqual(view.snapshot(0), before);
  view.reconcile([jax, { fighterId: 'max' }]);
  assert.deepEqual(view.snapshot(0), before); assert.equal(view.undo(1), null);
});

test('snapshots and caller-owned choices cannot mutate menu history', () => {
  const input = [{ ...pomni }, { ...jax }], view = new SelectionPresentation(input);
  input[0].fighterId = 'max';
  view.choose(0, jax);
  const state = view.snapshot(0); state.current.fighterId = 'max'; state.previous.fighterId = 'max';
  assert.deepEqual(view.snapshot(0).current, jax); assert.deepEqual(view.undo(0), pomni);
  assert.throws(() => view.choose(2, pomni), RangeError);
  assert.throws(() => view.beginPortrait(0, {}), TypeError);
  assert.throws(() => view.reset([pomni]), TypeError);
});

test('all 64 current artists retain their authored selection and deselection brief IDs', () => {
  const authored = JSON.parse(fs.readFileSync(new URL('../docs/bible/extensions-characters.json', import.meta.url), 'utf8'));
  const rows = Array.isArray(authored) ? authored : authored.characters;
  assert.equal(FIGHTERS.length, 64); assert.equal(rows.length, 64);
  const view = create();
  for (const fighter of FIGHTERS) {
    view.choose(0, { fighterId: fighter.id });
    const state = view.snapshot(0), brief = rows.find(row => row.fighterId === fighter.id);
    assert.ok(brief, fighter.id);
    assert.equal(state.selectionBriefId, brief.selection.id);
    assert.equal(state.deselectionBriefId, brief.deselection.id);
  }
});

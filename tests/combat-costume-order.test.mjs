import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { COSTUMES, BASE_SPRITE_COSTUMES, FIGHTERS, VARIANTS } from '../combat/data.mjs';
import { createLegacyCrossoverCostumes } from '../combat/crossovers.mjs';
import { COSTUME_EXTENSION_ORDER, orderCostumeExtensions } from '../combat/costume-order.mjs';
import { ABSTRACTION_CALM_ID } from '../combat/abstractions-content.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const captured = readFileSync(new URL('../docs/art-generation/continuation-20261120-b/workbook/costume-prefix-baseline.json', import.meta.url));
const baseline = JSON.parse(captured);

test('the complete 472-costume prefix keeps its published IDs, order and fields', () => {
  assert.equal(hash(captured), 'a069c06ef34541b965169f12db4169e40fe16fbbf2381bbffa99b32ce29058cd', 'Keep the independently captured pre-continuation fixture');
  assert.equal(baseline.costumeCount, 472);
  assert.deepEqual(COSTUMES.slice(0, baseline.costumeCount).map(costume => costume.id), baseline.costumeIds);
  assert.equal(hash(JSON.stringify(COSTUMES.slice(0, baseline.costumeCount))), baseline.costumesSHA256);
  assert.deepEqual(COSTUME_EXTENSION_ORDER.slice(0, baseline.publishedExtensionIds.length), baseline.publishedExtensionIds);
});

test('explicit addition order appends mixed batches after all published records, including calm Queenie', () => {
  // The calm appearance was appended after the published Circus/NPC families;
  // it is not part of the historical archive prefix preceding those families.
  const fixedCount = VARIANTS.filter(variant => variant.id !== ABSTRACTION_CALM_ID).length + createLegacyCrossoverCostumes(FIGHTERS).length;
  let published = COSTUMES;
  let order = [...COSTUME_EXTENSION_ORDER, ABSTRACTION_CALM_ID, ...BASE_SPRITE_COSTUMES.map(costume => costume.id)];
  assert.equal(published[fixedCount + COSTUME_EXTENSION_ORDER.length].id, ABSTRACTION_CALM_ID);
  assert.deepEqual(published.slice(fixedCount).map(costume => costume.id), order);
  for (const wave of [1, 2]) {
    const existing = published.slice(fixedCount);
    const circus = existing.filter(costume => !costume.crossover);
    const npc = existing.filter(costume => costume.crossover);
    const additions = [
      { id: '__order_test_cafe_' + wave + '_a', marker: { wave } },
      { id: '__order_test_cafe_' + wave + '_b', marker: { wave } },
      ...['hommage', 'resident', 'fusion'].map(style => ({
        id: '__order_test_npc_' + wave + '_' + style,
        crossover: { series: '__test_only', style },
      })),
    ];
    // The candidate registries group Circus before NPC; the publication order does not.
    const candidates = [...circus, ...additions.slice(0, 2), ...npc, ...additions.slice(2)];
    order = [...order, ...additions.map(costume => costume.id)];
    const next = [...published.slice(0, fixedCount), ...orderCostumeExtensions(candidates, order)];
    assert.deepEqual(next.slice(0, published.length), published);
    assert.equal(hash(JSON.stringify(next.slice(0, baseline.costumeCount))), baseline.costumesSHA256);
    assert.deepEqual(next.slice(published.length).map(costume => costume.id), additions.map(costume => costume.id));
    for (let i = 0; i < published.length; i++) assert.equal(next[i], published[i]);
    for (let i = 0; i < additions.length; i++) assert.equal(next[published.length + i], additions[i]);
    published = next;
  }
});

test('ambiguous or incomplete addition registries fail with explicit IDs', () => {
  const a = { id: 'a' }, b = { id: 'b' };
  assert.throws(() => orderCostumeExtensions([a, a], ['a']), /duplicate costume id a/);
  assert.throws(() => orderCostumeExtensions([a], ['a', 'a']), /duplicate order id a/);
  assert.throws(() => orderCostumeExtensions([a], ['a', 'missing']), /missing costume id missing/);
  assert.throws(() => orderCostumeExtensions([a, b], ['a']), /unlisted costume ids b/);
});

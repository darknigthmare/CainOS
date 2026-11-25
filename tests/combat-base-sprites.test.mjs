import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { FIGHTERS, COSTUMES, BASE_SPRITE_COSTUMES, CROSSOVER_COSTUMES, STAGES, equipCostume } from '../combat/data.mjs';
import { BASE_SPRITE_ART_SLOTS, BASE_SPRITE_DEFINITIONS, baseSpriteFiles,
  publishedBaseSpriteDefinitions, createBaseSpriteCostumes } from '../combat/base-sprite-content.mjs';
import { CONTINUATION_B_BASE_DEFINITIONS, CONTINUATION_B_BASE_REVIEWS } from '../combat/base-sprite-continuation-20261125-b.mjs';
import { ACTION_ART, loadFighterIllustration, actionIllustration, standingIllustration, warmCombatPoses } from '../combat/illustrations.mjs';
import { CombatRenderer, drawPortrait, getFrame } from '../combat/render.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { GAME_VERSION, emptyProfile, validateProfile, validateReplay } from '../combat/session.mjs';

const sha = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
const fixtureBytes = readFileSync(new URL('../docs/art-generation/base-sprites-20261124/integration-baseline.json', import.meta.url));
const baseline = JSON.parse(fixtureBytes);
const continuationFixtureBytes = readFileSync(new URL('../docs/art-generation/base-sprites-20261125-b/integration-baseline-522.json', import.meta.url));
const continuationBaseline = JSON.parse(continuationFixtureBytes);

test('the 64 fighters and complete 484-costume prefix retain their published order and fields', () => {
  assert.equal(sha(fixtureBytes), '9076a438ee9fb8f69023a3bfe7aea53234a5ee26ec1fd9d42f63b529e76e6ebc');
  assert.equal(baseline.fighterCount, 64); assert.equal(baseline.costumeCount, 484);
  assert.deepEqual(FIGHTERS.map(fighter => fighter.id), baseline.fighterIds);
  assert.equal(sha(FIGHTERS), baseline.fightersSHA256);
  assert.deepEqual(COSTUMES.slice(0, 484).map(costume => costume.id), baseline.costumeIds);
  assert.equal(sha(COSTUMES.slice(0, 484)), baseline.costumesSHA256);
  assert.deepEqual(COSTUMES.slice(484), BASE_SPRITE_COSTUMES);
  assert.equal(sha(CROSSOVER_COSTUMES.slice(0, baseline.crossoverCount)), baseline.crossoversSHA256);
  assert.equal(new Set(COSTUMES.map(costume => costume.id)).size, COSTUMES.length);
});

test('the 522-costume continuation keeps its complete saved wardrobe prefix and fighter kits', () => {
  assert.equal(sha(continuationFixtureBytes), '9a45765d00dc4e9b650cbb60ab045c954fd59101100aaeb5e122f6f47a0f41ce');
  assert.equal(continuationBaseline.fighterCount, 64);
  assert.equal(continuationBaseline.costumeCount, 522);
  assert.equal(continuationBaseline.crossoverCount, 414);
  assert.deepEqual(FIGHTERS.map(fighter => fighter.id), continuationBaseline.fighterIds);
  assert.equal(sha(FIGHTERS), continuationBaseline.fightersSHA256);
  const prefix = COSTUMES.slice(0, continuationBaseline.costumeCount);
  assert.deepEqual(prefix.map(costume => costume.id), continuationBaseline.costumeIds);
  assert.equal(sha(prefix), continuationBaseline.costumesSHA256);
  assert.equal(sha(CROSSOVER_COSTUMES.slice(0, continuationBaseline.crossoverCount)), continuationBaseline.crossoversSHA256);
});

test('the six remaining Queenie collections append all 18 reviewed static families after the 522-costume prefix', () => {
  const series = ['gaslightdistrict', 'knightsofguinevere', 'gameoverse', 'lackadaisy', 'smg4', 'ultrajumpmania'];
  const styles = ['hommage', 'resident', 'fusion'];
  const expected = series.flatMap(world => styles.map(style => `glitch-${world}-queenie-${style}`));
  assert.deepEqual(CONTINUATION_B_BASE_DEFINITIONS.map(definition => definition.id), expected);
  assert.deepEqual(Object.keys(CONTINUATION_B_BASE_REVIEWS).sort(), [...expected].sort());
  assert.deepEqual(COSTUMES.slice(522, 540).map(costume => costume.id), expected,
    'The complete continuation must be selectable, with no missing pair silently filtered out');
  assert.deepEqual(CROSSOVER_COSTUMES.slice(414, 432).map(costume => costume.id), expected);
  const queenie = CROSSOVER_COSTUMES.filter(costume => costume.fighterId === 'queenie');
  assert.equal(queenie.length, 27, 'Three previously completed worlds plus the six remaining collections');
  for (const definition of CONTINUATION_B_BASE_DEFINITIONS) {
    assert.equal(definition.fighterId, 'queenie');
    assert.equal(definition.canonicalCostumeClaim, false, 'Crossovers remain original Encore adaptations');
    const costume = BASE_SPRITE_COSTUMES.find(item => item.id === definition.id);
    assert.ok(costume, definition.id + ': reviewed pair must be active in both entry paths');
    assert.equal(costume.baseOnly, true);
    assert.equal(costume.presentation, 'static');
    assert.equal(costume.animation, null);
    assert.deepEqual(costume.authoredSlots, ['selection', 'stance']);
    assert.deepEqual(costume.assetReview.issues, []);
    assert.ok(costume.assetReview.visibleTraits.length > 0, 'Actual visual inspection must be recorded');
    const evidence = readFileSync(new URL('../' + costume.assetReview.captureId, import.meta.url), 'utf8');
    assert.ok(evidence.includes(definition.id), definition.id + ': linked visual review exists');
  }
});

test('a static family activates only after both native files have a recorded review and are published', () => {
  const source = BASE_SPRITE_DEFINITIONS[0];
  const review = { status: 'verified-base-files', sha256: { selection: '1'.repeat(64), stance: '2'.repeat(64) } };
  const definition = { ...source, assetReview: review };
  const files = baseSpriteFiles(definition);
  assert.deepEqual(BASE_SPRITE_ART_SLOTS, ['selection', 'stance']);
  for (const published of [[], files.slice(0, 1), files.slice(1)]) assert.deepEqual(createBaseSpriteCostumes(FIGHTERS, [definition], published), []);
  for (const assetReview of [null, { ...review, status: 'pending' }, { ...review, sha256: { selection: review.sha256.selection } }])
    assert.deepEqual(createBaseSpriteCostumes(FIGHTERS, [{ ...definition, assetReview }], files), []);
  assert.deepEqual(createBaseSpriteCostumes([{ id: 'jax' }], [definition], files), [], 'No invented owner or kit');
  const [costume] = createBaseSpriteCostumes(FIGHTERS, [definition], files);
  assert.equal(costume.id, definition.id); assert.equal(costume.baseFighterId, 'ribbit');
  assert.equal(costume.baseOnly, true); assert.equal(costume.presentation, 'static');
  assert.deepEqual(costume.authoredSlots, ['selection', 'stance']);
  assert.equal(costume.animation, null); assert.equal(costume.sprite.baseOnly, true);
  assert.equal(costume.sprite.src, files[1]); assert.equal(costume.sprite.crossoverDirectory, definition.directory);
  assert.throws(() => publishedBaseSpriteDefinitions([definition, definition], files), /duplicate ID/);
  assert.throws(() => baseSpriteFiles({ directory: '../assets/encore/../../images/old' }), /own declared Encore directory/);
});

test('every activated base keeps two distinct native files and only changes its owner’s presentation', () => {
  for (const costume of BASE_SPRITE_COSTUMES) {
    const owner = FIGHTERS.find(fighter => fighter.id === costume.fighterId), equipped = equipCostume(owner, costume.id);
    assert.equal(equipped.costume, costume.id); assert.equal(equipped.moves, owner.moves);
    assert.equal(equipped.combat, owner.combat); assert.equal(equipped.stats, owner.stats);
    assert.equal(equipped.animation, null); assert.equal(equipped.sprite, costume.sprite);
    const other = FIGHTERS.find(fighter => fighter.id !== costume.fighterId);
    assert.equal(equipCostume(other, costume.id), other);
    const program = createProgram('story', owner.id, FIGHTERS, STAGES, { variantId: costume.id, seed: 72 });
    assert.equal(validateProgram(JSON.parse(JSON.stringify(program))).variantId, costume.id);
    assert.equal(validateProfile({ ...emptyProfile(), program }).program.variantId, costume.id);
    assert.throws(() => createProgram('story', other.id, FIGHTERS, STAGES, { variantId: costume.id }));
    const config = { fighters: [owner.id, other.id], variants: [costume.id, ''], stage: STAGES[0].id,
      cpu: [false, true], difficulty: 'normal', seed: 72, roundTime: 90, roundsToWin: 1 };
    const replay = { format: 'circus-encore-replay', version: GAME_VERSION, config, runs: [[1, 0, 0]] };
    const validate = value => validateReplay(value, FIGHTERS.map(fighter => fighter.id), STAGES.map(stage => stage.id));
    assert.equal(validate(replay).config.variants[0], costume.id);
    assert.throws(() => validate({ ...replay, config: { ...config, variants: ['', costume.id] } }));
    const definition = BASE_SPRITE_DEFINITIONS.find(item => item.id === costume.id);
    const hashes = baseSpriteFiles(definition).map((file, index) => {
      const bytes = readFileSync(new URL('../combat/' + file, import.meta.url));
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(bytes[25], 6, 'Native RGBA');
      const hash = sha(bytes); assert.equal(hash, definition.assetReview.sha256[BASE_SPRITE_ART_SLOTS[index]]);
      return hash;
    });
    assert.notEqual(hashes[0], hashes[1], costume.id + ': own portrait and stance, no duplicated PNG');
  }
});

function canvasFixture() {
  const target = { width: 0, height: 0 }, draws = [];
  let matrix = [1, 0, 0, 1, 0, 0]; const stack = [];
  const multiply = ([a, b, c, d, e, f]) => {
    const [u, v, w, z, x, y] = matrix;
    matrix = [u*a+w*b, v*a+z*b, u*c+w*d, v*c+z*d, u*e+w*f+x, v*e+z*f+y];
  };
  const context = new Proxy({
    canvas: target, draws,
    save() { stack.push([...matrix]); }, restore() { matrix = stack.pop(); },
    translate(x, y) { multiply([1, 0, 0, 1, x, y]); },
    scale(x, y) { multiply([x, 0, 0, y, 0, 0]); },
    rotate(angle) { const c = Math.cos(angle), s = Math.sin(angle); multiply([c, s, -s, c, 0, 0]); },
    drawImage(source, ...coordinates) { draws.push({ source, coordinates, matrix: [...matrix] }); },
    getImageData(_x, _y, width, height) {
      const data = new Uint8ClampedArray(width * height * 4);
      for (let y = 5; y < height - 5; y++) for (let x = 5; x < width - 5; x++) data[(y * width + x) * 4 + 3] = 255;
      return { data };
    },
    createRadialGradient() { return { addColorStop() {} }; },
    createLinearGradient() { return { addColorStop() {} }; },
  }, { get(object, key) { return key in object ? object[key] : () => {}; } });
  target.getContext = () => context;
  return { target, context, draws };
}

function installImages(t, deny = () => false) {
  const previous = { Image: globalThis.Image, document: globalThis.document }, requests = [];
  t.after(() => { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; } });
  globalThis.Image = class {
    naturalWidth = 96; naturalHeight = 144;
    async decode() { requests.push(this.src); if (deny(this.src)) throw new Error('Unavailable fixture image'); }
    removeAttribute() {}
  };
  globalThis.document = { createElement: () => canvasFixture().target };
  return requests;
}

test('the renderer holds the exact own stance for every static state on both sides without requesting action drawings', async t => {
  const requests = installImages(t);
  const owner = FIGHTERS.find(fighter => fighter.id === 'ribbit');
  const original = equipCostume(owner, 'glitch-murderdrones-ribbit-hommage');
  // This already-published family deliberately contains all eleven files.
  // Static mode must ignore them, including a previously decoded attack.
  await loadFighterIllustration('poses', original, 'attack');
  const staticFighter = { ...original, sprite: { ...original.sprite, baseOnly: true, nativeFacing: -1 } };
  const beforeRequests = requests.length;
  const stance = await loadFighterIllustration('stance', staticFighter);
  const portrait = await loadFighterIllustration('selection', staticFighter);
  assert.notEqual(stance.canvas, portrait.canvas);
  for (const pose of [...ACTION_ART, 'heavy']) {
    assert.equal(loadFighterIllustration('poses', staticFighter, pose), null);
    assert.equal(actionIllustration(staticFighter, pose), null);
  }
  await warmCombatPoses([staticFighter], () => true);
  assert.equal(requests.length - beforeRequests, 2, 'Only the two base textures are decoded');
  const { target, draws } = canvasFixture(), renderer = new CombatRenderer(target);
  const states = ['idle', 'guard', 'walk', 'jump', 'crouch', 'hit', 'intro', 'victory', 'defeat'];
  const cases = states.map(state => ({ state }));
  for (const [name, def] of Object.entries(staticFighter.moves)) for (const time of [0, def.startup, def.startup + def.active])
    cases.push({ state: 'idle', attack: { name, def, t: time } });
  for (const face of [-1, 1]) for (const reducedMotion of [false, true]) {
    let expectedMatrix;
    for (const extra of cases) {
      const actor = { f: staticFighter, slot: 0, x: 640, y: 568, face, onGround: extra.state !== 'jump', ...extra };
      const before = JSON.stringify(actor); draws.length = 0;
      const phase = extra.state === 'intro' ? 'intro' : ['victory', 'defeat'].includes(extra.state) ? 'matchOver' : 'fight';
      renderer.drawActor(actor, 37, reducedMotion, { phase, presentationFrame: 41, winner: extra.state === 'defeat' ? 1 : 0 });
      const emitted = draws.find(row => row.source === stance.canvas);
      assert.ok(emitted, extra.state + ': own stance emitted');
      expectedMatrix ||= emitted.matrix;
      assert.deepEqual(emitted.matrix, expectedMatrix, extra.state + ': no invented pose motion or action-height scaling');
      assert.equal(Math.sign(emitted.matrix[0]), face * stance.nativeFacing);
      assert.equal(Math.abs(emitted.matrix[0]), emitted.matrix[3], 'Uniform scale');
      assert.equal(JSON.stringify(actor), before, 'Presentation cannot mutate the actor or kit');
    }
  }
  assert.equal(standingIllustration(staticFighter), stance);
  assert.equal(getFrame(staticFighter, 'attack', 500), stance);
  const portraitTarget = canvasFixture();
  assert.equal(await drawPortrait(portraitTarget.target, staticFighter), true);
  assert.equal(portraitTarget.draws.at(-1).source, portrait.canvas);
  assert.equal(requests.length - beforeRequests, 2);
});

test('failed static bases never reveal a previous costume or the owner’s old atlas', async t => {
  const requests = installImages(t, () => true);
  const owner = FIGHTERS.find(fighter => fighter.id === 'ribbit');
  const original = equipCostume(owner, 'glitch-murderdrones-ribbit-resident');
  const f = { ...original, sprite: { ...original.sprite, baseOnly: true } };
  assert.equal(await loadFighterIllustration('stance', f), null);
  const { target, draws } = canvasFixture(), renderer = new CombatRenderer(target);
  for (let frame = 0; frame < 20; frame++) {
    assert.equal(getFrame(f, 'attack', frame), null);
    renderer.drawActor({ f, slot: 0, state: 'crouch', x: 640, y: 568, face: 1 }, frame, false);
  }
  assert.equal(draws.length, 0, 'Only the explicit unavailable-art placeholder is drawn');
  assert.equal(await drawPortrait(target, f), false);
  assert.equal(requests.length, 2, 'One guarded request per unavailable base, no frame-by-frame retries');
  assert.ok(requests.every(url => /\/murderdrones\/ribbit\/resident\/(selection|stance)\.png$/.test(url)));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { COSTUMES, COSTUME_ADDITIONS, FIGHTERS, STAGES, VARIANTS, equipCostume } from '../combat/data.mjs';
import { COSTUME_RESUMPTION_DEFINITIONS, getCostumeNativeFacing } from '../combat/costume-resumption-20261120.mjs';
import { COSTUME_NEXT_WAVE_DEFINITIONS } from '../combat/costume-next-wave-20261120.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';
import { getFidelitySources } from '../combat/fidelity.mjs';
import { createProgram, validateProgram } from '../combat/progression.mjs';
import { emptyProfile, GAME_VERSION, validateProfile, validateReplay } from '../combat/session.mjs';

const appearanceWaves = {
  '2026-11-19': ['beachpomni', 'noirragatha', 'presidentpomni', 'noirzooble',
    'beachragatha', 'beachzooble', 'beachjax', 'sandcastlekinger'],
  '2026-11-20': ['noirpomni', 'noirjax', 'noirkinger', 'badendcaine',
    'bodyguardragatha', 'bodyguardzooble', 'smilingtragedygangle', 'abstractingpomni',
    'abstractingjax', 'abstractingragatha', 'abstractingkinger', 'abstractinggangle',
    'abstractingzooble', 'abstractingqueenie', 'zoobleep5',
    'jaxsuitpomni', 'noirribbit', 'kaufmosuitribbit', 'intermissioncaine',
    'showtimepomni', 'bowlingpinragatha', 'ringmastercaine', 'strongmanorbsman',
    'stagehandbubble', 'bugtamerkinger', 'animeribbit', 'jaxsuitribbit',
    'watermelongangle', 'aquablasterpomni', 'ptocaine', 'freakjax', 'caferibbit'],
};

test('additional outfits retain their owner, authored kit and saved appearance through replay and campaign round trips', () => {
  assert.equal(COSTUME_ADDITIONS.length, 40);
  assert.equal(VARIANTS.length, 51, 'historical atlas remains stable');
  for (const [date, ids] of Object.entries(appearanceWaves)) {
    assert.deepEqual(COSTUME_ADDITIONS.filter(outfit => outfit.introducedOn === date).map(outfit => outfit.id), ids,
      date + ': preserve the historical wave and identify every new appearance');
  }
  for (const outfit of COSTUME_ADDITIONS) {
    const owner = FIGHTERS.find(f => f.id === outfit.fighterId);
    const other = FIGHTERS.find(f => f.id !== outfit.fighterId);
    assert.ok(owner);
    assert.equal(COSTUMES.filter(v => v.id === outfit.id).length, 1);
    const dressed = equipCostume(owner, outfit.id);
    assert.equal(dressed.costume, outfit.id);
    assert.equal(dressed.moves, owner.moves);
    assert.equal(dressed.combat, owner.combat);
    assert.deepEqual(dressed.visual, owner.visual);
    assert.equal(dressed.sprite.nativeFacing, outfit.id === 'abstractinggangle' ? -1 : 1,
      outfit.id + ': the atlas fallback must retain the reviewed stance direction');
    assert.equal(equipCostume(other, outfit.id), other);
    const program = createProgram('story', owner.id, FIGHTERS, STAGES, { variantId: outfit.id, seed: 7 });
    assert.equal(validateProgram(JSON.parse(JSON.stringify(program))).variantId, outfit.id);
    assert.equal(validateProfile({ ...emptyProfile(), program }).program.variantId, outfit.id);
    assert.throws(() => createProgram('story', other.id, FIGHTERS, STAGES, { variantId: outfit.id }));
    const config = { fighters: [owner.id, other.id], variants: [outfit.id, ''], stage: STAGES[0].id,
      cpu: [false, true], difficulty: 'normal', seed: 7, roundTime: 90, roundsToWin: 1 };
    const replay = { format: 'circus-encore-replay', version: GAME_VERSION, config, runs: [[1, 0, 0]] };
    const validate = value => validateReplay(value, FIGHTERS.map(f => f.id), STAGES.map(s => s.id));
    assert.equal(validate(replay).config.variants[0], outfit.id);
    assert.throws(() => validate({ ...replay, config: { ...config, variants: ['', outfit.id] } }));
    const sources = getFidelitySources(outfit.fidelity.sourceIds);
    assert.equal(sources.length, outfit.fidelity.sourceIds.length);
    for (const source of sources) {
      const url = new URL(source.url);
      assert.equal(url.protocol, 'https:');
      if (source.kind.startsWith('Épisode')) {
        assert.equal(url.hostname, 'www.youtube.com');
        assert.equal(url.pathname, '/watch');
        assert.ok(url.searchParams.get('v'), 'episode sources identify the official video');
      } else if (outfit.id === 'caferibbit') {
        assert.equal(source.kind, 'Illustration officielle de collaboration commerciale');
        assert.equal(url.hostname, 'prtimes.jp');
        assert.equal(url.pathname, '/main/html/rd/p/000008857.000016756.html');
      } else {
        assert.equal(source.kind, 'Produit dérivé officiel');
        assert.equal(url.hostname, 'glitchproductions.store');
        assert.ok(url.pathname.startsWith('/products/'));
      }
    }
  }
});

test('each additional outfit ships all eleven independent native-alpha PNG drawings in the offline pack', () => {
  const files = new Set(ART_FILES), signatures = new Set();
  for (const outfit of COSTUME_ADDITIONS) {
    for (const slot of ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']) {
      const file = ['selection', 'stance'].includes(slot)
        ? '../assets/encore/' + slot + '/' + outfit.id + '.png'
        : '../assets/encore/poses/' + outfit.id + '/' + slot + '.png';
      assert.ok(files.has(file), outfit.id + '/' + slot + ': offline publication');
      const bytes = readFileSync(new URL('../combat/' + file, import.meta.url));
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', file);
      assert.equal(bytes[25], 6, file + ': native RGBA');
      assert.ok(bytes.readUInt32BE(16) >= 768 && bytes.readUInt32BE(20) >= 768, file + ': complete native dimensions');
      signatures.add(createHash('sha256').update(bytes).digest('hex'));
    }
  }
  assert.equal(signatures.size, 440, 'all 40 appearances have eleven independent drawings');
});

test('resumed appearances append the frozen checkpoint definitions without changing the first fourteen entries', () => {
  const checkpoint = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-continuation-20261120/generation-resume.json', import.meta.url)));
  const definitions = checkpoint.pendingIds.map(id => checkpoint.appearances.find(entry => entry.id === id).definition);
  assert.deepEqual(COSTUME_RESUMPTION_DEFINITIONS, definitions);
  assert.deepEqual(COSTUME_ADDITIONS.slice(0, 14).map(entry => entry.id), [
    'beachpomni', 'noirragatha', 'presidentpomni', 'noirzooble', 'beachragatha',
    'beachzooble', 'beachjax', 'sandcastlekinger', 'noirpomni', 'noirjax', 'noirkinger',
    'badendcaine', 'bodyguardragatha', 'bodyguardzooble',
  ]);
  assert.deepEqual(COSTUME_ADDITIONS.slice(14, 23).map(entry => entry.id), checkpoint.pendingIds);
  for (const slot of ['selection', 'stance', 'attack', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']) {
    assert.equal(getCostumeNativeFacing('abstractinggangle', slot), -1, slot);
  }
  for (const slot of ['intro', 'heavy']) assert.equal(getCostumeNativeFacing('abstractinggangle', slot), 1, slot);
  assert.equal(getCostumeNativeFacing('abstractinggangle', 'unpublished'), 1, 'unknown slots preserve the historical default');
  for (const id of ['gangle', 'smilingtragedygangle', 'beachpomni', 'not-published']) {
    for (const slot of ['selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']) {
      assert.equal(getCostumeNativeFacing(id, slot), 1, id + '/' + slot);
    }
  }
});

test('runtime directions agree with the individually reviewed completion records for all ninety-nine resumed drawings', () => {
  const completion = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-resumption-20261120/generation-completion.json', import.meta.url)));
  const reviewed = completion.appearances.flatMap(appearance => appearance.files.map(file => ({
    appearanceId: appearance.id, slot: file.slot, nativeFacing: file.nativeFacing,
  })));
  assert.equal(reviewed.length, 99);
  assert.equal(new Set(reviewed.map(file => file.appearanceId + '/' + file.slot)).size, 99);
  // The review is independent of runtime metadata. This also prevents confusing
  // the crystalline two-mask Gangle with the right-facing smiling tragedy mask.
  for (const file of reviewed) {
    assert.ok(file.nativeFacing === 'left' || file.nativeFacing === 'right');
    assert.equal(getCostumeNativeFacing(file.appearanceId, file.slot), file.nativeFacing === 'left' ? -1 : 1,
      file.appearanceId + '/' + file.slot + ': use the direction of this reviewed image');
  }
});

test('new catalogue drawings match reviewed native directions and exact archived PNGs', () => {
  const completion = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-next-20261120/generation-completion.json', import.meta.url)));
  assert.equal(completion.status, 'complete_active');
  assert.deepEqual(COSTUME_ADDITIONS.slice(23, 33).map(entry => entry.id), completion.order);
  const files = completion.appearances.flatMap(appearance => appearance.files);
  assert.equal(files.length, 110);
  assert.equal(new Set(files.map(file => file.appearanceId + '/' + file.slot)).size, 110);
  const ribbit = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-ribbit-20261120/generation-completion.json', import.meta.url)));
  assert.equal(ribbit.status, 'complete_active');
  assert.deepEqual(COSTUME_ADDITIONS.slice(33, 35).map(entry => entry.id), ribbit.order);
  const ribbitFiles = ribbit.appearances.flatMap(appearance => appearance.files);
  assert.equal(ribbitFiles.length, 22);
  assert.equal(new Set(ribbitFiles.map(file => file.appearanceId + '/' + file.slot)).size, 22);
  files.push(...ribbitFiles);
  const baselineBytes = readFileSync(new URL('../docs/art-generation/cast-next-missing-20261120/integration-baseline.json', import.meta.url));
  assert.equal(createHash('sha256').update(baselineBytes).digest('hex'), '88da0348cde24375ded30c72ea3a1636896fc77097ad6bcb78550d2c7481d379', 'Preserve the independently captured pre-addition catalogue');
  const baseline = JSON.parse(baselineBytes);
  assert.deepEqual(COSTUME_ADDITIONS.slice(0, 35).map(entry => entry.id), baseline.appearanceIds);
  assert.deepEqual(COSTUMES.slice(0, 464).map(entry => entry.id), baseline.costumeIds);
  assert.equal(createHash('sha256').update(JSON.stringify(COSTUMES.slice(0, 464))).digest('hex'), baseline.costumesSHA256);
  for (const outfit of COSTUME_ADDITIONS.slice(0, 35)) {
    assert.equal(createHash('sha256').update(JSON.stringify(outfit)).digest('hex'), baseline.appearanceHashes[outfit.id], outfit.id + ': historical definition unchanged');
  }
  const next = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-next-missing-20261120/generation-completion.json', import.meta.url)));
  assert.equal(next.status, 'complete_active');
  assert.deepEqual(next.order, ['watermelongangle', 'aquablasterpomni', 'ptocaine', 'freakjax']);
  assert.deepEqual(COSTUME_ADDITIONS.slice(35, 39).map(entry => entry.id), next.order);
  const nextFiles = next.appearances.flatMap(appearance => appearance.files);
  assert.equal(nextFiles.length, 44);
  assert.equal(new Set(nextFiles.map(file => file.appearanceId + '/' + file.slot)).size, 44);
  assert.equal(new Set(nextFiles.map(file => file.sha256)).size, 44);
  files.push(...nextFiles);
  const wave = JSON.parse(readFileSync(new URL('../docs/art-generation/cast-next-wave-20261120/generation-completion.json', import.meta.url)));
  assert.equal(wave.status, 'complete_active');
  assert.deepEqual(wave.order, ['caferibbit']);
  assert.deepEqual(COSTUME_ADDITIONS.slice(39).map(entry => entry.id), wave.order);
  const cafeFiles = wave.appearances.flatMap(appearance => appearance.files);
  assert.equal(cafeFiles.length, 11);
  assert.equal(new Set(cafeFiles.map(file => file.appearanceId + '/' + file.slot)).size, 11);
  assert.equal(new Set(cafeFiles.map(file => file.sha256)).size, 11);
  files.push(...cafeFiles);
  // The independently reviewed records protect mixed source directions, including
  // Ragatha's left-facing portrait beside her right-facing combat drawings.
  for (const file of files) {
    assert.ok(file.nativeFacing === 'left' || file.nativeFacing === 'right');
    assert.equal(getCostumeNativeFacing(file.appearanceId, file.slot), file.nativeFacing === 'left' ? -1 : 1,
      file.appearanceId + '/' + file.slot + ': preserve the reviewed source direction');
    const installed = readFileSync(new URL('../' + file.file, import.meta.url));
    const archived = readFileSync(new URL('../' + file.archiveFile, import.meta.url));
    assert.deepEqual(installed, archived, file.file + ': no resizing or re-encoding');
    assert.equal(createHash('sha256').update(installed).digest('hex'), file.sha256);
  }
});

test('Cafe Ribbit preserves the 468-costume prefix and binds every installed pose to its frozen owner and accepted receipt', () => {
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  const read = path => readFileSync(new URL('../' + path, import.meta.url));
  const wave = 'docs/art-generation/cast-next-wave-20261120/';
  const baselineBytes = read('docs/art-generation/npc-crossovers-next-wave-20261120/integration-baseline.json');
  assert.equal(hash(baselineBytes), '1bea46363a8b121b71db75eb2da67f21b7db55254bc85eda5d242bb15e23acbf');
  const baseline = JSON.parse(baselineBytes);
  assert.deepEqual(COSTUME_ADDITIONS.slice(0, 39).map(outfit => outfit.id), baseline.appearanceIds);
  assert.deepEqual(COSTUMES.slice(0, 468).map(outfit => outfit.id), baseline.costumeIds);
  assert.equal(hash(JSON.stringify(COSTUMES.slice(0, 468))), baseline.costumesSHA256);
  for (const outfit of COSTUME_ADDITIONS.slice(0, 39)) {
    assert.equal(hash(JSON.stringify(outfit)), baseline.costumeHashes[outfit.id], outfit.id + ': historical definition unchanged');
  }
  assert.equal(COSTUMES[468].id, 'caferibbit', 'append Cafe before subsequent new crossover entries');
  const definitionBytes = read(wave + 'definitions/caferibbit.json');
  const definition = JSON.parse(definitionBytes);
  assert.deepEqual(COSTUME_NEXT_WAVE_DEFINITIONS, [definition]);
  assert.equal(definition.fighterId, 'ribbit');
  const outfit = COSTUME_ADDITIONS.find(value => value.id === 'caferibbit');
  assert.equal(outfit.fighterId, 'ribbit');
  assert.equal(outfit.baseFighterId, 'ribbit');
  assert.equal(COSTUMES.some(value => value.id === 'maidribbit'), false, 'the separate Pendantz candidate remains unclosed');
  const completion = JSON.parse(read(wave + 'generation-completion.json'));
  assert.deepEqual(completion.order, ['caferibbit']);
  assert.equal(completion.counts.cumulativeAppearances, 40);
  assert.equal(completion.counts.cumulativeAppearancePngs, 440);
  assert.equal(completion.appearances[0].fighterId, 'ribbit');
  assert.deepEqual(completion.appearances[0].files.map(file => file.slot), completion.slots);
  for (const file of completion.appearances[0].files) {
    const receipt = JSON.parse(read(file.receiptFile));
    assert.equal(receipt.appearanceId, 'caferibbit');
    assert.equal(receipt.slot, file.slot);
    assert.equal(receipt.status, 'accepted_native');
    assert.equal(receipt.visualReview.status, 'accepted');
    assert.equal(receipt.method, 'image_gen.imagegen');
    assert.equal(receipt.nativeCopyVerified, true);
    assert.equal(receipt.definitionSha256, hash(definitionBytes));
    assert.equal(receipt.nativeFacing, 'right');
    assert.equal(receipt.sha256, file.sha256);
    assert.equal(receipt.targetFile, file.file);
    assert.equal(receipt.file, file.archiveFile);
    assert.equal(hash(read(file.file)), receipt.sha256);
    assert.equal(hash(read(file.archiveFile)), receipt.sha256);
    assert.deepEqual(file.references, receipt.portableReferences);
    for (const reference of receipt.portableReferences) {
      const bytes = read(reference.file);
      assert.equal(hash(bytes), reference.sha256, reference.file + ': original reference retained');
      assert.equal(bytes.length, reference.bytes);
    }
  }
});

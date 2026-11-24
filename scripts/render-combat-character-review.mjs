/** Verify published character drawings through the production Canvas2D renderer.
 * This native Skia review does not run a browser, play matches or certify canon.
 * Optional dependency: @napi-rs/canvas, also available in the managed runtime.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const repo = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
let skia;
try { skia = await import('@napi-rs/canvas'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  skia = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, '@napi-rs/canvas/index.js')));
}
const { createCanvas, Image: NativeImage } = skia;
const imageSources = new WeakMap(), decodedSources = new WeakMap();
globalThis.Image = class extends NativeImage {
  set src(value) {
    const source = typeof value === 'string' && value.startsWith('file:') ? fileURLToPath(value) : value;
    if (typeof source === 'string') imageSources.set(this, path.resolve(source));
    super.src = source;
  }
  get src() { return super.src; }
  removeAttribute() {}
};
globalThis.document = { createElement(name) {
  assert.equal(name, 'canvas'); const canvas = createCanvas(1, 1); canvas.isConnected = true;
  const context = canvas.getContext('2d'), draw = context.drawImage.bind(context);
  context.drawImage = (source, ...coordinates) => {
    const file = imageSources.get(source) || decodedSources.get(source);
    if (file) decodedSources.set(canvas, file);
    return draw(source, ...coordinates);
  };
  return canvas;
} };

const { FIGHTERS, VARIANTS, ARCHIVE, COSTUME_ADDITIONS, CROSSOVER_COSTUMES, equipCostume } = await import('../combat/data.mjs');
const { ART_FILES } = await import('../combat/offline-manifest.mjs');
const { CombatRenderer, drawPortrait } = await import('../combat/render.mjs');
const { ACTION_ART, loadFighterIllustration, archiveSelectionParts } = await import('../combat/illustrations.mjs');
const args = process.argv.slice(2), at = args.indexOf('--output');
const output = path.resolve(at < 0 ? 'audit-combat/character-review-2026-11-19' : args[at + 1]);
const partial = args.includes('--available-only');
const additionsOnly = args.includes('--costume-additions');
const crossoversOnly = args.includes('--crossovers');
const introducedAt = args.indexOf('--introduced-on');
const introducedOn = introducedAt < 0 ? null : args[introducedAt + 1];
const appearanceAt = args.indexOf('--appearance');
const appearanceId = appearanceAt < 0 ? null : args[appearanceAt + 1];
const reportAt = args.indexOf('--report');
assert(!(additionsOnly && crossoversOnly), 'Choose --costume-additions or --crossovers');
assert(appearanceAt < 0 || additionsOnly || crossoversOnly, '--appearance requires --costume-additions or --crossovers');
assert(appearanceAt < 0 || (typeof appearanceId === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(appearanceId)), 'Expected an appearance ID');
assert(introducedAt < 0 || additionsOnly || crossoversOnly, '--introduced-on requires --costume-additions or --crossovers');
assert(introducedAt < 0 || (typeof introducedOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(introducedOn)), 'Expected an ISO introduction date after --introduced-on');
const additions = COSTUME_ADDITIONS.filter(item => (!introducedOn || item.introducedOn === introducedOn) && (!appearanceId || item.id === appearanceId));
const crossovers = CROSSOVER_COSTUMES.filter(item => (!introducedOn || item.introducedOn === introducedOn) && (!appearanceId || item.id === appearanceId));
const selected = crossoversOnly ? crossovers : additions;
assert(!introducedOn || selected.length, 'No appearances introduced on ' + introducedOn);
assert(!appearanceId || selected.length === 1, 'Unknown appearance: ' + appearanceId);
const reportDate = introducedOn || new Date().toISOString().slice(0, 10);
await fs.mkdir(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const published = new Set(ART_FILES);
const sourceFor = stem => [stem + '.webp', stem + '.png'].find(file => published.has('../' + file));
// Match the production loader: directory-based crossovers keep their own
// slots, while the original cast uses selection/stance/poses directories.
function sourceForAppearance(kind, id, fighter, pose) {
  const directory = fighter.sprite?.crossoverDirectory;
  const stem = directory
    ? path.relative(repo, path.resolve(repo, 'combat', directory, kind === 'poses' ? pose : kind)).split(path.sep).join('/')
    : `assets/encore/${kind}/${id}${kind === 'poses' ? '/' + pose : ''}`;
  return sourceFor(stem);
}
const report = { schema: 'encore-character-canvas-review/v1', createdAt: new Date().toISOString(),
  method: 'Production Canvas2D modules executed by Node and native Skia; actual drawImage sources and transforms inspected.',
  limitations: ['No browser, DOM, input, audio, service-worker or physical-device test.',
    'Individual static poses do not establish frame-by-frame animation.',
    'Asset identity/proportion fidelity requires separate visual review; no canonical 1:1 certification.'],
  partial, additionsOnly, crossoversOnly, introducedOn, appearanceId, sources: {}, actions: [], stances: [], portraits: [], missing: [], sheets: [], browserTestStatus: 'not_executed' };
for (const file of ['combat/data.mjs','combat/base-sprite-content.mjs','combat/abstractions-content.mjs','combat/costume-additions.mjs','combat/costume-continuation-20261120.mjs','combat/costume-resumption-20261120.mjs','combat/costume-discoveries-20261120.mjs','combat/costume-ribbit-20261120.mjs','combat/costume-next-missing-20261120.mjs','combat/costume-next-wave-20261120.mjs','combat/costume-order.mjs','combat/costume-continuation-20261120-b.mjs','combat/costume-continuation-20261120-c.mjs','combat/crossovers.mjs','combat/crossover-npc-additions.mjs','combat/illustrations.mjs','combat/render.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs','scripts/render-combat-character-review.mjs']) {
  report.sources[file] = sha(await fs.readFile(path.join(repo, file)));
}
function background(ctx, width, height) {
  ctx.fillStyle = '#242b3d'; ctx.fillRect(0, 0, width, height);
  for (let y = 0; y < height; y += 24) for (let x = 0; x < width; x += 24) {
    if ((x / 24 + y / 24) % 2) { ctx.fillStyle = '#30394d'; ctx.fillRect(x, y, 24, 24); }
  }
}
const appearances = crossoversOnly ? crossovers.map(item => {
  const base = FIGHTERS.find(f => f.id === item.fighterId);
  assert.ok(base, 'Unknown crossover fighter: ' + item.fighterId);
  const f = equipCostume(base, item.id);
  assert.equal(f.costume, item.id, 'Crossover is not selectable: ' + item.id);
  assert.ok(f.sprite?.crossoverDirectory, 'Crossover has no asset directory: ' + item.id);
  return { id: item.id, name: item.name || item.id, f };
}) : [...(additionsOnly ? [] : FIGHTERS.map(f => ({ id: f.id, name: f.name, f }))), ...(additionsOnly ? additions : [...VARIANTS, ...additions]).map(v => {
  const base = FIGHTERS.find(f => f.id === v.baseFighterId);
  return { id: v.id, name: v.name || v.label || v.id, f: { ...base, costume: v.id, sprite: v.sprite,
    visual: { ...base.visual, ...v.visual }, animation: v.animation || null } };
})];
const poses = [...ACTION_ART, 'heavy'];
const arena = createCanvas(1280, 720), renderer = new CombatRenderer(arena), ctx = renderer.ctx;
let sampled = [];
const draw = ctx.drawImage.bind(ctx);
ctx.drawImage = (source, ...rest) => { sampled.push({ source, matrix: ctx.getTransform() }); return draw(source, ...rest); };
function expectedSize(f, frame, height) {
  const limit = f.visual?.maxIllustratedWidth;
  const scale = Number.isFinite(limit) && limit > 0
    ? Math.min(height / frame.bounds.height, limit / frame.bounds.width)
    : height / frame.bounds.height;
  return { width: frame.bounds.width * scale, height: frame.bounds.height * scale };
}
function worldBounds(frame, matrix) {
  const { x, y, width, height } = frame.bounds;
  const points = [[x,y],[x+width,y],[x,y+height],[x+width,y+height]].map(([x,y]) => ({
    x: matrix.a*x+matrix.c*y+matrix.e, y: matrix.b*x+matrix.d*y+matrix.f,
  }));
  return { left: Math.min(...points.map(p=>p.x)), right: Math.max(...points.map(p=>p.x)), bottom: Math.max(...points.map(p=>p.y)) };
}
for (const { id, f } of appearances) {
  globalThis.gc?.();
  const stanceFile = sourceForAppearance('stance', id, f);
  if (!stanceFile) report.missing.push(id + '/stance');
  else {
    const stance = await loadFighterIllustration('stance', f);
    assert.ok(stance?.canvas, id + ': authored stance must decode');
    assert.equal(decodedSources.get(stance.canvas), path.resolve(repo, stanceFile), id + ': exact stance source');
    const drawChecks = [];
    for (const face of [1, -1]) {
      sampled = []; ctx.clearRect(0, 0, arena.width, arena.height);
      renderer.drawActor({ f, slot: 0, state: 'idle', x: 640, y: 568, face, onGround: true }, 0, true, { phase: 'fight' });
      const emitted = sampled.find(row => row.source === stance.canvas);
      assert.ok(emitted, id + ': renderer must use its own stance');
      const { a, b, c, d } = emitted.matrix;
      assert.ok([-1, 1].includes(stance.nativeFacing), id + ': known source direction');
      assert.equal(Math.sign(a), face * stance.nativeFacing, id + ': stance facing');
      assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 0.0001, id + ': uniform stance scale');
      const dimensions = expectedSize(f, stance, f.visual?.height || f.combat?.simulationBody?.height || 230);
      assert.ok(Math.abs(Math.hypot(c,d)*stance.bounds.height-dimensions.height)<.01, id+': visible stance height');
      drawChecks.push({face,sourceVerified:true,uniformScale:true,visibleWidth:Math.hypot(a,b)*stance.bounds.width,
        visibleHeight:Math.hypot(c,d)*stance.bounds.height,matrix:{a,b,c,d,e:emitted.matrix.e,f:emitted.matrix.f}});
    }
    const bytes = await fs.readFile(path.join(repo, stanceFile));
    report.stances.push({ id, file: stanceFile, sha256: sha(bytes), bytes: bytes.length, nativeFacing: stance.nativeFacing,
      rendered: true, sourceVerified: true, bothFacings: true, drawChecks });
  }
  const sheet = createCanvas(1080, 1110), sc = sheet.getContext('2d');
  background(sc, sheet.width, sheet.height);
  const baseOnly = f.sprite?.baseOnly === true;
  sc.fillStyle = '#fff0d4'; sc.font = 'bold 24px sans-serif'; sc.fillText(id + (baseOnly ? ' / garde statique réutilisée' : ' / poses individuelles'), 18, 32);
  let checked = 0;
  for (const [index, pose] of poses.entries()) {
    // Legacy ten-slot crossovers intentionally reuse attack for heavy. The
    // new eleven-slot sets resolve their own heavy through the same loader.
    const sourcePose = baseOnly ? 'stance' : pose === 'heavy' && f.sprite?.crossoverDirectory && !sourceForAppearance('poses', id, f, pose) ? 'attack' : pose;
    const file = sourceForAppearance(baseOnly ? 'stance' : 'poses', id, f, sourcePose);
    if (!file) { report.missing.push(id + '/' + pose); continue; }
    const expected = await loadFighterIllustration(baseOnly ? 'stance' : 'poses', f, sourcePose);
    assert.ok(expected?.canvas && expected.bounds.height > 0, 'decode ' + file);
    assert.equal(decodedSources.get(expected.canvas), path.resolve(repo, file), id + '/' + pose + ': exact action source');
    const actor = { f, slot: 0, state: pose, x: 640, y: 568, face: 1, onGround: pose !== 'jump' };
    const phase = pose === 'intro' ? 'intro' : ['victory','defeat'].includes(pose) ? 'matchOver' : 'fight';
    if (['attack','heavy'].includes(pose)) {
      const slot = pose === 'heavy' ? 'heavy' : 'light';
      actor.attack = { name: slot, def: f.moves[slot], t: f.moves[slot].startup };
    }
    const drawChecks = [];
    for (const face of [1, -1]) {
      actor.face = face; sampled = []; ctx.clearRect(0, 0, 1280, 720);
      const before = JSON.stringify(actor);
      renderer.drawActor(actor, 0, true, { phase, winner: pose === 'defeat' ? 1 : 0 });
      assert.equal(JSON.stringify(actor), before, id+'/'+pose+': presentation preserves actor');
      const emitted = sampled.find(row => row.source === expected.canvas);
      assert.ok(emitted, id + '/' + pose + ': renderer must use the authored drawing');
      const { a, b, c, d } = emitted.matrix;
      assert.ok([-1, 1].includes(expected.nativeFacing), id + '/' + pose + ': known source direction');
      assert.equal(Math.sign(a), face * expected.nativeFacing, id + '/' + pose + ': facing');
      assert.ok(Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) < 0.0001, 'uniform scale');
      const configuredFactor = f.visual?.poseHeightFactors?.[sourcePose];
      const poseHeightFactor = !baseOnly && Number.isFinite(configuredFactor) && configuredFactor > 0 ? configuredFactor : 1;
      const height = (f.visual?.height || f.combat?.simulationBody?.height || 230) * (!baseOnly && ['crouch','defeat'].includes(pose) ? 0.74 : 1) * poseHeightFactor;
      const dimensions = expectedSize(f, expected, height);
      assert.ok(Math.abs(Math.hypot(c, d) * expected.bounds.height - dimensions.height) < 0.01, id + '/' + pose + ': visible height');
      drawChecks.push({face,sourceVerified:true,uniformScale:true,visibleWidth:Math.hypot(a,b)*expected.bounds.width,
        visibleHeight:Math.hypot(c,d)*expected.bounds.height,maxIllustratedWidth:f.visual?.maxIllustratedWidth??null,poseHeightFactor,
        matrix:{a,b,c,d,e:emitted.matrix.e,f:emitted.matrix.f}});
      if (face === 1) {
        // Centered production crop; the right/left facing assertions above use
        // the entire unscaled arena. The sheet is only a visual review aid.
        const x = index % 3 * 360, y = Math.floor(index / 3) * 350 + 52;
        const bounds = worldBounds(expected, emitted.matrix);
        const scale = Math.min(1, 300 / Math.max(1, dimensions.height), 336 / (dimensions.width + 30));
        sc.save(); sc.beginPath(); sc.rect(x + 2, y + 28, 356, 312); sc.clip();
        sc.translate(x + 180 - (bounds.left+bounds.right)/2 * scale, y + 330 - bounds.bottom * scale);
        sc.scale(scale, scale);
        // Draw into the sheet directly: native Skia can defer a reused arena
        // copy until a later pose, silently repeating that later image.
        const previousContext = renderer.ctx;
        try { renderer.ctx = sc; renderer.drawActor(actor, 0, true, { phase, winner: pose === 'defeat' ? 1 : 0 }); }
        finally { renderer.ctx = previousContext; sc.restore(); }
        sc.fillStyle = '#f1e7d1'; sc.font = '16px sans-serif'; sc.fillText(pose, x + 12, y + 20);
      }
    }
    const bytes = await fs.readFile(path.join(repo, file));
    report.actions.push({ id, pose, sourcePose, baseOnly, authoredAction: !baseOnly, file, sha256: sha(bytes), bytes: bytes.length,
      visibleBounds: expected.bounds, nativeFacing: expected.nativeFacing, sourceVerified: true, bothFacings: true, uniformScale: true, rendered: true, drawChecks });
    checked++;
  }
  if (checked) {
    const filename = `actions-${id}.jpg`;
    await fs.writeFile(path.join(output, filename), sheet.toBuffer('image/jpeg', 88)); report.sheets.push(filename);
  }
  sheet.width = 1; sheet.height = 1;
}

const portraits = crossoversOnly ? appearances.map(item => ({ ...item.f, id: item.id, archiveId: null })) : (additionsOnly ? [] : ARCHIVE).flatMap(item => {
  const parts = archiveSelectionParts(item.id);
  return parts.length ? parts.map(part => ({ ...item, id: part.id, name: part.label, archiveId: item.id })) : [{ ...item, archiveId: item.id }];
}).concat(additions.map(item => ({ ...equipCostume(FIGHTERS.find(f => f.id === item.fighterId), item.id), id: item.id, archiveId: null })));
for (let offset = 0; offset < portraits.length; offset += 24) {
  const rows = Math.ceil(Math.min(24, portraits.length - offset) / 6);
  const sheet = createCanvas(1440, rows * 284), sc = sheet.getContext('2d'); background(sc, sheet.width, sheet.height);
  for (const [index, item] of portraits.slice(offset, offset + 24).entries()) {
    const file = sourceForAppearance('selection', item.id, item);
    if (!file) { report.missing.push(item.id + '/selection'); continue; }
    const expected = await loadFighterIllustration('selection', item);
    assert.ok(expected?.canvas, 'selection decode ' + item.id);
    assert.equal(decodedSources.get(expected.canvas), path.resolve(repo, file), item.id + ': exact portrait source');
    const canvas = createCanvas(224, 242);
    const portraitContext = canvas.getContext('2d'), portraitDraw = portraitContext.drawImage.bind(portraitContext);
    const portraitDraws = [];
    portraitContext.drawImage = (source, ...coordinates) => {
      portraitDraws.push({ source, coordinates }); return portraitDraw(source, ...coordinates);
    };
    assert.equal(await drawPortrait(canvas, item, { selection: true, glow: false }), true, item.id);
    const emitted = portraitDraws.find(row => row.source === expected.canvas);
    assert.ok(emitted, item.id + ': portrait must use its own selection drawing');
    assert.equal(emitted.coordinates.length, 8, item.id + ': expected bounded portrait crop');
    const [sx, sy, sw, sh, , , dw, dh] = emitted.coordinates;
    assert.deepEqual([sx, sy, sw, sh], [expected.bounds.x, expected.bounds.y, expected.bounds.width, expected.bounds.height]);
    // drawPortrait rounds destination dimensions to pixels after uniform fit.
    const portraitScale = Math.min(canvas.width * 0.87 / sw, canvas.height * 0.91 / sh);
    assert.ok(Math.abs(dw - sw * portraitScale) <= 0.5 && Math.abs(dh - sh * portraitScale) <= 0.5,
      item.id + ': portrait preserves its proportions within pixel rounding');
    const x = index % 6 * 240, y = Math.floor(index / 6) * 284;
    sc.drawImage(canvas, x + 8, y + 8); sc.fillStyle = '#f1e7d1'; sc.font = '13px sans-serif'; sc.fillText(item.id, x + 10, y + 274);
    const bytes = await fs.readFile(path.join(repo, file));
    report.portraits.push({ id: item.id, archiveId: item.archiveId, file, sha256: sha(bytes), bytes: bytes.length,
      rendered: true, sourceVerified: true, uniformScaleWithinPixelRounding: true, directionalAPI: false });
  }
  const filename = `archive-portraits-${String(offset / 24 + 1).padStart(2, '0')}.jpg`;
  await fs.writeFile(path.join(output, filename), sheet.toBuffer('image/jpeg', 88)); report.sheets.push(filename);
  sheet.width = 1; sheet.height = 1;
}
report.counts = { appearances: appearances.length, expectedActions: appearances.length * poses.length,
  actions: report.actions.length, stances: report.stances.length, drawChecks: (report.actions.length + report.stances.length) * 2, archiveEntries: additionsOnly || crossoversOnly ? 0 : ARCHIVE.length,
  portraits: report.portraits.length, expectedPortraits: portraits.length, missing: report.missing.length,
  authoredActions: report.actions.filter(action => !action.baseOnly).length,
  reusedStaticGuards: report.actions.filter(action => action.baseOnly).length,
  aliasedActions: report.actions.filter(action => !action.baseOnly && action.sourcePose !== action.pose).length };
report.complete = report.missing.length === 0;
await fs.writeFile(path.join(output, 'character-canvas-review.json'), JSON.stringify(report, null, 2) + '\n');
const table = items => ['| Apparence | Actions rendues | Planche |', '| --- | ---: | --- |',
  ...items.map(item => {
    const count = report.actions.filter(action => action.id === item.id).length;
    return `| ${item.name} | ${count}/9${item.f.sprite?.baseOnly === true ? ' états avec la même garde' : ''} | ${count ? `[${item.id}](actions-${item.id}.jpg)` : 'Non publiée'} |`;
  })].join('\n');
const reportTarget = reportAt < 0 ? path.join(repo, 'docs', crossoversOnly
  ? `COMBAT_NPC_CROSSOVERS_${reportDate}.md` : additionsOnly
  ? `COMBAT_CAST_CONTINUATION_${reportDate}.md` : 'COMBAT_CHARACTER_COMPLETION_2026-11-19.md') : path.resolve(repo, args[reportAt + 1]);
const reportLink = path.relative(output, reportTarget).split(path.sep).join('/');
const gallery = [
  '# Personnages d’Encore — galerie du ' + reportDate, '',
  `${report.counts.actions} états de ${appearances.length} apparences et ${report.counts.portraits} portraits individuels ont été rendus avec les modules Canvas du jeu.`, '',
  'Les planches distinguent les fichiers d’action individuels des familles explicitement statiques qui réemploient une seule garde. Ce rendu Node/Skia ne constitue pas un parcours navigateur, une animation image par image ou une certification canonique.', '',
  ...(report.counts.reusedStaticGuards ? [`${report.counts.reusedStaticGuards} états sont des réemplois volontaires de garde statique ; ils ne représentent aucun dessin d’action supplémentaire.`, ''] : []),
  ...(report.counts.aliasedActions ? [`${report.counts.aliasedActions} coups lourds historiques réemploient leur dessin d’attaque, conformément au chargeur ; ces réemplois ne comptent pas comme de nouveaux fichiers.`, ''] : []),
  '[Rapport des sources et contrôles](character-canvas-review.json) · [Bilan de la passe](' + reportLink + ')', '',
  ...(crossoversOnly ? ['## Costumes crossover', '', table(appearances), ''] : additionsOnly ? ['## Variantes supplémentaires', '', table(appearances), ''] : [
    '## Combattants', '', table(appearances.slice(0, FIGHTERS.length)), '',
    '## Variantes', '', table(appearances.slice(FIGHTERS.length)), '']),
  '## Portraits individuels', '',
  ...report.sheets.filter(file => file.startsWith('archive-portraits-')).map((file, index) => `- [Planche ${index + 1}](${file})`), '',
].join('\n');
await fs.writeFile(path.join(output, 'README.md'), gallery);
console.log(JSON.stringify({ output, ...report.counts, complete: report.complete }));
if (!partial) assert.deepEqual(report.missing, [], 'Every declared static character slot must be published');

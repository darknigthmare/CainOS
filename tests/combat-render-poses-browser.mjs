/**
 * Native Canvas fixtures, not played-duel or canonical-art certification.
 * Compares the published 0.3 renderer to current presentation using the same
 * current catalog and existing atlas files. No game rule is changed here.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4181';
const output = path.resolve('audit-combat');
const baseline = process.env.COMBAT_POSE_BASELINE || '171f422686e350cf665a7a755b1c77aa4322811f';
const { stdout: baselineRenderer } = await promisify(execFile)('git', ['show', `${baseline}:combat/render.mjs`], { maxBuffer: 2_000_000 });
await fs.mkdir(output, { recursive: true });
const report = {
  createdAt: new Date().toISOString(), baseline,
  fixture: 'Native Canvas source-frame and game-state presentation fixtures. No played match or canonical 1:1 claim.',
  comparisons: ['56 existing source cells', 'Seven base standing/low states', 'Seven base intro/victory/defeat states', 'Seven base attack phases and projectile presentation'],
  checks: [], screenshots: [], measurements: {}, errors: [],
  limitations: [
    'The seven current sheets contain idle, walk, speech, interaction and reaction drawings, not dedicated combat animations. Jax uses the regenerated 0.5.0 transparent sheet.',
    'Only base Pomni and Zooble have shallow rigid cutout low stances. Costumes and other morphologies keep intact drawings with a stance cue.',
    'Face/torso preservation is measured on the existing source artwork. No canonical height, palette or anatomy certification follows from that measurement.',
    'The low stance does not reproduce the simulation hurtbox. Dedicated guard, crouch, combat and outcome artwork remains partial.',
    'Rigid leg overlap changes a few transparent or semitransparent hip-edge pixels. Face/upper-torso RGBA and original opaque torso pixels are checked separately.',
    'Registration roots were measured and visually reviewed on the source artwork, not derived from official model rigs.',
  ],
};
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
const files = ['combat/render.mjs', 'combat/render-poses.mjs', 'combat/render-presentation.mjs', 'combat/render-sequences.mjs', 'combat/render-stage-motion.mjs', 'assets/images/cainos-jax-animation-sheet-0.5.0.png', 'assets/images/cainos-pixel-cast-sheet-variants.png', 'combat/data.mjs', 'combat/sprite-catalog.mjs', 'combat/costume-fidelity.mjs', 'tests/combat-render-poses-browser.mjs'];
report.sourceHashes = Object.fromEntries(await Promise.all(files.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));

try {
  for (const phase of ['before', 'after']) {
    const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
    try {
      const page = await browser.newPage({ viewport: { width: 1540, height: 760 }, serviceWorkers: 'block' });
      page.on('pageerror', error => report.errors.push(`${phase}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`${phase}: HTTP ${response.status()} ${response.url()}`); });
      await page.route('**/combat/pose-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#152133}canvas{display:block}</style></head><body><canvas id="fixture"></canvas></body></html>' }));
      if (phase === 'before') await page.route('**/combat/render.mjs', route => route.fulfill({ contentType: 'text/javascript', body: baselineRenderer }));
      await page.goto(`${base}/combat/pose-fixture`);
      await page.evaluate(async phase => {
        const { CombatRenderer, getFrame } = await import('/combat/render.mjs');
        const { FIGHTERS, STAGES, VARIANTS } = await import('/combat/data.mjs');
        const poses = await import('/combat/render-poses.mjs');
        const canvas = document.getElementById('fixture'), renderer = new CombatRenderer(canvas);
        const ready = await renderer.preload(FIGHTERS, []);
        if (!ready.ok) throw new Error(JSON.stringify(ready));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const core = FIGHTERS.filter(f => f.animation), statics = FIGHTERS.filter(f => !f.animation);
        const actor = (f, extra = {}) => ({ f, slot: 0, x: 640, y: 568, face: 1, onGround: true, state: 'idle', hit: 0, flash: 0, buffs: {}, statuses: {}, ...extra });
        const sourceFrame = (f, index) => getFrame(f, ['idle', 'idle', 'walk', 'walk', 'talk', 'talk', 'attack', 'hurt'][index], [0, 24, 0, 8, 0, 10, 0, 0][index], null, index);
        const panel = (height, title, subtitle, width = 1540) => {
          canvas.width = width; canvas.height = height;
          context.fillStyle = '#1c2a40'; context.fillRect(0, 0, canvas.width, canvas.height);
          context.font = 'bold 26px system-ui'; context.fillStyle = '#f5f3ff'; context.textAlign = 'left'; context.fillText(title, 24, 36);
          context.font = '16px system-ui'; context.fillStyle = '#c3d1e3'; context.fillText(subtitle, 24, 62);
        };
        const cell = (f, col, row, caption, extra = {}, options = {}, height = 300) => {
          const left = col * 220, top = 90 + row * height, ground = top + height - 25;
          context.strokeStyle = '#394d66'; context.lineWidth = 1; context.strokeRect(left + 2, top, 216, height - 4);
          const name = f.id === 'abstractedkaufmo' ? 'Kaufmo' : f.id === 'baronmildenhall' ? 'Baron' : f.name;
          context.fillStyle = '#e5eaf5'; context.font = '15px system-ui'; context.textAlign = 'center'; context.fillText(`${name} · ${caption}`, left + 110, top + 23);
          const idle = getFrame(f, 'idle', 0), baseScale = (f.visual.height || 230) / idle.bounds.height;
          const scale = Math.min(0.82, 180 / (idle.bounds.width * baseScale), (height - 60) / f.visual.height);
          context.save(); context.beginPath(); context.rect(left + 3, top + 30, 214, height - 34); context.clip();
          context.translate(left + 110 - 640 * scale, ground - 568 * scale); context.scale(scale, scale);
          renderer.drawActor(actor(f, extra), options.frame ?? 0, options.reducedMotion ?? true, options);
          context.restore();
          context.strokeStyle = '#7897ac'; context.beginPath(); context.moveTo(left + 10, ground); context.lineTo(left + 210, ground); context.stroke();
        };
        window.poseFixture = { phase, canvas, renderer, getFrame, FIGHTERS, STAGES, VARIANTS, poses, core, statics, actor, sourceFrame, context, panel, cell };
      }, phase);

      const shot = async name => {
        const filename = `pose-${name}-${phase}.png`;
        await page.locator('canvas').screenshot({ path: path.join(output, filename) });
        report.screenshots.push(filename);
      };

      const metrics = await page.evaluate(async () => {
        const { phase, canvas, context: ctx, renderer, getFrame, core, FIGHTERS, VARIANTS, STAGES, poses, actor, sourceFrame } = window.poseFixture;
        const result = { frames: [], faceTorsoPreservation: [], states: [], costumes: [], clock: null, cache: null };
        for (const f of core) {
          const image = new Image(); image.src = new URL(f.animation.src, location.href).href; await image.decode();
          const source = document.createElement('canvas'); source.width = image.width; source.height = image.height;
          const sourceCtx = source.getContext('2d', { willReadFrequently: true }); sourceCtx.drawImage(image, 0, 0);
          const raw = sourceCtx.getImageData(0, 0, source.width, source.height).data;
          const idle = sourceFrame(f, 0), p = poses.ANIMATION_REGISTRATION[f.id];
          for (let index = 0; index < 8; index++) {
            const frame = sourceFrame(f, index), pixels = frame.canvas.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
            const originX = (index % 4) * Math.floor(image.width / 4), originY = Math.floor(index / 4) * Math.floor(image.height / 2);
            let opaque = 0, rgbChanges = 0, alphaChanges = 0;
            for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
              const i = (y * frame.width + x) * 4, si = ((originY + frame.y + y) * image.width + originX + frame.x + x) * 4;
              if (pixels[i + 3] >= 12) opaque++;
              if (pixels[i + 3] === 255 && raw[si + 3] === 255 && [0, 1, 2].some(c => pixels[i + c] !== raw[si + c])) rgbChanges++;
              if (raw[si + 3] >= 12 && pixels[i + 3] !== raw[si + 3]) alphaChanges++;
            }
            const geometry = phase === 'after' ? poses.frameGeometry(f, frame, idle, { lean: 0 }) : { scale: f.visual.height / idle.bounds.height, anchor: { x: idle.bounds.x + idle.bounds.width / 2, y: idle.bounds.y + idle.bounds.height }, support: 0 };
            result.frames.push({ id: f.id, index, opaque, rgbChanges, alphaChanges, bounds: frame.bounds, scale: geometry.scale, anchor: geometry.anchor, measuredRoot: p.anchors[index], rootOffsetX: (p.anchors[index].x - geometry.anchor.x) * geometry.scale, floorOffsetY: (frame.bounds.y + frame.bounds.height - geometry.anchor.y) * geometry.scale - geometry.support });
          }
        }
        if (phase === 'after') {
          canvas.width = 700; canvas.height = 650;
          for (const id of ['pomni', 'zooble']) {
            const f = FIGHTERS.find(f => f.id === id), frame = sourceFrame(f, 0), rig = poses.ANIMATION_REGISTRATION[id].crouchRig;
            const native = { ...f, visual: { ...f.visual, height: frame.bounds.height } };
            const a = actor(native, { x: frame.registration.anchor.x, y: frame.registration.anchor.y + 1 });
            const x = frame.x, y = frame.y, width = frame.width, height = rig.cutY - 3 - frame.y;
            ctx.clearRect(0, 0, 700, 650); renderer.drawActor(a, 0, true);
            const upright = ctx.getImageData(x, y, width, height).data;
            ctx.clearRect(0, 0, 700, 650); renderer.drawActor({ ...a, crouch: true, state: 'crouch' }, 0, true);
            const low = ctx.getImageData(x, y + rig.drop, width, height).data;
            const protectedBottom = rig.cutY - 16;
            let changed = 0, opaque = 0, opaqueChanged = 0, protectedChanged = 0, minChangedY = Infinity, maxChangedY = -Infinity;
            for (let i = 0; i < upright.length; i += 4) {
              if (upright[i + 3] >= 12) opaque++;
              if ([0, 1, 2, 3].some(c => upright[i + c] !== low[i + c])) {
                changed++;
                const sourceY = y + Math.floor(i / 4 / width);
                if (upright[i + 3] === 255) opaqueChanged++;
                if (sourceY < protectedBottom) protectedChanged++;
                minChangedY = Math.min(minChangedY, sourceY); maxChangedY = Math.max(maxChangedY, sourceY);
              }
            }
            result.faceTorsoPreservation.push({ id, sourcePixelsCompared: width * height, opaquePixelsCompared: opaque, opaqueChanged, protectedChanged, protectedBottom, jointFringeChanges: changed, jointFringeRows: Number.isFinite(minChangedY) ? [minChangedY, maxChangedY] : [], jointCutY: rig.cutY, nativeDrop: rig.drop, nativeScale: 1 });
          }
          const hash = () => {
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let value = 2166136261;
            for (const p of pixels) value = Math.imul(value ^ p, 16777619);
            return value >>> 0;
          };
          canvas.width = 1280; canvas.height = 720;
          for (const f of FIGHTERS) {
            const variants = [
              ['idle', {}, {}], ['walk', { state: 'walk' }, { frame: 8 }], ['jump', { state: 'jump', onGround: false, y: 480 }, {}],
              ['guard', { state: 'guard', block: true }, {}], ['crouch', { state: 'crouch', crouch: true }, {}], ['hit', { hit: 9 }, {}],
              ['intro', {}, { phase: 'intro' }], ['victory', {}, { phase: 'roundOver', roundWinner: 0 }], ['defeat', {}, { phase: 'matchOver', winner: 1 }],
              ...['windup', 'active', 'recovery'].map((name, i) => [name, { attack: { name: 'heavy', def: f.moves.heavy, t: [f.moves.heavy.startup - 1, f.moves.heavy.startup, f.moves.heavy.startup + f.moves.heavy.active + f.moves.heavy.recovery - 1][i] } }, {}]),
            ];
            const row = { id: f.id, hashes: {}, deterministic: true, unchanged: true, crouchArticulated: false };
            for (const [name, extra, options] of variants) {
              const a = actor(f, extra), before = JSON.stringify(a);
              ctx.clearRect(0, 0, 1280, 720); renderer.drawActor(a, 0, true, options); const first = hash();
              ctx.clearRect(0, 0, 1280, 720); renderer.drawActor(a, 900, true, { ...options, presentationFrame: 900 }); const last = hash();
              row.hashes[name] = first; row.deterministic &&= first === last; row.unchanged &&= JSON.stringify(a) === before;
            }
            row.crouchArticulated = !!poses.crouchParts(f, getFrame(f, 'idle', 0));
            result.states.push(row);
          }
          const costumes = VARIANTS.map(v => { const base = FIGHTERS.find(f => f.id === v.baseFighterId); return { ...base, sprite: v.sprite, animation: null, costume: v.id }; });
          const ready = await renderer.preload(costumes);
          if (!ready.ok) throw new Error(JSON.stringify(ready));
          for (const f of costumes) {
            const frame = getFrame(f, 'idle', 0), a = actor(f, { crouch: true, state: 'crouch' });
            const before = JSON.stringify(a);
            ctx.clearRect(0, 0, 1280, 720); renderer.drawActor(a, 0, true);
            result.costumes.push({ id: f.costume, frame: !!frame, articulated: !!poses.crouchParts(f, frame), unchanged: JSON.stringify(a) === before });
          }
          // Keep the cache contract on the historical atlas that actually needs
          // matte removal and a palette correction. Its 0.6 replacement already
          // has native alpha and red ribbons, so those operations are no-ops.
          const { SPRITE_CATALOG } = await import('/combat/sprite-catalog.mjs');
          const historical = SPRITE_CATALOG.find(f => f.id === 'gangletragedy');
          const costume = { ...costumes.find(f => f.costume === 'gangletragedy'), sprite: {
            ...historical.sprite,
            sourceRect: { x: 450, y: 340, width: 245, height: 285 },
            paletteSwap: 'gangle-red-ribbons',
          } };
          const cacheReady = await renderer.preload([costume]);
          if (!cacheReady.ok) throw new Error(JSON.stringify(cacheReady));
          result.cacheFixture = { id: historical.id, source: costume.sprite.src, sourceRect: costume.sprite.sourceRect, paletteSwap: costume.sprite.paletteSwap, scope: 'Historical atlas fixture, not the current 0.6 costume artwork.' };
          const original = getFrame(costume);
          const modified = patch => getFrame({ ...costume, sprite: { ...costume.sprite, ...patch } });
          const plain = modified({ paletteSwap: undefined }), preserved = modified({ matteMode: 'preserve-source' });
          const cropped = modified({ sourceRect: { ...costume.sprite.sourceRect, width: costume.sprite.sourceRect.width - 1 } });
          const tolerant = modified({ matteTolerance: 1 });
          const spriteHash = frame => {
            const pixels = frame.canvas.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
            let value = 2166136261;
            for (const p of pixels) value = Math.imul(value ^ p, 16777619);
            return value >>> 0;
          };
          result.cache = {
            sourceRectSeparated: cropped !== original,
            matteModeSeparated: preserved !== original && spriteHash(preserved) !== spriteHash(original),
            paletteSeparated: plain !== original && spriteHash(plain) !== spriteHash(original),
            toleranceSeparated: tolerant !== original,
            originalStable: getFrame(costume) === original,
          };
          const f = FIGHTERS[0], a = actor(f), calls = [];
          const saved = Object.fromEntries(['drawActor', 'drawProjectile', 'drawTrap'].map(key => [key, renderer[key]]));
          renderer.drawActor = (value, tick, reduced, options) => calls.push({ method: 'actor', tick, presentationFrame: options.presentationFrame });
          renderer.drawProjectile = (value, actors, tick) => calls.push({ method: 'projectile', tick });
          renderer.drawTrap = (value, actors, tick) => calls.push({ method: 'trap', tick });
          const state = { frame: 240, phase: 'roundOver', roundWinner: 0, stage: STAGES[0], fighters: [a], traps: [{}], projectiles: [{}], fx: [] };
          const before = JSON.stringify(state);
          renderer.render(state, { presentationFrame: 288 });
          Object.assign(renderer, saved);
          result.clock = { calls, unchanged: JSON.stringify(state) === before };
        }
        return result;
      });
      report.measurements[phase] = metrics;

      await page.evaluate(() => {
        const { core, context: ctx, panel, sourceFrame, poses, phase } = window.poseFixture;
        panel(2010, 'Les 56 cellules existantes · ancrages et échelle', `${phase === 'before' ? '0.3 publiée' : '0.5 · racines mesurées'} — même échelle uniforme par personnage ; sources actuelles conservées pendant le rendu`, 1820);
        for (const [col, f] of core.entries()) {
          const idle = sourceFrame(f, 0), scale = Math.min(0.44, 185 / idle.bounds.height);
          for (let index = 0; index < 8; index++) {
            const frame = sourceFrame(f, index), root = phase === 'after' ? frame.registration.anchor : { x: idle.bounds.x + idle.bounds.width / 2, y: idle.bounds.y + idle.bounds.height };
            const left = col * 260, top = 90 + index * 240, baseline = top + 215;
            ctx.strokeStyle = '#3d5069'; ctx.strokeRect(left + 2, top, 256, 236);
            ctx.fillStyle = '#e7ebf5'; ctx.font = '14px system-ui'; ctx.textAlign = 'center'; ctx.fillText(`${f.name} · cellule ${index}`, left + 130, top + 20);
            ctx.strokeStyle = '#779bb3'; ctx.beginPath(); ctx.moveTo(left + 10, baseline); ctx.lineTo(left + 250, baseline); ctx.stroke();
            ctx.save(); ctx.beginPath(); ctx.rect(left + 3, top + 28, 254, 207); ctx.clip(); ctx.translate(left + 130, baseline); ctx.scale(scale, scale); ctx.translate(-root.x, -root.y); ctx.imageSmoothingEnabled = false; ctx.drawImage(frame.canvas, frame.x, frame.y); ctx.restore();
            ctx.fillStyle = '#f7c77b'; ctx.fillRect(left + 129, baseline - 4, 2, 8);
          }
        }
      });
      await shot('source-registration');

      await page.evaluate(() => {
        const { panel, core, cell, phase } = window.poseFixture;
        panel(710, 'Debout / posture basse · mêmes dessins', `${phase === 'before' ? '0.3 · écrasement vertical global' : '0.5 · deux gardes basses rigides, autres dessins intacts'} — pas de pose dessinée dédiée ni de correspondance avec la hitbox`);
        for (const [i, f] of core.entries()) { cell(f, i, 0, 'debout'); cell(f, i, 1, 'bas', { crouch: true, state: 'crouch' }); }
      });
      await shot('crouch');

      await page.evaluate(() => {
        const { panel, core, cell, phase } = window.poseFixture;
        panel(1010, 'Introduction / victoire / défaite', `${phase === 'before' ? '0.3 · état ignoré par le rendu' : '0.5 · cellules de parole et réaction réutilisées'} — présentation du jeu, pas animations canoniques inédites`);
        for (const [i, f] of core.entries()) {
          cell(f, i, 0, 'intro', {}, { phase: 'intro', presentationFrame: 40 });
          cell(f, i, 1, 'victoire', {}, { phase: 'roundOver', roundWinner: 0, presentationFrame: 80 });
          cell(f, i, 2, 'défaite', {}, { phase: 'matchOver', winner: 1 });
        }
      });
      await shot('outcomes');

      await page.evaluate(() => {
        const { panel, core, cell, phase } = window.poseFixture;
        panel(1310, 'Attaques · préparation / contact / retour / projectile', `${phase === 'before' ? '0.3 · cellule interaction unique' : '0.5 · sélection de cellules selon la phase et le geste disponible'} — délais, dégâts et hitboxes inchangés`);
        for (const [i, f] of core.entries()) {
          const def = f.moves.heavy;
          for (const [j, t] of [def.startup - 1, def.startup, def.startup + def.active + def.recovery - 1].entries()) cell(f, i, j, ['prépare', 'contact', 'retour'][j], { attack: { name: 'heavy', def, t } });
          cell(f, i, 3, 'projectile', { attack: { name: 'special', def: f.moves.special, t: f.moves.special.startup } });
        }
      });
      await shot('attack-phases');

      if (phase === 'after') {
        await page.evaluate(() => {
          const { panel, statics, cell } = window.poseFixture;
          panel(1310, 'Autres morphologies · dessin intact', 'Debout / bas / garde / défaite — transformations rigides et signal de posture ; aucun découpage de membres sur ces sources');
          for (const [i, f] of statics.entries()) {
            cell(f, i, 0, 'debout'); cell(f, i, 1, 'bas', { state: 'crouch', crouch: true });
            cell(f, i, 2, 'garde', { state: 'guard', block: true }); cell(f, i, 3, 'défaite', {}, { phase: 'matchOver', winner: 1 });
          }
        });
        await shot('static-states');
        await page.evaluate(() => {
          const { panel, core, cell } = window.poseFixture;
          panel(1010, 'Garde / saut / réaction', 'Cellule de base pour la garde, marche pour le saut, réaction existante pour le choc — tous les états restent lisibles en mouvement réduit');
          for (const [i, f] of core.entries()) {
            cell(f, i, 0, 'garde', { state: 'guard', block: true });
            cell(f, i, 1, 'saut', { state: 'jump', onGround: false, y: 535 });
            cell(f, i, 2, 'choc', { hit: 9 });
          }
        });
        await shot('combat-states');
      }
    } finally { await browser.close(); }
  }

  const before = report.measurements.before, after = report.measurements.after;
  assert.equal(after.frames.length, 56);
  assert.ok(after.frames.every(f => f.rgbChanges === 0 && f.alphaChanges === 0));
  checked('Les 56 cellules extraites conservent leurs couleurs opaques et leur alpha source', 'Les deux cellules de marche Gangle utilisent leurs rectangles source corrigés ; aucune peinture ou recoloration des feuilles animées.');
  assert.ok(after.frames.every(f => Math.abs(f.rootOffsetX) < 1e-8 && Math.abs(f.floorOffsetY) < 1e-8));
  checked('56 racines et contacts au sol enregistrés sans changement d’échelle par frame', 'Échelle fixée par idle0 ; racine horizontale propre à chaque cellule, accessoire de Caine exclu du choix de la racine.');
  for (const id of new Set(after.frames.map(f => f.id))) assert.equal(new Set(after.frames.filter(f => f.id === id).map(f => f.scale)).size, 1);
  const jaxBefore = before.frames.filter(f => f.id === 'jax' && f.index < 2);
  assert.ok(Math.abs(jaxBefore[1].rootOffsetX - jaxBefore[0].rootOffsetX) > 30);
  checked('Le saut horizontal artificiel entre les deux idle de Jax est supprimé', { beforePixels: Math.abs(jaxBefore[1].rootOffsetX - jaxBefore[0].rootOffsetX), afterPixels: 0, nativeSourceDifference: Math.abs(after.frames.find(f => f.id === 'jax' && f.index === 0).measuredRoot.x - after.frames.find(f => f.id === 'jax' && f.index === 1).measuredRoot.x) });
  const gangle = (data, index) => data.frames.find(f => f.id === 'gangle' && f.index === index).opaque;
  assert.ok(gangle(after, 2) < gangle(before, 2)); assert.ok(gangle(after, 3) > gangle(before, 3));
  checked('Le ruban traversant la grille appartient à Gangle walk3, sans fragment dans walk2', { walk2Before: gangle(before, 2), walk2After: gangle(after, 2), walk3Before: gangle(before, 3), walk3After: gangle(after, 3) });
  assert.equal(after.faceTorsoPreservation.length, 2);
  assert.ok(after.faceTorsoPreservation.every(item => item.protectedChanged === 0 && item.opaqueChanged === 0 && item.opaquePixelsCompared > 10000));
  checked('Visage et haut du torse préservés en RGBA ; aucun pixel opaque du torse modifié', { measurements: after.faceTorsoPreservation, scope: 'RGBA exact avant la bande des 16 px de jonction aux hanches. Les franges alpha de cette jonction peuvent se superposer aux jambes rigides ; elles sont comptées séparément.' });
  assert.equal(after.states.length, 14);
  assert.ok(after.states.every(f => f.deterministic && f.unchanged && f.hashes.idle !== f.hashes.crouch && f.hashes.idle !== f.hashes.guard));
  assert.equal(after.states.filter(f => f.crouchArticulated).length, 2);
  checked('14 bases × 12 états rendus sans mutation et avec lecture de posture en mouvement réduit', 'Les boucles de présentation sont figées ; bas et garde restent distincts de idle pour les quatorze morphologies.');
  assert.equal(after.costumes.length, 51);
  assert.ok(after.costumes.every(c => c.frame && !c.articulated && c.unchanged));
  checked('Les 51 tenues passent par le dessin intact et ne reçoivent jamais un rig de base', 'Le rendu bas de toutes les tenues est exécuté ; cadres et palette sont couverts par la suite dédiée des tenues.');
  assert.ok(Object.values(after.cache).every(Boolean));
  checked('Recadrage, matte, tolérance et palette possèdent des entrées de cache distinctes', { fixture: after.cacheFixture, checks: after.cache });
  assert.ok(after.clock.unchanged);
  assert.deepEqual(after.clock.calls.map(c => [c.method, c.tick]), [['trap', 240], ['actor', 240], ['projectile', 240]]);
  assert.equal(after.clock.calls.find(c => c.method === 'actor').presentationFrame, 288);
  checked('L’horloge de fin de round anime les poses sans faire avancer objets ni simulation', after.clock);
  assert.deepEqual(report.errors, []);
  checked('Aucune erreur Canvas, JavaScript ou ressource locale dans les fixtures', `${report.screenshots.length} captures enregistrées pour inspection visuelle.`);
  report.ok = true;
} catch (error) {
  report.ok = false; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1;
} finally {
  await fs.writeFile(path.join(output, 'render-poses-browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

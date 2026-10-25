/** Canvas fixtures: scenery, layering and floor invariants; no played-duel or global 1:1 claim. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4182';
const baseline = process.env.COMBAT_STAGE_BASELINE || '4a56f63';
const output = path.resolve('audit-combat/stages-0.6.0');
const sha = value => createHash('sha256').update(value).digest('hex');
const sourceFiles = ['combat/render.mjs', 'combat/render-stage-scenery.mjs', 'combat/render-stage-motion.mjs', 'combat/render-poses.mjs', 'combat/render-sequences.mjs', 'combat/data.mjs', 'combat/engine.mjs', 'tests/combat-stage-scenery-browser.mjs'];
const hashes = async () => Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, sha(await fs.readFile(file))])));
const report = { createdAt: new Date().toISOString(), fixture: 'Static Canvas scenery and foreground fixtures; not played matches or canonical certification.', baseline, sourceHashes: await hashes(), checks: [], screenshots: [], measurements: {}, errors: [], limitations: ['Three arena drawings are side-view recompositions; their dimensions, door order and readable menu labels are adaptations.', 'Resident hallway copies were inspected on third-party hosts; the official episode stream did not deliver viewable frames in this environment.', 'Manor, canyon road, grounds and Gloink nest retain their earlier scoped drawings. Lake has no primary visual reference; training is original.'] };
const check = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
const { stdout: baselineRenderer } = await promisify(execFile)('git', ['show', `${baseline}:combat/render.mjs`], { maxBuffer: 2_000_000 });
report.baselineRendererSHA256 = sha(baselineRenderer);
const { stdout: baselineEngine } = await promisify(execFile)('git', ['show', `${baseline}:combat/engine.mjs`], { maxBuffer: 2_000_000 });
await fs.mkdir(output, { recursive: true });
let browser;
try {
  const captured = {};
  for (const phase of ['before', 'after']) {
    browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(`${phase}: ${error.message}`));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`HTTP ${response.status()} ${response.url()}`); });
    await page.route('**/combat/stage-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#142033}canvas{display:block}</style></head><body><canvas></canvas></body></html>' }));
    if (phase === 'before') await page.route('**/combat/render.mjs', route => route.fulfill({ contentType: 'text/javascript', body: baselineRenderer }));
    await page.goto(`${base}/combat/stage-fixture`);
    const metrics = await page.evaluate(async phase => {
      const { CombatRenderer } = await import('/combat/render.mjs');
      const { STAGES, FIGHTERS } = await import('/combat/data.mjs');
      const canvas = document.querySelector('canvas'), renderer = new CombatRenderer(canvas), ctx = canvas.getContext('2d', { willReadFrequently: true });
      const ready = await renderer.preload([FIGHTERS.find(f => f.id === 'pomni'), FIGHTERS.find(f => f.id === 'jax')], STAGES);
      if (!ready.ok) throw new Error(JSON.stringify(ready));
      const pixels = (y = 0, h = 720) => ctx.getImageData(0, y, 1280, h).data;
      const hash = values => { let h = 2166136261; for (const value of values) h = Math.imul(h ^ value, 16777619); return h >>> 0; };
      const same = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
      const stages = [];
      for (const stage of STAGES) {
        ctx.clearRect(0, 0, 1280, 720); ctx.drawImage(renderer.background(stage), 0, 0);
        const staticPixels = pixels(), floor = pixels(568, 152), before = JSON.stringify(stage);
        let opaque = 0; for (let index = 3; index < staticPixels.length; index += 4) if (staticPixels[index] === 255) opaque++;
        const state = { frame: 45, phase: 'fight', stage, fighters: [], traps: [], projectiles: [], fx: [] };
        renderer.render(state, { ambientFrame: 0 }); const first = pixels(), firstFloor = pixels(568, 152);
        renderer.render(state, { ambientFrame: 123 }); const later = pixels(), laterFloor = pixels(568, 152);
        renderer.render(state, { ambientFrame: 0, reducedMotion: true }); const reduced = pixels();
        renderer.render(state, { ambientFrame: 8000, reducedMotion: true }); const reducedLater = pixels();
        stages.push({ id: stage.id, staticHash: hash(staticPixels), opaquePixels: opaque, animated: !same(first, later), floorStable: same(floor, firstFloor) && same(floor, laterFloor), reducedStable: same(reduced, reducedLater), stageUnchanged: before === JSON.stringify(stage), cacheReused: renderer.background(stage) === renderer.background(stage), width: renderer.background(stage).width, height: renderer.background(stage).height });
      }
      window.stageFixture = { renderer, canvas, ctx, STAGES, FIGHTERS, same, hash };
      return { stages, phase };
    }, phase);
    report.measurements[phase] = metrics;
    captured[phase] = {};
    for (const id of ['backstage', 'spudsy', 'kingdom']) {
      const data = await page.evaluate(id => {
        const { renderer, canvas, ctx, STAGES } = window.stageFixture;
        ctx.clearRect(0, 0, 1280, 720); ctx.drawImage(renderer.background(STAGES.find(s => s.id === id)), 0, 0);
        return canvas.toDataURL();
      }, id);
      captured[phase][id] = data;
      const filename = `${id}-${phase}.png`;
      await fs.writeFile(path.join(output, filename), Buffer.from(data.split(',')[1], 'base64'));
      report.screenshots.push(filename);
    }
    if (phase === 'after') {
      report.measurements.invariants = await page.evaluate(async () => {
        const { drawStageScenery, REVIEWED_SCENERY_IDS } = await import('/combat/render-stage-scenery.mjs');
        const { renderer, canvas, ctx, STAGES, FIGHTERS, same } = window.stageFixture;
        const clip = [], actors = [];
        for (const id of REVIEWED_SCENERY_IDS) {
          ctx.save(); ctx.fillStyle = '#17a6cf'; ctx.fillRect(0, 0, 1280, 720);
          const floor = ctx.getImageData(0, 568, 1280, 152).data;
          ctx.globalAlpha = 0.65; ctx.lineWidth = 9; ctx.fillStyle = '#123456'; ctx.translate(11, 0);
          const beforeTransform = [...Object.values(ctx.getTransform().toJSON())];
          drawStageScenery(ctx, id);
          clip.push({ id, floorIntact: same(floor, ctx.getImageData(0, 568, 1280, 152).data), stateRestored: ctx.globalAlpha === 0.65 && ctx.lineWidth === 9 && ctx.fillStyle === '#123456' && JSON.stringify(beforeTransform) === JSON.stringify([...Object.values(ctx.getTransform().toJSON())]) });
          ctx.restore();
          const actor = { f: FIGHTERS.find(f => f.id === 'pomni'), slot: 0, x: 425, y: 568, face: 1, onGround: true, state: 'idle', hit: 0, flash: 0, buffs: {}, statuses: {} };
          const stage = STAGES.find(s => s.id === id), state = { frame: 45, phase: 'fight', stage, fighters: [actor], traps: [], projectiles: [], fx: [] }, previous = JSON.stringify(state);
          ctx.clearRect(0, 0, 1280, 720); renderer.drawActor(actor, 45, true, { phase: 'fight', presentationFrame: 0 });
          const sprite = ctx.getImageData(0, 0, 1280, 720).data;
          renderer.render(state, { ambientFrame: 0, reducedMotion: true });
          const result = ctx.getImageData(0, 0, 1280, 720).data;
          let samples = 0, mismatches = 0;
          for (let i = 3; i < sprite.length; i += 4) if (sprite[i] === 255) {
            samples++; if (sprite[i - 1] !== result[i - 1] || sprite[i - 2] !== result[i - 2] || sprite[i - 3] !== result[i - 3]) mismatches++;
          }
          actors.push({ id, opaqueSamples: samples, mismatches, stateUnchanged: previous === JSON.stringify(state) });
        }
        return { clip, actors };
      });
      await page.evaluate(() => {
        const { renderer, ctx, STAGES, FIGHTERS } = window.stageFixture;
        const stage = STAGES.find(s => s.id === 'backstage');
        const actors = ['pomni', 'jax'].map((id, slot) => ({ f: FIGHTERS.find(f => f.id === id), slot, x: slot ? 855 : 425, y: 568, face: slot ? -1 : 1, onGround: true, state: 'idle', hit: 0, flash: 0, buffs: {}, statuses: {} }));
        renderer.render({ frame: 45, phase: 'fight', stage, fighters: actors, traps: [], projectiles: [], fx: [] }, { reducedMotion: true });
        ctx.fillStyle = '#142033d9'; ctx.fillRect(0, 0, 1280, 43); ctx.fillStyle = '#ffedca'; ctx.font = 'bold 18px system-ui'; ctx.fillText('Couloir des résidents · recomposition 0.6.0 · plan de combat inchangé à y = 568', 24, 28);
      });
      await page.screenshot({ path: path.join(output, 'backstage-actors.png') }); report.screenshots.push('backstage-actors.png');
      await page.evaluate(async captured => {
        const { canvas, ctx } = window.stageFixture;
        canvas.width = 1280; canvas.height = 1240;
        ctx.fillStyle = '#142033'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff0d5'; ctx.textAlign = 'left'; ctx.font = 'bold 24px system-ui'; ctx.fillText('Trois décors reconstruits · comparaison du fond statique', 22, 36);
        ctx.fillStyle = '#c5d5e2'; ctx.font = '16px system-ui'; ctx.fillText('0.5.0 — publié', 22, 65); ctx.fillText('0.6.0 — recomposition Canvas', 662, 65);
        const titles = { backstage: 'Couloir résident · comparaison de copies du pilote encore à confirmer', spudsy: 'Spudsy · cuisine ouverte et comptoir depuis une vignette officielle Netflix', kingdom: 'Cour Candy · arcades et glaçage depuis la galerie officielle GLITCH' };
        for (const [index, id] of ['backstage', 'spudsy', 'kingdom'].entries()) {
          for (const [side, phase] of ['before', 'after'].entries()) { const img = new Image(); img.src = captured[phase][id]; await img.decode(); ctx.drawImage(img, side * 640, 80 + index * 386, 640, 360); }
          ctx.fillStyle = '#d8e6ef'; ctx.font = '15px system-ui'; ctx.fillText(titles[id], 18, 462 + index * 386);
        }
      }, captured);
      await page.locator('canvas').screenshot({ path: path.join(output, 'encore-stage-comparison-0.6.0.png') }); report.screenshots.push('encore-stage-comparison-0.6.0.png');
      await page.evaluate(() => {
        const { canvas, ctx, renderer, STAGES } = window.stageFixture;
        canvas.width = 1344; canvas.height = 1196;
        ctx.fillStyle = '#142033'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#fff0d5'; ctx.font = 'bold 24px system-ui'; ctx.textAlign = 'left'; ctx.fillText('12 arènes · 3 décors reconstruits, fidélité documentée par scène', 20, 36);
        STAGES.forEach((stage, index) => {
          const x = index % 3 * 448, y = 65 + Math.floor(index / 3) * 282;
          ctx.drawImage(renderer.background(stage), x, y, 448, 252); ctx.fillStyle = '#dce8f4'; ctx.font = '15px system-ui'; ctx.fillText(stage.name, x + 12, y + 273);
        });
      });
      await page.locator('canvas').screenshot({ path: path.join(output, 'encore-stages-0.6.0.png') }); report.screenshots.push('encore-stages-0.6.0.png');
    }
    await browser.close(); browser = null;
  }
  const before = report.measurements.before.stages, after = report.measurements.after.stages, ids = ['backstage', 'spudsy', 'kingdom'];
  assert.equal(after.length, 12); assert.ok(after.every(s => s.opaquePixels === 1280 * 720 && s.width === 1280 && s.height === 720));
  check('Les 12 fonds Canvas restent opaques et complets en 1280 × 720', 'Aucun trou transparent ni chargement de décor bitmap supplémentaire.');
  assert.ok(after.filter(s => ids.includes(s.id)).every(s => s.staticHash !== before.find(b => b.id === s.id).staticHash));
  check('Les trois arènes annoncées possèdent un fond distinct du rendu publié 0.5.0', 'Comparaison des pixels couloir, Spudsy et cour Candy ; six captures statiques avant/après.');
  assert.ok(after.filter(s => !ids.includes(s.id)).every(s => s.staticHash === before.find(b => b.id === s.id).staticHash));
  check('Les neuf autres fonds statiques conservent exactement leurs pixels', 'Inclut les repères déjà observés de la piste, du cellier et du Vide.');
  assert.ok(report.measurements.invariants.clip.every(s => s.floorIntact && s.stateRestored));
  check('Les nouveaux peintres sont strictement coupés à y568 et restaurent le contexte Canvas', 'Pixels sentinelles du sol, transformation, opacité, couleur et largeur de trait vérifiés.');
  assert.ok(after.every(s => s.animated && s.floorStable));
  check('Les 12 ambiances restent animées au-dessus du sol sans toucher la piste', 'Comparaison directe des octets RGBA à 0 et 123 images, dont y568–719.');
  assert.ok(after.every(s => s.reducedStable && s.stageUnchanged && s.cacheReused));
  check('Mouvement réduit, cache des fonds et arènes préservent leurs invariants', 'Canvas stable à 0 et 8000 images ; mêmes objets du cache et états d’entrée inchangés.');
  assert.ok(report.measurements.invariants.actors.every(s => s.opaqueSamples > 1000 && s.mismatches === 0 && s.stateUnchanged));
  check('Les combattants restent dessinés devant les trois nouveaux décors', 'Chaque pixel opaque de Pomni est retrouvé intact dans la composition finale, sans mutation de simulation.');
  assert.equal(sha(baselineEngine), report.sourceHashes['combat/engine.mjs']);
  check('Le moteur de combat demeure identique au moteur 0.5.0 publié', 'SHA-256 du fichier engine.mjs comparé à la révision de référence.');
  report.sourceHashesAfter = await hashes(); assert.deepEqual(report.sourceHashesAfter, report.sourceHashes);
  assert.deepEqual(report.errors, []);
  check('Aucune source n’a changé pendant les contrôles et aucune erreur locale n’a été observée', 'Empreintes avant/après concordantes ; aucune erreur JavaScript ou ressource HTTP.');
  report.screenshotHashes = Object.fromEntries(await Promise.all(report.screenshots.map(async file => [file, sha(await fs.readFile(path.join(output, file)))])));
  report.ok = true;
} catch (error) { report.ok = false; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  await fs.writeFile(path.join(output, 'stage-scenery-browser-report.json'), JSON.stringify(report, null, 2) + '\n');
}

/** Native Canvas presentation fixtures; not a played duel or canonical-art certification. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const report = { createdAt: new Date().toISOString(), fixture: 'Native Canvas procedural presentations and ambient layers, independent from gameplay simulation.', checks: [], screenshots: [], measurements: {}, errors: [], limitations: ['Existing illustrated cells receive finite rigid motion. Dedicated authored combat and outcome animation remains partial.', 'Stage layers are an original fan-game adaptation, not canonical video or a 1:1 art certification.'] };
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
const files = ['combat/render.mjs', 'combat/render-poses.mjs', 'combat/render-sequences.mjs', 'combat/render-stage-motion.mjs', 'combat/data.mjs', 'assets/images/cainos-jax-animation-sheet-0.5.0.png', 'tests/combat-render-sequences-browser.mjs'];
report.sourceHashes = Object.fromEntries(await Promise.all(files.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
let browser;
try {
  browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 }, serviceWorkers: 'block' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`HTTP ${response.status()} ${response.url()}`); });
  await page.route('**/combat/sequence-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#142033}canvas{display:block}</style></head><body><canvas id="fixture"></canvas></body></html>' }));
  await page.goto(`${base}/combat/sequence-fixture`);
  const measurements = await page.evaluate(async () => {
    const { CombatRenderer } = await import('/combat/render.mjs');
    const { FIGHTERS, STAGES } = await import('/combat/data.mjs');
    const { FIGHTER_SEQUENCES, SEQUENCE_EVENTS, sequencePose } = await import('/combat/render-sequences.mjs');
    const canvas = document.getElementById('fixture'), renderer = new CombatRenderer(canvas), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const loaded = await renderer.preload(FIGHTERS, STAGES);
    const hash = (y = 0, h = canvas.height, x = 0, w = canvas.width) => {
      const pixels = ctx.getImageData(x, y, w, h).data; let value = 2166136261;
      for (const byte of pixels) value = Math.imul(value ^ byte, 16777619);
      return value >>> 0;
    };
    const actor = f => ({ f, slot: 0, x: 640, y: 568, face: 1, onGround: true, state: 'idle', hit: 0, flash: 0, buffs: {}, statuses: {} });
    const options = (event, tick, reducedMotion = false) => ({ phase: event === 'intro' ? 'intro' : event.startsWith('round') ? 'roundOver' : 'matchOver', winner: event.endsWith('Defeat') ? 1 : 0, roundWinner: event.endsWith('Defeat') ? 1 : 0, presentationFrame: tick, reducedMotion });
    const drawActor = (a, event, tick, reducedMotion = false) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderer.drawActor(a, 4000, reducedMotion, options(event, tick, reducedMotion));
      return hash(50, 550, 290, 700);
    };
    const results = { loaded, sequences: [], stages: [], draws: [], unchanged: true };
    for (const f of FIGHTERS) {
      const a = actor(f), before = JSON.stringify(a);
      for (const event of SEQUENCE_EVENTS) {
        const spec = FIGHTER_SEQUENCES[f.id][event];
        const first = drawActor(a, event, 0), middle = drawActor(a, event, spec.keys[1].at), settled = drawActor(a, event, spec.duration), later = drawActor(a, event, spec.duration + 600);
        const reducedStart = drawActor(a, event, 0, true), reducedLater = drawActor(a, event, 600, true);
        results.sequences.push({ id: spec.id, first, middle, settled, later, reducedStart, reducedLater, duration: spec.duration });
      }
      const draw = tick => { ctx.clearRect(0, 0, 1280, 720); renderer.drawActor(a, 4000, false, { phase: 'matchOver', winner: -1, presentationFrame: tick }); return hash(50, 550, 290, 700); };
      results.draws.push({ id: f.id, first: draw(0), later: draw(500), neutral: !sequencePose(f.id, 'draw', 0) });
      results.unchanged &&= before === JSON.stringify(a);
    }
    for (const stage of STAGES) {
      const state = { frame: 100, phase: 'fight', stage, fighters: [], traps: [], projectiles: [], fx: [] }, before = JSON.stringify(state);
      renderer.render(state, { ambientFrame: 0 }); const first = hash(0, 568), floor = hash(568, 152);
      renderer.render(state, { ambientFrame: 123 }); const later = hash(0, 568), floorLater = hash(568, 152);
      renderer.render(state, { ambientFrame: 0, reducedMotion: true }); const fixed = hash();
      renderer.render(state, { ambientFrame: 123, reducedMotion: true }); const fixedLater = hash();
      ctx.clearRect(0, 0, 1280, 720); ctx.drawImage(renderer.background(stage), 0, 0); const baselineFloor = hash(568, 152);
      results.stages.push({ id: stage.id, first, later, floor, floorLater, baselineFloor, fixed, fixedLater, unchanged: before === JSON.stringify(state) });
    }
    window.sequenceFixture = { canvas, ctx, renderer, FIGHTERS, STAGES, FIGHTER_SEQUENCES, SEQUENCE_EVENTS, actor, options };
    return results;
  });
  report.measurements = measurements;
  assert.equal(measurements.loaded.ok, true); assert.equal(measurements.sequences.length, 70);
  checked('Les 14 bases chargent leurs images et exécutent les 70 présentations', '14 combattants × introduction, victoire/défaite de round et victoire/défaite finale.');
  assert.ok(measurements.sequences.every(row => row.first !== row.middle));
  checked('Chaque séquence produit un mouvement Canvas visible avec une horloge de simulation figée', 'Pixels comparés à la première image et au premier temps fort ; simulation fixe à 4000.');
  assert.ok(measurements.sequences.every(row => row.settled === row.later));
  checked('Les 70 séquences se stabilisent exactement à leur durée prévue', 'Égalité des pixels à la fin puis 600 images plus tard ; aucune boucle de fin infinie.');
  assert.ok(measurements.sequences.every(row => row.reducedStart === row.reducedLater && row.reducedStart === row.settled));
  checked('Le mouvement réduit fige les 70 séquences sur leur présentation finale', 'Comparaison Canvas à 0 et 600 images ; état identique au dernier dessin normal.');
  assert.ok(measurements.draws.every(row => row.first === row.later && row.neutral));
  checked('Une égalité garde les 14 combattants dans une pose neutre stable', 'Aucune séquence de victoire ou de défaite attribuée à une égalité.');
  assert.equal(measurements.stages.length, 12); assert.ok(measurements.stages.every(row => row.first !== row.later && row.floor === row.floorLater && row.floor === row.baselineFloor));
  checked('Les 12 arènes s’animent au-dessus du sol sans modifier les pixels de la piste', 'Couche d’ambiance à 0/123 images ; égalité RGBA du sol y568–719 avec le fond statique.');
  assert.ok(measurements.unchanged && measurements.stages.every(row => row.unchanged && row.fixed === row.fixedLater));
  checked('Rendu sans mutation des acteurs et des arènes, ambiances figées en mouvement réduit', 'Instantanés avant/après strictement égaux ; Canvas complet identique en mouvement réduit.');

  await page.evaluate(() => {
    const { canvas, ctx, renderer, FIGHTERS, FIGHTER_SEQUENCES, SEQUENCE_EVENTS, actor, options } = window.sequenceFixture;
    canvas.width = 1820; canvas.height = 2090;
    ctx.fillStyle = '#142033'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f5eddf'; ctx.font = 'bold 27px system-ui'; ctx.fillText('70 séquences · illustrations existantes, mouvement procédural', 20, 38);
    ctx.fillStyle = '#becadb'; ctx.font = '17px system-ui'; ctx.fillText('Introduction / résultats de round / résultats de match. Dessins de combat dédiés encore à produire.', 20, 67);
    FIGHTERS.forEach((f, index) => SEQUENCE_EVENTS.forEach((event, row) => {
      const left = index % 7 * 260, top = 90 + (Math.floor(index / 7) * 5 + row) * 200, ground = top + 181;
      ctx.strokeStyle = '#3b506a'; ctx.strokeRect(left + 2, top, 256, 196);
      ctx.fillStyle = '#e7eaf5'; ctx.font = '13px system-ui'; ctx.textAlign = 'center'; ctx.fillText(`${f.name} · ${event}`, left + 130, top + 21);
      const idle = renderer.getFrame(f, 'idle', 0), height = f.visual?.height || 230;
      const scale = Math.min(0.55, 190 / (idle.bounds.width * height / idle.bounds.height), 149 / height);
      ctx.save(); ctx.beginPath(); ctx.rect(left + 3, top + 28, 254, 166); ctx.clip(); ctx.translate(left + 130 - 640 * scale, ground - 568 * scale); ctx.scale(scale, scale);
      renderer.drawActor(actor(f), 4000, false, options(event, FIGHTER_SEQUENCES[f.id][event].keys[1].at)); ctx.restore();
      ctx.strokeStyle = '#8098ad'; ctx.beginPath(); ctx.moveTo(left + 15, ground); ctx.lineTo(left + 245, ground); ctx.stroke();
    }));
  });
  await page.locator('canvas').screenshot({ path: path.join(output, 'encore-outcome-sequences.png') }); report.screenshots.push('encore-outcome-sequences.png');
  await page.evaluate(() => {
    const { canvas, ctx, renderer, STAGES } = window.sequenceFixture;
    const tile = document.createElement('canvas'); tile.width = 1280; tile.height = 720;
    const previous = renderer.ctx; renderer.ctx = tile.getContext('2d');
    canvas.width = 1344; canvas.height = 1196;
    ctx.fillStyle = '#142033'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#f5eddf'; ctx.font = 'bold 25px system-ui'; ctx.textAlign = 'left'; ctx.fillText('12 arènes · ambiances derrière les combattants, sol inchangé', 20, 36);
    STAGES.forEach((stage, index) => {
      renderer.render({ frame: 100, phase: 'fight', stage, fighters: [], traps: [], projectiles: [], fx: [] }, { ambientFrame: 123 });
      const left = index % 3 * 448, top = 65 + Math.floor(index / 3) * 282;
      ctx.drawImage(tile, left, top, 448, 252); ctx.fillStyle = '#dce8f4'; ctx.font = '15px system-ui'; ctx.fillText(stage.name, left + 12, top + 273);
    });
    renderer.ctx = previous;
  });
  await page.locator('canvas').screenshot({ path: path.join(output, 'encore-stage-motion.png') }); report.screenshots.push('encore-stage-motion.png');
  assert.deepEqual(report.errors, []);
  checked('Aucune erreur JavaScript, Canvas ou ressource locale dans les contrôles', 'Deux planches de présentation enregistrées pour inspection visuelle.');
  report.ok = true;
} catch (error) { report.ok = false; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1; }
finally {
  if (browser) await browser.close();
  await fs.writeFile(path.join(output, 'render-sequences-browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

/** Verify costume identity from the selection screen through both sides of the actual renderer. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CROSSOVER_COSTUMES } from '../combat/data.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const output = path.resolve('audit-combat/crossovers');
await fs.mkdir(output, { recursive: true });
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
const checks = [], errors = [];
const pass = (name, detail) => { checks.push({ pass: true, name, detail }); console.log('PASS ' + name); };
try {
  // Trace the image actually decoded into each presentation canvas. WeakMap
  // retains neither the UHD images nor discarded LRU textures during the audit.
  await context.addInitScript(() => {
    const sources = new WeakMap(), proto = CanvasRenderingContext2D.prototype, draw = proto.drawImage;
    window.crossoverSources = sources;
    window.decodedAttacks = new Set();
    proto.drawImage = function (image, ...args) {
      const original = image instanceof HTMLImageElement;
      const src = original ? image.currentSrc || image.src : sources.get(image);
      if (src) {
        const path = new URL(src, location.href).pathname;
        sources.set(this.canvas, path);
        if (path.endsWith('/attack.webp')) {
          if (original) window.decodedAttacks.add(path);
          else if (this.canvas.id === 'arena') {
            const probe = window.duelHeavies?.find(move => move.path === path && !move.observed);
            if (probe) {
              const fighter = window.Encore.snapshot.fighters[probe.side], attack = fighter.attack;
              if (attack?.slot === 'heavy' && attack.frame >= probe.startup && attack.frame < probe.startup + probe.active)
                probe.observed = { frame: attack.frame, facing: fighter.face, drawnFacing: Math.sign(this.getTransform().a) };
            }
          }
        }
      }
      return draw.call(this, image, ...args);
    };
  });
  const page = await context.newPage();
  const fetched = new Set();
  page.on('request', request => { const url = new URL(request.url()); if (url.pathname.includes('/crossovers/')) fetched.add(url.pathname); });
  await page.goto(base + '/combat/', {waitUntil:'networkidle'});
  assert.equal(fetched.size, 0);
  await page.locator('.mode-card[data-mode="local"]').click();
  const pairs = [['pomni', 'murderdrones', 'resident'], ['jax', 'metarunner', 'hommage']];
  for (const [side, [owner, series, style]] of pairs.entries()) {
    const picker = page.locator(`[data-costume-picker="variant-${side}"]`);
    await picker.locator('summary').click();
    await picker.locator('[data-costume-filter="series"]').selectOption(series);
    await picker.locator('[data-costume-filter="style"]').selectOption(style);
    const id = `glitch-${series}-${owner}-${style}`;
    const options = await picker.locator(`#variant-${side} option`).evaluateAll(items => items.map(item => item.value));
    assert.deepEqual(options, ['', id]); // Keep current appearance available while filtering.
    await picker.locator(`#variant-${side}`).selectOption(id);
    await page.waitForFunction(({side, owner, series, style}) => {
      const canvas = document.querySelector(`[data-selection-artist="${side}"] canvas`);
      return window.crossoverSources.get(canvas) === `/assets/encore/crossovers/${series}/${owner}/${style}/selection.webp`;
    }, {side, owner, series, style});
  }
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore.ready && window.Encore.snapshot.phase === 'fight');
  for (const [owner, series, style] of pairs) assert.ok(fetched.has(`/assets/encore/crossovers/${series}/${owner}/${style}/stance.webp`));
  pass('Les filtres des deux joueurs, leurs portraits et leurs gardes ouvrent un duel local', { appearances: 2 });
  const bindings = await page.evaluate(async pairs => {
    const { getFighter } = await import('/combat/data.mjs');
    window.duelHeavies = pairs.map(([owner, series, style], side) => {
      const { startup, active, recovery } = getFighter(owner).moves.heavy;
      return { side, startup, active, recovery, path: `/assets/encore/crossovers/${series}/${owner}/${style}/attack.webp` };
    });
    return window.Encore.profile.settings.bindings.map(player => player.heavy[0]);
  }, pairs);
  await page.waitForFunction(() => window.duelHeavies.every(move => window.decodedAttacks.has(move.path)));
  await page.locator('#arena').focus();
  // Under CPU load a video frame can skip a five-tick active window. Let the
  // fighters recover and replay only the still-unobserved input if needed.
  for (let attempt = 0; attempt < 8; attempt++) {
    const { sides, until } = await page.evaluate(() => ({
      sides: window.duelHeavies.filter(move => !move.observed).map(move => move.side),
      until: window.Encore.snapshot.frame + 4 + Math.max(...window.duelHeavies.map(move => move.startup + move.active + move.recovery)),
    }));
    if (!sides.length) break;
    for (const side of sides) await page.keyboard.press(bindings[side]);
    await page.waitForFunction(frame => window.Encore.snapshot.frame >= frame, until);
  }
  const strikes = await page.evaluate(() => window.duelHeavies.map(move => move.observed));
  assert.ok(strikes.every(Boolean), 'Un coup lourd joué au clavier n’a pas été dessiné pendant sa phase active.');
  assert.deepEqual(strikes.map(move => [move.facing, move.drawnFacing]), [[1, 1], [-1, -1]]);
  pass('Les coups lourds joués au clavier dessinent les deux attaques costumées pendant leur phase active', strikes);
  await page.close();

  const inventory = await context.newPage();
  await inventory.goto(base + '/combat/', { waitUntil:'networkidle' });
  await inventory.locator('[data-nav="archives"]').click();
  await inventory.locator('[data-appearance="pomni"]').first().click();
  const wardrobe = inventory.locator('[data-costume-picker="wardrobe-variant"]');
  await wardrobe.locator('summary').click();
  await wardrobe.locator('[data-costume-filter="series"]').selectOption('smg4');
  await wardrobe.locator('[data-costume-filter="style"]').selectOption('resident');
  await wardrobe.locator('#wardrobe-variant').selectOption('glitch-smg4-pomni-resident');
  await inventory.waitForFunction(() => window.crossoverSources.get(document.querySelector('#wardrobe-preview')) === '/assets/encore/crossovers/smg4/pomni/resident/stance.webp' ||
    window.crossoverSources.get(document.querySelector('#wardrobe-preview')) === '/assets/encore/crossovers/smg4/pomni/resident/intro.webp');
  await inventory.locator('[data-try-appearance="glitch-smg4-pomni-resident"]').click();
  await inventory.waitForFunction(() => window.Encore.ready);
  pass('La garde-robe compare le résident et permet de l’essayer en entraînement', { appearance: 'glitch-smg4-pomni-resident' });
  await inventory.close();

  let audit, currentSeries;
  let textures = 0, orientations = 0, heavyOrientations = 0;
  for (const entry of CROSSOVER_COSTUMES) {
    if (entry.crossover.series !== currentSeries) {
      if (currentSeries) console.log('Série vérifiée : ' + currentSeries + ' · ' + textures + ' textures au total');
      await audit?.close();
      audit = await context.newPage();
      // The two flows above exercise the live UI. Keep its animated home screen
      // and unrelated portraits out of the exhaustive renderer pass.
      await audit.goto(base + '/combat/session.mjs', { waitUntil:'domcontentloaded' });
      currentSeries = entry.crossover.series;
    }
    const counts = await audit.evaluate(async entry => {
      const { getFighter, equipCostume } = await import('/combat/data.mjs');
      const { ART_FILES } = await import('/combat/offline-manifest.mjs');
      const { ACTION_ART, loadFighterIllustration } = await import('/combat/illustrations.mjs');
      const { CombatRenderer } = await import('/combat/render.mjs');
      const f = equipCostume(getFighter(entry.fighterId), entry.id), directory = entry.sprite.crossoverDirectory;
      if (!window.crossoverAuditRenderer) {
        window.crossoverAuditRenderer = new CombatRenderer(document.createElement('canvas'));
        const ctx = window.crossoverAuditRenderer.ctx, draw = ctx.drawImage.bind(ctx);
        ctx.drawImage = (source, ...args) => {
          window.crossoverAuditDraw = {path: window.crossoverSources.get(source), matrix: ctx.getTransform()};
          return draw(source, ...args);
        };
      }
      const renderer = window.crossoverAuditRenderer;
      const keys = ['selection', 'stance', ...ACTION_ART];
      for (const key of keys) {
        if (!ART_FILES.includes(directory + '/' + key + '.webp')) throw new Error('Vue absente du manifeste : ' + entry.id + '/' + key);
      }
      const frames = await Promise.all(keys.map(key =>
        loadFighterIllustration(key === 'selection' || key === 'stance' ? key : 'poses', f, key)
      ));
      for (const [index, key] of keys.entries()) {
        const frame = frames[index];
        const expected = directory.replace('..','') + '/' + key + '.webp';
        if (!frame || window.crossoverSources.get(frame.canvas) !== expected) throw new Error('Décodage incorrect ' + expected);
        if (key === 'selection') continue;
        for (const face of [-1, 1]) {
          const actor = { f, slot: 0, state: key === 'stance' ? 'idle' : key, face, x: 640, y: 568, onGround: key !== 'jump' };
          let phase = 'fight';
          if (key === 'intro') phase = 'intro';
          if (key === 'victory' || key === 'defeat') phase = 'matchOver';
          if (key === 'attack') actor.attack = { name: 'light', def:f.moves.light, t:f.moves.light.startup };
          window.crossoverAuditDraw = null;
          renderer.ctx.clearRect(0, 0, renderer.ctx.canvas.width, renderer.ctx.canvas.height);
          renderer.drawActor(actor, 32, true, {phase, winner:key === 'defeat' ? 1 : 0});
          const emitted = window.crossoverAuditDraw;
          if (emitted?.path !== expected || Math.sign(emitted.matrix.a) !== face) throw new Error('Filtrage ou orientation incorrects ' + expected);
        }
      }
      for (const face of [-1, 1]) {
        const actor = { f, slot: 0, state: 'idle', face, x: 640, y: 568, onGround:true,
          attack:{name:'heavy', def:f.moves.heavy, t:f.moves.heavy.startup} };
        window.crossoverAuditDraw = null;
        renderer.drawActor(actor, 32, true, {phase:'fight'});
        const strike = window.crossoverAuditDraw;
        if (strike?.path !== directory.replace('..','') + '/attack.webp' || Math.sign(strike.matrix.a) !== face)
          throw new Error('Dessin ou orientation incorrects du coup lourd de ' + entry.id);
      }
      return {textures:keys.length, orientations:2*(keys.length-1), heavyOrientations:2};
    }, entry);
    textures += counts.textures; orientations += counts.orientations; heavyOrientations += counts.heavyOrientations;
  }
  console.log('Série vérifiée : ' + currentSeries + ' · ' + textures + ' textures au total');
  assert.equal(textures, 2520);
  assert.equal(orientations, 4536);
  assert.equal(heavyOrientations, 504);
  pass('Chaque silhouette publiée conserve sa tenue et son orientation en combat', { appearances: CROSSOVER_COSTUMES.length, textures, orientations, heavyOrientations });
} catch (error) {
  errors.push(error.stack || String(error)); console.error(errors[0]); process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(path.join(output,'browser-report.json'), JSON.stringify({checks, errors}, null, 2));
}

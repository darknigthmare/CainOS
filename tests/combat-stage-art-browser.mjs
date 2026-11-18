// Compare the real selector to the published three-plane composition and force
// a failed near-plane request to check the live fallback and subsequent retry.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { STAGES } from '../combat/data.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')));
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat/stage-art');
await fs.mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({
  headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const report = { checks: [], stages: [], errors: [] };
const check = name => { report.checks.push({ name, pass: true }); console.log('PASS ' + name); };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  await page.goto(base + '/combat/');
  await page.locator('.mode-card[data-mode="training"]').click();
  const near = '**/assets/encore/stages/spudsy/near.webp';
  await page.route(near, route => route.abort('failed'));
  const failure = page.waitForEvent('requestfailed', { predicate: request => request.url().endsWith('/stages/spudsy/near.webp') });
  await page.locator('[data-stage="spudsy"]').click();
  await failure;
  assert.equal(await page.evaluate(async () => {
    const { CombatRenderer } = await import('/combat/render.mjs');
    const { getStage } = await import('/combat/data.mjs');
    const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
    const stage = getStage('spudsy');
    if (await loadStagePlanes(stage)) return false;
    const expected = document.createElement('canvas');
    new CombatRenderer(expected).render(null, { stage, reducedMotion: true });
    return expected.toDataURL() === document.querySelector('#stage-preview').toDataURL();
  }), true);
  check('A missing near layer keeps the complete procedural arena visible in the selector');
  await page.unroute(near);

  // A second visit to the failed arena must recover the real decor too.
  const stages = [...STAGES.filter(s => s.id !== 'spudsy'), STAGES.find(s => s.id === 'spudsy')];
  for (const stage of stages) {
    await page.locator(`[data-stage="${stage.id}"]`).click();
    const measured = await page.evaluate(async id => {
      const { getStage } = await import('/combat/data.mjs');
      const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
      const { drawStageMotion } = await import('/combat/render-stage-motion.mjs');
      const { CombatRenderer } = await import('/combat/render.mjs');
      const stage = getStage(id), art = await loadStagePlanes(stage);
      if (!art) throw new Error('Missing stage layers: ' + id);
      const preview = document.querySelector('#stage-preview'), ctx = preview.getContext('2d');
      const probe = document.createElement('canvas'); probe.width = 1280; probe.height = 720;
      const expected = probe.getContext('2d', { willReadFrequently: true });
      expected.drawImage(art.still, 0, 0);
      drawStageMotion(expected, stage, 0, true, true);
      const goal = expected.getImageData(0, 0, 1280, 720).data;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const actual = ctx.getImageData(0, 0, 1280, 720).data;
      const planes = art.layers.map(layer => {
        const pixels = layer.getContext('2d').getImageData(0, 0, layer.width, layer.height).data;
        let ink = 0, clear = 0;
        for (let i = 3; i < pixels.length; i += 4 * 31) {
          if (pixels[i] >= 20) ink++;
          if (pixels[i] < 8) clear++;
        }
        return { ink, clear };
      });
      const fixture = document.createElement('canvas');
      const renderer = new CombatRenderer(fixture);
      await renderer.preload([], [stage]);
      const fight = { stage, phase: 'fight', frame: 0, fighters: [{ x: 22 }, { x: 112 }], traps: [], fx: [], projectiles: [] };
      const before = JSON.stringify(fight);
      // Empty actors supply only their positions. Their midpoint is at the far-left stop.
      renderer.render(fight);
      const shifted = renderer.ctx.getImageData(0, 0, 1280, 720).data;
      const leftOffsets = [6, 17, 31];
      art.layers.forEach((layer, i) => expected.drawImage(layer, -32 + leftOffsets[i], -28));
      drawStageMotion(expected, stage, 0, false, true);
      const left = expected.getImageData(0, 0, 1280, 720).data;
      renderer.render(fight, { reducedMotion: true });
      const fixed = renderer.ctx.getImageData(0, 0, 1280, 720).data;
      return {
        id, planes, matches: actual.every((value, i) => value === goal[i]),
        panMatches: shifted.every((value, i) => value === left[i]),
        shifted: shifted.some((value, i) => value !== goal[i]),
        reducedFixed: fixed.every((value, i) => value === goal[i]),
        simulationIntact: JSON.stringify(fight) === before,
      };
    }, stage.id);
    assert.ok(measured.matches, stage.id + ': selector differs from the neutral composition');
    assert.ok(measured.planes[0].ink > 0 && measured.planes[0].clear === 0, stage.id + ': background must be opaque');
    assert.ok(measured.planes.slice(1).every(p => p.ink > 0 && p.clear > 0), stage.id + ': missing transparent depth');
    assert.ok(measured.panMatches && measured.shifted && measured.reducedFixed && measured.simulationIntact,
      stage.id + ': camera, reduced motion or simulation state differs');
    const exportURL = await page.locator('#stage-preview').evaluate(canvas => canvas.toDataURL('image/webp', 0.9));
    await fs.writeFile(path.join(output, stage.id + '.webp'), Buffer.from(exportURL.split(',')[1], 'base64'));
    report.stages.push(measured);
  }
  check('All twelve arenas pan six, seventeen and thirty-one pixels at the camera stop and stay fixed with reduced motion');
  check('All twelve real selector previews display the three published planes, including the recovered arena');
  await page.locator('[data-stage="manor"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore?.ready && window.Encore.snapshot?.phase === 'fight');
  await page.locator('#arena').screenshot({ path: path.join(output, 'manor-duel.png') });
  assert.deepEqual(report.errors, []);
  check('A playable duel opens with the selected painted stage');
} catch (error) {
  report.failure = String(error.stack || error);
  process.exitCode = 1;
  console.error(error);
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
}

// Compare the real selector to the published compositions: four full paintings
// and twenty-three three-plane scenes. Exercise failure, retry and cached return.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { STAGES } from '../combat/data.mjs';
import { REBUILT_STAGE_SCENES } from '../combat/stage-scenes-20261127.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';

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
const report = { checks: [], stages: [], props: [], fullScenes: [], errors: [] };
const check = name => { report.checks.push({ name, pass: true }); console.log('PASS ' + name); };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  await page.goto(base + '/combat/');
  await page.locator('.mode-card[data-mode="training"]').click();
  const rebuiltIds = ['falseexit', 'undermap', 'kingdom', 'spudsy'];
  assert.deepEqual(Object.keys(REBUILT_STAGE_SCENES).sort(), [...rebuiltIds].sort(),
    'The full-scene contract must cover exactly the four rebuilt arenas');
  assert.equal(STAGES.length, 27, 'Scene replacements must not create new arena identities');
  for (const id of rebuiltIds) assert.ok(ART_FILES.includes(REBUILT_STAGE_SCENES[id].path), id + ': full painting absent from the published art pack');

  const near = '**/assets/encore/stages/candy/near.webp';
  await page.route(near, route => route.abort('failed'));
  const failure = page.waitForEvent('requestfailed', { predicate: request => request.url().endsWith('/stages/candy/near.webp') });
  await page.locator('[data-stage="candy"]').click();
  await failure;
  assert.equal(await page.evaluate(async () => {
    const { CombatRenderer } = await import('/combat/render.mjs');
    const { getStage } = await import('/combat/data.mjs');
    const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
    const stage = getStage('candy');
    if (await loadStagePlanes(stage)) return false;
    const expected = document.createElement('canvas');
    new CombatRenderer(expected).render(null, { stage, reducedMotion: true });
    return expected.toDataURL() === document.querySelector('#stage-preview').toDataURL();
  }), true);
  check('A missing near layer keeps the complete procedural arena visible in the selector');
  await page.unroute(near);

  const cart = '**/assets/encore/props/grounds/cotton-candy-cart.*';
  const readCart = () => page.evaluate(async () => {
    const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
    const art = await loadStagePlanes({ id: 'grounds' });
    return { complete: art.complete, image: art.still.toDataURL() };
  });
  await page.route(cart, route => route.abort('failed'));
  const absent = await readCart();
  assert.equal(absent.complete, false);
  await page.unroute(cart);
  const present = await readCart();
  assert.equal(present.complete, true);
  assert.notEqual(present.image, absent.image);
  check('A failed grounds prop leaves the stage playable and reappears on a later visit');

  const recoveredProps = [
    ['gaslightwharf', 'wharf-lamp'],
    ['showgrounds', 'ticket-dispenser'],
    ['gameoverse', 'orbital-checkpoint'],
    ['parkplanet', 'garden-turnstile'],
    ['littledaisy', 'jazz-microphone'],
    ['simpleflipisland', 'bamboo-checkpoint'],
  ];
  const readRecoveredProp = (id, phase) => page.evaluate(async ({ id, phase }) => {
    const { getStage } = await import('/combat/data.mjs');
    const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
    const { drawStageMotion } = await import('/combat/render-stage-motion.mjs');
    const stage = getStage(id), art = await loadStagePlanes(stage);
    if (!art) throw new Error('Missing stage layers during prop recovery: ' + id);
    const pixels = art.still.getContext('2d').getImageData(0, 0, 1280, 720).data;
    if (phase === 'absent') window.__stagePropRecovery = { id, absentPixels: pixels };
    const previous = window.__stagePropRecovery;
    if (previous?.id !== id) throw new Error('Missing prop recovery baseline: ' + id);
    const differsFromFallback = pixels.some((value, i) => value !== previous.absentPixels[i]);
    const sameCachedCanvas = art.still === previous.presentCanvas;
    const samePixelsAsPresent = !!previous.presentPixels
      && pixels.every((value, i) => value === previous.presentPixels[i]);
    if (phase === 'present') {
      previous.presentCanvas = art.still;
      previous.presentPixels = pixels;
    }
    const expected = document.createElement('canvas');
    expected.width = 1280; expected.height = 720;
    const ctx = expected.getContext('2d');
    ctx.drawImage(art.still, 0, 0);
    drawStageMotion(ctx, stage, 0, true, true);
    const goal = ctx.getImageData(0, 0, 1280, 720).data;
    await new Promise(resolve => requestAnimationFrame(resolve));
    const preview = document.querySelector('#stage-preview');
    const actual = preview.getContext('2d').getImageData(0, 0, 1280, 720).data;
    return {
      complete: art.complete, layerCount: art.layers.length,
      size: [art.still.width, art.still.height],
      previewId: preview.dataset.stagePreview,
      previewMatches: actual.every((value, i) => value === goal[i]),
      differsFromFallback, sameCachedCanvas, samePixelsAsPresent,
    };
  }, { id, phase });
  const visitGrounds = async () => {
    await page.locator('[data-stage="grounds"]').click();
    await page.evaluate(async () => {
      const { loadStagePlanes } = await import('/combat/stage-parallax.mjs');
      await loadStagePlanes({ id: 'grounds' });
    });
  };
  for (const [id, file] of recoveredProps) {
    const stem = `/assets/encore/props/${id}/${file}`;
    const routePattern = '**' + stem + '.*';
    const matchesProp = url => [stem + '.png', stem + '.webp'].includes(new URL(url).pathname);
    const requests = [];
    const observeRequest = request => {
      if (matchesProp(request.url())) requests.push(new URL(request.url()).pathname);
    };
    let blockedRequests = 0;
    const abortProp = route => { blockedRequests++; return route.abort('failed'); };
    page.on('request', observeRequest);
    await page.route(routePattern, abortProp);
    try {
      // Select the actual decor before calling its loader: the UI itself must
      // request this prop, rather than passing because a file merely exists.
      const failedRequest = page.waitForEvent('requestfailed', { predicate: request => matchesProp(request.url()) });
      await page.locator(`[data-stage="${id}"]`).click();
      assert.equal((await failedRequest).resourceType(), 'image', id + ': the decor never requested its prop image');
      const missingProp = await readRecoveredProp(id, 'absent');
      assert.equal(missingProp.complete, false, id + ': a failed prop must leave the scene incomplete');
      assert.equal(missingProp.layerCount, 3, id + ': prop failure must retain all scenery planes');
      assert.deepEqual(missingProp.size, [1280, 720]);
      assert.equal(missingProp.previewId, id);
      assert.ok(missingProp.previewMatches, id + ': prop failure must keep the arena visible in the selector');
      const failedRequests = blockedRequests;
      await page.unroute(routePattern, abortProp);

      await visitGrounds();
      const response = page.waitForResponse(response => matchesProp(response.url()));
      await page.locator(`[data-stage="${id}"]`).click();
      const loaded = await response;
      assert.ok(loaded.ok(), id + ': the recovered prop was not served successfully');
      const restoredProp = await readRecoveredProp(id, 'present');
      assert.equal(restoredProp.complete, true, id + ': the next visit must retry the failed prop');
      assert.equal(restoredProp.previewId, id);
      assert.ok(restoredProp.differsFromFallback, id + ': the loaded prop must change the scene pixels');
      assert.ok(restoredProp.previewMatches, id + ': the recovered prop must appear in the live selector');
      const requestsBeforeReturn = requests.length;

      // Keep the recovered stage in the two-scene cache while visiting another
      // arena. A repeated network failure must not replace the complete canvas.
      await page.route(routePattern, abortProp);
      await visitGrounds();
      await page.locator(`[data-stage="${id}"]`).click();
      const cachedProp = await readRecoveredProp(id, 'cached');
      assert.equal(cachedProp.complete, true, id + ': a cached return lost the prop');
      assert.equal(cachedProp.previewId, id);
      assert.ok(cachedProp.sameCachedCanvas && cachedProp.samePixelsAsPresent,
        id + ': returning to the arena must reuse the unchanged complete canvas');
      assert.ok(cachedProp.previewMatches, id + ': the cached scene must remain visible in the selector');
      assert.equal(requests.length, requestsBeforeReturn, id + ': a cached return unexpectedly requested the prop again');
      assert.equal(blockedRequests, failedRequests, id + ': a cached return retried a loaded prop');
      report.props.push({ id, file, requestedPath: new URL(loaded.url()).pathname,
        failedRequests, requestsBeforeReturn, requestsAfterReturn: requests.length,
        absent: missingProp, restored: restoredProp, cached: cachedProp });
      check(id + ': its recovered prop survives failure, retry and a cached return in the real selector');
    } finally {
      await page.unroute(routePattern, abortProp);
      page.off('request', observeRequest);
      await page.evaluate(() => { delete window.__stagePropRecovery; });
    }
  }

  const readFullScene = (id, phase) => page.evaluate(async ({ id, phase }) => {
    const { getStage } = await import('/combat/data.mjs');
    const { loadStagePlanes, stageScenePlacement } = await import('/combat/stage-parallax.mjs');
    const { REBUILT_STAGE_SCENES } = await import('/combat/stage-scenes-20261127.mjs');
    const { drawStageMotion } = await import('/combat/render-stage-motion.mjs');
    const { CombatRenderer } = await import('/combat/render.mjs');
    const stage = getStage(id), art = await loadStagePlanes(stage);
    const expected = document.createElement('canvas'); expected.width = 1280; expected.height = 720;
    const ctx = expected.getContext('2d');
    if (phase === 'absent') {
      if (art) throw new Error(id + ': a failed full painting must not be cached as complete');
      new CombatRenderer(expected).render(null, { stage, reducedMotion: true });
      window.__fullSceneRecovery = { id, absentPixels: ctx.getImageData(0, 0, 1280, 720).data };
    } else {
      if (!art) throw new Error(id + ': full painting failed to load on retry');
      const previous = window.__fullSceneRecovery;
      if (previous?.id !== id) throw new Error(id + ': missing recovery baseline');
      if (phase === 'present') {
        const source = REBUILT_STAGE_SCENES[id], image = new Image();
        image.src = new URL(source.path, new URL('/combat/stage-scenes-20261127.mjs', location.href)).href;
        await image.decode();
        const sourcePlane = document.createElement('canvas');
        sourcePlane.width = 1344; sourcePlane.height = 756;
        const sourceContext = sourcePlane.getContext('2d'); sourceContext.imageSmoothingQuality = 'high';
        const placement = stageScenePlacement(image.naturalWidth, image.naturalHeight, source.groundAnchor);
        sourceContext.drawImage(image, placement.x, placement.y, placement.width, placement.height);
        const expectedPixels = sourceContext.getImageData(0, 0, 1344, 756).data;
        const layerPixels = art.layers[0].getContext('2d').getImageData(0, 0, 1344, 756).data;
        previous.sourceOnly = layerPixels.every((value, i) => value === expectedPixels[i]);
        previous.naturalSize = [image.naturalWidth, image.naturalHeight];
        previous.presentCanvas = art.still;
        previous.presentPixels = art.still.getContext('2d').getImageData(0, 0, 1280, 720).data;
        image.removeAttribute('src');
      }
      ctx.drawImage(art.still, 0, 0);
      if (!art.fullScene) drawStageMotion(ctx, stage, 0, true, true);
    }
    const expectedPixels = ctx.getImageData(0, 0, 1280, 720).data;
    await new Promise(resolve => requestAnimationFrame(resolve));
    const preview = document.querySelector('#stage-preview');
    const actual = preview.getContext('2d').getImageData(0, 0, 1280, 720).data;
    const previous = window.__fullSceneRecovery;
    return {
      previewId: preview.dataset.stagePreview,
      previewMatches: actual.every((value, i) => value === expectedPixels[i]),
      fallback: !art, fullScene: art?.fullScene ?? false, complete: art?.complete ?? false,
      layerCount: art?.layers.length ?? 0, sourceOnly: previous.sourceOnly ?? false,
      naturalSize: previous.naturalSize ?? null,
      differsFromFallback: expectedPixels.some((value, i) => value !== previous.absentPixels[i]),
      sameCachedCanvas: !!art && art.still === previous.presentCanvas,
      samePixelsAsPresent: !!art && !!previous.presentPixels && art.still.getContext('2d')
        .getImageData(0, 0, 1280, 720).data.every((value, i) => value === previous.presentPixels[i]),
    };
  }, { id, phase });
  for (const id of rebuiltIds) {
    const imagePath = new URL(REBUILT_STAGE_SCENES[id].path, base + '/combat/stage-scenes-20261127.mjs').pathname;
    const routePattern = '**' + imagePath;
    const matchesScene = url => new URL(url).pathname === imagePath;
    const sceneRequests = [], legacyRequests = [];
    const observeRequest = request => {
      const pathname = new URL(request.url()).pathname;
      if (pathname.startsWith(`/assets/encore/stages/${id}/`) || pathname.startsWith(`/assets/encore/props/${id}/`)) {
        (pathname === imagePath ? sceneRequests : legacyRequests).push(pathname);
      }
    };
    let blockedRequests = 0;
    const abortScene = route => { blockedRequests++; return route.abort('failed'); };
    page.on('request', observeRequest);
    await page.route(routePattern, abortScene);
    try {
      const failedRequest = page.waitForEvent('requestfailed', { predicate: request => matchesScene(request.url()) });
      await page.locator(`[data-stage="${id}"]`).click();
      assert.equal((await failedRequest).resourceType(), 'image', id + ': selector did not request its new PNG');
      const absent = await readFullScene(id, 'absent');
      assert.ok(absent.fallback && absent.previewMatches && absent.previewId === id,
        id + ': failed painting must keep its complete procedural fallback visible');
      const failedRequests = blockedRequests;
      await page.unroute(routePattern, abortScene);
      await visitGrounds();
      const response = page.waitForResponse(response => matchesScene(response.url()));
      await page.locator(`[data-stage="${id}"]`).click();
      const loaded = await response;
      assert.ok(loaded.ok(), id + ': new full-scene PNG was not served successfully');
      const restored = await readFullScene(id, 'present');
      assert.ok(restored.complete && restored.fullScene && restored.layerCount === 1,
        id + ': the painting must remain one full plane');
      assert.ok(restored.sourceOnly, id + ': historical planes or floating props were composited over the new painting');
      assert.ok(restored.naturalSize.every(value => value > 0) && restored.differsFromFallback,
        id + ': the recovered scene must contain the decoded PNG instead of the procedural fallback');
      assert.ok(restored.previewMatches && restored.previewId === id, id + ': the real selector did not display the recovered painting');
      const requestsBeforeReturn = sceneRequests.length;
      await page.route(routePattern, abortScene);
      await visitGrounds();
      await page.locator(`[data-stage="${id}"]`).click();
      const cached = await readFullScene(id, 'cached');
      assert.ok(cached.complete && cached.fullScene && cached.sameCachedCanvas && cached.samePixelsAsPresent,
        id + ': a cached return lost or rebuilt the complete painting');
      assert.ok(cached.previewMatches && cached.previewId === id, id + ': cached painting disappeared from the selector');
      assert.equal(sceneRequests.length, requestsBeforeReturn, id + ': cached return requested its PNG again');
      assert.equal(blockedRequests, failedRequests, id + ': cached return retried an already loaded PNG');
      assert.deepEqual(legacyRequests, [], id + ': new full-scene path must not load historical layers or props');
      report.fullScenes.push({ id, requestedPath: imagePath, failedRequests, requestsBeforeReturn,
        requestsAfterReturn: sceneRequests.length, legacyRequests, absent, restored, cached });
      check(id + ': its full PNG survives failure, retry and cached return without historical layers or props');
    } finally {
      await page.unroute(routePattern, abortScene);
      page.off('request', observeRequest);
      await page.evaluate(() => { delete window.__fullSceneRecovery; });
    }
  }

  // A second visit to the failed arena must recover the real decor too.
  const stages = [...STAGES.filter(s => s.id !== 'candy'), STAGES.find(s => s.id === 'candy')];
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
      if (!art.fullScene) drawStageMotion(expected, stage, 0, true, true);
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
      const leftOffsets = art.fullScene ? [6] : [6, 17, 31];
      art.layers.forEach((layer, i) => expected.drawImage(layer, -32 + leftOffsets[i], -28));
      if (!art.fullScene) drawStageMotion(expected, stage, 0, false, true);
      const left = expected.getImageData(0, 0, 1280, 720).data;
      renderer.render(fight, { reducedMotion: true });
      const fixed = renderer.ctx.getImageData(0, 0, 1280, 720).data;
      return {
        id, planes, fullScene: art.fullScene, cameraOffsets: leftOffsets,
        matches: actual.every((value, i) => value === goal[i]),
        panMatches: shifted.every((value, i) => value === left[i]),
        shifted: shifted.some((value, i) => value !== goal[i]),
        reducedFixed: fixed.every((value, i) => value === goal[i]),
        simulationIntact: JSON.stringify(fight) === before,
      };
    }, stage.id);
    assert.ok(measured.matches, stage.id + ': selector differs from the neutral composition');
    const fullScene = rebuiltIds.includes(stage.id);
    assert.equal(measured.fullScene, fullScene, stage.id + ': wrong composition type');
    assert.equal(measured.planes.length, fullScene ? 1 : 3, stage.id + ': wrong plane count');
    assert.deepEqual(measured.cameraOffsets, fullScene ? [6] : [6, 17, 31]);
    assert.ok(measured.planes[0].ink > 0 && measured.planes[0].clear === 0, stage.id + ': background must be opaque');
    if (!fullScene) assert.ok(measured.planes.slice(1).every(p => p.ink > 0 && p.clear > 0), stage.id + ': missing transparent depth');
    assert.ok(measured.panMatches && measured.shifted && measured.reducedFixed && measured.simulationIntact,
      stage.id + ': camera, reduced motion or simulation state differs');
    const exportURL = await page.locator('#stage-preview').evaluate(canvas => canvas.toDataURL('image/webp', 0.9));
    await fs.writeFile(path.join(output, stage.id + '.webp'), Buffer.from(exportURL.split(',')[1], 'base64'));
    report.stages.push(measured);
  }
  assert.equal(report.stages.filter(stage => stage.fullScene).length, 4);
  assert.equal(report.stages.filter(stage => !stage.fullScene).length, 23);
  check('Four full paintings pan six pixels; twenty-three layered scenes pan six, seventeen and thirty-one pixels, with reduced motion fixed');
  check('All 27 playable selector previews display their published composition, including recovered full paintings and layers');
  await page.locator('[data-stage="showgrounds"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore?.ready && window.Encore.snapshot?.phase === 'fight');
  assert.ok((await page.locator('.fight-caption').textContent()).includes(STAGES.find(stage => stage.id === 'showgrounds').name));
  await page.locator('#arena').screenshot({ path: path.join(output, 'showgrounds-duel.png') });
  assert.deepEqual(report.errors, []);
  check('A playable duel opens in the selected SMG4 Showgrounds');
} catch (error) {
  report.failure = String(error.stack || error);
  process.exitCode = 1;
  console.error(error);
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
}

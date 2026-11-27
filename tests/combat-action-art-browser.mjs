/** Verify the shipped action drawings through the combat renderer, one appearance at a time. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, VARIANTS, COSTUME_ADDITIONS, equipCostume } from '../combat/data.mjs';
import { ACTION_ART } from '../combat/illustrations.mjs';
import { ART_FILES } from '../combat/offline-manifest.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const output = path.resolve(process.env.COMBAT_ACTION_ART_OUTPUT || 'audit-combat/action-art');
await fs.mkdir(output, { recursive: true });
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4173';
const checks = [], failures = [];
const allAppearances = [
  ...FIGHTERS.map(fighter => ({ id: fighter.id, owner: fighter.id, keys: [...ACTION_ART, 'heavy'] })),
  ...[...VARIANTS, ...COSTUME_ADDITIONS].map(variant => ({ id: variant.id, owner: variant.fighterId, keys: [...ACTION_ART, 'heavy'] })),
];
const publishedArt = new Set(ART_FILES);
for (const appearance of allAppearances) {
  const baseFighter = FIGHTERS.find(f => f.id === appearance.owner);
  const fighter = appearance.id === appearance.owner ? baseFighter : equipCostume(baseFighter, appearance.id);
  assert.ok(fighter, 'Unknown appearance owner: ' + appearance.id);
  if (appearance.id !== appearance.owner) assert.equal(fighter.costume, appearance.id);
  const directory = fighter.sprite?.crossoverDirectory || '../assets/encore/poses/' + appearance.id;
  appearance.sources = Object.fromEntries(appearance.keys.map(key => {
    const stem = directory + '/' + key;
    const published = [stem + '.webp', stem + '.png'].find(file => publishedArt.has(file));
    assert.ok(published, 'Unpublished action: ' + appearance.id + '/' + key);
    return [key, path.posix.resolve('/combat', published)];
  }));
}
const allActionPaths = new Set(allAppearances.flatMap(appearance => Object.values(appearance.sources)));
// An explicit local scope keeps a small art review practical. CI omits this
// option and continues to exercise the complete installed catalogue.
const requestedIds = (process.env.COMBAT_ACTION_ART_APPEARANCES || '').split(',').map(id => id.trim()).filter(Boolean);
for (const id of requestedIds) assert.ok(allAppearances.some(item => item.id === id), 'Unknown appearance: ' + id);
const appearances = requestedIds.length ? allAppearances.filter(item => requestedIds.includes(item.id)) : allAppearances;
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
const requests = new Set();
page.on('request', req => {
  const pathname = new URL(req.url()).pathname;
  if (allActionPaths.has(pathname)) requests.add(pathname);
});
try {
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' });
  assert.equal(requests.size, 0);
  checked('Opening the menu fetches no action drawings', { requests: requests.size });

  const blocked = '**/assets/encore/poses/maidjax/crouch.webp';
  let failedRequests = 0;
  await page.clock.install();
  await page.route(blocked, route => { failedRequests++; return route.abort(); });
  const fallback = await page.evaluate(async () => {
    const { getFighter, VARIANTS } = await import('/combat/data.mjs');
    const { CombatRenderer, getFrame } = await import('/combat/render.mjs');
    const { loadFighterIllustration } = await import('/combat/illustrations.mjs');
    const variant = VARIANTS.find(item => item.id === 'maidjax');
    const f = { ...getFighter('jax'), costume: variant.id, sprite: variant.sprite, animation: variant.animation || null };
    const renderer = new CombatRenderer(document.createElement('canvas'));
    await renderer.preload([f]);
    if (await loadFighterIllustration('poses', f, 'crouch')) return false;
    const archive = getFrame(f, 'idle', 0);
    const ctx = renderer.ctx, draw = ctx.drawImage.bind(ctx);
    let draws = 0;
    ctx.drawImage = (source, ...args) => {
      if (source === archive.canvas) draws++;
      return draw(source, ...args);
    };
    for (let tick = 0; tick < 12; tick++) {
      renderer.drawActor({ f, x: 500, y: 568, face: 1, crouch: true }, tick, true);
    }
    return draws === 12;
  });
  assert.ok(fallback);
  assert.equal(failedRequests, 1);
  await page.unroute(blocked);
  await page.clock.fastForward(5100);
  checked('A missing action keeps its exact-costume archive without repeated requests per frame', { frames: 12, failedRequests });
  if (!appearances.some(item => item.id === 'maidjax')) requests.delete('/assets/encore/poses/maidjax/crouch.webp');

  // Run the production selection logic and capture the actual drawImage call,
  // including the transform for player two. A direct source comparison at
  // displayed size separately rules out a wrong costume or a stale cached pose.
  for (const appearance of appearances) {
    const result = await page.evaluate(async ({ id, owner, keys, sources }) => {
      const { getFighter, equipCostume } = await import('/combat/data.mjs');
      const { CombatRenderer } = await import('/combat/render.mjs');
      const { loadFighterIllustration } = await import('/combat/illustrations.mjs');
      const baseFighter = getFighter(owner);
      const f = id === owner ? baseFighter : equipCostume(baseFighter, id);
      if (id !== owner && f.costume !== id) throw new Error('Appearance not selected: ' + id);
      const renderer = new CombatRenderer(document.createElement('canvas'));
      const ctx = renderer.ctx, draw = ctx.drawImage.bind(ctx);
      const sampled = [], nativeFacings = {};
      ctx.drawImage = (source, ...args) => {
        sampled.push({ source, matrix: ctx.getTransform() });
        return draw(source, ...args);
      };
      for (const key of keys) {
        const expected = await loadFighterIllustration('poses', f, key);
        if (!expected) throw new Error('Missing ' + id + '/' + key);
        if (expected.nativeFacing !== 1 && expected.nativeFacing !== -1) throw new Error('Missing native direction: ' + id + '/' + key);
        nativeFacings[key] = expected.nativeFacing;
        const image = new Image();
        image.src = sources[key];
        await image.decode();
        const ref = document.createElement('canvas');
        ref.width = expected.width; ref.height = expected.height;
        const refCtx = ref.getContext('2d');
        refCtx.imageSmoothingQuality = 'high';
        refCtx.drawImage(image, 0, 0, ref.width, ref.height);
        image.removeAttribute('src');
        const pixels = refCtx.getImageData(0, 0, ref.width, ref.height).data;
        const actual = expected.canvas.getContext('2d').getImageData(0, 0, ref.width, ref.height).data;
        for (let i = 0; i < pixels.length; i++) {
          if (actual[i] !== pixels[i]) throw new Error('Texture mismatch: ' + id + '/' + key);
        }
        for (const face of [1, -1]) {
          const actor = { f, slot: 0, state: key, x: 500, y: 568, face, onGround: key !== 'jump' };
          let phase = 'fight';
          if (key === 'intro') phase = 'intro';
          if (key === 'victory' || key === 'defeat') phase = 'matchOver';
          if (key === 'attack' || key === 'heavy') {
            const slot = key === 'heavy' ? 'heavy' : 'light';
            actor.attack = { name: slot, def: f.moves[slot], t: f.moves[slot].startup };
          }
          sampled.length = 0;
          renderer.drawActor(actor, 0, true, { phase, winner: key === 'defeat' ? 1 : 0 });
          const emitted = sampled.find(item => item.source === expected.canvas);
          if (!emitted || Math.sign(emitted.matrix.a) !== face * expected.nativeFacing) throw new Error('Wrong action/orientation: ' + id + '/' + key);
          const { a, b, c, d } = emitted.matrix;
          const height = f.visual?.height || f.combat?.simulationBody?.height || 230;
          const configuredFactor = f.visual?.poseHeightFactors?.[key];
          const factor = Number.isFinite(configuredFactor) && configuredFactor > 0 ? configuredFactor : 1;
          const requestedHeight = height * (key === 'crouch' || key === 'defeat' ? 0.74 : 1) * factor;
          const widthLimit = f.visual?.maxIllustratedWidth;
          const worldHeight = Number.isFinite(widthLimit) && widthLimit > 0
            ? Math.min(requestedHeight, widthLimit * expected.bounds.height / expected.bounds.width) : requestedHeight;
          if (Math.abs(Math.hypot(a, b) - Math.hypot(c, d)) > 0.0001 ||
              Math.abs(Math.hypot(c, d) * expected.bounds.height - worldHeight) > 0.01) {
            throw new Error('Distorted drawing or incorrect pose height: ' + id + '/' + key);
          }
        }
      }
      if (id === 'abstractinggangle') {
        if (f.sprite.nativeFacing !== -1) throw new Error('Gangle stance fallback must face left');
        const stance = await loadFighterIllustration('stance', f);
        const selection = await loadFighterIllustration('selection', f);
        if (stance?.nativeFacing !== -1 || selection?.nativeFacing !== -1) throw new Error('Gangle portrait/stance direction lost in decoding');
        for (const face of [1, -1]) {
          sampled.length = 0;
          renderer.drawActor({ f, slot: 0, state: 'idle', x: 500, y: 568, face, onGround: true }, 0, true);
          const emitted = sampled.find(item => item.source === stance.canvas);
          if (!emitted || Math.sign(emitted.matrix.a) !== -face) throw new Error('Gangle stance must mirror on player one, not player two');
        }
      }
      return { count: keys.length, nativeFacings };
    }, appearance);
    assert.equal(result.count, appearance.keys.length);
    if (appearance.id === 'abstractinggangle') {
      // Independent visual-review expectations catch a loader that assigns the
      // stance direction to every pose, or silently returns the historical +1.
      assert.deepEqual(result.nativeFacings, {
        intro: 1, attack: -1, hit: -1, walk: -1, jump: -1, crouch: -1,
        victory: -1, defeat: -1, heavy: 1,
      });
      checked('Abstracting Gangle retains the reviewed mixed directions in both arena positions', {
        nativeFacings: result.nativeFacings, selection: -1, stance: -1, stanceDrawCallsCompared: 2,
      });
    }
  }
  const total = appearances.reduce((sum, entry) => sum + entry.keys.length, 0);
  assert.equal(requests.size, total);
  checked(requestedIds.length ? 'Selected action drawings render on both sides of the arena' : 'All original and costumed action drawings render on both sides of the arena', { appearances: appearances.length, drawings: total, drawCallsCompared: total * 2 });
} catch (error) {
  failures.push(error.stack || String(error));
  console.error(failures[0]); process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify({ scope: requestedIds.length ? 'selected_appearances' : 'complete_catalogue', appearanceIds: appearances.map(item => item.id), checks, errors: failures }, null, 2));
}

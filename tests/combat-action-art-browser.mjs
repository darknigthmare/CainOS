/** Verify the shipped action drawings through the combat renderer, one appearance at a time. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, VARIANTS, COSTUME_ADDITIONS } from '../combat/data.mjs';
import { ACTION_ART } from '../combat/illustrations.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const output = path.resolve('audit-combat/action-art');
await fs.mkdir(output, { recursive: true });
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4173';
const checks = [], failures = [];
const appearances = [
  ...FIGHTERS.map(fighter => ({ id: fighter.id, owner: fighter.id, keys: [...ACTION_ART, 'heavy'] })),
  ...[...VARIANTS, ...COSTUME_ADDITIONS].map(variant => ({ id: variant.id, owner: variant.fighterId, keys: [...ACTION_ART, 'heavy'] })),
];
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
const page = await context.newPage();
const requests = new Set();
page.on('request', req => {
  const pathname = new URL(req.url()).pathname;
  if (pathname.startsWith('/assets/encore/poses/')) requests.add(pathname);
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

  // Run the production selection logic and capture the actual drawImage call,
  // including the transform for player two. A direct source comparison at
  // displayed size separately rules out a wrong costume or a stale cached pose.
  for (const appearance of appearances) {
    const result = await page.evaluate(async ({ id, owner, keys }) => {
      const { getFighter, COSTUMES } = await import('/combat/data.mjs');
      const { CombatRenderer } = await import('/combat/render.mjs');
      const { loadFighterIllustration } = await import('/combat/illustrations.mjs');
      const { ART_FILES } = await import('/combat/offline-manifest.mjs');
      const baseFighter = getFighter(owner);
      const variant = COSTUMES.find(item => item.id === id);
      const f = variant ? { ...baseFighter, costume: id, sprite: variant.sprite, visual: { ...baseFighter.visual, ...variant.visual }, animation: variant.animation || null } : baseFighter;
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
        const stem = '../assets/encore/poses/' + id + '/' + key;
        const published = [stem + '.webp', stem + '.png'].find(file => ART_FILES.includes(file));
        if (!published) throw new Error('Unpublished action: ' + id + '/' + key);
        image.src = published.replace(/^\.\./, '');
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
          const worldHeight = height * (key === 'crouch' || key === 'defeat' ? 0.74 : 1);
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
  checked('All original and costumed action drawings render on both sides of the arena', { appearances: appearances.length, drawings: total, drawCallsCompared: total * 2 });
} catch (error) {
  failures.push(error.stack || String(error));
  console.error(failures[0]); process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify({ checks, errors: failures }, null, 2));
}

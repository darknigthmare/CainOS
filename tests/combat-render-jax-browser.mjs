/** Jax source integrity, palette and native Canvas compositing checks. */
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
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178', output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const report = { createdAt: new Date().toISOString(), fixture: 'Regenerated Jax 0.5.0 sheet, real Canvas extraction and compositing. No canonical 1:1 claim.', checks: [], errors: [], screenshots: [], measurements: {}, limitations: ['The source is an image-generated illustration and its contours differ from the historical sheet.', 'Eight idle, walking, speaking, pointing and reaction cells are reused by gameplay. Dedicated combat artwork remains unavailable.', 'Palette-family measurements do not certify every anatomical feature against official animation.'] };
const checked = (name, detail) => { report.checks.push({ name, pass: true, detail }); console.log(`PASS ${name}`); };
const sources = ['assets/images/cainos-jax-animation-sheet-0.5.0.png', 'combat/data.mjs', 'combat/render.mjs', 'combat/render-poses.mjs', 'tests/combat-render-jax-browser.mjs'];
report.sourceHashes = Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
let browser;
try {
  browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`HTTP ${response.status()} ${response.url()}`); });
  await page.route('**/combat/jax-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#142033}canvas{display:block}</style></head><body><canvas id="fixture"></canvas></body></html>' }));
  await page.goto(`${base}/combat/jax-fixture`);
  const metrics = await page.evaluate(async () => {
    const { FIGHTERS } = await import('/combat/data.mjs');
    const { CombatRenderer, getFrame } = await import('/combat/render.mjs');
    const poses = await import('/combat/render-poses.mjs');
    const jax = FIGHTERS.find(f => f.id === 'jax'), canvas = document.getElementById('fixture'), renderer = new CombatRenderer(canvas);
    const ready = await renderer.preload([jax]);
    const image = new Image(); image.src = new URL(jax.animation.src, location.href).href; await image.decode();
    const rawCanvas = document.createElement('canvas'); rawCanvas.width = image.width; rawCanvas.height = image.height;
    const rawCtx = rawCanvas.getContext('2d', { willReadFrequently: true }); rawCtx.drawImage(image, 0, 0);
    const raw = rawCtx.getImageData(0, 0, image.width, image.height).data, cw = image.width / 4, ch = image.height / 2;
    const idle = getFrame(jax, 'idle', 0, null, 0), cells = [];
    for (let index = 0; index < 8; index++) {
      const ox = index % 4 * cw, oy = Math.floor(index / 4) * ch;
      let borderMax = 0, visible = 0, purple = 0, pink = 0, yellow = 0;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const i = ((oy + y) * image.width + ox + x) * 4, [r, g, b, a] = raw.slice(i, i + 4);
        if (x === 0 || y === 0 || x === cw - 1 || y === ch - 1) borderMax = Math.max(borderMax, a);
        if (a < 200) continue;
        visible++;
        if (b > r * 1.05 && b > g * 1.15 && b > 80) purple++;
        if (r > g * 1.25 && r > b * 0.95 && b > g * 1.1 && r > 120) pink++;
        if (r > 150 && g > 120 && b < Math.min(r, g) * 0.7) yellow++;
      }
      const frame = getFrame(jax, 'idle', 0, null, index), pixels = frame.canvas.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
      let alphaChanges = 0, opaqueRgbChanges = 0;
      for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
        const i = (y * frame.width + x) * 4, si = ((oy + frame.y + y) * image.width + ox + frame.x + x) * 4;
        if (raw[si + 3] >= 12 && raw[si + 3] !== pixels[i + 3]) alphaChanges++;
        if (raw[si + 3] === 255 && pixels[i + 3] === 255 && [0, 1, 2].some(c => raw[si + c] !== pixels[i + c])) opaqueRgbChanges++;
      }
      const geometry = poses.frameGeometry(jax, frame, idle, { lean: 0 }, 1), opposite = poses.frameGeometry(jax, frame, idle, { lean: 0 }, -1);
      cells.push({ index, borderMax, visible, purple, pink, yellow, alphaChanges, opaqueRgbChanges, registration: frame.registration, scale: geometry.scale, oppositeScale: opposite.scale, flip: geometry.flip, oppositeFlip: opposite.flip, root: geometry.anchor, lowRig: !!poses.crouchParts(jax, frame), bounds: frame.bounds });
    }
    const backgrounds = ['#ffffff', '#00e6e6', '#152133'], composites = [];
    for (const background of backgrounds) {
      rawCtx.fillStyle = background; rawCtx.fillRect(0, 0, image.width, image.height); rawCtx.drawImage(image, 0, 0);
      const color = [...rawCtx.getImageData(0, 0, 1, 1).data];
      const corners = [];
      for (let i = 0; i < 8; i++) corners.push([...rawCtx.getImageData(i % 4 * cw, Math.floor(i / 4) * ch, 1, 1).data]);
      composites.push({ background, color, corners });
    }
    const actor = { f: jax, slot: 0, x: 640, y: 568, face: 1, onGround: true, state: 'idle', hit: 0, flash: 0, buffs: {}, statuses: {} }, before = JSON.stringify(actor);
    for (const state of ['idle', 'walk', 'crouch', 'guard', 'hit']) renderer.drawActor({ ...actor, state, crouch: state === 'crouch', hit: state === 'hit' ? 8 : 0 }, 0, true);
    window.jaxFixture = { image, canvas, renderer, jax, poses, getFrame };
    return { ready, source: jax.animation.src, width: image.width, height: image.height, cells, composites, unchanged: before === JSON.stringify(actor) };
  });
  report.measurements = metrics;
  assert.equal(metrics.ready.ok, true); assert.ok(metrics.source.endsWith('cainos-jax-animation-sheet-0.5.0.png')); assert.deepEqual([metrics.width, metrics.height], [1536, 1024]);
  checked('Jax utilise la nouvelle feuille transparente 0.5.0 de 1536 × 1024 pixels', 'La source historique reste distincte ; huit cellules 4 × 2.');
  assert.equal(metrics.cells.length, 8); assert.ok(metrics.cells.every(c => c.borderMax < 12 && c.visible > 10000));
  checked('Les huit cellules ont des bords sans fragment visible et une silhouette opaque complète', metrics.cells.map(c => ({ index: c.index, borderMax: c.borderMax, visible: c.visible })));
  assert.ok(metrics.cells.every(c => c.purple > 1000 && c.pink > 1000 && c.yellow > 100));
  checked('Les huit cellules contiennent les familles violet, rose et jaune attendues', 'Mesures de pixels opaques par familles de teinte ; pas une certification anatomique ou canonique.');
  assert.ok(metrics.cells.every(c => c.opaqueRgbChanges === 0 && c.alphaChanges === 0));
  checked('L’extraction Canvas conserve les couleurs opaques et l’alpha visible de la nouvelle source', 'Aucune correction de palette à l’exécution sur Jax.');
  assert.ok(metrics.cells.every(c => c.registration?.id === 'jax' && c.registration.index === c.index));
  assert.equal(new Set(metrics.cells.map(c => c.scale)).size, 1);
  checked('Les huit racines mesurées gardent une échelle uniforme entre les cellules', metrics.cells.map(c => ({ index: c.index, root: c.root, scale: c.scale })));
  assert.ok(metrics.composites.every(c => c.corners.every(pixel => pixel.every((v, i) => Math.abs(v - c.color[i]) <= 1))));
  checked('La transparence compose correctement sur fond blanc, cyan et sombre', 'Les coins des huit cellules suivent la couleur du fond sans rectangle opaque.');
  assert.ok(metrics.cells.every(c => !c.lowRig && c.scale === c.oppositeScale && c.flip === -c.oppositeFlip));
  checked('Jax conserve son dessin entier en posture basse et change de face sans étirement', 'Ancien rig découpé désactivé ; même échelle uniforme dans les deux directions.');
  assert.equal(metrics.unchanged, true);
  checked('Les états de rendu de Jax ne modifient aucune donnée de l’acteur', 'Idle, marche, bas, garde et réaction exécutés en mode réduit.');
  for (const [label, color] of [['white', '#ffffff'], ['cyan', '#00e6e6'], ['dark', '#152133']]) {
    await page.evaluate(color => { const { image, canvas } = window.jaxFixture; canvas.width = 1536; canvas.height = 1024; const ctx = canvas.getContext('2d'); ctx.fillStyle = color; ctx.fillRect(0, 0, 1536, 1024); ctx.drawImage(image, 0, 0); }, color);
    const filename = `encore-jax-${label}.png`; await page.locator('canvas').screenshot({ path: path.join(output, filename) }); report.screenshots.push(filename);
  }
  await page.evaluate(() => {
    const { image, canvas } = window.jaxFixture;
    canvas.width = 1536; canvas.height = 1100; const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#152133'; ctx.fillRect(0, 0, 1536, 1100); ctx.fillStyle = '#f5eddf'; ctx.font = 'bold 28px system-ui'; ctx.fillText('Jax · violet, salopette rose, yeux et gants jaunes', 24, 38); ctx.fillStyle = '#bdcddd'; ctx.font = '17px system-ui'; ctx.fillText('Feuille régénérée transparente · huit illustrations réutilisées · poses de combat dédiées encore à produire', 24, 66); ctx.drawImage(image, 0, 76);
  });
  await page.locator('canvas').screenshot({ path: path.join(output, 'encore-jax-palette.png') }); report.screenshots.push('encore-jax-palette.png');
  assert.deepEqual(report.errors, []); checked('Aucune erreur JavaScript, Canvas ou ressource locale sur la nouvelle feuille Jax', 'Quatre captures : fonds blanc, cyan, sombre et planche annotée.');
  report.ok = true;
} catch (error) { report.ok = false; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1; }
finally { if (browser) await browser.close(); await fs.writeFile(path.join(output, 'render-jax-browser-report.json'), `${JSON.stringify(report, null, 2)}\n`); }

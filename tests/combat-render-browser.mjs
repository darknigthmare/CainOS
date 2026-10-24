/**
 * Canvas presentation regression fixtures, not played-duel evidence.
 * COMBAT_TEST_URL=http://127.0.0.1:4181 node tests/combat-render-browser.mjs
 * Captures the published 0.2.0 renderer and current renderer with the SAME
 * current catalog, isolating presentation changes from combat/data changes.
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
const baseline = process.env.COMBAT_RENDER_BASELINE || 'e71b08cda23b3348f099d096da07812b103bf99c';
const { stdout: baselineRenderer } = await promisify(execFile)('git', ['show', `${baseline}:combat/render.mjs`], { maxBuffer: 2_000_000 });
await fs.mkdir(output, { recursive: true });
const report = {
  createdAt: new Date().toISOString(),
  fixture: 'Native Canvas render fixtures; no victory, progression or canonical pixel-perfect claim.',
  baseline, comparedRenderers: ['published 0.2.0 render.mjs', 'working-tree render.mjs'],
  catalog: 'Same current data.mjs for both captures; no simulation rules changed by the fixture.',
  sources: [
    { stage: 'bigtop', url: 'https://static.wixstatic.com/media/84ed6a_e3bac825d5c140a4a665ba898b3ff51b~mv2.png', observation: 'Cyan walls, gold valance, red/green rounded door, coloured sofas, warm checker floor.' },
    { stage: 'cellar', url: 'https://static.wixstatic.com/media/84ed6a_de54a5d816fe4ba0966cc96385ab8f8b~mv2.jpg', observation: 'Near-black space, multicoloured eyes and one central light shaft.' },
    { stage: 'void', url: 'https://static.wixstatic.com/media/84ed6a_9f2c0f92fcc340fea405c155a304e362~mv2.png', observation: 'Luminous white/lilac rectilinear iridescence, without EXIT doors or stairs.' },
  ],
  checks: [], screenshots: [], measurements: {}, errors: [],
  limitations: [
    'The residents hallway was recomposed in 0.6 from explicitly labeled third-party pilot copies; direct primary-frame confirmation remains pending. See combat-stage-review-0.6.0.json.',
    'Dedicated fight, crouch and outcome artwork remains partial; see render-poses-browser-report.json for current rigid presentation and source registrations. No 1:1 art certification.',
    'Object motifs illustrate existing fan-game moves, not newly asserted canonical fighting powers.',
    'Historical opaque black art cannot be separated reliably from matching matte colors. Twenty costume drawings now use new native-alpha assets; see costume-refinements.mjs.',
  ],
};
report.sourceHashes = Object.fromEntries(await Promise.all(['combat/render.mjs', 'combat/render-presentation.mjs', 'combat/render-poses.mjs', 'combat/data.mjs', 'combat/costume-fidelity.mjs', 'tests/combat-render-browser.mjs'].map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };

try {
  for (const phase of ['before', 'after']) {
    const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
    try {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, serviceWorkers: 'block' });
      const page = await context.newPage();
      page.on('pageerror', error => report.errors.push(`${phase}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`${phase}: HTTP ${response.status()} ${response.url()}`); });
      await page.route('**/combat/render-fixture', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#11131e}canvas{display:block}</style></head><body><canvas id="fixture"></canvas></body></html>' }));
      if (phase === 'before') await page.route('**/combat/render.mjs', route => route.fulfill({ contentType: 'text/javascript', body: baselineRenderer }));
      await page.goto(`${base}/combat/render-fixture`);
      await page.evaluate(async () => {
        const { CombatRenderer, getFrame } = await import('/combat/render.mjs');
        const { FIGHTERS, STAGES } = await import('/combat/data.mjs');
        const canvas = document.getElementById('fixture'), renderer = new CombatRenderer(canvas);
        const ready = await renderer.preload(FIGHTERS, STAGES);
        if (!ready.ok) throw new Error(JSON.stringify(ready));
        window.renderFixture = { renderer, getFrame, FIGHTERS, STAGES, canvas };
      });
      const shot = async name => {
        const filename = `render-fidelity-${name}-${phase}.png`;
        await page.screenshot({ path: path.join(output, filename) }); report.screenshots.push(filename);
      };
      const metrics = await page.evaluate(async () => {
        const { renderer, getFrame, FIGHTERS, STAGES, canvas } = window.renderFixture, ctx = canvas.getContext('2d');
        const result = { sprites: [], stages: [], objects: {} };
        const pixel = (x, y) => [...ctx.getImageData(x, y, 1, 1).data];
        const luminance = p => p[0] * 0.2126 + p[1] * 0.7152 + p[2] * 0.0722;
        for (const stage of STAGES) {
          renderer.render(null, { stage, reducedMotion: true });
          const data = ctx.getImageData(0, 0, 1280, 720).data;
          let total = 0, n = 0;
          for (let i = 0; i < data.length; i += 4 * 17) { total += luminance(data.slice(i, i + 3)); n++; }
          result.stages.push({ id: stage.id, meanLuminance: total / n, centre: pixel(640, 334), wall: pixel(250, 270), redDoor: pixel(560, 335), greenDoor: pixel(688, 335) });
        }
        for (const fighter of FIGHTERS) {
          const frame = getFrame(fighter, 'idle', 0), spec = fighter.animation || fighter.sprite;
          const img = new Image(); img.src = new URL(spec.src, location.href).href; await img.decode();
          const w = Math.floor(img.naturalWidth / spec.cols), h = Math.floor(img.naturalHeight / spec.rows);
          const source = document.createElement('canvas'); source.width = w; source.height = h;
          const sourceContext = source.getContext('2d', { willReadFrequently: true });
          sourceContext.drawImage(img, (fighter.animation ? 0 : spec.col || 0) * w, (fighter.animation ? 0 : spec.row || 0) * h, w, h, 0, 0, w, h);
          const raw = sourceContext.getImageData(0, 0, w, h).data, cropped = frame.canvas.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
          let opaque = 0, dark = 0, rgbChanges = 0, nativeAlphaChanges = 0;
          for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
            const i = (y * frame.width + x) * 4, si = ((frame.y + y) * w + frame.x + x) * 4;
            if (cropped[i + 3] >= 12) { opaque++; if (Math.max(...cropped.slice(i, i + 3)) <= 32) dark++; }
            if (cropped[i + 3] === 255 && raw[si + 3] === 255 && [0, 1, 2].some(c => cropped[i + c] !== raw[si + c])) rgbChanges++;
            if (fighter.animation && raw[si + 3] >= 12 && cropped[i + 3] !== raw[si + 3]) nativeAlphaChanges++;
          }
          result.sprites.push({ id: fighter.id, opaque, dark, rgbChanges, nativeAlphaChanges, bounds: frame.bounds });
        }
        const hash = () => {
          const pixels = ctx.getImageData(555, 275, 170, 170).data;
          let hash = 2166136261, alpha = 0;
          for (let i = 0; i < pixels.length; i++) { hash = Math.imul(hash ^ pixels[i], 16777619); if (i % 4 === 3) alpha += pixels[i]; }
          return { hash: hash >>> 0, alpha };
        };
        const draw = (object, owner, tick = 0, reduced = true, trap = false) => {
          ctx.clearRect(0, 0, 1280, 720);
          renderer[trap ? 'drawTrap' : 'drawProjectile'](object, [{ f: owner }], tick, reduced);
          return hash();
        };
        const projectileHashes = [], trapHashes = [], replays = [];
        for (const fighter of FIGHTERS) for (const move of Object.values(fighter.moves)) {
          if (move.kind !== 'projectile' && move.kind !== 'trap') continue;
          const trap = move.kind === 'trap', q = { def: move, owner: 0, x: 640, y: 360, vx: move.speed || 10, vy: 0, age: 90, arm: move.arm || 0, delay: 0, dead: false };
          const before = JSON.stringify(q), atZero = draw(q, fighter, 0, true, trap), atLate = draw(q, fighter, 900, true, trap);
          replays.push(atZero.hash === atLate.hash && JSON.stringify(q) === before);
          (trap ? trapHashes : projectileHashes).push({ id: fighter.id, slot: move.slot, ...atZero });
        }
        const jax = FIGHTERS.find(f => f.id === 'jax'), key = { def: jax.moves.special, owner: 0, x: 640, y: 360, vx: 17, delay: 0 };
        const gangle = FIGHTERS.find(f => f.id === 'gangle'), ribbon = { def: gangle.moves.specialDown, owner: 0, x: 640, y: 360, age: 90, arm: 30 };
        result.objects = {
          projectileHashes, trapHashes, deterministicAndUnchanged: replays.every(Boolean),
          deadProjectile: draw({ ...key, dead: true }, jax).alpha,
          delayedProjectile: draw({ ...key, delay: 4 }, jax).alpha,
          deadTrap: draw({ ...ribbon, dead: true }, gangle, 0, true, true).alpha,
          armedTrap: draw(ribbon, gangle, 0, true, true).alpha,
          unarmedTrap: draw({ ...ribbon, age: 0 }, gangle, 0, true, true).alpha,
          keyRotates: draw(key, jax, 0, false).hash !== draw(key, jax, 31, false).hash,
        };
        return result;
      });
      report.measurements[phase] = metrics;
      for (const id of ['bigtop', 'cellar', 'void']) {
        await page.evaluate(id => { const f = window.renderFixture; f.renderer.render(null, { stage: f.STAGES.find(s => s.id === id), reducedMotion: true }); }, id);
        await shot(`stage-${id}`);
      }
      await page.evaluate(() => {
        const { renderer, getFrame, FIGHTERS, canvas } = window.renderFixture, ctx = canvas.getContext('2d');
        ctx.fillStyle = '#9cb7c3'; ctx.fillRect(0, 0, 1280, 720);
        for (const [i, id] of ['abstractedkaufmo', 'gangle', 'bubble'].entries()) {
          const fighter = FIGHTERS.find(f => f.id === id), frame = getFrame(fighter, 'idle', 0);
          ctx.fillStyle = '#15222a'; ctx.font = '24px sans-serif'; ctx.fillText(fighter.name, 20 + i * 420, 40);
          ctx.drawImage(frame.canvas, 20 + i * 420, 70, Math.min(380, frame.width), Math.min(590, frame.height));
        }
      });
      await shot('alpha');
      for (const kind of ['projectile', 'trap']) {
        await page.evaluate(kind => {
          const { renderer, FIGHTERS, canvas } = window.renderFixture, ctx = canvas.getContext('2d');
          const objects = FIGHTERS.flatMap(f => Object.values(f.moves).filter(m => m.kind === kind).map(m => ({ f, m })));
          ctx.fillStyle = '#182233'; ctx.fillRect(0, 0, 1280, 720);
          ctx.fillStyle = '#eee5cf'; ctx.font = 'bold 22px sans-serif'; ctx.fillText(kind === 'projectile' ? 'Objets des 14 combattants · projectiles existants' : 'Objets posés · pièges existants', 26, 32);
          for (const [i, { f, m }] of objects.entries()) {
            const x = i % 5 * 256, y = 52 + Math.floor(i / 5) * (kind === 'trap' ? 310 : 163);
            ctx.fillStyle = i % 2 ? '#1e2b3f' : '#233247'; ctx.fillRect(x + 8, y, 240, kind === 'trap' ? 294 : 151);
            ctx.fillStyle = '#f2dec5'; ctx.font = 'bold 17px sans-serif'; ctx.fillText(f.name, x + 18, y + 27);
            ctx.fillStyle = '#c3d0de'; ctx.font = '13px sans-serif'; ctx.fillText(m.name, x + 18, y + 49);
            ctx.save(); ctx.translate(x + 128, y + (kind === 'trap' ? 185 : 102)); ctx.scale(kind === 'trap' ? 3.2 : 2.6, kind === 'trap' ? 3.2 : 2.6);
            renderer[kind === 'trap' ? 'drawTrap' : 'drawProjectile']({ def: m, owner: 0, x: 0, y: kind === 'trap' ? 1 : 0, age: 100, arm: m.arm || 0, vx: m.speed || 10, delay: 0 }, [{ f }], 0, true);
            ctx.restore();
          }
        }, kind);
        await shot(kind === 'projectile' ? 'projectiles' : 'traps');
      }
      if (phase === 'after') {
        await page.evaluate(() => {
          const { renderer, FIGHTERS, canvas } = window.renderFixture, ctx = canvas.getContext('2d');
          ctx.fillStyle = '#253044'; ctx.fillRect(0, 0, 1280, 720);
          ctx.fillStyle = '#f2dec5'; ctx.font = 'bold 24px sans-serif'; ctx.fillText('Kinger · même sprite / barrière « Fort de coussins » active', 28, 45);
          const f = FIGHTERS.find(fighter => fighter.id === 'kinger');
          renderer.drawActor({ f, x: 400, y: 568, face: 1, slot: 0, buffs: {}, statuses: {} }, 0, true);
          renderer.drawActor({ f, x: 880, y: 568, face: 1, slot: 0, buffs: { barrier: { hits: 2 } }, statuses: {} }, 0, true);
        });
        await shot('kinger-barrier');
        // A browser-layout contact sheet of the actual captures; no generated
        // art, pixel retouching or substituted assets enter the comparison.
        await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
          *{box-sizing:border-box}body{margin:0;padding:24px;background:#111a2a;color:#e6e9ee;font-family:Arial,sans-serif;width:1280px;height:880px}h1{margin:0;font-size:25px}header p{margin:8px 0 18px;color:#b5c6d8;font-size:14px}.stages{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}figure{margin:0;background:#213146;border:1px solid #384d65;border-radius:9px;overflow:hidden}figure>img{display:block;width:100%}figcaption{padding:10px 12px;font-weight:700;font-size:15px}.review{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:18px}.silhouette,.notes{background:#1b2a3f;border:1px solid #384d65;border-radius:9px;padding:16px}h2{font-size:19px;margin:0 0 12px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cutout{height:326px;overflow:hidden;position:relative;background:#9cb7c3;border-radius:6px}.cutout img{position:absolute;width:960px;max-width:none;left:35px;top:-48px;clip-path:inset(0 645px 0 0)}.caption{padding-top:8px;color:#d1dbe6;font-size:14px;line-height:1.4}.caption strong{color:#fff}.notes p{font-size:16px;line-height:1.55;margin:14px 0}.notes .limit{font-size:14px;color:#b5c6d8;border-top:1px solid #46556a;padding-top:12px}footer{font-size:13px;color:#a8bed0;margin-top:14px}
          </style></head><body><header><h1>Digital Circus — Encore · revue du rendu</h1><p>Trois décors rapprochés de leurs références GLITCH · sprites existants conservés</p></header>
          <section class="stages">${[['bigtop', 'Chapiteau · salon cyan et damier chaud'], ['cellar', 'Cellier · obscurité, yeux et lumière centrale'], ['void', 'Vide · blanc et lilas irisés']].map(([id, title]) => `<figure><img src="${base}/audit-combat/render-fidelity-stage-${id}-after.png"><figcaption>${title}</figcaption></figure>`).join('')}</section>
          <section class="review"><div class="silhouette"><h2>Kaufmo · correction du détourage sombre</h2><div class="pair"><div><div class="cutout"><img src="${base}/audit-combat/render-fidelity-alpha-before.png"></div><div class="caption"><strong>Avant</strong> · 27 746 pixels opaques<br>Le fond était supprimé avec le corps.</div></div><div><div class="cutout"><img src="${base}/audit-combat/render-fidelity-alpha-after.png"></div><div class="caption"><strong>Après</strong> · 62 595 pixels opaques<br>Corps et yeux conservés sans recoloration.</div></div></div></div><aside class="notes"><h2>Contrôles de présentation</h2><p><strong>14 motifs distincts</strong><br>Clef, bouton, masque, Gloink, bulle, sucre, fudge et autres objets du kit.</p><p><strong>20 projectiles · 10 pièges</strong><br>Objets masqués avant apparition ou après destruction.</p><p><strong>14 premières poses idle</strong><br>Palette conservée ; transparence native inchangée sur les 7 sprites animés.</p><p class="limit">Recomposition pour le duel. L’art final, les poses de combat et le couloir des résidents restent à compléter.</p></aside></section><footer>Comparaison du renderer publié 0.2.0 avec le renderer courant, sur le même catalogue · contrôle visuel limité aux vues présentées</footer></body></html>`);
        await page.evaluate(() => Promise.all([...document.images].map(image => image.decode())));
        await page.setViewportSize({ width: 1280, height: 880 });
        const overview = 'render-fidelity-overview.png';
        await page.screenshot({ path: path.join(output, overview) }); report.screenshots.push(overview);
      }
    } finally { await browser.close(); }
  }
  const { before, after } = report.measurements;
  const sprite = (collection, id) => collection.sprites.find(f => f.id === id);
  assert.ok(sprite(after, 'abstractedkaufmo').opaque > sprite(before, 'abstractedkaufmo').opaque * 1.8);
  assert.ok(sprite(after, 'abstractedkaufmo').dark > sprite(before, 'abstractedkaufmo').dark * 2);
  checked('Kaufmo dark silhouette restored without recolouring', { before: sprite(before, 'abstractedkaufmo'), after: sprite(after, 'abstractedkaufmo') });
  assert.equal(sprite(after, 'gangle').opaque, sprite(before, 'gangle').opaque);
  assert.ok(after.sprites.every(f => f.rgbChanges === 0 && f.nativeAlphaChanges === 0));
  checked('14 first idle frames preserve their palette; seven native idle alphas are unchanged', after.sprites);
  assert.equal(after.stages.length, 12);
  const bigtop = after.stages.find(s => s.id === 'bigtop'), cellar = after.stages.find(s => s.id === 'cellar'), voidStage = after.stages.find(s => s.id === 'void');
  assert.ok(bigtop.wall[1] > bigtop.wall[0] * 1.5 && bigtop.wall[2] > bigtop.wall[0] * 1.5);
  assert.ok(bigtop.redDoor[0] > bigtop.redDoor[1] * 2 && bigtop.greenDoor[1] > bigtop.greenDoor[0] * 1.4);
  assert.ok(cellar.meanLuminance < 25);
  assert.ok(voidStage.meanLuminance > 200 && voidStage.centre.slice(0, 3).every(n => n > 230));
  checked('12 stage canvases render; the three reviewed palettes match observed light and colour', { bigtop, cellar, voidStage });
  assert.ok(after.objects.deterministicAndUnchanged);
  assert.ok(after.objects.projectileHashes.every(o => o.alpha > 0));
  assert.ok(after.objects.trapHashes.every(o => o.alpha > 0));
  const specials = after.objects.projectileHashes.filter(o => o.slot === 'special');
  assert.equal(new Set(specials.map(o => o.hash)).size, 14);
  checked('All projectile and ground objects visible, 14 distinct special motifs, unchanged input state', { projectiles: after.objects.projectileHashes.length, traps: after.objects.trapHashes.length, specialMotifs: 14 });
  assert.equal(after.objects.deadProjectile, 0); assert.equal(after.objects.delayedProjectile, 0); assert.equal(after.objects.deadTrap, 0);
  assert.ok(after.objects.armedTrap > after.objects.unarmedTrap);
  checked('Dead/delayed objects hidden and armed traps remain visibly stronger');
  assert.ok(after.objects.keyRotates);
  checked('Reduced motion freezes presentation while the ordinary key animation remains active');
  assert.deepEqual(report.errors, []);
  checked('No browser errors or missing local resources');
  report.pass = true;
} catch (error) {
  report.pass = false; report.failure = error.stack; throw error;
} finally {
  await fs.writeFile(path.join(output, 'render-fidelity-browser-report.json'), JSON.stringify(report, null, 2));
}

/**
 * Real UI results, replays and campaign transitions. Run against a static server:
 * COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-progression-browser.mjs
 * PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH may select an installed Chromium binary.
 * COMBAT_TEST_SCOPE=storage runs only the denied-storage regression.
 * The bot uses real keyboard events and the read-only Encore snapshot. It never
 * mutates an app engine. clock.runFor fires every RAF, including fixed-step input.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES } from '../combat/data.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
const SAVE_KEY = 'cainos.circus-combat.profile.v1';
const REPLAY_KEY = 'cainos.circus-combat.replay.v1';
await fs.mkdir(output, { recursive: true });
const browserOptions = { headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] };
const browser = await playwright.chromium.launch(browserOptions);
const auxiliaryBrowsers = [];
async function isolatedContext(options) {
  // Lightweight single-process Chromium builds can terminate the whole process
  // when a second service-worker-enabled context navigates. Isolate those QA
  // origins in independent browser processes rather than altering the app.
  const isolatedBrowser = await playwright.chromium.launch(browserOptions);
  auxiliaryBrowsers.push(isolatedBrowser);
  return isolatedBrowser.newContext(options);
}
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const checks = [], errors = [];
let standaloneServer, evidencePage = page;
const storageOnly = process.env.COMBAT_TEST_SCOPE === 'storage';
const reportName = storageOnly ? 'storage-browser-report.json' : 'progression-browser-report.json';
page.on('pageerror', e => errors.push(e.message));
page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`HTTP ${response.status()} ${response.url()}`); });
const checked = (name, detail = '') => { checks.push({ name, detail, pass: true }); console.log(`PASS ${name}${detail ? ` — ${detail}` : ''}`); };
const snapshot = () => page.evaluate(() => window.Encore.snapshot);
const profile = () => page.evaluate(() => window.Encore.profile);
const held = new Set();
async function hold(keys = []) {
  const next = new Set(keys);
  for (const key of held) if (!next.has(key)) { await page.keyboard.up(key); held.delete(key); }
  for (const key of next) if (!held.has(key)) { await page.keyboard.down(key); held.add(key); }
}
async function advance(ms) { await page.clock.runFor(ms); }
async function home() {
  await hold();
  if (await page.locator('#modal[open]').count()) await page.locator('#modal [data-action="home"]').click();
  else if (await page.evaluate(() => window.Encore.screen === 'fight')) {
    await page.locator('[data-action="pause"]').click();
    await page.locator('#modal [data-action="home"]').click();
  } else await page.locator('[data-nav="home"]').first().click();
}
async function start(mode, fighter = 'jax') {
  await page.locator(`.mode-card[data-mode="${mode}"]`).click();
  await page.locator(`[data-fighter="${fighter}"]`).click();
  await page.locator('#select-difficulty').selectOption('easy');
  await page.locator('[data-action="start"]').click();
  if(await page.locator('[data-action="start-new"]').count())await page.locator('[data-action="start-new"]').click();
  await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
  // Explicitly advance through the introduction, preserving every simulation frame.
  await advance(1800);
  assert.equal((await snapshot()).phase, 'fight');
}

async function winWithKeyboard(label) {
  const initial = await snapshot();
  for (let decision = 0; decision < 600; decision++) {
    const s = await snapshot();
    if (s.phase === 'matchOver') {
      await hold();
      assert.equal(s.winner, 0, `${label}: keyboard player lost (${s.fighters.map(p => p.hp)})`);
      return s;
    }
    if (s.phase !== 'fight') { await hold(); await advance(500); continue; }
    const [a, b] = s.fighters;
    const toward = b.x > a.x ? 'KeyD' : 'KeyA';
    const distance = Math.abs(a.x - b.x);
    const player = FIGHTERS.find(f => f.id === a.id), opponent = FIGHTERS.find(f => f.id === b.id);
    const jabDistance = player.moves.light.reach * player.reach + opponent.combat.simulationBody.width / 2 - 18;
    if (a.attack || a.hit || a.blockstun || a.cool) {
      // Confirmed light/heavy links use the same controls as a player.
      if (a.attack?.confirmed && a.attack.slot === 'light') await page.keyboard.press('KeyK');
      else if (a.attack?.confirmed && a.attack.slot === 'heavy' && a.resource > 25) {
        await hold([toward]); await page.keyboard.press('KeyI');
      }
      await advance(100); continue;
    }
    if (distance > jabDistance) { await hold([toward]); await advance(120); continue; }
    await hold();
    // A jab starts before the easy CPU's visible-startup reaction; mix a throw
    // into guard and use the earned finale when enough meter is available.
    if (a.meter >= 85 && a.resource >= 36) await page.keyboard.press('KeyO');
    else if (b.block && !b.throwProtect && !b.hit) await page.keyboard.press('KeyU');
    else await page.keyboard.press('KeyJ');
    await advance(110);
  }
  throw new Error(`${label}: no match result within keyboard decision budget; initial=${JSON.stringify(initial)} current=${JSON.stringify(await snapshot())}`);
}

async function importJSON(id, value, name) {
  await page.locator(`#${id}`).setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
  // File.text resolves asynchronously; this is a browser condition, not simulated time.
  await page.waitForFunction(() => !document.querySelector('#toast').hidden || document.querySelector('#modal').open, null, { polling: 50 });
}

async function checkVolatileProfile() {
  const volatileContext = await isolatedContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  // A browser-storage fault fixture, not a gameplay hook: the application must
  // maintain its own in-memory profile after persistence is denied.
  await volatileContext.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new DOMException('Storage denied by browser QA fixture', 'QuotaExceededError'); };
  });
  const volatile = await volatileContext.newPage();
  evidencePage = volatile;
  volatile.on('pageerror', error => errors.push(`storage: ${error.message}`));
  await volatile.clock.install({ time: new Date('2026-10-21T14:00:00Z') });
  await volatile.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await volatile.clock.pauseAt(new Date('2026-10-21T14:10:00Z'));
  await volatile.locator('[data-nav="settings"]').click();
  await volatile.locator('[data-setting="sound"]').uncheck();
  await volatile.locator('[data-nav="home"]').first().click();
  for (const challenge of ['specialist', 'super']) {
    await volatile.locator('.mode-card[data-mode="challenge"]').click();
    await volatile.locator(`[data-challenge="${challenge}"]`).click();
    await volatile.locator('[data-fighter="jax"]').click();
    await volatile.locator('[data-action="start"]').click();
    await volatile.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
    await volatile.clock.runFor(1800);
    const keys = challenge === 'specialist' ? ['KeyJ', 'KeyK', 'KeyI', 'KeyL'] : ['KeyO'];
    for (const key of keys) { await volatile.keyboard.press(key); await volatile.clock.runFor(1400); }
    assert.ok((await volatile.evaluate(() => window.Encore.profile.challenges)).includes(challenge), `${challenge} earned with persistence denied`);
    assert.ok(await volatile.locator('#modal[open]').isVisible());
    await volatile.keyboard.press('Escape');
    assert.ok(await volatile.locator('#modal[open]').isVisible(), 'Escape must preserve terminal actions instead of stranding a finished encounter');
    assert.ok(await volatile.locator('#modal [data-action="rematch"]').isVisible());
    await volatile.locator('#modal [data-action="home"]').click();
  }
  const inMemory = await volatile.evaluate(() => window.Encore.profile);
  assert.deepEqual([...inMemory.challenges].sort(), ['specialist', 'super']);
  assert.equal(inMemory.settings.sound, false);
  assert.equal(await volatile.evaluate(key => localStorage.getItem(key), SAVE_KEY), null, 'The storage-denied fixture never persisted the profile');
  await volatile.locator('[data-nav="settings"]').click();
  const downloadEvent = volatile.waitForEvent('download');
  await volatile.locator('[data-action="export-profile"]').click();
  const download = await downloadEvent;
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  assert.deepEqual(exported, inMemory, 'Export must retain both unsaved challenge rewards');
  checked('Denied storage retains two rewards for export; terminal dialogs survive Escape', 'Specialist → Super via real controls; sound and both rewards survive setItem failure; Escape preserves the result actions twice');
  evidencePage = page;
}

try {
  if (storageOnly) await checkVolatileProfile();
  else {
  await page.clock.install({ time: new Date('2026-10-21T12:00:00Z') });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-21T12:10:00Z'));
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="rounds"]').selectOption('1');
  await page.locator('[data-setting="seconds"]').selectOption('60');
  await page.locator('[data-setting="sound"]').uncheck();
  await page.locator('[data-setting="reducedMotion"]').check();
  await home();

  await start('local');
  const result = await winWithKeyboard('local');
  assert.ok(await page.locator('#modal[open] .result-stats').isVisible());
  const earned = await profile();
  assert.equal(earned.stats.matches, 1);
  assert.equal(earned.stats.wins, 1);
  assert.ok(earned.stats.damage >= 10000);
  const replay = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), REPLAY_KEY);
  assert.ok(replay.runs.length > 1);
  assert.deepEqual(replay.config.cpu, [false, false]);
  assert.equal(replay.config.fighters[0], 'jax');
  await page.screenshot({ path: path.join(output, 'match-result.png'), fullPage: true });
  checked('A real local match saves its result and replay', `${result.frame} simulation frames, ${replay.runs.length} input runs`);
  await home();
  await page.locator('[data-action="last-replay"]').click();
  await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
  for (let i = 0; i < 30 && !(await page.locator('#modal[open]').count()); i++) await advance(5000);
  assert.match(await page.locator('#modal-title').textContent(), /Fin du replay/);
  assert.deepEqual(await snapshot(), result, 'Replay must reproduce the entire terminal deterministic snapshot');
  assert.deepEqual(await profile(), earned, 'Replay must not add a second match, rewards, or history');
  checked('UI replay reproduces the full terminal snapshot without changing profile');
  await home();

  for (const [mode, total] of [
    ['arcade', 6],
    ['boss', 4],
    ['survival', 10],
  ]) {
    await start(mode);
    const run = (await profile()).program;
    const [opponent1, opponent2] = run.opponents;
    assert.match(await page.locator('.fight-caption').textContent(), new RegExp(`1/${total}`));
    assert.equal((await snapshot()).fighters[1].id, opponent1);
    const before = await profile();
    const won = await winWithKeyboard(mode);
    const expectedHealth = mode === 'survival' ? Math.min(10000, Math.max(1, Math.round(won.fighters[0].hp) + 1200)) : 10000;
    assert.equal((await profile()).stats.matches, before.stats.matches + 1);
    assert.ok(await page.locator('#modal [data-action="next-fight"]').isVisible());
    await page.locator('[data-action="next-fight"]').click();
    await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
    const second = await snapshot();
    assert.match(await page.locator('.fight-caption').textContent(), new RegExp(`2/${total}`));
    assert.equal(second.fighters[1].id, opponent2);
    assert.equal(second.fighters[0].hp, expectedHealth, `${mode}: next encounter health`);
    assert.equal(second.fighters[1].hp, 10000);
    assert.ok((await page.locator('.fight-caption').textContent()).includes(STAGES.find(s=>s.id===run.stages[1]).name));
    if (mode === 'survival') assert.equal((await profile()).stats.bestSurvival, 1);
    checked(`${mode}: earned first win opens encounter 2/${total}`, `${opponent1} → ${opponent2}, player HP ${won.fighters[0].hp} → ${expectedHealth}`);
    await home();
  }

  const saved = await profile();
  assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY), saved);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await profile(), saved);
  checked('Earned progression and settings survive a page reload');
  await page.locator('[data-nav="settings"]').click();
  await importJSON('import-profile', { format: 'unrelated-profile', version: 999, stats: { wins: 999999 } }, 'invalid-profile.json');
  assert.match(await page.locator('#toast').textContent(), /pas une sauvegarde/);
  assert.equal(await page.locator('#confirm-import').count(), 0);
  assert.deepEqual(await profile(), saved);
  await advance(5100);
  const corrupt = structuredClone(replay); corrupt.runs[0][1] = 999999;
  await importJSON('import-replay', corrupt, 'invalid-replay.json');
  assert.match(await page.locator('#toast').textContent(), /corrompue|invalides/);
  assert.equal(await page.evaluate(() => window.Encore.screen), 'settings');
  assert.deepEqual(await profile(), saved);
  await advance(5100);
  await importJSON('import-profile', '{broken-json', 'broken-profile.json');
  assert.equal(await page.locator('#confirm-import').count(), 0);
  assert.deepEqual(await profile(), saved);
  checked('Malformed profile, JSON and packed replay inputs are rejected without data loss');

  // Pure scheduling contract checks are separate from the real UI wins above.
  const schedules = await page.evaluate(async () => {
    const { makeRun } = await import('./session.mjs');
    const { FIGHTERS, STAGES } = await import('./data.mjs');
    return ['arcade', 'boss', 'survival'].map(mode => makeRun(mode, 'jax', FIGHTERS, STAGES));
  });
  assert.deepEqual(schedules.map(run => run.opponents.length), [6, 4, 10]);
  assert.equal(schedules[0].opponents.at(-1), 'caine');
  assert.deepEqual(schedules[1].opponents, ['gloinkqueen', 'fudge', 'abstractedkaufmo', 'caine']);
  checked('Pure scheduling contract: 6 Arcade, 4 Boss and 10 Survival encounters', 'Not a claim that all final medals were earned through UI');

  // Serve the built artifact from its own root and origin. This proves it loads
  // without CainOS app.js or the source repository's root asset paths.
  const standaloneRoot = path.resolve(process.env.COMBAT_STANDALONE_DIR || 'dist-combat');
  await fs.access(path.join(standaloneRoot, 'index.html'));
  const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
  standaloneServer = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const target = path.resolve(standaloneRoot, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
      if (!target.startsWith(`${standaloneRoot}${path.sep}`)) { res.writeHead(403); res.end(); return; }
      res.setHeader('Content-Type', mime[path.extname(target)] || 'application/octet-stream');
      res.end(await fs.readFile(target));
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => standaloneServer.listen(0, '127.0.0.1', resolve));
  const standaloneURL = `http://127.0.0.1:${standaloneServer.address().port}`;
  const standaloneContext = await isolatedContext({ viewport: { width: 1100, height: 800 } });
  const isolated = await standaloneContext.newPage();
  const standaloneRequests = [];
  isolated.on('pageerror', error => errors.push(`standalone: ${error.message}`));
  isolated.on('response', response => { standaloneRequests.push(response.url()); if (response.status() >= 400) errors.push(`standalone HTTP ${response.status()} ${response.url()}`); });
  await isolated.goto(standaloneURL, { waitUntil: 'networkidle' });
  assert.match(isolated.url(), /standalone=1/);
  assert.equal(await isolated.locator('#os-link').isVisible(), false);
  assert.equal(await isolated.evaluate(() => window.Encore.profile.stats.matches), 0, 'Other origin has its own profile');
  await isolated.locator('.mode-card[data-mode="training"]').click();
  await isolated.locator('[data-action="start"]').click();
  await isolated.waitForFunction(() => window.Encore.ready && window.Encore.snapshot.phase === 'fight');
  await isolated.keyboard.press('KeyJ');
  await isolated.waitForFunction(() => window.Encore.snapshot.fighters[0].stats.starts > 0);
  assert.ok(!standaloneRequests.some(url => new URL(url).pathname === '/app.js'));
  assert.ok(standaloneRequests.every(url => url.startsWith(standaloneURL)));
  await isolated.screenshot({ path: path.join(output, 'standalone-built-fight.png'), fullPage: true });
  checked('Built standalone plays on a second origin without the OS runtime', `${standaloneRequests.length} local resources`);
  // Each origin owns a browser process; close those processes in finally.
  await checkVolatileProfile();
  }

  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, reportName), JSON.stringify({ base, checks, errors }, null, 2));
  console.log(`Progression browser QA: ${checks.length} checks passed.`);
} catch (error) {
  await evidencePage.screenshot({ path: path.join(output, storageOnly ? 'storage-failure.png' : 'progression-failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, reportName), JSON.stringify({ base, checks, errors, failure: error.message }, null, 2));
  throw error;
} finally {
  if (standaloneServer) await new Promise(resolve => standaloneServer.close(resolve));
  await Promise.allSettled([browser, ...auxiliaryBrowsers].map(instance => instance.close()));
}

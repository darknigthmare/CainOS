/** Focused public-UI journeys for static selection on limited-memory browsers.
 * Supplements, never replaces, the full 64-artist accessibility CI gate.
 * Native selectOption changes jump directly to the named outfit; confirmation
 * and undo use ordinary keyboard events. No application state is assigned.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { SAVE_KEY, REPLAY_KEY } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) { if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error; playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href); }
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178').replace(/\/$/, '');
const output = path.resolve('audit-combat/static-selection');
await fs.mkdir(output, { recursive: true });
const sourceFiles = ['combat/app.mjs', 'combat/selection-presentation.mjs', 'combat/index.html', 'combat/style.css', 'tests/combat-selection-browser.mjs'];
const hashes = async () => Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
const report = { schema: 'encore-static-selection-browser/v1', generatedAt: new Date().toISOString(), sourceHashes: await hashes(),
  scope: 'Focused desktop public menu and 390px standalone entry; real keyboard activation, native select changes and one delayed HTTP image response.',
  limits: ['Does not replace the full64-artist accessibility suite.', 'No physical device or screen reader session.', 'No canonical1:1 or authored entrance/exit animation claim.'], checks: [], errors: [], pass: false };
const record = (name, detail) => { report.checks.push({ name, pass: true, ...(detail ? { detail } : {}) }); console.log('PASS ' + name); };
const launch = { headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] };
const press = async (page, selector) => { await page.locator(selector).focus(); await page.keyboard.press('Enter'); };
const focus = (page, selector) => page.waitForFunction(selector => document.activeElement?.matches(selector), selector);
const saved = page => page.evaluate(({ save, replay }) => ({ profile: JSON.stringify(window.Encore.profile), save: localStorage.getItem(save), replay: localStorage.getItem(replay) }), { save: SAVE_KEY, replay: REPLAY_KEY });
const watch = page => page.on('pageerror', error => report.errors.push(error.message));
let browser, page;
try {
  browser = await playwright.chromium.launch(launch); report.browser = browser.version(); report.browserArgs = launch.args;
  // Route interception must reach HTTP, outside the service worker. The offline
  // suite retains service-worker coverage; this journey holds one real image.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  page = await context.newPage(); watch(page);
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.Encore?.screen === 'home');
  const before = await saved(page);
  await press(page, '.mode-card[data-mode="versus"]');
  await press(page, '[data-side="1"]'); await press(page, '[data-fighter="pomni"]');
  assert.deepEqual(await page.locator('[data-fighter="pomni"] .fighter-chip').allTextContents(), ['J1', 'J2']);
  assert.match(await page.locator('#selection-status').textContent(), /Adversaire : Pomni/);
  await page.evaluate(() => { window.__observedChoices = 0; new MutationObserver(() => window.__observedChoices++).observe(document.querySelector('#selection-status'), { childList: true }); });
  await page.keyboard.press('Enter'); assert.equal(await page.evaluate(() => window.__observedChoices), 0);
  record('the mirror displays both badges and unchanged confirmation is not announced again');

  await press(page, '[data-side="0"]'); await press(page, '[data-fighter="kaufmo"]');
  await press(page, '[data-side="1"]'); await press(page, '[data-fighter="max"]');
  await press(page, '#undo-selection-0'); await focus(page, '[data-fighter="pomni"]');
  assert.equal(await page.locator('[data-selection-artist="0"] h3').textContent(), 'Pomni');
  assert.equal(await page.locator('[data-selection-artist="1"] h3').textContent(), 'Max');
  assert.equal(await page.locator('#undo-selection-0').isDisabled(), true);
  assert.equal(await page.locator('#undo-selection-1').isDisabled(), false);
  await press(page, '#undo-selection-1'); await focus(page, '[data-fighter="pomni"]');
  record('each side undoes only its own latest choice and returns focus to the restored card');

  await page.locator('.selection-summary').scrollIntoViewIfNeeded();
  let release, started;
  const held = new Promise(resolve => { release = resolve; }), requested = new Promise(resolve => { started = resolve; });
  const pattern = '**/crossovers/murderdrones/pomni/hommage/selection.webp';
  const handler = async route => { started(); await held; await route.continue(); };
  await page.route(pattern, handler);
  try {
    await page.locator('#variant-0').selectOption('glitch-murderdrones-pomni-hommage');
    await Promise.race([requested, new Promise((_, reject) => setTimeout(() => reject(new Error('Delayed image was not requested')), 5000))]);
    assert.equal(await page.locator('[data-selection-artist="0"]').getAttribute('data-portrait-state'), 'loading');
    await page.locator('#variant-0').selectOption('glitch-murderdrones-pomni-resident');
    await page.waitForFunction(() => document.querySelector('[data-selection-artist="0"]').dataset.portraitState === 'ready');
    const pixels = await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas => canvas.toDataURL());
    const response = page.waitForResponse(response => response.url().endsWith('/crossovers/murderdrones/pomni/hommage/selection.webp'));
    release(); await response; await page.waitForTimeout(150);
    assert.equal(await page.locator('[data-selection-artist="0"]').getAttribute('data-appearance-id'), 'glitch-murderdrones-pomni-resident');
    assert.equal(await page.locator('[data-selection-artist="0"]').getAttribute('data-portrait-state'), 'ready');
    assert.equal(await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas => canvas.toDataURL()), pixels);
    assert.equal(await page.locator('[data-selection-artist="1"]').getAttribute('data-appearance-id'), 'pomni');
    record('a late image response cannot overwrite the current portrait pixels, status or opposite side');
    await press(page, '#undo-selection-0'); await focus(page, '[data-fighter="pomni"]');
    assert.equal(await page.locator('#variant-0').inputValue(), 'glitch-murderdrones-pomni-hommage');
    await page.waitForFunction(() => document.querySelector('[data-selection-artist="0"]').dataset.portraitState === 'ready');
    await page.locator('.selection-summary').screenshot({ path: path.join(output, 'desktop-static-selection.png') });
    record('undo restores the exact costume and keeps its native portrait');
  } finally {
    release();
    await page.unroute(pattern, handler).catch(error => { if (!page.isClosed()) throw error; });
  }

  await press(page, '.masthead nav [data-nav="home"]');
  assert.equal(await page.locator('#selection-status').textContent(), '');
  await press(page, '[data-mode="training"]');
  assert.equal(await page.locator('#undo-selection-0').isDisabled(), true);
  assert.equal(await page.locator('#undo-selection-1').isDisabled(), true);
  await press(page, '[data-fighter="pomni"]'); await press(page, '[data-action="start"]');
  await page.waitForFunction(() => window.Encore.ready);
  assert.equal(await page.evaluate(() => window.Encore.screen), 'fight');
  assert.equal(await page.locator('#selection-status').textContent(), '');
  await press(page, '[data-action="pause"]'); await press(page, '#modal [data-action="home"]');
  await press(page, '.mode-card[data-mode="versus"]');
  assert.equal(await page.locator('#undo-selection-0').isDisabled(), true);
  assert.equal(await page.locator('#undo-selection-1').isDisabled(), true);
  assert.deepEqual(await saved(page), before);
  record('actual match start requires no extra confirmation and leaving or re-entering clears temporary histories without saving anything');
  await browser.close(); browser = null;

  // A fresh process isolates the narrow-screen journey from decoded desktop art.
  browser = await playwright.chromium.launch(launch);
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  page = await mobile.newPage(); watch(page);
  await page.goto(base + '/combat/index.html?standalone=1', { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.Encore?.screen === 'home');
  const mobileBefore = await saved(page);
  assert.equal(await page.locator('#os-link').isHidden(), true);
  await press(page, '.mode-card[data-mode="versus"]');
  await press(page, '[data-fighter="jax"]'); await press(page, '#undo-selection-0'); await focus(page, '[data-fighter="pomni"]');
  await page.locator('.selection-summary').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-selection-artist="0"]').dataset.portraitState === 'ready');
  assert.equal(await page.locator('#undo-selection-0').isDisabled(), true);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const pixels = await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas => canvas.toDataURL());
  await page.waitForTimeout(150);
  assert.equal(await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas => canvas.toDataURL()), pixels);
  await page.locator('.selection-summary').screenshot({ path: path.join(output, 'mobile-static-selection.png') });
  assert.deepEqual(await saved(page), mobileBefore);
  record('390px standalone selection stays static with reduced motion, has no overflow and returns keyboard focus after undo');

  assert.deepEqual(report.errors, []); report.sourceHashesAfter = await hashes();
  assert.deepEqual(report.sourceHashesAfter, report.sourceHashes);
  record('tested source files stay unchanged and no JavaScript error occurs');
  report.pass = true;
} catch (error) { report.failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error); }
finally { await browser?.close(); report.completedAt = new Date().toISOString(); await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n'); console.log('ENCORE_SELECTION_SUMMARY ' + JSON.stringify({ pass: report.pass, checks: report.checks.length })); }

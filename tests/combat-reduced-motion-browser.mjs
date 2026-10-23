/** Public UI regression: observe real Canvas pixels while the match keeps advancing. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { GAME_VERSION, SAVE_KEY } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}

const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
const files = [
  'combat/app.mjs', 'combat/data.mjs', 'combat/render.mjs', 'combat/render-poses.mjs',
  'combat/render-sequences.mjs', 'combat/render-stage-motion.mjs', 'combat/style.css',
  'assets/images/cainos-jax-animation-sheet-0.5.0.png', 'tests/combat-reduced-motion-browser.mjs',
];
const hashes = async () => Object.fromEntries(await Promise.all(files.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
await fs.mkdir(output, { recursive: true });
const started = Date.now();
const report = {
  version: GAME_VERSION, createdAt: new Date().toISOString(), testUrl: `${base}/combat/`,
  command: 'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-reduced-motion-browser.mjs',
  executable: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || 'Playwright Chromium',
  checks: [], errors: [], measurements: {}, sourceHashesBefore: await hashes(),
  limitations: [
    'Chromium emulates the operating-system media preference; no physical OS settings panel is exercised.',
    'The real app is driven through its menus in an idle training match. This regression does not replay every combat effect or outcome sequence.',
  ],
};
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
let browser;

try {
  browser = await playwright.chromium.launch({
    headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push(`HTTP ${response.status()} ${response.url()}`);
  });
  await page.clock.install({ time: new Date('2026-10-23T12:00:00Z') });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-23T12:01:00Z'));
  await page.waitForFunction(version => window.Encore?.version === version, GAME_VERSION, { polling: 50 });

  const profile = () => page.evaluate(key => ({ profile: window.Encore.profile, stored: localStorage.getItem(key) }), SAVE_KEY);
  const measure = () => page.evaluate(async () => {
    const canvas = document.querySelector('#arena'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const digest = async (x, y, width, height) => {
      const pixels = ctx.getImageData(x, y, width, height).data;
      const bytes = await crypto.subtle.digest('SHA-256', pixels);
      return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    };
    const snapshot = window.Encore.snapshot;
    return {
      frame: snapshot.frame, phase: snapshot.phase, paused: window.Encore.paused,
      systemReduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      savedReduced: window.Encore.profile.settings.reducedMotion,
      pixels: {
        canvas: await digest(0, 0, canvas.width, canvas.height),
        scenery: await digest(80, 100, 1120, 100),
        player: await digest(250, 300, 260, 265),
      },
    };
  });
  const sampleWindow = async () => {
    const first = await measure();
    await page.clock.runFor(300);
    const middle = await measure();
    await page.clock.runFor(300);
    const later = await measure();
    assert.equal(first.phase, 'fight'); assert.equal(later.phase, 'fight');
    assert.equal(first.paused, false); assert.equal(later.paused, false);
    assert.ok(later.frame > first.frame + 30, `Simulation stopped: ${first.frame} → ${later.frame}`);
    return { first, middle, later };
  };
  const startTraining = async () => {
    await page.locator('.mode-card[data-mode="training"]').click();
    await page.locator('[data-stage="training"]').click();
    await page.locator('[data-action="start"]').click();
    await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
    await page.clock.runFor(250);
  };

  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="sound"]').uncheck();
  assert.equal(await page.locator('[data-setting="reducedMotion"]').isChecked(), false);
  const uncheckedProfile = await profile();
  await page.getByRole('button', { name: 'Jouer', exact: true }).click();
  await startTraining();
  const systemOnly = await sampleWindow();
  report.measurements.systemOnly = systemOnly;
  assert.equal(systemOnly.first.systemReduced, true); assert.equal(systemOnly.first.savedReduced, false);
  assert.deepEqual(systemOnly.first.pixels, systemOnly.middle.pixels);
  assert.deepEqual(systemOnly.first.pixels, systemOnly.later.pixels, 'OS reduction must stop decorative Canvas motion while the app setting is off');
  assert.deepEqual(await profile(), uncheckedProfile);
  checked('La préférence système fige les pixels Canvas avec le réglage du jeu décoché', systemOnly);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(50);
  const animated = await sampleWindow();
  assert.equal(animated.first.systemReduced, false); assert.equal(animated.first.savedReduced, false);
  for (const region of ['canvas', 'scenery', 'player']) assert.ok(new Set(Object.values(animated).map(sample => sample.pixels[region])).size > 1, `Expected visible ${region} motion without reduction`);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(50);
  const reducedAgain = await sampleWindow();
  report.measurements.liveChange = { animated, reducedAgain };
  assert.equal(reducedAgain.first.systemReduced, true); assert.equal(reducedAgain.first.savedReduced, false);
  assert.deepEqual(reducedAgain.first.pixels, reducedAgain.middle.pixels);
  assert.deepEqual(reducedAgain.first.pixels, reducedAgain.later.pixels);
  assert.deepEqual(reducedAgain.first.pixels, systemOnly.first.pixels, 'Returning to OS reduction must restore the same stable Canvas');
  assert.ok(animated.first.frame > systemOnly.later.frame && reducedAgain.first.frame > animated.later.frame);
  assert.deepEqual(await profile(), uncheckedProfile, 'System preference changes must not write the profile');
  checked('Changer la préférence système en direct relance puis stabilise le même combat sans modifier le profil', { animated, reducedAgain });

  await page.locator('[data-action="pause"]').click();
  await page.locator('#modal [data-action="home"]').click();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('[data-nav="settings"]').click();
  assert.equal(await page.locator('[data-setting="reducedMotion"]').isChecked(), false);
  await page.locator('[data-setting="reducedMotion"]').check();
  const checkedProfile = await profile();
  await page.getByRole('button', { name: 'Jouer', exact: true }).click();
  await startTraining();
  const appOnly = await sampleWindow();
  report.measurements.appOnly = appOnly;
  assert.equal(appOnly.first.systemReduced, false); assert.equal(appOnly.first.savedReduced, true);
  assert.deepEqual(appOnly.first.pixels, appOnly.middle.pixels);
  assert.deepEqual(appOnly.first.pixels, appOnly.later.pixels, 'The saved app preference must remain effective when the OS has no preference');
  assert.deepEqual(appOnly.first.pixels, systemOnly.first.pixels);
  assert.deepEqual(await profile(), checkedProfile);
  assert.deepEqual(report.errors, []);
  checked('Le réglage du jeu reste prioritaire pour réduire les mouvements sans préférence système', appOnly);
  report.ok = true;
} catch (error) {
  report.ok = false; report.failure = error.stack || String(error); console.error(report.failure); process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  report.sourceHashesAfter = await hashes();
  report.runtimeUnchangedDuringRun = JSON.stringify(report.sourceHashesBefore) === JSON.stringify(report.sourceHashesAfter);
  if (!report.runtimeUnchangedDuringRun) { report.ok = false; process.exitCode = 1; }
  report.elapsedSeconds = (Date.now() - started) / 1000;
  await fs.writeFile(path.join(output, 'reduced-motion-browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
}

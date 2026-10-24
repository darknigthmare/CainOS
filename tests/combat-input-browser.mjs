/** Keyboard regressions through the shipped UI; Encore diagnostics are read-only. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { GAME_VERSION, REPLAY_KEY } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({
  headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const checks = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`HTTP ${response.status()} ${response.url()}`);
});
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
const snapshot = () => page.evaluate(() => window.Encore.snapshot);
const saved = () => page.evaluate(key => ({ profile: window.Encore.profile, replay: localStorage.getItem(key) }), REPLAY_KEY);
const advance = ms => page.clock.runFor(ms);
const canvas = () => page.locator('#arena').focus();
const click = action => page.locator(`[data-action="${action}"]`).click();
async function start(mode) {
  await page.locator(`.mode-card[data-mode="${mode}"]`).click();
  await click('start');
  await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
  await advance(1900);
  assert.equal((await snapshot()).phase, 'fight');
  await canvas();
}
async function home() {
  if (!await page.locator('#modal').evaluate(element => element.open)) await click('pause');
  await page.locator('#modal [data-action="home"]').click();
}
try {
  await page.clock.install({ time: new Date('2026-10-24T08:00:00Z') });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-24T08:01:00Z'));
  await page.waitForFunction(version => window.Encore?.version === version, GAME_VERSION, { polling: 50 });
  const baseline = await saved();

  await start('training');
  const initialX = (await snapshot()).fighters[0].x;
  await page.keyboard.down('KeyD');
  await advance(120);
  assert.ok((await snapshot()).fighters[0].x > initialX, 'A normal held direction moves the player.');
  await page.keyboard.down('KeyJ');
  await advance(450);
  const beforePause = await snapshot();
  assert.equal(beforePause.fighters[0].stats.starts, 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => window.Encore.paused), true);
  const pausedFrame = (await snapshot()).frame;
  await advance(150);
  assert.equal((await snapshot()).frame, pausedFrame);
  await page.locator('#modal [data-action="resume"]').click();
  await canvas();
  const resumed = await snapshot();
  // Playwright keeps these physical keys down across the modal. Repeated down
  // calls produce native repeat=true events, without dispatchEvent fixtures.
  for (let repeat = 0; repeat < 4; repeat++) {
    await page.keyboard.down('KeyJ');
    await page.keyboard.down('KeyD');
    await advance(180);
  }
  const afterRepeats = await snapshot();
  assert.equal(afterRepeats.fighters[0].stats.starts, resumed.fighters[0].stats.starts);
  assert.equal(afterRepeats.fighters[0].x, resumed.fighters[0].x);
  await page.keyboard.up('KeyJ'); await page.keyboard.up('KeyD');
  await page.keyboard.press('KeyJ'); await advance(450);
  assert.equal((await snapshot()).fighters[0].stats.starts, resumed.fighters[0].stats.starts + 1);
  const freshX = (await snapshot()).fighters[0].x;
  await page.keyboard.down('KeyD'); await advance(100); await page.keyboard.up('KeyD');
  assert.ok((await snapshot()).fighters[0].x > freshX);
  checked('Held keyboard repeats cannot resurrect attacks or movement after pause', {
    startsBefore: resumed.fighters[0].stats.starts, startsAfterRepeats: afterRepeats.fighters[0].stats.starts,
    xBefore: resumed.fighters[0].x, xAfterRepeats: afterRepeats.fighters[0].x,
    freshPressStarts: (await snapshot()).fighters[0].stats.starts,
  });

  // Reach Pause through actual keyboard traversal, then use native activation.
  await canvas();
  let tabs = 0;
  while (await page.evaluate(() => document.activeElement?.dataset?.action !== 'pause') && tabs < 12) {
    await page.keyboard.press('Shift+Tab'); tabs++;
  }
  assert.equal(await page.evaluate(() => document.activeElement?.dataset?.action), 'pause');
  const jumpsBefore = (await snapshot()).metrics.jump || 0;
  await page.keyboard.press('Space');
  assert.equal(await page.locator('#modal').evaluate(element => element.open), true, 'Space activates the focused Pause button.');
  assert.equal(await page.evaluate(() => window.Encore.paused), true);
  assert.equal((await snapshot()).metrics.jump || 0, jumpsBefore);
  await page.locator('#modal [data-action="resume"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#modal').evaluate(element => element.open), false);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'arena');
  await advance(100);
  assert.equal((await snapshot()).metrics.jump || 0, jumpsBefore);
  await page.keyboard.press('Space'); await advance(34);
  assert.equal((await snapshot()).metrics.jump, jumpsBefore + 1, 'Space remains a gameplay jump on the canvas.');
  checked('Tab, Space and Enter operate the battle toolbar without accidental jumps', { tabsToPause: tabs, toolbarJumps: 0, canvasJumps: 1 });

  await home();
  await start('local');
  const beforeDash = await snapshot();
  await page.keyboard.down('ControlRight'); await advance(300);
  const afterDash = await snapshot();
  assert.equal(afterDash.metrics.dash, (beforeDash.metrics.dash || 0) + 1);
  assert.notEqual(afterDash.fighters[1].x, beforeDash.fighters[1].x);
  await page.keyboard.press('KeyJ'); await page.keyboard.press('KeyB');
  await advance(50);
  const afterAttacks = await snapshot();
  assert.equal(afterAttacks.fighters[0].stats.starts, afterDash.fighters[0].stats.starts + 1);
  assert.equal(afterAttacks.fighters[1].stats.starts, afterDash.fighters[1].stats.starts + 1);
  assert.equal(afterAttacks.fighters[0].attack?.slot, 'light');
  assert.equal(afterAttacks.fighters[1].attack?.slot, 'light');
  await page.keyboard.up('ControlRight');
  checked('Holding the default J2 Ctrl dash leaves both players attacks available', {
    playerTwoXBefore: beforeDash.fighters[1].x, playerTwoXAfterDash: afterDash.fighters[1].x,
    starts: afterAttacks.fighters.map(fighter => fighter.stats.starts),
  });
  await page.screenshot({ path: path.join(output, 'input-local-controls.png'), fullPage: true });
  await home();
  assert.deepEqual(await saved(), baseline);
  checked('Input regression journeys leave profile and replay unchanged', { profileUnchanged: true, replayUnchanged: true });
  assert.deepEqual(errors, []);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'input-failure.png'), fullPage: true }).catch(() => {});
  errors.push(error.stack || String(error));
  throw error;
} finally {
  await fs.writeFile(path.join(output, 'input-browser-report.json'), JSON.stringify({ version: GAME_VERSION, generatedAt: new Date().toISOString(), checks, errors }, null, 2));
  await browser.close();
}

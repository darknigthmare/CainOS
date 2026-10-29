/** Device regressions through the shipped UI; Encore diagnostics are read-only. */
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
// Browser Gamepad API shim only. These checks do not claim physical controllers.
await context.addInitScript(() => {
  const devices = [0, 1].map(index => ({ index, connected: false, axes: [0, 0], pressed: [] }));
  Object.defineProperty(window, '__inputPads', { value: devices });
  Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => devices.map(device => device.connected ? {
    id: `Encore QA standard pad ${device.index + 1}`, index: device.index, connected: true, mapping: 'standard', axes: [...device.axes],
    buttons: Array.from({ length: 17 }, (_, index) => ({ pressed: device.pressed.includes(index), touched: device.pressed.includes(index), value: Number(device.pressed.includes(index)) })),
  } : null) });
});
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
  await advance(450);

  await page.evaluate(() => { window.__inputPads.forEach(device => { device.connected = true; }); });
  await advance(34);
  const beforePadPause = await snapshot();
  await page.evaluate(() => {
    window.__inputPads[0].axes = [.8, 0];
    window.__inputPads.forEach(device => { device.pressed = [2, 9]; });
  });
  await advance(34);
  assert.equal(await page.evaluate(() => window.Encore.paused), true);
  assert.deepEqual((await snapshot()).fighters.map(f => f.stats.starts), beforePadPause.fighters.map(f => f.stats.starts));
  const padPauseFrame = (await snapshot()).frame;
  await advance(300);
  assert.equal((await snapshot()).frame, padPauseFrame);
  assert.equal(await page.locator('#modal').evaluate(element => element.open), true, 'Held Start cannot immediately select Resume.');
  await page.evaluate(() => { window.__inputPads.forEach(device => { device.pressed = [2]; }); });
  await page.locator('#modal [data-action="resume"]').click(); await canvas();
  const padResume = await snapshot();
  await advance(250);
  assert.deepEqual((await snapshot()).fighters.map(f => ({ x: f.x, starts: f.stats.starts })), padResume.fighters.map(f => ({ x: f.x, starts: f.stats.starts })));
  await page.evaluate(() => { window.__inputPads.forEach(device => { device.pressed = []; device.axes = [0, 0]; }); });
  await advance(34);
  await page.evaluate(() => { window.__inputPads[0].pressed = [2]; }); await advance(34);
  assert.equal((await snapshot()).fighters[0].stats.starts, padResume.fighters[0].stats.starts + 1);
  assert.equal((await snapshot()).fighters[1].stats.starts, padResume.fighters[1].stats.starts);
  await page.evaluate(() => { window.__inputPads.forEach(device => { device.connected = false; }); });
  checked('Two virtual controllers pause together and held controls remain neutral after Resume', {
    devices: 'two virtual standard Gamepad API devices', startsDuringPause: beforePadPause.fighters.map(f => f.stats.starts),
    freshPressStarts: (await snapshot()).fighters[0].stats.starts,
  });

  await home();
  await page.locator('nav [data-nav="settings"]').click();
  await page.locator('[data-setting="touch"]').selectOption('on');
  await page.locator('nav [data-nav="home"]').click();
  await start('training');
  const touchBefore = await snapshot();
  const light = page.locator('[data-control="light"]');
  const box = await light.boundingBox(); assert.ok(box);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // Dispatch only the cancellation signal; pointerdown and capture are native.
  // Real browser/OS cancellation is covered by the same handler, but requires
  // separate physical-device checks to claim phone coverage.
  await light.dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'mouse', bubbles: true });
  await page.mouse.up(); await advance(50);
  assert.equal((await snapshot()).fighters[0].stats.starts, touchBefore.fighters[0].stats.starts);
  assert.equal(await light.evaluate(button => button.classList.contains('pressed')), false);
  await light.click(); await advance(50);
  assert.equal((await snapshot()).fighters[0].stats.starts, touchBefore.fighters[0].stats.starts + 1, 'A complete pointer click still attacks once.');
  checked('A cancelled native pointer press cannot become an attack, while a complete tap remains usable', {
    interruption: 'synthetic pointercancel on a native captured mouse press', cancelledAttacks: 0, freshTapAttacks: 1,
  });
  await home();
  await page.locator('nav [data-nav="settings"]').click();
  await page.locator('[data-setting="touch"]').selectOption(baseline.profile.settings.touch);
  await page.locator('nav [data-nav="home"]').click();
  assert.deepEqual(await saved(), baseline);
  checked('Input regression journeys leave profile and replay unchanged', { profileUnchanged: true, replayUnchanged: true });
  assert.deepEqual(errors, []);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'input-failure.png'), fullPage: true }).catch(() => {});
  errors.push(error.stack || String(error));
  throw error;
} finally {
  await fs.writeFile(path.join(output, 'input-browser-report.json'), JSON.stringify({ schema: 'encore-input-browser/v1', version: GAME_VERSION, browser: browser.version(), generatedAt: new Date().toISOString(), checks, errors,
    limits: ['Virtual standard gamepads, not physical controllers.', 'Synthetic pointercancel on a native mouse press, not a physical phone interruption.'] }, null, 2));
  await browser.close();
}

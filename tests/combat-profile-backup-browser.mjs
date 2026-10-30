/**
 * Backup recovery through public import/export, settings and real storage events.
 * Progress is an explicit migration fixture, not claimed gameplay-earned results.
 * Fault injection touches only browser storage; no engine or app mutation hooks.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { emptyProfile, SAVE_KEY, SAVE_BACKUP_KEY } from '../combat/session.mjs';
import { createProgram, recordProgramResult } from '../combat/progression.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const report = { suite: 'profile-backup', base, generatedAt: new Date().toISOString(), checks: [], errors: [], pass: false,
  fixturePolicy: 'Statistics, initial awards and the saved survival encounter are explicit import fixtures. The specialist exercise is played once via keyboard; no duel wins are claimed.',
  limitations: ['Storage faults are deliberately injected in Chromium.', 'Physical devices and long-term browser storage retention are not exercised.'] };
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
const browser = await playwright.chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
report.browser = browser.version();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
context.setDefaultTimeout(20000);
context.setDefaultNavigationTimeout(30000);
const page = await context.newPage();
const watch = target => {
  target.on('pageerror', error => report.errors.push(error.message));
  target.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push('HTTP ' + response.status() + ' ' + response.url()); });
};
watch(page);
const profile = () => page.evaluate(() => window.Encore.profile);
const records = () => page.evaluate(([main, backup]) => [localStorage.getItem(main), localStorage.getItem(backup)], [SAVE_KEY, SAVE_BACKUP_KEY]);
const load = async (target = page, url = base + '/combat/') => {
  await target.goto(url, { waitUntil: 'networkidle' });
  await target.waitForFunction(() => window.Encore?.screen === 'home');
};
const importFile = value => page.locator('#import-profile').setInputFiles({ name: 'profile-fixture.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value)) });
async function exportRecovery() {
  const downloaded = page.waitForEvent('download');
  await page.locator('[data-profile-recovery] [data-action="export-profile"]').click();
  const stream = await (await downloaded).createReadStream();
  const chunks = []; for await (const chunk of stream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
const fixture = emptyProfile();
fixture.stats = { matches: 17, wins: 10, losses: 7, bestSurvival: 4, damage: 45003 };
fixture.challenges = ['combo', 'super']; fixture.medals = ['arcade', 'story']; fixture.stories = ['jax'];
fixture.history = [{ fighter: 'jax', opponent: 'caine', mode: 'story', won: true, at: '2026-10-29T10:00:00.000Z' }];
fixture.settings.bindings[0].light = ['KeyC']; fixture.settings.ambience = false;
fixture.program = recordProgramResult(createProgram('survival', 'jax', undefined, undefined, { seed: 43 }), { won: true, health: 4321 });
try {
  await load();
  await page.locator('[data-nav="settings"]').click();
  await importFile(fixture); await page.locator('#confirm-import').click();
  await page.waitForFunction(() => window.Encore.profile.stats.matches === 17);
  assert.deepEqual(await profile(), fixture);
  const saved = await records(); assert.deepEqual(saved.map(JSON.parse), [fixture, fixture]);
  checked('a confirmed profile import creates a complete primary and backup', { format: fixture.format, version: fixture.version, savedProgram: fixture.program.mode });

  const beforeInvalid = await records(), confirmations = await page.evaluate(() => window.Encore.audio.effectCounts.confirm);
  await importFile({ ...fixture, version: 2 });
  await page.waitForFunction(() => !document.querySelector('#toast').hidden && /version 1/.test(document.querySelector('#toast').textContent));
  assert.equal(await page.locator('#modal').isVisible(), false, 'a rejected file must not open a replacement prompt');
  assert.deepEqual(await records(), beforeInvalid); assert.deepEqual(await profile(), fixture);
  assert.equal(await page.evaluate(() => window.Encore.audio.effectCounts.confirm), confirmations);
  checked('a rejected import changes neither record and produces no success cue');

  await importFile({ ...fixture, stats: { ...fixture.stats, matches: 999 } });
  await page.locator('#modal [data-action="close-modal"]').click();
  assert.deepEqual(await records(), beforeInvalid); assert.deepEqual(await profile(), fixture);
  assert.equal(await page.evaluate(() => window.Encore.audio.effectCounts.confirm), confirmations);
  checked('cancelling a valid replacement preserves both copies and the current profile');

  const other = await context.newPage(); watch(other); await load(other);
  await page.evaluate(main => {
    window.__profileStorageEvents = [];
    addEventListener('storage', event => { if (event.key === main) window.__profileStorageEvents.push(event.newValue); });
  }, SAVE_KEY);
  const older = structuredClone(fixture);
  older.stats.matches--; older.stats.wins--; older.challenges = ['combo'];
  await other.evaluate(({ main, backup, raw }) => { localStorage.setItem(backup, raw); localStorage.setItem(main, '{older backup available'); }, { main: SAVE_KEY, backup: SAVE_BACKUP_KEY, raw: JSON.stringify(older) });
  await page.bringToFront();
  await page.waitForFunction(() => window.__profileStorageEvents.includes('{older backup available'));
  assert.deepEqual(await profile(), fixture, 'an old fallback must not roll back a valid live session');
  assert.equal(await page.locator('[data-profile-recovery]').getAttribute('data-recovery-source'), 'memory');
  assert.match(await page.locator('[data-profile-recovery]').textContent(), /session reste en mémoire/);
  assert.deepEqual(await exportRecovery(), fixture);
  assert.equal((await records())[1], JSON.stringify(older), 'reading keeps even the older backup untouched');
  await page.locator('[data-action="save-recovered-profile"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-profile-recovery]'));
  assert.deepEqual((await records()).map(JSON.parse), [fixture, fixture]);
  checked('a stale backup cannot roll back the live profile after a real cross-tab corruption event');

  // A same-tab disk fault emits no storage event to this page. Completing a real
  // exercise specifically exercises refreshStoredProfile before earning its reward.
  await page.evaluate(({ main, backup, raw }) => { localStorage.setItem(backup, raw); localStorage.setItem(main, '{reward refresh corruption'); }, { main: SAVE_KEY, backup: SAVE_BACKUP_KEY, raw: JSON.stringify(older) });
  await page.getByRole('button', { name: 'Jouer', exact: true }).click();
  await page.locator('.mode-card[data-mode="challenge"]').click();
  await page.locator('[data-challenge="specialist"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore.ready && window.Encore.snapshot.phase === 'fight');
  for (const key of ['KeyC', 'KeyK', 'KeyI', 'KeyL']) { await page.keyboard.press(key); await page.waitForTimeout(1000); }
  await page.waitForFunction(() => window.Encore.profile.challenges.includes('specialist'));
  fixture.challenges.push('specialist');
  assert.deepEqual(await profile(), fixture, 'reward refresh must preserve all newer stats and awards');
  assert.deepEqual((await records()).map(JSON.parse), [fixture, fixture]);
  [saved[0], saved[1]] = await records();
  await page.locator('#modal [data-action="home"]').click();
  checked('a played challenge adds its reward without refreshing the live profile from an older backup');

  await other.evaluate(([main, backup]) => { localStorage.setItem(backup, '{damaged backup'); localStorage.setItem(main, '{damaged primary'); }, [SAVE_KEY, SAVE_BACKUP_KEY]);
  await page.bringToFront();
  await page.waitForFunction(() => window.__profileStorageEvents.includes('{damaged primary'));
  assert.deepEqual(await profile(), fixture, 'invalid disk bytes from another tab cannot erase a valid in-memory profile');
  assert.deepEqual(await records(), ['{damaged primary', '{damaged backup']);
  checked('real cross-tab corruption of both records preserves the current in-memory profile');

  await other.evaluate(({ main, backup, raw }) => { localStorage.setItem(backup, raw); localStorage.setItem(main, '{truncated primary'); }, { main: SAVE_KEY, backup: SAVE_BACKUP_KEY, raw: saved[1] });
  await page.waitForSelector('[data-profile-recovery]');
  assert.deepEqual(await profile(), fixture);
  const corrupted = await records(); assert.deepEqual(corrupted, ['{truncated primary', saved[1]]);
  await load(); assert.deepEqual(await profile(), fixture);
  assert.equal(await page.locator('[data-profile-recovery]').getAttribute('data-recovery-source'), 'backup');
  assert.equal(await page.locator('[data-action="resume-program"]').count(), 1);
  assert.ok(await page.locator('[data-profile-recovery]').isVisible());
  assert.deepEqual(await records(), corrupted, 'reading the fallback must not silently repair the primary');
  checked('corrupt primary recovery survives reload and restores the saved encounter without writing storage');

  assert.deepEqual(await exportRecovery(), fixture);
  assert.deepEqual(await records(), corrupted);
  await page.setViewportSize({ width: 390, height: 844 });
  const bounds = await page.locator('[data-profile-recovery]').evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1,
      buttons: [...element.querySelectorAll('button')].map(button => { const r = button.getBoundingClientRect(); return { left: r.left, right: r.right, height: r.height }; }) };
  });
  assert.ok(bounds.left >= 0 && bounds.right <= bounds.width && !bounds.overflow, JSON.stringify(bounds));
  assert.ok(bounds.buttons.every(button => button.left >= 0 && button.right <= bounds.width && button.height >= 35));
  await page.screenshot({ path: path.join(output, 'profile-backup-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('[data-nav="settings"]').click();
  assert.ok(await page.locator('[data-profile-recovery]').isVisible());
  await page.screenshot({ path: path.join(output, 'profile-backup-settings.png'), fullPage: true });
  checked('the recovered copy exports intact and its notice/actions fit a 390-pixel viewport', bounds);

  await page.evaluate(main => {
    const original = Storage.prototype.setItem;
    window.__restoreProfileStorage = () => { Storage.prototype.setItem = original; delete window.__restoreProfileStorage; };
    Storage.prototype.setItem = function(key, value) { if (key === main) throw new DOMException('Injected quota fault', 'QuotaExceededError'); return original.call(this, key, value); };
  }, SAVE_KEY);
  const confirmBeforeFailure = await page.evaluate(() => window.Encore.audio.effectCounts.confirm);
  await page.locator('[data-action="save-recovered-profile"]').click();
  await page.waitForFunction(() => /Stockage local indisponible/.test(document.querySelector('#toast').textContent));
  assert.deepEqual(await records(), corrupted); assert.deepEqual(await profile(), fixture);
  assert.ok(await page.locator('[data-profile-recovery]').isVisible());
  assert.equal(await page.evaluate(() => window.Encore.audio.effectCounts.confirm), confirmBeforeFailure);
  assert.deepEqual(await exportRecovery(), fixture);
  checked('a refused repair keeps the recovery notice, valid backup and export without claiming success');

  await page.evaluate(() => window.__restoreProfileStorage());
  await page.locator('[data-action="save-recovered-profile"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-profile-recovery]'));
  await page.waitForFunction(count => window.Encore.audio.effectCounts.confirm === count + 1, confirmBeforeFailure);
  assert.deepEqual((await records()).map(JSON.parse), [fixture, fixture]);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  await load(); assert.deepEqual(await profile(), fixture);
  assert.equal(await page.locator('[data-profile-recovery]').count(), 0);
  checked('an explicit successful repair persists both copies once and restores keyboard focus');

  await other.evaluate(main => localStorage.setItem(main, '{CainOS corruption'), SAVE_KEY);
  const os = await context.newPage(); watch(os);
  await os.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await os.locator('#boot-init-button').waitFor({ state: 'visible' });
  await os.locator('#boot-init-button').click();
  await os.locator('#btn-start-simulation').click();
  await os.locator('#btn-story-skip').click();
  await os.locator('#ep0-canvas').waitFor({ state: 'visible' });
  await os.keyboard.press('Enter'); await os.keyboard.press('Enter'); await os.keyboard.press('Enter');
  await os.waitForFunction(() => !document.querySelector('#power-led').classList.contains('active'));
  await os.locator('#power-button').click();
  await os.locator('.desktop-icon[data-window="combat"]').waitFor({ state: 'visible' });
  await os.locator('.desktop-icon[data-window="combat"]').dblclick();
  const embedded = os.frameLocator('#circus-combat-frame');
  await embedded.locator('[data-profile-recovery]').waitFor();
  const embeddedPage = os.frames().find(frame => frame.url().includes('embedded=1'));
  assert.ok(embeddedPage, 'CainOS must open its actual shared combat iframe');
  assert.deepEqual(await embeddedPage.evaluate(() => window.Encore.profile), fixture);
  await embedded.locator('[data-action="save-recovered-profile"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-profile-recovery]'));
  assert.deepEqual((await records()).map(JSON.parse), [fixture, fixture]);
  await os.screenshot({ path: path.join(output, 'profile-backup-cainos.png'), fullPage: true });
  checked('the actual CainOS boot and desktop launcher recover and repair the shared profile inside the iframe');
  await os.close();

  await other.evaluate(main => localStorage.setItem(main, '{standalone corruption'), SAVE_KEY);
  const standalone = await context.newPage(); watch(standalone);
  await load(standalone, base + '/dist-combat/combat/index.html?standalone=1');
  assert.deepEqual(await standalone.evaluate(() => window.Encore.profile), fixture);
  assert.ok(await standalone.locator('[data-profile-recovery]').isVisible());
  assert.equal(await standalone.locator('#os-link').isVisible(), false);
  await standalone.locator('[data-action="save-recovered-profile"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-profile-recovery]'));
  assert.deepEqual(await profile(), fixture);
  checked('the built standalone recovers the same profile and its repair synchronizes with the other entry');

  await other.evaluate(main => localStorage.removeItem(main), SAVE_KEY);
  await page.waitForFunction(() => window.Encore.profile.stats.matches === 0);
  await load(); assert.deepEqual(await profile(), emptyProfile());
  assert.equal(await page.locator('[data-profile-recovery]').count(), 0);
  assert.equal((await records())[1], saved[1], 'reading a deleted primary does not itself remove or restore the old backup');
  checked('explicit primary deletion stays empty on reload even when a valid backup exists');

  await page.evaluate(backup => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) { if (key === backup) throw new DOMException('Injected backup quota', 'QuotaExceededError'); return original.call(this, key, value); };
  }, SAVE_BACKUP_KEY);
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="reducedMotion"]').check();
  const fresh = emptyProfile(); fresh.settings.reducedMotion = true;
  assert.deepEqual(await profile(), fresh);
  const freshRecords = await records(); assert.deepEqual(JSON.parse(freshRecords[0]), fresh); assert.equal(freshRecords[1], null);
  await other.evaluate(main => localStorage.setItem(main, '{fresh profile damaged'), SAVE_KEY);
  await load(); assert.deepEqual(await profile(), emptyProfile());
  assert.equal(await page.locator('[data-profile-recovery]').count(), 0);
  checked('a fresh save with refused backup never revives a deliberately deleted old profile');

  assert.deepEqual(report.errors, []); report.pass = true;
} catch (error) {
  report.failure = error.stack || String(error);
  await page.screenshot({ path: path.join(output, 'profile-backup-failure.png'), fullPage: true }).catch(() => {});
  throw error;
} finally {
  report.completedAt = new Date().toISOString();
  await fs.writeFile(path.join(output, 'profile-backup-browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
console.log('Profile backup browser QA: ' + report.checks.length + ' checks passed.');

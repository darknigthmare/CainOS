/**
 * Targeted profile-migration regression against the real public storage and UI.
 * COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-profile-recovery-browser.mjs
 * These populated profiles are migration fixtures, not purported earned wins.
 * Only the specialist exercise below is actually completed with keyboard input.
 * No engine commands, gameplay mutation hooks or synthetic StorageEvents.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES, VARIANTS } from '../combat/data.mjs';
import { createProgram, recordProgramResult } from '../combat/progression.mjs';
import { emptyProfile, SAVE_KEY } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const checks = [], errors = [];
const browser = await playwright.chromium.launch({
  headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log(`PASS ${name} — ${detail}`); };
const watch = (target, label) => {
  target.on('pageerror', error => errors.push(`${label}: ${error.message}`));
  target.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
};
watch(page, 'profile');
const profile = () => page.evaluate(() => window.Encore.profile);
const persisted = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
function migrationFixture() {
  const value = emptyProfile();
  Object.assign(value.settings, { layout: 'qwerty', sound: false, music: false, seconds: 120, reducedMotion: true });
  value.settings.bindings[0].light = ['KeyC'];
  value.settings.bindings[1].heavy = ['KeyH', 'Numpad2'];
  value.stats = { matches: 27, wins: 18, losses: 9, bestSurvival: 7, damage: 157003 };
  value.challenges = ['combo', 'throw', 'super'];
  value.medals = ['arcade', 'story', 'tournament'];
  value.stories = ['jax', 'pomni'];
  value.history = [
    { fighter: 'jax', opponent: 'caine', mode: 'story', won: true, at: '2026-10-22T12:00:00.000Z' },
    { fighter: 'pomni', opponent: 'gangle', mode: 'survival', won: false, at: '2026-10-22T11:00:00.000Z' },
  ];
  const variant = VARIANTS.find(item => item.fighterId === 'jax');
  value.program = recordProgramResult(createProgram('story', 'jax', FIGHTERS, STAGES, { seed: 91, variantId: variant.id }), { won: true, health: 7200 });
  return value;
}
const initial = migrationFixture();
initial.program.index = 99;
const initialRecovered = { ...initial, program: null };

try {
  // Seed once per tab so a later reload observes the app's actual repaired save.
  await page.addInitScript(({ key, raw }) => {
    if (!sessionStorage.getItem('encore-profile-migration-fixture')) {
      localStorage.setItem(key, raw);
      sessionStorage.setItem('encore-profile-migration-fixture', 'seeded');
    }
  }, { key: SAVE_KEY, raw: JSON.stringify(initial) });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  assert.deepEqual(await profile(), initialRecovered);
  assert.equal(await page.locator('[data-action="resume-program"]').count(), 0);
  checked('Startup drops only the corrupt checkpoint', 'A migration fixture retains all statistics, challenges, medals, endings, history, preferences and both custom keyboard maps.');

  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="sound"]').check();
  const afterSetting = structuredClone(initialRecovered);
  afterSetting.settings.sound = true;
  assert.deepEqual(await profile(), afterSetting);
  assert.deepEqual(await persisted(), afterSetting);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await profile(), afterSetting);
  assert.deepEqual(await persisted(), afterSetting);
  checked('A routine preference save and reload preserve the recovered profile', 'Sound is enabled through the settings UI; the repaired save has program:null and every prior achievement/binding remains.');

  // A real second same-origin tab writes public localStorage. The browser emits
  // the storage event itself; no app function or synthetic event is invoked.
  const other = await context.newPage();
  watch(other, 'other-tab');
  await other.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  const incoming = structuredClone(afterSetting);
  incoming.stats = { matches: 32, wins: 22, losses: 10, bestSurvival: 8, damage: 182500 };
  incoming.challenges.push('guard');
  incoming.medals.push('boss');
  incoming.stories.push('ragatha');
  incoming.settings.bindings[0].light = ['KeyT'];
  incoming.history.unshift({ fighter: 'ragatha', opponent: 'zooble', mode: 'story', won: true, at: '2026-10-22T13:00:00.000Z' });
  incoming.program = migrationFixture().program;
  incoming.program.variantId = 'jaxfather'; // An archived identity is not a supported costume.
  const incomingRecovered = { ...incoming, program: null };
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: SAVE_KEY, raw: JSON.stringify(incoming) });
  await page.waitForFunction(matches => window.Encore.profile.stats.matches === matches, incoming.stats.matches);
  await page.bringToFront();
  assert.deepEqual(await profile(), incomingRecovered);
  assert.equal(await page.locator('[data-action="resume-program"]').count(), 0);
  checked('A real cross-tab storage event preserves progress despite an obsolete costume', 'The incoming fixture replaces stats, history, achievements and the J1 binding; only its invalid checkpoint is discarded.');

  // The disk record is still incompatible here. Completing one short exercise
  // exercises app.refreshStoredProfile before it persists an earned reward.
  await page.locator('.mode-card[data-mode="challenge"]').click();
  await page.locator('[data-challenge="specialist"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore.ready && window.Encore.snapshot.phase === 'fight');
  for (const key of ['KeyT', 'KeyK', 'KeyI', 'KeyL']) {
    await page.keyboard.press(key);
    await page.waitForTimeout(1000);
  }
  await page.waitForFunction(() => window.Encore.profile.challenges.includes('specialist'));
  const afterReward = structuredClone(incomingRecovered);
  afterReward.challenges.push('specialist');
  assert.deepEqual(await profile(), afterReward);
  assert.deepEqual(await persisted(), afterReward);
  assert.ok(await page.locator('#modal[open]').isVisible());
  await page.locator('#modal [data-action="home"]').click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await profile(), afterReward);
  checked('Reward refresh repairs the incompatible disk checkpoint without erasing the record', 'Specialist is actually completed with four keyboard techniques; only that new reward is added to the migration fixture, and reload preserves it.');

  await page.locator('[data-nav="settings"]').click();
  const beforeImport = await profile(), storedBeforeImport = await persisted();
  const rejected = migrationFixture();
  rejected.stats = { matches: 900, wins: 900, losses: 0, bestSurvival: 10, damage: 999999 };
  rejected.program.variantId = 'jaxfather';
  await page.locator('#import-profile').setInputFiles({ name: 'invalid-checkpoint-profile.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(rejected)) });
  await page.waitForFunction(() => !document.querySelector('#toast').hidden && /apparence/i.test(document.querySelector('#toast').textContent), null, { polling: 50 });
  assert.equal(await page.locator('#confirm-import').count(), 0);
  assert.deepEqual(await profile(), beforeImport);
  assert.deepEqual(await persisted(), storedBeforeImport);
  await page.screenshot({ path: path.join(output, 'profile-recovery-import-rejected.png'), fullPage: true });
  checked('Manual file import remains strict and preserves the existing profile', 'An invalid costume is rejected with an error before the replacement prompt; neither the in-memory profile nor its stored copy changes.');

  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, 'profile-recovery-browser-report.json'), JSON.stringify({ base, fixturePolicy: 'Existing statistics/rewards are explicit migration fixtures; only the specialist exercise was played during this test.', checks, errors, finalProfile: await profile() }, null, 2));
  console.log(`Profile recovery browser QA: ${checks.length} checks passed.`);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'profile-recovery-failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'profile-recovery-browser-report.json'), JSON.stringify({ base, checks, errors, failure: error.message }, null, 2));
  throw error;
} finally {
  await browser.close();
}

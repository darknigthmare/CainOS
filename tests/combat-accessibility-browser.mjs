/**
 * Keyboard and virtual-device accessibility journeys through the public UI.
 * No engine, profile, gallery or Encore state is assigned by this suite.
 * The sole browser shim is navigator.getGamepads, representing one standard pad.
 * Focus, inputs, settings and dialogs are driven by ordinary keyboard events.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { GAME_VERSION, SAVE_KEY, REPLAY_KEY } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178').replace(/\/$/, '');
const output = path.resolve('audit-combat/accessibility-0.7.0');
const reportFile = path.resolve('audit-combat/accessibility-browser-report.json');
await fs.mkdir(output, { recursive: true });
const sourceFiles = ['combat/app.mjs', 'combat/input.mjs', 'combat/menu-navigation.mjs', 'combat/index.html', 'combat/style.css', 'combat/finisher-gallery.mjs', 'tests/combat-accessibility-browser.mjs'];
const hashes = async () => Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')])));
const report = {
  schema: 'encore-accessibility-browser/v1', version: GAME_VERSION, base,
  generatedAt: new Date().toISOString(), runtimeSourceHashes: await hashes(), checks: [], errors: [], keyboard: { Tab: 0, ShiftTab: 0, activations: 0 },
  scope: 'Desktop and 390 px Chromium. Real Tab, Enter, Space, arrow and Home/End events; one virtual standard gamepad through navigator.getGamepads only.',
  limits: ['No physical gamepad or phone.', 'No screen-reader, switch-control or voice-control session.', 'This covers the named menu and dialog journeys, not every OS/browser accessibility combination.'],
  pass: false,
};
const checked = (name, detail = null) => { report.checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
let browser, page, phoneContext;
const matchesFocus = (p, selector) => p.evaluate(selector => !!document.activeElement?.matches(selector), selector);
async function expectFocus(p, selector, description = selector) {
  await p.waitForFunction(selector => !!document.activeElement?.matches(selector), selector, { timeout: 3000 });
  assert.equal(await matchesFocus(p, selector), true, description);
}
async function tabTo(p, selector, backwards = false) {
  for (let step = 0; step < 180; step++) {
    if (await matchesFocus(p, selector)) return step;
    await p.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
    report.keyboard[backwards ? 'ShiftTab' : 'Tab']++;
  }
  const focused = await p.evaluate(() => document.activeElement?.outerHTML);
  throw new Error('Keyboard could not reach ' + selector + '; focused: ' + focused);
}
async function activate(p, selector, key = 'Enter') {
  await tabTo(p, selector); await p.keyboard.press(key); report.keyboard.activations++;
}
async function nav(p, id) {
  await activate(p, `nav [data-nav="${id}"]`);
  await p.waitForFunction(id => window.Encore?.screen === id, id);
  await expectFocus(p, '#main');
  assert.equal(await p.locator(`nav [data-nav="${id}"]`).getAttribute('aria-current'), 'page');
}
async function state(p = page) {
  return p.evaluate(({ save, replay }) => ({ profile: window.Encore.profile, saved: localStorage.getItem(save), replay: localStorage.getItem(replay), match: window.Encore.snapshot }), { save: SAVE_KEY, replay: REPLAY_KEY });
}
const progress = profile => { const { settings, ...rest } = profile; return rest; };
async function assertProgress(before, p = page) {
  const after = await state(p);
  assert.deepEqual(progress(after.profile), progress(before.profile));
  assert.equal(after.replay, before.replay);
  assert.equal(after.match, null);
}
async function group(p, selector, expectedCount, label) {
  const buttons = p.locator(selector + ' button:not(:disabled)');
  assert.equal(await buttons.count(), expectedCount);
  await tabTo(p, selector + ' button:not(:disabled)');
  await p.keyboard.press('Home');
  assert.equal(await buttons.first().evaluate(element => element === document.activeElement), true);
  const ids = await buttons.evaluateAll(nodes => nodes.map(element => element.outerHTML));
  const traversed = [];
  for (let index = 0; index < expectedCount; index++) {
    assert.equal(await buttons.nth(index).evaluate(element => element === document.activeElement), true, label + ' Tab order ' + index);
    traversed.push(await p.evaluate(() => document.activeElement.outerHTML));
    if (index < expectedCount - 1) { await p.keyboard.press('Tab'); report.keyboard.Tab++; }
  }
  assert.deepEqual(traversed, ids);
  await p.keyboard.press('End');
  assert.equal(await buttons.last().evaluate(element => element === document.activeElement), true);
  await p.keyboard.press('Home');
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
    const before = await p.evaluate(() => document.activeElement.outerHTML);
    await p.keyboard.press(key);
    assert.equal(await p.evaluate(selector => !!document.activeElement?.closest(selector), selector), true, label + ' ' + key + ' stays in group');
    assert.notEqual(await p.evaluate(() => document.activeElement.outerHTML), before, label + ' ' + key + ' moves focus');
  }
  await p.keyboard.press('Home');
  checked(label + ': all controls reachable by Tab, with Home/End and four arrows', { count: expectedCount });
}
async function noOverflow(p, label) {
  const dimensions = await p.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, dialog: document.querySelector('dialog[open]') ? { client: document.querySelector('dialog[open]').clientWidth, scroll: document.querySelector('dialog[open]').scrollWidth } : null }));
  assert.ok(dimensions.scroll <= dimensions.width + 1, label + ' page overflow ' + JSON.stringify(dimensions));
  if (dimensions.dialog) assert.ok(dimensions.dialog.scroll <= dimensions.dialog.client + 2, label + ' dialog overflow');
}
function watch(p, label) {
  p.on('pageerror', error => report.errors.push(label + error.message));
  p.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) report.errors.push(label + 'HTTP ' + response.status() + ' ' + response.url()); });
}
async function pad(button) {
  await page.evaluate(button => { window.__accessibilityPad.connected = true; window.__accessibilityPad.pressed = [button]; }, button);
  await page.waitForTimeout(100);
  await page.evaluate(() => { window.__accessibilityPad.pressed = []; });
  await page.waitForTimeout(100);
}

try {
  browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await context.addInitScript(() => {
    const device = { connected: false, pressed: [] };
    Object.defineProperty(window, '__accessibilityPad', { value: device });
    Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: () => device.connected ? [{ id: 'Encore QA standard gamepad', index: 0, connected: true, mapping: 'standard', axes: [0, 0], buttons: Array.from({ length: 17 }, (_, index) => ({ pressed: device.pressed.includes(index), touched: device.pressed.includes(index), value: Number(device.pressed.includes(index)) })) }] : [] });
  });
  page = await context.newPage(); watch(page, 'desktop: ');
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  const baseline = await state();
  assert.equal(baseline.match, null);

  // The skip link is reached with the native reverse Tab path from main.
  await tabTo(page, '.skip-link', true);
  assert.equal(await page.locator('.skip-link').isVisible(), true);
  const skipBox = await page.locator('.skip-link').boundingBox(); assert.ok(skipBox.width > 50 && skipBox.height > 20);
  await page.keyboard.press('Enter'); await expectFocus(page, '#main');
  checked('skip link receives visible keyboard focus and moves Enter focus to main');
  await group(page, 'nav[data-menu-group]', 4, 'Main navigation');
  await page.keyboard.press('End'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => window.Encore.screen === 'settings'); await expectFocus(page, '#main');
  checked('navigation End and Enter open Settings with an announced current page');

  for (const [key, wanted] of [['sound', false], ['ambience', false], ['reducedMotion', true]]) {
    const selector = `[data-setting="${key}"]`; await tabTo(page, selector);
    if (await page.locator(selector).isChecked() !== wanted) await page.keyboard.press('Space');
    await expectFocus(page, selector); assert.equal(await page.locator(selector).isChecked(), wanted);
  }
  await nav(page, 'home');
  await group(page, '.modes-grid', 12, 'Nine modes and three replay controls');
  await activate(page, '.mode-card[data-mode="versus"]', 'Space');
  await page.waitForFunction(() => window.Encore.screen === 'select');
  await expectFocus(page, '#main');
  assert.equal(await page.locator('nav [data-nav="home"]').getAttribute('aria-current'), 'page');
  checked('Space opens a mode and keeps the Play navigation state');

  await group(page, '.pick-side', 2, 'Player side controls');
  await activate(page, '[data-side="1"]');
  await expectFocus(page, '[data-side="1"]'); assert.equal(await page.locator('[data-side="1"]').getAttribute('aria-pressed'), 'true');
  await activate(page, '[data-side="0"]'); await expectFocus(page, '[data-side="0"]');
  checked('changing the player side keeps focus on its regenerated pressed button');

  await group(page, '.roster', 14, 'Fourteen fighter cards');
  for (const fighter of FIGHTERS) {
    const selector = `[data-fighter="${fighter.id}"]`;
    await activate(page, selector);
    await expectFocus(page, selector, fighter.name + ' remains focused after selection');
    assert.equal(await page.locator(selector).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-selection-artist="0"] h3').textContent(), fighter.name);
  }
  checked('all fourteen fighter choices keep focus and update the selected artist', { fighters: FIGHTERS.map(item => item.id) });
  await activate(page, '[data-fighter="pomni"]');
  await group(page, '.stages', 12, 'Twelve arena cards');
  for (const stage of STAGES) {
    const selector = `[data-stage="${stage.id}"]`; await activate(page, selector);
    await expectFocus(page, selector);
    assert.equal(await page.locator(selector).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#stage-preview').getAttribute('data-stage-preview'), stage.id);
  }
  checked('all twelve stage choices retain focus and synchronize the preview', { stages: STAGES.map(item => item.id) });

  const wardrobeOpener = '[data-selection-artist="0"] [data-appearance]';
  await activate(page, wardrobeOpener);
  await page.locator('#modal[open].wardrobe-dialog').waitFor();
  await tabTo(page, '#wardrobe-variant');
  const wardrobeOptions = await page.locator('#wardrobe-variant option').evaluateAll(options => options.map(option => option.value));
  assert.ok(wardrobeOptions.length > 3);
  for (let index = 1; index <= 3; index++) {
    await page.keyboard.press('ArrowDown');
    await expectFocus(page, '#wardrobe-variant');
    assert.equal(await page.locator('#wardrobe-variant').inputValue(), wardrobeOptions[index]);
    assert.equal(await page.locator('#wardrobe-preview').getAttribute('data-appearance-id'), wardrobeOptions[index]);
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#modal').isVisible(), false); await expectFocus(page, wardrobeOpener);
  checked('wardrobe ArrowDown can change three consecutive appearances without losing select focus; Escape restores its opener');

  await nav(page, 'codex');
  await group(page, '.codex-list', 14, 'Fourteen codex artists');
  for (const fighter of FIGHTERS) {
    const selector = `[data-codex="${fighter.id}"]`; await activate(page, selector);
    await expectFocus(page, selector);
    assert.equal(await page.locator(selector).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.codex-head h2').textContent(), fighter.name);
  }
  checked('all fourteen codex selections keep focus and expose their pressed state');
  await activate(page, '[data-codex="pomni"]');
  const finaleOpener = '[data-finale-fighter="pomni"]';
  await activate(page, finaleOpener);
  await page.waitForFunction(() => window.Encore.finales?.ready);
  await group(page, '.finale-choices', 3, 'Three finale choices');
  for (const id of ['pomni.impact', 'pomni.special', 'pomni.super']) {
    const selector = `[data-finale-id="${id}"]`; await activate(page, selector);
    await page.waitForFunction(id => window.Encore.finales?.id === id && window.Encore.finales.ready, id);
    await expectFocus(page, selector);
    assert.equal(await page.locator(selector).getAttribute('aria-pressed'), 'true');
  }
  await tabTo(page, '#finale-costume');
  const finaleCostumes = await page.locator('#finale-costume option').evaluateAll(options => options.map(option => option.value));
  for (let index = 1; index <= 2; index++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(() => window.Encore.finales?.ready);
    await expectFocus(page, '#finale-costume');
    assert.equal(await page.locator('#finale-costume').inputValue(), finaleCostumes[index]);
  }
  await page.keyboard.press('Escape'); await expectFocus(page, finaleOpener);
  assert.equal(await page.evaluate(() => window.Encore.finales), null);
  checked('gallery choices and successive costume changes preserve focus, then Escape restores the artist opener');

  await nav(page, 'archives');
  await tabTo(page, '#archive-filter');
  await page.keyboard.press('ArrowDown'); await expectFocus(page, '#archive-filter');
  assert.equal(await page.locator('#archive-filter').inputValue(), 'playable');
  assert.equal(await page.locator('[data-archive-id]').count(), 14);
  await page.keyboard.press('Home'); await expectFocus(page, '#archive-filter');
  assert.equal(await page.locator('#archive-filter').inputValue(), 'all');
  await activate(page, '[data-page="1"]'); await expectFocus(page, '[data-page="1"]');
  assert.match(await page.locator('.toolbar').last().textContent(), /Page 2 \/ 8/);
  await page.keyboard.press('Enter'); await expectFocus(page, '[data-page="1"]');
  assert.match(await page.locator('.toolbar').last().textContent(), /Page 3 \/ 8/);
  await activate(page, '[data-page="-1"]'); await expectFocus(page, '[data-page="-1"]');
  assert.match(await page.locator('.toolbar').last().textContent(), /Page 2 \/ 8/);
  checked('archive filter and forward/back pagination preserve focus across list replacement');

  await tabTo(page, '#archive-search');
  await page.keyboard.type('Pomni'); await page.waitForTimeout(280);
  await expectFocus(page, '#archive-search'); assert.equal(await page.locator('#archive-search').inputValue(), 'Pomni');
  await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#archive-search').evaluate(input => input.selectionStart), 1);
  await page.keyboard.press('End'); assert.equal(await page.locator('#archive-search').evaluate(input => input.selectionStart), 5);
  await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.waitForTimeout(280);
  await expectFocus(page, '#archive-search'); assert.equal(await page.locator('#archive-search').inputValue(), '');
  checked('search typing and native Home/End caret movement are not intercepted by card navigation');

  // While text is actively edited, a gamepad must not steal focus or characters.
  await pad(15); await expectFocus(page, '#archive-search');
  assert.equal(await page.locator('#archive-search').inputValue(), '');
  await tabTo(page, '#archive-filter');
  await pad(15); await expectFocus(page, '#archive-filter');
  assert.equal(await page.locator('#archive-filter').inputValue(), 'playable');
  await pad(14); assert.equal(await page.locator('#archive-filter').inputValue(), 'all');
  const padTargets = [];
  for (let step = 0; step < 7; step++) {
    await pad(step % 2 ? 12 : 13);
    assert.equal(await matchesFocus(page, '#archive-search'), false, 'A pad traversal must not enter the text-editing trap');
    padTargets.push(await page.evaluate(() => document.activeElement.outerHTML));
  }
  assert.ok(new Set(padTargets).size >= 2);
  checked('virtual gamepad respects active text editing, edits native filters and avoids trapping later navigation in search');

  await nav(page, 'settings');
  await tabTo(page, '[data-setting="layout"]');
  await page.keyboard.press('End'); await expectFocus(page, '[data-setting="layout"]');
  assert.equal(await page.locator('[data-setting="layout"]').inputValue(), 'qwerty');
  await page.keyboard.press('Home'); await expectFocus(page, '[data-setting="layout"]');
  assert.equal(await page.locator('[data-setting="layout"]').inputValue(), 'azerty');
  await tabTo(page, '[data-setting="volume"]');
  await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight'); await expectFocus(page, '[data-setting="volume"]');
  assert.equal(await page.locator('[data-setting="volume"]').inputValue(), '0.05');
  await page.keyboard.press('End'); assert.equal(await page.locator('[data-setting="volume"]').inputValue(), '1');
  await page.keyboard.press('Home'); for (let step = 0; step < 5; step++) await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-setting="volume"]').inputValue(), '0.25');
  checked('native select Home/End and range keys retain focus and change their own values');

  const alternate = '[data-bind-player="0"][data-bind-action="light"][data-bind-slot="1"]';
  await activate(page, alternate); await page.locator('#modal[open]').waitFor();
  await page.keyboard.press('KeyF'); await expectFocus(page, alternate);
  assert.equal(await page.locator('#modal').isVisible(), false);
  assert.deepEqual((await state()).profile.settings.bindings[0].light, ['KeyJ', 'KeyF']);
  await page.keyboard.press('Enter'); await page.keyboard.press('Backspace'); await expectFocus(page, alternate);
  assert.deepEqual((await state()).profile.settings.bindings[0].light, ['KeyJ']);
  await page.keyboard.press('Enter'); await page.keyboard.press('Escape'); await expectFocus(page, alternate);
  checked('binding capture adds and removes an alternative, preserves the exact button after settings refresh and supports Escape cancellation');

  // A summary is operated by the virtual pad through the actual modal menu.
  await nav(page, 'home'); await activate(page, '.mode-card[data-mode="versus"]');
  await page.waitForFunction(() => window.Encore.screen === 'select');
  await activate(page, wardrobeOpener); await page.locator('#modal[open]').waitFor();
  await tabTo(page, '#wardrobe-variant');
  await pad(15); await expectFocus(page, '#wardrobe-variant');
  assert.notEqual(await page.locator('#wardrobe-variant').inputValue(), 'pomni');
  // Some archive costumes intentionally have no primary reference. Return to
  // the sourced base artwork before asserting that reference links are exposed.
  await pad(14); await expectFocus(page, '#wardrobe-variant');
  assert.equal(await page.locator('#wardrobe-variant').inputValue(), 'pomni');
  for (let attempt = 0; attempt < 10 && !await matchesFocus(page, '#modal summary'); attempt++) await pad(13);
  await expectFocus(page, '#modal summary');
  const wasOpen = await page.evaluate(() => document.activeElement.closest('details').open);
  await pad(0);
  assert.equal(await page.evaluate(() => document.activeElement.closest('details').open), !wasOpen);
  assert.ok(await page.locator('#modal details[open] .fidelity-sources a').count() > 0);
  await pad(1); assert.equal(await page.locator('#modal').isVisible(), false); await expectFocus(page, wardrobeOpener);
  checked('virtual gamepad reaches a source summary, opens its references with A and closes the wardrobe with B');
  await page.evaluate(() => { window.__accessibilityPad.connected = false; window.__accessibilityPad.pressed = []; });
  await assertProgress(baseline);
  const desktopFinal = await state();
  const allowedSettings = new Set(['sound', 'ambience', 'reducedMotion']);
  for (const [key, value] of Object.entries(baseline.profile.settings)) if (!allowedSettings.has(key)) assert.deepEqual(desktopFinal.profile.settings[key], value, 'Unrelated setting changed: ' + key);
  report.desktopSettingsChanged = [...allowedSettings];
  checked('desktop navigation and previews preserve all progression and replay data; temporary remapping, layout and volume changes are restored');
  await page.screenshot({ path: path.join(output, 'desktop-keyboard-selection.png'), fullPage: true });

  phoneContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const phone = await phoneContext.newPage(); watch(phone, '390px: ');
  await phone.goto(base + '/combat/', { waitUntil: 'networkidle' }); await phone.waitForFunction(() => window.Encore?.screen === 'home');
  const phoneBaseline = await state(phone); await noOverflow(phone, '390px home');
  await group(phone, 'nav[data-menu-group]', 4, '390px main navigation');
  await activate(phone, '.mode-card[data-mode="versus"]', 'Space');
  await phone.waitForFunction(() => window.Encore.screen === 'select');
  await group(phone, '.roster', 14, '390px fighter grid');
  await phone.keyboard.press('End'); await phone.keyboard.press('Enter');
  await expectFocus(phone, `[data-fighter="${FIGHTERS.at(-1).id}"]`);
  await phone.keyboard.press('Home'); await phone.keyboard.press('Enter'); await expectFocus(phone, '[data-fighter="pomni"]');
  await group(phone, '.stages', 12, '390px stage grid');
  await phone.keyboard.press('End'); await phone.keyboard.press('Enter'); await expectFocus(phone, `[data-stage="${STAGES.at(-1).id}"]`);
  await noOverflow(phone, '390px selection');
  await activate(phone, wardrobeOpener); await phone.locator('#modal[open]').waitFor();
  await tabTo(phone, '#wardrobe-variant'); await phone.keyboard.press('ArrowDown'); await expectFocus(phone, '#wardrobe-variant');
  await noOverflow(phone, '390px wardrobe');
  await phone.keyboard.press('Escape'); await expectFocus(phone, wardrobeOpener);
  await nav(phone, 'codex'); await activate(phone, '[data-finale-fighter="pomni"]');
  await phone.waitForFunction(() => window.Encore.finales?.ready);
  await tabTo(phone, '[data-finale-id="pomni.impact"]'); await phone.keyboard.press('End'); await phone.keyboard.press('Enter');
  await phone.waitForFunction(() => window.Encore.finales?.id === 'pomni.super' && window.Encore.finales.ready);
  await expectFocus(phone, '[data-finale-id="pomni.super"]'); await noOverflow(phone, '390px gallery');
  await phone.screenshot({ path: path.join(output, 'mobile-keyboard-gallery.png'), fullPage: true });
  await phone.keyboard.press('Escape'); await expectFocus(phone, '[data-finale-fighter="pomni"]');
  await assertProgress(phoneBaseline, phone);
  assert.deepEqual((await state(phone)).profile.settings, phoneBaseline.profile.settings);
  checked('390px keyboard journey opens wardrobe and finales without overflow or lost return focus, with profile and replay unchanged');

  assert.deepEqual(report.errors, []);
  report.runtimeSourceHashesAfter = await hashes();
  report.runtimeUnchanged = JSON.stringify(report.runtimeSourceHashesAfter) === JSON.stringify(report.runtimeSourceHashes);
  assert.equal(report.runtimeUnchanged, true, 'Runtime files changed while the accessibility suite ran');
  checked('no browser errors and unchanged tested source files');
  report.pass = true;
} catch (error) {
  report.failure = { message: error.message, stack: error.stack };
  process.exitCode = 1;
  console.error(error);
  await page?.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
} finally {
  await phoneContext?.close(); await browser?.close();
  report.completedAt = new Date().toISOString();
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2) + '\n');
  console.log('ENCORE_ACCESSIBILITY_SUMMARY ' + JSON.stringify({ pass: report.pass, checks: report.checks.length, report: reportFile }));
}

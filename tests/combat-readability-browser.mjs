/** Optional visual cues and archive-editing regressions through the public UI.
 * The browser clock controls time; no engine, profile or Encore state is assigned.
 * The local duel is played with keyboard input, including its critical life / KO.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { GAME_VERSION, SAVE_KEY } from '../combat/session.mjs';
let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178').replace(/\/$/, '');
const output = path.resolve('audit-combat/readability-0.7.0');
await fs.mkdir(output, { recursive: true });
const sources = ['combat/app.mjs', 'combat/session.mjs', 'combat/readability.mjs', 'combat/style.css', 'tests/combat-readability.test.mjs', 'tests/combat-readability-browser.mjs'];
const report = { schema: 'encore-readability-browser/v1', version: GAME_VERSION, generatedAt: new Date().toISOString(), base, checks: [], errors: [], pass: false,
  sourceHashes: Object.fromEntries(await Promise.all(sources.map(async file => [file, createHash('sha256').update(await fs.readFile(file)).digest('hex')]))),
  scope: 'Real keyboard and pointer UI in desktop / 390 px Chromium; controlled browser clock for debounce and combat timing. A real local mirror duel supplies the low-life and KO states.',
  limitations: ['No physical phone or controller.', 'Grayscale inspection is an internal visual aid, not a simulation of every color-vision deficiency or a user study.', 'No claim of global palette accessibility or screen-reader playability.'],
};
const checked = (name, detail = null) => { report.checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
report.browser = browser.version();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) report.errors.push('HTTP ' + response.status() + ' ' + response.url()); });
const snapshot = () => page.evaluate(() => window.Encore.snapshot);
const advance = ms => page.clock.runFor(ms);
const nav = id => page.locator('nav [data-nav="' + id + '"]').click();
const click = id => page.locator('[data-action="' + id + '"]').click();
async function ready() {
  const deadline = Date.now() + 20000;
  while (!await page.evaluate(() => window.Encore?.ready)) {
    if (Date.now() > deadline) throw new Error('Match did not prepare');
    await new Promise(resolve => setTimeout(resolve, 30));
  }
}
async function start(mode, mirror = false) {
  await page.locator('.mode-card[data-mode="' + mode + '"]').click();
  if (mirror) { await page.locator('[data-side="1"]').click(); await page.locator('[data-fighter="pomni"]').click(); }
  await click('start'); await ready(); await advance(1900); await page.locator('#arena').focus();
  assert.equal((await snapshot()).phase, 'fight');
}
async function home() {
  if (!await page.locator('#modal').evaluate(element => element.open)) await click('pause');
  await page.locator('#modal [data-action="home"]').click();
}
async function layout(label) {
  const view = await page.evaluate(() => {
    const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
    const text = [...document.querySelectorAll('.gauge-label,.readability-status,.hud-player-id')].map(element => ({ text: element.textContent, width: element.clientWidth, scroll: element.scrollWidth, font: getComputedStyle(element).fontSize }));
    return { viewport: innerWidth, viewportHeight: innerHeight, scroll: document.documentElement.scrollWidth, canvas: box('#arena'), stage: box('.arena-stage'), hud: box('.hud'), text };
  });
  assert.ok(view.scroll <= view.viewport + 1, label + ' page overflow');
  assert.ok(view.hud.bottom <= view.canvas.y + 1, label + ' HUD must not cover the stage');
  assert.ok(Math.abs(view.canvas.width / view.canvas.height - 16 / 9) < .015, label + ' canvas ratio');
  assert.ok(view.text.every(value => value.scroll <= value.width + 1), label + ' clipped cue text ' + JSON.stringify(view.text));
  if (view.viewport >= 700) assert.ok(view.hud.y >= -1 && view.canvas.bottom <= view.viewportHeight + 1, label + ' HUD and complete stage must fit the viewport ' + JSON.stringify(view));
  assert.ok(view.canvas.x >= 0 && view.canvas.right <= view.viewport + 1, label + ' canvas horizontal bounds');
  return view;
}
try {
  await page.clock.install({ time: new Date('2026-10-29T12:00:00Z') });
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-29T12:01:00Z'));
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.enhancedReadability), false);

  await nav('archives'); await page.locator('#archive-search').fill('Pomni'); await nav('home'); await advance(250);
  assert.equal(await page.evaluate(() => window.Encore.screen), 'home');
  checked('a pending archive search cannot reopen its screen after navigation');

  await nav('archives'); await page.locator('#archive-search').fill('Pomni');
  await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Shift+ArrowRight');
  await advance(250);
  assert.deepEqual(await page.locator('#archive-search').evaluate(input => [input.selectionStart, input.selectionEnd, input.selectionDirection]), [1, 2, 'forward']);
  assert.equal(await page.locator('#archive-search').evaluate(input => input === document.activeElement), true);
  checked('archive filtering preserves a middle selection and its direction');

  await page.locator('#archive-search').fill('Jax'); await page.keyboard.press('Tab'); await advance(250);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'archive-filter');
  assert.ok((await page.locator('.archive-card h3').allTextContents()).every(name => /jax/i.test(name)));
  checked('archive filtering preserves focus already moved to the native filter');

  await page.locator('#archive-search').fill('Pomni'); await page.locator('#archive-filter').selectOption('playable'); await advance(250);
  assert.equal(await page.locator('#archive-filter').inputValue(), 'playable');
  assert.deepEqual(await page.locator('.archive-card h3').allTextContents(), ['Pomni']);
  checked('an immediate filter change supersedes the pending search render');

  await nav('settings');
  const preference = page.locator('[data-setting="enhancedReadability"]');
  await preference.focus(); await page.keyboard.press('Space');
  assert.equal(await preference.isChecked(), true);
  assert.equal(await page.evaluate(() => document.body.classList.contains('enhanced-readability')), true);
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).settings.enhancedReadability, SAVE_KEY), true);
  await page.locator('[data-setting="rounds"]').selectOption('1'); await page.locator('[data-setting="sound"]').uncheck();
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.enhancedReadability), true);
  checked('keyboard activation persists reinforced cues across a reload in profile v1');

  await start('local', true);
  assert.deepEqual((await snapshot()).fighters.map(fighter => fighter.id), ['pomni', 'pomni']);
  assert.deepEqual(await page.locator('.fighter-marker').allTextContents(), ['J1', 'J2']);
  const identities = await page.locator('.fighter-marker .identity-shape').evaluateAll(nodes => nodes.map(element => ({ radius: getComputedStyle(element).borderRadius, transform: getComputedStyle(element).transform })));
  assert.notDeepEqual(identities[0], identities[1]);
  assert.equal(await page.locator('[role="meter"]').count(), 6);
  assert.equal(await page.locator('#health-track-0').getAttribute('aria-label'), 'vie joueur 1');
  checked('a mirror duel uses stable player labels, distinct shapes and six named gauges', { identities });
  report.desktopLayout = await layout('desktop');
  await page.locator('.arena-wrap').screenshot({ path: path.join(output, 'mirror-desktop.png') });
  await page.screenshot({ path: path.join(output, 'mirror-desktop-viewport.png') });

  await click('fullscreen');
  const fullscreenDeadline = Date.now() + 5000;
  while (await page.evaluate(() => document.fullscreenElement?.id) !== 'main') {
    if (Date.now() > fullscreenDeadline) throw new Error('Fullscreen request did not complete');
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  assert.equal(await page.evaluate(() => document.fullscreenElement?.id), 'main');
  report.fullscreenLayout = await layout('fullscreen');
  await page.screenshot({ path: path.join(output, 'fullscreen-viewport.png') });
  const scroll = await page.locator('#main').evaluate(element => ({ overflow: getComputedStyle(element).overflowY, height: element.clientHeight, total: element.scrollHeight }));
  assert.ok(scroll.total <= scroll.height || ['auto','scroll'].includes(scroll.overflow), 'tall fullscreen content remains reachable');
  await page.evaluate(() => document.exitFullscreen());
  if (await page.locator('#modal').evaluate(element => element.open)) await click('resume');
  checked('fullscreen preserves the stage ratio and permits access to larger cue content', scroll);

  await page.locator('#arena').focus(); await page.keyboard.down('KeyD');
  const beforeMove = await snapshot(); await advance(1200);
  await page.keyboard.press('KeyW'); await advance(250);
  const jumping = await snapshot();
  assert.ok(jumping.fighters[0].x > beforeMove.fighters[0].x + 50);
  assert.ok(jumping.fighters[0].y < beforeMove.fighters[0].y);
  const markerX = await page.locator('.fighter-marker').evaluateAll(nodes => nodes.map(element => parseFloat(element.style.left)));
  assert.ok(Math.abs(markerX[0] - jumping.fighters[0].x / 1280 * 100) < .01);
  assert.deepEqual(await page.locator('.fighter-marker').allTextContents(), ['J1', 'J2']);
  await advance(850); await page.keyboard.up('KeyD');
  checked('player shapes and labels follow a real keyboard move and jump in a mirror duel', { positions: jumping.fighters.map(fighter => ({x: fighter.x, y: fighter.y})), markerX });

  let critical = false;
  for (let attempt = 0; attempt < 35 && (await snapshot()).phase !== 'matchOver'; attempt++) {
    const state = await snapshot(), toward = state.fighters[0].x < state.fighters[1].x ? 'KeyD' : 'KeyA';
    await page.keyboard.down(toward); await advance(300); await page.keyboard.up(toward);
    await page.keyboard.press('KeyK'); await advance(650);
    const after = await snapshot();
    if (!critical && after.fighters[1].hp > 0 && after.fighters[1].hp <= after.fighters[1].maxHp / 4) {
      assert.match(await page.locator('#readability-status-1').textContent(), /VIE CRITIQUE/);
      assert.equal(await page.locator('#health-track-1').evaluate(element => element.classList.contains('critical')), true);
      await page.locator('.arena-wrap').screenshot({ path: path.join(output, 'critical-life-desktop.png') });
      critical = true;
    }
  }
  assert.equal(critical, true, 'the played duel visits a visible critical-life state');
  checked('real keyboard damage produces text and a patterned critical-life indicator');
  assert.equal((await snapshot()).phase, 'matchOver');
  assert.ok(await page.evaluate(() => window.Encore.presentation.finisherId));
  assert.equal(await page.locator('.fighter-markers').isVisible(), false);
  checked('actor markers are hidden during the actual KO finale composition');
  await advance(5000); await home();

  const progress = await page.evaluate(() => window.Encore.profile.stats);
  await start('training', true);
  assert.match(await page.locator('#readability-status-0').textContent(), /FINALE PRÊTE/);
  assert.equal(await page.locator('#finale-value-0').textContent(), '100 / 75');
  await page.locator('#training-meter').uncheck(); await page.locator('#arena').focus();
  await page.keyboard.press('KeyO'); await advance(100);
  assert.equal((await snapshot()).fighters[0].meter, 25);
  assert.doesNotMatch(await page.locator('#readability-status-0').textContent(), /FINALE PRÊTE/);
  assert.equal(await page.locator('#finale-value-0').textContent(), '25 / 75');
  assert.deepEqual(await page.evaluate(() => window.Encore.profile.stats), progress);
  checked('a played finale consumes its authored 75-point threshold and clears the ready text without a training award');

  const colors = await page.locator('.fighter-marker').evaluateAll(nodes => nodes.map(element => ({ foreground: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor })));
  const light = color => {
    const channels = color.match(/[\d.]+/g).slice(0,3).map(Number).map(value => { const s=value/255; return s<=.04045?s/12.92:((s+.055)/1.055)**2.4; });
    return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  };
  report.markerContrast = colors.map(({ foreground, background }) => { const a=light(foreground),b=light(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05); });
  assert.ok(report.markerContrast.every(value => value >= 4.5));
  checked('both player labels retain at least 4.5 to 1 contrast against their opaque marker background', report.markerContrast);

  await page.setViewportSize({ width: 390, height: 844 }); await advance(17);
  report.mobileLayout = await layout('390 px');
  await page.locator('.arena-wrap').screenshot({ path: path.join(output, 'mirror-390px.png') });
  // Inspection aid only; this temporary document style is never saved to profile.
  const grayscale = await page.addStyleTag({ content: '.arena-wrap{filter:grayscale(1)!important}' });
  await page.locator('.arena-wrap').screenshot({ path: path.join(output, 'mirror-390px-grayscale.png') });
  await grayscale.evaluate(element => element.remove());
  checked('390 px keeps cue text and the full unstretched stage visible; an internal grayscale view is captured', report.mobileLayout);

  await home(); await nav('settings');
  await preference.focus(); await page.keyboard.press('Space');
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.enhancedReadability), false);
  await nav('home'); await start('training');
  assert.equal(await page.locator('.fighter-markers').isVisible(), false);
  assert.equal(await page.locator('.gauge-label').first().isVisible(), false);
  await page.setViewportSize({ width: 1440, height: 1000 }); await advance(17);
  await page.locator('.arena-wrap').screenshot({ path: path.join(output, 'default-desktop.png') });
  assert.equal(await page.locator('#arena').evaluate(element => { const rect=element.getBoundingClientRect(),parent=element.parentElement.getBoundingClientRect();return rect.width<=parent.width+1&&rect.height<=parent.height+1; }), true);
  checked('disabling reinforced cues restores the compact HUD and keeps its canvas within the stage');
  assert.deepEqual(report.errors, []); report.pass = true;
} catch (error) {
  report.errors.push(error.stack || error.message); process.exitCode = 1;
  await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
  console.error(error);
} finally {
  await browser.close();
  await fs.writeFile(path.resolve('audit-combat/readability-browser-report.json'), JSON.stringify(report, null, 2) + '\n');
}

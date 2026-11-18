/** Exercise the public guest-level menu, load both pictures per world, then win a duel with keyboard input. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CROSSOVER_VISITS, visitCostumes } from '../combat/crossover-visits.mjs';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { emptyProfile } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')));
}
const origin = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const directory = path.resolve('audit-combat/visits');
await fs.mkdir(directory, { recursive: true });
const browser = await playwright.chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const report = { checks: [], errors: [], visits: [], pass: false };
function check(name) { report.checks.push({ name, pass: true }); console.log('PASS ' + name); }
try {
  const context = await browser.newContext({ viewport: { width: 1360, height: 930 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && response.url().includes('/escales/')) report.errors.push(response.status() + ' ' + response.url());
  });
  await page.clock.install({ time: new Date('2026-10-22T12:00:00Z') });
  await page.goto(origin + '/combat/index.html?standalone=1', { waitUntil: 'networkidle' });
  await page.locator('[data-nav="settings"]').first().click();
  const profile = emptyProfile();
  profile.settings.difficulty = 'easy'; profile.settings.rounds = 1; profile.settings.sound = false;
  await page.locator('#import-profile').setInputFiles({ name: 'guest-level-settings.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(profile)) });
  await page.locator('#confirm-import').click();
  await page.locator('[data-nav="home"]').first().click();
  await page.locator('[data-action="visits"]').click();
  assert.equal(await page.locator('[data-visit]').count(), CROSSOVER_VISITS.length);
  for (const visit of CROSSOVER_VISITS) {
    const choice = page.locator(`[data-visit="${visit.world}"]`);
    await choice.click();
    assert.equal(await choice.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#visit-title').textContent(), visit.title);
    assert.ok((await page.locator('.visit-copy').textContent()).includes(visit.intro));
    assert.ok((await page.locator('.visit-copy').textContent()).includes(STAGES.find(stage => stage.id === visit.stage).name));
    const images = await page.locator('.visit-art').evaluate(async (intro, world) => {
      try { await intro.decode(); } catch { throw new Error('Prologue illisible : ' + intro.currentSrc); }
      const ending = new Image();
      ending.src = new URL(`../assets/encore/escales/${world}/ending.webp`, document.baseURI).href;
      try { await ending.decode(); } catch { throw new Error('Épilogue illisible : ' + ending.src); }
      return { intro: [intro.naturalWidth, intro.naturalHeight], ending: [ending.naturalWidth, ending.naturalHeight] };
    }, visit.world);
    assert.deepEqual(images, { intro: [3840, 2160], ending: [3840, 2160] });
    report.visits.push({ world: visit.world, stage: visit.stage, costumes: visitCostumes(visit), ...images });
  }
  check('Les neuf affiches proposent chacune leur lieu, leurs deux tenues et deux illustrations UHD décodables');
  await page.setViewportSize({ width: 390, height: 840 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.locator('[data-visit="metarunner"]').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#visit-title').textContent(), CROSSOVER_VISITS[0].title);
  assert.equal(await page.locator('[data-visit="metarunner"]').evaluate(el => document.activeElement === el), true);
  check('Les escales sont lisibles à 390 pixels et le changement au clavier conserve le focus');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.clock.pauseAt(new Date('2026-10-22T12:08:00Z'));
  const visit = CROSSOVER_VISITS[0];
  await page.locator(`[data-play-visit="${visit.world}"]`).click();
  const held = new Set();
  async function direction(next = '') {
    for (const key of [...held]) if (key !== next) { await page.keyboard.up(key); held.delete(key); }
    if (next && !held.has(next)) { await page.keyboard.down(next); held.add(next); }
  }
  async function fight() {
    await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
    const fighter = FIGHTERS.find(item => item.id === visit.fighters[0]);
    const rival = FIGHTERS.find(item => item.id === visit.fighters[1]);
    const reach = fighter.moves.light.reach * fighter.reach + rival.combat.simulationBody.width / 2 - 18;
    for (let decision = 0; decision < 850; decision++) {
      const state = await page.evaluate(() => window.Encore.snapshot);
      if (state.phase === 'matchOver') { await direction(); return state.winner === 0; }
      if (state.phase !== 'fight') { await direction(); await page.clock.runFor(480); continue; }
      const [a, b] = state.fighters;
      assert.deepEqual([a.id, b.id], visit.fighters);
      const toward = a.x < b.x ? 'KeyD' : 'KeyA';
      if (a.attack || a.hit || a.blockstun || a.cool) {
        if (a.attack?.confirmed && a.attack.slot === 'light') await page.keyboard.press('KeyK');
        else if (a.attack?.confirmed && a.attack.slot === 'heavy' && a.resource > 25) {
          await direction(toward); await page.keyboard.press('KeyI');
        }
      } else if (Math.abs(a.x - b.x) > reach) await direction(toward);
      else {
        await direction();
        await page.keyboard.press(a.meter >= 85 && a.resource >= 36 ? 'KeyO' : b.block && !b.throwProtect && !b.hit ? 'KeyU' : 'KeyJ');
      }
      await page.clock.runFor(120);
    }
    throw new Error('Le duel invité ne s’est pas terminé dans le temps prévu.');
  }
  let won = false;
  for (let attempt = 0; attempt < 3 && !won; attempt++) {
    won = await fight();
    await page.clock.runFor(3500);
    if (await page.locator('[data-action="result-screen"]').isVisible()) await page.locator('[data-action="result-screen"]').click();
    if (!won && attempt < 2) await page.locator('[data-action="rematch"]').click();
  }
  assert.ok(won, 'Une victoire jouée doit ouvrir l’épilogue');
  await page.locator('.visit-result .visit-art').evaluate(img => img.decode());
  assert.ok((await page.locator('.visit-result').textContent()).includes(visit.ending));
  assert.equal(await page.evaluate(() => window.Encore.profile.program), null);
  await page.screenshot({ path: path.join(directory, 'epilogue.png') });
  await page.locator('dialog [data-action="visits"]').click();
  assert.equal(await page.locator('#visit-title').textContent(), visit.title);
  check('Une victoire jouée au clavier affiche le véritable épilogue et ramène au choix des escales');
  assert.deepEqual(report.errors, []);
  report.pass = true;
} finally {
  await fs.writeFile(path.join(directory, 'browser-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

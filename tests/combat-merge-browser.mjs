/** UI regression for the merged 64-fighter roster and illustrated wardrobe. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { emptyProfile, SAVE_KEY } from '../combat/session.mjs';
import { FIGHTERS } from '../combat/data.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')));
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4189';
const output = path.resolve('audit-combat/merge-2026-11-19');
await fs.mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox','--disable-dev-shm-usage'],
});
const report = { createdAt: new Date().toISOString(), checks: [], errors: [], limitations: ['Headless Chromium; no physical-device or full CI campaign claim.'] };
const contexts = [];
const pass = name => { report.checks.push({ name, pass: true }); console.log('PASS ' + name); };
async function pageFor(entry = '/combat/', fixture = null) {
  const context = await browser.newContext({ viewport: { width: 1365, height: 950 }, serviceWorkers: 'block' });
  contexts.push(context);
  if (fixture) await context.addInitScript(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: SAVE_KEY, value: fixture });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push('HTTP ' + response.status() + ' ' + response.url()); });
  await page.goto(base + entry, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  return page;
}
async function select(page, mode, fighter) {
  await page.locator(`.mode-card[data-mode="${mode}"]`).click();
  assert.equal(await page.locator('.roster [data-fighter]').count(), FIGHTERS.length);
  assert.deepEqual(await page.locator('.roster [data-fighter]').evaluateAll(items => items.map(item => item.dataset.fighter)), FIGHTERS.map(item => item.id));
  await page.locator(`[data-fighter="${fighter}"]`).click();
}
try {
  assert.equal(FIGHTERS.length, 64);
  const page = await pageFor();
  await select(page, 'local', 'queenie');
  assert.deepEqual(await page.locator('#variant-0 option').evaluateAll(items => items.map(item => item.value)), ['', 'abstractingqueenie']);
  await page.locator('[data-stage="home-queenie"]').click();
  assert.equal(await page.locator('[data-stage="home-queenie"]').getAttribute('aria-pressed'), 'true');
  pass('64 fighters are selectable; Queenie offers her illustrated appearance without nonexistent crossover choices');
  await page.locator('[data-fighter="pomni"]').click();
  const picker = page.locator('[data-costume-picker="variant-0"]');
  await picker.locator('summary').click();
  await picker.locator('[data-costume-filter="series"]').selectOption('murderdrones');
  await picker.locator('[data-costume-filter="style"]').selectOption('fusion');
  await page.locator('#variant-0').selectOption('glitch-murderdrones-pomni-fusion');
  await page.locator('[data-stage="coppernine"]').click();
  assert.equal(await page.locator('[data-selection-artist="0"]').getAttribute('data-appearance-id'), 'glitch-murderdrones-pomni-fusion');
  await page.screenshot({ path: path.join(output, 'merged-wardrobe.png'), fullPage: false });
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore.ready && window.Encore.snapshot.phase === 'fight');
  assert.equal(await page.evaluate(() => window.Encore.snapshot.fighters[0].id), 'pomni');
  pass('The original fusion wardrobe and crossover stage launch a local duel after roster expansion');

  const arcade = await pageFor();
  await select(arcade, 'arcade', 'max');
  await arcade.locator('[data-stage="home-max"]').click();
  await arcade.locator('[data-action="start"]').click();
  await arcade.waitForFunction(() => window.Encore.ready);
  const checkpoint = await arcade.evaluate(() => window.Encore.program);
  assert.equal(checkpoint.initialStage, 'home-max');
  await arcade.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await arcade.evaluate(() => window.Encore.profile.program), checkpoint);
  await arcade.locator('[data-action="resume-program"]').click();
  await arcade.waitForFunction(() => window.Encore.ready);
  assert.deepEqual(await arcade.evaluate(() => window.Encore.program), checkpoint);
  pass('A dedicated Candy Canyon arrangement starts arcade and preserves its checkpoint across reload');

  const tournament = await pageFor();
  await select(tournament, 'tournament', 'queenie');
  await tournament.locator('[data-action="start"]').click();
  await tournament.waitForFunction(() => window.Encore.ready);
  assert.equal(await tournament.locator('#modal[open] .story-intro').count(), 1);
  assert.equal(await tournament.evaluate(() => window.Encore.paused), true);
  await tournament.locator('#modal [data-action="resume"]').click();
  await tournament.waitForFunction(() => !window.Encore.paused && window.Encore.snapshot.phase === 'fight');
  pass('The promoted fighter tournament retains its introduction and starts after explicit continue');

  const { fixtures } = JSON.parse(await fs.readFile(new URL('./fixtures/combat-program-v1-catalogs.json', import.meta.url), 'utf8'));
  const legacyRun = fixtures.find(item => item.mode === 'tournament' && item.catalog === 'base-14-fighters-12-arenas').start;
  const legacy = await pageFor('/combat/', { ...emptyProfile(), program: legacyRun });
  assert.deepEqual(await legacy.evaluate(() => window.Encore.profile.program), legacyRun);
  await legacy.locator('[data-action="resume-program"]').click();
  await legacy.waitForFunction(() => window.Encore.ready);
  assert.deepEqual(await legacy.evaluate(() => window.Encore.program), legacyRun);
  assert.equal(await legacy.locator('#modal[open] .story-intro').count(), 1);
  assert.match(await legacy.locator('#modal .story-intro').textContent(), /tirage.*conservé/i);
  await legacy.locator('#modal [data-action="bracket"]').click();
  assert.equal(await legacy.locator('#modal .tournament-bracket').count(), 1);
  assert.equal(await legacy.locator('.rival-mark, .rival-match').count(), 0);
  assert.doesNotMatch(await legacy.locator('#modal').textContent(), /Ton rival|finale garantie|rival garanti/i);
  pass('An original tournament resumes its saved draw without invented rival guarantees');

  const archives = await pageFor();
  await archives.locator('[data-nav="archives"]').first().click();
  for (const [id, labels] of [
    ['bestchildren', ['Enfant Best A', 'Enfant Best B']],
    ['mildenhallsouls', ['Âme de Mildenhall A', 'Âme de Mildenhall B', 'Âme de Mildenhall C']],
    ['laughingshadows', ['Ombre rieuse A', 'Ombre rieuse B', 'Ombre rieuse C']],
  ]) {
    await archives.locator('#archive-search').fill(id);
    const card = archives.locator(`[data-archive-id="${id}"]`);
    await card.waitFor();
    await archives.waitForFunction(({ id, count }) => {
      const images = [...document.querySelectorAll(`[data-archive-id="${id}"] img`)];
      return images.length === count && images.every(image => image.complete && image.naturalWidth > 0);
    }, { id, count: labels.length });
    assert.deepEqual(await card.locator('img').evaluateAll(images => images.map(image => image.alt)), labels);
    assert.equal(new Set(await card.locator('img').evaluateAll(images => images.map(image => image.currentSrc))).size, labels.length);
    await archives.setViewportSize({ width: 390, height: 844 });
    assert.equal(await archives.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await archives.screenshot({ path: path.join(output, `archive-individual-${id}-mobile.png`), fullPage: true });
  }
  pass('Archive groups retain separate individual drawings and readable mobile layouts');

  const story = await pageFor();
  await select(story, 'story', 'queenie');
  await story.locator('[data-action="story-brief"]').click();
  assert.equal(await story.locator('.story-roadmap article').count(), 4);
  assert.equal(await story.locator('.story-roadmap .rival-chapter').count(), 1);
  await story.locator('#modal [data-action="close-modal"]').click();
  await story.locator('[data-action="start"]').click();
  await story.waitForFunction(() => window.Encore.ready);
  await story.locator('[data-action="story-skip"]').click();
  await story.locator('[data-action="story-start"]').click();
  await story.waitForFunction(() => !window.Encore.paused && window.Encore.snapshot.phase === 'fight');
  pass('The promoted fighter story keeps all four chapters, the rival roadmap and its playable reader');

  const settings = await pageFor('/dist-combat/');
  await settings.locator('[data-nav="settings"]').first().click();
  await settings.locator('[data-setting="friendships"]').check();
  await settings.reload({ waitUntil: 'networkidle' });
  assert.equal(await settings.evaluate(() => window.Encore.profile.settings.friendships), true);
  pass('The standalone distribution loads the same runtime and retains the friendship setting');
  assert.deepEqual(report.errors, []);
  pass('No page exception or failed same-origin resource was observed on the tested paths');
} catch (error) {
  report.failure = error.stack || String(error);
  throw error;
} finally {
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}

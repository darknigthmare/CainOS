/** Native-alpha asset inspection and actual wardrobe → training flows. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { VARIANTS } from '../combat/data.mjs';
import { REFINED_COSTUME_IDS } from '../combat/costume-refinements.mjs';
import { GAME_VERSION } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat/costumes-0.6.0');
await fs.mkdir(output, { recursive: true });
const browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, serviceWorkers: 'block' });
const checks = [], errors = [], records = [], matches = [];
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const files = ['combat/data.mjs', 'combat/costume-fidelity.mjs', 'combat/costume-refinements.mjs', 'combat/render.mjs', 'combat/render-presentation.mjs', 'combat/render-poses.mjs', 'combat/app.mjs', 'combat/session.mjs', 'tests/combat-costume-refinements-browser.mjs', ...new Set(VARIANTS.filter(v => REFINED_COSTUME_IDS.includes(v.id)).map(v => v.sprite.src.replace('../', '')))];
const report = { version: GAME_VERSION, checkedAt: new Date().toISOString(), base, scope: 'Technical pixel checks and actual UI matches. Canonical detail comparisons remain partial; original poses and proportions are adaptations.', checks, errors, records, matches, sourceHashes: Object.fromEntries(await Promise.all(files.map(async file => [file, sha(await fs.readFile(file))]))) };

try {
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' });
  await page.waitForFunction(version => window.Encore?.version === version, GAME_VERSION);
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="reducedMotion"]').check();
  const before = await page.evaluate(() => window.Encore.profile);
  await page.locator('[data-nav="home"]').first().click();

  const pixelRecords = await page.evaluate(async ids => {
    const { VARIANTS } = await import('/combat/data.mjs');
    const { drawPortrait, getFrame } = await import('/combat/render.mjs');
    const rows = [];
    for (const id of ids) {
      const variant = VARIANTS.find(v => v.id === id), portrait = document.createElement('canvas');
      portrait.width = 320; portrait.height = 360;
      await drawPortrait(portrait, variant);
      const frame = getFrame(variant), ctx = frame.canvas.getContext('2d', { willReadFrequently: true });
      const data = ctx.getImageData(0, 0, frame.width, frame.height).data;
      let visible = 0, clear = 0, partial = 0, darkSolid = 0, edge = 0;
      for (let y = 0; y < frame.height; y++) for (let x = 0; x < frame.width; x++) {
        const p = (y * frame.width + x) * 4, a = data[p + 3];
        if (a < 12) clear++; else visible++;
        if (a >= 12 && a < 220) partial++;
        if (a >= 220 && Math.max(data[p], data[p + 1], data[p + 2]) < 35) darkSolid++;
        if ((x === 0 || y === 0 || x === frame.width - 1 || y === frame.height - 1) && a >= 12) edge++;
      }
      rows.push({ id, width: frame.width, height: frame.height, bounds: frame.bounds, visible, clear, partial, darkSolid, edge, portrait: portrait.toDataURL() });
    }
    return rows;
  }, REFINED_COSTUME_IDS);
  for (const row of pixelRecords) {
    assert.ok(row.visible > 1000 && row.clear > 100, row.id);
    assert.equal(row.edge, 0, `${row.id}: extraction cuts visible pixels`);
    const bytes = Buffer.from(row.portrait.split(',')[1], 'base64');
    await fs.writeFile(path.join(output, `${row.id}-portrait.png`), bytes);
    const { portrait, ...metrics } = row;
    records.push({ ...metrics, portraitSHA256: sha(bytes) });
  }
  checked('All 20 replacement sprites have real transparent margins and complete extraction bounds', 'Native-alpha portraits loaded through the shipped renderer; no visible pixel touches any extracted outer edge.');

  for (const row of records.filter(r => r.id.startsWith('shadow'))) assert.ok(row.darkSolid > row.visible * .42, `${row.id}: black body lost`);
  checked('All seven Shadow bodies retain solid black pixels without opaque atlas rectangles', 'Every extracted Shadow figure has substantial opaque black body area and clear surrounding alpha.');

  const queen = records.find(r => r.id === 'gloinkqueenscale');
  assert.ok(queen.bounds.width > 1400 && queen.bounds.height >= 520 && queen.bounds.height < 540);
  assert.ok(records.find(r => r.id === 'horrorpomnispiral').bounds.height < 460);
  assert.ok(records.find(r => r.id === 'hunterjax').bounds.height >= 530);
  checked('Queen and adjacent horror cells isolate the complete intended component', 'Queen preserves its 529px body while excluding the neighboring rhinoceros fragment; both close horror cells keep their complete bodies.');

  const bubble = records.find(r => r.id === 'inertbubble');
  assert.ok(bubble.partial > bubble.visible * .55, 'Bubble center is still opaque');
  assert.ok(bubble.darkSolid > 200, 'Closed eyes must remain readable');
  checked('Bubble uses partial native alpha while retaining readable dark eyes', 'Most visible sphere pixels are translucent; eyes remain opaque enough to survive light and dark stages.');

  await page.locator('.mode-card[data-mode="versus"]').click();
  for (const id of REFINED_COSTUME_IDS) {
    const variant = VARIANTS.find(v => v.id === id);
    await page.locator(`[data-fighter="${variant.fighterId}"]`).click();
    await page.locator('#variant-0').selectOption(id);
    await page.locator(`[data-selection-artist="0"] [data-appearance="${id}"]`).click();
    await page.waitForFunction(id => document.querySelector('#wardrobe-preview')?.dataset.appearanceId === id && document.querySelector('#wardrobe-load')?.textContent === '', id);
    await page.locator('#wardrobe-preview').screenshot({ path: path.join(output, `${id}-wardrobe.png`) });
    if (variant.fidelity.observedTraits.length) {
      await page.locator('.costume-fidelity summary').click();
      assert.ok((await page.locator('.costume-fidelity').textContent()).includes('Comparaison partielle'));
    }
    await page.locator(`[data-try-appearance="${id}"]`).click();
    await page.waitForFunction(() => window.Encore?.ready && window.Encore.snapshot?.phase === 'fight');
    assert.equal((await page.evaluate(() => window.Encore.snapshot)).fighters[0].id, variant.fighterId);
    await page.locator('#arena').screenshot({ path: path.join(output, `${id}-fight.png`) });
    await page.keyboard.press('KeyJ');
    await page.waitForFunction(() => window.Encore.snapshot.fighters[0].stats.starts > 0);
    matches.push({ id, fighterId: variant.fighterId, acceptedAttack: true });
    await page.locator('[data-nav="home"]').first().click();
    await page.locator('[data-leave="home"]').click();
    await page.locator('.mode-card[data-mode="versus"]').click();
  }
  checked('Six primary-reference costumes expose the corrected detail review in their real wardrobe', 'All six keep their partial comparison label, source links and limits; captured previews use the new art.');
  assert.equal(matches.length, 20);
  assert.deepEqual(await page.evaluate(() => window.Encore.profile), before);
  checked('All 20 refined costumes launch actual training and accept a real keyboard attack', 'Wardrobe → Try appearance → fight was executed for every replacement; browsing/training does not award progress or change the profile.');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-fighter="bubble"]').click();
  await page.locator('#variant-0').selectOption('inertbubble');
  await page.locator('[data-selection-artist="0"] [data-appearance="inertbubble"]').click();
  await page.waitForFunction(() => document.querySelector('#wardrobe-preview')?.dataset.appearanceId === 'inertbubble' && document.querySelector('#wardrobe-load')?.textContent === '');
  assert.ok(await page.locator('#modal').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
  await page.locator('#modal').screenshot({ path: path.join(output, 'mobile-bubble-wardrobe.png') });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#variant-0').inputValue(), 'inertbubble');
  checked('Refined costume preview fits the 390px wardrobe and preserves selection after Escape', 'Viewport layout and keyboard closure checked; no claim about a physical phone.');
  assert.deepEqual(errors, []);
  checked('Refined costume flows produce no browser or local asset errors', 'All five generated PNG sheets and the new module loaded successfully.');
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Costume refinement browser QA: ${checks.length} checks passed.`);
} catch (error) {
  report.failure = error.message;
  await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  throw error;
} finally { await browser.close(); }

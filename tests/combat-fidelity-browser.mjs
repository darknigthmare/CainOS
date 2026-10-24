/**
 * Fidelity UI and versioned replay regressions through the public game UI.
 * COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-fidelity-browser.mjs
 * The short replay files are explicit compatibility fixtures, not earned wins.
 * No engine mutation hooks, asset substitutions or remote image dependencies.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { FIGHTERS, STAGES, VARIANTS, getReplayFighter } from '../combat/data.mjs';
import { FIDELITY_SOURCES } from '../combat/fidelity.mjs';
import { getStoryRoute } from '../combat/stories.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { GAME_VERSION, REPLAY_VERSIONS, REPLAY_KEY, replayRulesVersion, packInput, replayInputs, validateReplay } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat');
await fs.mkdir(output, { recursive: true });
const launch = () => playwright.chromium.launch({
  headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const browser = await launch();
let mobileBrowser;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
const checks = [], errors = [], stagePreviews = [], replayResults = [];
const checked = (name, detail) => { checks.push({ name, detail, pass: true }); console.log(`PASS ${name} — ${detail}`); };
function watch(target, label) {
  target.on('pageerror', error => errors.push(`${label}: ${error.message}`));
  target.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
}
watch(page, 'desktop');
const registeredURLs = new Set(FIDELITY_SOURCES.filter(source => source.url).map(source => new URL(source.url, base).href));
const replayFixture = (fighter, version) => ({
  format: 'circus-encore-replay', version,
  config: { fighters: [fighter, 'jax'], variants: [VARIANTS.find(v => v.fighterId === fighter)?.id || '', ''], stage: 'bigtop', cpu: [false, false], difficulty: 'normal', seed: 20261022, roundTime: 60, roundsToWin: 1, initialHealth: [10000, 10000] },
  // Stop during the retreat so an accidental rules upgrade changes the result.
  runs: [[112, 0, 0], [1, packInput({ slot: 'specialBack' }), 0], [9, 0, 0]],
});
function expectedReplaySnapshot(raw) {
  const replay = validateReplay(raw, FIGHTERS.map(f => f.id), STAGES.map(s => s.id));
  const engine = new CombatEngine({ ...replay.config, fighters: replay.config.fighters.map(id => getReplayFighter(id, replay.version)), stage: STAGES.find(s => s.id === replay.config.stage), mode: 'versus', rulesVersion: replayRulesVersion(replay.version) });
  for (const inputs of replayInputs(replay)) { engine.step(FIXED_DT, inputs); engine.drainEvents(); }
  return engine.getSnapshot();
}
async function importReplay(raw) {
  await page.locator('#import-replay').setInputFiles({ name: `encore-${raw.config.fighters[0]}-${raw.version}.json`, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(raw)) });
  await page.waitForFunction(() => window.Encore?.ready && document.querySelector('#modal[open] #modal-title')?.textContent === 'Fin du replay');
  return page.evaluate(() => window.Encore.snapshot);
}

try {
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(version => window.Encore?.version === version, GAME_VERSION);
  await page.locator('[data-nav="codex"]').click();
  for (const fighter of FIGHTERS) {
    await page.locator(`[data-codex="${fighter.id}"]`).click();
    assert.equal(await page.locator('.fighter-fidelity').count(), 1);
    assert.equal(await page.locator('.move-fidelity').count(), 10);
    await page.locator('.fighter-fidelity summary').click();
    assert.ok(await page.locator('.fighter-fidelity[open] .fidelity-copy').isVisible());
    assert.match(await page.locator('.fighter-fidelity').textContent(), /Dans Encore/);
    const links = await page.locator('.fidelity-sources a').evaluateAll(nodes => nodes.map(node => ({ href: node.href, rel: node.rel, target: node.target })));
    assert.ok(links.length > 0, fighter.id);
    for (const link of links) {
      assert.ok(registeredURLs.has(link.href), `unregistered source ${link.href}`);
      assert.equal(link.target, '_blank');
      assert.match(link.rel, /noopener/);
    }
  }
  checked('All 14 fighters and 140 techniques expose their shared source notes', 'Every displayed reference resolves to the central register; adaptation text remains separate from the observed traits.');

  await page.locator('[data-codex="pomni"]').click();
  const disclosure = page.locator('.fighter-fidelity summary');
  await disclosure.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.fighter-fidelity').getAttribute('open'), '');
  await page.locator('.move-fidelity').first().locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.ok(await page.locator('.move-fidelity').first().locator('.fidelity-copy').isVisible());
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(output, 'fidelity-desktop-codex.png'), fullPage: true });
  checked('Fighter and technique references are keyboard accessible', 'Native disclosure controls open with Enter and expose readable links without leaving the game.');

  await page.locator('[data-nav="home"]').first().click();
  await page.locator('.mode-card[data-mode="versus"]').click();
  for (const stage of STAGES) {
    await page.locator(`[data-stage="${stage.id}"]`).click();
    assert.equal(await page.locator('#stage-preview').getAttribute('data-stage-preview'), stage.id);
    assert.equal(await page.locator('#stage-preview-title').textContent(), stage.name);
    assert.equal(await page.locator(`[data-stage="${stage.id}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.stage-fidelity').count(), 1);
    const drawing = await page.locator('#stage-preview').evaluate(canvas => {
      const bytes = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      return { width: canvas.width, height: canvas.height, opaque: bytes.filter((value, i) => i % 4 === 3 && value > 0).length, data: canvas.toDataURL() };
    });
    assert.equal(drawing.width, 1280); assert.equal(drawing.height, 720);
    assert.equal(drawing.opaque, 1280 * 720);
    stagePreviews.push({ id: stage.id, sha256: createHash('sha256').update(drawing.data).digest('hex') });
  }
  assert.equal(new Set(stagePreviews.map(stage => stage.sha256)).size, STAGES.length);
  await page.locator('[data-stage="bigtop"]').click();
  await page.locator('.stage-preview').screenshot({ path: path.join(output, 'fidelity-stage-preview.png') });
  checked('All 12 arena choices preview their actual distinct render', 'The selected label, pressed state, source disclosure and 1280 × 720 scene change together.');

  await page.locator('[data-nav="home"]').first().click();
  await page.locator('.mode-card[data-mode="story"]').click();
  for (const fighter of FIGHTERS) {
    await page.locator(`[data-fighter="${fighter.id}"]`).click();
    const expected = getStoryRoute(fighter.id).chapters[0].stageId;
    assert.equal(await page.locator('#stage-preview').getAttribute('data-stage-preview'), expected);
    assert.equal(await page.locator(`[data-stage="${expected}"]`).getAttribute('aria-pressed'), 'true');
  }
  assert.equal(await page.locator('.stage-card:disabled').count(), 12);
  checked('Story selection previews the first chapter of all 14 routes', 'The preview follows the chosen artist and chapter rather than a previously chosen free-duel arena.');

  await page.locator('[data-nav="home"]').first().click();
  const originalProfile = await page.evaluate(() => window.Encore.profile);
  for (const fighter of ['pomni', 'abstractedkaufmo']) {
    for (const version of REPLAY_VERSIONS) {
      const raw = replayFixture(fighter, version);
      const actual = await importReplay(raw);
      assert.deepEqual(actual, expectedReplaySnapshot(raw));
      assert.equal(actual.fighters[0].attack.slot, 'specialBack');
      assert.ok(actual.fighters[0].x < 390, 'the fixture must actually execute the retreat');
      assert.deepEqual(await page.evaluate(() => window.Encore.profile), originalProfile);
      replayResults.push({ fighter, version, frames: actual.frame, x: actual.fighters[0].x, snapshotSHA256: createHash('sha256').update(JSON.stringify(actual)).digest('hex') });
      if (fighter === 'pomni' && version === '0.2.0') {
        await page.locator('[data-action="repeat-replay"]').click();
        await page.waitForFunction(() => document.querySelector('#modal[open] #modal-title')?.textContent === 'Fin du replay');
        assert.deepEqual(await page.evaluate(() => window.Encore.snapshot), actual);
      }
      await page.locator('#modal [data-action="home"]').click();
    }
    const rows = replayResults.filter(row => row.fighter === fighter);
    assert.equal(rows[0].snapshotSHA256, rows[1].snapshotSHA256, '0.1 and 0.2 retain identical old rules');
    assert.notEqual(rows[1].x, rows[2].x, '0.3 must actually use the continuous retreat at the same input frame');
    assert.equal(rows[2].snapshotSHA256, rows[3].snapshotSHA256, '0.4 presentation changes preserve the complete 0.3 simulation state');
    checked(`Versioned retreat replay: ${fighter}`, `Imports for ${REPLAY_VERSIONS.join(', ')} reproduce the expected complete deterministic frame state; no progression is awarded.`);
  }
  checked('Repeating an imported legacy replay preserves its original kit', 'The Revoir action produces the same full frame snapshot for the 0.2.0 Pomni recording.');

  const trapResults=[];
  for(const version of ['0.4.0','0.5.0']) {
    const raw={format:'circus-encore-replay',version,config:{fighters:['jax','pomni'],variants:['',''],stage:'bigtop',cpu:[false,false],difficulty:'normal',seed:1,roundTime:60,roundsToWin:1,initialHealth:[10000,10000]},runs:[[112,0,0],[70,0,1],[1,768,8],[80,0,8]]};
    const actual=await importReplay(raw);
    assert.deepEqual(actual,expectedReplaySnapshot(raw));
    assert.deepEqual(await page.evaluate(()=>window.Encore.profile),originalProfile);
    trapResults.push({version,health:actual.fighters[1].hp,frames:actual.frame});
    await page.locator('#modal [data-action="home"]').click();
  }
  assert.equal(trapResults[0].health,9932);
  assert.equal(trapResults[1].health,9430);
  replayResults.push(...trapResults);
  checked('Versioned low trap preserves legacy blocking and applies 0.5 rules', 'Identical 263-frame input tape: standing guard leaves 9932 HP under 0.4 and 9430 HP under 0.5; full snapshot equality and no profile awards.');

  const legacy = replayFixture('pomni', '0.2.0');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: REPLAY_KEY, raw: JSON.stringify(legacy) });
  await page.locator('[data-nav="settings"]').click();
  assert.ok((await page.locator('main').textContent()).includes(REPLAY_VERSIONS.join(', ')));
  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-replay"]').click();
  const download = await downloadPromise;
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  assert.equal(exported.version, '0.2.0');
  assert.deepEqual(exported.runs, legacy.runs);
  assert.deepEqual(exported.config, legacy.config);
  checked('Exporting a stored legacy replay keeps version 0.2.0', 'The downloaded JSON preserves its original inputs, costume and rules version instead of silently upgrading it.');

  mobileBrowser = await launch();
  const mobileContext = await mobileBrowser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage(); watch(mobile, 'mobile');
  await mobile.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await mobile.waitForFunction(() => window.Encore?.screen === 'home');
  await mobile.locator('.mode-card[data-mode="versus"]').tap();
  await mobile.locator('[data-stage="cellar"]').tap();
  await mobile.locator('.stage-fidelity summary').tap();
  assert.equal(await mobile.locator('#stage-preview').getAttribute('data-stage-preview'), 'cellar');
  assert.ok(await mobile.locator('.stage-fidelity[open]').isVisible());
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  const previewBox = await mobile.locator('#stage-preview').boundingBox();
  assert.ok(previewBox.width <= 390 && previewBox.width > 280);
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.screenshot({ path: path.join(output, 'fidelity-mobile-select.png'), fullPage: true });
  await mobile.locator('[data-nav="codex"]').click();
  await mobile.locator('[data-codex="abstractedkaufmo"]').click();
  await mobile.locator('.fighter-fidelity summary').click();
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await mobile.screenshot({ path: path.join(output, 'fidelity-mobile-codex.png'), fullPage: true });
  checked('Source notes and arena previews remain usable at 390 px', 'Touch opens the stage notes, the preview fits the viewport and the codex has no document-level horizontal overflow.');

  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, 'fidelity-browser-report.json'), JSON.stringify({ version: GAME_VERSION, base, fixturePolicy: 'Short compatibility fixtures; no earned wins or canonical art certification.', checks, errors, stagePreviews, replayResults }, null, 2));
  console.log(`Fidelity browser QA: ${checks.length} checks passed.`);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'fidelity-browser-failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'fidelity-browser-report.json'), JSON.stringify({ version: GAME_VERSION, base, checks, errors, stagePreviews, replayResults, failure: error.message }, null, 2));
  throw error;
} finally {
  await mobileBrowser?.close();
  await browser.close();
}

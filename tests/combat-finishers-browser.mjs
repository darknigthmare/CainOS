/**
 * Real UI gallery QA. Uses a validated idle replay fixture, not an earned duel.
 * No engine, actor, profile or presentation field is mutated by page evaluation.
 * Replay storage is seeded once before boot because the replay import UI plays
 * an imported file without storing it as the last earned replay.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES, VARIANTS } from '../combat/data.mjs';
import { FINISHER_CATALOG, FINISHER_VARIANTS } from '../combat/finisher-catalog.mjs';
import { REPLAY_KEY, SAVE_KEY, validateReplay } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178').replace(/\/$/, '');
const output = path.resolve('audit-combat/finishers-0.7.0');
await fs.mkdir(output, { recursive: true });
const fixture = validateReplay({
  format: 'circus-encore-replay', version: '0.6.0',
  config: { fighters: ['pomni', 'jax'], variants: ['', ''], stage: 'bigtop', seed: 7, roundsToWin: 1, roundTime: 90, difficulty: 'normal', cpu: [false, false], initialHealth: [10000, 10000] },
  runs: [[120, 0, 0]],
}, FIGHTERS.map(f => f.id), STAGES.map(s => s.id));
const fixtureJSON = JSON.stringify(fixture);
const fixtureFileJSON = JSON.stringify(fixture, null, 2);
const sha = value => createHash('sha256').update(value).digest('hex');
const fixturePath = path.join(output, 'gallery-replay-fixture.json');
await fs.writeFile(fixturePath, fixtureFileJSON);
const checks = [], errors = [], scenes = [], costumeChecks = [], imageResponses = new Set();
const checked = (label, detail = {}) => { checks.push({ label, pass: true, ...detail }); console.log(`PASS ${label}`); };
const launchOptions = { headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] };
const browser = await playwright.chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
await context.addInitScript(({ key, value }) => { if (localStorage.getItem(key) === null) localStorage.setItem(key, value); }, { key: REPLAY_KEY, value: fixtureJSON });
const page = await context.newPage();
let phoneContext, phoneBrowser;
function watch(p, prefix = '') {
  p.on('pageerror', error => errors.push(`${prefix}${error.message}`));
  p.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${prefix}HTTP ${response.status()} ${response.url()}`);
    if (response.url().includes('/assets/images/') && response.ok()) imageResponses.add(response.url());
  });
}
watch(page);
async function persistent(p = page) {
  return p.evaluate(({ save, replay }) => ({ profile: window.Encore.profile, profileRaw: localStorage.getItem(save), replayRaw: localStorage.getItem(replay) }), { save: SAVE_KEY, replay: REPLAY_KEY });
}
async function gallerySnapshot(p = page) { return p.evaluate(() => window.Encore.finales); }
async function waitReady(id, p = page) {
  await p.waitForFunction(id => window.Encore?.finales?.id === id && window.Encore.finales.ready, id, { timeout: 20000 });
}
async function openArtist(id, p = page) {
  await p.locator(`[data-codex="${id}"]`).click();
  await p.locator(`[data-finale-fighter="${id}"]`).click();
  await waitReady(`${id}.impact`, p);
  assert.equal(await p.locator('.finisher-preview-dialog [data-finale-id]').count(), 3);
}
async function closeGallery(p = page) {
  await p.locator('.finisher-preview-dialog [data-action="close-modal"]').click();
  await p.waitForFunction(() => window.Encore.finales === null);
  assert.equal(await p.locator('.finisher-preview-dialog').count(), 0);
}
async function toggle(p = page) { await p.locator('[data-action="finale-toggle"]').click(); }
async function capture(entry, label, p = page) {
  const rendered = await p.locator('#finale-preview').evaluate(async canvas => {
    const ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0, 84, 1280, 542).data;
    const colors = new Set();
    for (let i = 0; i < pixels.length; i += 148) colors.add(`${pixels[i]},${pixels[i + 1]},${pixels[i + 2]},${pixels[i + 3]}`);
    const digest = await crypto.subtle.digest('SHA-256', pixels);
    return { png: canvas.toDataURL('image/png'), width: canvas.width, height: canvas.height, colors: colors.size, sceneSHA256: [...new Uint8Array(digest)].map(v => v.toString(16).padStart(2, '0')).join('') };
  });
  assert.deepEqual([rendered.width, rendered.height], [1280, 720]);
  assert.ok(rendered.colors > 16, `${entry.id} ${label}: nonblank canvas`);
  const file = `${entry.id}-${label}.png`;
  const bytes = Buffer.from(rendered.png.split(',')[1], 'base64');
  await fs.writeFile(path.join(output, file), bytes);
  return { file, sha256: sha(bytes), sceneSHA256: rendered.sceneSHA256, frame: (await gallerySnapshot(p)).frame, colors: rendered.colors, dataURL: rendered.png };
}
async function assertPersistent(expected, label) {
  assert.deepEqual(await persistent(), expected, label);
  assert.equal(await page.evaluate(() => window.Encore.snapshot), null, `${label}: gallery leaves no active match`);
}
async function setReduced(value) {
  await page.getByRole('button', { name: 'Réglages', exact: true }).click();
  await page.locator('[data-setting="reducedMotion"]').setChecked(value);
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.reducedMotion), value);
  await page.getByRole('button', { name: 'Combattants', exact: true }).click();
}
async function makeContactSheet(index, records) {
  const sheetPage = await context.newPage();
  try {
    await sheetPage.setContent('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Planches de contrôle Encore</title></head><body></body></html>');
    const jpeg = await sheetPage.evaluate(async ({ index, records }) => {
      const width = 384, pictureHeight = 216, rowHeight = 270, gap = 12, margin = 16, heading = 68;
      const canvas = document.createElement('canvas');
      canvas.width = margin * 2 + width * 3 + gap * 2;
      canvas.height = heading + rowHeight * 7 + margin;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#101222'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f0e3cb'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(`Encore 0.7 — finales ${index + 1}/2`, margin, 29);
      ctx.font = '13px sans-serif'; ctx.fillStyle = '#c7bdd2'; ctx.fillText('Captures du Canvas réel à la fin de chaque scène — impact / spécial / super', margin, 51);
      for (let i = 0; i < records.length; i++) {
        const record = records[i], x = margin + (i % 3) * (width + gap), y = heading + Math.floor(i / 3) * rowHeight;
        const img = new Image(); img.src = record.dataURL; await img.decode();
        ctx.drawImage(img, x, y, width, pictureHeight);
        ctx.fillStyle = '#f0e3cb'; ctx.font = 'bold 14px sans-serif'; ctx.fillText(record.fighterName, x + 4, y + pictureHeight + 20, width - 8);
        ctx.fillStyle = '#c7bdd2'; ctx.font = '13px sans-serif'; ctx.fillText(record.title, x + 4, y + pictureHeight + 40, width - 8);
      }
      return canvas.toDataURL('image/jpeg', 0.94);
    }, { index, records });
    const name = `contact-sheet-${index + 1}.jpg`;
    const bytes = Buffer.from(jpeg.split(',')[1], 'base64');
    await fs.writeFile(path.join(output, name), bytes);
    return { file: name, sha256: sha(bytes), panels: records.length, rows: 7, columns: 3 };
  } finally { await sheetPage.close(); await page.bringToFront(); }
}
let sheets = [];
try {
  assert.equal(FIGHTERS.length, 14); assert.equal(FINISHER_CATALOG.length, 42); assert.equal(VARIANTS.length, 51);
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  await page.getByRole('button', { name: 'Réglages', exact: true }).click();
  for (const key of ['sound', 'music', 'ambience', 'reducedMotion']) await page.locator(`[data-setting="${key}"]`).uncheck();
  await page.locator('[data-setting="finishers"]').uncheck();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.finishers), false);
  await page.getByRole('button', { name: 'Réglages', exact: true }).click();
  assert.equal(await page.locator('[data-setting="finishers"]').isChecked(), false);
  await page.locator('[data-setting="finishers"]').check();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  assert.equal(await page.evaluate(() => window.Encore.profile.settings.finishers), true);
  checked('Finales activées et désactivées : réglage conservé après rechargement', { scope: 'Settings only; no disabled-option KO claimed by this check.' });

  // Import the exact non-empty fixture through the supported file input.
  const fixtureBefore = await persistent();
  await page.locator('#import-replay').setInputFiles(fixturePath);
  await page.locator('#modal [data-action="repeat-replay"]').waitFor({ state: 'visible', timeout: 20000 });
  assert.equal(await page.evaluate(() => window.Encore.presentation.finisherId), null);
  await page.locator('#modal [data-action="home"]').click();
  await page.waitForFunction(() => window.Encore.screen === 'home');
  assert.deepEqual(await persistent(), fixtureBefore);
  assert.equal(JSON.parse((await persistent()).replayRaw).frames, 120);
  checked('Fixture de replay non vide importée par l’interface, sans finale ni récompense', { fixture: true, earnedMatch: false, seededBeforeBoot: true, frames: 120, sha256: sha(fixtureJSON), fileSHA256: sha(fixtureFileJSON) });

  await page.getByRole('button', { name: 'Combattants', exact: true }).click();
  const animatedBaseline = await persistent();
  const contacts = [];
  for (const fighter of FIGHTERS) {
    await openArtist(fighter.id);
    const entries = FINISHER_VARIANTS.map(variant => FINISHER_CATALOG.find(item => item.id === `${fighter.id}.${variant}`));
    const finalHashes = [];
    for (const entry of entries) {
      await page.locator(`[data-finale-id="${entry.id}"]`).click();
      await waitReady(entry.id);
      await toggle();
      await page.waitForFunction(() => !window.Encore.finales.playing);
      const startState = await gallerySnapshot();
      assert.ok(startState.frame < entry.beats[1].frame, `${entry.id}: first tableau remains observable`);
      assert.equal((await page.locator('#finale-beat-title').textContent()).trim(), entry.beats[0].title);
      assert.equal((await page.locator('#finale-beat-copy').textContent()).trim(), entry.beats[0].description);
      const start = await capture(entry, 'start');
      await page.waitForTimeout(160);
      assert.equal((await gallerySnapshot()).frame, startState.frame, `${entry.id}: pause is exact`);
      await toggle();
      await page.waitForFunction(frame => window.Encore.finales.frame >= frame, entry.beats[1].frame + 4, { polling: 'raf', timeout: 10000 });
      await toggle();
      await page.waitForFunction(() => !window.Encore.finales.playing);
      assert.ok((await gallerySnapshot()).frame < entry.beats[2].frame, `${entry.id}: middle tableau remains observable`);
      assert.equal((await page.locator('#finale-beat-title').textContent()).trim(), entry.beats[1].title);
      const middle = await capture(entry, 'middle');
      await toggle();
      await page.waitForFunction(() => window.Encore.finales.done, null, { timeout: 10000 });
      const endState = await gallerySnapshot();
      assert.equal(endState.frame, entry.durationFrames);
      assert.equal(endState.playing, false);
      assert.equal((await page.locator('#finale-beat-title').textContent()).trim(), entry.beats[2].title);
      const end = await capture(entry, 'end');
      await page.waitForTimeout(120);
      assert.deepEqual(await gallerySnapshot(), endState, `${entry.id}: finite settled state`);
      assert.notEqual(start.sha256, middle.sha256); assert.notEqual(middle.sha256, end.sha256);
      finalHashes.push(end.sceneSHA256);
      contacts.push({ dataURL: end.dataURL, title: entry.title, fighterName: fighter.name });
      const clean = ({ dataURL, ...rest }) => rest;
      scenes.push({ id: entry.id, fighterId: fighter.id, variant: entry.variant, durationFrames: entry.durationFrames, captures: [clean(start), clean(middle), clean(end)] });
      checked(`Galerie ${entry.id} : trois tableaux, pause et arrêt final`, { id: entry.id, frames: [start.frame, middle.frame, end.frame] });
    }
    assert.equal(new Set(finalHashes).size, 3, `${fighter.id}: distinct graphic compositions excluding title bars`);
    await closeGallery();
  }
  await assertPersistent(animatedBaseline, 'Full animated gallery');
  checked('42 finales animées : profil, sauvegarde brute et replay non vide inchangés');

  await openArtist('pomni');
  await page.waitForFunction(() => window.Encore.finales.frame >= 25);
  await page.locator('[data-action="finale-replay"]').click();
  await page.waitForFunction(() => window.Encore.finales.frame < 20 && window.Encore.finales.playing);
  await toggle();
  const paused = await gallerySnapshot();
  await page.waitForTimeout(200); assert.deepEqual(await gallerySnapshot(), paused);
  await toggle();
  await page.waitForFunction(frame => window.Encore.finales.frame > frame, paused.frame);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.Encore.finales === null);
  assert.equal(await page.locator('#modal').isVisible(), false);
  await assertPersistent(animatedBaseline, 'Replay, pause, resume and Escape');
  checked('Rejouer, pause, reprise et Échap ferment la galerie sans modifier le profil');

  await setReduced(true);
  const costumeBaseline = await persistent();
  for (const fighter of FIGHTERS) {
    const variants = VARIANTS.filter(item => item.fighterId === fighter.id);
    await openArtist(fighter.id);
    const offered = await page.locator('#finale-costume option').evaluateAll(options => options.map(option => option.value).filter(Boolean));
    assert.deepEqual(offered.sort(), variants.map(item => item.id).sort());
    for (const variant of variants) {
      await page.locator('#finale-costume').selectOption(variant.id);
      await waitReady(`${fighter.id}.impact`);
      await page.waitForFunction(() => window.Encore.finales.done);
      const state = await gallerySnapshot();
      assert.equal(await page.locator('#finale-costume').inputValue(), variant.id);
      assert.equal(state.frame, state.durationFrames); assert.equal(state.playing, false);
      assert.ok((await page.locator('#finale-preview').getAttribute('aria-label')).includes('aperçu sans combat ni récompense'));
      const proof = await capture({ id: `costume-${variant.id}` }, 'reduced');
      costumeChecks.push({ id: variant.id, fighterId: fighter.id, file: proof.file, sha256: proof.sha256, sceneSHA256: proof.sceneSHA256 });
      checked(`Costume ${variant.id} : finale chargée en mouvement réduit`, { fighterId: fighter.id, frame: state.frame });
    }
    await closeGallery();
  }
  assert.equal(costumeChecks.length, 51);
  await assertPersistent(costumeBaseline, 'All fifty-one costumes');
  checked('51 costumes : profil, sauvegarde brute et replay non vide inchangés');
  assert.ok(!/indisponible/i.test(await page.locator('#toast').textContent()), 'No missing-art toast');
  sheets = [await makeContactSheet(0, contacts.slice(0, 21)), await makeContactSheet(1, contacts.slice(21, 42))];
  checked('Deux planches de contact issues du Canvas réel, chacune en 7 × 3', { files: sheets.map(s => s.file) });

  // Match the baseline runner: a separate Chromium process for mobile when
  // --single-process is used, instead of simultaneous browser contexts.
  await context.close();
  await browser.close();
  phoneBrowser = await playwright.chromium.launch(launchOptions);
  phoneContext = await phoneBrowser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const phone = await phoneContext.newPage(); watch(phone, 'mobile: ');
  await phone.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await phone.waitForFunction(() => window.Encore?.screen === 'home');
  assert.equal(await phone.evaluate(() => window.Encore.profile.settings.reducedMotion), false);
  const phoneBaseline = await persistent(phone);
  await phone.getByRole('button', { name: 'Combattants', exact: true }).tap();
  await openArtist('bubble', phone);
  await phone.locator('[data-finale-id="bubble.super"]').tap(); await waitReady('bubble.super', phone);
  await phone.waitForFunction(() => window.Encore.finales.done);
  const phoneState = await gallerySnapshot(phone);
  assert.equal(phoneState.frame, phoneState.durationFrames); assert.equal(phoneState.playing, false);
  const phoneFrame = phoneState.frame;
  await phone.waitForTimeout(250); assert.equal((await gallerySnapshot(phone)).frame, phoneFrame);
  await phone.locator('[data-action="finale-replay"]').tap();
  await phone.waitForFunction(() => window.Encore.finales.done);
  assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  assert.ok(await phone.locator('.finisher-preview-dialog').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth + 2));
  assert.ok(await phone.locator('#finale-preview').evaluate(canvas => canvas.getBoundingClientRect().width <= innerWidth));
  assert.deepEqual(await persistent(phone), phoneBaseline);
  await phone.screenshot({ path: path.join(output, 'mobile-reduced-390.png'), fullPage: true });
  await phone.keyboard.press('Escape');
  await phone.waitForFunction(() => window.Encore.finales === null);
  checked('390 px : galerie utilisable et préférence système de mouvement réduit respectée', { physicalDevice: false, systemPreference: true, profileSetting: false });
  assert.deepEqual(errors, []);
  const report = {
    schemaVersion: 1, version: '0.7.0', base, checks, errors, scenes, costumes: costumeChecks,
    contactSheets: sheets, imageResponses: [...imageResponses].sort(),
    fixture: { file: 'gallery-replay-fixture.json', earnedMatch: false, importedThroughUI: true, storageSeededBeforeBoot: true, frames: 120, version: '0.6.0', sha256: sha(fixtureJSON), fileSHA256: sha(fixtureFileJSON) },
    scope: { galleryFinales: 42, snapshotsPerFinale: 3, costumePreviews: 51, costumeVariant: 'impact', allCostumeFinaleCombinations: false, actualKOJourney: false, disabledSettingKO: false, physicalPhone: false, canonicalOneToOne: false },
  };
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(`Finale gallery QA: ${checks.length} checks passed; 42 animated scenes and 51 costume previews.`);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify({ schemaVersion: 1, version: '0.7.0', base, checks, errors, scenes, costumes: costumeChecks, contactSheets: sheets, failure: error.message, stack: error.stack }, null, 2));
  throw error;
} finally {
  await phoneContext?.close();
  await phoneBrowser?.close();
  await context.close();
  await browser.close();
}

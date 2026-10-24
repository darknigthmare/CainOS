/**
 * Real Web Audio checks: public settings/training UI and native browser PCM.
 * Offline sampling uses CombatAudio with real AudioNodes, one authored cycle.
 * It does not validate a physical sound device or canonical sound fidelity.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { GAME_VERSION } from '../combat/session.mjs';
import { AMBIENCE_STAGE_IDS } from '../combat/audio-ambiences.mjs';
import { AUDIO_IMPACT_CUES } from '../combat/audio.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat/audio-ambiences-0.7.0');
await fs.mkdir(output, { recursive: true });
const report = {
  suite: 'audio-ambiences-0.7.0', version: GAME_VERSION, generatedAt: new Date().toISOString(),
  scope: 'Public UI settings and real AudioContext lifecycle; single-cycle native OfflineAudioContext PCM through CombatAudio.',
  limits: ['No physical speaker or headphone listening session.', 'Original game atmospheres, not canonical episode recordings.', 'Offline PCM covers one cycle; long scheduler lifetime is covered separately by deterministic Node tests.'],
  checks: [], pcm: [], errors: [], runtimeSourceHashes: {}, pass: false,
};
for (const file of ['combat/audio.mjs', 'combat/audio-ambiences.mjs', 'combat/app.mjs', 'combat/session.mjs']) {
  report.runtimeSourceHashes[file] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
}
const checked = (name, detail = null) => { report.checks.push({ name, detail, pass: true }); console.log('PASS ' + name); };
let browser;
try {
  browser = await playwright.chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) report.errors.push('HTTP ' + response.status() + ' ' + response.url()); });
  await page.goto(base + '/combat/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  assert.equal(await page.evaluate(() => window.Encore.version), GAME_VERSION);
  const initial = await page.evaluate(() => window.Encore.audio);
  assert.equal(initial.unlocked, false); assert.equal(initial.ambiencePlaying, false);
  assert.equal(initial.schedulerRunning, false); assert.equal(initial.activeVoices, 0);
  const progressBefore = await page.evaluate(() => { const { settings, ...progress } = window.Encore.profile; return progress; });
  checked('menu stays silent before a trusted interaction');

  await page.locator('[data-nav="settings"]').click();
  await page.waitForFunction(() => window.Encore.screen === 'settings');
  const ambience = page.locator('[data-setting="ambience"]');
  const volume = page.locator('[data-setting="ambienceVolume"]');
  assert.equal(await ambience.isChecked(), true); assert.equal(await volume.inputValue(), '0.35');
  await ambience.uncheck();
  await volume.focus(); await volume.press('Home');
  for (let i = 0; i < 11; i++) await volume.press('ArrowRight');
  assert.equal(await volume.inputValue(), '0.55');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.Encore?.screen === 'home');
  await page.locator('[data-nav="settings"]').click();
  assert.equal(await page.locator('[data-setting="ambience"]').isChecked(), false);
  assert.equal(await page.locator('[data-setting="ambienceVolume"]').inputValue(), '0.55');
  const persisted = await page.evaluate(() => window.Encore.profile.settings);
  assert.equal(persisted.ambience, false); assert.equal(persisted.ambienceVolume, .55);
  assert.equal(persisted.music, false); assert.equal(persisted.musicVolume, .2);
  await page.screenshot({ path: path.join(output, 'audio-settings-0.7.0.png'), fullPage: true });
  checked('ambience toggle and keyboard volume persist independently of music');

  await page.locator('[data-setting="ambience"]').check();
  await page.locator('[data-setting="sound"]').uncheck();
  await page.locator('[data-setting="music"]').uncheck();
  await page.getByRole('button', { name: 'Jouer', exact: true }).click();
  await page.waitForFunction(() => window.Encore.screen === 'home');
  await page.locator('[data-mode="training"]').click();
  await page.waitForFunction(() => window.Encore.screen === 'select');
  await page.locator('[data-stage="bigtop"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore?.screen === 'fight' && window.Encore.ready);
  await page.waitForFunction(() => window.Encore.audio.unlocked && window.Encore.audio.ambiencePlaying);
  const running = await page.evaluate(() => window.Encore.audio);
  assert.equal(running.theme, 'bigtop'); assert.equal(running.contextState, 'running');
  assert.equal(running.playing, false); assert.equal(running.error, null);
  assert.ok(running.scheduledAmbiences >= 1); assert.equal(running.noiseBuffers, 1);
  checked('actual training UI starts a native atmosphere while effects and music are muted', running);

  await page.locator('[data-action="pause"]').click();
  await page.waitForFunction(() => window.Encore.paused && !window.Encore.audio.schedulerRunning);
  const paused = await page.evaluate(() => window.Encore.audio);
  assert.equal(paused.activeVoices, 0); assert.equal(paused.ambiencePlaying, false);
  checked('pause clears scheduled ambient nodes in the real browser', paused);

  await page.locator('[data-action="resume"]').click();
  await page.waitForFunction(() => !window.Encore.paused && window.Encore.audio.ambiencePlaying);
  const resumed = await page.evaluate(() => window.Encore.audio);
  assert.ok(resumed.activeVoices <= 24); assert.ok(resumed.ambienceVoices <= 6);
  assert.equal(resumed.noiseBuffers, 1); assert.equal(resumed.error, null);
  checked('resume restarts ambience with bounded voices and the same noise buffer', resumed);

  await page.locator('[data-action="pause"]').click();
  await page.locator('[data-action="home"]').click();
  await page.waitForFunction(() => window.Encore.screen === 'home');
  const home = await page.evaluate(() => window.Encore.audio);
  assert.equal(home.ambiencePlaying, false); assert.equal(home.ambienceVoices, 0);
  assert.equal(home.schedulerRunning, false);
  const progressAfter = await page.evaluate(() => { const { settings, ...progress } = window.Encore.profile; return progress; });
  assert.deepEqual(progressAfter, progressBefore);
  checked('returning home silences the atmosphere without awarding a training result');

  // Real browser DSP, with an offline clock fixed at zero while scheduling the
  // first cycle. This instantiates the shipped CombatAudio rather than a copy.
  const pcm = await page.evaluate(async ({ ids, impactCues }) => {
    const { CombatAudio } = await import('./audio.mjs');
    const Original = window.AudioContext;
    const results = [];
    async function sample({ stage = 'menu', enabled = true, gain = .35, cue = null, seconds = 12 }) {
      const offline = new OfflineAudioContext(1, 24000 * seconds, 24000);
      let facade;
      class OfflineFacade {
        currentTime = 0; state = 'running'; sampleRate = offline.sampleRate; destination = offline.destination;
        constructor() { facade = this; }
        createGain() { return offline.createGain(); }
        createOscillator() { return offline.createOscillator(); }
        createBuffer(...args) { return offline.createBuffer(...args); }
        createBufferSource() { return offline.createBufferSource(); }
        createBiquadFilter() { return offline.createBiquadFilter(); }
        addEventListener() {}
        removeEventListener() {}
        resume() { return Promise.resolve(); }
        close() { this.state = 'closed'; return Promise.resolve(); }
      }
      let audio;
      try {
        window.AudioContext = OfflineFacade;
        audio = new CombatAudio({ getSettings: () => ({ sound: !!cue, volume: .25, music: false, ambience: enabled, ambienceVolume: gain }) });
        audio.setTheme(stage);
        if (!await audio.unlock()) throw new Error('Offline audio unlock failed');
        const effectAccepted = cue ? audio.play(cue) : null;
        const diagnostic = audio.diagnostics;
        window.AudioContext = Original;
        const rendered = await offline.startRendering();
        const samples = rendered.getChannelData(0);
        let peak = 0, square = 0, nonzero = 0, tailPeak = 0;
        for (let i = 0; i < samples.length; i++) {
          const value = samples[i], absolute = Math.abs(value);
          if (!Number.isFinite(value)) throw new Error('Non-finite PCM');
          peak = Math.max(peak, absolute); square += value * value;
          if (absolute > 1e-7) nonzero++;
          if (i >= samples.length - 24000) tailPeak = Math.max(tailPeak, absolute);
        }
        const digest = await crypto.subtle.digest('SHA-256', samples.buffer);
        const sha256 = Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, '0')).join('');
        return { stage, enabled, gain, cue, seconds, sampleRate: rendered.sampleRate, frames: samples.length, peak, rms: Math.sqrt(square / samples.length), nonzero, tailPeak, sha256, effectAccepted, diagnostic };
      } finally {
        window.AudioContext = Original;
        audio?.destroy();
        if (facade && facade.state !== 'closed') throw new Error('Offline audio facade not destroyed');
      }
    }
    for (const stage of ids) results.push(await sample({ stage }));
    const silent = [];
    for (const options of [{ stage: 'menu' }, { stage: 'lake', enabled: false }, { stage: 'lake', gain: 0 }]) silent.push(await sample(options));
    const effects = [];
    for (const cue of ['trap', 'ko', ...impactCues]) effects.push(await sample({ enabled: false, cue, seconds: 2 }));
    return { results, silent, effects };
  }, { ids: AMBIENCE_STAGE_IDS, impactCues: AUDIO_IMPACT_CUES });
  assert.equal(pcm.results.length, 12);
  assert.equal(new Set(pcm.results.map(item => item.sha256)).size, 12);
  report.pcm = pcm;
  for (const item of pcm.results) {
    assert.equal(item.sampleRate, 24000); assert.equal(item.frames, 288000);
    assert.ok(item.peak > 1e-5 && item.peak < .1, item.stage + ' peak ' + item.peak);
    assert.ok(item.rms > 1e-6, item.stage + ' RMS ' + item.rms);
    assert.ok(item.nonzero > 100, item.stage + ' silent waveform');
    assert.ok(item.tailPeak < 1e-7, item.stage + ' non-finite texture did not end');
    assert.ok(item.diagnostic.activeVoices <= 4); assert.equal(item.diagnostic.scheduledAmbiences, 1);
    checked('native PCM texture: ' + item.stage, item);
  }
  for (const item of pcm.silent) {
    assert.equal(item.peak, 0); assert.equal(item.nonzero, 0);
    assert.equal(item.diagnostic.ambiencePlaying, false);
  }
  checked('menu, disabled ambience and zero volume produce silent PCM');
  assert.notEqual(pcm.effects[0].sha256, pcm.effects[1].sha256);
  for (const item of pcm.effects) {
    assert.equal(item.effectAccepted, true); assert.ok(item.peak > 1e-5 && item.peak < .1);
    assert.ok(item.tailPeak < 1e-7);
  }
  checked('trap and KO synthesize two distinct finite PCM effects');
  const impactPCM = pcm.effects.filter(item => AUDIO_IMPACT_CUES.includes(item.cue));
  assert.equal(impactPCM.length, 6);
  assert.equal(new Set(pcm.effects.map(item => item.sha256)).size, 8);
  checked('light, heavy, low, throw, special and super contacts synthesize six distinct finite PCM effects', { effects: impactPCM.map(({ cue, sha256, peak, rms }) => ({ cue, sha256, peak, rms })) });
  assert.deepEqual(report.errors, []);
  checked('no JavaScript or missing-resource errors');
  report.pass = true;
} catch (error) {
  report.failure = { message: error.message, stack: error.stack };
  report.pass = false; process.exitCode = 1;
  console.error(error);
} finally {
  await browser?.close();
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
}

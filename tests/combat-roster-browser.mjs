/**
 * Fourteen real Versus CPU duels, one for every base fighter.
 * Uses normal menus, settings and physical keyboard events. Encore snapshots and
 * storage are read only. No production hook, state injection or health change.
 * clock.runFor delivers every RAF; it accelerates wall time, not simulation steps.
 * COMBAT_TEST_URL=http://127.0.0.1:4178 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium
 *   node tests/combat-roster-browser.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { GAME_VERSION, SAVE_KEY, REPLAY_KEY, replayRulesVersion, validateReplay } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = (process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178').replace(/\/$/, '');
const output = path.resolve('audit-combat/roster-0.6.0');
const reportPath = path.resolve('audit-combat/roster-browser-report.json');
const sha = value => createHash('sha256').update(value).digest('hex');
const sourceFiles = (await fs.readdir('combat')).filter(file => /\.(mjs|css|html)$/.test(file)).sort().map(file => `combat/${file}`);
sourceFiles.push('tests/combat-roster-browser.mjs');
const hashes = async () => Object.fromEntries(await Promise.all(sourceFiles.map(async file => [file, sha(await fs.readFile(file))])));
const report = {
  schema: 'encore-roster-browser/1', createdAt: new Date().toISOString(), base,
  gameVersion: GAME_VERSION, rulesVersion: replayRulesVersion(GAME_VERSION),
  method: 'Normal Versus CPU menu, base appearances, one round / 60 seconds, easy CPU, real keyboard input. Read-only snapshots and storage. Browser clock delivers every animation frame.',
  expectedFighters: FIGHTERS.map(({ id, name }) => ({ id, name })),
  sourceHashes: await hashes(), servedSources: [], checks: [], playedMatches: [], errors: [],
  limitations: [
    'Fourteen completed base-fighter duels are separate from the aggregate assertion count. This is not an exhaustive test of all moves, matchups, costumes or difficulties.',
    'The profile intentionally keeps the latest twelve history entries. Each of fourteen insertions and total-match increments is checked before and after reload.',
    'Headless Chromium with accelerated browser time; no physical phone, controllers, Windows launcher or performance claim.',
    'Only the last earned replay is exported and imported through the interface. The entire terminal snapshot is compared.',
    'Service workers and the HTTP cache are disabled in this fresh browser context to verify the served source bytes; offline behavior has its own suite.'
  ]
};
await fs.mkdir(output, { recursive: true });
const checked = (name, detail) => { report.checks.push({ name, detail, pass: true }); console.log(`PASS ${name}`); };
const writeProgress = () => fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
let browser, page, currentMatch;
const responseReads = [], servedSources = new Map();
const held = new Set();
const snapshot = () => page.evaluate(() => window.Encore.snapshot);
const profile = () => page.evaluate(() => window.Encore.profile);
const stored = key => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
const homeReady = () => page.waitForFunction(() => window.Encore?.screen === 'home', null, { polling: 50 });
async function hold(keys = []) {
  const next = new Set(keys);
  for (const key of held) if (!next.has(key)) {
    await page.keyboard.up(key); held.delete(key);
    if (currentMatch) currentMatch.keyboard.keyUp++;
  }
  for (const key of next) if (!held.has(key)) {
    await page.keyboard.down(key); held.add(key);
    if (currentMatch) currentMatch.keyboard.keyDown++;
  }
}
async function press(key) {
  await page.keyboard.press(key);
  currentMatch.keyboard.presses[key] = (currentMatch.keyboard.presses[key] || 0) + 1;
}
const advance = ms => page.clock.runFor(ms);

async function selectAndStart(fighter, opponent, stage) {
  await page.locator('.mode-card[data-mode="versus"]').click();
  assert.equal(await page.locator('.roster [data-fighter]').count(), FIGHTERS.length);
  await page.locator('[data-side="0"]').click();
  await page.locator(`[data-fighter="${fighter.id}"]`).click();
  assert.equal(await page.locator(`[data-fighter="${fighter.id}"]`).getAttribute('aria-pressed'), 'true');
  await page.locator('#variant-0').selectOption('');
  assert.equal(await page.locator('[data-selection-artist="0"]').getAttribute('data-appearance-id'), fighter.id);
  assert.equal(await page.locator('[data-selection-artist="0"] h3').textContent(), fighter.name);
  await page.locator('[data-side="1"]').click();
  await page.locator(`[data-fighter="${opponent.id}"]`).click();
  await page.locator('#variant-1').selectOption('');
  assert.equal(await page.locator(`[data-fighter="${opponent.id}"]`).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-selection-artist="1"]').getAttribute('data-appearance-id'), opponent.id);
  await page.locator('#select-difficulty').selectOption('easy');
  await page.locator(`[data-stage="${stage.id}"]`).click();
  assert.equal(await page.locator(`[data-stage="${stage.id}"]`).getAttribute('aria-pressed'), 'true');
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 });
  const initial = await snapshot();
  assert.deepEqual(initial.fighters.map(item => item.id), [fighter.id, opponent.id]);
  assert.deepEqual(initial.fighters.map(item => item.hp), [10000, 10000]);
  currentMatch.initialSnapshot = initial;
  currentMatch.selectionVerified = true;
  await advance(1800);
  assert.equal((await snapshot()).phase, 'fight');
}

async function completeWithKeyboard() {
  // The real-keyboard offensive pilot is shared in approach with the existing
  // Encore/progression browser suites. A loss is a valid completed roster duel.
  for (let decision = 0; decision < 1200; decision++) {
    const state = await snapshot();
    currentMatch.decisions = decision;
    if (state.phase === 'matchOver') { await hold(); return state; }
    if (state.phase !== 'fight') { await hold(); await advance(500); continue; }
    const [playerState, rivalState] = state.fighters;
    const toward = rivalState.x > playerState.x ? 'KeyD' : 'KeyA';
    const distance = Math.abs(playerState.x - rivalState.x);
    const fighter = FIGHTERS.find(item => item.id === playerState.id), rival = FIGHTERS.find(item => item.id === rivalState.id);
    const jabDistance = fighter.moves.light.reach * fighter.reach + rival.combat.simulationBody.width / 2 - 18;
    if (playerState.attack || playerState.hit || playerState.blockstun || playerState.cool) {
      if (playerState.attack?.confirmed && playerState.attack.slot === 'light') await press('KeyK');
      else if (playerState.attack?.confirmed && playerState.attack.slot === 'heavy' && playerState.resource > 25) {
        await hold([toward]); await press('KeyI');
      }
      await advance(100); continue;
    }
    if (distance > jabDistance) { await hold([toward]); await advance(120); continue; }
    await hold();
    if (playerState.meter >= 85 && playerState.resource >= 36) await press('KeyO');
    else if (rivalState.block && !rivalState.throwProtect && !rivalState.hit) await press('KeyU');
    else await press('KeyJ');
    await advance(110);
  }
  throw new Error(`${currentMatch.fighter}: keyboard decision budget exhausted: ${JSON.stringify(await snapshot())}`);
}

try {
  assert.equal(GAME_VERSION, '0.6.0'); assert.equal(FIGHTERS.length, 14);
  browser = await playwright.chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'] });
  report.browserVersion = browser.version();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, serviceWorkers: 'block' });
  page = await context.newPage();
  // Cached reload responses can expose no readable body in lightweight Chromium.
  // Fetch each source normally without cache so every recorded body is verifiable.
  const networkSession = await context.newCDPSession(page);
  await networkSession.send('Network.enable');
  await networkSession.send('Network.setCacheDisabled', { cacheDisabled: true });
  report.networkCacheDisabled = true;
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => {
    if (!response.url().startsWith(`${base}/`)) return;
    if (response.status() >= 400) report.errors.push(`HTTP ${response.status()} ${response.url()}`);
    const pathname = new URL(response.url()).pathname;
    const file = pathname === '/combat/' ? 'combat/index.html' : pathname.slice(1);
    if (!Object.hasOwn(report.sourceHashes, file)) return;
    responseReads.push(response.body().then(body => {
      const digest = sha(body), key = `${file}:${digest}`;
      const entry = servedSources.get(key) || { file, sha256: digest, bytes: body.length, responses: 0 };
      entry.responses++; servedSources.set(key, entry);
    }).catch(error => report.errors.push(`Response body ${file}: ${error.message}`)));
  });
  await page.clock.install({ time: new Date('2026-10-23T12:00:00Z') });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await homeReady();
  await page.clock.pauseAt(new Date('2026-10-23T12:10:00Z'));
  assert.equal(await page.evaluate(() => window.Encore.version), GAME_VERSION);
  assert.equal((await profile()).stats.matches, 0, 'fresh context has no earned matches');
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="rounds"]').selectOption('1');
  await page.locator('[data-setting="seconds"]').selectOption('60');
  await page.locator('[data-setting="sound"]').uncheck();
  await page.locator('[data-setting="reducedMotion"]').check();
  const settings = (await profile()).settings;
  assert.equal(settings.rounds, 1); assert.equal(settings.seconds, 60);
  assert.equal(settings.sound, false); assert.equal(settings.reducedMotion, true);
  await page.locator('[data-nav="home"]').first().click();
  checked('Normal UI settings configure one round and 60 seconds', 'Fresh profile, no imported save or injected match configuration; sound off and reduced motion on through their settings.');

  let lastReplay, lastResult;
  for (const [index, fighter] of FIGHTERS.entries()) {
    const opponent = FIGHTERS[(index + 1) % FIGHTERS.length], stage = STAGES[index % STAGES.length];
    const before = await profile();
    currentMatch = { number: index + 1, fighter: fighter.id, name: fighter.name, opponent: opponent.id, stage: stage.id, mode: 'versus', keyboard: { keyDown: 0, keyUp: 0, presses: {} } };
    console.log(`START duel ${index + 1}/14: ${fighter.id} vs ${opponent.id} (${stage.id})`);
    await selectAndStart(fighter, opponent, stage);
    const terminal = await completeWithKeyboard();
    assert.ok([0, 1].includes(terminal.winner), 'a completed duel has a winning side');
    assert.equal(terminal.wins[terminal.winner], 1, 'one won round ends this match');
    assert.ok(terminal.fighters[0].stats.starts > 0, 'the selected player executed attacks');
    assert.ok(Object.values(currentMatch.keyboard.presses).reduce((a, b) => a + b, 0) > 0);
    const earned = await profile(), won = terminal.winner === 0;
    assert.equal(earned.stats.matches, before.stats.matches + 1);
    assert.equal(earned.stats.wins, before.stats.wins + Number(won));
    assert.equal(earned.stats.losses, before.stats.losses + Number(!won));
    assert.equal(earned.history.length, Math.min(12, before.history.length + 1));
    assert.deepEqual(earned.history.slice(1), before.history.slice(0, 11));
    const latest = earned.history[0];
    assert.equal(latest.fighter, fighter.id); assert.equal(latest.opponent, opponent.id);
    assert.equal(latest.mode, 'versus'); assert.equal(latest.won, won);
    assert.ok(Number.isFinite(Date.parse(latest.at)));
    assert.deepEqual(await stored(SAVE_KEY), earned, 'result is persisted before the modal');
    assert.equal(await page.locator('#modal[open]').count(), 0);
    const replay = await stored(REPLAY_KEY);
    assert.equal(replay.version, GAME_VERSION);
    assert.deepEqual(replay.config.fighters, [fighter.id, opponent.id]);
    assert.deepEqual(replay.config.variants, ['', '']);
    assert.deepEqual(replay.config.cpu, [false, true]);
    assert.deepEqual(replay.config.initialHealth, [10000, 10000]);
    assert.equal(replay.config.stage, stage.id); assert.equal(replay.config.difficulty, 'easy');
    assert.equal(replay.config.roundsToWin, 1); assert.equal(replay.config.roundTime, 60);
    assert.ok(replay.runs.length > 1);
    await advance(2300);
    assert.ok(await page.locator('#modal[open] .result-stats').isVisible());
    assert.deepEqual(await profile(), earned, 'presentation awards no second result');
    assert.deepEqual(await snapshot(), terminal, 'terminal simulation stays frozen');
    const screenshot = `result-${String(index + 1).padStart(2, '0')}-${fighter.id}.png`;
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true });
    Object.assign(currentMatch, {
      resultVerified: true, outcome: won ? 'win' : 'loss', winner: terminal.winner,
      frames: terminal.frame, terminalSnapshot: terminal,
      replay: { version: replay.version, rulesVersion: replayRulesVersion(replay.version), config: replay.config, inputRuns: replay.runs.length, frames: replay.runs.reduce((sum, run) => sum + run[0], 0), sha256: sha(JSON.stringify(replay)) },
      history: { before: before.history.length, after: earned.history.length, newEntry: latest, insertionVerified: true, olderEntriesPreservedWithinLimit: true },
      matchesBefore: before.stats.matches, matchesAfter: earned.stats.matches,
      savedBeforeModal: true, terminalSnapshotStable: true, noDuplicateAward: true,
      screenshot: { file: `audit-combat/roster-0.6.0/${screenshot}`, sha256: sha(await fs.readFile(path.join(output, screenshot))) }
    });
    await page.reload({ waitUntil: 'networkidle' });
    await homeReady();
    assert.equal(await page.evaluate(() => window.Encore.screen), 'home');
    assert.deepEqual(await profile(), earned, 'full earned profile survives reload');
    assert.deepEqual(await stored(REPLAY_KEY), replay, 'earned replay survives reload');
    currentMatch.reloadVerified = true;
    report.playedMatches.push(currentMatch); lastReplay = replay; lastResult = terminal;
    console.log(`DUEL COMPLETE ${index + 1}/14: ${fighter.id}, ${won ? 'win' : 'loss'}, ${terminal.frame} frames, profile ${earned.stats.matches} matches / ${earned.history.length} history entries, reload verified`);
    currentMatch = null;
    await writeProgress();
  }
  const earned = await profile();
  assert.deepEqual(report.playedMatches.map(match => match.fighter), FIGHTERS.map(fighter => fighter.id));
  assert.equal(new Set(report.playedMatches.map(match => match.fighter)).size, 14);
  checked('All fourteen base fighters are selected through the Versus CPU menu', 'J1 appearance, CPU rival, stage, initial health and stored match configuration checked for every duel.');
  assert.equal(earned.stats.matches, 14); assert.equal(earned.stats.wins + earned.stats.losses, 14);
  checked('All fourteen keyboard duels reach a real match result', 'One winning round per duel, commands executed by J1, no abandoned or injected result; wins and losses both accepted.');
  assert.equal(earned.history.length, 12);
  checked('Each result adds exactly one match and the correct newest history entry', 'Fourteen match/win/loss increments and fourteen ordered history insertions; the final twelve-entry cap is respected.');
  checked('Every result persists before its modal and is awarded once', 'Fourteen complete terminal snapshots and profiles remain unchanged during the result presentation.');
  checked('All fourteen full profiles and earned replays survive reload', 'A real page reload after each completed duel, followed by exact profile and local replay comparisons.');
  await fs.writeFile(path.join(output, 'earned-profile-14-duels.json'), JSON.stringify(earned, null, 2) + '\n');

  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-action="export-replay"]').click();
  const download = await downloadEvent;
  const replayFile = path.join(output, 'last-earned-replay-0.6.0.json');
  await download.saveAs(replayFile);
  const replayBytes = await fs.readFile(replayFile), exported = JSON.parse(replayBytes);
  const normalized = validateReplay(lastReplay, FIGHTERS.map(fighter => fighter.id), STAGES.map(stage => stage.id));
  assert.deepEqual(exported, normalized, 'UI export retains the earned recording, including normalized frame count');
  assert.equal(exported.version, '0.6.0'); assert.equal(replayRulesVersion(exported.version), '0.5.0');
  report.replayRoundTrip = { file: 'audit-combat/roster-0.6.0/last-earned-replay-0.6.0.json', bytes: replayBytes.length, sha256: sha(replayBytes), version: exported.version, rulesVersion: replayRulesVersion(exported.version), frames: exported.frames, exportedExactRecording: true };
  checked('The last earned replay exports as version 0.6.0 with original rules 0.5.0', 'The downloaded JSON is compared with the complete validated recording saved by the fourteenth duel.');
  await page.locator('#import-replay').setInputFiles({ name: 'last-earned-replay-0.6.0.json', mimeType: 'application/json', buffer: replayBytes });
  await page.waitForFunction(() => window.Encore.ready && window.Encore.screen === 'fight', null, { polling: 50 });
  for (let step = 0; step < 40 && !(await page.locator('#modal[open]').count()); step++) await advance(5000);
  assert.match(await page.locator('#modal-title').textContent(), /Fin du replay/);
  assert.deepEqual(await snapshot(), lastResult, 'the imported replay exactly reproduces the full terminal snapshot');
  assert.deepEqual(await profile(), earned, 'replay changes no earned profile field');
  assert.deepEqual(await stored(SAVE_KEY), earned);
  assert.deepEqual(await stored(REPLAY_KEY), lastReplay, 'replay playback does not overwrite the earned recording');
  await page.screenshot({ path: path.join(output, 'last-replay-complete.png'), fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  await homeReady();
  assert.deepEqual(await profile(), earned);
  Object.assign(report.replayRoundTrip, { importedViaFileInput: true, exactTerminalSnapshot: true, profileUnchanged: true, profileReloadVerified: true });
  checked('Imported replay reproduces the entire terminal state without adding a result', 'Exact fighters, health, positions, velocities, attacks, cooldowns, projectiles, traps, counters, seed and frame; profile still unchanged after reload.');

  await Promise.all(responseReads);
  report.servedSources = [...servedSources.values()].sort((a, b) => a.file.localeCompare(b.file));
  for (const source of report.servedSources) assert.equal(source.sha256, report.sourceHashes[source.file], `served bytes match source: ${source.file}`);
  assert.ok(report.servedSources.some(source => source.file === 'combat/app.mjs'));
  assert.ok(report.servedSources.some(source => source.file === 'combat/engine.mjs'));
  report.sourceHashesAfter = await hashes();
  assert.deepEqual(report.sourceHashesAfter, report.sourceHashes, 'source files remain unchanged during the run');
  assert.deepEqual(report.errors, []);
  checked('Loaded source bytes match stable files and no browser error occurs', 'Response SHA-256 values recorded across every reload; source digests before/after equal; no local HTTP error or page exception.');
  report.totals = { realDuels: report.playedMatches.length, distinctPlayerFighters: new Set(report.playedMatches.map(match => match.fighter)).size, wins: earned.stats.wins, losses: earned.stats.losses, profileMatches: earned.stats.matches, retainedHistoryEntries: earned.history.length, perDuelReloads: report.playedMatches.filter(match => match.reloadVerified).length, resultCaptures: report.playedMatches.length, exportedImportedReplays: 1, aggregateChecks: report.checks.length, passedChecks: report.checks.filter(check => check.pass).length };
  report.ok = true;
} catch (error) {
  report.ok = false; report.failure = error.stack || String(error);
  if (currentMatch) report.incompleteMatch = currentMatch;
  if (page && !page.isClosed()) await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
  console.error(report.failure); process.exitCode = 1;
} finally {
  await Promise.all(responseReads);
  report.servedSources = [...servedSources.values()].sort((a, b) => a.file.localeCompare(b.file));
  if (browser) await browser.close();
  report.completedAt = new Date().toISOString();
  await writeProgress();
  console.log(`${report.ok ? 'PASS' : 'FAIL'} roster: ${report.playedMatches.length}/14 completed duels, ${report.checks.length} aggregate checks; ${reportPath}`);
}

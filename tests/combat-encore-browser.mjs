/**
 * Earned story/tournament progression through the real browser controls.
 * COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-encore-browser.mjs
 * PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH selects an installed Chromium binary.
 * No engine hooks, localStorage writes, fabricated victories or injected inputs:
 * profile fixtures use the public file-import UI, and every claimed duel is
 * played with keyboard events. Fake time advances every RAF with clock.runFor.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { createProgram, programEncounter } from '../combat/progression.mjs';
import { getStoryRoute, getStoryScene, STORY_NOTICE } from '../combat/stories.mjs';
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
const browser = await playwright.chromium.launch({
  headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const checks = [], errors = [], playedDuels = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`HTTP ${response.status()} ${response.url()}`);
});
const checked = (name, detail = '') => {
  checks.push({ name, detail, pass: true });
  console.log(`PASS ${name}${detail ? ` — ${detail}` : ''}`);
};
const snapshot = () => page.evaluate(() => window.Encore.snapshot);
const profile = () => page.evaluate(() => window.Encore.profile);
const program = () => page.evaluate(() => window.Encore.program);
const advance = ms => page.clock.runFor(ms);
const held = new Set();
async function hold(keys = []) {
  const next = new Set(keys);
  for (const key of held) if (!next.has(key)) { await page.keyboard.up(key); held.delete(key); }
  for (const key of next) if (!held.has(key)) { await page.keyboard.down(key); held.add(key); }
}
async function home() {
  await hold();
  if (await page.locator('#modal[open]').count()) {
    if (await page.locator('#modal .story-page').count()) { await page.locator('[data-action="story-leave"]').click(); return; }
    if (await page.locator('#modal [data-action="result-screen"]').count()) await page.locator('#modal [data-action="result-screen"]').click();
    await page.locator('#modal [data-action="home"]').click();
  } else if (await page.evaluate(() => window.Encore.screen === 'fight')) {
    await page.locator('[data-action="pause"]').click();
    await page.locator('#modal [data-action="home"]').click();
  } else await page.locator('[data-nav="home"]').first().click();
}
async function ready() { await page.waitForFunction(() => window.Encore.ready, null, { polling: 50 }); }
async function enterFight() {
  await ready();
  await advance(1800);
  assert.equal((await snapshot()).phase, 'fight');
}
async function start(mode, fighter = 'jax') {
  await page.locator(`.mode-card[data-mode="${mode}"]`).click();
  await page.locator(`[data-fighter="${fighter}"]`).click();
  await page.locator('#select-difficulty').selectOption('easy');
  await page.locator('[data-action="start"]').click();
  if (await page.locator('#modal [data-action="start-new"]').count()) await page.locator('#modal [data-action="start-new"]').click();
  await ready();
}
async function storyScene(index, fighter = 'jax') {
  const route = getStoryRoute(fighter), scene = getStoryScene(fighter, index);
  if (index === 0) for (const panel of route.prologue) {
    assert.equal(await page.locator('#modal-title').textContent(), panel.title);
    assert.equal(await page.evaluate(() => window.Encore.paused), true);
    await page.locator('[data-action="story-next"]').click();
  }
  assert.equal(await page.locator('#modal-title').textContent(), scene.title);
  assert.equal(await page.locator('.story-dialogue blockquote').count(), 2);
  assert.deepEqual(await page.locator('.story-dialogue blockquote strong').allTextContents(), scene.dialogue.map(line => line.speaker));
  assert.deepEqual(await page.locator('.story-dialogue blockquote p').allTextContents(), scene.dialogue.map(line => line.text));
  assert.ok((await page.locator('#modal').textContent()).includes(STORY_NOTICE));
  assert.equal(await page.locator('.story-intro').count(), index === 0 ? 1 : 0);
  if (index === 0) assert.equal(await page.locator('.story-intro').textContent(), route.intro);
  assert.equal(await page.evaluate(() => window.Encore.paused), true);
  const atScene = await snapshot();
  await advance(300);
  assert.deepEqual(await snapshot(), atScene, 'dialogue pauses the real simulation');
  const run = await program();
  assert.equal(run.index, index);
  assert.equal(run.opponents[index], scene.opponentId);
  assert.equal(run.stages[index], scene.stageId);
  await page.locator('[data-action="story-start"]').click();
  await enterFight();
  assert.equal((await snapshot()).fighters[1].id, scene.opponentId);
}

async function finishWithKeyboard(label) {
  // Same genuine-control bot used by the original progression-browser suite.
  for (let decision = 0; decision < 700; decision++) {
    const state = await snapshot();
    if (state.phase === 'matchOver') {
      await hold(); await advance(2300);
      assert.equal(state.winner, 0, `${label}: keyboard player lost (${state.fighters.map(fighter => fighter.hp)})`);
      if (label === 'story-jax-4') {
        const earned = await profile();
        assert.deepEqual(earned.stories, ['jax']);
        for (const [index, panel] of getStoryRoute('jax').epilogue.entries()) {
          assert.equal(await page.locator('#modal-title').textContent(), panel.title);
          await page.locator(`[data-action="${index === 2 ? 'story-done' : 'story-next'}"]`).click();
        }
        assert.deepEqual(await profile(), earned, 'reading the ending never awards the last victory twice');
      }
      assert.ok(await page.locator('#modal[open] .result-stats').isVisible());
      playedDuels.push({ label, won: true, frames: state.frame, fighters: state.fighters.map(fighter => fighter.id), health: state.fighters[0].hp });
      return state;
    }
    if (state.phase !== 'fight') { await hold(); await advance(500); continue; }
    const [playerState, rivalState] = state.fighters;
    const toward = rivalState.x > playerState.x ? 'KeyD' : 'KeyA';
    const distance = Math.abs(playerState.x - rivalState.x);
    const fighter = FIGHTERS.find(item => item.id === playerState.id), rival = FIGHTERS.find(item => item.id === rivalState.id);
    const jabDistance = fighter.moves.light.reach * fighter.reach + rival.combat.simulationBody.width / 2 - 18;
    if (playerState.attack || playerState.hit || playerState.blockstun || playerState.cool) {
      if (playerState.attack?.confirmed && playerState.attack.slot === 'light') await page.keyboard.press('KeyK');
      else if (playerState.attack?.confirmed && playerState.attack.slot === 'heavy' && playerState.resource > 25) {
        await hold([toward]); await page.keyboard.press('KeyI');
      }
      await advance(100); continue;
    }
    if (distance > jabDistance) { await hold([toward]); await advance(120); continue; }
    await hold();
    if (playerState.meter >= 85 && playerState.resource >= 36) await page.keyboard.press('KeyO');
    else if (rivalState.block && !rivalState.throwProtect && !rivalState.hit) await page.keyboard.press('KeyU');
    else await page.keyboard.press('KeyJ');
    await advance(110);
  }
  throw new Error(`${label}: keyboard decision budget exhausted: ${JSON.stringify(await snapshot())}`);
}

async function loseWithoutAttacking(label) {
  await hold();
  for (let step = 0; step < 30; step++) {
    const state = await snapshot();
    if (state.phase === 'matchOver') {
      await advance(2300);
      assert.equal(state.winner, 1, `${label}: the CPU must win the unattended duel`);
      assert.ok(await page.locator('#modal[open] .result-stats').isVisible());
      playedDuels.push({ label, won: false, frames: state.frame, fighters: state.fighters.map(fighter => fighter.id), health: state.fighters[0].hp });
      return state;
    }
    await advance(5000);
  }
  throw new Error(`${label}: CPU did not finish within the configured 120-second round`);
}

async function importProfile(value, name) {
  await home();
  await page.locator('[data-nav="settings"]').click();
  await page.locator('#import-profile').setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(value)) });
  await page.locator('#confirm-import').waitFor({ state: 'visible' });
  await page.locator('#confirm-import').click();
  await page.waitForFunction(() => !document.querySelector('#modal').open, null, { polling: 50 });
  assert.deepEqual(await profile(), value);
  await home();
}

async function reloadCheckpoint(expected) {
  await hold();
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await profile(), expected, 'reload preserves earned results without counting the last victory again');
  assert.ok(await page.locator('[data-action="resume-program"]').isVisible());
  await page.locator('[data-action="resume-program"]').click();
  await ready();
  assert.deepEqual(await program(), expected.program);
  const encounter = programEncounter(expected.program), state = await snapshot();
  assert.equal(state.fighters[0].id, expected.program.playerId);
  assert.equal(state.fighters[1].id, encounter.opponentId);
  assert.deepEqual(state.fighters.map(fighter => fighter.hp), encounter.initialHealth);
  assert.deepEqual((await profile()).stats, expected.stats);
}

async function showBracket() {
  const resultButton = page.locator('#modal[open] [data-action="bracket"]');
  if (await resultButton.count()) await resultButton.click();
  else await page.locator('.fight-toolbar [data-action="bracket"]').click();
  assert.equal(await page.locator('.tournament-bracket > section').count(), 3);
  assert.equal(await page.locator('.bracket-match').count(), 7);
  assert.ok((await page.locator('#modal').textContent()).includes('simulés'));
}

try {
  await page.clock.install({ time: new Date('2026-10-22T12:00:00Z') });
  await page.goto(`${base}/combat/`, { waitUntil: 'networkidle' });
  await page.clock.pauseAt(new Date('2026-10-22T12:10:00Z'));
  assert.equal(await page.locator('.mode-card[data-mode]').count(), 9);
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="rounds"]').selectOption('1');
  await page.locator('[data-setting="seconds"]').selectOption('120');
  await page.locator('[data-setting="sound"]').uncheck();
  await page.locator('[data-setting="reducedMotion"]').check();
  await home();

  await start('story');
  let savedStorySecond;
  for (let chapter = 0; chapter < 4; chapter++) {
    await storyScene(chapter);
    await finishWithKeyboard(`story-jax-${chapter + 1}`);
    const earned = await profile();
    assert.equal(earned.stats.matches, chapter + 1);
    assert.equal(earned.stats.wins, chapter + 1);
    assert.equal(earned.stats.losses, 0);
    if (chapter === 0) {
      savedStorySecond = earned;
      assert.equal(earned.program.index, 1);
      await reloadCheckpoint(earned);
      checked('Story victory checkpoint reloads into chapter 2 without a duplicate reward', 'Jax’s first duel is genuinely won; the second scene and its original starting health survive reload');
    } else if (chapter < 3) {
      assert.equal(earned.program.index, chapter + 1);
      await page.locator('#modal [data-action="next-fight"]').click();
      await ready();
    }
  }
  const storyFinished = await profile();
  assert.equal(storyFinished.program, null);
  assert.deepEqual(storyFinished.stories, ['jax']);
  assert.ok(storyFinished.medals.includes('story'));
  assert.equal(await page.locator('.story-ending p').textContent(), getStoryRoute('jax').ending);
  assert.equal((await program()).status, 'complete');
  assert.equal(await page.locator('#modal [data-action="next-fight"]').count(), 0);
  await page.screenshot({ path: path.join(output, 'encore-story-ending.png'), fullPage: true });
  await advance(1500);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await profile(), storyFinished);
  assert.equal(await page.locator('[data-action="resume-program"]').count(), 0);
  checked('Four genuine Jax story wins show all authored scenes, unique ending and earned story medal', 'Gangle → Zooble → Ragatha → Caine; profile records four wins, one completed route and no remaining checkpoint');

  const tournamentFixture = structuredClone(storyFinished);
  tournamentFixture.program = createProgram('tournament', 'jax', FIGHTERS, STAGES, { seed: 2718, difficulty: 'easy', roundTime: 120, stage: 'bigtop' });
  await importProfile(tournamentFixture, 'tournoi-vierge-2718.json');
  await page.locator('[data-action="resume-program"]').click();
  await enterFight();
  await showBracket();
  assert.equal((await page.locator('.bracket-match small').allTextContents()).filter(text => text === 'Résultat CPU simulé').length, 3);
  assert.equal((await program()).tournament.participants.length, 8);
  await page.locator('#modal [data-action="resume"]').click();
  checked('Seeded tournament import displays eight artists and seven real bracket slots', 'Fixture has zero player results; three quarter-finals are explicitly identified as CPU simulations');
  for (let round = 0; round < 3; round++) {
    await finishWithKeyboard(`tournament-round-${round + 1}`);
    const earned = await profile(), current = await program();
    assert.equal(earned.stats.matches, storyFinished.stats.matches + round + 1);
    assert.equal(earned.stats.wins, storyFinished.stats.wins + round + 1);
    assert.equal(current.results.length, round + 1);
    assert.equal(current.tournament.rounds.flatMap(item => item.matches).filter(match => match.method === 'played').length, round + 1);
    if (round === 0) {
      await reloadCheckpoint(earned);
      await enterFight();
      checked('Tournament bracket and semifinal resume after a real quarter-final win', 'Same participants, CPU outcomes, next rival and rules; profile match count remains unchanged by reload');
    } else if (round === 1) {
      await page.locator('#modal [data-action="next-fight"]').click();
      await enterFight();
    }
  }
  const tournamentFinished = await profile(), wonBracket = await program();
  assert.equal(tournamentFinished.program, null);
  assert.ok(tournamentFinished.medals.includes('tournament'));
  assert.equal(wonBracket.status, 'complete');
  assert.equal(wonBracket.tournament.champion, 'jax');
  assert.equal(wonBracket.tournament.rounds.flatMap(round => round.matches).filter(match => match.method === 'simulated').length, 4);
  await showBracket();
  assert.match(await page.locator('.bracket-champion').textContent(), /Jax.*remporte la coupe/);
  await page.screenshot({ path: path.join(output, 'encore-tournament-champion.png'), fullPage: true });
  await page.locator('#modal [data-action="result-screen"]').click();
  checked('Three genuine tournament wins earn the cup and the tournament medal', 'Seven resolved matches: three played by the keyboard user and four explicitly simulated CPU matches');

  const lossFixture = emptyProfile();
  lossFixture.settings = structuredClone(tournamentFinished.settings);
  lossFixture.program = createProgram('tournament', 'jax', FIGHTERS, STAGES, { seed: 123, difficulty: 'hard', roundTime: 60 });
  await importProfile(lossFixture, 'tournoi-defaite-123.json');
  await page.locator('[data-action="resume-program"]').click();
  await enterFight();
  await loseWithoutAttacking('tournament-elimination');
  const lostProfile = await profile(), lostBracket = await program();
  assert.equal(lostProfile.stats.matches, 1);
  assert.equal(lostProfile.stats.losses, 1);
  assert.equal(lostProfile.stats.wins, 0);
  assert.equal(lostProfile.program, null);
  assert.deepEqual(lostProfile.medals, []);
  assert.equal(lostBracket.status, 'eliminated');
  assert.notEqual(lostBracket.tournament.champion, 'jax');
  assert.equal(await page.locator('#modal [data-action="next-fight"]').count(), 0);
  await showBracket();
  assert.equal((await page.locator('.bracket-match small').allTextContents()).filter(text => text === 'Résultat CPU simulé').length, 6);
  await page.screenshot({ path: path.join(output, 'encore-tournament-eliminated.png'), fullPage: true });
  await page.locator('#modal [data-action="result-screen"]').click();
  await page.locator('#modal [data-action="rematch"]').click();
  await ready();
  assert.deepEqual(await program(), lossFixture.program);
  assert.deepEqual((await profile()).stats, lostProfile.stats);
  assert.deepEqual((await snapshot()).fighters.map(fighter => fighter.hp), [10000, 10000]);
  checked('Tournament loss eliminates without a medal; replay starts a fresh bracket attempt', 'The real CPU wins; remaining results are simulated and retry resets index/results while preserving the recorded loss');

  // Reuse an actually earned checkpoint from the first story duel, not a
  // synthetic win. Losing the next chapter must preserve that previous victory.
  await importProfile(savedStorySecond, 'histoire-victoire-reelle-chapitre-1.json');
  await page.locator('[data-action="resume-program"]').click();
  await ready();
  await storyScene(1);
  await loseWithoutAttacking('story-chapter-2-loss');
  const storyLost = await profile();
  assert.equal(storyLost.stats.matches, 2);
  assert.equal(storyLost.stats.wins, 1);
  assert.equal(storyLost.stats.losses, 1);
  assert.equal((await program()).status, 'eliminated');
  assert.deepEqual(storyLost.program, savedStorySecond.program);
  assert.deepEqual(storyLost.stories, []);
  await page.locator('#modal [data-action="rematch"]').click();
  await ready();
  assert.equal(await page.locator('#modal-title').textContent(), getStoryScene('jax', 1).title);
  assert.deepEqual(await program(), savedStorySecond.program);
  assert.deepEqual((await profile()).stats, storyLost.stats);
  await reloadCheckpoint(storyLost);
  assert.equal(await page.locator('#modal-title').textContent(), getStoryScene('jax', 1).title);
  checked('Story defeat and retry retain the genuinely earned previous chapter, including after reload', 'The second chapter restarts with unchanged seed/rival/full health; the first victory and the later loss are each counted once');

  // The existing checkpoint must not disappear merely by choosing another mode.
  await home();
  const preserved = await profile();
  await page.locator('.mode-card[data-mode="tournament"]').click();
  await page.locator('[data-action="start"]').click();
  assert.ok(await page.locator('#modal [data-action="start-new"]').isVisible());
  assert.deepEqual(await profile(), preserved);
  await page.locator('#modal [data-action="close-modal"]').click();
  assert.deepEqual(await profile(), preserved);
  await page.locator('[data-action="start"]').click();
  await page.locator('#modal [data-action="start-new"]').click();
  await ready();
  assert.equal((await profile()).program.mode, 'tournament');
  assert.equal((await profile()).program.index, 0);
  assert.deepEqual((await profile()).stats, preserved.stats);
  checked('Replacing a saved programme requires the visible UI choice and preserves the existing record', 'Cancel leaves the story checkpoint intact; start-new replaces only the active route');

  assert.equal(playedDuels.filter(duel => duel.won).length, 7);
  assert.equal(playedDuels.filter(duel => !duel.won).length, 2);
  assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY), await profile());
  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(output, 'encore-browser-report.json'), JSON.stringify({ base, checks, playedDuels, errors }, null, 2));
  console.log(`Encore browser QA: ${checks.length} checks, ${playedDuels.length} real duels passed.`);
} catch (error) {
  await page.screenshot({ path: path.join(output, 'encore-browser-failure.png'), fullPage: true }).catch(() => {});
  await fs.writeFile(path.join(output, 'encore-browser-report.json'), JSON.stringify({ base, checks, playedDuels, errors, failure: error.message }, null, 2));
  throw error;
} finally {
  await browser.close();
}

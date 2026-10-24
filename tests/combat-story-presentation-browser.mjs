/**
 * Public UI story reader: 84 real rendered tableaux, keyboard/mobile controls,
 * four genuinely played story wins and checkpoint/award persistence.
 * The gallery's completed-route fixture is explicitly imported through the UI;
 * it is never counted as an earned victory. No production hooks or state writes.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { STORY_NOTICE, getStoryRoute } from '../combat/stories.mjs';
import { createProgram, programEncounter } from '../combat/progression.mjs';
import { GAME_VERSION, SAVE_KEY, emptyProfile } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/index.mjs')).href);
}
const base = process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output = path.resolve('audit-combat/story-presentation');
await fs.mkdir(output, { recursive:true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sources = [...new Set(['combat/app.mjs','combat/style.css','combat/stories.mjs','combat/story-presentation.mjs','combat/data.mjs','combat/sprite-catalog.mjs','combat/render.mjs','combat/render-poses.mjs','combat/render-presentation.mjs','combat/render-sequences.mjs','combat/render-stage-motion.mjs','combat/render-stage-scenery.mjs','combat/session.mjs','combat/engine.mjs','combat/input.mjs','combat/bindings.mjs','combat/progression.mjs','tests/combat-story-presentation-browser.mjs',...FIGHTERS.flatMap(fighter=>[fighter.sprite?.src,fighter.animation?.src]).filter(Boolean).map(source=>source.replace(/^\.\.\//,''))])];
const sourceHashes = async () => Object.fromEntries(await Promise.all(sources.map(async file => [file, hash(await fs.readFile(file))])));
const report = {
  version:GAME_VERSION, startedAt:new Date().toISOString(), testUrl:`${base}/combat/`,
  command:'PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-story-presentation-browser.mjs',
  checks:[], errors:[], tableaux:[], playedDuels:[], measurements:{}, sourceHashesBefore:await sourceHashes(),
  limitations:[
    'The 14 ending galleries use a clearly identified completed-route fixture imported through the public profile UI; only the four separately played Jax wins count as earned results.',
    'Chromium desktop/mobile viewports and media preferences are emulated; no physical phone, screen reader or hardware controller is exercised.',
    'All dialogue is original fan-game writing. These checks verify presentation and progression, not full canonical fidelity or episode transcription.'
  ]
};
const checked = (name, detail) => { report.checks.push({name,detail,pass:true}); console.log(`PASS ${name}`); };
let browser;
try {
  browser = await playwright.chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote']});
  const context = await browser.newContext({viewport:{width:1440,height:1100},serviceWorkers:'block',reducedMotion:'reduce'});
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if(response.status()>=400&&response.url().startsWith(base))report.errors.push(`HTTP ${response.status()} ${response.url()}`); });
  await page.clock.install({time:new Date('2026-10-23T12:00:00Z')});
  await page.goto(`${base}/combat/`,{waitUntil:'networkidle'});
  await page.clock.pauseAt(new Date('2026-10-23T12:01:00Z'));
  await page.waitForFunction(version=>window.Encore?.version===version,GAME_VERSION,{polling:50});
  const profile = () => page.evaluate(()=>window.Encore.profile);
  const snapshot = () => page.evaluate(()=>window.Encore.snapshot);
  const program = () => page.evaluate(()=>window.Encore.program);
  const advance = ms => page.clock.runFor(ms);
  const ready = () => page.waitForFunction(()=>window.Encore.ready,null,{polling:50});
  const artReady = () => page.waitForFunction(()=>document.querySelector('.story-visual')?.getAttribute('aria-busy')==='false',null,{polling:50});
  const held = new Set();
  async function hold(keys=[]) {
    const next = new Set(keys);
    for(const key of held)if(!next.has(key)){await page.keyboard.up(key);held.delete(key);}
    for(const key of next)if(!held.has(key)){await page.keyboard.down(key);held.add(key);}
  }
  async function home() {
    await hold();
    if(await page.locator('#modal[open] .story-page').count())await page.locator('[data-action="story-leave"]').click();
    if(await page.locator('#modal[open]').count())await page.locator('#modal [data-action="home"]').click();
    else if(await page.evaluate(()=>window.Encore.screen==='fight')){
      await page.locator('[data-action="pause"]').click();await page.locator('#modal [data-action="home"]').click();
    } else await page.locator('[data-nav="home"]').first().click();
  }
  async function importProfile(value,name) {
    await home();await page.locator('[data-nav="settings"]').click();
    await page.locator('#import-profile').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(value))});
    await page.locator('#confirm-import').click();
    assert.deepEqual(await profile(),value);await home();
  }
  async function observePanel(fighterId,kind,index) {
    const expected = getStoryRoute(fighterId)[kind][index];
    assert.equal(await page.locator('#modal-title').textContent(),expected.title);
    assert.equal(await page.locator('.story-page').getAttribute('data-story-kind'),kind);
    assert.ok((await page.locator('.story-notice').textContent()).includes(STORY_NOTICE));
    assert.deepEqual(await page.locator('.story-dialogue strong').allTextContents(),expected.dialogue.map(line=>line.speaker));
    assert.deepEqual(await page.locator('.story-dialogue p').allTextContents(),expected.dialogue.map(line=>line.text));
    await artReady();
    assert.equal(await page.locator('.story-art-status').count(),0,'all original illustrations load');
    const pixels = await page.locator('.story-visual canvas').evaluateAll(canvases=>canvases.map(canvas=>{
      const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      let visible=0;for(let i=3;i<data.length;i+=4)if(data[i]>20)visible++;
      return {width:canvas.width,height:canvas.height,visible};
    }));
    assert.ok(pixels.every(item=>item.visible>500),'actual nonempty scenery and portraits');
    const filename=`${fighterId}-${kind}-${index+1}.png`;
    const image=await page.locator('.story-visual').screenshot({path:path.join(output,filename)});
    report.tableaux.push({fighterId,kind,index:index+1,title:expected.title,stage:expected.stageId,cast:expected.cast,composition:expected.composition,screenshot:`story-presentation/${filename}`,sha256:hash(image),pixels});
  }

  await page.locator('.mode-card[data-mode="story"]').click();
  assert.ok(await page.locator('[data-action="story-ending-library"]').isDisabled());
  const newProfile=await profile();
  for(const fighter of FIGHTERS){
    await page.locator(`[data-fighter="${fighter.id}"]`).click();
    await page.locator('[data-action="story-preview"]').click();
    for(let index=0;index<3;index++){
      await observePanel(fighter.id,'prologue',index);
      if(fighter.id==='pomni'&&index===0)await page.screenshot({path:path.join(output,'story-desktop.png')});
      await page.locator(`[data-action="${index===2?'story-done':'story-next'}"]`).click();
    }
    assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'story-preview');
  }
  assert.deepEqual(await profile(),newProfile);
  checked('Fourteen prologues expose 42 authored tableaux with loaded scenery and portraits','The public selection reader traverses every scene and returns focus to its launch button without changing the profile.');
  checked('Unfinished routes keep their ending reader locked','A fresh profile cannot open the ending gallery; reading a prologue does not unlock it.');

  const galleryFixture=emptyProfile();galleryFixture.stories=FIGHTERS.map(fighter=>fighter.id);galleryFixture.settings.sound=false;
  await importProfile(galleryFixture,'story-gallery-completed-routes-fixture.json');
  report.galleryFixture={purpose:'ending presentation only',completedRoutes:14,earnedMatches:0,importMethod:'public file input and confirmation'};
  await page.locator('.mode-card[data-mode="story"]').click();
  for(const fighter of FIGHTERS){
    await page.locator(`[data-fighter="${fighter.id}"]`).click();
    await page.locator('[data-action="story-ending-library"]').click();
    for(let index=0;index<3;index++){
      await observePanel(fighter.id,'epilogue',index);
      await page.locator(`[data-action="${index===2?'story-done':'story-next'}"]`).click();
    }
    assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'story-ending-library');
  }
  assert.deepEqual(await profile(),galleryFixture);
  checked('Fourteen epilogues expose 42 authored tableaux without new rewards','An explicit gallery fixture is imported through the profile UI; its zero match count stays unchanged throughout all 14 ending readings.');
  const openings=report.tableaux.filter(panel=>panel.kind==='prologue'&&panel.index===1),closings=report.tableaux.filter(panel=>panel.kind==='epilogue'&&panel.index===1);
  assert.equal(new Set(openings.map(panel=>panel.sha256)).size,14);assert.equal(new Set(closings.map(panel=>panel.sha256)).size,14);
  for(const fighter of FIGHTERS){
    assert.notEqual(openings.find(panel=>panel.fighterId===fighter.id).sha256,closings.find(panel=>panel.fighterId===fighter.id).sha256);
    assert.equal(new Set(report.tableaux.filter(panel=>panel.fighterId===fighter.id).map(panel=>panel.sha256)).size,6);
  }
  checked('Actual scene pixels distinguish every route and each route’s six tableaux','84 saved viewport captures; 14 unique openings, 14 unique ending openings, six visually different compositions within every route.');

  await page.locator('[data-fighter="baronmildenhall"]').click();await page.locator('[data-action="story-preview"]').click();await artReady();
  const firstTitle=await page.locator('#modal-title').textContent();
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'story-next');
  await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('baronmildenhall').prologue[1].title);
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#modal-title').textContent(),firstTitle);
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#modal-title').textContent(),firstTitle);
  await page.keyboard.press('Enter');assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('baronmildenhall').prologue[1].title);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#modal[open]').count(),0);
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.action),'story-preview');
  checked('Keyboard navigation, bounded back, Enter and Escape preserve focus','A silent Baron tableau advances and reverses with the arrows; Escape returns to the exact selection reader button.');

  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-fighter="pomni"]').click();await page.locator('[data-action="story-preview"]').click();await artReady();
  const mobileLayout=await page.locator('#modal').evaluate(dialog=>({width:dialog.getBoundingClientRect().width,scroll:dialog.scrollWidth,client:dialog.clientWidth,actions:[...dialog.querySelectorAll('.story-actions button')].map(button=>({action:button.dataset.action,height:button.getBoundingClientRect().height,width:button.getBoundingClientRect().width}))}));
  assert.ok(mobileLayout.width<=390);assert.ok(mobileLayout.scroll<=mobileLayout.client+1);assert.ok(mobileLayout.actions.every(button=>button.height>=44&&button.width>=44));
  assert.equal((await profile()).settings.reducedMotion,false,'system reduced-motion is exercised separately from app setting');
  const stillBefore=await page.locator('.story-visual').screenshot();await advance(1700);const stillAfter=await page.locator('.story-visual').screenshot();
  assert.equal(hash(stillBefore),hash(stillAfter));
  await page.screenshot({path:path.join(output,'story-mobile.png')});
  await page.locator('.story-references').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(output,'story-mobile-controls.png')});
  await page.locator('[data-action="story-skip"]').click();assert.equal(await page.locator('#modal[open]').count(),0);
  report.measurements.mobile=mobileLayout;
  checked('Mobile controls remain reachable without horizontal overflow or automatic motion','390×844 viewport, all reader buttons at least 44×44 CSS pixels; identical real scene pixels across 1.7 s with OS reduce and app setting off.');
  await page.setViewportSize({width:1440,height:1100});

  const earnedFixture=emptyProfile();earnedFixture.settings.sound=false;earnedFixture.settings.reducedMotion=true;earnedFixture.settings.difficulty='easy';earnedFixture.settings.seconds=120;earnedFixture.settings.rounds=1;
  earnedFixture.program=createProgram('story','jax',FIGHTERS,STAGES,{seed:20261023,difficulty:'easy',roundTime:120});
  await importProfile(earnedFixture,'story-unplayed-checkpoint-fixture.json');
  report.earnedFixture={purpose:'deterministic unplayed start',seed:20261023,results:0,importMethod:'public file input and confirmation'};
  await page.locator('[data-action="resume-program"]').click();await ready();
  assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('jax').prologue[0].title);
  const pausedSnapshot=await snapshot();await advance(2200);assert.deepEqual(await snapshot(),pausedSnapshot);assert.equal(await page.evaluate(()=>window.Encore.paused),true);
  await page.locator('[data-action="story-next"]').click();await page.locator('[data-action="story-leave"]').click();
  assert.deepEqual(await profile(),earnedFixture);assert.equal(await page.evaluate(()=>window.Encore.screen),'home');
  await page.reload({waitUntil:'networkidle'});assert.deepEqual(await profile(),earnedFixture);
  await page.locator('[data-action="resume-program"]').click();await ready();await page.locator('[data-action="story-skip"]').click();
  assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('jax').chapters[0].title);
  assert.equal(await page.evaluate(()=>window.Encore.paused),true);assert.deepEqual(await profile(),earnedFixture);
  checked('Initial prologue stays paused and can be left, reloaded and skipped without losing the checkpoint','An explicitly unplayed seed fixture has zero results before and after; Skip opens the chapter briefing and never starts combat by itself.');

  async function playWin(chapter) {
    for(let decision=0;decision<850;decision++){
      const state=await snapshot();
      if(state.phase==='matchOver'){
        await hold();assert.equal(state.winner,0,`Jax chapter ${chapter+1} lost: ${state.fighters.map(f=>f.hp)}`);
        const earned=await profile();assert.equal(earned.stats.matches,chapter+1);assert.equal(earned.stats.wins,chapter+1);
        report.playedDuels.push({chapter:chapter+1,opponent:state.fighters[1].id,stage:getStoryRoute('jax').chapters[chapter].stageId,won:true,frames:state.frame,health:state.fighters[0].hp});
        if(chapter===3){
          assert.deepEqual(earned.stories,['jax']);assert.deepEqual(earned.medals,['story']);assert.equal(earned.program,null);
          assert.equal(await page.locator('.story-page[data-story-kind="epilogue"]').count(),0,'award is saved before the ending reader opens');
          report.measurements.earnedBeforeEnding=earned;
        }
        await advance(2300);return earned;
      }
      if(state.phase!=='fight'){await hold();await advance(500);continue;}
      const [player,rival]=state.fighters,toward=rival.x>player.x?'KeyD':'KeyA';
      const kit=FIGHTERS.find(f=>f.id===player.id),opponent=FIGHTERS.find(f=>f.id===rival.id);
      const jabDistance=kit.moves.light.reach*kit.reach+opponent.combat.simulationBody.width/2-18;
      if(player.attack||player.hit||player.blockstun||player.cool){
        if(player.attack?.confirmed&&player.attack.slot==='light')await page.keyboard.press('KeyK');
        else if(player.attack?.confirmed&&player.attack.slot==='heavy'&&player.resource>25){await hold([toward]);await page.keyboard.press('KeyI');}
        await advance(100);continue;
      }
      if(Math.abs(player.x-rival.x)>jabDistance){await hold([toward]);await advance(120);continue;}
      await hold();
      if(player.meter>=85&&player.resource>=36)await page.keyboard.press('KeyO');
      else if(rival.block&&!rival.throwProtect&&!rival.hit)await page.keyboard.press('KeyU');
      else await page.keyboard.press('KeyJ');
      await advance(110);
    }
    throw new Error(`Chapter ${chapter+1} exceeded the genuine-input decision budget`);
  }
  let finalEarned;
  for(let chapter=0;chapter<4;chapter++){
    assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('jax').chapters[chapter].title);
    assert.equal(await page.locator('.story-dialogue blockquote').count(),2);
    const checkpoint=(await profile()).program;
    const encounter=programEncounter(checkpoint);assert.equal((await snapshot()).fighters[1].id,encounter.opponentId);
    await page.locator('[data-action="story-start"]').click();await advance(1800);assert.equal((await snapshot()).phase,'fight');
    finalEarned=await playWin(chapter);
    if(chapter===0){
      assert.equal(finalEarned.program.index,1);await page.reload({waitUntil:'networkidle'});assert.deepEqual(await profile(),finalEarned);
      await page.locator('[data-action="resume-program"]').click();await ready();
      assert.equal(await page.locator('.story-page').getAttribute('data-story-kind'),'chapter');
      assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('jax').chapters[1].title);
      assert.deepEqual(await profile(),finalEarned);
      checked('A genuinely earned first victory resumes directly at chapter 2','Jax beats Gangle through keyboard input; reload preserves one match, one win, the authored second encounter and no repeated prologue.');
    } else if(chapter<3){await page.locator('[data-action="next-fight"]').click();await ready();}
  }
  assert.equal(report.playedDuels.length,4);
  assert.equal(await page.locator('#modal-title').textContent(),getStoryRoute('jax').epilogue[0].title);
  assert.deepEqual(await profile(),finalEarned);
  checked('Four real wins unlock the ending only after one persisted route reward','Gangle → Zooble → Ragatha → Caine; four matches and wins, one story medal, one unlocked Jax ending, no remaining checkpoint.');
  await page.locator('[data-action="story-next"]').click();await page.locator('[data-action="story-prev"]').click();await page.keyboard.press('Escape');
  assert.equal(await page.locator('.story-ending p').textContent(),getStoryRoute('jax').ending);
  await page.locator('[data-action="story-ending-result"]').click();
  for(let index=0;index<3;index++)await page.locator(`[data-action="${index===2?'story-done':'story-next'}"]`).click();
  assert.deepEqual(await profile(),finalEarned);
  await page.reload({waitUntil:'networkidle'});assert.deepEqual(await profile(),finalEarned);assert.equal(await page.locator('[data-action="resume-program"]').count(),0);
  await page.locator('.mode-card[data-mode="story"]').click();await page.locator('[data-fighter="jax"]').click();await page.locator('[data-action="story-ending-library"]').click();await page.locator('[data-action="story-skip"]').click();
  assert.deepEqual(await profile(),finalEarned);
  report.measurements.finalStoredProfile=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);
  assert.deepEqual(report.measurements.finalStoredProfile,finalEarned);
  checked('Ending back, Escape, full replay, reload and library skip never duplicate an award','The actually earned profile remains byte-for-byte equivalent throughout every ending return path.');
  assert.deepEqual(report.errors,[]);checked('Story presentation completes without JavaScript or missing-asset errors','All 84 gallery panels and the four earned matches use the normal app and original asset pipeline.');
} catch(error) {
  report.error={message:error.message,stack:error.stack};process.exitCode=1;console.error(error);
} finally {
  report.sourceHashesAfter=await sourceHashes();report.changedSources=sources.filter(file=>report.sourceHashesBefore[file]!==report.sourceHashesAfter[file]);
  if(report.changedSources.length){report.error||={message:`Sources changed during verification: ${report.changedSources.join(', ')}`};process.exitCode=1;console.error(report.error.message);}
  report.completedAt=new Date().toISOString();report.pass=!report.error&&report.errors.length===0;
  await fs.writeFile(path.resolve('audit-combat/story-presentation-browser-report.json'),JSON.stringify(report,null,2));
  await browser?.close();
}

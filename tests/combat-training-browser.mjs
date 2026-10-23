/** Public UI training regression. Inputs are real keyboard/pointer events; diagnostics are read-only. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {GAME_VERSION,REPLAY_KEY} from '../combat/session.mjs';
let playwright;
try {playwright=await import('playwright');}catch(error){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw error;playwright=await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright/index.mjs')).href);}
const base=process.env.COMBAT_TEST_URL||'http://127.0.0.1:4178';
const output=path.resolve('audit-combat');await fs.mkdir(output,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote']});
const context=await browser.newContext({viewport:{width:1440,height:1100}}),page=await context.newPage();
const checks=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))errors.push(`HTTP ${response.status()} ${response.url()}`);});
const checked=(name,detail)=>{checks.push({name,detail,pass:true});console.log(`PASS ${name}`);};
const snapshot=()=>page.evaluate(()=>window.Encore.snapshot);
const lab=()=>page.evaluate(()=>window.Encore.training);
const click=action=>page.locator(`[data-action="${action}"]`).click();
const focus=()=>page.locator('#arena').focus();
const advance=ms=>page.clock.runFor(ms);
const step=()=>click('training-step');
async function frozen(value){if((await lab()).frozen!==value)await click('training-freeze');}
try{
  await page.clock.install({time:new Date('2026-10-23T08:00:00Z')});
  await page.goto(`${base}/combat/`,{waitUntil:'networkidle'});
  await page.clock.pauseAt(new Date('2026-10-23T08:10:00Z'));
  await page.waitForFunction(version=>window.Encore?.version===version,GAME_VERSION,{polling:50});
  const baseline=await page.evaluate(key=>({profile:window.Encore.profile,replay:localStorage.getItem(key)}),REPLAY_KEY);
  await page.locator('.mode-card[data-mode="training"]').click();await click('start');
  await page.waitForFunction(()=>window.Encore.ready,null,{polling:50});
  await frozen(true);const before=(await snapshot()).frame;await advance(500);assert.equal((await snapshot()).frame,before);
  await focus();await page.keyboard.press('KeyJ');await step();let state=await snapshot();
  assert.equal(state.frame,before+1);assert.equal(state.fighters[0].attack.slot,'light');
  await step();state=await snapshot();assert.equal(state.frame,before+2);assert.equal(state.fighters[0].stats.starts,1);assert.equal(await page.evaluate(()=>window.Encore.paused),true);
  assert.match(await page.locator('#training-readout-0').innerText(),/Préparation/);
  checked('Figer et avancer une image consomme chaque attaque une seule fois',{before,after:state.frame,starts:state.fighters[0].stats.starts});

  await click('movelist');await page.locator('#modal [data-action="resume"]').click();assert.equal((await lab()).frozen,true);assert.equal(await page.evaluate(()=>window.Encore.paused),true);
  await focus();await page.keyboard.press('KeyK');await click('reset-training');assert.equal((await lab()).history[0].length,0);await step();
  assert.equal((await snapshot()).fighters[0].attack,null);assert.equal((await snapshot()).frame,1);
  checked('Répertoire et remise en place préservent le gel sans conserver une commande en attente','Une frappe forte en attente est abandonnée au reset ; une image reste contrôlée.');

  const speeds=[];
  for(const speed of ['0.25','0.5','1']){await page.locator('#training-speed').selectOption(speed);await click('reset-training');await frozen(false);const first=(await snapshot()).frame;await advance(1000);await frozen(true);const count=(await snapshot()).frame-first;assert.ok(Math.abs(count-60*Number(speed))<=1,`${speed}: ${count}`);speeds.push({speed:Number(speed),frames:count});}
  await page.locator('#training-resource').uncheck();await page.locator('#training-meter').check();await click('reset-training');await focus();await page.keyboard.press('KeyI');await step();
  assert.equal((await snapshot()).fighters[0].meter,100);assert.ok((await snapshot()).fighters[0].resource<100);
  await page.locator('#training-resource').check();await page.locator('#training-meter').uncheck();await click('reset-training');await step();assert.equal((await snapshot()).fighters[0].resource,100);assert.equal((await snapshot()).fighters[0].meter,0);
  await page.locator('#training-meter').check();checked('Vitesses fixes et jauges indépendantes',{speeds});

  await click('training-record');await focus();await page.keyboard.down('KeyA');for(let i=0;i<12;i++)await step();await page.keyboard.up('KeyA');await focus();await page.keyboard.press('KeyJ');await step();await click('training-record');
  const recorded=await snapshot();assert.equal((await lab()).tapeFrames,13);assert.equal(recorded.fighters[0].x,380);assert.ok(recorded.fighters[1].x<900);assert.equal(recorded.fighters[1].attack.slot,'light');
  checked('Enregistrement réel de J2 avec les commandes J1 et J1 neutre',{frames:13,x:recorded.fighters[1].x,slot:recorded.fighters[1].attack.slot});

  await click('training-play');for(let i=0;i<13;i++)await step();assert.equal((await lab()).mode,'idle');assert.deepEqual(await snapshot(),recorded);
  await page.locator('#training-loop').check();await click('training-play');for(let i=0;i<26;i++)await step();assert.equal((await lab()).mode,'playback');assert.equal((await lab()).cursor,0);assert.equal((await lab()).frames,26);
  await click('training-stop');checked('Lecture unique déterministe et deux boucles complètes',{singleFrames:13,loopFrames:26});

  await click('training-record');await frozen(false);await advance(11000);await frozen(true);assert.equal((await lab()).tapeFrames,600);assert.equal((await lab()).mode,'idle');
  await click('reset-training');assert.equal((await lab()).tapeFrames,600);assert.equal((await lab()).frozen,true);assert.equal((await lab()).settings.speed,1);assert.equal((await lab()).history[0].length,0);
  await click('training-clear');assert.equal((await lab()).tapeFrames,0);assert.equal(await page.locator('[data-action="training-play"]').isDisabled(),true);
  checked('Limite de 600 images et reset conservant les réglages et la séquence','11 secondes simulées enregistrent exactement 10 secondes ; effacement explicite.');

  const dummies=[];
  for(const dummy of ['idle','block','crouch','jump','cpu']){
    await page.locator('#training-dummy').selectOption(dummy);await click('reset-training');await frozen(false);await advance(600);await frozen(true);const b=(await snapshot()).fighters[1];
    if(dummy==='idle')assert.equal(b.x,900);
    if(dummy==='block')assert.equal(b.block,true);
    if(dummy==='crouch'){assert.equal(b.block,true);assert.equal(b.crouch,true);}
    if(dummy==='jump')assert.equal(b.onGround,false);
    if(dummy==='cpu')assert.ok(b.x!==900||b.stats.starts>0);
    dummies.push({dummy,x:b.x,block:b.block,crouch:b.crouch,onGround:b.onGround,starts:b.stats.starts});
  }
  await page.locator('#training-dummy').selectOption('after');await click('reset-training');await frozen(false);await focus();await page.keyboard.down('KeyD');
  for(let i=0;i<30;i++){const s=await snapshot();if(s.fighters[1].x-s.fighters[0].x<95)break;await advance(50);}
  await page.keyboard.up('KeyD');await page.keyboard.press('KeyJ');await advance(800);await frozen(true);const after=await snapshot();assert.ok(after.fighters[0].stats.hits>0);assert.equal(after.fighters[1].block,true);
  dummies.push({dummy:'after',hits:after.fighters[0].stats.hits,block:after.fighters[1].block});
  checked('Les six mannequins conservent leurs comportements et la garde réactive suit un vrai impact',dummies);

  await page.locator('.training-lab').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,'training-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'training-mobile.png'),fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth), '390px overflow');
  await click('pause');await page.locator('#modal [data-action="home"]').click();
  assert.deepEqual(await page.evaluate(key=>({profile:window.Encore.profile,replay:localStorage.getItem(key)}),REPLAY_KEY),baseline);
  await page.reload({waitUntil:'networkidle'});assert.deepEqual(await page.evaluate(key=>({profile:window.Encore.profile,replay:localStorage.getItem(key)}),REPLAY_KEY),baseline);
  assert.equal(await page.evaluate(()=>window.Encore.training),null);
  checked('Laboratoire adapté à 390 px et sans effet sur le profil ou les replays',{viewport:390,profileUnchanged:true,replayUnchanged:true});
  assert.deepEqual(errors,[]);
}catch(error){await page.screenshot({path:path.join(output,'training-failure.png'),fullPage:true}).catch(()=>{});errors.push(error.stack||String(error));throw error;}
finally{await fs.writeFile(path.join(output,'training-browser-report.json'),JSON.stringify({version:GAME_VERSION,generatedAt:new Date().toISOString(),checks,errors},null,2));await browser.close();}

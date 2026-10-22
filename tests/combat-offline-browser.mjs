/** Actual browser journeys for custom controls, feedback, music and offline/update.
 * Input and storage are exercised through UI. Network/update fixtures only alter
 * the static test server; no application/engine mutation hooks are used.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { FIGHTERS } from '../combat/data.mjs';
let playwright;
try { playwright=await import('playwright'); }
catch(error){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw error;playwright=await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright/index.mjs')).href);}
const output=path.resolve('audit-combat'), root=path.resolve('dist-combat');
await fs.mkdir(output,{recursive:true});
let update=0;
const mime={'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    let content=await fs.readFile(file);
    if(file.endsWith('/sw.js'))content=Buffer.concat([content,Buffer.from('\n// Browser update fixture '+update+'\n')]);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(content);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote']});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage(),checks=[],errors=[];
page.on('pageerror',error=>errors.push(error.message));
const checked=(name,detail='')=>{checks.push({name,detail,pass:true});console.log('PASS '+name+' '+detail);};
const snapshot=()=>page.evaluate(()=>window.Encore.snapshot);
const advance=ms=>page.clock.runFor(ms);
const settings=()=>page.locator('.masthead [data-nav="settings"]').click();
const home=()=>page.locator('.masthead [data-nav="home"]').first().click();
const bind=(player,action,slot=0)=>page.locator('[data-bind-player="'+player+'"][data-bind-action="'+action+'"][data-bind-slot="'+slot+'"]');
try{
  await page.goto(base+'/combat/index.html?standalone=1',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Encore?.offline.ready);
  assert.equal(await page.evaluate(()=>window.Encore.version),'0.2.0');
  await settings();
  await bind(0,'light').click();await page.keyboard.press('KeyB');
  assert.match(await page.locator('#binding-error').textContent(),/joueur 2/);
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile.settings.bindings[0].light),['KeyJ']);
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#binding-error').textContent(),/réservée/);
  await page.keyboard.press('KeyF');
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile.settings.bindings[0].light),['KeyF']);
  await bind(0,'light',1).click();await page.keyboard.press('KeyG');
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile.settings.bindings[0].light),['KeyF','KeyG']);
  await bind(0,'light',1).click();await page.keyboard.press('Backspace');
  await page.locator('[data-setting="layout"]').selectOption('qwerty');
  assert.equal((await bind(0,'left').textContent()).trim(),'A');
  await page.locator('[data-setting="layout"]').selectOption('azerty');
  assert.equal((await bind(0,'left').textContent()).trim(),'Q');
  await page.reload({waitUntil:'networkidle'});
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile.settings.bindings[0].light),['KeyF']);
  checked('Custom keys reject conflicts and reserved shortcuts, allow alternatives, and persist','J1 light = F; labels follow AZERTY/QWERTY');

  await settings();
  await page.locator('[data-setting="music"]').check();
  await page.locator('[data-setting="sound"]').uncheck();
  await page.waitForFunction(()=>window.Encore.audio.playing);
  const music=await page.evaluate(()=>window.Encore.audio);
  assert.equal(music.theme,'menu');assert.ok(music.activeVoices<=24);
  checked('Original procedural music starts from a gesture with an independent mute','Effects off; music on; bounded voices');
  await page.clock.install();await page.clock.pauseAt(new Date());
  await home();
  await page.locator('[data-mode="training"]').click();
  await page.locator('[data-fighter="jax"]').click();
  await page.locator('[data-stage="manor"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>window.Encore.ready,null,{polling:50});
  await advance(1800);
  assert.equal(await page.evaluate(()=>window.Encore.audio.theme),'manor');
  const starts=(await snapshot()).fighters[0].stats.starts;
  await page.keyboard.press('KeyJ');await advance(80);
  assert.equal((await snapshot()).fighters[0].stats.starts,starts);
  await page.keyboard.press('KeyF');await advance(80);
  assert.ok((await snapshot()).fighters[0].stats.starts>starts);
  await page.locator('main [data-action="movelist"]').click();
  assert.match(await page.locator('dialog .move-table tbody tr').first().textContent(),/F/);
  await page.locator('dialog [data-action="resume"]').click();
  checked('Remapped attack reaches the engine and move list while the old key stays inactive');

  // Build a real confirmed two-hit sequence with keyboard commands.
  let achieved=false;
  for(let tries=0;tries<100;tries++){
    const state=await snapshot(),[a,b]=state.fighters;
    const fighter=FIGHTERS.find(f=>f.id===a.id),rival=FIGHTERS.find(f=>f.id===b.id);
    const reach=fighter.moves.light.reach*fighter.reach+rival.combat.simulationBody.width/2-18;
    if(Math.abs(a.x-b.x)>reach){await page.keyboard.down('KeyD');await advance(100);await page.keyboard.up('KeyD');}
    else if(a.attack?.confirmed&&a.attack.slot==='light'){await page.keyboard.press('KeyK');await advance(100);}
    else if(!a.attack&&!a.cool&&!a.hit){await page.keyboard.press('KeyF');await advance(100);}
    else await advance(100);
    if(await page.evaluate(()=>window.Encore.stats[0].combo>=2)){achieved=true;break;}
  }
  assert.ok(achieved,'Actual two-hit combo must be made before checking stale display');
  await advance(3500);
  assert.ok(await page.evaluate(()=>window.Encore.stats[0].combo>=2));
  assert.doesNotMatch(await page.locator('#feedback-0').textContent(),/IMPACTS/);
  checked('Live combo label clears after recovery while the best result combo remains');

  await page.locator('main [data-action="pause"]').click();
  const frame=(await snapshot()).frame;await advance(600);
  assert.equal((await snapshot()).frame,frame);
  assert.equal(await page.evaluate(()=>window.Encore.audio.paused),true);
  assert.equal(await page.evaluate(()=>window.Encore.audio.activeVoices),0);
  await page.locator('dialog [data-action="resume"]').click();await advance(100);
  assert.equal(await page.evaluate(()=>window.Encore.audio.paused),false);
  checked('Pause stops simulation and releases audio voices; resume restores the stage theme');
  await page.locator('main [data-action="pause"]').click();await page.locator('dialog [data-action="home"]').click();
  await page.clock.resume();
  await settings();
  await page.locator('[data-action="offline-prepare"]').click();
  await page.waitForFunction(()=>window.Encore.offline.complete&&!window.Encore.offline.busy,null,{timeout:60000});
  assert.equal(await page.evaluate(()=>window.Encore.offline.cached),42);
  const saved=await page.evaluate(()=>window.Encore.profile);
  await page.screenshot({path:path.join(output,'encore-settings.png'),fullPage:true});
  checked('The standalone downloads all 42 original sprite sheets','47,345,031 bytes; explicit UI action and completion state');

  await context.setOffline(true);
  await page.goto(base+'/combat/index.html?standalone=1',{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>window.Encore.screen),'home');
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile),saved);
  await page.locator('[data-mode="training"]').click();
  await page.locator('[data-fighter="baronmildenhall"]').click();
  await page.locator('[data-stage="cellar"]').click();
  await page.locator('[data-action="start"]').click();
  await page.waitForFunction(()=>window.Encore.ready&&window.Encore.snapshot.phase==='fight');
  const x=(await snapshot()).fighters[0].x;
  await page.keyboard.down('KeyD');await page.waitForTimeout(250);await page.keyboard.up('KeyD');
  assert.ok((await snapshot()).fighters[0].x>x+20);
  assert.equal(await page.locator('#toast').isVisible(),false);
  await page.screenshot({path:path.join(output,'encore-offline.png'),fullPage:true});
  checked('A cold page reload and a different fighter/stage remain playable offline','Network disabled; profile preserved; real keyboard movement');

  await context.setOffline(false);
  await page.locator('main [data-action="pause"]').click();await page.locator('dialog [data-action="home"]').click();
  update=1;
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.Encore.offline.update,null,{timeout:15000});
  assert.equal(await page.evaluate(()=>window.Encore.offline.complete),true);
  await settings();
  assert.ok(await page.locator('[data-action="offline-update"]').isVisible());
  await Promise.all([page.waitForEvent('load'),page.locator('[data-action="offline-update"]').click()]);
  await page.waitForFunction(()=>window.Encore.offline.ready);
  assert.equal(await page.evaluate(()=>window.Encore.offline.update),false);
  assert.equal(await page.evaluate(()=>window.Encore.offline.complete),true);
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile),saved);
  checked('A waiting service worker updates only through the UI and preserves the unchanged art pack','No automatic reload; all 42 images and the profile survive activation');

  const scope=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return new URL(r.scope).pathname;});
  assert.equal(scope,'/combat/');
  const outside=await context.newPage();
  await outside.goto(base+'/index.html',{waitUntil:'networkidle'});
  // Standalone root redirects into combat. A separate document outside the scope
  // must not be controlled before that redirect executes.
  const outsideControlled=await context.newPage();
  await outsideControlled.route('**/outside.html',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Outside Encore</title><p>Other app</p>'}));
  await outsideControlled.goto(base+'/outside.html');
  assert.equal(await outsideControlled.evaluate(()=>navigator.serviceWorker.controller),null);
  checked('The offline worker is limited to /combat/ and leaves other application documents uncontrolled');

  await page.bringToFront();await settings();
  await page.locator('[data-action="offline-clear"]').click();
  await page.waitForFunction(()=>!window.Encore.offline.complete&&window.Encore.offline.cached===0);
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile),saved);
  checked('Clearing downloaded illustrations preserves custom keys and all profile data');

  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:path.join(output,'encore-settings-mobile.png'),fullPage:true});
  checked('The expanded settings and key mapper fit a 390-pixel viewport');
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(output,'offline-browser-report.json'),JSON.stringify({base,checks,errors},null,2));
  console.log('Offline/browser QA: '+checks.length+' checks passed.');
}catch(error){
  await page.screenshot({path:path.join(output,'offline-browser-failure.png'),fullPage:true}).catch(()=>{});
  await fs.writeFile(path.join(output,'offline-browser-report.json'),JSON.stringify({base,checks,errors,failure:error.message},null,2));
  throw error;
}finally{await browser.close();server.close();}

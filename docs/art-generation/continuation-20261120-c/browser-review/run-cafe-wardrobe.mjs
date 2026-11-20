/** Real UI-only Cafe wardrobe review. Does not change application state through debug hooks. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';

const output=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(output,'../../../..');
const ids=['caferagatha','cafegangle','cafezooble'];
const slots=['selection','stance','intro','attack','heavy','hit','walk','jump','crouch','victory','defeat'];
const sha=data=>createHash('sha256').update(data).digest('hex');
const sourceFiles=['combat/app.mjs','combat/data.mjs','combat/costume-additions.mjs','combat/costume-continuation-20261120-c.mjs','combat/costume-order.mjs','combat/illustrations.mjs','combat/render.mjs','combat/render-poses.mjs','combat/offline-manifest.mjs',...ids.flatMap(id=>slots.map(slot=>['selection','stance'].includes(slot)?`assets/encore/${slot}/${id}.png`:`assets/encore/poses/${id}/${slot}.png`))];
const sourceHashes=async()=>Object.fromEntries(await Promise.all(sourceFiles.map(async file=>[file,sha(await fs.readFile(path.join(root,file)))])));
const report={schema:'encore-cafe-browser-review/v1',startedAt:new Date().toISOString(),expectedAppearances:ids,stage:'preflight',passed:false,navigationPerformed:false,checks:[],matches:[],errors:[],screenshots:[],sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),limitations:['Three desktop Chromium UI flows only; no physical-device testing, canonical fidelity or full animation claim.','Launch preflight is recorded separately and is not evidence that application navigation succeeded.']};
let browser,page,server;
const pass=(name,detail)=>{report.checks.push({name,detail,pass:true});console.log('PASS '+name);};
const save=async()=>fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
try{
  const {COSTUMES}=await import(pathToFileURL(path.join(root,'combat/data.mjs')).href);
  const costumes=ids.map(id=>{const item=COSTUMES.find(c=>c.id===id);assert.ok(item,'Integrated costume missing: '+id);return item;});
  report.sourceHashes=await sourceHashes();
  report.sourceFiles=sourceFiles;
  report.launchOptions={headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']};
  let playwright;
  try{playwright=await import('playwright');}catch(error){if(!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES)throw error;playwright=await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright/index.mjs')).href);}
  report.stage='launching_browser';await save();
  browser=await playwright.chromium.launch({...report.launchOptions,timeout:25000});
  report.browserVersion=browser.version();report.stage='starting_owned_server';
  const serverCode='from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler\ns=ThreadingHTTPServer(("127.0.0.1",0),SimpleHTTPRequestHandler)\nprint("ENCORE_REVIEW_PORT "+str(s.server_address[1]),flush=True)\ns.serve_forever()';
  server=spawn('python3',['-u','-c',serverCode],{cwd:root,stdio:['ignore','pipe','pipe']});
  let stderr='';server.stderr.on('data',chunk=>{stderr=(stderr+chunk).slice(-8000);});
  const base=await new Promise((resolve,reject)=>{
    let stdout='',done=false;const timer=setTimeout(()=>finish(new Error('Owned server startup timeout. '+stderr)),10000);
    const finish=(error,value)=>{if(done)return;done=true;clearTimeout(timer);error?reject(error):resolve(value);};
    server.on('error',error=>finish(error));server.on('exit',(code,signal)=>finish(new Error(`Owned server exited (${code??signal}): ${stderr}`)));
    server.stdout.on('data',chunk=>{stdout+=chunk;const m=stdout.match(/^ENCORE_REVIEW_PORT (\d+)\r?\n/);if(m)finish(null,'http://127.0.0.1:'+m[1]);});
  });
  report.base=base;report.ownedServer=true;
  const served=await fetch(base+'/combat/app.mjs');assert.ok(served.ok);assert.equal(sha(Buffer.from(await served.arrayBuffer())),report.sourceHashes['combat/app.mjs']);
  const context=await browser.newContext({viewport:{width:1440,height:1100},serviceWorkers:'block'});
  await context.addInitScript(()=>{
    const sources=new WeakMap();const original=CanvasRenderingContext2D.prototype.drawImage;
    window.__cafeArenaSources=new Set();
    CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
      const src=image instanceof HTMLImageElement?(image.currentSrc||image.src):sources.get(image);
      if(src){const value=new URL(src,location.href).pathname;sources.set(this.canvas,value);if(this.canvas.id==='arena')window.__cafeArenaSources.add(value);}
      return original.call(this,image,...args);
    };
  });
  page=await context.newPage();page.setDefaultTimeout(30000);
  page.on('pageerror',error=>report.errors.push(error.message));
  page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)report.errors.push(`HTTP ${response.status()} ${response.url()}`);});
  report.stage='navigating';await page.goto(base+'/combat/',{waitUntil:'networkidle'});report.navigationPerformed=true;
  await page.waitForFunction(()=>window.Encore?.version);
  await page.locator('[data-nav="settings"]').click();await page.locator('[data-setting="reducedMotion"]').check();
  const before=await page.evaluate(()=>window.Encore.profile);
  await page.locator('[data-nav="home"]').first().click();
  for(const entry of costumes){
    report.stage='selection:'+entry.id;
    await page.locator('.mode-card[data-mode="versus"]').click();
    await page.locator(`[data-fighter="${entry.fighterId}"]`).click();
    await page.locator('#variant-0').selectOption(entry.id);
    await page.waitForFunction(id=>{const card=document.querySelector('[data-selection-artist="0"]'),canvas=card?.querySelector('canvas');return card?.dataset.appearanceId===id&&canvas&&canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data.some((v,i)=>i%4===3&&v>12);},entry.id);
    assert.equal(await page.locator('[data-selection-artist="0"] .selected-costume').textContent(),entry.name);
    const selectionFile=entry.id+'-selection.png';await page.locator('.selection-summary').screenshot({path:path.join(output,selectionFile)});report.screenshots.push(selectionFile);
    pass(entry.id+': real selection portrait and label',{fighter:entry.fighterId,appearance:entry.id});
    await page.locator(`[data-selection-artist="0"] [data-appearance="${entry.id}"]`).click();
    await page.waitForFunction(id=>document.querySelector('#wardrobe-preview')?.dataset.appearanceId===id&&document.querySelector('#wardrobe-load')?.textContent==='',entry.id);
    assert.equal(await page.locator('#wardrobe-variant').inputValue(),entry.id);
    const wardrobeFile=entry.id+'-wardrobe.png';await page.locator('#modal').screenshot({path:path.join(output,wardrobeFile)});report.screenshots.push(wardrobeFile);
    pass(entry.id+': wardrobe loaded the selected appearance',{appearance:entry.id,loadingError:false});
    report.stage='training:'+entry.id;
    await page.locator(`[data-try-appearance="${entry.id}"]`).click();
    await page.waitForFunction(()=>window.Encore?.ready&&window.Encore.snapshot?.phase==='fight');
    const snapshot=await page.evaluate(()=>window.Encore.snapshot);assert.equal(snapshot.fighters[0].id,entry.fighterId);
    await page.waitForFunction(id=>Array.from(window.__cafeArenaSources).some(src=>src===`/assets/encore/stance/${id}.png`||src.startsWith(`/assets/encore/poses/${id}/`)),entry.id);
    const fightFile=entry.id+'-fight.png';await page.locator('.arena-wrap').screenshot({path:path.join(output,fightFile)});report.screenshots.push(fightFile);
    const starts=snapshot.fighters[0].stats.starts;await page.locator('#arena').focus();await page.keyboard.press('KeyJ');
    await page.waitForFunction(value=>window.Encore.snapshot.fighters[0].stats.starts>value,starts);
    const sources=await page.evaluate(()=>Array.from(window.__cafeArenaSources));
    report.matches.push({id:entry.id,fighterId:entry.fighterId,acceptedKeyboardAttack:true,drawnSources:sources.filter(src=>src.includes(entry.id))});
    pass(entry.id+': wardrobe launched training with actual native costume drawing and keyboard input',{fighter:entry.fighterId});
    await page.locator('[data-nav="home"]').first().click();await page.locator('[data-leave="home"]').click();
  }
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile),before);assert.deepEqual(report.errors,[]);
  pass('Training preserved profile and produced no local asset or browser errors',{appearances:ids.length});
  report.sourceHashesAfter=await sourceHashes();report.runtimeUnchanged=JSON.stringify(report.sourceHashesAfter)===JSON.stringify(report.sourceHashes);assert.ok(report.runtimeUnchanged);
  report.passed=true;report.stage='completed';
}catch(error){report.failureStage=report.stage;report.error=error.stack||String(error);report.passed=false;if(page){await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});}}
finally{
 if(browser)await browser.close().catch(()=>{});if(server)server.kill('SIGTERM');
 report.completedAt=new Date().toISOString();report.browserChecks=report.checks.length;report.browserChecksPassed=report.checks.filter(c=>c.pass).length;
 await save();console.log(JSON.stringify({passed:report.passed,stage:report.stage,failureStage:report.failureStage,checks:report.browserChecks,navigationPerformed:report.navigationPerformed,report:path.relative(root,path.join(output,'report.json'))}));
 if(!report.passed)process.exitCode=1;
}

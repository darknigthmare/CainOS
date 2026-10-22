/**
 * Real wardrobe/selection flows, including all 51 existing costume records.
 * Visual comparisons use the shipped renderer; no game-state mutation hooks.
 * The checks establish UI wiring and source coverage, not canonical art approval.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { FIGHTERS, VARIANTS } from '../combat/data.mjs';
import { getFidelitySources } from '../combat/fidelity.mjs';
import { GAME_VERSION } from '../combat/session.mjs';

let playwright;
try { playwright = await import('playwright'); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  playwright = await import(pathToFileURL(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright/index.mjs')).href);
}
const base=process.env.COMBAT_TEST_URL || 'http://127.0.0.1:4178';
const output=path.resolve('audit-combat');
await fs.mkdir(output,{recursive:true});
const launch=()=>playwright.chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote']});
const browser=await launch();
let mobileBrowser;
const context=await browser.newContext({viewport:{width:1440,height:1050},serviceWorkers:'block'});
const page=await context.newPage();
const checks=[],errors=[],previews=[],wardrobes=[];
const hash=value=>createHash('sha256').update(value).digest('hex');
const checked=(name,detail)=>{checks.push({name,detail,pass:true});console.log(`PASS ${name}`);};
function watch(target,label){
  target.on('pageerror',error=>errors.push(`${label}: ${error.message}`));
  target.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)errors.push(`${label}: HTTP ${response.status()} ${response.url()}`);});
}
watch(page,'desktop');
async function portraitReady(target,side,id){
  await target.waitForFunction(({side,id})=>{
    const card=document.querySelector(`[data-selection-artist="${side}"]`),canvas=card?.querySelector('canvas');
    return card?.dataset.appearanceId===id && canvas && canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data.some((v,i)=>i%4===3&&v>12);
  },{side,id});
}
async function wardrobeReady(target,id){
  await target.waitForFunction(id=>document.querySelector('#wardrobe-preview')?.dataset.appearanceId===id && document.querySelector('#wardrobe-load')?.textContent==='',id);
}
async function sourceNotes(target,variant){
  assert.ok(variant.fidelity,`Missing own costume record: ${variant.id}`);
  const details=target.locator('.costume-fidelity');
  assert.equal(await details.count(),1);
  await details.locator('summary').click();
  assert.ok((await details.textContent()).includes(variant.fidelity.combatAdaptation));
  assert.ok((await details.textContent()).includes(variant.fidelity.reviewScope));
  const urls=await details.locator('a').evaluateAll(nodes=>nodes.map(node=>node.href).sort());
  const expected=getFidelitySources(variant.fidelity.sourceIds).map(source=>new URL(source.url,base).href).sort();
  assert.deepEqual(urls,expected,`Costume must use its own references: ${variant.id}`);
  const review=target.locator('.costume-review');
  await review.locator('summary').click();
  assert.ok(await target.locator('.costume-review[open] .fidelity-copy').isVisible());
  const text=await review.textContent(),record=variant.fidelity.assetReview;
  for(const value of [record.status,record.identityEvidence,record.framing,record.transparency,record.proportions,...record.visibleTraits,...record.issues])assert.ok(text.includes(value),`Missing illustration review: ${variant.id}`);

}

try{
  await page.goto(base+'/combat/',{waitUntil:'networkidle'});
  await page.waitForFunction(version=>window.Encore?.version===version,GAME_VERSION);
  await page.locator('[data-nav="settings"]').click();
  await page.locator('[data-setting="reducedMotion"]').check();
  const initialProfile=await page.evaluate(()=>window.Encore.profile);
  await page.locator('[data-nav="home"]').first().click();
  await page.locator('.mode-card[data-mode="versus"]').click();

  for(const fighter of FIGHTERS){
    const variants=VARIANTS.filter(variant=>variant.fighterId===fighter.id);
    if(!variants.length)continue;
    await page.locator(`[data-fighter="${fighter.id}"]`).click();
    for(const variant of variants){
      await page.locator('#variant-0').selectOption(variant.id);
      await portraitReady(page,0,variant.id);
      assert.equal(await page.locator('[data-selection-artist="0"] .selected-costume').textContent(),variant.name);
      const result=await page.evaluate(async id=>{
        const {ARCHIVE}=await import('/combat/data.mjs');
        const {drawPortrait}=await import('/combat/render.mjs');
        const actual=document.querySelector('[data-selection-artist="0"] canvas');
        const reference=document.createElement('canvas');reference.width=actual.width;reference.height=actual.height;
        await drawPortrait(reference,ARCHIVE.find(item=>item.id===id));
        return {actual:actual.toDataURL(),expected:reference.toDataURL()};
      },variant.id);
      assert.equal(result.actual,result.expected,`Stale or wrong costume portrait: ${variant.id}`);
      previews.push({id:variant.id,fighterId:fighter.id,sha256:hash(result.actual)});
    }
  }
  assert.equal(previews.length,VARIANTS.length);
  checked('All 51 costume choices refresh the actual selected portrait','Each selected name and canvas matches its own archive image; no inherited or stale original portrait.');

  const pomni=VARIANTS.find(v=>v.fighterId==='pomni'),jax=VARIANTS.find(v=>v.fighterId==='jax');
  await page.locator('[data-fighter="pomni"]').click();
  await page.locator('#variant-0').selectOption(pomni.id);await portraitReady(page,0,pomni.id);
  const first=await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas=>canvas.toDataURL());
  await page.locator('[data-side="1"]').click();await page.locator('[data-fighter="jax"]').click();
  await page.locator('#variant-1').selectOption(jax.id);await portraitReady(page,1,jax.id);
  assert.equal(await page.locator('#variant-0').inputValue(),pomni.id);
  await portraitReady(page,0,pomni.id);
  assert.equal(await page.locator('[data-selection-artist="0"] canvas').evaluate(canvas=>canvas.toDataURL()),first);
  await page.locator('[data-fighter="gangle"]').click();await portraitReady(page,1,'gangle');
  assert.equal(await page.locator('#variant-1').inputValue(),'');
  await page.locator('[data-fighter="jax"]').click();
  await page.locator('[data-stage="bigtop"]').click();
  await page.locator('.selection-summary').screenshot({path:path.join(output,'costume-selection.png')});
  checked('Player two changes independently and a new fighter resets only its own costume','Player one retains its image and choice; changing the opponent restores its original appearance.');

  await page.locator('[data-nav="archives"]').click();
  await page.locator('#archive-filter').selectOption('variant');
  const rapid=VARIANTS.filter(v=>v.fighterId==='pomni');
  await page.locator(`[data-appearance="${rapid[0].id}"]`).click();
  for(const choice of rapid.slice(0,3))await page.locator('#wardrobe-variant').selectOption(choice.id);
  const finalChoice=rapid[Math.min(2,rapid.length-1)];
  await wardrobeReady(page,finalChoice.id);
  assert.ok((await page.locator('.wardrobe-labels').textContent()).includes(finalChoice.name));
  await page.locator('#modal [data-action="close-modal"]').click();
  checked('Rapid wardrobe choices display the final selection','A replaced dialog never receives an earlier asynchronous image response.');

  let more=true;
  while(more){
    const ids=await page.locator('.archive-card').evaluateAll(cards=>cards.map(card=>card.dataset.archiveId));
    for(const id of ids){
      const variant=VARIANTS.find(v=>v.id===id);
      await page.locator(`[data-appearance="${id}"]`).click();await wardrobeReady(page,id);
      const options=await page.locator('#wardrobe-variant option').evaluateAll(nodes=>nodes.map(n=>n.value));
      assert.deepEqual(options,[variant.fighterId,...VARIANTS.filter(v=>v.fighterId===variant.fighterId).map(v=>v.id)]);
      if(id==='ganglecomedy')await page.locator('#modal').screenshot({path:path.join(output,'costume-wardrobe.png')});
      await sourceNotes(page,variant);
      const png=await page.locator('#wardrobe-preview').evaluate(canvas=>canvas.toDataURL());
      wardrobes.push({id,sha256:hash(png),sourceIds:variant.fidelity.sourceIds});
      await page.locator('#modal [data-action="close-modal"]').click();
    }
    more=await page.locator('[data-page="1"]').isEnabled();
    if(more)await page.locator('[data-page="1"]').click();
  }
  assert.equal(new Set(wardrobes.map(v=>v.id)).size,VARIANTS.length);
  checked('All 51 wardrobe dialogs show their own references and compatible choices','The comparison uses the combat renderer; each dialog exposes its own references and every recorded framing, transparency, proportion and art issue.');

  const last=wardrobes.at(-1).id,trigger=page.locator(`[data-appearance="${last}"]`);
  await trigger.focus();await page.keyboard.press('Enter');await wardrobeReady(page,last);
  await page.locator('.costume-fidelity summary').focus();await page.keyboard.press('Enter');
  assert.ok(await page.locator('.costume-fidelity[open]').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#modal').evaluate(el=>el.open),false);
  assert.equal(await page.locator('#archive-filter').inputValue(),'variant');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.appearance),last);
  checked('Wardrobe and reference notes support keyboard navigation','Enter opens the dialog and disclosure; Escape returns focus without discarding the archive filter.');

  await page.locator('#archive-search').fill('ganglecomedy');
  await page.waitForFunction(()=>document.querySelectorAll('.archive-card').length===1);
  await page.locator('[data-appearance="ganglecomedy"]').click();await wardrobeReady(page,'ganglecomedy');
  await page.locator('[data-try-appearance="ganglecomedy"]').click();
  await page.waitForFunction(()=>window.Encore?.ready&&window.Encore.snapshot?.phase==='fight');
  assert.equal((await page.evaluate(()=>window.Encore.snapshot)).fighters[0].id,'gangle');
  const training=await page.evaluate(async()=>{
    const {getFighter,getStage,VARIANTS}=await import('/combat/data.mjs');
    const {CombatEngine}=await import('/combat/engine.mjs');
    const {CombatRenderer}=await import('/combat/render.mjs');
    const owner=getFighter('gangle'),variant=VARIANTS.find(v=>v.id==='ganglecomedy');
    const fighters=[{...owner,sprite:variant.sprite,animation:variant.animation||null,visual:{...owner.visual,...variant.visual},costume:variant.id},getFighter('jax')],stage=getStage('bigtop');
    const canvas=document.createElement('canvas'),renderer=new CombatRenderer(canvas);
    await renderer.preload(fighters,[stage]);
    const expected=new CombatEngine({fighters,stage,mode:'training',cpu:[false,false],difficulty:'normal',seed:0,roundTime:90,roundsToWin:1});
    renderer.render(expected.state,{stage,reducedMotion:true});
    return {actual:document.querySelector('#arena').toDataURL(),expected:canvas.toDataURL()};
  });
  assert.equal(training.actual,training.expected,'The selected costume must reach the real fight renderer');
  await page.keyboard.press('KeyJ');
  await page.waitForFunction(()=>window.Encore.snapshot.fighters[0].stats.starts>0);
  await page.locator('.arena-wrap').screenshot({path:path.join(output,'costume-training.png')});
  checked('Trying an appearance launches a playable training match in that costume','The real combat canvas matches the selected costume; a real keyboard attack is accepted.');
  await page.locator('[data-nav="archives"]').click();await page.locator('[data-leave="archives"]').click();
  assert.deepEqual(await page.evaluate(()=>window.Encore.profile),initialProfile);
  checked('Browsing and trying costumes preserves the saved profile','No wardrobe preview or training test awards results or replaces saved progress.');

  mobileBrowser=await launch();
  const phone=await mobileBrowser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1,serviceWorkers:'block'});watch(phone,'mobile');
  await phone.goto(base+'/combat/',{waitUntil:'networkidle'});
  await phone.locator('.mode-card[data-mode="versus"]').tap();
  await phone.locator('#variant-0').selectOption(pomni.id);await portraitReady(phone,0,pomni.id);
  assert.ok(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await phone.evaluate(()=>window.scrollTo(0,0));await phone.screenshot({path:path.join(output,'costume-mobile-selection.png'),fullPage:true});
  await phone.locator(`[data-selection-artist="0"] [data-appearance="${pomni.id}"]`).tap();await wardrobeReady(phone,pomni.id);
  await phone.locator('.costume-fidelity summary').tap();
  assert.ok(await phone.locator('.costume-fidelity[open]').isVisible());
  assert.ok(await phone.locator('#modal').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
  const box=await phone.locator('#wardrobe-preview').boundingBox();assert.ok(box.width>250&&box.width<390);
  await phone.locator('#modal').screenshot({path:path.join(output,'costume-mobile-wardrobe.png')});
  await phone.locator('#modal [data-action="close-modal"]').tap();
  assert.equal(await phone.locator('#variant-0').inputValue(),pomni.id);
  checked('Selection and wardrobe remain usable with touch at 390 px','Portraits fit their cards, comparison and source notes stay within the dialog, and closing retains the selection.');

  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(output,'costume-browser-report.json'),JSON.stringify({version:GAME_VERSION,base,scope:'51 costume UI flows; not canonical art certification.',checks,errors,previews,wardrobes},null,2));
  console.log(`Costume browser QA: ${checks.length} checks passed.`);
}catch(error){
  await page.screenshot({path:path.join(output,'costume-browser-failure.png'),fullPage:true}).catch(()=>{});
  await fs.writeFile(path.join(output,'costume-browser-report.json'),JSON.stringify({version:GAME_VERSION,base,checks,errors,previews,wardrobes,failure:error.message},null,2));
  throw error;
}finally{
  await mobileBrowser?.close();await browser.close();
}

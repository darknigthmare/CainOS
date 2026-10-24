import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, STAGES } from '../combat/data.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FINISHER_CATALOG, FINISHER_VARIANTS } from '../combat/finisher-catalog.mjs';
import { FINISHER_NOTICE, selectMatchFinisher, sampleFinisherPresentation } from '../combat/finishers.mjs';
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
function stateFor(fighterId = 'pomni', winner = 0) {
  const fighters = [{f:{id:'jax'},life:0},{f:{id:'jax'},life:0}];
  fighters[winner] = {f:{id:fighterId},life:7500};
  return {phase:'matchOver',frame:240,winner,round:2,fighters};
}
function damage(slot = 'light', overrides = {}) {
  return {type:'damage',frame:240,actor:0,target:1,amount:300,blocked:false,slot,...overrides};
}
test('the shipped roster has three distinct immutable finisher definitions each', () => {
  assert.equal(FINISHER_CATALOG.length,FIGHTERS.length*3);
  assert.deepEqual([...FINISHER_VARIANTS],['impact','special','super']);
  assert.equal(new Set(FINISHER_CATALOG.map(e=>e.id)).size,FINISHER_CATALOG.length);
  assert.equal(new Set(FINISHER_CATALOG.map(e=>e.fighterId)).size,FIGHTERS.length);
  assert.ok(Object.isFrozen(FINISHER_CATALOG));
  assert.ok(typeof FINISHER_NOTICE==='string' && FINISHER_NOTICE.length>50);
  for(const fighter of FIGHTERS){
    const entries=FINISHER_CATALOG.filter(e=>e.fighterId===fighter.id);
    assert.deepEqual(entries.map(e=>e.variant).sort(),[...FINISHER_VARIANTS].sort());
    assert.equal(new Set(entries.map(e=>e.title)).size,3);
    for(const entry of entries){
      assert.ok(Object.isFrozen(entry) && Object.isFrozen(entry.beats));
      assert.equal(entry.beats.length,3);assert.equal(entry.beats[0].frame,0);
      assert.ok(entry.durationFrames>entry.beats.at(-1).frame);
      assert.ok(entry.sourceIds.length && entry.adaptation.length && entry.remainingArtWork.length);
      for(const beat of entry.beats)assert.ok(Object.isFrozen(beat)&&beat.title&&beat.description);
    }
  }
});
test('each of the forty-two variants is reachable through an actual move family',()=>{
  const slots={impact:'light',special:'special',super:'super'};
  for(const entry of FINISHER_CATALOG){
    const result=selectMatchFinisher(freeze(stateFor(entry.fighterId)),freeze([damage(slots[entry.variant])]));
    assert.equal(result.id,entry.id);assert.equal(result.trigger,entry.variant);
    assert.equal(result.winnerIndex,0);assert.equal(result.loserIndex,1);assert.equal(result.matchFrame,240);
    assert.ok(Object.isFrozen(result));
  }
});
test('impact and directional special slots use explicit families, with unknown slots rejected',()=>{
  const state=stateFor();
  for(const slot of ['light','heavy','low','air','dash','throw'])assert.equal(selectMatchFinisher(state,[damage(slot)]).variant,'impact');
  for(const slot of ['special','specialDown','specialForward','specialBack'])assert.equal(selectMatchFinisher(state,[damage(slot)]).variant,'special');
  assert.equal(selectMatchFinisher(state,[damage('super')]).variant,'super');
  for(const slot of ['utility','specialUnknown','__proto__','constructor','',null,undefined])assert.equal(selectMatchFinisher(state,[damage('light',{slot})]),null);
});
test('only a final match outcome can start a finisher',()=>{
  for(const phase of ['intro','fight','roundEnd','roundOver','paused',undefined])assert.equal(selectMatchFinisher({...stateFor(),phase},[damage()]),null);
  for(const winner of [-1,2,0.5,'0',null,undefined,NaN])assert.equal(selectMatchFinisher({...stateFor(),winner},[damage()]),null);
  for(const frame of [-1,1.5,Infinity,NaN,'240'])assert.equal(selectMatchFinisher({...stateFor(),frame},[damage()]),null);
});
test('timeouts, double knockouts and invalid health never borrow an earlier hit',()=>{
  const timed=stateFor();timed.fighters[1].life=25;assert.equal(selectMatchFinisher(timed,[damage()]),null);
  const double=stateFor();double.fighters[0].life=0;assert.equal(selectMatchFinisher(double,[damage()]),null);
  for(const life of [NaN,undefined,'0',-1]){const state=stateFor();state.fighters[1].life=life;assert.equal(selectMatchFinisher(state,[damage()]),null);}
});
test('the decisive damage must belong to this frame, winner and defeated opponent',()=>{
  for(const event of [
    damage('super',{frame:239}),damage('super',{frame:241}),damage('super',{actor:1}),damage('super',{target:0}),
    damage('super',{type:'activate'}),damage('super',{type:'matchEnd'}),damage('super',{blocked:true}),damage('super',{blocked:undefined}),
    damage('super',{amount:0}),damage('super',{amount:-1}),damage('super',{amount:NaN}),damage('super',{amount:Infinity}),
  ])assert.equal(selectMatchFinisher(stateFor(),[event]),null);
});
test('the last winning damage wins selection and unsupported last hits do not fall back',()=>{
  const state=stateFor();
  assert.equal(selectMatchFinisher(state,[damage('super'),damage('special'),damage('heavy')]).variant,'impact');
  assert.equal(selectMatchFinisher(state,[damage('super'),damage('utility')]),null);
  assert.equal(selectMatchFinisher(state,[damage('super'),damage('heavy',{blocked:true})]).variant,'super');
  assert.equal(selectMatchFinisher(state,[damage('super'),damage('heavy',{frame:239})]).variant,'super');
});
test('both player sides and mirror matches preserve winner and loser indices',()=>{
  for(const winner of [0,1]){const state=stateFor('pomni',winner);state.fighters[1-winner].f.id='pomni';
    const result=selectMatchFinisher(state,[damage('special',{actor:winner,target:1-winner})]);
    assert.equal(result.id,'pomni.special');assert.equal(result.winnerIndex,winner);assert.equal(result.loserIndex,1-winner);
  }
});
test('all scored match modes support finishers but training, challenges and replays do not',()=>{
  for(const mode of ['versus','local','arcade','boss','survival','story','tournament'])assert.equal(selectMatchFinisher(stateFor(),[damage()],{mode}).id,'pomni.impact');
  for(const mode of ['training','challenge','replay','unknown','__proto__'])assert.equal(selectMatchFinisher(stateFor(),[damage()],{mode}),null);
  assert.equal(selectMatchFinisher(stateFor(),[damage()],{mode:'versus',replay:true}),null);
});
test('unknown performers and malformed state or event collections fail closed',()=>{
  for(const fighterId of ['missing','__proto__','constructor','',undefined]){const state=stateFor();state.fighters[0].f.id=fighterId;assert.equal(selectMatchFinisher(state,[damage()]),null);}
  for(const state of [null,undefined,{},{...stateFor(),fighters:[]},{...stateFor(),fighters:[null,null]}])assert.equal(selectMatchFinisher(state,[damage()]),null);
  for(const events of [null,undefined,{},[],[null,{}]])assert.equal(selectMatchFinisher(stateFor(),events),null);
});
test('native a/b actors and read-only hp snapshots follow the same selection contract',()=>{
  const state=stateFor('gangle');
  const native={phase:state.phase,frame:state.frame,winner:state.winner,a:state.fighters[0],b:state.fighters[1]};
  const snapshot={...state,fighters:state.fighters.map(a=>({id:a.f.id,hp:a.life}))};
  assert.equal(selectMatchFinisher(native,[damage('super')]).id,'gangle.super');
  assert.equal(selectMatchFinisher(snapshot,[damage('super')]).id,'gangle.super');
});
test('selection is deterministic and leaves frozen state, events and catalogue untouched',()=>{
  const state=freeze(stateFor('zooble',1)),events=freeze([damage('super',{actor:1,target:0})]);
  const before=JSON.stringify({state,events,catalogue:FINISHER_CATALOG});
  const first=selectMatchFinisher(state,events,freeze({mode:'local',replay:false}));
  for(let i=0;i<20;i++)assert.deepEqual(selectMatchFinisher(state,events,{mode:'local'}),first);
  assert.equal(JSON.stringify({state,events,catalogue:FINISHER_CATALOG}),before);
});
test('each authored beat has a precise boundary and the final composition settles',()=>{
  for(const entry of FINISHER_CATALOG){
    for(const [index,beat] of entry.beats.entries()){
      const value=sampleFinisherPresentation(entry,beat.frame);
      assert.equal(value.beatIndex,index);assert.equal(value.beat,beat);assert.equal(value.localProgress,0);assert.ok(Object.isFrozen(value));
      if(index)assert.equal(sampleFinisherPresentation(entry,beat.frame-0.001).beatIndex,index-1);
    }
    const end=sampleFinisherPresentation(entry,entry.durationFrames);
    assert.equal(end.done,true);assert.equal(end.progress,1);assert.equal(end.localProgress,1);assert.equal(end.beatIndex,2);
    assert.deepEqual(sampleFinisherPresentation(entry,entry.durationFrames+10000),end);
  }
});
test('beat progress and global progress are finite and monotone throughout all forty-two scenes',()=>{
  for(const entry of FINISHER_CATALOG){let previous=-1,previousBeat=-1,previousLocal=-1;
    for(let frame=0;frame<=entry.durationFrames;frame++){
      const value=sampleFinisherPresentation(entry,frame);
      assert.ok(Number.isFinite(value.progress)&&value.progress>=previous&&value.progress<=1);
      assert.ok(Number.isFinite(value.localProgress)&&value.localProgress>=0&&value.localProgress<=1);
      if(value.beatIndex===previousBeat)assert.ok(value.localProgress>=previousLocal);
      previous=value.progress;previousBeat=value.beatIndex;previousLocal=value.localProgress;
    }
  }
});
test('reduced motion always uses the settled final composition regardless of elapsed time',()=>{
  for(const entry of FINISHER_CATALOG){const settled=sampleFinisherPresentation(entry,entry.durationFrames);
    for(const frame of [-1,0,70,10000,NaN])assert.deepEqual(sampleFinisherPresentation(entry,frame,{reducedMotion:true}),settled);
  }
});
test('invalid elapsed values are bounded without inventing simulation frames',()=>{
  const entry=FINISHER_CATALOG[0],start=sampleFinisherPresentation(entry,0);
  for(const frame of [-100,NaN,Infinity,-Infinity,'50',null,undefined])assert.deepEqual(sampleFinisherPresentation(entry,frame),start);
  const midway=sampleFinisherPresentation(entry,0.5);assert.equal(midway.frame,0.5);assert.equal(midway.done,false);
});
test('malformed or unordered timelines are rejected without changing the input',()=>{
  const entry=FINISHER_CATALOG[0];
  for(const invalid of [null,{},{...entry,durationFrames:0},{...entry,durationFrames:Infinity},
    {...entry,beats:[]},{...entry,beats:[{frame:1}]},{...entry,beats:[{frame:0},{frame:0}]},
    {...entry,beats:[{frame:0},{frame:-1}]},{...entry,beats:[{frame:0},{frame:0.5}]},
    {...entry,beats:[{frame:0},{frame:entry.durationFrames+1}]},
  ])assert.equal(sampleFinisherPresentation(freeze(invalid),30),null);
});
function realDuel(winnerIndex,slot,roundsToWin=1){
  const pomni=FIGHTERS.find(f=>f.id==='pomni'),jax=FIGHTERS.find(f=>f.id==='jax');
  const engine=new CombatEngine({fighters:winnerIndex===0?[pomni,jax]:[jax,pomni],stage:STAGES[0],mode:'local',cpu:[false,false],skipIntro:true,roundsToWin,roundTime:90,seed:58107});
  engine.state.a.x=500;engine.state.b.x=560;
  engine.state.fighters[1-winnerIndex].life=1;
  engine.state.fighters[winnerIndex].meter=100;engine.state.fighters[winnerIndex].r=100;engine.drainEvents();
  let events=[];
  for(let frame=0;frame<240&&engine.state.phase==='fight';frame++){
    const inputs=[{},{}];if(frame===0)inputs[winnerIndex]={slot};
    engine.step(FIXED_DT,inputs);events=engine.drainEvents();
  }
  return {engine,events};
}
test('real engine knockout events select all three families on either side without changing snapshots',()=>{
  for(const winnerIndex of [0,1])for(const [slot,variant] of [['light','impact'],['special','special'],['super','super']]){
    const {engine,events}=realDuel(winnerIndex,slot);
    assert.equal(engine.state.phase,'matchOver','Expected real KO for side '+winnerIndex+' / '+slot);assert.equal(engine.state.winner,winnerIndex);
    const before=engine.getSnapshot(),result=selectMatchFinisher(engine.state,freeze(events),{mode:'local'});
    assert.equal(result?.id,'pomni.'+variant);
    for(const frame of [0,30,100,240,1000])sampleFinisherPresentation(result,frame);
    assert.deepEqual(engine.getSnapshot(),before);
  }
});
test('a real intermediate round knockout does not produce a match finisher',()=>{
  const {engine,events}=realDuel(0,'light',2);
  assert.equal(engine.state.phase,'roundOver');assert.equal(engine.state.fighters[1].life,0);
  assert.equal(selectMatchFinisher(engine.state,events,{mode:'local'}),null);
});
test('a real timeout result does not become a knockout presentation',()=>{
  const engine=new CombatEngine({fighters:FIGHTERS.slice(0,2),stage:STAGES[0],mode:'local',cpu:[false,false],skipIntro:true,roundsToWin:1,roundTime:1,seed:58108});
  engine.state.a.life=7500;engine.state.b.life=5000;let events=[];
  for(let frame=0;frame<180&&engine.state.phase==='fight';frame++){engine.step(FIXED_DT,[{},{}]);events=engine.drainEvents();}
  assert.equal(engine.state.phase,'matchOver');assert.equal(engine.state.winner,0);assert.ok(engine.state.b.life>0);
  assert.equal(selectMatchFinisher(engine.state,events,{mode:'local'}),null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { FIGHTERS, VARIANTS } from '../combat/data.mjs';
import { FINISHER_CATALOG } from '../combat/finisher-catalog.mjs';
import { drawFinisherScene } from '../combat/render-finishers.mjs';

class CanvasRecorder {
  calls=[]; depth=0; maxDepth=0;
  add(name,args=[]){
    for(const value of args) if(typeof value==='number') assert.ok(Number.isFinite(value),name+' received a non-finite coordinate');
    this.calls.push([name,...args]);
  }
  save(){this.depth++;this.maxDepth=Math.max(this.maxDepth,this.depth);this.add('save');}
  restore(){assert.ok(this.depth>0,'Canvas restore must have a matching save');this.depth--;this.add('restore');}
  createRadialGradient(...args){this.add('gradient',args);return {addColorStop:(...stop)=>this.add('colorStop',stop)};}
}
for(const name of ['beginPath','closePath','fill','stroke','clip','fillRect','strokeRect','ellipse','rect','roundRect','moveTo','lineTo','bezierCurveTo','translate','rotate','scale','fillText']){
  CanvasRecorder.prototype[name]=function(...args){this.add(name,args);};
}
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
function fixture(definition,side=0,fighter=null){
  const lead=fighter||FIGHTERS.find(item=>item.id===definition.fighterId);
  const other=FIGHTERS.find(item=>item.id!==lead.id);
  const defs=side===0?[lead,other]:[other,lead];
  const actors=defs.map((f,slot)=>({f,slot,x:slot?910:370,y:568,face:slot?-1:1,facing:slot?-1:1,life:slot===side?87:0,attack:null,flash:0,buffs:{}}));
  const state=freeze({phase:'matchOver',frame:1801,winner:side,roundWinner:side,fighters:actors,a:actors[0],b:actors[1]});
  const entry={...definition,winnerIndex:side,loserIndex:1-side,matchFrame:1801,trigger:definition.variant};
  return {state,entry};
}
function record(state,entry,frame,options={}){
  const ctx=new CanvasRecorder(),actors=[];
  const view=drawFinisherScene(ctx,state,entry,frame,{...options,drawActor:(actor,presentation)=>actors.push({actor,presentation})});
  assert.equal(ctx.depth,0,'Canvas context must be restored');
  return {ctx,actors,view};
}

test('all 42 endings draw finite compositions on both winner sides without mutating the match',()=>{
  assert.equal(FINISHER_CATALOG.length,42);
  for(const definition of FINISHER_CATALOG)for(const side of [0,1]){
    const {state,entry}=fixture(definition,side),before=JSON.stringify(state);
    for(const frame of [0,definition.durationFrames/2,definition.durationFrames]){
      const result=record(state,entry,frame);
      assert.equal(result.actors.length,2);
      assert.equal(result.actors[0].actor.slot,1-side);
      assert.equal(result.actors[1].actor.slot,side);
      for(const row of result.actors){
        assert.notEqual(row.actor,state.fighters[row.actor.slot],'Presentation must pass actor copies');
        assert.equal(row.actor.f,state.fighters[row.actor.slot].f,'Artwork identity must be preserved');
        assert.equal(row.presentation.winner,side);
        assert.equal(row.actor.y,568);
      }
      assert.equal(JSON.stringify(state),before);
    }
  }
});

test('reduced motion produces one identical final composition at every requested frame',()=>{
  for(const definition of FINISHER_CATALOG){
    const {state,entry}=fixture(definition);
    const start=record(state,entry,0,{reducedMotion:true});
    for(const frame of [12,definition.durationFrames/2,definition.durationFrames+1000]){
      const current=record(state,entry,frame,{reducedMotion:true});
      assert.deepEqual(current.ctx.calls,start.ctx.calls,definition.id);
      assert.deepEqual(current.actors,start.actors,definition.id);
    }
  }
});

test('the three endings of every fighter differ in geometry, independently of their captions',()=>{
  for(const fighter of FIGHTERS){
    const signatures=FINISHER_CATALOG.filter(item=>item.fighterId===fighter.id).map(definition=>{
      const {state,entry}=fixture(definition);
      return JSON.stringify(record(state,entry,definition.durationFrames).ctx.calls.filter(row=>row[0]!=='fillText'));
    });
    assert.equal(signatures.length,3);
    assert.equal(new Set(signatures).size,3,fighter.id+' needs three distinct stage compositions');
  }
});

test('every costume keeps its actual artwork definition through an ending',()=>{
  assert.equal(VARIANTS.length,51);
  for(const variant of VARIANTS){
    const base=FIGHTERS.find(item=>item.id===variant.fighterId),fighter={...base,sprite:variant.sprite,animation:variant.animation||null,visual:{...base.visual,...variant.visual},costume:variant.id};
    const definition=FINISHER_CATALOG.find(item=>item.fighterId===base.id);
    const {state,entry}=fixture(definition,0,fighter),before=JSON.stringify(fighter);
    const {actors}=record(state,entry,definition.durationFrames);
    assert.equal(actors[1].actor.f,fighter);
    assert.equal(JSON.stringify(fighter),before);
  }
});

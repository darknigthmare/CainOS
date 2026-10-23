import test from 'node:test';
import assert from 'node:assert/strict';
import {TrainingLab,TRAINING_FRAME_LIMIT,inputLabel,trainingReadout} from '../combat/training.mjs';
import {CombatEngine,FIXED_DT} from '../combat/engine.mjs';
import {getFighter,getStage} from '../combat/data.mjs';
const actors=[{face:1},{face:-1}];
const makeEngine=()=>new CombatEngine({fighters:[getFighter('pomni'),getFighter('jax')],stage:getStage('training'),mode:'training',cpu:[false,false],seed:17});
const record=(lab,inputs,faces=actors)=>{lab.startRecording();return inputs.map(input=>lab.sample([input,{}],faces));};

test('training settings accept supported values and keep resource controls independent',()=>{
  const lab=new TrainingLab({dummy:'crouch',speed:0.25,freeMeter:false,freeResource:true,autoheal:false});
  lab.setSettings({dummy:'unknown',speed:7,freeMeter:true});
  assert.deepEqual(lab.settings,{dummy:'crouch',speed:0.25,freeMeter:true,freeResource:true,autoheal:false});
  lab.setSettings({freeResource:false});assert.equal(lab.settings.freeMeter,true);assert.equal(lab.settings.freeResource,false);
});
test('recording routes player-one movement and pulses to the dummy while J1 stays neutral',()=>{
  const lab=new TrainingLab();const [output]=record(lab,[{left:true,slot:'light',dash:true}]);
  assert.equal(output[0].left,false);assert.equal(output[0].slot,null);
  assert.equal(output[1].left,true);assert.equal(output[1].slot,'light');assert.equal(output[1].dash,true);
  assert.equal(lab.tape[0].forward,true);assert.equal(lab.tape[0].back,false);
});
test('playback follows the dummy facing and preserves authored special slots',()=>{
  const lab=new TrainingLab();record(lab,[{left:true,slot:'specialForward'}]);lab.stop();lab.startPlayback();
  const inputs=lab.sample([{right:true},{}],[{face:-1},{face:1}]);
  assert.equal(inputs[0].right,true);assert.equal(inputs[1].left,false);assert.equal(inputs[1].right,true);assert.equal(inputs[1].slot,'specialForward');
});
test('recording caps at exactly 600 frames and ignores subsequent commands',()=>{
  const lab=new TrainingLab();lab.startRecording();
  for(let i=0;i<700;i++)lab.sample([{left:true,slot:i%20?'light':'heavy'},{}],actors);
  assert.equal(lab.tape.length,TRAINING_FRAME_LIMIT);assert.equal(lab.mode,'idle');assert.equal(lab.cursor,600);
});
test('single playback emits the last pulse once and returns to the selected dummy',()=>{
  const lab=new TrainingLab({dummy:'block'});record(lab,[{left:true},{slot:'throw'}]);lab.stop();lab.startPlayback(false);
  assert.equal(lab.sample([{},{}],actors)[1].left,true);
  assert.equal(lab.sample([{},{}],actors)[1].slot,'throw');assert.equal(lab.mode,'idle');
  assert.equal(lab.sample([{},{}],actors)[1].slot,null);assert.equal(lab.settings.dummy,'block');
});
test('loop playback wraps only at the end and repeats all command edges',()=>{
  const lab=new TrainingLab();record(lab,[{slot:'light'},{}]);lab.stop();lab.startPlayback(true);
  assert.deepEqual(Array.from({length:6},()=>lab.sample([{},{}],actors)[1].slot),['light',null,'light',null,'light',null]);
  assert.equal(lab.cursor,0);assert.equal(lab.mode,'playback');
});
test('empty playback is inert and clear removes the entire sequence',()=>{
  const lab=new TrainingLab();assert.equal(lab.startPlayback(),false);record(lab,[{left:true}]);lab.clearTape();
  assert.equal(lab.startPlayback(),false);assert.deepEqual(lab.tape,[]);assert.equal(lab.mode,'idle');assert.equal(lab.cursor,0);
});
test('reset preserves tape, independent settings, loop and frozen state while clearing history',()=>{
  const lab=new TrainingLab({speed:0.5,freeMeter:false});record(lab,[{slot:'heavy'}]);lab.setFrozen(true);lab.startPlayback(true);lab.observe([{slot:'heavy'},{}]);
  const tape=JSON.stringify(lab.tape);lab.reset();
  assert.equal(JSON.stringify(lab.tape),tape);assert.equal(lab.settings.speed,0.5);assert.equal(lab.settings.freeMeter,false);
  assert.equal(lab.frozen,true);assert.equal(lab.loop,true);assert.equal(lab.mode,'idle');assert.equal(lab.frames,0);assert.deepEqual(lab.history,[[],[]]);
});
test('input history groups sustained commands and keeps twelve newest transitions per player',()=>{
  const lab=new TrainingLab();for(let i=0;i<4;i++)lab.observe([{left:true},{guard:true}]);
  assert.equal(lab.history[0][0].frames,4);assert.equal(lab.history[1][0].frames,4);
  for(let i=0;i<20;i++)lab.observe([{slot:i%2?'light':'heavy'},{}]);
  assert.equal(lab.history[0].length,12);assert.equal(lab.history[0][0].label,'Léger');assert.equal(lab.history[1].length,2);
});
test('training diagnostics are detached copies and cannot mutate tape, controls or history',()=>{
  const lab=new TrainingLab();record(lab,[{slot:'light'}]);lab.observe([{left:true},{}]);const view=lab.snapshot(actors);
  view.settings.speed=8;view.history[0][0].input.left=false;view.tapeFrames=99;
  assert.equal(lab.settings.speed,1);assert.equal(lab.history[0][0].input.left,true);assert.equal(lab.tape.length,1);assert.equal('tape' in view,false);
});
test('frame readout distinguishes startup, active, recovery and combined reaction limits',()=>{
  const def={name:'Test',startup:6,active:3,recovery:12};
  assert.deepEqual([0,6,9].map(t=>trainingReadout({attack:{def,t}}).phase),['Préparation','Active','Récupération']);
  assert.equal(trainingReadout({attack:{def,t:8}}).remaining,1);
  assert.equal(trainingReadout({hit:3,blockstun:8}).remaining,8);
  assert.equal(trainingReadout({attack:{def,t:20},hit:3,blockstun:8}).reaction,8);
});
test('native input labels keep simultaneous directions, guard and attack visible',()=>{
  assert.equal(inputLabel({}), 'Neutre');
  assert.equal(inputLabel({left:true,down:true,guard:true,slot:'low'}),'← + ↓ + Garde + Bas');
  assert.equal(inputLabel({slot:'throw',tech:true}),'Saisie');
});
test('recorded native movement and attack reproduce the exact dummy simulation after reset',()=>{
  const engine=makeEngine(),lab=new TrainingLab();engine.setTraining({dummy:'playback'});lab.startRecording();
  const commands=[...Array.from({length:12},()=>({left:true})),{slot:'light'},...Array.from({length:20},()=>({}))];
  for(const input of commands){engine.step(FIXED_DT,lab.sample([input,{}],engine.state.fighters));engine.drainEvents();}
  const expected=engine.getSnapshot();lab.stop();engine.reset();engine.setTraining({dummy:'playback'});lab.startPlayback(false);
  for(const input of commands){engine.step(FIXED_DT,lab.sample([{},{}],engine.state.fighters));engine.drainEvents();}
  assert.deepEqual(engine.getSnapshot(),expected);assert.equal(engine.state.a.x,380);
});
test('single frozen frames execute one queued attack and preserve the training clock',()=>{
  const engine=makeEngine(),lab=new TrainingLab();engine.pause();lab.setFrozen(true);
  engine.stepFrame(lab.sample([{slot:'light'},{}],engine.state.fighters));lab.observe(engine.lastInputs);
  assert.equal(engine.state.frame,1);assert.equal(engine.state.a.attack?.name,'light');assert.equal(engine.paused,true);
  engine.stepFrame(lab.sample([{},{}],engine.state.fighters));lab.observe(engine.lastInputs);
  assert.equal(engine.state.frame,2);assert.equal(engine.state.a.stats.starts,1);assert.equal(lab.history[0].length,2);
});

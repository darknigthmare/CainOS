import test from 'node:test';
import assert from 'node:assert/strict';
import { BINDING_ACTIONS, DEFAULT_BINDINGS, cleanBindings, rebindAction, keyLabel, formatBinding, isBindableCode } from '../combat/bindings.mjs';
import { InputController } from '../combat/input.mjs';
import { CombatEngine, FIXED_DT } from '../combat/engine.mjs';
import { FIGHTERS } from '../combat/data.mjs';

const clone = value => JSON.parse(JSON.stringify(value));

test('all 24 player actions remain bound and independent after a JSON round trip', () => {
  let settings=cleanBindings();
  settings=rebindAction(settings,0,'light','KeyF').bindings;
  settings=rebindAction(settings,1,'light','KeyH').bindings;
  settings=rebindAction(settings,0,'jump','KeyX',1).bindings;
  const imported=cleanBindings(JSON.parse(JSON.stringify(settings)));
  assert.deepEqual(imported,settings);
  assert.equal(imported.length*BINDING_ACTIONS.length,24);
  const keys=imported.flatMap(map=>Object.values(map).flat());
  assert.equal(keys.length,new Set(keys).size);
  assert.ok(imported.every(map=>BINDING_ACTIONS.every(({id})=>map[id].length>0)));
});

test('reassignment rejects conflicts across players and alternative keys without changing the saved map', () => {
  const original=cleanBindings(), before=clone(original);
  for(const [player,action,code,slot] of [[0,'light','KeyB',0],[0,'light','Space',0],[1,'heavy','Numpad1',0],[0,'jump','Space',0]]) {
    const result=rebindAction(original,player,action,code,slot);
    assert.equal(result.ok,false); assert.ok(result.conflict); assert.ok(result.error.includes('déjà'));
    assert.deepEqual(result.bindings,before);
  }
  assert.deepEqual(original,before);
});

test('reserved navigation and browser keys cannot replace gameplay bindings', () => {
  for(const code of ['Escape','Enter','NumpadEnter','Tab','Backspace','Delete','Home','End','PageUp','PageDown','F1','F5','F12','MetaLeft','AltLeft','Unknown','__proto__']) {
    assert.equal(isBindableCode(code),false,code);
    const result=rebindAction(DEFAULT_BINDINGS,0,'light',code);
    assert.equal(result.ok,false,code); assert.ok(result.error);
  }
  assert.equal(rebindAction(DEFAULT_BINDINGS,0,'light','KeyF').ok,true);
  assert.equal(rebindAction(DEFAULT_BINDINGS,0,'light','Digit2').ok,true);
});

test('corrupt imported maps restore reachable defaults and do not share mutable arrays', () => {
  const bad=[];
  for(const value of [null,[],[{}],['bad',{}]])bad.push(value);
  for(const edit of [m=>m[0].light=['Escape'],m=>m[0].left=[],m=>m[0].jump=['KeyW','Space','KeyX'],m=>m[1].light=['KeyJ'],m=>m[0].heavy=['KeyF','KeyF']]) {
    const map=cleanBindings();edit(map);bad.push(map);
  }
  for(const value of bad) assert.deepEqual(cleanBindings(value),DEFAULT_BINDINGS);
  const a=cleanBindings(),b=cleanBindings();a[0].light[0]='KeyF';
  assert.deepEqual(b,DEFAULT_BINDINGS);assert.equal(DEFAULT_BINDINGS[0].light[0],'KeyJ');
  const partial=cleanBindings([{light:['KeyF']},{}]);
  assert.deepEqual(partial[0].light,['KeyF']);assert.deepEqual(partial[1],DEFAULT_BINDINGS[1]);
});

test('secondary bindings can be added and removed while a primary action stays reachable', () => {
  const added=rebindAction(DEFAULT_BINDINGS,0,'light','KeyF',1);
  assert.equal(added.ok,true);assert.deepEqual(added.bindings[0].light,['KeyJ','KeyF']);
  const removed=rebindAction(added.bindings,0,'light',null,1);
  assert.equal(removed.ok,true);assert.deepEqual(removed.bindings[0].light,['KeyJ']);
  assert.equal(rebindAction(DEFAULT_BINDINGS,0,'light','',0).ok,false);
});

test('physical positions receive correct AZERTY and QWERTY labels for both players', () => {
  assert.equal(keyLabel('KeyW','azerty'),'Z');assert.equal(keyLabel('KeyA','azerty'),'Q');
  assert.equal(keyLabel('KeyM','azerty'),',');assert.equal(keyLabel('Comma','azerty'),';');assert.equal(keyLabel('Period','azerty'),':');
  assert.equal(keyLabel('KeyM','qwerty'),'M');assert.equal(keyLabel('Comma','qwerty'),',');
  assert.equal(formatBinding(DEFAULT_BINDINGS,1,'special','azerty'),', / Pavé 5');
  assert.equal(formatBinding(DEFAULT_BINDINGS,0,'jump','qwerty'),'W / Espace');
  assert.equal(keyLabel('<script>'),'—');
});

class Surface {
  constructor(){this.handlers=new Map();}
  addEventListener(type,handler){const list=this.handlers.get(type)||[];list.push(handler);this.handlers.set(type,list);}
  emit(type,value={}){
    const event={target:{tagName:'CANVAS'},repeat:false,metaKey:false,altKey:false,ctrlKey:false,preventDefault(){this.prevented=true;},...value};
    for(const listener of this.handlers.get(type)||[])listener(event);
    return event;
  }
}
function withDOM(callback){
  const originals=Object.fromEntries(['document','window','navigator'].map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
  const document=new Surface(),window=new Surface(),pads=[];
  document.hidden=false;document.activeElement={tagName:'BUTTON'};document.querySelectorAll=()=>[];
  let enabled=true,bindings=cleanBindings(),pauseCount=0,helpCount=0,navHook;
  const navigation=[];
  for(const [name,value] of Object.entries({document,window,navigator:{getGamepads:()=>pads}})) Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});
  const controls=new InputController({enabled:()=>enabled,getBindings:()=>bindings,onPause:()=>pauseCount++,onHelp:()=>helpCount++,onNavigate:action=>{navigation.push(action);navHook?.(action);}});
  try{return callback({controls,document,window,pads,navigation,setEnabled:value=>enabled=value,setBindings:value=>bindings=value,getBindings:()=>bindings,onNavigate:handler=>navHook=handler,pauses:()=>pauseCount,helps:()=>helpCount});}
  finally{for(const [name,descriptor] of Object.entries(originals)){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else delete globalThis[name];}}
}
const pad=index=>({index,connected:true,axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))});

test('a remapped short press activates the real combat engine exactly once and releases the old key',()=>withDOM(({controls,document,setBindings,getBindings})=>{
  setBindings(rebindAction(getBindings(),0,'light','KeyF').bindings);
  const old=document.emit('keydown',{code:'KeyJ'});document.emit('keyup',{code:'KeyJ'});
  assert.equal(old.prevented,undefined);assert.equal(controls.poll()[0].slot,null);
  document.emit('keydown',{code:'KeyF'});document.emit('keyup',{code:'KeyF'});
  const engine=new CombatEngine({fighters:[FIGHTERS[0],FIGHTERS[1]],cpu:[false,false],skipIntro:true});
  engine.step(FIXED_DT,controls.poll(engine.state.fighters));
  assert.equal(engine.state.a.attack.name,'light');
  for(let frame=0;frame<90;frame++)engine.step(FIXED_DT,controls.poll(engine.state.fighters));
  assert.equal(engine.state.a.stats.starts,1);
}));

test('custom local mappings stay independent and rebinding clears a held direction',()=>withDOM(({controls,document,setBindings,getBindings})=>{
  let map=rebindAction(getBindings(),0,'light','KeyF').bindings;map=rebindAction(map,1,'light','KeyH').bindings;setBindings(map);
  document.emit('keydown',{code:'KeyF'});document.emit('keydown',{code:'KeyH'});
  assert.deepEqual(controls.poll([],true).map(input=>input.slot),['light','light']);
  document.emit('keydown',{code:'KeyD'});assert.equal(controls.poll()[0].right,true);
  setBindings(rebindAction(map,0,'right','KeyG').bindings);
  assert.equal(controls.poll()[0].right,false);
  document.emit('keydown',{code:'KeyG'});assert.equal(controls.poll()[0].right,true);
}));

test('editing and browser shortcuts do not queue custom attacks while pause/help remain available',()=>withDOM(({controls,document,setBindings,getBindings,pauses,helps})=>{
  setBindings(rebindAction(getBindings(),0,'light','KeyF').bindings);
  for(const event of [{target:{tagName:'INPUT'}},{target:{tagName:'DIV',isContentEditable:true}},{metaKey:true},{ctrlKey:true},{altKey:true}])document.emit('keydown',{code:'KeyF',...event});
  assert.equal(controls.poll()[0].slot,null);
  document.emit('keydown',{code:'Escape'});document.emit('keydown',{code:'Escape',repeat:true});
  document.emit('keydown',{code:'F1'});document.emit('keydown',{code:'F1',repeat:true});
  assert.equal(pauses(),1);assert.equal(helps(),1);
}));

test('gamepad menus use a dead zone, bounded repeats and single select/back edges',()=>withDOM(({controls,pads,setEnabled,navigation})=>{
  setEnabled(false);pads.push(pad(0));pads[0].axes[0]=.4;assert.equal(controls.pollMenu(0),null);
  pads[0].axes[0]=.8;assert.equal(controls.pollMenu(1),'right');
  assert.equal(controls.pollMenu(100),null);assert.equal(controls.pollMenu(350),null);assert.equal(controls.pollMenu(351),'right');assert.equal(controls.pollMenu(491),'right');
  pads[0].axes[0]=0;controls.pollMenu(500);
  pads[0].buttons[0].pressed=true;assert.equal(controls.pollMenu(510),'select');assert.equal(controls.pollMenu(520),null);
  pads[0].buttons[0].pressed=false;controls.pollMenu(530);
  pads[0].buttons[1].pressed=true;assert.equal(controls.pollMenu(540),'back');assert.equal(controls.pollMenu(550),null);
  assert.deepEqual(navigation,['right','right','right','select','back']);
}));

test('menu capture and focused text fields suppress gamepad actions until controls return to neutral',()=>withDOM(({controls,pads,document,setEnabled,navigation})=>{
  setEnabled(false);pads.push(pad(0));document.activeElement={tagName:'INPUT'};pads[0].buttons[0].pressed=true;
  assert.equal(controls.pollMenu(0),null);document.activeElement={tagName:'BUTTON'};assert.equal(controls.pollMenu(10),null);
  pads[0].buttons[0].pressed=false;controls.pollMenu(20);pads[0].buttons[0].pressed=true;assert.equal(controls.pollMenu(30),'select');
  pads[0].buttons[0].pressed=false;pads[0].axes[1]=.8;assert.equal(controls.pollMenu(40,{disabled:true}),null);
  assert.equal(controls.pollMenu(500),null);pads[0].axes[1]=0;controls.pollMenu(510);
  pads[0].axes[1]=.8;assert.equal(controls.pollMenu(520),'down');
  assert.deepEqual(navigation,['select','down']);
}));

test('selects, sliders, checkboxes and radios retain gamepad navigation without native clicks',()=>withDOM(({controls,pads,document,setEnabled})=>{
  setEnabled(false);pads.push(pad(0));let clock=0,nativeClicks=0;
  for(const field of [{tagName:'SELECT'},{tagName:'INPUT',type:'range'},{tagName:'INPUT',type:'checkbox'},{tagName:'INPUT',type:'radio'}]){
    document.activeElement={...field,click:()=>nativeClicks++};
    pads[0].axes[0]=.8;assert.equal(controls.pollMenu(clock+=10),'right',field.type||field.tagName);
    pads[0].axes[0]=0;controls.pollMenu(clock+=10);
    pads[0].buttons[0].pressed=true;assert.equal(controls.pollMenu(clock+=10),'select');
    pads[0].buttons[0].pressed=false;controls.pollMenu(clock+=10);
    pads[0].buttons[1].pressed=true;assert.equal(controls.pollMenu(clock+=10),'back');
    pads[0].buttons[1].pressed=false;controls.pollMenu(clock+=10);
  }
  assert.equal(nativeClicks,0,'The input layer delegates activation to the owning menu.');
}));

test('a held gamepad button cannot leak from combat into menus or from Select into a new match',()=>withDOM(({controls,pads,setEnabled,onNavigate,navigation})=>{
  pads.push(pad(0));pads[0].buttons[0].pressed=true;assert.equal(controls.poll()[0].jump,true);
  setEnabled(false);assert.equal(controls.pollMenu(0),null);assert.equal(controls.pollMenu(500),null);
  pads[0].buttons[0].pressed=false;controls.pollMenu(510);
  onNavigate(action=>{if(action==='select')setEnabled(true);});
  pads[0].buttons[0].pressed=true;assert.equal(controls.pollMenu(520),'select');
  assert.equal(controls.poll()[0].jump,false);assert.deepEqual(navigation,['select']);
}));

test('an optional menu poll during combat does not consume its jump or attack edges',()=>withDOM(({controls,pads,navigation})=>{
  pads.push(pad(0));pads[0].buttons[0].pressed=true;pads[0].buttons[2].pressed=true;
  assert.equal(controls.pollMenu(0),null);
  const input=controls.poll()[0];assert.equal(input.jump,true);assert.equal(input.slot,'light');assert.deepEqual(navigation,[]);
}));

test('disconnecting player one keeps player two on its original controls',()=>withDOM(({controls,pads})=>{
  pads.push(pad(0),pad(1));controls.poll([],true);
  pads[0]=null;pads[1].buttons[2].pressed=true;
  const inputs=controls.poll([],true);
  assert.equal(inputs[0].slot,null);assert.equal(inputs[1].slot,'light');
  pads[2]=pad(2);pads[2].axes[0]=.8;
  const reconnected=controls.poll([],true);
  assert.equal(reconnected[0].right,true);assert.equal(reconnected[1].right,false);
}));

test('denied Gamepad access leaves keyboard play available',()=>withDOM(({controls,document})=>{
  navigator.getGamepads=()=>{throw new Error('SecurityError');};
  document.emit('keydown',{code:'KeyJ'});document.emit('keyup',{code:'KeyJ'});
  assert.equal(controls.poll()[0].slot,'light');
}));

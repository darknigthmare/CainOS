/** Session-only training tools. They never write profiles, replays or simulation state. */
export const TRAINING_FRAME_LIMIT = 600;
export const TRAINING_HISTORY_LIMIT = 12;
export const TRAINING_SPEEDS = Object.freeze([0.25, 0.5, 1]);
const DUMMIES = ['idle', 'block', 'crouch', 'jump', 'after', 'cpu'];
const SLOT_NAMES = { light:'Léger', heavy:'Fort', low:'Bas', throw:'Saisie', special:'Spécial', specialDown:'Spécial ↓', specialForward:'Spécial avant', specialBack:'Spécial arrière', super:'Finale', utility:'Ressource' };
const clone = value => JSON.parse(JSON.stringify(value));
const neutral = () => ({left:false,right:false,down:false,guard:false,jump:false,dash:false,tech:false,slot:null});
const cleanInput = input => ({...Object.fromEntries(['left','right','down','guard','jump','dash','tech'].map(key=>[key,!!input?.[key]])),slot:Object.hasOwn(SLOT_NAMES,input?.slot)?input.slot:null});

export function inputLabel(input = {}) {
  const labels = [];
  if(input.left)labels.push('←'); if(input.right)labels.push('→'); if(input.down)labels.push('↓');
  if(input.guard)labels.push('Garde'); if(input.jump)labels.push('Saut'); if(input.dash)labels.push('Dash');
  if(input.slot)labels.push(SLOT_NAMES[input.slot] || input.slot);
  if(input.tech && input.slot!=='throw')labels.push('Déchope');
  return labels.join(' + ') || 'Neutre';
}

export function trainingReadout(actor) {
  const attack = actor?.attack, def = attack?.def;
  const reaction = Math.max(0,actor?.hit||0,actor?.blockstun||0);
  if(!def)return {name:reaction?'Réaction':'Disponible',phase:reaction?'Réaction':'Neutre',elapsed:0,remaining:reaction,total:0,reaction};
  const elapsed = Math.max(0,Math.floor(attack.t || 0));
  const total = def.startup + def.active + def.recovery;
  const phase = elapsed < def.startup ? 'Préparation' : elapsed < def.startup + def.active ? 'Active' : 'Récupération';
  const end = phase==='Préparation' ? def.startup : phase==='Active' ? def.startup+def.active : total;
  return {name:def.name,phase,elapsed,remaining:Math.max(0,end-elapsed),total,reaction};
}

export class TrainingLab {
  constructor(settings = {}) {
    this.settings = {dummy:'idle',speed:1,freeMeter:true,freeResource:true,autoheal:true};
    this.setSettings(settings);
    this.frozen = false;
    this.mode = 'idle'; this.loop = false; this.cursor = 0;
    this.tape = []; this.history = [[],[]]; this.frames = 0;
  }
  setSettings(settings = {}) {
    if(DUMMIES.includes(settings.dummy))this.settings.dummy=settings.dummy;
    if(TRAINING_SPEEDS.includes(Number(settings.speed)))this.settings.speed=Number(settings.speed);
    for(const key of ['freeMeter','freeResource','autoheal'])if(typeof settings[key]==='boolean')this.settings[key]=settings[key];
  }
  get drivesDummy(){return this.mode==='recording'||this.mode==='playback';}
  setFrozen(value){this.frozen=!!value;}
  startRecording(){this.tape=[];this.cursor=0;this.mode='recording';}
  stop(){this.mode='idle';}
  startPlayback(loop=this.loop){
    if(!this.tape.length)return false;
    this.loop=!!loop;this.cursor=0;this.mode='playback';return true;
  }
  clearTape(){this.stop();this.tape=[];this.cursor=0;}
  clearHistory(){this.history=[[],[]];this.frames=0;}
  reset(){this.stop();this.cursor=0;this.clearHistory();}
  /** Directions are recorded relative to J2, so a turn-around preserves the sequence. */
  sample(inputs, actors) {
    const first=cleanInput(inputs?.[0]),second=cleanInput(inputs?.[1]);
    const face=actors?.[1]?.face<0?-1:1;
    if(this.mode==='recording'){
      const {left,right,...rest}=first;
      this.tape.push({...rest,forward:face>0?right:left,back:face>0?left:right});
      this.cursor=this.tape.length;
      if(this.tape.length>=TRAINING_FRAME_LIMIT)this.stop();
      return [neutral(),first];
    }
    if(this.mode==='playback'){
      const {forward,back,...rest}=this.tape[this.cursor];
      const resolved={...rest,left:face>0?back:forward,right:face>0?forward:back};
      this.cursor++;
      if(this.cursor>=this.tape.length){if(this.loop)this.cursor=0;else this.stop();}
      return [first,resolved];
    }
    return [first,second];
  }
  observe(inputs) {
    this.frames++;
    for(let player=0;player<2;player++){
      const input=cleanInput(inputs?.[player]),label=inputLabel(input),rows=this.history[player];
      if(rows[0]?.label===label)rows[0].frames++;
      else {rows.unshift({label,frames:1,input});if(rows.length>TRAINING_HISTORY_LIMIT)rows.length=TRAINING_HISTORY_LIMIT;}
    }
  }
  snapshot(actors = []) {
    return clone({settings:this.settings,frozen:this.frozen,mode:this.mode,loop:this.loop,cursor:this.cursor,tapeFrames:this.tape.length,maxFrames:TRAINING_FRAME_LIMIT,frames:this.frames,history:this.history,readouts:actors.map(trainingReadout)});
  }
}

/**
 * Digital Circus: Encore — shared combat engine.
 *
 * Substantive source port from the user-owned CQC Versus implementation:
 * darknigthmare/shadow-codec-ops @ 42279c1c884769873e66bbda0b6fe849bcd2f1a2
 * public/cqc/modules/unified-versus-v055.html, embedded CQCCombat046 core.
 * The authored simulationBody hook also follows public/cqc/src/cqc-pass8-combat-engine.js.
 *
 * Preserved: 60 Hz simulation, 10 slots, startup/active/recovery, hit confirms,
 * two-link cancel cap, combo scaling/escape, guard/chip, throw tech/protection,
 * bounded parries/reflection, projectiles/traps, finite resources and seeded CPU.
 * Adaptations: ES-module isolation, Digital Circus body/health/defense data,
 * stable held guard through blockstun, signed retreat dash, declared projectile
 * travel budgets, fixed-time/input wrapper, manual rounds and training controls.
 * Original Metal Gear content is not imported into the Digital Circus roster.
 */
export const SOURCE = Object.freeze({
  repository: 'darknigthmare/shadow-codec-ops',
  commit: '42279c1c884769873e66bbda0b6fe849bcd2f1a2',
  path: 'public/cqc/modules/unified-versus-v055.html',
  engine: 'CQCCombat046 / 0.48',
});
export const FIXED_DT = 1 / 60;
export const ARENA = Object.freeze({ width: 1280, height: 720, floor: 568, left: 65, right: 1215 });

// A CQC slot is an authored move; only guard and directional movement are held.
export const ACTIONS = Object.freeze(['light', 'heavy', 'low', 'throw', 'special', 'specialDown', 'specialForward', 'specialBack', 'super', 'utility']);
const normal = (name, startup, active, recovery, damage, reach, extra = {}) => ({
  name, kind: 'melee', startup, active, recovery, damage, reach, level: 'mid',
  cost: 0, meter: 0, cooldown: 0, tag: 'strike', ...extra,
});
export const BASE_MOVES = Object.freeze({
  light: Object.freeze(normal('Frappe légère', 6, 3, 12, 320, 76)),
  heavy: Object.freeze(normal('Frappe engagée', 14, 5, 24, 690, 128)),
  low: Object.freeze(normal('Balayage', 12, 4, 23, 440, 114, { level: 'low' })),
  throw: Object.freeze(normal('Projection', 8, 2, 34, 800, 76, { level: 'throw', tag: 'grapple' })),
  special: Object.freeze(normal('Éclat numérique', 16, 1, 24, 520, 780, {
    kind: 'projectile', level: 'high', tag: 'confetti', cost: 18, speed: 15, life: 72, height: 145,
  })),
  specialDown: Object.freeze(normal('Piège de confettis', 24, 1, 30, 460, 90, {
    kind: 'trap', tag: 'snare', level: 'low', cost: 25, arm: 32, duration: 300, maxTraps: 2, hp: 200,
  })),
  specialForward: Object.freeze(normal('Ruée', 12, 9, 26, 620, 95, { travel: 5, cost: 20 })),
  specialBack: Object.freeze(normal('Contre', 4, 9, 25, 450, 115, { kind: 'parry', parryMode: 'melee', cost: 12 })),
  super: Object.freeze(normal('Grand final', 30, 1, 42, 1700, 1000, {
    kind: 'projectile', tag: 'confetti', meter: 50, speed: 19, life: 72, height: 130,
  })),
  utility: Object.freeze(normal('Retrouver ses repères', 42, 1, 18, 0, 0, { kind: 'recover', restore: 35, tag: 'recovery' })),
});

export const CQCCombat = (() => {
'use strict';
const FLOOR=568,LEFT=65,RIGHT=1215,SLOTS=['light','heavy','low','throw','special','specialDown','specialForward','specialBack','super','utility'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const bounds=s=>s.options.bounds||{left:LEFT,right:RIGHT};
const clampX=(s,x)=>clamp(x,bounds(s).left,bounds(s).right);
const copy=x=>JSON.parse(JSON.stringify(x));
const empty=()=>({left:false,right:false,down:false,guard:false,jump:false,dash:false,tech:false,slot:null});
const slotName={special:'I',specialDown:'↓ + I',specialForward:'AVANT + I',specialBack:'ARRIÈRE + I',super:'O',utility:'L',light:'J',heavy:'K',low:'↓ + J',throw:'U'};
function rand(s){let x=s.seed>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;s.seed=x>>>0;return(s.seed>>>0)/4294967296;}
function event(s,type,actor,extra={}){const e={frame:s.frame,type,actor:actor?.slot??-1,...extra};s.events.push(e);if(s.events.length>180)s.events.shift();s.metrics[type]=(s.metrics[type]||0)+1;return e;}
function fx(s,x,y,kind,tag='tactical',text=''){s.fx.push({x,y,kind,tag,text,t:kind==='blast'?26:40,max:kind==='blast'?26:40});if(s.fx.length>100)s.fx.shift();}
function makeActor(f,slot){if(!f?.combat?.moves)throw Error('Missing authored combat profile: '+f?.uid);const c=f.combat,r=c.resource;return{
 f,slot,x:slot?900:380,y:FLOOR,vx:0,vy:0,face:slot?-1:1,life:f.stats?.health||10000,max:f.stats?.health||10000,gray:0,regenUsed:0,meter:0,guard:100,
 r:['heat','cost'].includes(r.kind)?0:r.max,resourceDelay:0,hit:0,blockstun:0,block:false,crouch:false,onGround:true,
 attack:null,state:'idle',stateT:0,cool:0,flash:0,projectiles:[],wins:0,ai:false,buffs:{},statuses:{},cooldowns:{},
 lastHit:-999,lastOffense:-999,still:0,steady:false,lastTech:-999,throwProtect:0,shockImmune:0,sleepImmune:0,drowsy:0,
 comboHits:0,comboStun:0,comboQuiet:0,sequence:0,lastStarted:null,lastActivation:null,chainDepth:0,chainQuiet:0,feedback:'',feedbackT:0,
 stats:{attempts:0,starts:0,activations:0,hits:0,damage:0,parries:0,blocked:0,healed:0,denied:0},cpuWait:0,cpuGuard:0
 };}
function create(a,b,options={}){const s={version:'0.45',a:makeActor(a,0),b:makeActor(b,1),frame:0,seed:((options.seed??987654321)>>>0)||987654321,
 timerStart:options.training?0:(options.seconds??99)*60,timer:options.training?0:(options.seconds??99)*60,
 rounds:options.rounds??2,round:1,phase:options.training||options.skipIntro?'fight':'intro',phaseT:options.training||options.skipIntro?0:100,
 finished:false,roundWinner:null,winner:null,projectiles:[],traps:[],fx:[],events:[],metrics:{},nextId:1,
 options:{training:false,dummy:'idle',autoheal:false,freeMeter:false,freeResource:false,...options},idleTraining:0};
 s.b.ai=options.mode==='cpu';return s;}
function actors(s){return[s.a,s.b];}
function other(s,p){return p.slot===0?s.b:s.a;}
function reset(s,{keepWins=true}={}){const oldA=s.a,oldB=s.b;s.a=makeActor(oldA.f,0);s.b=makeActor(oldB.f,1);s.a.ai=oldA.ai;s.b.ai=oldB.ai;
 if(keepWins){s.a.wins=oldA.wins;s.b.wins=oldB.wins;}s.timer=s.timerStart;s.phase=s.options.training||s.options.skipIntro?'fight':'intro';s.phaseT=s.options.training||s.options.skipIntro?0:90;
 s.projectiles=[];s.traps=[];s.fx=[];s.roundWinner=null;s.idleTraining=0;event(s,'roundReset',null);return s;}
function box(p){const authored=p.f.combat.simulationBody;if(authored){const h=p.crouch||p.attack?.def.lowProfile?authored.crouchHeight||authored.height*.53:authored.height;return{x:p.x-authored.width/2,y:p.y-h,w:authored.width,h};}const k=p.f.combat.simulationVisualKind||p.f.visual?.kind,species=p.f.visual?.species,small=p.f.combat.key==='small_drone'||species==='monkey';
 const low=k==='quadruped'||p.f.combat.key==='wolf_robot'||p.f.combat.key==='crying';
 const w=small?60:low?140:k==='machine'?125:78;let h=small?90:low?134:k==='machine'?210:230;
 if(species==='horse')h=185;if(p.crouch||p.attack?.def.lowProfile)h*=.53;return{x:p.x-w/2,y:p.y-h,w,h};}
function overlap(a,b){return a&&b&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function inActive(a){return a&&a.t>=a.def.startup&&a.t<a.def.startup+a.def.active;}
function hitbox(p){const a=p.attack;if(!inActive(a)||a.def.kind!=='melee')return null;const d=a.def,r=d.reach*clamp(p.f.reach||1,.85,1.25),lo=d.level==='low',h=lo?62:Math.min(155,d.height?d.height:155),top=d.height|| (lo?Math.min(62,box(p).h):Math.min(190,box(p).h*.83));return{x:p.face>0?p.x:p.x-r,y:p.y-top,w:r,h};}
function isGun(m){return m.kind==='projectile'&&['ballistic','precision','tranq','rail','rocket'].includes(m.tag);}
function costAllowed(p,d){const r=p.f.combat.resource,c=d.cost||0;return ['heat','cost'].includes(r.kind)?p.r+c<=r.max+.001:p.r>=c;}
function denied(s,p,why){p.stats.denied++;p.feedback=why;p.feedbackT=48;event(s,'denied',p,{why});return false;}
function start(s,p,slot){const d=p.f.combat.moves[slot];p.stats.attempts++;if(!d)return denied(s,p,'Technique inconnue');let cancel=false;
 if(p.attack){const a=p.attack,link=p.f.combat.links?.some(l=>l[0]===a.name&&l[1]===slot);if(!(a.confirmed&&link&&p.chainDepth<2&&a.t>=a.def.startup&&a.t<a.def.startup+a.def.active+12))return false;else cancel=true;}
 if(p.hit>0||p.blockstun>0||p.cool>0||p.life<=0)return false;
 if(d.requiresStagger&&!(other(s,p).hit>0&&s.frame-other(s,p).lastHit<40))return denied(s,p,'Créer une ouverture par un impact de lame');
 if(d.level==='throw'&&!p.onGround)return denied(s,p,'Saisie au sol uniquement');
 if((d.launchSelf||d.blink||['reload','recover','heal','trap','stationaryMine','recallTrap','observe'].includes(d.kind))&&!p.onGround)return denied(s,p,'Action au sol uniquement');
 if(p.statuses.disarm?.t>0&&isGun(d))return denied(s,p,'Arme désarmée temporairement');
 if(p.cooldowns[slot]>0)return denied(s,p,'Technique en récupération');
 if((d.meter||0)>p.meter)return denied(s,p,'Jauge tactique insuffisante');
 if(!costAllowed(p,d))return denied(s,p,p.f.combat.resource.kind==='ammo'?'Recharger avec L / H':'Ressource indisponible');
 if(cancel){p.attack=null;p.chainDepth++;p.chainQuiet=0;event(s,'confirmCancel',p,{slot});}
 const old=p.r;p.r=clamp(p.r+(['heat','cost'].includes(p.f.combat.resource.kind)?1:-1)*(d.cost||0),0,p.f.combat.resource.max);p.meter-=d.meter||0;p.resourceDelay=80;
 p.cooldowns[slot]=d.cooldown||0;p.attack={name:slot,def:d,t:0,id:++p.sequence,hit:false,activated:false,confirmed:false,steady:p.steady,face:p.face};p.state='attack';p.block=false;p.vx=0;p.lastStarted=slot;p.stats.starts++;
 if(!['heal','recover','reload'].includes(d.kind)){p.lastOffense=s.frame;if(d.kind!=='buff'||d.buff!=='cloak')delete p.buffs.cloak;}
 if(d.kind==='projectile'||d.damage>0){p.steady=false;p.still=0;}event(s,'start',p,{slot,name:d.name,cost:d.cost,resourceBefore:old,resourceAfter:p.r});return true;}
function canParry(p,m,projectile){const a=p.attack;if(!inActive(a)||a.def.kind!=='parry'||m.level==='throw')return false;
 if(projectile)return a.def.parryMode==='projectile'&&!['explosive','fire','rocket'].includes(m.tag)&&!m.fuse;
 return a.def.parryMode==='melee';}
function heal(s,p,n,budget){const cap=budget??(p.f.combat.passive.regenBudget||900);const amount=Math.max(0,Math.min(n,p.gray,p.max-p.life,cap-p.regenUsed));if(!amount)return 0;p.life+=amount;p.gray-=amount;p.regenUsed+=amount;p.stats.healed+=amount;event(s,'heal',p,{amount});return amount;}
function buffHit(p,name){const b=p.buffs[name];if(!b||b.t<=0)return false;b.hits--;if(b.hits<=0)delete p.buffs[name];return true;}
function applyStatus(s,a,d,m){const machine=d.f.combat.passive.machine||d.f.visual?.kind==='machine',status=m.status;
 if(m.disarm){d.statuses.disarm={t:m.disarm};fx(s,d.x,d.y-245,'text','counter','DÉSARMÉ');event(s,'disarm',a,{target:d.slot,frames:m.disarm});}
 if(!status)return;
 if(status==='drowsy'){if(machine||d.sleepImmune>0)return;d.drowsy=clamp(d.drowsy+(m.potency||25),0,100);d.statuses.drowsy={t:120};event(s,'drowsy',a,{target:d.slot,gauge:d.drowsy});if(d.drowsy>=100){d.hit=Math.max(d.hit,14);d.drowsy=0;d.sleepImmune=180;fx(s,d.x,d.y-245,'text','tranq','ÉTOURDISSEMENT BREF');}return;}
 if(status==='poison'||status==='burn'){if(machine&&status==='poison')return;if(!d.statuses[status])d.statuses[status]={t:Math.min(210,m.duration||120),budget:status==='poison'?240:180};event(s,status,a,{target:d.slot});return;}
 if(status==='shock'){if(d.shockImmune>0)return;d.shockImmune=120;d.hit=clamp(d.hit+6,0,36);d.statuses.shock={t:36};if(machine){d.r=['heat','cost'].includes(d.f.combat.resource.kind)?Math.min(d.f.combat.resource.max,d.r+40):Math.max(0,d.r-40);d.buffs={};event(s,'emp',a,{target:d.slot});fx(s,d.x,d.y-130,'ring','electric','EMP');}else event(s,'shock',a,{target:d.slot});return;}
 if(status==='marked'){d.statuses.marked={t:m.duration||120};delete d.buffs.cloak;return;}
 if(status==='slow'){if(!d.statuses.slow)d.statuses.slow={t:clamp(m.duration||100,30,140)};event(s,'slow',a,{target:d.slot});}
}
function damage(s,a,d,m,{projectile=null,forced=false,scale=1}={}){if(d.life<=0)return {hit:false};const throwing=m.level==='throw';
 if(throwing&&(d.hit>0||d.blockstun>0||!d.onGround||d.throwProtect>0||!a.onGround))return{hit:false};
 if(throwing&&s.frame-d.lastTech<=7){d.throwProtect=a.throwProtect=65;a.hit=d.hit=10;a.attack=d.attack=null;a.vx=-a.face*4;d.vx=a.face*4;event(s,'throwTech',d);fx(s,(a.x+d.x)/2,FLOOR-160,'ring','counter','DÉCHOPE');return{hit:true,teched:true};}
 const frontal=(a.x-d.x)*d.face>=-8;
 if(!forced&&frontal&&canParry(d,m,!!projectile)){
  const par=d.attack.def;d.stats.parries++;d.meter=clamp(d.meter+10+(d.f.combat.passive.parryMeter||0),0,100);
  if(par.restoreOnParry) {d.r=clamp(d.r+par.restoreOnParry,0,d.f.combat.resource.max);}
  if(projectile&&projectile.reflections<1){projectile.owner=d.slot;projectile.vx=-projectile.vx;projectile.face=d.face;projectile.reflections++;projectile.hitTargets={};projectile.damageScale*=.85;projectile.x=d.x+d.face*62;event(s,'reflect',d,{projectile:projectile.id});}
  else{if(projectile)projectile.dead=true;a.hit=32;a.attack=null;a.vx=d.face*7;damage(s,d,a,{...par,kind:'melee',level:'mid',tag:'counter'}, {forced:true});event(s,'parry',d,{target:a.slot});}
  fx(s,d.x,d.y-140,'ring','counter','PARADE');d.attack=null;d.cool=16;return{hit:true,parried:true};
 }
 if(!forced&&projectile&&frontal&&d.buffs.barrier&& !['fire','explosive','rocket'].includes(m.tag)&&!m.fuse){buffHit(d,'barrier');projectile.dead=true;event(s,'barrier',d);fx(s,d.x,d.y-130,'ring','shield','DÉVIÉ');return{hit:true,blocked:true};}
 const blocking=!forced&&d.block&&frontal&&!throwing&&(m.level!=='low'||d.crouch);
 const armor=!forced&&!throwing&&!['electric','emp','rail'].includes(m.tag)&&!!d.buffs.armor;
 const reactive=!forced&&!throwing&&!['electric','emp','rail'].includes(m.tag)&&!!d.buffs.reactive;
 const base=Math.max(0,m.damage||0)*clamp(a.f.power||1,.85,1.18)/clamp(d.f.stats?.defense||1,.8,1.25)*scale*(projectile?.damageScale||1);
 const precision=(m.tag==='precision'||m.tag==='rail')&&(projectile?.steady||a.attack?.steady)?1.15:1;
 const marked=!!d.statuses.marked&&(!!projectile||!!a.f.combat.passive.markMelee&&m.kind==='melee');
 const comboScale=clamp(1-.13*Math.max(0,d.comboHits),.35,1);let amount=Math.round(base*precision*(marked?1.12:1)*(a.buffs.power?1.24:1)*(a.buffs.taunt?1.16:1)*(d.buffs.taunt?1.2:1)*(d.buffs.power?1.08:1)*comboScale);
 if(blocking){amount=Math.max(1,Math.round(amount*.12));d.guard=Math.max(0,d.guard-(m.damage||0)/36);d.blockstun=Math.min(20,6+Math.round((m.damage||0)/170));d.stats.blocked++;event(s,'block',d,{damage:amount,level:m.level,slot:m.slot});if(d.guard<=0){d.hit=28;d.blockstun=0;d.guard=35;d.block=false;event(s,'guardBreak',a);}}
 if(armor){amount=Math.round(amount*.35);buffHit(d,'armor');event(s,'armor',d);}
 if(reactive){amount=Math.round(amount*.42);buffHit(d,'reactive');event(s,'reactive',d);if(Math.abs(a.x-d.x)<150){const rd=Math.min(300,a.life-1);a.life-=rd;a.hit=20;a.attack=null;}}
 if(blocking)amount=Math.min(amount,Math.max(0,d.life-1));else amount=Math.min(amount,d.life);
 d.life-=amount;d.gray=clamp(d.gray+Math.round(amount*.35),0,d.max-d.life);d.lastHit=s.frame;d.steady=false;d.still=0;d.flash=7;
 delete d.buffs.cloak;delete d.buffs.focus;if(marked)delete d.statuses.marked;
 if(!blocking&&!armor&&!reactive){
  d.comboHits++;d.comboQuiet=0;const stun=Math.min(35,throwing?32:14+Math.round(amount/100));d.hit=Math.max(d.hit,stun);d.comboStun+=stun;d.block=false;d.attack=null;d.cool=0;
  d.vx=(projectile?Math.sign(projectile.vx):a.face)*(throwing?8:5);if(m.launch&&d.comboHits<4){d.vy=m.launch;d.onGround=false;}
  if(throwing){d.throwProtect=110;a.throwProtect=Math.max(a.throwProtect,30);d.x=clampX(s,d.x+a.face*48);}
  if(d.comboStun>=105){d.hit=12;d.vx=a.face*14;d.throwProtect=150;d.comboStun=0;event(s,'comboEscape',d);}
  applyStatus(s,a,d,m);
  a.meter=clamp(a.meter+6,0,100);d.meter=clamp(d.meter+4,0,100);
  if(a.f.combat.passive.bladeEnergy&&['blade','knife','tentacle'].includes(m.tag))a.r=clamp(a.r+a.f.combat.passive.bladeEnergy,0,a.f.combat.resource.max);
  if(m.restoreEnergy&&(d.f.combat.passive.machine||d.f.combat.passive.bladeEnergy||d.f.visual?.outfit==='cyborg')){a.r=clamp(a.r+m.restoreEnergy,0,a.f.combat.resource.max);const restored=heal(s,a,m.heal||0,600);event(s,'zandatsu',a,{restored});fx(s,a.x,a.y-220,'ring','electric','ZANDATSU');}
  if(a.attack)a.attack.confirmed=true;
 }
 a.stats.hits++;a.stats.damage+=amount;s.idleTraining=0;fx(s,d.x,d.y-100,blocking?'guard':'hit',m.tag);event(s,'damage',a,{target:d.slot,amount,blocked:blocking,slot:m.slot,tag:m.tag});
 return{hit:true,blocked:blocking,amount};
}
function explode(s,q){if(q.dead)return;q.dead=true;const a=actors(s)[q.owner],d=other(s,a),radius=q.def.radius||90;
 fx(s,q.x,q.y,'blast',q.def.tag,'');event(s,'explosion',a,{id:q.id});
 const hb={x:q.x-radius,y:q.y-radius,w:radius*2,h:radius*2};if(overlap(hb,box(d)))damage(s,a,d,{...q.def,level:'mid'},{scale:q.damageScale||1});
 for(const tr of s.traps)if(tr.owner!==q.owner&&overlap(hb,{x:tr.x-20,y:tr.y-35,w:40,h:35}))tr.dead=true;
}
function spawn(s,p,m,atk,i){const heavy=['rocket','rail','explosive','fire'].includes(m.tag),origin=m.projectileOrigin?.[p.face],nativeOrigin=origin&&Number.isFinite(origin.forward)&&origin.forward>=0&&origin.forward<=220&&Number.isFinite(origin.height)&&origin.height>0&&origin.height<=330;const q={id:s.nextId++,owner:p.slot,
 x:p.x+p.face*(nativeOrigin?origin.forward:52),y:p.y-(nativeOrigin?origin.height:m.height||Math.min(145,box(p).h*.75)),vx:p.face*(m.speed||15),vy:m.vy||0,
 def:m,damageScale:1,life:m.life||80,delay:i*(m.interval||0),age:0,kind:m.fuse?'grenade':m.tag==='psychic'?'orb':m.tag,
 distance:0,range:Math.max(1,m.reach||1200),face:p.face,reflections:0,bounces:m.bounces||0,returned:false,dead:false,hitTargets:{},steady:atk.steady,
 burstId:atk.id,hitMax:m.returnAt?2:1};
 s.projectiles.push(q);event(s,'projectile',p,{id:q.id,slot:m.slot,index:i});if(s.projectiles.length>60)s.projectiles.shift();return q;}
function activate(s,p,a){if(a.activated)return;a.activated=true;p.stats.activations++;p.lastActivation=a.name;const d=a.def,o=other(s,p);event(s,'activate',p,{slot:a.name,kind:d.kind,name:d.name});
 if(d.kind==='projectile'){for(let i=0;i<(d.count||1);i++)spawn(s,p,d,a,i);}
 if(d.kind==='trap'||d.kind==='stationaryMine'){if(d.kind==='stationaryMine'&&((o.still||0)<(d.requiresStillFrames||60)||!o.onGround||o.buffs.cloak)){p.feedback='AUCUN ARRÊT VISIBLE ASSEZ LONG';p.feedbackT=70;event(s,'mineMiss',p);return;}
  const owned=s.traps.filter(t=>t.owner===p.slot&&!t.dead);while(owned.length>=(d.maxTraps||2)){owned.shift().dead=true;}
  s.traps.push({id:s.nextId++,owner:p.slot,x:clampX(s,d.kind==='stationaryMine'?o.x:p.x+p.face*(Math.min(d.reach||70,150))),y:FLOOR,age:0,life:d.duration||360,arm:d.arm||40,hp:d.hp||160,def:d,dead:false});
  event(s,'trapPlaced',p,{slot:a.name,targetPosition:d.kind==='stationaryMine'?o.x:null,arm:d.arm||40});
 }
 if(d.kind==='recallTrap'){let recalled=0;for(const tr of s.traps)if(tr.owner===p.slot&&!tr.dead&&Math.abs(tr.x-p.x)<=(d.reach||240)){tr.dead=true;recalled++;}p.feedback=recalled?'LEURRE RAPPELÉ':'AUCUN LEURRE À PORTÉE';p.feedbackT=65;event(s,'trapRecall',p,{recalled,reach:d.reach||240});}
 if(d.kind==='observe'){const trace=p.visibleTrace;if(trace&&s.frame-trace.frame<=2&&Math.abs(trace.x-p.x)<=(d.reach||380)&&!o.buffs.cloak){p.observedTrace={...trace};p.buffs.optic={t:d.duration||120,hits:1};o.statuses.marked={t:d.duration||120};p.feedback='TRACE VISIBLE MÉMORISÉE';p.feedbackT=75;fx(s,o.x,o.y-245,'text','recon','TRACE OBSERVÉE');event(s,'observe',p,{target:o.slot,sample:{...trace}});}else{p.feedback='AUCUNE TRACE VISIBLE À PORTÉE';p.feedbackT=75;event(s,'observeMiss',p);}}
 if(d.kind==='detonate'){for(const tr of s.traps)if(tr.owner===p.slot&&!tr.dead&&tr.age>=tr.arm){explode(s,{...tr,def:{...tr.def,radius:tr.def.reach||90}});tr.dead=true;}event(s,'detonator',p);}
 if(d.kind==='buff'){const target=d.target==='enemy'?o:p;if(d.target!=='enemy'||Math.abs(o.x-p.x)<(d.reach||600)){target.buffs[d.buff]={t:d.duration||120,hits:d.hits||1};fx(s,target.x,target.y-120,'ring',d.tag,d.buff==='cloak'?'CAMOUFLAGE':d.buff==='power'?'SURCHARGE':d.buff==='taunt'?'PROVOQUÉ':d.name);event(s,'buff:'+d.buff,p,{target:target.slot});}}
 if(d.kind==='heal'){const amount=heal(s,p,d.heal||250);fx(s,p.x,p.y-245,'text','recovery',amount?'+'+amount+' RÉCUPÉRABLE':'AUCUNE BLESSURE RÉCUPÉRABLE');}
 if(d.kind==='mark'){if(Math.abs(o.x-p.x)<(d.reach||600)){o.statuses.marked={t:d.duration||180};delete o.buffs.cloak;fx(s,o.x,o.y-250,'text','recon','MARQUÉ');event(s,'mark',p,{target:o.slot});}}
 if(d.kind==='reload'){p.r=p.f.combat.resource.max;fx(s,p.x,p.y-245,'text','reload','RECHARGÉ');event(s,'reload',p);}
 if(d.kind==='recover'){const r=p.f.combat.resource;p.r=clamp(p.r+(['heat','cost'].includes(r.kind)?-1:1)*(d.restore||28),0,r.max);event(s,'recover',p);}
 if(d.kind==='mobility'){
  if(d.blink){p.x=clampX(s,p.x+p.face*d.blink);event(s,'reposition',p);fx(s,p.x,p.y-70,'ring','psychic');}
 }
 if(d.launchSelf&&p.onGround){p.vy=d.launchSelf;p.onGround=false;}
 if(d.selfDamage){p.life=Math.max(1,p.life-d.selfDamage);p.gray=Math.min(p.gray,p.max-p.life);event(s,'selfDamage',p,{amount:d.selfDamage});}
}
function prepare(s,p,input){const o=other(s,p);if(!p.attack)p.face=o.x>=p.x?1:-1;
 p.crouch=!!input.down&&p.onGround&&!p.attack;p.block=!!input.guard&&!p.attack&&!p.hit;
 if(input.tech||input.slot==='throw')p.lastTech=s.frame;
 if(p.hit||p.blockstun){p.state=p.hit?'hit':'guard';return;}
 if(input.slot)start(s,p,input.slot);
 if(p.attack){p.state='attack';p.block=false;return;}
 if(input.jump&&p.onGround){p.vy=-12.6*(p.f.stats?.jump||1);p.onGround=false;p.crouch=false;p.block=false;event(s,'jump',p);}
 const dir=(input.right?1:0)-(input.left?1:0);const slowed=p.statuses.slow||p.statuses.drowsy;
 if(p.onGround&&input.dash&&!p.cool){p.vx=((input.right?1:0)-(input.left?1:0)||p.face)*10*clamp(p.f.speed||1,.8,1.15);p.cool=14;event(s,'dash',p);}
 else if(!p.cool)p.vx=p.block?dir*1.2:dir*4.4*clamp(p.f.speed||1,.78,1.2)*(slowed?.68:1)*(p.crouch?.4:1);
 p.state=!p.onGround?'jump':p.block?'guard':p.crouch?'crouch':Math.abs(p.vx)>1?'walk':'idle';
}
function upkeep(s,p){for(const k of ['hit','blockstun','cool','flash','throwProtect','shockImmune','sleepImmune','resourceDelay','feedbackT'])p[k]=Math.max(0,(p[k]||0)-1);
 for(const k of Object.keys(p.cooldowns))p.cooldowns[k]=Math.max(0,p.cooldowns[k]-1);
 for(const [k,b] of Object.entries(p.buffs)){if(--b.t<=0)delete p.buffs[k];}
 for(const [k,v] of Object.entries(p.statuses)){
  if((k==='poison'||k==='burn')&&s.frame%6===0&&v.budget>0){const n=Math.min(k==='poison'?7:9,v.budget,p.life-1);if(n>0){p.life-=n;v.budget-=n;event(s,'dot',p,{amount:n,status:k});}}
  if(--v.t<=0)delete p.statuses[k];
 }
 if(!p.statuses.drowsy)p.drowsy=Math.max(0,p.drowsy-.24);
 const r=p.f.combat.resource,pa=p.f.combat.passive;
 if(p.resourceDelay<=0&&!p.attack){const sign=['heat','cost'].includes(r.kind)?-1:1;if(r.kind!=='ammo')p.r=clamp(p.r+sign*r.regen,0,r.max);}
 if(!p.hit&&!p.blockstun&&!p.attack&&!p.block&&s.frame-p.lastHit>90)p.guard=clamp(p.guard+(pa.guardRegen||.12),0,100);
 if(Math.abs(p.vx)<.2&&p.onGround&&!p.hit&&!p.attack){p.still++;if(pa.steady&&p.still>=36)p.steady=true;}else if(Math.abs(p.vx)>=.2||!p.onGround){p.still=0;p.steady=false;delete p.buffs.focus;}
 if(pa.regenGray&&s.frame-p.lastHit>180&&s.frame-p.lastOffense>180&&!p.attack&&!p.hit&&(!pa.stationaryRegen||p.still>180))heal(s,p,pa.regenGray,pa.regenBudget);
 if(!p.attack){p.chainQuiet++;if(p.chainQuiet>20)p.chainDepth=0;}else p.chainQuiet=0;
 if(!p.hit&&!p.blockstun){p.comboQuiet++;if(p.comboQuiet>40){p.comboHits=0;p.comboStun=0;}}
 if(s.options.training){if(s.options.freeMeter)p.meter=100;if(s.options.freeResource)p.r=['heat','cost'].includes(r.kind)?0:r.max;}
}
function action(s,p){const a=p.attack;if(!a)return;const d=a.def;a.t++;
 if(a.t===d.startup)activate(s,p,a);
 if(inActive(a)){
  if(d.travel&&!p.hit)p.x=clampX(s,p.x+p.face*d.travel);
  if(d.kind==='mobility')p.state='walk';
 }
 if(a.t>=d.startup+d.active+d.recovery){p.attack=null;p.state='idle';}
}
function projectileStep(s){for(const q of s.projectiles){if(q.dead)continue;if(q.delay>0){q.delay--;continue;}q.age++;q.life--;
 const m=q.def,a=actors(s)[q.owner],d=other(s,a);const distance=Math.hypot(q.vx,q.vy),remaining=Math.max(0,q.range-q.distance),fraction=distance>0?Math.min(1,remaining/distance):1;const stepX=q.vx*fraction,stepY=q.vy*fraction;q.x+=stepX;q.y+=stepY;q.distance+=Math.hypot(stepX,stepY);
 if(m.gravity)q.vy+=m.gravity;
 if(m.homing&&!d.buffs.cloak){const targetY=d.y-Math.min(box(d).h*.55,140),max=m.homing;q.vy=clamp(q.vy+clamp((targetY-q.y)*.001,-max,max),-3.6,3.6);}
 if(m.returnAt&&q.age>=m.returnAt&&!q.returned){q.vx=-q.vx;q.returned=true;event(s,'return',a,{id:q.id});}
 if(m.gravity&&q.y>=FLOOR-10){q.y=FLOOR-10;q.vy=-Math.abs(q.vy)*.46;q.vx*=.7;}
 if(m.fuse){if(q.age>=m.fuse){explode(s,q);continue;}}
 else{
  // Swept segment prevents a fast bullet skipping a narrow drone.
  const r={x:Math.min(q.x,q.x-stepX)-8,y:Math.min(q.y,q.y-stepY)-7,w:Math.abs(stepX)+16,h:Math.abs(stepY)+14};
  if(overlap(r,box(d))&&!q.hitTargets[d.slot]){
   const ret=damage(s,a,d,m,{projectile:q});
   if(!ret.parried){q.hitTargets[d.slot]=q.returned?'return':'out';if(!m.returnAt||q.returned)q.dead=true;}
  }else if(m.returnAt&&q.returned&&q.hitTargets[d.slot]==='out'&&Math.abs(q.x-d.x)>90){delete q.hitTargets[d.slot];}
 }
 if(q.x<bounds(s).left-35||q.x>bounds(s).right+35){if(q.bounces>0){q.vx=-q.vx;q.bounces--;q.x=clamp(q.x,bounds(s).left-35,bounds(s).right+35);event(s,'ricochet',a,{id:q.id});}else if(!m.returnAt||q.returned)q.dead=true;}
 if(q.distance>=q.range&&!m.fuse)q.dead=true;
 if(q.life<=0){if(m.fuse)explode(s,q);else q.dead=true;}if(q.y>FLOOR+100||q.y<-140)q.dead=true;
 }
 s.projectiles=s.projectiles.filter(q=>!q.dead);
}
function objectsStep(s){for(const tr of s.traps){if(tr.dead)continue;tr.age++;tr.life--;const a=actors(s)[tr.owner],d=other(s,a);
 if(tr.life<=0){tr.dead=true;continue;}if(tr.age<tr.arm)continue;
 if(!tr.def.remoteOnly&&(tr.def.tag==='wire'?overlap({x:tr.x-(tr.def.reach||150),y:FLOOR-155,w:2*(tr.def.reach||150),h:5},box(d)):Math.abs(tr.x-d.x)<(tr.def.reach||90)&&d.y>FLOOR-95)){const result=damage(s,a,d,{...tr.def,level:tr.def.tag==='wire'?'high':tr.def.tag==='snare'?'low':'mid'});if(result.hit){tr.dead=true;fx(s,tr.x,FLOOR-30,'blast',tr.def.tag);event(s,'trapTrigger',a);}}
 }s.traps=s.traps.filter(t=>!t.dead);}
function destroyObjects(s,p,hb,m){for(const tr of s.traps)if(tr.owner!==p.slot&&!tr.dead&&overlap(hb,{x:tr.x-22,y:tr.y-60,w:44,h:60})){tr.hp-=Math.max(140,m.damage);if(tr.hp<=0){tr.dead=true;event(s,'trapDestroyed',p);fx(s,tr.x,tr.y-30,'hit',tr.def.tag);}}
 for(const q of s.projectiles)if(q.owner!==p.slot&&!q.dead&&q.delay<=0&&overlap(hb,{x:q.x-16,y:q.y-12,w:32,h:24})&& !['rail','laser'].includes(q.def.tag)){q.dead=true;event(s,'projectileDestroyed',p);fx(s,q.x,q.y,'ring','counter');}
}
function roundEnd(s,winner){s.phase='roundEnd';s.phaseT=90;s.roundWinner=winner;if(winner>=0)actors(s)[winner].wins++;s.projectiles=[];s.traps=[];event(s,'roundEnd',winner<0?null:actors(s)[winner],{winner});}
function step(s,inputs=[empty(),empty()]){if(s.finished)return s;
 s.frame++;s.fx.forEach(x=>x.t--);s.fx=s.fx.filter(x=>x.t>0);
 if(s.phase==='intro'){if(--s.phaseT<=0)s.phase='fight';return s;}
 if(s.phase==='roundEnd'){if(--s.phaseT<=0){if(s.a.wins>=s.rounds||s.b.wins>=s.rounds){s.finished=true;s.winner=s.a.wins>s.b.wins?0:1;event(s,'matchEnd',actors(s)[s.winner]);}else{s.round++;reset(s);}}return s;}
 if(s.phase!=='fight')return s;
 if(!s.options.training&&s.timerStart>0)s.timer=Math.max(0,s.timer-1);
 const ps=actors(s);ps.forEach(p=>upkeep(s,p));for(const p of ps)if(p.f.combat.passive.observeMovement){const o=other(s,p),old=p.visibleTrace;if(!o.buffs.cloak&&Math.abs(o.x-p.x)<=380)p.visibleTrace={frame:s.frame-1,x:o.x,y:o.y,dx:old?o.x-old.x:0,dy:old?o.y-old.y:0};else p.visibleTrace=null;}ps.forEach((p,i)=>prepare(s,p,inputs[i]||empty()));ps.forEach(p=>action(s,p));
 for(const p of ps){if(p.hit||p.blockstun||p.cool)p.vx*=.82;p.x=clampX(s,p.x+p.vx);if(!p.onGround)p.vy+=.72;p.y+=p.vy;if(p.y>=FLOOR){p.y=FLOOR;p.vy=0;p.onGround=true;}else p.onGround=false;}
 const minGap=(box(s.a).w+box(s.b).w)*.30,gap=Math.abs(s.a.x-s.b.x);if(gap<minGap&&Math.abs(s.a.y-s.b.y)<110){const dir=s.a.x<=s.b.x?-1:1;const shift=(minGap-gap)/2;s.a.x=clampX(s,s.a.x+dir*shift);s.b.x=clampX(s,s.b.x-dir*shift);const shortfall=minGap-Math.abs(s.a.x-s.b.x);if(shortfall>0){if(s.a.x===bounds(s).left||s.a.x===bounds(s).right)s.b.x=clampX(s,s.b.x-dir*shortfall);else s.a.x=clampX(s,s.a.x+dir*shortfall);}}
 // Collect before applying damage, allowing genuinely simultaneous active frames.
 const pending=[];for(const p of ps){const hb=hitbox(p),a=p.attack;if(!hb||!a||a.hit)continue;destroyObjects(s,p,hb,a.def);const o=other(s,p);if(overlap(hb,box(o))){pending.push({p,o,a});}}
 for(const {p,o,a} of pending){const hit=damage(s,p,o,a.def);if(hit.hit){a.hit=true;a.confirmed=!hit.blocked&&!hit.parried;}}
 projectileStep(s);objectsStep(s);for(const p of ps)p.projectiles=s.projectiles.filter(q=>q.owner===p.slot&&!q.dead);
 if(s.options.training){s.idleTraining++;for(const p of ps)p.life=Math.max(1,p.life);if(s.options.autoheal&&s.idleTraining>=150){for(const p of ps){p.life=p.max;p.gray=0;p.guard=100;p.statuses={};}s.idleTraining=0;}}
 else if(s.a.life<=0||s.b.life<=0)roundEnd(s,s.a.life===s.b.life?-1:s.a.life>s.b.life?0:1);
 else if(s.timerStart>0&&s.timer<=0){const a=s.a.life/s.a.max,b=s.b.life/s.b.max;roundEnd(s,Math.abs(a-b)<1e-9?-1:a>b?0:1);}
 return s;
}
function cpu(s,p,o){const i=empty(),d=Math.abs(o.x-p.x),dir=o.x>p.x?1:-1;if(p.hit||p.blockstun)return i;
 if(p.cpuGuard>0){p.cpuGuard--;i.guard=true;i.down=!!p.cpuLow;return i;}
 if(p.attack)return i;
 // Only reacts to visible committed startup, never future player inputs.
 if(o.attack&&o.attack.t>5&&d<270&&rand(s)<.075){p.cpuGuard=16+Math.floor(rand(s)*18);p.cpuLow=o.attack.def.level==='low';i.guard=true;i.down=p.cpuLow;return i;}
 if(p.cpuWait>0){p.cpuWait--;if(d>230){i.left=dir<0;i.right=dir>0;}return i;}
 p.cpuWait=8+Math.floor(rand(s)*17);
 const r=p.f.combat.resource;if((r.kind==='ammo'&&p.r<2)||(['heat','cost'].includes(r.kind)&&p.r>75)||(!['heat','cost','ammo'].includes(r.kind)&&p.r<15)){if(d>170&&['reload','recover'].includes(p.f.combat.moves.utility.kind)){i.slot='utility';return i;}}
 const candidates=Object.values(p.f.combat.moves).filter(m=>m.slot!=='utility'&&costAllowed(p,m)&&p.meter>=m.meter&&!p.cooldowns[m.slot]).filter(m=>{
  if(m.level==='throw')return d<85&&o.onGround&&!o.hit&&!o.throwProtect;
  if(m.kind==='melee')return d<(m.reach||100)+(m.travel?100:15);
  if(m.kind==='parry')return d<190||s.projectiles.some(q=>q.owner!==p.slot&&Math.abs(q.x-p.x)<260);
  if(m.kind==='heal')return p.gray>150&&d>240;
  if(m.kind==='projectile')return d>150;
  if(m.kind==='observe')return d<=380&&!o.buffs.cloak;if(m.kind==='recallTrap')return s.traps.some(t=>t.owner===p.slot&&!t.dead&&Math.abs(t.x-p.x)<=m.reach);if(m.kind==='stationaryMine')return o.still>=(m.requiresStillFrames||60)&&o.onGround&&!o.buffs.cloak;if(m.kind==='detonate')return s.traps.some(t=>t.owner===p.slot&&t.age>=t.arm&&Math.abs(t.x-o.x)<130);
  if(m.kind==='buff')return !p.buffs[m.buff]&&d>210;
  return true;
 });
 if(candidates.length&&rand(s)<.83)i.slot=candidates[Math.floor(rand(s)*candidates.length)].slot;
 if(!i.slot&&d>100){i.left=dir<0;i.right=dir>0;}if(rand(s)<.06)i.jump=true;return i;
}
function directionSlot(held,face){if(held.down)return'specialDown';const dir=(held.right?1:0)-(held.left?1:0);return dir===face?'specialForward':dir===-face?'specialBack':'special';}
const api={version:'0.48',FPS:60,FLOOR,SLOTS,slotName,create,step,start,reset,box,hitbox,overlap,empty,cpu,directionSlot,costAllowed,damage,heal,explode};
return api;
})();

export const getHurtbox = actor => CQCCombat.box(actor);
export const getHitbox = actor => CQCCombat.hitbox(actor);
export const bodyBox = getHurtbox;
export const hitbox = getHitbox;

const clampNumber = (value, fallback, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const clone = value => JSON.parse(JSON.stringify(value));
const emptyHeld = () => ({ left: false, right: false, down: false, guard: false, tech: false });
const pulseKeys = [...ACTIONS, 'grab', 'jump', 'dash', 'tech'];
const supportedKinds = new Set(['melee', 'projectile', 'parry', 'mobility', 'trap', 'buff', 'heal', 'recover', 'reload', 'mark', 'observe', 'detonate', 'stationaryMine', 'recallTrap']);

/** Accepts an authored CQC profile or the lighter {stats,moves} authoring form. */
export function normalizeFighter(definition = {}, index = 0) {
  const source = clone(definition);
  const id = source.id || source.uid || `fighter-${index + 1}`;
  const authored = source.combat || {};
  const authoredMoves = authored.moves || source.moves || {};
  const moves = {};
  for (const slot of ACTIONS) {
    const supplied = authoredMoves[slot] || (slot === 'throw' ? authoredMoves.grab : null) || {};
    const move = { ...BASE_MOVES[slot], ...supplied, slot, id: supplied.id || `${id}::${slot}` };
    if (!supportedKinds.has(move.kind)) throw new TypeError(`Unsupported move kind: ${id}.${slot}.${move.kind}`);
    for (const [field, fallback, min, max] of [
      ['startup', BASE_MOVES[slot].startup, 1, 180], ['active', BASE_MOVES[slot].active, 1, 180],
      ['recovery', BASE_MOVES[slot].recovery, 1, 240], ['damage', BASE_MOVES[slot].damage, 0, 5000],
      ['reach', BASE_MOVES[slot].reach, 0, 1400], ['cost', 0, 0, 100], ['meter', 0, 0, 100],
      ['cooldown', 0, 0, 1200],
    ]) move[field] = clampNumber(move[field], fallback, min, max);
    for (const field of ['startup', 'active', 'recovery', 'cooldown']) move[field] = Math.round(move[field]);
    if (move.kind === 'projectile') {
      move.speed = clampNumber(move.speed, 15, 1, 90);
      move.life = Math.round(clampNumber(move.life, 80, 1, 300));
      move.count = Math.round(clampNumber(move.count, 1, 1, 8));
      move.interval = Math.round(clampNumber(move.interval, 0, 0, 60));
      move.height = clampNumber(move.height, 140, 10, 340);
    }
    moves[slot] = move;
  }
  const stats = source.stats || {};
  const health = clampNumber(stats.health, 10000, 1000, 20000);
  const speed = clampNumber(source.speed ?? stats.speed, 1, 0.78, 1.2);
  const power = clampNumber(source.power ?? stats.power, 1, 0.85, 1.18);
  const body = authored.simulationBody || source.body || {};
  const height = clampNumber(body.height, 230, 70, 350);
  const resource = { kind: 'energy', label: 'STABILITÉ', max: 100, regen: 0.15, ...authored.resource };
  resource.max = clampNumber(resource.max, 100, 1, 1000);
  resource.regen = clampNumber(resource.regen, 0.15, 0, 2);
  return {
    ...source, id, uid: source.uid || id, name: source.name || id, speed, power,
    reach: clampNumber(source.reach, 1, 0.85, 1.25),
    stats: { ...stats, health, speed, power, jump: clampNumber(stats.jump > 3 ? stats.jump / 12.6 : stats.jump, 1, 0.65, 1.35), defense: clampNumber(stats.defense, 1, 0.8, 1.25) },
    combat: {
      ...authored, key: authored.key || id, resource, passive: { ...authored.passive },
      simulationBody: { width: clampNumber(body.width, 78, 24, 600), height, crouchHeight: clampNumber(body.crouchHeight, height * 0.53, 35, height) },
      links: Array.isArray(authored.links) ? authored.links : [['light', 'heavy'], ['low', 'special']], moves,
    },
    moves,
  };
}

function aliasActor(actor) {
  // Getters keep the renderer's friendly names synchronized with the source core.
  const aliases = { hp: 'life', maxHp: 'max', facing: 'face', def: 'f', definition: 'f', stun: 'hit' };
  for (const [name, field] of Object.entries(aliases)) Object.defineProperty(actor, name, {
    configurable: true, enumerable: false, get: () => actor[field], set: value => { actor[field] = value; },
  });
  for (const [name, get] of Object.entries({
    id: () => actor.f.id, action: () => actor.attack?.name || actor.state,
    actionFrame: () => actor.attack?.t || 0, combo: () => actor.comboHits,
    actionPhase: () => !actor.attack ? null : actor.attack.t < actor.attack.def.startup ? 'startup'
      : actor.attack.t < actor.attack.def.startup + actor.attack.def.active ? 'active' : 'recovery',
  })) Object.defineProperty(actor, name, { configurable: true, enumerable: false, get });
}

/**
 * Fixed-step adapter used identically by CainOS and the standalone.
 * Native inputs: {left,right,down,guard,jump,dash,tech,slot}.
 * Friendly aliases: crouch/block and light/heavy/special/grab/super booleans.
 * Booleans are edge-triggered; explicit `slot` is one request per step call.
 * At 120+ rendering Hz a brief input is retained until the next simulation tick.
 */
export class CombatEngine {
  constructor(options = {}) {
    const definitions = options.fighters || [{ id: 'pomni', name: 'Pomni' }, { id: 'jax', name: 'Jax' }];
    if (!Array.isArray(definitions) || definitions.length !== 2) throw new TypeError('Exactly two fighter definitions are required.');
    this.config = {
      ...options,
      fighters: definitions.map(normalizeFighter),
      seed: (Number(options.seed ?? 987654321) >>> 0) || 987654321,
      roundsToWin: Math.round(clampNumber(options.roundsToWin ?? options.rounds, 2, 1, 5)),
      roundTime: clampNumber(options.roundTime ?? options.seconds, 90, 0, 300),
      difficulty: ['easy', 'normal', 'hard'].includes(options.difficulty) ? options.difficulty : 'normal',
      cpu: Array.isArray(options.cpu) ? [!!options.cpu[0], !!options.cpu[1]] : [false, options.mode !== 'local' && options.mode !== 'training'],
      mode: options.mode || 'versus',
    };
    this.stage = options.stage || { id: 'big-top', name: 'Le Grand Chapiteau' };
    this._paused = false;
    this._accumulator = 0;
    this._held = [emptyHeld(), emptyHeld()];
    this._previous = [{}, {}];
    this._pending = [{}, {}];
    this.reset();
  }

  reset(overrides = {}) {
    if (Object.keys(overrides).length) {
      const replacement = new CombatEngine({ ...this.config, stage: this.stage, ...overrides });
      Object.assign(this, replacement);
      return this.state;
    }
    const training = this.config.mode === 'training';
    this._native = CQCCombat.create(...this.config.fighters, {
      seed: this.config.seed, seconds: this.config.roundTime, rounds: this.config.roundsToWin,
      training, skipIntro: !!this.config.skipIntro,
      dummy: this.config.trainingDummy || this.config.dummy || 'idle',
      autoheal: this.config.autoheal ?? training,
      freeMeter: this.config.freeMeter ?? training,
      freeResource: this.config.freeResource ?? training,
    });
    this._native.options.bounds = this._stageBounds();
    this._positionRound();
    this._native.a.ai = this.config.cpu[0];
    this._native.b.ai = this.config.cpu[1];
    this._paused = false;
    this._clearInputs();
    return this.state;
  }

  _stageBounds() {
    const raw = this.stage.bounds || {};
    const left = clampNumber(raw.left, ARENA.left, 32, 800);
    return { left, right: Math.max(left + 320, clampNumber(raw.right, ARENA.right, 352, 1248)) };
  }

  _positionRound() {
    const { left, right } = this._native.options.bounds;
    const mid = (left + right) / 2;
    const halfGap = Math.min(260, (right - left) * 0.27);
    this._native.a.x = mid - halfGap;
    this._native.b.x = mid + halfGap;
    aliasActor(this._native.a);
    aliasActor(this._native.b);
  }

  _clearInputs() {
    this._accumulator = 0;
    this._held = [emptyHeld(), emptyHeld()];
    this._previous = [{}, {}];
    this._pending = [{}, {}];
  }

  get paused() { return this._paused; }
  get state() {
    const s = this._native;
    return {
      ...s, a: s.a, b: s.b, fighters: [s.a, s.b],
      phase: s.finished ? 'matchOver' : s.phase === 'roundEnd' ? 'roundOver' : s.phase,
      timer: s.timerStart === 0 ? Infinity : s.timer / 60, timerFrames: s.timer,
      roundTime: this.config.roundTime, round: s.round, wins: [s.a.wins, s.b.wins],
      roundsToWin: s.rounds, winner: s.winner, roundWinner: s.roundWinner,
      introRemaining: Math.max(0, s.phaseT / 60), stage: this.stage,
      paused: this._paused, width: ARENA.width, height: ARENA.height, groundY: ARENA.floor,
      bounds: s.options.bounds,
    };
  }

  pause(value = true) {
    this._paused = !!value;
    this._clearInputs();
    return this.state;
  }

  nextRound() {
    if (this._native.finished || this._native.phase !== 'roundEnd') return false;
    this._native.round++;
    CQCCombat.reset(this._native, { keepWins: true });
    this._positionRound();
    this._clearInputs();
    return true;
  }

  setTraining(settings = {}) {
    if (!this._native.options.training) return false;
    const dummy = settings.dummy || settings.trainingDummy;
    if (['idle', 'block', 'guard', 'jump', 'cpu', 'after', 'crouch'].includes(dummy)) this._native.options.dummy = dummy;
    for (const key of ['autoheal', 'freeMeter', 'freeResource']) {
      if (typeof settings[key] === 'boolean') this._native.options[key] = settings[key];
    }
    return true;
  }

  box(actor) { return CQCCombat.box(typeof actor === 'number' ? this.state.fighters[actor] : actor); }
  hitbox(actor) { return CQCCombat.hitbox(typeof actor === 'number' ? this.state.fighters[actor] : actor); }

  _sample(inputs) {
    for (let index = 0; index < 2; index++) {
      const input = inputs[index] || {};
      this._held[index] = {
        left: !!input.left, right: !!input.right,
        down: !!(input.down || input.crouch), guard: !!(input.guard || input.block), tech: false,
      };
      for (const key of pulseKeys) {
        // InputController and replay frames always supply `slot`, including
        // null. Their jump/dash/tech signals are already per-frame edges.
        // Respect consecutive native pulses (e.g. around an unrecorded pause)
        // while preserving hold protection for the friendly boolean API.
        const nativePulse = Object.hasOwn(input, 'slot') && ['jump', 'dash', 'tech'].includes(key);
        if (input[key] && (nativePulse || !this._previous[index][key])) this._pending[index][key] = true;
        this._previous[index][key] = !!input[key];
      }
      if (ACTIONS.includes(input.slot)) this._pending[index].slot = input.slot;
      if (input.slot === 'grab') this._pending[index].slot = 'throw';
    }
  }

  _playerInput(index) {
    const input = { ...CQCCombat.empty(), ...this._held[index] };
    const pending = this._pending[index];
    input.jump = !!pending.jump;
    input.dash = !!pending.dash;
    input.tech = !!pending.tech;
    input.slot = pending.slot || null;
    if (!input.slot) {
      // A super/throw has priority when multiple action buttons arrive together.
      for (const key of ['super', 'throw', 'grab', 'utility', 'specialDown', 'specialForward', 'specialBack', 'special', 'heavy', 'low', 'light']) {
        if (!pending[key]) continue;
        input.slot = key === 'grab' ? 'throw'
          : key === 'light' && input.down ? 'low'
            : key === 'special' ? CQCCombat.directionSlot(input, this.state.fighters[index].face) : key;
        break;
      }
    }
    this._pending[index] = {};
    return input;
  }

  _cpuInput(index) {
    const s = this._native, actor = index ? s.b : s.a, opponent = index ? s.a : s.b;
    const beforeWait = actor.cpuWait;
    const input = CQCCombat.cpu(s, actor, opponent);
    if (beforeWait <= 0 && actor.cpuWait > 0) {
      const factor = this.config.difficulty === 'easy' ? 1.6 : this.config.difficulty === 'hard' ? 0.65 : 1;
      actor.cpuWait = Math.max(3, Math.round(actor.cpuWait * factor));
    }
    // Upstream CQC's Pass10 expired-decision correction.
    if (actor.cpuWait === 0) actor.cpuWait = -1;
    return input;
  }

  _dummyInput() {
    const options = this._native.options, actor = this._native.b;
    if (options.dummy === 'cpu') return this._cpuInput(1);
    const input = CQCCombat.empty();
    if (options.dummy === 'block' || options.dummy === 'guard') input.guard = true;
    if (options.dummy === 'after' && this._native.frame - actor.lastHit < 180) input.guard = true;
    if (options.dummy === 'crouch') { input.guard = true; input.down = true; }
    if (options.dummy === 'jump') input.jump = actor.onGround;
    return input;
  }

  _tick() {
    const s = this._native;
    if (s.finished || s.phase === 'roundEnd') return;
    const inputs = [this._playerInput(0), this._playerInput(1)];
    if (s.phase === 'fight') {
      for (let i = 0; i < 2; i++) if (this.config.cpu[i]) inputs[i] = this._cpuInput(i);
      if (s.options.training) inputs[1] = this._dummyInput();
    }
    CQCCombat.step(s, inputs);
    const bounds = s.options.bounds;
    for (const actor of [s.a, s.b]) actor.x = Math.max(bounds.left, Math.min(bounds.right, actor.x));
    for (const projectile of s.projectiles) {
      if (projectile.x < bounds.left - 35 || projectile.x > bounds.right + 35) projectile.dead = true;
    }
    s.projectiles = s.projectiles.filter(q => !q.dead);
    if (s.phase === 'roundEnd' && (s.a.wins >= s.rounds || s.b.wins >= s.rounds)) {
      s.finished = true;
      s.winner = s.a.wins > s.b.wins ? 0 : 1;
      s.events.push({ frame: s.frame, type: 'matchEnd', actor: s.winner, winner: s.winner });
      s.metrics.matchEnd = (s.metrics.matchEnd || 0) + 1;
    }
  }

  step(dt = FIXED_DT, inputs = [{}, {}]) {
    if (this._paused || this._native.finished || !Number.isFinite(dt) || dt < 0) return this.state;
    this._sample(Array.isArray(inputs) ? inputs : [inputs, {}]);
    // Background-tab stalls cannot turn into minutes of uncontrolled simulation.
    this._accumulator += Math.min(dt, 0.25);
    while (this._accumulator + 1e-10 >= FIXED_DT) {
      this._accumulator = Math.max(0, this._accumulator - FIXED_DT);
      this._tick();
    }
    return this.state;
  }

  drainEvents() {
    const events = this._native.events.slice();
    this._native.events.length = 0;
    return events;
  }

  /** Serializable deterministic frame state (wall-clock remainder is omitted). */
  getSnapshot() {
    const s = this._native;
    return clone({
      version: 1, source: SOURCE.commit, seed: s.seed, frame: s.frame,
      phase: this.state.phase, round: s.round, timerFrames: s.timer,
      wins: [s.a.wins, s.b.wins], winner: s.winner, roundWinner: s.roundWinner,
      fighters: [s.a, s.b].map(p => ({
        id: p.f.id, x: p.x, y: p.y, vx: p.vx, vy: p.vy, face: p.face,
        hp: p.life, maxHp: p.max, gray: p.gray, guard: p.guard, meter: p.meter,
        resource: p.r, state: p.state, onGround: p.onGround, block: p.block,
        crouch: p.crouch, hit: p.hit, blockstun: p.blockstun, cool: p.cool,
        attack: p.attack && { slot: p.attack.name, frame: p.attack.t, id: p.attack.id, hit: p.attack.hit, confirmed: p.attack.confirmed },
        buffs: p.buffs, statuses: p.statuses, cooldowns: p.cooldowns,
        combo: p.comboHits, comboStun: p.comboStun, throwProtect: p.throwProtect,
        stats: p.stats, cpuWait: p.cpuWait, cpuGuard: p.cpuGuard,
      })),
      projectiles: s.projectiles.map(q => ({ id: q.id, owner: q.owner, x: q.x, y: q.y, vx: q.vx, vy: q.vy, age: q.age, life: q.life, distance: q.distance, delay: q.delay, reflections: q.reflections, slot: q.def.slot })),
      traps: s.traps.map(t => ({ id: t.id, owner: t.owner, x: t.x, age: t.age, life: t.life, arm: t.arm, hp: t.hp, slot: t.def.slot })),
      metrics: s.metrics,
    });
  }
}

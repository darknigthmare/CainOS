import { sampleFinisherPresentation } from './finishers.mjs';

/**
 * Forty-two theatrical endings, built from the existing character artwork.
 * Props are original Encore staging, not new canonical powers or drawn fight poses.
 * Sampling, camera composition and actor copies never modify the combat state.
 */
const TAU = Math.PI * 2;
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const COLORS = ['#d987be', '#e4c876', '#94cbbb', '#929ce0', '#d78a76'];

function rect(c, x, y, w, h, fill, stroke, width = 2) {
  if (fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.strokeRect(x, y, w, h); }
}
function ellipse(c, x, y, rx, ry, fill, stroke, width = 2) {
  c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, TAU);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}
function line(c, points, color, width = 2, closed = false, fill = null) {
  c.beginPath(); points.forEach(([x,y], i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
  if (closed) c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = color; c.stroke();
}
function text(c, value, x, y, size = 20, color = '#f5e9d2', align = 'center', maxWidth) {
  c.fillStyle = color; c.textAlign = align; c.textBaseline = 'middle';
  c.font = '600 ' + size + 'px "Trebuchet MS", sans-serif';
  if (maxWidth) c.fillText(value, x, y, maxWidth); else c.fillText(value, x, y);
}
function polygon(c, x, y, radius, sides, fill, rotation = 0) {
  const points = Array.from({length:sides}, (_,i) => [x + Math.cos(rotation + i * TAU / sides) * radius, y + Math.sin(rotation + i * TAU / sides) * radius]);
  line(c, points, '#f9e8c080', 2, true, fill);
}
function ribbon(c, points, color, width = 9) {
  c.beginPath(); c.moveTo(points[0], points[1]); c.bezierCurveTo(...points.slice(2));
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.stroke();
}
function curtains(c, inset = 0, color = '#692449', lift = 1) {
  const span = 125 + inset;
  line(c, [[0,84],[span,84],[span-15,190],[span-64,330],[span-78,580],[0,626]], '#d7aa64', 2, true, color);
  line(c, [[1280,84],[1280-span,84],[1295-span,190],[1344-span,330],[1358-span,580],[1280,626]], '#d7aa64', 2, true, color);
  for (let i=1;i<5;i++) {
    const x = span*i/5;
    ribbon(c,[x,86,x-8,190,x-20,390,x-22,610], '#e2be7729', 3);
    ribbon(c,[1280-x,86,1288-x,190,1300-x,390,1302-x,610], '#e2be7729', 3);
  }
  line(c,[[span-69,340],[span-20,331]],'#e5c78d',5);
  line(c,[[1349-span,340],[1300-span,331]],'#e5c78d',5);
  if (lift > 0) ribbon(c,[span,93,400,165-lift*20,880,165-lift*20,1280-span,93], '#b76b79', 18);
}
function key(c, x, y, scale=1, angle=0) {
  c.save(); c.translate(x,y); c.rotate(angle); c.scale(scale,scale);
  ellipse(c,0,0,18,18,null,'#e9c96c',7); line(c,[[17,0],[77,0]],'#e9c96c',8);
  line(c,[[61,0],[61,17],[75,17],[75,0]],'#e9c96c',7); c.restore();
}
function pillow(c,x,y,w=104,h=55,angle=0,color='#d7c0cc') {
  c.save(); c.translate(x,y); c.rotate(angle);
  c.beginPath(); c.roundRect(-w/2,-h/2,w,h,14); c.fillStyle=color; c.fill();
  c.strokeStyle='#4c3b6580'; c.lineWidth=3; c.stroke();
  line(c,[[-w/2+10,-h/2+10],[w/2-10,-h/2+10],[w/2-10,h/2-10],[-w/2+10,h/2-10]],'#fff1',2,true);
  c.restore();
}
function crown(c,x,y,scale=1,color='#e6c46c') {
  c.save(); c.translate(x,y); c.scale(scale,scale);
  line(c,[[-58,23],[-69,-32],[-30,-5],[0,-49],[30,-5],[69,-32],[58,23]],'#fff2b8',3,true,color);
  rect(c,-58,17,116,17,color,'#ab7840',3);
  [-69,0,69].forEach((cx,i)=>ellipse(c,cx,i===1?-49:-32,7,7,'#e8b886'));
  c.restore();
}
function candle(c,x,y,h=100) {
  rect(c,x-9,y-h,18,h,'#e7d7ad','#795a3e',2);
  ellipse(c,x,y-h-12,6,12,'#f0cf77');
  ellipse(c,x,y-h-12,16,24,'#f8d77a1a');
  line(c,[[x-24,y+4],[x+24,y+4]],'#c6a16a',5);
}
function door(c,x,y,w,h,depth=0) {
  rect(c,x,y,w,h,'#242338','#c7aa78',5);
  rect(c,x+11,y+12,w-22,h-12,'#131c2d','#6a566e',2);
  ellipse(c,x+w-25,y+h*.56,5,5,'#edcf80');
  rect(c,x+w*.14,y+16,w*.72,33,'#dce1bb');
  text(c,'EXIT',x+w/2,y+33,Math.max(12,24-depth*2),'#285d48');
}
function portrait(c,x,y,w,h) {
  rect(c,x,y,w,h,'#32293b','#caab72',9); rect(c,x+10,y+10,w-20,h-20,'#292334','#87633f',2);
  ellipse(c,x+w/2,y+h*.38,w*.16,h*.16,'#594c61');
  ellipse(c,x+w/2,y+h*.83,w*.29,h*.29,'#4b4057');
  rect(c,x+6,y+h-19,w-12,13,'#54432d');
}
function stageProps(c, motif, v, reveal, accent, settle) {
  c.save(); c.globalAlpha = 0.25 + reveal*0.75;
  const rise = (1-reveal)*25;
  c.translate(0,rise);
  switch (motif) {
    case 'exit':
      if (v===0) { door(c,780,160,202,390); line(c,[[625,584],[860,584],[830,565],[860,584],[830,602]],'#e8d187',6); }
      else if (v===1) {
        for(let i=3;i>=0;i--) { const s=1-i*.16; door(c,640-155*s,165+i*32,310*s,390-i*32,i); }
        line(c,[[270,617],[570,548],[710,548],[1010,617]],'#d2c5a260',3);
      } else {
        curtains(c,18,'#652b4d'); door(c,180,190,145,345); door(c,955,190,145,345);
        ribbon(c,[230,585,440,470,810,655,1040,576],'#e6c883',5);
        text(c,'EXIT',640,155,25,'#b4dab8');
      } break;
    case 'trick':
      if (v===0) { key(c,745,520,1.7,-.14); rect(c,696,556,224,15,'#847194'); }
      else if (v===1) {
        [-1,0,1].forEach((n,i)=>{ c.save(); c.translate(640+n*176,255); c.rotate(n*.12);
          rect(c,-64,-83,128,166,'#ded3b3','#8d4e8f',6); polygon(c,0,0,29,4,COLORS[i],Math.PI/4); c.restore(); });
        key(c,787,553,.9,.1);
      } else {
        curtains(c,15,'#542b63'); key(c,190,267,1,-.7); key(c,1030,267,1,.7);
        for(let i=0;i<28;i++) rect(c,i*48,585,24,24,i%2?'#ede0bd':'#73567d');
      } break;
    case 'stitch':
      if(v===0) {
        rect(c,232,154,816,425,'#93617118','#d2b1a6',11);
        for(let x=248;x<1040;x+=28) { line(c,[[x,146],[x+10,166]],'#f2dfbf',3); line(c,[[x,569],[x+10,589]],'#f2dfbf',3); }
        for(let y=177;y<564;y+=28) { line(c,[[222,y],[242,y+10]],'#f2dfbf',3); line(c,[[1038,y],[1058,y+10]],'#f2dfbf',3); }
      } else if(v===1) {
        for(let i=0;i<5;i++) ribbon(c,[170,180+i*29,390,400-i*38,910,110+i*49,1110,390+i*20],COLORS[i],5);
        rect(c,810,500,150,62,'#b77d9b','#ecd7b4',3);
      } else {
        for(let i=0;i<11;i++) {rect(c,145+i*90,116,90,73,COLORS[i%5]+'90','#efdbb4',2); line(c,[[154+i*90,125],[225+i*90,180]],'#f3e6c8',2);}
        ribbon(c,[146,208,225,435,50,565,260,591],'#e3bba2',7);
        ribbon(c,[1134,208,1055,435,1230,565,1020,591],'#e3bba2',7);
      } break;
    case 'ribbon':
      if(v===0) {
        ribbon(c,[180,180,395,295,870,110,1100,225],'#ba425b',16);
        ribbon(c,[160,572,480,520,825,626,1110,566],'#c84b64',13);
      } else if(v===1) {
        ribbon(c,[260,133,54,230,467,410,206,588],'#bd435e',19);
        ribbon(c,[1020,133,1226,230,813,410,1074,588],'#d96378',17);
        ribbon(c,[400,205,620,345,665,120,880,237],'#b73f5d',11);
      } else {
        ribbon(c,[640,220,180,60,300,430,640,220],'#ae3d5d',24);
        ribbon(c,[640,220,1100,60,980,430,640,220],'#c75e77',24);
        ribbon(c,[628,227,485,313,625,447,480,585],'#b63e5c',17);
        ribbon(c,[652,227,795,313,655,447,800,585],'#d66c82',17);
        ellipse(c,640,223,24,19,'#db7b89');
      } break;
    case 'geometry':
      if(v===0) {polygon(c,820,245,60,3,COLORS[1],-.3);polygon(c,994,367,54,4,COLORS[0],.2);ellipse(c,819,500,44,44,COLORS[2]);}
      else if(v===1) {
        for(let i=0;i<7;i++){const a=-Math.PI*.92+i*Math.PI*1.84/6; polygon(c,640+380*Math.cos(a),347+193*Math.sin(a),25+i%3*8,3+i%3,COLORS[i%5],a*.35);}
        ellipse(c,640,347,380,193,null,'#e7cf9a35',2);
      } else {
        line(c,[[180,151],[1040,190],[1130,580],[250,600]],'#d7c5e4',6,true);
        for(let i=0;i<5;i++)polygon(c,385+i*128,164+i*5,31,3+i%3,COLORS[i],i*.37);
        polygon(c,190,422,48,4,'#76b5b1',.6);
      } break;
    case 'chess':
      if(v===0) {pillow(c,800,541,157,65,.06);pillow(c,949,541,157,65,-.06,'#d8cfb5');pillow(c,873,483,150,58,0,'#b3a4c9');}
      else if(v===1) {
        for(let row=0;row<3;row++)for(let i=0;i<14;i++)rect(c,164+i*68,533+row*22,68,22,(i+row)%2?'#d8cfaa70':'#3c354eaa');
        crown(c,640,220,1.25,'#c3ae75');
      } else {
        for(let i=0;i<4;i++){pillow(c,240,553-i*53,155,59,i%2?.05:-.05,COLORS[i%5]);pillow(c,1040,553-i*53,155,59,i%2?-.05:.05,COLORS[(i+2)%5]);}
        rect(c,440,136,400,91,'#66567a','#d8ba7b',3); crown(c,640,185,.67);
      } break;
    case 'curtain':
      curtains(c,20+v*23,v===2?'#732744':'#583052');
      if(v===0)line(c,[[640,112],[370,590],[910,590]],'#f9d4871a',1,true,'#f9d4871a');
      else if(v===1){
        line(c,[[285,105],[500,585],[940,585]],'#b5c5f518',1,true,'#b5c5f518');
        line(c,[[995,105],[340,585],[780,585]],'#e7b0ca18',1,true,'#e7b0ca18');
        ellipse(c,640,167,61,24,null,'#e6c47e',4);
      } else {
        crown(c,640,151,.48); ellipse(c,640,567,315,24,null,'#e4bf7e',3);
        for(let i=0;i<38;i++){const x=170+(i*137)%940, y=194+(i*79)%340+accent*20; c.save();c.translate(x,y);c.rotate(i*.71);rect(c,-3,-6,6,12,COLORS[i%5]);c.restore();}
      } break;
    case 'bubble':
      if(v===0){for(let i=0;i<3;i++)ellipse(c,640,568,135+i*78,16+i*9,null,'#c8e4ed'+['b0','70','40'][i],3);}
      else if(v===1)for(let i=0;i<9;i++){
        const a=Math.PI*1.08+i*Math.PI*.84/8,x=640+370*Math.cos(a),y=456+265*Math.sin(a);
        ellipse(c,x,y,19+i%3*9,19+i%3*9,'#bbdfe711','#c8e6ef80',2);ellipse(c,x-6,y-8,4,3,'#f4fcffb0');
      } else {
        ellipse(c,640,350,420,225,'#c5eaf308','#cbe4ec70',4);
        for(const x of [170,1110])for(let i=0;i<3;i++)ellipse(c,x+(i%2?18:-18),230+i*112,20+i*4,20+i*4,'#a7d2e310','#d6f0f6a0',2);
      } break;
    case 'convoy':
      if(v===0){
        line(c,[[525,345],[240,616],[1040,616],[755,345]],'#dacba9',3,true,'#312c3f60');
        for(let i=0;i<5;i++)rect(c,635-i,377+i*47,10+i*2,17+i*4,'#e5d6aa');
      } else if(v===1) {
        for(const x of [260,1020]){rect(c,x-11,194,22,380,'#ddc791');for(let i=0;i<10;i++)rect(c,x-11,205+i*33,22,13,'#93646f');}
        rect(c,271,176,738,60,'#6b5555','#d8bd7d',3); text(c,'DERNIÈRE ÉTAPE',640,207,24,'#f0ddb0');
      } else {
        line(c,[[170,606],[535,290],[745,290],[1110,606]],'#c8a476',5);
        for(let i=0;i<5;i++){const x=290+i*175,y=230+i%2*20;line(c,[[x,y],[x+35,y+25],[x,y+50]],COLORS[i],7);}
        line(c,[[580,600],[640,500],[700,600]],'#e5cf91',5);
      } break;
    case 'crown':
      if(v===0){crown(c,640,237,1.4);ellipse(c,640,569,307,27,null,'#d7b0cd',4);}
      else if(v===1){
        for(const x of [260,1020]){rect(c,x-24,200,48,365,'#c3a9c5','#e5d6aa',4);for(let i=0;i<8;i++)line(c,[[x-23,223+i*40],[x+23,243+i*40]],'#e9cfad',8);ellipse(c,x,188,44,24,'#bd8fb6','#edd7ae',3);}
        crown(c,640,204,1);
      } else {
        for(let i=0;i<3;i++){const x=390+i*250;rect(c,x-89,225,178,340,'#bfa5be18','#c9a7c5',5);ellipse(c,x,225,89,90,'#c0a4be18','#d8bfd0',5);}
        crown(c,640,165,.8);
      } break;
    case 'gloink':
      if(v===0)for(let i=0;i<5;i++)polygon(c,360+i*142,551-i%2*25,28+i%3*7,3+i%4,COLORS[i],i*.4);
      else if(v===1)for(let i=0;i<12;i++){const a=i*TAU/12;polygon(c,640+410*Math.cos(a),348+210*Math.sin(a),22+i%3*4,3+i%4,COLORS[i%5],a);}
      else{
        polygon(c,640,342,218,6,'#a680ad12',Math.PI/6);polygon(c,640,342,176,6,'#a680ad12',Math.PI/6);
        for(let i=0;i<7;i++)polygon(c,270+i*124,558,22+i%3*4,3+i%4,COLORS[i%5],i*.3);
      } break;
    case 'fudge':
      if(v===0){ellipse(c,640,565,337,42,'#614136','#a47d61',4);ellipse(c,640,560,286,24,'#74503d');}
      else if(v===1){
        rect(c,150,120,980,49,'#684335','#9d7054',3);
        for(let i=0;i<13;i++){const x=169+i*76,h=40+(i*31)%93;rect(c,x,165,39,h,'#684335');ellipse(c,x+19.5,165+h,19.5,21,'#684335');}
        ellipse(c,640,577,300,22,'#5b3c32');
      } else {
        for(const x of [240,1040]){rect(c,x-38,200,76,367,'#614031','#966747',4);ellipse(c,x,200,44,30,'#78503b');}
        ribbon(c,[240,204,420,90,860,90,1040,204],'#72503b',50);
        ellipse(c,640,574,402,32,'#664332','#a77655',3);
      } break;
    case 'glitch':
      if(v===0)for(let i=0;i<9;i++)rect(c,226+(i*149)%810,177+(i*63)%354,54+i%3*21,10+i%2*12,COLORS[i%5]+'70');
      else if(v===1)for(let i=0;i<9;i++){
        const x=235+i%3*305,y=165+Math.floor(i/3)*130;rect(c,x,y,205,85,'#141621d9','#857594',2);
        ellipse(c,x+100,y+42,20,11,'#d9c6df');ellipse(c,x+100,y+42,5,9,'#252637');
      } else {
        for(let i=0;i<5;i++){c.save();c.translate(275+i*182,250+i%2*100);c.rotate((i-2)*.07);rect(c,-64,-85,128,170,'#12151edf','#8b709d',3);ellipse(c,0,-10,22,12,'#d7c3db');ellipse(c,0,-10,6,10,'#202135');c.restore();}
        line(c,[[190,575],[340,550],[480,591],[625,558],[810,588],[1090,563]],'#a58aaf',4);
      } break;
    case 'portrait':
      if(v===0){portrait(c,772,158,228,337);candle(c,725,566,126);candle(c,1040,566,156);}
      else if(v===1){portrait(c,518,159,244,325);for(let i=0;i<6;i++)candle(c,270+i*148,567,69+i%3*38);}
      else {
        [[186,178,130,220],[340,143,149,248],[791,143,149,248],[964,178,130,220]].forEach(args=>portrait(c,...args));
        candle(c,244,571,112);candle(c,1036,571,112);line(c,[[160,601],[1120,601]],'#c0a070',4);
      } break;
    default: ellipse(c,640,565,330,28,null,'#d9c49a',3);
  }
  // A quiet floor rim establishes the last beat without flashing or shaking.
  c.globalAlpha = 0.35*settle;
  ellipse(c,640,590,410,13,null,'#f0dbab',2);
  c.restore();
}

export function drawFinisherScene(ctx, state, entry, frame, { reducedMotion = false, drawActor } = {}) {
  const view = sampleFinisherPresentation(entry, frame, { reducedMotion });
  const actors = state?.fighters || [state?.a, state?.b];
  const winner = actors[entry?.winnerIndex], loser = actors[entry?.loserIndex];
  if (!winner || !loser || typeof drawActor !== 'function') return view;
  const v = Math.max(0, ['impact','special','super'].indexOf(entry.variant));
  const p = view.progress, reveal = ease(p*3), accent = ease((p-.24)*3), settle = ease((p-.68)/.32);
  const definition = winner.f || winner.def || {};
  const color = definition.color || '#d0b7df';
  ctx.save();
  ctx.beginPath(); ctx.rect(0,84,1280,542); ctx.clip();
  rect(ctx,0,84,1280,542,'#090b19a6');
  const glow = ctx.createRadialGradient(640,330,28,640,330,650);
  glow.addColorStop(0,color); glow.addColorStop(1,'#17142400');
  ctx.save(); ctx.globalAlpha=.11+.07*reveal; ctx.fillStyle=glow;ctx.fillRect(0,84,1280,542);ctx.restore();
  stageProps(ctx,entry.motif,v,reveal,accent,settle);
  const leftWinner = entry.winnerIndex === 0;
  const presentation = {phase:'matchOver',winner:entry.winnerIndex,roundWinner:entry.winnerIndex,frame:state.frame,presentationFrame:view.frame};
  const winnerX = leftWinner ? 430+v*28 : 850-v*28;
  const loserX = leftWinner ? 990 : 290;
  const shown = (actor,x,face) => ({...actor,x,y:568,face,facing:face,attack:null,flash:0,buffs:{}});
  drawActor(shown(loser,loserX,leftWinner?-1:1),presentation);
  drawActor(shown(winner,winnerX,leftWinner?1:-1),presentation);
  ctx.restore();
  ctx.save();
  rect(ctx,0,0,1280,84,'#101222');rect(ctx,0,626,1280,94,'#101222');
  rect(ctx,0,82,1280,2,'#d2b478');rect(ctx,0,626,1280,2,'#d2b478');
  text(ctx,'FINALE DE SPECTACLE',640,23,13,'#c8b086');
  text(ctx,entry.title || 'Rappel',640,55,28,'#f0e3cb','center',1150);
  text(ctx,view.beat?.title || 'Le rideau se referme',640,656,22,'#f0e3cb','center',1120);
  text(ctx,'CRÉATION ENCORE · ' + (definition.name || entry.fighterId),640,692,13,'#b9afc7','center',1120);
  ctx.restore();
  return view;
}

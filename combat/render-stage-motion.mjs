/** Small stage-specific ambient layers, drawn behind actors above the floor. */
import { SCENERY_ANCHORS } from './render-stage-scenery.mjs';
export const AMBIENT_FLOOR = 568;
export const STAGE_AMBIENCES = Object.freeze({
  bigtop: 'Lueurs de piste', candy: 'Poussière de sucre', manor: 'Bougies du manoir', spudsy: 'Vapeur du comptoir',
  cellar: 'Présences du cellier', void: 'Reflets irisés', lake: 'Ondes du lac', training: 'Balayage de calibration',
  gloink: 'Formes du nid', kingdom: 'Scintillements de sucre', grounds: 'Nuages des terrains', backstage: 'Veilleuses du couloir',
});
const TAU = Math.PI * 2;
const normalFrame = value => Number.isFinite(value) ? Math.max(0, value) : 0;
const circle = (x, y, rx, ry, color, alpha = 1) => ({ kind: 'ellipse', x, y, rx, ry, color, alpha });
const stroke = (points, color, alpha = 1, width = 1) => ({ kind: 'line', points, color, alpha, width });

/** Deterministic coordinates only: no RNG, wall clock or actor mutation. */
export function stageMotion(stage, frame = 0, reducedMotion = false) {
  let id = typeof stage === 'string' ? stage : stage?.theme || stage?.id || 'bigtop';
  if (id === 'circus') id = 'bigtop';
  if (!Object.hasOwn(STAGE_AMBIENCES, id)) return { id, frame: 0, shapes: [] };
  const tick = reducedMotion ? 0 : normalFrame(frame), t = tick / 60, shapes = [];
  const wave = (rate, phase = 0) => Math.sin(t * rate + phase);
  if (id === 'bigtop') {
    for (let i = 0; i < 7; i++) shapes.push(circle(145 + i * 165, 122 + wave(0.35, i) * 5, 8 + wave(0.8, i) * 1.5, 5, '#fff3b3', 0.15 + (wave(0.7, i) + 1) * 0.07));
  } else if (id === 'candy') {
    for (let i = 0; i < 18; i++) shapes.push(circle((73 + i * 139 + t * (2 + i % 3)) % 1280, 85 + ((i * 47 + t * (4 + i % 4)) % 425), 1.4 + i % 2, 1.4 + i % 2, ['#ffe5bb', '#fbb5db', '#d7eaff'][i % 3], 0.38));
  } else if (id === 'manor') {
    for (const [i, [x, y]] of SCENERY_ANCHORS.manor.candles.entries()) {
      shapes.push(circle(x, y, 9 + wave(4.2, i) * 2, 22 + wave(5.1, i) * 3, '#ffc779', 0.11));
      shapes.push(circle(x + wave(3.7, i) * 2, y, 2.7, 7 + wave(4.9, i) * 1.6, '#ffe4ab', 0.46));
    }
  } else if (id === 'spudsy') {
    for (const [i, [x, surface]] of SCENERY_ANCHORS.spudsy.steam.entries()) {
      const y = surface - 18 - ((t * 14 + i * 22) % 65);
      shapes.push(stroke([[x, y + 16], [x + wave(1.1, i) * 7, y + 8], [x + wave(1.1, i + 0.7) * 10, y]], '#ffe5ca', 0.13, 3));
    }
  } else if (id === 'cellar') {
    for (let i = 0; i < 7; i++) {
      const pulse = 0.1 + (wave(0.37, i * 1.7) + 1) * 0.06, x = 130 + i * 170, y = 195 + (i * 83 % 230);
      shapes.push(circle(x - 7, y, 3, 4, ['#d7afef', '#add7ea', '#e8dca8'][i % 3], pulse), circle(x + 7, y, 3, 4, '#ebd2ef', pulse));
    }
  } else if (id === 'void') {
    for (let i = 0; i < 5; i++) {
      const points = Array.from({ length: 10 }, (_, x) => [x * 144, 200 + i * 61 + Math.sin(x * 0.6 + t * 0.15 + i) * 14]);
      shapes.push(stroke(points, ['#a8b5f4', '#d3aff0', '#a3d9e1'][i % 3], 0.2, 2));
    }
  } else if (id === 'lake') {
    for (let i = 0; i < 12; i++) {
      const x = 60 + (i * 119 % 1150), y = 370 + (i * 31 % 160), length = 18 + (wave(0.8, i) + 1) * 13;
      shapes.push(stroke([[x - length, y], [x + length, y]], '#bedfe8', 0.14 + (wave(0.8, i) + 1) * 0.07, 1.5));
    }
  } else if (id === 'training') {
    const y = 125 + (t * 24 % 390);
    shapes.push(stroke([[80, y], [1200, y]], '#a7ffdf', 0.16, 2));
    for (let i = 0; i < 9; i++) shapes.push(circle(180 + i * 115, 120, 2, 2, '#bdffef', 0.25 + (wave(0.9, i) + 1) * 0.15));
  } else if (id === 'gloink') {
    for (let i = 0; i < 7; i++) {
      const x = 80 + i * 185, y = 170 + (i * 87 % 265), angle = t * (i % 2 ? -0.12 : 0.12) + i, radius = 9 + i % 3 * 3;
      shapes.push({ kind: 'polygon', points: Array.from({ length: 3 + i % 3 }, (_, n) => [x + Math.cos(angle + TAU * n / (3 + i % 3)) * radius, y + Math.sin(angle + TAU * n / (3 + i % 3)) * radius]), color: ['#edb77b', '#d3a5e9', '#9dd8c2'][i % 3], alpha: 0.22 });
    }
  } else if (id === 'kingdom') {
    for (let i = 0; i < 12; i++) {
      const x = 90 + i * 99, y = 140 + (i * 79 % 350), length = 2 + (wave(0.7, i * 1.9) + 1) * 2;
      shapes.push(stroke([[x - length, y], [x + length, y]], '#ffe4ad', 0.35, 1), stroke([[x, y - length], [x, y + length]], '#ffe4ad', 0.35, 1));
    }
  } else if (id === 'grounds') {
    for (let i = 0; i < 4; i++) {
      const x = ((i * 350 + t * 2.5) % 1480) - 100, y = 100 + i % 2 * 50;
      shapes.push(circle(x, y, 54, 13, '#e3e9ed', 0.14), circle(x + 36, y + 5, 40, 9, '#e3e9ed', 0.12));
    }
  } else if (id === 'backstage') {
    for (const [i, [x, y, radius]] of SCENERY_ANCHORS.backstage.lights.entries()) shapes.push(circle(x, y, radius * 1.5 + wave(0.5, i) * 2, radius + wave(0.5, i), '#ffe9b7', 0.07 + (wave(0.5, i) + 1) * 0.035));
  }
  return { id, frame: tick, shapes };
}

export function drawStageMotion(ctx, stage, frame = 0, reducedMotion = false) {
  const motion = stageMotion(stage, frame, reducedMotion);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1280, AMBIENT_FLOOR); ctx.clip();
  for (const shape of motion.shapes) {
    ctx.globalAlpha = shape.alpha; ctx.beginPath();
    if (shape.kind === 'ellipse') ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, TAU);
    else {
      shape.points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      if (shape.kind === 'polygon') ctx.closePath();
    }
    if (shape.kind === 'line') { ctx.strokeStyle = shape.color; ctx.lineWidth = shape.width; ctx.stroke(); }
    else { ctx.fillStyle = shape.color; ctx.fill(); }
  }
  ctx.restore();
  return motion;
}

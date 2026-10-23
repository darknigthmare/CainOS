import { getHurtbox, getHitbox } from './engine.mjs';
import { removeAtlasMatte, applySpritePalette, projectilePresentation, trapPresentation } from './render-presentation.mjs';
import { spriteSourceRegion, actorPose, frameGeometry, crouchParts, POSE_REGISTRATION_VERSION } from './render-poses.mjs';
import { drawStageMotion } from './render-stage-motion.mjs';
import { drawStageScenery } from './render-stage-scenery.mjs';
import { drawFinisherScene } from './render-finishers.mjs';

/**
 * Digital Circus combat presentation. Existing CainOS atlases are read without
 * changing their files. Static border removal keys only the actual edge matte;
 * the seven existing animation sheets use alpha bounds only. Their
 * inspected cells and rigid cutout poses provide game-state presentation until
 * dedicated fight art is authored. Character transforms use one uniform scale.
 */
export const LOGICAL_WIDTH = 1280;
export const LOGICAL_HEIGHT = 720;
const FLOOR = 568;
const TAU = Math.PI * 2;
const images = new Map();
const frames = new Map();
const pending = new Map();
const failures = new Map();
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function sourceURL(src) {
  if (!src) return null;
  return new URL(src.startsWith('assets/') ? `../${src}` : src, import.meta.url).href;
}

async function loadImage(src) {
  const url = sourceURL(src);
  if (!url) return null;
  if (images.has(url)) return images.get(url);
  if (pending.has(url)) return pending.get(url);
  if (failures.has(url)) return null;
  const promise = new Promise(resolve => {
    const img = new Image();
    img.onload = () => { images.set(url, img); resolve(img); };
    img.onerror = () => { failures.set(url, 'Image indisponible'); resolve(null); };
    img.src = url;
  }).finally(() => pending.delete(url));
  pending.set(url, promise);
  return promise;
}

function canvas(width, height) {
  const result = document.createElement('canvas');
  result.width = Math.max(1, Math.round(width));
  result.height = Math.max(1, Math.round(height));
  return result;
}

function frameKey(spec, index, animated) {
  return [spec.src, spec.cols, spec.rows, index, JSON.stringify(spec.sourceRect || null), spec.component || 'all', spec.matteMode || 'edge', spec.matteTolerance ?? 'auto', spec.paletteSwap || 'original', animated ? `alpha:${POSE_REGISTRATION_VERSION}` : 'matte-v3'].join('|');
}

function cleanCellEdges(data, width, height, onlyLargest) {
  // A few historical grids cut a neighbouring sprite at a cell boundary. Keep
  // detached hands and accessories; discard only tiny components that touch a
  // cell edge. The dedicated Queen sheet explicitly selects its main component.
  const edgeVisible = onlyLargest || Array.from({ length: width }, (_, x) => x).some(x => data[x * 4 + 3] >= 12 || data[((height - 1) * width + x) * 4 + 3] >= 12)
    || Array.from({ length: height }, (_, y) => y).some(y => data[y * width * 4 + 3] >= 12 || data[(y * width + width - 1) * 4 + 3] >= 12);
  if (!edgeVisible) return;
  const labels = new Int32Array(width * height), stack = new Int32Array(width * height), components = [];
  let id = 0;
  for (let start = 0; start < width * height; start++) {
    if (labels[start] || data[start * 4 + 3] < 12) continue;
    id++;
    const component = { id, size: 0, edge: false };
    let length = 0; stack[length++] = start; labels[start] = id;
    while (length) {
      const index = stack[--length], x = index % width, y = Math.floor(index / width);
      component.size++;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) component.edge = true;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const next = ny * width + nx;
        if (labels[next] || data[next * 4 + 3] < 12) continue;
        labels[next] = id; stack[length++] = next;
      }
    }
    components.push(component);
  }
  const largest = components.reduce((best, current) => !best || current.size > best.size ? current : best, null);
  if (!largest) return;
  const discarded = new Set(components.filter(c => c.id !== largest.id && (onlyLargest || c.edge && c.size < largest.size * 0.05)).map(c => c.id));
  for (let i = 0; i < labels.length; i++) if (discarded.has(labels[i])) data[i * 4 + 3] = 0;
}

function extractFrame(img, spec, index = 0, animated = false) {
  const key = frameKey(spec, index, animated);
  if (frames.has(key)) return frames.get(key);
  const region = spriteSourceRegion(spec, index, animated, img.naturalWidth, img.naturalHeight);
  const { width, height } = region;
  const source = canvas(width, height);
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, region.x, region.y, width, height, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height);
  const data = pixels.data;
  if (!animated) {
    removeAtlasMatte(data, width, height, { mode: spec.matteMode, tolerance: spec.matteTolerance });
    if (spec.matteMode !== 'preserve-source') cleanCellEdges(data, width, height, spec.component === 'largest');
    applySpritePalette(data, width, height, spec.paletteSwap);
    ctx.putImageData(pixels, 0, 0);
  }
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] < 12) continue;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  if (x1 < x0 || y1 < y0) { frames.set(key, null); return null; }
  const bounds = { x: x0 + region.offsetX, y: y0 + region.offsetY, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const pad = animated ? 12 : Math.max(2, Math.round(Math.min(width, height) * 0.018));
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(width - 1, x1 + pad); y1 = Math.min(height - 1, y1 + pad);
  const cropped = canvas(x1 - x0 + 1, y1 - y0 + 1);
  cropped.getContext('2d').drawImage(source, x0, y0, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  const floorContour = [];
  for (let x = 0; x < width; x++) {
    for (let y = height - 1; y >= 0; y--) if (data[(y * width + x) * 4 + 3] >= 12) { floorContour.push([x + region.offsetX, y + 1 + region.offsetY]); break; }
  }
  const frame = { canvas: cropped, width: cropped.width, height: cropped.height, x: x0 + region.offsetX, y: y0 + region.offsetY, bounds, sourceWidth: width, sourceHeight: height, animated, index, registration: region.registration, floorContour };
  frames.set(key, frame);
  return frame;
}

function visualRecord(fighter, variant) {
  if (!variant) return fighter;
  const picked = typeof variant === 'object' ? variant : fighter.variants?.find(item => item.id === variant);
  if (!picked?.sprite) return fighter;
  return { ...fighter, ...picked, animation: picked.animation || null };
}

export function getFrame(fighter, action = 'idle', tick = 0, variant = null, explicitFrame = null) {
  const f = visualRecord(fighter, variant);
  if (!f) return null;
  const animation = f.animation && !failures.has(sourceURL(f.animation.src)) ? f.animation : null;
  const spec = animation || f.sprite;
  if (!spec?.src) return null;
  const img = images.get(sourceURL(spec.src));
  if (!img) { void loadImage(spec.src); return null; }
  let sequence = animation?.frames?.[action];
  if (!sequence) sequence = animation?.frames?.[action === 'guard' || action === 'jump' || action === 'crouch' ? 'idle' : 'attack'];
  if (!sequence?.length) sequence = animation?.frames?.idle || [0];
  const delay = action === 'walk' ? 8 : action === 'talk' ? 10 : 24;
  const index = animation && Number.isInteger(explicitFrame) && explicitFrame >= 0 && explicitFrame < (spec.cols || 1) * (spec.rows || 1) ? explicitFrame : sequence[Math.floor(Math.max(0, tick) / delay) % sequence.length];
  const staticIndex = (spec.row || 0) * (spec.cols || 1) + (spec.col || 0);
  return extractFrame(img, spec, animation ? index : staticIndex, !!animation);
}

async function prepareFighter(f) {
  await Promise.all([loadImage(f?.sprite?.src), loadImage(f?.animation?.src)]);
  getFrame(f, 'idle', 0);
  if (f?.animation) for (const action of ['walk', 'attack', 'hurt', 'talk']) getFrame(f, action, 0);
}

export async function drawPortrait(target, fighter, options = {}) {
  const f = visualRecord(fighter, options.variant);
  await prepareFighter(f);
  const ctx = target.getContext('2d');
  if (!ctx) return false;
  const w = target.width, h = target.height;
  ctx.clearRect(0, 0, w, h);
  const frame = getFrame(f, options.action || 'idle', options.frame || 0);
  if (!frame) return false;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const scale = Math.min(w * 0.87 / frame.width, h * 0.91 / frame.height);
  const dw = frame.width * scale, dh = frame.height * scale;
  if (options.glow !== false) { ctx.shadowColor = f.color || '#a897ef'; ctx.shadowBlur = Math.min(18, w * 0.07); }
  ctx.drawImage(frame.canvas, Math.round((w - dw) / 2), Math.round(h - dh - h * 0.035), Math.round(dw), Math.round(dh));
  ctx.restore();
  return true;
}

function path(ctx, points, fill, stroke = null, lineWidth = 1) {
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function drawPoseArtwork(ctx, frame, articulated) {
  if (!articulated) { ctx.drawImage(frame.canvas, frame.x, frame.y); return; }
  const polygon = points => {
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.closePath();
  };
  for (const part of articulated.parts) {
    ctx.save();
    const m = part.matrix;
    ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
    if (part.holes) {
      ctx.beginPath(); ctx.rect(frame.x, frame.y, frame.width, frame.height);
      for (const hole of part.holes) polygon(hole);
      ctx.clip('evenodd');
    } else if (part.mask) { ctx.beginPath(); polygon(part.mask); ctx.clip(); }
    ctx.beginPath(); ctx.rect(frame.x, part.fromY, frame.width, part.toY - part.fromY); ctx.clip();
    ctx.drawImage(frame.canvas, frame.x, frame.y);
    ctx.restore();
  }
}
function ellipse(ctx, x, y, rx, ry, fill, stroke = null, width = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function rect(ctx, x, y, w, h, fill, stroke = null, lineWidth = 1) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.strokeRect(x, y, w, h); }
}
function roundedRect(ctx, x, y, w, h, radius, fill, stroke = null, lineWidth = 1) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}
function line(ctx, points, color, width = 2) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function gradient(ctx, top, bottom, height = FLOOR) {
  const color = ctx.createLinearGradient(0, 0, 0, height);
  color.addColorStop(0, top); color.addColorStop(1, bottom);
  rect(ctx, 0, 0, 1280, height, color);
}
function glow(ctx, x, y, radius, color, strength = 0.18) {
  ctx.save(); ctx.globalAlpha = strength;
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius); g.addColorStop(0, color); g.addColorStop(1, 'transparent');
  rect(ctx, x - radius, y - radius, radius * 2, radius * 2, g); ctx.restore();
}
function arch(ctx, x, y, w, h, fill, stroke = null, lw = 3) {
  ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2);
  ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function label(ctx, text, x, y, size, color, align = 'center') {
  ctx.font = `800 ${size}px system-ui, sans-serif`; ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(text, x, y);
}
function star(ctx, x, y, r, color, rotation = 0) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const a = i / 10 * TAU + rotation - Math.PI / 2, rr = i % 2 ? r * 0.42 : r;
    return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
  }); path(ctx, points, color);
}
function floorTiles(ctx, primary, alternate, border) {
  gradient(ctx, primary, '#090912', 720);
  // The covering layer is clipped by the caller to the floor.
  for (let y = FLOOR; y < 720; y += 38) for (let x = -80; x < 1360; x += 80) {
    const offset = Math.floor((y - FLOOR) / 38) % 2 ? 40 : 0;
    rect(ctx, x + offset, y, 79, 37, (Math.floor(x / 80) + Math.floor(y / 38)) % 2 ? primary : alternate);
  }
  rect(ctx, 0, FLOOR - 2, 1280, 5, border);
}
function commonFloor(ctx, stage, theme) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, FLOOR, 1280, 152); ctx.clip();
  if (theme === 'bigtop' || theme === 'circus') {
    // Warm checker tiles visible in GLITCH's official cast photograph. The
    // horizontal combat line is a layout adaptation, not a new in-world ring.
    rect(ctx, 0, FLOOR, 1280, 152, '#ffeab0');
    const rows = [FLOOR, 600, 649, 720];
    for (let row = 0; row < rows.length - 1; row++) {
      const y0 = rows[row], y1 = rows[row + 1];
      for (let column = -6; column < 6; column++) {
        const x0 = 640 + column * (110 + row * 30), x1 = 640 + (column + 1) * (110 + row * 30);
        const x2 = 640 + (column + 1) * (140 + row * 30), x3 = 640 + column * (140 + row * 30);
        path(ctx, [[x0, y0], [x1, y0], [x2, y1], [x3, y1]], (column + row) % 2 ? '#ff9c43' : '#ffe7a0');
      }
    }
  } else if (theme === 'void') {
    const haze = ctx.createLinearGradient(0, FLOOR, 0, 720);
    haze.addColorStop(0, '#f7f6ff00'); haze.addColorStop(1, '#daddff6b');
    rect(ctx, 0, FLOOR, 1280, 152, haze);
  } else if (theme === 'cellar') {
    rect(ctx, 0, FLOOR, 1280, 152, '#08090c');
    ellipse(ctx, 640, FLOOR + 13, 180, 18, '#999bad12');
    for (let i = 0; i < 20; i++) {
      const y = FLOOR + 8 + i * 5, width = 26 + (i * 53 % 135);
      line(ctx, [[640 - width + i % 3 * 21, y], [640 + width - i % 4 * 18, y]], `rgba(172,179,193,${0.1 - i * 0.0035})`, 1);
    }
  } else if (theme === 'lake') {
    gradient(ctx, '#735851', '#241d2c', 720);
    for (let y = FLOOR; y < 720; y += 28) { rect(ctx, 0, y, 1280, 25, y % 56 ? '#725342' : '#79583f'); line(ctx, [[0, y], [1280, y]], '#c19a6a', 2); }
    for (let x = 40; x < 1280; x += 140) for (let y = FLOOR + 10; y < 720; y += 28) ellipse(ctx, x, y, 2, 2, '#241b28');
  } else if (theme === 'backstage') {
    const carpet = ctx.createLinearGradient(0, FLOOR, 0, 720);
    carpet.addColorStop(0, '#e34d49'); carpet.addColorStop(1, '#a72d3a');
    rect(ctx, 0, FLOOR, 1280, 152, carpet);
    // The corridor's carpet continues across the horizontal combat plane.
    line(ctx, [[0, FLOOR + 2], [1280, FLOOR + 2]], '#f06e5b', 2);
  } else if (theme === 'kingdom') {
    rect(ctx, 0, FLOOR, 1280, 152, '#da6689');
    for (const y of [600, 650]) line(ctx, [[0, y], [1280, y]], '#b9436c', 2);
    for (let x = -560; x < 1880; x += 200) line(ctx, [[640 + (x - 640) * 0.6, FLOOR], [x, 720]], '#ed87a0', 2);
  } else if (theme === 'candy') floorTiles(ctx, '#9c5666', '#bc6e78', '#ffdeab');
  else if (theme === 'spudsy') floorTiles(ctx, '#b8a18b', '#cfbca0', '#f0debd');
  else floorTiles(ctx, stage.palette?.floor || '#21192f', theme === 'manor' ? '#362638' : '#302244', stage.palette?.accent || '#8b66ac');
  ctx.restore();
  if (['bigtop', 'circus', 'void', 'cellar'].includes(theme)) return;
  const fade = ctx.createLinearGradient(0, 620, 0, 720); fade.addColorStop(0, 'transparent'); fade.addColorStop(1, theme === 'void' ? '#c4bddb77' : '#070712d9');
  rect(ctx, 0, 620, 1280, 100, fade);
}

function circus(ctx) {
  // Observed source: GLITCH series-page cast banner (see fidelity.mjs).
  // Recompose its lounge for the side-view arena; do not invent a dark ring.
  gradient(ctx, '#2588bd', '#53bad5');
  ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(1300, -10); ctx.lineTo(1300, 120);
  for (let x = 1280; x >= 0; x -= 256) {
    ctx.quadraticCurveTo(x - 55, 182, x - 82, 215);
    ctx.quadraticCurveTo(x - 172, 67, x - 256, 120);
  }
  ctx.closePath(); ctx.fillStyle = '#ffb526'; ctx.fill();
  ctx.strokeStyle = '#e5911e'; ctx.lineWidth = 8; ctx.stroke();
  arch(ctx, 485, 239, 270, 329, '#ffcc4c', '#f6e28b', 5);
  ctx.save(); arch(ctx, 499, 253, 242, 315, '#e82b29'); ctx.clip();
  rect(ctx, 620, 253, 121, 315, '#82df20'); ctx.restore();
  line(ctx, [[620, 255], [620, 568]], '#eac137', 3);
  ellipse(ctx, 606, 438, 5, 5, '#f7c143'); ellipse(ctx, 635, 438, 5, 5, '#f7c143');
  rect(ctx, 0, 550, 1280, 18, '#237eab');
  const sofa = (x, y, w, c, dark, light) => {
    for (const dx of [19, w - 35]) roundedRect(ctx, x + dx, y + 123, 15, 18, 4, '#79494a');
    roundedRect(ctx, x + 10, y, w - 20, 103, 28, c, dark, 3);
    roundedRect(ctx, x + 13, y + 73, w - 26, 61, 12, dark);
    roundedRect(ctx, x + 24, y + 73, w - 48, 30, 10, light, c, 2);
    for (const dx of [0, w - 42]) {
      roundedRect(ctx, x + dx, y + 23, 42, 112, 17, c, dark, 3);
      ellipse(ctx, x + dx + 21, y + 34, 23, 26, light, c, 4);
      ellipse(ctx, x + dx + 21, y + 34, 13, 15, null, c, 3);
    }
    for (let dx = 58; dx < w - 35; dx += 34) for (const dy of [24, 54, 116]) ellipse(ctx, x + dx, y + dy, 2.5, 3, light);
  };
  sofa(48, 412, 325, '#a53edb', '#692ca4', '#c560ed');
  sofa(462, 409, 346, '#467ed2', '#3050a2', '#6babe7');
  sofa(947, 414, 330, '#ef4c29', '#b42a21', '#ff8e41');
  // The yellow hydrant and black/red table are visible in the same photograph.
  roundedRect(ctx, 858, 446, 34, 113, 10, '#ffc320', '#e39b12', 3);
  ellipse(ctx, 875, 446, 22, 15, '#ffca29', '#e8a31a', 3);
  rect(ctx, 846, 458, 57, 12, '#ffc320', '#e8a31a', 2);
  ellipse(ctx, 875, 491, 12, 12, '#ffd449', '#dfa01a', 3);
  rect(ctx, 872, 426, 7, 11, '#fbd24b');
  rect(ctx, 1056, 514, 113, 49, '#3f2534');
  for (let x = 1063; x < 1170; x += 21) rect(ctx, x, 514, 9, 48, '#6b2635');
  ellipse(ctx, 1112, 514, 66, 12, '#d44c3e', '#ef7940', 3);
}

function candy(ctx) {
  gradient(ctx, '#493161', '#db92a7');
  ellipse(ctx, 1035, 165, 76, 76, '#f4c49d');
  for (const [x, y, w, h, c] of [[-110, 300, 400, 265, '#80556f'], [235, 244, 300, 330, '#a86679'], [875, 310, 400, 290, '#965575']]) {
    path(ctx, [[x, FLOOR], [x + 35, y + 35], [x + w * 0.3, y], [x + w * 0.8, y + 12], [x + w, FLOOR]], c);
    line(ctx, [[x + 42, y + 42], [x + w * 0.3, y + 17], [x + w * 0.8, y + 27]], '#efd4bc', 19);
    for (let s = 0; s < 7; s++) rect(ctx, x + 55 + s * 33, y + 20 + s % 2 * 18, 7, 12, s % 2 ? '#be92df' : '#ffd8a0');
  }
  for (const x of [120, 1100]) {
    line(ctx, [[x, 360], [x, 558]], '#f9dbb5', 12); ellipse(ctx, x, 323, 65, 65, '#da8dba', '#f5d9bd', 7);
    for (let r = 12; r <= 50; r += 15) ellipse(ctx, x, 323, r, r, null, '#f4c7d8', 5);
  }
  path(ctx, [[520, 390], [750, 390], [930, FLOOR], [285, FLOOR]], '#ce92bf');
  for (let i = 0; i < 11; i++) ellipse(ctx, 500 + i * 37, 470 + i % 3 * 21, 50, 22, '#c980a7');
  for (let i = 0; i < 10; i++) ellipse(ctx, i * 150 - 10, 552, 85, 38, '#7c536a');
}

function manor(ctx) {
  gradient(ctx, '#111a35', '#333045');
  for (let x = 0; x < 1280; x += 64) rect(ctx, x, 0, 1, FLOOR, '#6e4b6538');
  for (const x of [130, 1030]) {
    arch(ctx, x, 162, 120, 275, '#14172f', '#7b6872', 10);
    arch(ctx, x + 15, 178, 90, 240, '#29334e');
    line(ctx, [[x + 60, 178], [x + 60, 425]], '#8b7885', 5); line(ctx, [[x + 12, 296], [x + 108, 296]], '#8b7885', 5);
    glow(ctx, x + 60, 270, 130, '#a8b4e4', 0.12);
  }
  arch(ctx, 425, 143, 430, 425, '#79636e', '#ac8790', 7);
  arch(ctx, 447, 167, 386, 401, '#171b31', '#4f3e51', 6);
  arch(ctx, 494, 205, 292, 363, '#28223d', '#5f4860', 5);
  line(ctx, [[640, 209], [640, 567]], '#86707b', 3);
  for (const x of [362, 888]) {
    rect(ctx, x, 405, 26, 162, '#4a4050', '#9b7a77', 3);
    for (const dx of [-18, 13, 44]) { rect(ctx, x + dx, 368, 8, 40, '#d7c2a0'); ellipse(ctx, x + dx + 4, 360, 5, 9, '#f2ca7b'); }
    glow(ctx, x + 13, 360, 100, '#f4ba6e', 0.15);
  }
  line(ctx, [[640, 0], [640, 110]], '#8f7885', 3); ellipse(ctx, 640, 120, 110, 20, null, '#8f7885', 6);
  for (const x of [550, 595, 640, 685, 730]) { line(ctx, [[x, 118], [x, 152]], '#8f7885', 3); ellipse(ctx, x, 159, 4, 7, '#edd8b6'); }
  rect(ctx, 0, 535, 1280, 33, '#34263b', '#715367', 3);
}

function cellar(ctx) {
  // GLITCH's official still shows darkness, multicoloured eyes and one shaft
  // of light. No prison bars, masonry or archive doors are present there.
  rect(ctx, 0, 0, 1280, 720, '#08090c');
  ctx.save(); ctx.filter = 'blur(13px)';
  const shaft = ctx.createLinearGradient(0, 90, 0, FLOOR);
  shaft.addColorStop(0, '#c2c5dc4d'); shaft.addColorStop(0.8, '#9397ac33'); shaft.addColorStop(1, '#85899b0a');
  path(ctx, [[595, 90], [685, 90], [787, FLOOR], [493, FLOOR]], shaft);
  ctx.restore();
  ellipse(ctx, 640, 94, 45, 6, '#a3a7b43d');
  const colours = ['#a7ffff', '#d78eff', '#c7ff78', '#fcfa77', '#75b9ff'];
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < 13; i++) {
      const x = side ? 1280 - (25 + i * 59 % 212) : 25 + i * 59 % 212;
      const y = 54 + i * 97 % 490, rx = 7 + i * 3 % 9, ry = 5 + i * 5 % 12;
      ctx.save(); ctx.translate(x, y); ctx.rotate((i % 5 - 2) * 0.32);
      ellipse(ctx, 0, 0, rx, ry, colours[i % colours.length], '#142d39', 1.5);
      ellipse(ctx, side ? -rx * 0.22 : rx * 0.22, 1, Math.max(3, rx * 0.4), Math.max(3, ry * 0.52), '#f492ec');
      ellipse(ctx, side ? -rx * 0.25 : rx * 0.25, 1, Math.max(1.5, rx * 0.17), Math.max(2, ry * 0.3), '#123540');
      ctx.restore();
    }
  }
}

function voidStage(ctx) {
  // GLITCH gallery image: luminous, iridescent rectangular space. The EXIT
  // office corridor is a separate place and must not be drawn into the Void.
  gradient(ctx, '#c6c9f6', '#e7eaff', 720);
  const vanishing = [640, 334], tones = ['#f4d5f433', '#effdff55', '#b1bcf527', '#ffffff5c'];
  for (let i = 0; i < 42; i++) {
    const side = i % 4, depth = 0.13 + (i * 17 % 76) / 100;
    const w = 95 + i * 41 % 190, h = 15 + i * 31 % 80;
    let x = (i * 137 % 1540) - 130, y = (i * 97 % 900) - 90;
    if (side === 0) x = -60 + i * 19 % 240;
    if (side === 1) x = 1000 + i * 23 % 240;
    if (side === 2) y = -35 + i * 11 % 170;
    if (side === 3) y = 570 + i * 7 % 170;
    const project = ([px, py]) => [vanishing[0] + (px - vanishing[0]) * depth, vanishing[1] + (py - vanishing[1]) * depth];
    path(ctx, [[x, y], [x + w, y], project([x + w, y]), project([x, y])], tones[i % tones.length]);
    path(ctx, [[x, y], [x, y + h], project([x, y + h]), project([x, y])], tones[(i + 1) % tones.length]);
    line(ctx, [[x, y + 2], project([x, y + 2])], '#eeccf433', 3);
    line(ctx, [[x + 2, y], project([x + 2, y])], '#c4f4ff30', 4);
  }
  const radiance = ctx.createRadialGradient(640, 334, 30, 640, 334, 580);
  radiance.addColorStop(0, '#ffffffed'); radiance.addColorStop(0.4, '#ffffff8f'); radiance.addColorStop(1, '#f2f3ff00');
  rect(ctx, 0, 0, 1280, 720, radiance);
}

function lake(ctx) {
  gradient(ctx, '#667a9f', '#dfb5a3');
  ellipse(ctx, 900, 194, 62, 62, '#f1ce9b');
  for (let i = 0; i < 5; i++) ellipse(ctx, i * 310, 370 + i % 2 * 12, 235, 105, i % 2 ? '#778387' : '#697780');
  rect(ctx, 0, 378, 1280, 190, '#678897');
  for (let y = 390; y < 560; y += 14) for (let x = y % 50; x < 1280; x += 150) line(ctx, [[x, y], [x + 90 + y % 37, y]], '#b8b4b16f', 2);
  for (const x of [80, 1180]) {
    line(ctx, [[x, 378], [x, 568]], '#725957', 8);
    path(ctx, [[x - 115, 388], [x, 280], [x + 115, 388]], '#d29a9b', '#e2b9a4', 3);
    path(ctx, [[x - 40, 388], [x, 280], [x + 40, 388]], '#d6be9f');
  }
  for (let x = 190; x < 1110; x += 140) { rect(ctx, x, 501, 13, 67, '#53454e'); ellipse(ctx, x + 6, 504, 9, 4, '#a68770'); }
  line(ctx, [[195, 515], [1180, 515]], '#b9a487', 4);
  glow(ctx, 890, 390, 240, '#f1cba5', 0.17);
}

function training(ctx) {
  gradient(ctx, '#10182d', '#272342');
  for (let x = 0; x <= 1280; x += 64) line(ctx, [[x, 80], [x, FLOOR]], '#7184a21d', 1);
  for (let y = 120; y < 568; y += 48) line(ctx, [[0, y], [1280, y]], '#7184a21d', 1);
  for (const r of [140, 195, 240]) ellipse(ctx, 640, 335, r, r, null, '#7a81b526', 2);
  line(ctx, [[400, 335], [880, 335]], '#a9a0d64f', 2); line(ctx, [[640, 94], [640, 568]], '#a9a0d64f', 2);
  for (const x of [60, 1090]) {
    rect(ctx, x, 265, 130, 205, '#14192e', '#706792', 3);
    for (let i = 0; i < 6; i++) rect(ctx, x + 18, 287 + i * 23, 45 + i % 3 * 22, 4, i % 2 ? '#8c81b5' : '#8fb1bd');
    label(ctx, 'C&A', x + 65, 445, 24, '#9c92ba');
  }
  label(ctx, 'TRAINING SIMULATION', 640, 198, 18, '#9e9abd');
  for (let x = 80; x < 1280; x += 80) { line(ctx, [[x, FLOOR - 12], [x, FLOOR]], '#aaa1d1', 2); label(ctx, String(x), x, FLOOR - 19, 10, '#8a81ac'); }
}

function gloink(ctx) {
  gradient(ctx, '#1b1535', '#664468');
  for (let i = 0; i < 11; i++) {
    const x = i * 133 - 50, h = 80 + i % 4 * 42;
    path(ctx, [[x, 0], [x + 120, 0], [x + 60, h]], '#342541', '#604268', 3);
    path(ctx, [[x, FLOOR], [x + 40, FLOOR - 80 - i % 3 * 30], [x + 95, FLOOR]], '#4c3152', '#8b5776', 3);
  }
  ellipse(ctx, 640, 367, 310, 190, '#211830', '#9b6591', 15);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(380 + i * 70, 450 + i % 3 * 20); ctx.rotate(i * 0.7); rect(ctx, -21, -21, 42, 42, ['#a2a6c5', '#d59aa8', '#a9b594'][i % 3], '#272038', 3); ctx.restore(); }
  glow(ctx, 640, 460, 200, '#cb90da', 0.16);
}

function grounds(ctx) {
  gradient(ctx, '#686994', '#cda6ab');
  ellipse(ctx, 1040, 159, 52, 52, '#ead4a9');
  for (let i = 0; i < 6; i++) ellipse(ctx, i * 280 - 50, 510, 200, 110, i % 2 ? '#677b70' : '#7e8776');
  path(ctx, [[300, 420], [640, 165], [980, 420]], '#cb9d9f', '#9c7190', 6);
  for (let i = 0; i < 8; i++) path(ctx, [[640, 165], [300 + i * 85, 420], [385 + i * 85, 420]], i % 2 ? '#ae688d' : '#e0baad');
  rect(ctx, 325, 420, 630, 148, '#a87394'); arch(ctx, 545, 423, 190, 145, '#51425f');
  line(ctx, [[640, 165], [640, 105]], '#eedcb4', 4); path(ctx, [[642, 105], [712, 126], [642, 145]], '#cf90a5');
  for (let x = 70; x < 1280; x += 180) { rect(ctx, x, 491, 13, 77, '#c3ad94'); line(ctx, [[x, 508], [x + 180, 508]], '#c9b69e', 4); }
}

const scenes = { bigtop: circus, circus, candy, manor, cellar, void: voidStage, lake, training, gloink, grounds };

function makeBackground(stage) {
  const result = canvas(1280, 720), ctx = result.getContext('2d');
  const theme = stage.theme || stage.id || 'bigtop';
  if (!drawStageScenery(ctx, stage)) (scenes[theme] || circus)(ctx, stage);
  commonFloor(ctx, stage, theme);
  const edge = ctx.createRadialGradient(640, 350, 260, 640, 350, 800);
  edge.addColorStop(0, 'transparent'); edge.addColorStop(1, theme === 'void' ? '#a8a7eb15' : ['bigtop', 'circus'].includes(theme) ? '#194f7122' : ['backstage', 'spudsy', 'kingdom'].includes(theme) ? '#42152a38' : '#05061280');
  rect(ctx, 0, 0, 1280, 720, edge);
  return result;
}

function effectColor(tag, actor) {
  if (/counter|shield|guard|reflect/.test(tag || '')) return '#9ed8ea';
  if (/fire|explosive|rocket/.test(tag || '')) return '#efb987';
  if (/electric|psychic|glitch/.test(tag || '')) return '#b5a0ef';
  if (/sweet|candy|gummy/.test(tag || '')) return '#f2b5d4';
  return actor?.f?.color || '#ead7a0';
}

// These are readable illustrations of the existing fan-game move names, not
// new canonical attacks. Every shape stays separate from simulation bounds.
function objectMotif(ctx, motif, { color = '#ead7a0', heavy = false, phase = 0 } = {}) {
  const dark = '#28243c';
  if (motif === 'key') {
    ellipse(ctx, -7, 0, 6, 6, null, '#eac468', 3.5);
    line(ctx, [[-1, 0], [14, 0], [14, 5]], '#f7d777', 3.5);
    line(ctx, [[9, 0], [9, 4]], '#f7d777', 3);
  } else if (motif === 'button') {
    ellipse(ctx, 0, 0, 10, 10, '#6989ce', '#c8d7ef', 1.5);
    ellipse(ctx, 0, 0, 7.5, 7.5, null, '#344e86', 1);
    for (const x of [-3, 3]) for (const y of [-3, 3]) ellipse(ctx, x, y, 1.5, 1.5, dark);
    line(ctx, [[-3, -3], [3, 3]], '#f6dfaa', 1); line(ctx, [[3, -3], [-3, 3]], '#f6dfaa', 1);
  } else if (motif === 'comedy-mask') {
    ctx.beginPath(); ctx.moveTo(-10, -10); ctx.quadraticCurveTo(0, -7, 10, -10);
    ctx.quadraticCurveTo(12, 7, 0, 13); ctx.quadraticCurveTo(-12, 7, -10, -10);
    ctx.fillStyle = '#fff4e8'; ctx.fill(); ctx.strokeStyle = '#a78a98'; ctx.lineWidth = 1.5; ctx.stroke();
    ellipse(ctx, -4.5, -2, 2, 3, '#332638'); ellipse(ctx, 4.5, -2, 2, 3, '#332638');
    ctx.beginPath(); ctx.moveTo(-5, 5); ctx.quadraticCurveTo(0, 11, 5, 5); ctx.strokeStyle = '#6e2d42'; ctx.lineWidth = 2; ctx.stroke();
  } else if (motif === 'module') {
    path(ctx, [[-11, 8], [0, -12], [12, 7]], '#e58dc6', '#713d82', 1.5);
    ellipse(ctx, 10, -6, 4, 5, '#8ed6cc', dark, 1);
    line(ctx, [[-9, 9], [-13, 14]], '#f5d57c', 3);
  } else if (motif === 'gloink') {
    path(ctx, [[-10, -5], [1, -12], [12, -5], [1, 2]], '#f7dc52', dark, 1.2);
    path(ctx, [[-10, -5], [1, 2], [1, 13], [-10, 6]], '#e94c53', dark, 1.2);
    path(ctx, [[1, 2], [12, -5], [12, 6], [1, 13]], '#3e93df', dark, 1.2);
  } else if (motif === 'bubble') {
    const r = heavy ? 15 : 11;
    ellipse(ctx, 0, 0, r, r, '#bdbcf138', '#d6eafa', 1.5);
    ctx.beginPath(); ctx.arc(0, 0, r - 3, 3.45, 4.75); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r - 2, 0.3, 1.3); ctx.strokeStyle = '#b59bdf'; ctx.lineWidth = 2; ctx.stroke();
    ellipse(ctx, -r * 0.5, -r * 0.28, 1.4, 1.4, '#ffffff');
  } else if (motif === 'candy') {
    path(ctx, [[-8, -4], [-15, -8], [-13, 0], [-15, 8], [-8, 4]], '#eeb855', '#9c6633', 1);
    path(ctx, [[8, -4], [15, -8], [13, 0], [15, 8], [8, 4]], '#eeb855', '#9c6633', 1);
    roundedRect(ctx, -9, -7, 18, 14, 5, '#ca8633', '#f1cc70', 1.5);
    line(ctx, [[-5, -4], [5, -4]], '#ffdda0', 2);
  } else if (motif === 'sugar') {
    path(ctx, [[0, -13], [10, -4], [7, 9], [-3, 12], [-10, 1]], '#f3b6d6', '#fff3f1', 1.5);
    path(ctx, [[0, -13], [2, 0], [10, -4]], '#fff0f3');
    path(ctx, [[2, 0], [7, 9], [-3, 12]], '#bf83c1');
    line(ctx, [[-10, 1], [2, 0], [-3, 12]], '#fce2ed', 1);
  } else if (motif === 'fudge') {
    const r = heavy ? 14 : 11;
    ellipse(ctx, 0, 0, r, r * 0.85, '#69402e', '#b78351', 1.5);
    ellipse(ctx, r * 0.58, r * 0.54, r * 0.36, r * 0.27, '#69402e');
    ctx.beginPath(); ctx.ellipse(-r * 0.18, -r * 0.1, r * 0.62, r * 0.5, 0, 3.6, 5.2); ctx.strokeStyle = '#d0a275'; ctx.lineWidth = 2; ctx.stroke();
  } else if (motif === 'confetti') {
    for (let i = 0; i < 7; i++) {
      ctx.save(); ctx.translate((i * 11 % 25) - 12, (i * 7 % 21) - 10); ctx.rotate(i * 0.9 + phase * 0.2);
      rect(ctx, -2, -3, 4, 7, ['#ef5d77', '#fff0a3', '#8edcde', '#c49cf2'][i % 4]); ctx.restore();
    }
  } else if (motif === 'juggle') {
    ellipse(ctx, 0, 0, 10, 10, '#f1c74d', dark, 1.5);
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.clip();
    path(ctx, [[-11, -11], [0, -11], [0, 0], [-11, 11]], '#cf476a');
    path(ctx, [[0, 0], [11, -11], [11, 11], [0, 11]], '#4f78ce'); ctx.restore();
    ellipse(ctx, -3, -4, 2, 1.5, '#fff6b4');
  } else if (motif === 'trick-box') {
    roundedRect(ctx, -10, -8, 20, 19, 2, '#8c5fbc', '#d2abe8', 1.5);
    rect(ctx, -11, -10, 22, 5, '#ddb84f', '#8b6d31', 1);
    line(ctx, [[0, -5], [0, 11]], '#edcd74', 3);
    line(ctx, [[11, 2], [16, 2], [16, -1]], '#dab96c', 2);
  } else if (motif === 'pellet' || motif === 'spectral-shot') {
    const spectral = motif === 'spectral-shot';
    ellipse(ctx, 0, 0, spectral ? 12 : 8, spectral ? 3 : 3.5, spectral ? '#d2eff8' : '#e7dab6', spectral ? '#82aabe' : '#a9a1a3', 1);
    line(ctx, [[-12, 0], [-5, 0]], spectral ? '#93c4d6' : '#c0b3c3', 2);
  } else if (motif === 'corruption') {
    path(ctx, [[-9, -8], [-3, -12], [2, -6], [10, -8], [8, 2], [11, 8], [1, 7], [-5, 12], [-7, 3], [-12, 0]], '#231c34', '#71639a', 1);
    ellipse(ctx, 1, 0, 6, 4, '#d8f79d'); ellipse(ctx, 2, 0, 2, 3, '#e794e4'); ellipse(ctx, 2, 0, 1, 2, '#151328');
    rect(ctx, -14, -6, 4, 2, '#8dd6e2'); rect(ctx, 9, 9, 5, 2, '#e38bdc');
  } else ellipse(ctx, 0, 0, 8, 8, color, '#fff3db', 2);
}

function groundMotif(ctx, motif, options) {
  if (motif === 'ribbon-knot') {
    ctx.lineCap = 'round'; ctx.strokeStyle = '#d5495b'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-23, 3); ctx.bezierCurveTo(-5, 3, -19, -20, -6, -13);
    ctx.bezierCurveTo(7, -3, 14, -20, 19, -12); ctx.bezierCurveTo(28, 1, 5, 0, 24, 4); ctx.stroke();
    ellipse(ctx, 0, -5, 4, 3, '#f1747c', '#9a263e', 1.5);
    line(ctx, [[-1, -5], [-10, 7]], '#d5495b', 4); line(ctx, [[2, -5], [8, 6]], '#d5495b', 4);
  } else if (motif === 'gum' || motif === 'fudge-pool') {
    const fudge = motif === 'fudge-pool';
    ellipse(ctx, 0, 1, 27, 6, fudge ? '#69402e' : '#b97c32', fudge ? '#a37750' : '#f2c16b', 1.5);
    ellipse(ctx, -7, -3, 10, 5, fudge ? '#6e412e' : '#cf963d');
    ellipse(ctx, 9, -1, 7, 4, fudge ? '#7c5036' : '#daa342');
    line(ctx, [[-16, -1], [-9, -2]], fudge ? '#c19468' : '#ffe1a2', 1.5);
  } else if (motif === 'candy-tile') {
    path(ctx, [[-23, -4], [10, -9], [25, 2], [-8, 8]], '#e69cbd', '#ffdbe0', 2);
    line(ctx, [[-13, -5], [1, 6]], '#f9d9df', 3); line(ctx, [[1, -7], [15, 4]], '#f9d9df', 3);
  } else if (motif === 'gloink-nest') {
    for (const [x, y, scale, angle] of [[-14, -1, 0.7, -0.2], [12, -2, 0.75, 0.2], [0, -15, 0.8, 0]]) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(scale, scale); objectMotif(ctx, 'gloink', options); ctx.restore();
    }
  } else if (motif === 'hunting-trap') {
    ellipse(ctx, 0, 1, 22, 6, '#54616b', '#adbdc5', 2);
    for (let i = -3; i <= 3; i++) {
      path(ctx, [[i * 6 - 2, -2], [i * 6 + 1, -12 + Math.abs(i)], [i * 6 + 4, -2]], '#9baeb7', '#4e596a', 1);
    }
    ellipse(ctx, 0, 1, 7, 3, '#798b94');
  } else if (motif === 'stage-mark') {
    ellipse(ctx, 0, 0, 23, 7, null, '#e7bd65', 2);
    line(ctx, [[-12, -3], [12, 3]], '#f2dba0', 2); line(ctx, [[12, -3], [-12, 3]], '#f2dba0', 2);
    for (let i = 0; i < 4; i++) rect(ctx, -20 + i * 13, -12 - i % 2 * 4, 3, 5, ['#df5c82', '#86d4da', '#e4c46c', '#b795de'][i]);
  } else {
    ctx.translate(0, -11); objectMotif(ctx, motif, options);
  }
}

function pillow(ctx, x, y, w, h, angle, fill) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2);
  ctx.quadraticCurveTo(0, -h * 0.72, w / 2, -h / 2); ctx.quadraticCurveTo(w * 0.42, 0, w / 2, h / 2);
  ctx.quadraticCurveTo(0, h * 0.72, -w / 2, h / 2); ctx.quadraticCurveTo(-w * 0.42, 0, -w / 2, -h / 2);
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = '#79647f'; ctx.lineWidth = 2; ctx.stroke();
  line(ctx, [[-w / 2 + 5, -h / 2 + 5], [-w / 2 + 9, -h / 2 + 9]], '#f6e8d6', 2);
  line(ctx, [[w / 2 - 5, h / 2 - 5], [w / 2 - 9, h / 2 - 9]], '#b3a0b7', 1.5);
  ctx.restore();
}

export class CombatRenderer {
  constructor(target) {
    this.canvas = target;
    target.width = LOGICAL_WIDTH; target.height = LOGICAL_HEIGHT;
    this.ctx = target.getContext('2d');
    if (!this.ctx) throw new Error('Canvas 2D indisponible.');
    this.ctx.imageSmoothingEnabled = false;
    this.backgrounds = new Map();
    this.lastState = null;
  }

  async preload(fighters, stages = []) {
    const results = await Promise.allSettled((fighters || []).map(prepareFighter));
    for (const stage of stages) this.background(stage);
    return { ok: failures.size === 0 && results.every(r => r.status === 'fulfilled'), errors: [...failures.entries()].map(([src, error]) => ({ src, error })) };
  }

  background(stage) {
    const value = stage || { id: 'bigtop' };
    const key = `${value.id || value.theme}:${JSON.stringify(value.palette || {})}`;
    if (!this.backgrounds.has(key)) this.backgrounds.set(key, makeBackground(value));
    return this.backgrounds.get(key);
  }

  getFrame(fighter, action, tick, variant) { return getFrame(fighter, action, tick, variant); }
  drawPortrait(target, fighter, options) { return drawPortrait(target, fighter, options); }
  portrait(fighter, target, variant) { return drawPortrait(target, fighter, { variant }); }

  render(state, options = {}) {
    const ctx = this.ctx;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1280, 720);
    ctx.drawImage(this.background(options.stage || state?.stage), 0, 0);
    const tick = state?.frame || 0;
    drawStageMotion(ctx, options.stage || state?.stage, options.ambientFrame ?? tick, options.reducedMotion);
    if (!state) { ctx.restore(); return; }
    if (options.finisher && state.phase === 'matchOver') {
      drawFinisherScene(ctx, state, options.finisher, options.presentationFrame ?? 0, {
        reducedMotion: options.reducedMotion,
        drawActor: (actor, presentation) => this.drawActor(actor, tick, options.reducedMotion, presentation),
      });
      ctx.restore(); this.lastState = state; return;
    }
    const actors = state.a && state.b ? [state.a, state.b] : state.fighters || [];
    for (const object of state.traps || []) this.drawTrap(object, actors, tick, options.reducedMotion);
    const order = [...actors].sort((a, b) => (a.y || FLOOR) - (b.y || FLOOR));
    const presentation = { frame: tick, presentationFrame: options.presentationFrame ?? tick, phase: state.phase, winner: state.winner, roundWinner: state.roundWinner };
    for (const actor of order) this.drawActor(actor, tick, options.reducedMotion, presentation);
    for (const projectile of state.projectiles || []) this.drawProjectile(projectile, actors, tick, options.reducedMotion);
    for (const effect of state.fx || []) this.drawEffect(effect, actors, options.reducedMotion);
    if (options.hitboxes) for (const actor of actors) {
      const box = getHurtbox(actor), attack = getHitbox(actor);
      if (box) rect(ctx, box.x, box.y, box.w, box.h, '#7bc7d329', '#9ae1f1', 2);
      if (attack) rect(ctx, attack.x, attack.y, attack.w, attack.h, '#ffad5533', '#f5c286', 2);
    }
    ctx.restore(); this.lastState = state;
  }

  drawActor(actor, tick, reducedMotion, presentation = {}) {
    const ctx = this.ctx, f = actor.f || actor.def;
    if (!f) return;
    const pose = actorPose(actor, { frame: tick, ...presentation, reducedMotion });
    const frame = getFrame(f, pose.action, reducedMotion ? 0 : tick, null, pose.frame);
    const idle = getFrame(f, 'idle', 0);
    const height = f.visual?.height || f.combat?.simulationBody?.height || 230;
    const face = actor.face ?? actor.facing ?? 1;
    const y = Number.isFinite(actor.y) ? actor.y : FLOOR;
    const x = actor.x + (pose.xOffset || 0) * face;
    const groundDistance = Math.max(0, FLOOR - y);
    ellipse(ctx, x, FLOOR + 4, Math.max(23, (f.visual?.width || 80) * 0.5) * clamp(1 - groundDistance / 500, 0.4, 1), 10, '#03050b72');
    if (!frame || !idle) {
      ctx.save(); ctx.globalAlpha = 0.5; ellipse(ctx, x, y - height / 2, 28, height / 2, f.color || '#aaa0c3');
      label(ctx, f.name?.slice(0, 1) || '?', x, y - height * 0.5, 30, '#ffffff'); ctx.restore(); return;
    }
    const articulated = pose.low ? crouchParts(f, frame) : null;
    const geometry = frameGeometry(f, frame, idle, articulated ? { ...pose, lean: 0 } : pose, face);
    const shownHeight = height - (articulated?.drop || 0) * geometry.scale;
    const attack = actor.attack, active = pose.state === 'attack-active';
    const windup = pose.state === 'attack-windup';
    if (actor.buffs?.power || actor.buffs?.armor) glow(ctx, x, y - height * 0.52, height * 0.72, f.color || '#bd9cd6', 0.18);
    if (windup && attack.def.meter >= 30) {
      ctx.save(); ctx.globalAlpha = 0.22; ellipse(ctx, x, y - height * 0.52, height * 0.56, height * 0.56, null, f.color || '#c1a8eb', 4); ctx.restore();
    }
    ctx.save(); ctx.translate(x, y - geometry.support - (pose.lift || 0)); ctx.rotate(geometry.angle);
    ctx.scale(geometry.flip * geometry.scale, geometry.scale);
    ctx.translate(-geometry.anchor.x, -geometry.anchor.y);
    ctx.globalAlpha = pose.alpha * (actor.buffs?.cloak ? 0.42 : 1);
    ctx.imageSmoothingEnabled = false;
    drawPoseArtwork(ctx, frame, articulated);
    if (actor.flash > 0 && !reducedMotion) {
      // A subtle outline avoids overwriting the original sprite's palette.
      ctx.globalAlpha = Math.min(0.25, actor.flash / 28); ctx.strokeStyle = '#f2dfbf'; ctx.lineWidth = 3 / geometry.scale;
      ctx.strokeRect(frame.bounds.x, frame.bounds.y, frame.bounds.width, frame.bounds.height);
    }
    ctx.restore();
    if (pose.state === 'victory') ellipse(ctx, x, y + 4, Math.max(30, (f.visual?.width || 80) * 0.65), 12, null, '#f1cc7e9c', 2);
    if (actor.buffs?.barrier && f.id === 'kinger') {
      // Fort de coussins is the existing two-hit barrier. Pillows illustrate
      // that move without altering either the actor's sprite or hurtbox.
      ctx.save(); ctx.globalAlpha = 0.86;
      pillow(ctx, x - 49, y - 22, 54, 33, -0.13, '#d6bace');
      pillow(ctx, x + 50, y - 22, 54, 33, 0.13, '#ddd4b9');
      pillow(ctx, x - 42, y - 57, 50, 29, -0.42, '#e6d8be');
      pillow(ctx, x + 42, y - 57, 50, 29, 0.42, '#bcabce');
      ctx.restore();
    }
    if (pose.low) {
      // A static, downward stance cue keeps low-profile states readable for
      // unrigged costumes and morphologies. It does not depict a new limb pose
      // or claim that the visible sprite matches the simulation's hurtbox.
      const cueX = x + face * Math.max(49, (f.visual?.width || 80) * 0.6);
      line(ctx, [[cueX - 7, y - 31], [cueX, y - 24], [cueX + 7, y - 31]], '#c9e9f4d9', 2);
      line(ctx, [[cueX - 7, y - 23], [cueX, y - 16], [cueX + 7, y - 23]], '#c9e9f4d9', 2);
    }
    if (pose.state === 'guard' || pose.state === 'crouch' && actor.block) {
      ctx.save(); ctx.strokeStyle = '#b4dbefaa'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(x + face * 22, y - shownHeight * 0.48, 49, shownHeight * 0.5, 0, face > 0 ? -1.22 : 1.92, face > 0 ? 1.22 : 4.36); ctx.stroke(); ctx.restore();
    }
    if (active && attack.def.kind === 'melee') {
      const reach = clamp(attack.def.reach || 90, 40, 240), low = attack.def.level === 'low';
      ctx.save(); ctx.translate(x, y - (low ? 42 : height * 0.58)); ctx.scale(face, 1);
      ctx.globalAlpha = 0.45; ctx.strokeStyle = effectColor(attack.def.tag, actor); ctx.lineWidth = attack.name === 'heavy' || attack.name === 'super' ? 8 : 4;
      ctx.beginPath(); ctx.ellipse(26, 0, reach * 0.7, low ? 19 : 37, -0.15, -0.9, 0.9); ctx.stroke(); ctx.restore();
    }
    for (const [i, key] of Object.keys(actor.statuses || {}).slice(0, 3).entries()) {
      ellipse(ctx, x - 15 + i * 15, y - height - 19, 4, 4, key === 'burn' ? '#efb17a' : '#b9a3e4');
    }
  }

  drawProjectile(projectile, actors, tick, reducedMotion) {
    if (projectile.dead || projectile.delay > 0) return;
    const ctx = this.ctx, owner = actors[projectile.owner], tag = projectile.def?.tag || projectile.kind;
    const color = effectColor(tag, owner), x = projectile.x, y = projectile.y;
    const motif = projectilePresentation(projectile, owner);
    const radius = /explosive|rocket|psychic/.test(tag || '') ? 12 : 7;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = radius * 0.85; ctx.globalAlpha = 0.24;
    const trail = reducedMotion ? 12 : clamp(Math.abs(projectile.vx || 8) * 3, 18, 70);
    line(ctx, [[x - Math.sign(projectile.vx || 1) * trail, y - (projectile.vy || 0) * 2], [x, y]], color, radius * 0.85);
    ctx.globalAlpha = 1; ctx.translate(x, y);
    const spins = ['key', 'button', 'module', 'gloink', 'candy', 'sugar', 'juggle', 'corruption'].includes(motif);
    const phase = reducedMotion ? 0 : tick * 0.075;
    if (spins) ctx.rotate(phase);
    else if (['pellet', 'spectral-shot'].includes(motif)) ctx.rotate(Math.atan2(projectile.vy || 0, projectile.vx || 1));
    objectMotif(ctx, motif, { color, heavy: !!projectile.def?.fuse || projectile.def?.slot === 'super', phase });
    ctx.restore();
  }

  drawTrap(trap, actors, tick, reducedMotion) {
    if (trap.dead) return;
    const ctx = this.ctx, owner = actors[trap.owner], color = effectColor(trap.def?.tag, owner);
    const motif = trapPresentation(trap, owner), y = Number.isFinite(trap.y) ? trap.y : FLOOR;
    const armed = trap.age >= (trap.arm || 0);
    ctx.save(); ctx.globalAlpha = armed ? 0.9 : 0.38;
    ellipse(ctx, trap.x, y - 2, 26, 7, `${color}20`, null);
    ctx.translate(trap.x, y - 7);
    groundMotif(ctx, motif, { color, phase: reducedMotion ? 0 : tick * 0.025 });
    ctx.restore();
  }

  drawEffect(effect, actors, reducedMotion) {
    const ctx = this.ctx, life = clamp((effect.t || 0) / (effect.max || 40), 0, 1);
    if (life <= 0) return;
    const color = effectColor(effect.tag, actors[effect.owner || 0]);
    ctx.save(); ctx.globalAlpha = life * 0.85;
    if (effect.kind === 'text') {
      ctx.font = '800 16px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.shadowColor = '#050712'; ctx.shadowBlur = 5; ctx.fillStyle = color;
      ctx.fillText(effect.text || '', effect.x, effect.y - (reducedMotion ? 0 : (1 - life) * 22));
    } else if (effect.kind === 'guard' || effect.kind === 'ring') {
      const radius = reducedMotion ? 25 : 18 + (1 - life) * 47;
      ellipse(ctx, effect.x, effect.y, radius, radius * 1.1, null, color, 3 * life + 1);
    } else if (effect.kind === 'blast') {
      const radius = reducedMotion ? 40 : 25 + (1 - life) * 68;
      ellipse(ctx, effect.x, effect.y, radius, radius, null, color, 5);
      star(ctx, effect.x, effect.y, radius * 0.65, `${color}66`, reducedMotion ? 0 : life);
    } else {
      const radius = reducedMotion ? 19 : 15 + (1 - life) * 29;
      star(ctx, effect.x, effect.y, radius, color, reducedMotion ? 0 : life * 0.8);
      for (let i = 0; i < 5; i++) { const angle = i / 5 * TAU; line(ctx, [[effect.x + Math.cos(angle) * radius, effect.y + Math.sin(angle) * radius], [effect.x + Math.cos(angle) * radius * 1.4, effect.y + Math.sin(angle) * radius * 1.4]], color, 2); }
    }
    ctx.restore();
  }
}

export default CombatRenderer;

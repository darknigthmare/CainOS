import { getHurtbox, getHitbox } from './engine.mjs';

/**
 * Digital Circus combat presentation. Existing CainOS atlases are read without
 * changing their files. Static border removal follows app.js's matte-v2 flood
 * fill; the seven existing animation sheets use alpha bounds only. Their
 * interaction pose is reused for attacks until dedicated fight art is authored.
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
  return [spec.src, spec.cols, spec.rows, index, spec.component || 'all', animated ? 'alpha' : 'matte-v2'].join('|');
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
  const columns = Math.max(1, spec.cols || 1);
  const rows = Math.max(1, spec.rows || 1);
  const width = Math.floor(img.naturalWidth / columns);
  const height = Math.floor(img.naturalHeight / rows);
  const col = animated ? index % columns : spec.col || 0;
  const row = animated ? Math.floor(index / columns) : spec.row || 0;
  const source = canvas(width, height);
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, col * width, row * height, width, height, 0, 0, width, height);
  const pixels = ctx.getImageData(0, 0, width, height);
  const data = pixels.data;
  if (!animated) {
    // Same background criterion as CainOS. Only edge-connected matte pixels
    // are removed: white teeth, eyes and dark interior details remain intact.
    const corners = [0, width - 1, (height - 1) * width, width * height - 1]
      .map(i => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]])
      .filter(c => c[3] >= 12);
    const seen = new Uint8Array(width * height);
    const stack = new Int32Array(width * height);
    let length = 0;
    function push(x, y) {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const i = y * width + x;
      if (seen[i]) return;
      const p = i * 4, r = data[p], g = data[p + 1], b = data[p + 2];
      const isBackground = data[p + 3] < 12 || (r <= 24 && g <= 24 && b <= 24)
        || (Math.min(r, g, b) >= 202 && Math.max(r, g, b) - Math.min(r, g, b) <= 38)
        || corners.some(c => Math.hypot(r - c[0], g - c[1], b - c[2]) <= 58);
      if (!isBackground) return;
      seen[i] = 1;
      stack[length++] = i;
    }
    for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
    for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }
    while (length) {
      const i = stack[--length], x = i % width, y = Math.floor(i / width);
      data[i * 4 + 3] = 0;
      push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
    }
    cleanCellEdges(data, width, height, spec.component === 'largest');
    ctx.putImageData(pixels, 0, 0);
  }
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] < 12) continue;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  if (x1 < x0 || y1 < y0) { frames.set(key, null); return null; }
  const bounds = { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
  const pad = animated ? 12 : Math.max(2, Math.round(Math.min(width, height) * 0.018));
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad);
  x1 = Math.min(width - 1, x1 + pad); y1 = Math.min(height - 1, y1 + pad);
  const cropped = canvas(x1 - x0 + 1, y1 - y0 + 1);
  cropped.getContext('2d').drawImage(source, x0, y0, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  const frame = { canvas: cropped, width: cropped.width, height: cropped.height, x: x0, y: y0, bounds, sourceWidth: width, sourceHeight: height, animated };
  frames.set(key, frame);
  return frame;
}

function visualRecord(fighter, variant) {
  if (!variant) return fighter;
  const picked = typeof variant === 'object' ? variant : fighter.variants?.find(item => item.id === variant);
  if (!picked?.sprite) return fighter;
  return { ...fighter, ...picked, animation: picked.animation || null };
}

export function getFrame(fighter, action = 'idle', tick = 0, variant = null) {
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
  const index = sequence[Math.floor(Math.max(0, tick) / delay) % sequence.length];
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
function ellipse(ctx, x, y, rx, ry, fill, stroke = null, width = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function rect(ctx, x, y, w, h, fill, stroke = null, lineWidth = 1) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.strokeRect(x, y, w, h); }
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
  if (theme === 'lake') {
    gradient(ctx, '#735851', '#241d2c', 720);
    for (let y = FLOOR; y < 720; y += 28) { rect(ctx, 0, y, 1280, 25, y % 56 ? '#725342' : '#79583f'); line(ctx, [[0, y], [1280, y]], '#c19a6a', 2); }
    for (let x = 40; x < 1280; x += 140) for (let y = FLOOR + 10; y < 720; y += 28) ellipse(ctx, x, y, 2, 2, '#241b28');
  } else if (['candy', 'kingdom'].includes(theme)) floorTiles(ctx, '#9c5666', '#bc6e78', '#ffdeab');
  else if (theme === 'void') floorTiles(ctx, '#dddded', '#f2edf5', '#b8a7df');
  else if (theme === 'spudsy') floorTiles(ctx, '#423135', '#69514e', '#dcca88');
  else floorTiles(ctx, stage.palette?.floor || '#21192f', theme === 'manor' ? '#362638' : '#302244', stage.palette?.accent || '#8b66ac');
  ctx.restore();
  const fade = ctx.createLinearGradient(0, 620, 0, 720); fade.addColorStop(0, 'transparent'); fade.addColorStop(1, theme === 'void' ? '#c4bddb77' : '#070712d9');
  rect(ctx, 0, 620, 1280, 100, fade);
}

function circus(ctx) {
  gradient(ctx, '#241540', '#75517e');
  for (let i = 0; i < 12; i++) path(ctx, [[640, -70], [i * 125 - 130, 390], [i * 125, 390]], i % 2 ? '#773a67' : '#382447');
  rect(ctx, 0, 318, 1280, 250, '#3c244f');
  for (let x = 0; x < 1280; x += 98) arch(ctx, x + 9, 328, 78, 230, '#301e46', '#95658c', 4);
  arch(ctx, 459, 245, 362, 323, '#c9a55f', '#efd38f', 5);
  arch(ctx, 475, 260, 330, 308, '#201b38');
  path(ctx, [[480, 265], [627, 265], [575, 446], [481, 532]], '#9f335c');
  path(ctx, [[653, 265], [800, 265], [799, 532], [705, 446]], '#7a2c53');
  ellipse(ctx, 640, 315, 38, 38, '#392544', '#ebcb77', 4); star(ctx, 640, 315, 25, '#e8d08d');
  for (let x = 25; x < 1280; x += 46) { const y = 149 + Math.sin(x / 1280 * Math.PI) * 82; ellipse(ctx, x, y, 5, 5, x % 3 ? '#f4cb7c' : '#cdb5ff'); }
  for (const x of [120, 1130]) {
    line(ctx, [[x, 0], [x, 568]], '#b9a075', 5);
    for (let i = 0; i < 3; i++) ellipse(ctx, x + (i - 1) * 30, 370 + (i % 2) * 30, 23, 31, ['#df687d', '#af8cd7', '#edc56d'][i], '#42264d', 3);
    line(ctx, [[x - 30, 400], [x, 490], [x + 30, 400]], '#ba9cba', 1);
  }
  rect(ctx, 0, 544, 1280, 24, '#4c2b55');
  for (let x = 0; x < 1280; x += 48) star(ctx, x + 24, 556, 7, '#bd996e');
  glow(ctx, 640, 420, 300, '#e0b4ff', 0.17);
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

function spudsy(ctx) {
  gradient(ctx, '#2b1f30', '#a16c63');
  rect(ctx, 0, 160, 1280, 307, '#957565');
  for (let y = 166; y < 470; y += 32) for (let x = 0; x < 1280; x += 40) rect(ctx, x, y, 38, 30, (x / 40 + y / 32) % 2 > 0.5 ? '#a58973' : '#b39a7c');
  rect(ctx, 288, 120, 705, 163, '#47283a', '#d3a15f', 9);
  label(ctx, "SPUDSY'S", 640, 169, 35, '#f7d38a');
  for (let i = 0; i < 5; i++) {
    const x = 338 + i * 126;
    rect(ctx, x, 194, 100, 66, '#2b2634', '#725260', 2);
    ellipse(ctx, x + 26, 222, 15, 9, '#d5a65c'); rect(ctx, x + 12, 223, 29, 6, '#775c4d');
    line(ctx, [[x + 52, 211], [x + 85, 211]], '#b6a08a', 3); line(ctx, [[x + 52, 223], [x + 80, 223]], '#8c7a74', 3);
  }
  for (const x of [78, 1090]) {
    rect(ctx, x, 290, 120, 240, '#554343', '#342d35', 5);
    ellipse(ctx, x + 60, 357, 29, 29, '#778c90', '#bdb19a', 6); rect(ctx, x + 98, 417, 7, 36, '#bfb09a');
  }
  rect(ctx, 235, 430, 810, 116, '#703d41', '#291d2d', 4); rect(ctx, 222, 418, 836, 20, '#b5a18a', '#edcb9b', 3);
  for (let x = 262; x < 1030; x += 64) rect(ctx, x, 452, 4, 82, '#a66c58');
  rect(ctx, 355, 360, 70, 58, '#3a3540', '#b3a38d', 4); rect(ctx, 364, 369, 52, 24, '#9abbaf');
  for (let x = 825; x < 925; x += 15) rect(ctx, x, 370 - x % 3 * 3, 8, 39, '#e8b962');
  path(ctx, [[812, 388], [941, 388], [923, 417], [830, 417]], '#b8494b', '#e5bd7a', 3);
  rect(ctx, 0, 540, 1280, 28, '#3e2c34');
}

function cellar(ctx) {
  gradient(ctx, '#080c1a', '#23223c');
  for (let y = 80; y < 570; y += 45) for (let x = -65; x < 1280; x += 130) {
    const offset = Math.floor(y / 45) % 2 * 65;
    rect(ctx, x + offset, y, 127, 42, (x + y) % 3 ? '#24283a' : '#2d2d42', '#0e1223', 2);
  }
  arch(ctx, 320, 142, 640, 426, '#0c1023', '#51516a', 15);
  arch(ctx, 354, 175, 572, 393, '#111329', '#25283c', 14);
  for (let x = 390; x < 930; x += 52) rect(ctx, x, 195, 8, 373, '#474256', '#777083', 1);
  rect(ctx, 365, 310, 550, 11, '#51495d'); rect(ctx, 365, 456, 550, 11, '#51495d');
  for (const [x, y] of [[468, 365], [760, 405], [680, 272]]) { ellipse(ctx, x, y, 9, 5, '#d99ade'); ellipse(ctx, x + 23, y + 3, 9, 5, '#bea8f1'); }
  glow(ctx, 650, 510, 300, '#7964cf', 0.15);
  for (const x of [110, 1160]) { line(ctx, [[x, 0], [x + 20, 145], [x - 10, 225]], '#211e31', 7); ellipse(ctx, x - 10, 230, 22, 11, '#8f789b'); glow(ctx, x - 10, 242, 110, '#b3a2d9', 0.12); }
  path(ctx, [[0, 568], [85, 520], [186, 536], [272, 568]], '#353047'); path(ctx, [[1040, 568], [1110, 527], [1205, 521], [1280, 568]], '#353047');
}

function voidStage(ctx) {
  gradient(ctx, '#c6c4db', '#f6f1ef');
  for (const [x, y, w, h, turn] of [[170, 170, 82, 162, -0.12], [990, 290, 100, 190, 0.13], [583, 218, 118, 229, 0]]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(turn);
    rect(ctx, 0, 0, w, h, '#ebe2ef', '#b2a8c8', 7); rect(ctx, 8, 8, w - 16, h - 8, '#e4d7ed');
    rect(ctx, 0, -27, w, 25, '#ad798d'); label(ctx, 'EXIT', w / 2, -9, 15, '#fff1e1');
    ellipse(ctx, w - 18, h * 0.58, 4, 4, '#a188ad'); ctx.restore();
  }
  for (let i = 0; i < 9; i++) { const x = 300 + i * 35, y = 445 - i * 18; path(ctx, [[x, y], [x + 77, y - 6], [x + 77, y + 12], [x, y + 18]], i % 2 ? '#b9a4ce' : '#d3bfdd'); }
  for (let i = 0; i < 11; i++) { ctx.save(); ctx.translate(80 + i * 120, 95 + i % 4 * 84); ctx.rotate(i * 0.6); rect(ctx, -12, -12, 24, 24, ['#d5a5b9', '#b6bfda', '#dfc492'][i % 3]); ctx.restore(); }
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

function kingdom(ctx) {
  gradient(ctx, '#745579', '#dba9b0');
  for (const x of [170, 930]) {
    rect(ctx, x, 260, 180, 308, '#a87395', '#754d76', 4);
    path(ctx, [[x - 18, 267], [x + 90, 130], [x + 198, 267]], '#c292b3', '#f0c3bc', 5);
    arch(ctx, x + 57, 320, 66, 130, '#64506e', '#e5b9ae', 5);
  }
  rect(ctx, 350, 328, 580, 240, '#be8aa7', '#815a82', 4);
  for (let x = 365; x < 930; x += 65) rect(ctx, x, 301, 36, 39, '#cf9bb7', '#efc1bd', 3);
  arch(ctx, 515, 370, 250, 198, '#674761', '#f3d2b4', 12);
  for (let i = 0; i < 9; i++) ellipse(ctx, 110 + i * 135, 552, 65, 25, '#9c7589');
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

function backstage(ctx) {
  gradient(ctx, '#1c192b', '#413045');
  for (let x = 0; x < 1280; x += 80) rect(ctx, x, 0, 8, FLOOR, '#462d43');
  rect(ctx, 455, 182, 370, 325, '#302438', '#a88b72', 9);
  rect(ctx, 481, 208, 318, 268, '#616073', '#d2ad84', 4);
  for (let x = 470; x <= 810; x += 42) { ellipse(ctx, x, 193, 7, 7, '#efd5a3'); ellipse(ctx, x, 492, 7, 7, '#efd5a3'); }
  for (const x of [468, 812]) for (let y = 236; y < 470; y += 46) ellipse(ctx, x, y, 7, 7, '#efd5a3');
  rect(ctx, 410, 516, 460, 33, '#795264', '#bd957a', 4);
  for (const [x, y, w, h] of [[70, 420, 180, 148], [245, 480, 120, 88], [1010, 398, 205, 170]]) {
    rect(ctx, x, y, w, h, '#574452', '#ac8c71', 5); line(ctx, [[x + 10, y + 10], [x + w - 10, y + h - 10]], '#ac8c71', 4); line(ctx, [[x + w - 10, y + 10], [x + 10, y + h - 10]], '#ac8c71', 4);
  }
  for (const x of [165, 1120]) { line(ctx, [[x, 0], [x, 180]], '#8c758a', 3); ellipse(ctx, x, 199, 48, 19, null, '#b79a79', 7); }
}

const scenes = { bigtop: circus, circus, candy, manor, spudsy, cellar, void: voidStage, lake, training, gloink, kingdom, grounds, backstage };

function makeBackground(stage) {
  const result = canvas(1280, 720), ctx = result.getContext('2d');
  const theme = stage.theme || stage.id || 'bigtop';
  (scenes[theme] || circus)(ctx, stage);
  commonFloor(ctx, stage, theme);
  const edge = ctx.createRadialGradient(640, 350, 260, 640, 350, 800);
  edge.addColorStop(0, 'transparent'); edge.addColorStop(1, theme === 'void' ? '#64607835' : '#05061280');
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
    const tick = state?.frame || 0, time = options.reducedMotion ? 0 : tick / 60;
    const theme = options.stage?.theme || state?.stage?.theme || 'bigtop';
    if (!options.reducedMotion) {
      ctx.save(); ctx.globalAlpha = theme === 'void' ? 0.25 : 0.4;
      for (let i = 0; i < 22; i++) {
        const x = (i * 149 + Math.sin(time * 0.17 + i) * 12 + 1280) % 1280;
        const y = (i * 83 - time * (4 + i % 4) + 1000) % 500 + 45;
        ellipse(ctx, x, y, 1 + i % 3 * 0.5, 1 + i % 3 * 0.5, theme === 'void' ? '#9b8bb0' : '#d6bbd9');
      }
      ctx.restore();
    }
    if (!state) { ctx.restore(); return; }
    const actors = state.a && state.b ? [state.a, state.b] : state.fighters || [];
    for (const object of state.traps || []) this.drawTrap(object, actors, tick, options.reducedMotion);
    const order = [...actors].sort((a, b) => (a.y || FLOOR) - (b.y || FLOOR));
    for (const actor of order) this.drawActor(actor, tick, options.reducedMotion);
    for (const projectile of state.projectiles || []) this.drawProjectile(projectile, actors, tick, options.reducedMotion);
    for (const effect of state.fx || []) this.drawEffect(effect, actors, options.reducedMotion);
    if (options.hitboxes) for (const actor of actors) {
      const box = getHurtbox(actor), attack = getHitbox(actor);
      if (box) rect(ctx, box.x, box.y, box.w, box.h, '#7bc7d329', '#9ae1f1', 2);
      if (attack) rect(ctx, attack.x, attack.y, attack.w, attack.h, '#ffad5533', '#f5c286', 2);
    }
    ctx.restore(); this.lastState = state;
  }

  drawActor(actor, tick, reducedMotion) {
    const ctx = this.ctx, f = actor.f || actor.def;
    if (!f) return;
    const action = actor.hit > 0 ? 'hurt' : actor.attack ? 'attack' : actor.state === 'walk' ? 'walk' : 'idle';
    const frame = getFrame(f, action, reducedMotion ? 0 : tick);
    const idle = getFrame(f, 'idle', 0);
    const height = f.visual?.height || f.combat?.simulationBody?.height || 230;
    const face = actor.face ?? actor.facing ?? 1;
    const y = Number.isFinite(actor.y) ? actor.y : FLOOR;
    const x = actor.x;
    const groundDistance = Math.max(0, FLOOR - y);
    ellipse(ctx, x, FLOOR + 4, Math.max(23, (f.visual?.width || 80) * 0.5) * clamp(1 - groundDistance / 500, 0.4, 1), 10, '#03050b72');
    if (!frame || !idle) {
      ctx.save(); ctx.globalAlpha = 0.5; ellipse(ctx, x, y - height / 2, 28, height / 2, f.color || '#aaa0c3');
      label(ctx, f.name?.slice(0, 1) || '?', x, y - height * 0.5, 30, '#ffffff'); ctx.restore(); return;
    }
    const baseScale = height / Math.max(1, idle.bounds.height);
    const originX = idle.bounds.x + idle.bounds.width / 2;
    const originY = idle.bounds.y + idle.bounds.height;
    const dx = (frame.x - originX) * baseScale, dy = (frame.y - originY) * baseScale;
    const dw = frame.width * baseScale, dh = frame.height * baseScale;
    const moving = actor.state === 'walk';
    const walk = reducedMotion ? 0 : Math.sin(tick * 0.32 + actor.slot * 2);
    const crouch = actor.crouch ? 0.58 : 1;
    const attack = actor.attack, active = attack && attack.t >= attack.def.startup && attack.t < attack.def.startup + attack.def.active;
    const windup = attack && attack.t < attack.def.startup;
    let lean = actor.hit ? -0.13 * face : windup ? -0.055 * face : active ? 0.07 * face : moving ? walk * 0.018 : 0;
    if (reducedMotion) lean = 0;
    const bob = reducedMotion ? 0 : moving ? -Math.abs(walk) * 2.5 : Math.sin(tick * 0.045 + actor.slot) * 0.8;
    if (actor.buffs?.power || actor.buffs?.armor) glow(ctx, x, y - height * 0.52, height * 0.72, f.color || '#bd9cd6', 0.18);
    if (windup && attack.def.meter >= 30) {
      ctx.save(); ctx.globalAlpha = 0.22; ellipse(ctx, x, y - height * 0.52, height * 0.56, height * 0.56, null, f.color || '#c1a8eb', 4); ctx.restore();
    }
    ctx.save(); ctx.translate(x + (active ? face * 7 : 0), y + bob); ctx.rotate(lean);
    ctx.scale(face * (f.sprite?.nativeFacing || 1), crouch);
    if (actor.buffs?.cloak) ctx.globalAlpha = 0.42;
    ctx.imageSmoothingEnabled = false;
    ctx.shadowColor = '#080514a8'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 5;
    ctx.drawImage(frame.canvas, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    if (actor.flash > 0 && !reducedMotion) {
      // A subtle outline avoids overwriting the original sprite's palette.
      ctx.globalAlpha = Math.min(0.25, actor.flash / 28); ctx.strokeStyle = '#f2dfbf'; ctx.lineWidth = 3;
      ctx.strokeRect(dx + 4, dy + 4, dw - 8, dh - 8);
    }
    ctx.restore();
    if (actor.block || actor.state === 'guard') {
      ctx.save(); ctx.strokeStyle = '#b4dbefaa'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(x + face * 22, y - height * 0.48 * crouch, 49, height * 0.5 * crouch, 0, face > 0 ? -1.22 : 1.92, face > 0 ? 1.22 : 4.36); ctx.stroke(); ctx.restore();
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
    const radius = /explosive|rocket|psychic/.test(tag || '') ? 12 : 7;
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = radius * 0.85; ctx.globalAlpha = 0.24;
    const trail = reducedMotion ? 12 : clamp(Math.abs(projectile.vx || 8) * 3, 18, 70);
    line(ctx, [[x - Math.sign(projectile.vx || 1) * trail, y - (projectile.vy || 0) * 2], [x, y]], color, radius * 0.85);
    ctx.globalAlpha = 1; ctx.translate(x, y); ctx.rotate(reducedMotion ? 0 : tick * 0.12);
    if (/candy|sweet|gummy/.test(tag || '')) { path(ctx, [[-radius, -radius], [radius, -radius], [radius, radius], [-radius, radius]], color, '#ffeadc', 2); }
    else if (/glitch|digital/.test(tag || '')) { rect(ctx, -radius, -radius, radius * 2, radius * 2, color); rect(ctx, radius, -radius / 2, radius, radius, '#ded0ff'); }
    else { ellipse(ctx, 0, 0, radius, radius, color, '#fff3db', 2); }
    ctx.restore();
  }

  drawTrap(trap, actors, tick, reducedMotion) {
    if (trap.dead) return;
    const ctx = this.ctx, color = effectColor(trap.def?.tag, actors[trap.owner]);
    const armed = trap.age >= (trap.arm || 0);
    ctx.save(); ctx.globalAlpha = armed ? 0.75 : 0.35;
    ellipse(ctx, trap.x, (trap.y || FLOOR) - 6, 24, 8, `${color}33`, color, 2);
    ctx.translate(trap.x, (trap.y || FLOOR) - 19); ctx.rotate(reducedMotion ? 0 : tick * 0.025);
    star(ctx, 0, 0, 13, color); ctx.restore();
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

/**
 * Static scenery recomposed for a 1280 × 720 side-view arena.
 * Visual provenance and its limits live in docs/combat-stage-review-0.6.0.json.
 * These drawings do not change collision geometry or claim a measured set plan.
 */
export const SCENERY_FLOOR = 568;
export const SCENERY_VERSION = '0.6.0';
const TAU = Math.PI * 2;
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};

// Shared by the static drawing and the small, clipped ambient layer. A light
// should illuminate its fixture; steam should rise from the cooking surface.
export const SCENERY_ANCHORS = freeze({
  backstage: { lights: [[640, 55, 18], [640, 150, 12], [640, 225, 7]], vanishing: [640, 338] },
  spudsy: { steam: [[283, 402], [306, 402], [329, 402], [352, 402]] },
  manor: { candles: [[348, 360], [379, 360], [410, 360], [874, 360], [905, 360], [936, 360]] },
});

function poly(ctx, points, fill, stroke, width = 1) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function rect(ctx, x, y, w, h, fill, stroke, width = 1) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.strokeRect(x, y, w, h); }
}
function oval(ctx, x, y, rx, ry, fill, stroke, width = 1) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function line(ctx, points, color, width = 1) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function round(ctx, x, y, w, h, radius, fill, stroke, width = 1) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function arch(ctx, x, y, w, h, fill, stroke, width = 1) {
  ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2);
  ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
}
function gradient(ctx, x0, y0, x1, y1, colors) {
  const result = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach(([at, color]) => result.addColorStop(at, color)); return result;
}
function text(ctx, value, x, y, size, color, align = 'center') {
  ctx.font = `800 ${size}px system-ui, sans-serif`; ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(value, x, y);
}

// Small painted door emblems, not combat sprites or claimed portrait copies.
function residentEmblem(ctx, identity, x, y, scale) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  oval(ctx, 0, 0, 22, 28, '#fff1d8', '#d2ac75', 2);
  if (identity === 'jax') {
    oval(ctx, -7, -24, 4, 14, '#a978cc'); oval(ctx, 7, -24, 4, 14, '#a978cc');
    oval(ctx, 0, -2, 15, 14, '#a978cc');
    oval(ctx, -6, -5, 4, 2, '#f6d878'); oval(ctx, 6, -5, 4, 2, '#f6d878');
    round(ctx, -9, 1, 18, 6, 3, '#f6d878');
  } else if (identity === 'ragatha') {
    for (let i = 0; i < 8; i++) oval(ctx, -16 + i * 4.6, -7 + Math.abs(i - 3.5), 5, 13, '#bd4447');
    oval(ctx, 0, -2, 13, 16, '#f2c8a4'); oval(ctx, -5, -3, 4, 4, '#4e86b9'); oval(ctx, 6, -3, 3, 4, '#f6eee4');
    line(ctx, [[-5, 7], [2, 9], [7, 5]], '#9d5c51', 1.5);
    poly(ctx, [[0, -19], [-13, -29], [-11, -16]], '#6f98c9'); poly(ctx, [[0, -19], [12, -29], [12, -16]], '#6f98c9');
  } else if (identity === 'gangle') {
    oval(ctx, 0, -1, 14, 18, '#f9f4eb', '#74616d');
    oval(ctx, -5, -4, 3, 5, '#3e3045'); oval(ctx, 5, -4, 3, 5, '#3e3045');
    ctx.beginPath(); ctx.arc(0, 10, 6, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = '#6f3945'; ctx.lineWidth = 2; ctx.stroke();
    line(ctx, [[-8, 17], [5, 21], [-5, 24]], '#ce4148', 3);
  } else if (identity === 'kinger') {
    round(ctx, -12, -19, 24, 40, 6, '#d9b775', '#ad824d');
    rect(ctx, -4, -31, 8, 15, '#dfbd80'); rect(ctx, -10, -27, 20, 6, '#dfbd80');
    oval(ctx, -7, -2, 7, 9, '#fff6e4'); oval(ctx, 7, -2, 7, 9, '#fff6e4');
    oval(ctx, -5, -1, 2, 4, '#3c3442'); oval(ctx, 5, -1, 2, 4, '#3c3442');
  } else if (identity === 'zooble') {
    poly(ctx, [[-16, -20], [17, -14], [4, 19]], '#ec89b3', '#744472');
    oval(ctx, -4, -5, 7, 7, '#f7d76f'); oval(ctx, 9, 0, 6, 8, '#ece4f4');
    oval(ctx, -4, -5, 2, 3, '#5a3c64'); line(ctx, [[6, -30], [11, -19]], '#759ec2', 4);
  } else {
    // Kaufmo's round clown badge is present in the inspected corridor copy.
    poly(ctx, [[-12, -17], [0, -36], [10, -17]], '#e3c15d', '#bd914d');
    oval(ctx, 0, 0, 14, 18, '#f9f0db'); oval(ctx, -5, -3, 2, 4, '#665144'); oval(ctx, 5, -3, 2, 4, '#665144');
    oval(ctx, 0, 3, 4, 4, '#dd634e');
    ctx.beginPath(); ctx.arc(0, 5, 8, 0.1, Math.PI - 0.1); ctx.strokeStyle = '#dc634d'; ctx.lineWidth = 3; ctx.stroke();
    poly(ctx, [[-10, 16], [0, 20], [10, 16], [8, 25], [-8, 25]], '#8abdd2');
  }
  ctx.restore();
}

function hallway(ctx) {
  // Long rose/red/orange corridor, wood doors and picture frames: inspected
  // copies attributed to the pilot; direct video comparison remains pending.
  rect(ctx, 0, 0, 1280, SCENERY_FLOOR, '#cf3f46');
  poly(ctx, [[0, 0], [1280, 0], [744, 249], [536, 249]], '#c65362');
  poly(ctx, [[0, 0], [1280, 0], [690, 211], [590, 211]], '#e48888');
  for (const x of [160, 390, 890, 1120]) line(ctx, [[x, 0], [640 + (x - 640) * 0.12, 244]], '#9f3346', 6);
  rect(ctx, 535, 245, 210, 207, '#df566c');
  for (let x = 536; x < 745; x += 35) rect(ctx, x, 245, 18, 207, '#edac6d');
  arch(ctx, 579, 296, 122, 155, '#ed493a', '#f56d4a', 9);
  arch(ctx, 590, 309, 100, 142, '#331c32', '#b33332', 4);
  for (let x = 597; x < 690; x += 13) rect(ctx, x, 323, 5, 128, '#5e263e');
  poly(ctx, [[552, 442], [728, 442], [829, 568], [451, 568]], '#eb5b55');
  const project = (side, t, v) => {
    const x = -100 + t * 636, top = -105 + t * 350, bottom = 568 - t * 116;
    return [side === -1 ? x : 1280 - x, top + (bottom - top) * v];
  };
  const pane = (side, t0, t1, v0, v1, fill, stroke, width = 1) => poly(ctx, [project(side, t0, v0), project(side, t1, v0), project(side, t1, v1), project(side, t0, v1)], fill, stroke, width);
  const identities = [['ragatha', 'gangle', 'kinger'], ['kaufmo', 'jax', 'zooble']];
  for (const [sideIndex, side] of [-1, 1].entries()) {
    pane(side, 0, 1, 0, 1, '#e785ac');
    for (let i = 0; i < 18; i++) {
      const t = i / 18;
      pane(side, t, t + 0.034, 0, 1, i % 3 === 0 ? '#e49660' : '#d94343');
      if (i % 3 === 0) pane(side, t + 0.034, t + 0.044, 0, 1, '#f9b46a');
    }
    pane(side, 0, 1, 0.96, 1, '#e6a15e');
    pane(side, 0, 1, 0.02, 0.045, '#faad78');
    const doors = [[0.13, 0.34], [0.50, 0.64], [0.79, 0.88]];
    for (const [index, [a, b]] of doors.entries()) {
      pane(side, a - 0.018, b + 0.018, 0.43, 0.97, '#b72e34', '#e2463c', 2);
      pane(side, a, b, 0.46, 0.96, '#854323', '#5d2c1e', 2);
      for (let grain = 0; grain < 12; grain++) pane(side, a + (b - a) * grain / 12, a + (b - a) * (grain + 0.3) / 12, 0.47, 0.95, grain % 2 ? '#a26338' : '#713b25');
      for (const [y0, y1] of [[0.49, 0.7], [0.75, 0.92]]) {
        pane(side, a + 0.018, (a + b) / 2 - 0.008, y0, y1, null, '#b77d48', 1.5);
        pane(side, (a + b) / 2 + 0.008, b - 0.018, y0, y1, null, '#b77d48', 1.5);
      }
      const center = project(side, (a + b) / 2, 0.6), handle = project(side, side === -1 ? b - 0.02 : a + 0.02, 0.77);
      residentEmblem(ctx, identities[sideIndex][index], center[0], center[1], [0.9, 0.67, 0.43][index]);
      oval(ctx, handle[0], handle[1], 4.5 - index, 5.5 - index, '#f0b95c', '#a55527');
    }
    // Abstract pictures preserve the observed framed-art motif. Their exact
    // subjects and the door order are authored for this camera, not certified.
    for (const [index, [a, b, y0, y1]] of [[0.02, 0.14, 0.19, 0.43], [0.37, 0.49, 0.16, 0.51], [0.67, 0.78, 0.15, 0.44], [0.9, 0.97, 0.23, 0.52]].entries()) {
      pane(side, a, b, y0, y1, '#f3d5a0', '#c49a62', 2);
      pane(side, a + 0.009, b - 0.009, y0 + 0.025, y1 - 0.025, ['#232b6d', '#251a44', '#147f8d', '#faad35'][index]);
      const cx = (a + b) / 2, cy = (y0 + y1) / 2;
      pane(side, a + 0.015, cx, cy, y1 - 0.045, '#db3a62');
      pane(side, cx, b - 0.018, y0 + 0.05, cy + 0.025, '#5fbaba');
      const point = project(side, cx, cy); oval(ctx, point[0], point[1], 10 - index * 1.5, 16 - index * 2, '#f4bf49');
    }
    pane(side, 0, 1, 0.94, 0.96, '#b7553e');
  }
  for (const side of [-1, 1]) {
    const x = 640 + side * 101;
    oval(ctx, x, 430, 16, 8, '#a75d2d'); round(ctx, x - 11, 407, 22, 23, 5, '#ce853b');
    for (let i = 0; i < 5; i++) line(ctx, [[x, 408], [x + (i - 2) * 10, 387 - Math.abs(i - 2) * 3]], '#568d52', 4);
    for (let i = 0; i < 3; i++) rect(ctx, 640 + side * (103 + i * 17) - 8, 447 - i % 2 * 13, 17, 18, ['#f6c844', '#814cd1', '#4ab5a9'][i], '#e78a73', 1.5);
  }
  for (const [x, y, radius] of SCENERY_ANCHORS.backstage.lights) {
    oval(ctx, x, y + 4, radius * 1.3, radius * 0.6, '#b97957');
    oval(ctx, x, y, radius, radius * 0.65, '#fff1ce', '#f7c887', 2);
  }
}

function burger(ctx, x, y, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  oval(ctx, 0, -7, 27, 14, '#f4c267'); rect(ctx, -27, -8, 54, 7, '#f4c267');
  for (const dx of [-14, -3, 10]) line(ctx, [[dx, -15], [dx + 3, -16]], '#fff0c3', 2);
  rect(ctx, -28, -2, 56, 5, '#6e9d43'); rect(ctx, -27, 3, 54, 7, '#6b3429');
  poly(ctx, [[-25, 3], [26, 3], [16, 9], [-4, 5], [-17, 10]], '#f8bd47');
  round(ctx, -27, 10, 54, 10, 5, '#dda354'); ctx.restore();
}

function spudsy(ctx) {
  // Official distributor thumbnail for episode 4: yellow menu panels,
  // burgundy fascia, pale countertop/red front, open stainless kitchen.
  rect(ctx, 0, 0, 1280, SCENERY_FLOOR, '#ece5d7');
  rect(ctx, 0, 0, 1280, 277, gradient(ctx, 0, 0, 0, 277, [[0, '#5b192b'], [1, '#a3313c']]));
  rect(ctx, 0, 123, 1280, 8, '#d5b585');
  text(ctx, "SPUDSY'S", 640, 114, 28, '#ffe3a2');
  for (let i = 0; i < 5; i++) {
    const x = 141 + i * 201;
    round(ctx, x, 143, 192, 122, 3, '#45242a', '#361a25', 3);
    rect(ctx, x + 5, 148, 182, 112, gradient(ctx, x, 149, x + 120, 260, [[0, '#fff0ab'], [0.62, '#f4cc7f'], [1, '#dda15c']]));
    text(ctx, ['BURGERS', 'FRITES', 'MENUS', 'BOISSONS', 'SPUDSY’S'][i], x + 96, 169, 15, '#9c3c3e');
    if (i === 1) {
      for (let j = 0; j < 8; j++) rect(ctx, x + 50 + j * 7, 186 + j % 3 * 3, 5, 42, '#e9a934');
      poly(ctx, [[x + 44, 210], [x + 108, 210], [x + 99, 240], [x + 53, 240]], '#bd3941');
    } else if (i === 3) {
      poly(ctx, [[x + 64, 193], [x + 113, 193], [x + 105, 240], [x + 72, 240]], '#f5ece0', '#d09a72', 2);
      rect(ctx, x + 64, 207, 49, 8, '#b83a40'); line(ctx, [[x + 88, 195], [x + 90, 180], [x + 108, 180]], '#b63c40', 3);
    } else burger(ctx, x + 89, 213, i === 4 ? 0.9 : 1.15);
    line(ctx, [[x + 128, 200], [x + 173, 200]], '#a86646', 3); line(ctx, [[x + 130, 211], [x + 165, 211]], '#bb8152', 2);
  }
  rect(ctx, 0, 276, 1280, 160, '#c9cbbe');
  for (let y = 280; y < 436; y += 25) for (let x = 0; x < 1280; x += 46) rect(ctx, x + 1, y + 1, 44, 23, (x / 46 + y / 25) % 2 > 1 ? '#e9e7db' : '#deded3');
  // Open pass, ventilation hood, shelving and equipment create depth.
  rect(ctx, 483, 283, 319, 144, '#b7b7a9', '#f5ead5', 10);
  rect(ctx, 501, 293, 285, 116, '#727b70'); rect(ctx, 506, 303, 275, 22, '#d8ddce');
  for (const y of [335, 366, 398]) { rect(ctx, 507, y, 274, 7, '#eff0db'); rect(ctx, 510, y + 7, 269, 5, '#929c90'); }
  for (let x = 533; x < 780; x += 52) { rect(ctx, x, 348, 31, 17, '#e9dfc8'); rect(ctx, x + 4, 373, 23, 23, '#cbbda2'); }
  poly(ctx, [[143, 277], [405, 277], [438, 318], [110, 318]], '#9ca7a2', '#d5dfd4', 3);
  rect(ctx, 110, 318, 328, 14, '#707e79');
  for (let x = 123; x < 425; x += 18) line(ctx, [[x, 317], [x + 12, 286]], '#ccd2c9', 3);
  rect(ctx, 147, 376, 288, 47, '#a1aca4', '#6c7a72', 2);
  rect(ctx, 168, 368, 126, 12, '#5e675e');
  for (let x = 173; x < 290; x += 12) line(ctx, [[x, 368], [x + 7, 380]], '#c1b7a3', 2);
  rect(ctx, 270, 399, 97, 15, '#4e574d', '#d2d7c8', 2);
  for (const x of [303, 342]) { rect(ctx, x, 390, 20, 14, '#b9b8a2', '#69776c', 1); line(ctx, [[x + 10, 391], [x + 10, 380], [x + 22, 380]], '#605f52', 2); }
  rect(ctx, 868, 288, 165, 109, '#51534b', '#adb1a2', 3);
  rect(ctx, 879, 297, 142, 25, '#7c4940');
  for (let i = 0; i < 4; i++) { rect(ctx, 887 + i * 33, 334, 20, 27, ['#b24142', '#d4a34b', '#668378', '#a26445'][i]); rect(ctx, 892 + i * 33, 363, 9, 10, '#1f2927'); }
  rect(ctx, 861, 395, 181, 13, '#a9b1a6');
  for (const x of [77, 1179]) { rect(ctx, x, 277, 24, 160, '#f0eadb'); rect(ctx, x + 20, 277, 10, 160, '#b5b6a9'); }
  // Service objects remain behind the fighters and above the fixed floor.
  for (const [x, color] of [[122, '#bc3039'], [141, '#dcac3f']]) { round(ctx, x, 397, 14, 35, 3, color); rect(ctx, x + 4, 389, 6, 10, color); }
  round(ctx, 1057, 365, 98, 61, 4, '#343b37', '#737b6f', 3);
  rect(ctx, 1066, 374, 78, 30, '#6a8478'); rect(ctx, 1100, 425, 10, 10, '#474c43');
  poly(ctx, [[1000, 397], [1034, 397], [1030, 432], [1005, 432]], '#fff1d9', '#c3b09b'); rect(ctx, 1001, 408, 32, 6, '#b6373f');
  rect(ctx, 42, 433, 1196, 31, '#e8dfc9'); rect(ctx, 34, 431, 1212, 7, '#fff4d9');
  rect(ctx, 49, 464, 1182, 104, gradient(ctx, 0, 464, 0, 568, [[0, '#c43c3c'], [0.5, '#ad2935'], [1, '#852334']]));
  rect(ctx, 49, 480, 1182, 8, '#f5cd83'); rect(ctx, 49, 521, 1182, 6, '#e8bd78');
  rect(ctx, 49, 557, 1182, 11, '#d9c6a7');
  oval(ctx, 640, 514, 51, 51, '#ffc85d', '#fff0b9', 4); oval(ctx, 640, 514, 43, 43, '#ae3438', '#e3a445', 2);
  text(ctx, 'S', 640, 533, 57, '#ffe79c');
}

function icingScroll(ctx, x, y, direction, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(direction * scale, scale);
  ctx.beginPath(); ctx.moveTo(0, 40); ctx.bezierCurveTo(60, 38, 76, -20, 34, -31);
  ctx.bezierCurveTo(4, -39, -4, -6, 21, 0); ctx.bezierCurveTo(38, 4, 43, -14, 29, -17);
  ctx.strokeStyle = '#f5acc2'; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.stroke();
  ctx.strokeStyle = '#ffd2ce'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
}

function kingdom(ctx) {
  // GLITCH gallery court still: pink/red confectionery, broad archways,
  // pale icing curls, round ornaments and recessed arched windows.
  rect(ctx, 0, 0, 1280, SCENERY_FLOOR, gradient(ctx, 0, 0, 0, SCENERY_FLOOR, [[0, '#b96fc6'], [0.45, '#e98cae'], [1, '#ee8c96']]));
  rect(ctx, 111, 130, 1058, 411, '#a92954');
  rect(ctx, 111, 259, 1058, 18, '#d9637d'); rect(ctx, 111, 277, 1058, 8, '#6e2044');
  for (let x = 123; x < 1170; x += 51) { rect(ctx, x, 111, 26, 31, '#be4669', '#e7768c', 2); oval(ctx, x + 13, 108, 10, 6, '#e897ac'); }
  for (const x of [154, 252, 350, 837, 935, 1033]) {
    arch(ctx, x, 163, 55, 83, '#5d2448', '#cc5779', 5);
    arch(ctx, x + 8, 173, 39, 71, '#78234c'); line(ctx, [[x + 28, 174], [x + 28, 241]], '#aa4168', 3);
    oval(ctx, x + 28, 263, 13, 13, '#ce6ba0', '#9b386d', 3);
  }
  for (const x of [174, 921]) {
    arch(ctx, x, 319, 181, 222, '#792148', '#cb426d', 12);
    arch(ctx, x + 17, 335, 147, 206, '#96254d', '#e8789c', 4);
    rect(ctx, x + 42, 414, 97, 127, '#61203b');
    for (let dx = 48; dx < 140; dx += 22) rect(ctx, x + dx, 416, 4, 125, '#a94466');
    oval(ctx, x + 90, 302, 31, 18, '#db75ab', '#a84078', 5);
  }
  // Recessed central portal with thick icing borders and curled crown.
  arch(ctx, 400, 233, 480, 313, '#b93360', '#e37c94', 14);
  arch(ctx, 430, 263, 420, 283, '#d65d7f', '#f3a5b3', 7);
  arch(ctx, 465, 292, 350, 254, '#8f224a', '#ed8ca1', 8);
  arch(ctx, 491, 318, 298, 228, '#b93e66', '#f6b5bc', 5);
  line(ctx, [[640, 326], [640, 546]], '#6f2047', 3);
  for (const x of [548, 713]) arch(ctx, x, 381, 33, 126, '#9a2c55', '#d26884', 3);
  for (let side = -1; side <= 1; side += 2) {
    icingScroll(ctx, 640 + side * 56, 209, side, 1.1);
    icingScroll(ctx, 640 + side * 160, 245, side, 0.85);
    icingScroll(ctx, 640 + side * 229, 308, side, 0.65);
  }
  oval(ctx, 640, 204, 23, 28, '#e97eab', '#f6bac5', 6);
  // Near pillars frame the composition and make the courtyard read in depth.
  for (const side of [-1, 1]) {
    const x = side === -1 ? 28 : 1125;
    rect(ctx, x, 0, 127, 523, gradient(ctx, x, 0, x + 127, 0, [[0, '#872043'], [0.32, '#dc4c69'], [0.76, '#b82f55'], [1, '#741c3e']]));
    rect(ctx, x - 15, 420, 157, 20, '#e3677c'); rect(ctx, x - 20, 501, 167, 24, '#9c2b4c');
    rect(ctx, x - 25, 525, 177, 22, '#c34b69');
    for (let y = 65; y < 420; y += 83) {
      ctx.beginPath(); ctx.moveTo(x + 8, y + 46); ctx.bezierCurveTo(x + 32, y - 1, x + 87, y - 6, x + 119, y + 39);
      ctx.strokeStyle = '#ef7990'; ctx.lineWidth = 8; ctx.stroke();
    }
  }
  rect(ctx, 147, 525, 986, 13, '#ee91a4'); rect(ctx, 114, 538, 1052, 15, '#c8436a'); rect(ctx, 79, 553, 1122, 15, '#ed8197');
  for (const x of [361, 919]) {
    oval(ctx, x, 511, 39, 13, '#d66184');
    poly(ctx, [[x - 31, 481], [x + 31, 481], [x + 24, 513], [x - 24, 513]], '#b63a69', '#ec8dab', 3);
    for (let i = 0; i < 5; i++) oval(ctx, x - 27 + i * 14, 476 - (i % 2) * 14, 16, 13, ['#cd73b0', '#e38cb5', '#ad5b99'][i % 3]);
  }
}

export const REVIEWED_SCENERY_IDS = Object.freeze(['backstage', 'spudsy', 'kingdom']);
const painters = Object.freeze({ backstage: hallway, spudsy, kingdom });

/** Return false for scenes still rendered by their existing, scoped drawing. */
export function drawStageScenery(ctx, stage) {
  const id = typeof stage === 'string' ? stage : stage?.theme || stage?.id;
  if (!Object.hasOwn(painters, id)) return false;
  const painter = painters[id];
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1280, SCENERY_FLOOR); ctx.clip();
  painter(ctx); ctx.restore(); return true;
}

import { FIGHTERS } from './data.mjs';

/** Presentation only: these choices never change the simulation or move data. */

/**
 * Remove only the edge-connected colour of an opaque atlas's actual matte.
 * The old black-or-white rule also crossed dark bodies and pale masks. Native
 * transparency is authoritative and is never subjected to colour keying.
 */
export function removeAtlasMatte(data, width, height, options = {}) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || data.length !== width * height * 4) throw new Error('Invalid atlas cell');
  const corners = [0, width - 1, (height - 1) * width, width * height - 1]
    .map(i => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]]);
  if (corners.some(c => c[3] < 12)) return 0;
  const distance = (a, b) => Math.max(...a.slice(0, 3).map((v, i) => Math.abs(v - b[i])));
  const groups = corners.map(c => corners.filter(other => distance(c, other) <= 12));
  const palette = groups.reduce((a, b) => b.length > a.length ? b : a, []);
  if (palette.length < 2) return 0;
  const exactBlack = palette.every(c => Math.max(...c.slice(0, 3)) <= 3);
  const exactWhite = palette.every(c => Math.min(...c.slice(0, 3)) >= 252);
  const tolerance = Number.isFinite(options.tolerance) ? Math.max(0, Math.min(32, options.tolerance)) : exactBlack || exactWhite ? 3 : 12;
  const seen = new Uint8Array(width * height), stack = new Int32Array(width * height);
  let length = 0, removed = 0;
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x, p = i * 4;
    if (seen[i]) return;
    if (data[p + 3] >= 12 && !palette.some(c => Math.max(Math.abs(data[p] - c[0]), Math.abs(data[p + 1] - c[1]), Math.abs(data[p + 2] - c[2])) <= tolerance)) return;
    seen[i] = 1; stack[length++] = i;
  };
  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }
  while (length) {
    const i = stack[--length], x = i % width, y = Math.floor(i / width);
    if (data[i * 4 + 3] >= 12) removed++;
    data[i * 4 + 3] = 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return removed;
}

const projectileShapes = Object.freeze({
  pomni: { special: 'juggle' },
  jax: { special: 'key', super: 'trick-box' },
  ragatha: { special: 'button' },
  gangle: { special: 'comedy-mask' },
  zooble: { special: 'module' },
  kinger: { special: 'pellet' },
  caine: { special: 'confetti', super: 'confetti' },
  bubble: { special: 'bubble', super: 'bubble' },
  gummigoo: { special: 'candy' },
  loolilalu: { special: 'sugar', super: 'sugar' },
  gloinkqueen: { special: 'gloink' },
  fudge: { special: 'fudge', super: 'fudge' },
  abstractedkaufmo: { special: 'corruption' },
  baronmildenhall: { special: 'spectral-shot', super: 'spectral-shot' },
});
const trapShapes = Object.freeze({
  jax: 'trick-box', gangle: 'ribbon-knot', zooble: 'module', caine: 'stage-mark',
  gummigoo: 'gum', loolilalu: 'candy-tile', gloinkqueen: 'gloink-nest',
  fudge: 'fudge-pool', abstractedkaufmo: 'corruption', baronmildenhall: 'hunting-trap',
});

// Reflection changes the projectile's owner, but does not turn Jax's key into
// Kinger's pellet. Bind the motif to the original move definition. Names are
// read from the actual catalog so an editorial rename cannot break the link.
const projectileMoves = new Map();
const trapMoves = new Map();
for (const fighter of FIGHTERS) {
  for (const [slot, move] of Object.entries(fighter.moves)) {
    if (move.kind === 'projectile' && projectileShapes[fighter.id]?.[slot]) projectileMoves.set(move.name, projectileShapes[fighter.id][slot]);
    if (move.kind === 'trap' && trapShapes[fighter.id]) trapMoves.set(move.name, trapShapes[fighter.id]);
  }
}

export function projectilePresentation(projectile, actor) {
  if (projectile?.def?.name) return projectileMoves.get(projectile.def.name) || 'signal';
  const id = actor?.f?.id || actor?.def?.id;
  const slot = projectile?.def?.slot || projectile?.slot || 'special';
  return projectileShapes[id]?.[slot] || 'signal';
}

export function trapPresentation(trap, actor) {
  if (trap?.def?.name) return trapMoves.get(trap.def.name) || 'stage-mark';
  return trapShapes[actor?.f?.id || actor?.def?.id] || 'stage-mark';
}

export const PRESENTATION_FIGHTERS = Object.freeze(Object.keys(projectileShapes));

// Paint fixed 16:9 compositions with horizontal bleed for camera movement.
// The floor at y=568 is the vertical anchor of the uniform overscan.
import { ART_FILES } from './offline-manifest.mjs';

const WIDTH = 1280, HEIGHT = 720, FLOOR = 568;
const BLEED = 32;
const PAINT_WIDTH = WIDTH + BLEED * 2;
const PAINT_HEIGHT = HEIGHT * PAINT_WIDTH / WIDTH;
const TOP = Math.round(FLOOR * (1 - PAINT_WIDTH / WIDTH));
const PLANES = [
  { file: 'far', travel: 6 },
  { file: 'mid', travel: 17 },
  { file: 'near', travel: 31 },
];
const published = new Set(ART_FILES);
const recent = new Map();
const pending = new Map();
let decodeQueue = Promise.resolve();

function surface(width, height) {
  const result = document.createElement('canvas');
  result.width = width;
  result.height = height;
  return result;
}

export function stageCamera(actors, reducedMotion) {
  if (reducedMotion) return 0;
  let count = 0, totalX = 0;
  for (const actor of actors) {
    if (Number.isFinite(actor?.x)) { totalX += actor.x; count++; }
  }
  return count ? Math.max(-1, Math.min(1, (totalX / count - WIDTH / 2) / (WIDTH * 0.4))) : 0;
}

export function drawStagePlanes(ctx, layers, camera) {
  for (const [i, layer] of layers.entries()) {
    const pan = Math.round(camera * PLANES[i].travel);
    ctx.drawImage(layer, -BLEED - pan, TOP);
  }
}

async function decodeStage(paths, subscribers) {
  const layers = [];
  // Decode one UHD file at a time and retain only its logical-resolution canvas.
  for (const path of paths) {
    // Selection rebuilds its canvas on navigation. Discard abandoned previews
    // before decoding another UHD layer, while a duel subscriber stays active.
    if (![...subscribers].some(needed => !needed || needed())) return null;
    const image = new Image();
    image.src = new URL(path, import.meta.url).href;
    try {
      await image.decode();
      const layer = surface(PAINT_WIDTH, PAINT_HEIGHT);
      const ctx = layer.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, layer.width, layer.height);
      layers.push(layer);
    } catch { return null; }
    finally { image.removeAttribute('src'); }
  }
  const still = surface(WIDTH, HEIGHT);
  drawStagePlanes(still.getContext('2d'), layers, 0);
  return { layers, still };
}

export function loadStagePlanes(stage, needed) {
  const id = stage?.theme || stage?.id;
  if (!id) return null;
  if (recent.has(id)) {
    const set = recent.get(id);
    recent.delete(id);
    recent.set(id, set);
    return set;
  }
  const paths = PLANES.map(({ file }) => `../assets/encore/stages/${id}/${file}.webp`);
  if (!paths.every(path => published.has(path))) return null;
  const waiting = pending.get(id);
  if (waiting) {
    waiting.subscribers.add(needed);
    return waiting.task;
  }
  const subscribers = new Set([needed]);
  const task = decodeQueue.then(() => decodeStage(paths, subscribers)).then(set => {
    if (set) {
      if (recent.size >= 2) recent.delete(recent.keys().next().value);
      recent.set(id, set);
    }
    return set;
  }).finally(() => pending.delete(id));
  pending.set(id, { subscribers, task });
  decodeQueue = task.then(() => {}, () => {});
  return task;
}

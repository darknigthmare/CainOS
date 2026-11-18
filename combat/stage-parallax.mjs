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
// Coordinates use the same neutral 1280 × 720 floor as the combat renderer.
const PROPS = {
  coppernine: ['colony-heater', 182, 563, 117], silicacity: ['uplink-repeater', 236, 555, 152],
  portaurora: ['lifebuoy-station', 1050, 517, 133], gaslightwharf: ['wharf-lamp', 1072, 545, 221],
  parkplanet: ['garden-turnstile', 226, 558, 106], gameoverse: ['orbital-checkpoint', 170, 554, 154],
  littledaisy: ['jazz-microphone', 234, 545, 164], showgrounds: ['ticket-dispenser', 226, 558, 131],
  simpleflipisland: ['bamboo-checkpoint', 1072, 567, 148], grounds: ['cotton-candy-cart', 215, 555, 150],
};
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

function illustrationPath(stem) {
  return [stem + '.webp', stem + '.png'].find(path => published.has(path));
}

function sceneLayers(id) {
  const directory = '../assets/encore/stages/' + id + '/';
  const planes = PLANES.map(({ file }) => ({ path: illustrationPath(directory + file) }));
  if (planes.every(layer => layer.path)) return planes;
  if (id !== 'falseexit' || !planes[0].path) return null;
  const props = '../assets/encore/props/falseexit/';
  planes[1] = { path: illustrationPath(props + 'filing-cabinet'), anchor: [1050, 548, 230] };
  planes[2] = { path: illustrationPath(props + 'terminal-desk'), anchor: [143, 618, 257] };
  return planes.every(layer => layer.path) ? planes : null;
}

async function paintLayer(canvas, path, anchor) {
  const image = new Image();
  try {
    image.src = new URL(path, import.meta.url).href;
    await image.decode();
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (anchor) {
      const [x, base, height] = anchor;
      const width = height * image.naturalWidth / image.naturalHeight;
      ctx.drawImage(image, Math.round(x + BLEED - width / 2), base - TOP - height, width, height);
    } else {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    return true;
  } catch { return false; }
  finally { image.removeAttribute('src'); }
}

async function decodeStage(id, entries, subscribers) {
  const needed = () => [...subscribers].some(check => !check || check());
  const layers = [];
  for (const { path, anchor } of entries) {
    if (!needed()) return null;
    const layer = surface(PAINT_WIDTH, PAINT_HEIGHT);
    if (!await paintLayer(layer, path, anchor)) return null;
    layers.push(layer);
  }
  if (!needed()) return null;
  let complete = true;
  if (Object.hasOwn(PROPS, id)) {
    const [file, ...anchor] = PROPS[id];
    const path = illustrationPath('../assets/encore/props/' + id + '/' + file);
    if (path) complete = await paintLayer(layers[2], path, anchor);
  }
  const still = surface(WIDTH, HEIGHT);
  drawStagePlanes(still.getContext('2d'), layers, 0);
  return { layers, still, complete };
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
  const entries = sceneLayers(id);
  if (!entries) return null;
  const waiting = pending.get(id);
  if (waiting) {
    waiting.subscribers.add(needed);
    return waiting.task;
  }
  const subscribers = new Set([needed]);
  const task = decodeQueue.then(() => decodeStage(id, entries, subscribers)).then(set => {
    if (set?.complete) {
      if (recent.size >= 2) recent.delete(recent.keys().next().value);
      recent.set(id, set);
    }
    return set;
  }).finally(() => pending.delete(id));
  pending.set(id, { subscribers, task });
  decodeQueue = task.then(() => {}, () => {});
  return task;
}

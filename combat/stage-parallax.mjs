// Paint fixed 16:9 compositions with horizontal bleed for camera movement.
// The floor at y=568 is the vertical anchor of the uniform overscan.
import { ART_FILES } from './offline-manifest.mjs';
import { REBUILT_STAGE_SCENES } from './stage-scenes-20261127.mjs';

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
  parkplanet: ['garden-turnstile', 226, 558, 106], gameoverse: ['orbital-checkpoint', 170, 572, 154],
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
  const scene = Object.hasOwn(REBUILT_STAGE_SCENES, id) && REBUILT_STAGE_SCENES[id];
  if (scene && published.has(scene.path)) return [{ path: scene.path, scene: true, groundAnchor: scene.groundAnchor }];
  const directory = '../assets/encore/stages/' + id + '/';
  const planes = PLANES.map(({ file }) => ({ path: illustrationPath(directory + file) }));
  if (planes.every(layer => layer.path)) return planes;
  if (id !== 'falseexit' || !planes[0].path) return null;
  const props = '../assets/encore/props/falseexit/';
  planes[1] = { path: illustrationPath(props + 'filing-cabinet'), anchor: [1050, 548, 230] };
  planes[2] = { path: illustrationPath(props + 'terminal-desk'), anchor: [143, 618, 257] };
  return planes.every(layer => layer.path) ? planes : null;
}

/** Uniform cover placement, optionally grounding a native scenery floor. */
export function stageScenePlacement(width, height, groundAnchor) {
  if (!(Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0)) {
    throw new RangeError('Invalid scene dimensions');
  }
  let scale = Math.max(PAINT_WIDTH / width, PAINT_HEIGHT / height);
  let y;
  if (groundAnchor) {
    const { sourceFraction, targetY } = groundAnchor;
    if (!(sourceFraction > 0 && sourceFraction < 1 && Number.isFinite(targetY)
      && targetY > TOP && targetY < TOP + PAINT_HEIGHT)) throw new RangeError('Invalid scene floor anchor');
    const sourceY = sourceFraction * height, target = targetY - TOP;
    scale = Math.max(scale, target / sourceY, (PAINT_HEIGHT - target) / (height - sourceY));
    y = target - sourceY * scale;
  } else y = (PAINT_HEIGHT - height * scale) / 2;
  return { x: (PAINT_WIDTH - width * scale) / 2, y, width: width * scale, height: height * scale, scale };
}

async function paintLayer(canvas, path, anchor, scene, groundAnchor) {
  const image = new Image();
  try {
    image.src = new URL(path, import.meta.url).href;
    await image.decode();
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (scene) {
      const placement = stageScenePlacement(image.naturalWidth, image.naturalHeight, groundAnchor);
      ctx.drawImage(image, placement.x, placement.y, placement.width, placement.height);
    } else if (anchor) {
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
  for (const { path, anchor, scene, groundAnchor } of entries) {
    if (!needed()) return null;
    const layer = surface(PAINT_WIDTH, PAINT_HEIGHT);
    if (!await paintLayer(layer, path, anchor, scene, groundAnchor)) return null;
    layers.push(layer);
  }
  if (!needed()) return null;
  let complete = true;
  const fullScene = entries.length === 1 && entries[0].scene === true;
  if (!fullScene && Object.hasOwn(PROPS, id)) {
    const [file, ...anchor] = PROPS[id];
    const path = illustrationPath('../assets/encore/props/' + id + '/' + file);
    if (path) complete = await paintLayer(layers[2], path, anchor);
  }
  const still = surface(WIDTH, HEIGHT);
  drawStagePlanes(still.getContext('2d'), layers, 0);
  return { layers, still, complete, fullScene };
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

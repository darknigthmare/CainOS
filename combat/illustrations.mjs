import { ART_FILES } from './offline-manifest.mjs';

const published = new Set(ART_FILES);
const frames = { selection: new Map(), stance: new Map() };
const limits = { selection: { edge: 384, count: 16 }, stance: { edge: 640, count: 4 } };
const pending = new Map();
// Two decoding slots shared by the lazily visible portraits and the current duel.
const decoders = [Promise.resolve(), Promise.resolve()];
let nextDecoder = 0;

export function campaignIllustration(fighterId, panelId) {
  const path = `../assets/encore/campaign/${fighterId}/${panelId}.webp`;
  return published.has(path) ? new URL(path, import.meta.url).href : null;
}

async function readFrame(path, kind) {
  const image = new Image();
  image.src = new URL(path, import.meta.url).href;
  try {
    await image.decode();
    const scale = Math.min(1, limits[kind].edge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const bounds = { x: 0, y: 0, width: canvas.width, height: canvas.height };
    return { canvas, ...bounds, bounds, nativeFacing: 1 };
  } catch { return null; }
  finally { image.removeAttribute('src'); }
}

export function loadFighterIllustration(kind, fighter) {
  if (!fighter || fighter.costume) return null;
  const cache = frames[kind];
  if (cache.has(fighter.id)) {
    const frame = cache.get(fighter.id);
    cache.delete(fighter.id);
    cache.set(fighter.id, frame);
    return frame;
  }
  const path = `../assets/encore/${kind}/${fighter.id}.webp`;
  if (!published.has(path)) return null;
  if (!pending.has(path)) {
    const task = decoders[nextDecoder].then(() => readFrame(path, kind)).then(frame => {
      if (frame) {
        if (cache.size >= limits[kind].count) cache.delete(cache.keys().next().value);
        cache.set(fighter.id, frame);
      }
      return frame;
    }).finally(() => pending.delete(path));
    pending.set(path, task);
    // Retaining the promise for a decoding slot must not retain its last texture.
    decoders[nextDecoder] = task.then(() => {}, () => {});
    nextDecoder = (nextDecoder + 1) % decoders.length;
  }
  return pending.get(path);
}

export function standingIllustration(fighter) {
  return fighter.costume ? null : frames.stance.get(fighter.id);
}

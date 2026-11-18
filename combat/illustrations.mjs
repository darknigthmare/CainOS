import { ART_FILES } from './offline-manifest.mjs';

const published = new Set(ART_FILES);
const frames = { selection: new Map(), stance: new Map(), poses: new Map() };
const limits = { selection: { edge: 384, count: 16 }, stance: { edge: 640, count: 4 }, poses: { edge: 640, count: 24 } };
const pending = new Map();
const retryAt = new Map();
export const ACTION_ART = Object.freeze(['intro', 'attack', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']);
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

export function loadFighterIllustration(kind, fighter, pose) {
  // Archive entries use the appearance ID directly. Match actors keep the
  // fighter's simulation ID and carry their chosen appearance in costume.
  const appearanceId = fighter?.costume || fighter?.id;
  if (!appearanceId || typeof Image === 'undefined') return null;
  const cache = frames[kind], key = kind === 'poses' ? appearanceId + '/' + pose : appearanceId;
  if (cache.has(key)) {
    const frame = cache.get(key);
    cache.delete(key);
    cache.set(key, frame);
    return frame;
  }
  const directory = fighter.sprite?.crossoverDirectory;
  const path = directory
    ? `${directory}/${kind === 'poses' ? pose : kind}.webp`
    : `../assets/encore/${kind}/${key}.webp`;
  if (!published.has(path)) return null;
  if (retryAt.has(path)) {
    if (performance.now() < retryAt.get(path)) return null;
    retryAt.delete(path);
  }
  if (!pending.has(path)) {
    const task = decoders[nextDecoder].then(() => readFrame(path, kind)).then(frame => {
      if (frame) {
        if (cache.size >= limits[kind].count) cache.delete(cache.keys().next().value);
        cache.set(key, frame);
      } else if (kind === 'poses' || directory) {
        // drawActor can ask again every video frame while offline.
        retryAt.set(path, performance.now() + 5000);
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

/** Queue only the current pair, two drawings at a time, after the duel can start. */
export async function warmCombatPoses(fighters, isCurrent) {
  for (const pose of [...ACTION_ART, 'heavy']) {
    if (!isCurrent()) return;
    await Promise.all(fighters.map(fighter => loadFighterIllustration('poses', fighter, pose)));
  }
}

export function actionIllustration(fighter, pose) {
  if (!pose) return null;
  const directory = fighter?.sprite?.crossoverDirectory;
  // The crossover attack drawing serves both normal strikes unless the costume
  // has its own heavy. Historical atlases retain their original move selection.
  const key = pose === 'heavy' && directory && !published.has(directory + '/heavy.webp') ? 'attack' : pose;
  const result = loadFighterIllustration('poses', fighter, key);
  return result?.canvas ? result : null;
}

export function standingIllustration(fighter) {
  return frames.stance.get(fighter.costume || fighter.id);
}

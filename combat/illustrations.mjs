import { ART_FILES } from './offline-manifest.mjs';
import { getCostumeNativeFacing } from './costume-resumption-20261120.mjs';
import { focusArchivePortraitOverride } from './base-sprite-focus-20261127.mjs';

const published = new Set(ART_FILES);
const frames = { selection: new Map(), stance: new Map(), poses: new Map() };
const limits = { selection: { edge: 384, count: 16 }, stance: { edge: 640, count: 4 }, poses: { edge: 640, count: 24 } };
const pending = new Map();
const retryAt = new Map();
export const ACTION_ART = Object.freeze(['intro', 'attack', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat']);
// Two decoding slots shared by the lazily visible portraits and the current duel.
const decoders = [Promise.resolve(), Promise.resolve()];
let nextDecoder = 0;

// Preserve the existing WebP choice while also accepting native-alpha PNGs.
// The offline manifest is authoritative: never request an unpublished path.
function illustrationPath(stem) {
  return [stem + '.webp', stem + '.png'].find(path => published.has(path)) || null;
}

// A single archive card can document several people. Keep their individual
// drawings separate, without inventing a name-to-portrait attribution.
const archiveGroups = Object.freeze({
  bestchildren: Object.freeze([
    Object.freeze({ id: 'bestchildren-a', label: 'Enfant Best A' }),
    Object.freeze({ id: 'bestchildren-b', label: 'Enfant Best B' }),
  ]),
  mildenhallsouls: Object.freeze([
    Object.freeze({ id: 'mildenhallsouls', label: 'Âme de Mildenhall A' }),
    Object.freeze({ id: 'mildenhallsouls-b', label: 'Âme de Mildenhall B' }),
    Object.freeze({ id: 'mildenhallsouls-c', label: 'Âme de Mildenhall C' }),
  ]),
  laughingshadows: Object.freeze([
    Object.freeze({ id: 'laughingshadows', label: 'Ombre rieuse A' }),
    Object.freeze({ id: 'laughingshadows-b', label: 'Ombre rieuse B' }),
    Object.freeze({ id: 'laughingshadows-c', label: 'Ombre rieuse C' }),
  ]),
});

export function archiveSelectionParts(archiveId) {
  const members = archiveGroups[archiveId];
  if (!members) return [];
  const parts = members.map(member => {
    const path = illustrationPath(`../assets/encore/selection/${member.id}`);
    return path ? { ...member, src: new URL(path, import.meta.url).href } : null;
  });
  // Retain the original atlas when a group has not been fully published yet.
  return parts.every(Boolean) ? parts : [];
}

export function campaignIllustration(fighterId, panelId) {
  const path = illustrationPath(`../assets/encore/campaign/${fighterId}/${panelId}`);
  return path ? new URL(path, import.meta.url).href : null;
}

async function readFrame(path, kind, nativeFacing) {
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
    // Generated cutouts keep transparent safety margins. Register the visible
    // silhouette so those margins do not shrink the fighter or lift its feet.
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      if (pixels[(y * canvas.width + x) * 4 + 3] < 12) continue;
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (right < left || bottom < top) return null;
    const bounds = { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
    return { canvas, x: 0, y: 0, width: canvas.width, height: canvas.height, bounds, nativeFacing };
  } catch { return null; }
  finally { image.removeAttribute('src'); }
}

export function loadFighterIllustration(kind, fighter, pose) {
  // A declared static base owns only its portrait and standing drawing. Even
  // if an old or stray action file exists, never present it as authored motion.
  if (kind === 'poses' && fighter?.sprite?.baseOnly === true) return null;
  // Archive entries use the appearance ID directly. Match actors keep the
  // fighter's simulation ID and carry their chosen appearance in costume.
  const archiveOverride = kind === 'selection' && !fighter?.costume
    ? focusArchivePortraitOverride(fighter?.id, published) : null;
  const appearanceId = archiveOverride?.appearanceId || fighter?.costume || fighter?.id;
  if (!appearanceId || typeof Image === 'undefined') return null;
  const cache = frames[kind], key = kind === 'poses' ? appearanceId + '/' + pose : appearanceId;
  if (cache.has(key)) {
    const frame = cache.get(key);
    cache.delete(key);
    cache.set(key, frame);
    return frame;
  }
  const directory = fighter.sprite?.crossoverDirectory;
  const path = archiveOverride?.path || illustrationPath(directory
    ? `${directory}/${kind === 'poses' ? pose : kind}`
    : `../assets/encore/${kind}/${key}`);
  if (!path) return null;
  if (retryAt.has(path)) {
    if (performance.now() < retryAt.get(path)) return null;
    retryAt.delete(path);
  }
  if (!pending.has(path)) {
    const nativeFacing = archiveOverride?.nativeFacing || (fighter.sprite?.baseOnly === true
      ? (fighter.sprite.nativeFacing === -1 ? -1 : 1)
      : getCostumeNativeFacing(appearanceId, kind === 'poses' ? pose : kind));
    const task = decoders[nextDecoder].then(() => readFrame(path, kind, nativeFacing)).then(frame => {
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
  const illustrated = fighters.filter(fighter => fighter?.sprite?.baseOnly !== true);
  if (!illustrated.length) return;
  for (const pose of [...ACTION_ART, 'heavy']) {
    if (!isCurrent()) return;
    await Promise.all(illustrated.map(fighter => loadFighterIllustration('poses', fighter, pose)));
  }
}

export function actionIllustration(fighter, pose) {
  if (!pose || fighter?.sprite?.baseOnly === true) return null;
  const directory = fighter?.sprite?.crossoverDirectory;
  // The crossover attack drawing serves both normal strikes unless the costume
  // has its own heavy. Historical atlases retain their original move selection.
  const key = pose === 'heavy' && directory && !illustrationPath(directory + '/heavy') ? 'attack' : pose;
  const result = loadFighterIllustration('poses', fighter, key);
  return result?.canvas ? result : null;
}

export function standingIllustration(fighter) {
  return frames.stance.get(fighter.costume || fighter.id);
}

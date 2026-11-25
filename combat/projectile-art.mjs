import { FIGHTERS } from './data.mjs';
import { ART_FILES } from './offline-manifest.mjs';
import { projectilePresentation } from './render-presentation.mjs';

/**
 * Visual accessories for existing projectile moves. These choices do not add
 * canonical powers or alter collisions. Native PNGs remain unchanged; small
 * decoded canvases are only an in-memory render cache.
 */
const art = (id, width, height, motion) => Object.freeze({
  id, motif: id, src: `../assets/encore/projectiles/${id}.png`, width, height, motion,
});
export const PROJECTILE_ART = Object.freeze({
  juggle: art('juggle', 30, 30, 'spin'),
  key: art('key', 48, 28, 'spin'),
  button: art('button', 30, 30, 'spin'),
  'comedy-mask': art('comedy-mask', 35, 39, 'fixed'),
  module: art('module', 36, 36, 'spin'),
  pellet: art('pellet', 35, 20, 'velocity'),
  confetti: art('confetti', 44, 34, 'fixed'),
  bubble: art('bubble', 36, 36, 'fixed'),
  candy: art('candy', 44, 28, 'spin'),
  sugar: art('sugar', 34, 34, 'spin'),
  gloink: art('gloink', 35, 35, 'spin'),
  fudge: art('fudge', 42, 36, 'fixed'),
  corruption: art('corruption', 43, 39, 'spin'),
  'spectral-shot': art('spectral-shot', 48, 24, 'velocity'),
  'trick-box': art('trick-box', 40, 36, 'fixed'),
  'queenie-royal': art('queenie-royal', 35, 20, 'fixed'),
  'ribbit-lily': art('ribbit-lily', 36, 36, 'fixed'),
  'kaufmo-ball': art('kaufmo-ball', 30, 30, 'fixed'),
  'ming-star': art('ming-star', 44, 34, 'fixed'),
  'ghostly-wisp': art('ghostly-wisp', 48, 24, 'fixed'),
  'orbsman-orb': art('orbsman-orb', 36, 36, 'fixed'),
  'oyster-pearl': art('oyster-pearl', 36, 36, 'fixed'),
  'abel-program': art('abel-program', 38, 30, 'fixed'),
});

// These are documented Encore design choices, not official episode powers.
const npc = (motif, reason) => Object.freeze({ motif, reason });
export const NPC_PROJECTILE_ART = Object.freeze({
  queenie: npc('queenie-royal', 'Trait royal original en bois, ivoire et rubis, dédié à Queenie ; un dessin statique, sans pouvoir canonique revendiqué.'),
  kaufmo: npc('kaufmo-ball', 'Balle de piste originale à panneaux jaunes et rouges et étoile bordeaux, dédiée au clown non abstrait.'),
  ribbit: npc('ribbit-lily', 'Bulle originale turquoise au nénuphar menthe à encoche, dédiée à Ribbit ; accessoire de jeu statique.'),
  scratch: npc('button', 'Petit accessoire rond lancé par le résident du cirque.'),
  wormo: npc('juggle', 'Balle de spectacle pour le résident du chapiteau.'),
  bizco: npc('candy', 'Confiserie partagée pour le personnage biscuit.'),
  rattie: npc('button', 'Petit accessoire rond pour son kit de précision.'),
  spike: npc('sugar', 'Éclat pointu pour la silhouette piquante.'),
  pinkcyclops: npc('juggle', 'Balle de spectacle pour le colosse du cirque.'),
  yellowclown: npc('confetti', 'Confettis de spectacle pour le clown jaune.'),
  oyster: npc('oyster-pearl', 'Perle ivoire et nacre rose originale dédiée à l’Huître ; un accessoire statique du jeu, sans pouvoir canonique revendiqué.'),
  bulbcreature: npc('bubble', 'Sphère lumineuse pour le personnage lanterne.'),
  abel: npc('abel-program', 'Module rouge et ivoire à losange central original dédié à Abel ; un accessoire statique du programme, sans pouvoir officiel affirmé.'),
  max: npc('candy', 'Accessoire de confiserie partagé par les caïmans du canyon.'),
  chad: npc('candy', 'Accessoire de confiserie partagé par les caïmans du canyon.'),
  orbsman: npc('orbsman-orb', 'Orbe cobalt à anneau clair et cœur bleu original dédié à Orbsman ; un dessin statique isolé.'),
  ming: npc('ming-star', 'Étoile de spectacle originale pêche et menthe, dessin individuel dédié à Ming ; aucun pouvoir officiel affirmé.'),
  marthamildenhall: npc('spectral-shot', 'Trait spectral associé au thème Mildenhall du kit.'),
  ghostly: npc('ghostly-wisp', 'Flamme spectrale menthe à deux motifs crème originale dédiée à Ghostly ; silhouette fixe vers la droite et miroir lors des renvois.'),
  angel: npc('spectral-shot', 'Trait spectral associé à l’ange du manoir.'),
  disappearingguy: npc('corruption', 'Fragment numérique pour le figurant qui s’efface.'),
  committeemember: npc('module', 'Module numérique pour le kit de contrôle du comité.'),
  shrimpnpc: npc('bubble', 'Bulle légère évoquant le nom de la créature aquatique.'),
  chineseroomnpc: npc('module', 'Module numérique associé à la chambre des règles.'),
  blueai: npc('module', 'Module numérique pour l’assistant artificiel.'),
  cookiebutterfly: npc('sugar', 'Éclat de sucre pour le papillon de confiserie.'),
  gummyelephant: npc('candy', 'Confiserie pour le pachyderme gommeux.'),
  giantcentipede: npc('sugar', 'Éclat de sucre pour la créature du canyon.'),
  spudsycustomer: npc('fudge', 'Accessoire alimentaire pour le client affamé.'),
  candyguardcyan: npc('sugar', 'Éclat de sucre commun à la garde du palais.'),
  candyguardblue: npc('sugar', 'Éclat de sucre commun à la garde du palais.'),
  candyguardpurple: npc('sugar', 'Éclat de sucre commun à la garde du palais.'),
  gummyworm: npc('candy', 'Confiserie pour le ver gommeux.'),
  barrelmonkey: npc('juggle', 'Balle de spectacle pour le singe du tonneau.'),
  jeffery: npc('confetti', 'Confettis de spectacle pour le résident du cirque.'),
  mildenhallsouls: npc('spectral-shot', 'Trait spectral pour les âmes du manoir.'),
  redmannequin: npc('module', 'Module détaché pour le mannequin numérique.'),
  orangemannequin: npc('module', 'Module détaché pour le mannequin numérique.'),
  yellowmannequin: npc('module', 'Module détaché pour le mannequin numérique.'),
  magentamannequin: npc('module', 'Module détaché pour le mannequin numérique.'),
});
const namedMoves = new Map(), fighterMoves = new Map();
for (const fighter of FIGHTERS) {
  const slots = new Map();
  for (const [slot, move] of Object.entries(fighter.moves || {})) {
    if (move.kind !== 'projectile') continue;
    const motif = NPC_PROJECTILE_ART[fighter.id]?.motif
      || projectilePresentation({ def: move }, { f: fighter });
    const spec = PROJECTILE_ART[motif];
    if (!spec) continue;
    namedMoves.set(move.name, spec); slots.set(slot, spec);
  }
  fighterMoves.set(fighter.id, slots);
}
/** Reflection changes the owner, never the appearance of the original move. */
export function projectileArtSpec(projectile, actor) {
  if (projectile?.def?.name) return namedMoves.get(projectile.def.name) || null;
  return fighterMoves.get(actor?.f?.id || actor?.def?.id)
    ?.get(projectile?.def?.slot || projectile?.slot || 'special') || null;
}
export const PROJECTILE_ART_LIMITS = Object.freeze({
  edge: 128, cached: 8, decoders: 2, retryMs: 5000, decodeTimeoutMs: 4000,
});

/** Small optional art cache. Failure always leaves the existing Canvas motif. */
export class ProjectileArtLoader {
  constructor({ publishedFiles = ART_FILES, imageFactory = () => new Image(),
    surfaceFactory = () => document.createElement('canvas'),
    now = () => performance.now(), decodeTimeoutMs = PROJECTILE_ART_LIMITS.decodeTimeoutMs } = {}) {
    this.published = new Set(publishedFiles);
    this.imageFactory = imageFactory; this.surfaceFactory = surfaceFactory;
    this.now = now; this.decodeTimeoutMs = decodeTimeoutMs;
    this.frames = new Map(); this.pending = new Map(); this.retryAt = new Map();
    this.decoders = Array.from({ length: PROJECTILE_ART_LIMITS.decoders }, () => Promise.resolve());
    this.nextDecoder = 0;
  }
  peek(spec) {
    if (!spec || !this.frames.has(spec.src)) return null;
    const frame = this.frames.get(spec.src);
    this.frames.delete(spec.src); this.frames.set(spec.src, frame);
    return frame;
  }
  load(spec) {
    if (!spec || !this.published.has(spec.src)) return null;
    const cached = this.peek(spec);
    if (cached) return cached;
    if (this.pending.has(spec.src)) return this.pending.get(spec.src);
    if (this.retryAt.has(spec.src) && this.now() < this.retryAt.get(spec.src)) return null;
    this.retryAt.delete(spec.src);
    const slot = this.nextDecoder;
    this.nextDecoder = (slot + 1) % this.decoders.length;
    const task = this.decoders[slot].then(() => this.decode(spec)).then(frame => {
      if (!frame) { this.retryAt.set(spec.src, this.now() + PROJECTILE_ART_LIMITS.retryMs); return null; }
      while (this.frames.size >= PROJECTILE_ART_LIMITS.cached) this.frames.delete(this.frames.keys().next().value);
      this.frames.set(spec.src, frame);
      return frame;
    }).catch(() => {
      this.retryAt.set(spec.src, this.now() + PROJECTILE_ART_LIMITS.retryMs);
      return null;
    }).finally(() => this.pending.delete(spec.src));
    this.pending.set(spec.src, task);
    this.decoders[slot] = task.then(() => {});
    return task;
  }
  async decode(spec) {
    let image, timer;
    try {
      image = this.imageFactory();
      image.src = new URL(spec.src, import.meta.url).href;
      await Promise.race([image.decode(), new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Projectile art decode timed out')), this.decodeTimeoutMs);
      })]);
      const width = image.naturalWidth || image.width, height = image.naturalHeight || image.height;
      if (![width, height].every(value => Number.isFinite(value) && value > 0)) return null;
      const ratio = Math.min(1, PROJECTILE_ART_LIMITS.edge / Math.max(width, height));
      const canvas = this.surfaceFactory();
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
      for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
        if (data[(y * canvas.width + x) * 4 + 3] < 12) continue;
        left = Math.min(left, x); top = Math.min(top, y);
        right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
      if (right < left || bottom < top) return null;
      return { canvas, bounds: { x: left, y: top, width: right - left + 1, height: bottom - top + 1 } };
    } finally {
      if (timer !== undefined) clearTimeout(timer);
      image?.removeAttribute?.('src');
    }
  }
  async preload(fighters = []) {
    const specs = new Map();
    for (const fighter of fighters) for (const spec of fighterMoves.get(fighter?.id)?.values() || []) specs.set(spec.src, spec);
    await Promise.all([...specs.values()].map(spec => this.load(spec)));
  }
}


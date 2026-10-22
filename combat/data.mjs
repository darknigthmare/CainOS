import { SPRITE_CATALOG } from './sprite-catalog.mjs';
import { FIDELITY_SOURCES, getFighterFidelity, getMoveFidelity, getStageFidelity } from './fidelity.mjs';

/**
 * Digital Circus — Encore content.
 * Character appearances come from CainOS. Every numeric combat rule and move
 * below is a fan-game adaptation, not a claim about canonical fighting powers.
 * Frames use the original CQC 60 Hz simulation and its 10000-health scale.
 */
export const GAME = Object.freeze({ id: 'digital-circus-encore', name: 'Digital Circus — Encore', subtitle: 'Le Grand Duel', version: '0.3.0', contentDate: '2026-10-22' });
export const SOURCES = Object.freeze([
  { id: 'cainos', title: 'CainOS — base de travail et atlas existants', url: 'https://github.com/darknigthmare/CainOS/tree/4926834a2f063028903d6431e77f0bece859e671', kind: 'Dépôt utilisateur', scope: 'Inventaire du projet. Les mentions canon dans ses archives demandent une vérification indépendante.' },
  { id: 'cqc', title: 'CQC — version de référence P39', url: 'https://github.com/darknigthmare/shadow-codec-ops/tree/42279c1c884769873e66bbda0b6fe849bcd2f1a2/public/cqc', kind: 'Dépôt utilisateur', scope: 'Architecture intégrée/autonome, moteur de combat et IA portés depuis les fichiers réels.' },
  ...FIDELITY_SOURCES,
  { id: 'adaptation', title: 'Encore — règles de combat', url: 'combat/data.mjs', kind: 'Création pour le jeu', scope: 'Tous les coups, jauges, statistiques, stages jouables et défis sont des règles de fan-game.' },
]);

export const MOVE_SLOTS = Object.freeze(['light', 'heavy', 'low', 'throw', 'special', 'specialDown', 'specialForward', 'specialBack', 'super', 'utility']);
export const SLOT_LABELS = Object.freeze({ light: 'Coup léger', heavy: 'Coup fort', low: 'Coup bas', throw: 'Saisie', special: 'Spécial', specialDown: 'Spécial bas', specialForward: 'Spécial avant', specialBack: 'Spécial arrière', super: 'Finale', utility: 'Récupération' });
const defaults = {
  light: { kind: 'melee', startup: 6, active: 3, recovery: 12, damage: 320, reach: 76, level: 'mid', tag: 'strike' },
  heavy: { kind: 'melee', startup: 14, active: 5, recovery: 24, damage: 690, reach: 128, level: 'high', tag: 'strike' },
  low: { kind: 'melee', startup: 9, active: 4, recovery: 19, damage: 440, reach: 114, level: 'low', lowProfile: true, tag: 'strike' },
  throw: { kind: 'melee', startup: 8, active: 2, recovery: 27, damage: 800, reach: 76, level: 'throw', tag: 'throw' },
  special: { kind: 'projectile', startup: 18, active: 1, recovery: 25, damage: 500, reach: 600, speed: 15, life: 65, height: 145, level: 'mid', cost: 18, tag: 'digital' },
  specialDown: { kind: 'trap', startup: 20, active: 1, recovery: 25, damage: 520, reach: 120, level: 'low', cost: 24, arm: 30, duration: 240, maxTraps: 2, hp: 160, tag: 'digital' },
  specialForward: { kind: 'melee', startup: 12, active: 8, recovery: 28, damage: 650, reach: 130, level: 'mid', cost: 22, travel: 5, tag: 'strike' },
  specialBack: { kind: 'parry', startup: 3, active: 9, recovery: 26, damage: 480, reach: 95, level: 'mid', cost: 16, parryMode: 'melee', tag: 'counter' },
  super: { kind: 'melee', startup: 22, active: 8, recovery: 44, damage: 1800, reach: 190, level: 'mid', cost: 30, meter: 75, tag: 'digital' },
  utility: { kind: 'recover', startup: 16, active: 1, recovery: 34, damage: 0, reach: 0, level: 'mid', restore: 30, cooldown: 210, tag: 'support' },
};
const move = (slot, name, description, fields = {}) => ({ ...defaults[slot], name, description, slot, provenance: 'Adaptation gameplay', ...fields });
const spriteOf = id => SPRITE_CATALOG.find(item => item.id === id)?.sprite;
const coreAnimated = new Set(['pomni', 'jax', 'ragatha', 'gangle', 'zooble', 'kinger', 'caine']);
function fighter(id, name, title, role, color, sourceId, kit, config = {}) {
  const { power = 1, speed = 1, reach = 1, width = 78, height = 230, ...extra } = config;
  kit = Object.fromEntries(Object.entries(kit).map(([slot, definition]) => [slot, { ...definition, fidelity: getMoveFidelity(id, slot) }]));
  const combat = { key: id, resource: { kind: 'energy', label: 'STABILITÉ', max: 100, regen: 0.15 }, passive: {}, links: [['light', 'heavy'], ['low', 'special'], ['heavy', 'specialForward']], simulationBody: { width, height, crouchHeight: Math.round(height * 0.53) }, moves: kit };
  return { id, uid: id, name, title, role, color, power, speed, reach, stats: { health: 10000, power, speed, jump: 12.6, defense: 1 }, combat, moves: kit, sprite: spriteOf(id), animation: coreAnimated.has(id) ? { src: `../assets/images/cainos-${id}-animation-sheet.png`, cols: 4, rows: 2, frames: { idle: [0, 1], walk: [2, 3], talk: [4, 5], attack: [6], hurt: [7] } } : null, visual: { width, height, profile: role === 'Colosse' ? 'giant' : id === 'bubble' ? 'floating' : 'humanoid' }, loreSource: sourceId, provenance: 'Apparence issue de CainOS. Techniques adaptées pour le jeu.', fidelity: getFighterFidelity(id), ...extra };
}

export const FIGHTERS = [
  fighter('pomni', 'Pomni', 'Un pas vers la sortie', 'Esquive', '#f46582', 'ep1', {
    light: move('light', 'Réflexe de survie', 'Une frappe rapide pour interrompre une approche.', { startup: 5, damage: 300, reach: 72 }),
    heavy: move('heavy', 'Grand écart paniqué', 'Un coup de pied haut qui repousse.', { startup: 13, damage: 640, reach: 126 }),
    low: move('low', 'Glissade sous la porte', 'Passe sous les attaques hautes et touche les jambes.', { travel: 2, damage: 400, reach: 118 }),
    throw: move('throw', 'Laissez-moi passer', 'Une saisie courte et un dégagement.', { startup: 7, damage: 730 }),
    special: move('special', 'Balle de jonglerie', 'Un projectile léger à mi-hauteur.', { damage: 430, speed: 17, life: 48, cost: 16, tag: 'confetti' }),
    specialDown: move('specialDown', 'Détour sous le rideau', 'Une esquive basse en recul, sans dégâts.', { kind: 'mobility', damage: 0, startup: 4, active: 12, recovery: 17, cost: 18, travel: -6, lowProfile: true }),
    specialForward: move('specialForward', 'Course vers EXIT', 'Une avancée offensive courte.', { damage: 580, travel: 8, active: 7, cost: 22 }),
    specialBack: move('specialBack', 'Mauvaise porte', 'Une esquive physique en retrait, sans dégâts.', { kind: 'mobility', damage: 0, startup: 5, active: 15, recovery: 10, travel: -10, cost: 25 }),
    super: move('super', 'Encore une fausse sortie', 'Une traversée du ring suivie d’un impact.', { damage: 1650, travel: 9, reach: 180, meter: 75 }),
    utility: move('utility', 'Reprendre son souffle', 'Récupère de la stabilité pendant une ouverture.', { restore: 34 }),
  }, { speed: 1.12, power: 0.94, height: 200 }),
  fighter('jax', 'Jax', 'Le sourire de trop', 'Pièges', '#b584ef', 'ep1', {
    light: move('light', 'Petite provocation', 'Un jab vif, facile à enchaîner.', { startup: 5, damage: 300, reach: 86 }),
    heavy: move('heavy', 'Grand coup de pied', 'Un coup haut avec une longue portée.', { damage: 650, reach: 145 }),
    low: move('low', 'Croche-patte', 'Un balayage discret.', { startup: 8, reach: 125, damage: 410 }),
    throw: move('throw', 'La porte est par là', 'Repousse l’adversaire après la saisie.', { damage: 780, reach: 82 }),
    special: move('special', 'Clef qui ricoche', 'Une clef lancée revient vers son point de départ.', { damage: 420, cost: 17, returnAt: 24, life: 65, reach: 920, speed: 17, tag: 'trick' }),
    specialDown: move('specialDown', 'Mauvaise surprise', 'Pose un piège au sol après un court délai.', { arm: 24, damage: 600, cost: 24, duration: 250, tag: 'trick' }),
    specialForward: move('specialForward', 'Coup dans le décor', 'Une attaque avançante qui soulève légèrement.', { damage: 610, travel: 6, launch: -6 }),
    specialBack: move('specialBack', 'Tu y as cru', 'Une riposte sur attaque de mêlée.', { startup: 2, active: 10, damage: 520, cost: 18 }),
    super: move('super', 'La blague finale', 'Un projectile retardé explose près du rival.', { kind: 'projectile', reach: 720, speed: 12, life: 75, height: 165, fuse: 35, radius: 125, damage: 1750, tag: 'explosive' }),
    utility: move('utility', 'Air innocent', 'Récupère de la stabilité.', { startup: 20, restore: 32 }),
  }, { speed: 1.08, reach: 1.08, height: 260, power: 0.95 }),
  fighter('ragatha', 'Ragatha', 'Toujours recousue', 'Endurance', '#ef898c', 'ep1', {
    light: move('light', 'Main tendue', 'Une frappe courte et fiable.', { reach: 82, damage: 340 }),
    heavy: move('heavy', 'Coup de chiffon', 'Un impact ample avec le corps de poupée.', { startup: 16, damage: 740, reach: 132 }),
    low: move('low', 'Ruban de cheville', 'Une attaque basse de contrôle.', { damage: 440, reach: 126 }),
    throw: move('throw', 'Étreinte ferme', 'Une saisie au contact.', { damage: 900 }),
    special: move('special', 'Bouton lancé', 'Un bouton rebondit vers l’adversaire.', { tag: 'button', speed: 13, height: 118, damage: 500, bounces: 1 }),
    specialDown: move('specialDown', 'Couture solide', 'Réduit les dégâts du prochain impact.', { kind: 'buff', damage: 0, buff: 'armor', hits: 1, duration: 150, cost: 25 }),
    specialForward: move('specialForward', 'Rattrapage', 'Une avancée lourde et courte.', { damage: 720, travel: 4, reach: 140 }),
    specialBack: move('specialBack', 'Ça va aller', 'Riposte si un adversaire frappe trop tôt.', { active: 11, damage: 460 }),
    super: move('super', 'Debout malgré tout', 'Un grand impact de poupée.', { startup: 26, damage: 1950, reach: 205, launch: -9 }),
    utility: move('utility', 'Petite réparation', 'Soigne seulement la portion récupérable de vie.', { kind: 'heal', heal: 380, restore: 0, startup: 24, recovery: 38, cost: 22, cooldown: 300 }),
  }, { speed: 0.94, power: 1.04, height: 235 }),
  fighter('gangle', 'Gangle', 'Derrière le masque', 'Portée', '#f393b9', 'ep1', {
    light: move('light', 'Ruban vif', 'Un contact léger à distance.', { damage: 280, reach: 110 }),
    heavy: move('heavy', 'Arc de ruban', 'Un grand fouetté haut.', { startup: 15, reach: 180, damage: 620, tag: 'ribbon' }),
    low: move('low', 'Ruban rasant', 'Un balayage long, sensible à la punition.', { reach: 165, startup: 12, recovery: 23, damage: 410 }),
    throw: move('throw', 'Nœud serré', 'Une saisie de rubans.', { reach: 95, damage: 730 }),
    special: move('special', 'Masque de comédie', 'Un masque lancé à mi-hauteur.', { tag: 'mask', speed: 12, damage: 450, life: 72, cost: 18 }),
    specialDown: move('specialDown', 'Nœud au sol', 'Un ruban au sol ralentit au contact.', { damage: 380, arm: 22, status: 'slow', duration: 130, cost: 23, tag: 'ribbon' }),
    specialForward: move('specialForward', 'Rubans déployés', 'Une longue frappe, presque sans déplacement.', { travel: 1, reach: 235, damage: 630, startup: 16, active: 6 }),
    specialBack: move('specialBack', 'Masque protecteur', 'Arrête un projectile léger pendant un instant.', { kind: 'buff', damage: 0, buff: 'barrier', hits: 1, duration: 90, startup: 7, active: 1, cost: 24 }),
    super: move('super', 'Rideau de rubans', 'Une grande zone de frappe devant Gangle.', { reach: 290, damage: 1700, startup: 27, active: 10, tag: 'ribbon' }),
    utility: move('utility', 'Ajuster le masque', 'Restaure la stabilité.', { restore: 36, recovery: 38 }),
  }, { speed: 1, power: 0.93, reach: 1.1, width: 65, height: 220 }),
  fighter('zooble', 'Zooble', 'Assemblage libre', 'Polyvalence', '#ffe476', 'ep1', {
    light: move('light', 'Poing dépareillé', 'Une attaque droite très lisible.', { damage: 350, reach: 90 }),
    heavy: move('heavy', 'Bras allongé', 'Frappe lourde à distance.', { damage: 700, reach: 160, startup: 17 }),
    low: move('low', 'Pied triangulaire', 'Une attaque basse à angle court.', { damage: 450, reach: 120 }),
    throw: move('throw', 'Remise en pièces', 'Une saisie suivie d’une projection.', { damage: 840, reach: 80 }),
    special: move('special', 'Pièce détachée', 'Un module lancé peut revenir.', { tag: 'geometry', damage: 510, returnAt: 28, speed: 14, life: 70, reach: 900, cost: 21 }),
    specialDown: move('specialDown', 'Bloc au sol', 'Un obstacle offensif temporaire.', { damage: 550, hp: 220, maxTraps: 1, duration: 280, tag: 'geometry' }),
    specialForward: move('specialForward', 'Extension modulaire', 'Allonge la frappe en avançant peu.', { reach: 210, travel: 2, damage: 680, startup: 16 }),
    specialBack: move('specialBack', 'Changement de pièce', 'Une parade de contact.', { damage: 550, startup: 4, active: 10 }),
    super: move('super', 'Assemblage impossible', 'Une extension lourde projette le rival.', { reach: 230, damage: 1850, launch: -10, tag: 'geometry' }),
    utility: move('utility', 'Réassembler', 'Récupère de la stabilité pendant une longue ouverture.', { restore: 38, recovery: 40 }),
  }, { power: 1.02, reach: 1.08, speed: 0.98, height: 240, width: 88 }),
  fighter('kinger', 'Kinger', 'Le roi sous les coussins', 'Défense', '#d9c4ff', 'ep3', {
    light: move('light', 'Gant royal', 'Une frappe de main flottante.', { reach: 95, damage: 330 }),
    heavy: move('heavy', 'Échec', 'Un impact haut et lourd.', { startup: 18, damage: 760, reach: 145 }),
    low: move('low', 'Balayage du socle', 'Protège l’espace au sol.', { reach: 130, damage: 470, startup: 12 }),
    throw: move('throw', 'Roi au centre', 'Une projection rapprochée.', { damage: 850 }),
    special: move('special', 'Écho du manoir', 'Une salve virtuelle à portée moyenne.', { tag: 'digital', count: 3, interval: 3, damage: 190, speed: 17, life: 37, cost: 24, height: 150 }),
    specialDown: move('specialDown', 'Fort de coussins', 'Absorbe deux projectiles légers.', { kind: 'buff', damage: 0, buff: 'barrier', duration: 180, hits: 2, cost: 28 }),
    specialForward: move('specialForward', 'Sortie du fort', 'Une frappe avançante lente.', { startup: 19, damage: 760, reach: 160, travel: 3 }),
    specialBack: move('specialBack', 'Dans l’obscurité', 'Une parade réfléchit les projectiles simples.', { parryMode: 'projectile', active: 14, damage: 0, cost: 20 }),
    super: move('super', 'Échec et mat', 'Un impact puissant à courte portée.', { damage: 2000, startup: 29, reach: 205, meter: 80 }),
    utility: move('utility', 'Moment de lucidité', 'Restaure la stabilité.', { restore: 40, startup: 24, recovery: 38 }),
  }, { power: 1.06, speed: 0.87, reach: 1.04, width: 100, height: 265 }),
  fighter('caine', 'Caine', 'Maître de cérémonie', 'Distance', '#ff676d', 'ep1', {
    light: move('light', 'Coup de canne', 'Une frappe rapide du présentateur.', { reach: 102, damage: 315 }),
    heavy: move('heavy', 'Grand geste', 'Un large coup haut.', { reach: 156, damage: 670 }),
    low: move('low', 'Balayage de piste', 'Une frappe basse de la canne.', { reach: 140, damage: 420 }),
    throw: move('throw', 'Place au spectacle', 'Replace le rival après une saisie.', { damage: 760, reach: 85 }),
    special: move('special', 'Confettis numériques', 'Un projectile de spectacle à longue portée.', { tag: 'confetti', speed: 14, life: 85, damage: 520, cost: 20 }),
    specialDown: move('specialDown', 'Marque de scène', 'Un piège lumineux marque sa cible.', { damage: 420, status: 'marked', duration: 160, cost: 26, tag: 'confetti' }),
    specialForward: move('specialForward', 'Entrée spectaculaire', 'Une frappe accompagnée d’une avancée.', { travel: 7, damage: 610, reach: 155 }),
    specialBack: move('specialBack', 'Changement de décor', 'Se décale vers l’arrière sans frapper.', { kind: 'mobility', damage: 0, blink: -180, startup: 9, active: 1, recovery: 28, cost: 28 }),
    super: move('super', 'Le grand final', 'Une série de projectiles, coûteuse et lisible.', { kind: 'projectile', reach: 1100, count: 5, interval: 6, damage: 410, speed: 17, life: 72, height: 150, recovery: 52, cost: 35, meter: 80, tag: 'confetti' }),
    utility: move('utility', 'Préparer le prochain numéro', 'Restaure la stabilité.', { restore: 32, startup: 22 }),
  }, { speed: 1, power: 0.97, reach: 1.08, height: 245 }),
  fighter('bubble', 'Bubble', 'Un problème rebondissant', 'Mobilité', '#8de1ef', 'ep1', {
    light: move('light', 'Petit claquement', 'Une courte morsure virtuelle.', { startup: 4, reach: 63, height: 98, damage: 260 }),
    heavy: move('heavy', 'Grande bouche', 'Un claquement plus lent.', { startup: 12, reach: 110, height: 115, damage: 610 }),
    low: move('low', 'Rebond rasant', 'Un contact au ras du sol.', { startup: 7, reach: 108, damage: 370, travel: 3 }),
    throw: move('throw', 'Bouchée de pixels', 'Une saisie très courte.', { reach: 65, damage: 710 }),
    special: move('special', 'Petite bulle', 'Un projectile lent de contrôle.', { tag: 'bubble', damage: 380, speed: 8, life: 105, height: 100, cost: 15 }),
    specialDown: move('specialDown', 'Rebond arrière', 'Recule rapidement en restant bas.', { kind: 'mobility', damage: 0, travel: -8, startup: 3, active: 10, recovery: 18, cost: 20, lowProfile: true }),
    specialForward: move('specialForward', 'Bulle-bélier', 'Une charge rapide.', { startup: 9, active: 9, travel: 9, damage: 570, reach: 100, height: 110 }),
    specialBack: move('specialBack', 'Surface réfléchissante', 'Dévie un projectile simple au bon moment.', { parryMode: 'projectile', damage: 0, active: 10, cost: 18 }),
    super: move('super', 'Ça va éclater', 'Une bulle retardée produit une explosion.', { kind: 'projectile', reach: 720, tag: 'explosive', height: 110, speed: 11, life: 75, fuse: 38, radius: 150, damage: 1650 }),
    utility: move('utility', 'Se regonfler', 'Restaure la stabilité.', { startup: 18, restore: 32 }),
  }, { speed: 1.2, power: 0.88, reach: 0.92, width: 105, height: 120 }),
  fighter('gummigoo', 'Gummigoo', 'Routier de Candy Canyon', 'Pression', '#88d29b', 'ep2', {
    light: move('light', 'Poing gommeux', 'Un jab franc.', { damage: 350, reach: 84 }),
    heavy: move('heavy', 'Coup de queue', 'Un large coup à moyenne portée.', { damage: 710, reach: 155 }),
    low: move('low', 'Balayage de gomme', 'Une frappe basse avec la queue.', { reach: 140, damage: 460 }),
    throw: move('throw', 'Déchargement', 'Une projection au contact.', { damage: 850, reach: 80 }),
    special: move('special', 'Bonbon ricochet', 'Un projectile bas et rebondissant.', { tag: 'candy', height: 100, bounces: 1, speed: 15, damage: 510, cost: 19 }),
    specialDown: move('specialDown', 'Gomme collante', 'Une flaque qui ralentit.', { damage: 370, status: 'slow', duration: 130, arm: 18, cost: 24, tag: 'candy' }),
    specialForward: move('specialForward', 'Convoi lancé', 'Une charge offensive.', { damage: 740, travel: 6, active: 9, startup: 15, reach: 140 }),
    specialBack: move('specialBack', 'Réflexe du canyon', 'Une riposte de mêlée.', { damage: 540, active: 9 }),
    super: move('super', 'Dernière livraison', 'Une charge lourde qui projette.', { damage: 1900, travel: 8, reach: 170, launch: -8 }),
    utility: move('utility', 'Pause du convoyeur', 'Restaure la stabilité.', { restore: 34, recovery: 36 }),
  }, { speed: 1.04, power: 1.02, width: 100, height: 220 }),
  fighter('loolilalu', 'Loolilalu', 'Couronne de sucre', 'Contrôle', '#ffadc9', 'ep2', {
    light: move('light', 'Sceptre léger', 'Un coup rapide du sceptre.', { reach: 100, damage: 290 }),
    heavy: move('heavy', 'Ordre royal', 'Un coup long à punir en cas d’échec.', { reach: 170, startup: 18, recovery: 29, damage: 650 }),
    low: move('low', 'Cercle de sucre', 'Une attaque basse autour du sceptre.', { reach: 150, damage: 420 }),
    throw: move('throw', 'Hors du palais', 'Une projection de proximité.', { damage: 740 }),
    special: move('special', 'Éclat de sucre', 'Un projectile régulier à distance.', { tag: 'candy', speed: 13, damage: 470, life: 90, cost: 18 }),
    specialDown: move('specialDown', 'Carreau de bonbon', 'Une zone piégée au sol.', { damage: 560, arm: 27, duration: 280, cost: 26, tag: 'candy' }),
    specialForward: move('specialForward', 'Salut du palais', 'Un grand coup de sceptre.', { travel: 2, reach: 205, damage: 680, startup: 17 }),
    specialBack: move('specialBack', 'Garde de sucre', 'Une barrière absorbe un projectile simple.', { kind: 'buff', buff: 'barrier', damage: 0, hits: 1, duration: 120, startup: 8, active: 1, cost: 22 }),
    super: move('super', 'Décret de Candy Canyon', 'Trois grands éclats de sucre successifs.', { kind: 'projectile', reach: 1050, count: 3, interval: 9, speed: 14, life: 85, height: 150, damage: 660, cost: 35, meter: 80, tag: 'candy' }),
    utility: move('utility', 'Rétablir l’ordre', 'Restaure la stabilité.', { restore: 35, startup: 23 }),
  }, { speed: 0.96, power: 0.95, reach: 1.1, width: 90, height: 245 }),
  fighter('gloinkqueen', 'Gloink Queen', 'La reine des objets', 'Colosse', '#f5a860', 'ep1', {
    light: move('light', 'Coup de mandibule', 'Un impact court et lourd devant la bouche.', { startup: 9, damage: 400, reach: 250 }),
    heavy: move('heavy', 'Poids royal', 'Une frappe lente et puissante.', { startup: 22, damage: 880, reach: 310, recovery: 31 }),
    low: move('low', 'Roulis du nid', 'Un balayage massif au sol.', { startup: 15, damage: 550, reach: 285 }),
    throw: move('throw', 'Objet réquisitionné', 'Une prise lourde au contact.', { startup: 12, reach: 245, damage: 1000, recovery: 34 }),
    special: move('special', 'Gloink projeté', 'Projette un Gloink géométrique.', { tag: 'geometry', damage: 560, speed: 11, height: 165, life: 88, cost: 22 }),
    specialDown: move('specialDown', 'Nid de Gloinks', 'Un piège robuste mais limité à un exemplaire.', { damage: 680, arm: 40, hp: 260, maxTraps: 1, duration: 300, cost: 30, tag: 'geometry' }),
    specialForward: move('specialForward', 'Charge de la reine', 'Avance lourdement en frappant.', { startup: 21, active: 12, recovery: 35, travel: 4, reach: 295, damage: 850, cost: 28 }),
    specialBack: move('specialBack', 'Carapace royale', 'Réduit les dégâts des deux prochains impacts.', { kind: 'buff', damage: 0, buff: 'armor', duration: 150, hits: 2, startup: 15, active: 1, recovery: 32, cost: 30 }),
    super: move('super', 'Tout devient Gloink', 'Un grand choc frontal très lent.', { startup: 34, active: 12, recovery: 50, damage: 2150, reach: 365, launch: -10, meter: 85 }),
    utility: move('utility', 'Réorganiser le nid', 'Restaure de la stabilité avec une longue récupération.', { restore: 40, startup: 28, recovery: 42 }),
  }, { speed: 0.76, power: 1.12, reach: 1.12, width: 420, height: 150, boss: true, sprite: { ...spriteOf('gloinkqueenscale'), component: 'largest', nativeFacing: -1 }, scaleNote: 'Dimensions adaptées au duel. Planche allongée réutilisée, taille canonique non quantifiée. Les portées de mêlée partent du centre du corps et dépassent la bouche.' }),
  fighter('fudge', 'The Fudge', 'L’ombre du canyon', 'Colosse', '#bd877c', 'ep2', {
    light: move('light', 'Coulée courte', 'Un coup épais à proximité.', { startup: 10, reach: 115, damage: 390 }),
    heavy: move('heavy', 'Vague de fudge', 'Une frappe ample et lente.', { startup: 23, damage: 900, reach: 185, recovery: 34 }),
    low: move('low', 'Flot rampant', 'Une attaque basse de grande portée.', { startup: 15, damage: 520, reach: 180 }),
    throw: move('throw', 'Enrobage', 'Une saisie pesante.', { startup: 12, reach: 105, damage: 980 }),
    special: move('special', 'Boulet chocolaté', 'Un projectile lent et puissant.', { tag: 'fudge', damage: 650, speed: 8, life: 110, height: 150, cost: 25, startup: 24 }),
    specialDown: move('specialDown', 'Mare de fudge', 'Ralentit l’adversaire au sol.', { damage: 450, status: 'slow', duration: 140, arm: 20, maxTraps: 1, cost: 28, tag: 'fudge' }),
    specialForward: move('specialForward', 'Déferlante', 'Une avancée lente mais longue.', { startup: 20, active: 14, travel: 4, reach: 160, damage: 800, recovery: 38 }),
    specialBack: move('specialBack', 'Masse compacte', 'Une armure temporaire sur un impact.', { kind: 'buff', damage: 0, buff: 'armor', hits: 1, duration: 180, cost: 26, startup: 14, active: 1 }),
    super: move('super', 'Inondation du canyon', 'Un grand boulet lourd à longue portée.', { kind: 'projectile', reach: 1080, speed: 10, life: 110, height: 135, damage: 2050, tag: 'fudge', startup: 33, recovery: 52, cost: 36, meter: 85 }),
    utility: move('utility', 'Se rassembler', 'Restaure la stabilité.', { restore: 42, startup: 28, recovery: 44 }),
  }, { speed: 0.72, power: 1.15, reach: 1.13, width: 180, height: 275, boss: true }),
  fighter('abstractedkaufmo', 'Kaufmo — abstraction', 'Signal incontrôlable', 'Assaut', '#b594ec', 'ep1', {
    light: move('light', 'Griffe déformée', 'Une frappe de contact agressive.', { startup: 7, damage: 370, reach: 104, tag: 'glitch' }),
    heavy: move('heavy', 'Masse d’erreurs', 'Une attaque haute qui projette légèrement.', { damage: 780, reach: 170, startup: 18, launch: -6, tag: 'glitch' }),
    low: move('low', 'Tentacule rampant', 'Une longue frappe basse.', { reach: 164, startup: 12, damage: 490, tag: 'glitch' }),
    throw: move('throw', 'Contact corrompu', 'Une saisie au contact.', { damage: 900, reach: 94, tag: 'glitch' }),
    special: move('special', 'Éclat de corruption', 'Un fragment numérique marque sa cible.', { damage: 480, status: 'marked', duration: 120, speed: 15, cost: 24, tag: 'glitch' }),
    specialDown: move('specialDown', 'Trace d’erreur', 'Une zone piège laisse une brève perturbation.', { damage: 420, status: 'shock', arm: 26, duration: 210, cost: 27, maxTraps: 1, tag: 'glitch' }),
    specialForward: move('specialForward', 'Ruée abstraite', 'Une charge rapide, très punissable si évitée.', { travel: 8, startup: 14, active: 10, recovery: 39, damage: 760, reach: 165, cost: 28, tag: 'glitch' }),
    specialBack: move('specialBack', 'Repli instable', 'Un recul physique continu, sans dégâts.', { kind: 'mobility', damage: 0, startup: 8, active: 15, recovery: 13, travel: -9, cost: 28 }),
    super: move('super', 'Débordement du cellier', 'Un impact large à longue préparation.', { startup: 30, damage: 2000, reach: 245, launch: -11, tag: 'glitch', meter: 85 }),
    utility: move('utility', 'Réinitialisation partielle', 'Récupère de la stabilité de simulation.', { restore: 34, startup: 25, recovery: 38 }),
  }, { speed: 1.02, power: 1.06, reach: 1.07, width: 135, height: 265, boss: true, archive: true }),
  fighter('baronmildenhall', 'Baron Mildenhall', 'Le chasseur du manoir', 'Précision', '#b5c9dd', 'ep3', {
    light: move('light', 'Crosse courte', 'Un coup bref de défense.', { damage: 310, reach: 90 }),
    heavy: move('heavy', 'Crosse de chasse', 'Un grand coup de l’arme virtuelle.', { damage: 690, reach: 145, startup: 16 }),
    low: move('low', 'Balayage du chasseur', 'Une frappe basse de proximité.', { damage: 420, reach: 125 }),
    throw: move('throw', 'Hors de mon manoir', 'Éloigne le rival par une saisie.', { damage: 790, reach: 80 }),
    special: move('special', 'Tir spectral', 'Un tir rapide à longue portée.', { tag: 'precision', damage: 580, speed: 22, life: 58, height: 155, startup: 23, cost: 25 }),
    specialDown: move('specialDown', 'Piège de chasse', 'Un piège marqué au sol.', { damage: 600, arm: 35, duration: 270, cost: 27, maxTraps: 1, tag: 'spectral' }),
    specialForward: move('specialForward', 'Avancée du chasseur', 'Une charge mesurée avec la crosse.', { startup: 16, travel: 4, reach: 150, damage: 670 }),
    specialBack: move('specialBack', 'Contre du manoir', 'Punit une attaque de contact.', { damage: 570, active: 8, cost: 19 }),
    super: move('super', 'Dernière chasse', 'Trois tirs spectraux espacés.', { kind: 'projectile', reach: 1100, tag: 'precision', count: 3, interval: 10, speed: 23, life: 58, height: 155, damage: 690, startup: 30, recovery: 52, cost: 38, meter: 85 }),
    utility: move('utility', 'Préparer la cartouche', 'Restaure la stabilité du tir virtuel.', { restore: 36, startup: 24, recovery: 36 }),
  }, { speed: 0.93, power: 1.03, height: 250 }),
];

export const MOVES = FIGHTERS.flatMap(f => MOVE_SLOTS.map(slot => ({ id: `${f.id}.${slot}`, fighterId: f.id, fighterName: f.name, ...f.moves[slot] })));
const stage = (id, name, description, palette, sourceId, extra = {}) => ({ id, name, description, theme: id, palette, colors: palette, sourceId, width: 1280, floor: 568, bounds: { left: 65, right: 1215 }, provenance: 'Décor de combat adapté', fidelity: getStageFidelity(id), ...extra });
export const STAGES = [
  stage('bigtop', 'La grande piste', 'Le salon coloré du cirque, ses canapés et sa porte arrondie.', { sky: '#2588bd', back: '#53bad5', accent: '#ffb526', floor: '#ff9c43', grid: '#ffe7a0' }, 'ep1'),
  stage('candy', 'Candy Canyon', 'Un canyon de confiseries et la route du convoi.', { sky: '#211a39', back: '#7e446f', accent: '#ffc3dc', floor: '#754857', grid: '#b4778e' }, 'ep2'),
  stage('manor', 'Mildenhall Manor', 'La grande salle sous les portraits et les bougies.', { sky: '#101b27', back: '#273b42', accent: '#b7d9b8', floor: '#303637', grid: '#64787c' }, 'ep3'),
  stage('spudsy', 'Spudsy’s', 'Un duel devant le comptoir après le service.', { sky: '#251b27', back: '#6d3344', accent: '#ffd85d', floor: '#5a4554', grid: '#bd7584' }, 'ep4'),
  stage('cellar', 'Le cellier', 'Des yeux multicolores dans l’obscurité, autour d’une lumière centrale.', { sky: '#08090c', back: '#142d39', accent: '#a7ffff', floor: '#08090c', grid: '#acb3c1' }, 'ep1'),
  stage('void', 'Le Vide', 'Un espace blanc et irisé, adapté en piste de duel.', { sky: '#c6c9f6', back: '#e7eaff', accent: '#ffffff', floor: '#f7f6ff', grid: '#daddff' }, 'ep1'),
  stage('lake', 'Le lac numérique', 'Une rive construite à partir des décors déjà présents dans CainOS.', { sky: '#152c46', back: '#245b74', accent: '#a5e9ff', floor: '#3e5d62', grid: '#699596' }, 'cainos', { sourceStatus: 'Décor CainOS à vérifier contre une source primaire' }),
  stage('training', 'Salle de calibration', 'Une grille claire pour mesurer portée et timing.', { sky: '#101621', back: '#1a2938', accent: '#a7ffdf', floor: '#223443', grid: '#416176' }, 'adaptation'),
  stage('gloink', 'Le nid des Gloinks', 'Des formes géométriques s’amassent autour du ring.', { sky: '#191229', back: '#3e2953', accent: '#ffc98b', floor: '#3d2a4f', grid: '#815585' }, 'ep1'),
  stage('kingdom', 'Le palais de sucre', 'Des arches de confiserie dans Candy Canyon.', { sky: '#29213d', back: '#74496a', accent: '#ffe7b3', floor: '#684760', grid: '#ab7e9b' }, 'ep2'),
  stage('grounds', 'Les terrains du cirque', 'La pelouse numérique au pied du chapiteau.', { sky: '#173149', back: '#386278', accent: '#ffe29c', floor: '#31584e', grid: '#6c9172' }, 'ep1'),
  stage('backstage', 'Le couloir des portes', 'Les portes des résidents servent de fond de scène.', { sky: '#171326', back: '#462b4e', accent: '#efc694', floor: '#4a3549', grid: '#876779' }, 'ep1'),
];

// A matching substring is not an identity: Jax's parents, rival NPCs, body
// parts and mental projections remain archives. Only reviewed appearances of
// the same fighter may reuse a kit. This is a gameplay classification of the
// project's existing art, not an endorsement of its historical canon labels.
export const COSTUME_BASE_FIGHTERS = Object.freeze({
  ganglekawaii: 'gangle',
  ganglecomedy: 'gangle',
  gangletragedy: 'gangle',
  darkduojax: 'jax',
  darkduogangle: 'gangle',
  maidjax: 'jax',
  maidragatha: 'ragatha',
  maidpomni: 'pomni',
  maidgangle: 'gangle',
  jaxgirl: 'jax',
  beachgangle: 'gangle',
  japanesegangle: 'gangle',
  rhinogangle: 'gangle',
  workgangle: 'gangle',
  japanesejax: 'jax',
  japaneseragatha: 'ragatha',
  japanesepomni: 'pomni',
  japanesekinger: 'kinger',
  japanesezooble: 'zooble',
  japanesegummigoo: 'gummigoo',
  baseballjax: 'jax',
  baseballzooble: 'zooble',
  baseballgangle: 'gangle',
  baseballragatha: 'ragatha',
  baseballpomni: 'pomni',
  baseballkinger: 'kinger',
  shadowpomni: 'pomni',
  shadowjax: 'jax',
  shadowragatha: 'ragatha',
  shadowkinger: 'kinger',
  shadowgangle: 'gangle',
  shadowzooble: 'zooble',
  shadowcaine: 'caine',
  horrorpomnivoid: 'pomni',
  horrorpomnispiral: 'pomni',
  horrorpomniskull: 'pomni',
  hunterjax: 'jax',
  gloinkqueenscale: 'gloinkqueen',
  peeledjax: 'jax',
  spudsypomni: 'pomni',
  spudsyjax: 'jax',
  spudsyragatha: 'ragatha',
  spudsyzooble: 'zooble',
  possessedpomni: 'pomni',
  monstrouscaine: 'caine',
  flamingozooble: 'zooble',
  mouthlesspomni: 'pomni',
  mouthlessjax: 'jax',
  mouthlesszooble: 'zooble',
  inertbubble: 'bubble',
  groundedcaine: 'caine',
});

// Every remaining current atlas entry is reviewed explicitly. Future entries
// fail closed as "unreviewed" until an intentional identity decision is made.
const archiveOnlyGroups = [
  {
    kind: 'resident',
    ids: ['queenie', 'kaufmo', 'ribbit', 'scratch', 'wormo', 'bizco', 'rattie', 'spike', 'pinkcyclops', 'yellowclown', 'oyster', 'bulbcreature'],
    reason: 'Résident archivé sans kit propre. La forme non abstraite de Kaufmo ne remplace pas son boss abstrait.',
  },
  {
    kind: 'separate-character',
    ids: ['evilpomni', 'eviljax', 'evilragatha', 'evilkinger', 'evilzooble', 'evilorbsman', 'rivalbaseballzooble', 'rivalbaseballpomni', 'rivalbaseballpinkgiant', 'rivalbaseballragatha', 'rivalbaseballjax', 'rivalbaseballkinger'],
    reason: 'Double ou rival décrit comme PNJ distinct dans le projet. Le nom partagé ne suffit pas à en faire un costume.',
  },
  {
    kind: 'separate-character',
    ids: ['mannequin', 'abel', 'max', 'chad', 'orbsman', 'gloinkstar', 'gloinkcube', 'gloinkpyramid', 'gloinkcrescent', 'gloinkpin', 'gloinkround', 'abelmannequin', 'abelfullbody', 'additionalvoices', 'ming', 'marthamildenhall', 'ghostly', 'angel', 'disappearingguy', 'committeemember', 'shrimpnpc', 'chineseroomnpc', 'blueai', 'cookiebutterfly', 'gummyelephant', 'giantcentipede', 'spudsycustomer', 'candyguardcyan', 'candyguardblue', 'candyguardpurple', 'gummyworm', 'barrelmonkey', 'jeffery', 'redmannequin', 'orangemannequin', 'yellowmannequin', 'magentamannequin', 'mildenhallsouls', 'truthtellerfish', 'liarfish', 'stupidburgermannequin', 'cerealmannequin', 'sun', 'moon', 'floatingworm', 'creditsfish', 'peekingmannequin', 'healingbutterfly'],
    reason: 'Personnage, figurant ou créature distincte sans kit de combat livré. Aucun rattachement automatique à un combattant.',
  },
  {
    kind: 'other-person',
    ids: ['abigailbrooks', 'suzieackerman', 'zoeyraghavan', 'rileyverselis', 'grantbest', 'leeroymateo', 'jaxfather', 'jaxmother', 'abigailfriendone', 'abigailfriendtwo', 'bestchildren', 'destinybest'],
    reason: 'Personne humaine ou famille citée dans les archives. Une parenté ou contrepartie ne constitue pas une tenue jouable.',
  },
  {
    kind: 'projection',
    ids: ['ragathamothershadow', 'laughingshadows', 'fourthcrocodile', 'jaxmindviolent', 'jaxmindcomic', 'jaxmindtrapped', 'whatifragatha', 'whatifgangle'],
    reason: 'Entité de tourment ou projection mentale. Conservée comme référence narrative, sans emprunter le kit du personnage évoqué.',
  },
  {
    kind: 'prop',
    ids: ['drfootball', 'albertspudsy', 'paintedmasks', 'zoobleparts', 'stabbedragdolls', 'coiledcentipedes', 'unusedbrainscans', 'angelhead', 'plasticganglemask'],
    reason: 'Accessoire, fragments, décor ou visuel de marque. Ce sprite ne représente pas un combattant complet.',
  },
  {
    kind: 'effect',
    ids: ['jumbledragatha', 'jumbledpomni', 'charredshrimp'],
    reason: 'Effet visuel ou trace ponctuelle. Ne remplace pas la silhouette du combattant pendant un match.',
  },
  {
    kind: 'abstraction',
    ids: ['cellarabstraction', 'aquaticabstraction', 'abstractedjax', 'abstractedqueeniedark', 'abstractedqueenie', 'abstractedribbit'],
    reason: 'Forme abstraite distincte sans kit ni corps de collision adaptés. Aucun recyclage du kit de sa forme d’origine.',
  },
  {
    kind: 'unassigned-art',
    ids: ['horrorghost', 'horrormonster', 'themachine', 'bonepastor'],
    reason: 'Création ou archive de production sans identité jouable validée. Reste consultable avant attribution d’un rôle.',
  },
];
export const ARCHIVE_ONLY_ENTRIES = Object.freeze(Object.fromEntries(archiveOnlyGroups.flatMap(({ ids, ...classification }) => ids.map(id => [id, Object.freeze({ ...classification })]))));
const fighterIds = new Set(FIGHTERS.map(f => f.id));

export function classifyArchiveEntry(id) {
  if (fighterIds.has(id)) return { category: 'fighter', baseFighterId: id, playable: true, archiveKind: null, classificationReason: 'Combattant jouable avec son propre kit de dix techniques.' };
  if (Object.hasOwn(COSTUME_BASE_FIGHTERS, id)) return { category: 'variant', baseFighterId: COSTUME_BASE_FIGHTERS[id], playable: false, archiveKind: null, classificationReason: 'Tenue ou état visuel du même combattant, approuvé explicitement pour réutiliser son kit sans changement de règles. Le libellé de lore reste à vérifier.' };
  const entry = Object.hasOwn(ARCHIVE_ONLY_ENTRIES, id) ? ARCHIVE_ONLY_ENTRIES[id] : null;
  return { category: 'archive', baseFighterId: null, playable: false, archiveKind: entry?.kind || 'unreviewed', classificationReason: entry?.reason || 'Entrée non revue : aucun kit attribué avant validation explicite de son identité et de sa silhouette.' };
}

export const ROSTER_ARCHIVE = SPRITE_CATALOG.map(entry => {
  const classification = classifyArchiveEntry(entry.id);
  const sprite = entry.id === 'gloinkqueenscale' ? { ...entry.sprite, component: 'largest', nativeFacing: -1 } : entry.sprite;
  return { ...entry, sprite, ...classification, fighterId: classification.baseFighterId };
});
export const ARCHIVE = ROSTER_ARCHIVE;
export const VARIANTS = ROSTER_ARCHIVE.filter(entry => entry.baseFighterId && entry.id !== entry.baseFighterId);
export const MODES = [
  { id: 'versus', name: 'Versus CPU', description: 'Un duel libre contre l’ordinateur.' },
  { id: 'local', name: 'Duel local', description: 'Deux joueurs sur le même appareil.' },
  { id: 'arcade', name: 'Arcade', description: 'Six matchs jusqu’au dernier numéro.' },
  { id: 'story', name: 'Histoires', description: 'Quatorze routes originales, quatre rencontres et une fin par combattant.' },
  { id: 'tournament', name: 'Tournoi à huit', description: 'Trois tours dans un tableau déterministe à huit participants.' },
  { id: 'boss', name: 'Boss rush', description: 'Affronter les colosses et l’abstraction.' },
  { id: 'survival', name: 'Survie', description: 'Dix adversaires avec la vie conservée.' },
  { id: 'training', name: 'Entraînement', description: 'Dummy, hitboxes et remise à zéro.' },
  { id: 'challenge', name: 'Défis', description: 'Six exercices avec des objectifs mesurables.' },
];

export function getFighter(id) { return FIGHTERS.find(f => f.id === id) || FIGHTERS[0]; }
export function getStage(id) { return STAGES.find(s => s.id === id) || STAGES[0]; }

// Replay rules are selected from the recording's version, not the current UI.
// These two definitions are the exact 0.1.0/0.2.0 rules, including their original
// recovery windows. No legacy object shares its replaced move with the new kit.
const legacyRetreats = Object.freeze({
  pomni: move('specialBack', 'Mauvaise porte', 'Un pas de côté numérique en retrait.', { kind: 'mobility', damage: 0, startup: 5, active: 1, recovery: 24, blink: -150, cost: 25 }),
  abstractedkaufmo: move('specialBack', 'Repli instable', 'Un recul brutal sans dégâts.', { kind: 'mobility', damage: 0, blink: -135, startup: 8, active: 1, recovery: 27, cost: 28 }),
});
const legacyFighters = new Map();
export function getReplayFighter(id, version) {
  const current = getFighter(id);
  if (!['0.1.0', '0.2.0'].includes(version) || !Object.hasOwn(legacyRetreats, current.id)) return current;
  if (!legacyFighters.has(current.id)) {
    const moves = { ...current.moves, specialBack: { ...legacyRetreats[current.id] } };
    legacyFighters.set(current.id, { ...current, moves, combat: { ...current.combat, moves } });
  }
  return legacyFighters.get(current.id);
}

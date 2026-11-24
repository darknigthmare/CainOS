/**
 * Abstractions for Encore. A distinct morphology owns a distinct simulation
 * identity; merchandise outfits remain on their existing, unaltered kits.
 * Numeric rules, original forms and all new stories belong to the fan-game.
 */
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};

export const ABSTRACTION_ART_SLOTS = freeze([
  'selection', 'stance', 'intro', 'attack', 'heavy', 'hit', 'walk', 'jump', 'crouch', 'victory', 'defeat',
]);
export const ABSTRACTION_SOURCES = freeze([{
  id: 'store-jax-abstraction-identity',
  title: 'GLITCH Store — Pomni & Abstraction Magnetic Plush Keychains',
  url: 'https://glitchproductions.store/products/pomni-abstraction-magnetic-plush-keychains',
  kind: 'Description officielle de produit dérivé',
  scope: 'La description identifie explicitement Jax comme l’abstraction représentée. Ce texte confirme une identité, pas les proportions du modèle de série, les poses ni un kit de combat. Le produit est une peluche stylisée ; aucune comparaison 1:1 du modèle animé n’est revendiquée.',
}]);

const def = (id, name, title, role, color, sourceKind, sourceIds, rivalId, width, height, power, speed, reach, signature, labels, story, visual = {}) => ({
  id, name, title, role, color, sourceKind, sourceIds, rivalId, width, height,
  crouchHeight: Math.round(height * (role === 'Colosse' ? .65 : .56)),
  power, speed, reach, signature, labels, story, visual,
  sourceId: sourceIds.find(id => /^ep\d$/.test(id)) || 'adaptation',
  homeStage: sourceKind === 'original-encore' ? 'memoryfracture' : 'abstractionthreshold',
});

export const ABSTRACTION_DEFS = freeze([
  def('cellarabstraction', 'Abstraction du cellier', 'Les regards sans nom', 'Colosse', '#97b2ef', 'archive-attribution', ['ep1', 'glitch-cellar'], 'abstractedkaufmo', 210, 280, 1.11, .81, 1.12, 'anchor',
    ['Griffe du cellier', 'Masse des regards', 'Racines d’erreur', 'Étreinte du seuil', 'Œil détaché', 'Tache du cellier', 'Avancée des regards', 'Ancrage obscur', 'Le cercle se referme', 'Rassembler le signal'],
    { premise: 'Une silhouette collective de l’archive traverse une répétition du cellier. Encore ne lui attribue ni nom humain ni souvenir individuel.', aim: 'conserver un espace lisible au milieu des regards', ending: 'Les regards demeurent dans leur zone tandis que la lumière du passage reste visible. La silhouette n’est ni guérie ni identifiée.' }),
  def('aquaticabstraction', 'Abstraction aquatique', 'Le ressac du signal', 'Contrôle', '#66d8e9', 'archive-attribution', ['ep9'], 'bubble', 195, 200, .97, .94, 1.13, 'tide',
    ['Griffe de surface', 'Vague noire', 'Ressac rampant', 'Étreinte du courant', 'Écume d’erreur', 'Flaque irisée', 'Marée de travers', 'Retrait du ressac', 'Déferlante numérique', 'Ralentir le courant'],
    { premise: 'La forme appelée « abstraction aquatique » dans l’archive reçoit une piste d’essai originale. Son attribution exacte à une scène reste à comparer.', aim: 'traverser les quatre repères du courant', ending: 'Le courant simulé s’apaise et les repères restent en place. La piste s’arrête sans révéler une origine ni annoncer une transformation canonique.' }, { anchorX: .78 }),
  def('abstractedjax', 'Jax — abstraction', 'Le contour du silence', 'Assaut', '#c08aee', 'official-identity', ['ep9', 'store-jax-abstraction-identity'], 'pomni', 175, 310, 1.05, 1.08, 1.08, 'pursuit',
    ['Griffe oblique', 'Sommet disloqué', 'Angle rasant', 'Contact sans voix', 'Fragment du contour', 'Trace sans rire', 'Percée dissonante', 'Repli du contour', 'Silence en éclats', 'Retenir le signal'],
    { premise: 'Encore propose une reconstruction de combat autour de Jax abstrait. Le personnage reste silencieux ; les duels ne prolongent pas la fin de la série.', aim: 'maintenir une distance que le programme puisse contenir', ending: 'Pomni reste à l’extérieur du cercle de lumière. La reconstruction se referme sans guérison, réplique ou nouvelle fin attribuée à Jax.' }),
  def('abstractedqueenie', 'Queenie — abstraction', 'La lumière tenue à distance', 'Défense', '#bba9e6', 'official-identity', ['ep3'], 'kinger', 180, 285, 1.02, .88, 1.11, 'ward',
    ['Griffe de la veille', 'Couronne d’angles', 'Bordure d’ombre', 'Étreinte des pointes', 'Éclat de veille', 'Repère dans le noir', 'Pas du seuil', 'Veille immobile', 'La dernière veille', 'Calmer le signal'],
    { premise: 'Cette route d’Encore présente Queenie abstraite dans une scène de simulation. L’état calme est une apparence du même combattant ; aucune réversion n’est proposée.', aim: 'garder les lumières à une distance stable', ending: 'Kinger baisse la lumière de la répétition. Queenie conserve sa forme abstraite ; cette fin de jeu ne réécrit ni leur passé ni leur devenir.' }),
  def('abstractedribbit', 'Ribbit — abstraction', 'Le bond interrompu', 'Mobilité', '#9aceb5', 'archive-attribution', ['ep9'], 'jax', 180, 270, .96, 1.13, 1.01, 'leap',
    ['Griffe du rebond', 'Angle de rupture', 'Appui glissant', 'Prise du contour', 'Éclat du rebond', 'Empreinte brisée', 'Bond de traverse', 'Recul du seuil', 'Dernier rebond', 'Fixer les appuis'],
    { premise: 'La silhouette nommée Ribbit abstraite dans l’archive est jouable dans un parcours expérimental. Son dessin reste à confronter aux plans officiels.', aim: 'retrouver quatre appuis dans la scène de test', ending: 'La silhouette retrouve le sol de la simulation et la répétition prend fin. Aucun souvenir, parole ou retour de Ribbit n’est inventé.' }),
  def('originalabstractedpomni', 'Pomni — abstraction originale', 'Le labyrinthe sans porte', 'Mobilité', '#cf8eeb', 'original-encore', [], 'pomni', 165, 260, .95, 1.12, 1.03, 'leap',
    ['Griffe du détour', 'Arche fracturée', 'Passage rasant', 'Nœud du labyrinthe', 'Éclat de la fausse porte', 'Seuil fracturé', 'Détour fulgurant', 'Pas hors du cadre', 'Le labyrinthe se replie', 'Retrouver un repère'],
    { premise: 'Une forme entièrement abstraite de Pomni est inventée pour Encore. Il s’agit d’un adversaire de simulation, distinct des apparences officielles et de leur histoire.', aim: 'suivre un parcours dont les portes restent des accessoires', ending: 'Le labyrinthe inventé s’arrête à sa dernière marque. Pomni et cette projection restent deux entrées de jeu distinctes ; aucune abstraction de la série n’est annoncée.' }),
  def('originalabstractedragatha', 'Ragatha — abstraction originale', 'La couture hors du cadre', 'Contrôle', '#e29cc9', 'original-encore', [], 'ragatha', 190, 275, 1.03, .91, 1.16, 'stitch',
    ['Fil tranchant', 'Pelote disloquée', 'Couture rampante', 'Nœud de tissu noir', 'Aiguille de signal', 'Point d’arrêt', 'Ourlet de traverse', 'Découdre la distance', 'La grande couture', 'Retendre le fil'],
    { premise: 'Encore imagine une masse abstraite rappelant les fils et volumes d’une poupée de chiffon. Cette silhouette originale ne représente aucun événement officiel.', aim: 'rejoindre les quatre points d’une couture de scène', ending: 'Les fils du décor restent sur le cadre et la projection s’immobilise. Ragatha garde son identité propre, sans transformation imposée par ce récit.' }),
  def('originalabstractedgangle', 'Gangle — abstraction originale', 'Les rubans sans masque', 'Distance', '#ee91bb', 'original-encore', [], 'gangle', 170, 295, .94, 1.02, 1.14, 'ribbon',
    ['Ruban en biseau', 'Boucle d’erreur', 'Lanière rasante', 'Nœud sans masque', 'Ruban détaché', 'Boucle au sol', 'Déroulé d’ombre', 'Contre de la boucle', 'Rideau dissonant', 'Rassembler les rubans'],
    { premise: 'Cette abstraction complète de Gangle est une création originale d’Encore, fondée sur un vocabulaire de rubans sombres et d’yeux. Le produit officiel partiel conserve son entrée séparée.', aim: 'tenir quatre lignes de scène sans perdre les limites du ring', ending: 'Le rideau inventé reste ouvert autour de Gangle et de la projection. La conclusion n’ajoute ni masque officiel ni faculté nouvelle au personnage de la série.' }),
  def('originalabstractedkinger', 'Kinger — abstraction originale', 'Le bastion aux mille regards', 'Colosse', '#b9a0ec', 'original-encore', [], 'kinger', 220, 315, 1.14, .79, 1.14, 'anchor',
    ['Angle du bastion', 'Tour des regards', 'Base rampante', 'Prise du rempart', 'Éclat du bastion', 'Case d’ombre', 'Avancée du rempart', 'Bastion fermé', 'L’échiquier sans roi', 'Rallumer un repère'],
    { premise: 'Un bastion abstrait original évoque la verticalité de Kinger sans prétendre montrer son avenir. La confrontation est une épreuve de placement construite pour Encore.', aim: 'protéger un repère au centre d’un échiquier de décor', ending: 'La dernière case reste éclairée et le bastion ne franchit plus sa bordure. Kinger n’est pas transformé par cette scène originale.' }),
  def('originalabstractedzooble', 'Zooble — abstraction originale', 'Les fragments indociles', 'Polyvalence', '#8cd8d7', 'original-encore', [], 'zooble', 200, 280, 1.01, 1.03, 1.07, 'fragments',
    ['Éclat asymétrique', 'Assemblage rompu', 'Pièce rasante', 'Prise hors registre', 'Fragment dissident', 'Pièce oubliée', 'Angle de traverse', 'Reprise des angles', 'Assemblage impossible', 'Stabiliser les fragments'],
    { premise: 'Encore invente une forme abstraite asymétrique pour Zooble. Son assemblage demeure une création du jeu, distincte des configurations et figurines officielles.', aim: 'traverser quatre arrangements sans imposer une forme définitive', ending: 'Les fragments cessent de tourner dans la simulation. Zooble conserve le choix de ses pièces et aucun assemblage officiel n’est déclaré remplacé.' }),
]);
export const ABSTRACTION_IDS = freeze(ABSTRACTION_DEFS.map(item => item.id));
export const ABSTRACTION_RIVALS = freeze(Object.fromEntries(ABSTRACTION_DEFS.map(item => [item.id, item.rivalId])));
export const ABSTRACTION_CALM_ID = 'abstractedqueeniedark';
export const ABSTRACTION_APPEARANCE_IDS = freeze([...ABSTRACTION_IDS.slice(0, 5), ABSTRACTION_CALM_ID, ...ABSTRACTION_IDS.slice(5)]);

export function abstractionSprite(id) {
  const directory = '../assets/encore/abstractions/' + id;
  return {
    src: directory + '/stance.png', cols: 1, rows: 1, col: 0, row: 0,
    matteMode: 'native-alpha', nativeFacing: 1,
    // The existing directory contract is shared with illustrated costumes.
    // No crossover ownership or series metadata is manufactured.
    crossoverDirectory: directory, contentKind: 'abstraction',
  };
}

const slots = ['light', 'heavy', 'low', 'throw', 'special', 'specialDown', 'specialForward', 'specialBack', 'super', 'utility'];
export function buildAbstractionKit(definition) {
  const d = definition, slow = d.speed < .9, heavy = d.role === 'Colosse';
  const fields = {
    light: { startup: slow ? 9 : 7, active: 4, recovery: 15, damage: heavy ? 400 : 340, reach: d.width * .63, tag: 'glitch' },
    heavy: { startup: heavy ? 23 : 18, active: 6, recovery: heavy ? 33 : 28, damage: heavy ? 850 : 740, reach: d.width * .85, launch: -5, tag: 'glitch' },
    low: { startup: 12, active: 5, recovery: 22, damage: 460, reach: d.width * .94, tag: 'glitch' },
    throw: { startup: 10, active: 2, recovery: 31, damage: heavy ? 940 : 840, reach: d.width * .55, tag: 'glitch' },
    special: { startup: 21, active: 1, recovery: 29, damage: 470, speed: 13, life: 72, height: Math.round(d.height * .54), cost: 23, tag: 'glitch' },
    specialDown: { startup: 22, active: 1, recovery: 29, damage: 430, arm: 30, duration: 210, maxTraps: 1, hp: 160, cost: 27, tag: 'glitch' },
    specialForward: { startup: 16, active: 10, recovery: 37, damage: 720, reach: d.width * .8, travel: heavy ? 4.5 : 7, cost: 27, tag: 'glitch' },
    specialBack: { kind: 'mobility', damage: 0, startup: 8, active: 12, recovery: 18, travel: -7, cost: 24, tag: 'glitch' },
    super: { startup: 32, active: 9, recovery: 48, damage: 1950, reach: d.width * 1.15, launch: -9, meter: 85, cost: 34, tag: 'glitch' },
    utility: { startup: 26, active: 1, recovery: 40, restore: 34, cooldown: 240 },
  };
  if (d.signature === 'anchor') {
    Object.assign(fields.specialBack, { kind: 'buff', buff: 'barrier', hits: 2, duration: 100, active: 1, travel: 0, startup: 12, recovery: 30, cost: 28 });
    Object.assign(fields.specialDown, { arm: 38, duration: 270, damage: 550, cost: 30 });
  } else if (d.signature === 'tide') {
    Object.assign(fields.special, { speed: 9, life: 98, height: 100, damage: 410, status: 'slow', duration: 100 });
    Object.assign(fields.specialDown, { status: 'slow', arm: 24, duration: 200 });
    Object.assign(fields.super, { kind: 'projectile', active: 1, count: 3, interval: 12, speed: 11, life: 100, height: 105, reach: 1100, damage: 590 });
  } else if (d.signature === 'pursuit') {
    Object.assign(fields.special, { status: 'marked', duration: 120, speed: 17, cost: 25 });
    Object.assign(fields.specialForward, { travel: 9, startup: 15, active: 10, recovery: 42, damage: 790, cost: 31 });
    Object.assign(fields.specialBack, { travel: -9, active: 13, cost: 28 });
  } else if (d.signature === 'ward') {
    Object.assign(fields.specialBack, { kind: 'parry', parryMode: 'projectile', startup: 4, active: 10, recovery: 29, damage: 0, travel: 0, cost: 21 });
    Object.assign(fields.specialDown, { damage: 390, status: 'shock', arm: 34, duration: 235 });
  } else if (d.signature === 'leap') {
    Object.assign(fields.specialForward, { travel: 9, startup: 13, active: 9, recovery: 36, damage: 660, launch: -5 });
    Object.assign(fields.special, { speed: 17, life: 55, damage: 430, cost: 20 });
  } else if (d.signature === 'stitch') {
    Object.assign(fields.special, { speed: 18, life: 62, damage: 450, status: 'slow', duration: 75 });
    Object.assign(fields.specialDown, { maxTraps: 2, damage: 330, arm: 36, duration: 230, cost: 25 });
  } else if (d.signature === 'ribbon') {
    Object.assign(fields.special, { returnAt: 27, speed: 14, life: 65, damage: 410, cost: 24 });
    Object.assign(fields.specialBack, { kind: 'parry', parryMode: 'melee', startup: 4, active: 10, recovery: 28, damage: 530, travel: 0 });
    Object.assign(fields.super, { kind: 'projectile', active: 1, count: 4, interval: 10, speed: 15, life: 78, height: 155, reach: 1100, damage: 440 });
  } else if (d.signature === 'fragments') {
    Object.assign(fields.special, { returnAt: 24, speed: 16, life: 60, cost: 25 });
    Object.assign(fields.specialBack, { kind: 'parry', parryMode: 'melee', startup: 4, active: 8, recovery: 30, damage: 570, travel: 0 });
    Object.assign(fields.super, { kind: 'projectile', active: 1, count: 3, interval: 11, speed: 18, life: 70, height: 150, reach: 1100, damage: 620 });
  }
  for (const slot of ['special', 'super']) {
    if (slot === 'super' && fields[slot].kind !== 'projectile') continue;
    const origin = { forward: Math.round(d.width / 2 + 8), height: fields[slot].height };
    fields[slot].projectileOrigin = { 1: { ...origin }, '-1': { ...origin } };
  }
  const descriptions = [
    'Une frappe courte de la silhouette abstraite.', 'Une frappe haute annoncée, avec une récupération punissable.',
    'Un prolongement bas contrôle le sol devant les appuis.', 'Une saisie rapprochée utilise la largeur du corps abstrait.',
    'Un fragment numérique traverse la piste selon les règles du jeu.', 'Un piège visible s’arme au sol avant de pouvoir toucher.',
    'Une charge avance continûment ; elle ne téléporte pas la forme.',
    fields.specialBack.kind === 'buff' ? 'Une garde temporaire absorbe deux projectiles légers.' : fields.specialBack.kind === 'parry' ? 'Une fenêtre brève de contre exige le bon timing.' : 'Un recul physique garde une trajectoire et une récupération visibles.',
    'Une finale consomme la jauge et laisse une longue récupération.', 'Une pause risquée restaure la stabilité de la simulation, sans guérison canonique.',
  ];
  return Object.fromEntries(slots.map((slot, index) => [slot, { name: d.name + ' · ' + d.labels[index], description: descriptions[index], fields: fields[slot] }]));
}

export function abstractionFidelity(d) {
  const original = d.sourceKind === 'original-encore';
  const attribution = d.sourceKind === 'archive-attribution';
  return {
    sourceIds: [...d.sourceIds], observedTraits: [], sourceKind: d.sourceKind,
    combatAdaptation: 'Corps de simulation distinct de ' + d.width + ' × ' + d.height + ' pixels, dix techniques originales et poses dédiées pour ' + d.name + '. Aucune technique du personnage non abstrait n’est réutilisée comme identité cachée.' + (d.id === 'aquaticabstraction' ? ' Le volume de combat suit la tête et la masse principale ; les longues tendrilles arrière sont décoratives et n’élargissent pas les collisions.' : ''),
    reviewStatus: original ? 'Création originale' : attribution ? 'Attribution d’archive à confirmer' : 'Identité officielle — comparaison visuelle ouverte',
    reviewScope: original
      ? 'Forme complète inventée pour Encore. Aucun épisode ni produit dérivé officiel ne représente ce design. La cohérence artistique est un objectif de création, sans certification canonique 1:1.'
      : attribution
        ? 'Le nom provient de l’archive CainOS ; la source indiquée est une cible de comparaison, pas une validation de ce dessin. Silhouette, couleurs, proportions et attribution exacte restent à revoir sur des plans primaires.'
        : 'L’identité abstraite est attribuée à une source officielle. Les illustrations, leurs proportions et leurs poses restent des adaptations pour Encore ; aucune correspondance image par image ni fidélité 1:1 certifiée.',
  };
}

export const ABSTRACTION_CALM_FIDELITY = freeze({
  sourceIds: ['ep3'], observedTraits: [], sourceKind: 'official-identity',
  combatAdaptation: 'L’état calme est une apparence de Queenie abstraite : mêmes dix techniques, mêmes collisions, mêmes statistiques. Il ne devient ni Queenie non abstraite ni un combattant supplémentaire.',
  reviewStatus: 'Identité officielle — comparaison visuelle ouverte',
  reviewScope: 'État d’archive attribué à Queenie dans l’obscurité. Le dessin de jeu et ses nouvelles poses demandent encore une comparaison visuelle aux plans de l’épisode 3 ; aucune réversion ni fidélité 1:1 certifiée.',
  assetReview: {
    status: 'Revue technique à reprendre après restauration — 24 novembre 2026',
    visibleTraits: [
      'La fiche historique décrit une silhouette noire fuselée et des yeux colorés. Les images de remplacement doivent être inspectées avant de reconduire ces observations.',
    ],
    identityEvidence: 'L’entrée historique abstractedqueeniedark appartient au même combattant que Queenie abstraite. La conservation des octets du portrait doit être contrôlée lors de la restauration des PNG ; cette attribution ne vaut pas comparaison canonique.',
    framing: 'Cadres et marges des nouvelles poses à mesurer après réception des PNG natifs. Les mesures du jeu de fichiers perdu restent une preuve historique distincte.',
    transparency: 'Le contrat de rendu exige l’alpha natif des PNG. La transparence des fichiers restaurés doit être vérifiée sans recoloration ni détourage automatique.',
    proportions: 'Le costume conserve le corps de simulation 180 × 285 pixels et les mêmes techniques que Queenie abstraite. Les nouveaux dessins seront affichés sans déformation ; leurs proportions restent à comparer aux références primaires.',
    issues: [
      'Reprendre la revue du portrait, de la garde et des neuf actions après restauration des fichiers.',
      'Comparer la forme, les couleurs et la disposition des yeux à des plans officiels identifiés de Queenie dans l’obscurité.',
      'Les onze repères restent des images statiques ; les cycles de dessin animés complets restent à produire.',
    ],
  },
});

export const ABSTRACTION_ORIGINAL_ARCHIVE = freeze(ABSTRACTION_DEFS.filter(d => d.sourceKind === 'original-encore').map(d => ({
  id: d.id, name: d.name, sourceAge: 'Création originale Encore — abstraction complète',
  sprite: abstractionSprite(d.id), source: 'combat/abstractions-content.mjs',
  sourceKind: d.sourceKind, provenance: 'Design inventé pour Encore. Aucun personnage ni événement officiel supplémentaire revendiqué.',
  status: 'Création originale jouable',
})));


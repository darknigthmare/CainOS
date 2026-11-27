import { FIGHTERS } from './data.mjs';
import { FINISHER_CATALOG } from './finisher-catalog.mjs';
import { EXPANSION_DEFS } from './roster-expansion.mjs';
import { abstractionFriendship } from './abstractions-narrative.mjs';

/**
 * One non-violent "numéro d’amitié" per playable artist, presented after a
 * resolved match instead of a finale. These are original fan-game stagings:
 * they reuse the performer's reviewable prop motif and never add a canonical
 * friendship scene, power or line of dialogue.
 */
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};
export const FRIENDSHIP_CATALOG_VERSION = 'encore-friendship-catalog-1';
export const FRIENDSHIP_NOTICE = 'Numéros d’amitié créés pour Encore. Le décor se range, personne ne reste au sol ; aucune scène d’amitié canonique n’est revendiquée.';
const DURATION_FRAMES = 201;
const remainingArtWork = 'Composition procédurale d’accessoires existants. Aucun dessin d’amitié 1:1 ni plan primaire d’une telle scène n’est revendiqué.';

const core = {
  pomni: {
    title: 'La porte laissée ouverte',
    beats: [
      ['Le panneau retourné', 'Pomni retourne le panneau EXIT face contre le décor et pose la clef sur une caisse.'],
      ['Une place pour deux', 'Un banc de loge se déplie derrière elle ; le rival s’assoit sans que la scène devienne une sortie.'],
      ['Le rideau entrouvert', 'La lumière baisse sur les deux artistes assis côte à côte, la porte toujours visible.'],
    ],
    adaptation: 'Le panneau et la clef sont des accessoires de scène. Ils n’ouvrent aucun passage et ne promettent aucune sortie du cirque.',
  },
  jax: {
    title: 'Le tour offert',
    beats: [
      ['La clef posée', 'Jax abandonne sa clef sur le socle et recule les mains vides.'],
      ['Personne ne tombe', 'Les cartes s’abattent en éventail au-dessus des deux artistes ; aucune trappe ne s’ouvre.'],
      ['Le rire partagé', 'Jax salue le rival avant le public, puis ramasse lui-même les rubans.'],
    ],
    adaptation: 'La farce ne blesse personne : les cartes et la clef restent des accessoires de présentation.',
  },
  ragatha: {
    title: 'Le point de repos',
    beats: [
      ['L’aiguille rangée', 'Ragatha dépose son fil et s’assoit avant d’avoir fini de ranger le décor.'],
      ['Deux tasses de tissu', 'Deux coussins cousus forment une table basse au centre de la piste.'],
      ['La couture ouverte', 'Le cadre cousu reste en place, assez large pour les deux artistes.'],
    ],
    adaptation: 'Le fil et les coutures décorent la scène ; ils ne réparent ni ne soignent personne.',
  },
  gangle: {
    title: 'Le masque posé',
    beats: [
      ['Le carnet ouvert', 'Gangle pose son masque de comédie sur le carnet et laisse voir les ratures.'],
      ['Un ruban pour chacun', 'Deux rubans se déroulent jusqu’aux deux artistes sans les retenir.'],
      ['Le dessin terminé', 'La composition se fixe sur un dessin à deux mains, sans vaincu au sol.'],
    ],
    adaptation: 'Les rubans restent des accessoires de décor ; le masque n’est ni cassé ni remplacé.',
  },
  zooble: {
    title: 'Les pièces en commun',
    beats: [
      ['Une pièce offerte', 'Zooble détache un module et le tend au rival, qui le pose sur le socle.'],
      ['L’assemblage choisi', 'Les formes s’emboîtent librement autour des deux artistes.'],
      ['Le droit de défaire', 'Zooble reprend sa pièce et laisse le reste en place, modifiable.'],
    ],
    adaptation: 'Les formes géométriques sont des accessoires ; aucune partie du corps de Zooble n’est remplacée.',
  },
  kinger: {
    title: 'Le fort partagé',
    beats: [
      ['Un coussin de plus', 'Kinger ajoute un coussin au fort et désigne la place libre.'],
      ['La couronne posée', 'La couronne descend entre les deux artistes, sur le damier.'],
      ['La veilleuse commune', 'Une petite lumière reste allumée au-dessus du fort pendant le salut.'],
    ],
    adaptation: 'Coussins, damier et couronne sont un décor original ; ils n’invoquent rien et ne transforment personne.',
  },
  caine: {
    title: 'La trompette posée',
    beats: [
      ['Le silence annoncé', 'Caine pose sa trompette et laisse le micro ouvert sans rien annoncer.'],
      ['Le numéro sans consigne', 'Les rideaux s’ouvrent sur les deux artistes, sans nouvel ordre du maître de piste.'],
      ['Le salut écouté', 'Caine attend la fin du salut avant de reprendre la parole.'],
    ],
    adaptation: 'Le rappel prolonge son rôle de présentateur ; il ne change pas d’arène et ne supprime personne.',
  },
  bubble: {
    title: 'La bulle partagée',
    beats: [
      ['Le chariot vide', 'Bubble laisse le chariot au centre et demande avant de le déplacer.'],
      ['Deux verres propres', 'Deux bulles transparentes se posent sur le plateau, sans éclater.'],
      ['Le service terminé', 'Bubble s’installe à côté du chariot et attend le signal du rival.'],
    ],
    adaptation: 'Les bulles sont des accessoires transparents ; Bubble conserve son illustration et son alpha.',
  },
  gummigoo: {
    title: 'La route à deux',
    beats: [
      ['Le convoi arrêté', 'Gummigoo pose un panneau de halte et descend du convoi.'],
      ['Une carte partagée', 'Les repères de route se rejoignent au centre du décor.'],
      ['Le retour indiqué', 'Le chemin repart vers les deux artistes, sans destination exclusive.'],
    ],
    adaptation: 'Les repères évoquent le convoi dans une scène originale ; aucun camion n’est invoqué.',
  },
  loolilalu: {
    title: 'La chaise de plus',
    beats: [
      ['Un couvert ajouté', 'Loolilalu ajoute une assiette à la table déjà dressée.'],
      ['Les arches ouvertes', 'Les arches de sucre s’écartent pour laisser passer le rival.'],
      ['La place libre', 'La réception se termine avec une chaise encore disponible.'],
    ],
    adaptation: 'Couronnes et arches restent des accessoires de décor, sans magie du sucre ni nouveau costume.',
  },
  gloinkqueen: {
    title: 'Le trésor rendu',
    beats: [
      ['Le coffre ouvert', 'La reine ouvre le coffre et laisse le rival choisir une pièce.'],
      ['Les chutes partagées', 'Les Gloinks déposent des chutes de décor autour des deux artistes.'],
      ['Le nid apaisé', 'Le nid se referme sans emporter les attaches de la scène.'],
    ],
    adaptation: 'Les formes de Gloinks décorent la scène ; personne n’est transformé ni collectionné.',
  },
  fudge: {
    title: 'Le dessert laissé',
    beats: [
      ['La part de côté', 'Fudge met un dessert entier de côté et recule d’un pas.'],
      ['La table à deux', 'La nappe s’élargit sans recouvrir les places voisines.'],
      ['Le service fini', 'Le chariot repart avec les assiettes vides, pas avec les invités.'],
    ],
    adaptation: 'La matière chocolatée reste une bordure de présentation, sans piège ni engloutissement.',
  },
  abstractedkaufmo: {
    title: 'Le passage laissé libre',
    beats: [
      ['Le cadre apaisé', 'La construction d’archive recule sans prendre de nouvelle forme.'],
      ['Les repères alignés', 'Les marques au sol restent espacées et laissent voir la sortie.'],
      ['Le siège vide', 'La scène se referme sur un siège laissé libre, sans voix ajoutée.'],
    ],
    adaptation: 'Composition graphique sans stroboscope. Kaufmo reste abstrait : aucune guérison, copie ou parole n’est inventée.',
  },
  baronmildenhall: {
    title: 'Le portrait éclairé',
    beats: [
      ['Le cadre incliné', 'Le portrait d’archive s’incline vers la sortie de la visite.'],
      ['Les bougies rapprochées', 'Les bougies se rassemblent autour du panneau indicateur.'],
      ['Le silence du salon', 'Le manoir reste silencieux ; la sortie demeure visible depuis les deux places.'],
    ],
    adaptation: 'Cadres et bougies sont une scénographie originale ; aucune arme, voix ou disparition n’est ajoutée.',
  },
};

const gestureByRole = {
  'Soutien': 'installe une chaise et laisse la place libre',
  'Pression': 'dépose son accessoire et recule d’un pas',
  'Mobilité': 'trace un parcours court entre les deux places',
  'Pièges': 'désarme son accessoire et le pose au sol',
  'Défense': 'ouvre un passage dans son décor',
  'Endurance': 'partage une ration de scène avec le rival',
  'Précision': 'aligne deux repères au centre de la piste',
  'Assaut': 'range son accessoire derrière le rideau',
  'Colosse': 'écarte les gradins pour laisser de la place',
  'Contrôle': 'remet les marques de scène à leur place',
  'Distance': 'éteint son projecteur et allume la salle',
  'Polyvalence': 'échange un accessoire avec le rival',
};

function expansionFriendship(def) {
  const gesture = gestureByRole[def.role] || gestureByRole.Polyvalence;
  return {
    title: `La trêve de ${def.name}`,
    beats: [
      [`L’accessoire posé`, `${def.name} ${gesture} et laisse le centre de la piste au rival.`],
      [`Le geste offert`, `Le décor de ${def.name} reste intact ; ${def.title.toLowerCase()} devient un simple rôle de scène, sans vaincu au sol.`],
      [`Le salut commun`, `Le rideau tombe sur ${def.name} et le rival côte à côte, chacun à sa place dans le numéro.`],
    ],
    adaptation: `Numéro d’amitié généré pour l’extension PNJ. Il adapte le rôle de ${def.role.toLowerCase()} de ${def.name} et n’ajoute aucune scène canonique.`,
  };
}

const rows = [];
for (const fighter of FIGHTERS) {
  const record = core[fighter.id] || abstractionFriendship(fighter.id) || (EXPANSION_DEFS.some(def => def.id === fighter.id)
    ? expansionFriendship(EXPANSION_DEFS.find(def => def.id === fighter.id))
    : null);
  if (!record) continue;
  const reference = FINISHER_CATALOG.find(entry => entry.fighterId === fighter.id && entry.variant === 'impact');
  rows.push({
    id: `${fighter.id}.friendship`, fighterId: fighter.id, variant: 'friendship', presentation: 'friendship',
    title: record.title, durationFrames: DURATION_FRAMES,
    beats: record.beats.map(([title, description], index) => ({ frame: index * DURATION_FRAMES / 3, title, description })),
    motif: reference?.motif || 'geometry', sourceIds: reference?.sourceIds || [fighter.loreSource || 'ep1'],
    adaptation: record.adaptation, remainingArtWork,
  });
}

export const FRIENDSHIP_CATALOG = freeze(rows.map(entry => ({
  ...entry, beats: entry.beats.map(beat => ({ ...beat })),
})));

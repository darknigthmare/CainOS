/**
 * Additional Circus outfits illustrated from named official merchandise.
 * These are appearances of existing fighters, with original fan-game poses.
 * Keeping them outside the historical atlas preserves its IDs and ordering.
 */
const costumePage = 'https://glitchproductions.store/products/digital-circus-animiniz-costume-adventure-series';
const beachPage = 'https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series';
const defs = [
  {
    id: 'beachpomni', fighterId: 'pomni', name: 'Pomni — Plage',
    sourceId: 'store-beach-pomni', sourceTitle: 'GLITCH — Beach Pomni Plush',
    sourceUrl: 'https://glitchproductions.store/products/beach-pomni-plush',
    traits: ['Bonnet de bouffon rouge et bleu, bordure et grelots jaunes, visage blanc et iris en moulinet.',
      'Haut rayé bleu et blanc, short bleu à cordon, chaussures bleues et brassards jaunes de la peluche.'],
    scope: 'Version avec brassards de la peluche officielle. Le pistolet à eau de la figurine Aqua Blaster n’est pas ajouté à cette tenue.',
  },
  {
    id: 'noirragatha', fighterId: 'ragatha', name: 'Ragatha — Film noir',
    sourceId: 'store-noir-ragatha', sourceTitle: 'GLITCH — Noir Ragatha Plush',
    sourceUrl: 'https://glitchproductions.store/products/noir-ragatha-plush',
    traits: ['Palette entièrement en niveaux de gris, cheveux en laine courts et grand nœud clair.',
      'Œil bouton cousu, collier de perles, robe noire sans manches à col en V et chaussures noires.'],
    scope: 'Costume comparé à la peluche officielle Noir Ragatha, sans attribution d’un plan ou d’un horodatage de la série.',
  },
  {
    id: 'presidentpomni', fighterId: 'pomni', name: 'Pomni — Présidente',
    sourceId: 'store-president-pomni', sourceTitle: 'GLITCH — Costume Adventure, Pomni Présidente',
    sourceUrl: costumePage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/83.png?v=1762387272&width=1600',
    traits: ['Tailleur pantalon bleu, chemise blanche, cravate gris clair, gants blancs et chaussures noires.',
      'Bonnet rouge et bleu à bordure jaune et iris en moulinet conservés.'],
    scope: 'Vêtements comparés à la figurine officielle. Le support doré placé entre ses pieds est exclu du personnage.',
  },
  {
    id: 'noirzooble', fighterId: 'zooble', name: 'Zooble — Film noir',
    sourceId: 'store-noir-zooble', sourceTitle: 'GLITCH — Costume Adventure, Zooble noir et blanc',
    sourceUrl: costumePage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/86.png?v=1762387272&width=1600',
    traits: ['Assemblage asymétrique gris, tête triangulaire sans bouche, pupille en spirale et trois cils sous le petit œil.',
      'Antennes en éclair et spirale rayée, triangle creux au torse, petite aile, tablier clair, une jambe rayée et une botte sombre.',
      'Shaker bleu violet, seul accessoire coloré.'],
    scope: 'Assemblage comparé à la figurine officielle. Les membres restent distincts ; les poses sont des adaptations de combat.',
  },
  {
    id: 'beachragatha', fighterId: 'ragatha', name: 'Ragatha — Nageuse',
    sourceId: 'store-swimmer-ragatha', sourceTitle: 'GLITCH — Beach Vacation, Swimmer Ragatha',
    sourceUrl: beachPage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_02.png?v=1765572441&width=1600',
    traits: ['Cheveux de laine rouges, œil bouton bleu, bandeau pervenche avec fleur rose et haut de bain pervenche.',
      'Bouée cheval rose avec museau blanc et crinière violette, sans corne. Jambes de chiffon beiges et pieds nus arrondis.'],
    scope: 'Tenue et bouée comparées à la figurine officielle Swimmer Ragatha. Les proportions sont celles du dessin de jeu.',
  },
  {
    id: 'beachzooble', fighterId: 'zooble', name: 'Zooble — Plongée',
    sourceId: 'store-snorkeler-zooble', sourceTitle: 'GLITCH — Beach Vacation, Snorkeler Zooble',
    sourceUrl: beachPage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_01.png?v=1765572441&width=1600',
    traits: ['Tête triangulaire rose sans bouche, œil jaune à spirale, coquillage, petit parasol et tuba bleu.',
      'Torse jaune à étoile rose, bras orange terminé par une pince menthe, autre bras segmenté jaune et violet.',
      'Jambe en zigzag à pied conique rayé, autre jambe rouge avec une palme bleue et sac de plage beige.'],
    scope: 'Assemblage comparé à la figurine officielle Snorkeler Zooble. Chaque membre distinct et la pince unique sont conservés.',
  },
  {
    id: 'beachjax', fighterId: 'jax', name: 'Jax — Plage',
    sourceId: 'store-beach-jax', sourceTitle: 'GLITCH — Beach Vacation, Jax au coquillage',
    sourceUrl: beachPage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_04.png?v=1765572441&width=1600',
    traits: ['Lapin violet filiforme, longues oreilles, yeux jaunes à pupilles noires rectangulaires et petite bouche neutre.',
      'Petit coquillage rose devant les hanches, corps violet lisse, mains et grands pieds violets, sans salopette ni gants.'],
    scope: 'Apparence comparée à la figurine officielle Beach Vacation. La silhouette conserve les proportions longues du personnage dans le jeu.',
  },
  {
    id: 'sandcastlekinger', fighterId: 'kinger', name: 'Kinger — Château de sable',
    sourceId: 'store-sandcastle-kinger', sourceTitle: 'GLITCH — Beach Vacation, Sand Castle Kinger',
    sourceUrl: beachPage, imageUrl: 'https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_03.png?v=1765572441&width=1600',
    traits: ['Tête de roi dorée avec croix et deux grands yeux blancs à iris bleus, au-dessus d’un château jaune.',
      'Tours crénelées, porte arrondie, coquillage violet, perles pastel, étoile rose, pelle cyan et petit drapeau rose.',
      'Corps-château entier conservé, sans bras, mains ou jambes ajoutés.'],
    scope: 'Apparence comparée à la figurine officielle Sand Castle Kinger. Les actions utilisent la tête et l’inclinaison du château, sans lui inventer une anatomie humaine.',
  },
];
export const COSTUME_ADDITION_SOURCES = Object.freeze(defs.map(def => Object.freeze({
  id: def.sourceId, title: def.sourceTitle, url: def.sourceUrl,
  ...(def.imageUrl ? { imageUrl: def.imageUrl } : {}),
  kind: 'Produit dérivé officiel',
  scope: def.scope + ' Référence consultée le 19 novembre 2026. Ce produit stylisé ne certifie ni les proportions exactes de la série ni ses mouvements.',
})));
export const COSTUME_ADDITIONS = Object.freeze(defs.map(def => Object.freeze({
  id: def.id, name: def.name, fighterId: def.fighterId, baseFighterId: def.fighterId,
  category: 'variant', playable: false, archiveKind: null,
  classificationReason: 'Tenue du même personnage, illustrée séparément et réutilisant son kit sans changement des règles.',
  sprite: Object.freeze({ src: '../assets/encore/stance/' + def.id + '.png',
    cols: 1, rows: 1, col: 0, row: 0, matteMode: 'native-alpha', nativeFacing: 1 }),
  fidelity: Object.freeze({
    sourceIds: [def.sourceId], observedTraits: def.traits,
    combatAdaptation: 'Portrait, garde et neuf poses statiques créés pour Encore. Les techniques et les statistiques restent celles du personnage.',
    reviewStatus: 'Costume comparé au produit officiel',
    reviewScope: def.scope + ' La comparaison scène par scène et l’animation image par image restent à réaliser.',
  }),
})));

/**
 * Focused static artwork for Pomni, Caine and the abstractions.
 * A documented product appearance is distinct from an episode claim. The
 * publication gate in base-sprite-content.mjs requires two reviewed files;
 * planned definitions alone never enter the selectable wardrobe.
 */
export const FOCUS_20261127_BASE_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: 'godcaine',
    fighterId: 'caine',
    name: 'God Caine — Animatez',
    sourceId: 'store-godcaine-animatez-20261127',
    sourceTitle: 'GLITCH — God Caine Animatez',
    sourceUrl: 'https://glitchproductions.store/products/god-caine-animatez',
    sourceKind: 'Produit dérivé officiel ; composition illustrée pour Encore',
    sourceScope: 'La figurine officielle documente cette composition à six bras, globes décalés et accessoires. La fiche ne certifie ni la continuité d’un épisode ni de nouveaux pouvoirs de combat.',
    relatedAppearanceIds: Object.freeze(['monstrouscaine', 'badendcaine']),
    traits: Object.freeze([
      'Mâchoires rouges grandes ouvertes, dents blanches, grand globe rouge en haut à gauche et globe bleu-violet plus bas, décalés hors de leurs positions habituelles.',
      'Queue-de-pie rouge, plastron blanc à boutons rouges, nœud papillon noir, pantalon et haut-de-forme noirs à bande rouge.',
      'Six bras gantés blancs ; canne sombre à pommeau doré, trois globes blancs à pupille noire, éclairs jaune pâle et volumes de glitch cubiques attachés à la composition de référence.',
    ]),
    staticConstraint: 'Un seul Caine par image ; les globes et éclairs appartiennent à sa composition statique. Aucun cycle animé, projectile supplémentaire, transformation de simulation ou pouvoir inédit. Le socle commercial est exclu de la silhouette jouable.',
    scope: 'Deux dessins de base : portrait de sélection et garde statique. Cette présentation de produit conserve sa propre référence, sans remplacer les anciennes apparences monstrouscaine ou badendcaine. Les tailles et poses adaptées à la caméra 2D ne sont pas une certification canonique 1:1.',
    directory: '../assets/encore/base-costumes/godcaine',
    introducedOn: '2026-11-27',
    nativeFacing: 1,
    canonicalCostumeClaim: false,
    visual: Object.freeze({ maxIllustratedWidth: 280 }),
  }),
  Object.freeze({
    id: 'evilpomni-pendantz',
    fighterId: 'pomni',
    name: 'Evil Pomni — Pendantz',
    sourceId: 'store-evilpomni-pendantz-20261127',
    sourceTitle: 'GLITCH — Pomni Animiniz Pendantz, variante Evil Pomni',
    sourceUrl: 'https://glitchproductions.store/products/pomni-animiniz-pendantz',
    sourceUrls: Object.freeze([
      'https://glitchproductions.store/products/pomni-animiniz-pendantz',
      'https://www.youtube.com/watch?v=L4p2gN2CzsA&t=1250s',
    ]),
    sourceKind: 'PNJ officiel, produit dérivé et aperçu de l’épisode 5 ; adaptation illustrée pour Encore',
    sourceScope: 'Le produit officiel nomme Evil Pomni et documente sa palette rouge, jaune et bleue. L’aperçu officiel de l’épisode 5 vers 20 min 50 s montre la même incarnation adverse sur le terrain de softball. Les anciennes archives evilpomni et rivalbaseballpomni renvoient à ce même PNJ ; leurs dessins historiques ne sont pas des références officielles.',
    identityId: 'evilpomni-big-top',
    archiveAliases: Object.freeze(['evilpomni', 'rivalbaseballpomni']),
    traits: Object.freeze([
      'Bonnet de bouffon à quartiers rouges et jaunes, bande et deux pompons bleus ; cheveux noirs courts autour d’un visage clair.',
      'Grands iris en moulinets rouges et bleus, paupières noires à demi fermées, cils noirs, pommettes rouges et petit sourire asymétrique.',
      'Combinaison rouge et jaune, col à pointes et deux boutons bleus, liserés bleus ; gants et chaussures rouges/jaunes dépareillés, membres blancs courts.',
    ]),
    staticConstraint: 'Un seul personnage par image ; conserver les quartiers rouges/jaunes et accents bleus observés. Exclure mousqueton, ruban du porte-clés, étiquette et socle. Ne pas substituer l’ancienne interprétation noire de l’archive evilpomni.',
    scope: 'Deux dessins de base de l’incarnation Evil Pomni, PNJ adverse des Big Top. Le kit de Pomni est réutilisé pour cette représentation dans Encore ; il ne s’agit pas d’une transformation canonique de Pomni. Les deux anciens identifiants d’archive sont conservés comme alias du même PNJ, sans combattant supplémentaire. Les proportions et petits détails demandent leur propre comparaison visuelle.',
    directory: '../assets/encore/base-costumes/evilpomni-pendantz',
    introducedOn: '2026-11-27',
    nativeFacing: 1,
    canonicalCostumeClaim: false,
    visual: Object.freeze({ maxIllustratedWidth: 200 }),
  }),
]);

// Populated only from inspected native output and its measured SHA-256 values.
// An empty review map leaves the planned appearance unavailable at runtime.
export const FOCUS_20261127_BASE_REVIEWS = Object.freeze({
  "godcaine": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "786e73c137927c9bc181fdeb6102a8ac9844ef7206de6a7f598b3edf117ad98f",
      "stance": "c527d916b6958e15313015c81013c641b8be54d08b6f891163a6fdb4c5b68d14"
    },
    "visibleTraits": [
      "Dentier rouge largement ouvert, grand œil rouge décalé vers le haut à gauche et œil bleu plus bas ; les deux yeux gardent leurs stries horizontales.",
      "Habit rouge, plastron blanc à boutons rouges et nœud noir ; haut-de-forme sombre incliné, canne noire à pommeau doré et petits volumes cubiques.",
      "Déploiement de bras à gants blancs, trois globes blancs à pupille noire et pointes d’éclairs jaunes ; silhouette entière dans la garde, sans socle commercial."
    ],
    "identityEvidence": "Comparaison visuelle avec le produit officiel God Caine Animatez : https://glitchproductions.store/products/god-caine-animatez . Cette source de produit reste distincte des anciennes apparences monstrouscaine et badendcaine.",
    "framing": "Garde 1254 × 1254 : marges gauche/haut/droite/bas 87/12/54/38 px au seuil alpha > 12. Portrait 1254 × 1254 : 49/32/51/33 px ; le cadrage de sélection se concentre sur le buste et les accessoires.",
    "transparency": "Deux PNG RGBA natifs distincts. Pixels entièrement transparents : garde 49,64 %, sélection 40,75 %. Les éclats et pixels alpha faibles appartiennent aux sorties natives conservées sans retouche.",
    "proportions": "Le dessin conserve son rapport largeur/hauteur. La vue trois quarts et la composition du produit sont traduites en illustration 2D ; le miroir gauche est une convention du jeu, sans nouvelle vue officielle revendiquée.",
    "issues": [],
    "scope": "Portrait et garde statiques inspectés. Il s’agit d’une adaptation illustrée du produit officiel, sans certification pixel à pixel ni du modèle animé sous toutes les vues. Aucune pose d’action ou animation supplémentaire.",
    "captureId": "docs/art-generation/focus-20261127/bases/asset-review.json"
  },
  "evilpomni-pendantz": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "297c4e8a268201df65a544f7f9bbd9e8a7213de00ac383d8c51c641dc1ab321f",
      "stance": "132a18e59605d1eb53bd541f0cf168eb8fbeb8998a9b0e6f66ca61a9e0edf45b"
    },
    "visibleTraits": [
      "Bonnet et combinaison à quartiers rouges et jaunes ; bande de bonnet, deux pompons, col, deux boutons et liserés bleus.",
      "Cheveux courts sombres, visage clair, paupières noires à demi fermées, iris en moulinets rouges/bleus, joues rouges et petit sourire.",
      "Bras et jambes blancs, gant jaune à gauche de l’image et rouge à droite ; chaussures rouge et jaune dans la garde. Aucun mousqueton, ruban de porte-clés, socle ou texte."
    ],
    "identityEvidence": "Comparaison avec Evil Pomni du produit officiel Pomni Animiniz Pendantz et attribution de la même incarnation adverse à l’épisode 5 vers 20:50. Les archives evilpomni et rivalbaseballpomni restent des alias conservés du même PNJ.",
    "framing": "Garde 1312 × 1199 : marges gauche/haut/droite/bas 182/75/211/44 px au seuil alpha > 12. Portrait 1312 × 1199 : 94/87/97/74 px ; cadrage de buste séparé.",
    "transparency": "Deux PNG RGBA natifs distincts. Pixels entièrement transparents : garde 66,15 %, sélection 52,33 %. Les octets sont conservés sans détourage, recoloriage ou réencodage.",
    "proportions": "Silhouette compacte inspirée du Pendantz et adaptée à la garde d’Encore ; le rendu utilise une échelle uniforme. Le miroir suit la convention du jeu.",
    "issues": [],
    "scope": "Portrait et garde statiques du PNJ Evil Pomni, représenté avec le kit de Pomni pour le jeu. Ni transformation canonique de Pomni ni personnage supplémentaire. L’illustration 2D n’est pas une certification image par image de l’épisode.",
    "captureId": "docs/art-generation/focus-20261127/bases/asset-review.json"
  }
});

/** An archive portrait changes only once the complete native pair is reviewed
 * and published. Historical IDs and source pixels remain available as evidence.
 */
export function focusArchivePortraitOverride(archiveId, publishedFiles,
  reviews = FOCUS_20261127_BASE_REVIEWS) {
  const definition = FOCUS_20261127_BASE_DEFINITIONS.find(item => item.archiveAliases?.includes(archiveId));
  if (!definition) return null;
  const review = reviews[definition.id];
  if (review?.status !== 'verified-base-files'
    || !['selection', 'stance'].every(slot => /^[a-f0-9]{64}$/.test(review.sha256?.[slot] || ''))) return null;
  const published = publishedFiles instanceof Set ? publishedFiles : new Set(publishedFiles || []);
  if (!['selection', 'stance'].every(slot => published.has(`${definition.directory}/${slot}.png`))) return null;
  return Object.freeze({
    appearanceId: definition.id,
    path: `${definition.directory}/selection.png`,
    nativeFacing: definition.nativeFacing === -1 ? -1 : 1,
  });
}

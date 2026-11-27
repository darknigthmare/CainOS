/** Observed source traits and explicit camera adaptations, 27 November 2026. */
export const COMPLETED_STAGE_SOURCES = Object.freeze([
  { id: 'glitch-pilot-locations-20261127', title: 'GLITCH — lieux du pilote, vignettes officielles',
    url: 'https://www.youtube.com/watch?v=HwAPLk_sQ3w', kind: 'Vignettes de l’épisode officiel',
    scope: 'Storyboards publics YouTube inspectés, cellules 320 × 180 : terrains et lac vers 230/260 s, couloir vers 650/740 s, nid vers 990/1010 s. Horodatages approximatifs issus de la grille. Aucun visionnage du flux complet, mesure de décor ni détail occulté certifié.' },
  { id: 'glitch-canyon-storyboards-20261127', title: 'GLITCH — route du convoi de Candy Canyon',
    url: 'https://www.youtube.com/watch?v=4ofJpOEXrZs&t=420', kind: 'Vignettes de l’épisode officiel',
    scope: 'Cellules officielles YouTube 320 × 180 vers 420 et 520 s : route rose, strates des mesas roses, ciel vert menthe et nuages roses. Les véhicules masquent une partie du sol. La cour du palais ne sert pas de référence à cette route.' },
  { id: 'glitch-manor-storyboards-20261127', title: 'GLITCH — hall de Mildenhall Manor',
    url: 'https://www.youtube.com/watch?v=bKjfw77cxeQ&t=180', kind: 'Vignettes de l’épisode officiel',
    scope: 'Cellules officielles YouTube 320 × 180 vers 180/220 s : boiseries sombres, plafond à caissons, tableaux, rideaux lourds et lustre. Lumière et grandes masses observées ; détails, objets occultés et géométrie complète restent partiels.' },
]);
const scope = 'Peinture complète unique. Caméra élargie, personnages retirés, continuité des parties cachées et sol de duel adaptés pour Encore. Aucune certification canonique 1:1 ni géographie mesurée. Les anciens plans et accessoires ne sont pas superposés à ce nouveau lieu.';
const review = (sourceIds, observedTraits, combatAdaptation, detail) => Object.freeze({
  sourceIds, observedTraits, combatAdaptation,
  reviewStatus: 'Référence visuelle consultée — comparaison partielle',
  reviewScope: detail + ' ' + scope,
});
export const COMPLETED_STAGE_FIDELITY = Object.freeze({
  bigtop: review(['ep1', 'glitch-cast'], [
    'Salon aux murs turquoise, grand couronnement jaune et porte arrondie rouge et verte.',
    'Fauteuil magenta, canapé bleu, canapé orange, borne jaune et damier orange clair visibles dans le visuel du groupe.',
  ], 'Le salon devient une peinture frontale vide avec un damier continu sous les combattants.', 'Photographie promotionnelle officielle du groupe inspectée ; le retrait des personnages exige une reconstruction du mobilier masqué.'),
  candy: review(['ep2', 'glitch-canyon-storyboards-20261127'], [
    'Route poussiéreuse rose, mesas à strates roses et horizon dégagé.',
    'Ciel vert menthe, horizon jaune-vert et nuages roses arrondis.',
  ], 'La route est élargie en terrain continu ; aucun vide ni rebord du canyon sous les combattants.', 'Deux cellules 320 × 180 du convoi inspectées ; disposition des reliefs et détail des matières restent interprétés.'),
  manor: review(['ep3', 'glitch-manor-storyboards-20261127'], [
    'Hall sombre à boiseries, plafond à caissons, lustre et éclairage de chandelles.',
    'Panneaux vert-brun très sombres, tableaux encadrés et rideaux lourds au fond.',
  ], 'Composition frontale du hall avec plancher continu ; meubles secondaires et surfaces occultées recomposés.', 'Le hall de l’entrée est distinct de la salle des trophées et du cellier du manoir. Deux cellules officielles de faible résolution inspectées.'),
  cellar: review(['ep1', 'glitch-cellar'], [
    'Espace presque noir, yeux multicolores irréguliers aux marges et cône de lumière centrale.',
    'Reflets faibles au sol, sans porte de stockage ni architecture détaillée visible.',
  ], 'Le sol noir est continu et élargi ; les yeux restent un motif du décor, aucun combattant abstrait n’est incorporé à la peinture.', 'Visuel officiel dédié au cellier inspecté directement.'),
  void: review(['ep1', 'glitch-void'], [
    'Blanc laiteux, nuances lilas et bleu clair, refractions rectangulaires et franges cyan/rose.',
    'Profondeur abstraite lumineuse sans mobilier, escalier ni porte EXIT.',
  ], 'Pomni est retirée ; une continuité très pâle de sol sert de convention au duel dans l’espace infini.', 'Visuel officiel du Vide inspecté directement ; cette image ne décrit pas le quadrillage sous Candy Canyon.'),
  lake: review(['ep1', 'glitch-pilot-locations-20261127'], [
    'Dans le panorama du pilote : lac bleu, tour claire à toit rose et toboggan rouge en spirale.',
    'Collines vertes, arbres arrondis et chapiteau rouge/jaune au loin.',
  ], 'La caméra est rapprochée depuis une rive d’herbe originale ; l’eau reste derrière toute la ligne de combat.', 'La source primaire du lac est désormais identifiée dans le pilote. La vue rapprochée, la forme précise de la rive et les détails de la tour restent des adaptations, distinctes d’une reconstruction de la plage de l’épisode 7.'),
  gloink: review(['ep1', 'glitch-pilot-locations-20261127'], [
    'Caverne sombre bleu-violet, surfaces rocheuses irrégulières et petits motifs géométriques lumineux.',
    'Étoiles dessinées en contour et touches cyan, vert, jaune et magenta en profondeur.',
  ], 'La reine et les personnages sont retirés ; la roche masquée est prolongée pour former un sol vide et continu.', 'La grande reine masque l’essentiel du fond dans les cellules consultées : cette continuité rocheuse n’est pas présentée comme le plan caché officiel du nid.'),
  grounds: review(['ep1', 'glitch-pilot-locations-20261127'], [
    'Pelouse verte, arbres arrondis, montagnes claires, lac et tour à toboggan, chapiteau rouge/jaune et petit parc de manèges.',
    'Ciel partagé entre nuit bleue à lune/étoiles dessinées et jour cyan nuageux.',
  ], 'Le panorama devient un point de vue au niveau de l’herbe ; tous les monuments restent derrière la ligne de combat.', 'Les deux panoramas du pilote établissent les repères, mais pas la position mesurée de cette caméra. Le chariot décoratif de l’ancien décor reste disponible uniquement avec ses anciens plans.'),
  backstage: review(['ep1', 'glitch-pilot-locations-20261127'], [
    'Couloir à bandes verticales roses, saumon et violettes, fines moulures claires et tapis rouge.',
    'Petites portes brunes à médaillons, images abstraites encadrées, plafonniers clairs et arche au fond.',
  ], 'Couloir élargi, personnages retirés et tapis étendu jusqu’aux deux bords ; les médaillons restent des symboles simplifiés.', 'Deux cellules officielles du pilote remplacent la dépendance aux seules copies tierces. Ordre et nombre des chambres, identité des petits médaillons et dessins fins ne sont pas certifiés.'),
});

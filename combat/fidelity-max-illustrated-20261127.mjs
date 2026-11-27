/** Illustrated Max provenance. This deliberately does not replace the historic pixel-atlas review. */
export const MAX_ILLUSTRATED_SOURCES = Object.freeze([
  {
    id: 'glitch-max-episode2-storyboards-20261127',
    title: 'GLITCH — Max dans Candy Carrier Chaos!, vignettes officielles',
    url: 'https://www.youtube.com/watch?v=4ofJpOEXrZs&t=1220',
    kind: 'Vignettes de l’épisode officiel',
    scope: 'Storyboards publics YouTube récupérés depuis la réponse du lecteur de la chaîne GLITCH. Cellules 320 × 180 inspectées, notamment vers 340, 420, 1220 et 1240 s. Petit caïman violet, dessous du museau blanc en zigzag, bas du corps rouge et chapeau brun arrondi observables. Ces échantillons ne constituent ni un visionnage continu ni une mesure du modèle 3D. URL, dimensions et SHA-256 des planches conservés dans docs/art-generation/completion-20261127/max/references/episode2-storyboards.json.',
  },
  {
    id: 'max-tvmaze-reproduction-20261127',
    title: 'TVmaze — reproduction du personnage Max',
    url: 'https://www.tvmaze.com/characters/1304195/the-amazing-digital-circus-max',
    kind: 'Reproduction sur un hébergement tiers',
    scope: 'Petit portrait de personnage inspecté pour préciser les bras très courts, le ventre blanc, la transition violet/rouge et le chapeau melon brun à bande rouge. Cette reproduction secondaire complète les cellules officielles ; elle ne devient pas une source primaire et ne mesure pas les proportions du modèle.',
  },
]);

export const MAX_ILLUSTRATED_FIDELITY = Object.freeze({
  sourceIds: ['ep2', 'glitch-max-episode2-storyboards-20261127', 'max-tvmaze-reproduction-20261127'],
  observedTraits: [
    'Petit caïman de confiserie au haut du corps violet et au bas du corps rouge ; museau allongé à dessous blanc, bord supérieur en zigzag et yeux blancs sans pupille lisible.',
    'Bras très courts, ventre blanc, queue reptilienne et chapeau brun à calotte arrondie ; la reproduction secondaire rend la bande rouge du melon plus lisible.',
  ],
  combatAdaptation: 'Les six familles Murder Drones et Meta Runner ajoutent des vêtements ou des transformations corporelles originales pour Encore. Chaque famille contient un portrait séparé et une garde entière statique. Les poses de combat, la stylisation en cel shading, les capacités et les fusions ne sont pas des éléments de l’épisode.',
  reviewStatus: 'Référence visuelle consultée — comparaison partielle des PNG illustrés',
  reviewScope: 'Cette fiche concerne les PNG illustrés de Max et la revue de leurs repères d’identité. Les douze nouveaux PNG de crossover datés du 27 novembre 2026 utilisent un melon brun à bande rouge et des membres courts. Ils conservent une palette violet/rose plus saturée et des proportions illustrées : aucune fidélité globale 1:1 au modèle 3D n’est affirmée. Les deux anciens PNG Encore de base montrent encore un chapeau à bord relevé, un gilet brun et des bras plus grands ; ces différences observées restent à corriger. L’ancienne revue du sprite pixel vert décrit son atlas d’archive et reste indépendante.',
  spriteReview: {
    captureId: 'docs/art-generation/completion-20261127/max/manifest.json',
    status: 'verified-base-files',
    identityEvidence: 'Comparaison visuelle des échantillons officiels, de la reproduction secondaire et des PNG illustrés ; source primaire et copie tierce distinguées.',
    framing: 'Nouveaux crossovers : garde entière à droite et portrait séparé à la taille, une seule silhouette par image.',
    transparency: 'Douze nouveaux PNG RGBA natifs, alpha et dimensions mesurés, SHA-256 distincts et bytes conservés.',
    proportions: 'Membres raccourcis et melon rétabli dans les nouveaux crossovers ; le style Encore reste une adaptation illustrée.',
    issues: [
      'Les anciens assets/encore/stance/max.png et assets/encore/selection/max.png gardent le chapeau à bord relevé et le gilet inventé ; ils ne sont pas certifiés fidèles au modèle de l’épisode.',
      'La garde statique sert aux états sans dessin dédié ; aucun cycle animé de Max n’est attesté par cette livraison.',
    ],
  },
});

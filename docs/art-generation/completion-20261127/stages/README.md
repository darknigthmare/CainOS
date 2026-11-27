# Neuf lieux supplémentaires — peintures complètes

Les neuf PNG de cette tranche complètent les quatre peintures déjà publiées
dans la livraison `cc972c8` : **treize lieux utilisent maintenant une image
complète**, parmi les 27 arènes partagées. Les quatorze autres gardent leurs
trois plans historiques. Le chargement et le déplacement de caméra existants
restent utilisés ; aucune nouvelle scène ne prétend être trois plans indépendants.

| Lieu | Référence observée | Adaptation pour le duel |
| --- | --- | --- |
| Chapiteau / `bigtop` | Visuel promotionnel officiel GLITCH du groupe : salon turquoise, porte rouge et verte, sièges colorés, damier orange | Personnages retirés ; mobilier masqué reconstruit ; avant-plan continu |
| Candy Canyon / `candy` | Épisode 2 officiel, vignettes vers 420 et 520 s : route rose, mesas stratifiées, ciel menthe | Convoi retiré et voie élargie |
| Manoir / `manor` | Épisode 3 officiel, vignettes vers 180 et 220 s : boiseries, plafond à caissons, lustre, rideaux | Vue frontale dégagée du hall ; détails partiellement reconstruits |
| Cave / `cellar` | Image promotionnelle GLITCH : obscurité, yeux multicolores et lumière centrale | Sol sombre rendu continu pour les pieds des combattants |
| Vide / `void` | Image promotionnelle GLITCH : espace blanc et réfractions rectangulaires | Champ élargi et repère de sol discret |
| Lac / `lake` | Panorama du pilote, vers 230 et 260 s : lac, tour et toboggan rouge | Caméra rapprochée depuis une rive herbeuse originale |
| Nid des Gloinks / `gloink` | Pilote, vers 990 et 1010 s : caverne sombre et motifs géométriques lumineux | Reine retirée ; roche cachée prolongée ; passage au sol dégagé |
| Terrains / `grounds` | Panorama du pilote : collines, arbres, chapiteau rouge et jaune, ciel partagé jour/nuit | Caméra descendue sur l’herbe ; repères maintenus au loin |
| Couloir / `backstage` | Pilote, vers 650 et 740 s : panneaux roses, petites portes, tableaux abstraits, lampes rondes | Perspective élargie et tapis étendu sous toute la ligne de combat |

Les sources sont les pages et images de [GLITCH](https://www.glitchprod.com/digital-circus),
le [pilote](https://www.youtube.com/watch?v=HwAPLk_sQ3w),
l’[épisode 2](https://www.youtube.com/watch?v=4ofJpOEXrZs) et
l’[épisode 3](https://www.youtube.com/watch?v=bKjfw77cxeQ).
Les cellules YouTube consultées font 320 × 180 pixels ; elles ne constituent
pas une analyse du flux vidéo intégral ni une mesure des lieux. Les heures
approximatives, pages natives, recadrages de référence et SHA-256 sont conservés
dans le [manifeste](manifest.json) et dans `references/`.

L’image du lac ne dérive pas de la plage de l’épisode 7. Cette piste a été
inspectée, puis écartée au profit du lac visible dans le pilote. La cellule
`candy-route-wide.png` à 450 s n’est pas utilisée ; le fichier local historique
`candy-route-500.png` correspond réellement à la cellule à **520 s**, comme
l’indiquent les métadonnées corrigées.

## Contrôle des images et du raccordement

Chaque fichier est une sortie PNG native distincte de l’outil de génération,
copiée sans retouche ni réencodage. Les neuf peintures sont opaques et mesurent
1672 × 941 pixels. Elles occupent **16 445 751 octets**. La [planche native](native-overview.jpg)
est un aperçu de revue ; elle ne remplace pas les images du jeu.

Le premier couloir plaçait la rencontre mur/tapis trop bas aux extrémités de
l’image. Une correction native a relevé l’architecture et étendu le tapis ;
le premier candidat est archivé, exclu du runtime. Le PNG corrigé conserve
un sol dégagé sur toute la largeur à la hauteur des pieds.

Le script `scripts/render-combat-rebuilt-stage-review.mjs` vérifie les treize
scènes avec le loader et le renderer de production : trois caméras, image
opaque, absence d’anciens accessoires superposés, échelle uniforme des acteurs
et capture d’un duel initialisé. Son résultat d’exécution est enregistré
séparément dans `canvas/stage-canvas-review.json`. Un duel initialisé n’est pas
une partie jouée ; le rendu Canvas natif ne teste pas le DOM, le réseau du
navigateur ou le service worker.

Les tests navigateur conservent le chargement des 27 arènes, la panne puis
la reprise des images, le cache et les 14 arènes à trois plans. Leur résultat
est rapporté dans la vérification générale, sans confondre un test écrit et
un test réussi.

La fidélité porte sur les repères visibles consultés. Le champ de caméra,
le retrait des personnages, les continuités cachées et les sols de combat
sont des adaptations Encore documentées. **Aucune reconstruction canonique
globale 1:1 n’est certifiée.**

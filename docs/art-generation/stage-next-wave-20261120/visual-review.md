# Revue visuelle de Barnoir

Inspection finale du 20 novembre 2026 sur le manifeste `0.7.0-087fd3609c69`, art `0c178f8964773da7`, contenant **5 816 images / 3 118 619 440 octets**. Les trois sorties natives avaient été regardées individuellement. La [planche des trois caméras](review/three-cameras.png) et le [fallback procédural](review/fallback.png) ont ensuite été régénérés, ouverts et inspectés avec le vrai chargeur et le renderer de production sur ce manifeste final. La première revue a été [archivée](review-history/preliminary-20261120T145102/archive-manifest.json) avant remplacement.

## Composition examinée

Les six vues de la planche montrent les trois plans seuls, puis le duel Pomni / Gummigoo, aux caméras −1, 0 et +1. Les suspensions claires, les étagères et le liseré du comptoir forment un fond stable. Le comptoir reste derrière les silhouettes ; les pieds des deux combattants reposent sur le damier à la ligne de jeu y568. Les reflets cyan, roses et jaunes sont faibles et restent au premier plan inférieur. Aucun trou transparent ni raccord vide n’apparaît aux limites de caméra. Les personnages placés près des limites restent visibles.

Le plan lointain conserve la pénombre, les trois suspensions à facettes, les verres et bouteilles, le cocktail rose et le chien en ballon jaune visibles dans les vignettes officielles. Le signe vert est simplifié en motif lumineux : il ne prétend pas transcrire exactement l’enseigne OPEN. La disposition symétrique, la perspective du damier, les distances et les reflets sont une composition de jeu, pas une reconstruction métrique du plan de l’épisode.

Le fallback présente bien un bar sombre à trois lampes, étagères, comptoir et sol carrelé, distinct de la piste du cirque. Il est volontairement plus simple que l’illustration ; sa présence n’est pas comptée comme une quatrième image produite.

## Résultats techniques associés

Le [rapport Canvas](review/canvas-review.json) confirme six contrôles : chargement des trois fichiers actifs, fallback distinct, couverture opaque aux trois caméras, centrage avec mouvement réduit, variation de lumière sans modification des pixels du sol, et absence de mutation du modèle de combat. Il s’agit du renderer de production exécuté sous Node et Skia, sans DOM ni interaction navigateur.

Les trois images natives de 1672 × 941 sont acceptées sans retouche ni réencodage. Le fond est RGB opaque ; les deux autres plans sont RGBA. Les quelques pixels d’alpha 1 des zones presque transparentes restent natifs. Les six comparaisons entre sortie, copie archivée et fichier actif passent, ainsi que les huit empreintes des références d’entrée. Les [69 anciens plans](existing-planes-preserved.json) sont identiques aux blobs du commit de départ.

## Limites encore ouvertes

La [tentative Chromium](browser-result.json) de cette vague, à 14:51:46 UTC avant le manifeste final, a échoué au lancement, avant toute navigation, avec `socket() failed: Operation not permitted`. Elle a exécuté **zéro contrôle navigateur**. Le journal et ses empreintes sont conservés dans [browser.log](browser.log) ; aucun nouvel essai n’a été lancé. Aucun résultat de navigateur, de service worker, de manette, d’audio entendu ou d’appareil physique n’est déduit de la revue Canvas, et les costumes intégrés ensuite ne sont pas présentés comme vérifiés par cette tentative.

Les vignettes primaires ont une définition de 320 × 180 par cellule. Elles justifient les grandes formes et les couleurs, pas les textes fins ni la géographie masquée. Le nouveau décor ne qualifie aucun costume occulté dans ces références. Le rapport courant vérifie le manifeste final ; le premier rapport reste identifié dans son archive comme une vérification sur le manifeste préliminaire. Les [tests ciblés antérieurs](targeted-test-evidence.json) et la [QA globale de la vague](../next-wave-20261120/qa-result.json) possèdent chacun leurs propres dates et empreintes.

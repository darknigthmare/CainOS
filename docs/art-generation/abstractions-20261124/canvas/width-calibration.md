# Calibration de taille des nouvelles abstractions

La normalisation de chaque pose à la hauteur debout grossissait certaines silhouettes couchées et réduisait la masse de poses dressées. Le rendu applique maintenant la hauteur calibrée du dessin réellement chargé, puis le plafond de largeur propre à l’apparence. Chaque opération conserve un facteur identique sur les deux axes. L’ancre et le support au sol sont préservés ; aucun PNG, corps, coup ou ancien personnage n’est modifié.

## Plafonds mesurés

| Apparence | Largeur de stance | Plafond | Actions limitées | Ancre horizontale |
| --- | ---: | ---: | ---: | ---: |
| cellarabstraction | 241.11 px | 290 px | 5 | 0.5 |
| aquaticabstraction | 428.46 px | 480 px | 2 | 0.78 |
| abstractedjax | 347.73 px | 420 px | 1 | 0.5 |
| abstractedqueenie | 293.74 px | 355 px | 3 | 0.5 |
| abstractedribbit | 246.69 px | 300 px | 3 | 0.5 |
| abstractedqueeniedark | 95.33 px | 315 px | 3 | 0.5 |
| originalabstractedpomni | 438.22 px | 530 px | 0 | 0.5 |
| originalabstractedragatha | 326.82 px | 395 px | 1 | 0.5 |
| originalabstractedgangle | 268.28 px | 325 px | 5 | 0.5 |
| originalabstractedkinger | 321.19 px | 390 px | 2 | 0.5 |
| originalabstractedzooble | 329.45 px | 400 px | 2 | 0.5 |

Les plafonds généraux gardent environ 20 % de marge de geste autour de la largeur de stance. Celui de l’aquatique est limité à 480 px pour conserver les tentacules dans le cadrage de départ. Celui de Queenie calme est propre au costume : 315 px, d’après son corps long de 285 px avec marge de flexion ; l’état actif garde 355 px. La forme calme conserve son ancre centrale de 0,5 dans les deux sens.

## Cinq poses dressées

L’auteur a mesuré la grande pupille segmentée de Pomni et le bouton bleu de Ragatha sur les PNG natifs. Les facteurs ne concernent que les cinq dessins ci-dessous. Un dessin absent conserve la taille de la stance de repli. Le plafond de largeur reste appliqué après le facteur de hauteur ; il ne se déclenche pas sur ces cinq cas.

| Apparence / dessin | Facteur | Dimensions avant | Dimensions après | Repère estimé avant → après |
| --- | ---: | ---: | ---: | ---: |
| originalabstractedpomni / intro | 1.45 | 287.45 × 260.00 px | 416.81 × 377.00 px | 36.87 → 53.46 px |
| originalabstractedpomni / hit | 1.40 | 317.32 × 260.00 px | 444.25 × 364.00 px | 37.44 → 52.42 px |
| originalabstractedpomni / victory | 1.55 | 278.96 × 260.00 px | 432.39 × 403.00 px | 33.74 → 52.30 px |
| originalabstractedpomni / heavy | 1.40 | 263.74 × 260.00 px | 369.24 × 364.00 px | 37.69 → 52.76 px |
| originalabstractedragatha / heavy | 1.35 | 239.23 × 275.00 px | 322.96 × 371.25 px | 43.60 → 58.86 px |

La pupille de stance mesure environ 52,87 px et le bouton de stance environ 58,84 px selon ces repères. Les deux planches corrigées ont été inspectées par l’auteur et le responsable du rendu : les têtes, griffes et bouton retrouvent une taille cohérente ; les poses restent entières, sans étirement. Les régions et prédicats de mesure sont archivés dans le relevé d’auteur.

## Vérification finale

Les 27 actions horizontales concernées respectent leur plafond. Les 220 dessins de production contrôlés conservent leur ancre ; leurs bornes se reflètent symétriquement. Les 99 dimensions finales concordent avec les facteurs déclarés à moins de 0,001 px. Les 60 tests ciblés de rendu et projectiles passent. Chaque planche utilise une échelle commune et commence par la stance.

Les tentacules de l’aquatique restent décoratives en dehors de son corps de collision de 195 × 200 px. Les dessins ne définissent pas les collisions au pixel près. Les poses sont des images individuelles ; ces contrôles ne constituent ni une animation image par image ni une certification canonique.

[Calibration de largeur avant](width-calibration-before.json) · [Mesures de largeur après](width-calibration-after.json) · [Repères natifs de hauteur](../originals/pose-height-measurements.json) · [Mesures de hauteur après](pose-height-calibration-after.json) · [Planches et contrôles](characters/README.md)

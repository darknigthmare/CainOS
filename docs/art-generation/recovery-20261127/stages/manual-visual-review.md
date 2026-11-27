# Revue visuelle des quatre scènes complètes

Revue du 27 novembre 2026, après inspection des cinq références, des PNG natifs,
de la planche de comparaison et des captures produites par le renderer de jeu.

| Lieu | Repères observés | Portée et décision |
| --- | --- | --- |
| Bureaux EXIT | Murs gris-vert, cimaise blanche, porte bordeaux et panneau EXIT, classeurs, image abstraite, moquette sombre. | Décor reconnaissable et vide ; sol lisible sous les deux combattants. La largeur et les zones cachées par Pomni sont recomposées. |
| Sous la carte | Grille large bleu cobalt sur fond indigo, continuité du plancher et reflets discrets. | L’ancrage de rendu place la jonction à y=520 derrière les pieds à y=568. Le recadrage uniforme agrandit la grille ; aucune perspective mesurée de l’épisode n’est certifiée. |
| Cour du royaume | Architecture rose, larges piliers, ornements en glaçage, arcades et cour continue. | Identité du lieu conservée, centre dégagé. Façade et régions masquées sont recomposées pour le combat. |
| Spudsy’s | Bandeau bordeaux, menus jaunes, luminaires circulaires, cuisine, comptoir crème/rouge à deux bandes, écusson S, sol carrelé. | Deuxième cadrage retenu pour disposer d’un vrai sol devant le comptoir. Le premier essai reste archivé, non chargé. Des détails de la source sont simplifiés ; aucune transcription visuelle pixel à pixel n’est certifiée. |

Dans les quatre captures, les deux dessins de combattants sont entiers, les
pieds et ombres se lisent sur le sol, aucun personnage n’est peint dans le fond,
et aucun rideau ni estrade de théâtre ne remplace le lieu de référence.

La preuve technique vérifie les positions de caméra -1, 0 et 1, l’opacité de
chaque pixel du fond, l’utilisation du fichier natif attendu, l’absence
d’anciennes décorations procédurales supplémentaires, l’échelle uniforme des
combattants et l’absence de mutation de la simulation par le rendu. Les captures
sont des **duels initialisés**, pas des matchs joués.

Les quatre fonds sont des **peintures complètes statiques**. Le déplacement
global de caméra n’est pas une livraison de trois plans de parallaxe indépendants.
Les dimensions natives et SHA-256 sont dans [l’inventaire](../stage-files.json),
les sources dans [sources.json](sources.json), et les contrôles du renderer dans
[stage-canvas-review.json](canvas/stage-canvas-review.json).

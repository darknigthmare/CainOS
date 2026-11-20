# Watermelon Gangle — qualification et portée

Date : 2026-11-20. Revue visuelle par ribbit_references.

## Décision

Ajouter une apparence distincte `watermelongangle` pour Gangle. La fiche GLITCH nomme Watermelon Gangle et les photos montrent des différences de vêtements et d’accessoires suffisantes pour ne pas remplacer `beachgangle`.

## Sources inspectées

- [Fiche GLITCH — Beach Vacation Series](https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series).
- [Rendu individuel Watermelon Gangle](https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_05.png?v=1765572441&width=1600) : chapeau, masque, haut, jupe et accessoires ; pied avant de ruban et partie du ruban arrière.
- [Photo du groupe](https://glitchproductions.store/cdn/shop/files/Beach_Animatez_07.png?v=1765572441&width=1600) et [photo rapprochée](https://glitchproductions.store/cdn/shop/files/Beach_Animatez_08.png?v=1765572441&width=1600) : mêmes couleurs, même nœud, même combinaison batte/pastèque. Les deux sont des vues proches, pas une vue arrière indépendante.
- Fichiers locaux inspectés : `assets/encore/selection/beachgangle.webp` et `assets/encore/selection/gangle.webp` pour la comparaison et les proportions du jeu.

Les trois photos officielles sont archivées sans retouche dans `references/watermelongangle/` ; URLs, dimensions et SHA-256 sont dans `references.json`.

## Comparaison

| Élément | beachgangle présent | Watermelon Gangle officiel |
| --- | --- | --- |
| Chapeau | Paille ocre, large ruban bleu et fleur rose | Jaune, bande et nœud pervenche, pas de fleur |
| Vêtement | Paréo bleu à fleurs blanches, attache étoile | Haut pervenche et jupe courte plissée assortie, ruban rouge visible à la taille |
| Accessoires | Noix de coco, paille et ombrelle | Batte sombre à manche brun, tranche de pastèque |
| Visage | Masque de comédie souriant dans la sélection | Masque aux yeux tombants, larmes cyan, petite bouche courbe avec joue pleine et deux graines près de la bouche |
| Anatomie | Masque et corps de rubans rouges | Même identité de rubans rouges ; extrémités sans chaussures |

## Adaptation retenue et limites

Garder le chapeau jaune, le nœud pervenche, le haut et la jupe, les deux accessoires et les larmes cyan. Employer l’anatomie et les proportions élancées de Gangle du jeu. La batte et la tranche restent portées par les extrémités de ruban ; aucun doigt humain, bras de peau ni chaussure n’est ajouté. La demi-pastèque au sol est un élément de mise en scène, pas un troisième accessoire porté.

Le rendu individuel masque une partie de la jambe arrière derrière la demi-pastèque. Il établit le matériau rouge de ruban et ne suggère aucun vêtement ou chaussure supplémentaire ; la pose complète du jeu prolonge cette anatomie existante. Le dos du vêtement n’est pas montré : toutes les nouvelles poses restent de face à trois quarts vers la droite et ne prétendent pas documenter le dos. Les poses sont des adaptations originales de fan-game ; elles ne certifient ni une apparition dans un épisode ni une reproduction 1:1.

## Production

Onze PNG individuels natifs produits et acceptés : selection, stance, intro, attack, heavy, hit, walk, jump, crouch, victory, defeat. La sélection est validée avant de servir de référence aux dix autres poses. Chaque reçu conserve le prompt exact, les références, la source native, l’orientation, les dimensions, l’alpha et la revue réelle. Les composites de contrôle sont séparés des PNG natifs.

## Résultat vérifié

11 PNG natifs, 11 empreintes SHA-256 distinctes, 7277249 octets. Les onze copies sont identiques aux sorties natives et leurs bornes alpha > 12 sont internes. Tous les slots ont été inspectés individuellement puis sur fond opaque. Aucune correction n’a été nécessaire. La sélection conserve une marge basse native de 8 px, sans découpe. Voir `generated/watermelongangle/family-audit.json` et `generated/watermelongangle/review/family-alpha-overview.jpg`. L’intégration et la revue dans le runtime relèvent du lot global.

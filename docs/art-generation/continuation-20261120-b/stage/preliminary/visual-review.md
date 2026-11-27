# Revue visuelle préliminaire — stade de softball

Cette revue a été réalisée sur les images du vrai chargeur de parallaxe et de `CombatRenderer`, après le manifeste préliminaire `0.7.0-408e0b2a5290` / art `a688b34df05f735c` (5 819 images). Elle ne qualifie pas encore le futur manifeste comprenant les 55 nouveaux dessins de personnages.

## Images effectivement inspectées

- [Trois caméras et trois scènes](review/three-cameras.png) : caméras −1, 0 et +1, avec Pomni et Gummigoo positionnés à gauche, au centre et à droite.
- [Repli procédural](review/fallback.png) : affichage du stade avant le chargement des plans PNG.

Les tribunes brunes, les structures bleues, les projecteurs blancs, la pelouse et la terre ocre forment une scène lisible. Le tableau d’affichage reste sans texte ni score actif. Aux trois positions, le fond couvre le cadre sans trou transparent ; les séparations de plans ne créent pas de rupture visible. Les pieds des deux combattants restent lisibles sur la piste horizontale, sans barrière ni objet devant eux. Les petites touffes du premier plan restent aux coins inférieurs. Le voile blanc constaté dans le premier essai de `near` n’est plus présent.

Le repli procédural reprend les projecteurs, les gradins, la pelouse, le tableau vide et la terre ; il reste volontairement plus simple que les PNG. Le contrôle automatique confirme qu’il ne substitue pas le cirque à cette arène.

## Contrôles mesurés

Le [rapport Canvas](review/canvas-review.json) donne six contrôles réussis, trois caméras et trois scènes de combat. Le maximum d’alpha du seul premier plan au-dessus des pieds vaut 2, 2 puis 1 sur 255. La variation ambiante modifie le haut de l’image sans modifier un seul pixel du sol. Le mode de mouvement réduit fixe la caméra au centre. Les définitions du stage et les états des acteurs restent inchangés par la revue.

Le fond est un PNG RGB opaque de 1 672 × 941 ; le plan médian est RGBA de 1 672 × 941 ; le premier plan corrigé est RGBA de 1 671 × 941. Chaque sortie native est conservée à l’octet près. Le chargeur existant dessine chaque source dans sa surface de débord habituelle ; aucune image livrée n’a été redimensionnée, retouchée ou réencodée.

## Portée

Les grandes formes et matériaux proviennent des [planches officielles M12](../references/episode5-storyboard-L3-M12.jpg) et [M15](../references/episode5-storyboard-L3-M15.jpg), dont chaque cellule ne mesure que 320 × 180. La perspective de duel, les distances, la séparation de parallaxe, les textures fines et les variations lumineuses sont des adaptations originales. Cette inspection ne certifie aucune géométrie masquée ou exactitude canonique intégrale.

Le navigateur local n’a pas été exécuté pour cette vague. L’[antécédent de lancement Barnoir](../browser-result.json) est historique et distinct. La revue Canvas ne contrôle ni les interactions DOM, ni les entrées, ni l’audio, ni le service worker, ni les appareils physiques.

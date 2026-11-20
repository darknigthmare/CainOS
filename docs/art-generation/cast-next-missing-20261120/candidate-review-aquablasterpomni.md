# Aqua Blaster Pomni — qualification et portée

Date : 2026-11-20. Revue visuelle par ribbit_references.

## Décision

Ajouter une apparence distincte `aquablasterpomni` pour Pomni après Watermelon Gangle. La fiche GLITCH la nomme Aqua Blaster Pomni ; le rendu individuel complet et la photographie montrent l’arme et les bras dépourvus de brassards. Cette distinction était déjà indiquée dans la portée de `beachpomni`.

## Sources inspectées

- [Fiche GLITCH — Beach Vacation Series](https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series).
- [Rendu individuel Aqua Blaster Pomni](https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_08.png?v=1765572441&width=1600) : personnage complet, visage, bonnet, bras, tenue, chaussures et pistolet.
- [Menu du produit](https://glitchproductions.store/cdn/shop/files/Beach_Menu.png?v=1765572523&width=1600) : même silhouette avec arme.
- [Photo rapprochée du groupe](https://glitchproductions.store/cdn/shop/files/Beach_Animatez_06.png?v=1765572441&width=1600) : confirmation de la forme et des couleurs du pistolet, de l’absence de brassards et des chaussures.
- Comparaison locale : `assets/encore/selection/beachpomni.png`, image et portée de la définition `beachpomni` dans `combat/costume-additions.mjs`.

Les trois photos officielles sont archivées sans retouche dans `references/aquablasterpomni/` ; URLs, dimensions et SHA-256 sont dans `references.json`.

## Comparaison

| Élément | beachpomni présent (peluche) | Aqua Blaster officiel (figurine) |
| --- | --- | --- |
| Bonnet et visage | Rouge/bleu, bord et grelots jaunes, cheveux bruns, yeux en moulinets | Même identité et palette |
| Tenue | Haut rayé bleu/blanc, short bleu à cordon blanc, chaussures bleues | Même famille de vêtements, corps simplifié de figurine |
| Bras | Deux brassards gonflables jaunes | Aucun brassard |
| Accessoire | Aucun pistolet | Pistolet magenta, vert vif, orange et turquoise porté à deux mains |
| Mise en scène | Personnage seul | Jet d’eau moulé et socle de flaque |

## Adaptation retenue et limites

Garder le haut, le short, les chaussures et le bonnet, enlever les brassards et porter le pistolet à eau multicolore dans chaque pose. L’arme comprend un corps magenta, un canon vert nervuré terminé par un embout orange et un réservoir/anse turquoise à l’arrière. Conserver exactement deux bras et deux jambes. La silhouette demeure celle de Pomni du jeu ; les proportions très courtes de la figurine ne sont pas reprises.

Le pistolet masque une partie du haut et du cordon dans les vues officielles. La partie cachée est prolongée de façon cohérente avec les zones visibles et la tenue `beachpomni`, sans revendiquer une documentation intégrale du vêtement. Le socle et le jet transparent moulé sont exclus des poses neutres pour rester des sprites de personnage. Ces poses sont des adaptations originales de fan-game, pas une certification canonique 1:1.

## Production

Onze PNG individuels natifs produits et acceptés : selection, stance, intro, attack, heavy, hit, walk, jump, crouch, victory, defeat. La sélection est validée avant de servir de référence aux dix autres poses. Les reçus documentent le prompt, les références exactes, le fichier natif, l’orientation, les dimensions, l’alpha et la revue après inspection. Les PNG actifs restent inchangés.

## Résultat vérifié

11 PNG natifs, 11 empreintes SHA-256 distinctes, 12439515 octets. Les onze copies sont identiques aux sorties natives et leurs bornes alpha > 12 sont internes. Tous les slots ont été inspectés individuellement puis sur fond opaque. Aucune correction n’a été nécessaire. Voir `generated/aquablasterpomni/family-audit.json` et `generated/aquablasterpomni/review/family-alpha-overview.jpg`. L’intégration et la revue dans le runtime relèvent du lot global.

# Consignes artistiques — Encore 0.6.0

Cette note résume les consignes de génération et les décisions d’intégration.
Les cinq nouvelles planches ont été produites avec l’outil de génération d’images
intégré, à partir des illustrations du projet inspectées et des références ciblées.
Les PNG historiques sont conservés. Les nouvelles illustrations sont des
interprétations en pixel art ; aucune égalité pixel à pixel avec les modèles de
la série n’est déclarée.

## Contraintes communes

Personnages entiers, silhouettes lisibles et marges transparentes. Fond réellement
transparent, sans damier peint, quadrillage, légende, socle ou décor entraîné avec
le personnage. Préserver les corps noirs des variantes Shadow. Conserver une
matière partiellement transparente pour Bubble, avec des yeux lisibles. Réparer
les détails observés sans inventer une origine canonique aux variantes d’archive.

## Cinq planches

| Planche | Personnages | Consignes spécifiques |
| --- | --- | --- |
| `cainos-costumes-uniforms-0.6.0.png` | Maid Jax, Work Gangle, Spudsy Ragatha | Jax : cœur violet, coiffe et tablier blancs, bas blancs, chaussures à nœuds noirs. Gangle : chemise gris bleu claire, cravate pâle, badge, sourire denté et étoile jaune, bras de rubans. Ragatha : visière, uniforme et tablier gris foncé, badge clair, cheveux de laine rouges et œil en bouton bleu. |
| `cainos-costumes-gangle-0.6.0.png` | Comedy, Tragedy, Anime Gangle | Extrémités en rubans rouges, sans mains humaines blanches. Masque triste intact et larmes turquoise, sans débris attachés. Anime : yeux noirs, uniforme marin bleu/blanc et nœud rouge, sac sombre ; retirer fleur, pétales et étoiles dorées des yeux. |
| `cainos-costumes-shadow-0.6.0.png` | Pomni, Jax, Ragatha, Kinger, Gangle, Zooble, Caine | Reprendre les sept silhouettes sombres du projet sur alpha réel, garder leur masse noire, séparer les voisins et supprimer le fond quadrillé. Statut canonique inchangé. |
| `cainos-costumes-horror-0.6.0.png` | Void Pomni, Spiral Pomni, Skull Pomni, Hunter Jax | Reprendre les quatre apparences du projet entières, enlever les rectangles sombres et lignes de fond, isoler les silhouettes voisines. Statut canonique inchangé. |
| `cainos-costumes-creatures-0.6.0.png` | Gloink Queen Scale, Rhino Gangle, Inert Bubble | Reine entière, séparée des petits Gloinks ; rhinocéros sans pierres ni herbe attachées ; Bubble avec centre translucide et yeux sombres, sans ombre externe. Aucune taille canonique déduite du nom « True Scale ». |

## Contrôle et provenance

Les six comparaisons de détails utilisent des photos de produits de la boutique
officielle GLITCH, consultées avant la génération. Le manifeste
[de revue des costumes](combat-costume-review-0.6.0.json) conserve leurs URL,
empreintes, périmètres et limites. Ces images de référence ne sont pas intégrées
au pack du jeu.

Les vingt extractions ont ensuite été mesurées dans le renderer livré, affichées
dans la garde-robe et essayées en entraînement avec une attaque réelle au clavier.
La [planche de contrôle](images/costumes-0.6.0.png) montre les portraits extraits ;
son fond de comparaison ne fait pas partie des sprites. Les tests vérifient les
marges, l’intégrité des corps noirs, l’isolation de la reine et l’alpha partiel de
Bubble. Ils ne valident pas les proportions canoniques ni une animation de combat
dessinée spécialement.

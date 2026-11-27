# Kaufmo × Gameoverse — trois familles de bases statiques

Cette tranche ajoute **six dessins PNG natifs** : une garde complète et un
portrait de sélection séparé pour chacun des trois styles. Elle suit la phase
de bases statiques. Les gardes sont réutilisées par le moteur pour les états
qui n’ont pas de dessin propre ; aucun cycle d’animation n’est ajouté.

| Style | Conception | Identité conservée |
| --- | --- | --- |
| Hommage · Kit | Tunique jaune à bande crème, manches anthracite et grandes manchettes à anneau corail et étoile magenta | Visage, chapeau, collerette, trois boutons rouges, mains et chaussures de Kaufmo ; aucune anatomie féline empruntée |
| Résident · Archiviste des mondes | Manteau cobalt et jaune, gilet crème, étui à cartouches et carte roulée | Anatomie normale, marqueurs du visage et trois boutons rouges |
| Fusion · Clown de cristal | Corps réellement facetté, quartz blanc, saphir, rubis et or ; mains, jambes et pieds transformés | Ovale de la tête, yeux et triangles noirs, sourire rouge, cône et trois nodules rouges |

## Références et portée

L’identité normale de Kaufmo s’appuie sur le
[Kaufmo Plush officiel](https://glitchproductions.store/products/kaufmo-plush)
et sur la garde Encore existante pour la continuité du jeu. Les formes et
couleurs de Kit et du monde viennent de la
[page officielle Gameoverse](https://www.glitchprod.com/gameoverse).
Les deux images de cette page sont archivées avec leurs URL et leurs empreintes
dans [references/sources.json](references/sources.json). Elles ont été inspectées
avant la génération.

Ces trois designs sont des créations originales pour Encore. L’hommage emprunte
les codes vestimentaires visibles de Kit ; le métier d’archiviste et le corps
cristallin sont des propositions originales cohérentes avec la direction de
cette collection. Aucun de ces costumes n’est présenté comme une apparition
officielle, et cette revue n’affirme pas une reproduction canonique à 1:1.

## Fichiers natifs et correction

Les PNG ont été créés par l’outil intégré de génération d’images, avec un
personnage par image et un fond transparent. Les fichiers livrés sont des copies
identiques aux octets natifs : aucun recadrage, recoloriage, redimensionnement ou
nettoyage des pixels n’a été effectué.

Les **sept appels** ont produit six fichiers retenus et un candidat écarté. Le
premier portrait Résident avait quatre boutons rouges. Une édition ciblée par
l’outil d’images a rétabli les trois boutons attendus ; le candidat initial et
le prompt de correction restent conservés dans ce dossier. Le portrait final
contient quelques pixels natifs d’alpha 1 au bord inférieur, sous le seuil de
cadrage de 12 utilisé par le rendu ; ils ne sont pas effacés après génération.

Le [manifeste](manifest.json) réunit les SHA-256, dimensions, bornes alpha,
comptages de transparence, prompts, fichiers natifs et traits revus.
[audit-assets.py](audit-assets.py) reproduit ces mesures sans retoucher les images.

## Intégration et vérification

`combat/base-sprite-completion-20261127-gameoverse.mjs` fournit les trois
définitions et leurs revues de fichiers natifs. La disponibilité dans le menu
reste soumise aux deux chemins publiés dans le manifeste hors-ligne et à une
revue valide, comme les autres bases statiques.

[review-canvas.mjs](review-canvas.mjs) examine chaque famille séparément dans le
renderer de production. Les preuves produites dans `canvas/` couvrent les deux
orientations, le chemin et le SHA de chaque dessin, l’échelle uniforme, l’ancre
au sol et la garde statique réutilisée. Il s’agit d’une revue Canvas native,
distincte de la campagne navigateur et de la revue artistique des références.

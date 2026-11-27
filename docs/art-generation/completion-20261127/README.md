# Complément de production statique — 27 novembre 2026

Ce dossier rassemble le lot local de **63 PNG distincts** préparé après le
commit `cc972c8412bddb5278ef7c609dd82897325a2922` : **54 dessins de personnages**
dans **27 familles** et **neuf peintures de décors**. Les six manifestes de
production et les fichiers courants ont été rapprochés par SHA-256, taille,
dimensions et mode d'image. Le résultat détaillé se trouve dans
l'[inventaire contrôlé](asset-inventory.json).

Les fichiers représentent **74 746 603 octets**. Chaque portrait et chaque
garde possède son propre PNG et sa propre empreinte. Les 54 images de
personnages ont une transparence utilisable ; les neuf décors sont opaques.
Ce contrôle technique ne remplace pas la comparaison des dessins aux
références ni leur inspection à l'échelle de jeu.

## Contenu du lot

| Famille de production | Apparences | PNG | Dossier et provenance |
| --- | ---: | ---: | --- |
| Kaufmo × Sunset Paradise, The Gaslight District, Knights of Guinevere | 9 | 18 | [Dossier](kaufmo/README.md) · [Manifeste](kaufmo/manifest.json) |
| Kaufmo × Gameoverse | 3 | 6 | [Dossier](gameoverse/README.md) · [Manifeste](gameoverse/manifest.json) |
| Kaufmo × Ultra Jump Mania | 3 | 6 | [Dossier](ultrajumpmania/README.md) · [Manifeste](ultrajumpmania/manifest.json) |
| Kaufmo × Lackadaisy et SMG4 | 6 | 12 | [Manifeste](kaufmo-lackadaisy-smg4/manifest.json) |
| Max × Murder Drones et Meta Runner | 6 | 12 | [Dossier](max/README.md) · [Manifeste](max/manifest.json) |
| Chapiteau, canyon, manoir, cellier, vide, lac, nid Gloink, terrains extérieurs et couloir des chambres | — | 9 | [Dossier](stages/README.md) · [Manifeste](stages/manifest.json) |
| **Total** | **27** | **63** | [Inventaire vérifié](asset-inventory.json) |

Les costumes crossover sont des **créations originales Encore** : hommage
vestimentaire, résident et fusion. Les références officielles définissent les
identités et les codes visuels utilisés ; elles ne prouvent aucune apparition
officielle du personnage dans les univers croisés.

Chaque famille de personnage fournit un portrait et une garde statique. Les
états sans dessin dédié doivent réutiliser cette même garde intacte. Ce lot
n'ajoute ni poses d'action ni cycles d'animation. Les peintures de décors sont
des scènes complètes : elles ne sont pas comptées comme trois plans de
parallaxe indépendants. Leur cadrage de combat et les continuités cachées
restent des adaptations du jeu.

## Sélection et contrôles exécutés

La [passe de sélection](selection/README.md) ajoute une annulation indépendante
par côté, des badges pour les choix en miroir, des annonces accessibles et une
protection contre les réponses tardives de chargement des portraits. Les
animations d'entrée ou de sortie propres aux personnages restent à produire.

Le recontrôle après intégration a exécuté **29 tests Node**, tous réussis, dans les
quatre suites suivantes : bases statiques, récupération des décors, composition
des décors et présentation de sélection. Le
[journal complet](qa/current-targeted-node.log) conserve le résultat courant.
La [preuve de reprise](verification-current.json) distingue le constat initial
des corrections vérifiées : **573 costumes, 465 crossovers, 89 familles statiques
exposées et 6 281 images**. Deux définitions du focus suivant restent inactives.
Les empreintes des sources sont identiques avant et après les tests. Le
[contrôle de conservation](qa/catalog-preservation.json) vérifie les 546 costumes
historiques et les octets des 6 218 images antérieures. Il explicite les six
champs documentaires corrigés sur chacun des deux alias Evil Pomni ; leurs
anciens dessins et tous les autres champs restent conservés.

La tentative navigateur locale antérieure de la sélection a été interrompue
par un arrêt du processus Chromium. La
[preuve de sélection](selection/verification.json) conserve son périmètre
partiel ; aucun succès navigateur complet de ce nouveau lot n'en est déduit.
Le [résultat CI historique](qa/baseline-ci.json) concerne exclusivement le
commit publié `cc972c8` et ne valide pas ces 63 nouveaux fichiers.

## État de livraison

La présence, l'intégrité et l'exposition des 63 PNG ont été vérifiées. Le
classeur a été synchronisé au jalon de 573 costumes et 6 281 images : ses
14 feuilles et 42 formules sont conservées, 96 713 cellules historiques sont
comparées et 19 vues finales sont inspectées. Les 91 nouvelles lignes de
Production et les six nouvelles lignes de QA sont décrites dans la
[preuve du classeur](../../combat-completion-workbook-verification.json).
Les rendus dans le jeu, les deux builds et la publication doivent encore être
reliés à leurs preuves propres. Les
[travaux ouverts](remaining-work.md) distinguent ces étapes des choix futurs de
contenu. Aucun certificat global de fidélité canonique 1:1 n'est revendiqué.

Les 16 PNG du [lot publié précédent](../recovery-20261127/README.md) et les
63 PNG de ce dossier couvrent le périmètre de 79 images précédemment signalées
comme introuvables par des générations nouvelles et tracées. Les anciens
octets indisponibles ne sont pas présentés comme récupérés.

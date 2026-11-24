# Projectiles — génération et revue du 24 novembre 2026

Les quinze PNG de ce dossier de livraison ont été régénérés après le remplacement de l’environnement de travail. Les anciens fichiers et les anciennes captures ne servent pas de preuve pour ces nouvelles images.

## Fichiers natifs

Les images livrées sont les sorties PNG natives du générateur, copiées octet pour octet dans `assets/encore/projectiles`. Elles n’ont subi ni recadrage, ni effacement de fond, ni conversion. Les dimensions, les bornes alpha au seuil 12, les empreintes SHA-256 et les identifiants Git calculés sur les octets livrés figurent dans [generation-records.json](generation-records.json).

Les quinze fichiers possèdent un canal alpha avec des pixels entièrement transparents. Le centre de la bulle est entièrement transparent. La première version du module comportait un visage ; une correction ciblée a produit l’accessoire géométrique livré. Le prompt initial et le prompt de correction sont conservés séparément.

| Motif | Dimensions natives | Octets |
| --- | ---: | ---: |
| corruption | 1774 × 887 | 628053 |
| key | 1774 × 887 | 664395 |
| juggle | 1312 × 1199 | 936859 |
| button | 1312 × 1199 | 1132725 |
| comedy-mask | 1312 × 1199 | 806419 |
| module | 1536 × 1024 | 1196827 |
| pellet | 1774 × 887 | 724802 |
| confetti | 1774 × 887 | 768164 |
| bubble | 1262 × 1246 | 281076 |
| candy | 1774 × 887 | 944913 |
| sugar | 1774 × 887 | 644393 |
| gloink | 1536 × 1024 | 1092596 |
| fudge | 1536 × 1024 | 1182029 |
| spectral-shot | 1774 × 887 | 888358 |
| trick-box | 1774 × 887 | 956600 |

Total : **12 848 209 octets**.

## Raccordement au jeu

`combat/projectile-art.mjs` associe les techniques existantes à quinze motifs documentés. Plusieurs personnages partagent un accessoire lorsque leur kit et le nom du coup le justifient. L’association s’appuie sur le nom d’origine de la technique : un projectile réfléchi conserve son dessin même si son propriétaire change. Les nouvelles abstractions utilisent le motif de corruption.

Ces accessoires sont des adaptations originales pour le jeu de fan. Leur présence et leur correspondance avec un kit ne constituent pas une preuve de fidélité canonique 1:1.

Le chargement de présentation reste borné : deux décodages simultanés, huit textures mises en cache, un côté maximal de 128 pixels pour la texture décodée et un délai de décodage limité. Si une image est absente ou indisponible, le motif Canvas reste visible. Les règles de simulation, les vitesses, les dégâts et les réflexions ne sont pas modifiés par ces illustrations.

## Vérifications exécutées

Les quatre suites ciblées `combat-projectile-art`, `combat-render`, `combat-render-poses` et `combat-render-sequences` ont passé **60 contrôles** après restauration du code et calibration ciblée de la taille des nouvelles abstractions.

La [revue Canvas des projectiles](../canvas/projectiles/projectile-canvas-review.json) utilise le moteur et le renderer de production sous Node/Skia. Elle vérifie quinze fichiers, trente tirs simulés, vingt-huit réflexions réelles et cinquante-huit dessins natifs à taille de jeu, dans les deux sens. La boîte piégée possède une mèche dans les règles existantes et ne se réfléchit pas. La [planche de rendu](../canvas/projectiles/projectiles-native-and-reflected.png) montre également les accessoires agrandis trois fois.

Les captures aquatiques contrôlent le départ de tir devant la tête dans les deux sens, avec hauteur visuelle de 200 pixels, ancre horizontale de 0,78 et corps de collision de 195 × 200 pixels. Les tentacules arrière restent décoratives hors de ce corps. Le tir spécial conserve le dessin de stance selon la sélection d’illustrations de production ; les dessins `attack` et `heavy` sont réservés aux frappes normales correspondantes.

Chaque rapport de rendu est horodaté et porte les empreintes des sources qu’il a exécutées. Ces contrôles natifs ne remplacent pas un parcours navigateur, un essai tactile ou une comparaison image par image avec des références officielles.

## Traçabilité

- [Prompts initiaux](generation-inputs.json)
- [Correction ciblée](generation-corrections.json)
- [Reçus des fichiers natifs](generation-records.json)
- [Blobs GitHub vérifiés](github-blobs.json)

Les quinze SHA Git renvoyés par le dépôt distant ont été comparés aux SHA calculés sur les fichiers livrés. Aucun arbre ou référence Git n’a été modifié par cette opération de sauvegarde des blobs.



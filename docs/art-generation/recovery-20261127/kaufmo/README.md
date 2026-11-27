# Kaufmo — continuation des bases natives du 27 novembre 2026

Cette livraison ajoute **six apparences originales pour Encore**, soit **douze PNG finaux** : une sélection cadrée à la taille et une garde de plein pied par apparence. Les fichiers proviennent de générations natives séparées avec `image_gen.imagegen`. Chaque image contient un seul personnage. Les six familles appartiennent à Kaufmo dans sa forme de clown, distincte du combattant Kaufmo abstrait.

| Univers | Famille | Construction visuelle |
| --- | --- | --- |
| Murder Drones | Hommage · Uzi | Hoodie noir et violet, motif inspiré de la tenue officielle Uzi, anatomie de Kaufmo conservée. |
| Murder Drones | Résident · Technicien des abris | Veste isolante ocre, panneaux bleus, éléments de sécurité, sacoche et câble fixés à la ceinture. |
| Murder Drones | Fusion · Drone de parade | Corps entièrement mécanique, coque jaune, membres métalliques, visière noire et yeux violets. |
| Meta Runner | Hommage · Tari | Hoodie cyan, capuche et bordure blanches, zigzags bleu marine, panneaux blancs et fermeture blanche d’après le vêtement officiel. |
| Meta Runner | Résident · Technicien des replays | Gilet technique bleu marine et cyan ; un avant-bras cybernétique blanc/cyan et une main en gant ordinaire. |
| Meta Runner | Fusion · Avatar de synchronisation | Avatar numérique entièrement géométrique, torse bleu, membres blancs, circuits cyan et tête blanche facettée. |

Les fichiers runtime se trouvent dans `assets/encore/crossovers/{murderdrones,metarunner}/kaufmo/{hommage,resident,fusion}/{selection,stance}.png`. Le module `combat/base-sprite-continuation-20261127.mjs` exporte leurs définitions et revues ; le raccordement au catalogue et au hors-ligne est assuré par l’intégration principale.

## Fidélité et statut des créations

Les repères d’identité conservés sont le visage blanc ovale, les yeux noirs allongés et leurs triangles, le sourire rouge, le cône jaune à bord bleu et pompon rouge, ainsi que la collerette bleue. La garde de Kaufmo déjà publiée dans Encore fixe le traitement 2D, le sourire denté, les proportions, le sens de la pose et les contours. Le produit officiel Kaufmo Plush sert de contrôle des signes distinctifs. Les deux fusions transposent ces repères dans leur nouveau matériau ; la fusion Murder Drones emploie une visière de drone, celle de Meta Runner conserve un visage clair géométrique.

Les vêtements d’hommage utilisent des références officielles. Les résidents et fusions sont des créations de crossover pour le fan-game : leur contexte est celui d’avatars ou de simulations. Ils ne déclarent ni apparition canonique de Kaufmo dans ces séries, ni nouvel événement dans leurs histoires. `canonicalCostumeClaim` et `canonicalOneToOneCertified` restent donc à `false`. L’objectif de fidélité porte sur les références identifiables et la cohérence visuelle des deux images de chaque famille.

### Références inspectées

Les cinq fichiers du dossier `references/` sont des copies inchangées de fichiers présents au commit `6e44ab75b9c82b4d6fe62a0051287275abc97753`. Le manifeste donne leurs chemins d’origine et SHA-256.

- [Kaufmo Plush officiel](https://glitchproductions.store/products/kaufmo-plush) : identité du clown, sous `kaufmo-plush-1.png`.
- `game-kaufmo-stance.png` : dessin Encore existant, utilisé pour la continuité artistique ; cette image est une création du fan-game.
- [Uzi V2 Animatez officiel](https://glitchproductions.store/products/uzi-v2-animatez) : vêtement de référence, sous `official-uzi-front.png`. La [page officielle Murder Drones](https://www.glitchprod.com/murder-drones) documente l’univers.
- [Hoodie Tari officiel](https://glitchproductions.store/cdn/shop/files/Tari-Hoodie-Default.png?v=1701236208&width=1600) : couleurs et construction, sous `tari-hoodie-official.png`.
- [Image promotionnelle Meta Runner archivée](https://static.wixstatic.com/media/84ed6a_98410c9a4f234883a5602147648a42b4~mv2.png) : langage des prothèses et avatars, sous `metarunner-official-still-01.png`. La [page officielle Meta Runner](https://www.glitchprod.com/meta-runner) situe les améliorations cybernétiques et le jeu compétitif.

## Production et contrôle

Les gardes ont été générées à partir du dessin Encore et des références officielles ; chaque portrait a ensuite été généré séparément à partir de sa garde approuvée. Les prompts complets sont conservés dans ce dossier. Une première version du portrait Murder Drones résident est conservée dans `candidates/` comme essai remplacé ; elle n’est pas chargée par le jeu.

Les **douze PNG finaux occupent 11 753 462 octets**. Leur résolution native exacte, leur mode RGBA, leur SHA-256, leur taille et leurs bornes alpha figurent dans `manifest.json`. Tous comportent une vraie transparence alpha. Les bornes des pixels d’alpha supérieur à 12 restent à l’intérieur de l’image. Les portraits gardent le chapeau et les mains en entier ; leur cadrage à la taille est intentionnel. Les gardes montrent le personnage entier, orienté vers la droite.

Chaque sortie finale a été copiée sans modification des pixels ni réencodage. Le contrôle avec Pillow ne lit que les métadonnées et le canal alpha. Le script `build-manifest.py` reproduit les mesures, le manifeste et les déclarations JavaScript ; il ne modifie aucune image. Le contrôle visuel des fichiers a vérifié les signes d’identité, le nombre de personnages, la lisibilité, le cadrage, la transparence et la correspondance des vêtements et des prothèses entre sélection et garde. La revue dans le moteur appartient à l’intégration principale et à ses captures.

Ces bases sont statiques : un portrait et une garde par famille. La garde sert de repli pour les états de combat qui n’ont pas de dessin dédié. Le lot n’ajoute aucune pose d’action ni animation.

La [revue Canvas ciblée](canvas/README.md) a ensuite vérifié les six familles sur la version hors-ligne `0.7.0-b6d11b136010` : 120 contrôles état/direction, 360 rendus d’état, six portraits et six bilans réussis. Sa [planche d’ensemble](canvas/kaufmo-bases-overview.jpg) a été inspectée visuellement. Le script `review-canvas.mjs` reproduit ce lot avec un processus distinct par famille, en séquence, et assemble uniquement les JPEG des workers.

## Rapport avec la reprise des fichiers antérieurs

Les douze images sont de **nouvelles générations du 27 novembre**, documentées comme telles. Le compteur `previousUnpublishedImagesRecovered` vaut `0` : ces fichiers ne sont pas présentés comme la récupération des anciennes générations annoncées mais absentes de la branche. Les six familles et leurs douze fichiers finaux sont comptés séparément des références et des essais conservés dans la documentation.

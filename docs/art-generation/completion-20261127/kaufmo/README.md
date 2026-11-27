# Kaufmo — trois collections supplémentaires

Cette tranche produit **18 PNG natifs**, soit neuf familles composées chacune
d’un portrait de sélection et d’une garde complète distincts. Les sources
antérieures non retrouvées ne sont pas comptées comme récupérées.

| Collection | Hommage vestimentaire | Résident original | Fusion corporelle originale |
| --- | --- | --- | --- |
| Sunset Paradise | Meggy | Bonimenteur du port | Clown du récif |
| The Gaslight District | Melancholy Hill | Afficheur des quais | Pantin des brumes |
| Knights of Guinevere | Guinevere | Réparateur du parc | Automate de parade |

Le [manifeste](manifest.json) fournit les chemins, tailles, dimensions, empreintes
SHA-256, bornes alpha et descriptions des dix-huit fichiers effectivement
présents. Les fichiers de runtime sont les octets natifs d’Imagegen, sans
redimensionnement, détourage Python ou réencodage. La mesure est reproductible
avec [build-manifest.py](build-manifest.py).

## Identité et références

La référence de visage est le produit officiel
[Kaufmo Plush](https://glitchproductions.store/products/kaufmo-plush).
La garde Encore publiée établit la direction vers la droite, la silhouette et
le rendu 2D déjà employés par le jeu. Chaque nouvelle garde conserve le visage
ovale blanc, les yeux noirs, les triangles, le sourire rouge et les motifs du
chapeau et de la collerette. La pose ne représente pas une animation canonique.

Les images officielles Meggy, Mel et Guinevere servent aux codes vestimentaires,
aux matériaux et aux couleurs. Leurs URLs exactes sont conservées dans
[references/sources.json](references/sources.json) ; les pages officielles sont
[Sunset Paradise](https://www.glitchprod.com/sunset-paradise),
[The Gaslight District](https://www.glitchprod.com/gaslight-district) et
[Knights of Guinevere](https://www.glitchprod.com/knights-of-guinevere).
Le résident de chaque univers et les trois corps fusionnés sont des créations
originales d’Encore. Les sources ne prouvent pas une apparition officielle de
Kaufmo dans ces séries.

Les prompts réellement envoyés sont consignés par collection :
[Sunset Paradise](sunset-prompts.json),
[Gaslight District](gaslight-prompts.json) et
[Knights of Guinevere](knights-prompts.json).
Les portraits ont été générés individuellement à partir de leur garde pour
préserver leur costume propre. Chaque image contient un seul personnage.

## Revue native

La [planche de contrôle alpha](native-overview.jpg) montre les neuf paires sur
un fond opaque uniforme. Elle est une dérivée de contrôle ; les PNG du jeu
restent inchangés. Les dix-huit silhouettes ont été inspectées ainsi que les
portraits individuels : chapeau complet, deux mains présentes, garde entière,
pieds visibles, identité et costume cohérents à l’intérieur de chaque paire.

Le premier portrait du résident Gaslight avait quatre boutons au lieu des
trois attendus. Une correction native Imagegen a restauré les trois boutons.
L’ancien candidat est conservé pour la provenance et n’est pas enregistré
dans le catalogue du jeu.

Un aperçu brut de la fusion Guinevere affichait les couleurs RGB conservées
sous les pixels transparents. Une édition native de transparence a été
effectuée, puis la composition avec le canal alpha a confirmé une silhouette
propre. Les pixels RGB sous alpha zéro ne constituent pas un fond visible dans
le renderer. Les pixels proches du bord conservent l’anticrénelage natif.

## Intégration et périmètre

Le module [base-sprite-completion-20261127-kaufmo.mjs](../../../../combat/base-sprite-completion-20261127-kaufmo.mjs)
déclare les neuf familles et leurs revues. L’intégration au catalogue principal
et le manifeste hors ligne sont gérés avec la tranche globale de production.

La revue du Canvas de production est exécutée séparément après cette
intégration, par [review-canvas.mjs](review-canvas.mjs). Ses captures et résultats
se trouvent dans le dossier `canvas/` lorsqu’ils ont effectivement été produits.
Une revue native de fichiers ne constitue pas, à elle seule, une validation
navigateur ou une certification canonique 1:1.

La phase reste celle des bases statiques : aucun cycle d’animation, dessin
d’action, changement de technique ou nouvelle règle de simulation n’est ajouté.

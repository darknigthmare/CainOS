# Raccord des bases statiques

## Périmètre

La passe ajoute des **bases**, avec deux fichiers par famille : `selection.png`
et `stance.png`. Elle ne produit ni neuf poses d’action ni animation. Les
18 nouvelles interprétations crossover de Ribbit sont des créations originales
pour Encore. Les six autres familles reprennent des apparences commerciales
référencées, dans les limites des compositions visibles.

L’inventaire avant modification est conservé dans `base-inventory.json`.
Les 64 combattants et les 484 costumes publiés avaient déjà un portrait et une
garde. Les 68 archives non jouables avaient toutes un ou plusieurs portraits,
mais aucune garde dédiée : 32 personnages distincts, 12 autres personnes,
9 accessoires, 8 projections, 4 arts non attribués et 3 effets. Ces entrées ne
deviennent pas des combattants par ajout d’une illustration.

## Catalogue et publication

`combat/base-sprite-content.mjs` distingue les définitions prévues des familles
publiables. Chaque nouvelle famille déclare :

- `baseOnly: true` et `presentation: 'static'` ;
- `authoredSlots: ['selection', 'stance']` ;
- son propriétaire, son répertoire propre, sa provenance et ses limites ;
- une revue des deux fichiers natifs avec leurs deux SHA-256.

Une définition est exposée au vestiaire uniquement lorsque sa revue porte le
statut `verified-base-files`, contient les deux empreintes et que les deux chemins
figurent dans le manifeste hors ligne. La présence d’un répertoire ou d’une image
isolée ne suffit pas. Les références restent qualifiées séparément d’une
certification de fidélité canonique.

`BASE_SPRITE_COSTUMES` est ajouté après l’intégralité des 484 fiches précédentes.
Les 64 combattants, leurs techniques, statistiques et corps de collision ne
changent pas. Les listes historiques de 45 ajouts Circus, de 9 crossovers PNJ
complets et de 52 variantes d’archive conservent leurs enregistrements. Les
nouveaux crossovers participent aux filtres de série et de style sans inventer
d’autres tenues pour les autres propriétaires.

`integration-baseline.json` a été capturé avant l’édition. Le test de conservation
compare les identifiants, l’ordre et les empreintes de toutes les fiches du
préfixe, ainsi que celles des 64 combattants.

## Rendu volontairement statique

Le dossier propre à chaque famille utilise le chargeur d’illustrations existant.
Le champ `sprite.baseOnly` interdit la recherche et le préchargement de dessins
d’action, même si un fichier accidentellement nommé `attack.png` existe.

Dans l’arène, la même garde est utilisée pour l’entrée, la marche, le saut,
l’accroupissement, les coups, l’impact, la victoire et la défaite. Elle conserve
la même échelle uniforme et la même ancre. Le rendu statique n’ajoute ni
respiration, ni inclinaison, ni découpe de membres, ni réduction de hauteur liée
à une pose non dessinée. Les positions et le retournement continuent de suivre
l’acteur ; les effets, indices de garde basse et règles du combat restent actifs.

Un chargement indisponible conserve le repli explicite de dessin indisponible.
Il ne peut révéler une ancienne tenue ni l’atlas de la forme normale. Le portrait
provient du `selection.png` propre à la famille. Les deux fichiers de base sont
distincts ; aucun PNG n’est dupliqué sous des noms d’actions.

Les limites de largeur proposées pour les quatre compositions officielles sont
240 px pour Zooble contorsionniste, 240 px pour le chariot d’Abel, 180 px pour
Jax Café et 220 px pour Caine Café. Ce sont des limites de présentation à examiner
dans la revue native, pas des mesures canoniques. Le miroir vers la gauche des
compositions frontales ou trois-quarts reste une convention du jeu ; il ne
constitue pas une nouvelle vue officielle.

## Contrôles ciblés

`tests/combat-base-sprites.test.mjs` couvre le verrou de publication, la
conservation du catalogue, les fichiers et empreintes, le bon propriétaire,
les aller-retour de profils/programmes/replays, les chargements refusés et le
rendu de la garde dans tous les états et les dix techniques, sur les deux côtés.
Les fixtures de chargeur testent aussi une direction native à gauche.

Les suites crossover conservent toutes les exigences de leurs anciennes familles
complètes. Seules les familles explicitement `baseOnly` attendent deux textures.
La suite navigateur garde ses contrôles des états et directions, en vérifiant
que ces états partagent bien la garde. Cette adaptation de code n’est pas une
exécution de Chromium.

`scripts/render-combat-base-sprite-review.mjs` est le relecteur natif de cette
passe. Il exige des familles vérifiées et publiées, contrôle les chemins
effectivement dessinés, les deux directions et les ancres, puis compare la
matrice de la garde dans dix états aux temps 0 et 600 et avec mouvements réduits.
Il écrit les planches et le rapport sous `canvas/`. Les états réutilisés ne sont
jamais comptés comme des dessins supplémentaires. Le résultat final de cette
exécution est conservé dans `canvas/base-canvas-review.json` : **24 familles,
48 dessins de base, 480 contrôles état/direction et 1 440 appels réels au
renderer**, avec 24 portraits vérifiés. Les 13 tests ciblés des suites bases,
crossovers et ordre des costumes passent également, sans test ignoré.

La collecte finale exécute une seule famille par processus Node, dans un ordre
strictement séquentiel, et libère ce processus avant la famille suivante. Son
pic mesuré est de 138 723 328 octets de mémoire résidente par processus enfant.
Le premier essai, interrompu avec le code 137 pendant une pression mémoire
globale, reste documenté dans `canvas-attempt-1.json` et ne vaut pas une réussite
de la campagne. La collecte finale a terminé avec le code 0 et son rapport
porte `summary.pass: true`.

La campagne globale conduite séparément après cette collecte passe 467 tests
sur 467, sans échec ni test ignoré. La preuve native ne vaut pas une exécution
de Chromium. Les revues visuelles des planches sont consignées séparément des
contrôles numériques ; aucune certification canonique 1:1 n'en est déduite.

Les 24 planches de famille ont ensuite été ouvertes et relues individuellement :
18 crossovers par leur auteur, quatre compositions officielles par leur auteur,
et Ribbit-Suit Jax ainsi que Cocktail Zooble par le relecteur runtime. Chaque
planche montre le portrait et les deux sens de la garde, soit 72 vues. L'agrégat
`canvas/visual-review.json` lie leurs trois comptes rendus et vérifie les
empreintes exactes des planches acceptées. Les cadrages intentionnels de portraits,
dont les trois bustes Ultra Jump Mania, restent explicitement signalés.

Le relecteur général `render-combat-character-review.mjs` traite également les
familles statiques en distinguant leurs réemplois de garde des dessins d’action.
Les anciennes preuves de la passe abstractions restent inchangées.

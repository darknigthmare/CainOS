# Personnages et variantes — complément du 19 novembre 2026

Cette passe complète les dessins individuels attendus par le catalogue actuel
d’**Encore** : 54 combattants, 51 variantes d’archive et 74 fiches sans kit de
combat. Elle réunit le roster étendu et le travail GLITCH dans la PR #7, en
conservant les identifiants, la simulation 0.5, les profils et les replays.

**Couverture statique complète du catalogue courant : 1 234 fichiers présents,
aucun emplacement manquant.** L’inventaire et le rendu de production ont été
exécutés après le gel des images. Les parcours navigateur de cette révision
restent non exécutés dans cette session.

## Couverture des dessins

| Usage | Apparences ou sujets | Dessins par apparence | Fichiers présents |
| --- | ---: | ---: | ---: |
| Actions des combattants | 54 | 9 | 486 |
| Actions des variantes d’archive | 51 | 9 | 459 |
| Gardes en corps entier | 105 | 1 | 105 |
| Portraits individuels de galerie | 184 | 1 | 184 |
| **Total du catalogue de personnages** | | | **1 234** |

Par rapport à la tête de PR `b64dc7ad33a7ec85f2bb69d906921403ad4cf09d`, cette
passe ajoute **586 chemins d’images de personnages** : 427 actions, 119 portraits
et 40 gardes. Les nouvelles actions comprennent 360 poses de PNJ, 51 coups
lourds de variantes et 16 actions manquantes des personnages d’origine.

Les neuf actions sont l’entrée, l’attaque, le coup lourd, l’impact reçu, la
marche, le saut, la position accroupie, la victoire et la défaite. Une action
correspond ici à **un dessin statique distinct**, utilisé par la présentation du
jeu. Ce nombre ne mesure pas des cycles d’animation image par image.

Les 179 fiches d’archive ne représentent pas 179 personnes canoniques uniques :
le catalogue contient aussi des formes, accessoires, effets et identifiants
historiques. Trois fiches de groupe affichent plusieurs images individuelles :
Best Children A/B, trois âmes de Mildenhall et trois silhouettes rieuses. Cela
porte la galerie à 184 sujets sans modifier le nombre de fiches. Le combat des
âmes de Mildenhall utilise le fantôme turquoise A ; les deux autres restent
des portraits de galerie.

Les 378 costumes crossover des quatorze combattants d’origine conservent leur
propre série de dix dessins. Ils sont hors de ce total de 1 234. Les costumes
crossover des quarante PNJ promus restent à produire.

## Manques traités

### Actions des personnages d’origine

Seize actions manquantes ont été dessinées pour Pomni, Jax, Ragatha, Gangle,
Zooble, Kinger et Caine : impact reçu et marche pour chacun, plus l’attaque de
Ragatha et de Gangle. Les sources déjà présentes pour les autres actions restent
utilisées. Les 51 variantes d’archive reçoivent chacune leur propre coup lourd.

### Personnages secondaires, tertiaires et figurants du catalogue

Les quarante combattants issus des archives reçoivent chacun neuf actions,
soit 360 dessins :

| Ensemble | Personnages |
| --- | --- |
| Résidents et anciens résidents | Queenie, Kaufmo, Ribbit, Scratch, Wormo, Bizco, Rattie, Spike, Pink Furry Cyclops, Frowning Yellow Clown, The Oyster, Light Green Bulb Creature, Abel |
| Aventures et personnages associés | Max, Chad, Orbsman, Ming, Martha Mildenhall, Ghostly, Angel, Disappearing Guy, Committee Member, Shrimp NPC, Chinese Room NPC |
| Créatures et figurants | Blue AI, Cookie Butterfly, Gummy Elephant, Giant Centipede, Spudsy Customer, gardes cyan/bleu/violet, Gummy Worm, Barrel Monkey, Jeffery, Mildenhall Souls |
| Mannequins | Rouge, orange, jaune, magenta |

Ces poses sont des adaptations de combat conçues pour Encore à partir des
références visuelles du projet. Elles ne prouvent pas que ces personnages
effectuent ces actions dans la série. Les quarante kits restent des modèles de
gameplay adaptés à leur rôle ; cette passe d’illustration ne les transforme pas
en quarante ensembles de techniques canoniques.

### Identités et images de groupe

Abel reprend le mannequin orange à visage souriant de la référence retenue ;
l’ancien concept de garçon blond avec auréole a été écarté des vues actives.
Le libellé de Scratch indique le chien jaune. Les groupes sont séparés en
dessins individuels, avec des lettres neutres quand les références ne permettent
pas de donner un nom fiable à chaque silhouette. Les variantes et accessoires
restent liés à leurs identifiants existants.

Les reprises ciblées corrigent notamment les mains flottantes et la collerette
de Queenie, les chaussures ajoutées sous l’ourlet de Martha et les halos visibles
de certains premiers essais. Les nouvelles générations restent les PNG natifs du
générateur, copiés à l’identique : aucun découpage de planche, étirement ou
rééchantillonnage ne remplace un dessin individuel.

## Intégration dans le jeu

Le chargeur choisit une source effectivement publiée dans le manifeste : WebP
lorsqu’il existe, sinon PNG. Le rendu mesure la silhouette visible à partir de
l’alpha, applique une échelle uniforme et conserve l’ancrage au sol. Les images
larges ou basses ne sont donc pas étirées dans un rectangle arbitraire.

Les neuf actions sont préchargées et le coup lourd peut utiliser sa propre
illustration. Le repli vers l’attaque ordinaire reste disponible pour les
costumes crossover qui n’ont pas de fichier lourd dédié. Les caches de
sélection, de garde et d’action sont bornés séparément. Les fiches de groupe
affichent leurs images individuelles avec des légendes distinctes.

La réunion des branches conserve les anciens programmes sauvegardés à 14 ou
54 combattants, leur tirage, leurs résultats et la simulation du tournoi. Les
54 routes, 162 finales, 54 numéros d’amitié, 324 tableaux narratifs et 216 scènes
d’avant-combat restent disponibles. Les 54 scènes dédiées sont des arrangements
des décors partagés, pas 54 nouvelles peintures.

## Contrôles et preuves

Le [rapport de vérification](combat-character-verification-2026-11-19.json)
identifie les fichiers et leurs empreintes. Le [journal complet de QA](combat-character-qa-2026-11-19.log)
conserve la sortie effective de `npm run qa`. Les contrôles locaux portent sur
l’arbre de travail final avant publication, identifié par le manifeste et les
empreintes de sources ; le précédent commit Git n’est pas présenté comme le
commit contenant déjà ces modifications.

| Vérification | État de cette passe |
| --- | --- |
| Inventaire des 1 234 emplacements | 1 234 fichiers, 0 manque, 0 doublon d’empreinte |
| Sources réelles des 945 actions, deux orientations | 1 890 contrôles de rendu réussis ; source, orientation et échelle uniforme vérifiées |
| Décodage et rendu des 184 portraits | 184 rendus réussis, huit planches examinées |
| Gardes/sélections des 40 PNJ et scènes | 80 images décodées, 10 scènes à trois plans rendues ; les trois planches de synthèse ont été examinées |
| Tests Node, audits et deux distributions | 399 tests réussis, 0 échec, 0 ignoré ; CainOS et standalone construits |
| Parcours navigateur du contenu courant | Non exécutés dans cette session : lancement bloqué par la politique de l’environnement |
| Classeur | Export final et réimport documentés dans le [bilan de publication](COMBAT_WORKBOOK_PUBLICATION.md) |

L’[inventaire des fichiers](combat-character-art-inventory-2026-11-19.json)
contient les dimensions natives, l’alpha, les tailles et SHA-256. Il rapproche
517 fichiers de leur sortie native de génération par égalité d’empreinte ; les
autres conservent le statut d’images existantes ou récupérées du projet. Les
1 234 fichiers occupent 825 705 226 octets. Ce total est distinct du pack entier,
qui contient **5 331 illustrations / 2 538 831 567 octets**, avec
`OFFLINE_VERSION = 0.7.0-9d40b0881496` et `ART_VERSION = 0e03085d0a637d14`.

Un signalement alpha est conservé pour `scratch/intro.png` : quelques pixels au
seuil 12 touchent le haut du canevas. La silhouette au seuil 32 possède une
marge supérieure de 49 pixels. La composition sur fond gris ne montre ni halo,
ni fragment, ni membre coupé. Le PNG natif reste inchangé et cette décision est
enregistrée dans sa provenance et le rapport de vérification.

### Galerie de contrôle

- [Les 105 planches d’actions et les huit planches de portraits](images/character-completion-2026-11-19/README.md).
- [Rapport Canvas des actions et portraits](images/character-completion-2026-11-19/character-canvas-review.json).
- [Les 40 sélections](images/character-scenes-2026-11-19/expansion-selection-review.png), [les 40 gardes](images/character-scenes-2026-11-19/expansion-stance-review.png) et [les dix scènes](images/character-scenes-2026-11-19/expansion-scenes-review.jpg).
- [Rapport Canvas des PNJ et scènes](images/character-scenes-2026-11-19/canvas-review.json).

La revue Canvas utilise les modules de rendu de production avec Node et Skia.
Elle vérifie les sources, les orientations et l’échelle ; elle ne lance pas un
navigateur et ne vérifie ni DOM, ni entrées, ni audio, ni service worker. Les
suites navigateur ont été adaptées au roster de 54 combattants et aux 51
variantes : 21 configurations reposent sur 20 scripts dont la syntaxe passe.
Leur modification et cette vérification de syntaxe ne sont pas un résultat
d’exécution dans un navigateur.

Les succès Chromium antérieurs restent rattachés à leur commit. Ils ne sont
pas réattribués aux nouveaux dessins. La CI distante de la PR conserve son
propre état, associé au commit publié.

## Couverture de la série et limites restantes

L’[audit documentaire](combat-character-canon-research-2026-11-19.json) et sa
[table de correspondance](combat-character-canon-mapping-2026-11-19.json)
séparent les identités, les variantes, les accessoires et les alias. Ils
répertorient 62 entités de recherche, dont 61 liées à une fiche, et 168 candidats
de forme ou de tenue, dont 129 liés à des identifiants existants.

Les **39 candidats sans correspondance** sont des sujets à vérifier avec des
références visuelles. Ce ne sont pas 39 costumes manquants démontrés. L’absence
d’une correspondance de nom ne prouve pas l’absence d’une image ailleurs.
Les identités mentionnées uniquement dans un dialogue, les portraits de porte
sans corps documenté et les assemblages variables demandent une revue des
plans concernés. Les corps imaginés à partir d’un simple portrait restent
étiquetés comme extrapolations du projet. La table signale aussi 52 fiches
existantes non rapprochées de cet inventaire documentaire : ce dernier n’est
pas présenté comme une revue canonique exhaustive de chaque fiche.

Cette passe ne certifie donc ni une copie canonique 1:1 de toute la série, ni
des fichiers natifs 4K, ni une animation complète. Les dimensions exactes et
empreintes de chaque fichier figurent dans l’inventaire. Restent aussi ouverts
la revue officielle plan par plan, les cycles d’animation, les voix, le mixage
sur appareils, l’équilibrage des kits et les tests sur matériel physique.

Le [classeur de production](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) conserve les
notes et tâches antérieures et ajoute la couverture des dessins sans convertir
ces travaux ouverts en réussites.

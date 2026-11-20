# Encore — Café Ribbit, premiers crossovers PNJ et Barnoir

**20 novembre 2026 — suite de production.** Ce lot active quatre familles complètes d’apparences et une arène : **44 dessins de personnages + trois plans de décor = 47 PNG natifs**, pour **59 538 780 octets**. Le jeu compte maintenant **54 combattants, 540 techniques, 472 costumes sélectionnables et 24 arènes partagées**. Les 54 arrangements dédiés réutilisent ces décors ; ils ne sont pas comptés comme 54 arènes nouvelles.

[Galeries et preuves du lot](art-generation/next-wave-20261120/README.md) · [Classeur de production](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) · [Registre des travaux restants](art-generation/next-wave-20261120/remaining-work.md).

## Ce qui devient jouable

| Famille | Contenu livré | Direction |
| --- | --- | --- |
| **Ribbit — Café** | 11 PNG | Robe bleu nuit, tablier blanc, coiffe et revers festonnés, chaussures sombres à semelles rose foncé. |
| **Ribbit × Murder Drones — Hommage · Uzi Doorman** | 11 PNG | Grenouille biologique, bonnet noir à pompon, sweat sombre et bottes à accents violets. |
| **Ribbit × Murder Drones — Résident · Technicienne des conduites** | 11 PNG | Combinaison charbon et olive, genouillères, outils attachés, accents ambrés et pieds de grenouille. |
| **Ribbit × Murder Drones — Fusion · Automate amphibien** | 11 PNG | Corps mécanique vert et menthe, deux optiques noires à LED magenta, articulations sombres et extrémités à trois lobes. |
| **Barnoir — Le bar des néons** | 3 PNG | Fond, comptoir et piste, reflets de premier plan ; ambiance musicale originale et animation lumineuse modérée. |

Chaque apparence contient un portrait de sélection, une garde et neuf actions distinctes : introduction, attaque, coup lourd, impact, marche, saut, accroupissement, victoire et défaite. Chaque fichier contient un seul personnage entier sur fond transparent. Les poses sont statiques ; les mouvements intermédiaires du renderer ne les transforment pas en cycles dessinés image par image.

Les apparences de Ribbit conservent ses techniques, statistiques et règles de combat. Le vestiaire ajoute uniquement les trois crossovers PNJ réellement disponibles. Les 378 costumes crossover historiques conservent leurs fichiers et leurs règles de repli pour les coups lourds ; les trois nouveaux costumes ont chacun leurs onze PNG, dont leur propre coup lourd.

## Références et décisions artistiques

### Café Ribbit : une référence complète, distincte du Pendantz Maid

La [publication d’Animate Holdings](https://prtimes.jp/main/html/rd/p/000008857.000016756.html) et la [page de la collaboration Animate Café](https://www.animatecafe.jp/event/ac000791) présentent l’illustration officielle utilisée. L’affiche montre les deux jambes, les chaussettes et les chaussures. Les fichiers sources, leur qualification et leurs empreintes sont conservés dans le [dossier Café](art-generation/cast-next-wave-20261120/README.md).

Le plateau et le dessert de présentation sont exclus des poses de combat. Les proportions et les poses sont adaptées au jeu. Le dos non montré reste traité sobrement, sans prétendre établir une nouvelle vue canonique. Cette famille **ne complète pas Maid Ribbit** : les motifs et accessoires sont différents, et le bas du Pendantz Maid demeure masqué dans ses propres références.

### Trois crossovers originaux, avec un véritable nouveau corps pour la fusion

Le [Ribbit Pendantz officiel](https://glitchproductions.store/products/ribbit-pendantz-blindbox) fournit les repères d’identité ; les vues de la [figurine Uzi V2](https://glitchproductions.store/products/uzi-v2-animatez) documentent les vêtements de l’hommage. Les corps combinés, équipements, rôles et poses restent des créations originales pour Encore. La fusion redessine Ribbit en automate amphibien, avec plaques, pivots et optiques propres ; le style Résident garde un corps biologique dans une tenue de travail.

Une revue des mains a conduit à huit harmonisations Hommage et cinq harmonisations Résident/Fusion. Les corrections ont été régénérées nativement. Les essais rejetés et leurs reçus sont archivés ; les trois poses Hommage déjà conformes sont conservées. Les images actives n’ont pas subi de retouche de pixels locale.

**Le choix de trois doigts appartient à ces nouveaux designs.** La peluche Iconic ne détaille pas les doigts et la garde historique peut se lire avec quatre extrémités. Les anciens assets ne sont pas modifiés. La correction de l’ancienne attribution trop affirmative est explicite dans [l’addendum de portée](art-generation/npc-crossovers-next-wave-20261120/hommage/hand-count-scope-addendum.md).

### Barnoir : le bar de l’épisode 5, recomposé pour le duel

Les références inspectées sont des vignettes publiques de [l’épisode officiel](https://www.youtube.com/watch?v=L4p2gN2CzsA&t=690), de **320 × 180 pixels**, conservées dans le [dossier du décor](art-generation/stage-next-wave-20261120/README.md). Elles permettent d’observer les suspensions segmentées, étagères, comptoir, damier et néons. Aucun visionnage intégral du flux ni détail fin caché n’est revendiqué.

Les trois sorties natives mesurent réellement **1672 × 941** : fond RGB opaque, plans médian et proche RGBA. La piste horizontale à y568, la perspective, la séparation des plans, la musique et les lueurs animées sont des choix du jeu. Le mouvement se fige avec l’option de réduction des animations. Ce décor reste distinct de Little Daisy.

## Intégration et préservation

Le préfixe des **468 costumes précédents** est conservé avec son ordre et ses données. Café s’ajoute ensuite, puis les trois crossovers PNJ. Le registre séparé permet une couverture partielle : **Ribbit a 3/27 tenues**, seulement dans Murder Drones. Les trente-neuf autres PNJ n’ont pas encore de costumes crossover, et leurs menus ne créent pas d’entrées vers des fichiers absents.

L’ajout de Barnoir conserve le catalogue de 23 arènes utilisé par les programmes créés avant ce lot. Des fixtures capturées avant l’édition vérifient **54 récits**, **60 programmes / 360 checkpoints** et **trois replays / 789 frames**. Les fixtures plus anciennes — **45 programmes / 270 checkpoints et quatorze replays / 3 682 frames** — restent également couvertes. Ces ensembles sont décrits séparément, sans les additionner en prétendant qu’ils seraient tous disjoints.

Les contrôles d’intégrité comparent **5 725 fichiers Encore historiques** : aucun n’a changé. Le moteur, les sessions, les récits et la parallaxe historique restent identiques à la base. Les 69 anciens plans de décor sont conservés. Les 47 nouveaux PNG sont copiés à l’identique dans les deux distributions, soit **94 comparaisons de fichiers natifs**, auxquelles s’ajoutent **36 comparaisons de modules**.

## Résultats de vérification

| Vérification | Résultat constaté |
| --- | --- |
| Contrats et suite Node complète | **419 tests réussis, zéro échec, zéro ignoré** |
| Builds CainOS et jeu autonome | **Tous deux réussis** |
| Rendu des quatre apparences | **80 contrôles Canvas**, zéro image manquante, zéro alias d’action |
| Revue des personnages | Huit planches finales inspectées ; revue croisée et empreintes enregistrées |
| Barnoir | **6 contrôles Canvas**, trois positions de caméra et trois scènes avec acteurs |
| Copies natives dans les builds | **94/94 identiques** |
| Modules dans les builds | **36/36 identiques** |
| Assets Encore antérieurs | **5 725/5 725 inchangés** |
| Navigateur local | **Zéro contrôle réussi** ; Chromium a échoué au lancement avant navigation |

La preuve consolidée est [verification.json](art-generation/next-wave-20261120/verification.json). Elle référence les journaux, les deux revues visuelles, les inventaires et les empreintes des sources.

Deux passages préalables du test de fidélité ont échoué sur la reconnaissance des nouvelles références : le domaine du communiqué Animate, puis le type précis des vignettes officielles de Barnoir. Les tests vérifient maintenant les identifiants, chemins et limites de ces sources. Les [journaux initiaux](art-generation/next-wave-20261120/attempts/) restent archivés. Le dernier passage complet est réussi ; aucun changement runtime n’a été nécessaire pour cette correction de contrat.

Les rendus utilisent le renderer de production sous Canvas2D natif Skia. Ils prouvent le chargement, la sélection des dessins et la composition inspectée, sans établir un parcours navigateur ni un essai matériel. La tentative Chromium est datée et conservée dans le dossier Barnoir ; elle précède le manifeste final et n’est pas réutilisée comme preuve de succès.

## Compteurs du catalogue après ce lot

| Mesure | Valeur |
| --- | ---: |
| Combattants / techniques | 54 / 540 |
| Costumes sélectionnables | 472 |
| Costumes d’archive | 51 |
| Apparences Circus supplémentaires | 40 / 440 PNG |
| Tenues crossover | 381 / 3 814 fichiers |
| Propriétaires crossover complets | 14 |
| Propriétaire partiel | Ribbit : 3/27 |
| PNJ sans crossover | 39 |
| Arènes partagées / arrangements dédiés | 24 / 54 |
| Entrées d’archive | 179 |
| Images du paquet hors ligne | 5 816 |
| Taille du paquet d’images | 3 118 619 440 octets |

Le manifeste hors ligne porte la version **`0.7.0-087fd3609c69`**, art **`0c178f8964773da7`**. Les compteurs sont calculés depuis le runtime dans [runtime-counts.json](art-generation/next-wave-20261120/runtime-counts.json), sans remplacer les chiffres datés des anciens rapports.

## Suivi de production

Le classeur contient **3 242 lignes Production, 2 389 lignes QA et 157 sources**, soit 54 nouvelles lignes Production et 54 nouvelles lignes QA. Il conserve **onze feuilles, dix tableaux et 42 formules**. Le suivi distingue les quatre familles, leurs 44 dessins individuels, le décor et les contrôles associés ; les lignes de dessins ne comptent pas comme des costumes supplémentaires.

L’export et la réimportation correspondent aux **81 412 cellules attendues, sans aucune différence**. La comparaison contraint les 80 346 cellules de base, avec 61 cellules historiques explicitement autorisées à évoluer pour les compteurs, formules et textes de portée. Les 3 188 lignes Production et 2 335 lignes QA antérieures gardent leurs identifiants, leur ordre, leurs contenus et leurs notes. Les références incomplètes restent ouvertes.

Les **44 vues finales** ont été inspectées dans la revue indépendante, avec une revue complémentaire des zones de synthèse, familles, références et navigateur. Les formules ont été recalculées ; une variation temporaire de statut a été testée puis annulée avant l’export. Le [dossier de réconciliation](art-generation/workbook-next-wave-20261120/README.md) rassemble le plan des cellules autorisées, les preuves natives, les empreintes, les vues et le reçu de publication des trois fichiers associés.

## Publication et suite

La PR précédente [#7](https://github.com/darknigthmare/CainOS/pull/7) a été fusionnée extérieurement pendant cette continuation, le **20 novembre à 15:34, heure de Paris**. Son commit de fusion est `a56bf7b9e793412760a4f39aa04926355d31a7ce` ; son arbre correspond exactement à la base locale de ce lot. La nouvelle suite est destinée à une PR distincte depuis **`feat/encore-next-wave-20261120`**, vers **`feat/encore-fighter-campaign-art`**. Aucune fusion de PR n’est effectuée par cette tâche.

Le [registre courant](art-generation/next-wave-20261120/remaining-work.md) reste ouvert pour les costumes dont les parties sont masquées, les assemblages non qualifiés de Zooble, les cycles d’animation complets et les essais matériels. Sur le périmètre des quarante PNJ, neuf univers et trois styles, il reste **1 077 tenues crossover** : 24 pour Ribbit et 1 053 pour les trente-neuf autres PNJ. Ces travaux ne sont pas déclarés terminés par ce lot.

# Guide général de combat — application à Digital Circus — Encore

Révision 1.0 · 2026-11-25 · phase **bases et illustrations fixes**.

Le [guide utilisateur v1.0](references/Combat_Games_Guide_General_v1.0.txt) est intégré comme cadre de conception de la [bible principale](../DIGITAL_CIRCUS_ENCORE.md). Ses 30 rubriques sont reliées à 100 exigences identifiables, aux sources actuelles du jeu et aux contrats ci-dessous. Il ne déclenche pas automatiquement la réalisation de toutes les fonctionnalités qu’il cite.

## Décisions qui structurent Encore

Le jeu reste un duel latéral Canvas, partagé entre CainOS et l’entrée autonome. La comédie psychologique surréaliste décrite par [GLITCH](https://www.glitchprod.com/digital-circus) guide le ton : identité reconnaissable, humour inquiet, enjeux situés et conséquences de spectacle. Les chiffres de combat, intrigues jouables et croisements d’univers sont des adaptations ou créations Encore, sans attestation de pouvoirs officiels.

Les routes personnelles existantes conservent leur identité. Une [campagne commune](CAMPAGNE_GLOBALE.md) est maintenant écrite comme proposition distincte : trois actes, douze chapitres et 36 briefs de scènes fixes. Les [six liaisons d’arène et quatre contrats de boss](ARENES_TRANSITIONS_BOSS.md) sont des conceptions à intégrer ultérieurement. Les [Derniers Actes et Rappels](DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) encadrent la présentation des conclusions ; ces noms éditoriaux ne renomment pas les titres du runtime.

La production reste en phase statique : aucun nouveau cycle d’animation, aucune voix ni image n’est créé par cette intégration. Réseau, tag, hub explorable et machine originale combattable restent différés. Les animations et présentations déjà présentes conservent leur statut existant.

## État de référence vérifié

Base : [abb53b2](https://github.com/darknigthmare/CainOS/commit/abb53b227c76c47832f44810aab1aa102286388c) ; jeu 0.7.0, règles 0.5.0, simulation 60 Hz. Les valeurs ci-dessous viennent des modules du jeu. Les réglages de menu par défaut sont 90 secondes, 2 manches gagnantes et difficulté normal ; ils sont distincts d’un éventuel défaut interne du constructeur du moteur.

| Population | Compte | Interprétation |
| --- | --- | --- |
| Combattants / techniques | 64 / 640 | Définitions jouables |
| Modes standards | 9 | Les Escales GLITCH sont des visites supplémentaires |
| Costumes / archives | 540 / 184 | Identités, apparences et entrées d’archive distinctes |
| Arènes du catalogue | 27 = 18 + 9 | Les neuf crossovers sont déjà inclus dans 27 |
| Arrangements dédiés | 64 | Décors réutilisés ; 91 définitions de stage au total |
| Routes / rencontres / tableaux | 64 / 256 / 384 | Histoires individuelles déjà présentes |
| Peintures intro/outro / compositions | 84 / 300 | Comptage via le sélecteur réel et le manifeste ; une composition ne signifie pas une image cassée |
| Finales / amitiés / motifs de projectile | 192 / 64 / 23 | Adaptations de spectacle existantes |
| Illustrations déclarées | 6202 | Inventaire du paquet existant, pas une nouvelle production |

Le total de 36 arènes figurant dans certaines synthèses antérieures comptait deux fois les neuf crossovers. Le compte courant est corrigé à 27. Les rapports de validation datés restent des preuves historiques de leur propre lot ; leurs nombres de tests ne sont pas revendiqués comme exécutés dans cette passe.

## Lecture des statuts

| Axe | Preuve attendue |
| --- | --- |
| lore | Références du dépôt conservées avec leurs limites ; nouveaux récits, connexions et termes éditoriaux originaux Encore ; fidélité 1:1 non certifiée. |
| design | 30 décisions de rubrique, 100 exigences, 12 chapitres/36 briefs et six connexions spécifiés. |
| assets | Zéro image produite ; les chemins du manifeste existant sont inventoriés sans nouvelle revue de tous les visuels. |
| integration | Documentation, associations et suivi ; aucun nouveau mode, lien de stage ou changement de simulation. |
| tests | Validation documentaire et références vérifiées par les générateurs ; preuve du classeur dans combat-guide-workbook-verification.json ; historique des tests moteur conservé comme historique. |
| publication | Fichiers destinés à la branche de PR ; la présence dans un commit ne constitue pas une fusion ou une mise en production. |

« Existant » indique un système trouvé dans les sources ; cela ne ferme pas toutes les exigences de sa rubrique. « Partiel » exige encore un travail identifié. « Conçu, non intégré » désigne une spécification, sans fonctionnalité jouable supplémentaire. Aucune moyenne de ces états ne devient un pourcentage de livraison.

## Matrice des 30 rubriques

| ID | Rubrique | Priorité | Décision | État observé |
| --- | --- | --- | --- | --- |
| EN-G00 | Utilisation du guide et priorités | P0 | retenue | documenté |
| EN-G01 | Identité du projet et périmètre | P0 | retenue | existant |
| EN-G02 | Fidélité au lore et sources | P0 | retenue | partiel |
| EN-G03 | Roster, variantes et costumes | P0 | retenue | existant |
| EN-G04 | Fondations du combat | P0 | retenue | existant |
| EN-G05 | Movesets, spéciaux et ressources | P0 | retenue | partiel |
| EN-G06 | Ultimes, finishers et conclusions | P1 | retenue | partiel |
| EN-G07 | Présentation et relations | P1 | retenue | partiel |
| EN-G08 | Histoires individuelles | P1 | retenue | existant |
| EN-G09 | Campagne globale distincte | P1 | retenue | conçu, non intégré |
| EN-G10 | Illustrations et cinématiques | P1 | retenue | partiel |
| EN-G11 | Boss, machines et Boss Rush | P1 | retenue | partiel |
| EN-G12 | Modes de jeu | P0 | retenue | partiel |
| EN-G13 | Arènes et lisibilité | P1 | retenue | existant |
| EN-G14 | Arènes vivantes et statiques | P1 | retenue | partiel |
| EN-G15 | Connexions et interactions d’arènes | P1 | retenue | conçu, non intégré |
| EN-G16 | Ennemis, soutiens et projectiles | P1 | retenue | partiel |
| EN-G17 | Direction artistique et assets | P0 | retenue | partiel |
| EN-G18 | Animations, VFX, son et caméra | P1 | différée pour les nouvelles animations | partiel |
| EN-G19 | Interface et expérience | P0 | retenue | partiel |
| EN-G20 | Tutoriels et entraînement | P0 | retenue | partiel |
| EN-G21 | IA et difficulté | P0 | retenue | partiel |
| EN-G22 | Équilibrage et accessibilité | P0 | retenue | partiel |
| EN-G23 | Multijoueur, réseau et replays | P0 | local et replays retenus ; réseau différé | partiel |
| EN-G24 | Progression et sauvegardes | P0 | retenue | partiel |
| EN-G25 | Inventaires et statistiques | P0 | retenue | documenté |
| EN-G26 | Validation et ordre de production | P0 | retenue | documenté |
| EN-G27 | Fiches types et contrats | P0 | retenue | documenté |
| EN-G28 | Instruction pour les prochaines passes | P0 | retenue | documenté |
| EN-G29 | Références et vocabulaire | P0 | retenue | documenté |

## 00 — Utilisation du guide et priorités

**EN-G00 · P0 · retenue · documenté**

Le guide v1.0 devient la référence commune, complétée par les décisions Encore et les données observées.

- **EN-G00-01** — Conserver le guide original avec son SHA-256 et relier chaque rubrique à des fichiers et critères.
- **EN-G00-02** — Maintenir séparément conception, assets, intégration, validation et publication.
- **EN-G00-03** — Respecter la phase actuelle de dessins fixes ; planifier les animations sans les lancer.

**Acceptation :** Les sections 00 à 29 sont présentes une seule fois et chaque exigence a un identifiant stable.

**Associations :** [docs/bible/references/Combat_Games_Guide_General_v1.0.txt](../../docs/bible/references/Combat_Games_Guide_General_v1.0.txt) ; [AGENTS.md](../../AGENTS.md) ; [docs/GAMEDEV_WORKFLOW.md](../../docs/GAMEDEV_WORKFLOW.md).

## 01 — Identité du projet et périmètre

**EN-G01 · P0 · retenue · existant**

Digital Circus — Encore, Le Grand Duel : duel latéral Canvas partagé entre CainOS et l’autonome. Le moteur reste celui du dépôt.

- **EN-G01-01** — Conserver les deux entrées sur un seul runtime et les mêmes données.
- **EN-G01-02** — Piliers : identité reconnaissable, neutral lisible, humour inquiet, progression narrative située, sauvegardes compatibles.
- **EN-G01-03** — Cibler navigateur avec clavier, tactile et manettes déjà prévus ; ne pas annoncer de port console ni d’exécutable natif.

**Acceptation :** Vérifier version, cadence, dimensions, entrées et modes dans les constantes actuelles.

**Associations :** [combat/data.mjs](../../combat/data.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [combat/engine.mjs](../../combat/engine.mjs) ; [combat/index.html](../../combat/index.html) ; [scripts/build-combat.mjs](../../scripts/build-combat.mjs).

## 02 — Fidélité au lore et sources

**EN-G02 · P0 · retenue · partiel**

Séparer les références documentées du dépôt, les attributions à confirmer, les adaptations jouables et les créations originales Encore ; le statut de l’identité ne valide pas automatiquement ses pouvoirs.

- **EN-G02-01** — Attacher à chaque fait une référence et sa portée : page officielle, épisode identifié, entretien primaire ou archive de projet.
- **EN-G02-02** — Classer séparément canon attesté, adaptation jouable, original compatible, crossover et à confirmer.
- **EN-G02-03** — Queenie conserve sa tête, son corps et ses appendices documentés, sans bras ni épaules humains inventés ; Chinese Room ne reçoit ni poings humains ni biographie inventée.
- **EN-G02-04** — Une comparaison visuelle encore ouverte demeure ouverte après une réussite technique.

**Acceptation :** Les 64 fiches gardent leurs sources, verrous et limites ; aucun label de génération ne devient une preuve canonique.

**Associations :** [docs/bible/character-associations.json](../../docs/bible/character-associations.json) ; [combat/fidelity.mjs](../../combat/fidelity.mjs) ; [combat/costume-fidelity.mjs](../../combat/costume-fidelity.mjs).

## 03 — Roster, variantes et costumes

**EN-G03 · P0 · retenue · existant**

Conserver les 64 identités jouables et les IDs de costumes. Les PNJ du catalogue ne deviennent pas automatiquement des nouveaux combattants.

- **EN-G03-01** — Relier chaque combattant à sa fiche, sa route, son rival, ses dix slots, ses finales et ses images.
- **EN-G03-02** — Différencier identité, variante de règles, transformation, costume et palette.
- **EN-G03-03** — Les crossovers Hommage/Résident/Fusion sont des créations Encore ; ils ne transfèrent pas automatiquement les pouvoirs de leur univers.
- **EN-G03-04** — Pour les bases baseOnly, deux sources suffisent au lot statique : portrait et garde ; les autres actions ne sont pas annoncées comme animées.

**Acceptation :** Les liens couvrent exactement FIGHTERS et ne changent ni ordre des costumes ni corps de collision.

**Associations :** [combat/data.mjs](../../combat/data.mjs) ; [combat/roster-expansion.mjs](../../combat/roster-expansion.mjs) ; [combat/abstractions-content.mjs](../../combat/abstractions-content.mjs) ; [combat/base-sprite-content.mjs](../../combat/base-sprite-content.mjs).

## 04 — Fondations du combat

**EN-G04 · P0 · retenue · existant**

Simulation fixe à 60 Hz, terrain logique 1280 × 720, règles historiques et ressources déjà présentes.

- **EN-G04-01** — Documenter les dix actions, marche, saut, dash, garde, déchope, chutes et orientation avec leurs commandes réelles.
- **EN-G04-02** — Distinguer paramètres d’interface et défauts internes du moteur ; citer les durées et manches de DEFAULT_SETTINGS.
- **EN-G04-03** — Conserver les résultats double KO/chrono et les anciennes règles de replay ; tout changement de simulation nécessite une tâche dédiée.

**Acceptation :** Lire engine/session/input/bindings ; contrôler les tests de règles existants avant toute évolution.

**Associations :** [combat/engine.mjs](../../combat/engine.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [combat/input.mjs](../../combat/input.mjs) ; [combat/bindings.mjs](../../combat/bindings.mjs) ; [tests/combat-rules.test.mjs](../../tests/combat-rules.test.mjs).

## 05 — Movesets, spéciaux et ressources

**EN-G05 · P0 · retenue · partiel**

La bible relie 640 techniques aux dix slots existants et sépare chiffres du code et justification éditoriale.

- **EN-G05-01** — Extraire startup/active/recovery, dégâts, portée, coûts et propriétés réellement définies sans inventer les valeurs absentes.
- **EN-G05-02** — Pour chaque coup, préciser ancrage, interprétation jouable, signal lisible, réponse adverse et limite de pouvoir.
- **EN-G05-03** — Compléter à terme le résultat en garde/contre/whiff, les cancels et l’avantage à partir du moteur ; ne pas calculer l’avantage avec la seule récupération.
- **EN-G05-04** — Distinguer STABILITÉ et jauge de combat de toute guérison ou capacité officielle.

**Acceptation :** Les noms et slots des 64 × 10 techniques correspondent au runtime ; l’analyse d’équilibrage reste une vérification distincte.

**Associations :** [docs/bible/character-associations.json](../../docs/bible/character-associations.json) ; [combat/data.mjs](../../combat/data.mjs) ; [combat/engine.mjs](../../combat/engine.mjs) ; [combat/training.mjs](../../combat/training.mjs).

## 06 — Ultimes, finishers et conclusions

**EN-G06 · P1 · retenue · partiel**

Super en combat, finale de spectacle après KO, victoire et outro restent distincts. Dernier Acte et Rappel sont les termes originaux de la bible.

- **EN-G06-01** — Conserver les 192 IDs et titres actuels des finales impact/special/super ; toute nouvelle proposition éditoriale reste séparée du nom utilisé dans le runtime.
- **EN-G06-02** — Un Dernier Acte ferme le duel après le résultat acquis ; un Rappel offre une conclusion amicale cohérente.
- **EN-G06-03** — Prévoir des cibles humanoïdes, sans membres, géantes et composites/abstraites avec une alternative par cadrage.
- **EN-G06-04** — Aucun finisher arcade ne prouve une mort persistante, une sortie réelle ou une restauration d’abstraction.

**Acceptation :** Contrôler KO, cible, distance, caméra, passage abrégé et retour résultat pour toute future intégration ; vérifier 3 finales et 1 Rappel par fiche.

**Associations :** [docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md](../../docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) ; [combat/finisher-catalog.mjs](../../combat/finisher-catalog.mjs) ; [combat/finishers.mjs](../../combat/finishers.mjs) ; [combat/friendship-catalog.mjs](../../combat/friendship-catalog.mjs).

## 07 — Présentation et relations

**EN-G07 · P1 · retenue · partiel**

Les rivaux actuels sont conservés comme choix de routes Encore. Ils ne constituent pas une matrice d’hostilité canonique.

- **EN-G07-01** — Associer raison, escalade et résolution au rival de chaque route.
- **EN-G07-02** — Prioriser les dialogues pour rival principal, partenaires, boss et miroir, puis utiliser des répliques génériques fidèles.
- **EN-G07-03** — Éviter les connaissances hors période et les répliques humaines ajoutées aux formes muettes.

**Acceptation :** Le rival existe, apparaît dans les quatre rencontres et garde une motivation spécifique.

**Associations :** [combat/stories.mjs](../../combat/stories.mjs) ; [combat/tournament-lore.mjs](../../combat/tournament-lore.mjs) ; [combat/render-sequences.mjs](../../combat/render-sequences.mjs) ; [docs/bible/character-associations.json](../../docs/bible/character-associations.json).

## 08 — Histoires individuelles

**EN-G08 · P1 · retenue · existant**

64 routes de quatre affrontements, trois tableaux d’introduction et trois de conclusion, reliés aux combattants et aux sources de jeu ; les améliorations de mise en scène restent à produire.

- **EN-G08-01** — Relier chaque affrontement à un motif, un adversaire, un stage et une conséquence.
- **EN-G08-02** — Séparer les nouvelles intentions de dialogues du texte actuellement joué.
- **EN-G08-03** — Conserver sauvegarde, reprise et galerie ; documenter les doublons de cast encore observés au lieu de les déclarer corrigés.

**Acceptation :** 256 rencontres et 384 briefs reliés à STORY_ROUTES ; ordre, IDs et checkpoint conservés.

**Associations :** [combat/stories.mjs](../../combat/stories.mjs) ; [combat/story-presentation.mjs](../../combat/story-presentation.mjs) ; [combat/progression.mjs](../../combat/progression.mjs) ; [docs/bible/character-associations.json](../../docs/bible/character-associations.json).

## 09 — Campagne globale distincte

**EN-G09 · P1 · retenue · conçu, non intégré**

La Répétition impossible : une intrigue commune originale en trois actes et douze chapitres, distincte des routes et de l’Arcade.

- **EN-G09-01** — Établir incident, menace, points de vue alternés, révélations et résolution commune.
- **EN-G09-02** — Pour chaque chapitre, définir personnage jouable, adversaire, lieu, enjeu, trois scènes fixes et checkpoint.
- **EN-G09-03** — Prévoir échec, reprise, difficulté et sélection des chapitres sans bonus sur le duel normalisé.

**Acceptation :** Les 12 chapitres et 36 briefs sont liés à des IDs existants ; le mode ne sera livré qu’après un parcours complet et une reprise testée.

**Associations :** [docs/bible/CAMPAGNE_GLOBALE.md](../../docs/bible/CAMPAGNE_GLOBALE.md) ; [docs/bible/guide-design.json](../../docs/bible/guide-design.json) ; [combat/stories.mjs](../../combat/stories.mjs) ; [combat/progression.mjs](../../combat/progression.mjs).

## 10 — Illustrations et cinématiques

**EN-G10 · P1 · retenue · partiel**

Les 384 tableaux individuels existants et leurs compositions sont inventoriés. Les peintures dédiées, compositions du lecteur et futurs tableaux globaux se comptent séparément.

- **EN-G10-01** — Chaque brief fixe cast, tenue, action unique, cadrage, lumière, émotion, raccord et réserve de texte.
- **EN-G10-02** — Garder les sous-titres hors de l’image ; cible de composition 16:9 et dimensions natives consignées.
- **EN-G10-03** — Revoir les 84 peintures intro/outro avant remplacement ; les 300 compositions existantes ne sont pas automatiquement des pannes.
- **EN-G10-04** — La campagne globale ajoute 36 briefs planifiés, pas 36 fichiers générés.

**Acceptation :** Comparer chaque brief aux scènes et images correspondantes, puis examiner le rendu avec les textes ; un sprite isolé et une illustration de groupe sont des unités différentes.

**Associations :** [docs/bible/character-associations.json](../../docs/bible/character-associations.json) ; [docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md](../../docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) ; [combat/illustrations.mjs](../../combat/illustrations.mjs) ; [combat/story-presentation.mjs](../../combat/story-presentation.mjs).

## 11 — Boss, machines et Boss Rush

**EN-G11 · P1 · retenue · partiel**

Le mode boss actuel utilise Gloink Queen, The Fudge, Kaufmo abstrait et Caine. Les phases scénarisées et la sélection Boss Combat restent à concevoir/intégrer selon le contrat.

- **EN-G11-01** — Conserver l’ordre actuel du Boss Rush et distinguer duel libre, sélection de boss et rencontre à phases.
- **EN-G11-02** — Décrire annonces, ouvertures, réponses pour tous les gabarits et résultat de chaque boss.
- **EN-G11-03** — Aucune machine canonique autonome n’est ajoutée sans source ; une machine de spectacle originale relève d’une extension P2.
- **EN-G11-04** — Évaluer les grands corps et les prises sans immunité qui supprime toutes les réponses d’un style.

**Acceptation :** Quatre contrats reliés aux combattants réels ; chaque phase future exige un test jouable dédié, hors validation documentaire.

**Associations :** [docs/bible/ARENES_TRANSITIONS_BOSS.md](../../docs/bible/ARENES_TRANSITIONS_BOSS.md) ; [combat/session.mjs](../../combat/session.mjs) ; [combat/engine.mjs](../../combat/engine.mjs) ; [docs/COMBAT_GLOINK_QUEEN_0.7.0.md](../../docs/COMBAT_GLOINK_QUEEN_0.7.0.md).

## 12 — Modes de jeu

**EN-G12 · P0 · retenue · partiel**

Conserver les neuf modes actuels et les Escales GLITCH. La campagne globale et Boss Combat seront des parcours explicites supplémentaires.

- **EN-G12-01** — Lister entrée, sélection, partie, résultat, revanche/sortie et sauvegarde de chaque mode.
- **EN-G12-02** — Conserver Versus CPU, local, Arcade, Histoires, tournoi, Boss Rush, survie, entraînement et défis.
- **EN-G12-03** — Différer tag, coopération, équipes simultanées et parties réseau ; ne pas les inférer de l’existence du moteur.

**Acceptation :** Une entrée de menu ne ferme pas une tâche de mode ; vérifier son parcours complet dans les deux distributions.

**Associations :** [combat/data.mjs](../../combat/data.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [combat/app.mjs](../../combat/app.mjs) ; [combat/crossover-visits.mjs](../../combat/crossover-visits.mjs).

## 13 — Arènes et lisibilité

**EN-G13 · P1 · retenue · existant**

27 arènes au catalogue, dont 18 hors crossovers et 9 escales GLITCH, plus 64 arrangements par combattant. Les arrangements réutilisés ne sont pas 64 lieux supplémentaires.

- **EN-G13-01** — Conserver plan de sol, taille logique, profondeur, limites et contraste des pieds.
- **EN-G13-02** — Attribuer lieu attesté, adaptation, original ou crossover à chaque décor.
- **EN-G13-03** — Relier plans de parallaxe, objets et aperçu sans masquer les signes de combat.

**Acceptation :** Les 18 arènes hors crossovers et les 9 escales GLITCH se recomptent depuis STAGES : 27 au total ; les 64 arrangements dédiés restent séparés.

**Associations :** [combat/data.mjs](../../combat/data.mjs) ; [combat/stage-parallax.mjs](../../combat/stage-parallax.mjs) ; [combat/render-stage-scenery.mjs](../../combat/render-stage-scenery.mjs) ; [docs/COMBAT_DECORS_ET_POSES.md](../../docs/COMBAT_DECORS_ET_POSES.md).

## 14 — Arènes vivantes et statiques

**EN-G14 · P1 · retenue · partiel**

Le rendu possède des ambiances et reducedMotion. La bible sépare maintenant présentation, interactions, dangers et transitions.

- **EN-G14-01** — Présentation vivant/statique/réduit ne change pas implicitement les règles de collision ou dégâts.
- **EN-G14-02** — Décrire déclencheur, fréquence, priorité et état de chaque événement de fond.
- **EN-G14-03** — Les profils Compétition, Spectacle et Confort sont des contrats cibles ; les options nouvelles ne sont pas annoncées comme présentes.

**Acceptation :** Deux rendus du même match gardent la même simulation ; un danger conserve son signal lisible dans le rendu statique.

**Associations :** [combat/render-stage-motion.mjs](../../combat/render-stage-motion.mjs) ; [combat/render-stage-scenery.mjs](../../combat/render-stage-scenery.mjs) ; [combat/readability.mjs](../../combat/readability.mjs) ; [docs/bible/ARENES_TRANSITIONS_BOSS.md](../../docs/bible/ARENES_TRANSITIONS_BOSS.md).

## 15 — Connexions et interactions d’arènes

**EN-G15 · P1 · retenue · conçu, non intégré**

Six connexions utilisent des endpoints déjà catalogués. Leur géographie et leur déclenchement sont des créations Encore, non des faits de la série.

- **EN-G15-01** — Définir départ, arrivée, côté, seuil, commande, contre-jeu, durée et états des deux combattants.
- **EN-G15-02** — Au transfert, conserver vie/jauges/manches ; vider les attaques et objets transitoires selon une règle explicite ; figer le chrono pendant le transfert.
- **EN-G15-03** — Priorité au KO/chrono ; pas de double transfert ni de boucle sans contrôle ; annoncer les règles avant le match.
- **EN-G15-04** — Une scène suivante dans une route n’est pas une transition de stage pendant un combat.

**Acceptation :** Pour chaque lien, charger réellement l’arrivée, vérifier positions, collisions, interruption, replay et absence de combo infini.

**Associations :** [docs/bible/ARENES_TRANSITIONS_BOSS.md](../../docs/bible/ARENES_TRANSITIONS_BOSS.md) ; [docs/bible/guide-design.json](../../docs/bible/guide-design.json) ; [combat/engine.mjs](../../combat/engine.mjs) ; [combat/session.mjs](../../combat/session.mjs).

## 16 — Ennemis, soutiens et projectiles

**EN-G16 · P1 · retenue · partiel**

Les 23 motifs illustrent des attaques déjà définies. Un motif n’est ni un nouveau personnage ni une nouvelle capacité canonique.

- **EN-G16-01** — Relier chaque projectile à ses propriétaires et slots, son image, son point d’émission et ses règles de renvoi.
- **EN-G16-02** — Distinguer art, trajectoire, impact et son ; un renvoi change le propriétaire sans changer le motif original.
- **EN-G16-03** — Classer ennemi, soutien, PNJ et prop avec leurs usages ; un PNJ jouable en duel n’est pas automatiquement un système de hordes.

**Acceptation :** Les motifs et mouvements liés existent dans le code ; trajectoire, impact, réflexion et cache se vérifient dans les tests dédiés.

**Associations :** [combat/projectile-art.mjs](../../combat/projectile-art.mjs) ; [combat/render-presentation.mjs](../../combat/render-presentation.mjs) ; [combat/engine.mjs](../../combat/engine.mjs) ; [combat/roster-expansion.mjs](../../combat/roster-expansion.mjs).

## 17 — Direction artistique et assets

**EN-G17 · P0 · retenue · partiel**

Conserver l’esthétique 2D UHD, la silhouette de chaque univers et la phase de bases fixes ; un sujet exploitable par image autonome.

- **EN-G17-01** — Exiger alpha réel pour les sprites détourés, corps entier si demandé, marges et ancrages cohérents.
- **EN-G17-02** — Vérifier les asymétries, accessoires, anatomies et gabarits contre une source nommée.
- **EN-G17-03** — Tracer source native, dimensions, SHA-256, destination et revue ; ne pas qualifier un agrandissement de natif.
- **EN-G17-04** — Réutiliser un asset vérifié avant de produire un doublon ; les fonds et scènes complètes peuvent être opaques.

**Acceptation :** Valider la source puis son rendu à la taille de jeu ; qualité technique et comparaison canonique restent distinctes.

**Associations :** [docs/COMBAT_ART_BRIEF_0.6.0.md](../../docs/COMBAT_ART_BRIEF_0.6.0.md) ; [docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md](../../docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md) ; [combat/base-sprite-content.mjs](../../combat/base-sprite-content.mjs) ; [combat/fidelity.mjs](../../combat/fidelity.mjs).

## 18 — Animations, VFX, son et caméra

**EN-G18 · P1 · différée pour les nouvelles animations · partiel**

Les présentations, sons et effets existants restent documentés. Toute production supplémentaire d’animations attend la phase dédiée.

- **EN-G18-01** — Planifier états, entrées/sorties et points d’émission sans lancer de nouveaux cycles.
- **EN-G18-02** — Séparer horloge visuelle et simulation ; cadrer les grands adversaires et les retours de caméra.
- **EN-G18-03** — Associer indices visuels/sonores et options de confort, sans confondre PNG de projectile et VFX animé.

**Acceptation :** Les nouveaux livrables de cette intégration sont documentaires ; aucun cycle ou audio nouveau ne doit apparaître dans le bilan.

**Associations :** [combat/render-poses.mjs](../../combat/render-poses.mjs) ; [combat/render-finishers.mjs](../../combat/render-finishers.mjs) ; [combat/audio.mjs](../../combat/audio.mjs) ; [combat/audio-ambiences.mjs](../../combat/audio-ambiences.mjs).

## 19 — Interface et expérience

**EN-G19 · P0 · retenue · partiel**

Étendre les parcours existants avec des états explicites disponible/verrouillé/prévu et des liens vers le codex.

- **EN-G19-01** — Détailler démarrage, sélection, combat, pause, résultat, revanche, galerie et reprise pour les deux entrées.
- **EN-G19-02** — Afficher les quatre axes de règles de stage avant tout match qui les utilise.
- **EN-G19-03** — Conserver navigation clavier/manette/tactile, focus, remappage et traitement des interruptions.

**Acceptation :** Toute évolution d’interface exige le parcours navigateur concerné ; une maquette ou un texte de bible ne constitue pas une livraison UI.

**Associations :** [combat/app.mjs](../../combat/app.mjs) ; [combat/menu-navigation.mjs](../../combat/menu-navigation.mjs) ; [combat/input.mjs](../../combat/input.mjs) ; [combat/style.css](../../combat/style.css).

## 20 — Tutoriels et entraînement

**EN-G20 · P0 · retenue · partiel**

Les Répétitions et les six défis existants servent de base. La bible ajoute un programme d’apprentissage par personnage à développer.

- **EN-G20-01** — Conserver dummy, remise à zéro, hitboxes, ressources, enregistrement et vitesse d’entraînement.
- **EN-G20-02** — Pour chaque kit, expliquer approche, anti-saut, punition, défense, ressource et un combo accessible.
- **EN-G20-03** — Ajouter un exercice de transition seulement après intégration du système, puis un exercice de boss.

**Acceptation :** Chaque exercice a un objectif observable, une réinitialisation et une explication d’échec ; vérifier changement de côté et gabarits.

**Associations :** [combat/training.mjs](../../combat/training.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [tests/combat-training.test.mjs](../../tests/combat-training.test.mjs).

## 21 — IA et difficulté

**EN-G21 · P0 · retenue · partiel**

Utiliser l’IA et les difficultés existantes ; écrire les intentions par style sans revendiquer une nouvelle IA de campagne.

- **EN-G21-01** — Régler réaction, erreurs et ressources dans les règles observées plutôt qu’en donnant des pouvoirs non documentés.
- **EN-G21-02** — Prévoir réponses aux projectiles, prises et différentes tailles ; intégrer interactions/transitions seulement quand elles existent.
- **EN-G21-03** — Conserver graine, situations reproductibles et exceptions de boss explicitement définies.

**Acceptation :** Rejouer une situation à graine et difficulté fixes, puis mesurer les différences entre profils.

**Associations :** [combat/engine.mjs](../../combat/engine.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [tests/combat-engine.test.mjs](../../tests/combat-engine.test.mjs).

## 22 — Équilibrage et accessibilité

**EN-G22 · P0 · retenue · partiel**

Le duel conserve ses règles normalisées. Les choix narratifs et costumes restent séparés des avantages compétitifs.

- **EN-G22-01** — Vérifier coins, sorties de pression, prises, petites/grandes tailles, projectiles et boucles.
- **EN-G22-02** — Conserver remappage, lisibilité renforcée, sous-titres, volumes séparés, réduction de mouvements et passage des scènes.
- **EN-G22-03** — Ne pas annoncer une difficulté, un confort ou une cadence comme validés sans le test approprié.

**Acceptation :** Comparer états et résultats entre profils de présentation ; tests matériels et revue visuelle restent identifiés séparément.

**Associations :** [combat/readability.mjs](../../combat/readability.mjs) ; [combat/bindings.mjs](../../combat/bindings.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [tests/combat-accessibility-browser.mjs](../../tests/combat-accessibility-browser.mjs).

## 23 — Multijoueur, réseau et replays

**EN-G23 · P0 · local et replays retenus ; réseau différé · partiel**

Local et replays sont présents. Rollback, matchmaking et crossplay ne font pas partie des fonctions actuelles.

- **EN-G23-01** — Conserver attribution des côtés, profils et reconnexion des périphériques.
- **EN-G23-02** — Conserver les replays avec leur version de règles et signaler l’incompatibilité d’un futur format de transition.
- **EN-G23-03** — Avant une extension réseau, décider snapshot, entrées, aléatoire, événements et service ; ne pas déduire le rollback d’un pas fixe.

**Acceptation :** Tester le replay avec sa version et l’état complet du match ; les nouvelles transitions demanderont un contrat de sérialisation séparé.

**Associations :** [combat/session.mjs](../../combat/session.mjs) ; [combat/engine.mjs](../../combat/engine.mjs) ; [combat/input.mjs](../../combat/input.mjs) ; [tests/combat-session.test.mjs](../../tests/combat-session.test.mjs).

## 24 — Progression et sauvegardes

**EN-G24 · P0 · retenue · partiel**

Les profils, programmes sauvegardés, déblocages et replays existants restent l’autorité. La campagne globale devra disposer d’un espace de progression versionné.

- **EN-G24-01** — Préserver routes, difficultés, galerie, costumes et paramètres lors des mises à jour.
- **EN-G24-02** — Ajouter un futur globalCampaignRun distinct sans écraser program/story, avec chapitre, checkpoint et scènes vues.
- **EN-G24-03** — Les récompenses globales restent cosmétiques/narratives ; pas de statistiques imposées au duel.

**Acceptation :** Fermeture/reprise, sauvegarde corrompue, import ancien et retour hors ligne sont des cas de validation requis.

**Associations :** [combat/progression.mjs](../../combat/progression.mjs) ; [combat/session.mjs](../../combat/session.mjs) ; [combat/offline.mjs](../../combat/offline.mjs) ; [tests/combat-profile-backup-browser.mjs](../../tests/combat-profile-backup-browser.mjs).

## 25 — Inventaires et statistiques

**EN-G25 · P0 · retenue · documenté**

Le classeur conserve ses onze feuilles historiques et reçoit une table Guide combat. Le JSON de liaison décrit les populations et leur statut.

- **EN-G25-01** — Compter séparément combattants, techniques, costumes, motifs, arènes, arrangements, briefs et fichiers.
- **EN-G25-02** — Relier les 64 fiches d’association, 256 rencontres, 384 tableaux et 192 finales aux données présentes.
- **EN-G25-03** — Conserver toutes les notes utilisateur et historiques ; ne pas additionner des tests historiques aux contrôles de cette passe.
- **EN-G25-04** — La campagne globale, les connexions et les nouvelles fiches restent des plans tant que leur exécution n’est pas testée.

**Acceptation :** Comparer les anciennes cellules, formules et objets du classeur ; vérifier les liens JSON et les identifiants.

**Associations :** [docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](../../docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) ; [docs/combat-tracker-data.json](../../docs/combat-tracker-data.json) ; [docs/bible/guide-integration.json](../../docs/bible/guide-integration.json).

## 26 — Validation et ordre de production

**EN-G26 · P0 · retenue · documenté**

La prochaine tranche de travail peut utiliser deux styles, une scène et une route ; la présente tâche livre la bible et ses associations.

- **EN-G26-01** — Définir terminé séparément pour fiche, sprite, combattant, arène, boss, route et mode.
- **EN-G26-02** — Prioriser identités et bases fixes manquantes, puis une route et un chapitre représentatifs.
- **EN-G26-03** — Pour une future transition, prouver d’abord un lien jouable complet avant d’étendre aux six connexions.
- **EN-G26-04** — Publier le commit et son état réel de PR ; ne pas assimiler PR ouverte et production.

**Acceptation :** Les preuves portent une commande, une date, un périmètre et une révision ; tout test absent reste non exécuté.

**Associations :** [docs/GAMEDEV_WORKFLOW.md](../../docs/GAMEDEV_WORKFLOW.md) ; [docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md](../../docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md).

## 27 — Fiches types et contrats

**EN-G27 · P0 · retenue · documenté**

Relier les fiches d’association tirées du runtime aux modèles A-J du guide, puis ajouter les contrats communs pour chapitre global, lien de stage, boss et projectile.

- **EN-G27-01** — Chaque fiche a un ID stable, une source ou une justification, des dépendances et les six axes de statut.
- **EN-G27-02** — Les champs mécaniques inconnus restent à définir, sans zéro fictif ni chemin d’image inventé.
- **EN-G27-03** — Ajouter aux finishers conditions, morphologies, remplacement, retour résultat et statut du nom.

**Acceptation :** Valider champs et liaisons ; une fiche de contenu ne termine pas ses tâches d’asset ou d’intégration.

**Associations :** [docs/bible/character-associations.json](../../docs/bible/character-associations.json) ; [docs/bible/guide-design.json](../../docs/bible/guide-design.json) ; [docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md](../../docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md).

## 28 — Instruction pour les prochaines passes

**EN-G28 · P0 · retenue · documenté**

Le travail repart du guide utilisateur, des sources actuelles et des écarts recensés, avec la phase statique comme limite de production.

- **EN-G28-01** — Lire les décisions de périmètre et la matrice avant toute nouvelle génération ou implémentation.
- **EN-G28-02** — Sélectionner un lot cohérent depuis les IDs ouverts, puis produire, relier, vérifier et publier selon l’autorisation.
- **EN-G28-03** — Rendre un bilan par étape avec sources, restants et état de PR.

**Acceptation :** La commande de validation de la bible et du guide réussit sans modifier les modules du jeu.

**Associations :** [docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md](../../docs/bible/COMBAT_GAMES_GUIDE_INTEGRATION.md) ; [scripts/build-combat-guide.mjs](../../scripts/build-combat-guide.mjs) ; [scripts/build-combat-guide-associations.mjs](../../scripts/build-combat-guide-associations.mjs).

## 29 — Références et vocabulaire

**EN-G29 · P0 · retenue · documenté**

Le guide commun conserve ses inspirations SF6, GG Isuka, MKX/11/1 et Injustice 2. Elles servent à choisir des structures, sans importer leurs pouvoirs ou leur violence.

- **EN-G29-01** — Conserver les cinq références du guide dans leur contexte et dater les nouvelles consultations.
- **EN-G29-02** — Utiliser les sources GLITCH pour l’identité du Circus ; les archives du dépôt établissent le jeu existant.
- **EN-G29-03** — Distinguer super, Dernier Acte, Rappel et outro dans toute nouvelle fiche.

**Acceptation :** Les sources sont attribuées avec leur portée et les propositions originales ne sont pas présentées comme officielles.

**Associations :** [docs/bible/references/Combat_Games_Guide_General_v1.0.txt](../../docs/bible/references/Combat_Games_Guide_General_v1.0.txt) ; [combat/fidelity.mjs](../../combat/fidelity.mjs) ; [docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md](../../docs/bible/DIRECTION_ARTISTIQUE_ET_DERNIERS_ACTES.md).

## Fiches et prochaines passes

Les [64 associations de personnages](ASSOCIATIONS_PERSONNAGES.md) relient les identités, dix slots, routes, rivaux, tableaux, finales, costumes et rôles globaux. Les [modèles A–J et critères de livraison](MODELES_ET_CRITERES.md) indiquent les champs connus, les champs à compléter et la preuve requise avant de changer un statut.

Prochaine tranche proposée : vérifier une identité et ses bases fixes, puis relire une route représentative et le premier chapitre global. Une éventuelle transition commence par un seul lien jouable, avant les autres connexions. Chaque tranche reprend les IDs ouverts et garde les niveaux lore/conception/assets/intégration/test/publication séparés.

## Traçabilité

L’original est conservé sans modification : SHA-256 `4844584616072ac0d52d37c2fab4365e1ec489240f17a721ee216e223b0355b7`, 55172 octets. [guide-design.json](guide-design.json) contient les décisions et les scènes ; [guide-integration.json](guide-integration.json) conserve les comptages et empreintes des sources. Le [classeur](../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) ajoute la feuille **Guide combat** et conserve les notes historiques.

Reconstruction : `node scripts/build-combat-guide-associations.mjs`, puis `node scripts/build-combat-guide.mjs`. Contrôle sans écriture : les mêmes commandes avec `--check`. Le résultat du classeur est contrôlé séparément par sa preuve de publication. Les fichiers de combat et le manifeste hors ligne ne sont pas modifiés par ces générateurs.

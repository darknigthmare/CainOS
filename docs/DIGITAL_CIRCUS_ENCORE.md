# Digital Circus — Encore · Le Grand Duel

Version jouable : **0.2.0** — 22 octobre 2026.

Encore partage son moteur entre l’application CainOS et le jeu autonome. Cette
version comprend **14 combattants, 140 techniques, 12 arènes, 9 modes, 51 costumes
et 179 entrées d’archive**. Elle ajoute les histoires individuelles, le tournoi,
la reprise des cinq programmes, les touches personnalisables, la musique et le
téléchargement hors ligne. Les catalogues effectifs sont définis dans
[`combat/data.mjs`](../combat/data.mjs), les modes affichés dans
[`combat/session.mjs`](../combat/session.mjs).

## Accès au jeu

L’icône **Circus Combat** et l’entrée correspondante du menu Démarrer ouvrent
`combat/index.html?embedded=1` dans une fenêtre de CainOS. Le lien « Ouvrir le jeu
autonome » lance le même module directement. La calibration de première utilisation
de CainOS est conservée ; le jeu autonome est accessible sans passer par ce prologue.

La fermeture, la réduction, le changement de fenêtre, la perte de focus, le masquage
de l’onglet et l’extinction du moniteur suspendent la rencontre. La reprise est
explicite. Le jeu autonome et la fenêtre intégrée utilisent le même moteur, les
mêmes définitions de contenu et le même profil local sur une origine commune.

## Construire les deux distributions

```bash
npm run build
npm run build:combat
```

`dist/` contient CainOS et son application de combat. `dist-combat/` contient le jeu
autonome, son point d’entrée et les **42 planches originales**, soit
**47 345 031 octets d’illustrations**. Ce second dossier peut être hébergé
indépendamment de CainOS. Les scripts
[`build-combat.mjs`](../scripts/build-combat.mjs) et
[`build-combat-offline.mjs`](../scripts/build-combat-offline.mjs) assemblent ces
fichiers et régénèrent l’inventaire hors ligne.

Pour un essai local sans dépendance supplémentaire :

```bash
python3 -m http.server 8080 --directory dist-combat
```

Ouvrir `http://localhost:8080/` pour le premier lancement en ligne. Pour les visites
hors ligne, conserver l’adresse directe
`http://localhost:8080/combat/index.html?standalone=1` ou utiliser le raccourci
installé. La redirection à la racine du build n’est pas mise en cache.

Les modules JavaScript sont servis par HTTP ; une ouverture directe en `file://`
ne constitue pas un lancement pris en charge. L’installation web PWA est proposée
quand le navigateur la permet. Les paquets natifs Windows/Linux et mobiles restent
des tâches distinctes dans l’Excel.

## Contenu jouable

| Artiste | Fonction de combat | Exemple de mécanique adaptée |
| --- | --- | --- |
| Pomni | Esquive et mobilité | Glissade, recul numérique, ruée vers une fausse sortie |
| Jax | Pièges et provocation | Clef qui revient, piège au sol, provocation |
| Ragatha | Résistance | Parade de contact, armure temporaire, soin récupérable |
| Gangle | Portée | Rubans, ralentissement, protection contre un projectile |
| Zooble | Polyvalence | Pièces détachées, extension modulaire, parade |
| Kinger | Défense | Salve virtuelle, fort de coussins, contre |
| Caine | Contrôle de l’espace | Confettis, recul instantané et séries de projectiles |
| Bubble | Mobilité | Rebond, morsure et projectiles |
| Gummigoo | Pression | Avancée, attaques de contact et couverture |
| Loolilalu | Projectiles | Sceptre, éclats et barrières de sucre |
| Gloink Queen | Colosse | Gloinks, charge et carapace temporaire |
| The Fudge | Colosse | Projectiles lents, ralentissement au sol et absorption |
| Kaufmo abstrait | Menace | Projections de glitch, tentacules et charge |
| Baron Mildenhall | Précision | Projectiles, préparation et contrôle de distance |

Chaque combattant possède les dix emplacements CQC : léger, fort, bas, saisie,
spécial neutre, spécial bas, spécial avant, spécial arrière, finale et utilitaire.
Les 140 techniques sont décrites dans le codex et dans le classeur avec leurs
frames de démarrage, d’activité et de récupération, leurs dégâts, leurs portées,
leurs coûts et leur effet.

Les 12 décors sont la grande piste, Candy Canyon, Mildenhall Manor, Spudsy’s, le
cellier, le Vide, le lac numérique, la salle de calibration, le nid des Gloinks,
le palais de sucre, les terrains du cirque et le couloir des portes. Les arènes
partagent une surface de duel sans danger aléatoire. Les décors ont une géométrie
dessinée dans Canvas et une palette propre.

Les **51 variantes sélectionnables** remplacent l’apparence du même combattant sans
modifier son kit. Leur attribution repose sur une liste explicite par identité :
un parent, un rival, un accessoire, un effet ou une projection ne reçoit pas un kit
simplement parce que son identifiant contient le nom d’un artiste.

Les **179 entrées d’archive** restent consultables et filtrables : 14 combattants,
51 variantes et 114 autres archives sans kit livré. Leur présence conserve la
mémoire du projet sans attester leur statut canonique. Les règles et leurs cas de
contrôle figurent dans [`combat/data.mjs`](../combat/data.mjs) et
[`tests/combat-catalog.test.mjs`](../tests/combat-catalog.test.mjs).

### Modes

| Mode | Comportement livré |
| --- | --- |
| Versus CPU | Choix libre du personnage, du rival, des costumes, de l’arène et de la difficulté |
| Duel local | Deux joueurs simultanés au clavier partagé ou via l’API Gamepad |
| Le grand spectacle | Programme arcade de six rencontres ; dernier adversaire Caine |
| Les anomalies | Quatre rencontres de boss : reine, Fudge, Kaufmo abstrait, Caine |
| Encore. Encore. | Dix vagues ; santé conservée avec 1 200 points récupérés après une victoire |
| Les répétitions | Mannequin immobile, garde haute/basse, saut, réaction après impact ou CPU ; soin, finale libre, hitboxes et remise en place |
| Les défis de Caine | Six exercices mesurables de 60 secondes : dégâts, garde, combo, saisies, quatre techniques, finale |
| Derrière le rideau | 14 histoires originales, chacune avec introduction, quatre rencontres écrites et conclusion ; 56 chapitres au total |
| La coupe du cirque | Tableau à huit participants distincts ; quarts, demi-finales et finale, soit trois victoires du joueur pour remporter la coupe |

Les duels libres respectent les réglages de manches gagnantes et de durée. Les
rencontres des cinq programmes — arcade, boss, survie, histoire et tournoi — sont
en une manche gagnante et possèdent un point de reprise. Les victoires, défis,
médailles et fins d’histoire réellement obtenus sont enregistrés dans le profil.

Les histoires de [`combat/stories.mjs`](../combat/stories.mjs) associent à chaque
artiste ses adversaires, ses décors, ses dialogues d’avant-combat et sa conclusion.
Ces scénarios originaux de fan-game n’affirment pas raconter des événements
canoniques. Les campagnes qui adapteraient chaque épisode de la série restent
dans le plan de production.

Le tournoi affiche ses **sept emplacements de rencontre**. Le joueur dispute ses
trois tours ; les matchs entre CPU sont simulés à partir de la graine du tableau
et portent explicitement cette mention. Une défaite élimine le joueur, sans
attribuer la médaille. Le résultat permet de consulter le tableau résolu puis de
recommencer une tentative. Les règles sont définies dans
[`combat/progression.mjs`](../combat/progression.mjs).

## Commandes

### Réglage initial

| Action | Joueur 1 | Joueur 2 |
| --- | --- | --- |
| Déplacement | ZQSD en AZERTY, WASD en QWERTY, positions physiques identiques | Flèches |
| Saut | Haut ou Espace | Flèche haut |
| Léger / fort | J / K | B / N ou pavé 1 / 2 |
| Bas | Bas + J | Bas + B ou pavé 1 |
| Saisie / déchope | U | V ou pavé 4 |
| Spécial | I, avec direction éventuelle | Virgule (AZERTY), M (QWERTY) ou pavé 5, avec direction |
| Finale | O | Point-virgule (AZERTY), virgule (QWERTY) ou pavé 6 |
| Utilitaire | L | Deux-points (AZERTY), point (QWERTY) ou pavé 3 |
| Garde | Maj gauche | Maj droite ou pavé 0 |
| Dash | E | Ctrl droite ou décimale du pavé |
| Pause | Échap ou bouton visible | Échap ou bouton visible |

Les spéciaux avant/arrière sont relatifs à l’orientation face au rival. Une garde
haute laisse passer les coups bas et les saisies. Les annulations léger → fort,
bas → spécial et fort → spécial avant exigent un impact confirmé. Une finale
demande la jauge indiquée sur sa fiche ; certaines coûtent plus que les 75 % de base.

### Touches personnalisables

Les réglages exposent **12 actions par joueur**, avec une touche principale et une
alternative facultative. La capture enregistre la position physique de la touche
(`KeyboardEvent.code`) ; le choix AZERTY/QWERTY adapte les libellés affichés dans
les réglages, le carnet de commandes, le codex et les indications de combat.

Une touche appartient à une seule action d’un seul joueur. Les conflits et les
touches réservées au navigateur ou à la navigation sont refusés. Échap annule la
capture ; Retour arrière retire une alternative. Le bouton de réinitialisation
restaure les deux mappings par défaut. Les mappings invalides importés reviennent
aux valeurs sûres, sans laisser une action inaccessible. Les appuis très brefs
restent disponibles au prochain tick de simulation et un remappage libère les
touches maintenues. Voir [`combat/bindings.mjs`](../combat/bindings.mjs) et
[`combat/input.mjs`](../combat/input.mjs).

### Manettes et tactile

Manettes standard : stick/croix pour le déplacement, A/× pour sauter, X/□ pour le
léger, Y/△ pour le fort, B/○ pour le spécial, LB/L1 pour garder, RB/R1 pour saisir,
RT/R2 pour le dash, L3 pour la finale, R3 pour l’utilitaire et Start/Options pour la
pause, y compris pendant un replay. Dans les menus, stick/croix déplacent le focus,
A/× choisit et B/○ revient. Les listes, curseurs et cases sont pilotables ; les
champs de texte restent accessibles au clavier et à la souris. Une capture de
touche suspend les actions manette. Le relâchement évite de transformer le bouton
de pause ou de sélection encore maintenu en une autre action.

Deux manettes gardent leur attribution J1/J2 quand l’une se déconnecte. Les contrôles
tactiles peuvent être forcés depuis les réglages et conservent les pressions brèves
et les maintiens multiples. La validation sur de vraies manettes et de vrais
appareils mobiles reste distincte de l’émulation Chromium et des simulations de
l’API.

## Musique et effets

[`combat/audio.mjs`](../combat/audio.mjs) contient **12 thèmes procéduraux originaux**,
un par arène, avec mélodie, basse, rythme et tempo propres. Le menu reprend un
arrangement allégé du thème de la grande piste. Les **16 motifs d’effets** et leurs
sept alias couvrent les impacts, blocages, parades, brisures, déplacements,
techniques, récupération, résultats et actions de menu. L’application choisit un
effet prioritaire parmi les événements simultanés.

La musique est **désactivée par défaut**. Son activation et son volume sont séparés
des bruitages ; son volume initial est de 20 %. La première interaction autorisée
débloque WebAudio. Les pauses et le masquage arrêtent les voix en cours ; une seule
horloge musicale et une limite de 24 voix bornent les ressources. Si le navigateur
refuse l’audio, le combat reste utilisable.

Ces sons sont synthétisés localement : aucune musique ni voix enregistrée de la
série n’est importée. Certains événements partagent encore un motif, notamment les
impacts léger/lourd et la saisie. Les voix, ambiances dédiées et essais de mixage
sur appareils physiques restent suivis dans le classeur.

## Installation web et hors ligne

Sous HTTPS ou localhost, ouvrir **Réglages → Télécharger le spectacle** puis
attendre la confirmation **42/42 illustrations**. Le pack correspond exactement aux
**47 345 031 octets** de [`combat/offline-manifest.mjs`](../combat/offline-manifest.mjs).
Le premier téléchargement exige une connexion et le stockage nécessaire. Les
fichiers déjà reçus sont réutilisés lors d’une nouvelle tentative.

Si la première installation échoue ou dépasse vingt secondes, les réglages
affichent l’erreur et proposent **Réessayer le mode hors ligne**. Le jeu en ligne
reste utilisable. Une installation de remplacement n’interrompt pas le worker
déjà actif ; les appels simultanés partagent la même tentative.

Le bouton **Installer le jeu** apparaît quand le navigateur fournit une invitation
d’installation. Une visite ultérieure peut partir du raccourci installé ou de
`combat/index.html?standalone=1`. Le service worker contrôle uniquement le chemin
du jeu ; le bureau CainOS et la redirection à la racine du standalone ne deviennent
pas utilisables hors ligne par cette fonction.

Une mise à jour en attente est proposée dans les réglages et son application
recharge le jeu. Le cache du code utilise `OFFLINE_VERSION`, celui des illustrations
utilise leur empreinte `ART_VERSION` : **une mise à jour du code conserve un pack
d’illustrations inchangé**. Si les images changent, préparer le nouveau pack avant
la prochaine visite sans connexion. **Libérer les illustrations** supprime leur
cache sans effacer les touches, le profil ou la progression. Le navigateur peut
aussi évincer son cache ; l’état affiché dans les réglages permet de vérifier sa
disponibilité. Voir [`combat/offline.mjs`](../combat/offline.mjs) et
[`combat/sw.js`](../combat/sw.js).

## Sauvegardes et replays

Le profil est versionné sous `cainos.circus-combat.profile.v1`. Le dernier replay
est enregistré séparément sous `cainos.circus-combat.replay.v1`. Les sauvegardes de
CainOS et de CQC ne sont ni remplacées ni migrées.

Les réglages, touches, résultats, défis, médailles, histoires terminées et programme
en cours peuvent être exportés/importés en JSON.
Un import vérifie le format, les types et les limites ; le remplacement du profil
demande confirmation dans l’interface du jeu. Un stockage local bloqué ne doit pas
empêcher de jouer : le jeu conserve sa session et signale la nécessité d’exporter.

Les cinq programmes enregistrent **le début de la rencontre courante** : graine,
adversaire, arène, costume, règles et santé initiale. Le prochain duel est sauvegardé
avant l’affichage du bouton de continuation. Recharger reprend cette entrée de
rencontre et conserve les victoires précédentes ; une frame intermédiaire du combat
n’est pas restaurée. En cas de défaite, histoire/arcade/boss permettent de rejouer
la rencontre en conservant les étapes gagnées. Survie et tournoi recommencent une
tentative complète ; leur tirage conserve sa graine. Survie reporte les PV restants
avec 1 200 PV de récupération, plafonnés à 10 000.

Le format de profil reste en **version 1**. Les profils antérieurs reçoivent les
nouvelles valeurs par défaut — touches initiales, musique coupée, aucune histoire
inventée et aucun programme ajouté — en conservant leurs données reconnues.
Le validateur reconstruit les programmes depuis leurs résultats. À la lecture
du stockage local, un point de reprise incohérent ou devenu incompatible est
écarté seul : statistiques, médailles, défis, histoires, historique et touches
restent conservés. Les imports explicites et les nouvelles sauvegardes gardent
une validation stricte des programmes.

Un replay contient le couple de combattants, les costumes, l’arène, la graine,
les règles, la santé initiale et les commandes compressées par séquences identiques.
L’IA reste déterministe. La lecture reproduit une simulation à 60 Hz et n’ajoute
aucun résultat au palmarès. Les replays **0.1.0 et 0.2.0** sont acceptés ; un ancien
replay sans costumes utilise les apparences originales. Une variante doit
correspondre au combattant indiqué. La capacité est bornée à 72 000 images, soit
20 minutes de simulation ; les pauses ne sont pas enregistrées. Les contrats
d’import et de migration figurent dans
[`combat/session.mjs`](../combat/session.mjs) et
[`tests/combat-session.test.mjs`](../tests/combat-session.test.mjs).

Le partage entre l’OS et le standalone vaut sur une même origine. Sur un autre
domaine, l’export/import JSON assure le transfert. La synchronisation cloud des
combats n’est pas livrée.

## Provenance du moteur

La base historique du port initial 0.1.0 est le commit CainOS
[`4926834a2f063028903d6431e77f0bece859e671`](https://github.com/darknigthmare/CainOS/commit/4926834a2f063028903d6431e77f0bece859e671)
de `main`. La version 0.2.0 poursuit la
[PR #1](https://github.com/darknigthmare/CainOS/pull/1), fusionnée au commit
[`53d56cf30484708af7c171babd3a05aa684d9a8a`](https://github.com/darknigthmare/CainOS/commit/53d56cf30484708af7c171babd3a05aa684d9a8a),
qui constitue la base de la nouvelle branche `feat/encore-0-2-story-offline`.

La référence CQC est le commit
[`42279c1c884769873e66bbda0b6fe849bcd2f1a2`](https://github.com/darknigthmare/shadow-codec-ops/tree/42279c1c884769873e66bbda0b6fe849bcd2f1a2/public/cqc)
de la branche `codex/cqc-p38-archive-projectile-range`, contenant la fusion de la
garde-robe P39. La branche `main` du projet Metal Gear était plus ancienne.

Le module `combat/engine.mjs` porte réellement le noyau `CQCCombat046` embarqué
dans `public/cqc/modules/unified-versus-v055.html`, avec le corps de simulation du
fichier actif `public/cqc/src/cqc-pass8-combat-engine.js` et la correction de délai
CPU de `cqc-pass10-cpu-ai.js`. L’enveloppe ES module isole le moteur des globals CQC
et des contenus Metal Gear.

Sont conservés : pas fixe 60 Hz, dix emplacements de coups, startup/active/recovery,
garde et chip non létal, brisure, projections/déchopes, parades/reflets limités,
combos avec dégradation et échappement, coûts, ressources, pièges, effets d’état,
collisions balayées des projectiles et hasard xorshift32.

Les corrections ajoutées pendant le port concernent notamment la garde maintenue
pendant le blockstun, une annulation refusée qui ne supprime plus la récupération,
la fenêtre de déchope, le dash arrière, la comparaison de pourcentages de santé à
la limite de temps et la portée effectivement bornée des projectiles.

Les noms et apparences proviennent de CainOS et des références GLITCH listées dans
`combat/data.mjs`. Les techniques et les rencontres sont des adaptations de jeu.
Les archives tardives ou spéculatives de CainOS restent signalées comme éléments du
projet à vérifier. L’Excel les inventorie sans convertir automatiquement leurs
anciens libellés en faits canoniques.

## Architecture des fichiers

| Fichier | Responsabilité |
| --- | --- |
| `combat/engine.mjs` | Simulation indépendante du navigateur et enveloppe fixe |
| `combat/data.mjs` | Combattants, kits, arènes, sources et variantes |
| `combat/sprite-catalog.mjs` | Inventaire des atlas dérivé des tables CainOS |
| `combat/render.mjs` | Rendu Canvas, extraction/cadrage en cache, effets, décors |
| `combat/input.mjs` | Clavier, tactile, manette et impulsions de commandes |
| `combat/bindings.mjs` | Mappings J1/J2, conflits, libellés et nettoyage des imports |
| `combat/session.mjs` | Profils, migrations, replays, défis et compteurs testables |
| `combat/progression.mjs` | Programmes, checkpoints, santé de survie et tableau du tournoi |
| `combat/stories.mjs` | 14 routes originales, 56 chapitres, introductions et conclusions |
| `combat/audio.mjs` | 12 thèmes, 16 motifs, volumes séparés et cycle de vie WebAudio |
| `combat/offline.mjs` | Préparation du pack, installation et mise à jour proposées dans l’interface |
| `combat/sw.js` | Cache du jeu, cache d’illustrations versionné séparément et portée limitée |
| `combat/manifest.webmanifest` | Identité, point d’entrée et icônes d’installation web |
| `combat/app.mjs` | Menus, sélection, parcours, résultats et liaison avec l’OS |
| `scripts/build-combat.mjs` | Distribution statique indépendante |
| `scripts/build-combat-offline.mjs` | Inventaire, taille et empreintes du code et du pack d’illustrations |
| `scripts/build-combat-catalog.mjs` | Extraction reproductible du catalogue CainOS |
| `scripts/build-combat-workbook.mjs` | Génération du classeur et de ses données à partir des définitions livrées |
| `docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` | Classeur de production filtrable et éditable |

## Classeur de production

[`DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) possède dix
feuilles : Synthèse, Fonctionnalités, Combattants, Techniques, Arènes, Atlas,
Production, Scénarios, QA et Références. Le générateur
[`build-combat-workbook.mjs`](../scripts/build-combat-workbook.mjs) lit les catalogues,
les 56 chapitres, les thèmes/effets et les preuves de tests réellement disponibles.
Les statuts « Implémenté », « Partiel », « Prévu » et « À vérifier » distinguent
fonctionnement, finition et validation. Les notes utilisateur, filtres, formules
et critères de réception permettent de poursuivre le suivi après cette PR.

## Vérifications et limites pratiques

`npm run qa` exécute les audits CainOS existants, les tests comportementaux du
moteur et de la session, les vérifications de syntaxe et les deux assemblages.
Les cas couvrent les 140 techniques, tous les combattants, les collisions, les
coûts, les combos, les transitions de manches, le déterminisme, les sauvegardes et
les défis. Les résultats détaillés sont consignés dans le suivi QA et les rapports.

La validation Node consignée pour 0.2.0 compte **141 tests réussis** :

| Suite | Cas réussis | Périmètre |
| --- | ---: | --- |
| [`combat-engine.test.mjs`](../tests/combat-engine.test.mjs) | 40 | Simulation, techniques, collisions, ressources, manches et déterminisme |
| [`combat-session.test.mjs`](../tests/combat-session.test.mjs) | 31 | Profils, migration, replays, défis, entrées de combat et récupération d’un checkpoint incompatible |
| [`combat-catalog.test.mjs`](../tests/combat-catalog.test.mjs) | 7 | Classification des 179 apparences et des 51 costumes |
| [`combat-bindings.test.mjs`](../tests/combat-bindings.test.mjs) | 16 | Remappage, conflits, pressions brèves, navigation et déconnexion manette |
| [`combat-progression.test.mjs`](../tests/combat-progression.test.mjs) | 19 | 14 routes, tournoi, checkpoints, santé, reprises et imports incohérents |
| [`combat-audio.test.mjs`](../tests/combat-audio.test.mjs) | 14 | Opt-in, volumes, contexte simulé, voix bornées, interruptions et destruction |
| [`combat-offline.test.mjs`](../tests/combat-offline.test.mjs) | 14 | Échecs et délai d’installation, reprise, appels simultanés, worker actif et nettoyage des ressources |

Les six suites navigateur finales totalisent **48 contrôles réussis** :

| Script | Résultat consigné pour 0.2.0 |
| --- | --- |
| [`combat-encore-browser.mjs`](../tests/combat-encore-browser.mjs) | **8/8 vérifications**, **9 duels réellement joués** : histoire de Jax complète, reprise, tournoi gagné/perdu, défaite/revanche et remplacement du checkpoint |
| [`combat-offline-browser.mjs`](../tests/combat-offline-browser.mjs) | **11/11 vérifications** : remappage réel, WebAudio, combo courant, pause, pack 42/42, recharge sans réseau, mise à jour conservant le pack, portée du worker, libération du cache et réglages à 390 px |
| [`combat-browser.mjs`](../tests/combat-browser.mjs) | **11/11 vérifications** : navigation, codex/archives, réglages, clavier J1/J2, pause, défi, calibration et lancement dans CainOS, commandes tactiles à 390 px |
| [`combat-progression-browser.mjs`](../tests/combat-progression-browser.mjs) | **10/10 vérifications** : match et replay, transitions arcade/boss/survie, profils, imports refusés, stockage indisponible et distribution autonome |
| [`combat-profile-recovery-browser.mjs`](../tests/combat-profile-recovery-browser.mjs) | **5/5 vérifications** : checkpoint incompatible au démarrage et entre deux onglets, persistance des réglages et du profil, défi Spécialiste réellement accompli, import invalide refusé |
| [`combat-recovery-browser.mjs`](../tests/combat-recovery-browser.mjs) | **3/3 vérifications** : erreur HTTP 503 pendant la première installation, nouvelle tentative dans l’interface, profil conservé et rechargement sans réseau après téléchargement du pack |

Les six rapports finaux ne contiennent aucune erreur JavaScript consignée.
Le contrôle WebAudio vérifie son fonctionnement dans Chromium sans constituer une
écoute humaine. Les assertions, rapports et limites sont réunis dans
[`combat-qa-evidence.json`](combat-qa-evidence.json) ; les rapports navigateur bruts
sont écrits sous `audit-combat/`. Ces 48 contrôles ne signifient pas que les
14 histoires ont toutes été parcourues jusqu’à leur fin dans un navigateur :
les 14 routes sont couvertes par les tests de progression, tandis que le parcours
complet joué dans cette suite est celui de Jax.

Les parcours navigateur sont reproductibles avec Playwright et Chromium.
Dans un premier terminal, à la racine du dépôt :

```bash
npm run build:combat
python3 -m http.server 4178
```

Laisser ce serveur actif, puis lancer les suites dans un second terminal,
toujours à la racine du dépôt :

```bash
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-progression-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-encore-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-profile-recovery-browser.mjs
node tests/combat-offline-browser.mjs
node tests/combat-recovery-browser.mjs
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` permet de choisir un exécutable Chromium
existant. Les scripts n’injectent pas de commandes privées dans le moteur ; ils
utilisent l’interface publique, les commandes et une vue de lecture de l’état.
Les deux suites hors ligne servent elles-mêmes le dossier `dist-combat/`, produit
auparavant par `npm run build:combat`, et pilotent la disponibilité du réseau ainsi que le
cycle du service worker.

Les sept planches animées du projet servent aux poses de repos, de marche,
d’interaction et de blessure. La pose d’interaction est réutilisée pour les attaques.
Les autres personnages et les costumes utilisent des sprites avec transformations
procédurales. Les animations de combat dédiées, portraits finaux, ambiances et voix,
motifs sonores encore partagés et réglage du mix restent suivis comme partiels ou
prévus. Les 12 thèmes musicaux synthétiques sont livrés ; ils ne remplacent pas la
validation artistique et matérielle de toute la bande sonore.

Le réseau/rollback, les équipes et assists, la coopération contre boss, les
campagnes par épisode, les finishers cinématiques, la synchronisation cloud,
l’économie/déblocage, les paquets natifs et l’équilibrage compétitif complet ne sont
pas livrés. La reprise du noyau CQC ne signifie pas que toutes ses extensions
Metal Gear ont été portées. L’audit d’accessibilité complet, la lecture daltonisme,
la revue visuelle exhaustive des 51 costumes et la vérification du lore étendu
restent également dans le classeur.

Les contrôles à 390 px vérifient une fenêtre tactile émulée ; ils ne valent pas
certification sur téléphone physique. De même, les routes testées et les résultats
automatisés ne constituent pas une certification commerciale de toute la production.

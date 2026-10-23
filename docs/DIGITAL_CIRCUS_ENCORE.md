# Digital Circus — Encore · Le Grand Duel

Version jouable : **0.5.0** — 23 octobre 2026.

Encore partage son moteur entre l’application CainOS et le jeu autonome. Cette
version comprend **14 combattants, 140 techniques, 12 arènes, 9 modes, 51 costumes
et 179 entrées d’archive**. Elle conserve les histoires individuelles, le tournoi,
la reprise des cinq programmes, les touches personnalisables, la musique et le
téléchargement hors ligne. La version 0.5.0 ajoute le laboratoire image par image,
l’enregistrement du mannequin, **70 séquences de présentation**, **12 ambiances
visuelles d’arène** et une nouvelle feuille transparente pour Jax. Elle corrige
quatre comportements du moteur et de l’IA en conservant les règles des anciens
replays. La garde-robe et les 51 fiches individuelles de fidélité livrées en 0.4.0,
ainsi que les corrections de détourage, de décors et de reculs de 0.3.0, restent
disponibles. Les catalogues sont définis dans
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
autonome, son point d’entrée et les **42 planches utilisées par le jeu**, soit
**48 370 710 octets d’illustrations**. Jax 0.5.0 remplace sa feuille historique dans
le pack, sans ajouter une quarante-troisième image. Ce second dossier peut être hébergé
indépendamment de CainOS. Les scripts
[`build-combat.mjs`](../scripts/build-combat.mjs) et
[`build-combat-offline.mjs`](../scripts/build-combat-offline.mjs) assemblent ces
fichiers et régénèrent l’inventaire hors ligne. L’empreinte de cette livraison est
**`OFFLINE_VERSION = 0.5.0-8ce2171ba557`** ; celle des illustrations est
**`ART_VERSION = 97f16f24d98d57c0`**.

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
| Pomni | Esquive et mobilité | Glissade, recul physique, course offensive |
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
| Les répétitions | Six comportements de mannequin, gel et avance d’une image, trois vitesses, historique des commandes, lecture des phases, enregistrement/relecture de 600 images, jauges libres et remise en place |
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

## Laboratoire d’entraînement

Le laboratoire conserve les six mannequins : **immobile, garde haute, garde basse,
sauts, garde après impact et CPU**. Les réglages **Finale libre**, **Ressource
libre** et **Soin automatique** sont indépendants. Les zones de contact restent
affichables pour distinguer la géométrie de simulation des illustrations.

**Figer** suspend le temps ; **+1 image** exécute exactement un pas de simulation
de 1/60 s puis reste figé. Une pression brève d’attaque est consommée une fois.
Les vitesses **×1, ×0,5 et ×0,25** changent la fréquence des pas, sans changer les
délais des techniques exprimés en images. Le répertoire et le retour de pause
respectent le gel choisi.

Chaque joueur dispose d’un relevé **préparation / activité / récupération**, du
temps restant et de la réaction subie. Le laboratoire conserve les **douze
dernières entrées groupées** par joueur, avec leur durée en images. Les dégâts,
impacts et gardes du mannequin restent visibles ; l’historique peut être effacé
indépendamment de la position des artistes.

**Enregistrer** replace les artistes puis dirige le mannequin avec les commandes
J1 ; le combattant J1 reste neutre. La séquence est limitée à **600 images**, soit
**10 secondes de simulation** à vitesse normale. Gauche et droite sont conservées
relativement au côté vers lequel regarde le mannequin. **Lire** replace les
artistes et joue la séquence une fois ou **en boucle**, en conservant cette relation
au facing. La lecture utilise temporairement un mannequin manuel, puis rend le
comportement configuré à la fin ou à l’arrêt.

**Replacer** conserve les réglages, la séquence enregistrée et le gel. Cette action
efface les statistiques et l’historique de l’essai, arrête l’enregistrement ou la
lecture et libère les commandes en attente. **Effacer la séquence** retire la bande
de la session. Aucune bande n’est écrite dans le profil ou dans le dernier replay ;
quitter l’entraînement ne donne ni victoire, ni médaille, ni progression.

Les contrats sont définis dans [`combat/training.mjs`](../combat/training.mjs),
[`combat-training.test.mjs`](../tests/combat-training.test.mjs) et
[`combat-training-browser.mjs`](../tests/combat-training-browser.mjs).

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
**48 370 710 octets** de [`combat/offline-manifest.mjs`](../combat/offline-manifest.mjs),
pour la livraison **`0.5.0-8ce2171ba557`**.
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
aucun résultat au palmarès. Les replays **0.1.0, 0.2.0, 0.3.0, 0.4.0 et 0.5.0** sont acceptés ; un ancien
replay sans costumes utilise les apparences originales. Une variante doit
correspondre au combattant indiqué. La version originale reste dans le fichier
validé et exporté. `getReplayFighter` sélectionne les anciens reculs instantanés
de Pomni/Kaufmo pour les versions 0.1.0 et 0.2.0 ; les nouveaux combats et les
replays 0.3.0/0.4.0/0.5.0 emploient leurs reculs continus. L’option `rulesVersion`
du moteur reprend également la version du fichier : les corrections 0.5.0 ne
changent pas rétroactivement une ancienne simulation. Les 140 techniques et les
51 identifiants de costumes sont conservés. La capacité est bornée à 72 000 images, soit
20 minutes de simulation ; les pauses ne sont pas enregistrées. Les contrats
d’import et de migration figurent dans
[`combat/session.mjs`](../combat/session.mjs) et
[`tests/combat-session.test.mjs`](../tests/combat-session.test.mjs).

Le partage entre l’OS et le standalone vaut sur une même origine. Sur un autre
domaine, l’export/import JSON assure le transfert. La synchronisation cloud des
combats n’est pas livrée.

### Règles 0.5.0 et compatibilité des enregistrements

Les nouveaux duels utilisent quatre corrections versionnées :

- Les **dix pièges déclarés bas** respectent leur niveau : ils passent la garde
  haute et sont arrêtés par la garde basse.
- Le CPU conserve sa garde haute ou basse pendant le blockstun.
- Le CPU de Ragatha choisit son soin en tenant compte de la vie récupérable,
  des ressources, du budget de soin et du délai disponible.
- Les saisies du CPU utilisent la portée réelle du coup et la largeur du rival,
  ce qui permet notamment au colosse Gloink Queen de saisir à sa portée effective.

Les versions 0.1.0 à 0.4.0 suivent leurs anciens chemins de règles. **56 traces CPU
déterministes** — quatre versions × quatorze combattants, chacune sur 900 images —
ont été capturées sur le moteur publié avant ces corrections. Les empreintes de
toutes les images restent identiques après versionnement. Les tests vérifient
séparément les nouvelles règles et la reproduction des anciennes ; cette
compatibilité ne constitue pas un équilibrage compétitif complet.
Voir [`combat-rules.test.mjs`](../tests/combat-rules.test.mjs).

## Provenance du moteur

La base historique du port initial 0.1.0 est le commit CainOS
[`4926834a2f063028903d6431e77f0bece859e671`](https://github.com/darknigthmare/CainOS/commit/4926834a2f063028903d6431e77f0bece859e671)
de `main`. Les versions 0.2.0 à 0.4.0 poursuivent la
[PR #1](https://github.com/darknigthmare/CainOS/pull/1), fusionnée au commit
[`53d56cf30484708af7c171babd3a05aa684d9a8a`](https://github.com/darknigthmare/CainOS/commit/53d56cf30484708af7c171babd3a05aa684d9a8a),
qui constitue la base de la branche `feat/encore-0-2-story-offline`.
La version 0.4.0 a ensuite été fusionnée par la
[PR #2](https://github.com/darknigthmare/CainOS/pull/2), au commit
[`f2253279c92b6e782006be7abeed9f2ea4d33453`](https://github.com/darknigthmare/CainOS/commit/f2253279c92b6e782006be7abeed9f2ea4d33453).
La présente version part de cette base sur la branche
`feat/encore-0-5-training-presentation`.

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
`combat/data.mjs` et dans le registre `combat/fidelity.mjs`. Les techniques et
les rencontres sont des adaptations de jeu.
Les archives tardives ou spéculatives de CainOS restent signalées comme éléments du
projet à vérifier. L’Excel les inventorie sans convertir automatiquement leurs
anciens libellés en faits canoniques.

## Fidélité visuelle et présentation 0.5.0

Le registre [`combat/fidelity.mjs`](../combat/fidelity.mjs) et les fiches
[`combat/costume-fidelity.mjs`](../combat/costume-fidelity.mjs) réunissent
**217 entrées** : 14 personnages, 140 techniques, 12 arènes et 51 costumes.
Le jeu et le classeur lisent les mêmes sources, observations, adaptations et
périmètres de revue. Un lien d'épisode ou un ancien nom d'archive ne valide pas
une apparence à lui seul.

### Choisir, comparer et essayer une tenue

Dans la sélection, le portrait et le nom affichés suivent immédiatement
l'apparence choisie pour J1 et J2. Changer l'adversaire réinitialise uniquement
sa propre tenue. Les portraits conservent leur rapport largeur/hauteur dans les
cartes, y compris sur un écran de 390 pixels.

**Voir la tenue** ouvre la garde-robe depuis la sélection ou les archives. Elle
montre l'original et la tenue avec le renderer de combat, à leur échelle réelle
dans l'arène. Le menu contient uniquement les apparences compatibles avec cet
artiste. Les repères de chaque costume restent accessibles au clavier et au
tactile. **Essayer en entraînement** lance un duel jouable dans cette tenue ;
la consultation et l'essai n'attribuent aucune victoire et préservent le profil.

### Poses, appuis et états de combat

Les **56 cellules des sept planches animées** ont chacune un repère du corps et
un contact au sol. Les deux poses de repos de Jax sont recalées sur leur racine,
y compris dans sa nouvelle feuille 0.5.0. Les pieds de la seconde
rangée et le ruban de Gangle qui déborde de sa cellule sont recalés ; le portail
de Caine ne détermine plus le centre de son corps. Une seule échelle uniforme,
calculée depuis la pose de repos, s'applique aux autres cellules.

Le renderer sélectionne les dessins existants selon l'état : introduction,
repos, marche, saut, garde, préparation/contact/récupération de l'attaque,
réaction, victoire ou défaite. Caine ne présente plus le portail à chaque frappe.
L'horloge de fin de manche anime uniquement la présentation des personnages,
sans faire avancer les projectiles, les pièges, les effets ou la simulation.

L'accroupissement ne comprime plus globalement le dessin. Les bases **Pomni et
Zooble** utilisent une flexion modeste de pièces rigides : visage et torse sont
translatés, les jambes tournent à leurs articulations et les chaussures restent
au sol. Les franges alpha se chevauchent au raccord des hanches ; cela ne constitue
pas une nouvelle pose dessinée. Les autres morphologies et tous les costumes
restent entiers, avec une légère inclinaison et un indicateur bas. **Jax conserve
son illustration entière** et ne reçoit plus l’ancien rig découpé. Les changements
d'état restent lisibles quand le mouvement réduit fige les boucles décoratives.
**Ces poses ne représentent pas les zones de collision pixel par pixel.** Le labo
permet toujours d'afficher les zones effectives ; les séquences de présentation
n’en changent pas la géométrie.

L'[entretien de Kevin Temmer](https://www.comicsbeat.com/interview-with-kevin-temmer-of-the-amazing-digital-circus/)
décrit le travail d'animation propre aux personnages ; il ne fournit pas de
chorégraphies de combat canoniques. Les transformations du jeu restent des
adaptations des illustrations déjà présentes dans CainOS.

[Comparaison des postures](images/encore-poses-crouch.png) ·
[Introduction, victoire et défaite](images/encore-poses-outcomes.png) ·
[Phases d'attaque](images/encore-poses-attacks.png)

### Jax : feuille transparente et palette

[`cainos-jax-animation-sheet-0.5.0.png`](../assets/images/cainos-jax-animation-sheet-0.5.0.png)
est une nouvelle illustration régénérée, en RGBA, **1536 × 1024 pixels**, répartie
sur huit cellules. Elle reprend une peau violette, une salopette rose, des yeux
et des gants jaunes ainsi que des dents jaunes quand elles sont visibles. Les
huit racines sont mesurées sur cette source ; l’ancienne feuille n’est pas écrasée.

La nouvelle source a été contrôlée sur fond blanc, cyan et sombre : ses cellules
ne contiennent aucun fragment visible au bord, l’extraction préserve les couleurs
opaques et l’alpha visible, et le rendu conserve une échelle uniforme. Les
contours régénérés diffèrent de l’image historique. Ces huit cellules restent des
illustrations de repos, marche, parole, pointage et réaction ; elles ne constituent
pas un jeu de dessins de combat dédiés.
[Voir la palette de Jax](images/encore-jax-palette.png).

### Séquences d’entrée et de résultat

[`combat/render-sequences.mjs`](../combat/render-sequences.mjs) définit **70
séquences**, soit cinq par combattant : introduction, victoire de round, défaite
de round, victoire finale et défaite finale. Chaque artiste a un rythme et des
déplacements propres, appliqués rigidement aux illustrations disponibles. Les
durées sont bornées ; la présentation finale couvre **132 images à 60 Hz**.
Le passage à la phase de combat reste commandé par le moteur. Une fois leur durée atteinte,
elles restent sur leur pose de fin. Une égalité conserve une pose neutre.

L’horloge de présentation est séparée du moteur. À la fin d’un match, le profil,
le replay et le prochain point de reprise sont enregistrés immédiatement ; la
modale de résultat arrive après **2,2 secondes**. **Voir le résultat** permet de
passer directement à cette modale. Ce choix n’attribue pas une seconde récompense.
Le mouvement réduit affiche des poses fixes. Le masquage du jeu suspend aussi
l’attente de présentation.
[Voir les 70 présentations](images/encore-outcome-sequences.png).

### Ambiances des douze arènes

[`combat/render-stage-motion.mjs`](../combat/render-stage-motion.mjs) ajoute une
couche propre à chaque décor : lueurs de piste, poussière de sucre, bougies,
vapeur, présences du cellier, reflets du Vide, ondes du lac, balayage de calibration,
formes des Gloinks, scintillements du palais, nuages et veilleuses du couloir.
Les coordonnées sont déterministes et les effets restent derrière les acteurs,
strictement au-dessus de **y = 568**. Les pixels de la piste sont identiques au
fond statique. Le mode mouvement réduit fige ces douze couches.

Ces ambiances visuelles sont des adaptations du jeu. Elles ne corrigent pas à
elles seules les écarts de décor consignés dans le registre, notamment le couloir
des résidents. [Voir les douze arènes](images/encore-stage-motion.png).

### Revue des 51 costumes

Les cinq planches de contact couvrent chaque cellule et son extraction réelle.
Dix-sept rectangles explicites corrigent des grilles qui coupaient des mains,
des chapeaux ou incluaient une partie du personnage voisin. Les coordonnées
d'origine et les identifiants restent conservés ; seul le cadrage rendu change.

Les cinq planches livrées sont consultables ici : [1–12](images/costumes-0.4.0-page-1.png),
[13–24](images/costumes-0.4.0-page-2.png), [25–36](images/costumes-0.4.0-page-3.png),
[37–48](images/costumes-0.4.0-page-4.png) et [49–51](images/costumes-0.4.0-page-5.png).
Les mesures et empreintes sont conservées dans
[`combat-costume-review.json`](combat-costume-review.json).

La correction locale des rubans de Gangle tragédie modifie **11 227 pixels de
couleur**, avec **zéro changement des zones protégées du masque, des larmes et
de la main**, de l'alpha ou de la géométrie. Elle conserve l'ombrage du sprite
existant, sans prétendre restituer toutes les couleurs ou formes du modèle officiel.
[Comparer la palette](images/gangle-palette-0.4.0.png).

Shadow Pomni, Shadow Ragatha et Shadow Caine gardent désormais chaque octet RGBA
de leur cellule d'origine. Leur corps noir n'est plus percé par le détourage ;
le fond texturé opaque reste visible et doit être traité par un travail artistique
dédié. [Comparer leur conservation](images/shadow-preservation-0.4.0.png).

Chaque fiche distingue deux examens :

- **L'atlas du projet** : traits effectivement visibles, preuve d'identité,
  cadrage, transparence, proportions, problèmes précis et identifiant de capture.
- **La référence officielle** : visuel réellement consulté, observations et
  différences constatées. Une inspection technique complète ne valide pas
  automatiquement le dessin par rapport à la série.

Les comparaisons ciblées comprennent notamment les masques de Gangle, Maid Jax,
les tenues de Gangle et l'uniforme de Ragatha. Les détails manquants ou différents
sont consignés individuellement. Les costumes spéculatifs conservent un statut
explicite ; aucune nouvelle origine canonique n'est inventée pour les valider.
Les fonds texturés qui restent solidaires de certaines illustrations sont aussi
signalés, sans effacer les parties sombres du personnage pour forcer un détourage.

### Corrections conservées depuis 0.3.0

Les références consultées sont liées au registre, notamment la
[galerie officielle GLITCH](https://www.glitchprod.com/digital-circus). Leurs images
ne sont pas ajoutées au pack ; les décors restent dessinés par le jeu.

| Correction | Comportement livré | Portée du contrôle |
| --- | --- | --- |
| Kaufmo abstrait | Son corps noir et les détails internes survivent au détourage | Intégrité du sprite existant ; comparaison canonique détaillée encore ouverte |
| Grande piste | Palette cyan/or, damier et éléments observés dans les visuels officiels | Disposition adaptée au duel horizontal |
| Cellier | Obscurité, yeux multicolores et lumière centrale | Aucun couloir à barreaux déduit de l'image |
| Vide | Espace clair et irisé distinct du couloir EXIT et du dessous de la carte | Sol horizontal conventionnel nécessaire au combat |
| Projectiles et pièges | Clef, rubans, bouton, pièces, bonbons et bulles reconnaissables | Présentation de mécaniques originales, sans pouvoir attribué au canon |
| Pomni et Kaufmo | Recul réparti sur 15 images actives, respectivement −10 et −9 pixels/image | Reculs 0.3.0 conservés en 0.4.0/0.5.0 ; anciens replays explicitement versionnés |

Les deux reculs gardent leurs distances et durées nominales : **150 pixels /
30 images pour Pomni**, **135 pixels / 36 images pour Kaufmo**. Les chiffres
actuels des kits sont comparés à l'empreinte publiée en 0.3.0 ; les kits hérités
restent comparés à la version 0.2.0.

Les aperçus de décor suivent aussi le premier chapitre des 14 histoires. Les
liens de référence sont facultatifs, sans dépendance réseau pour jouer.
Le lac reste sans source primaire précise ; la salle de calibration est une
création originale. Le couloir des résidents, les animations de combat dessinées
spécifiquement et les écarts artistiques des costumes restent suivis. Les mesures
techniques et les tests ne constituent pas une certification canonique 1:1.

## Architecture des fichiers

| Fichier | Responsabilité |
| --- | --- |
| `combat/engine.mjs` | Simulation indépendante du navigateur et enveloppe fixe |
| `combat/data.mjs` | Combattants, kits actuels/hérités, arènes et variantes |
| `combat/fidelity.mjs` | Registre partagé des sources, observations, adaptations et périmètres à revoir |
| `combat/costume-fidelity.mjs` | 51 revues individuelles et corrections de cadrage des costumes |
| `combat/sprite-catalog.mjs` | Inventaire des atlas dérivé des tables CainOS |
| `combat/render.mjs` | Rendu Canvas, extraction/cadrage en cache, effets, décors |
| `combat/render-presentation.mjs` | Détourage conservateur et identité visuelle des projectiles/pièges |
| `combat/render-poses.mjs` | Origines des 56 cellules animées et présentation des états sans modifier les règles |
| `combat/render-sequences.mjs` | 70 séquences procédurales finies et résultats neutres en cas d’égalité |
| `combat/render-stage-motion.mjs` | 12 couches d’ambiance déterministes, limitées à l’arrière-plan au-dessus du sol |
| `combat/training.mjs` | Vitesses, gel, historique, relevé de phases et bande manuelle de 600 images |
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

[`DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) possède **dix
feuilles et neuf tableaux filtrables** : Synthèse, Fonctionnalités, Combattants, Techniques, Arènes, Atlas,
Production, Scénarios, QA et Références. Le générateur
[`build-combat-workbook.mjs`](../scripts/build-combat-workbook.mjs) lit les catalogues,
les 56 chapitres, les thèmes/effets et les preuves de tests réellement disponibles.
Les statuts « Implémenté », « Partiel », « Prévu » et « À vérifier » distinguent
fonctionnement, finition et validation. Les notes utilisateur, filtres, formules
et critères de réception permettent de poursuivre le suivi après cette PR.
Les feuilles Combattants, Techniques et Arènes exposent les sources, traits
observés, adaptation, statut et périmètre de revue, sans déplacer les colonnes
de statut utilisées par les formules existantes. Atlas ajoute les 51 examens
individuels : huit champs techniques et cinq champs de référence, en conservant
les colonnes A:S ; les notes utilisateur restent éditables en colonne AG. Les deux arènes sans source
canonique sont identifiées explicitement. Le suivi contient **98 fonctionnalités,
472 tâches de production, 85 scénarios et 387 lignes QA** : 235 cas Node,
114 contrôles navigateur et 38 objectifs de revue. Les statuts sont **381 « Réussi »,
2 « À vérifier » et 4 « Non exécuté »**. Les deux revues ouvertes concernent la
sélection et le duel individuel de chacun des quatorze combattants de base, ainsi
que la comparaison canonique exhaustive. Les quatre essais non exécutés portent
sur un téléphone physique, deux manettes, le parcours clavier exhaustif et un
matériel modeste. Les objectifs de revue peuvent recouper les cas automatisés ;
le total de lignes ne désigne pas autant de tests indépendants.

## Vérifications et limites pratiques

`npm run qa` exécute les audits CainOS existants, les tests comportementaux du
moteur et de la session, les vérifications de syntaxe et les deux assemblages.
Les cas couvrent les 140 techniques, tous les combattants, les collisions, les
coûts, les combos, les transitions de manches, le déterminisme, les sauvegardes et
les défis. Les résultats détaillés sont consignés dans le suivi QA et les rapports.

La validation Node consignée pour 0.5.0 compte **235 tests réussis** dans quatorze
suites. Chaque fichier a été exécuté directement avec Node ; les noms et comptes
proviennent du résultat réel de chaque cas, et non du seul nombre de fichiers
annoncé par un lanceur. Les empreintes du runtime et des illustrations restent
identiques entre le début et la fin de cette exécution.

| Suite | Cas réussis | Périmètre |
| --- | ---: | --- |
| [`combat-engine.test.mjs`](../tests/combat-engine.test.mjs) | 40 | Simulation, techniques, collisions, ressources, manches et déterminisme |
| [`combat-session.test.mjs`](../tests/combat-session.test.mjs) | 32 | Profils, migration, replays versionnés, défis, entrées de combat et récupération d’un checkpoint incompatible |
| [`combat-catalog.test.mjs`](../tests/combat-catalog.test.mjs) | 9 | Classification des 179 apparences, des 51 costumes et validation des 17 découpes propres |
| [`combat-bindings.test.mjs`](../tests/combat-bindings.test.mjs) | 16 | Remappage, conflits, pressions brèves, navigation et déconnexion manette |
| [`combat-progression.test.mjs`](../tests/combat-progression.test.mjs) | 19 | 14 routes, tournoi, checkpoints, santé, reprises et imports incohérents |
| [`combat-audio.test.mjs`](../tests/combat-audio.test.mjs) | 14 | Opt-in, volumes, contexte simulé, voix bornées, interruptions et destruction |
| [`combat-offline.test.mjs`](../tests/combat-offline.test.mjs) | 14 | Échecs et délai d’installation, reprise, appels simultanés, worker actif et nettoyage des ressources |
| [`combat-fidelity.test.mjs`](../tests/combat-fidelity.test.mjs) | 15 | Registre de 217 fiches, revues propres aux costumes, règles héritées exactes, trajectoires des reculs et bords du ring |
| [`combat-render.test.mjs`](../tests/combat-render.test.mjs) | 12 | Détourage conservateur, transparence native, objets distincts et identité après réflexion |
| [`combat-render-matte.test.mjs`](../tests/combat-render-matte.test.mjs) | 5 | Couleurs protégées de Gangle, silhouettes Shadow et modes de détourage séparés |
| [`combat-render-poses.test.mjs`](../tests/combat-render-poses.test.mjs) | 18 | Recalage des 56 cellules, deux postures basses articulées, Jax intact et absence de mutation de la simulation |
| [`combat-rules.test.mjs`](../tests/combat-rules.test.mjs) | 16 | Quatre corrections 0.5.0, 56 traces CPU héritées, règles choisies par replay, avance d’une image et mannequin manuel |
| [`combat-training.test.mjs`](../tests/combat-training.test.mjs) | 14 | Limite 600 images, historique, phases, gel, vitesses, enregistrement relatif, lecture unique/bouclée et remise en place |
| [`combat-render-sequences.test.mjs`](../tests/combat-render-sequences.test.mjs) | 11 | 70 séquences finies, égalités neutres, 12 ambiances, mouvement réduit, clipping et absence de mutation |

Les treize suites navigateur finales totalisent **114 contrôles réussis** :

| Script | Résultat consigné pour 0.5.0 |
| --- | --- |
| [`combat-encore-browser.mjs`](../tests/combat-encore-browser.mjs) | **8/8 vérifications**, **9 duels réellement joués** : histoire de Jax complète, reprise, tournoi gagné/perdu, défaite/revanche et remplacement du checkpoint |
| [`combat-offline-browser.mjs`](../tests/combat-offline-browser.mjs) | **11/11 vérifications** : remappage réel, WebAudio, combo courant, pause, pack 42/42, recharge sans réseau, mise à jour conservant le pack, portée du worker, libération du cache et réglages à 390 px |
| [`combat-browser.mjs`](../tests/combat-browser.mjs) | **12/12 vérifications** : navigation, codex/archives, réglages, clavier J1/J2, pause, défi, calibration et lancement dans le build CainOS, trois fermetures/réouvertures du même duel et tactile à 390 px |
| [`combat-progression-browser.mjs`](../tests/combat-progression-browser.mjs) | **15/15 vérifications** : 21 résultats joués (local 1, arcade 6, boss 4, survie 10), replay exact, trois médailles, présentation différée/passage direct, sauvegarde immédiate et attribution unique, export/réimport du même profil, rechargement et distribution autonome |
| [`combat-profile-recovery-browser.mjs`](../tests/combat-profile-recovery-browser.mjs) | **5/5 vérifications** : checkpoint incompatible au démarrage et entre deux onglets, persistance des réglages et du profil, défi Spécialiste réellement accompli, import invalide refusé |
| [`combat-recovery-browser.mjs`](../tests/combat-recovery-browser.mjs) | **3/3 vérifications** : erreur HTTP 503 pendant la première installation, nouvelle tentative dans l’interface, profil conservé et rechargement sans réseau après téléchargement du pack |
| [`combat-fidelity-browser.mjs`](../tests/combat-fidelity-browser.mjs) | **10/10 vérifications** : sources des 166 fiches de base, clavier, 12 aperçus, premières scènes des 14 histoires, reculs hérités/actuels, piège bas 0.4.0/0.5.0, répétition/export et vues à 390 px |
| [`combat-render-browser.mjs`](../tests/combat-render-browser.mjs) | **7/7 vérifications** : détourage de Kaufmo, couleurs des 14 premières poses idle, alpha des 7 poses animées, 12 décors, 20 projectiles/10 pièges, états masqués et mouvement réduit |
| [`combat-costume-browser.mjs`](../tests/combat-costume-browser.mjs) | **8/8 vérifications** : 51 portraits et fiches propres, choix J1/J2 indépendants, changements rapides, clavier, entraînement sans modifier le profil et tactile à 390 px |
| [`combat-render-poses-browser.mjs`](../tests/combat-render-poses-browser.mjs) | **10/10 vérifications** : 56 cellules, 14 bases × 12 états, 51 tenues sans rig, deux postures basses, caches séparés et simulation intacte |
| [`combat-training-browser.mjs`](../tests/combat-training-browser.mjs) | **8/8 vérifications** : gel/+1 image, répertoire/reset, trois vitesses, jauges indépendantes, enregistrement réel J2, lecture unique et deux boucles, limite 600, six mannequins et profil/replay inchangés à 390 px |
| [`combat-render-sequences-browser.mjs`](../tests/combat-render-sequences-browser.mjs) | **8/8 vérifications** : 70 séquences visibles et finies, mouvement réduit, égalités neutres, 12 couches animées, pixels du sol inchangés et absence de mutation |
| [`combat-render-jax-browser.mjs`](../tests/combat-render-jax-browser.mjs) | **9/9 vérifications** : source RGBA versionnée, huit cellules et racines, familles de palette, conservation des pixels opaques et de l’alpha, fonds blanc/cyan/sombre et dessin intact dans les deux directions |

Les treize rapports finaux ne contiennent aucune erreur JavaScript consignée.
Dans la suite de progression, les vingt victoires CPU vérifient le délai de résultat
de 2,2 secondes ; le duel local vérifie son passage direct. Les données du profil
sont déjà présentes avant l’ouverture de la modale et ne sont attribuées qu’une
fois. Les trois médailles arcade, boss et survie sont conservées après export,
réimport et rechargement du même profil.
Le contrôle WebAudio vérifie son fonctionnement dans Chromium sans constituer une
écoute humaine. Les assertions, rapports et limites sont réunis dans
[`combat-qa-evidence.json`](combat-qa-evidence.json) ; les rapports navigateur bruts
sont écrits sous `audit-combat/`. Ces 114 contrôles ne signifient pas que les
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
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-fidelity-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-costume-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-render-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-render-poses-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-training-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-render-sequences-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-render-jax-browser.mjs
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` permet de choisir un exécutable Chromium
existant. Les parcours de jeu passent par l’interface publique, les commandes et
une vue de lecture de l’état. Les suites de rendu emploient également des
scènes Canvas de test et des acteurs synthétiques, sans modifier la simulation.
Les deux suites hors ligne servent elles-mêmes le dossier `dist-combat/`, produit
auparavant par `npm run build:combat`, et pilotent la disponibilité du réseau ainsi que le
cycle du service worker.

Les sept planches animées du projet fournissent les dessins de repos, marche,
parole, interaction et réaction réutilisés selon les états décrits plus haut.
Les autres personnages et les costumes conservent des sprites entiers avec
transformations procédurales rigides. Les animations de combat dédiées, portraits finaux, ambiances sonores et voix,
motifs sonores encore partagés et réglage du mix restent suivis comme partiels ou
prévus. Les 12 thèmes musicaux synthétiques sont livrés ; ils ne remplacent pas la
validation artistique et matérielle de toute la bande sonore.

Le réseau/rollback, les équipes et assists, la coopération contre boss, les
campagnes par épisode, les finishers cinématiques, la synchronisation cloud,
l’économie/déblocage, les paquets natifs et l’équilibrage compétitif complet ne sont
pas livrés. La reprise du noyau CQC ne signifie pas que toutes ses extensions
Metal Gear ont été portées. L’audit d’accessibilité complet, la lecture daltonisme,
la comparaison canonique exhaustive des 51 costumes et la vérification du lore
étendu restent également dans le classeur. L’inspection technique des 51 tenues
est réalisée ; les sept comparaisons visuelles primaires consignées ne certifient
pas la conformité de l’ensemble de leurs détails.

Les contrôles à 390 px vérifient une fenêtre tactile émulée ; ils ne valent pas
certification sur téléphone physique. De même, les routes testées et les résultats
automatisés ne constituent pas une certification commerciale de toute la production.

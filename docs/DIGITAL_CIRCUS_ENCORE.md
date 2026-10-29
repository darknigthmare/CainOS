# Digital Circus — Encore · Le Grand Duel

Version jouable : **0.7.0** — finalisation du 24 octobre 2026.

Encore partage son moteur entre l’application CainOS et le jeu autonome :
**14 combattants, 140 techniques, 12 arènes, 9 modes, 51 costumes et 179 archives**.
La version 0.7.0 ajoute **42 finales de spectacle**, trois pour chacun des quatorze
combattants, une galerie avec les **51 costumes**, douze ambiances sonores procédurales
et deux signaux distincts pour les pièges et les KO. Les finales sont des compositions
originales Encore utilisant les dessins existants, sans nouveaux sprites de combat dédiés.

La version 0.6.0 avait corrigé vingt apparences, reconstruit trois décors et ajouté
84 tableaux narratifs ainsi que 56 briefings. Ces ajouts restent présents.
La simulation demeure celle de 0.5.0 : les replays 0.5, 0.6 et 0.7 utilisent exactement
les mêmes règles, tandis que les versions 0.1 à 0.4 gardent leurs règles historiques.
**La fidélité canonique générale 1:1 n’est pas certifiée.** Le suivi distingue les
compositions jouables, les vérifications techniques et les comparaisons artistiques
encore incomplètes.

## Ajouts de la passe 0.7.0

### Menus, commandes et sons de contact

Dans les groupes de modes, combattants, arènes, fiches et finales, les flèches
déplacent le focus. **Début / Fin** rejoignent le premier ou le dernier choix.
**Tab**, **Maj + Tab**, **Entrée** et **Espace** gardent leur fonctionnement natif.
Changer un personnage, une scène, un filtre ou une tenue conserve le focus sur
la commande correspondante. La fermeture d’une boîte de dialogue revient à son
déclencheur quand il reste disponible. Les touches des listes déroulantes et des
champs texte continuent d’agir dans ces champs.

La manette peut ouvrir les détails des références et en parcourir les liens.
Les champs de recherche sont réservés à la saisie clavier et exclus de son
parcours pour éviter d’y bloquer le focus. La navigation active et les choix de
joueur et de combattant disposent de libellés d’état accessibles.

Trois défauts d’entrée sont corrigés : une touche maintenue à travers une pause
ne redémarre plus une attaque par répétition automatique ; le dash sur **Ctrl
droite** de J2 ne bloque plus les attaques des deux joueurs ; **Espace / Entrée**
activent les boutons de la barre de combat sans déclencher un saut.

Le catalogue sonore contient **26 motifs**, dont six contacts distincts : léger,
fort, bas, saisie, spécial et super. La garde, les parades et le KO restent
identifiables ; le son dépend des événements réellement résolus. La vérification
des signaux numériques ne remplace pas un mixage et une écoute sur appareil.

La galerie suspend son horloge dès que l’onglet ou sa fenêtre CainOS est masqué.
Le retour n’ajoute plus de temps caché à la scène. Modifier la préférence de
mouvement réduit recalcule le rendu même si la présentation est déjà arrêtée.

L’apparence originale de **Gloink Queen** réutilise désormais la planche RGBA
isolée de sa variante corrigée en 0.6. Le rectangle opaque de l’ancienne source
disparaît des portraits, du combat et de la galerie. L’identité, l’orientation,
les dimensions visuelles et les collisions de **420 × 150** restent inchangées.
L’image historique reste dans le dépôt ; le pack du jeu n’en a plus besoin et
contient maintenant **44 planches / 52 167 739 octets**.
[Voir la comparaison avant/après](COMBAT_GLOINK_QUEEN_0.7.0.md).

Les nouvelles suites `combat-accessibility-browser.mjs` et
`combat-input-browser.mjs` parcourent ces commandes par l’interface. Les
manettes sont simulées et le format mobile est émulé dans Chromium ; ces essais
ne constituent pas une vérification de lecteur d’écran ni de matériel physique.

### Finales de spectacle

Un KO qui termine effectivement la rencontre peut afficher la finale du vainqueur.
Le dernier impact valide détermine sa famille : attaque ordinaire, technique spéciale
ou super. La présentation dure trois, trois secondes et demie ou quatre secondes,
sans nouvelle action à saisir. Une égalité, une limite de temps, une manche
intermédiaire, l’entraînement, les défis et la lecture d’un replay n’en déclenchent pas.

Le résultat, la progression et le replay sont enregistrés avant la présentation.
Le bouton **Voir le résultat** permet de l’écourter. Le réglage **Finales après un KO**
désactive cette présentation ; le mouvement réduit utilise une composition fixe.
Le nombre de victoires, les dégâts, les récompenses et les règles restent inchangés.

Dans le **Codex**, chaque combattant possède un accès à ses trois finales. La galerie
permet de changer de scène et de tenue, de mettre en pause, de reprendre et de rejouer.
Elle utilise une scène indépendante : elle ne joue aucun duel, ne donne aucune récompense
et ne remplace pas le dernier replay. Échap ferme l’aperçu.

Les motifs et les limites de référence sont détaillés dans
[COMBAT_FINISHERS_0.7.0.md](COMBAT_FINISHERS_0.7.0.md).
Les accessoires de scène sont dessinés de façon procédurale ; les personnages
conservent leurs illustrations et leur alpha. Ce lot ne représente ni 42 attaques
canoniques ni 42 animations de corps dessinées.

Les captures des compositions finales sont réunies sur deux planches :
[Pomni à Caine](images/finishers-0.7.0-a.jpg) et
[Bubble à Baron Mildenhall](images/finishers-0.7.0-b.jpg).

### Ambiances sonores des douze arènes

Chaque arène possède une couche d’ambiance synthétisée localement, indépendante de
la musique. **Ambiances** et **Volume de l’ambiance** sont conservés dans le profil.
Les pièges et les KO ont des signaux spécifiques. Aucun fichier vocal ou musical
officiel n’est ajouté : ces sons sont des créations du jeu.

La suspension du jeu et les changements de scène doivent libérer ou suspendre les
voix concernées. La vérification audio contrôle le rendu WebAudio, les niveaux et
le cycle de vie ; elle ne remplace pas une écoute artistique ni un mixage final.

### Preuves et livraison

La CI de cette passe produit les sorties réelles des tests Node, les rapports
Chromium et deux planches de la galerie. Le classeur est mis à jour et vérifié
avec le moteur tableur principal. La CI contrôle ensuite son empreinte, celles
du jeu et des tests avant d’assembler l’archive autonome. Un classeur périmé
bloque la production de l’archive et laisse un rapport « suivi à actualiser ».
Le rapport **combat-qa-evidence-0.7.0.json** identifie le commit testé et les empreintes
des sources. Le fichier **combat-qa-evidence.json** conserve la campagne historique
0.6 ; ses contrôles artistiques non rejoués ne sont pas renommés en contrôles 0.7.

Le classeur garde les notes par identifiant, les styles et les formules. Les finales
et ambiances sont suivies séparément des dessins de combat dédiés et du mixage.
La tâche générale des finishers reste partielle tant que ces éléments artistiques
ne sont pas terminés.

L’archive autonome contient le même runtime que CainOS, le classeur, les rapports
et trois lanceurs locaux nécessitant Python 3. La CI vérifie Linux/Chromium et la
syntaxe des lanceurs ; elle ne valide pas des paquets natifs Windows ou macOS.
Téléphone physique, manettes physiques et matériel modeste restent à tester.

## Fiabilité et repères sonores — suite du 29 octobre 2026

Les guides `audio-design` et `save-systems` sont appliqués au runtime commun.
La déchope possède désormais son propre motif `throwTech`, distinct de la parade.
Le motif `confirm` distingue une validation acceptée du bref son de sélection :
réaffectation ou réinitialisation des touches sauvegardée, import confirmé,
conservation d’un profil récupéré et reprise du combat. Un refus de stockage ou
un import rejeté/annulé ne déclenche pas une confirmation de réussite.
Ces motifs sont des compositions originales ; le mixage sur plusieurs appareils
et les voix restent à produire ou vérifier.

Après une sauvegarde principale réussie, le jeu conserve aussi une copie locale
sous `cainos.circus-combat.profile.v1.backup`, lorsque le stockage le permet.
Si le profil principal présent est illisible, une copie de secours valide peut
rétablir les réglages, le palmarès, les récompenses et le parcours. Le jeu affiche
alors une notice persistante sur l’accueil et dans les réglages : le joueur peut
exporter cette copie ou la conserver explicitement. La lecture seule ne réécrit
aucun enregistrement. Une sauvegarde courante ou une conservation explicite
réussie répare le profil principal et retire cette notice.

La copie peut être plus ancienne si sa dernière mise à jour a été refusée. Une
copie de secours n’est pas restaurée quand le profil principal a été supprimé.
Un refus d’écriture du profil principal garde le secours intact et permet
l’export des données en mémoire. Si un autre onglet rend le primaire illisible, la session déjà ouverte
conserve son profil valide en mémoire, même si un secours plus ancien existe.
Une notice distincte signale cette conservation en mémoire ; la lecture d’un
secours au démarrage reste une récupération. Le rafraîchissement avant une
nouvelle récompense ne remplace pas non plus la session par un ancien secours.
Le format reste en version 1 ; les règles de simulation et de replay sont
inchangées. Pour une copie indépendante du navigateur, utiliser l’export JSON.

Les suites `combat-session-backup`, `combat-profile-backup-browser` et les suites
audio couvrent ces comportements. La campagne complète et le classeur indiquent
les résultats réellement exécutés ; une sortie PCM automatique ne remplace pas
une écoute sur un appareil physique.

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
autonome, son point d’entrée et les **44 planches utilisées par le jeu**, soit
**52 167 739 octets d’illustrations**. Le manifeste ne copie que les images utilisées ;
les PNG historiques restent conservés dans le dépôt. Ce second dossier peut être hébergé
indépendamment de CainOS. Les scripts
[`build-combat.mjs`](../scripts/build-combat.mjs) et
[`build-combat-offline.mjs`](../scripts/build-combat-offline.mjs) assemblent ces
fichiers et régénèrent l’inventaire hors ligne. L’empreinte du code 0.7 est inscrite
dans `OFFLINE_VERSION` du manifeste généré et dans les preuves de la livraison.
Celle des illustrations conservées est **`ART_VERSION = 05a3fc712a39e1d8`**.

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
| Derrière le rideau | 14 histoires originales, chacune avec trois tableaux de prologue, quatre rencontres et trois tableaux de fin ; 84 tableaux et 56 briefings au total |
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

### Lire et revoir les histoires

Chaque route a un prologue de trois tableaux et un épilogue de trois tableaux,
soit **84 tableaux** pour les quatorze artistes. Les 56 scènes d’avant-combat
composent aussi le décor et les portraits avec le texte. Le lecteur propose
précédent, continuer, passer et quitter, avec navigation clavier, retour manette,
présentation mobile et mouvement réduit. Une fin n’est consultable librement
qu’après son déblocage ; sa relecture ne redonne ni médaille ni victoire.

Ces tableaux utilisent les décors et portraits existants. Ce sont des compositions
narratives originales, sans nouvelle image raster narrative ni doublage. Les
quatre adversaires, règles, récompenses et checkpoints de chaque route sont
conservés. Kaufmo n’est pas guéri et ne reçoit pas une voix inventée ; la route
de Gummigoo se présente comme une simulation, sans affirmer son retour canonique.
Voir [`story-presentation.mjs`](../combat/story-presentation.mjs),
[la revue narrative](combat-story-review-0.6.0.json) et
[les quatorze compositions](images/encore-story-14-routes-0.6.0.png).

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
arrangement allégé du thème de la grande piste. Les motifs d’effets couvrent les impacts, blocages, parades, brisures, déplacements,
techniques, récupération, résultats et actions de menu. L’application choisit un
effet prioritaire parmi les événements simultanés.

La musique est **désactivée par défaut**. Son activation et son volume sont séparés
des bruitages ; son volume initial est de 20 %. La première interaction autorisée
débloque WebAudio. Les pauses et le masquage arrêtent les voix en cours ; une seule
horloge musicale et une limite de 24 voix bornent les ressources. Si le navigateur
refuse l’audio, le combat reste utilisable.

Ces sons sont synthétisés localement : aucune musique ni voix enregistrée de la
série n’est importée. Les **26 motifs d’effets** comprennent six sons de contact
distincts : léger, lourd, bas, saisie, spécial et super. Ils sont déclenchés par
un impact réel ; un coup bloqué ou une préparation de super conserve son propre
signal. La version 0.7 ajoute aussi douze ambiances procédurales, avec un volume
indépendant initial de 35 %, ainsi que les signaux piège et KO.
Les voix, les éventuels enregistrements d’ambiance et les essais de mixage
sur appareils physiques restent suivis dans le classeur.

## Installation web et hors ligne

Sous HTTPS ou localhost, ouvrir **Réglages → Télécharger le spectacle** puis
attendre la confirmation **44/44 illustrations**. Le pack correspond exactement aux
**52 167 739 octets** de [`combat/offline-manifest.mjs`](../combat/offline-manifest.mjs).
Le numéro exact de la livraison figure dans `OFFLINE_VERSION` de ce manifeste.
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
aucun résultat au palmarès. Les replays **0.1.0, 0.2.0, 0.3.0, 0.4.0, 0.5.0, 0.6.0 et 0.7.0** sont acceptés ; un ancien
replay sans costumes utilise les apparences originales. Une variante doit
correspondre au combattant indiqué. La version originale reste dans le fichier
validé et exporté. `getReplayFighter` sélectionne les anciens reculs instantanés
de Pomni/Kaufmo pour les versions 0.1.0 et 0.2.0 ; les nouveaux combats et les
replays 0.3.0 à 0.7.0 emploient leurs reculs continus. La fonction
`replayRulesVersion` choisit les règles de simulation : 0.1.0 à 0.5.0 conservent
leur version, et **0.6.0 ainsi que 0.7.0 utilisent 0.5.0**. Le numéro original
du fichier est conservé à l’export. Les corrections de règles ne changent pas rétroactivement une ancienne
simulation ; quatorze traces de 900 images vérifient aussi la parité 0.5/0.6/0.7. Les 140 techniques et les
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
La version 0.5.0 a été fusionnée par la [PR #3](https://github.com/darknigthmare/CainOS/pull/3)
au commit `4a56f6358000cd7ad0838e45f5385ec516432514`. La présente version part de
cette base sur la branche `feat/encore-0-6-fidelity-completion`.

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

## Fidélité visuelle et présentation 0.6.0

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
durées sont bornées ; la présentation finale ordinaire couvre **132 images à 60 Hz**.
Le passage à la phase de combat reste commandé par le moteur. Une fois leur durée atteinte,
elles restent sur leur pose de fin. Une égalité conserve une pose neutre.

L’horloge de présentation est séparée du moteur. À la fin d’un match, le profil,
le replay et le prochain point de reprise sont enregistrés immédiatement ; la
modale de résultat arrive après **2,2 secondes** pour la présentation ordinaire.
Une finale de spectacle 0.7 éligible utilise sa durée propre : **3, 3,5 ou 4 secondes**.
Le mouvement réduit conserve une composition fixe et le délai de **2,2 secondes**.
**Voir le résultat** permet de passer directement à cette modale. Ce choix
n’attribue pas une seconde récompense.
Le mouvement réduit affiche des poses fixes dès que la préférence du système
ou le réglage du jeu est activé. Un changement de préférence système prend effet
pendant le jeu, sans modifier le choix sauvegardé dans le profil. Le masquage du
jeu suspend aussi l’attente de présentation.
[Voir les 70 présentations](images/encore-outcome-sequences.png).

### Ambiances des douze arènes

[`combat/render-stage-motion.mjs`](../combat/render-stage-motion.mjs) ajoute une
couche propre à chaque décor : lueurs de piste, poussière de sucre, bougies,
vapeur, présences du cellier, reflets du Vide, ondes du lac, balayage de calibration,
formes des Gloinks, scintillements du palais, nuages et veilleuses du couloir.
Les coordonnées sont déterministes et les effets restent derrière les acteurs,
strictement au-dessus de **y = 568**. Les pixels de la piste sont identiques au
fond statique. Le mode mouvement réduit fige ces douze couches.

Ces ambiances restent des adaptations du jeu. La vapeur de Spudsy suit maintenant
la cuisson, les lueurs du couloir ses plafonniers et celles du manoir ses six
chandelles. Les neuf autres fonds statiques restent identiques à la version 0.5.0.
[Voir les douze arènes actuelles](images/encore-stages-0.6.0.png).

### Trois décors reconstruits

| Décor | Correction 0.6.0 | Référence et limite |
| --- | --- | --- |
| Couloir des résidents | Portes de bois à médaillons de visages, bandes roses/rouges/orange, tapis rouge, cadres et perspective du couloir | Deux copies attribuées au pilote, hébergées sur Fandom/X. Observation secondaire explicitement étiquetée ; confirmation sur une source primaire encore attendue. |
| Spudsy’s | Menus jaunes et bordeaux, comptoir blanc/rouge, cuisine inox ouverte et logo rond | Miniature officielle Netflix consultée, 300 × 169 px. Les détails fins restent limités par la résolution. |
| Palais de sucre | Arcades, colonnes au premier plan, fenêtres en retrait et volutes de glaçage | Image de la galerie officielle GLITCH consultée ; perspective adaptée au duel horizontal. |

La ligne de combat **y = 568** et les collisions sont inchangées. Le dessin du sol
des trois scènes évolue avec leur architecture ; les ambiances n’en modifient
aucun pixel entre deux images. Les acteurs restent au premier plan, sans altération de leur transparence. Les trois fiches sont marquées comme comparaisons partielles ; la correction
des architectures ne certifie pas leur reconstruction 1:1.
[Avant/après](images/encore-stage-comparison-0.6.0.png) ·
[Rapport et sources](combat-stage-review-0.6.0.json).

### Revue des 51 costumes et vingt remplacements

Les 51 variantes gardent leur identité et leur kit. **Vingt apparences** utilisent
désormais cinq nouvelles planches RGBA de 1536 × 1024 pixels. Le rendu emploie
**33 rectangles explicites** au total, avec alpha natif pour les vingt nouvelles
extractions. Les PNG originaux et leurs données d’archive sont conservés.

| Groupe | Corrections livrées |
| --- | --- |
| Maid Jax | Cœur violet, bas blancs, coiffe, tablier et chaussures à nœuds noirs. |
| Work Gangle | Chemise gris bleu claire, cravate pâle, badge, masque denté et étoile jaune ; bras de rubans. |
| Spudsy Ragatha | Visière, uniforme gris foncé, badge clair, œil en bouton bleu et paupière violette. |
| Comedy / Tragedy Gangle | Extrémités de rubans rouges sans mains humaines ; masque triste entier, non fissuré, sans fragments au sol attachés. |
| Anime Gangle | Yeux noirs, tenue marine et sac sombre ; fleur, pétales et étoiles dorées retirés. |
| Sept Shadows | Corps noirs préservés sur véritable transparence ; disparition des rectangles à damier et séparation des voisins. |
| Trois Horror Pomnis et Hunter Jax | Silhouettes entières, sans rectangles sombres ni lignes de fond. |
| Rhino Gangle / Gloink Queen Scale | Socle végétal retiré pour Rhino ; reine isolée des petits Gloinks et du fragment voisin. Le nom « True Scale » ne mesure pas une taille canonique. |
| Inert Bubble | Centre réellement translucide, yeux sombres conservés, aucune ombre au sol entraînée. |

Les six premières comparaisons de détails sont fondées sur des photos de produits
officiels GLITCH réellement inspectées. Elles restent partielles : elles ne
certifient pas tous les angles, proportions, expressions ou plans des épisodes.
Les quatorze réparations techniques restantes ne créent pas de source canonique
pour les variantes du projet. Les contours et poses régénérés sont des adaptations
en pixel art, toujours affichées comme personnages entiers en combat.

La [planche actuelle](images/costumes-0.6.0.png), le
[rapport avec mesures et empreintes](combat-costume-review-0.6.0.json) et le
[brief artistique](COMBAT_ART_BRIEF_0.6.0.md) documentent ce travail. Chaque tenue a
été ouverte dans la garde-robe, lancée en entraînement et a accepté une attaque
réelle au clavier, sans modifier le profil. Ce parcours ne signifie pas vingt
duels complets ni validation canonique.

Les cinq planches de revue 0.4 et [`combat-costume-review.json`](combat-costume-review.json)
sont des archives historiques. La recoloration locale de Gangle tragédie et les
trois cellules Shadow opaques de cette ancienne passe ne sont plus utilisées par
leurs apparences remplacées en 0.6.0. Les fonctions historiques restent testées.

Chaque fiche distingue l’examen technique du sprite de la comparaison à sa
référence. Le statut de revue est affiché dans l’interface ; une inspection de
transparence ou un simple lien d’épisode ne vaut pas approbation canonique.

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
| Pomni et Kaufmo | Recul réparti sur 15 images actives, respectivement −10 et −9 pixels/image | Reculs 0.3.0 conservés jusqu’en 0.7.0 ; anciens replays explicitement versionnés |

Les deux reculs gardent leurs distances et durées nominales : **150 pixels /
30 images pour Pomni**, **135 pixels / 36 images pour Kaufmo**. Les chiffres
actuels des kits sont comparés à l'empreinte publiée en 0.3.0 ; les kits hérités
restent comparés à la version 0.2.0.

Les aperçus de décor suivent aussi le premier chapitre des 14 histoires. Les
liens de référence sont facultatifs, sans dépendance réseau pour jouer.
Le lac reste sans source primaire précise ; la salle de calibration est une
création originale. La confirmation primaire du couloir des résidents, les animations de combat
dessinées spécifiquement et les écarts artistiques des costumes restent suivis. Les mesures
techniques et les tests ne constituent pas une certification canonique 1:1.

## Architecture des fichiers

| Fichier | Responsabilité |
| --- | --- |
| `combat/engine.mjs` | Simulation indépendante du navigateur et enveloppe fixe |
| `combat/data.mjs` | Combattants, kits actuels/hérités, arènes et variantes |
| `combat/fidelity.mjs` | Registre partagé des sources, observations, adaptations et périmètres à revoir |
| `combat/costume-fidelity.mjs` | 51 revues individuelles et corrections de cadrage des costumes |
| `combat/costume-refinements.mjs` | 20 remplacements à alpha natif, découpes, corrections et limites 0.6 |
| `combat/sprite-catalog.mjs` | Inventaire des atlas dérivé des tables CainOS |
| `combat/render.mjs` | Rendu Canvas, extraction/cadrage en cache, effets, décors |
| `combat/render-presentation.mjs` | Détourage conservateur et identité visuelle des projectiles/pièges |
| `combat/render-poses.mjs` | Origines des 56 cellules animées et présentation des états sans modifier les règles |
| `combat/render-sequences.mjs` | 70 séquences procédurales finies et résultats neutres en cas d’égalité |
| `combat/render-stage-scenery.mjs` | Architecture des trois décors reconstruits, sans modifier la surface de duel |
| `combat/render-stage-motion.mjs` | 12 couches d’ambiance déterministes, limitées à l’arrière-plan au-dessus du sol |
| `combat/training.mjs` | Vitesses, gel, historique, relevé de phases et bande manuelle de 600 images |
| `combat/input.mjs` | Clavier, tactile, manette et impulsions de commandes |
| `combat/menu-navigation.mjs` | Navigation des menus et restauration du focus |
| `combat/bindings.mjs` | Mappings J1/J2, conflits, libellés et nettoyage des imports |
| `combat/session.mjs` | Profils, migrations, replays, défis et compteurs testables |
| `combat/progression.mjs` | Programmes, checkpoints, santé de survie et tableau du tournoi |
| `combat/stories.mjs` | 14 routes originales, 56 chapitres et 84 tableaux de prologue/épilogue |
| `combat/story-presentation.mjs` | Composition narrative, ordre des tableaux et validation |
| `combat/audio.mjs` | Thèmes, ambiances, effets, volumes séparés et cycle de vie WebAudio |
| `combat/audio-ambiences.mjs` | Catalogue des 12 ambiances procédurales |
| `combat/finisher-catalog.mjs` | 42 finales, trois tableaux chacune, références et limites |
| `combat/finishers.mjs` | Sélection sur KO final et échantillonnage sans mutation de simulation |
| `combat/render-finishers.mjs` | Composition des accessoires et des dessins existants |
| `combat/finisher-gallery.mjs` | Aperçu indépendant, pause, reprise et mouvement réduit |
| `combat/offline.mjs` | Préparation du pack, installation et mise à jour proposées dans l’interface |
| `combat/sw.js` | Cache du jeu, cache d’illustrations versionné séparément et portée limitée |
| `combat/manifest.webmanifest` | Identité, point d’entrée et icônes d’installation web |
| `combat/app.mjs` | Menus, sélection, parcours, résultats et liaison avec l’OS |
| `scripts/build-combat.mjs` | Distribution statique indépendante |
| `scripts/build-combat-offline.mjs` | Inventaire, taille et empreintes du code et du pack d’illustrations |
| `scripts/build-combat-catalog.mjs` | Extraction reproductible du catalogue CainOS |
| `scripts/workbook-publication.mjs` | Publication avec sauvegardes, restauration et conservation des preuves en cas d’échec |
| `scripts/build-combat-workbook.mjs` | Génération du classeur et de ses données à partir des définitions livrées |
| `scripts/build-combat-workbook-current.mjs` | Import, mise à jour, recalcul et vérification du classeur avec le moteur tableur principal |
| `scripts/combat-workbook-current-data.mjs` | Données 0.7, identifiants stables et validation des preuves courantes |
| `scripts/combat-ci-suites.mjs` | Liste commune des suites navigateur attendues |
| `scripts/run-combat-ci.mjs` | Exécution et collecte des contrôles réellement rejoués |
| `scripts/package-combat-release.mjs` | Archive autonome, contrôle des empreintes et documents de livraison |
| `docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` | Classeur de production filtrable et éditable |

## Classeur de production

[`DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) comporte
**dix feuilles et neuf tableaux filtrables** : Synthèse, Fonctionnalités,
Combattants, Techniques, Arènes, Atlas, Production, Scénarios, QA et Références.
Il lit les catalogues réellement livrés, les 84 tableaux, les 56 briefings, les
20 remplacements et les preuves de tests. Les statuts « Implémenté », « Partiel »,
« Prévu » et « À vérifier » distinguent fonctionnement, finition et validation.

Le suivi historique 0.6 contenait **101 fonctionnalités, 632 tâches de production, 85 scénarios et
452 lignes QA** : 260 cas Node, 154 contrôles navigateur et 38 objectifs de
revue. Ses statuts QA étaient **447 « Réussi », 1 « À vérifier » et 4 « Non exécuté »**.
Le suivi 0.7 contient maintenant **102 fonctionnalités, 683 tâches de production,
85 scénarios et 1 003 lignes QA**. Il distingue les **551 cas automatisés courants**
(313 Node et 238 navigateur) des 452 lignes historiques ou objectifs de revue
conservés. Les statuts QA cumulés sont **999 « Réussi », 0 « Échec »,
3 « Non exécuté » et 1 « À vérifier »**. Les **39 formules** ont été recalculées
et leurs résultats contrôlés. Ces comptes figurent dans
`combat-workbook-verification.json` et la Synthèse.
Les objectifs peuvent recouper les tests ; les lignes ne représentent pas autant
de tests indépendants. La comparaison canonique exhaustive reste ouverte. Les
quatre essais historiques non exécutés concernaient un téléphone physique, deux
manettes physiques, tous les menus au clavier et un matériel modeste. La passe
0.7 ajoute une campagne clavier et manette simulée distincte ; les tests matériels
et l’évaluation avec un lecteur d’écran restent à faire.

Les notes sont restaurées par feuille et identifiant stable, même après tri.
La régression 0.7 contrôle dix notes sur huit onglets, dont deux formules R1C1,
un texte commençant par `=`, zéro et `false`, après tri de la feuille des
fonctionnalités. Une hauteur utilisateur de 180 points est conservée. Les notes
de cette fixture ne sont pas ajoutées au classeur final, qui n’en contenait pas.
Les neuf rejets d’entrées invalides de la campagne 0.6 restent des preuves historiques.

La publication prépare les quatre sorties courantes et sauvegarde tous les anciens contenus
avant le premier remplacement. Une erreur interceptée restaure les octets
précédents ou l’absence antérieure du fichier. Si cette restauration échoue, les
sauvegardes, le journal et le verrou sont conservés pour la récupération ; une
nouvelle génération est bloquée. Onze tests filesystem couvrent ces chemins,
dont huit combinaisons de présence et vingt-quatre pannes de renommage sur une
fixture de trois fichiers.

Cette publication ne donne pas une lecture simultanément atomique de plusieurs fichiers
à un autre processus et ne garantit pas une restauration après arrêt brutal du
système. Les limites de métadonnées et la procédure de récupération sont décrites
dans [COMBAT_WORKBOOK_PUBLICATION.md](COMBAT_WORKBOOK_PUBLICATION.md).

## Vérifications 0.7

La campagne complète du 24 octobre 2026 porte sur le commit
**`1073ce21525c771f598b56d7452eaeceb2ed9178`**. Elle se termine avec
**313 tests Node réussis dans 22 suites** et **238 contrôles Chromium réussis
dans 14 suites**. Les sources du jeu et de chaque test sont contrôlées avant
et après exécution. Le collecteur utilise son propre serveur local et vérifie
que celui-ci sert bien le code attendu.

| Partie de la campagne | Résultat et portée |
| --- | --- |
| Contrats, syntaxe et distributions | `npm run qa` réussi, CainOS et standalone reconstruits |
| Moteur, profils, audio, rendu et publication | 313 tests Node, 22 suites |
| Finales et galerie | 100 contrôles, 42 finales et 51 costumes parcourus |
| Audio | 22 contrôles des ambiances, effets, volumes et cycle de vie |
| Navigation et accessibilité | 28 contrôles clavier, focus, commandes natives, manette simulée et format mobile émulé |
| Commandes pendant le combat | Quatre parcours de régression : pause/répétition, Ctrl de J2 et activation native de la barre d’outils |
| Roster | 14 duels complets, sauvegarde/rechargement après chacun et replay terminal exact ; 10 contrôles agrégés |
| Progression | 20 victoires Arcade/Boss/Survie et un duel local, puis conservation des récompenses et import/export |
| Présentation narrative | 84 tableaux affichés, parcours de Jax, reprise et relecture sans double récompense |
| Hors ligne | 11 contrôles, téléchargement des 44 planches, rechargement sans réseau et mise à jour |

Les détails navigateur de ce tableau sont **inclus dans les 238 contrôles**.
Les essais ciblés de Gloink Queen et les réexécutions ne gonflent pas ce total.
Les preuves complètes, les noms des cas et les empreintes se trouvent dans
[`combat-qa-evidence-0.7.0.json`](combat-qa-evidence-0.7.0.json).

## Vérifications historiques 0.6 et limites pratiques

Les tableaux de cette section décrivent la campagne 0.6, conservée comme historique.
Les résultats de la passe 0.7 figurent dans `combat-qa-evidence-0.7.0.json`, avec
le commit, les noms des cas exécutés et leurs empreintes. Les deux campagnes ne
sont pas additionnées pour former un nombre de tests indépendants.

La campagne initiale `npm run qa` a réussi : audits CainOS, contrats, vérifications de syntaxe,
**260 tests Node dans 17 suites**, manifeste et deux builds. Chaque module de test
a ensuite été exécuté directement avec le reporter TAP ; les comptes et noms
proviennent des sorties réelles. Les empreintes du runtime et des illustrations
sont restées identiques pendant cette exécution.

| Suite Node | Réussis | Périmètre |
| --- | ---: | --- |
| [`combat-audio.test.mjs`](../tests/combat-audio.test.mjs) | 14 | 12 thèmes, effets, volumes et cycle de vie WebAudio |
| [`combat-bindings.test.mjs`](../tests/combat-bindings.test.mjs) | 16 | Remappage, conflits, pressions brèves et attribution manette |
| [`combat-catalog.test.mjs`](../tests/combat-catalog.test.mjs) | 9 | 179 identités, 51 tenues, 33 découpes et 20 remplacements |
| [`combat-engine.test.mjs`](../tests/combat-engine.test.mjs) | 40 | Simulation, techniques, ressources, collisions et déterminisme |
| [`combat-fidelity.test.mjs`](../tests/combat-fidelity.test.mjs) | 17 | 217 fiches, sources qualifiées, vingt corrections et reculs |
| [`combat-offline.test.mjs`](../tests/combat-offline.test.mjs) | 14 | Échecs, délai, nouvelle tentative et worker existant |
| [`combat-progression.test.mjs`](../tests/combat-progression.test.mjs) | 19 | 14 routes, tournoi, santé et checkpoints |
| [`combat-render-matte.test.mjs`](../tests/combat-render-matte.test.mjs) | 5 | Contrats historiques de palette et détourage ; fixtures explicites |
| [`combat-render-poses.test.mjs`](../tests/combat-render-poses.test.mjs) | 18 | 56 cellules, ancrages, deux rigs bas et simulation inchangée |
| [`combat-render-sequences.test.mjs`](../tests/combat-render-sequences.test.mjs) | 11 | 70 séquences, 12 ambiances et mouvement réduit |
| [`combat-render.test.mjs`](../tests/combat-render.test.mjs) | 12 | Transparence, objets distincts et réflexion |
| [`combat-rules.test.mjs`](../tests/combat-rules.test.mjs) | 17 | Règles versionnées, 56 traces historiques et parité 0.5/0.6 |
| [`combat-session.test.mjs`](../tests/combat-session.test.mjs) | 32 | Profils, migrations, replays 0.1–0.6, défis et récupération |
| [`combat-stage-scenery.test.mjs`](../tests/combat-stage-scenery.test.mjs) | 4 | Trois compositions bornées, couches et plan de combat |
| [`combat-story-presentation.test.mjs`](../tests/combat-story-presentation.test.mjs) | 7 | 84 tableaux, 56 briefings et relecture des fins |
| [`combat-training.test.mjs`](../tests/combat-training.test.mjs) | 14 | Gel, vitesses, bande 600 images et jauges indépendantes |
| [`combat-workbook-publication.test.mjs`](../tests/combat-workbook-publication.test.mjs) | 11 | Préparation, sauvegarde, restauration, absences et pannes filesystem |

La régression navigateur 0.6.0 totalise **154 contrôles réussis dans 18 suites**.
Les quatorze suites existantes ont été rejouées sur le nouveau runtime, avec quatre
suites supplémentaires pour les costumes, décors, tableaux narratifs et duels du
roster. Les rapports, empreintes des tests et limites sont réunis dans
[`combat-qa-evidence.json`](combat-qa-evidence.json).

| Suite navigateur | Réussis | Périmètre |
| --- | ---: | --- |
| [`combat-browser.mjs`](../tests/combat-browser.mjs) | 12 | Navigation, CainOS, pause/réouverture, commandes et tactile 390 px |
| [`combat-progression-browser.mjs`](../tests/combat-progression-browser.mjs) | 15 | 21 résultats joués, médailles, replay exact, export/import, standalone |
| [`combat-encore-browser.mjs`](../tests/combat-encore-browser.mjs) | 8 | 9 duels : Jax 4, tournoi 3, deux défaites et reprises |
| [`combat-offline-browser.mjs`](../tests/combat-offline-browser.mjs) | 11 | 45 images, remappage, audio, recharge sans réseau et mise à jour |
| [`combat-recovery-browser.mjs`](../tests/combat-recovery-browser.mjs) | 3 | Échec HTTP 503, nouvelle tentative et pack récupéré |
| [`combat-profile-recovery-browser.mjs`](../tests/combat-profile-recovery-browser.mjs) | 5 | Checkpoint incompatible, inter-onglets, import strict et défi |
| [`combat-fidelity-browser.mjs`](../tests/combat-fidelity-browser.mjs) | 10 | Codex, 12 décors, 14 débuts de route et replays versionnés |
| [`combat-render-browser.mjs`](../tests/combat-render-browser.mjs) | 7 | Kaufmo, palettes, alpha, 12 décors et objets du kit |
| [`combat-costume-browser.mjs`](../tests/combat-costume-browser.mjs) | 8 | 51 portraits et garde-robes, J1/J2, clavier et entraînement |
| [`combat-render-poses-browser.mjs`](../tests/combat-render-poses-browser.mjs) | 10 | 56 cellules, 14 × 12 états, 51 tenues et caches séparés |
| [`combat-training-browser.mjs`](../tests/combat-training-browser.mjs) | 8 | Gel/+1 image, vitesses, bande clavier, boucles, limite et 390 px |
| [`combat-render-sequences-browser.mjs`](../tests/combat-render-sequences-browser.mjs) | 8 | 70 séquences finies, 12 ambiances et sol courant intact |
| [`combat-render-jax-browser.mjs`](../tests/combat-render-jax-browser.mjs) | 9 | Huit cellules, racines, palette, alpha et trois fonds |
| [`combat-reduced-motion-browser.mjs`](../tests/combat-reduced-motion-browser.mjs) | 3 | Préférence système, bascules en direct et réglage du jeu |
| [`combat-costume-refinements-browser.mjs`](../tests/combat-costume-refinements-browser.mjs) | 8 | 20 essais réels, noir préservé, composantes et Bubble translucide |
| [`combat-stage-scenery-browser.mjs`](../tests/combat-stage-scenery-browser.mjs) | 9 | Trois décors, neuf fonds conservés, couches, clip et captures |
| [`combat-story-presentation-browser.mjs`](../tests/combat-story-presentation-browser.mjs) | 11 | 84 tableaux, 4 victoires Jax, reprise, relecture et mobile |
| [`combat-roster-browser.mjs`](../tests/combat-roster-browser.mjs) | 9 | 14 duels complets et rechargements, replay 0.6 exact |

Après la revue de la PR #4, le descriptif d’identité de Work Gangle a été
corrigé pour correspondre à son masque blanc souriant et denté. Le contrôle
statique confirme que les cinquante autres fiches et les cinq planches ne changent
pas. Sur le build corrigé, **26 cas Node existants**, **5 contrôles ciblés de
garde-robe** et **11 contrôles hors ligne réexécutés** réussissent ; les deux
distributions sont reconstruites avec le manifeste `0.6.0-6dcd5c6ee620`.
Le champ `postReviewDeltas` de la preuve QA conserve ces résultats séparément de
la campagne initiale 260/154, qui n’a pas été intégralement rejouée après ce
changement de texte. Les 452 lignes du classeur ne sont pas gonflées par ces
réexécutions.

Les 84 tableaux sont effectivement affichés et capturés. Les quatorze routes
sont couvertes par contrats ; la route narrative intégralement gagnée par les
commandes du navigateur est celle de Jax. Un duel Versus CPU complet a aussi été
joué pour chacun des quatorze combattants, avec sauvegarde, rechargement et
relecture exacte du dernier replay 0.6.0. Les vingt tenues corrigées ont chacune
été essayées dans un entraînement avec attaque réelle.

Les suites de rendu utilisent des scènes Canvas et des acteurs de test ; elles
ne prétendent pas être des matchs gagnés. Les suites de jeu emploient l’interface,
les commandes et une vue en lecture seule de l’état. Le WebAudio est vérifié dans
Chromium sans écoute humaine certifiée. Le mouvement réduit et le viewport mobile
sont émulés, sans validation de matériel physique.

### Reproduire les parcours navigateur

Construire le jeu puis démarrer le serveur à la racine du dépôt :

```bash
npm run build:combat
python3 -m http.server 4178
```

Dans un second terminal, chaque script `tests/combat-*-browser.mjs` peut être lancé
avec `COMBAT_TEST_URL=http://127.0.0.1:4178`. `tests/combat-browser.mjs` utilise le
même paramètre. Les deux suites offline/recovery servent elles-mêmes le dossier
`dist-combat/`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` choisit un Chromium existant.
Playwright doit être disponible dans l’environnement Node.

```bash
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-costume-refinements-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-stage-scenery-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-story-presentation-browser.mjs
COMBAT_TEST_URL=http://127.0.0.1:4178 node tests/combat-roster-browser.mjs
```

### Travail restant

Les dessins de combat dédiés, portraits finaux, revue canonique complète,
enregistrements d’ambiance et voix dédiées, mixage sur appareils et équilibrage compétitif restent
partiels ou prévus. Les 114 autres archives conservent leur statut sans kit livré.
Le lac n’a pas de source primaire précise ; la calibration est originale ; le
couloir attend une confirmation primaire malgré sa reconstruction.

Le réseau/rollback, tag/assists, coopération, campagnes par épisode, finishers
cinématiques avec nouvelles animations dessinées, synchronisation cloud des combats, économie/déblocages et paquets
natifs ne sont pas livrés. Reprendre le noyau CQC ne signifie pas reprendre toutes
ses extensions. Le classeur conserve ces manquants et leurs critères de réception.

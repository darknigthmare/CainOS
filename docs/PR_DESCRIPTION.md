# Digital Circus — Encore 0.3.0

Suite de la [PR #1](https://github.com/darknigthmare/CainOS/pull/1), fusionnée le
22 octobre 2026. Cette proposition part de `main` au commit
`53d56cf30484708af7c171babd3a05aa684d9a8a`.

## Pourquoi

CainOS intègre désormais **Digital Circus — Encore / Le Grand Duel**, adapté du
CQC du projet Metal Gear et jouable dans le bureau comme en standalone. Cette PR
complète cette première version avec les points de reprise, les histoires
individuelles, le tournoi, les commandes personnalisables, la musique originale
et une distribution web installable avec pack hors ligne. La passe 0.3.0 corrige
la présentation des personnages, décors et accessoires, documente les références
et préserve les règles des anciens replays. Le catalogue corrige
aussi la sélection des costumes et le HUD suit le combo en cours.
L’OS, le standalone et le classeur utilisent les mêmes définitions de contenu.

## Passe de fidélité 0.3.0

- **Détourage de Kaufmo corrigé.** La suppression du fond de l’atlas ne traverse
  plus son corps noir ni ses détails internes. Les illustrations originales
  restent intactes ; les cellules à transparence native conservent leur alpha.
- **Trois décors repris à partir de visuels GLITCH consultés.** Grande piste
  cyan/or avec canapés, porte arrondie et damier chaud ; cellier noir, yeux
  multicolores et lumière centrale ; Vide blanc irisé, sans le confondre avec
  le couloir EXIT ou l’espace sous la carte. Leur perspective reste adaptée au
  duel horizontal.
- **Objets de combat reconnaissables.** Clef, bouton, masque, pièces modulaires,
  rubans, confiseries, bulles et coussins ont des formes propres. Un projectile
  réfléchi garde son motif d’origine. Les effets ne modifient pas les collisions.
- **Reculs physiques pour Pomni et Kaufmo.** Quinze images actives de déplacement,
  respectivement 150 et 135 pixels nominaux, avec les mêmes durées totales de
  30 et 36 images. Les replays 0.1.0/0.2.0 sélectionnent leurs kits hérités exacts,
  et leur version reste conservée lors de l’export.
- **Registre commun de 166 fiches.** [`combat/fidelity.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/fidelity.mjs)
  relie 14 combattants, 140 techniques et 12 arènes aux repères observés,
  adaptations et comparaisons restant à faire. Deux décors sans source canonique
  précise sont identifiés explicitement. Le codex et l’Excel lisent ce registre.
- **Aperçus et sources dans l’interface.** La sélection montre le décor réel
  avant le duel. Le mode Histoire suit la première scène de chacun des 14
  parcours. Les références de personnage, de coup et de décor s’ouvrent à la
  demande au clavier ou au tactile.

Cette passe rapproche la présentation des références effectivement consultées.
Elle ne certifie pas une reproduction canonique complète : poses de combat,
accroupissement, proportions, couloir des résidents et 51 costumes restent à
comparer ou à finaliser. Les techniques et histoires sont des adaptations de
fan-game, identifiées comme telles dans chaque fiche.

## Contenu conservé depuis la version 0.2.0

- **Intégration CainOS et standalone conservée.** Icône **Circus Combat**, entrée du
  menu Démarrer, fenêtre chargée à la demande et pause lorsque le jeu est masqué.
  `npm run build` produit l’OS ; `npm run build:combat` produit `dist-combat/` avec
  les assets nécessaires et sans runtime CainOS.
- **Noyau CQC à 60 Hz conservé.** Garde haute/basse, saisies/déchopes, combos,
  parades, projectiles, ressources, effets d’état, IA déterministe et manches dans
  [`combat/engine.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/engine.mjs).
- **14 combattants, 140 techniques, 12 arènes, 51 costumes et 179 archives.** La
  classification explicite conserve 114 entrées sans kit : parents, rivaux,
  accessoires et effets ne deviennent plus des costumes par simple ressemblance
  de nom. Catalogue et règles : [`combat/data.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/data.mjs).
- **Neuf modes.** Versus CPU, duel local, arcade de six rencontres, boss de quatre
  rencontres, survie de dix vagues, entraînement, six défis, histoires et tournoi.
  Le mode histoire propose **14 routes et 56 chapitres**, avec introductions,
  dialogues et conclusions originaux. Le tournoi réunit **huit participants**,
  sept matchs de tableau et **trois victoires joueur** pour gagner ; les rencontres
  CPU simulées sont identifiées. Sources :
  [`combat/stories.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/stories.mjs) et
  [`combat/progression.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/progression.mjs).
- **Reprise des cinq programmes.** Arcade, boss, survie, histoire et tournoi
  sauvegardent l’entrée de la rencontre courante avec graine, règles, costume et
  santé initiale. Le résultat persiste l’étape suivante avant de proposer sa
  poursuite. Histoire/arcade/boss conservent les victoires lors d’une revanche ;
  une élimination en survie/tournoi redémarre une tentative.
- **Commandes adaptées aux deux joueurs.** AZERTY/QWERTY, 24 actions clavier
  remappables avec alternatives, conflits refusés et affichages mis à jour.
  Navigation manette dans les menus et réglages, pause des replays avec Start,
  attribution J1/J2 conservée après déconnexion, pressions brèves et multitouch.
  Sources : [`combat/bindings.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/bindings.mjs) et
  [`combat/input.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/input.mjs).
- **Musique et effets originaux.** **12 thèmes procéduraux** par arène, arrangement
  de menu, **16 motifs SFX** et sept alias. Musique désactivée par défaut, volumes
  indépendants, priorité des effets et ressources bornées. Le contexte WebAudio
  attend une interaction autorisée. Source : [`combat/audio.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/audio.mjs).

## Standalone installable et hors ligne

Le manifest et les icônes permettent l’installation web lorsque le navigateur la
propose. Les réglages téléchargent explicitement les **42 planches**, soit
**47 345 031 octets**, puis affichent leur disponibilité hors ligne. Le jeu peut
être relancé par son entrée directe `combat/index.html?standalone=1` ou son raccourci
installé. La redirection racine du build et le reste de CainOS ne sont pas mis en
cache par ce worker.

L’application d’une mise à jour en attente passe par l’interface. Le cache des
illustrations possède une empreinte distincte de celle du code : **une mise à jour
du code préserve le pack inchangé**. Les images modifiées demandent une nouvelle
préparation. Libérer ce cache conserve le profil et ses touches ; une erreur de
CacheStorage laisse la réponse réseau disponible. Sources :
[`combat/offline.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/offline.mjs), [`combat/sw.js`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/sw.js),
[`combat/offline-manifest.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/offline-manifest.mjs) et
[`scripts/build-combat-offline.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/scripts/build-combat-offline.mjs).

## Compatibilité et correctifs

Le profil local reste au format version 1. Les anciens profils conservent leurs
données reconnues et reçoivent les nouvelles valeurs par défaut. Les replays
**0.1.0, 0.2.0 et 0.3.0** restent acceptés ; l’absence de costumes dans un ancien replay
sélectionne les apparences originales. La lecture n’ajoute aucun résultat au
palmarès. Les anciens reculs de Pomni/Kaufmo sont conservés pour les replays
0.1.0/0.2.0 ; les nouvelles règles ne sont pas appliquées à ces enregistrements.
Le JSON exporte aussi les touches et le checkpoint ; un stockage refusé
conserve les résultats de la session en mémoire pour permettre leur export.
À la lecture locale, un checkpoint corrompu ou devenu incompatible est écarté
sans perdre le reste du profil. L’import explicite reste strict et refuse ce
checkpoint avant toute modification des données. La première installation hors
ligne signale désormais ses échecs et propose une nouvelle tentative dans les
réglages ; son attente est bornée à vingt secondes et un worker déjà actif reste
utilisable pendant une mise à jour.
Contrats : [`combat/session.mjs`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/combat/session.mjs).

Le port conserve les correctifs de garde après blockstun, annulation refusée,
déchope, dash arrière et portée des projectiles. Les portées de la reine suivent
son corps allongé. Les dialogues terminaux gardent leurs actions de continuation
après Échap. Le HUD efface le combo courant à la fin de l’enchaînement tout en
conservant le meilleur combo dans les résultats.

## Classeur inclus

[`DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) couvre dix
feuilles : Synthèse, Fonctionnalités, Combattants, Techniques, Arènes, Atlas,
Production, Scénarios, QA et Références. Les inventaires, 56 chapitres, thèmes,
effets et preuves de test proviennent des fichiers réels. Les fiches Combattants,
Techniques et Arènes ajoutent cinq champs de fidélité partagés avec le codex :
sources, observations, adaptation, statut et portée de revue. Les éléments livrés,
partiels, prévus et restant à vérifier ont des statuts distincts et des critères
de réception. Le classeur reste filtrable et éditable : **90 fonctionnalités, 389 tâches de
production, 85 scénarios et 267 lignes QA**, avec 34 formules et neuf tableaux.
Les lignes QA comptent 252 réussites, dix points à vérifier et cinq non exécutés ;
elles recoupent les tests ci-dessous et ne constituent pas 267 tests indépendants.

La provenance du moteur, les commandes et l’architecture sont détaillées dans
[`DIGITAL_CIRCUS_ENCORE.md`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/DIGITAL_CIRCUS_ENCORE.md). Références de départ :
port initial CainOS **4926834a2f063028903d6431e77f0bece859e671** ; base de
cette PR **53d56cf30484708af7c171babd3a05aa684d9a8a** ; CQC
**42279c1c884769873e66bbda0b6fe849bcd2f1a2**, branche
`codex/cqc-p38-archive-projectile-range`, intégrant la garde-robe P39.

## Validation consignée

- **166 tests Node réussis** : 40 moteur, 32 session, 7 catalogue, 16 commandes,
  19 progression, 14 audio, 14 initialisation hors ligne, 12 fidélité et 12 rendu. Les tests couvrent
  notamment les 140 techniques, les six défis, les 14 routes, les tableaux
  déterministes, la récupération du profil et les erreurs d’installation.
- **8/8 contrôles histoires/tournoi**, avec **9 duels réellement joués** via
  `tests/combat-encore-browser.mjs` : histoire de Jax achevée, tournoi remporté,
  élimination, reprise et revanche. Aucune erreur consignée dans ce rapport.
- **11/11 contrôles remappage/audio/hors ligne**, via
  `tests/combat-offline-browser.mjs` : commandes réelles, WebAudio, combo courant,
  pause, téléchargement complet, recharge sans réseau avec un autre artiste,
  mise à jour conservant pack/profil, portée limitée du worker, libération des
  illustrations et réglages à 390 px. Aucune erreur JavaScript consignée.
- **10/10 contrôles progression/replay/standalone**, via
  `tests/combat-progression-browser.mjs` : match réel, replay, premières transitions
  arcade/boss/survie, profils, imports refusés et export malgré un stockage
  indisponible. Aucune erreur consignée dans le rapport final.
- **11/11 contrôles interface/intégration**, via `tests/combat-browser.mjs` :
  menus, codex/archives, sauvegarde des réglages, clavier J1/J2, pause, défi,
  calibration et lancement dans CainOS, commandes tactiles à 390 px.
- **5/5 contrôles de récupération du profil**, via
  `tests/combat-profile-recovery-browser.mjs` : démarrage avec checkpoint invalide,
  persistance, événement entre deux onglets, défi Spécialiste réellement accompli
  et import invalide refusé sans perte des données existantes.
- **3/3 contrôles de reprise de l’installation hors ligne**, via
  `tests/combat-recovery-browser.mjs` : échec HTTP 503 réel du cache initial,
  nouvelle tentative depuis les réglages sans rechargement ni perte du profil,
  pack complet puis rechargement sans réseau.
- **9/9 contrôles sources/interface/replays**, via `tests/combat-fidelity-browser.mjs` :
  166 fiches, 12 aperçus, premières scènes des 14 histoires, versions de replay
  0.1/0.2/0.3, répétition, export et vues à 390 px.
- **7/7 contrôles de rendu**, via `tests/combat-render-browser.mjs` : détourage de
  Kaufmo, 14 premières poses idle, 12 décors, 20 projectiles/10 pièges, identité
  des objets, visibilité et mouvement réduit. Les sources et captures sont
  empreintées ; les mesures techniques restent distinctes de la revue artistique.
- **Total final : 64 contrôles navigateur réussis** sur les huit suites,
  sans erreur JavaScript consignée dans leurs rapports finaux.
- Le contrôle du classeur et les rapports consolidés sont suivis dans
  [`combat-qa-evidence.json`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/combat-qa-evidence.json) et
  [`combat-workbook-verification.json`](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/combat-workbook-verification.json).

`npm run qa` regroupe les audits CainOS, vérifications de syntaxe, tests Node,
manifest hors ligne et builds. Les huit suites navigateur sont exécutées
séparément ; leurs prérequis et commandes figurent dans la documentation.

## Limites suivies dans le classeur

Les histoires sont des créations de fan-game. Les planches et poses CainOS servent
encore aux animations, avec des transformations procédurales ; animations de
combat dédiées, accroupissement, proportions finales, couloir des résidents,
portraits finaux, ambiances/voix, certains effets encore partagés et mixage
matériel demandent de la finition. Les 12 thèmes synthétiques sont livrés.

Réseau/rollback, tag/assists, coopération, campagnes par épisode, finishers
cinématiques, cloud de combat, économie, paquets natifs et équilibrage compétitif
complet restent prévus. La reprise du noyau CQC ne porte pas automatiquement toutes
ses extensions Metal Gear. Les contrôles Chromium/WebAudio ne certifient pas une
écoute humaine, deux manettes physiques, les téléphones réels, l’accessibilité
complète ou la revue visuelle exhaustive des 51 costumes.

## Aperçus de la version 0.3.0

![Aperçu de la grande piste et références du décor](https://raw.githubusercontent.com/darknigthmare/CainOS/feat/encore-0-2-story-offline/docs/images/encore-fidelity-stage.png)

![Détourage et décors corrigés](https://raw.githubusercontent.com/darknigthmare/CainOS/feat/encore-0-2-story-offline/docs/images/encore-fidelity-render.png)

![Accueil Encore : neuf modes](https://raw.githubusercontent.com/darknigthmare/CainOS/feat/encore-0-2-story-offline/docs/images/encore-home.png)

![Tournoi remporté après trois duels joués](https://raw.githubusercontent.com/darknigthmare/CainOS/feat/encore-0-2-story-offline/docs/images/encore-tournament.png)

[Épilogue de l’histoire de Jax](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/images/encore-story.png) · [Arène et commandes](https://github.com/darknigthmare/CainOS/blob/feat/encore-0-2-story-offline/docs/images/encore-combat.png)

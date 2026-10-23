# Digital Circus — Encore 0.5.0

Cette PR part de `main` au commit
`f2253279c92b6e782006be7abeed9f2ea4d33453` et fait évoluer Encore 0.4.0 vers
**0.5.0**, dans CainOS et dans sa distribution standalone.

## Pourquoi

En 0.4.0, l’entraînement permettait de régler le mannequin et d’afficher les
hitboxes, mais pas d’isoler une image, ralentir précisément la simulation ou
rejouer une séquence enregistrée. Les introductions et issues de combat restaient
peu animées, la modale de résultat masquait immédiatement la fin du match et la
planche de Jax conservait une peau grise. Quatre écarts de règles ou de décision
CPU affectaient aussi les pièges bas, la garde, le soin de Ragatha et la portée
des saisies.

Cette version ajoute les outils de diagnostic et la présentation correspondante,
corrige ces comportements pour les nouveaux combats et sélectionne les règles
historiques lors de la lecture des anciens replays.

## Changements 0.5.0

### Laboratoire d’entraînement

- Gel, avance de **+1 image**, remise en place et vitesses **0,25× / 0,5× / 1×**.
  Une avance manuelle consomme exactement un tick et conserve le gel.
- Historique des **12 derniers groupes d’entrées de chaque joueur**, à partir des
  commandes effectivement résolues, y compris celles du mannequin. Affichage des
  phases de préparation, activité, récupération et réaction.
- Enregistrement de **600 images maximum**, soit dix secondes à 60 Hz : les
  commandes de J1 pilotent J2 pendant que J1 reste neutre. Les directions sont
  conservées relativement à l’orientation du mannequin.
- Lecture unique ou en boucle. Les six comportements de mannequin existants
  restent disponibles ; le mode de lecture manuelle devient utilisable après
  l’enregistrement d’une séquence.
- Jauge de finale libre, ressource libre et soin automatique réglables
  indépendamment. La remise en place conserve la séquence, les réglages et le gel,
  puis vide les historiques, statistiques et commandes en attente.
- Interface vérifiée sur bureau et à **390 px**. L’entraînement ne crédite aucun
  résultat de match ; `window.Encore.training` expose une copie de diagnostic en
  lecture seule.

Sources : [application](../combat/app.mjs), [laboratoire](../combat/training.mjs)
et [tests du laboratoire](../tests/combat-training.test.mjs).

### Présentation, fins de match et Jax

- **70 séquences finies** : introduction, victoire/défaite de manche et
  victoire/défaite de match pour chacun des 14 combattants. Le mouvement réduit
  présente leur pose stable et les égalités gardent une présentation neutre.
- La préférence système de mouvement réduit et le réglage du jeu se combinent
  pour le Canvas. Les changements système sont pris en compte pendant le jeu,
  sans modifier le choix sauvegardé dans le profil.
- **12 ambiances visuelles animées**, placées derrière les combattants et limitées
  à la zone au-dessus du sol. Elles ne modifient pas la simulation.
- Présentation de fin de match pendant **2,2 secondes**, avec **Voir le résultat**
  pour ouvrir directement la modale. Profil, replay et progression sont enregistrés
  dès la fin du duel ; attendre, passer la présentation ou rouvrir le résultat ne
  crédite pas une seconde fois la même victoire.
- Nouvelle planche transparente complète de **Jax, huit cellules** : corps violet,
  salopette rose, yeux, gants et dents jaunes, avec huit ancrages remesurés.
  L’illustration reste entière dans les postures basses. Les rigs composés restent
  limités à **Pomni et Zooble** ; les 51 costumes n’en héritent pas.

Sources : [séquences](../combat/render-sequences.mjs),
[ambiances](../combat/render-stage-motion.mjs),
[poses et limites](../combat/render-poses.mjs) et
[planche Jax](../assets/images/cainos-jax-animation-sheet-0.5.0.png).

### Règles corrigées et compatibilité

| Correction | Comportement des nouveaux combats 0.5.0 |
| --- | --- |
| Dix pièges déclarés bas | Leur collision applique leur niveau bas et la garde correspondante. |
| Garde CPU | La garde haute/basse reste cohérente pendant le blockstun. |
| Soin de Ragatha CPU | La décision respecte la santé réellement récupérable et la ressource disponible. |
| Saisies CPU | La décision utilise la portée réelle de la technique. |

Les replays **0.1.0 à 0.5.0** sélectionnent leur version de règles ; les versions
0.1.0–0.4.0 conservent leur comportement historique. Les **56 traces CPU héritées
de 900 images** sont comparées image par image avec le moteur publié de référence.
La version du replay reste conservée à l’export, sa lecture ne crédite aucun
résultat et le profil local reste au format version 1.

Sources : [moteur](../combat/engine.mjs), [session](../combat/session.mjs) et
[tests des règles versionnées](../tests/combat-rules.test.mjs).

## Contenu et distribution conservés

Le jeu conserve **14 combattants, 140 techniques, 12 arènes, 9 modes, 51 costumes
et 179 entrées de catalogue**, dont **114 archives sans kit**. Les histoires
comprennent **14 routes originales et 56 chapitres** ; le tournoi réunit huit
participants. Le noyau CQC, les programmes arcade/boss/survie, les commandes
personnalisées, les 12 thèmes procéduraux et les 16 motifs sonores restent partagés
entre l’OS et le standalone.

Le build hors ligne **`0.5.0-2d1c99a767c6`** référence **42 images**, soit
**48 370 710 octets**. La nouvelle planche Jax remplace l’ancienne dans le pack.
Les deux builds sont produits par les scripts existants. Le profil se partage sur
une même origine ; une autre origine utilise l’export/import JSON. La reprise d’un
programme restaure le début de sa rencontre enregistrée.

Sources : [contenu](../combat/data.mjs), [inventaire hors ligne](../combat/offline-manifest.mjs)
et [guide complet](DIGITAL_CIRCUS_ENCORE.md).

## Validation exécutée

Les preuves de cette reprise sont datées du **23 octobre 2026** et réunies dans
[combat-qa-evidence.json](combat-qa-evidence.json), avec les empreintes des sources,
les rapports et les limites de couverture.

| Vérification | Résultat |
| --- | --- |
| Node après les correctifs de revue | **235 tests réussis**, 14 suites, manifeste `0.5.0-2d1c99a767c6` |
| Navigateur Chromium de référence | **114 contrôles réussis**, 13 suites sur `12b5987` |
| Régression ciblée après correction Canvas | **3 contrôles réussis** de la préférence système, de sa bascule en direct et du réglage du jeu |
| Suivi QA | **390 lignes : 384 réussies, 2 à vérifier, 4 non exécutées**, aucun échec |

Les **117 contrôles navigateur consignés** réunissent les 114 contrôles de
référence et les trois contrôles ciblés ; les treize suites complètes n’ont pas
été relancées après le correctif Canvas. Aucun de ces rapports ne consigne
d’erreur JavaScript. La régression ciblée émule la préférence système dans
Chromium et observe un entraînement au repos, avec une simulation qui continue
d’avancer ; elle ne rejoue pas tous les effets ou résultats du jeu.

Les 390 lignes regroupent les tests et 38 objectifs de revue ; elles ne représentent
pas 390 tests indépendants. `npm run qa` a également été relancé après les
correctifs : audits CainOS, syntaxe, tests et deux assemblages validés.

La [suite de progression](../tests/combat-progression-browser.mjs) termine
**21 résultats joués** : un duel local, six matchs d’arcade, quatre de boss rush et
dix vagues de survie. Elle vérifie les trois médailles, la sauvegarde avant la
modale, l’attente de 2,2 secondes ou son passage direct, l’attribution unique,
le replay, puis l’export et la réimportation du même profil après rechargement.
La [suite Encore](../tests/combat-encore-browser.mjs) joue **9 duels supplémentaires**
pour la route complète de Jax, le tournoi, les défaites et les reprises. Les
13 autres histoires sont couvertes par leurs contrats de progression ; elles
n’ont pas toutes été jouées intégralement dans le navigateur.

Les autres parcours couvrent notamment trois fermetures/réouvertures du même duel
dans CainOS, les deux distributions servies, la récupération après une première
installation hors ligne en erreur, les 42 images hors réseau, les anciens replays,
les 51 costumes, les 56 cellules, les 70 séquences, les 12 ambiances et le
laboratoire jusqu’à sa limite de 600 images. Les assertions matérielles et
artistiques restantes sont identifiées ci-dessous.

## Classeur de suivi

[DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) conserve
**10 onglets et 9 tableaux** : Synthèse, Fonctionnalités, Combattants, Techniques,
Arènes, Atlas, Production, Scénarios, QA et Références. La génération 0.5.0 recense
**98 fonctionnalités, 472 tâches de production, 85 scénarios et 390 lignes QA**.
Les données proviennent des modules du jeu et des preuves d’exécution ; les notes
utilisateur suivent leurs identifiants stables lors de la régénération.

Le correctif d’export réserve un répertoire temporaire unique et nettoie ses
trois sources ainsi que leurs copies de publication sur succès ou sur échec.
Les quatre essais ciblés couvrent un succès et trois échecs injectés : export
après écriture, validation au réimport et copie de publication partielle. Les PNG
et fichiers témoins voisins sont conservés dans les quatre cas ; les trois
livrables existants restent intacts dans les trois cas d’échec. Ces essais sont
exécutés sur des copies privées et consignés dans la preuve QA.

Les tâches de production distinguent **158 éléments implémentés, 286 partiels et
28 prévus**. Les fiches documentent aussi les 217 entrées de fidélité et les
51 examens techniques de costumes. Ces comptes ne constituent pas un pourcentage
d’achèvement artistique.

**Classeur final réimporté et vérifié** : 10 onglets, 9 tableaux natifs et
36 formules sans erreur ; les 64 empreintes des sources correspondent aux fichiers
livrés. Les dix rendus finaux sont identiques aux vues inspectées. Les essais de
régénération ont conservé dix notes sur huit feuilles et validé neuf refus
d’entrées invalides. Le classeur initial ne contenait aucune note utilisateur et
aucune note synthétique des essais n’est incluse dans le livrable. Les résultats
sont consignés dans
[combat-workbook-verification.json](combat-workbook-verification.json), avec les
données générées dans [combat-tracker-data.json](combat-tracker-data.json).

## Captures

| Vue | Capture |
| --- | --- |
| Laboratoire sur bureau | [Entraînement bureau](images/encore-training-desktop.png) |
| Laboratoire à 390 px | [Entraînement mobile](images/encore-training-mobile.png) |
| Nouvelle planche et palette | [Jax](images/encore-jax-palette.png) |
| Introductions et issues | [Séquences individuelles](images/encore-outcome-sequences.png) |
| Décors animés | [Ambiances des arènes](images/encore-stage-motion.png) |
| Présentation des attaques | [Attaques](images/encore-poses-attacks.png) |
| Deux rigs bas et illustrations entières | [Postures basses](images/encore-poses-crouch.png) |
| Présentation des résultats | [Issues de combat](images/encore-poses-outcomes.png) |

## Limites conservées

- **Production artistique et fidélité.** Les séquences utilisent les illustrations
  existantes ; les dessins de combat dédiés, finishers cinématiques, décors
  finalisés, voix et certains sons restent à produire. La planche Jax a des
  contours régénérés. Les 51 costumes ont une revue technique, dont 14 avec des
  défauts consignés ; seules sept comparaisons canoniques partielles sont
  documentées. Les rigs Pomni/Zooble ne représentent pas exactement les hurtboxes.
- **Fonctions de jeu et contenu.** Réseau/rollback, équipes/assists, coopération,
  campagnes par épisode, économie et équilibrage compétitif complet restent
  prévus. Les 114 archives n’ont pas de kit. Le lore étendu reste à vérifier et
  toutes les extensions du CQC Metal Gear ne sont pas portées.
- **Matériel et accessibilité.** Téléphone physique, deux manettes physiques,
  parcours exhaustif au clavier et performances sur matériel modeste sont les
  quatre contrôles non exécutés. Les deux revues ouvertes concernent un duel
  complet avec chacun des 14 combattants et la fidélité canonique exhaustive.
  L’émulation tactile à 390 px et les tests Chromium ne certifient pas tous les
  navigateurs ni le mixage audio sur appareils réels.
- **Distribution et persistance.** Paquets natifs, URL publique distincte et
  synchronisation cloud des combats restent prévus. La PWA dépend du navigateur,
  de HTTPS ou localhost et d’une préparation terminée du pack. Son worker couvre
  le jeu ; le reste de CainOS et la redirection racine restent hors de ce cache.

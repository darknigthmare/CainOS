# Encore — six accessoires de décor intégrés, 20 novembre 2026

Les six PNG natifs retrouvés le 19 novembre sont désormais utilisés dans leurs
arènes. Le moteur déclarait déjà leurs chemins, mais les fichiers n’étaient
présents que dans l’archive de production. Cette passe les installe aux chemins
attendus, vérifie leur composition dans les scènes et les ajoute au paquet hors
ligne. **Aucune nouvelle image de personnage n’a été générée pendant cette passe.**

Ce rapport prolonge le [lot de personnages du 20 novembre](COMBAT_CAST_CONTINUATION_2026-11-20.md).
Ses preuves sont conservées dans un nouveau dossier ; celles du lot précédent
restent un relevé historique.

## Assets livrés et comportement

| Arène existante | Accessoire | Fichier actif sous `assets/encore/props/` | Octets natifs |
| --- | --- | --- | ---: |
| Gaslight District · Les quais | Réverbère | `gaslightwharf/wharf-lamp.png` | 1 329 877 |
| Showgrounds · Le parvis du château | Distributeur de tickets | `showgrounds/ticket-dispenser.png` | 1 189 952 |
| Gameoverse · En orbite | Piédestal holographique | `gameoverse/orbital-checkpoint.png` | 1 060 878 |
| Park Planet · La terrasse | Tourniquet de jardin | `parkplanet/garden-turnstile.png` | 983 163 |
| Little Daisy · Le club clandestin | Microphone en laiton | `littledaisy/jazz-microphone.png` | 1 260 782 |
| Ultra Jump Mania! · L’île de Theo | Portique de bambou avec cloche | `simpleflipisland/bamboo-checkpoint.png` | 1 663 958 |
| **Total** | **6 accessoires** | **6 PNG** | **7 488 610** |

Les fichiers actifs sont identiques, octet pour octet, aux sources de
[`art/sources/recovered-local-props-20261119`](../art/sources/recovered-local-props-20261119/README.md).
L’[inventaire natif](art-generation/props-integration-20261120/native-inventory.json)
conserve chaque association source/destination, taille et SHA-256. Les identifiants
de génération récupérés restent dans le manifeste d’origine ; les prompts
historiques absents ne sont pas reconstruits.

Les accessoires utilisent la composition existante du plan proche, derrière les
combattants. La seule modification du placement runtime porte sur le piédestal
orbital : **base verticale 554 → 572, soit 18 pixels vers le bas**, pour placer
sa base visible sur la plate-forme. Sa hauteur de dessin reste 154 pixels et son
échelle uniforme est conservée. Les cinq autres ancrages, les collisions, la
simulation, les profils et les replays ne sont pas modifiés.

Ce sont des accessoires originaux du fan-game. Leur intégration ne constitue pas
une certification de reproduction canonique des épisodes.

## Revue visuelle et comparaison reproductible

La [galerie de revue](art-generation/props-integration-20261120/README.md) présente
les six PNG sur fonds sombre et clair, puis chaque arène avant et après
l’intégration. Le rendu utilise `CombatRenderer`, `loadStagePlanes` et
`drawStagePlanes`, avec Canvas/Skia dans Node. Il vérifie le sélecteur de décors
du jeu et les trois positions de caméra de chaque composition, soit **six scènes
et dix-huit vues**. Il ne remplace pas un essai navigateur.

Le script conserve les requêtes d’images et les coordonnées de dessin effectives.
Il vérifie que les définitions des arènes restent inchangées et que chaque scène
intégrée diffère de son image « avant ». Les sept fichiers de référence — six
images et leur rapport — sont conservés dans le dossier
[`before/`](art-generation/props-integration-20261120/before/canvas-review.json).
Leurs empreintes sont vérifiées avant la comparaison et enregistrées dans le
[rapport final Canvas](art-generation/props-integration-20261120/review/canvas-review.json).
Le script refuse un répertoire de sortie identique au répertoire de référence.

| Arène | Pixels changés par rapport au relevé avant intégration |
| --- | ---: |
| Gaslight District | 4 510 |
| Showgrounds | 5 351 |
| Gameoverse | 8 949 |
| Park Planet | 2 938 |
| Little Daisy | 2 032 |
| Ultra Jump Mania! | 3 806 |

Ces différences attestent l’affichage effectif des accessoires, sans prétendre
mesurer leur fidélité artistique. La revue humaine a contrôlé la transparence,
les silhouettes entières et le placement. Le piédestal orbital a été abaissé
après cette inspection, puis les six scènes ont été rendues à nouveau. Chaque
décor est traité dans un processus distinct afin de libérer ses grands plans
natifs avant le suivant.

Reproduire la revue sur les assets intégrés :

```sh
node --expose-gc scripts/render-combat-prop-review.mjs \
  --output docs/art-generation/props-integration-20261120/review \
  --compare docs/art-generation/props-integration-20261120/before
```

## Vérification du jeu et limites d’exécution

Les [preuves complètes](art-generation/props-integration-20261120/verification.json)
relient les fichiers et les commandes aux empreintes de cette révision.

| Vérification | Résultat constaté |
| --- | --- |
| `npm run qa`, 20 novembre, 07:59:45–08:00:32 à Paris | **401 tests réussis**, aucun échec, aucun test ignoré |
| Build CainOS | Réussi ; les 6 copies natives et 4 modules de rendu/manifeste correspondent aux sources |
| Build Encore indépendant | Réussi ; les 6 copies natives et les mêmes 4 modules correspondent aux sources |
| Rendu Canvas | 6 accessoires chargés, 6 scènes complètes, 18 vues de caméra |
| Essai local Chromium, 08:03:04 à Paris | Bloqué avant navigation : `socket() failed: Operation not permitted (1)` ; **0 contrôle navigateur exécuté** |
| CI distante du précédent commit `ce7ceeb7` | Terminée avec succès, navigateur compris ; résultat distinct de cette nouvelle passe |

Le [journal QA](art-generation/props-integration-20261120/qa.log), son
[relevé d’exécution](art-generation/props-integration-20261120/qa-execution.json),
le [journal Chromium](art-generation/props-integration-20261120/browser-attempt.log)
et le [relevé de l’essai](art-generation/props-integration-20261120/browser-attempt.json)
sont conservés. Le serveur local avait démarré ; le navigateur s’est arrêté avant
de pouvoir charger une page.

Les six nouveaux scénarios de `tests/combat-stage-art-browser.mjs` couvrent la
demande d’accessoire depuis l’interface, le rendu incomplet lors d’une erreur de
chargement, sa récupération, puis la réutilisation du canvas en cache. Ils sont
livrés pour la CI ; leur exécution locale n’est pas annoncée comme réussie.

Le [run 44682285320](https://github.com/darknigthmare/CainOS/actions/runs/44682285320),
relevé à 07:56:41 à Paris, valide le commit précédent `ce7ceeb7`. Ses deux
déploiements Vercel ont également réussi. L’upload des preuves a réussi, mais
l’upload du standalone a été ignoré : ce run ne livre pas un nouveau ZIP. Aucun
résultat de ce commit précédent n’est attribué aux nouveaux accessoires.

## Paquet hors ligne et contenu préservé

| Indicateur | Après intégration |
| --- | ---: |
| Images du manifeste hors ligne | **5 491** |
| Poids natif total | **2 724 652 669 octets** |
| Variation de cette passe | **+6 fichiers ; +7 488 610 octets** |
| Version hors ligne | `0.7.0-fb6e3148b501` |
| Version artistique | `dbc2d48af8cbe42e` |
| Combattants / techniques / arènes partagées | 54 / 540 / 22 |
| Tenues sélectionnables / entrées d’archive | 443 / 179 |
| Apparences supplémentaires complètes | 14, soit 154 dessins |

Les **102 dessins natifs acceptés** au checkpoint personnages restent inchangés :
66 actifs pour six apparences et 36 archivés pour neuf familles incomplètes.
Les **63 poses restantes** et leurs références restent dans
[`generation-resume.json`](art-generation/cast-continuation-20261120/generation-resume.json),
dont le SHA-256 est toujours
`2ca4585a5e30eba98e9f044e40d637ef38d5a52912c09890efb85d503985cbe9`.
Le service de génération avait annoncé une réouverture le 20 novembre à
**09:08:33, heure de Paris** ; aucun appel supplémentaire n’a été effectué pendant
la présente intégration des accessoires.

## Références complémentaires et classeur

L’[audit complémentaire des sources primaires](art-generation/cast-reference-audit-20261120/audit-report.md)
apporte neuf extraits et une matrice de neuf candidats. Les trailers précisent
les mains de Zooble EP3, le bras de Zooble EP6 et le haut du corps de Zooble EP8.
Une illustration cocktail de l’artbook est référencée comme marchandise
officielle distincte. Les raccords cachés et les pieds insuffisamment visibles
restent à documenter : **aucune nouvelle apparence prête et aucun job de
génération ajouté**.

La récupération du classeur est un chantier séparé. Ce rapport et ses preuves
ne certifient pas la publication d’un nouveau XLSX. Le relevé antérieur de
l’[export bloqué](art-generation/cast-continuation-20261120/workbook-review.json)
reste applicable jusqu’à une exportation réelle, une vérification de conservation
et une publication atomique du classeur avec ses données et ses preuves.

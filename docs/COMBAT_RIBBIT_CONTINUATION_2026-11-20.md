# Encore — deux nouvelles apparences de Ribbit, 20 novembre 2026

**Anime Ribbit et Jax-Suit Ribbit sont intégrés au catalogue partagé par CainOS et le jeu autonome.** Chacun dispose de onze dessins séparés : portrait de sélection, garde et neuf actions. Ce lot ajoute **22 PNG natifs distincts, soit 24 631 738 octets**. Les fichiers utilisés en jeu sont identiques aux originaux acceptés, transparence comprise.

Cette reprise publie aussi le lot antérieur de dix apparences et 110 PNG, qui était resté local. Il est disponible dans la [PR #7](https://github.com/darknigthmare/CainOS/pull/7) au commit [`a5341b8c`](https://github.com/darknigthmare/CainOS/commit/a5341b8cf1ceecc22ccca13ba6b20a9f710bddb0). Son arbre `a2d454210d0659d8f93c144112fe9d3cb6193ad0` est identique à celui du checkpoint local `f7b3b9a`. Les **22 dessins Ribbit sont les nouvelles créations de cette reprise** ; les 110 autres ne sont pas recomptés comme nouvellement générés.

[Galeries et preuves](art-generation/cast-ribbit-20261120/README.md) · [Manifeste final](art-generation/cast-ribbit-20261120/generation-completion.json) · [Vérification consolidée](art-generation/cast-ribbit-20261120/verification.json) · [Travaux restants](art-generation/cast-ribbit-20261120/remaining-work.md)

## Deux familles complètes

| Apparence | Identifiant | Dessins | Galerie du rendu de production |
| --- | --- | ---: | --- |
| Ribbit — Anime | `animeribbit` | 11/11 | [Actions et portrait](art-generation/cast-ribbit-20261120/review/animeribbit/README.md) |
| Ribbit — combinaison Jax | `jaxsuitribbit` | 11/11 | [Actions et portrait](art-generation/cast-ribbit-20261120/review/jaxsuitribbit/README.md) |
| **Total** | **2 apparences de Ribbit** | **22/22** | **2 revues individuelles** |

Les emplacements sont `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory` et `defeat`. Chaque original contient un personnage entier. Les planches servent uniquement à examiner plusieurs fichiers ensemble ; aucun montage ne remplace les dessins séparés chargés en jeu.

Anime Ribbit conserve le visage de grenouille vert, le museau menthe, les grands yeux roses de style anime, le gilet jaune, le nœud et la jupe roses, les chaussettes blanches et les chaussures sombres. Jax-Suit Ribbit conserve son visage de grenouille sous une capuche lavande à oreilles de lapin, le petit nœud sur l’oreille gauche, la salopette rose et les gants jaunes. Les proportions suivent les dessins élancés déjà présents dans Encore.

Les deux variantes utilisent le propriétaire `ribbit`, son kit et ses identités de sauvegarde. Les **462 costumes antérieurs et les 33 définitions d’apparences supplémentaires antérieures** restent dans le même ordre et avec le même contenu ; seules deux définitions sont ajoutées. L’[audit indépendant](art-generation/cast-ribbit-20261120/ribbit-independent-review.json) vérifie aussi les techniques, les crossovers et les arènes.

## Références et production

La page officielle [Ribbit Pendantz Blindbox](https://glitchproductions.store/products/ribbit-pendantz-blindbox) distingue les noms Anime, Maid et Jax-Suit, ainsi que les variantes déjà présentes. Huit images officielles ont été archivées et inspectées : quatre portraits individuels et quatre vues de groupe. Le [relevé de téléchargement](art-generation/ribbit-candidates-20261120/references/downloads.json) conserve les URLs, dimensions et empreintes ; la [qualification visuelle](art-generation/ribbit-candidates-20261120/reference-review.md) décrit les éléments effectivement visibles.

Les prompts et références utilisés sont conservés dans les reçus de chaque famille : [Anime Ribbit](art-generation/cast-ribbit-20261120/generated/animeribbit) et [Jax-Suit Ribbit](art-generation/cast-ribbit-20261120/generated/jaxsuitribbit). Le manifeste final relie chaque fichier actif à son archive, son reçu, sa taille et son empreinte SHA-256. Les 22 orientations natives sont enregistrées à droite ; le moteur applique lui-même la direction requise pour chaque joueur.

Les images actives n’ont été ni recadrées, ni recolorées, ni redimensionnées, ni retouchées. La composition avec le canal alpha a été vérifiée ; les couleurs RGB stockées dans les pixels entièrement transparents n’ont pas été effacées. Les essais non retenus restent séparés des fichiers acceptés.

**Maid Ribbit reste à qualifier.** La robe, le tablier et la coiffe sont visibles, mais aucune vue inspectée ne permet de décrire sûrement les chaussures et les jambes. Sa ligne de suivi reste « À vérifier » ; aucune apparence active ne remplit ces parties au hasard. Le personnage secret non nommé n’est pas identifié.

Les sources attestent des costumes de produits dérivés officiels. Elles ne prouvent pas une apparition dans un épisode. Les poses de combat sont des créations du fan-game, et les onze dessins statiques ne constituent pas un cycle d’animation image par image.

## Contrôles exécutés sur le lot final

| Contrôle | Résultat | Preuve |
| --- | --- | --- |
| Audits du dépôt et `npm run qa` | **405 tests Node réussis**, zéro échec, zéro test ignoré ; **deux builds réussis** | [Résultat](art-generation/cast-ribbit-20261120/qa-result.json), [journal](art-generation/cast-ribbit-20261120/qa.log) |
| Copies dans CainOS et la distribution autonome | **44 comparaisons d’images** et **14 comparaisons de modules** conformes | [Intégrité des builds](art-generation/cast-ribbit-20261120/build-integrity.json) |
| Conservation des fichiers Encore existants | **5 656 fichiers** vérifiés identiques au checkpoint `f7b3b9a` | [Même relevé d’intégrité](art-generation/cast-ribbit-20261120/build-integrity.json) |
| Rendu Canvas de production sous Skia | **18 actions, 2 gardes, 2 portraits et 40 contrôles de dessin**, aucun manque | [Synthèse Canvas](art-generation/cast-ribbit-20261120/canvas-summary.json) |
| Revue visuelle | Deux planches d’actions et deux planches de portrait inspectées ; identité, costume et silhouette entière cohérents à l’échelle des exports | [Revue finale](art-generation/cast-ribbit-20261120/visual-review.json) |
| Audit indépendant | 22 originaux et 22 copies actives identiques ; 44 références portables conformes ; catalogue précédent préservé | [Audit indépendant](art-generation/cast-ribbit-20261120/ribbit-independent-review.json), [intégrité détaillée](art-generation/cast-ribbit-20261120/ribbit-independent-integrity.json) |
| Navigateur local | Chromium arrêté avant navigation, **zéro contrôle de l’application exécuté** | [Tentative datée](art-generation/cast-ribbit-20261120/browser-result.json), [journal](art-generation/cast-ribbit-20261120/browser.log) |

Les contrôles QA, Canvas et distributions sont liés par empreintes aux mêmes modules finaux. Le manifeste hors ligne final a pour SHA-256 `99a4bef5ac846f0518feb3f2062c48c23965c60ac4e5044dc221321fa0f211e1`.

La tentative navigateur échoue sur `socket: Operation not permitted` avant le chargement d’une page. Elle précède la reconstruction du manifeste hors ligne et conserve donc l’empreinte précédente dans son reçu. Elle atteste uniquement ce blocage de lancement, et **ne valide pas le runtime final dans Chromium**. La réussite Canvas atteste le chargement et le dessin par le moteur ; le DOM, les commandes et le service worker relèvent des suites navigateur et de la CI.

Un premier essai Canvas avait également précédé la reconstruction du manifeste ; son journal est conservé sous `render-before-manifest.log`. Les deux essais finaux, exécutés après reconstruction, sont réussis et liés au manifeste final. Ce premier journal n’est pas une erreur résiduelle du catalogue.

Le scénario navigateur des actions accepte désormais un filtre local facultatif d’apparences. Les identifiants inconnus sont refusés. Sans filtre, la CI continue de parcourir l’ensemble du catalogue et conserve le contrôle de récupération après une image absente.

## Catalogue après intégration

Les compteurs sont issus de l’[import des modules du jeu](art-generation/cast-ribbit-20261120/runtime-counts.json).

| Élément | Total |
| --- | ---: |
| Combattants | 54 |
| Techniques | 540 |
| Arènes partagées | 22 |
| Costumes sélectionnables | 464 |
| Apparences Circus supplémentaires cumulées | 35, soit 385 PNG |
| Entrées d’archive | 179 |
| Images du paquet hors ligne | 5 722 |
| Taille native du paquet hors ligne | 3 015 349 314 octets |

Le paquet porte la version `0.7.0-06ee786e917e` et la révision artistique `c95f7501cac3f0e4`. Ce lot n’ajoute aucun décor. Les 22 arènes, leurs plans et accessoires, ainsi que les 54 arrangements dédiés existants, sont conservés.

## Suivi et suite

**Le blocage de l’export XLSX est résolu et le nouveau classeur est installé.** La [réconciliation](art-generation/workbook-reconciliation-20261120/README.md) ajoute au suivi les six accessoires, les neuf apparences de la reprise précédente, les dix apparences récupérées et ces deux nouvelles familles. Le [classeur de production](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) contient désormais **3 134 lignes Production, 2 281 lignes QA et 149 sources**.

La [comparaison du fichier exporté](art-generation/workbook-reconciliation-20261120/native-comparison.json) couvre **79 280 cellules sans différence avec la cible contrôlée**. La [réimportation](art-generation/workbook-reconciliation-20261120/reimport-result.json) retrouve les 11 feuilles, 10 tables natives et 42 formules ; celles-ci ont été recalculées sans erreur. Les identifiants, l’ordre et les notes utilisateurs sont conservés, et les 33 vues du XLSX enregistré ont été inspectées. Les lignes QA du classeur sont des enregistrements de suivi, pas 2 281 tests exécutés pendant cette reprise.

L’ancienne ligne préparée qui annonçait à tort un export réussi au checkpoint bloqué est corrigée en « Non exécuté » pour cette date. Une nouvelle ligne atteste l’export réellement réussi maintenant. Les anciens checkpoints, leurs fichiers et leurs preuves de blocage restent conservés ; le résultat courant ne leur attribue pas rétroactivement une réussite.

Le [registre courant des manquants](art-generation/cast-ribbit-20261120/remaining-work.md) conserve les références à compléter pour Maid Ribbit, les autres tenues et assemblages à qualifier, les comparaisons de doublons, les animations complètes et les crossovers des quarante PNJ promus. La complétion de ce lot ne vaut pas certification canonique générale ni clôture de tous ces chantiers.

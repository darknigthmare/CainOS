# Classeur de suivi — continuation B, 20 novembre 2026

**Le classeur, son JSON de suivi et sa vérification sont installés ensemble et leurs empreintes ont été relues.** Cette mise à jour repart du XLSX publié après Café Ribbit, Murder Drones et Barnoir, puis ajoute les deux tenues Café, les trois créations Ribbit × Meta Runner et le stade de softball. La [publication locale](publication.json) est distincte de la publication GitHub du lot principal.

Le [classeur Excel](../../../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx), son [JSON compagnon](../../../combat-tracker-data.json) et le [rapport détaillé](workbook-review.json) décrivent le même export final.

## Résultat du suivi

| Élément | Base conservée | Résultat final | Ajout |
| --- | ---: | ---: | ---: |
| Cellules natives | 81 412 | 82 697 | 1 285 |
| Lignes Production | 3 242 | 3 308 | 66 |
| Lignes QA | 2 389 | 2 454 | 65 |
| Références | 157 | 161 | 4 |
| Feuilles | 11 | 11 | 0 |
| Tables natives | 10 | 10 | 0 |
| Formules | 42 | 42 | 0 |

Les 66 lignes Production ajoutées comprennent cinq familles, **55 dessins individuels** et six éléments du stade : plans, sol, musique, ambiance sonore et animation visuelle. Chacun des 55 dessins possède sa propre ligne QA, avec chemin actif, reçu, dimensions, octets et SHA-256. Les trois plans du stade ont également leur contrôle individuel ; sept constats supplémentaires décrivent les vérifications du lot et du classeur. La correspondance complète est conservée dans [asset-slot-verification.json](asset-slot-verification.json).

L’ordre des cinq familles ajoutées est : `cafekinger`, `cafepomni`, `glitch-metarunner-ribbit-hommage`, `glitch-metarunner-ribbit-resident`, `glitch-metarunner-ribbit-fusion`. Les 55 PNG de personnages représentent **51 996 635 octets**. Avec les trois plans de softball, le lot comprend **58 PNG natifs et 55 122 465 octets**. Le plan lointain est RGB opaque ; les autres plans conservent leur alpha natif. Leurs dimensions restent **1 672 × 941, 1 672 × 941 et 1 671 × 941**, sans réencodage.

Les totaux visibles sont **54 combattants, 540 techniques, 477 costumes, 25 arènes communes et 54 arrangements à décor partagé**. Les costumes se répartissent en 51 variantes d’archives, 42 tenues Circus et 384 crossovers. Le manifeste lié à cette édition est `0.7.0-17366238b519`, art `20311abb70caa13c`, avec **5 874 images / 3 173 741 905 octets**.

## Conservation de l’histoire et des notes

La [base figée](baseline-freeze.json) identifie le XLSX de départ par le SHA-256 `4ffcd9d1e17cedbc4a6495f103573eb231a77006d2dabb210f2abbdbca781091`. Le [plan final](update-plan.json) contraint les 81 412 cellules préexistantes et liste les **61 cellules historiques autorisées à évoluer** : totaux, formules de comptage, synthèse, fonctionnalités et sources concernées. Les anciennes lignes Production et QA, les IDs, leur ordre et les notes utilisateur sont conservés. Aucune hauteur de ligne historique n’a changé. Le pied de Références est déplacé de quatre lignes pour accueillir les quatre sources nouvelles.

Le [fixture indépendant des 472 costumes](costume-prefix-baseline.json) et le [gel runtime](metarunner-runtime-freeze.json) vérifient aussi la sérialisation complète du préfixe du catalogue. Le registre explicite conserve les 43 extensions publiées, puis ajoute les deux Café et les trois Meta Runner. Les 381 crossovers déjà présents et les trois définitions Murder Drones restent intacts ; les nouveaux ajouts ne déplacent pas les anciennes entrées.

Les 14 propriétaires historiques gardent leurs neuf séries complètes. Ribbit dispose désormais de six familles dans Murder Drones et Meta Runner ; **ses sept autres séries et les 39 autres PNJ promus restent manquants**, soit 1 074 familles potentielles dans la grille actuelle. Les réserves Jax australien, Gangle noir, assemblages Zooble et Maid Ribbit restent ouvertes. Les choix de trois doigts ou lobes des créations originales ne deviennent pas un trait canonique attribué aux références marchandes.

## Vérification de l’export

Le [builder dédié](../../../../scripts/update-combat-continuation-b-workbook-20261120.mjs) utilise uniquement les API publiques du runtime tableur principal. Il reconstruit la copie contrainte, recalcule, exporte et réimporte. L’inspecteur XML est utilisé en lecture seule. Le [journal d’exécution](execution.json) conserve les étapes réellement terminées et leurs journaux.

- **42 formules recalculées sans erreur** ; une modification temporaire d’un statut a fait varier les totaux attendus, puis a été annulée avant export.
- [Comparaison native](native-comparison.json) de **82 697 cellules**, avec leurs types, valeurs, formules, styles, dimensions, règles et structures : **zéro différence** avec le modèle approuvé.
- [Réimportation](reimport-result.json) des **10 tables et 42 formules**, avec comparaison de toutes les lignes au JSON ou à la table historique conservée.
- [Revue visuelle combinée](visual-review.json) de **50 vues finales**, liée au même SHA XLSX et au même plan : 16 vues par [root](root-visual-review.json), 34 vues Production/QA par la [revue indépendante](independent-visual-review.json). Aucun défaut concret n’a été relevé.

Les [14 aides de lecture](root-diagnostics/manifest.json) de root conservent les pixels des vues larges en bandes recouvrantes, sans redimensionnement ni modification des PNG sources. Elles n’ajoutent pas de vues aux 50 prévues. Les six [vues de base](baseline-visual-review.json) sont des copies des aperçus précédemment inspectés du XLSX de départ ; aucune nouvelle inspection de ces vues initiales n’est revendiquée ici.

La mémoire résidente relevée après export est de **1 108 049 920 octets** ; il s’agit d’une mesure ponctuelle, pas d’un pic. Aucun historique n’a été supprimé pour réduire la mémoire. Les trois fichiers finaux ont été remplacés avec `publishWorkbookArtifacts`, après vérification des **195 empreintes de sources** et des preuves. La preuve QA historique `combat-qa-evidence-0.7.0.json` reste inchangée.

## Preuves du jeu reprises avec leur portée

La [vérification consolidée du lot](../verification.json) porte les résultats suivants : **431 tests réussis sur 431, zéro échec ni test ignoré, deux builds réussis, 100 contrôles Canvas des personnages et six contrôles du stade**. L’intégrité compare 116 copies de PNG, 40 copies de modules et 5 772 fichiers Encore historiques. Ces exécutions gardent leurs dates et leurs empreintes ; le builder du classeur ne les présente pas comme de nouvelles exécutions du jeu.

La QA du classeur compte 2 435 réussites datées, zéro échec, 16 lignes Non exécuté, deux À vérifier et un constat historique Partiel. **Aucune tentative navigateur n’a été lancée pour cette continuation.** Le wrapper courant rattache uniquement l’antécédent Barnoir du 20 novembre à 14:51 UTC, bloqué avant navigation avec zéro contrôle réussi. Ce constat reste séparé du rendu Canvas, des interactions DOM, de l’audio et des périphériques physiques.

Le premier préflight Meta Runner et le premier filtrage des tests sont conservés avec leurs échecs préparatoires dans ce dossier. Les jobs de correction sont résolus par correspondance exacte aux reçus ; les contrôles dépendant du nouveau manifeste ont ensuite été couverts par la QA globale réussie. Le [premier plan de classeur](attempts/before-final-consolidation-metadata/attempt.json) a été interrompu avant export pour reprendre les empreintes documentaires finales ; aucune ancienne réussite n’a été réattribuée au plan courant.

Les dessins statiques, l’acceptation de la mise en page et les tests techniques ne ferment pas les cycles d’animation complets, les comparaisons canoniques plan par plan ou les essais matériels.

## Empreintes installées

| Fichier | SHA-256 |
| --- | --- |
| `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` | `4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e` |
| `combat-tracker-data.json` | `839790a0a128e09573e0c1578ccecc46e1dc20819c75108650c666a2aeabb352` |
| `combat-workbook-verification.json` | `024bcd3c67b272eccd789af0ed89b6bc0b8a7e3da7f44e6ea2386ce7c1573127` |

Le [contrôle d’installation](installation.json) relie ces trois fichiers aux rapports, aux 50 vues et à leurs aides de lecture. Le plan final porte l’empreinte `2a18d8c9d5b667409db2acaf4443eed854e095cc1196033b9c465db0c28d4299`. Une évolution ultérieure doit repartir de ce classeur installé, avec son propre plan et ses nouvelles preuves.

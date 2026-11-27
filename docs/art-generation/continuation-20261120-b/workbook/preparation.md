# Préparation du suivi — continuation B, 20 novembre 2026

Cette préparation repart du classeur installé après la vague Café Ribbit, Murder Drones et Barnoir. Les sections de cadrage ci-dessous conservent l’état initial du plan. L’intégration runtime observée ensuite est consignée à la fin ; l’export, la revue et l’installation achevés sont décrits dans le [rapport final](README.md).

## Base figée

- XLSX : `4ffcd9d1e17cedbc4a6495f103573eb231a77006d2dabb210f2abbdbca781091`.
- JSON de suivi : `82c44b7598e3c7822f62a166555258d68ebe442577fa61dd2613e7f6f4d6e218`.
- Rapport de vérification : `05d9006314b12bc9b44b9d53e4e18d71791822d8613d8cf77f506c3c1a80d25b`.
- Preuve QA historique : `eb0edceabdd0f1e2a939f892327717ac59e0188c6a904f8aec9952ed089e74f5`.

[baseline-freeze.json](baseline-freeze.json) lie ces fichiers à leurs sauvegardes de travail. L’extraction XML en lecture seule confirme **81 412 cellules, 42 formules, 11 feuilles et 10 tables** ; ses empreintes figurent dans [native-baseline-summary.json](native-baseline-summary.json). La base contient **3 242 lignes Production, 2 389 lignes QA et 157 références**. Les IDs, l’ordre, les notes utilisateur et les valeurs historiques restent la contrainte du prochain export.

Six PNG de la revue finale précédente servent de vues initiales : ils correspondent exactement au SHA du classeur actuellement installé et sont recopiés sans modification. [baseline-visual-review.json](baseline-visual-review.json) conserve leurs origines et leurs empreintes. Aucun nouveau rendu ni nouvelle inspection de ces vues n’est revendiqué à ce stade ; elles serviront à la comparaison de la prochaine revue.

## Périmètre demandé, en attente des preuves finales

| Famille | ID prévu | Emplacements à documenter |
|---|---|---:|
| Kinger Café | `cafekinger` | 11 PNG individuels |
| Pomni Café | `cafepomni` | 11 PNG individuels |
| Ribbit × Meta Runner, hommage | À reprendre de la définition gelée | 11 PNG individuels |
| Ribbit × Meta Runner, résident | À reprendre de la définition gelée | 11 PNG individuels |
| Ribbit × Meta Runner, fusion | À reprendre de la définition gelée | 11 PNG individuels |
| Le stade de softball, épisode 5 | `softballfield` | 3 plans, à confirmer par les preuves finales |

Le périmètre personnages vise **55 PNG**, auxquels s’ajoutent les trois plans de softball, soit **58 PNG visés**. Ces nombres décrivent la commande ; ils ne constituent pas une preuve de génération, d’intégration ou de revue. Les noms, sources, dimensions, tailles, empreintes et reçus seront repris des manifests finaux. Les lignes de familles et les lignes de dessins individuels restent distinctes pour éviter tout double comptage des costumes. Chaque dessin aura sa ligne Production et sa ligne QA.

La couverture de la base est conservée : 472 costumes, dont 51 variantes d’archives, 40 apparences Circus et 381 crossovers. Les 14 propriétaires historiques de crossovers restent complets. Les lacunes de références officielles, les autres séries des PNJ, les animations complètes et les essais physiques ne seront pas fermés par déduction.

## Ordre du catalogue

Le [fixture des 472 costumes](costume-prefix-baseline.json) a été capturé avant modification du runtime. Il conserve tous les IDs et l’empreinte de leur sérialisation complète. Le spread actuel insère de nouvelles apparences Circus avant les trois PNJ déjà publiés et déplacerait le premier de ces costumes à l’indice 469.

La solution proposée est un ordre explicite commun aux extensions Circus et PNJ : conserver les 43 IDs publiés dans leur ordre actuel, puis ajouter les IDs des futurs lots à la fin. Les objets restent résolus depuis leurs registres d’origine, sans changement de champs. Les doublons, IDs absents et entrées non listées doivent être refusés clairement. La [simulation en mémoire](append-strategy-simulation.json) confirme la conservation exacte des 472 objets pour les deux périmètres envisagés ; elle n’active aucun fichier fictif.

Le registre `combat/costume-order.mjs` et le test `tests/combat-costume-order.test.mjs` ont été appliqués après la capture indépendante du décor. Le test épingle l’empreinte du fixture indépendant, compare les 472 IDs dans l’ordre, puis le SHA-256 de `JSON.stringify(COSTUMES.slice(0, 472))`. Huit tests ciblés sont passés, y compris la suite crossover existante ; la preuve datée est [costume-order-targeted-tests.json](costume-order-targeted-tests.json). Les deux vagues factices restent en mémoire uniquement. Cette première version du registre contenait les 43 IDs publiés ; les ajouts ultérieurs sont décrits dans le gel runtime ci-dessous.

## Conditions du prochain export

Le builder dédié `scripts/update-combat-continuation-b-workbook-20261120.mjs` est préparé et sa syntaxe a été contrôlée. Sa préparation des statuts exécutés exige le signal explicite de gel et les fichiers de preuves finaux. Aucun export n’a encore été lancé. Le périmètre prévu ajoute 66 lignes Production et 65 lignes QA, avec 50 plages de revue ; ces nombres seront vérifiés à partir des fichiers réels avant publication.

1. Recevoir le gel des manifests de génération, des actifs intégrés, du runtime et des preuves finales de QA, Canvas, intégrité, navigateur et revue visuelle.
2. Préparer une liste explicite des ajouts et des seules cellules historiques autorisées à évoluer ; préserver toutes les autres valeurs, notes et structures natives.
3. Recalculer et exporter via les API publiques du runtime tableur principal ; réimporter les 10 tables et les 42 formules, vérifier le recalcul d’un statut temporaire, puis comparer toutes les cellules natives.
4. Rendre et inspecter les zones modifiées avec une revue indépendante liée au SHA du XLSX final.
5. Installer ensemble le XLSX, son JSON et sa vérification avec `publishWorkbookArtifacts`, puis relire leurs empreintes. La preuve QA historique reste inchangée.

Les résultats de QA doivent conserver leur date, leur révision et leur portée. Une tentative navigateur bloquée reste Non exécuté ; aucune validation canonique ou physique ne sera ajoutée sans preuve correspondante. La publication distante relève du lot principal.

## Intégration runtime observée

Le [gel runtime](metarunner-runtime-freeze.json) consigne l’intégration des trois styles Meta Runner après les deux tenues Café. Le catalogue contient **477 costumes et 384 crossovers** ; les 472 objets publiés conservent leur ordre et leur sérialisation complète. Le registre d’extensions contient désormais 48 IDs : les 43 précédents, les deux Café, puis les trois Meta Runner.

Les **33 PNG Meta Runner représentent 28 018 143 octets**. Le préflight a vérifié les jobs exacts, y compris les jobs de correction des deux victoires, et toute leur chaîne de références. Son premier refus est conservé dans [metarunner-preflight-attempt-01.json](metarunner-preflight-attempt-01.json). L’installation réelle a réussi, puis sa relance a laissé **105 fichiers identiques**. Les huit tests exécutés dans le passage ciblé sont réussis ; les deux contrôles dépendant du manifeste hors ligne sont exclus de ce passage et attendent la campagne globale. Le premier essai de filtrage, qui les avait laissés s’exécuter et échouer sur l’ancien manifeste, reste archivé. Aucun résultat de cette vérification partielle n’est présenté comme une QA globale.

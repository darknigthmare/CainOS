# Classeur de suivi — continuation C, 20 novembre 2026

**Le classeur, son JSON compagnon et sa vérification ont été installés ensemble, puis leurs empreintes ont été relues.** Cette mise à jour ajoute les tenues Café de Ragatha, Gangle et Zooble au classeur publié après la continuation B. La [publication locale](publication.json) décrit l’installation des fichiers ; la publication GitHub du lot est suivie séparément.

Le [classeur Excel](../../../DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx), le [JSON de suivi](../../../combat-tracker-data.json) et le [rapport détaillé](workbook-review.json) décrivent le même export final.

## Résultat du suivi

| Élément | Base conservée | Résultat final | Ajout |
| --- | ---: | ---: | ---: |
| Cellules natives | 82 697 | 83 423 | 726 |
| Lignes Production | 3 308 | 3 344 | 36 |
| Lignes QA | 2 454 | 2 493 | 39 |
| Références | 161 | 164 | 3 |
| Feuilles | 11 | 11 | 0 |
| Tables natives | 10 | 10 | 0 |
| Formules | 42 | 42 | 0 |

Les 36 lignes Production ajoutées comprennent trois bilans de famille et **33 dessins individuels**. Les 39 lignes QA comprennent les contrôles de ces 33 dessins et six constats : inventaire, Canvas, tests et builds, intégrité, navigateur et export du classeur. Chaque dessin conserve son chemin actif, son reçu, ses dimensions, ses octets et son SHA-256 dans la [vérification des emplacements](asset-slot-verification.json).

L’ordre ajouté est `caferagatha`, `cafegangle`, `cafezooble`. Chacune possède onze PNG natifs : sélection, garde, introduction, attaque, attaque lourde, impact, marche, saut, accroupissement, victoire et défaite. Le lot totalise **33 PNG et 42 202 157 octets**. Aucun stade ni crossover n’est ajouté par cette continuation.

Les totaux visibles sont **54 combattants, 540 techniques, 480 costumes, 25 arènes communes et 54 arrangements à décor partagé**. Les costumes comprennent 51 variantes d’archives, 45 tenues Circus et 384 crossovers. Les tenues Circus disposent de **495 PNG**. Le manifeste de cette édition est `0.7.0-274a8da5b442`, art `6a11a21a795ee221`, avec **5 907 images / 3 215 944 062 octets**.

## Conservation de l’histoire et des notes

La [base figée](baseline-freeze.json) provient du commit local `d0b1c092120b2c472354b67ffbf136f6a58004c5`, publié dans la PR 9 sous `4229ce9e69b39c31b24bb296dc1c8e93bfc52852`. Son XLSX porte le SHA-256 `4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e`.

Le [plan final](update-plan.json) contraint les **82 697 cellules préexistantes**. Il liste précisément les **52 cellules historiques autorisées à évoluer** : totaux, formules de comptage, synthèse, fonctionnalités et source hors ligne. Les anciennes lignes Production et QA, les IDs, leur ordre, les notes, les styles et les structures sont conservés. Aucune hauteur de ligne historique n’a changé. Le pied de Références est décalé de trois lignes pour accueillir les trois nouvelles sources.

Le préfixe des **477 costumes précédents** est comparé à la base du lot, avec ses définitions et son ordre. Les 42 tenues Circus antérieures, les 384 crossovers et les 25 arènes restent conservés. Les 14 propriétaires historiques gardent leurs neuf séries complètes ; les six familles de Ribbit dans Murder Drones et Meta Runner restent en place. Les sept autres séries de Ribbit et les 39 autres PNJ promus restent manquants, soit 1 074 familles potentielles dans la grille actuelle. Les réserves antérieures de fidélité et les cycles d’animation complets restent ouverts.

## Vérification de l’export

Le [builder dédié](../../../../scripts/update-combat-continuation-c-workbook-20261120.mjs) utilise exclusivement les API publiques `@oai/artifact-tool` dans le runtime principal. Il reconstruit la copie contrainte, recalcule, exporte et réimporte. L’inspecteur XML lit uniquement les fichiers XLSX. Le [journal d’exécution](execution.json) relie les étapes terminées et leurs journaux.

- **42 formules recalculées, sans erreur.** Une variation temporaire de statut a fait varier les totaux attendus, puis a été annulée avant export.
- [Comparaison native](native-comparison.json) de **83 423 cellules**, avec leurs types, valeurs, formules, styles, dimensions, règles et structures : **zéro différence** avec le modèle approuvé.
- [Réimportation](reimport-result.json) des **10 tables et 42 formules**, avec comparaison de toutes les lignes au JSON compagnon ou à la table historique conservée.
- [Revue visuelle combinée](visual-review.json) de **27 vues finales** : sept vues de synthèse, fonctionnalités et références par [l’auteur du classeur](author-visual-review.json), vingt vues Production/QA par la [revue indépendante](independent-visual-review.json). Les fichiers, les plages et les dimensions figurent dans [l’inventaire des rendus](rendered-views.json).
- Quatre [vues de base](baseline-visual-review.json) ont été nouvellement rendues et inspectées avant l’extension. Elles ne sont pas comptées dans les 27 vues finales.

La mesure ponctuelle de mémoire résidente après export est de **1 116 135 424 octets** et celle après réimport et rendu de **653 504 512 octets**. Ces relevés ne sont pas des mesures du pic. Aucun historique n’a été supprimé pour réduire la mémoire.

Une première extraction native a rencontré **ENOSPC**, après l’export réussi. L’erreur et les journaux ont été [conservés](attempts/native-extraction-enospc/native-extraction-enospc.json). La libération des seules distributions temporaires reproductibles `dist` et `dist-combat`, après leurs vérifications, est documentée par le [lot principal](../build-output-cleanup.json). L’extraction et la comparaison ont ensuite été reprises avec succès ; les sources, PNG natifs, preuves et export du classeur sont restés intacts.

Les trois fichiers finaux ont été remplacés avec `publishWorkbookArtifacts`, après relecture des empreintes de la base, des 151 preuves du plan et des 33 PNG actifs. Le rapport installé conserve **154 empreintes de sources**, incluant les scripts de construction et de publication. La preuve QA historique `combat-qa-evidence-0.7.0.json` garde exactement ses octets.

## Preuves du jeu reprises avec leur portée

La [vérification finale du lot](../verification.json) rapporte **432 tests réussis sur 432, zéro échec ni test ignoré et deux builds réussis**. Elle inclut **60 contrôles Canvas des apparences**, trois portraits et trois scènes complémentaires. L’intégrité compare **66 copies de PNG, 38 copies de modules et 5 830 fichiers Encore historiques**. Ces résultats gardent leurs dates, versions et empreintes ; le builder du classeur ne les présente pas comme de nouvelles exécutions du jeu.

Le tableau QA final compte **2 473 réussites datées, zéro échec, 17 lignes Non exécuté, deux À vérifier et un constat historique Partiel**, soit 2 493 lignes. La tentative Chromium de cette continuation a été bloquée au lancement par une permission de socket, **avant navigation et avec zéro contrôle navigateur exécuté**. Les rendus Canvas restent distincts des interactions DOM, de l’audio et des périphériques physiques. La CI distante est suivie séparément.

Le premier essai global du lot, à 431 tests réussis sur 432, demeure archivé par le lot principal ; seule la seconde exécution réussie est reprise comme résultat courant. Le parseur du builder accepte les compteurs Node préfixés par `ℹ` comme ceux préfixés par `#`.

Les dessins statiques, la validation de mise en page et les tests techniques ne valent pas validation canonique plan par plan, cycles d’animation complets, essais matériels ou session Excel de bureau.

## Empreintes installées

| Fichier | SHA-256 |
| --- | --- |
| `DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx` | `c73e603bbf3418cc72cb3a866912780781217566d190765748d55fe8bf507842` |
| `combat-tracker-data.json` | `770c112140dd5ec4442cb0f61053b807e2aad52b8e0f6cfafa0e859f9eefb962` |
| `combat-workbook-verification.json` | `c22920f045ec275c1709ebf38756f22ef371cbecfb981ec0afd19c24353a1ae8` |

Le [contrôle d’installation](installation.json) relie ces fichiers aux rapports et aux 31 vues, dont quatre vues de base. Le plan final porte l’empreinte `b52d17ef37419232a175b51184d3d3bc5a2a2c2fdb077d76d2e069fa6b8f21ab`. Toute mise à jour suivante doit repartir de ce classeur installé, avec son propre plan et ses preuves.

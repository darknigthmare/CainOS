# Suivi Excel — passe gamedev du 29 octobre 2026

Le [classeur de suivi](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) intègre les guides retenus, l’audit technique des ressources et les régressions de commandes de cette passe. La campagne actuelle correspond au commit testé `6a80d1e5b25e74aa1b6012ff6b37e83cf25dd492`, sur la base historique `146a68cc87ea088a4dbcf76694115118fc9ed775`. La version du jeu reste `0.7.0`.

Les résultats détaillés sont liés dans la [preuve complète](combat-qa-evidence-gamedev-2026-10-29.json), la [validation ciblée](gamedev-validation-2026-10-29.json) et la [vérification du classeur](combat-workbook-verification.json).

## Modifications du suivi

| Élément | Avant | Après | Modification de cette passe |
| --- | ---: | ---: | --- |
| Feuilles | 10 | 10 | Organisation existante conservée |
| Tables Excel natives | 9 | 9 | Noms, styles et filtres conservés |
| Fonctionnalités | 102 | 105 | Trois lignes `PRD-GD-01` à `PRD-GD-03` |
| Production | 683 | 686 | `GD26-GUIDES`, `GD26-ASSETS`, `GD26-INPUT` |
| QA | 1 003 | 1 587 | 580 cas de la campagne complète et quatre contrôles ciblés |
| Références | 63 | 65 | Révision des guides et preuves de cette passe |

Les nouvelles fonctionnalités décrivent les guides versionnés, l’audit reproductible des ressources et la traçabilité du suivi. La ligne existante `CTL-06` conserve son ID et précise les comportements corrigés : annuler un contact actif sans attaque différée, conserver un tap relâché normalement, produire une seule pause pour deux pressions Start simultanées et attendre le retour au neutre de chaque manette suspendue. Le clavier et une autre manette neutre restent disponibles.

Les 1 003 anciennes lignes QA sont conservées à l’identique. Les données préexistantes de Combattants, Techniques, Arènes, Atlas, Production et Scénarios restent identiques. Les deux fichiers de preuves historiques, `combat-qa-evidence.json` et `combat-qa-evidence-0.7.0.json`, gardent leurs empreintes d’origine.

La synthèse distingue la campagne actuelle des lignes historiques. Les cas courants utilisent `GD26-N-` pour Node, `GD26-B-` pour Chromium et `GD26-C-` pour les quatre contrôles ciblés. Les anciens identifiants `CI07-` restent présents. Les [données JSON](combat-tracker-data.json) conservent également l’ancienne campagne dans `qaCampaigns`.

## Résultats actuels

La [campagne complète](combat-qa-evidence-gamedev-2026-10-29.json) contient **340 tests Node réussis sur 340, répartis dans 25 suites**, et **240 contrôles Chromium réussis sur 240, répartis dans 14 suites**.

Un premier essai de progression avait échoué parce que `dist-combat/index.html` manquait dans le checkout en mémoire. Après régénération des builds, sans changement des sources suivies ni du manifeste offline, cette suite a été exécutée entièrement avec 15 contrôles réussis. La preuve conserve l’échec initial et la provenance de la nouvelle exécution dans `retryHistory`. Seule la suite complète réussie entre dans les totaux ; les contrôles partiels de la première tentative ne sont pas additionnés.

Les [quatre contrôles ciblés](gamedev-validation-2026-10-29.json) sont réussis :

| Contrôle | Résultat consigné |
| --- | --- |
| Guides | 35 fichiers amont exacts, 40 liens locaux vérifiés, aucune erreur ; routeur et neuf guides retenus |
| Ressources | 44 PNG, 235 régions uniques, 56 cellules d’animation, 77 références avec alpha natif ; zéro violation |
| Commandes Node | 11 nouveaux cas réussis ; les mêmes cas reproduisaient sept échecs sur le fichier input de la base |
| Commandes Chromium | Six contrôles réussis, dont la pause simultanée et l’annulation de contact avant le tick |

Les 11 cas Node et les six contrôles Chromium de commandes sont compris dans les totaux de la campagne complète. Les quatre lignes ciblées servent de points de lecture et de provenance ; elles ne représentent pas quatre tests indépendants supplémentaires.

L’[audit des ressources](combat-asset-audit-gamedev-2026-10-29.json) porte sur 52 167 739 octets d’images et 249 références de régions. Il vérifie les fichiers, les rectangles, les enregistrements d’animation et la transparence selon les règles du renderer. Les revues de proportions, de fidélité canonique, de lisibilité en mouvement et les tâches de dessin conservent leurs statuts antérieurs. La validation des commandes emploie une Gamepad API simulée et un pointercancel synthétique ; aucun essai de téléphone ou de manette physique n’est ajouté à cette passe.

## Vérification du classeur

L’édition importe le classeur existant avec le runtime de tableur, puis ajoute les lignes aux tables natives. Les 11 lignes de la légende Références ont été déplacées de deux lignes pour faire place aux nouvelles sources, y compris la ligne « Limites QA ».

Les contrôles de cette passe ont confirmé :

- 39 formules recalculées et 39 valeurs de synthèse vérifiées ; aucune erreur de formule.
- Une modification temporaire de statut fait varier le total correspondant, puis le retour à la valeur initiale restaure ce total.
- Les identifiants, l’ordre des anciennes lignes, les colonnes de notes et les formules existantes sont conservés après export et réimport. Aucune note utilisateur non vide n’était présente dans le classeur de départ.
- Une comparaison OOXML en lecture seule a vérifié les formats de 28 813 cellules d’origine, ainsi que les colonnes, vues et formats des feuilles : aucune différence de style.
- Sept rendus ont été inspectés : synthèse, nouvelles fonctionnalités, CTL-06, production, QA actuelle, QA ciblée et références avec leur légende.
- Une seconde génération isolée avec les mêmes preuves a ajouté zéro ligne et modifié zéro cellule de données existante. Son JSON de données est identique octet pour octet au premier export.

Empreinte SHA-256 des données après les deux générations :

```text
8aab7106a57456b13356f19d255a444f8cff3a8d788f515f2241d015e995438c
```

Empreinte SHA-256 du classeur publié :

```text
b04a95210edb11cf68aa033216cecaf3d83c8e2bfac21d9a8605d3a02c51817d
```

Le classeur n’a pas été ouvert dans Excel de bureau. Les vérifications portent sur le recalcul, les données, les tables, les styles, le rendu et l’export/réimport du fichier XLSX.

## Génération et publication

Le générateur est [scripts/update-combat-workbook-gamedev.mjs](../scripts/update-combat-workbook-gamedev.mjs). Dans l’environnement disposant du runtime primaire de tableur :

```sh
"$CODEX_PRIMARY_RUNTIME_NODE" scripts/update-combat-workbook-gamedev.mjs \
  --repo-root "$PWD" \
  --ci-evidence audit-combat/ci/evidence-0.7.0.json \
  --gamedev-evidence docs/gamedev-validation-2026-10-29.json \
  --output-dir ../outputs/gamedev-20261029 \
  --publish
```

Le générateur exige des preuves complètes, des empreintes à jour et un commit testé identique à HEAD au moment de la génération. La répétition de cette passe a été vérifiée avant le commit des livrables.

Quatre fichiers ont été publiés ensemble par le mécanisme existant de sauvegarde et de restauration sur échec : le XLSX, ses données JSON, sa vérification et la nouvelle preuve CI nommée pour cette passe. Leurs octets ont été comparés aux sorties vérifiées après copie. Les remplacements individuels sont atomiques ; l’ensemble des quatre remplacements ne constitue pas une transaction simultanément visible. Les garanties détaillées restent celles de [COMBAT_WORKBOOK_PUBLICATION.md](COMBAT_WORKBOOK_PUBLICATION.md).

# Préparation du classeur — continuation C

> Archive de préparation : les cibles ci-dessous ont ensuite été atteintes. Voir le [bilan final](README.md), la [publication locale](publication.json) et les [contrôles d’installation](installation.json). Le texte conserve la portée et les conditions connues avant export.

La base de cette mise à jour est le classeur de `d0b1c09`, publié dans la PR 9 sous `4229ce9e`. Les quatre fichiers de suivi sont copiés dans un dossier de travail distinct et liés par leurs empreintes dans [baseline-freeze.json](baseline-freeze.json). Aucun fichier final de suivi n’est remplacé pendant la préparation.

## Base effectivement vérifiée

- 3 308 lignes Production, 2 454 lignes QA et 161 références.
- 82 697 cellules, onze feuilles, dix tables natives et 42 formules.
- XLSX de départ : `4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e`.
- JSON compagnon : `839790a0a128e09573e0c1578ccecc46e1dc20819c75108650c666a2aeabb352`.
- Extraction XML en lecture seule terminée ; quatre vues nouvellement rendues et inspectées : Synthèse, Production, QA et légende Références. Voir [la revue de la base](baseline-visual-review.json).

Le rendu de la base a terminé sans erreur. La dernière mesure ponctuelle de mémoire résidente est de 622 522 368 octets ; ce relevé n’est pas une mesure du pic.

## Extension prévue

Le nouveau builder couvre `caferagatha`, `cafegangle`, `cafezooble`, dans cet ordre. Il conserve les 477 objets de costume précédents et leurs positions, les 42 familles Circus antérieures, les 384 crossovers et les 25 arènes.

| Élément | Base | Ajout prévu | Cible à vérifier |
| --- | ---: | ---: | ---: |
| Production | 3 308 | 36 | 3 344 |
| QA | 2 454 | 39 | 2 493 |
| Références | 161 | 3 | 164 |
| Cellules natives | 82 697 | 726 | 83 423 |
| Costumes actifs | 477 | 3 | 480 |
| Familles Circus | 42 | 3 | 45 |
| PNG des familles Circus | 462 | 33 | 495 |

Les 36 lignes Production prévues comprennent trois bilans de famille et 33 dessins individuels. Les 39 lignes QA prévues comprennent leurs 33 contrôles individuels et six constats : inventaire, Canvas, tests et builds, intégrité, statut navigateur et vérification du classeur. Les réserves de fidélité et d’animation restent ouvertes.

## Conditions de préparation et de publication

Les cibles ci-dessus ne sont pas des résultats exécutés. Le mode `--prepare --final-evidence-confirmed` attend les preuves finales du lot et vérifie les reçus, les archives, les copies actives, les empreintes des références, le préfixe des costumes et le manifeste hors ligne. Les champs de la preuve consolidée seront raccordés à sa structure finale observée avant exécution.

L’export utilise uniquement les API publiques de `@oai/artifact-tool` dans le runtime principal. Le snapshot XML reste un outil de lecture et de comparaison. La construction reprend les cellules et leur mise en forme, prolonge les tableaux Production/QA/Références et les plages des formules concernées. Le pied de Références est décalé de trois lignes ; aucune ancienne ligne Production ou QA n’est réécrite.

La publication attend le recalcul des 42 formules, une variation temporaire de statut annulée, la comparaison native de toutes les cellules, la réimportation des dix tables et la revue de toutes les vues affectées. Les trois résultats actuels seront remplacés ensemble par `publishWorkbookArtifacts`. La preuve QA historique `combat-qa-evidence-0.7.0.json` reste conservée.

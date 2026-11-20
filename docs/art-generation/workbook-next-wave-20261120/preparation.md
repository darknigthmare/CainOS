# Préparation du classeur — nouvelle vague du 20 novembre 2026

Ce document décrit le périmètre autorisé avant le gel des preuves finales. Il ne déclare ni le nouvel export effectué, ni les contrôles du jeu réussis. Le builder refuse la préparation finale sans le drapeau explicite de gel et les preuves correspondantes.

## Base conservée

- XLSX courant : SHA-256 `048d758f614daf1ad388a12fed5955b853734c2c1c47d92fb7a6e493512eea12`.
- Compagnon JSON courant : SHA-256 `868975a52cb6e4f28adbf4bb98e957f142deef7a240472c4879c7c2c148feb56`.
- Extraction native initiale : 80 346 cellules, 11 feuilles, 10 tables, 42 formules.
- Registre initial : 3 188 lignes Production, 2 335 lignes QA, 153 sources.

Les quatre fichiers de base sont copiés et identifiés dans `baseline-freeze.json` du dossier de travail. Les anciennes preuves et les lignes historiques gardent leurs dates, leurs IDs, leur ordre et leurs notes.

## Périmètre prévu

| Ordre de suivi | Apparence | Famille | PNG prévus |
|---|---|---|---:|
| 1 | `caferibbit` | Tenue Circus | 11 |
| 2 | `glitch-murderdrones-ribbit-hommage` | Costume crossover original | 11 |
| 3 | `glitch-murderdrones-ribbit-resident` | Costume crossover original | 11 |
| 4 | `glitch-murderdrones-ribbit-fusion` | Costume crossover original | 11 |

La nouvelle arène `barnoir` doit être ajoutée après les 23 scènes existantes, avec trois plans natifs. Les 54 arrangements par combattant restent des réemplois. Chaque nouveau dessin aura sa propre ligne Production et sa propre QA, avec chemin actif, dimensions, octets, empreinte et reçu. Les lignes de dessins ne compteront pas comme des costumes supplémentaires.

Le suivi des crossovers conservera la couverture des 14 propriétaires historiques. Ribbit n’aura que les trois styles Murder Drones ; ses huit autres séries et les 39 autres PNJ promus resteront ouverts. La famille Café comptera parmi les tenues Circus, pas parmi les crossovers.

La correction des mains est enregistrée comme une harmonisation artistique de ces nouveaux designs à trois doigts ou lobes. Elle n’est pas attribuée à la peluche Iconic, qui ne détaille pas les doigts, ni à la garde historique, qui montre quatre extrémités. La [correction de portée](../npc-crossovers-next-wave-20261120/hommage/hand-count-scope-addendum.md) sera liée aux nouvelles familles et à leur référence dans le registre.

## Changements historiques permis

Le futur `update-plan.json` listera les cellules exactes autorisées à changer :

- Les valeurs et bornes des 42 formules de Synthèse, ainsi que les textes de portée de cette vague.
- Les compteurs périmés des fonctionnalités `PRE-02`, `PRE-03`, `PRD-11`, `PRE-09`, `PRE-17` et `PRE-21`, avec conservation de leurs IDs, statuts et notes.
- Les descriptions de portée des sources hors ligne, musique et ambiances.
- Le déplacement sans perte du pied de Références après les nouvelles sources.

Les 3 188 lignes de Production et 2 335 lignes de QA initiales restent identiques. La correction de Jax australien — short confirmé, pieds masqués — est déjà présente et reste « À vérifier ». Les autres références incomplètes ne sont pas fermées.

## Séquence de publication

Après le signal final : vérifier les preuves et leurs empreintes, préparer le modèle contraint, reconstruire par les API publiques de `@oai/artifact-tool`, recalculer les 42 formules, vérifier une variation temporaire de statut puis la restaurer, exporter, réimporter, comparer toutes les cellules natives et les dix tables, rendre et inspecter les zones modifiées, puis installer ensemble les trois fichiers du suivi par `publishWorkbookArtifacts`.

Le constructeur est [update-combat-next-wave-workbook-20261120.mjs](../../../scripts/update-combat-next-wave-workbook-20261120.mjs). Aucun classeur n’est écrit par Python ou par modification directe du ZIP/XML ; l’inspecteur natif reste en lecture seule.

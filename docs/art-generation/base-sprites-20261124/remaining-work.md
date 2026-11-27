# Travaux ouverts après les sprites de base — 24 novembre 2026

Cette passe répond à la demande de **sprites de base sans nouvelle animation**.
Elle ajoute 24 apparences : six adaptations de références officielles et dix-huit
crossovers originaux de Ribbit. Chaque apparition attend exactement deux fichiers,
`selection.png` et `stance.png`. Le
[relevé des fichiers](asset-inventory.json) et les revues de chaque famille
décrivent ce qui a réellement été produit.

## Couverture du catalogue

Les 64 combattants et les 484 tenues de la version de départ possédaient déjà
leurs bases de sélection et de garde. Les 68 autres entrées d’archive avaient
également leur portrait individuel ; elles ne sont pas transformées en
combattants par cette passe. L’[inventaire initial](base-inventory.json) conserve
cette distinction et évite de compter des images déjà présentes comme manquantes.

Ribbit dispose maintenant des bases de ses **27 crossovers** dans neuf univers :
Murder Drones, Meta Runner, Sunset Paradise, The Gaslight District, Knights of
Guinevere, Gameoverse, Lackadaisy, SMG4 et Ultra Jump Mania. Les neuf tenues des
trois premières collections gardent leurs onze dessins antérieurs. Les dix-huit
nouvelles ont seulement les deux bases demandées.

Les **39 autres PNJ de l’extension historique** n’ont pas encore ces collections :
cela représente **1 053 combinaisons possibles** à concevoir si les neuf univers
et trois styles sont étendus à chacun. Ce chiffre concerne ce sous-ensemble,
pas une promesse que tout le catalogue de créations possibles serait fini.
Les dix abstractions ajoutées auparavant ne reçoivent pas automatiquement
vingt-sept crossovers chacune.

## Références encore insuffisantes

| Candidat | Limite encore présente | Preuve ou décision nécessaire |
| --- | --- | --- |
| Maid Ribbit — Pendantz | Les jambes et chaussures restent masquées dans les vues inspectées. Café Ribbit est une autre tenue. | Une vue primaire lisible du bas du costume. [Revue historique](../ribbit-candidates-20261120/reference-review.md). |
| Jax australien | Le short kaki et les jambes violettes sont documentés ; les pieds ne le sont pas. | Un plan primaire montrant chevilles et pieds. [Revue historique](../cast-next-missing-20261120/candidate-review-australianjax.md). |
| Plusieurs assemblages de Zooble dans les épisodes | Les nouveaux extraits examinés montrent des visages et des parties de corps ; plusieurs terminaisons ou attaches restent cachées. | Des vues suffisamment complètes avant un sprite entier. [Relevé de cette passe](reference-review/zooble-reference-retrieval.json). |
| Autres Gangle et costumes des registres antérieurs | L’identité, les doublons ou des parties de la tenue restent à qualifier. | Comparaisons primaires propres à chaque candidat. [Registre antérieur](../continuation-20261120-c/remaining-work.md). |
| Fidélité des abstractions | Leurs bases et dessins de jeu existent ; plusieurs attributions et détails artistiques restent à confronter aux plans officiels. | [Comparaisons encore ouvertes](../abstractions-20261124/remaining-work.md#fidélité-des-abstractions). |

**Contortionist Zooble** et **Hotdog Cart Abel** sortent de cette file pour leur
composition statique visible seulement : le premier reste replié, le second
garde son chariot et ses occultations. Aucune vue dépliée, jambe cachée ou rotation
inconnue n’est établie. Les variantes Café Jax, Café Caine, Ribbit-Suit Jax et
Zooble cocktail ont également leur propre paire de bases dans cette passe.

## Animation et actions

Aucun dessin d’action supplémentaire ni cycle animé n’est demandé ou ajouté.
Le moteur conserve le sprite de garde de la nouvelle tenue pendant les autres
états, sans respiration dessinée, inclinaison, découpe de membres ou déformation
de pose. Le déplacement et le retournement de l’acteur suivent la simulation
existante. Les règles de combat et les anciennes présentations restent séparées
de ce contrat de dessin statique.

Les 216 éventuels dessins d’action des 24 nouvelles apparences ne sont
**pas des fichiers manquants du livrable actuel**. Ils constituent un autre
périmètre si des poses ou animations sont demandées plus tard.

## Limites de validation

Les références officielles identifient un design visible ; elles ne rendent pas
canonique chaque illustration de jeu. Les dix-huit tenues crossover sont des
créations originales d’Encore. Une équivalence canonique générale ou une
superposition pixel à pixel 1:1 n’est pas certifiée.

Les résultats de la campagne courante sont consignés dans
[verification.json](verification.json), avec les empreintes du runtime testé.
La revue Canvas montre le rendu de production et ses limites ; elle ne remplace
pas les interactions DOM, clavier, tactile, manette, audio ou les essais sur
appareils physiques. Les statuts GitHub Actions et des aperçus sont liés au SHA
publié dans la PR. Les résultats des lots précédents restent conservés à leur
date et ne sont pas réécrits comme résultats de cette passe.

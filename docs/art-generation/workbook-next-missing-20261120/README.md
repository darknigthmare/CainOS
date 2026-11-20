# Mise à jour du suivi — prochains manquants, 20 novembre 2026

Le classeur installé reprend la version réconciliée du 20 novembre et y ajoute le lot de quatre apparences ainsi que l’arène **Sous la carte**. Les trois fichiers installés ensemble sont le XLSX, son compagnon JSON et le rapport de vérification. Les empreintes finales figurent dans [publication.json](publication.json).

## Contenu ajouté

| Ordre | ID | Apparence | PNG individuels |
|---|---|---|---:|
| 1 | `watermelongangle` | Gangle — Pastèque | 11 |
| 2 | `aquablasterpomni` | Pomni — Aqua Blaster | 11 |
| 3 | `ptocaine` | Caine — Congés | 11 |
| 4 | `freakjax` | Jax — Freak Jax | 11 |

Les 44 dessins occupent chacun une ligne **Dessin de tenue** dans Production et une ligne de QA individuelle. Le chemin actif, les dimensions, la taille en octets, l’empreinte SHA-256 et le reçu natif sont conservés. Les quatre lignes **Tenue Circus** comptent les familles ; les lignes de dessins ne font donc pas compter les costumes plusieurs fois. Les 44 couples sont contrôlés par [asset-slot-verification.json](asset-slot-verification.json).

L’arène `undermap` est ajoutée après les 22 scènes existantes. Elle possède trois PNG natifs de 1672 × 941 pixels, un thème musical, une ambiance sonore et une pulsation visuelle. Six lignes de Production documentent ce travail. Les références `ep2` et `glitch-undermap` étaient déjà présentes ; les 54 arrangements par combattant restent des réemplois des décors partagés.

| Mesure | Avant | Après |
|---|---:|---:|
| Combattants | 54 | 54 |
| Techniques | 540 | 540 |
| Costumes équipables | 464 | 468 |
| Apparences supplémentaires | 35 | 39 |
| PNG de ces apparences | 385 | 429 |
| Arènes partagées | 22 | 23 |
| Images du manifeste hors ligne | 5 722 | 5 769 |
| Lignes Production | 3 134 | 3 188 |
| Lignes QA | 2 281 | 2 335 |
| Références | 149 | 153 |

Le manifeste final contient **3 059 080 660 octets**, version `0.7.0-cdc85685a728`, art `cb628ae846008788`.

## Continuité du classeur

La base est le fichier installé réconcilié, SHA-256 `aea3c94ea5921f9ed1fd0a4c46b769587c338b2a63d4d70fef8f18a70b0dda5a`. L’ancien checkpoint préparé avant le blocage mémoire n’est pas utilisé. [baseline-freeze.json](baseline-freeze.json) identifie cette base et ses trois compagnons historiques.

Les **11 feuilles**, **10 tables**, **42 formules**, IDs, ordre des lignes, notes utilisateur, styles, largeurs, volets figés et règles historiques sont préservés. Les 79 280 cellules historiques sont comparées à la base, avec une liste explicite des changements permis : synthèse et bornes de formules, portée du manifeste hors ligne, correction de la référence australienne de Jax. Le pied de la feuille Références est déplacé de quatre lignes sans perte de contenu.

La ligne `SERIES-jax__australian_extremist` indique désormais **short kaki confirmé ; pieds encore masqués**. Elle reste **À vérifier**, et sa note utilisateur est conservée. Maid Ribbit demeure à qualifier ; aucune partie cachée n’est déclarée complète. Les recherches sur Noir Gangle, Contortionist Zooble et les autres candidates restent liées aux preuves du lot.

L’historique de QA est conservé intégralement. La nouvelle campagne n’additionne pas les nombres de tests d’anciennes révisions. Les couvertures et revues d’apparences précédentes restent dans leur historique ; le rapport de réconciliation antérieur est conservé dans son dossier.

## Vérification du fichier publié

Le builder [update-combat-next-missing-workbook-20261120.mjs](../../../scripts/update-combat-next-missing-workbook-20261120.mjs) reconstruit le classeur par les API publiques de `@oai/artifact-tool`, depuis une extraction native contrainte de la base. L’inspecteur XML existant est utilisé uniquement en lecture. Aucun XLSX n’est écrit ou retouché par Python ou par modification directe du ZIP/XML.

Les contrôles effectués portent sur :

- **80 346 cellules natives** : contenus, types, formules, styles effectifs et structure.
- **42 formules** recalculées, puis relues après export ; aucune erreur. Une modification temporaire d’un statut vérifie la variation des compteurs avant rétablissement de sa valeur.
- Toutes les données des **dix tables** après réimport.
- Les **44 emplacements** de dessins, leurs reçus, leurs archives et leur présence hors ligne ; les 47 nouveaux PNG actifs sont revérifiés avant installation.
- **36 vues des zones modifiées**, plus six vues initiales. Les textes, statuts, notes et références sont examinés.
- Les trois fichiers installés par le protocole de publication groupée ; leurs empreintes sont relues. `combat-qa-evidence-0.7.0.json` reste identique à la base.

La première revue a demandé deux corrections, conservées dans [initial-native-comparison.json](initial-native-comparison.json) et [initial-visual-review.json](initial-visual-review.json) : normaliser les adresses de cellules uniques des validations (`C28`, `D28`, `K28`) et augmenter la hauteur des 44 nouvelles lignes de dessins pour afficher leurs empreintes et chemins complets. L’export final est à nouveau réimporté, comparé et rendu après ces corrections.

Une seconde revue indépendante a inspecté les 36 vues finales et trois vues initiales de comparaison ; elle n’a relevé aucun défaut concret. Sa portée et ses empreintes sont conservées dans [independent-visual-review.json](independent-visual-review.json).

Les résultats finaux sont dans [workbook-review.json](workbook-review.json), [native-comparison.json](native-comparison.json), [reimport-result.json](reimport-result.json) et [visual-review.json](visual-review.json). [update-plan.json](update-plan.json) énumère chaque ajout et chaque cellule historique autorisée à changer ; [native-snapshot-hashes.json](native-snapshot-hashes.json) lie les extractions aux fichiers contrôlés.

## Portée des preuves du jeu

Les preuves gelées du lot enregistrent **411 tests Node réussis, zéro échec et deux constructions réussies**, **80 vérifications Canvas des costumes**, **six vues Canvas de l’arène**, **94 comparaisons de PNG**, **32 comparaisons de modules** et **5 678 fichiers Encore historiques intacts**. Ces résultats ont été importés depuis la [vérification consolidée du lot](../cast-next-missing-20261120/verification.json) avec leurs empreintes ; la mise à jour du classeur ne se présente pas comme une nouvelle exécution de ces tests.

Aucune campagne navigateur locale n’a été réexécutée pour cette révision. Les essais physiques, les cycles animés complets et la comparaison canonique de chaque plan restent ouverts. Les dimensions natives de l’arène sont indiquées telles que rendues, sans revendication 4K. La publication GitHub et sa CI sont documentées séparément par le lot principal.

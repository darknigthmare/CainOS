# Abstractions, projectiles et arènes originales — 24 novembre 2026

Ce dossier réunit les preuves du lot partagé par CainOS et le jeu autonome Encore.
Le [bilan](../../encore-abstractions-20261124.md) présente les changements ; le
[registre des travaux ouverts](remaining-work.md) conserve les limites.

## Inventaire principal

| Famille | Fichiers actifs | Portée |
| --- | ---: | --- |
| Dix combattants abstraits et Queenie calme | 121 PNG | Onze apparences, onze états chacune ; six portraits publiés sont réutilisés à l'identique. |
| Projectiles | 15 PNG | Motifs dédiés et motifs partagés explicitement, avec orientation au tir et au renvoi. |
| Deux arènes originales | 6 PNG | Fond, plan médian et premier plan pour chacune. |
| **Total principal** | **142 PNG** | **136 ajouts natifs et six portraits repris sans modification.** |

L'[inventaire natif](asset-inventory.json) vérifie les octets, dimensions, modes,
alphas et marges contre les sorties réellement conservées. Il ne certifie pas une
fidélité canonique 1:1. Les reçus `receipts/`, `originals/` et `projectiles/`
conservent les prompts, références et empreintes. Les copies actives du dépôt sont
les PNG natifs ; aucune étape de découpage ou de réencodage n'est appliquée.

## Revues de production

- [Personnages : 99 actions, 11 gardes, 11 portraits et 220 contrôles](canvas/characters/README.md).
- [Projectiles : 15 motifs, tirs et renvois](projectiles/README.md).
- [Décors et scènes de duel](canvas/stages/stages-overview.jpg), avec le [rapport des plans et caméras](canvas/stages/stage-canvas-review.json).
- [Queenie calme : identité de costume et revue des onze PNG](calm-asset-review.json).
- [Conservation des 5 911 assets publiés, dont 5 863 Encore](existing-assets-preservation.json).
- [Tentative Chromium locale](canvas/browser-attempt.json).

Les images Canvas sont des captures du renderer de production sous Node/Skia.
Les plans du décor sont des compositions de caméra et des duels initialisés, sans
revendiquer un match joué dans un navigateur.

## Lot complémentaire Ribbit × Sunset Paradise

Les trois styles et leurs trente-trois PNG sont documentés dans le
[dossier séparé](../sunsetparadise-ribbit-20261124/README.md). Ils s'ajoutent à
l'inventaire principal et ne sont pas recomptés parmi les 142 fichiers.

L'[inventaire combiné](delivery-assets.json) contrôle les **175 fichiers actifs /
156 157 497 octets** : 169 ajouts natifs et six portraits déjà publiés.

## Vérification finale

Le [bilan des sources finales](verification.json) relie les résultats à leurs
empreintes : **461 tests réussis, aucun échec ni test ignoré**, ainsi que les
deux builds complets. Le jeu autonome comprend 6 147 fichiers vérifiés et
CainOS 6 151 ; chacun embarque 6 082 illustrations et 63 fichiers du jeu.
La comparaison SHA-256 avec les sources ne relève aucune différence.

- [Résultat complet de la suite Node](qa-summary.json).
- [Build autonome](standalone-build-verification.json).
- [Build CainOS](cainos-build-verification.json).
- [Calibration des tailles et ancres](canvas/width-calibration.md).

Ces vérifications ne certifient ni les interactions navigateur ni la fidélité
canonique 1:1. La tentative Chromium, bloquée avant ouverture de page, reste
consignée séparément.

## Reprise et traçabilité

Les contrôles de ce dossier ont été repris sur les fichiers présents après la
restauration de l'environnement. Les résultats anciens restent attachés à leurs
sources historiques. Les programmes de référence du test de reprise ont été
reconstruits à partir du socle publié resté inchangé ; ils ne sont pas présentés
comme des fichiers de test sauvés octet pour octet avant l'incident.


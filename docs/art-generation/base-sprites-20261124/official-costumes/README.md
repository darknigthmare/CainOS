# Quatre apparences officielles — bases statiques

Cette passe livre huit PNG : un portrait de sélection et une garde pour chacune des quatre apparences ci-dessous. Les références primaires ont été ouvertes et examinées avant génération. Les fichiers de jeu conservent les octets natifs de la génération ; aucun redimensionnement, nettoyage d’alpha ou recoloriage n’a été appliqué après livraison du modèle.

| Famille | Source primaire | Composition conservée |
| --- | --- | --- |
| `contortionistzooble` | [GLITCH — Animiniz Side Show Series](https://glitchproductions.store/products/digital-circus-animiniz-side-show-series) | Assemblage replié complet, pièces et recouvrements visibles. Aucune version debout ni articulation cachée reconstruite. |
| `hotdogabel` | [GLITCH — Animiniz Beach Vacation Series](https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series) | Abel et son chariot restent indivisibles, avec roues, accessoires et jambes masquées. |
| `cafejax` | [Annonce officielle Animate / DECOTTO](https://prtimes.jp/main/html/rd/p/000008857.000016756.html) | Deux grands nœuds latéraux du tablier, coiffe et gros nœud bleu nuit, fermoirs jaunes, plateau et tasse. Le visuel marchandises isolé confirme les éléments cachés par les voisins dans l’affiche principale. |
| `cafecaine` | [Annonce officielle Animate / DECOTTO](https://prtimes.jp/main/html/rd/p/000008857.000016756.html) | Dentier, nœud derrière la tête, tenue de service, jambes repliées, théière, filet de thé et tasse. La rangée de dents supérieure n’est pas assimilée à une coiffe ajoutée. |

Les tenues Café ont été comparées aux apparences `maidjax` et `ringmastercaine` déjà publiées ; leurs accessoires et assemblages sont distincts. Il s’agit d’apparences commerciales ou de collaboration officielles, sans affirmation d’une apparition équivalente dans un épisode.

## Limite du contrat

Les deux slots attendus sont `selection` et `stance`. Aucun dessin d’action, cycle animé, angle arrière ou membre masqué n’a été demandé. Les états de jeu utilisent la garde fixe de la même famille ; cette utilisation ne crée pas neuf dessins manquants. Le miroir vers la gauche est une convention du jeu et ne prétend pas fournir une seconde vue officielle.

La garde contient la composition entière. Les portraits de Zooble contorsionniste et d’Abel conservent également leurs ensembles complets. Le portrait de Jax coupe volontairement les jambes sous le tablier ; ce cadrage est enregistré dans l’audit. Les proportions sont conservées par échelle uniforme. La comparaison porte sur les références visibles, sans certification pixel à pixel.

## Preuves

- `catalog-proposals.json` : noms, sources, distinctions et limites de vue.
- `generation-receipt.json` : prompts, références, sorties natives et tentatives acceptées ou rejetées. La première garde d’Abel a été remplacée pour retrouver une marge sous la roue.
- `asset-audit.json` : huit fichiers, 8 886 223 octets, SHA-256, dimensions, alpha, cadrage et revue de silhouette. Les faibles valeurs d’alpha natives sont conservées.
- `blob-manifest.json` : huit objets Git immuables vérifiés. Ce manifeste ne déplace aucune référence de branche.
- `../reference-review/` : images sources, extraits exacts de référence et provenance. Ces extraits ne sont pas des fichiers de jeu.

Les deux autres apparences officielles de cette passe, Ribbit-Suit Jax et Zooble au cocktail, disposent de leur propre inventaire sous `../root-official/`. Les dix-huit costumes crossover de Ribbit sont des créations originales, recensées séparément sous `../crossovers/`.

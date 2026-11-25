# Travaux ouverts après la continuation du 25 novembre 2026

État historique après le lot A. Les 18 apparences Queenie ci-dessous ont été
complétées lors de la reprise suivante ; consulter désormais le
[registre actuel A + B](../base-sprites-20261125-b/remaining-work.md).

Le lot courant contient **32 nouvelles images de base**, sans animation. Le
[détail de la livraison](README.md) et l'[inventaire](asset-inventory.json)
identifient les fichiers effectivement produits. Le périmètre plus large de
création de costumes n'est pas déclaré terminé.

## Collections originales encore possibles

Ribbit dispose déjà des bases de ses 27 crossovers dans neuf univers. Queenie
reçoit ici neuf tenues : trois styles dans Murder Drones, Meta Runner et Sunset
Paradise. Il lui reste **18 combinaisons** pour The Gaslight District, Knights
of Guinevere, Gameoverse, Lackadaisy, SMG4 et Ultra Jump Mania.

Les **38 autres PNJ de l'extension historique** n'ont pas encore ces
collections, soit **1 026 combinaisons possibles** si neuf univers et trois
styles sont étendus à chacun. Avec les 18 restantes de Queenie, ce sous-ensemble
représente **1 044 combinaisons encore non réalisées**. Ce calcul définit une
file de créations possibles ; il ne transforme pas un dessin original en
variante officielle manquante. Les dix abstractions ne reçoivent pas
automatiquement 27 crossovers chacune.

## Références officielles à compléter

| Sujet | État après cette passe |
| --- | --- |
| Maid Ribbit — Pendantz | Sa composition statique visible est livrée. Les jambes et chaussures masquées ne sont toujours pas établies et ne sont pas inventées. Café Ribbit reste une autre tenue. |
| Jax australien | Les références examinées ne suffisent pas à établir les pieds ; le sprite entier reste à qualifier. Voir la [revue historique](../cast-next-missing-20261120/candidate-review-australianjax.md). |
| Autres assemblages de Zooble | Plusieurs attaches ou terminaisons sont cachées dans les références disponibles ; conserver les [candidats historiques](../base-sprites-20261124/reference-review/zooble-reference-retrieval.json) jusqu'à une vue primaire suffisamment complète. |
| Autres costumes et formes de Gangle | L'identité, les doublons et la complétude des vues restent à examiner dans le [registre antérieur](../continuation-20261120-c/remaining-work.md). |
| Attributions des abstractions | Les fichiers de jeu existent, mais les attributions incertaines et les détails visuels restent ouverts dans la [revue dédiée](../abstractions-20261124/remaining-work.md#fidélité-des-abstractions). |

Les cinq nouvelles adaptations officielles sont documentées dans
[leur manifeste](official/manifest.json). Ce sont des dessins de jeu fondés sur
les références visibles ; une certification canonique ou pixel à pixel 1:1
n'est pas revendiquée.

## Projectiles et scènes

Quatre propriétaires ont désormais un motif dédié : Queenie, Ribbit, Kaufmo et
Ming. D'autres personnages partagent encore les motifs documentés par
[`combat/projectile-art.mjs`](../../../combat/projectile-art.mjs). Leur création
éventuelle reste une extension artistique distincte, sans blocage fonctionnel
ni fichier de projectile déclaré mais absent.

Les 27 arènes partagées et les neuf arènes crossover possèdent déjà leurs plans
actifs. Cette passe n'annonce aucun nouveau stage. Les dix tableaux finaux
d'abstraction réutilisent une scène existante avec une narration cohérente,
pour obtenir six tableaux distincts par route.

## Animation

Aucun cycle animé ni dessin d'action supplémentaire n'a été demandé dans cette
passe. Les gardes des nouvelles apparences sont volontairement statiques pendant
les actions. Les **126 éventuelles poses d'action** de ces 14 apparences ne
sont donc pas comptées comme des fichiers manquants du livrable courant.

## Vérifications encore distinctes

Les contrôles Node, Canvas, classeur et fichiers des builds sont consignés dans
[verification.json](verification.json). Chromium n'a pas pu être installé
localement (téléchargement refusé HTTP 403), donc aucun succès DOM, clavier,
tactile, manette, audio ou service worker local n'est revendiqué. Les résultats
GitHub Actions doivent être lus sur le SHA exact de la publication ; les
résultats d'un ancien commit ne sont pas présentés comme ceux du nouveau lot.

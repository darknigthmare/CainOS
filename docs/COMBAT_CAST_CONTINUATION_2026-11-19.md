# Huit variantes et reprise de la PR — 19 novembre 2026

Cette suite reprend le checkpoint local `90ae3c2` et ajoute huit apparences au vestiaire d’Encore. La récupération du checkpoint remet également dans la PR #7 les fichiers de personnages, de scènes et de suivi qui étaient restés locaux.

## Huit variantes, 88 dessins individuels

| Apparence | Personnage propriétaire | Référence inspectée | Dessins |
| --- | --- | --- | ---: |
| Pomni — Présidente | Pomni | GLITCH, Animiniz Costume Adventure | 11 |
| Pomni — Plage | Pomni | GLITCH, Beach Pomni Plush | 11 |
| Ragatha — Film noir | Ragatha | GLITCH, Noir Ragatha Plush | 11 |
| Ragatha — Nageuse | Ragatha | GLITCH, Animiniz Beach Vacation, Swimmer Ragatha | 11 |
| Zooble — Film noir | Zooble | GLITCH, Animiniz Costume Adventure | 11 |
| Zooble — Plongée | Zooble | GLITCH, Animiniz Beach Vacation, Snorkeler Zooble | 11 |
| Jax — Plage | Jax | GLITCH, Animiniz Beach Vacation, Jax au coquillage | 11 |
| Kinger — Château de sable | Kinger | GLITCH, Animiniz Beach Vacation, Sand Castle Kinger | 11 |
| **Total** | **Cinq personnages, huit tenues** | | **88** |

Chaque série comprend un portrait de sélection, une garde, une entrée, une attaque,
un coup lourd, une réaction à l’impact, une marche, un saut, un accroupissement,
une victoire et une défaite. Chaque fichier contient un personnage entier.
Les PNG sont les sorties natives du générateur : les sources ne sont ni découpées
depuis une planche, ni étirées, ni rééchantillonnées.

Les produits officiels servent de références de vêtements, couleurs et assemblages.
Les proportions et poses restent des adaptations originales pour Encore. Pomni plage
reprend les brassards jaunes de la peluche ; elle ne mélange pas ce choix avec le
pistolet à eau de la figurine Aqua Blaster. La bouée de Ragatha est un cheval sans
corne. Les deux Zooble conservent chacun leurs membres asymétriques propres.
Jax reprend le corps violet lisse et le coquillage rose de la figurine de plage.
Kinger conserve son corps-château entier : les poses utilisent la tête et
l’inclinaison du château, sans ajouter de membres humains.

## Intégration

Le vestiaire contient désormais **437 costumes** : 51 variantes d’archive,
huit nouvelles tenues et 378 costumes crossover. Le roster conserve ses **54
combattants et 540 techniques**. Les huit ajouts réutilisent le kit, les statistiques
et les collisions de Pomni, Ragatha, Zooble, Jax ou Kinger. Ils sont disponibles pour les deux
joueurs, les programmes sauvegardés et les replays via le catalogue commun.

Le catalogue historique reste à 179 fiches et 184 portraits individuels d’archive.
Les huit nouveaux portraits sont utilisés dans les sélecteurs et la garde-robe.
Hors crossover, les fichiers de personnages passent de 1 234 à **1 322** :
1 017 actions, 113 gardes et 192 portraits. Les costumes crossover et les décors sont
comptés séparément.

Le manifeste hors ligne est régénéré avec le module de costumes et les 88 images.
Le moteur choisit chaque dessin par l’identifiant d’apparence et conserve une
échelle uniforme fondée sur l’alpha visible. Les anciennes identités d’archive
et les règles de simulation ne changent pas.

## Sources et provenance

- [Costume Adventure Series](https://glitchproductions.store/products/digital-circus-animiniz-costume-adventure-series)
- [Beach Vacation Series](https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series)
- [Noir Ragatha Plush](https://glitchproductions.store/products/noir-ragatha-plush)
- [Beach Pomni Plush](https://glitchproductions.store/products/beach-pomni-plush)

Les [manifestes de génération](art-generation/cast-continuation-20261119/) conservent
les instructions, références, sorties natives et empreintes SHA-256.
Les sources nommées sont aussi présentes dans
[`combat/costume-additions.mjs`](../combat/costume-additions.mjs) et dans le suivi
Excel. Aucune capture d’épisode ni fidélité générale 1:1 n’est revendiquée.

## Accessoires locaux récupérés

Six sources sont conservées dans
[`art/sources/recovered-local-props-20261119`](../art/sources/recovered-local-props-20261119/) :
lampadaire hanté, distributeur de tickets, piédestal holographique, tourniquet
pastel, microphone sur pied et cloche de bambou. Les octets natifs sont préservés.
Leur composition avec alpha natif a été examinée sur fond sombre.
Ces sources sont dans la PR ; leur placement dans les décors reste à définir.

## Vérifications de cette suite

Les résultats suivants portent sur les **huit variantes et leurs 88 PNG**.
Ils ont été réexécutés après l’ajout de Jax et Kinger ; les résultats du premier
lot intermédiaire à six tenues ne servent pas de preuve pour ce lot final.

| Contrôle | Résultat sur cette suite |
| --- | --- |
| `npm run qa` | **401 tests réussis sur 401**, aucun échec, test ignoré ou annulé ; audits réussis. |
| Distributions | **CainOS et standalone construits**. Les 88 PNG natifs et les sept modules de rendu/catalogue contrôlés concordent dans les deux distributions. |
| Sources PNG | **88 empreintes distinctes**, 88 copies identiques aux sorties natives, 88 alphas transparents et 88 silhouettes avec marges complètes ; 98 029 118 octets. |
| Rendu de production Canvas | **72 actions et huit gardes**, vérifiées dans les deux orientations : **160 contrôles** de source, orientation et échelle uniforme ; aucun fichier manquant. |
| Portraits | **Huit portraits rendus** ; planches d’actions et portraits revus visuellement. |
| Sauvegardes et replays | Les huit identifiants de tenue sont conservés ; une tenue ne peut être attribuée à un autre personnage. Les kits et statistiques de leurs propriétaires sont inchangés. |
| Manifeste hors ligne | **5 419 illustrations**, 2 636 860 685 octets, version `0.7.0-a4e72210b5ac`, art `9ea44bc5726e65f1`. |

Les [preuves de cette exécution](art-generation/cast-continuation-20261119/verification.json)
relient le [journal QA](art-generation/cast-continuation-20261119/qa.log),
l’[inventaire des 88 sources](art-generation/cast-continuation-20261119/asset-inventory.json)
et la [galerie rendue par le moteur](art-generation/cast-continuation-20261119/review/README.md)
à leurs empreintes. Les tests navigateur existants ont été étendus aux huit tenues.
Le lancement local de Chromium a réellement été tenté, mais l’environnement
l’a bloqué avant toute navigation (`socket() failed: Operation not permitted`).
Aucun parcours navigateur local réussi n’est revendiqué ; le rendu Node/Skia
ci-dessus est une vérification distincte.

Le premier essai intermédiaire avait rencontré un manque d’espace disque lors
du build, après ses tests. Seuls des répertoires de build ignorés et reproductibles
ont été supprimés ; l’exécution finale des huit tenues s’est ensuite terminée
avec le code de sortie zéro.

## Suivi Excel

Le [classeur de production](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) et son
[jeu de données](combat-tracker-data.json) ajoutent huit lignes de tenue,
huit références officielles et cinq lignes QA propres à cette exécution.
Ils contiennent désormais **3 100 lignes Production, 2 260 lignes QA et
120 références**. Les résultats historiques restent datés séparément.

L’export a été réimporté et comparé aux entrées originales : les identifiants,
l’ordre des anciennes lignes, les notes et les feuilles sans rapport avec ce lot
sont conservés. Les **11 onglets, dix tables natives et 42 formules** sont
préservés ; le recalcul ne produit aucune erreur. La synthèse affiche 437 costumes
et 675 fiches de fidélité hors crossover. La
[preuve de conservation et de revue](art-generation/cast-continuation-20261119/workbook-review.json)
relie le classeur aux empreintes exactes de la QA, des sources PNG et du rendu Canvas.

## Limites et travail restant

Les onze vues par tenue sont des poses statiques. Elles ne constituent pas
des cycles animés image par image. La comparaison avec des plans précis de la
série, les costumes crossover des quarante PNJ promus et les contrôles sur appareils
physiques restent ouverts. Une mention ou un effet sonore sans référence de corps
ne donne pas lieu à l’invention d’un nouveau combattant.

Le [rapprochement des candidats](art-generation/cast-continuation-20261119/remaining-candidates.md)
recense les huit apparences traitées et les **31 autres lignes à qualifier** :
neuf tenues ou styles, huit assemblages de Zooble et quatorze états, effets,
projections, accessoires ou présences sonores. Il signale notamment la tenue
« Stupid Sauce » de Ragatha déjà représentée par `spudsyragatha`.
Ces 31 lignes ne sont pas présentées comme 31 nouveaux personnages à produire.

Le [rapport du checkpoint récupéré](COMBAT_CHARACTER_COMPLETION_2026-11-19.md)
conserve ses propres chiffres et preuves historiques. Les 586 chemins d’images
de personnages qu’il ajoutait à la PR ne sont pas comptés comme des générations
de cette nouvelle suite.

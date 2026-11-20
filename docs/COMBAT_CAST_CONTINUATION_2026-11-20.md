# Digital Circus — Encore : continuation du 20 novembre 2026

## Résultat et point d’arrêt exact

Cette reprise ajoute **102 dessins PNG natifs** à la PR : **66 dessins pour six apparences complètes et intégrées**, plus **36 dessins conservés pour neuf apparences en préparation**. Le plan visait quinze apparences et 165 dessins ; **63 poses restent à générer**.

La génération s’est arrêtée sur la réponse réelle du service **HTTP 429 `usage_limit_reached`**, limite quotidienne de 1 440 minutes. Le service a annoncé une réinitialisation le **20 novembre 2026 à 08:08:33 UTC, soit 09:08:33 à Paris**. Cet horaire est celui annoncé par le service, pas une garantie de disponibilité. Les sorties réussies, les références et les prompts restants sont enregistrés dans la PR. Aucun fichier manquant n’a été remplacé par une copie, un découpage ou une transformation locale d’une autre pose.

La mise à jour du classeur est préparée, mais **l’export Excel reste bloqué par la mémoire disponible**. Le classeur et son JSON historiques sont conservés à l’identique ; l’état préparé et le diagnostic sont archivés pour reprendre cet export.

Les six apparences actives sont Pomni, Jax et Kinger **Film noir**, Ragatha et Zooble **Gardes du corps**, et **Bad End Caine**. Ces ajouts réutilisent les identités et les kits existants ; le roster reste à **54 combattants**. Les neuf ensembles incomplets restent hors du catalogue jouable et du téléchargement hors ligne.

- [Plan des quinze apparences et chemins définitifs](art-generation/cast-continuation-20261120/appearance-plan.json)
- [Inventaire des 66 dessins actifs](art-generation/cast-continuation-20261120/asset-inventory.json)
- [Inventaire des 36 dessins en préparation](art-generation/cast-continuation-20261120/pending-artwork-inventory.json)
- [Checkpoint de reprise et 63 prompts complets](art-generation/cast-continuation-20261120/generation-resume.json)

## Apparences et état réel de production

Chaque ensemble complet comporte onze dessins indépendants : **sélection, garde, introduction, attaque, attaque forte, impact, marche, saut, accroupi, victoire et défaite**.

| Apparence | Identifiant | Dessins présents | État |
| --- | --- | ---: | --- |
| Pomni — Film noir | `noirpomni` | 11/11 | Intégrée au jeu |
| Jax — Film noir | `noirjax` | 11/11 | Intégrée au jeu |
| Kinger — Film noir | `noirkinger` | 11/11 | Intégrée au jeu |
| Gangle — sourire de tragédie | `smilingtragedygangle` | 2/11 | En préparation — 9 poses manquantes |
| Pomni — abstraction partielle | `abstractingpomni` | 2/11 | En préparation — 9 poses manquantes |
| Jax — abstraction partielle | `abstractingjax` | 3/11 | En préparation — 8 poses manquantes |
| Ragatha — abstraction partielle | `abstractingragatha` | 3/11 | En préparation — 8 poses manquantes |
| Kinger — abstraction partielle | `abstractingkinger` | 2/11 | En préparation — 9 poses manquantes |
| Gangle — abstraction partielle | `abstractinggangle` | 5/11 | En préparation — 6 poses manquantes |
| Zooble — abstraction partielle | `abstractingzooble` | 2/11 | En préparation — 9 poses manquantes |
| Queenie — abstraction partielle | `abstractingqueenie` | 9/11 | En préparation — 2 poses manquantes |
| Caine — Bad End | `badendcaine` | 11/11 | Intégrée au jeu |
| Ragatha — Garde du corps | `bodyguardragatha` | 11/11 | Intégrée au jeu |
| Zooble — Garde du corps | `bodyguardzooble` | 11/11 | Intégrée au jeu |
| Zooble — Assemblage épisode 5 | `zoobleep5` | 8/11 | En préparation — 3 poses manquantes |

Les neuf apparences en préparation ont toutes leur sélection et leur garde. Leurs autres poses disponibles sont conservées dans `art-generation/cast-continuation-20261120/pending-assets/`. La file de reprise décrit uniquement les cibles absentes et utilise des références présentes dans le dépôt. Elle conserve aussi la réserve de sens natif pour Gangle abstraite : les masques pointent à gauche dans les sources actuelles ; ce sens doit être contrôlé au moment de son activation.

## Références et portée de fidélité

Les trois tenues film noir sont comparées aux Pendantz officiels de [Pomni](https://glitchproductions.store/products/pomni-animiniz-pendantz), [Jax](https://glitchproductions.store/products/jax-pendantz) et [Kinger](https://glitchproductions.store/products/kinger-animiniz-pendantz). Leurs vêtements et accessoires sont repris dans les proportions du jeu ; les attaches et étiquettes de produits sont exclues. Kinger conserve un corps de pièce d’échecs et deux mains flottantes, sans jambes inventées.

Les gardes du corps sont documentés par les aperçus de l’[épisode 5 officiel](https://www.youtube.com/watch?v=L4p2gN2CzsA&t=260s) et la [miniature du trailer officiel](https://i.ytimg.com/vi/sQ5DCwcpMy0/maxresdefault.jpg). Ragatha conserve sa robe et ses cheveux de laine avec les lunettes noires. L’assemblage de Zooble conserve ses pièces asymétriques, sa pince verte unique, ses antennes et l’absence de bouche. Les bras de plusieurs poses ont été corrigés par génération avant leur validation.

Le sourire du masque de tragédie de Gangle est observé sur le storyboard officiel de l’[épisode 6](https://www.youtube.com/watch?v=mOvhHim78YA&t=970s), vers 16 min 10 s. Les sept abstractions partielles et Bad End Caine proviennent des designs officiels [Abstraction Animiniz](https://glitchproductions.store/products/abstraction-animiniz). **Une référence de produit dérivé n’atteste pas une transformation survenue dans un épisode.** Les métadonnées du jeu distinguent explicitement les deux catégories de sources.

Les références nécessaires à la reprise sont conservées avec leurs empreintes et URLs dans [references/index.json](art-generation/cast-continuation-20261120/references/index.json). Les limites des aperçus et les observations détaillées figurent dans la [matrice des rôles et assemblages](art-generation/cast-continuation-20261120/presidential-zooble-primary-review.json) et le [rapport des états](art-generation/cast-continuation-20261120/casting-states-report.md). Les poses de combat restent des créations originales pour le jeu, et ces dessins statiques ne constituent pas des cycles d’animation complets.

## Intégration au jeu

Le module `combat/costume-continuation-20261120.mjs` expose uniquement les six ensembles complets. Leur date `introducedOn` sépare cette passe des huit costumes du 19 novembre. Les identifiants des combattants, les techniques, les statistiques, le format des profils et les replays restent compatibles. Les tests contrôlent l’appartenance au bon combattant et les allers-retours de campagne, de profil et de replay.

Les dessins actifs se trouvent dans `assets/encore/selection/`, `assets/encore/stance/` et `assets/encore/poses/`. Le manifeste hors ligne inclut le nouveau module et chaque dessin actif. Les 36 dessins partiels sont archivés sous `docs/`, avec un `targetFile` qui conserve leur futur chemin d’intégration ; ils ne sont pas inclus dans ce manifeste.

| Compteur actif après cette reprise | Valeur |
| --- | ---: |
| Combattants | 54 |
| Techniques | 540 |
| Arènes partagées | 22 |
| Costumes sélectionnables | 443 |
| Variantes historiques | 51 |
| Costumes crossover | 378 |
| Apparences additionnelles complètes, deux passes cumulées | 14 |
| PNG de ces quatorze apparences | 154 |
| Fiches d’archive | 179 |
| Fichiers de personnages, hors crossovers | 1 388 |
| Actions / gardes / portraits de personnages | 1 071 / 119 / 198 |
| Fiches de fidélité | 681 |
| Illustrations dans le manifeste hors ligne | 5 485 |

Le manifeste représente **2 717 164 059 octets**, version `0.7.0-1189b958b2a2`, version artistique `d583f256685e567a`. Les 88 images de la passe précédente ont été comparées à leur inventaire et restent inchangées. Les anciens rapports du 19 novembre conservent leurs compteurs et résultats historiques.

## Vérifications exécutées

La preuve complète est [verification.json](art-generation/cast-continuation-20261120/verification.json), liée par SHA-256 au code, au manifeste, aux trois documents de reprise et au journal [qa.log](art-generation/cast-continuation-20261120/qa.log).

| Vérification de cette passe | Résultat |
| --- | --- |
| `npm run qa` | 401 tests réussis ; 0 échec, 0 test ignoré ou annulé |
| Construction de CainOS et du jeu autonome | Les deux distributions construites ; 66 nouveaux PNG et 8 fichiers runtime comparés dans chacune |
| Images actives | 66 empreintes distinctes, copie native identique, PNG RGBA, dimensions et marges vérifiées |
| Images archivées | 36 empreintes distinctes, copie native identique, PNG RGBA, dimensions et marges vérifiées |
| Canvas de production | 54 poses d’action et 6 gardes, 120 contrôles dans les deux sens, 6 portraits ; aucun fichier manquant |
| Revue visuelle | Six planches d’actions et les six portraits inspectés après la revue des sources natives |
| Navigateur local | Cinq lancements tentés ; Chromium bloqué avant toute navigation par `socket() failed: Operation not permitted` |

Le rendu Canvas utilise le code de production avec Node et Skia. Il valide la composition, les proportions et les deux sens, mais ne remplace pas les assertions DOM, entrées, audio ou service worker. Les tentatives locales documentent une limitation de l’environnement avant l’ouverture d’une page ; **aucun test navigateur local réussi n’est annoncé**. Les résultats de GitHub Actions restent associés à leur commit exact et sont consultables dans les contrôles de la PR.

- [Galerie des six apparences actives](art-generation/cast-continuation-20261120/review/README.md)
- [Galerie des neuf apparences en préparation](art-generation/cast-continuation-20261120/pending-review/README.md)
- [Journal du blocage Chromium local](art-generation/cast-continuation-20261120/browser-attempt.json)

## Classeur et recherche restante

La mise à jour préparée comporte **15 nouvelles lignes Production** : six apparences **Implémenté** et neuf **Partiel**, avec une catégorie distincte pour les ensembles incomplets. Elle ajoute aussi **5 lignes QA et 15 références**. Les extensions de tables, le recalcul et les aperçus ont été contrôlés en mémoire, mais l’export XLSX a échoué sur les limites de mémoire de l’environnement, y compris après séparation des rendus et réduction de la consommation du moteur.

Le [classeur de suivi](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx) et `combat-tracker-data.json` restent donc à leur révision du **19 novembre**, soit **3 100 lignes Production, 2 260 lignes QA et 120 références**. Les compteurs préparés pour cette reprise sont respectivement **3 115, 2 265 et 135** ; ils ne sont pas présentés comme le contenu d’un nouveau fichier Excel livré.

Le [checkpoint de préparation](art-generation/cast-continuation-20261120/workbook-preparation-checkpoint.json.gz) conserve l’état de travail nécessaire à la reprise. Son objet `verificationDraft` contient des vérifications prévues, pas des résultats d’un réimport exécuté. Le [rapport du classeur](art-generation/cast-continuation-20261120/workbook-review.json), au statut **`export_blocked_memory`**, distingue les contrôles effectivement réalisés du blocage d’export et consigne les empreintes inchangées des fichiers historiques.

La [revue des 31 anciens candidats](art-generation/cast-continuation-20261120/remaining-candidates.md) distingue cinq correspondances désormais actives, deux apparences en production partielle, des rôles ou doublons déjà couverts, et les références visuelles encore insuffisantes. Kinger aide présidentiel ne justifie pas un nouveau costume ; le Zooble du début de l’épisode 9 correspond à l’assemblage de l’épisode 8. Les autres assemblages, les vêtements partiellement masqués et les états rapides restent documentés avec la partie exacte à vérifier. Aucun nouveau personnage n’est déduit d’un nom de rôle, d’un effet ou d’une présence sonore.

La prochaine reprise doit partir de `generation-resume.json` : produire les **63 seules poses absentes** après disponibilité du service, les revoir contre les références conservées, puis activer uniquement les ensembles arrivés à onze dessins. Les 102 sorties déjà acceptées sont conservées sans régénération.

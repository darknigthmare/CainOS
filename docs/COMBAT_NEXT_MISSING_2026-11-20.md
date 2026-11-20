# Encore — quatre apparences et Sous la carte, 20 novembre 2026

**Quatre familles complètes de costumes, soit 44 PNG individuels, et une nouvelle arène à trois plans sont intégrées.** Cette passe poursuit le [lot Ribbit](COMBAT_RIBBIT_CONTINUATION_2026-11-20.md), à partir du commit local `3858f03` et du parent publié `3bd83cdf`. Les fichiers générés sont installés sans redimensionnement, réencodage ni modification d’alpha.

## Apparences ajoutées

| Apparence | Dessins natifs | Rendu de production |
| --- | ---: | --- |
| Gangle — Pastèque | 11 | [Galerie](art-generation/cast-next-missing-20261120/review/watermelongangle/README.md) |
| Pomni — Aqua Blaster | 11 | [Galerie](art-generation/cast-next-missing-20261120/review/aquablasterpomni/README.md) |
| Caine — Congés | 11 | [Galerie](art-generation/cast-next-missing-20261120/review/ptocaine/README.md) |
| Jax — Freak Jax | 11 | [Galerie](art-generation/cast-next-missing-20261120/review/freakjax/README.md) |

Chaque famille comprend un portrait de sélection, une garde et neuf poses : entrée, attaque, coup fort, coup reçu, marche, saut, accroupissement, victoire et défaite. Ce sont des poses statiques originales pour le jeu.

Watermelon Gangle conserve le grand chapeau jaune à nœud pervenche, le haut et la jupe assortis, la batte sombre et la tranche de pastèque. Elle est distincte de l’ancienne tenue au paréo fleuri et à la noix de coco. Aqua Blaster Pomni possède le pistolet à eau de la figurine et aucun brassard. Les deux variantes existantes restent au catalogue.

PTO Caine porte les grandes lunettes menthe à verres jaunes ; son corps debout reprend la tenue de Caine déjà utilisée. Le transat et le verre sont exclus, et les parties masquées dans la figurine assise ne sont pas présentées comme de nouvelles observations. Freak Jax se distingue de `peeledjax` par sa tête jaune ronde sans oreilles dressées, ses yeux noirs carrés, ses membres violets et sa salopette corail intacte. Le volume violet rabattu derrière les épaules ne devient pas une nouvelle queue anatomique.

Les références officielles et leur portée sont décrites dans les quatre fiches de [qualification](art-generation/cast-next-missing-20261120/README.md). Les photos de produits ne certifient pas des proportions ou des poses d’épisode. Les [44 reçus et empreintes](art-generation/cast-next-missing-20261120/generation-completion.json) relient chaque dessin à son appel de génération et à ses références portables.

## Nouvelle arène : Sous la carte

La salle indigo quadrillée sous Candy Canyon devient `undermap`, ajoutée après les 22 arènes historiques. Ses trois plans natifs mesurent réellement **1672 × 941**, pour **1 821 031 octets**. Le service n’a pas fourni la taille 4K demandée ; aucun agrandissement du fichier n’a été appliqué. La paroi, le sol en perspective et les reflets utilisent le chargeur de parallaxe existant.

Un thème musical, une ambiance discrète et une pulsation bleue originaux complètent le décor. Le sol de combat reste à y568 ; les mouvements réduits figent la caméra et la pulsation. Le repli de chargement est lui aussi indigo et quadrillé. Le [dossier du décor](art-generation/stage-next-missing-20261120/README.md) et la [planche de trois caméras](art-generation/stage-next-missing-20261120/review/three-cameras.png) détaillent la comparaison au visuel primaire et les adaptations.

L’ajout d’une arène changeait les tirages fondés sur la longueur du catalogue. Les anciennes routes PNJ sont désormais reliées explicitement à leurs 22 scènes d’origine, et le validateur reconnaît le catalogue historique lors d’une reprise de programme. Les fixtures capturées avant édition conservent **54 récits, 45 programmes / 270 checkpoints et 14 replays / 3 682 frames**. Les anciens contextes restent admis ; les calendriers arbitraires importés restent rejetés. Les versions de simulation, de profil et de replay ne changent pas.

## Vérifications exécutées

| Contrôle | Résultat | Preuve |
| --- | --- | --- |
| QA globale et deux distributions | 411 tests Node, 0 échec ; deux builds réussis | [Résultat](art-generation/cast-next-missing-20261120/qa-result.json) |
| Costumes dans le moteur Canvas de production | 36 actions, 4 gardes, 4 portraits, 80 contrôles dans les deux sens ; zéro manque | [Synthèse Canvas](art-generation/cast-next-missing-20261120/canvas-summary.json) |
| Décor dans le vrai chargeur et le moteur Canvas | 3 positions de caméra, 3 scènes avec personnages, 6 contrôles réussis | [Revue du décor](art-generation/stage-next-missing-20261120/review/canvas-review.json) |
| Copies dans les deux distributions | 88 comparaisons de costumes, 6 de plans, 32 de modules | [Intégrité](art-generation/cast-next-missing-20261120/build-integrity.json) |
| Anciennes images Encore | 5,678 fichiers identiques au commit de base | [Même preuve](art-generation/cast-next-missing-20261120/build-integrity.json) |

Les rapports sont liés aux empreintes des sources finales et du manifeste. La [revue visuelle](art-generation/cast-next-missing-20261120/visual-review.json) décrit les observations réellement faites. Les sorties Canvas sous Node/Skia ne constituent pas un parcours navigateur ni un essai matériel. Chromium local avait échoué avant navigation lors du lot précédent ; cette tentative historique n’est pas réattribuée au nouveau lot. La CI du commit publié doit être lue séparément.

## Catalogue après intégration

| Élément | Total mesuré |
| --- | ---: |
| Combattants | 54 |
| Techniques | 540 |
| Costumes sélectionnables | 468 |
| Apparences Circus supplémentaires | 39 / 429 PNG |
| Arènes partagées | 23 / 69 plans |
| Arrangements dédiés réemployant ces décors | 54 |
| Entrées d’archive | 179 |
| Images dans le paquet hors ligne | 5,769 |
| Octets des images hors ligne | 3,059,080,660 |

Version du paquet : `0.7.0-cdc85685a728` ; révision artistique : `cb628ae846008788`. Les comptes sont issus des [exports de production](art-generation/cast-next-missing-20261120/runtime-counts.json).

## Suivi et éléments toujours ouverts

La [réconciliation du classeur](art-generation/workbook-next-missing-20261120/README.md) ajoute les lignes de ce lot à partir du XLSX déjà réconcilié. Le fichier contient **3 188 lignes Production, 2 335 lignes QA et 153 références**. Les 44 dessins disposent chacun d’une ligne de production et d’une ligne de contrôle ; les quatre familles et les six éléments de production du décor complètent cette extension.

La comparaison native de l’export retrouve **80 346 cellules, sans différence avec le modèle final contrôlé**. Le réimport conserve **42 formules, 11 feuilles et 10 tableaux**. Les **36 vues finales** sont inspectées, avec une hauteur adaptée aux descriptions des nouveaux dessins. Les IDs, l’ordre, les notes et les preuves historiques sont conservés ; les changements autorisés du résumé, des compteurs et de la référence Jax australien restent explicitement consignés. Seuls les contrôles effectivement exécutés servent aux nouveaux statuts.

Le [registre courant](art-generation/cast-next-missing-20261120/remaining-work.md) retire les quatre familles terminées et l’arène de la file de production. Il garde les références incomplètes pour Maid Ribbit, Jax australien, Gangle néo-zélandaise et film noir, plusieurs assemblages de Zooble et Hotdog Cart Abel. La recherche confirme le short kaki de Jax australien mais pas ses pieds. Les cycles d’animation complets, les crossovers des quarante PNJ et les essais sur appareils physiques restent ouverts.

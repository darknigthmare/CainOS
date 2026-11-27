# Encore — deux Café, Ribbit × Meta Runner et le stade de softball

**Continuation du 20 novembre 2026 : 58 PNG natifs intégrés, cinq familles complètes et une arène supplémentaire.** Le lot prolonge le [point d’étape Café Ribbit / Murder Drones / Barnoir](COMBAT_NEXT_WAVE_2026-11-20.md). Les anciennes preuves restent datées et conservées.

## Ce qui est livré

| Ajout | Contenu actif | PNG | Octets natifs |
| --- | --- | ---: | ---: |
| Kinger — Café | Sélection, garde et neuf actions distinctes | 11 | 12 996 642 |
| Pomni — Café | Sélection, garde et neuf actions distinctes | 11 | 10 981 850 |
| Ribbit × Meta Runner — Hommage · Tari | Corps biologique, veste cyan et blanche, avant-bras cybernétique gauche | 11 | 8 248 636 |
| Ribbit × Meta Runner — Résident · Analyste de replays | Tenue marine et magenta, short, genouillères et équipement de compétition | 11 | 8 980 992 |
| Ribbit × Meta Runner — Fusion · Avatar de synchronisation | Corps entièrement synthétique, plaques pâles, lignes cyan et nœud pectoral magenta | 11 | 10 788 515 |
| Le stade de softball | Fond opaque, plan médian transparent et premier plan transparent | 3 | 3 125 830 |
| **Total** | **55 dessins de personnages et trois plans** | **58** | **55 122 465** |

Les neuf actions de chaque famille sont introduction, attaque, coup lourd, impact, marche, saut, accroupissement, victoire et défaite. Chaque coup lourd dispose de son propre fichier ; aucun alias d’action n’est introduit dans ces cinq familles. Les fichiers actifs sont des copies exactes des sorties natives : aucune retouche locale, normalisation de taille ou réencodage.

Les [inventaires de personnages](art-generation/continuation-20261120-b/generation-completion.json), les [plans du stade](art-generation/continuation-20261120-b/stage/asset-inventory.json) et la [preuve d’intégrité](art-generation/continuation-20261120-b/build-integrity.json) donnent les fichiers, dimensions, reçus et empreintes. Les planches de diagnostic restent séparées des actifs.

## Références et décisions artistiques

### Les deux tenues Café

Les illustrations de la collaboration Animate Café documentent deux tenues distinctes, déjà comparées aux apparences présentes. Kinger conserve sa silhouette conique de pièce d’échecs, sa base entière, son habit violet et son monocle. Ses gants flottants s’appuient sur son anatomie documentée séparément : la vue Café ne les attribue pas clairement. Aucun bras ou jambe n’est inventé pour compléter un costume masqué.

Pomni conserve le chapeau rouge et bleu, les grelots jaunes, le tablier à deux nœuds, les jambes claires et les chaussures bicolores. Cette tenue reste distincte de la soubrette déjà archivée. Les poses de combat sont des adaptations originales de l’illustration commerciale. La revue ne qualifie pas le dos invisible ou les parties occultées d’autres costumes.

[Références, génération et limites Café](art-generation/continuation-20261120-b/cafe/README.md).

### Les trois créations Meta Runner

L’Hommage reprend les motifs de la veste de Tari et le langage visuel des avant-bras cybernétiques. L’Analyste de replays invente un rôle de compétition et une tenue propres. L’Avatar de synchronisation transforme tout le corps de Ribbit en création synthétique, avec des articulations et des pieds amphibies mécaniques.

Les références officielles guident les couleurs et matériaux, tandis que les corps, rôles, proportions et poses sont des créations du jeu. La lecture à trois lobes des mains est un choix de cette vague ; elle ne prétend pas établir l’anatomie canonique de Ribbit. Les dessins historiques restent intacts.

La revue alpha a également corrigé une première interprétation de certains aperçus : des couleurs RGB présentes dans les pixels transparents donnaient l’impression d’un halo. Les compositions sur fonds clair et sombre ont infirmé ce défaut. Les reçus conservent les observations initiales et leur réévaluation. Parmi les huit variantes non actives, six ont de vrais écarts anatomiques et deux sont simplement remplacées par la pose finale.

[Références et portée Meta Runner](art-generation/continuation-20261120-b/metarunner/reference-review.md) · [Production des 33 PNG](art-generation/continuation-20261120-b/metarunner/README.md).

### Le stade de softball

Le stade devient la **25e arène partagée d’Encore**. Il existait déjà comme zone d’exploration dans CainOS ; il est ajouté ici au duel. Les vues officielles de l’épisode 5 montrent tribunes, auvents, projecteurs rectangulaires, herbe, terre ocre et tableau. Elles proviennent de cellules de storyboard de **320 × 180**, échantillonnées à dix secondes d’intervalle. Aucun visionnage intégral du flux ou relevé canonique des dimensions n’est revendiqué.

Le fond et le plan médian mesurent **1 672 × 941** ; le premier plan mesure **1 671 × 941**. Le pixel de différence est conservé. Le chargeur de parallaxe existant dessine chaque image dans sa surface habituelle, avec la piste de combat et les limites de collision inchangées. La géométrie, le rendu de secours, la musique et l’ambiance sont des adaptations originales. La recherche de cette vague n’a pas qualifié de décor de bowling.

[Qualification et preuve finale du stade](art-generation/continuation-20261120-b/stage/README.md).

## Catalogue réellement actif

| Mesure | Valeur après intégration |
| --- | ---: |
| Combattants / techniques | 54 / 540 |
| Costumes sélectionnables | 477 |
| Costumes d’archive | 51 |
| Apparences Circus supplémentaires / PNG | 42 / 462 |
| Crossovers / fichiers image | 384 / 3 847 |
| Fusions originales | 128 |
| Arènes partagées / plans | 25 / 75 |
| Arrangements dédiés utilisant les décors partagés | 54 |
| Entrées d’archive | 179 |
| Images du paquet hors ligne | 5 874 |
| Octets des images hors ligne | 3 173 741 905 |
| Fichiers du cœur hors ligne | 57 |

Le manifeste final est **`0.7.0-17366238b519`**, avec l’empreinte artistique **`20311abb70caa13c`**. Les [compteurs runtime](art-generation/continuation-20261120-b/runtime-counts.json) proviennent des modules réellement importés.

Les quatorze propriétaires historiques conservent leurs 27 crossovers chacun. Ribbit possède maintenant **6/27 tenues** : trois Murder Drones et trois Meta Runner. Les 39 autres PNJ restent sans crossover. Les 54 arrangements dédiés réutilisent les scènes partagées ; ils ne représentent pas 54 lieux supplémentaires.

## Préservation et vérification

### Données et images antérieures

Le registre d’ordre explicite permet d’ajouter des familles Circus et PNJ successives sans déplacer les costumes publiés. Il conserve les objets existants et refuse les IDs manquants, dupliqués ou non répertoriés. Les **472 premiers costumes** gardent leur ordre et leurs objets JSON exacts, avec l’empreinte `5dafc529d6121a2850b7bfad54684f57e7223bfd29c2051b3687c00bed057685`.

Les **5 772 fichiers Encore antérieurs**, dont les 33 PNG Ribbit × Murder Drones, restent identiques. Les **72 plans d’arènes précédents** sont intacts. Les modules de simulation, de session, de récits et de parallaxe restent inchangés par rapport au commit local de base `38e8000cad61f4b229ad300877f44c31356343fa`, dont l’arbre correspond au parent publié `6c99eb430e0ffcc17406428fee1ff6d8e2edeab4`.

Les fixtures capturées avant modification protègent **54 récits, 75 programmes / 450 checkpoints et quatre replays / 1 052 frames**. Les fixtures des vagues antérieures sont conservées séparément. Les nouveaux programmes peuvent choisir le stade, tandis que les programmes sauvegardés conservent leurs tirages et leurs reprises.

### Résultats exécutés sur le lot final

| Vérification | Résultat |
| --- | --- |
| QA globale | **431 tests réussis**, zéro échec ou ignoré |
| Distribution CainOS et distribution autonome | **Deux builds réussis** |
| Personnages dans le renderer de production | **100 contrôles directionnels**, 45 actions, cinq gardes et cinq portraits ; zéro source manquante ou alias |
| Revue manuelle des personnages | Dix planches examinées par root et par une revue indépendante : 45 actions et cinq portraits visibles |
| Stade dans le chargeur et le renderer de production | **Six contrôles**, trois caméras et trois scènes avec acteurs |
| Copies natives dans les deux distributions | **116 comparaisons réussies** pour les 58 nouveaux PNG |
| Modules dans les deux distributions | **40 comparaisons réussies** pour vingt modules |
| Fichiers Encore historiques | **5 772 comparaisons réussies**, aucun changement |

Les gardes disposent d’une vérification technique dans les deux orientations ; aucune planche de garde autonome ou cent vues manuelles n’est inventée dans le compte rendu. Les PNG de garde ont également leurs revues natives propres.

Le premier passage global a obtenu 430/431 : le test des références commerciales supposait encore que toute source Animate Café était celle de Ribbit. Sa correction conserve le chemin officiel et le type, et vérifie maintenant les trois IDs exacts avec leurs limites propres. L’[essai initial](art-generation/continuation-20261120-b/attempts/global-qa-01/receipt.json) est conservé. La [QA finale](art-generation/continuation-20261120-b/qa-result.json) couvre la règle corrigée et les deux builds.

Un précontrôle d’intégration avait également refusé les deux victoires Meta Runner corrigées parce qu’il cherchait leur premier job. Le résolveur exige désormais un unique job dont tous les champs correspondent au reçu final. Les tests hors ligne lancés avant régénération du manifeste sont archivés comme tentatives préliminaires ; aucune réussite finale ne leur est attribuée. Les données, images et assertions de provenance n’ont pas été affaiblies.

[Preuve consolidée finale](art-generation/continuation-20261120-b/verification.json) · [Intégrité des distributions](art-generation/continuation-20261120-b/build-integrity.json) · [Revue root](art-generation/continuation-20261120-b/visual-review.json) · [Revue indépendante](art-generation/continuation-20261120-b/independent-visual-review.json).

## Classeur et revue

Le [dossier de réconciliation](art-generation/continuation-20261120-b/workbook/README.md) relie le classeur aux preuves finales de cette vague. Le fichier éditable reste [DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx). La mise à jour ajoute **66 lignes Production, 65 lignes QA et quatre sources**, pour atteindre **3 308 lignes Production, 2 454 lignes QA et 161 sources**.

La comparaison de l’export vérifie **82 697 cellules attendues sans différence**. Le réimport et le recalcul conservent **42 formules, onze feuilles et dix tables** ; un changement de statut représentatif modifie bien les totaux, puis la valeur initiale est rétablie. Les **50 vues du plan final** ont été inspectées : 16 vues Synthèse, Arènes, Fonctionnalités et Références par root, et 34 vues Production/QA par une revue indépendante. Les bandes de lecture à taille native des vues larges restent des diagnostics des mêmes vues, pas des vues supplémentaires.

Les anciens IDs, notes et preuves restent conservés. Le premier export interrompu avant création de fichier, fondé sur un consolidé remplacé uniquement pour une référence d’archive, reste documenté séparément. Le XLSX final porte l’empreinte **`4420382c7994e74bd0410fdcd1b6aa7aa01071540ef4b51e2fb247bc4a11cd3e`** et correspond au plan final **`2a18d8c9d5b667409db2acaf4443eed854e095cc1196033b9c465db0c28d4299`**.

## Portée et travaux encore ouverts

Les contrôles de rendu utilisent Canvas2D sous Node/Skia. **Aucun navigateur local n’a été exécuté pour cette continuation.** La tentative Chromium Barnoir est historique. La CI du parent `6c99eb43`, [Encore QA #110](https://github.com/darknigthmare/CainOS/actions/runs/44770251668), a réussi, mais sa réussite appartient à ce commit parent. Les contrôles distants du nouveau commit doivent être lus après publication.

Il reste **1 074 tenues crossover de PNJ** : 21 pour Ribbit dans sept univers et 1 053 pour les 39 autres PNJ. Les parties masquées des références canoniques, les assemblages de Zooble, les cycles animés complets, les revues de sol des anciens décors et les essais sur appareils physiques restent ouverts. Les onze fichiers statiques d’une famille ne constituent pas une animation complète.

Le [registre détaillé des manquants](art-generation/continuation-20261120-b/remaining-work.md) conserve les observations précises, notamment la distinction entre Café Ribbit et le Pendantz Maid. Cette continuation complète la [PR #9](https://github.com/darknigthmare/CainOS/pull/9), conservée en brouillon pour revue ; elle n’effectue aucune fusion.

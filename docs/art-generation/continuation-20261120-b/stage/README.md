# Stade de softball — qualification et production

**Candidat retenu : `softballfield`, « Le stade de softball ».** Les vues larges de l’épisode 5 officiel permettent de qualifier les tribunes, projecteurs, herbe et terre du terrain. Le bowling proposé initialement n’est pas qualifié par ces sources ; aucun décor de bowling n’est inventé.

## Un ajout au catalogue Encore

L’[inventaire avant ajout](existing-stage-inventory.json) relève **24 arènes, 72 plans présents et 54 arrangements dédiés qui les réutilisent**. Aucun n’est un terrain de softball. La zone d’exploration CainOS 12 montre déjà ce lieu ; ce travail complète les arènes du duel Encore. La grande piste représente le salon du cirque, les terrains du cirque une pelouse avec le chapiteau, et Barnoir un intérieur à néons : aucun ne représente le stade.

La [définition figée](definition.json) distingue les observations, les adaptations et les limites. Les plans utilisés sont [M12](references/episode5-storyboard-L3-M12.jpg) et [M15](references/episode5-storyboard-L3-M15.jpg), provenant de [GLITCH — épisode 5 « Untitled »](https://www.youtube.com/watch?v=L4p2gN2CzsA). Les cellules M12/4 (vers 1120 s), M15/5 (vers 1400 s) et M15/8 (vers 1430 s) donnent les vues utiles. Le [reçu de récupération](reference-retrieval.json) conserve les URLs exactes, HTTP 200, SHA256 et dimensions. Les autres planches téléchargées documentent la recherche de candidat.

Chaque cellule mesure **320 × 180** ; les temps sont déduits d’un intervalle de dix secondes. Aucun visionnage intégral du flux ni mesure canonique du stade n’est revendiqué. Les chiffres d’un score temporaire ne sont pas transformés en élément de gameplay.

## Trois plans natifs intégrés

- **Fond opaque :** ciel bleu froid, tribunes, auvents et projecteurs.
- **Plan médian en alpha natif :** herbe et terre ocre, piste horizontale dégagée à y568.
- **Premier plan en alpha natif :** détails bas et discrets, sans obstacle devant les pieds.

Le chargeur de parallaxe existant conserve son canevas 1280 × 720, ses débords et ses déplacements 6/17/31 pixels. Les distances, la séparation des plans, la musique et la perspective de duel sont des adaptations originales. Les trois sorties natives sont installées sans retouche ni réencodage.

| Plan | Dimensions natives | Mode | Octets |
| --- | --- | --- | ---: |
| `far.png` | 1 672 × 941 | RGB opaque | 2 071 718 |
| `mid.png` | 1 672 × 941 | RGBA | 907 121 |
| `near.png` | 1 671 × 941 | RGBA | 146 991 |

L’[inventaire](asset-inventory.json) et les [reçus de génération](generation-receipts.json) donnent les empreintes, les références exactes et les comparaisons à l’octet près : **3 PNG, 3 125 830 octets**. Le pixel de largeur en moins du premier plan est conservé ; le chargeur existant dessine chaque image native dans sa surface de débord habituelle. Il n’y a aucune normalisation des fichiers livrés.

**Quatre appels ont produit trois images acceptées.** Le premier essai du premier plan présentait un voile blanc sur le sol ; son [reçu de rejet](attempts/near-01/receipt.json), son PNG et sa composition sont archivés. Une nouvelle édition native a retiré ce voile et gardé les petites herbes aux coins inférieurs. Aucun traitement de pixels par script n’a corrigé l’actif.

## Fixtures capturées avant mutation

La [preuve préédition](before-addition-proof.json) a été écrite le **20 novembre 2026 à 16:33:16 UTC**, depuis le commit local `38e8000cad61f4b229ad300877f44c31356343fa`, équivalent au publié `6c99eb430e0ffcc17406428fee1ff6d8e2edeab4`. Les 48 modules runtime ont été comparés avant et après capture aux octets du commit.

La [fixture](../../../../tests/fixtures/combat-pre-softballfield.json) couvre **54 récits, 75 programmes / 450 checkpoints, 4 replays / 1 052 frames et le préfixe de 472 costumes**. Les fixtures Undermap et Barnoir restent intactes. La capture a précédé les modifications de code ; elle constitue une référence indépendante pour les contrôles après ajout.

Le validateur des programmes reconnaît désormais aussi le catalogue historique à 24 arènes, en plus de tous les contextes déjà pris en charge. Les nouveaux programmes peuvent tirer le stade ; les parcours sauvegardés gardent leurs choix. Les modules de récits, de simulation, de session et de parallaxe restent identiques au commit de base. Les [72 anciens plans](existing-planes-preserved-final.json) restent eux aussi intacts.

## Vérifications datées

Les [tests ciblés](targeted-test-evidence.json) ont passé le 20 novembre 2026, de 16:52:01 à 16:52:05 UTC : **111 tests, 111 réussites, zéro échec**. Le [journal](targeted-tests.log) conserve la sortie exacte et la preuve garde les empreintes avant et après exécution. Ce contrôle précède le manifeste préliminaire et l’intégration finale des nouveaux personnages. Le premier essai, 110/111 à cause d’une période ambiante de 12,6 secondes dépassant la borne existante, est [archivé](attempts/targeted-01/receipt.json) ; la nouvelle période a été ramenée à 11,8 secondes sans assouplir le test.

La [revue finale du vrai chargeur](verification.json) passe **six contrôles, trois caméras et trois scènes de combat** sur le manifeste `0.7.0-17366238b519`, art `20311abb70caa13c`, **5 874 images / 3 173 741 905 octets**. La [planche finale](review/three-cameras.png), le [repli procédural](review/fallback.png) et la [lecture visuelle](visual-review.md) montrent la piste dégagée avec Pomni et Gummigoo. Les petites herbes restent sous les pieds ; le maximum d’alpha du premier plan au-dessus de leur ligne vaut 2, 2 et 1 sur 255. La lumière ambiante évolue sans modifier les pixels du sol et le mouvement réduit fixe la caméra au centre.

Les [13 fichiers préliminaires](preliminary/archive-manifest.json) sont conservés intacts, avec leur manifeste de 5 819 images. Les huit PNG de revue finale sont identiques à leurs versions préliminaires ; la [seconde inspection préliminaire](preliminary/independent-visual-review.json) conserve sa date et sa portée. Elle ne prétend pas être une nouvelle exécution indépendante sur le manifeste final.

La première QA globale a révélé un contrat de source Café encore limité à Ribbit. La liste fermée reconnaît maintenant les trois références exactes Ribbit, Kinger et Pomni, avec leur chemin officiel, leur type et leurs limites propres ; le rappel Pendantz Maid reste exigé pour Ribbit. Le [contrat ciblé corrigé](fidelity-scope-fix-evidence.json) passe 1/1. La [première preuve Canvas finale](attempts/final-before-fidelity-fix/archive-manifest.json) est conservée avant le rafraîchissement de ses empreintes ; cette correction concerne uniquement le test, aucun runtime ni PNG. La QA intégrale relève du [rapport principal](../qa-result.json).

Le navigateur local **n’a pas été exécuté pour cette continuation**. Le [relevé explicite](browser-result.json) relie seulement la tentative Barnoir historique, arrêtée avant navigation. La [CI du parent publié](ci-parent-final.json), `6c99eb43`, a réussi le 20 novembre à 17:11:57 UTC, y compris sa vérification navigateur ; elle ne valide pas le présent lot. Ces preuves restent distinctes du rendu Canvas et ne valent aucune exécution locale des entrées, de l’audio ou du service worker.

## État de production

Le stade est intégré au catalogue de **25 arènes partagées / 75 plans**. Son runtime, ses trois PNG natifs et sa revue Canvas finale sont gelés. Le manifeste comprend désormais les 55 nouveaux dessins de personnages du lot. Les résultats de QA globale, l’intégrité des builds et le classeur sont consignés séparément par le lot principal ; aucun résultat n’est déduit de la seule revue du stade.

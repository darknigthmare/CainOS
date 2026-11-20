# Le bar des néons — qualification du 20 novembre 2026

**`barnoir`, le bar de l’épisode 5, dispose de trois nouveaux plans natifs et devient la 24e arène partagée.** « Le bar des néons » est le nom de l’arène du fan-game, pas un nom canonique certifié. La qualification ci-dessous précède la génération ; les 86 tests ciblés et les six contrôles Canvas passent. La planche à trois caméras est inspectée et les trois sorties sont acceptées. Le runtime du stage est gelé en attendant la revue sur le manifeste global final.

## Un lieu réellement absent

L’[inventaire avant ajout](existing-stage-inventory.json) confirme les **23 arènes partagées / 69 plans présents**, et les **54 arrangements dédiés réutilisant ces thèmes**. Aucun fichier de ces 69 plans n’est manquant. Le nouveau candidat représente donc un lieu supplémentaire ; il ne remplace pas un ancien fond et ne clôt pas les anciennes revues partielles de sol ou de fidélité.

| Décor comparé | Éléments constatés | Différence avec le candidat |
| --- | --- | --- |
| Little Daisy, fichier `assets/encore/stages/littledaisy/far.webp` inspecté | Club de jazz dans une cave rocheuse, rideaux rouges, bois et éclairage ambré. | Autre série ; scène et sol en bois, sans le bar sombre à néons et damier de l’épisode 5. |
| Spudsy, fichier `assets/encore/stages/spudsy/far.webp` inspecté | Restauration rapide rouge/jaune, menus et cuisine inox. | Autre lieu et autre épisode ; aucun comptoir à suspensions de verre et enseignes de bar. |
| Grande piste et couloir des portes | Salon de cirque et chambres des résidents dans leurs définitions de catalogue. | Ces lieux ne décrivent pas le bar de l’épisode 5. |

## Source primaire inspectée

Source : [GLITCH — The Amazing Digital Circus, épisode 5 « Untitled »](https://www.youtube.com/watch?v=L4p2gN2CzsA). L’identité de la publication et de la chaîne officielle a été vérifiée par recherche. Les images utilisées sont les storyboards publics servis par YouTube pour cette vidéo, selon la spécification conservée lors de la recherche précédente. Une nouvelle récupération du 20 novembre a répondu **HTTP 200** et retrouvé les mêmes octets.

La [preuve de récupération](reference-retrieval.json) conserve les URLs complètes, la taille, les SHA256, la disposition des cellules et les limites. Les trois planches originales de 960 × 540 comportent neuf images de **320 × 180**, espacées de dix secondes. Les horodatages ci-dessous sont déduits de cette grille ; aucun visionnage du flux complet n’est revendiqué.

| Image consultée | Cellule | Temps approximatif | Observation utile |
| --- | --- | ---: | --- |
| [M7](references/episode5-storyboard-L3-M7.jpg) | 6, index commençant à zéro ; bas gauche | 690 s | Vue en plongée du bar : long comptoir sombre, carrelage noir et blanc, suspensions claires et murs garnis de néons. |
| [M10](references/episode5-storyboard-L3-M10.jpg) | 1 et 4 | 910 et 940 s | Étagères rétroéclairées de verres/bouteilles ; néon de cocktail rose, silhouette de chien en ballon jaune et lampes suspendues. |
| [M11](references/episode5-storyboard-L3-M11.jpg) | 1 ; haut centre | 1000 s | Vue frontale du groupe au comptoir, liseré lumineux, trois suspensions et panneaux de lumière distincts. |

![Vue officielle contenant le plan large du bar en bas à gauche](references/episode5-storyboard-L3-M7.jpg)

Les personnages et une partie du mobilier masquent certains raccords. Les grandes masses, matériaux, teintes et motifs sont exploitables ; la géographie complète, les dimensions et les textes fins ne sont pas certifiés. L’ambiance n’est pas entièrement monochrome : les néons roses, verts et jaunes restent visibles. Ce décor ne permet pas de qualifier les jambes ou les vêtements cachés de Gangle film noir.

## Trois plans produits

- **`far.png`, opaque :** mur et niches sombres, étagères, reflets des vitrages, suspensions et motifs de néons. Les personnages sont retirés. Aucun texte fin n’est reconstruit comme une transcription exacte.
- **`mid.png`, alpha natif :** comptoir sombre placé derrière la zone de combat et sol à damier recomposé en perspective, avec une piste dégagée à y568.
- **`near.png`, alpha natif :** reflets colorés discrets aux bords inférieurs ; aucun obstacle devant les pieds et aucune silhouette ajoutée.

Les [trois sorties](asset-inventory.json) mesurent **1672 × 941**, pour **2 555 199 octets** : fond RGB opaque, plan médian RGBA et reflets RGBA. Les [prompts](generation-prompts.json) et [reçus](generation-receipts.json) conservent les trois appels distincts de `image_gen.imagegen`, les références portables, leurs empreintes et les copies actives. Aucune retouche, mise à l’échelle, conversion ou normalisation de l’alpha n’est appliquée. Quelques pixels d’alpha 1 dans les zones presque transparentes restent natifs ; les reflets visibles du premier plan restent en bas, sous la ligne des pieds.

Le chargeur existant conserve son canevas logique 1280 × 720, ses débords et ses déplacements 6/17/31 pixels. Géométrie du duel, distances, composition et ambiance musicale sont des créations du jeu.

## Protection de la progression

Les [fixtures indépendantes](../../../tests/fixtures/combat-pre-barnoir.json) ont été capturées **avant toute édition runtime** sur le commit local `570fdb31512cdd2a2d5ba5e2c26d7c10b47ae063`, équivalent au parent publié `5be043ba21f3fe7a6dedd3fa1b00dc36f296b540`. La [preuve de capture](before-addition-proof.json) compare les cinq modules concernés aux octets du commit. Elle couvre **54 récits, 60 programmes / 360 checkpoints et trois replays / 789 frames**, dont le contexte `undermap` à 23 arènes.

Le validateur reconnaît maintenant explicitement ce catalogue à 23 arènes lors d’un import, d’une continuation ou d’une reprise après défaite. Les contextes à 12/21/22 arènes restent pris en charge. Les nouveaux programmes peuvent sélectionner ou tirer le bar. La liste des scènes des récits reste celle déjà figée ; **stories, engine, session et stage-parallax n’ont pas été modifiés**.

Les [86 tests ciblés](targeted-tests.log) réussissent sans échec. Ils rejouent également les **270 checkpoints et 14 replays / 3 682 frames** du dossier précédent. Les anciens dossiers et fixtures restent intacts. Le catalogue historique de **468 costumes** est capturé et son préfixe est contrôlé pendant l’ajout parallèle des déclinaisons de PNJ.

## Rendu contrôlé et limites

La [vérification du niveau](verification.json) rattache les résultats aux sources. Le [rapport Canvas](review/canvas-review.json) exécute le vrai chargeur et le renderer de production : **trois fichiers effectivement demandés, trois positions de caméra, trois scènes avec combattants et six contrôles réussis**. La [revue visuelle](visual-review.md) confirme des pieds dégagés, des raccords couverts et des reflets discrets. Les [69 anciens plans](existing-planes-preserved.json) sont identiques aux blobs de départ.

![Le bar seul et en combat aux trois positions de caméra](review/three-cameras.png)

Cette première revue utilise le manifeste `0.7.0-3f1a000c96ca`, art `31622490fbe0884a`, **5 772 images**. Elle sera rafraîchie sur le manifeste global final après l’intégration parallèle des costumes.

Une [tentative navigateur propre à cette vague](browser-result.json) a été exécutée le 20 novembre à 14:51:46 UTC. Chromium s’arrête avant navigation avec `socket() failed: Operation not permitted` ; **zéro contrôle navigateur** n’est passé. Le [journal exact](browser.log) est conservé. Cette limite est distincte du succès Canvas, de la fidélité partielle des références et du suivi CI distant.

## État distant distinct

Le [premier relevé GitHub](ci-state.json) concerne seulement le parent publié : la PR était alors ouverte, en brouillon et non fusionnée, et Encore QA #107 en cours. La [lecture suivante](ci-state-followup.json) constate que la PR #7 a été fusionnée à 14:34:54 UTC, hors de cette passe, avec le commit `a56bf7b9e793412760a4f39aa04926355d31a7ce`. L’arbre de cette fusion est identique au point de départ `c689b08b48514f54e17d1df2c828a46718a5660a`.

La CI #107 du parent est maintenant annulée pendant la vérification navigateur ; contrats, tests Node et deux builds ont réussi, mais la livraison est ignorée. Les deux déploiements Vercel restent en échec pour limite de builds. Ces états ne valident pas la nouvelle vague. Aucune fusion, annulation, relance ni modification du quota n’a été effectuée par cette tâche. Une nouvelle PR en brouillon sera préparée après le gel global.

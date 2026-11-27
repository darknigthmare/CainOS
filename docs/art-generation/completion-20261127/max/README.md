# Max — six familles de bases statiques

Douze PNG natifs nouveaux composent six paires : un portrait de sélection et une garde séparés pour chacune des trois approches de Murder Drones et Meta Runner. Le lot occupe **12 804 580 octets**. Les anciens fichiers Max restent conservés.

| Univers | Hommage vestimentaire | Résident original | Fusion corporelle originale |
| --- | --- | --- | --- |
| Murder Drones | Uzi | Convoyeur des abris | Drone du convoi |
| Meta Runner | Tari | Courrier de Silica City | Avatar du circuit |

Les portraits sont intentionnellement cadrés à la taille. Les gardes montrent la silhouette complète orientée à droite. Un seul personnage apparaît dans chaque image ; aucun cycle d’animation ni dessin d’action supplémentaire n’est créé. Les fusions changent réellement la construction du corps : plaques et articulations mécaniques pour Murder Drones, volumes polygonaux et circuits pour Meta Runner.

## Références et décisions

L’[épisode 2 officiel GLITCH](https://www.youtube.com/watch?v=4ofJpOEXrZs) est documenté par sept pages de son storyboard public : [sources et empreintes](references/episode2-storyboards.json). Il s’agit d’échantillons espacés de dix secondes, pas d’un visionnage continu. Les plans du convoi montrent le petit caïman violet/rouge, son dessous blanc, ses bras courts et son chapeau à calotte ronde. Une [reproduction de l’épisode hébergée par TVmaze](https://www.tvmaze.com/characters/1304195/the-amazing-digital-circus-max) aide à examiner le visage, avec son origine secondaire explicitement conservée.

Le dessin de combat déjà publié fournit la direction artistique 2D. Le nouveau lot corrige le chapeau vers un melon à bande rouge et souligne le bord blanc en zigzag du museau. La taille des yeux, le sourire et les proportions restent une adaptation illustrée ; **aucune fidélité canonique globale 1:1 n’est certifiée**. L’ancienne fiche de la planche pixel dans `combat/fidelity.mjs` décrit une autre représentation archivée ; elle ne doit pas servir de preuve pour les nouveaux PNG.

L’[Uzi V2 Animatez officiel](https://glitchproductions.store/products/uzi-v2-animatez), le [hoodie Tari officiel](https://glitchproductions.store/cdn/shop/files/Tari-Hoodie-Default.png?v=1701236208&width=1600) et une image promotionnelle [Meta Runner](https://www.glitchprod.com/meta-runner) fournissent les repères de vêtements, prothèse et avatar. Les résidents et fusions sont des créations Encore. Ces dessins ne signifient pas que Max apparaît officiellement dans ces séries.

## Production et contrôle

- Génération avec l’outil intégré `image_gen.imagegen`, un appel par dessin. Les [prompts](prompts/) et [reçus](generation-receipts.json) consignent treize appels pour douze images acceptées.
- Le premier portrait hommage à Uzi présentait un bras trop long pour atteindre le chapeau. Une correction native a baissé cette main et restauré les bras courts ; l’essai n’est pas utilisé par le jeu.
- Les douze sorties sont des PNG RGBA distincts avec vraie transparence et marges positives au seuil alpha du renderer. Aucun pixel n’a été recoloré, détouré ou réencodé par un script. Une sortie sans chemin automatique a été enregistrée directement depuis les octets PNG retournés.
- Les douze images ont été inspectées individuellement : visage, chapeau, paires de mains, couleur, garde entière et cohérence des vêtements entre portrait et garde. Le [manifeste](manifest.json) conserve dimensions, alpha, tailles et SHA-256.
- Le [script de revue Canvas](review-canvas.mjs) utilise le renderer de production après rattachement au catalogue. Les preuves d’exécution du lot figurent dans son dossier `canvas` et dans la vérification générale ; la présence du script seule ne vaut pas exécution.

Le lot contient de nouvelles générations, et non douze anciennes images récupérées. La génération native et l’intégration ne constituent pas une validation sur appareils physiques.

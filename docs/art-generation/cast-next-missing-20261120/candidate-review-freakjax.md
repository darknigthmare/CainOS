# Freak Jax — décision de qualification

20 novembre 2026. Références primaires téléchargées et visuellement inspectées : figurine individuelle GLITCH, photo de groupe Side Show ; URLs, SHA-256 et dimensions archivés dans `references/freakjax/downloads.json`. La réponse officielle de catalogue est conservée dans `references/freakjax/official-product.json`.

## Décision

**Famille retenue : `freakjax`, apparence de `jax`.** Le nom Freak Jax figure dans la liste officielle Side Show. Les deux photos montrent le corps entier, deux mains, deux pieds, couleurs et vêtements. La silhouette complète est suffisamment documentée pour des poses originales de jeu en vue de face/trois quarts ; aucune vue arrière cachée n’est reconstruite.

| Élément | Figurine officielle Freak Jax | Dessin historique `peeledjax` inspecté |
| --- | --- | --- |
| Tête | Ronde, jaune, sans oreilles dressées | Crâne de lapin jaune avec deux longues oreilles |
| Yeux | Deux carrés noirs arrondis, sans blanc | Grands yeux blancs et petites pupilles |
| Bouche | Cinq petites marques brunes au bas du visage | Grand sourire/grimace à dents blanches |
| Membres | Bras et pieds violets, gants jaunes | Membres et pieds jaunes, anatomie maigre |
| Habit | Salopette corail intacte, poche et revers clairs | Salopette rose déchirée |
| Dos visible | Volume violet rabattu et deux lobes allongés | Absence de cette silhouette |

La comparaison porte sur `assets/encore/selection/peeledjax.webp` et ne déclare pas cet ancien dessin fidèle ou infidèle à un épisode. Les silhouettes sont suffisamment différentes pour conserver les deux IDs. Le volume violet arrière est décrit d’après sa forme : les photos ne justifient pas de l’appeler une nouvelle queue anatomique.

## Limites et génération

Onze dessins séparés sont prévus : selection, stance, intro, attack, heavy, hit, walk, jump, crouch, victory, defeat. La référence de figurine définit le costume ; l’image de jeu Anime Ribbit ne fournit que le style 2D. PNG individuels natifs via l’outil image_gen intégré, sans modification ultérieure de leurs pixels ou de leur alpha. Révision visuelle de chaque résultat avant acceptation ; cette fiche ne déclare pas à l’avance les onze résultats ni les contrôles d’intégration.

Aucune présence dans un épisode, fidélité canonique 1:1, animation image par image ou intégration runtime n’est certifiée par cette qualification de marchandise.

## Résultat observé avant intégration

Les **11 PNG séparés** ont été produits avec onze appels de génération distincts et acceptés après inspection visuelle individuelle. Les onze emplacements attendus sont présents, avec onze empreintes différentes. Total : **11 190 160 octets**. Tous sont de vrais PNG RGBA ; chaque copie est identique octet par octet au fichier natif. Les références portables et leurs SHA ont été revérifiés.

Les silhouettes au seuil alpha > 12 sont strictement à l’intérieur des onze images. Six natifs ont quelques pixels de bord presque transparents (alpha = 1) ; aucune transparence exactement nulle sur tous les bords n’est donc revendiquée, et aucun nettoyage de pixels n’a modifié les fichiers natifs.

Inventaire et mesures : [generated/freakjax/evidence/final-inventory.json](generated/freakjax/evidence/final-inventory.json). Chaque PNG possède son reçu JSON et son prompt exact dans le sous-dossier `jobs/`. Les contrôles de moteur, le rendu Canvas en jeu et la publication relèvent du lot d’intégration ; ils ne sont pas revendiqués dans ce bilan de production native.

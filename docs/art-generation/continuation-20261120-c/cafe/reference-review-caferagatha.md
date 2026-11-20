# Revue de référence — Ragatha Café

Date : 20 novembre 2026. Relecteur : `generate_cafe_ragatha`.

## Source de la tenue

L'illustration officielle de la collaboration Animate Café / DECOTTO × The Amazing Digital Circus est la référence de costume : [communiqué Animate sur PR TIMES](https://prtimes.jp/main/html/rd/p/000008857.000016756.html). La copie locale examinée est `docs/art-generation/continuation-20261120-b/cafe/references/animate-press-main.jpg` (181 618 octets ; SHA-256 `135cc4a9f9a02c4ed0b9358c98754ab5339a054520c6ad53c9dd2a02323f397b`). Ragatha est le deuxième personnage en partant de la gauche sur cette affiche.

La sélection existante `assets/encore/selection/ragatha.webp` a été examinée pour l'identité de poupée, les proportions et le style graphique du jeu (SHA-256 `ef1ef3d6a4153027f1e28263a59f6c3aa5aaa8cce9a405b64a01013a53b5b5fe`). La variante existante `assets/encore/selection/maidragatha.webp` a également été examinée pour éviter de créer un doublon (SHA-256 `76b3c2e5de934a61b5be809ce54619161a4830d117a38eeb75216d44642c977a`).

## Différences retenues entre Café et Maid

| Élément | Famille Café créée | Variante Maid existante |
| --- | --- | --- |
| Coiffe | Coiffe blanche froncée et nœuds bleu marine | Coiffe avec nœud rouge |
| Tablier | Grands nœuds bleu clair, motifs de pièces cousues pâles, bord blanc festonné | Gros bouton bleu sur le tablier |
| Robe | Bleu marine, manches ballon, bord blanc festonné | Lecture noire du costume |
| Jambes et chaussures | Bas blancs, plateformes bleu marine avec accents clairs | Souliers noirs à boucles dorées |

L'œil bouton bleu avec couture en X, l'autre œil blanc à pupille noire, le nez triangulaire rouge, la peau de poupée beige et les cheveux de fil rouge restent les repères d'identité. Le plateau et la nourriture de l'affiche ont été omis pour les poses de combat demandées.

## Génération et traçabilité

La définition figée est `definitions/caferagatha.json`, SHA-256 `7e7e4089742816d9ae310404d10ecc7ed0fd526e8be1452e604dfbbf979de654`. Les 11 jobs, dans `generated/caferagatha/jobs/`, conservent les prompts exacts, l'ordre et le rôle des références ainsi que leurs empreintes. Chaque pose possède un PNG natif et son reçu JSON, tous enregistrés par `record-native-art.py`.

La première sélection présentait encore un grand nœud lavande hérité du costume de base. Elle est conservée dans `generated/caferagatha/attempts/selection-initial/` comme tentative rejetée. Un appel de correction distinct a retiré ce nœud. La sélection corrigée est la référence de famille des dix autres poses, chacune créée par un appel distinct de `image_gen.imagegen` avec `transparent_background: true`. Aucun retournement, recoloriage, découpage ou réencodage n'a servi à fabriquer les poses.

Les 11 fichiers acceptés ont chacun une empreinte et un identifiant de génération distincts. Leurs octets sont identiques à ceux des fichiers natifs retournés par l'outil. Les fichiers sont en RGBA, 1 024 × 1 536 pixels. Leur alpha s'étend de 0 à 254 ; les zones du personnage sont presque opaques, sans avoir été normalisées artificiellement à 255.

## Revue des poses

| Slot | Action observée |
| --- | --- |
| selection | Salut d'accueil, main levée |
| stance | Garde avec deux poings et appuis écartés |
| intro | Révérence en tenant les bords de la jupe |
| attack | Coup de poing vers la droite |
| heavy | Frappe avec les deux mains jointes, fente vers la droite |
| hit | Recul surpris, mains ouvertes |
| walk | Pas vers la droite, bras en opposition |
| jump | Saut vers la droite, jambes repliées |
| crouch | Garde accroupie, paume avancée |
| victory | Poing levé, autre main à la hanche |
| defeat | Pose assise abattue, une main en appui |

Chaque silhouette est entière et conserve les deux chaussures. Les composites sur fond clair et sur fond sombre de `review/caferagatha/` ont été examinés pour les 11 poses. Aucun halo coloré visible n'y a été constaté. L'aperçu brut de certains PNG peut montrer des couleurs stockées dans des pixels à alpha nul ; cet aperçu seul n'est pas une preuve de halo visible. Les JPG de diagnostic sont des fichiers séparés et ne remplacent pas les PNG natifs.

## Portée et limites

Il s'agit d'une adaptation de la tenue officielle à des poses originales pour le jeu. Les mouvements, l'arrière du costume et certains plis sont des interprétations. Ce travail ne certifie pas une reproduction 1:1 ni une apparition dans un épisode. Chaque slot de mouvement contient une illustration ; il ne constitue pas une animation complète.

Toutes les silhouettes restent à l'intérieur du canevas. Les marges varient selon la pose : la sélection laisse 42 pixels sous les semelles ; la défaite laisse 43 pixels à droite ; la frappe lourde laisse 46 pixels à gauche (mesure sur alpha > 12). Ces marges sont intactes mais plus modestes que la cible initiale de 10 %. Le placement et l'échelle dans le jeu nécessitent la revue d'intégration habituelle. Aucune modification du runtime, du classeur de suivi, ni aucun commit n'a été effectué par cet agent.

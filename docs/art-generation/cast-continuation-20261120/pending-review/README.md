# Galerie des apparences en préparation

Ces neuf apparences sont **absentes du runtime**. Elles conservent **36 PNG sur 99 attendus** ; **63 poses restent à générer**. Elles ne sont pas annoncées comme des familles terminées.

Chaque planche JPEG contient onze cases étiquetées : sélection, garde, introduction, marche, saut, accroupi, attaque, attaque lourde, impact reçu, victoire et défaite. Les PNG disponibles sont composés sur fond clair. Le contenu des cases manquantes est uniquement **« À générer »**. Chaque planche porte le titre **« EN PRÉPARATION — N/11 »**.

| Apparence | PNG conservés | Poses manquantes |
| --- | ---: | ---: |
| [Gangle — sourire de tragédie](smilingtragedygangle.jpg) | 2/11 | 9 |
| [Pomni — abstraction partielle](abstractingpomni.jpg) | 2/11 | 9 |
| [Jax — abstraction partielle](abstractingjax.jpg) | 3/11 | 8 |
| [Ragatha — abstraction partielle](abstractingragatha.jpg) | 3/11 | 8 |
| [Kinger — abstraction partielle](abstractingkinger.jpg) | 2/11 | 9 |
| [Gangle — abstraction partielle](abstractinggangle.jpg) | 5/11 | 6 |
| [Zooble — abstraction partielle](abstractingzooble.jpg) | 2/11 | 9 |
| [Queenie — abstraction partielle](abstractingqueenie.jpg) | 9/11 | 2 |
| [Zooble — Assemblage épisode 5](zoobleep5.jpg) | 8/11 | 3 |
| **Total** | **36/99** | **63** |

## Portée de la revue

Le [plan gelé](../appearance-plan.json) distingue six familles complètes actives et neuf familles partielles archivées. La présente galerie montre uniquement ces neuf familles partielles. Les images disponibles restent dans le dossier **pending-assets** ; les chemins actifs prévus sont conservés dans les champs **targetFile** de leurs métadonnées.

Les JPEG sont des compositions de revue réalisées avec **Canvas / Skia** (module **@napi-rs/canvas**) à **2360 × 1440 pixels**. L’intégralité du canevas de chaque PNG est ajustée à sa case, sans recadrage. Aucune génération d’image et aucune modification, recompression ou transformation des PNG sources n’a eu lieu. Ces JPEG ne sont pas des sprites de jeu.

Les **36 empreintes SHA-256** ont été vérifiées avant et après la composition, et concordent avec le plan gelé. Le [manifeste de revue](review-manifest.json) conserve les chemins, empreintes avant/après et comptes par apparence. Le [script Canvas](render-pending-review.cjs) reproduit cette galerie.

Les poses de jeu sont des adaptations originales. Cette galerie permet d’examiner les silhouettes conservées et les manques ; elle ne certifie pas une fidélité 1:1 aux épisodes ou aux produits de référence.

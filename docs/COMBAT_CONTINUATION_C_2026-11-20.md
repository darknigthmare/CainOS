# Ragatha, Gangle et Zooble Café — continuation du 20 novembre 2026

Cette vague complète **trois apparences Café et 33 PNG individuels** dans Digital Circus — Encore. Elle suit la [continuation Kinger / Pomni / Meta Runner / softball](COMBAT_CONTINUATION_B_2026-11-20.md). Les 477 costumes déjà publiés restent dans le même ordre et conservent leurs objets JSON exacts.

## Trois familles actives

| Apparence | Repères de la tenue | Livré |
| --- | --- | ---: |
| Ragatha — Café (`caferagatha`) | Nœuds bleu clair du tablier, coiffe à nœuds marine, bas blancs et plateformes bleu nuit ; distincte de `maidragatha`. | 11 PNG |
| Gangle — Café (`cafegangle`) | Masque allongé à petite bouche en w, coiffe à oreilles roses, cœur jaune, mains gris lilas et membres en rubans ; distincte de `maidgangle`. | 11 PNG |
| Zooble — Café (`cafezooble`) | Gilet violet, long tablier marine, bras et pieds asymétriques, dont une spirale jaune et une chaussure marine ; distincte de `noirzooble`. | 11 PNG |

Chaque famille possède un portrait de sélection, une garde et neuf dessins d’action : entrée, attaque, coup lourd, réception d’un coup, marche, saut, accroupissement, victoire et défaite. Le coup lourd utilise son propre dessin. Chaque PNG contient un seul personnage.

La référence de tenue est l’illustration officielle [DECOTTO / Animate Café × The Amazing Digital Circus](https://prtimes.jp/main/html/rd/p/000008857.000016756.html). Les [revues individuelles](art-generation/continuation-20261120-c/cafe/README.md) distinguent les détails visibles, les accessoires exclus et les adaptations nécessaires aux poses du jeu. Les plateaux, aliments et boissons de présentation ne sont pas ajoutés aux personnages de combat.

## PNG natifs et provenance

Les **33 PNG / 42 202 157 octets** proviennent de générations individuelles avec transparence native. Les prompts exacts, références ordonnées, empreintes, dimensions et observations visuelles accompagnent chaque fichier. Les archives et les copies installées sont identiques aux sorties natives, sans découpage, retournement, redimensionnement ni réencodage du fichier livrable.

Deux sélections initiales sont conservées comme tentatives remplacées : le nœud lavande hérité du costume de base de Ragatha a été retiré par une nouvelle génération ; un petit détail doré de la chaussure de Zooble a été corrigé de la même façon. La première inquiétude sur un halo dans l’aperçu brut de Zooble a été rectifiée après composition sur fond opaque : ces couleurs étaient dans les pixels transparents. Aucun halo visible n’est constaté dans les revues finales.

L’[inventaire des 33 fichiers](art-generation/continuation-20261120-c/cafe/asset-inventory.json) et la [preuve d’intégration](art-generation/continuation-20261120-c/cafe/integration-proof.json) relient les fichiers natifs aux chemins actifs. Les aperçus de contrôle sont séparés des PNG livrables.

## Catalogue actuel

| Élément | Total après cette vague |
| --- | ---: |
| Combattants / techniques | 54 / 540 |
| Costumes sélectionnables | **480** |
| Costumes d’archive | 51 |
| Apparences Circus supplémentaires / PNG | **45 / 495** |
| Crossovers / fichiers | 384 / 3 847 |
| Arènes partagées / plans | 25 / 75 |
| Arrangements dédiés réutilisant les arènes | 54 |
| Entrées d’archive | 179 |
| Images du paquet hors ligne | **5 907** |

Le manifeste final est **`0.7.0-274a8da5b442`**, art **`6a11a21a795ee221`**, pour **3 215 944 062 octets d’images**. Ces compteurs proviennent des [modules réellement importés](art-generation/continuation-20261120-c/runtime-counts.json).

## Vérifications exécutées

| Contrôle | Résultat |
| --- | --- |
| QA globale `npm run qa` | **432 tests réussis, 0 échec, 0 ignoré** |
| Distributions CainOS et Encore autonome | **Deux builds réussis** |
| Rendu des actions et gardes dans les deux orientations | **60 contrôles réussis**, aucun dessin manquant ou coup lourd réemployé |
| Portraits de sélection | Trois portraits vérifiés et examinés |
| Scènes sur décors de production | Trois scènes : softball, Barnoir, Sous la carte ; six gardes effectivement dessinées |
| Copies des nouveaux PNG dans les deux distributions | **66 comparaisons identiques** |
| Copies des modules concernés dans les deux distributions | **38 comparaisons identiques** |
| Fichiers Encore antérieurs | **5 830 fichiers inchangés** |
| Catalogue historique | **477 costumes, 42 ajouts Circus et 48 extensions préservés** |

Les [planches d’actions et portraits](art-generation/continuation-20261120-c/canvas/README.md) et les [trois compositions de scènes](art-generation/continuation-20261120-c/canvas/scenes/scenes-overview.jpg) ont été examinées. Les personnages restent entiers et lisibles, sans halo visible. Le moteur conserve l’échelle uniforme et l’orientation attendue. Les scènes complémentaires vérifient les sources réellement dessinées et l’absence de mutation de la simulation.

Le premier passage de QA a obtenu **431/432** : la liste précise des sources Animate Café ne connaissait pas encore les trois nouveaux IDs. Le contrôle conserve le chemin officiel et le type de source ; il vérifie maintenant aussi les limites propres à ces trois costumes. La [tentative initiale](art-generation/continuation-20261120-c/attempts/global-qa-01/qa-execution.json) est archivée séparément. Le résultat final et les deux builds figurent dans la [preuve consolidée](art-generation/continuation-20261120-c/verification.json).

Une tentative du parcours navigateur sélection → garde-robe → combat a été effectuée sur ce runtime. **Chromium s’est arrêté avant la création d’une page** avec `socket() failed: Operation not permitted`. Zéro contrôle applicatif a été exécuté et aucune capture navigateur n’a été produite. Le [journal de cette tentative](art-generation/continuation-20261120-c/browser-review/README.md) conserve l’erreur et les empreintes contrôlées. Les rendus Canvas2D/Skia ne sont pas présentés comme une validation navigateur.

## Suivi de production

Le fichier éditable est [DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx](DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx). La vague ajoute **36 lignes Production, 39 lignes QA et trois sources**, pour atteindre **3 344 lignes Production, 2 493 lignes QA et 164 sources**. La comparaison native de l’export et le réimport contrôlent **83 423 cellules sans différence**, avec **42 formules, onze feuilles et dix tables** conservées. Les **27 vues finales** sont acceptées, avec une relecture indépendante des dix vues Production et dix vues QA.

Le [dossier de réconciliation de la vague C](art-generation/continuation-20261120-c/workbook/README.md) relie les trois familles, les 33 dessins et les contrôles réellement exécutés. Les IDs, notes et preuves historiques sont conservés ; les travaux non exécutés restent ouverts. Les copies de build temporaires ont été supprimées après les vérifications d’intégrité réussies pour libérer l’espace nécessaire au classeur ; les fichiers sources, les PNG et les preuves finales restent conservés.

## Portée et manquants conservés

Ces images sont des adaptations originales de tenues officiellement illustrées. Les parties arrière non montrées, les petits raccords de Zooble et certains détails de mains de Gangle ne sont pas certifiés par cette affiche. Les onze images d’une famille sont des poses statiques, sans revendication de cycles animés complets ni de correspondance canonique 1:1.

Le [registre des travaux restants](art-generation/continuation-20261120-c/remaining-work.md) garde **1 074 tenues crossover de PNJ**, les références occultées, les cycles d’animation complets et les essais physiques ouverts. Aucun nouveau décor n’est ajouté dans cette vague. Les tenues Café Jax et Caine ne sont pas comptées comme de nouvelles familles complètes sans qualification de leur distinction.

Cette continuation est destinée à la [PR #9](https://github.com/darknigthmare/CainOS/pull/9), conservée en brouillon pour revue. Les contrôles distants doivent être lus pour la révision effectivement publiée ; les résultats d’un parent ne valident pas le nouveau commit.

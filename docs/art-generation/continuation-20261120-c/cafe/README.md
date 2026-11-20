# Ragatha, Gangle et Zooble — tenues Café

Trois familles complètes de onze fichiers chacune ont été générées à partir de l’illustration officielle DECOTTO / Animate Café et des identités déjà présentes dans le jeu. Les **33 PNG natifs / 42 202 157 octets** sont actifs. Chaque dessin représente un seul personnage avec transparence native.

| Famille | Définition figée | Référence et portée | Revue de production |
| --- | --- | --- | --- |
| Ragatha — Café | [Définition](definitions/caferagatha.json) | [Revue](reference-review-caferagatha.md) | [Galerie](../canvas/caferagatha/README.md) |
| Gangle — Café | [Définition](definitions/cafegangle.json) | [Revue](reference-review-cafegangle.md) | [Galerie](../canvas/cafegangle/README.md) |
| Zooble — Café | [Définition](definitions/cafezooble.json) | [Revue](reference-review-cafezooble.md) | [Galerie](../canvas/cafezooble/README.md) |

Pour chaque ID, `generated/<id>/` contient `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory` et `defeat`, chacun en PNG et accompagné de son reçu JSON. Le sous-dossier `jobs/` conserve le prompt exact et les références ordonnées. Les tentatives remplacées restent archivées et ne sont pas actives.

La [preuve d’intégration](integration-proof.json) vérifie les définitions figées, les 33 générations distinctes, leurs références, les copies exactes et le catalogue historique avant d’activer les trois familles. L’[inventaire](asset-inventory.json) relie archives, reçus et chemins `assets/encore/`. Le [résultat final](generation-completion.json) est `complete_active`. Les synthèses individuelles datées, produites à la fin de la génération, gardent leur statut historique antérieur à cette activation ; le manifeste collectif et la preuve consolidée décrivent l’état final.

Les diagnostics sur fonds clair et sombre et les galeries ne remplacent pas les fichiers natifs. Les coiffes, mains, antennes, rubans et chaussures restent dans le cadre ; certaines marges initiales sont plus modestes que la cible de génération et sont signalées dans les revues. Le placement final a été examiné dans le renderer de production.

Les accessoires de présentation de l’affiche ne font pas partie du corps de combat. Les poses et vues arrière sont des adaptations originales ; les onze images par famille ne constituent pas des animations complètes. Voir le [bilan général](../../../COMBAT_CONTINUATION_C_2026-11-20.md) et le [registre des manquants](../remaining-work.md).

# Revue Canvas — trois familles Café

Les trois familles ont été rendues avec les modules Canvas2D de production, sous Node et Skia. Les rapports sources sont conservés intégralement dans la synthèse.

- [Synthèse complète](canvas-review.json) : 27 actions, 3 gardes, 3 portraits ; 60 contrôles de dessin dans les deux orientations ; 33 fichiers distincts, aucun manquant et aucun coup lourd réemployé.
- [Revue visuelle](visual-review.json) : `accepted_with_stated_scope`, avec observations par famille et limites explicites.
- [Ragatha : actions](caferagatha/actions-caferagatha.jpg) et [portrait](caferagatha/archive-portraits-01.jpg).
- [Gangle : actions](cafegangle/actions-cafegangle.jpg) et [portrait](cafegangle/archive-portraits-01.jpg).
- [Zooble : actions](cafezooble/actions-cafezooble.jpg) et [portrait](cafezooble/archive-portraits-01.jpg).
- [Vue des trois scènes](scenes/scenes-overview.jpg) et [preuve des scènes](scenes/scene-review.json) : trois décors de production, six gardes réellement émises et état de simulation inchangé.

Les scènes sont reproductibles depuis la racine du dépôt :

```bash
node docs/art-generation/continuation-20261120-c/canvas/review-cafe-scenes.mjs
```

Les commandes exactes des trois galeries figurent dans la synthèse. Il s'agit de rendus statiques : aucun navigateur ni parcours interactif, aucun test de périphérique physique et aucune animation complète ne sont attestés par cette revue. La lisibilité des rendus ne constitue pas une certification canonique 1:1.

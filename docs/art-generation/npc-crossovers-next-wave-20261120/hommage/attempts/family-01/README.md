# Ribbit × Murder Drones — Hommage à Uzi

Cette famille originale pour Encore contient **11 PNG individuels natifs**, soit **10 403 813 octets** : sélection, garde, introduction, attaque, attaque lourde, réaction, marche, saut, accroupissement, victoire et défaite.

## Références et limites

L’identité de Ribbit est étayée par la vue officielle entière « Iconic » de [Ribbit Pendantz Blindbox](https://glitchproductions.store/products/ribbit-pendantz-blindbox). Les motifs de la tenue proviennent des vues avant et arrière officielles de [Uzi V2 Animatez](https://glitchproductions.store/products/uzi-v2-animatez). Les sources, leurs URL et leurs empreintes sont archivées dans [references/downloads.json](references/downloads.json) ; les observations précises figurent dans [reference-review.md](reference-review.md).

Les proportions élancées suivent l’adaptation déjà utilisée par le jeu. Le costume est un hommage original : il conserve le corps biologique, les grands yeux, le museau menthe et le nœud rose de Ribbit. Il n’est présenté ni comme une tenue canonique, ni comme un modèle officiel, ni comme une fidélité à un épisode.

## Production et contrôles observés

Chaque PNG a été généré séparément avec l’outil intégré `image_gen.imagegen`. La sélection acceptée sert de référence commune aux dix autres poses. Les onze fichiers, leurs prompts, leurs références et leurs reçus figurent dans `generated/` et `jobs/`.

[generation-completion.json](generation-completion.json) recense les onze fichiers, leurs dimensions, leurs empreintes et leurs destinations prévues. L’audit a confirmé onze empreintes d’image distinctes, onze copies identiques aux sorties natives et 34 comparaisons de références portables sans écart. Les alpha et octets natifs sont conservés : aucune conversion en WebP, découpe ou retouche n’a été appliquée.

Les onze images ont été inspectées individuellement. La [planche de contrôle sur damier](native-alpha-review.png) a ensuite été inspectée avec l’alpha réellement composé : silhouettes entières, poses distinctes et tenue cohérente, sans fond visible. Les résultats et leurs limites sont consignés dans [visual-review.json](visual-review.json). Cette planche dérivée sert exclusivement à la revue ; elle n’est pas un actif du jeu.

## État au moment de la remise

Les onze PNG natifs sont acceptés pour intégration. Les reçus gardent `includedInRuntime: false` à ce stade de production. La copie dans les actifs, le chargeur Canvas, les builds et la QA globale sont à établir par les preuves d’intégration de la vague ; cette famille ne les déclare pas exécutés.

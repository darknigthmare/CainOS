# Ribbit × Murder Drones — Hommage à Uzi

Cette famille originale pour Encore contient **11 PNG individuels natifs**, soit **10 519 066 octets** : sélection, garde, introduction, attaque, attaque lourde, réaction, marche, saut, accroupissement, victoire et défaite.

## Références et limites

L’identité de Ribbit est étayée par la vue officielle entière « Iconic » de [Ribbit Pendantz Blindbox](https://glitchproductions.store/products/ribbit-pendantz-blindbox). Les motifs de la tenue proviennent des vues avant et arrière officielles de [Uzi V2 Animatez](https://glitchproductions.store/products/uzi-v2-animatez). Les sources, leurs URL et leurs empreintes sont archivées dans [references/downloads.json](references/downloads.json) ; les observations précises figurent dans [reference-review.md](reference-review.md).

Les proportions élancées suivent l’adaptation déjà utilisée par le jeu. Le costume est un hommage original : il conserve le corps biologique, les grands yeux, le museau menthe et le nœud rose de Ribbit. Il n’est présenté ni comme une tenue canonique, ni comme un modèle officiel, ni comme une fidélité à un épisode.

## Production et contrôles observés

Chaque PNG a été généré séparément avec l’outil intégré `image_gen.imagegen`. La première sélection a servi de référence commune aux dix autres poses de la famille initiale. Cette famille initiale entière, ses reçus, ses jobs et ses revues ont été copiés sans modification dans [attempts/family-01/manifest.json](attempts/family-01/manifest.json) avant révision : 39 fichiers archivés et vérifiés par empreinte.

La revue a ensuite motivé une harmonisation originale des mains à trois lobes, pouce compris, en cohérence avec les sélections Résident et Fusion de ce lot. Ce choix n’est pas une anatomie canonique officiellement établie. Huit poses ont reçu une nouvelle sortie native : `selection`, `stance`, `intro`, `attack`, `hit`, `jump`, `crouch` et `defeat`. Neuf appels de correction ont produit huit corrections acceptées et un essai `hit` rejeté, conservé dans `attempts/hit-correction-02/`. Les trois dessins `heavy`, `walk` et `victory` sont ceux de la famille initiale, sans nouvelle génération.

Les nouveaux jobs référencent leur pose archivée et la garde Ribbit du jeu. Le dernier essai `hit` référence également son essai natif précédent. Pour les trois dessins conservés, seuls les chemins de `portableReferences` vers la sélection historique ont été relocalisés vers l’archive de mêmes octets et SHA ; leurs prompts et `referencePaths` restent inchangés. Le passage ultérieur de `includedInRuntime` à `true` enregistre l’intégration sans modifier cette provenance. La définition figée reste inchangée.

[generation-completion.json](generation-completion.json) recense les onze fichiers actuels, leurs dimensions, leurs empreintes, leurs jobs réellement utilisés et leurs destinations. L’audit a confirmé onze empreintes d’image distinctes, onze copies identiques aux sorties natives, 26 comparaisons de références portables sans écart et onze copies installées identiques. Les alpha et octets natifs sont conservés : aucune conversion en WebP, découpe ou retouche externe n’a été appliquée.

Les onze images actuelles ont été inspectées individuellement et la [planche de contrôle sur damier](native-alpha-review.png) a été relue avec l’alpha réellement composé : silhouettes entières, poses distinctes et tenue cohérente, sans fond visible. La revue distingue les quatre corrections produites par `ribbit_references`, revues par leur auteur puis croisées par `audit_github`, des sept autres images relues indépendamment par `ribbit_references`. Les résultats et leurs limites sont consignés dans [visual-review.json](visual-review.json). Cette planche dérivée sert exclusivement à la revue ; elle n’est pas un actif du jeu.

## État au moment de la remise

Les onze PNG natifs sont acceptés et leurs copies dans les actifs ont été vérifiées par empreinte. Les reçus actuels portent `includedInRuntime: true`. Les contrôles du chargeur Canvas, les builds et la QA globale sont documentés séparément dans les preuves d’intégration de la vague ; cette revue native ne les revendique pas.

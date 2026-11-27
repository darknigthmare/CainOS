# Qualification des tenues Animate Café — continuation B

20 novembre 2026. **Deux nouvelles familles retenues : `cafekinger` et `cafepomni`, onze dessins natifs chacune.** La coordination root a confirmé ces deux IDs avant génération. Les costumes existants restent inchangés.

## Référence et portée

Le [communiqué d’Animate Holdings sur PR TIMES](https://prtimes.jp/main/html/rd/p/000008857.000016756.html), daté du 27 août 2026, annonce la collaboration DECOTTO et ses illustrations commerciales. La page primaire a été rouverte. Les deux JPEG déjà archivés sont réutilisés sans nouveau téléchargement, retouche ou réencodage : affiche 1000 × 707 et panneau de produits 1000 × 708. [Les sources](references/sources.json) conservent leurs URLs, empreintes et rectangles des deux extraits de repérage. Les petits produits répètent les mêmes dessins ; ils ne fournissent pas un angle arrière indépendant.

Cette qualification décrit une illustration officielle de collaboration. Elle ne prouve pas une apparition en épisode, des proportions canoniques mesurées ni une animation complète. Les poses de combat restent des créations statiques pour le fan-game.

## Comparaison des 91 costumes actifs

[L’inventaire figé](active-costumes-inventory.json) couvre les **51 costumes d’archive et les 40 ajouts Circus** présents avant cette continuation. Le tri compare propriétaire, traits, références et silhouette ; les dessins proches ont ensuite été examinés. La planche historique des variantes demandées montre notamment les anciennes Maid Pomni, Maid Ragatha et Maid Jax. Le Kinger de base et Noir Kinger ont été inspectés séparément.

| Personnage de l’affiche | Présence actuelle ou rapprochement | Décision de ce lot |
| --- | --- | --- |
| Ribbit | `caferibbit`, déjà adapté de cette affiche | Déjà livré ; aucune duplication. Le Pendantz `maidribbit` reste non qualifié. |
| Jax | `maidjax` : coiffe et tablier blancs, robe sombre à cœur violet, bas blancs, chaussures sombres à nœuds | Même famille reconnaissable ; pas de nouveau `cafejax` sur la seule base d’un changement d’illustration. |
| Ragatha | `maidragatha` existe ; l’affiche ajoute de grands nœuds bleus, alors que l’ancien dessin comporte un bouton bleu sur le tablier | Variante proche, à comparer plus finement avant tout nouvel ID ; non comptée comme nouvelle famille ici. |
| Gangle | `maidgangle` existe avec robe sombre, coiffe/tablier blancs et nœuds rouges | Famille déjà présente au niveau de ces traits ; shaker et service de l’affiche ne suffisent pas seuls à annoncer une tenue nouvelle. Détails non certifiés identiques. |
| Pomni | `maidpomni` existe mais bonnet sombre à pompons blancs, boutons au buste et chaussures noires dans l’ancien dessin | **Nouvelle apparence `cafepomni`** : bonnet rouge/bleu nuit à grelots jaunes, grands nœuds rouge et bleu sur tablier et chaussures rouge/bleue. Aucun renommage de l’ancienne. |
| Kinger | Japonais, baseball, ombre, château de sable, noir, abstraction partielle et dompteur sont présents ; aucun ne réunit cette tenue | **Nouvelle apparence `cafekinger`** : monocle argenté, queue-de-pie violette, gilet gris lilas, rosette bleue et base conique habillée sans hermine. |
| Caine | `ringmastercaine` possède un costume noir, mais son chapeau, plastron et canne diffèrent de la coiffe et du service café | Candidat distinct possible, non qualifié ni produit dans ce lot ; ne pas assimiler automatiquement à Ringmaster. |
| Zooble | Plusieurs assemblages et `noirzooble` sont présents ; aucun n’est répertorié comme cette tenue de service colorée | Candidat ultérieur. Vêtement, raccords partiellement masqués et membres doivent être comparés avant décision. |

## Café Kinger : corps et tenue

La croix et les deux yeux saillants restent attachés à la tête beige de pièce d’échecs. Un monocle argenté avec chaîne couvre l’œil le plus haut, à gauche de l’illustration. La tenue comporte une queue-de-pie violette à liserés clairs et longs pans doublés de lilas, un gilet gris lilas à motifs géométriques discrets et boutons sombres, un col blanc, une cravate noire et une rosette bleue. Le bas demeure un volume conique violet à lignes longitudinales et base circulaire bleu nuit, avec un fin bord clair. Aucun pantalon, pied ou jambe n’est déduit de cette forme.

Les mains ne sont pas clairement attribuables à Kinger sur l’affiche. Les poses emploieront **deux gants flottants sans bras**, d’après `assets/encore/selection/kinger.webp` et la photo officielle [Bug Tamer Kinger déjà archivée](../../cast-next-20261120/research/merch/official-bug-tamer-kinger.png), inspectée séparément. Cette référence secondaire établit l’anatomie du personnage ; son seau, son cerceau, ses flammes, son papillon et son vêtement ne sont pas transférés. Le dos et les plis non montrés resteront des adaptations sobres.

## Café Pomni : différence avec Maid Pomni

La silhouette entière est visible, du bonnet aux chaussures. Pomni garde sa tête blanche, ses cheveux bruns courts et ses iris rouges/bleus. La coiffe blanche se superpose au bonnet rouge et bleu nuit à deux pointes et grelots jaunes. La robe courte bleu nuit porte un tablier blanc volanté et deux grands nœuds de couleurs différentes. Les mains sont blanches, les jambes blanches et fines ; deux revers blancs festonnés précèdent une chaussure rouge à droite anatomique et une bleu nuit à gauche anatomique.

L’ancienne `maidpomni` reste conservée : son bonnet sombre à pompons blancs et ses chaussures noires sont visuellement différents. Les mains croisées masquent une partie du haut du plastron dans l’illustration café ; aucun symbole inédit n’y est affirmé. Ni le dos, ni les coutures cachées, ni une coupe tridimensionnelle complète ne sont établis. Les nouveaux gestes gardent ces zones simples.

## Production autorisée

Les définitions de [Kinger](definitions/cafekinger.json) et [Pomni](definitions/cafepomni.json) sont figées avant le premier appel. Chaque famille aura `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory` et `defeat`.

L’outil intégré `image_gen.imagegen` produit un personnage complet par PNG, alpha natif et orientation écran droit. La sélection acceptée devient la référence des dix autres poses. Les PNG natifs ne sont ni retouchés, ni redimensionnés, ni réencodés ; les diagnostics de revue restent séparés. Jobs, reçus, références hachées et essais rejetés sont conservés ici. L’intégration runtime, les contrôles Canvas et le classeur seront traités après le gel de ces sources.

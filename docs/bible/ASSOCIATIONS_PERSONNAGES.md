# Associations des personnages au guide de combat

État documentaire du 2026-11-25, à partir du runtime de la PR #14, commit `abb53b227c76c47832f44810aab1aa102286388c`.

Le [registre détaillé](character-associations.json) relie les **64 combattants** aux rubriques de la bible, à leurs **640 techniques**, **256 affrontements de route**, **384 tableaux**, **192 finales**, **64 amitiés** et **64 arrangements de décor**. Les identifiants du jeu restent l’autorité. Les noms de coups, ressources, rivalités de parcours et scènes sont des adaptations ou créations Encore.

Ce document est un raccord avec le catalogue publié. Il n’ajoute aucun dessin ni animation et ne certifie pas la fidélité canonique 1:1. Les notices de référence et de revue du runtime sont conservées avec leur portée, y compris leurs incertitudes ou leur caractère historique.

## Lire les associations

- **Jeu existant** : données exactes de [data.mjs](../../combat/data.mjs), [stories.mjs](../../combat/stories.mjs), [finisher-catalog.mjs](../../combat/finisher-catalog.mjs), [friendship-catalog.mjs](../../combat/friendship-catalog.mjs) et [projectile-art.mjs](../../combat/projectile-art.mjs).
- **Guide** : chaque personnage est associé aux sections fidélité, roster, combat, movesets, conclusions, relations, routes, scènes, projectiles, art, présentation, entraînement, accessibilité, statistiques et fiches types. Voir la [matrice](COMBAT_GAMES_GUIDE_INTEGRATION.md).
- **Scènes** : 104 tableaux de prologue/épilogue ont une image dédiée inscrite au manifeste ; les 280 autres utilisent une composition de décor et de personnages. Cette différence n’établit pas une panne. Les images de briefing de chapitre constituent un autre inventaire.
- **Projet de campagne globale** : les rôles ci-dessous viennent de [La Répétition impossible](CAMPAGNE_GLOBALE.md), conçue dans la bible et non intégrée au jeu. Ses 36 scènes sont des briefs, sans nouvelles images produites.
- **Chiffres des techniques** : les valeurs et propriétés présentes sont copiées telles quelles ; un champ absent n’est pas remplacé par un zéro. Aucune frame advantage n’est déduite de la seule récupération.

## Index du roster

Dans « coups / finales / amitié », les finales correspondent aux trois variantes existantes impact, special et super ; elles ne désignent pas trois nouveaux pouvoirs canoniques.

| ID | Personnage | Rival dans la route | Route existante | Coups / finales / amitié | Arrangement | Campagne globale : chapitres proposés |
| --- | --- | --- | --- | --- | --- | --- |
| `pomni` | Pomni | Jax · ch. 2 | Une sortie à sa mesure | 10 / 3 / 1 | `home-pomni` | 01 : jouable ; 08 : jouable ; 12 : jouable |
| `jax` | Jax | Zooble · ch. 2 | Le gag de trop | 10 / 3 / 1 | `home-jax` | 01 : adversaire ; 09 : jouable ; 11 : adversaire ; 12 : présence en scène |
| `ragatha` | Ragatha | Pomni · ch. 1 | Le fil du spectacle | 10 / 3 / 1 | `home-ragatha` | 02 : jouable ; 11 : jouable ; 12 : présence en scène |
| `gangle` | Gangle | Jax · ch. 3 | Derrière le masque | 10 / 3 / 1 | `home-gangle` | 03 : jouable ; 12 : présence en scène |
| `zooble` | Zooble | Jax · ch. 3 | À prendre ou à laisser | 10 / 3 / 1 | `home-zooble` | 03 : adversaire ; 04 : jouable ; 10 : jouable ; 12 : présence en scène |
| `kinger` | Kinger | Pomni · ch. 1 | La ronde des petites lumières | 10 / 3 / 1 | `home-kinger` | 07 : jouable ; 12 : présence en scène |
| `caine` | Caine | Jax · ch. 3 | L’imprévu au programme | 10 / 3 / 1 | `home-caine` | 09 : adversaire ; 12 : adversaire |
| `bubble` | Bubble | Zooble · ch. 1 | Service impeccable | 10 / 3 / 1 | `home-bubble` | 02 : adversaire ; 10 : adversaire ; 12 : présence en scène |
| `gummigoo` | Gummigoo | The Fudge · ch. 2 | Une route à partager | 10 / 3 / 1 | `home-gummigoo` | 05 : jouable ; 06 : adversaire |
| `loolilalu` | Loolilalu | Gloink Queen · ch. 3 | La fête des quatre passages | 10 / 3 / 1 | `home-loolilalu` | 06 : jouable |
| `gloinkqueen` | Gloink Queen | Zooble · ch. 3 | Le trésor du nid | 10 / 3 / 1 | `home-gloinkqueen` | 04 : adversaire |
| `fudge` | The Fudge | Loolilalu · ch. 2 | Une place au banquet | 10 / 3 / 1 | `home-fudge` | 05 : adversaire |
| `abstractedkaufmo` | Kaufmo — abstraction | Ragatha · ch. 1 | L’écho sous le rideau | 10 / 3 / 1 | `home-abstractedkaufmo` | 08 : adversaire |
| `baronmildenhall` | Baron Mildenhall | Kinger · ch. 1 | Le dernier invité du manoir | 10 / 3 / 1 | `home-baronmildenhall` | 07 : adversaire |
| `queenie` | Queenie | Kinger · ch. 3 | Le souvenir du chapiteau — Queenie | 10 / 3 / 1 | `home-queenie` | Aucun rôle prévu dans ce premier arc |
| `kaufmo` | Kaufmo | Ragatha · ch. 3 | Le clown d’avant — Kaufmo | 10 / 3 / 1 | `home-kaufmo` | Aucun rôle prévu dans ce premier arc |
| `ribbit` | Ribbit | Pomni · ch. 3 | La grenouille du groupe — Ribbit | 10 / 3 / 1 | `home-ribbit` | Aucun rôle prévu dans ce premier arc |
| `scratch` | Scratch | Jax · ch. 3 | Le chien jaune — Scratch | 10 / 3 / 1 | `home-scratch` | Aucun rôle prévu dans ce premier arc |
| `wormo` | Wormo | Gangle · ch. 3 | Le ver du chapiteau — Wormo | 10 / 3 / 1 | `home-wormo` | Aucun rôle prévu dans ce premier arc |
| `bizco` | Bizco | Zooble · ch. 3 | Le biscuit vivant — Bizco | 10 / 3 / 1 | `home-bizco` | Aucun rôle prévu dans ce premier arc |
| `rattie` | Rattie | Jax · ch. 3 | La rate du cirque — Rattie | 10 / 3 / 1 | `home-rattie` | Aucun rôle prévu dans ce premier arc |
| `spike` | Spike | Gloink Queen · ch. 3 | Le petit piquant — Spike | 10 / 3 / 1 | `home-spike` | Aucun rôle prévu dans ce premier arc |
| `pinkcyclops` | Pink Furry Cyclops | The Fudge · ch. 3 | Le spectateur velu — Pink Furry Cyclops | 10 / 3 / 1 | `home-pinkcyclops` | Aucun rôle prévu dans ce premier arc |
| `yellowclown` | Frowning Yellow Clown | Caine · ch. 3 | Le clown qui boude — Frowning Yellow Clown | 10 / 3 / 1 | `home-yellowclown` | Aucun rôle prévu dans ce premier arc |
| `oyster` | The Oyster | Bubble · ch. 3 | La perle du décor — The Oyster | 10 / 3 / 1 | `home-oyster` | Aucun rôle prévu dans ce premier arc |
| `bulbcreature` | Light Green Bulb Creature | Gangle · ch. 3 | La lanterne du cirque — Light Green Bulb Creature | 10 / 3 / 1 | `home-bulbcreature` | Aucun rôle prévu dans ce premier arc |
| `abel` | Abel | Pomni · ch. 3 | La silhouette du programme — Abel | 10 / 3 / 1 | `home-abel` | Aucun rôle prévu dans ce premier arc |
| `max` | Max | Gummigoo · ch. 3 | Le caïman de tête — Max | 10 / 3 / 1 | `home-max` | Aucun rôle prévu dans ce premier arc |
| `chad` | Chad | The Fudge · ch. 3 | Le caïman costaud — Chad | 10 / 3 / 1 | `home-chad` | Aucun rôle prévu dans ce premier arc |
| `orbsman` | Orbsman | Kinger · ch. 3 | Le guide du manoir — Orbsman | 10 / 3 / 1 | `home-orbsman` | Aucun rôle prévu dans ce premier arc |
| `ming` | Ming | Zooble · ch. 3 | L’invitée du programme — Ming | 10 / 3 / 1 | `home-ming` | Aucun rôle prévu dans ce premier arc |
| `marthamildenhall` | Martha Mildenhall | Baron Mildenhall · ch. 3 | La voix du manoir — Martha Mildenhall | 10 / 3 / 1 | `home-marthamildenhall` | Aucun rôle prévu dans ce premier arc |
| `ghostly` | Ghostly | Ragatha · ch. 3 | Le spectre de passage — Ghostly | 10 / 3 / 1 | `home-ghostly` | Aucun rôle prévu dans ce premier arc |
| `angel` | Angel | Loolilalu · ch. 3 | L’ange du manoir — Angel | 10 / 3 / 1 | `home-angel` | Aucun rôle prévu dans ce premier arc |
| `disappearingguy` | Disappearing Guy | Jax · ch. 3 | Le figurant qui s’efface — Disappearing Guy | 10 / 3 / 1 | `home-disappearingguy` | Aucun rôle prévu dans ce premier arc |
| `committeemember` | Committee Member | Caine · ch. 3 | Le comité du cirque — Committee Member | 10 / 3 / 1 | `home-committeemember` | Aucun rôle prévu dans ce premier arc |
| `shrimpnpc` | Shrimp NPC | Bubble · ch. 3 | La crevette de service — Shrimp NPC | 10 / 3 / 1 | `home-shrimpnpc` | Aucun rôle prévu dans ce premier arc |
| `chineseroomnpc` | Chinese Room NPC | Zooble · ch. 3 | La chambre des règles — Chinese Room NPC | 10 / 3 / 1 | `home-chineseroomnpc` | Aucun rôle prévu dans ce premier arc |
| `blueai` | Blue AI | Caine · ch. 3 | L’assistant bleu — Blue AI | 10 / 3 / 1 | `home-blueai` | Aucun rôle prévu dans ce premier arc |
| `cookiebutterfly` | Cookie Butterfly | Loolilalu · ch. 3 | Le papillon de sucre — Cookie Butterfly | 10 / 3 / 1 | `home-cookiebutterfly` | Aucun rôle prévu dans ce premier arc |
| `gummyelephant` | Gummy Elephant | Gummigoo · ch. 3 | Le pachyderme gommeux — Gummy Elephant | 10 / 3 / 1 | `home-gummyelephant` | Aucun rôle prévu dans ce premier arc |
| `giantcentipede` | Giant Centipede | The Fudge · ch. 3 | Le mille-pattes du canyon — Giant Centipede | 10 / 3 / 1 | `home-giantcentipede` | Aucun rôle prévu dans ce premier arc |
| `spudsycustomer` | Spudsy Customer | The Fudge · ch. 3 | Le client affamé — Spudsy Customer | 10 / 3 / 1 | `home-spudsycustomer` | Aucun rôle prévu dans ce premier arc |
| `candyguardcyan` | Candy Guard Cyan | Loolilalu · ch. 3 | La garde cyan — Candy Guard Cyan | 10 / 3 / 1 | `home-candyguardcyan` | Aucun rôle prévu dans ce premier arc |
| `candyguardblue` | Candy Guard Blue | Gloink Queen · ch. 3 | La garde bleue — Candy Guard Blue | 10 / 3 / 1 | `home-candyguardblue` | Aucun rôle prévu dans ce premier arc |
| `candyguardpurple` | Candy Guard Violet | Loolilalu · ch. 3 | La garde violette — Candy Guard Violet | 10 / 3 / 1 | `home-candyguardpurple` | Aucun rôle prévu dans ce premier arc |
| `gummyworm` | Gummy Worm | Gummigoo · ch. 3 | Le ver gommeux — Gummy Worm | 10 / 3 / 1 | `home-gummyworm` | Aucun rôle prévu dans ce premier arc |
| `barrelmonkey` | Barrel Monkey | Jax · ch. 3 | Le singe du tonneau — Barrel Monkey | 10 / 3 / 1 | `home-barrelmonkey` | Aucun rôle prévu dans ce premier arc |
| `jeffery` | Jeffery | Pomni · ch. 3 | Le résident discret — Jeffery | 10 / 3 / 1 | `home-jeffery` | Aucun rôle prévu dans ce premier arc |
| `mildenhallsouls` | Mildenhall Souls | Baron Mildenhall · ch. 3 | Les âmes du manoir — Mildenhall Souls | 10 / 3 / 1 | `home-mildenhallsouls` | Aucun rôle prévu dans ce premier arc |
| `redmannequin` | Red Mannequin | Ragatha · ch. 3 | Le mannequin rouge — Red Mannequin | 10 / 3 / 1 | `home-redmannequin` | Aucun rôle prévu dans ce premier arc |
| `orangemannequin` | Orange Mannequin | Gangle · ch. 3 | Le mannequin orange — Orange Mannequin | 10 / 3 / 1 | `home-orangemannequin` | Aucun rôle prévu dans ce premier arc |
| `yellowmannequin` | Yellow Mannequin | Zooble · ch. 3 | Le mannequin jaune — Yellow Mannequin | 10 / 3 / 1 | `home-yellowmannequin` | Aucun rôle prévu dans ce premier arc |
| `magentamannequin` | Magenta Mannequin | Pomni · ch. 3 | Le mannequin magenta — Magenta Mannequin | 10 / 3 / 1 | `home-magentamannequin` | Aucun rôle prévu dans ce premier arc |
| `cellarabstraction` | Abstraction du cellier | Kaufmo — abstraction · ch. 3 | Les regards sans nom — Abstraction du cellier | 10 / 3 / 1 | `home-cellarabstraction` | Aucun rôle prévu dans ce premier arc |
| `aquaticabstraction` | Abstraction aquatique | Bubble · ch. 3 | Le ressac du signal — Abstraction aquatique | 10 / 3 / 1 | `home-aquaticabstraction` | Aucun rôle prévu dans ce premier arc |
| `abstractedjax` | Jax — abstraction | Pomni · ch. 3 | Le contour du silence — Jax — abstraction | 10 / 3 / 1 | `home-abstractedjax` | Aucun rôle prévu dans ce premier arc |
| `abstractedqueenie` | Queenie — abstraction | Kinger · ch. 3 | La lumière tenue à distance — Queenie — abstraction | 10 / 3 / 1 | `home-abstractedqueenie` | Aucun rôle prévu dans ce premier arc |
| `abstractedribbit` | Ribbit — abstraction | Jax · ch. 3 | Le bond interrompu — Ribbit — abstraction | 10 / 3 / 1 | `home-abstractedribbit` | Aucun rôle prévu dans ce premier arc |
| `originalabstractedpomni` | Pomni — abstraction originale | Pomni · ch. 3 | Le labyrinthe sans porte — Pomni — abstraction originale | 10 / 3 / 1 | `home-originalabstractedpomni` | Aucun rôle prévu dans ce premier arc |
| `originalabstractedragatha` | Ragatha — abstraction originale | Ragatha · ch. 3 | La couture hors du cadre — Ragatha — abstraction originale | 10 / 3 / 1 | `home-originalabstractedragatha` | Aucun rôle prévu dans ce premier arc |
| `originalabstractedgangle` | Gangle — abstraction originale | Gangle · ch. 3 | Les rubans sans masque — Gangle — abstraction originale | 10 / 3 / 1 | `home-originalabstractedgangle` | Aucun rôle prévu dans ce premier arc |
| `originalabstractedkinger` | Kinger — abstraction originale | Kinger · ch. 3 | Le bastion aux mille regards — Kinger — abstraction originale | 10 / 3 / 1 | `home-originalabstractedkinger` | Aucun rôle prévu dans ce premier arc |
| `originalabstractedzooble` | Zooble — abstraction originale | Zooble · ch. 3 | Les fragments indociles — Zooble — abstraction originale | 10 / 3 / 1 | `home-originalabstractedzooble` | Aucun rôle prévu dans ce premier arc |

## Écarts de cast constatés

**40 tableaux contiennent deux fois le même rival dans le cast.** Les valeurs observées restent inchangées dans le registre. La colonne proposée retire seulement le doublon ; ce correctif de runtime n’est pas livré par l’intégration documentaire.

| Tableau | Cast observé | Cast unique proposé | État |
| --- | --- | --- | --- |
| `queenie-epilogue-3` | Queenie · Kinger · Kinger | Queenie · Kinger | À corriger dans le runtime |
| `kaufmo-epilogue-3` | Kaufmo · Ragatha · Ragatha | Kaufmo · Ragatha | À corriger dans le runtime |
| `ribbit-epilogue-3` | Ribbit · Pomni · Pomni | Ribbit · Pomni | À corriger dans le runtime |
| `scratch-epilogue-3` | Scratch · Jax · Jax | Scratch · Jax | À corriger dans le runtime |
| `wormo-epilogue-3` | Wormo · Gangle · Gangle | Wormo · Gangle | À corriger dans le runtime |
| `bizco-epilogue-3` | Bizco · Zooble · Zooble | Bizco · Zooble | À corriger dans le runtime |
| `rattie-epilogue-3` | Rattie · Jax · Jax | Rattie · Jax | À corriger dans le runtime |
| `spike-epilogue-3` | Spike · Gloink Queen · Gloink Queen | Spike · Gloink Queen | À corriger dans le runtime |
| `pinkcyclops-epilogue-3` | Pink Furry Cyclops · The Fudge · The Fudge | Pink Furry Cyclops · The Fudge | À corriger dans le runtime |
| `yellowclown-epilogue-3` | Frowning Yellow Clown · Caine · Caine | Frowning Yellow Clown · Caine | À corriger dans le runtime |
| `oyster-epilogue-3` | The Oyster · Bubble · Bubble | The Oyster · Bubble | À corriger dans le runtime |
| `bulbcreature-epilogue-3` | Light Green Bulb Creature · Gangle · Gangle | Light Green Bulb Creature · Gangle | À corriger dans le runtime |
| `abel-epilogue-3` | Abel · Pomni · Pomni | Abel · Pomni | À corriger dans le runtime |
| `max-epilogue-3` | Max · Gummigoo · Gummigoo | Max · Gummigoo | À corriger dans le runtime |
| `chad-epilogue-3` | Chad · The Fudge · The Fudge | Chad · The Fudge | À corriger dans le runtime |
| `orbsman-epilogue-3` | Orbsman · Kinger · Kinger | Orbsman · Kinger | À corriger dans le runtime |
| `ming-epilogue-3` | Ming · Zooble · Zooble | Ming · Zooble | À corriger dans le runtime |
| `marthamildenhall-epilogue-3` | Martha Mildenhall · Baron Mildenhall · Baron Mildenhall | Martha Mildenhall · Baron Mildenhall | À corriger dans le runtime |
| `ghostly-epilogue-3` | Ghostly · Ragatha · Ragatha | Ghostly · Ragatha | À corriger dans le runtime |
| `angel-epilogue-3` | Angel · Loolilalu · Loolilalu | Angel · Loolilalu | À corriger dans le runtime |
| `disappearingguy-epilogue-3` | Disappearing Guy · Jax · Jax | Disappearing Guy · Jax | À corriger dans le runtime |
| `committeemember-epilogue-3` | Committee Member · Caine · Caine | Committee Member · Caine | À corriger dans le runtime |
| `shrimpnpc-epilogue-3` | Shrimp NPC · Bubble · Bubble | Shrimp NPC · Bubble | À corriger dans le runtime |
| `chineseroomnpc-epilogue-3` | Chinese Room NPC · Zooble · Zooble | Chinese Room NPC · Zooble | À corriger dans le runtime |
| `blueai-epilogue-3` | Blue AI · Caine · Caine | Blue AI · Caine | À corriger dans le runtime |
| `cookiebutterfly-epilogue-3` | Cookie Butterfly · Loolilalu · Loolilalu | Cookie Butterfly · Loolilalu | À corriger dans le runtime |
| `gummyelephant-epilogue-3` | Gummy Elephant · Gummigoo · Gummigoo | Gummy Elephant · Gummigoo | À corriger dans le runtime |
| `giantcentipede-epilogue-3` | Giant Centipede · The Fudge · The Fudge | Giant Centipede · The Fudge | À corriger dans le runtime |
| `spudsycustomer-epilogue-3` | Spudsy Customer · The Fudge · The Fudge | Spudsy Customer · The Fudge | À corriger dans le runtime |
| `candyguardcyan-epilogue-3` | Candy Guard Cyan · Loolilalu · Loolilalu | Candy Guard Cyan · Loolilalu | À corriger dans le runtime |
| `candyguardblue-epilogue-3` | Candy Guard Blue · Gloink Queen · Gloink Queen | Candy Guard Blue · Gloink Queen | À corriger dans le runtime |
| `candyguardpurple-epilogue-3` | Candy Guard Violet · Loolilalu · Loolilalu | Candy Guard Violet · Loolilalu | À corriger dans le runtime |
| `gummyworm-epilogue-3` | Gummy Worm · Gummigoo · Gummigoo | Gummy Worm · Gummigoo | À corriger dans le runtime |
| `barrelmonkey-epilogue-3` | Barrel Monkey · Jax · Jax | Barrel Monkey · Jax | À corriger dans le runtime |
| `jeffery-epilogue-3` | Jeffery · Pomni · Pomni | Jeffery · Pomni | À corriger dans le runtime |
| `mildenhallsouls-epilogue-3` | Mildenhall Souls · Baron Mildenhall · Baron Mildenhall | Mildenhall Souls · Baron Mildenhall | À corriger dans le runtime |
| `redmannequin-epilogue-3` | Red Mannequin · Ragatha · Ragatha | Red Mannequin · Ragatha | À corriger dans le runtime |
| `orangemannequin-epilogue-3` | Orange Mannequin · Gangle · Gangle | Orange Mannequin · Gangle | À corriger dans le runtime |
| `yellowmannequin-epilogue-3` | Yellow Mannequin · Zooble · Zooble | Yellow Mannequin · Zooble | À corriger dans le runtime |
| `magentamannequin-epilogue-3` | Magenta Mannequin · Pomni · Pomni | Magenta Mannequin · Pomni | À corriger dans le runtime |

## Contrat de régénération

Depuis la racine du dépôt :

```sh
node scripts/build-combat-guide-associations.mjs
node scripts/build-combat-guide-associations.mjs --check
```

Le contrôle exige un roster unique, dix slots par combattant, quatre affrontements et six tableaux par route, des adversaires et décors résolus, trois finales et une amitié par combattant, un arrangement dédié, des portraits/gardes et des motifs de projectile inscrits au manifeste. Il vérifie aussi que les fichiers générés correspondent exactement aux sources courantes. Il ne charge pas les images, ne lance pas de partie et ne remplace pas les tests de jeu, les revues artistiques ou les parcours navigateur.

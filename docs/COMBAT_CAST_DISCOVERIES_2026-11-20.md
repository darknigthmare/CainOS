# Encore — dix apparences complétées et intégrées, 20 novembre 2026

**Les dix familles de cette passe disposent de leurs onze dessins individuels et sont intégrées au catalogue partagé par CainOS et le jeu autonome.** Le lot représente **110 PNG natifs distincts, soit 130 610 966 octets** : dix portraits de sélection, dix gardes et quatre-vingt-dix actions. Le [manifeste de complétion](art-generation/cast-next-20261120/generation-completion.json) relie chaque fichier actif à son original, à son reçu et à son empreinte.

La reprise part du commit `6ea3e8041f71789f858ed724ceeb49a3e5efacff`, qui contenait déjà les 63 poses terminées de la passe précédente. Les chiffres ci-dessous décrivent les vérifications locales de ce nouveau lot destiné à la [PR #7](https://github.com/darknigthmare/CainOS/pull/7). La publication et les résultats de CI de la nouvelle révision doivent être attestés séparément.

[Vue d’ensemble](art-generation/cast-next-20261120/review/overview.jpg) · [Galerie et dossier de production](art-generation/cast-next-20261120/README.md) · [Inventaire des fichiers](art-generation/cast-next-20261120/asset-inventory.json) · [Vérification consolidée](art-generation/cast-next-20261120/verification.json)

## Dix apparences, onze fichiers chacune

Ces ajouts sont des apparences de personnages existants. Leur propriétaire, leur kit de combat et leur identité de sauvegarde sont conservés. Les accessoires représentés dans le dessin n’ajoutent pas de technique ou de pouvoir.

| Apparence | Identifiant | PNG distincts | Galerie du rendu de production | Source officielle |
| --- | --- | ---: | --- | --- |
| Pomni — combinaison Jax | `jaxsuitpomni` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/jaxsuitpomni/README.md) | [Jax-Suit Pomni Plush][jax-plush] |
| Ribbit — film noir | `noirribbit` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/noirribbit/README.md) | [Ribbit Pendantz][ribbit] |
| Ribbit — costume Kaufmo | `kaufmosuitribbit` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/kaufmosuitribbit/README.md) | [Ribbit Pendantz][ribbit] |
| Caine — Intermission | `intermissioncaine` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/intermissioncaine/README.md) | [Costume Adventure][adventure] |
| Pomni — Showtime | `showtimepomni` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/showtimepomni/README.md) | [Side Show][sideshow] |
| Ragatha — Quille de bowling | `bowlingpinragatha` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/bowlingpinragatha/README.md) | [Side Show][sideshow] |
| Caine — Maître de piste noir | `ringmastercaine` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/ringmastercaine/README.md) | [Side Show][sideshow] |
| Orbsman — homme fort | `strongmanorbsman` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/strongmanorbsman/README.md) | [Side Show][sideshow] |
| Bubble — régisseur | `stagehandbubble` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/stagehandbubble/README.md) | [Side Show][sideshow] |
| Kinger — dompteur d’insectes | `bugtamerkinger` | 11/11 | [Actions et portrait](art-generation/cast-next-20261120/review/bugtamerkinger/README.md) | [Side Show][sideshow] |
| **Total** | **10 apparences** | **110/110** | **10 revues individuelles** | **Produits officiels GLITCH** |

Les onze emplacements sont `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory` et `defeat`. Chaque PNG contient un seul personnage entier et ses accessoires éventuels. Les planches de revue réunissent ces fichiers uniquement pour faciliter l’inspection ; les fichiers utilisés par le jeu restent séparés.

Les silhouettes particulières sont décrites dans les [définitions de production](art-generation/cast-next-20261120/definitions). Intermission Caine conserve son corps de dentier et quatre gants flottants ; Ragatha conserve son corps de quille ; Bubble conserve l’ensemble sphère, caméra et chapeau ; Kinger conserve deux mains flottantes, le seau et le cerceau, sans jambes ajoutées. Les orientations observées sont enregistrées par emplacement : la sélection de Ragatha quille est orientée à gauche, et les 109 autres fichiers à droite. Le [relevé des orientations](art-generation/cast-next-20261120/native-facing.json) alimente le rendu sans retourner les fichiers sources.

## Ce qui a été récupéré et ce qui a été généré

Le lot a traversé une perte d’environnement. Le [manifeste final](art-generation/cast-next-20261120/generation-completion.json) distingue **90 originaux récupérés à l’octet près** et **20 dessins régénérés après cette perte**. Ces vingt remplacements ont été réalisés sur plusieurs reprises ; ils ne sont pas présentés comme les anciens fichiers retrouvés.

| Groupe | Originaux récupérés | Dessins régénérés | Total |
| --- | ---: | ---: | ---: |
| Huit familles autres que Showtime Pomni et Bug Tamer Kinger | 88 | 0 | 88 |
| Pomni — Showtime | 1, la défaite | 10 | 11 |
| Kinger — dompteur d’insectes | 1, la défaite | 10 | 11 |
| **Total du lot** | **90** | **20** | **110** |

**Neuf nouvelles poses ont effectivement été créées pendant cette reprise finale** avec l’outil de génération d’images intégré : saut, accroupissement et victoire de Showtime Pomni ; entrée, attaque, coup lourd, impact reçu, marche et victoire de Bug Tamer Kinger. Les autres dessins nécessaires étaient déjà récupérables ou avaient été régénérés lors des reprises précédentes. Les prompts, références, identifiants de génération et observations sont conservés dans les reçus de [Showtime Pomni](art-generation/cast-next-20261120/generated/showtimepomni) et de [Bug Tamer Kinger](art-generation/cast-next-20261120/generated/bugtamerkinger).

Une référence historique reste indisponible : **l’ancienne sélection employée pour générer la défaite de Bug Tamer Kinger**. La défaite elle-même est récupérée à l’identique ; son reçu conserve l’empreinte de l’ancienne sélection et signale explicitement la perte. La sélection régénérée au même chemin logique ne remplace pas cette preuve historique. Le [reçu de la défaite](art-generation/cast-next-20261120/generated/bugtamerkinger/defeat.json) et le manifeste final décrivent cette distinction.

Tous les PNG actifs sont copiés à l’identique depuis leurs sources acceptées : aucun recadrage, redimensionnement, changement d’alpha ou remplacement par une autre pose n’est appliqué au fichier. Leur transparence native et leurs empreintes restent conservées.

## Vérifications exécutées

| Vérification | Résultat attesté | Preuve |
| --- | --- | --- |
| `npm run qa` | **405 tests Node réussis**, zéro échec et zéro test ignoré ; audits et deux builds réussis | [Résultat horodaté](art-generation/cast-next-20261120/qa-result.json), [journal](art-generation/cast-next-20261120/qa.log) |
| Copies dans CainOS et le standalone | **220 comparaisons d’assets natifs** et **18 comparaisons de modules** conformes | [Intégrité des distributions](art-generation/cast-next-20261120/build-integrity.json) |
| Modules Canvas de production sous Node/Skia | **90 actions, 10 gardes, 10 portraits et 200 vérifications de dessin**, aucun emplacement manquant | [Synthèse Canvas](art-generation/cast-next-20261120/canvas-summary.json), [galeries](art-generation/cast-next-20261120/README.md) |
| Revue visuelle des exports Canvas | Dix planches d’actions et une vue d’ensemble de dix portraits examinées ; aucun défaut bloquant observé à l’échelle de ces exports | [Revue visuelle](art-generation/cast-next-20261120/visual-review.json) |
| Audit indépendant final de l’intégration | 110 PNG et 110 orientations conformes ; 23 anciennes définitions d’apparences et les 452 costumes antérieurs conservés ; 215 références exactes sur 216, avec une perte historique explicitement documentée | [Audit final](art-generation/cast-next-20261120/final-runtime-audit.json) |
| Conservation des données antérieures | **5 546 fichiers Encore** du relevé initial et **six fichiers de suivi ou checkpoints** vérifiés inchangés | [Intégrité](art-generation/cast-next-20261120/build-integrity.json), [relevé de conservation](art-generation/cast-next-20261120/preserved-tracker-and-checkpoints.json) |
| Navigateur, suite des dessins d’action | Blocage avant navigation, **zéro contrôle réussi** | [Résultat](art-generation/cast-next-20261120/browser-result.json), [journal](art-generation/cast-next-20261120/browser-action-art.log) |
| Navigateur, suite de réunion du casting | Blocage avant navigation, **zéro contrôle exécuté** | [Résultat](art-generation/cast-next-20261120/merge-browser-result.json), [journal](art-generation/cast-next-20261120/merge-browser.log) |

Les deux essais Chromium locaux échouent lors de la création d’un socket, avant que le parcours puisse commencer. Les rendus Canvas réussis attestent le chargement et le dessin avec les modules de production ; ils ne constituent pas une validation du DOM, des commandes ou du service worker dans un navigateur. La revue visuelle porte sur les planches exportées : elle ne remplace pas l’inspection de chaque PNG à sa résolution native et ne certifie pas l’animation image par image.

L’[audit indépendant préalable](art-generation/cast-next-20261120/independent-audit.json) porte sur **huit familles alors complètes et 88 PNG**, avec 165 contrôles de références portables sans échec. Il examine les dix références de produits et les dix sélections, mais ne revendique pas une revue de toutes les actions ou un rendu en jeu. Les contrôles finaux des 110 fichiers et les rendus des dix familles sont documentés séparément ci-dessus.

La [CI du commit précédent `6ea3e804`](https://github.com/darknigthmare/CainOS/actions/runs/44708369491) a échoué sur une attente devenue obsolète dans la suite navigateur de réunion du casting : Queenie possède désormais son apparence illustrée `abstractingqueenie`. Le test a été corrigé pour attendre cette option avec l’apparence de base. **Cette correction n’est pas annoncée comme validée par le navigateur local**, dont le lancement reste bloqué. La CI de la nouvelle révision doit confirmer ce parcours après publication ; aucune réussite distante de cette révision n’est revendiquée dans ce point de contrôle local. La [vérification consolidée](art-generation/cast-next-20261120/verification.json) sépare ces états historiques et courants.

## Catalogue obtenu

Le [relevé du runtime](art-generation/cast-next-20261120/runtime-counts.json) donne les compteurs suivants après intégration :

| Élément | Total |
| --- | ---: |
| Combattants | 54 |
| Techniques | 540 |
| Arènes partagées | 22 |
| Costumes sélectionnables | 462 |
| Apparences Circus supplémentaires, toutes passes cumulées | 33, soit 363 PNG |
| Entrées d’archive | 179 |
| Images de personnages hors collection crossover | 1 597 : 217 sélections, 138 gardes, 1 242 actions |
| Fiches de suivi de fidélité | 700 |
| Images du paquet hors ligne | 5 700 |
| Taille native du paquet hors ligne | 2 990 717 576 octets |

Le paquet hors ligne porte la version `0.7.0-5b0cc82556ac`, avec la révision artistique `5f2b4ac158cbd2f5`. Les 700 fiches de fidélité sont des enregistrements de suivi ; leur nombre ne représente pas 700 certifications canoniques.

Cette passe complète les apparences. L’audit retrouve les **66 plans des 22 arènes existantes** et les **12 accessoires** déjà présents et publiés au point de départ. Les treize lignes encore partielles sur l’alignement du sol, des pieds et des ombres sont des travaux de revue. Elles ne désignent pas treize fichiers de décor absents. Les 54 arrangements dédiés réemploient les scènes partagées. L’[audit des arènes](art-generation/cast-next-20261120/independent-audit.json) n’établit pas que tous les lieux de la série possèdent déjà un niveau.

## Fidélité, classeur et suite de la production

Les sources de cette passe sont des produits officiels GLITCH. Elles permettent de comparer les vêtements, accessoires, couleurs et silhouettes, mais ne prouvent pas une apparition dans un épisode. Les poses et proportions de combat restent des adaptations originales du fan-game. Pour Showtime Pomni, le dessin de jeu utilise notamment les iris habituels et une expression adaptée à l’action, tandis que la figurine photographiée présente des yeux griffonnés et une pose ramassée ; les parties du costume masquées par cette pose sont interprétées dans la définition. Les observations de comparaison restent accessibles dans l’[audit indépendant](art-generation/cast-next-20261120/independent-audit.json).

Le **classeur Excel installé et ses fichiers compagnons sont inchangés**. Aucun nouvel export XLSX n’a été tenté dans cette passe ; le blocage mémoire documenté précédemment reste ouvert. Les manifestes de cette livraison fournissent les éléments pour une future mise à jour atomique du suivi, avec conservation des identifiants, de l’ordre, des notes et des formules. Les checkpoints historiques des 63 poses restent également inchangés : leur travail déjà terminé n’est pas remis en attente.

Le [registre des candidats restants](art-generation/cast-next-20261120/remaining-candidates.md) conserve les apparences encore à qualifier : Anime, Maid et Jax-Suit Ribbit ; tenues australienne de Jax et néo-zélandaise ou noire de Gangle ; assemblages et raccords cachés de Zooble ; comparaisons Freak Jax, Watermelon Gangle, PTO Caine, Hotdog Abel et Aqua Blaster Pomni. Les images incomplètes ou les simples noms de produits ne sont pas comptés comme des familles terminées.

Les cycles d’animation image par image, les costumes crossover des quarante PNJ promus, la comparaison exacte scène par scène et les essais matériels restent ouverts. Les onze dessins statiques de chaque apparence ferment les emplacements de ce lot, sans certifier l’animation complète ni la fidélité canonique 1:1.

[jax-plush]: https://glitchproductions.store/products/jax-suit-pomni-plush
[ribbit]: https://glitchproductions.store/products/ribbit-pendantz-blindbox
[adventure]: https://glitchproductions.store/products/digital-circus-animiniz-costume-adventure-series
[sideshow]: https://glitchproductions.store/products/digital-circus-animiniz-side-show-series

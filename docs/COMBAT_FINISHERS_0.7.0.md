# Encore 0.7.0 — 42 finales de scène

## Portée du lot

Le catalogue couvre les quatorze combattants jouables avec trois finales chacun : `impact`, `special` et `super`. Ces quarante-deux scènes sont des adaptations pour Encore. Elles ne constituent pas des scènes officielles de The Amazing Digital Circus et ne valident pas une fidélité canonique 1:1.

Le rendu utilise les illustrations et les poses de victoire déjà disponibles. Chaque combattant possède un motif graphique, décliné en trois compositions. Le déroulé révèle les éléments de décor, les met en lumière puis ajoute un éclairage final au sol. Il ne comprend pas de nouveaux dessins de mouvements corporels, de nouvelles poses d’attaque ni une séquence d’animation originale reproduite image par image.

Les textes des trois tableaux décrivent cette mise en scène effectivement dessinée. Les réserves `adaptation` et `remainingArtWork` restent attachées à chaque définition.

## Catalogue

| Combattant | Impact | Spécial | Super |
| --- | --- | --- | --- |
| Pomni | Encore debout | La porte en carton | Le rideau se referme |
| Jax | La révérence de trop | La clef du numéro | C’était la blague |
| Ragatha | On se relève | Un point après l’autre | Le dernier raccord |
| Gangle | Une place sous la lumière | Le nœud du rappel | Toute la largeur du rideau |
| Zooble | Ça suffit | Les pièces à leur place | Composition libre |
| Kinger | Le roi tient encore | Les cases du roi | La dernière case |
| Caine | Mesdames et messieurs ! | Changement de numéro | Le grand rappel |
| Bubble | Bulle au centre | À fleur de piste | Un rond dans le spectacle |
| Gummigoo | Le salut du convoyeur | Fin de trajet | Une place dans le cadre |
| Loolilalu | La cour prend acte | Les marches du palais | Le salut de la couronne |
| Gloink Queen | La reine conserve sa place | Tout autour du nid | Le cercle des Gloinks |
| The Fudge | La masse retombe | Une trace sur la piste | Le cadre déborde |
| Kaufmo — abstraction | Signal interrompu | Contour hors registre | Le noir sous les couleurs |
| Baron Mildenhall | Le silence après l’écho | Le cadre du manoir | Dernier portrait |

Le fichier `combat/finisher-catalog.mjs` exporte `FINISHER_CATALOG`, `FINISHER_VARIANTS`, `FINISHER_NOTICE` et `FINISHER_CATALOG_VERSION`. Les objets et leurs tableaux sont figés. Un identifiant associe le combattant et la famille, par exemple `pomni.impact`.

Chaque entrée contient `id`, `fighterId`, `variant`, `title`, `durationFrames`, `beats`, `motif`, `sourceIds`, `adaptation` et `remainingArtWork`. Chaque tableau de `beats` contient `frame`, `title` et `description`.

Les durées sont de 180, 210 et 240 images pour les familles impact, spécial et super : respectivement trois, trois secondes et demie, et quatre secondes à soixante images de présentation par seconde. Les trois tableaux commencent au début, au premier tiers et au deuxième tiers. Ces durées sont des choix d’interface pour Encore ; elles ne reproduisent pas la cadence de production de la série.

| Identifiant du combattant | Motif du renderer | Lecture de la mise en scène |
| --- | --- | --- |
| `pomni` | `exit` | Encadrements et signalétique de sortie de théâtre |
| `jax` | `trick` | Clefs, cartes, rideaux et damier |
| `ragatha` | `stitch` | Lignes de couture et raccords textiles |
| `gangle` | `ribbon` | Rubans et courbes autour de la silhouette |
| `zooble` | `geometry` | Formes géométriques assemblées dans le cadre |
| `kinger` | `chess` | Coussins, cases et références graphiques aux échecs |
| `caine` | `curtain` | Encadrement de spectacle et rideaux |
| `bubble` | `bubble` | Cercles transparents et reflets |
| `gummigoo` | `convoy` | Repères graphiques de route et de convoi |
| `loolilalu` | `crown` | Couronne et cadre de palais |
| `gloinkqueen` | `gloink` | Formes de Gloinks autour de la reine |
| `fudge` | `fudge` | Masses et bordures chocolatées |
| `abstractedkaufmo` | `glitch` | Bandes et panneaux décalés, sans stroboscope |
| `baronmildenhall` | `portrait` | Cadres de portrait et bougies |

Ces motifs sont des éléments de présentation. Leur présence ne crée ni une attaque supplémentaire, ni un pouvoir canonique, ni une modification de la scène de combat.

## Déclenchement et accessibilité

Une finale se place après la résolution d’une victoire admissible. Son choix utilise le combattant gagnant et la famille du coup final. La présentation ne recalcule ni les dégâts, ni les points de vie, ni le gagnant, ni les récompenses. Le sélecteur refuse les événements périmés ainsi que les cas exclus : égalité, fin au chronomètre, manche intermédiaire, replay, entraînement et défi.

L’option **Finales après un KO** conserve son état dans le profil. Le mouvement réduit affiche la composition finale sans imposer le déroulement animé. Le bouton **Voir le résultat** permet de passer immédiatement à la suite. Le résultat et le replay sont enregistrés avant la présentation.

La galerie s’ouvre depuis le codex d’un combattant. Elle propose ses trois finales, un choix de costume, une pause, une reprise, une relance et une fermeture par le bouton ou par Échap. Le Canvas est un aperçu sans combat ni récompense. La galerie n’écrit pas dans le moteur d’un duel actif.

Le point d’observation `window.Encore.finales` expose seulement l’état de présentation utile au contrôle : identifiant, combattant, image courante, durée, disponibilité des images, lecture et fin. La suite navigateur utilise ce point d’observation en lecture ; elle ne force pas les images du moteur pour fabriquer une preuve.

## Références primaires et limites de lecture

Les liens ci-dessous identifient les sources à utiliser pour les personnages et leur univers. Une page officielle, un résumé ou un titre d’épisode ne suffit pas à certifier un geste, une pose ou une durée précise. La documentation du catalogue conserve donc la distinction entre référence et adaptation.

| Source | Lien | Utilité et limite |
| --- | --- | --- |
| GLITCH — page officielle de la série | [Présentation officielle](https://www.glitchprod.com/digital-circus) | Point d’entrée officiel pour l’univers et les visuels ; ne valide pas les quarante-deux scènes créées pour Encore. |
| GLITCH — pilote | [Vidéo officielle](https://www.youtube.com/watch?v=HwAPLk_sQ3w) | Référence à consulter pour le cirque, les personnages centraux, les Gloinks et l’abstraction ; la validation des mouvements demande l’inspection de plans précis. |
| GLITCH — Candy Carrier Chaos! | [Vidéo officielle](https://www.youtube.com/watch?v=4ofJpOEXrZs) | Corpus de référence pour Gummigoo, Loolilalu et The Fudge ; ne transforme pas les motifs graphiques du jeu en pouvoirs officiels. |
| GLITCH — The Mystery Of Mildenhall Manor | [Vidéo officielle](https://www.youtube.com/watch?v=bKjfw77cxeQ) | Corpus de référence pour le manoir, le Baron et le comportement des personnages dans cet épisode. |
| GLITCH — Fast Food Masquerade | [Vidéo officielle](https://www.youtube.com/watch?v=Q9KWcWKo2T8) | Corpus complémentaire pour Gangle et les costumes liés à l’épisode ; aucune nouvelle gestuelle n’est déduite du seul titre. |
| Netflix — fiche française de la série | [Fiche officielle](https://www.netflix.com/fr/title/81936142) | Référence officielle pour la présentation et les épisodes ; les résumés ne servent pas de preuve visuelle des finales. |
| Entretien avec Kevin Temmer, animateur principal | [Entretien de production](https://www.comicsbeat.com/interview-with-kevin-temmer-of-the-amazing-digital-circus/) | Témoignage direct sur les choix d’animation, notamment la nervosité de Pomni, la souplesse de poupée de Ragatha et le travail image par image nécessaire aux rubans de Gangle. |

Le témoignage de production aide à établir des critères pour de futures animations dédiées. Le présent rendu n’a pas acquis ces animations simplement parce que le catalogue cite l’entretien. Les liens des épisodes permettent de retrouver le corpus ; ce lot ne prétend pas avoir comparé chacune des quarante-deux compositions à un plan officiel correspondant.

## Précautions par personnage

| Personnage | Limite conservée |
| --- | --- |
| Pomni | La sortie représentée est un décor ; aucune fuite réelle ou téléportation n’est ajoutée. |
| Jax | Les signes de farce restent graphiques ; les clefs et les cartes ne confèrent aucun pouvoir supplémentaire. |
| Ragatha | Les coutures n’impliquent pas de soin, de réparation du rival ni de régénération. |
| Gangle | Le masque reste cohérent avec l’illustration choisie ; aucune cassure automatique ne remplace le costume. |
| Zooble | Les formes du décor ne remplacent pas les pièces corporelles du personnage. |
| Kinger | Les cases du décor ne transforment pas le rival en pièce d’échecs et ne créent pas d’armée. |
| Caine | Le cadre de spectacle n’efface pas le rival et ne change pas réellement l’arène. |
| Bubble | Les cercles transparents n’ajoutent ni forme humaine ni éclatement définitif. |
| Gummigoo | Le rappel du convoi n’ajoute pas une résurrection ou un événement narratif officiel. |
| Loolilalu | La couronne et le palais n’ajoutent pas une arme ou une magie du sucre. |
| Gloink Queen | Les Gloinks du décor ne transforment pas le rival ; l’échelle reste une adaptation à l’écran de combat. |
| The Fudge | Les bordures chocolatées n’inondent pas réellement l’arène et n’engloutissent pas le rival. |
| Kaufmo — abstraction | La scène conserve l’abstraction ; elle ne raconte pas une guérison et n’ajoute pas de voix officielle. |
| Baron Mildenhall | Le portrait ne justifie ni une nouvelle arme, ni une réplique, ni un pouvoir attribué au canon. |

## Contrôle navigateur et preuves produites

`tests/combat-finishers-browser.mjs` constitue la suite dédiée à la galerie. Sa réussite doit être établie par l’exécution et son rapport, pas par la seule présence du script.

La suite parcourt les quarante-deux finales animées. Pour chacune, elle contrôle les trois tableaux, la pause exacte, l’arrêt à la durée prévue et les textes issus du catalogue. Elle capture le Canvas au début, au milieu et à la fin : cent vingt-six PNG lorsque le parcours complet réussit. Une empreinte de la zone centrale, hors bandeaux de titre, sert à vérifier que les trois compositions finales d’un combattant diffèrent graphiquement.

Elle parcourt aussi les cinquante et un costumes, chacun sur la finale impact en mouvement réduit. Ce parcours produit cinquante et un aperçus ; il ne couvre pas toutes les combinaisons costume × famille de finale. Il vérifie les options proposées, le costume sélectionné, le chargement de la scène et l’état final stable.

Les contrôles supplémentaires portent sur pause, reprise, relance, fermeture par Échap, conservation exacte du profil et de sa sauvegarde brute, conservation d’un replay non vide, persistance du réglage de finales après rechargement et affichage à 390 pixels. Le contrôle mobile utilise un second processus Chromium et la préférence système de mouvement réduit, avec l’option du profil laissée désactivée. Il s’agit d’une émulation de navigateur, pas d’un essai sur téléphone physique.

Le replay utilisé par cette suite est une fixture explicite de cent vingt images sans action. Il est validé puis installé avant le démarrage, car l’interface d’import lit un fichier sans remplacer le dernier replay gagné. Le fichier est ensuite réellement importé par cette interface. Le rapport indique `earnedMatch: false`, `importedThroughUI: true` et `storageSeededBeforeBoot: true`. Son empreinte compacte et celle du fichier indenté sont distinguées. Ce parcours ne constitue pas la preuve d’un duel gagné.

Le réglage activé puis désactivé est vérifié après rechargement. Ce seul contrôle ne démontre pas le comportement d’un KO avec finales désactivées. Les parcours de vrais duels et leurs replays gagnés relèvent de la suite du roster, séparée de cette galerie.

Les sorties attendues sont :

- `audit-combat/finishers-0.7.0/browser-report.json` : contrôles, captures, empreintes, erreurs éventuelles et limites de couverture ;
- `audit-combat/finishers-0.7.0/gallery-replay-fixture.json` : fixture explicitement identifiée ;
- `audit-combat/finishers-0.7.0/contact-sheet-1.jpg` et `contact-sheet-2.jpg` : deux planches de sept combattants sur trois colonnes, fabriquées à partir des captures du Canvas réel ;
- `audit-combat/finishers-0.7.0/mobile-reduced-390.png` : aperçu du parcours mobile émulé ;
- les PNG individuels des trois tableaux et des costumes.

Les planches retenues pour la documentation sont copiées vers `docs/images/finishers-0.7.0-a.jpg` et `docs/images/finishers-0.7.0-b.jpg` après la réussite du parcours. Une empreinte différente prouve une différence de pixels ; la vérification de fidélité visuelle demande encore une lecture des images et une comparaison aux références.

## Travail restant pour une fidélité 1:1

La couverture de quarante-deux définitions ne ferme pas les écarts artistiques. Il reste à sélectionner des plans officiels identifiables, documenter les poses et les expressions, produire les images de transition dédiées et comparer leur silhouette, leur rythme et leurs accessoires aux sources. Les comportements propres à Pomni, Ragatha et Gangle décrits par l’animateur principal demandent un travail d’animation corporel qui dépasse le dévoilement des motifs de cette version.

Les particularités encore non vérifiées de Bubble, du Baron, de The Fudge, de la Gloink Queen et des décors restent ouvertes dans l’audit de fidélité. La validation fonctionnelle, la couverture du catalogue et la fidélité canonique sont trois critères distincts.

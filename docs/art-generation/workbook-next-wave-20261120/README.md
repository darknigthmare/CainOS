# Mise à jour du suivi — nouvelle vague, 20 novembre 2026

Le classeur installé reprend la version du lot « prochains manquants » et ajoute **Ribbit Café**, les **trois crossovers originaux Ribbit × Murder Drones** et l’arène **Le bar des néons**. Le XLSX, son compagnon JSON et le rapport de vérification ont été installés ensemble, puis relus par empreinte. Les valeurs exactes figurent dans [publication.json](publication.json).

## Contenu ajouté

| Ordre | ID | Famille | PNG individuels |
|---|---|---|---:|
| 1 | `caferibbit` | Ribbit — Café | 11 |
| 2 | `glitch-murderdrones-ribbit-hommage` | Murder Drones — Hommage à Uzi | 11 |
| 3 | `glitch-murderdrones-ribbit-resident` | Murder Drones — Résident original | 11 |
| 4 | `glitch-murderdrones-ribbit-fusion` | Murder Drones — Fusion originale | 11 |

Les quatre familles sont comptées dans une ligne **Tenue Circus** et trois lignes **Costume crossover**. Chacun des **44 PNG** dispose également d’une ligne **Dessin de tenue** dans Production et d’une ligne de QA individuelle : chemin actif, dimensions natives, taille en octets, SHA-256 et reçu de génération. Ces lignes individuelles ne multiplient pas le nombre de costumes. Les 44 couples sont vérifiés dans [asset-slot-verification.json](asset-slot-verification.json).

L’arène `barnoir` est ajoutée après les 23 scènes partagées existantes. Trois PNG natifs de **1672 × 941 pixels** représentent ses plans ; six lignes de Production documentent les images, le thème musical, l’ambiance sonore et l’ambiance visuelle. Le plan lointain est RGB opaque ; les deux autres plans conservent leur alpha natif. Aucun fichier n’a été réencodé pour le suivi. Les 54 arrangements par combattant restent des réemplois des scènes partagées.

| Mesure | Avant | Après |
|---|---:|---:|
| Combattants | 54 | 54 |
| Techniques | 540 | 540 |
| Costumes équipables | 468 | 472 |
| Apparences supplémentaires Circus | 39 | 40 |
| PNG de ces apparences Circus | 429 | 440 |
| Costumes crossover | 378 | 381 |
| Dessins crossover | 3 781 | 3 814 |
| Arènes partagées | 23 | 24 |
| Plans partagés | 69 | 72 |
| Archives | 179 | 179 |
| Images du manifeste hors ligne | 5 769 | 5 816 |
| Lignes Production | 3 188 | 3 242 |
| Lignes QA | 2 335 | 2 389 |
| Références | 153 | 157 |

Les costumes se répartissent en **51 variantes d’archives + 40 apparences Circus + 381 crossovers = 472**. Le manifeste final contient **3 118 619 440 octets**, version `0.7.0-087fd3609c69`, art `0c178f8964773da7`. Les 44 nouveaux PNG de personnages représentent **56 983 581 octets**, et les trois plans Barnoir **2 555 199 octets**.

## Couverture et limites conservées

Les **14 propriétaires historiques** gardent chacun leurs **27 crossovers**, soit neuf séries et trois styles. Leur préfixe de costumes reste inchangé, ainsi que leurs fichiers historiques, dont le PNG de coup lourd de Jax. Ribbit possède désormais les trois styles Murder Drones seulement : ses huit autres séries restent ouvertes. Les **39 autres PNJ promus** restent sans crossover ; le registre conserve donc **1 077 familles potentielles restantes**.

La tenue Café est qualifiée par son illustration officielle distincte. Elle ne ferme pas la référence Maid Ribbit dont les pieds restent masqués. Les lacunes de Jax australien, Noir Gangle et Contortionist Zooble ne sont pas déclarées résolues. La correction antérieure « short kaki confirmé ; pieds encore masqués » de Jax reste conservée avec son statut **À vérifier**.

Les mains à trois doigts ou lobes des nouveaux crossovers sont une **direction artistique originale de ce lot**. La peluche officielle Iconic ne détaille pas de doigts ; la garde historique du jeu montre quatre extrémités. Cette harmonisation ne constitue donc pas une nouvelle affirmation canonique et ne modifie pas la garde historique. Le registre et la nouvelle référence renvoient à l’[addendum de portée](../npc-crossovers-next-wave-20261120/hommage/hand-count-scope-addendum.md). Les reçus finaux des poses Hommage corrigées sont utilisés ; les générations initiales restent archivées.

## Continuité du classeur

La base est le XLSX installé de SHA-256 `048d758f614daf1ad388a12fed5955b853734c2c1c47d92fb7a6e493512eea12`, accompagné du JSON de SHA-256 `868975a52cb6e4f28adbf4bb98e957f142deef7a240472c4879c7c2c148feb56`. [baseline-freeze.json](baseline-freeze.json) identifie ces fichiers et leurs compagnons historiques. Le générateur général de crossovers n’a pas été rejoué sur cette base.

Les **11 feuilles**, **10 tables**, **42 formules**, IDs, ordre, notes utilisateur, largeurs, volets figés et règles historiques sont conservés. Les **80 346 cellules historiques** sont contraintes par comparaison avec cette base. Les 3 188 lignes Production et les 2 335 lignes QA antérieures gardent leurs valeurs et leur ordre ; 54 lignes sont ajoutées à chacune. Quatre sources et une arène sont ajoutées.

[update-plan.json](update-plan.json) énumère les **61 cellules historiques autorisées à évoluer**, dont les 42 emplacements de formules, ainsi que les cinq augmentations de hauteur nécessaires aux textes actualisés de Fonctionnalités. Cette liste d’autorisation ne signifie pas que les 61 valeurs ont toutes changé. Le pied de Références est déplacé de quatre lignes sans perte de contenu. Les notes jaunes restent conservées.

Le snapshot d’illustrations daté du 18 novembre reste intact ; les nouveaux comptes de crossovers sont portés dans les champs de couverture actuels et leur historique. Les campagnes de QA précédentes restent datées et conservées, sans addition des nombres de tests d’anciennes révisions.

## Vérification du fichier installé

Le [builder dédié](../../../scripts/update-combat-next-wave-workbook-20261120.mjs) reconstruit le classeur par les API publiques de `@oai/artifact-tool`, depuis une extraction native contrainte de la base. L’[inspecteur XML](../../../scripts/inspect-combat-workbook-native.py) est utilisé uniquement en lecture ; aucun XLSX n’est écrit ou retouché par Python ou par modification directe du ZIP/XML.

Les vérifications observées sont les suivantes :

- **81 412 cellules natives comparées, zéro différence** : contenus, types, formules, styles effectifs et structure.
- **42 formules recalculées**, puis relues après export ; aucune erreur. Une modification temporaire de statut vérifie la variation des compteurs avant restitution de sa valeur initiale.
- Toutes les données des **10 tables** relues après réimport.
- Les **44 emplacements individuels** de dessins vérifiés dans Production et QA, avec les reçus et les archives ; les **47 nouveaux PNG actifs** revérifiés par taille et empreinte avant installation.
- Les **167 empreintes de preuves gelées** vérifiées avant publication du classeur, ainsi que le manifeste actif.
- **44 vues finales** inspectées par une revue indépendante, plus six vues initiales de comparaison. Une revue complémentaire inspecte 12 vues ciblées ; le responsable du lot en examine quatre.
- Les trois fichiers installés ensemble par le protocole de publication, puis vérifiés par empreinte. `combat-qa-evidence-0.7.0.json` reste identique à la base.

La revue indépendante n’a relevé aucun défaut concret. Un statut apparemment absent dans l’affichage réduit de certaines vues de Fonctionnalités a été confirmé visible dans les pixels du PNG ; cela n’a pas nécessité de modification du classeur. La distinction entre inspection de toutes les vues et revues ciblées est conservée dans [independent-visual-review.json](independent-visual-review.json), [targeted-visual-review.json](targeted-visual-review.json) et [visual-review.json](visual-review.json).

Les résultats complets sont dans [workbook-review.json](workbook-review.json), [native-comparison.json](native-comparison.json), [reimport-result.json](reimport-result.json) et [authoring-result.json](authoring-result.json). Les extractions natives sont liées par [native-snapshot-hashes.json](native-snapshot-hashes.json). Le [plan préparatoire](preparation.md) décrit le périmètre avant gel final.

### Vues de revue

- [Synthèse, partie haute](summary-top.png) et [partie basse](summary-bottom.png).
- [Quatre nouvelles familles](production-1.png), [dessins Café](production-2.png), [dessins Hommage](production-5.png), [dessins Fusion](production-12.png).
- [QA navigateur et mise à jour du suivi](qa-14.png).
- [Nouvelles références](references-new.png) et [définitions conservées](references-footer.png).
- [Arène, données](stage-left.png) et [arène, portée des références](stage-right.png).

## Portée des preuves du jeu

Les preuves gelées du lot enregistrent **419 tests Node réussis, zéro échec et deux constructions réussies**, **80 contrôles Canvas des costumes**, **six contrôles Canvas de l’arène**, **94 comparaisons de copies PNG**, **36 comparaisons de modules** et **5 725 fichiers Encore historiques intacts**. Les résultats sont importés depuis la [vérification consolidée du lot](../next-wave-20261120/verification.json) avec leurs empreintes ; la mise à jour du classeur ne se présente pas comme une nouvelle exécution de ces tests.

La tentative navigateur de cette vague, le **20 novembre 2026 à 14:51:46 UTC**, s’est arrêtée avant navigation sur le manifeste de préparation de Barnoir, avec **zéro contrôle réussi**. La QA indique **Non exécuté** et ne revendique aucune validation navigateur des quatre apparences finales. Les vérifications Canvas ne couvrent pas les interactions DOM, l’audio ni les périphériques physiques.

Aucune session Excel desktop, validation sur appareil physique, animation complète ni comparaison canonique de chaque plan n’est revendiquée. La publication GitHub et sa CI sont documentées séparément dans le [rapport principal](../../COMBAT_NEXT_WAVE_2026-11-20.md).

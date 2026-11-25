# Queenie — Gameoverse et SMG4, bases statiques

Cette production complète six apparences originales d’Encore, avec un portrait
de sélection et une garde entière par apparence : **12 PNG natifs**, un personnage
par image. Aucune animation ni pose d’action supplémentaire n’a été produite.

| Univers | Apparence | Images |
| --- | --- | ---: |
| Gameoverse | Hommage · Kit | 2 |
| Gameoverse | Résidente · Gardienne des sauvegardes | 2 |
| Gameoverse | Fusion · Reine de cristal | 2 |
| SMG4 | Hommage · SMG4 | 2 |
| SMG4 | Résidente · Réalisatrice des Showgrounds | 2 |
| SMG4 | Fusion · Reine de machinima | 2 |

Les sources visuelles de Queenie et les briefs préexistants du lot B guident
l’identité, les proportions, les matériaux et les palettes. Les designs sont
des créations originales pour le jeu. Ils ne sont pas présentés comme des
costumes canoniques de la série ni comme une certification de fidélité pixel
par pixel.

## Fichiers et provenance

Les fichiers finaux se trouvent sous
`assets/encore/crossovers/{gameoverse,smg4}/queenie/{hommage,resident,fusion}/`,
avec `stance.png` et `selection.png` pour chaque famille. Les gardes mesurent
1024 × 1536 px ; les portraits, 1254 × 1254 px. Les 12 fichiers représentent
15 690 866 octets.

La génération a utilisé l’outil intégré `image_gen`, avec transparence activée,
un appel par dessin. Les portraits utilisent leur propre garde comme référence.
Une première garde SMG4 hommage avait hérité du nœud rose de Ribbit ; une édition
native ciblée l’a retiré avant la production du portrait. Le candidat initial
n’est pas installé dans les assets du jeu.

Les PNG installés restent identiques aux sorties natives : aucune retouche,
recoloration, détourage ou redimensionnement par script n’a été appliqué.

## Contrôles exécutés

- Inspection visuelle des 12 sorties finales : silhouette de reine d’échecs,
  deux yeux mi-clos et cils inférieurs, gants détachés, absence de membres
  humains, cohérence portrait/garde et orientation droite.
- Décodage des 12 PNG RGBA, présence mesurée de pixels entièrement transparents
  et de pixels visibles.
- Bornes visibles au seuil alpha > 12 à l’intérieur des 12 images ; aucun
  contour retenu par ce seuil ne touche le bord. Marge minimale : six pixels.
- Comparaison SHA-256 de chaque fichier installé avec sa sortie native :
  12 égalités sur 12.

Le rendu en contexte de jeu et les tests du runtime sont réalisés par la passe
d’intégration commune ; ils ne sont pas revendiqués par ce sous-lot graphique.

## Preuves

- [Reçus de génération et prompts](generation-receipts.json)
- [Inventaire des fichiers et alpha](asset-inventory.json)
- [Revue explicite des six apparences](reviews.json)

Les JSON individuels conservent également les prompts successifs et le reçu
de correction du nœud rose.

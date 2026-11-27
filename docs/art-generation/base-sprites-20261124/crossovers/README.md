# Bases de Ribbit — six univers supplémentaires

Lot du 24 novembre 2026 : **18 créations originales Encore, deux dessins de base par tenue**, soit **36 PNG natifs vérifiés et distincts**. Le manifeste `manifest.json` contient les empreintes, références, cadrages et contrôles des 36 fichiers. `manifest-progress.json` est conservé comme état de vérification reproductible.

Les deux fichiers autorisés sont `selection.png` (portrait de sélection) et `stance.png` (posture de base en pied). Les 18 stances montrent le corps entier. Les portraits comprennent 15 dessins en pied et trois bustes Ultra Jump Mania ; ce dernier cadrage est un choix explicite de sélection, consigné dans les reçus et le manifeste. Chaque image provient d'un appel natif distinct à `image_gen__imagegen`, avec transparence demandée. Le portrait est redessiné à partir de sa stance inspectée ; il n'est pas une copie ni une transformation de cette dernière.

## Statut des créations et fidélité

Toutes les apparences de ce lot sont **originales**, avec `sourceKind: "original"`, `baseOnly: true`, `presentation: "static"` et `authoredSlots: ["selection", "stance"]`. Les références officielles établissent les couleurs, vêtements et éléments de l'univers qui servent d'ancrage. Elles ne prouvent pas l'existence d'un costume officiel de Ribbit dans cet univers.

La continuité avec Ribbit repose sur les deux yeux blancs saillants aux pupilles noires entaillées, les joues roses, la bouche de grenouille, le vert citron, le ventre crème, le motif de nœud rose, quatre doigts et trois orteils palmés. Les hommages conservent sa morphologie. Les résidents conservent le personnage tout en adaptant ses vêtements et accessoires. Les fusions réinventent son anatomie et ses matériaux ; elles restent identifiables par ses yeux, son visage et ses couleurs.

## Tenues et continuité visuelle

| Univers / segment de chemin | Hommage | Résident | Fusion | Famille Encore historique examinée |
| --- | --- | --- | --- | --- |
| Gaslight District / `gaslightdistrict` | Melancholy Hill : combinaison brune segmentée, col crème et crête orange de tissu | Gardien des écluses : manteau pétrole patiné, clef et lanterne | Têtard des brumes : nageoire caudale, branchies roses et ventre-lanterne organique | Gummigoo, trois styles |
| Knights of Guinevere / `knightsofguinevere` | Guinevere : coiffe bleue à étoiles, couronne et robe lavande | Réparateur des automates : tenue de travail, lunettes et clef de remontage | Automate des bassins : porcelaine fleurie, laiton et articulations mécaniques | Pomni, trois styles |
| Gameoverse / `gameoverse` | Kit : capuche brune, tunique jaune et manchettes à étoiles | Cartographe des portails : cape turquoise et or, carte et sacoche | Grenouille de cartouche : corps géométrique, segments rigides et rails bleus | Pomni, trois styles |
| Lackadaisy / `lackadaisy` | Rocky Rickaby : costume bleu pétrole, gilet doré et chapeau à bande jaune | Coursier du Little Daisy : casquette, gilet olive et sacoche de courrier | Chat des bayous : fourrure verte, oreilles félines, moustaches et queue rayée | Jax, trois styles |
| SMG4 / `smg4` | SMG4 : casquette et chemise bleues, salopette blanche et emblème caméra | Accessoiriste des Showgrounds : tenue de travail et outils attachés | Amphibien élastique : torse arrondi, membres souples et grandes mains/pattes | Jax, trois styles |
| Ultra Jump Mania / `ultrajumpmania` | Theo : chemise hawaïenne jaune, short corail et coiffe de palmier | Éclaireur du lagon : vêtements de feuilles, corde et coquillages | Têtard des cocotiers : torse de noix de coco, crête végétale et queue-feuille | Gummigoo, trois styles |

Les familles historiques ont servi à conserver le trait et la lisibilité d'Encore. Les attributs anatomiques de Jax, Pomni ou Gummigoo ne sont pas transférés par défaut à Ribbit. Pour l'hommage à Rocky, la tenue bleu pétrole et or est ancrée sur le présentoir officiel public, plus précis que le seul costume historique de Jax. Pour l'hommage à Mel, la figurine officielle fournit les volumes de la combinaison.

Convention des identifiants : `glitch-<series>-ribbit-<style>`.

Convention des fichiers : `assets/encore/crossovers/<series>/ribbit/<style>/<slot>.png`, avec `style` dans `hommage`, `resident`, `fusion` et `slot` dans `selection`, `stance`.

## Références primaires consultées

| Univers | Source primaire | Référence visuelle retenue |
| --- | --- | --- |
| Gaslight District | [Page GLITCH](https://www.glitchprod.com/gaslight-district), [Mel Animatez](https://glitchproductions.store/products/mel-animatez) | Figurine de Mel pour la combinaison ; affiches pour le contexte visuel |
| Knights of Guinevere | [Page GLITCH](https://www.glitchprod.com/knights-of-guinevere) | Visuel de Guinevere pour la coiffe bleue, les étoiles et la palette |
| Gameoverse | [Page GLITCH](https://www.glitchprod.com/gameoverse) | Illustration de Kit pour la tunique jaune, la capuche et les manchettes |
| Lackadaisy | [Page GLITCH](https://www.glitchprod.com/lackadaisy), [personnages](https://lackadaisy.com/characters.php), [présentoir Rocky](https://lackadaisy.store/products/rocky-standee) | Présentoir officiel public de Rocky ; bannière générale pour le contexte uniquement |
| SMG4 | [Collection de modèles de SMG4 Official](https://steamcommunity.com/sharedfiles/filedetails/?id=2756834379), [modèles 2023](https://steamcommunity.com/sharedfiles/filedetails/?id=2949486881) | Personnage bleu SMG4 à gauche, salopette blanche ; pas le personnage violet à droite |
| Ultra Jump Mania | [Pilote GLITCH](https://www.youtube.com/watch?v=HZoOzz1CrAk) | Miniature publique de Theo, coiffe végétale et chemise jaune fleurie |

`references/reference-catalog.json` conserve les URL directes, les pages sources, le rôle des images et leurs SHA-256. Chaque reçu associe les références effectivement passées à l'appel à leurs empreintes. Les images de recherche non passées à la génération sont identifiées comme contexte.

## Preuves et contrôles

Les reçus `<series>/<style>/<slot>.attempt-1.json` consignent le prompt, les références, le chemin natif retourné et les mesures initiales. Les fichiers `<slot>.json` ajoutent la validation visuelle et l'orientation réellement observée. Le résultat complet de chaque appel est conservé dans le store de l'agent sous la clef indiquée par `result_store_key`.

`install-native-base.py` copie les octets du PNG natif vers le chemin de jeu et vérifie leur égalité. Il ne retouche pas l'image. `audit-base-inventory.py` vérifie à nouveau les empreintes SHA-256 et Git, les 36 images distinctes, les références inchangées, le PNG RGBA, la transparence réelle, la silhouette correspondant au cadrage prévu au seuil alpha 12, les marges positives et l'absence de bord visible. La revue visuelle confirme le corps entier pour les 18 stances et les 15 portraits en pied ; elle ne l'affirme pas pour les trois bustes Ultra Jump Mania. Les marges réelles sont mesurées dans les reçus ; elles peuvent être inférieures aux marges demandées dans les prompts. Aucune marge artificielle n'est ajoutée.

Les blobs immuables publiés dans `darknigthmare/CainOS` sont recensés dans `github-blobs-<series>.json` et les reçus individuels `<slot>.github-blob.json`. Leur SHA Git retourné est comparé au SHA calculé sur le PNG natif local. La publication d'un arbre, d'un commit et d'une référence est centralisée séparément.

## Limites du lot

Ces deux dessins sont des **bases statiques**. Ils ne constituent pas un cycle d'animation et n'ajoutent aucun dessin d'introduction, d'attaque, de déplacement, de saut, de victoire ou de défaite. Une posture affichée dans plusieurs états du moteur reste le même fichier de base. Le lot n'affirme ni une équivalence canonique ni une reproduction image par image de scènes officielles.

Les 30 bases de Gaslight District, Knights of Guinevere, Gameoverse, Lackadaisy et SMG4 sont produites par `original_abstraction_art`. Les six bases Ultra Jump Mania ont été déléguées à l'agent racine avant tout lancement de cette famille, avec le même plan et les mêmes références. Les 36 sorties natives sont distinctes ; aucune double génération du même slot n'a été lancée.


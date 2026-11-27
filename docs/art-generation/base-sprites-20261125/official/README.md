# Cinq apparences officielles — bases statiques du 25 novembre 2026

Ce lot recrée les cinq apparences dont la génération avait été annoncée mais
dont aucun fichier récupérable ni commit n’a été retrouvé. Les dix PNG sont de
nouvelles générations, produites avec l’outil intégré `image_gen.imagegen`.
Ils ne sont pas présentés comme les octets du lot interrompu.

| Famille | Propriétaire | Composition conservée | Orientation native |
| --- | --- | --- | --- |
| `bunnyjax` | Jax | Lapin compact lavande, grands yeux noirs/jaunes, nœud rose et bouton jaune | Droite pour la garde, face pour la sélection |
| `maidribbit` | Ribbit | Robe de maid, nénuphar à encoche, jupe masquant le bas du corps | Face |
| `ghostlyvacuum` | Ghostly | Spectre à yeux en anneaux et aspirateur complet | Droite |
| `mingtrophy` | Ming | Mannequin, laurier, socle rouge/noir/or, plaque et carton | Face |
| `disappearingguymicrophone` | Disappearing Guy | Mannequin rouge sans visage, chapeau et microphone sur pied | Gauche (`nativeFacing: -1`) |

Chaque dossier `assets/encore/base-costumes/<famille>/` reçoit exactement
`selection.png` et `stance.png`. Aucun mouvement, frame d’animation, modification
de collision ou nouvelle technique n’est ajouté dans ce sous-lot.

## Vérification des images

- Dix PNG individuels, dix empreintes distinctes, **9 205 603 octets**.
- RGBA natif avec transparence réelle pour chaque image.
- Neuf fichiers de 1 254 × 1 254 pixels ; sélection de Ming de 1 173 × 1 341.
- Silhouettes entièrement contenues dans le cadre au seuil alpha 12 du moteur.
- Pixels natifs d’alpha très faible conservés ; maximum d’alpha sur les bords
  égal à zéro ou un. Aucun détourage, redimensionnement ou peinture ultérieure.
- Dix fichiers copiés octet pour octet depuis les sorties de génération.
- Les images ont été examinées individuellement face aux photos primaires.
  Cette inspection ne remplace pas la revue du rendu en jeu menée par
  l’intégrateur et ne certifie pas une superposition canonique pixel par pixel.

La première sélection Maid Ribbit conservait la sangle commerciale et un cadrage
trop serré. Une correction avec la garde retenue comme cible a retiré la sangle,
préservé le nénuphar et dégagé la silhouette. Elle seule est installée. Aucun pied
ou vêtement caché n’est inventé sous la jupe.

Les portails, blocs, bulles et sols des photos Digital Friends ne font pas partie
des personnages retenus. L’aspirateur, le trophée et le microphone restent dans
leurs compositions respectives.

## Preuves et périmètre

[manifest.json](manifest.json) contient les définitions, références, prompts,
empreintes, dimensions, alpha, traits observés et limites. Les reçus textuels
et prompts de génération sont dans `generated/`. Les photos et métadonnées
officielles consultées sont dans `references/`.

Les références attestent des designs de produits dérivés GLITCH. Aucune nouvelle
apparition dans un épisode ni propriété canonique de combat n’est affirmée.
Les PNG sont adaptés en illustrations 2D pour Encore. L’activation runtime,
le manifeste hors ligne et les deux builds sont gérés par la passe d’intégration
partagée, hors de ce dossier isolé.

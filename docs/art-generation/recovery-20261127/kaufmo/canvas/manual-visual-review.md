# Inspection visuelle des six familles Kaufmo

Date : 27 novembre 2026. Version hors-ligne vérifiée : `0.7.0-b6d11b136010`.

La [planche d’ensemble](kaufmo-bases-overview.jpg), assemblée à partir des six JPEG de workers, a été ouverte et inspectée. Elle montre chaque portrait distinct, puis la garde dans les deux directions. Le rendu utilise les PNG propres aux six familles et le renderer de production ; les sprites finaux n’ont pas été modifiés.

| Famille | Constat sur les captures |
| --- | --- |
| Murder Drones · Hommage · Uzi | Chapeau et mains entiers, visage de Kaufmo lisible, hoodie noir/violet et motif concordants entre portrait et garde. Les chaussures sont présentes dans les deux sens. |
| Murder Drones · Résident · Technicien des abris | Veste ocre, éléments bleus, boutons et sacoche cohérents. Le damier reste visible autour du portrait, sans rectangle de fond ni halo apparent. |
| Murder Drones · Fusion · Drone de parade | Corps de drone complet et lisible, coque jaune et visière violette distinctes des apparences vestimentaires. Membres et pieds restent entiers après inversion. |
| Meta Runner · Hommage · Tari | Hoodie cyan/blanc, zigzags et trois pompons concordants. Visage, gants et silhouette de Kaufmo préservés. |
| Meta Runner · Résident · Technicien des replays | Avant-bras cybernétique et main en gant ordinaire se distinguent dans le portrait et les gardes. La garde opposée est le miroir de la même illustration. |
| Meta Runner · Fusion · Avatar de synchronisation | Facettes bleues/blanches, panneau central cyan, interface d’avant-bras et nœuds rouges cohérents. Le visage clair permet de distinguer cette fusion du drone à visière. |

Les silhouettes de garde mesurent environ **235 pixels de haut** dans le renderer, pour une largeur visible de **132,86 à 141,00 pixels** selon la pose. Le contrôle des matrices vérifie une échelle uniforme. Aucun chapeau, main ou pied n’est coupé dans les captures ; les portraits se terminent intentionnellement à la taille. Les ombres au sol visibles dans les gardes proviennent du renderer. Le cadrage et les proportions ne montrent pas de déformation apparente.

## Résultat technique associé

- Six processus Node séparés, exécutés en séquence : six sorties normales et six bilans `pass: true`.
- Douze dessins natifs, six portraits, **120 contrôles état/direction** et **360 rendus d’état** au total.
- Chemins exacts, SHA des PNG, inscription au manifeste hors-ligne et conservation des empreintes du runtime vérifiés pendant le lot.
- Garde inchangée aux temps 0 et 600 ainsi qu’avec les mouvements réduits, pour dix états et les deux directions.
- Pic mémoire d’un worker : **136 855 552 octets** (environ 130,52 Mio).

Le périmètre comprend uniquement les six nouvelles familles Kaufmo. Cette revue native Canvas/Skia vérifie les fichiers et leur présentation ; elle ne teste pas le navigateur, les commandes, l’audio ou le service worker. Elle documente des bases statiques originales de crossover, sans certification d’apparition canonique 1:1 ni nouvelles animations.

# Kaufmo — revue Canvas ciblée

Version hors-ligne : `0.7.0-b6d11b136010`.

6 familles, 12 dessins natifs, 120 contrôles état/direction et 360 rendus d’état.

Chaque famille passe dans un processus Node distinct, en séquence. Les contrôles vérifient le chemin et le SHA du PNG propre à la famille, le portrait distinct, les deux sens, l’échelle uniforme, l’ancre au sol et la réutilisation statique de la garde aux temps 0 et 600 puis avec mouvements réduits. Les règles et données de combat restent inchangées.

La [planche d’ensemble](kaufmo-bases-overview.jpg) est assemblée uniquement à partir des six JPEG des workers. Le [bilan JSON](base-canvas-review.json) conserve les empreintes des sources, dont le module de continuation. La [revue visuelle](manual-visual-review.md) documente l’inspection visuelle de ces captures.

Ce contrôle natif Skia n’exécute pas le navigateur, les entrées, l’audio ni le service worker. Il documente douze dessins statiques ; il ne certifie pas une animation ou une apparition canonique.

- [Murder Drones · Hommage · Uzi](base-glitch-murderdrones-kaufmo-hommage.jpg)
- [Murder Drones · Résident · Technicien des abris](base-glitch-murderdrones-kaufmo-resident.jpg)
- [Murder Drones · Fusion · Drone de parade](base-glitch-murderdrones-kaufmo-fusion.jpg)
- [Meta Runner · Hommage · Tari](base-glitch-metarunner-kaufmo-hommage.jpg)
- [Meta Runner · Résident · Technicien des replays](base-glitch-metarunner-kaufmo-resident.jpg)
- [Meta Runner · Fusion · Avatar de synchronisation](base-glitch-metarunner-kaufmo-fusion.jpg)

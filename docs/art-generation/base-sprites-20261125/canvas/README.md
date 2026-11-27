# Bases statiques — revue Canvas du 25 novembre 2026

**14 apparences, 28 dessins de base, 280 contrôles état/direction et 840 appels de dessin réels : tous réussis.** Les 14 portraits sont aussi vérifiés et les 14 planches complètes ont été inspectées individuellement. Aucune découpe visible ni mauvaise source relevée.

[Aperçu compact](bases-overview.jpg) · [Rapport détaillé et empreintes SHA-256](base-canvas-review.json)

## Périmètre et méthode

Le périmètre contient exactement les 14 définitions ajoutées par `CONTINUATION_BASE_DEFINITIONS`, sous la version hors ligne `0.7.0-4ad2d50212cf`. Chaque famille a été rendue par le renderer Canvas2D de production, dans son propre processus Node séquentiel, avec `--expose-gc --max-old-space-size=128`.

Pour chaque apparence, les dix états (garde, introduction, attaque, attaque lourde, coup reçu, marche, saut, accroupissement, victoire et défaite) sont contrôlés dans les deux directions. Chaque combinaison est réellement dessinée au temps 0, au temps 600, puis au temps 600 avec mouvements réduits : 14 × 10 × 2 × 3 = 840 appels. Les deux fichiers demandés, leurs empreintes, le portrait dédié, l'échelle uniforme, l'ancre et la garde statique inchangée sont vérifiés. Aucun ancien atlas ni dessin de pose n'est demandé.

Les 12 empreintes de sources sont identiques entre tous les workers et correspondent encore aux fichiers au moment de l'agrégation. Les 28 PNG natifs sont inchangés et leurs empreintes ont été revérifiées. L'aperçu est assemblé uniquement à partir des JPEG de revue.

## Revue visuelle

Les portraits, la garde droite et la garde gauche ont été vus pour chacune des 14 planches. Le micro de Disappearing Guy est du bon côté après application de `nativeFacing: -1`. Les inscriptions du trophée de Ming sont inversées avec l'image dans la garde gauche ; c'est la conséquence du miroir statique. Les neuf Queenie gardent leur anatomie de pièce d'échecs et leurs mains détachées.

| Apparence | Planche et résultat |
| --- | --- |
| Bunny Jax | [bunnyjax](base-bunnyjax.jpg) — conforme |
| Ribbit · soubrette | [maidribbit](base-maidribbit.jpg) — conforme |
| Ghostly · aspirateur | [ghostlyvacuum](base-ghostlyvacuum.jpg) — conforme |
| Ming · trophée | [mingtrophy](base-mingtrophy.jpg) — conforme |
| Disappearing Guy · micro | [disappearingguymicrophone](base-disappearingguymicrophone.jpg) — conforme |
| Queenie · Murder Drones · hommage | [glitch-murderdrones-queenie-hommage](base-glitch-murderdrones-queenie-hommage.jpg) — conforme |
| Queenie · Murder Drones · résidente | [glitch-murderdrones-queenie-resident](base-glitch-murderdrones-queenie-resident.jpg) — conforme |
| Queenie · Murder Drones · fusion | [glitch-murderdrones-queenie-fusion](base-glitch-murderdrones-queenie-fusion.jpg) — conforme |
| Queenie · Meta Runner · hommage | [glitch-metarunner-queenie-hommage](base-glitch-metarunner-queenie-hommage.jpg) — conforme |
| Queenie · Meta Runner · résidente | [glitch-metarunner-queenie-resident](base-glitch-metarunner-queenie-resident.jpg) — conforme |
| Queenie · Meta Runner · fusion | [glitch-metarunner-queenie-fusion](base-glitch-metarunner-queenie-fusion.jpg) — conforme |
| Queenie · Sunset Paradise · hommage | [glitch-sunsetparadise-queenie-hommage](base-glitch-sunsetparadise-queenie-hommage.jpg) — conforme |
| Queenie · Sunset Paradise · résidente | [glitch-sunsetparadise-queenie-resident](base-glitch-sunsetparadise-queenie-resident.jpg) — conforme |
| Queenie · Sunset Paradise · fusion | [glitch-sunsetparadise-queenie-fusion](base-glitch-sunsetparadise-queenie-fusion.jpg) — conforme |

## Limites

Cette preuve native Skia ne remplace pas les tests navigateur, clavier, audio, service worker ou sur appareil physique. Réutiliser une garde ne crée pas neuf dessins d'action supplémentaires et ne constitue pas une animation. Cette revue contrôle le rendu et les sources ; elle ne certifie pas une fidélité canonique 1:1 ou une anatomie cachée.

Le script `collect-review.mjs` reconstitue ce rapport à partir des résultats individuels existants. Les observations visuelles consignées proviennent de la revue séparée, pas d'une comparaison automatisée de pixels.

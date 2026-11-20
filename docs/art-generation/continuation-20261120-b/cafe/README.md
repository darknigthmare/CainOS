# Café — Kinger et Pomni, continuation du 20 novembre 2026

Les deux familles `cafekinger` puis `cafepomni` sont complètes et actives : **22 PNG natifs**, soit onze dessins indépendants par tenue, pour **23 978 492 octets**. Tous les fichiers installés sont des copies exactes des sorties `image_gen.imagegen` inspectées, avec leur alpha natif. Les sources restent archivées dans `generated/`.

## Qualification et portée

La référence principale est l’illustration officielle DECOTTO by Animate Café publiée par Animate Holdings dans [son communiqué PR TIMES](https://prtimes.jp/main/html/rd/p/000008857.000016756.html). Les deux images originales, leurs extractions rectangulaires et leurs empreintes figurent dans [les références](references/sources.json). La comparaison des 51 apparences d’archive et des 40 ajouts Circus antérieurs est décrite dans [candidate-review.md](candidate-review.md).

- **Kinger Café** conserve sa pièce d’échecs beige, son monocle à chaîne, sa queue-de-pie violette, son gilet à losanges et sa base conique entière. Les deux gants flottants s’appuient sur l’anatomie existante et une référence officielle distincte : les mains ne sont pas clairement attribuables dans l’affiche Café. Aucun bras humain, pied ou jambe n’est ajouté.
- **Pomni Café** conserve le bonnet rouge et bleu nuit à grelots jaunes, le bandeau blanc froncé, la robe bleu nuit, le tablier à nœuds bleu et rouge et les chaussures rouge et bleu nuit. Elle est distincte de l’ancien `maidpomni`, qui reste inchangé. La zone de plastron partiellement cachée et le dos non montré ne sont pas présentés comme des vues canoniques nouvelles.

Les poses sont des adaptations statiques originales pour le jeu. Elles ne certifient aucune apparition en épisode, correspondance 1:1, animation complète ou validation dans un navigateur. Cette qualification ne ferme pas le candidat distinct `maidribbit` Pendantz.

## Production et revue

Chaque famille comporte `selection`, `stance`, `intro`, `attack`, `heavy`, `hit`, `walk`, `jump`, `crouch`, `victory` et `defeat`. Les définitions ont été figées avant génération dans [definition-freeze.json](definition-freeze.json). Les jobs conservent les prompts exacts, l’ordre des références et leurs SHA ; chaque reçu associe sa copie native aux dimensions, à l’alpha, à l’orientation droite et à sa revue visuelle.

La production totalise 24 appels : 22 résultats retenus, un résultat refusé pour cadrage inférieur et un appel bloqué sans image. Le premier essai de défaite Kinger est archivé intégralement dans `generated/cafekinger/attempts/defeat-framing-01/` ; la correction a été générée nativement, sans ajout de marge local. L’ancienne demande de garde bloquée est archivée dans `attempts/stance-blocked-01/` ; une pose d’attente calme a ensuite été produite.

Les 22 natifs ont été inspectés avec des compositions alpha sur fonds clair et sombre, puis sur deux planches d’ensemble. La revue croisée root confirme la cohérence des silhouettes et accessoires. Les couleurs présentes sous alpha nul n’ont pas été supprimées ; aucun halo diffus n’est visible dans les compositions examinées. Certaines marges natives sont étroites, mais toutes les bornes alpha > 12 sont strictement internes.

- [Planche Kinger](review/cafekinger/family-alpha-overview.jpg)
- [Planche Pomni](review/cafepomni/family-alpha-overview.jpg)
- [Revue native finale](review/native-final-review.json)
- [Revue croisée des deux familles](review/root-family-cross-review.json)

## Intégration et contrôles

L’intégration a ajouté les tenues aux positions 472 et 473, après les **472 costumes historiques intégralement conservés**. Les 40 familles Circus et les trois crossovers Murder Drones préexistants gardent leurs objets et leur ordre. La fonction d’ordre partagée reste inchangée. À l’activation Café, le catalogue contient 474 costumes et les ajouts Circus totalisent 42 familles / 462 dessins ; ces comptes datés précèdent l’ajout Meta Runner parallèle.

Le script [integrate-native.py](integrate-native.py) valide les deux définitions figées, chaque job, chaque référence, chaque copie originale et les propriétaires avant toute installation. La fixture `../workbook/costume-prefix-baseline.json` est verrouillée par SHA `a069c06ef34541b965169f12db4169e40fe16fbbf2381bbffa99b32ce29058cd` ; le JSON des 472 costumes conserve SHA `5dafc529d6121a2850b7bfad54684f57e7223bfd29c2051b3687c00bed057685`.

- [Achèvement des deux familles](generation-completion.json)
- [Inventaire des 22 assets](asset-inventory.json)
- [Preuve d’intégration](integration-proof.json)
- [Neuf contrôles ciblés réussis](targeted-test-evidence.json)

Les contrôles ciblés couvrent propriétaires, kits, sauvegardes, replays, références, copies et préfixe historique. Le test de publication du paquet hors ligne attend sa régénération globale ; ce dossier n’exécute ni build global, ni modification du classeur, ni validation navigateur. Les galeries Canvas de la vague globale constituent une étape de revue distincte.

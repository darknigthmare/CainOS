# Ribbit — Café : qualification d’une nouvelle apparence

20 novembre 2026. **Décision : référence suffisante pour onze poses de jeu ; famille `caferibbit` distincte du Pendantz `maidribbit`.**

## Source primaire nouvelle

Le [communiqué publié par Animate Holdings](https://prtimes.jp/main/html/rd/p/000008857.000016756.html) présente les illustrations et produits de la collaboration DECOTTO by Animate Café. La [page officielle de l’événement](https://www.animatecafe.jp/event/ac000791) confirme la collaboration. L’affiche et le panneau de produits ont été téléchargés depuis les liens publics du communiqué puis inspectés. Leurs JPEG natifs sont conservés sans réencodage sous `references/caferibbit/` ; URLs, SHA, dimensions et extrait de repérage sont dans [sources.json](references/caferibbit/sources.json).

L’affiche mesure réellement 1000 × 707 pixels ; le panneau 1000 × 708 pixels. Le détail Ribbit est un simple extrait de 185 × 410 pixels, sans agrandissement ni reconstruction. Le panneau reprend le même dessin sur plusieurs supports : il ne constitue pas un angle indépendant du personnage. Le CDN direct d’Animate a répondu HTTP 403 à une tentative ; aucune reprise de cette requête ni contournement n’a été effectué. Les JPEG archivés proviennent de la publication primaire accessible sur PR TIMES.

## Observations sur le corps entier

- Tête de grenouille verte, museau menthe, yeux blancs très grands à pupilles noires découpées et paupières foncées. Coiffe blanche avec nœuds bleu nuit latéraux ; ruban rose au cou.
- Robe courte bleu nuit, tablier et plastron blancs à volants. Cœur bleu nuit sur le plastron, grands nœuds bleu nuit sur le tablier. Manchettes blanches festonnées et mains vertes.
- Les deux jambes vertes, les longues chaussettes blanches à revers festonnés et les deux chaussures fermées bleu nuit sont visibles. De petits accents roses figurent aux revers et aux bords des semelles. Aucun pied n’est choisi par extrapolation du porte-clés.

## Portée de l’adaptation

La famille reprend ces vêtements dans le style élancé du sprite Ribbit existant. Le plateau et le dessert restent des accessoires de présentation et seront exclus des poses ; ce choix laisse lisibles les deux bras. Les petits ornements ne sont pas surdéfinis au-delà de la résolution disponible. Les vues arrière absentes ne sont pas déclarées observées.

La robe, les nœuds et le plastron de cette illustration diffèrent du porte-clés Maid, dont le corsage porte un motif vert et dont les pieds restent masqués. **`maidribbit` n’est pas clôturé ni renommé.** Cette référence commerciale établit son propre dessin, pas une présence dans la série. Les onze poses à produire sont des adaptations statiques originales pour le fan-game.

La convention active du dépôt est `assets/encore/selection/<id>.png`, `assets/encore/stance/<id>.png` puis `assets/encore/poses/<id>/<slot>.png` ; aucune branche de fichiers `assets/encore/costumes/` n’est créée. Les originaux et reçus seront d’abord gelés dans `generated/caferibbit/`, avant intégration par root.

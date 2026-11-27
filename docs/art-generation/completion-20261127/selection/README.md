# Sélection statique : choix, retour et chargement indépendant

Cette tranche applique la partie statique de `EN-E1-SELECTION-CONTRACT` et des
exigences `EN-G32` au menu existant. Les 64 artistes gardent leurs portraits,
leurs costumes et leurs techniques. Les identifiants `EN-E1-SELECT-*` et
`EN-E1-DESELECT-*` renvoient aux briefs de la bible ; leurs gestes d’entrée et de
sortie restent des dessins et animations à produire, sans être déclarés livrés.

## Comportement jouable

- Cliquer ou valider une carte retient immédiatement le choix. Le départ en
  combat ne nécessite aucune confirmation supplémentaire.
- La région accessible persistante annonce le côté, l’artiste et sa tenue.
  Réactiver exactement le même choix ne répète pas l’annonce.
- Chaque côté peut annuler son dernier changement d’artiste ou de tenue. Le
  retour rétablit l’ID exact de l’apparence précédente, conserve l’autre côté et
  le décor, puis place le focus sur la carte de l’artiste rétabli.
- Les deux badges J1 et J2 restent visibles lorsque les deux côtés choisissent
  le même artiste. Leurs costumes et leurs historiques restent indépendants.
- Le portrait indique sa préparation ou son indisponibilité. Un échec d’image
  conserve le choix logique ; une nouvelle requête peut retenter le chargement.
- Un ancien chargement ne peut pas modifier le statut d’un portrait plus récent.
  Sortir du menu ou partir en combat invalide les requêtes et efface les deux
  historiques temporaires. Ces données n’entrent jamais dans le profil ou replay.

Le rendu reste fixe, y compris avec le mouvement réduit. Aucune posture n’est
déformée, aucun cycle n’est ajouté et aucune voix de personnage n’est fabriquée.
Le texte d’état ne décrit pas comme exécuté un geste seulement écrit dans la bible.

## Contrat avec le moteur existant

| Responsabilité | Fichiers et points d’intégration |
| --- | --- |
| Choix et annulation | `SelectionPresentation` dans `combat/selection-presentation.mjs` ; deux états en mémoire, aucune persistance |
| Menu et actions | `selectArtist`, `undoSelection`, `renderSelect`, `handleClick` et changement natif de costume dans `combat/app.mjs` |
| Chargement | `paintPortrait` conserve `drawPortrait` et ses sources natives ; jeton par côté et contrôle de connexion du Canvas |
| Cycle de vie | `setScreen`, `chooseMode` et `startMatch` invalident l’état transitoire aux changements de contexte |
| Accessibilité | région `role=status` hors de `main` dans `combat/index.html`, focus existant et bouton d’annulation de 44 px minimum |
| Affichage | ajouts ciblés dans `combat/style.css`, sans nouvelle animation ni mouvement |
| Provenance | `docs/bible/extensions-characters.json`, 64 associations de sélection/désélection vérifiées |

La sélection ne crée pas de verrou de droit, de nouveau mode ou de système de
tag. Le modèle complet à huit états, les réactions corporelles individuelles,
le taunt et la sélection d’une équipe restent les travaux distincts décrits
dans la bible.

## Vérification

Les preuves de cette tranche sont enregistrées dans `verification.json`. Les
tests Node couvrent notamment les deux costumes d’un miroir, l’annulation
pendant un chargement, les réponses tardives ou dupliquées, la reprise après
erreur et les changements de contexte. Le parcours navigateur étend la suite
accessibilité existante avec des entrées clavier réelles, une réponse image
retardée, le retour au choix exact et le menu à 390 px.

Les **11 tests Node passent**. La tentative navigateur locale reste incomplète :
Chromium 158 a été arrêté par `SIGKILL` après deux contrôles du parcours ciblé
(miroir et annulation indépendante avec focus). Le parcours complet avait
atteint huit contrôles avant son arrêt. Les preuves conservent leurs empreintes
et leur état d’échec technique ; elles ne certifient pas les parcours restants.

La relecture indépendante n’a trouvé aucun défaut bloquant dans le comportement
de sélection. Elle a identifié un problème dans le montage des tests réseau :
le service worker pouvait capter la réponse avant `page.route`. Les deux
contextes desktop bloquent désormais les service workers pour ces parcours,
selon la [documentation de Playwright](https://playwright.dev/docs/api/class-page#page-route).
La suite hors-ligne conserve ses propres contrôles de cache et de service worker.
Cette correction n’a pas fait l’objet d’une nouvelle exécution locale complète.

Le parcours ciblé est enregistré dans la CI comme 22e suite navigateur, en plus
des 21 suites précédentes. Le contrôle complet des 64 artistes reste conservé.
Le résultat de la CI du nouvel état des sources reste nécessaire.

La référence CI précédente reste séparée dans
[`baseline-ci.json`](../qa/baseline-ci.json) : ses 473 tests Node et 477
assertions navigateur portent sur le commit publié `cc972c8`, avant ces ajouts.
